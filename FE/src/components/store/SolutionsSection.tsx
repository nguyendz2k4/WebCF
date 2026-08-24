'use client';

import React from 'react';
import { SolutionPackage } from '@/types';
import { useApp } from '@/stores/AppContext';
import { Check, Layers, ArrowRight } from 'lucide-react';

const PACKAGES: SolutionPackage[] = [
  {
    id: 'pkg_startup_turnkey',
    name: 'Gói Setup Khởi Nghiệp Toàn Diện',
    target: 'Quán cà phê mới mở (40m² – 120m²)',
    price: '95.000.000 ₫',
    rawPrice: 95000000,
    popular: true,
    badge: 'Được 85% Khách Hàng Lựa Chọn',
    description: 'Giải pháp Chìa Khóa Trao Tay đồng bộ từ thiết bị máy móc đến menu món và quy trình vận hành.',
    features: [
      'Máy pha Espresso Commercial 2-Group Dual PID chính hãng',
      'Máy xay cà phê On-Demand tự động định lượng vi sai',
      'Bản vẽ 2D/3D bố trí quầy bar công thái học tối ưu diện tích',
      'Khóa đào tạo Barista chuẩn SCA & chuyển giao 25 công thức Signature',
      'Tặng kèm 10kg hạt Specialty Cầu Đất rang tươi mở quán',
      'Bảo hành 24 tháng · Kỹ thuật hỗ trợ khai trương trực tiếp',
    ],
  },
  {
    id: 'pkg_specialty_upgrade',
    name: 'Gói Nâng Cấp Chuẩn Specialty Pro',
    target: 'Chuỗi cà phê & Quán định vị cao cấp',
    price: '198.000.000 ₫',
    rawPrice: 198000000,
    badge: 'Đỉnh Cao Kỹ Thuật & Tối Ưu Cost',
    description: 'Hạ tầng máy pha công nghệ đa nồi hơi T3 kết hợp hệ thống xử lý nước khoáng chuẩn cupping.',
    features: [
      'Máy pha Flagship Multi-Boiler T3 Gravitech kiểm soát biến thiên áp',
      'Máy xay phẳng Mahlkönig chuyên dụng Specialty',
      'Hệ thống lọc nước khoáng công nghệ RO Remineralizer chuẩn SCA',
      'Cân điện tử thông minh Bluetooth kết nối ứng dụng quản trị shot',
      'Khóa huấn luyện cảm quan Sensory & Quản trị Cost nguyên vật liệu',
      'Gói bảo trì VIP 24/7 · Định kỳ kiểm định áp suất 3 tháng/lần',
    ],
  },
  {
    id: 'pkg_rental_supply',
    name: 'Gói Thuê Máy & Cung Ứng Hạt Định Kỳ',
    target: 'Khách sạn, Resort, Văn phòng tập đoàn & Chuỗi F&B',
    price: '8.500.000 ₫ / tháng',
    rawPrice: 8500000,
    badge: 'Không Cần Vốn Đầu Tư Ban Đầu (0đ CapEx)',
    description: 'Giải pháp linh hoạt tối đa ngân sách dòng tiền với nguồn hạt rang mộc ổn định giao định kỳ hàng tuần.',
    features: [
      'Miễn phí 100% chi phí đặt cọc máy pha Espresso tự động hoặc bán tự động',
      'Định mức cung ứng hạt Specialty từ 20kg – 100kg/tháng chiết khấu cao',
      'Miễn phí 100% công bảo dưỡng, thay thế gioăng phớt, linh kiện hao mòn',
      'Đổi mới thiết bị tương đương ngay trong ngày nếu phát sinh sự cố',
      'Báo cáo phân tích chất lượng tách cà phê định kỳ theo tháng',
    ],
  },
];

export const SolutionsSection: React.FC = () => {
  const { addToCart, setIsCartOpen, addToast } = useApp();

  const handleAddPackage = (pkg: SolutionPackage) => {
    addToCart({
      id: pkg.id,
      title: pkg.name,
      category: 'package',
      price: pkg.rawPrice,
      formattedPrice: pkg.price,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      subtitle: pkg.target,
      specs: pkg.badge,
    });
    addToast('Đã thêm giải pháp', `${pkg.name} đã được đưa vào hồ sơ báo giá.`, 'success');
  };

  return (
    <section id="giai-phap" className="py-20 sm:py-28 relative bg-[#0d0a08] border-t border-[#c89b3c]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1511] border border-[#c89b3c]/25 text-[11px] text-[#c89b3c] font-semibold uppercase tracking-wider mb-3 shadow-md">
            <Layers size={13} />
            <span>Gói Dịch Vụ Đồng Bộ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display">
            Giải Pháp Setup & Vận Hành Trọn Gói.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Được thiết kế tối ưu cho từng giai đoạn phát triển của doanh nghiệp F&B, giúp tiết kiệm đến 30% chi phí đầu tư ban đầu.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                pkg.popular
                  ? 'glass-panel-glow border-[#c89b3c] shadow-2xl scale-[1.02] z-10'
                  : 'glass-panel border-[#c89b3c]/15 hover:border-[#c89b3c]/40'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#c89b3c] text-black text-[11px] font-bold tracking-wider uppercase shadow-lg">
                  {pkg.badge}
                </div>
              )}

              <div>
                <span className="text-[11px] font-semibold text-[#c89b3c] uppercase tracking-wider block">
                  {pkg.target}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5 leading-snug">
                  {pkg.name}
                </h3>
                <p className="text-xs text-neutral-300 mt-2.5 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="mt-6 pt-5 border-t border-white/10">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                    Chi phí trọn gói
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#e6bf70] font-mono mt-0.5 block">
                    {pkg.price}
                  </span>
                </div>

                {/* Features List */}
                <div className="mt-6 space-y-3">
                  {pkg.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <div className="w-4 h-4 rounded-full bg-[#c89b3c]/20 text-[#e6bf70] flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Action */}
              <div className="mt-8 pt-5 border-t border-white/10">
                <button
                  onClick={() => {
                    handleAddPackage(pkg);
                    setIsCartOpen(true);
                  }}
                  className={`w-full py-3.5 px-6 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg cursor-pointer ${
                    pkg.popular
                      ? 'bg-[#c89b3c] hover:bg-[#dfb153] text-black shadow-[#c89b3c]/25'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 hover:border-[#c89b3c]/40'
                  }`}
                >
                  <span>Nhận Báo Giá & Bản Vẽ Chi Tiết</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
