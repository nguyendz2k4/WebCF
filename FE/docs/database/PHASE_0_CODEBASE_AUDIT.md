# PHASE 0: CODEBASE AUDIT & ARCHITECTURAL BASELINE REPORT
**Document:** `/docs/database/PHASE_0_CODEBASE_AUDIT.md`  
**Repository:** `nguyendz2k4/WebCF` (`FE` Workspace)  
**Target Milestone:** Database Architecture & Backend Foundation  
**Audit Completion Date:** September 2026  
**Scope:** Strict Codebase Audit (Phase 0 Only — No Schema Design, No Migrations, No Code Modification)

---

## EXECUTIVE SUMMARY

This audit delivers an exhaustive, evidence-based investigation of the existing e-commerce repository (`d:\WebCF(VanDung)\FE`). Every finding, entity inventory, query pattern, validation constraint, and risk documented herein is derived strictly from inspected source code and active documentation. 

**Fundamental Repository State:**
1. **Frontend-Only Reality:** The repository currently operates as a standalone Next.js 16 (React 19) App Router web application.
2. **Total Absence of Database & Backend:** There are currently **no backend services, no REST/GraphQL API controllers, no Next.js Route Handlers (`src/app/api/`), no ORM dependencies (Prisma, Drizzle, TypeORM), no database connections, and no SQL migrations** in the codebase. The root repository contains only an empty initialization commit (`347bce3 chore: khoi tao thu muc BE` with `BE/.gitkeep`).
3. **In-Memory & LocalStorage Architecture:** All product listings, sensory terroir data, equipment specifications, news publications, and consultation channels reside in static TypeScript fixtures (`src/data/`). User session simulation and shopping cart state persist solely inside the client's browser via `localStorage` and React Context (`AppContext.tsx`).
4. **Assumed B2B E-Commerce Flow:** The ordering flow generates client-side random receipt IDs, relies on offline manual verification (Chuyển khoản VietQR đối soát thủ công hoặc COD khi đồng kiểm), and does not integrate automated payment gateways or live inventory reservations.

---

## A. SYSTEM OVERVIEW

### 1. Architecture Topology
* **Frontend Framework:** Next.js 16.3.2 (React 19.2.8, React DOM 19.2.8) using App Router (`src/app/`).
* **Language & Tooling:** TypeScript 7.0.2 (strictly typed interfaces in `src/types/`).
* **Styling & Design System:** Tailwind CSS v4 (`@tailwindcss/postcss` 4.3.3) paired with Vanilla CSS design tokens in `src/app/globals.css` (Aura Luxury Editorial palette: `cream-base`, `espresso-ink`, `copper-accent`, `copper-glow`).
* **Smooth Scrolling & Motion:** Lenis (`lenis` 1.3.26 via `src/components/shared/LenisProvider.tsx`) and Framer Motion (`framer-motion` 13.1.1).
* **Icons:** Lucide React (`lucide-react` 1.33.0).
* **State Management:** Single React Context Provider (`src/stores/AppContext.tsx`) managing Auth state, Cart state, Checkout items, and Toast notifications.
* **URL As Single Source of Truth:** Catalog filtering, faceted attributes, sorting, view switching, and pagination synchronize bidirectionally with URL Search Parameters using `useSearchParams`, `useRouter`, and `useTransition` (`src/components/catalog/CatalogClientView.tsx`).

### 2. Routes & Entry Points
| Route | Type | Implementation File | Primary Data Source |
|---|---|---|---|
| `/` | SSR / Static | `src/app/page.tsx` | Component-level constants (`EquipmentConfigurator.tsx`, `BeansSelection.tsx`, `SolutionsSection.tsx`, `ProjectBuilder.tsx`) |
| `/products` | Client / Suspense | `src/app/products/page.tsx` | `src/data/products.ts` via `CatalogClientView.tsx` |
| `/products/[slug]` | SSG / Dynamic | `src/app/products/[slug]/page.tsx` | `PRODUCTS_DATA` filtered by `slug` (`generateStaticParams`) |
| `/news` | SSR / Client View | `src/app/news/page.tsx` | `src/data/news.ts` via `NewsClientView.tsx` |
| `/news/[slug]` | SSG / Dynamic | `src/app/news/[slug]/page.tsx` | `NEWS_ARTICLES` filtered by `slug` (`generateStaticParams`) |
| `/contact` | SSR / Client Form | `src/app/contact/page.tsx` | `src/data/contact.ts` + `ContactForm.tsx` |
| `/thank-you` | Client / Suspense | `src/app/thank-you/page.tsx` | `useSearchParams().get('orderId')` via `ThankYouClientView.tsx` |
| `/chinh-sach-doi-tra` | Static Editorial | `src/app/chinh-sach-doi-tra/page.tsx` | Hardcoded policy text & decision placeholders |
| `/chinh-sach-van-chuyen`| Static Editorial | `src/app/chinh-sach-van-chuyen/page.tsx` | Hardcoded logistics text & decision placeholders |
| `/terms` | Static Editorial | `src/app/terms/page.tsx` | Hardcoded legal clauses & decision placeholders |
| `/privacy-policy` | Static Editorial | `src/app/privacy-policy/page.tsx` | Hardcoded privacy text & decision placeholders |
| `/not-found` | Static Error Page | `src/app/not-found.tsx` | Standalone UI |
| `/sitemap.ts` | Metadata Route | `src/app/sitemap.ts` | Dynamic compilation of static routes + product slugs + news slugs |
| `/robots.ts` | Metadata Route | `src/app/robots.ts` | Crawler policy directives |

