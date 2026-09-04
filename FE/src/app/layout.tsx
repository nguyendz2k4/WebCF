import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/stores/AppContext';
import { LenisProvider } from '@/components/shared/LenisProvider';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aura Coffee Solutions | Hệ Sinh Thái Giải Pháp Cà Phê Toàn Diện',
  description: 'Từ thiết bị espresso cao cấp, nguồn hạt chuẩn vị đến setup vận hành và bảo trì 24/7 — một hệ giải pháp đồng bộ cho quán cà phê tăng trưởng bền vững.',
  keywords: ['máy pha cà phê', 'specialty coffee', 'aura coffee solutions', 'setup quán cà phê', 'nguồn hạt cà phê', 'barista'],
};

export const viewport: Viewport = {
  themeColor: '#F5EFE6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`scroll-smooth ${cormorantGaramond.variable} ${dmSans.variable}`}>
      <body>
        <AppProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </AppProvider>
      </body>
    </html>
  );
}