'use client';

import React from 'react';
import { motion } from 'framer-motion';

const QUOTE = 'Một tách cà phê hoàn hảo không đến từ may mắn. Đó là bản giao hưởng giữa độ cao của vùng đất Cầu Đất, biểu đồ nhiệt chuẩn xác từng giây, và cỗ máy được hiệu chỉnh đến từng phần mười bar áp suất.';

export const PhilosophySection: React.FC = () => {
  const words = QUOTE.split(' ');

  return (
    <section
      id="philosophy"
      aria-label="Triết lý — Aura Coffee"
      style={{
        backgroundColor: 'var(--cream-base)',
        paddingBlock: 'var(--section-y-lg)',
        display: 'flex',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <div
        style={{
          maxWidth: '780px',
          marginInline: 'auto',
          paddingInline: 'var(--container-x)',
          textAlign: 'center',
        }}
      >
        {/* Copper rule — scaleX in on entry */}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            display: 'block',
            width: '80px',
            height: '1px',
            backgroundColor: 'var(--copper-accent)',
            marginInline: 'auto',
            marginBottom: '48px',
            transformOrigin: 'center',
          }}
          aria-hidden="true"
        />

        {/* Pull-quote — word-by-word reveal */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(22px, 3vw, 36px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--espresso-ink)',
            lineHeight: 1.45,
            marginBottom: '40px',
          }}
          aria-label={QUOTE}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: i * 0.04,
                ease: 'easeOut',
              }}
              style={{ display: 'inline-block', marginRight: '0.28em' }}
            >
              {word}
            </motion.span>
          ))}
        </p>

        {/* Attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            color: 'var(--espresso-light)',
            letterSpacing: '0.04em',
          }}
        >
          — Aura Coffee, Hồ Chí Minh
        </motion.p>
      </div>
    </section>
  );
};
