const resources = 'products|categories|brands|customers|articles|contacts';
export function allowedBackendRoute(path: string, method: string): boolean {
  if (/^auth\/(login|register|logout)$/.test(path)) return method === 'POST';
  if (path === 'auth/me') return method === 'GET';
  if (path === 'cart') return ['GET', 'DELETE'].includes(method);
  if (path === 'cart/items') return method === 'POST';
  if (/^cart\/items\/[a-zA-Z0-9_-]+$/.test(path)) return ['PUT', 'DELETE'].includes(method);
  if (path === 'orders') return method === 'POST';
  if (/^orders\/[a-zA-Z0-9_-]+$/.test(path)) return method === 'GET';
  if (path === 'contacts') return method === 'POST';
  if (path === 'newsletter/subscriptions' || path === 'checkout/quote') return method === 'POST';
  if (path === 'admin/workspace') return method === 'GET';
  if (/^admin\/(orders|inventory)\/[a-zA-Z0-9_-]+$/.test(path)) return method === 'PATCH';
  if (new RegExp(`^admin/(${resources})$`).test(path)) return method === 'POST';
  return new RegExp(`^admin/(${resources})/[a-zA-Z0-9_-]+$`).test(path) && ['PUT', 'DELETE'].includes(method);
}

// Only Identity's session cookie (including its chunked representation) is forwarded.
const identityCookie = /^(?:\.AspNetCore\.Identity\.Application(?:C[1-9]\d*)?|\.Aura\.Cart)$/;
export function sessionCookies(header: string): string {
  return header.split(';').map(part => part.trim()).filter(part => identityCookie.test(part.split('=')[0])).join('; ');
}
export function secureSessionCookie(header: string, production: boolean): string | null {
  const [pair, ...attributes] = header.split(';').map(part => part.trim());
  if (!identityCookie.test(pair.split('=')[0])) return null;
  const expiry = attributes.filter(attribute => /^(expires|max-age)=/i.test(attribute));
  return [pair, ...expiry, 'Path=/', 'HttpOnly', 'SameSite=Lax', ...(production ? ['Secure'] : [])].join('; ');
}
