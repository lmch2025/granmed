'use client'

import { useEffect, useRef, useState } from 'react'
import { Bomb, CalendarCheck, Flag, LayoutGrid, Lightbulb, Play, RotateCcw, Timer, Trophy, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { todayKey, mulberry32, seedFromString, formatMs, useReducedMotion } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'

export const gameId = 'minesweeper'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Le Démineur classique : trois niveaux, des drapeaux et un chrono — sans jamais toucher une mine.',
    en: 'The classic Minesweeper: three levels, flags and a timer — without ever touching a mine.',
  },
  description: {
    fr: [
      "Le Démineur Santé est un jeu de logique gratuit en ligne dans lequel vous devez révéler toutes les cases d’une grille sans jamais déclencher une mine. Chaque case découverte affiche le nombre de mines présentes dans ses huit cases voisines : à vous d’en déduire où se cachent les explosifs et de les marquer d’un drapeau.",
      "Trois difficultés sont au programme : Facile (9×9, 10 mines), Intermédiaire (16×16, 40 mines) et Expert (24×16, 99 mines). Les mines ne sont placées qu’après votre premier clic : la case choisie et son voisinage immédiat sont toujours sans danger, et les zones vides se découvrent automatiquement en cascade.",
      "Un défi du jour de taille Facile, identique pour tous les joueurs, est renouvelé chaque jour. Chronomètre avec pause automatique, chording (clic sur un chiffre complet pour ouvrir ses voisines), records de temps par difficulté et une petite astuce bien-être après chaque partie : le classique du raisonnement déductif, jouable partout sans installation.",
    ],
    en: [
      "Minesweeper Health is a free online logic game in which you must reveal every cell of a grid without ever triggering a mine. Each uncovered cell shows how many mines hide in its eight neighbouring cells: deduce where the explosives are and flag them.",
      "Three difficulties are on offer: Easy (9×9, 10 mines), Intermediate (16×16, 40 mines) and Expert (24×16, 99 mines). Mines are only placed after your first click — the chosen cell and its immediate neighbourhood are always safe — and empty areas reveal themselves automatically in a cascade.",
      "A daily challenge in Easy size, identical for every player, is refreshed each day. A timer with automatic pause, chording (click a satisfied number to open its neighbours), best times per difficulty and a small well-being tip after each game: the deductive-reasoning classic, playable anywhere with no download.",
    ],
  },
  rules: {
    fr: [
      'Révélez toutes les cases exemptes de mine pour gagner la partie.',
      'Chaque chiffre indique le nombre de mines dans les huit cases adjacentes.',
      'Marquez les mines d’un drapeau pour vous repérer ; le compteur affiche les mines restantes.',
      'Le premier clic est toujours sûr : les mines sont placées ensuite, hors de la zone cliquée.',
      'Une case vide découverte révèle automatiquement sa zone (propagation en cascade).',
      'Cliquez un chiffre dont tous les drapeaux sont posés : les voisines restantes s’ouvrent d’un coup.',
      'Le défi du jour (Facile) est généré à partir de la date : la grille est identique pour tous les joueurs.',
    ],
    en: [
      'Reveal every mine-free cell to win the game.',
      'Each number tells how many mines sit in the eight adjacent cells.',
      'Flag the mines to keep track; the counter shows the remaining mines.',
      'The first click is always safe: mines are placed afterwards, outside the clicked zone.',
      'Revealing an empty cell automatically opens its whole area (cascade).',
      'Click a number whose flags are all placed: the remaining neighbours open at once.',
      'The daily challenge (Easy) is generated from the date: the grid is identical for every player.',
    ],
  },
  controls: {
    fr: [
      'Clic gauche (ou toucher) : révéler une case.',
      'Clic droit, appui long (450 ms) ou bouton « Mode drapeau » : poser ou retirer un drapeau.',
      'Clic sur un chiffre entouré de ses drapeaux : révéler les voisines restantes (chording).',
      'Clavier : flèches pour déplacer le focus, Entrée pour révéler, F pour marquer, R pour recommencer.',
    ],
    en: [
      'Left click (or tap): reveal a cell.',
      'Right click, long press (450 ms) or the “Flag mode” button: place or remove a flag.',
      'Click a number surrounded by its flags: reveal the remaining neighbours (chording).',
      'Keyboard: arrow keys to move the focus, Enter to reveal, F to flag, R to restart.',
    ],
  },
  features: {
    fr: [
      'Trois difficultés : Facile 9×9, Intermédiaire 16×16, Expert 24×16 avec défilement horizontal contenu.',
      'Premier clic garanti sans mine et révélation en cascade des zones vides.',
      'Chording : un clic sur un chiffre complet révèle toutes ses voisines d’un coup.',
      'Drapeaux au clic droit, à l’appui long ou via le mode drapeau tactile bien visible.',
      'Chronomètre avec pause automatique quand vous quittez l’onglet.',
      'Défi du jour identique pour tous, records de temps par difficulté et succès à débloquer.',
      'Une astuce bien-être discrète et masquable après chaque partie.',
    ],
    en: [
      'Three difficulties: Easy 9×9, Intermediate 16×16, Expert 24×16 with contained horizontal scrolling.',
      'Guaranteed-safe first click and cascading reveal of empty areas.',
      'Chording: click a satisfied number to open all its neighbours at once.',
      'Flags via right click, long press or the clearly visible touch flag mode.',
      'Timer with automatic pause when you leave the tab.',
      'A daily challenge identical for everyone, best times per difficulty and achievements to unlock.',
      'A discreet, dismissible well-being tip after every game.',
    ],
  },
  tips: {
    fr: [
      'Ouvrez d’abord vers le centre : les grandes zones vides se dévoilent en cascade et offrent de l’information gratuite.',
      'Un chiffre égal au nombre de ses cases voisines non révélées : toutes ces cases sont des mines.',
      'Posez vos drapeaux puis cliquez les chiffres complétés : le chording ouvre les voisines restantes en un instant.',
      'Comparez le compteur de mines restantes au nombre de drapeaux posés pour valider vos déductions.',
      'Ne devinez qu’en dernier recours : dans la grille Expert, la logique suffit presque toujours.',
      'Les configurations 1-2-1 et 1-2-2-1 sont des motifs classiques : les mines s’y placent toujours de la même façon.',
    ],
    en: [
      'Open towards the centre first: large empty areas cascade open and hand you free information.',
      'A number equal to its count of unrevealed neighbours: every one of those cells is a mine.',
      'Place your flags, then click completed numbers: chording opens the remaining neighbours instantly.',
      'Compare the remaining-mine counter with your flag count to double-check your deductions.',
      'Guess only as a last resort: in the Expert grid, logic is almost always enough.',
      'The 1-2-1 and 1-2-2-1 patterns are classics: the mines always sit in the same spots.',
    ],
  },
  faq: {
    fr: [
      {
        q: 'La première case peut-elle contenir une mine ?',
        a: 'Non. Les mines ne sont placées qu’après votre premier clic, en excluant la case choisie et ses huit voisines. Vous pouvez commencer n’importe où sans risque.',
      },
      {
        q: 'Le défi du jour est-il identique pour tous les joueurs ?',
        a: 'Oui. La grille Facile du jour est générée à partir de la date avec la même graine : tout le monde joue la même partie, et le bouton Recommencer conserve cette même grille.',
      },
      {
        q: 'Comment marquer une mine sur mobile ?',
        a: 'Activez le bouton « Mode drapeau » au-dessus de la grille : chaque toucher pose alors un drapeau. L’appui long (450 ms) fonctionne aussi, ainsi que le clic droit à la souris.',
      },
      {
        q: 'À quoi correspondent les couleurs des chiffres ?',
        a: '1 est vert, 2 ambre, 3 orange, 4 rose, et 5 ou plus en rouge — pour lire les densités de mines d’un coup d’œil.',
      },
      {
        q: 'Mes records sont-ils sauvegardés ?',
        a: 'Oui, localement sur votre appareil, sans inscription : le meilleur temps est conservé séparément pour chaque difficulté.',
      },
    ],
    en: [
      {
        q: 'Can the first cell contain a mine?',
        a: 'No. Mines are only placed after your first click, excluding the chosen cell and its eight neighbours. You can start anywhere safely.',
      },
      {
        q: 'Is the daily challenge the same for every player?',
        a: 'Yes. The daily Easy grid is generated from the date with the same seed: everyone plays the same board, and the Restart button keeps that exact grid.',
      },
      {
        q: 'How do I flag a mine on mobile?',
        a: 'Turn on the “Flag mode” button above the grid: every tap then places a flag. A long press (450 ms) works too, as does right click with a mouse.',
      },
      {
        q: 'What do the number colours mean?',
        a: '1 is green, 2 amber, 3 orange, 4 rose, and 5 or more red — so you can read mine density at a glance.',
      },
      {
        q: 'Are my records saved?',
        a: 'Yes, locally on your device with no sign-up: your best time is kept separately for each difficulty.',
      },
    ],
  },
  records: {
    'best-time-easy': { fr: 'Meilleur temps — Facile', en: 'Best time — Easy' },
    'best-time-medium': { fr: 'Meilleur temps — Intermédiaire', en: 'Best time — Intermediate' },
    'best-time-expert': { fr: 'Meilleur temps — Expert', en: 'Best time — Expert' },
  },
}

