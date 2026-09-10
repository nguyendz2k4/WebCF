# PHASE 1: DOMAIN MODEL & DATA OWNERSHIP SPECIFICATION
**Document:** `/docs/database/PHASE_1_DOMAIN_MODEL.md`  
**Repository:** `nguyendz2k4/WebCF` (`FE` Workspace)  
**Baseline Reference:** `/docs/database/PHASE_0_CODEBASE_AUDIT.md`  
**Target Milestone:** Conceptual Domain Architecture & Data Ownership  
**Scope:** Phase 1 Only (No SQL, No Migrations, No Application Code Changes, No Physical Table Creation)

---

## EXECUTIVE DOMAIN ARCHITECTURE SUMMARY

Based on the Phase 0 codebase audit of the Aura Coffee Solutions web application, the system operates as a hybrid B2B/B2C specialty coffee platform. It combines:
1. A **Commercial Product Catalog** with deep domain divergence between industrial equipment (mechanical/electrical specifications) and specialty ingredients (agronomic terroir and sensory profiles).
2. A **Manual-Verification Order Pipeline** (B2B Dossier / Quick Checkout) with offline payment reconciliation (VietQR bank transfer and COD).
3. An **Editorial Content Engine** (Aura Journal / Market Trends).
4. A **Lead Consultation Engine** (Turnkey Project Builder & Atelier Inquiries).

This Phase 1 specification converts the in-memory TypeScript contracts from Phase 0 into a normalized, persistent conceptual domain model without inventing unsupported business logic.

---

## A. ENTITY CLASSIFICATION

