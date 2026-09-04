'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      aria-label="Liên hệ tư vấn — Aura Coffee"
      style={{
        backgroundColor: 'var(--espresso-ink)',
        paddingBlock: 'var(--section-y-lg)',
        display: 'flex',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          marginInline: 'auto',
          paddingInline: 'var(--container-x)',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {/* Copper hairline — scale in */}
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

        {/* H2 */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(40px, 5vw, 64px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--cream-base)',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}
        >
          Bắt đầu cuộc đối thoại.
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: 'var(--cream-shadow)',
            marginBottom: '48px',
            lineHeight: 1.6,
          }}
        >
          Chúng tôi sẵn sàng khảo sát, thiết kế, và đồng hành cùng bạn từ ngày đầu.
        </motion.p>

        {/* CTA group */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="tel:0909000247"
            id="contact-cta"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--cream-base)',
              backgroundColor: 'var(--copper-accent)',
              textDecoration: 'none',
              padding: '14px 32px',
              borderRadius: '4px',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'background-color 250ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--copper-light)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--copper-accent)';
            }}
          >
            Liên Hệ Tư Vấn Ngay
          </a>

          <a
            href="tel:0909000247"
            id="contact-phone"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--cream-shadow)',
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              paddingBottom: '2px',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'color 200ms ease, border-color 200ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-base)';
              (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'var(--cream-shadow)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-shadow)';
              (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent';
            }}
          >
            0909 000 247
          </a>
        </motion.div>
      </div>
    </section>
  );
};
