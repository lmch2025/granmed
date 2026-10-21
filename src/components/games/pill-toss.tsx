'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, SkipForward, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore } from '@/lib/progress/store'
import { useHydrated, useReducedMotion, clamp } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { StatChip } from '@/components/shared/ui-bits'
import { Confetti } from '@/components/shared/confetti'

export const gameId = 'pill-toss'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Tendez l’élastique, visez les fioles glissantes et lancez vos pilules fictives dans cette pharmacie chaleureuse.',
    en: 'Stretch the sling, aim at the sliding jars and toss your fictional pills in this cozy pharmacy.',
  },
  description: {
    fr: [
      'Pill Toss est un jeu d’adresse et de réflexes gratuit dans lequel vous lancez des pilules fictives à l’aide d’un élastique pour toucher des fioles en mouvement sur les étagères d’une pharmacie. Tirez la pilule vers l’arrière, suivez la trajectoire prévue en pointillés, puis relâchez : la gravité fait le reste.',
      'Chaque manche offre 10 pilules. Au fil des manches, les fioles glissent plus vite, rétrécissent et occupent jusqu’à trois étagères. Un touché rapporte 100 points, majorés de 50 points par touché consécutif ; un lancer raté remet la série à zéro. Nettoyer toutes les étagères avant d’épuiser vos pilules rapporte un bonus de 150 points par pilule restante.',
      'Les pilules sont entièrement fictives : ce jeu est une pure fiction ludique, sans référence à un vrai médicament. Les records de score et de série sont sauvegardés sur votre appareil et les manches s’enchaînent sans fin, pour des sessions aussi courtes ou longues que vous le souhaitez.',
    ],
    en: [
      'Pill Toss is a free skill and reflex game in which you fling fictional pills with a slingshot to hit moving jars on pharmacy shelves. Drag the pill backwards, follow the dotted trajectory preview, then release: gravity does the rest.',
      'Each round hands you 10 pills. As rounds go by, the jars slide faster, shrink, and spread across up to three shelves. A hit is worth 100 points plus 50 extra for every consecutive hit; a missed throw resets the streak. Clearing every shelf before running out of pills earns a bonus of 150 points per unused pill.',
      'The pills are entirely fictional: this game is pure playful fiction with no reference to any real medication. Score and streak records are saved on your device, and rounds chain endlessly for sessions as short or long as you like.',
    ],
  },
  rules: {
    fr: [
      'Maintenez le doigt (ou la souris) près de la pilule, puis tirez vers l’arrière pour armer l’élastique.',
      'La trajectoire prévue s’affiche en pointillés : plus vous tirez loin, plus le lancer est puissant.',
      'Relâchez pour lancer la pilule ; relâcher sans avoir tiré annule le lancer.',
      'Touchez les fioles glissantes sur les étagères : chaque touché rapporte des points.',
      'Enchaînez les touchés pour faire grimper le bonus de série (+50 points par touché consécutif) ; un raté remet la série à zéro.',
      'La manche se termine après 10 pilules — ou immédiatement si vous nettoyez toutes les étagères (bonus par pilule restante).',
      'À chaque manche, les fioles sont plus rapides, plus petites et plus nombreuses.',
    ],
    en: [
      'Press and hold near the pill (with a finger or the mouse), then drag backwards to stretch the sling.',
      'The predicted path appears as dots: the further you pull, the stronger the throw.',
      'Release to launch; releasing without pulling cancels the throw.',
      'Hit the jars sliding along the shelves: every hit scores points.',
      'Chain hits to grow the streak bonus (+50 points per consecutive hit); a miss resets the streak.',
      'The round ends after 10 pills — or immediately if you clear every shelf (bonus per unused pill).',
      'With each round, jars get faster, smaller and more numerous.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : maintenez près de la pilule, tirez vers l’arrière, puis relâchez.',
      'Ordinateur : cliquez près de la pilule, tirez avec la souris, puis relâchez.',
      'La zone de prise est volontairement très large : inutile d’être précis pour saisir la pilule.',
    ],
    en: [
      'Mobile & tablet: press near the pill, drag back, then release.',
      'Desktop: click near the pill, drag with the mouse, then release.',
      'The grab zone is deliberately generous: you don’t need to be precise to pick up the pill.',
    ],
  },
  features: {
    fr: [
      'Physique de lance-pierre avec trajectoire prédictive en pointillés',
      'Fioles animées sur 1 à 3 étagères selon la manche',
      'Bonus de série : +50 points par touché consécutif',
      'Manches infinies à difficulté croissante',
      'Records de score et de série sauvegardés sur votre appareil',
      'Pilules 100 % fictives — aucune référence médicale',
    ],
    en: [
      'Slingshot physics with a dotted trajectory preview',
      'Animated jars on 1 to 3 shelves depending on the round',
      'Streak bonus: +50 points per consecutive hit',
      'Endless rounds with rising difficulty',
      'Score and streak records saved on your device',
      '100% fictional pills — no medical reference',
    ],
  },
  tips: {
    fr: [
      'Visez légèrement devant une fiole en mouvement : la pilule met un instant à arriver.',
      'Les fioles ralentissent et rebroussent chemin aux extrémités : anticipez ce moment pour des touchés faciles.',
      'Un lancer tendu vers l’étagère du haut protège mieux votre série qu’un lancer en cloche.',
      'Gardez une ou deux pilules de réserve : nettoyer toute l’étagère rapporte 150 points par pilule restante.',
    ],
    en: [
      'Aim slightly ahead of a moving jar: the pill takes a moment to arrive.',
      'Jars slow down and turn around at the edges: anticipate that moment for easy hits.',
      'A flat, fast throw at the top shelf keeps your streak safer than a high lob.',
      'Keep a spare pill or two: clearing a whole shelf pays 150 points per unused pill.',
    ],
  },
  faq: {
    fr: [
      { q: 'Les pilules de ce jeu sont-elles réelles ?', a: 'Non, absolument pas. Toutes les pilules et fioles sont des dessins fictifs créés pour le jeu. Pill Toss est un simple jeu d’adresse, sans aucun lien avec un médicament réel.' },
      { q: 'Comment fonctionne le bonus de série ?', a: 'Chaque touché rapporte 100 points, et chaque touché consécutif ajoute 50 points de plus (150, 200, 250…). Dès qu’une pilule rate les fioles, la série retombe à zéro.' },
      { q: 'Le jeu s’arrête-t-il un jour ?', a: 'Non : les manches s’enchaînent sans fin et deviennent progressivement plus difficiles. Vous pouvez terminer la session quand vous le souhaitez — vos records sont sauvegardés à chaque fin de manche.' },
      { q: 'Comment atteindre 3 000 points en une manche ?', a: 'Enchaînez les touchés sans rater pour faire grimper le bonus de série, et nettoyez les étagères avant la fin des 10 pilules : le bonus de 150 points par pilule restante fait souvent la différence.' },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui : le jeu est conçu pour le tactile, en portrait comme en paysage. La zone de saisie de la pilule est volontairement très large pour un visée confortable.' },
    ],
    en: [
      { q: 'Are the pills in this game real?', a: 'No, not at all. Every pill and jar is a fictional drawing made for the game. Pill Toss is purely a skill game with no connection to any real medication.' },
      { q: 'How does the streak bonus work?', a: 'Each hit is worth 100 points, and every consecutive hit adds 50 more (150, 200, 250…). As soon as a pill misses the jars, the streak falls back to zero.' },
      { q: 'Does the game ever end?', a: 'No: rounds chain endlessly and get progressively harder. You can end your session whenever you like — your records are saved at the end of every round.' },
      { q: 'How do I reach 3,000 points in a single round?', a: 'Chain hits without missing to grow the streak bonus, and clear the shelves before using all 10 pills: the 150-point bonus per unused pill often makes the difference.' },
      { q: 'Can I play on my phone?', a: 'Yes: the game is touch-first, in portrait or landscape. The pill’s grab zone is deliberately very large for comfortable aiming.' },
    ],
  },
  records: {
    'best-score': { fr: 'Meilleur score total', en: 'Best total score' },
    'best-combo': { fr: 'Plus longue série de touchés', en: 'Longest hit streak' },
  },
}

