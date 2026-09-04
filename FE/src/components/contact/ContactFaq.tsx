'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CONTACT_FAQS } from '@/data/contact';
import { FaqItem } from '@/types/contact';

interface ContactFaqProps {
  faqs?: FaqItem[];
}

export const ContactFaq: React.FC<ContactFaqProps> = ({ faqs = CONTACT_FAQS }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      aria-labelledby="contact-faq-heading"
      className="pt-16 border-t border-[var(--cream-shadow)]"
    >
      <div className="max-w-3xl mb-10">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[var(--copper-accent)] block mb-2">
          Giải Đáp Thắc Mắc Thường Gặp
        </span>
        <h2
          id="contact-faq-heading"
          className="font-serif text-[28px] md:text-[36px] font-normal text-[var(--espresso-ink)] leading-tight"
        >
          Câu Hỏi Về Quy Trình Hợp Tác & Kỹ Thuật
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="border-b border-[var(--cream-shadow)] pb-4 transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                aria-expanded={isOpen}
                aria-controls={`answer-${faq.id}`}
                className="w-full text-left py-3 flex items-center justify-between gap-4 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--copper-accent)]"
              >
                <span className="font-serif text-[18px] md:text-[20px] font-light text-[var(--espresso-ink)] group-hover:text-[var(--copper-accent)] transition-colors duration-200">
                  {faq.question}
                </span>
                <span
                  className={`w-7 h-7 rounded-full border border-[var(--cream-shadow)] flex items-center justify-center shrink-0 text-[var(--espresso-mid)] group-hover:border-[var(--copper-accent)] group-hover:text-[var(--copper-accent)] transition-all duration-200 ${
                    isOpen ? 'rotate-180 bg-[var(--cream-deep)]' : ''
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDown size={15} strokeWidth={1.5} />
                </span>
              </button>

              {isOpen && (
                <div
                  id={`answer-${faq.id}`}
                  role="region"
                  aria-labelledby={faq.id}
                  className="pt-2 pb-3 pr-8"
                >
                  <p className="font-sans text-[14.5px] leading-relaxed text-[var(--espresso-mid)] font-light">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
