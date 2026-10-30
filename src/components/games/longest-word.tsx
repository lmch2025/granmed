'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Play, CalendarCheck, RotateCcw, Timer, Trophy, Zap, Home, Delete, Check, FastForward, Lightbulb, Type } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, mulberry32, seedFromString, shuffle, useReducedMotion, useHydrated, clamp } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { longestWordSeoContent } from './data/longest-word-seo'
import { computeIq } from '@/lib/games/iq'
import { FR_WORDS, EN_WORDS, FR_LETTER_WEIGHTS, EN_LETTER_WEIGHTS } from '@/components/games/data/longest-word-data'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'
import { IqChallengeBanner } from '@/components/game/iq-banner'
import { useJuice } from '@/components/game/fx'

export const gameId = 'longest-word'

/* ================= Contenu SEO bilingue ================= */
/* Task 27 : objet déplacé en données pures dans ./data/longest-word-seo.ts —
 * double-usage serveur/client (HTML brut des pages jeu réelles), source unique. */
export const content: GameSEOContent = longestWordSeoContent

/* ================= Constantes & helpers ================= */

const ROUND_MS = 60000
const LETTER_COUNT = 9
const MIN_WORD_LEN = 3
const QUICK_MS = 5000 /** Fenêtre du bonus rapidité (ms après le dernier mot validé). */
const QUICK_BONUS = 2 /** Points bonus d’un mot validé rapidement. */
const MIN_BUILDABLE = 5 /** Un tirage jouable propose au moins ce nombre de mots constructibles. */
const MIN_BEST_LEN = 5 /** …dont le meilleur atteint au moins cette longueur. */
const MAX_REDRAW = 60 /** Garde-fou du re-tirage (jamais atteint en pratique). */
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u'])

function wordsFor(lang: 'fr' | 'en'): ReadonlySet<string> {
  return lang === 'fr' ? FR_WORDS : EN_WORDS
}

/** é→e, è→e, à→a, ç→c… et ligatures œ→oe, æ→ae. */
function foldAccents(s: string): string {
  return s
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'OE')
    .replace(/æ/g, 'ae')
    .replace(/Æ/g, 'AE')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Points d'un mot : longueur ; 8 lettres ×2 ; 9 lettres (tout le tirage) ×5. */
function wordPoints(len: number): number {
  if (len === 9) return 45
  if (len === 8) return 16
  return len
}

/** Tirage brut de 9 lettres : 3 à 6 voyelles (donc 3 à 6 consonnes), pondéré, ordre mélangé. */
function drawLetters(rand: () => number, weights: Record<string, number>): string[] {
  const vowelTarget = 3 + Math.floor(rand() * 4)
  const pick = (vowel: boolean): string => {
    const pool = Object.keys(weights).filter((k) => VOWELS.has(k) === vowel && weights[k] > 0)
    const total = pool.reduce((s, k) => s + weights[k], 0)
    let r = rand() * total
    for (const k of pool) {
      r -= weights[k]
      if (r <= 0) return k
    }
    return pool[pool.length - 1] ?? 'e'
  }
  const letters: string[] = []
  for (let i = 0; i < vowelTarget; i++) letters.push(pick(true))
  for (let i = 0; i < LETTER_COUNT - vowelTarget; i++) letters.push(pick(false))
  return shuffle(letters, rand).map((l) => l.toUpperCase())
}

/** Mots du dictionnaire constructibles avec les lettres (solution de fin de manche). */
function buildableWords(letters: string[], dict: ReadonlySet<string>): string[] {
  const counts = new Map<string, number>()
  for (const l of letters) counts.set(l, (counts.get(l) ?? 0) + 1)
  const out: string[] = []
  for (const w of dict) {
    if (w.length < MIN_WORD_LEN || w.length > letters.length) continue
    const c = new Map(counts)
    let ok = true
    for (const ch of w.toUpperCase()) {
      const n = c.get(ch) ?? 0
      if (n <= 0) {
        ok = false
        break
      }
      c.set(ch, n - 1)
    }
    if (ok) out.push(w.toUpperCase())
  }
  return out.sort((a, b) => b.length - a.length || a.localeCompare(b))
}

/** Tirage de 9 lettres JOUABLE : re-tiré (RNG avancé, donc déterministe pour le défi
 *  du jour) jusqu’à contenir au moins MIN_BUILDABLE mots constructibles dont un de
 *  MIN_BEST_LEN lettres ou plus. Sans cela, ~1 % des tirages n’offraient aucun mot. */
