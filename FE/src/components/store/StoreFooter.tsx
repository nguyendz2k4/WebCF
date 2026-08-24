'use client';

import React, { useState } from 'react';
import { useApp } from '@/stores/AppContext';
import { Send, CheckCircle2, Coffee } from 'lucide-react';

export const StoreFooter: React.FC = () => {
  const { addToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    addToast(
      'Đăng ký thành công',
      `Bản tin kỹ thuật và xu hướng Specialty Coffee sẽ được gửi tới ${email}.`,
      'success'
    );
    setEmail('');
  };

  return (
    <footer id="lien-he" className="bg-[#090705] text-neutral-400 border-t border-[#c89b3c]/15 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Row Matching Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/8 items-start">
          {/* Left Column: Brand & Technical Address (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c89b3c] to-[#996515] flex items-center justify-center text-white">
                <Coffee size={14} />
              </div>
              <h3 className="font-bold text-sm sm:text-base tracking-wider text-white uppercase font-display">
                AURA COFFEE SOLUTIONS
              </h3>
            </div>

            <div className="space-y-1.5 text-neutral-300">
              <p>
                Hotline:{' '}
                <a href="tel:0909000247" className="font-bold text-white hover:text-[#c89b3c] transition-colors font-mono">
                  0909 000 247
                </a>
              </p>
              <p className="text-neutral-400 leading-relaxed">
                Xưởng kỹ thuật & Showroom: 128 Nguyễn Trãi, Phường Bến Thành, TP. Hồ Chí Minh
              </p>
            </div>

            {/* Live Status Badge matching Mockup */}
            <div className="pt-2 flex items-center gap-2 text-[#c89b3c] font-mono text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c89b3c] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c89b3c]"></span>
              </span>
              <span>Trung tâm kỹ thuật đang trực tuyến [24/7]</span>
            </div>
          </div>

          {/* Center Column: Newsletter Subscription (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-3">
            <label className="block text-xs font-semibold text-white uppercase tracking-wider">
              Đăng ký nhận cập nhật kỹ thuật
            </label>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@doanhnghiep.vn"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/12 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c] transition-all pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Gửi email đăng ký"
              >
                {subscribed ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Send size={14} />}
              </button>
            </form>
            <p className="text-[11px] text-neutral-500">
              Nhận tài liệu cân chỉnh máy pha và báo cáo thị trường F&B hàng tháng.
            </p>
          </div>

          {/* Right Column: Social Links matching Mockup (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3 lg:text-right">
            <span className="block text-xs font-semibold text-white uppercase tracking-wider">
              Kết Nối Kênh Kỹ Thuật
            </span>
            <div className="flex flex-col lg:items-end space-y-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                LinkedIn
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Aura Coffee Solutions Co., Ltd. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-300 transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Sơ đồ kỹ thuật</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
