# AURA COFFEE — PRODUCT CATALOG PAGE COMPOSITION
**Project:** Aura Coffee Solutions — B2B Product Catalog & Procurement Engine  
**Document Code:** `PRODUCT-PAGE-COMPOSITION`  
**Version:** 1.0 — Approved Technical & Editorial Design Specification  
**Source:** Post `/ui-ux-pro-max` & `/grill-me` alignment session — 26/08/2026  
**Companion Documents:** `AURA-DESIGN-DIRECTION.md` · `AURA-BRAND-DIRECTION.md` · `PRODUCT-PAGE-DESIGN-BRIEF.md` · `PRODUCT-DATA-AUDIT.md`  
**Rule:** One clear hierarchy · High scanability · Restrained visual decoration · Zero card clutter · Zero decorative fluff

---

## 1. COMPOSITION PHILOSOPHY & EDITORIAL ARCHITECTURE

The Aura Product Catalog (`/products`) is a **high-utility, sensory procurement broadsheet**. It translates the Japanese atelier aesthetic (*monozukuri*) and Nordic roasting precision of the brand into an ergonomic discovery environment for café owners, hotel F&B directors, and enterprise coffee chains.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│                         80% WARM CREAM GROUND (--cream-base / --cream-deep)               │
│                      Ivory washi texture · Generous architectural whitespace             │
│                                                                                          │
├────────────────────────────────────────┬─────────────────────────────────────────────────┤
│          15% ESPRESSO INK              │               5% RAW COPPER ACCENT              │
│     (--espresso-ink / --espresso-mid)   │                 (--copper-accent)               │
│   Cormorant Garamond & DM Sans data    │      Domain indicators, hover moments, CTAs     │
└────────────────────────────────────────┴─────────────────────────────────────────────────┘
```

### The 3 Golden Rules Applied to Catalog:
1. **Less Color, More Air:** 80% warm cream (`#F5EFE6`), 15% espresso sumi ink (`#1A1208`), 5% copper accent (`#A0622A`). Structure is created through 1px architectural hairlines (`--cream-shadow`) and whitespace (*Ma*), never through heavy boxed cards or drop shadows.
2. **One Viewport, One Clear Mission:** Effortless product evaluation and project dossier compilation. No pop-up banners, no countdown timers, no screaming discount badges.
3. **Spec Speaks Last:** Visual craft and terroir storytelling lead the card presentation; technical data rows provide instant clarity without cognitive overload.

---

## 2. FULL PAGE SPATIAL WIREFRAME (DESKTOP ≥ 1280px)

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR: Wordmark [Aura Coffee]          Links (4)                 [Hồ Sơ Dự Án (2)] (CTA) │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ PAGE INTRODUCTION                                                                         │
│ [01/02] TUYỂN CHỌN VẬT TƯ & THIẾT BỊ · ATELIER CATALOG                                    │
│ Bộ Sưu Tập Thiết Bị & Nguyên Liệu Chuẩn Atelier                                           │
│ Tuyển chọn máy pha đa nồi hơi, máy xay chuyên nghiệp và nguồn hạt đặc sản từ Cầu Đất      │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ UTILITY CONTROL BAR                                                                       │
│ ┌──────────────────────────────────────────────┐  ┌─────────────────────────────────────┐ │
│ │ DOMAIN SWITCHER: [ THIẾT BỊ ]  Nguyên Liệu   │  │ SEARCH: [🔍 Tìm model, hạt, vùng...]│ │
│ └──────────────────────────────────────────────┘  └─────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ HORIZONTAL CATEGORY SUB-BAR                                                               │
│ [Tất cả]  Máy Pha Cà Phê  Máy Xay Cà Phê  Máy Rang  Dụng Cụ Barista  Phụ Kiện & Bảo Dưỡng │
├─────────────────────────────────┬─────────────────────────────────────────────────────────┤
│ LEFT EDITORIAL FILTER RAIL      │ PRODUCT LISTING GRID VIEW                               │
│ (Width: 280px, Sticky)          │                                                         │
│                                 │ [Active Chips: Sanremo ✕ | 2 Groups ✕ | Xóa tất cả]     │
│ [✕] BỘ LỌC TÌM KIẾM             │ Hiển thị 1 – 12 trên 48 sản phẩm   [Sắp xếp: Tuyển chọn]│
│                                 │ ─────────────────────────────────────────────────────── │
│ ▾ PHÂN KHÚC MÁY                 │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│   [ ] 1 Group (Studio/Lab)      │ │              │ │              │ │              │      │
│   [✓] 2 Groups (Standard)       │ │  4:3 Image   │ │  4:3 Image   │ │  4:3 Image   │      │
│   [ ] 3 Groups (High-Volume)    │ │              │ │              │ │              │      │
│                                 │ ├──────────────┤ ├──────────────┤ ├──────────────┤      │
│ ▾ LOẠI NỒI HƠI                  │ │SANREMO·ITALY │ │VICTORIA ARD. │ │LA MARZOCCO   │      │
│   [ ] Multi-Boiler PID          │ │Cafe Racer 2G │ │Black Eagle 2G│ │Linea Mini 1G │      │
│   [ ] Dual Boiler               │ │2G·8.5L·4.8kW │ │2G·T3 Multi·5k│ │1G·Dual·1.8kW │      │
│                                 │ │245.000.000 ₫ │ │310.000.000 ₫ │ │145.000.000 ₫ │      │
│ ▾ THƯƠNG HIỆU                   │ │[+ Hồ Sơ] Demo│ │[+ Hồ Sơ] Demo│ │[+ Hồ Sơ] Demo│      │
│   [✓] Sanremo                   │ └──────────────┘ └──────────────┘ └──────────────┘      │
│   [ ] Victoria Arduino          │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│   [ ] Mahlkönig                 │ │  Row 2 Item  │ │  Row 2 Item  │ │  Row 2 Item  │      │
│                                 │ └──────────────┘ └──────────────┘ └──────────────┘      │
│ ▾ KHOẢNG GIÁ ĐẦU TƯ             │ ─────────────────────────────────────────────────────── │
│   [ 10.000.000 — 500.000.000 ₫ ]│ NUMBERED EDITORIAL PAGINATION                           │
│                                 │ ← Trang Trước    01   [02]   03   04   ...   12   Sau → │
├─────────────────────────────────┴─────────────────────────────────────────────────────────┤
│ B2B CONCIERGE SOURCING BANNER                                                             │
│ "Bạn đang tìm kiếm cấu hình máy hoặc nguồn hạt đặc biệt cho dự án?"                       │
│ [Gửi Yêu Cầu Tìm Nguồn Riêng →]                                                           │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ FOOTER: Aura Atelier · Kỹ Sư Trực 24/7 (● Live) · Điều Khoản & Liên Hệ                   │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. DETAILED COMPONENT SPECIFICATIONS (14 CORE MODULES)

