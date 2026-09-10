import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Share2, Tag, CheckCircle2, ChevronRight } from 'lucide-react';
import { getArticles } from '@/lib/public-data';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast } from '@/components/shared';
import { SiteFooter } from '@/components/store';
import { NewsCard } from '@/components/news';

interface PageProps {
  params: Promise<{ slug: string }>;
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = (await getArticles()).find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Không tìm thấy bài viết | Aura Coffee',
    };
  }

  return {
    title: `${article.title} | Aura Coffee Journal`,
    description: article.excerpt,
    keywords: [...article.tags, 'Aura Coffee Solutions', 'Tin tức cà phê'],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage }],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = (await getArticles()).find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Find 3 related articles
  const relatedArticles = (await getArticles()).filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream-base)]">
      {/* ── Global Navbar ── */}
      <Navbar />

      {/* ── Main Article Layout ── */}
      <div className="flex-1 pt-28 pb-20">
        <div className="max-w-[var(--container-max)] mx-auto px-6 md:px-12">
          {/* ── Breadcrumbs & Back Link ── */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pt-4">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[var(--espresso-light)]">
              <Link href="/" className="hover:text-[var(--espresso-ink)] transition-colors">
                Trang Chủ
              </Link>
              <ChevronRight size={14} className="text-[var(--cream-shadow)]" />
              <Link href="/news" className="hover:text-[var(--espresso-ink)] transition-colors">
                Tin Tức
              </Link>
              <ChevronRight size={14} className="text-[var(--cream-shadow)]" />
              <span className="text-[var(--espresso-ink)] font-medium truncate max-w-[240px] sm:max-w-md">
                {article.title}
              </span>
            </nav>

            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--copper-accent)] hover:text-[var(--copper-light)] transition-colors"
            >
              <ArrowLeft size={14} />
              Quay lại danh mục
            </Link>
          </div>

          {/* ── Article Header ── */}
          <header className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-block px-3 py-1 rounded-full bg-[var(--cream-deep)] border border-[var(--cream-shadow)] text-[11px] font-medium tracking-widest uppercase text-[var(--copper-accent)] mb-4">
              {article.categoryLabel}
            </div>

            <h1 className="font-serif text-[32px] sm:text-[42px] lg:text-[48px] font-normal leading-[1.18] text-[var(--espresso-ink)] mb-6">
              {article.title}
            </h1>

            {/* Author & Meta Row */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-[var(--espresso-light)] pb-6 border-b border-[var(--cream-shadow)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--copper-accent)] text-[var(--cream-base)] flex items-center justify-center font-serif text-[14px]">
                  {article.author.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-medium text-[var(--espresso-ink)]">{article.author.name}</div>
                  <div className="text-[11px] text-[var(--espresso-light)]">{article.author.role}</div>
                </div>
              </div>

              <span className="hidden sm:inline w-1 h-1 rounded-full bg-[var(--cream-shadow)]" />

              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[var(--copper-accent)]" />
                <span>{article.publishedAt}</span>
              </div>

              <span className="hidden sm:inline w-1 h-1 rounded-full bg-[var(--cream-shadow)]" />

              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{article.readTime}</span>
              </div>
            </div>
          </header>

          {/* ── Hero Image ── */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="aspect-16/9 rounded-xl overflow-hidden border border-[var(--cream-shadow)] bg-[var(--cream-deep)] shadow-xs">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* ── Article Content ── */}
          <article className="max-w-3xl mx-auto">
            {/* Lead Paragraph */}
            <p className="font-serif text-[20px] sm:text-[22px] font-normal leading-relaxed text-[var(--espresso-ink)] mb-8 italic">
              &ldquo;{article.content.leadParagraph}&rdquo;
            </p>

            {/* Content Sections */}
            <div className="space-y-10">
              {article.content.sections.map((section, idx) => (
                <section key={idx} className="space-y-4">
                  {section.heading && (
                    <h2 className="font-serif text-[24px] sm:text-[28px] font-normal text-[var(--espresso-ink)] pt-4 border-t border-[var(--cream-shadow)]">
                      {section.heading}
                    </h2>
                  )}

                  {section.body.map((para, pIdx) => (
                    <p key={pIdx} className="font-sans text-[16px] text-[var(--espresso-mid)] leading-[1.8]">
                      {para}
                    </p>
                  ))}

                  {/* Optional Pull Quote */}
                  {section.pullQuote && (
                    <blockquote className="my-8 p-6 bg-[var(--cream-deep)]/60 border-l-3 border-[var(--copper-accent)] rounded-r-lg">
                      <p className="font-serif text-[18px] sm:text-[20px] italic text-[var(--espresso-ink)] leading-snug">
                        {section.pullQuote}
                      </p>
                    </blockquote>
                  )}

                  {/* Optional Key Points Box */}
                  {section.keyPoints && section.keyPoints.length > 0 && (
                    <div className="my-6 p-6 rounded-lg bg-[var(--cream-deep)] border border-[var(--cream-shadow)]">
                      <p className="text-[12px] uppercase tracking-widest font-medium text-[var(--copper-accent)] mb-3">
                        Điểm Nhấn Trọng Tâm
                      </p>
                      <ul className="space-y-2.5">
                        {section.keyPoints.map((point, kIdx) => (
                          <li key={kIdx} className="flex items-start gap-2.5 text-[14px] text-[var(--espresso-ink)]">
                            <CheckCircle2 size={16} className="text-[var(--copper-accent)] shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optional Section Image */}
                  {section.image && (
                    <figure className="my-8">
                      <div className="aspect-16/9 rounded-lg overflow-hidden border border-[var(--cream-shadow)]">
                        <img
                          src={section.image.url}
                          alt={section.image.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <figcaption className="text-center text-[12px] text-[var(--espresso-light)] mt-2 font-sans italic">
                        {section.image.caption}
                      </figcaption>
                    </figure>
                  )}
                </section>
              ))}
            </div>

            {/* ── Tags Cloud ── */}
            <div className="mt-12 pt-6 border-t border-[var(--cream-shadow)] flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-[12px] text-[var(--espresso-light)] mr-2">
                <Tag size={13} />
                Từ khóa:
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] font-sans px-3 py-1 rounded-full bg-[var(--cream-deep)] text-[var(--espresso-mid)] border border-[var(--cream-shadow)]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* ── Consultation Banner ── */}
            <div className="mt-12 p-8 rounded-xl bg-[var(--espresso-ink)] text-[var(--cream-base)] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-medium text-[var(--copper-glow)] mb-1">
                  Đồng Hành Cùng Aura Coffee
                </p>
                <h3 className="font-serif text-[24px] font-light text-[var(--cream-base)] mb-2">
                  Bạn đang tìm giải pháp thiết bị hoặc nguồn hạt cho quán?
                </h3>
                <p className="font-sans text-[14px] text-[var(--cream-shadow)] max-w-md">
                  Đội ngũ chuyên gia của Aura sẵn sàng tư vấn cấu hình quầy bar và giải pháp tài chính tối ưu nhất.
                </p>
              </div>
              <Link
                href="/#contact"
                className="shrink-0 px-6 py-3 rounded bg-[var(--copper-accent)] hover:bg-[var(--copper-light)] text-[var(--cream-base)] font-medium text-[13px] transition-colors"
              >
                Nhận Tư Vấn Miễn Phí
              </Link>
            </div>
          </article>

          {/* ── Related Articles ── */}
          {relatedArticles.length > 0 && (
            <section className="mt-20 pt-12 border-t border-[var(--cream-shadow)]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-[var(--copper-accent)]">
                    Aura Journal
                  </span>
                  <h2 className="font-serif text-[28px] font-normal text-[var(--espresso-ink)]">
                    Bài Viết Liên Quan
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="text-[13px] font-medium text-[var(--copper-accent)] hover:text-[var(--copper-light)] transition-colors"
                >
                  Xem tất cả tin tức →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((rel) => (
                  <NewsCard key={rel.id} article={rel} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ── Global Footer & Modals ── */}
      <SiteFooter />
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />
      <Toast />
    </main>
  );
}
