# PHASE 1 ARCHITECTURE CONSISTENCY REVIEW & AUDIT GATE

**Document:** `/docs/database/PHASE_1_FINAL_REVIEW.md`  
**Repository:** `nguyendz2k4/WebCF` (`FE` Workspace)  
**Baseline Documents:**
- `/docs/database/PHASE_0_CODEBASE_AUDIT.md`
- `/docs/database/PHASE_1_DOMAIN_MODEL.md`  
**Scope:** Strict Architectural Review Gate prior to Phase 2 (Schema Design).  
**Rules:** No SQL, no migrations, no application code modifications, no unverified assumptions.

---

## EXECUTIVE SUMMARY

This review gate evaluates the conceptual domain model defined in `PHASE_1_DOMAIN_MODEL.md` against the actual code evidence documented in `PHASE_0_CODEBASE_AUDIT.md`.

The audit identified **5 critical architectural alignment issues** where the domain model either:
1. Assumed user profile address persistence unsupported by the codebase.
2. Created a dual-source-of-truth split-brain risk between `in_stock`, `availability_status`, and `lead_time`.
3. Left `Brand` susceptible to premature expansion into a supplier/procurement domain.
4. Lacked a definitive, zero-overhead relational strategy for `NewsAuthor` and `Tag`.
5. Retained duplicate fields, derived UI strings, and classification ambiguities.

Each issue is evaluated below following the required structure: **ISSUE**, **EVIDENCE**, **RISK**, and **RECOMMENDATION**.

---

## 1. USER ADDRESS & SHIPPING DATA OWNERSHIP

### ISSUE
`PHASE_1_DOMAIN_MODEL.md` (Section I, Line 429) designated `User.address (Default Profile)` as the authoritative owner of "Customer Profile Address". In reality, the audited codebase does not store, prefill, or support an address on the `User` entity or in profile state.

### EVIDENCE
1. **`src/types/index.ts` (Lines 1–9):**
   ```typescript
   export interface User {
     id: string;
     name: string;
     email: string;
     phone?: string;
     avatar?: string;
     role: 'owner' | 'barista' | 'guest';
     shopName?: string;
   }
   ```
   The `User` interface has **no address, province, or district fields**.
2. **`src/components/shared/CheckoutModal.tsx` (Lines 113–122):**
   ```typescript
   useEffect(() => {
     if (isCheckoutOpen && user) {
       setRecipientName(user.name || '');
       setPhone(user.phone || '');
       setOrderSuccess(false);
       setIsSubmitting(false);
       setOrderId(`AURA${Math.floor(100000 + Math.random() * 900000)}`);
     }
   }, [isCheckoutOpen, user]);
   ```
   When checkout opens, it prefills **only `recipientName` and `phone`**. The fields `address`, `province`, and `district` start as blank or default form state (`useState('')`, `useState('TP. Hồ Chí Minh')`) and must be entered manually by the customer on every single purchase.
3. **`src/types/order.ts` (Lines 15–26):**
   The fulfillment address is owned directly by the transactional order contract:
   ```typescript
   export interface Order {
     ...
     recipientName: string;
     phone: string;
     address: string;
     province: string;
     district?: string;
     ...
   }
   ```
4. **Application Navigation & Profile UI:**
   There is no "Address Book", "Saved Addresses", or customer profile editing page anywhere in the repository.

### RISK
- **Relational Pollution:** Creating a `user_addresses` (1:N) table or placing an `address` column on `users` creates dead database structures with zero frontend consumers or API endpoints.
- **B2B Operating Reality:** In B2B coffee commerce, an account (`User`) represents a business owner or barista managing multiple café outlets (`shopName`). A single static address on `User` would falsely assume one delivery destination.
- **Historical Corruption Risk:** If an order were to reference a foreign key on a mutable user address instead of capturing an immutable snapshot, any subsequent address update would corrupt past delivery audit trails.

### RECOMMENDATION
Separate the three concepts strictly:
1. **User Profile Data:** Contains **zero address columns**. Profile is strictly identity and role metadata (`id`, `name`, `email`, `phone`, `role`, `shopName`, `avatar`).
2. **Saved Addresses:** **Do NOT create** in Phase 2 schema. Mark as a future business feature deferred until address management UI is designed.
3. **Order Shipping Snapshot (Authoritative):** The destination address (`recipient_name`, `phone`, `address_line`, `province`, `district`) must be owned and snapshotted directly on the `Order` aggregate as immutable columns.

