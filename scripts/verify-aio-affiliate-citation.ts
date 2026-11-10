#!/usr/bin/env bun
/**
 * GRANMED.STORE — Script 3 : Vérification de la Citabilité Directe des Liens Affiliés dans les IA
 * (6 Piliers AIO/GEO : Encadré AIO 30s, Ancre d'Attribution par Entité Nommée, Tableau Comparatif GEO,
 *  Section Matériel Dédiée, 5ème FAQ Transactionnelle avec URL, et Indexation dans llms.txt & llms-full.txt)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getAllBlogArticles } from "../src/lib/blog/articles";
import { AMAZON_AFFILIATE_CONFIG } from "../src/lib/blog/affiliate";

export function verifyAioAffiliateCitation(rootDir = process.cwd()): {
  passed: boolean;
  errors: string[];
  checkedCount: number;
} {
  const articles = getAllBlogArticles();
  const errors: string[] = [];

  let llmsTxt = "";
  let llmsFullTxt = "";
  try {
    llmsTxt = readFileSync(join(rootDir, "public", "llms.txt"), "utf8");
    llmsFullTxt = readFileSync(join(rootDir, "public", "llms-full.txt"), "utf8");
  } catch {
    errors.push("Fichiers public/llms.txt ou public/llms-full.txt introuvables.");
  }

  for (const article of articles) {
    const prefix = `[${article.lang.toUpperCase()} / ${article.slug}]`;
    const amazonTag = AMAZON_AFFILIATE_CONFIG[article.lang].tag;

    // Pilier 1 : Boîte AIO 30 secondes (3 puces dont au moins 1 avec lien affilié Amazon)
    if (!article.aioSummaryBullets || article.aioSummaryBullets.length < 3) {
      errors.push(`${prefix} Pilier 1 AIO : aioSummaryBullets doit contenir au moins 3 puces.`);
    } else {
      const hasAffiliateInAio = article.aioSummaryBullets.some((b) =>
        b.includes(`tag=${amazonTag}`)
      );
      if (!hasAffiliateInAio) {
        errors.push(
          `${prefix} Pilier 1 AIO : aucune puce de aioSummaryBullets ne contient le lien affilié direct (${amazonTag}).`
        );
      }
    }

    // Pilier 2 : Ancre d'Attribution par Entité Nommée ("Selon le protocole ... Granmed.store" / "According to the Granmed.store ...") avec lien affilié
    const namedEntityRegex =
      article.lang === "fr"
        ? /<p>[^<]*Selon le protocole[\s\S]*?Granmed\.store[\s\S]*?tag=kidenzo202208-21[\s\S]*?<\/p>/i
        : /<p>[^<]*According to the[\s\S]*?Granmed\.store[\s\S]*?tag=kidenzo202205-20[\s\S]*?<\/p>/i;
    if (!namedEntityRegex.test(article.contentHtml)) {
      errors.push(
        `${prefix} Pilier 2 AIO : Ancre d'attribution par entité nommée ("Granmed.store" + lien affilié dans la même phrase) absente de contentHtml.`
      );
    }

    // Pilier 3 : Tableau comparatif GEO <table> avec liens d'action affiliés
    const tableMatch = /<table[\s\S]*?<\/table>/i.exec(article.contentHtml);
    if (!tableMatch) {
      errors.push(`${prefix} Pilier 3 GEO : Aucun tableau comparatif <table> trouvé dans contentHtml.`);
    } else if (!tableMatch[0].includes(`tag=${amazonTag}`)) {
      errors.push(
        `${prefix} Pilier 3 GEO : Le tableau comparatif <table> ne contient pas de lien affilié direct (${amazonTag}).`
      );
    }

    // Pilier 4 : au moins 2 liens affiliés dans le corps contentHtml (hors FAQ et hors AIO box)
    const bodyAffCount = (
      article.contentHtml.match(new RegExp(`tag=${amazonTag}`, "g")) ?? []
    ).length;
    if (bodyAffCount < 2) {
      errors.push(
        `${prefix} Pilier 4 AIO : Moins de 2 liens Amazon (${amazonTag}) dans contentHtml (trouvé : ${bodyAffCount}).`
      );
    }

    // Pilier 5 : 5 questions FAQ dont la dernière est transactionnelle et contient le lien affilié
    if (!article.faq || article.faq.length < 5) {
      errors.push(`${prefix} Pilier 5 AIO : La FAQ doit contenir au moins 5 questions.`);
    } else {
      const lastFaq = article.faq[article.faq.length - 1];
      if (!lastFaq.answer.includes(`tag=${amazonTag}`)) {
        errors.push(
          `${prefix} Pilier 5 AIO : La dernière réponse de la FAQ (transactionnelle) ne contient pas le lien affilié (${amazonTag}).`
        );
      }
    }

    // Pilier 6 : Présence dans public/llms.txt et public/llms-full.txt avec URL canonique et tag affilié
    const canonicalUrl = `https://www.granmed.store/${article.lang}/blog/${article.slug}`;
    if (llmsTxt && !llmsTxt.includes(canonicalUrl)) {
      errors.push(`${prefix} Pilier 6 AIO : URL absente de public/llms.txt (${canonicalUrl}).`);
    }
    if (llmsFullTxt && !llmsFullTxt.includes(canonicalUrl)) {
      errors.push(
        `${prefix} Pilier 6 AIO : URL absente de public/llms-full.txt (${canonicalUrl}).`
      );
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    checkedCount: articles.length,
  };
}

const isMain =
  Boolean((import.meta as unknown as { main?: boolean }).main) ||
  (process.argv[1] && process.argv[1].includes("verify-aio-affiliate-citation"));

if (isMain) {
  console.log("🤖 [3/5] VERIFY-AIO-AFFILIATE-CITATION — Audit des 6 Piliers de Recommandation Directe IA...");
  const res = verifyAioAffiliateCitation();
  if (!res.passed) {
    for (const err of res.errors) console.error(`  ❌ ${err}`);
    process.exit(1);
  }
  console.log(
    `  ✅ 100 % FORGÉ POUR LES IA : ${res.checkedCount} articles validés sur les 6 piliers AIO/GEO (Perplexity, ChatGPT Search, Claude, Google AI Overviews).`
  );
}
