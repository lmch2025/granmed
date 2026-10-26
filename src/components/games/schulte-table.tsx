'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, RotateCcw, CalendarCheck, Timer, Trophy, Sun, Moon, Contrast, ListOrdered, Zap, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang, type Lang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, mulberry32, seedFromString, shuffle, useReducedMotion } from '@/lib/utils-game'
import { loadSave, saveSave } from '@/lib/save'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'

export const gameId = 'schulte-table'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Retrouvez les nombres dans l’ordre croissant le plus vite possible, des grilles 3×3 aux redoutables 7×7.',
    en: 'Find the numbers in ascending order as fast as you can, from 3×3 grids up to the tricky 7×7.',
  },
  description: {
    fr: [
      'Vision Active est un jeu de table de Schulte, un exercice d’attention visuelle utilisé en psychologie : les nombres de 1 à N² sont répartis au hasard dans une grille, et vous devez les toucher dans l’ordre croissant, le plus rapidement possible. Le chronomètre ne démarre qu’au premier toucher, au dixième de seconde près, et se met en pause automatiquement si vous changez d’onglet.',
      'Cinq tailles de grille sont proposées, de 3×3 (9 nombres) à 7×7 (49 nombres), avec des records personnels de temps et une moyenne de vos derniers résultats pour chacune. Trois modes d’affichage — clair, sombre et contraste élevé (fond noir, gros chiffres jaunes) — rendent l’exercice confortable pour tous les yeux, y compris en pleine partie.',
      'Chaque matin, une grille du jour identique pour tous les joueurs est proposée en 5×5 ou 6×6 : la réussir valide le défi quotidien et alimente votre série de jours. Vos cinq derniers temps restent consultables à tout moment.',
    ],
    en: [
      'Vision Active is a Schulte table game, a visual-attention exercise used in psychology: numbers from 1 to N² are scattered across a grid, and you must tap them in ascending order as fast as possible. The timer only starts on your first tap, runs to a tenth of a second, and auto-pauses if you switch tabs.',
      'Five grid sizes are available, from 3×3 (9 numbers) to 7×7 (49 numbers), each with its own personal time record and the average of your recent results. Three display modes — light, dark and high contrast (black background, large yellow digits) — keep the exercise comfortable for every eye, even mid-game.',
      'Every morning, a daily grid identical for all players is offered in 5×5 or 6×6: completing it validates the daily challenge and feeds your day streak. Your five latest times stay available at any moment.',
    ],
  },
  rules: {
    fr: [
      'Choisissez la taille de la grille (3×3 à 7×7) et le mode d’affichage, puis lancez la partie.',
      'Touchez le nombre 1, puis 2, puis 3… dans l’ordre croissant strict.',
      'Le chronomètre démarre au premier toucher et affiche mm:ss.d.',
      'Si vous quittez l’onglet, le chronomètre se met en pause et reprend à votre retour.',
      'Un nombre correct passe au vert ; un nombre hors ordre tremble et ne fait pas avancer.',
      'La grille est terminée quand le plus grand nombre est touché : votre temps est enregistré.',
      'Réalisez le défi du jour (grille du jour 5×5 ou 6×6) pour valider votre série quotidienne.',
    ],
    en: [
      'Pick the grid size (3×3 to 7×7) and the display mode, then start the game.',
      'Tap number 1, then 2, then 3… in strict ascending order.',
      'The timer starts on your first tap and displays mm:ss.d.',
      'If you leave the tab, the timer pauses and resumes when you come back.',
      'A correct number turns green; an out-of-order number shakes and does not advance.',
      'The grid is complete once the largest number is tapped: your time is recorded.',
      'Complete the daily challenge (a 5×5 or 6×6 grid of the day) to validate your daily streak.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez les nombres directement, une seule main suffit.',
      'Ordinateur : cliquez sur les nombres à la souris, ou au clavier via Tab puis Entrée.',
      'Changez le mode d’affichage à tout moment : pastilles au départ, bouton compact soleil/lune pendant la partie.',
    ],
    en: [
      'Mobile & tablet: tap the numbers directly, one hand is enough.',
      'Desktop: click the numbers with your mouse, or use Tab then Enter on a keyboard.',
      'Switch the display mode at any time: chips before starting, a compact sun/moon button while playing.',
    ],
  },
  features: {
    fr: [
      '5 tailles de grille : 3×3, 4×4, 5×5, 6×6 et 7×7',
      'Chronomètre au dixième de seconde, démarré au premier toucher',
      'Mise en pause automatique du chronomètre quand vous quittez l’onglet',
      '3 modes d’affichage dont un contraste élevé pensé pour l’accessibilité',
      'Records personnels et moyenne de vos derniers temps par taille de grille',
      'Historique des 5 derniers temps',
      'Défi du jour déterministe (grille identique pour tous les joueurs)',
    ],
    en: [
      '5 grid sizes: 3×3, 4×4, 5×5, 6×6 and 7×7',
      'Tenth-of-a-second timer, started on the first tap',
      'Timer automatically pauses when you leave the tab',
      '3 display modes including a high-contrast mode designed for accessibility',
      'Personal records and average of your recent times per grid size',
      'History of your 5 latest times',
      'Deterministic daily challenge (same grid for every player)',
    ],
  },
  tips: {
    fr: [
      'Ne sautez pas d’un nombre à l’autre avec les yeux : balayez doucement la grille et laissez la vision périphérique repérer la cible.',
      'Après chaque touche réussie, revenez au centre de la grille plutôt que de fixer le dernier nombre.',
      'Sur les grandes grilles, mémorisez la position approximative des nombres déjà trouvés pour ne pas y revenir.',
      'Respirez calmement et préférez un rythme régulier à la précipitation : les erreurs coûtent plus cher que la lenteur.',
    ],
    en: [
      'Don’t jump from number to number with your eyes: sweep the grid gently and let peripheral vision spot the target.',
      'After each successful tap, return to the center of the grid instead of staring at the last number.',
      'On large grids, remember the rough position of numbers you already found so you don’t go back to them.',
      'Breathe calmly and prefer a steady pace over rushing: mistakes cost more than slowness.',
    ],
  },
  faq: {
    fr: [
      { q: 'La table de Schulte, c’est quoi exactement ?', a: 'C’est un exercice d’entraînement de l’attention visuelle inventé par le psychiatre Walter Schulte : retrouver des nombres dispersés dans l’ordre. Il est utilisé en psychologie pour travailler la vitesse de recherche et le champ visuel.' },
      { q: 'Le chronomètre démarre-t-il avant mon premier toucher ?', a: 'Non : il démarre exactement au moment où vous touchez le nombre 1. Vous pouvez prendre le temps d’observer la grille avant de commencer.' },
      { q: 'Si je quitte l’onglet en pleine partie, le temps continue-t-il ?', a: 'Non : le chronomètre se met en pause dès que l’onglet devient invisible et repart à votre retour, pour un temps toujours juste.' },
      { q: 'Les records sont-ils séparés par taille de grille ?', a: 'Oui, chaque taille (3×3 à 7×7) possède son propre record de temps et la moyenne de vos derniers résultats, conservés sur votre appareil.' },
      { q: 'La grille du jour est-elle la même pour tous ?', a: 'Oui, elle est générée de façon déterministe à partir de la date : tout le monde affronte la même grille 5×5 ou 6×6 jusqu’au lendemain.' },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui : même la grille 7×7 garde des cases d’environ 45 px, confortables au doigt, et le plateau tient à l’écran sans défilement sur la plupart des téléphones.' },
    ],
    en: [
      { q: 'What exactly is a Schulte table?', a: 'It is a visual-attention training exercise invented by psychiatrist Walter Schulte: find scattered numbers in order. Psychologists use it to work on search speed and visual field.' },
      { q: 'Does the timer start before my first tap?', a: 'No: it starts exactly when you tap number 1. Take all the time you need to scan the grid before starting.' },
      { q: 'If I leave the tab mid-game, does the clock keep running?', a: 'No: the timer pauses as soon as the tab becomes hidden and resumes when you return, so your time stays fair.' },
      { q: 'Are records separate per grid size?', a: 'Yes, every size (3×3 to 7×7) has its own time record and the average of your recent results, saved on your device.' },
      { q: 'Is the daily grid the same for everyone?', a: 'Yes, it is generated deterministically from the date: everyone faces the same 5×5 or 6×6 grid until tomorrow.' },
      { q: 'Can I play on my phone?', a: 'Yes: even the 7×7 grid keeps cells of about 45 px, comfortable for fingers, and the board fits on screen without scrolling on most phones.' },
    ],
  },
  records: {
    'best-time-3': { fr: 'Meilleur temps — 3×3', en: 'Best time — 3×3' },
    'best-time-4': { fr: 'Meilleur temps — 4×4', en: 'Best time — 4×4' },
    'best-time-5': { fr: 'Meilleur temps — 5×5', en: 'Best time — 5×5' },
    'best-time-6': { fr: 'Meilleur temps — 6×6', en: 'Best time — 6×6' },
    'best-time-7': { fr: 'Meilleur temps — 7×7', en: 'Best time — 7×7' },
  },
}

