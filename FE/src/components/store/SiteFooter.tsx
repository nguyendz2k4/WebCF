'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiRequest, errorMessage } from '@/lib/api-client';

const NAV_LINKS = [
  { name: 'Giải Pháp', href: '/#pillars' },
  { name: 'Thiết Bị', href: '/products?domain=equipment' },
  { name: 'Hạt Cà Phê', href: '/products?domain=ingredients' },
  { name: 'Tin Tức', href: '/news' },
  { name: 'Liên Hệ', href: '/contact' },
];

export const SiteFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !email.trim()) return;
    setSubmitting(true); setError('');
    try {
      await apiRequest('/newsletter/subscriptions', { method: 'POST', body: { email: email.trim() } });
      setSubscribed(true); setEmail('');
    } catch (error) { setError(errorMessage(error)); }
    finally { setSubmitting(false); }

  };

  return (
    <footer
      id="footer"
      aria-label="Footer — Aura Coffee Solutions"
      style={{
        backgroundColor: 'var(--espresso-ink)',
        paddingTop: '72px',
      }}
    >
      {/* ── 4-column typographic layout ── */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          marginInline: 'auto',
          paddingInline: 'var(--container-x)',
          paddingBottom: '56px',
        }}
        className="grid gap-10 grid-cols-2 lg:grid-cols-[30%_20%_25%_auto]"
      >
        {/* Col 1: Wordmark + tagline + address */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '20px',
              fontWeight: 300,
              color: 'var(--cream-base)',
              marginBottom: '12px',
              letterSpacing: '0.02em',
            }}
          >
            Aura Coffee
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: 'var(--espresso-light)',
              lineHeight: 1.7,
              marginBottom: '20px',
              maxWidth: '240px',
            }}
          >
            Hệ sinh thái giải pháp cà phê toàn diện — từ thiết bị đến vận hành.
          </p>
          <address
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: 'var(--espresso-light)',
              fontStyle: 'normal',
              lineHeight: 1.7,
            }}
          >
            Hồ Chí Minh, Việt Nam
          </address>
        </div>

        {/* Col 2: Navigation quick links */}
        <nav aria-label="Footer navigation">
          <p
            className="label-text"
            style={{ color: 'var(--espresso-light)', marginBottom: '20px' }}
          >
            Điều Hướng
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'var(--cream-shadow)',
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-base)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-shadow)';
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 3: Newsletter — minimal, no card */}
        <div>
          <p className="label-text" style={{ color: 'var(--espresso-light)', marginBottom: '20px' }}>
            Nhận Cập Nhật
          </p>
          {error && <p role="alert">{error}</p>}
          {subscribed ? (
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--copper-glow)',
              }}
            >
              Cảm ơn bạn đã đăng ký.
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{ display: 'flex', borderBottom: '1px solid var(--espresso-light)' }}
              aria-label="Đăng ký nhận bản tin"
            >
              <input
                id="footer-newsletter"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email của bạn"
                required
                aria-label="Địa chỉ email"
                style={{
                  flex: 1,
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  color: 'var(--cream-base)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '8px 0',
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                id="footer-newsletter-submit"
                aria-label="Gửi đăng ký"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--copper-accent)',
                  padding: '8px 0 8px 12px',
                  fontSize: '16px',
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--copper-light)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--copper-accent)';
                }}
              >
                →
              </button>
            </form>
          )}
        </div>

        {/* Col 4: Contact + live status dot */}
        <div>
          <p className="label-text" style={{ color: 'var(--espresso-light)', marginBottom: '20px' }}>
            Liên Hệ
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a
              href="tel:0909000247"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--cream-shadow)',
                textDecoration: 'none',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-base)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-shadow)';
              }}
            >
              0909 000 247
            </a>
            <a
              href="mailto:hello@auracoffee.vn"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--cream-shadow)',
                textDecoration: 'none',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-base)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-shadow)';
              }}
            >
              hello@auracoffee.vn
            </a>

            {/* Live status dot — only permitted animate-pulse */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '9999px',
                  backgroundColor: '#4ADE80',
                  display: 'inline-block',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
                aria-hidden="true"
              />
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.4; }
                }
              `}</style>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  color: 'var(--espresso-light)',
                }}
              >
                Hỗ trợ 24/7
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(245,239,230,0.08)',
          paddingBlock: '20px',
          paddingInline: 'var(--container-x)',
          maxWidth: 'var(--container-max)',
          marginInline: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            color: 'var(--espresso-light)',
          }}
        >
          © {new Date().getFullYear()} Aura Coffee Solutions. Tất cả quyền được bảo lưu.
        </p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { name: 'Chính Sách Bảo Mật', href: '/privacy-policy' },
            { name: 'Điều Khoản Dịch Vụ', href: '/terms' },
            { name: 'Chính Sách Đổi Trả', href: '/chinh-sach-doi-tra' },
            { name: 'Chính Sách Vận Chuyển', href: '/chinh-sach-van-chuyen' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                color: 'var(--espresso-light)',
                textDecoration: 'none',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-shadow)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--espresso-light)';
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
