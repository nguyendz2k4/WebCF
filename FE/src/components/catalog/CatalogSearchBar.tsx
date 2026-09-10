'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowUpRight, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { Product, ProductDomain } from '@/types/product';
import { EQUIPMENT_CATEGORIES, INGREDIENT_CATEGORIES, TRENDING_KEYWORDS } from './catalogUtils';
import { useApp } from '@/stores/AppContext';

interface CatalogSearchBarProps {
  value: string;
  onChange: (query: string) => void;
  domain: ProductDomain;
  products: Product[];
  onSelectCategory: (catSlug: string) => void;
  onOpenQuickSpec: (product: Product) => void;
}

export const CatalogSearchBar: React.FC<CatalogSearchBarProps> = ({
  value,
  onChange,
  domain,
  products,
  onSelectCategory,
  onOpenQuickSpec,
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useApp();

  // Sync internal query when prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced parent notification
  useEffect(() => {
    if (query === value) return;
    const timer = setTimeout(() => {
      onChange(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, value, onChange]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const categories = domain === 'equipment' ? EQUIPMENT_CATEGORIES.slice(1) : INGREDIENT_CATEGORIES.slice(1);

  // Top 3 matching product previews
  const matchingProducts = query.trim()
    ? products
        .filter((p) => {
          const q = query.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q)
          );
        })
        .slice(0, 3)
    : products.slice(0, 3);

  const handleAddToCart = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    addToCart({
      id: p.id,
      title: p.name,
      category: p.domain === 'equipment' ? 'equipment' : 'beans',
      price: p.price,
      formattedPrice: p.formattedPrice,
      image: p.images[0],
      subtitle: p.brand,
      quantity: 1,
    });
  };

  return (
    <div className="relative w-full max-w-2xl" ref={dropdownRef}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search
          size={18}
          className="absolute left-4 text-[var(--espresso-light)] pointer-events-none stroke-[1.5]"
          aria-hidden="true"
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            domain === 'equipment'
              ? 'Tìm model máy pha, máy xay, công suất, hãng sản xuất...'
              : 'Tìm tên hạt, vùng trồng Cầu Đất, siro 1883, nốt hương...'
          }
          className="w-full pl-11 pr-10 py-3 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-full text-sm text-[var(--espresso-ink)] placeholder-[var(--espresso-light)] placeholder:opacity-75 focus:outline-none focus:border-[var(--copper-accent)] focus:bg-[var(--cream-base)] transition-all duration-200"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-label="Tìm kiếm sản phẩm"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 p-1 rounded-full text-[var(--espresso-light)] hover:text-[var(--espresso-ink)] transition-colors cursor-pointer"
            aria-label="Xóa từ khóa tìm kiếm"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Typeahead Dropdown Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--cream-base)] border border-[var(--cream-shadow)] rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-[var(--cream-shadow)]">
          {/* 1. Category Shortcuts */}
          <div className="p-4 bg-[var(--cream-deep)]/40">
            <span className="block text-[11px] uppercase tracking-[0.12em] font-medium text-[var(--espresso-light)] mb-2.5">
              Danh Mục Gợi Ý
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.slug);
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-[var(--cream-base)] border border-[var(--cream-shadow)] text-[var(--espresso-ink)] hover:border-[var(--copper-accent)] hover:text-[var(--copper-accent)] transition-colors cursor-pointer"
                >
                  <span>{cat.label}</span>
                  <ArrowUpRight size={12} className="text-[var(--espresso-light)]" />
                </button>
              ))}
            </div>
          </div>

          {/* 2. Top Matching Product Previews */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-[0.12em] font-medium text-[var(--espresso-light)]">
                {query ? 'Sản Phẩm Khớp Từ Khóa (Top 3)' : 'Sản Phẩm Tiêu Biểu'}
              </span>
              <span className="text-xs text-[var(--espresso-light)]">
                {matchingProducts.length} sản phẩm
              </span>
            </div>

            <div className="space-y-2.5">
              {matchingProducts.length > 0 ? (
                matchingProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onOpenQuickSpec(p);
                      setIsOpen(false);
                    }}
                    className="group flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-[var(--cream-deep)] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--cream-deep)] border border-[var(--cream-shadow)] shrink-0">
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] uppercase tracking-wider text-[var(--espresso-light)] truncate">
                          {p.brand}
                        </span>
                        <p
                          className="text-sm text-[var(--espresso-ink)] font-normal truncate group-hover:text-[var(--copper-accent)] transition-colors"
                          style={{ fontFamily: 'var(--font-serif)' }}
                        >
                          {p.name}
                        </p>
                        <span
                          className="text-xs text-[var(--espresso-mid)]"
                          style={{ fontFamily: 'var(--font-serif)' }}
                        >
                          {p.formattedPrice}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, p)}
                      title="Thêm vào Giỏ Hàng"
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--copper-accent)] text-white hover:bg-[var(--copper-light)] transition-colors cursor-pointer"
                    >
                      <Plus size={13} />
                      <span className="hidden sm:inline">Giỏ Hàng</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-[var(--espresso-light)]">
                  Không tìm thấy sản phẩm với từ khóa &ldquo;{query}&rdquo;
                </div>
              )}
            </div>
          </div>

          {/* 3. Trending Keywords */}
          <div className="p-4 bg-[var(--cream-deep)]/20">
            <span className="block text-[11px] uppercase tracking-[0.12em] font-medium text-[var(--espresso-light)] mb-2">
              Từ Khóa Được Tìm Kiếm Nhiều
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => {
                    setQuery(kw);
                    onChange(kw);
                    setIsOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-md text-xs text-[var(--espresso-mid)] bg-[var(--cream-deep)] hover:bg-[var(--cream-shadow)] hover:text-[var(--espresso-ink)] transition-colors cursor-pointer"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
