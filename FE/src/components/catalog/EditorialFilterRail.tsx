'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { CatalogFilterState, Product } from '@/types/product';

interface EditorialFilterRailProps {
  filters: CatalogFilterState;
  onFilterChange: (updates: Partial<CatalogFilterState>) => void;
  onResetAll: () => void;
  allProducts: Product[];
}

export const EditorialFilterRail: React.FC<EditorialFilterRailProps> = ({
  filters,
  onFilterChange,
  onResetAll,
  allProducts,
}) => {
  // Accordion open/close state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    groups: true,
    boiler: true,
    brand: true,
    voltage: true,
    suitableFor: true,
    origin: true,
    roast: true,
    cupping: true,
    price: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Get available brands for the active domain
  const domainProducts = allProducts.filter((p) => p.domain === filters.domain);
  const availableBrands = Array.from(new Set(domainProducts.map((p) => p.brand))).sort();

  // Helper to toggle array filter values
  const handleToggleArray = <T extends string | number>(
    key: 'brand' | 'groups' | 'boiler' | 'voltage' | 'suitableFor' | 'origin' | 'roast',
    val: T
  ) => {
    const currentList = (filters[key] as T[]) || [];
    const exists = currentList.includes(val);
    const updated = exists ? currentList.filter((item) => item !== val) : [...currentList, val];
    onFilterChange({ [key]: updated });
  };

  return (
    <aside
      aria-label="Bộ lọc sản phẩm"
      className="w-[260px] lg:w-[280px] shrink-0 sticky top-28 self-start max-h-[calc(100vh-140px)] overflow-y-auto pr-3 no-scrollbar divide-y divide-[var(--cream-shadow)]"
    >
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-4">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--espresso-ink)]">
          Bộ Lọc Danh Mục
        </span>
        <button
          type="button"
          onClick={onResetAll}
          className="inline-flex items-center gap-1 text-[11px] text-[var(--copper-accent)] hover:text-[var(--copper-light)] font-medium transition-colors cursor-pointer"
        >
          <RotateCcw size={11} />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* ── DOMAIN 1: EQUIPMENT FACETS ── */}
      {filters.domain === 'equipment' && (
        <>
          {/* 1. Groups */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => toggleSection('groups')}
              className="flex items-center justify-between w-full text-xs font-medium uppercase tracking-wider text-[var(--espresso-ink)] mb-2.5 cursor-pointer"
            >
              <span>Phân Loại Nhóm (Groups)</span>
              {openSections.groups ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.groups && (
              <div className="space-y-2 pt-1">
                {[1, 2, 3].map((g) => {
                  const checked = filters.groups.includes(g);
                  const count = domainProducts.filter((p: any) => p.specs?.groups === g).length;
                  return (
                    <label
                      key={g}
                      className="flex items-center justify-between text-xs text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] cursor-pointer group py-0.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleArray('groups', g)}
                          className="w-3.5 h-3.5 rounded border-[var(--cream-shadow)] text-[var(--copper-accent)] focus:ring-0 cursor-pointer"
                        />
                        <span className={checked ? 'font-medium text-[var(--espresso-ink)]' : ''}>
                          {g} {g === 1 ? 'Group (Studio / Lab)' : g === 2 ? 'Groups (Standard)' : 'Groups (High-Volume)'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--espresso-light)]">({count})</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Boiler Type */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => toggleSection('boiler')}
              className="flex items-center justify-between w-full text-xs font-medium uppercase tracking-wider text-[var(--espresso-ink)] mb-2.5 cursor-pointer"
            >
              <span>Hệ Thống Nồi Hơi</span>
              {openSections.boiler ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.boiler && (
              <div className="space-y-2 pt-1">
                {['Multi-Boiler', 'Dual Boiler', 'T3 PureBrew'].map((bType) => {
                  const checked = filters.boiler.includes(bType);
                  return (
                    <label
                      key={bType}
                      className="flex items-center justify-between text-xs text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] cursor-pointer group py-0.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleArray('boiler', bType)}
                          className="w-3.5 h-3.5 rounded border-[var(--cream-shadow)] text-[var(--copper-accent)] focus:ring-0 cursor-pointer"
                        />
                        <span className={checked ? 'font-medium text-[var(--espresso-ink)]' : ''}>
                          {bType}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Voltage */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => toggleSection('voltage')}
              className="flex items-center justify-between w-full text-xs font-medium uppercase tracking-wider text-[var(--espresso-ink)] mb-2.5 cursor-pointer"
            >
              <span>Điện Áp Vận Hành</span>
              {openSections.voltage ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.voltage && (
              <div className="space-y-2 pt-1">
                {(['220V', '380V'] as const).map((volt) => {
                  const checked = filters.voltage.includes(volt);
                  return (
                    <label
                      key={volt}
                      className="flex items-center justify-between text-xs text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] cursor-pointer group py-0.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleArray('voltage', volt)}
                          className="w-3.5 h-3.5 rounded border-[var(--cream-shadow)] text-[var(--copper-accent)] focus:ring-0 cursor-pointer"
                        />
                        <span className={checked ? 'font-medium text-[var(--espresso-ink)]' : ''}>
                          {volt} {volt === '220V' ? '(1 Phase Dân Dụng)' : '(3 Phase Công Nghiệp)'}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Target Application / Suitability */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => toggleSection('suitableFor')}
              className="flex items-center justify-between w-full text-xs font-medium uppercase tracking-wider text-[var(--espresso-ink)] mb-2.5 cursor-pointer"
            >
              <span>Mô Hình Phù Hợp</span>
              {openSections.suitableFor ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.suitableFor && (
              <div className="space-y-2 pt-1">
                {[
                  { id: 'boutique-cafe', label: 'Boutique Specialty Café' },
                  { id: 'high-volume', label: 'Chuỗi High-Volume (>300 ly)' },
                  { id: 'lab', label: 'Cupping Lab & R&D' },
                  { id: 'roastery', label: 'Xưởng Rang Roastery' },
                  { id: 'home', label: 'Studio & Home Barista' },
                ].map((item) => {
                  const checked = filters.suitableFor.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className="flex items-center justify-between text-xs text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] cursor-pointer group py-0.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleArray('suitableFor', item.id)}
                          className="w-3.5 h-3.5 rounded border-[var(--cream-shadow)] text-[var(--copper-accent)] focus:ring-0 cursor-pointer"
                        />
                        <span className={checked ? 'font-medium text-[var(--espresso-ink)]' : ''}>
                          {item.label}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── DOMAIN 2: INGREDIENTS FACETS ── */}
      {filters.domain === 'ingredients' && (
        <>
          {/* 1. Origin */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => toggleSection('origin')}
              className="flex items-center justify-between w-full text-xs font-medium uppercase tracking-wider text-[var(--espresso-ink)] mb-2.5 cursor-pointer"
            >
              <span>Vùng Trồng / Xuất Xứ</span>
              {openSections.origin ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.origin && (
              <div className="space-y-2 pt-1">
                {['Cầu Đất', 'Sơn La', 'Ethiopia', 'Colombia', 'Kenya', 'Pháp', 'Nhật Bản', 'Đắk Lắk'].map(
                  (originName) => {
                    const checked = filters.origin.includes(originName);
                    return (
                      <label
                        key={originName}
                        className="flex items-center justify-between text-xs text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] cursor-pointer group py-0.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleArray('origin', originName)}
                            className="w-3.5 h-3.5 rounded border-[var(--cream-shadow)] text-[var(--copper-accent)] focus:ring-0 cursor-pointer"
                          />
                          <span className={checked ? 'font-medium text-[var(--espresso-ink)]' : ''}>
                            {originName}
                          </span>
                        </div>
                      </label>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* 2. Roast Profile */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => toggleSection('roast')}
              className="flex items-center justify-between w-full text-xs font-medium uppercase tracking-wider text-[var(--espresso-ink)] mb-2.5 cursor-pointer"
            >
              <span>Mức Độ Rang (Hạt)</span>
              {openSections.roast ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.roast && (
              <div className="space-y-2 pt-1">
                {(['Light', 'Medium', 'Medium-Dark', 'Dark'] as const).map((r) => {
                  const checked = filters.roast.includes(r);
                  return (
                    <label
                      key={r}
                      className="flex items-center justify-between text-xs text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] cursor-pointer group py-0.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleArray('roast', r)}
                          className="w-3.5 h-3.5 rounded border-[var(--cream-shadow)] text-[var(--copper-accent)] focus:ring-0 cursor-pointer"
                        />
                        <span className={checked ? 'font-medium text-[var(--espresso-ink)]' : ''}>
                          {r} Roast
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. SCA Cupping Score */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => toggleSection('cupping')}
              className="flex items-center justify-between w-full text-xs font-medium uppercase tracking-wider text-[var(--espresso-ink)] mb-2.5 cursor-pointer"
            >
              <span>Điểm Cupping SCA</span>
              {openSections.cupping ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.cupping && (
              <div className="space-y-2 pt-1">
                {[
                  { score: undefined, label: 'Tất cả mẻ rang' },
                  { score: 85, label: 'SCA 85.0+ (Specialty Grade)' },
                  { score: 87, label: 'SCA 87.0+ (Artisan Pinnacle)' },
                  { score: 88, label: 'SCA 88.0+ (Micro-Lot Cực Hiếm)' },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center gap-2.5 text-xs text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] cursor-pointer py-0.5"
                  >
                    <input
                      type="radio"
                      name="cuppingScore"
                      checked={filters.minCupping === item.score}
                      onChange={() => onFilterChange({ minCupping: item.score })}
                      className="w-3.5 h-3.5 border-[var(--cream-shadow)] text-[var(--copper-accent)] focus:ring-0 cursor-pointer"
                    />
                    <span
                      className={
                        filters.minCupping === item.score
                          ? 'font-medium text-[var(--espresso-ink)]'
                          : ''
                      }
                    >
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── COMMON FACET: BRAND ── */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full text-xs font-medium uppercase tracking-wider text-[var(--espresso-ink)] mb-2.5 cursor-pointer"
        >
          <span>Thương Hiệu ({availableBrands.length})</span>
          {openSections.brand ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSections.brand && (
          <div className="space-y-2 pt-1 max-h-48 overflow-y-auto pr-1 no-scrollbar">
            {availableBrands.map((brandName) => {
              const checked = filters.brand.includes(brandName);
              const count = domainProducts.filter((p) => p.brand === brandName).length;
              return (
                <label
                  key={brandName}
                  className="flex items-center justify-between text-xs text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] cursor-pointer group py-0.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleArray('brand', brandName)}
                      className="w-3.5 h-3.5 rounded border-[var(--cream-shadow)] text-[var(--copper-accent)] focus:ring-0 cursor-pointer shrink-0"
                    />
                    <span
                      className={`truncate ${
                        checked ? 'font-medium text-[var(--espresso-ink)]' : ''
                      }`}
                    >
                      {brandName}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--espresso-light)] shrink-0 ml-1">
                    ({count})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* ── COMMON FACET: PRICE RANGE PRESETS ── */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-xs font-medium uppercase tracking-wider text-[var(--espresso-ink)] mb-2.5 cursor-pointer"
        >
          <span>Khoảng Giá Đầu Tư</span>
          {openSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSections.price && (
          <div className="space-y-2 pt-1">
            {filters.domain === 'equipment' ? (
              [
                { min: undefined, max: undefined, label: 'Tất cả mức giá' },
                { min: 0, max: 20000000, label: 'Dưới 20.000.000 ₫' },
                { min: 20000000, max: 100000000, label: '20.000.000 – 100.000.000 ₫' },
                { min: 100000000, max: 250000000, label: '100.000.000 – 250.000.000 ₫' },
                { min: 250000000, max: undefined, label: 'Trên 250.000.000 ₫' },
              ].map((tier, idx) => {
                const checked =
                  filters.minPrice === tier.min && filters.maxPrice === tier.max;
                return (
                  <label
                    key={idx}
                    className="flex items-center gap-2.5 text-xs text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] cursor-pointer py-0.5"
                  >
                    <input
                      type="radio"
                      name="priceTierEquipment"
                      checked={checked}
                      onChange={() =>
                        onFilterChange({ minPrice: tier.min, maxPrice: tier.max })
                      }
                      className="w-3.5 h-3.5 border-[var(--cream-shadow)] text-[var(--copper-accent)] focus:ring-0 cursor-pointer"
                    />
                    <span className={checked ? 'font-medium text-[var(--espresso-ink)]' : ''}>
                      {tier.label}
                    </span>
                  </label>
                );
              })
            ) : (
              [
                { min: undefined, max: undefined, label: 'Tất cả mức giá' },
                { min: 0, max: 300000, label: 'Dưới 300.000 ₫' },
                { min: 300000, max: 500000, label: '300.000 – 500.000 ₫' },
                { min: 500000, max: undefined, label: 'Trên 500.000 ₫' },
              ].map((tier, idx) => {
                const checked =
                  filters.minPrice === tier.min && filters.maxPrice === tier.max;
                return (
                  <label
                    key={idx}
                    className="flex items-center gap-2.5 text-xs text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] cursor-pointer py-0.5"
                  >
                    <input
                      type="radio"
                      name="priceTierIngredient"
                      checked={checked}
                      onChange={() =>
                        onFilterChange({ minPrice: tier.min, maxPrice: tier.max })
                      }
                      className="w-3.5 h-3.5 border-[var(--cream-shadow)] text-[var(--copper-accent)] focus:ring-0 cursor-pointer"
                    />
                    <span className={checked ? 'font-medium text-[var(--espresso-ink)]' : ''}>
                      {tier.label}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