**Minimum Safe Conceptual Model:**
```
┌──────────────────────────────────────┐        ┌──────────────────────────────────────┐
│                User                  │        │                Order                 │
├──────────────────────────────────────┤        ├──────────────────────────────────────┤
│ id: UUID (PK)                        │        │ id: UUID (PK)                        │
│ name: VARCHAR                        │ 1    N │ user_id: UUID (Nullable FK)          │
│ email: VARCHAR                       │───────▶│ shipping_recipient_name: VARCHAR     │
│ phone: VARCHAR (Optional)            │        │ shipping_phone: VARCHAR              │
│ shop_name: VARCHAR (Optional)        │        │ shipping_address_line: VARCHAR       │
│ role: VARCHAR                        │        │ shipping_province: VARCHAR           │
│ [NO ADDRESS COLUMNS ON USER]         │        │ shipping_district: VARCHAR (Opt)     │
└──────────────────────────────────────┘        └──────────────────────────────────────┘
```

---

## 2. PRODUCT AVAILABILITY DUPLICATION

### ISSUE
`PHASE_1_DOMAIN_MODEL.md` (Section E, Lines 275–281 & Section I, Line 427) introduced a 4-state enum `availability_status` (`IN_STOCK`, `MADE_TO_ORDER`, `ROAST_ON_DEMAND`, `OUT_OF_STOCK`) alongside `in_stock: boolean` and `lead_time: string`. This creates three competing fields describing product availability, violating the single-authoritative-owner principle.

### EVIDENCE
1. **`src/types/product.ts` (Lines 34–35):**
   ```typescript
   inStock: boolean;
   leadTime?: string;
   ```
   There is **no `availability_status` enum** in the audited TypeScript codebase.
2. **`src/data/products.ts`:**
   - 32 of 33 catalog items have `inStock: true`.
   - Only 1 product (`giesen-w6a-roaster`, Line 346) has `inStock: false`.
   - `leadTime` is purely human-readable Vietnamese advisory text: e.g., `'Sẵn hàng tại kho HCM & Hà Nội'`, `'Đặt hàng tùy biến 3–4 tuần'`, `'Rang mới mỗi thứ Ba & thứ Sáu'`, `'Số lượng giới hạn vụ mùa 2026'`.
   - **Crucial Proof:** The *Slayer Steam EP* (Line 160) has `leadTime: 'Đặt hàng tùy biến 3–4 tuần'`, yet `inStock: true`! This proves `leadTime` is an informational fulfillment notice, NOT an out-of-stock state.
3. **`src/components/shared/ProductSchema.tsx` (Lines 38–39):**
   ```typescript
   availability: product.inStock
     ? 'https://schema.org/InStock'
     : 'https://schema.org/OutOfStock'
   ```
   Schema.org SEO availability maps directly to the binary boolean `inStock`.
4. **`src/components/catalog/EquipmentCard.tsx` & `IngredientCard.tsx`:**
   The "Thêm Vào Giỏ" (Add to Cart) button is enabled or disabled **exclusively by `product.inStock`**. The `product.leadTime` string is rendered conditionally as an informational pill badge next to the warranty/roast specs.

### RISK
- **Split-Brain State:** If a record has `in_stock = false` but `availability_status = MADE_TO_ORDER` or `IN_STOCK`, queries cannot deterministically decide whether the item can be purchased, checked out, or shown in stock.
- **Unverified Enum Mapping:** Trying to map arbitrary natural-language notices like `'Rang mới mỗi thứ Ba & thứ Sáu'` or `'Nhập khẩu nguyên chiếc Hà Lan 6–8 tuần'` into a rigid database enum creates maintenance friction without frontend support.

### RECOMMENDATION
- **Single Authoritative Source for Availability:** Exactly ONE boolean column on `Product`:
  `is_in_stock: BOOLEAN NOT NULL DEFAULT true`
- **Lead Time as an Advisory Logistics Attribute:** A nullable text column on `Product`:
  `lead_time_notice: VARCHAR(255) NULL`
- **Eliminate `availability_status` entirely from the Phase 2 domain model.**
- Product availability is binary (`is_in_stock`), while procurement time is informational (`lead_time_notice`), mirroring 100% of the audited code.

```
┌────────────────────────────────────────────────────────┐
│                        Product                         │
├────────────────────────────────────────────────────────┤
│ is_in_stock: BOOLEAN NOT NULL                          │ ◀── [SOLE AUTHORITATIVE SOURCE]
│ lead_time_notice: VARCHAR(255) NULL                    │ ◀── [INFORMATIVE DISPLAY TEXT]
│ [NO availability_status ENUM]                          │
└────────────────────────────────────────────────────────┘
```

