'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/stores/AppContext';

const EQUIPMENT_TIERS = [
  {
    id: 'eq-tier-1',
    tabKey: 'home' as const,
    label: 'Espresso Bar Khởi Nghiệp',
    capacity: '100–150 ly/ngày',
    name: 'Sanremo Zoe Compact 2 Group',
    price: 85000000,
    formattedPrice: '85.000.000 ₫',
    pressure: '9 bar ổn định · Dual PID',
    footprint: '530 × 528 × 543 mm',
    warranty: 'Bảo hành chính hãng 24 tháng · Bảo trì định kỳ miễn phí',
    image:
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=1200&auto=format&fit=crop&q=85',
    imageAlt: 'Sanremo Zoe Compact 2 Group espresso machine',
  },
  {
    id: 'eq-tier-2',
    tabKey: 'medium' as const,
    label: 'Boutique & Specialty Café',
    capacity: '200–350 ly/ngày',
    name: 'Sanremo Cafe Racer Custom 2 Group',
    price: 245000000,
    formattedPrice: '245.000.000 ₫',
    pressure: 'Hệ đa nồi hơi độc lập · Pre-infusion điện tử',
    footprint: '877 × 680 × 534 mm',
    warranty: 'Bảo hành chính hãng 36 tháng · Hotline hỗ trợ kỹ thuật 24/7',
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=85',
    imageAlt: 'Sanremo Cafe Racer Custom 2 Group espresso machine',
  },
  {
    id: 'eq-tier-3',
    tabKey: 'chain' as const,
    label: 'Chuỗi Cao Cấp & Khách Sạn',
    capacity: '500+ ly/ngày',
    name: 'Victoria Arduino Black Eagle Maverick 3G',
    price: 420000000,
    formattedPrice: '420.000.000 ₫',
    pressure: 'Công nghệ T3 Genius · PureBrew extraction',
    footprint: '1055 × 695 × 430 mm',
    warranty: 'Bảo hành toàn diện 36 tháng · Linh kiện thay thế trong 2 giờ',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=85',
    imageAlt: 'Victoria Arduino Black Eagle Maverick espresso machine',
  },
];

const TABS: { key: 'home' | 'medium' | 'chain'; label: string }[] = [
  { key: 'home', label: '100–150 ly/ngày' },
  { key: 'medium', label: '200–350 ly/ngày' },
  { key: 'chain', label: '500+ ly/ngày' },
];

