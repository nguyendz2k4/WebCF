import 'server-only';
import { cookies } from 'next/headers';
import { parseSession, type Session } from './contracts';
import { sessionCookies } from './backend-policy';

export function backendUrl(path: string): URL {
  const configured = process.env.API_BASE_URL;
  if (!configured) throw new Error('Backend is not configured');
  const base = new URL(configured.endsWith('/') ? configured : `${configured}/`);
  if (base.username || base.password || base.search || base.hash || !['http:', 'https:'].includes(base.protocol)
    || (process.env.NODE_ENV === 'production' && base.protocol !== 'https:')) throw new Error('Invalid backend configuration');
  return new URL(path, base);
}

export async function getServerSession(): Promise<{ session: Session | null; unavailable: boolean }> {
  const cookie = sessionCookies((await cookies()).toString());
  if (!cookie) return { session: null, unavailable: false };
  try {
    const response = await fetch(backendUrl('auth/me'), {
      headers: { Cookie: cookie, Accept: 'application/json' }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000),
    });
    if (response.status === 401) return { session: null, unavailable: false };
    if (!response.ok) throw new Error('Session unavailable');
    return { session: parseSession(await response.json()), unavailable: false };
  } catch { return { session: null, unavailable: true }; }
}
