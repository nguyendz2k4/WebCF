'use client';

import React, { useState } from 'react';
import { useApp, DEMO_USERS } from '@/stores/AppContext';
import { X, Lock, Mail, User as UserIcon, Store, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, setAuthModalMode, login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: name || (email.split('@')[0] ? email.split('@')[0] : 'Quý Khách Hàng'),
      email: email || 'khachhang@auracoffee.vn',
      role: 'owner',
      shopName: shopName || 'Dự Án Quán Mới',
    });
  };

  const handleDemoLogin = (role: 'owner' | 'barista') => {
    const demoUser = DEMO_USERS[role];
    if (demoUser) {
      login(demoUser);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md rounded-3xl bg-[#17120e] border border-[#c89b3c]/20 shadow-2xl p-6 sm:p-8 text-white z-10 overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#c89b3c]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#c89b3c]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 relative">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-[#c89b3c] uppercase">
                Aura Coffee ID
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                {authModalMode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Thành Viên'}
              </h2>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick 1-Click Demo Section */}
          <div className="my-5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/8">
            <div className="flex items-center gap-1.5 text-xs text-[#c89b3c] font-medium mb-2.5">
              <Sparkles size={14} />
              <span>Đăng nhập nhanh 1-chạm (Dành cho trải nghiệm):</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('owner')}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/8 hover:bg-white/15 border border-[#c89b3c]/20 text-xs font-medium text-white transition-all active:scale-95 text-center"
              >
                <Store size={13} className="text-[#c89b3c]" />
                <span>Chủ Quán Cà Phê</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('barista')}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/8 hover:bg-white/15 border border-[#c89b3c]/20 text-xs font-medium text-white transition-all active:scale-95 text-center"
              >
                <UserIcon size={13} className="text-[#e6bf70]" />
                <span>Head Barista</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-black/40 p-1 mb-5 border border-white/8">
            <button
              type="button"
              onClick={() => setAuthModalMode('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authModalMode === 'login'
                  ? 'bg-[#c89b3c] text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => setAuthModalMode('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authModalMode === 'register'
                  ? 'bg-[#c89b3c] text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Đăng Ký Mới
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Họ và Tên
                  </label>
                  <div className="relative">
                    <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Tên Quán / Doanh Nghiệp (Tùy chọn)
                  </label>
                  <div className="relative">
                    <Store size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Aura Coffee & Roastery"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c] transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Email hoặc Số Điện Thoại
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@yourcoffee.vn"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-neutral-300">
                  Mật Khẩu
                </label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    className="text-[11px] text-[#c89b3c] hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#c89b3c] hover:bg-[#dfb153] text-black text-sm font-bold shadow-lg shadow-[#c89b3c]/25 transition-all active:scale-95"
            >
              <span>{authModalMode === 'login' ? 'Đăng Nhập & Tiếp Tục' : 'Tạo Tài Khoản Mới'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer Security Badge */}
          <div className="mt-5 pt-3 border-t border-white/8 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Bảo mật dữ liệu chuẩn Doanh Nghiệp Aura Coffee</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
