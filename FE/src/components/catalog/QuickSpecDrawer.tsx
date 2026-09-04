'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, ArrowRight, ShieldCheck, Clock, Zap } from 'lucide-react';
import { Product, EquipmentProduct, IngredientProduct } from '@/types/product';
import { useApp } from '@/stores/AppContext';

interface QuickSpecDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSpecDrawer: React.FC<QuickSpecDrawerProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart, buyNow } = useApp();

  // Scroll lock on body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

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
    onClose();
  };

  const isEquipment = product.domain === 'equipment';
  const eq = product as EquipmentProduct;
  const ing = product as IngredientProduct;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-spec-title"
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[var(--espresso-dark)]/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Drawer Panel (480px width) */}
      <div
        className="relative w-full max-w-[480px] h-full bg-[var(--cream-base)] shadow-2xl border-l border-[var(--cream-shadow)] z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 ease-out"
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[var(--cream-shadow)] bg-[var(--cream-deep)]/60 flex items-start justify-between gap-4 shrink-0">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--copper-accent)]">
              {isEquipment ? 'Hồ Sơ Kỹ Thuật Máy Móc' : 'Hồ Sơ Terroir & Hương Vị'}
            </span>
            <h3
              id="quick-spec-title"
              className="text-2xl text-[var(--espresso-ink)] font-normal mt-1 leading-snug"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {product.name}
            </h3>
            <span className="text-xs text-[var(--espresso-light)] font-mono block mt-1">
              SKU: {product.sku || 'AURA-SPEC'} · Thương hiệu: {product.brand}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[var(--espresso-light)] hover:text-[var(--espresso-ink)] hover:bg-[var(--cream-shadow)] transition-colors cursor-pointer"
            aria-label="Đóng bảng thông số"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body Specs */}
        <div
          className="p-6 space-y-6 flex-1 overflow-y-auto"
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Main Media Preview */}
          <div className="relative w-full h-56 rounded-xl overflow-hidden bg-[var(--cream-deep)] border border-[var(--cream-shadow)]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="480px"
              className="object-cover"
            />
          </div>

          {/* Pricing & Commercial Terms */}
          <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[var(--espresso-light)] block">
                {product.priceType === 'from' ? 'Mức giá từ' : 'Giá niêm yết'}
              </span>
              <span
                className="text-2xl text-[var(--espresso-ink)] font-normal"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {product.formattedPrice}
              </span>
            </div>
            {product.leadTime && (
              <span className="text-xs font-medium text-emerald-800 bg-emerald-100/70 border border-emerald-300/60 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Clock size={12} />
                {product.leadTime}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-[var(--espresso-light)] mb-1.5">
              Tổng Quan & Triết Lý Chế Tác
            </span>
            <p className="text-xs text-[var(--espresso-mid)] leading-relaxed font-sans">
              {product.shortDescription}
            </p>
          </div>

          {/* Domain Specific Detailed Specification Grid */}
          {isEquipment ? (
            <div className="space-y-4">
              <span className="block text-[11px] uppercase tracking-wider text-[var(--espresso-light)] border-b border-[var(--cream-shadow)] pb-2">
                Thông Số Kỹ Thuật Chi Tiết
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {eq.specs.groups && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Họng chiết xuất</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{eq.specs.groups} Groups</span>
                  </div>
                )}
                {eq.specs.boiler && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Hệ thống nồi hơi</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{eq.specs.boiler}</span>
                  </div>
                )}
                {eq.specs.boilerCapacity && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Dung tích nồi</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{eq.specs.boilerCapacity}</span>
                  </div>
                )}
                {eq.specs.power && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Công suất điện</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{eq.specs.power}</span>
                  </div>
                )}
                {eq.specs.voltage && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Điện áp yêu cầu</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{eq.specs.voltage}</span>
                  </div>
                )}
                {eq.specs.dailyCapacity && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Công suất khuyến nghị</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{eq.specs.dailyCapacity}</span>
                  </div>
                )}
                {eq.specs.dimensions && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Kích thước (DxRxC)</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{eq.specs.dimensions}</span>
                  </div>
                )}
                {eq.specs.weight && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Trọng lượng tịnh</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{eq.specs.weight}</span>
                  </div>
                )}
              </div>

              {/* Warranty & Standard */}
              {eq.specs.warranty && (
                <div className="p-3.5 rounded-lg border border-[var(--cream-shadow)] bg-[var(--cream-deep)]/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[var(--copper-accent)]" />
                    <span className="text-[var(--espresso-mid)]">Bảo hành chính hãng:</span>
                  </div>
                  <span className="font-semibold text-[var(--espresso-ink)]">{eq.specs.warranty}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <span className="block text-[11px] uppercase tracking-wider text-[var(--espresso-light)] border-b border-[var(--cream-shadow)] pb-2">
                Hồ Sơ Vùng Trồng & Nông Học
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {ing.origin && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Vùng thổ nhưỡng</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{ing.origin}</span>
                  </div>
                )}
                {ing.altitude && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Độ cao canh tác</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{ing.altitude}</span>
                  </div>
                )}
                {ing.process && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Phương pháp sơ chế</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{ing.process}</span>
                  </div>
                )}
                {ing.subRegion && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Tiểu vùng</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{ing.subRegion}</span>
                  </div>
                )}
                {ing.roastProfile && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Mức độ rang profile</span>
                    <span className="font-semibold text-[var(--espresso-ink)]">{ing.roastProfile}</span>
                  </div>
                )}
                {ing.cuppingScore && (
                  <div className="p-3 bg-[var(--cream-deep)] rounded-lg">
                    <span className="text-[11px] text-[var(--espresso-light)] block">Điểm thử nếm SCA</span>
                    <span className="font-semibold text-[var(--copper-accent)]">SCA {ing.cuppingScore}/100</span>
                  </div>
                )}
              </div>

              {/* Sensory Notes */}
              {ing.flavorNotes && ing.flavorNotes.length > 0 && (
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[var(--espresso-light)] mb-2">
                    Tầng Hương Vị Đặc Trưng (Sensory Notes)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ing.flavorNotes.map((fn, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-full text-xs text-[var(--espresso-ink)] font-medium"
                      >
                        {fn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Sticky Footer Actions */}
        <div className="p-6 border-t border-[var(--cream-shadow)] bg-[var(--cream-deep)]/40 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-full text-xs font-medium bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-[var(--espresso-ink)] hover:border-[var(--copper-accent)] hover:text-[var(--copper-accent)] transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>+ Giỏ Hàng</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-full text-xs font-medium bg-[var(--copper-accent)] text-white hover:bg-[var(--copper-light)] transition-colors cursor-pointer shadow-sm"
            >
              <Zap size={15} />
              <span>Mua Ngay</span>
            </button>
          </div>

          <Link
            href={`/products/${product.slug}`}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-[var(--espresso-mid)] hover:text-[var(--copper-accent)] transition-colors"
          >
            <span>Xem trang chi tiết đầy đủ</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
