# PHYSICAL DATABASE SCHEMA SPECIFICATION

**Document:** `/docs/database/DATABASE_SCHEMA.md`  
**Repository:** `nguyendz2k4/WebCF` (`FE` Workspace)  
**Baseline Documents:**
- `/docs/database/PHASE_0_CODEBASE_AUDIT.md`
- `/docs/database/PHASE_1_DOMAIN_MODEL.md` (Updated with binding review corrections)
- `/docs/database/PHASE_1_FINAL_REVIEW.md`

---

## 1. DATABASE ENGINE DECISION

### Architectural Context & Ecosystem Evaluation
1. **Application Runtime:** Next.js 16.3.2 (React 19, TypeScript, Node.js 22.20 LTS).
2. **Backend Directory (`../BE`):** Initialized with `.gitkeep` (`chore: khoi tao thu muc BE`). The host system has .NET 9.0 SDK and Microsoft SQL Server installed, indicating future potential for an enterprise C# microservice.
3. **Deployment Target:** Production deployments for modern Next.js commerce typically utilize managed relational engines (Supabase, Neon Serverless PostgreSQL, AWS RDS Aurora PostgreSQL, or Azure Database for PostgreSQL).
4. **Local Development & Self-Contained Execution:** Requires a relational engine that can run directly without forcing external credentials, port conflicts, or background daemon prerequisites.

### Engine Decision: PostgreSQL (Production) with SQLite Embedded Engine (Dev/Test/Runtime)
To deliver maximum operational reliability, constraints enforcement, and immediate execution without third-party dependencies:
* **Production Standard:** **PostgreSQL 15+**
  * Provides native array types (`VARCHAR[]`), `JSONB` binary storage, GIN indexes for tag containment and full-text search, and partial unique indexes (`WHERE deleted_at IS NULL`).
  * Full ANSI SQL compliance, supported seamlessly by EF Core (Npgsql) in `../BE` and Node.js ORMs (Drizzle / Prisma / pg).
* **Local Embedded & Automated Test Engine:** **SQLite 3.35+**
  * Zero-configuration, zero-daemon, in-process ACID engine running on all operating systems.
  * Enforces `FOREIGN KEY` constraints via `PRAGMA foreign_keys = ON;`.
  * Stores scalar arrays and structured bodies as validated JSON text.
  * Identical relational table structures, column constraints, indexes, and transactional semantics.

---

## 2. PHYSICAL SCHEMA DESIGN

### Entity-Relationship Summary
```
┌─────────────────┐       1:N       ┌────────────────────────┐
│   categories    │◀────────────────│        products        │
└─────────────────┘                 │  (Core Listing / Hot)  │
                                    └───────────┬────────────┘
┌─────────────────┐       1:N                   │
│     brands      │◀────────────────────────────┤
└─────────────────┘                             ├──────────────────────────┐
                                            1:1 │                      1:1 │
                                                ▼                          ▼
                                    ┌───────────────────────┐  ┌───────────────────────┐
                                    │equipment_specification│  │ingredient_specificat..│
                                    └───────────────────────┘  └───────────────────────┘
                                                ▲                          ▲
                                                │ 1:N                      │ 1:N
                                    ┌───────────┴───────────┐  ┌───────────┴───────────┐
                                    │     product_media     │  │      order_items      │
                                    └───────────────────────┘  └───────────┬───────────┘
                                                                           │ N:1
                                    ┌───────────────────────┐       N:1    ▼
                                    │         users         │◀─────────[ orders ]
                                    │ (Zero Address Columns)│
                                    └───────────────────────┘
```

---