---

## B. DOMAIN / ENTITY INVENTORY

The codebase defines 12 core entity types across `src/types/index.ts`, `src/types/product.ts`, `src/types/order.ts`, `src/types/news.ts`, `src/types/contact.ts`, and component-level definitions:

```
                                  ┌───────────────────┐
                                  │       User        │
                                  └─────────┬─────────┘
                                            │ 1:N
                                            ▼
                                  ┌───────────────────┐
                                  │       Order       │
                                  └─────────┬─────────┘
                                            │ 1:N
                                            ▼
                                  ┌───────────────────┐
                                  │     CartItem /    │
                                  │     OrderItem     │
                                  └─────────┬─────────┘
                                            │ N:1
                        ┌───────────────────┴───────────────────┐
                        ▼                                       ▼
            ┌───────────────────────┐               ┌───────────────────────┐
            │   EquipmentProduct    │               │   IngredientProduct   │
            └───────────────────────┘               └───────────────────────┘
```

### 1. `User` (`src/types/index.ts`)
* **Purpose:** Represents authenticated user identity in client session.
* **Fields:**
  * `id`: `string` (e.g. `'usr_owner_01'`, `'usr_barista_02'`, `'usr_1741123456789'`)
  * `name`: `string` (e.g. `'Nguyễn Đăng Quang'`, `'Quý Khách Hàng'`)
  * `email`: `string` (e.g. `'quang.nguyen@auracoffee.vn'`)
  * `phone`: `string?` (optional, e.g. `'0909 000 247'`)
  * `avatar`: `string?` (optional Unsplash URL)
  * `role`: `'owner' | 'barista' | 'guest'` (enum union)
  * `shopName`: `string?` (optional, e.g. `'Aura Specialty Coffee Lab'`)
* **Storage Location:** Client browser `localStorage` key `'aura_coffee_user'`.

### 2. `BaseProduct` (`src/types/product.ts`)
* **Purpose:** Common polymorphic root interface for all commercial catalog inventory items.
* **Fields:**
  * `id`: `string` (primary key identifier, e.g. `'prod_eq_sanremo_cafe_racer_2g'`)
  * `slug`: `string` (URL path identifier, e.g. `'sanremo-cafe-racer-custom-2-group'`)
  * `sku`: `string?` (optional B2B SKU, e.g. `'AUR-EQ-SR-CR2'`)
  * `domain`: `'equipment' | 'ingredients'` (polymorphic discriminator)
  * `name`: `string` (full commercial display name)
  * `brand`: `string` (e.g. `'Sanremo'`, `'Mahlkönig'`, `'1883 Maison Routin'`)
  * `shortDescription`: `string` (concise marketing/technical summary)
  * `price`: `number` (numeric price in VND, e.g. `245000000`)
  * `formattedPrice`: `string` (pre-formatted currency string, e.g. `'245.000.000 ₫'`)
  * `priceType`: `'fixed' | 'from' | 'contact'`
  * `images`: `string[]` (array of image URLs)
  * `inStock`: `boolean` (availability boolean)
  * `leadTime`: `string?` (procurement lead time text, e.g. `'Sẵn hàng tại kho HCM & Hà Nội'`)
  * `isFeatured`: `boolean?` (flagship highlight flag)
  * `createdAt`: `string` (ISO 8601 date string, e.g. `'2026-01-15T08:00:00Z'`)

### 3. `EquipmentProduct` (`src/types/product.ts`)
* **Inheritance:** Extends `BaseProduct` with `domain: 'equipment'`.
* **Specific Fields:**
  * `category`: `'espresso-machines' | 'coffee-grinders' | 'coffee-roasters' | 'barista-gear' | 'accessories'`
  * `specs`: Nested object containing:
    * `groups`: `number?` (1, 2, 3)
    * `boiler`: `string?` (boiler configuration description)
    * `boilerCapacity`: `string?` (e.g. `'Nồi hơi đánh sữa 8.5L + 2 Nồi con 1.0L'`)
    * `pump`: `string?` (e.g. `'Rotary Vane Pump volumetric chuyên dụng'`)
    * `power`: `string?` (e.g. `'4.800W'`)
    * `voltage`: `'220V' | '380V' | '220V/380V'?`
    * `dimensions`: `string?` (W x D x H in mm)
    * `weight`: `string?` (weight in kg)
    * `warranty`: `string` (mandatory warranty description)
    * `dailyCapacity`: `string?` (cups per day estimate)
  * `suitableFor`: `('home' | 'boutique-cafe' | 'high-volume' | 'roastery' | 'lab')[]`

### 4. `IngredientProduct` (`src/types/product.ts`)
* **Inheritance:** Extends `BaseProduct` with `domain: 'ingredients'`.
* **Specific Fields:**
  * `category`: `'coffee-beans' | 'syrups' | 'sauces' | 'powders' | 'matcha' | 'chocolate' | 'tea' | 'other'`
  * `origin`: `string?` (country / geographic region, e.g. `'Cầu Đất, Đà Lạt'`, `'Ethiopia'`)
  * `subRegion`: `string?` (terroir sub-zone, e.g. `'Trạm Hành · Lâm Đồng'`)
  * `altitude`: `string?` (growing altitude, e.g. `'1.650m ASL'`)
  * `process`: `string?` (processing method, e.g. `'Anaerobic Natural 72h'`)
  * `roastProfile`: `'Light' | 'Medium' | 'Medium-Dark' | 'Dark'?`
  * `cuppingScore`: `number?` (SCA sensory evaluation score, e.g. `87.5`)
  * `flavorNotes`: `string[]?` (sensory descriptor tags)
  * `packaging`: Nested object containing:
    * `unitSize`: `string` (e.g. `'Túi 1kg (Van 1 chiều)'`, `'Chai thủy tinh 1000ml'`)
    * `caseSize`: `string?` (wholesale case spec, e.g. `'Thùng 10 túi (10kg)'`)
  * `shelfLife`: `string?` (shelf life duration, e.g. `'6 tháng kể từ ngày rang'`)

