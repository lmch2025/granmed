'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { RotateCcw, LogOut, ChevronRight, Gamepad2, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useAppStore, buildHash } from '@/lib/app-store'
import { useGameSession } from '@/lib/game-session'
import { getGame, GAMES, CATEGORY_STYLES } from '@/lib/games/catalog'
import { useGameStats } from '@/lib/progress/store'
import { useReducedMotion, shareText } from '@/lib/utils-game'
import { IqCard } from '@/components/game/iq-card'
import { iqLevel, iqShareLine } from '@/lib/games/iq'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

/* ============================================================
 * FIN DE MANCHE — le cœur de la boucle de rétention :
 *  0. si le jeu fournit son QI estimé (prop `iq`), une CARTE QI
 *     couronne l'écran : chiffre animé, niveau d'intelligence
 *     (Novice → Génie), percentile, record et incitation à
 *     rejouer pour élever son QI (Task 18) ;
 *  1. un bouton principal « Rejouer / Poursuivre / Manche
 *     suivante » (le jeu fournit son handler) ;
 *  2. un bouton « Quitter » bien visible (sortie de la surface
 *     de jeu + défilement vers les jeux similaires) ;
 *  3. un CTA de PARTAGE incitatif (dégradé doré, halo) avec le
 *     résultat de la manche — présent à CHAQUE fin de partie,
 *     dans les deux langues (Task 15) ;
 *  4. une recommandation SUBTILE vers un autre jeu (chip
 *     discrète, tournante selon le nombre de parties).
 *
 * TASK 19 — L'ÉCRAN DE FIN EST UN POPUP (variante par défaut) :
 *  • porté au <body> via un portail React → recouvre TOUT
 *    l'écran (mode immersif comme page normale) et échappe au
 *    conteneur backdrop-blur du GameShell ;
 *  • voile flouté + carte centrée spring : directement visible
 *    SANS LE MOINDRE SCROLL, succès comme échec ;
 *  • la célébration VictoryBurst/Confetti brille d'abord à
 *    l'écran (~0,95 s), puis le popup prend la scène ;
 *  • le DÉFI QI BIENVEILLANT est mis en lumière : eyebrow
 *    « 🧠 Défi QI · Résultat », accroche incitative adaptée au
 *    niveau d'intelligence atteint (quel que soit l'issue),
 *    ligne de résultat concrète, puis la carte QI complète ;
 *  • variante `inline` : la mise en page compacte d'origine,
 *    pour les transitions de manche qui doivent rester rapides
 *    (ex. pill-toss entre deux manches).
 * ============================================================ */

