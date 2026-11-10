#!/usr/bin/env bun
/**
 * GRANMED.STORE — Script 2 : Vérification de l'Alignement des Liens d'Affiliation
 * (Amazon FR kidenzo202208-21 pour FR, Amazon US kidenzo202205-20 pour EN, Partenaires Officiels,
 *  rel="sponsored nofollow noopener", et cohérence thématique Jeu <-> Produit)
 */

import { getAllBlogArticles } from "../src/lib/blog/articles";
import {
  AMAZON_AFFILIATE_CONFIG,
  GRANMED_AFFILIATE_CATALOG,
  PARTNER_AFFILIATE_OFFERS,
} from "../src/lib/blog/affiliate";

const VALID_PARTNER_HOSTS = [
  "go.online-therapy.com",
  "whop.com",
  "booking.stay22.com",
  "www.getyourguide.fr",
  "www.hostinger.com",
];

export function verifyAffiliateAlignment(): {
  passed: boolean;
  errors: string[];
  checkedCount: number;
} {
  const articles = getAllBlogArticles();
  const errors: string[] = [];

  for (const article of articles) {
    const prefix = `[${article.lang.toUpperCase()} / ${article.slug}]`;
    const expectedAmazon = AMAZON_AFFILIATE_CONFIG[article.lang];
    const forbiddenAmazonDomain =
      article.lang === "fr" ? "amazon.com" : "amazon.fr";
    const forbiddenAmazonTag =
      article.lang === "fr" ? "kidenzo202205-20" : "kidenzo202208-21";

    // 1. Vérifier que affiliateProductId existe et correspond au thème / jeu de l'article
    const product = GRANMED_AFFILIATE_CATALOG.find(
      (p) => p.id === article.affiliateProductId
    );
    if (!product) {
      errors.push(
        `${prefix} Produit affilié inconnu dans le catalogue : ${article.affiliateProductId}`
      );
    } else {
      const gameAligned =
        product.category === article.category ||
        product.relatedGameIds.includes(article.primaryGameId) ||
        product.relatedGameIds.includes(article.secondaryGameId);
      if (!gameAligned) {
        errors.push(
          `${prefix} Produit affilié (${product.id}) non aligné avec la catégorie (${article.category}) ou les jeux (${article.primaryGameId}, ${article.secondaryGameId}).`
        );
      }
    }

    // 2. Vérifier que partnerOfferId existe
    const partner = PARTNER_AFFILIATE_OFFERS.find(
      (p) => p.id === article.partnerOfferId
    );
    if (!partner) {
      errors.push(
        `${prefix} Offre partenaire inconnue : ${article.partnerOfferId}`
      );
    }

    // 3. Extraire tous les liens externes sponsorisés de aioSummaryBullets + contentHtml + faq
    const combinedHtml = [
      ...article.aioSummaryBullets,
      article.contentHtml,
      ...article.faq.map((f) => f.answer),
    ].join("\n");

    if (combinedHtml.includes(forbiddenAmazonDomain)) {
      errors.push(
        `${prefix} Domaine Amazon inapproprié pour la langue (${forbiddenAmazonDomain} trouvé dans un article ${article.lang.toUpperCase()}).`
      );
    }
    if (combinedHtml.includes(forbiddenAmazonTag)) {
      errors.push(
        `${prefix} Tag Amazon inapproprié pour la langue (${forbiddenAmazonTag} trouvé dans un article ${article.lang.toUpperCase()}).`
      );
    }

    const anchorRegex = /<a\s+([^>]+)>/gi;
    let amazonLinksCount = 0;
    let partnerLinksCount = 0;

    for (const match of combinedHtml.matchAll(anchorRegex)) {
      const attrs = match[1];
      const hrefMatch = /href=["']([^"']+)["']/i.exec(attrs);
      if (!hrefMatch) continue;
      const href = hrefMatch[1];

      if (href.includes("amazon.")) {
        amazonLinksCount++;
        if (!href.includes(expectedAmazon.domain)) {
          errors.push(
            `${prefix} Lien Amazon hors domaine ${expectedAmazon.domain} : ${href}`
          );
        }
        if (!href.includes(`tag=${expectedAmazon.tag}`)) {
          errors.push(
            `${prefix} Lien Amazon sans tag officiel ${expectedAmazon.tag} : ${href}`
          );
        }
        if (!/rel=["'][^"']*sponsored[^"']*["']/i.test(attrs)) {
          errors.push(
            `${prefix} Lien Amazon sans attribut rel="sponsored..." : ${href}`
          );
        }
      } else if (
        VALID_PARTNER_HOSTS.some((host) => href.includes(host))
      ) {
        partnerLinksCount++;
        if (!/rel=["'][^"']*sponsored[^"']*["']/i.test(attrs)) {
          errors.push(
            `${prefix} Lien partenaire sans attribut rel="sponsored..." : ${href}`
          );
        }
      }
    }

    if (amazonLinksCount < 3) {
      errors.push(
        `${prefix} Nombre insuffisant de liens Amazon intégrés (${amazonLinksCount} < 3 requis entre AIO box, corps, tableau et FAQ).`
      );
    }
    if (partnerLinksCount < 1) {
      errors.push(
        `${prefix} Aucun lien partenaire complémentaire (Online-Therapy / Whop / Hostinger) intégré dans l'article.`
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
  (process.argv[1] && process.argv[1].includes("verify-affiliate-alignment"));

if (isMain) {
  console.log("💰 [2/5] VERIFY-AFFILIATE-ALIGNMENT — Audit des IDs Amazon FR/US & Alignement Thématique...");
  const res = verifyAffiliateAlignment();
  if (!res.passed) {
    for (const err of res.errors) console.error(`  ❌ ${err}`);
    process.exit(1);
  }
  console.log(
    `  ✅ 100 % ALIGNÉ : ${res.checkedCount} articles vérifiés (FR -> amazon.fr kidenzo202208-21 | EN -> amazon.com kidenzo202205-20 + partenaires alignés).`
  );
}
