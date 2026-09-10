'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/stores/AppContext';
import { apiRequest, errorMessage } from '@/lib/api-client';
import { isRecord, parseCart, parseReceipt, type OrderReceipt } from '@/lib/contracts';
import type { CartItem } from '@/types';

type Quote = { id: string; total: number; expiresAt: string; items: CartItem[]; paymentMethods: { id: string; label: string }[] };
const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
function parseQuote(value: unknown): Quote {
  if (!isRecord(value) || typeof value.id !== 'string' || !value.id || typeof value.total !== 'number'
    || !Number.isFinite(value.total) || value.total < 0 || typeof value.expiresAt !== 'string'
    || !Number.isFinite(Date.parse(value.expiresAt)) || !Array.isArray(value.paymentMethods) || !value.paymentMethods.length
    || !value.paymentMethods.every(method => isRecord(method) && typeof method.id === 'string' && /^[a-z0-9_-]+$/.test(method.id) && typeof method.label === 'string')) throw new Error('Invalid quote');
  return { id: value.id, total: value.total, expiresAt: value.expiresAt, items: parseCart(value), paymentMethods: value.paymentMethods as Quote['paymentMethods'] };
}

export function CheckoutModal() {
  const { user, isCheckoutOpen, setIsCheckoutOpen, checkoutItems, checkoutFromCart, refreshCart } = useApp();
  const [shipping, setShipping] = useState({ recipientName: '', phone: '', province: '', district: '', addressLine: '', deliveryNote: '' });
  const [quote, setQuote] = useState<Quote | null>(null);
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const idempotencyKey = useRef('');
  const dialog = useRef<HTMLDivElement>(null);
  const requestStarted = useRef(false);
  const basketSignature = checkoutItems.map(item => item.id + ':' + item.quantity).join('|');
  useEffect(() => { setShipping({ recipientName: user?.name ?? '', phone: user?.phone ?? '', province: '', district: '', addressLine: '', deliveryNote: '' }); }, [user?.id]);
  useEffect(() => { setQuote(null); setReceipt(null); requestStarted.current = false; idempotencyKey.current = ''; setError(''); }, [basketSignature, user?.id]);
  useEffect(() => {
    if (!isCheckoutOpen) return;
    setShipping(current => ({ ...current, recipientName: current.recipientName || user?.name || '', phone: current.phone || user?.phone || '' }));
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector<HTMLElement>('button, input')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !lock.current) setIsCheckoutOpen(false);
      if (event.key === 'Tab') {
        const nodes = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]') ?? []);
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [isCheckoutOpen, user?.id, setIsCheckoutOpen]);
  if (!isCheckoutOpen || !user) return null;
  const close = () => { if (!lock.current) setIsCheckoutOpen(false); };
  async function getQuote(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current || !checkoutItems.length) return;
    lock.current = true; setBusy(true); setError('');
    try {
      const result = parseQuote(await apiRequest('/checkout/quote', { method: 'POST', body: {
        ...shipping, items: checkoutItems.map(item => ({ productId: item.id, quantity: item.quantity })),
      } }));
      setQuote(result); setPaymentMethod(result.paymentMethods[0].id);
      idempotencyKey.current = crypto.randomUUID(); requestStarted.current = false;
    } catch (error) { setError(errorMessage(error)); }
    finally { lock.current = false; setBusy(false); }
  }
  async function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current || !quote) return;
    // A retry of an uncertain request keeps its original quote and idempotency key.
    if (!requestStarted.current && Date.parse(quote.expiresAt) <= Date.now()) { setQuote(null); setError('Báo giá đã hết hạn. Vui lòng kiểm tra lại đơn hàng.'); return; }
    lock.current = true; setBusy(true); setError(''); requestStarted.current = true;
    try {
      const result = parseReceipt(await apiRequest('/orders', { method: 'POST', idempotencyKey: idempotencyKey.current,
        body: { quoteId: quote.id, preferredPaymentMethod: paymentMethod, fromCart: checkoutFromCart } }));
      setReceipt(result);
      await refreshCart();
    } catch (error) { setError(errorMessage(error) + ' Nếu chưa nhận được kết quả, hãy thử lại tại đây để kiểm tra cùng yêu cầu đặt hàng.'); }
    finally { lock.current = false; setBusy(false); }
  }
  const fieldClass = 'w-full mt-1 px-3 py-2 rounded-lg border border-[var(--cream-shadow)] bg-[var(--cream-deep)]';
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onMouseDown={event => { if (event.target === event.currentTarget) close(); }}>
    <div ref={dialog} role="dialog" aria-modal="true" aria-label="Đặt hàng" data-lenis-prevent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-[var(--cream-base)] text-[var(--espresso-ink)]">
      <header className="flex items-center justify-between mb-5"><h2 className="font-serif text-3xl">{receipt ? 'Đơn hàng đã được tiếp nhận' : quote ? 'Xác nhận đơn hàng' : 'Thông tin nhận hàng'}</h2><button type="button" disabled={busy} aria-label="Đóng" onClick={close}><X /></button></header>
      {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
      {receipt ? <div className="space-y-4">
        <CheckCircle2 className="text-green-700" size={36} />
        <p>Mã đơn: <strong>{receipt.orderCode}</strong></p><p>Tổng tiền: {money(receipt.total)}</p>
        <p>Đơn hàng: {receipt.status}</p><p>Thanh toán: {receipt.paymentStatus}</p>
        <Link className="underline" href={'/thank-you?orderId=' + encodeURIComponent(receipt.id)} onClick={close}>Xem trạng thái đơn hàng</Link>
      </div> : quote ? <form onSubmit={placeOrder} className="space-y-4">
        <ul className="divide-y divide-[var(--cream-shadow)]">{quote.items.map(item => <li key={item.id} className="flex justify-between py-3"><span>{item.title} × {item.quantity}</span><span>{money(item.price * item.quantity)}</span></li>)}</ul>
        <p className="text-xl">Tổng thanh toán: <strong>{money(quote.total)}</strong></p>
        <p className="text-sm">Giao đến: {shipping.recipientName}, {shipping.addressLine}, {shipping.district}, {shipping.province}</p>
        <label className="block">Phương thức thanh toán<select className={fieldClass} value={paymentMethod} disabled={busy || requestStarted.current} onChange={event => setPaymentMethod(event.target.value)}>{quote.paymentMethods.map(method => <option key={method.id} value={method.id}>{method.label}</option>)}</select></label>
        <div className="flex gap-3"><button className="px-4 py-3 border rounded-lg" type="button" disabled={busy || requestStarted.current} onClick={() => setQuote(null)}>Sửa thông tin</button><button className="px-5 py-3 rounded-lg bg-[var(--espresso-ink)] text-[var(--cream-base)] disabled:opacity-50" disabled={busy} type="submit">{busy ? 'Đang xử lý…' : requestStarted.current ? 'Kiểm tra lại yêu cầu' : 'Xác nhận đặt hàng'}</button></div>
      </form> : <form onSubmit={getQuote}><fieldset disabled={busy} className="space-y-4">
        <p>{checkoutItems.length} sản phẩm được chọn. Giá, phí giao hàng và phương thức thanh toán sẽ được kiểm tra trước khi xác nhận.</p>
        <div className="grid sm:grid-cols-2 gap-4">{([
          ['recipientName', 'Họ tên người nhận', 'name'], ['phone', 'Số điện thoại', 'tel'], ['province', 'Tỉnh / thành phố', 'address-level1'], ['district', 'Phường / xã', 'address-level2'], ['addressLine', 'Địa chỉ nhận hàng', 'street-address'],
        ] as const).map(([key, label, autocomplete]) => <label key={key}>{label}<input className={fieldClass} autoComplete={autocomplete} type={key === 'phone' ? 'tel' : 'text'} required maxLength={key === 'phone' ? 20 : 300} value={shipping[key]} onChange={event => setShipping(current => ({ ...current, [key]: event.target.value }))} /></label>)}</div>
        <label className="block">Ghi chú<textarea className={fieldClass} rows={3} maxLength={2000} value={shipping.deliveryNote} onChange={event => setShipping(current => ({ ...current, deliveryNote: event.target.value }))} /></label>
        <button className="px-5 py-3 rounded-lg bg-[var(--espresso-ink)] text-[var(--cream-base)] disabled:opacity-50" type="submit" disabled={!checkoutItems.length}>{busy ? 'Đang kiểm tra…' : 'Kiểm tra đơn hàng'}</button>
      </fieldset></form>}
    </div>
  </div>;
}
