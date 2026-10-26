'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Play, RotateCcw, CalendarCheck, Timer, Zap, Footprints, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, mulberry32, seedFromString, shuffle } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'

export const gameId = 'memory-match'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Retrouvez toutes les paires de cartes le plus efficacement possible, sur 5 thèmes et 4 tailles de grille.',
    en: 'Find every matching pair as efficiently as you can, across 5 themes and 4 grid sizes.',
  },
  description: {
    fr: [
      "Memory Match est un jeu de mémoire gratuit en ligne dans lequel vous retournez des cartes face cachée pour retrouver les paires identiques. Chaque carte révèle un fruit, une fleur, un animal ou un souvenir rétro ; à vous de mémoriser leurs positions pour les apparier en un minimum de coups.",
      "Le jeu propose cinq thèmes (fruits, nature, nutrition, animaux et souvenirs rétro) et quatre grilles de difficulté croissante, de 6 paires (4×3) à 15 paires (6×5). Un chronomètre facultatif, un compteur de coups et des records personnels sauvegardés permettent de mesurer vos progrès.",
      "Chaque matin, une grille spéciale attend les joueurs réguliers : le défi du jour de Memory Match, identique pour tous, qui alimente votre série de jours consécutifs et rapporte un bonus d'XP à votre parcours Granmed.",
    ],
    en: [
      "Memory Match is a free online memory game where you flip face-down cards to find identical pairs. Each card reveals a fruit, a flower, an animal or a retro memory; your job is to memorize their positions and match them in as few moves as possible.",
      "The game offers five themes (fruits, nature, nutrition, animals and retro memories) and four grids of increasing difficulty, from 6 pairs (4×3) up to 15 pairs (6×5). An optional timer, a move counter and saved personal bests let you track your progress.",
      "Every morning, a special grid awaits regular players: the Memory Match daily challenge, identical for everyone, which feeds your consecutive-day streak and earns bonus XP for your Granmed journey.",
    ],
  },
  rules: {
    fr: [
      'Choisissez un thème et une taille de grille, puis lancez la partie.',
      'Touchez ou cliquez sur deux cartes pour les retourner.',
      'Si les deux cartes sont identiques, la paire reste découverte.',
      'Sinon, elles se retournent à nouveau : mémorisez leurs positions.',
      'La partie est gagnée lorsque toutes les paires sont découvertes.',
      'Réussissez la grille avec le moins de coups possible — et, pour les experts, sans aucune erreur.',
    ],
    en: [
      'Pick a theme and a grid size, then start the game.',
      'Tap or click two cards to flip them.',
      'If the two cards match, the pair stays revealed.',
      'Otherwise they flip back — memorize their positions.',
      'You win when every pair has been discovered.',
      'Aim to clear the grid in as few moves as possible — and, for experts, without a single mistake.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez une carte pour la retourner.',
      'Ordinateur : cliquez sur les cartes, ou naviguez avec Tab puis validez avec Entrée.',
      'Activez ou désactivez le chronomètre avec l’interrupteur dédié.',
    ],
    en: [
      'Mobile & tablet: tap a card to flip it.',
      'Desktop: click cards, or navigate with Tab and confirm with Enter.',
      'Turn the timer on or off with the dedicated switch.',
    ],
  },
  features: {
    fr: [
      '5 thèmes : fruits, nature, nutrition, animaux et souvenirs rétro',
      '4 tailles de grille : 6, 8, 12 ou 15 paires',
      'Chronomètre facultatif et compteur de coups',
      'Records personnels par taille de grille',
      'Défi quotidien avec grille spéciale',
      'Animations fluides et sons satisfaisants',
    ],
    en: [
      '5 themes: fruits, nature, nutrition, animals and retro memories',
      '4 grid sizes: 6, 8, 12 or 15 pairs',
      'Optional timer and move counter',
      'Personal bests per grid size',
      'Daily challenge with a special grid',
      'Smooth animations and satisfying sounds',
    ],
  },
  tips: {
    fr: [
      'Commencez par retourner les cartes d’une même zone (une rangée ou une colonne) : vous mémoriserez mieux des positions groupées.',
      'Nommez chaque carte à voix haute ou dans votre tête (« fraise, en haut à gauche ») : le langage ancre la mémoire visuelle.',
      'Sur les grandes grilles, utilisez la première passe pour repérer les paires faciles, puis concentrez-vous sur les positions incertaines.',
      'Le chronomètre désactivé est parfait pour s’entraîner ; activez-le quand vous visez le record de vitesse.',
    ],
    en: [
      'Start by flipping cards within one zone (a row or column): grouped positions are easier to memorize.',
      'Name each card out loud or in your head (“strawberry, top left”): language anchors visual memory.',
      'On large grids, use a first pass to spot easy pairs, then focus on uncertain positions.',
      'With the timer off you can practice freely; switch it on when you go for the speed record.',
    ],
  },
  faq: {
    fr: [
      { q: 'Memory Match est-il vraiment gratuit ?', a: 'Oui : toutes les grilles, tous les thèmes et le défi quotidien sont accessibles gratuitement, sans inscription ni téléchargement.' },
      { q: 'Comment le score est-il calculé ?', a: 'Il n’y a pas de score à proprement parler : vos performances se mesurent en nombre de coups et en temps. Vos records par taille de grille sont sauvegardés sur votre appareil.' },
      { q: 'Quelle est la meilleure technique pour gagner ?', a: 'La technique la plus efficace consiste à toujours retourner une nouvelle carte dont vous cherchez la jumelle, plutôt que deux cartes inconnues : vous maximisez les informations à chaque coup.' },
      { q: 'La grille du défi du jour est-elle la même pour tous ?', a: 'Oui. La grille du jour est générée de façon déterministe à partir de la date : tous les joueurs affrontent exactement la même disposition jusqu’au lendemain matin.' },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui, le jeu est conçu pour le tactile : les cartes sont dimensionnées pour être touchées facilement, en portrait comme en paysage.' },
    ],
    en: [
      { q: 'Is Memory Match really free?', a: 'Yes: every grid, every theme and the daily challenge are free to play, with no sign-up and no download.' },
      { q: 'How is the score calculated?', a: 'There is no score as such: your performance is measured in moves and time. Your best results per grid size are saved on your device.' },
      { q: 'What is the best technique to win?', a: 'The most effective technique is to always flip one new card whose twin you are looking for, rather than two unknown cards: you maximize information with every move.' },
      { q: 'Is the daily grid the same for everyone?', a: 'Yes. The daily grid is generated deterministically from the date: every player faces exactly the same layout until the next morning.' },
      { q: 'Can I play on my phone?', a: 'Yes, the game is touch-first: cards are sized for easy tapping, in portrait or landscape.' },
    ],
  },
  records: {
    'best-moves-6': { fr: 'Coups — 6 paires', en: 'Moves — 6 pairs' },
    'best-moves-8': { fr: 'Coups — 8 paires', en: 'Moves — 8 pairs' },
    'best-moves-12': { fr: 'Coups — 12 paires', en: 'Moves — 12 pairs' },
    'best-moves-15': { fr: 'Coups — 15 paires', en: 'Moves — 15 pairs' },
    'best-time-6': { fr: 'Temps — 6 paires', en: 'Time — 6 pairs' },
    'best-time-8': { fr: 'Temps — 8 paires', en: 'Time — 8 pairs' },
    'best-time-12': { fr: 'Temps — 12 paires', en: 'Time — 12 pairs' },
    'best-time-15': { fr: 'Temps — 15 paires', en: 'Time — 15 pairs' },
  },
}

