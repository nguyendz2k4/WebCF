# Đánh giá và thay đổi Backend — 10/09/2026

## Kết luận

BE đã có nền Controller → Service → EF Core, DTO, Identity, policy và RowVersion. Tuy nhiên, bản đầu **chưa đáp ứng đầy đủ** những điều tài liệu `BE_ARCHITECTURE_CHANGES.md` cũ khẳng định. Bản sửa này giữ kiến trúc và schema nghiệp vụ sẵn có, bổ sung module banner, sửa các đường vượt quyền, validation, quy trình xuất bản và tính nhất quán khi ghi dữ liệu.

Phạm vi: BE và tài liệu/kiểm thử BE. Không sửa frontend, không triển khai, không chạy migration/DDL trên database của người dùng. Tài liệu này là kết quả rà soát mới, ưu tiên hơn các tuyên bố hoàn thành trong báo cáo cũ.

## Đánh giá theo tiêu chí

| Tiêu chí | Hiện trạng phát hiện | Thay đổi |
|---|---|---|
| Admin/public riêng | Có route riêng; workspace chỉ cần đăng nhập đã đọc toàn bộ dữ liệu | Giữ route riêng; vô hiệu hóa workspace bằng 410, service không đọc DB |
| DTO | Public category/brand dùng DTO admin | DTO public riêng, loại Version và thông tin quản trị; JSON field ngoài DTO bị từ chối |
| Validate hai lớp | Nhiều service tin validation HTTP; status/price không khớp SQL | HTTP FluentValidation/annotations, service gọi ServiceInput và kiểm tra nghiệp vụ/FK |
| Phân quyền action | Sửa/tạo bài viết có thể publish qua IsPublished | Loại field publication khỏi create/edit; endpoint publish riêng có policy; product price/delete giữ quyền riêng |
| Soft delete | Product/article archive; category/brand inactive | Giữ dữ liệu và FK; banner dùng ArchivedAt; public chỉ đọc nội dung được phép hiển thị |
| Pagination/filter/sort | Workspace load hết; public category/brand không phân trang; nhiều SortBy bị bỏ qua | Bỏ snapshot; danh sách có page/pageSize, filter, sort whitelist và khóa Id phụ ổn định |
| Không tin client | Secret JWT/password admin mặc định; role token tồn tại dài | Bỏ secret/password mặc định; kiểm tra lại user/role/permission/security stamp từ DB mỗi request |
| Cache | Key thiếu filter; webhook lỗi không có retry; memory cache khác nhau giữa instance | Catalog đọc SQL, API no-store; transactional outbox cho webhook, retry có backoff |
| Draft/published | Sửa published hiện ngay; tạo được publish trực tiếp | Create luôn draft; muốn sửa phải unpublish → sửa → preview → publish |
| Rich text | Sanitize cả chuỗi JSON như HTML làm sai cấu trúc/bỏ lọt HTML encode | Parse JSON rồi sanitize từng giá trị string; giữ cấu trúc và scalar; sanitize mô tả |
| Response | Model binding/auth/workspace khác envelope | ApiResponse cho lỗi binding, auth, status và controller; lỗi trùng dữ liệu 409 |
| Concurrent edit | Contacts thiếu Version; no-op có thể không tạo UPDATE; order event không đổi parent RowVersion | Contacts thêm Version; ép guarded update ở category/brand/article; order dùng Version + ExpectedSequence và khóa parent |
| Controller mỏng | Phần lớn đã đúng | Giữ logic trong Service; filter chỉ đảm nhiệm transaction request admin |
| Audit | Save audit sau mutation và nuốt lỗi | Audit failure ném lỗi; mutation + audit + outbox cùng transaction ở admin API |

## Quy trình xuất bản và quyền

- Product: `Products.EditGeneral`, `Products.EditPrice`, `Products.Publish`, `Products.Delete` độc lập.
- AdminAssistant có quyền sửa thông tin sản phẩm; không có đổi giá, xóa, publish. Gửi thêm `price`/`isPublished` trong DTO sửa chung nhận 400; gọi action không được cấp nhận 403.
- Article: Create/Edit không có IsPublished. `PATCH /api/admin/articles/{id}/publish` chỉ dành quyền Articles.Publish.
- Banner: quyền View/Create/Edit/Publish/Delete riêng, không tự cấp cho admin phụ.
- Người dùng public không thể tự đăng ký role/permission. SuperAdmin provisioning chỉ bật khi cấu hình chủ động, không nâng quyền một tài khoản public đã tồn tại.
- Public chỉ thấy published và chưa archive. Product còn yêu cầu category/brand active.

**Giới hạn workflow đã chọn:** không có hai phiên bản live/draft chạy song song. Khi unpublish để sửa, nội dung tạm ẩn khỏi khách; sửa nội dung đang published trả 409. Nếu cần giữ bản cũ online trong khi soạn bản mới, phải bổ sung bảng revision/snapshot sau này. Preview chỉ là DTO cho admin; giao diện preview chưa xây trong phạm vi BE.

