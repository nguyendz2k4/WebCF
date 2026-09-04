'use client';

import React from 'react';
import { Product, EquipmentProduct, IngredientProduct } from '@/types/product';
import { EquipmentCard } from './EquipmentCard';
import { IngredientCard } from './IngredientCard';

interface ProductGridProps {
  products: Product[];
  view: 'grid' | 'list';
  onOpenQuickSpec: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  view,
  onOpenQuickSpec,
}) => {
  if (view === 'list') {
    return (
      <div className="flex flex-col divide-y divide-[var(--cream-shadow)]">
        {products.map((product) => (
          <div key={product.id} className="py-4 first:pt-0 last:pb-0">
            {product.domain === 'equipment' ? (
              <EquipmentCard
                product={product as EquipmentProduct}
                onOpenQuickSpec={onOpenQuickSpec}
                view="list"
              />
            ) : (
              <IngredientCard
                product={product as IngredientProduct}
                onOpenQuickSpec={onOpenQuickSpec}
                view="list"
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      id="catalog-grid"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10"
    >
      {products.map((product) => (
        <div key={product.id} className="flex flex-col">
          {product.domain === 'equipment' ? (
            <EquipmentCard
              product={product as EquipmentProduct}
              onOpenQuickSpec={onOpenQuickSpec}
              view="grid"
            />
          ) : (
            <IngredientCard
              product={product as IngredientProduct}
              onOpenQuickSpec={onOpenQuickSpec}
              view="grid"
            />
          )}
        </div>
      ))}
    </div>
  );
};
