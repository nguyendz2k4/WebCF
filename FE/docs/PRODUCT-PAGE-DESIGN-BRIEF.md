# AURA COFFEE — PRODUCT CATALOG PAGE DESIGN BRIEF
**Project:** Aura Coffee Solutions — Product Listing & Catalog Page  
**Document:** `docs/PRODUCT-PAGE-DESIGN-BRIEF.md`  
**Version:** 1.0  
**Status:** Approved Design Brief & Technical Specification  
**Source:** Post `/grill-me` alignment session — 26/08/2026  
**Related Documents:** `AURA-DESIGN-DIRECTION.md`, `AURA-BRAND-DIRECTION.md`

---

## 1. EXECUTIVE SUMMARY & BRAND ESSENCE

Aura Coffee is a premium B2B coffee solutions atelier catering to specialty café owners, boutique hotel F&B directors, and enterprise coffee chains.

The Product Catalog (`/products`) extends the atelier aesthetic established on the homepage into a **high-utility, sensory discovery experience**. It balances two opposing tensions:
1. **Atelier Brand Emotion:** Calm ivory grounds, refined Cormorant Garamond serif headlines, generous breathing room, subtle copper accents, and high-craft imagery.
2. **B2B Procurement Velocity:** Immediate domain switching (Equipment vs. Ingredients), faceted precision filtering, real-time debounced search, quick spec drawer evaluation, domain-aware sorting, and seamless additions to the **Hồ Sơ Dự Án (Project Quote Dossier)**.

> **Design Principle:** Spec speaks last in presentation, but discovery must be instant in execution. The catalog must never feel like a sterile enterprise ERP grid or a cluttered retail marketplace.

---

## 2. THE 3 GOLDEN RULES (CATALOG APPLIED)

Every UI element and interaction in the catalog must adhere strictly to the 3 Golden Rules:

### Rule 1 — Less Color, More Air
- **Grounds (80%):** Warm ivory `--cream-base` (`#F5EFE6`) and aged paper `--cream-deep` (`#EDE4D7`).
- **Ink (15%):** Espresso ink `--espresso-ink` (`#1A1208`) for maximum typographic legibility.
- **Copper (5%):** `--copper-accent` (`#A0622A`) reserved solely for active domain indicators, interactive hover moments, and primary CTA triggers.
- **Air:** Open white space and 1px hairlines (`--cream-shadow`) replace boxed card containers, borders, and shadows.

### Rule 2 — One Page, One Clear Mission
- The mission of `/products` is **effortless product discovery and project dossier compilation**.
- Avoid pop-up clutter, promotional banners, or competing secondary buttons.

### Rule 3 — Spec Speaks Last
- Lead with machine architecture/craft and terroir/provenance imagery.
- Present essential specs as clean typographic data rows (`DM Sans 13px`), avoiding loud badges or dense technical tables on catalog cards.

---

## 3. DOMAIN ARCHITECTURE & INFORMATION ARCHITECTURE (IA)

The catalog covers two distinct commercial domains unified under the `/products` route:

```
                                  /products
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
   DOMAIN 1: THIẾT BỊ CÀ PHÊ                 DOMAIN 2: NGUYÊN LIỆU PHA CHẾ
        (COFFEE EQUIPMENT)                        (BEVERAGE INGREDIENTS)
                 │                                         │
  • Espresso Machines (1/2/3 Group)          • Specialty Beans (Single Origin/Blends)
  • Coffee Grinders (On-Demand/Single-Dose)  • Syrups & Sauces (Fruit, Floral, Classic)
  • Coffee Roasters (Sample/Production)      • Specialty Powders & Base Mixes
  • Barista Gear & Manual Brewing            • Ceremonial & Barista Grade Matcha
  • Water Filtration & Maintenance           • Specialty Tea & Chocolate Bases
```

### URL State Contract & Deep Linking
The catalog maintains complete bidirectional synchronization with URL query parameters:

