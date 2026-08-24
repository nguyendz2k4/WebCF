'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PillarItem } from '@/types';
import { ChevronLeft, ChevronRight, Compass, ArrowUpRight } from 'lucide-react';

const PILLARS: PillarItem[] = [
  {
    id: 'machinery',
    number: '01',
    title: 'Machinery Brands Curated',
    subtitle: 'Thiết Bị Pha Chế Chuẩn Quốc Tế',
    description: 'Tuyển chọn độc quyền các dòng máy pha Espresso, máy xay chuyên dụng từ La Marzocco, Slayer, Mahlkönig và Victoria Arduino.',
    tag: 'Đồng Bộ Kỹ Thuật',
    accentText: 'Dual PID · 9 Bar Rotary',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'beans',
    number: '02',
    title: 'Specialty Beans / Regions',
    subtitle: 'Nguồn Hạt Đặc Sản Chuẩn Vị',
    description: 'Tuyển chọn từ các nông trại Cầu Đất, Sơn La, Ethiopia Yirgacheffe với quy trình sơ chế Natural, Washed, Honey chuẩn SCA 86+.',
    tag: 'Rang Tươi Theo Mẻ',
    accentText: 'SCA 86.5+ · Traceable',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'bar_setup',
    number: '03',
    title: 'Ergonomic Bar Installation',
    subtitle: 'Quầy Bar Công Thái Học',
    description: 'Thiết kế bố cục quầy bar chuẩn công thái học, tối ưu luồng thao tác của Barista, rút ngắn 35% thời gian ra món trong giờ cao điểm.',
    tag: 'Tối Ưu 35% Thời Gian',
    accentText: 'Zero-Waste Layout',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'startup',
    number: '04',
    title: 'Startup Package Blueprint',
    subtitle: 'Chìa Khóa Trao Tay Mô Hình Quán',
    description: 'Bản thiết kế toàn diện từ concept thực đơn, danh mục trang thiết bị, quy trình kiểm soát cost và hệ thống POS quản trị chuỗi.',
    tag: 'Từ 0 Đến Vận Hành',
    accentText: 'Turnkey Solution',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'maintenance',
    number: '05',
    title: 'Bảo Trì & Vận Hành 24/7',
    subtitle: 'Kỹ Thuật Trực Chiến Toàn Quốc',
    description: 'Đội ngũ kỹ thuật viên ứng cứu trong 2 giờ tại các thành phố lớn. Cung ứng linh kiện chính hãng và bảo dưỡng định kỳ miễn phí.',
    tag: 'Ứng Cứu Trong 2H',
    accentText: 'Zero Downtime',
    image: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'academy',
    number: '06',
    title: 'Đào Tạo Barista Chuyên Sâu',
    subtitle: 'Chuẩn Hóa Năng Lực Đội Ngũ',
    description: 'Chương trình huấn luyện Barista theo tiêu chuẩn SCA: cảm quan hương vị, kỹ thuật đánh sữa Latte Art, cân chỉnh máy và quản lý chi phí.',
    tag: 'Giáo Trình SCA Chuẩn',
    accentText: 'Sensory & Calibration',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
  },
];

