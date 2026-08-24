'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/stores/AppContext';
import { ShoppingBag, User as UserIcon, Phone, Menu, X, LogOut, Coffee, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Trang Chủ', href: '#' },
  { name: 'Sản Phẩm', href: '#' },
  { name: 'Tin Tức', href: '#' },
  { name: 'Liên Hệ', href: '#' },
];

export const Navbar: React.FC = () => {
  const {
    user,
    isLoggedIn,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    cartCount,
    setIsCartOpen,
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleOutsideClick = () => setUserDropdownOpen(false);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [userDropdownOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'glass-nav py-3' : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* ── Brand Logo ── */}
          <a
            href="#"
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c89b3c] to-[#996515] flex items-center justify-center shadow-lg shadow-[#c89b3c]/20 group-hover:scale-105 transition-transform">
              <Coffee size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm sm:text-base tracking-[0.06em] text-white uppercase font-display group-hover:text-white/90 transition-colors">
              AURA COFFEE
            </span>
          </a>

          {/* ── Desktop Center Navigation ── */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Menu chính">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-[13px] font-medium text-neutral-300 hover:text-white transition-colors py-1
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#c89b3c]
                  after:transition-all after:duration-200 hover:after:w-full"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* ── Desktop Right Cluster ── */}
          <div className="hidden md:flex items-center gap-2.5">

            {/* Hotline */}
            <a
              href="tel:0909000247"
              className="hidden lg:flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono font-medium text-neutral-200 transition-all active:scale-95"
            >
              <Phone size={12} className="text-[#c89b3c]" />
              <span>0909 000 247</span>
            </a>

            {/* Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-neutral-200 hover:text-white transition-all active:scale-95 cursor-pointer"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#c89b3c] text-black text-[10px] font-bold flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User / Login */}
            {isLoggedIn && user ? (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  id="navbar-user-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 pl-2 pr-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white transition-all cursor-pointer"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-[#c89b3c]/60"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#c89b3c] flex items-center justify-center text-[10px] text-black font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="max-w-[90px] truncate">{user.name.split(' ').pop()}</span>
                  <ChevronDown size={12} className={`text-neutral-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-[#161618]/95 backdrop-blur-xl border border-white/12 shadow-2xl p-2 text-white z-50"
                    >
                      <div className="px-3 py-2.5 border-b border-white/8 mb-1">
                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">{user.email}</p>
                        {user.shopName && (
                          <span className="mt-1 inline-block text-[10px] text-[#c89b3c] font-medium truncate">
                            {user.shopName}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => { setUserDropdownOpen(false); setIsCartOpen(true); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                      >
                        <ShoppingBag size={13} className="text-[#c89b3c]" />
                        <span>Giỏ hàng & Báo giá</span>
                      </button>

                      <button
                        onClick={() => { setUserDropdownOpen(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                      >
                        <LogOut size={13} />
                        <span>Đăng xuất</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                id="navbar-login-btn"
                onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                className="flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white transition-all active:scale-95 cursor-pointer"
              >
                <UserIcon size={13} className="text-[#c89b3c]" />
                <span>Đăng Nhập</span>
              </button>
            )}

            {/* Primary CTA */}
            <a
              href="#lien-he"
              className="py-2 px-5 rounded-full bg-[#c89b3c] hover:bg-[#d8a946] text-black text-xs font-bold tracking-tight shadow-md shadow-[#c89b3c]/25 transition-all active:scale-95"
            >
              Tư Vấn Ngay
            </a>
          </div>

          {/* ── Mobile Right Controls ── */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-white/10 text-white border border-white/10"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c89b3c] text-black text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white/10 text-white border border-white/10"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Slide-Down Menu ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="md:hidden bg-[#0d0d0f]/98 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
            >
              <div className="px-5 py-5 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-neutral-300 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/5 transition-all"
                  >
                    {link.name}
                  </a>
                ))}

                <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2.5">
                  <a
                    href="tel:0909000247"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#c89b3c] font-mono"
                  >
                    <Phone size={14} />
                    <span>Hotline: 0909 000 247</span>
                  </a>

                  {isLoggedIn && user ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#c89b3c] flex items-center justify-center text-black text-sm font-bold shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">{user.name}</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { logout(); setMobileMenuOpen(false); }}
                        className="text-xs text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        aria-label="Đăng xuất"
                      >
                        <LogOut size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setAuthModalMode('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <UserIcon size={14} className="text-[#c89b3c]" />
                      Đăng Nhập Tài Khoản
                    </button>
                  )}

                  <a
                    href="#lien-he"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-full bg-[#c89b3c] hover:bg-[#d8a946] text-black text-xs font-bold transition-all"
                  >
                    Tư Vấn Ngay
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