/* ================= Types & constantes ================= */

type Diff = 'easy' | 'medium' | 'expert' | 'daily'

interface Cell {
  mine: boolean
  adj: number
  revealed: boolean
  flagged: boolean
}

const DIFFS: Record<Diff, { w: number; h: number; mines: number; xp: number; metric: string }> = {
  easy: { w: 9, h: 9, mines: 10, xp: 20, metric: 'best-time-easy' },
  medium: { w: 16, h: 16, mines: 40, xp: 40, metric: 'best-time-medium' },
  expert: { w: 24, h: 16, mines: 99, xp: 80, metric: 'best-time-expert' },
  daily: { w: 9, h: 9, mines: 10, xp: 20, metric: 'best-time-easy' },
}

const NUM_COLORS = [
  '',
  'text-emerald-600 dark:text-emerald-400',
  'text-amber-600 dark:text-amber-400',
  'text-orange-600 dark:text-orange-400',
  'text-rose-600 dark:text-rose-400',
  'text-red-600 dark:text-red-400',
  'text-red-700 dark:text-red-400',
  'text-red-700 dark:text-red-300',
  'text-red-800 dark:text-red-300',
]

/** Tailles de chiffres en unités de conteneur (cqw) : lisibles du mobile au desktop. */
const CELL_TEXT: Record<Diff, string> = {
  easy: 'text-[clamp(12px,5.6cqw,24px)]',
  medium: 'text-[clamp(9px,3.2cqw,18px)]',
  expert: 'text-[13px]',
  daily: 'text-[clamp(12px,5.6cqw,24px)]',
}
const CELL_EMOJI: Record<Diff, string> = {
  easy: 'text-[clamp(13px,6cqw,26px)]',
  medium: 'text-[clamp(10px,3.6cqw,20px)]',
  expert: 'text-[14px]',
  daily: 'text-[clamp(13px,6cqw,26px)]',
}