/* ================= Données de jeu ================= */
type ThemeId = 'fruits' | 'nature' | 'nutrition' | 'animals' | 'retro'

const THEMES: Record<ThemeId, { icon: string; label: Record<'fr' | 'en', string>; emojis: string[] }> = {
  fruits: {
    icon: '🍓',
    label: { fr: 'Fruits', en: 'Fruits' },
    emojis: ['🍇', '🍓', '🍒', '🍑', '🍍', '🥝', '🍎', '🍐', '🍊', '🍋', '🍉', '🥭', '🍌', '🥑', '🫐'],
  },
  nature: {
    icon: '🌻',
    label: { fr: 'Nature', en: 'Nature' },
    emojis: ['🌻', '🌷', '🌼', '🌿', '🍀', '🌲', '🌳', '🐝', '🦋', '🌙', '☀️', '🌈', '🍁', '🌊', '🌸'],
  },
  nutrition: {
    icon: '🥕',
    label: { fr: 'Nutrition', en: 'Nutrition' },
    emojis: ['🥕', '🥦', '🌽', '🥔', '🍅', '🧄', '🧅', '🥬', '🫑', '🍆', '🫘', '🧀', '🍳', '🐟', '🥜'],
  },
  animals: {
    icon: '🐱',
    label: { fr: 'Animaux', en: 'Animals' },
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
  },
  retro: {
    icon: '📻',
    label: { fr: 'Souvenirs rétro', en: 'Retro memories' },
    emojis: ['📻', '📺', '☎️', '⏰', '📷', '📼', '♟️', '🎨', '🧵', '🍪', '☕', '🎾', '✉️', '🕯️', '🔑'],
  },
}