function drawPlayableLetters(rand: () => number, weights: Record<string, number>, dict: ReadonlySet<string>): string[] {
  let drawn = drawLetters(rand, weights)
  for (let i = 0; i < MAX_REDRAW; i++) {
    const buildable = buildableWords(drawn, dict)
    if (buildable.length >= MIN_BUILDABLE && buildable[0].length >= MIN_BEST_LEN) return drawn
    drawn = drawLetters(rand, weights)
  }
  return drawn
}

interface FoundWord {
  word: string
  points: number
  quick: boolean
}

interface EndData {
  score: number
  longest: string | null
  count: number
  isRecord: boolean
  daily: boolean
  skipped: boolean
  xp: number
  solutions: string[]
  foundBest: boolean
  iq: number
}

type ErrorKey = 'short' | 'letters' | 'dict' | 'dup'

/* ================= Composant principal ================= */
export default function LongestWordGame() {
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
  const recordsRef = useProfileStore((s) => s.profile.games[gameId]?.records)
  const records = recordsRef ?? {}
  const bestScore = records['best-score']?.value ?? 0
  const bestLen = records['longest-word']?.value ?? 0

  const [phase, setPhase] = useState<'menu' | 'playing' | 'end'>('menu')
  const [mode, setMode] = useState<'free' | 'daily'>('free')
  const [round, setRound] = useState(0)
  const [letters, setLetters] = useState<string[]>([])
  const [picked, setPicked] = useState<number[]>([])
  const [error, setError] = useState<ErrorKey | null>(null)
  const [shakeNonce, setShakeNonce] = useState(0)
  const [found, setFound] = useState<FoundWord[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_MS)
  const [nineFlash, setNineFlash] = useState<string | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)
  /* Célébration de fin de manche — médaille + étoiles selon la performance. */
  const [burstStars, setBurstStars] = useState(3)
  const [burstKey, setBurstKey] = useState(0)
  const [lastGain, setLastGain] = useState<{ pts: number; quick: boolean; key: number } | null>(null)
  const [announce, setAnnounce] = useState('')
  const [endData, setEndData] = useState<EndData | null>(null)
  const [prevBest, setPrevBest] = useState(0)

  const lettersRef = useRef<string[]>([])
  const pickedRef = useRef<number[]>([])
  const deadlineRef = useRef(0)
  const remainingRef = useRef(ROUND_MS)
  const lastSecondRef = useRef(61)
  const foundRef = useRef<FoundWord[]>([])
  const scoreRef = useRef(0)
  const longestLenRef = useRef(0)
  const endedRef = useRef(false)
  const lastValidAtRef = useRef(0)
  const lastStartRef = useRef(0)
  const flashTimerRef = useRef<number | null>(null)

  /* Effets « juice » (Task 20) — helpers visuels sans re-render, fire-and-forget. */
  const juice = useJuice()
  const tilesBoxRef = useRef<HTMLDivElement>(null)
  const scorePillRef = useRef<HTMLSpanElement>(null)
  /** Indices des pastilles du dernier mot validé (cascade décorative Task 20). */
  const lastWordIdxsRef = useRef<number[]>([])

  const L = {
    fr: {
      freeGame: 'Partie libre',
      freeSub: '9 lettres au hasard, 60 secondes',
      dailyGame: 'Défi du jour',
      dailySub: 'Les mêmes 9 lettres pour tous',
      dailyDone: 'Défi du jour réussi',
      score: 'Score',
      found: 'Mots trouvés',
      noneYet: 'Aucun mot pour l’instant — touchez les lettres !',
      placeholder: 'Touchez les lettres…',
      submit: 'Valider',
      submitAria: 'Valider le mot',
      backspaceAria: 'Effacer la dernière lettre',
      errShort: 'Trop court : 3 lettres minimum.',
      errLetters: 'Lettre indisponible dans le tirage.',
      errDict: 'Ce mot n’est pas dans le dictionnaire.',
      errDup: 'Mot déjà trouvé !',
      endTitle: 'Temps écoulé !',
      endTitleSkip: 'Manche terminée',
      longest: 'Mot le plus long',
      wordsFound: 'mots trouvés',
      playAgain: 'Rejouer',
      menu: 'Menu',
      shareScore: '{n} {m} · meilleur : {w} · {s} points',
      shareDaily: 'Défi du jour — lettres : {l} · {n} {m} · {s} points',
      wordUnitOne: 'mot', wordUnitMany: 'mots',
      newRecord: 'Nouveau record !',
      nineFlash: 'Toutes les lettres ! ×5',
      timeLeft: 'Temps restant',
      play: 'Jouer',
      letters: 'Lettres du tirage',
      solutionTitle: 'Meilleur mot possible',
      otherSolutions: 'Autres mots possibles',
      foundBest: 'Vous avez trouvé le meilleur mot du tirage !',
      noSolution: 'Aucun mot du dictionnaire ne se compose avec ce tirage.',
      quick: 'Rapidité +2',
      skipAria: 'Terminer la manche',
      restartAria: 'Recommencer la manche',
      yourRecords: 'Vos records',
      liveRecord: 'Record battu en direct !',
      xp: 'XP',
      lettersCount: 'lettres',
    },
    en: {
      freeGame: 'Free game',
      freeSub: '9 random letters, 60 seconds',
      dailyGame: 'Daily challenge',
      dailySub: 'The same 9 letters for everyone',
      dailyDone: 'Daily challenge complete',
      score: 'Score',
      found: 'Words found',
      noneYet: 'No words yet — tap the letters!',
      placeholder: 'Tap the letters…',
      submit: 'Submit',
      submitAria: 'Submit the word',
      backspaceAria: 'Delete the last letter',
      errShort: 'Too short: 3 letters minimum.',
      errLetters: 'Letter not available in the draw.',
      errDict: 'This word is not in the dictionary.',
      errDup: 'Word already found!',
      endTitle: "Time's up!",
      endTitleSkip: 'Round over',
      longest: 'Longest word',
      wordsFound: 'words found',
      playAgain: 'Play again',
      menu: 'Menu',
      shareScore: '{n} {m} · best: {w} · {s} points',
      shareDaily: 'Daily challenge — letters: {l} · {n} {m} · {s} points',
      wordUnitOne: 'word', wordUnitMany: 'words',
      newRecord: 'New personal best!',
      nineFlash: 'All nine letters! ×5',
      timeLeft: 'Time left',
      play: 'Play',
      letters: 'Drawn letters',
      solutionTitle: 'Best possible word',
      otherSolutions: 'Other possible words',
      foundBest: 'You found the best word of this draw!',
      noSolution: 'No dictionary word can be built from this draw.',
      quick: 'Quick +2',
      skipAria: 'End the round',
      restartAria: 'Restart the round',
      yourRecords: 'Your records',
      liveRecord: 'Personal best beaten live!',
      xp: 'XP',
      lettersCount: 'letters',
    },
  }[lang]

  const ERROR_TEXT: Record<ErrorKey, string> = {
    short: L.errShort,
    letters: L.errLetters,
    dict: L.errDict,
    dup: L.errDup,
  }

  /* --- Miroirs de refs (jamais de setState synchrone dans un corps d'effet) --- */
  useEffect(() => {
    lettersRef.current = letters
  }, [letters])

  /* --- Nettoyage du minuteur d'animation « 9 lettres » --- */
  useEffect(() => {
    return () => {
      if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current)
    }
  }, [])

  const sortedFound = useMemo(
    () => [...found].sort((a, b) => b.word.length - a.word.length || a.word.localeCompare(b.word)),
    [found],
  )

  const startGame = useCallback(
    (m: 'free' | 'daily') => {
      const now = Date.now()
      if (now - lastStartRef.current < 350) return // anti double-clic sur Jouer / Rejouer
      lastStartRef.current = now
      const dict = wordsFor(lang)
      const weights = lang === 'fr' ? FR_LETTER_WEIGHTS : EN_LETTER_WEIGHTS
      const rand = m === 'daily' ? mulberry32(seedFromString(`${gameId}:${todayKey()}`)) : Math.random
      const drawn = drawPlayableLetters(rand, weights, dict)
      setMode(m)
      setRound((r) => r + 1)
      lettersRef.current = drawn
      setLetters(drawn)
      pickedRef.current = []
      setPicked([])
      setError(null)
      foundRef.current = []
      setFound([])
      scoreRef.current = 0
      setScore(0)
      longestLenRef.current = 0
      endedRef.current = false
      remainingRef.current = ROUND_MS
      lastSecondRef.current = 61
      deadlineRef.current = Date.now() + ROUND_MS
      lastValidAtRef.current = now
      setPrevBest(useProfileStore.getState().profile.games[gameId]?.records?.['best-score']?.value ?? 0)
      setTimeLeft(ROUND_MS)
      setNineFlash(null)
      setLastGain(null)
      setEndData(null)
      setAnnounce('')
      setPhase('playing')
      sfx.play('sweep')
      addPlay(gameId)
    },
    [lang, addPlay],
  )

  /** Fin de manche — appelée depuis le minuteur ou le bouton « Terminer », jamais un effet. */
  const endRound = useCallback(
    (skipped: boolean) => {
      if (endedRef.current) return
      endedRef.current = true
      pickedRef.current = []
      setPicked([])
      const foundWords = foundRef.current
      const sc = scoreRef.current
      const longestLen = longestLenRef.current
      const longest =
        foundWords.length > 0
          ? [...foundWords].sort((a, b) => b.word.length - a.word.length || a.word.localeCompare(b.word))[0].word
          : null
      const sols = buildableWords(lettersRef.current, wordsFor(lang))
      const solutions = sols.slice(0, 6)
      const foundBest = longest !== null && sols.length > 0 && longestLen >= sols[0].length
      /* QI estimé (Task 18) : précision = mots trouvés rapportés au par de
       * 8 mots en 60 s (plancher 0,15), difficulté 2 ; rapidité omise :
       * le temps de la manche est fixe, le rythme est déjà récompensé
       * par le bonus « moins de 5 s entre deux mots ». */
      const iq = computeIq(gameId, { accuracy: clamp(foundWords.length / 8, 0.15, 1), difficulty: 2 })
      let isRecord = false
      if (foundWords.length > 0) {
        isRecord = setBest(gameId, 'best-score', sc) || setBest(gameId, 'longest-word', longestLen)
      }
      const xp = Math.floor(sc / 3)
      addXp(xp)
      // XP du jeu : 10 + 2 × mots trouvés, plafonné à 30.
      addGameXp(gameId, Math.min(30, 10 + 2 * foundWords.length))
      if (foundWords.length >= 5) {
        addWin(gameId)
        sfx.play('win')
        navigator.vibrate?.(20)
      } else if (foundWords.length === 0) {
        sfx.play('lose', { volume: 0.5 })
      } else {
        sfx.play('sweep', { volume: 0.5 })
      }
      if (isRecord) setConfettiKey((k) => k + 1)
      // Étoiles de fin de manche : 3 si le meilleur mot possible du tirage a été
      // trouvé, 2 à partir de 5 mots ou d'un long mot, sinon 1 (manche sans
      // mot : aucune célébration).
      if (foundWords.length > 0) {
        setBurstStars(foundBest ? 3 : foundWords.length >= 5 || longestLen >= 7 ? 2 : 1)
        setBurstKey((k) => k + 1)
      }
      if (mode === 'daily' && foundWords.length >= 1) completeDaily(gameId)
      setEndData({ score: sc, longest, count: foundWords.length, isRecord, daily: mode === 'daily', skipped, xp, solutions, foundBest, iq })
      setPhase('end')
    },
    [addGameXp, mode, lang, setBest, addXp, addWin, completeDaily],
  )

  /* --- Compte à rebours (pause quand l'onglet est masqué) --- */
  useEffect(() => {
    if (phase !== 'playing') return
    const id = window.setInterval(() => {
      if (document.hidden) return
      const rem = Math.max(0, deadlineRef.current - Date.now())
      remainingRef.current = rem
      const whole = Math.ceil(rem / 1000)
      if (whole !== lastSecondRef.current) {
        lastSecondRef.current = whole
        if (whole > 0 && whole <= 5) sfx.play('tick')
      }
      if (rem <= 0) {
        endRound(false)
        return
      }
      setTimeLeft(rem)
    }, 250)
    const onVis = () => {
      if (!document.hidden && !endedRef.current && remainingRef.current > 0) {
        deadlineRef.current = Date.now() + remainingRef.current
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [phase, endRound])

  /* --- Saisie : pastilles --- */
  const pickIndex = useCallback((i: number) => {
    if (endedRef.current) return
    if (pickedRef.current.includes(i) || pickedRef.current.length >= LETTER_COUNT) return
    const next = [...pickedRef.current, i]
    pickedRef.current = next
    setPicked(next)
    setError(null)
    sfx.play('pop', { volume: 0.35 })
  }, [])

  /* --- Saisie : clavier physique (lettre du tirage uniquement) --- */
  const typeLetter = useCallback((ch: string) => {
    if (endedRef.current || pickedRef.current.length >= LETTER_COUNT) return
    const up = ch.toUpperCase()
    const idx = lettersRef.current.findIndex((l, i) => l === up && !pickedRef.current.includes(i))
    if (idx < 0) {
      sfx.play('wrong', { volume: 0.25 })
      setError('letters')
      setShakeNonce((n) => n + 1)
      return
    }
    const next = [...pickedRef.current, idx]
    pickedRef.current = next
    setPicked(next)
    setError(null)
    sfx.play('pop', { volume: 0.35 })
  }, [])

  const removeLast = useCallback(() => {
    if (endedRef.current || pickedRef.current.length === 0) return
    const next = pickedRef.current.slice(0, -1)
    pickedRef.current = next
    setPicked(next)
    setError(null)
    sfx.play('click', { volume: 0.3 })
  }, [])

  /* --- Soumission d'un mot --- */
  const submitWord = useCallback(() => {
    if (endedRef.current) return
    const w = pickedRef.current.map((i) => lettersRef.current[i]).join('')
    if (!w) return
    lastWordIdxsRef.current = pickedRef.current // pour la cascade décorative (Task 20)
    pickedRef.current = []
    setPicked([])
    const fail = (key: ErrorKey) => {
      sfx.play('wrong', { volume: 0.35 })
      navigator.vibrate?.(10)
      setError(key)
      setShakeNonce((n) => n + 1)
    }
    if (w.length < MIN_WORD_LEN) return fail('short')
    if (!wordsFor(lang).has(w.toLowerCase())) return fail('dict')
    if (foundRef.current.some((f) => f.word === w)) return fail('dup')

    const len = w.length
    const quick = Date.now() - lastValidAtRef.current <= QUICK_MS
    lastValidAtRef.current = Date.now()
    const points = wordPoints(len) + (quick ? QUICK_BONUS : 0)
    const next = [...foundRef.current, { word: w, points, quick }]
    foundRef.current = next
    setFound(next)
    scoreRef.current += points
    setScore(scoreRef.current)
    if (len > longestLenRef.current) longestLenRef.current = len
    setError(null)
    setAnnounce(`${w} +${points}`)
    setLastGain({ pts: points, quick, key: next.length })
    sfx.play('correct')
    navigator.vibrate?.(10)

    if (len === 9) {
      unlockBadge('longest-9')
      unlockBadge('longest-7')
      sfx.play('levelup')
      setConfettiKey((k) => k + 1)
      setNineFlash(w)
      if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current)
      flashTimerRef.current = window.setTimeout(() => setNineFlash(null), 2600)
    } else if (len >= 8) {
      sfx.play('coin', { volume: 0.7 })
    }
    if (len >= 7) unlockBadge('longest-7')
  }, [lang, unlockBadge])

  /* Effets « juice » (Task 20) — à chaque mot validé (lastGain change), les
     pastilles du mot bondissent en cascade + pop du pill de score. Purement
     décoratif, fire-and-forget, aucun verrou : le tirage reste immédiatement
     jouable ; le léger décalage laisse finir la restauration des pastilles. */
  useEffect(() => {
    if (!lastGain) return
    const tiles = tilesBoxRef.current?.children
    lastWordIdxsRef.current.forEach((ti, k) => {
      window.setTimeout(() => {
        if (!endedRef.current) juice.pop(tiles?.[ti] as HTMLElement | undefined, 1.12, 280)
      }, 80 + k * 55)
    })
    juice.pop(scorePillRef.current, 1.08, 240)
  }, [lastGain])

  /* --- Clavier physique : lettres, retour arrière, entrée --- */
  useEffect(() => {
    if (phase !== 'playing') return
    const onKey = (e: KeyboardEvent) => {
      if (endedRef.current) return
      const target = e.target as HTMLElement | null
      if (target?.closest?.('[role="dialog"], [role="menu"]')) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Enter') {
        e.preventDefault()
        if (!e.repeat) submitWord()
        return
      }
      if (e.key === 'Backspace') {
        e.preventDefault()
        removeLast()
        return
      }
      if (e.key === ' ') {
        e.preventDefault()
        return
      }
      if (e.key.length !== 1 || e.repeat) return
      const ch = foldAccents(e.key).toLowerCase()
      if (ch < 'a' || ch > 'z') return
      typeLetter(ch)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, submitWord, removeLast, typeLetter])

  const secondsLeft = Math.ceil(timeLeft / 1000)
  const lowTime = secondsLeft <= 10
  const urgent = secondsLeft <= 5
  const liveBest = prevBest > 0 && score > prevBest

  /* ================= Rendu ================= */
  return (
    <div className="relative select-none my-auto w-full">
      <Confetti fire={confettiKey} count={reduce ? 0 : 100} waves={2} gold />
      <VictoryBurst fire={burstKey} stars={burstStars} emoji="🔤" />
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>

      {/* Flash « 9 lettres » */}
      {nineFlash ? (
        <div key={nineFlash} className="anim-score pointer-events-none absolute inset-x-0 top-1/3 z-10 text-center">
          <span className="inline-block rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-display text-xl font-extrabold text-white shadow-xl sm:text-2xl">
            🎉 {nineFlash} — {L.nineFlash}
          </span>
        </div>
      ) : null}

      {/* ===== Écran de menu : boutons d'abord, décoration ensuite ===== */}
      {phase === 'menu' ? (
        <div className="checkerboard rounded-2xl border p-4 sm:p-6">
          <div className="mx-auto flex w-full max-w-sm flex-col gap-2.5">
            {/* Défi QI bienveillant — mis en avant dès l'ouverture (Task 19) */}
            <IqChallengeBanner gameId={gameId} />
            {!dailyDone ? (
              <button
                type="button"
                onClick={() => startGame('daily')}
                className="flex h-12 w-full items-center gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 text-left transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:border-amber-500/25 dark:bg-amber-500/10"
              >
                <CalendarCheck className="h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-amber-700 dark:text-amber-300">
                    {L.dailyGame} — {todayKey()}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{L.dailySub}</span>
                </span>
                <span className="shrink-0 rounded-full bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white">{L.play}</span>
              </button>
            ) : (
              <div className="flex h-12 items-center gap-2 rounded-2xl border border-emerald-300/60 bg-emerald-50/70 px-4 dark:border-emerald-500/25 dark:bg-emerald-500/10">
                <span className="flex min-w-0 flex-1 items-center gap-1.5 truncate text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden="true" /> {L.dailyDone} ✅
                </span>
                <button
                  type="button"
                  onClick={() => startGame('daily')}
                  title={L.playAgain}
                  aria-label={L.playAgain}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => startGame('free')}
              className="flex h-12 w-full items-center gap-3 rounded-2xl border bg-card px-4 text-left transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-400 text-white">
                <Play className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{L.freeGame}</span>
                <span className="block truncate text-xs text-muted-foreground">{L.freeSub}</span>
              </span>
              <span className="shrink-0 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-bold">{L.play}</span>
            </button>
            {hydrated && (bestScore > 0 || bestLen > 0) ? (
              <p title={L.yourRecords} className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-0.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                  <span className="font-bold tabular-nums text-foreground">{bestScore}</span> pts
                </span>
                <span className="flex items-center gap-1">
                  <Type className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="font-bold tabular-nums text-foreground">{bestLen}</span> {L.lettersCount}
                </span>
              </p>
            ) : null}
          </div>
          <div className="mt-5 flex justify-center gap-1" aria-hidden="true">
            {'GRANMED'.split('').map((c, i) => (
              <span
                key={i}
                className={cn(
                  'flex h-9 w-8 items-center justify-center rounded-lg border border-primary/25 bg-card font-display text-base font-extrabold text-primary',
                  reduce ? '' : 'anim-floaty',
                )}
                style={{ animationDelay: `${i * 0.22}s` }}
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">{content.tagline[lang]}</p>
        </div>
      ) : null}

      {/* ===== Manche en cours ===== */}
      {phase === 'playing' ? (
        <div key={round} className="anim-rise">
          {/* HUD compact sur une ligne : score, mots, chrono, défi, recommencer, terminer */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span ref={scorePillRef} className="flex h-9 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-sm font-semibold">
              <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <span className="sr-only">{L.score}</span>
              <span key={score} className="anim-pop-in font-bold tabular-nums">
                {score}
              </span>
            </span>
            <span className="flex h-9 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-sm font-semibold">
              <Type className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">{L.found}</span>
              <span className="font-bold tabular-nums">{found.length}</span>
            </span>
            <span
              role="timer"
              aria-label={`${L.timeLeft}: ${secondsLeft}s`}
              className={cn(
                'flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-bold tabular-nums',
                lowTime
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300'
                  : 'bg-secondary/70 text-foreground',
                urgent ? 'animate-pulse' : '',
              )}
            >
              <Timer className="h-4 w-4" aria-hidden="true" />
              {secondsLeft}s
            </span>
            {mode === 'daily' ? (
              <span className="flex h-9 items-center gap-1.5 rounded-full bg-amber-100 px-3 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{L.dailyGame}</span>
              </span>
            ) : null}
            {liveBest ? (
              <span
                className="flex h-9 items-center gap-1 rounded-full bg-emerald-100 px-2.5 text-sm font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                title={L.liveRecord}
              >
                🔥<span className="sr-only">{L.liveRecord}</span>
              </span>
            ) : null}
            <span className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  sfx.play('click')
                  startGame(mode)
                }}
                title={L.restartAria}
                aria-label={L.restartAria}
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.play('click')
                  endRound(true)
                }}
                title={L.skipAria}
                aria-label={L.skipAria}
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <FastForward className="h-4 w-4" aria-hidden="true" />
              </button>
            </span>
          </div>

          {/* Barre de temps */}
          <div className="mx-auto mt-2 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-secondary" aria-hidden="true">
            <div
              className={cn('h-full rounded-full transition-[width] duration-300 ease-linear', lowTime ? 'bg-rose-400' : 'bg-amber-400')}
              style={{ width: `${Math.max(0, (timeLeft / ROUND_MS) * 100)}%` }}
            />
          </div>

          {/* Lettres tirées : grosses pastilles cliquables (clavier maison, jamais le clavier système) */}
          <div ref={tilesBoxRef} className="mx-auto mt-3 flex flex-wrap justify-center gap-1.5 sm:mt-4 sm:gap-2" role="group" aria-label={L.letters}>
            {letters.map((l, i) => {
              const used = picked.includes(i)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pickIndex(i)}
                  aria-disabled={used}
                  className={cn(
                    'flex h-12 w-12 select-none touch-manipulation items-center justify-center rounded-xl border-2 font-display text-2xl font-extrabold shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95 sm:h-14 sm:w-14 sm:text-3xl',
                    used
                      ? 'scale-90 border-border/50 bg-secondary/40 text-muted-foreground/40'
                      : 'border-primary/25 bg-gradient-to-br from-card to-secondary text-foreground hover:-translate-y-0.5 hover:border-primary/50',
                  )}
                >
                  {l}
                </button>
              )
            })}
          </div>

          {/* Saisie : ⌫ + lettre en cours + ✓ (aucun champ de texte → pas de saut de page, pas de collage) */}
          <div className="relative mx-auto mt-3 flex w-full max-w-md items-stretch gap-1.5">
            {lastGain ? (
              <span
                key={lastGain.key}
                className="anim-score pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 font-display text-lg font-extrabold text-emerald-500"
              >
                +{lastGain.pts}
                {lastGain.quick ? ' ⚡' : ''}
              </span>
            ) : null}
            <button
              type="button"
              onClick={removeLast}
              disabled={picked.length === 0}
              title={L.backspaceAria}
              aria-label={L.backspaceAria}
              className="flex h-12 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl border-2 border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95 disabled:opacity-40"
            >
              <Delete className="h-5 w-5" aria-hidden="true" />
            </button>
            <div
              key={shakeNonce}
              className={cn(
                'flex h-12 min-w-0 flex-1 items-center justify-center gap-0.5 overflow-hidden rounded-xl border-2 bg-card px-2',
                error ? 'anim-shake border-rose-300' : 'border-border',
              )}
            >
              {picked.length === 0 ? (
                <span className="truncate text-sm text-muted-foreground/60">{L.placeholder}</span>
              ) : (
                <>
                  {picked.map((idx, k) => (
                    <span
                      key={k}
                      className="anim-pop-in flex h-9 min-w-0 max-w-8 flex-1 basis-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 font-display text-lg font-extrabold"
                    >
                      {letters[idx]}
                    </span>
                  ))}
                  <span className="ml-0.5 h-6 w-0.5 animate-pulse rounded bg-primary/60" aria-hidden="true" />
                </>
              )}
            </div>
            <button
              type="button"
              onClick={submitWord}
              title={L.submitAria}
              aria-label={L.submitAria}
              className="flex h-12 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95 sm:w-auto sm:gap-1.5 sm:px-5"
            >
              <Check className="h-5 w-5" aria-hidden="true" />
              <span className="hidden text-sm font-bold sm:inline">{L.submit}</span>
            </button>
          </div>

          {/* Raison d'invalidité (hauteur réservée : zéro saut de mise en page) */}
          <div className="mx-auto flex h-5 max-w-md items-center justify-center">
            {error ? (
              <p role="alert" className="truncate text-xs font-semibold text-rose-500">
                {ERROR_TEXT[error]}
              </p>
            ) : null}
          </div>

          {/* Mots trouvés : panneau dédié scrollable, TOUJOURS sous les lettres */}
          <div className="mx-auto w-full max-w-md">
            <div className="flex items-center justify-between px-1 pb-1.5">
              <p className="text-xs font-semibold text-muted-foreground">
                {L.found} · {found.length}
              </p>
              {bestScore > 0 ? (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Trophy className="h-3 w-3 text-amber-500" aria-hidden="true" /> {bestScore}
                </p>
              ) : null}
            </div>
            <div className="nice-scroll flex max-h-[clamp(96px,calc(100dvh_-_480px),176px)] flex-wrap items-start justify-center gap-1.5 overflow-y-auto rounded-xl border bg-secondary/30 p-2">
              {found.length === 0 ? (
                <p className="py-2 text-center text-xs text-muted-foreground/70">{L.noneYet}</p>
              ) : (
                sortedFound.map((f) => <WordPill key={f.word} f={f} quickLabel={L.quick} />)
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* ===== Écran final ===== */}
      {phase === 'end' && endData ? (
        <div
          className="anim-rise rounded-2xl border-2 border-amber-300/60 bg-amber-50/50 p-4 text-center sm:p-6 dark:border-amber-500/30 dark:bg-amber-500/10"
          role="status"
        >
          <p className="font-display text-2xl font-extrabold text-amber-700 dark:text-amber-300">
            {endData.skipped ? `⏭ ${L.endTitleSkip}` : `⏰ ${L.endTitle}`}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <StatPill icon={<Zap className="h-4 w-4" aria-hidden="true" />} label={L.score} value={endData.score} />
            <StatPill icon={<Type className="h-4 w-4" aria-hidden="true" />} label={L.longest} value={endData.longest ?? '—'} />
            <StatPill icon={<Trophy className="h-4 w-4" aria-hidden="true" />} label={L.wordsFound} value={endData.count} />
            <StatPill icon={<Zap className="h-4 w-4" aria-hidden="true" />} label={L.xp} value={`+${endData.xp}`} />
            {endData.isRecord ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Trophy className="h-4 w-4" aria-hidden="true" /> {L.newRecord}
              </span>
            ) : null}
          </div>

          {/* Solution : meilleur mot possible du tirage */}
          {endData.solutions.length > 0 ? (
            <div className="mx-auto mt-3 max-w-md rounded-xl border border-amber-300/50 bg-card/70 p-3">
              <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                {L.solutionTitle} · {endData.solutions[0].length} {L.lettersCount}
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold tracking-wide">{endData.solutions[0]}</p>
              {endData.foundBest ? (
                <p className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">✓ {L.foundBest}</p>
              ) : endData.solutions.length > 1 ? (
                <p className="mt-2 flex flex-wrap items-center justify-center gap-1">
                  <span className="text-xs text-muted-foreground">{L.otherSolutions} :</span>
                  {endData.solutions.slice(1).map((w) => (
                    <span key={w} className="rounded-full border bg-secondary/60 px-2 py-0.5 text-xs font-bold">
                      {w}
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">{L.noSolution}</p>
          )}

          {/* Rejouer immédiatement visible, récapitulatif scrollable ensuite */}
          <div className="mt-4 flex flex-col items-center gap-2.5">
            <RoundEndActions
              gameId={gameId}
              onReplay={() => startGame(mode)}
              replayLabel={L.playAgain}
              iq={endData.iq}
              shareResult={(endData.daily && letters.length > 0 ? L.shareDaily : L.shareScore)
                .replace('{l}', letters.join(' '))
                .replace('{n}', String(endData.count))
                .replace('{m}', endData.count === 1 ? L.wordUnitOne : L.wordUnitMany)
                .replace('{w}', endData.longest ?? '—')
                .replace('{s}', String(endData.score))}
            />
            <div className="flex flex-wrap justify-center gap-2.5">
              <Button size="lg" variant="secondary" className="rounded-full" onClick={() => { sfx.play('click'); setPhase('menu') }}>
                <Home className="h-4 w-4" aria-hidden="true" /> {L.menu}
              </Button>
            </div>
          </div>

          {endData.count > 0 ? (
            <div className="mx-auto mt-4 max-w-md">
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                {L.found} · {endData.count}
              </p>
              <div className="nice-scroll flex max-h-36 flex-wrap items-start justify-center gap-1.5 overflow-y-auto rounded-xl border bg-secondary/30 p-2">
                {sortedFound.map((f) => (
                  <WordPill key={f.word} f={f} quickLabel={L.quick} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

/** Pastille d'un mot trouvé, colorée selon la longueur (8 = ambré, 9 = doré). */
function WordPill({ f, quickLabel }: { f: FoundWord; quickLabel: string }) {
  return (
    <span
      title={f.quick ? quickLabel : undefined}
      className={cn(
        'anim-pop-in rounded-full border px-2.5 py-1 text-sm font-bold',
        f.word.length === 9
          ? 'border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white'
          : f.word.length === 8
            ? 'border-amber-400 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
            : f.word.length === 7
              ? 'border-orange-300 bg-orange-100 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/20 dark:text-orange-300'
              : 'border-border bg-secondary/70 text-foreground',
      )}
    >
      {f.word}
      <span className="ms-1 text-xs opacity-70">
        {f.points}
        {f.quick ? ' ⚡' : ''}
      </span>
    </span>
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