/* ================= Textes UI ================= */
const L = {
  fr: {
    play: 'Jouer', replay: 'Rejouer', next: 'Manche suivante', end: 'Terminer la session',
    round: 'Manche', score: 'Score', streak: 'Série', pills: 'Pilules',
    roundOver: 'Manche {n} terminée !', hits: 'Touchés', accuracy: 'Précision',
    roundScore: 'Score de la manche', total: 'Total de la session', bonus: 'Bonus pilules restantes',
    cleared: 'Étagères nettoyées !', disclaimer: 'Pilules fictives — jeu uniquement',
    hint: 'Maintenez près de la pilule, tirez vers l’arrière, puis relâchez.',
    best: 'Record', newBest: 'Nouveau record !', sessionOver: 'Session terminée',
    bestStreak: 'Meilleure série', again: 'Nouvelle session', aimTitle: 'Visez les fioles !',
  },
  en: {
    play: 'Play', replay: 'Play again', next: 'Next round', end: 'End session',
    round: 'Round', score: 'Score', streak: 'Streak', pills: 'Pills',
    roundOver: 'Round {n} complete!', hits: 'Hits', accuracy: 'Accuracy',
    roundScore: 'Round score', total: 'Session total', bonus: 'Unused-pill bonus',
    cleared: 'Shelves cleared!', disclaimer: 'Fictional pills — game only',
    hint: 'Press near the pill, drag backwards, then release.',
    best: 'Best', newBest: 'New record!', sessionOver: 'Session over',
    bestStreak: 'Best streak', again: 'New session', aimTitle: 'Aim for the jars!',
  },
} as const

