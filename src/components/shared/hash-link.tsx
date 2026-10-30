'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { sfx } from '@/lib/sound'
import { buildHash, type View } from '@/lib/app-store'
import { gameRealPath } from '@/lib/games/catalog'
import { useLang } from '@/lib/i18n'

/**
 * HashLink — ancre de navigation interne SEO-friendly (Task 21, audit strict).
 *
 * Rend une VRAIE `<a href="#/fr/…">` suivable par les crawlers (maillage
 * interne crawlable, mots-clés des ancres), tout en conservant à l'identique
 * l'expérience utilisateur de `navigate()` : son de clic, retour en haut de
 * page et navigation par hash sans rechargement (le routeur écoute
 * « hashchange »). Le clic milieu / Cmd+clic ouvre la vue dans un onglet.
 *
 * Task 26 (pages jeu indexables) : les vues JEU pointent vers leur URL
 * RÉELLE canonique (`/fr/jeu-memory` — page individuellement servie et
 * indexable) au lieu du simple hash. Un clic simple reste une navigation
 * hash sans rechargement (parité `navigate()` stricte) ; les clics modifiés
 * (Cmd/Ctrl/Shift/Alt, milieu) ouvrent l'URL réelle — page dédiée du jeu.
 */

export type HashLinkSound = 'click' | 'pop' | null

export function HashLink({
  view,
  sound = 'click',
  onNavigate,
  children,
  ...rest
}: {
  view: View
  /** Son joué au clic ; passer `null` pour un son personnalisé via onNavigate. */
  sound?: HashLinkSound
  /** Callback au moment de la navigation (ex. fermer un menu, jouer un son dédié). */
  onNavigate?: () => void
  children: ReactNode
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  /* Task 22 : useLang (et non le store brut) afin que les ancres SSR de `/?lang=en`
     pointent vers `#/en/…` — maillage interne cohérent avec la langue servie. */
  const lang = useLang()
  /* Task 26 : les vues jeu portent leur URL réelle indexable. */
  const realPath = view.type === 'game' ? gameRealPath(lang, view.slug) : ''

  return (
    <a
      href={realPath || buildHash(lang, view)}
      onClick={(e) => {
        /* Task 26 : clic simple sur un lien jeu → navigation hash SPA identique
         * à navigate() ; clics modifiés → le navigateur ouvre l'URL réelle. */
        if (realPath && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
          e.preventDefault()
        }
        if (sound) sfx.play(sound)
        onNavigate?.()
        /* Parité avec navigate() : retour instantané en haut de la nouvelle vue. */
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        if (realPath && e.defaultPrevented) {
          /* Navigation hash sans rechargement — le routeur écoute « hashchange ». */
          window.location.hash = buildHash(lang, view)
        }
        /* Sans URL réelle : pas de preventDefault — le hash change naturellement
           et le routeur (listener « hashchange » de l'app-store) rend la nouvelle vue. */
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
