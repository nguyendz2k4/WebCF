# Kiến Trúc Backend C# & Danh Sách API Hệ Thống AuraCoffee

Tài liệu này tổng hợp toàn bộ cấu trúc Backend ASP.NET Core (.NET 9), các quy chuẩn thiết kế, phân quyền sâu theo hành động (Action-based Authorization), xử lý dữ liệu và danh sách API hoàn chỉnh.

---

## 1. Tổng Quan Kiến Trúc Đa Tầng (Layered Architecture)

Hệ thống tuân thủ nghiêm ngặt mô hình 3 tầng, tách bạch trách nhiệm, không trộn logic nghiệp vụ vào Controller:

```
[ HTTP Request (Admin / Client / Postman) ]
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│               1. Presentation Layer                    │
│  - Controllers: AdminControllers & PublicControllers   │
│  - Middleware: GlobalExceptionMiddleware, CORS, Auth   │
│  - Input Validation (Lớp 1): FluentValidation          │
│  - Action Authorization: [HasPermission(Action)]       │
└─────────────────────────┬──────────────────────────────┘
                          │ (Truyền DTO - Tuyệt đối không truyền Entity)
                          ▼
┌────────────────────────────────────────────────────────┐
│                 2. Service Layer                       │
│  - IProductService, ICategoryService, IOrderService... │
│  - Business Validation (Lớp 2): Logic, FK, Domain rule │
│  - Anti-XSS Sanitizer: Ganss.Xss.HtmlSanitizer         │
│  - Optimistic Concurrency: Kiểm tra RowVersion         │
│  - Soft Delete: Set ArchivedAt / IsActive              │
│  - Cache Manager: MemoryCache & Invalidate Next.js ISR │
│  - Audit Logger: Ghi vết hành động admin               │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│            3. Data Access & Persistence                │
│  - DbContext: AuraCoffeeContext (EF Core 9)            │
│  - Global Query Filter: Products (ArchivedAt == null)  │
│  - Identity: AppUser : IdentityUser<Guid>              │
│  - Tables: Product, Category, Brand, Order, AuditLog   │
└────────────────────────────────────────────────────────┘
```

---

## 2. 15 Tiêu Chuẩn Kỹ Thuật Đã Được Triển Khai

| STT | Yêu cầu Kỹ thuật | Giải pháp Triển khai |
| :--- | :--- | :--- |
| 1 | **Tách API Admin & Public** | Tuyệt đối không dùng chung endpoint: Admin thuộc `/api/admin/...`, Public thuộc `/api/catalog/...`, `/api/orders/...`, `/api/auth/...`. |
| 2 | **100% DTO, không bind Entity** | Mọi dữ liệu vào/ra đều qua DTO (`DTO/Admin/...` và `DTO/User/...`). Mappings độc lập tại `Mappings/`. |
| 3 | **Validate 2 lớp** | **Lớp 1**: `FluentValidation` (kiểm tra kiểu, độ dài, null, regex). **Lớp 2**: `Service` (kiểm tra category domain tương thích, slug trùng, ràng buộc trạng thái đơn hàng). |
| 4 | **Action-based Authorization** | Không chỉ check route: dùng policy `[HasPermission("...")]`. Role `AdminAssistant` (admin phụ) chỉ được sửa mô tả (`Products.EditGeneral`), bị chặn `403 Forbidden` khi cố đổi giá (`Products.EditPrice`) hoặc xoá (`Products.Delete`) dù gọi trực tiếp bằng Postman. |
| 5 | **Soft Delete thay vì Hard Delete** | `Product` và `NewsArticle` dùng cờ `ArchivedAt`. `Category` và `Brand` dùng cờ `IsActive = false`. Không xoá vật lý trong DB, bảo toàn 100% Foreign Key đơn hàng lịch sử. |
| 6 | **Pagination, Filter, Sort từ đầu** | Mọi API danh sách đều hỗ trợ `page`, `pageSize`, `keyword`, `sortBy`, `sortDir`, `categoryId`, `brandId`, `priceRange`. Cung cấp thêm `/api/admin/workspace` để giữ tương thích với UI Admin hiện tại. |
| 7 | **Zero-Trust User Data** | Không bao giờ tin role/isAdmin từ client gửi lên. Seed tài khoản admin và quyền hạn độc lập qua code khởi tạo (`DbInitializer`). |
| 8 | **Cache Invalidation** | `CacheService` lưu cache danh mục công khai với tag. Khi admin tạo/sửa/đổi giá/xuất bản/xóa, tự động xoá cache và kích hoạt webhook revalidate ISR của Next.js. |
| 9 | **Quy trình Draft / Published** | Sản phẩm và bài viết mặc định tạo ở trạng thái Bản nháp (`IsPublished = false`). Có endpoint Preview riêng cho admin (`GET /preview`). Chỉ admin có quyền mới được Publish. Khách chỉ thấy bản Published. |
| 10 | **Anti-XSS Rich Text Sanitizer** | Dùng `HtmlSanitizer` lọc toàn bộ thẻ độc (`<script>`, `<iframe>`, `onerror`, `javascript:`) trong mô tả sản phẩm và bài viết trước khi lưu DB. |
| 11 | **Đồng nhất ApiResponse** | Mọi response đều trả về khuôn mẫu: `{ success, message, data, errors, timestamp }` hoặc `{ items, page, pageSize, totalItems, totalPages }`. |
| 12 | **Optimistic Concurrency** | Trường `Version` (`RowVersion byte[]`) bắt buộc gửi kèm trong request dưới dạng base64 string. Nếu có xung đột chỉnh sửa, ném `ConcurrencyConflictException` trả về HTTP `409 Conflict`. |
| 13 | **Tách biệt Controller & Service** | Controller mỏng tối đa, chuyển toàn bộ logic tính toán, kiểm tra quyền và database xuống Service. |
| 14 | **Audit Logging Admin** | Tạo bảng `AuditLog` lưu lại: ai thao tác, hành động gì, bảng nào, ID nào, snapshot giá trị cũ/mới dạng JSON, thời gian UTC và IP client. |
| 15 | **Dual Authentication** | Hỗ trợ song song Cookie Authentication (`.AspNetCore.Identity.Application` cho Next.js) và Bearer JWT Token (cho Postman/Mobile). |

