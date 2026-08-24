'use client';

import React, { useState, useMemo } from 'react';
import { Sliders, Cpu, Coffee, Wrench, ArrowRight, Sparkles, FileText } from 'lucide-react';
import { useApp } from '@/stores/AppContext';

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
    recommendedMachine: 'AURA Studio 1 Group Compact Dual PID',
    recommendedBeans: 'Single-origin chủ đạo + blend signature quán',
    recommendedBuild: 'Gói Startup Tối Ưu Mặt Bằng Nhỏ Gọn',
    rawEstimatedPrice: 95000000,
  },
  {
    id: 'takeaway',
    name: 'Takeaway Espresso Bar',
    defaultCapacity: 250,
    defaultBudget: 280,
    recommendedMachine: 'AURA Commercial Pro 2-Group High-Speed',
    recommendedBeans: 'Aura Signature Espresso Blend (Cầu Đất - Lâm Hà)',
    recommendedBuild: 'Module Quầy Bar Lắp Ghép Fast-Service',
    rawEstimatedPrice: 78000000,
  },
  {
    id: 'medium_cafe',
    name: 'Quán Cà Phê Vừa & Nhỏ (50–120m²)',
    defaultCapacity: 350,
    defaultBudget: 650,
    recommendedMachine: 'AURA Commercial Pro 2-Group Volumetric PID',
    recommendedBeans: 'Bộ đôi Cầu Đất Bourbon & Chiềng Ban Honey',
    recommendedBuild: 'Gói Chìa Khóa Trao Tay Bar Công Thái Học 3D',
    rawEstimatedPrice: 145000000,
  },
  {
    id: 'flagship',
    name: 'Flagship Roastery & Specialty Store',
    defaultCapacity: 800,
    defaultBudget: 1500,
    recommendedMachine: 'AURA Flagship Multi-Boiler T3 Gravitech 3-Group',
    recommendedBeans: 'Thực đơn 4 vùng hạt: Ethiopia, Colombia, Cầu Đất, Sơn La',
    recommendedBuild: 'Thiết Kế Bar Trải Nghiệm Open-Bar Đẳng Cấp',
    rawEstimatedPrice: 285000000,
  },
  {
    id: 'chain',
    name: 'Chuỗi F&B & Khách Sạn Cao Cấp',
    defaultCapacity: 1200,
    defaultBudget: 2200,
    recommendedMachine: 'Hệ Thống Dual Machine T3 + Máy Xay Mahlkönig Đồng Bộ',
    recommendedBeans: 'Gia công Rang Custom Profile độc quyền theo chuỗi',
    recommendedBuild: 'Chuẩn Hóa Thiết Bị Chuỗi & Bảo Trì 24/7 Toàn Quốc',
    rawEstimatedPrice: 420000000,
  },
];