### 3.1. Page Introduction (Header & Sensory Framing)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [LABEL]    TUYỂN CHỌN VẬT TƯ & THIẾT BỊ · CHƯƠNG 02                                      │
│ [H1]       Bộ Sưu Tập Thiết Bị & Nguyên Liệu Chuẩn Atelier                               │
│ [SUB]      Tuyển chọn máy pha đa nồi hơi chuẩn SCA, máy xay độ chính xác micromet,      │
│            và những mẻ rang đặc sản thu hoạch tại độ cao 1.650m Cầu Đất.                 │
│ ──────────────────────────────────────────────────────────────────────────────────────── │
```

* **Purpose:** Establish the calm, authoritative tone of the catalog before tactical shopping begins.
* **Layout:** Left-aligned, vertical stack with a 1px `--cream-shadow` hairline bottom border.
* **Typography Hierarchy:**
  * **Chapter Label:** `DM Sans 11px uppercase`, `weight: 500`, `letter-spacing: 0.14em`, color: `--espresso-light`.
  * **H1 Title:** `Cormorant Garamond 400 Regular`, `clamp(36px, 5vw, 56px)`, line-height: `1.15`, color: `--espresso-ink`.
  * **Subtitle:** `DM Sans 400 Regular`, `16px`, line-height: `1.75`, color: `--espresso-mid`, max-width: `720px`.
* **Visual Restraint:** No promotional banners, no countdown sales timers, no background graphic clutter.

---

### 3.2. Search (Debounced Live Search & Typeahead Discovery)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  [🔍]  Tìm kiếm máy pha, máy xay, nguồn hạt, hương vị hoặc thông số...             [✕]   │
└──────────────────────────────────────────────────────────────────────────────────────────┘
  ▼ (Dropdown appears on focus with query >= 2 chars)
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ DANH MỤC GỢI Ý                                                                           │
│ • Máy pha cà phê 2 Group · Thiết bị chiết xuất                                           │
│ • Hạt Cà Phê Single Origin Cầu Đất · Arabica 1.650m                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ SẢN PHẨM PHÙ HỢP (TOP 3)                                                                 │
│ ┌────┐ Sanremo Cafe Racer 2 Groups                    245.000.000 ₫                      │
│ │ 🖼️ │ Dual PID · 8.5L · Áp suất 9 bar               [+ Thêm vào Hồ Sơ]                 │
│ └────┘ ───────────────────────────────────────────────────────────────────────────────── │
│ ┌────┐ Mahlkönig EK43S Allround Grinder                78.500.000 ₫                      │
│ │ 🖼️ │ Đĩa xay đúc 98mm · Tốc độ 1450 rpm            [+ Thêm vào Hồ Sơ]                 │
│ └────┘                                                                                   │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ TỪ KHÓA ĐƯỢC TÌM KIẾM NHIỀU                                                              │
│ [Sanremo Cafe Racer]  [Cầu Đất Yellow Bourbon]  [Matcha Uji]  [Victoria Arduino]         │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Positioning:** Integrated into the upper utility bar, directly accessible on all viewports.
* **Input Specs:**
  * Background: `--cream-deep` (`#EDE4D7`).
  * Border: 1px `--cream-shadow` (`#D9CCBB`).
  * Focus State: 1px solid `--copper-accent` (`#A0622A`), zero layout shifting.
  * Search Icon: Phosphor `MagnifyingGlass` (18px, 1.5px stroke, `--espresso-light`).
  * Clear Button: Phosphor `XCircle` (16px, `--espresso-light`), appears when text is entered.
