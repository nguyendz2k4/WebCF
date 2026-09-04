'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const PILLARS = [
  {
    num: '01',
    title: 'Hạt Cà Phê Đặc Sản',
    description: 'Tuyển chọn từ vùng cao nguyên Cầu Đất, Sơn La — rang mẻ nhỏ, kiểm nghiệm cupping 100%.',
  },
  {
    num: '02',
    title: 'Thiết Bị Pha Chế Chuẩn Mực',
    description: 'Hệ thống espresso multi-boiler, máy xay chuyên nghiệp, ổn định nhiệt ±0.2°C.',
  },
  {
    num: '03',
    title: 'Tư Vấn Thiết Kế Quầy Bar',
    description: 'Bản vẽ 2D/3D workflow công thái học — tối ưu mặt bằng, hiệu suất vận hành.',
  },
  {
    num: '04',
    title: 'Đào Tạo Barista & Vận Hành Chuẩn',
    description: 'Chương trình huấn luyện chuẩn SCA — từ kỹ thuật chiết xuất đến cảm quan chuyên nghiệp.',
  },
  {
    num: '05',
    title: 'Bảo Trì Định Kỳ & Kỹ Sư 24/7',
    description: 'Hợp đồng bảo trì phòng ngừa, phản hồi trong 4 giờ trên toàn quốc 63 tỉnh thành.',
  },
  {
    num: '06',
    title: 'Tối Ưu Chi Phí & Định Giá Thực Đơn',
    description: 'Mô hình tài chính F&B, định giá thực đơn theo biên lợi nhuận mục tiêu.',
  },
];

export const SixPillars: React.FC = () => {
  return (
    <section
      id="pillars"
      aria-label="Sáu trụ cột — hệ sinh thái Aura Coffee"
      style={{
        position: 'relative',
        backgroundColor: 'var(--cream-base)',
        paddingBlock: 'var(--section-y)',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background image — opacity 8% */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <Image
          src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=2070&auto=format&fit=crop"
          alt=""
          fill
          style={{ objectFit: 'cover', opacity: 0.08 }}
          sizes="100vw"
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 'var(--container-max)',
          marginInline: 'auto',
          paddingInline: 'var(--container-x)',
          display: 'grid',
          gridTemplateColumns: '2fr 3fr',
          gap: 'clamp(40px, 6vw, 100px)',
          alignItems: 'start',
        }}
        className="block md:grid"
      >
        {/* ── Left column: label + H2 ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ paddingTop: '8px' }}
        >
          <p className="label-text" style={{ marginBottom: '20px' }}>
            Giải Pháp Đầy Đủ
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-section)',
              fontWeight: 400,
              color: 'var(--espresso-ink)',
              lineHeight: 1.1,
            }}
          >
            Sáu trụ cột.
          </h2>
        </motion.div>

        {/* ── Right column: numbered list ── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {PILLARS.map((pillar, i) => (
            <React.Fragment key={pillar.num}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '24px',
                  alignItems: 'baseline',
                  paddingBlock: '28px',
                }}
              >
                {/* Large numeral — decorative */}
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(48px, 6vw, 80px)',
                    fontWeight: 200,
                    lineHeight: 1,
                    color: 'var(--espresso-light)',
                    userSelect: 'none',
                    minWidth: '60px',
                    textAlign: 'right',
                  }}
                  aria-hidden="true"
                >
                  {pillar.num}
                </motion.span>

                <div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 + 0.15 }}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '18px',
                      fontWeight: 500,
                      color: 'var(--espresso-ink)',
                      marginBottom: '6px',
                    }}
                  >
                    {pillar.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 + 0.2 }}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-data)',
                      color: 'var(--espresso-mid)',
                      lineHeight: 1.6,
                    }}
                  >
                    {pillar.description}
                  </motion.p>
                </div>
              </motion.div>

              {/* Hairline divider between items */}
              {i < PILLARS.length - 1 && (
                <div
                  className="hairline"
                  aria-hidden="true"
                  style={{ gridColumn: '1 / -1' }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