type SizeId = '6' | '8' | '12' | '15'
const SIZES: Record<SizeId, { pairs: number; label: Record<'fr' | 'en', string> }> = {
  '6': { pairs: 6, label: { fr: 'Facile · 6 paires', en: 'Easy · 6 pairs' } },
  '8': { pairs: 8, label: { fr: 'Moyen · 8 paires', en: 'Medium · 8 pairs' } },
  '12': { pairs: 12, label: { fr: 'Difficile · 12 paires', en: 'Hard · 12 pairs' } },
  '15': { pairs: 15, label: { fr: 'Expert · 15 paires', en: 'Expert · 15 pairs' } },
}

interface Card {
  id: number
  emoji: string
}

function buildDeck(theme: ThemeId, pairs: number, rand: () => number): Card[] {
  const chosen = shuffle(THEMES[theme].emojis, rand).slice(0, pairs)
  const deck = [...chosen, ...chosen].map((emoji, i) => ({ id: i, emoji }))
  return shuffle(deck, rand)
}

/* ================= Textes locaux ================= */
const LOC = {
  fr: {
    board: 'Plateau de jeu',
    card: 'Carte',
    matched: 'paire trouvée',
    pairs: 'Paires',
    pairsWord: 'paires',
    flawless: 'Sans aucune erreur',
  },
  en: {
    board: 'Game board',
    card: 'Card',
    matched: 'pair found',
    pairs: 'Pairs',
    pairsWord: 'pairs',
    flawless: 'No mistakes',
  },
} as const

/** Breakpoint sm : 6 colonnes pour les grandes grilles (12/15 paires). */
function useMinWidth(px: number): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(`(min-width: ${px}px)`)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(`(min-width: ${px}px)`).matches,
    () => false,
  )
}

