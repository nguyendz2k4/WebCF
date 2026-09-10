> Cập nhật cấu trúc BE: project chạy chính hiện là BE/Aura.Api.sln (.NET 9), Entity nằm trong BE/Models, DbContext trong BE/Data. Các project Aura.Persistence/Aura.ModelCheck/design cũ đã chuyển vào BE/tools và chỉ là tài liệu tham chiếu. Schema SQL Server không đổi. Xem BE/README.md để chạy Swagger.

# Thiết kế SQL Server cho Aura Coffee

Ngày: 05/09/2026. Vai trò: Database Architect / Senior .NET Developer.

Đây là **bản thiết kế mới theo yêu cầu chọn SQL Server**, thay thế hướng PostgreSQL cho BE tương lai. Tài liệu cũ và frontend được giữ nguyên. Gói này cung cấp model và cơ chế bảo vệ, chưa phải backend đã triển khai hoặc một hệ thống kế toán/hoá đơn điện tử hoàn chỉnh.

## Những lựa chọn nền tảng

| Vấn đề | Quyết định trong bản này | Căn cứ / giới hạn |
|---|---|---|
| Engine | SQL Server 2022, Docker Linux, database compatibility mặc định 160 | Theo yêu cầu SQL Server; dùng JSON NVARCHAR và ISJSON(..., ARRAY/OBJECT) của SQL Server 2022 |
| BE | .NET 10 + EF Core 10, SqlClient | Khung cho BE tương lai; chưa tạo controller/authentication |
| Định danh | Guid/uniqueidentifier; ID nội bộ khác slug/SKU/OrderCode | Mọi Entity kế thừa BaseEntity; Id mặc định NEWSEQUENTIALID, CreatedAt mặc định SYSUTCDATETIME |
| Tiền | decimal(18,0), tiền VND nguyên; C# decimal | Không float/double/money, không chuỗi định dạng. Currency của Order bị CHECK='VND' |
| Hàng không có giá chính xác | PriceMode=contact thì Price=NULL; from chỉ là giá tham khảo | Không dùng 0 để thay cho giá chưa biết. Bản này chỉ cho fixed checkout; from/contact chuyển yêu cầu báo giá |
| Tồn/khả năng đặt | IsAvailableForOrder là boolean duy nhất, không có default SQL | Chỉ nghĩa là được phép đặt theo vận hành; không có số lượng tồn/reservation hoặc tự động chống oversell |
| Hiển thị | IsPublished=false mặc định; ArchivedAt tùy chọn | Hiển thị, lưu trữ và khả năng đặt là ba khái niệm khác nhau |
| Nhu cầu sử dụng | UseCase n-n Product qua ProductUseCase | Máy xay hay máy pha đều có thể phù hợp gia đình, quán nhỏ, quán specialty... |
| Thông số | Một bảng Product; CHECK theo Domain; các thông số không áp dụng được NULL | Không tách chỉ vì nhiều cột. Thẻ sản phẩm, tìm kiếm và bộ lọc hiện đọc nhiều thông số |
| Địa chỉ | Snapshot ở Order, không có UserAddress | Giữ mô hình đang có. Thêm địa chỉ lưu sẵn sau này vẫn phải snapshot vào đơn |
| Checkout | Có AppUser đã xác thực; CustomerId NOT NULL, không tự tạo guest | Phù hợp gate hiện tại; persona='guest' không đồng nghĩa anonymous checkout |
| Cart | Vẫn ở trình duyệt, không có bảng Cart | BE phải kiểm tra lại ProductId/giá/khả năng đặt khi submit |
| Gói giải pháp, thuê tháng, ProjectBuilder | ContactInquiry có Source, LegacyPackageCode, ConfigurationJson | Lựa chọn phạm vi: đây là yêu cầu báo giá. Không tự bán hợp đồng thuê dưới dạng món hàng mua một lần |
| Tin tức | Tác giả inline, tag/sections JSON; phút đọc dạng số | Không bảng author/tag chưa có consumer; không tách body chỉ vì dài. Query listing dùng projection |
| Slug | Unique toàn bộ, kể cả sản phẩm/tin đã archive | Chủ động không tái sử dụng URL cho nội dung khác; đổi chính sách cần migration được review |

Nguồn ứng dụng: `FE/src/types/product.ts:22–75` (giá/thông số/suitableFor), `catalogUtils.ts:41–179` (lọc/sắp xếp), `AppContext.tsx:82–118,199–232` (cart/auth gate), `CheckoutModal.tsx:99–105,148–183` (shipping/tổng tiền/submit mô phỏng), `SolutionsSection.tsx:42–76` (thuê tháng/hồ sơ báo giá), `ProjectBuilder.tsx:103–113` (dự toán), `ContactForm.tsx:43–50,60–87` (serviceType và trường tùy chọn), `NewsCard.tsx:35–52` (nhãn/ngày/phút đọc).

### Bất biến tài chính được hiểu thế nào?

**Sản phẩm có thể đổi giá; đơn đã chốt và tiền đã ghi nhận không bị sửa theo.** Không cần đóng băng toàn bộ catalog hoặc tài khoản.

Luồng tạo đơn:

1. BE lấy CustomerId từ identity đã xác thực. Payload công khai chỉ có ProductId, Quantity và shipping; không lấy tên hàng/đơn giá/tổng tiền do trình duyệt gửi làm thẩm quyền.
2. `dbo.CreateOrder` kiểm tra sản phẩm canonical, published, chưa archive, được đặt, giá fixed và category/brand đang active. Đọc giá dưới lock trong transaction. Boolean availability không phải tồn kho định lượng.
3. Tạo draft nội bộ, copy tên/SKU/quy cách/thông số ngắn/đơn giá vào OrderItem, tính tổng rồi đặt SubmittedAt. Trigger kiểm tra không có đơn rỗng và tổng khớp các dòng.
4. Commit đơn và event submitted trong cùng transaction. Draft không lộ ra như một đơn đã nhận. Nếu lỗi thì rollback.
5. Trigger chặn UPDATE/DELETE Order đã submitted và mọi INSERT/UPDATE/DELETE lên các dòng của đơn đó. Trạng thái tiếp theo là một OrderEvent mới, có actor và sequence; không sửa trạng thái cũ.

Luồng tiền:

- **PaymentAttempt:** yêu cầu thu tiền và thông tin chuyển khoản đã phát hành; có thể có nhiều lần cho một đơn, phục vụ đặt cọc/chuyển nhiều đợt. Không được coi RequestedAmount là đã thu.
- **PaymentAttemptEvent:** khách báo đã chuyển, thất bại, hết hạn... chỉ là thông tin thao tác, không xác nhận tiền.
- **PaymentEntry(kind=receipt):** khoản tiền đã xác minh thực nhận, do người có quyền đối soát ghi nhận. Có nguồn chứng từ, mã chứng từ duy nhất, thời điểm giao dịch, thời điểm hệ thống ghi nhận và người thực hiện.
- **PaymentEntry(kind=refund):** khoản hoàn đã thực hiện, tham chiếu receipt ban đầu. Trigger chặn hoàn khác đơn/attempt và tổng hoàn vượt khoản thực nhận đó. Không cập nhật giảm Amount của receipt.
- `OrderPaymentBalance` tính ReceivedAmount, RefundedAmount, NetReceived và OutstandingAmount từ các dòng tiền bất biến. Không lưu một cột “PaidAmount” thứ hai để tùy ý sửa.

Ví dụ: đơn 30 triệu; khách chuyển 10 triệu rồi 20 triệu → hai receipt, NetReceived=30 triệu. Hoàn 5 triệu → thêm refund 5 triệu liên kết receipt, NetReceived=25 triệu. Hai receipt gốc vẫn giữ nguyên. OutstandingAmount khi đó là 5 triệu theo giá trị đơn gốc; **không tự kết luận phải thu tiếp** khi đơn đã hủy/hoàn. BE phải kết hợp trạng thái đơn và quyết định nghiệp vụ. Đây là sổ thu/hoàn theo đơn, chưa phải kế toán công nợ hoặc sổ cái kép.

Nếu khách chuyển thừa, vẫn ghi toàn bộ tiền thực nhận rồi xử lý hoàn; không chặn receipt chỉ vì nó vượt tổng đơn. Không tạo âm tiền để “sửa cho cân”. Một sai sót nhập liệu cần quy trình điều chỉnh có chứng từ được thiết kế tiếp; **không dùng refund để giả rằng đã chuyển trả tiền khi chưa hoàn thực tế**. Bản này chưa có loại adjustment hoặc tái phân bổ receipt giữa đơn; đó là phạm vi cần bổ sung rõ trước vận hành nếu cần.

### Công thức tiền và giá trị chưa biết

```text
OrderItem.LineTotal = UnitPrice × Quantity − DiscountAmount
Order.Subtotal = SUM(UnitPrice × Quantity)
Order.DiscountTotal = SUM(DiscountAmount)
Order.Total = Subtotal − DiscountTotal + ShippingFee
NetReceived = SUM(receipt.Amount) − SUM(refund.Amount)
```

UnitPrice là giá khách thanh toán đã bao gồm VAT theo cách giao diện hiện ghi “đã gồm VAT”. `TaxIncludedAmount` là phần thuế nằm trong giá, có thể NULL nếu chưa xác định; **NULL không đồng nghĩa thuế bằng 0**. Command mẫu không tính thuế và đặt trường này NULL. Chưa có tích hợp hóa đơn điện tử, tỷ lệ VAT theo hàng hóa, credit note hay chứng từ điều chỉnh thuế. CHECK chỉ giới hạn phần thuế không vượt số tiền tương ứng; chưa có công thức đối chiếu thuế header với các dòng/phí vận chuyển. Trước khi bật ghi nhận phần thuế khác NULL, phải thống nhất tax contract và bổ sung kiểm tra tại bước seal; không dùng cột dự phòng này như bằng chứng đã triển khai nghiệp vụ thuế.

Command mẫu hiện không áp dụng khuyến mãi nên DiscountAmount=0 là giá trị có nghĩa “không giảm giá”; ShippingFee phải do BE tính theo chính sách thật và truyền rõ ràng, không lấy phí từ khách rồi tin. Đơn giá tối đa trong CHECK hiện chọn 999.999.999.999 VND/món, quantity 1..10.000, tối đa 100 dòng/command. Đây là giới hạn vận hành đề xuất để chặn đầu vào bất thường; không được coi là giới hạn chứng minh từ frontend. Tổng decimal(18,0) tràn sẽ làm transaction thất bại.

Tất cả đầu vào tiền phải là số nguyên trước khi truyền SqlParameter: SQL decimal(18,0) có thể làm tròn đầu vào có phần lẻ. `PaymentCommands.cs` đã kiểm tra điều này cho command ghi tiền; API tạo đơn cần làm tương tự với phí và mọi tiền do BE tính. HTTP JSON nên trả số tiền dạng chuỗi thập phân nếu có thể vượt Number.MAX_SAFE_INTEGER của JavaScript.

### Giới hạn của “bất biến”

SQL triggers + FK NO ACTION + role runtime bị DENY DML bảo vệ trước các câu lệnh ứng dụng thông thường, gồm cả việc bỏ qua EF. `rowversion` chỉ hỗ trợ phát hiện cập nhật đồng thời cho catalog/user, không phải cơ chế lịch sử bất biến. Các thao tác tài chính gọi thủ tục, không gọi `DbSet.Update`/`Remove`.

Quản trị viên có quyền sysadmin/db_owner vẫn có thể tắt trigger hoặc sửa cấu trúc. Bản này **không tuyên bố chống sửa bởi DBA**; nhu cầu đó cần SQL Server Ledger/kiểm toán ngoài hệ thống, quản trị đặc quyền và backup riêng. Không chọn Ledger/Temporal tự động: Temporal lưu lịch sử nhưng không tự cấm sửa; Ledger là lựa chọn vận hành bổ sung.

