'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Play,
  CalendarCheck,
  RotateCcw,
  SkipForward,
  Trophy,
  Zap,
  MessageSquareQuote,
  Home,
  ChevronRight,
  X,
  Delete,
  CornerDownLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, mulberry32, seedFromString, shuffle, useReducedMotion } from '@/lib/utils-game'
import { loadSave, saveSave } from '@/lib/save'
import type { GameSEOContent } from '@/lib/games/types'
import { computeIq } from '@/lib/games/iq'
import { FR_IDIOMS, EN_IDIOMS } from '@/components/games/data/guess-the-idiom-data'
import type { IdiomCategory, IdiomEntry } from '@/components/games/data/guess-the-idiom-data'
import { Button } from '@/components/ui/button'
import { DifficultyDots } from '@/components/shared/ui-bits'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'

export const gameId = 'guess-the-idiom'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Retrouvez cinq expressions populaires à partir de leur définition : précision, rapidité… et QI estimé à la clé.',
    en: 'Guess five popular idioms from their definitions: accuracy, speed… and an estimated IQ to match.',
  },
  description: {
    fr: [
      'Devine l’Expression est un jeu de mots et de culture gratuit en ligne dans lequel vous devez retrouver une expression populaire — comme « poser un lapin » ou « prendre le taureau par les cornes » — à partir de sa seule définition. Les lettres de l’expression sont cachées dans des cases : tapez votre réponse et les lettres correctes s’illuminent en direct.',
      'Chaque manche affiche la définition de l’expression, sa catégorie (animaux, nourriture, temps, corps, quotidien) et sa difficulté. Trois indices sont disponibles au prix de quelques points — révéler la première lettre, révéler une lettre au hasard ou afficher la lecture littérale de l’expression — et vous pouvez passer si vous séchez. Au bilan, un QI estimé — calculé à partir de votre précision, de votre rapidité et de la difficulté — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant. Après chaque manche, une carte « Le saviez-vous ? » raconte l’origine de l’expression.',
      'Le jeu existe en deux langues avec de vraies adaptations culturelles : la version française joue avec des expressions françaises, la version anglaise avec des idiomes anglais. Le défi du jour propose les mêmes trois expressions à tous les joueurs d’une même langue, une partie en cours est restaurée automatiquement, et vos records (meilleur score, expressions trouvées au total) sont sauvegardés sur votre appareil.',
    ],
    en: [
      'Guess the Idiom is a free online word and culture game in which you must identify a popular idiom — such as “to let the cat out of the bag” or “the ball is in your court” — from its definition alone. The letters of the expression are hidden in slots: type your answer and watch the correct letters light up live as you go.',
      'Each round shows the idiom’s definition, its category (animals, food, time, body, everyday life) and its difficulty. Three hints are available for a few points — reveal the first letter, reveal a random letter or display the literal word-by-word reading — and you can skip an expression if you are stuck. At the summary, an estimated IQ — computed from your accuracy, speed and the difficulty — assigns you an intelligence level, from Novice to Genius, to raise as you replay. After every round, a “Did you know?” card tells the story behind the idiom.',
      'The game is a genuine cultural adaptation: the French version plays with French idioms, the English version with English idioms. The daily challenge gives everyone the same three expressions, an unfinished game is restored automatically, and your records (best score, total idioms solved) are saved on your device.',
    ],
  },
  rules: {
    fr: [
      'Lisez la définition affichée et observez les cases : elles cachent les lettres de l’expression (espaces, apostrophes et tirets restent visibles).',
      'Composez votre réponse avec le clavier à l’écran ou votre clavier physique : chaque lettre correcte s’illumine, une lettre incorrecte s’affiche en rouge et tremble.',
      'Validez : la bonne réponse résout la manche. Une réponse complète mais fausse coûte 10 points ; une réponse incomplète n’en coûte aucun — continuez simplement.',
      'Utilisez les indices si besoin : première lettre (−20), lettre au hasard (−20), lecture littérale (−30).',
      'Une manche résolue rapporte 100 points, moins le coût des indices et des erreurs, plus un bonus de rapidité allant jusqu’à +20 si vous trouvez en moins de 15 secondes.',
      'Après chaque manche, lisez l’origine de l’expression puis passez à la suivante jusqu’au bilan final sur 5 manches (3 pour le défi du jour).',
    ],
    en: [
      'Read the definition and look at the slots: they hide the letters of the idiom (spaces, apostrophes and hyphens stay visible).',
      'Build your answer with the on-screen keyboard or your physical keyboard: each correct letter lights up, an incorrect one shows in red and shakes.',
      'Submit: the right answer solves the round. A complete but wrong answer costs 10 points; an incomplete one costs nothing — just keep typing.',
      'Use hints if needed: first letter (−20), random letter (−20), literal reading (−30).',
      'A solved round earns 100 points, minus hint costs and mistakes, plus a speed bonus of up to +20 if you solve it in under 15 seconds.',
      'After each round, read the origin of the idiom then move on until the final summary over 5 rounds (3 for the daily challenge).',
    ],
  },
  controls: {
    fr: [
      'Clavier à l’écran : touchez les lettres (AZERTY en français), ⌫ efface, Valider soumet — le clavier système n’est jamais ouvert sur mobile, la page ne saute pas.',
      'Clavier physique : tapez les lettres (accents acceptés, é = e, œ = oe), Retour arrière efface, Entrée valide puis passe à la manche suivante.',
      'Les espaces, apostrophes et tirets sont ignorés : seules les lettres comptent, elles remplissent les cases dans l’ordre.',
      'Souris / tactile : appuyez sur les boutons d’indices, Passer, puis Suivant pour changer de manche.',
    ],
    en: [
      'On-screen keyboard: tap the letters (QWERTY in English), ⌫ deletes, Submit validates — the system keyboard never opens on mobile, so the page never jumps.',
      'Physical keyboard: type letters (accents accepted, é = e), Backspace deletes, Enter submits then moves to the next round.',
      'Spaces, apostrophes and hyphens are ignored: only letters count, filling the slots in order.',
      'Mouse / touch: tap the hint buttons, Skip, then Next to move to the next round.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      '45 expressions françaises et 45 idiomes anglais : une vraie adaptation culturelle par langue.',
      'Clavier à l’écran AZERTY / QWERTY selon la langue, coloré en direct (vert, ambre, rouge) au fil de vos lettres.',
      'Révélation en direct des lettres au fil de la frappe, avec secousse en cas d’erreur et révélation animée à la fin de manche.',
      'Trois indices progressifs et un bouton Passer pour ne jamais rester bloqué.',
      'Carte « Le saviez-vous ? » après chaque manche : l’origine vérifiée de l’expression.',
      'Défi du jour de 3 expressions identiques pour tous les joueurs de la même langue, reprise automatique de la partie en cours.',
      'Records sauvegardés (meilleur score, expressions trouvées au total) et succès à débloquer.',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      '45 French idioms and 45 English idioms: a genuine cultural adaptation per language.',
      'On-screen AZERTY / QWERTY keyboard depending on the language, colored live (green, amber, red) as you type.',
      'Live letter reveal as you type, with a shake on mismatches and an animated reveal at the end of each round.',
      'Three progressive hints and a Skip button so you never stay stuck.',
      'A “Did you know?” card after each round: the verified origin of the idiom.',
      'A daily challenge of 3 identical expressions for everyone playing the same language, with automatic resume of an unfinished game.',
      'Saved records (best score, total idioms solved) and achievements to unlock.',
    ],
  },
  tips: {
    fr: [
      'Cherchez d’abord le verbe ou le nom le plus imagé de la définition : c’est souvent le cœur de l’expression.',
      'La catégorie (animaux, nourriture…) est un indice à elle seule : « avoir un chat dans la gorge » ne peut être que dans Animaux.',
      'Tapez une première version même incomplète : les lettres vertes confirment le début de l’expression, et une soumission incomplète ne coûte rien.',
      'Gardez la lecture littérale (−30) pour les expressions résistantes : elle révèle souvent l’image d’origine.',
      'Le bonus de rapidité (jusqu’à +20) récompense les intuitions bien senties : osez dès que vous avez une idée.',
    ],
    en: [
      'Look for the most vivid verb or noun in the definition: it is often the heart of the idiom.',
      'The category (animals, food…) is a hint in itself: start by ruling out impossible themes.',
      'Type a first guess even if incomplete: green letters confirm the start of the expression, and an incomplete submission costs nothing.',
      'Save the literal reading (−30) for stubborn idioms: it often reveals the original image.',
      'The speed bonus (up to +20) rewards well-aimed first instincts: trust your gut when you have one.',
    ],
  },
  faq: {
    fr: [
      { q: 'Le jeu Devine l’Expression est-il vraiment gratuit ?', a: 'Oui, le jeu est entièrement gratuit, sans inscription ni téléchargement, directement dans votre navigateur.' },
      { q: 'Les expressions sont-elles les mêmes en français et en anglais ?', a: 'Non : chaque langue joue avec ses propres expressions. La version française utilise des expressions françaises et la version anglaise des idiomes anglais — c’est une adaptation culturelle, pas une traduction.' },
      { q: 'Comment fonctionne le score ?', a: 'Chaque expression résolue rapporte 100 points, desquels sont retranchés le coût des indices utilisés (20 à 30 points) et 10 points par réponse complète incorrecte. Une réponse incomplète ne coûte rien. Un bonus de rapidité allant jusqu’à +20 points s’ajoute si vous trouvez en moins de 15 secondes.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Au bilan de la série, votre QI estimé combine trois dimensions : la précision (expressions résolues par rapport au total), la rapidité (les bonus de rapidité gagnés, mesurés sur la fenêtre de 15 secondes par expression) et la difficulté du jeu. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15) et vous attribue un niveau, du Novice au Génie. C’est une estimation ludique de votre performance à ce jeu de mots — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour deviner plus juste, plus vite et sans indices.' },
      { q: 'Que m’apprend la carte « Le saviez-vous ? » ?', a: 'Après chaque manche, elle affiche l’origine historique vérifiée de l’expression. Quand cette origine est débattue ou incertaine, une phrase de remplacement vous l’indique honnêtement.' },
      { q: 'Puis-je rejouer au défi du jour ?', a: 'Vous pouvez le rejouer pour le plaisir, mais les trois expressions du jour restent les mêmes et le défi n’est compté qu’une seule fois : une relecture ne rajoute ni victoire, ni XP.' },
      { q: 'Ma partie est-elle sauvegardée si je ferme la page ?', a: 'Oui : la manche en cours (lettres déjà tapées, indices, score) est restaurée automatiquement le même jour quand vous rouvrez le jeu. Le lendemain, une nouvelle partie vous attend.' },
    ],
    en: [
      { q: 'Is Guess the Idiom really free?', a: 'Yes, the game is completely free, with no sign-up or download, straight in your browser.' },
      { q: 'Are the expressions the same in French and English?', a: 'No: each language plays with its own idioms. The French version uses French expressions and the English version English idioms — a cultural adaptation, not a translation.' },
      { q: 'How does scoring work?', a: 'Each solved idiom earns 100 points, minus the cost of the hints used (20 to 30 points) and 10 points per complete but wrong submission. An incomplete answer costs nothing. A speed bonus of up to +20 is added if you solve it in under 15 seconds.' },
      { q: 'How is my estimated IQ calculated?', a: 'At the end of the series, your estimated IQ combines three dimensions: accuracy (idioms solved out of the total), speed (the speed bonuses you earned, measured over the 15-second window per expression) and the game’s difficulty. The result maps onto the classic IQ scale (mean 100, standard deviation 15) and assigns you a level, from Novice to Genius. It is a playful estimate of your performance at this word game — not a clinical IQ test — and the best way to raise it is to keep playing to guess more accurately, faster and without hints.' },
      { q: 'What does the “Did you know?” card teach me?', a: 'After each round it shows the verified historical origin of the idiom. When that origin is debated or uncertain, an honest fallback sentence tells you so.' },
      { q: 'Can I replay the daily challenge?', a: 'You can replay it for fun, but the three expressions of the day stay the same and the challenge only counts once: a replay adds neither a win nor XP.' },
      { q: 'Is my game saved if I close the page?', a: 'Yes: the round in progress (letters already typed, hints, score) is automatically restored the same day when you reopen the game. The next day, a fresh game awaits.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
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

/** Claviers virtuels (mêmes dispositions que daily-word). */
const KB_ROWS: Record<'fr' | 'en', [string, string, string]> = {
  fr: ['AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN'],
  en: ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBN'],
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
    } else {
      slots.push({ kind: 'sep', ch })
    }
  }
  return { slots, letters }
}

/** Lookup id → entrée (les ids sont préfixés fr-/en-, uniques entre les deux pools). */
const IDIOM_BY_ID: Map<string, IdiomEntry> = new Map([...FR_IDIOMS, ...EN_IDIOMS].map((e) => [e.id, e]))

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

/* ================= Sauvegarde / reprise ================= */

interface RoundState {
  typed: string
  hintRevealed: boolean[]
  literalShown: boolean
  wrongCount: number
  hintCost: number
}

interface GameSnapshot {
  mode: 'free' | 'daily'
  roundIds: string[]
  roundIdx: number
  results: ('solved' | 'skipped')[]
  score: number
  solvedCount: number
  noHintStreak: number
  speedTotal: number
  phase: 'playing' | 'fact'
  round: RoundState
  factData: { solved: boolean; points: number; speed: number; noHint: boolean } | null
}

interface SaveData {
  v: 2
  date: string
  totalSolved: number
  game?: GameSnapshot
}

/** Un dialogue / popover Radix est-il ouvert ? (ne pas voler son clavier) */
function overlayOpen(): boolean {
  if (typeof document === 'undefined') return false
  return Boolean(document.querySelector('[role="dialog"], [role="menu"], [data-radix-popper-content-wrapper]'))
}

function safeNum(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : fallback
}

/* ================= Composant principal ================= */
export default function GuessTheIdiomGame() {
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
  const menuRecords = useProfileStore((s) => s.profile.games[gameId]?.records)

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
  const [endData, setEndData] = useState<{
    score: number
    solved: number
    total: number
    won: boolean
    isRecord: boolean
    xp: number
    practice: boolean
    dailyCredit: boolean
    iq: number
  } | null>(null)
  const [shakeKey, setShakeKey] = useState(0)
  const [notice, setNotice] = useState<'incomplete' | 'wrong' | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)
  /* Célébration de victoire (série gagnée) — médaille + étoiles selon la réussite. */
  const [burstStars, setBurstStars] = useState(3)
  const [burstKey, setBurstKey] = useState(0)

  const nextBtnRef = useRef<HTMLButtonElement>(null)
  const roundStartRef = useRef(0)
  const speedTotalRef = useRef(0)
  const totalSolvedRef = useRef(0)
  const hiddenAtRef = useRef(0)
  const dailyPracticeRef = useRef(false)
  const lastStartRef = useRef(0)
  const submitLockRef = useRef(0)
  const restoreTriedRef = useRef(false)

  const L = {
    fr: {
      freeGame: 'Partie libre',
      freeSub: '5 expressions au hasard, indices en option',
      dailyGame: 'Défi du jour',
      dailySub: '3 expressions — les mêmes pour tous',
      dailyDone: 'Défi du jour réussi',
      dailyReplay: 'Rejouer pour le plaisir',
      round: 'Manche',
      score: 'Score',
      streakNoHint: 'Expressions trouvées d’affilée sans indice',
      submit: 'Valider',
      keyBack: 'Effacer',
      keyboard: 'Clavier des lettres',
      quit: 'Quitter la partie',
      wrongNotice: 'Pas encore — −10 points',
      incomplete: 'Réponse incomplète — continuez !',
      skip: 'Passer',
      hintFirst: 'Première lettre',
      hintRandom: 'Lettre au hasard',
      hintLiteral: 'Lecture littérale',
      hintFirstShort: '1ʳᵉ lettre',
      hintRandomShort: 'Au hasard',
      hintLiteralShort: 'Littérale',
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
      shareScore: '{n}/{t} expressions devinées · {s} points',
      newRecord: 'Nouveau record !',
      fallbackOrigin:
        'Cette expression fait partie du langage courant depuis longtemps ; son origine exacte reste débattue par les spécialistes.',
      play: 'Jouer',
      lettersUnit: 'lettres',
      best: 'Meilleur score',
      totalSolved: 'Expressions trouvées',
      xpEarned: 'XP gagnées',
      practiceNote: 'Défi déjà compté aujourd’hui — cette relecture ne rapporte ni victoire ni XP.',
      dailyCredit: 'Défi du jour validé — bonus +25 XP',
    },
    en: {
      freeGame: 'Free game',
      freeSub: '5 random idioms, optional hints',
      dailyGame: 'Daily challenge',
      dailySub: '3 idioms — the same for everyone',
      dailyDone: 'Daily challenge complete',
      dailyReplay: 'Replay for fun',
      round: 'Round',
      score: 'Score',
      streakNoHint: 'Idioms solved in a row without hints',
      submit: 'Submit',
      keyBack: 'Backspace',
      keyboard: 'Letter keyboard',
      quit: 'Quit game',
      wrongNotice: 'Not yet — −10 points',
      incomplete: 'Incomplete answer — keep typing!',
      skip: 'Skip',
      hintFirst: 'First letter',
      hintRandom: 'Random letter',
      hintLiteral: 'Literal reading',
      hintFirstShort: '1st letter',
      hintRandomShort: 'Random',
      hintLiteralShort: 'Literal',
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
      shareScore: '{n}/{t} idioms guessed · {s} points',
      newRecord: 'New personal best!',
      fallbackOrigin:
        'This idiom has been part of everyday language for a long time; its exact origin is still debated by specialists.',
      play: 'Play',
      lettersUnit: 'letters',
      best: 'Best score',
      totalSolved: 'Idioms solved',
      xpEarned: 'XP earned',
      practiceNote: 'Daily challenge already credited today — this replay earns no win or XP.',
      dailyCredit: 'Daily challenge complete — +25 XP bonus',
    },
  }[lang]

  /* --- Reprise de partie + total d'expressions (callback asynchrone post-mount,
         conforme react-hooks/set-state-in-effect) --- */
  useEffect(() => {
    let cancelled = false
    void Promise.resolve().then(() => {
      if (cancelled) return
      restoreTriedRef.current = true
      const s = loadSave<SaveData>(gameId)
      if (!s) return
      if (typeof s.totalSolved === 'number' && s.totalSolved >= 0) totalSolvedRef.current = s.totalSolved
      const g = s.game
      if (!g || s.date !== todayKey()) return
      // Validation défensive du snapshot
      if (g.mode !== 'free' && g.mode !== 'daily') return
      if (!Array.isArray(g.roundIds) || g.roundIds.length === 0) return
      const entries = g.roundIds.map((id) => IDIOM_BY_ID.get(id))
      // Langue cohérente : un snapshot pris en anglais ne doit jamais être
      // restauré dans l'interface française (et inversement) — chaque langue
      // joue avec son propre réservoir d'expressions.
      if (entries.some((e) => !e || !e.id.startsWith(`${lang}-`))) return
      const restoredRounds = entries as IdiomEntry[]
      if (!Number.isInteger(g.roundIdx) || g.roundIdx < 0 || g.roundIdx >= restoredRounds.length) return
      if (!Array.isArray(g.results) || g.results.length !== g.roundIdx) return
      if (g.results.some((r) => r !== 'solved' && r !== 'skipped')) return
      if (g.phase !== 'playing' && g.phase !== 'fact') return
      if (g.phase === 'fact' && (typeof g.factData?.solved !== 'boolean')) return
      const r = g.round
      if (!r || typeof r.typed !== 'string') return
      const lettersLen = parseExpression(restoredRounds[g.roundIdx].expression).letters.length
      if (r.typed.replace(/[^A-Z]/g, '').length > lettersLen) return

      setMode(g.mode)
      setRounds(restoredRounds)
      setRoundIdx(g.roundIdx)
      setResults(g.results)
      setScore(safeNum(g.score))
      setSolvedCount(safeNum(g.solvedCount))
      setNoHintStreak(safeNum(g.noHintStreak))
      speedTotalRef.current = safeNum(g.speedTotal)
      setTyped(r.typed)
      setHintRevealed(Array.isArray(r.hintRevealed) ? r.hintRevealed.map((x) => x === true) : [])
      setLiteralShown(r.literalShown === true)
      setWrongCount(safeNum(r.wrongCount))
      setHintCost(safeNum(r.hintCost))
      setFactData(g.phase === 'fact' ? g.factData : null)
      dailyPracticeRef.current =
        g.mode === 'daily' && useProfileStore.getState().profile.dailyDone[gameId] === todayKey()
      roundStartRef.current = Date.now()
      hiddenAtRef.current = 0
      setPhase(g.phase)
    })
    return () => {
      cancelled = true
    }
  }, [])

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

  /* État des touches du clavier virtuel (vert > rouge > ambre), dérivation pure. */
  const keyStates = useMemo(() => {
    const map = new Map<string, 'correct' | 'wrong' | 'hint'>()
    if (!parsed) return map
    for (const slot of parsed.slots) {
      if (slot.kind !== 'letter') continue
      const t = slot.li < typedLetters.length ? typedLetters[slot.li] : null
      if (t === slot.ch) {
        map.set(slot.ch, 'correct')
        continue
      }
      if (t !== null && !map.has(t)) map.set(t, 'wrong')
      if (hintRevealed[slot.li] && !map.has(slot.ch)) map.set(slot.ch, 'hint')
    }
    return map
  }, [parsed, typedLetters, hintRevealed])

  /* Taille des cases selon la longueur de l'expression (budget vertical mobile). */
  const slotCount = parsed?.slots.length ?? 0
  const slotTier = slotCount > 30 ? 2 : slotCount > 20 ? 1 : 0
  const SLOT_CLS = [
    'h-10 w-7 text-base sm:h-12 sm:w-9 sm:text-xl',
    'h-10 w-6 text-sm sm:h-11 sm:w-8 sm:text-lg',
    'h-9 w-5 text-xs sm:h-10 sm:w-7 sm:text-base',
  ]
  const SEP_CLS = [
    'h-10 w-3.5 text-base sm:h-12 sm:w-4 sm:text-lg',
    'h-10 w-3 text-sm sm:h-11 sm:w-3.5 sm:text-base',
    'h-9 w-2.5 text-xs sm:h-10 sm:w-3 sm:text-sm',
  ]

  /* --- Handlers (toutes les fins de manche/partie vivent ici, jamais dans un effet) --- */

  const resetRound = useCallback(() => {
    setTyped('')
    setHintRevealed([])
    setLiteralShown(false)
    setWrongCount(0)
    setHintCost(0)
    setNotice(null)
    roundStartRef.current = Date.now()
    hiddenAtRef.current = 0
  }, [])

  function startGame(m: 'free' | 'daily') {
    const now = Date.now()
    if (now - lastStartRef.current < 350) return // anti double-tap (double addPlay)
    lastStartRef.current = now
    const chosen = m === 'daily' ? pickDaily(lang, ROUNDS_DAILY) : pickFree(lang, ROUNDS_FREE)
    dailyPracticeRef.current =
      m === 'daily' && useProfileStore.getState().profile.dailyDone[gameId] === todayKey()
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
  }

  function quitToMenu() {
    sfx.play('click')
    setFactData(null)
    setEndData(null)
    setPhase('menu')
  }

  function addLetter(ch: string) {
    if (phase !== 'playing' || !parsed) return
    if (typedLetters.length >= parsed.letters.length) return
    sfx.play('click', { volume: 0.3 })
    setNotice(null)
    setTyped((t) => (t + ch).slice(0, 48))
  }

  function removeLetter() {
    if (phase !== 'playing' || !typed) return
    sfx.play('click', { volume: 0.22 })
    setNotice(null)
    setTyped((t) => t.slice(0, -1))
  }

  /* --- Résolution d'une manche --- */
  function onSolve() {
    const elapsedS = (Date.now() - roundStartRef.current) / 1000
    const speed = elapsedS < SPEED_WINDOW_S ? Math.max(0, Math.round((MAX_SPEED_BONUS * (SPEED_WINDOW_S - elapsedS)) / SPEED_WINDOW_S)) : 0
    const points = Math.max(0, 100 - hintCost - wrongCount * WRONG_PENALTY + speed)
    speedTotalRef.current += speed
    totalSolvedRef.current += 1
    setScore((s) => s + points)
    setSolvedCount((c) => c + 1)
    setResults((r) => [...r, 'solved'])
    setNotice(null)
    sfx.play('correct')
    navigator.vibrate?.(10)

    const newStreak = hintCost === 0 ? noHintStreak + 1 : 0
    setNoHintStreak(newStreak)
    if (newStreak >= 3) unlockBadge('idiom-streak3')
    if (totalSolvedRef.current >= 10) unlockBadge('idiom-10')

    setFactData({ solved: true, points, speed, noHint: hintCost === 0 })
    setPhase('fact')
  }

  function onSkip() {
    if (phase !== 'playing') return
    sfx.play('swish')
    navigator.vibrate?.(20)
    setNoHintStreak(0)
    setResults((r) => [...r, 'skipped'])
    setFactData({ solved: false, points: 0, speed: 0, noHint: false })
    setPhase('fact')
  }

  function submitGuess() {
    if (phase !== 'playing' || !parsed) return
    const now = Date.now()
    if (now - submitLockRef.current < 250) return // anti double-soumission
    submitLockRef.current = now
    const guess = typedLetters
    if (!guess) return
    if (guess.length < parsed.letters.length) {
      // Réponse incomplète : aucune pénalité, juste un signal doux
      sfx.play('tick', { volume: 0.5 })
      setNotice('incomplete')
      setShakeKey((k) => k + 1)
      return
    }
    if (guess === parsed.letters) {
      onSolve()
      return
    }
    sfx.play('wrong', { volume: 0.4 })
    navigator.vibrate?.(15)
    setWrongCount((w) => w + 1)
    setNotice('wrong')
    setShakeKey((k) => k + 1)
  }

  /* --- Indices --- */
  function revealFirst() {
    if (phase !== 'playing' || !parsed || hintRevealed[0]) return
    if (typedLetters[0] === parsed.letters[0]) return // déjà connue : pas de gaspillage
    sfx.play('reveal')
    navigator.vibrate?.(10)
    const next = [...hintRevealed]
    next[0] = true
    setHintRevealed(next)
    setHintCost((c) => c + COST_FIRST)
  }

  function revealRandom() {
    if (phase !== 'playing' || !parsed || randomCandidates.length === 0) return
    const pick = randomCandidates[Math.floor(Math.random() * randomCandidates.length)]
    sfx.play('reveal')
    navigator.vibrate?.(10)
    const next = [...hintRevealed]
    next[pick] = true
    setHintRevealed(next)
    setHintCost((c) => c + COST_RANDOM)
  }

  function showLiteral() {
    if (phase !== 'playing' || literalShown) return
    sfx.play('reveal')
    navigator.vibrate?.(10)
    setLiteralShown(true)
    setHintCost((c) => c + COST_LITERAL)
  }

  /* --- Fin de partie (appelée depuis le handler « Suivant ») --- */
  function endGame() {
    const rewardable = mode !== 'daily' || !dailyPracticeRef.current
    const won = mode === 'daily' ? solvedCount >= rounds.length : solvedCount >= rounds.length - 1
    const ratio = rounds.length > 0 ? solvedCount / rounds.length : 0
    /* QI estimé (Task 18) : précision = expressions résolues / total ;
     * rapidité = bonus de rapidité du jeu (fenêtre de 15 s par manche,
     * chaque bonus valant 20 × (15 − t) / 15) reconverti en ratio par/temps :
     * temps reconstitué ≈ 15 s × manches − 0,75 × bonus cumulés ; difficulté 2. */
    const iq = computeIq(gameId, {
      accuracy: ratio,
      speed: (15 * rounds.length) / Math.max(1, 15 * rounds.length - 0.75 * speedTotalRef.current),
      difficulty: 2,
    })
    setBest(gameId, 'total-solved', totalSolvedRef.current) // cumul, idempotent
    const isRecord = rewardable && score > 0 ? setBest(gameId, 'best-score', score) : false
    const xp = 15 * solvedCount + speedTotalRef.current
    if (won) {
      sfx.play('win')
      setConfettiKey((k) => k + 1)
      // Étoiles selon la proportion d'expressions trouvées (≥ 90 % → 3, ≥ 70 % → 2).
      setBurstStars(ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1)
      setBurstKey((k) => k + 1)
      navigator.vibrate?.(30)
      if (rewardable) addWin(gameId)
    } else {
      sfx.play('lose')
      navigator.vibrate?.(20)
    }
    if (rewardable) addXp(xp)
    // XP du jeu : 10 à 28 selon la proportion d'expressions trouvées.
    if (rewardable) addGameXp(gameId, Math.round(10 + 18 * ratio))
    if (mode === 'daily' && won && rewardable) completeDaily(gameId)
    setEndData({ score, solved: solvedCount, total: rounds.length, won, isRecord, xp: rewardable ? xp : 0, practice: !rewardable, dailyCredit: mode === 'daily' && won && rewardable, iq })
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

  /* --- Autosave (effet de pur side-effect : jamais de setState) --- */
  useEffect(() => {
    if (!restoreTriedRef.current) return
    if (phase === 'menu' || phase === 'end' || !entry) {
      saveSave<SaveData>(gameId, { v: 2, date: todayKey(), totalSolved: totalSolvedRef.current })
      return
    }
    const snap: SaveData = {
      v: 2,
      date: todayKey(),
      totalSolved: totalSolvedRef.current,
      game: {
        mode,
        roundIds: rounds.map((r) => r.id),
        roundIdx,
        results,
        score,
        solvedCount,
        noHintStreak,
        speedTotal: speedTotalRef.current,
        phase: phase === 'fact' ? 'fact' : 'playing',
        round: { typed, hintRevealed, literalShown, wrongCount, hintCost },
        factData: phase === 'fact' ? factData : null,
      },
    }
    saveSave(gameId, snap)
  }, [phase, mode, rounds, roundIdx, results, typed, hintRevealed, literalShown, wrongCount, hintCost, score, solvedCount, noHintStreak, factData, entry])

  /* --- Pause du chrono de manche quand l'onglet est masqué --- */
  useEffect(() => {
    if (phase !== 'playing') return
    const onVis = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now()
      } else if (hiddenAtRef.current > 0) {
        roundStartRef.current += Date.now() - hiddenAtRef.current
        hiddenAtRef.current = 0
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [phase])

  /* --- Clavier physique : listener unique, handler frais via ref (anti-stale) --- */
  const keyHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {})
  useEffect(() => {
    keyHandlerRef.current = (e: KeyboardEvent) => {
      if (overlayOpen()) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target instanceof HTMLElement ? e.target : null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) return
      if (e.key === 'Enter' || e.key === ' ') {
        // Laisser le comportement natif des boutons/liens focalisés
        if (el && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.closest('button, a'))) return
        e.preventDefault()
        if (e.key === ' ') return
        if (phase === 'playing') submitGuess()
        else if (phase === 'fact') onNext()
        return
      }
      if (phase !== 'playing') return
      if (e.key === 'Backspace') {
        e.preventDefault()
        removeLetter()
        return
      }
      if (e.repeat) return
      const folded = foldAccents(e.key).toUpperCase()
      if (!/^[A-Z]{1,2}$/.test(folded)) return
      e.preventDefault()
      for (const ch of folded) addLetter(ch)
    }
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => keyHandlerRef.current(e)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* --- Focus clavier immédiat sur « Suivant » après chaque manche --- */
  useEffect(() => {
    if (phase === 'fact') nextBtnRef.current?.focus({ preventScroll: true })
  }, [phase, roundIdx])

  /* ================= Rendu ================= */
  const bestScore = menuRecords?.['best-score']?.value
  const totalRecord = menuRecords?.['total-solved']?.value

  return (
    <div className="relative select-none my-auto w-full">
      <Confetti fire={confettiKey} count={reduce ? 0 : 110} waves={2} gold />
      <VictoryBurst fire={burstKey} stars={burstStars} emoji="💬" />

      {/* ===== Écran de menu (compact : bouton Jouer visible immédiatement) ===== */}
      {phase === 'menu' ? (
        <div className="checkerboard flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-center sm:p-6">
          <div className="flex gap-2 text-3xl sm:text-4xl" aria-hidden="true">
            {['💬', '🐇', '🐂'].map((e, i) => (
              <span key={i} className={reduce ? '' : 'anim-floaty'} style={{ animationDelay: `${i * 0.4}s` }}>
                {e}
              </span>
            ))}
          </div>
          <p className="max-w-md text-xs text-muted-foreground sm:text-sm">{content.tagline[lang]}</p>
          <div className="flex w-full max-w-sm flex-col gap-2">
            {!dailyDone ? (
              <button
                type="button"
                onClick={() => {
                  sfx.play('pop')
                  startGame('daily')
                }}
                className="flex items-center gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-left transition-transform hover:scale-[1.01] dark:border-amber-500/25 dark:bg-amber-500/10"
              >
                <span className="text-2xl" aria-hidden="true">🎁</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-amber-700 dark:text-amber-300">
                    {L.dailyGame} — {todayKey()}
                  </span>
                  <span className="block text-xs text-muted-foreground">{L.dailySub}</span>
                </span>
                <span className="shrink-0 rounded-full bg-amber-500 px-3.5 py-2.5 text-xs font-bold text-white">{L.play}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/60 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/25 dark:bg-emerald-500/10">
                <CalendarCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                <span className="min-w-0 flex-1 text-left text-sm font-bold text-emerald-700 dark:text-emerald-300">{L.dailyDone} ✅</span>
                <button
                  type="button"
                  onClick={() => {
                    sfx.play('click')
                    startGame('daily')
                  }}
                  className="shrink-0 rounded-full border border-emerald-400/60 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                >
                  <RotateCcw className="mr-1 inline h-3 w-3" aria-hidden="true" />
                  {L.dailyReplay}
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                sfx.play('click')
                startGame('free')
              }}
              className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left transition-transform hover:scale-[1.01]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-400 text-white">
                <Play className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{L.freeGame}</span>
                <span className="block text-xs text-muted-foreground">{L.freeSub}</span>
              </span>
              <span className="shrink-0 rounded-full bg-secondary px-3.5 py-2.5 text-xs font-bold">{L.play}</span>
            </button>
          </div>
          {typeof bestScore === 'number' || typeof totalRecord === 'number' ? (
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-semibold">
              {typeof bestScore === 'number' ? (
                <span className="flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1">
                  <Trophy className="h-3 w-3 text-amber-500" aria-hidden="true" />
                  {L.best} <span className="tabular-nums">{bestScore}</span>
                </span>
              ) : null}
              {typeof totalRecord === 'number' ? (
                <span className="flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1">
                  <MessageSquareQuote className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                  {L.totalSolved} <span className="tabular-nums">{totalRecord}</span>
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ===== Manche en cours / carte « Le saviez-vous ? » ===== */}
      {phase === 'playing' || phase === 'fact' ? (
        <div className="anim-rise">
          {/* HUD compact une ligne */}
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold">
            <span className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-secondary/70 px-2.5" title={L.round}>
              <MessageSquareQuote className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <span className="tabular-nums">
                {roundIdx + 1}/{rounds.length}
              </span>
            </span>
            <span className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-secondary/70 px-2.5" title={L.score}>
              <Zap className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
              <span key={score} className="anim-pop-in tabular-nums">
                {score}
              </span>
            </span>
            {mode === 'daily' ? (
              <span
                title={L.dailyGame}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/20"
              >
                <CalendarCheck className="h-4 w-4 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                <span className="sr-only">{L.dailyGame}</span>
              </span>
            ) : null}
            {noHintStreak >= 2 ? (
              <span
                key={noHintStreak}
                title={L.streakNoHint}
                className="anim-pop-in flex h-9 shrink-0 items-center gap-1 rounded-full bg-orange-100 px-2 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300"
              >
                🔥<span className="tabular-nums">×{noHintStreak}</span>
              </span>
            ) : null}
            <span className="mx-0.5 flex min-w-0 flex-1 items-center gap-1 overflow-hidden" aria-hidden="true">
              {rounds.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-2 shrink-0 rounded-full transition-all',
                    i < roundIdx
                      ? results[i] === 'solved'
                        ? 'w-3 bg-emerald-400'
                        : 'w-3 bg-rose-300'
                      : i === roundIdx
                        ? 'w-6 bg-primary/60'
                        : 'w-3 bg-border',
                  )}
                />
              ))}
            </span>
            <button
              type="button"
              onClick={quitToMenu}
              title={L.quit}
              aria-label={L.quit}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Carte définition (compacte) */}
          {entry ? (
            <div className="rounded-2xl border bg-secondary/40 p-3 sm:p-4">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  <span aria-hidden="true">{CATEGORIES[entry.category].icon}</span>
                  {CATEGORIES[entry.category].label[lang]}
                </span>
                <DifficultyDots level={entry.difficulty} />
                {parsed ? (
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {parsed.letters.length} {L.lettersUnit}
                  </span>
                ) : null}
              </div>
              <p className="text-sm italic leading-relaxed sm:text-base">« {entry.definition[lang]} »</p>
            </div>
          ) : null}

          {/* Cases des lettres (taille adaptée à la longueur, révélation en direct) */}
          {parsed ? (
            <div
              key={shakeKey}
              className={cn('mt-3 flex flex-wrap items-center justify-center gap-1.5', shakeKey > 0 && 'anim-shake')}
              aria-label={phase === 'playing' ? (lang === 'fr' ? 'Lettres cachées de l’expression' : 'Hidden letters of the idiom') : (entry?.expression ?? '')}
            >
              {parsed.slots.map((slot, i) => {
                if (slot.kind === 'sep') {
                  return (
                    <span key={i} className={cn('flex items-end justify-center pb-1 font-bold text-muted-foreground', SEP_CLS[slotTier])}>
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
                    key={i}
                    style={revealAll && !reduce ? { animationDelay: `${Math.min(slot.li * 45, 900)}ms` } : undefined}
                    className={cn(
                      'flex items-center justify-center rounded-lg border-2 font-display font-bold transition-colors',
                      SLOT_CLS[slotTier],
                      revealAll && factData?.solved
                        ? 'anim-pop-in border-emerald-400 bg-emerald-100 text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-500/20 dark:text-emerald-300'
                        : revealAll
                          ? 'anim-pop-in border-primary/50 bg-primary/10 text-foreground'
                          : isHint
                            ? 'anim-pop-in border-amber-400 bg-amber-100 text-amber-700 dark:border-amber-500/60 dark:bg-amber-500/20 dark:text-amber-300'
                            : typedCh === null
                              ? 'border-border bg-card text-muted-foreground'
                              : match
                                ? 'anim-pop-in border-emerald-400 bg-emerald-100 text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-500/20 dark:text-emerald-300'
                                : 'anim-shake border-rose-300 bg-rose-100 text-rose-600 dark:border-rose-500/60 dark:bg-rose-500/20 dark:text-rose-300',
                    )}
                  >
                    {shown}
                  </div>
                )
              })}
            </div>
          ) : null}

          {/* Ligne de message réservée (aucun saut de mise en page) */}
          <div className="mt-1.5 flex h-5 items-center justify-center" role="status" aria-live="polite">
            {notice ? (
              <p className={cn('text-xs font-semibold', notice === 'wrong' ? 'text-rose-500' : 'text-amber-600 dark:text-amber-400')}>
                {notice === 'wrong' ? L.wrongNotice : L.incomplete}
              </p>
            ) : null}
          </div>

          {/* Lecture littérale (indice acheté) */}
          {literalShown && entry ? (
            <p className="anim-pop-in mt-1 text-center text-xs text-muted-foreground sm:text-sm">
              👀 <span className="font-semibold">{L.literalReading}</span>{' '}
              <span className="italic">« {entry.literal[lang]} »</span>
            </p>
          ) : null}

          {phase === 'playing' ? (
            <>
              {/* Indices compacts une ligne */}
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={revealFirst}
                  disabled={hintRevealed[0] === true || (parsed ? typedLetters[0] === parsed.letters[0] : false)}
                  title={L.hintFirst}
                  aria-label={`${L.hintFirst} (−${COST_FIRST} ${L.points})`}
                  className="flex h-10 min-w-0 items-center justify-center gap-1 rounded-xl border border-amber-300/60 bg-amber-50/60 px-1 text-[11px] font-bold transition-colors hover:border-amber-400 disabled:opacity-40 dark:border-amber-500/25 dark:bg-amber-500/10"
                >
                  <span aria-hidden="true">🔤</span>
                  <span className="truncate">{L.hintFirstShort}</span>
                  <span className="shrink-0 text-amber-600 dark:text-amber-400">−{COST_FIRST}</span>
                </button>
                <button
                  type="button"
                  onClick={revealRandom}
                  disabled={randomCandidates.length === 0}
                  title={L.hintRandom}
                  aria-label={`${L.hintRandom} (−${COST_RANDOM} ${L.points})`}
                  className="flex h-10 min-w-0 items-center justify-center gap-1 rounded-xl border border-amber-300/60 bg-amber-50/60 px-1 text-[11px] font-bold transition-colors hover:border-amber-400 disabled:opacity-40 dark:border-amber-500/25 dark:bg-amber-500/10"
                >
                  <span aria-hidden="true">🎲</span>
                  <span className="truncate">{L.hintRandomShort}</span>
                  <span className="shrink-0 text-amber-600 dark:text-amber-400">−{COST_RANDOM}</span>
                </button>
                <button
                  type="button"
                  onClick={showLiteral}
                  disabled={literalShown}
                  title={L.hintLiteral}
                  aria-label={`${L.hintLiteral} (−${COST_LITERAL} ${L.points})`}
                  className="flex h-10 min-w-0 items-center justify-center gap-1 rounded-xl border border-amber-300/60 bg-amber-50/60 px-1 text-[11px] font-bold transition-colors hover:border-amber-400 disabled:opacity-40 dark:border-amber-500/25 dark:bg-amber-500/10"
                >
                  <span aria-hidden="true">👀</span>
                  <span className="truncate">{L.hintLiteralShort}</span>
                  <span className="shrink-0 text-amber-600 dark:text-amber-400">−{COST_LITERAL}</span>
                </button>
              </div>

              {/* Clavier virtuel (aucun input DOM : le clavier système ne s'ouvre jamais) */}
              <div role="group" aria-label={L.keyboard} className="mt-2 select-none no-select">
                {KB_ROWS[lang].map((row, ri) => (
                  <div key={ri} className="mb-1.5 flex gap-1.5 last:mb-0">
                    {row.split('').map((ch) => {
                      const st = keyStates.get(ch)
                      return (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => addLetter(ch)}
                          aria-label={ch}
                          className={cn(
                            'h-11 min-w-0 flex-1 touch-manipulation rounded-lg border font-display text-sm font-bold transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring sm:h-12 sm:text-base',
                            st === 'correct'
                              ? 'border-emerald-400 bg-emerald-100 text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-500/20 dark:text-emerald-300'
                              : st === 'wrong'
                                ? 'border-rose-300 bg-rose-100 text-rose-600 dark:border-rose-500/60 dark:bg-rose-500/20 dark:text-rose-300'
                                : st === 'hint'
                                  ? 'border-amber-400 bg-amber-100 text-amber-700 dark:border-amber-500/60 dark:bg-amber-500/20 dark:text-amber-300'
                                  : 'border-border bg-card text-foreground hover:bg-secondary',
                          )}
                        >
                          {ch}
                        </button>
                      )
                    })}
                  </div>
                ))}
                <div className="mt-1.5 flex gap-1.5">
                  <button
                    type="button"
                    onClick={onSkip}
                    className="flex h-11 min-w-0 flex-[1.3] touch-manipulation items-center justify-center gap-1 rounded-lg border border-dashed text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground active:scale-95 sm:h-12 sm:text-sm"
                  >
                    <SkipForward className="h-4 w-4" aria-hidden="true" />
                    <span className="truncate">{L.skip}</span>
                  </button>
                  <button
                    type="button"
                    onClick={removeLetter}
                    disabled={!typed}
                    aria-label={L.keyBack}
                    title={L.keyBack}
                    className="flex h-11 min-w-0 flex-1 touch-manipulation items-center justify-center rounded-lg border border-border bg-card text-foreground transition active:scale-95 hover:bg-secondary disabled:opacity-40 sm:h-12"
                  >
                    <Delete className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={submitGuess}
                    disabled={!typed}
                    className="flex h-11 min-w-0 flex-[1.6] touch-manipulation items-center justify-center gap-1.5 rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground shadow-xs transition active:scale-95 hover:bg-primary/90 disabled:opacity-40 sm:h-12"
                  >
                    <CornerDownLeft className="h-4 w-4" aria-hidden="true" />
                    <span className="truncate">{L.submit}</span>
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {/* Carte « Le saviez-vous ? » (remplace indices + clavier) */}
          {phase === 'fact' && factData && entry ? (
            <div className="anim-rise mt-2 rounded-2xl border-2 border-amber-300/60 bg-amber-50/70 p-3.5 dark:border-amber-500/30 dark:bg-amber-500/10">
              <p className="font-display text-base font-extrabold text-amber-700 dark:text-amber-300 sm:text-lg">
                {factData.solved ? `✅ ${L.wellDone}` : `💡 ${L.answerWas}`}
              </p>
              {factData.solved ? (
                <p className="mt-0.5 text-xs font-semibold sm:text-sm">
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
                <p className="mt-0.5 text-sm font-semibold">« {entry.expression} »</p>
              )}
              <div className="mt-2.5 rounded-xl border bg-card/70 p-2.5">
                <p className="font-display text-xs font-bold sm:text-sm">💡 {L.didYouKnow}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {entry.origin ? entry.origin[lang] : L.fallbackOrigin}
                </p>
              </div>
              <div className="mt-3 text-center">
                <Button ref={nextBtnRef} size="lg" className="h-11 rounded-full px-6" onClick={onNext}>
                  {roundIdx + 1 >= rounds.length ? L.seeResults : L.next}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : null}

          {/* Annonce lecteur d'écran */}
          <span className="sr-only" role="status">
            {`${L.round} ${roundIdx + 1} / ${rounds.length}${entry ? ` — ${CATEGORIES[entry.category].label[lang]}` : ''}`}
          </span>
        </div>
      ) : null}

      {/* ===== Écran final ===== */}
      {phase === 'end' && endData ? (
        <div
          className={cn(
            'anim-rise rounded-2xl border-2 p-4 text-center sm:p-6',
            endData.won
              ? 'border-emerald-300/60 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'
              : 'border-border bg-secondary/40',
          )}
          role="status"
        >
          <p className={cn('font-display text-xl font-extrabold sm:text-2xl', endData.won ? 'text-emerald-700 dark:text-emerald-300' : '')}>
            {endData.won ? `🎉 ${L.finalTitle}` : L.finalTitle}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <StatPill icon={<Zap className="h-4 w-4" aria-hidden="true" />} label={L.score} value={endData.score} />
            <StatPill icon={<Trophy className="h-4 w-4" aria-hidden="true" />} label={L.solvedCount} value={`${endData.solved}/${endData.total}`} />
            {endData.xp > 0 ? <StatPill icon={<span aria-hidden="true">✨</span>} label={L.xpEarned} value={`+${endData.xp}`} /> : null}
            {endData.isRecord ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Trophy className="h-4 w-4" aria-hidden="true" /> {L.newRecord}
              </span>
            ) : null}
          </div>
          {endData.dailyCredit ? <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">✅ {L.dailyCredit}</p> : null}
          {endData.practice ? <p className="mt-2 text-xs text-muted-foreground">{L.practiceNote}</p> : null}
          <div className="mt-4 flex flex-col items-center gap-2.5">
            <RoundEndActions
              gameId={gameId}
              onReplay={() => startGame(mode)}
              replayLabel={L.playAgain}
              iq={endData.iq}
              shareResult={L.shareScore
                .replace('{n}', String(endData.solved))
                .replace('{t}', String(endData.total))
                .replace('{s}', String(endData.score))}
            />
            <div className="flex flex-wrap justify-center gap-2">
              <Button size="lg" variant="secondary" className="h-11 rounded-full" onClick={quitToMenu}>
                <Home className="h-4 w-4" aria-hidden="true" /> {L.menu}
              </Button>
            </div>
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
