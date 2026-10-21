'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Play, RotateCcw, CalendarCheck, Lightbulb, CheckCheck, Eraser, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useAppStore } from '@/lib/app-store'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { loadSave, saveSave } from '@/lib/save'
import { mulberry32, seedFromString, todayKey } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { buildGrid, numberCells, FR_PUZZLES, EN_PUZZLES, type CrosswordPuzzle, type CrosswordWord } from '@/components/games/data/mini-crossword-data'
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
      "Trois indices par grille permettent de révéler une lettre difficile, un bouton de vérification signale les erreurs, et votre progression est sauvegardée automatiquement. Chaque matin, une grille du jour attend les joueurs réguliers et alimente votre série de défis quotidiens.",
    ],
    en: [
      "Culture Gran is a free mini crossword game: small 5×5 hand-crafted grids to fill in within minutes from simple clues. Every grid was assembled and verified letter by letter — crossings are always consistent.",
      "The game offers French and English grids, each with its own themes: garden flowers, forest, museum, spices and poems, coral lagoon or meadow camp. Clues are short and accessible, with an on-screen keyboard to play comfortably on your phone.",
      "Three hints per grid let you reveal a tricky letter, a check button flags mistakes, and your progress auto-saves. Every morning, a grid of the day awaits regular players and feeds your daily-challenge streak.",
    ],
  },
  rules: {
    fr: [
      'Choisissez une grille (ou lancez le défi du jour).',
      'Touchez une case pour la sélectionner ; touchez-la à nouveau pour changer de sens (horizontal/vertical).',
      'Saisissez les lettres avec le clavier à l’éécran ou le clavier physique.',
      'La grille est résolue quand toutes les cases sont correctement remplies.',
      'En cas de blocage : trois indices par grille et un bouton de vérification.',
    ],
    en: [
      'Pick a grid (or start the daily challenge).',
      'Tap a cell to select it; tap it again to switch direction (across/down).',
      'Type letters with the on-screen or physical keyboard.',
      'The grid is solved when every cell is correctly filled.',
      'Stuck? Three hints per grid and a check button.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : clavier à l’écran intégré (lettres + effacer).',
      'Ordinateur : saisie directe au clavier, flèches pour naviguer, retour arrière pour effacer, barre d’espace pour changer de sens.',
      'Cliquez sur une définition pour sélectionner le mot correspondant.',
    ],
    en: [
      'Mobile & tablet: built-in on-screen keyboard (letters + erase).',
      'Desktop: type directly, arrow keys to navigate, Backspace to erase, Space to switch direction.',
      'Click a clue to select the matching word.',
    ],
  },
  features: {
    fr: [
      'Grilles 5×5 construites à la main et vérifiées',
      '8 grilles françaises et 6 anglaises aux thèmes variés',
      'Définitions courtes et accessibles bilingues',
      'Trois indices par grille et vérification des erreurs',
      'Défi quotidien : une grille du jour pour tous les joueurs',
      'Sauvegarde automatique de la progression',
    ],
    en: [
      'Hand-crafted and verified 5×5 grids',
      '8 French and 6 English grids on varied themes',
      'Short, accessible bilingual clues',
      'Three hints per grid and error checking',
      'Daily challenge: one grid of the day for all players',
      'Automatic progress saving',
    ],
  },
  tips: {
    fr: [
      'Commencez par le mot le plus long (la première définition horizontale) : il donne beaucoup de lettres croisées.',
      'Les mots français sont saisis sans accents : ÉCOLE se tape ECOLE, ÉPÉE se tape EPEE.',
      'Ne devinez jamais deux cases d’affilée : vérifiez chaque lettre avec les mots croisés.',
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
      { q: 'Pourquoi certains mots s’écrivent sans accent ?', a: 'Pour simplifier la saisie au clavier, les réponses françaises sont stockées sans diacritiques : ÉCOLE se saisit ECOLE. Les définitions rappellent l’orthographe complète quand c’est utile.' },
      { q: 'Que contient le défi du jour ?', a: 'Chaque jour, une grille différente est désignée par tirage déterministe : tous les joueurs affrontent la même grille, et la réussir valide votre défi quotidien du parcours Granmed.' },
      { q: 'Les grilles françaises et anglaises sont-elles les mêmes ?', a: 'Non : chaque langue possède ses propres grilles, ses propres thèmes et ses propres définitions, véritablement adaptées culturellement.' },
      { q: 'Puis-je reprendre une grille commencée ?', a: 'Oui : vos lettres, la grille en cours et le nombre d’indices utilisés sont sauvegardés automatiquement sur votre appareil.' },
    ],
    en: [
      { q: 'Are the grids randomly generated?', a: 'No. Every grid is hand-crafted on a verified pattern: crossings are checked letter by letter, guaranteeing grids that are always consistent and solvable.' },
      { q: 'Are the French and English grids the same?', a: 'No: each language has its own grids, themes and clues, genuinely adapted culturally.' },
      { q: 'What is in the daily challenge?', a: 'Each day, a different grid is picked deterministically: every player faces the same grid, and solving it validates your Granmed daily challenge.' },
      { q: 'How do hints work?', a: 'You get three hints per grid: each one reveals the correct letter of the selected cell. The counter resets with a new grid.' },
      { q: 'Can I resume a grid I started?', a: 'Yes: your letters, current grid and hints used are automatically saved on your device.' },
    ],
  },
  records: {
    solved: { fr: 'Grilles résolues', en: 'Puzzles solved' },
  },
}

