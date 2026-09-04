'use client';

import React from 'react';
import { Phone, Mail, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { CONTACT_CHANNELS, ATELIER_HUBS } from '@/data/contact';
import { ContactChannelInfo, AtelierHub } from '@/types/contact';

interface ContactInfoProps {
  className?: string;
  channels?: ContactChannelInfo;
  hubs?: AtelierHub[];
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  className = '',
  channels = CONTACT_CHANNELS,
  hubs = ATELIER_HUBS,
}) => {
  return (
    <aside
      className={`space-y-10 ${className}`}
      aria-label="Thông tin liên hệ trực tiếp Aura Coffee"
    >
      {/* ── Quick Direct Channels ── */}
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[var(--espresso-light)] block mb-2">
            Đường dây tư vấn trực tiếp
          </span>
          <a
            href={channels.hotline}
            className="group inline-flex items-center gap-3 text-[22px] md:text-[26px] font-serif font-light text-[var(--espresso-ink)] hover:text-[var(--copper-accent)] transition-colors duration-200"
            aria-label={`Gọi hotline tư vấn ${channels.hotlineDisplay}`}
          >
            <span className="w-10 h-10 rounded-full border border-[var(--cream-shadow)] flex items-center justify-center text-[var(--copper-accent)] group-hover:border-[var(--copper-accent)] transition-colors duration-200">
              <Phone size={18} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span>{channels.hotlineDisplay}</span>
            <ArrowUpRight
              size={18}
              strokeWidth={1.5}
              className="text-[var(--espresso-light)] group-hover:text-[var(--copper-accent)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>

        <div className="pt-4 border-t border-[var(--cream-shadow)]">
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[var(--espresso-light)] block mb-2">
            Thư điện tử Concierge & Dự án
          </span>
          <div className="flex flex-col gap-2">
            <a
              href={`mailto:${channels.emailConcierge}`}
              className="inline-flex items-center gap-2.5 text-[15px] font-sans text-[var(--espresso-mid)] hover:text-[var(--copper-accent)] transition-colors duration-200"
            >
              <Mail size={16} strokeWidth={1.5} className="text-[var(--copper-accent)]" aria-hidden="true" />
              <span>{channels.emailConcierge}</span>
            </a>
            <a
              href={`mailto:${channels.emailB2b}`}
              className="inline-flex items-center gap-2.5 text-[15px] font-sans text-[var(--espresso-mid)] hover:text-[var(--copper-accent)] transition-colors duration-200"
            >
              <Mail size={16} strokeWidth={1.5} className="text-[var(--copper-accent)]" aria-hidden="true" />
              <span>{channels.emailB2b} (Hồ sơ dự án F&B)</span>
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--cream-shadow)]">
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[var(--espresso-light)] block mb-2">
            Thời gian tiếp nhận & Làm việc
          </span>
          <div className="flex items-start gap-2.5 text-[14px] font-sans text-[var(--espresso-mid)] leading-relaxed">
            <Clock size={16} strokeWidth={1.5} className="text-[var(--copper-accent)] mt-1 shrink-0" aria-hidden="true" />
            <div>
              <p>{channels.weekdayHours}</p>
              <p className="text-[13px] text-[var(--espresso-light)]">{channels.weekendNote}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Atelier Hubs (Physical locations) ── */}
      <div className="pt-6 border-t border-[var(--cream-shadow)] space-y-6">
        <h2 className="font-serif text-[20px] font-normal text-[var(--espresso-ink)] tracking-wide">
          Không Gian Trải Nghiệm & Xưởng Rang
        </h2>

        {hubs.map((hub) => (
          <div
            key={hub.id}
            className={`space-y-1.5 pl-4 border-l-2 ${
              hub.isPrimary ? 'border-[var(--copper-accent)]' : 'border-[var(--cream-shadow)]'
            }`}
          >
            <p className="text-[14px] font-sans font-medium text-[var(--espresso-ink)]">
              {hub.name}
            </p>
            <p className="text-[13.5px] font-sans text-[var(--espresso-mid)] leading-relaxed">
              {hub.address}
            </p>
            {hub.note && (
              <p className="text-[12px] font-sans text-[var(--espresso-light)] italic">
                {hub.note}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── B2B SLA Commitment Note ── */}
      <div className="p-5 bg-[var(--cream-deep)] border border-[var(--cream-shadow)] rounded-sm space-y-2">
        <div className="flex items-center gap-2 text-[var(--copper-accent)]">
          <ShieldCheck size={18} strokeWidth={1.5} aria-hidden="true" />
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.15em]">
            Cam Kết Phản Hồi B2B
          </span>
        </div>
        <p className="text-[13px] font-sans text-[var(--espresso-mid)] leading-relaxed">
          Đội ngũ tư vấn kỹ thuật Aura cam kết liên hệ lại trong vòng <strong>{channels.slaResponseTime}</strong>. Đối với các yêu cầu khảo sát mặt bằng và lập phương án thiết bị, chuyên viên sẽ có mặt trực tiếp tại cơ sở của quý đối tác trong vòng <strong>{channels.slaSurveyTime}</strong>.
        </p>
      </div>
    </aside>
  );
};
