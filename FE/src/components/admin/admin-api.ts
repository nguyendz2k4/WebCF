import { apiRequest, ApiError } from '@/lib/api-client';
import { isRecord } from '@/lib/contracts';
import { createEmptyData, type Dataset, type Row } from './model';

const names: Record<string, string> = { products: 'Products', categories: 'Categories', brands: 'Brands', orders: 'Orders', customers: 'Customers', articles: 'Articles', contacts: 'Contacts', payments: 'Payments' };
export const orderStatuses: Record<string, string> = { submitted: 'Chờ xác nhận', confirmed: 'Đã xác nhận', processing: 'Đang chuẩn bị', dispatched: 'Đang giao', completed: 'Hoàn tất', cancelled: 'Đã hủy' };
const contactStatuses: Record<string, string> = { new: 'Mới', contacted: 'Đang xử lý', closed: 'Đã giải quyết' };
const text = (v: unknown) => typeof v === 'string' ? v : '';
const num = (v: unknown) => typeof v === 'number' && Number.isFinite(v) ? v : 0;

export function toAdminRow(resource: string, value: unknown): Row {
  if (!isRecord(value) || typeof value.id !== 'string') throw new Error('Invalid admin row');
  const v = value;
  const common = { id: v.id as string, version: text(v.version), _source: JSON.stringify(v) };
  switch (resource) {
    case 'products': return { ...common, name: text(v.name), slug: text(v.slug), sku: text(v.sku), domain: text(v.domain), categoryId: text(v.categoryId), brandId: text(v.brandId), priceType: text(v.priceMode), price: num(v.price),
      availability: v.isAvailableForOrder ? 'Nhận đặt hàng' : 'Ngừng nhận đơn', status: v.isPublished ? 'Đang bán' : 'Ẩn', image: Array.isArray(v.images) ? text(v.images[0]) : '', description: text(v.shortDescription), warranty: text(v.warranty), unitSize: text(v.unitSize) };
    case 'categories': case 'brands': return { ...common, name: text(v.name), code: text(v.code), domain: text(v.domain), displayOrder: num(v.displayOrder), status: v.isActive ? 'Đang hiển thị' : 'Ẩn' };
    case 'orders': return { ...common, name: text(v.orderCode), customer: text(v.customerName), email: text(v.customerEmail), total: num(v.grandTotal), date: text(v.createdAt).slice(0, 10), status: orderStatuses[text(v.status)] ?? text(v.status), payment: text(v.paymentStatus), description: text(v.customerNote), sequence: num(v.currentSequence) };
    case 'articles': return { ...common, name: text(v.title), slug: text(v.slug), category: text(v.categoryCode), author: text(v.authorName), status: v.isPublished ? 'Đã xuất bản' : 'Bản nháp', description: text(v.excerpt), content: text(v.sectionsJson) || '[]', image: text(v.coverImageUrl) };
    case 'contacts': return { ...common, name: text(v.fullName), email: text(v.email), phone: text(v.phone), subject: text(v.serviceType), description: text(v.message), status: contactStatuses[text(v.status)] ?? text(v.status) };
    case 'customers': case 'payments': return Object.fromEntries(Object.entries({ ...v, ...common }).filter(([, x]) => typeof x === 'string' || typeof x === 'number')) as Row;
    default: throw new Error('Unknown resource');
  }
}

export async function loadAdminData(section: string, signal: AbortSignal): Promise<{ data: Dataset; permissions: string[] }> {
  const session = await apiRequest('/auth/me', { signal });
  if (!isRecord(session) || session.isAdmin !== true || !Array.isArray(session.permissions)) throw new ApiError(403);
  const permissions = session.permissions.filter((v): v is string => typeof v === 'string');
  const canRead = (key: string) => permissions.includes(`Permissions.${names[key]}.View`);
  const key = section === 'inventory' ? 'products' : section;
  if (key !== 'dashboard' && !canRead(key)) throw new ApiError(403);
  const wanted = key === 'dashboard' ? Object.keys(names).filter(canRead) : [key, ...(['products', 'inventory'].includes(section) ? ['categories', 'brands'].filter(canRead) : [])];
  const data = createEmptyData();
  await Promise.all(wanted.map(async resource => {
    const rows: Row[] = [];
    for (let page = 1; ; page++) {
      const result = await apiRequest(`/admin/${resource}?page=${page}&pageSize=100`, { signal });
      if (!isRecord(result) || !Array.isArray(result.items) || result.page !== page || !Number.isSafeInteger(result.totalPages) || Number(result.totalPages) < 0) throw new Error('Invalid admin page');
      rows.push(...result.items.map(v => toAdminRow(resource, v)));
      if (page >= Number(result.totalPages)) break;
      if (!result.items.length) throw new Error('Invalid empty page');
    }
    data[resource] = rows;
  }));
  return { data, permissions };
}