| Parameter | Type | Allowed Values / Examples | Description |
|---|---|---|---|
| `domain` | string | `equipment` \| `ingredients` | Active top-level domain (Default: `equipment`) |
| `category` | string | `espresso-machines`, `coffee-beans`, `syrups`, etc. | Category slug filter |
| `brand` | string | `sanremo`, `mahlkonig`, `giesen`, `1883-routin`, etc. | Brand filter |
| `origin` | string | `da-lat`, `son-la`, `ethiopia`, `colombia`, `japan-uji` | Origin region (Ingredients) |
| `roast` | string | `light`, `medium`, `medium-dark`, `dark` | Roast profile (Beans) |
| `specs` | string | `1-group`, `2-group`, `3-group`, `dual-boiler`, etc. | Equipment specs |
| `min_price` | number | e.g. `10000000` | Minimum price filter (VND) |
| `max_price` | number | e.g. `250000000` | Maximum price filter (VND) |
| `sort` | string | `curated`, `price_asc`, `price_desc`, `cupping_desc`, `capacity`, `newest` | Ordering algorithm |
| `page` | integer | `1`, `2`, `3`... | Numbered page index (12 items/page) |
| `view` | string | `grid` \| `list` | View mode toggle (Default: `grid`) |

---

## 4. COMPLETE CATEGORY TAXONOMY

```
── [DOMAIN 1: THIẾT BỊ CÀ PHÊ (COFFEE EQUIPMENT)]
   ├── 01. Máy Pha Cà Phê (Espresso Machines)
   │     ├── 1 Group (Boutique Cafe / Cupping Lab / Studio)
   │     ├── 2 Groups (Commercial Standard — 150-300 cups/day)
   │     └── 3 Groups (High-Volume / Enterprise Chain)
   ├── 02. Máy Xay Cà Phê (Coffee Grinders)
   │     ├── On-Demand / High-Speed Espresso Grinders
   │     ├── Single-Dose / Specialty Cupping Grinders
   │     └── Industrial / Roastery Retail Batch Grinders
   ├── 03. Máy Rang Cà Phê (Coffee Roasters)
   │     ├── Sample & Lab Roaster (500g – 1kg)
   │     └── Commercial Shop Roaster (3kg – 15kg+)
   ├── 04. Dụng Cụ Barista & Brewing (Barista Equipment)
   │     ├── Dụng cụ nén & phân bổ (Tamper, Distributor, WDT, Puck Screen)
   │     ├── Manual Brewing (Pour-Over V60, Chemex, Aeropress, Cold Drip)
   │     └── Ca đánh sữa, cân điện tử độ trễ 0.1s, nhiệt kế
   └── 05. Phụ Kiện & Bảo Dưỡng (Accessories & Care)
         ├── Hệ thống lọc nước & khử khoáng chuyên dụng
         ├── Linh kiện tay cầm (Portafilter, Basket, Shower Screen)
         └── Hóa chất & dung dịch vệ sinh máy (Cafiza, Biocaf, Rinza)

── [DOMAIN 2: NGUYÊN LIỆU PHA CHẾ (BEVERAGE INGREDIENTS)]
   ├── 01. Hạt Cà Phê Đặc Sản (Specialty Coffee Beans)
   │     ├── Single Origin Việt Nam (Cầu Đất, Trạm Hành, Sơn La, Điện Biên)
   │     ├── Micro-lot Quốc Tế (Ethiopia Guji, Colombia Geisha, Kenya AA)
   │     └── Aura Signature Espresso Blends (Cân bằng & tối ưu cost quán)
   ├── 02. Syrups (Siro Pha Chế Cao Cấp)
   │     ├── Classic Aromas (Vanilla Bourbon, Salted Caramel, Roasted Hazelnut)
   │     └── Fruit & Floral (Yuzu Citrus, Elderflower, White Peach, Hibiscus)
   ├── 03. Sauces (Sốt Pha Chế Cao Cấp)
   │     └── Dark Cocoa 70%, Salted Butter Caramel, White Chocolate Mocha
   ├── 04. Bột & Nguyên Liệu Cốt (Specialty Powders)
   │     └── Frappe Base chống tách lớp, Bột kem béo non-dairy, Vanilla Frappe
   ├── 05. Matcha & Houjicha Nhật Bản (Ceremonial & Culinary)
   │     ├── Ceremonial Grade (Uji, Kyoto — Dành cho trà đạo & Usucha)
   │     └── Barista / Culinary Grade (Dành cho Matcha Latte & Dessert)
   ├── 06. Trà Đặc Sản (Specialty Tea Base)
   │     ├── Trà Ô Long Bốn Mùa, Trà Đen Ceylon đậm vị cho trà sữa
   │     └── Trà Hoa Cúc, Hoa Nhài, Trà Trái Cây Cold Brew
   ├── 07. Socola & Cacao Nguyên Chất (Chocolate & Cocoa)
   │     └── Bột Cacao Lên Men Đắk Lắk, Socola hạt nguyên chất Single Origin
   └── 08. Nguyên Liệu Topping & Khác (Other Ingredients)
```

