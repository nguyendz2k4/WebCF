export type NewsCategory = 'all' | 'new-products' | 'market-trends' | 'barista-tech';

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  categoryLabel: string;
  publishedAt: string; // e.g. "18 Tháng 8, 2026"
  readTime: string;    // e.g. "5 phút đọc"
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  featured?: boolean;
  content: {
    leadParagraph: string;
    sections: {
      heading?: string;
      body: string[];
      pullQuote?: string;
      keyPoints?: string[];
      image?: {
        url: string;
        caption: string;
      };
    }[];
  };
  tags: string[];
}