---

## 3. Ma Trận Phân Quyền Theo Hành Động (Action Permissions)

Hệ thống định nghĩa các Claim quyền hạn tại `Security/Permissions.cs`:

- `Permissions.Products.View`: Xem danh sách sản phẩm
- `Permissions.Products.Create`: Tạo mới sản phẩm (bản nháp)
- `Permissions.Products.EditGeneral`: Sửa tên, slug, mô tả, thông số kỹ thuật, ảnh (KHÔNG được đổi giá)
- `Permissions.Products.EditPrice`: Đổi giá bán và kiểu giá
- `Permissions.Products.Publish`: Xuất bản hoặc ẩn sản phẩm
- `Permissions.Products.Delete`: Lưu trữ (soft delete) sản phẩm
- `Permissions.Categories.View` / `Categories.Manage`
- `Permissions.Brands.View` / `Brands.Manage`
- `Permissions.Orders.View` / `Orders.UpdateStatus`
- `Permissions.Articles.View` / `Articles.Create` / `Articles.Edit` / `Articles.Publish` / `Articles.Delete`
- `Permissions.Contacts.View` / `Contacts.Manage`
- `Permissions.AuditLogs.View`

### Phân công vai trò mẫu đã Seed sẵn:
- **`SuperAdmin`**: Sở hữu toàn bộ 100% quyền hạn.
- **`AdminAssistant` (Admin phụ)**:
  - ✅ Được xem sản phẩm, sửa mô tả và thông số (`Products.EditGeneral`)
  - ✅ Được xem đơn hàng, danh mục, thương hiệu, liên hệ
  - ❌ **BỊ CHẶN TUYỆT ĐỐI**: Không có quyền đổi giá (`Products.EditPrice`), không có quyền xoá (`Products.Delete`).
- **`ContentEditor` (Biên tập nội dung)**:
  - ✅ Biên tập bài viết, xuất bản tin tức, sửa mô tả sản phẩm.

---

## 4. Danh Sách API Chi Tiết

### 4.1. Admin API (Base: `/api/admin`)

Tất cả các endpoint dưới đây yêu cầu Header `Authorization: Bearer <token>` hoặc Session Cookie đã xác thực.

