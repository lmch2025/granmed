'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, RotateCcw, CalendarCheck, Timer, Trophy, Flame, Target, Crosshair, Delete, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, mulberry32, seedFromString, useReducedMotion } from '@/lib/utils-game'
import { computeIq } from '@/lib/games/iq'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'

export const gameId = 'speed-math'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Tapez les bonnes réponses sur le pavé numérique : 60 secondes, bonus de série et fourchettes qui s’adaptent à vous — et un QI estimé en fin de sprint.',
    en: 'Type the right answers on the number pad: 60 seconds, streak bonuses and ranges that adapt to you — plus an estimated IQ at the end of each sprint.',
  },
  description: {
    fr: [
      'Calcul Éclair est un jeu de calcul mental chronométré : pendant 60 secondes, les opérations s’enchaînent et vous tapez chaque résultat sur un grand pavé numérique pensé pour le pouce. La bonne réponse se valide automatiquement dès qu’elle est exacte ; chaque succès rapporte 10 points, augmentés d’un bonus quand votre série s’allonge (jusqu’à +20 au-delà de 10 bonnes réponses d’affilée).',
      'Trois niveaux sont proposés : Facile (additions et soustractions), Moyen (avec les tables de multiplication) et Difficile (toutes les opérations, divisions au résultat entier garanti). Tous les cinq succès consécutifs, les fourchettes de nombres s’élargissent légèrement : le jeu s’adapte à votre niveau. En fin de sprint, un QI estimé — calculé à partir de votre précision, de votre rapidité et de la difficulté choisie — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'Un sprint terminé enregistre votre score et votre nombre de bonnes réponses comme records, débloque des succès (25 et 40 bonnes réponses) et, chaque jour, un défi du jour propose la même série de calculs à tous les joueurs. Le chrono se met même en pause si vous changez d’onglet en cours de sprint.',
    ],
    en: [
      'Speed Math is a timed mental-arithmetic game: for 60 seconds, operations come one after another and you type each result on a large thumb-friendly number pad. The right answer validates itself as soon as it is exact; each success earns 10 points, topped up with a bonus as your streak grows (up to +20 beyond 10 correct answers in a row).',
      'Three levels are offered: Easy (additions and subtractions), Medium (with multiplication tables) and Hard (all operations, with divisions guaranteed to have whole-number results). Every five correct answers in a row, the number ranges widen slightly: the game adapts to your level. At the end of each sprint, an estimated IQ — computed from your accuracy, speed and chosen difficulty — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'A finished sprint saves your score and your correct-answer count as records, unlocks achievements (25 and 40 correct answers) and, every day, a daily challenge offers the same calculations to every player. The clock even pauses if you switch tabs mid-sprint.',
    ],
  },
  rules: {
    fr: [
      'Choisissez une difficulté : Facile, Moyen ou Difficile — ou lancez le défi du jour.',
      'Le sprint dure 60 secondes et démarre dès la première question.',
      'Tapez le résultat sur le pavé : la bonne réponse se valide automatiquement dès qu’elle est exacte.',
      'Bonne réponse : +10 points, +5 / +10 / +20 de bonus à partir de 3 / 6 / 10 bonnes réponses d’affilée.',
      'Mauvaise réponse ou validation prématurée : la série retombe à zéro et la bonne réponse s’affiche brièvement.',
      'À la fin du chrono : score, bonnes réponses, meilleure série et précision sont enregistrés.',
    ],
    en: [
      'Pick a difficulty: Easy, Medium or Hard — or start the daily challenge.',
      'The sprint lasts 60 seconds and starts with the first question.',
      'Type the result on the pad: the right answer validates itself as soon as it is exact.',
      'Correct answer: +10 points, +5 / +10 / +20 bonus from 3 / 6 / 10 correct answers in a row.',
      'Wrong or premature answer: the streak falls back to zero and the right answer is briefly shown.',
      'When the clock ends: score, correct answers, best streak and accuracy are recorded.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : tapez la réponse sur le pavé numérique 3×4 (grandes touches d’au moins 48 px).',
      'Ordinateur : chiffres 0 à 9 au clavier, Retour arrière pour effacer, Entrée pour valider.',
      'La barre de temps se vide au fil du sprint ; un tic sonore retentit sur les 5 dernières secondes.',
      'Le chrono se met en pause quand vous changez d’onglet, puis reprend sans perdre une seconde.',
    ],
    en: [
      'Mobile & tablet: type the answer on the 3×4 number pad (large keys of at least 48 px).',
      'Desktop: digits 0 to 9 on the keyboard, Backspace to erase, Enter to submit.',
      'The time bar empties as the sprint goes; a ticking sound rings out over the last 5 seconds.',
      'The clock pauses when you switch tabs, then resumes without losing a second.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      '3 difficultés : Facile, Moyen, Difficile (divisions à résultat entier)',
      'Difficulté adaptative : les fourchettes grandissent tous les 5 succès consécutifs',
      'Pavé numérique géant 3×4 et clavier physique pris en charge',
      'Bonus de série avec compteur de flammes animé et paliers sonores',
      'Barre de temps de 60 s, tic-tac et pulsation sur les 5 dernières secondes',
      'Records de score et de bonnes réponses, succès 25 et 40',
      'Défi du jour : la même série de calculs pour tous les joueurs',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      '3 difficulties: Easy, Medium, Hard (whole-number divisions)',
      'Adaptive difficulty: ranges grow every 5 correct answers in a row',
      'Giant 3×4 number pad and physical keyboard support',
      'Streak bonuses with an animated flame counter and sound milestones',
      '60-second time bar, ticking and pulsing over the last 5 seconds',
      'Score and correct-answer records, 25 and 40 achievements',
      'Daily challenge: the same calculation series for every player',
    ],
  },
  tips: {
    fr: [
      'Visez la régularité plutôt que la vitesse : une erreur coûte la série ET 0,7 seconde d’affichage de la réponse.',
      'Pour multiplier par 9, multipliez par 10 puis retirez le nombre : 7 × 9 = 70 − 7 = 63.',
      'Pour diviser, pensez « combien de fois » : 56 ÷ 7, comptez 7, 14, 21… jusqu’à 56 : huit fois.',
      'Décomposez les grands calculs : 47 + 38, c’est 47 + 40 − 2 = 85 — plus vite tapé que posé.',
    ],
    en: [
      'Aim for consistency over speed: one mistake costs your streak AND 0.7 seconds while the answer is shown.',
      'To multiply by 9, multiply by 10 then subtract the number: 7 × 9 = 70 − 7 = 63.',
      'To divide, think “how many times”: for 56 ÷ 7, count 7, 14, 21… up to 56: eight times.',
      'Break big sums down: 47 + 38 is 47 + 40 − 2 = 85 — faster typed than worked out on paper.',
    ],
  },
  faq: {
    fr: [
      { q: 'Les divisions tombent-elles toujours juste ?', a: 'Oui : en difficulté Difficile, chaque division est construite à partir du diviseur et du quotient, donc le résultat est toujours un nombre entier.' },
      { q: 'Comment fonctionne la difficulté adaptative ?', a: 'Tous les 5 succès consécutifs, les nombres des opérations suivantes s’étendent légèrement (par exemple jusqu’à 20+3 par tranche en Facile). Une erreur ramène la fourchette au niveau de votre série actuelle.' },
      { q: 'Comment les points sont-ils calculés ?', a: 'Chaque bonne réponse vaut 10 points, plus 5 à partir de 3 bonnes réponses consécutives, 10 à partir de 6, et 20 à partir de 10. Le score final rapporte la moitié de sa valeur en XP.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé combine trois dimensions mesurées pendant le sprint : la précision (bonnes réponses par rapport aux réponses soumises), la rapidité (20 bonnes réponses en 60 secondes servant de rythme de référence) et la difficulté (Facile, Moyen ou Difficile). Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu de calcul mental — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour gagner en justesse et en vitesse.' },
      { q: 'Faut-il appuyer sur Valider à chaque fois ?', a: 'Non : dès que le nombre tapé est exact, la réponse se valide toute seule. Le bouton Valider sert à soumettre une réponse plus courte, ou à révéler la solution quand on est bloqué.' },
      { q: 'Le défi du jour est-il identique pour tous ?', a: 'Oui : sa difficulté et sa série de calculs sont générées de façon déterministe à partir de la date. Tous les joueurs voient les mêmes opérations jusqu’au lendemain.' },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui : le pavé numérique 3×4 offre de grandes touches pensées pour le pouce, et le clavier virtuel du système n’est jamais appelé.' },
    ],
    en: [
      { q: 'Do divisions always come out even?', a: 'Yes: in Hard difficulty, every division is built from the divisor and the quotient, so the result is always a whole number.' },
      { q: 'How does adaptive difficulty work?', a: 'Every 5 correct answers in a row, the numbers of the following operations stretch slightly (for example up to 20+3 per step in Easy). A mistake brings the range back to your current streak level.' },
      { q: 'How are points calculated?', a: 'Each correct answer is worth 10 points, plus 5 from 3 correct answers in a row, 10 from 6, and 20 from 10. The final score earns half its value in XP.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ combines three dimensions measured during the sprint: accuracy (correct answers relative to submitted answers), speed (20 correct answers in 60 seconds as the reference pace) and difficulty (Easy, Medium or Hard). The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this mental-arithmetic game — not a clinical IQ test — and the best way to raise it is to keep playing for accuracy and pace.' },
      { q: 'Do I have to press Submit every time?', a: 'No: as soon as the typed number is exact, the answer validates itself. The Submit button is there to send a shorter answer, or to reveal the solution when you are stuck.' },
      { q: 'Is the daily challenge identical for everyone?', a: 'Yes: its difficulty and calculation series are generated deterministically from the date. Every player sees the same operations until tomorrow.' },
      { q: 'Can I play on my phone?', a: 'Yes: the 3×4 number pad offers large thumb-friendly keys, and the system’s virtual keyboard is never summoned.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-score': { fr: 'Meilleur score (60 s)', en: 'Best score (60 s)' },
    'best-correct': { fr: 'Bonnes réponses (60 s)', en: 'Correct answers (60 s)' },
  },
}

/* ================= Données de jeu ================= */
type Diff = 'easy' | 'medium' | 'hard'
type Op = '+' | '-' | '×' | '÷'

interface Q {
  a: number
  op: Op
  b: number
  answer: number
}

const SPRINT_MS = 60000
/** Les réponses de toutes les difficultés tiennent sur 3 chiffres. */
const MAX_DIGITS = 3
/** Pavé 3×4 : 1-9, effacer, 0, valider. */
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0', 'ok'] as const

function makeQuestion(diff: Diff, boost: number, rand: () => number): Q {
  const ri = (lo: number, hi: number) => lo + Math.floor(rand() * (hi - lo + 1))
  let a = 0
  let b = 0
  let op: Op = '+'
  if (diff === 'easy') {
    op = rand() < 0.5 ? '+' : '-'
    a = ri(2, 20 + boost * 3)
    b = ri(2, 20 + boost * 3)
    if (op === '-' && b > a) [a, b] = [b, a]
  } else if (diff === 'medium') {
    const r = rand()
    if (r < 0.35) {
      op = '+'
      a = ri(2, 30 + boost * 4)
      b = ri(2, 30 + boost * 4)
    } else if (r < 0.7) {
      op = '-'
      a = ri(2, 30 + boost * 4)
      b = ri(2, 30 + boost * 4)
      if (b > a) [a, b] = [b, a]
    } else {
      op = '×'
      a = ri(2, 9)
      b = ri(2, 9 + boost)
    }
  } else {
    const r = rand()
    if (r < 0.25) {
      op = '+'
      a = ri(5, 60 + boost * 5)
      b = ri(5, 60 + boost * 5)
    } else if (r < 0.5) {
      op = '-'
      a = ri(5, 60 + boost * 5)
      b = ri(5, 60 + boost * 5)
      if (b > a) [a, b] = [b, a]
    } else if (r < 0.75) {
      op = '×'
      a = ri(3, 12)
      b = ri(3, 9)
    } else {
      // Division toujours exacte : construite à partir du quotient.
      op = '÷'
      b = ri(2, 9)
      const quotient = ri(2, 12 + boost * 2)
      a = b * quotient
    }
  }
  const answer = op === '+' ? a + b : op === '-' ? a - b : op === '×' ? a * b : a / b
  return { a, op, b, answer }
}

/** Série déterministe du défi du jour (difficulté tirée de la graine). */
function dailySeries(): { diff: Diff; questions: Q[] } {
  const rand = mulberry32(seedFromString(`${gameId}:${todayKey()}`))
  const diff: Diff = (['easy', 'medium', 'hard'] as Diff[])[Math.floor(rand() * 3)]
  const questions = Array.from({ length: 240 }, (_, i) => makeQuestion(diff, Math.floor(i / 12), rand))
  return { diff, questions }
}

/* ================= Composant principal ================= */
export default function SpeedMathGame() {
  const t = useT()
  const lang = useLang()
  const reduce = useReducedMotion()
  const dailyDone = useIsDailyDone(gameId)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)
  const records = useProfileStore((s) => s.profile.games[gameId]?.records)

  const [diff, setDiff] = useState<Diff>('medium')
  const [dailyMode, setDailyMode] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [q, setQ] = useState<Q | null>(null)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [typed, setTyped] = useState('')
  const [feedback, setFeedback] = useState<{ ok: boolean; picked: number } | null>(null)
  const [feedSeq, setFeedSeq] = useState(0)
  const [gain, setGain] = useState<{ amount: number; seq: number } | null>(null)
  const [timeLeft, setTimeLeft] = useState(SPRINT_MS)
  const [over, setOver] = useState<{ score: number; correct: number; bestStreak: number; accuracy: number; isRecord: boolean; iq: number } | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)

  const phaseRef = useRef<'idle' | 'playing' | 'over'>('idle')
  const endRef = useRef(0)
  const lastSecRef = useRef(61)
  const streakRef = useRef(0)
  const statsRef = useRef({ score: 0, correct: 0, wrong: 0, bestStreak: 0 })
  const qRef = useRef<Q | null>(null)
  const typedRef = useRef('')
  const lockRef = useRef(false)
  const dailyQsRef = useRef<Q[] | null>(null)
  const qIdxRef = useRef(0)
  const dailyModeRef = useRef(false)
  const diffRef = useRef<Diff>('medium')
  const pendingTRef = useRef(0)
  const startAtRef = useRef(0)
  const hideAtRef = useRef(0)

  /* Défi du jour : calculé une seule fois par date (jamais à chaque rendu). */
  const dailyKey = todayKey()
  const dailyConfig = useMemo(() => dailySeries(), [dailyKey])
  /* Date lisible et localisée pour la bannière du défi (jamais la clé ISO brute). */
  const dailyDateLabel = useMemo(
    () => new Date(`${dailyKey}T12:00:00`).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long' }),
    [dailyKey, lang],
  )

  const L = {
    fr: {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
      dailyDiff: 'Difficulté du jour',
      streakLabel: 'Série',
      correctLabel: 'Bonnes réponses',
      bestStreak: 'Meilleure série',
      accuracy: 'Précision',
      wellDone: 'Sprint terminé !',
      points: 'points',
      keypad: 'Pavé numérique',
      clear: 'Effacer',
      submitKey: 'Valider',
      yourBest: 'Votre record',
    },
    en: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      dailyDiff: 'Difficulty of the day',
      streakLabel: 'Streak',
      correctLabel: 'Correct answers',
      bestStreak: 'Best streak',
      accuracy: 'Accuracy',
      wellDone: 'Sprint complete!',
      points: 'points',
      keypad: 'Number pad',
      clear: 'Clear',
      submitKey: 'Submit',
      yourBest: 'Your best',
    },
  }[lang]

  const diffLabel = (d: Diff) => (d === 'easy' ? L.easy : d === 'medium' ? L.medium : L.hard)
  const bestScore = records?.['best-score']?.value

  function goPhase(p: 'idle' | 'playing' | 'over') {
    phaseRef.current = p
    setPhase(p)
  }

  function nextQuestion() {
    setFeedback(null)
    typedRef.current = ''
    setTyped('')
    if (dailyQsRef.current) {
      const list = dailyQsRef.current
      const nq = list[qIdxRef.current % list.length]
      qIdxRef.current++
      qRef.current = nq
      setQ(nq)
    } else {
      const nq = makeQuestion(diffRef.current, Math.floor(streakRef.current / 5), Math.random)
      qRef.current = nq
      setQ(nq)
    }
  }

  function start(d: Diff, daily = false) {
    const now = Date.now()
    if (now - startAtRef.current < 400) return // anti double-clic
    startAtRef.current = now
    if (pendingTRef.current) {
      window.clearTimeout(pendingTRef.current)
      pendingTRef.current = 0
    }
    lockRef.current = false
    setDailyMode(daily)
    dailyModeRef.current = daily
    statsRef.current = { score: 0, correct: 0, wrong: 0, bestStreak: 0 }
    streakRef.current = 0
    setScore(0)
    setCorrect(0)
    setStreak(0)
    setFeedback(null)
    setGain(null)
    typedRef.current = ''
    setTyped('')
    setOver(null)
    setTimeLeft(SPRINT_MS)
    lastSecRef.current = 61
    hideAtRef.current = 0
    if (daily) {
      dailyQsRef.current = dailyConfig.questions
      qIdxRef.current = 1
      qRef.current = dailyConfig.questions[0]
      setQ(dailyConfig.questions[0])
    } else {
      dailyQsRef.current = null
      qIdxRef.current = 0
      diffRef.current = d
      const first = makeQuestion(d, 0, Math.random)
      qRef.current = first
      setQ(first)
    }
    endRef.current = Date.now() + SPRINT_MS
    goPhase('playing')
    addPlay(gameId)
  }

  /** Fin de sprint — appelée depuis le callback du chrono (jamais depuis un effet). */
  function finish() {
    if (phaseRef.current !== 'playing' || document.hidden) return
    goPhase('over')
    const s = statsRef.current
    const total = s.correct + s.wrong
    const acc = total ? s.correct / total : 0
    const accuracy = Math.round(acc * 100)
    /* QI estimé (Task 18) : précision = bonnes/répondues, rapidité = 20 bonnes
     * réponses attendues en 60 s, difficulté = Facile 1 / Moyen 2 / Difficile 3
     * (mode effectif du sprint, défi du jour compris). */
    const effDiff: Diff = dailyModeRef.current ? dailyConfig.diff : diffRef.current
    const speed = Math.min(2.2, Math.max(0.5, s.correct / 20))
    const difficulty: 1 | 2 | 3 = effDiff === 'easy' ? 1 : effDiff === 'hard' ? 3 : 2
    const iq = computeIq(gameId, { accuracy: acc, speed, difficulty })
    const rec1 = setBest(gameId, 'best-score', s.score)
    const rec2 = setBest(gameId, 'best-correct', s.correct)
    setOver({ score: s.score, correct: s.correct, bestStreak: s.bestStreak, accuracy, isRecord: rec1 || rec2, iq })
    setConfettiKey((k) => k + 1)
    setBurstKey((k) => k + 1)
    sfx.play('win')
    addWin(gameId)
    addXp(Math.round(s.score / 2))
    addGameXp(gameId, Math.min(30, 10 + s.correct))
    if (s.correct >= 25) unlockBadge('math-25')
    if (s.correct >= 40) unlockBadge('math-40')
    if (dailyModeRef.current) completeDaily(gameId)
  }

  function submit(v: number) {
    const cur = qRef.current
    if (!cur || lockRef.current || phaseRef.current !== 'playing') return
    const ok = v === cur.answer
    lockRef.current = true
    if (ok) {
      sfx.play('correct', { volume: 0.7 })
      navigator.vibrate?.(10)
      streakRef.current += 1
      const ns = streakRef.current
      if (ns === 3 || ns === 6 || ns === 10) sfx.play('coin', { volume: 0.6 })
      const bonus = ns >= 10 ? 20 : ns >= 6 ? 10 : ns >= 3 ? 5 : 0
      const amount = 10 + bonus
      statsRef.current.score += amount
      statsRef.current.correct += 1
      statsRef.current.bestStreak = Math.max(statsRef.current.bestStreak, ns)
      setScore(statsRef.current.score)
      setCorrect(statsRef.current.correct)
      setStreak(ns)
      setGain({ amount, seq: statsRef.current.correct })
    } else {
      sfx.play('wrong', { volume: 0.4 })
      navigator.vibrate?.(20)
      streakRef.current = 0
      statsRef.current.wrong += 1
      setStreak(0)
    }
    setFeedSeq((n) => n + 1)
    setFeedback({ ok, picked: v })
    pendingTRef.current = window.setTimeout(() => {
      pendingTRef.current = 0
      lockRef.current = false
      if (phaseRef.current === 'playing') nextQuestion()
    }, ok ? 280 : 700)
  }

  function pressKey(k: string) {
    if (phaseRef.current !== 'playing' || lockRef.current) return
    if (typedRef.current.length >= MAX_DIGITS) return
    const next = typedRef.current + k
    typedRef.current = next
    setTyped(next)
    sfx.play('click', { volume: 0.35 })
    const cur = qRef.current
    // Auto-validation : la bonne réponse complète se valide toute seule.
    if (cur && Number(next) === cur.answer) submit(Number(next))
  }

  function backspace() {
    if (phaseRef.current !== 'playing' || lockRef.current) return
    if (!typedRef.current) return
    typedRef.current = typedRef.current.slice(0, -1)
    setTyped(typedRef.current)
    sfx.play('swish', { volume: 0.3 })
  }

  function confirmEntry() {
    if (phaseRef.current !== 'playing' || lockRef.current) return
    const v = typedRef.current
    if (!v) return
    submit(Number(v))
  }

  function backToMenu() {
    goPhase('idle')
    setDailyMode(false)
    dailyModeRef.current = false
  }

  /* Chronomètre : barre de temps, tic-tac sur les 5 dernières secondes.
     Les setState vivent dans le callback d'interval (jamais dans le corps d'effet). */
  useEffect(() => {
    if (phase !== 'playing') return
    const id = window.setInterval(() => {
      if (document.hidden) return // onglet caché : le sprint est en pause
      const remaining = endRef.current - Date.now()
      setTimeLeft(Math.max(0, remaining))
      const whole = Math.ceil(remaining / 1000)
      if (whole < lastSecRef.current && whole <= 5 && whole >= 1) sfx.play('tick', { volume: 0.5 })
      lastSecRef.current = whole
      if (remaining <= 0) finish()
    }, 100)
    return () => window.clearInterval(id)
  }, [phase])

  /* Pause automatique : le temps caché est rendu au retour sur l'onglet. */
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        if (phaseRef.current === 'playing') hideAtRef.current = Date.now()
      } else if (hideAtRef.current) {
        endRef.current += Date.now() - hideAtRef.current
        hideAtRef.current = 0
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  /* Clavier physique : chiffres, Retour arrière, Entrée (les handlers ne lisent que des refs). */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'playing' || e.repeat) return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const target = e.target as HTMLElement | null
      // Ne rien saisir si un dialogue (règles, records…) a le focus.
      if (target?.closest('[role="dialog"], [data-radix-popper-content-wrapper]')) return
      if (e.key === 'Enter' || e.key === 'Backspace') {
        // Ne pas court-circuiter un bouton ciblé au clavier (ex. Rejouer).
        if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
        e.preventDefault()
        if (e.key === 'Backspace') backspace()
        else confirmEntry()
        return
      }
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault()
        pressKey(e.key)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* Filet de propreté : jamais de timer fantôme après démontage. */
  useEffect(() => () => {
    if (pendingTRef.current) window.clearTimeout(pendingTRef.current)
  }, [])

  const timePct = Math.max(0, Math.min(100, (timeLeft / SPRINT_MS) * 100))
  const lowTime = timeLeft <= 5000
  const inPlayDiff = dailyMode ? dailyConfig.diff : diff

  return (
    <div className="relative my-auto w-full select-none">
      {/* Barre de configuration — visible uniquement au repos, bouton Jouer immédiat */}
      {phase === 'idle' ? (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('common.difficulty')}>
            {(['easy', 'medium', 'hard'] as Diff[]).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={diff === d && !dailyMode}
                onClick={() => {
                  sfx.play('click', { volume: 0.5 })
                  setDiff(d)
                  diffRef.current = d
                  setDailyMode(false)
                  dailyModeRef.current = false
                }}
                className={cn(
                  'h-11 rounded-full border px-4 text-xs font-bold transition-all sm:text-sm',
                  diff === d && !dailyMode
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {diffLabel(d)}
              </button>
            ))}
          </div>
          <Button
            size="lg"
            className="anim-glow ms-auto h-11 rounded-full px-5"
            onClick={() => {
              sfx.play('pop')
              start(diff)
            }}
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            {t('common.play')}
          </Button>
        </div>
      ) : null}

      {/* Bouton défi du jour (hors partie, tant qu'il n'est pas réussi) */}
      {phase !== 'playing' && !dailyDone ? (
        <button
          type="button"
          onClick={() => {
            sfx.play('pop')
            start(dailyConfig.diff, true)
          }}
          className={cn(
            'mb-3 flex w-full items-center gap-2.5 rounded-2xl border border-amber-300/60 bg-amber-50 px-3 py-2.5 text-left',
            'transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-ring dark:border-amber-500/25 dark:bg-amber-500/10',
          )}
        >
          <span className="text-xl" aria-hidden="true">
            🎁
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-amber-700 dark:text-amber-300">
              {t('common.daily')} · {dailyDateLabel}
            </span>
            <span className="block text-xs text-muted-foreground">
              {L.dailyDiff} : {diffLabel(dailyConfig.diff)} · 60 s
            </span>
          </span>
          <span className="rounded-full bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white">{t('game.startDaily')}</span>
        </button>
      ) : null}

      {/* Écran d'accueil compact */}
      {phase === 'idle' ? (
        <div className="checkerboard flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-center sm:min-h-[240px]">
          <div className="flex gap-1.5 font-display text-3xl font-black sm:gap-2 sm:text-4xl" aria-hidden="true">
            {['7', '+', '8', '=', '15'].map((e, i) => (
              <span key={i} className="anim-floaty text-primary" style={{ animationDelay: `${i * 0.3}s` }}>
                {e}
              </span>
            ))}
          </div>
          <p className="max-w-md text-xs text-muted-foreground sm:text-sm">{content.tagline[lang]}</p>
          {bestScore !== undefined ? (
            <span className="flex h-9 items-center gap-1.5 rounded-full bg-amber-100 px-3 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> {L.yourBest} : {bestScore} {L.points}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* En partie : HUD + timer + opération + pavé — tout tient sans scroll */}
      {phase === 'playing' && q ? (
        <div className="touch-manipulation">
          {/* HUD compact */}
          <div className="mb-2 flex items-center gap-1.5 sm:gap-2">
            <span className="relative flex h-10 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-sm font-bold tabular-nums" title={t('common.score')}>
              <Target className="h-4 w-4 text-primary" aria-hidden="true" />
              <span key={score} className="anim-pop-in">
                {score}
              </span>
              {gain ? (
                <span key={gain.seq} className="anim-score pointer-events-none absolute -top-2 end-2 text-xs font-black text-emerald-600 dark:text-emerald-400" aria-hidden="true">
                  +{gain.amount}
                </span>
              ) : null}
            </span>
            <span className="flex h-10 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-sm font-semibold tabular-nums text-muted-foreground" title={L.correctLabel}>
              <Crosshair className="h-4 w-4" aria-hidden="true" />
              {correct}
            </span>
            <span
              key={streak}
              title={t('common.streak')}
              className={cn(
                'flex h-10 items-center gap-1 rounded-full px-2.5 text-sm font-bold tabular-nums',
                streak >= 3
                  ? 'anim-pop-in bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
                  : 'bg-secondary/70 text-muted-foreground',
              )}
            >
              <Flame className="h-4 w-4" aria-hidden="true" />×{streak}
            </span>
            {dailyMode ? (
              <span
                title={t('common.daily')}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              </span>
            ) : null}
            <Button
              variant="secondary"
              size="sm"
              className="ms-auto h-11 w-11 rounded-full p-0"
              aria-label={t('common.restart')}
              onClick={() => {
                sfx.play('click')
                start(inPlayDiff, dailyMode)
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          {/* Timer en fine barre */}
          <div className="mb-2 flex items-center gap-2">
            <span
              className={cn(
                'flex w-11 shrink-0 items-center justify-end text-sm font-bold tabular-nums',
                lowTime ? 'animate-pulse text-red-600 dark:text-red-400' : 'text-muted-foreground',
              )}
            >
              <Timer className="me-1 h-4 w-4 shrink-0" aria-hidden="true" />
              {Math.max(0, Math.ceil(timeLeft / 1000))}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(timePct)}>
              <div
                className={cn(
                  'h-full rounded-full transition-[width] duration-100 ease-linear',
                  lowTime ? 'animate-pulse bg-red-500' : 'bg-gradient-to-r from-amber-400 to-orange-500',
                )}
                style={{ width: `${timePct}%` }}
              />
            </div>
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{diffLabel(inPlayDiff)}</span>
          </div>

          {/* Opération en gros + saisie */}
          <div className="mb-1 text-center">
            <p
              className={cn(
                'whitespace-nowrap font-display text-[clamp(2.25rem,10vw,4rem)] font-black leading-none tabular-nums',
                feedback && !feedback.ok && 'anim-shake',
              )}
            >
              {q.a} <span className="text-primary">{q.op}</span> {q.b} ={' '}
              {feedback ? (
                <span key={feedSeq} className="anim-pop-in text-emerald-600 dark:text-emerald-400">
                  {feedback.ok ? feedback.picked : q.answer}
                </span>
              ) : (
                <>
                  <span className={typed ? undefined : 'text-muted-foreground/50'}>{typed || '?'}</span>
                  <span aria-hidden="true" className="ms-1 inline-block h-[0.75em] w-[3px] translate-y-[0.05em] animate-pulse rounded-full bg-primary" />
                </>
              )}
            </p>
          </div>
          {/* Ligne de correction (hauteur réservée : aucun saut de layout) */}
          <div className="mb-2 h-5" aria-hidden="true">
            {feedback && !feedback.ok ? (
              <p className="anim-pop-in text-center text-sm font-bold tabular-nums text-red-600 dark:text-red-400">✕ {feedback.picked}</p>
            ) : null}
          </div>

          {/* Annonces lecteur d'écran : question puis résultat, jamais les frappes */}
          <span role="status" className="sr-only">
            {feedback ? (feedback.ok ? `✓ ${feedback.picked}` : `✕ ${q.answer}`) : `${q.a} ${q.op} ${q.b}`}
          </span>

          {/* Pavé numérique 3×4 — touches ≥ 48 px, verrouillé pendant le feedback */}
          <div className="mx-auto grid w-full max-w-[21rem] grid-cols-3 gap-2" role="group" aria-label={L.keypad}>
            {KEYS.map((k) => {
              if (k === 'back') {
                return (
                  <button key={k} type="button" aria-label={L.clear} disabled={!!feedback} onClick={backspace} className={keyClass('back')}>
                    <Delete className="h-6 w-6" aria-hidden="true" />
                  </button>
                )
              }
              if (k === 'ok') {
                return (
                  <button key={k} type="button" aria-label={L.submitKey} disabled={!!feedback} onClick={confirmEntry} className={keyClass('ok')}>
                    <Check className="h-6 w-6" aria-hidden="true" />
                  </button>
                )
              }
              return (
                <button key={k} type="button" disabled={!!feedback} onClick={() => pressKey(k)} className={keyClass('digit')}>
                  {k}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* Écran de fin : stats + Rejouer immédiat */}
      {phase === 'over' && over ? (
        <div
          className="anim-rise relative overflow-hidden rounded-2xl border-2 border-emerald-300/60 bg-emerald-50/60 p-4 text-center sm:p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          role="status"
        >
          <Confetti fire={confettiKey} count={reduce ? 0 : 110} waves={2} gold />
          <VictoryBurst
            fire={burstKey}
            stars={over.correct >= 20 ? 3 : over.correct >= 12 ? 2 : 1}
            sub={`${over.score} ${L.points} · ${over.accuracy}%`}
          />
          <p className="font-display text-xl font-extrabold text-emerald-700 dark:text-emerald-300 sm:text-2xl">⚡ {L.wellDone}</p>
          <p className="mt-1 font-display text-5xl font-black tabular-nums">
            {over.score} <span className="text-base font-bold text-muted-foreground">{L.points}</span>
          </p>
          <div className="mt-3 grid grid-cols-2 justify-items-center gap-2 sm:flex sm:flex-wrap sm:justify-center">
            <StatPill icon={<Crosshair className="h-4 w-4" aria-hidden="true" />} label={L.correctLabel} value={over.correct} />
            <StatPill icon={<Flame className="h-4 w-4" aria-hidden="true" />} label={L.bestStreak} value={`×${over.bestStreak}`} />
            <StatPill icon={<Target className="h-4 w-4" aria-hidden="true" />} label={L.accuracy} value={`${over.accuracy}%`} />
            {over.isRecord ? (
              <span className="flex h-10 items-center gap-1.5 rounded-full bg-amber-100 px-3 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 sm:text-sm">
                <Trophy className="h-4 w-4" aria-hidden="true" /> {t('common.newRecord')}
              </span>
            ) : null}
          </div>
          <div className="mt-4">
            <RoundEndActions
              gameId={gameId}
              onReplay={() => start(inPlayDiff, dailyMode)}
              replayLabel={t('common.playAgain')}
              iq={over.iq}
              shareResult={over ? `${over.score} pts · ${over.accuracy}%` : undefined}
            />
          </div>
          <div className="mt-2 flex justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full"
              onClick={() => {
                sfx.play('click')
                backToMenu()
              }}
            >
              {t('common.back')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** Classes communes des touches du pavé (cibles ≥ 48 px, retour tactile immédiat). */
function keyClass(variant: 'digit' | 'back' | 'ok'): string {
  const base =
    'flex h-14 items-center justify-center rounded-2xl border-2 text-2xl font-black tabular-nums no-select transition-all focus-visible:outline-2 focus-visible:outline-ring active:scale-95 disabled:pointer-events-none disabled:opacity-50 sm:h-16 sm:text-3xl'
  if (variant === 'ok') return cn(base, 'border-emerald-600 bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700')
  if (variant === 'back') return cn(base, 'border-border bg-secondary/70 text-muted-foreground hover:border-primary/40 hover:text-foreground')
  return cn(base, 'border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md')
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <span className="flex h-10 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-xs font-semibold sm:text-sm">
      <span className="text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