### TABLE 1: `categories`
Reference taxonomy for catalog categorization. Authoritative owner of catalog `domain`.

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | None | **PRIMARY KEY**. Machine slug (e.g. `'espresso-machines'`). |
| `name` | `VARCHAR(100)` | NO | None | Display title in Vietnamese (e.g. `'Máy Pha Espresso'`). |
| `slug` | `VARCHAR(100)` | NO | None | **UNIQUE**. URL slug. |
| `domain` | `VARCHAR(20)` | NO | None | **CHECK (`domain` IN ('equipment', 'ingredients'))**. |
| `sort_order` | `INTEGER` | NO | `0` | Controls presentation order in sub-bars. |
| `is_active` | `BOOLEAN` | NO | `true` | Visibility toggle. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Record creation timestamp. |
| `updated_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Record update timestamp. |

---

### TABLE 2: `brands`
Catalog reference data for brand attribution and faceted filtering.

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | None | **PRIMARY KEY**. Brand code (e.g. `'sanremo'`, `'mahlkonig'`). |
| `name` | `VARCHAR(100)` | NO | None | **UNIQUE**. Official brand name. |
| `slug` | `VARCHAR(100)` | NO | None | **UNIQUE**. URL parameter slug. |
| `logo_url` | `VARCHAR(500)` | YES | `NULL` | Brand mark asset URL. |
| `origin_country`| `VARCHAR(50)` | YES | `NULL` | Country of origin (e.g. `'Ý'`, `'Đức'`). |
| `is_featured` | `BOOLEAN` | NO | `false` | Highlighted brand flag. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Record creation timestamp. |
| `updated_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Record update timestamp. |

---

