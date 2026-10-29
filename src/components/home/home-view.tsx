'use client'

import { Flame, ArrowRight, Gamepad2, Trophy, CalendarCheck, Brain, BookOpen, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useAppStore } from '@/lib/app-store'
import { CATEGORIES, GAMES, dailyFeaturedGame, popularGames, recentGames } from '@/lib/games/catalog'
import { useTotalStats, useProfileStore, xpProgress } from '@/lib/progress/store'
import { useHydrated, todayKey } from '@/lib/utils-game'
import { GUIDES } from '@/lib/content/guides'
import { HOME_FAQ } from '@/lib/content/home-faq'
import { GameCard, GradientTile, SectionHeader, GameGrid } from '@/components/shared/ui-bits'
import { GamePreview } from '@/components/shared/game-preview'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

export function HomeView() {
  const t = useT()
  const lang = useLang()
  const navigate = useAppStore((s) => s.navigate)
  const hydrated = useHydrated()
  const totals = useTotalStats()
  const xp = useProfileStore((s) => s.profile.xp)
  const prog = xpProgress(xp)
  const dailyGame = dailyFeaturedGame(todayKey())

  const goGame = (slug: string) => {
    sfx.play('click')
    navigate({ type: 'game', slug })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      {/* ============ HERO ============ */}
      <section className="relative mt-4 overflow-hidden rounded-3xl border bg-gradient-to-br from-accent via-card to-secondary/60 p-6 shadow-sm sm:p-10" aria-labelledby="hero-title">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Brain className="h-3.5 w-3.5" aria-hidden="true" />
              {t('brand.name')} · {t('brand.tagline')}
            </p>
            <h1 id="hero-title" className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {t('home.heroTitle')}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{t('home.heroSub')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="h-12 rounded-full px-7 text-base anim-glow"
                onClick={() => {
                  sfx.play('pop')
                  goGame(dailyGame.slug)
                }}
              >
                <Gamepad2 className="h-5 w-5" aria-hidden="true" />
                {t('home.heroCta')}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-12 rounded-full px-6 text-base"
                onClick={() => {
                  sfx.play('click')
                  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {t('home.heroCta2')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <dl className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <dt className="sr-only">{t('home.statGames')}</dt>
                <dd className="font-display text-xl font-extrabold text-primary">{GAMES.length}</dd>
                <dd className="text-muted-foreground">{t('home.statGames')}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">{t('home.statLangs')}</dt>
                <dd className="font-display text-xl font-extrabold text-primary">2</dd>
                <dd className="text-muted-foreground">FR · EN</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">{t('home.statNoSignup')}</dt>
                <dd className="font-display text-xl font-extrabold text-primary">0</dd>
                <dd className="text-muted-foreground">{t('common.noSignup')}</dd>
              </div>
            </dl>
          </div>
          <div className="relative mx-auto hidden aspect-[4/3] w-full max-w-md lg:block" aria-hidden="true">
            <Image
              src="/images/hero-granmed.png"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 0px, 420px"
              className="rounded-3xl object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ============ DÉFI DU JOUR ============ */}
      <section className="mt-10" aria-labelledby="daily-title">
        <SectionHeader id="daily-title" icon="🎯" title={t('home.dailyTitle')} sub={t('home.dailySub')} />
        <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-amber-300/50 bg-gradient-to-r from-amber-50 to-orange-50 p-5 shadow-sm transition-shadow hover:shadow-md dark:border-amber-500/25 dark:from-amber-500/10 dark:to-orange-500/10 sm:p-6">
          {/* aperçu animé du jeu du jour */}
          <div
            className="hidden w-44 shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-md ring-1 ring-amber-300/40 transition-transform duration-300 hover:scale-[1.03] sm:block"
            aria-hidden="true"
            onClick={() => goGame(dailyGame.slug)}
          >
            <GamePreview slug={dailyGame.slug} className="aspect-[4/3] w-full" />
          </div>
          <GradientTile icon={dailyGame.icon} category={dailyGame.category} size="xl" className="anim-glow sm:hidden" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">{todayKey()}</p>
            <h3 className="mt-0.5 font-display text-xl font-bold sm:text-2xl">{dailyGame.title[lang]}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{dailyGame.short[lang]}</p>
          </div>
          <div className="flex items-center gap-3">
            {hydrated && totals.streak > 0 ? (
              <span className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-2 text-sm font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                <Flame className="h-4 w-4" aria-hidden="true" />
                {totals.streak} {t('common.days')}
              </span>
            ) : null}
            <Button size="lg" className="rounded-full" onClick={() => goGame(dailyGame.slug)}>
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              {t('common.play')}
            </Button>
          </div>
        </div>
      </section>

      {/* ============ POPULAIRES ============ */}
      <section className="mt-12" aria-labelledby="popular-title">
        <SectionHeader id="popular-title" icon="🔥" title={t('home.popularTitle')} />
        <GameGrid games={popularGames(6)} />
      </section>

      {/* ============ CATÉGORIES (ancre #categories) ============ */}
      <div id="categories" className="mt-14 scroll-mt-24" />
      {CATEGORIES.map((cat) => {
        const games = GAMES.filter((g) => g.category === cat.id)
        return (
          <section key={cat.id} className="mt-12" aria-labelledby={`cat-${cat.id}`}>
            <SectionHeader
              id={`cat-${cat.id}`}
              icon={cat.icon}
              title={cat.name[lang]}
              sub={cat.tagline[lang]}
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 rounded-full"
                  onClick={() => {
                    sfx.play('click')
                    navigate({ type: 'category', id: cat.id })
                  }}
                >
                  {t('home.viewAll')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              }
            />
            <p className="mb-4 hidden max-w-3xl text-sm leading-relaxed text-muted-foreground sm:block">{cat.description[lang]}</p>
            <GameGrid games={games} />
          </section>
        )
      })}

      {/* ============ PARCOURS ============ */}
      <section className="mt-14" aria-labelledby="journey-title">
        <SectionHeader id="journey-title" icon="🧭" title={t('home.journeyTitle')} sub={t('home.journeySub')} />
        <div className="grid gap-4 rounded-3xl border bg-card p-5 shadow-sm sm:grid-cols-3 sm:p-6">
          <div className="sm:col-span-2">
            {hydrated ? (
              <>
                <div className="flex items-end justify-between gap-3">
                  <p className="font-display text-lg font-bold">
                    {t('dash.level')} {prog.level}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('dash.xpToNext', { n: Math.max(0, prog.need - prog.inLevel) })}</p>
                </div>
                <div
                  className="mt-2 h-3.5 overflow-hidden rounded-full bg-secondary"
                  role="progressbar"
                  aria-valuenow={Math.round((prog.inLevel / prog.need) * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-700"
                    style={{ width: `${Math.min(100, (prog.inLevel / prog.need) * 100)}%` }}
                  />
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-secondary/50 p-3">
                    <dd className="font-display text-xl font-extrabold">{totals.plays}</dd>
                    <dt className="text-xs text-muted-foreground">{t('dash.totalPlays')}</dt>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-3">
                    <dd className="font-display text-xl font-extrabold">{totals.badges}</dd>
                    <dt className="text-xs text-muted-foreground">{t('dash.badgesCount')}</dt>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-3">
                    <dd className="font-display text-xl font-extrabold">{totals.streak}</dd>
                    <dt className="text-xs text-muted-foreground">{t('dash.streakDays')}</dt>
                  </div>
                </dl>
              </>
            ) : (
              <div className="h-32 animate-pulse rounded-xl bg-secondary/50" />
            )}
          </div>
          <div className="flex items-center justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 rounded-full px-6"
              onClick={() => {
                sfx.play('click')
                navigate({ type: 'dashboard' })
              }}
            >
              <Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
              {t('home.openJourney')}
            </Button>
          </div>
        </div>
      </section>

      {/* ============ NOUVEAUTÉS ============ */}
      <section className="mt-12" aria-labelledby="recent-title">
        <SectionHeader id="recent-title" icon="🌱" title={t('home.recentTitle')} sub={t('home.recentSub')} />
        <GameGrid games={recentGames(3)} />
      </section>

      {/* ============ GUIDES ============ */}
      <section className="mt-12" aria-labelledby="guides-title">
        <SectionHeader
          id="guides-title"
          icon="📚"
          title={t('home.guidesTitle')}
          sub={t('home.guidesSub')}
          action={
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 rounded-full"
              onClick={() => {
                sfx.play('click')
                navigate({ type: 'guides' })
              }}
            >
              {t('home.viewAll')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {GUIDES.slice(0, 4).map((g) => (
            <button
              key={g.slug}
              type="button"
              onClick={() => {
                sfx.play('click')
                navigate({ type: 'guide', slug: g.slug })
              }}
              className="group flex items-start gap-4 rounded-2xl border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring sm:p-5"
            >
              <span className="text-3xl transition-transform group-hover:scale-110" aria-hidden="true">
                {g.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-display font-bold leading-snug">{g.title[lang]}</span>
                <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">{g.description[lang]}</span>
                <span className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  {g.readMinutes} min
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mt-12" aria-labelledby="faq-title">
        <SectionHeader id="faq-title" icon="❓" title={t('home.faqTitle')} />
        <Accordion type="single" collapsible className="rounded-2xl border bg-card px-4">
          {HOME_FAQ[lang].map((item, i) => (
            <AccordionItem key={i} value={`home-faq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-semibold sm:text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ============ CONFIANCE / À PROPOS ============ */}
      <section className="mt-12 grid gap-4 sm:grid-cols-3" aria-label="Granmed">
        {[
          { icon: <ShieldCheck className="h-6 w-6 text-emerald-500" aria-hidden="true" />, key: 'trust1' },
          { icon: <Gamepad2 className="h-6 w-6 text-primary" aria-hidden="true" />, key: 'trust2' },
          { icon: <Trophy className="h-6 w-6 text-amber-500" aria-hidden="true" />, key: 'trust3' },
        ].map(({ icon, key }) => (
          <div key={key} className="rounded-2xl border bg-card p-5 shadow-sm">
            {icon}
            <h3 className="mt-3 font-display font-bold">{HOME_TRUST[key].title[lang]}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{HOME_TRUST[key].text[lang]}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

const HOME_TRUST: Record<string, { title: Record<'fr' | 'en', string>; text: Record<'fr' | 'en', string> }> = {
  trust1: {
    title: { fr: 'Respect de votre vie privée', en: 'Privacy respected' },
    text: {
      fr: 'Pas de compte, pas de pistage intrusif : votre progression reste sur votre appareil. Les contenus santé sont informatifs et sourcés.',
      en: 'No account, no intrusive tracking: your progress stays on your device. Health content is informational and sourced.',
    },
  },
  trust2: {
    title: { fr: 'Jeu immédiat, partout', en: 'Instant play, anywhere' },
    text: {
      fr: 'Mobile, tablette ou ordinateur : chaque jeu se lance en quelques secondes, en portrait comme en paysage, sans installation.',
      en: 'Mobile, tablet or desktop: every game starts in seconds, portrait or landscape, with nothing to install.',
    },
  },
  trust3: {
    title: { fr: 'Pensé pour revenir', en: 'Designed for returning' },
    text: {
      fr: 'Défis quotidiens, records personnels, succès et collections : de vraies raisons de revenir, sans mécanismes frustrants.',
      en: 'Daily challenges, personal bests, achievements and collections: real reasons to come back, with no frustrating mechanics.',
    },
  },
}
