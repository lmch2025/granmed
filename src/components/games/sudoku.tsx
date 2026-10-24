'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, RotateCcw, CalendarCheck, Timer, Lightbulb, SearchCheck, Pause, Pencil, Eraser, BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { loadSave, saveSave, clearSave } from '@/lib/save'
import { todayKey, mulberry32, seedFromString, shuffle, clamp, formatMs, useReducedMotion } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'
import { toast } from 'sonner'

export const gameId = 'sudoku'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Des grilles à solution unique garantie, quatre niveaux, notes au crayon et chrono : le sudoku zen de Granmed.',
    en: 'Uniquely solvable grids, four levels, pencil notes and a timer: Granmed’s zen sudoku.',
  },
  description: {
    fr: [
      'Sudoku Zen est un jeu de sudoku gratuit en ligne dans lequel vous complétez une grille 9×9 avec les chiffres 1 à 9, sans jamais répéter un chiffre dans une ligne, une colonne ou un bloc de 3×3.',
      'Chaque grille est générée sur mesure et vérifie une propriété essentielle : elle admet exactement une seule solution. Quatre niveaux de difficulté — de 40 indices en Facile à 24 en Expert — s’adaptent aux débutants comme aux vétérans, et un défi du jour identique pour tous renouvelle l’intérêt chaque matin.',
      'Notes au crayon nettoyées automatiquement, contrôle des erreurs, compteur de fautes, trois indices par grille et chronomètre avec pause : tout est pensé pour une partie calme et rigoureuse, sauvegardée automatiquement pour être reprise à tout moment.',
    ],
    en: [
      'Sudoku Zen is a free online sudoku game in which you complete a 9×9 grid with the digits 1 to 9, never repeating a digit within a row, a column or a 3×3 box.',
      'Every grid is generated on the fly and verified for one essential property: it admits exactly one solution. Four difficulty levels — from 40 givens in Easy down to 24 in Expert — suit beginners and veterans alike, and a daily challenge, identical for everyone, renews the fun every morning.',
      'Self-cleaning pencil notes, error checking, a mistake counter, three hints per grid and a pausable timer: everything is designed for a calm, rigorous game, saved automatically so you can resume at any time.',
    ],
  },
  rules: {
    fr: [
      'Complétez la grille avec les chiffres 1 à 9.',
      'Chaque chiffre apparaît une seule fois par ligne, par colonne et par bloc 3×3.',
      'Les chiffres donnés au départ ne peuvent pas être modifiés.',
      'Activez le mode notes pour inscrire plusieurs candidats au crayon dans une case.',
      'La grille est résolue quand elle est entièrement remplie et valide — sa solution est unique.',
    ],
    en: [
      'Complete the grid with the digits 1 to 9.',
      'Each digit appears only once per row, column and 3×3 box.',
      'The givens provided at the start cannot be changed.',
      'Turn on notes mode to pencil several candidates into a cell.',
      'The grid is solved when fully filled and valid — its solution is unique.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez une case puis un chiffre du pavé numérique.',
      'Ordinateur : cliquez une case ; tapez 1–9, effacez avec Retour/Suppr, déplacez-vous avec les flèches, N bascule les notes, H demande un indice, P met en pause.',
      'Bouton pause : fige le chronomètre et masque la grille.',
    ],
    en: [
      'Mobile & tablet: tap a cell, then a digit on the number pad.',
      'Desktop: click a cell; type 1–9, erase with Backspace/Delete, move with arrow keys, N toggles notes, H asks for a hint, P pauses.',
      'Pause button: freezes the timer and hides the grid.',
    ],
  },
  features: {
    fr: [
      'Générateur à solution unique vérifiée pour chaque grille',
      '4 difficultés : Facile (40 indices), Moyen (34), Difficile (28), Expert (24)',
      'Notes crayon 3×3 et surbrillance ligne/colonne/bloc',
      'Contrôle automatique des erreurs, compteur de fautes et 3 indices par partie',
      'Les notes des cases voisines s’effacent dès qu’un chiffre est posé',
      'Chronomètre avec pause (y compris automatique en arrière-plan)',
      'Records de temps par difficulté et défi du jour quotidien',
    ],
    en: [
      'Generator with a verified unique solution for every grid',
      '4 difficulties: Easy (40 givens), Medium (34), Hard (28), Expert (24)',
      '3×3 pencil notes and row/column/box highlighting',
      'Automatic error checking, mistake counter and 3 hints per game',
      'Neighbouring pencil notes are cleared as soon as a digit is placed',
      'Timer with pause (including automatic pause in background)',
      'Best times per difficulty and a daily challenge',
    ],
  },
  tips: {
    fr: [
      'Commencez par les chiffres les plus présents : c’est là que les déductions sont les plus rapides.',
      'Un chiffre ne peut aller que dans une case d’un bloc ? Notez-le, puis éliminez par lignes et colonnes.',
      'Utilisez le mode notes pour les cases à 2–3 candidats, puis nettoyez-les au fil des déductions.',
      'En Expert, ne devinez jamais : chaque grille a une solution logique unique.',
    ],
    en: [
      'Start with the most frequent digits: that is where deductions come fastest.',
      'A digit can only fit one cell of a box? Pencil it in, then eliminate by rows and columns.',
      'Use notes mode for cells with 2–3 candidates, then clean them up as you deduce.',
      'On Expert, never guess: every grid has a unique logical solution.',
    ],
  },
  faq: {
    fr: [
      { q: 'Les grilles ont-elles vraiment une solution unique ?', a: 'Oui. À chaque tentative de retrait d’un chiffre pendant la génération, un solveur compte les solutions de la grille (arrêt dès la deuxième) : si l’unicité était perdue, le chiffre est remis en place.' },
      { q: 'Le chronomètre compte-t-il quand je change d’onglet ?', a: 'Non : le chrono se met en pause automatiquement quand la page devient invisible, et vous pouvez le mettre en pause manuellement à tout moment.' },
      { q: 'À quoi servent les indices ?', a: 'Un indice remplit correctement la case sélectionnée (ou une case utile choisie au hasard). Vous en avez 3 par grille ; chaque indice utilisé réduit l’expérience gagnée.' },
      { q: 'Puis-je reprendre une grille en cours ?', a: 'Oui : la grille, les notes, le chrono, les erreurs et les indices restants sont sauvegardés automatiquement ; la page vous proposera de reprendre au retour.' },
      { q: 'Quelle est la différence entre les difficultés ?', a: 'Le nombre de chiffres donnés au départ : 40 en Facile, 34 en Moyen, 28 en Difficile, 24 en Expert. Moins d’indices signifie des déductions plus longues.' },
    ],
    en: [
      { q: 'Do the grids really have a unique solution?', a: 'Yes. Every time the generator attempts to remove a digit, a solver counts the grid’s solutions (stopping at the second): if uniqueness would be lost, the digit is put back.' },
      { q: 'Does the timer run when I switch tabs?', a: 'No: the timer pauses automatically when the page becomes hidden, and you can pause it manually at any time.' },
      { q: 'What are hints for?', a: 'A hint fills the selected cell (or a useful random cell) correctly. You get 3 per grid; each hint used reduces the experience earned.' },
      { q: 'Can I resume a grid in progress?', a: 'Yes: the grid, notes, timer, mistakes and remaining hints are saved automatically; the page will offer to resume when you come back.' },
      { q: 'What is the difference between difficulties?', a: 'The number of starting givens: 40 in Easy, 34 in Medium, 28 in Hard, 24 in Expert. Fewer givens mean longer deductions.' },
    ],
  },
  records: {
    'best-time-easy': { fr: 'Meilleur temps — Facile', en: 'Best time — Easy' },
    'best-time-medium': { fr: 'Meilleur temps — Moyen', en: 'Best time — Medium' },
    'best-time-hard': { fr: 'Meilleur temps — Difficile', en: 'Best time — Hard' },
    'best-time-expert': { fr: 'Meilleur temps — Expert', en: 'Best time — Expert' },
  },
}