Every entity identified during the Phase 0 audit is categorized by architectural role:
* **PERSISTENT ENTITY:** Stored in the authoritative database with independent lifecycle and identity.
* **PERSISTENT SUB-ENTITY / DETAIL:** Stored in the database, but lifecycle is strictly bound to a parent root.
* **CONFIGURATION / REFERENCE DATA:** Slow-changing domain taxonomy used for categorization and filtering.
* **VALUE OBJECT:** Immutable attribute or group of attributes with no independent identity.
* **TRANSIENT / UI MODEL:** Runtime or client-side construct not persisted in the operational database.
* **DERIVED MODEL:** Dynamically computed from persistent facts; persisting it causes data anomalies.
* **NOT NEEDED IN DATABASE:** Legacy or redundant mock structures to be retired.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                DOMAIN CLASSIFICATION                                   │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│   PERSISTENT ENTITIES    │   REFERENCE & VALUES     │        TRANSIENT / DERIVED       │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ • User (Root - No Address) │ • Category (Ref)         │ • Cart (Transient Session)       │
│ • Product (Root)         │ • Brand (Ref)            │ • CartItem (Transient DTO)       │
│ • EquipmentSpecs (Sub)   │ • Author (Embedded VO)   │ • EquipmentTier (Deprecated UI)  │
│ • IngredientSpecs (Sub)  │ • Tag (Native Array/JSON)│ • CoffeeBean (Deprecated UI)     │
│ • Order (Root)           │ • OrderAddress (Snap VO) │ • ProjectBuilder (UI Algorithm)  │
│ • OrderItem (Sub)        │ • SpecsSummary (Derived) │ • formattedPrice (Derived UI)    │
│ • ContactInquiry (Root)  │                          │ • cartTotal (Derived Transient)  │
│ • NewsArticle (Root)     │                          │                                  │
└──────────────────────────┴──────────────────────────┴──────────────────────────────────┘
```

### Detailed Entity Classification & Rationale

| Codebase Entity | Phase 1 Classification | Owning Aggregate | Rationale & Lifecycle Rule |
|---|---|---|---|
| **User** | **PERSISTENT ENTITY** | User Aggregate | Independent lifecycle. Represents customers, business owners, and staff accounts. Authoritative identity root. Contains **NO address columns** (address is entered at checkout and snapshotted on Order). |
| **Product** | **PERSISTENT ENTITY** | Product Aggregate | Core commercial catalog entity. Possesses unique SKU, slug, pricing, stock state (`is_in_stock`), and public lifecycle. |
| **EquipmentProduct** | **PERSISTENT SUB-ENTITY** | Product Aggregate | Not a distinct table root. It is the equipment-specific extension of `Product`, carrying mechanical and electrical attributes. Lifecycle is 1:1 with `Product`. |
| **IngredientProduct** | **PERSISTENT SUB-ENTITY** | Product Aggregate | The ingredient-specific extension of `Product`, carrying origin, terroir, roast profile, cupping scores, and packaging specs. Lifecycle is 1:1 with `Product`. |
| **Category** | **CONFIGURATION / REF DATA** | Catalog Taxonomy | Manages the 13 hierarchical category slugs identified in Phase 0. Authoritative owner of `domain`. Needs persistence so admin/staff can maintain catalog taxonomy without code changes. |
| **Brand** | **CONFIGURATION / REF DATA** | Catalog Taxonomy | 23 distinct commercial brands identified. Catalog reference data only. Must NOT be expanded into a supplier/procurement domain. |
| **Order** | **PERSISTENT ENTITY** | Order Aggregate | Transactional aggregate root. Owns `order_code`, `total_amount` (authoritative financial snapshot), and immutable shipping address snapshot. Permanently immutable once confirmed. |
| **OrderItem** | **PERSISTENT SUB-ENTITY** | Order Aggregate | Child record of `Order`. Snapshots commercial facts (name, SKU, unit price, quantity, specs) at the exact moment of checkout. |
| **Cart** | **TRANSIENT / UI MODEL** | Session / Client State | Stored client-side in `localStorage` (`aura_coffee_cart`). Does not require server-side database tables unless authenticated persistent cart sync across devices is requested. |
| **CartItem** | **TRANSIENT DTO** | Session / Client State | Staging line item for the cart drawer. Converted into an immutable `OrderItem` upon checkout submission. |
| **NewsArticle** | **PERSISTENT ENTITY** | Content Aggregate | Standalone editorial content publishing root. Has dedicated SEO slug, cover media, publishing date, canonical category slug, embedded author, and native array tags. |
| **Author** | **EMBEDDED VALUE OBJECT** | Content Aggregate | Embedded `{ name, role, avatar }` on `NewsArticle`. Authors are editorial staff bylines, NOT platform user accounts. No separate table or FK to `User`. |
| **Tag** | **VALUE OBJECT (ARRAY/JSON)** | Content Aggregate | String tags attached to news articles. Persisted as native array or JSON column on `NewsArticle`. No separate junction table. |
| **ContactInquiry** | **PERSISTENT ENTITY** | Consultation / CRM | Captures B2B project advisory requests, shop opening consultations, and custom budget leads from `ContactForm.tsx`. Independent lead lifecycle. |
| **EquipmentTier** | **NOT NEEDED IN DATABASE** | N/A (Deprecated UI) | Legacy mock object in `EquipmentConfigurator.tsx`. Represents 3 mock machines on the homepage. Must be replaced by querying actual `Product` records (`domain: 'equipment'`). |
| **CoffeeBean** | **NOT NEEDED IN DATABASE** | N/A (Deprecated UI) | Legacy mock object in `BeansSelection.tsx`. Represents 4 mock beans on the homepage. Must be replaced by querying actual `Product` records (`domain: 'ingredients'`). |
| **SolutionPackage** | **PERSISTENT ENTITY or PRODUCT BUNDLE** | Product / Solution Aggregate | Currently represents 3 turnkey packages (`Khởi Nghiệp`, `Chuyên Nghiệp`, `Chuỗi Vận Hành`). When added to cart, it behaves as a purchasable line item. Classified as a preconfigured composite Product. |
| **ProjectBuilder model**| **CONFIGURATION / UI ALGORITHM** | UI / Rule Engine | 5 business archetypes (`kiosk`, `takeaway`, etc.) with calculator sliders in `ProjectBuilder.tsx`. This is an interactive recommendation rule engine, not an operational database record. |

---

## B. DOMAIN BOUNDARIES & CONTEXTS

The system divides cleanly into four Bounded Contexts:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              AURA COFFEE BOUNDED CONTEXTS                              │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│     CATALOG CONTEXT      │    PROCUREMENT CONTEXT   │        EDITORIAL CONTEXT         │
│  • Product Aggregate     │  • Order Aggregate       │  • NewsArticle Aggregate         │
│  • Equipment Specifics   │  • OrderItem Entities    │  • Author Value Object           │
│  • Ingredient Terroir    │  • Payment Verification  │  • Tag References                │
│  • Brand & Category      │  • Customer Fulfillment  │                                  │
├──────────────────────────┴──────────────────────────┴──────────────────────────────────┤
│                           LEAD / CONSULTATION CONTEXT                                  │
│  • ContactInquiry Aggregate                                                            │
│  • Project Builder Recommendation Rules                                                │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Catalog Context:**
   * *Aggregate Root:* `Product`
   * *Boundaries:* Product identities, pricing tiers, domain discriminators, technical specs, sensory profiles, brand associations, category mappings, and inventory availability.
2. **Procurement Context (Order & Fulfillment):**
   * *Aggregate Root:* `Order`
   * *Boundaries:* Immutable transaction snapshots, customer fulfillment details, payment verification states (`pending_verification` to `confirmed`), order line items, and audit trail.
3. **Editorial Context:**
   * *Aggregate Root:* `NewsArticle`
   * *Boundaries:* Articles, category classification (`market-trends`, `barista-tech`, `new-products`), publication scheduling, reading times, and editorial body composition.
4. **Lead & Consultation Context:**
   * *Aggregate Root:* `ContactInquiry`
   * *Boundaries:* Customer inquiry intake, service interest categorization (`full-setup`, `bar-training`), budget tiering, and SLA response tracking.

---

## C. PRODUCT DOMAIN MODEL

### 1. Common Product Attributes (Base Entity)
Every purchasable catalog product, regardless of domain, shares these foundational attributes:
* `id`: Globally unique identifier.
* `sku`: Unique commercial Stock Keeping Unit (e.g. `AUR-EQ-SR-CR2`, `AUR-BE-CD-YB`).
* `slug`: Unique, URL-safe path segment for Next.js dynamic routing (`/products/[slug]`).
* `name`: Commercial title (e.g. "Sanremo Cafe Racer Custom 2 Groups").
* `domain`: Polymorphic discriminator (`'equipment' | 'ingredients'`).
* `category_id`: Mandatory reference to authoritative `Category`.
* `brand_id`: Mandatory reference to authoritative `Brand`.
* `short_description`: Concise marketing/procurement summary.
* `price`: Authoritative base price in VND (integer).
* `price_type`: Commercial pricing flag (`'fixed' | 'from' | 'contact'`).
* `in_stock`: Boolean availability flag.
* `lead_time`: Procurement lead time notice (e.g. "Sẵn hàng tại kho HCM", "Đặt hàng 3–4 tuần").
* `is_featured`: Boolean flag for flagship curation.
* `created_at` & `updated_at`: Timestamps.

### 2. Equipment-Specific Attributes
Pertains strictly to `domain: 'equipment'` (espresso machines, grinders, roasters, barista tools):
* **Faceted / Queryable Attributes:**
  * `groups`: Number of group heads (1, 2, 3). Used directly in catalog filtering and capacity sorting.
  * `boiler_type`: Standardized boiler technology (e.g., 'Multi-Boiler', 'Dual Boiler', 'T3 PureBrew').
  * `voltage`: Electrical supply requirement (`'220V' | '380V' | '220V/380V'`).
  * `suitable_for`: Array/set of application tags (`'home'`, `'boutique-cafe'`, `'high-volume'`, `'roastery'`, `'lab'`).
* **Descriptive / Detail-Only Attributes:**
  * `boiler_capacity`: Descriptive string (e.g. "Nồi hơi đánh sữa 8.5L + 2 Nồi con 1.0L").
  * `pump_type`: Pump mechanism (e.g. "Rotary Vane Pump volumetric chuyên dụng").
  * `power_consumption`: Wattage/rating string (e.g. "4.800W").
  * `dimensions`: Physical footprint W x D x H (e.g. "877 x 680 x 534 mm").
  * `weight`: Machine net weight (e.g. "97 kg").
  * `warranty_terms`: Mandatory warranty policy string (e.g. "24 tháng chính hãng").
  * `daily_capacity`: Estimated daily serving volume (e.g. "250 – 450 ly / ngày").

### 3. Ingredient-Specific Attributes
Pertains strictly to `domain: 'ingredients'` (specialty beans, syrups, sauces, powders, matcha, tea, cocoa):
* **Faceted / Queryable Attributes:**
  * `origin`: Country or primary geographic origin (e.g. "Cầu Đất", "Ethiopia", "Pháp", "Nhật Bản").
  * `roast_profile`: Roast level (`'Light' | 'Medium' | 'Medium-Dark' | 'Dark'`).
  * `cupping_score`: SCA sensory evaluation score (decimal, e.g. `87.5`).
* **Descriptive / Detail-Only Attributes:**
  * `sub_region`: Terroir sub-zone (e.g. "Trạm Hành · Lâm Đồng").
  * `altitude`: Farm elevation string (e.g. "1.650m ASL").
  * `process_method`: Processing technique (e.g. "Anaerobic Natural 72h", "Thermal Shock Washed").
  * `flavor_notes`: Array of sensory descriptor tags (e.g. ["Hoa Lài", "Đào Vàng", "Mật Ong Rừng"]).
  * `unit_size`: Retail/base packaging quantity (e.g. "Túi 1kg", "Chai 1000ml", "Hộp 100g").
  * `case_size`: Wholesale master carton packaging specification (e.g. "Thùng 10 túi (10kg)", "Thùng 6 chai").
  * `shelf_life`: Expiration duration string (e.g. "6 tháng kể từ ngày rang").

### 4. Media & Gallery Ownership
* Images in the current codebase are an array of URLs (`images: string[]`).
* Access pattern:
  * Catalog cards, search typeahead, and cart items **only access `images[0]`**.
  * Product detail page (`/products/[slug]`) and quick spec drawer render the **full gallery (`images[0..N]`)**.
* Ownership: Owned by the `Product` aggregate. Can be modeled as a dependent 1:N media gallery entity or an ordered array of URLs associated with the product ID.

### 5. Inheritance vs Decomposition Strategy Analysis

We explicitly evaluate the 4 architectural alternatives against the Phase 0 access patterns:

```
ALTERNATIVE A: Single "Wide" Products Table
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ id | sku | name | price | domain | groups | boiler | origin | roast | cupping | specs... │
└────────────────────────────────────────────────────────────────────────────────────────┘
Pros: Single table, zero JOINs for queries.
Cons: High column sparsity (~40% of columns NULL on any given row); breaks domain clarity; schema changes to equipment affect ingredient records.

