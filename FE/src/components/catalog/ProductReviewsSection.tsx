import type { Product } from '@/types/product';
export function ProductReviewsSection({ product }: { product: Product }) {
  return <section id="product-reviews-section" aria-label="Đánh giá sản phẩm" className="py-10 border-t border-[var(--cream-shadow)]"><h3 className="font-serif text-2xl mb-3">Đánh giá sản phẩm</h3><p className="text-sm text-[var(--espresso-mid)]">Chưa có đánh giá được công bố cho {product.name}.</p></section>;
}
