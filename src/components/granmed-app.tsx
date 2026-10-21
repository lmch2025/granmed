'use client'

import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { useAppStore } from '@/lib/app-store'
import { useT, useLang } from '@/lib/i18n'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { HomeView } from '@/components/home/home-view'
import { GamePage } from '@/components/game/game-page'
import { CategoryView } from '@/components/pages/category-view'
import { GuidesView, GuideView } from '@/components/pages/guides-view'
import { AboutView, LegalView, NotFoundView } from '@/components/pages/static-views'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { GUIDES, GUIDES_BY_SLUG } from '@/lib/content/guides'
import { CATEGORIES, getGame } from '@/lib/games/catalog'

/** Métadonnées dynamiques par vue (titre d'onglet, partage). */
function useDocumentMeta() {
  const view = useAppStore((s) => s.view)
  const lang = useLang()
  const t = useT()

  useEffect(() => {
    let title = 'Granmed — Jeux gratuits en ligne : mémoire, puzzles, mots et réflexes'
    let desc =
      '20 jeux gratuits sans téléchargement : mémoire, sudoku, 2048, mots, quiz santé et réflexes. Défis quotidiens, succès et records. Jouez en français ou en anglais.'
    if (lang === 'en') {
      title = 'Granmed — Free Online Games: Memory, Puzzles, Words & Reflexes'
      desc = '20 free games, no download: memory, sudoku, 2048, words, health quiz and reflexes. Daily challenges, achievements and records. Play in French or English.'
    }
    switch (view.type) {
      case 'game': {
        const g = getGame(view.slug)
        if (g) {
          title = `${g.title[lang]} | Granmed`
          desc = g.short[lang]
        }
        break
      }
      case 'category': {
        const c = CATEGORIES.find((x) => x.id === view.id)
        if (c) {
          title = `${c.name[lang]} | Granmed`
          desc = c.description[lang]
        }
        break
      }
      case 'dashboard':
        title = `${t('dash.title')} | Granmed`
        break
      case 'guides':
        title = `${t('nav.guides')} | Granmed`
        break
      case 'guide': {
        const g = GUIDES_BY_SLUG[view.slug]
        if (g) {
          title = `${g.title[lang]} | Granmed`
          desc = g.description[lang]
        }
        break
      }
      case 'about':
        title = `${t('nav.about')} | Granmed`
        break
      case 'legal':
        title = `${view.doc === 'privacy' ? t('footer.privacy') : t('footer.terms')} | Granmed`
        break
    }
    document.title = title
    let el = document.querySelector('meta[name="description"]')
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('name', 'description')
      document.head.appendChild(el)
    }
    el.setAttribute('content', desc.slice(0, 300))
    document.documentElement.lang = lang
  }, [view, lang, t])
}

function CurrentView() {
  const view = useAppStore((s) => s.view)
  switch (view.type) {
    case 'home':
      return <HomeView />
    case 'game':
      return <GamePage slug={view.slug} />
    case 'category':
      return <CategoryView id={view.id} />
    case 'dashboard':
      return <DashboardView tab={view.tab} />
    case 'guides':
      return <GuidesView />
    case 'guide':
      return <GuideView slug={view.slug} />
    case 'about':
      return <AboutView />
    case 'legal':
      return <LegalView doc={view.doc} />
    default:
      return <NotFoundView />
  }
}

export function GranmedApp() {
  const init = useAppStore((s) => s.init)
  const setViewFromHash = useAppStore((s) => s.init)

  useEffect(() => {
    init()
  }, [init, setViewFromHash])

  useDocumentMeta()

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main-content" className="flex-1">
          <CurrentView />
        </main>
        <SiteFooter />
      </div>
      <Toaster position="top-center" richColors closeButton />
    </ThemeProvider>
  )
}

export const TOTAL_GAMES = 20
export const TOTAL_GUIDES = GUIDES.length