### 5. `CartItem` (`src/types/index.ts`)
* **Purpose:** Represents an item staged in the cart drawer or order review modal.
* **Fields:**
  * `id`: `string` (references product or package id)
  * `title`: `string` (item title)
  * `category`: `'equipment' | 'beans' | 'package' | 'service'`
  * `price`: `number` (unit price in VND)
  * `formattedPrice`: `string`
  * `image`: `string` (single thumbnail image URL)
  * `subtitle`: `string?` (brand or package target)
  * `specs`: `string?` (concise spec summary)
  * `quantity`: `number` (item count, >= 1)
* **Storage Location:** Client browser `localStorage` key `'aura_coffee_cart'`.

### 6. `AuraOrderReceiptState` / Order Domain (`src/types/order.ts`, `src/components/shared/CheckoutModal.tsx`)
* **Purpose:** Order creation payload and post-submission receipt record.
* **Fields:**
  * `orderId`: `string` (generated client-side: `AURA${Math.floor(100000 + Math.random() * 900000)}`)
  * `customerName`: `string` (`recipientName`)
  * `phone`: `string`
  * `address`: `string` (street address)
  * `province`: `string` (one of 63 Vietnamese provinces)
  * `district`: `string?` (district / town)
  * `notes`: `string?` (delivery / installation notes)
  * `paymentMethod`: `'vietqr' | 'cod'`
  * `totalAmount`: `number`
  * `formattedTotal`: `string`
  * `status`: `'pending_verification' | 'confirmed' | 'processing' | 'dispatched' | 'cancelled'`
  * `createdAt`: `string` (timestamp)
  * `verificationNote`: `string` (acknowledgement of manual review status)
  * `items`: Array of `CartItem` staged during checkout submission

### 7. Legacy Storefront Entities (Homepage Bindings)
* **`EquipmentTier` (`src/types/index.ts`, `EquipmentConfigurator.tsx`):**
  * `id`, `tabKey` (`'home' | 'medium' | 'chain'`), `label`, `name`, `price`, `formattedPrice`, `capacity`, `pressure`, `footprint`, `warranty`, `image`, `imageAlt`.
* **`CoffeeBean` (`src/types/index.ts`, `BeansSelection.tsx`):**
  * `id`, `name`, `origin`, `subRegion`, `altitude`, `process`, `roastProfile`, `cuppingScore`, `flavorNotes[]`, `description`, `price`, `formattedPrice`, `image`, `bagWeight`.
* **`SolutionPackage` (`src/types/index.ts`, `SolutionsSection.tsx`):**
  * `id`, `name`, `target`, `price`, `rawPrice`, `popular`, `badge`, `description`, `features[]`.
* **`ProjectBuilder` Model Config (`src/components/store/ProjectBuilder.tsx`):**
  * `id` (`'kiosk' | 'takeaway' | 'medium_cafe' | 'flagship' | 'chain'`), `name`, `defaultCapacity`, `defaultBudget`, `recommendedMachine`, `recommendedBeans`, `recommendedBuild`, `rawEstimatedPrice`.

### 8. `NewsArticle` (`src/types/news.ts`)
* **Fields:**
  * `id`: `string`
  * `slug`: `string`
  * `title`: `string`
  * `excerpt`: `string`
  * `category`: `'all' | 'new-products' | 'market-trends' | 'barista-tech'`
  * `categoryLabel`: `string`
  * `publishedAt`: `string` (e.g. `'28 Tháng 8, 2026'`)
  * `readTime`: `string` (e.g. `'4 phút đọc'`)
  * `coverImage`: `string`
  * `author`: `{ name: string, role: string, avatar?: string }`
  * `featured`: `boolean?`
  * `content`: `{ leadParagraph: string, sections: { heading?: string, body: string[], pullQuote?: string, keyPoints?: string[], image?: { url: string, caption: string } }[] }`
  * `tags`: `string[]`

### 9. Contact & Inquiries (`src/types/contact.ts`, `src/components/contact/ContactForm.tsx`)
* **`ContactInquiry` (Form submission state):**
  * `fullName`: `string` (required)
  * `phone`: `string` (required, validated with VN phone regex)
  * `email`: `string` (required, validated with email regex)
  * `businessName`: `string` (optional)
  * `serviceType`: `'full-setup' | 'equipment' | 'coffee-beans' | 'bar-training'`
  * `budgetRange`: `'under-100m' | '100m-300m' | '300m-600m' | 'above-600m' | 'custom'`
  * `message`: `string`
* **Static Contact Metadata:**
  * `AtelierHub`: `id`, `name`, `address`, `note`, `isPrimary`
  * `ContactChannelInfo`: `hotline`, `hotlineDisplay`, `emailConcierge`, `emailB2b`, `weekdayHours`, `weekendNote`, `slaResponseTime`, `slaSurveyTime`
  * `FaqItem`: `id`, `question`, `answer`

