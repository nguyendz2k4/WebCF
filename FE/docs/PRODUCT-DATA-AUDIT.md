# AURA COFFEE — PRODUCT DATA & SCHEMA AUDIT
**Document:** `docs/PRODUCT-DATA-AUDIT.md`  
**Version:** 1.0  
**Status:** Completed Architectural & Data Model Audit  
**Target Scope:** Product Catalog (`/products`), Product Detail Pages (`/products/[slug]`), and B2B Dossier Flow  
**Reference Document:** `docs/PRODUCT-PAGE-DESIGN-BRIEF.md`  
**Source Code Inspected:** `src/types/index.ts`, `src/components/store/*`, `src/stores/AppContext.tsx`

---

## 1. EXECUTIVE AUDIT SUMMARY

This document delivers an exhaustive audit of the current codebase data structures against the target requirements defined in the **Product Catalog Design Brief (`docs/PRODUCT-PAGE-DESIGN-BRIEF.md`)**.

### Summary of Findings
1. **Model Fragmentation:** The existing codebase contains isolated, homepage-specific interfaces (`EquipmentTier`, `CoffeeBean`, `SolutionPackage`) defined in `src/types/index.ts`. There is no unified, polymorphic `Product` model.
2. **Missing Essential B2B Fields:** Critical procurement attributes required by the catalog—such as `brand`, `slug`, `sku`, `inStock`, `leadTime`, `priceType`, and `domain`—are completely absent in existing types.
3. **Category Deficit:** The current data only represents 3 espresso machines (with generic names) and 4 coffee beans. Entire catalog domains and categories (grinders, roasters, barista gear, accessories, syrups, sauces, powders, matcha, tea, chocolate) are missing.
4. **Filter Readiness:** Only **2 out of 11 proposed filter dimensions** are currently supported by existing data without structural modification. 9 filter dimensions require schema additions or normalization.

---

## 2. CURRENT VS. TARGET DATA MODEL COMPARISON

```
CURRENT HOMEPAGE-BOUND DATA MODEL                     TARGET UNIFIED CATALOG DATA MODEL
┌──────────────────────────────────────┐             ┌────────────────────────────────────────────────────────┐
│ EquipmentTier (src/types/index.ts)  │             │ BaseProduct (src/types/product.ts)                     │
│ - 3 items hardcoded in component    │             │ ├── id, slug, sku, domain, name, brand, shortDesc      │
│ - Flat strings for specs            │             │ ├── price, formattedPrice, priceType, images[], inStock│
│ - No brand, no slug, no category    │             │ └── leadTime, isFeatured, createdAt                    │
└──────────────────────────────────────┘             └──────────────────────────┬─────────────────────────────┘
                                                                                │
┌──────────────────────────────────────┐                                ┌───────┴───────┐
│ CoffeeBean (src/types/index.ts)      │                                ▼               ▼
│ - 4 items hardcoded in component     │                 ┌───────────────────────┐ ┌──────────────────────────┐
│ - Rich bean specs, but isolated      │                 │ EquipmentProduct      │ │ IngredientProduct        │
│ - No brand, no slug, single image    │                 │ - category (5 types)  │ │ - category (8 types)     │
└──────────────────────────────────────┘                 │ - specs { groups,     │ │ - origin, subRegion      │
                                                         │     boiler, pump,     │ │ - altitude, process      │
┌──────────────────────────────────────┐                 │     power, voltage,   │ │ - roastProfile, cupping  │
│ CartItem (src/types/index.ts)        │                 │     dimensions, ... } │ │ - flavorNotes[], shelfLife│
│ - Generic bucket for cart drawer     │                 │ - suitableFor[]       │ │ - packaging { unit, case }│
└──────────────────────────────────────┘                 └───────────────────────┘ └──────────────────────────┘
```

---

## 3. IDENTIFICATION OF CORE ENTITIES & ATTRIBUTES

### 3.1. Product Entities

