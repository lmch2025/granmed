'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { BarChart3, CalendarCheck, Crosshair, Dumbbell, Flame, History, RotateCcw, Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, dateKeyOffset, clamp, useReducedMotion, useHydrated } from '@/lib/utils-game'
import { loadSave, saveSave } from '@/lib/save'
import { computeIq } from '@/lib/games/iq'
import type { GameSEOContent } from '@/lib/games/types'
import { dailyWordSeoContent } from './data/daily-word-seo'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'
import { IqChallengeBanner } from '@/components/game/iq-banner'
import { useJuice } from '@/components/game/fx'
import {
  answersFor,
  buildDictionary,
  evaluateGuess,
  normalizeWord,
  puzzleNumber,
  wordForDate,
} from './data/daily-word-data'

export const gameId = 'daily-word'

/* ================= Contenu SEO bilingue ================= */
/* Task 27 : objet déplacé en données pures dans ./data/daily-word-seo.ts —
 * double-usage serveur/client (HTML brut des pages jeu réelles), source unique. */
export const content: GameSEOContent = dailyWordSeoContent

/* ================= Types & constantes ================= */

type LetterState = 'correct' | 'present' | 'absent'

const KEYBOARDS: Record<Lang, string[][]> = {
  fr: [
    ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
    ['W', 'X', 'C', 'V', 'B', 'N'],
  ],
  en: [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ],
}

const TILE_CLASS: Record<LetterState, string> = {
  correct: 'border-emerald-600 bg-emerald-500 text-white',
  present: 'border-amber-500 bg-amber-400 text-stone-900',
  absent: 'border-stone-500/50 bg-stone-400 text-white dark:bg-stone-600',
}

const KEY_CLASS: Record<LetterState, string> = {
  correct: 'border-emerald-600 bg-emerald-500 text-white',
  present: 'border-amber-500 bg-amber-400 text-stone-900',
  absent: 'border-stone-500/50 bg-stone-400/90 text-white dark:bg-stone-600',
}

/** Taille de tuile adaptative : la grille + le clavier tiennent dans
 *  calc(100dvh − 220px) (chrome Task 9 ≈ 190 px + marge). Plafonnée par la
 *  largeur (11.5 vw ≈ 45 px à 390 px) pour ne jamais déborder horizontalement,
 *  plancher 32 px sur les écrans très courts. Budget vertical 460 → 524 px
 *  (Task 19) : la bannière « Défi QI » (~64 px) doit pousser les tuiles à
 *  rétrécir, jamais le clavier sous le pli. */
const TILE_SIZE =
  'h-[clamp(32px,min(11.5vw,(100dvh_-_524px)/6),56px)] w-[clamp(32px,min(11.5vw,(100dvh_-_524px)/6),56px)]'

const L_FR = {
  dailyBadge: 'Défi du jour',
  dailyShort: 'Défi',
  practiceBadge: 'Entraînement',
  practiceHint: 'Partie libre — ne compte ni pour le défi du jour, ni pour la série.',
  triesLeft: 'essais restants',
  winRate: 'Réussite',
  bestTries: 'Meilleur score',
  playDailyShort: 'Défi',
  practiceBtn: 'Entraînement',
  newWord: 'Nouveau mot',
  incomplete: 'Mot incomplet — 5 lettres nécessaires.',
  unknown: 'Mot absent du dictionnaire.',
  wonTitle: 'Bravo !',
  lostTitle: 'Le mot était :',
  dailyDone: 'Défi du jour réussi — revenez demain !',
  statsTitle: 'Statistiques',
  gamesPlayed: 'Parties',
  wins: 'Victoires',
  currentStreak: 'Série en cours',
  maxStreak: 'Meilleure série',
  distribution: 'Répartition des essais',
  archives: 'Archives — 7 derniers jours',
  replay: 'Rejouer en entraînement',
  notPlayed: 'non joué',
  keyboardLabel: 'Clavier virtuel',
  boardLabel: 'Grille du Mot du Jour',
  enter: 'ENTRÉE',
  backspace: 'Effacer',
  winShare: 'Mot du Jour',
  practiceShareLost: 'Mot non trouvé en 6 essais',
  practiceShareTry: (n: number) => `Mot trouvé en ${n}/6 essais`,
}

