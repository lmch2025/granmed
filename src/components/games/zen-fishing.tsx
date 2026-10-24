'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Play, BookOpen, CalendarCheck, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { loadSave, saveSave } from '@/lib/save'
import { useHydrated, useReducedMotion, clamp, todayKey, mulberry32, seedFromString } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { VictoryBurst } from '@/components/game/round-end'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export const gameId = 'zen-fishing'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Une pêche détendante à une main : descendez l’hameçon, remontez au bon moment et complétez votre collection de 12 espèces.',
    en: 'Relaxed one-hand fishing: drop your hook, reel up at the right moment and complete your 12-species collection.',
  },
  description: {
    fr: [
      'Pêche Miraculeuse (Zen Fishing) est un jeu de détente gratuit dans lequel vous descendez un hameçon dans une mer apaisante, puis le remontez pour attraper les poissons croisés sur le chemin. Une seule commande : maintenez pour descendre, relâchez pour remonter.',
      'À la descente, les poissons vous ignorent : c’est à la remontée que tout se joue. Sardines et dauphins peuplent les eaux peu profondes, poissons-clowns et tortues la mi-profondeur, tandis que requins et le légendaire poisson doré se cachent dans les grandes profondeurs. Chaque nouvelle espèce rejoint votre carnet de collection.',
      'Le carnet compte 12 espèces à découvrir, des communes aux légendaires, sauvegardé sur votre appareil. Trois défis tournent chaque jour (5 poissons en une descente, un poisson des profondeurs, 10 poissons dans la journée) : le défi du jour rapporte un bonus d’XP et alimente votre série.',
    ],
    en: [
      'Miraculous Fishing (Zen Fishing) is a free relaxation game in which you lower a hook into a calm sea, then reel it back up to catch the fish crossed on the way. One single control: hold to descend, release to reel in.',
      'On the way down, fish ignore you: everything happens on the way up. Sardines and dolphins fill the shallow waters, clownfish and turtles the mid depths, while sharks and the legendary golden fish hide in the deep. Every new species joins your collection book.',
      'The book holds 12 species to discover, from common to legendary, saved on your device. Three challenges rotate daily (5 fish in one descent, a deep-water fish, 10 fish in the day): the daily challenge earns bonus XP and feeds your streak.',
    ],
  },
  rules: {
    fr: [
      'Maintenez l’écran (ou la barre d’espace) pour descendre l’hameçon.',
      'Relâchez pour remonter : la remontée s’arrête à la surface.',
      'À la descente, les poissons traversent l’hameçon sans être pris.',
      'À la remontée, chaque poisson touché par l’hameçon est accroché et remonte avec lui.',
      'De retour en surface, la prise est comptée et les nouvelles espèces rejoignent le carnet.',
      'Relâchez au bon moment : plus vous descendez profond, plus vous remontez à travers de bancs de poissons.',
    ],
    en: [
      'Hold the screen (or the space bar) to lower the hook.',
      'Release to reel it back up: the ascent stops at the surface.',
      'On the way down, fish pass through the hook without being caught.',
      'On the way up, every fish the hook touches gets hooked and rises with it.',
      'Back at the surface, the catch is counted and new species join the book.',
      'Release at the right moment: the deeper you go, the more schools you reel through.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : maintenez n’importe où sur le jeu pour descendre, relâchez pour remonter.',
      'Ordinateur : maintenez le bouton de la souris ou la barre d’espace.',
      'Ouvrez le carnet de collection avec le bouton « Collection ».',
    ],
    en: [
      'Mobile & tablet: press and hold anywhere on the game to descend, release to reel up.',
      'Desktop: hold the mouse button or the space bar.',
      'Open the collection book with the “Collection” button.',
    ],
  },
  features: {
    fr: [
      'Commande à un doigt, idéale pour une pause zen',
      '12 espèces à collectionner, des communes au poisson doré légendaire',
      '3 zones de profondeur avec faune spécifique',
      'Carnet de collection sauvegardé sur votre appareil',
      'Défis quotidiens rotatifs et série de jours',
      'Ambiance apaisante : rayons de lumière, bulles, algues',
    ],
    en: [
      'One-finger control, perfect for a zen break',
      '12 species to collect, from common to the legendary golden fish',
      '3 depth zones with their own wildlife',
      'Collection book saved on your device',
      'Rotating daily challenges and day streak',
      'Soothing atmosphere: light rays, bubbles, seaweed',
    ],
  },
  tips: {
    fr: [
      'Les espèces rares et légendaires vivent en profondeur : prenez le temps de descendre au fond avant de remonter.',
      'Repérez les bancs pendant la descente : c’est à la remontée qu’on pêche, donc mémorisez les passages denses.',
      'Une remontée lente et régulière traverse plus de bancs qu’une remontée précipitée.',
      'Le carnet indique la zone de chaque espèce manquante : ciblez la profondeur qui vous manque.',
    ],
    en: [
      'Rare and legendary species live deep: take the time to reach the bottom before reeling up.',
      'Scout the schools during the descent: you catch on the way up, so memorize the dense passages.',
      'A slow, steady ascent crosses more schools than a rushed one.',
      'The book shows the zone of every missing species: target the depth you still lack.',
    ],
  },
  faq: {
    fr: [
      { q: 'Pourquoi ne prend-on les poissons qu’à la remontée ?', a: 'C’est le cœur du jeu : la descente sert à choisir votre profondeur, la remontée à pêcher. Cela rend chaque lâcher de doigt décisif, sans jamais être punitif.' },
      { q: 'Combien d’espèces peut-on attraper ?', a: '12 espèces réparties en trois zones de profondeur : 3 communes près de la surface, 4 à mi-profondeur (dont le rare homard) et 5 dans les grandes profondeurs (dont le requin et le légendaire poisson doré).' },
      { q: 'Ma collection est-elle sauvegardée ?', a: 'Oui : le carnet est enregistré automatiquement sur votre appareil, ainsi que vos records d’espèces et de plus grosse prise. Vous pouvez y rejouer quand vous voulez.' },
      { q: 'Les défis du jour changent-ils ?', a: 'Oui : chaque jour, l’objectif actif est choisi de façon déterministe parmi trois défis (5 poissons en une descente, un poisson des profondeurs, 10 poissons dans la journée). Il est identique pour tous les joueurs.' },
      { q: 'Y a-t-il une fin ou un game over ?', a: 'Non : la pêche est infinie et sans échec. C’est un jeu de détente — les seuls objectifs sont votre collection et vos records personnels.' },
    ],
    en: [
      { q: 'Why are fish only caught on the way up?', a: 'That is the heart of the game: the descent picks your depth, the ascent does the fishing. Every finger release becomes decisive, without ever being punishing.' },
      { q: 'How many species can I catch?', a: '12 species across three depth zones: 3 common ones near the surface, 4 at mid depth (including the rare lobster) and 5 in the deep (including the shark and the legendary golden fish).' },
      { q: 'Is my collection saved?', a: 'Yes: the book is saved automatically on your device, along with your species record and biggest catch. You can come back to it any time.' },
      { q: 'Do the daily challenges change?', a: 'Yes: every day the active goal is picked deterministically among three challenges (5 fish in one descent, a deep-water fish, 10 fish in the day). It is identical for every player.' },
      { q: 'Is there an end or a game over?', a: 'No: the fishing is endless and fail-free. It is a relaxation game — the only goals are your collection and your personal records.' },
    ],
  },
  records: {
    'species': { fr: 'Espèces découvertes', en: 'Species discovered' },
    'best-catch': { fr: 'Plus grosse prise (une descente)', en: 'Biggest catch (one descent)' },
  },
}