ALTERNATIVE B: Class Table Inheritance (products + product_equipment_specs + product_ingredient_specs)
┌───────────────────────────────────────┐
│              products                 │
├───────────────────────────────────────┤
│ id | sku | name | price | domain ...  │
└──────────────────┬────────────────────┘
                   │ 1:1
         ┌─────────┴─────────┐
         ▼                   ▼
┌──────────────────┐┌──────────────────┐
│ equipment_specs  ││ ingredient_specs │
├──────────────────┤├──────────────────┤
│ groups, boiler...││ origin, roast... │
└──────────────────┘└──────────────────┘
Pros: Clean normalization, no wasted NULL fields, strictly typed constraints per subtype.
Cons: Requires 1:1 JOIN on product detail views; filtering across both domains requires careful query construction.

ALTERNATIVE C: Products + Unstructured JSON Document
┌───────────────────────────────────────────────────────────┐
│ id | sku | name | price | domain | specifications_json... │
└───────────────────────────────────────────────────────────┘
Pros: Infinite flexibility, zero schema changes for new attributes.
Cons: Poor indexing on relational databases without GIN indexes; zero data type enforcement; impossible to enforce required warranty or unitSize.

ALTERNATIVE D: Recommended Hybrid Architecture (Products + 1:1 Subtype Extension Tables)
```

#### Architectural Recommendation: ALTERNATIVE B (Class Table Inheritance)
* **Rationale Based on Actual Access Patterns:**
  1. The catalog explicitly branches at the root level via `domain: 'equipment' | 'ingredients'`.
  2. Equipment attributes (`groups`, `boiler`, `voltage`) and Ingredient attributes (`origin`, `roast`, `cupping`) are never shared or combined.
  3. Catalog listing queries filter strictly by `domain` first. Equipment queries join `equipment_specs`, while ingredient queries join `ingredient_specs`.
  4. Strongly-typed database columns prevent invalid data (e.g., assigning a `cupping_score` to an espresso machine or a `boiler_capacity` to matcha powder).

---

## D. CART & ORDER DOMAIN MODEL

### 1. Analysis of Current Polymorphic CartItem Flaw
In the Phase 0 codebase, `CartItem.id` is severely overloaded:
* It holds product IDs: `'prod_eq_sanremo_cafe_racer_2g'`
* It holds legacy component IDs: `'eq-tier-1'`, `'bean_caudat_typica'`
* It holds turnkey solution IDs: `'pkg_specialty_upgrade'`
* It holds generated project builder IDs: `'project_kiosk'`

**Architectural Correction:**
In a production database, an `OrderItem` cannot have a polymorphic foreign key pointing haphazardly across unrelated tables without destroying referential integrity.

### 2. Unified Purchasable Item Principle
* **All discrete standalone items sold on the website MUST exist in the authoritative `Product` catalog.**
* Legacy homepage tiers (`eq-tier-1`) and beans (`bean_caudat_typica`) are eliminated; the homepage components must reference real `Product` records.
* **Turnkey Solution Packages (`SolutionPackage`):** Must be modeled as Products with a dedicated category (`solution-packages`) or as composite Product Bundles.
* **Project Builder Custom Estimates (`project_kiosk`):** Cannot be checked out as a blind unpriced database item. In the Phase 0 code, the project builder button is labeled *"Nhận Báo Giá & Bản Vẽ Bar"*. This is fundamentally a **Consultation / RFQ Lead**, not an immediate SKU purchase. It must generate a `ContactInquiry` record containing the configured parameters (`model`, `capacity`, `budget`, `recommended_machine`).

### 3. Historical Data Preservation in Orders
An e-commerce order is a **legally binding historical contract**. If a product's price, title, or specifications change in the future, past orders must remain completely unaltered.

```
┌──────────────────────────────────────┐             ┌──────────────────────────────────────┐
│             Product                  │             │             OrderItem                │
├──────────────────────────────────────┤             ├──────────────────────────────────────┤
│ id: "prod_123"                       │             │ id: "item_999"                       │
│ name: "Sanremo Cafe Racer (2026)"    │             │ order_id: "ord_555"                  │
│ price: 245000000 (Live Catalog Price)│             │ product_id: "prod_123" (Nullable FK) │
│ sku: "AUR-EQ-SR-CR2"                 │             │ snapshotted_title: "Sanremo Racer"   │
└──────────────────────────────────────┘             │ snapshotted_sku: "AUR-EQ-SR-CR2"     │
                                                     │ snapshotted_unit_price: 245000000    │
                                                     │ quantity: 1                          │
                                                     │ snapshotted_specs: "2G · Dual PID"   │
                                                     └──────────────────────────────────────┘
