import React from 'react';
import type { Metadata } from 'next';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast } from '@/components/shared';
import { SiteFooter } from '@/components/store';
import { ContactInfo, ContactForm, ContactFaq } from '@/components/contact';

export const metadata: Metadata = {
  title: 'Liên Hệ Tư Vấn Giải Pháp Cà Phê Atelier | Aura Coffee Solutions',
  description:
    'Kết nối trực tiếp với đội ngũ chuyên gia Aura Coffee Solutions. Đặt lịch trải nghiệm máy pha espresso tại Showroom, nhận tư vấn layout quầy bar và báo giá giải pháp trọn gói cho quán cà phê.',
  keywords: [
    'liên hệ aura coffee',
    'tư vấn mở quán cà phê',
    'báo giá máy pha cà phê',
    'showroom máy pha sanremo',
    'tư vấn quầy bar cà phê',
    'cung cấp hạt cà phê specialty',
  ],
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream-base)]">
      {/* ── Global Header Navigation ── */}
      <Navbar />

      {/* ── Page Content Container ── */}
      <div className="flex-1 pt-28 pb-20">
        <div className="max-w-[var(--container-max)] mx-auto px-6 md:px-12">
          {/* ── Editorial Header ── */}
          <header className="max-w-3xl mb-14">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-[var(--copper-accent)]" />
              <span className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-[var(--copper-accent)]">
                Aura Atelier · Kết Nối & Đồng Hành
              </span>
            </div>
            <h1 className="font-serif text-[38px] md:text-[48px] lg:text-[56px] font-normal leading-[1.1] text-[var(--espresso-ink)] mb-4">
              Bắt Đầu Cuộc Đối Thoại.
            </h1>
            <p className="font-sans text-[15px] md:text-[17px] text-[var(--espresso-mid)] leading-relaxed font-light">
              Dù bạn đang ấp ủ một mô hình cà phê đặc sản mới, chuẩn bị nâng cấp dàn máy pha đa nồi hơi hay tìm kiếm nguồn hạt ổn định cho chuỗi F&B, chúng tôi luôn sẵn sàng lắng nghe và cùng bạn giải quyết từng bài toán vận hành.
            </p>
          </header>

          {/* ── Asymmetric 2-Column Split: Info (40%) & Form (60%) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[38%_58%] gap-12 lg:gap-16 items-start pb-16">
            <ContactInfo />
            <div className="pt-2">
              <ContactForm />
            </div>
          </div>

          {/* ── FAQ Section ── */}
          <ContactFaq />
        </div>
      </div>

      {/* ── Global Footer ── */}
      <SiteFooter />

      {/* ── Global Overlays ── */}
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />
      <Toast />
    </main>
  );
}
