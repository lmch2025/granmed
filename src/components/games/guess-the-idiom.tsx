'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Play, CalendarCheck, RotateCcw, Share2, SkipForward, Trophy, Zap, MessageSquareQuote, Home, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, mulberry32, seedFromString, shuffle, shareText, useReducedMotion } from '@/lib/utils-game'
import { loadSave, saveSave } from '@/lib/save'
import type { GameSEOContent } from '@/lib/games/types'
import { FR_IDIOMS, EN_IDIOMS } from '@/components/games/data/guess-the-idiom-data'
import type { IdiomCategory, IdiomEntry } from '@/components/games/data/guess-the-idiom-data'
import { Button } from '@/components/ui/button'
import { DifficultyDots } from '@/components/shared/ui-bits'
import { Confetti } from '@/components/shared/confetti'
import { toast } from 'sonner'

export const gameId = 'guess-the-idiom'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Retrouvez cinq expressions populaires à partir de leur définition, avec indices payants et bonus de rapidité.',
    en: 'Guess five popular idioms from their definitions, with paid hints and speed bonuses.',
  },
  description: {
    fr: [
      'Devine l’Expression est un jeu de mots et de culture gratuit en ligne dans lequel vous devez retrouver une expression populaire — comme « poser un lapin » ou « prendre le taureau par les cornes » — à partir de sa seule définition. Les lettres de l’expression sont cachées dans des cases : tapez votre réponse au clavier et les lettres correctes s’illuminent en direct.',
      'Chaque manche affiche la définition de l’expression, sa catégorie (animaux, nourriture, temps, corps, quotidien) et sa difficulté. Trois indices sont disponibles au prix de quelques points — révéler la première lettre, révéler une lettre au hasard ou afficher la lecture littérale de l’expression — et vous pouvez passer si vous séchez. Après chaque manche, une carte « Le saviez-vous ? » raconte l’origine de l’expression.',
      'Le jeu existe en deux langues avec de vraies adaptations culturelles : la version française joue avec des expressions françaises, la version anglaise avec des idiomes anglais. Le défi du jour propose les mêmes trois expressions à tous les joueurs d’une même langue, et vos records (meilleur score, expressions trouvées au total) sont sauvegardés sur votre appareil.',
    ],
    en: [
      'Guess the Idiom is a free online word and culture game in which you must identify a popular idiom — such as “to let the cat out of the bag” or “the ball is in your court” — from its definition alone. The letters of the expression are hidden in slots: type your answer and watch the correct letters light up live as you go.',
      'Each round shows the idiom’s definition, its category (animals, food, time, body, everyday life) and its difficulty. Three hints are available for a few points — reveal the first letter, reveal a random letter or display the literal word-by-word reading — and you can skip an expression if you are stuck. After every round, a “Did you know?” card tells the story behind the idiom.',
      'The game is a genuine cultural adaptation: the French version plays with French idioms, the English version with English idioms. The daily challenge gives everyone the same three expressions, and your records (best score, total idioms solved) are saved on your device.',
    ],
  },
  rules: {
    fr: [
      'Lisez la définition affichée et observez les cases : elles cachent les lettres de l’expression (espaces, apostrophes et tirets restent visibles).',
      'Tapez votre réponse dans le champ : chaque lettre correcte s’illumine, une lettre incorrecte s’affiche en rouge et tremble.',
      'Appuyez sur Entrée pour valider : la bonne réponse résout la manche, une erreur coûte 10 points mais vous pouvez réessayer.',
      'Utilisez les indices si besoin : première lettre (−20), lettre au hasard (−20), lecture littérale (−30).',
      'Une manche résolue rapporte 100 points, moins le coût des indices et des erreurs, plus un bonus de rapidité allant jusqu’à +20 si vous trouvez en moins de 15 secondes.',
      'Après chaque manche, lisez l’origine de l’expression puis passez à la suivante jusqu’au bilan final sur 5 manches (3 pour le défi du jour).',
    ],
    en: [
      'Read the definition and look at the slots: they hide the letters of the idiom (spaces, apostrophes and hyphens stay visible).',
      'Type your answer in the field: each correct letter lights up, an incorrect one shows in red and shakes.',
      'Press Enter to submit: the right answer solves the round, a mistake costs 10 points but you can try again.',
      'Use hints if needed: first letter (−20), random letter (−20), literal reading (−30).',
      'A solved round earns 100 points, minus hint costs and mistakes, plus a speed bonus of up to +20 if you solve it in under 15 seconds.',
      'After each round, read the origin of the idiom then move on until the final summary over 5 rounds (3 for the daily challenge).',
    ],
  },
  controls: {
    fr: [
      'Clavier : tapez l’expression, Entrée pour valider. Les accents sont acceptés (é = e) et les espaces sont facultatifs.',
      'Souris / tactile : appuyez sur les boutons d’indices, Passer, puis Suivant pour changer de manche.',
      'Le champ de réponse reprend le focus automatiquement à chaque manche.',
    ],
    en: [
      'Keyboard: type the idiom, press Enter to submit. Accents are accepted (é = e) and spaces are optional.',
      'Mouse / touch: tap the hint buttons, Skip, then Next to move to the next round.',
      'The answer field is automatically focused at the start of every round.',
    ],
  },
  features: {
    fr: [
      '45 expressions françaises et 45 idiomes anglais : une vraie adaptation culturelle par langue.',
      'Révélation en direct des lettres au fil de la frappe, avec secousse en cas d’erreur.',
      'Trois indices progressifs et un bouton Passer pour ne jamais rester bloqué.',
      'Carte « Le saviez-vous ? » après chaque manche : l’origine vérifiée de l’expression.',
      'Défi du jour de 3 expressions identiques pour tous les joueurs de la même langue.',
      'Records sauvegardés (meilleur score, expressions trouvées au total) et succès à débloquer.',
    ],
    en: [
      '45 French idioms and 45 English idioms: a genuine cultural adaptation per language.',
      'Live letter reveal as you type, with a shake on mismatches.',
      'Three progressive hints and a Skip button so you never stay stuck.',
      'A “Did you know?” card after each round: the verified origin of the idiom.',
      'A daily challenge of 3 identical expressions for everyone playing the same language.',
      'Saved records (best score, total idioms solved) and achievements to unlock.',
    ],
  },
  tips: {
    fr: [
      'Cherchez d’abord le verbe ou le nom le plus imagé de la définition : c’est souvent le cœur de l’expression.',
      'La catégorie (animaux, nourriture…) est un indice à elle seule : « avoir un chat dans la gorge » ne peut être que dans Animaux.',
      'Tapez une première version même incomplète : les lettres vertes confirment le début de l’expression.',
      'Gardez la lecture littérale (−30) pour les expressions résistantes : elle révèle souvent l’image d’origine.',
      'Le bonus de rapidité (jusqu’à +20) récompense les intuitions bien senties : osez dès que vous avez une idée.',
    ],
    en: [
      'Look for the most vivid verb or noun in the definition: it is often the heart of the idiom.',
      'The category (animals, food…) is a hint in itself: start by ruling out impossible themes.',
      'Type a first guess even if incomplete: green letters confirm the start of the expression.',
      'Save the literal reading (−30) for stubborn idioms: it often reveals the original image.',
      'The speed bonus (up to +20) rewards well-aimed first instincts: trust your gut when you have one.',
    ],
  },
  faq: {
    fr: [
      { q: 'Le jeu Devine l’Expression est-il vraiment gratuit ?', a: 'Oui, le jeu est entièrement gratuit, sans inscription ni téléchargement, directement dans votre navigateur.' },
      { q: 'Les expressions sont-elles les mêmes en français et en anglais ?', a: 'Non : chaque langue joue avec ses propres expressions. La version française utilise des expressions françaises et la version anglaise des idiomes anglais — c’est une adaptation culturelle, pas une traduction.' },
      { q: 'Comment fonctionne le score ?', a: 'Chaque expression résolue rapporte 100 points, desquels sont retranchés le coût des indices utilisés (20 à 30 points) et 10 points par mauvaise réponse. Un bonus de rapidité allant jusqu’à +20 points s’ajoute si vous trouvez en moins de 15 secondes.' },
      { q: 'Que m’apprend la carte « Le saviez-vous ? » ?', a: 'Après chaque manche, elle affiche l’origine historique vérifiée de l’expression. Quand cette origine est débattue ou incertaine, une phrase de remplacement vous l’indique honnêtement.' },
      { q: 'Puis-je rejouer au défi du jour ?', a: 'Vous pouvez le rejouer pour le plaisir, mais les trois expressions du jour restent les mêmes et le défi n’est compté qu’une seule fois.' },
    ],
    en: [
      { q: 'Is Guess the Idiom really free?', a: 'Yes, the game is completely free, with no sign-up or download, straight in your browser.' },
      { q: 'Are the expressions the same in French and English?', a: 'No: each language plays with its own idioms. The French version uses French expressions and the English version English idioms — a cultural adaptation, not a translation.' },
      { q: 'How does scoring work?', a: 'Each solved idiom earns 100 points, minus the cost of the hints used (20 to 30 points) and 10 points per wrong submission. A speed bonus of up to +20 is added if you solve it in under 15 seconds.' },
      { q: 'What does the “Did you know?” card teach me?', a: 'After each round it shows the verified historical origin of the idiom. When that origin is debated or uncertain, an honest fallback sentence tells you so.' },
      { q: 'Can I replay the daily challenge?', a: 'You can replay it for fun, but the three expressions of the day stay the same and the challenge only counts once.' },
    ],
  },
  records: {
    'best-score': { fr: 'Meilleur score', en: 'Best score' },
    'total-solved': { fr: 'Expressions trouvées (total)', en: 'Idioms solved (total)' },
  },
}

