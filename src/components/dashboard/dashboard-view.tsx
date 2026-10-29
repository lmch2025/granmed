'use client'

import { useMemo } from 'react'
import { Flame, Trophy, Gamepad2, Medal, CalendarCheck, CheckCircle2, Lock, RotateCcw, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useAppStore, buildHash } from '@/lib/app-store'
import { GAMES, getGame, dailyFeaturedGame } from '@/lib/games/catalog'
import { BADGES, BADGES_BY_ID } from '@/lib/progress/badges'
import { computeStreak, useProfileStore, useTotalStats, useIsDailyDone, xpProgress } from '@/lib/progress/store'
import { useGameContent } from '@/lib/games/registry'
import { useHydrated, todayKey, dateKeyOffset } from '@/lib/utils-game'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { HashLink } from '@/components/shared/hash-link'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { GameGrid, EmptyState, GradientTile, SectionHeader } from '@/components/shared/ui-bits'

export function DashboardView({ tab = 'overview' }: { tab?: 'overview' | 'badges' | 'records' | 'favorites' }) {
  const t = useT()
  const lang = useLang()
  const hydrated = useHydrated()
  const navigate = useAppStore((s) => s.navigate)
  const profile = useProfileStore((s) => s.profile)
  const totals = useTotalStats()
  const prog = xpProgress(profile.xp)
  const dailyGame = dailyFeaturedGame(todayKey())

  const activeTab = tab ?? 'overview'

  const dayCells = useMemo(() => {
    const set = new Set(profile.dailyLog)
    return Array.from({ length: 21 }, (_, i) => {
      const key = dateKeyOffset(i - 20)
      return { key, done: set.has(key) }
    })
  }, [profile.dailyLog])

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-16">
        <div className="h-40 animate-pulse rounded-3xl bg-secondary/50" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6">
      <SectionHeader as="h1" icon="🧭" title={t('dash.title')} sub={t('dash.sub')} />

      {/* Carte profil */}
      <div className="mb-6 rounded-3xl border bg-gradient-to-br from-accent/60 via-card to-secondary/50 p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-400 font-display text-2xl font-extrabold text-primary-foreground shadow anim-glow">
              {prog.level}
            </div>
            <div>
              <p className="font-display text-lg font-bold">
                {t('dash.level')} {prog.level}
              </p>
              <p className="text-sm text-muted-foreground">
                {profile.xp} XP · {t('dash.xpToNext', { n: Math.max(0, prog.need - prog.inLevel) })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
            <Flame className="h-4 w-4" aria-hidden="true" />
            {totals.streak} {totals.streak > 1 ? t('common.days') : t('common.day')}
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={Math.round((prog.inLevel / prog.need) * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-700" style={{ width: `${Math.min(100, (prog.inLevel / prog.need) * 100)}%` }} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { sfx.play('click', { volume: 0.5 }); navigate({ type: 'dashboard', tab: v as 'overview' }) }}>
        <TabsList className="mb-5 h-auto flex-wrap">
          <TabsTrigger value="overview" className="gap-1.5 rounded-full px-4">📊 {t('dash.overview')}</TabsTrigger>
          <TabsTrigger value="badges" className="gap-1.5 rounded-full px-4">🏅 {t('dash.badgesTab')} ({Object.keys(profile.badges).length}/{BADGES.length})</TabsTrigger>
          <TabsTrigger value="records" className="gap-1.5 rounded-full px-4">🏆 {t('dash.recordsTab')}</TabsTrigger>
          <TabsTrigger value="favorites" className="gap-1.5 rounded-full px-4">❤️ {t('dash.favTab')}</TabsTrigger>
        </TabsList>

        {/* ---------- APERÇU ---------- */}
        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={<Gamepad2 className="h-5 w-5 text-primary" aria-hidden="true" />} value={totals.plays} label={t('dash.totalPlays')} />
            <StatCard icon={<Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />} value={totals.wins} label={t('dash.totalWins')} />
            <StatCard icon={<Medal className="h-5 w-5 text-rose-500" aria-hidden="true" />} value={`${Object.keys(profile.badges).length}`} label={t('dash.badgesCount')} />
            <StatCard icon={<CalendarCheck className="h-5 w-5 text-emerald-500" aria-hidden="true" />} value={`${Object.values(profile.dailyDone).filter((d) => d === todayKey()).length}/${GAMES.filter((g) => g.daily).length}`} label={t('dash.dailiesDone')} />
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <h3 className="mb-3 font-display font-bold">{t('dash.lastDays')}</h3>
            <div className="flex flex-wrap gap-1.5">
              {dayCells.map((d) => (
                <span
                  key={d.key}
                  title={d.key}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold',
                    d.done ? 'bg-gradient-to-br from-orange-400 to-rose-500 text-white' : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {d.key.slice(8)}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display font-bold">
              <CalendarCheck className="h-5 w-5 text-amber-500" aria-hidden="true" />
              {t('dash.challengeOf', { game: dailyGame.title[lang] })}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <GradientTile icon={dailyGame.icon} category={dailyGame.category} />
              <p className="min-w-0 flex-1 text-sm text-muted-foreground">{dailyGame.short[lang]}</p>
              <Button className="rounded-full" asChild>
                <HashLink view={{ type: 'game', slug: dailyGame.slug }}>
                  {t('common.play')}
                </HashLink>
              </Button>
            </div>
            <div className="mt-4 grid gap-1.5">
              {GAMES.filter((g) => g.daily).map((g) => (
                <DailyRow key={g.slug} slug={g.slug} />
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 rounded-full text-muted-foreground">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  {t('dash.reset')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">{t('dash.reset')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('dash.resetConfirm')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-white hover:bg-destructive/90"
                    onClick={() => {
                      sfx.play('lose', { volume: 0.4 })
                      useProfileStore.getState().resetProfile()
                    }}
                  >
                    {t('common.confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TabsContent>

        {/* ---------- SUCCÈS ---------- */}
        <TabsContent value="badges" className="mt-0">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BADGES.map((b) => {
              const date = profile.badges[b.id]
              const unlocked = Boolean(date)
              return (
                <div
                  key={b.id}
                  className={cn(
                    'flex items-start gap-3 rounded-2xl border p-4 transition-all',
                    unlocked ? 'border-amber-300/60 bg-amber-50/50 dark:border-amber-500/25 dark:bg-amber-500/10' : 'border-dashed bg-card/50 opacity-75',
                  )}
                >
                  <span className={cn('text-3xl', !unlocked && 'grayscale')} aria-hidden="true">{b.icon}</span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold leading-snug">{b.name[lang]}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{b.desc[lang]}</p>
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold">
                      {unlocked ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> {date}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Lock className="h-3.5 w-3.5" aria-hidden="true" /> {b.xp > 0 ? `+${b.xp} XP` : ''}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* ---------- RECORDS ---------- */}
        <TabsContent value="records" className="mt-0">
          <RecordsList />
        </TabsContent>

        {/* ---------- FAVORIS ---------- */}
        <TabsContent value="favorites" className="mt-0">
          {profile.favorites.length === 0 ? (
            <EmptyState icon="🤍" title={t('dash.noFavorites')} />
          ) : (
            <GameGrid games={profile.favorites.map((s) => getGame(s)).filter((g): g is NonNullable<typeof g> => Boolean(g))} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 text-center">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-2 font-display text-2xl font-extrabold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function DailyRow({ slug }: { slug: string }) {
  const t = useT()
  const lang = useLang()
  const navigate = useAppStore((s) => s.navigate)
  const done = useIsDailyDone(slug)
  const game = getGame(slug)
  if (!game) return null
  return (
    <HashLink
      view={{ type: 'game', slug }}
      className={cn(
        'flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-inherit no-underline transition-colors',
        done ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'hover:bg-accent',
      )}
    >
      <span className="text-lg" aria-hidden="true">{game.icon}</span>
      <span className="min-w-0 flex-1 truncate">{game.title[lang]}</span>
      {done ? (
        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {t('common.completed')}
        </span>
      ) : (
        <span className="shrink-0 text-xs font-semibold text-amber-600 dark:text-amber-400">●</span>
      )}
    </HashLink>
  )
}

function RecordsList() {
  const t = useT()
  const lang = useLang()
  const profile = useProfileStore((s) => s.profile)
  const gamesWithRecords = GAMES.filter((g) => profile.games[g.slug]?.records && Object.keys(profile.games[g.slug].records).length > 0)

  if (gamesWithRecords.length === 0) {
    return <EmptyState icon="🏆" title={t('dash.noRecords')} />
  }

  return (
    <div className="space-y-4">
      {gamesWithRecords.map((g) => (
        <RecordGameRow key={g.slug} slug={g.slug} />
      ))}
    </div>
  )
}

function RecordGameRow({ slug }: { slug: string }) {
  const t = useT()
  const lang = useLang()
  const navigate = useAppStore((s) => s.navigate)
  const game = getGame(slug)
  const recordsRef = useProfileStore((s) => s.profile.games[slug]?.records)
  const records = recordsRef ?? {}
  const content = useGameContent(slug)
  if (!game) return null

  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="mb-2.5 flex items-center gap-3">
        <GradientTile icon={game.icon} category={game.category} size="sm" />
        <HashLink view={{ type: 'game', slug }} className="min-w-0 flex-1 truncate text-left font-display text-sm font-bold text-inherit hover:text-primary hover:underline">
          {game.title[lang]}
        </HashLink>
        <TrendingUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {Object.entries(records).map(([metric, rec]) => (
          <li key={metric} className="flex items-center justify-between gap-2 rounded-lg bg-secondary/50 px-3 py-1.5 text-sm">
            <span className="min-w-0 truncate text-muted-foreground">{content?.records?.[metric]?.[lang] ?? metric}</span>
            <span className="font-bold tabular-nums">{rec.value.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
