'use client'

import { CalendarCheck, Flame, Heart, Play, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useAppStore } from '@/lib/app-store'
import { useT, useLang } from '@/lib/i18n'
import { CATEGORY_STYLES, getGame, type GameDef } from '@/lib/games/catalog'
import { useIsFavorite, useProfileStore } from '@/lib/progress/store'
import { useHydrated } from '@/lib/utils-game'
import { GamePreview } from '@/components/shared/game-preview'

/** Vignette emoji colorée par catégorie. */
export function GradientTile({
  icon,
  category,
  size = 'md',
  className,
}: {
  icon: string
  category: GameDef['category']
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizes = {
    sm: 'h-9 w-9 text-lg rounded-xl',
    md: 'h-12 w-12 text-2xl rounded-2xl',
    lg: 'h-16 w-16 text-3xl rounded-2xl',
    xl: 'h-20 w-20 text-4xl rounded-3xl',
  }
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center bg-gradient-to-br shadow-inner',
        CATEGORY_STYLES[category].tile,
        sizes[size],
        className,
      )}
    >
      <span className="drop-shadow-sm">{icon}</span>
    </div>
  )
}

/** Points de difficulté (●●○). */
export function DifficultyDots({ level, className }: { level: 1 | 2 | 3; className?: string }) {
  const t = useT()
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} title={t(`common.${['easy', 'medium', 'hard'][level - 1]}`)}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={cn('h-1.5 w-1.5 rounded-full', i <= level ? 'bg-foreground/60' : 'bg-foreground/15')} />
      ))}
    </span>
  )
}

/** Petit chip statistique (score, temps…). */
export function StatChip({ icon, label, value, className }: { icon?: string; label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 items-center gap-1.5 rounded-full bg-secondary/70 px-3 py-1.5 text-sm font-semibold', className)}>
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="truncate tabular-nums text-foreground">{value}</span>
    </div>
  )
}

/** Titre de section standardisé. */
export function SectionHeader({
  icon,
  title,
  sub,
  action,
  id,
  as = 'h2',
}: {
  icon?: string
  title: string
  sub?: string
  action?: React.ReactNode
  id?: string
  as?: 'h1' | 'h2'
}) {
  const Heading = as
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <Heading id={id} className="flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {icon ? <span aria-hidden="true">{icon}</span> : null}
          {title}
        </Heading>
        {sub ? <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">{sub}</p> : null}
      </div>
      {action}
    </div>
  )
}

/** Cœur favori réutilisable. */
export function FavoriteHeart({ gameId, className }: { gameId: string; className?: string }) {
  const t = useT()
  const hydrated = useHydrated()
  const fav = useIsFavorite(gameId)
  const toggle = useProfileStore((s) => s.toggleFavorite)
  return (
    <button
      type="button"
      aria-label={fav ? t('game.favoriteRemove') : t('game.favoriteAdd')}
      aria-pressed={fav}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        sfx.play('pop', { volume: 0.6 })
        toggle(gameId)
      }}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary',
        className,
      )}
    >
      <Heart className={cn('h-5 w-5 transition-all', fav && hydrated ? 'fill-primary text-primary scale-110' : '')} />
    </button>
  )
}

/** Carte de jeu — utilisée sur l'accueil, catégories, favoris, jeux similaires.
 *  Zone d'aperçu animée propre à chaque jeu + reflet balayant + bouton
 *  « Jouer » qui apparaît au survol (toujours visible en coin sur tactile). */
export function GameCard({ game, className }: { game: GameDef; className?: string }) {
  const lang = useLang()
  const t = useT()
  const navigate = useAppStore((s) => s.navigate)
  const stats = useProfileStore((s) => s.profile.games[game.slug]?.plays ?? 0)
  const open = () => {
    sfx.play('click')
    navigate({ type: 'game', slug: game.slug })
  }
  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`${game.title[lang]} — ${t('common.play')}`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      }}
      className={cn(
        'gc-card group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_44px_-18px_rgb(0_0_0/0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
    >
      {/* ===== Aperçu animé ===== */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.08]">
          <GamePreview slug={game.slug} className="h-full w-full" />
        </div>
        {/* fondu doux vers le contenu */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card via-card/50 to-transparent" />
        {/* pastille défi quotidien */}
        {game.daily ? (
          <span
            title={t('common.daily')}
            className="absolute left-2.5 top-2.5 z-20 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm"
          >
            <CalendarCheck className="h-3 w-3" aria-hidden="true" />
            {t('common.daily')}
          </span>
        ) : null}
        {/* favori */}
        <FavoriteHeart
          gameId={game.slug}
          className="absolute right-1.5 top-1.5 z-20 h-9 w-9 rounded-full bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 hover:text-white"
        />
        {/* reflet balayant au survol */}
        <span className="gc-shine pointer-events-none absolute" aria-hidden="true" />
        {/* bouton Jouer (survol / focus ; pastille en coin sur tactile) */}
        <span className="gc-play-overlay" aria-hidden="true">
          <span className="gc-play-btn flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 font-display text-sm font-extrabold text-neutral-900 shadow-2xl">
            <Play className="h-4 w-4 fill-neutral-900" aria-hidden="true" />
            {t('common.play')}
          </span>
        </span>
      </div>

      {/* ===== Contenu ===== */}
      <div className="flex flex-1 flex-col gap-1.5 p-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-display text-base font-bold leading-tight sm:text-lg">{game.title[lang]}</h3>
          <DifficultyDots level={game.difficulty} className="mt-1.5 shrink-0" />
        </div>
        <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug text-muted-foreground">{game.short[lang]}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
          <span className={cn('min-w-0 truncate rounded-full px-2.5 py-0.5 text-xs font-semibold', CATEGORY_STYLES[game.category].chip)}>
            {t(`cat.${game.category}`)}
          </span>
          {stats > 0 ? (
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {stats}
            </span>
          ) : game.popularity >= 90 ? (
            <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400">
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              Top
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/** Grille de cartes responsive. */
export function GameGrid({ games, className }: { games: GameDef[]; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {games.map((g) => (
        <GameCard key={g.slug} game={g} />
      ))}
    </div>
  )
}

/** État vide illustré. */
export function EmptyState({ icon = '🍂', title, sub }: { icon?: string; title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-card/50 px-6 py-10 text-center">
      <span className="text-4xl" aria-hidden="true">
        {icon}
      </span>
      <p className="font-display font-bold">{title}</p>
      {sub ? <p className="max-w-sm text-sm text-muted-foreground">{sub}</p> : null}
    </div>
  )
}

export function gameTitle(slug: string, lang: 'fr' | 'en'): string {
  return getGame(slug)?.title[lang] ?? slug
}
