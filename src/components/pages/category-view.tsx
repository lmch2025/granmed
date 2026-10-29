'use client'

import { ChevronRight } from 'lucide-react'
import { useT, useLang } from '@/lib/i18n'
import { CATEGORIES, gamesOfCategory } from '@/lib/games/catalog'
import { GameGrid, GradientTile } from '@/components/shared/ui-bits'
import { HashLink } from '@/components/shared/hash-link'

export function CategoryView({ id }: { id: string }) {
  const t = useT()
  const lang = useLang()
  const cat = CATEGORIES.find((c) => c.id === id)
  if (!cat) return null
  const games = gamesOfCategory(cat.id)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1">
          <li>
            <HashLink view={{ type: 'home' }} className="rounded px-1 py-0.5 text-inherit hover:text-primary hover:underline">
              {t('nav.home')}
            </HashLink>
          </li>
          <li aria-hidden="true" className="flex items-center"><ChevronRight className="h-3.5 w-3.5" /></li>
          <li aria-current="page" className="font-medium text-foreground">{cat.name[lang]}</li>
        </ol>
      </nav>

      <header className="mb-6 flex items-start gap-4">
        <GradientTile icon={cat.icon} category={cat.id} size="xl" />
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">{cat.name[lang]}</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{cat.tagline[lang]}</p>
        </div>
      </header>

      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-foreground/90 sm:text-base">{cat.description[lang]}</p>

      <section aria-label={cat.name[lang]}>
        <h2 className="mb-4 font-display text-xl font-bold">
          {games.length} {t('common.games')}
        </h2>
        <GameGrid games={games} />
      </section>
    </div>
  )
}