export const ProjectConfigurator: React.FC = () => {
  const { addToCart, setIsCartOpen, addToast } = useApp();
  const [selectedModelId, setSelectedModelId] = useState<string>('kiosk');
  const [capacity, setCapacity] = useState<number>(120);
  const [budget, setBudget] = useState<number>(450);

  const currentModel = useMemo(() => {
    return MODEL_OPTIONS.find((m) => m.id === selectedModelId) || MODEL_OPTIONS[0];
  }, [selectedModelId]);

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    const m = MODEL_OPTIONS.find((opt) => opt.id === modelId);
    if (m) {
      setCapacity(m.defaultCapacity);
      setBudget(m.defaultBudget);
    }
  };

  // Dynamic recommendation based on capacity and budget adjustments
  const dynamicRecommendation = useMemo(() => {
    let machine = currentModel.recommendedMachine;
    let beans = currentModel.recommendedBeans;
    let build = currentModel.recommendedBuild;

    if (capacity > 500) {
      machine = 'AURA Flagship Multi-Boiler T3 Gravitech (Chịu tải cao điểm)';
    } else if (capacity > 200) {
      machine = 'AURA Commercial Pro 2-Group Volumetric';
    }

    if (budget > 1000) {
      build = 'Gói Thi Công Bar Cao Cấp & Hệ Thống Xử Lý Nước RO Lab';
    }

    return { machine, beans, build };
  }, [currentModel, capacity, budget]);

  const handleRequestQuote = () => {
    addToCart({
      id: `cfg_${selectedModelId}_${capacity}_${budget}`,
      title: `Giải Pháp ${currentModel.name} (${capacity} ly/ngày)`,
      category: 'package',
      price: currentModel.rawEstimatedPrice,
      formattedPrice: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentModel.rawEstimatedPrice),
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      subtitle: `Ngân sách dự kiến: ${budget} triệu VND`,
      specs: `${dynamicRecommendation.machine} · ${dynamicRecommendation.beans}`,
    });

    addToast(
      'Đã lưu cấu hình giải pháp',
      `Đã đưa đề xuất cho ${currentModel.name} vào hồ sơ báo giá.`,
      'success'
    );
    setIsCartOpen(true);
  };

  return (
    <section className="py-20 sm:py-28 relative bg-[#100c09] border-t border-[#c89b3c]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1511] border border-[#c89b3c]/25 text-[11px] text-[#c89b3c] font-semibold uppercase tracking-wider mb-3 shadow-md">
            <Sliders size={13} />
            <span>Bộ Công Cụ Dự Toán Thông Minh</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display">
            Cấu Hình Giải Pháp Tối Ưu Cho Dự Án.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Tùy biến mô hình, sản lượng kỳ vọng và ngân sách để nhận ngay đề xuất đồng bộ về máy móc, hạt và bản vẽ 3D quầy bar.
          </p>
        </div>

        {/* 2 Columns Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Card: Input Sliders & Model Selector (lg:col-span-6) */}
          <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 glass-panel border border-[#c89b3c]/15 shadow-2xl flex flex-col justify-between space-y-6">
            {/* Mô hình quán Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Mô hình quán
              </label>
              <div className="relative">
                <select
                  value={selectedModelId}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full appearance-none px-4 py-3.5 rounded-2xl bg-black/60 border border-[#c89b3c]/20 text-sm font-medium text-white focus:outline-none focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c] transition-all cursor-pointer"
                >
                  {MODEL_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#1c1511] text-white">
                      {opt.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Slider 1: Công suất ly/ngày */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Công suất ly/ngày
                </label>
                <span className="text-sm font-bold text-[#e6bf70] font-mono">
                  {capacity} ly/ngày
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="1500"
                step="10"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full h-2 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#c89b3c]"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>30 ly</span>
                <span>500 ly</span>
                <span>1500+ ly</span>
              </div>
            </div>

            {/* Slider 2: Ngân sách (triệu VND) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Ngân sách dự kiến (triệu VND)
                </label>
                <span className="text-sm font-bold text-[#c89b3c] font-mono">
                  {budget} triệu ₫
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#c89b3c]"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>50 tr</span>
                <span>1.000 tr</span>
                <span>2.000+ tr</span>
              </div>
            </div>
          </div>

          {/* Right Card: Đề xuất giải pháp (lg:col-span-6) */}
          <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 glass-panel-glow border border-[#c89b3c]/40 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles size={16} className="text-[#c89b3c]" />
                  <span>Đề xuất giải pháp đồng bộ</span>
                </h3>
                <span className="text-[11px] font-semibold text-[#c89b3c] uppercase tracking-wider">
                  Khuyến nghị AI
                </span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm">
                {/* Máy đề xuất */}
                <div className="p-3.5 rounded-2xl bg-black/55 border border-[#c89b3c]/15 space-y-1">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Cpu size={13} className="text-[#c89b3c]" />
                    Máy pha & máy xay khuyến nghị:
                  </span>
                  <p className="font-bold text-white text-sm">
                    {dynamicRecommendation.machine}
                  </p>
                </div>

                {/* Nguồn hạt đề xuất */}
                <div className="p-3.5 rounded-2xl bg-black/55 border border-[#c89b3c]/15 space-y-1">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Coffee size={13} className="text-[#c89b3c]" />
                    Nguồn hạt & Profile rang:
                  </span>
                  <p className="font-bold text-white text-sm">
                    {dynamicRecommendation.beans}
                  </p>
                </div>

                {/* Thi công đề xuất */}
                <div className="p-3.5 rounded-2xl bg-black/55 border border-[#c89b3c]/15 space-y-1">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Wrench size={13} className="text-emerald-400" />
                    Thi công & Setup quầy bar:
                  </span>
                  <p className="font-bold text-white text-sm">
                    {dynamicRecommendation.build}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={handleRequestQuote}
                className="w-full py-3.5 px-6 rounded-full bg-[#c89b3c] hover:bg-[#dfb153] text-black text-xs sm:text-sm font-bold tracking-tight shadow-xl shadow-[#c89b3c]/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <FileText size={16} />
                <span>Nhận Báo Giá & Bản Vẽ Bar 3D Miễn Phí</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
