# FINAL PRODUCTION DATABASE DDL SPECIFICATION

**Document:** `/docs/database/FINAL_SCHEMA.md`  
**Repository:** `nguyendz2k4/WebCF` (`FE` Workspace)  
**Status:** APPROVED FOR IMPLEMENTATION (Post-DBA Review)  
**Standard:** ANSI SQL / PostgreSQL 15+ (100% compatible with SQLite 3.35+ and EF Core .NET 9)

---

## 1. DDL CREATION SCRIPT

```sql
-- ============================================================================
-- 1. REFERENCE & TAXONOMY TABLES
-- ============================================================================

-- Categories (Taxonomy Root)
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    domain VARCHAR(20) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_categories_domain CHECK (domain IN ('equipment', 'ingredients')),
    CONSTRAINT uq_categories_slug UNIQUE (slug),
    -- Composite unique key to enforce Domain/Category parity across products
    CONSTRAINT uq_categories_id_domain UNIQUE (id, domain)
);

-- Brands (Reference Data - Catalog Taxonomy Only)
CREATE TABLE brands (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    logo_url VARCHAR(500) NULL,
    origin_country VARCHAR(50) NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_brands_name UNIQUE (name),
    CONSTRAINT uq_brands_slug UNIQUE (slug)
);

-- ============================================================================
-- 2. CORE COMMERCIAL CATALOG (Vertical Partition: HOT)
-- ============================================================================

CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(150) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(20) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    brand_id VARCHAR(50) NOT NULL,
    short_description TEXT NOT NULL,
    price BIGINT NOT NULL,
    price_type VARCHAR(20) NOT NULL DEFAULT 'fixed',
    is_in_stock BOOLEAN NOT NULL DEFAULT true,
    lead_time_notice VARCHAR(255) NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    primary_image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    
    -- Constraints
    CONSTRAINT chk_products_domain CHECK (domain IN ('equipment', 'ingredients')),
    CONSTRAINT chk_products_price CHECK (price >= 0),
    CONSTRAINT chk_products_price_type CHECK (price_type IN ('fixed', 'from', 'contact')),
    CONSTRAINT uq_products_sku UNIQUE (sku),
    CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) 
        REFERENCES brands(id) ON DELETE RESTRICT,
    -- DBA FIX: Composite Foreign Key enforcing Domain/Category parity
    CONSTRAINT fk_products_category_domain FOREIGN KEY (category_id, domain) 
        REFERENCES categories(id, domain) ON DELETE RESTRICT
);

-- Partial Unique Index on active products (DBA FIX: Avoids collision on soft-deleted slugs)
CREATE UNIQUE INDEX uq_products_active_slug ON products(slug) WHERE deleted_at IS NULL;

-- ============================================================================
-- 3. PRODUCT EXTENSIONS (Vertical Partition: WARM & LARGE)
-- ============================================================================

-- Equipment Specifications (1:1 Extension for Machines & Gear)
CREATE TABLE equipment_specifications (
    product_id VARCHAR(50) PRIMARY KEY,
    groups_count INTEGER NULL,
    boiler_type VARCHAR(100) NULL,
    boiler_capacity VARCHAR(50) NULL,
    pump_type VARCHAR(100) NULL,
    power_wattage VARCHAR(50) NULL,
    voltage VARCHAR(20) NULL,
    dimensions VARCHAR(100) NULL,
    weight VARCHAR(50) NULL,
    warranty_duration VARCHAR(100) NOT NULL,
    daily_capacity VARCHAR(100) NULL,
    suitable_for JSONB NOT NULL DEFAULT '[]',
    CONSTRAINT fk_equipment_specs_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT chk_equipment_specs_groups CHECK (groups_count IS NULL OR groups_count BETWEEN 1 AND 4),
    CONSTRAINT chk_equipment_specs_voltage CHECK (voltage IS NULL OR voltage IN ('220V', '380V', '220V/380V'))
);

-- Ingredient Specifications (1:1 Extension for Beans, Syrups, Tea, Matcha)
CREATE TABLE ingredient_specifications (
    product_id VARCHAR(50) PRIMARY KEY,
    origin VARCHAR(100) NULL,
    sub_region VARCHAR(100) NULL,
    altitude VARCHAR(50) NULL,
    process_method VARCHAR(100) NULL,
    roast_profile VARCHAR(20) NULL,
    cupping_score DECIMAL(4,2) NULL,
    flavor_notes JSONB NOT NULL DEFAULT '[]',
    unit_size VARCHAR(50) NOT NULL,
    case_size VARCHAR(50) NULL,
    shelf_life VARCHAR(50) NULL,
    CONSTRAINT fk_ingredient_specs_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT chk_ingredient_specs_roast CHECK (roast_profile IS NULL OR roast_profile IN ('Light', 'Medium', 'Medium-Dark', 'Dark')),
    CONSTRAINT chk_ingredient_specs_cupping CHECK (cupping_score IS NULL OR (cupping_score >= 0 AND cupping_score <= 100))
);

-- Product Media (1:N Secondary Gallery Images)
CREATE TABLE product_media (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    media_url VARCHAR(500) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 1,
    alt_text VARCHAR(255) NULL,
    CONSTRAINT fk_product_media_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT chk_product_media_sort CHECK (sort_order >= 1)
);

-- ============================================================================
-- 4. IDENTITY & USER ACCOUNTS (Zero Address Columns)
-- ============================================================================

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NULL,
    avatar VARCHAR(500) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'guest',
    shop_name VARCHAR(150) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('owner', 'barista', 'guest', 'admin'))
);

-- ============================================================================
-- 5. ORDERS & FULFILLMENT (Transactional & Immutable History)
-- ============================================================================

CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    order_code VARCHAR(30) NOT NULL,
    user_id VARCHAR(50) NULL,
    total_amount BIGINT NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending_verification',
    order_status VARCHAR(30) NOT NULL DEFAULT 'received',
    shipping_recipient_name VARCHAR(150) NOT NULL,
    shipping_phone VARCHAR(30) NOT NULL,
    shipping_email VARCHAR(255) NULL,
    shipping_address_line VARCHAR(255) NOT NULL,
    shipping_province VARCHAR(100) NOT NULL,
    shipping_district VARCHAR(100) NULL,
    shipping_note TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_orders_order_code UNIQUE (order_code),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_orders_total CHECK (total_amount >= 0),
    CONSTRAINT chk_orders_payment_method CHECK (payment_method IN ('cod', 'vietqr')),
    CONSTRAINT chk_orders_payment_status CHECK (payment_status IN ('pending_verification', 'confirmed', 'rejected')),
    CONSTRAINT chk_orders_order_status CHECK (order_status IN ('received', 'processing', 'dispatched', 'completed', 'cancelled'))
);

CREATE TABLE order_items (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NULL,
    snapshotted_title VARCHAR(255) NOT NULL,
    snapshotted_sku VARCHAR(50) NULL,
    snapshotted_unit_price BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    snapshotted_specs VARCHAR(255) NULL,
    line_total BIGINT NOT NULL,
    
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) 
        REFERENCES orders(id) ON DELETE CASCADE,
    -- DBA FIX: Nullable product reference; preserves historical invoice if product is purged
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE SET NULL,
    CONSTRAINT chk_order_items_unit_price CHECK (snapshotted_unit_price >= 0),
    CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_items_line_total CHECK (line_total = snapshotted_unit_price * quantity)
);

-- ============================================================================
-- 6. EDITORIAL CONTENT (Aura Journal)
-- ============================================================================

CREATE TABLE news_articles (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    published_at VARCHAR(50) NOT NULL,
    cover_image_url VARCHAR(500) NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT false,
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(150) NOT NULL,
    author_avatar_url VARCHAR(500) NULL,
    tags JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    CONSTRAINT chk_news_category CHECK (category IN ('new-products', 'market-trends', 'barista-tech'))
);

CREATE UNIQUE INDEX uq_news_active_slug ON news_articles(slug) WHERE deleted_at IS NULL;

-- Vertical Partition: Cold rich text body
CREATE TABLE news_article_content (
    article_id VARCHAR(50) PRIMARY KEY,
    lead_paragraph TEXT NOT NULL,
    structured_sections JSONB NOT NULL,
    CONSTRAINT fk_news_content_article FOREIGN KEY (article_id) 
        REFERENCES news_articles(id) ON DELETE CASCADE
);

-- ============================================================================
-- 7. CONSULTATION & LEADS (Atelier Inquiries)
-- ============================================================================

CREATE TABLE contact_inquiries (
    id VARCHAR(50) PRIMARY KEY,
    inquiry_type VARCHAR(30) NOT NULL DEFAULT 'consultation',
    sender_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(150) NULL,
    budget_range VARCHAR(100) NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_contact_type CHECK (inquiry_type IN ('general', 'consultation', 'quote')),
    CONSTRAINT chk_contact_status CHECK (status IN ('new', 'contacted', 'converted', 'archived'))
);

-- ============================================================================
-- 8. PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX idx_products_domain_cat_stock ON products(domain, category_id, is_in_stock, deleted_at);
CREATE INDEX idx_products_brand_domain ON products(brand_id, domain, deleted_at);
CREATE INDEX idx_products_price_sort ON products(domain, price, deleted_at);
CREATE INDEX idx_equipment_specs_groups_voltage ON equipment_specifications(groups_count, voltage);
CREATE INDEX idx_ingredient_specs_roast_cupping ON ingredient_specifications(roast_profile, cupping_score DESC);
CREATE INDEX idx_product_media_product_sort ON product_media(product_id, sort_order);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_verification_queue ON orders(payment_status, order_status, created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_news_category_published ON news_articles(category, published_at DESC, deleted_at);
```
