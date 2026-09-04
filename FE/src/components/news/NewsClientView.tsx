'use client';

import React, { useState, useMemo } from 'react';
import { NEWS_ARTICLES } from '@/data/news';
import { NewsCategory } from '@/types/news';
import { NewsCard } from './NewsCard';
import { NewsFilterBar } from './NewsFilterBar';

export const NewsClientView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') {
      return NEWS_ARTICLES;
    }
    return NEWS_ARTICLES.filter((article) => article.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section className="w-full">
      {/* ── Topic Filter Bar ── */}
      <NewsFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        articleCount={filteredArticles.length}
      />

      {/* ── Articles Grid ── */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-[var(--cream-shadow)] rounded-lg bg-[var(--cream-deep)]/40">
          <p className="font-serif text-[20px] text-[var(--espresso-ink)] mb-2">
            Chưa có bài viết trong chủ đề này
          </p>
          <p className="font-sans text-[14px] text-[var(--espresso-light)]">
            Vui lòng chọn chủ đề khác hoặc quay lại danh mục tất cả tin tức.
          </p>
        </div>
      )}
    </section>
  );
};