/* ================= Monde ================= */
interface Jar {
  rowIdx: number
  off: number
  speed: number
  phase: number
  w: number
  h: number
  alive: boolean
  fade: number
  glass: number
}
interface Shard { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string }
interface Pop { x: number; y: number; text: string; life: number; max: number; color: string; size: number }
interface Pill { x: number; y: number; vx: number; vy: number; rot: number; vr: number; state: 'ready' | 'aiming' | 'flying' }

interface World {
  W: number; H: number; t: number
  round: number; rows: number
  jars: Jar[]
  shelfWob: number[]
  pill: Pill
  aim: { x: number; y: number }
  pillsLeft: number
  streak: number
  maxStreakRound: number
  maxStreakSession: number
  roundScore: number
  roundHits: number
  bonusGiven: number
  totalScore: number
  shards: Shard[]
  pops: Pop[]
  endTimer: number
  cleared: boolean
  hudDirty: boolean
}

function makeWorld(): World {
  return {
    W: 320, H: 240, t: 0,
    round: 1, rows: 1,
    jars: [], shelfWob: [0, 0, 0],
    pill: { x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, state: 'ready' },
    aim: { x: 0, y: 0 },
    pillsLeft: 10, streak: 0, maxStreakRound: 0, maxStreakSession: 0,
    roundScore: 0, roundHits: 0, bonusGiven: 0, totalScore: 0,
    shards: [], pops: [], endTimer: 0, cleared: false, hudDirty: false,
  }
}

function startRound(w: World, round: number) {
  w.round = round
  w.rows = Math.min(1 + Math.floor((round - 1) / 2), 3)
  const perRow = Math.min(2 + Math.ceil(round / 2), 4)
  const speed = 0.7 + round * 0.14
  const jw = Math.max(74 - (round - 1) * 4, 44)
  const jh = jw * 1.3
  w.jars = []
  for (let r = 0; r < w.rows; r++) {
    for (let i = 0; i < perRow; i++) {
      w.jars.push({
        rowIdx: r,
        off: 0.2 + Math.min(round * 0.02, 0.17),
        speed: speed * (0.88 + 0.12 * ((r * 2 + i) % 3)),
        phase: (i / perRow) * Math.PI * 2 + r * 1.35,
        w: jw, h: jh,
        alive: true, fade: 0,
        glass: (r + i) % 3,
      })
    }
  }
  w.shelfWob = [0, 0, 0]
  w.pill = { x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, state: 'ready' }
  w.pillsLeft = 10
  w.streak = 0
  w.maxStreakRound = 0
  w.roundScore = 0
  w.roundHits = 0
  w.bonusGiven = 0
  w.shards = []
  w.pops = []
  w.endTimer = 0
  w.cleared = false
  w.hudDirty = true
}

/* ================= Helpers dessin (purs) ================= */
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rad, y)
  ctx.arcTo(x + w, y, x + w, y + h, rad)
  ctx.arcTo(x + w, y + h, x, y + h, rad)
  ctx.arcTo(x, y + h, x, y, rad)
  ctx.arcTo(x, y, x + w, y, rad)
  ctx.closePath()
}

function emojiFont(size: number) {
  return `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",system-ui,sans-serif`
}

function drawBackdrop(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Mur chaleureux
  const wall = ctx.createLinearGradient(0, 0, 0, H)
  wall.addColorStop(0, '#fdf1de')
  wall.addColorStop(0.55, '#f7e3c6')
  wall.addColorStop(1, '#efd0aa')
  ctx.fillStyle = wall
  ctx.fillRect(0, 0, W, H)
  // Rayures horizontales discrètes
  ctx.fillStyle = 'rgba(214,164,110,0.10)'
  for (let y = 0; y < H; y += 46) ctx.fillRect(0, y, W, 20)
  // Lumière chaude
  const glow = ctx.createRadialGradient(W * 0.5, -H * 0.15, 10, W * 0.5, -H * 0.15, H * 0.95)
  glow.addColorStop(0, 'rgba(255,246,224,0.85)')
  glow.addColorStop(1, 'rgba(255,246,224,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)
  // Croix de pharmacie (émeraude)
  const s = Math.max(26, W * 0.055)
  const cx = W - s * 1.7, cy = s * 1.4
  ctx.fillStyle = '#2f9c74'
  rr(ctx, cx - s / 2, cy - s / 2, s, s, s * 0.24)
  ctx.fill()
  ctx.fillStyle = '#f8fffa'
  const t = s * 0.2
  ctx.fillRect(cx - t / 2, cy - s * 0.32, t, s * 0.64)
  ctx.fillRect(cx - s * 0.32, cy - t / 2, s * 0.64, t)
  // Plinthe + sol
  ctx.fillStyle = '#d9b183'
  ctx.fillRect(0, H - 14, W, 14)
  ctx.fillStyle = 'rgba(120,80,44,0.25)'
  ctx.fillRect(0, H - 15, W, 2)
}

function drawShelf(ctx: CanvasRenderingContext2D, y: number, W: number) {
  const grad = ctx.createLinearGradient(0, y, 0, y + 10)
  grad.addColorStop(0, '#b07a48')
  grad.addColorStop(1, '#84552e')
  ctx.fillStyle = grad
  rr(ctx, 6, y, W - 12, 10, 3)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,240,214,0.35)'
  ctx.fillRect(10, y + 1.5, W - 20, 1.5)
  // Équerres
  ctx.fillStyle = 'rgba(90,58,30,0.55)'
  for (let i = 0; i < 3; i++) {
    const bx = 26 + (i * (W - 52)) / 2
    ctx.beginPath()
    ctx.moveTo(bx, y + 10)
    ctx.lineTo(bx + 12, y + 10)
    ctx.lineTo(bx, y + 20)
    ctx.closePath()
    ctx.fill()
  }
}

