'use client';

import React, { useState, useRef } from 'react';
import { apiRequest, errorMessage } from '@/lib/api-client';
import { useApp } from '@/stores/AppContext';
import { CheckCircle2, Loader2, Send, AlertCircle } from 'lucide-react';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  businessName: string;
  serviceType: string;
  budgetRange: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  serviceType?: string;
  message?: string;
}

const SERVICE_OPTIONS = [
  { id: 'full-setup', label: 'Tư Vấn Trọn Gói Setup Quán' },
  { id: 'equipment', label: 'Máy Pha & Máy Xay Cao Cấp' },
  { id: 'coffee-beans', label: 'Cà Phê Đặc Sản & Nguyên Liệu' },
  { id: 'bar-training', label: 'Đào Tạo Barista & Vận Hành' },
];

const BUDGET_OPTIONS = [
  { value: 'under-100m', label: 'Dưới 100 triệu' },
  { value: '100m-300m', label: '100 – 300 triệu' },
  { value: '300m-600m', label: '300 – 600 triệu' },
  { value: 'above-600m', label: 'Trên 600 triệu' },
  { value: 'custom', label: 'Cần tư vấn theo đề xuất' },
];

export const ContactForm: React.FC = () => {
  const { addToast } = useApp();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    businessName: '',
    serviceType: 'full-setup',
    budgetRange: '100m-300m',
    message: '',
  });

  const [submitError, setSubmitError] = useState('');
  const submitLock = useRef(false);
  const requestKey = useRef('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng cung cấp họ và tên của bạn.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng cung cấp số điện thoại liên hệ.';
    } else {
      const phoneRegex = /^(?:\+?84|0)[35789][0-9]{8}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
        newErrors.phone = 'Số điện thoại không hợp lệ (ví dụ: 0909 000 247).';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng cung cấp địa chỉ email.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Địa chỉ email không đúng định dạng.';
      }
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Vui lòng chọn lĩnh vực bạn đang quan tâm.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    requestKey.current = '';
    setSubmitError('');
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitLock.current) return;
    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const errorElem = document.getElementById(firstErrorKey);
        if (errorElem) {
          errorElem.focus();
        }
      }
      return;
    }

    submitLock.current = true; setIsSubmitting(true); setSubmitError('');
    if (!requestKey.current) requestKey.current = crypto.randomUUID();
    try {
      await apiRequest('/contacts', { method: 'POST', body: formData, idempotencyKey: requestKey.current });
      setIsSubmitted(true);
      addToast('Đã gửi yêu cầu', 'Thông tin tư vấn đã được tiếp nhận.', 'success');
    } catch (error) { setSubmitError(errorMessage(error)); }
    finally { submitLock.current = false; setIsSubmitting(false); }

  };

  const handleReset = () => {
    requestKey.current = ''; setSubmitError('');
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      businessName: '',
      serviceType: 'full-setup',
      budgetRange: '100m-300m',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div
        className="p-8 md:p-12 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-sm text-center space-y-6"
        role="region"
        aria-live="polite"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-[var(--cream-base)] border border-[var(--copper-accent)] flex items-center justify-center text-[var(--copper-accent)]">
          <CheckCircle2 size={28} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-[28px] md:text-[32px] font-normal text-[var(--espresso-ink)]">
            Hồ Sơ Đã Được Ghi Nhận
          </h2>
          <p className="font-sans text-[15px] text-[var(--espresso-mid)] max-w-md mx-auto leading-relaxed">
            Cảm ơn quý khách <strong>{formData.fullName}</strong>. Chúng tôi đã nhận được thông tin dự án và sẽ liên hệ qua số điện thoại <strong>{formData.phone}</strong> trong vòng 2 giờ làm việc.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] text-[13px] font-sans font-medium uppercase tracking-[0.12em] text-[var(--espresso-ink)] border border-[var(--cream-shadow)] hover:border-[var(--copper-accent)] hover:text-[var(--copper-accent)] transition-colors duration-200"
          >
            Gửi yêu cầu hoặc câu hỏi khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-8"
      aria-label="Biểu mẫu yêu cầu tư vấn giải pháp Aura Coffee"
    >
      {/* ── Section: Service Interest ── */}
      <div className="space-y-3">
        <label className="block text-[13px] font-sans font-medium text-[var(--espresso-ink)] uppercase tracking-[0.1em]">
          1. Nhu cầu tư vấn chính <span className="text-[var(--copper-accent)]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Nhu cầu tư vấn chính">
          {SERVICE_OPTIONS.map((opt) => {
            const isSelected = formData.serviceType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, serviceType: opt.id }));
                  if (errors.serviceType) setErrors((prev) => ({ ...prev, serviceType: undefined }));
                }}
                className={`text-left p-3.5 min-h-[48px] rounded-sm text-[13.5px] font-sans transition-all duration-200 flex items-center justify-between border ${
                  isSelected
                    ? 'border-[var(--copper-accent)] bg-[var(--cream-deep)] text-[var(--espresso-ink)] font-medium'
                    : 'border-[var(--cream-shadow)] bg-transparent text-[var(--espresso-mid)] hover:border-[var(--espresso-light)]'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-[var(--copper-accent)] bg-[var(--copper-accent)]'
                      : 'border-[var(--cream-shadow)]'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[var(--cream-base)]" />}
                </span>
              </button>
            );
          })}
        </div>
        {errors.serviceType && (
          <p
            id="serviceType-error"
            role="alert"
            className="flex items-center gap-1.5 text-[12.5px] text-red-700 mt-1"
          >
            <AlertCircle size={14} aria-hidden="true" />
            <span>{errors.serviceType}</span>
          </p>
        )}
      </div>

      {/* ── Section: Contact Details ── */}
      <div className="space-y-5">
        <label className="block text-[13px] font-sans font-medium text-[var(--espresso-ink)] uppercase tracking-[0.1em]">
          2. Thông tin liên hệ đại diện
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="fullName"
              className="block text-[13px] font-sans text-[var(--espresso-mid)]"
            >
              Họ và tên <span className="text-[var(--copper-accent)]">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              aria-required="true"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className={`w-full px-4 py-3 min-h-[44px] text-[14px] font-sans bg-[var(--cream-deep)] text-[var(--espresso-ink)] rounded-sm border transition-colors duration-200 placeholder:text-[var(--espresso-light)]/50 focus:outline-none ${
                errors.fullName
                  ? 'border-red-600 focus:border-red-600'
                  : 'border-[var(--cream-shadow)] focus:border-[var(--copper-accent)]'
              }`}
            />
            {errors.fullName && (
              <p
                id="fullName-error"
                role="alert"
                className="flex items-center gap-1.5 text-[12px] text-red-700 mt-1"
              >
                <AlertCircle size={13} aria-hidden="true" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="block text-[13px] font-sans text-[var(--espresso-mid)]"
            >
              Số điện thoại di động <span className="text-[var(--copper-accent)]">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0909 000 247"
              aria-required="true"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className={`w-full px-4 py-3 min-h-[44px] text-[14px] font-sans bg-[var(--cream-deep)] text-[var(--espresso-ink)] rounded-sm border transition-colors duration-200 placeholder:text-[var(--espresso-light)]/50 focus:outline-none ${
                errors.phone
                  ? 'border-red-600 focus:border-red-600'
                  : 'border-[var(--cream-shadow)] focus:border-[var(--copper-accent)]'
              }`}
            />
            {errors.phone && (
              <p
                id="phone-error"
                role="alert"
                className="flex items-center gap-1.5 text-[12px] text-red-700 mt-1"
              >
                <AlertCircle size={13} aria-hidden="true" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-[13px] font-sans text-[var(--espresso-mid)]"
            >
              Địa chỉ email công việc <span className="text-[var(--copper-accent)]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ten@thuonghieu.com"
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full px-4 py-3 min-h-[44px] text-[14px] font-sans bg-[var(--cream-deep)] text-[var(--espresso-ink)] rounded-sm border transition-colors duration-200 placeholder:text-[var(--espresso-light)]/50 focus:outline-none ${
                errors.email
                  ? 'border-red-600 focus:border-red-600'
                  : 'border-[var(--cream-shadow)] focus:border-[var(--copper-accent)]'
              }`}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="flex items-center gap-1.5 text-[12px] text-red-700 mt-1"
              >
                <AlertCircle size={13} aria-hidden="true" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Business / Brand Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="businessName"
              className="block text-[13px] font-sans text-[var(--espresso-mid)]"
            >
              Tên quán / Doanh nghiệp F&B <span className="text-[var(--espresso-light)] text-[12px]">(nếu có)</span>
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Ví dụ: Aura Atelier Café Q.1"
              className="w-full px-4 py-3 min-h-[44px] text-[14px] font-sans bg-[var(--cream-deep)] text-[var(--espresso-ink)] rounded-sm border border-[var(--cream-shadow)] focus:border-[var(--copper-accent)] focus:outline-none transition-colors duration-200 placeholder:text-[var(--espresso-light)]/50"
            />
          </div>
        </div>
      </div>

      {/* ── Section: Budget & Details ── */}
      <div className="space-y-5">
        <label className="block text-[13px] font-sans font-medium text-[var(--espresso-ink)] uppercase tracking-[0.1em]">
          3. Dự toán ngân sách & Ghi chú dự án
        </label>

        {/* Budget Range */}
        <div className="space-y-1.5">
          <label
            htmlFor="budgetRange"
            className="block text-[13px] font-sans text-[var(--espresso-mid)]"
          >
            Ngân sách dự kiến đầu tư thiết bị / giải pháp
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            className="w-full px-4 py-3 min-h-[44px] text-[14px] font-sans bg-[var(--cream-deep)] text-[var(--espresso-ink)] rounded-sm border border-[var(--cream-shadow)] focus:border-[var(--copper-accent)] focus:outline-none transition-colors duration-200 cursor-pointer"
          >
            {BUDGET_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label
            htmlFor="message"
            className="block text-[13px] font-sans text-[var(--espresso-mid)]"
          >
            Nội dung cụ thể hoặc câu hỏi thêm
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={5000}
            value={formData.message}
            onChange={handleChange}
            placeholder="Chia sẻ thêm về mặt bằng, công suất dự kiến phục vụ (ly/ngày) hoặc thời gian khai trương mong muốn..."
            className="w-full px-4 py-3 text-[14px] font-sans bg-[var(--cream-deep)] text-[var(--espresso-ink)] rounded-sm border border-[var(--cream-shadow)] focus:border-[var(--copper-accent)] focus:outline-none transition-colors duration-200 placeholder:text-[var(--espresso-light)]/50 resize-y"
          />
        </div>
      </div>

      {submitError && <p role="alert" className="text-red-700">{submitError}</p>}
      {/* ── Submit Action Button ── */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 min-h-[48px] bg-[var(--copper-accent)] hover:bg-[var(--copper-light)] text-[var(--cream-base)] text-[14px] font-sans font-medium rounded-sm transition-colors duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              <span>Đang gửi thông tin...</span>
            </>
          ) : (
            <>
              <span>Gửi Yêu Cầu Tư Vấn Ngay</span>
              <Send size={16} strokeWidth={1.5} aria-hidden="true" />
            </>
          )}
        </button>
        <p className="text-[12px] font-sans text-[var(--espresso-light)] mt-2">
          Thông tin của bạn được sử dụng để tiếp nhận và xử lý yêu cầu tư vấn.
        </p>
      </div>
    </form>
  );
};
