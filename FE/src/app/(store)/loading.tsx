export default function StoreLoading() {
  return (
    <main className="min-h-screen bg-[var(--cream-base)] px-6 pt-32" aria-busy="true">
      <p role="status" className="text-center text-[var(--espresso-light)]">
        Đang tải trang…
      </p>
    </main>
  );
}
