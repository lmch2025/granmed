'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, CalendarCheck, Timer, Trophy, Flame, Target, Crosshair } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, mulberry32, seedFromString, shuffle } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'

export const gameId = 'speed-math'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Enchaînez un maximum de calculs mentaux justes en 60 secondes, avec bonus de série et difficulté adaptative.',
    en: 'Chain as many correct mental calculations as you can in 60 seconds, with streak bonuses and adaptive difficulty.',
  },
  description: {
    fr: [
      'Calcul Éclair est un jeu de calcul mental chronométré : pendant 60 secondes, les opérations s’enchaînent et vous choisissez la bonne réponse parmi quatre propositions. Chaque bonne réponse rapporte 10 points, augmentés d’un bonus quand votre série s’allonge (jusqu’à +20 au-delà de 10 bonnes réponses d’affilée).',
      'Trois niveaux sont proposés : Facile (additions et soustractions), Moyen (avec les tables de multiplication) et Difficile (toutes les opérations, divisions au résultat entier garanti). Tous les cinq succès consécutifs, les fourchettes de nombres s’élargissent légèrement : le jeu s’adapte à votre niveau.',
      'Un sprint terminé enregistre votre score et votre nombre de bonnes réponses comme records, débloque des succès (25 et 40 bonnes réponses) et, chaque jour, un défi du jour propose la même série de questions à tous les joueurs.',
    ],
    en: [
      'Speed Math is a timed mental-arithmetic game: for 60 seconds, operations come one after another and you pick the right answer from four options. Each correct answer earns 10 points, topped up with a bonus as your streak grows (up to +20 beyond 10 correct answers in a row).',
      'Three levels are offered: Easy (additions and subtractions), Medium (with multiplication tables) and Hard (all operations, with divisions guaranteed to have whole-number results). Every five correct answers in a row, the number ranges widen slightly: the game adapts to your level.',
      'A finished sprint saves your score and your correct-answer count as records, unlocks achievements (25 and 40 correct answers) and, every day, a daily challenge offers the same question series to all players.',
    ],
  },
  rules: {
    fr: [
      'Choisissez une difficulté : Facile, Moyen ou Difficile — ou lancez le défi du jour.',
      'Le sprint dure 60 secondes et démarre dès la première question.',
      'Lisez l’opération « a ? b = ? » et touchez la bonne réponse parmi les 4 propositions.',
      'Bonne réponse : +10 points, +5 / +10 / +20 de bonus à partir de 3 / 6 / 10 bonnes réponses d’affilée.',
      'Mauvaise réponse : la série retombe à zéro et la bonne réponse s’affiche brièvement.',
      'À la fin du chrono : score, nombre de bonnes réponses, meilleure série et précision sont enregistrés.',
    ],
    en: [
      'Pick a difficulty: Easy, Medium or Hard — or start the daily challenge.',
      'The sprint lasts 60 seconds and starts with the first question.',
      'Read the operation “a ? b = ?” and tap the right answer among the 4 options.',
      'Correct answer: +10 points, +5 / +10 / +20 bonus from 3 / 6 / 10 correct answers in a row.',
      'Wrong answer: the streak falls back to zero and the right answer is briefly highlighted.',
      'When the clock ends: score, correct answers, best streak and accuracy are recorded.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez les grandes réponses (2 × 2).',
      'Ordinateur : cliquez sur une réponse, ou utilisez les touches 1, 2, 3 et 4.',
      'La barre de temps se vide au fil du sprint ; un tic sonore retentit sur les 5 dernières secondes.',
    ],
    en: [
      'Mobile & tablet: tap the large answers (2 × 2 grid).',
      'Desktop: click an answer, or use the 1, 2, 3 and 4 keys.',
      'The time bar empties as the sprint goes; a ticking sound rings out over the last 5 seconds.',
    ],
  },
  features: {
    fr: [
      '3 difficultés : Facile, Moyen, Difficile (divisions à résultat entier)',
      'Difficulté adaptative : les fourchettes grandissent tous les 5 succès consécutifs',
      'Bonus de série avec compteur de flammes animé',
      'Barre de temps de 60 s et tic-tac sur les 5 dernières secondes',
      'Records de score et de bonnes réponses, succès 25 et 40',
      'Défi du jour : la même série de questions pour tous les joueurs',
    ],
    en: [
      '3 difficulties: Easy, Medium, Hard (whole-number divisions)',
      'Adaptive difficulty: ranges grow every 5 correct answers in a row',
      'Streak bonuses with an animated flame counter',
      '60-second time bar and ticking over the last 5 seconds',
      'Score and correct-answer records, 25 and 40 achievements',
      'Daily challenge: the same question series for every player',
    ],
  },
  tips: {
    fr: [
      'Visez la régularité plutôt que la vitesse : une erreur coûte la série ET 0,7 seconde d’affichage de la réponse.',
      'Pour multiplier par 9, multipliez par 10 puis retirez le nombre : 7 × 9 = 70 − 7 = 63.',
      'Pour diviser, pensez « combien de fois » : 56 ÷ 7, comptez 7, 14, 21… jusqu’à 56 : huit fois.',
      'Éliminez d’abord les réponses manifestement trop grandes ou trop petites : deux choix restent rarement difficiles.',
    ],
    en: [
      'Aim for consistency over speed: one mistake costs your streak AND 0.7 seconds while the answer is shown.',
      'To multiply by 9, multiply by 10 then subtract the number: 7 × 9 = 70 − 7 = 63.',
      'To divide, think “how many times”: for 56 ÷ 7, count 7, 14, 21… up to 56: eight times.',
      'First rule out answers that are clearly too big or too small: what remains is rarely hard to pick.',
    ],
  },
  faq: {
    fr: [
      { q: 'Les divisions tombent-elles toujours juste ?', a: 'Oui : en difficulté Difficile, chaque division est construite à partir du diviseur et du quotient, donc le résultat est toujours un nombre entier.' },
      { q: 'Comment fonctionne la difficulté adaptative ?', a: 'Tous les 5 succès consécutifs, les nombres des opérations suivantes s’étendent légèrement (par exemple jusqu’à 20+3 par tranche en Facile). Une erreur ramène la fourchette au niveau de votre série actuelle.' },
      { q: 'Comment les points sont-ils calculés ?', a: 'Chaque bonne réponse vaut 10 points, plus 5 à partir de 3 bonnes réponses consécutives, 10 à partir de 6, et 20 à partir de 10. Le score final rapporte la moitié de sa valeur en XP.' },
      { q: 'Le défi du jour est-il identique pour tous ?', a: 'Oui : sa difficulté et sa série de questions sont générées de façon déterministe à partir de la date. Tous les joueurs voient les mêmes calculs jusqu’au lendemain.' },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui : les quatre réponses occupent une grille 2×2 de grands boutons, prévus pour le pouce.' },
    ],
    en: [
      { q: 'Do divisions always come out even?', a: 'Yes: in Hard difficulty, every division is built from the divisor and the quotient, so the result is always a whole number.' },
      { q: 'How does adaptive difficulty work?', a: 'Every 5 correct answers in a row, the numbers of the following operations stretch slightly (for example up to 20+3 per step in Easy). A mistake brings the range back to your current streak level.' },
      { q: 'How are points calculated?', a: 'Each correct answer is worth 10 points, plus 5 from 3 correct answers in a row, 10 from 6, and 20 from 10. The final score earns half its value in XP.' },
      { q: 'Is the daily challenge identical for everyone?', a: 'Yes: its difficulty and question series are generated deterministically from the date. Every player sees the same calculations until tomorrow.' },
      { q: 'Can I play on my phone?', a: 'Yes: the four answers fill a 2×2 grid of large, thumb-friendly buttons.' },
    ],
  },
  records: {
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
  options: number[]
}

