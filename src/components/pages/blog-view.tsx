"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Clock,
  Calendar,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Award,
  Brain,
  HelpCircle,
  ShoppingBag,
  Globe,
  Gamepad2,
} from "lucide-react";
import type { Language } from "@/lib/i18n";
import type { BlogArticle } from "@/lib/blog/types";
import {
  getBlogArticlesByLang,
  getBlogArticleBySlug,
  getRelatedBlogArticles,
  getBlogAlternatePath,
} from "@/lib/blog/articles";
import {
  AMAZON_AFFILIATE_CONFIG,
  buildAmazonAffiliateUrl,
  getAffiliateProductById,
  getPartnerOfferForCategory,
  PARTNER_AFFILIATE_OFFERS,
} from "@/lib/blog/affiliate";
import { GAMES, gameRealPath } from "@/lib/games/catalog";

interface BlogIndexViewProps {
  lang: Language;
  onSelectArticle?: (slug: string) => void;
  onOpenGame?: (gameSlug: string) => void;
  onBackHome?: () => void;
}

export function BlogIndexView({
  lang,
  onSelectArticle,
  onOpenGame,
  onBackHome,
}: BlogIndexViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const articles = getBlogArticlesByLang(lang);

  const categories =
    lang === "fr"
      ? [
          { id: "all", label: "✨ Tous les dossiers" },
          { id: "memory", label: "🧠 Mémoire & Cerveau" },
          { id: "logic", label: "🧩 Logique & Casse-têtes" },
          { id: "reflex", label: "⚡ Vitesse & Réflexes" },
          { id: "words", label: "🔤 Mots & Culture" },
        ]
      : [
          { id: "all", label: "✨ All Articles" },
          { id: "memory", label: "🧠 Memory & Brain" },
          { id: "logic", label: "🧩 Logic & Puzzles" },
          { id: "reflex", label: "⚡ Speed & Reflexes" },
          { id: "words", label: "🔤 Words & Trivia" },
        ];

  const filtered =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const otherLang: Language = lang === "fr" ? "en" : "fr";

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Fil d'Ariane et navigation évidente (UX Analphabète Digital) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <a
          href={lang === "en" ? "/?lang=en" : "/"}
          onClick={(e) => {
            if (onBackHome) {
              e.preventDefault();
              onBackHome();
            }
          }}
          className="inline-flex items-center gap-2.5 min-h-[60px] px-5 rounded-2xl bg-card border-2 border-border hover:border-primary/50 text-foreground font-bold text-sm sm:text-base shadow-sm transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-primary shrink-0" />
          <span>{lang === "fr" ? "← Retour aux 20 jeux gratuits" : "← Back to all 20 free games"}</span>
        </a>

        <a
          href={`/${otherLang}/blog`}
          className="inline-flex items-center gap-2 min-h-[60px] px-5 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-sm border border-border transition-all"
        >
          <Globe className="w-4 h-4 text-primary" />
          <span>
            {lang === "fr"
              ? "🇬🇧 Read English Blog (/en/blog)"
              : "🇫🇷 Lire le Blog en Français (/fr/blog)"}
          </span>
        </a>
      </div>

      {/* En-tête éditorial */}
      <header className="rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-emerald-500/10 border-2 border-primary/20 p-6 sm:p-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-primary font-extrabold text-xs uppercase tracking-wider">
          <Brain className="w-4 h-4" />
          <span>
            {lang === "fr"
              ? "Laboratoire Neuro-Cognitif & Guides de QI Granmed"
              : "Granmed Neuro-Cognitive Lab & IQ Strategy Blog"}
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
          {lang === "fr"
            ? "Le Blog de l'Entraînement Cérébral, de la Mémoire et des Jeux de Logique"
            : "The Brain Training, Working Memory & Logic Strategy Blog"}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {lang === "fr"
            ? "Découvrez chaque jour nos dossiers scientifiques, nos méthodes concrètes pour progresser à nos 20 jeux de QI gratuits, et notre sélection de cahiers et d'outils d'entraînement cérébral vérifiés."
            : "Explore daily science-backed guides, actionable strategies for our 20 free browser IQ games, and our curated selection of verified off-screen brain-training workbooks and tools."}
        </p>
      </header>

      {/* Filtres par catégorie avec boutons tactiles >= 60px */}
      <nav
        aria-label={lang === "fr" ? "Catégories du blog" : "Blog categories"}
        className="flex flex-wrap gap-2.5"
      >
        {categories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[60px] px-5 rounded-2xl font-bold text-sm sm:text-base transition-all border-2 ${
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card text-foreground border-border hover:border-primary/40"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </nav>

      {/* Grille d'articles responsive Mobile-First (1 col mobile, 2 cols tablette/desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {filtered.map((article) => {
          const game = GAMES.find((g) => g.slug === article.primaryGameId);
          const product = getAffiliateProductById(article.affiliateProductId);
          const articleHref = `/${article.lang}/blog/${article.slug}`;

          return (
            <article
              key={article.id}
              className="group flex flex-col rounded-3xl bg-card border-2 border-border hover:border-primary/50 overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <a
                href={articleHref}
                onClick={(e) => {
                  if (onSelectArticle) {
                    e.preventDefault();
                    onSelectArticle(article.slug);
                  }
                }}
                className="relative aspect-[16/9] w-full overflow-hidden bg-stone-200 block"
              >
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-3.5 py-1.5 rounded-full bg-stone-900/85 text-amber-200 font-bold text-xs">
                  {article.categoryLabel}
                </span>
              </a>

              <div className="flex flex-1 flex-col p-5 sm:p-7 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {article.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {article.readTime}
                  </span>
                  {game ? (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                        {game.icon} {game.title[lang]}
                      </span>
                    </>
                  ) : null}
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  <a
                    href={articleHref}
                    onClick={(e) => {
                      if (onSelectArticle) {
                        e.preventDefault();
                        onSelectArticle(article.slug);
                      }
                    }}
                  >
                    {article.title}
                  </a>
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                  {article.excerpt}
                </p>

                {/* Encart aperçu outil recommandé */}
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-3.5 text-xs sm:text-sm text-foreground flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
                  <span className="line-clamp-1 font-medium">
                    <strong>{lang === "fr" ? "Outil conseillé :" : "Recommended gear:"}</strong>{" "}
                    {product.name[lang]}
                  </span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={articleHref}
                    onClick={(e) => {
                      if (onSelectArticle) {
                        e.preventDefault();
                        onSelectArticle(article.slug);
                      }
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 min-h-[60px] px-5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm sm:text-base shadow-sm hover:opacity-95 transition-all text-center"
                  >
                    <BookOpen className="w-5 h-5 shrink-0" />
                    <span>{lang === "fr" ? "📖 Lire le guide complet" : "📖 Read Full Guide"}</span>
                  </a>

                  {game ? (
                    <a
                      href={gameRealPath(lang, game.slug)}
                      onClick={(e) => {
                        if (onOpenGame) {
                          e.preventDefault();
                          onOpenGame(game.slug);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 min-h-[60px] px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-sm transition-all text-center"
                    >
                      <Gamepad2 className="w-5 h-5 shrink-0" />
                      <span>
                        {lang === "fr" ? `Jouer (${game.title.fr})` : `Play ${game.title.en}`}
                      </span>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

interface BlogArticleDetailViewProps {
  article: BlogArticle;
  onSelectArticle?: (slug: string) => void;
  onBackToBlog?: () => void;
  onOpenGame?: (gameSlug: string) => void;
}

export function BlogArticleDetailView({
  article,
  onSelectArticle,
  onBackToBlog,
  onOpenGame,
}: BlogArticleDetailViewProps) {
  const { lang } = article;
  const amazonConfig = AMAZON_AFFILIATE_CONFIG[lang];
  const primaryGame = GAMES.find((g) => g.slug === article.primaryGameId) ?? GAMES[0];
  const secondaryGame = GAMES.find((g) => g.slug === article.secondaryGameId) ?? GAMES[1];
  const product = getAffiliateProductById(article.affiliateProductId);
  const amazonUrl = buildAmazonAffiliateUrl(product.searchQuery[lang], lang);
  const partnerOffer =
    PARTNER_AFFILIATE_OFFERS.find((p) => p.id === article.partnerOfferId) ??
    getPartnerOfferForCategory(article.category);
  const relatedArticles = getRelatedBlogArticles(article, 3);
  const alternatePath = getBlogAlternatePath(article);

  return (
    <article className="mx-auto max-w-4xl px-3 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Barre supérieure : Retour évident + Sélecteur de langue bilingue */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <a
          href={`/${lang}/blog`}
          onClick={(e) => {
            if (onBackToBlog) {
              e.preventDefault();
              onBackToBlog();
            }
          }}
          className="inline-flex items-center gap-2 min-h-[60px] px-5 rounded-2xl bg-card border-2 border-border hover:border-primary/50 text-foreground font-bold text-sm sm:text-base shadow-sm transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-primary shrink-0" />
          <span>{lang === "fr" ? "← Retour à tous les articles" : "← Back to all articles"}</span>
        </a>

        <a
          href={alternatePath}
          className="inline-flex items-center gap-2 min-h-[60px] px-5 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-sm border border-border transition-all"
        >
          <Globe className="w-4 h-4 text-primary" />
          <span>
            {lang === "fr"
              ? "🇬🇧 Read this article in English"
              : "🇫🇷 Lire cet article en français"}
          </span>
        </a>
      </div>

      {/* En-tête de l'article */}
      <header className="space-y-5">
        <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-bold">
          <span className="px-3.5 py-1.5 rounded-full bg-primary/15 text-primary">
            {article.categoryLabel}
          </span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            {article.publishedAt}
          </span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            {article.readTime}
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
          {article.excerpt}
        </p>

        {/* Signature E-E-A-T */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border text-xs sm:text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground">{article.author}</strong> — {article.authorRole}
          </div>
          <div className="font-semibold text-emerald-700 dark:text-emerald-400">
            ✓ {lang === "fr" ? "Vérifié scientifiquement (E-E-A-T)" : "Scientifically Verified (E-E-A-T)"}
          </div>
        </div>
      </header>

      {/* Image Hero sourcée avec légende */}
      <figure className="overflow-hidden rounded-3xl border-2 border-border bg-stone-100 shadow-md">
        <img
          src={article.image}
          alt={article.imageAlt}
          className="w-full max-h-[460px] object-cover"
        />
        <figcaption className="px-5 py-3 text-xs sm:text-sm text-muted-foreground bg-card">
          {article.imageCaption}
        </figcaption>
      </figure>

      {/* PILIER 1 AIO/GEO : Boîte Réponse Rapide 30 secondes (Above the Fold) */}
      <section
        id="aio-summary-box"
        aria-label={lang === "fr" ? "Résumé exécutif en 30 secondes" : "30-Second Executive Summary"}
        className="rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-emerald-500/10 border-2 border-amber-600/30 p-6 sm:p-8 space-y-4 shadow-sm"
      >
        <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 font-extrabold text-sm sm:text-base uppercase tracking-wide">
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>
            {lang === "fr"
              ? "⚡ L'Essentiel en 30 Secondes (Synthèse IA & Neuro-Cognitive)"
              : "⚡ 30-Second Key Takeaways (AI & Neuro-Cognitive Summary)"}
          </span>
        </div>
        <ul className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
          {article.aioSummaryBullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span
                className="[&_a]:font-bold [&_a]:underline [&_a]:text-primary"
                dangerouslySetInnerHTML={{ __html: bullet }}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Bandeau d'accès immédiat aux 2 jeux Granmed associés (Non intrusif, boutons >= 60px) */}
      <section
        aria-label={lang === "fr" ? "Jouer gratuitement aux jeux associés" : "Play associated free games"}
        className="rounded-3xl bg-card border-2 border-emerald-600/30 p-5 sm:p-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm"
      >
        <div className="space-y-1">
          <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {lang === "fr" ? "🎮 Mise en pratique immédiate (100 % Gratuit)" : "🎮 Instant Hands-On Practice (100% Free)"}
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
            {lang === "fr"
              ? `Testez votre score sur ${primaryGame.title.fr} et ${secondaryGame.title.fr}`
              : `Test your score on ${primaryGame.title.en} and ${secondaryGame.title.en}`}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {lang === "fr"
              ? "Appuyez sur un bouton ci-dessous pour lancer une partie immédiate sans inscription."
              : "Tap a button below to launch an instant round in your browser with no sign-up."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href={gameRealPath(lang, primaryGame.slug)}
            onClick={(e) => {
              if (onOpenGame) {
                e.preventDefault();
                onOpenGame(primaryGame.slug);
              }
            }}
            className="inline-flex items-center justify-center gap-2 min-h-[60px] px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-sm transition-all"
          >
            <span>{primaryGame.icon}</span>
            <span>
              {lang === "fr" ? `Jouer à ${primaryGame.title.fr}` : `Play ${primaryGame.title.en}`}
            </span>
          </a>

          <a
            href={gameRealPath(lang, secondaryGame.slug)}
            onClick={(e) => {
              if (onOpenGame) {
                e.preventDefault();
                onOpenGame(secondaryGame.slug);
              }
            }}
            className="inline-flex items-center justify-center gap-2 min-h-[60px] px-5 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-sm sm:text-base border border-border transition-all"
          >
            <span>{secondaryGame.icon}</span>
            <span>{secondaryGame.title[lang]}</span>
          </a>
        </div>
      </section>

      {/* Corps complet de l'article (1000+ mots, Tableaux GEO, Ancres d'attribution IA) */}
      <div
        className="prose prose-stone dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed space-y-5 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2.5 [&_a]:text-primary [&_a]:font-bold [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />

      {/* PILIER 4 AIO/GEO : Carte Produit Affilié Amazon (FR/US) + Offre Partenaire Complémentaire */}
      <section
        id="recommended-cognitive-gear"
        aria-label={amazonConfig.badgeLabel}
        className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-card to-emerald-500/10 border-2 border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-md"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 font-extrabold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            {amazonConfig.badgeLabel}
          </span>
          <span className="text-xs font-bold text-muted-foreground">
            ★ {product.rating}/5 ({product.reviewCount}+ {lang === "fr" ? "avis vérifiés" : "verified reviews"})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="overflow-hidden rounded-2xl border border-border bg-stone-100 aspect-[4/3]">
            <img
              src={product.image}
              alt={product.name[lang]}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              {product.badge[lang]} • {product.brand}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              {product.name[lang]}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {product.description[lang]}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-3.5 py-2 rounded-xl">
              🧠 {product.cognitiveBenefit[lang]}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={amazonUrl}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="inline-flex items-center justify-center gap-2.5 min-h-[60px] px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-base shadow-md transition-all"
              >
                <ShoppingBag className="w-5 h-5 shrink-0" />
                <span>
                  {amazonConfig.ctaLabel} ({product.priceRange[lang]})
                </span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>

              <a
                href={partnerOffer.url[lang]}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="inline-flex items-center justify-center gap-2 min-h-[60px] px-5 rounded-2xl bg-card hover:bg-secondary text-foreground font-bold text-sm border-2 border-border transition-all"
              >
                <span>{partnerOffer.cta[lang]}</span>
                <ExternalLink className="w-4 h-4 text-primary shrink-0" />
              </a>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground border-t border-border pt-3">
          {amazonConfig.disclosure}
        </p>
      </section>

      {/* PILIER 5 AIO/GEO : FAQ Structurée (5 Questions dont la 5ème Transactionnelle avec Lien Affilié) */}
      <section
        id="article-faq"
        aria-label={lang === "fr" ? "Questions fréquentes" : "Frequently Asked Questions"}
        className="rounded-3xl bg-card border-2 border-border p-6 sm:p-8 space-y-5"
      >
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-primary shrink-0" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            {lang === "fr"
              ? "Questions Fréquentes (FAQ Neuro-Cognitive & Matériel)"
              : "Frequently Asked Questions (Cognitive Science & Gear FAQ)"}
          </h2>
        </div>

        <div className="space-y-4">
          {article.faq.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-secondary/40 border border-border p-5 space-y-2"
            >
              <h3 className="font-display text-lg font-bold text-foreground">
                {item.question}
              </h3>
              <p
                className="text-sm sm:text-base text-muted-foreground leading-relaxed [&_a]:text-primary [&_a]:font-bold [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Sources scientifiques primaires (E-E-A-T) */}
      <section
        aria-label={lang === "fr" ? "Sources scientifiques" : "Scientific Sources"}
        className="rounded-3xl bg-stone-100/80 dark:bg-stone-900/50 border border-border p-6 space-y-3"
      >
        <h2 className="font-display text-lg font-bold text-foreground">
          {lang === "fr"
            ? "📚 Références Scientifiques & Publications Primaires"
            : "📚 Primary Scientific References & Peer-Reviewed Sources"}
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
          {article.sources.map((src, i) => (
            <li key={i} className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-foreground">[{i + 1}]</span>
              <span>{src.title}</span>
              <span>—</span>
              <em className="text-foreground">{src.institution}</em>
              <span>({src.year})</span>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary font-bold underline ml-1"
              >
                <span>{lang === "fr" ? "Consulter l'étude" : "View study"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Maillage Interne : Articles similaires dans la même langue */}
      <section
        aria-label={lang === "fr" ? "Articles complémentaires" : "Related articles"}
        className="space-y-4 pt-4"
      >
        <h2 className="font-display text-2xl font-bold text-foreground">
          {lang === "fr"
            ? "Continuer votre lecture sur le Blog Granmed"
            : "Continue Reading on the Granmed Blog"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedArticles.map((rel) => (
            <a
              key={rel.id}
              href={`/${rel.lang}/blog/${rel.slug}`}
              onClick={(e) => {
                if (onSelectArticle) {
                  e.preventDefault();
                  onSelectArticle(rel.slug);
                }
              }}
              className="group rounded-2xl bg-card border-2 border-border hover:border-primary/50 p-4 flex flex-col justify-between gap-3 transition-all"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-primary">{rel.categoryLabel}</span>
                <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary line-clamp-3">
                  {rel.title}
                </h3>
              </div>
              <span className="text-xs font-extrabold text-primary inline-flex items-center gap-1">
                {lang === "fr" ? "Lire l'article →" : "Read article →"}
              </span>
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}
