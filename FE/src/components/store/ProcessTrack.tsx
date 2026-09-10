'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const STEPS = [
  {
    num: '01',
    label: 'Tư Vấn & Khảo Sát',
    title: 'Hiểu mô hình của bạn.',
    description: 'Đội ngũ Aura khảo sát mặt bằng, phân tích mô hình kinh doanh và mục tiêu vận hành.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop',
  },
  {
    num: '02',
    label: 'Thiết Kế & Đề Xuất',
    title: 'Bản vẽ barista bar.',
    description: 'Phác thảo workflow, bố trí thiết bị và hệ thống chiết xuất tối ưu cho không gian thực tế.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop',
  },
  {
    num: '03',
    label: 'Lắp Đặt & Đào Tạo',
    title: 'Kỹ thuật viên tại chỗ.',
    description: 'Lắp đặt toàn bộ thiết bị, hiệu chỉnh máy và đào tạo barista trực tiếp tại quán.',
    image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=2064&auto=format&fit=crop',
  },
  {
    num: '04',
    label: 'Vận Hành & Bảo Trì',
    title: 'Đồng hành sau khai trương.',
    description: 'Hợp đồng bảo trì định kỳ, hotline ứng cứu 24/7 và hỗ trợ mùa cao điểm.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2070&auto=format&fit=crop',
  },
];

export const ProcessTrack: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const scrollTo = (idx: number) => {
    setCurrentStep(idx);
    const track = trackRef.current;
    if (!track) return;
    const panels = track.querySelectorAll('[data-panel]');
    const panel = panels[idx] as HTMLElement;
    if (panel) {
      track.scrollTo({ left: panel.offsetLeft, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="process"
      aria-label="Quy trình bốn bước — Aura Coffee"
      style={{
        backgroundColor: 'var(--cream-base)',
        paddingTop: 'var(--section-y)',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          marginInline: 'auto',
          paddingInline: 'var(--container-x)',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div>
          <p className="label-text" style={{ marginBottom: '14px' }}>
            Quy Trình
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-section)',
              fontWeight: 400,
              color: 'var(--espresso-ink)',
              lineHeight: 1.1,
              maxWidth: '560px',
            }}
          >
            Bốn bước đến khai trương.
          </motion.h2>
        </div>

        {/* Arrow navigation — at header level, not over images */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            id="process-prev"
            onClick={() => scrollTo(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            aria-label="Bước trước"
            style={{
              width: '44px',
              height: '44px',
              border: '1px solid var(--cream-shadow)',
              backgroundColor: 'transparent',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 0 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 200ms ease',
              fontSize: '18px',
              color: 'var(--espresso-mid)',
            }}
          >
            ←
          </button>
          <button
            id="process-next"
            onClick={() => scrollTo(Math.min(STEPS.length - 1, currentStep + 1))}
            disabled={currentStep === STEPS.length - 1}
            aria-label="Bước tiếp theo"
            style={{
              width: '44px',
              height: '44px',
              border: '1px solid var(--cream-shadow)',
              backgroundColor: 'transparent',
              cursor: currentStep === STEPS.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentStep === STEPS.length - 1 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 200ms ease',
              fontSize: '18px',
              color: 'var(--espresso-mid)',
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Horizontal panel track */}
      <div
        ref={trackRef}
        className="no-scrollbar"
        data-lenis-prevent-touch
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          gap: '0',
          overscrollBehaviorX: 'contain',
          overscrollBehaviorY: 'auto',
        }}
        onScroll={(e) => {
          const track = e.currentTarget;
          const panels = track.querySelectorAll('[data-panel]');
          let closestIdx = 0;
          let closestDist = Infinity;
          panels.forEach((p, i) => {
            const el = p as HTMLElement;
            const dist = Math.abs(el.offsetLeft - track.scrollLeft);
            if (dist < closestDist) { closestDist = dist; closestIdx = i; }
          });
          setCurrentStep(closestIdx);
        }}
      >
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            data-panel={i}
            style={{
              position: 'relative',
              flex: '0 0 75vw',
              height: '75vh',
              minHeight: '480px',
              scrollSnapAlign: 'start',
              overflow: 'hidden',
            }}
          >
            {/* Full-bleed photograph */}
            <Image
              src={step.image}
              alt={step.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="75vw"
            />

            {/* Bottom vignette — 30% height only */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40%',
                background: 'linear-gradient(to top, rgba(26,18,8,0.72), transparent)',
              }}
            />

            {/* Text overlay — bottom-left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '40px',
                right: '40px',
                zIndex: 2,
              }}
            >
              {/* Decorative large step number */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                aria-hidden="true"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(72px, 10vw, 120px)',
                  fontWeight: 200,
                  fontStyle: 'italic',
                  lineHeight: 1,
                  color: 'rgba(245,239,230,0.15)',
                  marginBottom: '-8px',
                  userSelect: 'none',
                }}
              >
                {step.num}
              </motion.p>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-label)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--copper-glow)',
                  marginBottom: '8px',
                }}
              >
                {step.label}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '28px',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  marginBottom: '8px',
                  lineHeight: 1.2,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.6,
                  maxWidth: '440px',
                }}
              >
                {step.description}
              </p>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Step indicators */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          marginInline: 'auto',
          paddingInline: 'var(--container-x)',
          paddingBlock: '24px',
          display: 'flex',
          gap: '8px',
        }}
        aria-label="Chỉ báo bước"
      >
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Chuyển đến bước ${i + 1}`}
            style={{
              width: i === currentStep ? '32px' : '8px',
              height: '2px',
              backgroundColor: i === currentStep ? 'var(--copper-accent)' : 'var(--cream-shadow)',
              border: 'none',
              cursor: 'pointer',
              transition: 'width 300ms ease, background-color 300ms ease',
              padding: '0',
            }}
          />
        ))}
      </div>
    </section>
  );
};
