# CSDL AuraCoffee

Chạy AuraCoffee.sql một lần trong database TRỐNG trên SQL Server 2022+, collation Vietnamese_100_CI_AI, bằng SSMS hoặc sqlcmd -b. File gộp schema, trigger, stored procedure và dữ liệu danh mục từ BE/sql/001 đến 004; không chứa query thử nghiệm. Không chạy cả bản gộp và các bản thành phần trên cùng database.

Sau đó bạn tự cấu hình kết nối, scaffold các bảng nghiệp vụ vào BE/Models và DbContext vào BE/Data. Chỉ nhập connection string không tự sinh model. Model cũ nằm trong Reference, không compile vào API.

## Identity

Bạn tự cài ASP.NET Core Identity. Identity mặc định có AspNetUsers và các bảng role/claim/login/token; không cần thêm bảng đăng nhập hay lưu mật khẩu riêng. Kiểm tra migration để không tạo lại bảng nghiệp vụ đã tồn tại.

AppUser trong SQL này là hồ sơ nghiệp vụ, không lưu mật khẩu. Đơn hàng/thanh toán tham chiếu AppUser.Id (Guid). Khi tích hợp Identity, dùng IdentityIssuer là mã cố định (ví dụ aspnet-identity), IdentitySubject là AspNetUsers.Id. Cặp này có unique index nhưng chưa có FK đến Identity. BE cần tạo/liên kết hồ sơ khi đăng ký, lấy AppUser.Id theo tài khoản đã xác thực; không tin CustomerId/ActorId do client tùy ý gửi. Email/Phone cần được đồng bộ theo quy tắc bạn chọn.

Nếu chỉ muốn AspNetUsers, có thể chuyển thuộc tính nghiệp vụ vào class kế thừa IdentityUser và bỏ AppUser, nhưng phải sửa tất cả FK và stored procedure liên quan. Identity mặc định dùng khóa string, SQL này dùng Guid; cần chốt kiểu khóa trước. Không chỉ xóa AppUser khỏi script.

Tài liệu: https://learn.microsoft.com/aspnet/core/security/authentication/customize-identity-model
