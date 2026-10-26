'use client'

import { useEffect, useMemo, useState } from 'react'
import { RotateCcw, LogOut, ChevronRight, Sparkles, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useAppStore, buildHash } from '@/lib/app-store'
import { useGameSession } from '@/lib/game-session'
import { getGame, GAMES, CATEGORY_STYLES } from '@/lib/games/catalog'
import { useGameStats } from '@/lib/progress/store'
import { useReducedMotion, shareText } from '@/lib/utils-game'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

/* ============================================================
 * FIN DE MANCHE — le cœur de la boucle de rétention :
 *  1. un bouton principal « Rejouer / Poursuivre / Manche
 *     suivante » (le jeu fournit son handler) ;
 *  2. un bouton « Quitter » bien visible (sortie de la surface
 *     de jeu + défilement vers les jeux similaires) ;
 *  3. un CTA de PARTAGE incitatif (dégradé doré, halo) avec le
 *     résultat de la manche — présent à CHAQUE fin de partie,
 *     dans les deux langues (Task 15) ;
 *  4. une recommandation SUBTILE vers un autre jeu (chip
 *     discrète, tournante selon le nombre de parties).
 * ============================================================ */

export function RoundEndActions({
  gameId,
  onReplay,
  replayLabel,
  replayIcon,
  primaryRef,
  shareResult,
  className,
}: {
  gameId: string
  /** Handler du bouton principal : rejouer, manche suivante, poursuivre… */
  onReplay: () => void
  /** Libellé du bouton principal — défaut : « Rejouer ». */
  replayLabel?: string
  replayIcon?: React.ReactNode
  /** Optionnel : focus clavier après la fin (ex. touche Entrée). */
  primaryRef?: React.RefObject<HTMLButtonElement | null>
  /** Ligne de résultat localisée à partager (ex. « Score : 320 pts en 45 s »).
   *  Sans elle, le CTA partage le jeu (titre + accroche + lien). */
  shareResult?: string
  className?: string
}) {
  const t = useT()
  const lang = useLang()
  const requestExit = useGameSession((s) => s.requestExit)
  const game = getGame(gameId)

  async function onShare() {
    sfx.play('coin', { volume: 0.6 })
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}${buildHash(lang, { type: 'game', slug: gameId })}`
        : ''
    const title = game?.title[lang] ?? 'Granmed'
    const text = shareResult
      ? `${shareResult}\n${title} — Granmed\n${url}`
      : `${title}${game ? ` — ${game.short[lang]}` : ''}\n${url}`
    const ok = await shareText(title, text)
    if (ok) toast.success(t('common.copied'))
  }

  return (
    <div className={cn('mx-auto flex w-full max-w-sm flex-col items-stretch gap-2.5', className)}>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Button
          ref={primaryRef}
          size="lg"
          className="h-12 gap-2 rounded-2xl text-base font-bold shadow-md transition-transform active:scale-[0.98]"
          onClick={() => {
            sfx.play('click')
            onReplay()
          }}
        >
          {replayIcon ?? <RotateCcw className="h-5 w-5" aria-hidden="true" />}
          {replayLabel ?? t('common.playAgain')}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-12 gap-2 rounded-2xl px-4 font-semibold active:scale-[0.98]"
          aria-label={t('game.exit')}
          title={t('game.exit')}
          onClick={() => {
            sfx.play('sweep', { volume: 0.5 })
            requestExit()
          }}
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          <span className="hidden min-[380px]:inline">{t('game.exitShort')}</span>
        </Button>
      </div>

      {/* CTA partage — incitatif : dégradé doré + halo doux, toujours présent */}
      <Button
        size="lg"
        className={cn(
          'anim-glow h-11 gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500',
          'text-base font-bold text-white shadow-lg shadow-amber-500/25 transition-transform active:scale-[0.98]',
        )}
        aria-label={shareResult ? t('common.shareScore') : t('common.shareGame')}
        onClick={onShare}
      >
        <Share2 className="h-5 w-5" aria-hidden="true" />
        {shareResult ? t('common.shareScore') : t('common.shareGame')}
      </Button>

      <NextGameChip gameId={gameId} />
    </div>
  )
}

/* ---------- Recommandation subtile : « À essayer aussi » ---------- */

export function NextGameChip({ gameId, className }: { gameId: string; className?: string }) {
  const t = useT()
  const lang = useLang()
  const navigate = useAppStore((s) => s.navigate)
  const stats = useGameStats(gameId)
  const game = getGame(gameId)

  /* Rotation déterministe : chaque partie terminée propose le suivant
   * de la liste « similar » — variété sans aléatoire frustrant. */
  const suggestion = useMemo(() => {
    if (!game) return null
    const pool = game.similar.length > 0 ? game.similar : GAMES.filter((g) => g.slug !== gameId).slice(0, 3).map((g) => g.slug)
    if (pool.length === 0) return null
    return getGame(pool[stats.plays % pool.length]) ?? getGame(pool[0])
  }, [game, gameId, stats.plays])

  if (!game || !suggestion) return null

  return (
    <div className={cn('flex flex-col items-center gap-1 pt-0.5', className)}>
      <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        {t('game.nextUp')}
      </p>
      <button
        type="button"
        onClick={() => {
          sfx.play('pop', { volume: 0.5 })
          navigate({ type: 'game', slug: suggestion.slug })
        }}
        className={cn(
          'group flex max-w-full items-center gap-2 rounded-full border bg-secondary/40 py-1 pe-2 ps-1 text-xs',
          'text-muted-foreground transition-all hover:border-primary/40 hover:bg-secondary/70 hover:text-foreground',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]',
        )}
        aria-label={`${t('game.nextUp')} : ${suggestion.title[lang]}`}
      >
        <span
          aria-hidden="true"
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm shadow-sm transition-transform group-hover:scale-110',
            CATEGORY_STYLES[suggestion.category].tile,
          )}
        >
          {suggestion.icon}
        </span>
        <span className="max-w-[11rem] truncate font-semibold">{suggestion.title[lang]}</span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </button>
    </div>
  )
}

/* ============================================================
 * CÉLÉBRATION DE VICTOIRE — overdose satisfaisant mais bref :
 * médaille qui surgit + halo doré + 1 à 3 étoiles séquencées +
 * titre. Superposition non bloquante (pointer-events-none) qui
 * s'efface d'elle-même pour laisser lire la carte de fin.
 * ============================================================ */

export function VictoryBurst({
  fire,
  stars = 3,
  title,
  sub,
  emoji = '🏆',
}: {
  /** Incrémenter pour déclencher (0 = rien). */
  fire: number
  /** 1 à 3 étoiles selon la performance. */
  stars?: number
  title?: string
  sub?: string
  emoji?: string
}) {
  const t = useT()
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)

  /* Ajustement pendant le rendu (motif React recommandé) : chaque
   * incrément de `fire` rallume la célébration. */
  const [lastFire, setLastFire] = useState(0)
  if (fire !== lastFire) {
    setLastFire(fire)
    setVisible(fire > 0)
  }

  /* Effacement automatif — la carte de fin reste lisible ensuite. */
  useEffect(() => {
    if (!visible) return
    const id = window.setTimeout(() => setVisible(false), reduce ? 900 : 1900)
    return () => window.clearTimeout(id)
  }, [visible, reduce, fire])

  if (!visible) return null

  const safeStars = Math.max(1, Math.min(3, Math.round(stars)))

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-1"
    >
      <div className={cn('absolute inset-0 bg-background/45 backdrop-blur-[2px]', reduce ? '' : 'anim-burst-fade')} />
      <div className={cn('relative flex flex-col items-center gap-1.5', reduce ? '' : 'anim-win-rise')}>
        <span className={cn('text-6xl leading-none drop-shadow-lg sm:text-7xl', reduce ? '' : 'anim-win-medal anim-win-glow')}>{emoji}</span>
        <span className="flex gap-1 text-2xl" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                'text-2xl leading-none',
                i < safeStars ? 'text-amber-400' : 'text-foreground/20',
                i < safeStars && !reduce && 'anim-win-star',
              )}
              style={i < safeStars && !reduce ? { animationDelay: `${0.18 + i * 0.16}s` } : undefined}
            >
              ★
            </span>
          ))}
        </span>
        <p className="font-display text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl bg-gradient-to-r from-amber-500 via-primary to-rose-500 bg-clip-text">
          {title ?? t('common.victory')}
        </p>
        {sub ? <p className="max-w-[16rem] text-center text-sm font-medium text-foreground/80">{sub}</p> : null}
      </div>
    </div>
  )
}