const JAR_GLASS = [
  ['#f6c98a', '#d98a4f'],
  ['#f2b56b', '#c97b3a'],
  ['#f7d9a8', '#e0995c'],
]

function drawJar(ctx: CanvasRenderingContext2D, x: number, yCenter: number, j: Jar, alpha: number) {
  const { w, h } = j
  const [c1, c2] = JAR_GLASS[j.glass]
  ctx.save()
  ctx.globalAlpha = alpha
  // Corps
  const grad = ctx.createLinearGradient(x - w / 2, yCenter - h / 2, x + w / 2, yCenter + h / 2)
  grad.addColorStop(0, c1)
  grad.addColorStop(1, c2)
  ctx.fillStyle = grad
  rr(ctx, x - w / 2, yCenter - h / 2, w, h, 7)
  ctx.fill()
  ctx.strokeStyle = 'rgba(122,74,34,0.45)'
  ctx.lineWidth = 1.5
  rr(ctx, x - w / 2, yCenter - h / 2, w, h, 7)
  ctx.stroke()
  // Col + bouchon
  ctx.fillStyle = 'rgba(122,74,34,0.28)'
  rr(ctx, x - w * 0.2, yCenter - h / 2 - h * 0.1, w * 0.4, h * 0.14, 3)
  ctx.fill()
  ctx.fillStyle = '#c05b3f'
  rr(ctx, x - w * 0.24, yCenter - h / 2 - h * 0.19, w * 0.48, h * 0.1, 4)
  ctx.fill()
  // Reflet
  ctx.fillStyle = 'rgba(255,248,232,0.4)'
  rr(ctx, x - w * 0.36, yCenter - h * 0.32, w * 0.14, h * 0.6, 4)
  ctx.fill()
  // Étiquette + signe plus
  ctx.fillStyle = '#fdf6e9'
  rr(ctx, x - w * 0.26, yCenter - h * 0.12, w * 0.52, h * 0.34, 4)
  ctx.fill()
  ctx.fillStyle = '#c05b3f'
  const lt = Math.max(2.5, w * 0.07)
  ctx.fillRect(x - lt / 2, yCenter - h * 0.04 - lt * 0.9, lt, lt * 1.8)
  ctx.fillRect(x - lt * 0.9, yCenter - h * 0.04 - lt / 2, lt * 1.8, lt)
  ctx.restore()
}

function drawPill(ctx: CanvasRenderingContext2D, x: number, y: number, rot: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  rr(ctx, -13, -7, 26, 14, 7)
  ctx.fillStyle = '#f8f1e4'
  ctx.fill()
  ctx.save()
  rr(ctx, -13, -7, 26, 14, 7)
  ctx.clip()
  ctx.fillStyle = '#e2725b'
  ctx.fillRect(-13, -7, 13, 14)
  ctx.restore()
  ctx.strokeStyle = '#b34d3a'
  ctx.lineWidth = 1.5
  rr(ctx, -13, -7, 26, 14, 7)
  ctx.stroke()
  ctx.restore()
}

