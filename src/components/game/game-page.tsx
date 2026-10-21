'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Sparkles, CheckCircle2, Lightbulb, CalendarCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useAppStore } from '@/lib/app-store'
import { CATEGORIES, CATEGORY_STYLES, getGame } from '@/lib/games/catalog'
import { GameLoader, useGameContent } from '@/lib/games/registry'
import { GameShell } from '@/components/game/game-shell'
import { GameErrorBoundary } from '@/components/shared/error-boundary'
import { GradientTile, DifficultyDots, GameGrid, SectionHeader } from '@/components/shared/ui-bits'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function GamePage({ slug }: { slug: string }) {
  const t = useT()
  const lang = useLang()
  const navigate = useAppStore((s) => s.navigate)
  const game = getGame(slug)
  const content = useGameContent(slug)
  const category = CATEGORIES.find((c) => c.id === game?.category)

  /* Métadonnées dynamiques (partage + historique) */
  useEffect(() => {
    if (!game) return
    const title = content ? `${game.title[lang]} · ${content.tagline[lang]}` : game.title[lang]
    document.title = `${title} | Granmed`
    const desc =
      content?.description[lang]?.[0] ??
      game.short[lang]
    let el = document.querySelector('meta[name="description"]')
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('name', 'description')
      document.head.appendChild(el)
    }
    el.setAttribute('content', desc.slice(0, 300))
  }, [game, content, lang])

  if (!game) return null
  const similar = game.similar.map((s) => getGame(s)).filter((g): g is NonNullable<typeof g> => Boolean(g))

  return (
    <article className="mx-auto w-full max-w-4xl px-4 pb-16 pt-6 sm:px-6">
      {/* Fil d'Ariane */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <button
              type="button"
              className="rounded px-1 py-0.5 hover:text-primary hover:underline"
              onClick={() => {
                sfx.play('click')
                navigate({ type: 'home' })
              }}
            >
              {t('nav.home')}
            </button>
          </li>
          <li aria-hidden="true" className="flex items-center">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <button
              type="button"
              className="rounded px-1 py-0.5 hover:text-primary hover:underline"
              onClick={() => {
                sfx.play('click')
                navigate({ type: 'category', id: game.category })
              }}
            >
              {category?.name[lang]}
            </button>
          </li>
          <li aria-hidden="true" className="flex items-center">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li aria-current="page" className="max-w-[16rem] truncate font-medium text-foreground">
            {game.title[lang]}
          </li>
        </ol>
      </nav>

      {/* En-tête du jeu */}
      <header className="mb-5 flex flex-wrap items-start gap-4">
        <GradientTile icon={game.icon} category={game.category} size="xl" className="anim-glow" />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">{game.title[lang]}</h1>
          {content ? <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{content.tagline[lang]}</p> : null}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', CATEGORY_STYLES[game.category].chip)}>
              {category?.name[lang]}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-secondary/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
              <DifficultyDots level={game.difficulty} />
              {t(`common.${['easy', 'medium', 'hard'][game.difficulty - 1]}`)}
            </span>
            {game.daily ? (
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {t('common.daily')}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {/* Plateau de jeu */}
      <GameErrorBoundary>
        <GameShell gameId={slug}>
          <GameLoader slug={slug} />
        </GameShell>
      </GameErrorBoundary>

      {/* ---- Contenu éditorial (SEO / AIO / GEO) ---- */}
      {content ? (
        <div className="mt-12 space-y-12">
          <section aria-labelledby="about-game">
            <SectionHeader id="about-game" title={t('game.about')} />
            <div className="space-y-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
              {content.description[lang].map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section aria-labelledby="howto-game">
            <SectionHeader id="howto-game" title={t('game.howToPlay')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-card p-4 sm:p-5">
                <h3 className="mb-3 font-display font-bold">{t('common.rules')}</h3>
                <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                  {content.rules[lang].map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ol>
              </div>
              <div className="rounded-2xl border bg-card p-4 sm:p-5">
                <h3 className="mb-3 font-display font-bold">{t('game.controls')}</h3>
                <ul className="space-y-2 text-sm leading-relaxed">
                  {content.controls[lang].map((c, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="features-game">
            <SectionHeader id="features-game" title={t('game.features')} />
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {content.features[lang].map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 rounded-xl border bg-card p-3.5 text-sm">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="tips-game">
            <SectionHeader id="tips-game" title={t('game.tips')} />
            <ul className="space-y-2.5">
              {content.tips[lang].map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 rounded-xl bg-secondary/50 p-3.5 text-sm">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="faq-game">
            <SectionHeader id="faq-game" title={t('game.faq')} />
            <Accordion type="single" collapsible className="rounded-2xl border bg-card px-4">
              {content.faq[lang].map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-semibold sm:text-base">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {similar.length > 0 ? (
            <section aria-labelledby="similar-game">
              <SectionHeader id="similar-game" title={t('game.similar')} />
              <GameGrid games={similar} />
            </section>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
