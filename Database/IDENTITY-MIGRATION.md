# Nâng cấp Identity cho AuraCoffee hiện có

Migration `20260909083317_AddIdentityTables` được sửa để nâng cấp schema
đã tạo bằng `Database/AuraCoffee.sql`. Không dùng migration này để khởi tạo
database trống. Khi triển khai database mới, cần tạo schema nền trước.

Trong Package Manager Console, chọn project `VDungCoffe` rồi chạy:

```powershell
Update-Database
```

Không cần chạy lại `Add-Migration`, `Remove-Migration` hay xóa database.
Giữ nguyên migration ID, Designer và ModelSnapshot hiện có.
Nếu Package Manager Console vẫn báo EF Tools 9.0.19 sau restore,
khởi động lại Visual Studio để tải lại Tools 9.0.20.

`IdentityUpgrade.review.sql` là SQL đã sinh để xem lại; chỉ chọn một cách
áp dụng, không chạy cả SQL này lẫn Update-Database như hai bước liên tiếp.

Migration chỉ thêm 6 bảng Identity, 14 cột vào AppUser và cập nhật các
index/cột định danh cũ. Giữ nguyên Id, Email, Phone, dữ liệu nghiệp vụ và
sequence OrderNumber. Các giá trị xác nhận email/điện thoại/2FA mặc định false.

Các hồ sơ AppUser cũ chưa có UserName, PasswordHash và security stamp.
Migration không tự tạo mật khẩu hoặc biến hồ sơ thành tài khoản đăng nhập.
Cần hoàn thiện luồng kích hoạt tài khoản bằng UserManager sau đó.

Down chỉ gỡ phần Identity và các cột vừa thêm; dữ liệu trong phần đó sẽ mất.
Down chủ động dừng nếu có tài khoản không còn đủ IdentityIssuer/IdentitySubject
để khôi phục ràng buộc NOT NULL cũ. Không tự bịa định danh cho tài khoản mới.

Đã kiểm tra build, SQL Up/Down và tính đồng bộ model/snapshot.
Chưa áp dụng migration hoặc chạy SQL lên database thực tế.