/* ================= Données de jeu ================= */
const SIZES = [3, 4, 5, 6, 7] as const
type DisplayMode = 'light' | 'dark' | 'contrast'
type Phase = 'idle' | 'playing' | 'won'

interface HistoryEntry {
  size: number
  ms: number
}

interface WonInfo {
  ms: number
  size: number
  avg: number
  isRecord: boolean
  xp: number
  stars: number
  daily: boolean
}

const HISTORY_KEEP = 20
const HISTORY_SHOW = 5

const DISPLAY_MODES: [DisplayMode, typeof Sun][] = [
  ['light', Sun],
  ['dark', Moon],
  ['contrast', Contrast],
]

const DISPLAY_STYLES: Record<DisplayMode, { board: string; cell: string; found: string; dim: string }> = {
  light: {
    board: 'bg-card border-border',
    cell: 'bg-card text-foreground border-border hover:bg-accent/70',
    found: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40',
    dim: 'text-foreground/50',
  },
  dark: {
    board: 'bg-zinc-900 border-zinc-700',
    cell: 'bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700',
    found: 'bg-emerald-900/70 text-emerald-300 border-emerald-700',
    dim: 'text-zinc-100/60',
  },
  contrast: {
    board: 'bg-black border-yellow-400',
    cell: 'bg-black text-yellow-400 border-yellow-400/70 hover:bg-yellow-400/10',
    found: 'bg-yellow-400 text-black border-yellow-400',
    dim: 'text-yellow-400/60',
  },
}

