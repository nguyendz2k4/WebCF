# CODEX INDEPENDENT DATABASE / BACKEND REVIEW

Review date: 2026-09-05. Scope: the current working tree, including uncommitted database documents. No application code, previous architecture documents, migrations, or database state were changed.

**FINAL STATUS: NOT READY FOR SCHEMA DESIGN.** Useful conceptual choices exist, but the claimed implementation is absent, important source assertions are false, and the proposed physical design leaves purchase identity, historical integrity, and query semantics unresolved.

## Evidence standard and scope

- **FACT** — directly supported by inspected application source or the literal proposed DDL. A fact about proposed DDL does not imply a deployed database.
- **INFERENCE** — plausible interpretation of source, not an established requirement or observed production behavior.
- **RECOMMENDATION** — an architecture or implementation choice, requiring an explicit design record rather than being presented as source truth.
- **BUSINESS DECISION** — product, operational, or retention policy that code cannot settle.

Severity describes the consequence of relying on a claim when building the backend: CRITICAL for fundamental readiness/trust failures; HIGH for integrity failures or material behavior loss; MEDIUM for unsupported constraints, maintainability, or performance reasoning; LOW for limited documentary errors. Correct decisions receive a severity for the risk they address, not an allegation of an existing database defect.

Paths below are relative to `FE/`; `path:line–line` identifies exact inspected source ranges. The requested `/docs/database/` lives under `FE/docs/database/` in this repository. Reviewed documents: `PHASE_0_CODEBASE_AUDIT.md`, the modified `PHASE_1_DOMAIN_MODEL.md`, `PHASE_1_FINAL_REVIEW.md`, and all eight subsequent documents: `DATABASE_SCHEMA.md`, `DATABASE_REVIEW.md`, `FINAL_SCHEMA.md`, `FINAL_ERD.md`, `INDEX_STRATEGY.md`, `QUERY_VALIDATION.md`, `VERTICAL_PARTITIONING.md`, and `IMPLEMENTATION_REPORT.md`.

Inspected source includes types, fixtures, AppContext, checkout/auth/cart, all purchase-producing homepage components, catalog filters/search/cards/detail, news listing/detail, contact submission, and thank-you handling. File inventory and source-wide searches found no application database adapter, SQL migration, API route directory, or database verification script. `BE/` contains only `.gitkeep`. Negative findings are bounded to this checkout; they say nothing about another branch or external deployment.

Verification consisted of source inspection, fixture counts, and checking database semantics against official PostgreSQL 15 and SQLite documentation. No PostgreSQL execution, EXPLAIN, load test, build, or migration was performed. `psql` was not available on PATH. An attempted fixture transpilation could not resolve the local TypeScript package; counts were instead checked directly against fixture declarations. No database test success is claimed.

## Findings and classification

### 01. Claimed implementation and validation do not exist in this checkout

**Previous claim:** `IMPLEMENTATION_REPORT.md:5–21,90–116,120–163` says fully implemented/integrated/validated, lists `src/lib/db/`, four API routes, `data/webcf.db`, `scripts/verify-db.ts`, and successful database tests/builds.

**Exact source evidence:** `src/app/products/[slug]/page.tsx:8,29,83–103` imports and searches `PRODUCTS_DATA`; `src/app/news/[slug]/page.tsx:6,16–23,45–52` does the same with `NEWS_ARTICLES`. `CheckoutModal.tsx:166–183` completes via `setTimeout(...,800)` and clears the cart. `ContactForm.tsx:115–121` explicitly simulates submission. The named implementation files are absent from the file inventory. `package.json:5–9` has only dev/build/start scripts.

**Classification / verdict:** **FACT:** current implementation remains a frontend prototype with browser persistence. **REJECTED as FACT:** the report's integration and test assertions. Phase 0's frontend-only baseline (`:14–18`) is substantially correct. This does not prove the report was never true elsewhere.

**Severity:** CRITICAL.

**Recommended correction — RECOMMENDATION:** mark implementation/test claims unverified or superseded for this revision; establish the actual commit and executable artifacts before claiming completion. Treat SQL examples as proposals, not execution proofs. Do not use generated build artifacts as evidence of missing source functionality.

### 02. User versus order shipping address ownership

**Previous claim:** Phase 1 previously assigned a profile address to User; `PHASE_1_FINAL_REVIEW.md:31–85` rejects that and requires order snapshots. It also quotes an `Order` interface and says addresses must be reentered every purchase.

**Exact source evidence:** `src/types/index.ts:1–9` has no address. `CheckoutModal.tsx:99–105,114–122` stores address/province/district in component state and prefills only recipient/phone from User. `src/types/order.ts:15–30` defines `AuraOrderReceiptState`, with `customerName`, `address`, `province`, and `totalAmount`; it is not the quoted `Order` interface. Checkout does not reset address fields on reopening.

**Classification / verdict:** **FACT:** no persisted profile address or saved-address feature is implemented. **RECOMMENDATION:** snapshot fulfillment data on an order and defer an address book. **INFERENCE, overstated:** one address must be typed anew every purchase; state may survive modal reopening. **BUSINESS DECISION:** whether saved addresses or multiple destinations are needed later.

**Severity:** HIGH for historical address ownership; LOW for the inaccurate interface quotation.

**Recommended correction — RECOMMENDATION:** keep order-owned shipping snapshots in the proposed design; correct the quote and distinguish intended persistence from current form state. Future saved addresses can coexist with order snapshots. Decide when corrections to an order address stop being allowed; “immutable from creation” is not proven by UI.

### 03. Availability: one existing flag, but no purchase enforcement

**Previous claim:** `PHASE_1_FINAL_REVIEW.md:115–141` and `PHASE_1_DOMAIN_MODEL.md:273–282` say `inStock` exclusively enables/disables cart actions. They reject a second availability enum and recommend `DEFAULT true`.