---

## C. RELATIONSHIP INVENTORY

Because data is currently held in unnormalized TypeScript objects, the relationships below represent the **active architectural connections** embedded in the code logic:

```
┌──────────────┐         1:N          ┌──────────────┐         1:N          ┌──────────────┐
│     User     │─────────────────────▶│    Order     │─────────────────────▶│  OrderItem   │
└──────────────┘                      └──────────────┘                      └──────┬───────┘
                                                                                   │
                                                                                   │ N:1 (polymorphic)
                                                                                   ▼
┌──────────────┐         1:N          ┌──────────────┐         N:1          ┌──────────────┐
│   Category   │◀─────────────────────│   Product    │◀─────────────────────┤   CartItem   │
└──────────────┘                      └──────┬───────┘                      └──────────────┘
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
          ┌───────────────────────┐                     ┌───────────────────────┐
          │   EquipmentProduct    │                     │   IngredientProduct   │
          │   (has specs object)  │                     │   (has packaging obj) │
          └───────────────────────┘                     └───────────────────────┘
```

1. **User ── (1:N) ── Order:**
   * *Code Evidence:* `CheckoutModal.tsx` reads `user.name` and `user.phone` to prefill customer credentials. `openCheckout()` forbids checkout if `!user`.
2. **Order ── (1:N) ── OrderItem / CartItem:**
   * *Code Evidence:* `checkoutItems` in `CheckoutModal.tsx` maps over the cart item array to calculate `orderTotal` and render summary lines.
3. **CartItem / OrderItem ── (N:1) ── Product:**
   * *Code Evidence:* `ProductDetailClientActions.tsx`, `EquipmentCard.tsx`, and `IngredientCard.tsx` construct `CartItem` by copying `product.id`, `product.name` into `title`, `product.price`, `product.images[0]`.
4. **Category ── (1:N) ── Product:**
   * *Code Evidence:* Categorization is hardcoded via string slugs on the product entity (`EquipmentCategory` and `IngredientCategory`). Related products are fetched using `PRODUCTS_DATA.filter(p => p.category === product.category && p.id !== product.id)` (`src/app/products/[slug]/page.tsx`).
5. **Brand ── (1:N) ── Product:**
   * *Code Evidence:* `brand` is a top-level string on `BaseProduct`. Brand filtering in `EditorialFilterRail.tsx` extracts unique brands dynamically via `new Set(...)`.
6. **Product ── (1:1) ── Specifications / Sensory Profile:**
   * *Code Evidence:* Embedded 1:1 nested objects (`specs` in `EquipmentProduct`, `packaging` in `IngredientProduct`).
7. **Article ── (N:M) ── Tag:**
   * *Code Evidence:* `NewsArticle.tags` is a flat array of strings (`string[]`). Rendered as tag cloud in `src/app/news/[slug]/page.tsx`.
8. **Article ── (N:1) ── Author:**
   * *Code Evidence:* Embedded object `{ name, role, avatar }` directly on `NewsArticle`.

---

## D. FIELD INVENTORY BY ACCESS PATTERN

### 1. Listing (Catalog Cards, Homepage Grids)
* `id`
* `slug`
* `domain` (`'equipment' | 'ingredients'`)
* `category`
* `brand`
* `name`
* `shortDescription`
* `price` (numeric VND)
* `formattedPrice`
* `priceType` (`'fixed' | 'from' | 'contact'`)
* `images[0]` (primary thumbnail)
* `inStock` (boolean availability)
* `leadTime` (lead time pill)
* `isFeatured` (flagship badge)
* **Equipment-specific:** `specs.groups`, `specs.boilerCapacity`, `specs.power`, `specs.voltage` (synthesized into card spec summary)
* **Ingredient-specific:** `origin`, `roastProfile`, `cuppingScore`, `packaging.unitSize`

### 2. Searching (Live Debounced Token Matcher)
* `name`
* `brand`
* `shortDescription`
* `sku`
* `specs.boiler`
* `specs.power`
* `specs.groups` (`"${groups} group"`)
* `origin`
* `subRegion`
* `flavorNotes` (string array matching)
* `process`

### 3. Filtering (Faceted Rail & Mobile Bottom Sheet)
* `domain` (mutually exclusive switcher)
* `category` (category slug or `'all'`)
* `brand` (multi-select string array)
* `price` (`minPrice`, `maxPrice` numeric bounds)
* **Equipment facets:**
  * `specs.groups` (`number[]`, [1, 2, 3])
  * `specs.boiler` (`string[]`, ['Multi-Boiler', 'Dual Boiler', 'T3 PureBrew'])
  * `specs.voltage` (`('220V' | '380V')[]`)
  * `suitableFor` (`('home' | 'boutique-cafe' | 'high-volume' | 'roastery' | 'lab')[]`)
* **Ingredient facets:**
  * `origin` (`string[]`, ['Cầu Đất', 'Sơn La', 'Ethiopia', 'Colombia', 'Kenya', 'Pháp', 'Nhật Bản', 'Đắk Lắk'])
  * `roastProfile` (`('Light' | 'Medium' | 'Medium-Dark' | 'Dark')[]`)
  * `minCupping` (`number`, 85, 87, 88)

### 4. Sorting (Domain-Aware Order Comparator)
* `isFeatured` + array order (key: `'curated'`)
* `price` ascending (key: `'price_asc'`)
* `price` descending (key: `'price_desc'`)
* `createdAt` ISO date comparator (key: `'newest'`)
* `specs.groups` descending (key: `'capacity'`, equipment domain only)
* `cuppingScore` descending (key: `'cupping_desc'`, ingredient domain only)

