'use client';

import React from 'react';
import { ProductDomain } from '@/types/product';

interface CatalogHeaderProps {
  activeDomain: ProductDomain;
  onDomainChange: (domain: ProductDomain) => void;
  totalCount: number;
}

export const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  activeDomain,
  onDomainChange,
  totalCount,
}) => {
  return (
    <header className="pt-28 pb-8 border-b border-[var(--cream-shadow)]">
      <div className="max-w-[var(--container-max)] mx-auto px-6 md:px-12">
        {/* Editorial Chapter Label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs tracking-[0.14em] uppercase text-[var(--copper-accent)] font-medium">
            [02 / ATELIER CATALOG]
          </span>
          <span className="w-8 h-[1px] bg-[var(--cream-shadow)]" />
          <span className="text-xs uppercase tracking-[0.14em] text-[var(--espresso-light)]">
            {activeDomain === 'equipment' ? 'Thiết Bị Cà Phê Chuyên Nghiệp' : 'Nguyên Liệu Đặc Sản Chuẩn Atelier'}
          </span>
        </div>

        {/* Headline & Subtitle */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-normal text-[var(--espresso-ink)] tracking-tight leading-[1.1]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Bộ Sưu Tập {activeDomain === 'equipment' ? 'Thiết Bị' : 'Nguyên Liệu'} Chuẩn Atelier
            </h1>
            <p className="mt-4 text-base md:text-lg text-[var(--espresso-mid)] max-w-2xl leading-relaxed">
              {activeDomain === 'equipment'
                ? 'Tuyển chọn máy pha đa nồi hơi chuẩn SCA, máy xay độ chính xác micromet, máy rang thủ công và dụng cụ barista chuyên nghiệp nhập khẩu chính hãng.'
                : 'Những mẻ rang hạt đặc sản thu hoạch tại độ cao 1.650m Cầu Đất, siro 1883 dãy Alps, bột cốt tự nhiên và matcha nghiền cối đá truyền thống Uji Kyoto.'}
            </p>
          </div>

          {/* Domain Switcher Pill (B2B Split Engine) */}
          <div className="shrink-0">
            <div className="inline-flex p-1.5 bg-[var(--cream-deep)] rounded-full border border-[var(--cream-shadow)]">
              <button
                type="button"
                onClick={() => onDomainChange('equipment')}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeDomain === 'equipment'
                    ? 'bg-[var(--cream-base)] text-[var(--espresso-ink)] shadow-sm border border-[var(--cream-shadow)]'
                    : 'text-[var(--espresso-light)] hover:text-[var(--espresso-ink)]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeDomain === 'equipment' ? 'bg-[var(--copper-accent)]' : 'bg-transparent'
                  }`}
                />
                <span>Thiết Bị Cà Phê</span>
              </button>

              <button
                type="button"
                onClick={() => onDomainChange('ingredients')}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeDomain === 'ingredients'
                    ? 'bg-[var(--cream-base)] text-[var(--espresso-ink)] shadow-sm border border-[var(--cream-shadow)]'
                    : 'text-[var(--espresso-light)] hover:text-[var(--espresso-ink)]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeDomain === 'ingredients' ? 'bg-[var(--copper-accent)]' : 'bg-transparent'
                  }`}
                />
                <span>Nguyên Liệu Pha Chế</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
