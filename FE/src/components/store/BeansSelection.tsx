'use client';

import React, { useState } from 'react';
import { CoffeeBean } from '@/types';
import { useApp } from '@/stores/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const COFFEE_BEANS: CoffeeBean[] = [
  {
    id: 'bean_caudat_typica',
    name: 'Cầu Đất Yellow Bourbon',
    origin: 'Cầu Đất, Đà Lạt',
    subRegion: 'Trạm Hành – Đồi Chè Cầu Đất',
    altitude: '1.650m',
    process: 'Anaerobic Natural 72h',
    roastProfile: 'Medium',
    cuppingScore: 87.2,
    flavorNotes: ['Hoa cam', 'Quả mọng đỏ', 'Mật ong rừng'],
    description:
      'Nguồn giống cổ Bourbon hái chín 100% bằng tay. Chiết xuất espresso làm bừng sáng vị ngọt trái cây nhiệt đới với hậu vị hoa cỏ kéo dài.',
    price: 480000,
    formattedPrice: '480.000 ₫',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    bagWeight: '1.000g',
  },
  {
    id: 'bean_aura_blend',
    name: 'Aura Signature Blend',
    origin: 'Lâm Đồng, Việt Nam',
    subRegion: 'Cầu Đất 70% Arabica + Lâm Hà 30% Fine Robusta',
    altitude: '1.450–1.600m',
    process: 'Honey & Washed',
    roastProfile: 'Medium-Dark',
    cuppingScore: 85.5,
    flavorNotes: ['Socola đen', 'Caramel bơ', 'Hạt phỉ nướng'],
    description:
      'Dòng hạt chủ lực căn chỉnh chuẩn 9 Bar. Crema vàng nâu dày mịn, đậm đà hoàn hảo cho cà phê sữa đá lẫn Americano.',
    price: 320000,
    formattedPrice: '320.000 ₫',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&auto=format&fit=crop&q=80',
    bagWeight: '1.000g',
  },
  {
    id: 'bean_ethiopia_yirgacheffe',
    name: 'Ethiopia Yirgacheffe G1',
    origin: 'Yirgacheffe, Ethiopia',
    subRegion: 'Kochere Washing Station',
    altitude: '1.900–2.100m',
    process: 'Natural Sun-Dried',
    roastProfile: 'Light',
    cuppingScore: 89.0,
    flavorNotes: ['Hoa nhài', 'Việt quất', 'Hương đào'],
    description:
      'Hạt specialty hàng đầu thế giới, dành cho thực đơn Pour-Over và Espresso Single Origin cao cấp.',
    price: 650000,
    formattedPrice: '650.000 ₫',
    image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&auto=format&fit=crop&q=80',
    bagWeight: '1.000g',
  },
  {
    id: 'bean_sonla_fine_robusta',
    name: 'Fine Robusta Chiềng Ban',
    origin: 'Sơn La, Tây Bắc',
    subRegion: 'Chiềng Ban – Bản Cọ',
    altitude: '900–1.100m',
    process: 'Yellow Honey Fermentation',
    roastProfile: 'Medium',
    cuppingScore: 85.0,
    flavorNotes: ['Hạt óc chó', 'Cacao', 'Thảo mộc Tây Bắc'],
    description:
      'Định nghĩa lại chất lượng Robusta Việt Nam — đắng sạch, thảo mộc tự nhiên, body sánh bùng nổ.',
    price: 360000,
    formattedPrice: '360.000 ₫',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&auto=format&fit=crop&q=80',
    bagWeight: '1.000g',
  },
];