const HEALTH_TIPS: Array<{ fr: string; en: string }> = [
  {
    fr: 'Les recommandations de santé publique conseillent 7 à 9 heures de sommeil par nuit pour un adulte.',
    en: 'Public health guidelines recommend 7 to 9 hours of sleep per night for adults.',
  },
  {
    fr: 'Buvez de l’eau régulièrement tout au long de la journée, même sans sensation de soif.',
    en: 'Sip water regularly throughout the day, even before you feel thirsty.',
  },
  {
    fr: 'L’OMS recommande au moins 150 minutes d’activité physique modérée par semaine : 30 minutes de marche rapide par jour suffisent.',
    en: 'The WHO recommends at least 150 minutes of moderate physical activity per week: a brisk 30-minute daily walk is enough.',
  },
  {
    fr: 'Règle du 20-20-20 : toutes les 20 minutes, regardez à 6 mètres pendant 20 secondes pour reposer vos yeux.',
    en: 'The 20-20-20 rule: every 20 minutes, look some 20 feet (6 m) away for 20 seconds to rest your eyes.',
  },
  {
    fr: 'Cinq portions de fruits et légumes par jour : l’objectif repris par la plupart des recommandations nutritionnelles.',
    en: 'Five portions of fruit and vegetables a day: the target echoed by most nutritional guidelines.',
  },
  {
    fr: 'Quelques respirations lentes et profondes suffisent à faire baisser la fréquence cardiaque et le stress.',
    en: 'A few slow, deep breaths are enough to lower your heart rate and stress.',
  },
  {
    fr: 'Entretenir ses liens sociaux fait partie des facteurs de bien-être reconnus par la recherche en santé publique.',
    en: 'Nurturing social ties is a well-being factor recognised by public health research.',
  },
  {
    fr: 'Des micro-pauses de 5 minutes toutes les heures améliorent la concentration et limitent la fatigue visuelle.',
    en: 'Five-minute micro-breaks every hour improve focus and reduce eye strain.',
  },
  {
    fr: 'Levez-vous et étirez-vous : la position assise prolongée sollicite durablement le dos et la circulation.',
    en: 'Stand up and stretch: prolonged sitting puts lasting strain on your back and circulation.',
  },
  {
    fr: 'S’exposer à la lumière naturelle le matin aide à réguler l’horloge biologique et le sommeil.',
    en: 'Morning exposure to natural light helps regulate your body clock and your sleep.',
  },
]

const L_FR = {
  easy: 'Facile',
  medium: 'Intermédiaire',
  expert: 'Expert',
  dailyName: 'Défi du jour',
  dailyDesc: 'Grille Facile (9×9 · 10 mines) identique pour tous les joueurs, renouvelée chaque jour.',
  startDaily: 'Jouer le défi du jour',
  dailyDoneToday: 'Défi du jour réussi — revenez demain pour une nouvelle grille !',
  replayDaily: 'Rejouer',
  play: 'Jouer',
  best: 'Record',
  minesLeft: 'Mines restantes',
  timeLabel: 'Temps',
  paused: 'En pause',
  flagMode: 'Mode drapeau',
  restart: 'Recommencer',
  levels: 'Niveaux',
  winTitle: 'Grille dégagée !',
  winSub: 'Toutes les cases sûres sont révélées.',
  loseTitle: 'Boom !',
  loseSub: 'Une mine a explosé — le champ de mines est révélé.',
  newRecord: 'Nouveau record !',
  playAgain: 'Rejouer',
  tipTitle: 'Astuce bien-être',
  dismiss: 'Masquer cette astuce',
  boardLabel: 'Champ de mines',
  keyboardHint: 'Clavier : flèches pour naviguer, Entrée pour révéler, F pour marquer, R pour recommencer.',
  expertHint: 'Grille experte : faites glisser horizontalement pour voir toute la grille.',
  firstClickHint: 'Le premier clic est toujours sans danger — les mines sont placées après.',
  hiddenCell: 'case cachée',
  flaggedCell: 'case marquée d’un drapeau',
  mineCell: 'mine',
  emptyCell: 'case vide',
  adjCell: '{n} mines autour',
  shareWin: 'Plateau déminé en {t}',
  shareLose: 'Mine touchée après {t}',
}

const L_EN = {
  easy: 'Easy',
  medium: 'Intermediate',
  expert: 'Expert',
  dailyName: 'Daily challenge',
  dailyDesc: 'An Easy grid (9×9 · 10 mines) identical for every player, refreshed daily.',
  startDaily: "Play today's challenge",
  dailyDoneToday: 'Daily challenge complete — come back tomorrow for a new grid!',
  replayDaily: 'Replay',
  play: 'Play',
  best: 'Best',
  minesLeft: 'Mines left',
  timeLabel: 'Time',
  paused: 'Paused',
  flagMode: 'Flag mode',
  restart: 'Restart',
  levels: 'Levels',
  winTitle: 'Board cleared!',
  winSub: 'Every safe cell is revealed.',
  loseTitle: 'Boom!',
  loseSub: 'A mine exploded — the minefield is revealed.',
  newRecord: 'New personal best!',
  playAgain: 'Play again',
  tipTitle: 'Well-being tip',
  dismiss: 'Dismiss this tip',
  boardLabel: 'Minefield',
  keyboardHint: 'Keyboard: arrows to navigate, Enter to reveal, F to flag, R to restart.',
  expertHint: 'Expert grid: swipe horizontally to see the whole board.',
  firstClickHint: 'The first click is always safe — mines are placed afterwards.',
  hiddenCell: 'hidden cell',
  flaggedCell: 'flagged cell',
  mineCell: 'mine',
  emptyCell: 'empty cell',
  adjCell: '{n} mines around',
  shareWin: 'Board cleared in {t}',
  shareLose: 'Hit a mine after {t}',
}