**Exact source evidence:** `src/types/product.ts:32–35` has `priceType`, `inStock`, and optional `leadTime`. `src/components/shared/ProductSchema.tsx:38–40` uses `inStock` for SEO. A source-wide `inStock` search finds only its type, fixtures, and that SEO consumer. `EquipmentCard.tsx:23–52`, `IngredientCard.tsx:23–52`, `ProductDetailClientActions.tsx:16–39,68–84`, and `CatalogSearchBar.tsx:80–91` add/buy without checking stock; `AppContext.tsx:156–166,199–232` does not validate availability either.

**Classification / verdict:** **FACT:** there is one modeled boolean availability signal and advisory lead-time text, with no inventory quantities or reservation implementation. **REJECTED as FACT:** existing checkout gating. **RECOMMENDATION:** retain one authoritative availability representation for current scope and avoid an independently editable duplicate enum. **BUSINESS DECISION:** whether the flag means physically stocked, available to order, or something else; preorder/reservation behavior.

**Severity:** HIGH.

**Recommended correction — RECOMMENDATION:** document the missing enforcement; plan server-side validation of purchase eligibility. Require explicit stock input rather than silently treating omitted stock as available. Do not derive stock from free text, and do not claim a boolean provides inventory concurrency control. A future authoritative state enum with a derived boolean would not inherently be invalid.

### 04. Fixture claims and unsupported mandatory subtype attributes

**Previous claim:** `PHASE_1_FINAL_REVIEW.md:117–120,181` says 33 products, 32 available, and calls the custom-order Slayer “Steam EP.” `PHASE_1_DOMAIN_MODEL.md:498` cites Giesen as a contact-price item; `:565–566` calls mechanical and terroir attributes required.

**Exact source evidence:** `src/data/products.ts:10–970` declares 32 products: 16 equipment, 16 ingredients, 31 with `inStock:true`, and 23 distinct brands. Slayer's ID is `prod_eq_slayer_espresso_single_group` (`:146`); Giesen is `priceType:'from'` (`:332–346`). Fixture price types are fixed/from, with no contact instance. `src/types/product.ts:44–53,61–72` explicitly makes most mechanics and terroir optional; warranty and ingredient unit size are required.

**Classification / verdict:** **FACT:** the counts and optionality above. **REJECTED as FACT:** contact-price fixture example and universally required agronomic/mechanical attributes. **BUSINESS DECISION:** contact-price behavior remains relevant because the type permits it (`:32`).

**Severity:** MEDIUM for constraints inferred from these claims; LOW for names/counts.

**Recommended correction — RECOMMENDATION:** correct fixture evidence, preserve optional nonapplicable attributes, and distinguish type-supported cases from populated fixtures. Thirteen category enum members do not prove thirteen active navigation entries: `catalogUtils.ts:12–21` omits ingredient `other`.

### 05. Product/Category parity: valid final FK, invalid earlier CHECK

**Previous claim:** `PHASE_1_FINAL_REVIEW.md:265` offers `CHECK (domain = (SELECT domain FROM categories WHERE id = category_id))`. `FINAL_SCHEMA.md:29–30,77–79` instead uses a composite unique key and FK.

**Exact source evidence:** `src/types/product.ts:1–20,40–42,58–60,75` separates category sets through a discriminated union. `catalogUtils.ts:44–48` filters domain and category independently. The final DDL requires both referencing columns NOT NULL (`FINAL_SCHEMA.md:56–57`).