Đặc biệt: database runtime dùng chung cho BE không biết người dùng HTTP nào là staff. BE phải kiểm tra quyền đối soát trước RecordPaymentEntry và quyền chuyển trạng thái trước AppendOrderEvent. CustomerPersona không chứa admin và không cấp quyền. Người dùng bấm “đã chuyển khoản” chỉ được tạo event customer_reported sau khi kiểm tra quyền sở hữu, không được tạo receipt. Không tin ActorId/CustomerId từ request body. Chưa có backend auth trong gói này.

### Idempotency, mã đơn và lock

- Mã đơn AURA-{sequence} được cấp bằng sequence SQL Server không cycle + UNIQUE; có thể có khoảng trống khi rollback. Không dùng random 6 chữ số; mã đơn không phải token truy cập riêng tư.
- CreateOrder dùng UNIQUE(CustomerId,IdempotencyKey), khóa ứng dụng theo cặp này và hash payload đã chuẩn hóa thứ tự dòng. Retry cùng yêu cầu trả đơn cũ; cùng key khác nội dung bị từ chối. Retry sau khi giá catalog đổi vẫn trả đơn cũ cho cùng request.
- PaymentAttempt có key theo đơn; PaymentEntry có key toàn cục và UNIQUE(ExternalSource,ExternalReference). Retry khác key nhưng cùng chứng từ bị chặn; không ghi hai lần cùng tiền.
- RecordPaymentEntry khóa Order trước ghi tiền để hai lần hoàn đồng thời không cùng vượt số tiền receipt. Unique key và trigger là lớp bảo vệ bổ sung. Các procedure tự quản transaction và từ chối ambient transaction; BE retry có giới hạn khi deadlock/timeout, giữ nguyên idempotency key.
- AppendOrderEvent dùng ExpectedSequence; xung đột trả lỗi để BE tải trạng thái mới. Confirmed là trạng thái xử lý đơn, không có nghĩa tự động đã thanh toán. COD có thể được giao trước receipt.
- Tất cả FK NO ACTION, không cascade tài chính. User/Product đã được tham chiếu được vô hiệu hóa/archive; không hard-delete để bỏ liên kết lịch sử. Giữ toàn cục slug và SKU nếu có.

### Tìm máy cho gia đình / quán nhỏ

`Category` trả lời **“đây là loại gì?”**; `UseCase` trả lời **“phù hợp dùng ở đâu?”**. Một máy pha có thể có cả home và small-cafe. Máy xay cũng dùng các thẻ này, không cần tạo một bảng máy xay gia đình riêng.

`ProductUseCase(ProductId,UseCaseId)` là unique để không trùng thẻ; index đảo `(UseCaseId,ProductId)` phục vụ lọc theo nhu cầu. Danh sách thẻ do người quản lý danh mục xác nhận, không tự suy ra “quán nhỏ” từ giá hay số group. `small-cafe` là thẻ bổ sung theo yêu cầu mới; không tự đổi boutique-cafe thành small-cafe vì hai khái niệm không hoàn toàn giống nhau.

Ví dụ EF nằm ở `BE/Aura.Persistence/ProductQueries.cs`, SQL ở `BE/sql/005_query_examples.sql`. Lọc category=coffee-grinders, useCase=small-cafe cùng brand/giá. Dùng EXISTS để tránh nhân đôi sản phẩm do n-n. Listing trả projection có cả thông số mà card cần; không tải body bài viết hoặc mọi navigation bằng Include. Mặc định vẫn hiển thị hàng chưa được đặt, để UI giải thích hoặc điều hướng báo giá.

Các index là baseline đề xuất; chưa có execution plan hoặc số liệu tải. Không hứa tìm substring sẽ dùng B-tree. Mẫu `.Contains` cho tên/brand/mô tả có thể scan; khi dữ liệu tăng, đánh giá Full-Text Search cho tiếng Việt/khả năng bỏ dấu và yêu cầu token thay vì giả rằng nó tương đương mọi substring. Những facet kỹ thuật như nhóm máy/điện áp/điểm cupping có cột riêng để lọc, nhưng chưa tự thêm index cho từng tổ hợp.

`ProductQueries.cs` là ví dụ mới tập trung category/useCase/brand/giá và bốn kiểu sort, **không phải thay thế đầy đủ catalogUtils hiện tại**. Khi nối frontend, còn phải chuyển các bộ lọc groups/boiler/voltage/origin/roast/minCupping, capacity/cupping sort, full catalog search và autocomplete riêng; điện áp 220V/380V phải khớp cả hai lựa chọn. Thứ tự curated của mẫu là featured rồi createdAt và Id, thay đổi có chủ ý so với fixture order hiện tại; cần áp dụng nhất quán ở UI mới.

### NULL, JSON, kiểu dữ liệu và nguồn dữ liệu

- NVARCHAR lưu tiếng Việt; VARCHAR chỉ dùng code/slug/enum/định danh ASCII. Các code dùng collation BIN2 để so sánh chính xác; tên/mô tả theo Vietnamese_100_CI_AI. Normalize code về lower-case ở BE trước ghi; xác thực tránh ký tự không hỗ trợ ở VARCHAR. Nếu cần slug tiếng Việt có dấu, đổi sang NVARCHAR có chủ đích.
- DateTime ở C# được quy ước UTC, datetime2(3) ở DB; BE phải kiểm tra Kind và trả DTO có `Z`. datetime2 không lưu timezone. PublishedAt là thời điểm, format ở UI; không sắp xếp ngày bằng chuỗi “28 Tháng 8, 2026”.
- `ReadTimeMinutes` là số được tính khi lưu nội dung hoặc nhập giá trị biên tập theo policy. Không tải toàn bài chỉ để hiện phút đọc. CategoryLabel được map riêng cho news; `all` chỉ là lựa chọn UI.
- TagsJson, SectionsJson và FlavorNotesJson CHECK array; ConfigurationJson CHECK object. JSON shape bên trong (tag phải là string, section có body...) cần validation BE trước ghi, không được tuyên bố ISJSON đã xác nhận toàn bộ hợp đồng.
- Không có default cho Price, PriceMode, IsAvailableForOrder, tên/địa chỉ/đơn giá/tiền thực nhận. IsPublished=false là lựa chọn an toàn; CreatedAt là thời gian tạo thật; tag=[] chỉ dùng khi biết không có tag. Các đặc tính không có/không áp dụng để NULL.
- BaseEntity không có IsDeleted hay UpdatedAt cho mọi bảng; không áp soft delete máy móc lên tài chính. Product.UpdatedAt do BE cập nhật khi sửa; Version SQL rowversion tự thay đổi, CreatedAt không phải thời gian cập nhật.
- ProductMedia giữ mọi ảnh một lần; Position=0 là cover. Unique(ProductId,Position) giữ thứ tự. Điều kiện “sản phẩm public cần cover” được BE kiểm tra lúc publish; FK không tự đảm bảo ít nhất một ảnh.
- Không có bảng vendor, kho, tồn theo batch, coupon, review, subscription, bundle, author hoặc persistent cart trong scope này. Không có nghĩa chúng bị cấm trong tương lai.

### Chuyển dữ liệu từ frontend về sau

1. Seed Category và UseCase từ `004_reference_data.sql`; importer tách Brand từ các chuỗi thật.
2. Map product.id vào Product.LegacyId (unique, nullable), tạo Guid mới; không dùng slug làm PK. Preserve sku nếu có; không invent SKU để lấp NULL.
3. Map suitableFor sang ProductUseCase; giữ nguyên tags hiện có, thêm small-cafe sau khi quản lý xác nhận. Map images theo vị trí; PriceMode contact → Price NULL; stock fixture → IsAvailableForOrder sau review nghiệp vụ.
4. Giữ warranty/unitSize bắt buộc khi publish theo source, cho phép thiếu khi draft. Thông số có thể NULL đúng domain; các CHECK ngăn lẫn mechanics/terroir.
5. Các ID eq-tier-*, bean_* phải có bảng mapping importer được xác nhận sang product canonical, không tự match bằng tên gần giống. pkg_* và project_* đi ContactInquiry theo quyết định phạm vi trên; ConfigurationJson lưu đầy đủ model/capacity/diện tích/budget và gợi ý, kèm đơn vị rõ ràng.
6. Cart cũ cần được resolve/reprice qua BE; không tạo OrderItem ProductId=NULL để lách FK. Backend từ chối legacy ID chưa map. Đây là bước tích hợp tương lai, chưa chạy hoặc sửa UI hiện tại.

## Phần 1 — Danh sách bảng, kiểu dữ liệu và quan hệ