| Entity Name | Current State in Codebase | Target State (Design Brief) | Status / Gap |
|---|---|---|---|
| **Base Product** | Non-existent. No common parent interface. | `BaseProduct` in `src/types/product.ts` containing common identity, commercial, and media attributes. | **Missing** |
| **Equipment Product** | `EquipmentTier` in `src/types/index.ts` (3 mock records in `EquipmentConfigurator.tsx`). | `EquipmentProduct` extending `BaseProduct` with `domain: 'equipment'` and structured `specs`. | **Needs Refactoring** |
| **Ingredient Product** | `CoffeeBean` in `src/types/index.ts` (4 mock records in `BeansSelection.tsx`). | `IngredientProduct` extending `BaseProduct` with `domain: 'ingredients'` handling beans + 7 other categories. | **Needs Refactoring** |
| **Turnkey Solution** | `SolutionPackage` in `src/types/index.ts` (3 mock records in `SolutionsSection.tsx`). | Kept for homepage & project builder; maps into Cart/Dossier. | **Retained for Solutions** |
| **Cart / Dossier Item** | `CartItem` in `src/types/index.ts` (flat payload). | Updated to accept polymorphic product properties or product reference. | **Minor Update** |

---

### 3.2. Product Categories & Taxonomy

#### Domain 1: Coffee Equipment (`domain: 'equipment'`)
| Target Category Slug | Display Name | Current Data Coverage | Missing Data / Taxonomy Gap |
|---|---|---|---|
| `espresso-machines` | Máy Pha Cà Phê | 3 records (`eq_home_office`, `eq_medium_cafe`, `eq_specialty_chain`) | Missing 1-Group, 2-Group, 3-Group classification; missing commercial brand catalog. |
| `coffee-grinders` | Máy Xay Cà Phê | **0 records** | Completely missing on-demand, single-dose, and industrial shop grinders (Mahlkönig, Mazzer). |
| `coffee-roasters` | Máy Rang Cà Phê | **0 records** | Completely missing sample roasters (500g-1kg) and shop roasters (3kg-15kg) (Giesen). |
| `barista-gear` | Dụng Cụ Barista & Brewing | **0 records** | Completely missing tampers, WDT tools, V60, Chemex, scales, and milk pitchers. |
| `accessories` | Phụ Kiện & Bảo Dưỡng | **0 records** | Completely missing water filtration systems (BWT/Everpure), portafilters, and cleaning chemicals (Cafiza). |

#### Domain 2: Beverage Ingredients (`domain: 'ingredients'`)
| Target Category Slug | Display Name | Current Data Coverage | Missing Data / Taxonomy Gap |
|---|---|---|---|
| `coffee-beans` | Hạt Cà Phê Đặc Sản | 4 records (`bean_caudat_typica`, `bean_aura_blend`, `bean_ethiopia_yirgacheffe`, `bean_sonla_fine_robusta`) | Missing international micro-lots (Colombia Geisha, Kenya AA) and blend variations. |
| `syrups` | Siro Pha Chế Cao Cấp | **0 records** | Completely missing premium syrup line (1883 Routin, Monin, Maison Routin). |
| `sauces` | Sốt Pha Chế Cao Cấp | **0 records** | Completely missing dark chocolate, salted butter caramel, and white mocha sauces. |
| `powders` | Bột & Nguyên Liệu Cốt | **0 records** | Completely missing frappe base, non-dairy creamer base, vanilla powders. |
| `matcha` | Matcha & Houjicha Nhật Bản | **0 records** | Completely missing Ceremonial Grade Uji and Barista Grade matcha. |
| `chocolate` | Socola & Cacao Nguyên Chất | **0 records** | Completely missing fermented Đắk Lắk cacao powder and single-origin chocolate drops. |
| `tea` | Trà Đặc Sản | **0 records** | Completely missing Four Seasons Oolong, Ceylon Black Tea, and cold brew floral teas. |
| `other` | Nguyên Liệu Khác | **0 records** | Completely missing toppings and specialty concentrates. |

---

### 3.3. Product Attributes Breakdown