---

## 5. INTERACTION & UX SPECIFICATIONS

### 5.1. Top-Level Header & Domain Switcher
- **Visual Style:** Minimalist, editorial typography.
- **Domain Switcher Component:** Segmented pill switcher with warm ivory surface (`--cream-deep`) and smooth highlight transitions.
- **Copy:**
  - `Thiết Bị Cà Phê (Equipment)`
  - `Nguyên Liệu Pha Chế (Ingredients)`
- **Behavior:** Switching domain immediately updates the category tree, filter facets, sorting options, and resets page to `1`.

### 5.2. Search Bar & Typeahead Discovery
- **Debounced Live Search:** 250ms debouncing queries name, brand, origin, flavor notes, and technical specs.
- **Typeahead Dropdown (Focus state + length >= 2):**
  - **Category Shortcuts:** 1-click jump to relevant category.
  - **Top 3 Product Previews:** Thumbnail + Title + Price + "Thêm vào Hồ Sơ".
  - **Trending Keywords:** Quick search pills (e.g. *Sanremo Cafe Racer, Cầu Đất Arabica, Matcha Uji, Mazzer ZM*).
  - **Keyboard Navigation:** Arrow keys, Enter to navigate, Escape to close.

### 5.3. Left Editorial Filter Rail (Desktop)
- **Aesthetic:** Editorial index rail without heavy card borders or dark backgrounds.
- **Typography:** DM Sans 12px uppercase tracking-wider section titles (`--espresso-light`), 14px filter options.
- **Facet Accordions:**
  - *Domain 1 (Equipment):* Danh mục (Category), Phân khúc/Nhóm (Groups/Application), Loại Boiler (Dual/Multi/HX), Công suất (Power/Voltage), Thương hiệu (Brand), Khoảng giá (Price Range).
  - *Domain 2 (Ingredients):* Danh mục (Category), Vùng trồng/Xuất xứ (Origin), Mức độ rang (Roast Level), Điểm Cupping (SCA Score), Nhóm hương vị (Flavor Profile), Quy cách đóng gói (Packaging Format), Khoảng giá (Price Range).
- **Sticky Active Filter Chips:** Displayed horizontally above the product grid with count badge and "Xóa tất cả" action.

### 5.4. Sorting Behavior (Domain-Aware)
- `curated`: **Tuyển chọn Aura (Curated Atelier)** — *Default*. Signature products and flagships first.
- `price_asc`: **Giá: Thấp đến Cao**
- `price_desc`: **Giá: Cao đến Thấp**
- `newest`: **Mới nhất / Vụ mùa mới**
- `capacity`: **Quy mô & Công suất quán** *(Equipment domain only)*
- `cupping_desc`: **Điểm Cupping cao nhất (86+)** *(Ingredients domain only)*

### 5.5. Product Card Architecture (3-Column Editorial Grid)

#### A. Equipment Card Specification
- **Image Container:** Warm neutral ivory frame (`--cream-deep`), 4:3 aspect ratio, full machine silhouette on neutral cream background.
- **Header Label:** Brand name in `DM Sans 11px uppercase tracking-wider` (`--espresso-light`).
- **Title:** Model Name in `Cormorant Garamond 20px Regular` (`--espresso-ink`).
- **Key Spec Row:** Minimalist data line: `2 Groups · Dual Boiler 8.5L · 4.8kW`.
- **Price:** Formatted VND in `Cormorant Garamond 18px` with *"Giá niêm yết"* or *"Giá từ"*.
- **Actions Bar:**
  - Primary CTA: **"Thêm vào Hồ Sơ"** (Add to Dossier).
  - Secondary Action: Text link **"Đặt lịch Demo →"**.
  - Visible Quick Trigger: **"Xem nhanh"** icon button positioned on the image container.

