'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, CalendarCheck, Trophy, Zap, Eraser, Flame, Grid2x2, Flower2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, seedFromString } from '@/lib/utils-game'
import { computeIq } from '@/lib/games/iq'
import type { GameSEOContent } from '@/lib/games/types'
import { blockPuzzleSeoContent } from './data/block-puzzle-seo'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions } from '@/components/game/round-end'
import { IqChallengeBanner } from '@/components/game/iq-banner'
import { useJuice, FxCellBurst } from '@/components/game/fx'
import { loadSave, saveSave, clearSave } from '@/lib/save'

export const gameId = 'block-puzzle'

/* ================= Contenu SEO bilingue ================= */
/* Task 27 : objet déplacé en données pures dans ./data/block-puzzle-seo.ts —
 * double-usage serveur/client (HTML brut des pages jeu réelles), source unique. */
export const content: GameSEOContent = blockPuzzleSeoContent

/* ================= Moteur ================= */
type Mode = 'classic' | 'relax'

interface Shape {
  w: number
  h: number
  /** Grille booléenne : true = case occupée. */
  grid: boolean[][]
  /** Famille de couleur (1 à 6). */
  fam: number
  /** Nombre de cases occupées. */
  n: number
  /** Poids de tirage. */
  weight: number
}

const T = true
const F = false

const SHAPES: Shape[] = [
  { w: 1, h: 1, grid: [[T]], fam: 1, n: 1, weight: 13 },
  { w: 2, h: 1, grid: [[T, T]], fam: 2, n: 2, weight: 12 },
  { w: 1, h: 2, grid: [[T], [T]], fam: 2, n: 2, weight: 12 },
  { w: 3, h: 1, grid: [[T, T, T]], fam: 3, n: 3, weight: 10 },
  { w: 1, h: 3, grid: [[T], [T], [T]], fam: 3, n: 3, weight: 10 },
  { w: 2, h: 2, grid: [[T, T], [T, T]], fam: 4, n: 4, weight: 10 },
  { w: 2, h: 2, grid: [[T, F], [T, T]], fam: 5, n: 3, weight: 7 },
  { w: 2, h: 2, grid: [[T, T], [T, F]], fam: 5, n: 3, weight: 7 },
  { w: 2, h: 2, grid: [[T, T], [F, T]], fam: 5, n: 3, weight: 7 },
  { w: 2, h: 2, grid: [[F, T], [T, T]], fam: 5, n: 3, weight: 7 },
  { w: 2, h: 3, grid: [[T, F], [T, F], [T, T]], fam: 6, n: 4, weight: 5 },
  { w: 3, h: 2, grid: [[T, T, T], [T, F, F]], fam: 6, n: 4, weight: 5 },
  { w: 2, h: 3, grid: [[T, T], [F, T], [F, T]], fam: 6, n: 4, weight: 5 },
  { w: 3, h: 2, grid: [[F, F, T], [T, T, T]], fam: 6, n: 4, weight: 5 },
  { w: 3, h: 3, grid: [[T, T, T], [T, T, T], [T, T, T]], fam: 4, n: 9, weight: 2 }, // Classique uniquement, rare
]

/** Dégradés chauds par famille de forme (ambre / rose / émeraude / violet / orange). */
const FAM_GRAD: Record<number, string> = {
  1: 'from-amber-300 to-orange-400',
  2: 'from-rose-300 to-rose-500',
  3: 'from-emerald-300 to-emerald-500',
  4: 'from-violet-400 to-purple-500',
  5: 'from-orange-300 to-red-400',
  6: 'from-amber-500 to-orange-600',
}

function poolFor(mode: Mode): Shape[] {
  return mode === 'relax' ? SHAPES.filter((s) => s.n <= 4) : SHAPES
}

/** mulberry32 local avec état sérialisable (défi du jour déterministe, reprise incluse). */
function makeRng(seed: number) {
  let a = seed >>> 0
  return {
    next: () => {
      a |= 0
      a = (a + 0x6d2b79f5) | 0
      let t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    },
    state: () => a >>> 0,
  }
}

function drawShape(pool: Shape[], rand: () => number): number {
  const total = pool.reduce((acc, s) => acc + s.weight, 0)
  let r = rand() * total
  for (const s of pool) {
    r -= s.weight
    if (r <= 0) return SHAPES.indexOf(s)
  }
  return SHAPES.indexOf(pool[pool.length - 1])
}

