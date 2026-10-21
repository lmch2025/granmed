'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Play, CalendarCheck, RotateCcw, Share2, Send, Timer, Trophy, Zap, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, mulberry32, seedFromString, shuffle, shareText, useReducedMotion } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { FR_WORDS, EN_WORDS, FR_LETTER_WEIGHTS, EN_LETTER_WEIGHTS } from '@/components/games/data/longest-word-data'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { toast } from 'sonner'

export const gameId = 'longest-word'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Formez un maximum de mots avec 9 lettres tirées au hasard avant la fin des 60 secondes.',
    en: 'Build as many words as you can from 9 random letters before the 60 seconds run out.',
  },
  description: {
    fr: [
      'Le Mot le Plus Long est un jeu de lettres gratuit en ligne dans lequel vous recevez neuf lettres et devez former un maximum de mots valides en 60 secondes. Chaque mot rapporte des points proportionnels à sa longueur : un mot de 5 lettres vaut 5 points, un mot de 8 lettres compte double et un mot utilisant les 9 lettres vaut 45 points.',
      'À chaque partie, le tirage garantit au moins 3 voyelles et 3 consonnes, avec des fréquences proches des distributions du Scrabble. Tapez vos mots au clavier ou sur mobile : la validation vérifie la longueur minimale de 3 lettres, la disponibilité des lettres (doublons compris) et la présence du mot dans le dictionnaire de la langue.',
      'Le jeu existe en deux langues avec des banques de mots distinctes (environ 2 500 mots courants chacune) : la version française joue en français, la version anglaise en anglais. Le défi du jour propose le même tirage à tous les joueurs d’une même langue, et vos records (meilleur score, longueur du mot le plus long) sont sauvegardés sur votre appareil.',
    ],
    en: [
      'The Longest Word is a free online word game in which you receive nine letters and must build as many valid words as you can in 60 seconds. Each word scores points based on its length: a 5-letter word is worth 5 points, an 8-letter word counts double and a word using all 9 letters is worth 45 points.',
      'Every draw guarantees at least 3 vowels and 3 consonants, with frequencies close to Scrabble distributions. Type your words on keyboard or mobile: validation checks the 3-letter minimum, letter availability (duplicates included) and the presence of the word in the language’s dictionary.',
      'The game comes in two languages with separate word banks (about 2,500 common words each): the French version plays in French, the English version in English. The daily challenge gives everyone the same draw, and your records (best score, longest word length) are saved on your device.',
    ],
  },
  rules: {
    fr: [
      'Observez les 9 lettres tirées : le tirage contient toujours au moins 3 voyelles et 3 consonnes.',
      'Tapez un mot de 3 lettres minimum utilisant uniquement les lettres disponibles (chaque lettre ne peut servir qu’autant de fois qu’elle apparaît).',
      'Appuyez sur Entrée ou sur « Proposer » : si le mot est valide et pas déjà trouvé, il rejoint votre liste et rapporte des points.',
      'Un mot de 8 lettres compte double (16 points) ; un mot de 9 lettres utilise tout le tirage et vaut 45 points.',
      'Vous avez 60 secondes : les 5 dernières sont signalées par un tic-tac. À la fin, découvrez votre score, votre mot le plus long et le récapitulatif.',
    ],
    en: [
      'Look at the 9 drawn letters: every draw contains at least 3 vowels and 3 consonants.',
      'Type a word of at least 3 letters using only the available letters (each letter can only be used as many times as it appears).',
      'Press Enter or “Submit”: if the word is valid and not already found, it joins your list and scores points.',
      'An 8-letter word counts double (16 points); a 9-letter word uses the whole draw and is worth 45 points.',
      'You have 60 seconds: the last 5 are flagged by a ticking sound. At the end, see your score, your longest word and the full recap.',
    ],
  },
  controls: {
    fr: [
      'Clavier : tapez le mot (les accents sont acceptés, é = e), Entrée pour proposer. Le champ garde le focus après chaque mot.',
      'Souris / tactile : bouton « Proposer » à côté du champ de saisie.',
      'Aucun déplacement de lettres nécessaire : seul le mot tapé compte.',
    ],
    en: [
      'Keyboard: type the word (accents are accepted, é = e), press Enter to submit. The field keeps focus after each word.',
      'Mouse / touch: “Submit” button next to the input field.',
      'No letter dragging needed: only the typed word matters.',
    ],
  },
  features: {
    fr: [
      'Tirage pondéré équilibré : 3 à 6 voyelles garanties, fréquences inspirées du Scrabble.',
      'Compte à rebours de 60 secondes avec tic-tac sur les 5 dernières et pause automatique si vous changez d’onglet.',
      'Validation instantanée avec raison claire : trop court, lettres indisponibles, absent du dictionnaire ou déjà trouvé.',
      'Bonus spéciaux : mot de 8 lettres ×2, mot de 9 lettres ×5 avec célébration.',
      'Défi du jour : le même tirage pour tous les joueurs de la même langue, partageable (lettres et score, sans dévoiler les mots).',
      'Records sauvegardés (meilleur score, mot le plus long) et succès à débloquer.',
    ],
    en: [
      'Balanced weighted draw: 3 to 6 guaranteed vowels, Scrabble-inspired frequencies.',
      '60-second countdown with ticking on the last 5 seconds and automatic pause when you switch tabs.',
      'Instant validation with a clear reason: too short, letters unavailable, not in the dictionary or already found.',
      'Special bonuses: 8-letter word ×2, 9-letter word ×5 with a celebration.',
      'Daily challenge: the same draw for everyone in the same language, shareable (letters and score, without revealing the words).',
      'Saved records (best score, longest word) and achievements to unlock.',
    ],
  },
  tips: {
    fr: [
      'Commencez par repérer les terminaisons fréquentes (-ER, -TION, -MENT en français ; -ING, -ED, -ER en anglais) : elles débloquent des mots longs.',
      'Alternez mots courts rapides et recherche de mots longs : trois mots de 4 lettres valent mieux qu’une longue hésitation.',
      'Les pluriels et conjugaisons courantes sont souvent dans le dictionnaire : testez les déclinaisons d’un mot déjà trouvé.',
      'Gardez un œil sur les lettres doublées : elles permettent des doubles consonnes (LL, NN, SS…) souvent décisives.',
      'Si un mot de 9 lettres vous échappe à la fin, tentez un 8 lettres : compté double, il reste très rentable.',
    ],
    en: [
      'Start by spotting common endings (-ING, -ED, -ER, -TION): they unlock long words.',
      'Alternate quick short words with longer searches: three 4-letter words beat one long hesitation.',
      'Common plurals and inflections are often in the dictionary: test variations of a word you already found.',
      'Keep an eye on doubled letters: they enable double consonants (LL, NN, SS…) that are often decisive.',
      'If a 9-letter word escapes you at the end, try an 8-letter one: counted double, it stays very profitable.',
    ],
  },
  faq: {
    fr: [
      { q: 'Le jeu Le Mot le Plus Long est-il vraiment gratuit ?', a: 'Oui, le jeu est entièrement gratuit, sans inscription ni téléchargement, directement dans votre navigateur.' },
      { q: 'Pourquoi mon mot est-il refusé ?', a: 'Un mot refusé est soit trop court (3 lettres minimum), soit composé de lettres indisponibles dans le tirage, soit absent du dictionnaire du jeu, soit déjà trouvé. Le motif exact s’affiche sous le champ de saisie.' },
      { q: 'Comment les points sont-ils calculés ?', a: 'Chaque mot vaut sa longueur en points. Un mot de 8 lettres compte double (16 points) et un mot de 9 lettres, qui utilise tout le tirage, vaut 45 points.' },
      { q: 'Les accents sont-ils acceptés ?', a: 'Oui : la saisie normalise automatiquement les accents (é, è, à, ç…), le dictionnaire étant stocké sans accents. « clé » se tape donc indifféremment « cle » ou « clé ».' },
      { q: 'Le défi du jour est-il identique pour tous ?', a: 'Oui : le tirage du jour est généré de façon déterministe, donc identique pour tous les joueurs de la même langue. Il est validé dès que vous trouvez au moins un mot.' },
    ],
    en: [
      { q: 'Is The Longest Word really free?', a: 'Yes, the game is completely free, with no sign-up or download, straight in your browser.' },
      { q: 'Why is my word rejected?', a: 'A rejected word is either too short (3 letters minimum), uses letters unavailable in the draw, is missing from the game dictionary, or has already been found. The exact reason is displayed under the input field.' },
      { q: 'How are points calculated?', a: 'Each word is worth its length in points. An 8-letter word counts double (16 points) and a 9-letter word, using the whole draw, is worth 45 points.' },
      { q: 'Are accents accepted?', a: 'Yes: input automatically normalizes accents (é, è, à, ç…), the dictionary being stored without accents. You can type “cafe” or “café” alike.' },
      { q: 'Is the daily challenge the same for everyone?', a: 'Yes: the daily draw is generated deterministically, so it is identical for every player of the same language. It counts as complete as soon as you find at least one word.' },
    ],
  },
  records: {
    'best-score': { fr: 'Meilleur score', en: 'Best score' },
    'longest-word': { fr: 'Mot le plus long (lettres)', en: 'Longest word (letters)' },
  },
}

