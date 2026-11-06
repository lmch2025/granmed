'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export const ADSENSE_CLIENT_ID = 'ca-pub-3034343595064419'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export interface AdSenseSlotProps {
  /** Identifiant du bloc publicitaire AdSense (data-ad-slot). */
  slot: string
  /** Format d'annonce (par défaut : 'auto'). */
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical'
  /** Active le redimensionnement automatique pleine largeur sur mobile. */
  fullWidthResponsive?: boolean
  /** Disposition pour les annonces In-Article / In-Feed. */
  layout?: string
  className?: string
}

/**
 * Composant réutilisable d'emplacement Google AdSense (`ca-pub-3034343595064419`).
 * Non intrusif, isolé du canvas de jeu tactile, compatible SSR et hydratation React 19.
 * Si aucun `slot` n'est transmis, laisse les annonces automatiques (Auto Ads) gérer la page.
 */
export function AdSenseSlot({
  slot,
  format = 'auto',
  fullWidthResponsive = true,
  layout,
  className,
}: AdSenseSlotProps) {
  const pushedRef = useRef(false)

  useEffect(() => {
    if (!slot || pushedRef.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushedRef.current = true
    } catch {
      /* Bloqueur de publicité ou script en cours de chargement — ignoré silencieusement. */
    }
  }, [slot])

  if (!slot) return null

  return (
    <aside
      aria-label="Advertisement"
      className={cn(
        'mx-auto my-6 flex w-full max-w-4xl flex-col items-center justify-center overflow-hidden rounded-2xl',
        className,
      )}
    >
      <ins
        className="adsbygoogle block w-full"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        {...(layout ? { 'data-ad-layout': layout } : {})}
      />
    </aside>
  )
}
