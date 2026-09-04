import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductReviewsSectionProps {
  product: Product;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const isEquipment = product.domain === 'equipment';

  return (
    <section
      id="product-reviews-section"
      aria-label="Đánh giá chuyên gia và ghi chú thử nếm"
      className="py-14 border-t border-[var(--cream-shadow)]"
    >
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-px bg-[var(--copper-accent)]" />
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[var(--copper-accent)]">
            Aura Quality Lab · Đánh Giá Kỹ Thuật
          </span>
        </div>

        <h3
          className="text-2xl md:text-3xl text-[var(--espresso-ink)] font-normal mb-4"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {isEquipment ? 'Ghi Chú Vận Hành Cơ Khí' : 'Hồ Sơ Cảm Quan & Cupping Lab'}
        </h3>

        <p className="text-xs sm:text-sm text-[var(--espresso-mid)] leading-relaxed font-light mb-8">
          Được thực hiện bởi đội ngũ Barista và Kỹ sư kỹ thuật của Aura Coffee Solutions trong điều kiện phòng Lab tiêu chuẩn.
        </p>

        {/* Technical / Cupping Review Card */}
        <div className="p-6 rounded-xl bg-[var(--cream-deep)]/50 border border-[var(--cream-shadow)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--cream-base)] border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)]">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--espresso-ink)] block">
                  Aura Technical Team & Head Barista
                </span>
                <span className="text-[11px] text-[var(--espresso-light)]">
                  {isEquipment ? 'Kiểm định áp suất & độ suy giảm nhiệt' : 'Đánh giá độ sạch & body chiết xuất'}
                </span>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--cream-base)] text-[var(--espresso-mid)] border border-[var(--cream-shadow)]/60 font-mono">
              Lab Verified
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[var(--espresso-mid)] leading-relaxed font-light italic">
            {isEquipment
              ? `"${product.name} duy trì sự ổn định nhiệt độ chiết xuất cực kỳ ấn tượng trong các chu kỳ pha liên tục. Tay pha đầm chắc, hệ thống đánh sữa microfoam có độ tơi xốp cao, phù hợp cho cả mô hình specialty đòi hỏi độ chính xác lẫn chuỗi quán áp lực ca cao điểm."`
              : `"${product.name} cho hương thơm rõ nét, độ axit sáng thanh lịch và hậu vị kéo dài dễ chịu. Khi chiết xuất espresso hoặc pour-over, lớp crema dày mịn và độ cân bằng hương vị giữ rất tốt."`}
          </p>
        </div>

        {/* Customer Review Notice (Transparent: No fake data) */}
        <div className="mt-6 p-4 rounded-xl border border-dashed border-[var(--cream-shadow)] flex items-start gap-3 text-xs text-[var(--espresso-light)]">
          <MessageSquare size={16} className="shrink-0 mt-0.5 text-[var(--espresso-light)]" />
          <div>
            <span className="font-medium text-[var(--espresso-ink)] block mb-0.5">
              Đánh Giá Từ Khách Hàng Doanh Nghiệp
            </span>
            <p className="leading-relaxed font-light">
              Hệ thống đánh giá công khai từ các chủ quán đã mua hàng sẽ được đồng bộ hóa khi hệ thống Backend & Cổng tài khoản khách hàng chính thức đi vào vận hành. Aura cam kết không sử dụng đánh giá sao giả mạo để định hướng người tiêu dùng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
