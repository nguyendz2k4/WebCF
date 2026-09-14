const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
const { isSafeImageUrl } = require('../src/lib/security.ts');

function load(file, bindings, names) {
  const source = fs.readFileSync(require.resolve(file), 'utf8').replace(/^import .*;\r?\n/gm, '').replace(/export /g, '');
  return vm.runInNewContext(stripTypeScriptTypes(source) + `\n;({ ${names} })`, bindings);
}
const isRecord = value => !!value && typeof value === 'object' && !Array.isArray(value);
const equipment = {
  id: 'one', slug: 'machine-one', title: 'Máy pha', description: 'Máy pha cà phê',
  category: 'espresso-machines', domain: 'equipment', brand: 'Brand', priceType: 'fixed',
  price: 100, formattedPrice: '100 ₫', createdAt: '2026-09-11T00:00:00Z',
  inStock: true, images: ['/images/machine.jpg'], specs: { warranty: null, groups: 2 },
  suitableFor: ['home'], beanDetails: null,
};
function catalog(fetch) {
  return load('../src/lib/public-data.ts', { fetch, URL, AbortSignal, isRecord, isSafeImageUrl,
    cache: fn => fn, backendUrl: path => new URL(path, 'http://localhost/api/') }, 'getProducts, getArticles');
}
test('real BE envelope and DTO map both domains across all pages', async () => {
  const calls = [];
  const api = catalog(async url => {
    calls.push(url.searchParams.get('page'));
    const row = calls.length === 1 ? equipment : { ...equipment, id: 'two', domain: 'ingredients',
      specs: null, beanDetails: { origin: 'Đà Lạt', unitSize: '1kg', caseSize: '6 gói', flavorNotes: ['Chocolate'] } };
    return Response.json({ success: true, data: { items: [row], page: calls.length, totalPages: 2 } });
  });
  const products = await api.getProducts();
  assert.deepEqual(calls, ['1', '2']);
  assert.equal(products[0].name, equipment.title);
  assert.equal(products[0].specs.warranty, '');
  assert.equal(products[1].packaging.unitSize, '1kg');
  assert.equal(products[1].origin, 'Đà Lạt');
});
test('empty catalog works; unsuccessful envelopes and unsafe images are rejected', async () => {
  assert.equal((await catalog(async () => Response.json({ success: true, data: { items: [], page: 1, totalPages: 0 } })).getProducts()).length, 0);
  await assert.rejects(catalog(async () => Response.json({ success: false, data: [] })).getProducts());
  await assert.rejects(catalog(async () => Response.json({ success: true, data: { items: [{ ...equipment, images: ['javascript:alert(1)'] }], page: 1, totalPages: 1 } })).getProducts());
});
test('Identity session accepts API envelope and nullable optional fields without trusting failed responses', () => {
  const { parseSession } = load('../src/lib/contracts.ts', { isSafeImageUrl }, 'parseSession');
  const data = { user: { id: 'admin', name: 'Admin', email: 'admin@example.test', role: 'owner', phone: null, avatar: null, shopName: null }, isAdmin: true };
  assert.equal(parseSession({ success: true, data }).isAdmin, true);
  assert.equal(parseSession({ success: true, data }).user.phone, undefined);
  assert.throws(() => parseSession({ success: false, data }));
});
test('article DTO uses the same pagination envelope and parses section JSON', async () => {
  const row = { id: 'news', slug: 'coffee-news', title: 'Cà phê', excerpt: 'Tin mới', category: 'new-products',
    coverImage: '/images/news.jpg', authorName: 'Aura', authorRole: 'Editor', authorAvatar: null,
    publishedAt: '2026-09-11T00:00:00Z', readTime: 3, tags: [], leadParagraph: 'Giới thiệu',
    content: JSON.stringify([{ heading: 'Tin mới', body: ['Nội dung'] }]) };
  const rows = await catalog(async () => Response.json({ success: true, data: { items: [row], page: 1, totalPages: 1 } })).getArticles();
  assert.equal(rows[0].author.name, 'Aura');
  assert.equal(rows[0].readTime, '3 phút đọc');
  assert.equal(rows[0].content.sections[0].body[0], 'Nội dung');
});
