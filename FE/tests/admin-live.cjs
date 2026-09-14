// Opt-in local integration test. Creates isolated named records and archives/deactivates them afterward.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const origin = process.env.ADMIN_TEST_ORIGIN || 'http://localhost:3000';
const email = process.env.ADMIN_TEST_EMAIL;
const password = process.env.ADMIN_TEST_PASSWORD;
if (!email || !password) throw new Error('Set ADMIN_TEST_EMAIL and ADMIN_TEST_PASSWORD for a local test account.');
const config = path.resolve(__dirname, '../.env.development.local');
const originalConfig = fs.readFileSync(config, 'utf8');
const records = [];
const prefix = 'codex-check-' + Date.now();
const headers = { Origin: origin, 'X-Aura-Request': '1', 'Content-Type': 'application/json' };
let browser, context;
async function request(resource, method = 'GET', data) {
  const response = await context.request.fetch(origin + '/api/backend' + resource, { method, headers, ...(method !== 'GET' ? { data: data ?? {} } : {}) });
  const value = await response.json();
  assert.ok(response.ok(), `${method} ${resource}: ${response.status()} ${JSON.stringify(value)}`);
  return value.data ?? value;
}
async function pageRecord(resource, name) {
  const data = await request(`/admin/${resource}?page=1&pageSize=100`);
  return data.items.find(row => (row.name ?? row.title) === name);
}
async function main() {
  try {
    if (process.env.ADMIN_TEST_BACKEND) {
      fs.writeFileSync(config, originalConfig.replace(/^API_BASE_URL=.*$/m, 'API_BASE_URL=' + process.env.ADMIN_TEST_BACKEND));
      await new Promise(r => setTimeout(r, 1800));
    }
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    context = await browser.newContext();
    const page = await context.newPage();
    page.on('pageerror', error => console.error('BROWSER', error.message));
    await page.goto(origin + '/admin/login');
    await page.locator('input[name=email]').fill(email);
    await page.locator('input[name=password]').fill(password);
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await page.waitForURL(origin + '/admin');
    for (const section of ['', '/products', '/categories', '/brands', '/inventory', '/orders', '/customers', '/articles', '/contacts', '/payments']) {
      await page.goto(origin + '/admin' + section);
      await page.getByText('Đang tải dữ liệu…', { exact: true }).waitFor({ state: 'hidden' });
      assert.equal(await page.locator('.adm-empty[role=alert]').count(), 0, 'Load failure: ' + section + ' ' + await page.locator('.adm-empty[role=alert]').allTextContents());
      console.log('PASS admin page', section || '/dashboard');
    }
    for (const [resource, singular] of [['categories', 'danh mục'], ['brands', 'thương hiệu']]) {
      await page.goto(origin + '/admin/' + resource);
      await page.getByRole('button', { name: 'Thêm ' + singular, exact: true }).click();
      await page.locator('input[name=name]').fill(prefix + '-' + resource);
      await page.locator('input[name=code]').fill(prefix + '-' + resource);
      await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click();
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
      const record = await pageRecord(resource, prefix + '-' + resource);
      assert.ok(record); records.push({ resource, id: record.id });
    }
    await page.goto(origin + '/admin/products');
    await page.getByRole('button', { name: 'Thêm sản phẩm', exact: true }).click();
    for (const [key, value] of Object.entries({ name: prefix, slug: prefix, sku: prefix, price: '123000', image: '/images/product-placeholder.svg', warranty: '12 tháng' })) await page.locator('input[name=' + key + ']').fill(value);
    await page.locator('select[name=categoryId]').selectOption(records[0].id);
    await page.locator('select[name=brandId]').selectOption(records[1].id);
    await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    let product = await pageRecord('products', prefix);
    assert.ok(product); records.unshift({ resource: 'products', id: product.id });
    assert.equal(product.isPublished, false);
    await page.getByRole('button', { name: 'Sửa ' + prefix, exact: true }).click();
    await page.locator('textarea[name=description]').fill('Mô tả kiểm thử');
    await page.locator('input[name=image]').fill('/images/product-placeholder.svg?v=2');
    await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await page.locator('tr').filter({ hasText: prefix }).getByRole('button', { name: 'Sửa giá', exact: true }).click();
    await page.locator('input[name=price]').fill('150000');
    await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    product = await pageRecord('products', prefix); assert.equal(product.price, 150000); assert.equal(product.shortDescription, 'Mô tả kiểm thử');
    await page.locator('tr').filter({ hasText: prefix }).getByRole('button', { name: 'Xuất bản', exact: true }).click();
    await page.locator('tr').filter({ hasText: prefix }).getByRole('button', { name: 'Chuyển nháp', exact: true }).waitFor();
    await page.goto(origin + '/products/' + prefix);
    await page.getByRole('heading', { name: prefix, exact: true }).waitFor();
    const cart = await request('/cart/items', 'POST', { productId: product.id, quantity: 2 });
    assert.equal(cart.items[0].price, 150000); assert.equal(cart.items[0].quantity, 2);
    await request('/cart/items/' + product.id, 'DELETE');
    console.log('PASS product create, general edit, price, publication, storefront and cart');
    const article = await request('/admin/articles', 'POST', { title: prefix, slug: prefix, excerpt: 'Kiểm thử', categoryCode: 'new-products', authorName: 'Kiểm thử', coverImageUrl: '/images/product-placeholder.svg', leadParagraph: 'Kiểm thử', sectionsJson: '[{"body":["Kiểm thử"]}]' });
    records.unshift({resource:'articles', id:article.id});
    await request('/admin/articles/' + article.id + '/publish', 'PATCH', {version:article.version,isPublished:true});
    await page.goto(origin + '/admin/articles');
    await page.getByRole('cell', {name:prefix, exact:true}).waitFor();
    console.log('PASS article publication and admin list');
  } finally {
    if (context) {
      for (const {resource,id} of records) {
        try {
          const rows = await request(`/admin/${resource}?page=1&pageSize=100`);
          const current = rows.items.find(row => row.id === id);
          if (current) await request(`/admin/${resource}/${id}`, 'DELETE', {version:current.version});
          console.log('CLEANED',resource,id);
        } catch(e) { console.error('CLEANUP FAILED',resource,id,e.message); process.exitCode=1; }
      }
    }
    if (browser) await browser.close();
    fs.writeFileSync(config,originalConfig);
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
