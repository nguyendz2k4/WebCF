'use client';

import React from 'react';
import { RotateCcw, Send, Sparkles } from 'lucide-react';
import { Product } from '@/types/product';
import { EquipmentCard } from './EquipmentCard';
import { IngredientCard } from './IngredientCard';
import { useRouter } from 'next/navigation';

interface EmptyCatalogStateProps {
  onResetFilters: () => void;
  featuredProducts: Product[];
  onOpenQuickSpec: (product: Product) => void;
}

export const EmptyCatalogState: React.FC<EmptyCatalogStateProps> = ({
  onResetFilters,
  featuredProducts,
  onOpenQuickSpec,
}) => {
  const router = useRouter();

  const handleConciergeInquiry = () => router.push('/contact');

  return (
    <div className="py-8 space-y-12">
      {/* 1. Diagnostic & Reset Block */}
      <div className="text-center py-12 px-6 rounded-2xl bg-[var(--cream-deep)]/40 border border-[var(--cream-shadow)]">
        <div className="w-12 h-12 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-center mx-auto mb-4 text-[var(--copper-accent)]">
          <Sparkles size={20} />
        </div>

        <h3
          className="text-2xl md:text-3xl text-[var(--espresso-ink)] font-normal mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Không Tìm Thấy Sản Phẩm Phù Hợp
        </h3>
        <p className="text-sm text-[var(--espresso-mid)] max-w-md mx-auto mb-6 leading-relaxed">
          Hiện tại không có sản phẩm nào thỏa mãn toàn bộ tiêu chí lọc hoặc từ khóa bạn vừa nhập.
        </p>

        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium bg-[var(--espresso-ink)] text-[var(--cream-base)] hover:bg-[var(--espresso-mid)] transition-colors cursor-pointer shadow-sm"
        >
          <RotateCcw size={14} />
          <span>Đặt Lại Tất Cả Bộ Lọc</span>
        </button>
      </div>

      {/* 2. B2B Concierge Sourcing Banner */}
      <div className="p-8 rounded-2xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--copper-accent)] mb-2 block">
            Dịch Vụ Đặt Hàng & Tìm Nguồn Riêng · B2B Concierge Sourcing
          </span>
          <h4
            className="text-2xl text-[var(--espresso-ink)] font-normal mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Bạn đang tìm kiếm cấu hình máy độc bản hoặc nguồn hạt đặc biệt cho dự án?
          </h4>
          <p className="text-xs md:text-sm text-[var(--espresso-mid)] leading-relaxed mb-6">
            Đội ngũ kỹ sư và Master Roaster của Aura Coffee nhận tìm nguồn, nhập khẩu chính ngạch nguyên chiếc các dòng máy hiếm và tinh chỉnh mẻ rang theo đúng phong cách quầy bar của bạn.
          </p>

          <button
            type="button"
            onClick={handleConciergeInquiry}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-medium bg-[var(--copper-accent)] text-white hover:bg-[var(--copper-light)] transition-colors cursor-pointer shadow-sm"
          >
            <Send size={14} />
            <span>Gửi Yêu Cầu Tìm Nguồn Riêng →</span>
          </button>
        </div>
      </div>

      {/* 3. Curated Recommendations from Atelier */}
      {featuredProducts.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--cream-shadow)]">
            <span className="text-xs uppercase font-semibold tracking-[0.14em] text-[var(--espresso-light)]">
              Sản Phẩm Tiêu Biểu Từ Atelier
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((product) => (
              <div key={product.id}>
                {product.domain === 'equipment' ? (
                  <EquipmentCard
                    product={product as any}
                    onOpenQuickSpec={onOpenQuickSpec as any}
                  />
                ) : (
                  <IngredientCard
                    product={product as any}
                    onOpenQuickSpec={onOpenQuickSpec as any}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
