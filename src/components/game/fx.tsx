'use client'

/**
 * Kit d'effets « juice » (Task 20) — retours visuels satisfaisants, 100 % décoratifs :
 * aucune logique de jeu modifiée, aucun verrou ni délai ajouté au gameplay.
 *
 * - `useJuice()` : helpers imperatifs (Web Animations API) — pulse / shake / pop
 *   sur un élément DOM, sans re-render React et rejouables à volonté.
 *   Respectent `prefers-reduced-motion` ET le réglage « réduire les animations »
 *   du profil (via useReducedMotion de utils-game).
 * - `<FxCellBurst>` : éclat + particules pour une case de grille (à rendre DANS
 *   la case, en `absolute inset-0`) — flash blanc → gonfle → s'efface en tournoyant,
 *   particules colorées qui volent. Uniquement transform/opacity (GPU-composited).
 *   Les custom properties (--dx/--dy/--fx-rot) pilotent les keyframes fx-* de
 *   globals.css ; le bloc `prefers-reduced-motion` y coupe les particules.
 */

import { useMemo, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/utils-game'

/* ------------------------------------------------------------------ */
/* Helpers imperatifs (Web Animations API — zéro re-render)            */
/* ------------------------------------------------------------------ */

export function useJuice() {
  const reduce = useReducedMotion()
  return {
    /** Vrai si le joueur demande des animations réduites (ne rien jouer). */
    reduce,
    /** Micro-pulse (scale) — réussite ponctuelle, confirmation douce. */
    pulse(el: HTMLElement | null | undefined, amount = 1.02, dur = 260) {
      if (!el || reduce) return
      el.animate(
        [{ transform: 'scale(1)' }, { transform: `scale(${amount})` }, { transform: 'scale(1)' }],
        { duration: dur, easing: 'cubic-bezier(.22,1,.36,1)' },
      )
    },
    /** Secousse proportionnelle au niveau (1 = douce … 4 = franche). */
    shake(el: HTMLElement | null | undefined, level: number = 1, dur?: number) {
      if (!el || reduce) return
      const a = Math.min(7, 1.6 + level * 1.3) // amplitude (px)
      const r = Math.min(1, level * 0.18) // rotation (deg)
      el.animate(
        [
          { transform: 'translate(0, 0) rotate(0deg)' },
          { transform: `translate(${a}px, ${-a * 0.4}px) rotate(${r}deg)` },
          { transform: `translate(${-a}px, ${a * 0.3}px) rotate(${-r}deg)` },
          { transform: `translate(${a * 0.5}px, ${-a * 0.2}px) rotate(${r * 0.5}deg)` },
          { transform: 'translate(0, 0) rotate(0deg)' },
        ],
        { duration: dur ?? 280 + level * 45, easing: 'ease-out' },
      )
    },
    /** Pop rapide avec léger rebond — récompense visuelle d'un élément. */
    pop(el: HTMLElement | null | undefined, amount = 1.14, dur = 240) {
      if (!el || reduce) return
      el.animate(
        [{ transform: 'scale(1)' }, { transform: `scale(${amount})` }, { transform: 'scale(1)' }],
        { duration: dur, easing: 'cubic-bezier(.34,1.56,.64,1)' },
      )
    },
  }
}

/* ------------------------------------------------------------------ */
/* Éclat de case (déclaratif, rendu DANS la case visée)                */
/* ------------------------------------------------------------------ */

/**
 * Éclat + particules pour une case de grille effacée / validée.
 *
 * @param colorClass  classes de fond de l'éclat (ex. 'bg-gradient-to-br from-amber-300 to-orange-400')
 * @param delay       décalage en ms — ondes radiales, départs en cascade
 * @param particles   nombre de particules volantes (0 pour aucune ; les particules
 *                    sont automatiquement coupées par `prefers-reduced-motion`)
 * @param size        taille des particules (pourcentage de la case)
 *
 * Remarque : pour rejouer l'animation à chaque événement, remontez le composant
 * (changez sa `key` — le kit est conçu pour un rendu éphémère piloté par l'état).
 */
export function FxCellBurst({
  colorClass,
  delay = 0,
  particles = 2,
  size = '30%',
  className,
}: {
  colorClass: string
  delay?: number
  particles?: number
  size?: string
  className?: string
}) {
  const rot = useMemo(() => `${(Math.random() * 2 - 1) * 14}deg`, [])
  const parts = useMemo(
    () =>
      Array.from({ length: Math.max(0, particles) }, (_, k) => {
        const angle = (k / Math.max(1, particles)) * Math.PI * 2 + Math.random() * 1.2
        const dist = 16 + Math.random() * 20
        return {
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist - 8}px`, // légère poussée vers le haut
          rot: `${(Math.random() * 2 - 1) * 160}deg`,
          delay: delay + 20 + Math.random() * 50,
          white: k % 2 === 0, // une particule blanche sur deux : contraste vif
        }
      }),
    [delay, particles],
  )
  return (
    <>
      {/* Carré coloré : gonfle puis s'efface en tournoyant */}
      <span
        aria-hidden="true"
        className={cn('anim-fx-burst pointer-events-none absolute inset-0 z-10 rounded-[3px]', colorClass, className)}
        style={{ '--fx-rot': rot, animationDelay: `${delay}ms` } as CSSProperties}
      />
      {/* Flash blanc par-dessus : l'impact lumineux */}
      <span
        aria-hidden="true"
        className="anim-fx-flash pointer-events-none absolute inset-0 z-10 rounded-[3px] bg-white"
        style={{ animationDelay: `${delay}ms` }}
      />
      {/* Particules : partent du centre de la case dans des directions étagées */}
      {parts.map((p, k) => (
        <span
          key={k}
          aria-hidden="true"
          className={cn(
            'anim-fx-part pointer-events-none absolute left-1/2 top-1/2 z-10 rounded-[2px]',
            p.white ? 'bg-white' : colorClass,
          )}
          style={
            {
              width: size,
              height: size,
              '--dx': p.dx,
              '--dy': p.dy,
              '--fx-rot': p.rot,
              animationDelay: `${p.delay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </>
  )
}
