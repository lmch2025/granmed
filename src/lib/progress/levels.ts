import type { Lang } from '@/lib/i18n'
import { useMemo } from 'react'
import { useProfileStore } from '@/lib/progress/store'

/* ============================================================
 * Niveaux PAR JEU (gamification de rétention)
 * Chaque jeu possède sa propre courbe de progression :
 * besoin(L → L+1) = 40 + 25 × (L − 1).
 * Une manche terminée rapporte ~8-12 XP, une victoire ~20-30 XP
 * → les premiers paliers tombent en 2-4 parties, puis ralentissent.
 * ============================================================ */

export interface GameTier {
  /** Niveau à partir duquel ce palier s'applique. */
  minLevel: number
  name: Record<Lang, string>
  emoji: string
}

/** 12 paliers bilingues — aucun bleu/indigo, ambiance chaleureuse. */
export const GAME_TIERS: GameTier[] = [
  { minLevel: 1, name: { fr: 'Curieux', en: 'Curious' }, emoji: '🌱' },
  { minLevel: 2, name: { fr: 'Apprenti', en: 'Apprentice' }, emoji: '🌿' },
  { minLevel: 3, name: { fr: 'Habile', en: 'Skillful' }, emoji: '🍀' },
  { minLevel: 4, name: { fr: 'Aguerri', en: 'Seasoned' }, emoji: '🔶' },
  { minLevel: 5, name: { fr: 'Confirmé', en: 'Proven' }, emoji: '⭐' },
  { minLevel: 6, name: { fr: 'Expert', en: 'Expert' }, emoji: '🔥' },
  { minLevel: 8, name: { fr: 'Virtuose', en: 'Virtuoso' }, emoji: '💫' },
  { minLevel: 10, name: { fr: 'Maître', en: 'Master' }, emoji: '🏆' },
  { minLevel: 13, name: { fr: 'Champion', en: 'Champion' }, emoji: '🥇' },
  { minLevel: 16, name: { fr: 'Élite', en: 'Elite' }, emoji: '👑' },
  { minLevel: 20, name: { fr: 'Légende', en: 'Legend' }, emoji: '🌟' },
  { minLevel: 25, name: { fr: 'Mythique', en: 'Mythic' }, emoji: '🐉' },
]

export function tierForLevel(level: number): GameTier {
  let tier = GAME_TIERS[0]
  for (const t of GAME_TIERS) if (level >= t.minLevel) tier = t
  return tier
}

export function xpNeededForLevel(level: number): number {
  return 40 + 25 * (level - 1)
}

/** Niveau atteint pour un total d'XP de jeu donné. */
export function gameLevelFromXp(xp: number): number {
  let level = 1
  while (xp >= xpNeededForLevel(level)) {
    xp -= xpNeededForLevel(level)
    level++
  }
  return level
}

export interface GameLevelProgress {
  level: number
  tier: GameTier
  inLevel: number
  need: number
  /** 0 → 1, pour la barre de progression. */
  pct: number
}

export function gameLevelProgress(xp: number): GameLevelProgress {
  let level = 1
  let acc = 0
  while (xp >= acc + xpNeededForLevel(level)) {
    acc += xpNeededForLevel(level)
    level++
  }
  const need = xpNeededForLevel(level)
  const inLevel = xp - acc
  return { level, tier: tierForLevel(level), inLevel, need, pct: Math.min(1, inLevel / need) }
}

/** Hook : progression du niveau PAR JEU (persistée dans le profil). */
export function useGameLevel(gameId: string): GameLevelProgress {
  const xp = useProfileStore((s) => s.profile.gameXp?.[gameId] ?? 0)
  return useMemo(() => gameLevelProgress(xp), [xp])
}
