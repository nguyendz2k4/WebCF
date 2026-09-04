import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast, ProductSchema } from '@/components/shared';
import { SiteFooter } from '@/components/store';
import { PRODUCTS_DATA } from '@/data/products';
import { EquipmentProduct, IngredientProduct } from '@/types/product';
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react';
import { ProductDetailClientActions } from './ProductDetailClientActions';
import {
  EQUIPMENT_CATEGORIES,
  INGREDIENT_CATEGORIES,
  ProductReviewsSection,
  ProductFAQSection,
  ProductTrustSection,
  MobileStickyCTA,
} from '@/components/catalog';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS_DATA.find((p) => p.slug === slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm | Aura Coffee Solutions',
      description: 'Sản phẩm bạn đang tìm kiếm không tồn tại trên hệ thống Aura Coffee Solutions.',
    };
  }

  const pageTitle = `${product.name} · ${product.brand} | Aura Coffee Solutions`;
  const pageDescription = product.shortDescription;
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const primaryImage = product.images[0];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      product.brand,
      product.name,
      product.category,
      product.domain === 'equipment' ? 'thiết bị pha cà phê' : 'nguyên liệu specialty coffee',
      'Aura Coffee Solutions',
    ],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: productUrl,
      siteName: 'Aura Coffee Solutions',
      locale: 'vi_VN',
      type: 'website',
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: `${product.brand} - ${product.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [primaryImage],
    },
  };
}

export async function generateStaticParams() {
  return PRODUCTS_DATA.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = PRODUCTS_DATA.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const isEquipment = product.domain === 'equipment';
  const eq = isEquipment ? (product as EquipmentProduct) : null;
  const ing = !isEquipment ? (product as IngredientProduct) : null;

  // Related products in the same category
  const relatedProducts = PRODUCTS_DATA.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const categoryList = isEquipment ? EQUIPMENT_CATEGORIES : INGREDIENT_CATEGORIES;
  const categoryItem = categoryList.find((c) => c.slug === product.category);
  const categoryLabel = categoryItem ? categoryItem.label : product.category;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream-base)]">
      {/* Schema.org Structured Data */}
      <ProductSchema product={product} siteUrl={baseUrl} />

      <Navbar />

      <div className="flex-1 pt-28 pb-16">
        <div className="max-w-[var(--container-max)] mx-auto px-6 md:px-12">
          {/* Breadcrumbs (4-Level Real Hierarchy) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--espresso-light)] mb-8 flex-wrap">
            <Link href="/" className="hover:text-[var(--espresso-ink)] transition-colors">
              Trang Chủ
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/products?domain=${product.domain}`}
              className="hover:text-[var(--espresso-ink)] transition-colors"
            >
              {isEquipment ? 'Thiết Bị Cà Phê' : 'Nguyên Liệu Pha Chế'}
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/products?domain=${product.domain}&category=${product.category}`}
              className="hover:text-[var(--espresso-ink)] transition-colors"
            >
              {categoryLabel}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--espresso-ink)] font-medium truncate max-w-xs" aria-current="page">
              {product.name}
            </span>
          </nav>

          {/* Back Button */}
          <Link
            href={`/products?domain=${product.domain}`}
            className="inline-flex items-center gap-2 text-xs text-[var(--espresso-mid)] hover:text-[var(--copper-accent)] transition-colors mb-6 font-medium"
          >
            <ArrowLeft size={14} />
            <span>Quay lại danh mục sản phẩm</span>
          </Link>

          {/* Product Detail Main Hero Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16 border-b border-[var(--cream-shadow)]">
            {/* Left Media (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-[var(--cream-deep)] border border-[var(--cream-shadow)] shadow-sm">
                <Image
                  src={product.images[0]}
                  alt={`${product.brand} - ${product.name} chính hãng tại Aura Coffee`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>

              {/* Secondary thumbnails if available */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {product.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-4/3 rounded-xl overflow-hidden bg-[var(--cream-deep)] border border-[var(--cream-shadow)] cursor-pointer"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${product.name} - Ảnh chi tiết góc máy ${idx + 1}`}
                        fill
                        sizes="20vw"
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Procurement Ledger (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--copper-accent)] mb-2">
                  {product.brand}
                </span>

                <h1
                  className="text-3xl md:text-4xl text-[var(--espresso-ink)] font-normal leading-tight mb-4"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {product.name}
                </h1>

                {/* Pricing Block */}
                <div className="p-4 rounded-xl bg-[var(--cream-deep)] border border-[var(--cream-shadow)] mb-6">
                  <span className="block text-[11px] uppercase tracking-wider text-[var(--espresso-light)]">
                    {product.priceType === 'from' ? 'Giá tham khảo từ' : 'Giá niêm yết chính hãng B2B'}
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span
                      className="text-2xl md:text-3xl text-[var(--espresso-ink)] font-normal"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {product.formattedPrice}
                    </span>
                    {product.leadTime && (
                      <span className="text-xs text-[var(--espresso-mid)] flex items-center gap-1 font-medium">
                        <Check size={13} className="text-emerald-700" />
                        {product.leadTime}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm md:text-base text-[var(--espresso-mid)] leading-relaxed mb-6">
                  {product.shortDescription}
                </p>

                {/* Client Interactive Actions */}
                <ProductDetailClientActions product={product} />
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[var(--cream-shadow)] mt-8 space-y-2.5 text-xs text-[var(--espresso-mid)]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[var(--copper-accent)] shrink-0" />
                  <span>Bảo hành chính hãng & kỹ sư trực hỗ trợ kỹ thuật 24/7.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-[var(--copper-accent)] shrink-0" />
                  <span>Hỗ trợ thiết lập profile chiết xuất và đào tạo vận hành quầy bar.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Section */}
          <div className="py-16 border-b border-[var(--cream-shadow)]">
            <div className="max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--espresso-light)] mb-2 block">
                [TECHNICAL SPECIFICATIONS]
              </span>
              <h2
                className="text-2xl md:text-3xl text-[var(--espresso-ink)] font-normal mb-8"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {isEquipment ? 'Hồ Sơ Kỹ Thuật & Cấu Trúc Cơ Khí' : 'Hồ Sơ Terroir & Hướng Dẫn Pha Chế'}
              </h2>

              {eq && (
                <div className="divide-y divide-[var(--cream-shadow)] border-y border-[var(--cream-shadow)] text-sm">
                  {eq.specs.groups && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[var(--espresso-light)]">Số họng chiết xuất (Groups)</span>
                      <span className="font-medium text-[var(--espresso-ink)]">{eq.specs.groups} Groups</span>
                    </div>
                  )}
                  {eq.specs.boiler && (
                    <div className="py-3.5 flex justify-between gap-6">
                      <span className="text-[var(--espresso-light)] shrink-0">Hệ thống nồi hơi</span>
                      <span className="font-medium text-[var(--espresso-ink)] text-right">{eq.specs.boiler}</span>
                    </div>
                  )}
                  {eq.specs.boilerCapacity && (
                    <div className="py-3.5 flex justify-between gap-6">
                      <span className="text-[var(--espresso-light)] shrink-0">Dung tích nồi hơi</span>
                      <span className="font-medium text-[var(--espresso-ink)] text-right">{eq.specs.boilerCapacity}</span>
                    </div>
                  )}
                  {eq.specs.power && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[var(--espresso-light)]">Công suất điện</span>
                      <span className="font-medium text-[var(--espresso-ink)]">{eq.specs.power}</span>
                    </div>
                  )}
                  {eq.specs.voltage && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[var(--espresso-light)]">Điện áp vận hành</span>
                      <span className="font-medium text-[var(--espresso-ink)]">{eq.specs.voltage}</span>
                    </div>
                  )}
                  {eq.specs.dimensions && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[var(--espresso-light)]">Kích thước (D x R x C)</span>
                      <span className="font-medium text-[var(--espresso-ink)]">{eq.specs.dimensions}</span>
                    </div>
                  )}
                  {eq.specs.weight && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[var(--espresso-light)]">Trọng lượng máy</span>
                      <span className="font-medium text-[var(--espresso-ink)]">{eq.specs.weight}</span>
                    </div>
                  )}
                  {eq.specs.warranty && (
                    <div className="py-3.5 flex justify-between gap-6">
                      <span className="text-[var(--espresso-light)] shrink-0">Chính sách bảo hành</span>
                      <span className="font-medium text-[var(--espresso-ink)] text-right">{eq.specs.warranty}</span>
                    </div>
                  )}
                </div>
              )}

              {ing && (
                <div className="divide-y divide-[var(--cream-shadow)] border-y border-[var(--cream-shadow)] text-sm">
                  {ing.origin && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[var(--espresso-light)]">Vùng trồng / Xuất xứ</span>
                      <span className="font-medium text-[var(--espresso-ink)]">{ing.origin}</span>
                    </div>
                  )}
                  {ing.subRegion && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[var(--espresso-light)]">Tiểu vùng (Sub-region)</span>
                      <span className="font-medium text-[var(--espresso-ink)]">{ing.subRegion}</span>
                    </div>
                  )}
                  {ing.altitude && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[var(--espresso-light)]">Độ cao canh tác</span>
                      <span className="font-medium text-[var(--espresso-ink)]">{ing.altitude}</span>
                    </div>
                  )}
                  {ing.process && (
                    <div className="py-3.5 flex justify-between gap-6">
                      <span className="text-[var(--espresso-light)] shrink-0">Phương pháp sơ chế</span>
                      <span className="font-medium text-[var(--espresso-ink)] text-right">{ing.process}</span>
                    </div>
                  )}
                  {ing.roastProfile && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[var(--espresso-light)]">Mức độ rang</span>
                      <span className="font-medium text-[var(--espresso-ink)]">{ing.roastProfile} Roast</span>
                    </div>
                  )}
                  {ing.cuppingScore && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[var(--espresso-light)]">Điểm đánh giá SCA</span>
                      <span className="font-semibold text-[var(--copper-accent)]">{ing.cuppingScore} / 100</span>
                    </div>
                  )}
                  {ing.packaging.unitSize && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[var(--espresso-light)]">Quy cách đóng gói</span>
                      <span className="font-medium text-[var(--espresso-ink)]">{ing.packaging.unitSize}</span>
                    </div>
                  )}
                  {ing.shelfLife && (
                    <div className="py-3.5 flex justify-between gap-6">
                      <span className="text-[var(--espresso-light)] shrink-0">Hạn sử dụng</span>
                      <span className="font-medium text-[var(--espresso-ink)] text-right">{ing.shelfLife}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quality Lab Reviews Section */}
          <ProductReviewsSection product={product} />

          {/* FAQ Section */}
          <ProductFAQSection />

          {/* Trust Assurances */}
          <ProductTrustSection />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-16">
              <div className="flex items-center justify-between mb-8">
                <h3
                  className="text-2xl text-[var(--espresso-ink)] font-normal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Sản Phẩm Cùng Danh Mục
                </h3>
                <Link
                  href={`/products?domain=${product.domain}&category=${product.category}`}
                  className="text-xs text-[var(--copper-accent)] hover:text-[var(--copper-light)] font-medium transition-colors"
                >
                  Xem tất cả →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="group block p-4 rounded-xl bg-[var(--cream-deep)]/40 border border-[var(--cream-shadow)] hover:border-[var(--copper-accent)] transition-all"
                  >
                    <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-[var(--cream-deep)] mb-3">
                      <Image
                        src={p.images[0]}
                        alt={`${p.brand} - ${p.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--espresso-light)] mb-1">
                      {p.brand}
                    </span>
                    <h4
                      className="text-base text-[var(--espresso-ink)] font-normal group-hover:text-[var(--copper-accent)] transition-colors line-clamp-1 mb-2"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {p.name}
                    </h4>
                    <span
                      className="text-sm text-[var(--espresso-ink)] font-normal"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {p.formattedPrice}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky Purchase Bar */}
      <MobileStickyCTA product={product} />

      <SiteFooter />
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />
      <Toast />
    </main>
  );
}
