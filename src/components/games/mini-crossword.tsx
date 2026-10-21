'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  RotateCcw,
  CalendarCheck,
  Lightbulb,
  CheckCheck,
  Check,
  Eraser,
  Trophy,
  Timer,
  Eye,
  LayoutGrid,
  ArrowRight,
  ArrowDown,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang, type Lang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { loadSave, saveSave } from '@/lib/save'
import { mulberry32, seedFromString, todayKey, formatMs } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import {
  buildGrid,
  numberCells,
  FR_PUZZLES,
  EN_PUZZLES,
  type CrosswordPuzzle,
  type CrosswordWord,
} from '@/components/games/data/mini-crossword-data'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'

export const gameId = 'mini-crossword'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Complétez de petites grilles construites à la main : nature, culture, expressions et gourmandises.',
    en: 'Complete small hand-crafted grids: nature, culture and sweet treats.',
  },
  description: {
    fr: [
      "Culture Gran est un jeu de mots croisés express gratuit : de petites grilles de 5×5 construites à la main, à remplir en quelques minutes à partir de définitions simples. Chaque grille a été assemblée et vérifiée lettre par lettre — les croisements sont toujours cohérents.",
      "Le jeu propose des grilles en français et en anglais, chacune avec ses propres thèmes : fleurs du jardin, forêt, musée, épices et poèmes, lagon de corail ou camp au pré. Les définitions sont courtes et accessibles, avec un clavier à l'écran pour jouer confortablement sur téléphone.",
      "Trois indices par grille permettent de révéler une lettre difficile — ou un mot entier en échange de vos indices restants — tandis qu'un bouton de vérification signale les erreurs. Chronomètre et compteur de mots trouvés rythment chaque grille, et votre progression est sauvegardée automatiquement. Chaque matin, une grille du jour attend les joueurs réguliers et alimente votre série de défis quotidiens.",
    ],
    en: [
      "Culture Gran is a free mini crossword game: small 5×5 hand-crafted grids to fill in within minutes from simple clues. Every grid was assembled and verified letter by letter — crossings are always consistent.",
      "The game offers French and English grids, each with its own themes: garden flowers, forest, museum, spices and poems, coral lagoon or meadow camp. Clues are short and accessible, with an on-screen keyboard to play comfortably on your phone.",
      "Three hints per grid reveal a tricky letter — or a whole word in exchange for your remaining hints — while a check button flags mistakes. A timer and a words-found counter pace every grid, and your progress auto-saves. Every morning, a grid of the day awaits regular players and feeds your daily-challenge streak.",
    ],
  },
  rules: {
    fr: [
      'Choisissez une grille (ou lancez le défi du jour).',
      'Touchez une case pour la sélectionner ; touchez-la à nouveau pour changer de sens (horizontal/vertical).',
      "Saisissez les lettres avec le clavier à l'écran ou le clavier physique : la saisie avance automatiquement.",
      'La grille est résolue quand toutes les cases sont correctement remplies — la détection est automatique.',
      "En cas de blocage : trois indices par grille (une lettre), la révélation d'un mot entier et un bouton de vérification.",
    ],
    en: [
      'Pick a grid (or start the daily challenge).',
      'Tap a cell to select it; tap it again to switch direction (across/down).',
      'Type letters with the on-screen or physical keyboard: entry advances automatically.',
      'The grid is solved when every cell is correctly filled — detection is automatic.',
      'Stuck? Three letter hints per grid, a whole-word reveal and a check button.',
    ],
  },
  controls: {
    fr: [
      "Mobile et tablette : clavier à l'écran intégré (lettres, effacement, sens, indices, vérification).",
      "Ordinateur : saisie directe au clavier (accents acceptés), flèches pour naviguer, retour arrière pour effacer, barre d'espace pour changer de sens.",
      'Tab ou Entrée pour passer au mot suivant ; cliquez sur une définition pour sélectionner le mot correspondant.',
    ],
    en: [
      'Mobile & tablet: built-in on-screen keyboard (letters, erase, direction, hints, check).',
      'Desktop: type directly (accents accepted), arrow keys to navigate, Backspace to erase, Space to switch direction.',
      'Tab or Enter to jump to the next word; click a clue to select the matching word.',
    ],
  },
  features: {
    fr: [
      'Grilles 5×5 construites à la main et vérifiées',
      '8 grilles françaises et 6 anglaises aux thèmes variés',
      'Définitions courtes et accessibles bilingues',
      "Trois indices par grille, révélation de mot et vérification des erreurs",
      'Chronomètre, compteur de mots trouvés et meilleur temps enregistré',
      'Défi quotidien : une grille du jour pour tous les joueurs',
      'Sauvegarde automatique de la progression (lettres, temps, indices)',
    ],
    en: [
      'Hand-crafted and verified 5×5 grids',
      '8 French and 6 English grids on varied themes',
      'Short, accessible bilingual clues',
      'Three hints per grid, word reveal and error checking',
      'Timer, words-found counter and best-time tracking',
      'Daily challenge: one grid of the day for all players',
      'Automatic progress saving (letters, time, hints)',
    ],
  },
  tips: {
    fr: [
      'Commencez par le mot le plus long (la première définition horizontale) : il donne beaucoup de lettres croisées.',
      'Les mots français sont saisis sans accents : ÉCOLE se tape ECOLE, ÉPÉE se tape EPEE.',
      "Ne devinez jamais deux cases d'affilée : vérifiez chaque lettre avec les mots croisés.",
      'Gardez les indices pour la fin de grille, quand il ne reste que quelques cases.',
    ],
    en: [
      'Start with the longest word (the first across clue): it unlocks many crossing letters.',
      'Scan the clue list for the theme — it often hints at several answers at once.',
      'Never guess two cells in a row: check each letter against the crossing words.',
      'Save your hints for the end of the grid, when only a few cells remain.',
    ],
  },
  faq: {
    fr: [
      { q: 'Les grilles sont-elles générées aléatoirement ?', a: 'Non. Chaque grille est construite à la main selon un motif vérifié : les croisements sont contrôlés lettre par lettre, ce qui garantit des grilles toujours cohérentes et solubles.' },
      { q: 'Pourquoi certains mots s’écrivent sans accent ?', a: 'Pour simplifier la saisie au clavier, les réponses françaises sont stockées sans diacritiques : ÉCOLE se saisit ECOLE. Les définitions rappellent l’orthographe complète quand c’est utile, et le clavier physique accepte les lettres accentuées.' },
      { q: 'Comment fonctionnent les indices ?', a: 'Chaque grille vous donne trois indices : chacun révèle la lettre d’une case vide (la case sélectionnée en priorité, sinon la première case vide). Vous pouvez aussi révéler un mot entier, ce qui consomme tous vos indices restants.' },
      { q: 'Que contient le défi du jour ?', a: 'Chaque jour, une grille différente est désignée par tirage déterministe : tous les joueurs affrontent la même grille, et la réussir valide votre défi quotidien du parcours Granmed.' },
      { q: 'Les grilles françaises et anglaises sont-elles les mêmes ?', a: 'Non : chaque langue possède ses propres grilles, ses propres thèmes et ses propres définitions, véritablement adaptées culturellement.' },
      { q: 'Puis-je reprendre une grille commencée ?', a: 'Oui : vos lettres, la grille en cours, le temps écoulé et le nombre d’indices utilisés sont sauvegardés automatiquement sur votre appareil.' },
    ],
    en: [
      { q: 'Are the grids randomly generated?', a: 'No. Every grid is hand-crafted on a verified pattern: crossings are checked letter by letter, guaranteeing grids that are always consistent and solvable.' },
      { q: 'Are the French and English grids the same?', a: 'No: each language has its own grids, themes and clues, genuinely adapted culturally.' },
      { q: 'What is in the daily challenge?', a: 'Each day, a different grid is picked deterministically: every player faces the same grid, and solving it validates your Granmed daily challenge.' },
      { q: 'How do hints work?', a: 'You get three hints per grid: each reveals the letter of an empty cell (the selected cell first). You can also reveal a whole word, which uses up all your remaining hints.' },
      { q: 'Can I resume a grid I started?', a: 'Yes: your letters, current grid, elapsed time and hints used are automatically saved on your device.' },
    ],
  },
  records: {
    solved: { fr: 'Grilles résolues', en: 'Puzzles solved' },
    'best-time': { fr: 'Meilleur temps (s)', en: 'Best time (s)' },
  },
}

