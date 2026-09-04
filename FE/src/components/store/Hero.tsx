'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const STAGGER = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export const Hero: React.FC = () => {
  const { scrollYProgress } = useScroll();
  // Text block fades out by 20% scroll depth
  const textOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.18], [0, -40]);

  return (
    <section
      id="hero"
      aria-label="Hero — Aura Coffee Solutions"
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#1A1208',
      }}
    >
      {/* ── Full-bleed background: video with still fallback ── */}
      {/* Drop /hero.mp4 into /public to activate the video layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        {/* Still image fallback — shown when no video */}
        <Image
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop"
          alt="Slow-motion espresso extraction — Aura Coffee"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          sizes="100vw"
        />
        {/* Overlay — max rgba(26,18,8,0.35) per spec */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(26,18,8,0.35)',
          }}
        />
      </div>

      {/* ── Text block — bottom-left, max-width 620px ── */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 'clamp(48px, 8vh, 96px)',
          left: 'var(--container-x)',
          maxWidth: '620px',
          zIndex: 2,
          opacity: textOpacity,
          y: textY,
        }}
      >
        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Label */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-label)',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(245,239,230,0.7)',
              marginBottom: '20px',
            }}
          >
            Aura Coffee Solutions
          </p>

          {/* H1 — Cormorant Garamond Italic, no gradient */}
          <motion.h1
            variants={STAGGER}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(48px, 7vw, 96px)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#FFFFFF',
              lineHeight: 1.05,
              marginBottom: '20px',
              letterSpacing: '-0.01em',
            }}
          >
            Nghệ thuật cà phê.
          </motion.h1>

          {/* Sub — max 1 line */}
          <motion.p
            variants={STAGGER}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '460px',
            }}
          >
            Từ hạt đến tách — hệ sinh thái giải pháp cho quán cà phê tăng trưởng.
          </motion.p>

          {/* Single ghost CTA — bottom-left */}
          <motion.div
            variants={STAGGER}
            transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="#pillars"
              id="hero-cta"
              aria-label="Khám phá giải pháp của Aura Coffee"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 400,
                color: '#FFFFFF',
                border: '1px solid rgba(245,239,230,0.6)',
                padding: '12px 28px',
                height: '44px',
                borderRadius: '0',
                textDecoration: 'none',
                transition: 'border-color 250ms ease, gap 200ms ease',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(245,239,230,1)';
                el.style.gap = '14px';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(245,239,230,0.6)';
                el.style.gap = '8px';
              }}
            >
              Khám Phá Giải Pháp
              <span aria-hidden="true" style={{ fontSize: '16px', lineHeight: 1 }}>→</span>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
