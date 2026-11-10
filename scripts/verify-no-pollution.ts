#!/usr/bin/env bun
/**
 * GRANMED.STORE — Script 1 : Vérification de la Non-Pollution des Articles avant Publication
 * (Zéro Trace d'IA, Isolation Linguistique Stricte FR/EN, Burstiness, Zéro Unicode Invisible, Images Uniques)
 */

import { getAllBlogArticles } from "../src/lib/blog/articles";

const BANNED_AI_PATTERNS_FR: RegExp[] = [
  /dans un monde o[uù]/i,
  /[aà] l'[eè]re du num[eé]rique/i,
  /plongeons dans/i,
  /il est important de noter/i,
  /il convient de souligner/i,
  /en conclusion,/i,
  /en r[eé]sum[eé],/i,
  /tapisserie/i,
  /symphonie/i,
  /kal[eé]idoscope/i,
  /au c[oœ]ur de/i,
  /véritable catalyseur/i,
  /change la donne/i,
  /révolutionner/i,
];

const BANNED_AI_PATTERNS_EN: RegExp[] = [
  /\bdelve into\b/i,
  /\btapestry\b/i,
  /\btestament to\b/i,
  /\bbeacon of\b/i,
  /\bin today's fast-paced\b/i,
  /\bin conclusion,\b/i,
  /\bit is important to note\b/i,
  /\bgame-changer\b/i,
  /\bunleash\b/i,
  /\bunlock the power\b/i,
  /\bdemystify\b/i,
  /\bsymphony\b/i,
  /\bembark on a journey\b/i,
];

// Mots anglais interdits dans les articles FR
const FORBIDDEN_EN_IN_FR =
  /\b(brain fog|workflow|tips|feedback|burnout|mindset|game changer|level up|how to|free online|check price)\b/i;

// Mots français interdits dans les articles EN
const FORBIDDEN_FR_IN_EN =
  /\b(cependant|néanmoins|toutefois|entraîner|mémoire|cerveau|grâce|c'est-à-dire|voici|pourquoi)\b/i;

const INVISIBLE_UNICODE = /[\u200B\u200C\u200D\uFEFF\u00AD\u2060]/;

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function computeBurstiness(text: string): number {
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 3);
  if (sentences.length < 4) return 0;
  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((acc, l) => acc + Math.pow(l - mean, 2), 0) / lengths.length;
  return Number(Math.sqrt(variance).toFixed(2));
}

export function verifyNoPollution(): {
  passed: boolean;
  errors: string[];
  checkedCount: number;
} {
  const articles = getAllBlogArticles();
  const errors: string[] = [];
  const heroImagesByLang: Record<string, Set<string>> = {
    fr: new Set(),
    en: new Set(),
  };

  for (const article of articles) {
    const prefix = `[${article.lang.toUpperCase()} / ${article.slug}]`;
    const fullText = [
      article.title,
      article.excerpt,
      ...article.aioSummaryBullets.map(stripHtml),
      stripHtml(article.contentHtml),
      ...article.faq.map((f) => `${f.question} ${stripHtml(f.answer)}`),
    ].join(" ");

    // 1. Zéro caractère Unicode invisible
    if (INVISIBLE_UNICODE.test(fullText) || INVISIBLE_UNICODE.test(article.contentHtml)) {
      errors.push(`${prefix} Caractère Unicode invisible détecté (watermark IA).`);
    }

    // 2. Maximum 1 tiret cadratin (—) dans contentHtml
    const emDashCount = (article.contentHtml.match(/—/g) ?? []).length;
    if (emDashCount > 1) {
      errors.push(`${prefix} Trop de tirets cadratins (—) dans contentHtml : ${emDashCount} (max 1).`);
    }

    // 3. Zéro cliché d'IA
    const bannedList =
      article.lang === "fr" ? BANNED_AI_PATTERNS_FR : BANNED_AI_PATTERNS_EN;
    for (const regex of bannedList) {
      if (regex.test(fullText)) {
        errors.push(`${prefix} Marqueur lexical d'IA interdit détecté : ${regex}`);
      }
    }

    // 4. Isolation linguistique stricte FR vs EN
    if (article.lang === "fr") {
      const m = FORBIDDEN_EN_IN_FR.exec(fullText);
      if (m) {
        errors.push(`${prefix} Pollution anglaise détectée dans un article FR : "${m[0]}"`);
      }
    } else {
      const m = FORBIDDEN_FR_IN_EN.exec(fullText);
      if (m) {
        errors.push(`${prefix} Pollution française détectée dans un article EN : "${m[0]}"`);
      }
    }

    // 5. Burstiness (écart-type de longueur de phrase >= 5.0)
    const burstiness = computeBurstiness(stripHtml(article.contentHtml));
    if (burstiness < 5.0) {
      errors.push(
        `${prefix} Burstiness insuffisante (${burstiness} < 5.0) — rythme de phrase trop monotone.`
      );
    }

    // 6. Zéro balise <h1> dans contentHtml
    if (/<h1\b/i.test(article.contentHtml)) {
      errors.push(`${prefix} Balise <h1> interdite dans contentHtml (réservée au titre principal).`);
    }

    // 7. Zéro duplication de l'image Hero dans contentHtml
    const heroBase = article.image.split("?")[0];
    if (article.contentHtml.includes(heroBase)) {
      errors.push(
        `${prefix} Duplication en cascade : l'image Hero (${heroBase}) est répétée dans contentHtml.`
      );
    }

    // 8. Unicité de l'image Hero au sein de chaque langue
    if (heroImagesByLang[article.lang].has(heroBase)) {
      errors.push(`${prefix} Image Hero dupliquée avec un autre article (${heroBase}).`);
    }
    heroImagesByLang[article.lang].add(heroBase);
  }

  return {
    passed: errors.length === 0,
    errors,
    checkedCount: articles.length,
  };
}

const isMain =
  Boolean((import.meta as unknown as { main?: boolean }).main) ||
  (process.argv[1] && process.argv[1].includes("verify-no-pollution"));

if (isMain) {
  console.log("🧹 [1/5] VERIFY-NO-POLLUTION — Audit Anti-IA, Isolation Linguistique & Images...");
  const res = verifyNoPollution();
  if (!res.passed) {
    for (const err of res.errors) console.error(`  ❌ ${err}`);
    process.exit(1);
  }
  console.log(
    `  ✅ 100 % PROPRE : ${res.checkedCount} articles vérifiés (0 trace d'IA, 0 pollution linguistique, burstiness OK, images uniques).`
  );
}