const L_EN = {
  dailyBadge: 'Daily challenge',
  dailyShort: 'Daily',
  practiceBadge: 'Practice',
  practiceHint: 'Free play — counts neither for the daily challenge nor for the streak.',
  triesLeft: 'tries left',
  winRate: 'Win rate',
  bestTries: 'Best solve',
  playDailyShort: 'Daily',
  practiceBtn: 'Practice',
  newWord: 'New word',
  incomplete: 'Not enough letters — 5 letters required.',
  unknown: 'Word not in the dictionary.',
  wonTitle: 'Well done!',
  lostTitle: 'The word was:',
  dailyDone: 'Daily challenge complete — come back tomorrow!',
  statsTitle: 'Statistics',
  gamesPlayed: 'Games',
  wins: 'Wins',
  currentStreak: 'Current streak',
  maxStreak: 'Best streak',
  distribution: 'Guess distribution',
  archives: 'Archive — last 7 days',
  replay: 'Replay in practice',
  notPlayed: 'not played',
  keyboardLabel: 'Virtual keyboard',
  boardLabel: 'Daily word grid',
  enter: 'ENTER',
  backspace: 'Delete',
  winShare: 'Daily Word',
  practiceShareLost: 'Word not found in 6 tries',
  practiceShareTry: (n: number) => `Solved in ${n}/6 tries`,
}

interface DWDaily {
  date: string
  lang: Lang
  guesses: string[]
  counted: boolean
}

interface DWStats {
  gamesPlayed: number
  wins: number
  currentStreak: number
  maxStreak: number
  distribution: number[]
  lastPlayedDate: string
  lastWonDate: string | null
  history: Record<string, { word: string; tries: number; won: boolean }>
}

interface DWSave {
  v: number
  stats: DWStats
  /** v2 : défi en cours par langue (le mot du jour diffère FR/EN). v1 (hérité) : DWDaily | null. */
  daily: Partial<Record<Lang, DWDaily>> | DWDaily | null
}

function defaultStats(): DWStats {
  return {
    gamesPlayed: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0],
    lastPlayedDate: '',
    lastWonDate: null,
    history: {},
  }
}

function parseStats(raw: unknown): DWStats {
  const d = defaultStats()
  if (!raw || typeof raw !== 'object') return d
  const s = raw as Partial<DWStats>
  const num = (v: unknown): number => (typeof v === 'number' && v >= 0 ? v : 0)
  const history: DWStats['history'] = {}
  if (s.history && typeof s.history === 'object') {
    for (const [k, v] of Object.entries(s.history)) {
      if (v && typeof v === 'object') {
        const e = v as { word?: unknown; tries?: unknown; won?: unknown }
        if (typeof e.word === 'string' && typeof e.tries === 'number' && typeof e.won === 'boolean') {
          history[k] = { word: e.word, tries: e.tries, won: e.won }
        }
      }
    }
  }
  return {
    gamesPlayed: num(s.gamesPlayed),
    wins: num(s.wins),
    currentStreak: num(s.currentStreak),
    maxStreak: num(s.maxStreak),
    distribution:
      Array.isArray(s.distribution) && s.distribution.length === 6
        ? s.distribution.map((n) => num(n))
        : [0, 0, 0, 0, 0, 0],
    lastPlayedDate: typeof s.lastPlayedDate === 'string' ? s.lastPlayedDate : '',
    lastWonDate: typeof s.lastWonDate === 'string' ? s.lastWonDate : null,
    history,
  }
}

/** Assainit une entrée de défi quotidien. */
function sanitizeDaily(raw: unknown): DWDaily | null {
  if (!raw || typeof raw !== 'object') return null
  const e = raw as Partial<DWDaily>
  if (e.lang !== 'fr' && e.lang !== 'en') return null
  if (typeof e.date !== 'string' || !Array.isArray(e.guesses)) return null
  return {
    date: e.date,
    lang: e.lang,
    guesses: e.guesses.filter((g) => typeof g === 'string' && g.length === 5),
    counted: e.counted === true,
  }
}

/** Accepte les deux formes de sauvegarde : v1 (DWDaily | null) et v2 (par langue). */
function parseDailyMap(raw: unknown): Partial<Record<Lang, DWDaily>> {
  const out: Partial<Record<Lang, DWDaily>> = {}
  if (!raw || typeof raw !== 'object') return out
  const asMap = raw as Partial<Record<Lang, unknown>>
  const entries = 'fr' in asMap || 'en' in asMap ? Object.values(asMap) : [raw]
  for (const e of entries) {
    const d = sanitizeDaily(e)
    if (d) out[d.lang] = d
  }
  return out
}