#### Equipment Attributes
| Attribute Field | Current Property | Target Schema Property | Current Type | Target Type | Gap & Remediation |
|---|---|---|---|---|---|
| Machine Groups | Embedded in `name`/`capacity` | `specs.groups` | N/A | `number` (1, 2, 3) | **Missing.** Add explicit numeric property for faceted filtering. |
| Boiler Type | `boiler` | `specs.boiler` | `string` | `string` | **Unnormalized.** Convert unstructured descriptions to structured identifiers (e.g. Dual PID, Multi-Boiler T3). |
| Boiler Capacity | Embedded in `boiler` | `specs.boilerCapacity` | N/A | `string` (e.g. "8.5L", "11L") | **Missing.** Extract capacity into dedicated field. |
| Pump System | `pump` | `specs.pump` | `string` | `string` | Exists on `EquipmentTier`. Map directly to `specs.pump`. |
| Power Output | `power` | `specs.power` | `string` (combined) | `string` (e.g. "3.500W") | Split power from voltage into clean attributes. |
| Electrical Voltage | Embedded in `power` | `specs.voltage` | N/A | `'220V' \| '380V' \| '220V/380V'` | **Missing.** Required for electrical infrastructure filtering. |
| Dimensions | N/A | `specs.dimensions` | N/A | `string` (W x D x H mm) | **Missing.** Required for quick spec drawer. |
| Weight | N/A | `specs.weight` | N/A | `string` (kg) | **Missing.** Required for bar load planning. |
| Warranty Terms | `warranty` | `specs.warranty` | `string` | `string` | Exists on `EquipmentTier`. Map to `specs.warranty`. |
| Target Segment | `tabKey` (single key) | `suitableFor` | `'home' \| 'medium' \| 'chain'` | `('home' \| 'boutique-cafe' \| 'high-volume' \| 'roastery')[]` | **Needs Multi-Select Array.** A machine can suit both boutique cafes and cupping labs. |

#### Ingredient Attributes
| Attribute Field | Current Property | Target Schema Property | Current Type | Target Type | Gap & Remediation |
|---|---|---|---|---|---|
| Provenance / Origin | `origin` | `origin` | `string` | `string` | Exists on `CoffeeBean`. Needs slugification (`da-lat`, `son-la`). |
| Terroir / Sub-region | `subRegion` | `subRegion` | `string` | `string` | Exists on `CoffeeBean`. |
| Farm Altitude | `altitude` | `altitude` | `string` | `string` | Exists on `CoffeeBean` (e.g. "1.650m"). |
| Processing Method | `process` | `process` | `string` | `string` | Exists on `CoffeeBean` (e.g. "Anaerobic Natural 72h"). |
| Roast Profile | `roastProfile` | `roastProfile` | `'Light' \| 'Medium' \| 'Medium-Dark' \| 'Dark'` | Same enum | Exists on `CoffeeBean`. Ready for filtering. |
| SCA Cupping Score | `cuppingScore` | `cuppingScore` | `number` (e.g. 87.2) | `number` | Exists on `CoffeeBean`. Ready for sorting & filtering. |
| Flavor Profile | `flavorNotes` | `flavorNotes` | `string[]` | `string[]` | Exists on `CoffeeBean`. Ready for search & sensory tags. |
| Unit Packaging | `bagWeight` | `packaging.unitSize` | `string` ("1.000g") | `string` ("1kg", "750ml") | Standardize property name to accommodate syrups, matcha, liquids. |
| Case Packaging | N/A | `packaging.caseSize` | N/A | `string` ("Thùng 6 chai") | **Missing.** Critical for B2B wholesale orders. |
| Shelf Life | N/A | `shelfLife` | N/A | `string` ("12 tháng") | **Missing.** Required for ingredient spec drawers. |

---

### 3.4. Commercial & Pricing Attributes

| Attribute | Current Implementation | Target Implementation | Gap Analysis |
|---|---|---|---|
| **Base Price** | `price: number` | `price: number` | Exists and is numeric VND across all current items. |
| **Display Price** | `formattedPrice: string` | `formattedPrice: string` | Exists (e.g. `'68.000.000 ₫'`). |
| **Price Type Indicator** | None (assumed fixed) | `priceType: 'fixed' \| 'from' \| 'contact'` | **Missing.** Commercial enterprise equipment (e.g. Giesen roasters, custom Sanremo multi-group machines) requires "Giá từ" or "Liên hệ" instead of rigid fixed prices. |

---

### 3.5. Brand System

