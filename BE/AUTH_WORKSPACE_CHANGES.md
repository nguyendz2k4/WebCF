# Ghi chú bảo mật authentication và workspace

## Thay đổi

- JWT không còn fallback secret; cấu hình `Jwt__Key` qua environment hoặc user-secrets, tối thiểu 32 bytes ngẫu nhiên. Secret development cũ bị từ chối. Access token có thời hạn 1 giờ.
- Mỗi request cookie/JWT tải lại role và permission từ Identity DB; user bị disabled/lockout hoặc security stamp thay đổi bị từ chối ngay. Token phát hành trước thay đổi này cần đăng nhập lại.
- `IsAdmin` nhận diện chính xác SuperAdmin, AdminAssistant, ContentEditor.
- Login/Register validate cả controller và service.
- Không còn tài khoản admin/assistant và password mẫu được seed. Role mẫu vẫn được tạo. Khi cần tự provisioning: bật `InitialAdmin__Enabled=true`, cung cấp email/password qua secret; password tối thiểu 12 ký tự. Không tự nâng quyền email public đã tồn tại. Tắt cờ sau provisioning.
- Xóa secret JWT, admin và revalidation khỏi appsettings source; giữ cấu hình kết nối DB.
- Browser mutation kiểm tra Origin/Referer theo host API và `Cors:AllowedOrigins`; FE khác domain phải cấu hình allowlist. Postman không gửi browser Origin vẫn dùng Bearer được.
- Unknown JSON members trả 400; model validation và HTTP status lỗi trả ApiResponse đồng nhất.
- `GET /api/admin/workspace` đã nghỉ: user chưa đăng nhập nhận 401; user đã đăng nhập nhận 410. Không đọc/trả snapshot toàn DB. FE phải gọi từng API phân trang có policy tương ứng.

## Kiểm chứng

Đã chạy `dotnet build BE/VDungCoffe/VDungCoffe --no-restore` khi các agent khác đang cập nhật. Các file auth/workspace không báo lỗi compile; build lúc kiểm tra bị chặn bởi helper/DTO đang triển khai ở ProductService, ArticleService, ContactService. Kết quả build cuối cùng xem báo cáo BE tổng hợp.

Các ca integration cần DB SQL Server và secrets riêng (chưa thực thi trong phần việc này):

1. Thiếu JWT secret hoặc dùng secret development cũ: startup bị từ chối.
2. Đăng nhập customer rồi gọi workspace: 410, không có dữ liệu customer/order/payment; anonymous: 401.
3. Login hợp lệ rồi disable user, lockout hoặc đổi security stamp: cookie và JWT cũ bị từ chối 401.
4. Bỏ quyền Products.Delete trong DB sau login: request tiếp theo không được xóa dù token chứa quyền cũ.
5. AdminAssistant gọi xóa/đổi giá: 403; quyền sửa thông tin chung không cấp quyền đổi giá.
6. Request login/register chứa field ngoài DTO: 400 ApiResponse; request invalid gọi trực tiếp service cũng thất bại validation.
7. POST có Origin không nằm allowlist: 403; Origin FE đã cấu hình hoạt động bình thường.
8. InitialAdmin tắt: không tạo user. Bật với email của customer tồn tại: không thăng quyền customer.

Lưu ý: các tài khoản mặc định đã được tạo ở DB cũ không tự động bị xóa; người vận hành phải vô hiệu hóa/đổi mật khẩu chúng. Logout hiện chỉ xóa cookie; Bearer token còn hiệu lực đến hạn hoặc khi security stamp thay đổi.