* **Debounce & Token Matching:**
  * Debounce interval: `250ms`.
  * Multi-field token match: `name`, `brand`, `origin`, `flavorNotes`, `specs.boiler`, `specs.groups`.
* **Typeahead Dropdown Architecture:**
  * Background: `--cream-base` with 1px hairline border.
  * Z-index: `50` (floating overlay, no in-page layout push).
  * 3 Sections:
    1. Category shortcuts (instant jump).
    2. Top 3 matching product previews with thumbnail, specs, price, and instant "Thêm vào Hồ Sơ" action.
    3. Curated keyword pills.
* **Keyboard & Accessibility:**
  * `role="combobox"`, `aria-expanded`, `aria-autocomplete="list"`.
  * `ArrowDown` / `ArrowUp` to cycle suggestions, `Enter` to navigate, `Escape` to dismiss.

---

### 3.3. Product Domain Switcher (B2B Split Engine)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────┬──────────────────────────────────────┐         │
│  │   ● THIẾT BỊ CÀ PHÊ (Equipment)      │     NGUYÊN LIỆU PHA CHẾ (Ingredients)│         │
│  │     Máy pha, máy xay, máy rang...    │     Hạt đặc sản, siro, sốt, trà...   │         │
│  └──────────────────────────────────────┴──────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Purpose:** Instantly pivot between two completely distinct B2B procurement universes.
* **Visual Architecture:**
  * Ground: Recessed ivory track in `--cream-deep` (`#EDE4D7`) with 1px `--cream-shadow` border.
  * Active Tab: Raised ivory surface (`--cream-base`), 1px hairline, DM Sans 13px 500 `--espresso-ink`. Accompanied by a 4px circular `--copper-accent` bullet.
  * Inactive Tab: DM Sans 13px 400 `--espresso-light`. Hover: `--espresso-ink`, 200ms ease.
* **State Machine & URL Contract:**
  * Switches URL query parameter: `?domain=equipment` $\leftrightarrow$ `?domain=ingredients`.
  * Automatically resets: `category`, active facet filters, domain-specific sort options, and sets `page=1`.
  * Transition: 150ms opacity fade on product grid to avoid abrupt layout flash.

---

### 3.4. Category Navigation (Horizontal Sub-Bar & Accordion Tree)

```
── [DOMAIN: THIẾT BỊ CÀ PHÊ] ───────────────────────────────────────────────────────────────
   [ Tất cả (48) ]   Máy Pha Cà Phê (18)   Máy Xay Cà Phê (12)   Máy Rang (4)   Dụng Cụ (10)   Phụ Kiện (4)
   ───────────────── (2px copper underline on active)

── [DOMAIN: NGUYÊN LIỆU PHA CHẾ] ──────────────────────────────────────────────────────────
   [ Tất cả (64) ]   Hạt Cà Phê (24)   Siro 1883 (14)   Sốt Cao Cấp (8)   Matcha Uji (6)   Trà & Cacao (12)
```

* **Positioning:** Directly beneath the Domain Switcher.
* **Desktop Styling:**
  * Horizontal inline typographic text row.
  * Active Category: DM Sans 13px 500 `--espresso-ink` with a continuous 2px solid `--copper-accent` underline.
  * Inactive Category: DM Sans 13px 400 `--espresso-light`.
  * Item Count: DM Sans 11px `--espresso-light` in parentheses.
* **Mobile / Tablet Styling:**
  * Horizontal single-row scroll with smooth momentum and hidden scrollbar.
  * Left and right subtle fade masks indicate scrollable overflow.

---

### 3.5. Filter Sidebar (Left Editorial Facet Rail)

```
┌────────────────────────────────────────┐
│ [✕] BỘ LỌC TÌM KIẾM          Xóa tất cả│
├────────────────────────────────────────┤
│ ▾ DANH MỤC THIẾT BỊ                    │
│   (•) Tất cả thiết bị             (48) │
│   ( ) Máy Pha Cà Phê              (18) │
│   ( ) Máy Xay Cà Phê              (12) │
│   ( ) Máy Rang Cà Phê              (4) │
├────────────────────────────────────────┤
│ ▾ PHÂN LOẠI NHÓM (GROUPS)              │
│   [ ] 1 Group (Boutique / Lab)     (6) │
│   [✓] 2 Groups (Commercial Std)   (10) │
│   [ ] 3 Groups (High-Volume)       (2) │
├────────────────────────────────────────┤
│ ▾ LOẠI NỒI HƠI (BOILER)                │
│   [ ] Multi-Boiler T3 / Independent(8) │
│   [✓] Dual Boiler PID              (6) │
│   [ ] Heat Exchanger (HX)          (4) │
├────────────────────────────────────────┤
│ ▾ THƯƠNG HIỆU                          │
│   [✓] Sanremo (Ý)                  (6) │
│   [ ] Victoria Arduino (Ý)         (4) │
│   [ ] Mahlkönig (Đức)              (4) │
│   [ ] Giesen (Hà Lan)              (2) │
├────────────────────────────────────────┤
│ ▾ ĐIỆN ÁP VẬN HÀNH                     │
│   [ ] 220V (1 Phase)              (14) │
│   [ ] 380V (3 Phase Công Nghiệp)   (4) │
├────────────────────────────────────────┤
│ ▾ KHOẢNG GIÁ ĐẦU TƯ                    │
│   Từ: 50.000.000 ₫ — 350.000.000 ₫     │
│   [●═══════════════════●─────────────] │
└────────────────────────────────────────┘
```

