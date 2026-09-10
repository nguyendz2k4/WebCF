import { isRecord } from '@/lib/contracts';
export type Row = { id: string; [key: string]: string | number };
export type Dataset = Record<string, Row[]>;
export type Field = {
  key: string;
  label: string;
  type?: "number" | "email" | "date" | "textarea" | "select" | "url";
  options?: string[];
  optional?: boolean;
};
export const configs: Record<
  string,
  { title: string; singular: string; description: string; fields: Field[] }
> = {
  products: {
    title: "Sản phẩm",
    singular: "sản phẩm",
    description: "Chăm chút danh mục, từ thiết bị đến từng hạt cà phê.",
    fields: [
      { key: "name", label: "Tên sản phẩm" },
      { key: "slug", label: "Đường dẫn (slug)" },
      { key: "domain", label: "Nhóm sản phẩm", type: "select", options: ["equipment", "ingredients"] },
      { key: "sku", label: "Mã SKU" },
      { key: "categoryId", label: "Danh mục", type: "select" },
      { key: "brandId", label: "Thương hiệu", type: "select" },
      { key: "priceType", label: "Kiểu giá", type: "select", options: ["fixed", "from", "contact"] },
      { key: "price", label: "Giá bán (₫)", type: "number" },
      { key: "stock", label: "Tồn kho", type: "number" },
      {
        key: "status",
        label: "Hiển thị",
        type: "select",
        options: ["Đang bán", "Ẩn"],
      },
      { key: "image", label: "URL hình ảnh", type: "url", optional: true },
      { key: "description", label: "Mô tả", type: "textarea", optional: true },
    ],
  },
  categories: {
    title: "Danh mục",
    singular: "danh mục",
    description: "Sắp xếp sản phẩm để khách hàng dễ dàng tìm thấy.",
    fields: [
      { key: "name", label: "Tên danh mục" },
      { key: "code", label: "Mã danh mục" },
      { key: "domain", label: "Nhóm sản phẩm", type: "select", options: ["equipment", "ingredients"] },
      { key: "displayOrder", label: "Thứ tự hiển thị", type: "number" },
      { key: "status", label: "Hiển thị", type: "select", options: ["Đang hiển thị", "Ẩn"] },
    ],
  },
  brands: {
    title: "Thương hiệu", singular: "thương hiệu", description: "Quản lý thương hiệu của sản phẩm.",
    fields: [
      { key: "name", label: "Tên thương hiệu" },
      { key: "code", label: "Mã thương hiệu" },
      { key: "status", label: "Hiển thị", type: "select", options: ["Đang hiển thị", "Ẩn"] },
    ],
  },
  orders: {
    title: "Đơn hàng",
    singular: "đơn hàng",
    description:
      "Theo dõi hành trình đơn hàng từ tiếp nhận đến giao thành công.",
    fields: [
      { key: "name", label: "Mã đơn hàng" },
      { key: "customer", label: "Khách hàng" },
      { key: "email", label: "Email", type: "email" },
      { key: "total", label: "Giá trị (₫)", type: "number" },
      { key: "date", label: "Ngày đặt", type: "date" },
      {
        key: "status",
        label: "Trạng thái",
        type: "select",
        options: [
          "Chờ xác nhận",
          "Đang chuẩn bị",
          "Đang giao",
          "Hoàn tất",
          "Đã hủy",
        ],
      },
      {
        key: "payment",
        label: "Thanh toán",
        type: "select",
        options: ["Chưa thanh toán", "Đã thanh toán"],
      },
      {
        key: "description",
        label: "Chi tiết sản phẩm / ghi chú",
        type: "textarea",
      },
    ],
  },
  customers: {
    title: "Khách hàng",
    singular: "khách hàng",
    description: "Một nơi lưu giữ thông tin và kết nối với khách hàng.",
    fields: [
      { key: "name", label: "Họ tên / tên doanh nghiệp" },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Số điện thoại" },
      { key: "address", label: "Địa chỉ" },
      {
        key: "status",
        label: "Nhóm khách hàng",
        type: "select",
        options: ["Khách lẻ", "Đối tác", "Doanh nghiệp"],
      },
    ],
  },
  articles: {
    title: "Bài viết",
    singular: "bài viết",
    description: "Quản lý câu chuyện, kiến thức và tin tức của Aura.",
    fields: [
      { key: "name", label: "Tiêu đề" },
      { key: "slug", label: "Đường dẫn (slug)" },
      { key: "category", label: "Chuyên mục", type: "select", options: ["new-products", "market-trends", "barista-tech"] },
      { key: "author", label: "Tác giả" },
      {
        key: "status",
        label: "Trạng thái",
        type: "select",
        options: ["Bản nháp", "Đã xuất bản"],
      },
      { key: "description", label: "Tóm tắt", type: "textarea" },
      { key: "content", label: "Nội dung", type: "textarea" },
      { key: "image", label: "URL ảnh bìa", type: "url", optional: true },
    ],
  },
  contacts: {
    title: "Liên hệ & tư vấn",
    singular: "yêu cầu",
    description: "Tiếp nhận và theo dõi các nhu cầu tư vấn từ khách hàng.",
    fields: [
      { key: "name", label: "Khách hàng" },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Số điện thoại" },
      { key: "subject", label: "Chủ đề" },
      {
        key: "status",
        label: "Tiến độ",
        type: "select",
        options: ["Mới", "Đang xử lý", "Đã giải quyết"],
      },
      { key: "description", label: "Nội dung", type: "textarea" },
    ],
  },
  payments: {
    title: "Thanh toán",
    singular: "giao dịch",
    description: "Theo dõi giao dịch và đối soát thanh toán tại một nơi.",
    fields: [
      { key: "name", label: "Mã giao dịch" },
      { key: "order", label: "Mã đơn hàng" },
      { key: "customer", label: "Khách hàng" },
      { key: "total", label: "Số tiền (₫)", type: "number" },
      {
        key: "method",
        label: "Phương thức",
        type: "select",
        options: ["Chuyển khoản", "VNPay", "COD"],
      },
      { key: "date", label: "Ngày giao dịch", type: "date" },
      {
        key: "status",
        label: "Trạng thái",
        type: "select",
        options: ["Thành công", "Chờ xử lý", "Thất bại", "Đã hoàn tiền"],
      },
    ],
  },
  inventory: {
    title: "Tồn kho",
    singular: "tồn kho",
    description: "Nắm rõ lượng hàng còn lại và chủ động kế hoạch nhập hàng.",
    fields: [
      { key: "name", label: "Sản phẩm" },
      { key: "sku", label: "SKU" },
      { key: "categoryId", label: "Danh mục" },
      { key: "stock", label: "Số lượng tồn", type: "number" },
    ],
  },
};
export const money = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
export function createEmptyData(): Dataset {
  return {
    products: [],
    categories: [],
    brands: [],
    orders: [],
    customers: [],
    articles: [],
    contacts: [],
    payments: [],
  };
}

export function parseDataset(value: unknown): Dataset {
  if (!isRecord(value)) throw new Error('Invalid dataset');
  const result = createEmptyData();
  for (const key of Object.keys(result)) {
    const rows = value[key];
    if (!Array.isArray(rows) || !rows.every(row => isRecord(row)
      && typeof row.id === 'string' && /^[a-zA-Z0-9_-]+$/.test(row.id)
      && Object.values(row).every(v => typeof v === 'string' || (typeof v === 'number' && Number.isFinite(v)))
      && configs[key].fields.every(field => field.optional || typeof row[field.key] === (field.type === 'number' ? 'number' : 'string')))) throw new Error('Invalid dataset');
    result[key] = rows as Row[];
  }
  return result;
}