/* ================= Moteur de jeu ================= */

function emptyBoard(n: number): Cell[] {
  return Array.from({ length: n }, () => ({ mine: false, adj: 0, revealed: false, flagged: false }))
}

function neighborsOf(idx: number, w: number, h: number): number[] {
  const x = idx % w
  const y = Math.floor(idx / w)
  const out: number[] = []
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) out.push(ny * w + nx)
    }
  }
  return out
}

/** Place les mines en excluant la case sûre et ses voisines, puis calcule les compteurs. */
function placeMines(cells: Cell[], w: number, h: number, mines: number, safeIdx: number, rand: () => number): void {
  const forbidden = new Set<number>([safeIdx, ...neighborsOf(safeIdx, w, h)])
  const candidates: number[] = []
  for (let i = 0; i < cells.length; i++) {
    if (!forbidden.has(i)) candidates.push(i)
  }
  const count = Math.min(mines, candidates.length)
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rand() * (candidates.length - i))
    const tmp = candidates[i]
    candidates[i] = candidates[j]
    candidates[j] = tmp
    cells[candidates[i]].mine = true
  }
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].mine) continue
    let n = 0
    for (const k of neighborsOf(i, w, h)) {
      if (cells[k].mine) n++
    }
    cells[i].adj = n
  }
}

/** Révélation en cascade (pile) ; retourne l’index de la mine touchée, ou -1 si rien n’explose. */
function floodReveal(cells: Cell[], w: number, h: number, start: number): number {
  if (cells[start].revealed || cells[start].flagged) return -1
  if (cells[start].mine) {
    cells[start].revealed = true
    return start
  }
  const stack = [start]
  while (stack.length > 0) {
    const i = stack.pop() as number
    if (cells[i].revealed || cells[i].flagged) continue
    cells[i].revealed = true
    if (cells[i].adj === 0) {
      for (const n of neighborsOf(i, w, h)) {
        if (!cells[n].revealed && !cells[n].mine) stack.push(n)
      }
    }
  }
  return -1
}

function countRevealed(cells: Cell[]): number {
  let n = 0
  for (const c of cells) if (c.revealed) n++
  return n
}

function inOverlay(e: Event): boolean {
  const t = e.target as Element | null
  return (
    !!t &&
    typeof t.closest === 'function' &&
    !!t.closest('[role="dialog"], [data-radix-popper-content-wrapper], [role="menu"]')
  )
}

/** Haptique légère (drapeau, mine) — ignorée sur les appareils sans vibrateur. */
function buzz() {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(10)
    } catch {}
  }
}

