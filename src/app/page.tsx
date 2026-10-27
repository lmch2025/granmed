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
 */

const SITE_URL = "https://granmed.store";

function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Granmed",
    alternateName: "Granmed Games",
    url: SITE_URL,
    description:
      "Portail international de 20 jeux gratuits sur navigateur : mémoire, puzzles, mots, réflexes. Bilingue français/anglais, sans inscription.",
    inLanguage: ["fr", "en"],
    isAccessibleForFree: true,
  };
}

function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Granmed",
    url: SITE_URL,
    logo: `${SITE_URL}/images/og-granmed.png`,
    description:
      "Granmed édite un portail de jeux gratuits en ligne consacré au divertissement, à l'entraînement cérébral et à la détente, disponible en français et en anglais.",
    slogan: "Play · Challenge · Relax",
  };
}

function gamesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Les 20 jeux gratuits de Granmed",
    description: "Catalogue complet des jeux gratuits du portail Granmed, en français et en anglais.",
    numberOfItems: GAMES.length,
    itemListElement: GAMES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoGame",
        name: g.title.fr,
        alternateName: g.title.en,
        description: g.short.fr,
        url: `${SITE_URL}/#/fr/${g.paths.fr}`,
        genre: CATEGORIES.find((c) => c.id === g.category)?.name.fr,
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

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.fr.map((item) => ({
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

export default function Page() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={gamesJsonLd()} />
      <JsonLd data={faqJsonLd()} />
      <GranmedApp />
      <PwaInstall />
    </>
  );
}

/** Métadonnées des guides référencées pour le maillage interne (server-side). */
export const guidesSlugs = GUIDES.map((g) => g.slug);