/* ================= Générateur (solution unique garantie) ================= */

type Diff = 'easy' | 'medium' | 'hard' | 'expert'

const DIFFS: { id: Diff; givens: number; xp: number; dots: number }[] = [
  { id: 'easy', givens: 40, xp: 30, dots: 1 },
  { id: 'medium', givens: 34, xp: 50, dots: 2 },
  { id: 'hard', givens: 28, xp: 80, dots: 3 },
  { id: 'expert', givens: 24, xp: 120, dots: 4 },
]

function popcount9(v: number): number {
  let n = 0
  while (v) {
    v &= v - 1
    n++
  }
  return n
}

/** Étape 1 : remplit une grille complète valide par backtracking randomisé. */
function generateSolution(rand: () => number): number[] {
  const grid = new Array<number>(81).fill(0)
  const rows = new Array<number>(9).fill(0)
  const cols = new Array<number>(9).fill(0)
  const boxes = new Array<number>(9).fill(0)
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  function fill(pos: number): boolean {
    if (pos === 81) return true
    const r = (pos / 9) | 0
    const c = pos % 9
    const b = ((r / 3) | 0) * 3 + ((c / 3) | 0)
    for (const d of shuffle(digits, rand)) {
      const bit = 1 << d
      if ((rows[r] | cols[c] | boxes[b]) & bit) continue
      grid[pos] = d
      rows[r] |= bit
      cols[c] |= bit
      boxes[b] |= bit
      if (fill(pos + 1)) return true
      grid[pos] = 0
      rows[r] ^= bit
      cols[c] ^= bit
      boxes[b] ^= bit
    }
    return false
  }
  fill(0)
  return grid
}

/** Étape 2 : compte les solutions d'une grille (arrêt dès `limit` atteint). Ne modifie pas l'entrée. */
function countSolutions(input: number[], limit: number): number {
  const g = input.slice()
  const rows = new Array<number>(9).fill(0)
  const cols = new Array<number>(9).fill(0)
  const boxes = new Array<number>(9).fill(0)
  for (let i = 0; i < 81; i++) {
    if (g[i] === 0) continue
    const r = (i / 9) | 0
    const c = i % 9
    const b = ((r / 3) | 0) * 3 + ((c / 3) | 0)
    const bit = 1 << g[i]
    rows[r] |= bit
    cols[c] |= bit
    boxes[b] |= bit
  }
  let count = 0

  function backtrack(): boolean {
    // MRV : chercher la case vide avec le moins de candidats
    let best = -1
    let bestMask = 0
    let bestN = 10
    for (let i = 0; i < 81; i++) {
      if (g[i] !== 0) continue
      const r = (i / 9) | 0
      const c = i % 9
      const b = ((r / 3) | 0) * 3 + ((c / 3) | 0)
      const mask = ~(rows[r] | cols[c] | boxes[b]) & 0x3fe
      const n = popcount9(mask)
      if (n === 0) return false // impasse
      if (n < bestN) {
        bestN = n
        best = i
        bestMask = mask
        if (n === 1) break
      }
    }
    if (best === -1) {
      count++
      return count >= limit
    }
    const r = (best / 9) | 0
    const c = best % 9
    const b = ((r / 3) | 0) * 3 + ((c / 3) | 0)
    for (let d = 1; d <= 9; d++) {
      const bit = 1 << d
      if (!(bestMask & bit)) continue
      g[best] = d
      rows[r] |= bit
      cols[c] |= bit
      boxes[b] |= bit
      const stop = backtrack()
      g[best] = 0
      rows[r] ^= bit
      cols[c] ^= bit
      boxes[b] ^= bit
      if (stop) return true
    }
    return false
  }

  backtrack()
  return count
}

