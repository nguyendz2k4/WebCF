'use client';

import React from 'react';
import { Clock, RefreshCw, Box, ShieldCheck } from 'lucide-react';

const SLA_ITEMS = [
  {
    id: 'sla_response',
    title: 'SLA Phản Hồi 15 Phút',
    subtitle: 'Đường Dây Nóng Kỹ Thuật Trực Chiến',
    description: 'Kênh hotline kỹ thuật phản hồi trong 15 phút cho mọi sự cố vận hành khẩn.',
    metric: '< 15 Phút',
    icon: Clock,
    color: 'from-[#c89b3c]/25 to-transparent',
    accentColor: 'text-[#e6bf70]',
  },
  {
    id: 'sla_maintenance',
    title: 'Bảo Trì Chủ Động Theo Chu Kỳ',
    subtitle: 'Ngăn Ngừa Sự Cố Từ Xa',
    description: 'Lịch bảo trì định kỳ theo tải vận hành để giảm downtime và ổn định chất lượng ly.',
    metric: 'Định Kỳ 3 Tháng',
    icon: RefreshCw,
    color: 'from-[#c89b3c]/25 to-transparent',
    accentColor: 'text-[#c89b3c]',
  },
  {
    id: 'sla_parts',
    title: 'Kho Linh Kiện Sẵn Sàng 24/7',
    subtitle: '100% Chính Hãng Nhập Khẩu',
    description: 'Linh kiện tiêu chuẩn luôn sẵn tại trung tâm kỹ thuật để xử lý nhanh tại chỗ.',
    metric: 'Sẵn Sàng 100%',
    icon: Box,
    color: 'from-emerald-500/20 to-transparent',
    accentColor: 'text-emerald-400',
  },
];

export const SLABadges: React.FC = () => {
  return (
    <section className="py-18 sm:py-24 relative bg-[#100c09] border-t border-[#c89b3c]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#c89b3c]">
            Cam Kết Chất Lượng Dịch Vụ
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display mt-2">
            Tiêu Chuẩn Vận Hành & Bảo Trì 24/7.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Hợp đồng SLA minh bạch với các điều khoản bảo hành, ứng cứu sự cố và bảo dưỡng định kỳ tận nơi.
          </p>
        </div>

        {/* 3 SLA Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SLA_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="rounded-3xl p-6 sm:p-8 glass-panel border border-[#c89b3c]/15 shadow-2xl relative overflow-hidden flex flex-col justify-between hover:border-[#c89b3c]/40 transition-all duration-300 group"
              >
                {/* Background Ambient Glow */}
                <div
                  className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${item.color} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-white/[0.06] flex items-center justify-center border border-white/10">
                      <Icon size={20} className={item.accentColor} />
                    </div>
                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/[0.04] border border-[#c89b3c]/30 ${item.accentColor}`}>
                      {item.metric}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 font-medium">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-neutral-300 mt-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/8 flex items-center gap-2 text-[11px] text-neutral-400">
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                  <span>Cam kết theo hợp đồng dịch vụ SLA chính thức</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
