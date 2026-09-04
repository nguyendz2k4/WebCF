import React from 'react';
import { Product } from '@/types/product';
import { EQUIPMENT_CATEGORIES, INGREDIENT_CATEGORIES } from '@/components/catalog/catalogUtils';

interface ProductSchemaProps {
  product: Product;
  siteUrl: string;
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({ product, siteUrl }) => {
  const isEquipment = product.domain === 'equipment';
  const domainLabel = isEquipment ? 'Thiết Bị Cà Phê' : 'Nguyên Liệu Pha Chế';
  const domainUrl = `${siteUrl}/products?domain=${product.domain}`;

  const categoryList = isEquipment ? EQUIPMENT_CATEGORIES : INGREDIENT_CATEGORIES;
  const categoryItem = categoryList.find((c) => c.slug === product.category);
  const categoryLabel = categoryItem ? categoryItem.label : product.category;
  const categoryUrl = `${siteUrl}/products?domain=${product.domain}&category=${product.category}`;

  const productUrl = `${siteUrl}/products/${product.slug}`;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.shortDescription,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'VND',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Aura Coffee Solutions',
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang Chủ',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: domainLabel,
        item: domainUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryLabel,
        item: categoryUrl,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
};
