import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast } from '@/components/shared';
import { SiteFooter } from '@/components/store';
import { Truck, PackageCheck, AlertCircle, Clock, ShieldCheck, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính Sách Vận Chuyển & Giao Nhận | Aura Coffee Solutions',
  description: 'Chính sách vận chuyển, biểu phí và quy trình giao nhận thiết bị máy pha và hạt cà phê tại Aura Coffee Solutions.',
};

export default function ChinhSachVanChuyenPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream-base)]">
      <Navbar />

      <div className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--espresso-light)] mb-8">
            <Link href="/" className="hover:text-[var(--espresso-ink)] transition-colors">
              Trang Chủ
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--espresso-ink)] font-medium" aria-current="page">
              Chính Sách Vận Chuyển
            </span>
          </nav>

          {/* Header */}
          <header className="pb-10 mb-12 border-b border-[var(--cream-shadow)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-[var(--copper-accent)]" />
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[var(--copper-accent)]">
                Vận Tải & Điều Phối Hàng Hóa
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-[var(--espresso-ink)] font-normal mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Chính Sách Vận Chuyển & Giao Nhận
            </h1>
            <p className="text-sm md:text-base text-[var(--espresso-mid)] font-light leading-relaxed max-w-2xl">
              Quy chuẩn đóng gói bảo hộ cơ khí cao cấp và quy trình điều phối thiết bị máy pha, máy xay cùng các mẻ hạt specialty đến quầy bar của quý khách trên toàn quốc.
            </p>
          </header>

          {/* Content Body */}
          <article className="space-y-12 text-sm sm:text-base text-[var(--espresso-mid)] font-light leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <Truck size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  1. Phạm Vi Cung Cấp Dịch Vụ Vận Chuyển
                </h2>
              </div>
              <p>
                Aura Coffee Solutions cung ứng giải pháp điều phối hàng hóa trên phạm vi toàn lãnh thổ Việt Nam, áp dụng cho cả hai danh mục:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--espresso-ink)]">
                <li><strong>Thiết bị quầy bar công nghiệp:</strong> Máy pha espresso 1-3 group, máy xay cà phê on-demand / specialty, máy rang mẫu và dụng cụ barista.</li>
                <li><strong>Nguyên liệu specialty coffee:</strong> Hạt cà phê mộc chất lượng cao, siro 1883 nhập khẩu, sốt và bột pha chế cao cấp.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <Clock size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  2. Thời Gian Giao Hàng Dự Kiến
                </h2>
              </div>
              <p>
                Thời gian giao hàng phụ thuộc vào vị trí địa lý của cơ sở quán và tình trạng sẵn sàng của mẻ rang hoặc cấu hình thiết bị:
              </p>
              <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-xs sm:text-sm text-[var(--espresso-mid)]">
                <strong className="text-[var(--espresso-ink)] block mb-1">Khung thời gian giao hàng cụ thể:</strong>
                [BUSINESS DECISION REQUIRED: Khung thời gian giao hàng chuẩn đối với khu vực nội thành TP. Hồ Chí Minh và các tỉnh thành liên tỉnh đang chờ doanh nghiệp xác nhận].
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <AlertCircle size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  3. Biểu Phí Giao Hàng & Chính Sách Hỗ Trợ
                </h2>
              </div>
              <p>
                Chi phí vận chuyển được tính toán dựa trên khối lượng thực tế, thể tích đóng gói kiện pallet và cự ly vận chuyển.
              </p>
              <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-xs sm:text-sm text-[var(--espresso-mid)]">
                <strong className="text-[var(--espresso-ink)] block mb-1">Biểu phí và hạn mức miễn phí vận chuyển:</strong>
                [BUSINESS DECISION REQUIRED: Biểu phí giao hàng cụ thể, phụ phí nâng hạ đối với máy pha 2-3 group cồng kềnh và giá trị đơn hàng tối thiểu được miễn phí vận chuyển đang chờ doanh nghiệp xác nhận].
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  4. Quy Chuẩn Đóng Gói Bảo Hộ Hàng Hóa
                </h2>
              </div>
              <p>
                Để hạn chế tối đa rủi ro xô lệch cơ khí hay ảnh hưởng chất lượng hạt:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--espresso-ink)]">
                <li><strong>Máy pha & Máy rang:</strong> Được neo cố định trên pallet gỗ chịu lực, bao bọc màng co PE đa lớp kèm xốp đệm góc chống va đập.</li>
                <li><strong>Hạt cà phê & Siro chai thủy tinh:</strong> Đóng trong thùng carton dập sóng dày dặn, chèn màng bóng khí bảo vệ và dán nhãn hàng dễ vỡ.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <PackageCheck size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  5. Trách Nhiệm Đồng Kiểm Khi Nhận Hàng
                </h2>
              </div>
              <p>
                Khách hàng được quyền và có trách nhiệm kiểm tra ngoại quan tình trạng niêm phong thùng hàng cùng nhân viên giao nhận trước khi ký nhận:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--espresso-ink)]">
                <li>Kiểm tra tính nguyên vẹn của tem niêm phong và đai kiện pallet.</li>
                <li>Nếu phát hiện kiện hàng bị rách thủng nghiêm trọng, ướt nước hoặc móp méo gây ảnh hưởng đến thiết bị bên trong, quý khách vui lòng từ chối nhận hàng, lập biên bản ghi nhận tại chỗ và liên hệ ngay với Aura Coffee Solutions.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4 pt-6 border-t border-[var(--cream-shadow)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <Phone size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  6. Điều Phối Vận Chuyển Khẩn Cấp
                </h2>
              </div>
              <p>
                Đối với nhu cầu giao máy khẩn cấp cho ngày khai trương quán hoặc giao bổ sung hạt gấp, xin liên hệ bộ phận Logistics:
              </p>
              <div className="p-5 rounded-xl bg-[var(--cream-deep)]/50 border border-[var(--cream-shadow)] space-y-2">
                <p className="font-medium text-[var(--espresso-ink)]">Aura Logistics & Dispatch Department</p>
                <p>Hotline điều phối: <strong className="text-[var(--espresso-ink)]">0909 000 247</strong></p>
                <p>Email hỗ trợ vận đơn: <strong className="text-[var(--espresso-ink)]">hello@auracoffee.vn</strong></p>
              </div>
            </section>
          </article>
        </div>
      </div>

      <SiteFooter />
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />
      <Toast />
    </main>
  );
}