15 bảng. Mọi bảng có `Id uniqueidentifier` (PK) và `CreatedAt datetime2(3)` (UTC). Cột ghi NULL là tùy chọn; các cột còn lại NOT NULL, trừ thông tin biểu diễn computed/rowversion được mô tả riêng. `Order` là tên keyword nên SQL dùng `[Order]`; EF tự quote tên.
| Bảng | Các cột riêng (mọi bảng có Id uniqueidentifier, CreatedAt datetime2(3)) | Quan hệ / vai trò |
|---|---|---|
| Category | Code: varchar(60); Name: nvarchar(120); Domain: varchar(16); DisplayOrder: int; IsActive: bit; Version: rowversion | Phân loại máy pha, máy xay, hạt, siro...; 1-n Product.  |
| Brand | Code: varchar(60); Name: nvarchar(120); IsActive: bit; Version: rowversion | Thương hiệu danh mục, không phải nhà cung cấp.  |
| UseCase | Code: varchar(40); Name: nvarchar(120); Description: nvarchar(500) NULL; DisplayOrder: int; IsActive: bit; Version: rowversion | Nhu cầu sử dụng: home, small-cafe...; n-n Product qua ProductUseCase.  |
| Product | LegacyId: varchar(100) NULL; Slug: varchar(160); Sku: varchar(60) NULL; Name: nvarchar(250); CategoryId: uniqueidentifier; Domain: varchar(16); BrandId: uniqueidentifier; ShortDescription: nvarchar(2000); PriceMode: varchar(12); Price: decimal(18,0) NULL; IsAvailableForOrder: bit; IsPublished: bit; IsFeatured: bit; LeadTimeNotice: nvarchar(300) NULL; ArchivedAt: datetime2(3) NULL; UpdatedAt: datetime2(3) NULL; Version: rowversion; GroupsCount: int NULL; Boiler: nvarchar(200) NULL; BoilerCapacity: nvarchar(120) NULL; Pump: nvarchar(150) NULL; PowerLabel: nvarchar(100) NULL; Voltage: varchar(16) NULL; Dimensions: nvarchar(120) NULL; WeightLabel: nvarchar(80) NULL; Warranty: nvarchar(200) NULL; DailyCapacityLabel: nvarchar(150) NULL; Origin: nvarchar(150) NULL; SubRegion: nvarchar(150) NULL; Altitude: nvarchar(100) NULL; Process: nvarchar(150) NULL; RoastProfile: varchar(20) NULL; CuppingScore: decimal(5,2) NULL; FlavorNotesJson: nvarchar(max) NULL; UnitSize: nvarchar(100) NULL; CaseSize: nvarchar(100) NULL; ShelfLife: nvarchar(150) NULL | Một bảng Product với discriminator và CHECK; NULL hợp lệ cho thông số không áp dụng. Domain khớp Category bằng FK ghép. Product n-1 Category; Product n-1 Brand |
| ProductUseCase | ProductId: uniqueidentifier; UseCaseId: uniqueidentifier | Bảng nối n-n. Unique(ProductId,UseCaseId); không lặp hai thẻ nhu cầu cho cùng sản phẩm. ProductUseCase n-1 Product; ProductUseCase n-1 UseCase |
| ProductMedia | ProductId: uniqueidentifier; Url: nvarchar(1000); AltText: nvarchar(300) NULL; Position: int | Ảnh duy nhất tại Position=0 là cover; ảnh còn lại thứ tự 1,2...; không lặp cover ở Product. ProductMedia n-1 Product |
| AppUser | IdentityIssuer: varchar(100); IdentitySubject: varchar(200); DisplayName: nvarchar(150); Email: nvarchar(254); Phone: nvarchar(30) NULL; AvatarUrl: nvarchar(1000) NULL; CustomerPersona: varchar(20) NULL; ShopName: nvarchar(150) NULL; DisabledAt: datetime2(3) NULL; Version: rowversion | Hồ sơ gắn identity đã xác thực; không lưu mật khẩu giả, địa chỉ hay quyền admin trong persona.  |
| Order | OrderCode: varchar(32); CustomerId: uniqueidentifier; IdempotencyKey: uniqueidentifier; RequestHash: varchar(64); Currency: varchar(3); PreferredPaymentMethod: varchar(12); RecipientName: nvarchar(150); Phone: nvarchar(30); Email: nvarchar(254) NULL; AddressLine: nvarchar(400); Province: nvarchar(120); District: nvarchar(120) NULL; DeliveryNote: nvarchar(1000) NULL; Subtotal: decimal(18,0); DiscountTotal: decimal(18,0); ShippingFee: decimal(18,0); Total: decimal(18,0); TaxIncludedAmount: decimal(18,0) NULL; SubmittedAt: datetime2(3) NULL; Version: rowversion | Đơn chốt bất biến cả header và shipping; draft nội bộ chỉ trong transaction. Tổng giá gồm VAT theo hợp đồng hiển thị hiện tại. Order n-1 AppUser |
| OrderItem | OrderId: uniqueidentifier; ProductId: uniqueidentifier; LineNumber: int; ProductName: nvarchar(250); Sku: varchar(60) NULL; Specification: nvarchar(1000) NULL; UnitLabel: nvarchar(100) NULL; UnitPrice: decimal(18,0); Quantity: int; DiscountAmount: decimal(18,0); LineTotal: decimal(18,0); TaxIncludedAmount: decimal(18,0) NULL | Bản sao thương mại, không đọc giá/tên hiện tại khi xem hóa đơn. FK NO ACTION bảo vệ sản phẩm đã có lịch sử. OrderItem n-1 Order; OrderItem n-1 Product |
| OrderEvent | OrderId: uniqueidentifier; Sequence: int; Status: varchar(20); ActorId: uniqueidentifier; Note: nvarchar(1000) NULL | Lịch sử trạng thái append-only; không sửa trạng thái cũ. OrderEvent n-1 Order; OrderEvent n-1 AppUser |
| PaymentAttempt | OrderId: uniqueidentifier; RequestedById: uniqueidentifier; IdempotencyKey: uniqueidentifier; Method: varchar(12); RequestedAmount: decimal(18,0); TransferReference: varchar(100) NULL; DestinationSnapshot: nvarchar(1000) NULL; ExpiresAt: datetime2(3) NULL | Yêu cầu thanh toán/đích chuyển khoản; không chứng minh tiền đã vào. PaymentAttempt n-1 Order; PaymentAttempt n-1 AppUser |
| PaymentAttemptEvent | PaymentAttemptId: uniqueidentifier; ActorId: uniqueidentifier; EventType: varchar(24); Note: nvarchar(1000) NULL | Log báo đã chuyển, thất bại, hết hạn; không cộng tiền vào doanh thu. PaymentAttemptEvent n-1 PaymentAttempt; PaymentAttemptEvent n-1 AppUser |
| PaymentEntry | OrderId: uniqueidentifier; PaymentAttemptId: uniqueidentifier; RecordedById: uniqueidentifier; IdempotencyKey: uniqueidentifier; Kind: varchar(12); Amount: decimal(18,0); ExternalSource: varchar(80); ExternalReference: varchar(160); OccurredAt: datetime2(3); ReversesEntryId: uniqueidentifier NULL; Reason: nvarchar(1000) NULL | Tiền thực nhận/hoàn thực tế append-only; hoàn liên kết receipt, cùng đơn/attempt và không vượt receipt. PaymentEntry n-1 Order; PaymentEntry n-1 PaymentAttempt; PaymentEntry n-1 AppUser; PaymentEntry n-1 PaymentEntry |
| NewsArticle | Slug: varchar(160); Title: nvarchar(250); Excerpt: nvarchar(2000); CategoryCode: varchar(30); PublishedAt: datetime2(3) NULL; CoverImageUrl: nvarchar(1000); AuthorName: nvarchar(150); AuthorRole: nvarchar(200); AuthorAvatarUrl: nvarchar(1000) NULL; ReadTimeMinutes: int; TagsJson: nvarchar(max); LeadParagraph: nvarchar(max); SectionsJson: nvarchar(max); IsFeatured: bit; ArchivedAt: datetime2(3) NULL; Version: rowversion | Author inline, tag JSON; phút đọc số cập nhật cùng nội dung; PublishedAt NULL là draft.  |
| ContactInquiry | CustomerId: uniqueidentifier NULL; FullName: nvarchar(150); Phone: nvarchar(30); Email: nvarchar(254); BusinessName: nvarchar(150) NULL; ServiceType: varchar(30); BudgetRange: varchar(30) NULL; Message: nvarchar(4000) NULL; Source: varchar(30); LegacyPackageCode: varchar(100) NULL; ConfigurationJson: nvarchar(max) NULL; Status: varchar(20); Version: rowversion | Liên hệ, gói giải pháp/thuê và cấu hình dự toán; chưa là đơn có nghĩa vụ thanh toán. ContactInquiry n-1 AppUser |

## Phần 2 — DBML cho dbdiagram.io

Dán toàn bộ block dưới vào dbdiagram.io. File riêng: `FE/docs/database/sqlserver/AURA_SQLSERVER.dbml`. DBML minh họa quan hệ/index; không chạy thay SQL thực tế. Filtered index, cột computed, collation, CHECK và trigger do EF/T-SQL quyết định.