```

* `OrderItem` **MUST snapshot:**
  * `snapshotted_title`: Product title at time of order.
  * `snapshotted_sku`: SKU at time of order.
  * `snapshotted_unit_price`: The exact unit price in VND at the moment of checkout.
  * `quantity`: Number of units ordered.
  * `snapshotted_specs`: Brief specification text relevant to the purchase.
* `OrderItem` **relationship to Product:**
  * Retains a nullable foreign key `product_id REFERENCES products(id) ON DELETE SET NULL`.
  * If the product is later retired, the order line item retains full historical accounting validity.

---

## E. INVENTORY MODEL

### 1. What the Codebase Actually Proves
* The code contains **NO inventory quantities** (no numbers like `stock_quantity: 42`).
* The code contains **NO multi-warehouse tables or logic**.
* The code contains **NO stock decrement or reservation logic** upon checkout.
* The code contains:
  1. `inStock: boolean` (a binary boolean flag).
  2. `leadTime: string` (procurement advisory text such as *"Sẵn hàng tại kho HCM & Hà Nội"*, *"Đặt hàng tùy biến 3–4 tuần"*, *"Rang mới mỗi thứ Ba & thứ Sáu"*).

### 2. Conceptual Inventory Architecture (Aligned with Review Gate)
To prevent over-engineering while remaining strictly true to the audited codebase:
1. **Product Availability State (Authoritative):**
   * Exactly ONE authoritative boolean column on `Product`:
     * `is_in_stock: boolean` (true = in stock / purchasable, false = out of stock).
     * Directly governs "Add to Cart" enablement, quick spec actions, and Schema.org `https://schema.org/InStock` vs `OutOfStock`.
   * **`availability_status` enum is ELIMINATED entirely** to eliminate dual-source-of-truth split brain.
