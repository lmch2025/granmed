'use client'

import { Heart, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useAppStore } from '@/lib/app-store'
import { useT, useLang } from '@/lib/i18n'
import { CATEGORY_STYLES, getGame, type GameDef } from '@/lib/games/catalog'
import { useIsFavorite, useProfileStore } from '@/lib/progress/store'
import { useHydrated } from '@/lib/utils-game'

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

/** Carte de jeu — utilisée sur l'accueil, catégories, favoris, jeux similaires. */
export function GameCard({ game, className }: { game: GameDef; className?: string }) {
  const lang = useLang()
  const t = useT()
  const navigate = useAppStore((s) => s.navigate)
  const stats = useProfileStore((s) => s.profile.games[game.slug]?.plays ?? 0)
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => {
        sfx.play('click')
        navigate({ type: 'game', slug: game.slug })
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          sfx.play('click')
          navigate({ type: 'game', slug: game.slug })
        }
      }}
      className={cn(
        'group relative flex cursor-pointer flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-ring',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <GradientTile icon={game.icon} category={game.category} size="lg" className="transition-transform group-hover:scale-105" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-bold leading-tight sm:text-lg">{game.title[lang]}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{game.short[lang]}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn('truncate rounded-full px-2.5 py-0.5 text-xs font-semibold', CATEGORY_STYLES[game.category].chip)}>
            {t(`cat.${game.category}`)}
          </span>
          <DifficultyDots level={game.difficulty} />
        </div>
        {stats > 0 ? (
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {stats}
          </span>
        ) : null}
        <FavoriteHeart gameId={game.slug} className="-mr-2 -mt-1 h-9 w-9" />
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
