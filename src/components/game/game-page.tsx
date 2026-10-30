'use client'

import { useContext, useEffect, useState } from 'react'
import {
  ChevronRight,
  ListChecks,
  CheckCircle2,
  Lightbulb,
  CalendarCheck,
  Info,
  Gamepad2,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { CATEGORIES, CATEGORY_STYLES, getGame } from '@/lib/games/catalog'
import { GameLoader, useGameContent } from '@/lib/games/registry'
import { SsrGameContentContext } from '@/lib/ssr-context'
import { GameShell } from '@/components/game/game-shell'
import { GameErrorBoundary } from '@/components/shared/error-boundary'
import { HashLink } from '@/components/shared/hash-link'
import { DifficultyDots, GameGrid, SectionHeader } from '@/components/shared/ui-bits'
import { GamePreview } from '@/components/shared/game-preview'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function GamePage({ slug }: { slug: string }) {
  const t = useT()
  const lang = useLang()
  const game = getGame(slug)
  /* Task 27 : contenu SSR de la page jeu réelle — le registre serveur importe le
   * MÊME export `content` que le module chargé à la demande côté client : zéro
   * dérive, transition invisible quand le module arrive. Garde-fou par slug :
   * après une navigation hash vers un AUTRE jeu, ce fallback ne s'applique plus
   * (comportement inchangé : sections éditoriales dès que le module arrive). */
  const loadedContent = useGameContent(slug)
  const ssrContent = useContext(SsrGameContentContext)
  const content = loadedContent ?? (ssrContent?.slug === slug ? ssrContent.content : null)
  const category = CATEGORIES.find((c) => c.id === game?.category)

  /* Métadonnées dynamiques (partage + historique) */
  useEffect(() => {
    if (!game) return
    const title = content ? `${game.title[lang]} · ${content.tagline[lang]}` : game.title[lang]
    document.title = `${title} | Granmed`
    const desc = content?.description[lang]?.[0] ?? game.short[lang]
    let el = document.querySelector('meta[name="description"]')
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('name', 'description')
      document.head.appendChild(el)
    }
    el.setAttribute('content', desc.slice(0, 300))
  }, [game, content, lang])

  /* Filet de sécurité : si le haut du plateau n'est pas visible à l'arrivée
     (petits écrans), on amène doucement le plateau à l'écran. Aucun scroll
     si l'en-tête compact suffit déjà (cas nominal mobile + desktop). */
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById('game-board')
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      if (rect.top > vh * 0.55) {
        window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - 76), behavior: 'smooth' })
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [slug])

  if (!game) return null
  const similar = game.similar.map((s) => getGame(s)).filter((g): g is NonNullable<typeof g> => Boolean(g))
  const difficultyLabel = t(`common.${['easy', 'medium', 'hard'][game.difficulty - 1]}`)

  return (
    <article className="mx-auto w-full max-w-4xl px-3 pb-16 pt-3 sm:px-6 sm:pt-6">
      {/* Fil d'Ariane (desktop uniquement — l'écran mobile va droit au jeu) */}
      <nav id="game-page-nav" aria-label="Breadcrumb" className="mb-3 hidden text-sm text-muted-foreground sm:mb-4 sm:block">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <HashLink
              view={{ type: 'home' }}
              className="rounded px-1 py-0.5 text-inherit hover:text-primary hover:underline"
            >
              {t('nav.home')}
            </HashLink>
          </li>
          <li aria-hidden="true" className="flex items-center">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <HashLink
              view={{ type: 'category', id: game.category }}
              className="rounded px-1 py-0.5 text-inherit hover:text-primary hover:underline"
            >
              {category?.name[lang]}
            </HashLink>
          </li>
          <li aria-hidden="true" className="flex items-center">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li aria-current="page" className="max-w-[16rem] truncate font-medium text-foreground">
            {game.title[lang]}
          </li>
        </ol>
      </nav>

      {/* En-tête du jeu — ultra-compact sur mobile pour que le plateau soit
          visible dès l'arrivée, sans le moindre scroll. */}
      <header id="game-page-header" className="mb-2.5 flex items-start gap-2.5 sm:mb-5 sm:gap-4">
        {/* Aperçu animé du jeu — identité visuelle vivante dès l'arrivée */}
        <div
          className="anim-glow h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-md ring-1 ring-black/10 sm:h-20 sm:w-20 sm:rounded-3xl"
          aria-hidden="true"
          onClick={() => sfx.play('click')}
        >
          <GamePreview slug={slug} className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-extrabold leading-tight tracking-tight sm:text-4xl">{game.title[lang]}</h1>
          {content ? <p className="mt-1.5 hidden text-sm text-muted-foreground sm:block sm:text-base">{content.tagline[lang]}</p> : null}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:mt-2.5 sm:gap-2">
            <span
              className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold sm:px-3 sm:py-1 sm:text-xs', CATEGORY_STYLES[game.category].chip)}
            >
              {category?.name[lang]}
            </span>
            <span
              title={difficultyLabel}
              className="flex items-center gap-1.5 rounded-full bg-secondary/70 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground sm:px-3 sm:py-1 sm:text-xs"
            >
              <DifficultyDots level={game.difficulty} />
              {difficultyLabel}
            </span>
            {game.daily ? (
              <span
                title={t('common.daily')}
                className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 sm:px-3 sm:py-1 sm:text-xs"
              >
                <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{t('common.daily')}</span>
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {/* Plateau de jeu — la pièce maîtresse, immédiatement à l'écran */}
      <GameErrorBoundary>
        <GameShell gameId={slug}>
          <GameLoader slug={slug} />
        </GameShell>
      </GameErrorBoundary>

      {/* ---- Contenu éditorial (SEO / AIO / GEO) sous boutons explicites ----
          Le texte reste dans le DOM (indéxable), mais replié derrière des
          boutons clairs pour ne jamais pousser le jeu hors de l'écran. */}
      {content ? (
        <div id="game-page-content" className="mt-8 space-y-2.5 sm:mt-12 sm:space-y-3">
          <GuideSection id="about-game" icon={Info} title={t('game.about')}>
            <div className="space-y-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
              {content.description[lang].map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </GuideSection>

          <GuideSection id="howto-game" icon={Gamepad2} title={t('game.howToPlay')}>
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
          </GuideSection>

          <GuideSection id="features-game" icon={ListChecks} title={t('game.features')}>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {content.features[lang].map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 rounded-xl border bg-card p-3.5 text-sm">
                  <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </GuideSection>

          <GuideSection id="tips-game" icon={Lightbulb} title={t('game.tips')}>
            <ul className="space-y-2.5">
              {content.tips[lang].map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 rounded-xl bg-secondary/50 p-3.5 text-sm">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </GuideSection>

          <GuideSection id="faq-game" icon={HelpCircle} title={t('game.faq')}>
            <Accordion type="single" collapsible className="rounded-2xl border bg-card px-4">
              {content.faq[lang].map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-semibold sm:text-base">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GuideSection>

          {similar.length > 0 ? (
            <section aria-labelledby="similar-game" className="pt-5 sm:pt-8">
              <SectionHeader id="similar-game" title={t('game.similar')} />
              <GameGrid games={similar} />
            </section>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

/** Section guide repliable : bouton explicite (titre + chevron), contenu
 * conservé dans le DOM (SEO/AIO/GEO) mais visuellement compacté. */
function GuideSection({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const panelId = `${id}-panel`
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-display text-base font-bold tracking-tight sm:text-lg">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            sfx.play('click', { volume: 0.4 })
            setOpen((v) => !v)
          }}
          className={cn(
            'flex min-h-[52px] w-full items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left shadow-sm transition-all hover:bg-accent/60 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.99]',
            open && 'bg-accent/40',
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">{title}</span>
          <ChevronDown
            className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300', open && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      </h2>
      <div
        id={panelId}
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </section>
  )
}
