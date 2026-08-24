'use client';

import React, { useState } from 'react';
import { useApp } from '@/stores/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, User as UserIcon, Phone, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    formattedCartTotal,
    user,
    setIsAuthModalOpen,
    addToast,
  } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactAddress, setContactAddress] = useState('');
  const [note, setNote] = useState('');

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      addToast(
        'Đã tiếp nhận yêu cầu!',
        'Chuyên viên Aura Coffee sẽ liên hệ tư vấn và gửi bảng báo giá chi tiết trong 15 phút.',
        'success'
      );
      clearCart();
    }, 1200);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-screen max-w-md bg-[#16110e] border-l border-[#c89b3c]/20 text-white shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#110d0b]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#c89b3c]/20 text-[#e6bf70] flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg tracking-tight">Giỏ Hàng & Báo Giá</h3>
                  <p className="text-xs text-neutral-400">
                    {cart.length} nhóm sản phẩm đã chọn
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Đóng giỏ hàng"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-xl font-bold tracking-tight text-white">
                    Gửi Yêu Cầu Thành Công!
                  </h4>
                  <p className="text-sm text-neutral-300 max-w-xs leading-relaxed">
                    Hồ sơ giải pháp và báo giá thiết bị ưu đãi của bạn đã được chuyển đến Giám đốc Kỹ thuật Aura Coffee.
                  </p>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#c89b3c] font-medium w-full">
                    Hotline trực tiếp 24/7: <strong>0909 000 247</strong>
                  </div>
                  <button
                    onClick={handleReset}
                    className="mt-4 px-6 py-2.5 rounded-full bg-[#c89b3c] hover:bg-[#dfb153] text-black text-xs font-bold transition-all shadow-lg shadow-[#c89b3c]/25"
                  >
                    Tiếp Tục Khám Phá
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-white/5 text-neutral-500 flex items-center justify-center">
                    <ShoppingBag size={30} />
                  </div>
                  <h4 className="text-base font-semibold text-white">Giỏ hàng đang trống</h4>
                  <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                    Hãy lựa chọn dòng máy pha espresso, gói nguồn hạt specialty hoặc giải pháp setup phù hợp cho quán của bạn.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all"
                  >
                    Xem Danh Mục Sản Phẩm
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/8 hover:border-[#c89b3c]/30 transition-all flex gap-3.5"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-18 h-18 object-cover rounded-xl bg-black/40 shrink-0 border border-white/10"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="text-sm font-semibold text-white line-clamp-1">
                                {item.title}
                              </h5>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                                aria-label="Xóa"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            {item.specs && (
                              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                                {item.specs}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                            <span className="text-xs font-semibold text-[#c89b3c]">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(item.price * item.quantity)}
                            </span>

                            {/* Stepper */}
                            <div className="flex items-center gap-2 bg-white/8 rounded-lg px-2 py-0.5 border border-white/10">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-neutral-400 hover:text-white p-0.5"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="text-xs font-semibold text-white min-w-3 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-neutral-400 hover:text-white p-0.5"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Checkout & Quote Info Form */}
                  <form onSubmit={handleCheckoutSubmit} className="mt-6 pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
                        Thông Tin Nhận Báo Giá
                      </h4>
                      {!user && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsCartOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                          className="text-[11px] text-[#c89b3c] hover:underline flex items-center gap-1"
                        >
                          <Sparkles size={11} />
                          Đăng nhập tự điền
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <div className="relative">
                        <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Họ tên người đại diện"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c89b3c]"
                        />
                      </div>

                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="Số điện thoại nhận tư vấn"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c89b3c]"
                        />
                      </div>

                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          value={contactAddress}
                          onChange={(e) => setContactAddress(e.target.value)}
                          placeholder="Địa chỉ quán / Tỉnh thành setup"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c89b3c]"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ghi chú thêm về mô hình quán, công suất dự kiến..."
                        className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c89b3c] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-3 py-3 px-4 rounded-full bg-[#c89b3c] hover:bg-[#dfb153] disabled:opacity-50 text-black text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#c89b3c]/25"
                    >
                      {isSubmitting ? (
                        <span>Đang xử lý hồ sơ...</span>
                      ) : (
                        <>
                          <span>Yêu Cầu Báo Giá & Tư Vấn Kỹ Thuật</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Footer Total */}
            {!isSuccess && cart.length > 0 && (
              <div className="p-5 border-t border-white/10 bg-[#111113]/90">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>Tổng ước tính (chưa gồm ưu đãi dự án):</span>
                  <span>{cart.length} mục</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Tổng cộng:</span>
                  <span className="text-lg font-bold text-[#c89b3c]">
                    {formattedCartTotal}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
