'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/stores/AppContext';
import { ShoppingBag, User as UserIcon, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Trang Chủ', href: '/' },
  { name: 'Sản Phẩm', href: '/products?domain=equipment' },
  { name: 'Nguyên Liệu', href: '/products?domain=ingredients' },
  { name: 'Tin Tức', href: '/news' },
  { name: 'Liên Hệ', href: '/contact' },
];

/* Coffee bean outline SVG — copper stroke, no fill */
function CoffeeBeanIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3C8.5 3 5 6.5 5 12s3.5 9 7 9 7-3.5 7-9-3.5-9-7-9Z"
        stroke="var(--copper-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3c0 4-2.5 7-2.5 9s2.5 5 2.5 9"
        stroke="var(--copper-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);

  const isLightPage =
    pathname.startsWith('/products') ||
    pathname.startsWith('/news') ||
    pathname.startsWith('/contact');
  const isSolidNav = scrolled || isLightPage;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!userDropOpen) return;
    const close = () => setUserDropOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [userDropOpen]);

  const scrolledStyle: React.CSSProperties = {
    backgroundColor: 'rgba(245, 239, 230, 0.96)',
    borderBottom: '1px solid var(--cream-shadow)',
  };

  const transparentStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    borderBottom: '1px solid transparent',
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const anchorId = href.replace('/', '');
      const target = document.querySelector(anchorId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        id="navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          transition: 'background-color 200ms ease, border-color 200ms ease',
          ...(isSolidNav ? scrolledStyle : transparentStyle),
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container-max)',
            marginInline: 'auto',
            paddingInline: 'var(--container-x)',
            paddingBlock: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
          }}
        >
          {/* ── Brand ── */}
          <Link
            href="/"
            aria-label="Aura Coffee Solutions — trang chủ"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <CoffeeBeanIcon />
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 300,
                fontSize: '18px',
                letterSpacing: '0.02em',
                color: isSolidNav ? 'var(--espresso-ink)' : '#FFFFFF',
                transition: 'color 200ms ease',
              }}
            >
              Aura Coffee
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav
            className="hidden md:flex"
            aria-label="Menu chính"
            style={{ alignItems: 'center', gap: '32px' }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: isSolidNav ? 'var(--espresso-mid)' : 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  paddingBottom: '2px',
                  borderBottom: '1px solid transparent',
                  transition: 'color 200ms ease, border-color 200ms ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = isSolidNav
                    ? 'var(--espresso-ink)'
                    : '#FFFFFF';
                  (e.currentTarget as HTMLAnchorElement).style.borderBottomColor =
                    'var(--copper-accent)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = isSolidNav
                    ? 'var(--espresso-mid)'
                    : 'rgba(255,255,255,0.8)';
                  (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent';
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* ── Desktop Right Cluster ── */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '12px' }}>
            {/* Cart / Quote Dossier icon */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Giỏ hàng"
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                color: isSolidNav ? 'var(--espresso-mid)' : 'rgba(255,255,255,0.75)',
                transition: 'color 200ms ease',
              }}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--copper-accent)',
                    color: 'var(--cream-base)',
                    fontSize: '10px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            {isLoggedIn && user ? (
              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button
                  id="navbar-user-btn"
                  onClick={() => setUserDropOpen(!userDropOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: isSolidNav ? 'var(--espresso-mid)' : 'rgba(255,255,255,0.75)',
                  }}
                  aria-label="Tài khoản"
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--copper-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: 'var(--cream-base)',
                    }}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <ChevronDown
                    size={12}
                    style={{
                      transform: userDropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease',
                    }}
                  />
                </button>

                <AnimatePresence>
                  {userDropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '36px',
                        width: '200px',
                        backgroundColor: 'var(--cream-base)',
                        border: '1px solid var(--cream-shadow)',
                        borderRadius: '4px',
                        padding: '8px',
                        boxShadow: '0 8px 24px rgba(26,18,8,0.12)',
                        zIndex: 50,
                      }}
                    >
                      <div
                        style={{
                          padding: '6px 8px',
                          borderBottom: '1px solid var(--cream-shadow)',
                          marginBottom: '4px',
                        }}
                      >
                        <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--espresso-ink)', margin: 0 }}>
                          {user.name}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--espresso-light)', margin: 0 }}>
                          Khách hàng
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropOpen(false);
                          setIsCartOpen(true);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '13px',
                          color: 'var(--espresso-mid)',
                          textAlign: 'left',
                        }}
                      >
                        Giỏ Hàng
                      </button>
                      <button
                        onClick={() => {
                          setUserDropOpen(false);
                          logout();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '13px',
                          color: '#B91C1C',
                          textAlign: 'left',
                        }}
                      >
                        <LogOut size={13} />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                id="navbar-login-btn"
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                aria-label="Đăng nhập"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: isSolidNav ? 'var(--espresso-mid)' : 'rgba(255,255,255,0.75)',
                }}
              >
                <UserIcon size={18} strokeWidth={1.5} />
              </button>
            )}

            {/* Single primary CTA */}
            <Link
              href="/#contact"
              id="navbar-cta"
              onClick={(e) => handleLinkClick(e, '/#contact')}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--cream-base)',
                backgroundColor: 'var(--copper-accent)',
                textDecoration: 'none',
                padding: '8px 20px',
                borderRadius: '4px',
                transition: 'background-color 250ms ease',
                display: 'inline-block',
                minHeight: '44px',
                lineHeight: '28px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--copper-light)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--copper-accent)';
              }}
            >
              Nhận Báo Giá
            </Link>
          </div>

          {/* ── Mobile Controls ── */}
          <div className="flex md:hidden" style={{ alignItems: 'center', gap: '8px' }}>
            <button
              id="mobile-cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Giỏ hàng"
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                color: isSolidNav ? 'var(--espresso-mid)' : '#FFFFFF',
              }}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    width: '15px',
                    height: '15px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--copper-accent)',
                    color: 'var(--cream-base)',
                    fontSize: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                color: isSolidNav ? 'var(--espresso-mid)' : '#FFFFFF',
              }}
            >
              {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="md:hidden"
              style={{
                backgroundColor: 'var(--cream-base)',
                borderBottom: '1px solid var(--cream-shadow)',
                overflow: 'hidden',
              }}
            >
              <nav style={{ padding: '16px var(--container-x) 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      setMobileOpen(false);
                      handleLinkClick(e, link.href);
                    }}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '15px',
                      color: 'var(--espresso-mid)',
                      textDecoration: 'none',
                      padding: '12px 0',
                      borderBottom: '1px solid var(--cream-shadow)',
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div
                style={{
                  padding: '16px var(--container-x) 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {isLoggedIn && user ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--espresso-mid)' }}>
                      {user.name}
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--espresso-light)' }}
                      aria-label="Đăng xuất"
                    >
                      <LogOut size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      color: 'var(--espresso-mid)',
                      background: 'none',
                      border: '1px solid var(--cream-shadow)',
                      padding: '12px',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    Đăng Nhập
                  </button>
                )}
                <Link
                  href="/#contact"
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleLinkClick(e, '/#contact');
                  }}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--cream-base)',
                    backgroundColor: 'var(--copper-accent)',
                    textDecoration: 'none',
                    padding: '14px',
                    textAlign: 'center',
                    borderRadius: '4px',
                    display: 'block',
                    minHeight: '44px',
                  }}
                >
                  Nhận Báo Giá
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