## API chính

| Tài nguyên | Admin | Public |
|---|---|---|
| Products | `/api/admin/products`, `/{id}`, `/{id}/price`, `/{id}/publish`, `/{id}/preview` | `/api/catalog/products`, `/{slug}` |
| Categories | `/api/admin/categories`, `/{id}` | `/api/catalog/categories` |
| Brands | `/api/admin/brands`, `/{id}` | `/api/catalog/brands` |
| Articles | `/api/admin/articles`, `/{id}`, `/{id}/publish`, `/{id}/preview` | `/api/catalog/articles`, `/{slug}` |
| Banners | `/api/admin/banners`, `/{id}`, `/{id}/publish`, `/{id}/preview` | `/api/public/banners` |
| Orders | `/api/admin/orders`, `/{id}`, `/{id}/status` | `/api/checkout/quote`, `/api/orders`, `/api/orders/{id}` |
| Contacts | `/api/admin/contacts`, `/{id}`, `/{id}/status` | `/api/contacts` |
| Audit | `/api/admin/audit-logs` | Không có |

Danh sách: `?page=1&pageSize=20&sortBy=name&sortDir=asc`. Page 1–1.000.000, pageSize được giới hạn 1–100. SortBy tùy tài nguyên: product name/price/createdAt; category name/code/createdAt/displayOrder; brand name/code/createdAt; article title/createdAt/publishedAt; order createdAt/orderCode/total; contact createdAt/fullName/status; audit createdAt/action/entityType; banner theo validator/service. Filter không phù hợp trả 400 ở các trường có validation.

Response thành công: `{ success, message, data, errors, timestamp }`; danh sách nằm trong `data: { items, page, pageSize, totalItems, totalPages, hasPreviousPage, hasNextPage }`. Version của mutation là base64 SQL rowversion 8 byte; tải lại dữ liệu khi nhận 409.

## Đồng bộ với SQL đã thiết kế

- Trạng thái order dùng mã DB: `submitted → confirmed → processing → dispatched → completed`; các bước trước dispatched có thể cancelled theo trigger SQL.
- Order đã submitted là immutable theo `TR_Order_Guard`. Không UPDATE parent để tăng Version. API đổi trạng thái khóa parent với UPDLOCK/HOLDLOCK trong transaction admin và kiểm tra `ExpectedSequence` so với event mới nhất. Request cần `{ version, expectedSequence, status, note }`; GET admin trả `currentSequence`.
- Tạo order theo thứ tự draft + items → seal SubmittedAt → thêm event submitted, cùng transaction, phù hợp trigger có sẵn.
- Contact lưu `new/contacted/closed`, source `contact`, serviceType theo CHECK constraint.
- Thanh toán tạo đơn chỉ nhận `cod/vietqr`; chưa tích hợp xử lý VNPay hoặc tự xác nhận đã nhận tiền.
- Checkout cần đăng nhập; quote gắn customer, submit kiểm tra lại sản phẩm và giá. Receipt chỉ chủ đơn xem được. Idempotency-Key bắt buộc GUID; khác owner bị chặn, khác payload trả 409. CheckoutQuoteUse ngăn một quote tạo hai đơn với key khác nhau.
- Quote đang lưu memory: restart/instance khác có thể làm mất quote; khách cần tạo quote mới. Muốn scale checkout nhiều instance cần kho quote dùng chung. Đây không phải giải pháp inventory reservation hay payment gateway hoàn chỉnh.

## Cache và audit

AdminMutationFilter bao transaction cho admin write. AuditLogService không nuốt lỗi. Nếu ghi audit/outbox thất bại, transaction rollback. CacheInvalidation lưu trong SQL trước commit; worker chỉ thấy event đã commit.

Worker gửi `POST NextJs:RevalidateUrl`, header `X-Revalidation-Secret`, JSON `{ tags: ["catalog","products","categories","brands","articles","banners"], eventId }`. FE phải xác thực secret, xử lý revalidate đúng tag/path và trả 2xx **sau khi thành công**. Gửi ít nhất một lần; endpoint phải idempotent. Retry tối đa khoảng cách 5 phút, dữ liệu pending giữ khi restart. Cần vận hành theo dõi pending/Attempts và dọn event hoàn tất định kỳ. Không có cấu hình webhook thì event giữ pending.

BE no-store không tự xóa cache ISR/CDN hiện có. Chưa sửa/triển khai endpoint Next.js hay purge CDN, nên chưa thể khẳng định khách cập nhật tức thời toàn tuyến. Các service mutation gọi nội bộ ngoài HTTP admin phải tự có transaction/audit/outbox tương đương; filter hiện áp dụng cho HTTP API.

## Cấu hình và áp dụng database