### 5. Detail Pages (`/products/[slug]`, `/news/[slug]`)
* **Product Detail:**
  * All listing fields
  * Full `images[]` gallery array
  * Full `specs` object (`boiler`, `boilerCapacity`, `pump`, `power`, `voltage`, `dimensions`, `weight`, `warranty`, `dailyCapacity`)
  * Full ingredient terroir object (`origin`, `subRegion`, `altitude`, `process`, `roastProfile`, `cuppingScore`, `packaging.unitSize`, `packaging.caseSize`, `shelfLife`)
  * Breadcrumb resolution (`domain` -> `categoryLabel` -> `product.name`)
  * Related products query (`category == product.category && id != product.id`, limit 3)
* **News Article Detail:**
  * `title`, `categoryLabel`, `publishedAt`, `readTime`, `coverImage`
  * `author` (`name`, `role`, `avatar`)
  * `content.leadParagraph`
  * `content.sections` (`heading`, `body[]`, `pullQuote`, `keyPoints[]`, `image { url, caption }`)
  * `tags[]`

### 6. Checkout & Order Processing
* `checkoutItems` (`id`, `title`, `price`, `quantity`, `formattedPrice`, `image`, `specs`)
* `recipientName`
* `phone`
* `province`
* `district`
* `address`
* `notes`
* `paymentMethod` (`'vietqr' | 'cod'`)
* `totalAmount`
* `formattedTotal`
* `orderId`
* `transferSyntax` (`"AURA ${orderId} ${phone.slice(-4)}"`)
* `verificationStatus` (`'pending_verification'`)

### 7. Administration & Reporting (Identified Gaps)
* *Current State:* **0 administrative or reporting queries exist.**
* *Inferred Read Patterns from Existing State:*
  * Order listing by status (`pending_verification` vs `confirmed`)
  * Inventory toggle (`inStock` true/false)
  * Lead time editing
  * Product creation/updating with JSON specs

### 8. Authentication & Identity
* `email`
* `password` (HTML form input; currently unhashed and discarded)
* `name`
* `shopName`
* `role` (`'owner' | 'barista' | 'guest'`)

---

## E. HARDCODED-VALUE INVENTORY

### 1. Hardcoded Statuses
* **Order Statuses (`src/types/order.ts`):**
  * `'pending_verification'` (Default initial status upon checkout submission)
  * `'confirmed'` (Manual verification by sales staff)
  * `'processing'` (Warehouse assembly / roasting)
  * `'dispatched'` (Carrier transit)
  * `'cancelled'` (Cancelled by customer or staff)
* **Product Stock Status:** `inStock: boolean` (`true` or `false`)
* **Lead Time Strings:**
  * `'Sẵn hàng tại kho HCM & Hà Nội'`
  * `'Sẵn hàng thử nghiệm tại Showroom'`
  * `'Sẵn hàng giao ngay'`
  * `'Sẵn hàng tại kho HCM'`
  * `'Đặt hàng tùy biến 3–4 tuần'`
  * `'Nhập khẩu nguyên chiếc Hà Lan 6–8 tuần'`
  * `'Rang mới mỗi thứ Ba & thứ Sáu'`
  * `'Số lượng giới hạn vụ mùa 2026'`
* **Order Receipt Statuses (`src/app/thank-you/ThankYouClientView.tsx`):**
  * `'Trạng Thái: Chờ Chuyên Viên Xác Nhận'`

### 2. Hardcoded Types & Enums
* **Product Domains:** `'equipment' | 'ingredients'`
* **Equipment Categories (`src/types/product.ts`, `catalogUtils.ts`):**
  * `all` (Tất cả thiết bị)
  * `espresso-machines` (Máy Pha Cà Phê)
  * `coffee-grinders` (Máy Xay Cà Phê)
  * `coffee-roasters` (Máy Rang Cà Phê)
  * `barista-gear` (Dụng Cụ Barista)
  * `accessories` (Phụ Kiện & Bảo Dưỡng)
* **Ingredient Categories (`src/types/product.ts`, `catalogUtils.ts`):**
  * `all` (Tất cả nguyên liệu)
  * `coffee-beans` (Hạt Cà Phê Đặc Sản)
  * `syrups` (Siro Pha Chế 1883)
  * `sauces` (Sốt Cao Cấp)
  * `powders` (Bột & Cốt Đá Xay)
  * `matcha` (Matcha & Houjicha Uji)
  * `tea` (Trà Đặc Sản)
  * `chocolate` (Socola & Cacao)
  * `other` (Nguyên Liệu Khác)
* **Price Type Indicators:** `'fixed' | 'from' | 'contact'`
* **Roast Profiles:** `'Light' | 'Medium' | 'Medium-Dark' | 'Dark'`
* **Electrical Voltages:** `'220V' | '380V' | '220V/380V'`
* **Application Suitability:** `'home' | 'boutique-cafe' | 'high-volume' | 'roastery' | 'lab'`
* **Catalog Sort Options:** `'curated' | 'price_asc' | 'price_desc' | 'newest' | 'capacity' | 'cupping_desc'`
* **Catalog View Modes:** `'grid' | 'list'`
* **Payment Methods:** `'vietqr' | 'cod'`
* **News Categories:** `'all' | 'new-products' | 'market-trends' | 'barista-tech'`
* **Toast Notification Types:** `'success' | 'info' | 'cart'`
* **Contact Service Types:** `'full-setup' | 'equipment' | 'coffee-beans' | 'bar-training'`
* **Contact Budget Ranges:** `'under-100m' | '100m-300m' | '300m-600m' | 'above-600m' | 'custom'`
* **Project Builder Models:** `'kiosk' | 'takeaway' | 'medium_cafe' | 'flagship' | 'chain'`

