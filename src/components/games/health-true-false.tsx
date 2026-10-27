'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, CalendarCheck, Zap, ArrowRight, Star, Trophy, Flame, CheckCircle2, XCircle, BookMarked, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, mulberry32, seedFromString, shuffle, useReducedMotion } from '@/lib/utils-game'
import { loadSave, saveSave } from '@/lib/save'
import { computeIq } from '@/lib/games/iq'
import type { GameSEOContent } from '@/lib/games/types'
import { QUIZ_STATEMENTS, type QuizStatement } from '@/components/games/data/health-true-false-data'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'
import { DifficultyDots } from '@/components/shared/ui-bits'

export const gameId = 'health-true-false'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: '48 affirmations santé sourcées à juger Vrai ou Faux : nutrition, sommeil, hydratation, activité, hygiène — et un QI estimé au bilan.',
    en: 'Judge 48 sourced health statements true or false: nutrition, sleep, hydration, activity and hygiene — plus an estimated IQ at the results screen.',
  },
  description: {
    fr: [
      'Vrai ou Faux — Santé est un jeu de quiz gratuit en ligne qui vous demande de juger des affirmations sur la santé : chaque phrase, tirée d’un corpus de 48 affirmations vérifiées, doit être marquée vraie ou fausse. Nutrition, sommeil, hydratation, activité physique, hygiène et idées reçues y passent au peigne fin.',
      'Chaque réponse déclenche une explication pédagogique de deux à trois phrases, appuyée par une source institutionnelle (OMS, NHS, Inserm, Harvard Health, ANSES…). Le jeu propose une série du jour identique pour tous les joueurs et une série rapide mélangée, sans chronomètre, pour apprendre à son rythme. Au bilan, un QI estimé — calculé à partir de votre précision sur la série — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'Les scores, séries de bonnes réponses et étoiles alimentent votre parcours Granmed : XP, records personnels et succès viennent récompenser votre culture santé, au fil d’une série de 12 affirmations par partie.',
    ],
    en: [
      'True or False — Health is a free online quiz game that asks you to judge health statements: each sentence, drawn from a corpus of 48 fact-checked statements, must be marked true or false. Nutrition, sleep, hydration, physical activity, hygiene and common myths all come under scrutiny.',
      'Every answer unlocks a two-to-three sentence educational explanation, backed by an institutional source (WHO, NHS, Inserm, Harvard Health, ANSES…). The game offers a daily series that is identical for every player, plus a shuffled quick series, with no timer — learn at your own pace. At the results screen, an estimated IQ — computed from your accuracy across the series — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
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
      'Mobile et tablette : touchez les gros boutons VRAI ou FAUX, puis « Suivant ».',
      'Ordinateur : cliquez sur les boutons, ou utilisez ← ou V pour vrai, → ou F pour faux, Entrée pour continuer.',
      'L’icône maison dans la barre de jeu permet d’abandonner une série en cours (aucune récompense).',
      'Le jeu est sans chronomètre : prenez le temps de réfléchir.',
    ],
    en: [
      'Mobile & tablet: tap the big TRUE or FALSE buttons, then “Next”.',
      'Desktop: click the buttons, or use ← or T for true, → or F for false, Enter to continue.',
      'The home icon in the game bar lets you abandon a series in progress (no rewards).',
      'The game has no timer: take all the time you need to think.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      '48 affirmations bilingues fondées sur les repères des agences de santé publiques',
      'Explications pédagogiques avec source (OMS, NHS, Inserm, Harvard Health, ANSES…)',
      'Série du jour déterministe, identique pour tous les joueurs',
      'Série rapide aléatoire équilibrée, sans répétition immédiate des 20 dernières affirmations',
      'Séries de bonnes réponses, étoiles, XP et records personnels',
      'Retour haptique léger à chaque réponse (appareils compatibles)',
      'Jeu sans chronomètre, pensé pour apprendre tranquillement',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      '48 bilingual statements grounded in public-health agency guidance',
      'Educational explanations with sources (WHO, NHS, Inserm, Harvard Health, ANSES…)',
      'Deterministic daily series, identical for every player',
      'Balanced random quick series with no immediate repeat of the last 20 statements',
      'Correct-answer streaks, stars, XP and personal bests',
      'Gentle haptic feedback on every answer (on supported devices)',
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
      { q: 'Comment gagner les 3 étoiles ?', a: 'Il faut au moins 10 bonnes réponses sur 12. À 8, vous obtenez 2 étoiles ; à 6, 1 étoile. Un sans-faute déclenche en plus les confettis.' },
      { q: 'Ce jeu peut-il remplacer un conseil médical ?', a: 'Non. C’est un jeu de culture générale santé : pour toute question personnelle, adressez-vous à un professionnel de santé.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé reflète avant tout votre précision : les bonnes réponses sur les 12 affirmations de la série. Le jeu étant volontairement sans chronomètre, la rapidité n’entre pas en compte, et la difficulté de référence est celle du quiz de culture santé. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour ancrer les repères santé.' },
    ],
    en: [
      { q: 'Are the statements reliable?', a: 'Yes: each one builds on guidance from public-health institutions (WHO, NHS, Inserm, Harvard Health, ANSES…). The game is informational and does not replace medical advice.' },
      { q: 'Is the daily series the same for everyone?', a: 'Yes. It is generated deterministically from the date: every player sees the same 12 statements until tomorrow.' },
      { q: 'How long does a game last?', a: 'A series has 12 untimed statements: expect about 3 to 5 minutes, including time to read the explanations.' },
      { q: 'How do I earn 3 stars?', a: 'You need at least 10 correct answers out of 12. At 8 you get 2 stars; at 6, 1 star. A flawless run also triggers the confetti.' },
      { q: 'Can this game replace medical advice?', a: 'No. It is a health general-knowledge game: for any personal question, please see a healthcare professional.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ primarily reflects your accuracy: the correct answers across the 12 statements of the series. Since the game is deliberately untimed, speed does not come into play, and the reference difficulty is that of the health-knowledge quiz. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this game — not a clinical IQ test — and the best way to raise it is to keep playing to anchor the health guidelines.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
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

const TRUE_POOL = QUIZ_STATEMENTS.filter((s) => s.answer === 'true')
const FALSE_POOL = QUIZ_STATEMENTS.filter((s) => s.answer === 'false')

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
  const trues = shuffle(TRUE_POOL, rand).slice(0, 6)
  const falses = shuffle(FALSE_POOL, rand).slice(0, 6)
  return shuffle([...trues, ...falses], rand)
}

/** Série rapide : 6 vraies + 6 fausses au hasard, en évitant les 20 dernières jouées.
 * Si l'historique récent épuise un camp (ex. 20 vraies jouées), il est complété
 * hors historique pour garantir l'équilibre 6/6. */
function buildQuickSeries(recentIds: string[]): { series: QuizStatement[]; recent: string[] } {
  const recentSet = new Set(recentIds)
  const pick = (pool: QuizStatement[], n: number, exclude: Set<string>) =>
    shuffle(pool.filter((s) => !exclude.has(s.id))).slice(0, n)
  let trues = pick(TRUE_POOL, 6, recentSet)
  let falses = pick(FALSE_POOL, 6, recentSet)
  if (trues.length < 6) trues = [...trues, ...pick(TRUE_POOL, 6 - trues.length, new Set(trues.map((s) => s.id)))]
  if (falses.length < 6) falses = [...falses, ...pick(FALSE_POOL, 6 - falses.length, new Set(falses.map((s) => s.id)))]
  const series = shuffle([...trues, ...falses])
  const nextRecent = [...series.map((s) => s.id), ...recentIds].slice(0, RECENT_LIMIT)
  return { series, recent: nextRecent }
}

/** Haptique légère (no-op propre si l'API est absente). */
function buzz(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* ignoré */
  }
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
  const addGameXp = useProfileStore((s) => s.addGameXp)
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
  const [end, setEnd] = useState<{ score: number; stars: number; isRecord: boolean; bestStreak: number; dailyFresh: boolean; iq: number } | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)

  /* Série de bonnes réponses persistante sur la session (chaîne de séries), remise à zéro sur erreur. */
  const streakRef = useRef(0)
  const maxStreakRef = useRef(0)
  /* Défi déjà réussi au moment du lancement (pour n'annoncer que les nouveaux crédits). */
  const dailyWasDoneRef = useRef(false)
  /* Anti double-clic sur les lancements de série. */
  const lastStartRef = useRef(0)
  const nextBtnRef = useRef<HTMLButtonElement>(null)
  const replayBtnRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const L = {
    fr: {
      dailyTitle: 'Série du jour',
      dailySub: '12 affirmations identiques pour tous, renouvelées chaque jour.',
      quickTitle: 'Série rapide',
      quickSub: '12 affirmations tirées au hasard, sans répétition immédiate.',
      start: 'Commencer',
      replayShort: 'Rejouer',
      dailyDoneChip: 'Défi déjà réussi aujourd’hui',
      bestScoreLabel: 'Record',
      question: 'Affirmation',
      progressLabel: 'Progression de la série',
      scoreLabel: 'Bonnes réponses',
      trueLabel: 'VRAI',
      falseLabel: 'FAUX',
      next: 'Question suivante',
      nextShort: 'Suivant',
      seeResults: 'Voir le bilan',
      resultsShort: 'Bilan',
      rightAnswer: 'Bonne réponse !',
      wrongAnswer: 'Raté…',
      wasTrue: 'Cette affirmation est vraie.',
      wasFalse: 'Cette affirmation est fausse.',
      source: 'Source',
      quit: 'Quitter la série',
      menu: 'Menu',
      replay: 'Rejouer',
      replayDaily: 'Rejouer le défi',
      retry: 'Réessayer',
      noteSources: 'Contenu informatif fondé sur les repères d’organismes de santé publique ; il ne remplace pas l’avis d’un professionnel de santé.',
      sourcesChip: 'Sources : OMS, NHS, Inserm, Harvard Health, ANSES…',
      stars3: 'Excellent !',
      stars2: 'Bien joué !',
      stars1: 'Pas mal !',
      stars0: 'Continuez !',
      xpGain: 'XP gagnés',
      dailyLogged: 'Défi du jour enregistré',
    },
    en: {
      dailyTitle: 'Daily series',
      dailySub: '12 statements identical for every player, refreshed each day.',
      quickTitle: 'Quick series',
      quickSub: '12 random statements, no immediate repeats.',
      start: 'Start',
      replayShort: 'Replay',
      dailyDoneChip: 'Daily challenge already completed today',
      bestScoreLabel: 'Personal best',
      question: 'Statement',
      progressLabel: 'Series progress',
      scoreLabel: 'Correct answers',
      trueLabel: 'TRUE',
      falseLabel: 'FALSE',
      next: 'Next question',
      nextShort: 'Next',
      seeResults: 'See results',
      resultsShort: 'Results',
      rightAnswer: 'Correct!',
      wrongAnswer: 'Missed it…',
      wasTrue: 'This statement is true.',
      wasFalse: 'This statement is false.',
      source: 'Source',
      quit: 'Quit the series',
      menu: 'Menu',
      replay: 'Play again',
      replayDaily: 'Replay the challenge',
      retry: 'Try again',
      noteSources: 'Informational content based on public-health agency guidance; it does not replace advice from a healthcare professional.',
      sourcesChip: 'Sources: WHO, NHS, Inserm, Harvard Health, ANSES…',
      stars3: 'Excellent!',
      stars2: 'Well done!',
      stars1: 'Not bad!',
      stars0: 'Keep going!',
      xpGain: 'XP earned',
      dailyLogged: 'Daily challenge logged',
    },
  }[lang]

  /* --- Lancement d'une série (handler — jamais dans un effet) --- */
  const startSeries = useCallback(
    (m: 'daily' | 'quick') => {
      const now = Date.now()
      if (now - lastStartRef.current < 400) return
      lastStartRef.current = now
      let built: QuizStatement[]
      if (m === 'daily') {
        built = buildDailySeries(todayKey())
        dailyWasDoneRef.current = useProfileStore.getState().profile.dailyDone[gameId] === todayKey()
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

  /* --- Réponse à l'affirmation courante (anti double-réponse via choice) --- */
  const answer = useCallback(
    (c: 'true' | 'false') => {
      if (phase !== 'playing' || choice !== null) return
      const stmt = series[idx]
      if (!stmt) return
      const isCorrect = c === stmt.answer
      if (isCorrect) sfx.play('correct')
      else sfx.play('wrong', { volume: 0.5 })
      buzz(10)
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
    /* QI estimé (Task 18) : précision = bonnes réponses / total de la série.
     * Jeu sans chronomètre → pas de dimension rapidité ; difficulté 1 (série
     * de culture santé, sans mode difficile). */
    const iq = computeIq(gameId, { accuracy: score / SERIES_LEN, difficulty: 1 })
    const rec1 = setBest(gameId, 'best-score', score, false)
    const rec2 = setBest(gameId, 'best-streak', best, false)
    const isRecord = rec1 || rec2
    const dailyFresh = mode === 'daily' && !dailyWasDoneRef.current
    if (score >= 10) {
      addWin(gameId)
      sfx.play('win')
      setConfettiKey((k) => k + 1)
      setBurstKey((k) => k + 1)
    } else {
      sfx.play('sweep', { volume: 0.6 })
    }
    addXp(10 * score)
    addGameXp(gameId, Math.round(10 + (score / SERIES_LEN) * 18))
    if (score === SERIES_LEN) {
      unlockBadge('quiz-perfect')
      buzz([30, 40, 30])
    }
    if (dailyFresh) completeDaily(gameId)
    setEnd({ score, stars, isRecord, bestStreak: best, dailyFresh, iq })
    setPhase('done')
  }, [results, mode, setBest, addWin, addXp, addGameXp, unlockBadge, completeDaily])

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

  /* --- Retour au menu (abandon sans récompense) --- */
  const quitToMenu = useCallback(() => {
    sfx.play('click')
    setPhase('menu')
  }, [])

  /* --- Focus clavier : carte à chaque question, « Suivant » après la réponse,
         « Rejouer » au bilan — preventScroll pour ne jamais faire défiler la page. --- */
  useEffect(() => {
    if (phase === 'playing') {
      if (choice !== null) nextBtnRef.current?.focus({ preventScroll: true })
      else cardRef.current?.focus({ preventScroll: true })
    } else if (phase === 'done') {
      replayBtnRef.current?.focus({ preventScroll: true })
    }
  }, [phase, choice, idx])

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
  const isLast = series.length > 0 && idx + 1 >= series.length

  /* ================= Rendu ================= */
  return (
    <div className="relative my-auto w-full select-none">
      <Confetti fire={confettiKey} count={reduce ? 0 : 110} waves={2} gold />
      <VictoryBurst fire={burstKey} stars={end ? Math.max(1, end.stars) : 3} sub={end ? `${end.score}/${SERIES_LEN}` : undefined} />

      {/* ---------- Menu : choix du mode (compact, 2 gros boutons immédiatement visibles) ---------- */}
      {phase === 'menu' ? (
        <div className="space-y-2.5">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => startSeries('daily')}
              className="group no-select flex min-h-[76px] touch-manipulation flex-col justify-center gap-1.5 rounded-2xl border-2 border-amber-300/60 bg-amber-50/70 p-3.5 text-left transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-ring active:scale-[0.99] sm:p-4 dark:border-amber-500/25 dark:bg-amber-500/10"
            >
              <span className="flex w-full items-center gap-2">
                <CalendarCheck className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <span className="font-display text-base font-extrabold text-amber-800 dark:text-amber-300">{L.dailyTitle}</span>
                {dailyDone ? (
                  <span className="text-base leading-none" role="img" aria-label={L.dailyDoneChip}>
                    ✅
                  </span>
                ) : null}
                <span className="ms-auto flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-amber-500 px-3.5 text-xs font-bold text-white shadow-sm transition-transform group-active:scale-95">
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  {dailyDone ? L.replayShort : L.start}
                </span>
              </span>
              <span className="text-xs leading-snug text-muted-foreground sm:text-sm">{L.dailySub}</span>
            </button>

            <button
              type="button"
              onClick={() => startSeries('quick')}
              className="group no-select flex min-h-[76px] touch-manipulation flex-col justify-center gap-1.5 rounded-2xl border-2 border-emerald-300/60 bg-emerald-50/70 p-3.5 text-left transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-ring active:scale-[0.99] sm:p-4 dark:border-emerald-500/25 dark:bg-emerald-500/10"
            >
              <span className="flex w-full items-center gap-2">
                <Zap className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className="font-display text-base font-extrabold text-emerald-800 dark:text-emerald-300">{L.quickTitle}</span>
                {bestScore !== undefined ? (
                  <span
                    className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300"
                    title={L.bestScoreLabel}
                  >
                    {bestScore}/{SERIES_LEN}
                  </span>
                ) : null}
                <span className="ms-auto flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 text-xs font-bold text-white shadow-sm transition-transform group-active:scale-95">
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  {L.start}
                </span>
              </span>
              <span className="text-xs leading-snug text-muted-foreground sm:text-sm">{L.quickSub}</span>
            </button>
          </div>

          <p
            className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-[11px] leading-snug text-muted-foreground"
            title={L.noteSources}
          >
            <BookMarked className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate font-semibold">{L.sourcesChip}</span>
          </p>
        </div>
      ) : null}

      {/* ---------- Série en cours (HUD une ligne + carte + VRAI/FAUX + correction compacte) ---------- */}
      {phase === 'playing' && stmt ? (
        <div className="flex flex-col">
          {/* Barre de jeu : mode, progression 12 points, compteurs, quitter — UNE ligne */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-bold',
                mode === 'daily'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
              )}
              title={mode === 'daily' ? L.dailyTitle : L.quickTitle}
            >
              {mode === 'daily' ? (
                <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Zap className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{mode === 'daily' ? L.dailyTitle : L.quickTitle}</span>
            </span>

            <div
              className="flex min-w-0 flex-1 items-center gap-[3px] overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={series.length}
              aria-valuenow={idx + (choice !== null ? 1 : 0)}
              aria-label={L.progressLabel}
            >
              {series.map((_, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={cn(
                    'h-1.5 w-1.5 shrink-0 rounded-full transition-colors sm:h-2 sm:w-2',
                    i < results.length ? (results[i] ? 'bg-emerald-500' : 'bg-rose-400') : i === idx ? 'bg-primary/60' : 'bg-foreground/15',
                  )}
                />
              ))}
            </div>

            <span className="shrink-0 text-[11px] font-bold tabular-nums text-muted-foreground" aria-hidden="true">
              {idx + 1}/{series.length}
            </span>

            <span
              className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-secondary/70 px-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
              aria-label={`${L.scoreLabel} : ${correctCount}/${series.length}`}
              title={L.scoreLabel}
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="tabular-nums">{correctCount}</span>
            </span>

            <span
              className={cn(
                'flex h-8 shrink-0 items-center gap-1 rounded-full bg-secondary/70 px-2 text-[11px] font-bold tabular-nums',
                streak > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground',
              )}
              aria-label={`${t('common.streak')} : ${streak}`}
              title={t('common.streak')}
            >
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="tabular-nums">{streak}</span>
            </span>

            <button
              type="button"
              onClick={quitToMenu}
              aria-label={L.quit}
              title={L.quit}
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring after:absolute after:-inset-2 after:content-['']"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Carte d'affirmation compacte (texte fluide, 3-4 lignes max au pire) */}
          <div
            ref={cardRef}
            key={idx}
            tabIndex={-1}
            role="group"
            aria-label={L.question}
            className={cn(
              'mt-2.5 rounded-2xl border-2 bg-card p-3.5 shadow-sm outline-none transition-colors sm:p-5',
              reduce ? '' : correct === false ? 'anim-shake' : 'anim-pop-in',
              correct === null
                ? 'border-border'
                : correct
                  ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-500/5'
                  : 'border-rose-400 bg-rose-50/40 dark:bg-rose-500/5',
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-xs',
                  CATEGORY_META[stmt.category].chip,
                )}
              >
                <span aria-hidden="true">{CATEGORY_META[stmt.category].icon}</span>
                <span className="truncate">{CATEGORY_META[stmt.category].label[lang]}</span>
              </span>
              <span className="ms-auto flex shrink-0 items-center gap-1.5">
                <span className="hidden text-[10px] text-muted-foreground sm:inline">{t('common.difficulty')}</span>
                <DifficultyDots level={stmt.difficulty} />
              </span>
            </div>
            <p className="font-display text-[clamp(1.05rem,4.5vw,1.5rem)] font-bold leading-snug">{stmt.statement[lang]}</p>
          </div>

          {/* Boutons VRAI / FAUX — min-h-16 côte à côte, toujours au-dessus de la correction */}
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3">
            <button
              type="button"
              disabled={choice !== null}
              aria-keyshortcuts="ArrowLeft t v"
              onClick={() => answer('true')}
              className={cn(
                'no-select flex min-h-16 touch-manipulation items-center justify-center gap-2 rounded-2xl border-2 border-emerald-600 bg-emerald-500 text-base font-extrabold tracking-wide text-white shadow-sm transition-all sm:text-lg',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                choice === null && 'hover:bg-emerald-600 active:scale-[0.98]',
                choice !== null && stmt.answer === 'true' && 'ring-4 ring-emerald-300 dark:ring-emerald-500/40',
                choice !== null && stmt.answer !== 'true' && 'opacity-50',
              )}
            >
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              {L.trueLabel}
            </button>
            <button
              type="button"
              disabled={choice !== null}
              aria-keyshortcuts="ArrowRight f"
              onClick={() => answer('false')}
              className={cn(
                'no-select flex min-h-16 touch-manipulation items-center justify-center gap-2 rounded-2xl border-2 border-rose-600 bg-rose-500 text-base font-extrabold tracking-wide text-white shadow-sm transition-all sm:text-lg',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                choice === null && 'hover:bg-rose-600 active:scale-[0.98]',
                choice !== null && stmt.answer === 'false' && 'ring-4 ring-rose-300 dark:ring-rose-500/40',
                choice !== null && stmt.answer !== 'false' && 'opacity-50',
              )}
            >
              <XCircle className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              {L.falseLabel}
            </button>
          </div>

          {/* Correction compacte : l'explication scrolle DANS son panneau, ne pousse jamais les boutons */}
          {choice !== null ? (
            <div
              role="status"
              aria-live="polite"
              className={cn(
                'mt-3 rounded-2xl border-2 p-3.5 sm:p-4',
                reduce ? '' : 'anim-rise',
                correct
                  ? 'border-emerald-300/70 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                  : 'border-rose-300/70 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/10',
              )}
            >
              <p
                className={cn(
                  'flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-extrabold sm:text-base',
                  correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300',
                )}
              >
                {correct ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                )}
                {correct ? L.rightAnswer : L.wrongAnswer}
                <span className="font-semibold">{stmt.answer === 'true' ? L.wasTrue : L.wasFalse}</span>
              </p>
              <p className="nice-scroll mt-1.5 max-h-[clamp(4.5rem,18dvh,9rem)] overflow-y-auto pr-1 text-[13px] leading-relaxed text-foreground/90 sm:text-sm">
                {stmt.explanation[lang]}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <span
                  className="inline-flex min-w-0 items-center gap-1 rounded-full bg-secondary/80 px-2 py-1 text-[11px] font-bold text-muted-foreground"
                  title={`${L.source} : ${stmt.source}`}
                >
                  <BookMarked className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {L.source} : {stmt.source}
                  </span>
                </span>
                <Button ref={nextBtnRef} size="lg" className="ms-auto h-11 shrink-0 rounded-full px-4 text-sm" onClick={next}>
                  <span className="sm:hidden">{isLast ? L.resultsShort : L.nextShort}</span>
                  <span className="hidden sm:inline">{isLast ? L.seeResults : L.next}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---------- Bilan final (étoiles, ✅❌, XP, records, Rejouer immédiat) ---------- */}
      {phase === 'done' && end ? (
        <div
          className={cn(
            'rounded-2xl border-2 p-4 text-center sm:p-6',
            reduce ? '' : 'anim-rise',
            end.score >= 10 ? 'border-emerald-300/70 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10' : 'border-border bg-card',
          )}
          role="status"
        >
          <p className="font-display text-xl font-extrabold sm:text-2xl">
            {end.stars === 3 ? L.stars3 : end.stars === 2 ? L.stars2 : end.stars === 1 ? L.stars1 : L.stars0}
          </p>
          <div className="mt-1.5 flex justify-center gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <Star key={i} className={cn('h-6 w-6 sm:h-7 sm:w-7', i < end.stars ? 'fill-amber-400 text-amber-400' : 'text-foreground/20')} />
            ))}
          </div>
          <p className="mt-2 font-display text-4xl font-black tabular-nums">
            {end.score}
            <span className="text-xl text-muted-foreground">/{SERIES_LEN}</span>
          </p>
          <p className="mt-1 text-base tracking-widest sm:text-lg" aria-label={`${L.scoreLabel} : ${end.score}/${SERIES_LEN}`}>
            {results.map((r, i) => (
              <span key={i}>{r ? '✅' : '❌'}</span>
            ))}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
            <span className="flex h-9 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-xs font-semibold">
              <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <span className="text-muted-foreground">{L.xpGain}</span>
              <span className="tabular-nums">+{10 * end.score}</span>
            </span>
            <span className="flex h-9 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-xs font-semibold">
              <Flame className="h-4 w-4 text-orange-500" aria-hidden="true" />
              <span className="text-muted-foreground">{t('common.streak')}</span>
              <span className="tabular-nums">×{end.bestStreak}</span>
            </span>
            {end.isRecord ? (
              <span className="flex h-9 items-center gap-1.5 rounded-full bg-amber-100 px-3 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                {t('common.newRecord')}
              </span>
            ) : null}
            {end.dailyFresh ? (
              <span className="flex h-9 items-center gap-1.5 rounded-full bg-amber-100 px-3 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                {L.dailyLogged}
              </span>
            ) : null}
          </div>

          <div className="mt-3.5">
            <RoundEndActions
              gameId={gameId}
              onReplay={() => startSeries(mode)}
              replayLabel={end && end.score >= 10 ? (mode === 'daily' ? L.replayDaily : L.replay) : L.retry}
              primaryRef={replayBtnRef}
              iq={end.iq}
              shareResult={
                end ? `${end.score}/${SERIES_LEN} · ${Math.round((end.score / SERIES_LEN) * 100)}%` : undefined
              }
            />
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Button size="lg" variant="secondary" className="h-11 rounded-full px-5" onClick={quitToMenu}>
              {L.menu}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
