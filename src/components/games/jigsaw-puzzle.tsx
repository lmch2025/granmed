'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Eye, EyeOff, Shuffle, Timer, Play, RotateCcw, Trophy, Puzzle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore } from '@/lib/progress/store'
import { mulberry32, seedFromString, formatMs, clamp, useReducedMotion } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { loadSave, saveSave } from '@/lib/save'

export const gameId = 'jigsaw-puzzle'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Reconstituez six illustrations originales — lavande, cuisine, chat, marché, jardin, lac — en 12, 24 ou 48 pièces, au doigt ou à la souris.',
    en: 'Reassemble six original illustrations — lavender, kitchen, cat, market, garden, lake — in 12, 24 or 48 pieces, by touch or mouse.',
  },
  description: {
    fr: [
      "Souvenirs de Famille est un jeu de puzzle (jigsaw) gratuit en ligne dans lequel vous reconstituez des illustrations originales en faisant glisser les pièces une par une sur le plateau. Six images inédites — champ de lavande, cuisine rustique, chat à la fenêtre, marché de village, jardin fleuri et lac de montagne — vous attendent en 12, 24 ou 48 pièces.",
      'Chaque pièce est découpée dans l’image complète et dispersée dans le bac situé sous le plateau. Faites-la glisser : si elle est lâchée proche de sa case correcte, elle s’y aimante et s’y verrouille définitivement ; sinon, elle reste exactement là où vous l’avez déposée, sur le plateau ou dans le bac.',
      'Un bouton œil affiche l’image complète en transparence pour vous guider, un bouton Mélanger redisperse les pièces non posées, et une barre de progression avec chronomètre suit votre avancée. Vos meilleurs temps par taille sont sauvegardés, la galerie des puzzles terminés est conservée, et une partie en cours est automatiquement reprise.',
    ],
    en: [
      "Family Memories is a free online jigsaw puzzle game in which you reassemble original illustrations by dragging pieces one by one onto the board. Six exclusive images — lavender field, rustic kitchen, cat by the window, village market, blooming garden and mountain lake — await you in 12, 24 or 48 pieces.",
      'Each piece is cut from the complete image and scattered in the tray below the board. Drag it around: if you drop it near its correct cell it snaps and locks into place for good; otherwise it stays exactly where you left it, on the board or in the tray.',
      'An eye button shows the full image as a translucent guide, a Shuffle button rescatters the unplaced pieces, and a progress bar with a timer tracks your run. Your best times per size are saved, the gallery of finished puzzles is kept, and a game in progress is automatically resumed.',
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
      'Bouton retour (flèche) : revenir à l’écran de choix des images — la partie en cours est sauvegardée.',
    ],
    en: [
      'Mobile and desktop: press a piece, drag it with your finger or mouse, then release to drop it.',
      'Eye button: toggles the full image shown faintly over the board.',
      'Shuffle button: rescatters the not-yet-locked pieces back into the tray.',
      'Back button (arrow): return to the image selection screen — your game in progress is saved.',
    ],
  },
  features: {
    fr: [
      'Six illustrations originales 1024×1024 créées pour Granmed, sans rotation de pièces.',
      'Trois tailles par image : 12, 24 ou 48 pièces, avec meilleurs temps conservés séparément.',
      'Aimantation à 26 px de la case correcte, avec transition douce et bref anneau vert de confirmation.',
      'Bouton d’aperçu (image fantôme à 40 % d’opacité) et bouton Mélanger pour redisposer les pièces.',
      'Barre de progression, chronomètre avec pause automatique quand l’onglet est masqué.',
      'Galerie persistante des puzzles terminés (✅ + meilleur temps) et reprise automatique de la partie en cours.',
    ],
    en: [
      'Six original 1024×1024 illustrations created for Granmed, with no piece rotation.',
      'Three sizes per image: 12, 24 or 48 pieces, each with its own saved best time.',
      'Snapping within 26 px of the correct cell, with a smooth transition and a brief green ring.',
      'Preview toggle (ghost image at 40% opacity) and a Shuffle button to re-scatter pieces.',
      'Progress bar and timer that automatically pauses when the tab is hidden.',
      'Persistent gallery of finished puzzles (✅ + best time) and automatic resume of unfinished games.',
    ],
  },
  tips: {
    fr: [
      'Commencez par les pièces aux couleurs très recognisables (ciel, coin de table, robe du chat) : elles se plaquent vite au bon endroit.',
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
      { q: 'Comment une pièce sait-elle où se coller ?', a: 'Quand vous relâchez une pièce, son centre est comparé à celui de sa case correcte : à moins de 26 pixels, elle s’y aimante et s’y verrouille.' },
      { q: 'Puis-je revoir l’image complète ?', a: 'Oui, le bouton œil affiche l’image en transparence (40 % d’opacité) sur le plateau, autant de fois que vous le souhaitez.' },
      { q: 'Que fait le bouton Mélanger ?', a: 'Il redisperse uniquement les pièces non verrouillées dans le bac — les pièces déjà placées ne bougent jamais.' },
      { q: 'Ma partie est-elle sauvegardée si je quitte ?', a: 'Oui : pièces posées, positions des pièces libres et temps écoulé sont enregistrés automatiquement, et une invitation à reprendre s’affiche à votre retour.' },
    ],
    en: [
      { q: 'Do I need to rotate pieces?', a: 'No, no rotation is ever required: every piece is already facing the right way, you only need to place it correctly.' },
      { q: 'How does a piece know where to snap?', a: 'When you release a piece, its center is compared with its correct cell’s: within 26 pixels, it snaps and locks there.' },
      { q: 'Can I see the full image again?', a: 'Yes, the eye button shows the image faintly (40% opacity) over the board, as often as you like.' },
      { q: 'What does the Shuffle button do?', a: 'It only rescatters the unplaced pieces into the tray — locked pieces never move.' },
      { q: 'Is my game saved if I leave?', a: 'Yes: locked pieces, free-piece positions and elapsed time are saved automatically, and a resume prompt appears when you come back.' },
    ],
  },
  records: {
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
const TRAY_H = 300
const BOARD_TRAY_GAP = 12

function dimsFor(count: number): { cols: number; rows: number } {
  if (count === 12) return { cols: 4, rows: 3 }
  if (count === 24) return { cols: 6, rows: 4 }
  return { cols: 8, rows: 6 }
}

function fmtSec(s: number): string {
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
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
  pos: { x: number; y: number }[]
  elapsed: number
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
    placed: 'posées',
    preview: 'Aperçu de l’image',
    shuffle: 'Mélanger les pièces',
    otherImages: 'Autres images',
    tray: 'Bac des pièces — faites-les glisser sur le plateau',
    dragHint: 'Faites glisser les pièces : elles se collent quand elles sont proches de leur place.',
    boardLabel: 'Plateau du puzzle',
  },
  en: {
    selectHint: 'Pick an image, a piece count, then reassemble the memory.',
    selectImage: 'Select an image to begin.',
    pieces: 'pieces',
    done: 'done',
    savedGame: 'Game in progress',
    placed: 'placed',
    preview: 'Image preview',
    shuffle: 'Shuffle pieces',
    otherImages: 'Other images',
    tray: 'Piece tray — drag pieces onto the board',
    dragHint: 'Drag the pieces: they snap when close to their spot.',
    boardLabel: 'Puzzle board',
  },
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
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)

  const [sel, setSel] = useState<string | null>(null)
  const [cnt, setCnt] = useState<number>(12)
  const [game, setGame] = useState<PlayState | null>(null)
  const [restored, setRestored] = useState<Progress | null>(null)
  const [gallery, setGallery] = useState<Record<string, number>>({})
  const [won, setWon] = useState<{ seconds: number; isRecord: boolean } | null>(null)
  const [areaW, setAreaW] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [snapFx, setSnapFx] = useState<number | null>(null)
  const [shuffleFx, setShuffleFx] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [confettiKey, setConfettiKey] = useState(0)

  const areaRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<PlayState | null>(null)
  const galleryRef = useRef<Record<string, number>>({})
  const areaWRef = useRef(0)
  const elapsedBaseRef = useRef(0)
  const runningSinceRef = useRef<number | null>(null)
  const dragRef = useRef<{ id: number; pointerId: number; startX: number; startY: number; origX: number; origY: number } | null>(null)

  const playing = game != null && won == null

  function updateGame(g: PlayState | null) {
    gameRef.current = g
    setGame(g)
  }

  function getElapsed(): number {
    return elapsedBaseRef.current + (runningSinceRef.current != null ? Date.now() - runningSinceRef.current : 0)
  }

  function toProgress(g: PlayState): Progress {
    return {
      imageId: g.imageId,
      count: g.count,
      locked: g.pieces.map((p) => p.locked),
      pos: g.pieces.map((p) => ({ x: p.x, y: p.y })),
      elapsed: 0,
    }
  }

  /* --- Restauration au montage (callback asynchrone) --- */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      if (!alive) return
      const s = loadSave<JigStore>(gameId)
      if (!s) return
      if (s.gallery && typeof s.gallery === 'object') {
        galleryRef.current = s.gallery
        setGallery(s.gallery)
      }
      const p = s.progress
      if (
        p &&
        typeof p.imageId === 'string' &&
        COUNTS.includes(p.count) &&
        Array.isArray(p.locked) &&
        Array.isArray(p.pos) &&
        p.locked.length === p.count &&
        p.pos.length === p.count &&
        IMAGES.some((im) => im.id === p.imageId)
      ) {
        setRestored(p)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  /* --- Sauvegarde automatique (positions + temps) --- */
  useEffect(() => {
    if (!game || won) return
    saveSave(gameId, { gallery: galleryRef.current, progress: { ...toProgress(game), elapsed: getElapsed() } })
  }, [game, won])

  /* --- Sauvegarde périodique du temps écoulé --- */
  useEffect(() => {
    if (!game || won) return
    const g = game
    const id = window.setInterval(() => {
      saveSave(gameId, { gallery: galleryRef.current, progress: { ...toProgress(g), elapsed: getElapsed() } })
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

  /* --- Redimensionnement : mesure + mise à l'échelle des pièces libres --- */
  function applyAreaW(w: number) {
    const prev = areaWRef.current
    if (w <= 0 || w === prev) return
    areaWRef.current = w
    setAreaW(w)
    const g = gameRef.current
    if (g && prev > 0) {
      const f = w / prev
      updateGame({ ...g, pieces: g.pieces.map((p) => (p.locked ? p : { ...p, x: p.x * f, y: p.y * f })) })
    }
  }

  useEffect(() => {
    const onResize = () => {
      const el = areaRef.current
      if (el) applyAreaW(el.clientWidth)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function provisionalWidth(): number {
    return Math.min(Math.round(window.innerWidth * 0.92), 420)
  }

  function startGame(imageId: string, count: number) {
    const { cols, rows } = dimsFor(count)
    const w = provisionalWidth()
    const pw = w / cols
    const ph = w / rows
    const rand = mulberry32(seedFromString(`jigsaw:${imageId}:${count}`))
    const pad = 8
    const trayTop = w + BOARD_TRAY_GAP + pad
    const pieces: Piece[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pieces.push({
          id: r * cols + c,
          row: r,
          col: c,
          locked: false,
          x: pad + rand() * Math.max(1, w - pw - pad * 2),
          y: trayTop + rand() * Math.max(1, TRAY_H - ph - pad * 2),
        })
      }
    }
    elapsedBaseRef.current = 0
    runningSinceRef.current = Date.now()
    setElapsedMs(0)
    setWon(null)
    setDraggingId(null)
    setSnapFx(null)
    setShuffleFx(false)
    setRestored(null)
    areaWRef.current = w
    setAreaW(w)
    updateGame({ imageId, count, pieces })
    addPlay(gameId)
    sfx.play('pop')
    window.requestAnimationFrame(() => {
      const el = areaRef.current
      if (el) applyAreaW(el.clientWidth)
    })
  }

  function resumeGame() {
    if (!restored) return
    const { cols, rows } = dimsFor(restored.count)
    const w = provisionalWidth()
    const pw = w / cols
    const ph = w / rows
    const pieces: Piece[] = restored.locked.map((lk, i) => {
      const r = Math.floor(i / cols)
      const c = i % cols
      const pos = restored.pos[i] ?? { x: c * pw, y: w + TRAY_H / 2 }
      const locked = !!lk
      return { id: i, row: r, col: c, locked, x: locked ? c * pw : pos.x, y: locked ? r * ph : pos.y }
    })
    elapsedBaseRef.current = restored.elapsed || 0
    runningSinceRef.current = Date.now()
    setElapsedMs(restored.elapsed || 0)
    setWon(null)
    setDraggingId(null)
    setSnapFx(null)
    setShuffleFx(false)
    setRestored(null)
    areaWRef.current = w
    setAreaW(w)
    updateGame({ imageId: restored.imageId, count: restored.count, pieces })
    addPlay(gameId)
    sfx.play('pop')
    window.requestAnimationFrame(() => {
      const el = areaRef.current
      if (el) applyAreaW(el.clientWidth)
    })
  }

  function discardRestored() {
    sfx.play('click')
    setRestored(null)
    saveSave(gameId, { gallery: galleryRef.current, progress: null })
  }

  function backToSelection() {
    sfx.play('click', { volume: 0.5 })
    dragRef.current = null
    setDraggingId(null)
    setSnapFx(null)
    setShuffleFx(false)
    setWon(null)
    setShowPreview(false)
    updateGame(null)
  }

  /* --- Victoire (appelée depuis le callback de dépôt, jamais depuis un effet) --- */
  function finishWin(g: PlayState) {
    const ms = getElapsed()
    elapsedBaseRef.current = ms
    runningSinceRef.current = null
    setElapsedMs(ms)
    const seconds = Math.max(1, Math.round(ms / 1000))
    const isRecord = setBest(gameId, `best-time-${g.count}`, seconds, true)
    const key = `${g.imageId}:${g.count}`
    sfx.play('win')
    setConfettiKey((k) => k + 1)
    addWin(gameId)
    addXp(g.count === 12 ? 30 : g.count === 24 ? 60 : 120)
    if (g.count === 48) unlockBadge('jigsaw-48')
    const prev = galleryRef.current[key]
    const nextGallery = { ...galleryRef.current }
    if (prev == null || seconds < prev) nextGallery[key] = seconds
    galleryRef.current = nextGallery
    setGallery(nextGallery)
    saveSave(gameId, { gallery: nextGallery, progress: null })
    setWon({ seconds, isRecord })
  }

  /* --- Glisser-déposer (Pointer Events + capture) --- */
  function onPieceDown(e: React.PointerEvent<HTMLDivElement>, p: Piece) {
    if (!game || won != null || p.locked || dragRef.current != null) return
    e.preventDefault()
    const el = e.currentTarget
    try {
      el.setPointerCapture(e.pointerId)
    } catch {
      /* ignoré */
    }
    dragRef.current = { id: p.id, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, origX: p.x, origY: p.y }
    setDraggingId(p.id)
    sfx.play('click', { volume: 0.2 })
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
    if (!g || !piece || piece.locked) return
    const { cols, rows } = dimsFor(g.count)
    const w = areaWRef.current
    const pw = w / cols
    const ph = w / rows
    const nx = d.origX + (e.clientX - d.startX)
    const ny = d.origY + (e.clientY - d.startY)

    // Aimantation : centre de la pièce à moins de 26 px du centre de sa case
    const tx = piece.col * pw
    const ty = piece.row * ph
    const dist = Math.hypot(nx + pw / 2 - (tx + pw / 2), ny + ph / 2 - (ty + ph / 2))
    if (dist <= 26) {
      sfx.play('drop')
      // Aimantation animée : la transition est posée directement sur le DOM avant la valeur cible,
      // l'état est commité après la transition (150 ms) — React n'écrase jamais left/top pendant le geste.
      el.style.transition = 'left 150ms ease-out, top 150ms ease-out'
      el.style.left = `${tx}px`
      el.style.top = `${ty}px`
      window.setTimeout(() => {
        el.style.transition = ''
        const g2 = gameRef.current
        if (!g2) return
        const pieces = g2.pieces.map((x) => (x.id === piece.id ? { ...x, x: tx, y: ty, locked: true } : x))
        updateGame({ ...g2, pieces })
        setSnapFx(piece.id)
        window.setTimeout(() => setSnapFx(null), 500)
        if (pieces.every((x) => x.locked)) finishWin(g2)
      }, 170)
    } else {
      const areaH = w + BOARD_TRAY_GAP + TRAY_H
      const cx = clamp(nx, -pw * 0.25, w - pw * 0.75)
      const cy = clamp(ny, -ph * 0.25, areaH - ph * 0.75)
      const pieces = g.pieces.map((x) => (x.id === piece.id ? { ...x, x: cx, y: cy } : x))
      updateGame({ ...g, pieces })
    }
  }

  /* --- Mélanger : redisperse les pièces non verrouillées dans le bac --- */
  function reshuffle() {
    const g = gameRef.current
    if (!g || won != null) return
    sfx.play('swish')
    const { cols, rows } = dimsFor(g.count)
    const w = areaWRef.current
    const pw = w / cols
    const ph = w / rows
    const pad = 8
    const trayTop = w + BOARD_TRAY_GAP + pad
    if (g.pieces.every((p) => p.locked)) return
    const pieces = g.pieces.map((p) =>
      p.locked
        ? p
        : {
            ...p,
            x: pad + Math.random() * Math.max(1, w - pw - pad * 2),
            y: trayTop + Math.random() * Math.max(1, TRAY_H - ph - pad * 2),
          },
    )
    setShuffleFx(true)
    updateGame({ ...g, pieces })
    window.setTimeout(() => setShuffleFx(false), 350)
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

  return (
    <div className="relative select-none">
      <Confetti fire={confettiKey} count={reduce ? 0 : 110} />

      {/* Bandeau de reprise */}
      {restored && !game ? (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-amber-300/60 bg-amber-50 px-4 py-3 dark:border-amber-500/25 dark:bg-amber-500/10">
          <span className="text-2xl" aria-hidden="true">🧩</span>
          <span className="min-w-0 flex-1 text-sm">
            <span className="block font-bold text-amber-700 dark:text-amber-300">{L.savedGame}</span>
            <span className="block text-xs text-muted-foreground">
              {IMAGES.find((im) => im.id === restored.imageId)?.title[lang]} · {restored.count} {L.pieces} ·{' '}
              {restored.locked.filter(Boolean).length}/{restored.count} {L.placed}
            </span>
          </span>
          <Button size="lg" className="h-11 rounded-full" onClick={resumeGame}>
            {t('game.resume')}
          </Button>
          <Button size="lg" variant="secondary" className="h-11 rounded-full" onClick={discardRestored}>
            {t('game.newGame')}
          </Button>
        </div>
      ) : null}

      {!game ? (
        /* ================= Écran de sélection ================= */
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            {L.selectHint} <span className="font-semibold">{doneTotal}/18</span> {L.done}.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {IMAGES.map((im) => {
              const done = COUNTS.filter((c) => gallery[`${im.id}:${c}`] != null).length
              return (
                <button
                  key={im.id}
                  type="button"
                  aria-pressed={sel === im.id}
                  onClick={() => {
                    sfx.play('click', { volume: 0.5 })
                    setSel(im.id)
                  }}
                  className={cn(
                    'group overflow-hidden rounded-2xl border-2 bg-card text-left transition-all',
                    sel === im.id ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/40',
                  )}
                >
                  <img
                    src={im.src}
                    alt={im.title[lang]}
                    width={512}
                    height={512}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover transition-transform group-hover:scale-[1.03]"
                  />
                  <span className="block p-2.5">
                    <span className="block truncate text-sm font-bold">{im.title[lang]}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{done}/3 ✅</span>
                  </span>
                </button>
              )
            })}
          </div>

          {sel && selImg ? (
            <div className="mt-4 rounded-2xl border bg-card p-4">
              <p className="font-display font-bold">{selImg.title[lang]}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label={t('common.size')}>
                {COUNTS.map((c) => {
                  const best = gallery[`${sel}:${c}`]
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
                        'flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-all',
                        cnt === c
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                      )}
                    >
                      <span>{c}</span>
                      <span className="text-xs font-medium opacity-70">{L.pieces}</span>
                      {best != null ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✅ {fmtSec(best)}</span>
                      ) : null}
                    </button>
                  )
                })}
                <Button size="lg" className="ms-auto h-11 rounded-full anim-glow" onClick={() => startGame(sel, cnt)}>
                  <Play className="h-4 w-4" aria-hidden="true" />
                  {t('common.playNow')}
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-center text-sm text-muted-foreground">{L.selectImage}</p>
          )}
        </div>
      ) : (
        /* ================= Écran de jeu ================= */
        <div>
          <div className="mb-3 flex items-center gap-2">
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
                <p className="truncate font-display text-sm font-bold">{img?.title[lang]}</p>
                <p className="shrink-0 text-xs text-muted-foreground">
                  <span className="tabular-nums font-semibold text-foreground">
                    {lockedCount}/{game.count}
                  </span>{' '}
                  · <span className="tabular-nums font-semibold text-foreground">{formatMs(elapsedMs)}</span>
                </p>
              </div>
              <div
                className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary"
                role="progressbar"
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
              onClick={() => {
                sfx.play('click', { volume: 0.5 })
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
          </div>

          {/* Zone de jeu : plateau + bac, pièces positionnées en absolu */}
          <div ref={areaRef} className="no-select relative mx-auto w-[min(92vw,420px)] touch-none">
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
              {showPreview && img ? (
                <img
                  src={img.src}
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
                />
              ) : null}
            </div>

            {won == null ? (
              <div
                className="mt-3 h-[300px] w-full rounded-2xl border-2 border-dashed border-border/60 bg-secondary/30"
                aria-label={L.tray}
              />
            ) : null}

            {img && dims && areaW > 0
              ? game.pieces.map((p) => (
                  <div
                    key={p.id}
                    onPointerDown={(e) => onPieceDown(e, p)}
                    onPointerMove={onPieceMove}
                    onPointerUp={onPieceUp}
                    onPointerCancel={onPieceUp}
                    className={cn(
                      'absolute touch-none rounded-[2px] bg-no-repeat',
                      p.locked
                        ? 'pointer-events-none z-[1]'
                        : draggingId === p.id
                          ? 'z-40 scale-[1.06] cursor-grabbing shadow-xl'
                          : 'z-[5] cursor-grab shadow-md',
                      snapFx === p.id && 'ring-2 ring-emerald-400',
                      shuffleFx && !p.locked && draggingId !== p.id && 'transition-[left,top] duration-300 ease-out',
                    )}
                    style={{
                      left: p.locked ? p.col * pw : p.x,
                      top: p.locked ? p.row * ph : p.y,
                      width: pw,
                      height: ph,
                      backgroundImage: `url(${img.src})`,
                      backgroundSize: `${dims.cols * 100}% ${dims.rows * 100}%`,
                      backgroundPosition: `${(p.col / (dims.cols - 1)) * 100}% ${(p.row / (dims.rows - 1)) * 100}%`,
                    }}
                  />
                ))
              : null}
          </div>

          {won == null ? <p className="mt-2 text-center text-xs text-muted-foreground">{L.dragHint}</p> : null}

          {/* Écran de victoire */}
          {won != null && img ? (
            <div
              className="anim-rise mt-4 rounded-2xl border-2 border-emerald-300/60 bg-emerald-50/60 p-5 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10"
              role="status"
            >
              <p className="font-display text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">🎉 {t('common.victory')}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {img.title[lang]} · {game.count} {L.pieces}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
                <StatPill icon={<Timer className="h-4 w-4" aria-hidden="true" />} label={t('common.time')} value={formatMs(won.seconds * 1000)} />
                <StatPill
                  icon={<Trophy className="h-4 w-4" aria-hidden="true" />}
                  label={t('common.best')}
                  value={fmtSec(gallery[`${game.imageId}:${game.count}`] ?? won.seconds)}
                />
                {won.isRecord ? (
                  <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                    <Trophy className="h-4 w-4" aria-hidden="true" /> {t('common.newRecord')}
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                <Button size="lg" className="rounded-full" onClick={() => startGame(game.imageId, game.count)}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" /> {t('common.playAgain')}
                </Button>
                <Button size="lg" variant="secondary" className="rounded-full" onClick={backToSelection}>
                  <Puzzle className="h-4 w-4" aria-hidden="true" /> {L.otherImages}
                </Button>
              </div>
            </div>
          ) : null}
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