### TABLE 3: `products` (Commercial Aggregate Root)
Core commercial catalog table. Narrow, HOT attributes optimized for grid listing, facet search, and sorting.

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | None | **PRIMARY KEY**. Product ID (e.g. `'sanremo-cafe-racer-custom-2026'`). |
| `slug` | `VARCHAR(150)` | NO | None | **UNIQUE**. Public URL routing slug (`/products/[slug]`). |
| `sku` | `VARCHAR(50)` | NO | None | **UNIQUE**. Internal stock keeping unit (e.g. `'AUR-EQ-SR-CR2'`). |
| `name` | `VARCHAR(255)` | NO | None | Authoritative product title. |
| `domain` | `VARCHAR(20)` | NO | None | **CHECK (`domain` IN ('equipment', 'ingredients'))**. |
| `category_id` | `VARCHAR(50)` | NO | None | **FOREIGN KEY** `REFERENCES categories(id) ON DELETE RESTRICT`. |
| `brand_id` | `VARCHAR(50)` | NO | None | **FOREIGN KEY** `REFERENCES brands(id) ON DELETE RESTRICT`. |
| `short_description`| `TEXT` | NO | None | Brief editorial summary for cards and search snippets. |
| `price` | `BIGINT` | NO | None | **CHECK (`price` >= 0)**. Authoritative integer in VND. |
| `price_type` | `VARCHAR(20)` | NO | `'fixed'` | **CHECK (`price_type` IN ('fixed', 'from', 'contact'))**. |
| `is_in_stock` | `BOOLEAN` | NO | `true` | **SOLE AUTHORITATIVE CURRENT AVAILABILITY**. |
| `lead_time_notice` | `VARCHAR(255)` | YES | `NULL` | Informational logistics text (e.g. `'Sẵn hàng tại kho HCM'`). |
| `is_featured` | `BOOLEAN` | NO | `false` | Homepage curator flag. |
| `primary_image_url`| `VARCHAR(500)` | NO | None | Primary display thumbnail. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Timestamp of catalog addition. |
| `updated_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Last metadata modification. |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete timestamp. Active when `NULL`. |

---

### TABLE 4: `equipment_specifications` (Vertical Partition)
1:1 extension table storing mechanical and electrical engineering attributes. Loaded on product detail, drawer inspection, or facet filtering.

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `product_id` | `VARCHAR(50)` | NO | None | **PRIMARY KEY & FOREIGN KEY** `REFERENCES products(id) ON DELETE CASCADE`. |
| `groups_count` | `INTEGER` | YES | `NULL` | **CHECK (`groups_count` IS NULL OR `groups_count` BETWEEN 1 AND 4)**. |
| `boiler_type` | `VARCHAR(100)` | YES | `NULL` | e.g. `'Dual Boiler AISI 316L'`, `'Multi-Boiler T3'`. |
| `boiler_capacity` | `VARCHAR(50)` | YES | `NULL` | e.g. `'8.5 L'`, `'14 L'`. |
| `pump_type` | `VARCHAR(100)` | YES | `NULL` | e.g. `'Rotary Volumetric'`. |
| `power_wattage` | `VARCHAR(50)` | YES | `NULL` | e.g. `'5800W'`, `'7200W'`. |
| `voltage` | `VARCHAR(20)` | YES | `NULL` | **CHECK (`voltage` IS NULL OR `voltage` IN ('220V', '380V', '220V/380V'))**. |
| `dimensions` | `VARCHAR(100)` | YES | `NULL` | e.g. `'878 x 680 x 534 mm'`. |
| `weight` | `VARCHAR(50)` | YES | `NULL` | e.g. `'97 kg'`. |
| `warranty_duration`| `VARCHAR(100)` | NO | None | Mandatory warranty term (e.g. `'24 tháng chính hãng'`). |
| `daily_capacity` | `VARCHAR(100)` | YES | `NULL` | Recommended duty cycle (e.g. `'300-500 tách/ngày'`). |
| `suitable_for` | `JSONB / TEXT` | NO | `'[]'` | JSON array of strings: `['home', 'boutique-cafe', 'high-volume', 'roastery', 'lab']`. |

---

### TABLE 5: `ingredient_specifications` (Vertical Partition)
1:1 extension table storing agronomic terroir, sensory attributes, and packaging.

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `product_id` | `VARCHAR(50)` | NO | None | **PRIMARY KEY & FOREIGN KEY** `REFERENCES products(id) ON DELETE CASCADE`. |
| `origin` | `VARCHAR(100)` | YES | `NULL` | Origin region/country (e.g. `'Cầu Đất, Đà Lạt'`, `'Ethiopia'`). |
| `sub_region` | `VARCHAR(100)` | YES | `NULL` | Sub-region terroir (e.g. `'Trạm Hành'`, `'Yirgacheffe'`). |
| `altitude` | `VARCHAR(50)` | YES | `NULL` | Growing altitude (e.g. `'1.500m - 1.650m'`). |
| `process_method` | `VARCHAR(100)` | YES | `NULL` | Post-harvest process (e.g. `'Yellow Honey'`, `'Washed'`). |
| `roast_profile` | `VARCHAR(20)` | YES | `NULL` | **CHECK (`roast_profile` IS NULL OR `roast_profile` IN ('Light', 'Medium', 'Medium-Dark', 'Dark'))**. |
| `cupping_score` | `DECIMAL(4,2)` | YES | `NULL` | **CHECK (`cupping_score` IS NULL OR (`cupping_score` >= 0 AND `cupping_score` <= 100))**. |
| `flavor_notes` | `JSONB / TEXT` | NO | `'[]'` | JSON array of tasting notes (e.g. `["Hoa nhài", "Cam bergamot"]`). |
| `unit_size` | `VARCHAR(50)` | NO | None | Package unit size (e.g. `'1kg'`, `'750ml'`, `'Hộp 1kg'`). |
| `case_size` | `VARCHAR(50)` | YES | `NULL` | Master carton size (e.g. `'Thùng 6 chai'`, `'Thùng 12 gói'`). |
| `shelf_life` | `VARCHAR(50)` | YES | `NULL` | Shelf stability term (e.g. `'12 tháng kể từ ngày rang'`). |

---

### TABLE 6: `product_media`
1:N secondary gallery assets. Separated from `products` to prevent large text/URL payload bloat on card queries.

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `id` | `INTEGER` | NO | Auto-Increment | **PRIMARY KEY**. |
| `product_id` | `VARCHAR(50)` | NO | None | **FOREIGN KEY** `REFERENCES products(id) ON DELETE CASCADE`. |
| `media_url` | `VARCHAR(500)` | NO | None | High-resolution image asset URL. |
| `sort_order` | `INTEGER` | NO | `0` | Order index in product gallery. |
| `alt_text` | `VARCHAR(255)` | YES | `NULL` | Accessibility text. |

---

### TABLE 7: `users`
Identity aggregate root. Represents registered customers, business accounts, and platform staff.

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | None | **PRIMARY KEY**. User UUID. |
| `name` | `VARCHAR(150)` | NO | None | Full customer name. |
| `email` | `VARCHAR(255)` | NO | None | **UNIQUE**. Identity login email. |
| `phone` | `VARCHAR(30)` | YES | `NULL` | Contact phone number. |
| `avatar` | `VARCHAR(500)` | YES | `NULL` | Profile avatar URL. |
| `role` | `VARCHAR(20)` | NO | `'guest'` | **CHECK (`role` IN ('owner', 'barista', 'guest', 'admin'))**. |
| `shop_name` | `VARCHAR(150)` | YES | `NULL` | B2B coffee shop or enterprise name. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Registration date. |
| `updated_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Last profile update. |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete timestamp. |