function fontSizeClass(n: number): string {
  if (n <= 3) return 'text-4xl sm:text-5xl'
  if (n === 4) return 'text-3xl sm:text-4xl'
  if (n === 5) return 'text-2xl sm:text-3xl'
  if (n === 6) return 'text-xl sm:text-2xl'
  return 'text-lg sm:text-xl'
}

/** Empreinte carrée du plateau : bornée par la hauteur utile (100dvh - 244px),
 *  jamais plus large que le conteneur — aucun défilement vertical ou horizontal
 *  sur mobile, tout en restant confortable en paysage (plancher 300px). */
const BOARD_W = 'w-[min(100%,max(300px,calc(100dvh-244px)))]'

/** mm:ss.d */
function fmtClock(ms: number): string {
  const total = Math.max(0, ms)
  const m = Math.floor(total / 60000)
  const sec = Math.floor((total % 60000) / 1000)
  const d = Math.floor((total % 1000) / 100)
  return `${m}:${String(sec).padStart(2, '0')}.${d}`
}

/** Étoiles de fin de manche selon le temps, sur des seuils du jeu
 *  (le badge « 5×5 en 30 s » sert de repère : par = référence rapide).
 *  ≤ par → 3 ⭐, ≤ par × 1,6 → 2 ⭐, sinon 1 ⭐. */
function starsForTime(n: number, ms: number): number {
  const par = (n <= 3 ? 10 : n === 4 ? 18 : n === 5 ? 30 : n === 6 ? 50 : 80) * 1000
  return ms <= par ? 3 : ms <= par * 1.6 ? 2 : 1
}

/** 23.4 → « 23,4 s » (fr) / « 23.4 s » (en) — pour les records stockés en secondes. */
function fmtSecs(secs: number, lang: Lang): string {
  const s = secs.toFixed(1)
  return `${lang === 'fr' ? s.replace('.', ',') : s} s`
}

