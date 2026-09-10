// Isolated contract fixture. Never imported by application code and never uses real credentials.
const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const origin = 'http://localhost:3197';
const payload = '</script><script>globalThis.injected=1</script>';
const product = { id: 'product-1', slug: 'test-product', name: payload, sku: 'TEST', brand: 'Test', shortDescription: 'Contract test', category: 'espresso-machines', domain: 'equipment', price: 1000000, formattedPrice: '1.000.000 ₫', priceType: 'fixed', images: ['/favicon.ico'], inStock: true, createdAt: '2026-01-01', specs: { warranty: '12 tháng' }, suitableFor: ['home'] };
const cartItem = { id: product.id, title: product.name, category: 'equipment', price: product.price, formattedPrice: product.formattedPrice, image: '/favicon.ico', quantity: 1 };
const workspace = { products: [], categories: [], brands: [], orders: [], customers: [], articles: [], contacts: [], payments: [] };
const session = { user: { id: 'user-1', name: 'Test User', email: 'admin@test.invalid', role: 'owner' }, isAdmin: true };
let expired = false, failSave = false, failWorkspace = false, mutations = 0, orderCount = 0;
const orderKeys = [];
const logs = [];
const server = http.createServer(async (req, res) => {
  let text = ''; for await (const chunk of req) text += chunk;
  const body = text ? JSON.parse(text) : {};
  const json = (value, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
  const authenticated = req.headers.cookie?.includes('.AspNetCore.Identity.Application=test-session') && !expired;
  if (req.url === '/api/auth/me') return json(session, authenticated ? 200 : 401);
  if (req.url === '/api/auth/login') {
    if (body.password !== 'test-password-123') return json({}, 401);
    res.setHeader('Set-Cookie', '.AspNetCore.Identity.Application=test-session; Path=/; SameSite=None');
    return json({});
  }
  if (req.url === '/api/auth/logout') { res.setHeader('Set-Cookie', '.AspNetCore.Identity.Application=; Max-Age=0'); return json({}); }
  if (req.url === '/api/catalog/products') return json([product]);
  if (req.url === '/api/catalog/articles') return json([]);
  if (req.url === '/api/cart') return json({ items: [] });
  if (req.url === '/api/admin/workspace') return json(workspace, failWorkspace ? 503 : authenticated ? 200 : 401);
  if (req.url === '/api/admin/categories' && req.method === 'POST') {
    mutations++;
    if (failSave) return json({ message: '<script>secret</script>' }, 500);
    workspace.categories.push({ id: 'cat-1', name: body.name, code: body.code, domain: body.domain, displayOrder: body.displayOrder, status: body.status });
    return json(workspace.categories[0], 201);
  }
  if (req.url === '/api/checkout/quote') {
    assert.equal(body.items[0].productId, 'product-1'); assert.equal(body.items[0].price, undefined);
    return json({ id: 'quote-1', total: 1250000, expiresAt: new Date(Date.now() + 600000).toISOString(), items: [cartItem], paymentMethods: [{ id: 'cod', label: 'Thanh toán khi nhận hàng' }] });
  }
  if (req.url === '/api/orders' && req.method === 'POST') {
    assert.equal(body.total, undefined); assert.equal(body.quoteId, 'quote-1');
    orderKeys.push(req.headers['idempotency-key']);
    if (orderKeys.length === 1) { orderCount++; return json({}, 503); }
    assert.equal(orderKeys[1], orderKeys[0]);
    return json({ id: 'order-1', orderCode: 'SERVER-001', total: 1250000, status: 'Chờ xác nhận', paymentStatus: 'Chưa thanh toán' });
  }
  if (req.url === '/api/orders/order-1' && authenticated) return json({ id: 'order-1', orderCode: 'SERVER-001', total: 1250000, status: 'Chờ xác nhận', paymentStatus: 'Chưa thanh toán' });
  return json({}, 404);
});
async function main() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const child = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'dev', '-p', '3197'], {
    cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, API_BASE_URL: `http://127.0.0.1:${server.address().port}/api`, APP_ORIGIN: origin, NEXT_TELEMETRY_DISABLED: '1' },
  });
  child.stdout.on('data', chunk => logs.push(String(chunk)));
  child.stderr.on('data', chunk => logs.push(String(chunk)));
  let browser;
  try {
    for (let i = 0; i < 120; i++) {
      if (child.exitCode !== null) throw new Error('Next exited: ' + logs.join('').slice(-2000));
      try { await fetch(origin + '/admin/login'); break; } catch { await new Promise(resolve => setTimeout(resolve, 500)); }
    }
    browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '/admin/login');
    await page.evaluate(() => { localStorage.setItem('aura_coffee_user', '{"role":"admin"}'); sessionStorage.setItem('aura-admin-demo-session', 'active'); localStorage.setItem('aura-admin-data-v1', '{}'); });
    await page.goto(origin + '/admin');
    await page.waitForURL('**/admin/login');
    await page.waitForFunction(() => !localStorage.getItem('aura_coffee_user') && !sessionStorage.getItem('aura-admin-demo-session'));
    assert.equal(await page.getByText('Trải nghiệm giao diện demo').count(), 0);
    assert.equal((await context.request.get(origin + '/api/backend/admin/workspace')).status(), 401);
    await page.getByLabel('Email quản trị').fill('admin@test.invalid');
    await page.getByLabel('Mật khẩu').fill('wrong-password');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Phiên đăng nhập' }).waitFor();
    assert.ok(page.url().endsWith('/admin/login'));
    await page.getByLabel('Mật khẩu').fill('test-password-123');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await page.waitForURL('**/admin');
    await page.getByRole('heading', { name: 'Tổng quan.' }).waitFor();
    const cookies = await context.cookies();
    assert.equal(cookies.find(cookie => cookie.name === '.AspNetCore.Identity.Application').httpOnly, true);
    assert.ok(!(await page.evaluate(() => document.cookie)).includes('test-session'));
    const csrf = await context.request.post(origin + '/api/backend/admin/categories', { headers: { Origin: 'https://evil.test', 'X-Aura-Request': '1' }, data: { name: 'bad' } });
    assert.equal(csrf.status(), 403); assert.equal(mutations, 0);
    const missingHeader = await context.request.post(origin + '/api/backend/admin/categories', { headers: { Origin: origin }, data: { name: 'bad' } });
    assert.equal(missingHeader.status(), 403); assert.equal(mutations, 0);
    console.log('PASS: fake storage session denied; login verified; HttpOnly cookie; cross-origin/missing-header requests blocked');
    await page.goto(origin + '/admin/categories');
    await page.getByRole('button', { name: 'Thêm danh mục', exact: true }).click();
    await page.getByLabel('Tên danh mục').fill(payload);
    await page.getByLabel('Mã danh mục').fill('test-category');
    failSave = true;
    await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Không thể kết nối' }).waitFor();
    assert.equal(await page.getByRole('dialog').count(), 1); assert.equal(workspace.categories.length, 0);
    failSave = false;
    await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click();
    await page.getByRole('cell', { name: payload, exact: true }).waitFor();
    assert.equal(await page.evaluate(() => globalThis.injected), undefined);
    assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
    console.log('PASS: failed save preserves form; API-confirmed save renders hostile text safely; no local business cache');
    failWorkspace = true; await page.reload();
    await page.getByRole('alert').filter({ hasText: 'Không thể kết nối' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Thêm danh mục', exact: true }).count(), 0);
    failWorkspace = false;
    await page.goto(origin + '/products/test-product');
    await page.getByRole('heading', { name: payload, exact: true }).waitFor();
    assert.equal(await page.evaluate(() => globalThis.injected), undefined);
    const scriptData = await page.locator('script[type="application/ld+json"]').first().textContent();
    assert.equal(JSON.parse(scriptData).name, payload); assert.ok(!scriptData.includes('</script>'));
    // Test an actual HTML attribute sink. A trusted script can deliberately create
    // child scripts under strict-dynamic; that is not an untrusted HTML injection.
    await page.evaluate(() => { const img = document.createElement('img'); img.setAttribute('onerror', 'globalThis.cspBypass=1'); document.body.appendChild(img); img.dispatchEvent(new Event('error')); });
    assert.equal(await page.evaluate(() => globalThis.cspBypass), undefined);
    await page.locator('#navbar-user-btn').waitFor();
    await page.getByRole('button', { name: 'Mua Ngay', exact: true }).first().click();
    await page.getByLabel('Họ tên người nhận').fill('Test User');
    await page.getByLabel('Số điện thoại').fill('0901234567');
    await page.getByLabel('Tỉnh / thành phố').fill('Hà Nội');
    await page.getByLabel('Phường / xã').fill('Test');
    await page.getByLabel('Địa chỉ nhận hàng').fill('Test address');
    await page.getByRole('button', { name: 'Kiểm tra đơn hàng', exact: true }).click();
    await page.getByRole('button', { name: 'Xác nhận đặt hàng', exact: true }).waitFor();
    assert.ok((await page.getByRole('dialog').textContent()).includes('1.250.000'));
    await page.getByRole('button', { name: 'Xác nhận đặt hàng', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'kiểm tra cùng yêu cầu' }).waitFor();
    await page.getByRole('button', { name: 'Kiểm tra lại yêu cầu', exact: true }).click();
    await page.getByText('SERVER-001', { exact: true }).waitFor();
    assert.equal(orderCount, 1); assert.equal(orderKeys.length, 2);
    console.log('PASS: JSON-LD escaping and CSP block script injection; server quote used; uncertain order retry keeps idempotency key');
    await page.goto(origin + '/thank-you?orderId=forged');
    await page.getByRole('alert').waitFor();
    assert.equal(await page.getByText('SERVER-001', { exact: true }).count(), 0);
    expired = true;
    await page.goto(origin + '/admin'); await page.waitForURL('**/admin/login');
    assert.deepEqual(errors, []);
    console.log('PASS: forged order query not trusted; expired session blocked; no client runtime errors');
  } catch (error) {
    console.error(logs.join('').slice(-2500)); throw error;
  } finally {
    if (browser) await browser.close();
    child.kill(); server.closeAllConnections(); server.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
