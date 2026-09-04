'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  decisionRequired?: boolean;
}

const PRODUCT_FAQS: FaqItem[] = [
  {
    id: 'faq-warranty',
    question: 'Chính sách bảo hành và hỗ trợ kỹ thuật thiết bị máy pha như thế nào?',
    answer:
      '[BUSINESS DECISION REQUIRED: Thời gian bảo hành chính thức (12 hay 24 tháng), điều kiện bảo dưỡng định kỳ và phạm vi hỗ trợ kỹ thuật onsite tại cơ sở khách hàng đang chờ doanh nghiệp xác nhận.]',
    decisionRequired: true,
  },
  {
    id: 'faq-install',
    question: 'Aura có hỗ trợ kỹ thuật viên đến lắp đặt và cân chỉnh profile quầy bar không?',
    answer:
      '[BUSINESS DECISION REQUIRED: Quy chuẩn hỗ trợ lắp đặt trực tiếp tại quán, chính sách hỗ trợ chi phí di chuyển liên tỉnh và chương trình đào tạo căn chỉnh chiết xuất với Barista đang chờ doanh nghiệp xác nhận.]',
    decisionRequired: true,
  },
  {
    id: 'faq-freshness',
    question: 'Quy cách đóng gói và độ tươi / ngày rang của hạt cà phê đặc sản?',
    answer:
      '[BUSINESS DECISION REQUIRED: Tiêu chuẩn đóng gói túi van một chiều và thời gian lưu kho tối đa sau ngày rang (degas) trước khi giao đến tay khách hàng đang chờ doanh nghiệp xác nhận.]',
    decisionRequired: true,
  },
  {
    id: 'faq-vat-payment',
    question: 'Aura hỗ trợ các phương thức thanh toán nào và có xuất hóa đơn VAT không?',
    answer:
      'Hiện tại Aura áp dụng 2 hình thức thanh toán chính: Tiền mặt khi nhận hàng (COD) và Chuyển khoản ngân hàng trực tiếp. Về hóa đơn VAT: [BUSINESS DECISION REQUIRED: Điều kiện xuất hóa đơn VAT điện tử cho doanh nghiệp và thời gian gửi hóa đơn đang chờ xác nhận].',
    decisionRequired: true,
  },
  {
    id: 'faq-delivery',
    question: 'Thời gian và chi phí giao hàng đối với máy móc và hạt cà phê định kỳ?',
    answer:
      '[BUSINESS DECISION REQUIRED: Khung thời gian giao hàng nội thành/liên tỉnh, đơn vị vận chuyển đối tác và hạn mức miễn phí vận chuyển đang chờ doanh nghiệp xác nhận.]',
    decisionRequired: true,
  },
];

export const ProductFAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(PRODUCT_FAQS[0].id);

  const toggleFaq = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section
      id="product-faq-section"
      aria-label="Các câu hỏi thường gặp"
      className="py-14 border-t border-[var(--cream-shadow)]"
    >
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-px bg-[var(--copper-accent)]" />
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[var(--copper-accent)]">
            Hỏi Đáp Chuyên Sâu · FAQ
          </span>
        </div>

        <h3
          className="text-2xl md:text-3xl text-[var(--espresso-ink)] font-normal mb-8"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Câu Hỏi Thường Gặp Khi Mua Thiết Bị & Hạt
        </h3>

        <div className="divide-y divide-[var(--cream-shadow)] border-y border-[var(--cream-shadow)]">
          {PRODUCT_FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="py-4">
                <button
                  type="button"
                  id={`faq-btn-${faq.id}`}
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${faq.id}`}
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                >
                  <span
                    className={`text-sm sm:text-base font-normal transition-colors ${
                      isOpen
                        ? 'text-[var(--copper-accent)] font-medium'
                        : 'text-[var(--espresso-ink)] group-hover:text-[var(--copper-accent)]'
                    }`}
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[var(--espresso-light)] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[var(--copper-accent)]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-panel-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${faq.id}`}
                    className="mt-3 pr-6 text-xs sm:text-sm text-[var(--espresso-mid)] leading-relaxed font-light animate-in fade-in duration-200"
                  >
                    <p className="bg-[var(--cream-deep)]/60 p-3.5 rounded-lg border border-[var(--cream-shadow)]/60">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