#### B. Ingredients Card Specification
- **Image Container:** Editorial pouch/bottle packaging photography with terroir tag (`Cầu Đất, Đà Lạt · 1.600m`).
- **Header Label:** Origin / Sub-region (`DM Sans 11px uppercase tracking-wider`).
- **Title:** Bean / Ingredient Name (`Cormorant Garamond 20px Regular`).
- **Sensory / Attribute Row:** 3 Flavor notes in pill tags (`Jasmine`, `Yellow Peach`, `Bergamot`) or Roast profile / Cupping score badge (`87.5 SCA`).
- **Price:** Formatted VND (`380.000 ₫ / Túi 1kg`).
- **Actions Bar:**
  - Primary CTA: **"Thêm vào Hồ Sơ"**.
  - Secondary Action: Text link **"Yêu cầu Mẫu thử →"** (Sample Pack Request).
  - Visible Quick Trigger: **"Xem nhanh"** icon button on the image container.

### 5.6. Quick Spec Drawer (Side Sheet)
- **Primary Click on Card:** Navigates directly to full product page (`/products/[slug]`).
- **Secondary Action ("Xem nhanh"):** Opens a slide-over sheet (`width: 480px` on desktop, `100vw` on mobile) from the right.
- **Drawer Specifications:**
  - **Preserves Catalog Position:** Background interaction locked, scroll position strictly preserved upon open/close.
  - **Context-Aware Content:**
    - *Equipment:* Brand, machine type, boiler type & capacity, power rating/voltage, dimensions, warranty, and lead time.
    - *Coffee Beans:* Origin, terroir/altitude, process method, roast profile, cupping score, sensory notes, and pack format.
    - *Ingredients:* Brand, volume/weight, Brix/concentration, application guide, and shelf life.
  - **Actions:** Primary button **"Thêm vào Hồ Sơ Dự Án"** + prominent text link **"Xem trang chi tiết đầy đủ →"**.
  - **Accessibility:** ESC key to close, focus trap, ARIA dialog attributes.

### 5.7. Pagination Model
- **Numbered Editorial Pagination:** `← 01  02  03  04 →`
- **Product Counter:** `"Hiển thị 1 – 12 trên 48 sản phẩm"`
- **URL Synchronization:** Page changes update `?page=X` and scroll smoothly back to the top of the grid.

### 5.8. Empty & No-Result State Recovery Flow
When no products match the query:
1. **Editorial Notice:** Cormorant Garamond headline: *"Không tìm thấy sản phẩm phù hợp"*.
2. **One-Click Reset:** Button: **"Đặt lại tất cả bộ lọc"**.
3. **B2B Concierge Sourcing Banner:**
   - Text: *"Bạn đang tìm kiếm cấu hình máy hoặc nguồn hạt đặc biệt cho dự án? Đội ngũ chuyên gia Aura Coffee sẵn sàng tìm kiếm và nhập khẩu riêng cho bạn."*
   - CTA Button: **"Gửi yêu cầu tìm nguồn riêng →"** (Opens Quote/Dossier Drawer with prefilled inquiry).
4. **Curated Recommendations:** Renders 3 featured flagship products (*"Sản phẩm tiêu biểu từ Atelier"*).

---

## 6. RESPONSIVE DESIGN (DESKTOP & MOBILE)

| Screen Width | Layout & Columns | Filter Presentation | Card Behavior |
|---|---|---|---|
| **Desktop (≥ 1280px)** | 3-Column Product Grid + Left Filter Rail (280px) | Persistent editorial rail with accordion groups | Hover reveals actions, "Xem nhanh" trigger on image frame |
| **Tablet (768px – 1023px)** | 2-Column Product Grid | Slide-over filter sheet triggered by Top Filter Bar button | Clean tap targets, persistent action row on card |
| **Mobile (< 768px)** | 1-Column Editorial Cards | Full-screen slide-over drawer with sticky bottom apply CTA | Large touch targets (min 44px), explicit "Xem nhanh" text/icon |

