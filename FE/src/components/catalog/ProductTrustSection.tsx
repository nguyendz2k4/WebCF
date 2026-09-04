import React from 'react';
import { ShieldCheck, Lock, Headphones, Award } from 'lucide-react';

export const ProductTrustSection: React.FC = () => {
  return (
    <section
      id="product-trust-section"
      aria-label="Cam kết chất lượng và độ tin cậy"
      className="py-12 border-t border-[var(--cream-shadow)]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--cream-deep)]/40 border border-[var(--cream-shadow)]/60">
          <Award size={20} className="text-[var(--copper-accent)] shrink-0 mt-0.5" />
          <div>
            <h4
              className="text-sm font-medium text-[var(--espresso-ink)] mb-1"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Chính Hãng 100%
            </h4>
            <p className="text-xs text-[var(--espresso-mid)] leading-relaxed font-light">
              Nhập khẩu chính ngạch từ các thương hiệu máy pha và roastery danh tiếng toàn cầu.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--cream-deep)]/40 border border-[var(--cream-shadow)]/60">
          <ShieldCheck size={20} className="text-[var(--copper-accent)] shrink-0 mt-0.5" />
          <div>
            <h4
              className="text-sm font-medium text-[var(--espresso-ink)] mb-1"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Kiểm Định Kỹ Thuật
            </h4>
            <p className="text-xs text-[var(--espresso-mid)] leading-relaxed font-light">
              Mỗi mẻ hạt và dòng máy đều trải qua quy trình kiểm thử áp suất và cupping nghiêm ngặt.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--cream-deep)]/40 border border-[var(--cream-shadow)]/60">
          <Lock size={20} className="text-[var(--copper-accent)] shrink-0 mt-0.5" />
          <div>
            <h4
              className="text-sm font-medium text-[var(--espresso-ink)] mb-1"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Bảo Mật Giao Dịch
            </h4>
            <p className="text-xs text-[var(--espresso-mid)] leading-relaxed font-light">
              Thông tin liên hệ và đặt hàng được xử lý bảo mật, kiểm tra trực tiếp qua đội ngũ tư vấn.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--cream-deep)]/40 border border-[var(--cream-shadow)]/60">
          <Headphones size={20} className="text-[var(--copper-accent)] shrink-0 mt-0.5" />
          <div>
            <h4
              className="text-sm font-medium text-[var(--espresso-ink)] mb-1"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Đồng Hành Quầy Bar
            </h4>
            <p className="text-xs text-[var(--espresso-mid)] leading-relaxed font-light">
              Sẵn sàng hỗ trợ tư vấn công thức chiết xuất và bảo trì thiết bị trong suốt quá trình kinh doanh.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
