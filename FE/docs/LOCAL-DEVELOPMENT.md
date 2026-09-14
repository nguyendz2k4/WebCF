# Chạy FE cùng BE trên máy local

1. Chạy BE từ `BE/VDungCoffe/VDungCoffe` bằng `dotnet run --launch-profile http` (hoặc profile https trong Visual Studio, vẫn mở cổng HTTP 5105).
2. Tạo file `FE/.env.development.local` với nội dung:

   ```dotenv
   API_BASE_URL=http://localhost:5105/api/
   ```

3. Trong `FE`, chạy `npm run dev` và mở http://localhost:3000/products.
4. Trang đăng nhập quản trị: http://localhost:3000/admin.

FE gọi BE từ Next.js server; `API_BASE_URL` không dùng tiền tố `NEXT_PUBLIC_` và phải có `/api/`. Khởi động lại FE sau khi đổi cấu hình. Khi triển khai production, cấu hình riêng `API_BASE_URL` và `APP_ORIGIN` bằng HTTPS.

API catalog trả `{ success, data: { items, page, totalPages, ... } }`. FE đọc đủ các trang và chuyển DTO sản phẩm sang dữ liệu giao diện. API phiên đăng nhập cũng được bọc trong `data`.

BE hiện không tự seed mật khẩu Admin mặc định (`InitialAdmin:Enabled=false`). Tài khoản cũ trong database vẫn tồn tại. Cơ chế cấp tài khoản mới nằm trong `Data/DbInitializer.cs` và dùng `InitialAdmin` qua secrets.

Admin dùng API riêng theo quyền và đọc dữ liệu phân trang; không dùng `/api/admin/workspace` đã ngừng hỗ trợ. Sửa giá, xuất bản, trạng thái đơn hàng và liên hệ dùng các endpoint PATCH chuyên biệt với version hiện tại. Sản phẩm/bài viết mới được tạo ở bản nháp. Chuyển về nháp trước khi sửa nội dung đã xuất bản.

Sau schema nền và Identity, chạy script bổ sung bảng hỗ trợ trên database local:

```powershell
sqlcmd -S DESKTOP-TI015LT -d AuraCoffee -E -C -b -i BE/VDungCoffe/VDungCoffe/Database/20260910_AddAuditAndCacheOutbox.sql
```

Script chỉ tạo bảng còn thiếu. Thiếu `CacheInvalidation` khiến các thao tác ghi danh mục/sản phẩm bị rollback. Thiếu `CheckoutQuoteUse` làm gián đoạn tạo đơn hàng.

Khách hàng và giao dịch thanh toán hiện chỉ hỗ trợ xem. Giao dịch yêu cầu `Permissions.Payments.View` (SuperAdmin có quyền này). Mục tồn kho hiển thị trạng thái nhận đơn; database chưa có sổ số lượng tồn kho vật lý.

Kiểm tra hợp đồng dữ liệu: `node --test tests/catalog-contract.test.cjs tests/admin-contract.test.cjs tests/security.test.cjs`. Kiểm tra TypeScript: `npm run typecheck`.

Kiểm thử Admin trên hệ thống local đang chạy: đặt `ADMIN_TEST_EMAIL` và `ADMIN_TEST_PASSWORD`, rồi chạy `node tests/admin-live.cjs` trong FE. Script tạo các bản ghi tiền tố `codex-check-`, kiểm tra thao tác và gọi API xóa/lưu trữ chúng khi kết thúc. Chỉ dùng với database thử nghiệm/local.

## Khi các API đồng loạt timeout / 503

Nếu Visual Studio đang dừng tại exception hoặc breakpoint, BE có thể vẫn mở cổng nhưng không xử lý request. Stop Debugging, build lại và chạy lại. `/api/auth/me` trả 401 khi chưa đăng nhập là bình thường; endpoint này được bảo vệ bằng `[Authorize]` để không gọi service rồi ném exception cho khách chưa đăng nhập.

API giỏ hàng hỗ trợ GET/DELETE `/api/cart`, POST `/api/cart/items`, PUT/DELETE `/api/cart/items/{id}`. Giỏ hàng lưu ID và số lượng trong cookie HttpOnly được ASP.NET Data Protection bảo vệ; giá được đọc lại từ SQL. Giới hạn 20 mặt hàng, 999 đơn vị/mặt hàng, cookie 30 ngày; chưa đồng bộ giỏ hàng giữa thiết bị. FE tự lấy phần `data` trong `ApiResponse` trước khi đọc giỏ hàng/báo giá.