| Attribute | Current Implementation | Target Implementation | Gap Analysis |
|---|---|---|---|
| **Brand Identity** | Embedded in name string (`Aura Commercial...`) | Explicit `brand: string` property on `BaseProduct` | **Critical Missing Field.** No brand field exists anywhere in the current codebase. Brand filtering and brand headline typography (`DM Sans 11px uppercase`) cannot function without this attribute. |

---

### 3.6. Inventory & Availability System

| Attribute | Current Implementation | Target Implementation | Gap Analysis |
|---|---|---|---|
| **In-Stock Status** | None (assumed in stock) | `inStock: boolean` | **Critical Missing Field.** Catalog cards and quick drawer cannot communicate availability. |
| **B2B Lead Time** | None | `leadTime?: string` (e.g. "Sẵn hàng tại kho HCM", "Đặt hàng 4–6 tuần") | **Missing Field.** Essential for B2B procurement decisions. |

---

### 3.7. Media & Image Architecture

| Attribute | Current Implementation | Target Implementation | Gap Analysis |
|---|---|---|---|
| **Image Storage** | `image: string` (Single Unsplash URL) | `images: string[]` (Array of high-craft photography URLs) | **Schema Deficit.** Detail pages and spec drawers require secondary shots (interior boiler layout, portafilter detail, terroir origin photography, packaging backs). |

---

### 3.8. SKU, Unique Identification & Routing

| Attribute | Current Implementation | Target Implementation | Gap Analysis |
|---|---|---|---|
| **Internal ID** | `id: string` (e.g. `'eq_home_office'`) | `id: string` (e.g. `'prod_eq_sanremo_racer_2g'`) | Current IDs are homepage-bound. Standardize with semantic prefixes. |
| **URL Slug** | None | `slug: string` (e.g. `'sanremo-cafe-racer-2-group'`) | **Critical Missing Field.** Dynamic Next.js routing (`/products/[slug]`) requires unique, clean URL slugs. |
| **B2B SKU** | None | `sku?: string` (e.g. `'AUR-EQ-SR-CR2'`) | **Missing Field.** Valuable for quotation sheets and dossier exports. |

---

### 3.9. Product Types & Polymorphism

| Feature | Current Implementation | Target Implementation | Gap Analysis |
|---|---|---|---|
| **Discriminator** | None. Separate files/types. | `domain: 'equipment' \| 'ingredients'` | **Missing.** Discriminated union allows strict TypeScript typing across cards, drawers, and filter rails. |
| **Union Type** | `EquipmentTier \| CoffeeBean` (ad-hoc) | `export type Product = EquipmentProduct \| IngredientProduct` | Enables clean polymorphic components (`<ProductGrid products={filteredProducts} />`). |

---

## 4. SEARCHABLE, FILTERABLE & SORTABLE FIELDS AUDIT

### 4.1. Searchable Fields (Debounced Live Search)

| Target Search Query Field | Field Location in Target Schema | Supported by Current Data? | Action Needed |
|---|---|---|---|
| **Product Name** | `BaseProduct.name` | **Yes** (available on both types) | Map directly to search index. |
| **Brand** | `BaseProduct.brand` | **No** (field missing) | Populate `brand` attribute across all records. |
| **Category Name** | `EquipmentProduct.category` / `IngredientProduct.category` | **No** (category enum missing) | Index localized category titles (e.g. "Máy pha cà phê", "Siro"). |
| **Origin & Sub-Region** | `IngredientProduct.origin`, `subRegion` | **Yes** (for beans only) | Normalize and expand to teas, matcha, cocoa. |
| **Flavor Notes** | `IngredientProduct.flavorNotes` | **Yes** (for beans only) | Index string array into token search. |
| **Technical Specs** | `EquipmentProduct.specs.*` | **Partial** (flat strings only) | Index structured boiler, power, and group specs. |

---

### 4.2. Filterable Fields (Facet Matrix & Data Readiness)