---

## 7. DATA SCHEMA & TYPESCRIPT SPECIFICATION

File location: `src/types/product.ts`

```typescript
export type ProductDomain = 'equipment' | 'ingredients';

export type EquipmentCategory = 
  | 'espresso-machines' 
  | 'coffee-grinders' 
  | 'coffee-roasters' 
  | 'barista-gear' 
  | 'accessories';

export type IngredientCategory = 
  | 'coffee-beans' 
  | 'syrups' 
  | 'sauces' 
  | 'powders' 
  | 'matcha' 
  | 'chocolate' 
  | 'tea' 
  | 'other';

export interface BaseProduct {
  id: string;
  slug: string;
  domain: ProductDomain;
  name: string;
  brand: string;
  shortDescription: string;
  price: number;
  formattedPrice: string;
  priceType: 'fixed' | 'from' | 'contact';
  images: string[];
  inStock: boolean;
  leadTime?: string;
  isFeatured?: boolean;
  createdAt: string;
}

export interface EquipmentProduct extends BaseProduct {
  domain: 'equipment';
  category: EquipmentCategory;
  specs: {
    groups?: number;
    boiler?: string;
    boilerCapacity?: string;
    pump?: string;
    power?: string;
    voltage?: '220V' | '380V' | '220V/380V';
    dimensions?: string;
    weight?: string;
    warranty: string;
  };
  suitableFor: ('home' | 'boutique-cafe' | 'high-volume' | 'roastery')[];
}

export interface IngredientProduct extends BaseProduct {
  domain: 'ingredients';
  category: IngredientCategory;
  origin?: string;
  subRegion?: string;
  altitude?: string;
  process?: string;
  roastProfile?: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  cuppingScore?: number;
  flavorNotes?: string[];
  packaging: {
    unitSize: string; // e.g. "1kg", "750ml", "Box of 6"
    caseSize?: string;
  };
  shelfLife?: string;
}

export type Product = EquipmentProduct | IngredientProduct;
```

---

## 8. COMPONENT BREAKDOWN & DIRECTORY MAP

```
src/
├── app/
│   └── products/
│       ├── page.tsx                    # Main Catalog Page (Server component + Suspense wrapper)
│       └── [slug]/
│           └── page.tsx                # Product Detail Page (PDP)
│
├── components/
│   └── catalog/
│       ├── CatalogHeader.tsx           # Page title + Domain Switcher pill
│       ├── CatalogSearchBar.tsx        # Search input + Typeahead overlay
│       ├── EditorialFilterRail.tsx     # Left rail accordion filter system
│       ├── ActiveFilterChips.tsx       # Sticky active chips with clear-all
│       ├── ProductGrid.tsx             # 3-column responsive catalog grid
│       ├── EquipmentCard.tsx           # Domain 1 tailored product card
│       ├── IngredientCard.tsx          # Domain 2 tailored product card
│       ├── QuickSpecDrawer.tsx         # Slide-over preview sheet (context-aware)
│       ├── CatalogPagination.tsx       # Numbered editorial pagination
│       ├── EmptyCatalogState.tsx       # Zero-result concierge assisted recovery
│       ├── MobileFilterDrawer.tsx      # Mobile slide-over filter sheet
│       └── index.ts                    # Component export barrel
│
├── data/
│   └── products.ts                     # Curated mock dataset of equipment & ingredients
│
└── types/
    └── product.ts                      # Core product interfaces and facet types
```

---

## 9. DESIGN QUALITY CHECKLIST

Before any code is committed, the implementation must pass this checklist:
- [ ] No arbitrary hex codes in JSX (use CSS variables from `globals.css`).
- [ ] No heavy card borders, drop shadows, or glassmorphism panels on in-page layout elements.
- [ ] Cormorant Garamond is used for headlines and prices; DM Sans is used for UI labels and specs.
- [ ] URL parameters update reliably on search, filter, sort, domain switch, and pagination.
- [ ] Quick Spec Drawer locks background scroll and traps keyboard focus without jumping the viewport.
- [ ] Empty state provides a B2B concierge inquiry path instead of a dead-end message.
- [ ] Zero layout shift (CLS) on image loading with Next.js `<Image />`.
