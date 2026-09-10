'use client';

import React from 'react';
import { SolutionPackage } from '@/types';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PACKAGES: SolutionPackage[] = [
  {
    id: 'pkg_startup_turnkey',
    name: 'Khởi Nghiệp',
    target: 'Quán mới mở · 40–120m²',
    price: '95.000.000 ₫',
    rawPrice: 95000000,
    popular: false,
    badge: '',
    description: 'Chìa khóa trao tay đồng bộ từ thiết bị đến menu và quy trình vận hành.',
    features: [
      'Máy pha espresso commercial 2-Group Dual PID',
      'Bản vẽ bố trí quầy bar công thái học',
      'Đào tạo barista chuẩn SCA & 20 công thức signature',
      'Bảo hành 24 tháng, hỗ trợ khai trương trực tiếp',
    ],
  },
  {
    id: 'pkg_specialty_upgrade',
    name: 'Chuyên Nghiệp',
    target: 'Quán định vị specialty · 60–200m²',
    price: '198.000.000 ₫',
    rawPrice: 198000000,
    popular: true,
    badge: 'Được chọn nhiều nhất',
    description: 'Hạ tầng Multi-Boiler T3 kết hợp xử lý nước khoáng chuẩn cupping.',
    features: [
      'Máy flagship Multi-Boiler T3 Gravitech — kiểm soát biến thiên áp',
      'Máy xay Mahlkönig chuyên dụng specialty',
      'Hệ thống lọc nước RO Remineralizer chuẩn SCA',
      'Gói bảo trì VIP 24/7 · Định kỳ 3 tháng/lần',
    ],
  },
  {
    id: 'pkg_rental_supply',
    name: 'Chuỗi Vận Hành',
    target: 'Chuỗi F&B · Khách sạn · Văn phòng',
    price: '8.500.000 ₫ / tháng',
    rawPrice: 8500000,
    popular: false,
    badge: '',
    description: 'Thuê thiết bị linh hoạt, nguồn hạt rang mộc ổn định giao định kỳ hàng tuần.',
    features: [
      'Miễn phí 100% chi phí đặt cọc thiết bị',
      'Nguồn hạt specialty 20–100kg/tháng, chiết khấu cao',
      'Đổi máy trong ngày nếu phát sinh sự cố',
      'Báo cáo chất lượng tách cà phê hàng tháng',
    ],
  },
];

export const SolutionsSection: React.FC = () => {
  const router = useRouter();

  const handleAddPackage = (_pkg: SolutionPackage) => router.push('/contact');

  return (
    <section
      id="solutions"
      aria-label="Ba gói giải pháp — Aura Coffee"
      style={{
        backgroundColor: 'var(--cream-base)',
        paddingBlock: 'var(--section-y)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          marginInline: 'auto',
          paddingInline: 'var(--container-x)',
        }}
      >
        {/* Section header — left-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '56px' }}
        >
          <p className="label-text" style={{ marginBottom: '16px' }}>
            Giải Pháp Trọn Gói
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
            Giải pháp trọn gói.
          </h2>
        </motion.div>

        {/* Three typographic columns separated by hairlines */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
          }}
          className="grid-cols-1 lg:grid-cols-3"
        >
          {PACKAGES.map((pkg, i) => {
            const featured = pkg.popular;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: featured ? 0 : i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  padding: '40px 32px',
                  backgroundColor: featured ? 'var(--cream-deep)' : 'transparent',
                  borderLeft: featured ? '2px solid var(--copper-accent)' : '2px solid transparent',
                  borderRight: i < PACKAGES.length - 1 ? '1px solid var(--cream-shadow)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Target label */}
                <p className="label-text" style={{ marginBottom: '8px', color: 'var(--espresso-light)' }}>
                  {pkg.target}
                </p>

                {/* Package name + popular badge inline */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '8px',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '18px',
                      fontWeight: 500,
                      color: 'var(--espresso-ink)',
                    }}
                  >
                    {pkg.name}
                  </h3>
                  {pkg.popular && (
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: 'var(--copper-accent)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      • {pkg.badge}
                    </span>
                  )}
                </div>

                {/* Price — neutral espresso ink, NOT copper */}
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '48px',
                    fontWeight: 400,
                    color: 'var(--espresso-ink)',
                    lineHeight: 1,
                    marginBottom: '4px',
                  }}
                  aria-label={`Giá: ${pkg.price}`}
                >
                  {pkg.price.split(' ')[0]}
                </p>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'var(--espresso-light)',
                    marginBottom: '24px',
                    display: 'block',
                  }}
                >
                  {pkg.price.includes('/') ? pkg.price.split('/ ')[1] : 'trọn gói'}
                </span>

                <div className="hairline" aria-hidden="true" style={{ marginBottom: '24px' }} />

                {/* 4 differentiators — em-dash prefix, no icons */}
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    flex: 1,
                  }}
                >
                  {pkg.features.slice(0, 4).map((f) => (
                    <li
                      key={f}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-data)',
                        color: 'var(--espresso-mid)',
                        lineHeight: 1.5,
                        display: 'flex',
                        gap: '8px',
                      }}
                    >
                      <span aria-hidden="true" style={{ color: 'var(--espresso-light)', flexShrink: 0 }}>
                        —
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div style={{ marginTop: '32px' }}>
                  {featured ? (
                    <button
                      id={`solution-cta-${pkg.id}`}
                      onClick={() => { handleAddPackage(pkg); }}
                      style={{
                        width: '100%',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--cream-base)',
                        backgroundColor: 'var(--copper-accent)',
                        border: 'none',
                        padding: '14px 24px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        minHeight: '44px',
                        transition: 'background-color 250ms ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--copper-light)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--copper-accent)';
                      }}
                    >
                      Nhận Báo Giá
                    </button>
                  ) : (
                    <button
                      id={`solution-cta-${pkg.id}`}
                      onClick={() => { handleAddPackage(pkg); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '14px',
                        color: 'var(--copper-accent)',
                        cursor: 'pointer',
                        padding: '4px 0',
                        borderBottom: '1px solid transparent',
                        transition: 'border-color 200ms ease',
                        minHeight: '44px',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'var(--copper-accent)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'transparent';
                      }}
                    >
                      Nhận Báo Giá →
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
