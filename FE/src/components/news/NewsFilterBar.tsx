'use client';

import React from 'react';
import { NEWS_CATEGORIES } from '@/data/news';
import { NewsCategory } from '@/types/news';

interface NewsFilterBarProps {
  selectedCategory: NewsCategory;
  onSelectCategory: (category: NewsCategory) => void;
  articleCount: number;
}

export const NewsFilterBar: React.FC<NewsFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  articleCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-[var(--cream-shadow)] mb-10">
      {/* ── Category Pills ── */}
      <div
        className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none"
        role="tablist"
        aria-label="Lọc tin tức theo chủ đề"
      >
        {NEWS_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat.id as NewsCategory)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-sans transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[var(--espresso-ink)] text-[var(--cream-base)] font-medium shadow-xs'
                  : 'bg-transparent text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] hover:bg-[var(--cream-deep)]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── Counter ── */}
      <div className="text-[12px] text-[var(--espresso-light)] font-sans flex items-center gap-1.5 self-end sm:self-auto">
        <span>Hiển thị</span>
        <span className="font-semibold text-[var(--espresso-ink)]">{articleCount}</span>
        <span>bài viết</span>
      </div>
    </div>
  );
};
