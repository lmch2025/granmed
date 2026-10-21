'use client'

import { create } from 'zustand'
import { useMemo } from 'react'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import type { Lang } from '@/lib/i18n'
import { sfx } from '@/lib/sound'
import { BADGES_BY_ID } from '@/lib/progress/badges'
import { todayKey, dateKeyOffset } from '@/lib/utils-game'

export interface GameRecord {
  value: number
  date: string
}

export interface GameStats {
  plays: number
  wins: number
  lastPlayed?: string
  /** metric → record (les clés sont documentées dans le GameSEOContent de chaque jeu). */
  records: Record<string, GameRecord>
}

export interface Profile {
  xp: number
  badges: Record<string, string> // id → date d'obtention
  favorites: string[]
  dailyDone: Record<string, string> // gameId → date
  dailyLog: string[] // dates où au moins un défi du jour a été réussi
  games: Record<string, GameStats>
  settings: {
    sound: boolean
    volume: number
    reduceMotion: boolean
  }
  createdAt: string
}

const DEFAULT_PROFILE: Profile = {
  xp: 0,
  badges: {},
  favorites: [],
  dailyDone: {},
  dailyLog: [],
  games: {},
  settings: { sound: true, volume: 0.7, reduceMotion: false },
  createdAt: todayKey(),
}

/* ---------- Niveaux : besoin(L→L+1) = 100 + 50×(L−1) ---------- */
export function levelFromXp(xp: number): number {
  let level = 1
  let need = 100
  let acc = 0
  while (xp >= acc + need) {
    acc += need
    level++
    need = 100 + 50 * (level - 1)
  }
  return level
}

export function xpProgress(xp: number): { level: number; inLevel: number; need: number } {
  let level = 1
  let need = 100
  let acc = 0
  while (xp >= acc + need) {
    acc += need
    level++
    need = 100 + 50 * (level - 1)
  }
  return { level, inLevel: xp - acc, need }
}

/* ---------- Série quotidienne ---------- */
export function computeStreak(dailyLog: string[]): number {
  const set = new Set(dailyLog)
  const today = todayKey()
  const yesterday = dateKeyOffset(-1)
  if (!set.has(today) && !set.has(yesterday)) return 0
  let streak = 0
  let offset = set.has(today) ? 0 : -1
  while (set.has(dateKeyOffset(offset))) {
    streak++
    offset--
  }
  return streak
}

interface ProfileState {
  profile: Profile
  hydrated: boolean
  addXp: (amount: number, reason?: Record<Lang, string>) => void
  setBest: (gameId: string, metric: string, value: number, lowerIsBetter?: boolean) => boolean
  addPlay: (gameId: string) => void
  addWin: (gameId: string) => void
  unlockBadge: (id: string) => boolean
  completeDaily: (gameId: string) => void
  toggleFavorite: (gameId: string) => void
  updateSettings: (patch: Partial<Profile['settings']>) => void
  resetProfile: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      hydrated: false,

      addXp: (amount, reason) => {
        if (amount <= 0) return
        const before = levelFromXp(get().profile.xp)
        set((s) => ({ profile: { ...s.profile, xp: s.profile.xp + amount } }))
        const after = levelFromXp(get().profile.xp)
        if (reason) {
          // raison optionnelle affichée discrètement
        }
        if (after > before) {
          sfx.play('levelup')
          toast.success(`🎉 ${after}`, {
            description: getLevelToast(after),
            duration: 4000,
          })
          // Succès de niveau
          if (after >= 5) get().unlockBadge('level-5')
          if (after >= 10) get().unlockBadge('level-10')
        }
      },

      setBest: (gameId, metric, value, lowerIsBetter = false) => {
        const prev = get().profile.games[gameId]?.records?.[metric]
        const better = !prev || (lowerIsBetter ? value < prev.value : value > prev.value)
        if (!better) return false
        set((s) => {
          const g = s.profile.games[gameId] ?? { plays: 0, wins: 0, records: {} }
          return {
            profile: {
              ...s.profile,
              games: {
                ...s.profile.games,
                [gameId]: { ...g, records: { ...g.records, [metric]: { value, date: todayKey() } } },
              },
            },
          }
        })
        sfx.play('reveal')
        return true
      },