/** Durée compacte pour la ligne de résultat partageable (47 s / 2:14). */
function fmtShareDur(seconds: number): string {
  return seconds < 60 ? `${seconds} s` : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

interface Press {
  idx: number
  x: number
  y: number
  timer: number
  longFired: boolean
  cancelled: boolean
}

/* ================= Composant principal ================= */
export default function MinesweeperGame() {
  const lang = useLang()
  const reduce = useReducedMotion()
  const dailyDone = useIsDailyDone(gameId)
  /* Sélecteur à référence stable (undefined tant que le jeu n'a pas de stats) */
  const gameRec = useProfileStore((s) => s.profile.games[gameId])
  const records = gameRec?.records ?? {}
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)
  const L = lang === 'fr' ? L_FR : L_EN

  const [diff, setDiff] = useState<Diff>('easy')
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle')
  const [board, setBoard] = useState<Cell[]>([])
  const [flagMode, setFlagMode] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const [exploded, setExploded] = useState<number | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)
  const [winStars, setWinStars] = useState(3)
  const [newRecord, setNewRecord] = useState(false)
  const [finalTime, setFinalTime] = useState<number | null>(null)
  const [finalXp, setFinalXp] = useState<number | null>(null)
  const [tipIdx, setTipIdx] = useState(0)
  const [tipOpen, setTipOpen] = useState(false)

  /* Réfs miroirs (lus uniquement dans les handlers/callbacks, jamais pendant le rendu) */
  const boardRef = useRef<Cell[]>([])
  const phaseRef = useRef(phase)
  const diffRef = useRef(diff)
  useEffect(() => {
    boardRef.current = board
    phaseRef.current = phase
    diffRef.current = diff
  })

  const startRef = useRef(0)
  const pauseStartRef = useRef(0)
  const minesPlacedRef = useRef(false)
  const pressRef = useRef<Press | null>(null)
  const lastLongPressRef = useRef<{ idx: number; t: number } | null>(null)
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([])

  const cfg = DIFFS[diff]
  const isExpert = diff === 'expert'

  /* --- Chronomètre --- */
  useEffect(() => {
    if (phase !== 'playing' || paused) return
    const id = window.setInterval(() => {
      if (startRef.current > 0) setElapsed(Date.now() - startRef.current)
    }, 250)
    return () => window.clearInterval(id)
  }, [phase, paused])

  /* --- Pause quand l'onglet est masqué --- */
  useEffect(() => {
    function onVis() {
      if (phaseRef.current !== 'playing') return
      if (document.hidden) {
        if (startRef.current > 0 && !pauseStartRef.current) {
          pauseStartRef.current = Date.now()
          setPaused(true)
        }
      } else if (pauseStartRef.current) {
        startRef.current += Date.now() - pauseStartRef.current
        pauseStartRef.current = 0
        setPaused(false)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  /* --- Nettoyage de l'appui long au démontage --- */
  useEffect(() => {
    return () => {
      if (pressRef.current) window.clearTimeout(pressRef.current.timer)
    }
  }, [])

  /* ================= Actions ================= */

  function startGame(d: Diff) {
    const c = DIFFS[d]
    const cells = emptyBoard(c.w * c.h)
    minesPlacedRef.current = false
    startRef.current = 0
    pauseStartRef.current = 0
    cellRefs.current = []
    setDiff(d)
    setPhase('playing')
    setBoard(cells)
    setExploded(null)
    setElapsed(0)
    setPaused(false)
    setFinalTime(null)
    setFinalXp(null)
    setNewRecord(false)
    setTipOpen(false)
    addPlay(gameId)
    sfx.play('click')
    if (d === 'daily') {
      // Grille déterministe : même graine (date), même case de départ, mêmes mines pour tous.
      const rand = mulberry32(seedFromString(`${gameId}:${todayKey()}`))
      const safe = Math.floor(rand() * cells.length)
      placeMines(cells, c.w, c.h, c.mines, safe, rand)
      floodReveal(cells, c.w, c.h, safe)
      minesPlacedRef.current = true
      startRef.current = Date.now()
    }
  }

  function backToLevels() {
    sfx.play('click', { volume: 0.5 })
    setPhase('idle')
  }

  /** Révèle une case cachée — ou joue le chording si la case est déjà révélée et chiffrée. */
  function revealAt(idx: number) {
    if (phaseRef.current !== 'playing') return
    const cur = boardRef.current
    if (cur.length === 0) return
    if (cur[idx].revealed) {
      chordAt(idx)
      return
    }
    if (cur[idx].flagged) return
    const c = DIFFS[diffRef.current]
    const next = cur.map((x) => ({ ...x }))
    if (!minesPlacedRef.current) {
      placeMines(next, c.w, c.h, c.mines, idx, Math.random)
      minesPlacedRef.current = true
      startRef.current = Date.now()
    }
    const hit = floodReveal(next, c.w, c.h, idx)
    const opened = countRevealed(next) - countRevealed(cur)
    setBoard(next)
    if (hit >= 0) {
      finishLose(hit, next)
      return
    }
    if (opened > 0) sfx.play(opened >= 4 ? 'sweep' : 'pop')
    if (countRevealed(next) === next.length - c.mines) finishWin(next)
  }

  /** Chording : clic sur un chiffre dont les drapeaux voisins sont exactement posés. */
  function chordAt(idx: number) {
    if (phaseRef.current !== 'playing') return
    const cur = boardRef.current
    if (cur.length === 0) return
    const cell = cur[idx]
    if (!cell.revealed || cell.mine || cell.adj === 0) return
    const c = DIFFS[diffRef.current]
    const nbrs = neighborsOf(idx, c.w, c.h)
    let flagged = 0
    for (const n of nbrs) {
      if (cur[n].flagged) flagged++
    }
    if (flagged !== cell.adj) return
    const next = cur.map((x) => ({ ...x }))
    let hit = -1
    for (const n of nbrs) {
      if (!next[n].revealed && !next[n].flagged) {
        const r = floodReveal(next, c.w, c.h, n)
        if (r >= 0) hit = r
      }
    }
    const opened = countRevealed(next) - countRevealed(cur)
    setBoard(next)
    if (hit >= 0) {
      finishLose(hit, next)
      return
    }
    if (opened > 0) sfx.play(opened >= 4 ? 'sweep' : 'pop')
    if (countRevealed(next) === next.length - c.mines) finishWin(next)
  }

  function toggleFlagAt(idx: number) {
    if (phaseRef.current !== 'playing') return
    const cur = boardRef.current
    if (cur.length === 0 || cur[idx].revealed) return
    const next = cur.map((x) => ({ ...x }))
    next[idx].flagged = !next[idx].flagged
    setBoard(next)
    sfx.play(next[idx].flagged ? 'drop' : 'flip')
    buzz()
  }

  function finishWin(cells: Cell[]) {
    const d = diffRef.current
    const c = DIFFS[d]
    const ms = startRef.current > 0 ? Date.now() - startRef.current : 0
    const seconds = Math.max(1, Math.round(ms / 1000))
    // Drapeaux gaspillés avant l'auto-marquage des mines (3 étoiles si aucun).
    const wrongFlags = cells.reduce((n, cell) => n + (cell.flagged && !cell.mine ? 1 : 0), 0)
    const next = cells.map((x) => ({ ...x }))
    for (const cell of next) {
      if (cell.mine) cell.flagged = true
    }
    setBoard(next)
    setPhase('won')
    setFinalTime(seconds)
    setConfettiKey((k) => k + 1)
    setWinStars(wrongFlags === 0 ? 3 : 2)
    setBurstKey((k) => k + 1)
    sfx.play('win')
    setTipIdx((i) => (i + 1) % HEALTH_TIPS.length)
    setTipOpen(true)
    // Rejouer un défi déjà réussi ne recompte pas la récompense du jour.
    if (d === 'daily' && dailyDone) return
    addWin(gameId)
    addXp(c.xp)
    addGameXp(gameId, 25)
    setFinalXp(c.xp)
    const rec = setBest(gameId, c.metric, seconds, true)
    setNewRecord(rec)
    if (rec) setWinStars(3)
    if (d === 'medium') unlockBadge('mine-medium')
    if (d === 'expert') unlockBadge('mine-expert')
    if (d === 'daily') completeDaily(gameId)
  }

  function finishLose(explodedIdx: number, cells: Cell[]) {
    const ms = startRef.current > 0 ? Date.now() - startRef.current : 0
    const seconds = Math.max(1, Math.round(ms / 1000))
    const next = cells.map((x) => ({ ...x }))
    for (const cell of next) {
      if (cell.mine) cell.revealed = true
    }
    setBoard(next)
    setExploded(explodedIdx)
    setPhase('lost')
    setFinalTime(seconds)
    addGameXp(gameId, 10)
    sfx.play('lose')
    buzz()
    setTipIdx((i) => (i + 1) % HEALTH_TIPS.length)
    setTipOpen(true)
  }

  /* ================= Appuis (toucher / souris) ================= */

  function onCellPointerDown(e: React.PointerEvent<HTMLButtonElement>, idx: number) {
    if (e.button !== 0 || phaseRef.current !== 'playing') return
    const press: Press = { idx, x: e.clientX, y: e.clientY, timer: 0, longFired: false, cancelled: false }
    pressRef.current = press
    // À la souris : pas d'appui long (le clic droit marque), uniquement toucher/stylet.
    if (e.pointerType === 'mouse') return
    press.timer = window.setTimeout(() => {
      if (pressRef.current !== press || press.cancelled) return
      press.longFired = true
      lastLongPressRef.current = { idx, t: Date.now() }
      toggleFlagAt(idx)
    }, 450)
  }

  function onCellPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const p = pressRef.current
    if (!p || p.cancelled) return
    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > 12) cancelPress()
  }

  function cancelPress() {
    const p = pressRef.current
    if (!p) return
    p.cancelled = true
    window.clearTimeout(p.timer)
  }

  function onCellPointerUp(idx: number) {
    const p = pressRef.current
    if (!p || p.idx !== idx) return
    window.clearTimeout(p.timer)
    const wasLong = p.longFired
    const wasCancelled = p.cancelled
    pressRef.current = null
    if (wasCancelled || wasLong) return
    const cur = boardRef.current
    if (flagMode && cur.length > 0 && !cur[idx].revealed) toggleFlagAt(idx)
    else revealAt(idx)
  }

  /* ================= Clavier (grille) ================= */

  function onBoardKeyDown(e: React.KeyboardEvent) {
    if (phase !== 'playing') return
    const el = e.target as HTMLElement
    const idxStr = el.getAttribute('data-idx')
    if (idxStr === null) return
    const idx = Number.parseInt(idxStr, 10)
    const c = DIFFS[diff]
    let target = -1
    switch (e.key) {
      case 'ArrowRight':
        target = idx % c.w < c.w - 1 ? idx + 1 : idx
        break
      case 'ArrowLeft':
        target = idx % c.w > 0 ? idx - 1 : idx
        break
      case 'ArrowDown':
        target = idx + c.w < c.w * c.h ? idx + c.w : idx
        break
      case 'ArrowUp':
        target = idx - c.w >= 0 ? idx - c.w : idx
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        revealAt(idx)
        return
      case 'f':
      case 'F':
        toggleFlagAt(idx)
        return
      default:
        return
    }
    e.preventDefault()
    if (target >= 0 && target !== idx) cellRefs.current[target]?.focus()
  }

  function cellAria(cell: Cell): string {
    if (cell.flagged) return L.flaggedCell
    if (!cell.revealed) return L.hiddenCell
    if (cell.mine) return L.mineCell
    return cell.adj === 0 ? L.emptyCell : L.adjCell.replace('{n}', String(cell.adj))
  }

  /* --- R pour recommencer (listener rafraîchi à chaque rendu, jamais dans le corps d'effet) --- */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (inOverlay(e)) return
      if (e.key !== 'r' && e.key !== 'R') return
      if (phaseRef.current === 'idle') return
      e.preventDefault()
      startGame(diffRef.current)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  /* ================= Rendu ================= */
  const flags = board.reduce((n, c) => n + (c.flagged ? 1 : 0), 0)
  const minesLeft = cfg.mines - flags
  const popIn = reduce ? '' : 'anim-pop-in'

  /* Ligne de résultat partageable (victoire ET défaite) : durée réelle + difficulté. */
  const shareResult =
    finalTime !== null && (phase === 'won' || phase === 'lost')
      ? `${(phase === 'won' ? L.shareWin : L.shareLose).replace('{t}', fmtShareDur(finalTime))} — ${
          diff === 'daily' ? L.dailyName : L[diff]
        }`
      : undefined

  const cells = board.map((cell, idx) => {
    const wrongFlag = phase === 'lost' && cell.flagged && !cell.mine
    const isExploded = exploded === idx
    const revealedMine = phase === 'lost' && cell.mine
    return (
      <button
        key={idx}
        ref={(el) => {
          cellRefs.current[idx] = el
        }}
        type="button"
        role="gridcell"
        data-idx={idx}
        tabIndex={idx === 0 ? 0 : -1}
        aria-label={cellAria(cell)}
        onPointerDown={(e) => onCellPointerDown(e, idx)}
        onPointerMove={onCellPointerMove}
        onPointerUp={() => onCellPointerUp(idx)}
        onPointerCancel={cancelPress}
        onPointerLeave={cancelPress}
        onAuxClick={(e) => {
          // Clic molette = chording (desktop)
          if (e.button === 1) {
            e.preventDefault()
            chordAt(idx)
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          // Android émet aussi un contextmenu après l'appui long : ne pas double-marquer.
          const lp = lastLongPressRef.current
          if (lp && lp.idx === idx && Date.now() - lp.t < 700) return
          toggleFlagAt(idx)
        }}
        className={cn(
          'no-select flex select-none items-center justify-center border font-display font-extrabold leading-none transition-transform duration-75 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-ring active:scale-95',
          isExpert ? 'h-[30px] w-[30px] rounded-[4px]' : 'aspect-square w-full rounded-[5px]',
          cell.revealed
            ? isExploded
              ? 'anim-shake border-red-600 bg-red-500'
              : revealedMine
                ? 'border-red-300 bg-red-100 dark:border-red-500/40 dark:bg-red-500/20'
                : 'border-border/60 bg-secondary/40'
            : 'border-primary/30 bg-gradient-to-br from-primary to-orange-400/90 shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)] hover:brightness-105',
        )}
      >
        {cell.revealed ? (
          cell.mine ? (
            <span className={cn(CELL_EMOJI[diff], popIn)} aria-hidden="true">
              💣
            </span>
          ) : cell.adj > 0 ? (
            <span className={cn(CELL_TEXT[diff], NUM_COLORS[cell.adj], popIn)} aria-hidden="true">
              {cell.adj}
            </span>
          ) : null
        ) : cell.flagged ? (
          <span className={cn('relative', CELL_EMOJI[diff], popIn)} aria-hidden="true">
            🚩
            {wrongFlag ? (
              <span className="absolute inset-0 flex items-center justify-center text-[15px] font-black text-red-600">✕</span>
            ) : null}
          </span>
        ) : null}
      </button>
    )
  })

  return (
    <div className="relative select-none my-auto w-full">
      <Confetti fire={confettiKey} count={reduce ? 0 : 120} waves={2} gold />
      <VictoryBurst fire={burstKey} stars={winStars} />

      {phase === 'idle' ? (
        <>
          {/* Choix de difficulté — compact : tout tient à l'écran sans scroll */}
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'expert'] as const).map((d) => {
              const c = DIFFS[d]
              const rec = records[c.metric]
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => startGame(d)}
                  className="group flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-card/70 px-2 py-2.5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring sm:min-h-[96px] sm:gap-1.5 sm:px-4"
                >
                  <span className="flex items-center gap-1.5 font-display text-sm font-extrabold sm:text-lg">
                    {L[d]}
                    <Play className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary sm:h-4 sm:w-4" aria-hidden="true" />
                  </span>
                  <span className="text-[10px] text-muted-foreground sm:text-xs">
                    {c.w}×{c.h} · 💣 {c.mines}
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 sm:text-xs">
                    {rec ? `🏆 ${rec.value}s` : '—'}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Défi du jour */}
          {!dailyDone ? (
            <button
              type="button"
              onClick={() => startGame('daily')}
              className="mt-2 flex w-full items-center gap-2.5 rounded-2xl border border-amber-300/60 bg-amber-50 px-3 py-2.5 text-left transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-ring active:scale-[0.99] dark:border-amber-500/25 dark:bg-amber-500/10"
            >
              <span className="text-xl sm:text-2xl" aria-hidden="true">
                🎁
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-amber-700 sm:text-sm dark:text-amber-300">
                  💣 {L.dailyName} — {todayKey()}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground sm:text-xs">{L.dailyDesc}</span>
              </span>
              <span className="shrink-0 rounded-full bg-amber-500 px-3 py-1.5 text-[11px] font-bold text-white sm:px-4 sm:py-2 sm:text-xs">
                {L.startDaily}
              </span>
            </button>
          ) : (
            <div className="mt-2 flex items-center gap-2.5 rounded-2xl border border-emerald-300/50 bg-emerald-50/60 px-3 py-2.5 dark:border-emerald-500/25 dark:bg-emerald-500/10">
              <CalendarCheck className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <p className="min-w-0 flex-1 text-xs font-semibold leading-snug text-emerald-700 dark:text-emerald-300">{L.dailyDoneToday}</p>
              <button
                type="button"
                onClick={() => startGame('daily')}
                className="shrink-0 rounded-full border border-emerald-400/60 px-3 py-1.5 text-[11px] font-bold text-emerald-700 transition-colors hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-ring dark:border-emerald-500/40 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
              >
                <RotateCcw className="mr-1 inline h-3 w-3 align-[-1px]" aria-hidden="true" />
                {L.replayDaily}
              </button>
            </div>
          )}

          <p className="mt-2 text-center text-[11px] text-muted-foreground sm:mt-3 sm:text-xs">{L.firstClickHint}</p>
        </>
      ) : (
        <>
          {/* HUD compact — une seule ligne : mines, chrono, mode drapeau, recommencer, niveaux */}
          <div className="mb-2 flex items-center gap-1.5">
            <span
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-secondary/70 px-2.5 text-sm font-bold tabular-nums"
              title={L.minesLeft}
            >
              <Bomb className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span aria-live="polite" className={cn(minesLeft < 0 && 'text-rose-600 dark:text-rose-400')}>
                {minesLeft}
              </span>
            </span>
            <span
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-secondary/70 px-2.5 text-sm font-bold tabular-nums"
              title={L.timeLabel}
            >
              <Timer className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span>{paused ? `⏸ ${L.paused}` : formatMs(elapsed)}</span>
            </span>
            {diff === 'daily' ? (
              <span
                className="hidden h-10 shrink-0 items-center gap-1.5 rounded-xl bg-amber-100 px-2.5 text-xs font-bold text-amber-700 sm:flex dark:bg-amber-500/20 dark:text-amber-300"
                title={L.dailyName}
              >
                <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {L.dailyName}
              </span>
            ) : null}

            <Button
              variant="secondary"
              className={cn(
                'h-10 min-w-0 flex-1 rounded-xl px-2 text-xs font-bold sm:text-sm',
                flagMode &&
                  'border border-amber-400/70 bg-amber-100 text-amber-700 hover:bg-amber-100/80 dark:bg-amber-500/20 dark:text-amber-300',
              )}
              aria-pressed={flagMode}
              onClick={() => {
                sfx.play('click', { volume: 0.5 })
                setFlagMode((v) => !v)
              }}
            >
              <Flag className={cn('h-4 w-4 shrink-0', flagMode ? 'text-amber-500' : 'text-muted-foreground')} aria-hidden="true" />
              <span className="truncate">{L.flagMode}</span>
            </Button>
            <Button
              variant="secondary"
              className="h-10 w-10 shrink-0 rounded-xl p-0"
              aria-label={L.restart}
              title={L.restart}
              onClick={() => startGame(diff)}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              className="h-10 w-10 shrink-0 rounded-xl p-0 sm:w-auto sm:gap-1.5 sm:px-3"
              aria-label={L.levels}
              title={L.levels}
              onClick={backToLevels}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{L.levels}</span>
            </Button>
          </div>

          {/* Plateau — tient dans calc(100dvh - 250px), aucune coupure ni scroll page */}
          {isExpert ? (
            <div className="nice-scroll overscroll-x-contain overflow-x-auto pb-1">
              <div
                role="grid"
                aria-label={L.boardLabel}
                onKeyDown={onBoardKeyDown}
                onContextMenu={(e) => e.preventDefault()}
                className={cn(
                  'grid w-fit touch-manipulation select-none gap-[2px]',
                  phase === 'won' && 'anim-glow rounded-xl',
                )}
                style={{ gridTemplateColumns: `repeat(${cfg.w}, 30px)` }}
              >
                {cells}
              </div>
            </div>
          ) : (
            <div
              role="grid"
              aria-label={L.boardLabel}
              onKeyDown={onBoardKeyDown}
              onContextMenu={(e) => e.preventDefault()}
              className={cn(
                '@container grid -mx-2 w-[calc(100%+1rem)] max-w-[calc(100dvh-250px)] touch-manipulation select-none gap-[2px] sm:mx-auto sm:w-full',
                phase === 'won' && 'anim-glow rounded-xl',
              )}
              style={{ gridTemplateColumns: `repeat(${cfg.w}, minmax(0,1fr))` }}
            >
              {cells}
            </div>
          )}

          {isExpert ? (
            <p className="mt-2 text-center text-[11px] text-muted-foreground">{L.expertHint}</p>
          ) : (
            <p className="mt-2 hidden text-center text-xs text-muted-foreground sm:block">{L.keyboardHint}</p>
          )}

          {/* Bannière de fin */}
          {phase === 'won' || phase === 'lost' ? (
            <div
              role="status"
              className={cn(
                'anim-rise mt-3 rounded-2xl border-2 p-4 text-center',
                phase === 'won'
                  ? 'border-emerald-300/60 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                  : 'border-rose-300/60 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/10',
              )}
            >
              <p
                className={cn(
                  'font-display text-xl font-extrabold sm:text-2xl',
                  phase === 'won' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300',
                )}
              >
                {phase === 'won' ? `🎉 ${L.winTitle}` : `💥 ${L.loseTitle}`}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {phase === 'won'
                  ? `${L.winSub} ${finalTime !== null ? `— ${L.timeLabel} : ${finalTime}s` : ''}`
                  : L.loseSub}
              </p>
              {phase === 'won' && (newRecord || finalXp !== null) ? (
                <p className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                  {finalXp !== null ? (
                    <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                      +{finalXp} XP
                    </span>
                  ) : null}
                  {newRecord ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                      <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> {L.newRecord}
                    </span>
                  ) : null}
                </p>
              ) : null}
              <div className="mt-3">
                <RoundEndActions
                  gameId={gameId}
                  onReplay={() => startGame(diff)}
                  replayLabel={L.playAgain}
                  shareResult={shareResult}
                />
                <div className="mt-2 flex justify-center">
                  <Button variant="secondary" className="h-10 rounded-full" onClick={backToLevels}>
                    <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                    {L.levels}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Astuce bien-être (masquable, jamais pendant la partie) */}
          {tipOpen && (phase === 'won' || phase === 'lost') ? (
            <div className="mt-2.5 flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-3.5 py-2.5 dark:border-amber-500/25 dark:bg-amber-500/10">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 sm:h-5 sm:w-5" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  {L.tipTitle}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-amber-900 sm:text-sm dark:text-amber-200">
                  {HEALTH_TIPS[tipIdx][lang]}
                </p>
              </div>
              <button
                type="button"
                aria-label={L.dismiss}
                onClick={() => {
                  sfx.play('click', { volume: 0.4 })
                  setTipOpen(false)
                }}
                className="-m-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-amber-700 transition-colors hover:bg-amber-200/60 focus-visible:outline-2 focus-visible:outline-ring dark:text-amber-300 dark:hover:bg-amber-500/20"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
