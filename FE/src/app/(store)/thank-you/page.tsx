import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast } from '@/components/shared';
import { SiteFooter } from '@/components/store';
import { ThankYouClientView } from './ThankYouClientView';
export const metadata: Metadata = { title: 'Thông tin đơn hàng | Aura Coffee Solutions', robots: { index: false, follow: false } };
export default function ThankYouPage() {
  return <main className="min-h-screen flex flex-col bg-[var(--cream-base)]"><Navbar /><div className="flex-1 pt-28 pb-16"><Suspense fallback={<p>Đang tải…</p>}><ThankYouClientView /></Suspense></div><SiteFooter /><AuthModal /><CartDrawer /><CheckoutModal /><Toast /></main>;
}