/* ================= Espèces ================= */
type Rarity = 'common' | 'rare' | 'legendary'
interface FishSpec {
  id: string
  emoji: string
  name: Record<'fr' | 'en', string>
  band: 0 | 1 | 2
  rarity: Rarity
  size: number
  speed: number
}

const SPECIES: FishSpec[] = [
  { id: 'sardine', emoji: '🐟', name: { fr: 'Sardine', en: 'Sardine' }, band: 0, rarity: 'common', size: 26, speed: 46 },
  { id: 'crab', emoji: '🦀', name: { fr: 'Crabe', en: 'Crab' }, band: 0, rarity: 'common', size: 26, speed: 28 },
  { id: 'dolphin', emoji: '🐬', name: { fr: 'Dauphin', en: 'Dolphin' }, band: 0, rarity: 'common', size: 36, speed: 68 },
  { id: 'clownfish', emoji: '🐠', name: { fr: 'Poisson-clown', en: 'Clownfish' }, band: 1, rarity: 'common', size: 26, speed: 40 },
  { id: 'shrimp', emoji: '🦐', name: { fr: 'Crevette', en: 'Shrimp' }, band: 1, rarity: 'common', size: 22, speed: 34 },
  { id: 'turtle', emoji: '🐢', name: { fr: 'Tortue de mer', en: 'Sea turtle' }, band: 1, rarity: 'common', size: 30, speed: 22 },
  { id: 'lobster', emoji: '🦞', name: { fr: 'Homard', en: 'Lobster' }, band: 1, rarity: 'rare', size: 28, speed: 30 },
  { id: 'octopus', emoji: '🐙', name: { fr: 'Poulpe', en: 'Octopus' }, band: 2, rarity: 'common', size: 32, speed: 26 },
  { id: 'angler', emoji: '🐡', name: { fr: 'Poisson-lanterne', en: 'Anglerfish' }, band: 2, rarity: 'common', size: 26, speed: 20 },
  { id: 'squid', emoji: '🦑', name: { fr: 'Calmar', en: 'Squid' }, band: 2, rarity: 'common', size: 30, speed: 32 },
  { id: 'shark', emoji: '🦈', name: { fr: 'Requin', en: 'Shark' }, band: 2, rarity: 'rare', size: 42, speed: 44 },
  { id: 'golden', emoji: '🐟', name: { fr: 'Poisson doré', en: 'Golden fish' }, band: 2, rarity: 'legendary', size: 30, speed: 26 },
]

const RARITY_XP: Record<Rarity, number> = { common: 3, rare: 10, legendary: 25 }

/* ================= Textes UI ================= */
const L = {
  fr: {
    play: 'Pêcher', collection: 'Collection', species: 'Espèces', onHook: 'Prise de la descente',
    today: 'Aujourd’hui', depth: 'Profondeur', meters: 'm', title: 'Pêche Miraculeuse',
    hint: 'Maintenez pour descendre, relâchez pour remonter : on pêche à la remontée.',
    goalTitle: 'Défis du jour', goalDone: 'Défi du jour réussi !', newRecord: 'Nouveau record !', newSpecies: 'Nouvelle espèce !',
    exit: 'Quitter la partie',
    ariaCanvas: 'Aquarium de la pêche zen : maintenez pour descendre l’hameçon, relâchez pour remonter.',
    rarity: { common: 'Commune', rare: 'Rare', legendary: 'Légendaire' } as Record<Rarity, string>,
    bands: ['Eau peu profonde', 'Mi-profondeur', 'Grandes profondeurs'],
    goals: ['Attraper 5 poissons en une descente', 'Attraper un poisson des profondeurs', 'Attraper 10 poissons aujourd’hui'],
    best: 'Record', speciesBest: 'Espèces', catchBest: 'Plus grosse prise',
    unknown: 'Pas encore découvert',
  },
  en: {
    play: 'Fish', collection: 'Collection', species: 'Species', onHook: 'Current descent catch',
    today: 'Today', depth: 'Depth', meters: 'm', title: 'Miraculous Fishing',
    hint: 'Hold to descend, release to reel up: you catch on the way up.',
    goalTitle: 'Today’s challenges', goalDone: 'Daily challenge complete!', newRecord: 'New record!', newSpecies: 'New species!',
    exit: 'Quit the game',
    ariaCanvas: 'Zen fishing aquarium: hold to lower the hook, release to reel up.',
    rarity: { common: 'Common', rare: 'Rare', legendary: 'Legendary' } as Record<Rarity, string>,
    bands: ['Shallow water', 'Mid depth', 'Deep waters'],
    goals: ['Catch 5 fish in one descent', 'Catch a deep-water fish', 'Catch 10 fish today'],
    best: 'Best', speciesBest: 'Species', catchBest: 'Biggest catch',
    unknown: 'Not discovered yet',
  },
} as const

/* ================= Sauvegarde ================= */
interface FishSave {
  caught: string[]
  day: string
  dayCount: number
  bestCastToday: number
  deepToday: boolean
}