> [!IMPORTANT]
> **NO ADDRESS COLUMNS ON `users`:** As confirmed by the Phase 1 Review Gate, the user profile has zero address fields. Address is entered at checkout and snapshotted immutably on `orders`.

---

### TABLE 8: `orders` (Transactional Aggregate Root)
Authoritative purchase records and quote agreements. Immutably records fulfillment information.

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | None | **PRIMARY KEY**. Internal UUID. |
| `order_code` | `VARCHAR(30)` | NO | None | **UNIQUE**. Public reference code (e.g. `'AURA719245'`). |
| `user_id` | `VARCHAR(50)` | YES | `NULL` | **FOREIGN KEY** `REFERENCES users(id) ON DELETE SET NULL`. Nullable for guest purchases. |
| `total_amount` | `BIGINT` | NO | None | **CHECK (`total_amount` >= 0)**. Authoritative financial snapshot. |
| `payment_method` | `VARCHAR(20)` | NO | None | **CHECK (`payment_method` IN ('cod', 'vietqr'))**. |
| `payment_status` | `VARCHAR(30)` | NO | `'pending_verification'` | **CHECK (`payment_status` IN ('pending_verification', 'confirmed', 'rejected'))**. |
| `order_status` | `VARCHAR(30)` | NO | `'received'` | **CHECK (`order_status` IN ('received', 'processing', 'dispatched', 'completed', 'cancelled'))**. |
| `shipping_recipient_name`| `VARCHAR(150)` | NO | None | Snapshotted recipient name. |
| `shipping_phone` | `VARCHAR(30)` | NO | None | Snapshotted delivery phone. |
| `shipping_email` | `VARCHAR(255)` | YES | `NULL` | Snapshotted contact email. |
| `shipping_address_line` | `VARCHAR(255)` | NO | None | Snapshotted street address. |
| `shipping_province`| `VARCHAR(100)` | NO | None | Snapshotted province (1 of 63 VN provinces). |
| `shipping_district`| `VARCHAR(100)` | YES | `NULL` | Snapshotted district. |
| `shipping_note` | `TEXT` | YES | `NULL` | Logistics special instruction. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Order timestamp. Immutable. |
| `updated_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | State update timestamp. |

> [!CAUTION]
> **NO SOFT DELETE ON `orders`:** Financial and legal transactions must never be deleted. Cancellation is handled via `order_status = 'cancelled'`.

---

### TABLE 9: `order_items` (Order Line Sub-Entity)
Snapshots commercial facts at the moment of checkout. Preserves complete accounting validity if catalog items are updated or removed.

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | None | **PRIMARY KEY**. Line item UUID. |
| `order_id` | `VARCHAR(50)` | NO | None | **FOREIGN KEY** `REFERENCES orders(id) ON DELETE CASCADE`. |
| `product_id` | `VARCHAR(50)` | YES | `NULL` | **FOREIGN KEY** `REFERENCES products(id) ON DELETE SET NULL`. |
| `snapshotted_title`| `VARCHAR(255)` | NO | None | Product title at checkout. |
| `snapshotted_sku` | `VARCHAR(50)` | YES | `NULL` | Product SKU at checkout. |
| `snapshotted_unit_price` | `BIGINT` | NO | None | **CHECK (`snapshotted_unit_price` >= 0)**. Unit price in VND at checkout. |
| `quantity` | `INTEGER` | NO | None | **CHECK (`quantity` > 0)**. Number of units purchased. |
| `snapshotted_specs`| `VARCHAR(255)` | YES | `NULL` | Applied specs (e.g. `'2G · Dual PID'`). |

---

### TABLE 10: `news_articles` (Content Aggregate Root)
Editorial publication records. Contains HOT listing attributes, embedded author attribution, and native array/JSON tags.

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | None | **PRIMARY KEY**. Article ID (e.g. `'news-sanremo-racer-2026'`). |
| `slug` | `VARCHAR(150)` | NO | None | **UNIQUE**. Article URL slug (`/news/[slug]`). |
| `title` | `VARCHAR(255)` | NO | None | Article headline. |
| `excerpt` | `TEXT` | NO | None | Editorial summary for news cards. |
| `category` | `VARCHAR(50)` | NO | None | **CHECK (`category` IN ('new-products', 'market-trends', 'barista-tech'))**. Canonical slug only. |
| `published_at` | `VARCHAR(50)` | NO | None | Publishing date string. |
| `cover_image_url` | `VARCHAR(500)` | NO | None | Lead cover image. |
| `featured` | `BOOLEAN` | NO | `false` | Featured article flag. |
| `author_name` | `VARCHAR(100)` | NO | None | Embedded author attribution name. |
| `author_role` | `VARCHAR(150)` | NO | None | Embedded author job title. |
| `author_avatar_url`| `VARCHAR(500)` | YES | `NULL` | Embedded author avatar image. |
| `tags` | `JSONB / TEXT` | NO | `'[]'` | JSON array of SEO/display hashtag tags. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Creation timestamp. |
| `updated_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Last updated timestamp. |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete timestamp. |

