import type { Language } from "@/lib/i18n";
import type { BlogArticle } from "@/lib/blog/types";
import { PAIR_1_CHIMP_MEMORY } from "@/lib/blog/pairs/pair-1-chimp-memory";
import { PAIR_2_2048_HANOI } from "@/lib/blog/pairs/pair-2-2048-hanoi";
import { PAIR_3_SCHULTE_REFLEX } from "@/lib/blog/pairs/pair-3-schulte-reflex";
import { PAIR_4_WORD_STROOP } from "@/lib/blog/pairs/pair-4-word-stroop";
import generatedArticlesJson from "@/lib/blog/generated-articles.json";

const GENERATED_ARTICLES = (generatedArticlesJson as unknown as BlogArticle[]) ?? [];

export const BLOG_ARTICLES: BlogArticle[] = [
  ...GENERATED_ARTICLES,
  ...PAIR_4_WORD_STROOP,
  ...PAIR_3_SCHULTE_REFLEX,
  ...PAIR_2_2048_HANOI,
  ...PAIR_1_CHIMP_MEMORY,
];

export function getAllBlogArticles(): BlogArticle[] {
  return [...BLOG_ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogArticlesByLang(lang: Language): BlogArticle[] {
  return getAllBlogArticles().filter((article) => article.lang === lang);
}

export function getBlogArticleBySlug(slug: string, lang?: Language): BlogArticle | undefined {
  return BLOG_ARTICLES.find(
    (article) => article.slug === slug && (lang ? article.lang === lang : true)
  );
}

export function getRelatedBlogArticles(current: BlogArticle, limit = 3): BlogArticle[] {
  const sameLang = getBlogArticlesByLang(current.lang).filter(
    (item) => item.slug !== current.slug
  );
  return sameLang.slice(0, limit);
}

export function getBlogCanonicalPath(article: Pick<BlogArticle, "lang" | "slug">): string {
  return `/${article.lang}/blog/${article.slug}`;
}

export function getBlogAlternatePath(article: Pick<BlogArticle, "lang" | "alternateSlug">): string {
  const otherLang: Language = article.lang === "fr" ? "en" : "fr";
  return `/${otherLang}/blog/${article.alternateSlug}`;
}
