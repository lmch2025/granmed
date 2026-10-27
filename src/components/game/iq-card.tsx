'use client'

import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore, useGameStats } from '@/lib/progress/store'
import { useReducedMotion, todayKey } from '@/lib/utils-game'
import { IQ_RECORD_METRIC, iqLevel, iqNext, iqPercentile } from '@/lib/games/iq'

/* ============================================================
 * CARTE QI — le résultat de chaque partie, AFFICHÉ COMME UNE
 * FONCTION DU NIVEAU D'INTELLIGENCE (Task 18) :
 *
 *   • grand chiffre animé (count-up 70 → QI) dans un anneau
 *     de progression vers le palier suivant ;
 *   • badge du niveau d'intelligence (Novice → Génie) ;
 *   • percentile (« Top 12 % ») sur l'échelle de Wechsler ;
 *   • record QI personnel (ou « Nouveau record ! ») ;
 *   • ligne d'incitation au REJOUER pour élever son QI.
 *
 * Auto-suffisante : persiste le record `best-iq` dans le
 * store de progression au montage (idempotent, StrictMode-safe).
 * ============================================================ */

const RING_R = 42
const RING_C = 2 * Math.PI * RING_R

export function IqCard({
  gameId,
  iq,
  className,
}: {
  gameId: string
  /** QI estimé de la manche (70–150), calculé via computeIq(). */
  iq: number
  className?: string
}) {
  const t = useT()
  const lang = useLang()
  const reduce = useReducedMotion()
  const setBest = useProfileStore((s) => s.setBest)
  const stats = useGameStats(gameId)

  const tier = iqLevel(iq)
  const next = iqNext(iq)

  /* --- Count-up dramatique : 70 → QI --- */
  const [display, setDisplay] = useState(reduce ? iq : 70)
  /* Ajustement pendant le rendu (motif React officiel, cf. VictoryBurst) :
   * chaque nouveau QI relance le compteur depuis 70. */
  const [lastIq, setLastIq] = useState(iq)
  if (iq !== lastIq) {
    setLastIq(iq)
    setDisplay(reduce ? iq : 70)
  }
  useEffect(() => {
    if (reduce) return
    const controls = animate(70, iq, {
      duration: 1.05,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [iq, reduce])

  /* --- Anneau : déclenche la transition CSS après le montage --- */
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setArmed(true), reduce ? 0 : 80)
    return () => window.clearTimeout(id)
  }, [reduce])

  /* --- Record QI persistant : l'écriture store suffit (idempotente,
   *     StrictMode-safe) ; le store joue déjà son « reveal » au record. --- */
  useEffect(() => {
    setBest(gameId, IQ_RECORD_METRIC, iq)
  }, [gameId, iq, setBest])

  const best = stats.records[IQ_RECORD_METRIC]?.value
  const bestDate = stats.records[IQ_RECORD_METRIC]?.date
  /* « Nouveau record » si ce QI EST le record et qu'il vient d'être établi
   * (la date du record bascule au jour courant uniquement lors d'une
   * amélioration réelle — un match nul avec un ancien record ne compte pas). */
  const isNewBest = best != null && best === iq && bestDate === todayKey()

  /* --- Percentile : « Top n % » (échelle moyenne 100 / σ 15) --- */
  const topRaw = 100 - iqPercentile(iq)
  const topText =
    topRaw < 1
      ? new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 1 }).format(topRaw)
      : String(Math.round(topRaw))

  const ringPct = next ? next.pct : 1
  const ringOffset = armed ? RING_C * (1 - ringPct) : RING_C
  const barGradient = `linear-gradient(90deg, ${tier.stroke}, ${next?.tier.stroke ?? tier.stroke})`

  return (
    <div
      className={cn('rounded-2xl border-2 p-4 text-center', tier.soft, className)}
      style={{ borderColor: `${tier.stroke}59` }}
      role="status"
      aria-label={`${t('iq.estimated')} : ${iq} — ${tier.name[lang]}`}
    >
      <p className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
        <span aria-hidden="true">🧠</span> {t('iq.estimated')}
      </p>

      <div className="mt-3 flex items-center justify-center gap-4">
        {/* Anneau de progression vers le palier suivant + chiffre animé */}
        <div className="relative h-[104px] w-[104px] shrink-0" aria-hidden="true">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={RING_R} fill="none" strokeWidth="8" className="stroke-border" />
            <circle
              cx="50"
              cy="50"
              r={RING_R}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              stroke={tier.stroke}
              strokeDasharray={RING_C}
              strokeDashoffset={ringOffset}
              style={{ transition: reduce ? 'none' : 'stroke-dashoffset 1.05s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('font-display text-[2.1rem] font-extrabold leading-none tabular-nums', tier.text)}>{display}</span>
          </div>
        </div>

        {/* Niveau + percentile + record */}
        <div className="min-w-0 flex-1 text-left">
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold', tier.chip)}>
            <span aria-hidden="true">{tier.emoji}</span> {tier.name[lang]}
          </span>
          <p className="mt-1.5 text-xs font-bold text-foreground/80">
            {t('iq.topPercent', { n: topText })}
          </p>
          {isNewBest ? (
            <p className="mt-0.5 text-xs font-extrabold text-amber-600 dark:text-amber-400">👑 {t('iq.newBest')}</p>
          ) : best ? (
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">{t('iq.best', { n: Math.max(best, iq) })}</p>
          ) : null}
        </div>
      </div>

      {/* Barre de progression vers le niveau suivant */}
      <div className="mt-3">
        <div className="h-2.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
          <div
            className="h-full rounded-full"
            style={{
              width: armed ? `${Math.round(ringPct * 100)}%` : '0%',
              background: barGradient,
              transition: reduce ? 'none' : 'width 1.05s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
        <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
          {next ? t('iq.nextTier', { n: next.points, level: next.tier.name[lang] }) : `👑 ${t('iq.maxLevel')}`}
        </p>
      </div>

      {/* Incitation au rejouer — le cœur de la boucle de rétention */}
      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-extrabold text-amber-600 dark:text-amber-400">
        <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
        {t('iq.replay')}
      </p>
    </div>
  )
}

/* ---------- Variante compacte (jeux zen : HUD / collection) ---------- */

export function IqChip({ gameId, iq, className }: { gameId: string; iq: number; className?: string }) {
  const t = useT()
  const lang = useLang()
  const tier = iqLevel(iq)
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold', tier.chip, className)}
      title={t('iq.level')}
      aria-label={`${t('iq.estimated')} : ${iq} — ${tier.name[lang]}`}
    >
      <span aria-hidden="true">🧠</span>
      <span className="tabular-nums">{iq}</span>
      <span aria-hidden="true">·</span>
      <span>{tier.name[lang]}</span>
    </span>
  )
}