/* ================= Jeu ================= */
type Phase = 'picker' | 'playing' | 'solved'
type Dir = 'across' | 'down'

interface SaveData {
  letters: Record<string, string>
  puzzleId: string
  hintsUsed: number
  solvedIds: string[]
  elapsed: number
  isDaily: boolean
}

const HINTS_MAX = 3

/* Clavier à l'écran adapté à la langue (AZERTY / QWERTY). */
const KEY_ROWS: Record<Lang, string[]> = {
  fr: ['AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN'],
  en: ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBN'],
}

function puzzlesFor(lang: Lang): CrosswordPuzzle[] {
  return lang === 'fr' ? FR_PUZZLES : EN_PUZZLES
}

function wordKey(w: CrosswordWord): string {
  return `${w.dir}-${w.row}-${w.col}`
}

function cellKey(r: number, c: number): string {
  return `${r},${c}`
}

/** Mot entièrement rempli avec les bonnes lettres ? */
function isWordComplete(w: CrosswordWord, l: Record<string, string>): boolean {
  for (let i = 0; i < w.answer.length; i++) {
    const r = w.row + (w.dir === 'down' ? i : 0)
    const c = w.col + (w.dir === 'across' ? i : 0)
    if (l[cellKey(r, c)] !== w.answer[i]) return false
  }
  return true
}

/** A-Z après suppression des diacritiques (É→E, à→A…) ; null sinon. */
function normalizeLetter(k: string): string | null {
  // NFD puis retrait des marques diacritiques combinantes (U+0300-U+036F)
  const base = k
    .normalize('NFD')
    .split('')
    .filter((ch) => {
      const code = ch.charCodeAt(0)
      return code < 0x300 || code > 0x36f
    })
    .join('')
  return /^[a-zA-Z]$/.test(base) ? base.toUpperCase() : null
}

