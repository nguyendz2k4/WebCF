'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/stores/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ModelOption {
  id: string;
  name: string;
  defaultCapacity: number;
  defaultBudget: number;
  recommendedMachine: string;
  recommendedBeans: string;
  recommendedBuild: string;
  rawEstimatedPrice: number;
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'kiosk',
    name: 'Kiosk Specialty',
    defaultCapacity: 120,
    defaultBudget: 450,
    recommendedMachine: 'Aura Artisanal Compact Dual PID',
    recommendedBeans: 'Single-origin chủ đạo + blend signature quán',
    recommendedBuild: 'Gói Startup — tối ưu mặt bằng nhỏ gọn',
    rawEstimatedPrice: 95000000,
  },
  {
    id: 'takeaway',
    name: 'Takeaway Espresso Bar',
    defaultCapacity: 250,
    defaultBudget: 280,
    recommendedMachine: 'Aura Commercial Pro 2-Group',
    recommendedBeans: 'Aura Signature Blend (Cầu Đất – Lâm Hà)',
    recommendedBuild: 'Module quầy bar lắp ghép fast-service',
    rawEstimatedPrice: 78000000,
  },
  {
    id: 'medium_cafe',
    name: 'Quán Vừa & Nhỏ (50–120m²)',
    defaultCapacity: 350,
    defaultBudget: 650,
    recommendedMachine: 'Aura Commercial Pro 2-Group Volumetric PID',
    recommendedBeans: 'Cầu Đất Bourbon & Chiềng Ban Honey',
    recommendedBuild: 'Gói chìa khóa trao tay — bar công thái học',
    rawEstimatedPrice: 145000000,
  },
  {
    id: 'flagship',
    name: 'Flagship Roastery & Specialty',
    defaultCapacity: 800,
    defaultBudget: 1500,
    recommendedMachine: 'Aura Flagship Multi-Boiler T3 Gravitech',
    recommendedBeans: 'Thực đơn 4 vùng hạt: Ethiopia, Colombia, Cầu Đất, Sơn La',
    recommendedBuild: 'Thiết kế bar trải nghiệm open-bar đẳng cấp',
    rawEstimatedPrice: 285000000,
  },
  {
    id: 'chain',
    name: 'Chuỗi F&B & Khách Sạn',
    defaultCapacity: 1200,
    defaultBudget: 2200,
    recommendedMachine: 'Hệ thống Dual Machine T3 + Mahlkönig đồng bộ',
    recommendedBeans: 'Gia công rang custom profile độc quyền theo chuỗi',
    recommendedBuild: 'Chuẩn hóa thiết bị chuỗi & bảo trì 24/7 toàn quốc',
    rawEstimatedPrice: 420000000,
  },
];

