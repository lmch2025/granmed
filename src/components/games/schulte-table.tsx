'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, RotateCcw, CalendarCheck, Timer, Trophy, Sun, Moon, Contrast, ListOrdered, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, mulberry32, seedFromString, shuffle, useReducedMotion } from '@/lib/utils-game'
import { loadSave, saveSave } from '@/lib/save'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'

export const gameId = 'schulte-table'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Retrouvez les nombres dans l’ordre croissant le plus vite possible, des grilles 3×3 aux redoutables 7×7.',
    en: 'Find the numbers in ascending order as fast as you can, from 3×3 grids up to the tricky 7×7.',
  },
  description: {
    fr: [
      'Vision Active est un jeu de table de Schulte, un exercice d’attention visuelle utilisé en psychologie : les nombres de 1 à N² sont répartis au hasard dans une grille, et vous devez les toucher dans l’ordre croissant, le plus rapidement possible. Le chronomètre ne démarre qu’au premier toucher, au dixième de seconde près.',
      'Cinq tailles de grille sont proposées, de 3×3 (9 nombres) à 7×7 (49 nombres), avec des records personnels de temps pour chacune. Trois modes d’affichage — clair, sombre et contraste élevé (fond noir, gros chiffres jaunes) — rendent l’exercice confortable pour tous les yeux.',
      'Chaque matin, une grille du jour identique pour tous les joueurs est proposée en 5×5 ou 6×6 : la réussir valide le défi quotidien et alimente votre série de jours. Vos cinq derniers temps restent consultables à tout moment.',
    ],
    en: [
      'Vision Active is a Schulte table game, a visual-attention exercise used in psychology: numbers from 1 to N² are scattered across a grid, and you must tap them in ascending order as fast as possible. The timer only starts on your first tap and runs to a tenth of a second.',
      'Five grid sizes are available, from 3×3 (9 numbers) to 7×7 (49 numbers), each with its own personal time record. Three display modes — light, dark and high contrast (black background, large yellow digits) — keep the exercise comfortable for every eye.',
      'Every morning, a daily grid identical for all players is offered in 5×5 or 6×6: completing it validates the daily challenge and feeds your day streak. Your five latest times stay available at any moment.',
    ],
  },
  rules: {
    fr: [
      'Choisissez la taille de la grille (3×3 à 7×7) et le mode d’affichage, puis lancez la partie.',
      'Touchez le nombre 1, puis 2, puis 3… dans l’ordre croissant strict.',
      'Le chronomètre démarre au premier toucher et affiche mm:ss.d.',
      'Un nombre correct passe au vert ; un nombre hors ordre tremble et ne fait pas avancer.',
      'La grille est terminée quand le plus grand nombre est touché : votre temps est enregistré.',
      'Réalisez le défi du jour (grille du jour 5×5 ou 6×6) pour valider votre série quotidienne.',
    ],
    en: [
      'Pick the grid size (3×3 to 7×7) and the display mode, then start the game.',
      'Tap number 1, then 2, then 3… in strict ascending order.',
      'The timer starts on your first tap and displays mm:ss.d.',
      'A correct number turns green; an out-of-order number shakes and does not advance.',
      'The grid is complete once the largest number is tapped: your time is recorded.',
      'Complete the daily challenge (a 5×5 or 6×6 grid of the day) to validate your daily streak.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez les nombres directement, une seule main suffit.',
      'Ordinateur : cliquez sur les nombres à la souris.',
      'Changez le mode d’affichage à tout moment avec les pastilles Clair / Sombre / Contraste.',
    ],
    en: [
      'Mobile & tablet: tap the numbers directly, one hand is enough.',
      'Desktop: click the numbers with your mouse.',
      'Switch the display mode at any time with the Light / Dark / Contrast chips.',
    ],
  },
  features: {
    fr: [
      '5 tailles de grille : 3×3, 4×4, 5×5, 6×6 et 7×7',
      'Chronomètre au dixième de seconde, démarré au premier toucher',
      '3 modes d’affichage dont un contraste élevé pensé pour l’accessibilité',
      'Records personnels de temps par taille de grille',
      'Historique des 5 derniers temps',
      'Défi du jour déterministe (grille identique pour tous les joueurs)',
    ],
    en: [
      '5 grid sizes: 3×3, 4×4, 5×5, 6×6 and 7×7',
      'Tenth-of-a-second timer, started on the first tap',
      '3 display modes including a high-contrast mode designed for accessibility',
      'Personal time records per grid size',
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
      { q: 'Les records sont-ils séparés par taille de grille ?', a: 'Oui, chaque taille (3×3 à 7×7) possède son propre record de temps, conservé sur votre appareil.' },
      { q: 'La grille du jour est-elle la même pour tous ?', a: 'Oui, elle est générée de façon déterministe à partir de la date : tout le monde affronte la même grille 5×5 ou 6×6 jusqu’au lendemain.' },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui : même la grille 7×7 garde des cases d’environ 45 px, confortables au doigt, en portrait comme en paysage.' },
    ],
    en: [
      { q: 'What exactly is a Schulte table?', a: 'It is a visual-attention training exercise invented by psychiatrist Walter Schulte: find scattered numbers in order. Psychologists use it to work on search speed and visual field.' },
      { q: 'Does the timer start before my first tap?', a: 'No: it starts exactly when you tap number 1. Take all the time you need to scan the grid before starting.' },
      { q: 'Are records separate per grid size?', a: 'Yes, every size (3×3 to 7×7) has its own time record, saved on your device.' },
      { q: 'Is the daily grid the same for everyone?', a: 'Yes, it is generated deterministically from the date: everyone faces the same 5×5 or 6×6 grid until tomorrow.' },
      { q: 'Can I play on my phone?', a: 'Yes: even the 7×7 grid keeps cells of about 45 px, comfortable for fingers, in portrait or landscape.' },
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

const DISPLAY_STYLES: Record<DisplayMode, { board: string; cell: string; found: string }> = {
  light: {
    board: 'bg-card border-border',
    cell: 'bg-card text-foreground border-border hover:bg-accent/70',
    found: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40',
  },
  dark: {
    board: 'bg-zinc-900 border-zinc-700',
    cell: 'bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700',
    found: 'bg-emerald-900/70 text-emerald-300 border-emerald-700',
  },
  contrast: {
    board: 'bg-black border-yellow-400',
    cell: 'bg-black text-yellow-400 border-yellow-400/70 hover:bg-yellow-400/10',
    found: 'bg-yellow-400 text-black border-yellow-400',
  },
}

function fontSizeClass(n: number): string {
  if (n <= 3) return 'text-2xl sm:text-4xl'
  if (n === 4) return 'text-xl sm:text-3xl'
  if (n === 5) return 'text-lg sm:text-2xl'
  if (n === 6) return 'text-base sm:text-xl'
  return 'text-sm sm:text-lg'
}

/** mm:ss.d */
function fmtClock(ms: number): string {
  const total = Math.max(0, ms)
  const m = Math.floor(total / 60000)
  const sec = Math.floor((total % 60000) / 1000)
  const d = Math.floor((total % 1000) / 100)
  return `${m}:${String(sec).padStart(2, '0')}.${d}`
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
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)

  const [size, setSize] = useState<number>(5)
  const [display, setDisplay] = useState<DisplayMode>('light')
  const [dailyMode, setDailyMode] = useState(false)
  const [cells, setCells] = useState<number[]>([])
  const [phase, setPhase] = useState<Phase>('idle')
  const [next, setNext] = useState(1)
  const [elapsed, setElapsed] = useState(0)
  const [wrongAt, setWrongAt] = useState<number | null>(null)
  const [popAt, setPopAt] = useState<number | null>(null)
  const [won, setWon] = useState<{ ms: number; isRecord: boolean; size: number } | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [confettiKey, setConfettiKey] = useState(0)

  const startRef = useRef(0)
  const nextRef = useRef(1)

  const L = {
    fr: {
      displayModes: 'Affichage',
      light: 'Clair',
      dark: 'Sombre',
      contrast: 'Contraste',
      grid: 'Grille',
      dailySize: 'Grille du jour',
      nextNum: 'À trouver',
      history: 'Vos 5 derniers temps',
      historyEmpty: 'Aucun temps enregistré pour le moment.',
      yourTime: 'Votre temps',
      xpEarned: 'XP gagnés',
      wrongShake: 'Ce nombre n’est pas le suivant !',
    },
    en: {
      displayModes: 'Display',
      light: 'Light',
      dark: 'Dark',
      contrast: 'Contrast',
      grid: 'Grid',
      dailySize: 'Grid of the day',
      nextNum: 'Find',
      history: 'Your 5 latest times',
      historyEmpty: 'No time recorded yet.',
      yourTime: 'Your time',
      xpEarned: 'XP earned',
      wrongShake: 'That is not the next number!',
    },
  }[lang]

  /* Défi du jour : taille (5 ou 6) déterministe depuis la date. */
  const dailyConfig = useMemo(() => {
    const rand = mulberry32(seedFromString(`${gameId}:${todayKey()}`))
    return { size: rand() < 0.5 ? 5 : 6 }
  }, [])

  /* Historique des 5 derniers temps (chargé de façon asynchrone). */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      const s = loadSave<{ entries?: HistoryEntry[] }>(gameId)
      if (alive && s && Array.isArray(s.entries)) setHistory(s.entries.slice(-5))
    })
    return () => {
      alive = false
    }
  }, [])

  function start(n: number, daily = false) {
    const N = n * n
    let rand: () => number = Math.random
    if (daily) {
      const r = mulberry32(seedFromString(`${gameId}:${todayKey()}`))
      r() // consommation du tirage de la taille (5 ou 6)
      rand = r
    }
    setCells(shuffle(Array.from({ length: N }, (_, i) => i + 1), rand))
    setDailyMode(daily)
    setSize(n)
    setPhase('playing')
    nextRef.current = 1
    setNext(1)
    setElapsed(0)
    startRef.current = 0
    setWon(null)
    addPlay(gameId)
  }

  function finishWin() {
    const ms = Date.now() - startRef.current
    const n = Math.round(Math.sqrt(cells.length))
    const secs = Math.round(ms / 100) / 10
    const isRecord = setBest(gameId, `best-time-${n}`, secs, true)
    setPhase('won')
    setWon({ ms, isRecord, size: n })
    setConfettiKey((k) => k + 1)
    sfx.play('win')
    addWin(gameId)
    addXp(n * n)
    if (n === 7) unlockBadge('schulte-7')
    if (n === 5 && ms < 30000) unlockBadge('schulte-5-30')
    if (dailyMode) completeDaily(gameId)
    const entries = [...history, { size: n, ms }].slice(-5)
    setHistory(entries)
    saveSave(gameId, { entries })
  }

  function tap(v: number) {
    if (phase !== 'playing') return
    if (startRef.current === 0) startRef.current = Date.now()
    if (v === nextRef.current) {
      sfx.play('pop', { volume: 0.7 })
      setPopAt(v)
      window.setTimeout(() => setPopAt(null), 320)
      if (v === cells.length) {
        finishWin()
      } else {
        nextRef.current = v + 1
        setNext(v + 1)
      }
    } else {
      sfx.play('wrong', { volume: 0.3 })
      setWrongAt(v)
      window.setTimeout(() => setWrongAt(null), 450)
    }
  }

  /* Chronomètre : démarre au premier toucher, précis au dixième. */
  useEffect(() => {
    if (phase !== 'playing') return
    const id = window.setInterval(() => {
      if (startRef.current) setElapsed(Date.now() - startRef.current)
    }, 100)
    return () => window.clearInterval(id)
  }, [phase])

  const styles = DISPLAY_STYLES[display]
  const gridSize = phase === 'playing' || phase === 'won' ? Math.round(Math.sqrt(Math.max(1, cells.length))) : size

  return (
    <div className="relative select-none">
      <Confetti fire={confettiKey} count={reduce ? 0 : 90} />

      {/* Barre de configuration / statut */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {phase === 'idle' ? (
          <>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('common.size')}>
              {SIZES.map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={size === n && !dailyMode}
                  onClick={() => {
                    sfx.play('click', { volume: 0.5 })
                    setSize(n)
                    setDailyMode(false)
                  }}
                  className={cn(
                    'h-11 rounded-full border px-4 text-sm font-bold transition-all',
                    size === n && !dailyMode
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {n}×{n}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={L.displayModes}>
              {(
                [
                  ['light', Sun],
                  ['dark', Moon],
                  ['contrast', Contrast],
                ] as [DisplayMode, typeof Sun][]
              ).map(([m, Icon]) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={display === m}
                  title={m === 'light' ? L.light : m === 'dark' ? L.dark : L.contrast}
                  onClick={() => {
                    sfx.play('click', { volume: 0.5 })
                    setDisplay(m)
                  }}
                  className={cn(
                    'h-11 w-11 rounded-full border transition-all',
                    display === m
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  <Icon className="mx-auto h-4 w-4" aria-hidden="true" />
                </button>
              ))}
            </div>
            <Button size="lg" className="ms-auto h-11 rounded-full px-5 anim-glow" onClick={() => start(size)}>
              <Play className="h-4 w-4" aria-hidden="true" />
              {t('common.start')}
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <StatPill icon={<Timer className="h-4 w-4" aria-hidden="true" />} label={t('common.time')} value={fmtClock(elapsed)} />
              <StatPill icon={<ListOrdered className="h-4 w-4" aria-hidden="true" />} label={L.nextNum} value={`${next}/${cells.length}`} />
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
                start(dailyMode ? dailyConfig.size : gridSize)
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
            start(dailyConfig.size, true)
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
              {L.dailySize} {dailyConfig.size}×{dailyConfig.size}
            </span>
          </span>
          <span className="rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-white">{t('game.startDaily')}</span>
        </button>
      ) : null}

      {/* Plateau */}
      {phase === 'idle' ? (
        <div className="checkerboard flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border p-6 text-center">
          <div className="flex gap-2" aria-hidden="true">
            {['1', '2', '3'].map((e, i) => (
              <span key={i} className="text-3xl anim-floaty" style={{ animationDelay: `${i * 0.4}s` }}>
                {e}
              </span>
            ))}
          </div>
          <p className="max-w-md text-sm text-muted-foreground">{content.tagline[lang]}</p>
        </div>
      ) : (
        <div
          className={cn('mx-auto grid w-full max-w-[440px] gap-1.5 rounded-2xl border-2 p-2 transition-colors', styles.board)}
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
          role="grid"
          aria-label={`${L.grid} ${gridSize}×${gridSize}`}
        >
          {cells.map((v) => (
            <button
              key={v}
              type="button"
              role="gridcell"
              aria-label={String(v)}
              onClick={() => tap(v)}
              className={cn(
                'flex aspect-square items-center justify-center rounded-lg border font-display font-bold no-select transition-all focus-visible:outline-2 focus-visible:outline-ring',
                fontSizeClass(gridSize),
                display === 'contrast' && 'font-black',
                styles.cell,
                v < next && styles.found,
                popAt === v && 'anim-pop-in scale-105',
                wrongAt === v && 'anim-shake !border-red-500 !bg-red-500 !text-white',
              )}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {/* Résultat */}
      {phase === 'won' && won ? (
        <div
          className="anim-rise mt-5 rounded-2xl border-2 border-emerald-300/60 bg-emerald-50/60 p-5 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10"
          role="status"
        >
          <p className="font-display text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">🎉 {t('common.victory')}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
            <StatPill icon={<Timer className="h-4 w-4" aria-hidden="true" />} label={L.yourTime} value={fmtClock(won.ms)} />
            <StatPill icon={<Trophy className="h-4 w-4" aria-hidden="true" />} label={`${won.size}×${won.size}`} value={t('common.completed')} />
            <StatPill icon={<Zap className="h-4 w-4" aria-hidden="true" />} label={L.xpEarned} value={`+${won.size * won.size}`} />
            {won.isRecord ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Trophy className="h-4 w-4" aria-hidden="true" /> {t('common.newRecord')}
              </span>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <Button size="lg" className="rounded-full" onClick={() => start(won.size)}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> {t('common.playAgain')}
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full" onClick={() => setPhase('idle')}>
              {t('common.settings')}
            </Button>
          </div>
        </div>
      ) : null}

      {/* Historique */}
      {phase !== 'playing' && history.length > 0 ? (
        <div className="mt-5 rounded-2xl border bg-card/60 p-4">
          <p className="mb-2 flex items-center gap-2 font-display text-sm font-bold">
            <ListOrdered className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            {L.history}
          </p>
          <ul className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <li key={i} className="rounded-full bg-secondary/70 px-3 py-1.5 text-sm font-semibold tabular-nums">
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
    <span className="flex h-11 items-center gap-2 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
      <span className="text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
