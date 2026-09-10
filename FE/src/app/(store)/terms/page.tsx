import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast } from '@/components/shared';
import { SiteFooter } from '@/components/store';
import { FileText, AlertCircle, ShoppingBag, ShieldCheck, Scale, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Điều Khoản Dịch Vụ | Aura Coffee Solutions',
  description: 'Quy định và điều khoản sử dụng dịch vụ, đặt hàng thiết bị và nguyên liệu cà phê tại Aura Coffee Solutions.',
};

export default function TermsPage() {
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
              Điều Khoản Dịch Vụ
            </span>
          </nav>

          {/* Header */}
          <header className="pb-10 mb-12 border-b border-[var(--cream-shadow)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-[var(--copper-accent)]" />
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[var(--copper-accent)]">
                Văn Bản Pháp Lý & Quy Định
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-[var(--espresso-ink)] font-normal mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Điều Khoản & Điều Kiện Dịch Vụ
            </h1>
            <p className="text-sm md:text-base text-[var(--espresso-mid)] font-light leading-relaxed max-w-2xl">
              Chào mừng quý khách đến với Aura Coffee Solutions. Khi truy cập trang web, tra cứu cấu hình kỹ thuật hoặc tạo yêu cầu đặt hàng thiết bị và hạt specialty, quý khách đồng ý tuân thủ các điều khoản dưới đây.
            </p>
          </header>

          {/* Content Body */}
          <article className="space-y-12 text-sm sm:text-base text-[var(--espresso-mid)] font-light leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <FileText size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  1. Phạm Vi Dịch Vụ
                </h2>
              </div>
              <p>
                Aura Coffee Solutions cung cấp nền tảng số giới thiệu giải pháp quầy bar thương mại, thông số kỹ thuật máy pha, máy xay, máy rang cà phê cao cấp và danh mục nguyên liệu hạt specialty. Website hỗ trợ khách hàng lên dự toán, thêm vào giỏ hàng và gửi yêu cầu đặt hàng tới bộ phận kinh doanh.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <ShoppingBag size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  2. Thông Tin Sản Phẩm & Giá Niêm Yết B2B
                </h2>
              </div>
              <p>
                Các hình ảnh, thông số kỹ thuật (công suất nồi hơi, hệ thống PID, độ mịn xay, điểm cupping SCA) được tổng hợp trực tiếp từ tài liệu kiểm định của nhà sản xuất và phòng thử nghiệm Aura Quality Lab.
              </p>
              <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-xs sm:text-sm text-[var(--espresso-mid)]">
                <strong className="text-[var(--espresso-ink)] block mb-1">Quy định báo giá và thuế:</strong>
                [BUSINESS DECISION REQUIRED: Quy định niêm yết giá B2B, tính hiệu lực của báo giá theo hợp đồng dự án và chính sách xuất hóa đơn VAT đang chờ doanh nghiệp xác nhận].
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
                  3. Quy Trình Tiếp Nhận & Xác Nhận Đơn Hàng
                </h2>
              </div>
              <p>
                Đơn hàng quý khách tạo lập trên website đóng vai trò là <strong>yêu cầu đặt hàng</strong>. Hợp đồng mua bán chỉ chính thức phát sinh hiệu lực sau khi nhân viên kinh doanh của Aura Coffee Solutions liên hệ xác thực tồn kho, điều kiện địa điểm lắp đặt và thỏa thuận phương thức thanh toán chuyển khoản / COD.
              </p>
              <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-xs sm:text-sm text-[var(--espresso-mid)]">
                <strong className="text-[var(--espresso-ink)] block mb-1">Thời hạn hủy đơn hoặc điều chỉnh đơn hàng:</strong>
                [BUSINESS DECISION REQUIRED: Khung thời gian tối đa khách hàng được phép yêu cầu điều chỉnh hoặc hủy đơn trước khi hàng rời khỏi kho đang chờ doanh nghiệp xác nhận].
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
                  4. Quyền Sở Hữu Trí Tuệ
                </h2>
              </div>
              <p>
                Toàn bộ nhãn hiệu, logo "Aura Coffee Solutions", hình ảnh thiết bị chụp thực tế, bài viết kỹ thuật và thiết kế giao diện thuộc quyền sở hữu trí tuệ của Aura Coffee Solutions hoặc các thương hiệu đối tác được cấp phép. Nghiêm cấm mọi hành vi sao chép nhằm mục đích thương mại mà không có văn bản chấp thuận trước.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <Scale size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  5. Trách Nhiệm Khách Hàng & Giới Hạn Trách Nhiệm
                </h2>
              </div>
              <p>
                Khách hàng chịu trách nhiệm cung cấp thông tin liên hệ, vị trí lắp đặt nguồn nước/nguồn điện chính xác khi mua thiết bị công nghiệp.
              </p>
              <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-xs sm:text-sm text-[var(--espresso-mid)]">
                <strong className="text-[var(--espresso-ink)] block mb-1">Giới hạn trách nhiệm pháp lý và bảo hành:</strong>
                [BUSINESS DECISION REQUIRED: Các điều khoản giới hạn trách nhiệm đối với trường hợp bất khả kháng, nguồn điện lưới không ổn định và thời hạn bảo hành thiết bị chính hãng đang chờ doanh nghiệp xác nhận].
              </div>
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
                  6. Thông Tin Hỗ Trợ & Pháp Lý
                </h2>
              </div>
              <p>
                Mọi thắc mắc về điều khoản dịch vụ hoặc hợp đồng cung ứng máy pha dự án, quý khách vui lòng liên hệ:
              </p>
              <div className="p-5 rounded-xl bg-[var(--cream-deep)]/50 border border-[var(--cream-shadow)] space-y-2">
                <p className="font-medium text-[var(--espresso-ink)]">Aura Coffee Solutions</p>
                <p>Hồ Chí Minh, Việt Nam</p>
                <p>Hotline tư vấn: <strong className="text-[var(--espresso-ink)]">0909 000 247</strong></p>
                <p>Email liên hệ: <strong className="text-[var(--espresso-ink)]">hello@auracoffee.vn</strong></p>
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