```dbml
Project AuraSqlServer {
  database_type: 'MSSQL'
  Note: 'SQL Server 2022. Full CHECKs, filtered indexes, computed LineTotal and triggers live in EF/SQL, not fully represented here. All timestamps UTC.'
}

Table Category {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  Code varchar(60) [not null]
  Name nvarchar(120) [not null]
  Domain varchar(16) [not null]
  DisplayOrder int [not null, default: 0]
  IsActive bit [not null, default: true]
  Version rowversion [not null]
  indexes {
    (Id, Domain) [unique]
    (Code) [unique]
    (Domain, DisplayOrder)
  }
  Note: 'Phân loại máy pha, máy xay, hạt, siro...; 1-n Product.'
}

Table Brand {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  Code varchar(60) [not null]
  Name nvarchar(120) [not null]
  IsActive bit [not null, default: true]
  Version rowversion [not null]
  indexes {
    (Code) [unique]
    (Name) [unique]
  }
  Note: 'Thương hiệu danh mục, không phải nhà cung cấp.'
}

Table UseCase {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  Code varchar(40) [not null]
  Name nvarchar(120) [not null]
  Description nvarchar(500) [null]
  DisplayOrder int [not null, default: 0]
  IsActive bit [not null, default: true]
  Version rowversion [not null]
  indexes {
    (Code) [unique]
  }
  Note: 'Nhu cầu sử dụng: home, small-cafe...; n-n Product qua ProductUseCase.'
}

Table Product {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  LegacyId varchar(100) [null]
  Slug varchar(160) [not null]
  Sku varchar(60) [null]
  Name nvarchar(250) [not null]
  CategoryId uniqueidentifier [not null]
  Domain varchar(16) [not null]
  BrandId uniqueidentifier [not null]
  ShortDescription nvarchar(2000) [not null]
  PriceMode varchar(12) [not null]
  Price decimal(18,0) [null]
  IsAvailableForOrder bit [not null]
  IsPublished bit [not null, default: false]
  IsFeatured bit [not null, default: false]
  LeadTimeNotice nvarchar(300) [null]
  ArchivedAt datetime2(3) [null]
  UpdatedAt datetime2(3) [null]
  Version rowversion [not null]
  GroupsCount int [null]
  Boiler nvarchar(200) [null]
  BoilerCapacity nvarchar(120) [null]
  Pump nvarchar(150) [null]
  PowerLabel nvarchar(100) [null]
  Voltage varchar(16) [null]
  Dimensions nvarchar(120) [null]
  WeightLabel nvarchar(80) [null]
  Warranty nvarchar(200) [null]
  DailyCapacityLabel nvarchar(150) [null]
  Origin nvarchar(150) [null]
  SubRegion nvarchar(150) [null]
  Altitude nvarchar(100) [null]
  Process nvarchar(150) [null]
  RoastProfile varchar(20) [null]
  CuppingScore decimal(5,2) [null]
  FlavorNotesJson nvarchar(max) [null]
  UnitSize nvarchar(100) [null]
  CaseSize nvarchar(100) [null]
  ShelfLife nvarchar(150) [null]
  indexes {
    (Slug) [unique]
    (Sku) [unique, note: 'SQL Server filter: [Sku] IS NOT NULL']
    (LegacyId) [unique, note: 'SQL Server filter: [LegacyId] IS NOT NULL']
    (CategoryId, Price, Id) [note: 'SQL Server filter: [ArchivedAt] IS NULL AND [IsPublished] = 1']
    (BrandId, CategoryId)
    (Domain, IsFeatured, CreatedAt, Id) [note: 'SQL Server filter: [ArchivedAt] IS NULL AND [IsPublished] = 1; DESC mask: false,true,true,false']
    (CategoryId, Domain)
  }
  Note: 'Một bảng Product với discriminator và CHECK; NULL hợp lệ cho thông số không áp dụng. Domain khớp Category bằng FK ghép.'
}

Table ProductUseCase {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  ProductId uniqueidentifier [not null]
  UseCaseId uniqueidentifier [not null]
  indexes {
    (ProductId, UseCaseId) [unique]
    (UseCaseId, ProductId)
  }
  Note: 'Bảng nối n-n. Unique(ProductId,UseCaseId); không lặp hai thẻ nhu cầu cho cùng sản phẩm.'
}

Table ProductMedia {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  ProductId uniqueidentifier [not null]
  Url nvarchar(1000) [not null]
  AltText nvarchar(300) [null]
  Position int [not null]
  indexes {
    (ProductId, Position) [unique]
  }
  Note: 'Ảnh duy nhất tại Position=0 là cover; ảnh còn lại thứ tự 1,2...; không lặp cover ở Product.'
}

Table AppUser {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  IdentityIssuer varchar(100) [not null]
  IdentitySubject varchar(200) [not null]
  DisplayName nvarchar(150) [not null]
  Email nvarchar(254) [not null]
  Phone nvarchar(30) [null]
  AvatarUrl nvarchar(1000) [null]
  CustomerPersona varchar(20) [null]
  ShopName nvarchar(150) [null]
  DisabledAt datetime2(3) [null]
  Version rowversion [not null]
  indexes {
    (IdentityIssuer, IdentitySubject) [unique]
  }
  Note: 'Hồ sơ gắn identity đã xác thực; không lưu mật khẩu giả, địa chỉ hay quyền admin trong persona.'
}

Table Order {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  OrderCode varchar(32) [not null]
  CustomerId uniqueidentifier [not null]
  IdempotencyKey uniqueidentifier [not null]
  RequestHash varchar(64) [not null]
  Currency varchar(3) [not null]
  PreferredPaymentMethod varchar(12) [not null]
  RecipientName nvarchar(150) [not null]
  Phone nvarchar(30) [not null]
  Email nvarchar(254) [null]
  AddressLine nvarchar(400) [not null]
  Province nvarchar(120) [not null]
  District nvarchar(120) [null]
  DeliveryNote nvarchar(1000) [null]
  Subtotal decimal(18,0) [not null]
  DiscountTotal decimal(18,0) [not null]
  ShippingFee decimal(18,0) [not null]
  Total decimal(18,0) [not null]
  TaxIncludedAmount decimal(18,0) [null]
  SubmittedAt datetime2(3) [null]
  Version rowversion [not null]
  indexes {
    (OrderCode) [unique]
    (CustomerId, IdempotencyKey) [unique]
    (CustomerId, CreatedAt, Id) [note: 'DESC mask: false,true,false']
  }
  Note: 'Đơn chốt bất biến cả header và shipping; draft nội bộ chỉ trong transaction. Tổng giá gồm VAT theo hợp đồng hiển thị hiện tại. Trigger/procedure guarded; DBML does not enforce immutability.'
}

Table OrderItem {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  OrderId uniqueidentifier [not null]
  ProductId uniqueidentifier [not null]
  LineNumber int [not null]
  ProductName nvarchar(250) [not null]
  Sku varchar(60) [null]
  Specification nvarchar(1000) [null]
  UnitLabel nvarchar(100) [null]
  UnitPrice decimal(18,0) [not null]
  Quantity int [not null]
  DiscountAmount decimal(18,0) [not null]
  LineTotal decimal(18,0) [not null, note: 'Computed persisted: CONVERT(decimal(18,0), [UnitPrice] * [Quantity] - [DiscountAmount])']
  TaxIncludedAmount decimal(18,0) [null]
  indexes {
    (OrderId, LineNumber) [unique]
    (ProductId)
  }
  Note: 'Bản sao thương mại, không đọc giá/tên hiện tại khi xem hóa đơn. FK NO ACTION bảo vệ sản phẩm đã có lịch sử. Trigger/procedure guarded; DBML does not enforce immutability.'
}

Table OrderEvent {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  OrderId uniqueidentifier [not null]
  Sequence int [not null]
  Status varchar(20) [not null]
  ActorId uniqueidentifier [not null]
  Note nvarchar(1000) [null]
  indexes {
    (OrderId, Sequence) [unique]
    (Status, CreatedAt)
    (ActorId)
  }
  Note: 'Lịch sử trạng thái append-only; không sửa trạng thái cũ. Trigger/procedure guarded; DBML does not enforce immutability.'
}

Table PaymentAttempt {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  OrderId uniqueidentifier [not null]
  RequestedById uniqueidentifier [not null]
  IdempotencyKey uniqueidentifier [not null]
  Method varchar(12) [not null]
  RequestedAmount decimal(18,0) [not null]
  TransferReference varchar(100) [null]
  DestinationSnapshot nvarchar(1000) [null]
  ExpiresAt datetime2(3) [null]
  indexes {
    (Id, OrderId) [unique]
    (OrderId, IdempotencyKey) [unique]
    (TransferReference) [unique, note: 'SQL Server filter: [TransferReference] IS NOT NULL']
    (RequestedById)
  }
  Note: 'Yêu cầu thanh toán/đích chuyển khoản; không chứng minh tiền đã vào. Trigger/procedure guarded; DBML does not enforce immutability.'
}

Table PaymentAttemptEvent {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  PaymentAttemptId uniqueidentifier [not null]
  ActorId uniqueidentifier [not null]
  EventType varchar(24) [not null]
  Note nvarchar(1000) [null]
  indexes {
    (PaymentAttemptId, CreatedAt, Id)
    (ActorId)
  }
  Note: 'Log báo đã chuyển, thất bại, hết hạn; không cộng tiền vào doanh thu. Trigger/procedure guarded; DBML does not enforce immutability.'
}

Table PaymentEntry {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  OrderId uniqueidentifier [not null]
  PaymentAttemptId uniqueidentifier [not null]
  RecordedById uniqueidentifier [not null]
  IdempotencyKey uniqueidentifier [not null]
  Kind varchar(12) [not null]
  Amount decimal(18,0) [not null]
  ExternalSource varchar(80) [not null]
  ExternalReference varchar(160) [not null]
  OccurredAt datetime2(3) [not null]
  ReversesEntryId uniqueidentifier [null]
  Reason nvarchar(1000) [null]
  indexes {
    (IdempotencyKey) [unique]
    (ExternalSource, ExternalReference) [unique]
    (OrderId, CreatedAt, Id)
    (ReversesEntryId) [note: 'SQL Server filter: [ReversesEntryId] IS NOT NULL']
    (PaymentAttemptId, OrderId)
    (RecordedById)
  }
  Note: 'Tiền thực nhận/hoàn thực tế append-only; hoàn liên kết receipt, cùng đơn/attempt và không vượt receipt. Trigger/procedure guarded; DBML does not enforce immutability.'
}

Table NewsArticle {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  Slug varchar(160) [not null]
  Title nvarchar(250) [not null]
  Excerpt nvarchar(2000) [not null]
  CategoryCode varchar(30) [not null]
  PublishedAt datetime2(3) [null]
  CoverImageUrl nvarchar(1000) [not null]
  AuthorName nvarchar(150) [not null]
  AuthorRole nvarchar(200) [not null]
  AuthorAvatarUrl nvarchar(1000) [null]
  ReadTimeMinutes int [not null]
  TagsJson nvarchar(max) [not null, default: '[]']
  LeadParagraph nvarchar(max) [not null]
  SectionsJson nvarchar(max) [not null]
  IsFeatured bit [not null, default: false]
  ArchivedAt datetime2(3) [null]
  Version rowversion [not null]
  indexes {
    (Slug) [unique]
    (CategoryCode, PublishedAt, Id) [note: 'SQL Server filter: [ArchivedAt] IS NULL AND [PublishedAt] IS NOT NULL; DESC mask: false,true,false']
  }
  Note: 'Author inline, tag JSON; phút đọc số cập nhật cùng nội dung; PublishedAt NULL là draft.'
}

Table ContactInquiry {
  Id uniqueidentifier [pk, not null, default: `NEWSEQUENTIALID()`]
  CreatedAt datetime2(3) [not null, default: `SYSUTCDATETIME()`]
  CustomerId uniqueidentifier [null]
  FullName nvarchar(150) [not null]
  Phone nvarchar(30) [not null]
  Email nvarchar(254) [not null]
  BusinessName nvarchar(150) [null]
  ServiceType varchar(30) [not null]
  BudgetRange varchar(30) [null]
  Message nvarchar(4000) [null]
  Source varchar(30) [not null]
  LegacyPackageCode varchar(100) [null]
  ConfigurationJson nvarchar(max) [null]
  Status varchar(20) [not null, default: 'new']
  Version rowversion [not null]
  indexes {
    (Status, CreatedAt)
    (CustomerId)
  }
  Note: 'Liên hệ, gói giải pháp/thuê và cấu hình dự toán; chưa là đơn có nghĩa vụ thanh toán.'
}

Ref: Product.(CategoryId, Domain) > Category.(Id, Domain) [delete: no action]
Ref: Product.BrandId > Brand.Id [delete: no action]
Ref: ProductUseCase.ProductId > Product.Id [delete: no action]
Ref: ProductUseCase.UseCaseId > UseCase.Id [delete: no action]
Ref: ProductMedia.ProductId > Product.Id [delete: no action]
Ref: Order.CustomerId > AppUser.Id [delete: no action]
Ref: OrderItem.OrderId > Order.Id [delete: no action]
Ref: OrderItem.ProductId > Product.Id [delete: no action]
Ref: OrderEvent.OrderId > Order.Id [delete: no action]
Ref: OrderEvent.ActorId > AppUser.Id [delete: no action]
Ref: PaymentAttempt.OrderId > Order.Id [delete: no action]
Ref: PaymentAttempt.RequestedById > AppUser.Id [delete: no action]
Ref: PaymentAttemptEvent.PaymentAttemptId > PaymentAttempt.Id [delete: no action]
Ref: PaymentAttemptEvent.ActorId > AppUser.Id [delete: no action]
Ref: PaymentEntry.OrderId > Order.Id [delete: no action]
Ref: PaymentEntry.(PaymentAttemptId, OrderId) > PaymentAttempt.(Id, OrderId) [delete: no action]
Ref: PaymentEntry.RecordedById > AppUser.Id [delete: no action]
Ref: PaymentEntry.ReversesEntryId > PaymentEntry.Id [delete: no action]
Ref: ContactInquiry.CustomerId > AppUser.Id [delete: no action]
```

## Phần 3 — Toàn bộ Entity C# kế thừa BaseEntity

File `BE/Aura.Persistence/Entities.cs`. BaseEntity chỉ là lớp dùng chung trong CLR; không tạo bảng BaseEntity hay TPH giữa tất cả entity. Các navigation dùng FK cấu hình ở phần 4. Public setter phục vụ EF không tự đảm bảo bất biến; SQL guard và quyền runtime mới thực thi quy tắc.