---

### TABLE 11: `news_article_content` (Vertical Partition)
1:1 extension table storing heavy body sections. Isolated from news cards to keep listing queries ultra-fast.

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `article_id` | `VARCHAR(50)` | NO | None | **PRIMARY KEY & FOREIGN KEY** `REFERENCES news_articles(id) ON DELETE CASCADE`. |
| `lead_paragraph` | `TEXT` | NO | None | Editorial intro paragraph. |
| `structured_sections`| `JSONB / TEXT` | NO | None | JSON array of structured body sections (heading, body paragraphs, pullQuotes, keyPoints, images). |

---

### TABLE 12: `contact_inquiries`
Lead consultation and B2B inquiry records from `ContactForm.tsx`.

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | None | **PRIMARY KEY**. Inquiry UUID. |
| `inquiry_type` | `VARCHAR(30)` | NO | `'consultation'` | **CHECK (`inquiry_type` IN ('general', 'consultation', 'quote'))**. |
| `sender_name` | `VARCHAR(150)` | NO | None | Submitter full name. |
| `phone` | `VARCHAR(30)` | NO | None | Submitter contact phone. |
| `email` | `VARCHAR(255)` | NO | None | Submitter email address. |
| `company_name` | `VARCHAR(150)` | YES | `NULL` | Café name / venture company. |
| `budget_range` | `VARCHAR(100)` | YES | `NULL` | Projected budget tier. |
| `message` | `TEXT` | NO | None | Detailed inquiry requirement. |
| `status` | `VARCHAR(20)` | NO | `'new'` | **CHECK (`status` IN ('new', 'contacted', 'converted', 'archived'))**. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Inquiry submission timestamp. |
