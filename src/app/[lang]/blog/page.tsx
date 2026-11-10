import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Language } from "@/lib/i18n";
import { getBlogArticlesByLang } from "@/lib/blog/articles";
import { BlogIndexView } from "@/components/pages/blog-view";

const SITE_URL = "https://www.granmed.store";

export async function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (rawLang !== "fr" && rawLang !== "en") return {};
  const lang: Language = rawLang;

  const isFr = lang === "fr";
  const title = isFr
    ? "Blog Entraînement Cérébral, Mémoire & Jeux de QI — Granmed"
    : "Brain Training, Working Memory & IQ Strategy Blog — Granmed";
  const description = isFr
    ? "Dossiers neuroscientifiques, astuces pour progresser aux 20 jeux de QI gratuits (Chimpanzé Mémoire, 2048, Table de Schulte, Stroop) et sélection de cahiers d'entraînement cérébral."
    : "Science-backed guides, winning strategies for our 20 free browser IQ games (Chimp Memory Test, 2048, Schulte Table, Stroop Test) and curated brain-training workbooks.";

  return {
    title: { absolute: title },
    description,
    keywords: isFr
      ? [
          "blog entraînement cérébral",
          "exercices mémoire visuelle adulte",
          "test mémoire chimpanzé ayumu",
          "table de schulte lecture rapide",
          "comment gagner au 2048",
          "test de stroop psychologie",
          "cahier entraînement cérébral",
        ]
      : [
          "brain training blog",
          "visual working memory exercises",
          "chimp memory test ayumu",
          "schulte table speed reading",
          "how to beat 2048 strategy",
          "stroop effect test online",
          "brain training workbook adults",
        ],
    alternates: {
      canonical: `/${lang}/blog`,
      languages: {
        fr: "/fr/blog",
        en: "/en/blog",
        "x-default": "/fr/blog",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Granmed",
      title,
      description,
      url: `${SITE_URL}/${lang}/blog`,
      locale: isFr ? "fr_FR" : "en_US",
      alternateLocale: [isFr ? "en_US" : "fr_FR"],
      images: [
        {
          url: "/images/og-granmed.png",
          width: 1344,
          height: 768,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-granmed.png"],
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (rawLang !== "fr" && rawLang !== "en") {
    notFound();
  }
  const lang: Language = rawLang;
  const articles = getBlogArticlesByLang(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/${lang}/blog#blog`,
        url: `${SITE_URL}/${lang}/blog`,
        name:
          lang === "fr"
            ? "Le Blog Neuro-Cognitif & Jeux de QI Granmed.store"
            : "Granmed.store Neuro-Cognitive & IQ Games Blog",
        inLanguage: lang,
        publisher: {
          "@type": "Organization",
          name: "Granmed.store",
          url: SITE_URL,
        },
        blogPost: articles.map((article) => ({
          "@type": "BlogPosting",
          headline: article.title,
          url: `${SITE_URL}/${article.lang}/blog/${article.slug}`,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          image: article.image,
          author: {
            "@type": "Person",
            name: article.author,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
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
        <BlogIndexView lang={lang} />
      </main>
    </div>
  );
}
