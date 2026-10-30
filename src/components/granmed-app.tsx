'use client'

import { useContext, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { useAppStore, type View } from '@/lib/app-store'
import { LangOverrideContext, useT, useLang, type Lang } from '@/lib/i18n'
import { SsrGameContentContext, SsrViewContext } from '@/lib/ssr-context'
import type { GameSEOContent } from '@/lib/games/types'
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
    let title = 'Granmed — Jeux de QI gratuits : testez et entraînez votre intelligence'
    let desc =
      "20 jeux de QI gratuits en ligne : mémoire, logique, calcul mental, mots et réflexes. Chaque partie révèle votre QI estimé et votre niveau d'intelligence — rejouez pour l'élever. FR/EN."
    if (lang === 'en') {
      title = 'Granmed — Free IQ Games: Test & Train Your Intelligence'
      desc =
        '20 free IQ games online: memory, logic, mental math, words and reflexes. Every round reveals your estimated IQ and intelligence level — replay to raise it. FR/EN.'
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
  /* Task 27 : avant l'init du routeur (SSR + hydratation), la vue SERVIE par la
   * page réelle (page jeu) prime — le HTML brut montre le JEU, pas l'accueil. */
  const ssrView = useContext(SsrViewContext)
  const storeView = useAppStore((s) => s.view)
  const view = ssrView ?? storeView
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

export function GranmedApp({
  /** Task 22 : langue déterminée côté serveur (/?lang=en) — le HTML servi est
   *  déjà anglais pour les moteurs sans JavaScript (GEO/AIO). */
  initialLang = 'fr',
  /** Task 27 : vue servie par le serveur sur une page jeu réelle — rendue
   *  avant l'init du routeur (HTML brut = jeu, pas accueil). */
  initialView,
  /** Task 27 : contenu SEO du jeu servi (SSR) — même source que le module
   *  client, zéro dérive ; garde-fou par slug dans GamePage. */
  initialGameContent = null,
}: {
  initialLang?: Lang
  initialView?: View
  initialGameContent?: { slug: string; content: GameSEOContent } | null
}) {
  const init = useAppStore((s) => s.init)
  const setViewFromHash = useAppStore((s) => s.init)
  const routerReady = useAppStore((s) => s.initialized)

  useEffect(() => {
    init()
  }, [init, setViewFromHash])

  useDocumentMeta()

  /* Override de langue actif uniquement avant l'init du routeur client :
   * SSR + première passe d'hydratation → identique serveur/client (zéro mismatch). */
  const ssrLangOverride = routerReady ? null : initialLang
  /* Task 27 : idem pour la vue — PATH_EARLY superpose le hash AVANT l'hydratation,
   * donc init() ouvre exactement le même jeu : transition invisible. */
  const ssrViewOverride = routerReady ? null : (initialView ?? null)

  return (
    <LangOverrideContext.Provider value={ssrLangOverride}>
      <SsrViewContext.Provider value={ssrViewOverride}>
        <SsrGameContentContext.Provider value={initialGameContent}>
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
        </SsrGameContentContext.Provider>
      </SsrViewContext.Provider>
    </LangOverrideContext.Provider>
  )
}

export const TOTAL_GAMES = 20
export const TOTAL_GUIDES = GUIDES.length
