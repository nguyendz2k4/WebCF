'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Layers, Ruler, Wrench, GraduationCap, CheckCircle2 } from 'lucide-react';

interface FilmstripStep {
  stepNumber: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  icon: React.ElementType;
}

const FILMSTRIP_STEPS: FilmstripStep[] = [
  {
    stepNumber: '01',
    title: 'Khảo sát & Đo đạc',
    description: 'Khảo sát mặt bằng, đo lưu lượng điện - nước, phân tích hành trình barista.',
    tag: 'Giai Đoạn 1',
    icon: Ruler,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  },
  {
    stepNumber: '02',
    title: 'Bản vẽ 3D Công Thái Học',
    description: 'Thiết kế layout công thái học và mô phỏng quầy bar theo công suất thực tế.',
    tag: 'Giai Đoạn 2',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
  },
  {
    stepNumber: '03',
    title: 'Thi Công & Cân Chỉnh',
    description: 'Thi công lắp đặt quầy bar, cân chỉnh thông số áp suất máy & nghiệm thu thực đơn.',
    tag: 'Giai Đoạn 3',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80',
  },
  {
    stepNumber: '04',
    title: 'Đào Tạo & Chuyển Giao',
    description: 'Đào tạo kỹ năng Barista chuẩn SCA, bàn giao quy trình vệ sinh & kiểm soát cost.',
    tag: 'Giai Đoạn 4',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
  },
];

export const StartupFilmstrip: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 sm:py-28 relative bg-[#0d0a08] border-t border-[#c89b3c]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1511] border border-[#c89b3c]/25 text-[11px] text-[#c89b3c] font-semibold uppercase tracking-wider mb-3 shadow-md">
              <Layers size={13} />
              <span>Quy Trình Thi Công & Triển Khai</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display mt-1">
              Setup Quán Startup Theo Filmstrip Vận Hành.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-2xl">
              Hành trình từng bước từ ý tưởng sơ khởi đến ngày khai trương hoàn hảo, được chuẩn hóa theo tiêu chuẩn công thái học quốc tế.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 mt-5 sm:mt-0 shrink-0">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-neutral-300 hover:text-[#c89b3c] transition-all active:scale-95 cursor-pointer"
              aria-label="Cuộn trái"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-neutral-300 hover:text-[#c89b3c] transition-all active:scale-95 cursor-pointer"
              aria-label="Cuộn phải"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Filmstrip Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-4 pt-2 snap-x snap-mandatory"
        >
          {FILMSTRIP_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="w-[300px] sm:w-[360px] shrink-0 snap-start rounded-3xl overflow-hidden glass-panel border border-[#c89b3c]/15 shadow-2xl relative flex flex-col justify-between min-h-[400px] group transition-all duration-300 hover:border-[#c89b3c]/50"
              >
                {/* Background Image with Dark Vignette */}
                <div className="absolute inset-0">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover opacity-45 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120d0a] via-[#120d0a]/80 to-black/45" />
                </div>

                {/* Top Step Header */}
                <div className="relative p-6 flex items-center justify-between z-10">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/65 text-[#c89b3c] border border-[#c89b3c]/30">
                    BƯỚC {step.stepNumber}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 text-[#e6bf70] flex items-center justify-center border border-white/10">
                    <Icon size={15} />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="relative p-6 z-10">
                  <span className="text-[11px] font-semibold text-[#c89b3c] uppercase tracking-wider block mb-1">
                    {step.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>Nghiệm thu tiêu chuẩn Aura Quality</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