* **Layout & Geometry:**
  * Width: Fixed `280px` on desktop (≥ 1280px).
  * Positioning: Sticky container (`top: 100px`, max-height: `calc(100vh - 120px)`, overflow-y: auto).
  * Structure: Clean vertical ledger separated by 1px `--cream-shadow` hairlines. Zero card containers.
* **Facet Architecture per Domain:**

| Domain | Facet Dimension | Control Type | Target Schema Attribute |
|---|---|---|---|
| **Equipment** | Phân loại Nhóm (Groups) | Multi-checkbox | `specs.groups` (1, 2, 3) |
| **Equipment** | Hệ thống Nồi hơi | Multi-checkbox | `specs.boiler` |
| **Equipment** | Thương hiệu (Brand) | Multi-checkbox | `brand` |
| **Equipment** | Điện áp & Công suất | Multi-checkbox | `specs.voltage` |
| **Equipment** | Phân khúc vận hành | Multi-checkbox | `suitableFor` |
| **Equipment** | Khoảng giá đầu tư | Dual-range slider | `price` |
| **Ingredients** | Vùng trồng / Xuất xứ | Multi-checkbox | `origin` |
| **Ingredients** | Mức độ rang | Multi-checkbox | `roastProfile` |
| **Ingredients** | Điểm Cupping SCA | Radio stepper (85+, 87+, 88+) | `cuppingScore` |
| **Ingredients** | Nhóm hương vị | Multi-tag chips | `flavorNotes` |
| **Ingredients** | Quy cách đóng gói | Multi-checkbox | `packaging.unitSize` |
| **Ingredients** | Khoảng giá | Dual-range slider | `price` |

* **Active Filter Chips (Above Grid):**
  * Displays active selections: `Sanremo ✕`, `2 Groups ✕`, `Dual Boiler ✕`.
  * Clicking `✕` removes the individual facet; `Xóa tất cả` clears all filters with one click.

---

### 3.6. Sort Control (Domain-Aware Precision Ordering)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  Sắp xếp theo: [ Tuyển chọn Aura (Curated Atelier)                           ▾ ]         │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Positioning:** Top-right utility bar, aligned horizontally with product count.
* **Control Anatomy:** Custom minimalist select trigger in DM Sans 13px 500, with 1px `--cream-shadow` border, `--cream-deep` background, and copper focus state.
* **Domain-Aware Ordering Matrix:**

| Sort Key | Display Label (Vietnamese) | Domain Availability | Sorting Logic |
|---|---|---|---|
| `curated` | **Tuyển chọn Aura (Mặc định)** | All Domains | `isFeatured === true` first, then curated priority order |
| `price_asc` | **Giá: Thấp đến Cao** | All Domains | `price` ascending numeric |
| `price_desc` | **Giá: Cao đến Thấp** | All Domains | `price` descending numeric |
| `newest` | **Mới nhất / Vụ mùa mới** | All Domains | `createdAt` ISO timestamp descending |
| `capacity` | **Quy mô & Công suất quán** | Equipment Only | `specs.groups` descending (3G $\rightarrow$ 2G $\rightarrow$ 1G) |
| `cupping_desc` | **Điểm Cupping SCA (86+)** | Ingredients Only | `cuppingScore` descending numeric (89.5 $\rightarrow$ 85.0) |

---

### 3.7. Product Count & Active View Controls

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  Hiển thị 1 – 12 trên 48 sản phẩm              [Sắp xếp: Tuyển chọn ▾]  [⊞ Grid] [≡ List]│
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Product Counter:** DM Sans 13px Regular, color: `--espresso-light`. Updates dynamically on filter or search changes.
* **View Mode Switcher:**
  * Grid View: Phosphor `SquaresFour` icon (16px, 1.5px stroke).
  * List View: Phosphor `List` icon (16px, 1.5px stroke).
  * Active Mode: Outlined by a 1px `--cream-shadow` hairline on `--cream-deep` background.
  * Inactive Mode: Transparent, `--espresso-light`.

---

