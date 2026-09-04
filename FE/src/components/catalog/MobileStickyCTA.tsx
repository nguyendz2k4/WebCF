'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Zap } from 'lucide-react';
import { Product } from '@/types/product';
import { useApp } from '@/stores/AppContext';

interface MobileStickyCTAProps {
  product: Product;
  targetRefId?: string;
}

export const MobileStickyCTA: React.FC<MobileStickyCTAProps> = ({
  product,
  targetRefId = 'product-main-cta',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart, buyNow } = useApp();

  useEffect(() => {
    const targetElement = document.getElementById(targetRefId);
    if (!targetElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When main CTA is NOT intersecting (scrolled past), show sticky CTA
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(targetElement);
    return () => observer.disconnect();
  }, [targetRefId]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.name,
      category: product.domain === 'equipment' ? 'equipment' : 'beans',
      price: product.price,
      formattedPrice: product.formattedPrice,
      image: product.images[0],
      subtitle: product.brand,
      quantity: 1,
    });
  };

  const handleBuyNow = () => {
    buyNow({
      id: product.id,
      title: product.name,
      category: product.domain === 'equipment' ? 'equipment' : 'beans',
      price: product.price,
      formattedPrice: product.formattedPrice,
      image: product.images[0],
      subtitle: product.brand,
      quantity: 1,
    });
  };

  if (!isVisible) return null;

  return (
    <aside
      id="mobile-sticky-purchase-bar"
      aria-label="Thanh tác vụ mua hàng nhanh"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--cream-base)]/98 backdrop-blur-md border-t border-[var(--cream-shadow)] shadow-lg px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] transition-all animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Product mini info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[var(--cream-deep)] border border-[var(--cream-shadow)] shrink-0">
            <Image
              src={product.images[0]}
              alt={`${product.brand} - ${product.name}`}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4
              className="text-xs text-[var(--espresso-ink)] font-normal truncate"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {product.name}
            </h4>
            <span
              className="text-xs font-semibold text-[var(--copper-accent)] block"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {product.formattedPrice}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            className="p-2.5 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-[var(--espresso-ink)] hover:text-[var(--copper-accent)] transition-colors cursor-pointer"
            aria-label="Thêm vào giỏ hàng"
          >
            <ShoppingBag size={16} />
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--copper-accent)] text-white hover:bg-[var(--copper-light)] shadow-xs transition-colors cursor-pointer"
          >
            <Zap size={14} />
            <span>Mua Ngay</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