const SPRINT_MS = 60000

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
      op = '÷'
      b = ri(2, 9)
      const quotient = ri(2, 12 + boost * 2)
      a = b * quotient
    }
  }
  const answer = op === '+' ? a + b : op === '-' ? a - b : op === '×' ? a * b : a / b
  // Distracteurs plausibles, tous différents et positifs ou nuls.
  const candidates = shuffle(
    [answer + 1, answer - 1, answer + 2, answer - 2, answer + 10, answer - 10, answer + 5, answer - 5, a, b, answer + 4, answer - 4],
    rand,
  )
  const options = [answer]
  for (const c of candidates) {
    if (options.length >= 4) break
    if (c >= 0 && !options.includes(c)) options.push(c)
  }
  let extra = 3
  while (options.length < 4) {
    extra += 3
    if (!options.includes(answer + extra)) options.push(answer + extra)
  }
  return { a, op, b, answer, options: shuffle(options, rand) }
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
  const dailyDone = useIsDailyDone(gameId)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)

  const [diff, setDiff] = useState<Diff>('medium')
  const [dailyMode, setDailyMode] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [q, setQ] = useState<Q | null>(null)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [answered, setAnswered] = useState<{ picked: number; ok: boolean } | null>(null)
  const [timeLeft, setTimeLeft] = useState(SPRINT_MS)
  const [over, setOver] = useState<{ score: number; correct: number; bestStreak: number; accuracy: number; isRecord: boolean } | null>(null)

  const phaseRef = useRef<'idle' | 'playing' | 'over'>('idle')
  const endRef = useRef(0)
  const lastSecRef = useRef(61)
  const streakRef = useRef(0)
  const statsRef = useRef({ score: 0, correct: 0, wrong: 0, bestStreak: 0 })
  const qRef = useRef<Q | null>(null)
  const answeredRef = useRef<{ picked: number; ok: boolean } | null>(null)
  const dailyQsRef = useRef<Q[] | null>(null)
  const qIdxRef = useRef(0)
  const dailyModeRef = useRef(false)

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
      dailySprint: 'Sprint du jour',
      points: 'points',
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
      dailySprint: 'Daily sprint',
      points: 'points',
    },
  }[lang]

  const diffLabel = (d: Diff) => (d === 'easy' ? L.easy : d === 'medium' ? L.medium : L.hard)

  function goPhase(p: 'idle' | 'playing' | 'over') {
    phaseRef.current = p
    setPhase(p)
  }

  function nextQuestion() {
    setAnswered(null)
    answeredRef.current = null
    if (dailyQsRef.current) {
      const list = dailyQsRef.current
      const nq = list[qIdxRef.current % list.length]
      qIdxRef.current++
      qRef.current = nq
      setQ(nq)
    } else {
      const nq = makeQuestion(diff, Math.floor(streakRef.current / 5), Math.random)
      qRef.current = nq
      setQ(nq)
    }
  }

  function start(d: Diff, daily = false) {
    setDiff(d)
    setDailyMode(daily)
    dailyModeRef.current = daily
    statsRef.current = { score: 0, correct: 0, wrong: 0, bestStreak: 0 }
    streakRef.current = 0
    setScore(0)
    setCorrect(0)
    setStreak(0)
    setAnswered(null)
    answeredRef.current = null
    setOver(null)
    setTimeLeft(SPRINT_MS)
    lastSecRef.current = 61
    if (daily) {
      const series = dailySeries()
      dailyQsRef.current = series.questions
      qIdxRef.current = 1
      qRef.current = series.questions[0]
      setQ(series.questions[0])
    } else {
      dailyQsRef.current = null
      qIdxRef.current = 0
      const first = makeQuestion(d, 0, Math.random)
      qRef.current = first
      setQ(first)
    }
    endRef.current = Date.now() + SPRINT_MS
    goPhase('playing')
    addPlay(gameId)
  }

  function finish() {
    if (phaseRef.current !== 'playing') return
    goPhase('over')
    const s = statsRef.current
    const total = s.correct + s.wrong
    const accuracy = total ? Math.round((s.correct / total) * 100) : 0
    const rec1 = setBest(gameId, 'best-score', s.score)
    const rec2 = setBest(gameId, 'best-correct', s.correct)
    setOver({ score: s.score, correct: s.correct, bestStreak: s.bestStreak, accuracy, isRecord: rec1 || rec2 })
    sfx.play('win')
    addWin(gameId)
    addXp(Math.round(s.score / 2))
    if (s.correct >= 25) unlockBadge('math-25')
    if (s.correct >= 40) unlockBadge('math-40')
    if (dailyModeRef.current) completeDaily(gameId)
  }

  function onAnswer(v: number) {
    const cur = qRef.current
    if (!cur || answeredRef.current || phaseRef.current !== 'playing') return
    const ok = v === cur.answer
    if (ok) {
      sfx.play('correct', { volume: 0.7 })
      streakRef.current += 1
      const ns = streakRef.current
      const bonus = ns >= 10 ? 20 : ns >= 6 ? 10 : ns >= 3 ? 5 : 0
      statsRef.current.score += 10 + bonus
      statsRef.current.correct += 1
      statsRef.current.bestStreak = Math.max(statsRef.current.bestStreak, ns)
      setScore(statsRef.current.score)
      setCorrect(statsRef.current.correct)
      setStreak(ns)
      const state = { picked: v, ok: true }
      answeredRef.current = state
      setAnswered(state)
      window.setTimeout(() => {
        if (phaseRef.current === 'playing') nextQuestion()
      }, 300)
    } else {
      sfx.play('wrong', { volume: 0.4 })
      streakRef.current = 0
      statsRef.current.wrong += 1
      setStreak(0)
      const state = { picked: v, ok: false }
      answeredRef.current = state
      setAnswered(state)
      window.setTimeout(() => {
        if (phaseRef.current === 'playing') nextQuestion()
      }, 700)
    }
  }

  /* Chronomètre : barre de temps, tic-tac sur les 5 dernières secondes. */
  useEffect(() => {
    if (phase !== 'playing') return
    const id = window.setInterval(() => {
      const remaining = endRef.current - Date.now()
      setTimeLeft(Math.max(0, remaining))
      const whole = Math.ceil(remaining / 1000)
      if (whole < lastSecRef.current && whole <= 5 && whole >= 1) sfx.play('tick', { volume: 0.5 })
      lastSecRef.current = whole
      if (remaining <= 0) finish()
    }, 100)
    return () => window.clearInterval(id)
     
  }, [phase])

  /* Clavier : touches 1-4 pour répondre. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const i = ['1', '2', '3', '4'].indexOf(e.key)
      if (i >= 0 && phaseRef.current === 'playing' && qRef.current) {
        e.preventDefault()
        onAnswer(qRef.current.options[i])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
     
  }, [])

  const timePct = Math.max(0, Math.min(100, (timeLeft / SPRINT_MS) * 100))
  const lowTime = timeLeft <= 5000

  return (
    <div className="relative select-none">
      {/* Barre de configuration / statut */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {phase === 'idle' || phase === 'over' ? (
          <>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('common.difficulty')}>
              {(['easy', 'medium', 'hard'] as Diff[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={diff === d && !dailyMode}
                  onClick={() => {
                    sfx.play('click', { volume: 0.5 })
                    setDiff(d)
                    setDailyMode(false)
                  }}
                  className={cn(
                    'h-11 rounded-full border px-4 text-sm font-bold transition-all',
                    diff === d && !dailyMode
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {diffLabel(d)}
                </button>
              ))}
            </div>
            <Button size="lg" className="ms-auto h-11 rounded-full px-5 anim-glow" onClick={() => start(diff)}>
              <Play className="h-4 w-4" aria-hidden="true" />
              {phase === 'over' ? t('common.playAgain') : t('common.start')}
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <StatPill icon={<Target className="h-4 w-4" aria-hidden="true" />} label={t('common.score')} value={score} />
              <StatPill icon={<Crosshair className="h-4 w-4" aria-hidden="true" />} label={L.correctLabel} value={correct} />
              <span
                key={streak}
                className={cn(
                  'flex h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-bold tabular-nums',
                  streak >= 3
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
                    : 'bg-secondary/70 text-muted-foreground',
                  streak >= 3 && 'anim-pop-in',
                )}
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                {L.streakLabel} ×{streak}
              </span>
              {dailyMode ? (
                <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                  <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                  {t('common.daily')}
                </span>
              ) : null}
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="ms-auto h-11 rounded-full"
              onClick={() => {
                sfx.play('click')
                start(diff, dailyMode)
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {t('common.restart')}
            </Button>
          </>
        )}
      </div>

      {/* Bouton défi du jour */}
      {phase !== 'playing' && !dailyDone ? (
        <button
          type="button"
          onClick={() => {
            sfx.play('pop')
            start(dailySeries().diff, true)
          }}
          className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-left transition-transform hover:scale-[1.01] dark:border-amber-500/25 dark:bg-amber-500/10"
        >
          <span className="text-2xl" aria-hidden="true">
            🎁
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-amber-700 dark:text-amber-300">
              {t('common.daily')} — {todayKey()}
            </span>
            <span className="block text-xs text-muted-foreground">
              {L.dailyDiff} : {diffLabel(dailySeries().diff)} · 60 s
            </span>
          </span>
          <span className="rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-white">{t('game.startDaily')}</span>
        </button>
      ) : null}

      {/* Zone de jeu */}
      {phase === 'idle' ? (
        <div className="checkerboard flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border p-6 text-center">
          <div className="flex gap-2 font-display text-4xl font-black" aria-hidden="true">
            {['7', '+', '8'].map((e, i) => (
              <span key={i} className="anim-floaty text-primary" style={{ animationDelay: `${i * 0.35}s` }}>
                {e}
              </span>
            ))}
          </div>
          <p className="max-w-md text-sm text-muted-foreground">{content.tagline[lang]}</p>
        </div>
      ) : phase === 'playing' && q ? (
        <div className="rounded-2xl border bg-card/60 p-4 sm:p-6">
          {/* Barre de temps */}
          <div className="mb-5">
            <div className="mb-1.5 flex items-center justify-between text-sm font-semibold tabular-nums">
              <span className={cn('flex items-center gap-1.5', lowTime ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground')}>
                <Timer className="h-4 w-4" aria-hidden="true" />
                {Math.ceil(timeLeft / 1000)} s
              </span>
              <span className="text-muted-foreground">{diffLabel(dailyMode ? diff : diff)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(timePct)}>
              <div
                className={cn(
                  'h-full rounded-full transition-[width] duration-100',
                  lowTime ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-orange-500',
                )}
                style={{ width: `${timePct}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <p className="mb-6 text-center font-display text-4xl font-black tabular-nums sm:text-5xl" aria-live="polite">
            {q.a} <span className="text-primary">{q.op}</span> {q.b} = <span className="text-muted-foreground">?</span>
          </p>

          {/* Réponses */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {q.options.map((opt, i) => {
              const isPicked = answered?.picked === opt
              const isAnswer = answered && !answered.ok ? opt === q.answer : false
              const goodPick = answered?.ok && isPicked
              return (
                <button
                  key={`${opt}-${i}`}
                  type="button"
                  disabled={!!answered}
                  onClick={() => onAnswer(opt)}
                  className={cn(
                    'flex h-16 items-center justify-center rounded-2xl border-2 text-2xl font-black tabular-nums no-select transition-all focus-visible:outline-2 focus-visible:outline-ring sm:h-20 sm:text-3xl',
                    !answered && 'border-border bg-card hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md active:translate-y-0',
                    goodPick && 'anim-pop-in border-emerald-500 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
                    isPicked && !answered?.ok && 'anim-shake border-red-500 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
                    isAnswer && 'border-emerald-500 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
                    answered && !goodPick && !isPicked && !isAnswer && 'opacity-40',
                  )}
                >
                  <span className="me-1 hidden text-xs font-bold text-muted-foreground sm:inline">{i + 1}</span>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* Écran de fin */}
      {phase === 'over' && over ? (
        <div
          className="anim-rise rounded-2xl border-2 border-emerald-300/60 bg-emerald-50/60 p-5 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10"
          role="status"
        >
          <p className="font-display text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">⚡ {L.wellDone}</p>
          <p className="mt-1 font-display text-5xl font-black tabular-nums">
            {over.score} <span className="text-lg font-bold text-muted-foreground">{L.points}</span>
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <StatPill icon={<Crosshair className="h-4 w-4" aria-hidden="true" />} label={L.correctLabel} value={over.correct} />
            <StatPill icon={<Flame className="h-4 w-4" aria-hidden="true" />} label={L.bestStreak} value={`×${over.bestStreak}`} />
            <StatPill icon={<Target className="h-4 w-4" aria-hidden="true" />} label={L.accuracy} value={`${over.accuracy}%`} />
            {over.isRecord ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Trophy className="h-4 w-4" aria-hidden="true" /> {t('common.newRecord')}
              </span>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <Button size="lg" className="rounded-full" onClick={() => start(diff, dailyMode)}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> {t('common.playAgain')}
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full" onClick={() => goPhase('idle')}>
              {t('common.settings')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <span className="flex h-11 items-center gap-2 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
      <span className="text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
