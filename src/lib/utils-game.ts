'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { useProfileStore } from '@/lib/progress/store'

/** Clé de date locale YYYY-MM-DD (fuseau de l'appareil). */
export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function dateKeyOffset(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return todayKey(d)
}

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Graine déterministe depuis une chaîne (ex. '2025-06-01:memory'). */
export function seedFromString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

/** 92340 → « 1:32 » ; avec centièmes si < 60 s. */
export function formatMs(ms: number, showTenths = false): string {
  const s = ms / 1000
  if (s < 60) {
    return showTenths ? `${s.toFixed(1)}s` : `${Math.floor(s)}s`
  }
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${String(r).padStart(2, '0')}`
}

/** Partage natif ou presse-papiers. Retourne true si partagé/copié. */
export async function shareText(title: string, text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title, text })
      return true
    }
  } catch {
    /* annulé */
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** Vrai si l'utilisateur demande une réduction des animations (réglage ou système). */
export function useReducedMotion(): boolean {
  const setting = useProfileStore((s) => s.profile.settings.reduceMotion)
  const media = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
  return setting || media
}

/** Évite les décalages d'hydratation pour l'UI dépendant du localStorage. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

/** Minuteur à intervalle — propre et stable. */
export function useInterval(cb: () => void, ms: number | null): void {
  useEffect(() => {
    if (ms === null) return
    const id = window.setInterval(cb, ms)
    return () => window.clearInterval(id)
  })
}