---

## 3. BRAND DOMAIN BOUNDARY & OVER-EXPANSION

### ISSUE
There is a risk of over-architecting `Brand` into an upstream supplier/vendor management domain (procurement contracts, supplier contacts, wholesale terms, vendor portals) rather than keeping it as simple catalog reference data.

### EVIDENCE
1. **`src/types/product.ts` (Line 28):**
   `brand: string;`
   In the product model, brand is simply a string identifier.
2. **`src/components/catalog/EditorialFilterRail.tsx` (Lines 38–39):**
   ```typescript
   const domainProducts = allProducts.filter((p) => p.domain === filters.domain);
   const availableBrands = Array.from(new Set(domainProducts.map((p) => p.brand))).sort();
   ```
   Brands are extracted dynamically as a flat list of strings to populate sidebar filter checkboxes.
3. **`src/components/catalog/CatalogSearchBar.tsx` (Lines 73, 89, 202):**
   Brand is indexed as a searchable token and displayed as a typography subtitle under the product name.
4. **`src/components/shared/ProductSchema.tsx` (Lines 29–31):**
   Brand is serialized into Schema.org JSON-LD as:
   ```json
   "brand": {
     "@type": "Brand",
     "name": "Sanremo"
   }
   ```
5. **Catalog Distribution:**
   Across all 33 products in `src/data/products.ts`, there are 23 distinct brand names. Crucially:
   - Some brands are third-party industrial manufacturers (Sanremo, Victoria Arduino, Mahlkönig, Mazzer).
   - Other brands are **Aura's own private labels** (`Aura Atelier Single Origin`, `Aura International Terroir`, `Aura Beverage Solutions`, `Aura Specialty Tea`).
6. **Absence of Supplier Logic:**
   Zero code exists for: vendor credentials, supplier contracts, purchase orders, vendor invoices, manufacturer tax IDs, or wholesale vendor portals.

### RISK
- **Domain Conflation:** Conflating public commercial brands with upstream supply chain vendors creates relational bloat and structural confusion. Treating `Aura Atelier Single Origin` as an external "vendor" would distort internal manufacturing accounting.
- **Unused Complexity:** Building supplier management tables in Phase 2 would create orphaned schemas with no frontend UI, no business requirements, and no API routes.

### RECOMMENDATION
- **Brand MUST remain strictly catalog reference data (taxonomy).**
- In Phase 2, `Brand` is a simple relational lookup table containing only:
  - `id: UUID (PK)`
  - `name: VARCHAR(100) NOT NULL UNIQUE`
  - `slug: VARCHAR(100) NOT NULL UNIQUE`
  - `logo_url: VARCHAR(500) NULL`
  - `origin_country: VARCHAR(50) NULL`
  - `is_featured: BOOLEAN DEFAULT false`
  - `created_at / updated_at`
- **Do NOT introduce** supplier, vendor, contract, or procurement tables.

---

## 4. NEWS AUTHOR AND TAG ARCHITECTURE

### ISSUE
`PHASE_1_DOMAIN_MODEL.md` classified `Author` and `Tag` as Value Objects, but left the relational persistence strategy ambiguous, creating a risk that Phase 2 might introduce unnecessary normalized tables (`authors`, `tags`) and many-to-many junction tables (`news_article_tags`).

### EVIDENCE
1. **`src/types/news.ts` (Lines 13–17, 32):**
   ```typescript
   export interface NewsArticle {
     ...
     author: {
       name: string;
       role: string;
       avatar?: string;
     };
     tags: string[];
     ...
   }
   ```
2. **`src/data/news.ts`:**
   Authors represent editorial bylines of Aura specialists:
   - *"Nguyễn Thành Nam — Head of Technical Solutions, Aura"*
   - *"Lê Minh Quân — F&B Market Strategist"*
   - *"Trần Vũ Hoàng — Master Trainer, Aura Academy"*
   These individuals are **editorial staff bylines, NOT platform user accounts**. Linking them via foreign key to the `User` table is impossible because `User.role` is restricted to `'owner' | 'barista' | 'guest'`.
3. **`src/app/news/[slug]/page.tsx` (Lines 34, 80–95, 204–212):**
   - `author` is rendered as an inline byline block showing avatar, name, and role.
   - `tags` is injected into SEO metadata: `keywords: [...article.tags, 'Aura Coffee Solutions', 'Tin tức cà phê']`.
   - `tags` is rendered in the article footer as a list of static hashtag chips (`#Sanremo`, `#Multi-Boiler`).
   - There is **no author profile page (`/author/[id]`)** and **no tag archive page (`/news/tags/[tag]`)**.
