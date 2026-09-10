const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
async function main() {
  const app = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'start', '-p', '3198'], { cwd: root, windowsHide: true, stdio: 'pipe', env: { ...process.env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' } });
  let output = ''; app.stdout.on('data', chunk => output += chunk); app.stderr.on('data', chunk => output += chunk);
  let browser;
  try {
    const url = 'http://localhost:3198/admin/login';
    let first;
    for (let i = 0; i < 60; i++) {
      if (app.exitCode !== null) throw new Error(output);
      try { first = await fetch(url); break; } catch { await new Promise(resolve => setTimeout(resolve, 500)); }
    }
    assert.ok(first?.ok, output);
    const csp = first.headers.get('content-security-policy');
    assert.ok(csp.includes("script-src-attr 'none'")); assert.ok(!csp.includes('unsafe-eval'));
    const nonce = csp.match(/'nonce-([^']+)'/)[1];
    const html = await first.text();
    assert.ok(html.includes(`nonce="${nonce}"`));
    const second = await fetch(url);
    assert.notEqual(csp, second.headers.get('content-security-policy'));
    assert.ok(first.headers.get('cache-control').includes('no-store'));
    assert.equal(first.headers.get('x-frame-options'), 'DENY');
    assert.equal(first.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(first.headers.get('x-powered-by'), null);
    assert.ok(first.headers.get('strict-transport-security').includes('max-age='));
    browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
    const page = await browser.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    // Simulate untrusted parser-inserted HTML, preserving the real response CSP.
    await page.route(url, async route => {
      const response = await route.fetch();
      await route.fulfill({ response, body: (await response.text()).replace('</body>', '<script>globalThis.parserInjected=1</script><img src="/missing-test-image" onerror="globalThis.eventInjected=1"></body>') });
    });
    await page.goto(url);
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).waitFor();
    await page.getByLabel('Email quản trị').fill('test@example.invalid');
    await page.getByLabel('Mật khẩu').fill('not-a-real-password');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await page.getByRole('status').waitFor(); // React hydrated even with a strict production CSP.
    assert.equal(await page.evaluate(() => globalThis.parserInjected), undefined);
    assert.equal(await page.evaluate(() => globalThis.eventInjected), undefined);
    assert.deepEqual(errors, []);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.getByRole('button', { name: 'Đăng nhập', exact: true }).isVisible());
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    console.log('PASS: production CSP nonces rotate, private pages not cached, security headers present, script/event injection blocked, React hydration and 390px login work');
  } finally { if (browser) await browser.close(); app.kill(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
