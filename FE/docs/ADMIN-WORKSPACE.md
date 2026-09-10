# Aura Admin — frontend tích hợp API

Mở /admin. Trang kiểm tra phiên với backend trước khi render; tài khoản chưa đăng nhập chuyển đến /admin/login, tài khoản không có quyền admin bị từ chối. Không còn nút demo, user tự tạo hay dữ liệu nghiệp vụ trong localStorage/sessionStorage.

Admin gồm tổng quan, sản phẩm, danh mục, thương hiệu, tồn kho, đơn hàng, khách hàng, bài viết, liên hệ và thanh toán. Dữ liệu lấy qua API; thao tác ghi chỉ báo thành công sau phản hồi từ máy chủ. Khi tải lỗi, hiển thị lỗi và nút thử lại, không hiển thị số 0 như dữ liệu thật.

- Sản phẩm chọn danh mục/thương hiệu bằng ID; có slug, nhóm sản phẩm và kiểu giá.
- Đơn hàng chỉ sửa trạng thái/ghi chú; tổng tiền và thanh toán chỉ đọc.
- Thanh toán là sổ giao dịch chỉ đọc, không có CRUD giả lập thu/hoàn tiền.
- Tồn kho chỉnh số lượng qua endpoint riêng. Backend cần triển khai schema và quy tắc tồn kho.
- Nội dung hiển thị bằng React text; ảnh giới hạn nguồn; CSV vô hiệu hóa công thức độc hại.
- Dữ liệu cũ trong các key demo/tài khoản/giỏ hàng được dọn khi tải trang. Thiết lập giao diện khác không bị xóa.

Chi tiết endpoint, DTO, cấu hình, các yêu cầu bắt buộc của BE và giới hạn snapshot hiện tại: [FRONTEND-BACKEND-CONTRACT.md](./FRONTEND-BACKEND-CONTRACT.md).

Kiểm tra: npm run typecheck, npm run test:security, npm run build. Kiểm thử trình duyệt bằng npm run test:browser (cần Playwright và Chrome); npm run test:production kiểm tra CSP trên bản build production. Fixture kiểm thử không được dùng làm dữ liệu của ứng dụng.