```csharp
// Generated from BE/design/generate-model.cjs.
namespace Aura.Persistence;

public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
}

public sealed class Category : BaseEntity
{
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Domain { get; set; } = null!;
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public byte[] Version { get; set; } = [];
}

public sealed class Brand : BaseEntity
{
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public bool IsActive { get; set; } = true;
    public byte[] Version { get; set; } = [];
}

public sealed class UseCase : BaseEntity
{
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public byte[] Version { get; set; } = [];
}

public sealed class Product : BaseEntity
{
    public string? LegacyId { get; set; }
    public string Slug { get; set; } = null!;
    public string? Sku { get; set; }
    public string Name { get; set; } = null!;
    public Guid CategoryId { get; set; }
    public string Domain { get; set; } = null!;
    public Guid BrandId { get; set; }
    public string ShortDescription { get; set; } = null!;
    public string PriceMode { get; set; } = null!;
    public decimal? Price { get; set; }
    public bool IsAvailableForOrder { get; set; }
    public bool IsPublished { get; set; } = false;
    public bool IsFeatured { get; set; } = false;
    public string? LeadTimeNotice { get; set; }
    public DateTime? ArchivedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public byte[] Version { get; set; } = [];
    public int? GroupsCount { get; set; }
    public string? Boiler { get; set; }
    public string? BoilerCapacity { get; set; }
    public string? Pump { get; set; }
    public string? PowerLabel { get; set; }
    public string? Voltage { get; set; }
    public string? Dimensions { get; set; }
    public string? WeightLabel { get; set; }
    public string? Warranty { get; set; }
    public string? DailyCapacityLabel { get; set; }
    public string? Origin { get; set; }
    public string? SubRegion { get; set; }
    public string? Altitude { get; set; }
    public string? Process { get; set; }
    public string? RoastProfile { get; set; }
    public decimal? CuppingScore { get; set; }
    public string? FlavorNotesJson { get; set; }
    public string? UnitSize { get; set; }
    public string? CaseSize { get; set; }
    public string? ShelfLife { get; set; }
    public Category Category { get; set; } = null!;
    public Brand Brand { get; set; } = null!;
}

public sealed class ProductUseCase : BaseEntity
{
    public Guid ProductId { get; set; }
    public Guid UseCaseId { get; set; }
    public Product Product { get; set; } = null!;
    public UseCase UseCase { get; set; } = null!;
}

public sealed class ProductMedia : BaseEntity
{
    public Guid ProductId { get; set; }
    public string Url { get; set; } = null!;
    public string? AltText { get; set; }
    public int Position { get; set; }
    public Product Product { get; set; } = null!;
}

public sealed class AppUser : BaseEntity
{
    public string IdentityIssuer { get; set; } = null!;
    public string IdentitySubject { get; set; } = null!;
    public string DisplayName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public string? CustomerPersona { get; set; }
    public string? ShopName { get; set; }
    public DateTime? DisabledAt { get; set; }
    public byte[] Version { get; set; } = [];
}

public sealed class Order : BaseEntity
{
    public string OrderCode { get; set; } = null!;
    public Guid CustomerId { get; set; }
    public Guid IdempotencyKey { get; set; }
    public string RequestHash { get; set; } = null!;
    public string Currency { get; set; } = null!;
    public string PreferredPaymentMethod { get; set; } = null!;
    public string RecipientName { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string? Email { get; set; }
    public string AddressLine { get; set; } = null!;
    public string Province { get; set; } = null!;
    public string? District { get; set; }
    public string? DeliveryNote { get; set; }
    public decimal Subtotal { get; set; }
    public decimal DiscountTotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }
    public decimal? TaxIncludedAmount { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public byte[] Version { get; set; } = [];
    public AppUser Customer { get; set; } = null!;
}

public sealed class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public int LineNumber { get; set; }
    public string ProductName { get; set; } = null!;
    public string? Sku { get; set; }
    public string? Specification { get; set; }
    public string? UnitLabel { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal LineTotal { get; private set; }
    public decimal? TaxIncludedAmount { get; set; }
    public Order Order { get; set; } = null!;
    public Product Product { get; set; } = null!;
}

public sealed class OrderEvent : BaseEntity
{
    public Guid OrderId { get; set; }
    public int Sequence { get; set; }
    public string Status { get; set; } = null!;
    public Guid ActorId { get; set; }
    public string? Note { get; set; }
    public Order Order { get; set; } = null!;
    public AppUser Actor { get; set; } = null!;
}

public sealed class PaymentAttempt : BaseEntity
{
    public Guid OrderId { get; set; }
    public Guid RequestedById { get; set; }
    public Guid IdempotencyKey { get; set; }
    public string Method { get; set; } = null!;
    public decimal RequestedAmount { get; set; }
    public string? TransferReference { get; set; }
    public string? DestinationSnapshot { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public Order Order { get; set; } = null!;
    public AppUser RequestedBy { get; set; } = null!;
}

public sealed class PaymentAttemptEvent : BaseEntity
{
    public Guid PaymentAttemptId { get; set; }
    public Guid ActorId { get; set; }
    public string EventType { get; set; } = null!;
    public string? Note { get; set; }
    public PaymentAttempt PaymentAttempt { get; set; } = null!;
    public AppUser Actor { get; set; } = null!;
}

public sealed class PaymentEntry : BaseEntity
{
    public Guid OrderId { get; set; }
    public Guid PaymentAttemptId { get; set; }
    public Guid RecordedById { get; set; }
    public Guid IdempotencyKey { get; set; }
    public string Kind { get; set; } = null!;
    public decimal Amount { get; set; }
    public string ExternalSource { get; set; } = null!;
    public string ExternalReference { get; set; } = null!;
    public DateTime OccurredAt { get; set; }
    public Guid? ReversesEntryId { get; set; }
    public string? Reason { get; set; }
    public Order Order { get; set; } = null!;
    public PaymentAttempt PaymentAttempt { get; set; } = null!;
    public AppUser RecordedBy { get; set; } = null!;
    public PaymentEntry? ReversesEntry { get; set; }
}

public sealed class NewsArticle : BaseEntity
{
    public string Slug { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Excerpt { get; set; } = null!;
    public string CategoryCode { get; set; } = null!;
    public DateTime? PublishedAt { get; set; }
    public string CoverImageUrl { get; set; } = null!;
    public string AuthorName { get; set; } = null!;
    public string AuthorRole { get; set; } = null!;
    public string? AuthorAvatarUrl { get; set; }
    public int ReadTimeMinutes { get; set; }
    public string TagsJson { get; set; } = "[]";
    public string LeadParagraph { get; set; } = null!;
    public string SectionsJson { get; set; } = null!;
    public bool IsFeatured { get; set; } = false;
    public DateTime? ArchivedAt { get; set; }
    public byte[] Version { get; set; } = [];
}

public sealed class ContactInquiry : BaseEntity
{
    public Guid? CustomerId { get; set; }
    public string FullName { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? BusinessName { get; set; }
    public string ServiceType { get; set; } = null!;
    public string? BudgetRange { get; set; }
    public string? Message { get; set; }
    public string Source { get; set; } = null!;
    public string? LegacyPackageCode { get; set; }
    public string? ConfigurationJson { get; set; }
    public string Status { get; set; } = "new";
    public byte[] Version { get; set; } = [];
    public AppUser? Customer { get; set; }
}
```

## Phần 4 — Fluent API đầy đủ trong OnModelCreating

File `BE/Aura.Persistence/AuraDbContext.cs`. Bao gồm index phục vụ FK mà EF thường tự tạo; chúng được khai báo tường minh để đồng bộ DBML. Dùng filter cho unique SKU/LegacyId nullable theo SQL Server. Không có cascade delete.

