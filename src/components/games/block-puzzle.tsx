'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, CalendarCheck, Trophy, Zap, Sparkles, Grid2x2, Flower2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, seedFromString } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { loadSave, saveSave, clearSave } from '@/lib/save'

export const gameId = 'block-puzzle'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Placez des pièces sur une grille 10×10, effacez des lignes et des colonnes et enchaînez les combos, sans chronomètre.',
    en: 'Place pieces on a 10×10 grid, clear rows and columns and chain combos — with no timer to rush you.',
  },
  description: {
    fr: [
      "Block Puzzle Équilibre est un jeu de puzzle gratuit en ligne dans lequel vous posez des pièces de formes variées sur une grille de 10×10 cases. Chaque pièce placée occupe définitivement ses cases ; dès qu'une ligne ou une colonne est entièrement remplie, elle disparaît et vous marque des points.",
      "Vous recevez trois pièces à la fois et devez les placer toutes les trois avant d'en recevoir de nouvelles, à la manière des grands classiques du genre. Le mode Classique propose le catalogue complet — point isolé, lignes, carrés, angles et le rare carré 3×3 — tandis que le mode Détente se limite aux pièces de quatre cases maximum pour des parties plus tranquilles.",
      "Sans chronomètre ni pression, le jeu récompense l'anticipation : effacer plusieurs lignes d'un seul coup déclenche un combo qui double, triple ou quadruple les points. Votre meilleur score est sauvegardé, un défi du jour propose la même séquence de pièces à tous les joueurs, et la partie en cours est conservée automatiquement pour être reprise plus tard.",
    ],
    en: [
      "Block Puzzle Balance is a free online puzzle game in which you place differently shaped pieces on a 10×10 grid. Every placed piece permanently occupies its cells; as soon as a row or a column is completely filled, it disappears and scores you points.",
      "You receive three pieces at a time and must place all three before new ones arrive, in the tradition of the genre's classics. Classic mode offers the full catalogue — single dot, lines, squares, corners and the rare 3×3 square — while Relax mode sticks to pieces of four cells or fewer for calmer games.",
      "With no timer and no pressure, the game rewards planning ahead: clearing several lines at once triggers a combo that doubles, triples or quadruples the points. Your best score is saved, a daily challenge deals the same piece sequence to every player, and an unfinished game is automatically kept so you can resume it later.",
    ],
  },
  rules: {
    fr: [
      "Touchez une pièce dans l'un des trois emplacements sous la grille : elle est sélectionnée (anneau + léger soulèvement).",
      "Touchez ensuite une case de la grille : la pièce s'y place avec son coin haut-gauche sur la case touchée, si toutes ses cases sont libres et dans la grille.",
      'Si le placement est impossible, les bords de la grille clignotent en rouge : choisissez une autre case ou une autre pièce.',
      'Une ligne ou une colonne entièrement remplie est effacée : +1 point par case posée, +10 points par ligne effacée.',
      'Effacer 2, 3 ou 4 lignes d’un coup déclenche un combo : les points des lignes sont multipliés par ×2, ×3 ou ×4.',
      'Quand les trois emplacements sont vides, trois nouvelles pièces sont distribuées.',
      'La partie se termine quand plus aucune des pièces restantes ne peut être placée nulle part sur la grille.',
    ],
    en: [
      'Tap a piece in one of the three slots below the grid: it becomes selected (ring and slight lift).',
      'Then tap a cell on the grid: the piece is placed with its top-left corner on that cell, if all of its cells are free and inside the grid.',
      'If the placement is impossible, the grid edges flash red: pick another cell or another piece.',
      'A completely filled row or column is cleared: +1 point per placed cell, +10 points per cleared line.',
      'Clearing 2, 3 or 4 lines at once triggers a combo: line points are multiplied by ×2, ×3 or ×4.',
      'When all three slots are empty, three new pieces are dealt.',
      'The game ends when none of the remaining pieces can be placed anywhere on the grid.',
    ],
  },
  controls: {
    fr: [
      'Mobile : touchez une pièce pour la sélectionner, puis touchez une case de la grille pour la poser.',
      'Ordinateur : cliquez sur une pièce puis sur une case ; en survolant la grille avec la souris, un aperçu fantôme montre où la pièce se posera.',
      'Touchez de nouveau la pièce sélectionnée (ou la touche Échap) pour annuler la sélection.',
      'Aucun glisser-déposer ni chronomètre : le rythme est entièrement libre.',
    ],
    en: [
      'Mobile: tap a piece to select it, then tap a cell on the grid to place it.',
      'Desktop: click a piece then a cell; hovering the grid with the mouse shows a ghost preview of where the piece will land.',
      'Tap the selected piece again (or press Escape) to cancel the selection.',
      'No drag-and-drop and no timer: the pace is entirely yours.',
    ],
  },
  features: {
    fr: [
      'Grille 10×10 et pièces dessinées en mini-grilles, avec un dégradé chaud par famille de formes.',
      'Deux modes : Classique (toutes les pièces, carré 3×3 rare) et Détente (pièces ≤ 4 cases).',
      'Combos ×2/×3/×4 quand plusieurs lignes sont effacées d’un coup, avec animation flottante.',
      'Défi du jour : la séquence de pièces est déterministe, identique pour tous les joueurs.',
      'Sauvegarde automatique de la partie en cours (grille, pièces, score) avec reprise en un geste.',
      'Record de meilleur score, XP proportionnelle au score et succès à débloquer.',
    ],
    en: [
      '10×10 grid with pieces drawn as mini-grids, each shape family in a warm gradient.',
      'Two modes: Classic (all pieces, rare 3×3 square) and Relax (pieces ≤ 4 cells).',
      '×2/×3/×4 combos when several lines are cleared at once, with a floating animation.',
      'Daily challenge: the piece sequence is deterministic and identical for every player.',
      'Automatic save of the game in progress (grid, pieces, score) with one-tap resume.',
      'Best-score record, XP proportional to the score and achievements to unlock.',
    ],
  },
  tips: {
    fr: [
      'Gardez la grille aussi plate et trouée que possible : les trous isolés condamnent souvent la fin de partie.',
      'Ne remplissez une ligne que lorsque vous êtes certain de pouvoir la terminer, sinon elle bloque vos colonnes.',
      'Réservez toujours un carré de 3×3 cases libres quelque part : le grand carré 3×3 finit toujours par arriver en mode Classique.',
      'Les pièces d’une seule case sont précieuses : gardez-les pour boucher les trous au dernier moment.',
      'Viser un double effacement ligne + colonne au même endroit est le meilleur rapport points/libération d’espace.',
    ],
    en: [
      'Keep the grid as flat and hole-free as possible: isolated holes often doom the endgame.',
      'Only fill a line when you are sure you can finish it, otherwise it blocks your columns.',
      'Always keep a free 3×3 square somewhere: the big 3×3 piece eventually shows up in Classic mode.',
      'Single-cell pieces are precious: save them to plug holes at the last moment.',
      'Aiming for a row + column double clear in the same spot is the best points-to-space-freed ratio.',
    ],
  },
  faq: {
    fr: [
      { q: 'Le jeu est-il chronométré ?', a: "Non. Block Puzzle Équilibre est un jeu zen sans minuteur : vous pouvez réfléchir aussi longtemps que vous le souhaitez, la partie est même sauvegardée automatiquement." },
      { q: 'Quelle est la différence entre les modes Classique et Détente ?', a: 'Le mode Classique propose toutes les pièces, y compris le rare carré 3×3 de neuf cases. Le mode Détente exclut ce grand carré et se limite aux pièces de quatre cases maximum.' },
      { q: 'Comment fonctionnent les combos ?', a: 'Quand un placement efface plusieurs lignes et/ou colonnes à la fois, les points de lignes sont multipliés : ×2 pour deux lignes, ×3 pour trois, ×4 pour quatre.' },
      { q: 'Comment est calculé le score ?', a: 'Chaque case posée rapporte 1 point, et chaque ligne effacée rapporte 10 points de base, multipliés par le multiplicateur de combo le cas échéant.' },
      { q: 'Puis-je rejouer le défi du jour ?', a: "Le défi du jour est validé dès que votre partie quotidienne se termine avec un score supérieur à 0. Vous pouvez ensuite relancer des parties libres normales." },
    ],
    en: [
      { q: 'Is the game timed?', a: 'No. Block Puzzle Balance is a zen game with no timer: think as long as you like — your game is even saved automatically.' },
      { q: 'What is the difference between Classic and Relax modes?', a: 'Classic mode deals every piece, including the rare nine-cell 3×3 square. Relax mode excludes that big square and sticks to pieces of four cells or fewer.' },
      { q: 'How do combos work?', a: 'When a placement clears several rows and/or columns at once, line points are multiplied: ×2 for two lines, ×3 for three, ×4 for four.' },
      { q: 'How is the score calculated?', a: 'Each placed cell is worth 1 point, and each cleared line is worth 10 base points, multiplied by the combo multiplier when applicable.' },
      { q: 'Can I replay the daily challenge?', a: 'The daily challenge is validated as soon as your daily game ends with a score above 0. You can then keep playing normal free games.' },
    ],
  },
  records: {
    'best-score': { fr: 'Meilleur score', en: 'Best score' },
  },
}

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

