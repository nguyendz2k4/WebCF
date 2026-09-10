# FE → BE integration contract

This is the contract the frontend now calls. The ASP.NET project currently has EF models and Identity wiring; these business endpoints still need to be implemented. No successful response is simulated in application code. Fixtures exist only under `tests/`.

## Run and configure

Create `FE/.env.local` using these **example values**, adjusted to the actual backend ports:

```dotenv
API_BASE_URL=http://localhost:5000/api
APP_ORIGIN=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- `API_BASE_URL` is server-only. Include the `/api` prefix; never put credentials in the URL. Development can use loopback HTTP. Production requires HTTPS.
- `APP_ORIGIN` is the exact public frontend origin. Mandatory HTTPS in production. Configure it explicitly behind a reverse proxy; the gateway does not trust forwarded Host/Origin headers.
- `NEXT_PUBLIC_SITE_URL` is the public canonical URL, not an API URL or secret.
- If Node calls a backend using a development certificate, install/trust that CA for Node (for example `NODE_EXTRA_CA_CERTS`). Never disable TLS verification.
- Run `npm run dev`. With no BE, operations report unavailable; there is no demo login or fallback business data.

The browser calls `/api/backend/...`. Next route handlers relay only allowlisted paths to `API_BASE_URL`. Public catalog reads and admin page-session checks run server-side. There is no browser bearer token.

## Authentication and authorization

| Endpoint under `/api` | Request | Success |
| --- | --- | --- |
| `POST /auth/login` | `{ email, password }` | `200 {}` or `204`, plus Identity session cookie |
| `GET /auth/me` | Session cookie | `{ user, isAdmin }`, or `401` |
| `POST /auth/logout` | `{}` | `200 {}` or `204`; revoke session and expire all cookie chunks |
| `POST /auth/register` | `{ email, password, name, shopName? }` | `200 {}` or `204`; confirmation email flow, no client-selected privileges |

`user` is `{ id: string, name: string, email: string, role: "owner" | "barista" | "guest", phone?: string, avatar?: string, shopName?: string }`. `role` is the **customer persona**, not an admin permission. `isAdmin: boolean` is calculated from the authenticated Identity principal/roles on the server. Never accept either role or `isAdmin` from registration/profile input.

BE uses `.AspNetCore.Identity.Application` (including `C1`, `C2`, etc. if chunked). The gateway forwards only this cookie and an optional `.Aura.Cart` opaque guest-cart cookie. Outgoing cookies are restricted to `Path=/; HttpOnly; SameSite=Lax`, with `Secure` in production and no Domain attribute. BE must also use secure cookie configuration, regenerate the session after login, expire/revoke it on logout, and preserve signing keys securely across restarts/instances.

Both admin page rendering and the admin API gateway verify the session through BE. **BE must still enforce admin authorization on every admin endpoint and ownership on every cart/order ID.** Client flags and page redirects are not an authorization boundary.

Mutations require JSON, an exact Origin match, and `X-Aura-Request: 1`. Cross-site and sibling-subdomain requests are rejected by the gateway; it never enables CORS. BE must independently protect cookie-authenticated direct requests with antiforgery/origin checks and restricted CORS, or be network-restricted to the gateway. A header alone is not proof that a non-browser client is trusted.

## Cart and checkout

| Endpoint | Request | Response |
| --- | --- | --- |
| `GET /cart` | Cookie | `{ items: CartItem[] }` |
| `POST /cart/items` | `{ productId, quantity }` | Canonical `{ items }` |
| `PUT /cart/items/{productId}` | `{ quantity }` | Canonical `{ items }` |
| `DELETE /cart/items/{productId}` | `{}` | Canonical `{ items }` |
| `DELETE /cart` | `{}` | `{ items: [] }` |
| `POST /checkout/quote` | Shipping fields and product IDs/quantities below | Quote below |
| `POST /orders` | `{ quoteId, preferredPaymentMethod, fromCart }` + `Idempotency-Key` | `OrderReceipt` |
| `GET /orders/{id}` | Authenticated owner | `OrderReceipt`, or `401/403/404` |

`CartItem` follows `src/types/index.ts`: `{ id, title, category, price, formattedPrice, image, quantity, subtitle?, specs? }`. `id` is the product ID, not a cart-row ID. `category` is `equipment | beans | package | service`; price must be finite and nonnegative; quantity is an integer 1–999. Names/prices/availability come from BE. Empty cart is a successful `200 { items: [] }`, not an unavailable service. A guest cart uses a random server-managed cookie ID, never client-provided prices or user IDs. Merge/rotate guest-cart ownership on login; avoid exposing the previous user's cart after logout.

Quote request:

```ts
{
  recipientName: string;
  phone: string;
  province: string;
  district: string; // FE label: phường/xã; rename DB field later if needed
  addressLine: string;
  deliveryNote: string;
  items: { productId: string; quantity: number }[];
}
```

Quote response:

```ts
{
  id: string;
  total: number; // authoritative grand total including applicable fees/taxes
  expiresAt: string; // ISO timestamp with timezone
  items: CartItem[];
  paymentMethods: { id: string; label: string }[];
}
```

Persist the quote/shipping snapshot on BE and bind it to the current user. At order creation, validate ownership, expiry, quantities, availability, prices and payment-method eligibility. Do not silently charge a changed total: reject expired/changed quotes. The FE never sends a payable total. Only return enabled payment methods; there is no fake bank account or QR in the FE.

`OrderReceipt` is `{ id, orderCode, total, status, paymentStatus }`; string fields are required. `status` and `paymentStatus` are server-generated display labels. Payment settlement is not inferred from order submission or a query string.

The checkout keeps one random `Idempotency-Key` for an uncertain submission/retry. BE must atomically enforce uniqueness per user/key and request hash, and return the original receipt for an already committed request. Resolve existing idempotent results **before** rejecting an expired quote on retry. A duplicate key with a different body is `409`. `fromCart: true` removes only the ordered quantities in the same transaction; a buy-now order must not clear unrelated cart items.

## Contact and newsletter

- `POST /contacts`: `{ fullName, phone, email, businessName, serviceType, budgetRange, message }`, plus `Idempotency-Key`. `serviceType`: `full-setup | equipment | coffee-beans | bar-training`; budget: `under-100m | 100m-300m | 300m-600m | above-600m | custom`. Success `200 {}`/`201 {id}`/`204` only after durable acceptance.
- `POST /newsletter/subscriptions`: `{ email }`; success `200 {}`/`204`. Make subscriptions idempotent, verify consent and implement confirmation/unsubscribe before enabling bulk email.
- Enforce request limits/rate limits server-side. Public forms do not gain protection against automated spam merely by passing frontend validation.

## Public catalog and articles

- `GET /catalog/products` returns `Product[]` matching `src/types/product.ts`.
- `GET /catalog/articles` returns `NewsArticle[]` matching `src/types/news.ts`.
- Only published/non-archived records belong in these responses. Resolve category/brand IDs to public names/codes. Map `PriceMode → priceType`, `IsAvailableForOrder → inStock`, `ProductMedia → images`, and structured specs/packaging to their typed DTO fields.
- Current catalog filtering, pagination, related items and sitemap consume the complete published collection. Do not silently truncate responses. For large catalogs, replace these collection contracts with server pagination/facets together with the FE; current rendering targets a small store catalog.
- Missing record in a successfully loaded collection is a 404 page. Unavailable or malformed responses show a retry state, not made-up data.
- Text is rendered through React; article sections are structured text, **not raw HTML**. JSON-LD uses context-safe serialization and a CSP nonce.
- Permitted images: relative same-origin paths or HTTPS `images.unsplash.com`. To use an owned media CDN, update `security.ts`, `next.config.mjs` and CSP together with an explicit allowlist. Do not accept arbitrary image hosts or SVG/data URLs from user input.
- Homepage solution/configurator content is editorial reference material. Its CTAs lead to the live catalog/contact form; it no longer creates orders/carts with invented product IDs.

## Admin data and mutations

`GET /admin/workspace` returns an object with **all eight arrays**:

```ts
{ products: [], categories: [], brands: [], orders: [], customers: [], articles: [], contacts: [], payments: [] }
```

Each row has a server-generated `id: string` and flat string/number fields. Preserve an opaque `version: string` (base64 rowversion) for edits/deletes. Field names, labels and select values are defined in `src/components/admin/model.ts`; do not expose EF entities directly.

| Resource | Important mapping |
| --- | --- |
| products | `name`, `slug`, `domain`, `sku`, **`categoryId`, `brandId`**, `priceType`, `price`, `stock`, `status`, optional `image`, `description`. Status `Đang bán/Ẩn` maps to publish visibility. For `priceType=contact`, map public display to contact pricing, not a zero-price payable item. Validate category/domain agreement. |
| categories | `name`, `code`, `domain`, `displayOrder`, `status` (`Đang hiển thị/Ẩn` → IsActive) |
| brands | `name`, `code`, `status` (`Đang hiển thị/Ẩn` → IsActive) |
| orders | `name`=OrderCode, `customer`, `email`, `total`, `date` (`YYYY-MM-DD`, store timezone), `status`, `payment`, `description`. Computed from order/items/events/ledger. |
| customers | `name`, `email`, `phone`, `address`, `status`=customer group. No identity role/password fields. |
| articles | `name`=Title, `slug`, `category`=CategoryCode, `author`=AuthorName, `status`, `description`=Excerpt, `content`=plain-text editable body, optional `image`. Preserve other structured article metadata on partial updates; never execute submitted HTML. |
| contacts | `name`, `email`, `phone`, `subject`, `status`, `description` |
| payments | `name`, `order`, `customer`, `total`, `method`, `date`, `status`; read-only ledger display |

- `POST /admin/{products|categories|brands|customers|articles|contacts}` receives form fields, **no client-generated persisted ID**, plus `Idempotency-Key`. Return `200/201` JSON or `204` after committing; the FE refreshes from BE.
- `PUT /admin/{resource}/{id}` receives editable fields plus `version`. Use explicit DTO allowlists and validate foreign keys. Do not bind directly to Identity/EF entities.
- `DELETE /admin/{resource}/{id}` receives `{ version }`. Archive where required by relationships/auditing, rather than destroying historical orders. BE enforces category/brand reference constraints.
- `PATCH /admin/inventory/{productId}` receives `{ stock, version }`.
- `PATCH /admin/orders/{id}` receives **only** `{ status, description, version }`. Enforce a state-transition policy server-side. FE cannot edit order totals, customer identity or payment settlement.
- No generic create/delete orders or write-payment route is exposed. Payments must use verified ledger/event workflows, with settlement and refunds implemented on BE separately.
- On concurrency/version conflict return `409`; do not overwrite a newer edit. Backend-generated IDs must be safe URL segments (GUIDs supported).
- The workspace is currently a complete snapshot: frontend dashboard aggregation/filtering is over that snapshot. Return complete data or an error, never a partial snapshot presented as a full total. Gateway caps JSON responses at 5 MiB. For larger operations, implement paginated managers and server dashboard aggregates together before raising this limit.

### Existing database gaps to resolve while writing BE

The current `Product` model has no stock quantity/stock ledger; cart, quote, and newsletter persistence also need schema/workflow support. Identity has been wired but login/me/logout/register business endpoints are absent. Decide inventory reservations and stock accounting before implementing checkout; the FE's `stock` field is not a database implementation. Store customer-group/persona separately from security roles.

## Errors, caching and production acceptance

- `400/422` invalid input, `401` invalid/expired session, `403` unauthorized, `404` absent record, `409` duplicate/version/quote conflict, `429` throttled, `5xx` unavailable.
- No stack trace, SQL error, password, token or raw backend HTML is displayed by FE. Private requests and responses use `no-store`. Nonce-bearing pages are dynamically rendered and must not be cached by a CDN.
- JSON request cap: 1 MiB; response cap at browser gateway: 5 MiB; upstream calls have timeouts and no redirect following. Apply equivalent/lower limits and connection protections at the reverse proxy/BE.
- FE validation improves usability, not trust. BE must validate all requests, use parameterized EF queries, authorize ownership, protect against mass assignment and rate-limit login/public endpoints.
- Before real users: integration tests against actual BE/database, HTTPS and cookie tests on the deployed origin, authorization/IDOR tests, session revocation, order idempotency, inventory concurrency and payment webhook verification (when enabled). FE/mock tests do not certify a backend that has not been written.

## Verification

```sh
npm run typecheck
npm run test:security
npm run build
node tests/browser-security.cjs
```

The repository declares Playwright as a development dependency. Run npm ci first. Browser tests use a local, isolated HTTP fixture and a temporary Next dev server on port 3197. They require Playwright and Chrome (`BROWSER_CHANNEL=chrome`), or a configured supported browser channel. `PLAYWRIGHT_MODULE` optionally points to an existing Playwright installation. No application fallback uses these fixtures, and no real user credentials/data are involved.

Security references: [OWASP XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [OWASP CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html). CSP is defense in depth: script nonces/strict-dynamic and no inline handlers in production; existing React/animation style attributes still require `style-src 'unsafe-inline'`. This does not enable inline scripts.

## Dependency security baseline

Next.js was updated to 16.3.3 and the lockfile resolves sharp 0.35.4 or newer. The update addresses [the Windows RCE advisory](https://github.com/advisories/GHSA-p293-qw3h-jr36), [the image-optimization advisory](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4), and [the sharp/libheif advisory](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c). npm audit reported zero known vulnerabilities after the update on 2026-09-09; this is a point-in-time dependency check, not a guarantee against all vulnerabilities.
