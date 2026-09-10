'use client';
import { useEffect } from 'react';

export function LegacyStorageCleanup() {
  useEffect(() => {
    // Remove only the retired business/auth caches; leave UI preferences alone.
    for (const key of ['aura_coffee_user', 'aura_coffee_cart', 'aura-admin-demo-v1', 'aura-admin-data-v1']) {
      try { localStorage.removeItem(key); } catch { /* Storage can be disabled. */ }
    }
    try { sessionStorage.removeItem('aura-admin-demo-session'); } catch { /* No session is stored here anymore. */ }
  }, []);
  return null;
}
