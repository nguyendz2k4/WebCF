'use client';

import React from 'react';
import { useApp } from '@/stores/AppContext';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartLoading,
    cartError,
    refreshCart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    formattedCartTotal,
    openCheckout,
  } = useApp();

  if (!isCartOpen) return null;

  const handleProceedCheckout = () => {
    openCheckout();
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          pointerEvents: 'auto',
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsCartOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(26, 18, 8, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <div
          style={{
            position: 'fixed',
            insetBlock: 0,
            right: 0,
            maxWidth: '100%',
            width: '440px',
            display: 'flex',
          }}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: 'var(--espresso-ink)',
              borderLeft: '1px solid rgba(245,239,230,0.08)',
              color: 'var(--cream-base)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overscrollBehavior: 'contain',
            }}
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            role="dialog"
            aria-label="Giỏ hàng"
            aria-modal="true"
          >
            {/* Header */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid rgba(245,239,230,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '22px',
                    fontWeight: 400,
                    color: 'var(--cream-base)',
                    marginBottom: '4px',
                  }}
                >
                  Giỏ Hàng Của Bạn
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    color: 'var(--espresso-light)',
                  }}
                >
                  {cart.length} sản phẩm trong giỏ
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                aria-label="Đóng giỏ hàng"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--espresso-light)',
                  padding: '4px',
                  minHeight: '44px',
                  minWidth: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Body */}
            <div
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              style={{ flex: 1, overflowY: 'auto', padding: '24px', overscrollBehavior: 'contain' }}
            >
              {cartError && <div role="alert"><p>{cartError}</p><button type="button" disabled={cartLoading} onClick={() => void refreshCart()}>Thử lại</button></div>}
              {cartLoading && <p role="status">Đang cập nhật giỏ hàng…</p>}
              {!cartLoading && !cartError && cart.length === 0 ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: '16px',
                    paddingBlock: '64px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(245,239,230,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--espresso-light)',
                    }}
                  >
                    <ShoppingBag size={22} strokeWidth={1.5} />
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '20px',
                      fontStyle: 'italic',
                      color: 'var(--espresso-light)',
                    }}
                  >
                    Giỏ hàng đang trống.
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      color: 'var(--espresso-light)',
                      maxWidth: '260px',
                      lineHeight: 1.6,
                    }}
                  >
                    Khám phá bộ sưu tập máy pha, máy xay và nguồn hạt đặc sản để bắt đầu mua sắm.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      color: 'var(--copper-accent)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      minHeight: '44px',
                    }}
                  >
                    Tiếp tục mua hàng →
                  </button>
                </div>
              ) : (
                /* Item list */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {cart.map((item, i) => (
                    <React.Fragment key={item.id}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto',
                          gap: '16px',
                          alignItems: 'start',
                          paddingBlock: '20px',
                        }}
                      >
                        <div>
                          <p
                            className="label-text"
                            style={{ marginBottom: '6px', color: 'var(--espresso-light)' }}
                          >
                            {item.category === 'equipment' ? 'Thiết Bị' : 'Nguyên Liệu'}
                          </p>
                          <p
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: '14px',
                              fontWeight: 500,
                              color: 'var(--cream-base)',
                              marginBottom: '4px',
                            }}
                          >
                            {item.title}
                          </p>
                          {item.specs && (
                            <p
                              style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: '12px',
                                color: 'var(--espresso-light)',
                                marginBottom: '12px',
                              }}
                            >
                              {item.specs}
                            </p>
                          )}

                          {/* Quantity stepper */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                              disabled={cartLoading}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--espresso-light)',
                                padding: '4px',
                                minHeight: '32px',
                                minWidth: '32px',
                              }}
                              aria-label="Giảm số lượng"
                            >
                              <Minus size={12} strokeWidth={1.5} />
                            </button>
                            <span
                              style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                color: 'var(--cream-base)',
                                minWidth: '20px',
                                textAlign: 'center',
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--espresso-light)',
                                padding: '4px',
                                minHeight: '32px',
                                minWidth: '32px',
                              }}
                              aria-label="Tăng số lượng"
                            >
                              <Plus size={12} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '12px',
                          }}
                        >
                          <button
                            disabled={cartLoading}
                              onClick={() => removeFromCart(item.id)}
                            aria-label={`Xóa ${item.title}`}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--espresso-light)',
                              padding: '4px',
                              minHeight: '32px',
                            }}
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                          <span
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '15px',
                              color: 'var(--copper-glow)',
                            }}
                          >
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                              item.price * item.quantity
                            )}
                          </span>
                        </div>
                      </div>
                      {i < cart.length - 1 && (
                        <div
                          style={{ height: '1px', backgroundColor: 'rgba(245,239,230,0.08)' }}
                          aria-hidden="true"
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Footer & Checkout Action */}
            {cart.length > 0 && (
              <div
                style={{
                  padding: '24px',
                  borderTop: '1px solid rgba(245,239,230,0.08)',
                  backgroundColor: 'rgba(26,18,8,0.98)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--espresso-light)' }}>
                    Tổng tiền tạm tính
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '24px',
                      fontWeight: 400,
                      color: 'var(--copper-glow)',
                    }}
                  >
                    {formattedCartTotal}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={cartLoading || !!cartError}
                  onClick={handleProceedCheckout}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--cream-base)',
                    backgroundColor: 'var(--copper-accent)',
                    border: 'none',
                    padding: '0 24px',
                    height: '48px',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background-color 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--copper-light)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--copper-accent)';
                  }}
                >
                  <span>Tiến Hành Thanh Toán</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