function canPlaceAt(board: number[], s: Shape, r: number, c: number): boolean {
  if (r < 0 || c < 0 || r + s.h > 10 || c + s.w > 10) return false
  for (let i = 0; i < s.h; i++) {
    for (let j = 0; j < s.w; j++) {
      if (s.grid[i][j] && board[(r + i) * 10 + (c + j)] !== 0) return false
    }
  }
  return true
}

function fitsAnywhere(board: number[], s: Shape): boolean {
  for (let r = 0; r <= 10 - s.h; r++) {
    for (let c = 0; c <= 10 - s.w; c++) {
      if (canPlaceAt(board, s, r, c)) return true
    }
  }
  return false
}

/** Indices (0–99) des cases d'une pièce ancrée en (r, c) — seulement celles dans la grille. */
function shapeCells(s: Shape, r: number, c: number): number[] {
  const cells: number[] = []
  for (let i = 0; i < s.h; i++) {
    for (let j = 0; j < s.w; j++) {
      if (!s.grid[i][j]) continue
      const rr = r + i
      const cc = c + j
      if (rr >= 0 && rr < 10 && cc >= 0 && cc < 10) cells.push(rr * 10 + cc)
    }
  }
  return cells
}

interface GameState {
  /** 100 cases : 0 = vide, sinon famille de couleur. */
  board: number[]
  /** 3 emplacements : index de forme dans SHAPES, ou null. */
  slots: (number | null)[]
  score: number
  lines: number
  /** État du générateur (déterministe pour le défi du jour). */
  rng: number
  mode: Mode
  daily: boolean
  over: boolean
}

/** Aperçu (fantôme souris ou cible de drag) : cases + validité + famille. */
interface GhostPreview {
  cells: number[]
  valid: boolean
  fam: number
}

/** Drag en cours (refs — aucune lecture pendant le rendu). */
interface DragInfo {
  slot: number
  sid: number
  pointerId: number
  pitch: number
  originX: number
  originY: number
  startX: number
  startY: number
  moved: boolean
  target: { r: number; c: number } | null
}

/** Rendu de la pièce flottante (état posé UNE fois à l'activation du drag). */
interface DragUi {
  slot: number
  sid: number
  pitch: number
  left: number
  top: number
}

/* ================= Textes locaux ================= */
const STR = {
  fr: {
    board: 'Grille 10×10',
    score: 'Score',
    lines: 'Lignes',
    combo: 'Combo',
    gameOver: 'Partie terminée',
    classic: 'Classique',
    relax: 'Détente',
    classicHint: 'Toutes les pièces · carré 3×3 rare',
    relaxHint: 'Pièces de 4 cases maximum',
    savedGame: 'Partie sauvegardée',
    dailyHint: 'Séquence de pièces identique pour tous les joueurs, aujourd’hui',
    points: 'pts',
    slots: 'Pièces à placer',
    slotAria: 'Pièce',
    empty: 'Vide',
    hintDrag: 'Touchez une pièce ou glissez-la sur la grille',
    hintPlace: 'Touchez une case libre pour poser la pièce',
    shareLine: '{n} lignes · {s} pts',
  },
  en: {
    board: '10×10 grid',
    score: 'Score',
    lines: 'Lines',
    combo: 'Combo',
    gameOver: 'Game over',
    classic: 'Classic',
    relax: 'Relax',
    classicHint: 'All pieces · rare 3×3 square',
    relaxHint: 'Pieces of 4 cells or fewer',
    savedGame: 'Saved game',
    dailyHint: 'Same piece sequence for every player today',
    points: 'pts',
    slots: 'Pieces to place',
    slotAria: 'Piece',
    empty: 'Empty',
    hintDrag: 'Tap a piece — or drag it onto the grid',
    hintPlace: 'Tap a free cell to place the piece',
    shareLine: '{n} lines · {s} pts',
  },
}

/** Effets d'effacement « juice » (Task 20) — purement décoratifs : l'état du
 *  plateau est déjà nettoyé au moment où ils se jouent, le rythme ne change pas. */
interface ClearFxData {
  key: number
  n: number
  byCell: Record<number, { fam: number; delay: number }>
}