2. **Procurement Lead Time Notice (Informational Only):**
   * A dedicated nullable string field `lead_time_notice: string | null` communicating logistics context to buyers (e.g. *"Sẵn hàng tại kho HCM & Hà Nội"*, *"Đặt hàng tùy biến 3–4 tuần"*).
   * Does NOT govern availability or cart addition (e.g., custom machines with 3–4 weeks lead time remain `is_in_stock = true`).
3. **Quantitative Stock Tracking (Unresolved Business Decision):**
   * *Status:* **Deferred.** The business operates on an offline confirmation model. Stock reservation cannot happen automatically without an integrated warehouse inventory management system.

---

## F. STATUS AND ENUM STRATEGY

We categorize all hardcoded status and enum values from Phase 0 into three implementation strategies:
1. **CONSTRAINED SCALAR:** Stable, closed set of system-level choices that drive application control flow.
2. **LOOKUP / REFERENCE DATA:** Open, user-configurable domain taxonomy that grows over time.
3. **DOMAIN ENTITY:** Independent entities with lifecycle, attributes, and relationships.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              ENUM & STATUS STRATEGY                                    │
├──────────────────────────────┬──────────────────────────┬──────────────────────────────┤
│     CONSTRAINED SCALARS      │   LOOKUP / REF DATA      │        DOMAIN ENTITIES       │
├──────────────────────────────┼──────────────────────────┼──────────────────────────────┤
│ • Order Status (5 values)    │ • Product Category (13)  │ • User                       │
│ • Payment Method (2 values)  │ • Brand (23 values)      │ • Product                    │
│ • Product Domain (2 values)  │ • Vietnam Provinces (63) │ • Order                      │
│ • Price Type (3 values)      │ • Suitability Tags (5)   │ • ContactInquiry             │
│ • Roast Profile (4 values)   │ • News Category (4)      │ • NewsArticle                │
│ • Electrical Voltage (3 val) │                          │                              │
│ • User Role (3 values)       │                          │                              │
└──────────────────────────────┴──────────────────────────┴──────────────────────────────┘
```

### Detailed Evaluation

| Enum / Status Group | Values Identified in Code | Architectural Treatment | Justification |
|---|---|---|---|
| **Order Verification Status** | `pending_verification`, `confirmed`, `processing`, `dispatched`, `cancelled` | **CONSTRAINED SCALAR** | Core transactional state machine. Logic in thank-you pages, notifications, and fulfillment depends on these exact states. |
| **Payment Method** | `vietqr`, `cod` | **CONSTRAINED SCALAR** | The UI only supports two distinct manual payment pathways. |
| **Product Domain** | `equipment`, `ingredients` | **CONSTRAINED SCALAR** | Fundamental polymorphic discriminator across all catalog components. |
| **Price Type** | `fixed`, `from`, `contact` | **CONSTRAINED SCALAR** | Dictates whether prices display as exact numbers, starting rates, or RFQ triggers. |
| **Roast Profile** | `Light`, `Medium`, `Medium-Dark`, `Dark` | **CONSTRAINED SCALAR** | Standardized universal coffee roasting classification. |
| **Electrical Voltage** | `220V`, `380V`, `220V/380V` | **CONSTRAINED SCALAR** | Closed set of commercial power standards in Vietnam. |
| **User Role** | `owner`, `barista`, `guest` | **CONSTRAINED SCALAR** | Controls access permissions and profile attributes. |
| **Product Category** | 13 categories (`espresso-machines`, `syrups`, `matcha`, etc.) | **LOOKUP / REF DATA** | Commercial categories expand as Aura adds product lines (e.g. ice makers, plant milks). Storing as reference data prevents DDL migrations. |
| **Brand** | 23 brands (`Sanremo`, `Mahlkönig`, `1883`, etc.) | **LOOKUP / REF DATA** | Brands are business partners with logos, origins, and descriptions. |
| **Vietnam Provinces** | 63 administrative provinces | **LOOKUP / REF DATA** | Official geographic standard used for shipping calculation and order dispatch. |
| **Suitability Tags** | `home`, `boutique-cafe`, `high-volume`, `roastery`, `lab` | **LOOKUP / REF DATA** | Multi-select taxonomy for machine application matching. |
| **News Category** | `new-products`, `market-trends`, `barista-tech` | **LOOKUP / REF DATA** | Editorial taxonomy for the Aura Journal. |

---

## G. SOFT-DELETE STRATEGY

Soft deletion (e.g. `deleted_at IS NOT NULL` or `is_active = false`) must not be applied blindly to every entity. We evaluate each persistent entity against audit requirements:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              SOFT-DELETE STRATEGY                                      │
├──────────────────────────────┬──────────────────────────┬──────────────────────────────┤
│      REQUIRES SOFT DELETE    │     HARD DELETE ALLOWED  │       IMMUTABLE / NO DELETE  │
├──────────────────────────────┼──────────────────────────┼──────────────────────────────┤
│ • Product (Historical integrity) • CartItem (Client discard)• Order (Audit trail)       │
│ • Category (Catalog integrity)│ • Session Tokens         │ • OrderItem (Child audit)    │
│ • Brand (Product integrity)  │ • Transient Drafts       │                              │
│ • User (Account retention)   │                          │                              │
│ • NewsArticle (SEO backlinks)│                          │                              │
│ • ContactInquiry (Lead audit)│                          │                              │
└──────────────────────────────┴──────────────────────────┴──────────────────────────────┘
```

### Detailed Soft-Delete Analysis