export const CylindricalCarousel: React.FC = () => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number>(0);
  const currentAngleRef = useRef<number>(0);

  const totalCards = PILLARS.length;
  const angleStep = 360 / totalCards;
  const radius = 350; // Optimized radius for 1300px perspective and balanced laptop viewport

  // Smooth, slow, and cinematic desktop auto-rotation
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => prev - 0.05);
    }, 20);
    return () => clearInterval(interval);
  }, [isDragging]);

  useEffect(() => {
    currentAngleRef.current = rotationAngle;
  }, [rotationAngle]);

  const handleNext = () => {
    setRotationAngle((prev) => Math.round((prev - angleStep) / angleStep) * angleStep);
    setActiveMobileIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrev = () => {
    setRotationAngle((prev) => Math.round((prev + angleStep) / angleStep) * angleStep);
    setActiveMobileIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  // Mouse / Drag Handlers with smooth inertia
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    dragStartX.current = e.clientX;
    setRotationAngle((prev) => prev + deltaX * 0.3);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Swipe for Mobile Rotary
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    if (Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
      dragStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <section className="relative py-14 sm:py-20 overflow-hidden select-none bg-gradient-to-b from-[#0d0a08] via-[#140e0b] to-[#0d0a08] border-t border-[#c89b3c]/10">
      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1713] border border-[#c89b3c]/25 text-[11px] text-[#c89b3c] font-semibold uppercase tracking-wider mb-3 shadow-md">
          <Compass size={13} />
          <span>Vòng Tròn Giải Pháp Đồng Bộ</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
          6 Trụ Cột Nâng Tầm Giá Trị Quán Cà Phê
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Mỗi thành phần trong hệ sinh thái được kết nối chặt chẽ, tạo nên một chuỗi vận hành khép kín chuẩn hóa và đạt hiệu suất cao nhất.
        </p>
      </div>

      {/* ================= DESKTOP 3D CYLINDRICAL VIEW ================= */}
      <div
        className="hidden md:block relative h-[470px] w-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
      >
        {/* Stage Ambient Ground Shadow Reflection */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[720px] h-[100px] bg-[radial-gradient(ellipse_at_center,rgba(200,155,60,0.12)_0%,rgba(13,10,8,0.7)_50%,transparent_75%)] blur-2xl pointer-events-none" />

        {/* Perspective Stage */}
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            perspective: '1300px',
            perspectiveOrigin: '50% 46%',
          }}
        >
          {/* Cylinder Ring */}
          <div
            className="relative w-[290px] sm:w-[310px] h-[375px] sm:h-[390px] transform-style-3d transition-transform duration-75 ease-out"
            style={{
              transform: `rotateY(${rotationAngle}deg)`,
            }}
          >
            {PILLARS.map((pillar, index) => {
              const cardAngle = index * angleStep;
              return (
                <div
                  key={pillar.id}
                  className="absolute inset-0 rounded-3xl overflow-hidden glass-panel border border-[#c89b3c]/20 espresso-3d-shadow backface-visible group transition-all duration-300 hover:border-[#c89b3c]/80 hover:scale-[1.02]"
                  style={{
                    transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                    WebkitTransform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  }}
                >
                  {/* Background Image with Warm Dark Vignette */}
                  <div className="absolute inset-0">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-65"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120d0a] via-[#120d0a]/75 to-black/35" />
                  </div>

                  {/* Card Content - Compact & Balanced for Laptop Screens */}
                  <div className="relative h-full p-5 sm:p-6 flex flex-col justify-between text-white z-10">
                    {/* Top Tag & Number */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#c89b3c] border border-[#c89b3c]/30">
                        {pillar.number}
                      </span>
                      <span className="text-[10px] font-medium tracking-wider px-2.5 py-0.5 rounded-full bg-[#c89b3c]/20 text-[#e6bf70] border border-[#c89b3c]/35 shadow-sm">
                        {pillar.tag}
                      </span>
                    </div>

                    {/* Bottom Details */}
                    <div>
                      <span className="text-[10px] font-semibold text-[#c89b3c] uppercase tracking-wider block mb-1">
                        {pillar.accentText}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug group-hover:text-[#f5e4c8] transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-[11px] text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
                        {pillar.description}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-neutral-400 group-hover:text-white transition-colors">
                          Chi tiết giải pháp
                        </span>
                        <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-[#c89b3c] group-hover:text-black text-white flex items-center justify-center transition-colors">
                          <ArrowUpRight size={13} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimal Navigation Arrows Bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-1.5 rounded-full bg-[#1a130f]/80 backdrop-blur-xl border border-[#c89b3c]/20 shadow-xl z-20">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-[#c89b3c] transition-colors cursor-pointer active:scale-95"
            aria-label="Xoay sang trái"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-[11px] text-[#c89b3c] font-medium tracking-wide">
            Kéo hoặc vuốt để xoay vòng
          </span>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-[#c89b3c] transition-colors cursor-pointer active:scale-95"
            aria-label="Xoay sang phải"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE TOUCH-ROTARY VIEW ================= */}
      <div
        className="block md:hidden px-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Active Card Display */}
        <div className="relative w-full max-w-sm mx-auto min-h-[380px] rounded-3xl overflow-hidden glass-panel border border-[#c89b3c]/20 espresso-3d-shadow p-6 flex flex-col justify-between">
          <div className="absolute inset-0 -z-10">
            <img
              src={PILLARS[activeMobileIndex].image}
              alt={PILLARS[activeMobileIndex].title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120d0a] via-[#120d0a]/80 to-black/40" />
          </div>

          {/* Top Info */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/60 text-[#c89b3c] border border-[#c89b3c]/30">
              {PILLARS[activeMobileIndex].number} / 06
            </span>
            <span className="text-[10px] font-medium tracking-wider px-2.5 py-0.5 rounded-full bg-[#c89b3c]/20 text-[#e6bf70] border border-[#c89b3c]/35">
              {PILLARS[activeMobileIndex].tag}
            </span>
          </div>

          {/* Bottom Body */}
          <div className="mt-6">
            <span className="text-xs font-semibold text-[#c89b3c] uppercase tracking-wider block mb-1">
              {PILLARS[activeMobileIndex].accentText}
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
              {PILLARS[activeMobileIndex].title}
            </h3>
            <p className="text-xs font-medium text-[#f5e4c8] mt-1">
              {PILLARS[activeMobileIndex].subtitle}
            </p>
            <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
              {PILLARS[activeMobileIndex].description}
            </p>

            {/* Rotary Navigation Selector */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {PILLARS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMobileIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeMobileIndex ? 'w-6 bg-[#c89b3c]' : 'w-2 bg-white/20'
                    }`}
                    aria-label={`Trang ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-white/10 text-white active:scale-95"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-white/10 text-white active:scale-95"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Swipe Tip */}
        <p className="text-[11px] text-center text-neutral-400 mt-3 flex items-center justify-center gap-1.5">
          <span>Vuốt ngang để xoay vòng tròn giải pháp</span>
        </p>
      </div>
    </section>
  );
};

