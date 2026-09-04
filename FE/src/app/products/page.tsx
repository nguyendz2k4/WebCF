import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast } from '@/components/shared';
import { SiteFooter } from '@/components/store';
import { CatalogClientView } from '@/components/catalog';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Bộ Sưu Tập Thiết Bị & Nguyên Liệu Chuẩn Atelier | Aura Coffee Solutions',
  description:
    'Tuyển chọn máy pha cà phê đa nồi hơi, máy xay chuyên nghiệp, máy rang và nguồn hạt đặc sản Cầu Đất, siro 1883 Pháp dành cho các chủ quán specialty café và chuỗi F&B.',
  keywords: [
    'máy pha cà phê espresso',
    'sanremo cafe racer',
    'mahlkonig ek43s',
    'victoria arduino',
    'cà phê cầu đất',
    'siro 1883',
    'matcha uji',
    'aura coffee catalog',
  ],
  alternates: {
    canonical: `${baseUrl}/products`,
  },
  openGraph: {
    title: 'Bộ Sưu Tập Thiết Bị & Nguyên Liệu Chuẩn Atelier | Aura Coffee Solutions',
    description:
      'Tuyển chọn máy pha cà phê đa nồi hơi, máy xay chuyên nghiệp, máy rang và nguồn hạt đặc sản Cầu Đất, siro 1883 Pháp.',
    url: `${baseUrl}/products`,
    siteName: 'Aura Coffee Solutions',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bộ Sưu Tập Thiết Bị & Nguyên Liệu Chuẩn Atelier | Aura Coffee Solutions',
    description:
      'Tuyển chọn máy pha cà phê đa nồi hơi, máy xay chuyên nghiệp, máy rang và nguồn hạt đặc sản Cầu Đất, siro 1883 Pháp.',
  },
};

function CatalogLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--cream-base)] pt-28 pb-16">
      <div className="max-w-[var(--container-max)] mx-auto px-6 md:px-12 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="w-32 h-4 bg-[var(--cream-shadow)] rounded" />
          <div className="w-96 max-w-full h-12 bg-[var(--cream-shadow)] rounded" />
          <div className="w-full max-w-xl h-6 bg-[var(--cream-deep)] rounded" />
        </div>

        {/* Control Bar Skeleton */}
        <div className="w-full h-12 bg-[var(--cream-deep)] rounded-full border border-[var(--cream-shadow)]" />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <div className="w-full aspect-4/3 bg-[var(--cream-deep)] rounded-xl border border-[var(--cream-shadow)]" />
              <div className="w-24 h-3 bg-[var(--cream-shadow)] rounded" />
              <div className="w-48 h-5 bg-[var(--cream-shadow)] rounded" />
              <div className="w-36 h-4 bg-[var(--cream-deep)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream-base)]">
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main Catalog View wrapped in Suspense */}
      <div className="flex-1">
        <Suspense fallback={<CatalogLoadingSkeleton />}>
          <CatalogClientView />
        </Suspense>
      </div>

      {/* Global Footer */}
      <SiteFooter />

      {/* Global Overlays & Modals */}
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />
      <Toast />
    </main>
  );
}