/** Étape 3 : retire des chiffres un à un en vérifiant l'unicité de la solution À CHAQUE tentative. */
function makePuzzle(targetGivens: number, rand: () => number): { givens: number[]; solution: number[] } {
  const solution = generateSolution(rand)
  const givens = solution.slice()
  const positions = shuffle(Array.from({ length: 81 }, (_, i) => i), rand)
  let toRemove = 81 - targetGivens
  for (const pos of positions) {
    if (toRemove <= 0) break
    const backup = givens[pos]
    if (backup === 0) continue
    givens[pos] = 0
    if (countSolutions(givens, 2) === 1) {
      toRemove--
    } else {
      givens[pos] = backup // l'unicité serait perdue : on remet le chiffre
    }
  }
  return { givens, solution }
}

/** Cases voisines (ligne + colonne + bloc) précalculées. */
const PEERS: number[][] = (() => {
  const peers: number[][] = []
  for (let i = 0; i < 81; i++) {
    const r = (i / 9) | 0
    const c = i % 9
    const set = new Set<number>()
    for (let k = 0; k < 9; k++) {
      set.add(r * 9 + k)
      set.add(k * 9 + c)
    }
    const br = ((r / 3) | 0) * 3
    const bc = ((c / 3) | 0) * 3
    for (let dr = 0; dr < 3; dr++) {
      for (let dc = 0; dc < 3; dc++) set.add((br + dr) * 9 + (bc + dc))
    }
    set.delete(i)
    peers.push([...set])
  }
  return peers
})()

const PEERS_SET: Set<number>[] = PEERS.map((p) => new Set(p))

/** Grille du jour (mémoïsée : génération déterministe coûteuse). */
let dailyPuzzleCache: { date: string; givens: number[]; solution: number[] } | null = null

function findConflicts(grid: number[]): Set<number> {
  const out = new Set<number>()
  for (let i = 0; i < 81; i++) {
    const v = grid[i]
    if (!v) continue
    for (const j of PEERS[i]) {
      if (grid[j] === v) {
        out.add(i)
        out.add(j)
      }
    }
  }
  return out
}

/** Haptique légère (no-op sur les navigateurs sans Vibration API). */
function buzz(ms: number) {
  try {
    navigator.vibrate?.(ms)
  } catch {}
}

/* ================= Textes locaux ================= */
const STR = {
  fr: {
    givens: 'indices',
    generating: 'Génération de la grille…',
    generatingSub: 'Vérification de la solution unique en cours',
    notes: 'Notes',
    erase: 'Effacer',
    autoCheck: 'Contrôle auto des erreurs',
    verify: 'Vérifier',
    confirm: 'Confirmer le recommencement ?',
    noErrors: 'Aucune erreur — parfait !',
    errors: (n: number) => `${n} case${n > 1 ? 's' : ''} incorrecte${n > 1 ? 's' : ''}`,
    errorsLabel: 'Erreurs',
    cell: 'Case',
    given: 'donné',
    board: 'Grille de sudoku',
    pad: 'Pavé numérique',
    savedGame: 'Grille sauvegardée',
    hintsUsed: 'Indices utilisés',
    xpEarned: 'XP gagnés',
    replay: 'Même difficulté',
  },
  en: {
    givens: 'givens',
    generating: 'Generating the grid…',
    generatingSub: 'Verifying the unique solution',
    notes: 'Notes',
    erase: 'Erase',
    autoCheck: 'Auto error check',
    verify: 'Check',
    confirm: 'Confirm restart?',
    noErrors: 'No errors — perfect!',
    errors: (n: number) => `${n} wrong cell${n > 1 ? 's' : ''}`,
    errorsLabel: 'Errors',
    cell: 'Cell',
    given: 'given',
    board: 'Sudoku grid',
    pad: 'Number pad',
    savedGame: 'Saved grid',
    hintsUsed: 'Hints used',
    xpEarned: 'XP earned',
    replay: 'Same difficulty',
  },
}

interface SudokuSave {
  diff: Diff
  daily: boolean
  /** Date à laquelle le défi du jour a été lancé (clé du crédit quotidien). */
  dailyDate?: string
  givens: number[]
  solution: number[]
  grid: number[]
  notes: number[]
  elapsed: number
  hintsUsed: number
  hinted: number[]
  mistakes?: number
}

/** Largeur maximale du plateau : limitée par la hauteur pour rester à l'écran sans scroll. */
const BOARD_MAX = 'max-w-[min(440px,calc(100dvh_-_400px))]'

