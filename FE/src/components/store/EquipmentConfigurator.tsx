'use client';

import React, { useState } from 'react';
import { EquipmentTier } from '@/types';
import { useApp } from '@/stores/AppContext';
import { Cpu, Gauge, Zap, Flame, Shield, Check, ShoppingBag, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EQUIPMENT_TIERS: EquipmentTier[] = [
  {
    id: 'eq_home_office',
    tabKey: 'home',
    label: 'Gia Đình / Văn Phòng',
    name: 'Aura Artisanal Compact Dual PID',
    subtitle: 'Chuẩn Espresso thương mại thu nhỏ cho không gian tinh tế',
    price: 28500000,
    formattedPrice: '28.500.000 ₫',
    pressure: '9 Bar',
    boiler: 'Dual PID Compact',
    pump: 'Bơm từ Rotary Mini',
    capacity: '40–80 ly/ngày',
    power: '220V · 1850W · Tiết kiệm điện Eco',
    warranty: '24 tháng bảo hành chính hãng tận nơi',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=900&auto=format&fit=crop&q=80',
    badge: 'Best Seller Cho Văn Phòng & Biệt Thự',
    features: [
      'Bộ điều khiển nhiệt PID kép sai số dưới 0.2°C',
      'Đầu Group E61 đồng nguyên khối giữ nhiệt tối ưu',
      'Vòi đánh sữa Cool-Touch chống bỏng chuẩn Barista',
      'Tích hợp chế độ Pre-infusion ủ mềm cà phê tự động',
    ],
  },
  {
    id: 'eq_medium_cafe',
    tabKey: 'medium',
    label: 'Quán Vừa & Nhỏ',
    name: 'Aura Commercial Pro 2-Group',
    subtitle: 'Cỗ máy kiếm tiền bền bỉ với lưu lượng chiết xuất liên tục',
    price: 68000000,
    formattedPrice: '68.000.000 ₫',
    pressure: '9 – 9.5 Bar Commercial',
    boiler: 'Multi-Boiler 11L Copper PID',
    pump: 'Bơm Rotary công nghiệp tải nặng',
    capacity: '150–350 ly/ngày',
    power: '220V · 3500W · Chịu tải cao điểm',
    warranty: '24 tháng · Kỹ thuật ứng cứu 2 giờ',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80',
    badge: 'Giải Pháp Chuẩn Cho Quán 60-150m²',
    features: [
      '2 Group định lượng Volumetric tự động ngắt chính xác',
      'Nồi hơi đồng 11L bù nhiệt tức thì không tuột áp khi đông khách',
      'Hệ thống xả ngược tự động Auto-Backflush làm sạch cuối ngày',
      'Đồng hồ đo áp kép hiển thị áp suất bơm và áp suất nồi hơi',
    ],
  },
  {
    id: 'eq_specialty_chain',
    tabKey: 'chain',
    label: 'Chuỗi Specialty Chuẩn Công Nghiệp',
    name: 'Aura Flagship Multi-Boiler T3 Gravitech',
    subtitle: 'Đỉnh cao công nghệ kiểm soát biến thiên áp suất và cân nặng giọt',
    price: 185000000,
    formattedPrice: '185.000.000 ₫',
    pressure: '9 Bar Gravimetric Control',
    boiler: 'Multi-Boiler T3 Isolated',
    pump: 'Bơm thể tích Rotary Variable Flow',
    capacity: '500–1200+ ly/ngày',
    power: '220V / 380V 3 Pha · 5200W',
    warranty: '36 tháng · Bảo dưỡng định kỳ 3 tháng/lần',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80',
    badge: 'Đẳng Cấp Chuỗi & Cuộc Thi Barista Quốc Tế',
    features: [
      'Công nghệ T3 kiểm soát độc lập nhiệt độ nồi hơi, group và nước pha',
      'Cân điện tử tích hợp ngay khay nhỏ giọt (Gravimetric 0.1g)',
      'Màn hình cảm ứng OLED tùy biến profile chiết xuất từng loại hạt',
      'Đèn LED rọi tách và vòi hơi điện tử Auto-Steam tạo bọt mịn tự động',
    ],
  },
];

export const EquipmentConfigurator: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<'home' | 'medium' | 'chain'>('home');
  const { addToCart, setIsCartOpen, addToast } = useApp();

  const currentTier = EQUIPMENT_TIERS.find((t) => t.tabKey === selectedKey) || EQUIPMENT_TIERS[0];

  const handleAddToCart = () => {
    addToCart({
      id: currentTier.id,
      title: currentTier.name,
      category: 'equipment',
      price: currentTier.price,
      formattedPrice: currentTier.formattedPrice,
      image: currentTier.image,
      subtitle: currentTier.label,
      specs: `${currentTier.capacity} · ${currentTier.pressure}`,
    });
    addToast('Đã thêm vào giỏ hàng', `${currentTier.name} đã được thêm vào hồ sơ báo giá.`, 'success');
  };

  return (
    <section id="san-pham" className="py-20 sm:py-28 relative bg-[#0d0a08] border-t border-[#c89b3c]/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#c89b3c]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#c89b3c]">
            Hạ Tầng Công Nghệ Pha Chế
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2 font-display">
            Thiết Bị Chiết Xuất Đỉnh Cao.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Tùy chỉnh cấu hình thiết bị chuẩn xác theo công suất phục vụ và mô hình kinh doanh của bạn.
          </p>
        </div>

        {/* Main Grid: Machine Visualizer & Spec Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Machine Visualizer Card (lg:col-span-7) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden glass-panel border border-[#c89b3c]/15 shadow-2xl relative flex flex-col justify-between min-h-[460px] sm:min-h-[540px] group">
            {/* Background Machine Image */}
            <div className="absolute inset-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentTier.id}
                  src={currentTier.image}
                  alt={currentTier.name}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 0.85, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#120d0a] via-[#120d0a]/65 to-transparent" />
            </div>

            {/* Top Badge & Live Status */}
            <div className="relative p-6 sm:p-8 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#c89b3c]/30 text-xs text-[#c89b3c] font-medium shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#c89b3c] animate-pulse" />
                <span>{currentTier.badge}</span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                  Giá niêm yết
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#e6bf70] font-mono">
                  {currentTier.formattedPrice}
                </span>
              </div>
            </div>

            {/* Bottom Machine Info */}
            <div className="relative p-6 sm:p-8 z-10">
              <span className="text-xs font-semibold text-[#c89b3c] uppercase tracking-wider block mb-1">
                {currentTier.label}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {currentTier.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-2 line-clamp-2 leading-relaxed">
                {currentTier.subtitle}
              </p>

              {/* Key Highlights */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentTier.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/8 text-[11px] text-neutral-200"
                  >
                    <Check size={13} className="text-[#c89b3c] shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#c89b3c] hover:bg-[#dfb153] text-black text-xs font-bold shadow-lg shadow-[#c89b3c]/25 transition-all active:scale-95 cursor-pointer"
                >
                  <ShoppingBag size={15} />
                  <span>Thêm Vào Giỏ Hàng & Báo Giá</span>
                </button>

                <button
                  onClick={() => {
                    handleAddToCart();
                    setIsCartOpen(true);
                  }}
                  className="py-3 px-5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar size={14} />
                  <span>Đặt Lịch Trải Nghiệm</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Selector & Technical Specs */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Category Selector Tabs */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block px-1">
                Chọn Phân Khúc Mô Hình:
              </span>
              {EQUIPMENT_TIERS.map((tier) => {
                const isSelected = tier.tabKey === selectedKey;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedKey(tier.tabKey)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'bg-gradient-to-r from-white/[0.08] to-white/[0.03] border-[#c89b3c] text-white shadow-xl'
                        : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/8 text-neutral-300'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                        {tier.label}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Công suất: {tier.capacity}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-semibold text-[#c89b3c]">
                        {tier.formattedPrice}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-[#c89b3c] bg-[#c89b3c]' : 'border-neutral-500'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Technical Spec Sheet Table */}
            <div className="p-6 rounded-3xl glass-panel border border-[#c89b3c]/15 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#c89b3c] flex items-center gap-2">
                  <Cpu size={14} />
                  <span>Bảng Thông Số Kỹ Thuật Chi Tiết</span>
                </h4>
                <span className="text-[11px] text-neutral-400">Chuẩn SCA Lab</span>
              </div>

              <div className="divide-y divide-white/5 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Gauge size={13} className="text-[#c89b3c]" />
                    Áp suất
                  </span>
                  <span className="font-semibold text-white text-right">{currentTier.pressure}</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Flame size={13} className="text-amber-400" />
                    Nồi hơi
                  </span>
                  <span className="font-semibold text-white text-right">{currentTier.boiler}</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Zap size={13} className="text-yellow-400" />
                    Bơm
                  </span>
                  <span className="font-semibold text-white text-right">{currentTier.pump}</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <ShoppingBag size={13} className="text-emerald-400" />
                    Công suất
                  </span>
                  <span className="font-semibold text-white text-right">{currentTier.capacity}</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Shield size={13} className="text-[#c89b3c]" />
                    Bảo hành & Hỗ trợ
                  </span>
                  <span className="font-semibold text-[#c89b3c] text-right">{currentTier.warranty}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