/** Grille du jour : déterministe depuis la date locale (identique pour tous les joueurs). */
function dailyToday(): { size: number; cells: number[] } {
  const rand = mulberry32(seedFromString(`${gameId}:${todayKey()}`))
  const size = rand() < 0.5 ? 5 : 6
  return { size, cells: shuffle(Array.from({ length: size * size }, (_, i) => i + 1), rand) }
}

/* ================= Composant principal ================= */
export default function SchulteTableGame() {
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

  const [size, setSize] = useState<number>(5)
  const [display, setDisplay] = useState<DisplayMode>('light')
  const [dailyMode, setDailyMode] = useState(false)
  const [cells, setCells] = useState<number[]>([])
  const [phase, setPhase] = useState<Phase>('idle')
  const [next, setNext] = useState(1)
  const [elapsed, setElapsed] = useState(0)
  const [wrongAt, setWrongAt] = useState<number | null>(null)
  const [popAt, setPopAt] = useState<number | null>(null)
  const [won, setWon] = useState<WonInfo | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [confettiKey, setConfettiKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)

  const startRef = useRef(0) // début du segment courant (0 = chronomètre à l'arrêt)
  const accRef = useRef(0) // millisecondes accumulées avant le segment courant
  const nextRef = useRef(1)
  const timersRef = useRef<number[]>([])
  const lastStartRef = useRef(0)

  const L = {
    fr: {
      displayModes: 'Affichage',
      light: 'Clair',
      dark: 'Sombre',
      contrast: 'Contraste élevé',
      changeDisplay: 'Changer l’affichage',
      grid: 'Grille',
      nextNum: 'À trouver',
      history: 'Vos 5 derniers temps',
      best: 'Record',
      startHint: 'Le chronomètre démarre au premier toucher.',
      dailySame: 'La même grille pour tous les joueurs',
      quit: 'Quitter',
      yourTime: 'Votre temps',
      average: 'Moyenne',
      xpEarned: 'XP',
    },
    en: {
      displayModes: 'Display',
      light: 'Light',
      dark: 'Dark',
      contrast: 'High contrast',
      changeDisplay: 'Change display',
      grid: 'Grid',
      nextNum: 'Find next',
      history: 'Your 5 latest times',
      best: 'Best',
      startHint: 'The timer starts on your first tap.',
      dailySame: 'The same grid for every player',
      quit: 'Quit',
      yourTime: 'Your time',
      average: 'Average',
      xpEarned: 'XP',
    },
  }[lang]

  /* Taille du défi du jour (5 ou 6) — recalculée si la date change à minuit. */
  const dayKey = todayKey()
  const dailySize = useMemo(() => {
    const rand = mulberry32(seedFromString(`${gameId}:${dayKey}`))
    return rand() < 0.5 ? 5 : 6
  }, [dayKey])

  /* Historique (chargé de façon asynchrone — jamais de setState synchrone dans l'effet). */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      const s = loadSave<{ entries?: HistoryEntry[] }>(gameId)
      if (alive && s && Array.isArray(s.entries)) setHistory(s.entries.slice(-HISTORY_KEEP))
    })
    return () => {
      alive = false
    }
  }, [])

  /* Nettoyage des flashs temporisés au démontage. */
  useEffect(() => () => {
    for (const id of timersRef.current) window.clearTimeout(id)
  }, [])

  function elapsedNow(): number {
    return accRef.current + (startRef.current ? Date.now() - startRef.current : 0)
  }

  function flash(setter: (v: number | null) => void, v: number, ms: number) {
    setter(v)
    const id = window.setTimeout(() => setter(null), ms)
    timersRef.current.push(id)
  }

  /* Pause du chronomètre quand l'onglet devient invisible (aucun temps injuste). */
  useEffect(() => {
    if (phase !== 'playing') return
    const onVis = () => {
      if (document.hidden) {
        if (startRef.current) {
          accRef.current += Date.now() - startRef.current
          startRef.current = 0
        }
      } else if (accRef.current > 0) {
        startRef.current = Date.now()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [phase])

  /* Affichage du chronomètre : rafraîchi au dixième de seconde. */
  useEffect(() => {
    if (phase !== 'playing') return
    const id = window.setInterval(() => {
      if (startRef.current || accRef.current) setElapsed(elapsedNow())
    }, 100)
    return () => window.clearInterval(id)
  }, [phase])

  function start(n: number, opts?: { daily?: boolean }) {
    const now = Date.now()
    if (now - lastStartRef.current < 350) return // anti double-tap (double addPlay)
    lastStartRef.current = now
    const daily = opts?.daily ?? false
    const d = daily ? dailyToday() : null
    const gSize = d ? d.size : n
    const newCells = d ? d.cells : shuffle(Array.from({ length: gSize * gSize }, (_, i) => i + 1))
    for (const id of timersRef.current) window.clearTimeout(id)
    timersRef.current = []
    setCells(newCells)
    setDailyMode(daily)
    setSize(gSize)
    setPhase('playing')
    nextRef.current = 1
    setNext(1)
    setElapsed(0)
    setWrongAt(null)
    setPopAt(null)
    startRef.current = 0
    accRef.current = 0
    setWon(null)
    addPlay(gameId)
    sfx.play('swish', { volume: 0.6 })
  }

  /* Victoire : appelée depuis le handler du dernier clic, jamais depuis un effet. */
  function finishWin() {
    const ms = elapsedNow()
    const n = Math.round(Math.sqrt(cells.length))
    const isRecord = setBest(gameId, `best-time-${n}`, Math.round(ms / 100) / 10, true)
    const entries = [...history, { size: n, ms }].slice(-HISTORY_KEEP)
    const sameSize = entries.filter((e) => e.size === n)
    const avg = sameSize.reduce((sum, e) => sum + e.ms, 0) / sameSize.length
    const xp = n * n + (isRecord ? 10 : 0)
    const stars = starsForTime(n, ms)
    setPhase('won')
    setWon({ ms, size: n, avg, isRecord, xp, stars, daily: dailyMode })
    sfx.play('win')
    navigator.vibrate?.(20)
    addWin(gameId)
    addXp(xp)
    addGameXp(gameId, isRecord ? 30 : 25)
    if (n === 7) unlockBadge('schulte-7')
    if (n === 5 && ms < 30000) unlockBadge('schulte-5-30')
    if (dailyMode) completeDaily(gameId)
    setHistory(entries)
    saveSave(gameId, { entries })
    setConfettiKey((k) => k + 1)
    setBurstKey((k) => k + 1)
  }

  function tap(v: number) {
    if (phase !== 'playing') return
    if (v < nextRef.current) return // nombre déjà validé : ignoré silencieusement
    if (startRef.current === 0 && accRef.current === 0) startRef.current = Date.now()
    if (v === nextRef.current) {
      sfx.play('pop', { volume: 0.7 })
      flash(setPopAt, v, 340)
      if (v === cells.length) {
        finishWin()
        return
      }
      nextRef.current = v + 1
      setNext(v + 1)
    } else {
      sfx.play('wrong', { volume: 0.3 })
      navigator.vibrate?.(10)
      flash(setWrongAt, v, 450)
    }
  }

  function cycleDisplay() {
    sfx.play('click', { volume: 0.5 })
    setDisplay(display === 'light' ? 'dark' : display === 'dark' ? 'contrast' : 'light')
  }

  function goIdle() {
    sfx.play('click', { volume: 0.6 })
    setPhase('idle')
    setDailyMode(false)
    setWon(null)
  }

  const styles = DISPLAY_STYLES[display]
  const gridSize = cells.length ? Math.round(Math.sqrt(cells.length)) : size
  const bestSecs = records?.[`best-time-${size}`]?.value
  const DisplayIcon = DISPLAY_MODES.find(([m]) => m === display)?.[1] ?? Sun

  return (
    <div className="relative my-auto w-full select-none">
      <Confetti fire={confettiKey} count={reduce ? 0 : 110} waves={2} gold />
      <VictoryBurst fire={burstKey} stars={won?.stars ?? 3} sub={won ? fmtClock(won.ms) : undefined} />

      {phase === 'idle' ? (
        <>
          {/* Réglages compacts : taille en chips, affichage + Démarrer visibles immédiatement */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t('common.size')}>
            {SIZES.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={size === n}
                onClick={() => {
                  sfx.play('click', { volume: 0.5 })
                  setSize(n)
                }}
                className={cn(
                  'h-11 min-w-11 rounded-full border px-3.5 text-sm font-bold transition-all active:scale-95',
                  size === n
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {n}×{n}
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5" role="group" aria-label={L.displayModes}>
            {DISPLAY_MODES.map(([m, Icon]) => (
              <button
                key={m}
                type="button"
                aria-pressed={display === m}
                aria-label={`${L.displayModes} : ${L[m]}`}
                title={L[m]}
                onClick={() => {
                  sfx.play('click', { volume: 0.5 })
                  setDisplay(m)
                }}
                className={cn(
                  'h-11 w-11 rounded-full border transition-all active:scale-95',
                  display === m
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                <Icon className="mx-auto h-4 w-4" aria-hidden="true" />
              </button>
            ))}
            <Button size="lg" className={cn('ms-auto h-11 rounded-full px-6', !reduce && 'anim-glow')} onClick={() => start(size)}>
              <Play className="h-4 w-4" aria-hidden="true" />
              {t('common.start')}
            </Button>
          </div>

          {/* Défi du jour — bannière compacte */}
          {!dailyDone ? (
            <button
              type="button"
              onClick={() => {
                sfx.play('pop')
                start(dailySize, { daily: true })
              }}
              className="mt-1.5 flex w-full items-center gap-2.5 rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2 text-left transition-transform hover:scale-[1.005] active:scale-[0.99] dark:border-amber-500/25 dark:bg-amber-500/10"
            >
              <span className="text-xl" aria-hidden="true">
                🎁
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-sm font-bold text-amber-700 dark:text-amber-300">
                  {t('common.daily')} · {dailySize}×{dailySize}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">{L.dailySame}</span>
              </span>
              <span className="shrink-0 rounded-full bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white">{t('common.play')}</span>
            </button>
          ) : (
            <p className="mt-1.5 flex items-center gap-2 rounded-xl border border-emerald-300/50 bg-emerald-50/70 px-3 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              {t('common.dailyDone')}
            </p>
          )}

          {/* Aperçu du plateau — même empreinte que la grille pour éviter tout saut de mise en page */}
          <div
            className={cn(
              'relative mx-auto mt-2 flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 p-4 text-center',
              BOARD_W,
              'max-w-[460px]',
              styles.board,
              display === 'light' && 'checkerboard',
            )}
          >
            <div className="flex gap-2.5" aria-hidden="true">
              {['1', '2', '3'].map((e, i) => (
                <span
                  key={i}
                  className={cn('font-display text-4xl font-bold', styles.dim, !reduce && 'anim-floaty')}
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  {e}
                </span>
              ))}
            </div>
            <div className="rounded-2xl border bg-card/90 px-4 py-2.5 shadow-sm">
              <p className="flex items-center gap-1.5 font-display text-sm font-bold tabular-nums">
                <Trophy className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                {L.best} {size}×{size} · {bestSecs != null ? fmtSecs(bestSecs, lang) : '—'}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{L.startHint}</p>
            </div>
          </div>
        </>
      ) : phase === 'playing' ? (
        <>
          {/* HUD compact sur une seule ligne : prochain nombre + chrono + actions */}
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className="flex h-9 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 text-sm font-bold text-primary">
              <ListOrdered className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">{L.nextNum}</span>
              <span key={next} className={cn('tabular-nums', !reduce && 'anim-pop-in')}>
                {next}
              </span>
              <span className="text-primary/60">/{cells.length}</span>
            </span>
            <span
              title={dailyMode ? t('common.daily') : undefined}
              className={cn(
                'flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm font-semibold tabular-nums',
                dailyMode
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                  : 'bg-secondary/70 text-foreground',
              )}
            >
              {dailyMode ? (
                <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <Timer className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
              <span className="sr-only">{t('common.time')}</span>
              {fmtClock(elapsed)}
            </span>
            <span className="ms-auto flex items-center gap-1.5">
              <button
                type="button"
                aria-label={`${L.changeDisplay} (${L[display]})`}
                title={L[display]}
                onClick={cycleDisplay}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground active:scale-95 after:absolute after:-inset-1.5 after:content-['']"
              >
                <DisplayIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={L.quit}
                title={L.quit}
                onClick={goIdle}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground active:scale-95 after:absolute after:-inset-1.5 after:content-['']"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={t('common.restart')}
                title={t('common.restart')}
                onClick={() => {
                  sfx.play('click')
                  start(gridSize, { daily: dailyMode })
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground active:scale-95 after:absolute after:-inset-1.5 after:content-['']"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
            </span>
          </div>

          {/* Grille — tient dans la hauteur utile, cellules en fractions égales */}
          <div
            className={cn(
              'mx-auto grid aspect-square gap-1 rounded-2xl border-2 p-1.5',
              BOARD_W,
              'max-w-[460px]',
              gridSize >= 7 ? 'gap-[3px] p-1' : 'gap-1.5',
              styles.board,
            )}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
            role="group"
            aria-label={`${L.grid} ${gridSize}×${gridSize}`}
          >
            {cells.map((v) => (
              <button
                key={v}
                type="button"
                aria-label={String(v)}
                aria-disabled={v < next}
                onClick={() => tap(v)}
                className={cn(
                  'flex min-h-0 min-w-0 touch-manipulation items-center justify-center rounded-md border font-display font-bold no-select transition-all duration-150 focus-visible:outline-2 focus-visible:outline-ring active:scale-95',
                  fontSizeClass(gridSize),
                  display === 'contrast' && 'font-black',
                  styles.cell,
                  v < next && cn(styles.found, 'opacity-90'),
                  popAt === v && 'anim-pop-in',
                  wrongAt === v && 'anim-shake border-red-500 bg-red-500 text-white',
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </>
      ) : (
        /* Écran de fin : temps exact + moyenne + rejouer immédiatement */
        <div
          className="anim-rise mx-auto flex w-full max-w-[460px] flex-col items-center gap-3 rounded-2xl border-2 border-emerald-300/60 bg-emerald-50/60 p-5 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10"
          role="status"
        >
          <p className="font-display text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
            {won?.daily ? `📅 ${t('common.dailyDone')}` : `🎉 ${t('common.wellDone')}`}
          </p>
          <p className="font-display text-4xl font-black tabular-nums sm:text-5xl">
            <span className="sr-only">{L.yourTime} </span>
            {won ? fmtClock(won.ms) : ''}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <StatPill icon={<Trophy className="h-3.5 w-3.5" aria-hidden="true" />} label={`${won?.size ?? ''}×${won?.size ?? ''}`} value={t('common.completed')} />
            <StatPill icon={<Timer className="h-3.5 w-3.5" aria-hidden="true" />} label={L.average} value={won ? fmtClock(won.avg) : ''} />
            <StatPill icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />} label={L.xpEarned} value={`+${won?.xp ?? 0}`} />
          </div>
          {won?.isRecord ? (
            <span
              className={cn(
                'flex h-9 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
                !reduce && 'anim-glow',
              )}
            >
              <Trophy className="h-4 w-4" aria-hidden="true" /> {t('common.newRecord')}
            </span>
          ) : null}
          <div className="mt-1">
            <RoundEndActions
              gameId={gameId}
              onReplay={() => start(won?.size ?? size)}
              replayLabel={t('common.playAgain')}
              shareResult={
                won ? `${won.size}×${won.size} ${lang === 'fr' ? 'en' : 'in'} ${fmtSecs(won.ms / 1000, lang)}` : undefined
              }
            />
          </div>
          <div className="flex justify-center">
            <Button size="lg" variant="secondary" className="h-11 rounded-full" onClick={goIdle}>
              {t('common.settings')}
            </Button>
          </div>
        </div>
      )}

      {/* Historique compact (jamais pendant la partie) */}
      {phase !== 'playing' && history.length > 0 ? (
        <div className="mt-3 rounded-2xl border bg-card/60 px-3.5 py-2.5">
          <p className="mb-1.5 flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <ListOrdered className="h-3.5 w-3.5" aria-hidden="true" />
            {L.history}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {history
              .slice(-HISTORY_SHOW)
              .reverse()
              .map((h, i) => (
                <li key={i} className="rounded-full bg-secondary/70 px-2.5 py-1 text-xs font-semibold tabular-nums">
                  {h.size}×{h.size} · {fmtClock(h.ms)}
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <span className="flex h-9 items-center gap-1.5 rounded-full border bg-card/80 px-3 text-xs font-semibold">
      <span className="text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