/* ================= Composant principal ================= */
export default function SudokuGame() {
  const t = useT()
  const lang = useLang()
  const reduce = useReducedMotion()
  const L = STR[lang]
  const dailyDone = useIsDailyDone(gameId)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)

  const [phase, setPhase] = useState<'menu' | 'generating' | 'playing' | 'won'>('menu')
  const [diff, setDiff] = useState<Diff>('easy')
  const [daily, setDaily] = useState(false)
  const [dailyDate, setDailyDate] = useState<string | null>(null)
  const [givens, setGivens] = useState<number[]>(() => new Array(81).fill(0))
  const [solution, setSolution] = useState<number[]>(() => new Array(81).fill(0))
  const [grid, setGrid] = useState<number[]>(() => new Array(81).fill(0))
  const [notes, setNotes] = useState<number[]>(() => new Array(81).fill(0))
  const [sel, setSel] = useState(-1)
  const [notesMode, setNotesMode] = useState(false)
  const [autoCheck, setAutoCheck] = useState(true)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [hinted, setHinted] = useState<number[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [sessKey, setSessKey] = useState(0)
  const [restored, setRestored] = useState<SudokuSave | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)
  const [wonInfo, setWonInfo] = useState<{ ms: number; xp: number; isRecord: boolean } | null>(null)
  const [confirmRestart, setConfirmRestart] = useState(false)

  const baseRef = useRef(0)
  const segStartRef = useRef(0)
  const pauseRef = useRef<() => void>(() => {})
  const keyRef = useRef<(e: KeyboardEvent) => void>(() => {})
  const genTimerRef = useRef<number | null>(null)

  const canAct = phase === 'playing' && running

  /* --- Chronomètre : segment courant + base accumulée --- */
  useEffect(() => {
    if (!running) return
    segStartRef.current = Date.now()
    const id = window.setInterval(() => setElapsed(baseRef.current + (Date.now() - segStartRef.current)), 500)
    return () => window.clearInterval(id)
  }, [running, sessKey])

  function currentElapsed(): number {
    return baseRef.current + (running ? Date.now() - segStartRef.current : 0)
  }

  /* --- Pause automatique en arrière-plan (handler via ref => jamais stale) --- */
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) pauseRef.current()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  /* --- Clavier physique (handler via ref) --- */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => keyRef.current(e)
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  /* --- Restauration au montage (callback asynchrone) --- */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      if (!alive) return
      const s = loadSave<SudokuSave>(gameId)
      if (
        s &&
        Array.isArray(s.grid) && s.grid.length === 81 &&
        Array.isArray(s.givens) && s.givens.length === 81 &&
        Array.isArray(s.solution) && s.solution.length === 81 &&
        (s.diff === 'easy' || s.diff === 'medium' || s.diff === 'hard' || s.diff === 'expert')
      ) {
        setRestored(s)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  /* --- Nettoyage du minuteur de génération au démontage --- */
  useEffect(
    () => () => {
      if (genTimerRef.current !== null) window.clearTimeout(genTimerRef.current)
    },
    [],
  )

  /* --- Sauvegarde automatique à chaque modification --- */
  useEffect(() => {
    if (phase !== 'playing') return
    const data: SudokuSave = {
      diff,
      daily,
      dailyDate: dailyDate ?? undefined,
      givens,
      solution,
      grid,
      notes,
      elapsed: currentElapsed(),
      hintsUsed,
      hinted,
      mistakes,
    }
    saveSave(gameId, data)
  }, [phase, diff, daily, dailyDate, givens, solution, grid, notes, hintsUsed, hinted, mistakes, running])

  /* --- Actions --- */
  function pause() {
    if (!running) return
    baseRef.current += Date.now() - segStartRef.current
    setElapsed(baseRef.current)
    setRunning(false)
    sfx.play('click', { volume: 0.4 })
  }

  function resumeTimer() {
    if (running || phase !== 'playing') return
    setRunning(true)
    sfx.play('click', { volume: 0.5 })
  }

  function newGame(d: Diff, isDaily = false) {
    sfx.play('click')
    setDiff(d)
    setDaily(isDaily)
    setDailyDate(isDaily ? todayKey() : null)
    setPhase('generating')
    if (genTimerRef.current !== null) window.clearTimeout(genTimerRef.current)
    genTimerRef.current = window.setTimeout(() => {
      genTimerRef.current = null
      let gz: number[]
      let sol: number[]
      if (isDaily) {
        const key = todayKey()
        if (!dailyPuzzleCache || dailyPuzzleCache.date !== key) {
          const rand = mulberry32(seedFromString(`${gameId}:${key}`))
          const p = makePuzzle(34, rand)
          dailyPuzzleCache = { date: key, givens: p.givens, solution: p.solution }
        }
        gz = dailyPuzzleCache.givens
        sol = dailyPuzzleCache.solution
      } else {
        const p = makePuzzle(DIFFS.find((x) => x.id === d)?.givens ?? 34, Math.random)
        gz = p.givens
        sol = p.solution
      }
      setGivens(gz)
      setSolution(sol)
      setGrid([...gz])
      setNotes(new Array(81).fill(0))
      setSel(-1)
      setNotesMode(false)
      setHintsUsed(0)
      setHinted([])
      setMistakes(0)
      setWonInfo(null)
      setConfirmRestart(false)
      baseRef.current = 0
      setElapsed(0)
      setSessKey((k) => k + 1)
      setRunning(true)
      setPhase('playing')
      addPlay(gameId)
      sfx.play('sweep')
    }, 40)
  }

  function resumeGame() {
    const s = restored
    if (!s) return
    setDiff(s.diff)
    setDaily(s.daily)
    setDailyDate(s.daily ? s.dailyDate ?? null : null)
    setGivens(s.givens)
    setSolution(s.solution)
    setGrid(s.grid)
    setNotes(Array.isArray(s.notes) && s.notes.length === 81 ? s.notes : new Array(81).fill(0))
    setSel(-1)
    setNotesMode(false)
    setHintsUsed(typeof s.hintsUsed === 'number' ? s.hintsUsed : 0)
    setHinted(Array.isArray(s.hinted) ? s.hinted : [])
    setMistakes(typeof s.mistakes === 'number' ? s.mistakes : 0)
    setWonInfo(null)
    baseRef.current = s.elapsed
    setElapsed(s.elapsed)
    setSessKey((k) => k + 1)
    setRunning(true)
    setPhase('playing')
    setRestored(null)
    addPlay(gameId)
    sfx.play('pop')
  }

  function restartCurrent() {
    setGrid([...givens])
    setNotes(new Array(81).fill(0))
    setSel(-1)
    setHintsUsed(0)
    setHinted([])
    setMistakes(0)
    baseRef.current = 0
    setElapsed(0)
    setSessKey((k) => k + 1)
    setRunning(true)
    setConfirmRestart(false)
    addPlay(gameId)
    sfx.play('sweep')
  }

  function onRestartClick() {
    if (!confirmRestart) {
      sfx.play('click', { volume: 0.5 })
      setConfirmRestart(true)
      window.setTimeout(() => setConfirmRestart(false), 2500)
      return
    }
    restartCurrent()
  }

  function toggleNotesMode() {
    sfx.play('click', { volume: 0.5 })
    setNotesMode((v) => !v)
  }

  /** Nettoie les notes d'une case et de ses voisines quand le chiffre d y est posé. */
  function cleanNotes(nn: number[], i: number, d: number) {
    nn[i] = 0
    for (const j of PEERS[i]) nn[j] &= ~(1 << d)
  }

  function inputDigit(d: number) {
    if (phase !== 'playing' || !running || sel < 0) return
    if (givens[sel] !== 0 || hinted.includes(sel)) {
      sfx.play('wrong', { volume: 0.25 })
      buzz(10)
      return
    }
    if (notesMode) {
      if (grid[sel] !== 0) {
        sfx.play('click', { volume: 0.3 })
        return
      }
      const nn = [...notes]
      nn[sel] ^= 1 << d
      setNotes(nn)
      sfx.play('click', { volume: 0.4 })
      buzz(10)
      return
    }
    const ng = [...grid]
    ng[sel] = ng[sel] === d ? 0 : d
    const nn = [...notes]
    const placed = ng[sel]
    if (placed !== 0) cleanNotes(nn, sel, placed)
    else nn[sel] = 0
    setGrid(ng)
    setNotes(nn)
    buzz(10)
    if (placed === 0) {
      sfx.play('click', { volume: 0.4 })
    } else if (placed !== solution[sel]) {
      setMistakes((m) => m + 1)
      sfx.play('wrong', { volume: 0.35 })
    } else {
      sfx.play('pop', { volume: 0.6 })
    }
    checkWin(ng)
  }

  function eraseCell() {
    if (phase !== 'playing' || !running || sel < 0) return
    if (givens[sel] !== 0 || hinted.includes(sel)) return
    if (grid[sel] === 0 && notes[sel] === 0) return
    const ng = [...grid]
    ng[sel] = 0
    const nn = [...notes]
    nn[sel] = 0
    setGrid(ng)
    setNotes(nn)
    sfx.play('sweep', { volume: 0.4 })
  }

  function giveHint() {
    if (phase !== 'playing' || !running || hintsUsed >= 3) return
    const fixable = (i: number) => givens[i] === 0 && !hinted.includes(i) && grid[i] !== solution[i]
    let target = sel
    if (target < 0 || !fixable(target)) {
      const candidates: number[] = []
      for (let i = 0; i < 81; i++) if (fixable(i)) candidates.push(i)
      if (candidates.length === 0) return
      target = candidates[Math.floor(Math.random() * candidates.length)]
    }
    const ng = [...grid]
    ng[target] = solution[target]
    const nn = [...notes]
    cleanNotes(nn, target, solution[target])
    setGrid(ng)
    setNotes(nn)
    setHinted([...hinted, target])
    setHintsUsed((h) => h + 1)
    setSel(target)
    sfx.play('correct')
    checkWin(ng, hintsUsed + 1)
  }

  function verify() {
    if (phase !== 'playing') return
    let wrong = 0
    for (let i = 0; i < 81; i++) if (grid[i] !== 0 && grid[i] !== solution[i]) wrong++
    if (wrong === 0) {
      sfx.play('correct')
      toast('✅', { description: L.noErrors, duration: 3500 })
    } else {
      sfx.play('wrong')
      toast('⚠️', { description: L.errors(wrong), duration: 3500 })
    }
  }

  function checkWin(g: number[], hintsOverride?: number) {
    for (let i = 0; i < 81; i++) if (g[i] !== solution[i]) return
    finishWin(hintsOverride)
  }

  /* Victoire : appelée depuis un handler (jamais depuis un effet) */
  function finishWin(hintsOverride?: number) {
    const ms = currentElapsed()
    const hu = hintsOverride ?? hintsUsed
    const xp = Math.max(0, (DIFFS.find((x) => x.id === diff)?.xp ?? 30) - 10 * hu)
    const isRecord = setBest(gameId, `best-time-${diff}`, Math.round(ms / 100) / 10, true)
    setRunning(false)
    setElapsed(ms)
    setPhase('won')
    setWonInfo({ ms, xp, isRecord })
    setConfettiKey((k) => k + 1)
    setBurstKey((k) => k + 1)
    sfx.play('win')
    addWin(gameId)
    addXp(xp)
    /* Niveaux par jeu : 30 sans indice, léger malus par indice utilisé. */
    addGameXp(gameId, Math.max(20, 30 - 4 * hu))
    if (diff === 'hard') unlockBadge('sudoku-hard')
    if (diff === 'expert' && hu === 0) unlockBadge('sudoku-expert-nohints')
    // Crédit du défi du jour uniquement si la grille a bien été lancée aujourd'hui
    if (daily && dailyDate === todayKey()) completeDaily(gameId)
    clearSave(gameId)
  }

  function handleKey(e: KeyboardEvent) {
    if (phase !== 'playing') return
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const k = e.key
    if (k === 'Escape') {
      e.preventDefault()
      setSel(-1)
      return
    }
    if (k === 'p' || k === 'P') {
      e.preventDefault()
      if (running) pause()
      else resumeTimer()
      return
    }
    if (!running) return
    if (k >= '1' && k <= '9') {
      e.preventDefault()
      inputDigit(Number(k))
      return
    }
    if (k === 'Backspace' || k === 'Delete' || k === '0') {
      e.preventDefault()
      eraseCell()
      return
    }
    if (k === 'n' || k === 'N') {
      e.preventDefault()
      toggleNotesMode()
      return
    }
    if (k === 'h' || k === 'H') {
      e.preventDefault()
      giveHint()
      return
    }
    const dirs: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    }
    const d = dirs[k]
    if (d) {
      e.preventDefault()
      if (sel < 0) {
        setSel(40)
        return
      }
      const r = clamp(((sel / 9) | 0) + d[0], 0, 8)
      const c = clamp((sel % 9) + d[1], 0, 8)
      setSel(r * 9 + c)
      sfx.play('click', { volume: 0.25 })
    }
  }

  /* --- Handlers gardés à jour via refs (abonnements attachés une fois) --- */
  useEffect(() => {
    pauseRef.current = pause
    keyRef.current = handleKey
  })

  /* --- Valeurs dérivées --- */
  const conflicts = useMemo(() => (autoCheck ? findConflicts(grid) : new Set<number>()), [autoCheck, grid])
  const remaining = useMemo(() => {
    const counts = new Array(10).fill(0)
    for (const v of grid) if (v) counts[v]++
    return Array.from({ length: 9 }, (_, k) => 9 - counts[k + 1])
  }, [grid])
  const selVal = sel >= 0 ? grid[sel] : 0

  /* --- Rendu : écran de choix (compact, boutons visibles immédiatement) --- */
  if (phase === 'menu') {
    return (
      <div className="checkerboard flex min-h-[300px] w-full select-none flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-center sm:p-6 my-auto">
        <div className="flex gap-2" aria-hidden="true">
          {['🔢', '✏️', '🧘'].map((e, i) => (
            <span key={i} className={cn('text-3xl', !reduce && 'anim-floaty')} style={{ animationDelay: `${i * 0.4}s` }}>
              {e}
            </span>
          ))}
        </div>
        <p className="max-w-md text-xs text-muted-foreground sm:text-sm">{content.tagline[lang]}</p>
        {restored ? (
          <Button size="lg" className="anim-glow rounded-full px-6" onClick={resumeGame}>
            <Play className="h-4 w-4" aria-hidden="true" />
            {t('game.resume')}
          </Button>
        ) : null}
        <div className="grid w-full max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
          {DIFFS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => newGame(d.id)}
              className="flex min-h-[72px] touch-manipulation select-none flex-col items-center justify-center gap-1 rounded-2xl border-2 border-border bg-card p-2.5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] sm:min-h-[88px]"
            >
              <span className="font-display text-sm font-extrabold sm:text-base">{t(`common.${d.id}`)}</span>
              <span className="flex items-center gap-1" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={cn('h-1.5 w-1.5 rounded-full', i <= d.dots ? 'bg-foreground/60' : 'bg-foreground/15')} />
                ))}
              </span>
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {d.givens} {L.givens}
              </span>
            </button>
          ))}
        </div>
        <Button variant="outline" size="lg" className="rounded-full" onClick={() => newGame('medium', true)} disabled={dailyDone}>
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          {dailyDone ? t('common.dailyDone') : t('game.startDaily')}
        </Button>
        {restored ? (
          <p className="text-[11px] text-muted-foreground">
            {L.savedGame} — {t(`common.${restored.diff}`)}
            {restored.daily ? ' 📅' : ''} · {formatMs(restored.elapsed)}
          </p>
        ) : null}
      </div>
    )
  }

  if (phase === 'generating') {
    return (
      <div className="flex min-h-[300px] w-full select-none flex-col items-center justify-center gap-3 rounded-2xl border p-6 text-center my-auto" aria-busy="true">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" role="status" aria-label={L.generating} />
        <p className="font-display text-base font-bold">{L.generating}</p>
        <p className="max-w-xs text-xs text-muted-foreground">{L.generatingSub}</p>
      </div>
    )
  }

  return (
    <div className="relative my-auto w-full select-none">
      <Confetti fire={confettiKey} count={reduce ? 0 : 110} waves={2} gold />
      <VictoryBurst
        fire={burstKey}
        stars={hintsUsed === 0 && mistakes === 0 ? 3 : hintsUsed <= 1 && mistakes <= 3 ? 2 : 1}
        sub={phase === 'won' && wonInfo ? `${t(`common.${diff}`)} · ${formatMs(wonInfo.ms)}` : undefined}
      />

      {/* HUD compact une ligne : temps, erreurs, difficulté + pause/recommencer */}
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <span className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-sm font-bold tabular-nums">
          <Timer className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {formatMs(elapsed)}
        </span>
        <span
          className={cn(
            'flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-bold tabular-nums',
            mistakes > 0 ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300' : 'bg-secondary/70 text-muted-foreground',
          )}
          aria-label={L.errorsLabel}
          title={L.errorsLabel}
        >
          <span aria-hidden="true">✕</span>
          {mistakes}
        </span>
        <span className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-secondary/70 px-3 text-xs font-bold">
          {t(`common.${diff}`)}
          {daily ? (
            <span className="text-amber-500" title={t('common.daily')} aria-hidden="true">
              📅
            </span>
          ) : null}
        </span>
        <div className="ms-auto flex shrink-0 items-center gap-1.5">
          {phase === 'playing' ? (
            <Button
              variant="secondary"
              className="h-9 w-9 rounded-full p-0"
              onClick={() => (running ? pause() : resumeTimer())}
              aria-label={running ? t('common.pause') : t('common.resume')}
              title={running ? t('common.pause') : t('common.resume')}
            >
              {running ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            </Button>
          ) : null}
          {phase === 'playing' ? (
            <Button
              variant={confirmRestart ? 'destructive' : 'ghost'}
              className="h-9 w-9 rounded-full p-0"
              onClick={onRestartClick}
              aria-label={confirmRestart ? L.confirm : t('common.restart')}
              title={confirmRestart ? L.confirm : t('common.restart')}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      </div>

      {/* Grille — largeur/plafonnée pour tenir à l'écran sans scroll */}
      <div
        className={cn('relative mx-auto w-full overflow-hidden rounded-xl border-2 border-foreground/70 bg-card shadow-inner [container-type:inline-size]', BOARD_MAX)}
        role="grid"
        aria-label={L.board}
      >
        <div className="grid aspect-square grid-cols-9">
          {Array.from({ length: 81 }, (_, i) => {
            const v = grid[i]
            const given = givens[i] !== 0
            const hint = hinted.includes(i)
            const isSel = i === sel
            const isPeer = sel >= 0 && PEERS_SET[sel].has(i)
            const same = selVal !== 0 && v === selVal && !isSel
            const conflict = conflicts.has(i)
            const r = (i / 9) | 0
            const c = i % 9
            return (
              <button
                key={i}
                type="button"
                role="gridcell"
                aria-label={`${L.cell} ${r + 1}-${c + 1}${v ? ` : ${v}` : given ? ` (${L.given})` : ''}`}
                onClick={() => {
                  setSel(i)
                  sfx.play('click', { volume: 0.3 })
                }}
                className={cn(
                  'relative flex aspect-square touch-manipulation select-none items-center justify-center text-[clamp(15px,5.2cqw,26px)] leading-none transition-colors duration-100 focus-visible:z-20 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                  c < 8 && (c % 3 === 2 ? 'border-r-2 border-r-foreground/50' : 'border-r border-border'),
                  r < 8 && (r % 3 === 2 ? 'border-b-2 border-b-foreground/50' : 'border-b border-border'),
                  isSel
                    ? 'z-10 bg-primary/20 ring-2 ring-inset ring-primary'
                    : conflict
                      ? 'bg-red-50 dark:bg-red-500/15'
                      : same
                        ? 'bg-amber-100 dark:bg-amber-500/20'
                        : isPeer
                          ? 'bg-accent/60'
                          : hint
                            ? 'bg-emerald-50 dark:bg-emerald-500/10'
                            : given
                              ? 'bg-muted/50'
                              : 'bg-card',
                  conflict
                    ? 'text-red-600 dark:text-red-400'
                    : given
                      ? 'font-display text-foreground'
                      : hint
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-primary',
                  given || hint ? 'font-extrabold' : 'font-bold',
                )}
              >
                {v !== 0 ? (
                  <span key={`${given ? 'g' : hint ? 'h' : 'u'}-${v}`} className={cn(!reduce && 'anim-pop-in')}>
                    {v}
                  </span>
                ) : notes[i] !== 0 ? (
                  <span
                    className="grid h-full w-full grid-cols-3 grid-rows-3 p-0.5 text-[clamp(8px,2.6cqw,11px)] font-semibold leading-none text-muted-foreground"
                    aria-hidden="true"
                  >
                    {Array.from({ length: 9 }, (_, k) => (
                      <span key={k} className="flex items-center justify-center">
                        {notes[i] & (1 << (k + 1)) ? k + 1 : ''}
                      </span>
                    ))}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        {/* Voile de pause : fige le chrono et masque la grille */}
        {phase === 'playing' && !running ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card/95 p-4 backdrop-blur-md">
            <Pause className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <p className="font-display text-xl font-extrabold">{t('common.pause')}</p>
            <Button size="lg" className="rounded-full" onClick={resumeTimer} autoFocus>
              <Play className="h-4 w-4" aria-hidden="true" /> {t('common.resume')}
            </Button>
          </div>
        ) : null}

        {/* Victoire : overlay immédiat avec Rejouer */}
        {phase === 'won' && wonInfo ? (
          <div
            className="anim-rise nice-scroll absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 overflow-y-auto bg-card/95 p-4 text-center backdrop-blur-md"
            role="status"
          >
            <p className="font-display text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">🎉 {t('common.victory')}</p>
            {wonInfo.isRecord ? <p className="text-sm font-bold text-amber-600 dark:text-amber-400">🏆 {t('common.newRecord')}</p> : null}
            {daily && dailyDate === todayKey() ? (
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">📅 {t('common.dailyDone')}</p>
            ) : null}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <StatPill icon={<Timer className="h-4 w-4" aria-hidden="true" />} label={t('common.time')} value={formatMs(wonInfo.ms)} />
              <StatPill icon={<span className="text-xs" aria-hidden="true">🎚️</span>} label={t('common.difficulty')} value={t(`common.${diff}`)} />
              <StatPill icon={<Lightbulb className="h-4 w-4" aria-hidden="true" />} label={L.hintsUsed} value={hintsUsed} />
              {mistakes > 0 ? <StatPill icon={<span className="text-xs" aria-hidden="true">✕</span>} label={L.errorsLabel} value={mistakes} /> : null}
              <StatPill icon={<span className="text-xs" aria-hidden="true">⭐</span>} label={L.xpEarned} value={`+${wonInfo.xp}`} />
            </div>
            <div className="mt-1 w-full">
              <RoundEndActions
                gameId={gameId}
                onReplay={() => newGame(diff)}
                replayLabel={L.replay}
                replayIcon={<RotateCcw className="h-5 w-5" aria-hidden="true" />}
              />
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 h-9 w-full rounded-2xl text-xs font-semibold"
                onClick={() => {
                  sfx.play('click')
                  setPhase('menu')
                }}
              >
                <Play className="h-3.5 w-3.5" aria-hidden="true" /> {t('game.newGame')}
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Pavé numérique compact : 2 lignes de 5 (chiffres + gomme), cibles ≥ 44 px */}
      <div className={cn('mx-auto mt-2 grid w-full grid-cols-5 gap-1.5', BOARD_MAX)} role="group" aria-label={L.pad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <button
            key={d}
            type="button"
            disabled={!canAct}
            onClick={() => inputDigit(d)}
            className={cn(
              'flex h-11 touch-manipulation select-none flex-col items-center justify-center rounded-xl border-2 font-display text-lg font-extrabold leading-none transition-all active:scale-95 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:opacity-50',
              remaining[d - 1] === 0
                ? 'border-border/60 bg-card text-muted-foreground/40'
                : 'border-amber-200/70 bg-amber-50 hover:border-primary/50 dark:border-amber-500/25 dark:bg-amber-500/10',
            )}
          >
            <span>{d}</span>
            <span className="mt-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground" aria-hidden="true">
              {remaining[d - 1]}
            </span>
          </button>
        ))}
        <button
          type="button"
          disabled={!canAct}
          onClick={eraseCell}
          aria-label={L.erase}
          title={L.erase}
          className="flex h-11 touch-manipulation select-none items-center justify-center rounded-xl border-2 border-border/60 bg-card text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground active:scale-95 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
        >
          <Eraser className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Outils compacts : notes, indice, vérification, contrôle auto */}
      <div className={cn('mx-auto mt-1.5 flex w-full flex-wrap items-center justify-center gap-1.5', BOARD_MAX)}>
        <Button
          variant={notesMode ? 'default' : 'secondary'}
          className="h-10 touch-manipulation select-none rounded-full px-3 text-xs font-bold"
          onClick={toggleNotesMode}
          disabled={!canAct}
          aria-pressed={notesMode}
          aria-label={L.notes}
          title={L.notes}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          {L.notes}
        </Button>
        <Button
          variant="secondary"
          className="h-10 touch-manipulation select-none rounded-full px-3 text-xs font-bold"
          onClick={giveHint}
          disabled={!canAct || hintsUsed >= 3}
          aria-label={t('common.hint')}
          title={t('common.hint')}
        >
          <Lightbulb className="h-4 w-4 text-amber-500" aria-hidden="true" />
          <span className="tabular-nums">{3 - hintsUsed}</span>
        </Button>
        <Button
          variant="secondary"
          className="h-10 touch-manipulation select-none rounded-full px-3 text-xs font-bold"
          onClick={verify}
          disabled={!canAct}
        >
          <SearchCheck className="h-4 w-4" aria-hidden="true" />
          {L.verify}
        </Button>
        <Button
          variant={autoCheck ? 'default' : 'secondary'}
          className="h-10 w-10 touch-manipulation select-none rounded-full p-0"
          onClick={() => {
            sfx.play('click', { volume: 0.4 })
            setAutoCheck((v) => !v)
          }}
          aria-pressed={autoCheck}
          aria-label={L.autoCheck}
          title={L.autoCheck}
        >
          <BadgeCheck className={cn('h-4 w-4', autoCheck && 'text-primary-foreground')} aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <span className="flex h-9 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-xs font-semibold">
      <span className="text-muted-foreground" aria-hidden="true">{icon}</span>
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