export function RoundEndActions({
  gameId,
  onReplay,
  replayLabel,
  replayIcon,
  primaryRef,
  shareResult,
  iq,
  variant = 'popup',
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
  /** QI estimé de la manche (Task 18) : affiche la carte QI en tête
   *  d'écran et enrichit le payload de partage. Calculé côté jeu via
   *  computeIq(gameId, { accuracy, speed?, difficulty? }). */
  iq?: number
  /** popup (défaut) = écran de fin plein écran ; inline = mise en page
   *  compacte d'origine pour les transitions de manche rapides. */
  variant?: 'popup' | 'inline'
  className?: string
}) {
  const t = useT()
  const lang = useLang()
  const reduce = useReducedMotion()
  const requestExit = useGameSession((s) => s.requestExit)
  const game = getGame(gameId)
  const headlineId = useId()
  const cardRef = useRef<HTMLDivElement>(null)
  const fallbackBtnRef = useRef<HTMLButtonElement>(null)

  /* --- Révélation du popup : la célébration (VictoryBurst, confettis,
   *     fanfare du jeu) occupe la scène ~0,95 s, puis le popup spring
   *     prend le relais. Son StrictMode-safe (joué dans le timeout,
   *     le premier est annulé par le cleanup). --- */
  const [shown, setShown] = useState(false)
  /* « Quitter » (ou Échap) referme l'écran de fin : sans cela, le popup
   * porté au <body> restait affiché au-dessus de la page et masquait le
   * défilement vers les jeux similaires — le bouton paraissait inerte
   * (correctif Task 24). Le masquage vaut pour les deux variantes ; le
   * jeu conserve derrière son propre écran de résultat (stats, retour
   * aux réglages…), donc aucune impasse. */
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    if (variant !== 'popup' || dismissed) return
    const id = window.setTimeout(
      () => {
        sfx.play('levelup', { volume: 0.35 })
        setShown(true)
      },
      reduce ? 400 : 950,
    )
    return () => window.clearTimeout(id)
  }, [variant, reduce, dismissed])

  /* --- À l'ouverture : focus sur Rejouer (Entrée = rejouer). --- */
  useEffect(() => {
    if (!shown) return
    const btn = primaryRef?.current ?? fallbackBtnRef.current
    btn?.focus({ preventScroll: true })
  }, [shown, primaryRef])

  /* --- Piège de focus clavier (Tab / Shift+Tab) dans le popup. --- */
  useEffect(() => {
    if (!shown) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const root = cardRef.current
      if (!root) return
      const focusables = Array.from(root.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')).filter(
        (el) => !el.hasAttribute('disabled'),
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shown])

  /* --- Échap referme doucement l'écran de fin (fermeture simple :
   *     le jeu garde son écran de résultat propre derrière, sans
   *     déclencher la sortie immersif). Le GameShell ignore Échap
   *     tant qu'un dialog modal est ouvert (correctif Task 24). --- */
  useEffect(() => {
    if (!shown) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      sfx.play('sweep', { volume: 0.4 })
      setDismissed(true)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [shown])

  async function onShare() {
    sfx.play('coin', { volume: 0.6 })
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}${buildHash(lang, { type: 'game', slug: gameId })}`
        : ''
    const title = game?.title[lang] ?? 'Granmed'
    /* QI estimé dans chaque partage (Task 18) : le résultat devient
     * une fierté à afficher — « QI estimé : 118 (Éclairé) ». */
    const iqSuffix = iq != null ? ` · ${iqShareLine(iq, lang)}` : ''
    const text = shareResult
      ? `${shareResult}${iqSuffix}\n${title} — Granmed\n${url}`
      : `${title}${game ? ` — ${game.short[lang]}` : ''}${iqSuffix}\n${url}`
    const ok = await shareText(title, text)
    if (ok) toast.success(t('common.copied'))
  }

  /* --- Accroche incitative BIENVEILLANTE, fonction du niveau
   *     d'intelligence atteint — quel que soit l'issue (Task 19) :
   *     Novice → on encourage, Éveillé/Vif → on relance, Éclairé/
   *     Supérieur → on tend le génie, Génie → on défend le trône. --- */
  const tier = iq != null ? iqLevel(iq) : null
  const spurKey =
    tier == null
      ? 'iq.spurDefault'
      : tier.id === 1
        ? 'iq.spur1'
        : tier.id <= 3
          ? 'iq.spur2'
          : tier.id <= 5
            ? 'iq.spur3'
            : 'iq.spur4'
  const spur = t(spurKey)

  /* --- Actions communes (boutons + partage + recommandation). --- */
  const actions = (
    <div className="flex w-full flex-col items-stretch gap-2.5">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Button
          ref={primaryRef ?? fallbackBtnRef}
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
            setDismissed(true)
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

  /* --- Variante inline : la mise en page compacte d'origine
   *     (transitions de manche rapides, ex. pill-toss). --- */
  if (variant === 'inline') {
    if (dismissed) return null
    return (
      <div className={cn('mx-auto flex w-full max-w-sm flex-col items-stretch gap-2.5', className)}>
        {iq != null ? <IqCard gameId={gameId} iq={iq} /> : null}
        {actions}
      </div>
    )
  }

  /* --- Variante popup (défaut) : porté au <body> pour recouvrir
   *     tout l'écran, toujours visible sans le moindre scroll. --- */
  if (dismissed || !shown || typeof document === 'undefined') return null
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md backdrop-saturate-100"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.26 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headlineId}
    >
      <motion.div
        ref={cardRef}
        initial={reduce ? false : { opacity: 0, scale: 0.85, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="nice-scroll max-h-[92dvh] w-full max-w-sm overflow-y-auto rounded-3xl border-2 border-amber-200/70 bg-card p-4 shadow-2xl"
      >
        {/* Eyebrow — le défi QI signe l'écran */}
        <p className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          <span aria-hidden="true">🧠</span> {t('iq.resultEyebrow')}
        </p>

        {/* Accroche incitative bienveillante — fonction du niveau atteint,
            quel que soit l'issue de la manche */}
        <h2
          id={headlineId}
          className="mt-1 bg-gradient-to-r from-amber-500 via-primary to-rose-500 bg-clip-text text-center font-display text-xl font-extrabold leading-tight tracking-tight text-transparent sm:text-2xl"
        >
          {spur}
        </h2>

        {/* Résultat concret de la manche */}
        {shareResult ? (
          <p className="mt-1 text-center text-xs font-semibold text-muted-foreground">{shareResult}</p>
        ) : null}

        {/* Carte QI — le résultat affiché comme fonction du niveau
            d'intelligence (Task 18), en vedette (Task 19) */}
        {iq != null ? <IqCard gameId={gameId} iq={iq} className="mt-3 p-3" /> : null}

        <div className="mt-3">{actions}</div>
      </motion.div>
    </motion.div>,
    document.body,
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
        <Gamepad2 className="h-3 w-3" aria-hidden="true" />
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
