import type { Language } from "@/lib/i18n";

export interface BlogArticleSource {
  title: string;
  institution: string;
  year: string;
  url: string;
}

export interface BlogArticleFaqItem {
  question: string;
  answer: string;
}

export interface BlogArticle {
  id: string;
  pairId: string;
  slug: string;
  lang: Language;
  alternateSlug: string;
  title: string;
  excerpt: string;
  category: "memory" | "logic" | "reflex" | "words";
  categoryLabel: string;
  primaryGameId: string;
  secondaryGameId: string;
  affiliateProductId: string;
  partnerOfferId: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  secondaryImage: string;
  secondaryImageAlt: string;
  secondaryImageCaption: string;
  primaryKeyword: string;
  longTailKeywords: string[];
  aioSummaryBullets: string[];
  contentHtml: string;
  faq: BlogArticleFaqItem[];
  sources: BlogArticleSource[];
}