/* Custom chevron for select */
function ChevronDown() {
  return (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
      <path d="M1 1L6 6L11 1" stroke="var(--copper-accent)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export const ProjectBuilder: React.FC = () => {
  const { addToCart, setIsCartOpen, addToast } = useApp();
  const [selectedModelId, setSelectedModelId] = useState('kiosk');
  const [capacity, setCapacity] = useState(120);
  const [budget, setBudget] = useState(450);

  const currentModel = useMemo(
    () => MODEL_OPTIONS.find((m) => m.id === selectedModelId) || MODEL_OPTIONS[0],
    [selectedModelId]
  );

  const recommendation = useMemo(() => {
    let machine = currentModel.recommendedMachine;
    if (capacity > 500) machine = 'Aura Flagship Multi-Boiler T3 Gravitech';
    else if (capacity > 200) machine = 'Aura Commercial Pro 2-Group Volumetric';

    let beans = currentModel.recommendedBeans;
    if (budget > 1000) beans = 'Thực đơn multi-origin 4 vùng hạt';
    else if (budget < 300) beans = 'Aura Signature Blend — tối ưu chi phí';

    return { machine, beans, build: currentModel.recommendedBuild };
  }, [currentModel, capacity, budget]);

  const handleGetQuote = () => {
    addToCart({
      id: `project_${selectedModelId}`,
      title: `Dự Án: ${currentModel.name}`,
      category: 'package',
      price: currentModel.rawEstimatedPrice,
      formattedPrice: `${(currentModel.rawEstimatedPrice / 1_000_000).toFixed(0)}M ₫`,
      image: '',
      subtitle: `${capacity} ly/ngày · ${budget}m²`,
      specs: `${recommendation.machine}`,
    });
    addToast('Đã thêm hồ sơ', `Dự án ${currentModel.name} đã được thêm để nhận báo giá.`, 'success');
    setIsCartOpen(true);
  };

  const SliderInput = ({
    id,
    label,
    value,
    min,
    max,
    unit,
    onChange,
  }: {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    unit: string;
    onChange: (v: number) => void;
  }) => (
    <div style={{ marginBottom: '32px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '12px',
        }}
      >
        <label
          htmlFor={id}
          className="label-text"
        >
          {label}
        </label>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--espresso-ink)',
          }}
        >
          {value.toLocaleString('vi-VN')} {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label}: ${value} ${unit}`}
        style={{
          width: '100%',
          height: '2px',
          appearance: 'none',
          WebkitAppearance: 'none',
          backgroundColor: 'var(--cream-shadow)',
          outline: 'none',
          cursor: 'pointer',
          accentColor: 'var(--copper-accent)',
        }}
      />
    </div>
  );

  return (
    <section
      id="builder"
      aria-label="Cấu hình dự án — Aura Coffee"
      style={{
        backgroundColor: 'var(--cream-deep)',
        paddingBlock: 'var(--section-y)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          marginInline: 'auto',
          paddingInline: 'var(--container-x)',
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1fr',
          gap: '0',
          alignItems: 'start',
        }}
        className="grid-cols-1 lg:grid-cols-[1fr_1px_1fr]"
      >
        {/* ── Left: Input controls ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ paddingRight: 'clamp(24px, 4vw, 64px)', paddingBottom: '0' }}
          className="pr-0 pb-8 lg:pr-16"
        >
          <p className="label-text" style={{ marginBottom: '16px' }}>
            Cấu Hình Giải Pháp
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-section)',
              fontWeight: 400,
              color: 'var(--espresso-ink)',
              lineHeight: 1.1,
              marginBottom: '40px',
            }}
          >
            Cấu hình giải pháp.
          </h2>

          {/* Custom select — mô hình */}
          <div style={{ marginBottom: '32px' }}>
            <label htmlFor="model-select" className="label-text" style={{ display: 'block', marginBottom: '12px' }}>
              Mô Hình Kinh Doanh
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="model-select"
                value={selectedModelId}
                onChange={(e) => {
                  setSelectedModelId(e.target.value);
                  const m = MODEL_OPTIONS.find((o) => o.id === e.target.value);
                  if (m) { setCapacity(m.defaultCapacity); setBudget(m.defaultBudget); }
                }}
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  color: 'var(--espresso-ink)',
                  backgroundColor: 'var(--cream-base)',
                  border: '1px solid var(--cream-shadow)',
                  borderRadius: '0',
                  padding: '12px 40px 12px 14px',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer',
                  minHeight: '44px',
                  outline: 'none',
                }}
              >
                {MODEL_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <div
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <ChevronDown />
              </div>
            </div>
          </div>

          <SliderInput
            id="capacity-slider"
            label="Sản Lượng Ly / Ngày"
            value={capacity}
            min={50}
            max={2000}
            unit="ly"
            onChange={setCapacity}
          />

          <SliderInput
            id="budget-slider"
            label="Diện Tích Mặt Bằng"
            value={budget}
            min={20}
            max={3000}
            unit="m²"
            onChange={setBudget}
          />
        </motion.div>

        {/* Vertical divider — desktop only */}
        <div
          className="hidden lg:block"
          style={{ backgroundColor: 'var(--cream-shadow)', alignSelf: 'stretch' }}
          aria-hidden="true"
        />
        {/* Mobile horizontal divider */}
        <div className="hairline block lg:hidden" style={{ gridColumn: '1 / -1', marginBlock: '0' }} aria-hidden="true" />

        {/* ── Right: Live result ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ paddingLeft: 'clamp(24px, 4vw, 64px)' }}
          className="pl-0 pt-8 lg:pl-16 lg:pt-0"
        >
          <p className="label-text" style={{ marginBottom: '32px' }}>
            Đề Xuất Cho Bạn
          </p>

          {/* Three recommendation lines */}
          {[
            { label: 'Thiết Bị', value: recommendation.machine },
            { label: 'Nguồn Hạt', value: recommendation.beans },
            { label: 'Gói Triển Khai', value: recommendation.build },
          ].map((line, i) => (
            <React.Fragment key={line.label}>
              <div style={{ paddingBlock: '20px' }}>
                <p className="label-text" style={{ marginBottom: '8px' }}>
                  {line.label}
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${selectedModelId}-${capacity}-${budget}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'var(--espresso-ink)',
                      lineHeight: 1.4,
                    }}
                  >
                    {line.value}
                  </motion.p>
                </AnimatePresence>
              </div>
              {i < 2 && <div className="hairline" aria-hidden="true" />}
            </React.Fragment>
          ))}

          {/* Primary CTA */}
          <button
            id="builder-cta"
            onClick={handleGetQuote}
            style={{
              marginTop: '40px',
              width: '100%',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--cream-base)',
              backgroundColor: 'var(--copper-accent)',
              border: 'none',
              padding: '0 28px',
              height: '48px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'background-color 250ms ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--copper-light)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--copper-accent)';
            }}
          >
            Nhận Báo Giá & Bản Vẽ Bar
          </button>
        </motion.div>
      </div>
    </section>
  );
};