```csharp
// Generated from BE/design/generate-model.cjs.
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aura.Persistence;

public sealed class AuraDbContext(DbContextOptions<AuraDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categorys => Set<Category>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<UseCase> UseCases => Set<UseCase>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductUseCase> ProductUseCases => Set<ProductUseCase>();
    public DbSet<ProductMedia> ProductMedias => Set<ProductMedia>();
    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderEvent> OrderEvents => Set<OrderEvent>();
    public DbSet<PaymentAttempt> PaymentAttempts => Set<PaymentAttempt>();
    public DbSet<PaymentAttemptEvent> PaymentAttemptEvents => Set<PaymentAttemptEvent>();
    public DbSet<PaymentEntry> PaymentEntrys => Set<PaymentEntry>();
    public DbSet<NewsArticle> NewsArticles => Set<NewsArticle>();
    public DbSet<ContactInquiry> ContactInquirys => Set<ContactInquiry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("dbo");
        modelBuilder.UseCollation("Vietnamese_100_CI_AI");

        modelBuilder.Entity<Category>(b =>
        {
            Base(b);
            b.ToTable("Category", t =>
            {
                t.HasCheckConstraint("CK_Category_Domain", "[Domain] IN ('equipment','ingredients')");
                t.HasCheckConstraint("CK_Category_Code_NonBlank", "LEN(LTRIM(RTRIM([Code]))) > 0");
                t.HasCheckConstraint("CK_Category_Name_NonBlank", "LEN(LTRIM(RTRIM([Name]))) > 0");
            });
            b.Property(x => x.Code).HasColumnType("varchar(60)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Name).HasColumnType("nvarchar(120)").IsRequired();
            b.Property(x => x.Domain).HasColumnType("varchar(16)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.DisplayOrder).HasColumnType("int").IsRequired().HasDefaultValue(0);
            b.Property(x => x.IsActive).HasColumnType("bit").IsRequired().HasDefaultValue(true).HasSentinel(true);
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasAlternateKey(x => new { x.Id, x.Domain });
            b.HasIndex(x => x.Code).HasDatabaseName("IX_Category_Code").IsUnique();
            b.HasIndex(x => new { x.Domain, x.DisplayOrder }).HasDatabaseName("IX_Category_Domain_DisplayOrder");
        });

        modelBuilder.Entity<Brand>(b =>
        {
            Base(b);
            b.ToTable("Brand", t =>
            {
                t.HasCheckConstraint("CK_Brand_Code_NonBlank", "LEN(LTRIM(RTRIM([Code]))) > 0");
                t.HasCheckConstraint("CK_Brand_Name_NonBlank", "LEN(LTRIM(RTRIM([Name]))) > 0");
            });
            b.Property(x => x.Code).HasColumnType("varchar(60)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Name).HasColumnType("nvarchar(120)").IsRequired();
            b.Property(x => x.IsActive).HasColumnType("bit").IsRequired().HasDefaultValue(true).HasSentinel(true);
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasIndex(x => x.Code).HasDatabaseName("IX_Brand_Code").IsUnique();
            b.HasIndex(x => x.Name).HasDatabaseName("IX_Brand_Name").IsUnique();
        });

        modelBuilder.Entity<UseCase>(b =>
        {
            Base(b);
            b.ToTable("UseCase", t =>
            {
                t.HasCheckConstraint("CK_UseCase_Code_NonBlank", "LEN(LTRIM(RTRIM([Code]))) > 0");
                t.HasCheckConstraint("CK_UseCase_Name_NonBlank", "LEN(LTRIM(RTRIM([Name]))) > 0");
            });
            b.Property(x => x.Code).HasColumnType("varchar(40)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Name).HasColumnType("nvarchar(120)").IsRequired();
            b.Property(x => x.Description).HasColumnType("nvarchar(500)");
            b.Property(x => x.DisplayOrder).HasColumnType("int").IsRequired().HasDefaultValue(0);
            b.Property(x => x.IsActive).HasColumnType("bit").IsRequired().HasDefaultValue(true).HasSentinel(true);
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasIndex(x => x.Code).HasDatabaseName("IX_UseCase_Code").IsUnique();
        });

        modelBuilder.Entity<Product>(b =>
        {
            Base(b);
            b.ToTable("Product", t =>
            {
                t.HasCheckConstraint("CK_Product_Domain", "[Domain] IN ('equipment','ingredients')");
                t.HasCheckConstraint("CK_Product_PriceMode", "[PriceMode] IN ('fixed','from','contact')");
                t.HasCheckConstraint("CK_Product_PriceMode_Value", "([PriceMode] = 'contact' AND [Price] IS NULL) OR ([PriceMode] IN ('fixed','from') AND [Price] IS NOT NULL AND [Price] BETWEEN 0 AND 999999999999)");
                t.HasCheckConstraint("CK_Product_Slug_NonBlank", "LEN(LTRIM(RTRIM([Slug]))) > 0");
                t.HasCheckConstraint("CK_Product_Name_NonBlank", "LEN(LTRIM(RTRIM([Name]))) > 0");
                t.HasCheckConstraint("CK_Product_GroupsCount", "[GroupsCount] IS NULL OR [GroupsCount] > 0");
                t.HasCheckConstraint("CK_Product_Voltage", "[Voltage] IS NULL OR [Voltage] IN ('220V','380V','220V/380V')");
                t.HasCheckConstraint("CK_Product_CuppingScore", "[CuppingScore] IS NULL OR [CuppingScore] BETWEEN 0 AND 100");
                t.HasCheckConstraint("CK_Product_RoastProfile", "[RoastProfile] IS NULL OR [RoastProfile] IN ('Light','Medium','Medium-Dark','Dark')");
                t.HasCheckConstraint("CK_Product_FlavorNotesJson", "[FlavorNotesJson] IS NULL OR ISJSON([FlavorNotesJson], ARRAY) = 1");
                t.HasCheckConstraint("CK_Product_Subtype", "([Domain] = 'equipment' AND [Origin] IS NULL AND [SubRegion] IS NULL AND [Altitude] IS NULL AND [Process] IS NULL AND [RoastProfile] IS NULL AND [CuppingScore] IS NULL AND [FlavorNotesJson] IS NULL AND [UnitSize] IS NULL AND [CaseSize] IS NULL AND [ShelfLife] IS NULL) OR ([Domain] = 'ingredients' AND [GroupsCount] IS NULL AND [Boiler] IS NULL AND [BoilerCapacity] IS NULL AND [Pump] IS NULL AND [PowerLabel] IS NULL AND [Voltage] IS NULL AND [Dimensions] IS NULL AND [WeightLabel] IS NULL AND [Warranty] IS NULL AND [DailyCapacityLabel] IS NULL)");
                t.HasCheckConstraint("CK_Product_PublishedCompleteness", "[IsPublished] = 0 OR ([Domain] = 'equipment' AND [Warranty] IS NOT NULL AND LEN(LTRIM(RTRIM([Warranty]))) > 0) OR ([Domain] = 'ingredients' AND [UnitSize] IS NOT NULL AND LEN(LTRIM(RTRIM([UnitSize]))) > 0)");
            });
            b.Property(x => x.LegacyId).HasColumnType("varchar(100)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.Slug).HasColumnType("varchar(160)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Sku).HasColumnType("varchar(60)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.Name).HasColumnType("nvarchar(250)").IsRequired();
            b.Property(x => x.CategoryId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.Domain).HasColumnType("varchar(16)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.BrandId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.ShortDescription).HasColumnType("nvarchar(2000)").IsRequired();
            b.Property(x => x.PriceMode).HasColumnType("varchar(12)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Price).HasColumnType("decimal(18,0)");
            b.Property(x => x.IsAvailableForOrder).HasColumnType("bit").IsRequired();
            b.Property(x => x.IsPublished).HasColumnType("bit").IsRequired().HasDefaultValue(false);
            b.Property(x => x.IsFeatured).HasColumnType("bit").IsRequired().HasDefaultValue(false);
            b.Property(x => x.LeadTimeNotice).HasColumnType("nvarchar(300)");
            b.Property(x => x.ArchivedAt).HasColumnType("datetime2(3)");
            b.Property(x => x.UpdatedAt).HasColumnType("datetime2(3)");
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.Property(x => x.GroupsCount).HasColumnType("int");
            b.Property(x => x.Boiler).HasColumnType("nvarchar(200)");
            b.Property(x => x.BoilerCapacity).HasColumnType("nvarchar(120)");
            b.Property(x => x.Pump).HasColumnType("nvarchar(150)");
            b.Property(x => x.PowerLabel).HasColumnType("nvarchar(100)");
            b.Property(x => x.Voltage).HasColumnType("varchar(16)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.Dimensions).HasColumnType("nvarchar(120)");
            b.Property(x => x.WeightLabel).HasColumnType("nvarchar(80)");
            b.Property(x => x.Warranty).HasColumnType("nvarchar(200)");
            b.Property(x => x.DailyCapacityLabel).HasColumnType("nvarchar(150)");
            b.Property(x => x.Origin).HasColumnType("nvarchar(150)");
            b.Property(x => x.SubRegion).HasColumnType("nvarchar(150)");
            b.Property(x => x.Altitude).HasColumnType("nvarchar(100)");
            b.Property(x => x.Process).HasColumnType("nvarchar(150)");
            b.Property(x => x.RoastProfile).HasColumnType("varchar(20)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.CuppingScore).HasColumnType("decimal(5,2)");
            b.Property(x => x.FlavorNotesJson).HasColumnType("nvarchar(max)");
            b.Property(x => x.UnitSize).HasColumnType("nvarchar(100)");
            b.Property(x => x.CaseSize).HasColumnType("nvarchar(100)");
            b.Property(x => x.ShelfLife).HasColumnType("nvarchar(150)");
            b.HasIndex(x => x.Slug).HasDatabaseName("IX_Product_Slug").IsUnique();
            b.HasIndex(x => x.Sku).HasDatabaseName("IX_Product_Sku").IsUnique().HasFilter("[Sku] IS NOT NULL");
            b.HasIndex(x => x.LegacyId).HasDatabaseName("IX_Product_LegacyId").IsUnique().HasFilter("[LegacyId] IS NOT NULL");
            b.HasIndex(x => new { x.CategoryId, x.Price, x.Id }).HasDatabaseName("IX_Product_CategoryId_Price_Id").HasFilter("[ArchivedAt] IS NULL AND [IsPublished] = 1");
            b.HasIndex(x => new { x.BrandId, x.CategoryId }).HasDatabaseName("IX_Product_BrandId_CategoryId");
            b.HasIndex(x => new { x.Domain, x.IsFeatured, x.CreatedAt, x.Id }).HasDatabaseName("IX_Product_Domain_IsFeatured_CreatedAt_Id").HasFilter("[ArchivedAt] IS NULL AND [IsPublished] = 1").IsDescending(false, true, true, false);
            b.HasIndex(x => new { x.CategoryId, x.Domain }).HasDatabaseName("IX_Product_CategoryId_Domain");
            b.HasOne(x => x.Category).WithMany().HasForeignKey(x => new { x.CategoryId, x.Domain }).HasPrincipalKey(x => new { x.Id, x.Domain }).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.Brand).WithMany().HasForeignKey(x => x.BrandId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<ProductUseCase>(b =>
        {
            Base(b);
            b.ToTable("ProductUseCase", t =>
            {
            });
            b.Property(x => x.ProductId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.UseCaseId).HasColumnType("uniqueidentifier").IsRequired();
            b.HasIndex(x => new { x.ProductId, x.UseCaseId }).HasDatabaseName("IX_ProductUseCase_ProductId_UseCaseId").IsUnique();
            b.HasIndex(x => new { x.UseCaseId, x.ProductId }).HasDatabaseName("IX_ProductUseCase_UseCaseId_ProductId");
            b.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.UseCase).WithMany().HasForeignKey(x => x.UseCaseId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<ProductMedia>(b =>
        {
            Base(b);
            b.ToTable("ProductMedia", t =>
            {
                t.HasCheckConstraint("CK_ProductMedia_Position", "[Position] >= 0");
                t.HasCheckConstraint("CK_ProductMedia_Url_NonBlank", "LEN(LTRIM(RTRIM([Url]))) > 0");
            });
            b.Property(x => x.ProductId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.Url).HasColumnType("nvarchar(1000)").IsRequired();
            b.Property(x => x.AltText).HasColumnType("nvarchar(300)");
            b.Property(x => x.Position).HasColumnType("int").IsRequired();
            b.HasIndex(x => new { x.ProductId, x.Position }).HasDatabaseName("IX_ProductMedia_ProductId_Position").IsUnique();
            b.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<AppUser>(b =>
        {
            Base(b);
            b.ToTable("AppUser", t =>
            {
                t.HasCheckConstraint("CK_AppUser_IdentityIssuer_NonBlank", "LEN(LTRIM(RTRIM([IdentityIssuer]))) > 0");
                t.HasCheckConstraint("CK_AppUser_IdentitySubject_NonBlank", "LEN(LTRIM(RTRIM([IdentitySubject]))) > 0");
                t.HasCheckConstraint("CK_AppUser_DisplayName_NonBlank", "LEN(LTRIM(RTRIM([DisplayName]))) > 0");
                t.HasCheckConstraint("CK_AppUser_Email_NonBlank", "LEN(LTRIM(RTRIM([Email]))) > 0");
                t.HasCheckConstraint("CK_AppUser_CustomerPersona", "[CustomerPersona] IS NULL OR [CustomerPersona] IN ('owner','barista','guest')");
            });
            b.Property(x => x.IdentityIssuer).HasColumnType("varchar(100)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.IdentitySubject).HasColumnType("varchar(200)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.DisplayName).HasColumnType("nvarchar(150)").IsRequired();
            b.Property(x => x.Email).HasColumnType("nvarchar(254)").IsRequired();
            b.Property(x => x.Phone).HasColumnType("nvarchar(30)");
            b.Property(x => x.AvatarUrl).HasColumnType("nvarchar(1000)");
            b.Property(x => x.CustomerPersona).HasColumnType("varchar(20)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.ShopName).HasColumnType("nvarchar(150)");
            b.Property(x => x.DisabledAt).HasColumnType("datetime2(3)");
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasIndex(x => new { x.IdentityIssuer, x.IdentitySubject }).HasDatabaseName("IX_AppUser_IdentityIssuer_IdentitySubject").IsUnique();
        });

        modelBuilder.Entity<Order>(b =>
        {
            Base(b);
            b.ToTable("Order", t =>
            {
                t.UseSqlOutputClause(false); // SQL triggers are installed by 002_integrity.sql.
                t.HasCheckConstraint("CK_Order_OrderCode_NonBlank", "LEN(LTRIM(RTRIM([OrderCode]))) > 0");
                t.HasCheckConstraint("CK_Order_RecipientName_NonBlank", "LEN(LTRIM(RTRIM([RecipientName]))) > 0");
                t.HasCheckConstraint("CK_Order_Phone_NonBlank", "LEN(LTRIM(RTRIM([Phone]))) > 0");
                t.HasCheckConstraint("CK_Order_AddressLine_NonBlank", "LEN(LTRIM(RTRIM([AddressLine]))) > 0");
                t.HasCheckConstraint("CK_Order_Province_NonBlank", "LEN(LTRIM(RTRIM([Province]))) > 0");
                t.HasCheckConstraint("CK_Order_RequestHash", "LEN([RequestHash]) = 64");
                t.HasCheckConstraint("CK_Order_Currency", "[Currency] = 'VND'");
                t.HasCheckConstraint("CK_Order_PreferredPaymentMethod", "[PreferredPaymentMethod] IN ('vietqr','cod')");
                t.HasCheckConstraint("CK_Order_Amounts", "[Subtotal] >= 0 AND [DiscountTotal] BETWEEN 0 AND [Subtotal] AND [ShippingFee] >= 0 AND [Total] = [Subtotal] - [DiscountTotal] + [ShippingFee] AND ([TaxIncludedAmount] IS NULL OR [TaxIncludedAmount] BETWEEN 0 AND [Total])");
            });
            b.Property(x => x.OrderCode).HasColumnType("varchar(32)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.CustomerId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.IdempotencyKey).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.RequestHash).HasColumnType("varchar(64)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Currency).HasColumnType("varchar(3)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.PreferredPaymentMethod).HasColumnType("varchar(12)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.RecipientName).HasColumnType("nvarchar(150)").IsRequired();
            b.Property(x => x.Phone).HasColumnType("nvarchar(30)").IsRequired();
            b.Property(x => x.Email).HasColumnType("nvarchar(254)");
            b.Property(x => x.AddressLine).HasColumnType("nvarchar(400)").IsRequired();
            b.Property(x => x.Province).HasColumnType("nvarchar(120)").IsRequired();
            b.Property(x => x.District).HasColumnType("nvarchar(120)");
            b.Property(x => x.DeliveryNote).HasColumnType("nvarchar(1000)");
            b.Property(x => x.Subtotal).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.DiscountTotal).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.ShippingFee).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.Total).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.TaxIncludedAmount).HasColumnType("decimal(18,0)");
            b.Property(x => x.SubmittedAt).HasColumnType("datetime2(3)");
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasIndex(x => x.OrderCode).HasDatabaseName("IX_Order_OrderCode").IsUnique();
            b.HasIndex(x => new { x.CustomerId, x.IdempotencyKey }).HasDatabaseName("IX_Order_CustomerId_IdempotencyKey").IsUnique();
            b.HasIndex(x => new { x.CustomerId, x.CreatedAt, x.Id }).HasDatabaseName("IX_Order_CustomerId_CreatedAt_Id").IsDescending(false, true, false);
            b.HasOne(x => x.Customer).WithMany().HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<OrderItem>(b =>
        {
            Base(b);
            b.ToTable("OrderItem", t =>
            {
                t.UseSqlOutputClause(false); // SQL triggers are installed by 002_integrity.sql.
                t.HasCheckConstraint("CK_OrderItem_ProductName_NonBlank", "LEN(LTRIM(RTRIM([ProductName]))) > 0");
                t.HasCheckConstraint("CK_OrderItem_LineNumber", "[LineNumber] > 0");
                t.HasCheckConstraint("CK_OrderItem_Amounts", "[UnitPrice] BETWEEN 0 AND 999999999999 AND [Quantity] BETWEEN 1 AND 10000 AND [DiscountAmount] BETWEEN 0 AND [UnitPrice] * [Quantity] AND ([TaxIncludedAmount] IS NULL OR [TaxIncludedAmount] BETWEEN 0 AND [UnitPrice] * [Quantity] - [DiscountAmount])");
            });
            b.Property(x => x.OrderId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.ProductId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.LineNumber).HasColumnType("int").IsRequired();
            b.Property(x => x.ProductName).HasColumnType("nvarchar(250)").IsRequired();
            b.Property(x => x.Sku).HasColumnType("varchar(60)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.Specification).HasColumnType("nvarchar(1000)");
            b.Property(x => x.UnitLabel).HasColumnType("nvarchar(100)");
            b.Property(x => x.UnitPrice).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.Quantity).HasColumnType("int").IsRequired();
            b.Property(x => x.DiscountAmount).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.LineTotal).HasColumnType("decimal(18,0)").IsRequired().HasComputedColumnSql("CONVERT(decimal(18,0), [UnitPrice] * [Quantity] - [DiscountAmount])", stored: true);
            b.Property(x => x.TaxIncludedAmount).HasColumnType("decimal(18,0)");
            b.HasIndex(x => new { x.OrderId, x.LineNumber }).HasDatabaseName("IX_OrderItem_OrderId_LineNumber").IsUnique();
            b.HasIndex(x => x.ProductId).HasDatabaseName("IX_OrderItem_ProductId");
            b.HasOne(x => x.Order).WithMany().HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<OrderEvent>(b =>
        {
            Base(b);
            b.ToTable("OrderEvent", t =>
            {
                t.UseSqlOutputClause(false); // SQL triggers are installed by 002_integrity.sql.
                t.HasCheckConstraint("CK_OrderEvent_Sequence", "[Sequence] > 0");
                t.HasCheckConstraint("CK_OrderEvent_Status", "[Status] IN ('submitted','confirmed','processing','dispatched','completed','cancelled')");
            });
            b.Property(x => x.OrderId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.Sequence).HasColumnType("int").IsRequired();
            b.Property(x => x.Status).HasColumnType("varchar(20)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.ActorId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.Note).HasColumnType("nvarchar(1000)");
            b.HasIndex(x => new { x.OrderId, x.Sequence }).HasDatabaseName("IX_OrderEvent_OrderId_Sequence").IsUnique();
            b.HasIndex(x => new { x.Status, x.CreatedAt }).HasDatabaseName("IX_OrderEvent_Status_CreatedAt");
            b.HasIndex(x => x.ActorId).HasDatabaseName("IX_OrderEvent_ActorId");
            b.HasOne(x => x.Order).WithMany().HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.Actor).WithMany().HasForeignKey(x => x.ActorId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<PaymentAttempt>(b =>
        {
            Base(b);
            b.ToTable("PaymentAttempt", t =>
            {
                t.UseSqlOutputClause(false); // SQL triggers are installed by 002_integrity.sql.
                t.HasCheckConstraint("CK_PaymentAttempt_Method", "[Method] IN ('vietqr','cod')");
                t.HasCheckConstraint("CK_PaymentAttempt_RequestedAmount", "[RequestedAmount] > 0");
                t.HasCheckConstraint("CK_PaymentAttempt_Transfer", "([Method] = 'cod' AND [TransferReference] IS NULL AND [DestinationSnapshot] IS NULL) OR ([Method] = 'vietqr' AND [TransferReference] IS NOT NULL AND LEN(LTRIM(RTRIM([TransferReference]))) > 0 AND [DestinationSnapshot] IS NOT NULL AND LEN(LTRIM(RTRIM([DestinationSnapshot]))) > 0)");
                t.HasCheckConstraint("CK_PaymentAttempt_Expiry", "[ExpiresAt] IS NULL OR [ExpiresAt] > [CreatedAt]");
            });
            b.Property(x => x.OrderId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.RequestedById).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.IdempotencyKey).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.Method).HasColumnType("varchar(12)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.RequestedAmount).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.TransferReference).HasColumnType("varchar(100)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.DestinationSnapshot).HasColumnType("nvarchar(1000)");
            b.Property(x => x.ExpiresAt).HasColumnType("datetime2(3)");
            b.HasAlternateKey(x => new { x.Id, x.OrderId });
            b.HasIndex(x => new { x.OrderId, x.IdempotencyKey }).HasDatabaseName("IX_PaymentAttempt_OrderId_IdempotencyKey").IsUnique();
            b.HasIndex(x => x.TransferReference).HasDatabaseName("IX_PaymentAttempt_TransferReference").IsUnique().HasFilter("[TransferReference] IS NOT NULL");
            b.HasIndex(x => x.RequestedById).HasDatabaseName("IX_PaymentAttempt_RequestedById");
            b.HasOne(x => x.Order).WithMany().HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.RequestedBy).WithMany().HasForeignKey(x => x.RequestedById).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<PaymentAttemptEvent>(b =>
        {
            Base(b);
            b.ToTable("PaymentAttemptEvent", t =>
            {
                t.UseSqlOutputClause(false); // SQL triggers are installed by 002_integrity.sql.
                t.HasCheckConstraint("CK_PaymentAttemptEvent_EventType", "[EventType] IN ('customer_reported','failed','expired','cancelled')");
            });
            b.Property(x => x.PaymentAttemptId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.ActorId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.EventType).HasColumnType("varchar(24)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Note).HasColumnType("nvarchar(1000)");
            b.HasIndex(x => new { x.PaymentAttemptId, x.CreatedAt, x.Id }).HasDatabaseName("IX_PaymentAttemptEvent_PaymentAttemptId_CreatedAt_Id");
            b.HasIndex(x => x.ActorId).HasDatabaseName("IX_PaymentAttemptEvent_ActorId");
            b.HasOne(x => x.PaymentAttempt).WithMany().HasForeignKey(x => x.PaymentAttemptId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.Actor).WithMany().HasForeignKey(x => x.ActorId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<PaymentEntry>(b =>
        {
            Base(b);
            b.ToTable("PaymentEntry", t =>
            {
                t.UseSqlOutputClause(false); // SQL triggers are installed by 002_integrity.sql.
                t.HasCheckConstraint("CK_PaymentEntry_Kind", "[Kind] IN ('receipt','refund')");
                t.HasCheckConstraint("CK_PaymentEntry_Amount", "[Amount] > 0");
                t.HasCheckConstraint("CK_PaymentEntry_ExternalSource_NonBlank", "LEN(LTRIM(RTRIM([ExternalSource]))) > 0");
                t.HasCheckConstraint("CK_PaymentEntry_ExternalReference_NonBlank", "LEN(LTRIM(RTRIM([ExternalReference]))) > 0");
                t.HasCheckConstraint("CK_PaymentEntry_Reversal", "([Kind] = 'receipt' AND [ReversesEntryId] IS NULL) OR ([Kind] = 'refund' AND [ReversesEntryId] IS NOT NULL AND [Reason] IS NOT NULL AND LEN(LTRIM(RTRIM([Reason]))) > 0)");
            });
            b.Property(x => x.OrderId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.PaymentAttemptId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.RecordedById).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.IdempotencyKey).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.Kind).HasColumnType("varchar(12)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Amount).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.ExternalSource).HasColumnType("varchar(80)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.ExternalReference).HasColumnType("varchar(160)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.OccurredAt).HasColumnType("datetime2(3)").IsRequired();
            b.Property(x => x.ReversesEntryId).HasColumnType("uniqueidentifier");
            b.Property(x => x.Reason).HasColumnType("nvarchar(1000)");
            b.HasIndex(x => x.IdempotencyKey).HasDatabaseName("IX_PaymentEntry_IdempotencyKey").IsUnique();
            b.HasIndex(x => new { x.ExternalSource, x.ExternalReference }).HasDatabaseName("IX_PaymentEntry_ExternalSource_ExternalReference").IsUnique();
            b.HasIndex(x => new { x.OrderId, x.CreatedAt, x.Id }).HasDatabaseName("IX_PaymentEntry_OrderId_CreatedAt_Id");
            b.HasIndex(x => x.ReversesEntryId).HasDatabaseName("IX_PaymentEntry_ReversesEntryId").HasFilter("[ReversesEntryId] IS NOT NULL");
            b.HasIndex(x => new { x.PaymentAttemptId, x.OrderId }).HasDatabaseName("IX_PaymentEntry_PaymentAttemptId_OrderId");
            b.HasIndex(x => x.RecordedById).HasDatabaseName("IX_PaymentEntry_RecordedById");
            b.HasOne(x => x.Order).WithMany().HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.PaymentAttempt).WithMany().HasForeignKey(x => new { x.PaymentAttemptId, x.OrderId }).HasPrincipalKey(x => new { x.Id, x.OrderId }).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.RecordedBy).WithMany().HasForeignKey(x => x.RecordedById).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.ReversesEntry).WithMany().HasForeignKey(x => x.ReversesEntryId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<NewsArticle>(b =>
        {
            Base(b);
            b.ToTable("NewsArticle", t =>
            {
                t.HasCheckConstraint("CK_NewsArticle_Slug_NonBlank", "LEN(LTRIM(RTRIM([Slug]))) > 0");
                t.HasCheckConstraint("CK_NewsArticle_Title_NonBlank", "LEN(LTRIM(RTRIM([Title]))) > 0");
                t.HasCheckConstraint("CK_NewsArticle_CategoryCode", "[CategoryCode] IN ('new-products','market-trends','barista-tech')");
                t.HasCheckConstraint("CK_NewsArticle_ReadTime", "[ReadTimeMinutes] > 0");
                t.HasCheckConstraint("CK_NewsArticle_TagsJson", "[TagsJson] IS NULL OR ISJSON([TagsJson], ARRAY) = 1");
                t.HasCheckConstraint("CK_NewsArticle_SectionsJson", "[SectionsJson] IS NULL OR ISJSON([SectionsJson], ARRAY) = 1");
            });
            b.Property(x => x.Slug).HasColumnType("varchar(160)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Title).HasColumnType("nvarchar(250)").IsRequired();
            b.Property(x => x.Excerpt).HasColumnType("nvarchar(2000)").IsRequired();
            b.Property(x => x.CategoryCode).HasColumnType("varchar(30)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.PublishedAt).HasColumnType("datetime2(3)");
            b.Property(x => x.CoverImageUrl).HasColumnType("nvarchar(1000)").IsRequired();
            b.Property(x => x.AuthorName).HasColumnType("nvarchar(150)").IsRequired();
            b.Property(x => x.AuthorRole).HasColumnType("nvarchar(200)").IsRequired();
            b.Property(x => x.AuthorAvatarUrl).HasColumnType("nvarchar(1000)");
            b.Property(x => x.ReadTimeMinutes).HasColumnType("int").IsRequired();
            b.Property(x => x.TagsJson).HasColumnType("nvarchar(max)").IsRequired().HasDefaultValue("[]");
            b.Property(x => x.LeadParagraph).HasColumnType("nvarchar(max)").IsRequired();
            b.Property(x => x.SectionsJson).HasColumnType("nvarchar(max)").IsRequired();
            b.Property(x => x.IsFeatured).HasColumnType("bit").IsRequired().HasDefaultValue(false);
            b.Property(x => x.ArchivedAt).HasColumnType("datetime2(3)");
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasIndex(x => x.Slug).HasDatabaseName("IX_NewsArticle_Slug").IsUnique();
            b.HasIndex(x => new { x.CategoryCode, x.PublishedAt, x.Id }).HasDatabaseName("IX_NewsArticle_CategoryCode_PublishedAt_Id").HasFilter("[ArchivedAt] IS NULL AND [PublishedAt] IS NOT NULL").IsDescending(false, true, false);
        });

        modelBuilder.Entity<ContactInquiry>(b =>
        {
            Base(b);
            b.ToTable("ContactInquiry", t =>
            {
                t.HasCheckConstraint("CK_ContactInquiry_FullName_NonBlank", "LEN(LTRIM(RTRIM([FullName]))) > 0");
                t.HasCheckConstraint("CK_ContactInquiry_Phone_NonBlank", "LEN(LTRIM(RTRIM([Phone]))) > 0");
                t.HasCheckConstraint("CK_ContactInquiry_Email_NonBlank", "LEN(LTRIM(RTRIM([Email]))) > 0");
                t.HasCheckConstraint("CK_ContactInquiry_ServiceType", "[ServiceType] IN ('full-setup','equipment','coffee-beans','bar-training')");
                t.HasCheckConstraint("CK_ContactInquiry_Source", "[Source] IN ('contact','solution-package','project-builder','product-quote')");
                t.HasCheckConstraint("CK_ContactInquiry_Status", "[Status] IN ('new','contacted','closed')");
                t.HasCheckConstraint("CK_ContactInquiry_ConfigurationJson", "[ConfigurationJson] IS NULL OR ISJSON([ConfigurationJson], OBJECT) = 1");
            });
            b.Property(x => x.CustomerId).HasColumnType("uniqueidentifier");
            b.Property(x => x.FullName).HasColumnType("nvarchar(150)").IsRequired();
            b.Property(x => x.Phone).HasColumnType("nvarchar(30)").IsRequired();
            b.Property(x => x.Email).HasColumnType("nvarchar(254)").IsRequired();
            b.Property(x => x.BusinessName).HasColumnType("nvarchar(150)");
            b.Property(x => x.ServiceType).HasColumnType("varchar(30)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.BudgetRange).HasColumnType("varchar(30)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.Message).HasColumnType("nvarchar(4000)");
            b.Property(x => x.Source).HasColumnType("varchar(30)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.LegacyPackageCode).HasColumnType("varchar(100)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.ConfigurationJson).HasColumnType("nvarchar(max)");
            b.Property(x => x.Status).HasColumnType("varchar(20)").UseCollation("Latin1_General_100_BIN2").IsRequired().HasDefaultValue("new");
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasIndex(x => new { x.Status, x.CreatedAt }).HasDatabaseName("IX_ContactInquiry_Status_CreatedAt");
            b.HasIndex(x => x.CustomerId).HasDatabaseName("IX_ContactInquiry_CustomerId");
            b.HasOne(x => x.Customer).WithMany().HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.NoAction);
        });
    }

    private static void Base<T>(EntityTypeBuilder<T> b) where T : BaseEntity
    {
        // BaseEntity is a CLR reuse type, not a mapped inheritance hierarchy.
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
        b.Property(x => x.CreatedAt).HasColumnType("datetime2(3)")
            .HasDefaultValueSql("SYSUTCDATETIME()").IsRequired();
    }
}
```