1. **`Product` ── MUST SUPPORT SOFT DELETE (`archived_at` / `is_active`):**
   * *Why:* A retired machine (e.g. Sanremo Cafe Racer 2024 model) is referenced by past orders and quotes. Hard deleting a product breaks database foreign keys or deletes past order histories.
   * *Physical Deletion:* Forbidden if the product has ever been included in an order.
2. **`Category` & `Brand` ── MUST SUPPORT SOFT DELETE (`is_active`):**
   * *Why:* Deactivating a brand or category must hide it from active catalog filter rails without orphaning historical products.
3. **`User` ── MUST SUPPORT SOFT DELETE (`deactivated_at`):**
   * *Why:* Under Vietnamese commercial law and B2B accounting rules, customer audit trails must be retained for tax and warranty verification.
4. **`Order` ── NEVER DELETED (IMMUTABLE LIFECYCLE):**
   * *Why:* Orders represent financial agreements. An order is never "deleted"—if rejected or aborted, its status transitions to `'cancelled'`.
5. **`OrderItem` ── NEVER DELETED INDEPENDENTLY:**
   * *Why:* Tightly bound child entity of `Order`. Once written, order items are completely immutable.
6. **`NewsArticle` ── MUST SUPPORT SOFT DELETE (`archived_at`):**
   * *Why:* Editorial articles have external search engine backlinks and SEO indexation. Soft deleting allows unpublishing while returning proper 410 Gone or 301 redirects rather than dangling foreign key failures.
7. **`ContactInquiry` ── MUST SUPPORT ARCHIVAL (`is_archived`):**
   * *Why:* Business consultation leads must remain accessible for CRM history and sales reporting.

---

## H. VERTICAL PARTITIONING ANALYSIS

Based on the actual access patterns observed in Phase 0, data fields exhibit sharply contrasting access frequencies and payload sizes:

