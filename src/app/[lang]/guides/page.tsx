import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Language } from "@/lib/i18n";
import { GranmedApp } from "@/components/granmed-app";

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

  return {
    title: {
      absolute: isFr
        ? "Guides & Méthodes d'Entraînement Cérébral — Granmed"
        : "Brain Training Guides & IQ Methods — Granmed",
    },
    description: isFr
      ? "Parcours d'entraînement cérébral, guides des 20 jeux de QI Granmed et méthodes pour progresser en mémoire, logique, calcul mental et réflexes."
      : "Brain training tracks, guides for all 20 Granmed IQ games, and proven methods to improve working memory, logic, mental math, and reflexes.",
    alternates: {
      canonical: `/${lang}/guides`,
      languages: {
        fr: "/fr/guides",
        en: "/en/guides",
        "x-default": "/fr/guides",
      },
    },
  };
}

export default async function GuidesRoutePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (rawLang !== "fr" && rawLang !== "en") {
    notFound();
  }
  const lang: Language = rawLang;
  return <GranmedApp initialLang={lang} initialView={{ type: "guides" }} />;
}
