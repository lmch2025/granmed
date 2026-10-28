'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Eye, EyeOff, Shuffle, Timer, Play, RotateCcw, Trophy, Puzzle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore } from '@/lib/progress/store'
import { mulberry32, seedFromString, formatMs, clamp, useReducedMotion } from '@/lib/utils-game'
import { computeIq } from '@/lib/games/iq'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'
import { IqChallengeBanner } from '@/components/game/iq-banner'
import { loadSave, saveSave } from '@/lib/save'

export const gameId = 'jigsaw-puzzle'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Reconstituez six illustrations originales en 12, 24 ou 48 pièces — chaque puzzle terminé révèle votre QI estimé — au doigt ou à la souris.',
    en: 'Reassemble six original illustrations in 12, 24 or 48 pieces — every finished puzzle reveals your estimated IQ — by touch or mouse.',
  },
  description: {
    fr: [
      "Souvenirs de Famille est un jeu de puzzle (jigsaw) gratuit en ligne dans lequel vous reconstituez des illustrations originales en faisant glisser les pièces une par une sur le plateau. Six images inédites — champ de lavande, cuisine rustique, chat à la fenêtre, marché de village, jardin fleuri et lac de montagne — vous attendent en 12, 24 ou 48 pièces.",
      'Chaque pièce est découpée dans l’image complète et dispersée dans le bac situé sous le plateau. Faites-la glisser : si elle est lâchée proche de sa case correcte, elle s’y aimante et s’y verrouille définitivement ; sinon, elle reste exactement là où vous l’avez déposée, sur le plateau ou dans le bac. En fin de puzzle, un QI estimé — fonction de votre précision, de votre rapidité et de la taille du puzzle — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'Un bouton œil affiche l’image complète en transparence pour vous guider, un bouton Mélanger redisperse les pièces non posées, un bouton Recommencer relance la même image en un geste, et une barre de progression avec chronomètre suit votre avancée. Sur mobile, plateau et bac à pièces tiennent ensemble à l’écran, sans le moindre défilement. Vos meilleurs temps par taille sont sauvegardés, la galerie des puzzles terminés est conservée, et une partie en cours est automatiquement reprise.',
    ],
    en: [
      "Family Memories is a free online jigsaw puzzle game in which you reassemble original illustrations by dragging pieces one by one onto the board. Six exclusive images — lavender field, rustic kitchen, cat by the window, village market, blooming garden and mountain lake — await you in 12, 24 or 48 pieces.",
      'Each piece is cut from the complete image and scattered in the tray below the board. Drag it around: if you drop it near its correct cell it snaps and locks into place for good; otherwise it stays exactly where you left it, on the board or in the tray. When you finish a puzzle, an estimated IQ — based on your accuracy, speed and puzzle size — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'An eye button shows the full image as a translucent guide, a Shuffle button rescatters the unplaced pieces, a Restart button relaunches the same image in one tap, and a progress bar with a timer tracks your run. On mobile, board and piece tray fit together on screen with zero scrolling. Your best times per size are saved, the gallery of finished puzzles is kept, and a game in progress is automatically resumed.',
    ],
  },
  rules: {
    fr: [
      "Choisissez une image, puis un nombre de pièces : 12 (facile), 24 (moyen) ou 48 (patient).",
      'Les pièces sont dispersées dans le bac sous le plateau ; aucune rotation n’est nécessaire.',
      'Faites glisser une pièce : relâchez-la près de sa case correcte pour qu’elle s’y colle et s’y verrouille.',
      'Une pièce lâchée au mauvais endroit reste où elle est — vous pouvez la reprendre et la déplacer autant de fois que nécessaire.',
      'Le puzzle est terminé quand toutes les pièces sont verrouillées : votre temps est alors enregistré.',
    ],
    en: [
      'Pick an image, then a piece count: 12 (easy), 24 (medium) or 48 (patient).',
      'Pieces are scattered in the tray below the board; no rotation is ever needed.',
      'Drag a piece: release it near its correct cell and it snaps and locks into place.',
      'A piece dropped in the wrong spot stays there — you can pick it up and move it again as often as you like.',
      'The puzzle is complete when every piece is locked in: your time is then recorded.',
    ],
  },
  controls: {
    fr: [
      'Mobile et ordinateur : appuyez sur une pièce puis faites-la glisser avec le doigt ou la souris, et relâchez pour la déposer.',
      'Bouton œil : affiche ou masque l’image complète en transparence sur le plateau.',
      'Bouton Mélanger : redisperse dans le bac les pièces non encore verrouillées.',
      'Bouton Recommencer (flèche circulaire) : relance immédiatement la même image, pièces redispersées.',
      'Bouton retour (flèche) : revenir à l’écran de choix des images — la partie en cours est sauvegardée.',
    ],
    en: [
      'Mobile and desktop: press a piece, drag it with your finger or mouse, then release to drop it.',
      'Eye button: toggles the full image shown faintly over the board.',
      'Shuffle button: rescatters the not-yet-locked pieces back into the tray.',
      'Restart button (circular arrow): immediately relaunches the same image with pieces rescattered.',
      'Back button (arrow): return to the image selection screen — your game in progress is saved.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Six illustrations originales 1024×1024 créées pour Granmed, sans rotation de pièces.',
      'Trois tailles par image : 12, 24 ou 48 pièces, avec meilleurs temps conservés séparément.',
      'Aimantation généreuse : la pièce se colle dès qu’elle est lâchée à moins de la moitié d’une pièce d’écart, avec transition douce et bref anneau vert de confirmation.',
      'Bouton d’aperçu (image fantôme à 40 % d’opacité), bouton Mélanger et bouton Recommencer.',
      'Barre de progression, chronomètre avec pause automatique quand l’onglet est masqué.',
      'Plateau et bac à pièces dimensionnés pour tenir ensemble à l’écran sur mobile, sans défilement.',
      'Galerie persistante des puzzles terminés (✅ + meilleur temps) et reprise automatique de la partie en cours.',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      'Six original 1024×1024 illustrations created for Granmed, with no piece rotation.',
      'Three sizes per image: 12, 24 or 48 pieces, each with its own saved best time.',
      'Generous snapping: a piece locks as soon as it is dropped within half a piece of its cell, with a smooth transition and a brief green ring.',
      'Preview toggle (ghost image at 40% opacity), Shuffle button and Restart button.',
      'Progress bar and timer that automatically pauses when the tab is hidden.',
      'Board and piece tray sized to fit together on a phone screen, with zero scrolling.',
      'Persistent gallery of finished puzzles (✅ + best time) and automatic resume of unfinished games.',
    ],
  },
  tips: {
    fr: [
      'Commencez par les pièces aux couleurs très reconnaissables (ciel, coin de table, robe du chat) : elles se plaquent vite au bon endroit.',
      'Gardez le bouton œil activé par intermittence : l’image fantôme à 40 % suffit à se repérer sans mâcher le travail.',
      'Rangez les pièces douteuses dans un coin du bac : un bac organisé fait gagner plus de temps que la vitesse de glisser.',
      'Les bords de l’image et les lignes fortes (horizon, bord de fenêtre) forment un cadre naturel à monter en premier.',
      'En 48 pièces, procédez par zones de couleur plutôt que pièce par pièce : le chronomètre vous remerciera.',
    ],
    en: [
      'Start with easily recognizable colors (sky, table corner, the cat’s fur): they snap into place quickly.',
      'Keep the eye button on intermittently: the 40% ghost image is enough to get your bearings without doing the work for you.',
      'Park doubtful pieces in a corner of the tray: an organized tray saves more time than fast dragging.',
      'Image edges and strong lines (horizon, window frame) make a natural frame to build first.',
      'On 48 pieces, work by color areas rather than piece by piece: your timer will thank you.',
    ],
  },
  faq: {
    fr: [
      { q: 'Faut-il faire tourner les pièces ?', a: 'Non, aucune rotation n’est nécessaire : chaque pièce est déjà dans le bon sens, il suffit de la placer au bon endroit.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé combine trois dimensions mesurées pendant le puzzle : la précision (un puzzle reconstitué sans jamais utiliser l’aperçu de l’image vaut la note parfaite, chaque recours à cette aide la réduit légèrement), la rapidité (temps réel comparé au temps attendu, environ 14 secondes par pièce) et la difficulté (12, 24 ou 48 pièces). Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce puzzle — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour gagner en vitesse et en repérage.' },
      { q: 'Comment une pièce sait-elle où se coller ?', a: 'Quand vous relâchez une pièce, sa position est comparée à celle de sa case correcte : à moins de la moitié de la largeur d’une pièce, elle s’y aimante et s’y verrouille — un rayon qui s’adapte à la taille des pièces et reste confortable au doigt.' },
      { q: 'Puis-je revoir l’image complète ?', a: 'Oui, le bouton œil affiche l’image en transparence (40 % d’opacité) sur le plateau, autant de fois que vous le souhaitez.' },
      { q: 'Que fait le bouton Mélanger ?', a: 'Il redisperse uniquement les pièces non verrouillées dans le bac — les pièces déjà placées ne bougent jamais.' },
      { q: 'Ma partie est-elle sauvegardée si je quitte ?', a: 'Oui : pièces posées, positions des pièces libres et temps écoulé sont enregistrés automatiquement, et une invitation à reprendre s’affiche à votre retour.' },
    ],
    en: [
      { q: 'Do I need to rotate pieces?', a: 'No, no rotation is ever required: every piece is already facing the right way, you only need to place it correctly.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ combines three dimensions measured during the puzzle: accuracy (a puzzle rebuilt without ever using the image preview earns a perfect score, and each use of that help slightly lowers it), speed (actual time compared with the expected time, roughly 14 seconds per piece) and difficulty (12, 24 or 48 pieces). The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this puzzle — not a clinical IQ test — and the best way to raise it is to keep playing to get faster and sharper at spotting pieces.' },
      { q: 'How does a piece know where to snap?', a: 'When you release a piece, its position is compared with its correct cell’s: within half a piece’s width, it snaps and locks there — a radius that adapts to the piece size and stays comfortable for fingers.' },
      { q: 'Can I see the full image again?', a: 'Yes, the eye button shows the image faintly (40% opacity) over the board, as often as you like.' },
      { q: 'What does the Shuffle button do?', a: 'It only rescatters the unplaced pieces into the tray — locked pieces never move.' },
      { q: 'Is my game saved if I leave?', a: 'Yes: locked pieces, free-piece positions and elapsed time are saved automatically, and a resume prompt appears when you come back.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-time-12': { fr: 'Meilleur temps — 12 pièces', en: 'Best time — 12 pieces' },
    'best-time-24': { fr: 'Meilleur temps — 24 pièces', en: 'Best time — 24 pieces' },
    'best-time-48': { fr: 'Meilleur temps — 48 pièces', en: 'Best time — 48 pieces' },
  },
}

/* ================= Données ================= */
interface JigImage {
  id: string
  src: string
  title: { fr: string; en: string }
}

const IMAGES: JigImage[] = [
  { id: 'lavender', src: '/images/jigsaw-lavender.png', title: { fr: 'Champ de lavande', en: 'Lavender field' } },
  { id: 'kitchen', src: '/images/jigsaw-kitchen.png', title: { fr: 'Cuisine rustique', en: 'Rustic kitchen' } },
  { id: 'cat', src: '/images/jigsaw-cat.png', title: { fr: 'Chat à la fenêtre', en: 'Cat by the window' } },
  { id: 'market', src: '/images/jigsaw-market.png', title: { fr: 'Marché de village', en: 'Village market' } },
  { id: 'garden', src: '/images/jigsaw-garden.png', title: { fr: 'Jardin fleuri', en: 'Blooming garden' } },
  { id: 'lake', src: '/images/jigsaw-lake.png', title: { fr: 'Lac de montagne', en: 'Mountain lake' } },
]

const COUNTS = [12, 24, 48]
/** Écart plateau / bac (mt-2) et marge interne du bac pour l'éparpillement. */
const GAP = 8
const PAD = 8
/** Hauteur de bac provisoire avant la première mesure réelle. */
const TRAY_FALLBACK = 200

function dimsFor(count: number): { cols: number; rows: number } {
  if (count === 12) return { cols: 4, rows: 3 }
  if (count === 24) return { cols: 6, rows: 4 }
  return { cols: 8, rows: 6 }
}

function fmtSec(s: number): string {
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Rayon d'aimantation proportionnel à la pièce (confortable au doigt, borné). */
function snapRadius(pw: number, ph: number): number {
  return clamp(0.5 * Math.min(pw, ph), 20, 48)
}

interface Piece {
  id: number
  row: number
  col: number
  /** Position libre (coin haut-gauche, px dans la zone de jeu) — ignorée si verrouillée. */
  x: number
  y: number
  locked: boolean
}

interface PlayState {
  imageId: string
  count: number
  pieces: Piece[]
}

interface Progress {
  imageId: string
  count: number
  locked: boolean[]
  /** v2 : positions normalisées (fractions de la zone de jeu) ; v1 : pixels bruts. */
  pos: { x: number; y: number }[]
  elapsed: number
  v?: 2
}

interface JigStore {
  gallery: Record<string, number>
  progress: Progress | null
}

/* ================= Textes locaux ================= */
const STR = {
  fr: {
    selectHint: 'Choisissez une image, un nombre de pièces, puis reconstituez le souvenir.',
    selectImage: 'Sélectionnez une image pour commencer.',
    pieces: 'pièces',
    done: 'terminés',
    savedGame: 'Partie en cours',
    placed: 'pièces posées',
    resumeShort: 'Reprendre',
    preview: 'Aperçu de l’image',
    shuffle: 'Mélanger les pièces',
    otherImages: 'Autres images',
    tray: 'Bac des pièces — faites-les glisser sur le plateau',
    dragHint: 'Faites glisser les pièces : elles se collent quand elles sont proches de leur place.',
    boardLabel: 'Plateau du puzzle',
    shareWin: 'Puzzle {n} pièces en {t}',
  },
  en: {
    selectHint: 'Pick an image, a piece count, then reassemble the memory.',
    selectImage: 'Select an image to begin.',
    pieces: 'pieces',
    done: 'done',
    savedGame: 'Game in progress',
    placed: 'pieces placed',
    resumeShort: 'Resume',
    preview: 'Image preview',
    shuffle: 'Shuffle pieces',
    otherImages: 'Other images',
    tray: 'Piece tray — drag pieces onto the board',
    dragHint: 'Drag the pieces: they snap when close to their spot.',
    boardLabel: 'Puzzle board',
    shareWin: '{n}-piece puzzle in {t}',
  },
}

/** Haptique légère (no-op propre sur navigateurs sans vibration). */
function buzz(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* ignoré */
  }
}

/** Éparpillement « meilleur candidat » : essaie plusieurs positions et garde
 *  la plus éloignée des pièces déjà posées — bac aéré sans chevauchement massif. */
function scatterOne(
  rand: () => number,
  placed: { x: number; y: number }[],
  pw: number,
  ph: number,
  w: number,
  trayH: number,
): { x: number; y: number } {
  const top = w + GAP + PAD
  const maxX = Math.max(1, w - pw - PAD * 2)
  const maxY = Math.max(1, trayH - ph - PAD * 2)
  let bestX = PAD
  let bestY = top + PAD
  let bestD = -1
  for (let k = 0; k < 8; k++) {
    const x = PAD + rand() * maxX
    const y = top + PAD + rand() * maxY
    let d = Infinity
    for (const q of placed) {
      const dd = Math.hypot(q.x - x, q.y - y)
      if (dd < d) d = dd
    }
    if (d > bestD) {
      bestD = d
      bestX = x
      bestY = y
    }
  }
  return { x: bestX, y: bestY }
}

/* ================= Composant principal ================= */
export default function JigsawPuzzleGame() {
  const t = useT()
  const lang = useLang()
  const L = STR[lang]
  const reduce = useReducedMotion()
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)

  const [sel, setSel] = useState<string | null>(null)
  const [cnt, setCnt] = useState<number>(12)
  const [game, setGame] = useState<PlayState | null>(null)
  const [restored, setRestored] = useState<Progress | null>(null)
  const [gallery, setGallery] = useState<Record<string, number>>({})
  const [won, setWon] = useState<{ seconds: number; isRecord: boolean; xp: number; stars: number; iq: number } | null>(null)
  const [areaW, setAreaW] = useState(0)
  const [trayH, setTrayH] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [snapFx, setSnapFx] = useState<number | null>(null)
  const [bumpId, setBumpId] = useState<number | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [confettiKey, setConfettiKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)
  const [dealKey, setDealKey] = useState(0)

  const areaRef = useRef<HTMLDivElement>(null)
  const trayRef = useRef<HTMLDivElement>(null)
  const replayBtnRef = useRef<HTMLButtonElement>(null)
  const gameRef = useRef<PlayState | null>(null)
  const galleryRef = useRef<Record<string, number>>({})
  const areaWRef = useRef(0)
  const trayHRef = useRef(0)
  const areaHRef = useRef(0)
  const elapsedBaseRef = useRef(0)
  const runningSinceRef = useRef<number | null>(null)
  const dragRef = useRef<{ id: number; pointerId: number; startX: number; startY: number; origX: number; origY: number } | null>(null)
  const snapLockRef = useRef<Set<number>>(new Set())
  const timersRef = useRef<Set<number>>(new Set())
  const genRef = useRef(0)
  const lastStartRef = useRef(0)
  /* Aperçu œil utilisé pendant la manche (3 étoiles uniquement sans aide). */
  const usedPreviewRef = useRef(false)

  const playing = game != null && won == null

  function updateGame(g: PlayState | null) {
    gameRef.current = g
    setGame(g)
  }

  function getElapsed(): number {
    return elapsedBaseRef.current + (runningSinceRef.current != null ? Date.now() - runningSinceRef.current : 0)
  }

  function totalAreaH(): number {
    return areaHRef.current || areaWRef.current + GAP + TRAY_FALLBACK
  }

  function setTimer(fn: () => void, ms: number): void {
    const id = window.setTimeout(() => {
      timersRef.current.delete(id)
      fn()
    }, ms)
    timersRef.current.add(id)
  }

  function clearTimers(): void {
    for (const id of timersRef.current) window.clearTimeout(id)
    timersRef.current.clear()
  }

  function toProgress(g: PlayState): Progress {
    const w = areaWRef.current || 1
    const h = totalAreaH() || 1
    return {
      v: 2,
      imageId: g.imageId,
      count: g.count,
      locked: g.pieces.map((p) => p.locked),
      pos: g.pieces.map((p) => ({ x: clamp(p.x / w, 0, 1), y: clamp(p.y / h, 0, 1) })),
      elapsed: getElapsed(),
    }
  }

  /* --- Restauration au montage (callback asynchrone, jamais dans le corps d'effet) --- */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      if (!alive) return
      const s = loadSave<JigStore>(gameId)
      if (!s) return
      if (s.gallery && typeof s.gallery === 'object') {
        const clean: Record<string, number> = {}
        for (const [k, v] of Object.entries(s.gallery)) {
          if (typeof v === 'number' && Number.isFinite(v) && v > 0 && v < 604800) clean[k] = Math.round(v)
        }
        galleryRef.current = clean
        setGallery(clean)
      }
      const p = s.progress
      if (
        p &&
        typeof p.imageId === 'string' &&
        IMAGES.some((im) => im.id === p.imageId) &&
        COUNTS.includes(p.count) &&
        Array.isArray(p.locked) &&
        Array.isArray(p.pos) &&
        p.locked.length === p.count &&
        p.pos.length === p.count &&
        p.pos.every((q) => q && Number.isFinite(q.x) && Number.isFinite(q.y))
      ) {
        setRestored({
          imageId: p.imageId,
          count: p.count,
          locked: p.locked.map((lk) => !!lk),
          pos: p.pos.map((q) => ({
            x: p.v === 2 ? clamp(q.x, -0.5, 1.5) : q.x,
            y: p.v === 2 ? clamp(q.y, -0.5, 1.5) : q.y,
          })),
          elapsed: Number.isFinite(p.elapsed) && p.elapsed > 0 ? Math.min(p.elapsed, 7 * 24 * 3600 * 1000) : 0,
          v: p.v === 2 ? 2 : undefined,
        })
      }
    })
    return () => {
      alive = false
    }
  }, [])

  /* --- Sauvegarde automatique (positions + temps) --- */
  useEffect(() => {
    if (!game || won) return
    saveSave(gameId, { gallery: galleryRef.current, progress: toProgress(game) })
  }, [game, won])

  /* --- Sauvegarde périodique du temps écoulé --- */
  useEffect(() => {
    if (!game || won) return
    const g = game
    const id = window.setInterval(() => {
      saveSave(gameId, { gallery: galleryRef.current, progress: toProgress(g) })
    }, 5000)
    return () => window.clearInterval(id)
  }, [game, won])

  /* --- Chronomètre : affichage + pause quand l'onglet est masqué --- */
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setElapsedMs(getElapsed()), 500)
    const onVis = () => {
      if (document.hidden) {
        if (runningSinceRef.current != null) {
          elapsedBaseRef.current += Date.now() - runningSinceRef.current
          runningSinceRef.current = null
        }
      } else if (runningSinceRef.current == null) {
        runningSinceRef.current = Date.now()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
      if (runningSinceRef.current != null) {
        elapsedBaseRef.current += Date.now() - runningSinceRef.current
        runningSinceRef.current = null
      }
    }
  }, [playing])

  /* --- Nettoyage global au démontage --- */
  useEffect(() => {
    return () => {
      clearTimers()
      genRef.current++
    }
  }, [])

  /* --- Focus clavier sur « Rejouer » dès l'écran de victoire --- */
  useEffect(() => {
    if (won) replayBtnRef.current?.focus({ preventScroll: true })
  }, [won])

  /* --- Dimensionnement de la zone de jeu (plateau + bac) :
         la largeur est bornée par le conteneur ET par le budget vertical
         (plateau + bac tiennent exactement dans l'écran, sans scroll),
         avec un bac jamais plus bas qu'une pièce du pire cas (12 pièces).
         ResizeObserver (conteneur + aire, déclenche à l'attachement) et
         resize fenêtre (barre d'URL mobile) rappellent le calcul ; les
         pièces libres sont mises à l'échelle proportionnellement. --- */
  function availableSpace(): number {
    const area = areaRef.current
    if (!area) return -1
    const topDoc = area.getBoundingClientRect().top + window.scrollY
    return window.innerHeight - topDoc - 24 // ligne d'aide + marge
  }

  function applyAreaSize(measuredW: number, measuredTh: number) {
    const area = areaRef.current
    if (!area) return
    const containerW = area.parentElement?.clientWidth ?? 0
    const baseW = containerW > 0 ? containerW : measuredW
    if (baseW <= 0) return
    const avail = availableSpace()
    const cssCap = Math.min(420, Math.max(180, window.innerHeight - 412))
    let w: number
    let th: number
    if (avail <= 0) {
      w = Math.min(baseW, cssCap)
      th = measuredTh > 0 ? measuredTh : TRAY_FALLBACK
    } else {
      // Pire cas vertical : 12 pièces → 3 lignes → pièce = plateau/3.
      let trayMin = 132
      w = Math.min(baseW, cssCap, avail - GAP - trayMin)
      trayMin = Math.max(132, w / 3 + 20)
      w = Math.min(baseW, cssCap, avail - GAP - trayMin)
      th = clamp(avail - w - GAP, trayMin, 280)
    }
    w = Math.round(clamp(w, 180, 420))
    th = Math.min(Math.round(th), Math.max(132, Math.floor(avail > 0 ? avail - w - GAP : th)))
    const h = w + GAP + th
    if (w === areaWRef.current && th === trayHRef.current) return
    const prevW = areaWRef.current
    const prevH = areaHRef.current
    const g = gameRef.current
    if (g && prevW > 0 && prevH > 0 && (w !== prevW || h !== prevH)) {
      const fx = w / prevW
      const fy = h / prevH
      const dragged = dragRef.current?.id
      updateGame({
        ...g,
        pieces: g.pieces.map((p) =>
          p.locked || p.id === dragged ? p : { ...p, x: p.x * fx, y: p.y * fy },
        ),
      })
    }
    areaWRef.current = w
    trayHRef.current = th
    areaHRef.current = h
    setAreaW(w)
    setTrayH(th)
  }

  function measureNow() {
    window.requestAnimationFrame(() => {
      const el = areaRef.current
      if (el) applyAreaSize(el.clientWidth, trayRef.current?.clientHeight ?? 0)
    })
  }

  const inGame = game != null
  useEffect(() => {
    if (!inGame) return
    const area = areaRef.current
    if (!area) return
    const measure = () => applyAreaSize(area.clientWidth, trayRef.current?.clientHeight ?? 0)
    const ro = new ResizeObserver(measure)
    ro.observe(area)
    if (area.parentElement) ro.observe(area.parentElement)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [inGame])

  /* --- Estimation de la largeur avant la première mesure réelle (corrigée au rAF) --- */
  function provisionalSize(): number {
    const byWidth = window.innerWidth - 58
    const byHeight = window.innerHeight - 412
    return Math.max(200, Math.min(byWidth, byHeight, 420))
  }

  /* --- Démarrage d'une partie (image + taille) --- */
  function startGame(imageId: string, count: number) {
    const now = Date.now()
    if (now - lastStartRef.current < 350) return
    lastStartRef.current = now
    clearTimers()
    genRef.current++
    snapLockRef.current.clear()
    dragRef.current = null
    const { cols, rows } = dimsFor(count)
    const w = provisionalSize()
    const pw = w / cols
    const ph = w / rows
    const rand = mulberry32(seedFromString(`jigsaw:${imageId}:${count}`))
    const placed: { x: number; y: number }[] = []
    const pieces: Piece[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pos = scatterOne(rand, placed, pw, ph, w, TRAY_FALLBACK)
        placed.push(pos)
        pieces.push({ id: r * cols + c, row: r, col: c, locked: false, x: pos.x, y: pos.y })
      }
    }
    elapsedBaseRef.current = 0
    runningSinceRef.current = Date.now()
    usedPreviewRef.current = false
    areaWRef.current = w
    trayHRef.current = TRAY_FALLBACK
    areaHRef.current = w + GAP + TRAY_FALLBACK
    setElapsedMs(0)
    setWon(null)
    setDraggingId(null)
    setSnapFx(null)
    setBumpId(null)
    setRestored(null)
    setAreaW(w)
    setDealKey((k) => k + 1)
    updateGame({ imageId, count, pieces })
    addPlay(gameId)
    sfx.play('pop')
    measureNow()
  }

  /* --- Reprise de la partie sauvegardée (positions normalisées, remises à l'échelle) --- */
  function resumeGame() {
    if (!restored) return
    const now = Date.now()
    if (now - lastStartRef.current < 350) return
    lastStartRef.current = now
    clearTimers()
    genRef.current++
    snapLockRef.current.clear()
    dragRef.current = null
    const { cols, rows } = dimsFor(restored.count)
    const w = provisionalSize()
    const pw = w / cols
    const ph = w / rows
    const areaH = w + GAP + TRAY_FALLBACK
    const pieces: Piece[] = restored.locked.map((lk, i) => {
      const r = Math.floor(i / cols)
      const c = i % cols
      const sp = restored.pos[i] ?? { x: 0.5, y: 0.8 }
      let px: number
      let py: number
      if (restored.v === 2) {
        px = sp.x * w
        py = sp.y * areaH
      } else {
        // Sauvegarde héritée (v1, pixels bruts) : simple rabattement dans les bornes.
        px = sp.x
        py = sp.y
      }
      const locked = !!lk
      if (locked) {
        px = c * pw
        py = r * ph
      } else {
        px = clamp(px, -pw * 0.25, w - pw * 0.75)
        py = clamp(py, -ph * 0.25, areaH - ph * 0.75)
      }
      return { id: i, row: r, col: c, locked, x: px, y: py }
    })
    elapsedBaseRef.current = restored.elapsed || 0
    runningSinceRef.current = Date.now()
    usedPreviewRef.current = false
    areaWRef.current = w
    trayHRef.current = TRAY_FALLBACK
    areaHRef.current = areaH
    setElapsedMs(restored.elapsed || 0)
    setWon(null)
    setDraggingId(null)
    setSnapFx(null)
    setBumpId(null)
    setRestored(null)
    setAreaW(w)
    setDealKey((k) => k + 1)
    const nextGame: PlayState = { imageId: restored.imageId, count: restored.count, pieces }
    updateGame(nextGame)
    addPlay(gameId)
    sfx.play('pop')
    measureNow()
    // Filet de sécurité : une sauvegarde intégralement verrouillée (victoire interrompue
    // pendant le délai de célébration) déclenche la victoire à la reprise.
    if (pieces.every((p) => p.locked)) {
      setTimer(() => finishWin(nextGame), 300)
    }
  }

  function discardRestored() {
    sfx.play('click')
    setRestored(null)
    saveSave(gameId, { gallery: galleryRef.current, progress: null })
  }

  function backToSelection() {
    sfx.play('click', { volume: 0.5 })
    const g = gameRef.current
    clearTimers()
    genRef.current++
    snapLockRef.current.clear()
    dragRef.current = null
    setDraggingId(null)
    setSnapFx(null)
    setBumpId(null)
    setWon(null)
    setShowPreview(false)
    if (g && won == null) {
      // La partie en cours redevient une proposition de reprise (et reste sauvegardée).
      const p = toProgress(g)
      setRestored(p)
      setSel(g.imageId)
      setCnt(g.count)
      saveSave(gameId, { gallery: galleryRef.current, progress: p })
    }
    updateGame(null)
  }

  /* --- Victoire (appelée depuis le timeout de pose, jamais depuis un effet) --- */
  function finishWin(g: PlayState) {
    const ms = getElapsed()
    elapsedBaseRef.current = ms
    runningSinceRef.current = null
    setElapsedMs(ms)
    const seconds = Math.max(1, Math.round(ms / 1000))
    const isRecord = setBest(gameId, `best-time-${g.count}`, seconds, true)
    /* QI estimé (Task 18) : précision = 1 sans aperçu de l'image, 0,9 si l'aide
     * a servi (compteur booléen : −0,1 par usage) ; rapidité = par (≈ 14 s/pièce)
     * ÷ temps réel ; difficulté = 12 pièces 1, 24 pièces 2, 48 pièces 3. */
    const iq = computeIq(gameId, {
      accuracy: usedPreviewRef.current ? 0.9 : 1,
      speed: (g.count * 14) / seconds,
      difficulty: g.count === 48 ? 3 : g.count === 24 ? 2 : 1,
    })
    const xp = g.count === 12 ? 30 : g.count === 24 ? 60 : 120
    // Niveau de jeu : victoire 25-30 XP selon la taille du puzzle.
    addGameXp(gameId, g.count === 48 ? 30 : g.count === 24 ? 28 : 25)
    // 3 étoiles sans aucun aperçu œil et à un rythme record, 2 sinon.
    const stars = !usedPreviewRef.current && isRecord ? 3 : 2
    const key = `${g.imageId}:${g.count}`
    sfx.play('win')
    buzz(25)
    setConfettiKey((k) => k + 1)
    setBurstKey((k) => k + 1)
    addWin(gameId)
    addXp(xp)
    if (g.count === 48) unlockBadge('jigsaw-48')
    const prev = galleryRef.current[key]
    const nextGallery = { ...galleryRef.current }
    if (prev == null || seconds < prev) nextGallery[key] = seconds
    galleryRef.current = nextGallery
    setGallery(nextGallery)
    saveSave(gameId, { gallery: nextGallery, progress: null })
    setWon({ seconds, isRecord, xp, stars, iq })
  }

  /* --- Glisser-déposer (Pointer Events + capture, position impérative) --- */
  function onPieceDown(e: React.PointerEvent<HTMLDivElement>, p: Piece) {
    if (!game || won != null || p.locked || dragRef.current != null) return
    if (snapLockRef.current.has(p.id)) return
    e.preventDefault()
    const el = e.currentTarget
    try {
      el.setPointerCapture(e.pointerId)
    } catch {
      /* ignoré */
    }
    dragRef.current = { id: p.id, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, origX: p.x, origY: p.y }
    setDraggingId(p.id)
    sfx.play('pop', { volume: 0.25 })
  }

  function onPieceMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId) return
    const el = e.currentTarget
    el.style.left = `${d.origX + (e.clientX - d.startX)}px`
    el.style.top = `${d.origY + (e.clientY - d.startY)}px`
  }

  function onPieceUp(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId) return
    dragRef.current = null
    setDraggingId(null)
    const g = gameRef.current
    const el = e.currentTarget
    const piece = g?.pieces.find((x) => x.id === d.id)
    if (!g || !piece || piece.locked) {
      el.style.transition = ''
      return
    }
    const { cols, rows } = dimsFor(g.count)
    const w = areaWRef.current
    const pw = w / cols
    const ph = w / rows
    // Position réellement affichée (style impératif inclus) — jamais de saut.
    const nx = el.offsetLeft
    const ny = el.offsetTop

    // Aimantation : distance du coin au coin (équivalente centre-centre, la pièce
    // et sa case ayant exactement les mêmes dimensions).
    const tx = piece.col * pw
    const ty = piece.row * ph
    if (Math.hypot(nx - tx, ny - ty) <= snapRadius(pw, ph)) {
      snapLockRef.current.add(piece.id)
      sfx.play('drop')
      buzz(10)
      // Transition posée directement sur le DOM, commit d'état après l'atterrissage.
      el.style.transition = 'left 160ms ease-out, top 160ms ease-out'
      el.style.left = `${tx}px`
      el.style.top = `${ty}px`
      const gen = genRef.current
      setTimer(() => {
        el.style.transition = ''
        snapLockRef.current.delete(piece.id)
        if (genRef.current !== gen) return
        const g2 = gameRef.current
        if (!g2) return
        const pieces = g2.pieces.map((x) => (x.id === piece.id ? { ...x, x: tx, y: ty, locked: true } : x))
        updateGame({ ...g2, pieces })
        setBumpId(piece.id)
        setSnapFx(piece.id)
        setTimer(() => setSnapFx(null), 500)
        if (pieces.every((x) => x.locked)) {
          // Petit délai pour laisser voir la dernière pièce se verrouiller.
          setTimer(() => {
            if (genRef.current === gen) finishWin(g2)
          }, 420)
        }
      }, 170)
    } else {
      const areaH = totalAreaH()
      const cx = clamp(nx, -pw * 0.25, w - pw * 0.75)
      const cy = clamp(ny, -ph * 0.25, areaH - ph * 0.75)
      if (cx !== nx || cy !== ny) {
        el.style.transition = 'left 120ms ease-out, top 120ms ease-out'
        setTimer(() => {
          el.style.transition = ''
        }, 140)
      }
      sfx.play('flip', { volume: 0.35 })
      const pieces = g.pieces.map((x) => (x.id === piece.id ? { ...x, x: cx, y: cy } : x))
      updateGame({ ...g, pieces })
      setBumpId(piece.id)
    }
  }

  function onPieceCancel(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId) return
    dragRef.current = null
    setDraggingId(null)
    const el = e.currentTarget
    // Annulation propre : la pièce regagne sa position de départ.
    el.style.transition = 'left 140ms ease-out, top 140ms ease-out'
    el.style.left = `${d.origX}px`
    el.style.top = `${d.origY}px`
    setTimer(() => {
      el.style.transition = ''
    }, 150)
    sfx.play('flip', { volume: 0.3 })
  }

  /* --- Mélanger : redisperse les pièces non verrouillées dans le bac --- */
  function reshuffle() {
    const g = gameRef.current
    if (!g || won != null) return
    if (g.pieces.every((p) => p.locked)) return
    sfx.play('swish')
    const { cols, rows } = dimsFor(g.count)
    const w = areaWRef.current
    const pw = w / cols
    const ph = w / rows
    const trayH = trayHRef.current || TRAY_FALLBACK
    const dragged = dragRef.current?.id
    const placed: { x: number; y: number }[] = []
    const pieces = g.pieces.map((p) => {
      if (p.locked || p.id === dragged) {
        if (!p.locked) placed.push({ x: p.x, y: p.y })
        return p
      }
      const pos = scatterOne(Math.random, placed, pw, ph, w, trayH)
      placed.push(pos)
      return { ...p, x: pos.x, y: pos.y }
    })
    updateGame({ ...g, pieces })
  }

  /* ================= Rendu ================= */
  const img = game ? IMAGES.find((im) => im.id === game.imageId) ?? null : null
  const selImg = sel ? IMAGES.find((im) => im.id === sel) ?? null : null
  const dims = game ? dimsFor(game.count) : null
  const pw = game && dims && areaW > 0 ? areaW / dims.cols : 0
  const ph = game && dims && areaW > 0 ? areaW / dims.rows : 0
  const lockedCount = game ? game.pieces.filter((p) => p.locked).length : 0
  const pct = game ? Math.round((lockedCount / game.count) * 100) : 0
  const doneTotal = COUNTS.reduce((n, c) => n + Object.keys(gallery).filter((k) => k.endsWith(`:${c}`)).length, 0)
  /* Ligne de résultat partageable (victoire) : taille du puzzle + temps réel. */
  const shareResult =
    won != null && game ? L.shareWin.replace('{n}', String(game.count)).replace('{t}', fmtSec(won.seconds)) : undefined

  return (
    <div className="no-select relative select-none my-auto w-full">
      <Confetti fire={confettiKey} count={reduce ? 0 : 110} waves={2} gold />
      <VictoryBurst fire={burstKey} stars={won?.stars ?? 3} />

      {/* Bandeau de reprise */}
      {restored && !game ? (
        <div className="mb-3 flex flex-wrap items-center gap-2.5 rounded-2xl border-2 border-amber-300/60 bg-amber-50 px-3 py-2.5 dark:border-amber-500/25 dark:bg-amber-500/10">
          <span className="text-2xl" aria-hidden="true">🧩</span>
          <span className="min-w-0 flex-1 text-sm">
            <span className="block font-bold text-amber-700 dark:text-amber-300">{L.savedGame}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {IMAGES.find((im) => im.id === restored.imageId)?.title[lang]} · {restored.count} {L.pieces} ·{' '}
              {restored.locked.filter(Boolean).length}/{restored.count} {L.placed}
            </span>
          </span>
          <Button size="lg" className="h-11 rounded-full" onClick={resumeGame}>
            {L.resumeShort}
          </Button>
          <Button size="lg" variant="secondary" className="h-11 rounded-full" onClick={discardRestored}>
            {t('game.newGame')}
          </Button>
        </div>
      ) : null}

      {!game ? (
        /* ================= Écran de sélection (compact : Jouer visible sans scroll) ================= */
        <div>
          {/* Défi QI bienveillant — mis en avant dès l'ouverture (Task 19) */}
          <IqChallengeBanner gameId={gameId} />
          <p className="mb-2 text-sm text-muted-foreground">
            {L.selectHint} <span className="font-semibold">{doneTotal}/18</span> {L.done}.
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {IMAGES.map((im) => {
              const done = COUNTS.filter((c) => gallery[`${im.id}:${c}`] != null).length
              const isSel = sel === im.id
              return (
                <button
                  key={im.id}
                  type="button"
                  aria-pressed={isSel}
                  onClick={() => {
                    sfx.play('click', { volume: 0.5 })
                    setSel(im.id)
                  }}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border-2 bg-card text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]',
                    isSel ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/40',
                  )}
                >
                  <img
                    src={im.src}
                    alt={im.title[lang]}
                    width={512}
                    height={512}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="aspect-square w-full object-cover transition-transform group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-stone-900/75 to-transparent px-1.5 pb-1 pt-3 text-[10px] font-semibold text-white">
                    {im.title[lang]}
                  </span>
                  {done > 0 ? (
                    <span className="absolute right-1 top-1 rounded-full bg-stone-900/70 px-1.5 text-[10px] font-bold text-white">
                      ✅{done}/3
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="mt-3 rounded-2xl border bg-card p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('common.size')}>
              {COUNTS.map((c) => {
                const best = sel ? gallery[`${sel}:${c}`] : undefined
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={cnt === c}
                    onClick={() => {
                      sfx.play('click', { volume: 0.5 })
                      setCnt(c)
                    }}
                    className={cn(
                      'flex h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]',
                      cnt === c
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                    )}
                  >
                    <span>{c}</span>
                    <span className="hidden text-xs font-medium opacity-70 sm:inline">{L.pieces}</span>
                    {best != null ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">✅ {fmtSec(best)}</span>
                    ) : null}
                  </button>
                )
              })}
            </div>
            {sel && selImg ? (
              <p className="mt-2 truncate text-xs text-muted-foreground">
                {selImg.title[lang]} · {cnt} {L.pieces}
              </p>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">{L.selectImage}</p>
            )}
            <Button
              size="lg"
              className="anim-glow mt-2.5 h-12 w-full rounded-full text-base"
              disabled={!sel}
              onClick={() => sel && startGame(sel, cnt)}
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              {t('common.playNow')}
            </Button>
          </div>
        </div>
      ) : (
        /* ================= Écran de jeu ================= */
        <div>
          {/* HUD compact sur une ligne : retour · titre + compteur + chrono · aperçu · mélanger · recommencer */}
          <div className="mb-2 flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-full"
              aria-label={t('common.back')}
              onClick={backToSelection}
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="hidden truncate font-display text-sm font-bold min-[380px]:block">{img?.title[lang] ?? ''}</p>
                <p className="flex shrink-0 items-center gap-1 text-[11px] font-semibold tabular-nums text-muted-foreground">
                  <Puzzle className="h-3 w-3" aria-hidden="true" />
                  <span className="text-foreground">
                    {lockedCount}/{game.count}
                  </span>
                  <span aria-hidden="true">·</span>
                  <Timer className="h-3 w-3" aria-hidden="true" />
                  {formatMs(elapsedMs)}
                </p>
              </div>
              <div
                className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
                role="progressbar"
                aria-label={L.placed}
                aria-valuenow={lockedCount}
                aria-valuemin={0}
                aria-valuemax={game.count}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-full"
              aria-pressed={showPreview}
              aria-label={L.preview}
              disabled={won != null}
              onClick={() => {
                sfx.play('flip', { volume: 0.4 })
                if (!showPreview) usedPreviewRef.current = true
                setShowPreview((v) => !v)
              }}
            >
              {showPreview ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-full"
              aria-label={L.shuffle}
              disabled={won != null || lockedCount === game.count}
              onClick={reshuffle}
            >
              <Shuffle className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-full"
              aria-label={t('common.restart')}
              disabled={won != null}
              onClick={() => startGame(game.imageId, game.count)}
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>

          {/* Zone de jeu : plateau + bac, pièces positionnées en absolu.
              Largeur bornée pour que plateau + bac tiennent dans le budget vertical
              mobile (calc(100dvh - 220px) du chrome Task 9). */}
          <div
            ref={areaRef}
            onContextMenu={(e) => e.preventDefault()}
            style={areaW > 0 ? { maxWidth: areaW } : undefined}
            className="relative mx-auto w-full max-w-[min(420px,max(200px,calc(100dvh-412px)))] touch-none"
          >
            <div
              role="img"
              aria-label={L.boardLabel}
              className={cn(
                'checkerboard relative aspect-square w-full overflow-hidden rounded-xl border-2 bg-card',
                won != null ? 'anim-glow border-emerald-400' : 'border-border/70',
              )}
            >
              {dims ? (
                <div
                  className="absolute inset-0"
                  aria-hidden="true"
                  style={{
                    backgroundImage: `repeating-linear-gradient(to right, rgba(146, 94, 56, 0.16) 0 1px, transparent 1px ${100 / dims.cols}%), repeating-linear-gradient(to bottom, rgba(146, 94, 56, 0.16) 0 1px, transparent 1px ${100 / dims.rows}%)`,
                  }}
                />
              ) : null}
              {lockedCount === 0 && won == null ? (
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <Puzzle className="h-12 w-12 text-stone-400/30" />
                </div>
              ) : null}
              {showPreview && img ? (
                <img
                  src={img.src}
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
                />
              ) : null}
            </div>

            <div
              ref={trayRef}
              role="group"
              aria-label={L.tray}
              aria-hidden={won != null}
              style={trayH > 0 ? { height: trayH } : undefined}
              className={cn(
                'mt-2 h-[clamp(132px,calc(100dvh-620px),280px)] w-full rounded-2xl border-2 border-dashed',
                won != null ? 'border-border/40 bg-secondary/20 opacity-50' : 'border-border/60 bg-secondary/30',
              )}
            />

            {img && dims && areaW > 0 ? (
              <Fragment key={dealKey}>
                {game.pieces.map((p) => (
                  <div
                    key={p.id}
                    aria-hidden="true"
                    onPointerDown={(e) => onPieceDown(e, p)}
                    onPointerMove={onPieceMove}
                    onPointerUp={onPieceUp}
                    onPointerCancel={onPieceCancel}
                    className={cn(
                      'no-select absolute touch-none rounded-[2px] bg-no-repeat',
                      p.locked
                        ? 'pointer-events-none'
                        : draggingId === p.id
                          ? 'scale-[1.06] cursor-grabbing shadow-xl'
                          : 'cursor-grab shadow-md hover:shadow-lg hover:brightness-105',
                      !p.locked && draggingId !== p.id && 'transition-[left,top] duration-150 ease-out',
                      !p.locked && !reduce && 'anim-pop-in',
                      snapFx === p.id && 'ring-2 ring-emerald-400',
                    )}
                    style={{
                      left: p.locked ? p.col * pw : p.x,
                      top: p.locked ? p.row * ph : p.y,
                      width: pw,
                      height: ph,
                      zIndex: p.locked ? (snapFx === p.id ? 8 : 1) : draggingId === p.id ? 40 : bumpId === p.id ? 7 : 5,
                      backgroundImage: `url(${img.src})`,
                      backgroundSize: `${dims.cols * 100}% ${dims.rows * 100}%`,
                      backgroundPosition: `${(p.col / (dims.cols - 1)) * 100}% ${(p.row / (dims.rows - 1)) * 100}%`,
                    }}
                  />
                ))}
              </Fragment>
            ) : null}

            {/* Écran de victoire : superposé à la zone de jeu, Rejouer immédiatement visible */}
            {won != null && img ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center p-3">
                <div
                  role="status"
                  className="anim-rise max-h-full w-full max-w-[320px] overflow-y-auto rounded-2xl border-2 border-emerald-300/60 bg-card/95 p-4 text-center shadow-xl backdrop-blur-sm nice-scroll"
                >
                  <p className="font-display text-xl font-extrabold text-emerald-700 dark:text-emerald-300 sm:text-2xl">
                    🎉 {t('common.victory')}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {img.title[lang]} · {game.count} {L.pieces}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <StatPill icon={<Timer className="h-4 w-4" aria-hidden="true" />} label={t('common.time')} value={formatMs(won.seconds * 1000)} />
                    <StatPill
                      icon={<Trophy className="h-4 w-4" aria-hidden="true" />}
                      label={t('common.best')}
                      value={fmtSec(gallery[`${game.imageId}:${game.count}`] ?? won.seconds)}
                    />
                    <StatPill icon={<Play className="h-4 w-4" aria-hidden="true" />} label="XP" value={`+${won.xp}`} />
                  </div>
                  {won.isRecord ? (
                    <span className="anim-pop-in mt-3 inline-flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                      <Trophy className="h-4 w-4" aria-hidden="true" /> {t('common.newRecord')}
                    </span>
                  ) : null}
                  <div className="mt-4">
                    <RoundEndActions
                      gameId={gameId}
                      onReplay={() => startGame(game.imageId, game.count)}
                      replayLabel={t('common.playAgain')}
                      shareResult={shareResult}
                      primaryRef={replayBtnRef}
                      iq={won.iq}
                    />
                    <div className="mt-2 flex justify-center">
                      <Button size="lg" variant="secondary" className="rounded-full" onClick={backToSelection}>
                        <Puzzle className="h-4 w-4" aria-hidden="true" /> {L.otherImages}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {won == null ? <p className="mt-1.5 text-center text-[11px] text-muted-foreground">{L.dragHint}</p> : null}
        </div>
      )}
    </div>
  )
}

/* ================= Sous-composants ================= */
function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <span className="flex h-11 items-center gap-2 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
      <span className="text-muted-foreground" aria-hidden="true">{icon}</span>
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
