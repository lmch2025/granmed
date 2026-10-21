'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, CalendarCheck, Zap, ArrowRight, Share2, Star, Trophy, Flame, CheckCircle2, XCircle, BookMarked } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { buildHash } from '@/lib/app-store'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, mulberry32, seedFromString, shuffle, shareText, useReducedMotion } from '@/lib/utils-game'
import { loadSave, saveSave } from '@/lib/save'
import type { GameSEOContent } from '@/lib/games/types'
import { QUIZ_STATEMENTS, type QuizStatement } from '@/components/games/data/health-true-false-data'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { DifficultyDots } from '@/components/shared/ui-bits'
import { toast } from 'sonner'

export const gameId = 'health-true-false'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: '48 affirmations santé sourcées à juger Vrai ou Faux : nutrition, sommeil, hydratation, activité, hygiène.',
    en: 'Judge 48 sourced health statements true or false: nutrition, sleep, hydration, activity and hygiene.',
  },
  description: {
    fr: [
      'Vrai ou Faux — Santé est un jeu de quiz gratuit en ligne qui vous demande de juger des affirmations sur la santé : chaque phrase, tirée d’un corpus de 48 affirmations vérifiées, doit être marquée vraie ou fausse. Nutrition, sommeil, hydratation, activité physique, hygiène et idées reçues y passent au peigne fin.',
      'Chaque réponse déclenche une explication pédagogique de deux à trois phrases, appuyée par une source institutionnelle (OMS, NHS, Inserm, Harvard Health, ANSES…). Le jeu propose une série du jour identique pour tous les joueurs et une série rapide mélangée, sans chronomètre, pour apprendre à son rythme.',
      'Les scores, séries de bonnes réponses et étoiles alimentent votre parcours Granmed : XP, records personnels et succès viennent récompenser votre culture santé, au fil d’une série de 12 affirmations par partie.',
    ],
    en: [
      'True or False — Health is a free online quiz game that asks you to judge health statements: each sentence, drawn from a corpus of 48 fact-checked statements, must be marked true or false. Nutrition, sleep, hydration, physical activity, hygiene and common myths all come under scrutiny.',
      'Every answer unlocks a two-to-three sentence educational explanation, backed by an institutional source (WHO, NHS, Inserm, Harvard Health, ANSES…). The game offers a daily series that is identical for every player, plus a shuffled quick series, with no timer — learn at your own pace.',
      'Scores, correct-answer streaks and stars feed your Granmed journey: XP, personal bests and achievements reward your health knowledge over a 12-statement series per game.',
    ],
  },
  rules: {
    fr: [
      'Choisissez un mode : la série du jour (12 affirmations identiques pour tous) ou une série rapide mélangée.',
      'Lisez l’affirmation affichée, avec sa catégorie et sa difficulté.',
      'Décidez si elle est vraie ou fausse, puis touchez le gros bouton VRAI ou FAUX.',
      'La correction s’affiche immédiatement : explication et source institutionnelle.',
      'Poursuivez les 12 affirmations : chaque bonne réponse vaut 1 point et alimente votre série.',
      'Terminez avec 10 bonnes réponses ou plus pour décrocher les 3 étoiles et la victoire.',
    ],
    en: [
      'Pick a mode: the daily series (12 statements, identical for everyone) or a shuffled quick series.',
      'Read the statement shown, along with its category and difficulty.',
      'Decide whether it is true or false, then tap the big TRUE or FALSE button.',
      'The correction appears immediately: explanation and institutional source.',
      'Work through the 12 statements: each correct answer is worth 1 point and feeds your streak.',
      'Finish with 10 or more correct answers to earn 3 stars and the win.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez les boutons VRAI ou FAUX, puis « Question suivante ».',
      'Ordinateur : cliquez sur les boutons, ou utilisez ← ou V pour vrai, → ou F pour faux, Entrée pour continuer.',
      'Le jeu est sans chronomètre : prenez le temps de réfléchir.',
    ],
    en: [
      'Mobile & tablet: tap the TRUE or FALSE buttons, then “Next question”.',
      'Desktop: click the buttons, or use ← or T for true, → or F for false, Enter to continue.',
      'The game has no timer: take all the time you need to think.',
    ],
  },
  features: {
    fr: [
      '48 affirmations bilingues fondées sur les repères des agences de santé publiques',
      'Explications pédagogiques avec source (OMS, NHS, Inserm, Harvard Health, ANSES…)',
      'Série du jour déterministe, identique pour tous les joueurs',
      'Série rapide aléatoire sans répétition immédiate des 20 dernières affirmations',
      'Séries de bonnes réponses, étoiles, XP et records personnels',
      'Jeu sans chronomètre, pensé pour apprendre tranquillement',
    ],
    en: [
      '48 bilingual statements grounded in public-health agency guidance',
      'Educational explanations with sources (WHO, NHS, Inserm, Harvard Health, ANSES…)',
      'Deterministic daily series, identical for every player',
      'Random quick series with no immediate repeat of the last 20 statements',
      'Correct-answer streaks, stars, XP and personal bests',
      'Untimed game designed for relaxed learning',
    ],
  },
  tips: {
    fr: [
      'Méfiez-vous des mots absolus : « toujours », « jamais », « automatiquement » cachent souvent une exagération.',
      'Les repères chiffrés officiels (400 g de fruits et légumes, 150 minutes par semaine, 20 secondes de lavage des mains) sont souvent vrais : mémorisez-les.',
      'Demandez-vous ce que disent les grandes agences de santé plutôt que les anecdotes personnelles.',
      'Lisez les explications même quand vous avez juste : c’est là que l’on apprend le plus.',
      'Une série de bonnes réponses se construit sur les questions faciles : ne précipitez pas votre lecture.',
    ],
    en: [
      'Watch out for absolute words: “always”, “never”, “automatically” often hide an exaggeration.',
      'Official numbers (400 g of fruit and veg, 150 minutes a week, 20 seconds of handwashing) are usually true: memorise them.',
      'Ask what major health agencies say rather than relying on personal anecdotes.',
      'Read the explanations even when you’re right: that’s where you learn the most.',
      'A correct-answer streak is built on the easy questions: don’t rush your reading.',
    ],
  },
  faq: {
    fr: [
      { q: 'Les affirmations sont-elles fiables ?', a: 'Oui : chacune s’appuie sur les repères d’institutions de santé publique (OMS, NHS, Inserm, Harvard Health, ANSES…). Le jeu reste informatif et ne remplace pas un avis médical.' },
      { q: 'La série du jour est-elle la même pour tous ?', a: 'Oui. Elle est générée de façon déterministe à partir de la date : tous les joueurs voient les mêmes 12 affirmations jusqu’au lendemain.' },
      { q: 'Combien de temps dure une partie ?', a: 'Une série compte 12 affirmations sans chronomètre : comptez environ 3 à 5 minutes, le temps de lire les explications.' },
      { q: 'Comment gagner les 3 étoiles ?', a: 'Il faut au moins 10 bonnes réponses sur 12. À 8, vous obtenez 2 étoiles ; à 6, 1 étoile.' },
      { q: 'Ce jeu peut-il remplacer un conseil médical ?', a: 'Non. C’est un jeu de culture générale santé : pour toute question personnelle, adressez-vous à un professionnel de santé.' },
    ],
    en: [
      { q: 'Are the statements reliable?', a: 'Yes: each one builds on guidance from public-health institutions (WHO, NHS, Inserm, Harvard Health, ANSES…). The game is informational and does not replace medical advice.' },
      { q: 'Is the daily series the same for everyone?', a: 'Yes. It is generated deterministically from the date: every player sees the same 12 statements until tomorrow.' },
      { q: 'How long does a game last?', a: 'A series has 12 untimed statements: expect about 3 to 5 minutes, including time to read the explanations.' },
      { q: 'How do I earn 3 stars?', a: 'You need at least 10 correct answers out of 12. At 8 you get 2 stars; at 6, 1 star.' },
      { q: 'Can this game replace medical advice?', a: 'No. It is a health general-knowledge game: for any personal question, please see a healthcare professional.' },
    ],
  },
  records: {
    'best-score': { fr: 'Meilleur score — série de 12', en: 'Best score — 12-question series' },
    'best-streak': { fr: 'Plus longue série de bonnes réponses', en: 'Longest correct-answer streak' },
  },
}

