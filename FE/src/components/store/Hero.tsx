'use client';

import React from 'react';
import { ArrowRight, ChevronRight, Award, Shield, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section id="giao-dien" className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 overflow-hidden">
      {/* Espresso Machine Ambient Backlight Glow (Vệt sáng vàng đồng ấm hắt sau tiêu đề) */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[960px] h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(200,155,60,0.2)_0%,rgba(145,95,35,0.1)_38%,rgba(13,10,8,0)_72%)] blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Apple-style Pill Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#c89b3c]/25 text-xs text-[#e5c07b] font-medium tracking-wide mb-6 backdrop-blur-md shadow-lg shadow-black/40"
        >
          <Sparkles size={13} className="text-[#c89b3c]" />
          <span>HỆ GIẢI PHÁP CHUYÊN NGHIỆP CHO QUÁN CÀ PHÊ TĂNG TRƯỞNG</span>
        </motion.div>

        {/* Hero Title with Warm Lighting */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-5xl mx-auto font-display leading-[1.08]"
        >
          HỆ SINH THÁI GIẢI PHÁP CÀ PHÊ TOÀN{' '}
          <span className="bg-gradient-to-r from-white via-[#f5e4c8] to-[#c89b3c] bg-clip-text text-transparent">
            DIỆN.
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-neutral-300 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Từ thiết bị espresso, nguồn hạt chuẩn vị đến setup vận hành và bảo trì 24/7 — một hệ giải pháp đồng bộ cho quán cà phê tăng trưởng bền vững.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#san-pham"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full bg-[#c89b3c] hover:bg-[#dfb153] text-black text-sm font-bold shadow-xl shadow-[#c89b3c]/25 transition-all duration-200 active:scale-95 group"
          >
            <span>Khám Phá Thiết Bị & Giải Pháp</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-black" />
          </a>

          <a
            href="#nguon-hat"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-white text-sm font-medium transition-all duration-200 active:scale-95"
          >
            <span>Nguồn Hạt Specialty Chuẩn Vị</span>
            <ChevronRight size={16} className="text-neutral-400" />
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-14 pt-8 border-t border-white/8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
        >
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1a1410]/80 border border-white/8 shadow-md">
            <Award className="text-[#c89b3c] shrink-0" size={20} />
            <div>
              <p className="text-xs font-semibold text-white">Chính Hãng 100%</p>
              <p className="text-[11px] text-neutral-400">Ý, Đức & Hà Lan</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1a1410]/80 border border-white/8 shadow-md">
            <Shield className="text-[#e6bf70] shrink-0" size={20} />
            <div>
              <p className="text-xs font-semibold text-white">Bảo Trì 24/7</p>
              <p className="text-[11px] text-neutral-400">Ứng cứu trong 2h</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1a1410]/80 border border-white/8 shadow-md">
            <Cpu className="text-[#c89b3c] shrink-0" size={20} />
            <div>
              <p className="text-xs font-semibold text-white">Ổn Định Chiết Xuất</p>
              <p className="text-[11px] text-neutral-400">Dual PID & 9 Bar</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1a1410]/80 border border-white/8 shadow-md">
            <Sparkles className="text-amber-400 shrink-0" size={20} />
            <div>
              <p className="text-xs font-semibold text-white">SCA Cupping 86+</p>
              <p className="text-[11px] text-neutral-400">Rang tươi theo mẻ</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
