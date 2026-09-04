'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Truck,
  ArrowRight,
  PackageCheck,
} from 'lucide-react';
import { useApp } from '@/stores/AppContext';

// Comprehensive list of all 63 provinces & cities in Vietnam
const VIETNAM_PROVINCES = [
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng (Đà Lạt)',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
];

export const CheckoutModal: React.FC = () => {
  const {
    user,
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutItems,
    clearCart,
    addToast,
  } = useApp();

  // Form State
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr'>('vietqr');

  // UI State
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Prefill user data on open
  useEffect(() => {
    if (isCheckoutOpen && user) {
      setRecipientName(user.name || '');
      setPhone(user.phone || '');
      setOrderSuccess(false);
      setIsSubmitting(false);
      setOrderId(`AURA${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [isCheckoutOpen, user]);

  // Lock scroll on body & handle ESC
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCheckoutOpen) {
        setIsCheckoutOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, setIsCheckoutOpen]);

  if (!isCheckoutOpen || !user) return null;

  const orderTotal = checkoutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(orderTotal);

  const transferSyntax = `AURA ${orderId} ${phone ? phone.slice(-4) : '2026'}`;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    addToast('Đã sao chép', `Đã sao chép ${field} vào bộ nhớ tạm.`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phone.trim() || !address.trim()) {
      addToast('Thiếu thông tin', 'Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.', 'info');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      clearCart();
      addToast(
        'Đặt hàng thành công!',
        `Đơn hàng #${orderId} đã được ghi nhận. Chuyên viên Aura sẽ liên hệ xác nhận sớm nhất.`,
        'success'
      );
    }, 800);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderSuccess(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-[var(--espresso-dark)]/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl max-h-[94vh] sm:max-h-[90vh] bg-[var(--cream-base)] rounded-2xl shadow-2xl border border-[var(--cream-shadow)] z-10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--cream-shadow)] bg-[var(--cream-deep)]/60 shrink-0">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--copper-accent)]">
              Đơn Hàng Trực Tuyến · Aura Quick Checkout
            </span>
            <h2
              id="checkout-modal-title"
              className="text-xl sm:text-2xl text-[var(--espresso-ink)] font-normal mt-0.5"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {orderSuccess ? 'Xác Nhận Đơn Hàng Thành Công' : 'Thông Tin Nhận Hàng & Thanh Toán'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full text-[var(--espresso-light)] hover:text-[var(--espresso-ink)] hover:bg-[var(--cream-shadow)] transition-colors cursor-pointer"
            aria-label="Đóng bảng thanh toán"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body with smooth native mouse wheel & touch scrolling */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain"
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          style={{ overscrollBehavior: 'contain' }}
        >
          {orderSuccess ? (
            /* ── Order Success Confirmation ── */
            <div className="py-6 sm:py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[var(--espresso-light)] font-semibold">
                  MÃ ĐƠN HÀNG: #{orderId}
                </span>
                <h3
                  className="text-2xl sm:text-3xl text-[var(--espresso-ink)] font-normal mt-1"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Cảm Ơn Bạn Đã Đặt Hàng Tại Aura Coffee
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[var(--espresso-mid)] max-w-md mx-auto leading-relaxed">
                  Đơn hàng của quý khách đã được ghi nhận. Đội ngũ chuyên môn sẽ kiểm tra mẻ rang / quy cách đóng gói và liên hệ giao vận sớm nhất.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] max-w-lg mx-auto text-left space-y-3 text-xs text-[var(--espresso-mid)]">
                <div className="flex justify-between">
                  <span className="text-[var(--espresso-light)]">Người nhận:</span>
                  <span className="font-medium text-[var(--espresso-ink)]">{recipientName} ({phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--espresso-light)]">Địa chỉ giao:</span>
                  <span className="font-medium text-[var(--espresso-ink)] text-right">
                    {address} {district ? `, ${district}` : ''}, {province}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--espresso-light)]">Phương thức thanh toán:</span>
                  <span className="font-medium text-[var(--espresso-ink)]">
                    {paymentMethod === 'vietqr' ? 'Chuyển khoản VietQR (Đã tạo mã)' : 'Tiền mặt khi nhận hàng (COD)'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[var(--cream-shadow)] text-sm">
                  <span className="font-semibold text-[var(--espresso-ink)]">Tổng thanh toán:</span>
                  <span className="font-semibold text-[var(--copper-accent)]" style={{ fontFamily: 'var(--font-serif)' }}>
                    {formattedTotal}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--espresso-ink)] text-[var(--cream-base)] hover:bg-[var(--espresso-mid)] transition-colors cursor-pointer shadow-xs"
                >
                  <span>Hoàn Tất & Mua Tiếp</span>
                  <ArrowRight size={14} />
                </button>

                <Link
                  href={`/thank-you?orderId=${orderId}`}
                  onClick={handleClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-medium uppercase tracking-wider bg-[var(--cream-base)] border border-[var(--cream-shadow)] text-[var(--espresso-ink)] hover:border-[var(--copper-accent)] hover:text-[var(--copper-accent)] transition-colors cursor-pointer"
                >
                  <span>Xem Trạng Thái Tiếp Nhận Đơn #{orderId}</span>
                </Link>
              </div>
            </div>
          ) : (
            /* ── Order Input & Payment Form ── */
            <form onSubmit={handleSubmitOrder} className="space-y-6 sm:space-y-8">
              {/* 1. Order Items Summary */}
              <div>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--espresso-light)] mb-3">
                  Sản Phẩm Đặt Mua ({checkoutItems.length})
                </span>

                <div
                  className="divide-y divide-[var(--cream-shadow)] border-y border-[var(--cream-shadow)] max-h-44 overflow-y-auto pr-2 no-scrollbar"
                  data-lenis-prevent
                  data-lenis-prevent-wheel
                  data-lenis-prevent-touch
                  style={{ overscrollBehavior: 'contain' }}
                >
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--cream-deep)] border border-[var(--cream-shadow)] shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4
                            className="text-sm font-normal text-[var(--espresso-ink)] truncate"
                            style={{ fontFamily: 'var(--font-serif)' }}
                          >
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-[var(--espresso-light)]">
                            Số lượng: {item.quantity} {item.specs ? `· ${item.specs}` : ''}
                          </span>
                        </div>
                      </div>

                      <span
                        className="text-sm text-[var(--espresso-ink)] font-normal shrink-0"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {item.formattedPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Customer & Delivery Information (Full 63 Provinces) */}
              <div>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--espresso-light)] mb-3">
                  Thông Tin Giao Hàng
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs text-[var(--espresso-mid)] mb-1 font-medium">
                      Họ và Tên Người Nhận <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-lg text-xs text-[var(--espresso-ink)] focus:outline-none focus:border-[var(--copper-accent)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--espresso-mid)] mb-1 font-medium">
                      Số Điện Thoại <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0909 xxx xxx"
                      className="w-full px-3.5 py-2.5 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-lg text-xs text-[var(--espresso-ink)] focus:outline-none focus:border-[var(--copper-accent)]"
                    />
                  </div>

                  {/* Province Selection — 63 Tỉnh Thành Toàn Quốc */}
                  <div>
                    <label className="block text-xs text-[var(--espresso-mid)] mb-1 font-medium">
                      Tỉnh / Thành Phố <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-lg text-xs text-[var(--espresso-ink)] focus:outline-none focus:border-[var(--copper-accent)] cursor-pointer"
                    >
                      {VIETNAM_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--espresso-mid)] mb-1 font-medium">
                      Quận / Huyện / Thị Xã
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Quận 1, Hoàn Kiếm, Hải Châu..."
                      className="w-full px-3.5 py-2.5 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-lg text-xs text-[var(--espresso-ink)] focus:outline-none focus:border-[var(--copper-accent)]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[var(--espresso-mid)] mb-1 font-medium">
                      Địa Chỉ Chi Tiết (Số nhà, Tên đường, Phường/Xã) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số 123 Đường Nguyễn Huệ, Phường Bến Nghé"
                      className="w-full px-3.5 py-2.5 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-lg text-xs text-[var(--espresso-ink)] focus:outline-none focus:border-[var(--copper-accent)]"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs text-[var(--espresso-mid)] mb-1">
                    Ghi Chú Đơn Hàng (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Giao giờ hành chính, gọi trước khi giao..."
                    className="w-full px-3.5 py-2.5 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-lg text-xs text-[var(--espresso-ink)] focus:outline-none focus:border-[var(--copper-accent)]"
                  />
                </div>
              </div>

              {/* 3. Payment Method Choice (Tiền Mặt vs Chuyển Khoản VietQR) */}
              <div>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--espresso-light)] mb-3">
                  Chọn Phương Thức Thanh Toán <span className="text-red-600">*</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {/* Option A: VietQR Chuyển Khoản */}
                  <div
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'vietqr'
                        ? 'border-[var(--copper-accent)] bg-[var(--cream-deep)] ring-1 ring-[var(--copper-accent)]'
                        : 'border-[var(--cream-shadow)] hover:bg-[var(--cream-deep)]/40'
                    }`}
                  >
                    <input
                      type="radio"
                      id="pay-vietqr"
                      name="paymentMethod"
                      checked={paymentMethod === 'vietqr'}
                      onChange={() => setPaymentMethod('vietqr')}
                      className="mt-0.5 text-[var(--copper-accent)] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="pay-vietqr" className="cursor-pointer">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--espresso-ink)]">
                        <QrCode size={16} className="text-[var(--copper-accent)] shrink-0" />
                        Chuyển Khoản VietQR (24/7)
                      </span>
                      <p className="text-[11px] text-[var(--espresso-mid)] mt-1 leading-normal">
                        Quét mã QR chuyển khoản nhanh qua mọi App Ngân Hàng và Ví điện tử.
                      </p>
                    </label>
                  </div>

                  {/* Option B: Tiền Mặt COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[var(--copper-accent)] bg-[var(--cream-deep)] ring-1 ring-[var(--copper-accent)]'
                        : 'border-[var(--cream-shadow)] hover:bg-[var(--cream-deep)]/40'
                    }`}
                  >
                    <input
                      type="radio"
                      id="pay-cod"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-0.5 text-[var(--copper-accent)] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="pay-cod" className="cursor-pointer">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--espresso-ink)]">
                        <Banknote size={16} className="text-[var(--copper-accent)] shrink-0" />
                        Tiền Mặt Khi Nhận Hàng (COD)
                      </span>
                      <p className="text-[11px] text-[var(--espresso-mid)] mt-1 leading-normal">
                        Thanh toán trực tiếp bằng tiền mặt cho shipper khi nhận và kiểm tra hàng.
                      </p>
                    </label>
                  </div>
                </div>

                {/* VietQR Bank Account Details (Displayed when VietQR is selected) */}
                {paymentMethod === 'vietqr' && (
                  <div className="p-4 sm:p-5 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] space-y-4 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
                      {/* VietQR Visual Box */}
                      <div className="shrink-0 p-3 bg-white rounded-xl border border-[var(--cream-shadow)] shadow-xs flex flex-col items-center">
                        <div className="w-32 h-32 sm:w-36 sm:h-36 bg-neutral-900 rounded-lg p-2 flex flex-col items-center justify-between text-white relative">
                          <div className="w-full flex justify-between">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-white rounded-xs p-1"><div className="w-full h-full bg-white" /></div>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-white rounded-xs p-1"><div className="w-full h-full bg-white" /></div>
                          </div>
                          <div className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-amber-400">
                            VietQR · MBBANK
                          </div>
                          <div className="w-full flex justify-between">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-white rounded-xs p-1"><div className="w-full h-full bg-white" /></div>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 border border-dashed border-white/60 flex items-center justify-center text-[8px]">QR</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-neutral-600 mt-2">
                          Mở App Ngân Hàng Quét Mã
                        </span>
                      </div>

                      {/* Bank Details Table */}
                      <div className="flex-1 w-full space-y-2.5 text-xs">
                        <div className="flex items-center justify-between pb-1 border-b border-[var(--cream-shadow)]/60">
                          <span className="text-[var(--espresso-light)]">Ngân hàng:</span>
                          <span className="font-semibold text-[var(--espresso-ink)]">MBBank (Quân Đội)</span>
                        </div>

                        <div className="flex items-center justify-between pb-1 border-b border-[var(--cream-shadow)]/60">
                          <span className="text-[var(--espresso-light)]">Số tài khoản:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[var(--espresso-ink)]">9999000247</span>
                            <button
                              type="button"
                              onClick={() => handleCopy('9999000247', 'Số tài khoản')}
                              className="p-1 text-[var(--copper-accent)] hover:text-[var(--copper-light)] cursor-pointer"
                              title="Sao chép số tài khoản"
                            >
                              {copiedField === 'Số tài khoản' ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pb-1 border-b border-[var(--cream-shadow)]/60">
                          <span className="text-[var(--espresso-light)]">Chủ tài khoản:</span>
                          <span className="font-semibold text-[var(--espresso-ink)] uppercase">
                            AURA COFFEE SOLUTIONS
                          </span>
                        </div>

                        <div className="flex items-center justify-between pb-1 border-b border-[var(--cream-shadow)]/60">
                          <span className="text-[var(--espresso-light)]">Số tiền:</span>
                          <span className="font-semibold text-[var(--copper-accent)]" style={{ fontFamily: 'var(--font-serif)' }}>
                            {formattedTotal}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pb-1 border-b border-[var(--cream-shadow)]/60">
                          <span className="text-[var(--espresso-light)]">Nội dung CK:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[var(--copper-accent)]">
                              {transferSyntax}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(transferSyntax, 'Nội dung chuyển khoản')}
                              className="p-1 text-[var(--copper-accent)] hover:text-[var(--copper-light)] cursor-pointer"
                              title="Sao chép nội dung"
                            >
                              {copiedField === 'Nội dung chuyển khoản' ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-[var(--espresso-mid)] flex items-center gap-1.5 pt-1 border-t border-[var(--cream-shadow)]/40">
                      <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
                      <span>Hệ thống đối soát tự động kích hoạt đơn hàng trong 1-2 phút sau khi nhận chuyển khoản.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Total & Submit Action */}
              <div className="pt-4 border-t border-[var(--cream-shadow)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto flex sm:block justify-between items-baseline">
                  <span className="block text-[11px] uppercase tracking-wider text-[var(--espresso-light)]">
                    Tổng Thanh Toán (Đã gồm VAT)
                  </span>
                  <span
                    className="text-2xl sm:text-3xl text-[var(--espresso-ink)] font-normal"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {formattedTotal}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--copper-accent)] text-white hover:bg-[var(--copper-light)] shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  <PackageCheck size={16} />
                  <span>{isSubmitting ? 'Đang Xử Lý...' : 'Xác Nhận Đặt Hàng'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
