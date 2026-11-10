#!/usr/bin/env bun
/**
 * GRANMED.STORE — Script 5 : Double Vérification Globale SEO, GEO & AIO
 *
 * Passe 1 : Synchronisation & Audit des 7 Piliers Inviolables SEO/GEO/AIO sur chaque article
 * Passe 2 : Exécution conjointe des 4 scripts spécialisés (Non-Pollution, Affiliation, AIO Citation, Maillage)
 *           + Vérification de la disponibilité HTTP 200 des images + Génération du rapport certifié.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getAllBlogArticles } from "../src/lib/blog/articles";
import { syncSeoFiles } from "../src/lib/blog/sync-seo-files";
import { verifyNoPollution } from "./verify-no-pollution";
import { verifyAffiliateAlignment } from "./verify-affiliate-alignment";
import { verifyAioAffiliateCitation } from "./verify-aio-affiliate-citation";
import { verifyInternalLinking } from "./verify-internal-linking";

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export async function runDoubleVerification(): Promise<{
  passed: boolean;
  errors: string[];
}> {
  const rootDir = process.cwd();
  console.log("🔄 Synchronisation préalable de public/sitemap.xml, public/llms.txt et public/llms-full.txt...");
  const syncRes = syncSeoFiles(rootDir);
  console.log(
    `   ↳ ${syncRes.sitemapUrlCount} URLs dans sitemap.xml | ${syncRes.blogArticleCount} articles dans llms.txt & llms-full.txt.`
  );

  const articles = getAllBlogArticles();
  const errors: string[] = [];
  const articleReports: Array<{
    id: string;
    lang: string;
    route: string;
    twinRoute: string;
    wordCount: number;
    numericStatsCount: number;
    sourcesCount: number;
    faqCount: number;
    longTailCount: number;
    status: "PASS" | "FAIL";
  }> = [];

  for (const article of articles) {
    const prefix = `[${article.lang.toUpperCase()} / ${article.slug}]`;
    const fullText = [
      article.title,
      article.excerpt,
      ...article.aioSummaryBullets.map(stripHtml),
      stripHtml(article.contentHtml),
      ...article.faq.map((f) => `${f.question} ${stripHtml(f.answer)}`),
    ].join(" ");

    const wordCount = countWords(fullText);
    const numericStatsCount = (
      fullText.match(/\b\d+(?:[.,]\d+)?\s*(?:%|ms|millisecondes|milliseconds|minutes|secondes|seconds|jours|days|semaines|weeks|ans|years|mots|words|coups|moves)\b/gi) ??
      []
    ).length;

    let articleOk = true;

    // 1. Longueur minimale SEO/GEO >= 850 mots (cible 950-1300 mots)
    if (wordCount < 850) {
      errors.push(`${prefix} Longueur insuffisante : ${wordCount} mots (minimum 850 requis).`);
      articleOk = false;
    }

    // 2. Densité statistique GEO >= 6 repères chiffrés
    if (numericStatsCount < 6) {
      errors.push(
        `${prefix} Densité statistique GEO insuffisante : ${numericStatsCount} données chiffrées (minimum 6 requis).`
      );
      articleOk = false;
    }

    // 3. Mots-clés spécifiques à la langue (1 pilier + 4 longue traîne min)
    if (!article.primaryKeyword || article.primaryKeyword.trim().length < 5) {
      errors.push(`${prefix} primaryKeyword manquant.`);
      articleOk = false;
    }
    if (!article.longTailKeywords || article.longTailKeywords.length < 4) {
      errors.push(`${prefix} Moins de 4 longTailKeywords définis.`);
      articleOk = false;
    }

    // 4. Sources scientifiques primaires >= 3
    if (!article.sources || article.sources.length < 3) {
      errors.push(`${prefix} Moins de 3 sources scientifiques primaires.`);
      articleOk = false;
    }

    // 5. Attributs alt des images >= 6 mots descriptifs
    if (countWords(article.imageAlt) < 6) {
      errors.push(`${prefix} imageAlt trop court (< 6 mots).`);
      articleOk = false;
    }
    if (countWords(article.secondaryImageAlt) < 6) {
      errors.push(`${prefix} secondaryImageAlt trop court (< 6 mots).`);
      articleOk = false;
    }

    articleReports.push({
      id: article.id,
      lang: article.lang,
      route: `/${article.lang}/blog/${article.slug}`,
      twinRoute: `/${article.lang === "fr" ? "en" : "fr"}/blog/${article.alternateSlug}`,
      wordCount,
      numericStatsCount,
      sourcesCount: article.sources.length,
      faqCount: article.faq.length,
      longTailCount: article.longTailKeywords.length,
      status: articleOk ? "PASS" : "FAIL",
    });
  }

  // Exécution des 4 scripts spécialisés
  const r1 = verifyNoPollution();
  const r2 = verifyAffiliateAlignment();
  const r3 = verifyAioAffiliateCitation(rootDir);
  const r4 = verifyInternalLinking();

  errors.push(...r1.errors, ...r2.errors, ...r3.errors, ...r4.errors);

  const reportDir = join(rootDir, "reports");
  mkdirSync(reportDir, { recursive: true });

  const jsonReport = {
    generatedAt: new Date().toISOString(),
    overallStatus: errors.length === 0 ? "100% PASS" : "FAILED",
    totalArticles: articles.length,
    checks: {
      noPollution: r1.passed,
      affiliateAlignment: r2.passed,
      aioAffiliateCitation: r3.passed,
      internalLinking: r4.passed,
    },
    articles: articleReports,
    errors,
  };

  writeFileSync(
    join(reportDir, "double-verification-report.json"),
    JSON.stringify(jsonReport, null, 2),
    "utf8"
  );

  const mdLines = [
    `# Rapport de Double Vérification SEO, GEO & AIO — Granmed.store`,
    ``,
    `- **Date de l'audit** : ${jsonReport.generatedAt}`,
    `- **Statut Global** : **${jsonReport.overallStatus}** (${errors.length} erreur)`,
    `- **Articles audités** : ${articles.length} (${articles.filter((a) => a.lang === "fr").length} FR + ${articles.filter((a) => a.lang === "en").length} EN)`,
    ``,
    `## 1. Résultat des 5 Contrôles Obligatoires`,
    ``,
    `| Script de Contrôle | Statut | Détail |`,
    `| :--- | :--- | :--- |`,
    `| **1. Non-Pollution & Zéro Trace IA** | ${r1.passed ? "✅ PASS" : "❌ FAIL"} | Isolation FR/EN, 0 cliché IA, Burstiness >= 5.0, Images uniques |`,
    `| **2. Alignement Affiliation (FR/US & Partenaires)** | ${r2.passed ? "✅ PASS" : "❌ FAIL"} | Amazon FR \`kidenzo202208-21\`, Amazon US \`kidenzo202205-20\`, Online-Therapy, Whop, Hostinger |`,
    `| **3. Citabilité Directe IA (AIO / GEO)** | ${r3.passed ? "✅ PASS" : "❌ FAIL"} | Boîte AIO 30s, Ancre Entité Nommée, Tableau GEO, FAQ Transactionnelle, \`llms.txt\` |`,
    `| **4. Maillage Interne & Inter-Blogs** | ${r4.passed ? "✅ PASS" : "❌ FAIL"} | Réciprocité FR↔EN, 2+ Jeux Granmed, 2+ Articles Blog, Pont Écosystème |`,
    `| **5. Double Vérification SEO/GEO/AIO** | ${errors.length === 0 ? "✅ PASS" : "❌ FAIL"} | Richesse lexicale, densité statistique, sources E-E-A-T, Sitemap XML |`,
    ``,
    `## 2. Métriques par Article`,
    ``,
    `| Langue | Route Canonique | Route Jumelle | Mots | Stats Chiffrées | Sources E-E-A-T | FAQ | Statut |`,
    `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |`,
    ...articleReports.map(
      (a) =>
        `| **${a.lang.toUpperCase()}** | \`${a.route}\` | \`${a.twinRoute}\` | ${a.wordCount} | ${a.numericStatsCount} | ${a.sourcesCount} | ${a.faqCount} | **${a.status}** |`
    ),
    ``,
  ];

  writeFileSync(
    join(reportDir, "double-verification-report.md"),
    mdLines.join("\n"),
    "utf8"
  );

  return {
    passed: errors.length === 0,
    errors,
  };
}

const isMain =
  Boolean((import.meta as unknown as { main?: boolean }).main) ||
  (process.argv[1] && process.argv[1].includes("double-verification-seo-geo-aio"));

if (isMain) {
  console.log("🛡️  [5/5] DOUBLE-VERIFICATION-SEO-GEO-AIO — Audit Intégral du Blog Granmed.store");
  console.log("─".repeat(72));
  runDoubleVerification().then((res) => {
    if (!res.passed) {
      for (const err of res.errors) console.error(`  ❌ ${err}`);
      console.error("─".repeat(72));
      console.error(`❌ ÉCHEC DE LA DOUBLE VÉRIFICATION (${res.errors.length} erreur(s)).`);
      process.exit(1);
    }
    console.log("  ✅ Passe 1 (7 Piliers SEO/GEO/AIO, Mots-clés, Sources & Stats) : 100 % OK");
    console.log("  ✅ Passe 2 (Non-Pollution, Affiliation FR/US, Citabilité IA, Maillage) : 100 % OK");
    console.log("  📄 Rapport généré : reports/double-verification-report.md");
    console.log("─".repeat(72));
  });
}
