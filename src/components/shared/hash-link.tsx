'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { sfx } from '@/lib/sound'
import { buildHash, type View } from '@/lib/app-store'
import { useLang } from '@/lib/i18n'

/**
 * HashLink — ancre de navigation interne SEO-friendly (Task 21, audit strict).
 *
 * Rend une VRAIE `<a href="#/fr/…">` suivable par les crawlers (maillage
 * interne crawlable, mots-clés des ancres), tout en conservant à l'identique
 * l'expérience utilisateur de `navigate()` : son de clic, retour en haut de
 * page et navigation par hash sans rechargement (le routeur écoute
 * « hashchange »). Le clic milieu / Cmd+clic ouvre la vue dans un onglet.
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

  return (
    <a
      href={buildHash(lang, view)}
      onClick={() => {
        if (sound) sfx.play(sound)
        onNavigate?.()
        /* Parité avec navigate() : retour instantané en haut de la nouvelle vue. */
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        /* Pas de preventDefault : le hash change naturellement et le routeur
           (listener « hashchange » de l'app-store) rend la nouvelle vue. */
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