export default function MiniCrosswordGame() {
  const t = useT()
  const lang = useLang()
  const dailyDone = useIsDailyDone(gameId)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)

  const [phase, setPhase] = useState<Phase>('picker')
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null)
  const [isDaily, setIsDaily] = useState(false)
  const [letters, setLetters] = useState<Record<string, string>>({})
  const [active, setActive] = useState<{ r: number; c: number } | null>(null)
  const [dir, setDir] = useState<Dir>('across')
  const [hintsUsed, setHintsUsed] = useState(0)
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set())
  const [shakeNonce, setShakeNonce] = useState(0)
  const [solvedIds, setSolvedIds] = useState<string[]>([])
  const [confettiKey, setConfettiKey] = useState(0)
  const [newRecord, setNewRecord] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const boardRef = useRef<HTMLDivElement>(null)
  const startRef = useRef(0) // Date.now() de la dernière reprise du chrono
  const accRef = useRef(0) // temps accumulé avant la dernière reprise
  const phaseRef = useRef<Phase>('picker')

  const dailyPuzzle = useMemo(() => {
    const list = puzzlesFor(lang)
    const rand = mulberry32(seedFromString('mini-crossword:' + todayKey()))
    return list[Math.floor(rand() * list.length)]
  }, [lang])

  const grid = useMemo(() => (puzzle ? buildGrid(puzzle) : []), [puzzle])
  const nums = useMemo(() => (puzzle ? numberCells(puzzle) : new Map<string, number>()), [puzzle])

  const L = useMemo(
    () => ({
      fr: {
        choose: 'Choisir une grille',
        daily: 'Grille du jour',
        dailyShort: 'Défi',
        across: 'Horizontalement',
        down: 'Verticalement',
        acrossShort: 'Horizontal',
        downShort: 'Vertical',
        check: 'Vérifier',
        hint: 'Indice',
        reveal: 'Révéler le mot',
        revealHint: 'Révèle le mot entier (consomme vos indices restants)',
        erase: 'Effacer',
        grids: 'Autres grilles',
        nextWord: 'Définition suivante',
        solvedTag: 'Résolue',
        nextGrid: 'Grille suivante',
        solvedMsg: 'Grille résolue !',
        restored: 'Reprise de votre grille sauvegardée',
        dailyDone: 'Défi du jour déjà réussi !',
        fillAll: 'Remplissez toutes les cases pour vérifier.',
        boardAria: 'Grille de mots croisés',
        clueListAria: 'Définitions',
        keyboardAria: 'Clavier',
        wordsShort: 'mots',
        wordsTitle: 'Mots trouvés',
        hintsUsed: 'Indices utilisés',
        cell: 'Case',
      },
      en: {
        choose: 'Choose a grid',
        daily: 'Grid of the day',
        dailyShort: 'Daily',
        across: 'Across',
        down: 'Down',
        acrossShort: 'Across',
        downShort: 'Down',
        check: 'Check',
        hint: 'Hint',
        reveal: 'Reveal word',
        revealHint: 'Reveals the whole word (uses your remaining hints)',
        erase: 'Erase',
        grids: 'Other grids',
        nextWord: 'Next clue',
        solvedTag: 'Solved',
        nextGrid: 'Next grid',
        solvedMsg: 'Grid solved!',
        restored: 'Resumed your saved grid',
        dailyDone: 'Daily challenge already complete!',
        fillAll: 'Fill every cell to check.',
        boardAria: 'Crossword grid',
        clueListAria: 'Clues',
        keyboardAria: 'Keyboard',
        wordsShort: 'words',
        wordsTitle: 'Words found',
        hintsUsed: 'Hints used',
        cell: 'Cell',
      },
    })[lang],
    [lang],
  )

  /* ---- Restauration de la sauvegarde (callback asynchrone post-mount,
     jamais de setState synchrone dans le corps d'un effet) ---- */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      if (!alive) return
      const save = loadSave<SaveData>(gameId)
      if (!save) return
      setSolvedIds(Array.isArray(save.solvedIds) ? save.solvedIds : [])
      if (save.puzzleId && save.letters && Object.keys(save.letters).length > 0) {
        const p = [...FR_PUZZLES, ...EN_PUZZLES].find((x) => x.id === save.puzzleId)
        if (p) {
          setPuzzle(p)
          setLetters(save.letters)
          setHintsUsed(Math.max(0, Math.min(save.hintsUsed ?? 0, HINTS_MAX)))
          setIsDaily(Boolean(save.isDaily))
          const ms = Math.max(0, save.elapsed ?? 0)
          accRef.current = ms
          startRef.current = Date.now()
          setElapsed(ms)
          setActive(p.words[0] ? { r: p.words[0].row, c: p.words[0].col } : null)
          setDir(p.words[0]?.dir ?? 'across')
          setPhase('playing')
          toast(L.restored)
          requestAnimationFrame(() => boardRef.current?.focus({ preventScroll: true }))
        }
      }
    })
    return () => {
      alive = false
    }
    // Restauration unique au montage : L est figé volontairement.
  }, [])

  /* ---- Chrono : tick 500 ms pendant la partie uniquement ---- */
  useEffect(() => {
    phaseRef.current = phase
    if (phase !== 'playing') return
    const id = window.setInterval(() => setElapsed(accRef.current + (Date.now() - startRef.current)), 500)
    return () => window.clearInterval(id)
  }, [phase])

  /* ---- Pause du chrono quand l'onglet est masqué ---- */
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        if (phaseRef.current === 'playing') accRef.current += Date.now() - startRef.current
      } else {
        startRef.current = Date.now()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const elapsedNow = useCallback(() => accRef.current + (Date.now() - startRef.current), [])

  const persist = useCallback(
    (l: Record<string, string>, p: CrosswordPuzzle, h: number, solved: string[], ms: number, daily: boolean) => {
      saveSave<SaveData>(gameId, { letters: l, puzzleId: p.id, hintsUsed: h, solvedIds: solved, elapsed: ms, isDaily: daily })
    },
    [],
  )

  /* Le focus clavier reste sur le conteneur de grille : aucune case n'est
     un input, donc aucun scroll automatique agressif au saisie. */
  const focusBoard = useCallback(() => boardRef.current?.focus({ preventScroll: true }), [])

  const startPuzzle = useCallback(
    (p: CrosswordPuzzle, daily: boolean) => {
      sfx.play('pop')
      setPuzzle(p)
      setIsDaily(daily)
      setLetters({})
      setHintsUsed(0)
      setWrongCells(new Set())
      setNewRecord(false)
      setActive(p.words[0] ? { r: p.words[0].row, c: p.words[0].col } : null)
      setDir(p.words[0]?.dir ?? 'across')
      setPhase('playing')
      accRef.current = 0
      startRef.current = Date.now()
      setElapsed(0)
      addPlay(gameId)
      persist({}, p, 0, solvedIds, 0, daily)
      requestAnimationFrame(() => boardRef.current?.focus({ preventScroll: true }))
    },
    [addPlay, persist, solvedIds],
  )

  /* ---- Mots ---- */
  const wordAtCell = useCallback(
    (r: number, c: number, d: Dir): CrosswordWord | undefined =>
      puzzle?.words.find(
        (w) =>
          w.dir === d &&
          (d === 'down'
            ? c === w.col && r >= w.row && r < w.row + w.answer.length
            : r === w.row && c >= w.col && c < w.col + w.answer.length),
      ),
    [puzzle],
  )

  /* Mots triés en ordre de lecture (par numéro). */
  const wordsInOrder = useMemo(() => {
    if (!puzzle) return [] as CrosswordWord[]
    return [...puzzle.words].sort(
      (a, b) => (nums.get(cellKey(a.row, a.col)) ?? 0) - (nums.get(cellKey(b.row, b.col)) ?? 0),
    )
  }, [puzzle, nums])

  /* Mots entièrement corrects (dérivés au rendu — aucun effet). */
  const completedWords = useMemo(() => {
    const s = new Set<string>()
    if (puzzle) for (const w of puzzle.words) if (isWordComplete(w, letters)) s.add(wordKey(w))
    return s
  }, [puzzle, letters])

  /* Cases appartenant à un mot complété (passent au vert). */
  const completedCells = useMemo(() => {
    const s = new Set<string>()
    for (const w of puzzle?.words ?? []) {
      if (!completedWords.has(wordKey(w))) continue
      for (let i = 0; i < w.answer.length; i++) {
        s.add(cellKey(w.row + (w.dir === 'down' ? i : 0), w.col + (w.dir === 'across' ? i : 0)))
      }
    }
    return s
  }, [puzzle, completedWords])

  const activeWord = active ? wordAtCell(active.r, active.c, dir) : undefined

  const activeCells = useMemo(() => {
    const s = new Set<string>()
    if (activeWord) {
      for (let i = 0; i < activeWord.answer.length; i++) {
        s.add(cellKey(activeWord.row + (activeWord.dir === 'down' ? i : 0), activeWord.col + (activeWord.dir === 'across' ? i : 0)))
      }
    }
    return s
  }, [activeWord])

  const finishSolve = useCallback(
    (l: Record<string, string>) => {
      if (!puzzle) return
      const finalMs = elapsedNow()
      setElapsed(finalMs)
      setPhase('solved')
      setActive(null)
      setConfettiKey((k) => k + 1)
      sfx.play('win')
      navigator.vibrate?.([30, 40, 30])
      const wasSolved = solvedIds.includes(puzzle.id)
      const newSolved = wasSolved ? solvedIds : [...solvedIds, puzzle.id]
      setSolvedIds(newSolved)
      const seconds = Math.max(1, Math.round(finalMs / 1000))
      setNewRecord(setBest(gameId, 'best-time', seconds, true))
      addWin(gameId)
      addXp(wasSolved ? 10 : 30)
      if (!wasSolved) {
        setBest(gameId, 'solved', newSolved.length, false)
        unlockBadge('crossword-first')
        if (newSolved.length >= 3) unlockBadge('crossword-3')
      }
      if (isDaily) completeDaily(gameId)
      persist({}, puzzle, hintsUsed, newSolved, finalMs, isDaily)
    },
    [puzzle, solvedIds, elapsedNow, setBest, addWin, addXp, unlockBadge, completeDaily, isDaily, hintsUsed, persist],
  )

  /* Sélectionne un mot : première case vide, sinon sa case de départ. */
  const gotoWord = useCallback(
    (w: CrosswordWord, l?: Record<string, string>) => {
      const src = l ?? letters
      setDir(w.dir)
      let target = { r: w.row, c: w.col }
      for (let i = 0; i < w.answer.length; i++) {
        const r = w.row + (w.dir === 'down' ? i : 0)
        const c = w.col + (w.dir === 'across' ? i : 0)
        if (!src[cellKey(r, c)]) {
          target = { r, c }
          break
        }
      }
      setActive(target)
      focusBoard()
    },
    [letters, focusBoard],
  )

  const cycleWord = useCallback(
    (step: 1 | -1) => {
      if (wordsInOrder.length === 0) return
      const cur = active ? wordAtCell(active.r, active.c, dir) : undefined
      const idx = cur ? wordsInOrder.indexOf(cur) : -1
      const next = wordsInOrder[(idx + step + wordsInOrder.length) % wordsInOrder.length]
      if (!next) return
      sfx.play('click', { volume: 0.3 })
      gotoWord(next)
    },
    [wordsInOrder, active, dir, wordAtCell, gotoWord],
  )

  /* Célébration d'un mot qui vient d'être complété correctement. */
  const notifyWordCompletion = useCallback(
    (r: number, c: number, before: Record<string, string>, after: Record<string, string>) => {
      for (const d of ['across', 'down'] as const) {
        const w = wordAtCell(r, c, d)
        if (w && !isWordComplete(w, before) && isWordComplete(w, after)) {
          sfx.play('correct')
          navigator.vibrate?.(10)
          return
        }
      }
    },
    [wordAtCell],
  )

  const typeLetter = useCallback(
    (ch: string) => {
      if (!puzzle || !active || phase !== 'playing') return
      if (grid[active.r][active.c] === null) return
      const key = cellKey(active.r, active.c)
      sfx.play('click', { volume: 0.4 })
      const wasEmpty = !letters[key]
      const next = { ...letters, [key]: ch }
      setLetters(next)
      setWrongCells((prev) => {
        if (!prev.has(key)) return prev
        const s = new Set(prev)
        s.delete(key)
        return s
      })
      /* Avance automatique : saute les cases déjà remplies, et enchaîne sur
         le premier mot incomplet quand le mot courant est terminé. */
      const w = wordAtCell(active.r, active.c, dir)
      if (w) {
        const idx = dir === 'across' ? active.c - w.col : active.r - w.row
        if (idx < w.answer.length - 1) {
          let np: { r: number; c: number } | null = null
          if (wasEmpty) {
            for (let i = idx + 1; i < w.answer.length; i++) {
              const r = w.row + (w.dir === 'down' ? i : 0)
              const c = w.col + (w.dir === 'across' ? i : 0)
              if (!next[cellKey(r, c)]) {
                np = { r, c }
                break
              }
            }
          }
          if (!np) np = dir === 'across' ? { r: active.r, c: active.c + 1 } : { r: active.r + 1, c: active.c }
          setActive(np)
        } else {
          const target = wordsInOrder.find((x) => x !== w && !isWordComplete(x, next))
          if (target) gotoWord(target, next)
        }
      }
      /* Détection de résolution dans le handler (jamais dans un effet). */
      const allFilled = grid.every((row, r) => row.every((cell, c) => cell === null || Boolean(next[cellKey(r, c)])))
      if (allFilled) {
        const allCorrect = grid.every((row, r) => row.every((cell, c) => cell === null || next[cellKey(r, c)] === cell))
        if (allCorrect) {
          finishSolve(next)
          return
        }
        sfx.play('wrong', { volume: 0.3 })
      } else {
        notifyWordCompletion(active.r, active.c, letters, next)
      }
      persist(next, puzzle, hintsUsed, solvedIds, elapsedNow(), isDaily)
    },
    [
      puzzle, active, phase, grid, letters, dir, wordAtCell, wordsInOrder, gotoWord,
      finishSolve, notifyWordCompletion, persist, hintsUsed, solvedIds, elapsedNow, isDaily,
    ],
  )

  const eraseLetter = useCallback(() => {
    if (!puzzle || !active || phase !== 'playing') return
    const key = cellKey(active.r, active.c)
    const next = { ...letters }
    if (next[key]) {
      delete next[key]
      setLetters(next)
      setWrongCells((prev) => {
        if (!prev.has(key)) return prev
        const s = new Set(prev)
        s.delete(key)
        return s
      })
      sfx.play('click', { volume: 0.3 })
      persist(next, puzzle, hintsUsed, solvedIds, elapsedNow(), isDaily)
    } else {
      /* Case vide : recule d'une case dans le mot et efface. */
      const w = wordAtCell(active.r, active.c, dir)
      if (!w) return
      const idx = dir === 'across' ? active.c - w.col : active.r - w.row
      if (idx <= 0) return
      const prevPos = dir === 'across' ? { r: active.r, c: active.c - 1 } : { r: active.r - 1, c: active.c }
      const pk = cellKey(prevPos.r, prevPos.c)
      const n2 = { ...next }
      delete n2[pk]
      setActive(prevPos)
      setLetters(n2)
      setWrongCells((prev) => {
        if (!prev.has(pk)) return prev
        const s = new Set(prev)
        s.delete(pk)
        return s
      })
      sfx.play('click', { volume: 0.3 })
      persist(n2, puzzle, hintsUsed, solvedIds, elapsedNow(), isDaily)
    }
  }, [puzzle, active, phase, letters, dir, wordAtCell, persist, hintsUsed, solvedIds, elapsedNow, isDaily])

  const clearActive = useCallback(() => {
    if (!puzzle || !active || phase !== 'playing') return
    const key = cellKey(active.r, active.c)
    if (!letters[key]) return
    const next = { ...letters }
    delete next[key]
    setLetters(next)
    setWrongCells((prev) => {
      if (!prev.has(key)) return prev
      const s = new Set(prev)
      s.delete(key)
      return s
    })
    sfx.play('click', { volume: 0.3 })
    persist(next, puzzle, hintsUsed, solvedIds, elapsedNow(), isDaily)
  }, [puzzle, active, phase, letters, persist, hintsUsed, solvedIds, elapsedNow, isDaily])

  const moveActive = useCallback(
    (dr: number, dc: number) => {
      if (!puzzle || !active) return
      let r = active.r + dr
      let c = active.c + dc
      while (r >= 0 && r < puzzle.size && c >= 0 && c < puzzle.size) {
        if (grid[r][c] !== null) {
          setActive({ r, c })
          /* Les flèches basculent le sens quand l'orientation du mot change. */
          if (dr !== 0 && dir === 'across' && wordAtCell(r, c, 'down')) setDir('down')
          else if (dc !== 0 && dir === 'down' && wordAtCell(r, c, 'across')) setDir('across')
          return
        }
        r += dr
        c += dc
      }
    },
    [puzzle, active, grid, dir, wordAtCell],
  )

  const toggleDir = useCallback(() => {
    if (!active) return
    const other: Dir = dir === 'across' ? 'down' : 'across'
    if (wordAtCell(active.r, active.c, other)) {
      setDir(other)
      sfx.play('swish', { volume: 0.4 })
    }
  }, [active, dir, wordAtCell])

  const selectCell = useCallback(
    (r: number, c: number) => {
      if (!puzzle || phase !== 'playing' || grid[r][c] === null) return
      if (active && active.r === r && active.c === c) {
        toggleDir()
      } else {
        sfx.play('click', { volume: 0.3 })
        setActive({ r, c })
        if (!wordAtCell(r, c, dir)) setDir(wordAtCell(r, c, 'across') ? 'across' : 'down')
      }
      focusBoard()
    },
    [puzzle, phase, grid, active, dir, wordAtCell, toggleDir, focusBoard],
  )

  const checkGrid = useCallback(() => {
    if (!puzzle || phase !== 'playing') return
    sfx.play('click')
    const wrong = new Set<string>()
    let filled = 0
    let total = 0
    grid.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell === null) return
        total++
        const l = letters[cellKey(r, c)]
        if (l) filled++
        if (l && l !== cell) wrong.add(cellKey(r, c))
      }),
    )
    setWrongCells(wrong)
    setShakeNonce((n) => n + 1)
    if (wrong.size === 0 && filled === total) {
      finishSolve(letters)
    } else if (wrong.size > 0) {
      sfx.play('wrong', { volume: 0.4 })
    } else {
      toast(L.fillAll)
    }
  }, [puzzle, phase, grid, letters, finishSolve, L])

  const giveHint = useCallback(() => {
    if (!puzzle || phase !== 'playing' || hintsUsed >= HINTS_MAX) return
    /* Cible : case active vide > première case vide > première case incorrecte. */
    let target: { r: number; c: number } | null = null
    if (active && !letters[cellKey(active.r, active.c)] && grid[active.r][active.c] !== null) {
      target = active
    }
    if (!target) {
      outer: for (let r = 0; r < puzzle.size; r++) {
        for (let c = 0; c < puzzle.size; c++) {
          if (grid[r][c] !== null && !letters[cellKey(r, c)]) {
            target = { r, c }
            break outer
          }
        }
      }
    }
    if (!target) {
      outer2: for (let r = 0; r < puzzle.size; r++) {
        for (let c = 0; c < puzzle.size; c++) {
          const cell = grid[r][c]
          const l = letters[cellKey(r, c)]
          if (cell !== null && l && l !== cell) {
            target = { r, c }
            break outer2
          }
        }
      }
    }
    if (!target) return
    sfx.play('reveal')
    const key = cellKey(target.r, target.c)
    const next = { ...letters, [key]: grid[target.r][target.c]! }
    const h = hintsUsed + 1
    setLetters(next)
    setHintsUsed(h)
    setWrongCells((prev) => {
      if (!prev.has(key)) return prev
      const s = new Set(prev)
      s.delete(key)
      return s
    })
    notifyWordCompletion(target.r, target.c, letters, next)
    const allFilled = grid.every((row, r) => row.every((cell, c) => cell === null || Boolean(next[cellKey(r, c)])))
    const allCorrect = grid.every((row, r) => row.every((cell, c) => cell === null || next[cellKey(r, c)] === cell))
    if (allFilled && allCorrect) {
      finishSolve(next)
      return
    }
    persist(next, puzzle, h, solvedIds, elapsedNow(), isDaily)
  }, [puzzle, phase, hintsUsed, active, letters, grid, notifyWordCompletion, finishSolve, persist, solvedIds, elapsedNow, isDaily])

  const revealWord = useCallback(() => {
    if (!puzzle || phase !== 'playing' || hintsUsed >= HINTS_MAX) return
    const w = active ? wordAtCell(active.r, active.c, dir) : undefined
    if (!w) return
    sfx.play('reveal')
    const next = { ...letters }
    for (let i = 0; i < w.answer.length; i++) {
      const r = w.row + (w.dir === 'down' ? i : 0)
      const c = w.col + (w.dir === 'across' ? i : 0)
      next[cellKey(r, c)] = w.answer[i]
    }
    setLetters(next)
    setHintsUsed(HINTS_MAX)
    setWrongCells((prev) => {
      if (prev.size === 0) return prev
      const s = new Set<string>()
      for (const k of prev) {
        const [r, c] = k.split(',').map(Number)
        if (next[k] !== grid[r][c]) s.add(k)
      }
      return s
    })
    const allFilled = grid.every((row, r) => row.every((cell, c) => cell === null || Boolean(next[cellKey(r, c)])))
    const allCorrect = grid.every((row, r) => row.every((cell, c) => cell === null || next[cellKey(r, c)] === cell))
    if (allFilled && allCorrect) {
      finishSolve(next)
      return
    }
    const target = wordsInOrder.find((x) => x !== w && !isWordComplete(x, next))
    if (target) gotoWord(target, next)
    persist(next, puzzle, HINTS_MAX, solvedIds, elapsedNow(), isDaily)
  }, [puzzle, phase, hintsUsed, active, dir, letters, grid, wordAtCell, wordsInOrder, gotoWord, finishSolve, persist, solvedIds, elapsedNow, isDaily])

  const backToPicker = useCallback(() => {
    sfx.play('click')
    setActive(null)
    setPhase('picker')
  }, [])

  const startNextPuzzle = useCallback(() => {
    if (!puzzle) return
    const list = puzzlesFor(lang)
    const idx = list.findIndex((p) => p.id === puzzle.id)
    const ordered = idx >= 0 ? [...list.slice(idx + 1), ...list.slice(0, idx)] : list
    const target = ordered.find((p) => !solvedIds.includes(p.id)) ?? ordered[0] ?? list[0]
    if (target) startPuzzle(target, false)
  }, [puzzle, lang, solvedIds, startPuzzle])

  /* ---- Clavier physique (le plateau focusable garde le focus dans le jeu) ---- */
  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (phase !== 'playing') return
      const k = e.key
      const letter = normalizeLetter(k)
      if (letter) {
        e.preventDefault()
        typeLetter(letter)
      } else if (k === 'Backspace') {
        e.preventDefault()
        eraseLetter()
      } else if (k === 'Delete') {
        e.preventDefault()
        clearActive()
      } else if (k === 'ArrowLeft') {
        e.preventDefault()
        moveActive(0, -1)
      } else if (k === 'ArrowRight') {
        e.preventDefault()
        moveActive(0, 1)
      } else if (k === 'ArrowUp') {
        e.preventDefault()
        moveActive(-1, 0)
      } else if (k === 'ArrowDown') {
        e.preventDefault()
        moveActive(1, 0)
      } else if (k === ' ') {
        e.preventDefault()
        toggleDir()
      } else if (k === 'Tab' || k === 'Enter') {
        e.preventDefault() /* garde le focus dans la zone de jeu */
        cycleWord(e.shiftKey ? -1 : 1)
      }
    },
    [phase, typeLetter, eraseLetter, clearActive, moveActive, toggleDir, cycleWord],
  )

  const clueBarWord = phase === 'playing' ? (activeWord ?? wordsInOrder[0]) : undefined

  /* ================= Rendu ================= */
  if (phase === 'picker' || !puzzle) {
    const list = puzzlesFor(lang)
    const solvedCount = list.filter((p) => solvedIds.includes(p.id)).length
    return (
      <div className="relative select-none">
        {!dailyDone ? (
          <button
            type="button"
            onClick={() => startPuzzle(dailyPuzzle, true)}
            className="mb-3 flex w-full items-center gap-2.5 rounded-2xl border border-amber-300/60 bg-amber-50 px-3 py-2.5 text-left transition-transform hover:scale-[1.01] active:scale-[0.99] dark:border-amber-500/25 dark:bg-amber-500/10"
          >
            <span className="text-xl" aria-hidden="true">🎁</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-amber-700 dark:text-amber-300">
                {L.daily} — {todayKey()}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {dailyPuzzle.icon} {dailyPuzzle.theme[lang]}
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white">{t('game.startDaily')}</span>
          </button>
        ) : (
          <div className="mb-3 flex items-center gap-2 rounded-2xl border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden="true" /> {L.dailyDone}
          </div>
        )}

        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3 className="font-display text-base font-bold sm:text-lg">{L.choose}</h3>
          <span className="text-xs tabular-nums text-muted-foreground" title={L.solvedTag}>
            {solvedCount}/{list.length} ✓
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => startPuzzle(p, false)}
              className="group flex items-center gap-2 rounded-xl border bg-card p-2.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]"
            >
              <span className="text-2xl transition-transform group-hover:scale-110" aria-hidden="true">{p.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{p.theme[lang]}</span>
                <span className="block text-[11px] text-muted-foreground">5×5 · {p.words.length} {lang === 'fr' ? 'mots' : 'words'}</span>
              </span>
              {solvedIds.includes(p.id) ? (
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  title={L.solvedTag}
                >
                  ✓
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative select-none">
      <Confetti fire={confettiKey} count={110} />

      {/* HUD compact : thème, défi, chrono, mots trouvés */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5 text-xs font-semibold">
        <span className="flex min-w-0 items-center gap-1.5 rounded-full bg-secondary/70 px-2.5 py-1">
          <span className="text-base leading-none" aria-hidden="true">{puzzle.icon}</span>
          <span className="max-w-[8.5rem] truncate">{puzzle.theme[lang]}</span>
        </span>
        {isDaily ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" /> {L.dailyShort}
          </span>
        ) : null}
        <span className="ms-auto flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1 tabular-nums" title={t('common.time')}>
          <Timer className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          {formatMs(elapsed)}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1 tabular-nums" title={L.wordsTitle}>
          {completedWords.size}/{puzzle.words.length} {L.wordsShort}
        </span>
      </div>

      {/* Indice courant : une ligne compacte, un clic passe au mot suivant */}
      {clueBarWord ? (
        <button
          type="button"
          onClick={() => cycleWord(1)}
          title={L.nextWord}
          aria-label={`${L.nextWord} — ${clueBarWord.clue[lang]}`}
          className="mb-2 flex min-h-10 w-full items-center gap-2 rounded-xl border bg-card px-3 py-1.5 text-left shadow-sm transition-colors hover:bg-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.99]"
        >
          <span className="flex shrink-0 items-center gap-1 text-sm font-extrabold tabular-nums text-primary">
            {nums.get(cellKey(clueBarWord.row, clueBarWord.col)) ?? 0}
            {clueBarWord.dir === 'across' ? (
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm">{clueBarWord.clue[lang]}</span>
          <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{clueBarWord.answer.length}</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>
      ) : null}

      <div className="sm:grid sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-5">
        {/* Colonne gauche : grille + clavier */}
        <div className="min-w-0">
          <div
            ref={boardRef}
            role="grid"
            aria-label={L.boardAria}
            tabIndex={0}
            onKeyDown={onKey}
            className="mx-auto flex w-full min-w-[240px] max-w-[calc(100dvh_-_380px)] flex-col gap-1 rounded-2xl bg-secondary/50 p-1.5 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-[min(420px,58vh)] sm:max-w-none"
          >
            {grid.map((row, r) => (
              <div key={r} role="row" className="grid grid-cols-5 gap-1">
                {row.map((cell, c) => {
                  if (cell === null) {
                    return (
                      <div key={c} role="gridcell" aria-hidden="true" className="aspect-square w-full rounded-[5px] bg-foreground/[0.07]" />
                    )
                  }
                  const key = cellKey(r, c)
                  const isActive = active?.r === r && active?.c === c
                  const isWrong = wrongCells.has(key)
                  const isDone = completedCells.has(key)
                  const inWord = !isActive && activeCells.has(key)
                  const val = letters[key] ?? ''
                  const num = nums.get(key)
                  return (
                    <button
                      key={isWrong ? `${key}-w${shakeNonce}` : key}
                      type="button"
                      role="gridcell"
                      aria-label={`${L.cell} ${r + 1}·${c + 1}${val ? ` : ${val}` : ''}`}
                      onClick={() => selectCell(r, c)}
                      className={cn(
                        'relative flex aspect-square w-full touch-manipulation select-none items-center justify-center rounded-[6px] border-2 text-lg font-extrabold uppercase transition-colors duration-200 focus-visible:outline-none sm:text-2xl',
                        isWrong
                          ? 'anim-shake border-rose-400 bg-rose-50 text-rose-600 dark:border-rose-500/60 dark:bg-rose-500/15 dark:text-rose-300'
                          : isActive
                            ? 'z-10 border-primary bg-primary/15 text-foreground ring-2 ring-primary/30'
                            : isDone
                              ? 'border-emerald-400/60 bg-emerald-50/80 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300'
                              : inWord
                                ? 'border-primary/35 bg-primary/5 text-foreground hover:border-primary/60'
                                : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/40',
                      )}
                    >
                      {num ? (
                        <span className="absolute left-1 top-0 text-[10px] font-bold leading-tight text-muted-foreground/90">{num}</span>
                      ) : null}
                      {val}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Clavier à l'écran + actions compactes */}
          {phase === 'playing' ? (
            <div className="mx-auto mt-2 w-full" role="group" aria-label={L.keyboardAria}>
              {KEY_ROWS[lang].map((row, ri) => (
                <div key={ri} className={cn('flex justify-center gap-1', ri > 0 && 'mt-1')}>
                  {row.split('').map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        typeLetter(k)
                        focusBoard()
                      }}
                      className="h-10 min-w-0 flex-1 touch-manipulation select-none rounded-lg border bg-card text-sm font-bold shadow-sm transition-all hover:bg-accent active:scale-95 sm:h-11 sm:text-base"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              ))}
              <div className="mt-1 flex justify-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    eraseLetter()
                    focusBoard()
                  }}
                  title={L.erase}
                  className="flex h-10 flex-[1.3] touch-manipulation select-none items-center justify-center gap-1.5 rounded-lg border bg-secondary/70 text-xs font-bold shadow-sm transition-all hover:bg-accent active:scale-95 sm:h-11 sm:text-sm"
                >
                  <Eraser className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{L.erase}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleDir()
                    focusBoard()
                  }}
                  title={dir === 'across' ? L.across : L.down}
                  className="flex h-10 flex-[1.3] touch-manipulation select-none items-center justify-center gap-1.5 rounded-lg border bg-secondary/70 text-xs font-bold shadow-sm transition-all hover:bg-accent active:scale-95 sm:h-11 sm:text-sm"
                >
                  {dir === 'across' ? (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">{dir === 'across' ? L.acrossShort : L.downShort}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    giveHint()
                    focusBoard()
                  }}
                  disabled={hintsUsed >= HINTS_MAX}
                  title={`${L.hint} · ${Math.max(0, HINTS_MAX - hintsUsed)}/${HINTS_MAX}`}
                  aria-label={`${L.hint} · ${Math.max(0, HINTS_MAX - hintsUsed)}/${HINTS_MAX}`}
                  className="flex h-10 flex-1 touch-manipulation select-none items-center justify-center gap-1 rounded-lg border bg-card text-sm font-bold shadow-sm transition-all hover:bg-accent active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11"
                >
                  <Lightbulb className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  {Math.max(0, HINTS_MAX - hintsUsed)}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    revealWord()
                    focusBoard()
                  }}
                  disabled={hintsUsed >= HINTS_MAX || !activeWord}
                  title={L.revealHint}
                  aria-label={L.reveal}
                  className="flex h-10 w-10 touch-manipulation select-none items-center justify-center rounded-lg border bg-card shadow-sm transition-all hover:bg-accent active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-12"
                >
                  <Eye className="h-4 w-4 text-primary" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    checkGrid()
                    focusBoard()
                  }}
                  title={L.check}
                  aria-label={L.check}
                  className="flex h-10 w-10 touch-manipulation select-none items-center justify-center rounded-lg border bg-card shadow-sm transition-all hover:bg-accent active:scale-95 sm:h-11 sm:w-12"
                >
                  <CheckCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={backToPicker}
                  title={L.grids}
                  aria-label={L.grids}
                  className="flex h-10 w-10 touch-manipulation select-none items-center justify-center rounded-lg border bg-card shadow-sm transition-all hover:bg-accent active:scale-95 sm:h-11 sm:w-12"
                >
                  <LayoutGrid className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Panneau scrollable des définitions (ne pousse jamais la grille hors écran) */}
        <div className="mt-3 min-w-0 sm:mt-0">
          <div
            role="group"
            aria-label={L.clueListAria}
            className="nice-scroll max-h-44 overflow-y-auto rounded-2xl border bg-card p-2.5 sm:max-h-[68vh]"
          >
            {(['across', 'down'] as const).map((d) => {
              const words = puzzle.words.filter((w) => w.dir === d)
              if (words.length === 0) return null
              return (
                <div key={d} className={d === 'down' ? 'mt-2' : undefined}>
                  <h3 className="mb-1 px-1 font-display text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {d === 'across' ? L.across : L.down}
                  </h3>
                  <ul>
                    {words.map((w) => {
                      const isActiveWord = activeWord === w
                      const done = completedWords.has(wordKey(w))
                      const num = nums.get(cellKey(w.row, w.col)) ?? 0
                      return (
                        <li key={wordKey(w)}>
                          <button
                            type="button"
                            onClick={() => {
                              sfx.play('click', { volume: 0.3 })
                              gotoWord(w)
                            }}
                            className={cn(
                              'flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] leading-snug transition-colors',
                              isActiveWord ? 'bg-primary/10 font-semibold text-primary' : 'hover:bg-accent',
                              done && !isActiveWord && 'text-emerald-700 dark:text-emerald-300',
                            )}
                          >
                            <span className="font-bold tabular-nums">{num}.</span>
                            <span className="min-w-0 flex-1">{w.clue[lang]}</span>
                            {done ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden="true" /> : null}
                            <span className="shrink-0 text-[11px] font-normal tabular-nums text-muted-foreground">{w.answer.length}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Victoire */}
      {phase === 'solved' ? (
        <div
          className="anim-rise mt-3 rounded-2xl border-2 border-emerald-300/60 bg-emerald-50/60 p-4 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10 sm:p-5"
          role="status"
        >
          <Trophy className="mx-auto h-8 w-8 text-amber-500" aria-hidden="true" />
          <p className="mt-1.5 font-display text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{L.solvedMsg}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {puzzle.icon} {puzzle.theme[lang]} · <Timer className="inline h-3.5 w-3.5" aria-hidden="true" /> {formatMs(elapsed)} · {L.hintsUsed} : {hintsUsed}/{HINTS_MAX}
          </p>
          {newRecord ? (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              ⭐ {t('common.newRecord')}
            </span>
          ) : null}
          <div className="mt-3 flex flex-wrap justify-center gap-2.5">
            <Button size="lg" className="rounded-full" onClick={() => startPuzzle(puzzle, isDaily)}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> {t('common.playAgain')}
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full" onClick={startNextPuzzle}>
              {L.nextGrid} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