/** Applique un résultat quotidien aux stats. Retourne null si déjà comptabilisé aujourd'hui. */
function withDailyResult(
  prev: DWStats,
  won: boolean,
  tries: number,
  word: string,
  today: string,
): DWStats | null {
  if (prev.history[today]) return null
  const s: DWStats = {
    ...prev,
    distribution: [...prev.distribution],
    history: { ...prev.history, [today]: { word, tries, won } },
  }
  s.gamesPlayed += 1
  s.lastPlayedDate = today
  if (won) {
    s.wins += 1
    s.distribution[tries - 1] += 1
    s.currentStreak = prev.lastWonDate === dateKeyOffset(-1) ? prev.currentStreak + 1 : 1
    s.maxStreak = Math.max(s.maxStreak, s.currentStreak)
    s.lastWonDate = today
  } else {
    s.currentStreak = 0
  }
  return s
}

function fmtDate(dk: string, lang: Lang): string {
  const [y, m, d] = dk.split('-').map((v) => Number.parseInt(v, 10))
  if (!y || !m || !d) return dk
  return new Date(y, m - 1, d).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function inOverlay(e: Event): boolean {
  const t = e.target as Element | null
  return (
    !!t &&
    typeof t.closest === 'function' &&
    !!t.closest('[role="dialog"], [data-radix-popper-content-wrapper], [role="menu"]')
  )
}

/** QI estimé d'une partie (Task 18) : précision = (7 − essais)/6 si le mot est
 *  trouvé (en 1 essai → 1,0 ; en 6 → 0,17 ; plancher 0,2), sinon 0,2 ;
 *  difficulté 2 ; pas de dimension rapidité (un mot par jour, sans chrono). */
function estimateWordIq(won: boolean, tries: number): number {
  return computeIq(gameId, { accuracy: won ? clamp((7 - tries) / 6, 0.2, 1) : 0.2, difficulty: 2 })
}

/* ================= Composant principal ================= */
export default function DailyWordGame() {
  const lang = useLang()
  const reduce = useReducedMotion()
  const hydrated = useHydrated()
  const dailyDone = useIsDailyDone(gameId)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)
  const L = lang === 'fr' ? L_FR : L_EN

  const dictionary = useMemo(() => buildDictionary(lang), [lang])

  const [mode, setMode] = useState<'daily' | 'practice'>('daily')
  const [answer, setAnswer] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [phase, setPhase] = useState<'playing' | 'won' | 'lost'>('playing')
  const [revealIdx, setRevealIdx] = useState(5)
  const [shakeCount, setShakeCount] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)
  const [stats, setStats] = useState<DWStats>(defaultStats)
  const [ready, setReady] = useState(false)
  /* QI estimé de la partie terminée (Task 18) — null en cours de partie. */
  const [endIq, setEndIq] = useState<number | null>(null)

  const lockRef = useRef(false)
  const genRef = useRef(0)
  const playCountedRef = useRef(false)
  const statsRef = useRef<DWStats>(defaultStats())
  const dailyMapRef = useRef<Partial<Record<Lang, DWDaily>>>({})
  const lastWordRef = useRef('')
  const timersRef = useRef<Set<number>>(new Set())

  const REVEAL_STEP = reduce ? 60 : 200

  /* Effets « juice » (Task 20) — helpers visuels sans re-render, fire-and-forget. */
  const juice = useJuice()
  const boardRef = useRef<HTMLDivElement>(null)
  const streakPillRef = useRef<HTMLSpanElement>(null)

  function applyStats(s: DWStats) {
    statsRef.current = s
    setStats(s)
  }

  function persist(s: DWStats, d: Partial<Record<Lang, DWDaily>>) {
    saveSave<DWSave>(gameId, { v: 2, stats: s, daily: d })
  }

  /** Timer protégé par une génération : les callbacks meurent si une nouvelle partie démarre. */
  function schedule(fn: () => void, ms: number) {
    const gen = genRef.current
    const id = window.setTimeout(() => {
      timersRef.current.delete(id)
      if (genRef.current === gen) fn()
    }, ms)
    timersRef.current.add(id)
  }

  /* --- Nettoyage des timers en attente au démontage --- */
  useEffect(() => {
    const timers = timersRef.current
    return () => {
      genRef.current++
      for (const id of timers) window.clearTimeout(id)
      timers.clear()
    }
  }, [])

  /* --- Restauration (callback asynchrone post-mount, conforme react-hooks/set-state-in-effect) --- */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      if (!alive) return
      const today = todayKey()
      const save = loadSave<DWSave>(gameId)
      const s = parseStats(save?.stats)
      const ans = wordForDate(lang, today)
      genRef.current++
      lockRef.current = false
      setAnswer(ans)
      setCurrent('')
      setMessage(null)
      setShakeCount(0)
      setRevealIdx(5)
      setMode('daily')
      applyStats(s)
      const map = parseDailyMap(save?.daily)
      dailyMapRef.current = map
      const d = map[lang] ?? null
      let restoredPhase: 'playing' | 'won' | 'lost' = 'playing'
      if (d && d.date === today) {
        playCountedRef.current = d.counted
        setGuesses(d.guesses)
        restoredPhase = d.guesses.includes(ans) ? 'won' : d.guesses.length >= 6 ? 'lost' : 'playing'
      } else {
        playCountedRef.current = false
        setGuesses([])
      }
      setPhase(restoredPhase)
      /* QI estimé (Task 18) : recalculé aussi sur restauration d'un défi
         déjà terminé, pour que la carte QI réapparaisse au rechargement. */
      if (restoredPhase !== 'playing' && d && d.date === today) {
        setEndIq(estimateWordIq(restoredPhase === 'won', d.guesses.length))
      } else {
        setEndIq(null)
      }
      /* Partie terminée mais non comptabilisée (rechargement pendant la révélation) :
         on enregistre le résultat silencieusement, sans re-célébrer. */
      if (d && d.date === today && restoredPhase !== 'playing' && !s.history[today]) {
        recordDailyResult(ans, restoredPhase === 'won', d.guesses.length, d.guesses)
      }
      setReady(true)
    })
    return () => {
      alive = false
    }
  }, [lang])

  /* --- Saisie --- */
  function addLetter(ch: string) {
    if (!ready || phase !== 'playing' || lockRef.current) return
    if (current.length >= 5) return
    sfx.play('click', { volume: 0.3 })
    setCurrent(current + ch)
  }

  function removeLetter() {
    if (!ready || phase !== 'playing' || lockRef.current) return
    if (!current.length) return
    sfx.play('click', { volume: 0.25 })
    setCurrent(current.slice(0, -1))
  }

  function flashInvalid(msg: string) {
    setMessage(msg)
    setShakeCount((k) => k + 1) // remonte la ligne → relance l'animation shake
    sfx.play('wrong', { volume: 0.35 })
    navigator.vibrate?.(10)
    schedule(() => setMessage(null), 2200)
  }

  function submitGuess() {
    if (!ready || phase !== 'playing' || lockRef.current) return
    if (current.length !== 5) {
      flashInvalid(L.incomplete)
      return
    }
    if (!dictionary.has(current)) {
      flashInvalid(L.unknown)
      return
    }
    if (!playCountedRef.current) {
      playCountedRef.current = true
      addPlay(gameId)
    }
    const guess = current
    const nextGuesses = [...guesses, guess]
    const won = guess === answer
    const lost = !won && nextGuesses.length >= 6
    setGuesses(nextGuesses)
    setCurrent('')
    setMessage(null)
    lockRef.current = true
    setRevealIdx(0)
    sfx.play('pop', { volume: 0.5 })
    navigator.vibrate?.(10)
    if (mode === 'daily') {
      const d: DWDaily = { date: todayKey(), lang, guesses: nextGuesses, counted: playCountedRef.current }
      dailyMapRef.current = { ...dailyMapRef.current, [lang]: d }
      persist(statsRef.current, dailyMapRef.current)
    }
    for (let i = 0; i < 5; i++) {
      schedule(() => {
        sfx.play('reveal', { volume: 0.45 })
        setRevealIdx(i + 1)
      }, REVEAL_STEP * (i + 1))
    }
    schedule(
      () => {
        lockRef.current = false
        if (won || lost) finishGame(won, nextGuesses.length, nextGuesses)
        /* Effets « juice » (Task 20) — cascade décorative sur la ligne gagnante
           (pops étagés ≈ anim-fx-pop, sans conflit CSS avec anim-flip-in) et pop
           du pill de série. Aucun verrou : les animations s'achèvent seules. */
        if (won) {
          const tiles = boardRef.current?.children[nextGuesses.length - 1]?.children
          for (let i = 0; i < 5; i++)
            schedule(() => juice.pop(tiles?.[i] as HTMLElement | undefined, 1.12, 320), i * 70)
          schedule(() => juice.pop(streakPillRef.current), 520)
        }
      },
      REVEAL_STEP * 5 + 350,
    )
  }

  function finishGame(won: boolean, tries: number, gs: string[]) {
    setPhase(won ? 'won' : 'lost')
    /* QI estimé (Task 18) — calculé une seule fois, au moment de la fin. */
    setEndIq(estimateWordIq(won, tries))
    if (won) {
      sfx.play('win')
      setConfettiKey((k) => k + 1)
      setBurstKey((k) => k + 1)
      navigator.vibrate?.(10)
    } else {
      sfx.play('lose')
    }
    /* Niveaux par jeu — une seule fois par fin de manche (défi ou entraînement) :
       victoire 20 + (7 − essais) × 2, défaite 8. */
    addGameXp(gameId, won ? 20 + (7 - tries) * 2 : 8)
    if (mode === 'daily') recordDailyResult(answer, won, tries, gs)
  }

  /** Enregistre le résultat du défi du jour : stats persistées + gamification (une seule fois par jour). */
  function recordDailyResult(ans: string, won: boolean, tries: number, gs: string[]) {
    const today = todayKey()
    const s = withDailyResult(statsRef.current, won, tries, ans, today)
    if (!s) return
    applyStats(s)
    const d: DWDaily = { date: today, lang, guesses: gs, counted: playCountedRef.current }
    dailyMapRef.current = { ...dailyMapRef.current, [lang]: d }
    persist(s, dailyMapRef.current)
    if (won) {
      addWin(gameId)
      addXp(25 + (6 - tries) * 5)
      setBest(gameId, 'wins', s.wins)
      setBest(gameId, 'max-streak', s.maxStreak)
      if (tries <= 3) unlockBadge('word-fast3')
      if (s.currentStreak >= 5) unlockBadge('word-streak5')
      completeDaily(gameId)
    }
  }

  /* --- Modes --- */
  function startPractice(word?: string) {
    sfx.play('click')
    const list = answersFor(lang)
    let w = word ?? list[Math.floor(Math.random() * list.length)]
    if (!word) {
      let guard = 0
      while (w === lastWordRef.current && guard < 8) {
        w = list[Math.floor(Math.random() * list.length)]
        guard++
      }
    }
    lastWordRef.current = w
    genRef.current++
    lockRef.current = false
    playCountedRef.current = true
    addPlay(gameId)
    setMode('practice')
    setAnswer(w)
    setGuesses([])
    setCurrent('')
    setPhase('playing')
    setEndIq(null)
    setRevealIdx(5)
    setMessage(null)
    setShakeCount(0)
  }

  function backToDaily() {
    sfx.play('click')
    genRef.current++
    lockRef.current = false
    const today = todayKey()
    const d = dailyMapRef.current[lang] ?? null
    const ans = wordForDate(lang, today)
    setMode('daily')
    setAnswer(ans)
    const gs = d && d.date === today ? d.guesses : []
    setGuesses(gs)
    setCurrent('')
    setRevealIdx(5)
    setMessage(null)
    setShakeCount(0)
    const backPhase = gs.includes(ans) ? 'won' : gs.length >= 6 ? 'lost' : 'playing'
    setPhase(backPhase)
    /* QI estimé (Task 18) : recalculé si le défi du jour est déjà terminé. */
    setEndIq(backPhase !== 'playing' && gs.length > 0 ? estimateWordIq(backPhase === 'won', gs.length) : null)
    playCountedRef.current = d?.counted ?? false
  }

  /* --- Clavier physique (listener rafraîchi à chaque rendu, jamais de setState dans l'effet) --- */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (inOverlay(e)) return
      if (e.key === 'Enter') {
        e.preventDefault()
        submitGuess()
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        removeLetter()
      } else if (e.key === ' ') {
        e.preventDefault() // pas de scroll intempestif pendant la partie
      } else if (e.key.length === 1) {
        const ch = normalizeWord(e.key)
        if (ch.length === 1) addLetter(ch)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  /* --- Lignes de résultat à partager : le CTA doré de RoundEndActions construit
         lui-même le texte complet (résultat + titre du jeu + URL localisée). --- */
  const shareResult = useMemo(() => {
    const score = phase === 'won' ? `${guesses.length}/6` : 'X/6'
    const header =
      mode === 'daily'
        ? `${L.winShare} #${puzzleNumber(todayKey())} — ${score}`
        : phase === 'won'
          ? L.practiceShareTry(guesses.length)
          : L.practiceShareLost
    const grid = guesses
      .map((g) =>
        evaluateGuess(g, answer)
          .map((s) => (s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬜'))
          .join(''),
      )
      .join('\n')
    return grid ? `${header}\n${grid}` : header
  }, [phase, mode, guesses, answer, L])

  /* --- Données dérivées --- */
  const rowStatuses = useMemo(
    () => guesses.map((g) => evaluateGuess(g, answer)),
    [guesses, answer],
  )

  /** États du clavier (priorité vert > orange > gris). La dernière ligne révélée
   *  ses couleurs colonne par colonne, au rythme du flip des tuiles. */
  const keyStates = useMemo(() => {
    const m = new Map<string, LetterState>()
    const rank: Record<LetterState, number> = { absent: 0, present: 1, correct: 2 }
    for (let r = 0; r < guesses.length; r++) {
      const isLast = r === guesses.length - 1
      const sts = rowStatuses[r]
      for (let c = 0; c < 5; c++) {
        if (isLast && c >= revealIdx) continue
        const ch = guesses[r][c]
        const prev = m.get(ch)
        if (!prev || rank[sts[c]] > rank[prev]) m.set(ch, sts[c])
      }
    }
    return m
  }, [guesses, rowStatuses, revealIdx])

  const archiveDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => dateKeyOffset(-1 - i)),
    [],
  )

  const today = todayKey()
  const triesLeft = Math.max(0, 6 - guesses.length)
  const effStreak =
    stats.lastWonDate === today || stats.lastWonDate === dateKeyOffset(-1) ? stats.currentStreak : 0
  const maxDist = Math.max(...stats.distribution, 1)
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0
  const bestTries = Object.values(stats.history).reduce<number | null>(
    (best, h) => (h.won && (best === null || h.tries < best) ? h.tries : best),
    null,
  )

  /* ================= Rendu ================= */
  return (
    <div className="relative my-auto w-full select-none">
      <Confetti fire={confettiKey} count={reduce ? 0 : 120} waves={2} gold />
      <VictoryBurst
        fire={burstKey}
        stars={guesses.length <= 2 ? 3 : guesses.length <= 4 ? 2 : 1}
        title={L.wonTitle}
        emoji="🎉"
        sub={phase === 'won' ? `${guesses.length}/6 · ${mode === 'daily' ? L.dailyBadge : L.practiceBadge}` : undefined}
      />

      {/* Défi QI bienveillant — mis en avant dès l'ouverture (Task 19) */}
      <IqChallengeBanner gameId={gameId} />

      {/* HUD compact : mode, n° du jour, série, essais restants */}
      <div className="flex flex-wrap items-center gap-1.5">
        {mode === 'daily' ? (
          <span
            title={L.dailyBadge}
            className="flex h-9 items-center gap-1.5 rounded-full bg-amber-100 px-3 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
          >
            <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {L.dailyShort} · #{puzzleNumber(today)}
          </span>
        ) : (
          <span
            title={L.practiceHint}
            className="flex h-9 items-center gap-1.5 rounded-full bg-orange-100 px-3 text-xs font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
          >
            <Dumbbell className="h-3.5 w-3.5" aria-hidden="true" />
            {L.practiceBadge}
          </span>
        )}
        {mode === 'daily' && effStreak > 0 ? (
          <span
            ref={streakPillRef}
            title={L.currentStreak}
            className="flex h-9 items-center gap-1 rounded-full bg-secondary/70 px-2.5 text-xs font-semibold tabular-nums"
          >
            <Flame className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" />
            {effStreak}
          </span>
        ) : null}
        {phase === 'playing' && ready ? (
          <span
            title={`${triesLeft} ${L.triesLeft}`}
            className="flex h-9 items-center gap-1 rounded-full bg-secondary/70 px-2.5 text-xs font-semibold tabular-nums"
          >
            <Crosshair className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {triesLeft}/6
          </span>
        ) : null}
        <div className="ms-auto flex flex-wrap gap-1.5">
          {mode === 'practice' ? (
            <Button variant="secondary" size="sm" className="h-9 gap-1.5 rounded-full px-3 text-xs" onClick={backToDaily}>
              <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
              {L.playDailyShort}
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="h-9 gap-1.5 rounded-full px-3 text-xs" onClick={() => startPractice()}>
              <Dumbbell className="h-3.5 w-3.5" aria-hidden="true" />
              {L.practiceBtn}
            </Button>
          )}
        </div>
      </div>
      {mode === 'practice' ? (
        <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{L.practiceHint}</p>
      ) : null}

      {/* Grille 6 × 5 — compacte, jamais de scroll horizontal */}
      <div ref={boardRef} className="mt-2 flex flex-col items-center gap-1" role="grid" aria-label={L.boardLabel}>
        {Array.from({ length: 6 }, (_, r) => {
          const submitted = r < guesses.length
          const isCurrentRow = r === guesses.length && phase === 'playing'
          const rowWord = submitted ? guesses[r] : isCurrentRow ? current : ''
          return (
            <div
              key={isCurrentRow ? `cur-${shakeCount}` : `row-${r}`}
              role="row"
              className={cn('flex gap-1', isCurrentRow && shakeCount > 0 && 'anim-shake')}
            >
              {Array.from({ length: 5 }, (_, c) => {
                const ch = rowWord[c] ?? ''
                const st: LetterState | null = submitted
                  ? r < guesses.length - 1 || c < revealIdx
                    ? rowStatuses[r][c]
                    : null
                  : null
                return (
                  <div
                    key={c}
                    role="gridcell"
                    className={cn(
                      `${TILE_SIZE} flex items-center justify-center rounded-lg border-2 text-[clamp(15px,min(5.5vw,24px),26px)] font-extrabold uppercase transition-colors`,
                      st
                        ? TILE_CLASS[st]
                        : ch
                          ? 'border-primary/60 bg-card'
                          : 'border-border bg-card/60',
                      st && !reduce && 'anim-flip-in',
                    )}
                  >
                    {ch}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Message inline (mot invalide, etc.) */}
      <p className="mt-1.5 min-h-5 text-center text-xs font-semibold text-muted-foreground sm:text-sm" aria-live="polite">
        {message ?? ''}
      </p>

      {/* Clavier virtuel — saisie principale sur mobile, 3 rangées ≥ 40 px */}
      <div className="mx-auto mt-1.5 w-full max-w-[500px] select-none" role="group" aria-label={L.keyboardLabel}>
        {KEYBOARDS[lang].map((row, ri) => (
          <div key={ri} className="flex justify-center gap-[3px] py-[2px] sm:gap-1.5">
            {ri === KEYBOARDS[lang].length - 1 ? (
              <button
                type="button"
                aria-label={L.enter}
                onClick={submitGuess}
                className="flex h-11 min-w-0 flex-[1.8] touch-manipulation select-none items-center justify-center rounded-lg border border-border bg-secondary text-[10px] font-bold shadow-sm transition-colors hover:bg-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring active:scale-95 sm:h-12 sm:text-xs"
              >
                {L.enter}
              </button>
            ) : null}
            {row.map((letter) => {
              const st = keyStates.get(letter)
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => addLetter(letter)}
                  className={cn(
                    'flex h-11 min-w-0 flex-1 touch-manipulation select-none items-center justify-center rounded-lg border border-border bg-secondary text-[13px] font-bold shadow-sm transition-colors hover:bg-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring active:scale-95 sm:h-12 sm:text-sm',
                    st ? KEY_CLASS[st] : null,
                  )}
                >
                  {letter}
                </button>
              )
            })}
            {ri === KEYBOARDS[lang].length - 1 ? (
              <button
                type="button"
                aria-label={L.backspace}
                onClick={removeLetter}
                className="flex h-11 min-w-0 flex-[1.8] touch-manipulation select-none items-center justify-center rounded-lg border border-border bg-secondary text-base font-bold shadow-sm transition-colors hover:bg-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring active:scale-95 sm:h-12"
              >
                ⌫
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {/* Panneau de fin */}
      {phase !== 'playing' && ready ? (
        <div
          role="status"
          className={cn(
            'anim-rise mt-3 rounded-2xl border-2 p-4 text-center sm:p-5',
            phase === 'won'
              ? 'border-emerald-300/60 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'
              : 'border-rose-300/60 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/10',
          )}
        >
          <p
            className={cn(
              'font-display text-2xl font-extrabold',
              phase === 'won' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300',
            )}
          >
            {phase === 'won' ? `🎉 ${L.wonTitle}` : `😔 ${L.lostTitle}`}
          </p>
          {phase === 'lost' ? (
            <p className="mt-2 font-display text-3xl font-black uppercase tracking-[0.3em]">{answer}</p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              {guesses.length}/6 · {mode === 'daily' ? L.dailyBadge : L.practiceBadge}
            </p>
          )}
          {mode === 'daily' && dailyDone ? (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              ✅ {L.dailyDone}
            </p>
          ) : null}
          <div className="mt-4 flex flex-col items-center gap-2.5">
            <RoundEndActions
              gameId={gameId}
              onReplay={() => startPractice()}
              replayLabel={mode === 'practice' ? L.newWord : L.practiceBtn}
              replayIcon={<RotateCcw className="h-5 w-5" aria-hidden="true" />}
              iq={endIq ?? undefined}
              shareResult={shareResult}
            />
          </div>
        </div>
      ) : null}

      {/* Statistiques + archives (sous la surface de jeu) */}
      {ready && hydrated ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border bg-card/60 p-4" aria-label={L.statsTitle}>
            <h3 className="flex items-center gap-2 font-display text-sm font-bold">
              <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
              {L.statsTitle}
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <StatCell value={stats.gamesPlayed} label={L.gamesPlayed} />
              <StatCell value={stats.wins} label={L.wins} />
              <StatCell value={`${winRate}%`} label={L.winRate} />
              <StatCell value={effStreak} label={L.currentStreak} />
              <StatCell value={stats.maxStreak} label={L.maxStreak} />
              <StatCell value={bestTries === null ? '—' : `${bestTries}/6`} label={L.bestTries} />
            </div>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {L.distribution}
            </p>
            <div className="mt-1.5 space-y-1">
              {stats.distribution.map((count, i) => {
                const isLast =
                  mode === 'daily' && phase === 'won' && i === guesses.length - 1
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-right font-bold tabular-nums">{i + 1}</span>
                    <div className="h-4 flex-1 overflow-hidden rounded bg-secondary">
                      <div
                        className={cn(
                          'h-full rounded transition-all duration-500',
                          isLast ? 'bg-emerald-500' : 'bg-primary',
                        )}
                        style={{
                          width: count > 0 ? `${Math.max((count / maxDist) * 100, 10)}%` : '0%',
                        }}
                      />
                    </div>
                    <span className="w-5 text-right tabular-nums text-muted-foreground">{count}</span>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border bg-card/60 p-4" aria-label={L.archives}>
            <h3 className="flex items-center gap-2 font-display text-sm font-bold">
              <History className="h-4 w-4 text-primary" aria-hidden="true" />
              {L.archives}
            </h3>
            <ul className="mt-2 divide-y divide-border">
              {archiveDays.map((dk) => {
                const h = stats.history[dk]
                return (
                  <li key={dk} className="flex items-center gap-2 py-1">
                    <span className="w-20 shrink-0 text-xs text-muted-foreground">{fmtDate(dk, lang)}</span>
                    <span className="flex-1 font-mono text-sm font-bold tracking-[0.2em]">
                      {h ? h.word : '•••••'}
                    </span>
                    {h ? (
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[11px] font-bold',
                          h.won
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
                        )}
                      >
                        {h.won ? `${h.tries}/6` : '✗'}
                      </span>
                    ) : (
                      <span className="text-[11px] italic text-muted-foreground">{L.notPlayed}</span>
                    )}
                    <button
                      type="button"
                      aria-label={`${L.replay} — ${fmtDate(dk, lang)}`}
                      onClick={() => startPractice(wordForDate(lang, dk))}
                      className="flex h-11 w-11 shrink-0 touch-manipulation select-none items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  )
}

function StatCell({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl bg-secondary/50 px-2 py-2 text-center">
      <p className="font-display text-lg font-extrabold leading-tight tabular-nums">{value}</p>
      <p className="text-[10px] leading-tight text-muted-foreground">{label}</p>
    </div>
  )
}