/* ================= Données de jeu ================= */
const SERIES_LEN = 12
const RECENT_LIMIT = 20

interface SaveData {
  recentIds: string[]
}

const CATEGORY_META: Record<QuizStatement['category'], { icon: string; label: Record<'fr' | 'en', string>; chip: string }> = {
  nutrition: { icon: '🥗', label: { fr: 'Nutrition', en: 'Nutrition' }, chip: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' },
  sommeil: { icon: '😴', label: { fr: 'Sommeil', en: 'Sleep' }, chip: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300' },
  hydratation: { icon: '💧', label: { fr: 'Hydratation', en: 'Hydration' }, chip: 'bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300' },
  'activité': { icon: '🏃', label: { fr: 'Activité physique', en: 'Physical activity' }, chip: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300' },
  'hygiène': { icon: '🧼', label: { fr: 'Hygiène', en: 'Hygiene' }, chip: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300' },
  'idées-reçues': { icon: '🤔', label: { fr: 'Idées reçues', en: 'Common myths' }, chip: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300' },
}

/** Série du jour : 6 vraies + 6 fausses, déterministe par date (graine contractuelle). */
function buildDailySeries(dateKey: string): QuizStatement[] {
  const rand = mulberry32(seedFromString('health-true-false:' + dateKey))
  const trues = shuffle(QUIZ_STATEMENTS.filter((s) => s.answer === 'true'), rand).slice(0, 6)
  const falses = shuffle(QUIZ_STATEMENTS.filter((s) => s.answer === 'false'), rand).slice(0, 6)
  return shuffle([...trues, ...falses], rand)
}

/** Série rapide : 6 vraies + 6 fausses au hasard, en évitant les 20 dernières jouées. */
function buildQuickSeries(recentIds: string[]): { series: QuizStatement[]; recent: string[] } {
  const recent = new Set(recentIds)
  let pool = QUIZ_STATEMENTS.filter((s) => !recent.has(s.id))
  if (pool.length < SERIES_LEN) pool = QUIZ_STATEMENTS
  const shuffled = shuffle(pool)
  const trues = shuffled.filter((s) => s.answer === 'true').slice(0, 6)
  const falses = shuffled.filter((s) => s.answer === 'false').slice(0, 6)
  const chosen = [...trues, ...falses]
  if (chosen.length < SERIES_LEN) {
    const chosenIds = new Set(chosen.map((s) => s.id))
    for (const s of shuffled) {
      if (chosen.length >= SERIES_LEN) break
      if (!chosenIds.has(s.id)) chosen.push(s)
    }
  }
  const series = shuffle(chosen)
  const nextRecent = [...series.map((s) => s.id), ...recentIds].slice(0, RECENT_LIMIT)
  return { series, recent: nextRecent }
}

/* ================= Composant principal ================= */
export default function HealthTrueFalseGame() {
  const t = useT()
  const lang = useLang()
  const reduce = useReducedMotion()
  const dailyDone = useIsDailyDone(gameId)
  const bestScore = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-score']?.value)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)

  const [phase, setPhase] = useState<'menu' | 'playing' | 'done'>('menu')
  const [mode, setMode] = useState<'daily' | 'quick'>('quick')
  const [series, setSeries] = useState<QuizStatement[]>([])
  const [idx, setIdx] = useState(0)
  const [choice, setChoice] = useState<'true' | 'false' | null>(null)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const [streak, setStreak] = useState(0)
  const [end, setEnd] = useState<{ score: number; stars: number; isRecord: boolean; bestStreak: number } | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)

  /* Série de bonnes réponses persistante sur la session (chaîne de séries), remise à zéro sur erreur. */
  const streakRef = useRef(0)
  const maxStreakRef = useRef(0)
  const nextBtnRef = useRef<HTMLButtonElement>(null)

  const L = {
    fr: {
      dailyTitle: 'Série du jour',
      dailySub: '12 affirmations identiques pour tous les joueurs, renouvelées chaque jour.',
      quickTitle: 'Série rapide',
      quickSub: '12 affirmations tirées au hasard, sans répetition immédiate.',
      start: 'Commencer',
      dailyDoneChip: 'Défi déjà réussi aujourd’hui',
      bestScoreLabel: 'Record',
      question: 'Affirmation',
      scoreLabel: 'Bonnes réponses',
      streakLabel: 'Série',
      trueLabel: 'VRAI',
      falseLabel: 'FAUX',
      next: 'Question suivante',
      seeResults: 'Voir le bilan',
      rightAnswer: 'Bonne réponse !',
      wrongAnswer: 'Raté…',
      wasTrue: 'Cette affirmation est vraie.',
      wasFalse: 'Cette affirmation est fausse.',
      source: 'Source',
      menu: 'Menu',
      replay: 'Rejouer',
      replayDaily: 'Rejouer le défi',
      playDailyAgain: 'Rejouer la série du jour',
      shareTitle: 'Granmed — Vrai ou Faux Santé',
      noteSources: 'Contenu informatif fondé sur les repères d’organismes de santé publique ; il ne remplace pas l’avis d’un professionnel de santé.',
      sourcesChip: 'Sources : OMS, NHS, Inserm, Harvard Health, ANSES…',
      stars3: 'Excellent !',
      stars2: 'Bien joué !',
      stars1: 'Pas mal !',
      stars0: 'Continuez !',
      xpGain: 'XP gagnés',
      dailyLogged: 'Défi du jour enregistré',
      shareLine: 'Peux-tu faire mieux ?',
      shareDaily: 'Série du jour',
      shareQuick: 'Série rapide',
    },
    en: {
      dailyTitle: 'Daily series',
      dailySub: '12 statements identical for every player, refreshed each day.',
      quickTitle: 'Quick series',
      quickSub: '12 random statements, no immediate repeats.',
      start: 'Start',
      dailyDoneChip: 'Daily challenge already completed today',
      bestScoreLabel: 'Personal best',
      question: 'Statement',
      scoreLabel: 'Correct',
      streakLabel: 'Streak',
      trueLabel: 'TRUE',
      falseLabel: 'FALSE',
      next: 'Next question',
      seeResults: 'See results',
      rightAnswer: 'Correct!',
      wrongAnswer: 'Missed it…',
      wasTrue: 'This statement is true.',
      wasFalse: 'This statement is false.',
      source: 'Source',
      menu: 'Menu',
      replay: 'Play again',
      replayDaily: 'Replay the challenge',
      playDailyAgain: 'Replay the daily series',
      shareTitle: 'Granmed — True or False Health',
      noteSources: 'Informational content based on public-health agency guidance; it does not replace advice from a healthcare professional.',
      sourcesChip: 'Sources: WHO, NHS, Inserm, Harvard Health, ANSES…',
      stars3: 'Excellent!',
      stars2: 'Well done!',
      stars1: 'Not bad!',
      stars0: 'Keep going!',
      xpGain: 'XP earned',
      dailyLogged: 'Daily challenge logged',
      shareLine: 'Can you do better?',
      shareDaily: 'Daily series',
      shareQuick: 'Quick series',
    },
  }[lang]

  /* --- Lancement d'une série (handler — jamais dans un effet) --- */
  const startSeries = useCallback(
    (m: 'daily' | 'quick') => {
      let built: QuizStatement[]
      if (m === 'daily') {
        built = buildDailySeries(todayKey())
      } else {
        const prev = loadSave<SaveData>(gameId)?.recentIds ?? []
        const { series: s, recent } = buildQuickSeries(prev)
        built = s
        saveSave(gameId, { recentIds: recent })
      }
      sfx.play('pop')
      setMode(m)
      setSeries(built)
      setIdx(0)
      setChoice(null)
      setCorrect(null)
      setResults([])
      setEnd(null)
      setPhase('playing')
      addPlay(gameId)
    },
    [addPlay],
  )

  /* --- Réponse à l'affirmation courante --- */
  const answer = useCallback(
    (c: 'true' | 'false') => {
      if (phase !== 'playing' || choice !== null) return
      const stmt = series[idx]
      if (!stmt) return
      const isCorrect = c === stmt.answer
      if (isCorrect) sfx.play('correct')
      else sfx.play('wrong', { volume: 0.5 })
      setChoice(c)
      setCorrect(isCorrect)
      setResults((r) => [...r, isCorrect])
      const nextStreak = isCorrect ? streakRef.current + 1 : 0
      streakRef.current = nextStreak
      if (nextStreak > maxStreakRef.current) maxStreakRef.current = nextStreak
      setStreak(nextStreak)
      if (nextStreak >= 15) unlockBadge('quiz-streak-15')
    },
    [phase, choice, series, idx, unlockBadge],
  )

  /* --- Fin de série (appelée depuis le handler « suivant ») --- */
  const finishSeries = useCallback(() => {
    const score = results.filter(Boolean).length
    const stars = score >= 10 ? 3 : score >= 8 ? 2 : score >= 6 ? 1 : 0
    const best = maxStreakRef.current
    const rec1 = setBest(gameId, 'best-score', score, false)
    const rec2 = setBest(gameId, 'best-streak', best, false)
    const isRecord = rec1 || rec2
    if (score >= 10) {
      addWin(gameId)
      sfx.play('win')
      setConfettiKey((k) => k + 1)
    }
    addXp(10 * score)
    if (score === 12) unlockBadge('quiz-perfect')
    if (mode === 'daily') completeDaily(gameId)
    setEnd({ score, stars, isRecord, bestStreak: best })
    setPhase('done')
  }, [results, mode, setBest, addWin, addXp, unlockBadge, completeDaily])

  /* --- Question suivante --- */
  const next = useCallback(() => {
    if (phase !== 'playing' || choice === null) return
    sfx.play('click')
    if (idx + 1 >= series.length) {
      finishSeries()
    } else {
      setIdx(idx + 1)
      setChoice(null)
      setCorrect(null)
    }
  }, [phase, choice, idx, series, finishSeries])

  /* --- Focus clavier sur « Question suivante » (aucun setState dans le corps d'effet) --- */
  useEffect(() => {
    if (choice !== null) nextBtnRef.current?.focus()
  }, [choice])

  /* --- Raccourcis clavier globaux : rafraîchis via ref, attachés une seule fois --- */
  const keyRef = useRef<(e: KeyboardEvent) => void>(() => {})
  useEffect(() => {
    keyRef.current = (e: KeyboardEvent) => {
      if (phase !== 'playing') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest?.('[role="dialog"],[data-radix-popper-content-wrapper]')) return
      const k = e.key
      if (k === 'ArrowLeft' || k === 'v' || k === 'V' || k === 't' || k === 'T') {
        e.preventDefault()
        answer('true')
      } else if (k === 'ArrowRight' || k === 'f' || k === 'F') {
        e.preventDefault()
        answer('false')
      } else if (k === 'Enter') {
        if (document.activeElement instanceof HTMLElement && document.activeElement.closest('button')) return
        if (choice !== null) {
          e.preventDefault()
          next()
        }
      }
    }
  })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => keyRef.current(e)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const stmt = series[idx] ?? null
  const correctCount = results.filter(Boolean).length

  /* --- Partage du bilan (emoji ✅❌) --- */
  const shareResult = useCallback(async () => {
    if (!end) return
    sfx.play('click')
    const line = results.map((r) => (r ? '✅' : '❌')).join('')
    const url = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}${buildHash(lang, { type: 'game', slug: gameId })}` : ''
    const modeLabel = mode === 'daily' ? L.shareDaily : L.shareQuick
    const text =
      lang === 'fr'
        ? `Vrai ou Faux Santé — ${modeLabel} : ${end.score}/12\n${line}\n${L.shareLine} ${url}`
        : `True or False Health — ${modeLabel}: ${end.score}/12\n${line}\n${L.shareLine} ${url}`
    const ok = await shareText(L.shareTitle, text)
    if (ok) toast.success(t('common.copied'))
  }, [end, results, mode, lang, L, t])

  /* ================= Rendu ================= */
  return (
    <div className="relative select-none">
      <Confetti fire={confettiKey} count={reduce ? 0 : 90} />

      {/* ---------- Menu : choix du mode ---------- */}
      {phase === 'menu' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => startSeries('daily')}
              className="group flex min-h-32 flex-col items-start gap-2 rounded-2xl border-2 border-amber-300/60 bg-amber-50/70 p-4 text-left transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-ring dark:border-amber-500/25 dark:bg-amber-500/10"
            >
              <span className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <span className="font-display text-lg font-extrabold text-amber-800 dark:text-amber-300">{L.dailyTitle}</span>
                {dailyDone ? (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">✅</span>
                ) : null}
              </span>
              <span className="text-sm text-muted-foreground">{L.dailySub}</span>
              <span className="mt-auto flex h-11 items-center gap-1.5 rounded-full bg-amber-500 px-4 text-sm font-bold text-white transition-transform group-active:scale-95">
                <Play className="h-4 w-4" aria-hidden="true" />
                {dailyDone ? L.playDailyAgain : L.start}
              </span>
            </button>

            <button
              type="button"
              onClick={() => startSeries('quick')}
              className="group flex min-h-32 flex-col items-start gap-2 rounded-2xl border-2 border-emerald-300/60 bg-emerald-50/70 p-4 text-left transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-ring dark:border-emerald-500/25 dark:bg-emerald-500/10"
            >
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className="font-display text-lg font-extrabold text-emerald-800 dark:text-emerald-300">{L.quickTitle}</span>
                {bestScore !== undefined ? (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    {L.bestScoreLabel} : {bestScore}/12
                  </span>
                ) : null}
              </span>
              <span className="text-sm text-muted-foreground">{L.quickSub}</span>
              <span className="mt-auto flex h-11 items-center gap-1.5 rounded-full bg-emerald-500 px-4 text-sm font-bold text-white transition-transform group-active:scale-95">
                <Play className="h-4 w-4" aria-hidden="true" />
                {L.start}
              </span>
            </button>
          </div>

          <p className="flex items-start gap-2 rounded-xl bg-secondary/50 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
            <BookMarked className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              <span className="font-semibold">{L.sourcesChip}</span>
              <br />
              {L.noteSources}
            </span>
          </p>
        </div>
      ) : null}

      {/* ---------- Série en cours ---------- */}
      {phase === 'playing' && stmt ? (
        <div>
          {/* Barre d'état */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {mode === 'daily' ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                {t('common.daily')}
              </span>
            ) : (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 text-sm font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                <Zap className="h-4 w-4" aria-hidden="true" />
                {L.quickTitle}
              </span>
            )}
            <span className="flex h-11 items-center gap-2 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              <span className="text-muted-foreground">{L.scoreLabel}</span>
              <span className="tabular-nums">{correctCount}/12</span>
            </span>
            <span className="flex h-11 items-center gap-1.5 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold" aria-label={`${t('common.streak')}: ${streak}`}>
              <Flame className={cn('h-4 w-4', streak > 0 ? 'text-orange-500' : 'text-muted-foreground')} aria-hidden="true" />
              <span className="tabular-nums">{streak}</span>
            </span>
            <span className="ms-auto flex h-11 items-center rounded-full bg-secondary/70 px-3.5 text-sm font-semibold tabular-nums">
              {idx + 1}/{series.length}
            </span>
          </div>

          {/* Points de progression */}
          <div
            className="mb-4 flex flex-wrap items-center gap-1.5"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={series.length}
            aria-valuenow={idx + (choice !== null ? 1 : 0)}
            aria-label={L.question}
          >
            {series.map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={cn(
                  'h-2.5 w-2.5 rounded-full transition-colors sm:h-3 sm:w-3',
                  i < results.length ? (results[i] ? 'bg-emerald-500' : 'bg-rose-400') : i === idx ? 'bg-primary/50 ring-2 ring-primary/30' : 'bg-foreground/15',
                )}
              />
            ))}
          </div>

          {/* Carte d'affirmation */}
          <div
            key={idx}
            className={cn(
              'anim-pop-in rounded-2xl border-2 bg-card p-4 shadow-sm transition-colors sm:p-6',
              correct === null ? 'border-border' : correct ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-500/5' : 'border-rose-400 bg-rose-50/40 dark:bg-rose-500/5',
            )}
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold', CATEGORY_META[stmt.category].chip)}>
                <span aria-hidden="true">{CATEGORY_META[stmt.category].icon}</span>
                {CATEGORY_META[stmt.category].label[lang]}
              </span>
              <span className="ms-auto flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{t('common.difficulty')}</span>
                <DifficultyDots level={stmt.difficulty} />
              </span>
            </div>
            <p className="font-display text-xl font-bold leading-snug sm:text-2xl">{stmt.statement[lang]}</p>
          </div>

          {/* Boutons VRAI / FAUX */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={choice !== null}
              aria-keyshortcuts="ArrowLeft"
              onClick={() => answer('true')}
              className={cn(
                'no-select flex min-h-16 items-center justify-center gap-2 rounded-2xl border-2 border-emerald-600 bg-emerald-500 text-lg font-extrabold tracking-wide text-white shadow-sm transition-all',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                choice === null && 'hover:bg-emerald-600 active:scale-[0.98]',
                choice !== null && stmt.answer === 'true' && 'ring-4 ring-emerald-300 dark:ring-emerald-500/40',
                choice !== null && stmt.answer !== 'true' && 'opacity-50',
              )}
            >
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              {L.trueLabel}
            </button>
            <button
              type="button"
              disabled={choice !== null}
              aria-keyshortcuts="ArrowRight"
              onClick={() => answer('false')}
              className={cn(
                'no-select flex min-h-16 items-center justify-center gap-2 rounded-2xl border-2 border-rose-600 bg-rose-500 text-lg font-extrabold tracking-wide text-white shadow-sm transition-all',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                choice === null && 'hover:bg-rose-600 active:scale-[0.98]',
                choice !== null && stmt.answer === 'false' && 'ring-4 ring-rose-300 dark:ring-rose-500/40',
                choice !== null && stmt.answer !== 'false' && 'opacity-50',
              )}
            >
              <XCircle className="h-6 w-6" aria-hidden="true" />
              {L.falseLabel}
            </button>
          </div>

          {/* Correction + explication */}
          {choice !== null ? (
            <div
              role="status"
              aria-live="polite"
              className={cn(
                'anim-rise mt-4 rounded-2xl border-2 p-4 sm:p-5',
                correct ? 'border-emerald-300/70 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10' : 'border-rose-300/70 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/10',
              )}
            >
              <p className={cn('flex items-center gap-2 font-display font-extrabold', correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300')}>
                {correct ? <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" /> : <XCircle className="h-5 w-5 shrink-0" aria-hidden="true" />}
                {correct ? L.rightAnswer : L.wrongAnswer}
                <span className="font-semibold">{stmt.answer === 'true' ? L.wasTrue : L.wasFalse}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{stmt.explanation[lang]}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-2.5 py-1 text-xs font-bold text-muted-foreground">
                  <BookMarked className="h-3.5 w-3.5" aria-hidden="true" />
                  {L.source} : {stmt.source}
                </span>
                <Button ref={nextBtnRef} size="lg" className="ms-auto h-12 rounded-full px-5" onClick={next}>
                  {idx + 1 >= series.length ? L.seeResults : L.next}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---------- Bilan final ---------- */}
      {phase === 'done' && end ? (
        <div
          className={cn(
            'anim-rise rounded-2xl border-2 p-5 text-center sm:p-6',
            end.score >= 10 ? 'border-emerald-300/70 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10' : 'border-border bg-card',
          )}
          role="status"
        >
          <p className="font-display text-2xl font-extrabold">
            {end.stars === 3 ? L.stars3 : end.stars === 2 ? L.stars2 : end.stars === 1 ? L.stars1 : L.stars0}
          </p>
          <div className="mt-2 flex justify-center gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <Star key={i} className={cn('h-7 w-7', i < end.stars ? 'fill-amber-400 text-amber-400' : 'text-foreground/20')} />
            ))}
          </div>
          <p className="mt-3 text-4xl font-display font-black tabular-nums">
            {end.score}
            <span className="text-xl text-muted-foreground">/12</span>
          </p>
          <p className="mt-1 break-all text-lg tracking-widest" aria-label={L.scoreLabel}>
            {results.map((r, i) => (
              <span key={i}>{r ? '✅' : '❌'}</span>
            ))}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="flex h-11 items-center gap-1.5 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
              <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <span className="text-muted-foreground">{L.xpGain}</span>
              <span className="tabular-nums">+{10 * end.score}</span>
            </span>
            <span className="flex h-11 items-center gap-1.5 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
              <Flame className="h-4 w-4 text-orange-500" aria-hidden="true" />
              <span className="text-muted-foreground">{t('common.streak')}</span>
              <span className="tabular-nums">×{end.bestStreak}</span>
            </span>
            {end.isRecord ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                {t('common.newRecord')}
              </span>
            ) : null}
            {mode === 'daily' ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                {L.dailyLogged}
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <Button size="lg" className="rounded-full" onClick={() => startSeries(mode)}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {mode === 'daily' ? L.replayDaily : L.replay}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full"
              onClick={() => {
                sfx.play('click')
                setPhase('menu')
              }}
            >
              {L.menu}
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full" onClick={shareResult}>
              <Share2 className="h-4 w-4" aria-hidden="true" />
              {t('common.share')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
