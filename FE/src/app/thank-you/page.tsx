import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast } from '@/components/shared';
import { SiteFooter } from '@/components/store';
import { CheckCircle2, Clock, PhoneCall, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Xác Nhận Đặt Hàng | Aura Coffee Solutions',
  description: 'Trạng thái tiếp nhận đơn hàng tại Aura Coffee Solutions.',
  robots: {
    index: false,
    follow: false,
  },
};

interface ThankYouPageProps {
  searchParams: Promise<{
    orderId?: string;
    success?: string;
  }>;
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const { orderId } = await searchParams;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream-base)]">
      <Navbar />

      <div className="flex-1 pt-28 pb-16 flex items-center justify-center">
        {!orderId ? (
          /* Gating: Direct access or ?success=true without orderId */
          <div className="max-w-md mx-auto text-center py-16 px-4 space-y-5">
            <div className="w-14 h-14 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-[var(--espresso-light)] flex items-center justify-center mx-auto">
              <FileText size={24} />
            </div>
            <h1
              className="text-2xl sm:text-3xl text-[var(--espresso-ink)] font-normal"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Không Tìm Thấy Thông Tin Đơn Hàng
            </h1>
            <p className="text-xs sm:text-sm text-[var(--espresso-mid)] leading-relaxed font-light">
              Đường dẫn hiện tại không chứa mã đối soát đơn hàng hợp lệ. Quý khách vui lòng kiểm tra lại đơn hàng trong giỏ hoặc quay về trang chủ.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--espresso-ink)] text-[var(--cream-base)] hover:bg-[var(--espresso-mid)] transition-colors cursor-pointer"
              >
                <span>Về Trang Chủ</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          /* Truthful Order-Received View */
          <div className="max-w-xl mx-auto py-12 px-4 space-y-8 text-center animate-in fade-in duration-300">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-[var(--copper-accent)] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={32} />
            </div>

            {/* Header */}
            <div>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--espresso-light)] block mb-1">
                MÃ TIẾP NHẬN ĐƠN: #{orderId}
              </span>
              <h1
                className="text-3xl sm:text-4xl text-[var(--espresso-ink)] font-normal mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Đã Tiếp Nhận Yêu Cầu Đặt Hàng
              </h1>
              <p className="text-xs sm:text-sm text-[var(--espresso-mid)] leading-relaxed font-light max-w-lg mx-auto">
                Cảm ơn quý khách đã tin chọn Aura Coffee Solutions. Đơn hàng đã được lưu lại để bộ phận chuyên môn kiểm tra tồn kho và đối soát thanh toán.
              </p>
            </div>

            {/* Order Status Notice (Transparent: staff verification required) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-left space-y-4 text-xs sm:text-sm text-[var(--espresso-mid)]">
              <div className="flex items-start gap-3 pb-3 border-b border-[var(--cream-shadow)]">
                <Clock size={18} className="text-[var(--copper-accent)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[var(--espresso-ink)] block">
                    Trạng Thái: Chờ Chuyên Viên Xác Nhận
                  </span>
                  <span className="text-xs text-[var(--espresso-light)] font-light">
                    Đối với hình thức Chuyển khoản ngân hàng hoặc COD, nhân viên Aura sẽ chủ động kiểm tra sao kê hoặc liên hệ số điện thoại của quý khách trong vòng 15-30 phút làm việc.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PhoneCall size={18} className="text-[var(--copper-accent)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[var(--espresso-ink)] block">
                    Hỗ Trợ Nhanh 24/7
                  </span>
                  <span className="text-xs text-[var(--espresso-light)] font-light">
                    Nếu cần hỗ trợ kỹ thuật gấp hoặc giao hỏa tốc, quý khách có thể liên hệ trực tiếp hotline: <strong className="text-[var(--espresso-ink)]">0909 000 247</strong>.
                  </span>
                </div>
              </div>
            </div>

            {/* Explicit Gating Notice: Truthful statement, NOT online payment confirmation */}
            <div className="p-4 rounded-xl bg-[var(--cream-deep)]/50 border border-dashed border-[var(--cream-shadow)] text-left text-xs text-[var(--espresso-light)] space-y-1.5">
              <div className="flex items-center gap-2 font-medium text-[var(--espresso-ink)]">
                <ShieldCheck size={15} className="text-[var(--copper-accent)] shrink-0" />
                <span>Lưu ý về quy trình xác nhận giao dịch</span>
              </div>
              <p className="leading-relaxed font-light">
                Trang này là biên nhận tiếp nhận yêu cầu đặt hàng của quý khách từ giao diện website, <strong className="text-[var(--espresso-ink)]">không phải là xác nhận thanh toán online thành công</strong>. Aura Coffee Solutions không tích hợp cổng thanh toán trực tuyến tự động; toàn bộ đơn hàng chuyển khoản và COD đều được chuyên viên đối soát thủ công và gọi điện xác nhận trước khi điều phối xuất kho.
              </p>
            </div>

            {/* Return Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--espresso-ink)] text-[var(--cream-base)] hover:bg-[var(--espresso-mid)] transition-colors cursor-pointer shadow-xs"
              >
                <span>Tiếp Tục Xem Sản Phẩm</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />
      <Toast />
    </main>
  );
}
