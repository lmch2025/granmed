'use client'

import { create } from 'zustand'
import type { Lang } from '@/lib/i18n'
import { CATEGORIES, GAMES, GAMES_BY_SLUG, gameRealPath, getGame } from '@/lib/games/catalog'

export type View =
  | { type: 'home' }
  | { type: 'game'; slug: string }
  | { type: 'category'; id: string }
  | { type: 'dashboard'; tab?: 'overview' | 'badges' | 'records' | 'favorites' }
  | { type: 'guides' }
  | { type: 'guide'; slug: string }
  | { type: 'about' }
  | { type: 'legal'; doc: 'privacy' | 'terms' }
  | { type: 'notfound' }

interface AppState {
  lang: Lang
  view: View
  /** Vrai dès que init() a lu l'URL — coupe l'override SSR de langue (Task 22). */
  initialized: boolean
  /** Initialise le store depuis l'URL (hash + ?lang=) et détecte la langue. */
  init: () => void
  setLang: (lang: Lang) => void
  navigate: (view: View) => void
  goHome: () => void
}

const LANG_KEY = 'granmed:lang'

function readStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_KEY)
    return v === 'fr' || v === 'en' ? v : null
  } catch {
    return null
  }
}

function detectLang(): Lang {
  if (typeof navigator !== 'undefined') {
    /* Task 22 (audit ultime) : les robots de rendu (Googlebot, Bingbot, crawlers
       IA…) reçoivent la langue canonique par défaut (FR sur `/`) — leurs
       préférences navigateur (souvent en-US) ne doivent pas faire diverger le
       contenu rendu de la canonique, du hreflang et du sitemap. */
    if (/bot|crawl|spider|slurp|bingpreview|lighthouse|headlesschrome|puppeteer|playwright/i.test(navigator.userAgent)) {
      return 'fr'
    }
    const langs = navigator.languages ?? [navigator.language]
    for (const l of langs) {
      if (l?.toLowerCase().startsWith('fr')) return 'fr'
      if (l?.toLowerCase().startsWith('en')) return 'en'
    }
  }
  return 'en'
}