/* ================= Constantes & helpers ================= */

const ROUNDS_FREE = 5
const ROUNDS_DAILY = 3
const SPEED_WINDOW_S = 15
const MAX_SPEED_BONUS = 20
const COST_FIRST = 20
const COST_RANDOM = 20
const COST_LITERAL = 30
const WRONG_PENALTY = 10

const CATEGORIES: Record<IdiomCategory, { icon: string; label: Record<'fr' | 'en', string> }> = {
  animaux: { icon: '🐾', label: { fr: 'Animaux', en: 'Animals' } },
  nourriture: { icon: '🍎', label: { fr: 'Nourriture', en: 'Food' } },
  temps: { icon: '⏳', label: { fr: 'Temps', en: 'Time' } },
  corps: { icon: '🫀', label: { fr: 'Corps', en: 'Body' } },
  quotidien: { icon: '🏠', label: { fr: 'Quotidien', en: 'Everyday' } },
}

/** é→e, è→e, à→a, ç→c… et ligatures œ→oe, æ→ae (décomposition NFD + retrait des diacritiques). */
function foldAccents(s: string): string {
  return s
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'OE')
    .replace(/æ/g, 'ae')
    .replace(/Æ/g, 'AE')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Valeur du champ : majuscules sans accents, lettres + espace/apostrophe/tiret conservés. */
