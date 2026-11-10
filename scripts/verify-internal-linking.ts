#!/usr/bin/env bun
/**
 * GRANMED.STORE — Script 4 : Vérification de la Logique de Maillage Interne & Inter-Blogs
 * (Réciprocité bilingue FR <-> EN alternateSlug, 2+ jeux Granmed jouables dans la bonne langue,
 *  2+ articles frères du blog dans la bonne langue, lien hub /guides, et pont inter-blogs écosystème)
 */

import { getAllBlogArticles, getBlogArticleBySlug } from "../src/lib/blog/articles";
import { GAMES, gameByRealPath } from "../src/lib/games/catalog";

const ECOSYSTEM_DOMAINS = ["friandise.store", "fonelove.com", "kidenzo.store"];

export function verifyInternalLinking(): {
  passed: boolean;
  errors: string[];
  checkedCount: number;
} {
  const articles = getAllBlogArticles();
  const errors: string[] = [];
  const validGameSlugs = new Set(GAMES.map((g) => g.slug));

  for (const article of articles) {
    const prefix = `[${article.lang.toUpperCase()} / ${article.slug}]`;
    const otherLang = article.lang === "fr" ? "en" : "fr";

    // 1. Réciprocité bilingue stricte (alternateSlug)
    const twin = getBlogArticleBySlug(article.alternateSlug, otherLang);
    if (!twin) {
      errors.push(
        `${prefix} Article jumeau introuvable en ${otherLang.toUpperCase()} pour alternateSlug="${article.alternateSlug}".`
      );
    } else if (twin.alternateSlug !== article.slug) {
      errors.push(
        `${prefix} Réciprocité alternateSlug rompue : ${article.slug} -> ${twin.slug} -> ${twin.alternateSlug}.`
      );
    }

    // 2. Validité de primaryGameId et secondaryGameId
    if (!validGameSlugs.has(article.primaryGameId)) {
      errors.push(
        `${prefix} primaryGameId invalide (absent de GAMES) : ${article.primaryGameId}`
      );
    }
    if (!validGameSlugs.has(article.secondaryGameId)) {
      errors.push(
        `${prefix} secondaryGameId invalide (absent de GAMES) : ${article.secondaryGameId}`
      );
    }

    // 3. Analyse de tous les liens dans l'article
    const combinedHtml = [
      ...article.aioSummaryBullets,
      article.contentHtml,
      ...article.faq.map((f) => f.answer),
    ].join("\n");

    const hrefRegex = /href=["']([^"']+)["']/gi;
    const linkedGamePaths = new Set<string>();
    const linkedBlogSlugs = new Set<string>();
    let hasGuidesHubLink = false;
    let hasEcosystemLink = false;

    for (const m of combinedHtml.matchAll(hrefRegex)) {
      const href = m[1];

      // Liens internes commençant par /fr/ ou /en/
      if (href.startsWith("/fr/") || href.startsWith("/en/")) {
        const linkLang = href.startsWith("/fr/") ? "fr" : "en";
        if (linkLang !== article.lang) {
          errors.push(
            `${prefix} Lien interne vers la mauvaise langue (${linkLang}) dans un article ${article.lang} : ${href}`
          );
        }

        if (href === `/${article.lang}/guides`) {
          hasGuidesHubLink = true;
        } else if (href.startsWith(`/${article.lang}/blog/`)) {
          const targetSlug = href.replace(`/${article.lang}/blog/`, "").split(/[?#]/)[0];
          if (targetSlug === article.slug) {
            errors.push(`${prefix} Lien interne auto-référentiel inutile vers soi-même : ${href}`);
          } else {
            const targetArt = getBlogArticleBySlug(targetSlug, article.lang);
            if (!targetArt) {
              errors.push(`${prefix} Lien interne vers un article de blog inexistant : ${href}`);
            } else {
              linkedBlogSlugs.add(targetSlug);
            }
          }
        } else {
          // Doit être un chemin de jeu réel valide
          const foundGame = gameByRealPath(href);
          if (!foundGame) {
            errors.push(`${prefix} Lien interne vers un chemin de jeu inconnu (404) : ${href}`);
          } else {
            linkedGamePaths.add(href);
          }
        }
      } else if (ECOSYSTEM_DOMAINS.some((d) => href.includes(d))) {
        hasEcosystemLink = true;
      }
    }

    if (linkedGamePaths.size < 2) {
      errors.push(
        `${prefix} Maillage jeux insuffisant : seulement ${linkedGamePaths.size} jeu(x) Granmed distinct(s) lié(s) (minimum 2 requis).`
      );
    }

    if (linkedBlogSlugs.size < 2) {
      errors.push(
        `${prefix} Maillage blog insuffisant : seulement ${linkedBlogSlugs.size} autre(s) article(s) du blog lié(s) (minimum 2 requis).`
      );
    }

    if (!hasGuidesHubLink) {
      errors.push(
        `${prefix} Aucun lien vers le hub /${article.lang}/guides dans contentHtml.`
      );
    }

    if (!hasEcosystemLink) {
      errors.push(
        `${prefix} Aucun lien de maillage inter-blogs vers l'écosystème (friandise.store / fonelove.com).`
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
  (process.argv[1] && process.argv[1].includes("verify-internal-linking"));

if (isMain) {
  console.log("🕸️  [4/5] VERIFY-INTERNAL-LINKING — Audit du Maillage Interne, Jeux, Bilinguisme & Inter-Blogs...");
  const res = verifyInternalLinking();
  if (!res.passed) {
    for (const err of res.errors) console.error(`  ❌ ${err}`);
    process.exit(1);
  }
  console.log(
    `  ✅ 100 % MAILLÉ : ${res.checkedCount} articles vérifiés (réciprocité FR<->EN, 2+ jeux liés, 2+ articles liés, 0 lien mort, pont inter-blogs actif).`
  );
}
