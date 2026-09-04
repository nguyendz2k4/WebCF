'use client';

import React from 'react';
import { motion } from 'framer-motion';

const COMMITMENTS = [
  {
    num: '01',
    stat: '99.4%',
    statement: 'Thời gian hoạt động ổn định cam kết hàng năm.',
    metric: '4h phản hồi kỹ thuật tại chỗ · 63 tỉnh thành',
  },
  {
    num: '02',
    stat: '4h',
    statement: 'Phản hồi kỹ thuật tại chỗ trên toàn quốc.',
    metric: 'Đội ngũ kỹ sư thường trực · Phản hồi trong 15 phút',
  },
  {
    num: '03',
    stat: '100%',
    statement: 'Mỗi mẻ rang đều qua kiểm nghiệm cupping.',
    metric: 'Nhập khẩu trực tiếp · Bảo hành gốc từ nhà sản xuất',
  },
];

export const CommitmentStatement: React.FC = () => {
  return (
    <section
      id="commitment"
      aria-label="Cam kết vận hành — Aura Coffee"
      style={{
        backgroundColor: 'var(--cream-deep)',
        paddingBlock: 'var(--section-y-lg)',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          marginInline: 'auto',
          paddingInline: 'var(--container-x)',
          width: '100%',
        }}
      >
        {/* Section label */}
        <p className="label-text" style={{ marginBottom: '20px' }}>
          Chương 07 · Cam Kết Vận Hành
        </p>

        {/* H2 */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 400,
            color: 'var(--espresso-ink)',
            lineHeight: 1.15,
            marginBottom: '56px',
          }}
        >
          Tiêu chuẩn không thỏa hiệp.
        </motion.h2>

        {/* Three statements */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {COMMITMENTS.map((item, i) => (
            <React.Fragment key={item.num}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '28px',
                  alignItems: 'start',
                  paddingBlock: '32px',
                }}
              >
                {/* Index — editorial chapter marker */}
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-label)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--espresso-light)',
                    paddingTop: '6px',
                    userSelect: 'none',
                    minWidth: '24px',
                  }}
                  aria-hidden="true"
                >
                  {item.num}
                </span>

                <div>
                  {/* Stat — dominant visual */}
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(40px, 5vw, 64px)',
                      fontWeight: 400,
                      color: 'var(--espresso-ink)',
                      lineHeight: 1,
                      marginBottom: '12px',
                    }}
                    aria-label={item.stat}
                  >
                    {item.stat}
                  </p>

                  {/* Statement — italic serif */}
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(18px, 2vw, 24px)',
                      fontStyle: 'italic',
                      fontWeight: 300,
                      color: 'var(--espresso-mid)',
                      lineHeight: 1.45,
                      marginBottom: '10px',
                    }}
                  >
                    {item.statement}
                  </p>

                  {/* Sub-metric — DM Sans uppercase */}
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--espresso-light)',
                      lineHeight: 1.6,
                    }}
                  >
                    {item.metric}
                  </p>
                </div>
              </motion.div>

              {i < COMMITMENTS.length - 1 && (
                <div className="hairline" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
