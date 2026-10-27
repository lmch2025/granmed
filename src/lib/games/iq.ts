import type { Lang } from '@/lib/i18n'
import { getGame } from '@/lib/games/catalog'

/* ============================================================
 * MOTEUR QI — « le résultat est fonction du niveau
 * d'intelligence » (Task 18).
 *
 * Chaque partie produit un QI ESTIMÉ ludique sur l'échelle
 * classique (moyenne 100, écart-type 15, bornes 70–150),
 * calculé à partir de trois dimensions mesurables :
 *
 *   1. PRÉCISION  — erreurs / réussites de la manche ;
 *   2. RAPIDITÉ   — temps réel vs. temps « par » du jeu ;
 *   3. DIFFICULTÉ — niveau de la grille / du mode choisi.
 *
 *   QI = 86 + difficulté×5 + (précision − 0,70)×62 + (rapidité − 1)×20
 *
 * Une manche parfaite, rapide et difficile culmine vers 141
 * (niveau Génie) : le sommet reste rare et donc convoité —
 * la boucle « rejouer sans cesse pour élever son QI » est le
 * cœur du design. Le percentile s'appuie sur la loi normale
 * de l'échelle de Wechsler ( moyenne 100, σ 15 ).
 *
 * HONNÊTETÉ (AIO/GEO) : il s'agit d'une estimation LUDIQUE de
 * la performance dans CE jeu — pas d'un test de QI clinique.
 * Cette nuance est rappelée dans les FAQ et llms.txt.
 * ============================================================ */

/** Clé de record utilisée dans le store de progression. */
export const IQ_RECORD_METRIC = 'best-iq'

export interface IqTier {
  id: 1 | 2 | 3 | 4 | 5 | 6
  min: number
  max: number
  emoji: string
  name: Record<Lang, string>
  /** Couleur du grand chiffre (classe texte Tailwind, littérale). */
  text: string
  /** Couleur de l'anneau SVG (hex — utilisée en stroke inline). */
  stroke: string
  /** Chip du badge de niveau (classes littérales Tailwind). */
  chip: string
  /** Fond doux de la carte (classes littérales Tailwind). */
  soft: string
}

/** Les 6 niveaux d'intelligence — du Novice au Génie. */
export const IQ_TIERS: IqTier[] = [
  {
    id: 1,
    min: 70,
    max: 89,
    emoji: '🌱',
    name: { fr: 'Novice', en: 'Novice' },
    text: 'text-zinc-600 dark:text-zinc-300',
    stroke: '#a1a1aa',
    chip: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-200',
    soft: 'bg-zinc-50/70 dark:bg-zinc-500/10',
  },
  {
    id: 2,
    min: 90,
    max: 104,
    emoji: '💡',
    name: { fr: 'Éveillé', en: 'Alert' },
    text: 'text-emerald-600 dark:text-emerald-400',
    stroke: '#059669',
    chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    soft: 'bg-emerald-50/70 dark:bg-emerald-500/10',
  },
  {
    id: 3,
    min: 105,
    max: 114,
    emoji: '⚡',
    name: { fr: 'Vif', en: 'Sharp' },
    text: 'text-amber-600 dark:text-amber-400',
    stroke: '#d97706',
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    soft: 'bg-amber-50/70 dark:bg-amber-500/10',
  },
  {
    id: 4,
    min: 115,
    max: 124,
    emoji: '🔥',
    name: { fr: 'Éclairé', en: 'Bright' },
    text: 'text-orange-600 dark:text-orange-400',
    stroke: '#ea580c',
    chip: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
    soft: 'bg-orange-50/70 dark:bg-orange-500/10',
  },
  {
    id: 5,
    min: 125,
    max: 139,
    emoji: '💎',
    name: { fr: 'Supérieur', en: 'Superior' },
    text: 'text-rose-600 dark:text-rose-400',
    stroke: '#e11d48',
    chip: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    soft: 'bg-rose-50/70 dark:bg-rose-500/10',
  },
  {
    id: 6,
    min: 140,
    max: 150,
    emoji: '👑',
    name: { fr: 'Génie', en: 'Genius' },
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500',
    stroke: '#f59e0b',
    chip: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/25',
    soft: 'bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-500/10 dark:to-rose-500/10',
  },
]

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export interface IqInputs {
  /** Réussite / précision de la manche, 0 (=échec complet) à 1 (=sans faute). */
  accuracy: number
  /** rapidité = temps « par » ÷ temps réel. 1 = rythme attendu, >1 = plus vite.
   *  Omis pour les jeux sans référence de temps utile. */
  speed?: number
  /** Difficulté effective de la manche (défaut : celle du catalogue). */
  difficulty?: 1 | 2 | 3
}

/** Calcule le QI estimé d'une manche (70–150). */
export function computeIq(gameId: string, inputs: IqInputs): number {
  const difficulty = inputs.difficulty ?? getGame(gameId)?.difficulty ?? 2
  const acc = clamp(inputs.accuracy, 0, 1)
  const spd = clamp(inputs.speed ?? 1, 0.4, 2.2)
  const raw = 86 + difficulty * 5 + (acc - 0.7) * 62 + (spd - 1) * 20
  return Math.round(clamp(raw, 70, 150))
}

/** Niveau d'intelligence correspondant à un QI. */
export function iqLevel(iq: number): IqTier {
  const v = clamp(Math.round(iq), 70, 150)
  return IQ_TIERS.find((t) => v <= t.max) ?? IQ_TIERS[IQ_TIERS.length - 1]
}

/* ---------- Percentile (loi normale, moyenne 100 / σ 15) ---------- */

/** Φ(z) — approximation d'Abramowitz & Stegun (précision ≈ 1e-6). */
function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989422804 * Math.exp((-z * z) / 2)
  const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
  return z > 0 ? 1 - p : p
}

/** Percentile du QI (ex. 118 → 88,5). */
export function iqPercentile(iq: number): number {
  const p = normCdf((clamp(iq, 70, 150) - 100) / 15) * 100
  return Math.round(p * 10) / 10
}

export interface IqNext {
  tier: IqTier
  /** Progression 0–1 vers le palier suivant. */
  pct: number
  /** Points de QI restants avant le palier suivant. */
  points: number
}

/** Progression vers le niveau d'intelligence suivant (null = Génie atteint). */
export function iqNext(iq: number): IqNext | null {
  const tier = iqLevel(iq)
  if (tier.id >= 6) return null
  const next = IQ_TIERS[tier.id]
  const pct = clamp((iq - tier.min + 1) / (next.min - tier.min), 0, 1)
  return { tier: next, pct, points: Math.max(1, next.min - Math.round(iq)) }
}

/** Ligne de partage localisée (payload navigator.share / presse-papiers). */
export function iqShareLine(iq: number, lang: Lang): string {
  const tier = iqLevel(iq)
  return lang === 'fr' ? `QI estimé : ${Math.round(iq)} (${tier.name.fr})` : `Estimated IQ: ${Math.round(iq)} (${tier.name.en})`
}