/** Analyse `#/fr/jeu-memory` → { lang: 'fr', view: { type: 'game', slug: 'memory-match' } } */
export function parseHash(hash: string): { lang: Lang | null; view: View } {
  const clean = hash.replace(/^#\/?/, '').replace(/\/+$/, '')
  if (!clean) return { lang: null, view: { type: 'home' } }
  const parts = clean.split('/').filter(Boolean)
  const seg0 = parts[0]?.toLowerCase()
  let lang: Lang | null = null
  let rest: string[]
  if (seg0 === 'fr' || seg0 === 'en') {
    lang = seg0
    rest = parts.slice(1)
  } else {
    rest = parts
  }
  const view = parseView(rest)
  return { lang, view }
}

function parseView(rest: string[]): View {
  const [a, b] = rest
  if (!a) return { type: 'home' }
  // Page jeu : chemin localisé FR ou EN
  for (const g of GAMES) {
    if (a === g.paths.fr || a === g.paths.en) return { type: 'game', slug: g.slug }
  }
  // Catégories
  for (const c of CATEGORIES) {
    const frSub = c.path.fr.split('/')[1]
    const enSub = c.path.en.split('/')[1]
    if ((a === 'categorie' || a === 'category') && (b === frSub || b === enSub)) {
      return { type: 'category', id: c.id }
    }
  }
  if (a === 'parcours' || a === 'journey') {
    const tab =
      b === 'succes' || b === 'badges' ? 'badges'
      : b === 'records' ? 'records'
      : b === 'favoris' || b === 'favorites' ? 'favorites'
      : 'overview'
    return { type: 'dashboard', tab }
  }
  if (a === 'guides' || a === 'guides') {
    if (b) return { type: 'guide', slug: b }
    return { type: 'guides' }
  }
  if (a === 'a-propos' || a === 'about') return { type: 'about' }
  if (a === 'confidentialite' || a === 'privacy') return { type: 'legal', doc: 'privacy' }
  if (a === 'mentions-legales' || a === 'terms') return { type: 'legal', doc: 'terms' }
  return { type: 'notfound' }
}

/** Construit le hash localisé d'une vue : buildHash('fr', {type:'game', slug:'memory-match'}) → '#/fr/jeu-memory' */
export function buildHash(lang: Lang, view: View): string {
  const p = viewPath(view, lang)
  return `#/${lang}${p ? `/${p}` : ''}`
}

function viewPath(view: View, lang: Lang): string {
  switch (view.type) {
    case 'home':
      return ''
    case 'game': {
      const g = getGame(view.slug)
      return g ? g.paths[lang] : ''
    }
    case 'category': {
      const c = CATEGORIES.find((x) => x.id === view.id)
      return c ? c.path[lang] : ''
    }
    case 'dashboard': {
      const base = lang === 'fr' ? 'parcours' : 'journey'
      if (!view.tab || view.tab === 'overview') return base
      const suffix =
        view.tab === 'badges' ? (lang === 'fr' ? 'succes' : 'badges')
        : view.tab === 'records' ? 'records'
        : lang === 'fr' ? 'favoris' : 'favorites'
      return `${base}/${suffix}`
    }
    case 'guides':
      return 'guides'
    case 'guide':
      return `guides/${view.slug}`
    case 'about':
      return lang === 'fr' ? 'a-propos' : 'about'
    case 'legal':
      return view.doc === 'privacy' ? (lang === 'fr' ? 'confidentialite' : 'privacy') : lang === 'fr' ? 'mentions-legales' : 'terms'
    case 'notfound':
      return 'introuvable'
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  lang: 'fr',
  view: { type: 'home' },
  initialized: false,

  init: () => {
    // 1. Langue : ?lang= > choix mémorisé > détection navigateur (défaut : EN si non supportée, FR par défaut serveur)
    const params = new URLSearchParams(window.location.search)
    const qLang = params.get('lang')
    let lang: Lang
    if (qLang === 'fr' || qLang === 'en') {
      lang = qLang
      try {
        localStorage.setItem(LANG_KEY, lang)
      } catch {}
    } else {
      lang = readStoredLang() ?? detectLang()
    }
    // 2. Vue depuis le hash
    const { lang: hashLang, view } = parseHash(window.location.hash)
    if (hashLang) lang = hashLang
    set({ lang, view, initialized: true })
    if (!window.location.hash) {
      window.history.replaceState(null, '', buildHash(lang, view))
    }
    // 3. Écouter les changements (bouton précédent/suivant)
    window.addEventListener('hashchange', () => {
      const { lang: hl, view: v } = parseHash(window.location.hash)
      set((s) => ({ view: v, lang: hl ?? s.lang }))
    })
  },

  setLang: (lang) => {
    set({ lang })
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {}
    const view = get().view
    const hash = buildHash(lang, view)
    /* Task 22 : l'URL porte toujours la langue active (?lang=en ⟺ anglais) —
       cohérence canonique/métadonnées pour les moteurs qui exécutent JS.
       NB : pathname explicite requis — un pushState '#/…' seul ne remplacerait
       QUE le fragment et conserverait une query ?lang=en obsolète.
       Task 27 : sur une page jeu réelle, le chemin suit la langue cible
       (/fr/jeu-memory ⟷ /en/memory-match) — l'URL partagée reste toujours
       cohérente avec le contenu et le canonique servis par le proxy. */
    const realPath = view.type === 'game' ? gameRealPath(lang, view.slug) : ''
    const search = realPath ? '' : lang === 'en' ? '?lang=en' : ''
    const base = realPath || window.location.pathname
    window.history.pushState(null, '', `${base}${search}${hash}`)
    // déclenche un rendu cohérent sans recharger
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  },

  navigate: (view) => {
    const { lang } = get()
    if (view.type === 'game' && !GAMES_BY_SLUG[view.slug]) view = { type: 'notfound' }
    set({ view })
    const hash = buildHash(lang, view)
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash)
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  },

  goHome: () => get().navigate({ type: 'home' }),
}))

/** Hook pratique : URL complète partageable d'une vue. */
export function useShareUrl(view: View): string {
  const lang = useAppStore((s) => s.lang)
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}${window.location.pathname}${buildHash(lang, view)}`
}
