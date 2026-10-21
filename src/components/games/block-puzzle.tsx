'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, CalendarCheck, Trophy, Zap, Sparkles, Flame, Grid2x2, Flower2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, seedFromString } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
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
      "Touchez une pièce dans l'un des trois emplacements sous la grille : elle est sélectionnée (anneau et léger soulèvement).",
      "Posez-la en touchant une case de la grille — elle s'ancre par son coin haut-gauche si toutes ses cases sont libres — ou glissez-la directement depuis son emplacement : la zone visée s'illumine quand le placement est possible.",
      'Si le placement est impossible, les bords de la grille clignotent en rouge : choisissez une autre case ou une autre pièce.',
      'Une ligne ou une colonne entièrement remplie est effacée : +1 point par case posée, +10 points par ligne effacée.',
      'Effacer 2, 3 ou 4 lignes d’un coup déclenche un combo : les points des lignes sont multipliés par ×2, ×3 ou ×4.',
      'Quand les trois emplacements sont vides, trois nouvelles pièces sont distribuées.',
      'La partie se termine quand plus aucune des pièces restantes ne peut être placée nulle part sur la grille.',
    ],
    en: [
      'Tap a piece in one of the three slots below the grid: it becomes selected (ring and slight lift).',
      'Place it by tapping a cell on the grid — it anchors by its top-left corner as long as all of its cells are free — or drag it straight from its slot: the targeted area lights up whenever the placement is possible.',
      'If the placement is impossible, the grid edges flash red: pick another cell or another piece.',
      'A completely filled row or column is cleared: +1 point per placed cell, +10 points per cleared line.',
      'Clearing 2, 3 or 4 lines at once triggers a combo: line points are multiplied by ×2, ×3 or ×4.',
      'When all three slots are empty, three new pieces are dealt.',
      'The game ends when none of the remaining pieces can be placed anywhere on the grid.',
    ],
  },
  controls: {
    fr: [
      'Mobile : glissez une pièce de son emplacement vers la grille — elle suit votre doigt et se pose dès que la zone visée s’illumine ; ou touchez la pièce, puis la case de destination.',
      'Ordinateur : cliquez sur une pièce puis sur une case ; un aperçu fantôme suit la souris sur la grille. Le glisser-déposer à la souris fonctionne aussi.',
      'Touchez de nouveau la pièce sélectionnée (ou appuyez sur Échap) pour annuler la sélection.',
      'Aucun chronomètre : le rythme est entièrement libre.',
    ],
    en: [
      'Mobile: drag a piece from its slot towards the grid — it follows your finger and drops as soon as the targeted area lights up; or tap the piece, then the destination cell.',
      'Desktop: click a piece then a cell; a ghost preview follows the mouse over the grid. Mouse drag-and-drop works too.',
      'Tap the selected piece again (or press Escape) to cancel the selection.',
      'No timer: the pace is entirely yours.',
    ],
  },
  features: {
    fr: [
      'Grille 10×10 et pièces dessinées en mini-grilles, avec un dégradé chaud par famille de formes.',
      'Glisser-déposer tactile : la pièce suit le doigt et le dépôt s’aimante sur les cases ; pose en deux gestes également possible.',
      'Deux modes : Classique (toutes les pièces, carré 3×3 rare) et Détente (pièces ≤ 4 cases).',
      'Combos ×2/×3/×4 quand plusieurs lignes sont effacées d’un coup, avec animation flottante.',
      'Défi du jour : la séquence de pièces est déterministe, identique pour tous les joueurs.',
      'Sauvegarde automatique de la partie en cours (grille, pièces, score) avec reprise en un geste.',
      'Record de meilleur score, XP proportionnelle au score, succès à débloquer et légères vibrations tactiles de retour.',
    ],
    en: [
      '10×10 grid with pieces drawn as mini-grids, each shape family in a warm gradient.',
      'Touch drag-and-drop: the piece follows your finger and the drop snaps to the cells; two-tap placement also works.',
      'Two modes: Classic (all pieces, rare 3×3 square) and Relax (pieces ≤ 4 cells).',
      '×2/×3/×4 combos when several lines are cleared at once, with a floating animation.',
      'Daily challenge: the piece sequence is deterministic and identical for every player.',
      'Automatic save of the game in progress (grid, pieces, score) with one-tap resume.',
      'Best-score record, XP proportional to the score, achievements to unlock and light haptic feedback.',
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
  const [ghost, setGhost] = useState<GhostPreview | null>(null)
  const [clearing, setClearing] = useState<Set<number>>(() => new Set())
  const [flash, setFlash] = useState(0)
  const [comboFx, setComboFx] = useState<{ n: number; pts: number; key: number } | null>(null)
  const [comboBest, setComboBest] = useState(0)
  const [wasRecord, setWasRecord] = useState(false)
  const [confettiFire, setConfettiFire] = useState(0)
  const [dragUi, setDragUi] = useState<DragUi | null>(null)

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
  function finish(finalScore: number, wasDaily: boolean) {
    sfx.play('lose')
    const rec = finalScore > 0 ? setBest(gameId, 'best-score', finalScore, false) : false
    setWasRecord(rec)
    if (rec) setConfettiFire((n) => n + 1)
    if (finalScore > 0) addXp(Math.floor(finalScore / 100))
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
    setClearing(new Set())
    setComboFx(null)
    setFlash(0)
    setComboBest(0)
    setWasRecord(false)
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
    setClearing(new Set())
    setComboFx(null)
    setFlash(0)
    setComboBest(0)
    setWasRecord(false)
    lockRef.current = false
    addPlay(gameId)
    sfx.play('pop')
    if (over) finish(saved.score, saved.daily)
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
      // Flash visuel des cases effacées (l'état est déjà nettoyé)
      setClearing(cleared)
      sched(() => {
        setClearing(new Set())
        lockRef.current = false
      }, 340)
      if (nLines >= 2) {
        setComboFx({ n: nLines, pts: 10 * nLines * mult, key: Date.now() })
        sched(() => setComboFx(null), 950)
      }
    } else {
      lockRef.current = false
    }
    if (over) finish(newScore, game.daily)
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

  return (
    <div className="relative no-select select-none">
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
          <Pill compact icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />} label={L.score} value={game.score} />
          <Pill compact icon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />} label={L.lines} value={game.lines} />
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
              'grid aspect-square grid-cols-10 gap-[2px] rounded-xl border-2 bg-card p-[3px] shadow-inner',
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
                  {clearing.has(i) ? (
                    <span className="anim-pop-in absolute inset-0 rounded-[3px] bg-white/85" aria-hidden="true" />
                  ) : null}
                </div>
              )
            })}
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
                <Pill icon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />} label={L.lines} value={game.lines} />
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
              <Button size="lg" className="h-10 gap-1.5 rounded-full" onClick={() => startGame(game.mode, false)}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                {t('common.playAgain')}
              </Button>
            </div>
          ) : null}

          {/* Confettis (uniquement en cas de record ; respecte useReducedMotion en interne) */}
          <Confetti fire={confettiFire} />
        </div>
      ) : (
        <div className="checkerboard flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border p-6 text-center sm:min-h-[300px]">
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