**Classification / verdict:** **FACT:** domain/category consistency is represented in TypeScript; TypeScript does not validate external database writes. **RECOMMENDATION, valid:** the final composite FK when both domain columns are retained. **REJECTED technical recommendation:** a subquery in a PostgreSQL CHECK. PostgreSQL CHECK is not a cross-table integrity mechanism. [PostgreSQL constraints](https://www.postgresql.org/docs/15/ddl-constraints.html).

**Severity:** HIGH.

**Recommended correction — RECOMMENDATION:** explicitly supersede the illegal CHECK in the design record and retain the legal composite FK proposal. Inferring domain through Category alone is another architecture choice, not a required redesign. Do not silently treat the obsolete alternative as still approved.

### 06. Brand is not evidence of supplier/vendor requirements

**Previous claim:** `PHASE_1_FINAL_REVIEW.md:191–201` mandates a Brand lookup with logo, origin, featured flag and excludes procurement tables.

**Exact source evidence:** `src/types/product.ts:28` has only `brand:string`; `EditorialFilterRail.tsx:38–39` derives distinct brands from products; `CatalogSearchBar.tsx:71–74` searches brand; `ProductSchema.tsx:29–31` emits brand attribution. No supplier workflow appears in application source.

**Classification / verdict:** **FACT:** catalog attribution/filtering exists; procurement does not. **RECOMMENDATION:** a normalized Brand lookup is reasonable, as is deferring supplier entities. **BUSINESS DECISION:** procurement scope, brand metadata management, and uniqueness/case normalization. Logo/origin/featured fields are not proven necessary by a brand string.

**Severity:** MEDIUM.

**Recommended correction — RECOMMENDATION:** retain the catalog boundary; mark extra Brand metadata as optional proposed scope. Do not interpret a brand as necessarily the manufacturer (`FINAL_ERD.md:17` uses “manufactures/brands”). No vendor or purchasing tables are justified solely by this evidence.

### 07. Subtype tables are a choice, and the DDL does not enforce exclusive completeness

**Previous claim:** `PHASE_1_DOMAIN_MODEL.md:167–212` recommends class-table inheritance and claims type safety/no wasted NULLs. `FINAL_ERD.md:18–19` represents both subtype relations as mandatory one-to-one.

**Exact source evidence:** `src/types/product.ts:40–75` requires exactly one appropriate subtype at the TypeScript level. `FINAL_SCHEMA.md:90–125` gives each extension a PK/FK only on product ID. Nothing checks the parent's domain or requires an extension. A valid parent can therefore have neither child, both children, or the wrong child. Category parity does not prevent this.

**Classification / verdict:** **FACT:** the DDL's enforcement gap. **RECOMMENDATION:** subtype tables remain a defensible organization choice. **REJECTED as FACT:** they are required/optimal or already enforce the union.

**Severity:** HIGH.

**Recommended correction — RECOMMENDATION:** specify subtype membership and creation/update atomicity before implementation. If retaining these tables, define how parent-domain matching and exactly-one completeness will be enforced (domain-aware relationships plus a transaction/constraint-trigger strategy as appropriate). A shared PK alone means at most one row per child table. Label ERD relations 0..1 with an explicit exclusive/completeness invariant; do not add category-specific tables without a demonstrated need.

### 08. Cart persistence and authenticated versus guest checkout

**Previous claim:** `PHASE_1_DOMAIN_MODEL.md:62–63` calls Cart transient and defers DB carts. `DATABASE_SCHEMA.md:200` makes order user nullable “for guest purchases.” Phase 0 describes the guest role as unregistered (`:421`).

**Exact source evidence:** `AppContext.tsx:82–118` persists cart/User in localStorage, using one origin-wide cart key; `:150–152` logout does not clear it. `:199–205,223–228` blocks checkout without a User; `CheckoutModal.tsx:146` also refuses rendering without User. `src/types/index.ts:7` permits a logged-in User whose role is guest. Login manufactures a User locally (`AppContext.tsx:135–145`).

**Classification / verdict:** **FACT:** browser-persistent cart, simulated identity, authenticated-in-UI checkout gate; no anonymous checkout path. **RECOMMENDATION:** defer database carts absent cross-device requirements. **BUSINESS DECISION:** true guest checkout and account deletion/link retention. A nullable historical FK can support account deletion without authorizing guest creation.

**Severity:** HIGH for silent checkout-policy changes; MEDIUM for cart terminology.

**Recommended correction — RECOMMENDATION:** describe Cart as client-persistent but nonauthoritative staging. Specify checkout authorization separately from FK nullability. Decide cart sharing/merge behavior if identities change; no cart table is automatically required. Never treat localStorage identity as server authentication.

### 09. Polymorphic purchase IDs remain unresolved

**Previous claim:** `PHASE_1_DOMAIN_MODEL.md:227–231` requires canonical products, packages as products/bundles, and ProjectBuilder as RFQ. `IMPLEMENTATION_REPORT.md:15,27` claims all corrections implemented. `FINAL_SCHEMA.md:193–205` offers only a nullable product FK.

**Exact source evidence:** `EquipmentConfigurator.tsx:10,25,40,69–90` emits `eq-tier-*`; `BeansSelection.tsx:11–73,85–94` emits independent bean IDs; `SolutionsSection.tsx:10–46,63–71` emits package IDs including a monthly rental; `ProjectBuilder.tsx:104–113` emits `project_${selectedModelId}` and an estimate. Catalog fixture IDs instead start `prod_eq_`/`prod_ing_` (`src/data/products.ts:10,503`). AppContext merges items by ID alone (`:159–165`).

**Classification / verdict:** **FACT:** multiple purchase identity spaces. **RECOMMENDATION:** canonical mapping for discrete products and an explicit quote/configuration contract. **BUSINESS DECISION:** whether packages are fixed goods, bundles, rental agreements, or quote requests; whether builder leads replace checkout. The final two-domain catalog does not define these mappings.

**Severity:** HIGH.

**Recommended correction — RECOMMENDATION:** produce a purchase-source mapping covering all four homepage producers before physical schema approval. A NULL product ID must not be an undocumented escape hatch for unknown products; a non-NULL unknown ID must fail its FK. Do not invent SKUs, a package domain, subscription tables, or RFQ behavior silently. If builder leads are selected, define where configuration fields are retained; final contact DDL has no such contract.

### 10. OrderItem snapshots are justified, but not implemented or automatically immutable

**Previous claim:** `PHASE_1_DOMAIN_MODEL.md:251–258,478–489` and `IMPLEMENTATION_REPORT.md:38,42` promise immutable financial/title/spec snapshots and preserved history. `DATABASE_REVIEW.md:65–75` describes a hypothetical product cascade as an original defect and claims complete tax history preservation.

**Exact source evidence:** `src/types/index.ts:11–21` defines client CartItem copies; `EquipmentCard.tsx:26–35` copies price/title/specs, whereas `ProductDetailClientActions.tsx:17–25` omits specs. Checkout merely sums these values (`:148–155`) and simulates submission (`:166–183`). There is no persisted OrderItem type or write path. Final DDL snapshots values and uses product `ON DELETE SET NULL`, but order `ON DELETE CASCADE` remains (`:201–205`), and ordinary UPDATE/DELETE is not prevented. The earlier `DATABASE_SCHEMA.md:227` already proposes product SET NULL; the alleged cascade was conditional, not established.

**Classification / verdict:** **INFERENCE:** durable orders need purchase-time commercial history. **RECOMMENDATION, sound:** snapshots and independent historical reads. **FACT:** final DDL does not enforce immutability, and product SET NULL preserves existing lines on product deletion. **REJECTED as FACT:** existing snapshot implementation or complete tax/audit coverage.

**Severity:** HIGH.

**Recommended correction — RECOMMENDATION:** define server-owned snapshot construction, lock/freeze point, permissions and controlled correction policy. Preserve lines when the catalog changes; explicitly resolve hard-delete permission and order cascades. Do not mistake a FK or soft-delete field for a historical audit mechanism. Tax breakdown, adjustments, units and rental terms require an agreed receipt contract, not a claim that title/price/specs preserve everything.

### 11. Order totals and transactional authority

**Previous claim:** `PHASE_1_FINAL_REVIEW.md:290–295` quotes a nonexistent `total` field and says totals must never be recomputed from child rows. `QUERY_VALIDATION.md:229–258` labels hardcoded header/item INSERTs authoritative and atomic.

**Exact source evidence:** `src/types/order.ts:22` says `totalAmount`; `CheckoutModal.tsx:148–151` derives a client sum. `FINAL_SCHEMA.md:184,206–208` checks header nonnegativity and each line's arithmetic but not header-to-lines agreement, required nonempty orders, or immutable inputs. A header total of 1 and a line total of 245000000 satisfy those arithmetic constraints independently.

**Classification / verdict:** **RECOMMENDATION:** persist the agreed order total and exact line amounts. **REJECTED overstatement:** recalculating from immutable historical lines for reconciliation is inherently wrong. Repricing from today's catalog is the actual hazard. **FACT:** transaction atomicity alone does not authenticate inputs or enforce totals. **BUSINESS DECISION:** tax, shipping, discount, rounding, cancellation and adjustment policy.

**Severity:** HIGH.

**Recommended correction — RECOMMENDATION:** define an explicit total equation using historical amounts, validate it in the authoritative transaction, and define failure/rollback behavior. Server-side pricing and eligibility must replace trust in browser prices. Do not propose a cross-row aggregate CHECK for the total. Preserve current manual-pending semantics until a payment workflow is agreed.

### 12. Order codes, public lookup and payment references

**Previous claim:** unique order code and deterministic transfer reference are sufficient; `QUERY_VALIDATION.md:262–282` presents code-only lookup of shipping details as an existing thank-you query.

**Exact source evidence:** `CheckoutModal.tsx:120` generates six random digits prefixed AURA, with 900000 possible codes; `:157` prepends AURA again and appends phone's final characters or a placeholder. `ThankYouClientView.tsx:9–15` reads a query parameter without a database lookup. `FINAL_SCHEMA.md:165,181` correctly requires unique non-NULL order code. Proposed lookup returns recipient, phone and address by code alone (`QUERY_VALIDATION.md:273–280`).

**Classification / verdict:** **FACT:** client code is not globally unique and is not an authorization credential. **RECOMMENDATION, valid:** DB uniqueness. **REJECTED as FACT:** implemented authoritative lookup/reconciliation. **BUSINESS DECISION:** public reference format and permitted guest receipt access.

**Severity:** HIGH.

**Recommended correction — RECOMMENDATION:** allocate codes on the server with collision handling; specify idempotent submission independently of code uniqueness. Require authenticated ownership or an appropriately protected receipt token before returning personal data. Fix/document prefix and phone normalization; preserve the issued reference or its immutable inputs/template if needed. No new payment ledger is mandated merely by reference formatting.

### 13. News authors and tags: reasonable embedding, unsupported absolutes

**Previous claim:** `PHASE_1_FINAL_REVIEW.md:229–250` says authors cannot be users because of the role union, normalized tags require joins on every read, and embedded columns/JSON are mandatory.

**Exact source evidence:** `src/types/news.ts:13–17,32` has inline author values and tag strings, no author ID. `src/app/news/[slug]/page.tsx:34,80–120,204–212` uses metadata/byline/tags; `NewsClientView.tsx:11–17` filters by category. There are no author management, author archive, or tag archive routes.

**Classification / verdict:** **FACT:** bylines/tags are embedded source data with no account association. **RECOMMENDATION:** inline author fields and tag array/JSON are appropriate for current consumers. **REJECTED:** a role union makes an author-account relationship technically impossible, or normalization inherently demands a join in every listing. **BUSINESS DECISION:** reusable author identities, editorial ownership, tag administration.

**Severity:** MEDIUM.

**Recommended correction — RECOMMENDATION:** retain simple embedding as a documented scope choice. Avoid adding author/tag tables absent requirements, but remove the claim that alternatives are invalid. JSONB validates JSON syntax, not the required array-of-strings shape (`FINAL_SCHEMA.md:227`); define shape validation for tags and structured content.

### 14. Read time and category labels are currently stored fixture values

**Previous claim:** `PHASE_1_FINAL_REVIEW.md:267–285` mandates derived labels/read time; `IMPLEMENTATION_REPORT.md:36–37` says runtime derivation was implemented.

**Exact source evidence:** `src/types/news.ts:8–11` requires both fields; `src/data/news.ts:9–12,57–60,105–108` assigns localized literals. `NewsCard.tsx:35,47–52` and news detail `:90,113–120` render them directly. No read-time calculator exists in these consumers. `PHASE_1_DOMAIN_MODEL.md:392,407` still includes read_time, while `:436` says no column.

**Classification / verdict:** **FACT:** hardcoded labels/read times. **RECOMMENDATION:** use a canonical news-category mapping and avoid redundant per-article labels. **RECOMMENDATION / BUSINESS DECISION:** calculated versus editorially supplied reading duration; 200 words/minute is an assumption, not a source rule.

**Severity:** MEDIUM.

**Recommended correction — RECOMMENDATION:** specify the DTO adaptation that preserves card/detail fields if omitted from storage. Runtime calculation from the full body conflicts with the claimed body-free news listing; consider a calculated numeric duration updated when content changes if that policy is selected. Do not ban useful derived persistence universally. News categories and product categories are distinct vocabularies; do not map news labels through the product-only Category table. Excluding UI sentinel `all` from persisted news categories is sound.

### 15. Publication dates cannot support chronological sorting as localized text

**Previous claim:** `FINAL_SCHEMA.md:221,277` stores/indexes `published_at VARCHAR(50)`; `QUERY_VALIDATION.md:193–203` orders it descending as a date.

**Exact source evidence:** `src/data/news.ts:11,59,107,154,191,228` contains strings such as `28 Tháng 8, 2026` and `08 Tháng 8, 2026`. `NewsClientView.tsx:11–17` preserves fixture order instead of sorting dates.

**Classification / verdict:** **FACT:** source values are display strings, not temporal values. **REJECTED technical recommendation:** using arbitrary localized strings as chronological sort keys. The same-month fixtures conceal failures across months/years and unpadded days.

**Severity:** HIGH.

**Recommended correction — RECOMMENDATION:** select DATE for a publication day or TIMESTAMPTZ for a publication instant, then format at the boundary. Decide timezone/scheduling requirements and fixture parsing explicitly. This is a correction proposal, not an implemented column change.

### 16. Soft deletion, slug reuse and retention are policy choices

**Previous claim:** `PHASE_1_DOMAIN_MODEL.md:351–365` mandates soft deletion and forbids product deletion after purchase; `DATABASE_REVIEW.md:49–61` calls globally unique slugs a HIGH defect and requires active-only uniqueness. `IMPLEMENTATION_REPORT.md:43` says all five entity types have timestamp soft deletion.

**Exact source evidence:** no source delete/archive workflow exists. `FINAL_SCHEMA.md:18–45` gives Category an `is_active` flag and Brand neither active nor deleted flag; only products/users/news have `deleted_at`. Product SET NULL permits physical deletion despite Phase 1's prohibition. Queries join Category without checking `is_active`. Product/news routes return not-found for absent slugs; no archival redirects are implemented.

**Classification / verdict:** **RECOMMENDATION:** controlled archival may be useful. **BUSINESS DECISION:** retention, hard deletion, URL reuse, and redirect behavior. **REJECTED:** a global unique slug is inherently defective. Active-only uniqueness is legal PostgreSQL but allows an old link to resolve to a different item and can block restoration when a replacement owns the slug.

**Severity:** HIGH for inconsistent lifecycle/history behavior; MEDIUM for unsupported slug policy.

**Recommended correction — RECOMMENDATION:** reconcile archive/hard-delete rules and unique-slug policy explicitly. Do not apply soft deletion mechanically to every table. Keeping a deleted timestamp does not itself retain audit changes or protect privacy. The legal retention assertion in Phase 1 is not established by code and requires separate jurisdiction-specific review; this report does not endorse it as law.

### 17. NULL, NOT NULL and defaults require field semantics

**Previous claim:** Phase 1 inheritance analysis (`:177,193`) and `VERTICAL_PARTITIONING.md:17,70` treat NULL sparsity as waste. Final DDL makes SKU mandatory, defaults stock true and price type fixed, and defaults JSON collections empty.

**Exact source evidence:** `src/types/product.ts:25,35,44–53,61–72` makes SKU, lead time, many technical fields and flavor notes optional. `src/types/index.ts:5–8` makes phone/avatar/shop optional. `CheckoutModal.tsx:168` checks nonblank recipient/phone/address; district/note are optional form state. `AppContext.tsx:138–143` fills missing profile values with demo name/email/phone/shop strings. Final DDL requires SKU (`:54`) despite optional source type.

**Classification / verdict:** **FACT:** absence has real meaning in current types. **RECOMMENDATION:** preserve NULL for unknown/nonapplicable optional attributes. **BUSINESS DECISION:** required SKU at publish time, mandatory brand, and complete-draft versus published-product requirements. **REJECTED:** absence alone justifies table splitting or fake defaults.

**Severity:** HIGH for default availability and fake commercial identity; MEDIUM otherwise.

**Recommended correction — RECOMMENDATION:** require explicit stock and price semantics when creating a sellable item; do not use zero as an unknown/contact price. Preserve optional district, note, SKU snapshot, phone, avatar, terroir and specs unless a new requirement is recorded. Empty arrays are valid only when “known to have none” is intended; unknown flavor notes need not become known-empty. Do not migrate demo fallback contacts, `groups || 1`, placeholder phone suffixes, or UI province defaults into authoritative facts. NOT NULL alone accepts empty/whitespace strings; specify nonblank checks for mandatory text. PostgreSQL nullable CHECKs can pass UNKNOWN, so use NOT NULL only where absence itself is prohibited. [PostgreSQL constraints](https://www.postgresql.org/docs/15/ddl-constraints.html).

Defaults such as created_at=CURRENT_TIMESTAMP, a real initial workflow state, and featured=false can be reasonable **RECOMMENDATIONS**. updated_at's insertion default does not maintain it on UPDATE; define an application or trigger owner. JSONB NOT NULL also permits JSON literal null unless shape validation rejects it.

### 18. Money precision and numeric bounds

**Previous claim:** Phase 1 final review (`:295`) proposes INTEGER order total; final DDL (`:60,167,196,199`) uses BIGINT. `DATABASE_REVIEW.md:81–91` suggests storing line total avoids arithmetic rounding/overflow. Cupping score is `DECIMAL(4,2)` with a maximum check of 100 (`FINAL_SCHEMA.md:117,125`).

**Exact source evidence:** product `price:number` (`src/types/product.ts:30`) and VND formatting (`CheckoutModal.tsx:152–155`) support an integer-VND interpretation; cart quantities have no meaningful upper business bound in `AppContext.tsx:184–190`. Giesen price is a large equipment amount (`src/data/products.ts:340–342`).

**Classification / verdict:** **INFERENCE:** whole-VND, single-currency operation. **RECOMMENDATION, sound conditional choice:** BIGINT for whole-VND amounts, or an agreed exact NUMERIC representation. **FACT:** INTEGER only reaches 2147483647; BIGINT multiplication can still overflow; NUMERIC(4,2) cannot represent 100.00. Storing line total does not eliminate overflow in its CHECK. [PostgreSQL numeric types](https://www.postgresql.org/docs/15/datatype-numeric.html).

**Severity:** HIGH for money boundaries; MEDIUM for the cupping endpoint mismatch.

**Recommended correction — RECOMMENDATION:** retain exact amounts with agreed currency, units, rounding and bounds; avoid floating money types and formatted strings. Define JSON/API handling for BIGINT beyond JavaScript safe integers. Keep positive integer quantity/nonnegative priced amounts where applicable. Resolve contact/from pricing separately. If 100.00 is valid, use sufficient cupping precision; otherwise correct the advertised range. The current 1–4 group limit is a recommendation, not a limit established by `groups?:number`.

### 19. PostgreSQL and SQLite are not interchangeable validation targets

**Previous claim:** `DATABASE_SCHEMA.md:20–29` claims identical constraints/indexes/transaction semantics, and `FINAL_SCHEMA.md:6` claims 100% SQLite 3.35+ compatibility.

**Exact evidence:** final DDL uses `SERIAL`, TIMESTAMPTZ, JSONB and DECIMAL. Query examples use ILIKE and PostgreSQL JSON aggregation (`QUERY_VALIDATION.md:63–65,320–325`). There is no dialect adapter or dual-engine test source in this checkout.

**Classification / verdict:** **RECOMMENDATION:** PostgreSQL selection is an architecture choice, not implied by Next.js or an installed SDK. **REJECTED technical claim:** equivalent behavior under SQLite. SQLite accepting type names does not provide PostgreSQL type enforcement, SERIAL generation, timezone behavior, decimal precision or PostgreSQL JSON/query syntax. SQLite needs explicit foreign-key enablement. [SQLite quirks](https://www.sqlite.org/quirks.html).

**Severity:** HIGH.

**Recommended correction — RECOMMENDATION:** record the selected production engine and use its actual semantics as the validation target. If SQLite remains required, specify and test a separate compatibility layer; do not treat SQLite tests as PostgreSQL certification. The final PostgreSQL CREATE TABLE syntax appears conventional on inspection, including nullable SET NULL FKs and partial indexes; this is not a claim of an executed DDL pass.

### 20. Vertical partitioning claims are not measured and misclassify listing fields

**Previous claim:** `VERTICAL_PARTITIONING.md:13–18,45–77,97–112,139–150` claims measured 85/12/8/90 percent access rates, ~220-byte product rows, hundreds of those rows per 8KB page, 99% cache hits and zero join latency. Phase 0 (`:531–536`) says specs/terroir are only loaded for details/drawers.

**Exact source evidence:** `EquipmentCard.tsx:55–60,231–233` reads groups, boiler capacity, power, voltage and daily capacity; `IngredientCard.tsx:57–60,130–147,213–215,253–271` reads terroir, flavor notes and packaging. `catalogUtils.ts:59–74,95–143,161–171` reads specs during search/filter/sort. `CatalogClientView.tsx:6,232–244` operates on complete static products. No production telemetry or database size measurements exist in the reviewed artifacts.

**Classification / verdict:** **FACT:** many supposedly cold fields are catalog dependencies. **RECOMMENDATION:** subtype/content/media separation may be chosen for ownership or measured performance. **REJECTED as FACT:** access percentages, guaranteed cache/latency benefits, and NULL pollution claims. Even ignoring overhead, 8192/220 is about 37, not hundreds.

**Severity:** HIGH for incomplete listing queries; MEDIUM for performance claims.

**Recommended correction — RECOMMENDATION:** retain the proposed split only as an explicit choice pending corrected listing projections and evidence; do not redesign just to reduce column count. Compare projected queries with and without joins on representative data. PostgreSQL represents NULLs using a bitmap rather than allocating each missing value's full width, and TOAST can move/compress large values. Selecting summary columns can reduce network payload without a new table; heap costs still require measurement. [PostgreSQL page layout](https://www.postgresql.org/docs/15/storage-page-layout.html), [TOAST](https://www.postgresql.org/docs/15/storage-toast.html).

### 21. “Query validation” changes application semantics and invents consumers

**Previous claim:** `QUERY_VALIDATION.md` presents fourteen SQL execution proofs mapped to existing routes/components; Phase 0's equivalent SQL is treated as verified backend behavior.

**Exact source evidence and corrections:**

| Proposed claim | Actual source | Classification and verdict | Recommended correction |
|---|---|---|---|
| Query 1 default listing is newest first and needs only base fields (`:34–42`) | `catalogUtils.ts:173–178` prioritizes featured then retains source order; cards need subtype fields (finding 20) | **FACT:** mismatch; **RECOMMENDATION:** SQL draft, not an equivalent query | Preserve curated behavior or explicitly approve a new order; return card-required fields |
| Autocomplete uses SKU, LIMIT 8, global featured/name sort (`:47–68`); Phase 0 says LIMIT 6 (`:450`) | `CatalogSearchBar.tsx:66–78` searches name/brand/description and slices 3; `CatalogClientView.tsx:268` passes domain products | **FACT:** neither description matches current autocomplete | Preserve description, domain, limit and ordering; distinguish autocomplete from full catalog search |
| Equipment voltage equals 380V (`:99`) | `catalogUtils.ts:109–114` substring-matches, including 220V/380V | **FACT:** SQL would omit dual-voltage machines | Preserve the accepted-set semantics explicitly |
| Related products LIMIT 4 ordered featured/newest (`:181–185`) | product detail `:101–103` uses same category and first 3 | **FACT:** behavior changes | Preserve 3/source order or approve a replacement |
| News has category query parameter, date sort and LIMIT 9 (`:193–203`) | `NewsClientView.tsx:9–17` uses local category state, no date sort/limit | **FACT:** proposed future behavior | Mark as proposed; specify pagination and date ordering requirements |
| `/account/orders`, `/brand/[slug]`, reconciliation desk are existing index consumers | Route inventory has no account/brand/admin pages | **INFERENCE:** plausible future consumers | Do not justify mandatory indexes or features as observed workload |
| Thank-you and order creation have DB query guarantees | Finding 01 and 12 source shows simulated checkout and query-param display | **REJECTED as FACT** | Replace execution-proof labels with planned contracts |

**Severity:** HIGH.

**Recommended correction — RECOMMENDATION:** build a source-to-query matrix with inputs, predicates, projections, order, null handling, limits and deterministic tie-breakers. Missing-score sorting currently falls back to zero; PostgreSQL descending nullable columns need explicit semantics to avoid unintended NULL-first results. Distinct facets currently use domain-wide products (`EditorialFilterRail.tsx:38–39`), not necessarily the already-filtered result set. Define that behavior before optimizing it.

### 22. Index design contains unsupported guarantees and workload mismatches

**Previous claim:** `INDEX_STRATEGY.md:14–17,25–49,69–80,99–104,130–166` claims source-verified covering indexes, sub-millisecond/O(1) seeks and complete redundancy elimination. `QUERY_VALIDATION.md` asserts specific plans without EXPLAIN.

**Exact evidence / technical assessment:**

- **FACT:** `(domain,category_id,is_in_stock,deleted_at)` does not contain price/name/image fields or created_at. It cannot alone cover Query 1's projection or provide its requested created_at order. Source does not default-filter stock (`catalogUtils.ts:41–148`), despite `INDEX_STRATEGY.md:33` claiming that behavior.
- **FACT:** verification index `(payment_status,order_status,created_at)` has an unconstrained middle column for the shown query, which filters payment_method instead. It does not guarantee created_at ordering for that workload.
- **FACT:** `(roast_profile,cupping_score DESC)` does not inherently supply globally descending scores across multiple roast profiles or with no roast predicate. Likewise groups-first does not establish an efficient voltage-only path. Index utility depends on predicates and statistics. [PostgreSQL multicolumn indexes](https://www.postgresql.org/docs/15/indexes-multicolumn.html).
- **FACT:** category_id alone is not a leading prefix of the domain-first index. “Supersedes category index” is only conditionally true for domain-qualified queries; the proposed related-products query lacks domain. OrderItem product_id also has no child-side index in final DDL, relevant if product SET NULL deletes are permitted; that is a workload consideration, not an automatic requirement to index every FK.
- **FACT:** final UNIQUE(sku) and UNIQUE(order_code) already create indexes; separately applying `INDEX_STRATEGY.md:147,159` adds equivalent ones. Applying all index scripts also encounters duplicate names and duplicates active-slug indexes. Final DDL alone does not contain those extra SKU/code indexes. [PostgreSQL constraints](https://www.postgresql.org/docs/15/ddl-constraints.html).
- **FACT:** ordinary B-trees do not provide the promised general solution to leading-wildcard search across brand, product and nested fields. The example called full-text search is ILIKE substring matching. No search-specific index appears in final DDL. At 32 fixture products a sequential scan is not evidence of a performance defect.
- **FACT:** index-only scans require the referenced values in the index and visibility conditions; no cache-hit/latency guarantee follows from table width. [PostgreSQL index-only scans](https://www.postgresql.org/docs/15/indexes-index-only-scans.html).

**Classification / verdict:** **RECOMMENDATION:** proposed indexes are candidates; **REJECTED as FACT:** measured plans, O(1) B-tree behavior and universal coverage/redundancy claims.

**Severity:** MEDIUM, elevated to HIGH where these assertions conceal incomplete query behavior.

**Recommended correction — RECOMMENDATION:** consolidate one index inventory including constraint-created indexes. First correct SQL semantics, then assess representative PostgreSQL EXPLAIN (ANALYZE, BUFFERS) plans and write costs. Consider a queue-specific index, active-row partial indexes, or search support only after accepting those query requirements. Do not add indexes for every theoretical facet combination or promise the planner will use all candidate indexes together.

### 23. Contact inquiry schema drops an actual required input

**Previous claim:** final ContactInquiry (`FINAL_SCHEMA.md:249–261`) and implementation report (`:114`) fully support the actual consultation form; generic inquiry_type replaces meaningful service selection and message is NOT NULL.

**Exact source evidence:** `ContactForm.tsx:8–14,43–50,82–87` captures `serviceType` and validates it. `:115–121` only simulates persistence. `:60–87` validates name/phone/email/service, not message or budget. Final DDL has no service_type, permits NULL budget, and requires message without defining empty-value handling.

**Classification / verdict:** **FACT:** required service selection would be lost without a mapping; message is not mandatory in current validation. **RECOMMENDATION:** persist supported form fields with defined optional semantics. **BUSINESS DECISION:** generic/general/quote classification and status workflow are new scope.

**Severity:** HIGH for lost service intent; MEDIUM for message/nullability mismatch.

**Recommended correction — RECOMMENDATION:** preserve serviceType or record an explicit lossless mapping. Allow absent message if preserving current UX; do not fill meaningless text merely to satisfy NOT NULL. Do not infer budget validation from its default selection. Keep contact and any accepted ProjectBuilder configuration contract distinct enough to avoid dropping data.

### 24. Gallery contract and diagram cardinalities overclaim enforcement

**Previous claim:** `DATABASE_REVIEW.md:95–103` says CHECK(sort_order>=1) fixes gallery duplication/order ambiguity. `FINAL_ERD.md:18–24` depicts mandatory children/parents; ASCII diagrams in `DATABASE_SCHEMA.md:49–53` and implementation report attach media/order items to subtype boxes.

**Exact source evidence:** `src/types/product.ts:33` is an ordered images array; cards use images[0] (`EquipmentCard.tsx:32`). `FINAL_SCHEMA.md:129–137` permits duplicate sort positions and duplicate URLs, including the cover URL. Its PK/FKs only ensure child uniqueness by their actual keys and valid existing parents. An order can have zero items, news zero content rows, and a line/order may have NULL product/user references.

**Classification / verdict:** **RECOMMENDATION, reasonable:** authoritative cover plus secondary ordered gallery. **FACT:** sort_order>=1 neither ensures unique ordering nor zero duplication; ERD does not accurately describe enforced optionality.

**Severity:** MEDIUM.

**Recommended correction — RECOMMENDATION:** define tie handling or unique per-product positions if required and an explicit cover exclusion policy. Do not use a cross-table CHECK to enforce cover exclusion. Correct diagrams to point media and order items to products, show nullable parents, and distinguish intended minimum cardinalities from constraints actually supplied.

### 25. Identity, roles and payment verification are not implemented authorization

**Previous claim:** `PHASE_1_DOMAIN_MODEL.md:321` says roles control permissions; `DATABASE_REVIEW.md:107–113` fixes administration by adding admin to User.role. Phase 1 requires verification actor/time/notes (`:485–489`), while the implementation report says all corrections were implemented.

**Exact source evidence:** `src/types/index.ts:7` has customer persona roles; `AppContext.tsx:135–145,247` accepts a locally constructed User and treats existence as login. Final users DDL (`:144–156`) adds admin without an authentication mechanism; final orders (`:163–188`) lacks verified_by/verified_at/verification_notes. Order source (`src/types/order.ts:8–13`) has a combined verification/fulfillment status; final DDL splits it and adds states.

**Classification / verdict:** **FACT:** mock roles and no demonstrated server authorization/payment verification. **RECOMMENDATION:** authenticated staff authorization and an auditable verification action if that operational flow is selected. **BUSINESS DECISION:** account provider, privilege model, status transitions, verification metadata requirements. Adding an enum value does not implement access control.

**Severity:** HIGH.

**Recommended correction — RECOMMENDATION:** define identity linkage and server authorization separately from customer personas. Record the status mapping and required audit metadata, or explicitly defer it. Do not automatically add password/session/role tables merely because they are common; the selected identity mechanism determines storage. Preserve the distinction between submitted, paid, and fulfilled.

## VERIFIED DECISIONS

These are verified facts or defensible recommendations, not a claim of prior stakeholder approval:

- **FACT:** frontend-only source; static catalog/news; browser-persistent cart/User; simulated checkout/contact; UI login gate.
- **FACT:** no User shipping address; order-oriented receipt/form fields exist. **RECOMMENDATION:** keep order-owned fulfillment snapshots and defer saved addresses for current scope.
- **FACT:** two typed catalog domains and category subsets; one availability boolean plus advisory lead time. **RECOMMENDATION:** retain a single availability authority, with explicit semantics and server enforcement planned.
- **RECOMMENDATION:** final composite category/domain FK is legal and appropriate if both columns are stored.
- **RECOMMENDATION:** catalog-only Brand; embedded news bylines/tags; distinct canonical news labels; defer procurement and unrequested cart synchronization.
- **RECOMMENDATION:** durable historical order-line values, positive quantities, exact money and unique server-owned order codes. Product SET NULL is a valid preservation choice if hard deletion is allowed.
- **RECOMMENDATION:** optional/nonapplicable fields may remain NULL; derived display strings usually belong at the application boundary. These are field-specific choices, not universal bans on NULL or cached derivations.

## REJECTED DECISIONS

- **REJECTED as FACT:** fully implemented database, API integration, seed/test/build verification and executed query plans in this checkout.
- **REJECTED technical recommendation:** PostgreSQL cross-table/subquery CHECK; PostgreSQL/SQLite 100% compatibility; DECIMAL(4,2) admitting 100.00; localized dates as chronological keys.
- **REJECTED as FACT:** stock-gated purchasing, anonymous checkout, runtime read-time derivation, mandatory mechanics/terroir, and already-resolved polymorphic purchase identity.
- **REJECTED rationale:** NULL pollution or column count mandates splitting; fabricated traffic percentages, cache guarantees, zero join cost, universal index-only scans/O(1) B-tree seeks.
- **REJECTED unconditional choice:** true stock/default fixed pricing for omitted commercial intent, fake required values, mandatory slug reuse, and immutable-history claims based only on snapshots/FKs.
- **REJECTED as source-equivalent:** current query examples with changed filters, projection, ordering and limits; invented admin/account/brand consumers.

## UNCERTAIN / BUSINESS DECISIONS

- **BUSINESS DECISION:** guest checkout, account deletion linkage, saved addresses, cart sharing/sync, staff identity and authorization.
- **BUSINESS DECISION:** price-on-contact/from acceptance, inventory reservation/preorders, warehouse/batch scope, rental/package treatment and ProjectBuilder quote versus purchase flow.
- **BUSINESS DECISION:** order freeze/correction point, tax/shipping/discount/currency/rounding contract, cancellation/refund/return rules and verification audit requirements.
- **BUSINESS DECISION:** product/news lifecycle, slug reuse/redirects, data retention and permitted deletion; validate legal requirements separately.
- **BUSINESS DECISION:** required SKU/publish completeness, group/score bounds, editorial read-time policy, publication date versus instant, future author/tag administration.
- **RECOMMENDATION pending explicit selection:** database engine/environment strategy, subtype/media/content decomposition and minimal indexes. No architecture is silently replaced by this review.

## REQUIRED CHANGES BEFORE PHYSICAL SCHEMA

1. Correct the evidence baseline and mark nonexistent implementation/tests and obsolete contradictory alternatives as unverified/superseded. Establish one authoritative design revision.
2. Resolve or explicitly defer schema-affecting business questions: every purchase producer's identity and pricing contract, guest/account semantics, inventory meaning, order lifecycle and receipt amounts. Deferral must specify preserved behavior, not leave an unmodeled checkout path.
3. Preserve order-owned shipping and historical line values; define server-side pricing, validation, transaction, authorization, idempotency, uniqueness retry and history protection responsibilities.
4. Document legal Product/Category parity and the chosen subtype exclusivity/completeness mechanism. Remove the illegal CHECK alternative from approved guidance.
5. Produce a field contract covering required versus optional values, meaningful defaults, JSON shape, money bounds, numeric precision, publication time and canonical identifiers. Preserve contact service intent and any accepted builder configuration.
6. Reconcile deletion/archival/slug policies, FK actions and accurate ERD optionalities. Do not claim policy enforcement that the schema/application design does not provide.
7. Correct source-to-query projections, predicates, sorting, null handling, limits and facets. Reclassify partitioning and indexes as unmeasured proposals until real evidence exists; consolidate constraint-created and explicit indexes.
8. Record the target database and a future execution plan for its DDL, negative integrity cases and representative queries. PostgreSQL execution and EXPLAIN are required before calling a physical schema validated, not fabricated prerequisites already completed by this review.

This review proposes corrections only. Existing source and prior architecture files remain unchanged.

**FINAL STATUS: NOT READY FOR SCHEMA DESIGN**