4. **`src/components/news/NewsClientView.tsx` (Lines 13–17):**
   Filtering is performed **strictly by topic category** (`NewsCategory`: `'all' | 'new-products' | 'market-trends' | 'barista-tech'`). There is zero filtering by author or tag.

### RISK
- **Relational Overhead:** A normalized `tags` table and `news_article_tags` junction table requires multiple joins for every article read, plus complex insertion logic, solely to display 3–4 static hashtag strings and SEO meta tags.
- **Account Identity Violation:** Forcing `author` into a foreign key referencing `users` would require registering internal journalists as customer accounts, violating authentication boundaries.

### RECOMMENDATION
1. **Author:** Model as embedded value object columns directly on `news_articles`:
   - `author_name: VARCHAR(100) NOT NULL`
   - `author_role: VARCHAR(150) NOT NULL`
   - `author_avatar_url: VARCHAR(500) NULL`
   *No separate `authors` table. No foreign key to `users`.*
2. **Tags:** Model as a native array or JSON column directly on `news_articles`:
   - `tags: VARCHAR(50)[]` (PostgreSQL native array) or `tags: JSONB`
   *No separate `tags` table. No junction table.*
   *Array/JSONB natively supports indexing (e.g., GIN index) if keyword search is required in the future, while eliminating table joins completely.*

---

## 5. GENERAL ARCHITECTURAL CONSISTENCY AUDIT

### 5.1 Category Domain vs Product Domain (Integrity Hazard)
- **ISSUE:** Both `Category` and `Product` have a `domain` attribute (`'equipment' | 'ingredients'`). Storing `domain` independently on both tables creates a split-brain risk where an equipment product could reference an ingredient category.
- **EVIDENCE:**
  - `src/types/product.ts` (Lines 1–20, 26, 41, 59): `EquipmentCategory` and `IngredientCategory` are mutually exclusive subsets under `ProductDomain`.
  - In `src/data/products.ts`, every product's category strictly belongs to its domain.
- **RISK:** Admin could update `product.category_id` to a category belonging to the opposite domain, corrupting catalog segmentation and filter rails.
- **RECOMMENDATION:**
  - `Category` is the natural authoritative owner of `domain`.
  - In the physical schema, `Product.domain` acts as the discriminator for Class Table Inheritance. A composite foreign key or a check constraint `CHECK (domain = (SELECT domain FROM categories WHERE id = category_id))` must enforce domain parity.

### 5.2 `NewsArticle.category` vs `NewsArticle.categoryLabel` (Field Duplication)
- **ISSUE:** `NewsArticle` contains both `category: NewsCategory` and `categoryLabel: string` (e.g., `'new-products'` and `'Sản Phẩm Mới'`).
- **EVIDENCE:**
  - `src/types/news.ts` lines 8–9: `category: NewsCategory; categoryLabel: string;`.
  - In `src/data/news.ts`, every `'new-products'` has `'Sản Phẩm Mới'`, every `'market-trends'` has `'Thị Trường F&B'`, every `'barista-tech'` has `'Kỹ Thuật & Barista'`.
- **RISK:** Persisting both columns stores the same business fact twice. Updating one without the other leads to UI display corruption.
- **RECOMMENDATION:**
  - Store only `category: VARCHAR(50)` (the machine slug/key) in `news_articles`.
  - Display labels belong to application localization or reference taxonomy. Do NOT persist `category_label` as an independent database column.

### 5.3 `NewsArticle.readTime` (Persisting Formatted UI Strings)
- **ISSUE:** `readTime` is stored as a hardcoded localized string (e.g., `'4 phút đọc'`).
- **EVIDENCE:**
  - `src/types/news.ts` line 11: `readTime: string;`.
  - `src/data/news.ts`: lines 12, 60, 108.
- **RISK:** If the article content is modified or expanded in the database, the persisted static string becomes factually wrong.
- **RECOMMENDATION:**
  - `readTime` is a derived presentation attribute computed dynamically at runtime from content length (`Math.ceil(words / 200) + ' phút đọc'`).
  - Do NOT persist `read_time` as a database column.

### 5.4 `Order.total` Authority vs Classification Contradiction
- **ISSUE:** `PHASE_1_DOMAIN_MODEL.md` classified `orderTotal` as a `TRANSIENT / DERIVED` model in Section A (Line 45), but claimed `Order.total_amount` is authoritative on `Order` in Section I (Line 428).
- **EVIDENCE:**
  - `src/types/order.ts` line 17: `total: number;`.
  - `src/components/shared/CheckoutModal.tsx` lines 148–151: `orderTotal = checkoutItems.reduce(...)`.