/* ================= Textes locaux ================= */
const STR = {
  fr: {
    board: 'Grille 10×10',
    score: 'Score',
    lines: 'Lignes',
    gameOver: 'Partie terminée',
    classic: 'Classique',
    relax: 'Détente',
    classicHint: 'Toutes les pièces · carré 3×3 rare',
    relaxHint: 'Pièces de 4 cases maximum',
    savedGame: 'Partie sauvegardée',
    selectPiece: 'Touchez une pièce, puis une case de la grille',
    dailyHint: 'Séquence de pièces identique pour tous les joueurs, aujourd’hui',
    points: 'pts',
    slots: 'Pièces à placer',
    empty: 'Vide',
  },
  en: {
    board: '10×10 grid',
    score: 'Score',
    lines: 'Lines',
    gameOver: 'Game over',
    classic: 'Classic',
    relax: 'Relax',
    classicHint: 'All pieces · rare 3×3 square',
    relaxHint: 'Pieces of 4 cells or fewer',
    savedGame: 'Saved game',
    selectPiece: 'Tap a piece, then a cell on the grid',
    dailyHint: 'Same piece sequence for every player today',
    points: 'pts',
    slots: 'Pieces to place',
    empty: 'Empty',
  },
}

/* ================= Composant principal ================= */
export default function BlockPuzzleGame() {
  const t = useT()
  const lang = useLang()
  const L = STR[lang]
  const dailyDone = useIsDailyDone(gameId)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)
  const bestScore = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-score']?.value)

  const [mode, setMode] = useState<Mode>('classic')
  const [game, setGame] = useState<GameState | null>(null)
  const [saved, setSaved] = useState<GameState | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [ghost, setGhost] = useState<number[] | null>(null)
  const [clearing, setClearing] = useState<Set<number>>(() => new Set())
  const [flash, setFlash] = useState(0)
  const [comboFx, setComboFx] = useState<{ n: number; pts: number; key: number } | null>(null)
  const lockRef = useRef(false)

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
        !s.over
      ) {
        setSaved(s)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  /* --- Sauvegarde automatique à chaque changement --- */
  useEffect(() => {
    if (!game) return
    if (game.over) clearSave(gameId)
    else saveSave(gameId, game)
  }, [game])

  /* --- Échap : désélectionner --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* --- Fin de partie : XP + records + succès (appelée depuis le handler) --- */
  function finish(finalScore: number, wasDaily: boolean) {
    sfx.play('lose')
    addXp(Math.floor(finalScore / 100))
    setBest(gameId, 'best-score', finalScore, false)
    if (finalScore >= 5000) unlockBadge('block-5000')
    if (wasDaily && finalScore > 0) completeDaily(gameId)
  }

  function startGame(m: Mode, daily: boolean) {
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
    setClearing(new Set())
    setComboFx(null)
    setFlash(0)
    lockRef.current = false
    setGame({ board: new Array(100).fill(0), slots, score: 0, lines: 0, rng: rng.state(), mode: m, daily, over: false })
    addPlay(gameId)
    sfx.play('pop')
  }

  function resumeGame() {
    if (!saved) return
    setGame(saved)
    setSaved(null)
    setSelected(null)
    setGhost(null)
    setClearing(new Set())
    setComboFx(null)
    setFlash(0)
    lockRef.current = false
    addPlay(gameId)
    sfx.play('pop')
  }

  /* --- Aperçu fantôme (souris uniquement) --- */
  function hoverCell(i: number) {
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
    const cells: number[] = []
    for (let a = 0; a < s.h; a++) {
      for (let b = 0; b < s.w; b++) {
        if (s.grid[a][b]) cells.push((r + a) * 10 + (c + b))
      }
    }
    setGhost(cells)
  }

  /* --- Placement d'une pièce (tap sur une case) --- */
  function placeAt(r: number, c: number) {
    if (!game || game.over || lockRef.current || selected === null) return
    const sid = game.slots[selected]
    if (sid == null) return
    const s = SHAPES[sid]

    if (!canPlaceAt(game.board, s, r, c)) {
      sfx.play('wrong', { volume: 0.3 })
      setFlash((f) => f + 1)
      window.setTimeout(() => setFlash(0), 430)
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
    slots[selected] = null
    const rng = makeRng(game.rng)
    const pool = poolFor(game.mode)
    if (slots.every((x) => x == null)) {
      slots = [drawShape(pool, rng.next), drawShape(pool, rng.next), drawShape(pool, rng.next)]
    }

    const cleared = new Set<number>()
    for (const rr of fullRows) for (let cc = 0; cc < 10; cc++) cleared.add(rr * 10 + cc)
    for (const cc of fullCols) for (let rr = 0; rr < 10; rr++) cleared.add(rr * 10 + cc)
    const clearedBoard = cleared.size > 0 ? board.map((v, i) => (cleared.has(i) ? 0 : v)) : board

    const over = !slots.some((id) => id != null && fitsAnywhere(clearedBoard, SHAPES[id]))

    sfx.play('pop')
    if (nLines > 0) {
      sfx.play('sweep', { volume: 0.8 })
      if (nLines >= 2) sfx.play('coin')
    }
    if (nLines >= 4) unlockBadge('block-combo4')
    if (newScore >= 5000 && game.score < 5000) unlockBadge('block-5000')

    const wasDaily = game.daily
    if (cleared.size > 0) {
      // Flash des cases effacées, puis effacement réel
      setGame({ ...game, board, slots, score: newScore, lines: game.lines + nLines, rng: rng.state() })
      setClearing(cleared)
      if (nLines >= 2) {
        setComboFx({ n: nLines, pts: 10 * nLines * mult, key: Date.now() })
        window.setTimeout(() => setComboFx(null), 950)
      }
      window.setTimeout(() => {
        setClearing(new Set())
        lockRef.current = false
        setGame((g) => (g ? { ...g, board: clearedBoard, over } : g))
        if (over) finish(newScore, wasDaily)
      }, 300)
    } else {
      setGame({ ...game, board: clearedBoard, slots, score: newScore, lines: game.lines + nLines, rng: rng.state(), over })
      lockRef.current = false
      if (over) finish(newScore, wasDaily)
    }
  }

  const selectedShapeId = game && selected !== null ? (game.slots[selected] ?? null) : null
  const ghostFam = selectedShapeId != null ? SHAPES[selectedShapeId].fam : 1
  const playing = game !== null && !game.over

  return (
    <div className="relative select-none">
      {/* Bandeau de reprise */}
      {saved && !game ? (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-amber-300/60 bg-amber-50 px-4 py-3 dark:border-amber-500/25 dark:bg-amber-500/10">
          <span className="text-2xl" aria-hidden="true">🧱</span>
          <span className="min-w-0 flex-1 text-sm">
            <span className="block font-bold text-amber-700 dark:text-amber-300">
              {L.savedGame} — {saved.score} {L.points}
            </span>
            <span className="block text-xs text-muted-foreground">
              {saved.mode === 'relax' ? L.relax : L.classic} · {saved.lines} {L.lines.toLowerCase()} · {saved.daily ? t('common.daily') : '—'}
            </span>
          </span>
          <Button size="lg" className="h-11 rounded-full" onClick={resumeGame}>
            {t('game.resume')}
          </Button>
          <Button size="lg" variant="secondary" className="h-11 rounded-full" onClick={() => startGame(saved.mode, false)}>
            {t('game.newGame')}
          </Button>
        </div>
      ) : null}

      {/* Barre du haut : stats en jeu / configuration sinon */}
      {playing ? (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <StatPill icon={<Zap className="h-4 w-4" aria-hidden="true" />} label={L.score} value={game.score} />
          <StatPill icon={<Sparkles className="h-4 w-4" aria-hidden="true" />} label={L.lines} value={game.lines} />
          <StatPill icon={<Trophy className="h-4 w-4" aria-hidden="true" />} label={t('common.best')} value={bestScore ?? 0} />
          {game.daily ? (
            <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              {t('common.daily')}
            </span>
          ) : null}
          <Button
            variant="secondary"
            size="lg"
            className="ms-auto h-11 rounded-full"
            onClick={() => {
              sfx.play('click')
              startGame(game.mode, game.daily)
            }}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t('common.restart')}
          </Button>
        </div>
      ) : (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('common.mode')}>
            <button
              type="button"
              aria-pressed={mode === 'classic'}
              onClick={() => {
                sfx.play('click', { volume: 0.5 })
                setMode('classic')
              }}
              className={cn(
                'flex h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-all',
                mode === 'classic'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              <Grid2x2 className="h-4 w-4" aria-hidden="true" />
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
                'flex h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-all',
                mode === 'relax'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              <Flower2 className="h-4 w-4" aria-hidden="true" />
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
              size="lg"
              className="h-11 rounded-full"
              title={L.dailyHint}
              onClick={() => startGame('classic', true)}
            >
              <CalendarCheck className="h-4 w-4 text-amber-500" aria-hidden="true" />
              {t('common.daily')}
            </Button>
          ) : null}
          <Button size="lg" className="ms-auto h-11 rounded-full anim-glow" onClick={() => startGame(mode, false)}>
            <Play className="h-4 w-4" aria-hidden="true" />
            {t('common.playNow')}
          </Button>
        </div>
      )}

      {/* Plateau */}
      {game ? (
        <div className="relative mx-auto w-[min(92vw,420px)]">
          <div
            role="grid"
            aria-label={L.board}
            onPointerLeave={() => setGhost(null)}
            className={cn(
              'grid aspect-square grid-cols-10 gap-[2px] rounded-xl border-2 bg-card p-[3px] shadow-inner',
              flash > 0 ? 'anim-shake border-red-400 ring-2 ring-red-400/60' : 'border-border/70',
            )}
          >
            {game.board.map((v, i) => {
              const isGhostCell = ghost != null && ghost.includes(i)
              return (
                <div
                  key={i}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') hoverCell(i)
                  }}
                  onClick={() => placeAt(Math.floor(i / 10), i % 10)}
                  className={cn(
                    'relative aspect-square rounded-[3px] transition-colors duration-75',
                    v > 0 ? cn('bg-gradient-to-br shadow-sm', FAM_GRAD[v] ?? FAM_GRAD[1]) : 'bg-foreground/[0.06]',
                    isGhostCell && cn('bg-gradient-to-br opacity-50', FAM_GRAD[ghostFam]),
                    selectedShapeId != null && 'cursor-pointer',
                  )}
                >
                  {clearing.has(i) ? (
                    <span className="anim-pop-in absolute inset-0 rounded-[3px] bg-white/80" aria-hidden="true" />
                  ) : null}
                </div>
              )
            })}
          </div>

          {/* Combo flottant */}
          {comboFx ? (
            <div
              key={comboFx.key}
              className="anim-score pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-amber-500/95 px-4 py-2 font-display text-lg font-extrabold text-white shadow-lg"
              aria-hidden="true"
            >
              COMBO ×{comboFx.n} +{comboFx.pts}
            </div>
          ) : null}

          {/* Écran de fin de partie */}
          {game.over ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-xl bg-card/95 p-4 text-center shadow-lg backdrop-blur-sm" role="status">
              <span className="text-4xl" aria-hidden="true">🧱</span>
              <p className="font-display text-xl font-extrabold">{L.gameOver}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <StatPill icon={<Zap className="h-4 w-4" aria-hidden="true" />} label={L.score} value={game.score} />
                <StatPill icon={<Trophy className="h-4 w-4" aria-hidden="true" />} label={t('common.best')} value={Math.max(bestScore ?? 0, game.score)} />
              </div>
              {(bestScore ?? 0) > 0 && game.score >= (bestScore ?? 0) ? (
                <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                  <Trophy className="h-4 w-4" aria-hidden="true" /> {t('common.newRecord')}
                </span>
              ) : null}
              <Button size="lg" className="rounded-full" onClick={() => startGame(game.mode, false)}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                {t('common.playAgain')}
              </Button>
            </div>
          ) : null}

          {/* Emplacements de pièces */}
          <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label={L.slots}>
            {game.slots.map((sid, i) =>
              sid == null ? (
                <div
                  key={i}
                  className="flex min-h-[76px] items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-secondary/30 text-xs text-muted-foreground"
                >
                  {L.empty}
                </div>
              ) : (
                <button
                  key={i}
                  type="button"
                  aria-pressed={selected === i}
                  aria-label={`${L.slots} ${i + 1}`}
                  onClick={() => {
                    sfx.play('click', { volume: 0.5 })
                    setGhost(null)
                    setSelected((cur) => (cur === i ? null : i))
                  }}
                  className={cn(
                    'flex min-h-[76px] items-center justify-center rounded-xl border-2 bg-card transition-all',
                    selected === i
                      ? '-translate-y-1 border-primary shadow-md ring-2 ring-primary/40'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  <MiniPiece shape={SHAPES[sid]} />
                </button>
              ),
            )}
          </div>
          {selectedShapeId == null && !game.over ? (
            <p className="mt-2 text-center text-xs text-muted-foreground">{L.selectPiece}</p>
          ) : null}
        </div>
      ) : (
        <div className="checkerboard flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border p-6 text-center">
          <div className="flex items-end gap-4" aria-hidden="true">
            <MiniPiece shape={SHAPES[1]} />
            <MiniPiece shape={SHAPES[6]} />
            <MiniPiece shape={SHAPES[10]} />
          </div>
          <p className="max-w-md text-sm text-muted-foreground">{content.tagline[lang]}</p>
        </div>
      )}
    </div>
  )
}

/* ================= Sous-composants ================= */
function MiniPiece({ shape }: { shape: Shape }) {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${shape.w}, min(4vw, 15px))`, gap: '2px' }}
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

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <span className="flex h-11 items-center gap-2 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
      <span className="text-muted-foreground" aria-hidden="true">{icon}</span>
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