/* ================= Constantes & helpers ================= */

const ROUND_MS = 60000
const LETTER_COUNT = 9
const MIN_WORD_LEN = 3
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

/** Mot candidat : majuscules, sans accents, lettres A-Z uniquement. */
function normalizeWord(s: string): string {
  return foldAccents(s).toUpperCase().replace(/[^A-Z]/g, '')
}

/** Points d'un mot : longueur ; 8 lettres ×2 ; 9 lettres (tout le tirage) ×5. */
function wordPoints(len: number): number {
  if (len === 9) return 45
  if (len === 8) return 16
  return len
}

/** Tirage de 9 lettres : 3 à 6 voyelles (donc 3 à 6 consonnes), pondéré, ordre mélangé. */
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

interface FoundWord {
  word: string
  points: number
}

type ErrorKey = 'short' | 'letters' | 'dict' | 'dup'

/* ================= Composant principal ================= */
export default function LongestWordGame() {
  const lang = useLang()
  const reduce = useReducedMotion()
  const dailyDone = useIsDailyDone(gameId)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)

  const [phase, setPhase] = useState<'menu' | 'playing' | 'end'>('menu')
  const [mode, setMode] = useState<'free' | 'daily'>('free')
  const [letters, setLetters] = useState<string[]>([])
  const [guess, setGuess] = useState('')
  const [error, setError] = useState<ErrorKey | null>(null)
  const [found, setFound] = useState<FoundWord[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_MS)
  const [shake, setShake] = useState(false)
  const [nineFlash, setNineFlash] = useState<string | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const [endData, setEndData] = useState<{ score: number; longest: string | null; count: number; isRecord: boolean; daily: boolean } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const deadlineRef = useRef(0)
  const remainingRef = useRef(ROUND_MS)
  const lastSecondRef = useRef(61)
  const foundRef = useRef<FoundWord[]>([])
  const scoreRef = useRef(0)
  const longestLenRef = useRef(0)
  const endedRef = useRef(false)
  const flashTimerRef = useRef<number | null>(null)

  const L = {
    fr: {
      freeGame: 'Partie libre',
      freeSub: '9 lettres au hasard, 60 secondes',
      dailyGame: 'Défi du jour',
      dailySub: 'Les mêmes 9 lettres pour tous',
      dailyDone: 'Défi du jour réussi',
      score: 'Score',
      found: 'Mots trouvés',
      noneYet: 'Aucun mot pour l’instant — à vous de jouer !',
      placeholder: 'Tapez un mot…',
      submit: 'Proposer',
      errShort: 'Trop court : 3 lettres minimum.',
      errLetters: 'Lettres indisponibles dans le tirage.',
      errDict: 'Ce mot n’est pas dans le dictionnaire.',
      errDup: 'Mot déjà trouvé !',
      endTitle: 'Temps écoulé !',
      longest: 'Mot le plus long',
      wordsFound: 'mots trouvés',
      playAgain: 'Rejouer',
      menu: 'Menu',
      share: 'Partager',
      newRecord: 'Nouveau record !',
      nineFlash: 'Toutes les lettres ! ×5',
      timeLeft: 'Temps restant',
      shareTitle: 'Granmed — Le Mot le Plus Long',
      copied: 'Copié !',
      play: 'Jouer',
      dailyLetters: 'Lettres',
    },
    en: {
      freeGame: 'Free game',
      freeSub: '9 random letters, 60 seconds',
      dailyGame: 'Daily challenge',
      dailySub: 'The same 9 letters for everyone',
      dailyDone: 'Daily challenge complete',
      score: 'Score',
      found: 'Words found',
      noneYet: 'No words yet — your turn to play!',
      placeholder: 'Type a word…',
      submit: 'Submit',
      errShort: 'Too short: 3 letters minimum.',
      errLetters: 'Letters not available in the draw.',
      errDict: 'This word is not in the dictionary.',
      errDup: 'Word already found!',
      endTitle: "Time's up!",
      longest: 'Longest word',
      wordsFound: 'words found',
      playAgain: 'Play again',
      menu: 'Menu',
      share: 'Share',
      newRecord: 'New personal best!',
      nineFlash: 'All nine letters! ×5',
      timeLeft: 'Time left',
      shareTitle: 'Granmed — The Longest Word',
      copied: 'Copied!',
      play: 'Play',
      dailyLetters: 'Letters',
    },
  }[lang]

  const ERROR_TEXT: Record<ErrorKey, string> = {
    short: L.errShort,
    letters: L.errLetters,
    dict: L.errDict,
    dup: L.errDup,
  }

  /* --- Focus du champ au lancement --- */
  useEffect(() => {
    if (phase === 'playing') inputRef.current?.focus()
  }, [phase])

  /* --- Nettoyage du minuteur d'animation « 9 lettres » --- */
  useEffect(() => {
    return () => {
      if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current)
    }
  }, [])

  const letterCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const l of letters) m.set(l, (m.get(l) ?? 0) + 1)
    return m
  }, [letters])

  const sortedFound = useMemo(
    () => [...found].sort((a, b) => b.word.length - a.word.length || a.word.localeCompare(b.word)),
    [found],
  )

  function canBuild(word: string): boolean {
    const counts = new Map(letterCounts)
    for (const ch of word) {
      const c = counts.get(ch) ?? 0
      if (c <= 0) return false
      counts.set(ch, c - 1)
    }
    return true
  }

  const startGame = useCallback(
    (m: 'free' | 'daily') => {
      const weights = lang === 'fr' ? FR_LETTER_WEIGHTS : EN_LETTER_WEIGHTS
      const rand = m === 'daily' ? mulberry32(seedFromString(`${gameId}:${todayKey()}`)) : Math.random
      const drawn = drawLetters(rand, weights)
      setMode(m)
      setLetters(drawn)
      setGuess('')
      setError(null)
      setFound([])
      foundRef.current = []
      scoreRef.current = 0
      setScore(0)
      longestLenRef.current = 0
      endedRef.current = false
      remainingRef.current = ROUND_MS
      lastSecondRef.current = 61
      deadlineRef.current = Date.now() + ROUND_MS
      setTimeLeft(ROUND_MS)
      setNineFlash(null)
      setEndData(null)
      setPhase('playing')
      addPlay(gameId)
    },
    [lang, addPlay],
  )

  /* --- Fin de manche (appelée depuis le callback du minuteur, jamais un effet) --- */
  const endRound = useCallback(() => {
    if (endedRef.current) return
    endedRef.current = true
    const foundWords = foundRef.current
    const sc = scoreRef.current
    const longestLen = longestLenRef.current
    const longest =
      foundWords.length > 0
        ? [...foundWords].sort((a, b) => b.word.length - a.word.length || a.word.localeCompare(b.word))[0].word
        : null
    let isRecord = false
    if (foundWords.length > 0) {
      isRecord = setBest(gameId, 'best-score', sc) || setBest(gameId, 'longest-word', longestLen)
    }
    addXp(Math.floor(sc / 3))
    if (foundWords.length >= 5) {
      addWin(gameId)
      sfx.play('win')
      setConfettiKey((k) => k + 1)
    } else if (foundWords.length === 0) {
      sfx.play('lose', { volume: 0.5 })
    }
    if (mode === 'daily' && foundWords.length >= 1) completeDaily(gameId)
    setEndData({ score: sc, longest, count: foundWords.length, isRecord, daily: mode === 'daily' })
    setPhase('end')
  }, [mode, setBest, addXp, addWin, completeDaily])

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
        endRound()
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

  /* --- Soumission d'un mot --- */
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (phase !== 'playing') return
    const w = normalizeWord(guess)
    setGuess('')
    if (!w) return
    const fail = (key: ErrorKey) => {
      sfx.play('wrong', { volume: 0.35 })
      setError(key)
      setShake(true)
    }
    if (w.length < MIN_WORD_LEN) return fail('short')
    if (!canBuild(w)) return fail('letters')
    if (!wordsFor(lang).has(w.toLowerCase())) return fail('dict')
    if (foundRef.current.some((f) => f.word === w)) return fail('dup')

    const len = w.length
    const points = wordPoints(len)
    const next = [...foundRef.current, { word: w, points }]
    foundRef.current = next
    setFound(next)
    scoreRef.current += points
    setScore(scoreRef.current)
    if (len > longestLenRef.current) longestLenRef.current = len
    setError(null)
    sfx.play('correct')

    if (len === 9) {
      unlockBadge('longest-9')
      unlockBadge('longest-7')
      sfx.play('levelup')
      setConfettiKey((k) => k + 1)
      setNineFlash(w)
      if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current)
      flashTimerRef.current = window.setTimeout(() => setNineFlash(null), 2600)
    } else if (len >= 7) {
      unlockBadge('longest-7')
    }
    inputRef.current?.focus()
  }

  async function onShare() {
    sfx.play('click')
    const url =
      typeof window !== 'undefined'
        ? `${window.location.href.split('#')[0]}#/${lang === 'fr' ? 'fr/mot-le-plus-long' : 'en/longest-word-game'}`
        : ''
    const sc = endData?.score ?? score
    let text: string
    if (endData?.daily && letters.length > 0) {
      text =
        lang === 'fr'
          ? `Défi du jour — Le Mot le Plus Long sur Granmed\n${L.dailyLetters} : ${letters.join(' ')}\nScore : ${sc} points. Peux-tu faire mieux ? ${url}`
          : `Daily challenge — The Longest Word on Granmed\n${L.dailyLetters}: ${letters.join(' ')}\nScore: ${sc} points. Can you beat that? ${url}`
    } else {
      const count = endData?.count ?? found.length
      const longest = endData?.longest ?? null
      text =
        lang === 'fr'
          ? `J’ai trouvé ${count} mots (le plus long : ${longest ?? '—'}) pour ${sc} points au Mot le Plus Long sur Granmed ! ${url}`
          : `I found ${count} words (longest: ${longest ?? '—'}) for ${sc} points in The Longest Word on Granmed! ${url}`
    }
    const ok = await shareText(L.shareTitle, text)
    if (ok) toast.success(L.copied)
  }

  const secondsLeft = Math.ceil(timeLeft / 1000)
  const lowTime = secondsLeft <= 10

  /* ================= Rendu ================= */
  return (
    <div className="relative select-none">
      <Confetti fire={confettiKey} count={reduce ? 0 : 110} />

      {/* Flash « 9 lettres » */}
      {nineFlash ? (
        <div key={nineFlash} className="anim-score pointer-events-none absolute inset-x-0 top-1/3 z-10 text-center">
          <span className="inline-block rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-display text-xl font-extrabold text-white shadow-xl sm:text-2xl">
            🎉 {nineFlash} — {L.nineFlash}
          </span>
        </div>
      ) : null}

      {/* ===== Écran de menu ===== */}
      {phase === 'menu' ? (
        <div className="checkerboard flex min-h-[340px] flex-col items-center justify-center gap-4 rounded-2xl border p-6 text-center">
          <div className="flex gap-1.5" aria-hidden="true">
            {'GRANMED'.slice(0, 9).padEnd(9, ' ').split('').map((c, i) =>
              c === ' ' ? null : (
                <span
                  key={i}
                  className={cn(
                    'flex h-12 w-10 items-center justify-center rounded-xl border-2 border-primary/30 bg-card font-display text-xl font-extrabold text-primary',
                    reduce ? '' : 'anim-floaty',
                  )}
                  style={{ animationDelay: `${i * 0.25}s` }}
                >
                  {c}
                </span>
              ),
            )}
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

      {/* ===== Manche en cours ===== */}
      {phase === 'playing' ? (
        <div className="anim-rise">
          {/* Minuteur + score */}
          <div className="flex items-center justify-center gap-3">
            <span
              className={cn(
                'font-display text-4xl font-extrabold tabular-nums transition-colors sm:text-5xl',
                lowTime ? 'text-rose-500' : 'text-amber-500',
              )}
              role="timer"
              aria-label={`${L.timeLeft}: ${secondsLeft}s`}
            >
              {secondsLeft}
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
          </div>
          {/* Barre de temps */}
          <div className="mx-auto mt-2 h-2 w-full max-w-md overflow-hidden rounded-full bg-secondary" aria-hidden="true">
            <div
              className={cn('h-full rounded-full transition-[width] duration-300 ease-linear', lowTime ? 'bg-rose-400' : 'bg-amber-400')}
              style={{ width: `${Math.max(0, (timeLeft / ROUND_MS) * 100)}%` }}
            />
          </div>

          {/* Lettres */}
          <div className="mx-auto mt-4 flex flex-wrap justify-center gap-1.5 sm:gap-2" aria-label={L.dailyLetters}>
            {letters.map((l, i) => (
              <div
                key={i}
                className="flex h-14 w-11 items-center justify-center rounded-xl border-2 border-primary/25 bg-gradient-to-br from-card to-secondary font-display text-2xl font-extrabold text-foreground shadow-sm sm:h-16 sm:w-13 sm:text-3xl"
              >
                {l}
              </div>
            ))}
          </div>

          {/* Saisie */}
          <form onSubmit={onSubmit} className="mx-auto mt-4 flex max-w-md gap-2">
            <input
              ref={inputRef}
              type="text"
              value={guess}
              onChange={(e) => {
                setGuess(normalizeWord(e.target.value))
                setError(null)
              }}
              placeholder={L.placeholder}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={9}
              aria-label={L.placeholder}
              onAnimationEnd={() => setShake(false)}
              className={cn(
                'h-12 w-full flex-1 rounded-xl border-2 bg-card px-4 text-center font-display text-lg font-bold tracking-widest uppercase focus:outline-none',
                error ? (shake ? 'anim-shake border-rose-300' : 'border-rose-300') : 'border-border focus:border-primary',
              )}
            />
            <Button type="submit" size="lg" className="h-12 shrink-0 rounded-xl px-4 sm:px-6">
              <Send className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{L.submit}</span>
            </Button>
          </form>

          {/* Raison d'invalidité */}
          {error ? (
            <p className="mt-2 text-center text-sm font-semibold text-rose-500" role="alert">
              {ERROR_TEXT[error]}
            </p>
          ) : null}

          {/* Mots trouvés */}
          <div className="mt-4">
            <p className="mb-2 text-center text-sm font-semibold text-muted-foreground">
              {L.found} · {found.length}
            </p>
            {found.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground/70">{L.noneYet}</p>
            ) : (
              <div className="nice-scroll mx-auto flex max-h-36 max-w-lg flex-wrap justify-center gap-1.5 overflow-y-auto px-1">
                {sortedFound.map((f) => (
                  <span
                    key={f.word}
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
                    <span className="ms-1 text-xs opacity-70">{f.points}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* ===== Écran final ===== */}
      {phase === 'end' && endData ? (
        <div className="anim-rise rounded-2xl border-2 border-amber-300/60 bg-amber-50/50 p-6 text-center dark:border-amber-500/30 dark:bg-amber-500/10" role="status">
          <p className="font-display text-2xl font-extrabold text-amber-700 dark:text-amber-300">⏰ {L.endTitle}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
            <StatPill icon={<Zap className="h-4 w-4" aria-hidden="true" />} label={L.score} value={endData.score} />
            <StatPill icon={<Timer className="h-4 w-4" aria-hidden="true" />} label={L.longest} value={endData.longest ?? '—'} />
            <StatPill icon={<Trophy className="h-4 w-4" aria-hidden="true" />} label={L.wordsFound} value={endData.count} />
            {endData.isRecord ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Trophy className="h-4 w-4" aria-hidden="true" /> {L.newRecord}
              </span>
            ) : null}
          </div>
          {endData.count > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-muted-foreground">{L.found}</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {sortedFound.map((f) => (
                  <span
                    key={f.word}
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-sm font-bold',
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
                    <span className="ms-1 text-xs opacity-70">{f.points}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}
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