* **HOT:** Fetched on every catalog listing, search typeahead, or homepage query (high frequency, small payload).
* **WARM:** Fetched conditionally or during user interactions (filter rails, active chips).
* **COLD:** Fetched only on dedicated detail views (`/products/[slug]`) or slide-over modal drawers.
* **LARGE:** High byte size (unsuitable for bulk list queries).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        FIELD ACCESS FREQUENCY MATRIX                                   │
├───────────────┬────────────────────────────────────────────────────────────────────────┤
│ PRODUCT CORE  │ HOT: id, slug, sku, domain, category_id, brand_id, name, price,        │
│               │      price_type, in_stock, lead_time, is_featured, primary_image       │
│               │ WARM: suitable_for, roast_profile, cupping_score, groups               │
├───────────────┼────────────────────────────────────────────────────────────────────────┤
│ SPEC EXTENSION│ COLD: dimensions, weight, boiler_capacity, pump_type, power, voltage, │
│               │       warranty_terms, daily_capacity, sub_region, altitude, process,   │
│               │       flavor_notes, case_size, shelf_life                              │
├───────────────┼────────────────────────────────────────────────────────────────────────┤
│ MEDIA GALLERY │ COLD / LARGE: secondary_images[] (multiple high-res photo URLs)        │
├───────────────┼────────────────────────────────────────────────────────────────────────┤
│ NEWS ARTICLE  │ HOT: id, slug, title, excerpt, category, published_at, read_time,      │
│               │      cover_image, author_name, author_role                             │
│               │ COLD / LARGE: lead_paragraph, sections[] (headings, body, pullquotes)  │
└───────────────┴────────────────────────────────────────────────────────────────────────┘
```

### 1. Justification for `Product` Decomposition
* **Catalog Listing Performance:** The catalog renders 12 items per page (`ITEMS_PER_PAGE = 12`). Loading machine boiler schematics, dimensions, weights, and tasting notes for 12 items when only title, price, brand, and thumbnail are displayed wastes memory and bandwidth.
* **Partition Boundary:**
  * `Product` (Core Hot Table): Contains identity, pricing, availability, and primary thumbnail.
  * `EquipmentSpecifications` (1:1 Extension Table): Contains mechanical/electrical engineering specs, queried only on detail routes and quick spec drawer.
  * `IngredientSpecifications` (1:1 Extension Table): Contains sensory notes, terroir, and packaging specs, queried only on detail routes and quick spec drawer.
  * `ProductMedia` (1:N Gallery Table): Holds secondary photos and detailed angle shots.

### 2. Justification for `NewsArticle` Decomposition
* **Listing vs Detail Payload:** The `/news` page renders article cards with `cover_image`, `title`, `excerpt`, `author`, `published_at`, and `read_time`.
* The article body (`content.sections`) contains nested arrays of paragraphs, headings, pull quotes, key point boxes, and figure captions.
* **Partition Boundary:**
  * `NewsArticle` (Summary Table): Contains all metadata needed for cards and listings.
  * `NewsArticleContent` (1:1 Content Table): Holds the full structured article body, loaded strictly on `/news/[slug]`.

---

## I. DATA OWNERSHIP MATRIX

To eliminate data duplication and split-brain states, exactly ONE authoritative owner is designated for every business fact:

| Business Fact | Authoritative Owner | Non-Authoritative / Derived Places (Must NOT Persist Independently) |
|---|---|---|
| **Active Catalog Price** | `Product.price` (Integer VND) | `formattedPrice` (Derived UI string), `EquipmentTier.price`, `CoffeeBean.price`. |
| **Historical Purchase Price** | `OrderItem.snapshotted_unit_price` | Live `Product.price` must never be queried for historical orders. |
| **Product Display Name** | `Product.name` | `CartItem.title` (Transient copy), `EquipmentTier.name`, `CoffeeBean.name`. |
| **Historical Purchased Name** | `OrderItem.snapshotted_title` | Preserves the name of the product at purchase date. |
| **Product Availability** | `Product.is_in_stock` (Boolean) | `availability_status` (Eliminated), `lead_time_notice` (Informational text only). |
| **Procurement Notice** | `Product.lead_time_notice` (Nullable Text) | Must not dictate in-stock status or checkout blocking. |
| **Brand Taxonomy** | `Brand.name` & `slug` | Plain string brand names; must not be expanded into supplier entities. |
| **Category Taxonomy** | `Category.name` & `slug` | Category is the authoritative owner of `domain`. Parity enforced by schema. |
| **Order Total** | `Order.total_amount` (Integer VND) | Authoritative immutable financial snapshot. Must not be dynamically re-derived on historical records. |
| **Order Shipping Info** | `Order.shipping_*` (Snapshotted columns) | `User` profile (Zero address columns on User). |
| **Payment Verification State**| `Order.status` | State transitions from `pending_verification` to `confirmed` owned solely by Order. |
| **Order Identifier** | `Order.order_code` | Authoritative transaction identifier (e.g. `AURA-719245`). |
| **VietQR Payment Reference** | Derived from `order_code` + phone | Constructed deterministically at runtime; not an independent mutable column. |
| **Article Author** | `NewsArticle.author_*` (Embedded columns) | No `authors` table; authors are editorial bylines, not platform user accounts. |
| **Article Tags** | `NewsArticle.tags` (Native Array / JSONB) | No `tags` table; no `news_article_tags` junction table. |
| **Article Read Time** | Computed dynamically at runtime | No `read_time` database column. |
| **Article Category Label**| Derived from `Category` code/slug | No `category_label` database column. |

### Identified Duplication Risks & Remediation

```
DUPLICATION HAZARD IN CURRENT CODEBASE:
┌────────────────────────────────┐         ┌────────────────────────────────┐
│      Product (In-Memory)       │         │      EquipmentTier / Bean      │
│  price: 245000000              │  VS     │  price: 245000000              │
│  formattedPrice: "245.000.000₫"│         │  formattedPrice: "245.000.000₫"│
└────────────────────────────────┘         └────────────────────────────────┘
RESOLUTION:
Single authoritative integer column `price` in `products`. 
Eliminate legacy mock arrays. Compute `formattedPrice` on client runtime.
```

1. **Price Duplication:**
   * *Current Hazard:* Products store both `price: 245000000` and `formattedPrice: '245.000.000 ₫'`.
   * *Remediation:* Persist ONLY numeric `price` (integer in VND). Derive formatted currency dynamically on the frontend via `Intl.NumberFormat('vi-VN')`.
2. **Homepage Legacy Duplication:**
   * *Current Hazard:* `EquipmentConfigurator.tsx` and `BeansSelection.tsx` maintain redundant mock objects separate from `PRODUCTS_DATA`.
   * *Remediation:* Deprecate `EQUIPMENT_TIERS` and `COFFEE_BEANS`. Query `Product` records by `is_featured: true` or dedicated homepage category.

---

## J. HISTORICAL DATA STRATEGY

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              HISTORICAL INTEGRITY RULES                                │
├────────────────────────────────────────┬───────────────────────────────────────────────┤
│           SNAPSHOT DATA (IMMUTABLE)    │             LIVE REFERENCES (MUTABLE)         │
├────────────────────────────────────────┼───────────────────────────────────────────────┤
│ • OrderItem Unit Price                 │ • User Account Profile (Name, Email)          │
│ • OrderItem Title & SKU                │ • Live Catalog Product Availability           │
│ • Order Fulfillment Shipping Address   │ • Product Active Retail Price                 │
│ • Order Recipient Name & Phone         │ • Category & Brand Metadata                   │
│ • VietQR Syntax & Payment Method       │                                               │
│ • Order Verification Staff Note        │                                               │
└────────────────────────────────────────┴───────────────────────────────────────────────┘
```

1. **Order Transactions:**
   * Once an order transitions to `confirmed`, every financial value on the `Order` and `OrderItem` records is permanently frozen.
   * Modifying catalog pricing never retroactively updates historical orders.
2. **Customer Contact Snapshot:**
   * If a customer updates their profile phone number or delivery address next month, past orders delivered to their previous address must preserve the historical destination.
   * Therefore, `Order` stores dedicated columns for `recipient_name`, `recipient_phone`, `shipping_address`, and `shipping_province`.
3. **Auditability of Manual Payment Verification:**
   * Because Aura Coffee Solutions utilizes manual payment verification (staff reconciles bank transfer against VietQR transaction syntax), the order domain must record:
     * `verified_by_user_id`: ID of the staff member who confirmed payment.
     * `verified_at`: Timestamp of verification.
     * `verification_notes`: Internal staff commentary.

---

## K. OPEN BUSINESS DECISIONS (FLAGGED FROM CODE AUDIT)

The database design cannot proceed to physical implementation until the business resolves these explicit ambiguities:

1. **Pricing Authority for B2B RFQs:**
   * *Code Evidence:* Products with `priceType: 'contact'` (e.g. Giesen commercial roasters) or `priceType: 'from'`.
   * *Decision Required:* Can customers add "contact" items to the checkout cart, or must "contact" products trigger a dedicated quotation request form (`ContactInquiry`) without an order total?
