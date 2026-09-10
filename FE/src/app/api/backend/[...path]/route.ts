import { NextRequest } from 'next/server';
import { backendUrl } from '@/lib/backend-server';
import { allowedBackendRoute, sessionCookies, secureSessionCookie } from '@/lib/backend-policy';
import { isSameOriginMutation } from '@/lib/security';
import { parseSession } from '@/lib/contracts';

export const runtime = 'nodejs';
const privateHeaders = { 'Cache-Control': 'no-store, private', 'X-Content-Type-Options': 'nosniff' };
const fail = (status: number) => Response.json({ error: 'request_failed' }, { status, headers: privateHeaders });

async function readLimited(stream: ReadableStream<Uint8Array> | null, limit: number): Promise<string> {
  if (!stream) return '';
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new RangeError('Body too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks).toString('utf8');
}

async function handle(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await context.params;
  if (parts.some(part => !/^[a-zA-Z0-9_-]+$/.test(part))) return fail(404);
  const path = parts.join('/');
  if (!allowedBackendRoute(path, request.method) || request.nextUrl.search) return fail(404);
  const production = process.env.NODE_ENV === 'production';
  let origin: string;
  try {
    if (production && !process.env.APP_ORIGIN) return fail(503);
    origin = new URL(process.env.APP_ORIGIN ?? request.nextUrl.origin).origin;
    if (production && !origin.startsWith('https://')) return fail(503);
  } catch { return fail(503); }
  if (request.method !== 'GET' && !isSameOriginMutation(request.headers, origin)) return fail(403);
  const headers = new Headers({ Accept: 'application/json' });
  const cookie = sessionCookies(request.headers.get('cookie') ?? '');
  if (cookie) headers.set('Cookie', cookie);
  let body: string | undefined;
  if (request.method !== 'GET') {
    try { body = await readLimited(request.body, 1_048_576); JSON.parse(body); }
    catch (error) { return fail(error instanceof RangeError ? 413 : 400); }
    headers.set('Content-Type', 'application/json');
    headers.set('Origin', origin);
    headers.set('X-Aura-Request', '1');
    const key = request.headers.get('idempotency-key');
    if (key) {
      if (!/^[a-zA-Z0-9-]{16,100}$/.test(key)) return fail(400);
      headers.set('Idempotency-Key', key);
    }
  }
  try {
    // Backend still MUST authorize every endpoint, including each resource ID.
    if (path.startsWith('admin/')) {
      if (!cookie) return fail(401);
      const auth = await fetch(backendUrl('auth/me'), { headers: { Cookie: cookie, Accept: 'application/json' }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000) });
      if (auth.status === 401) return fail(401);
      if (!auth.ok) return fail(503);
      if (!parseSession(JSON.parse(await readLimited(auth.body, 65536))).isAdmin) return fail(403);
    }
    const response = await fetch(backendUrl(path), { method: request.method, headers, body, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000) });
    const responseHeaders = new Headers(privateHeaders);
    for (const cookieHeader of response.headers.getSetCookie()) {
      const safe = secureSessionCookie(cookieHeader, production);
      if (safe) responseHeaders.append('Set-Cookie', safe);
    }
    if (!response.ok) return Response.json({ error: 'request_failed' }, { status: response.status >= 400 && response.status < 500 ? response.status : 502, headers: responseHeaders });
    if (response.status === 204) return new Response(null, { status: 204, headers: responseHeaders });
    if (!response.headers.get('content-type')?.includes('application/json')) return fail(502);
    const text = await readLimited(response.body, 5_242_880);
    JSON.parse(text);
    responseHeaders.set('Content-Type', 'application/json; charset=utf-8');
    return new Response(text, { status: response.status, headers: responseHeaders });
  } catch { return fail(503); }
}
export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