/* ================= Monde ================= */
interface Fish {
  sp: number
  x: number
  yFrac: number
  dir: 1 | -1
  speed: number
  bobA: number
  bobF: number
  phase: number
  hooked: boolean
  slot: number
}
interface Bubble { x: number; y: number; r: number; vy: number; phase: number }
interface Flyer { sp: number; x0: number; y0: number; t: number; delay: number }

interface World {
  W: number; H: number; t: number; scale: number
  fishes: Fish[]
  bubbles: Bubble[]
  flyers: Flyer[]
  hookY: number
  hookState: 'top' | 'down' | 'up'
  holding: boolean
  castCount: number
  bubbleT: number
  rippleT: number
  rippleY: number
  bedTouched: boolean
}

function pickSpeciesIndex(band: number): number {
  const pool: { idx: number; w: number }[] = []
  SPECIES.forEach((s, i) => {
    if (s.band !== band) return
    pool.push({ idx: i, w: s.rarity === 'common' ? 1 : s.rarity === 'rare' ? 0.24 : 0.06 })
  })
  const total = pool.reduce((a, o) => a + o.w, 0)
  let r = Math.random() * total
  for (const o of pool) {
    r -= o.w
    if (r <= 0) return o.idx
  }
  return pool[pool.length - 1].idx
}

function spawnFish(band: number, fromEdge: boolean, W: number): Fish {
  const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1
  const spIdx = pickSpeciesIndex(band)
  return {
    sp: spIdx,
    x: fromEdge ? (dir === 1 ? -50 : W + 50) : Math.random() * W,
    yFrac: 0.08 + Math.random() * 0.84,
    dir,
    speed: SPECIES[spIdx].speed * (0.85 + Math.random() * 0.3),
    bobA: 5 + Math.random() * 9,
    bobF: 0.5 + Math.random() * 0.8,
    phase: Math.random() * Math.PI * 2,
    hooked: false,
    slot: 0,
  }
}

function makeWorld(): World {
  const w: World = {
    W: 320, H: 240, t: 0, scale: 1,
    fishes: [], bubbles: [], flyers: [],
    hookY: 0, hookState: 'top', holding: false,
    castCount: 0, bubbleT: 0, rippleT: 0, rippleY: 0, bedTouched: false,
  }
  for (let b = 0; b < 3; b++) {
    for (let i = 0; i < 4; i++) w.fishes.push(spawnFish(b, false, w.W))
  }
  return w
}

/* ================= Helpers dessin ================= */
function emojiFont(size: number) {
  return `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",system-ui,sans-serif`
}

function drawWater(ctx: CanvasRenderingContext2D, W: number, H: number, surfaceY: number) {
  // Ciel doux au-dessus de l'eau
  const sky = ctx.createLinearGradient(0, 0, 0, surfaceY)
  sky.addColorStop(0, '#ffedd2')
  sky.addColorStop(1, '#f9dcb0')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, W, surfaceY)
  // Eau vert-teal (vert dominant, jamais bleu)
  const water = ctx.createLinearGradient(0, surfaceY, 0, H)
  water.addColorStop(0, '#9fdcc0')
  water.addColorStop(0.3, '#52ab86')
  water.addColorStop(0.65, '#2a7c60')
  water.addColorStop(1, '#175243')
  ctx.fillStyle = water
  ctx.fillRect(0, surfaceY, W, H - surfaceY)
  // Assombrissement des profondeurs sur les bords
  const vg = ctx.createLinearGradient(0, surfaceY, 0, H)
  vg.addColorStop(0, 'rgba(10,48,36,0)')
  vg.addColorStop(1, 'rgba(8,40,30,0.45)')
  ctx.fillStyle = vg
  ctx.fillRect(0, surfaceY, W, H - surfaceY)
  // Fond marin sableux
  ctx.fillStyle = '#c9a36a'
  ctx.beginPath()
  ctx.moveTo(0, H)
  ctx.lineTo(0, H - 16)
  ctx.quadraticCurveTo(W * 0.25, H - 30, W * 0.5, H - 16)
  ctx.quadraticCurveTo(W * 0.75, H - 4, W, H - 20)
  ctx.lineTo(W, H)
  ctx.closePath()
  ctx.fill()
}

function drawBoat(ctx: CanvasRenderingContext2D, W: number, surfaceY: number, t: number, reduce: boolean) {
  const bob = reduce ? 0 : Math.sin(t * 0.9) * 3
  const by = surfaceY - 9 + bob
  const cx = W / 2
  // Coque
  const g = ctx.createLinearGradient(0, by, 0, by + 20)
  g.addColorStop(0, '#b97a45')
  g.addColorStop(1, '#8a5a30')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(cx - 58, by)
  ctx.lineTo(cx + 58, by)
  ctx.quadraticCurveTo(cx + 52, by + 20, cx + 34, by + 20)
  ctx.lineTo(cx - 34, by + 20)
  ctx.quadraticCurveTo(cx - 52, by + 20, cx - 58, by)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgba(255,240,214,0.4)'
  ctx.fillRect(cx - 56, by + 1.5, 112, 2)
  ctx.strokeStyle = 'rgba(90,58,30,0.4)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - 44, by + 9)
  ctx.lineTo(cx + 44, by + 9)
  ctx.stroke()
  // Canne
  ctx.strokeStyle = '#6b4a2f'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(cx + 16, by + 2)
  ctx.quadraticCurveTo(cx + 14, by - 18, cx, by - 26)
  ctx.stroke()
  // Pêcheur (petit chapeau)
  ctx.fillStyle = '#f2a65a'
  ctx.beginPath()
  ctx.arc(cx - 10, by - 6, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#d9553f'
  ctx.beginPath()
  ctx.arc(cx - 10, by - 8, 6, Math.PI, 0)
  ctx.fill()
}

/* ================= Utilitaires locaux ================= */
type Banner = { kind: 'daily' } | { kind: 'record'; value: number }

/** Haptique légère, sans échec sur les navigateurs non compatibles. */
function buzz(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* non supporté */
  }
}

/** Pastille compacte du HUD (une seule ligne sur mobile). */
function Pill({ icon, label, children }: { icon: string; label: string; children: ReactNode }) {
  return (
    <span
      title={label}
      className="flex h-9 min-w-0 shrink-0 items-center gap-1.5 rounded-full bg-secondary/70 px-2.5 text-xs font-bold tabular-nums"
    >
      <span aria-hidden="true">{icon}</span>
      <span className="truncate">{children}</span>
      <span className="sr-only">{label}</span>
    </span>
  )
}

