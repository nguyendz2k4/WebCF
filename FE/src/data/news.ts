import { NewsArticle } from '@/types/news';

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-sanremo-racer-2026',
    slug: 'sanremo-cafe-racer-atelier-edition-2026',
    title: 'Sanremo Café Racer Atelier Edition 2026: Đỉnh Cao Độc Lập Nhiệt PID & Thiết Kế Thép AISI 316L',
    excerpt: 'Phiên bản giới hạn dành riêng cho các atelier rang xay và quầy bar specialty: nâng cấp công nghệ T3 PureBrew, gia nhiệt tức thời và lớp hoàn thiện vân đồng thủ công sang trọng.',
    category: 'new-products',
    categoryLabel: 'Sản Phẩm Mới',
    publishedAt: '28 Tháng 8, 2026',
    readTime: '4 phút đọc',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=85',
    author: {
      name: 'Nguyễn Thành Nam',
      role: 'Head of Technical Solutions, Aura',
    },
    featured: true,
    tags: ['Sanremo', 'Máy pha cà phê', 'Multi-Boiler', 'Thiết bị mới'],
    content: {
      leadParagraph:
        'Aura Coffee Solutions tự hào giới thiệu cỗ máy espresso đỉnh cao Sanremo Café Racer phiên bản Atelier 2026 — tác phẩm dung hòa giữa thẩm mỹ cơ khí tốc độ và kỹ nghệ kiểm soát nhiệt độ chiết xuất vi điểm.',
      sections: [
        {
          heading: 'Cuộc cách mạng về độ ổn định nhiệt độ chiết xuất',
          body: [
            'Trái tim của phiên bản Atelier 2026 là cụm nồi hơi kép bằng thép không gỉ y tế AISI 316L kết hợp vi xử lý PID thế hệ mới. Mức sai số nhiệt độ đã được triệt tiêu xuống dưới 0.1°C, ngay cả trong khung giờ cao điểm với tần suất hơn 300 tách mỗi buổi sáng.',
            'Mỗi group head vận hành như một phòng lab thu nhỏ: barista có thể tùy biến trước thời gian ủ (soft pre-infusion) từ 0 đến 12 giây, đồng thời theo dõi áp suất chiết xuất theo thời gian thực trên màn hình OLED tích hợp.',
          ],
          pullQuote:
            'Một ly espresso hoàn hảo không chỉ đến từ hạt cà phê tinh tuyển, mà bắt đầu từ 0.1°C ổn định của dòng nước chảy qua bột bánh.',
          keyPoints: [
            'Hệ thống nồi hơi độc lập hoàn toàn AISI 316L chống ăn mòn và bảo toàn hương vị tinh khiết',
            'Tự động ngắt pha chế dựa trên cân trọng lực Gravimetric chuẩn micro-gram',
            'Mặt hông ốp gỗ óc chó tự nhiên kết hợp khung đồng xước chế tác riêng',
          ],
        },
        {
          heading: 'Giải pháp đầu tư bền vững cho quán cà phê đặc sản',
          body: [
            'Bên cạnh năng lực chiết xuất vượt trội, dòng máy còn tích hợp công nghệ Smart Energy Saver giúp cắt giảm tới 35% lượng điện năng tiêu thụ trong giờ nghỉ. Đây là điểm mấu chốt giúp các chủ quán tối ưu chi phí vận hành hàng tháng.',
            'Hiện phiên bản Sanremo Café Racer Atelier Edition đã sẵn sàng trải nghiệm thực tế tại Showroom Aura Coffee Solutions tại TP.HCM và Hà Nội.',
          ],
          image: {
            url: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1200&auto=format&fit=crop&q=85',
            caption: 'Góc nhìn chi tiết group head và tay pha đồng thau nguyên khối của phiên bản Atelier Edition 2026.',
          },
        },
      ],
    },
  },
  {
    id: 'news-specialty-coffee-market-vietnam-2026',
    slug: 'bao-cao-thi-truong-specialty-coffee-viet-nam-2026',
    title: 'Báo Cáo Thị Trường Specialty Coffee Việt Nam 2026: Sự Trỗi Dậy Của Hạt Bản Địa Cao Cấp',
    excerpt: 'Phân tích dịch chuyển thói quen thưởng thức của khách hàng thế hệ mới: chuộng nguồn gốc hạt minh bạch, gu thưởng thức thanh nhã và sẵn sàng chi trả cao hơn cho trải nghiệm thủ công.',
    category: 'market-trends',
    categoryLabel: 'Thị Trường F&B',
    publishedAt: '24 Tháng 8, 2026',
    readTime: '6 phút đọc',
    coverImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&auto=format&fit=crop&q=85',
    author: {
      name: 'Lê Minh Quân',
      role: 'F&B Market Strategist',
    },
    featured: true,
    tags: ['Báo cáo thị trường', 'Specialty Coffee', 'Xu hướng F&B', 'Arabica Việt Nam'],
    content: {
      leadParagraph:
        'Thị trường đồ uống cà phê tại các đô thị lớn của Việt Nam đang bước vào giai đoạn tái cấu trúc mạnh mẽ, nơi chất lượng nguyên bản và câu chuyện xuất xứ của hạt cà phê thay thế các chiến lược tiếp thị đại trà.',
      sections: [
        {
          heading: 'Sự dịch chuyển từ Robusta truyền thống sang Fine Robusta & Specialty Arabica',
          body: [
            'Dữ liệu khảo sát độc lập từ 150 chuỗi và quán cà phê độc lập tại Hà Nội, Đà Nẵng và TP.HCM cho thấy mức tăng trưởng doanh số của phân khúc Specialty Coffee đạt 28.5% so với cùng kỳ năm trước.',
            'Đặc biệt, dòng Arabica Typica Cầu Đất sơ chế mật ong (Honey Process) và Fine Robusta Gia Lai lên men yếm khí đang dần khẳng định vị thế vững chắc trong menu của các boutique café hàng đầu.',
          ],
          pullQuote:
            'Khách hàng không còn tìm kiếm sự đậm đắng đơn thuần, họ tìm kiếm hương hoa nhài, hậu vị ngọt tự nhiên và câu chuyện của người nông dân vùng cao.',
          keyPoints: [
            '68% khách hàng trẻ tại đô thị quan tâm đến phương pháp sơ chế và độ cao canh tác hạt cà phê',
            'Giá bán trung bình cho mỗi tách specialty pour-over tăng từ 65.000đ lên 95.000đ - 120.000đ',
            'Mô hình tích hợp quầy rang vi mô (micro-roastery) tại quán tạo niềm tin và tỷ lệ khách quay lại vượt trội',
          ],
        },
        {
          heading: 'Lời khuyên cho các chủ đầu tư chuẩn bị mở quán trong năm 2026 - 2027',
          body: [
            'Để định vị thương hiệu thành công, các chủ quán nên đầu tư ngay từ đầu vào hệ thống nguồn hạt có chứng chỉ xuất xứ rõ ràng và thiết bị bảo quản ổn định nhiệt ẩm.',
            'Sự đồng bộ giữa triết lý của quán, kỹ năng của đội ngũ barista và chất lượng ly cà phê phục vụ chính là chìa khóa duy nhất để giữ chân tệp khách hàng trung thành cao cấp.',
          ],
          image: {
            url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=1200&auto=format&fit=crop&q=85',
            caption: 'Nguồn hạt Arabica Cầu Đất chất lượng cao được tuyển lựa khắt khe tại nông trại liên kết của Aura.',
          },
        },
      ],
    },
  },
  {
    id: 'news-brew-ratio-cau-dat-honey',
    slug: 'nghe-thuat-chiet-xuat-brew-ratio-arabica-cau-dat',
    title: 'Nghệ Thuật Căn Chỉnh Tỷ Lệ Chiết Xuất (Brew Ratio) Cho Arabica Cầu Đất Sơ Chế Mật Ong',
    excerpt: 'Hướng dẫn chuẩn hóa quy trình chiết xuất espresso với hạt sơ chế mật ong: công thức cân bằng acid malic sáng trong và hậu vị ngọt sâu lắng caramel.',
    category: 'barista-tech',
    categoryLabel: 'Kỹ Thuật & Barista',
    publishedAt: '19 Tháng 8, 2026',
    readTime: '5 phút đọc',
    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=85',
    author: {
      name: 'Trần Vũ Hoàng',
      role: 'Master Trainer, Aura Academy',
    },
    featured: false,
    tags: ['Barista', 'Brew Ratio', 'Espresso', 'Kỹ thuật pha chế'],
    content: {
      leadParagraph:
        'Hạt Arabica Cầu Đất sơ chế mật ong vàng (Yellow Honey) mang trong mình lượng đường tự nhiên phong phú cùng tầng hương hoa trái phức hợp. Tuy nhiên, nếu áp dụng tỷ lệ chiết xuất mặc định 1:2, ly espresso rất dễ bị gắt hoặc mất đi tầng hương hoa tinh tế.',
      sections: [
        {
          heading: 'Tham số vàng: Tỷ lệ 1:2.2 và thời gian tiền ngâm tối ưu',
          body: [
            'Qua hơn 200 lần thử nếm mù (blind tasting) tại phòng lab Aura, chúng tôi khuyến nghị công thức tối ưu cho mẻ rang nhẹ (light-medium roast) của hạt Cầu Đất mật ong:',
            'Liều lượng (Dose): 18.5g bột cà phê xay mịn đồng nhất trên máy xay Mahlkönig EK43S hoặc E65S GbW. Lượng chiết xuất (Yield): 41g espresso trong khoảng thời gian từ 27 đến 29 giây.',
          ],
          pullQuote:
            'Chiết xuất kéo dài thêm 2-3 gram chất lỏng giúp giải phóng trọn vẹn tầng hương quả mọng mận chín mà không làm xuất hiện vị đắng chát của vỏ hạt.',
          keyPoints: [
            'Nhiệt độ nước khuyến nghị: 93.5°C (không nên vượt quá 94°C để tránh cháy đường caramen)',
            'Áp suất chiết xuất: Bắt đầu ủ trước ở 3 bar trong 4 giây, sau đó duy trì 8.5 bar đều đặn',
            'TDS đo được lý tưởng: 9.8% - 10.2% mang lại cảm giác sánh êm (silky mouthfeel)',
          ],
        },
        {
          heading: 'Bảo quản bột và kiểm soát độ ẩm quầy bar',
          body: [
            'Độ ẩm không khí tại Việt Nam thường biến thiên mạnh giữa các thời điểm trong ngày. Barista cần kiểm tra dòng chảy cứ mỗi 2 giờ một lần và điều chỉnh nhẹ độ thô mịn (grind size) để bảo đảm sự đồng nhất tuyệt đối cho từng mẻ phục vụ.',
          ],
          image: {
            url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&auto=format&fit=crop&q=85',
            caption: 'Đo lường chiết xuất espresso chính xác với cân vi lượng và khúc xạ kế chuyên nghiệp.',
          },
        },
      ],
    },
  },
  {
    id: 'news-maison-routin-1883-spring-summer',
    slug: 'bo-suu-tap-siro-1883-maison-routin-vung-alps-phap',
    title: 'Bộ Sưu Tập Siro 1883 Maison Routin Tinh Khiết Từ Dãy Alps Nước Pháp Chính Thức Có Mặt',
    excerpt: 'Giải pháp nâng tầm menu đồ uống mùa mới với 100% đường mía nguyên chất và nguồn nước khoáng tự nhiên vùng núi tuyết, không biến đổi gen và không chất bảo quản nhân tạo.',
    category: 'new-products',
    categoryLabel: 'Sản Phẩm Mới',
    publishedAt: '15 Tháng 8, 2026',
    readTime: '3 phút đọc',
    coverImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200&auto=format&fit=crop&q=85',
    author: {
      name: 'Vũ Thùy Linh',
      role: 'Beverage R&D Specialist',
    },
    featured: false,
    tags: ['Siro 1883', 'Nguyên liệu pha chế', 'Maison Routin', 'Sản phẩm mới'],
    content: {
      leadParagraph:
        'Aura Coffee Solutions tiếp tục mở rộng hệ sinh thái nguyên liệu cao cấp với việc nhập khẩu chính ngạch dòng sản phẩm siro danh tiếng bậc nhất thế giới — 1883 Maison Routin sản xuất trực tiếp tại Chambéry, Pháp.',
      sections: [
        {
          heading: 'Nghệ thuật lưu giữ hương vị tự nhiên chân thực',
          body: [
            'Khác biệt hoàn toàn so với các loại siro công nghiệp dùng siro ngô giàu fructose (HFCS), 1883 Maison Routin chỉ sử dụng đường mía tinh chế và nguồn nước ngầm thanh khiết của dãy Alps.',
            'Nhờ vậy, khi kết hợp cùng cà phê cold brew, matcha hay sữa tươi cao cấp, siro 1883 không át đi hương vị nền mà đóng vai trò nâng đỡ, tạo chiều sâu và cấu trúc cân bằng cho ly đồ uống.',
          ],
          pullQuote:
            'Hương thơm thanh khiết của hoa quả tươi, độ ngọt thanh mát không để lại hậu vị nồng khét ở cuống họng.',
          keyPoints: [
            'Hơn 40 hương vị phong phú từ nhóm cổ điển (Vanilla, Caramel, Hazelnut) đến nhóm thảo mộc cao cấp',
            'Được tin dùng bởi các quán specialty café và khách sạn 5 sao trên toàn cầu',
            'Hỗ trợ công thức pha chế độc quyền dành riêng cho đối tác khách hàng của Aura',
          ],
        },
      ],
    },
  },
  {
    id: 'news-capex-opex-equipment-investment',
    slug: 'phan-tich-capex-va-opex-khi-dau-tu-may-pha-ca-phe',
    title: 'Bài Toán CAPEX & OPEX: Chiến Lược Đầu Tư Thiết Bị Cà Phê Hiệu Quả Cho Chuỗi F&B',
    excerpt: 'Phân tích tài chính chi tiết giúp chủ quán cân đối ngân sách đầu tư ban đầu và chi phí bảo dưỡng vận hành dài hạn, tránh bẫy mua máy giá rẻ nhưng chi phí sửa chữa khổng lồ.',
    category: 'market-trends',
    categoryLabel: 'Thị Trường F&B',
    publishedAt: '08 Tháng 8, 2026',
    readTime: '7 phút đọc',
    coverImage: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&auto=format&fit=crop&q=85',
    author: {
      name: 'Lê Minh Quân',
      role: 'F&B Market Strategist',
    },
    featured: false,
    tags: ['Quản lý F&B', 'Đầu tư thiết bị', 'CAPEX', 'Tài chính quán café'],
    content: {
      leadParagraph:
        'Khi lập kế hoạch tài chính mở quán cà phê, chi phí máy móc (CAPEX) thường chiếm từ 25% đến 40% tổng vốn đầu tư. Tuy nhiên, sai lầm phổ biến nhất của các nhà đầu tư mới là chỉ nhìn vào mức giá mua lúc đầu mà bỏ qua chi phí bảo trì và rủi ro gián đoạn doanh thu (OPEX).',
      sections: [
        {
          heading: 'Bẫy giá rẻ và chi phí chìm ngầm định kỳ',
          body: [
            'Các dòng máy không rõ xuất xứ hoặc công nghệ trao đổi nhiệt cũ (Heat Exchanger giá rẻ) thường có chi phí mua thấp hơn 30-40%. Nhưng sau 6 đến 9 tháng vận hành với cường độ cao, hiện tượng đóng cặn canxi, hỏng gioăng cao su và tụt áp suất diễn ra liên tục.',
            'Mỗi ngày dừng máy để sửa chữa đột xuất khiến quán thất thoát từ vài triệu đến hàng chục triệu đồng doanh thu, chưa kể gây thất vọng cho những khách hàng trung thành quen thuộc.',
          ],
          pullQuote:
            'Chi phí rẻ nhất của một chiếc máy pha cà phê là chi phí hoạt động bền bỉ suốt 5 năm không một ngày ngừng phục vụ.',
          keyPoints: [
            'So sánh khấu hao 3 năm giữa máy nồi hơi đơn và máy công nghệ đa nồi hơi PID kép',
            'Chính sách bảo hành định kỳ quý và đội kỹ thuật ứng cứu 24/7 giúp giảm 90% rủi ro ngừng máy',
            'Giá trị thanh lý còn lại của các thương hiệu hàng đầu như Sanremo, Mahlkönig luôn giữ ở mức trên 65% sau 3 năm',
          ],
        },
      ],
    },
  },
  {
    id: 'news-maintenance-group-head-solenoid-valve',
    slug: 'cam-nang-bao-duong-dinh-ky-group-head-va-van-dien-tu',
    title: 'Cẩm Nang Bảo Dưỡng Định Kỳ Group Head & Van Điện Từ: Giữ Trọn Độ Bền 10 Năm',
    excerpt: 'Quy trình 5 bước vệ sinh backflush cuối ngày, xả cặn định kỳ và kiểm tra áp suất bơm quay chuyên nghiệp được đúc kết từ đội ngũ kỹ sư 15 năm kinh nghiệm của Aura.',
    category: 'barista-tech',
    categoryLabel: 'Kỹ Thuật & Barista',
    publishedAt: '01 Tháng 8, 2026',
    readTime: '5 phút đọc',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=85',
    author: {
      name: 'Nguyễn Thành Nam',
      role: 'Head of Technical Solutions, Aura',
    },
    featured: false,
    tags: ['Bảo trì máy pha', 'Kỹ thuật', 'Group Head', 'Vận hành quán'],
    content: {
      leadParagraph:
        'Cụm họng pha (Group Head) và van điện từ 3 ngả (3-Way Solenoid Valve) là những bộ phận chịu áp lực cao nhất trong máy pha cà phê. Chỉ một lớp dầu cà phê cháy khét tồn đọng qua đêm cũng đủ làm hỏng vị của toàn bộ các tách cà phê ngày hôm sau.',
      sections: [
        {
          heading: 'Quy trình Backflush chuẩn hóa 5 phút mỗi tối',
          body: [
            'Bước 1: Sử dụng phin mù (blind filter) và bột vệ sinh chuyên dụng chuẩn NSF (như Cafiza hoặc Puly Caff).',
            'Bước 2: Kích hoạt bơm ngâm trong 10 giây, sau đó dừng 5 giây. Lặp lại chu trình này 5 lần để áp suất đẩy bọt tẩy rửa ngược vào buồng xả của van điện từ.',
            'Bước 3: Tháo tay pha, xả sạch cặn xà phòng bằng nước nóng tinh khiết từ nồi hơi rồi lặp lại thao tác tráng sạch.',
          ],
          pullQuote:
            'Một quầy bar sạch sẽ là lời tuyên ngôn chân thật nhất về sự tôn trọng dành cho từng vị khách và từng giọt cà phê.',
          keyPoints: [
            'Thay thế gioăng cao su họng pha định kỳ 6 tháng/lần để tránh rò rỉ áp suất',
            'Kiểm tra lưới lọc tán nước (shower screen) bằng mắt thường hàng tuần để đảm bảo nước chảy thành màng đều',
            'Đo độ cứng tổng thể của nguồn nước cấp (TDS 70-120 ppm) ngăn ngừa đóng cặn vôi nồi hơi',
          ],
        },
      ],
    },
  },
];

export const NEWS_CATEGORIES = [
  { id: 'all', label: 'Tất Cả' },
  { id: 'new-products', label: 'Sản Phẩm Mới' },
  { id: 'market-trends', label: 'Thị Trường F&B' },
  { id: 'barista-tech', label: 'Kỹ Thuật & Barista' },
] as const;
