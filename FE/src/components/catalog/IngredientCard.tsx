'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Plus, Zap, Check } from 'lucide-react';
import { IngredientProduct } from '@/types/product';
import { useApp } from '@/stores/AppContext';

interface IngredientCardProps {
  product: IngredientProduct;
  onOpenQuickSpec: (product: IngredientProduct) => void;
  view?: 'grid' | 'list';
}

export const IngredientCard: React.FC<IngredientCardProps> = ({
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
      category: 'beans',
      price: product.price,
      formattedPrice: product.formattedPrice,
      image: product.images[0],
      subtitle: product.origin ? `${product.origin} · ${product.roastProfile || 'Specialty'}` : product.brand,
      specs: product.packaging?.unitSize ? `Túi ${product.packaging.unitSize}` : undefined,
      quantity: 1,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    buyNow({
      id: product.id,
      title: product.name,
      category: 'beans',
      price: product.price,
      formattedPrice: product.formattedPrice,
      image: product.images[0],
      subtitle: product.origin ? `${product.origin} · ${product.roastProfile || 'Specialty'}` : product.brand,
      specs: product.packaging?.unitSize ? `Túi ${product.packaging.unitSize}` : undefined,
      quantity: 1,
    });
  };

  // Build spec string (Origin, Altitude, Process, Roast)
  const terroirItems: string[] = [];
  if (product.origin) terroirItems.push(product.origin);
  if (product.altitude) terroirItems.push(product.altitude);
  if (product.process) terroirItems.push(product.process);
  if (product.roastProfile) terroirItems.push(product.roastProfile);
  const terroirSummary = terroirItems.join(' · ');

  // List View Mode
  if (view === 'list') {
    return (
      <article className="group flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-transparent hover:border-[var(--cream-shadow)] hover:bg-[var(--cream-deep)]/40 transition-all duration-200">
        {/* 1. Image Frame */}
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

          {/* SCA Score Badge */}
          {product.cuppingScore && (
            <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[var(--copper-accent)] text-white">
              SCA {product.cuppingScore}
            </span>
          )}
        </div>

        {/* 2. Content & Actions */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--copper-accent)]">
                {product.origin ? `Vùng trồng: ${product.origin}` : product.brand}
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

            {/* Flavor Profile Pills */}
            {product.flavorNotes && product.flavorNotes.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {product.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="inline-block px-2 py-0.5 rounded-full text-[11px] bg-[var(--cream-deep)] text-[var(--espresso-mid)] border border-[var(--cream-shadow)]/80 font-sans"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-[var(--cream-shadow)]/60">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[var(--espresso-light)]">
                Quy cách: {product.packaging?.unitSize || 'Túi tiêu chuẩn'}
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
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-[var(--espresso-ink)] hover:border-[var(--copper-accent)] hover:text-[var(--copper-accent)] transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Thêm vào Giỏ Hàng</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-[var(--copper-accent)] text-white hover:bg-[var(--copper-light)] shadow-xs transition-colors cursor-pointer"
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

        {/* Terroir / Altitude Stamped Badge */}
        {product.origin && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-[var(--espresso-ink)]/90 backdrop-blur-xs text-[var(--cream-base)]">
            {product.origin} {product.altitude ? `· ${product.altitude}` : ''}
          </span>
        )}

        {/* SCA Score Badge */}
        {product.cuppingScore && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[var(--copper-accent)] text-white shadow-xs">
            SCA {product.cuppingScore}
          </span>
        )}
      </div>

      {/* 2. Text & Tasting Notes Body */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Origin or Brand */}
          <span className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-[var(--copper-accent)] mb-1">
            {product.origin || product.brand}
          </span>

          {/* Product Name */}
          <Link href={`/products/${product.slug}`} className="block group-hover:text-[var(--copper-accent)] transition-colors">
            <h2
              className="text-lg md:text-xl text-[var(--espresso-ink)] font-normal line-clamp-2 leading-snug group-hover:text-[var(--copper-accent)] transition-colors"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {product.name}
            </h2>
          </Link>

          {/* Terroir Summary */}
          {terroirSummary && (
            <p className="mt-1.5 text-xs text-[var(--espresso-mid)] line-clamp-1 font-sans">
              {terroirSummary}
            </p>
          )}

          {/* Flavor Notes (Max 3 pills) */}
          {product.flavorNotes && product.flavorNotes.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {product.flavorNotes.slice(0, 3).map((note) => (
                <span
                  key={note}
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-[var(--cream-deep)] text-[var(--espresso-mid)] border border-[var(--cream-shadow)]/80 font-sans"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[var(--cream-shadow)]">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-[var(--espresso-light)]">
              {product.packaging?.unitSize ? `Quy cách: ${product.packaging.unitSize}` : 'Giá niêm yết'}
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