export const EquipmentConfigurator: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<'home' | 'medium' | 'chain'>('home');
  const { addToCart, buyNow } = useApp();

  const tier = EQUIPMENT_TIERS.find((t) => t.tabKey === selectedKey) || EQUIPMENT_TIERS[0];

  const handleAddToCart = () => {
    addToCart({
      id: tier.id,
      title: tier.name,
      category: 'equipment',
      price: tier.price,
      formattedPrice: tier.formattedPrice,
      image: tier.image,
      subtitle: tier.label,
      specs: `${tier.capacity} · ${tier.pressure}`,
      quantity: 1,
    });
  };

  const handleBuyNow = () => {
    buyNow({
      id: tier.id,
      title: tier.name,
      category: 'equipment',
      price: tier.price,
      formattedPrice: tier.formattedPrice,
      image: tier.image,
      subtitle: tier.label,
      specs: `${tier.capacity} · ${tier.pressure}`,
      quantity: 1,
    });
  };

  return (
    <section
      id="equipment"
      aria-label="Thiết bị chiết xuất — Aura Coffee"
      style={{
        backgroundColor: 'var(--cream-base)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          minHeight: '100vh',
          flexWrap: 'wrap',
        }}
      >
        {/* ── Left Column: 58% Machine Portrait ── */}
        <div
          style={{
            flex: '1 1 500px',
            minHeight: '480px',
            position: 'relative',
            backgroundColor: 'var(--cream-deep)',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <Image
                src={tier.image}
                alt={tier.imageAlt}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 58vw"
                style={{ objectFit: 'cover' }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Model label pill on image */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '32px',
              backgroundColor: 'rgba(26, 18, 8, 0.72)',
              backdropFilter: 'blur(8px)',
              padding: '8px 16px',
              borderRadius: '2px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                color: 'var(--cream-base)',
                letterSpacing: '0.04em',
                margin: 0,
              }}
            >
              {tier.name}
            </p>
          </div>
        </div>

        {/* ── Right Column: 42% Specs & Interactive Selector ── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            flex: '1 1 380px',
            padding: 'clamp(40px, 5vw, 72px) clamp(24px, 4vw, 56px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Section marker */}
          <p className="label-text" style={{ marginBottom: '16px' }}>
            03 · Thiết Bị Chiết Xuất
          </p>

          {/* Capacity Scale Tabs */}
          <div
            role="tablist"
            aria-label="Chọn công suất quán"
            style={{
              display: 'flex',
              gap: '0',
              borderBottom: '1px solid var(--cream-shadow)',
              marginBottom: '36px',
            }}
          >
            {TABS.map((tab) => {
              const isActive = selectedKey === tab.key;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  id={`eq-tab-${tab.key}`}
                  onClick={() => setSelectedKey(tab.key)}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: isActive ? 'var(--espresso-ink)' : 'var(--espresso-light)',
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '2px solid var(--copper-accent)' : '2px solid transparent',
                    padding: '10px 16px 12px',
                    cursor: 'pointer',
                    transition: 'color 200ms ease, border-color 200ms ease',
                    marginBottom: '-1px',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Machine Name */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  color: 'var(--copper-accent)',
                  fontWeight: 500,
                  marginBottom: '8px',
                  letterSpacing: '0.04em',
                }}
              >
                {tier.label}
              </p>

              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(26px, 2.5vw, 36px)',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: 'var(--espresso-ink)',
                  marginBottom: '8px',
                }}
              >
                {tier.name}
              </h3>

              {/* Price display */}
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: 'var(--copper-accent)',
                  marginBottom: '28px',
                }}
              >
                {tier.formattedPrice}
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    color: 'var(--espresso-light)',
                    marginLeft: '8px',
                    fontWeight: 400,
                  }}
                >
                  (chưa gồm VAT)
                </span>
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Machine Specifications List */}
          <div
            style={{
              borderTop: '1px solid var(--cream-shadow)',
              marginBottom: '36px',
            }}
          >
            {[
              { label: 'Công suất khuyến nghị', value: tier.capacity },
              { label: 'Áp suất & Công nghệ', value: tier.pressure },
              { label: 'Kích thước lắp đặt', value: tier.footprint },
            ].map((spec) => (
              <div
                key={spec.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingBlock: '14px',
                  borderBottom: '1px solid var(--cream-shadow)',
                  gap: '16px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'var(--espresso-light)',
                    flexShrink: 0,
                  }}
                >
                  {spec.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'var(--espresso-ink)',
                    textAlign: 'right',
                    fontWeight: 500,
                  }}
                >
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Action Row: Thêm vào Giỏ Hàng + Mua Ngay */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              id="equipment-add-btn"
              onClick={handleAddToCart}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--espresso-ink)',
                backgroundColor: 'var(--cream-deep)',
                border: '1px solid var(--cream-shadow)',
                padding: '12px 24px',
                cursor: 'pointer',
                borderRadius: '9999px',
                minHeight: '44px',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--copper-accent)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--copper-accent)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--cream-shadow)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--espresso-ink)';
              }}
            >
              + Thêm vào Giỏ Hàng
            </button>

            <button
              id="equipment-buynow-btn"
              onClick={handleBuyNow}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--cream-base)',
                backgroundColor: 'var(--copper-accent)',
                border: 'none',
                padding: '12px 28px',
                cursor: 'pointer',
                borderRadius: '9999px',
                minHeight: '44px',
                transition: 'background-color 200ms ease',
                boxShadow: '0 2px 4px rgba(160,98,42,0.2)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--copper-light)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--copper-accent)';
              }}
            >
              Mua Ngay
            </button>
          </div>

          {/* Warranty note */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-caption)',
              color: 'var(--espresso-light)',
              marginTop: '20px',
            }}
          >
            {tier.warranty}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
