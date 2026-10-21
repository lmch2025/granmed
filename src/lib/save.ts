'use client'

/**
 * Sauvegarde/Reprise automatique des parties.
 * Clé par jeu : granmed:save:<slug>
 */

const PREFIX = 'granmed:save:'

export function loadSave<T>(gameId: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PREFIX + gameId)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function saveSave<T>(gameId: string, data: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PREFIX + gameId, JSON.stringify(data))
  } catch {}
}

export function clearSave(gameId: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(PREFIX + gameId)
  } catch {}
}