/* ================= Composant principal ================= */
export default function MemoryMatchGame() {
  const t = useT()
  const lang = useLang()
  const L = LOC[lang]
  const dailyDone = useIsDailyDone(gameId)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)

  const [theme, setTheme] = useState<ThemeId>('fruits')
  const [size, setSize] = useState<SizeId>('8')
  const [dailyMode, setDailyMode] = useState(false)
  const [showTimer, setShowTimer] = useState(true)
  const [deck, setDeck] = useState<Card[]>([])
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won'>('idle')
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [wrongPair, setWrongPair] = useState<number[] | null>(null)
  const [moves, setMoves] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [won, setWon] = useState<{ time: number; moves: number; mistakes: number; isRecord: boolean; xp: number } | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)
  const [deal, setDeal] = useState(0)
  const lockRef = useRef(false)
  const genRef = useRef(0)
  const startRef = useRef(0)
  const hiddenAtRef = useRef(0)
  const lastStartRef = useRef(0)
  const replayBtnRef = useRef<HTMLButtonElement>(null)

  /* --- Défi du jour : thème + taille déterministes --- */
  const dailyConfig = useMemo(() => {
    const rand = mulberry32(seedFromString(`memory:${todayKey()}`))
    const themes: ThemeId[] = ['fruits', 'nature', 'nutrition', 'animals', 'retro']
    const sizes: SizeId[] = ['6', '8', '12', '15']
    return { theme: themes[Math.floor(rand() * themes.length)], size: sizes[Math.floor(rand() * sizes.length)] }
  }, [])

  /* --- Lancement d'une partie (incrément de génération : invalide
         les timeouts en attente d'une partie précédente) --- */
  const startGame = useCallback(
    (opts?: { daily?: boolean }) => {
      const now = Date.now()
      if (now - lastStartRef.current < 350) return // anti double-tap (double addPlay)
      lastStartRef.current = now
      const isDaily = opts?.daily ?? false
      const gTheme = isDaily ? dailyConfig.theme : theme
      const gSize = isDaily ? dailyConfig.size : size
      const rand = isDaily ? mulberry32(seedFromString(`memory-deck:${todayKey()}`)) : Math.random
      genRef.current += 1
      lockRef.current = false
      hiddenAtRef.current = 0
      setDeck(buildDeck(gTheme, SIZES[gSize].pairs, rand))
      setDailyMode(isDaily)
      setPhase('playing')
      setFlipped([])
      setMatched(new Set())
      setWrongPair(null)
      setMoves(0)
      setMistakes(0)
      setElapsed(0)
      setWon(null)
      setDeal((d) => d + 1)
      startRef.current = Date.now()
      addPlay(gameId)
      sfx.play('sweep')
    },
    [theme, size, dailyConfig, addPlay],
  )

  const goIdle = useCallback(() => {
    sfx.play('click')
    setPhase('idle')
    setWon(null)
    setDailyMode(false)
  }, [])

  /* --- Victoire (appelée depuis le handler, jamais depuis un effet) --- */
  const finishWin = useCallback(
    (finalMoves: number, finalMistakes: number) => {
      const time = Date.now() - startRef.current
      const pairs = SIZES[dailyMode ? dailyConfig.size : size].pairs
      const rec1 = setBest(gameId, `best-moves-${pairs}`, finalMoves, true)
      const rec2 = setBest(gameId, `best-time-${pairs}`, Math.round(time / 100) / 10, true)
      const isRecord = rec1 || rec2
      const xp = 15 + pairs * 2 + (isRecord ? 10 : 0)
      setPhase('won')
      setWon({ time, moves: finalMoves, mistakes: finalMistakes, isRecord, xp })
      setConfettiKey((k) => k + 1)
      setBurstKey((k) => k + 1)
      sfx.play('win')
      navigator.vibrate?.(30)
      addWin(gameId)
      addXp(xp)
      addGameXp(gameId, 22 + (finalMistakes === 0 ? 8 : 0))
      if (finalMistakes === 0) unlockBadge('memory-perfect')
      if (pairs === 15) unlockBadge('memory-master')
      if (dailyMode) completeDaily(gameId)
    },
    [dailyMode, dailyConfig.size, size, setBest, addWin, addXp, addGameXp, unlockBadge, completeDaily],
  )

  /* --- Chronomètre (pause quand l'onglet est masqué) --- */
  useEffect(() => {
    if (phase !== 'playing') return
    const id = window.setInterval(() => setElapsed(Date.now() - startRef.current), 250)
    const onVis = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now()
      } else if (hiddenAtRef.current > 0) {
        startRef.current += Date.now() - hiddenAtRef.current
        hiddenAtRef.current = 0
        setElapsed(Date.now() - startRef.current)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [phase])

  /* --- Focus clavier immédiat sur « Rejouer » après la victoire --- */
  useEffect(() => {
    if (phase === 'won') replayBtnRef.current?.focus({ preventScroll: true })
  }, [phase])

  /* --- Logique de retournement --- */
  const flip = (idx: number) => {
    if (phase !== 'playing' || lockRef.current) return
    if (flipped.includes(idx) || matched.has(idx)) return
    sfx.play('flip')

    const next = [...flipped, idx]
    setFlipped(next)

    if (next.length !== 2) return

    const gen = genRef.current
    const [a, b] = next
    const newMoves = moves + 1
    setMoves(newMoves)
    lockRef.current = true

    if (deck[a].emoji === deck[b].emoji) {
      window.setTimeout(() => {
        if (genRef.current !== gen) return
        sfx.play('pair')
        navigator.vibrate?.(10)
        const nextMatched = new Set(matched)
        nextMatched.add(a)
        nextMatched.add(b)
        setMatched(nextMatched)
        setFlipped([])
        lockRef.current = false
        if (nextMatched.size === deck.length) {
          finishWin(newMoves, mistakes)
        }
      }, 420)
    } else {
      setMistakes((m) => m + 1)
      setWrongPair([a, b])
      window.setTimeout(() => {
        if (genRef.current !== gen) return
        sfx.play('wrong', { volume: 0.35 })
        navigator.vibrate?.(15)
        setFlipped([])
        setWrongPair(null)
        lockRef.current = false
      }, 850)
    }
  }

  /* --- Géométrie du plateau : la grille entière tient dans le budget
         vertical mobile (≈ 100dvh − 246px) grâce à une largeur maximale
         dérivée du ratio colonnes/lignes (espacement 8 px inclus). --- */
  const gSize: SizeId = dailyMode ? dailyConfig.size : size
  const pairsTotal = SIZES[gSize].pairs
  const foundPairs = matched.size / 2
  const wide = useMinWidth(640)
  const cols = pairsTotal >= 12 && wide ? 6 : 4
  const rows = Math.ceil((pairsTotal * 2) / cols)
  const ratio = cols / rows
  const extraGap = (ratio - 1) * 8
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    maxWidth: `min(100%, 620px, calc((100dvh - 246px) * ${ratio.toFixed(4)} ${extraGap >= 0 ? '+' : '-'} ${Math.abs(extraGap).toFixed(1)}px))`,
    containerType: 'inline-size',
  }

  /* --- Rendu --- */
  const winStars = won ? (won.mistakes === 0 ? 3 : won.mistakes <= 2 ? 2 : 1) : 3

  return (
    <div className="relative my-auto w-full select-none">
      <Confetti fire={confettiKey} count={110} waves={2} gold />
      <VictoryBurst fire={burstKey} stars={winStars} sub={won ? `${t('common.moves')} ${won.moves} · ${fmt(won.time)}` : undefined} />

      {phase === 'idle' ? (
        /* ============ Écran de réglages compact : « Jouer » visible sans scroll ============ */
        <div className="space-y-2">
          {!dailyDone ? (
            <button
              type="button"
              onClick={() => startGame({ daily: true })}
              className="flex h-11 w-full items-center gap-2 rounded-xl border border-amber-300/60 bg-amber-50 px-3 text-left transition-colors hover:bg-amber-100/70 active:scale-[0.99] dark:border-amber-500/25 dark:bg-amber-500/10 dark:hover:bg-amber-500/15"
            >
              <CalendarCheck className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-xs font-bold text-amber-800 dark:text-amber-300">
                {t('common.daily')} · {THEMES[dailyConfig.theme].label[lang]} · {SIZES[dailyConfig.size].pairs} {L.pairsWord}
              </span>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[11px] font-bold text-white">
                <Play className="h-3 w-3" aria-hidden="true" />
                {t('common.play')}
              </span>
            </button>
          ) : null}

          {/* Thèmes — chips condensées sur une ligne */}
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('common.theme_name')}>
            {(Object.keys(THEMES) as ThemeId[]).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={theme === id}
                title={THEMES[id].label[lang]}
                onClick={() => {
                  sfx.play('click', { volume: 0.5 })
                  setTheme(id)
                }}
                className={cn(
                  'flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-all',
                  theme === id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                <span aria-hidden="true">{THEMES[id].icon}</span>
                <span className="hidden sm:inline">{THEMES[id].label[lang]}</span>
                <span className="sr-only sm:hidden">{THEMES[id].label[lang]}</span>
              </button>
            ))}
          </div>

          {/* Tailles + chronomètre */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('common.size')}>
              {(Object.keys(SIZES) as SizeId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={size === id}
                  title={SIZES[id].label[lang]}
                  onClick={() => {
                    sfx.play('click', { volume: 0.5 })
                    setSize(id)
                  }}
                  className={cn(
                    'flex h-9 min-w-11 items-center justify-center gap-1 rounded-full border px-2.5 text-xs font-bold transition-all',
                    size === id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {SIZES[id].pairs}
                </button>
              ))}
            </div>
            <div className="ms-auto flex h-9 shrink-0 items-center gap-2 rounded-full border bg-card px-3">
              <Switch
                id="timer-switch"
                checked={showTimer}
                onCheckedChange={(v) => {
                  sfx.play('click', { volume: 0.4 })
                  setShowTimer(v)
                }}
                aria-label={t('common.optionalTimer')}
              />
              <Label htmlFor="timer-switch" className="cursor-pointer text-muted-foreground">
                <Timer className="h-4 w-4" aria-hidden="true" />
              </Label>
            </div>
          </div>

          {/* Jouer */}
          <Button size="lg" className="anim-glow h-12 w-full rounded-2xl text-base" onClick={() => startGame()}>
            <Play className="h-5 w-5" aria-hidden="true" />
            {t('common.playNow')}
          </Button>

          {/* Aperçu compact du thème choisi */}
          <div className="checkerboard flex h-[min(24dvh,190px)] w-full flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-center">
            <div className="flex gap-2.5" aria-hidden="true">
              {THEMES[theme].emojis.slice(0, 4).map((e, i) => (
                <span key={i} className="anim-floaty text-3xl" style={{ animationDelay: `${i * 0.45}s` }}>
                  {e}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {THEMES[theme].label[lang]} · {SIZES[size].label[lang]}
            </p>
          </div>
        </div>
      ) : phase === 'playing' ? (
        /* ============ Partie en cours : HUD une ligne + plateau à l'écran ============ */
        <>
          <div className="mb-2 flex items-center gap-1.5">
            <StatChip icon={<Footprints className="h-3.5 w-3.5" aria-hidden="true" />} label={t('common.moves')} value={moves} />
            <StatChip icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />} label={L.pairs} value={`${foundPairs}/${pairsTotal}`} />
            {showTimer ? <StatChip icon={<Timer className="h-3.5 w-3.5" aria-hidden="true" />} value={fmt(elapsed)} /> : null}
            {dailyMode ? (
              <span
                title={t('common.daily')}
                className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-amber-100 px-2.5 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t('common.daily')}</span>
              </span>
            ) : null}
            <Button
              variant="secondary"
              size="sm"
              className="relative ms-auto h-9 shrink-0 gap-1.5 rounded-full px-3 after:absolute after:-inset-1.5 after:content-['']"
              aria-label={t('common.restart')}
              onClick={() => startGame({ daily: dailyMode })}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t('common.restart')}</span>
            </Button>
          </div>

          <div key={deal} className="anim-rise mx-auto grid w-full gap-2" style={gridStyle} role="group" aria-label={L.board}>
            {deck.map((card, idx) => {
              const isFlipped = flipped.includes(idx) || matched.has(idx)
              const isMatched = matched.has(idx)
              const isWrong = wrongPair?.includes(idx) ?? false
              return (
                <button
                  key={`${deal}-${card.id}`}
                  type="button"
                  aria-label={
                    isMatched
                      ? `${L.card} ${idx + 1} — ${L.matched}`
                      : isFlipped
                        ? `${L.card} ${idx + 1} : ${card.emoji}`
                        : `${L.card} ${idx + 1}`
                  }
                  disabled={isMatched}
                  onClick={() => flip(idx)}
                  className={cn(
                    'flip-scene aspect-square w-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    isWrong && 'anim-shake',
                    isMatched && 'anim-pop-in',
                  )}
                >
                  <div className={cn('flip-inner relative h-full w-full no-select', isFlipped && 'flipped')}>
                    <div className="flip-face absolute inset-0 flex items-center justify-center rounded-xl border-2 border-primary/25 bg-gradient-to-br from-primary to-orange-400 shadow-sm transition-transform hover:scale-[1.04]">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground/90 sm:h-6 sm:w-6" fill="none" aria-hidden="true">
                        <path d="M12 21c-4.5-2.2-7.5-5.6-7.5-9.6C4.5 7.5 7.5 5 10.2 5c1 0 1.8.4 1.8.4S12.8 5 13.8 5C16.5 5 19.5 7.5 19.5 11.4c0 4-3 7.4-7.5 9.6Z" fill="currentColor" opacity="0.35" />
                        <path d="M12 17.5v-5m0 0c0-1.8 1.6-3 3.4-3 0 1.9-1.5 3-3.4 3Zm0 1.2c0-1.6-1.4-2.8-3-2.8 0 1.7 1.3 2.8 3 2.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div
                      className={cn(
                        'flip-face flip-back absolute inset-0 flex items-center justify-center rounded-xl border-2 shadow-sm',
                        isMatched ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/15' : 'border-border bg-card',
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="leading-none"
                        style={{ fontSize: cols === 4 ? 'min(14cqw, 4rem)' : 'min(10cqw, 3.5rem)' }}
                      >
                        {card.emoji}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      ) : won ? (
        /* ============ Victoire : résumé + actions immédiatement visibles ============ */
        <div
          className="anim-rise mx-auto w-full max-w-md rounded-2xl border-2 border-emerald-300/60 bg-emerald-50/60 p-4 text-center sm:p-6 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          role="status"
        >
          <p className="font-display text-xl font-extrabold text-emerald-700 dark:text-emerald-300 sm:text-2xl">🎉 {t('common.victory')}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <StatChip icon={<Footprints className="h-3.5 w-3.5" aria-hidden="true" />} label={t('common.moves')} value={won.moves} />
            <StatChip icon={<Timer className="h-3.5 w-3.5" aria-hidden="true" />} label={t('common.time')} value={fmt(won.time)} />
            <StatChip icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />} label={L.pairs} value={pairsTotal} />
            <StatChip icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />} value={`+${won.xp} XP`} />
            {won.mistakes === 0 ? (
              <span className="flex h-9 items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                ✨ {L.flawless}
              </span>
            ) : null}
            {won.isRecord ? (
              <span className="flex h-9 items-center gap-1.5 rounded-full bg-amber-100 px-2.5 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Trophy className="h-4 w-4" aria-hidden="true" /> {t('common.newRecord')}
              </span>
            ) : null}
          </div>
          <div className="mt-4">
            <RoundEndActions
              gameId={gameId}
              onReplay={() => startGame({ daily: dailyMode })}
              replayLabel={t('common.playAgain')}
              primaryRef={replayBtnRef}
              shareResult={
                lang === 'fr'
                  ? `${pairsTotal} paires en ${fmt(won.time)} · ${won.mistakes} fautes`
                  : `${pairsTotal} pairs in ${fmt(won.time)} · ${won.mistakes} misses`
              }
            />
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Button size="lg" variant="secondary" className="rounded-full" onClick={goIdle}>
              <Play className="h-4 w-4" aria-hidden="true" /> {t('game.newGame')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

/* ================= Sous-composants ================= */
function StatChip({ icon, label, value }: { icon: React.ReactNode; label?: string; value: React.ReactNode }) {
  return (
    <span className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-secondary/70 px-2.5 text-xs font-semibold">
      <span className="text-muted-foreground" aria-hidden="true">{icon}</span>
      {label ? <span className="text-[11px] font-medium text-muted-foreground">{label}</span> : null}
      <span className="tabular-nums">{value}</span>
    </span>
  )
}

function fmt(ms: number): string {
  const s = ms / 1000
  if (s < 60) return `${s.toFixed(1)}s`
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}
