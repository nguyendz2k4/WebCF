import { FaqItem, AtelierHub, ContactChannelInfo } from '@/types/contact';

export const CONTACT_CHANNELS: ContactChannelInfo = {
  hotline: 'tel:0909000247',
  hotlineDisplay: '0909 000 247',
  emailConcierge: 'contact@auracoffee.vn',
  emailB2b: 'b2b@auracoffee.vn',
  weekdayHours: 'Thứ Hai – Thứ Bảy: 08:30 – 18:00',
  weekendNote: 'Chủ Nhật: Tiếp nhận lịch hẹn demo riêng theo yêu cầu',
  slaResponseTime: '2 giờ làm việc',
  slaSurveyTime: '24 giờ tại TP.HCM',
};

export const ATELIER_HUBS: AtelierHub[] = [
  {
    id: 'hub-pasteur',
    name: 'Showroom Trải Nghiệm Máy & Studio Quầy Bar',
    address: '186 Pasteur, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    note: '* Trải nghiệm trực tiếp Sanremo Cafe Racer, Mahlkönig EK43S và Victoria Arduino.',
    isPrimary: true,
  },
  {
    id: 'hub-truongdinh',
    name: 'Xưởng Rang Specialty & Barista Training Lab',
    address: '42 Trương Định, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh',
    note: '* Nơi kiểm định chất lượng mẻ rang (Cupping Lab) và tổ chức các workshop đào tạo kỹ thuật.',
    isPrimary: false,
  },
];

export const CONTACT_FAQS: FaqItem[] = [
  {
    id: 'faq-demo',
    question: 'Tôi có thể mang hạt của quán đến showroom để thử chiết xuất trực tiếp trên máy không?',
    answer:
      'Hoàn toàn được. Aura khuyến khích quý đối tác mang theo profile hạt hoặc gu cà phê mong muốn đến Showroom 186 Pasteur. Chuyên viên kỹ thuật sẽ cùng bạn test chiết xuất thực tế trên các dòng máy đa nồi hơi Sanremo, Victoria Arduino và điều chỉnh kích thước hạt trên Mahlkönig EK43S để đánh giá chính xác hương vị.',
  },
  {
    id: 'faq-warranty',
    question: 'Chính sách bảo hành và ứng cứu sự cố kỹ thuật trong giờ quán hoạt động thế nào?',
    answer:
      'Aura áp dụng bảo hành chính hãng 24 tháng cho toàn bộ thiết bị nhập khẩu. Đặc biệt với dịch vụ ứng cứu khẩn cấp tại TP.HCM: Kỹ thuật viên có mặt trong vòng 2 – 4 giờ. Trong trường hợp cần sửa chữa chuyên sâu, Aura cung cấp máy back-up tương đương để đảm bảo hoạt động kinh doanh của quán không bị gián đoạn.',
  },
  {
    id: 'faq-sample',
    question: 'Aura có hỗ trợ gửi mẫu cà phê hạt đặc sản (Sample Cupping Kit) dùng thử không?',
    answer:
      'Có. Đối với các chủ quán hoặc quản lý F&B đang tìm kiếm nguồn cung hạt ổn định, chúng tôi gửi tặng Sample Kit gồm các profile rang dành riêng cho Espresso và Pour-over (Arabica Cầu Đất, Fine Robusta Gia Lai, Single Origin Ethiopia) kèm tài liệu cupping score chi tiết.',
  },
  {
    id: 'faq-layout',
    question: 'Thời gian khảo sát và thiết kế bản vẽ quầy bar (Bar Layout) mất bao lâu?',
    answer:
      'Trong vòng 24 – 48 giờ kể từ khi tiếp nhận thông tin mặt bằng, kiến trúc sư quầy bar của Aura sẽ cung cấp bản vẽ bố trí kỹ thuật: phân bổ vị trí máy theo công thái học (ergonomics), sơ đồ cấp thoát nước áp suất và hệ thống điện tải chuẩn an toàn.',
  },
  {
    id: 'faq-training',
    question: 'Aura có chính sách đào tạo Barista và chuyển giao công thức menu không?',
    answer:
      'Tất cả hợp đồng trọn gói thiết bị hoặc đối tác cung ứng cà phê dài hạn đều được tặng kèm khóa đào tạo Barista chuyên sâu tại Xưởng Rang Aura Lab: kiểm soát TDS chiết xuất, hiệu chỉnh cỡ xay theo nhiệt độ ngày, kỹ thuật đánh sữa microfoam và quy trình vệ sinh bảo dưỡng máy hàng ngày.',
  },
];
