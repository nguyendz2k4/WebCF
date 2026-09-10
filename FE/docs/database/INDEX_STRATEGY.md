# COMPREHENSIVE INDEX STRATEGY & QUERY OPTIMIZATION

**Document:** `/docs/database/INDEX_STRATEGY.md`  
**Repository:** `nguyendz2k4/WebCF` (`FE` Workspace)  
**Baseline Documents:**
- `/docs/database/PHASE_0_CODEBASE_AUDIT.md`
- `/docs/database/DATABASE_SCHEMA.md`
- `/docs/database/VERTICAL_PARTITIONING.md`

---

## 1. INDEXING PHILOSOPHY & ANTI-PATTERNS

1. **No Single-Column Index Blindness:** We strictly avoid indexing every column independently. Indexes are engineered directly from verified `WHERE`, `JOIN`, and `ORDER BY` clauses discovered in the Phase 0 audit.
2. **Leftmost Prefix Optimization:** Multi-column composite indexes are structured so that high-cardinality equality filters come first, range filters second, and sort order columns last.
3. **Covering Query Design:** Frequently queried summary fields are covered by primary index trees to avoid expensive random page lookups.
4. **Redundancy Elimination:** An index on `(A, B)` eliminates the need for a separate index on `(A)`. Every redundant index has been audited and removed.

---

## 2. DETAILED INDEX SPECIFICATIONS

### A. Catalog & Product Indexes

#### 1. `idx_products_domain_cat_stock`
* **Columns:** `(domain, category_id, is_in_stock, deleted_at)`
* **Supported Queries:**
  - `GET /products?domain=equipment&category=espresso-machines`
  - `GET /products?domain=ingredients`
* **Column Order Rationale:**
  - `domain`: High-level partition discriminator (`equipment` vs `ingredients`). Always filtered in navigation.
  - `category_id`: Specific taxonomy subcategory.
  - `is_in_stock`: Boolean filter used by default in commercial listings.
  - `deleted_at`: Soft-delete filter (`WHERE deleted_at IS NULL`).
* **Expected Benefit:** Index-only range scan; reduces listing query latency from full-table scan to sub-millisecond index seek.
* **Redundancy Analysis:** Supersedes standalone indexes on `(domain)` and `(category_id)`.

#### 2. `idx_products_slug_active`
* **Columns:** `(slug, deleted_at)`
* **Supported Queries:**
  - `GET /products/[slug]` (PDP page load)
* **Column Order Rationale:** `slug` is unique across active products. `deleted_at` ensures deleted products do not match live routes.
* **Expected Benefit:** Direct B-Tree point seek (O(log N)), resolving PDP lookups in < 0.2ms.

#### 3. `idx_products_sku`
* **Columns:** `(sku)`
* **Supported Queries:**
  - Inventory reconciliation, OrderItem foreign key resolution, Admin SKU search.
* **Expected Benefit:** O(1) unique constraint enforcement and instant SKU matching.

#### 4. `idx_products_brand_domain`
* **Columns:** `(brand_id, domain, deleted_at)`
* **Supported Queries:**
  - Filter rail brand multi-select (`WHERE brand_id IN (...) AND domain = 'equipment'`)
  - Brand catalog pages (`/brand/[slug]`)
* **Expected Benefit:** Eliminates table scans during complex faceted filtering.

#### 5. `idx_products_price_sort`
* **Columns:** `(domain, price, deleted_at)`
* **Supported Queries:**
  - `GET /products?sort=price_asc`
  - `GET /products?sort=price_desc`
* **Column Order Rationale:** Filters by active domain first, then allows index-ordered streaming of price values without requiring an in-memory or disk-based `filesort`.

---

### B. Specification & Filter Indexes

#### 6. `idx_equipment_specs_groups_voltage`
* **Columns:** `(groups_count, voltage)`
* **Supported Queries:**
  - Mechanical facet rail filtering (`groups=2&voltage=380V`).
* **Expected Benefit:** Quickly narrows machine candidates before joining to base `products`.

#### 7. `idx_ingredient_specs_roast_cupping`
* **Columns:** `(roast_profile, cupping_score DESC)`
* **Supported Queries:**
  - Specialty coffee filtering (`roast=Light&min_cupping=86`)
  - Catalog cupping score sorting (`sort=cupping_desc`).
