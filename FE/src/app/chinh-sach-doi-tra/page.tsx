import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast } from '@/components/shared';
import { SiteFooter } from '@/components/store';
import { RefreshCw, CheckCircle2, AlertCircle, Wrench, DollarSign, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính Sách Đổi Trả & Hoàn Tiền | Aura Coffee Solutions',
  description: 'Quy định về đổi trả sản phẩm, kiểm định lỗi kỹ thuật và xử lý khiếu nại tại Aura Coffee Solutions.',
};

export default function ChinhSachDoiTraPage() {
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
              Chính Sách Đổi Trả
            </span>
          </nav>

          {/* Header */}
          <header className="pb-10 mb-12 border-b border-[var(--cream-shadow)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-[var(--copper-accent)]" />
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[var(--copper-accent)]">
                Dịch Vụ Hậu Mãi & Bảo Vệ Khách Hàng
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-[var(--espresso-ink)] font-normal mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Chính Sách Đổi Trả & Hoàn Tiền
            </h1>
            <p className="text-sm md:text-base text-[var(--espresso-mid)] font-light leading-relaxed max-w-2xl">
              Nhằm đảm bảo quyền lợi tối đa cho các chủ quán, chuỗi thương hiệu và barista, Aura Coffee Solutions thiết lập quy trình kiểm định và tiếp nhận đổi trả sản phẩm minh bạch.
            </p>
          </header>

          {/* Content Body */}
          <article className="space-y-12 text-sm sm:text-base text-[var(--espresso-mid)] font-light leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  1. Các Trường Hợp Được Áp Dụng Đổi Trả
                </h2>
              </div>
              <p>
                Quý khách có thể yêu cầu đổi trả hoặc kiểm tra lại thiết bị trong các trường hợp sau:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--espresso-ink)]">
                <li>Sản phẩm giao không đúng chủng loại, model, màu sắc hoặc thiếu phụ kiện tiêu chuẩn so với đơn hàng đã xác nhận.</li>
                <li>Thiết bị máy pha, máy xay phát sinh lỗi kỹ thuật do quá trình chế tạo cơ khí hoặc cấu kiện điện tử, được kỹ sư Aura xác nhận qua biên bản nghiệm thu.</li>
                <li>Kiện hàng bị móp méo, vỡ hỏng thân vỏ hoặc rách niêm phong do quá trình vận chuyển (yêu cầu có biên bản đồng kiểm ghi nhận lúc nhận hàng).</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <RefreshCw size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  2. Điều Kiện Tiếp Nhận Sản Phẩm Đổi Trả
                </h2>
              </div>
              <p>
                Đối với máy móc thiết bị: Sản phẩm phải còn nguyên vẹn tem bảo hành, số serial trùng khớp với hóa đơn bàn giao, đầy đủ thùng gỗ pallet, tài liệu hướng dẫn và linh kiện kèm theo.
              </p>
              <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-xs sm:text-sm text-[var(--espresso-mid)]">
                <strong className="text-[var(--espresso-ink)] block mb-1">Quy định đổi trả đối với hạt cà phê & nguyên liệu:</strong>
                [BUSINESS DECISION REQUIRED: Quy chuẩn đổi trả đối với hạt specialty (yêu cầu bao bì nguyên đai nguyên kiện túi van hay có chính sách hỗ trợ thử mẫu cảm quan) đang chờ doanh nghiệp xác nhận].
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
                  3. Thời Hạn Gửi Yêu Cầu Đổi Trả
                </h2>
              </div>
              <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-xs sm:text-sm text-[var(--espresso-mid)]">
                <strong className="text-[var(--espresso-ink)] block mb-1">Khung thời gian tiếp nhận:</strong>
                [BUSINESS DECISION REQUIRED: Thời hạn tối đa khách hàng được gửi yêu cầu đổi trả kể từ ngày nhận hàng (ví dụ: số ngày quy định cho thiết bị máy móc và số ngày quy định cho nguyên liệu cà phê) đang chờ doanh nghiệp xác nhận].
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <Wrench size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  4. Quy Trình Tiếp Nhận & Phí Vận Chuyển Đổi Trả
                </h2>
              </div>
              <ol className="list-decimal pl-6 space-y-2 text-[var(--espresso-ink)]">
                <li><strong>Liên hệ yêu cầu:</strong> Quý khách gọi đến hotline 0909 000 247 hoặc gửi email kèm hình ảnh/video mô tả tình trạng sản phẩm.</li>
                <li><strong>Kiểm định ban đầu:</strong> Kỹ thuật viên Aura tiến hành hướng dẫn kiểm tra cấu hình hoặc điều phối nhân viên đến hiện trường.</li>
                <li><strong>Bàn giao hàng đổi trả:</strong> Tiến hành niêm phong đóng gói kiện hàng về trung tâm kỹ thuật Aura.</li>
              </ol>
              <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-xs sm:text-sm text-[var(--espresso-mid)]">
                <strong className="text-[var(--espresso-ink)] block mb-1">Trách nhiệm chi trả chi phí vận chuyển đổi hàng:</strong>
                [BUSINESS DECISION REQUIRED: Trách nhiệm chi trả phí vận chuyển hai chiều khi đổi hàng trong từng trường hợp cụ thể (lỗi nhà sản xuất hay nhu cầu thay đổi của khách hàng) đang chờ doanh nghiệp xác nhận].
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <DollarSign size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  5. Phương Thức & Thời Gian Hoàn Tiền
                </h2>
              </div>
              <p>
                Trường hợp hai bên đồng thuận giải pháp hoàn tiền sau khi sản phẩm lỗi đã được thu hồi và đối soát kho bãi đầy đủ:
              </p>
              <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-xs sm:text-sm text-[var(--espresso-mid)]">
                <strong className="text-[var(--espresso-ink)] block mb-1">Thời gian và phương thức hoàn tiền:</strong>
                [BUSINESS DECISION REQUIRED: Khung thời gian hoàn tiền và phương thức chuyển khoản đối soát tài khoản doanh nghiệp sau khi hàng được hoàn nhập kho đang chờ xác nhận].
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
                  6. Hotline Hỗ Trợ Đổi Trả Kỹ Thuật
                </h2>
              </div>
              <p>
                Đội ngũ kỹ sư và chuyên viên chăm sóc khách hàng luôn túc trực để hỗ trợ xử lý khiếu nại nhanh chóng:
              </p>
              <div className="p-5 rounded-xl bg-[var(--cream-deep)]/50 border border-[var(--cream-shadow)] space-y-2">
                <p className="font-medium text-[var(--espresso-ink)]">Aura Technical Service Center</p>
                <p>Hotline khẩn cấp: <strong className="text-[var(--espresso-ink)]">0909 000 247</strong></p>
                <p>Email tiếp nhận biên bản: <strong className="text-[var(--espresso-ink)]">hello@auracoffee.vn</strong></p>
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