Đăng ký DI trong BE ASP.NET Core sau này:

```csharp
builder.Services.AddDbContext<AuraDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Aura")));
```

Chưa tạo migrations trong gói này. DDL `BE/sql/001_schema.sql` được sinh từ model. Phải chạy tiếp `002_integrity.sql` và `003_commands.sql`; chỉ HasCheckConstraint/UseSqlOutputClause(false) không tạo cơ chế append-only. Không dùng EnsureCreated cho production. Khi dùng EF migrations, đưa các trigger/procedure/view/role vào migration được review, tách batch GO trước ExecuteSqlRaw hoặc migrationBuilder.Sql.

## Phần 5 — Docker Compose và volume

File `BE/docker-compose.yml`:

```yaml
name: aura-local
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_PID: Developer
      MSSQL_SA_PASSWORD: ${MSSQL_SA_PASSWORD:?Set MSSQL_SA_PASSWORD in BE/.env}
    ports:
      - "127.0.0.1:${MSSQL_PORT:-14333}:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "SQLCMDPASSWORD=\"$$MSSQL_SA_PASSWORD\" /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -b -l 3 -Q 'SELECT 1' -o /dev/null"]
      interval: 10s
      timeout: 5s
      retries: 12
      start_period: 40s
volumes:
  sqlserver_data:
```

