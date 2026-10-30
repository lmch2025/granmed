'use client'

import { createContext } from 'react'
import type { View } from '@/lib/app-store'
import type { GameSEOContent } from '@/lib/games/types'

/**
 * Task 27 (double vérification Task 26) — contexts de servitude SSR des pages jeu.
 *
 * CONSTAT CORRIGÉ : le HTML brut des 40 pages jeu réelles rendait la vue
 * ACCUEIL (H1 hero du portail, corps identique sur les 40 URLs) car le store
 * démarre sur `home` et le routeur ne lit le hash qu'après hydratation. Or les
 * moteurs de réponse IA (GPTBot, ClaudeBot, PerplexityBot, DuckAssistBot…)
 * N'EXÉCUTENT PAS JavaScript : ils ne voyaient que ce corps dupliqué, et le
 * contenu éditorial soigné de chaque jeu (description, règles, astuces, FAQ)
 * leur était invisible — un frein direct au référencement GEO/AIO.
 *
 * MÉCANISME (miroir exact de LangOverrideContext, Task 22) : la page serveur
 * transmet la vue jeu + le contenu SEO du jeu ; ils sont actifs uniquement
 * AVANT l'initialisation du routeur client (SSR + première passe d'hydratation),
 * puis s'effacent au profit du store — aucun flash, aucune divergence
 * d'hydratation (PATH_EARLY superpose le hash AVANT l'hydratation, donc le
 * routeur ouvre exactement le même jeu).
 */
export const SsrViewContext = createContext<View | null>(null)

/** Contenu SEO servi par le serveur pour la page jeu réelle courante. */
export const SsrGameContentContext = createContext<{
  slug: string
  content: GameSEOContent
} | null>(null)
