'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CatalogPagination: React.FC<CatalogPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    onPageChange(page);
    // Smooth scroll to catalog grid
    const target = document.getElementById('catalog-grid');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate page numbers with ellipsis
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav
      aria-label="Phân trang sản phẩm"
      className="flex items-center justify-center gap-2 pt-12 pb-6 border-t border-[var(--cream-shadow)] mt-12"
    >
      {/* Previous Page Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
          currentPage <= 1
            ? 'opacity-30 cursor-not-allowed text-[var(--espresso-light)]'
            : 'text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] hover:bg-[var(--cream-deep)]'
        }`}
        aria-label="Trang trước"
      >
        <ChevronLeft size={15} />
        <span>Trang Trước</span>
      </button>

      {/* Numbered Page Buttons */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-xs text-[var(--espresso-light)]">
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => handlePageClick(pageNum)}
              className={`w-9 h-9 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center justify-center ${
                isActive
                  ? 'bg-[var(--cream-deep)] border border-[var(--cream-shadow)] font-bold text-[var(--espresso-ink)] shadow-xs'
                  : 'text-[var(--espresso-mid)] hover:bg-[var(--cream-deep)] hover:text-[var(--espresso-ink)]'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Trang ${pageNum.toString().padStart(2, '0')}`}
            >
              {pageNum.toString().padStart(2, '0')}
            </button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
          currentPage >= totalPages
            ? 'opacity-30 cursor-not-allowed text-[var(--espresso-light)]'
            : 'text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] hover:bg-[var(--cream-deep)]'
        }`}
        aria-label="Trang sau"
      >
        <span>Trang Sau</span>
        <ChevronRight size={15} />
      </button>
    </nav>
  );
};