### 3. Hardcoded Roles
* **User Roles (`src/types/index.ts`):**
  * `'owner'` (Chủ Quán / Business Owner)
  * `'barista'` (Head Barista / Technical Operator)
  * `'guest'` (Khách Hàng Khởi Nghiệp / Unregistered)

### 4. Hardcoded Business Rules & Constants
* **Pagination Page Size:** Exactly 12 items per page (`ITEMS_PER_PAGE = 12` in `CatalogClientView.tsx`).
* **Cart Minimum Quantity:** Minimum quantity is clamped to 1. Decrementing past 1 triggers item removal (`AppContext.tsx`).
* **VietQR Bank Credentials (`CheckoutModal.tsx`):**
  * Bank: `MBBank (Ngân Hàng Quân Đội)`
  * Account Number: `9999000247`
  * Account Name: `AURA COFFEE SOLUTIONS`
  * Syntax Rule: `AURA ${orderId} ${phone.slice(-4) || '2026'}`
* **Consultation SLAs (`src/data/contact.ts`):**
  * Response time: `2 giờ làm việc`
  * Site survey time: `24 giờ tại TP.HCM`
* **Geographic Coverage:** Exact list of 63 Vietnamese provinces hardcoded in `VIETNAM_PROVINCES` array (`CheckoutModal.tsx`).
* **Currency Code:** Strictly VND formatted using `'vi-VN'` locale (`Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`).
* **Customer Verification Disclaimer:** Mandatory gating statement in `ThankYouClientView.tsx` and `CheckoutModal.tsx`: Website generates an order request, NOT an online payment receipt. Staff must verify before shipping.

---

## F. QUERY / ACCESS-PATTERN INVENTORY

Because there is no active SQL database or ORM, the table below documents the **actual programmatic access patterns executed by the Next.js runtime**:

| Component / File | Invocation Trigger | Access Pattern Description | Equivalent SQL Query Pattern |
|---|---|---|---|
| `products/page.tsx` + `CatalogClientView.tsx` | Catalog page load, filter click, sort change | Iterates `PRODUCTS_DATA`, applies 6-stage filtering (`domain`, `category`, search substrings, `price` range, `brand[]`, domain facets), sorts array, slices `[start, start + 12]` | `SELECT * FROM products WHERE domain = ? AND category = ? AND brand IN (...) AND price BETWEEN ? AND ? ORDER BY ... LIMIT 12 OFFSET ?` |
| `products/[slug]/page.tsx` (`generateStaticParams`) | Build time SSG | Maps over all products to extract slug strings | `SELECT slug FROM products` |
| `products/[slug]/page.tsx` (`generateMetadata`, page component) | Dynamic route navigation | Single item exact-match lookup on slug | `SELECT * FROM products WHERE slug = ? LIMIT 1` |
| `products/[slug]/page.tsx` (Related products) | Product detail page render | Filters category matching items excluding current product, slices first 3 | `SELECT * FROM products WHERE category = ? AND id != ? LIMIT 3` |
| `CatalogSearchBar.tsx` | User typing query | Filters products where name, brand, or SKU includes search term, limits 6 | `SELECT id, name, brand, images, slug FROM products WHERE name ILIKE '%q%' OR brand ILIKE '%q%' LIMIT 6` |
| `EditorialFilterRail.tsx` | Filter rail render | Extracts distinct brand list and counts items per facet group | `SELECT brand, COUNT(*) FROM products WHERE domain = ? GROUP BY brand` |
| `news/page.tsx` + `NewsClientView.tsx` | News page render, category switch | Filters `NEWS_ARTICLES` by category slug | `SELECT * FROM news_articles WHERE category = ? ORDER BY published_at DESC` |
| `news/[slug]/page.tsx` | Dynamic route navigation | Exact match on article slug + related articles limit 3 | `SELECT * FROM news_articles WHERE slug = ? LIMIT 1` |
| `CheckoutModal.tsx` | Checkout form submission | Reads cart items from Context, computes order sum, generates order ID, executes simulated 800ms delay | `INSERT INTO orders (...) VALUES (...); INSERT INTO order_items (...) VALUES (...);` |
| `AppContext.tsx` | Initial browser load | `localStorage.getItem('aura_coffee_cart')` and `'aura_coffee_user'` | `SELECT * FROM carts WHERE user_id = ?; SELECT * FROM users WHERE id = ?;` |

---

## G. VALIDATION RULES

### 1. Checkout Form (`src/components/shared/CheckoutModal.tsx`)
* `recipientName`: Mandatory non-empty string after trimming (`!recipientName.trim()`).
* `phone`: Mandatory non-empty string after trimming (`!phone.trim()`).
* `address`: Mandatory non-empty string after trimming (`!address.trim()`).
* `province`: Mandatory select value restricted to `VIETNAM_PROVINCES` (63 valid values).
* `paymentMethod`: Mandatory select value restricted to `'vietqr' | 'cod'`.