| Proposed Filter Facet | URL Param | Target Field & Type | Current Data Support | Missing Data / Technical Gap |
|---|---|---|---|---|
| **Domain Switcher** | `domain` | `ProductDomain` (`'equipment' \| 'ingredients'`) | ❌ No | Add `domain` discriminator property to all items. |
| **Category Filter** | `category` | `EquipmentCategory \| IngredientCategory` | ❌ No | Add category slugs to all items; create multi-category dataset. |
| **Brand Filter** | `brand` | `BaseProduct.brand: string` | ❌ No | Add `brand` property to `BaseProduct`. |
| **Price Range** | `min_price`, `max_price` | `BaseProduct.price: number` | ⚠️ Partial | Supported on existing 7 items, but price spectrum is too narrow (needs 5M - 500M+ for equipment; 100k - 2M+ for ingredients). |
| **Equipment: Groups** | `specs` | `EquipmentProduct.specs.groups: number` | ❌ No | Add numeric `groups` (1, 2, 3) to equipment specs. |
| **Equipment: Boiler Type** | `specs` | `EquipmentProduct.specs.boiler: string` | ⚠️ Partial | Convert free-form string into standardized boiler categories (`Dual PID`, `Multi-Boiler`, `Heat Exchanger`). |
| **Equipment: Voltage** | `specs` | `EquipmentProduct.specs.voltage: '220V' \| '380V'` | ❌ No | Extract voltage into dedicated enum property. |
| **Equipment: Application** | `suitableFor` | `EquipmentProduct.suitableFor: string[]` | ❌ No | Convert single homepage `tabKey` into multi-value `suitableFor` array. |
| **Ingredients: Origin** | `origin` | `IngredientProduct.origin: string` | ⚠️ Partial | Exists for beans; missing normalized slugs and international origins (Ethiopia, Colombia, Kenya, Japan). |
| **Ingredients: Roast Profile**| `roast` | `IngredientProduct.roastProfile` | ⚠️ Partial | Supported on beans; ready for use. |
| **Ingredients: Cupping Score**| `min_cupping` | `IngredientProduct.cuppingScore: number` | ⚠️ Partial | Supported on beans (85.0–89.0); needs slider/chip query support. |
| **Ingredients: Flavor Profile**| `flavor` | `IngredientProduct.flavorNotes: string[]` | ⚠️ Partial | Array exists on beans; needs taxonomy mapping (e.g. Fruity, Floral, Chocolate, Nutty). |
| **Ingredients: Packaging** | `packaging` | `IngredientProduct.packaging.unitSize: string` | ❌ No | Rename `bagWeight` to `packaging.unitSize` and add `caseSize`. |

---

### 4.3. Sortable Fields (Domain-Aware Ordering)

| Sort Option Key | Display Label | Applicable Domain | Target Field Required | Current Data Support | Missing Data / Logic Gap |
|---|---|---|---|---|---|
| `curated` | Tuyển chọn Aura (Curated Atelier) | All Domains | `BaseProduct.isFeatured: boolean` + rank | ❌ No | Missing `isFeatured` flag and curated ordering index. |
| `price_asc` | Giá: Thấp đến Cao | All Domains | `BaseProduct.price: number` | ✅ Yes | Fully supported by existing `price` number. |
| `price_desc` | Giá: Cao đến Thấp | All Domains | `BaseProduct.price: number` | ✅ Yes | Fully supported by existing `price` number. |
| `newest` | Mới nhất / Vụ mùa mới | All Domains | `BaseProduct.createdAt: string` | ❌ No | Missing `createdAt` ISO date strings. |
| `capacity` | Quy mô & Công suất quán | Equipment Only | `specs.groups` or cups/day numeric | ❌ No | `capacity` is currently a descriptive string (`'150–350 ly / ngày'`). Needs numeric metric or `groups` sort. |
| `cupping_desc` | Điểm Cupping cao nhất (86+) | Ingredients Only | `IngredientProduct.cuppingScore: number` | ⚠️ Partial | Supported on beans; requires fallback handling for non-bean ingredients (syrups, matcha). |

---

## 5. COMPLETE MOCK DATA REQUIREMENTS FOR CATALOG

To fulfill the requirements of the Design Brief (`docs/PRODUCT-PAGE-DESIGN-BRIEF.md`), the catalog dataset located at `src/data/products.ts` must contain a minimum of **24–36 curated products** across all domain categories:

