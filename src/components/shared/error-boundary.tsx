'use client'

import React from 'react'

/** Petit error boundary pour isoler chaque jeu (cahier des charges §9). */
export class GameErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackTitle?: string },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('[granmed] game error:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed p-8 text-center">
          <span className="text-4xl" aria-hidden="true">🔧</span>
          <p className="font-display text-lg font-bold">{this.props.fallbackTitle ?? 'Oups, ce jeu a rencontré un problème.'}</p>
          <p className="text-sm text-muted-foreground">
            Rechargez la page ou réessayez dans quelques instants. Les autres jeux restent accessibles.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Réessayer
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