/* ================= Composant ================= */
export default function PillTossGame() {
  const lang = useLang()
  const reduce = useReducedMotion()
  const hydrated = useHydrated()
  const T = L[lang]

  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const bestScore = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-score']?.value ?? 0)
  const bestCombo = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-combo']?.value ?? 0)

  const [phase, setPhase] = useState<'idle' | 'playing' | 'roundEnd' | 'done'>('idle')
  const [hud, setHud] = useState({ score: 0, round: 1, pills: 10, streak: 0 })
  const [summary, setSummary] = useState<null | {
    round: number; hits: number; used: number; acc: number
    roundScore: number; bonus: number; total: number; isRecord: boolean; bestStreak: number
  }>(null)
  const [confetti, setConfetti] = useState(0)

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worldRef = useRef<World>(makeWorld())
  const phaseRef = useRef(phase)
  const reduceRef = useRef(reduce)
  const langRef = useRef(lang)
  const rafRef = useRef(0)
  const pausedRef = useRef(false)

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { reduceRef.current = reduce }, [reduce])
  useEffect(() => { langRef.current = lang }, [lang])

  const pushHud = useCallback(() => {
    const w = worldRef.current
    setHud({ score: w.totalScore, round: w.round, pills: w.pillsLeft, streak: w.streak })
  }, [])

  const finishRound = useCallback(() => {
    const w = worldRef.current
    const used = 10 - w.pillsLeft
    const acc = used > 0 ? Math.round((w.roundHits / used) * 100) : 0
    const isRecord =
      (w.totalScore > 0 && setBest(gameId, 'best-score', w.totalScore)) ||
      (w.maxStreakSession > 0 && setBest(gameId, 'best-combo', w.maxStreakSession))
    addWin(gameId)
    addXp(8 + w.roundHits * 4)
    if (w.roundScore >= 3000) unlockBadge('toss-score-30')
    sfx.play('levelup')
    setSummary({
      round: w.round, hits: w.roundHits, used, acc,
      roundScore: w.roundScore, bonus: w.bonusGiven, total: w.totalScore, isRecord,
      bestStreak: w.maxStreakSession,
    })
    setPhase('roundEnd')
  }, [addWin, addXp, setBest, unlockBadge])

  /* ---------- démarrage ---------- */
  const handleStart = useCallback(() => {
    sfx.play('click')
    const w = worldRef.current
    w.totalScore = 0
    w.maxStreakSession = 0
    startRound(w, 1)
    addPlay(gameId)
    setSummary(null)
    setPhase('playing')
    pushHud()
  }, [addPlay, pushHud])

  const handleNext = useCallback(() => {
    sfx.play('click')
    const w = worldRef.current
    startRound(w, w.round + 1)
    setSummary(null)
    setPhase('playing')
    pushHud()
  }, [pushHud])

  /* ---------- boucle principale ---------- */
  useEffect(() => {
    const cv = canvasRef.current
    const wrap = wrapRef.current
    if (!cv || !wrap) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const w = worldRef.current

    let bg: HTMLCanvasElement | null = null
    let dpr = 1

    const anchor = () => ({ x: w.W * 0.13, y: w.H * 0.88 })
    const gravity = () => w.H * 3.2
    const shelfY = (r: number) =>
      (w.rows === 1 ? 0.34 : 0.26 + (r * 0.4) / Math.max(w.rows - 1, 1)) * w.H
    const jarX = (j: Jar) => {
      const span = Math.max(w.W - j.w - 24, 10)
      const f = 0.5 + j.off * Math.sin(w.t * j.speed + j.phase)
      return 12 + span * clamp(f, 0.03, 0.97)
    }

    const resize = () => {
      const cw = wrap.clientWidth
      if (cw < 40) return
      const ch = Math.round(cw * 0.75)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w.W = cw
      w.H = ch
      cv.width = Math.round(cw * dpr)
      cv.height = Math.round(ch * dpr)
      cv.style.height = `${ch}px`
      bg = document.createElement('canvas')
      bg.width = cv.width
      bg.height = cv.height
      const bctx = bg.getContext('2d')
      if (bctx) {
        bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        drawBackdrop(bctx, cw, ch)
      }
    }
    resize()
    startRound(w, 1) // fioles de démonstration derrière l'écran d'accueil

    /* ----- entrées pointeur ----- */
    const rectPos = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onDown = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return
      const p = rectPos(e)
      const a = anchor()
      const grab = Math.max(85, w.H * 0.26)
      if (w.pill.state === 'ready' && Math.hypot(p.x - a.x, p.y - a.y) < grab) {
        w.pill.state = 'aiming'
        w.aim = p
        cv.setPointerCapture(e.pointerId)
      }
    }
    const onMove = (e: PointerEvent) => {
      if (w.pill.state !== 'aiming') return
      w.aim = rectPos(e)
    }
    const pullVec = () => {
      const a = anchor()
      let dx = w.aim.x - a.x
      let dy = w.aim.y - a.y
      const len = Math.hypot(dx, dy)
      const maxPull = w.H * 0.55
      if (len > maxPull) {
        dx *= maxPull / len
        dy *= maxPull / len
      }
      return { dx, dy }
    }
    const onUp = () => {
      if (w.pill.state !== 'aiming') return
      const a = anchor()
      const { dx, dy } = pullVec()
      if (Math.hypot(dx, dy) < 14) {
        w.pill.state = 'ready'
        return
      }
      const px = a.x + dx
      const py = a.y + dy
      let vx = (a.x - px) * 3.2
      let vy = (a.y - py) * 3.2
      const cap = w.H * 2.35
      const v = Math.hypot(vx, vy)
      if (v > cap) {
        vx *= cap / v
        vy *= cap / v
      }
      w.pill.x = px
      w.pill.y = py
      w.pill.vx = vx
      w.pill.vy = vy
      w.pill.rot = Math.atan2(vy, vx)
      w.pill.vr = 5
      w.pill.state = 'flying'
      w.pillsLeft--
      sfx.play('swish')
      w.hudDirty = true
    }
    const onCancel = () => {
      if (w.pill.state === 'aiming') w.pill.state = 'ready'
    }
    const onCtx = (e: Event) => e.preventDefault()
    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointercancel', onCancel)
    cv.addEventListener('contextmenu', onCtx)

    /* ----- pause quand l'onglet est masqué ----- */
    const onVis = () => { pausedRef.current = document.hidden }
    document.addEventListener('visibilitychange', onVis)

    /* ----- simulation ----- */
    const resolvePill = (hit: boolean) => {
      if (!hit) {
        w.streak = 0
        sfx.play('wrong', { volume: 0.3 })
      }
      w.pill.state = 'ready'
      w.hudDirty = true
      const allDead = w.jars.every((j) => !j.alive)
      if (allDead && !w.cleared) {
        w.cleared = true
        const bonus = w.pillsLeft * 150
        w.bonusGiven = bonus
        w.roundScore += bonus
        w.totalScore += bonus
        w.pops.push({
          x: w.W / 2, y: w.H * 0.45,
          text: `${L[langRef.current].cleared} +${bonus}`,
          life: 1.4, max: 1.4, color: '#b45309', size: 20,
        })
        sfx.play('win')
        setConfetti((k) => k + 1)
        w.endTimer = 1.1
      } else if (w.pillsLeft <= 0) {
        w.endTimer = 0.7
      } else {
        sfx.play('pop', { volume: 0.35 })
      }
    }

    const update = (dt: number) => {
      for (let i = 0; i < 3; i++) w.shelfWob[i] *= Math.exp(-5 * dt)
      for (const j of w.jars) if (!j.alive && j.fade > 0) j.fade -= dt

      if (phaseRef.current === 'playing' && w.pill.state === 'flying') {
        const p = w.pill
        p.vy += gravity() * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.vr * dt
        // collision fiole
        let hitJar: Jar | null = null
        for (const j of w.jars) {
          if (!j.alive) continue
          const jx = jarX(j)
          const jy = shelfY(j.rowIdx) - j.h / 2 - 5
          if (Math.abs(p.x - jx) < j.w / 2 + 9 && Math.abs(p.y - jy) < j.h / 2 + 9) {
            hitJar = j
            break
          }
        }
        if (hitJar) {
          const j = hitJar
          j.alive = false
          j.fade = 0.45
          w.shelfWob[j.rowIdx] = 1
          w.streak++
          w.maxStreakRound = Math.max(w.maxStreakRound, w.streak)
          w.maxStreakSession = Math.max(w.maxStreakSession, w.streak)
          const pts = 100 + (w.streak - 1) * 50
          w.roundScore += pts
          w.totalScore += pts
          w.roundHits++
          sfx.play('coin')
          const jx = jarX(j)
          const jy = shelfY(j.rowIdx) - j.h / 2 - 5
          const colors = ['#f6e3c2', '#e8b56b', '#d98a4f', '#e2725b']
          if (!reduceRef.current) {
            for (let i = 0; i < 16; i++) {
              const ang = Math.random() * Math.PI * 2
              const sp = 90 + Math.random() * 230
              w.shards.push({
                x: jx, y: jy,
                vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 130,
                life: 0.45 + Math.random() * 0.35, max: 0.8,
                size: 2.5 + Math.random() * 3.5,
                color: colors[i % colors.length],
              })
            }
          }
          w.pops.push({
            x: jx, y: jy - 14,
            text: `+${pts}${w.streak >= 3 ? ` ×${w.streak}` : ''}`,
            life: 0.9, max: 0.9,
            color: w.streak >= 3 ? '#b45309' : '#7c4a1e',
            size: w.streak >= 3 ? 19 : 16,
          })
          if (w.streak >= 8) unlockBadge('toss-combo-8')
          w.hudDirty = true
          resolvePill(true)
        } else if (p.y > w.H + 60 || p.x < -90 || p.x > w.W + 90) {
          resolvePill(false)
        }
      }

      for (let i = w.shards.length - 1; i >= 0; i--) {
        const s = w.shards[i]
        s.vy += 950 * dt
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.life -= dt
        if (s.life <= 0) w.shards.splice(i, 1)
      }
      for (let i = w.pops.length - 1; i >= 0; i--) {
        const p = w.pops[i]
        p.y -= 34 * dt
        p.life -= dt
        if (p.life <= 0) w.pops.splice(i, 1)
      }
      if (w.endTimer > 0) {
        w.endTimer -= dt
        if (w.endTimer <= 0) {
          w.endTimer = 0
          finishRound()
        }
      }
    }

    /* ----- rendu ----- */
    const draw = () => {
      const W = w.W, H = w.H
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      if (bg) ctx.drawImage(bg, 0, 0, W, H)

      // Étagères
      for (let r = 0; r < w.rows; r++) {
        drawShelf(ctx, shelfY(r) + Math.sin(w.t * 26) * 3 * w.shelfWob[r], W)
      }
      // Fioles
      for (const j of w.jars) {
        if (!j.alive && j.fade <= 0) continue
        const x = jarX(j)
        const y = shelfY(j.rowIdx) - j.h / 2 - 5
        drawJar(ctx, x, y, j, j.alive ? 1 : clamp(j.fade / 0.45, 0, 1))
      }

      // Lance-pierre
      const a = anchor()
      ctx.fillStyle = '#84552e'
      rr(ctx, a.x - 17, a.y + 8, 34, 10, 4)
      ctx.fill()
      rr(ctx, a.x - 4, a.y - 4, 8, 14, 3)
      ctx.fill()
      ctx.strokeStyle = '#84552e'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(a.x - 3, a.y - 4)
      ctx.lineTo(a.x - 12, a.y - 22)
      ctx.moveTo(a.x + 3, a.y - 4)
      ctx.lineTo(a.x + 12, a.y - 22)
      ctx.stroke()

      // Visée / pilule
      if (w.pill.state === 'aiming') {
        const { dx, dy } = pullVec()
        const px = a.x + dx
        const py = a.y + dy
        // élastiques
        ctx.strokeStyle = '#5f3d1e'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(a.x - 12, a.y - 22)
        ctx.lineTo(px, py)
        ctx.lineTo(a.x + 12, a.y - 22)
        ctx.stroke()
        // trajectoire prévue
        const g = gravity()
        let vx = (a.x - px) * 3.2
        let vy = (a.y - py) * 3.2
        const cap = H * 2.35
        const v = Math.hypot(vx, vy)
        if (v > cap) {
          vx *= cap / v
          vy *= cap / v
        }
        ctx.fillStyle = '#fff8ec'
        for (let i = 1; i <= 9; i++) {
          const t = i * 0.075
          const tx = px + vx * t
          const ty = py + vy * t + 0.5 * g * t * t
          if (ty > H - 8 || tx < 4 || tx > W - 4) break
          ctx.globalAlpha = 0.85 * (1 - i / 10)
          ctx.beginPath()
          ctx.arc(tx, ty, Math.max(2, 4 - i * 0.18), 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        drawPill(ctx, px, py, Math.atan2(a.y - py, a.x - px))
      } else if (w.pill.state === 'ready') {
        drawPill(ctx, a.x, a.y, -0.5)
      } else {
        drawPill(ctx, w.pill.x, w.pill.y, w.pill.rot)
      }

      // Éclats de verre
      for (const s of w.shards) {
        ctx.globalAlpha = clamp(s.life / s.max, 0, 1)
        ctx.fillStyle = s.color
        ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size)
      }
      ctx.globalAlpha = 1

      // Textes flottants
      for (const p of w.pops) {
        ctx.globalAlpha = clamp(p.life / p.max, 0, 1)
        ctx.fillStyle = p.color
        ctx.font = `800 ${p.size}px "Nunito", system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.text, p.x, p.y)
      }
      ctx.globalAlpha = 1
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
      if (w.hudDirty) {
        w.hudDirty = false
        pushHud()
      }
    }
    rafRef.current = requestAnimationFrame(step)

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      cv.removeEventListener('pointerdown', onDown)
      cv.removeEventListener('pointermove', onMove)
      cv.removeEventListener('pointerup', onUp)
      cv.removeEventListener('pointercancel', onCancel)
      cv.removeEventListener('contextmenu', onCtx)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [finishRound, pushHud, unlockBadge])

  /* ================= Rendu React ================= */
  return (
    <div className="relative select-none">
      <Confetti fire={confetti} count={reduce ? 0 : 90} />

      {/* Barre d'état */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {phase === 'playing' ? (
          <>
            <StatChip icon="🎯" label={T.round} value={hud.round} />
            <StatChip icon="⭐" label={T.score} value={hud.score} />
            {hud.streak >= 2 ? <StatChip icon="🔥" label={T.streak} value={`×${hud.streak}`} /> : null}
            <div className="flex h-11 items-center gap-2 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold" aria-label={T.pills}>
              <span className="text-muted-foreground">{T.pills}</span>
              <span className="flex gap-1" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={cn('h-2 w-2 rounded-full', i < hud.pills ? 'bg-rose-500' : 'bg-foreground/15')} />
                ))}
              </span>
            </div>
          </>
        ) : (
          <>
            {hydrated && bestScore > 0 ? <StatChip icon="⭐" label={`${T.score} — ${T.best}`} value={bestScore} /> : null}
            {hydrated && bestCombo > 0 ? <StatChip icon="🔥" label={`${T.streak} — ${T.best}`} value={`×${bestCombo}`} /> : null}
          </>
        )}
      </div>

      {/* Canvas + habillage */}
      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-2xl border shadow-inner">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none"
          style={{ touchAction: 'none' }}
          aria-label="Pill Toss"
        />

        {/* Mention permanente : pilules fictives */}
        <span className="absolute bottom-2 right-2 z-10 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold text-stone-600 shadow-sm backdrop-blur-sm dark:bg-stone-800/80 dark:text-stone-300">
          💊 {T.disclaimer}
        </span>

        {/* Écran d'accueil */}
        {phase === 'idle' ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-stone-900/45 p-6 text-center backdrop-blur-[2px]">
            <div className="flex gap-2" aria-hidden="true">
              {['💊', '✨', '🎯'].map((e, i) => (
                <span key={i} className="text-4xl anim-floaty" style={{ animationDelay: `${i * 0.4}s` }}>{e}</span>
              ))}
            </div>
            <h3 className="font-display text-2xl font-extrabold text-white drop-shadow">{T.aimTitle}</h3>
            <p className="max-w-sm text-sm text-stone-100">{content.tagline[lang]}</p>
            <p className="max-w-xs rounded-xl bg-white/15 px-3 py-2 text-xs text-stone-100">{T.hint}</p>
            <Button size="lg" className="h-12 rounded-full px-7 text-base anim-glow" onClick={handleStart}>
              <Play className="h-5 w-5" aria-hidden="true" /> {T.play}
            </Button>
          </div>
        ) : null}

        {/* Résumé de manche */}
        {phase === 'roundEnd' && summary ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-[2px]">
            <div className="anim-rise w-full max-w-sm rounded-2xl border bg-card p-5 text-center shadow-xl">
              <p className="font-display text-xl font-extrabold text-primary">
                🎉 {T.roundOver.replace('{n}', String(summary.round))}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-secondary/70 p-2">
                  <p className="text-lg font-extrabold tabular-nums">{summary.hits}/{summary.used}</p>
                  <p className="text-[11px] text-muted-foreground">{T.hits}</p>
                </div>
                <div className="rounded-xl bg-secondary/70 p-2">
                  <p className="text-lg font-extrabold tabular-nums">{summary.acc}%</p>
                  <p className="text-[11px] text-muted-foreground">{T.accuracy}</p>
                </div>
                <div className="rounded-xl bg-secondary/70 p-2">
                  <p className="text-lg font-extrabold tabular-nums">{summary.roundScore}</p>
                  <p className="text-[11px] text-muted-foreground">{T.roundScore}</p>
                </div>
              </div>
              {summary.bonus > 0 ? (
                <p className="mt-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  ✨ {T.bonus} : +{summary.bonus}
                </p>
              ) : null}
              <p className="mt-2 text-sm text-muted-foreground">{T.total} : <span className="font-extrabold tabular-nums text-foreground">{summary.total}</span></p>
              {summary.isRecord ? (
                <p className="mt-1 text-sm font-bold text-amber-600 dark:text-amber-400">🏆 {T.newBest}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button size="lg" className="h-12 rounded-full px-6" onClick={handleNext}>
                  <SkipForward className="h-5 w-5" aria-hidden="true" /> {T.next}
                </Button>
                <Button size="lg" variant="secondary" className="h-12 rounded-full px-6" onClick={() => { sfx.play('click'); setPhase('done') }}>
                  <Square className="h-4 w-4" aria-hidden="true" /> {T.end}
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Fin de session */}
        {phase === 'done' && summary ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-900/55 p-4 backdrop-blur-[2px]">
            <div className="anim-rise w-full max-w-sm rounded-2xl border bg-card p-6 text-center shadow-xl">
              <p className="font-display text-2xl font-extrabold">🏁 {T.sessionOver}</p>
              <p className="mt-3 text-4xl font-extrabold tabular-nums text-primary">{summary.total}</p>
              <p className="text-xs text-muted-foreground">{T.total}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {T.bestStreak} : <span className="font-bold tabular-nums text-foreground">×{summary.bestStreak}</span>
              </p>
              <div className="mt-4 flex justify-center">
                <Button size="lg" className="h-12 rounded-full px-7" onClick={handleStart}>
                  <RotateCcw className="h-5 w-5" aria-hidden="true" /> {T.again}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