export const BeansSelection: React.FC = () => {
  const { addToCart, addToast } = useApp();
  const [activeBeanId, setActiveBeanId] = useState<string>(COFFEE_BEANS[0].id);

  const handleAddBean = (bean: CoffeeBean) => {
    addToCart({
      id: bean.id,
      title: bean.name,
      category: 'beans',
      price: bean.price,
      formattedPrice: bean.formattedPrice,
      image: bean.image,
      subtitle: `${bean.origin} (${bean.bagWeight})`,
      specs: `SCA ${bean.cuppingScore} · ${bean.roastProfile} Roast`,
    });
    addToast('Đã thêm vào hồ sơ', `${bean.name} đã được thêm vào hồ sơ báo giá.`, 'success');
  };

  return (
    <section
      id="beans"
      aria-label="Nguồn hạt & vùng trồng — Aura Coffee"
      style={{
        position: 'relative',
        backgroundColor: 'var(--cream-deep)',
        paddingBlock: 'var(--section-y)',
        overflow: 'hidden',
      }}
    >
      {/* Highland ambient image — 15% opacity */}
      <div
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2108&auto=format&fit=crop"
          alt=""
          fill
          style={{ objectFit: 'cover', opacity: 0.15 }}
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
        }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '56px' }}
        >
          <p className="label-text" style={{ marginBottom: '14px' }}>
            Tuyển Chọn Nguồn Hạt
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
            Tuyển chọn nguồn hạt.
          </h2>
        </motion.div>

        {/* ── 4-column bean list ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          role="list"
        >
          {COFFEE_BEANS.map((bean, i) => {
            const active = bean.id === activeBeanId;
            return (
              <motion.div
                key={bean.id}
                role="listitem"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                onClick={() => setActiveBeanId(bean.id)}
                style={{
                  padding: '28px 24px',
                  cursor: 'pointer',
                  borderLeft: active ? '2px solid var(--copper-accent)' : '2px solid transparent',
                  backgroundColor: active ? 'var(--cream-base)' : 'transparent',
                  borderRight: i < COFFEE_BEANS.length - 1 ? '1px solid var(--cream-shadow)' : 'none',
                  transition: 'background-color 200ms ease, border-color 200ms ease',
                }}
              >
                {/* Origin label */}
                <p className="label-text" style={{ marginBottom: '8px', color: 'var(--espresso-light)' }}>
                  {bean.origin}
                </p>

                {/* Bean name */}
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'var(--espresso-ink)',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                  }}
                >
                  {bean.name}
                </h3>

                {/* SCA score — visual hero */}
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '28px',
                    fontStyle: 'italic',
                    color: 'var(--copper-accent)',
                    lineHeight: 1,
                    marginBottom: '16px',
                  }}
                  aria-label={`SCA cupping score ${bean.cuppingScore}`}
                >
                  {bean.cuppingScore}
                </p>

                {/* Flavor notes — 3 inline pills */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginBottom: '16px',
                  }}
                >
                  {bean.flavorNotes.slice(0, 3).map((note) => (
                    <span
                      key={note}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11px',
                        color: 'var(--espresso-mid)',
                        backgroundColor: 'var(--cream-shadow)',
                        padding: '3px 8px',
                        borderRadius: '2px',
                      }}
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {/* Text-link CTA */}
                <button
                  id={`bean-add-${bean.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddBean(bean);
                  }}
                  aria-label={`Thêm ${bean.name} vào giỏ hàng`}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    color: 'var(--copper-accent)',
                    background: 'none',
                    border: 'none',
                    padding: '0',
                    cursor: 'pointer',
                    borderBottom: '1px solid transparent',
                    transition: 'border-color 200ms ease',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'var(--copper-accent)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'transparent';
                  }}
                >
                  Thêm vào Giỏ Hàng
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* ── Expanded detail panel ── */}
        <AnimatePresence>
          {activeBeanId && (() => {
            const bean = COFFEE_BEANS.find((b) => b.id === activeBeanId);
            if (!bean) return null;
            return (
              <motion.div
                key={activeBeanId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  overflow: 'hidden',
                  borderTop: '1px solid var(--cream-shadow)',
                  marginTop: '0',
                }}
              >
                <div
                  style={{
                    padding: '32px 0',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    gap: '32px',
                  }}
                  className="grid-cols-2 lg:grid-cols-4"
                >
                  {[
                    { label: 'Vùng trồng', value: bean.subRegion },
                    { label: 'Độ cao', value: bean.altitude },
                    { label: 'Sơ chế', value: bean.process },
                    { label: 'Ghi chú', value: bean.description },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="label-text" style={{ marginBottom: '8px' }}>
                        {item.label}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 'var(--text-data)',
                          color: 'var(--espresso-mid)',
                          lineHeight: 1.6,
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </section>
  );
};