```
TARGET CATALOG DATASET COMPOSITION (30+ Products)
├── DOMAIN 1: THIẾT BỊ CÀ PHÊ (EQUIPMENT) — 16 items
│   ├── 01. Espresso Machines (6 items: Sanremo Cafe Racer, Victoria Arduino Black Eagle, La Marzocco Linea Mini, Synesso S200, Nuova Simonelli Aurelia Wave, Slayer Espresso)
│   ├── 02. Coffee Grinders (4 items: Mahlkönig EK43S, Mazzer ZM, Eureka Mignon Specialita, Mahlkönig E65S GbW)
│   ├── 03. Coffee Roasters (2 items: Giesen W6A Shop Roaster, Aillio Bullet R1 V2)
│   ├── 04. Barista Equipment (2 items: Pesado 58.5mm Modular Kit, Acaia Lunar 2021 Scale)
│   └── 05. Accessories & Maintenance (2 items: BWT Bestmax Premium Water Filter, Urnex Cafiza Organic Kit)
│
└── DOMAIN 2: NGUYÊN LIỆU PHA CHẾ (BEVERAGE INGREDIENTS) — 16 items
    ├── 01. Specialty Coffee Beans (6 items: Cầu Đất Yellow Bourbon, Chiềng Ban Fine Robusta, Ethiopia Guji G1, Colombia Pink Bourbon, Aura Signature Blend, Kenya AA Nyeri)
    ├── 02. Syrups (2 items: 1883 Maison Routin Yuzu Citrus, 1883 Vanilla Bourbon)
    ├── 03. Sauces (2 items: 1883 Dark Cocoa 70%, 1883 Salted Butter Caramel)
    ├── 04. Specialty Powders (2 items: Aura Premium Frappe Base, Pure Coconut Cream Powder)
    ├── 05. Matcha & Houjicha (2 items: Uji Ceremonial Matcha Pinnacle, Kyoto Roasted Houjicha Barista Grade)
    ├── 06. Specialty Tea (1 item: Trà Ô Long Bốn Mùa Mộc Sương)
    └── 07. Chocolate & Cocoa (1 item: Bột Cacao Lên Men Nguyên Chất Đắk Lắk)
```

---

## 6. BACKWARD COMPATIBILITY & MIGRATION STRATEGY

### Ensuring Zero Breakage on Homepage Components
The homepage (`src/app/page.tsx`) currently imports mock data directly from component definitions (`EquipmentConfigurator.tsx` uses `EQUIPMENT_TIERS`, `BeansSelection.tsx` uses `COFFEE_BEANS`).

**Migration Safe Harbor:**
1. **Preserve `src/types/index.ts` Legacy Types:** Retain `EquipmentTier`, `CoffeeBean`, and `SolutionPackage` for existing homepage section props without breaking changes.
2. **Create New Schema in `src/types/product.ts`:** Define the clean, decoupled polymorphic schema specified in Section 7 of the Design Brief.
3. **Centralize Catalog Dataset in `src/data/products.ts`:** Build the complete 32+ item dataset using the new schema.
4. **Adapter Utilities (Optional):** If homepage components are later refactored to consume the centralized catalog dataset, simple adapter functions (`productToEquipmentTier`, `productToCoffeeBean`) can be introduced without changing component JSX contracts.

---

## 7. AUDIT CONCLUSION & NEXT STEPS

| Dimension | Current Codebase Readiness | Recommended Action |
|---|---|---|
| **TypeScript Schemas** | 30% | Create `src/types/product.ts` with discriminated union `Product = EquipmentProduct \| IngredientProduct`. |
| **Catalog Dataset** | 15% | Create `src/data/products.ts` with 32 curated B2B equipment & ingredient items with realistic technical specs. |
| **Faceted Filtering Engine** | 20% | Implement domain-aware filter utility functions operating on URL search params. |
| **Search & Typeahead** | 25% | Implement multi-field token matcher querying `name`, `brand`, `origin`, `flavorNotes`, and `specs`. |
| **Sorting Engine** | 40% | Implement domain-aware sort comparator supporting `curated`, `price_asc/desc`, `newest`, `capacity`, and `cupping_desc`. |
| **Cart & Dossier Integration** | 80% | `AppContext.tsx` and `CartDrawer.tsx` already support arbitrary additions to the quote dossier; integrate `<EquipmentCard />` and `<IngredientCard />` triggers seamlessly. |