### 3.8. Product Grid System (3-Column Responsive Layout)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │                      │  │                      │  │                      │            │
│  │   Equipment Card     │  │   Equipment Card     │  │   Equipment Card     │            │
│  │   (Column 1)         │  │   (Column 2)         │  │   (Column 3)         │            │
│  │                      │  │                      │  │                      │            │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘            │
│  ──────────────────────────────────────────────────────────────────────────── (Hairline)  │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │   Row 2 / Col 1      │  │   Row 2 / Col 2      │  │   Row 2 / Col 3      │            │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘            │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Grid Dimensions:**
  * Desktop (≥ 1280px): `grid-template-columns: repeat(3, 1fr)`, column gap: `24px`, row gap: `40px`.
  * Tablet (768px – 1023px): `grid-template-columns: repeat(2, 1fr)`, gap: `24px 20px`.
  * Mobile (< 768px): `grid-template-columns: 1fr`, row gap: `32px`.
* **Visual Discipline:**
  * Zero card boxing: No elevated drop shadows, no full-perimeter thick borders.
  * Row Separation: Subtle 1px `--cream-shadow` hairlines separate successive rows for an editorial broadsheet cadence.
* **List View Alternative:**
  * Asymmetric horizontal split: 35% left image frame, 65% right data & procurement ledger.

---

### 3.9. Product Card Anatomy (Tailored per Domain)

#### Archetype A: Equipment Card (`EquipmentCard`)

```
┌──────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 4:3 Studio Image Frame                               │ │
│ │ [Neutral Cream Studio Photo]            [👁️ Xem nhanh]│ │
│ │                                                      │ │
│ └──────────────────────────────────────────────────────┘ │
│ SANREMO · ITALY                                          │
│ Cafe Racer Custom 2 Groups                               │
│ 2 Groups · Dual Boiler PID 8.5L · 4.8kW · 220V           │
│ Thích hợp: Specialty Café (200–350 ly/ngày)             │
│ Giá niêm yết: 245.000.000 ₫                              │
│ ┌──────────────────────────────┬───────────────────────┐ │
│ │ [+ Thêm vào Hồ Sơ]           │ Đặt Lịch Demo →       │ │
│ └──────────────────────────────┴───────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

* **Component Specifications:**
  1. **Image Frame:** 4:3 aspect ratio, background: `--cream-deep` (`#EDE4D7`), Next.js `<Image fill sizes="(max-width: 768px) 100vw, 33vw" />`.
  2. **Quick Spec Trigger:** Top-right floating icon button on hover (Phosphor `Eye` / `ArrowsOutSimple`, `--espresso-ink`, cream background).
  3. **Brand Stamp:** `DM Sans 11px uppercase`, `tracking: 0.14em`, color: `--espresso-light`.
  4. **Model Name:** `Cormorant Garamond 400 Regular`, `20px`, line-height: `1.25`, color: `--espresso-ink`.
  5. **Technical Data Line:** `DM Sans 13px Regular`, color: `--espresso-mid`. E.g.: `2 Groups · Dual Boiler PID 8.5L · 4.8kW`.
  6. **Operational Fit:** `DM Sans 12px Regular`, color: `--espresso-light`. E.g.: `Specialty Café · 200–350 ly/ngày`.
  7. **Price Display:** `Cormorant Garamond 18px Regular`, color: `--espresso-ink` (neutral, never neon).
  8. **Action Bar:**
     * Primary Action: Solid copper button `"Thêm vào Hồ Sơ"` (`#A0622A`, DM Sans 13px 500).
     * Secondary Action: Text link `"Đặt Lịch Demo →"` (`--espresso-mid` $\rightarrow$ `--copper-accent` on hover).

#### Archetype B: Ingredients Card (`IngredientCard`)

```
┌──────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 3:4 Packaging & Terroir Image Frame                  │ │
│ │ [CẦU ĐẤT · 1.650M ASL]                  [👁️ Xem nhanh]│ │
│ │                                                      │ │
│ └──────────────────────────────────────────────────────┘ │
│ SINGLE ORIGIN · CẦU ĐẤT, ĐÀ LẠT                          │
│ Yellow Bourbon Anaerobic Natural                         │
│ [ Hoa Lài ]  [ Mật Ong Rừng ]  [ Cam Bergamot ]          │
│ SCA 87.5 · Light-Medium Roast · Mẻ rang mẻ nhỏ           │
│ 380.000 ₫ / Túi 1kg                                      │
│ ┌──────────────────────────────┬───────────────────────┐ │
│ │ [+ Thêm vào Hồ Sơ]           │ Yêu Cầu Mẫu Thử →     │ │
│ └──────────────────────────────┴───────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

* **Component Specifications:**
  1. **Image Frame:** 3:4 or 4:3 ratio with stamped origin altitude tag in top-left corner (`CẦU ĐẤT · 1.650M`).
  2. **Origin Label:** `DM Sans 11px uppercase`, `tracking: 0.14em`, color: `--espresso-light`.
  3. **Product Name:** `Cormorant Garamond 20px Regular`, color: `--espresso-ink`.
  4. **Sensory Flavor Pills:** 3 clean typographic tags in `--cream-deep` background (`DM Sans 12px`).
  5. **SCA & Roast Marker:** `DM Sans 12px 500`, color: `--copper-accent`. E.g.: `SCA 87.5 · Light-Medium Roast`.
  6. **Unit Price:** `Cormorant Garamond 18px`, color: `--espresso-ink`. E.g.: `380.000 ₫ / Túi 1kg`.
  7. **Action Bar:**
     * Primary Action: Solid copper button `"Thêm vào Hồ Sơ"`.
     * Secondary Action: Text link `"Yêu Cầu Mẫu Thử →"`.

---

### 3.10. Pagination & Load Mechanics

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ← Trang Trước        01     [ 02 ]     03     04     ...     12        Trang Sau →      │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Model Decision:** Numbered Editorial Pagination (preserves B2B page referencing and quotation sharing).
* **Page Capacity:** `12 items per page` (forms a balanced 3x4 grid on desktop, 2x6 on tablet).
* **Anatomy & Styling:**
  * Inactive Page: DM Sans 14px 400 `--espresso-mid`, hover: `--espresso-ink`.
  * Active Page: DM Sans 14px 500 `--espresso-ink` with 1px `--cream-shadow` hairline border and `--cream-deep` background.
  * Nav Buttons (`Trang Trước` / `Trang Sau`): DM Sans 13px 500 `--espresso-mid`, disabled state: opacity 0.3.
* **Scroll & State Contract:**
  * Updates URL query parameter: `?page=2`.
  * Smoothly restores viewport scroll position to the top of `#catalog-grid` via Lenis.

