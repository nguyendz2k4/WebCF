'use client';
import Link from 'next/link';
export default function StoreError({ reset }: { reset: () => void }) {
  return <main className="min-h-screen flex items-center justify-center bg-[var(--cream-base)] p-6"><section role="alert" className="max-w-lg text-center space-y-5"><h1 className="font-serif text-3xl">Chưa thể tải dữ liệu</h1><p>Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.</p><button className="border rounded-lg px-5 py-3" onClick={reset}>Thử lại</button><Link className="block underline" href="/">Trở về trang chủ</Link></section></main>;
}
