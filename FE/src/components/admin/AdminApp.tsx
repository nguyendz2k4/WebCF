"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Layers3,
  Warehouse,
  ShoppingBag,
  Users,
  FileText,
  MessagesSquare,
  CreditCard,
  ArrowUpRight,
  ArrowRight,
  Search,
  Plus,
  Download,
  Pencil,
  Trash2,
  X,
  Menu,
  LogOut,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Check,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { configs, Dataset, money, Row, createEmptyData, parseDataset } from "./model";
import { apiRequest, ApiError, errorMessage } from "@/lib/api-client";
import { parseSession } from "@/lib/contracts";
import { csvCell, isSafeImageUrl } from "@/lib/security";
import type { User } from "@/types";
const nav = [
  ["dashboard", "Tổng quan", LayoutDashboard],
  ["products", "Sản phẩm", Package],
  ["categories", "Danh mục", Layers3],
  ["brands", "Thương hiệu", Layers3],
  ["inventory", "Tồn kho", Warehouse],
  ["orders", "Đơn hàng", ShoppingBag],
  ["customers", "Khách hàng", Users],
  ["articles", "Bài viết", FileText],
  ["contacts", "Liên hệ & tư vấn", MessagesSquare],
  ["payments", "Thanh toán", CreditCard],
] as const;
const descriptions = [
  "Tổng quan hoạt động kinh doanh của Aura, ngay trong tầm tay.",
];
function Badge({ value }: { value: string | number }) {
  const s = String(value);
  return (
    <span
      className={`adm-badge ${["Hoàn tất", "Đã thanh toán", "Thành công", "Đang bán", "Đã xuất bản", "Đã giải quyết"].includes(s) ? "green" : ["Đã hủy", "Thất bại", "Hết hàng"].includes(s) ? "red" : ["Chờ xác nhận", "Chờ xử lý", "Mới", "Sắp hết hàng", "Chưa thanh toán"].includes(s) ? "amber" : ""}`}
    >
      <i />
      {s}
    </span>
  );
}
function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const node = ref.current;
    const get = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>(
          "button, input, select, textarea, a[href]",
        ) || [],
      );
    get()[0]?.focus();
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const all = get();
        const first = all[0],
          last = all[all.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.removeEventListener("keydown", listener);
      previous?.focus();
    };
  }, [close]);
  return (
    <div
      className="adm-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="adm-modal"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header>
          <div>
            <span className="adm-eyebrow">AURA WORKSPACE</span>
            <h2>{title}</h2>
          </div>
          <button className="adm-icon" aria-label="Đóng" onClick={close}>
            <X size={20} />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
export default function AdminApp({ section, initialUser }: { section: string; initialUser: User | null }) {
  const router = useRouter();
  const [data, setData] = useState<Dataset>(createEmptyData);
  const [ready, setReady] = useState(section === "login");
  const [authenticated, setAuthenticated] = useState(!!initialUser);
  const [mobile, setMobile] = useState(false);
  const [notice, setNotice] = useState("");
  const [loadError, setLoadError] = useState("");
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const mutationLock = useRef(false);
  useEffect(() => {
    const expired = () => { setAuthenticated(false); setData(createEmptyData()); router.replace("/admin/login"); router.refresh(); };
    let active = true;
    const verify = () => {
      if (section === 'login' || document.visibilityState !== 'visible') return;
      apiRequest('/auth/me').then(value => {
        if (!active) return;
        if (!parseSession(value).isAdmin) expired();
      }).catch(error => {
        if (!active) return;
        if (error instanceof ApiError && [401, 403].includes(error.status)) expired();
        else setLoadError(errorMessage(error));
      });
    };
    window.addEventListener('aura:session-expired', expired);
    document.addEventListener('visibilitychange', verify);
    return () => { active = false; window.removeEventListener('aura:session-expired', expired); document.removeEventListener('visibilitychange', verify); };
  }, [router, section]);
  useEffect(() => {
    if (section === "login" || !authenticated) return;
    const controller = new AbortController();
    setReady(false);
    setLoadError("");
    apiRequest('/admin/workspace', { signal: controller.signal })
      .then(value => { if (!controller.signal.aborted) setData(parseDataset(value)); })
      .catch(error => {
        if (!controller.signal.aborted) { setData(createEmptyData()); setLoadError(errorMessage(error)); }
      }).finally(() => { if (!controller.signal.aborted) setReady(true); });
    return () => controller.abort();
  }, [section, authenticated, revision]);
  useEffect(() => {
    if (notice) { const timer = setTimeout(() => setNotice(""), 5500); return () => clearTimeout(timer); }
  }, [notice]);
  async function commit(resource: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', row: Row) {
    if (mutationLock.current) return false;
    mutationLock.current = true;
    setBusy(true);
    try {
      const path = '/admin/' + resource + (method === 'POST' ? '' : '/' + encodeURIComponent(row.id));
      const { id, ...values } = row;
      await apiRequest(path, { method, body: method === 'DELETE' ? { version: values.version } : values, ...(method === 'POST' ? { idempotencyKey: row.id } : {}) });
      setNotice("Đã lưu thay đổi.");
      setRevision(value => value + 1);
      return true;
    } catch (error) { setNotice(errorMessage(error)); return false; }
    finally { mutationLock.current = false; setBusy(false); }
  }
  async function enter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutationLock.current) return;
    mutationLock.current = true;
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true); setNotice("");
    try {
      await apiRequest('/auth/login', { method: 'POST', body: { email: values.get('email'), password: values.get('password') } });
      const session = parseSession(await apiRequest('/auth/me'));
      if (!session.isAdmin) throw new ApiError(403);
      form.reset();
      router.replace('/admin'); router.refresh();
    } catch (error) { setNotice(errorMessage(error)); }
    finally { mutationLock.current = false; setBusy(false); }
  }
  async function logout() {
    if (mutationLock.current) return;
    mutationLock.current = true; setBusy(true);
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
      setAuthenticated(false); setData(createEmptyData());
      router.replace('/admin/login'); router.refresh();
    } catch (error) { setNotice(errorMessage(error)); }
    finally { mutationLock.current = false; setBusy(false); }
  }
  if (section !== 'login' && !authenticated) return <div className="admin-root adm-loading">Đang kiểm tra phiên đăng nhập…</div>;
  if (section === "login")
    return (
      <div className="admin-root adm-login">
        <section className="adm-login-story">
          <Link href="/" className="adm-brand">
            aura<span>COFFEE SOLUTIONS</span>
          </Link>
          <div>
            <span className="adm-eyebrow">AURA WORKSPACE / 01</span>
            <h1>
              Mỗi ngày vận hành.
              <br />
              Một bước tiến mới.
            </h1>
            <p>
              Không gian quản trị dành cho những người đứng sau mỗi trải nghiệm
              cà phê.
            </p>
            <div className="adm-login-art">
              <Coffee size={110} strokeWidth={0.8} />
              <span>CRAFTED FOR BETTER DAYS</span>
            </div>
          </div>
          <small>© 2026 Aura Coffee Solutions</small>
        </section>
        <section className="adm-login-form">
          <div className="adm-login-box">
            <span className="adm-login-mark">
              <ShieldCheck size={26} />
            </span>
            <span className="adm-eyebrow">CHÀO MỪNG TRỞ LẠI</span>
            <h2>Đăng nhập quản trị</h2>
            <p>Truy cập không gian điều hành của bạn.</p>
            <form onSubmit={enter}>
              <label>
                Email quản trị
                <input
                  type="email"
                  name="email"
                  maxLength={254}
                  placeholder="Nhập email quản trị"
                  required
                  autoComplete="username"
                />
              </label>
              <label>
                Mật khẩu
                <input
                  type="password"
                  name="password"
                  maxLength={128}
                  placeholder="Nhập mật khẩu"
                  required
                  autoComplete="current-password"
                  minLength={1}
                />
              </label>
              <button className="adm-primary" type="submit" disabled={busy}>
                {busy ? "Đang đăng nhập…" : "Đăng nhập"} <ArrowRight size={16} />
              </button>
            </form>
            <Link href="/" className="adm-back">
              ← Trở về cửa hàng
            </Link>
            {notice && <p role="status">{notice}</p>}
          </div>
        </section>
      </div>
    );
  const title = section === "dashboard" ? "Tổng quan" : configs[section]?.title;
  return (
    <div className="admin-root">
      <aside className={`adm-sidebar ${mobile ? "is-open" : ""}`}>
        <div className="adm-sidebar-top">
          <Link href="/admin" className="adm-brand">
            aura<span>ADMIN WORKSPACE</span>
          </Link>
          <button
            className="adm-icon adm-mobile"
            aria-label="Đóng menu"
            onClick={() => setMobile(false)}
          >
            <X />
          </button>
        </div>
        <div className="adm-workspace">
          <div className="adm-workspace-icon">
            <Coffee size={21} />
          </div>
          <div>
            <strong>Aura Coffee</strong>
            <small>Không gian quản trị</small>
          </div>
          <span className="adm-live" />
        </div>
        <span className="adm-nav-label">KHÔNG GIAN LÀM VIỆC</span>
        <nav>
          {nav.map(([key, label, Icon], i) => (
            <Link
              key={key}
              href={key === "dashboard" ? "/admin" : `/admin/${key}`}
              onClick={() => setMobile(false)}
              className={`${section === key ? "active" : ""} ${i === 6 ? "adm-nav-break" : ""}`}
            >
              <Icon size={19} />
              <span>{label}</span>
              {key === "contacts" && (
                <em>
                  {data.contacts.filter((r) => r.status === "Mới").length}
                </em>
              )}
            </Link>
          ))}
        </nav>
        <div className="adm-sidebar-bottom">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            Xem cửa hàng <ExternalLink size={15} />
          </Link>
          <button onClick={logout} disabled={busy}><LogOut size={17} />Đăng xuất</button>
        </div>
      </aside>
      {mobile && (
        <button
          className="adm-scrim"
          aria-label="Đóng menu"
          onClick={() => setMobile(false)}
        />
      )}
      <div className="adm-main">
        <header className="adm-topbar">
          <div>
            <button
              className="adm-icon adm-mobile"
              onClick={() => setMobile(true)}
              aria-label="Mở menu"
            >
              <Menu />
            </button>
            <span>Workspace</span>
            <span className="adm-slash">/</span>
            <strong>{title}</strong>
          </div>
          <div>
            <span className="adm-environment">Quản trị cửa hàng</span>
            <span className="adm-top-divider" />
            <span className="adm-avatar">AD</span>
            <span className="adm-user">
              {initialUser?.name}<small>Quản trị viên</small>
            </span>
          </div>
        </header>
        <main className="adm-content">
          <div className="adm-page-heading">
            <div>
              <span className="adm-eyebrow">
                {section === "dashboard"
                  ? "HIỆU SUẤT KINH DOANH"
                  : "QUẢN LÝ CỬA HÀNG"}
              </span>
              <h1>
                {title}
                <span>.</span>
              </h1>
              <p>
                {section === "dashboard"
                  ? descriptions[0]
                  : configs[section]?.description}
              </p>
            </div>
          </div>
          {!ready ? <div className="adm-empty" role="status">Đang tải dữ liệu…</div> : loadError ? (
            <div className="adm-empty" role="alert"><p>{loadError}</p><button className="adm-secondary" onClick={() => setRevision(value => value + 1)}>Thử lại</button></div>
          ) : section === "dashboard" ? (
            <Dashboard data={data} />
          ) : (
            <Manager
              key={section}
              section={section}
              data={data}
              commit={commit}
              notify={setNotice}
              busy={busy}
            />
          )}
          <footer className="adm-footer">
            <span>Aura Workspace © 2026</span>
            <span>Được tạo cho một ngày vận hành hiệu quả.</span>
          </footer>
        </main>
      </div>
      {notice && (
        <div className="adm-toast" role="status">
          <Check size={18} />
          {notice}
          <button aria-label="Đóng thông báo" onClick={() => setNotice("")}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
function Dashboard({ data }: { data: Dataset }) {
  const [period, setPeriod] = useState("month");
  const [anchor, setAnchor] = useState(() => {
    const today = new Date();
    return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
  });
  const end = new Date(anchor + "T23:59:59");
  const start = new Date(end);
  if (period === "week") start.setDate(end.getDate() - 6);
  if (period === "month") start.setDate(1);
  if (period === "year") {
    start.setMonth(0, 1);
  }
  start.setHours(0, 0, 0, 0);
  const inRange = (r: Row) =>
    new Date(String(r.date) + "T12:00:00") >= start &&
    new Date(String(r.date) + "T12:00:00") <= end;
  const orders = data.orders.filter(inRange);
  const paid = orders.filter(
    (o) => o.payment === "Đã thanh toán" && o.status !== "Đã hủy",
  );
  const revenue = paid.reduce((s, r) => s + Number(r.total), 0);
  const low = data.products
    .filter((p) => Number(p.stock) < 10)
    .sort((a, b) => Number(a.stock) - Number(b.stock));
  const count = period === "year" ? 12 : period === "week" ? 7 : end.getDate();
  const buckets = Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    if (period === "year") d.setMonth(i);
    else d.setDate(start.getDate() + i);
    return {
      label:
        period === "year" ? `T${i + 1}` : `${d.getDate()}/${d.getMonth() + 1}`,
      value: paid
        .filter((o) => {
          const od = new Date(String(o.date) + "T12:00:00");
          return period === "year"
            ? od.getMonth() === i
            : od.toDateString() === d.toDateString();
        })
        .reduce((s, o) => s + Number(o.total), 0),
    };
  });
  const max = Math.max(1, ...buckets.map((b) => b.value));
  return (
    <>
      <div className="adm-dashboard-tools">
        <div className="adm-tabs">
          {[
            ["week", "Tuần"],
            ["month", "Tháng"],
            ["year", "Năm"],
          ].map(([key, label]) => (
            <button
              className={period === key ? "selected" : ""}
              key={key}
              onClick={() => setPeriod(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="adm-date-input">
          Đến ngày{" "}
          <input
            aria-label="Ngày kết thúc thống kê"
            type="date"
            value={anchor}
            onChange={(e) => {
              if (e.target.value) setAnchor(e.target.value);
            }}
          />
        </label>
      </div>
      <div className="adm-stats">
        {[
          {
            label: "Doanh thu đã thanh toán",
            value: money(revenue),
            note: "Không gồm đơn đã hủy",
            icon: CreditCard,
          },
          {
            label: "Đơn hàng trong kỳ",
            value: orders.length,
            note: `${orders.filter((o) => o.status === "Chờ xác nhận").length} đơn chờ xác nhận`,
            icon: ShoppingBag,
          },
          {
            label: "Giá trị đơn trung bình",
            value: money(paid.length ? revenue / paid.length : 0),
            note: "Trên các đơn đã thanh toán",
            icon: ArrowUpRight,
          },
          {
            label: "Sản phẩm sắp hết",
            value: low.length,
            note: "Tồn kho hiện tại dưới 10",
            icon: Package,
          },
        ].map((s, i) => (
          <article
            className={`adm-stat ${i === 0 ? "featured" : ""}`}
            key={s.label}
          >
            <div>
              <span>{s.label}</span>
              <s.icon size={19} />
            </div>
            <strong>{s.value}</strong>
            <small>
              {i === 3 ? (
                <AlertTriangle size={13} />
              ) : (
                <span className="adm-stat-dot" />
              )}
              {s.note}
            </small>
          </article>
        ))}
      </div>
      <div className="adm-chart-grid">
        <section className="adm-panel">
          <div className="adm-panel-heading">
            <div>
              <h2>Nhịp tăng trưởng doanh thu</h2>
              <p>
                {start.toLocaleDateString("vi-VN")} —{" "}
                {end.toLocaleDateString("vi-VN")}
              </p>
            </div>
            <span className="adm-legend">
              <i />
              Doanh thu
            </span>
          </div>
          <div className="adm-chart-total">
            {money(revenue)}
            <span> trong kỳ đã chọn</span>
          </div>
          <div
            className="adm-chart"
            role="img"
            aria-label={`Biểu đồ doanh thu ${period === "year" ? "theo tháng" : "theo ngày"}, tổng ${money(revenue)}`}
          >
            <div className="adm-yaxis">
              {[1, 0.75, 0.5, 0.25, 0].map((v) => (
                <span key={v}>
                  {((max * v) / 1000000).toLocaleString("vi-VN", {
                    maximumFractionDigits: 1,
                  })}{" "}
                  tr
                </span>
              ))}
            </div>
            <div className="adm-bars">
              {buckets.map((b, i) => (
                <div className="adm-bar-column" key={i}>
                  <div className="adm-bar-track">
                    <div
                      className="adm-bar"
                      style={{
                        height: `${(b.value / max) * 100}%`,
                        minHeight: b.value ? 4 : 0,
                      }}
                      tabIndex={0}
                      aria-label={`${b.label}: ${money(b.value)}`}
                    >
                      <span className="adm-chart-tooltip">
                        {b.label}
                        <strong>{money(b.value)}</strong>
                      </span>
                    </div>
                  </div>
                  <small>{count > 15 && i % 5 !== 0 ? "" : b.label}</small>
                </div>
              ))}
            </div>
          </div>
          {!paid.length && (
            <p className="adm-chart-empty">Chưa có doanh thu trong kỳ này.</p>
          )}
          <details className="adm-chart-details">
            <summary>Xem số liệu biểu đồ</summary>
            <div>
              {buckets.map((b) => (
                <p key={b.label}>
                  {b.label}
                  <strong>{money(b.value)}</strong>
                </p>
              ))}
            </div>
          </details>
        </section>
        <section className="adm-panel">
          <div className="adm-panel-heading">
            <div>
              <h2>Trạng thái đơn hàng</h2>
              <p>Phân bổ trong kỳ đã chọn</p>
            </div>
            <ShoppingBag size={19} />
          </div>
          <div
            className="adm-donut"
            style={{
              background: orders.length
                ? `conic-gradient(#285b4c 0 ${(orders.filter((o) => o.status === "Hoàn tất").length / orders.length) * 100}%, #d8b77d 0 ${(orders.filter((o) => ["Hoàn tất", "Đang giao"].includes(String(o.status))).length / orders.length) * 100}%, #e6eae6 0 100%)`
                : "#e6eae6",
            }}
          >
            <div>
              <strong>{orders.length}</strong>
              <span>đơn hàng</span>
            </div>
          </div>
          <div className="adm-order-legend">
            {["Hoàn tất", "Đang giao", "Khác"].map((status, i) => (
              <div key={status}>
                <span>
                  <i
                    style={{ background: ["#285b4c", "#d8b77d", "#e6eae6"][i] }}
                  />
                  {status}
                </span>
                <strong>
                  {
                    orders.filter((o) =>
                      status === "Khác"
                        ? !["Hoàn tất", "Đang giao"].includes(String(o.status))
                        : o.status === status,
                    ).length
                  }
                </strong>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="adm-bottom-grid">
        <section className="adm-panel">
          <div className="adm-panel-heading">
            <div>
              <h2>Đơn hàng gần đây</h2>
              <p>Các đơn mới nhất trong kỳ</p>
            </div>
            <Link href="/admin/orders">
              Xem tất cả <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="adm-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Đơn hàng / Khách hàng</th>
                  <th>Giá trị</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {[...orders]
                  .sort((a, b) => String(b.date).localeCompare(String(a.date)))
                  .slice(0, 5)
                  .map((o) => (
                    <tr key={o.id}>
                      <td>
                        <strong>{o.name}</strong>
                        <small>{o.customer}</small>
                      </td>
                      <td>{money(Number(o.total))}</td>
                      <td>
                        <Badge value={o.status} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!orders.length && (
              <div className="adm-empty">Không có đơn hàng trong kỳ này.</div>
            )}
          </div>
        </section>
        <section className="adm-panel">
          <div className="adm-panel-heading">
            <div>
              <h2>Cần chú ý</h2>
              <p>Chủ động bổ sung hàng hóa</p>
            </div>
            <span className="adm-count">{low.length}</span>
          </div>
          <div className="adm-alert-items">
            {low.slice(0, 4).map((p) => (
              <div key={p.id}>
                <span className="adm-product-symbol">
                  <Package size={19} />
                </span>
                <div>
                  <strong>{p.name}</strong>
                  <small>{p.sku}</small>
                </div>
                <b className={Number(p.stock) === 0 ? "adm-red" : ""}>
                  {p.stock}
                  <small>còn lại</small>
                </b>
              </div>
            ))}
            {!low.length && (
              <p>{data.products.length ? "Tất cả sản phẩm đang có lượng tồn ổn định." : "Chưa có dữ liệu sản phẩm để kiểm tra tồn kho."}</p>
            )}
          </div>
          <Link className="adm-panel-link" href="/admin/inventory">
            Kiểm tra tồn kho <ArrowRight size={16} />
          </Link>
        </section>
      </div>
      <div className="adm-info-line">
        <ShieldCheck size={16} />
        Thống kê từ dữ liệu hệ thống trong khoảng thời gian đã chọn.
      </div>
    </>
  );
}
function Manager({
  section,
  data,
  commit,
  notify,
  busy,
}: {
  section: string;
  data: Dataset;
  commit: (resource: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', row: Row) => Promise<boolean>;
  busy: boolean;
  notify: (s: string) => void;
}) {
  const inventory = section === "inventory";
  const key = inventory ? "products" : section;
  const config = configs[section];
  const rows = data[key] || [];
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [view, setView] = useState<Row | null>(null);
  const [error, setError] = useState("");
  const filterKey = inventory
    ? "stock"
    : section === "products"
      ? "categoryId"
      : config.fields.some((f) => f.key === "status")
        ? "status"
        : "";
  const filtered = rows.filter(
    (r) =>
      (!query ||
        Object.values(r).some((v) =>
          String(v)
            .toLocaleLowerCase("vi")
            .includes(query.toLocaleLowerCase("vi")),
        )) &&
      (filter === "all" ||
        (inventory
          ? filter === "out"
            ? Number(r.stock) === 0
            : Number(r.stock) > 0 && Number(r.stock) < 10
          : String(r[filterKey]) === filter)),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const current = Math.min(page, pages);
  const fields = inventory
    ? config.fields
    : config.fields.map((f) =>
        section === "products" && ["categoryId", "brandId"].includes(f.key)
          ? { ...f, options: data[f.key === "categoryId" ? "categories" : "brands"].map((row) => row.id) }
          : f,
      );
  const visibleColumns: Record<string, string[]> = {
    products: ["name", "sku", "categoryId", "price", "stock", "status"],
    categories: ["name", "code", "domain", "status"],
    brands: ["name", "code", "status"],
    inventory: ["name", "sku", "categoryId", "stock"],
    orders: ["name", "customer", "total", "date", "status", "payment"],
    customers: ["name", "email", "phone", "status"],
    articles: ["name", "category", "author", "status"],
    contacts: ["name", "phone", "subject", "status"],
    payments: ["name", "order", "customer", "total", "method", "date", "status"],
  };
  const columns = visibleColumns[section].map((key) => fields.find((f) => f.key === key)!);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editor || busy) return;
    const values = new FormData(e.currentTarget);
    const updated = { ...editor };
    for (const f of fields) {
      if ((inventory && f.key !== "stock") || (section === "orders" && !["status", "description"].includes(f.key))) continue;
      const v = String(values.get(f.key) || "").trim();
      if (!v && !f.optional) {
        setError(`Vui lòng nhập ${f.label.toLowerCase()}.`);
        return;
      }
      if (
        f.type === "number" &&
        (!Number.isSafeInteger(Number(v)) || Number(v) < 0)
      ) {
        setError(`${f.label} phải là số nguyên không âm hợp lệ.`);
        return;
      }
      if (["slug", "code"].includes(f.key) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) { setError(f.label + " chỉ gồm chữ thường, số và dấu gạch ngang."); return; }
      if (v.length > (f.type === 'textarea' ? 20000 : 2000)) { setError(f.label + " quá dài."); return; }
      if (f.type === 'url' && v && !isSafeImageUrl(v)) { setError("URL ảnh phải thuộc nguồn ảnh được cho phép."); return; }
      if (f.type === 'select' && !f.options?.includes(v)) { setError(f.label + " không hợp lệ."); return; }
      updated[f.key] = f.type === "number" ? Number(v) : v;
    }
    if (section === 'products' && data.categories.find(row => row.id === updated.categoryId)?.domain !== updated.domain) { setError('Danh mục không thuộc nhóm sản phẩm đã chọn.'); return; }
    const unique =
      section === "products"
        ? "sku"
        : ["orders", "categories", "payments"].includes(section)
          ? "name"
          : null;
    if (
      unique &&
      rows.some(
        (r) =>
          r.id !== updated.id &&
          String(r[unique]).toLowerCase() ===
            String(updated[unique]).toLowerCase(),
      )
    ) {
      setError("Mã hoặc tên này đã tồn tại. Vui lòng sử dụng giá trị khác.");
      return;
    }
    const exists = rows.some(row => row.id === updated.id);
    const payload = section === "orders" ? { id: updated.id, status: updated.status, description: updated.description, ...(updated.version ? { version: updated.version } : {}) } : inventory ? { id: updated.id, stock: updated.stock, ...(updated.version ? { version: updated.version } : {}) } : updated;
    if (await commit(inventory ? 'inventory' : key, inventory || section === 'orders' ? 'PATCH' : exists ? 'PUT' : 'POST', payload)) setEditor(null);
  }
  async function remove() {
    if (!deleting || busy) return;
    if (await commit(key, 'DELETE', deleting)) setDeleting(null);
  }
  function csv() {
    const escape = csvCell;
    const content =
      "\uFEFF" +
      [
        fields.map((f) => escape(f.label)).join(","),
        ...filtered.map((r) => fields.map((f) => escape(r[f.key])).join(",")),
      ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `aura-${section}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify(`Đã xuất ${filtered.length} bản ghi theo bộ lọc hiện tại.`);
  }
  return (
    <>
      {section === "payments" && (
        <div className="adm-info-line">
          <ShieldCheck size={16} />
          Trạng thái thanh toán phải được xác nhận bởi hệ thống xử lý giao dịch.
        </div>
      )}
      {inventory && (
        <div className="adm-inventory-summary">
          {[
            ["Tổng sản phẩm", rows.length],
            ["Tổng đơn vị tồn", rows.reduce((s, r) => s + Number(r.stock), 0)],
            [
              "Sắp hết (1–9)",
              rows.filter((r) => Number(r.stock) > 0 && Number(r.stock) < 10)
                .length,
            ],
            ["Hết hàng", rows.filter((r) => Number(r.stock) === 0).length],
          ].map(([label, value]) => (
            <div className="adm-panel" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      )}
      <section className="adm-panel adm-manager">
        <div className="adm-manager-heading">
          <div>
            <h2>
              Danh sách {config.singular}{" "}
              <span className="adm-count">{rows.length}</span>
            </h2>
            <p>
              {inventory
                ? "Cập nhật số lượng tồn trực tiếp cho từng sản phẩm."
                : "Xem, tìm kiếm và cập nhật dữ liệu của bạn."}
            </p>
          </div>
          <div className="adm-actions">
            <button className="adm-secondary" onClick={csv}>
              <Download size={16} />
              Xuất CSV
            </button>
            {!inventory && !["orders", "payments"].includes(section) && (
              <button
                className="adm-primary"
                onClick={() => {
                  setError("");
                  setEditor({
                    id: crypto.randomUUID(),
                    ...Object.fromEntries(
                      fields.map((f) => [
                        f.key,
                        f.type === "select"
                          ? f.options?.[0] || ""
                          : f.type === "number"
                            ? 0
                            : "",
                      ]),
                    ),
                  });
                }}
              >
                <Plus size={17} />
                Thêm {config.singular}
              </button>
            )}
          </div>
        </div>
        <div className="adm-filters">
          <div className="adm-search">
            <Search size={18} />
            <input
              placeholder={`Tìm kiếm ${config.singular}…`}
              aria-label={`Tìm kiếm ${config.singular}`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
            {query && (
              <button aria-label="Xóa tìm kiếm" onClick={() => setQuery("")}>
                <X size={15} />
              </button>
            )}
          </div>
          {filterKey && (
            <select
              aria-label="Lọc danh sách"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">
                {inventory
                  ? "Tất cả mức tồn"
                  : filterKey === "categoryId"
                    ? "Tất cả danh mục"
                    : "Tất cả trạng thái"}
              </option>
              {inventory ? (
                <>
                  <option value="low">Sắp hết hàng (1–9)</option>
                  <option value="out">Hết hàng</option>
                </>
              ) : (
                Array.from(new Set(rows.map((r) => String(r[filterKey])))).map(
                  (s) => <option key={s} value={s}>{filterKey === "categoryId" ? data.categories.find(row => row.id === s)?.name ?? s : s}</option>,
                )
              )}
            </select>
          )}
          <span className="adm-result-count">{filtered.length} kết quả</span>
        </div>
        <div className="adm-table-scroll">
          <table>
            <thead>
              <tr>
                {columns.map((f) => (
                  <th key={f.key}>{f.label}</th>
                ))}
                {inventory && <th>Tình trạng</th>}
                <th className="adm-align-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice((current - 1) * 8, current * 8).map((r) => (
                <tr key={r.id}>
                  {columns.map((f, i) => (
                    <td key={f.key}>
                      {f.key === "status" || f.key === "payment" ? (
                        <Badge value={r[f.key]} />
                      ) : ["categoryId", "brandId"].includes(f.key) ? (
                        String(data[f.key === "categoryId" ? "categories" : "brands"].find(row => row.id === r[f.key])?.name ?? "—")
                      ) : ["price", "total"].includes(f.key) ? (
                        <span className="adm-numeric">
                          {money(Number(r[f.key]))}
                        </span>
                      ) : i === 0 ? (
                        <div className="adm-name-cell">
                          {section === "products" && (
                            <span className="adm-product-symbol">
                              <Coffee size={20} />
                            </span>
                          )}
                          <strong>{r[f.key]}</strong>
                        </div>
                      ) : f.key === "date" ? (
                        new Date(
                          String(r[f.key]) + "T12:00:00",
                        ).toLocaleDateString("vi-VN")
                      ) : (
                        String(r[f.key] ?? "—")
                      )}
                    </td>
                  ))}
                  {inventory && (
                    <td>
                      <Badge
                        value={
                          Number(r.stock) === 0
                            ? "Hết hàng"
                            : Number(r.stock) < 10
                              ? "Sắp hết hàng"
                              : "Đủ hàng"
                        }
                      />
                    </td>
                  )}
                  <td>
                    <div className="adm-row-actions">
                      <button
                        className="adm-icon"
                        aria-label={`Xem ${r.name}`}
                        onClick={() => setView(r)}
                      >
                        <Eye size={16} />
                      </button>
                      {section !== "payments" && <button
                        className="adm-icon"
                        disabled={busy}
                        aria-label={`Sửa ${r.name}`}
                        onClick={() => {
                          setError("");
                          setEditor(r);
                        }}
                      >
                        <Pencil size={16} />
                      </button>}
                      {!inventory && !["orders", "payments"].includes(section) && (
                        <button
                          className="adm-icon adm-danger"
                          aria-label={`Xóa ${r.name}`}
                          onClick={() => setDeleting(r)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="adm-empty">
              <Search size={28} />
              <h3>Chưa tìm thấy {config.singular}</h3>
              <p>Thử thay đổi từ khóa, bộ lọc hoặc thêm bản ghi mới.</p>
              <button
                className="adm-secondary"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
        <div className="adm-pagination">
          <span>
            {filtered.length
              ? `${(current - 1) * 8 + 1}–${Math.min(current * 8, filtered.length)}`
              : "0"}{" "}
            trên {filtered.length} bản ghi
          </span>
          <div>
            <button
              className="adm-icon"
              aria-label="Trang trước"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
            >
              <ChevronLeft size={17} />
            </button>
            <span>
              Trang {current} / {pages}
            </span>
            <button
              className="adm-icon"
              aria-label="Trang sau"
              disabled={current === pages}
              onClick={() => setPage(current + 1)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>
      {editor && (
        <Modal
          title={`${rows.some((r) => r.id === editor.id) ? "Chỉnh sửa" : "Thêm"} ${config.singular}`}
          close={() => { if (!busy) setEditor(null); }}
        >
          <form onSubmit={save}>
            <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0 }}>
            <div className="adm-form-grid">
              {fields.map((f) => (
                <label
                  key={f.key}
                  className={f.type === "textarea" ? "adm-span-2" : ""}
                >
                  {f.label}
                  {!f.optional && <span className="adm-required"> *</span>}
                  {f.type === "select" ? (
                    <select
                      name={f.key}
                      defaultValue={editor[f.key]}
                      disabled={section === "orders" && !["status", "description"].includes(f.key)}
                      required={!f.optional}
                    >
                      <option value="">Chọn {f.label.toLowerCase()}</option>
                      {f.options?.map((o) => (
                        <option key={o} value={o}>{["categoryId", "brandId"].includes(f.key) ? data[f.key === "categoryId" ? "categories" : "brands"].find(row => row.id === o)?.name ?? o : o}</option>
                      ))}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      name={f.key}
                      defaultValue={editor[f.key]}
                      required={!f.optional}
                      rows={f.key === "content" ? 8 : 3}
                    />
                  ) : (
                    <input
                      name={f.key}
                      type={f.type || "text"}
                      defaultValue={editor[f.key]}
                      required={!f.optional}
                      readOnly={(inventory && f.key !== "stock") || (section === "orders" && !["status", "description"].includes(f.key))}
                      min={f.type === "number" ? 0 : undefined}
                      step={f.type === "number" ? 1 : undefined}
                    />
                  )}
                </label>
              ))}
            </div>
            {error && (
              <p className="adm-form-error" role="alert">
                {error}
              </p>
            )}
            <div className="adm-modal-footer">
              <span>{busy ? "Đang lưu…" : "Lưu vào hệ thống"}</span>
              <button
                type="button"
                className="adm-secondary"
                onClick={() => setEditor(null)}
              >
                Hủy
              </button>
              <button className="adm-primary" type="submit">
                <Check size={16} />
                Lưu thay đổi
              </button>
            </div>
            </fieldset>
          </form>
        </Modal>
      )}
      {deleting && (
        <Modal
          title={`Xóa ${config.singular}?`}
          close={() => { if (!busy) setDeleting(null); }}
        >
          <div className="adm-delete-body">
            <span className="adm-delete-icon">
              <Trash2 size={24} />
            </span>
            <p>
              Bạn muốn xóa <strong>{deleting.name}</strong>?
            </p>
            <p>
              Bản ghi sẽ bị xóa khỏi hệ thống. Thao tác này
              không thể hoàn tác.
            </p>
          </div>
          <div className="adm-modal-footer">
            <button className="adm-secondary" onClick={() => setDeleting(null)}>
              Giữ lại
            </button>
            <button className="adm-primary adm-delete-button" disabled={busy} onClick={remove}>
              Xóa bản ghi
            </button>
          </div>
        </Modal>
      )}
      {view && (
        <Modal
          title={`Chi tiết ${config.singular}`}
          close={() => setView(null)}
        >
          <dl className="adm-detail">
            {fields.map((f) => (
              <div key={f.key}>
                <dt>{f.label}</dt>
                <dd>
                  {["price", "total"].includes(f.key)
                    ? money(Number(view[f.key]))
                    : String(view[f.key] ?? "—")}
                </dd>
              </div>
            ))}
          </dl>
          <div className="adm-modal-footer">
            <button className="adm-secondary" onClick={() => setView(null)}>
              Đóng
            </button>
            {section !== "payments" && <button
              className="adm-primary"
              onClick={() => {
                setError("");
                setEditor(view);
                setView(null);
              }}
            >
              <Pencil size={16} />
              Chỉnh sửa
            </button>}
          </div>
        </Modal>
      )}
    </>
  );
}
