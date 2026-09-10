import type { User, CartItem } from '@/types';
import { isSafeImageUrl } from './security';

export interface Session { user: User; isAdmin: boolean }
export interface Credentials { email: string; password: string }
export interface Registration extends Credentials { name: string; shopName?: string }
export interface OrderReceipt { id: string; orderCode: string; total: number; status: string; paymentStatus: string }

export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
export function parseSession(value: unknown): Session {
  if (!isRecord(value) || !isRecord(value.user) || typeof value.isAdmin !== 'boolean') throw new Error('Invalid session');
  const user = value.user;
  if (!['id', 'name', 'email'].every(key => typeof user[key] === 'string' && user[key].length > 0)
    || !['owner', 'barista', 'guest'].includes(String(user.role))
    || !['phone', 'avatar', 'shopName'].every(key => user[key] === undefined || typeof user[key] === 'string')) throw new Error('Invalid user');
  return { isAdmin: value.isAdmin, user: {
    id: user.id as string, name: user.name as string, email: user.email as string,
    role: user.role as User['role'], phone: user.phone as string | undefined,
    shopName: user.shopName as string | undefined,
    avatar: typeof user.avatar === 'string' && isSafeImageUrl(user.avatar) ? user.avatar : undefined,
  } };
}
export function parseCart(value: unknown): CartItem[] {
  if (!isRecord(value) || !Array.isArray(value.items) || !value.items.every(item =>
    isRecord(item) && ['id', 'title', 'formattedPrice', 'image'].every(key => typeof item[key] === 'string')
    && ['equipment', 'beans', 'package', 'service'].includes(String(item.category))
    && typeof item.price === 'number' && Number.isFinite(item.price) && item.price >= 0
    && typeof item.quantity === 'number' && Number.isSafeInteger(item.quantity) && item.quantity > 0 && item.quantity <= 999
    && isSafeImageUrl(String(item.image)))) throw new Error('Invalid cart');
  return value.items as CartItem[];
}
export function parseReceipt(value: unknown): OrderReceipt {
  if (!isRecord(value) || !['id', 'orderCode', 'status', 'paymentStatus'].every(key => typeof value[key] === 'string' && value[key].length)
    || typeof value.total !== 'number' || !Number.isFinite(value.total) || value.total < 0) throw new Error('Invalid order');
  return value as unknown as OrderReceipt;
}