/* ================= Jeu ================= */
type Phase = 'picker' | 'playing' | 'solved'

interface SaveData {
  letters: Record<string, string>
  puzzleId: string
  hintsUsed: number
  solvedIds: string[]
}

const KEYS = ['AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN']

function puzzlesFor(lang: 'fr' | 'en'): CrosswordPuzzle[] {
  return lang === 'fr' ? FR_PUZZLES : EN_PUZZLES
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
  const [dir, setDir] = useState<'across' | 'down'>('across')
  const [hintsUsed, setHintsUsed] = useState(0)
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set())
  const [solvedIds, setSolvedIds] = useState<string[]>([])
  const [justSolved, setJustSolved] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)
  const [restored, setRestored] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)

  const dailyPuzzle = useMemo(() => {
    const list = puzzlesFor(lang)
    const rand = mulberry32(seedFromString('mini-crossword:' + todayKey()))
    return list[Math.floor(rand() * list.length)]
  }, [lang])

  const grid = useMemo(() => (puzzle ? buildGrid(puzzle) : []), [puzzle])
  const nums = useMemo(() => (puzzle ? numberCells(puzzle) : new Map<string, number>()), [puzzle])

  /* Restauration de la sauvegarde (callback, jamais dans le corps d'un effet) */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      if (!alive) return
      const save = loadSave<SaveData>(gameId)
      if (save) {
        setSolvedIds(save.solvedIds ?? [])
        if (save.puzzleId && save.letters && Object.keys(save.letters).length > 0) {
          const p = [...FR_PUZZLES, ...EN_PUZZLES].find((x) => x.id === save.puzzleId)
          if (p) {
            setPuzzle(p)
            setLetters(save.letters)
            setHintsUsed(save.hintsUsed ?? 0)
            setPhase('playing')
            setRestored(true)
          }
        }
      }
    })
    return () => {
      alive = false
    }
  }, [])

  const persist = useCallback(
    (l: Record<string, string>, p: CrosswordPuzzle | null, h: number, solved: string[]) => {
      if (!p) return
      saveSave<SaveData>(gameId, { letters: l, puzzleId: p.id, hintsUsed: h, solvedIds: solved })
    },
    [],
  )

  const startPuzzle = useCallback(
    (p: CrosswordPuzzle, daily: boolean) => {
      setPuzzle(p)
      setIsDaily(daily)
      setLetters({})
      setHintsUsed(0)
      setWrongCells(new Set())
      setActive(p.words[0] ? { r: p.words[0].row, c: p.words[0].col } : null)
      setDir(p.words[0]?.dir ?? 'across')
      setPhase('playing')
      setJustSolved(false)
      setRestored(false)
      addPlay(gameId)
      persist({}, p, 0, solvedIds)
    },
    [addPlay, persist, solvedIds],
  )

  /* ---- Mots ---- */
  const wordAtCell = useCallback(
    (r: number, c: number, d: 'across' | 'down'): CrosswordWord | undefined =>
      puzzle?.words.find(
        (w) =>
          w.dir === d &&
          r >= w.row && r <= w.row + (w.answer.length - 1) * (d === 'down' ? 1 : 0) &&
          c >= w.col && c <= w.col + (w.answer.length - 1) * (d === 'across' ? 1 : 0) &&
          (d === 'down' ? c === w.col : r === w.row),
      ),
    [puzzle],
  )

  const finishSolve = useCallback(
    (l: Record<string, string>) => {
      if (!puzzle) return
      setPhase('solved')
      setJustSolved(true)
      setConfettiKey((k) => k + 1)
      sfx.play('win')
      const newSolved = solvedIds.includes(puzzle.id) ? solvedIds : [...solvedIds, puzzle.id]
      setSolvedIds(newSolved)
      persist({}, puzzle, hintsUsed, newSolved)
      addWin(gameId)
      addXp(30)
      const wasSolved = solvedIds.includes(puzzle.id)
      if (!wasSolved) {
        const total = newSolved.length
        setBest(gameId, 'solved', total, false)
        unlockBadge('crossword-first')
        if (total >= 3) unlockBadge('crossword-3')
      }
      if (isDaily) completeDaily(gameId)
    },
    [puzzle, solvedIds, persist, addWin, addXp, setBest, unlockBadge, completeDaily, isDaily, hintsUsed],
  )

  const typeLetter = useCallback(
    (ch: string) => {
      if (!puzzle || !active || phase !== 'playing') return
      const key = `${active.r},${active.c}`
      if (grid[active.r][active.c] === null) return
      sfx.play('click', { volume: 0.4 })
      const next = { ...letters, [key]: ch }
      setLetters(next)
      setWrongCells((prev) => {
        const s = new Set(prev)
        s.delete(key)
        return s
      })
      // avancer dans le mot
      const w = wordAtCell(active.r, active.c, dir)
      if (w) {
        const idx = dir === 'across' ? active.c - w.col : active.r - w.row
        if (idx < w.answer.length - 1) {
          setActive(
            dir === 'across' ? { r: active.r, c: active.c + 1 } : { r: active.r + 1, c: active.c },
          )
        }
      }
      // détection de résolution (dans le handler, jamais dans un effet)
      const allFilled = grid.every((row, r) => row.every((cell, c) => cell === null || next[`${r},${c}`]))
      if (allFilled) {
        const allCorrect = grid.every((row, r) =>
          row.every((cell, c) => cell === null || next[`${r},${c}`] === cell),
        )
        if (allCorrect) finishSolve(next)
        else sfx.play('wrong', { volume: 0.3 })
      }
      persist(next, puzzle, hintsUsed, solvedIds)
    },
    [puzzle, active, phase, grid, letters, dir, wordAtCell, finishSolve, persist, hintsUsed, solvedIds],
  )

  const eraseLetter = useCallback(() => {
    if (!puzzle || !active || phase !== 'playing') return
    const key = `${active.r},${active.c}`
    const next = { ...letters }
    if (next[key]) {
      delete next[key]
      setLetters(next)
      sfx.play('click', { volume: 0.3 })
      persist(next, puzzle, hintsUsed, solvedIds)
    } else {
      // reculer
      const w = wordAtCell(active.r, active.c, dir)
      if (w) {
        const idx = dir === 'across' ? active.c - w.col : active.r - w.row
        if (idx > 0) {
          const prevPos =
            dir === 'across' ? { r: active.r, c: active.c - 1 } : { r: active.r - 1, c: active.c }
          setActive(prevPos)
          const pk = `${prevPos.r},${prevPos.c}`
          const n2 = { ...next }
          delete n2[pk]
          setLetters(n2)
          persist(n2, puzzle, hintsUsed, solvedIds)
        }
      }
    }
  }, [puzzle, active, phase, letters, dir, wordAtCell, persist, hintsUsed, solvedIds])

  const moveActive = useCallback(
    (dr: number, dc: number) => {
      if (!puzzle || !active) return
      let r = active.r + dr
      let c = active.c + dc
      while (r >= 0 && r < puzzle.size && c >= 0 && c < puzzle.size) {
        if (grid[r][c] !== null) {
          setActive({ r, c })
          return
        }
        r += dr
        c += dc
      }
    },
    [puzzle, active, grid],
  )

  const selectCell = useCallback(
    (r: number, c: number) => {
      if (!puzzle || grid[r][c] === null) return
      sfx.play('click', { volume: 0.3 })
      if (active && active.r === r && active.c === c) {
        const hasA = Boolean(wordAtCell(r, c, 'across'))
        const hasD = Boolean(wordAtCell(r, c, 'down'))
        if (hasA && hasD) setDir((d) => (d === 'across' ? 'down' : 'across'))
      } else {
        setActive({ r, c })
        const hasA = Boolean(wordAtCell(r, c, 'across'))
        setDir(hasA ? 'across' : 'down')
      }
    },
    [puzzle, grid, active, wordAtCell],
  )

  const checkGrid = useCallback(() => {
    if (!puzzle) return
    sfx.play('click')
    const wrong = new Set<string>()
    let filled = 0
    let total = 0
    grid.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell === null) return
        total++
        const l = letters[`${r},${c}`]
        if (l) filled++
        if (l && l !== cell) wrong.add(`${r},${c}`)
      }),
    )
    setWrongCells(wrong)
    if (wrong.size === 0 && filled === total) {
      finishSolve(letters)
    } else if (wrong.size > 0) {
      sfx.play('wrong', { volume: 0.4 })
    }
  }, [puzzle, grid, letters, finishSolve])

  const useHint = useCallback(() => {
    if (!puzzle || hintsUsed >= 3 || !active || phase !== 'playing') return
    // révèle une lettre vide de la grille (case active en priorité, sinon la première vide)
    let target: { r: number; c: number } | null = null
    if (!letters[`${active.r},${active.c}`] && grid[active.r][active.c] !== null) {
      target = active
    } else {
      outer: for (let r = 0; r < puzzle.size; r++) {
        for (let c = 0; c < puzzle.size; c++) {
          if (grid[r][c] !== null && !letters[`${r},${c}`]) {
            target = { r, c }
            break outer
          }
        }
      }
    }
    if (!target) return
    sfx.play('reveal')
    const next = { ...letters, [`${target.r},${target.c}`]: grid[target.r][target.c]! }
    setLetters(next)
    const h = hintsUsed + 1
    setHintsUsed(h)
    persist(next, puzzle, h, solvedIds)
    const allFilled = grid.every((row, r) => row.every((cell, c) => cell === null || next[`${r},${c}`]))
    const allCorrect = grid.every((row, r) => row.every((cell, c) => cell === null || next[`${r},${c}`] === cell))
    if (allFilled && allCorrect) finishSolve(next)
  }, [puzzle, hintsUsed, active, phase, letters, grid, persist, solvedIds, finishSolve])

  /* Clavier physique via le plateau focusable */
  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (phase !== 'playing') return
      const k = e.key
      if (/^[a-zA-Z]$/.test(k)) {
        e.preventDefault()
        typeLetter(k.toUpperCase())
      } else if (k === 'Backspace') {
        e.preventDefault()
        eraseLetter()
      } else if (k === 'ArrowLeft') moveActive(0, -1)
      else if (k === 'ArrowRight') moveActive(0, 1)
      else if (k === 'ArrowUp') moveActive(-1, 0)
      else if (k === 'ArrowDown') moveActive(1, 0)
      else if (k === ' ') {
        e.preventDefault()
        setDir((d) => (d === 'across' ? 'down' : 'across'))
      }
    },
    [phase, typeLetter, eraseLetter, moveActive],
  )

  const L = useMemo(
    () => ({
      fr: {
        choose: 'Choisissez une grille',
        daily: 'Grille du jour',
        across: 'Horizontalement',
        down: 'Verticalement',
        check: 'Vérifier',
        hint: 'Indice',
        erase: 'Effacer',
        solvedTag: 'Résolue',
        restart: 'Recommencer',
        back: 'Autres grilles',
        solvedMsg: 'Grille résolue ! Bravo !',
        resume: 'Reprendre la grille en cours',
        newOne: 'Nouvelle grille',
        restored: 'Reprise de votre grille sauvegardée.',
        dailyDone: 'Défi du jour déjà réussi !',
        fillAll: 'Remplissez toutes les cases pour vérifier.',
      },
      en: {
        choose: 'Choose a grid',
        daily: 'Grid of the day',
        across: 'Across',
        down: 'Down',
        check: 'Check',
        hint: 'Hint',
        erase: 'Erase',
        solvedTag: 'Solved',
        restart: 'Restart',
        back: 'Other grids',
        solvedMsg: 'Grid solved! Well done!',
        resume: 'Resume current grid',
        newOne: 'New grid',
        restored: 'Resumed your saved grid.',
        dailyDone: 'Daily challenge already complete!',
        fillAll: 'Fill every cell to check.',
      },
    })[lang],
    [lang],
  )

  const activeWord = active ? wordAtCell(active.r, active.c, dir) : undefined

  /* ================= Rendu ================= */
  if (phase === 'picker' || !puzzle) {
    const list = puzzlesFor(lang)
    return (
      <div className="relative select-none">
        {!dailyDone ? (
          <button
            type="button"
            onClick={() => {
              sfx.play('pop')
              startPuzzle(dailyPuzzle, true)
            }}
            className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-left transition-transform hover:scale-[1.01] dark:border-amber-500/25 dark:bg-amber-500/10"
          >
            <span className="text-2xl" aria-hidden="true">🎁</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-amber-700 dark:text-amber-300">
                {L.daily} — {todayKey()}
              </span>
              <span className="block text-xs text-muted-foreground">
                {dailyPuzzle.icon} {dailyPuzzle.theme[lang]}
              </span>
            </span>
            <span className="rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-white">{t('game.startDaily')}</span>
          </button>
        ) : (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-300/60 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CalendarCheck className="h-4 w-4" aria-hidden="true" /> {L.dailyDone}
          </div>
        )}

        <h3 className="mb-3 font-display text-lg font-bold">{L.choose}</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => startPuzzle(p, false)}
              className="group flex items-center gap-3 rounded-2xl border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="text-3xl transition-transform group-hover:scale-110" aria-hidden="true">{p.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display font-bold">{p.theme[lang]}</span>
                <span className="text-xs text-muted-foreground">5×5 · {p.words.length} {lang === 'fr' ? 'mots' : 'words'}</span>
              </span>
              {solvedIds.includes(p.id) ? (
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">✓</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative select-none">
      <Confetti fire={confettiKey} count={100} />

      {/* Barre d'état */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="flex h-11 items-center gap-2 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
          <span className="text-lg" aria-hidden="true">{puzzle.icon}</span> {puzzle.theme[lang]}
        </span>
        {isDaily ? (
          <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            <CalendarCheck className="h-4 w-4" aria-hidden="true" /> {L.daily}
          </span>
        ) : null}
        {restored ? <span className="text-xs text-muted-foreground">{L.restored}</span> : null}
        <div className="ms-auto flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            className="h-11 gap-1.5 rounded-full"
            onClick={checkGrid}
            disabled={phase === 'solved'}
          >
            <CheckCheck className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{L.check}</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-11 gap-1.5 rounded-full"
            onClick={useHint}
            disabled={phase === 'solved' || hintsUsed >= 3}
          >
            <Lightbulb className="h-4 w-4 text-amber-500" aria-hidden="true" />
            {3 - hintsUsed}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-11 gap-1.5 rounded-full"
            onClick={() => {
              sfx.play('click')
              setPhase('picker')
            }}
          >
            <span className="hidden sm:inline">{L.back}</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
        {/* Plateau */}
        <div
          ref={boardRef}
          role="grid"
          aria-label={t('common.rules')}
          tabIndex={0}
          onKeyDown={onKey}
          className="mx-auto w-fit rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {grid.map((row, r) => (
            <div key={r} className="flex" role="row">
              {row.map((cell, c) => {
                if (cell === null) {
                  return (
                    <div
                      key={c}
                      className="h-[clamp(44px,13vw,58px)] w-[clamp(44px,13vw,58px)] rounded-[4px] bg-foreground/[0.07]"
                      role="gridcell"
                      aria-hidden="true"
                    />
                  )
                }
                const key = `${r},${c}`
                const isActive = active?.r === r && active?.c === c
                const inActiveWord = Boolean(
                  activeWord &&
                    active &&
                    activeWord.dir === dir &&
                    (dir === 'across'
                      ? r === active.r && c >= activeWord.col && c < activeWord.col + activeWord.answer.length
                      : c === active.c && r >= activeWord.row && r < activeWord.row + activeWord.answer.length),
                )
                const val = letters[key] ?? ''
                const num = nums.get(key)
                return (
                  <button
                    key={c}
                    type="button"
                    role="gridcell"
                    aria-label={`${num ? `N°${num} ` : ''}${val || '—'}`}
                    onClick={() => selectCell(r, c)}
                    className={cn(
                      'relative m-[2px] flex h-[clamp(44px,13vw,58px)] w-[clamp(44px,13vw,58px)] items-center justify-center rounded-[6px] border-2 text-xl font-bold uppercase transition-colors sm:text-2xl',
                      isActive
                        ? 'border-primary bg-primary/15'
                        : inActiveWord
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-border bg-card',
                      wrongCells.has(key) && 'anim-shake border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-500/15',
                      val && !wrongCells.has(key) && 'text-foreground',
                    )}
                  >
                    {num ? (
                      <span className="absolute left-0.5 top-0 text-[9px] font-semibold text-muted-foreground">{num}</span>
                    ) : null}
                    {val}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Définitions */}
        <div className="mx-auto grid w-full max-w-md gap-4 sm:mx-0">
          {(['across', 'down'] as const).map((d) => {
            const words = puzzle.words.filter((w) => w.dir === d)
            if (words.length === 0) return null
            return (
              <div key={d} className="rounded-2xl border bg-card p-3.5">
                <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {d === 'across' ? L.across : L.down}
                </h3>
                <ul className="space-y-1">
                  {words.map((w) => {
                    const num = nums.get(`${w.row},${w.col}`) ?? 0
                    const isActiveWord = activeWord === w
                    return (
                      <li key={`${w.dir}-${w.row}-${w.col}`}>
                        <button
                          type="button"
                          onClick={() => {
                            sfx.play('click', { volume: 0.3 })
                            setActive({ r: w.row, c: w.col })
                            setDir(w.dir)
                          }}
                          className={cn(
                            'flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
                            isActiveWord ? 'bg-primary/10 font-semibold text-primary' : 'hover:bg-accent',
                          )}
                        >
                          <span className="font-bold tabular-nums">{num}.</span>
                          <span>{w.clue[lang]}</span>
                          <span className="ms-auto text-xs text-muted-foreground">{w.answer.length}</span>
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

      {/* Clavier à l'écran */}
      {phase === 'playing' ? (
        <div className="mt-4 max-w-md space-y-1.5" aria-label="Clavier">
          {KEYS.map((row) => (
            <div key={row} className="flex justify-center gap-1.5">
              {row.split('').map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => typeLetter(k)}
                  className="h-11 min-w-[9.5%] flex-1 rounded-lg border bg-card text-sm font-bold transition-colors hover:bg-accent active:scale-95"
                >
                  {k}
                </button>
              ))}
            </div>
          ))}
          <div className="flex justify-center gap-1.5 pt-1">
            <Button variant="secondary" className="h-11 flex-1 rounded-full" onClick={eraseLetter}>
              <Eraser className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{L.erase}</span>
            </Button>
            <Button
              variant="secondary"
              className="h-11 flex-1 rounded-full"
              onClick={() => setDir((d) => (d === 'across' ? 'down' : 'across'))}
            >
              ⇄ {dir === 'across' ? L.across : L.down}
            </Button>
          </div>
        </div>
      ) : null}

      {/* Résolue */}
      {phase === 'solved' ? (
        <div className="anim-rise mt-5 rounded-2xl border-2 border-emerald-300/60 bg-emerald-50/60 p-5 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10" role="status">
          <Trophy className="mx-auto h-8 w-8 text-amber-500" aria-hidden="true" />
          <p className="mt-2 font-display text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{L.solvedMsg}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {puzzle.icon} {puzzle.theme[lang]}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <Button size="lg" className="rounded-full" onClick={() => startPuzzle(puzzle, isDaily)}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> {L.restart}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full"
              onClick={() => {
                sfx.play('click')
                setPhase('picker')
              }}
            >
              <Play className="h-4 w-4" aria-hidden="true" /> {L.back}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
