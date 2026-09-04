'use client';

import React from 'react';
import { ProductDomain, Product } from '@/types/product';
import { EQUIPMENT_CATEGORIES, INGREDIENT_CATEGORIES } from './catalogUtils';

interface CategorySubBarProps {
  domain: ProductDomain;
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  allProducts: Product[];
}

export const CategorySubBar: React.FC<CategorySubBarProps> = ({
  domain,
  activeCategory,
  onSelectCategory,
  allProducts,
}) => {
  const categories = domain === 'equipment' ? EQUIPMENT_CATEGORIES : INGREDIENT_CATEGORIES;

  // Compute category count dynamically
  const getCategoryCount = (slug: string) => {
    if (slug === 'all') {
      return allProducts.filter((p) => p.domain === domain).length;
    }
    return allProducts.filter((p) => p.domain === domain && p.category === slug).length;
  };

  return (
    <nav
      aria-label="Danh mục sản phẩm"
      className="w-full border-b border-[var(--cream-shadow)] bg-[var(--cream-base)] sticky top-16 z-30 transition-shadow"
    >
      <div className="max-w-[var(--container-max)] mx-auto px-6 md:px-12">
        <div
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-3.5"
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          style={{ overscrollBehavior: 'contain' }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug || (!activeCategory && cat.slug === 'all');
            const count = getCategoryCount(cat.slug);

            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`relative shrink-0 pb-1 text-xs md:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[var(--espresso-ink)] font-semibold'
                    : 'text-[var(--espresso-light)] hover:text-[var(--espresso-ink)]'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[11px] font-normal text-[var(--espresso-light)]">
                  ({count})
                </span>

                {/* 2px Solid Copper Underline on Active */}
                {isActive && (
                  <span
                    className="absolute -bottom-3.5 left-0 right-0 h-[2px] bg-[var(--copper-accent)] rounded-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
