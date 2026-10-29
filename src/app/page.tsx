import type { Metadata } from "next";
import { GranmedApp } from "@/components/granmed-app";
import { PwaInstall } from "@/components/shared/pwa-install";
import { GAMES, CATEGORIES } from "@/lib/games/catalog";
import { HOME_FAQ } from "@/lib/content/home-faq";
import { GUIDES } from "@/lib/content/guides";

/**
 * GRANMED.STORE — portail de 20 jeux gratuits bilingue FR/EN.
 * Route unique du sandbox : toute la navigation se fait par hash (#/fr/…, #/en/…).
 * Cette page serveur injecte les données structurées (SEO / AIO / GEO) et
 * rend l'application (SSR du contenu d'accueil pour les moteurs).
 *
 * Task 21 (audit strict SEO/GEO/AIO) : `generateMetadata` différencie la version
 * anglaise dédiée `/?lang=en` (title, description, keywords, OG, canonical
 * auto-référentiel et cluster hreflang valide) — les moteurs de réponse IA qui
 * n'exécutent pas JavaScript voient enfin des métadonnées anglaises sur l'URL EN.
 *
 * Task 22 (audit ultime) : le CORPS aussi est anglais — `initialLang` est transmis
 * à GranmedApp (override SSR) et les VideoGame du JSON-LD portent désormais leurs
 * mots-clés fort volume + longue traîne par langue (catalogue `keywords`).
 */

const SITE_URL = "https://www.granmed.store";
type PageLang = "fr" | "en";

/** Métadonnées localisées par langue (volume fort + longue traîne par niche). */
const PAGE_META: Record<
  PageLang,
  {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogAlt: string;
    twitterDescription: string;
  }
> = {
  fr: {
    title: "Granmed — Jeux de QI gratuits : testez et entraînez votre intelligence",
    description:
      "20 jeux de QI gratuits en ligne : mémoire, logique, calcul mental, mots et réflexes. Chaque partie révèle votre QI estimé et votre niveau d'intelligence — rejouez pour l'élever.",
    keywords: [
      "jeux de QI",
      "test de QI gratuit",
      "test de QI gratuit en ligne",
      "test d'intelligence gratuit",
      "QI moyen",
      "jeux de réflexion gratuits",
      "jeux de logique",
      "jeux de mémoire",
      "jeu de mémoire gratuit",
      "entraînement cérébral",
      "jeux cérébraux",
      "calcul mental",
      "améliorer sa mémoire",
      "stimuler son cerveau",
      "augmenter son QI",
      "sudoku gratuit en ligne",
      "2048 gratuit",
      "démineur gratuit en ligne",
      "mots croisés gratuits en ligne",
      "jeu de mots en ligne",
      "jeux gratuits en ligne",
    ],
    ogTitle: "Granmed — 20 jeux de QI gratuits en ligne",
    ogDescription:
      "Mémoire, logique, calcul mental, réflexes… Chaque partie révèle votre QI estimé et votre niveau d'intelligence, du Novice au Génie. Jouez gratuitement, sans inscription.",
    ogAlt: "Granmed — jeux de QI et entraînement cérébral gratuits",
    twitterDescription:
      "Chaque partie révèle votre QI estimé. Mémoire, logique, calcul mental : jouez gratuitement, sans inscription.",
  },
  en: {
    title: "Granmed — Free IQ Games: Test & Train Your Intelligence",
    description:
      "20 free IQ games online: memory, logic, mental math, words and reflexes. Every round reveals your estimated IQ and intelligence level — replay to raise it. No sign-up, no download.",
    keywords: [
      "free IQ test",
      "free IQ test online",
      "IQ games",
      "free brain games",
      "brain games",
      "brain training",
      "memory games",
      "free memory game",
      "logic games",
      "mind games",
      "increase IQ",
      "how to increase your IQ",
      "cognitive training",
      "average IQ",
      "sudoku online free",
      "2048 game",
      "minesweeper online",
      "free crossword puzzles",
      "word games online",
      "free online games",
    ],
    ogTitle: "Granmed — 20 Free IQ Games Online",
    ogDescription:
      "Memory, logic, mental math, reflexes… Every round reveals your estimated IQ and intelligence level, from Novice to Genius. Play free, no sign-up.",
    ogAlt: "Granmed — free IQ games and brain training",
    twitterDescription:
      "Every round reveals your estimated IQ. Memory, logic, mental math: play free, no sign-up.",
  },
};

