'use client';

import React, { useState } from 'react';
import { Plus, Minus, Zap } from 'lucide-react';
import { Product } from '@/types/product';
import { useApp } from '@/stores/AppContext';

interface ProductDetailClientActionsProps {
  product: Product;
}

export const ProductDetailClientActions: React.FC<ProductDetailClientActionsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, buyNow } = useApp();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.name,
      category: product.domain === 'equipment' ? 'equipment' : 'beans',
      price: product.price,
      formattedPrice: product.formattedPrice,
      image: product.images[0],
      subtitle: product.brand,
      quantity,
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
      quantity,
    });
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector & Action Buttons (Thêm vào Giỏ Hàng & Mua Ngay) */}
      <div id="product-main-cta" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center justify-between border border-[var(--cream-shadow)] rounded-full bg-[var(--cream-deep)] p-1 shrink-0">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] hover:bg-[var(--cream-base)] transition-colors cursor-pointer"
            aria-label="Giảm số lượng"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center font-mono text-sm font-medium text-[var(--espresso-ink)]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--espresso-mid)] hover:text-[var(--espresso-ink)] hover:bg-[var(--cream-base)] transition-colors cursor-pointer"
            aria-label="Tăng số lượng"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-xs font-medium uppercase tracking-wider bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-[var(--espresso-ink)] hover:border-[var(--copper-accent)] hover:text-[var(--copper-accent)] transition-colors cursor-pointer"
        >
          <Plus size={15} />
          <span>Thêm Vào Giỏ Hàng</span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--copper-accent)] text-white hover:bg-[var(--copper-light)] shadow-sm transition-colors cursor-pointer"
        >
          <Zap size={15} />
          <span>Mua Ngay</span>
        </button>
      </div>
    </div>
  );
};
