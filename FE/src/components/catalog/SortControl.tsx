'use client';

import React from 'react';
import { LayoutGrid, ListFilter, SlidersHorizontal } from 'lucide-react';
import { CatalogSortOption, ProductDomain } from '@/types/product';
import { SORT_OPTIONS } from './catalogUtils';

interface SortControlProps {
  domain: ProductDomain;
  sort: CatalogSortOption;
  onSortChange: (sort: CatalogSortOption) => void;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  totalCount: number;
  onOpenMobileFilter: () => void;
  activeFilterCount: number;
}

export const SortControl: React.FC<SortControlProps> = ({
  domain,
  sort,
  onSortChange,
  view,
  onViewChange,
  totalCount,
  onOpenMobileFilter,
  activeFilterCount,
}) => {
  const availableSortOptions = SORT_OPTIONS.filter((opt) => opt.domains.includes(domain));

  return (
    <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--cream-shadow)] mb-6">
      {/* Product count display */}
      <div className="flex items-center gap-3">
        <span className="text-xs md:text-sm text-[var(--espresso-mid)]">
          Hiển thị <span className="font-semibold text-[var(--espresso-ink)]">{totalCount}</span> sản phẩm
        </span>

        {/* Mobile Filter Trigger Button (< 1024px) */}
        <button
          type="button"
          onClick={onOpenMobileFilter}
          className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-[var(--espresso-ink)] hover:border-[var(--copper-accent)] transition-colors cursor-pointer"
        >
          <SlidersHorizontal size={13} />
          <span>Bộ Lọc</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[var(--copper-accent)] text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Right Utility: Sort Select + Grid/List Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="catalog-sort" className="hidden sm:inline text-xs text-[var(--espresso-light)]">
            Sắp xếp theo:
          </label>
          <select
            id="catalog-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as CatalogSortOption)}
            className="px-3 py-1.5 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-lg text-xs font-medium text-[var(--espresso-ink)] focus:outline-none focus:border-[var(--copper-accent)] transition-colors cursor-pointer"
          >
            {availableSortOptions.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-[var(--cream-base)] text-[var(--espresso-ink)]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle (Grid vs List) */}
        <div className="hidden sm:inline-flex p-0.5 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-lg">
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            title="Dạng lưới (Grid)"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              view === 'grid'
                ? 'bg-[var(--cream-base)] text-[var(--espresso-ink)] shadow-xs border border-[var(--cream-shadow)]'
                : 'text-[var(--espresso-light)] hover:text-[var(--espresso-ink)]'
            }`}
            aria-label="Chuyển sang chế độ lưới"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            onClick={() => onViewChange('list')}
            title="Dạng danh sách (List)"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              view === 'list'
                ? 'bg-[var(--cream-base)] text-[var(--espresso-ink)] shadow-xs border border-[var(--cream-shadow)]'
                : 'text-[var(--espresso-light)] hover:text-[var(--espresso-ink)]'
            }`}
            aria-label="Chuyển sang chế độ danh sách"
          >
            <ListFilter size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