2. **Multi-Warehouse Architecture:**
   * *Code Evidence:* Lead time strings cite *"Sẵn hàng tại kho HCM & Hà Nội"*.
   * *Decision Required:* Does Phase 1 require discrete warehouse entities (`warehouses`, `warehouse_stock`), or is simple single-flag availability sufficient for initial launch?
3. **Product Bundling / Solution Packages:**
   * *Code Evidence:* `SolutionsSection.tsx` offers 3 turnkey packages (`pkg_startup_turnkey`, etc.) with composite features.
   * *Decision Required:* Are turnkey packages separate SKUs in the `Product` table, or composite bundles containing itemized equipment and beans?
4. **Order Cancellation & Return Policies:**
   * *Code Evidence:* Explicitly marked `[BUSINESS DECISION REQUIRED]` in `chinh-sach-doi-tra/page.tsx` and `terms/page.tsx`.
   * *Decision Required:* Maximum cancellation window before dispatch, return time limit for machines vs opened bean bags, and responsibility for pallet return freight fees.
5. **Customer Reviews Architecture:**
   * *Code Evidence:* `ProductReviewsSection.tsx` line 73 explicitly states public reviews are blocked until verified buyer accounts are deployed.
   * *Decision Required:* Does Phase 2 require a `reviews` table linked to verified order items, or will reviews remain editorial testimonials?

---

## L. RECOMMENDED CONCEPTUAL DOMAIN MODEL

The following diagram illustrates the complete conceptual domain architecture synthesized from the codebase audit:

```
┌─────────────────────┐
│      Category       │
│  (Ref Taxonomy)     │
└──────────┬──────────┘
           │ 1:N
           ▼
┌─────────────────────┐       1:N       ┌─────────────────────┐
│       Product       │◀────────────────│    ProductMedia     │
│  (Aggregate Root)   │                 │   (Gallery Items)   │
└──────────┬──────────┘                 └─────────────────────┘
           │
           ├──────────────────────────┐
       1:1 │                      1:1 │
           ▼                          ▼
┌─────────────────────┐    ┌─────────────────────┐
│  EquipmentSpecs     │    │   IngredientSpecs   │
│  (Mechanical/Elec)  │    │   (Terroir/Sensory) │
└─────────────────────┘    └─────────────────────┘
           ▲
           │ 0..1:N (Nullable FK)
┌──────────┴──────────┐
│      OrderItem      │
│ (Snapshotted Lines) │
└──────────┬──────────┘
           │ N:1
           ▼
┌─────────────────────┐       N:1       ┌─────────────────────┐
│        Order        │────────────────▶│        User         │
│  (Aggregate Root)   │                 │  (Aggregate Root)   │
└─────────────────────┘                 └─────────────────────┘

┌─────────────────────┐                 ┌─────────────────────┐
│     NewsArticle     │                 │   ContactInquiry    │
│  (Aggregate Root)   │                 │  (Aggregate Root)   │
├─────────────────────┤                 ├─────────────────────┤
│ 1:1 Content Body    │                 │ Lead Intake & SLAs  │
└─────────────────────┘                 └─────────────────────┘
```

---

## AUDIT BOUNDARIES & CONCLUSIONS

### Known Facts (Verified Directly from Code)
* The platform catalogs two distinct, mutually exclusive domains: Coffee Equipment (`equipment`) and Beverage Ingredients (`ingredients`).
* Equipment products require mechanical and electrical specifications (groups, boiler type, voltage, power, capacity).
* Ingredient products require agronomic terroir and sensory attributes (origin, roast profile, cupping score, flavor notes, packaging).
* Orders rely on manual payment verification (VietQR transfer matching syntax `AURA ${orderId}` or COD); there is no automated payment gateway SDK.
* Checkout requires customer fulfillment data across 63 standard Vietnamese provinces.
* Products, categories, and articles must maintain immutable references for past orders and SEO backlinks.

### Assumptions (Reasonable Engineering Inferences)
* Single-currency operation strictly in Vietnamese Đồng (VND). Whole integer representations avoid floating-point rounding errors.
* Class Table Inheritance (Base `Product` + 1:1 extension tables) provides the optimal balance between query performance and schema integrity.
* Solution packages can be modeled as specialized products with composite description lines.

### Open Questions (Requiring Stakeholder Clarification)
* Whether multi-location inventory (HCM vs Hanoi warehouse) is needed now or deferred to Phase 3.
* The formal workflow for "Price on Contact" items (whether to forbid checkout and redirect to RFQ).
* Precise return windows and freight cost liability.

### Design Decisions (Agreed for Domain Architecture)
1. **Zero UI Persistence:** `formattedPrice` is strictly derived at runtime; only integer `price` is persisted.
2. **Immutable Transaction Snapshots:** `OrderItem` snapshots title, SKU, unit price, and specifications at purchase time.
3. **Soft Deletion Scope:** Applied to `Product`, `Category`, `Brand`, `User`, and `NewsArticle`; forbidden on `Order` and `OrderItem`.
4. **Vertical Partitioning:** Core product listing fields are partitioned from deep mechanical/sensory specifications and secondary media galleries.

---
**[END OF PHASE 1 SPECIFICATION — STOPPING AS DIRECTED]**  
*Awaiting user approval before proceeding to database schema design (Phase 2).*
