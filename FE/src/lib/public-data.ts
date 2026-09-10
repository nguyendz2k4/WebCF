import 'server-only';
import { cache } from 'react';
import type { Product } from '@/types/product';
import type { NewsArticle } from '@/types/news';
import { backendUrl } from './backend-server';
import { isRecord } from './contracts';
import { isSafeImageUrl } from './security';

async function readPublic(path: string): Promise<unknown[]> {
  const response = await fetch(backendUrl(path), { headers: { Accept: 'application/json' }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000) });
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('Public data unavailable');
  const value = await response.json();
  if (!Array.isArray(value)) throw new Error('Invalid public response');
  return value;
}
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string');
const textFields = (row: Record<string, unknown>, fields: string[]) => fields.every(key => typeof row[key] === 'string');

export const getProducts = cache(async (): Promise<Product[]> => {
  const rows = await readPublic('catalog/products');
  for (const row of rows) {
    if (!isRecord(row) || !textFields(row, ['id', 'slug', 'name', 'brand', 'shortDescription', 'category', 'formattedPrice', 'createdAt'])
      || !/^[a-zA-Z0-9_-]+$/.test(String(row.slug)) || !Number.isFinite(Date.parse(String(row.createdAt)))
      || !['fixed', 'from', 'contact'].includes(String(row.priceType)) || !['equipment', 'ingredients'].includes(String(row.domain))
      || typeof row.price !== 'number' || !Number.isFinite(row.price) || row.price < 0 || typeof row.inStock !== 'boolean'
      || !strings(row.images) || !row.images.length || !row.images.every(isSafeImageUrl)
      || (row.domain === 'equipment' && (!isRecord(row.specs) || typeof row.specs.warranty !== 'string' || !strings(row.suitableFor)))
      || (row.domain === 'ingredients' && (!isRecord(row.packaging) || typeof row.packaging.unitSize !== 'string' || (row.flavorNotes !== undefined && !strings(row.flavorNotes))))) throw new Error('Invalid product');
  }
  return rows as Product[];
});

export const getArticles = cache(async (): Promise<NewsArticle[]> => {
  const rows = await readPublic('catalog/articles');
  for (const row of rows) {
    if (!isRecord(row) || !textFields(row, ['id', 'slug', 'title', 'excerpt', 'category', 'categoryLabel', 'publishedAt', 'readTime', 'coverImage'])
      || !/^[a-zA-Z0-9_-]+$/.test(String(row.slug)) || !isSafeImageUrl(String(row.coverImage)) || !strings(row.tags)
      || !isRecord(row.author) || !textFields(row.author, ['name', 'role'])
      || (row.author.avatar !== undefined && (typeof row.author.avatar !== 'string' || !isSafeImageUrl(row.author.avatar)))
      || !isRecord(row.content) || typeof row.content.leadParagraph !== 'string' || !Array.isArray(row.content.sections)
      || !row.content.sections.every(section => isRecord(section) && strings(section.body)
        && (section.heading === undefined || typeof section.heading === 'string')
        && (section.pullQuote === undefined || typeof section.pullQuote === 'string')
        && (section.keyPoints === undefined || strings(section.keyPoints))
        && (section.image === undefined || (isRecord(section.image) && typeof section.image.caption === 'string' && typeof section.image.url === 'string' && isSafeImageUrl(section.image.url))))) throw new Error('Invalid article');
  }
  return rows as NewsArticle[];
});