/**
 * Métadonnées dynamiques par langue.
 * Cluster hreflang valide (Task 21) :
 *  - `/` (défaut FR) : canonique auto-référentielle, hreflang fr → `/`
 *  - `/?lang=en` : canonique auto-référentielle, hreflang en → `/?lang=en`
 *  - x-default → `/` (version par défaut, français)
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const lang: PageLang = params.lang === "en" ? "en" : "fr";
  const m = PAGE_META[lang];
  const isEn = lang === "en";

  return {
    title: { absolute: m.title },
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: isEn ? "/?lang=en" : "/",
      languages: {
        fr: "/",
        en: "/?lang=en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Granmed",
      title: m.ogTitle,
      description: m.ogDescription,
      url: isEn ? `${SITE_URL}/?lang=en` : SITE_URL,
      images: [
        {
          url: "/images/og-granmed.png",
          width: 1344,
          height: 768,
          alt: m.ogAlt,
        },
      ],
      locale: isEn ? "en_US" : "fr_FR",
      alternateLocale: [isEn ? "fr_FR" : "en_US"],
    },
    twitter: {
      card: "summary_large_image",
      title: m.ogTitle,
      description: m.twitterDescription,
      images: ["/images/og-granmed.png"],
    },
  };
}

function websiteJsonLd(lang: PageLang) {
  const descriptions = {
    fr: "Portail international de 20 jeux de QI gratuits sur navigateur : mémoire, logique, calcul mental, mots et réflexes. Chaque partie révèle un QI estimé et un niveau d'intelligence. Bilingue français/anglais, sans inscription.",
    en: "International portal of 20 free IQ games in the browser: memory, logic, mental math, words and reflexes. Every round reveals an estimated IQ and an intelligence level. Bilingual French/English, no sign-up.",
  };
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Granmed",
    alternateName: ["Granmed Games", "Granmed IQ Games"],
    url: SITE_URL,
    description: descriptions[lang],
    inLanguage: ["fr", "en"],
    isAccessibleForFree: true,
  };
}

function organizationJsonLd(lang: PageLang) {
  const descriptions = {
    fr: "Granmed édite un portail de jeux de QI et d'entraînement cérébral gratuits en ligne : chaque partie produit un QI estimé ludique (échelle classique, moyenne 100) et un niveau d'intelligence du Novice au Génie. Disponible en français et en anglais.",
    en: "Granmed publishes a free online IQ games and brain training portal: every round produces a playful estimated IQ (classic scale, mean 100) and an intelligence level from Novice to Genius. Available in French and English.",
  };
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Granmed",
    url: SITE_URL,
    logo: `${SITE_URL}/images/og-granmed.png`,
    description: descriptions[lang],
    slogan: "Élevez votre QI en jouant · Raise your IQ by playing",
  };
}

function gamesJsonLd(lang: PageLang) {
  const other: PageLang = lang === "fr" ? "en" : "fr";
  const names = {
    fr: "Les 20 jeux de QI gratuits de Granmed",
    en: "Granmed's 20 free IQ games",
  };
  const descriptions = {
    fr: "Catalogue complet des jeux de QI et d'entraînement cérébral gratuits du portail Granmed : chaque jeu estime votre QI en fin de partie, en français et en anglais.",
    en: "Complete catalog of Granmed's free IQ and brain training games: every game estimates your IQ at the end of a round, in French and English.",
  };
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: names[lang],
    description: descriptions[lang],
    numberOfItems: GAMES.length,
    itemListElement: GAMES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoGame",
        name: g.title[lang],
        alternateName: g.title[other],
        description: g.short[lang],
        /* Task 22 : mots-clés fort volume + longue traîne par jeu et par langue. */
        keywords: g.keywords?.[lang].join(', '),
        url: `${SITE_URL}/#/${lang}/${g.paths[lang]}`,
        genre: CATEGORIES.find((c) => c.id === g.category)?.name[lang],
        gamePlatform: ["Web browser", "Mobile", "Desktop"],
        playMode: "SinglePlayer",
        applicationCategory: "Game",
        operatingSystem: "Any",
        inLanguage: ["fr", "en"],
        isAccessibleForFree: true,
        publisher: { "@type": "Organization", name: "Granmed" },
      },
    })),
  };
}

function faqJsonLd(lang: PageLang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: HOME_FAQ[lang].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const lang: PageLang = params.lang === "en" ? "en" : "fr";

  return (
    <>
      <JsonLd data={websiteJsonLd(lang)} />
      <JsonLd data={organizationJsonLd(lang)} />
      <JsonLd data={gamesJsonLd(lang)} />
      <JsonLd data={faqJsonLd(lang)} />
      {/* Task 22 : le HTML servi est déjà dans la langue de l'URL (GEO/AIO sans JS). */}
      <GranmedApp initialLang={lang} />
      <PwaInstall />
    </>
  );
}

/** Métadonnées des guides référencées pour le maillage interne (server-side). */
export const guidesSlugs = GUIDES.map((g) => g.slug);