      addPlay: (gameId) => {
        let isNewGame = false
        set((s) => {
          const g = s.profile.games[gameId] ?? { plays: 0, wins: 0, records: {} }
          isNewGame = g.plays === 0
          return {
            profile: {
              ...s.profile,
              games: { ...s.profile.games, [gameId]: { ...g, plays: g.plays + 1, lastPlayed: todayKey() } },
            },
          }
        })
        // Succès globaux
        const p = get().profile
        if (isNewGame) {
          const tried = Object.keys(p.games).length
          if (tried >= 5) get().unlockBadge('explorer-5')
          if (tried >= 15) get().unlockBadge('explorer-15')
        }
        const totalPlays = Object.values(p.games).reduce((n, g) => n + g.plays, 0)
        if (totalPlays === 1) get().unlockBadge('first-game')
        if (totalPlays >= 10) get().unlockBadge('plays-10')
        if (totalPlays >= 100) get().unlockBadge('plays-100')
      },

      addWin: (gameId) => {
        set((s) => {
          const g = s.profile.games[gameId] ?? { plays: 0, wins: 0, records: {} }
          return {
            profile: {
              ...s.profile,
              games: { ...s.profile.games, [gameId]: { ...g, wins: g.wins + 1 } },
            },
          }
        })
      },

      unlockBadge: (id) => {
        const def = BADGES_BY_ID[id]
        if (!def || get().profile.badges[id]) return false
        set((s) => ({
          profile: { ...s.profile, badges: { ...s.profile.badges, [id]: todayKey() }, xp: s.profile.xp + def.xp },
        }))
        sfx.play('achievement')
        toast('🏅', {
          description: def.name.fr === def.name.en ? def.name.fr : `${def.name.fr} · ${def.name.en}`,
          duration: 5000,
        })
        return true
      },

      completeDaily: (gameId) => {
        const today = todayKey()
        const p = get().profile
        if (p.dailyDone[gameId] === today) return
        set((s) => ({
          profile: {
            ...s.profile,
            dailyDone: { ...s.profile.dailyDone, [gameId]: today },
            dailyLog: s.profile.dailyLog.includes(today) ? s.profile.dailyLog : [...s.profile.dailyLog, today].slice(-400),
          },
        }))
        get().addXp(25)
        const streak = computeStreak(get().profile.dailyLog)
        if (streak >= 3) get().unlockBadge('streak-3')
        if (streak >= 7) get().unlockBadge('streak-7')
      },

      toggleFavorite: (gameId) => {
        set((s) => {
          const has = s.profile.favorites.includes(gameId)
          return {
            profile: {
              ...s.profile,
              favorites: has ? s.profile.favorites.filter((f) => f !== gameId) : [...s.profile.favorites, gameId],
            },
          }
        })
        const p = get().profile
        if (p.favorites.length >= 5) get().unlockBadge('favorites-5')
      },

      updateSettings: (patch) => {
        set((s) => ({ profile: { ...s.profile, settings: { ...s.profile.settings, ...patch } } }))
        const st = get().profile.settings
        sfx.setEnabled(st.sound)
        sfx.setVolume(st.volume)
      },

      resetProfile: () => set({ profile: { ...DEFAULT_PROFILE, createdAt: todayKey() } }),
    }),
    {
      name: 'granmed:profile:v1',
      partialize: (s) => ({ profile: s.profile }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true
          const st = state.profile.settings
          sfx.setEnabled(st.sound)
          sfx.setVolume(st.volume)
        }
      },
    },
  ),
)

function getLevelToast(level: number): string {
  return level >= 10
    ? 'Niveau 10 atteint — quel entraînement ! 👑'
    : level >= 5
      ? 'Niveau 5 atteint — continuez ! ⭐'
      : `Niveau ${level} atteint !`
}

/* ---------- Sélecteurs pratiques ---------- */
export function useIsFavorite(gameId: string): boolean {
  return useProfileStore((s) => s.profile.favorites.includes(gameId))
}

const EMPTY_GAME_STATS: GameStats = { plays: 0, wins: 0, records: {} }

export function useGameStats(gameId: string): GameStats {
  const stats = useProfileStore((s) => s.profile.games[gameId])
  return stats ?? EMPTY_GAME_STATS
}

export function useIsDailyDone(gameId: string): boolean {
  return useProfileStore((s) => s.profile.dailyDone[gameId] === todayKey())
}

export function useTotalStats(): { plays: number; wins: number; streak: number; badges: number } {
  const games = useProfileStore((s) => s.profile.games)
  const badges = useProfileStore((s) => s.profile.badges)
  const dailyLog = useProfileStore((s) => s.profile.dailyLog)
  return useMemo(() => {
    let plays = 0
    let wins = 0
    for (const g of Object.values(games)) {
      plays += g.plays
      wins += g.wins
    }
    return {
      plays,
      wins,
      streak: computeStreak(dailyLog),
      badges: Object.keys(badges).length,
    }
  }, [games, badges, dailyLog])
}