- **RISK:** Architectural ambiguity: if an order total is treated as derived, a financial auditor or query might attempt to recalculate past orders dynamically, diverging if line items or tax policies change.
- **RECOMMENDATION:**
  - Resolve the ambiguity: In the transient cart session, `cartTotal` is derived.
  - On the persistent `Order` aggregate, `total_amount: INTEGER NOT NULL` is an **authoritative, immutable snapshot**. Once an order is placed, the financial total must never be recomputed from child rows.

### 5.5 `VietQR Payment Reference` Syntax Generation
- **ISSUE:** `PHASE_1_DOMAIN_MODEL.md` (Line 432) listed `Order.payment_reference` as an authoritative business fact constructed from `order_id` and customer phone.
- **EVIDENCE:**
  - `src/components/shared/CheckoutModal.tsx` line 157:
    `const transferSyntax = \`AURA \${orderId} \${phone ? phone.slice(-4) : '2026'}\`;`
- **RISK:** Storing `payment_reference` as a separate mutable column invites data desynchronization if phone numbers are formatted or trimmed.
- **RECOMMENDATION:**
  - `Order.order_code` (e.g., `AURA-719245`) is the sole authoritative transaction identifier.
  - The bank transfer syntax is a deterministic formatting template `AURA {order_code} {phone_last_4}`. It can be generated at query time or stored as an immutable derived reference string upon order placement.

---

## REVISED DATA OWNERSHIP & BOUNDARY MATRIX

With these 5 consistency issues resolved, the corrected authoritative data ownership is finalized:

| Business Fact | Authoritative Owner | Non-Authoritative / Derived Places (Forbidden from Independent Persistence) |
|---|---|---|
| **Product Price** | `Product.price` (Integer VND) | `formattedPrice` (Derived UI string), legacy mock arrays. |
| **Historical Price** | `OrderItem.snapshotted_unit_price` | Live `Product.price` must never be queried for historical orders. |
| **Product Availability** | `Product.is_in_stock` (Boolean) | `availability_status` (Eliminated), `lead_time_notice` (Informational text only). |
| **Procurement Notice** | `Product.lead_time_notice` (Text) | Must not dictate in-stock status or checkout blocking. |
| **Brand Taxonomy** | `Brand.name` & `slug` | Plain string brand names; must not be expanded into supplier entities. |
| **Category Taxonomy** | `Category.name` & `slug` | Hardcoded string enums; Category is the authoritative owner of `domain`. |
| **Order Total** | `Order.total_amount` (Integer VND) | Must not be dynamically re-derived on historical records. |
| **Order Shipping Info** | `Order.shipping_*` (Snapshotted columns) | `User` profile (Zero address columns on User). |
| **Article Author** | `NewsArticle.author_*` (Embedded columns) | No `authors` table; authors are editorial bylines, not user accounts. |
| **Article Tags** | `NewsArticle.tags` (Native Array / JSONB) | No `tags` table; no `news_article_tags` junction table. |
| **Article Read Time** | Computed dynamically at runtime | No `read_time` database column. |
| **Article Category Label**| Derived from `Category` code/slug | No `category_label` database column. |

---

## REVIEW GATE DECISION & NEXT ACTIONS

### Findings Summary
1. `User.address`: Storing an authoritative profile address on `User` is **UNSUPPORTED** by the audited code. Must be removed from `User` and kept strictly as an immutable snapshot on `Order`.
2. `Product availability`: Having both `in_stock` and `availability_status` is a **DUPLICATION HAZARD**. `is_in_stock: boolean` is the sole authoritative source; `lead_time_notice` is informational.
3. `Brand domain`: Brand is strictly **CATALOG REFERENCE DATA**. Zero supplier/vendor capabilities exist in code.
4. `News Author & Tag`: Author is an **EMBEDDED VALUE OBJECT**; Tags are a **NATIVE ARRAY/JSON COLUMN**. Normalized tables are unjustified.
5. `General consistency`: Eliminated duplicate category labels, static read times, and clarified order total snapshot authority.

Because `PHASE_1_DOMAIN_MODEL.md` currently contains the unsupported `User.address` profile designation and the redundant `availability_status` enum, it must be formally aligned before proceeding to physical schema design.

---

### PHASE 1 STATUS:
**REQUIRES REVISION**

*(Pending update of `/docs/database/PHASE_1_DOMAIN_MODEL.md` with the 5 binding corrections established in this review document before advancing to Phase 2 Schema Design.)*