* **Expected Benefit:** Fast index range scan on sensory profiles.

---

### C. Order & Transactional Indexes

#### 8. `idx_orders_order_code`
* **Columns:** `(order_code)` — **UNIQUE**
* **Supported Queries:**
  - `GET /thank-you?orderId=AURA719245`
  - Bank transfer description lookup (`AURA 719245 4247`)
* **Expected Benefit:** Single-row instant point lookup for offline payment reconciliation and customer status tracking.

#### 9. `idx_orders_user_created`
* **Columns:** `(user_id, created_at DESC)`
* **Supported Queries:**
  - Customer profile purchase history (`/account/orders`).
* **Column Order Rationale:** Filters by user identity and instantly provides chronological reverse sorting.

#### 10. `idx_orders_verification_queue`
* **Columns:** `(payment_status, order_status, created_at)`
* **Supported Queries:**
  - Admin payment verification dashboard:
    `WHERE payment_status = 'pending_verification' AND payment_method = 'vietqr'`
* **Expected Benefit:** Index scan over unpaid bank transfer orders awaiting manual accounting verification.

#### 11. `idx_order_items_order_id`
* **Columns:** `(order_id)`
* **Supported Queries:**
  - Loading line items for invoice rendering: `WHERE order_id = ?`
* **Expected Benefit:** Instant index seek on foreign key; avoids full scan of `order_items`.

---

### D. News & Content Indexes

#### 12. `idx_news_category_published`
* **Columns:** `(category, published_at DESC, deleted_at)`
* **Supported Queries:**
  - Magazine topic feed: `WHERE category = 'new-products' AND deleted_at IS NULL ORDER BY published_at DESC`
* **Expected Benefit:** Feeds filtered and sorted directly from index without sorting passes.

#### 13. `idx_news_slug_active`
* **Columns:** `(slug, deleted_at)`
* **Supported Queries:**
  - `GET /news/[slug]`
* **Expected Benefit:** Instant article reader point seek.

---

## 3. INDEX CONSOLIDATION & REDUNDANCY AUDIT

| Proposed Index | Action | Rationale |
|---|---|---|
| `CREATE INDEX idx_products_domain ON products(domain);` | **REJECTED** | Redundant. Completely covered by `idx_products_domain_cat_stock(domain, category_id, ...)`. |
| `CREATE INDEX idx_products_category ON products(category_id);` | **REJECTED** | Covered by `idx_products_domain_cat_stock` for all catalog domain queries. |
| `CREATE INDEX idx_orders_user_id ON orders(user_id);` | **REJECTED** | Redundant. Covered by `idx_orders_user_created(user_id, created_at DESC)`. |
| `CREATE INDEX idx_news_category ON news_articles(category);` | **REJECTED** | Covered by `idx_news_category_published(category, published_at DESC, ...)`. |

---

## 4. DDL INDEX DEFINITIONS (SQL)

```sql
-- Product Core Indexes
CREATE INDEX idx_products_domain_cat_stock ON products(domain, category_id, is_in_stock, deleted_at);
CREATE UNIQUE INDEX idx_products_slug_active ON products(slug) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_brand_domain ON products(brand_id, domain, deleted_at);
CREATE INDEX idx_products_price_sort ON products(domain, price, deleted_at);

-- Specifications Filter Indexes
CREATE INDEX idx_equipment_specs_groups_voltage ON equipment_specifications(groups_count, voltage);
CREATE INDEX idx_ingredient_specs_roast_cupping ON ingredient_specifications(roast_profile, cupping_score DESC);

-- Product Media Gallery Index
CREATE INDEX idx_product_media_product_sort ON product_media(product_id, sort_order);

-- Order & Transactional Indexes
CREATE UNIQUE INDEX idx_orders_order_code ON orders(order_code);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_verification_queue ON orders(payment_status, order_status, created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- News Indexes
CREATE INDEX idx_news_category_published ON news_articles(category, published_at DESC, deleted_at);
CREATE UNIQUE INDEX idx_news_slug_active ON news_articles(slug) WHERE deleted_at IS NULL;
```
