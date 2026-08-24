import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/stores/AppContext';

export const metadata: Metadata = {
  title: 'Aura Coffee Solutions | Hệ Sinh Thái Giải Pháp Cà Phê Toàn Diện',
  description: 'Từ thiết bị espresso cao cấp, nguồn hạt chuẩn vị đến setup vận hành và bảo trì 24/7 — một hệ giải pháp đồng bộ cho quán cà phê tăng trưởng bền vững.',
  keywords: ['máy pha cà phê', 'specialty coffee', 'aura coffee solutions', 'setup quán cà phê', 'nguồn hạt cà phê', 'barista'],
};

export const viewport: Viewport = {
  themeColor: '#0d0a08',
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
    <html lang="vi" className="scroll-smooth dark">
      <body className="bg-[#0d0a08] text-[#f5f5f7] antialiased selection:bg-[#c89b3c] selection:text-black min-h-screen relative">
        {/* Subtle Ambient Grain & Coffee Warmth Overlay */}
        <div
          className="fixed inset-0 pointer-events-none -z-10 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(#c89b3c 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}