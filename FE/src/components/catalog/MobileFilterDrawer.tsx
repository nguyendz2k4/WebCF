'use client';

import React, { useEffect } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
import { CatalogFilterState, Product } from '@/types/product';
import { EditorialFilterRail } from './EditorialFilterRail';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CatalogFilterState;
  onFilterChange: (updates: Partial<CatalogFilterState>) => void;
  onResetAll: () => void;
  allProducts: Product[];
  matchingCount: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetAll,
  allProducts,
  matchingCount,
}) => {
  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-filter-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[var(--espresso-dark)]/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Container (Slide Up / Max 90vh) */}
      <div
        className="relative w-full max-h-[90vh] bg-[var(--cream-base)] rounded-t-3xl shadow-2xl z-10 flex flex-col justify-between overflow-hidden border-t border-[var(--cream-shadow)] animate-in slide-in-from-bottom duration-300"
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--cream-shadow)] bg-[var(--cream-deep)]/40 shrink-0">
          <div className="flex items-center gap-2">
            <h3
              id="mobile-filter-title"
              className="text-lg font-normal text-[var(--espresso-ink)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Bộ Lọc & Tùy Chọn Tìm Kiếm
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[var(--espresso-light)] hover:text-[var(--espresso-ink)] hover:bg-[var(--cream-shadow)] transition-colors cursor-pointer"
            aria-label="Đóng bảng bộ lọc"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Filter List */}
        <div
          className="flex-1 overflow-y-auto px-6 py-4"
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          style={{ overscrollBehavior: 'contain' }}
        >
          <EditorialFilterRail
            filters={filters}
            onFilterChange={onFilterChange}
            onResetAll={onResetAll}
            allProducts={allProducts}
          />
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="p-4 border-t border-[var(--cream-shadow)] bg-[var(--cream-deep)]/60 grid grid-cols-2 gap-3 shrink-0">
          <button
            type="button"
            onClick={onResetAll}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-medium bg-[var(--cream-base)] border border-[var(--cream-shadow)] text-[var(--espresso-ink)] hover:bg-[var(--cream-deep)] transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Đặt Lại</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-medium bg-[var(--copper-accent)] text-white hover:bg-[var(--copper-light)] transition-colors cursor-pointer shadow-sm"
          >
            <Check size={15} />
            <span>Áp Dụng ({matchingCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
