'use client'

import { ChevronRight, ChevronLeft, Clock, CalendarDays, BookOpen } from 'lucide-react'
import { useT, useLang } from '@/lib/i18n'
import { GUIDES, GUIDES_BY_SLUG } from '@/lib/content/guides'
import { getBlogArticlesByLang } from '@/lib/blog/articles'
import { SectionHeader } from '@/components/shared/ui-bits'
import { HashLink } from '@/components/shared/hash-link'
import { Separator } from '@/components/ui/separator'

export function GuidesView() {
  const t = useT()
  const lang = useLang()
  const blogArticles = getBlogArticlesByLang(lang)

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 pt-6 sm:px-6 space-y-12">
      <div>
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1">
            <li>
              <HashLink view={{ type: 'home' }} className="rounded px-1 py-0.5 text-inherit hover:text-primary hover:underline">
                {t('nav.home')}
              </HashLink>
            </li>
            <li aria-hidden="true" className="flex items-center"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="font-medium text-foreground">{t('nav.guides')}</li>
          </ol>
        </nav>

        <SectionHeader as="h1" icon="📚" title={t('nav.guides')} sub={t('home.guidesSub')} />

        <div className="space-y-4">
          {GUIDES.map((g) => (
            <HashLink
              key={g.slug}
              view={{ type: 'guide', slug: g.slug }}
              className="group flex w-full items-start gap-4 rounded-2xl border bg-card p-5 text-left text-inherit no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="text-4xl transition-transform group-hover:scale-110" aria-hidden="true">{g.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-bold leading-snug">{g.title[lang]}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{g.description[lang]}</span>
                <span className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> {g.readMinutes} min</span>
                  <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {g.date}</span>
                </span>
              </span>
              <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </HashLink>
          ))}
        </div>
      </div>

      <section aria-label={lang === 'fr' ? 'Dossiers du Blog Neuro-Cognitif' : 'Neuro-Cognitive Blog Articles'} className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {lang === 'fr' ? '🧠 Dossiers Approfondis du Blog Granmed' : '🧠 In-Depth Granmed Blog Articles'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {lang === 'fr'
                ? 'Protocoles scientifiques, astuces de champions et matériel d’entraînement cérébral vérifié.'
                : 'Science-backed protocols, winning strategies, and verified off-screen brain-training gear.'}
            </p>
          </div>
          <a
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-2 min-h-[52px] px-5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-sm hover:opacity-95 transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <span>{lang === 'fr' ? 'Voir tout le Blog →' : 'View Full Blog →'}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {blogArticles.map((article) => (
            <a
              key={article.id}
              href={`/${article.lang}/blog/${article.slug}`}
              className="group flex flex-col justify-between rounded-2xl border-2 border-border hover:border-primary/50 bg-card p-5 shadow-sm transition-all"
            >
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
                  {article.categoryLabel}
                </span>
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-bold text-primary">
                <span>{article.readTime}</span>
                <span>{lang === 'fr' ? 'Lire le dossier →' : 'Read guide →'}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

export function GuideView({ slug }: { slug: string }) {
  const t = useT()
  const lang = useLang()
  const guide = GUIDES_BY_SLUG[slug]

  if (!guide) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="font-display text-2xl font-bold">{t('misc.notFound')}</p>
        <p className="mt-2 text-muted-foreground">{t('misc.notFoundSub')}</p>
      </div>
    )
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li><HashLink view={{ type: 'home' }} className="rounded px-1 py-0.5 text-inherit hover:text-primary hover:underline">{t('nav.home')}</HashLink></li>
          <li aria-hidden="true" className="flex items-center"><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><HashLink view={{ type: 'guides' }} className="rounded px-1 py-0.5 text-inherit hover:text-primary hover:underline">{t('nav.guides')}</HashLink></li>
          <li aria-hidden="true" className="flex items-center"><ChevronRight className="h-3.5 w-3.5" /></li>
          <li aria-current="page" className="max-w-[14rem] truncate font-medium text-foreground">{guide.title[lang]}</li>
        </ol>
      </nav>

      <header className="mb-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl" aria-hidden="true">{guide.icon}</span>
          <div>
            <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{guide.title[lang]}</h1>
            <p className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> {guide.readMinutes} min</span>
              <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {guide.date}</span>
            </p>
          </div>
        </div>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{guide.description[lang]}</p>
      </header>

      <Separator className="mb-8" />

      <div className="space-y-8">
        {guide.sections[lang].map((s, i) => (
          <section key={i} aria-labelledby={`gs-${i}`}>
            <h2 id={`gs-${i}`} className="mb-3 font-display text-xl font-bold">
              {i + 1}. {s.h}
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
              {s.p.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border bg-secondary/40 p-5 text-center">
        <HashLink
          view={{ type: 'guides' }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground no-underline transition-transform hover:scale-105"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {t('nav.guides')}
        </HashLink>
      </div>
    </article>
  )
}
