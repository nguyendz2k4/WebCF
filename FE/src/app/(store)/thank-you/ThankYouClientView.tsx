'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiRequest, errorMessage } from '@/lib/api-client';
import { parseReceipt, type OrderReceipt } from '@/lib/contracts';

export function ThankYouClientView() {
  const params = useSearchParams();
  const id = params.get('orderId');
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    setReceipt(null); setError('');
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) { setError('Không tìm thấy mã đơn hàng hợp lệ.'); return; }
    const controller = new AbortController();
    apiRequest('/orders/' + encodeURIComponent(id), { signal: controller.signal }).then(value => {
      if (!controller.signal.aborted) setReceipt(parseReceipt(value));
    }).catch(error => { if (!controller.signal.aborted) setError(errorMessage(error)); });
    return () => controller.abort();
  }, [id, revision]);
  return <section className="max-w-xl mx-auto py-12 px-5 space-y-5 text-center">
    <h1 className="font-serif text-3xl">Thông tin đơn hàng</h1>
    {error ? <div role="alert"><p>{error}</p><button className="underline mt-3" onClick={() => setRevision(value => value + 1)}>Thử lại</button></div> : receipt ? <div className="space-y-3">
      <p>Mã đơn hàng: <strong>{receipt.orderCode}</strong></p><p>Trạng thái: {receipt.status}</p><p>Thanh toán: {receipt.paymentStatus}</p><p>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(receipt.total)}</p>
    </div> : <p role="status">Đang xác minh đơn hàng…</p>}
    <Link className="inline-block underline" href="/products">Tiếp tục xem sản phẩm</Link>
  </section>;
}
