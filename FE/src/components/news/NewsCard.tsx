'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, ArrowUpRight } from 'lucide-react';
import { NewsArticle } from '@/types/news';

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
    <article
      className="group flex flex-col h-full bg-[var(--cream-base)] border border-[var(--cream-shadow)] rounded-lg overflow-hidden transition-all duration-300 hover:border-[var(--copper-accent)]/50 hover:shadow-[0_8px_30px_rgba(26,18,8,0.06)]"
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Image Container ── */}
      <Link
        href={`/news/${article.slug}`}
        className="relative block w-full aspect-16/10 overflow-hidden bg-[var(--cream-deep)]"
        aria-label={`Đọc bài viết: ${article.title}`}
      >
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-[var(--cream-base)]/90 backdrop-blur-xs px-3 py-1 rounded-full border border-[var(--cream-shadow)]">
          <span className="text-[11px] font-medium tracking-widest uppercase text-[var(--copper-accent)]">
            {article.categoryLabel}
          </span>
        </div>
      </Link>

      {/* ── Body Content ── */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-4 text-[12px] text-[var(--espresso-light)] mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} strokeWidth={1.5} className="text-[var(--copper-accent)]" />
              {article.publishedAt}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--cream-shadow)]" />
            <span className="flex items-center gap-1.5">
              <Clock size={13} strokeWidth={1.5} />
              {article.readTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-3">
            <Link
              href={`/news/${article.slug}`}
              className="font-serif text-[20px] lg:text-[22px] font-normal leading-snug text-[var(--espresso-ink)] group-hover:text-[var(--copper-accent)] transition-colors duration-200 line-clamp-2"
            >
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="font-sans text-[14px] text-[var(--espresso-mid)] line-clamp-3 leading-relaxed mb-6">
            {article.excerpt}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-4 border-t border-[var(--cream-shadow)] flex items-center justify-between">
          <span className="text-[12px] font-medium text-[var(--espresso-light)]">
            Tác giả: {article.author.name}
          </span>
          <Link
            href={`/news/${article.slug}`}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--copper-accent)] group-hover:text-[var(--copper-light)] transition-colors"
          >
            Chi tiết
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
