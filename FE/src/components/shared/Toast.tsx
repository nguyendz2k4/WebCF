'use client';

import React from 'react';
import { useApp } from '@/stores/AppContext';
import { CheckCircle2, ShoppingBag, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useApp();

  const iconColor = (type: string) => {
    if (type === 'success') return 'var(--copper-accent)';
    if (type === 'cart') return 'var(--copper-light)';
    return 'var(--espresso-light)';
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '360px',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px 20px',
              backgroundColor: 'var(--espresso-ink)',
              border: '1px solid rgba(245,239,230,0.12)',
              // No backdrop-blur, no glassmorphism
            }}
          >
            {/* Icon */}
            <div
              style={{
                flexShrink: 0,
                marginTop: '2px',
                color: iconColor(toast.type),
              }}
            >
              {toast.type === 'success' && <CheckCircle2 size={16} strokeWidth={1.5} />}
              {toast.type === 'cart' && <ShoppingBag size={16} strokeWidth={1.5} />}
              {toast.type === 'info' && <Info size={16} strokeWidth={1.5} />}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--cream-base)',
                  lineHeight: 1.3,
                }}
              >
                {toast.title}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  color: 'var(--espresso-light)',
                  marginTop: '4px',
                  lineHeight: 1.5,
                }}
              >
                {toast.message}
              </p>
            </div>

            {/* Close */}
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                color: 'var(--espresso-light)',
                flexShrink: 0,
                transition: 'color 200ms ease',
              }}
              aria-label="Đóng thông báo"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-base)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--espresso-light)';
              }}
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
