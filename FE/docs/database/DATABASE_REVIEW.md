# HOSTILE SENIOR DBA ARCHITECTURAL ATTACK & AUDIT

**Document:** `/docs/database/DATABASE_REVIEW.md`  
**Repository:** `nguyendz2k4/WebCF` (`FE` Workspace)  
**Role:** Hostile Senior Relational Database Administrator Review  
**Target:** `/docs/database/DATABASE_SCHEMA.md` & `/docs/database/INDEX_STRATEGY.md`

---

## 1. AUDIT METHODOLOGY

As an adversarial Senior DBA, my objective is to stress-test the schema for:
- Data corruption vectors under concurrent traffic.
- Unenforced domain integrity rules that permit invalid states.
- Performance cliffs (unindexed joins, filesorts, lock contention).
- Edge-case bugs with soft deletes and historical financial reconciliation.

---

## 2. DEFECT LOG & RISK SEVERITY ASSESSMENT

### DEFECT 1: [CRITICAL] Domain / Category Integrity Parity Gap
* **The Vulnerability:**
  In `DATABASE_SCHEMA.md`, the `products` table defined:
  ```sql
  domain VARCHAR(20) CHECK (domain IN ('equipment', 'ingredients')),
  category_id VARCHAR(50) REFERENCES categories(id)
  ```
  A standard single-column foreign key on `category_id` checks ONLY that the category exists in `categories`. It does **NOT** check that the category's domain matches the product's domain.
  An application bug, rogue SQL script, or admin user could insert:
  `name = 'La Marzocco Linea Mini', domain = 'equipment', category_id = 'syrups'`
  This corrupts category rails, navigation menus, and facet filters.
* **DBA Severity:** **CRITICAL** (Data Corruption Hazard).
* **Mandatory Architectural Fix:**
  Enforce composite relational parity at the database constraint layer:
  1. Add a composite unique constraint on `categories`:
     ```sql
     ALTER TABLE categories ADD CONSTRAINT uq_categories_id_domain UNIQUE (id, domain);
     ```
  2. Define the foreign key on `products` as a composite foreign key referencing `(category_id, domain)`:
     ```sql
     ALTER TABLE products ADD CONSTRAINT fk_products_category_domain 
     FOREIGN KEY (category_id, domain) REFERENCES categories(id, domain) ON DELETE RESTRICT;
     ```
  Now, the database engine physically rejects any insert or update where `product.domain != category.domain`!

---

### DEFECT 2: [HIGH] Soft-Deleted Slug Collision Failure
* **The Vulnerability:**
  `products` and `news_articles` defined standard `UNIQUE (slug)` constraints.
  If a product is soft-deleted (`deleted_at = '2026-09-04 12:00:00'`), and a merchandiser later publishes a revised version with the exact same slug (e.g. `'sanremo-cafe-racer-2026'`), the database throws a fatal unique constraint violation!
* **DBA Severity:** **HIGH** (Catalog Operation Blocker).
* **Mandatory Architectural Fix:**
  Replace standard table-level unique constraints on `slug` with **Partial Unique Indexes**:
  ```sql
  -- Drop standard table unique constraint
  CREATE UNIQUE INDEX uq_products_active_slug ON products(slug) WHERE deleted_at IS NULL;
  CREATE UNIQUE INDEX uq_news_active_slug ON news_articles(slug) WHERE deleted_at IS NULL;
  ```
  This guarantees URL uniqueness across all active products, while permitting archived or retired products to retain their historical slug. (Supported natively in PostgreSQL and SQLite 3.8+).

---

### DEFECT 3: [HIGH] Accidental Cascade Deletion of Financial History
* **The Vulnerability:**
  If an administrator hard-deletes an obsolete product row, what happens to `order_items`?
  If `order_items.product_id` had `ON DELETE CASCADE`, all past customer receipts and accounting lines referencing that product would be wiped from existence.