---

### 3.11. Empty State (Catalog Initialization / Empty Database)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│                                      ╭───╮                                               │
│                                     │ ( ) │                                              │
│                                      ╰───╯                                               │
│                         Bộ Sưu Tập Đang Được Cập Nhật Mẻ Mới                             │
│                                                                                          │
│          Hiện tại toàn bộ mẻ rang và máy pha đang trong quá trình kiểm định SCA.         │
│          Quý khách có thể liên hệ trực tiếp với chuyên gia Aura để nhận danh mục riêng.  │
│                                                                                          │
│                             [ Gửi Yêu Cầu Đặt Hàng Trước → ]                             │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Trigger:** When no products exist in the catalog dataset for the selected domain.
* **Layout:** Centered editorial block with botanical bean SVG monogram (`--copper-accent`).
* **Copy:**
  * Title: Cormorant Garamond 32px Italic `--espresso-ink`.
  * Description: DM Sans 15px Regular `--espresso-mid`, max-width 560px.
  * Action: Single copper button `"Gửi Yêu Cầu Đặt Hàng Trước →"` (opens Quote Dossier Drawer with a pre-filled custom inquiry).

---

### 3.12. No-Result State (Filtered / Searched Zero Matches)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│                    Không Tìm Thấy Sản Phẩm Phù Hợp Với Bộ Lọc                            │
│                                                                                          │
│    Không có sản phẩm nào thỏa mãn các điều kiện: [Sanremo ✕] [3 Groups ✕] [Dưới 100tr ✕] │
│                                                                                          │
│                            [ Đặt Lại Tất Cả Bộ Lọc ]                                     │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ B2B CONCIERGE SOURCING BANNER                                                            │
│ ┌──────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Bạn đang tìm kiếm cấu hình máy hoặc nguồn hạt đặc biệt cho dự án?                    │ │
│ │ Đội ngũ kỹ sư & Master Roaster của Aura Coffee nhận tìm nguồn, nhập khẩu nguyên chiếc│ │
│ │ và tùy chỉnh profile rang theo đúng bản vẽ thiết kế quầy bar của bạn.                │ │
│ │                                                                                      │ │
│ │ [ Gửi Yêu Cầu Tìm Nguồn Riêng → ]                                                    │ │
│ └──────────────────────────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ SẢN PHẨM TIÊU BIỂU TỪ ATELIER                                                            │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                                     │
│ │ Flagship 01  │  │ Flagship 02  │  │ Flagship 03  │                                     │
│ └──────────────┘  └──────────────┘  └──────────────┘                                     │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Trigger:** When an active combination of search keywords or filter facets yields zero results.
* **Recovery Architecture (3-Tiered):**
  1. **Clear Diagnostic:** Explicitly names conflicting facets and provides a 1-click `"Đặt Lại Tất Cả Bộ Lọc"` button.
  2. **B2B Concierge Sourcing Service:** Rather than a dead end, offers Aura's custom procurement service for rare machines/beans.
  3. **Curated Recommendations:** Displays 3 featured flagship products from the atelier to maintain visual engagement.

---

### 3.13. Loading State (Tactile Skeleton Shimmer)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐             │
│ │ [██████████████████] │  │ [██████████████████] │  │ [██████████████████] │             │
│ │ 4:3 Skeleton Box     │  │ 4:3 Skeleton Box     │  │ 4:3 Skeleton Box     │             │
│ │                      │  │                      │  │                      │             │
│ │ ── 11px Label        │  │ ── 11px Label        │  │ ── 11px Label        │             │
│ │ ──── 20px Title      │  │ ──── 20px Title      │  │ ──── 20px Title      │             │
│ │ ────── 13px Spec     │  │ ────── 13px Spec     │  │ ────── 13px Spec     │             │
│ │ ─── 18px Price       │  │ ─── 18px Price       │  │ ─── 18px Price       │             │
│ └──────────────────────┘  └──────────────────────┘  └──────────────────────┘             │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Aesthetic Discipline:**
  * Warm ivory pulse: Base color `--cream-deep` (`#EDE4D7`), shimmering to `--cream-shadow` (`#D9CCBB`).
  * Zero harsh digital grays (`#E5E7EB` is strictly forbidden).
  * Shimmer cycle: `1.5s ease-in-out infinite`, opacity oscillation `0.5` $\leftrightarrow$ `0.9`.
