'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Plus, Zap, Check } from 'lucide-react';
import { EquipmentProduct } from '@/types/product';
import { useApp } from '@/stores/AppContext';

interface EquipmentCardProps {
  product: EquipmentProduct;
  onOpenQuickSpec: (product: EquipmentProduct) => void;
  view?: 'grid' | 'list';
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  product,
  onOpenQuickSpec,
  view = 'grid',
}) => {
  const { addToCart, buyNow } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.name,
      category: 'equipment',
      price: product.price,
      formattedPrice: product.formattedPrice,
      image: product.images[0],
      subtitle: product.brand,
      specs: product.specs.boiler ? `${product.specs.groups || 1}G · ${product.specs.power}` : undefined,
      quantity: 1,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    buyNow({
      id: product.id,
      title: product.name,
      category: 'equipment',
      price: product.price,
      formattedPrice: product.formattedPrice,
      image: product.images[0],
      subtitle: product.brand,
      specs: product.specs.boiler ? `${product.specs.groups || 1}G · ${product.specs.power}` : undefined,
      quantity: 1,
    });
  };

  // Build spec summary string
  const specItems: string[] = [];
  if (product.specs.groups) specItems.push(`${product.specs.groups} Groups`);
  if (product.specs.boilerCapacity) specItems.push(product.specs.boilerCapacity);
  if (product.specs.power) specItems.push(product.specs.power);
  if (product.specs.voltage) specItems.push(product.specs.voltage);
  const specSummary = specItems.join(' · ');

  // List View Mode
  if (view === 'list') {
    return (
      <article className="group flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-transparent hover:border-[var(--cream-shadow)] hover:bg-[var(--cream-deep)]/40 transition-all duration-200">
        {/* 1. Image Frame (35%) */}
        <div className="relative w-full md:w-56 h-48 rounded-lg overflow-hidden bg-[var(--cream-deep)] border border-[var(--cream-shadow)] shrink-0">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <Image
              src={product.images[0]}
              alt={`${product.brand} - ${product.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 240px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Quick View Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onOpenQuickSpec(product);
            }}
            className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--cream-base)]/95 border border-[var(--cream-shadow)] text-xs text-[var(--espresso-ink)] opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer hover:bg-[var(--cream-deep)]"
            aria-label={`Xem nhanh thông số ${product.name}`}
          >
            <Eye size={13} />
            <span className="text-[11px] font-medium">Xem nhanh</span>
          </button>
        </div>

        {/* 2. Content & Actions (65%) */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--espresso-light)]">
                {product.brand}
              </span>
              {product.leadTime && (
                <span className="text-[11px] text-[var(--espresso-light)] flex items-center gap-1">
                  <Check size={11} className="text-emerald-700" />
                  {product.leadTime}
                </span>
              )}
            </div>

            <Link href={`/products/${product.slug}`}>
              <h2
                className="text-xl md:text-2xl text-[var(--espresso-ink)] font-normal group-hover:text-[var(--copper-accent)] transition-colors line-clamp-1"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {product.name}
              </h2>
            </Link>

            <p className="mt-1.5 text-xs text-[var(--espresso-mid)] line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>

            {specSummary && (
              <div className="mt-2.5 text-xs text-[var(--espresso-mid)] font-mono bg-[var(--cream-deep)]/60 px-2.5 py-1 rounded border border-[var(--cream-shadow)]/60 inline-block">
                {specSummary}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-[var(--cream-shadow)]/60">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[var(--espresso-light)]">
                {product.priceType === 'from' ? 'Giá tham khảo từ' : 'Giá niêm yết'}
              </span>
              <span
                className="text-lg text-[var(--espresso-ink)] font-normal"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {product.formattedPrice}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-[var(--espresso-ink)] hover:border-[var(--copper-accent)] hover:text-[var(--copper-accent)] transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Thêm vào Giỏ Hàng</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold bg-[var(--copper-accent)] text-white hover:bg-[var(--copper-light)] shadow-xs transition-colors cursor-pointer"
              >
                <Zap size={14} />
                <span>Mua Ngay</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid View Mode (Default 3-Column BroadSheet)
  return (
    <article className="group flex flex-col justify-between h-full pb-2">
      {/* 1. Image Container (4:3 aspect ratio) */}
      <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-[var(--cream-deep)] border border-[var(--cream-shadow)] mb-4">
        <Link
          href={`/products/${product.slug}`}
          className="block w-full h-full cursor-pointer focus:outline-none"
          tabIndex={-1}
        >
          <Image
            src={product.images[0]}
            alt={`${product.brand} - ${product.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Quick Spec Hover Trigger */}
        <button
          type="button"
          onClick={() => onOpenQuickSpec(product)}
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--cream-base)]/95 backdrop-blur-xs border border-[var(--cream-shadow)] text-xs text-[var(--espresso-ink)] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 shadow-sm cursor-pointer hover:bg-[var(--cream-deep)]"
          aria-label={`Xem nhanh thông số ${product.name}`}
        >
          <Eye size={13} />
          <span className="text-[11px] font-medium">Xem nhanh</span>
        </button>

        {/* Featured Tag */}
        {product.isFeatured && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-[var(--espresso-ink)] text-[var(--cream-base)]">
            Flagship
          </span>
        )}
      </div>

      {/* 2. Text & Specification Body */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand Stamp */}
          <span className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-[var(--espresso-light)] mb-1">
            {product.brand}
          </span>

          {/* Model Name */}
          <Link href={`/products/${product.slug}`} className="block group-hover:text-[var(--copper-accent)] transition-colors">
            <h2
              className="text-lg md:text-xl text-[var(--espresso-ink)] font-normal line-clamp-2 leading-snug group-hover:text-[var(--copper-accent)] transition-colors"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {product.name}
            </h2>
          </Link>

          {/* Key Spec Line */}
          {specSummary && (
            <p className="mt-1.5 text-xs text-[var(--espresso-mid)] line-clamp-1 font-sans">
              {specSummary}
            </p>
          )}

          {/* Daily Capacity / Suitability */}
          {product.specs.dailyCapacity && (
            <p className="mt-1 text-[11px] text-[var(--espresso-light)] line-clamp-1">
              Công suất: {product.specs.dailyCapacity}
            </p>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[var(--cream-shadow)]">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-[var(--espresso-light)]">
              {product.priceType === 'from' ? 'Giá từ' : 'Giá niêm yết'}
            </span>
            <span
              className="text-lg text-[var(--espresso-ink)] font-normal"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {product.formattedPrice}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-[var(--espresso-ink)] hover:border-[var(--copper-accent)] hover:text-[var(--copper-accent)] transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>+ Giỏ Hàng</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-[var(--copper-accent)] text-white hover:bg-[var(--copper-light)] shadow-xs transition-colors cursor-pointer"
            >
              <Zap size={13} />
              <span>Mua Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
