import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast } from '@/components/shared';
import { SiteFooter } from '@/components/store';
import { ArrowLeft, Compass, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 - Không Tìm Thấy Trang | Aura Coffee Solutions',
  description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang danh mục khác.',
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream-base)]">
      {/* Global Header */}
      <Navbar />

      {/* 404 Body */}
      <div className="flex-1 flex items-center justify-center pt-28 pb-20 px-6">
        <div className="max-w-xl mx-auto text-center space-y-6">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--copper-accent)]" />
            <span className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-[var(--copper-accent)]">
              Mã Lỗi · 404 Not Found
            </span>
          </div>

          {/* Large Serif Title */}
          <h1
            className="text-6xl sm:text-7xl md:text-8xl text-[var(--espresso-ink)] font-light tracking-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            404
          </h1>

          <h2
            className="text-2xl sm:text-3xl text-[var(--espresso-ink)] font-normal"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Không Tìm Thấy Trang Yêu Cầu
          </h2>

          <p className="text-sm sm:text-base text-[var(--espresso-mid)] leading-relaxed max-w-md mx-auto font-light">
            Trang hoặc sản phẩm bạn đang tìm kiếm có thể đã được thay đổi đường dẫn, tạm ngưng phân phối hoặc địa chỉ URL chưa chính xác.
          </p>

          {/* Helpful Navigation Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--espresso-ink)] text-[var(--cream-base)] hover:bg-[var(--espresso-mid)] transition-colors shadow-xs cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Về Trang Chủ</span>
            </Link>

            <Link
              href="/products?domain=equipment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-medium uppercase tracking-wider bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-[var(--espresso-ink)] hover:border-[var(--copper-accent)] hover:text-[var(--copper-accent)] transition-colors cursor-pointer"
            >
              <ShoppingBag size={14} />
              <span>Duyệt Thiết Bị Cà Phê</span>
            </Link>

            <Link
              href="/products?domain=ingredients"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-medium uppercase tracking-wider bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-[var(--espresso-ink)] hover:border-[var(--copper-accent)] hover:text-[var(--copper-accent)] transition-colors cursor-pointer"
            >
              <Compass size={14} />
              <span>Khám Phá Hạt Specialty</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Global Footer & Modals */}
      <SiteFooter />
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />
      <Toast />
    </main>
  );
}