export function adminMutation(resource: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', row: Row) {
  const path = `/admin/${resource}${method === 'POST' ? '' : '/' + encodeURIComponent(row.id)}`;
  const version = { version: row.version };
  if (method === 'DELETE') return { path, method, body: version };
  if (row._action === 'publish') return { path: path + '/publish', method: 'PATCH' as const, body: { ...version, isPublished: row.publish === 1 } };
  if (row._action === 'price') return { path: path + '/price', method: 'PATCH' as const, body: { ...version, priceMode: row.priceType, price: row.priceType === 'contact' ? null : row.price } };
  const source: Record<string, unknown> = row._source ? JSON.parse(String(row._source)) : {};
  const original = (keys: string[]) => Object.fromEntries(keys.filter(k => k in source).map(k => [k, source[k]]));
  let body: Record<string, unknown>;
  switch (resource) {
    case 'products': {
      body = { ...original(['isFeatured', 'leadTimeNotice', 'groupsCount', 'boiler', 'boilerCapacity', 'pump', 'powerLabel', 'voltage', 'dimensions', 'weightLabel', 'warranty', 'dailyCapacityLabel', 'origin', 'subRegion', 'altitude', 'process', 'roastProfile', 'cuppingScore', 'flavorNotesJson', 'unitSize', 'caseSize', 'shelfLife']),
        name: row.name, slug: row.slug, sku: row.sku, domain: row.domain, categoryId: row.categoryId, brandId: row.brandId, shortDescription: row.description, warranty: row.warranty || null, unitSize: row.unitSize || null,
        isAvailableForOrder: row.availability === 'Nhận đặt hàng', images: Array.isArray(source.images) && source.images[0] === row.image ? source.images : row.image ? [row.image] : [] };
      if (method === 'POST') Object.assign(body, { priceMode: row.priceType, price: row.priceType === 'contact' ? null : row.price });
      break;
    }
    case 'categories': case 'brands': body = { name: row.name, code: row.code, isActive: row.status === 'Đang hiển thị', ...(resource === 'categories' ? { domain: row.domain, displayOrder: row.displayOrder } : {}) }; break;
    case 'articles': {
      const sections: unknown = JSON.parse(String(row.content));
      if (!Array.isArray(sections) || !sections.every(s => isRecord(s) && Array.isArray(s.body) && s.body.every(x => typeof x === 'string'))) throw new Error('Nội dung phải là mảng JSON gồm các mục có body là danh sách đoạn văn.');
      body = { ...original(['authorRole', 'authorAvatarUrl', 'readTimeMinutes', 'tagsJson', 'leadParagraph', 'isFeatured']), title: row.name, slug: row.slug, categoryCode: row.category, authorName: row.author, excerpt: row.description, sectionsJson: row.content, coverImageUrl: row.image,
        authorRole: source.authorRole ?? 'Aura Specialist', readTimeMinutes: source.readTimeMinutes ?? 5, leadParagraph: source.leadParagraph ?? row.description }; break;
    }
    case 'orders': return { path: path + '/status', method: 'PATCH' as const, body: { ...version, expectedSequence: row.sequence, status: Object.keys(orderStatuses).find(k => orderStatuses[k] === row.status), note: row.description } };
    case 'contacts': return { path: path + '/status', method: 'PATCH' as const, body: { ...version, status: Object.keys(contactStatuses).find(k => contactStatuses[k] === row.status) } };
    default: throw new Error('Chức năng này chỉ hỗ trợ xem dữ liệu.');
  }
  if (method !== 'POST') Object.assign(body, version);
  return { path, method, body };
}