### 2. Contact Inquiry Form (`src/components/contact/ContactForm.tsx`)
* `fullName`: Mandatory non-empty string after trimming (`!formData.fullName.trim()`).
* `phone`: Mandatory string, validated against Vietnamese phone regex:
  * Pattern: `/(84|0[3|5|7|8|9])+([0-9]{8})\b/`
  * Strips spaces before evaluation: `formData.phone.replace(/\s+/g, '')`.
* `email`: Mandatory string, validated against email regex:
  * Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
* `serviceType`: Mandatory choice from `['full-setup', 'equipment', 'coffee-beans', 'bar-training']`.
* `budgetRange`: Mandatory choice from `['under-100m', '100m-300m', '300m-600m', 'above-600m', 'custom']`.

### 3. Authentication & Registration Form (`src/components/shared/AuthModal.tsx`)
* `email`: Mandatory HTML5 email input.
* `password`: Mandatory HTML5 password input.
* `name`: Mandatory for register mode.
* `shopName`: Optional string.

### 4. Catalog URL Parameters (`src/components/catalog/CatalogClientView.tsx`)
* `domain`: Fallback default to `'equipment'`.
* `page`: Parsed via `Number()`, falls back to `1`.
* `min_price`, `max_price`, `min_cupping`: Parsed via `Number()`, filtered out if `NaN`.
* `sort`: Fallback default to `'curated'`.
* `view`: Fallback default to `'grid'`.

---

## H. POTENTIAL DATA-INTEGRITY RISKS

1. **Denormalized Pricing Discrepancies:**
   * Products currently store both numeric `price` (e.g. `245000000`) and pre-formatted string `formattedPrice` (e.g. `'245.000.000 ₫'`). If a database updates `price` without synchronizing `formattedPrice`, UI components reading `formattedPrice` will display outdated rates.
2. **Cart Snapshot Isolation vs Price Fluctuation:**
   * When a user adds an item to the cart, the entire title, category, price, formatted price, and image are cloned into the client's `localStorage` cart. If product pricing or stock changes in the database, the cart retains stale commercial terms without backend recalculation.
3. **No Foreign Key Integrity in Cart / Orders:**
   * `CartItem.id` can refer to a product (`prod_eq_...`), a homepage tier (`eq-tier-1`), a turnkey solution package (`pkg_specialty_upgrade`), or a project builder calculation (`project_kiosk`). There is no unified product ID space.
4. **Client-Side ID Generation Collisions:**
   * `orderId` is generated client-side using `AURA${Math.floor(100000 + Math.random() * 900000)}`. This yields only 900,000 possibilities, creating immediate collision risk in multi-user concurrent ordering.
5. **Absence of Server-Side Session Validation:**
   * User identity is trusted directly from `localStorage.getItem('aura_coffee_user')`. Any client can modify their role to `'owner'` in DevTools.
6. **Unconstrained Specifications Schema:**
   * Equipment specifications (`EquipmentProduct.specs`) and Ingredient packaging (`IngredientProduct.packaging`) mix structured numeric values (`groups: 2`) with free-text strings (`boilerCapacity: 'Nồi hơi đánh sữa 8.5L + 2 Nồi con 1.0L'`). Querying or filtering by boiler capacity requires string parsing.

---

## I. POTENTIAL PERFORMANCE RISKS

1. **In-Memory Full Table Scans on Catalog Filtering:**
   * Currently, every catalog filter interaction runs in-memory JavaScript loops across all products. As the catalog grows beyond hundreds of SKUs, client-side filtering and multi-field regex matching will degrade mobile rendering and battery life.
2. **Unindexed Multi-Field Substring Searches:**
   * Search queries evaluate 11 separate fields per item (including nested specs and flavor notes). In a relational database, running `ILIKE '%query%'` across 11 columns without GIN or Full-Text Search (tsvector/pg_trgm) will cause full table sequential scans.
3. **Over-Fetching Heavy Rich Content on Detail Pages:**
   * Product entities include multi-image galleries, detailed technical specifications, and suitability arrays that are not needed on initial listing views.
4. **LocalStorage Serialization Bottlenecks:**
   * Cart and user states are continuously serialized and deserialized with `JSON.stringify` on every item update in `AppContext.tsx`.

---

## J. CANDIDATE ENTITIES FOR VERTICAL PARTITIONING

Based on actual access frequency observed in the frontend routes:

### 1. `Product` Entity Partitioning
* **Core Hot Partition (`ProductBase` / `products`):**
  * *Access Frequency:* **Very High** (Every catalog view, search bar typeahead, homepage card, cart line item).
  * *Fields:* `id`, `slug`, `sku`, `domain`, `category`, `brand`, `name`, `price`, `price_type`, `thumbnail_image`, `in_stock`, `lead_time`, `is_featured`, `created_at`.
* **Cold Technical Specification Partition (`EquipmentSpecifications`):**
  * *Access Frequency:* **Low / On-Demand** (Only loaded on `/products/[slug]` and `<QuickSpecDrawer />`).
  * *Fields:* `dimensions`, `weight`, `power`, `voltage`, `boiler_details`, `pump_details`, `daily_capacity`, `warranty_terms`, `suitable_for_json`.
* **Cold Sensory & Agronomic Partition (`IngredientTerroir`):**
  * *Access Frequency:* **Low / On-Demand** (Only loaded on `/products/[slug]` and `<QuickSpecDrawer />`).
  * *Fields:* `sub_region`, `altitude`, `process_details`, `flavor_notes_json`, `case_size`, `shelf_life`.
* **Cold Media Gallery Partition (`ProductMedia`):**
  * *Access Frequency:* **Medium / Detail Only**.
  * *Fields:* Secondary images gallery, high-res workshop photography.