* **DBA Severity:** **HIGH** (Audit & Accounting Non-Compliance).
* **Mandatory Architectural Fix:**
  Enforce `ON DELETE SET NULL` on `order_items.product_id`:
  ```sql
  product_id VARCHAR(50) NULL REFERENCES products(id) ON DELETE SET NULL
  ```
  Because `order_items` snapshots `snapshotted_title`, `snapshotted_sku`, and `snapshotted_unit_price`, setting `product_id` to `NULL` preserves 100% of the financial transaction and tax history without breaking invoice integrity.

---

### DEFECT 4: [MEDIUM] Line Total Calculation & Negative Price Exploits
* **The Vulnerability:**
  If an API route accepts an order with `snapshotted_unit_price = -50000000` or `quantity = 0`, the database would record negative total receipts. Furthermore, recalculating `quantity * unit_price` on every analytics query invites floating-point or integer overflow inconsistencies.
* **DBA Severity:** **MEDIUM** (Financial Logic Hazard).
* **Mandatory Architectural Fix:**
  Add strict unsigned integrity constraints:
  ```sql
  CONSTRAINT chk_order_items_positive_qty CHECK (quantity > 0),
  CONSTRAINT chk_order_items_non_negative_price CHECK (snapshotted_unit_price >= 0),
  CONSTRAINT chk_orders_non_negative_total CHECK (total_amount >= 0)
  ```
  Additionally, add a generated or validated column:
  `line_total BIGINT NOT NULL` with `CHECK (line_total = snapshotted_unit_price * quantity)`.

---

### DEFECT 5: [MEDIUM] Gallery Image Duplication & Ordering Ambiguity
* **The Vulnerability:**
  `products.primary_image_url` holds the main card thumbnail. `product_media` holds gallery images. If `product_media` also contains the primary image, updating a product's photo requires updating two tables in a transaction. If it does not, gallery queries return only secondary images.
* **DBA Severity:** **MEDIUM** (Data Synchronization Complexity).
* **Mandatory Architectural Fix:**
  Formalize the media contract:
  - `products.primary_image_url` is the **authoritative cover image** (HOT, always returned on card queries).
  - `product_media` stores **secondary gallery assets only** (`sort_order >= 1`).
  - Add `CHECK (sort_order >= 1)` on `product_media`. When the PDP loads, it renders `[product.primary_image_url, ...product_media.map(m => m.media_url)]`. Zero duplication!

---

### DEFECT 6: [LOW] Unhandled Administrative Role
* **The Vulnerability:**
  The `User.role` enum in `src/types/index.ts` only included `'owner' | 'barista' | 'guest'`. Once a backend database is deployed, staff members need administrative privileges to update prices and verify VietQR transfers.
* **DBA Severity:** **LOW** (Access Control Limitation).
* **Mandatory Architectural Fix:**
  Expand the check constraint:
  `CHECK (role IN ('owner', 'barista', 'guest', 'admin'))`

---

## 3. AUDIT CONCLUSION & REMEDIATION STATUS

All 6 defects identified by this hostile review have been resolved and integrated into the final physical schema specifications.

| Defect ID | Severity | Status | Solution Implemented |
|---|---|---|---|
| **DEFECT 1** | CRITICAL | **RESOLVED** | Composite Foreign Key `(category_id, domain)` references `categories(id, domain)`. |
| **DEFECT 2** | HIGH | **RESOLVED** | Partial Unique Indexes on `(slug) WHERE deleted_at IS NULL`. |
| **DEFECT 3** | HIGH | **RESOLVED** | `ON DELETE SET NULL` on `order_items.product_id` with snapshotted fields. |
| **DEFECT 4** | MEDIUM | **RESOLVED** | Explicit `CHECK` constraints on positive quantity, non-negative amounts, and line total parity. |
| **DEFECT 5** | MEDIUM | **RESOLVED** | Clean separation: `primary_image_url` (Cover) vs `product_media` (Secondary Gallery, `sort_order >= 1`). |
| **DEFECT 6** | LOW | **RESOLVED** | Added `'admin'` to `users.role` check constraint. |
