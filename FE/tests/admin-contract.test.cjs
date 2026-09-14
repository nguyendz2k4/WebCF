const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
const { ApiError } = require('../src/lib/api-client.ts');
function load(apiRequest) {
  const source = fs.readFileSync(require.resolve('../src/components/admin/admin-api.ts'), 'utf8').replace(/^import .*;\r?\n/gm, '').replace(/export /g, '');
  return vm.runInNewContext(stripTypeScriptTypes(source) + '\n;({ toAdminRow, adminMutation, loadAdminData })', {
    apiRequest, ApiError, isRecord: v => !!v && typeof v === 'object' && !Array.isArray(v),
    createEmptyData: () => Object.fromEntries(['products','categories','brands','orders','articles','contacts','customers','payments'].map(k => [k, []])),
  });
}
test('product edit preserves hidden specifications and never overposts price or publication', () => {
  const { toAdminRow, adminMutation } = load();
  const row = toAdminRow('products', { id: 'p', version: 'v1', name: 'Old', price: 100, priceMode: 'fixed', isPublished: false, images: ['/a.jpg', '/b.jpg'], groupsCount: 2, voltage: '220V', flavorNotesJson: '["sweet"]' });
  const edit = adminMutation('products', 'PUT', { ...row, name: 'New' });
  assert.equal(edit.body.name, 'New');
  assert.equal(edit.body.groupsCount, 2); assert.equal(edit.body.voltage, '220V');
  assert.equal(edit.body.images.length, 2); assert.equal(edit.body.version, 'v1');
  assert.equal('price' in edit.body, false); assert.equal('isPublished' in edit.body, false);
  const price = adminMutation('products', 'PATCH', { ...row, _action: 'price', price: 200 });
  assert.equal(price.path, '/admin/products/p/price'); assert.equal(price.body.price, 200);
  const publish = adminMutation('products', 'PATCH', { ...row, _action: 'publish', publish: 1 });
  assert.equal(publish.path, '/admin/products/p/publish'); assert.equal(publish.body.isPublished, true);
});
test('status updates use backend enums and order sequence', () => {
  const { adminMutation } = load();
  const order = adminMutation('orders','PATCH',{id:'o',status:'Đã xác nhận',sequence:3,version:'v'});
  assert.equal(order.path,'/admin/orders/o/status'); assert.equal(order.body.status,'confirmed'); assert.equal(order.body.expectedSequence,3);
  const contact = adminMutation('contacts','PATCH',{id:'c',status:'Đã giải quyết',version:'v'});
  assert.equal(contact.path,'/admin/contacts/c/status'); assert.equal(contact.body.status,'closed');
});
test('admin loads every page only from resources the session may view', async () => {
  const calls = [];
  const { loadAdminData } = load(async path => {
    calls.push(path);
    if (path === '/auth/me') return { isAdmin: true, permissions: ['Permissions.Categories.View'] };
    return { items: [{ id: 'cat-' + calls.length, name: 'Category', isActive: true }], page: calls.length - 1, totalPages: 2 };
  });
  const value = await loadAdminData('dashboard', new AbortController().signal);
  assert.equal(value.data.categories.length, 2); assert.equal(calls.length, 3);
  assert.ok(calls.slice(1).every(p => p.startsWith('/admin/categories?')));
  await assert.rejects(loadAdminData('payments', new AbortController().signal), e => e.status === 403);
});

module.exports = { load };