1. Dùng schema SQL Server 2022 đã thiết kế và Identity upgrade hiện có. Không chạy lại script tạo schema gốc vào database đã có dữ liệu.
2. Áp dụng hai script bổ sung trong `VDungCoffe/VDungCoffe/Database/`: `20260910_AddBanners.sql`, `20260910_AddAuditAndCacheOutbox.sql`. Script thứ hai tạo AuditLog, CacheInvalidation, CheckoutQuoteUse nếu chưa có. Chưa chạy các script này ở phiên làm việc này.
3. Set `Jwt__Key` mới, ngẫu nhiên, ít nhất 32 byte qua environment/secrets. Giữ Issuer/Audience nhất quán. Thiếu key hợp lệ ứng dụng chủ động từ chối khởi động.
4. `InitialAdmin__Enabled=false` mặc định. Khi cần provision: bật true, cấp Email và Password riêng ít nhất 12 ký tự; tắt sau khi tạo. Không có tài khoản/mật khẩu demo tự seed nữa. Những tài khoản/secret demo đã tồn tại từ trước cần được người quản trị thu hồi/đổi; việc xóa khỏi source không xóa chúng trong DB hoặc lịch sử Git.
5. Cấu hình ConnectionStrings, Cors:AllowedOrigins, NextJs:RevalidateUrl và NextJs:RevalidateSecret theo môi trường. Production chạy HTTPS.

Các bảng bổ sung dùng script deployment riêng; EF migration snapshot hiện tại chưa được tái sinh để bao gồm chúng. Không sinh/chạy migration mới tùy tiện trước khi reconcile snapshot với database. Không tự chạy DDL khi startup.

## Thay đổi FE cần theo sau

- Bỏ workspace snapshot, gọi API theo quyền và từng trang.
- Category/brand đọc `data.items` thay vì array/DTO admin.
- Không gửi field entity/field không thuộc request DTO; không gửi IsPublished khi create/edit.
- Thêm nút unpublish/preview/publish theo permission, xử lý 409 và rowversion.
- Status order/contact dùng mã canonical; FE tự dịch nhãn tiếng Việt. Order status update gửi ExpectedSequence.
- Checkout đăng nhập, dùng cod/vietqr và GUID Idempotency-Key; không tái dùng key cho payload khác.
- Cài webhook revalidate theo hợp đồng ở trên.

## Kiểm thử và giới hạn bằng chứng

Đã build .NET 9 thành công, không warning/error trong lần kiểm tra ghi nhận. Bộ regression executable có 22 kiểm tra đã qua: policy thực tế, quyền admin phụ, DTO overposting, sanitizer (kể cả HTML encode trong JSON), pagination, giá, rowversion metadata và định dạng. HTTP smoke đã qua 6 trường hợp thực trên host local: 401, 400 malformed/extra fields, 403 Origin không hợp lệ, 404; đều kiểm tra envelope.

Lệnh từ thư mục repository:

```powershell
dotnet build BE/VDungCoffe/VDungCoffe/VDungCoffe.csproj --no-restore
dotnet run --project BE/VDungCoffe/VDungCoffe.Regression --no-restore
& BE/VDungCoffe/VDungCoffe.Regression/HttpSmoke.ps1
```

Chưa chạy integration với SQL Server thực, chưa chứng minh rollback/concurrent write/trigger qua DB thực, chưa kiểm tra JWT role DB end-to-end và chưa kiểm tra webhook Next.js/CDN thực. Cần chạy các ca đó trên database test sau khi áp dụng script, đặc biệt hai admin cùng sửa, hai request cùng quote, audit failure rollback, draft không lọt public và webhook retry sau restart. Không coi build/22 regression/6 smoke là bằng chứng production-ready.

## Sửa lỗi khởi động JWT trên máy phát triển

- Nguyên nhân: cấu hình Jwt:Key đã được bỏ khỏi source nhưng project chưa có UserSecretsId và máy chưa có khóa thay thế.
- Thêm UserSecretsId vào project, tạo khóa ngẫu nhiên 48 byte và lưu vào ASP.NET User Secrets trên máy này. Không ghi khóa vào source/Git.
- Visual Studio dùng profile Development sẽ tự nạp User Secrets. Stop Debugging rồi chạy lại F5 để build/nạp cấu hình mới.
- Production vẫn bắt buộc cấu hình Jwt__Key riêng; không dùng fallback mật khẩu công khai.
- Build kiểm tra dùng thư mục output riêng để không đụng tiến trình Visual Studio đang debug.

### Điều chỉnh profile Visual Studio khi lỗi JWT còn xuất hiện

Profile http/https đặt cả DOTNET_ENVIRONMENT và ASPNETCORE_ENVIRONMENT thành Development. Program nạp User Secrets theo ID cố định trong Development, sau đó giữ ưu tiên environment/CLI. Build riêng đã qua; không dừng tiến trình debug của người dùng. Cần Stop Debugging, Rebuild Solution và chạy lại profile https để nạp bản mới.