### 2. `NewsArticle` Partitioning
* **Article Summary Partition (`news_articles`):**
  * *Access Frequency:* **High** (Loaded on `/news` listing, homepage teasers, and related article rails).
  * *Fields:* `id`, `slug`, `title`, `excerpt`, `category`, `published_at`, `read_time`, `cover_image`, `author_name`, `author_role`, `author_avatar`, `featured`.
* **Article Body Partition (`news_article_content`):**
  * *Access Frequency:* **Low** (Only loaded on `/news/[slug]`).
  * *Fields:* `lead_paragraph`, `content_sections_json`, `pull_quotes`, `tags_json`.

---

## K. UNCERTAINTIES & QUESTIONS REQUIRING DESIGN DECISIONS

The codebase contains explicit placeholders (`[BUSINESS DECISION REQUIRED]`) across policy files and component templates where business logic is intentionally deferred:

### 1. Catalog & Pricing Domain
* **Decision 1.1:** What is the authoritative price source? Should `formattedPrice` be deprecated in the database in favor of a single integer/numeric VND column with client-side formatting?
* **Decision 1.2:** How should turnkey packages (`SolutionPackage`) and custom calculator estimates (`ProjectBuilder`) be represented in the database? Are they discrete products with standard SKUs, or dynamic configuration bundles?
* **Decision 1.3:** For B2B equipment with `priceType: 'contact'` or `'from'`, can customers submit a standard checkout order, or must it fork into a formal RFQ (Request For Quotation) pipeline?

### 2. Orders, Checkout & Payment Domain
* **Decision 2.1:** What format should authoritative Order IDs take? (e.g. Sequential `AURA-2026-00001` vs UUIDv7 vs NanoID).
* **Decision 2.2:** How should payments be tracked in the database? Does the system need a `payment_transactions` ledger to track bank statement references, VietQR transfer syntax matching, and manual staff verification timestamps?
* **Decision 2.3:** What is the maximum cancellation/modification window for customers before an order is locked for dispatch? (Directly flagged in `src/app/terms/page.tsx` line 110).

### 3. Inventory & Fulfillment Domain
* **Decision 3.1:** Does the business require multi-warehouse tracking (HCM warehouse vs Hanoi warehouse as cited in `src/data/products.ts`), or single aggregate stock counts?
* **Decision 3.2:** How are roasted coffee beans tracked in inventory? Are beans tracked by batch roast date, or general stock weight?
* **Decision 3.3:** What are the exact shipping fee tiers and heavy equipment pallet surcharges? (Directly flagged in `src/app/chinh-sach-van-chuyen/page.tsx` line 114).

### 4. Returns & Customer Service Domain
* **Decision 4.1:** What is the exact return window for equipment vs beans? (Directly flagged in `src/app/chinh-sach-doi-tra/page.tsx` line 112).
* **Decision 4.2:** Can consumable specialty beans be returned once the one-way valve seal is broken? (Directly flagged in `src/app/chinh-sach-doi-tra/page.tsx` line 93).
* **Decision 4.3:** How are customer reviews handled? (Flagged in `ProductReviewsSection.tsx` line 73: reviews are currently blocked from public submission until a verified buyer backend is implemented).

---

## PHASE 0 AUDIT CONCLUSION & BOUNDARIES

### 1. What Is Known With High Confidence
* The frontend data contracts are clean, highly structured, and strictly typed in TypeScript (`Product`, `EquipmentProduct`, `IngredientProduct`, `OrderReceiptState`, `NewsArticle`).
* The product domain is strictly divided into two distinct domains: Coffee Equipment (`equipment`) and Beverage Ingredients (`ingredients`), each requiring distinct faceted attributes.
* Catalog browsing relies heavily on multi-faceted filtering (domain, category, brand, price, groups, boiler, voltage, suitability, origin, roast, cupping score).
* The checkout process is explicitly an offline-verified manual procurement workflow (VietQR manual bank transfer or COD with inspection), not an automated gateway payment.
* Authentication currently supports three distinct business roles: `'owner'`, `'barista'`, and `'guest'`.
* Vietnamese geography is strictly bound to 63 standard provincial entities.

### 2. What Is Uncertain
* The backend stack selection (e.g., Node.js / Next.js Server Actions / NestJS / Go / Python).
* The target database engine (e.g., PostgreSQL, MySQL, SQLite, MongoDB).
* The ORM or database access layer (e.g., Prisma, Drizzle, Kysely, raw SQL).
* The exact normalization approach for polymorphic equipment vs ingredient specifications (Single Table Inheritance with JSONB vs Class Table Inheritance with separate specification tables).
* How B2B user accounts, authentication tokens (JWT / session cookies), and company profiles (`shopName`) will be issued and verified.

### 3. What Must NOT Be Assumed
* **Do NOT assume a database exists:** No tables, schemas, migrations, or database connection strings exist anywhere in this repository.
* **Do NOT assume automated online payment gateway integration:** The application contains zero Stripe, VNPay, MoMo, or ZaloPay SDKs or API keys. Orders must remain in a `pending_verification` workflow unless explicitly instructed.
* **Do NOT assume real-time inventory deduction:** The current code has no stock decrement logic.
* **Do NOT assume backend user authentication:** The current `AppContext.tsx` accepts any login credentials without verification.
* **Do NOT assume administrative endpoints exist:** There are currently no admin dashboards or management routes in the codebase.

---
**[END OF PHASE 0 AUDIT — STOPPING AS DIRECTED]**