* **Zero Cumulative Layout Shift (CLS = 0):**
  * Skeletons mirror the exact typography heights, aspect ratios (4:3 and 3:4), and button containers of live product cards.

---

### 3.14. Mobile Filter Drawer & Responsive Sheet

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ (Mobile Viewport < 768px)                                                                │
│                                                                                          │
│ ┌──────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ BỘ LỌC & TÙY CHỌN TÌM KIẾM                                                       [✕] │ │
│ ├──────────────────────────────────────────────────────────────────────────────────────┤ │
│ │ ▾ DANH MỤC SẢN PHẨM                                                                  │ │
│ │   [✓] Máy Pha Cà Phê (18)                                                            │ │
│ │   [ ] Máy Xay Cà Phê (12)                                                            │ │
│ │                                                                                      │ │
│ │ ▾ PHÂN LOẠI NHÓM                                                                     │ │
│ │   [✓] 2 Groups (10)                                                                  │ │
│ │                                                                                      │ │
│ │ ▾ KHOẢNG GIÁ                                                                         │ │
│ │   50.000.000 ₫ — 350.000.000 ₫                                                       │ │
│ ├──────────────────────────────────────────────────────────────────────────────────────┤ │
│ │ FIXED BOTTOM CTA BAR                                                                 │ │
│ │ ┌──────────────────────────┬───────────────────────────────────────────────────────┐ │ │
│ │ │ [ Đặt lại ]              │ [ Áp Dụng (10 Sản Phẩm) → ]                           │ │ │
│ │ └──────────────────────────┴───────────────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Trigger:** Floating bottom bar or top utility button on mobile: `"Lọc & Sắp Xếp (Bộ lọc: 2)"`.
* **Drawer Geometry:**
  * Slide-up from bottom (`height: 90vh`) on mobile (< 768px); slide-in from right (`width: 380px`) on tablet (768px–1023px).
  * Background: `--cream-base` with 1px top border.
* **Ergonomics & Touch Targets:**
  * All checkboxes and accordion touch targets: minimum `48x48dp`.
  * Sticky Bottom Action Bar:
    * Ghost Button: `"Đặt lại"` (resets local filters).
    * Solid Copper Button: `"Áp Dụng (X Sản Phẩm) →"` (commits filters to URL and closes drawer).
* **Accessibility:** Scroll lock on `body`, `ESC` key handling, focus trap inside drawer.

---

## 4. RESPONSIVE BREAKPOINT MATRIX & ERGONOMICS

| Breakpoint Range | Grid Columns | Filter Architecture | Card Presentation | Primary Interaction |
|---|---|---|---|---|
| **Desktop Large**<br>(≥ 1440px) | 3 Columns<br>(gap: 32px 28px) | Sticky Left Rail (280px)<br>All accordions open | 4:3 Image, Quick Spec on hover, full action row | Hover reveals secondary specs and Quick Spec trigger |
| **Desktop Standard**<br>(1280px – 1439px) | 3 Columns<br>(gap: 24px 20px) | Sticky Left Rail (260px)<br>All accordions open | 4:3 Image, Quick Spec on hover, full action row | Hover reveals Quick Spec trigger |
| **Tablet Landscape**<br>(1024px – 1279px) | 2 Columns<br>(gap: 24px 24px) | Collapsible Left Rail or Slide-over Sheet | 4:3 Image, persistent action buttons | Clean tap targets, slide-over filter sheet |
| **Tablet Portrait**<br>(768px – 1023px) | 2 Columns<br>(gap: 20px 16px) | Slide-over Filter Sheet (Triggered via Top Bar) | 4:3 Image, persistent action buttons | Tap opens Quick Spec sheet, instant dossier add |
| **Mobile**<br>(< 768px) | 1 Column<br>(gap: 32px) | Full-Height Bottom Drawer (`90vh`) with sticky apply CTA | 4:3 full-width image, persistent button stack | Minimum 48px touch targets, sticky filter bar |

---

## 5. INTERACTION, STATE MACHINE & URL CONTRACT

The catalog maintains **100% bidirectional synchronization** between UI state and URL query parameters, enabling instant bookmarking, back-button fidelity, and team procurement sharing.

