const resources = 'products|categories|brands|articles';
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
  if (/^admin\/(products|categories|brands|orders|articles|contacts|customers|payments)$/.test(path) && method === 'GET') return true;
  if (/^admin\/(products|articles)\/[a-zA-Z0-9_-]+\/publish$/.test(path)) return method === 'PATCH';
  if (/^admin\/products\/[a-zA-Z0-9_-]+\/price$/.test(path)) return method === 'PATCH';
  if (/^admin\/(orders|contacts)\/[a-zA-Z0-9_-]+\/status$/.test(path)) return method === 'PATCH';
  if (new RegExp(`^admin/(${resources})$`).test(path)) return method === 'POST';
  return new RegExp(`^admin/(${resources})/[a-zA-Z0-9_-]+$`).test(path) && ['PUT', 'DELETE'].includes(method);
}

export function allowedBackendQuery(path: string, method: string, query: URLSearchParams): boolean {
  if (!query.size) return true;
  if (method !== 'GET' || !/^admin\/(products|categories|brands|orders|articles|contacts|customers|payments)$/.test(path)) return false;
  return [...query.keys()].every(key => ['page', 'pageSize'].includes(key) && query.getAll(key).length === 1
    && /^[1-9]\d*$/.test(query.get(key) ?? '') && Number(query.get(key)) <= (key === 'pageSize' ? 100 : 1000000));
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
