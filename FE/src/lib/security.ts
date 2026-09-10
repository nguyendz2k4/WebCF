// Context-specific encoding: JSON is data, never executable HTML.
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

export function isSafeImageUrl(value: string): boolean {
  if (/^\/(?!\/)/.test(value) && !/[\\\x00-\x20]/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'images.unsplash.com' && !url.username && !url.password && !url.port;
  } catch { return false; }
}

export function csvCell(value: unknown): string {
  const text = String(value ?? '');
  const safe = /^[\s\u0000-\u001f]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function isSameOriginMutation(headers: Headers, expectedOrigin: string): boolean {
  return headers.get('origin') === expectedOrigin
    && headers.get('x-aura-request') === '1'
    && !['cross-site', 'same-site'].includes(headers.get('sec-fetch-site') ?? '')
    && headers.get('content-type')?.split(';')[0].trim() === 'application/json';
}

export function contentSecurityPolicy(nonce: string, development: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ''}`,
    "script-src-attr 'none'",
    // Existing React styles and Framer Motion need style attributes; scripts remain nonce-only.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://images.unsplash.com",
    "font-src 'self'",
    `connect-src 'self'${development ? ' ws: wss:' : ''}`,
    "object-src 'none'", "base-uri 'none'", "form-action 'self'", "frame-ancestors 'none'",
    ...(!development ? ['upgrade-insecure-requests'] : []),
  ].join('; ');
}