/* ================= Composant principal ================= */
export default function BlockPuzzleGame() {
  const t = useT()
  const lang = useLang()
  const L = STR[lang]
  const dailyDone = useIsDailyDone(gameId)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addXp = useProfileStore((s) => s.addXp)
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)
  const bestScore = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-score']?.value)

  const [mode, setMode] = useState<Mode>('classic')
  const [game, setGame] = useState<GameState | null>(null)
  const [saved, setSaved] = useState<GameState | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [ghost, setGhost] = useState<GhostPreview | null>(null)
  const [clearFx, setClearFx] = useState<ClearFxData | null>(null)
  const [flash, setFlash] = useState(0)
  const [comboFx, setComboFx] = useState<{ n: number; pts: number; key: number } | null>(null)
  const [comboBest, setComboBest] = useState(0)
  const [wasRecord, setWasRecord] = useState(false)
  const [finalIq, setFinalIq] = useState<number | null>(null)
  const [confettiFire, setConfettiFire] = useState(0)
  const [dragUi, setDragUi] = useState<DragUi | null>(null)

  /* Effets « juice » (Task 20) — helpers visuels sans re-render */
  const juice = useJuice()

  const lockRef = useRef(false)
  /** Génération de partie : invalide les timeouts périmés après restart/reprise/démontage. */
  const genRef = useRef(0)
  const gridRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragInfo | null>(null)
  const suppressClickRef = useRef(0)
  const lastTargetRef = useRef('')

  /** Minuteur lié à la génération courante (jamais exécuté après un restart). */
  function sched(fn: () => void, ms: number) {
    const gen = genRef.current
    window.setTimeout(() => {
      if (genRef.current === gen) fn()
    }, ms)
  }

  /* --- Restauration au montage (callback asynchrone, jamais setState synchrone dans l'effet) --- */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      if (!alive) return
      const s = loadSave<GameState>(gameId)
      if (
        s &&
        Array.isArray(s.board) &&
        s.board.length === 100 &&
        Array.isArray(s.slots) &&
        s.slots.length === 3 &&
        (s.mode === 'classic' || s.mode === 'relax') &&
        typeof s.score === 'number' &&
        typeof s.rng === 'number' &&
        !s.over
      ) {
        setSaved(s)
      }
    })
    return () => {
      alive = false
      genRef.current++
    }
  }, [])

  /* --- Sauvegarde automatique à chaque changement (état toujours final) --- */
  useEffect(() => {
    if (!game) return
    if (game.over) clearSave(gameId)
    else saveSave(gameId, game)
  }, [game])

  /* --- Échap : désélectionner --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelected(null)
        setGhost(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* --- Réf stable de la couche de drag : position initiale posée au montage du nœud,
         puis updates impératifs dans pointermove (zéro re-render pendant le geste). --- */
  const setLayerRef = useCallback(
    (el: HTMLDivElement | null) => {
      layerRef.current = el
      if (el && dragUi) {
        el.style.transform = `translate3d(${Math.round(dragUi.left)}px, ${Math.round(dragUi.top)}px, 0)`
      }
    },
    [dragUi],
  )

  /* --- Fin de partie : XP + records + succès (appelée depuis le handler) --- */
  function finish(finalScore: number, wasDaily: boolean, finalLines: number) {
    sfx.play('lose')
    /* QI estimé (Task 18) : précision = score final / par de 2 200 (un bon score
     * courant ≈ 1 500–1 900 pts → 0,70–0,85), clampée [0,15 ; 1]. Jeu zen sans
     * chrono : rapidité omise ; difficulté 2 (grille 10×10, modes Classique/Détente). */
    const iq = computeIq(gameId, { accuracy: Math.min(1, Math.max(0.15, finalScore / 2200)), difficulty: 2 })
    setFinalIq(iq)
    const rec = finalScore > 0 ? setBest(gameId, 'best-score', finalScore, false) : false
    setWasRecord(rec)
    if (rec) setConfettiFire((n) => n + 1)
    if (finalScore > 0) addXp(Math.floor(finalScore / 100))
    // Niveau de jeu : 10 XP + 1 par ligne effacée, plafonné à 30.
    addGameXp(gameId, 10 + Math.min(20, finalLines))
    if (finalScore >= 5000) unlockBadge('block-5000')
    if (wasDaily && finalScore > 0) completeDaily(gameId)
  }

  function startGame(m: Mode, daily: boolean) {
    genRef.current++
    const seed = daily
      ? seedFromString(`${gameId}:${todayKey()}`)
      : ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0)
    const rng = makeRng(seed)
    const pool = poolFor(m)
    const slots: (number | null)[] = [
      drawShape(pool, rng.next),
      drawShape(pool, rng.next),
      drawShape(pool, rng.next),
    ]
    setSaved(null)
    setSelected(null)
    setGhost(null)
    setClearFx(null)
    setComboFx(null)
    setFlash(0)
    setComboBest(0)
    setWasRecord(false)
    setFinalIq(null)
    lockRef.current = false
    setGame({ board: new Array(100).fill(0), slots, score: 0, lines: 0, rng: rng.state(), mode: m, daily, over: false })
    addPlay(gameId)
    sfx.play('pop')
  }

  function resumeGame() {
    if (!saved) return
    genRef.current++
    /* Sécurité : recalcul du game over (sauvegarde très ancienne ou cas limite). */
    const over = !saved.slots.some((id) => id != null && fitsAnywhere(saved.board, SHAPES[id]))
    setGame({ ...saved, over })
    setSaved(null)
    setSelected(null)
    setGhost(null)
    setClearFx(null)
    setComboFx(null)
    setFlash(0)
    setComboBest(0)
    setWasRecord(false)
    setFinalIq(null)
    lockRef.current = false
    addPlay(gameId)
    sfx.play('pop')
    if (over) finish(saved.score, saved.daily, saved.lines)
  }

  /* --- Aperçu fantôme (souris uniquement, jamais pendant un drag) --- */
  function hoverCell(i: number) {
    if (dragRef.current) return
    if (!game || selected === null) {
      setGhost(null)
      return
    }
    const sid = game.slots[selected]
    if (sid == null) {
      setGhost(null)
      return
    }
    const s = SHAPES[sid]
    const r = Math.floor(i / 10)
    const c = i % 10
    if (!canPlaceAt(game.board, s, r, c)) {
      setGhost(null)
      return
    }
    setGhost({ cells: shapeCells(s, r, c), valid: true, fam: s.fam })
  }

  /* --- Placement d'une pièce (tap sur une case OU dépôt de drag) ---
     L'état final (plateau nettoyé, score, over) est commis IMMÉDIATEMENT :
     la sauvegarde est toujours cohérente et aucun timeout ne peut corrompre
     une nouvelle partie ; le flash des lignes est purement visuel. */
  function placePiece(slotIdx: number, r: number, c: number) {
    if (!game || game.over || lockRef.current) return
    const sid = game.slots[slotIdx]
    if (sid == null) return
    const s = SHAPES[sid]

    if (!canPlaceAt(game.board, s, r, c)) {
      sfx.play('wrong', { volume: 0.3 })
      navigator.vibrate?.(10)
      setFlash((f) => f + 1)
      sched(() => setFlash(0), 430)
      return
    }

    lockRef.current = true
    setSelected(null)
    setGhost(null)

    // Pose de la pièce
    const board = [...game.board]
    let placed = 0
    for (let i = 0; i < s.h; i++) {
      for (let j = 0; j < s.w; j++) {
        if (s.grid[i][j]) {
          board[(r + i) * 10 + (c + j)] = s.fam
          placed++
        }
      }
    }

    // Lignes et colonnes pleines (effacées simultanément)
    const fullRows: number[] = []
    const fullCols: number[] = []
    for (let rr = 0; rr < 10; rr++) {
      let full = true
      for (let cc = 0; cc < 10; cc++) {
        if (board[rr * 10 + cc] === 0) {
          full = false
          break
        }
      }
      if (full) fullRows.push(rr)
    }
    for (let cc = 0; cc < 10; cc++) {
      let full = true
      for (let rr = 0; rr < 10; rr++) {
        if (board[rr * 10 + cc] === 0) {
          full = false
          break
        }
      }
      if (full) fullCols.push(cc)
    }
    const nLines = fullRows.length + fullCols.length
    const mult = nLines >= 2 ? nLines : 1
    const newScore = game.score + placed + 10 * nLines * mult

    // Consommation de l'emplacement + redistribution si les 3 sont vides
    let slots: (number | null)[] = [...game.slots]
    slots[slotIdx] = null
    const rng = makeRng(game.rng)
    if (slots.every((x) => x == null)) {
      const pool = poolFor(game.mode)
      slots = [drawShape(pool, rng.next), drawShape(pool, rng.next), drawShape(pool, rng.next)]
    }

    const cleared = new Set<number>()
    for (const rr of fullRows) for (let cc = 0; cc < 10; cc++) cleared.add(rr * 10 + cc)
    for (const cc of fullCols) for (let rr = 0; rr < 10; rr++) cleared.add(rr * 10 + cc)
    const clearedBoard = cleared.size > 0 ? board.map((v, i) => (cleared.has(i) ? 0 : v)) : board
    const over = !slots.some((id) => id != null && fitsAnywhere(clearedBoard, SHAPES[id]))

    // Sons + haptique
    sfx.play('drop')
    navigator.vibrate?.(10)
    if (nLines > 0) {
      sfx.play('sweep', { volume: 0.8 })
      navigator.vibrate?.(nLines >= 2 ? [10, 40, 10] : 15)
      if (nLines >= 2) sfx.play('coin')
    }
    if (nLines >= 4) unlockBadge('block-combo4')
    if (newScore >= 5000 && game.score < 5000) unlockBadge('block-5000')
    if (nLines >= 2) setComboBest((cur) => Math.max(cur, nLines))

    // Commit immédiat de l'état final
    setGame({
      ...game,
      board: clearedBoard,
      slots,
      score: newScore,
      lines: game.lines + nLines,
      rng: rng.state(),
      over,
    })

    if (cleared.size > 0) {
      /* Effets « juice » (Task 20) — purement visuels : l'état est déjà nettoyé,
         le verrou reste de 340 ms (rythme inchangé), les animations s'achèvent
         seules sans jamais gêner le coup suivant. */
      const cr = r + s.h / 2
      const cc = c + s.w / 2
      const byCell: ClearFxData['byCell'] = {}
      for (const i of cleared) {
        const dr = Math.floor(i / 10) + 0.5 - cr
        const dc = (i % 10) + 0.5 - cc
        byCell[i] = { fam: board[i], delay: Math.min(170, Math.round(Math.hypot(dr, dc) * 24)) }
      }
      setClearFx({ key: Date.now(), n: nLines, byCell })
      // Onde de choc du plateau : pulse pour une ligne, secousse pour un combo
      if (nLines === 1) juice.pulse(gridRef.current, 1.015, 280)
      else juice.shake(gridRef.current, nLines)
      sched(() => {
        lockRef.current = false
      }, 340)
      sched(() => setClearFx(null), 760)
      if (nLines >= 2) {
        setComboFx({ n: nLines, pts: 10 * nLines * mult, key: Date.now() })
        sched(() => setComboFx(null), 950)
      }
    } else {
      lockRef.current = false
    }
    if (over) finish(newScore, game.daily, game.lines + nLines)
  }

  /* ================= Drag & drop (pointer events + capture) ================= */

  function onSlotPointerDown(e: React.PointerEvent<HTMLButtonElement>, i: number, sid: number) {
    if (!game || game.over || lockRef.current) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (dragRef.current) return // une seule pièce à la fois
    const grid = gridRef.current
    if (!grid || grid.children.length < 2) return
    const b0 = (grid.children[0] as HTMLElement).getBoundingClientRect()
    const b1 = (grid.children[1] as HTMLElement).getBoundingClientRect()
    const pitch = b1.left - b0.left
    if (pitch <= 4) return
    dragRef.current = {
      slot: i,
      sid,
      pointerId: e.pointerId,
      pitch,
      originX: b0.left,
      originY: b0.top,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      target: null,
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* capture indisponible : le tap-to-place reste utilisable */
    }
  }

  function onSlotPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId || !game || game.over) return
    const s = SHAPES[d.sid]
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 10) return
      d.moved = true
      setSelected(null)
      setGhost(null)
      sfx.play('swish', { volume: 0.35 })
    }
    // La pièce suit le pointeur (centrée, légèrement au-dessus du doigt)
    const left = e.clientX - (s.w * d.pitch) / 2
    const top = e.clientY - (s.h * d.pitch) / 2 - d.pitch * 0.9
    const layer = layerRef.current
    if (layer) layer.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`
    if (!dragUi) setDragUi({ slot: d.slot, sid: d.sid, pitch: d.pitch, left, top })
    // Cible magnétisée : arrondi à la case la plus proche
    const col = Math.round((left - d.originX) / d.pitch)
    const row = Math.round((top - d.originY) / d.pitch)
    const valid = canPlaceAt(game.board, s, row, col)
    d.target = valid ? { r: row, c: col } : null
    const tkey = `${row}:${col}:${valid ? 1 : 0}`
    if (tkey !== lastTargetRef.current) {
      lastTargetRef.current = tkey
      if (valid) {
        setGhost({ cells: shapeCells(s, row, col), valid: true, fam: s.fam })
      } else {
        const near = row > -s.h && row < 10 && col > -s.w && col < 10
        setGhost(near ? { cells: shapeCells(s, row, col), valid: false, fam: s.fam } : null)
      }
    }
  }

  function onSlotPointerEnd(e: React.PointerEvent<HTMLButtonElement>) {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId) return
    dragRef.current = null
    lastTargetRef.current = ''
    setDragUi(null)
    setGhost(null)
    if (!d.moved) return // simple tap → le click natif gère la sélection
    suppressClickRef.current = Date.now()
    const tgt = d.target
    if (tgt) placePiece(d.slot, tgt.r, tgt.c)
    else sfx.play('swish', { volume: 0.2 })
  }

  function onSlotPointerCancel(e: React.PointerEvent<HTMLButtonElement>) {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId) return
    dragRef.current = null
    lastTargetRef.current = ''
    setDragUi(null)
    setGhost(null)
    if (d.moved) suppressClickRef.current = Date.now()
  }

  const selectedShapeId = game && selected !== null ? (game.slots[selected] ?? null) : null
  const playing = game !== null && !game.over
  const xpGain = game ? Math.floor(game.score / 100) : 0
  /* Ligne de résultat partageable (game-over) : lignes effacées + score final. */
  const shareResult =
    game && game.over ? L.shareLine.replace('{n}', String(game.lines)).replace('{s}', String(game.score)) : undefined

  return (
    <div className="relative no-select select-none my-auto w-full">
      {/* Bandeau de reprise */}
      {saved && !game ? (
        <div className="mb-2.5 flex flex-wrap items-center gap-2.5 rounded-2xl border-2 border-amber-300/60 bg-amber-50 px-3.5 py-2.5 dark:border-amber-500/25 dark:bg-amber-500/10">
          <span className="text-2xl" aria-hidden="true">🧱</span>
          <span className="min-w-0 flex-1 text-sm">
            <span className="block font-bold text-amber-700 dark:text-amber-300">
              {L.savedGame} — {saved.score} {L.points}
            </span>
            <span className="block text-xs text-muted-foreground">
              {saved.mode === 'relax' ? L.relax : L.classic} · {saved.lines} {L.lines.toLowerCase()} · {saved.daily ? t('common.daily') : '—'}
            </span>
          </span>
          <Button size="sm" className="h-9 rounded-full px-4" onClick={resumeGame}>
            {t('game.resume')}
          </Button>
          <Button size="sm" variant="secondary" className="h-9 rounded-full px-4" onClick={() => startGame(saved.mode, false)}>
            {t('game.newGame')}
          </Button>
        </div>
      ) : null}

      {/* HUD en jeu (une ligne compacte) / configuration sinon */}
      {playing ? (
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span key={game.score} className={game.score > 0 ? 'anim-fx-pop inline-flex' : 'inline-flex'}>
            <Pill compact icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />} label={L.score} value={game.score} />
          </span>
          <Pill compact icon={<Eraser className="h-3.5 w-3.5" aria-hidden="true" />} label={L.lines} value={game.lines} />
          <Pill compact icon={<Flame className="h-3.5 w-3.5" aria-hidden="true" />} label={L.combo} value={comboBest >= 2 ? `×${comboBest}` : '—'} />
          {game.daily ? (
            <span
              title={t('common.daily')}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            </span>
          ) : null}
          <Button
            variant="secondary"
            size="sm"
            className="ms-auto h-9 gap-1.5 rounded-full px-3"
            title={t('common.restart')}
            aria-label={t('common.restart')}
            onClick={() => {
              sfx.play('click')
              startGame(game.mode, game.daily)
            }}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('common.restart')}</span>
          </Button>
        </div>
      ) : (
        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('common.mode')}>
            <button
              type="button"
              aria-pressed={mode === 'classic'}
              onClick={() => {
                sfx.play('click', { volume: 0.5 })
                setMode('classic')
              }}
              className={cn(
                'flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:text-sm',
                mode === 'classic'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              <Grid2x2 className="h-3.5 w-3.5" aria-hidden="true" />
              {L.classic}
            </button>
            <button
              type="button"
              aria-pressed={mode === 'relax'}
              onClick={() => {
                sfx.play('click', { volume: 0.5 })
                setMode('relax')
              }}
              className={cn(
                'flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:text-sm',
                mode === 'relax'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              <Flower2 className="h-3.5 w-3.5" aria-hidden="true" />
              {L.relax}
            </button>
          </div>
          {mode === 'relax' ? (
            <span className="hidden text-xs text-muted-foreground sm:inline">{L.relaxHint}</span>
          ) : (
            <span className="hidden text-xs text-muted-foreground sm:inline">{L.classicHint}</span>
          )}
          {!dailyDone ? (
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-full px-3"
              title={L.dailyHint}
              onClick={() => startGame('classic', true)}
            >
              <CalendarCheck className="h-4 w-4 text-amber-500" aria-hidden="true" />
              {t('common.daily')}
            </Button>
          ) : null}
          <Button size="lg" className="ms-auto h-10 gap-1.5 rounded-full px-5 anim-glow" onClick={() => startGame(mode, false)}>
            <Play className="h-4 w-4" aria-hidden="true" />
            {t('common.playNow')}
          </Button>
        </div>
      )}

      {/* Plateau + pièces : tient dans le budget vertical mobile (100dvh - ~220px de chrome) */}
      {game ? (
        <div className="relative mx-auto w-[min(92vw,420px)]" style={{ maxWidth: 'max(200px, calc(100dvh - 352px))' }}>
          <div
            ref={gridRef}
            role="grid"
            aria-label={L.board}
            onPointerLeave={() => {
              if (!dragRef.current) setGhost(null)
            }}
            className={cn(
              'relative grid aspect-square grid-cols-10 gap-[2px] rounded-xl border-2 bg-card p-[3px] shadow-inner',
              flash > 0 ? 'anim-shake border-red-400 ring-2 ring-red-400/60' : 'border-border/70',
            )}
          >
            {game.board.map((v, i) => {
              const g = ghost && ghost.cells.includes(i) ? ghost : null
              return (
                <div
                  key={i}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') hoverCell(i)
                  }}
                  onClick={() => {
                    if (selected == null || Date.now() - suppressClickRef.current < 350) return
                    placePiece(selected, Math.floor(i / 10), i % 10)
                  }}
                  className={cn(
                    'relative aspect-square rounded-[3px] transition-colors duration-75',
                    v > 0 ? cn('bg-gradient-to-br shadow-sm', FAM_GRAD[v] ?? FAM_GRAD[1]) : 'bg-foreground/[0.06]',
                    g && g.valid ? cn('bg-gradient-to-br opacity-60', FAM_GRAD[g.fam]) : null,
                    g && !g.valid ? 'bg-red-400/30' : null,
                    selectedShapeId != null && 'cursor-pointer hover:brightness-110',
                  )}
                >
                  {clearFx?.byCell[i] ? (
                    <FxCellBurst
                      key={clearFx.key}
                      colorClass={cn('bg-gradient-to-br', FAM_GRAD[clearFx.byCell[i].fam] ?? FAM_GRAD[1])}
                      delay={clearFx.byCell[i].delay}
                      particles={clearFx.n >= 3 ? 1 : 2}
                    />
                  ) : null}
                </div>
              )
            })}
            {clearFx ? (
              <div
                key={clearFx.key}
                className="anim-fx-glow pointer-events-none absolute inset-0 z-10 rounded-[10px]"
                aria-hidden="true"
              />
            ) : null}
          </div>

          {/* Combo flottant */}
          {comboFx ? (
            <div
              key={comboFx.key}
              className="anim-score pointer-events-none absolute left-1/2 top-[38%] z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-amber-500/95 px-4 py-2 font-display text-lg font-extrabold text-white shadow-lg"
              aria-hidden="true"
            >
              COMBO ×{comboFx.n} +{comboFx.pts}
            </div>
          ) : null}

          {/* Emplacements de pièces (drag & drop + tap-to-place) */}
          <div className="mt-2 grid grid-cols-3 gap-1.5" role="group" aria-label={L.slots}>
            {game.slots.map((sid, i) =>
              sid == null ? (
                <div
                  key={i}
                  className="flex min-h-[64px] items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-secondary/30 text-[11px] text-muted-foreground"
                >
                  {L.empty}
                </div>
              ) : (
                <button
                  key={i}
                  type="button"
                  aria-pressed={selected === i}
                  aria-label={`${L.slotAria} ${i + 1}`}
                  className={cn(
                    'touch-none flex min-h-[64px] items-center justify-center rounded-xl border-2 bg-card transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    dragUi?.slot === i
                      ? 'border-dashed border-border/60 bg-secondary/30'
                      : selected === i
                        ? '-translate-y-0.5 border-primary shadow-md ring-2 ring-primary/40'
                        : 'border-border hover:border-primary/40 active:scale-[0.97]',
                  )}
                  onContextMenu={(e) => e.preventDefault()}
                  onPointerDown={(e) => onSlotPointerDown(e, i, sid)}
                  onPointerMove={onSlotPointerMove}
                  onPointerUp={onSlotPointerEnd}
                  onPointerCancel={onSlotPointerCancel}
                  onClick={() => {
                    if (Date.now() - suppressClickRef.current < 350) return
                    sfx.play('click', { volume: 0.5 })
                    setGhost(null)
                    setSelected((cur) => (cur === i ? null : i))
                  }}
                >
                  <MiniPiece key={sid} shape={SHAPES[sid]} className={dragUi?.slot === i ? 'opacity-25' : undefined} />
                </button>
              ),
            )}
          </div>

          {/* Aide contextuelle (sous le plateau, jamais au-dessus) */}
          <p className="mt-1.5 min-h-[16px] text-center text-[11px] leading-tight text-muted-foreground">
            {game.over ? '' : selectedShapeId != null ? L.hintPlace : L.hintDrag}
          </p>

          {/* Écran de fin de partie : récap + Rejouer immédiat */}
          {game.over ? (
            <div
              className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 rounded-xl bg-card/95 p-4 text-center shadow-lg backdrop-blur-sm"
              role="status"
            >
              <span className="text-4xl" aria-hidden="true">🧱</span>
              <p className="font-display text-xl font-extrabold">{L.gameOver}</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                <Pill icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />} label={L.score} value={game.score} />
                <Pill icon={<Eraser className="h-3.5 w-3.5" aria-hidden="true" />} label={L.lines} value={game.lines} />
                {comboBest >= 2 ? (
                  <Pill icon={<Flame className="h-3.5 w-3.5" aria-hidden="true" />} label={L.combo} value={`×${comboBest}`} />
                ) : null}
                <Pill icon={<Trophy className="h-3.5 w-3.5" aria-hidden="true" />} label={t('common.best')} value={Math.max(bestScore ?? 0, game.score)} />
              </div>
              {wasRecord ? (
                <span className="flex h-8 items-center gap-1.5 rounded-full bg-amber-100 px-3 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                  <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> {t('common.newRecord')}
                </span>
              ) : null}
              {xpGain > 0 ? (
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+{xpGain} XP</p>
              ) : null}
              <RoundEndActions
                gameId={gameId}
                onReplay={() => startGame(game.mode, false)}
                replayLabel={t('common.playAgain')}
                shareResult={shareResult}
                iq={finalIq ?? undefined}
                className="mt-1"
              />
            </div>
          ) : null}

          {/* Confettis (uniquement en cas de record ; respecte useReducedMotion en interne) */}
          <Confetti fire={confettiFire} waves={2} gold />
        </div>
      ) : (
        <div className="checkerboard flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border p-6 text-center sm:min-h-[300px]">
          {/* Défi QI bienveillant — mis en avant dès l'ouverture (Task 19) */}
          <IqChallengeBanner gameId={gameId} />
          <div className="flex items-end gap-4 sm:gap-6" aria-hidden="true">
            <MiniPiece shape={SHAPES[1]} cell="min(5vw, 18px)" />
            <MiniPiece shape={SHAPES[6]} cell="min(5vw, 18px)" />
            <MiniPiece shape={SHAPES[10]} cell="min(5vw, 18px)" />
          </div>
          <p className="max-w-md text-xs text-muted-foreground sm:text-sm">{content.tagline[lang]}</p>
        </div>
      )}

      {/* Couche de drag : la pièce flottante à l'échelle de la grille.
          Position initiale posée via la réf stable, puis updates impératifs
          dans pointermove — la couche ne re-rend jamais pendant le geste. */}
      {dragUi ? (
        <div ref={setLayerRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-50 touch-none drop-shadow-xl">
          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${SHAPES[dragUi.sid].w}, ${Math.max(6, dragUi.pitch - 2)}px)`, gap: '2px' }}
          >
            {SHAPES[dragUi.sid].grid.flat().map((on, i) => (
              <div
                key={i}
                className={cn('aspect-square rounded-[3px]', on ? `bg-gradient-to-br ${FAM_GRAD[SHAPES[dragUi.sid].fam]}` : 'bg-transparent')}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

/* ================= Sous-composants ================= */
function MiniPiece({ shape, cell = 'min(3.6vw, 13px)', className }: { shape: Shape; cell?: string; className?: string }) {
  return (
    <div
      className={cn('anim-pop-in grid', className)}
      style={{ gridTemplateColumns: `repeat(${shape.w}, ${cell})`, gap: '2px' }}
      aria-hidden="true"
    >
      {shape.grid.flat().map((on, i) => (
        <div
          key={i}
          className={cn('aspect-square rounded-[3px]', on ? `bg-gradient-to-br shadow-sm ${FAM_GRAD[shape.fam]}` : 'bg-transparent')}
        />
      ))}
    </div>
  )
}

function Pill({ icon, label, value, compact }: { icon: React.ReactNode; label: string; value: React.ReactNode; compact?: boolean }) {
  return (
    <span
      title={label}
      className={cn('flex h-8 items-center gap-1.5 rounded-full bg-secondary/70 px-2.5 text-xs font-semibold', compact && 'px-2')}
    >
      <span className="text-muted-foreground" aria-hidden="true">{icon}</span>
      <span className={cn('text-muted-foreground', compact && 'hidden sm:inline')}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
