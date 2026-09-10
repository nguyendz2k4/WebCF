import React from 'react';
import { getArticles } from '@/lib/public-data';
import type { Metadata } from 'next';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast } from '@/components/shared';
import { SiteFooter } from '@/components/store';
import { NewsClientView } from '@/components/news';

export const metadata: Metadata = {
  title: 'Tin Tức & Thị Trường Cà Phê | Aura Coffee Journal',
  description:
    'Cập nhật thông tin sản phẩm mới, phân tích biến động thị trường F&B specialty coffee, cẩm nang kỹ thuật barista và bí quyết vận hành quầy bar chuẩn atelier.',
  keywords: [
    'tin tức cà phê',
    'thị trường F&B',
    'sanremo cafe racer 2026',
    'kỹ thuật barista',
    'aura coffee journal',
    'specialty coffee việt nam',
  ],
};

export default async function NewsPage() {
  const articles = await getArticles();
  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream-base)]">
      {/* ── Global Header Navigation ── */}
      <Navbar />

      {/* ── Page Content Container ── */}
      <div className="flex-1 pt-28 pb-20">
        <div className="max-w-[var(--container-max)] mx-auto px-6 md:px-12">
          {/* ── Editorial Header ── */}
          <header className="max-w-3xl mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-[var(--copper-accent)]" />
              <span className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-[var(--copper-accent)]">
                Aura Journal · Volume 2026
              </span>
            </div>
            <h1 className="font-serif text-[38px] md:text-[48px] lg:text-[56px] font-normal leading-[1.1] text-[var(--espresso-ink)] mb-4">
              Tin Tức & Thị Trường
            </h1>
            <p className="font-sans text-[15px] md:text-[17px] text-[var(--espresso-mid)] leading-relaxed font-light">
              Góc nhìn chuyên sâu về xu hướng specialty coffee, ra mắt thiết bị chuẩn atelier và cẩm nang kỹ thuật chiết xuất dành cho các nhà vận hành F&B tiên phong.
            </p>
          </header>

          {/* ── Client View with Categories & Grid ── */}
          <NewsClientView articles={articles} />
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