File `.env.example` (copy thành `.env` rồi thay mật khẩu):

```dotenv
# Replace with a unique local password before docker compose up.
# Single quotes prevent Compose interpolation of $ in your chosen password.
MSSQL_SA_PASSWORD='REPLACE_WITH_YOUR_OWN_STRONG_PASSWORD'
MSSQL_PORT=14333
```


Cài Docker Desktop, chọn Linux containers; yêu cầu máy x86-64 và đủ RAM cho SQL Server.

```powershell
cd 'D:\WebCF(VanDung)\BE'
Copy-Item .env.example .env
# Tự sửa mật khẩu mạnh trong .env, không commit file này.
docker compose up -d
docker compose ps
# Chờ trạng thái healthy, sau đó:
.\Initialize-LocalDatabase.ps1
```

Script chỉ tạo database mới; từ chối chạy đè database có sẵn. Nếu một bước lỗi, không dùng database khởi tạo dở cho BE. Kiểm tra và áp dụng migration được review; script không tự xóa dữ liệu.

Kết nối từ máy host: `Server=localhost,14333;Database=AuraCoffee;User Id=<app-login>;Password=<secret>;Encrypt=True;TrustServerCertificate=True`.
BE cùng mạng Compose sau này dùng `Server=sqlserver,1433`, không dùng localhost. Chỉ development mới dùng chứng chỉ tự ký với TrustServerCertificate. Cấu hình secret qua environment/secret store.

Volume `sqlserver_data` giữ dữ liệu khi container bị tạo lại. `docker compose down` giữ volume; `down -v` xóa volume và dữ liệu. Volume không thay thế backup. Developer edition chỉ dành development/test. Pin image theo CU/digest khi cần build tái lập.

SA chỉ dùng bootstrap. Tạo login/user riêng rồi gán `aura_runtime`; không gán db_owner/db_ddladmin và không dùng SA cho BE. Role runtime có quyền đọc và gọi riêng các command tài chính; quyền sửa catalog/contact/user cấp theo từng chức năng BE sau này. Chưa có authentication API hay staff authorization trong gói này.

## Build và kiểm tra

Đích: .NET 10 + EF Core 10.0.5 (version pin của bản thiết kế; cập nhật patch cùng major sau khi test).

```powershell
dotnet restore Aura.ModelCheck/Aura.ModelCheck.csproj --configfile NuGet.Config
dotnet run --project Aura.ModelCheck/Aura.ModelCheck.csproj -- sql/001_schema.sql
```

`Aura.ModelCheck` không mở kết nối database: kiểm tra metadata, sinh DDL và parse T-SQL theo SQL Server 2022. Để tạo migration trong BE thực tế, thêm EF Design/tool đúng version và tích hợp nội dung `002_integrity.sql`, `003_commands.sql` vào migration bằng từng batch (không gửi `GO` qua SqlCommand). `UseSqlOutputClause(false)` chỉ giúp EF tương thích trigger, không tự tạo trigger. Không triển khai chỉ mỗi `001_schema.sql` hoặc `EnsureCreated()` rồi gọi đó là đã bảo vệ tài chính.

Máy tạo bản thiết kế chỉ có .NET 9.0.315. Đã build/check thành công bằng override:

```powershell
dotnet restore Aura.ModelCheck/Aura.ModelCheck.csproj --configfile NuGet.Config -p:DesignTargetFramework=net9.0 -p:EfCoreVersion=9.0.14
dotnet run --project Aura.ModelCheck/Aura.ModelCheck.csproj -p:DesignTargetFramework=net9.0 -p:EfCoreVersion=9.0.14 -- sql/001_schema.sql
```

Chưa build bằng SDK 10; chưa chạy integration/concurrency trên SQL Server vì Docker Engine chưa chạy. DDL đi kèm sinh từ metadata EF 9.0.14 của cùng mapping; cần chạy lại bằng đích EF 10 trước khi chốt migration production.


## Kiểm chứng và điều kiện trước khi triển khai

- Đã build C# trên SDK 9.0.315 / EF 9.0.14: không lỗi. Đây là kiểm tra tương thích; chưa build đích .NET 10/EF 10.
- ModelCheck: 15 bảng độc lập, PK BaseEntity, FK NO ACTION, LineTotal computed và OUTPUT tắt cho bảng có trigger đều đạt; đã sinh DDL.
- Parser TSql160 của Microsoft: schema, guards, commands, lookup và query examples hợp lệ cú pháp SQL Server 2022. Parser không kiểm tra binding/runtime, quyền thực tế hay isolation.
- DBML đã parse thành công bằng @dbml/core. Docker Compose đã qua `config --quiet`; cảnh báo quyền đọc cấu hình Docker cá nhân không làm validation thất bại. PowerShell bootstrap đã kiểm tra cú pháp.
- Docker Engine chưa chạy, nên chưa tạo database/volume hay chạy trigger thực tế; không có số đo hiệu năng hoặc thử đồng thời.

Các thử nghiệm bắt buộc tiếp theo trên SQL Server 2022 dùng database test riêng:

| Ca kiểm tra | Kết quả cần có |
|---|---|
| Product equipment tham chiếu Category ingredients | FK từ chối |
| PriceMode contact với price=0; JSON object trong TagsJson | CHECK từ chối |
| Nullable SKU ở nhiều draft, SKU có giá trị trùng | NULL hợp lệ; giá trị trùng bị unique chặn |
| Máy có home + small-cafe, filter useCase=home | Trả máy một lần, kèm specs/cover |
| Submit request gửi giá giả/legacy ID/unavailable/from | Không tin giá khách; từ chối ID/eligibility sai |
| Retry cùng order idempotency key / cùng key khác payload | Trả đúng đơn cũ / báo conflict |
| Trigger thử sửa đơn đã chốt, thêm/sửa/xóa dòng sau chốt | Từ chối cả khi dùng SQL trực tiếp |
| Draft rỗng hoặc tổng header không khớp lines khi seal | Từ chối; transaction không tạo đơn nửa vời |
| Receipt 10 triệu + receipt 20 triệu, refund 5 triệu | NetReceived=25 triệu, giữ nguyên hai receipt |
| Refund sang receipt của đơn/attempt khác | Từ chối |
| Hai session cùng hoàn 7 triệu từ receipt 10 triệu | Tối đa một lệnh thành công; không vượt 10 triệu |
| Chứng từ ngân hàng/cash voucher trùng, retry khác idempotency | Unique ngăn ghi tiền hai lần |
| Runtime role UPDATE/DELETE trực tiếp hoặc ExecuteUpdate EF | DENY/trigger chặn; procedure được cấp riêng vẫn chạy |
| Customer gọi API đối soát; code-only đọc đơn người khác | BE authorization từ chối (chưa có API trong gói này) |
| Hai actor chuyển trạng thái cùng ExpectedSequence | Một thành công; một conflict |
| Restart/recreate container cùng named volume | Dữ liệu còn nguyên; thử backup/restore độc lập |

Không dùng kết quả static validation làm bằng chứng đã đạt các integration test trên. Cần quyết định thêm tax/invoice/adjustment và quy trình sửa địa chỉ sau chốt trước vận hành thực tế.

## Tài liệu kỹ thuật chính thức đã đối chiếu

- [SQL Server Docker, công cụ sqlcmd và môi trường](https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-ver17).
- [EF SQL Server: OUTPUT với trigger](https://learn.microsoft.com/en-us/ef/core/providers/sql-server/misc). Mapping tắt OUTPUT trên các bảng có trigger.
- [EF SQL Server: GUID, default và rowversion](https://learn.microsoft.com/en-us/ef/core/providers/sql-server/value-generation).
- [SQL Server CREATE TRIGGER](https://learn.microsoft.com/en-us/sql/t-sql/statements/create-trigger-transact-sql?view=sql-server-ver17).
- [DBML syntax](https://dbml.dbdiagram.io/docs/).
- [.NET 10 LTS](https://devblogs.microsoft.com/dotnet/announcing-dotnet-10/).

**Trạng thái: đã cung cấp đầy đủ 5 phần và bộ mã thiết kế có kiểm tra tĩnh; chưa chứng nhận production hoặc triển khai vào frontend.**