| Phương thức | Đường dẫn Endpoint | Quyền yêu cầu | Mô tả |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/admin/products` | `Products.View` | Lấy danh sách sản phẩm phân trang, lọc theo danh mục, thương hiệu, giá, xuất bản. |
| **GET** | `/api/admin/products/{id}` | `Products.View` | Lấy chi tiết 1 sản phẩm. |
| **GET** | `/api/admin/products/{id}/preview` | `Products.View` | Xem trước sản phẩm ở chế độ khách (kể cả khi đang là bản nháp). |
| **POST** | `/api/admin/products` | `Products.Create` | Tạo mới sản phẩm (mặc định là bản nháp). Sanitize mô tả chống XSS. |
| **PUT** | `/api/admin/products/{id}` | `Products.EditGeneral` | Sửa thông tin chung/mô tả/ảnh/thông số. Kiểm tra version concurrency. **Không nhận giá**. |
| **PATCH** | `/api/admin/products/{id}/price` | `Products.EditPrice` | **Cập nhật giá và kiểu giá**. Tách riêng endpoint để admin phụ không gọi được. |
| **PATCH** | `/api/admin/products/{id}/publish` | `Products.Publish` | Bật/tắt xuất bản sản phẩm ra ngoài web. |
| **DELETE** | `/api/admin/products/{id}` | `Products.Delete` | **Soft delete** (gán `ArchivedAt`), bảo toàn đơn hàng cũ. Yêu cầu `version`. |
| **GET** | `/api/admin/categories` | `Categories.View` | Danh sách danh mục quản trị. |
| **POST** | `/api/admin/categories` | `Categories.Manage` | Tạo danh mục. |
| **PUT** | `/api/admin/categories/{id}` | `Categories.Manage` | Sửa danh mục (concurrency check). |
| **DELETE** | `/api/admin/categories/{id}` | `Categories.Manage` | Ẩn danh mục (`IsActive = false`). |
| **GET** | `/api/admin/brands` | `Brands.View` | Danh sách thương hiệu. |
| **POST** | `/api/admin/brands` | `Brands.Manage` | Tạo thương hiệu. |
| **PUT** | `/api/admin/brands/{id}` | `Brands.Manage` | Sửa thương hiệu. |
| **DELETE** | `/api/admin/brands/{id}` | `Brands.Manage` | Ẩn thương hiệu (`IsActive = false`). |
| **GET** | `/api/admin/orders` | `Orders.View` | Danh sách đơn hàng phân trang, lọc theo trạng thái, ngày đặt. |
| **GET** | `/api/admin/orders/{id}` | `Orders.View` | Chi tiết đơn hàng, khách hàng, items, lịch sử sự kiện. |
| **PATCH** | `/api/admin/orders/{id}/status` | `Orders.UpdateStatus` | Cập nhật trạng thái đơn hàng (kiểm tra quy tắc chuyển trạng thái). |
| **GET** | `/api/admin/articles` | `Articles.View` | Danh sách bài viết. |
| **POST** | `/api/admin/articles` | `Articles.Create` | Tạo bài viết (rich text sanitize). |
| **PUT** | `/api/admin/articles/{id}` | `Articles.Edit` | Sửa bài viết (concurrency check). |
| **DELETE** | `/api/admin/articles/{id}` | `Articles.Delete` | Lưu trữ bài viết (`ArchivedAt`). |
| **GET** | `/api/admin/contacts` | `Contacts.View` | Danh sách yêu cầu liên hệ & tư vấn. |
| **PATCH** | `/api/admin/contacts/{id}/status` | `Contacts.Manage` | Cập nhật trạng thái xử lý yêu cầu liên hệ. |
| **GET** | `/api/admin/audit-logs` | `AuditLogs.View` | **Tra cứu nhật ký thao tác**: ai sửa giá, ai xoá, IP nào, snapshot cũ/mới. |
| **GET** | `/api/admin/workspace` | Role Admin | **Snapshot 8 bảng** cho giao diện Dashboard FE hiện tại. |

---

### 4.2. Public API (Dành cho Khách & Cửa Hàng)

Không yêu cầu quyền admin; dữ liệu đã được lọc sạch (chỉ hiển thị bản ghi active/published).

| Phương thức | Đường dẫn Endpoint | Mô tả |
| :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Đăng nhập; trả về JWT token + Session cookie + danh sách permissions. |
| **POST** | `/api/auth/register` | Đăng ký tài khoản khách hàng (không cấp đặc quyền admin). |
| **GET** | `/api/auth/me` | Lấy thông tin user hiện tại và cờ `isAdmin`. |
| **POST** | `/api/auth/logout` | Đăng xuất, hủy session cookie. |
| **GET** | `/api/catalog/products` | Danh sách sản phẩm đang bán (hỗ trợ phân trang, lọc theo domain, category, giá). Có cache. |
| **GET** | `/api/catalog/products/{slug}` | Chi tiết sản phẩm công khai theo slug. Có cache. |
| **GET** | `/api/catalog/categories` | Danh mục sản phẩm đang hiển thị (`IsActive = true`). |
| **GET** | `/api/catalog/brands` | Thương hiệu sản phẩm đang hiển thị. |
| **GET** | `/api/catalog/articles` | Danh sách bài viết đã xuất bản (`PublishedAt != null`). |
| **GET** | `/api/catalog/articles/{slug}` | Chi tiết bài viết đã xuất bản. |
| **POST** | `/api/checkout/quote` | Tính toán báo giá đơn hàng chính xác từ giá DB (không tin giá client), cấp `quoteId` có hạn 30 phút. |
| **POST** | `/api/orders` | Đặt hàng chính thức từ `quoteId`. Hỗ trợ header `Idempotency-Key` chống đặt trùng khi mạng chập chờn. |
| **GET** | `/api/orders/{id}` | Lấy biên lai và tiến độ đơn hàng. |
| **POST** | `/api/contacts` | Gửi biểu mẫu tư vấn & liên hệ giải pháp cà phê. |

---

## 5. Tài Khoản Khởi Tạo Mặc Định (Seed Accounts)

Các tài khoản này được tự động tạo khi chạy hệ thống (trong `DbInitializer`):

1. **Tài khoản SuperAdmin (Toàn quyền)**:
   - Email: `admin@auracoffee.com`
   - Mật khẩu: `Admin@123456`
   - Role: `SuperAdmin` (có tất cả permissions)
2. **Tài khoản Admin Phụ (Kiểm thử phân quyền)**:
   - Email: `assistant@auracoffee.com`
   - Mật khẩu: `Assistant@123456`
   - Role: `AdminAssistant` (chỉ được xem và sửa mô tả; gọi PATCH price hoặc DELETE sẽ bị `403 Forbidden`)

---

## 6. Định Dạng Phản Hồi Chuẩn (Standard Response Format)

### Thành công thông thường:
```json
{
  "success": true,
  "message": "Cập nhật thông tin sản phẩm thành công",
  "data": { ... },
  "errors": null,
  "timestamp": "2026-09-10T11:00:00Z"
}
```

### Thành công danh sách phân trang:
```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "items": [ ... ],
    "page": 1,
    "pageSize": 20,
    "totalItems": 142,
    "totalPages": 8,
    "hasPreviousPage": false,
    "hasNextPage": true
  },
  "errors": null,
  "timestamp": "2026-09-10T11:00:00Z"
}
```

### Lỗi xung đột sửa đồng thời (409 Conflict):
```json
{
  "success": false,
  "message": "Dữ liệu đã bị thay đổi bởi người khác. Vui lòng tải lại trang để xem thông tin mới nhất.",
  "data": null,
  "errors": [ "Optimistic concurrency conflict detected." ],
  "timestamp": "2026-09-10T11:00:00Z"
}
```

### Lỗi bị chặn quyền (403 Forbidden):
```json
{
  "success": false,
  "message": "Bạn không có quyền thực hiện hành động này.",
  "data": null,
  "errors": [ "Forbidden: missing permission Permissions.Products.EditPrice" ],
  "timestamp": "2026-09-10T11:00:00Z"
}
```

---

## 7. Hướng Dẫn Chạy & Thử Nghiệm

### Khởi động Backend:
Từ thư mục `d:\WebCF(VanDung)\BE\VDungCoffe\VDungCoffe`, chạy lệnh:
```powershell
dotnet run
```
API sẽ lắng nghe tại cổng đã cấu hình (ví dụ `http://localhost:5000` hoặc cổng HTTPS).

### Kiểm thử trên Postman:
1. Gửi request `POST /api/auth/login` với email `assistant@auracoffee.com` / `Assistant@123456` để lấy Bearer Token.
2. Dùng Token này gọi `PUT /api/admin/products/{id}` để sửa mô tả -> **Thành công 200**.
3. Dùng chính Token này gọi `PATCH /api/admin/products/{id}/price` hoặc `DELETE /api/admin/products/{id}` -> **Bị chặn 403 Forbidden** ngay lập tức!
4. Đăng nhập bằng `admin@auracoffee.com` / `Admin@123456` để thử lại hai thao tác trên -> **Thành công 200**!
