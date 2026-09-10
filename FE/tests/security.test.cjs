const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { serializeJsonLd, isSafeImageUrl, csvCell, isSameOriginMutation, contentSecurityPolicy } = require('../src/lib/security.ts');
const { allowedBackendRoute, sessionCookies, secureSessionCookie } = require('../src/lib/backend-policy.ts');
const { apiRequest, ApiError } = require('../src/lib/api-client.ts');

test('JSON-LD cannot close its script element, while data round-trips intact', () => {
  const payload = { name: '</script><script>globalThis.pwned=1</script>&\u2028\u2029' };
  const encoded = serializeJsonLd(payload);
  assert.ok(!encoded.includes('<') && !encoded.includes('>') && !encoded.includes('&'));
  assert.deepEqual(JSON.parse(encoded), payload);
});
test('image sources reject executable schemes, external hosts and credentials', () => {
  for (const url of ['javascript:alert(1)', 'data:image/svg+xml,<svg onload=alert(1)>', '//evil.test/a', '/\\evil.test/a', 'https://evil.test/a', 'https://user@images.unsplash.com/a', 'https://images.unsplash.com:444/a']) assert.equal(isSafeImageUrl(url), false, url);
  assert.equal(isSafeImageUrl('/images/a.png'), true);
  assert.equal(isSafeImageUrl('https://images.unsplash.com/a?w=100'), true);
});
test('CSV escapes formulas even behind leading whitespace and quotes', () => {
  for (const value of ['=1+1', ' +CMD()', '\t@SUM(1)', '\r-1', '  =HYPERLINK("evil")']) assert.ok(csvCell(value).startsWith('"\''));
  assert.equal(csvCell('a"b'), '"a""b"');
});
test('CSRF requires exact origin, JSON and custom header; sibling subdomains denied', () => {
  const headers = new Headers({ origin: 'https://shop.test', 'content-type': 'application/json', 'x-aura-request': '1', 'sec-fetch-site': 'same-origin' });
  assert.equal(isSameOriginMutation(headers, 'https://shop.test'), true);
  for (const [key, value] of [['origin', 'https://evil.test'], ['origin', 'null'], ['origin', 'https://shop.test.evil.test'], ['content-type', 'text/plain'], ['x-aura-request', ''], ['sec-fetch-site', 'same-site']]) {
    const changed = new Headers(headers); changed.set(key, value);
    assert.equal(isSameOriginMutation(changed, 'https://shop.test'), false);
  }
  headers.delete('origin'); assert.equal(isSameOriginMutation(headers, 'https://shop.test'), false);
});
test('production CSP requires a nonce and forbids inline script handlers / eval', () => {
  const policy = contentSecurityPolicy('testNonce', false);
  const scripts = policy.split('; ').find(part => part.startsWith('script-src '));
  assert.ok(scripts.includes("'nonce-testNonce'"));
  assert.ok(!scripts.includes('unsafe-inline') && !scripts.includes('unsafe-eval'));
  assert.ok(policy.includes("script-src-attr 'none'") && policy.includes("frame-ancestors 'none'") && policy.includes("object-src 'none'"));
  assert.ok(contentSecurityPolicy('dev', true).includes('unsafe-eval'));
});
test('gateway has no open proxy or generic payment/order mutation surface', () => {
  for (const route of ['https://evil.test', '../auth/me', 'admin/payments', 'admin/orders/id', 'admin/products/../me', 'admin/products/x/y', 'auth/me?admin=true']) assert.equal(allowedBackendRoute(route, 'POST'), false);
  assert.equal(allowedBackendRoute('admin/payments/id', 'PUT'), false);
  assert.equal(allowedBackendRoute('admin/orders/id', 'DELETE'), false);
  assert.equal(allowedBackendRoute('admin/orders/id', 'PATCH'), true);
  assert.equal(allowedBackendRoute('auth/logout', 'GET'), false);
  assert.equal(allowedBackendRoute('checkout/quote', 'POST'), true);
});
test('only session cookies are relayed and security attributes cannot be weakened', () => {
  assert.equal(sessionCookies('role=admin; .AspNetCore.Identity.Application=opaque; theme=dark; .AspNetCore.Identity.ApplicationC1=chunk'), '.AspNetCore.Identity.Application=opaque; .AspNetCore.Identity.ApplicationC1=chunk');
  const cookie = secureSessionCookie('.AspNetCore.Identity.Application=x; Domain=evil.test; Path=/evil; SameSite=None', true);
  assert.equal(cookie, '.AspNetCore.Identity.Application=x; Path=/; HttpOnly; SameSite=Lax; Secure');
  assert.equal(secureSessionCookie('role=admin; Path=/', true), null);
  assert.ok(secureSessionCookie('.AspNetCore.Identity.Application=; Max-Age=0', true).includes('Max-Age=0'));
});
test('API client fails closed, sanitizes errors and sends no browser bearer token', async () => {
  const previous = global.fetch;
  try {
    global.fetch = async (url, options) => {
      assert.equal(url, '/api/backend/auth/login'); assert.equal(options.credentials, 'same-origin');
      assert.equal(options.cache, 'no-store'); assert.equal(options.headers['X-Aura-Request'], '1');
      assert.equal(options.headers.Authorization, undefined);
      return new Response('<script>secret stack trace</script>', { status: 500 });
    };
    await assert.rejects(apiRequest('/auth/login', { method: 'POST', body: { email: 'test', password: 'test' } }), error => error instanceof ApiError && !error.message.includes('secret'));
    global.fetch = async () => new Response('<html>login</html>', { status: 200, headers: { 'Content-Type': 'text/html' } });
    await assert.rejects(apiRequest('/auth/me'), ApiError);
    global.fetch = async () => { throw new Error('private connection details'); };
    await assert.rejects(apiRequest('/cart'), error => error.status === 503 && !error.message.includes('private'));
    await assert.rejects(apiRequest('//evil.test/path'), ApiError);
  } finally { global.fetch = previous; }
});
test('application never persists business data or credentials to browser storage', () => {
  function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
  for (const file of walk(path.join(__dirname, '../src')).filter(file => /\.tsx?$/.test(file))) {
    const source = fs.readFileSync(file, 'utf8');
    assert.ok(!/(?:localStorage|sessionStorage)\s*\.\s*(?:setItem|getItem)/.test(source), file);
  }
});
