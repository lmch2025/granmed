'use client'

import { createElement, lazy, Suspense, useEffect, useState } from 'react'
import type { GameSEOContent } from '@/lib/games/types'

export interface GameModule {
  default: React.ComponentType
  content: GameSEOContent
  gameId: string
}

/** Fallback visible tant qu'un jeu n'est pas encore branché. */
function ComingSoon() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-card/60 p-8 text-center">
      <span className="text-5xl anim-floaty" aria-hidden="true">🧺</span>
      <p className="font-display text-lg font-bold">Ce jeu est en cours de finalisation…</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Il arrivera très bientôt sur Granmed. En attendant, des dizaines d’autres jeux vous attendent !
      </p>
    </div>
  )
}

/** Les 20 jeux du portail (chargés à la demande, code-splitting par jeu). */
const LOADERS: Record<string, () => Promise<unknown>> = {
  'memory-match': () => import('@/components/games/memory-match'),
  'sequence-memory': () => import('@/components/games/sequence-memory'),
  'schulte-table': () => import('@/components/games/schulte-table'),
  'speed-math': () => import('@/components/games/speed-math'),
  'mini-crossword': () => import('@/components/games/mini-crossword'),
  'health-true-false': () => import('@/components/games/health-true-false'),
  'merge-garden': () => import('@/components/games/merge-garden'),
  '2048-nutrition': () => import('@/components/games/2048-nutrition'),
  'sudoku': () => import('@/components/games/sudoku'),
  'daily-word': () => import('@/components/games/daily-word'),
  'minesweeper': () => import('@/components/games/minesweeper'),
  'block-puzzle': () => import('@/components/games/block-puzzle'),
  'jigsaw-puzzle': () => import('@/components/games/jigsaw-puzzle'),
  'pill-toss': () => import('@/components/games/pill-toss'),
  'fire-escape': () => import('@/components/games/fire-escape'),
  'zen-fishing': () => import('@/components/games/zen-fishing'),
  'fruit-slice': () => import('@/components/games/fruit-slice'),
  'guess-the-idiom': () => import('@/components/games/guess-the-idiom'),
  'longest-word': () => import('@/components/games/longest-word'),
  'interactive-story': () => import('@/components/games/interactive-story'),
}

/* Composants lazy créés au niveau module (jamais pendant le rendu). */
const LAZY_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType>> = {}
for (const slug of Object.keys(LOADERS)) {
  LAZY_COMPONENTS[slug] = lazy(async () => {
    const mod = (await LOADERS[slug]()) as { default?: React.ComponentType }
    return { default: mod.default ?? ComingSoon }
  })
}
const FALLBACK_COMPONENT = lazy(async () => ({ default: ComingSoon }))

export function getGameComponent(slug: string): React.LazyExoticComponent<React.ComponentType> {
  return LAZY_COMPONENTS[slug] ?? FALLBACK_COMPONENT
}

const CONTENT_CACHE = new Map<string, GameSEOContent>()

/** Charge le contenu SEO du jeu (tagline, règles, FAQ…). */
export async function loadGameContent(slug: string): Promise<GameSEOContent | null> {
  if (CONTENT_CACHE.has(slug)) return CONTENT_CACHE.get(slug)!
  const loader = LOADERS[slug]
  if (!loader) return null
  try {
    const mod = (await loader()) as Partial<GameModule>
    if (mod.content) CONTENT_CACHE.set(slug, mod.content)
    return mod.content ?? null
  } catch {
    return null
  }
}

export function useGameContent(slug: string): GameSEOContent | null {
  const [content, setContent] = useState<GameSEOContent | null>(null)
  useEffect(() => {
    let alive = true
    loadGameContent(slug).then((c) => {
      if (alive) setContent(c)
    })
    return () => {
      alive = false
    }
  }, [slug])
  return content
}

export function GameLoader({ slug, fallback }: { slug: string; fallback?: React.ReactNode }) {
  return (
    <Suspense fallback={fallback ?? <GameSkeleton />}>{createElement(getGameComponent(slug))}</Suspense>
  )
}

export function GameSkeleton() {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-card/60 p-8" aria-busy="true" aria-label="Chargement">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-sm text-muted-foreground">Chargement du jeu…</p>
      </div>
    </div>
  )
}
