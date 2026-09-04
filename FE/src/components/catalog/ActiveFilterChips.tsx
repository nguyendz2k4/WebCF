'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { CatalogFilterState } from '@/types/product';

interface ActiveFilterChipsProps {
  filters: CatalogFilterState;
  onRemoveFilter: (key: keyof CatalogFilterState, value?: any) => void;
  onResetAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemoveFilter,
  onResetAll,
}) => {
  const chips: { label: string; key: keyof CatalogFilterState; value?: any }[] = [];

  // Search query chip
  if (filters.searchQuery) {
    chips.push({
      label: `Từ khóa: "${filters.searchQuery}"`,
      key: 'searchQuery',
    });
  }

  // Brand chips
  filters.brand.forEach((b) => {
    chips.push({ label: b, key: 'brand', value: b });
  });

  // Domain 1: Equipment facets
  if (filters.domain === 'equipment') {
    filters.groups.forEach((g) => {
      chips.push({ label: `${g} Groups`, key: 'groups', value: g });
    });

    filters.boiler.forEach((b) => {
      chips.push({ label: b, key: 'boiler', value: b });
    });

    filters.voltage.forEach((v) => {
      chips.push({ label: `Điện áp ${v}`, key: 'voltage', value: v });
    });

    filters.suitableFor.forEach((s) => {
      const labelMap: Record<string, string> = {
        'boutique-cafe': 'Specialty Café',
        'high-volume': 'Chuỗi High-Volume',
        'lab': 'Cupping Lab & R&D',
        'home': 'Home & Studio',
        'roastery': 'Xưởng Rang Roastery',
      };
      chips.push({ label: labelMap[s] || s, key: 'suitableFor', value: s });
    });
  }

  // Domain 2: Ingredients facets
  if (filters.domain === 'ingredients') {
    filters.origin.forEach((o) => {
      chips.push({ label: `Xuất xứ: ${o}`, key: 'origin', value: o });
    });

    filters.roast.forEach((r) => {
      chips.push({ label: `Rang ${r}`, key: 'roast', value: r });
    });

    if (filters.minCupping) {
      chips.push({ label: `SCA ${filters.minCupping}+`, key: 'minCupping' });
    }
  }

  // Price range chips
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const formatPriceMin = filters.minPrice
      ? new Intl.NumberFormat('vi-VN').format(filters.minPrice) + ' ₫'
      : '0 ₫';
    const formatPriceMax = filters.maxPrice
      ? new Intl.NumberFormat('vi-VN').format(filters.maxPrice) + ' ₫'
      : 'Không giới hạn';
    chips.push({
      label: `Giá: ${formatPriceMin} – ${formatPriceMax}`,
      key: 'minPrice',
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 pt-2">
      <span className="text-xs uppercase tracking-wider text-[var(--espresso-light)] font-medium mr-1">
        Đang lọc theo:
      </span>

      {chips.map((chip, idx) => (
        <span
          key={`${chip.key}-${chip.value || idx}`}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-full text-xs text-[var(--espresso-ink)] font-normal transition-colors"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={() => onRemoveFilter(chip.key, chip.value)}
            className="p-0.5 rounded-full hover:bg-[var(--cream-shadow)] text-[var(--espresso-light)] hover:text-[var(--espresso-ink)] transition-colors cursor-pointer"
            aria-label={`Xóa bộ lọc ${chip.label}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onResetAll}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[var(--copper-accent)] hover:text-[var(--copper-light)] font-medium transition-colors cursor-pointer ml-1"
      >
        <RotateCcw size={12} />
        <span>Xóa tất cả</span>
      </button>
    </div>
  );
};