```
                  USER INTERACTION
           (Domain switch, Search, Filter, Sort)
                         │
                         ▼
        ┌───────────────────────────────────┐
        │     URL SearchParams Update       │
        │  ?domain=equipment&category=...   │
        └─────────────────┬─────────────────┘
                          │
                          ▼
        ┌───────────────────────────────────┐
        │  Next.js Server / Client Engine   │
        │  • Filter Predicate Matching      │
        │  • Domain-Aware Sort Comparator   │
        │  • Pagination Slice (12 items)    │
        └─────────────────┬─────────────────┘
                          │
                          ▼
        ┌───────────────────────────────────┐
        │       React UI Re-render          │
        │  • ProductGrid transition (150ms) │
        │  • ActiveFilterChips sync         │
        │  • Lenis scroll restoration       │
        └───────────────────────────────────┘
```

### URL Query State Schema

```typescript
export interface CatalogUrlState {
  domain?: 'equipment' | 'ingredients';   // Default: 'equipment'
  category?: string;                     // e.g. 'espresso-machines', 'coffee-beans'
  brand?: string[];                      // e.g. ['sanremo', 'mahlkonig']
  origin?: string[];                     // e.g. ['caudat', 'ethiopia']
  roast?: ('Light' | 'Medium' | 'Medium-Dark' | 'Dark')[];
  groups?: (1 | 2 | 3)[];
  boiler?: string[];
  voltage?: ('220V' | '380V')[];
  min_price?: number;
  max_price?: number;
  min_cupping?: number;                  // e.g. 87.0
  sort?: 'curated' | 'price_asc' | 'price_desc' | 'newest' | 'capacity' | 'cupping_desc';
  page?: number;                         // Default: 1
  view?: 'grid' | 'list';                // Default: 'grid'
  q?: string;                            // Search query string
}
```

---

## 6. ACCESSIBILITY (A11Y) & WCAG 2.1 AAA STANDARDS

1. **Contrast Ratios:**
   * Primary Text (`--espresso-ink` `#1A1208` on `--cream-base` `#F5EFE6`): Contrast ratio **14.8:1** (Exceeds WCAG AAA requirement of 7:1).
   * Secondary Text (`--espresso-mid` `#3D2B1F` on `--cream-base`): Contrast ratio **10.4:1** (WCAG AAA).
   * Accent CTAs (`--copper-accent` `#A0622A` with white text): Contrast ratio **4.9:1** (Exceeds WCAG AA requirement of 4.5:1).
2. **Keyboard Navigation & Focus Management:**
   * Visible focus indicators: 2px solid `--copper-accent` with 2px offset on all interactive buttons, inputs, and links.
   * `Tab` order: Breadcrumbs $\rightarrow$ Domain Switcher $\rightarrow$ Search $\rightarrow$ Categories $\rightarrow$ Filters $\rightarrow$ Sort $\rightarrow$ Products $\rightarrow$ Pagination.
3. **Screen Reader Semantics:**
   * Decorative icons (e.g. search magnifying glass, category arrows) marked with `aria-hidden="true"`.
   * Action buttons have explicit labels: `aria-label="Thêm Sanremo Cafe Racer 2 Groups vào Hồ Sơ Dự Án"`.
   * Live count updates announced via `aria-live="polite"`.
4. **Reduced Motion:**
   * Complies with `prefers-reduced-motion: reduce`: all transitions reduce to simple opacity fades (zero translate-Y or scale).

---

## 7. DESIGN QUALITY & GOVERNANCE CHECKLIST

Before approving any code implementation for the Product Catalog page, verify against this 10-point audit:

- [ ] **1. Ground Dominance:** Is the background warm cream (`#F5EFE6` / `#EDE4D7`) and not stark digital white (`#FFFFFF`) or generic dark mode?
- [ ] **2. Copper Restraint:** Are there $\le 3$ copper elements visible in any single viewport?
- [ ] **3. No Card Clutter:** Are product lists and filter accordions structured via 1px `--cream-shadow` hairlines and whitespace rather than bulky boxed cards with drop shadows?
- [ ] **4. Typography Hierarchy:** Is Cormorant Garamond strictly kept to 400 Regular for model titles and prices, paired with DM Sans for technical data and labels?
- [ ] **5. Domain Switching Velocity:** Does switching between Equipment and Ingredients immediately reset category trees, filter options, and sort parameters with zero lag?
- [ ] **6. Search Debouncing & Typeahead:** Does search debouncing fire at 250ms and display structured category jumps, product previews, and keyword pills?
- [ ] **7. Numbered Pagination:** Does pagination preserve clean numeric navigation (`01`, `02`, `03`) with seamless Lenis scroll restoration to the grid top?
- [ ] **8. Concierge Empty & No-Result Recovery:** Does a zero-result query provide a clear diagnostic, 1-click reset, and a B2B concierge inquiry path?
- [ ] **9. Touch Target Compliance:** Do all mobile checkboxes, stepper controls, and buttons meet the minimum 48x48dp touch target?
- [ ] **10. URL State Fidelity:** Are search terms, filter dimensions, sorting options, and pagination indices 100% synchronized with URL search params?

---

*This document is the authoritative composition specification for the Aura Coffee Product Catalog (`/products`). Any code implementation must strictly reflect the typography, spatial hierarchy, color discipline, and interaction models defined above.*