/* ================= Composant ================= */
export default function ZenFishingGame() {
  const lang = useLang()
  const reduce = useReducedMotion()
  const hydrated = useHydrated()
  const dailyDone = useIsDailyDone(gameId)
  const T = L[lang]

  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)
  const bestSpecies = useProfileStore((s) => s.profile.games[gameId]?.records?.['species']?.value ?? 0)
  const bestCatch = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-catch']?.value ?? 0)

  const [phase, setPhase] = useState<'idle' | 'playing'>('idle')
  const [hud, setHud] = useState({ cast: 0, today: 0, depth: 0 })
  const [caught, setCaught] = useState<Set<string>>(new Set())
  const [dayStats, setDayStats] = useState({ dayCount: 0, bestCast: 0, deep: false })
  const [discovery, setDiscovery] = useState<FishSpec | null>(null)
  const [bookOpen, setBookOpen] = useState(false)
  const [confetti, setConfetti] = useState(0)
  const [banner, setBanner] = useState<Banner | null>(null)
  /* Célébration de victoire (défi du jour / nouvelle espèce) — médaille + étoiles. */
  const [burst, setBurst] = useState<{ emoji: string; stars: number; title?: string } | null>(null)
  const [burstKey, setBurstKey] = useState(0)

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worldRef = useRef<World>(makeWorld())
  const phaseRef = useRef(phase)
  const reduceRef = useRef(reduce)
  const dailyDoneRef = useRef(dailyDone)
  const langRef = useRef(lang)
  const rafRef = useRef(0)
  const pausedRef = useRef(false)
  const caughtRef = useRef<Set<string>>(new Set())
  const dayRef = useRef<FishSave>({ caught: [], day: todayKey(), dayCount: 0, bestCastToday: 0, deepToday: false })
  const discoveryQueueRef = useRef<FishSpec[]>([])
  const lastStartRef = useRef(0)
  const bannerTimerRef = useRef(0)
  const timersRef = useRef<Set<number>>(new Set())

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { reduceRef.current = reduce }, [reduce])
  useEffect(() => { dailyDoneRef.current = dailyDone }, [dailyDone])
  useEffect(() => { langRef.current = lang }, [lang])

  /* Minuteurs suivis — tous purgés au démontage */
  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current.delete(id)
      fn()
    }, ms)
    timersRef.current.add(id)
    return id
  }, [])
  const clearLater = useCallback((id: number) => {
    window.clearTimeout(id)
    timersRef.current.delete(id)
  }, [])
  useEffect(() => {
    const ids = timersRef.current
    return () => {
      for (const id of ids) window.clearTimeout(id)
    }
  }, [])

  /* Défi du jour déterministe : 0, 1 ou 2 selon la date */
  const dailyGoal = useMemo(
    () => Math.floor(mulberry32(seedFromString(`zen-fishing:${todayKey()}`))() * 3),
    [],
  )

  /* Chargement de la sauvegarde (setState via timer → conforme) */
  useEffect(() => {
    const id = window.setTimeout(() => {
      const saved = loadSave<FishSave>(gameId)
      const today = todayKey()
      const base: FishSave = saved ?? { caught: [], day: today, dayCount: 0, bestCastToday: 0, deepToday: false }
      if (base.day !== today) {
        base.day = today
        base.dayCount = 0
        base.bestCastToday = 0
        base.deepToday = false
      }
      const set = new Set(base.caught)
      caughtRef.current = set
      dayRef.current = { ...base, caught: [...set] }
      setCaught(set)
      setDayStats({ dayCount: base.dayCount, bestCast: base.bestCastToday, deep: base.deepToday })
      setHud((h) => ({ ...h, today: base.dayCount }))
    }, 0)
    return () => window.clearTimeout(id)
  }, [])

  const persist = useCallback(() => {
    saveSave<FishSave>(gameId, {
      caught: [...caughtRef.current],
      day: dayRef.current.day,
      dayCount: dayRef.current.dayCount,
      bestCastToday: dayRef.current.bestCastToday,
      deepToday: dayRef.current.deepToday,
    })
  }, [])

  const pushHud = useCallback(() => {
    const w = worldRef.current
    const span = Math.max(1, w.H * 0.95 - w.H * 0.14)
    setHud((h) => ({
      ...h,
      cast: w.castCount,
      depth: Math.max(0, Math.round(((w.hookY - w.H * 0.14) / span) * 30)),
    }))
  }, [])

  /* File de cartes de découverte (timers → setState conforme) */
  const discoveryBusyUntilRef = useRef(0)
  const processDiscovery = useCallback(() => {
    const queue = [...discoveryQueueRef.current]
    discoveryQueueRef.current = []
    if (queue.length === 0) return
    const now = performance.now()
    let delay = Math.max(0, discoveryBusyUntilRef.current - now)
    discoveryBusyUntilRef.current = now + delay + queue.length * 2850
    for (const spec of queue) {
      later(() => {
        setDiscovery(spec)
        sfx.play('reveal')
        buzz(15)
      }, delay)
      later(() => {
        setDiscovery(null)
      }, delay + 2500)
      delay += 2850
    }
  }, [later])

  /* Bandeau d'annonce (défi réussi / record battu) */
  const showBanner = useCallback((b: Banner) => {
    setBanner(b)
    if (bannerTimerRef.current) clearLater(bannerTimerRef.current)
    bannerTimerRef.current = later(() => setBanner(null), 2600)
  }, [clearLater, later])

  const openBook = useCallback(() => {
    sfx.play('flip', { volume: 0.5 })
    worldRef.current.holding = false
    setBookOpen(true)
  }, [])

  const handleStart = useCallback(() => {
    const now = performance.now()
    if (now - lastStartRef.current < 400) return
    lastStartRef.current = now
    sfx.play('click')
    addPlay(gameId)
    setPhase('playing')
  }, [addPlay])

  /* Retour à l'accueil : relâche proprement hameçon et poissons */
  const handleExit = useCallback(() => {
    sfx.play('click', { volume: 0.5 })
    const w = worldRef.current
    for (const f of w.fishes) f.hooked = false
    w.holding = false
    w.hookState = 'top'
    w.hookY = w.H * 0.14 + 8
    w.castCount = 0
    setPhase('idle')
    setHud((h) => ({ ...h, cast: 0, depth: 0 }))
  }, [])

  /* ================= Boucle principale ================= */
  useEffect(() => {
    const cv = canvasRef.current
    const wrap = wrapRef.current
    if (!cv || !wrap) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const w = worldRef.current

    let dpr = 1

    /* Population adaptée à la surface de l'aquarium (éléments en %) */
    const syncPopulation = () => {
      const target = Math.round(clamp((w.W * w.H) / 34000, 4, 10))
      for (let b = 0; b < 3; b++) {
        let count = 0
        for (const f of w.fishes) {
          if (!f.hooked && SPECIES[f.sp].band === b) count++
        }
        let diff = target - count
        while (diff > 0) {
          w.fishes.push(spawnFish(b, false, w.W))
          diff--
        }
        while (diff < 0) {
          const idx = w.fishes.findIndex((f) => !f.hooked && SPECIES[f.sp].band === b)
          if (idx < 0) break
          w.fishes.splice(idx, 1)
          diff++
        }
      }
    }

    const resize = () => {
      const cw = wrap.clientWidth
      const ch = wrap.clientHeight
      if (cw < 40 || ch < 40) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w.W = cw
      w.H = ch
      w.scale = clamp(ch / 430, 1, 1.45)
      if (w.hookState === 'top') w.hookY = ch * 0.14 + 8
      w.hookY = Math.min(w.hookY, ch * 0.95)
      cv.width = Math.round(cw * dpr)
      cv.height = Math.round(ch * dpr)
      syncPopulation()
    }
    resize()

    const surfaceY = () => w.H * 0.14
    const bedY = () => w.H * 0.95
    const bandY = (band: number, yFrac: number) => {
      const top = surfaceY() + (w.H - surfaceY()) * (band === 0 ? 0.04 : band === 1 ? 0.32 : 0.62)
      const bottom = surfaceY() + (w.H - surfaceY()) * (band === 0 ? 0.3 : band === 1 ? 0.6 : 0.96)
      return top + (bottom - top) * yFrac
    }
    const fishY = (f: Fish) => {
      if (f.hooked) {
        return Math.max(surfaceY() + 10, w.hookY - 16 * w.scale - f.slot * 26 * w.scale)
      }
      return bandY(SPECIES[f.sp].band, f.yFrac) + Math.sin(w.t * f.bobF + f.phase) * f.bobA * w.scale
    }
    const fishX = (f: Fish) => {
      if (f.hooked) return w.W / 2 + Math.sin(w.t * 5 + f.slot * 1.4) * 9
      return f.x
    }

    /* ----- entrées : maintien fiable, multi-pointeurs propre ----- */
    const activePointers = new Set<number>()
    const onDown = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return
      e.preventDefault()
      activePointers.add(e.pointerId)
      w.holding = true
      try {
        cv.setPointerCapture(e.pointerId)
      } catch {
        /* capture refusée */
      }
    }
    const onRelease = (e: PointerEvent) => {
      activePointers.delete(e.pointerId)
      if (activePointers.size === 0) w.holding = false
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'playing') return
      if (e.code === 'Space' || e.code === 'ArrowDown') {
        e.preventDefault()
        w.holding = true
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowDown') w.holding = false
    }
    const onCtx = (e: Event) => e.preventDefault()
    const onVis = () => {
      pausedRef.current = document.hidden
    }
    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointerup', onRelease)
    cv.addEventListener('pointercancel', onRelease)
    cv.addEventListener('lostpointercapture', onRelease)
    cv.addEventListener('contextmenu', onCtx)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    document.addEventListener('visibilitychange', onVis)

    /* ----- résolution d'une remontée ----- */
    const resolveCast = () => {
      const hooked = w.fishes.filter((f) => f.hooked)
      const n = hooked.length
      if (n === 0) return
      sfx.play('splash', { volume: 0.7 })
      let xp = 0
      let newSpecies = false
      let deepCaught = false
      let legendary = false
      let rareCaught = false
      for (const f of hooked) {
        const spec = SPECIES[f.sp]
        xp += RARITY_XP[spec.rarity]
        if (spec.band === 2) deepCaught = true
        if (spec.rarity === 'legendary') legendary = true
        if (spec.rarity !== 'common') rareCaught = true
        if (!caughtRef.current.has(spec.id)) {
          newSpecies = true
          caughtRef.current.add(spec.id)
          discoveryQueueRef.current.push(spec)
        }
        // Vol vers le compteur du jour
        w.flyers.push({ sp: f.sp, x0: fishX(f), y0: fishY(f), t: 0, delay: f.slot * 0.09 })
      }
      // Remplace les poissons pêchés
      w.fishes = w.fishes.filter((f) => !f.hooked)
      for (const f of hooked) w.fishes.push(spawnFish(SPECIES[f.sp].band, true, w.W))
      w.castCount = 0
      // Gamification
      addXp(xp)
      const isRecord = setBest(gameId, 'best-catch', n)
      if (isRecord && n >= 2) showBanner({ kind: 'record', value: n })
      const size = caughtRef.current.size
      if (newSpecies) {
        setBest(gameId, 'species', size)
        setCaught(new Set(caughtRef.current))
        if (size >= 10) unlockBadge('fish-10')
        // Nouvelle(s) espèce(s) : 12 XP chacune + célébration brève (la garde
        // !caughtRef.has() ci-dessus assure le « une seule fois » par espèce).
        addGameXp(gameId, 12 * discoveryQueueRef.current.length)
        const fresh = discoveryQueueRef.current[discoveryQueueRef.current.length - 1]
        if (fresh) {
          setBurst({
            emoji: fresh.emoji,
            stars: fresh.rarity === 'legendary' ? 3 : fresh.rarity === 'rare' ? 2 : 1,
            title: L[langRef.current].newSpecies,
          })
          setBurstKey((k) => k + 1)
        }
        processDiscovery()
      }
      if (rareCaught) unlockBadge('fish-rare')
      if (n >= 5) addWin(gameId)
      if (legendary) setConfetti((k) => k + 1)
      // Défis du jour (remise à zéro si la partie traverse minuit)
      const today = todayKey()
      const day = dayRef.current
      if (day.day !== today) {
        day.day = today
        day.dayCount = 0
        day.bestCastToday = 0
        day.deepToday = false
      }
      day.dayCount += n
      day.bestCastToday = Math.max(day.bestCastToday, n)
      if (deepCaught) day.deepToday = true
      setDayStats({ dayCount: day.dayCount, bestCast: day.bestCastToday, deep: day.deepToday })
      setHud((h) => ({ ...h, today: day.dayCount }))
      persist()
      const goalMet =
        dailyGoal === 0 ? day.bestCastToday >= 5
        : dailyGoal === 1 ? day.deepToday
        : day.dayCount >= 10
      if (goalMet && !dailyDoneRef.current) {
        completeDaily(gameId)
        sfx.play('win')
        setConfetti((k) => k + 1)
        showBanner({ kind: 'daily' })
        buzz(20)
        // « Victoire » de la session zen : défi du jour atteint.
        addGameXp(gameId, 25)
        setBurst({ emoji: '🎣', stars: 3, title: L[langRef.current].goalDone })
        setBurstKey((k) => k + 1)
      }
    }

    /* ----- simulation ----- */
    let lastDepth = -1
    let depthAcc = 0
    const update = (dt: number) => {
      const playing = phaseRef.current === 'playing'
      // Hameçon
      if (playing) {
        if (w.hookState === 'top' && w.holding) {
          w.hookState = 'down'
          w.bedTouched = false
          w.rippleT = 0.5
          w.rippleY = surfaceY()
          sfx.play('splash', { volume: 0.6 })
        } else if (w.hookState === 'down') {
          w.hookY += 235 * w.scale * dt
          if (!w.holding) w.hookState = 'up'
          if (w.hookY >= bedY()) {
            w.hookY = bedY()
            if (!w.bedTouched) {
              w.bedTouched = true
              sfx.play('drop', { volume: 0.35 })
            }
            if (!w.holding) w.hookState = 'up'
          }
        } else if (w.hookState === 'up') {
          w.hookY -= 270 * w.scale * dt
          // Capture à la remontée
          for (const f of w.fishes) {
            if (f.hooked) continue
            const spec = SPECIES[f.sp]
            const r = (spec.size * w.scale) / 2
            const fx = fishX(f)
            const fy = fishY(f)
            if (Math.abs(fx - w.W / 2) < r + 15 * w.scale && Math.abs(fy - w.hookY) < r + 17 * w.scale) {
              f.hooked = true
              f.slot = w.castCount
              w.castCount++
              if (spec.rarity === 'legendary') {
                sfx.play('reveal', { volume: 0.55 })
                buzz([10, 40, 10])
              } else if (spec.rarity === 'rare') {
                sfx.play('coin', { volume: 0.45 })
                buzz(15)
              } else {
                sfx.play('splash', { volume: 0.4 })
                buzz(10)
              }
              pushHud()
            }
          }
          if (w.hookY <= surfaceY() + 8) {
            w.hookY = surfaceY() + 8
            w.hookState = 'top'
            resolveCast()
            pushHud()
          }
        }
      }

      // Poissons
      for (const f of w.fishes) {
        if (f.hooked) continue
        f.x += f.dir * f.speed * dt
        if (f.x < -70 && f.dir === -1) {
          const nf = spawnFish(SPECIES[f.sp].band, false, w.W)
          f.sp = nf.sp
          f.yFrac = nf.yFrac
          f.dir = -1
          f.speed = SPECIES[f.sp].speed * (0.85 + Math.random() * 0.3)
          f.bobA = nf.bobA
          f.bobF = nf.bobF
          f.phase = nf.phase
          f.x = w.W + 60
        } else if (f.x > w.W + 70 && f.dir === 1) {
          const nf = spawnFish(SPECIES[f.sp].band, false, w.W)
          f.sp = nf.sp
          f.yFrac = nf.yFrac
          f.dir = 1
          f.speed = SPECIES[f.sp].speed * (0.85 + Math.random() * 0.3)
          f.bobA = nf.bobA
          f.bobF = nf.bobF
          f.phase = nf.phase
          f.x = -60
        }
      }

      // Bulles
      w.bubbleT -= dt
      if (w.bubbleT <= 0 && !reduceRef.current) {
        w.bubbleT = 0.35 + Math.random() * 0.4
        w.bubbles.push({
          x: 14 + Math.random() * (w.W - 28),
          y: bedY() - 4,
          r: 1.5 + Math.random() * 3,
          vy: 26 + Math.random() * 30,
          phase: Math.random() * Math.PI * 2,
        })
      }
      for (let i = w.bubbles.length - 1; i >= 0; i--) {
        const b = w.bubbles[i]
        b.y -= b.vy * dt
        b.x += Math.sin(w.t * 2 + b.phase) * 8 * dt
        if (b.y < surfaceY() + 4) w.bubbles.splice(i, 1)
      }

      // Vols vers le compteur (petit pop à l'arrivée)
      for (let i = w.flyers.length - 1; i >= 0; i--) {
        const fl = w.flyers[i]
        if (fl.delay > 0) {
          fl.delay -= dt
          continue
        }
        fl.t += dt / 0.55
        if (fl.t >= 1) {
          w.flyers.splice(i, 1)
          sfx.play('pop', { volume: 0.28 })
        }
      }

      if (w.rippleT > 0) w.rippleT -= dt

      // Profondeur (HUD throttlé — 0 à 30 m, proportionnel)
      depthAcc += dt
      if (depthAcc >= 0.12) {
        depthAcc = 0
        const span = Math.max(1, bedY() - surfaceY())
        const depth = Math.max(0, Math.round(((w.hookY - surfaceY()) / span) * 30))
        if (playing && depth !== lastDepth) {
          lastDepth = depth
          pushHud()
        }
      }
    }

    /* ----- rendu ----- */
    const draw = () => {
      const W = w.W, H = w.H
      const sY = surfaceY()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      drawWater(ctx, W, H, sY)

      // Rayons de lumière
      ctx.save()
      for (let i = 0; i < 3; i++) {
        const sway = reduceRef.current ? 0 : Math.sin(w.t * 0.35 + i * 2) * 26
        const rx = W * (0.22 + i * 0.3) + sway
        ctx.fillStyle = 'rgba(255,246,220,0.07)'
        ctx.beginPath()
        ctx.moveTo(rx - 14, sY)
        ctx.lineTo(rx + 14, sY)
        ctx.lineTo(rx + 76, H)
        ctx.lineTo(rx + 20, H)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()

      // Algues
      for (let i = 0; i < 5; i++) {
        const sx = W * (0.08 + i * 0.21)
        const sway = reduceRef.current ? 0 : Math.sin(w.t * 1.1 + i) * 8
        ctx.strokeStyle = 'rgba(46,124,92,0.75)'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(sx, H - 8)
        ctx.quadraticCurveTo(sx + sway, H - 26, sx - sway * 0.6, H - 44 - (i % 2) * 10)
        ctx.stroke()
      }

      // Bulles
      for (const b of w.bubbles) {
        ctx.strokeStyle = 'rgba(240,255,246,0.5)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Ligne + hameçon + appât
      const hookX = W / 2
      ctx.strokeStyle = 'rgba(244,233,208,0.75)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(hookX, sY - 35)
      ctx.lineTo(hookX, w.hookState === 'top' ? sY + 8 : w.hookY)
      ctx.stroke()
      if (w.hookState !== 'top' || phaseRef.current === 'playing') {
        const hy = w.hookState === 'top' ? sY + 8 : w.hookY
        ctx.strokeStyle = '#e8e0c8'
        ctx.lineWidth = 2.5 * w.scale
        ctx.beginPath()
        ctx.arc(hookX + 2, hy + 4 * w.scale, 6 * w.scale, -Math.PI * 0.4, Math.PI * 0.75)
        ctx.stroke()
        ctx.fillStyle = '#e2725b'
        ctx.beginPath()
        ctx.arc(hookX, hy - 1, 3 * w.scale, 0, Math.PI * 2)
        ctx.fill()
      }

      // Poissons (taille adaptée à l'aquarium)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const f of w.fishes) {
        const spec = SPECIES[f.sp]
        const fx = fishX(f)
        const fy = fishY(f)
        if (fx < -60 || fx > W + 60) continue
        const size = spec.size * w.scale
        ctx.save()
        ctx.translate(fx, fy)
        if (f.hooked) {
          ctx.rotate(Math.sin(w.t * 6 + f.slot) * 0.25)
        } else {
          if (!reduceRef.current) ctx.rotate(Math.sin(w.t * 3.2 + f.phase) * 0.05)
          ctx.scale(f.dir === 1 ? -1 : 1, 1)
        }
        if (spec.rarity === 'legendary') {
          const g = ctx.createRadialGradient(0, 0, 2, 0, 0, size)
          g.addColorStop(0, 'rgba(247,200,115,0.65)')
          g.addColorStop(1, 'rgba(247,200,115,0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(0, 0, size, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.font = emojiFont(size)
        ctx.fillText(spec.emoji, 0, 0)
        if (spec.rarity === 'legendary') {
          ctx.font = emojiFont(12 * w.scale)
          ctx.fillText('✨', -size * 0.55, -size * 0.45)
        }
        ctx.restore()
      }

      // Vols vers le compteur du jour
      for (const fl of w.flyers) {
        if (fl.delay > 0) continue
        const spec = SPECIES[fl.sp]
        const t = clamp(fl.t, 0, 1)
        const ex = W - 46, ey = 22
        const cxp = (fl.x0 + ex) / 2
        const cyp = Math.min(fl.y0, ey) - 110
        const x = (1 - t) * (1 - t) * fl.x0 + 2 * (1 - t) * t * cxp + t * t * ex
        const y = (1 - t) * (1 - t) * fl.y0 + 2 * (1 - t) * t * cyp + t * t * ey
        ctx.save()
        ctx.globalAlpha = 1 - t * 0.25
        ctx.translate(x, y)
        ctx.scale(1 - t * 0.4, 1 - t * 0.4)
        ctx.font = emojiFont(spec.size * w.scale)
        ctx.fillText(spec.emoji, 0, 0)
        ctx.restore()
      }

      // Bateau par-dessus la ligne
      drawBoat(ctx, W, sY, w.t, reduceRef.current)

      // Onde de plongée
      if (w.rippleT > 0) {
        ctx.strokeStyle = `rgba(255,255,255,${w.rippleT})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.ellipse(hookX, w.rippleY, 26 * (1 - w.rippleT) + 6, 7, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    let last = performance.now()
    const step = (now: number) => {
      rafRef.current = requestAnimationFrame(step)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (pausedRef.current) return
      w.t += dt
      update(dt)
      draw()
    }
    rafRef.current = requestAnimationFrame(step)

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      cv.removeEventListener('pointerdown', onDown)
      cv.removeEventListener('pointerup', onRelease)
      cv.removeEventListener('pointercancel', onRelease)
      cv.removeEventListener('lostpointercapture', onRelease)
      cv.removeEventListener('contextmenu', onCtx)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [addGameXp, addWin, addXp, completeDaily, dailyGoal, persist, processDiscovery, pushHud, setBest, showBanner, unlockBadge])

  /* ================= Rendu React ================= */
  const rarityChip = (r: Rarity) =>
    r === 'common'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
      : r === 'rare'
        ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'

  const goalProgress = (i: number) => {
    if (i === 0) return dayStats.bestCast >= 5
    if (i === 1) return dayStats.deep
    return dayStats.dayCount >= 10
  }

  return (
    <div className="relative select-none touch-manipulation my-auto flex w-full flex-col h-[var(--board-h,auto)]">
      <Confetti fire={confetti} count={reduce ? 0 : 80} waves={2} gold />
      <VictoryBurst fire={burstKey} stars={burst?.stars ?? 3} emoji={burst?.emoji ?? '🎣'} title={burst?.title} />

      {/* HUD compact — une seule ligne */}
      <div className="mb-2 flex items-center gap-1.5">
        {phase === 'playing' ? (
          <>
            <Pill icon="🎣" label={T.onHook}>×{hud.cast}</Pill>
            <Pill icon="📖" label={T.species}>{caught.size}/12</Pill>
            <Pill icon="📏" label={T.depth}>{hud.depth} {T.meters}</Pill>
            <Button
              variant="secondary"
              size="sm"
              className="ms-auto h-9 w-9 shrink-0 rounded-full p-0"
              aria-label={T.exit}
              title={T.exit}
              onClick={handleExit}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-9 w-9 shrink-0 rounded-full p-0"
              aria-label={`${T.collection} — ${caught.size}/12`}
              title={T.collection}
              onClick={openBook}
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </Button>
          </>
        ) : (
          <>
            {hydrated ? <Pill icon="📖" label={`${T.best} · ${T.speciesBest}`}>{bestSpecies}/12</Pill> : null}
            {hydrated && bestCatch > 0 ? <Pill icon="🎣" label={`${T.best} · ${T.catchBest}`}>×{bestCatch}</Pill> : null}
            <Button
              variant="secondary"
              size="sm"
              className="ms-auto h-9 shrink-0 gap-1.5 rounded-full px-3"
              onClick={openBook}
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              {T.collection} {caught.size}/12
            </Button>
          </>
        )}
      </div>

      {/* Aquarium — tient dans le budget vertical mobile, éléments en % */}
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-2xl border shadow-inner h-[var(--board-h,calc(100dvh-244px))] max-h-[680px] min-h-[300px]"
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={T.ariaCanvas}
          className="no-select block h-full w-full touch-none"
          style={{ touchAction: 'none' }}
        />

        {/* Compteur du jour (cible des vols de poissons) */}
        {phase === 'playing' ? (
          <span
            className="pointer-events-none absolute right-2 top-2 z-10 flex h-8 items-center gap-1.5 rounded-full bg-white/85 px-2.5 text-xs font-bold tabular-nums text-stone-700 shadow-sm backdrop-blur-sm dark:bg-stone-900/70 dark:text-stone-200"
            title={T.today}
          >
            <span aria-hidden="true">🐟</span> ×{hud.today}{dailyDone ? ' ✅' : ''}
            <span className="sr-only">{T.today}</span>
          </span>
        ) : null}

        {/* Bandeau d'annonce (défi du jour / record) */}
        {banner ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-30 flex justify-center px-4" role="status">
            <div
              className={cn(
                'anim-rise flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold shadow-xl backdrop-blur',
                banner.kind === 'daily'
                  ? 'border-emerald-300/70 bg-emerald-50/95 text-emerald-700 dark:bg-emerald-950/85 dark:text-emerald-200'
                  : 'border-amber-300/70 bg-amber-50/95 text-amber-700 dark:bg-amber-950/85 dark:text-amber-200',
              )}
            >
              {banner.kind === 'daily' ? (
                <><span aria-hidden="true">🎯</span>{T.goalDone}</>
              ) : (
                <><span aria-hidden="true">🏆</span>{T.newRecord} · ×{banner.value}</>
              )}
            </div>
          </div>
        ) : null}

        {/* Carte de découverte */}
        {discovery ? (
          <div className="pointer-events-none absolute inset-x-0 top-6 z-30 flex justify-center px-4" role="status">
            <div className="anim-rise flex items-center gap-3 rounded-2xl border border-amber-300/70 bg-card/95 px-4 py-3 shadow-xl">
              <span className="text-4xl" aria-hidden="true">{discovery.emoji}</span>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">✨ {T.newSpecies}</p>
                <p className="font-display text-lg font-extrabold leading-tight">{discovery.name[lang]}</p>
                <span className={cn('mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold', rarityChip(discovery.rarity))}>
                  {T.rarity[discovery.rarity]}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Écran d'accueil — bouton Jouer visible immédiatement */}
        {phase === 'idle' ? (
          <div className="absolute inset-0 z-20 overflow-y-auto nice-scroll bg-stone-900/40 backdrop-blur-[2px]">
            <div className="flex min-h-full flex-col items-center justify-center gap-3 p-4 text-center">
              <div className="flex gap-2" aria-hidden="true">
                {['⛵', '🐟', '✨'].map((e, i) => (
                  <span key={i} className="text-3xl anim-floaty" style={{ animationDelay: `${i * 0.4}s` }}>{e}</span>
                ))}
              </div>
              <h3 className="font-display text-xl font-extrabold text-white drop-shadow sm:text-2xl">⛵ {T.title}</h3>
              <p className="max-w-sm text-xs text-stone-100 sm:text-sm">{content.tagline[lang]}</p>
              <p className="max-w-xs rounded-xl bg-white/15 px-3 py-1.5 text-[11px] text-stone-100">{T.hint}</p>
              <Button size="lg" className="h-11 rounded-full px-7 anim-glow" onClick={handleStart}>
                <Play className="h-5 w-5" aria-hidden="true" /> {T.play}
              </Button>
              {/* Défis du jour */}
              <div className="w-full max-w-sm rounded-xl bg-white/10 p-2.5 text-left backdrop-blur-sm">
                <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-amber-200">
                  <CalendarCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{T.goalTitle}</span>
                  {dailyDone ? (
                    <span className="ms-auto shrink-0 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] text-emerald-200">✓ {T.goalDone}</span>
                  ) : null}
                </p>
                <ul className="space-y-0.5">
                  {T.goals.map((goal, i) => (
                    <li key={i} className={cn('flex items-center gap-1.5 text-[11px] text-stone-100', i === dailyGoal && 'font-bold text-amber-200')}>
                      <span aria-hidden="true">{i === dailyGoal ? '🎯' : '•'}</span>
                      <span className="min-w-0 flex-1">
                        {goal}
                        {i === 0 ? ` (${dayStats.bestCast}/5)` : i === 2 ? ` (${dayStats.dayCount}/10)` : ''}
                      </span>
                      {goalProgress(i) ? <Check className="h-3 w-3 shrink-0 text-emerald-400" aria-hidden="true" /> : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Carnet de collection */}
      <Dialog
        open={bookOpen}
        onOpenChange={(o) => {
          setBookOpen(o)
          if (!o) sfx.play('click', { volume: 0.4 })
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto nice-scroll">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">📖 {T.collection} — {caught.size}/12</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {SPECIES.map((sp) => {
              const has = caught.has(sp.id)
              return (
                <div
                  key={sp.id}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center',
                    has ? 'border-border bg-card' : 'border-dashed bg-card/50 opacity-70',
                  )}
                >
                  <span className="text-3xl" aria-hidden="true">{has ? sp.emoji : '❓'}</span>
                  <span className="text-[11px] font-bold leading-tight">{has ? sp.name[lang] : '???'}</span>
                  {has ? (
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', rarityChip(sp.rarity))}>
                      {T.rarity[sp.rarity]}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">{T.bands[sp.band]}</span>
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {hydrated && bestCatch > 0 ? `${T.catchBest} : ×${bestCatch} · ` : ''}❓ {T.unknown}
          </p>
          <p className="text-xs text-muted-foreground">
            {T.bands[0]} · {T.bands[1]} · {T.bands[2]}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
