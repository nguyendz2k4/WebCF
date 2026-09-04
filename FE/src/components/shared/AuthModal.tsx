'use client';

import React, { useState } from 'react';
import { useApp, DEMO_USERS } from '@/stores/AppContext';
import { X, Lock, Mail, User as UserIcon, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fieldStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: '14px',
  color: 'var(--espresso-ink)',
  backgroundColor: 'var(--cream-deep)',
  border: 'none',
  borderBottom: '1px solid var(--cream-shadow)',
  padding: '12px 12px 12px 36px',
  outline: 'none',
  borderRadius: 0,
  transition: 'border-color 200ms ease',
};

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
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        {/* Backdrop — dark scrim, no blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(26,18,8,0.70)',
          }}
        />

        {/* Modal Window — cream surface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '90vh',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            backgroundColor: 'var(--cream-base)',
            border: '1px solid var(--cream-shadow)',
            padding: '36px',
            zIndex: 10,
          }}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          role="dialog"
          aria-modal="true"
          aria-label={authModalMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '32px',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-label)',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--copper-accent)',
                  marginBottom: '8px',
                }}
              >
                Aura Coffee ID
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '28px',
                  fontWeight: 400,
                  color: 'var(--espresso-ink)',
                  lineHeight: 1.1,
                }}
              >
                {authModalMode === 'login' ? 'Đăng nhập.' : 'Đăng ký.'}
              </h2>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: 'var(--espresso-light)',
                transition: 'color 200ms ease',
              }}
              aria-label="Đóng"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--espresso-ink)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--espresso-light)';
              }}
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Quick demo access */}
          <div style={{ marginBottom: '32px' }}>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-label)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--espresso-light)',
                marginBottom: '12px',
              }}
            >
              Trải nghiệm nhanh
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('owner')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--espresso-mid)',
                  backgroundColor: 'var(--cream-deep)',
                  border: '1px solid var(--cream-shadow)',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'border-color 200ms ease, color 200ms ease',
                  minHeight: '44px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--copper-accent)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--espresso-ink)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--cream-shadow)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--espresso-mid)';
                }}
              >
                <Store size={13} strokeWidth={1.5} />
                Chủ Quán
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('barista')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--espresso-mid)',
                  backgroundColor: 'var(--cream-deep)',
                  border: '1px solid var(--cream-shadow)',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'border-color 200ms ease, color 200ms ease',
                  minHeight: '44px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--copper-accent)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--espresso-ink)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--cream-shadow)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--espresso-mid)';
                }}
              >
                <UserIcon size={13} strokeWidth={1.5} />
                Head Barista
              </button>
            </div>
          </div>

          {/* Mode tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--cream-shadow)',
              marginBottom: '28px',
            }}
          >
            {(['login', 'register'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setAuthModalMode(mode)}
                style={{
                  flex: 1,
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '10px',
                  background: 'none',
                  border: 'none',
                  borderBottom: authModalMode === mode
                    ? '2px solid var(--copper-accent)'
                    : '2px solid transparent',
                  color: authModalMode === mode ? 'var(--espresso-ink)' : 'var(--espresso-light)',
                  cursor: 'pointer',
                  transition: 'color 200ms ease, border-color 200ms ease',
                  marginBottom: '-1px',
                }}
              >
                {mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký Mới'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {authModalMode === 'register' && (
              <>
                <div>
                  <label
                    htmlFor="auth-name"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-label)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--espresso-light)',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    Họ và Tên
                  </label>
                  <div style={{ position: 'relative' }}>
                    <UserIcon
                      size={14}
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--espresso-light)', pointerEvents: 'none' }}
                    />
                    <input
                      id="auth-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      style={fieldStyle}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="auth-shop"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-label)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--espresso-light)',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    Tên Quán (Tùy chọn)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Store
                      size={14}
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--espresso-light)', pointerEvents: 'none' }}
                    />
                    <input
                      id="auth-shop"
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Aura Coffee & Roastery"
                      style={fieldStyle}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="auth-email"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-label)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--espresso-light)',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={14}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--espresso-light)', pointerEvents: 'none' }}
                />
                <input
                  id="auth-email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@yourcoffee.vn"
                  style={fieldStyle}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-password"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-label)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--espresso-light)',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Mật Khẩu
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={14}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--espresso-light)', pointerEvents: 'none' }}
                />
                <input
                  id="auth-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={fieldStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                color: 'var(--cream-base)',
                backgroundColor: 'var(--copper-accent)',
                border: 'none',
                padding: '14px 28px',
                cursor: 'pointer',
                minHeight: '48px',
                transition: 'background-color 250ms ease',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--copper-light)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--copper-accent)';
              }}
            >
              {authModalMode === 'login' ? 'Đăng Nhập & Tiếp Tục' : 'Tạo Tài Khoản'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
