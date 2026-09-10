import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/backend-server";
import AdminApp from "@/components/admin/AdminApp";
const sections = [
  "dashboard",
  "login",
  "products",
  "categories",
  "brands",
  "inventory",
  "orders",
  "customers",
  "articles",
  "contacts",
  "payments",
];
export default async function AdminPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  if (section && (section.length !== 1 || !sections.includes(section[0])))
    notFound();
  const selected = section?.[0] || "dashboard";
  const { session, unavailable } = await getServerSession();
  if (selected !== "login") {
    if (unavailable) return <main className="admin-root adm-loading"><div role="alert"><h1>Chưa thể xác minh phiên đăng nhập</h1><p>Dịch vụ tạm thời không khả dụng. Vui lòng thử lại.</p><Link href="/admin">Thử lại</Link></div></main>;
    if (!session) redirect('/admin/login');
    if (!session.isAdmin) return <main className="admin-root adm-loading"><div><h1>Không có quyền truy cập</h1><Link href="/">Trở về cửa hàng</Link></div></main>;
  } else if (session?.isAdmin) redirect('/admin');
  return <AdminApp key={selected} section={selected} initialUser={session?.user ?? null} />;
}
