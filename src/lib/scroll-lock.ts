'use client'

/* ============================================================
 * VERROU DE DÉFILEMENT PARTAGÉ — compteur de références.
 *
 * Deux surfaces verrouillent le défilement de la page : le mode
 * immersif du GameShell et l'invite d'installation PWA. Chacun
 * capturait « sa » valeur précédente de body.overflow pour la
 * restaurer — mais imbriquées (invite ouverte sur l'accueil →
 * entrée dans un jeu avant le tick de courtoisie → fermeture de
 * l'invite), chacune capturait le verrou de l'autre : la dernière
 * restauration réécrivait « hidden » et la page restait figée
 * sans aucun overlay (correctif Task 24).
 *
 * Solution standard (react-remove-scroll) : un compteur. Le
 * premier acquéreur mémorise la valeur d'origine ; le dernier
 * libérateur la restaure. Imbrications et ordres quelconques
 * deviennent sûrs.
 * ============================================================ */

let lockCount = 0
let savedOverflow = ''

/** Verrouille le défilement du body (idempotent par acquéreur :
 *  chaque appel doit être suivi d'exactement un releaseScrollLock). */
export function acquireScrollLock(): void {
  if (typeof document === 'undefined') return
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  lockCount++
}

/** Libère un verrou : ne restaure la valeur d'origine que lorsque
 *  le DERNIER acquéreur restitue le sien. */
export function releaseScrollLock(): void {
  if (typeof document === 'undefined') return
  if (lockCount === 0) return
  lockCount--
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow
  }
}
