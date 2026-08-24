'use client';

import React, { useState } from 'react';
import { CoffeeBean } from '@/types';
import { useApp } from '@/stores/AppContext';
import { Sparkles, MapPin, Thermometer, Droplets, ShoppingBag, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COFFEE_BEANS: CoffeeBean[] = [
  {
    id: 'bean_caudat_typica',
    name: 'Specialty Cầu Đất Yellow Bourbon',
    origin: 'Cầu Đất, Đà Lạt',
    subRegion: 'Trạm Hành - Đồi Chè Cầu Đất',
    altitude: '1.650m',
    process: 'Anaerobic Natural (Lên men yếm khí 72h)',
    roastProfile: 'Medium',
    cuppingScore: 87.2,
    flavorNotes: ['Hương hoa cam', 'Quả mọng đỏ', 'Mật ong rừng', 'Độ chua thanh dịu'],
    description: 'Nguồn giống cổ Bourbon được hái chín 100% bằng tay. Chiết xuất Espresso làm bừng sáng vị ngọt trái cây nhiệt đới với hậu vị hoa cỏ kéo dài.',
    price: 480000,
    formattedPrice: '480.000 ₫',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    bagWeight: '1.000g (1kg)',
  },
  {
    id: 'bean_aura_blend',
    name: 'Aura Signature Espresso Blend',
    origin: 'Lâm Đồng, Việt Nam',
    subRegion: 'Cầu Đất (70% Arabica) & Lâm Hà (30% Fine Robusta)',
    altitude: '1.450m – 1.600m',
    process: 'Honey & Washed Process',
    roastProfile: 'Medium-Dark',
    cuppingScore: 85.5,
    flavorNotes: ['Socola đen 85%', 'Caramel bơ ngậy', 'Hạt phỉ nướng', 'Hậu vị ngọt sâu'],
    description: 'Dòng hạt chủ lực được căn chỉnh chuẩn áp suất 9 Bar. Cho lớp Crema vàng nâu dày mịn và độ đậm đà hoàn hảo cho gu cà phê sữa đá lẫn Americano.',
    price: 320000,
    formattedPrice: '320.000 ₫',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&auto=format&fit=crop&q=80',
    bagWeight: '1.000g (1kg)',
  },
  {
    id: 'bean_ethiopia_yirgacheffe',
    name: 'Ethiopia Yirgacheffe G1 Kochere',
    origin: 'Yirgacheffe, Ethiopia',
    subRegion: 'Kochere Washing Station',
    altitude: '1.900m – 2.100m',
    process: 'Natural Sun-Dried on African Beds',
    roastProfile: 'Light',
    cuppingScore: 89.0,
    flavorNotes: ['Hoa nhài tinh khiết', 'Việt quất chín', 'Vang đỏ', 'Hương đào mọng'],
    description: 'Hạt cà phê đặc sản hàng đầu thế giới dành riêng cho thực đơn Specialty Pour-Over và Espresso Single Origin cao cấp.',
    price: 650000,
    formattedPrice: '650.000 ₫',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    bagWeight: '1.000g (1kg)',
  },
  {
    id: 'bean_sonla_fine_robusta',
    name: 'Fine Robusta Chiềng Ban Honey',
    origin: 'Sơn La, Tây Bắc',
    subRegion: 'Chiềng Ban - Bản Cọ',
    altitude: '900m – 1.100m',
    process: 'Yellow Honey Specialty Fermentation',
    roastProfile: 'Medium',
    cuppingScore: 85.0,
    flavorNotes: ['Hạt óc chó', 'Cacao nguyên bản', 'Hương thảo mộc Tây Bắc', 'Body dày mượt'],
    description: 'Định nghĩa lại chất lượng Robusta Việt Nam với vị đắng sạch, hương thơm thảo mộc tự nhiên và độ đậm sánh bùng nổ.',
    price: 360000,
    formattedPrice: '360.000 ₫',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80',
    bagWeight: '1.000g (1kg)',
  },
];

export const BeansSelection: React.FC = () => {
  const { addToCart, addToast } = useApp();
  const [selectedBeanId, setSelectedBeanId] = useState<string>(COFFEE_BEANS[0].id);
  const [activeHotspot, setActiveHotspot] = useState<'origin' | 'roast' | 'extract' | null>(null);

  const selectedBean = COFFEE_BEANS.find((b) => b.id === selectedBeanId) || COFFEE_BEANS[0];

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
    addToast('Đã thêm vào giỏ', `${bean.name} (${bean.bagWeight}) đã sẵn sàng trong giỏ hàng.`, 'success');
  };

  return (
    <section id="nguon-hat" className="py-20 sm:py-28 relative bg-[#100c09] border-t border-[#c89b3c]/10 overflow-hidden">
      {/* Subtle Background Lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#c89b3c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1511] border border-[#c89b3c]/25 text-[11px] text-[#c89b3c] font-semibold uppercase tracking-wider mb-3 shadow-md">
            <Sparkles size={13} />
            <span>Nguồn Hạt Đặc Sản Rang Mộc</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display">
            Tuyển Chọn Nguồn Hạt Chuẩn Vị.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-300">
            Truy xuất vùng trồng, phương pháp sơ chế và kiểm định độ ẩm theo từng lô rang. Đảm bảo tính ổn định chiết xuất tối đa cho từng tách cà phê.
          </p>
        </div>

        {/* Interactive Showcase Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card 1 (Left): Visual Showcase with Barista Hotspots (lg:col-span-6) */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden glass-panel border border-[#c89b3c]/15 shadow-2xl relative min-h-[480px] sm:min-h-[580px] flex flex-col justify-between group">
            {/* Background High-res Bean Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=900&auto=format&fit=crop&q=80"
                alt="Tuyển chọn nguồn hạt đặc sản"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100c09] via-transparent to-black/55" />
            </div>

            {/* Hotspots */}
            {/* Hotspot 1: Vùng trồng / Sơ chế (Top Left) */}
            <div
              className="absolute top-20 left-8 z-20"
              onMouseEnter={() => setActiveHotspot('origin')}
              onMouseLeave={() => setActiveHotspot(null)}
            >
              <button
                type="button"
                onClick={() => setActiveHotspot(activeHotspot === 'origin' ? null : 'origin')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/85 backdrop-blur-xl border border-[#c89b3c]/60 text-xs font-semibold text-[#f5f5f7] hover:border-[#c89b3c] transition-all shadow-2xl hover:scale-105 cursor-pointer"
              >
                <MapPin size={13} className="text-[#c89b3c]" />
                <span>Vùng trồng / Sơ chế</span>
              </button>
              {activeHotspot === 'origin' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 w-72 p-3.5 rounded-2xl bg-[#1c1511]/95 backdrop-blur-xl border border-[#c89b3c]/25 text-xs text-white shadow-2xl"
                >
                  <p className="font-semibold text-[#c89b3c]">{selectedBean.origin}</p>
                  <p className="text-neutral-300 mt-1 text-[11px] leading-relaxed">
                    Vùng: {selectedBean.subRegion} · Độ cao: {selectedBean.altitude} · Sơ chế: {selectedBean.process}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Hotspot 2: Profile rang (Top Right / Middle) */}
            <div
              className="absolute top-36 right-8 z-20"
              onMouseEnter={() => setActiveHotspot('roast')}
              onMouseLeave={() => setActiveHotspot(null)}
            >
              <button
                type="button"
                onClick={() => setActiveHotspot(activeHotspot === 'roast' ? null : 'roast')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/85 backdrop-blur-xl border border-[#c89b3c]/60 text-xs font-semibold text-[#f5f5f7] hover:border-[#c89b3c] transition-all shadow-2xl hover:scale-105 cursor-pointer"
              >
                <Thermometer size={13} className="text-[#c89b3c]" />
                <span>Profile rang</span>
              </button>
              {activeHotspot === 'roast' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 w-72 p-3.5 rounded-2xl bg-[#1c1511]/95 backdrop-blur-xl border border-[#c89b3c]/25 text-xs text-white shadow-2xl"
                >
                  <p className="font-semibold text-[#c89b3c]">Mức rang: {selectedBean.roastProfile}</p>
                  <p className="text-neutral-300 mt-1 text-[11px] leading-relaxed">
                    Công nghệ rang Hot-Air hồi khí kiểm soát DTR (Development Time Ratio) chuẩn 15%, giữ trọn vẹn dầu thơm và hương vị tự nhiên.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Hotspot 3: Ổn định chiết xuất (Bottom Left) */}
            <div
              className="absolute bottom-28 left-8 z-20"
              onMouseEnter={() => setActiveHotspot('extract')}
              onMouseLeave={() => setActiveHotspot(null)}
            >
              <button
                type="button"
                onClick={() => setActiveHotspot(activeHotspot === 'extract' ? null : 'extract')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/85 backdrop-blur-xl border border-[#c89b3c]/60 text-xs font-semibold text-[#f5f5f7] hover:border-[#c89b3c] transition-all shadow-2xl hover:scale-105 cursor-pointer"
              >
                <Droplets size={13} className="text-[#c89b3c]" />
                <span>Ổn định chiết xuất</span>
              </button>
              {activeHotspot === 'extract' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 w-72 p-3.5 rounded-2xl bg-[#1c1511]/95 backdrop-blur-xl border border-[#c89b3c]/25 text-xs text-white shadow-2xl"
                >
                  <p className="font-semibold text-[#c89b3c]">Kiểm định độ ẩm 10.5% · TDS 18-22%</p>
                  <p className="text-neutral-300 mt-1 text-[11px] leading-relaxed">
                    Degas đúng chuẩn 7–14 ngày với van 1 chiều giúp chiết xuất lớp Crema đồng nhất cho mọi tách cà phê.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Bottom Overlay Summary */}
            <div className="relative p-6 sm:p-8 z-10">
              <div className="p-4 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-[11px] text-[#c89b3c] font-semibold uppercase tracking-wider">
                    SCA Cupping Score
                  </span>
                  <p className="text-2xl font-bold text-[#e6bf70] font-mono">
                    {selectedBean.cuppingScore} / 100
                  </p>
                </div>
                <button
                  onClick={() => handleAddBean(selectedBean)}
                  className="flex items-center gap-2 py-2.5 px-5 rounded-full bg-[#c89b3c] hover:bg-[#dfb153] text-black text-xs font-bold transition-all active:scale-95 shadow-md shadow-[#c89b3c]/25 cursor-pointer"
                >
                  <ShoppingBag size={14} />
                  <span>Chọn Loại Hạt Này</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 (Right): Coffee Bag & Catalog Selector (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            {/* Top Bag Image */}
            <div className="rounded-3xl overflow-hidden glass-panel border border-[#c89b3c]/15 relative p-6 flex items-center gap-5">
              <img
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80"
                alt="Túi hạt cà phê specialty"
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border border-white/10 shrink-0"
              />
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c89b3c] block mb-1">
                  Kiểm Định Chất Lượng Từng Lô
                </span>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Truy xuất vùng trồng, phương pháp sơ chế và kiểm định độ ẩm theo từng lô rang mộc.
                </p>
              </div>
            </div>

            {/* Beans Selector List */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block px-1">
                Danh Mục Hạt Cà Phê Đặc Sản:
              </span>

              <div className="space-y-2.5">
                {COFFEE_BEANS.map((bean) => {
                  const isSelected = bean.id === selectedBeanId;
                  return (
                    <div
                      key={bean.id}
                      onClick={() => setSelectedBeanId(bean.id)}
                      className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer border ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#2a1e17] to-[#1c1511] border-[#c89b3c] shadow-2xl'
                          : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/8'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c89b3c]/20 text-[#e6bf70] border border-[#c89b3c]/30">
                              SCA {bean.cuppingScore}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                              {bean.roastProfile}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-1.5">
                            {bean.name}
                          </h4>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {bean.origin} ({bean.bagWeight})
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-[#c89b3c] font-mono block">
                            {bean.formattedPrice}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddBean(bean);
                            }}
                            className="mt-2 p-2 rounded-full bg-white/10 hover:bg-[#c89b3c] hover:text-black text-white transition-colors cursor-pointer"
                            aria-label="Thêm vào giỏ"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Flavor Tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {bean.flavorNotes.map((flavor, fIdx) => (
                          <span
                            key={fIdx}
                            className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/5 text-neutral-300"
                          >
                            {flavor}
                          </span>
                        ))}
                      </div>

                      {isSelected && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-xs text-neutral-300 mt-3 pt-3 border-t border-white/10 leading-relaxed"
                        >
                          {bean.description}
                        </motion.p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
