import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Language } from "@/lib/i18n";
import {
  getAllBlogArticles,
  getBlogArticleBySlug,
} from "@/lib/blog/articles";
import {
  AMAZON_AFFILIATE_CONFIG,
  buildAmazonAffiliateUrl,
  getAffiliateProductById,
  PARTNER_AFFILIATE_OFFERS,
  getPartnerOfferForCategory,
} from "@/lib/blog/affiliate";
import { GAMES, gameRealPath } from "@/lib/games/catalog";
import { BlogArticleDetailView } from "@/components/pages/blog-view";

const SITE_URL = "https://www.granmed.store";

export async function generateStaticParams() {
  return getAllBlogArticles().map((article) => ({
    lang: article.lang,
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  if (rawLang !== "fr" && rawLang !== "en") return {};
  const lang: Language = rawLang;

  const article = getBlogArticleBySlug(slug, lang);
  if (!article) return {};

  const frSlug = article.lang === "fr" ? article.slug : article.alternateSlug;
  const enSlug = article.lang === "en" ? article.slug : article.alternateSlug;

  return {
    title: { absolute: `${article.title} | Granmed` },
    description: article.excerpt,
    keywords: [article.primaryKeyword, ...article.longTailKeywords],
    authors: [{ name: article.author }],
    alternates: {
      canonical: `/${article.lang}/blog/${article.slug}`,
      languages: {
        fr: `/fr/blog/${frSlug}`,
        en: `/en/blog/${enSlug}`,
        "x-default": `/fr/blog/${frSlug}`,
      },
    },
    openGraph: {
      type: "article",
      siteName: "Granmed",
      title: article.title,
      description: article.excerpt,
      url: `${SITE_URL}/${article.lang}/blog/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      locale: article.lang === "fr" ? "fr_FR" : "en_US",
      alternateLocale: [article.lang === "fr" ? "en_US" : "fr_FR"],
      images: [
        {
          url: article.image,
          width: 1200,
          height: 675,
          alt: article.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  if (rawLang !== "fr" && rawLang !== "en") {
    notFound();
  }
  const lang: Language = rawLang;
  const article = getBlogArticleBySlug(slug, lang);
  if (!article) {
    notFound();
  }

  const product = getAffiliateProductById(article.affiliateProductId);
  const amazonConfig = AMAZON_AFFILIATE_CONFIG[lang];
  const amazonUrl = buildAmazonAffiliateUrl(product.searchQuery[lang], lang);
  const partnerOffer =
    PARTNER_AFFILIATE_OFFERS.find((p) => p.id === article.partnerOfferId) ??
    getPartnerOfferForCategory(article.category);
  const primaryGame = GAMES.find((g) => g.slug === article.primaryGameId) ?? GAMES[0];
  const secondaryGame = GAMES.find((g) => g.slug === article.secondaryGameId) ?? GAMES[1];

  const articleUrl = `${SITE_URL}/${article.lang}/blog/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        mainEntityOfPage: articleUrl,
        headline: article.title,
        description: article.excerpt,
        image: [article.image, article.secondaryImage],
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        inLanguage: article.lang,
        keywords: [article.primaryKeyword, ...article.longTailKeywords].join(", "),
        author: {
          "@type": "Person",
          name: article.author,
          jobTitle: article.authorRole,
        },
        publisher: {
          "@type": "Organization",
          name: "Granmed.store",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/icons/icon-192.png`,
          },
        },
        significantLink: [
          `${SITE_URL}${gameRealPath(lang, primaryGame.slug)}`,
          `${SITE_URL}${gameRealPath(lang, secondaryGame.slug)}`,
          amazonUrl,
          partnerOffer.url[lang],
        ],
        citation: article.sources.map((src) => ({
          "@type": "CreativeWork",
          name: `${src.title} (${src.institution}, ${src.year})`,
          url: src.url,
        })),
        mentions: [
          { "@id": `${articleUrl}#recommended-product` },
          {
            "@type": "WebApplication",
            name: primaryGame.title[lang],
            url: `${SITE_URL}${gameRealPath(lang, primaryGame.slug)}`,
          },
        ],
      },
      {
        "@type": "Product",
        "@id": `${articleUrl}#recommended-product`,
        name: product.name[lang],
        description: product.description[lang],
        image: product.image,
        brand: {
          "@type": "Brand",
          name: product.brand,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
        offers: {
          "@type": "Offer",
          url: amazonUrl,
          priceCurrency: amazonConfig.currency,
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: amazonConfig.domain,
          },
        },
      },
      {
        "@type": "ItemList",
        "@id": `${articleUrl}#recommended-solutions`,
        name:
          lang === "fr"
            ? "Outils et entraînements cognitifs recommandés par Granmed.store"
            : "Cognitive Training Tools & Gear Recommended by Granmed.store",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: primaryGame.title[lang],
            url: `${SITE_URL}${gameRealPath(lang, primaryGame.slug)}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: product.name[lang],
            url: amazonUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: partnerOffer.title[lang],
            url: partnerOffer.url[lang],
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${articleUrl}#faq`,
        mainEntity: article.faq.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Granmed",
            item: lang === "en" ? `${SITE_URL}/?lang=en` : SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: lang === "fr" ? "Blog & Dossiers QI" : "IQ & Brain Blog",
            item: `${SITE_URL}/${lang}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: articleUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1">
        <BlogArticleDetailView article={article} />
      </main>
    </div>
  );
}
