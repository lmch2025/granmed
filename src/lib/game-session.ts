'use client'

import { create } from 'zustand'

/* ============================================================
 * Session de jeu — pont minuscule entre un jeu (enfant du
 * GameShell) et le chrome partagé, sans events window ni
 * remontée de props impossible à travers les 20 jeux.
 * ============================================================ */

interface GameSessionState {
  /** Compteur incrémenté à chaque demande de sortie du jeu
   *  (fin de manche → « Quitter ») : le GameShell y réagit en
   *  quittant le mode immersif puis en défilant vers les
   *  recommandations de la page. */
  exitRequests: number
  requestExit: () => void
}

export const useGameSession = create<GameSessionState>((set) => ({
  exitRequests: 0,
  requestExit: () => set((s) => ({ exitRequests: s.exitRequests + 1 })),
}))
