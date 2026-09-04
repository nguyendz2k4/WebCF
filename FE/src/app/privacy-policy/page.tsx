import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast } from '@/components/shared';
import { SiteFooter } from '@/components/store';
import { Shield, ArrowLeft, AlertCircle, Lock, Eye, Database, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật | Aura Coffee Solutions',
  description: 'Chính sách bảo mật thông tin khách hàng và quy chuẩn quản lý dữ liệu tại Aura Coffee Solutions.',
};

export default function PrivacyPolicyPage() {
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
              Chính Sách Bảo Mật
            </span>
          </nav>

          {/* Header */}
          <header className="pb-10 mb-12 border-b border-[var(--cream-shadow)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-[var(--copper-accent)]" />
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[var(--copper-accent)]">
                Văn Bản Pháp Lý & Chính Sách
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-[var(--espresso-ink)] font-normal mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Chính Sách Bảo Mật Thông Tin
            </h1>
            <p className="text-sm md:text-base text-[var(--espresso-mid)] font-light leading-relaxed max-w-2xl">
              Aura Coffee Solutions tôn trọng quyền riêng tư của quý khách hàng và cam kết bảo vệ dữ liệu cá nhân thu thập trong quá trình tư vấn giải pháp, đặt hàng thiết bị và cung ứng hạt specialty.
            </p>
          </header>

          {/* Content Body */}
          <article className="space-y-12 text-sm sm:text-base text-[var(--espresso-mid)] font-light leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <Database size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  1. Mục Đích & Thông Tin Thu Thập
                </h2>
              </div>
              <p>
                Khi quý khách tương tác với hệ thống website Aura Coffee Solutions, chúng tôi có thể thu thập các thông tin sau nhằm phục vụ nhu cầu xử lý đơn hàng và tư vấn:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--espresso-ink)]">
                <li>Họ tên người nhận hàng hoặc người đại diện doanh nghiệp.</li>
                <li>Số điện thoại liên hệ để xác nhận đơn và điều phối giao vận.</li>
                <li>Địa chỉ giao nhận thiết bị máy pha hoặc nguyên liệu cà phê.</li>
                <li>Tỉnh / Thành phố cư trú và ghi chú kỹ thuật quầy bar liên quan.</li>
              </ul>
              <p>
                Về mặt kỹ thuật, hệ thống sử dụng bộ nhớ cục bộ trình duyệt (localStorage) để lưu tạm thời danh sách sản phẩm trong giỏ hàng và dữ liệu phiên làm việc nhằm mang lại sự tiện ích liên tục khi quý khách duyệt danh mục sản phẩm.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <Eye size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  2. Mục Đích Sử Dụng Dữ Liệu
                </h2>
              </div>
              <p>
                Thông tin được thu thập chỉ phục vụ cho các mục đích vận hành kinh doanh hợp pháp:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--espresso-ink)]">
                <li>Gọi điện xác nhận yêu cầu đặt mua máy móc, nguyên liệu và đối soát chuyển khoản hoặc COD.</li>
                <li>Điều phối kỹ thuật viên đến khảo sát vị trí lắp đặt hoặc hướng dẫn căn chỉnh profile chiết xuất.</li>
                <li>Cung cấp thông tin bảo hành, kiểm định định kỳ và giải quyết khiếu nại kỹ thuật.</li>
              </ul>
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
                  3. Thời Gian Lưu Trữ Thông Tin
                </h2>
              </div>
              <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-xs sm:text-sm text-[var(--espresso-mid)]">
                <strong className="text-[var(--espresso-ink)] block mb-1">Quy định lưu trữ dữ liệu:</strong>
                [BUSINESS DECISION REQUIRED: Thời hạn lưu trữ dữ liệu cá nhân khách hàng trên hệ thống (ví dụ: thời gian duy trì hồ sơ bảo dưỡng thiết bị máy pha và dữ liệu khách hàng định kỳ) đang chờ doanh nghiệp xác nhận].
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <Lock size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  4. Chia Sẻ Thông Tin Với Bên Thứ Ba
                </h2>
              </div>
              <p>
                Để hoàn tất quy trình giao nhận đơn hàng, Aura Coffee Solutions có thể chuyển giao thông tin tên, số điện thoại và địa chỉ nhận hàng cho các đối tác vận tải hoặc bưu cục chuyển phát độc lập.
              </p>
              <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-xs sm:text-sm text-[var(--espresso-mid)]">
                <strong className="text-[var(--espresso-ink)] block mb-1">Cam kết về chia sẻ dữ liệu:</strong>
                [BUSINESS DECISION REQUIRED: Quy chuẩn chia sẻ hoặc không bán dữ liệu cho bên thứ ba và danh sách các đối tác tích hợp dịch vụ bên thứ ba đang chờ doanh nghiệp xác nhận].
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] shrink-0">
                  <Shield size={16} />
                </div>
                <h2
                  className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  5. Quyền Của Khách Hàng Đối Với Dữ Liệu
                </h2>
              </div>
              <p>
                Quý khách có quyền yêu cầu Aura Coffee Solutions trích xuất, điều chỉnh hoặc hủy bỏ thông tin cá nhân lưu trong hệ thống liên lạc phục vụ dịch vụ bằng cách gửi văn bản yêu cầu qua kênh hỗ trợ chính thức.
              </p>
              <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-xs sm:text-sm text-[var(--espresso-mid)]">
                <strong className="text-[var(--espresso-ink)] block mb-1">Chứng chỉ và biện pháp an ninh kỹ thuật:</strong>
                [BUSINESS DECISION REQUIRED: Các tiêu chuẩn kỹ thuật số và chứng chỉ an toàn thông tin chuyên sâu đang chờ doanh nghiệp xác nhận].
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
                  6. Đơn Vị Phụ Trách & Thông Tin Liên Hệ
                </h2>
              </div>
              <p>
                Mọi thắc mắc hoặc yêu cầu liên quan đến việc xử lý dữ liệu cá nhân, xin vui lòng liên hệ:
              </p>
              <div className="p-5 rounded-xl bg-[var(--cream-deep)]/50 border border-[var(--cream-shadow)] space-y-2">
                <p className="font-medium text-[var(--espresso-ink)]">Aura Coffee Solutions</p>
                <p>Địa chỉ: Hồ Chí Minh, Việt Nam</p>
                <p>Hotline tư vấn: <strong className="text-[var(--espresso-ink)]">0909 000 247</strong></p>
                <p>Email hỗ trợ: <strong className="text-[var(--espresso-ink)]">hello@auracoffee.vn</strong></p>
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