function normalizeInput(v: string): string {
  return foldAccents(v)
    .replace(/’/g, "'")
    .toUpperCase()
    .replace(/[^A-Z' -]/g, '')
}

type Slot = { kind: 'sep'; ch: string } | { kind: 'letter'; ch: string; li: number }

interface ParsedExpression {
  slots: Slot[]
  letters: string
}

/** Découpe l'expression : une case par lettre (index li), séparateurs toujours visibles. */
function parseExpression(expr: string): ParsedExpression {
  const slots: Slot[] = []
  let letters = ''
  const folded = foldAccents(expr).replace(/’/g, "'")
  for (const ch of folded) {
    if (/^[a-z]$/i.test(ch)) {
      const up = ch.toUpperCase()
      slots.push({ kind: 'letter', ch: up, li: letters.length })
      letters += up
    } else if (ch === "'") {
      slots.push({ kind: 'sep', ch: "'" })
    } else {
      slots.push({ kind: 'sep', ch })
    }
  }
  return { slots, letters }
}

function pickDaily(lang: 'fr' | 'en', count: number): IdiomEntry[] {
  const pool = lang === 'fr' ? FR_IDIOMS : EN_IDIOMS
  const rand = mulberry32(seedFromString(`${gameId}:${todayKey()}`))
  const idxs = new Set<number>()
  while (idxs.size < count) idxs.add(Math.floor(rand() * pool.length))
  return [...idxs].map((i) => pool[i])
}

function pickFree(lang: 'fr' | 'en', count: number): IdiomEntry[] {
  const pool = lang === 'fr' ? FR_IDIOMS : EN_IDIOMS
  return shuffle(
    pool.map((_, i) => i),
    Math.random,
  )
    .slice(0, count)
    .map((i) => pool[i])
}

/* ================= Composant principal ================= */
export default function GuessTheIdiomGame() {
  const lang = useLang()
  const reduce = useReducedMotion()
  const dailyDone = useIsDailyDone(gameId)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)

  const [phase, setPhase] = useState<'menu' | 'playing' | 'fact' | 'end'>('menu')
  const [mode, setMode] = useState<'free' | 'daily'>('free')
  const [rounds, setRounds] = useState<IdiomEntry[]>([])
  const [roundIdx, setRoundIdx] = useState(0)
  const [results, setResults] = useState<('solved' | 'skipped')[]>([])
  const [typed, setTyped] = useState('')
  const [hintRevealed, setHintRevealed] = useState<boolean[]>([])
  const [literalShown, setLiteralShown] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)
  const [hintCost, setHintCost] = useState(0)
  const [score, setScore] = useState(0)
  const [solvedCount, setSolvedCount] = useState(0)
  const [noHintStreak, setNoHintStreak] = useState(0)
  const [factData, setFactData] = useState<{ solved: boolean; points: number; speed: number; noHint: boolean } | null>(null)
  const [endData, setEndData] = useState<{ score: number; solved: number; total: number; won: boolean; isRecord: boolean } | null>(null)
  const [shakeKey, setShakeKey] = useState(0)
  const [wrongNotice, setWrongNotice] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const roundStartRef = useRef(0)
  const speedTotalRef = useRef(0)
  const totalSolvedRef = useRef(0)

  const L = {
    fr: {
      freeGame: 'Partie libre',
      freeSub: '5 expressions au hasard, indices en option',
      dailyGame: 'Défi du jour',
      dailySub: '3 expressions — les mêmes pour tous',
      dailyDone: 'Défi du jour réussi',
      round: 'Manche',
      score: 'Score',
      placeholder: 'Tapez l’expression…',
      submit: 'Valider',
      wrongNotice: 'Pas encore — −10 points',
      skip: 'Passer',
      skipCost: '0 point',
      hintFirst: 'Première lettre',
      hintRandom: 'Lettre au hasard',
      hintLiteral: 'Lecture littérale',
      literalReading: 'Lecture littérale :',
      didYouKnow: 'Le saviez-vous ?',
      next: 'Suivant',
      seeResults: 'Voir le bilan',
      wellDone: 'Bravo, expression trouvée !',
      answerWas: 'La réponse était :',
      points: 'points',
      speedBonus: 'Bonus rapidité',
      noHintSolve: 'Résolue sans indice !',
      finalTitle: 'Partie terminée !',
      solvedCount: 'Expressions trouvées',
      playAgain: 'Rejouer',
      menu: 'Menu',
      share: 'Partager',
      newRecord: 'Nouveau record !',
      fallbackOrigin:
        'Cette expression fait partie du langage courant depuis longtemps ; son origine exacte reste débattue par les spécialistes.',
      shareTitle: 'Granmed — Devine l’Expression',
      copied: 'Copié !',
      play: 'Jouer',
    },
    en: {
      freeGame: 'Free game',
      freeSub: '5 random idioms, optional hints',
      dailyGame: 'Daily challenge',
      dailySub: '3 idioms — the same for everyone',
      dailyDone: 'Daily challenge complete',
      round: 'Round',
      score: 'Score',
      placeholder: 'Type the idiom…',
      submit: 'Submit',
      wrongNotice: 'Not yet — −10 points',
      skip: 'Skip',
      skipCost: '0 points',
      hintFirst: 'First letter',
      hintRandom: 'Random letter',
      hintLiteral: 'Literal reading',
      literalReading: 'Literal reading:',
      didYouKnow: 'Did you know?',
      next: 'Next',
      seeResults: 'See results',
      wellDone: 'Well done, idiom found!',
      answerWas: 'The answer was:',
      points: 'points',
      speedBonus: 'Speed bonus',
      noHintSolve: 'Solved without hints!',
      finalTitle: 'Game over!',
      solvedCount: 'Idioms solved',
      playAgain: 'Play again',
      menu: 'Menu',
      share: 'Share',
      newRecord: 'New personal best!',
      fallbackOrigin:
        'This idiom has been part of everyday language for a long time; its exact origin is still debated by specialists.',
      shareTitle: 'Granmed — Guess the Idiom',
      copied: 'Copied!',
      play: 'Play',
    },
  }[lang]

  /* --- Total d'expressions trouvées (persisté, lu une fois au montage) --- */
  useEffect(() => {
    const s = loadSave<{ totalSolved?: number }>(gameId)
    if (s && typeof s.totalSolved === 'number') totalSolvedRef.current = s.totalSolved
  }, [])

  /* --- Focus automatique du champ à chaque manche --- */
  useEffect(() => {
    if (phase === 'playing') inputRef.current?.focus()
  }, [phase, roundIdx])

  const entry = rounds[roundIdx]
  const parsed = useMemo(() => (entry ? parseExpression(entry.expression) : null), [entry])
  const typedLetters = useMemo(() => typed.replace(/[^A-Z]/g, ''), [typed])
  /* Positions encore candidates à une révélation aléatoire (non révélées, pas déjà tapées juste). */
  const randomCandidates = useMemo(() => {
    if (!parsed) return []
    const out: number[] = []
    for (let i = 0; i < parsed.letters.length; i++) {
      if (hintRevealed[i]) continue
      if (i < typedLetters.length && typedLetters[i] === parsed.letters[i]) continue
      out.push(i)
    }
    return out
  }, [parsed, hintRevealed, typedLetters])

  const resetRound = useCallback(() => {
    setTyped('')
    setHintRevealed([])
    setLiteralShown(false)
    setWrongCount(0)
    setHintCost(0)
    setWrongNotice(false)
    roundStartRef.current = Date.now()
  }, [])

  const startGame = useCallback(
    (m: 'free' | 'daily') => {
      const chosen = m === 'daily' ? pickDaily(lang, ROUNDS_DAILY) : pickFree(lang, ROUNDS_FREE)
      setMode(m)
      setRounds(chosen)
      setRoundIdx(0)
      setResults([])
      setScore(0)
      setSolvedCount(0)
      setNoHintStreak(0)
      setFactData(null)
      setEndData(null)
      speedTotalRef.current = 0
      resetRound()
      setPhase('playing')
      addPlay(gameId)
    },
    [lang, addPlay, resetRound],
  )

  /* --- Résolution d'une manche (depuis le handler de soumission, jamais un effet) --- */
  function onSolve() {
    const elapsedS = (Date.now() - roundStartRef.current) / 1000
    const speed = elapsedS < SPEED_WINDOW_S ? Math.max(0, Math.round((MAX_SPEED_BONUS * (SPEED_WINDOW_S - elapsedS)) / SPEED_WINDOW_S)) : 0
    const points = Math.max(0, 100 - hintCost - wrongCount * WRONG_PENALTY + speed)
    speedTotalRef.current += speed
    setScore((s) => s + points)
    setSolvedCount((c) => c + 1)
    setResults((r) => [...r, 'solved'])
    setWrongNotice(false)
    sfx.play('correct')

    const newStreak = hintCost === 0 ? noHintStreak + 1 : 0
    setNoHintStreak(newStreak)
    if (newStreak >= 3) unlockBadge('idiom-streak3')

    totalSolvedRef.current += 1
    saveSave(gameId, { totalSolved: totalSolvedRef.current })
    setBest(gameId, 'total-solved', totalSolvedRef.current)
    if (totalSolvedRef.current >= 10) unlockBadge('idiom-10')

    setFactData({ solved: true, points, speed, noHint: hintCost === 0 })
    setPhase('fact')
  }

  function onSkip() {
    sfx.play('swish')
    setNoHintStreak(0)
    setResults((r) => [...r, 'skipped'])
    setFactData({ solved: false, points: 0, speed: 0, noHint: false })
    setPhase('fact')
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (phase !== 'playing' || !parsed) return
    const guess = typedLetters
    if (!guess) return
    if (guess === parsed.letters) {
      onSolve()
    } else {
      sfx.play('wrong', { volume: 0.35 })
      setWrongCount((w) => w + 1)
      setWrongNotice(true)
      setShakeKey((k) => k + 1)
    }
  }

  /* --- Indices --- */
  function revealFirst() {
    if (phase !== 'playing' || !parsed || hintRevealed[0]) return
    sfx.play('reveal')
    const next = [...hintRevealed]
    while (next.length < 1) next.push(false)
    next[0] = true
    setHintRevealed(next)
    setHintCost((c) => c + COST_FIRST)
  }

  function revealRandom() {
    if (phase !== 'playing' || randomCandidates.length === 0) return
    const pick = randomCandidates[Math.floor(Math.random() * randomCandidates.length)]
    if (!parsed) return
    sfx.play('reveal')
    const next = [...hintRevealed]
    while (next.length < parsed.letters.length) next.push(false)
    next[pick] = true
    setHintRevealed(next)
    setHintCost((c) => c + COST_RANDOM)
  }

  function showLiteral() {
    if (phase !== 'playing' || literalShown) return
    sfx.play('reveal')
    setLiteralShown(true)
    setHintCost((c) => c + COST_LITERAL)
  }

  /* --- Fin de partie (appelée depuis le handler « Suivant ») --- */
  function endGame() {
    const isRecord = setBest(gameId, 'best-score', score)
    addXp(15 * solvedCount + speedTotalRef.current)
    const won = rounds.length === ROUNDS_DAILY ? solvedCount >= ROUNDS_DAILY : solvedCount >= 4
    if (won) {
      sfx.play('win')
      setConfettiKey((k) => k + 1)
      addWin(gameId)
    }
    if (mode === 'daily') completeDaily(gameId)
    setEndData({ score, solved: solvedCount, total: rounds.length, won, isRecord })
    setPhase('end')
  }

  function onNext() {
    sfx.play('click')
    if (roundIdx + 1 >= rounds.length) {
      endGame()
      return
    }
    setRoundIdx((i) => i + 1)
    resetRound()
    setPhase('playing')
  }

  async function onShare() {
    sfx.play('click')
    const url =
      typeof window !== 'undefined'
        ? `${window.location.href.split('#')[0]}#/${lang === 'fr' ? 'fr/devine-expression' : 'en/guess-the-idiom'}`
        : ''
    const solved = endData?.solved ?? solvedCount
    const total = endData?.total ?? rounds.length
    const sc = endData?.score ?? score
    const text =
      lang === 'fr'
        ? `J’ai trouvé ${solved}/${total} expressions et marqué ${sc} points à Devine l’Expression sur Granmed ! Peux-tu faire mieux ? ${url}`
        : `I guessed ${solved}/${total} idioms and scored ${sc} points on Guess the Idiom at Granmed! Can you beat that? ${url}`
    const ok = await shareText(L.shareTitle, text)
    if (ok) toast.success(L.copied)
  }

  /* ================= Rendu ================= */
  return (
    <div className="relative select-none">
      <Confetti fire={confettiKey} count={reduce ? 0 : 110} />

      {/* ===== Écran de menu ===== */}
      {phase === 'menu' ? (
        <div className="checkerboard flex min-h-[340px] flex-col items-center justify-center gap-4 rounded-2xl border p-6 text-center">
          <div className="flex gap-2 text-4xl" aria-hidden="true">
            {['💬', '🐇', '🐂'].map((e, i) => (
              <span key={i} className={reduce ? '' : 'anim-floaty'} style={{ animationDelay: `${i * 0.4}s` }}>
                {e}
              </span>
            ))}
          </div>
          <p className="max-w-md text-sm text-muted-foreground">{content.tagline[lang]}</p>
          <div className="mt-2 flex w-full max-w-sm flex-col gap-2.5">
            {!dailyDone ? (
              <button
                type="button"
                onClick={() => {
                  sfx.play('pop')
                  startGame('daily')
                }}
                className="flex items-center gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3.5 text-left transition-transform hover:scale-[1.01] dark:border-amber-500/25 dark:bg-amber-500/10"
              >
                <span className="text-2xl" aria-hidden="true">🎁</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-amber-700 dark:text-amber-300">
                    {L.dailyGame} — {todayKey()}
                  </span>
                  <span className="block text-xs text-muted-foreground">{L.dailySub}</span>
                </span>
                <span className="rounded-full bg-amber-500 px-3.5 py-2.5 text-xs font-bold text-white">{L.play}</span>
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/60 bg-emerald-50/70 px-4 py-3.5 text-sm font-bold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" /> {L.dailyDone} ✅
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                sfx.play('click')
                startGame('free')
              }}
              className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 text-left transition-transform hover:scale-[1.01]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-400 text-white">
                <Play className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{L.freeGame}</span>
                <span className="block text-xs text-muted-foreground">{L.freeSub}</span>
              </span>
              <span className="rounded-full bg-secondary px-3.5 py-2.5 text-xs font-bold">{L.play}</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* ===== Manche en cours / carte « Le saviez-vous ? » ===== */}
      {phase === 'playing' || phase === 'fact' ? (
        <div className="anim-rise">
          {/* Barre d'état */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="flex h-11 items-center gap-2 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
              <MessageSquareQuote className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-muted-foreground">{L.round}</span>
              <span className="tabular-nums">
                {roundIdx + 1}/{rounds.length}
              </span>
            </span>
            <span className="flex h-11 items-center gap-2 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
              <Zap className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-muted-foreground">{L.score}</span>
              <span className="tabular-nums">{score}</span>
            </span>
            {mode === 'daily' ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                {L.dailyGame}
              </span>
            ) : null}
            <span className="ms-auto flex items-center gap-1" aria-hidden="true">
              {rounds.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    i < roundIdx
                      ? results[i] === 'solved'
                        ? 'bg-emerald-400'
                        : 'bg-rose-300'
                      : i === roundIdx
                        ? 'w-6 bg-primary/60'
                        : 'w-3 bg-border',
                  )}
                />
              ))}
            </span>
          </div>

          {/* Carte définition */}
          {entry ? (
            <div className="rounded-2xl border bg-secondary/40 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  <span aria-hidden="true">{CATEGORIES[entry.category].icon}</span>
                  {CATEGORIES[entry.category].label[lang]}
                </span>
                <DifficultyDots level={entry.difficulty} />
              </div>
              <p className="text-base italic leading-relaxed sm:text-lg">« {entry.definition[lang]} »</p>
            </div>
          ) : null}

          {/* Cases des lettres */}
          {parsed ? (
            <div
              key={shakeKey}
              className={cn('mt-4 flex flex-wrap items-center justify-center gap-1.5', shakeKey > 0 && 'anim-shake')}
              aria-label={phase === 'playing' ? (lang === 'fr' ? 'Lettres cachées de l’expression' : 'Hidden letters of the idiom') : (entry?.expression ?? '')}
            >
              {parsed.slots.map((slot, i) => {
                if (slot.kind === 'sep') {
                  return (
                    <span key={i} className="flex h-11 w-3.5 items-end justify-center pb-1 text-lg font-bold text-muted-foreground sm:h-12 sm:w-4">
                      {slot.ch === ' ' ? '\u00A0' : slot.ch}
                    </span>
                  )
                }
                const isHint = hintRevealed[slot.li] === true
                const typedCh = slot.li < typedLetters.length ? typedLetters[slot.li] : null
                const match = typedCh === slot.ch
                const revealAll = phase === 'fact'
                const shown = isHint || revealAll ? slot.ch : (typedCh ?? '·')
                return (
                  <div
                    key={`${i}-${typedCh ?? 'x'}`}
                    className={cn(
                      'flex h-11 w-8 items-center justify-center rounded-lg border-2 font-display text-lg font-bold transition-colors sm:h-12 sm:w-9 sm:text-xl',
                      revealAll && factData?.solved
                        ? 'anim-pop-in border-emerald-400 bg-emerald-100 text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-500/20 dark:text-emerald-300'
                        : revealAll
                          ? 'anim-pop-in border-primary/50 bg-primary/10 text-foreground'
                          : isHint
                            ? 'border-amber-400 bg-amber-100 text-amber-700 dark:border-amber-500/60 dark:bg-amber-500/20 dark:text-amber-300'
                            : typedCh === null
                              ? 'border-border bg-card text-muted-foreground'
                              : match
                                ? 'border-emerald-400 bg-emerald-100 text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-500/20 dark:text-emerald-300'
                                : 'anim-shake border-rose-300 bg-rose-100 text-rose-600 dark:border-rose-500/60 dark:bg-rose-500/20 dark:text-rose-300',
                    )}
                  >
                    {shown}
                  </div>
                )
              })}
            </div>
          ) : null}

          {/* Lecture littérale (indice) */}
          {literalShown && entry ? (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              👀 <span className="font-semibold">{L.literalReading}</span>{' '}
              <span className="italic">« {entry.literal[lang]} »</span>
            </p>
          ) : null}

          {/* Saisie + indices */}
          {phase === 'playing' ? (
            <>
              <form onSubmit={onSubmit} className="mt-4 flex flex-col items-center gap-2.5 sm:flex-row">
                <input
                  ref={inputRef}
                  type="text"
                  value={typed}
                  onChange={(e) => {
                    setWrongNotice(false)
                    setTyped(normalizeInput(e.target.value))
                  }}
                  placeholder={L.placeholder}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  maxLength={parsed ? parsed.letters.length + 10 : 40}
                  aria-label={L.placeholder}
                  className="h-12 w-full rounded-xl border-2 border-border bg-card px-4 text-center font-display text-lg font-bold tracking-wide uppercase focus:border-primary focus:outline-none"
                />
                <Button type="submit" size="lg" className="h-12 w-full shrink-0 rounded-xl px-6 sm:w-auto">
                  {L.submit}
                </Button>
              </form>

              {wrongNotice ? (
                <p className="mt-2 text-center text-sm font-semibold text-rose-500" role="alert">
                  {L.wrongNotice}
                </p>
              ) : null}

              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={revealFirst}
                  disabled={hintRevealed[0] === true}
                  className="flex min-h-[60px] flex-col items-center justify-center gap-0.5 rounded-xl border border-amber-300/60 bg-amber-50/60 px-2 py-2 text-center transition-colors hover:border-amber-400 disabled:opacity-40 dark:border-amber-500/25 dark:bg-amber-500/10"
                >
                  <span className="text-sm font-bold">🔤 {L.hintFirst}</span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">−{COST_FIRST} {L.points}</span>
                </button>
                <button
                  type="button"
                  onClick={revealRandom}
                  disabled={randomCandidates.length === 0}
                  className="flex min-h-[60px] flex-col items-center justify-center gap-0.5 rounded-xl border border-amber-300/60 bg-amber-50/60 px-2 py-2 text-center transition-colors hover:border-amber-400 disabled:opacity-40 dark:border-amber-500/25 dark:bg-amber-500/10"
                >
                  <span className="text-sm font-bold">🎲 {L.hintRandom}</span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">−{COST_RANDOM} {L.points}</span>
                </button>
                <button
                  type="button"
                  onClick={showLiteral}
                  disabled={literalShown}
                  className="flex min-h-[60px] flex-col items-center justify-center gap-0.5 rounded-xl border border-amber-300/60 bg-amber-50/60 px-2 py-2 text-center transition-colors hover:border-amber-400 disabled:opacity-40 dark:border-amber-500/25 dark:bg-amber-500/10"
                >
                  <span className="text-sm font-bold">👀 {L.hintLiteral}</span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">−{COST_LITERAL} {L.points}</span>
                </button>
              </div>

              <div className="mt-2.5 text-center">
                <button
                  type="button"
                  onClick={onSkip}
                  className="inline-flex h-11 items-center gap-1.5 rounded-full border border-dashed px-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <SkipForward className="h-4 w-4" aria-hidden="true" /> {L.skip} ({L.skipCost})
                </button>
              </div>
            </>
          ) : null}

          {/* Carte « Le saviez-vous ? » */}
          {phase === 'fact' && factData && entry ? (
            <div className="anim-rise mt-4 rounded-2xl border-2 border-amber-300/60 bg-amber-50/70 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
              <p className="font-display text-lg font-extrabold text-amber-700 dark:text-amber-300">
                {factData.solved ? `✅ ${L.wellDone}` : `💡 ${L.answerWas}`}
              </p>
              {factData.solved ? (
                <p className="mt-1 text-sm font-semibold">
                  +{factData.points} {L.points}
                  {factData.speed > 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {' '}
                      ({L.speedBonus} +{factData.speed})
                    </span>
                  ) : null}
                  {factData.noHint ? <span className="text-amber-600 dark:text-amber-400"> · {L.noHintSolve}</span> : null}
                </p>
              ) : (
                <p className="mt-1 text-sm font-semibold text-muted-foreground">« {entry.expression} »</p>
              )}
              <div className="mt-3 rounded-xl border bg-card/70 p-3">
                <p className="font-display text-sm font-bold">💡 {L.didYouKnow}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {entry.origin ? entry.origin[lang] : L.fallbackOrigin}
                </p>
              </div>
              <div className="mt-3 text-center">
                <Button size="lg" className="rounded-full px-6" onClick={onNext}>
                  {roundIdx + 1 >= rounds.length ? L.seeResults : L.next}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ===== Écran final ===== */}
      {phase === 'end' && endData ? (
        <div
          className={cn(
            'anim-rise rounded-2xl border-2 p-6 text-center',
            endData.won
              ? 'border-emerald-300/60 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'
              : 'border-border bg-secondary/40',
          )}
          role="status"
        >
          <p className={cn('font-display text-2xl font-extrabold', endData.won ? 'text-emerald-700 dark:text-emerald-300' : '')}>
            {endData.won ? `🎉 ${L.finalTitle}` : L.finalTitle}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
            <StatPill icon={<Zap className="h-4 w-4" aria-hidden="true" />} label={L.score} value={endData.score} />
            <StatPill icon={<Trophy className="h-4 w-4" aria-hidden="true" />} label={L.solvedCount} value={`${endData.solved}/${endData.total}`} />
            {endData.isRecord ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Trophy className="h-4 w-4" aria-hidden="true" /> {L.newRecord}
              </span>
            ) : null}
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <Button size="lg" className="rounded-full" onClick={() => startGame(mode)}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> {L.playAgain}
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full" onClick={() => setPhase('menu')}>
              <Home className="h-4 w-4" aria-hidden="true" /> {L.menu}
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full" onClick={onShare}>
              <Share2 className="h-4 w-4" aria-hidden="true" /> {L.share}
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
      <span className="text-muted-foreground" aria-hidden="true">{icon}</span>
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
