'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, SkipForward, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore } from '@/lib/progress/store'
import { useHydrated, useReducedMotion, clamp } from '@/lib/utils-game'
import { computeIq } from '@/lib/games/iq'
import type { GameSEOContent } from '@/lib/games/types'
import { pillTossSeoContent } from './data/pill-toss-seo'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'
import { IqChallengeBanner } from '@/components/game/iq-banner'
import { useJuice, FxCellBurst } from '@/components/game/fx'

export const gameId = 'pill-toss'

/* ================= Contenu SEO bilingue ================= */
/* Task 27 : objet déplacé en données pures dans ./data/pill-toss-seo.ts —
 * double-usage serveur/client (HTML brut des pages jeu réelles), source unique. */
export const content: GameSEOContent = pillTossSeoContent

/* ================= Textes UI ================= */
const L = {
  fr: {
    play: 'Jouer', next: 'Manche suivante', end: 'Terminer la session', restart: 'Recommencer la session',
    round: 'Manche', score: 'Score', streak: 'Série', pillsLeft: 'Pilules restantes',
    roundOver: 'Manche {n} terminée', hits: 'Touchés', accuracy: 'Précision',
    roundScore: 'Score de la manche', total: 'Total de la session', bonus: 'Bonus pilules restantes',
    cleared: 'Étagères nettoyées !', disclaimer: 'Pilules fictives — jeu uniquement',
    hint: 'Maintenez près de la pilule, tirez vers l’arrière, puis relâchez.',
    newBest: 'Nouveau record !', sessionOver: 'Session terminée',
    bestStreak: 'Meilleure série', again: 'Nouvelle session', aimTitle: 'Visez les fioles !',
    canvasLabel: 'Aire de jeu Pill Toss : tirez la pilule vers l’arrière pour viser, relâchez pour lancer',
    bestScoreLabel: 'Meilleur score', bestStreakLabel: 'Meilleure série',
    shareCleared: 'Manche nettoyée · {n} lancers',
    shareMissed: '{hits} fioles touchées · {n} lancers',
    shareSession: 'Session : {score} pts · série ×{streak}',
  },
  en: {
    play: 'Play', next: 'Next round', end: 'End session', restart: 'Restart session',
    round: 'Round', score: 'Score', streak: 'Streak', pillsLeft: 'Pills left',
    roundOver: 'Round {n} complete', hits: 'Hits', accuracy: 'Accuracy',
    roundScore: 'Round score', total: 'Session total', bonus: 'Unused-pill bonus',
    cleared: 'Shelves cleared!', disclaimer: 'Fictional pills — game only',
    hint: 'Press near the pill, drag backwards, then release.',
    newBest: 'New record!', sessionOver: 'Session over',
    bestStreak: 'Best streak', again: 'New session', aimTitle: 'Aim for the jars!',
    canvasLabel: 'Pill Toss play area: drag the pill backwards to aim, release to throw',
    bestScoreLabel: 'Best score', bestStreakLabel: 'Best streak',
    shareCleared: 'Round cleared · {n} throws',
    shareMissed: '{hits} jars hit · {n} throws',
    shareSession: 'Session: {score} pts · streak ×{streak}',
  },
} as const

/* ================= Monde ================= */
interface Jar {
  rowIdx: number
  x: number
  vx: number
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
  pillAcc: number
  aim: { x: number; y: number }
  pillsLeft: number
  streak: number
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

/** Pas fixe d'intégration du projectile (120 Hz) : la trajectoire prévue
 *  et le vol réel utilisent exactement les mêmes pas, quel que soit l'écran. */
const STEP = 1 / 120

/** Taille des fioles relative au canevas (même difficulté sur mobile et desktop). */
function jarWidthFor(W: number, H: number, round: number): number {
  const s = Math.min(W, H * 1.45)
  return clamp(s * (0.205 - (round - 1) * 0.012), 30, 118)
}
function jarHeightFor(jw: number, H: number, rows: number): number {
  // Une seule étagère : fioles hautes autorisées ; plusieurs : plafonné pour
  // que les rangées voisines ne se touchent jamais.
  const capY = rows <= 1 ? H * 0.26 : H * 0.175
  return Math.max(Math.min(jw * 1.3, capY), 20)
}

function makeWorld(): World {
  return {
    W: 320, H: 240, t: 0,
    round: 1, rows: 1,
    jars: [], shelfWob: [0, 0, 0],
    pill: { x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, state: 'ready' },
    pillAcc: 0,
    aim: { x: 0, y: 0 },
    pillsLeft: 10, streak: 0, maxStreakSession: 0,
    roundScore: 0, roundHits: 0, bonusGiven: 0, totalScore: 0,
    shards: [], pops: [], endTimer: 0, cleared: false, hudDirty: false,
  }
}

function startRound(w: World, round: number) {
  w.round = round
  w.rows = Math.min(1 + Math.floor((round - 1) / 2), 3)
  const perRow = Math.min(2 + Math.ceil(round / 2), 4)
  // Jamais plus de 10 fioles : rester « nettoyable » avec les 10 pilules réglementaires.
  const total = Math.min(w.rows * perRow, 10)
  const base = Math.floor(total / w.rows)
  const extra = total % w.rows
  const jw = jarWidthFor(w.W, w.H, round)
  const jh = jarHeightFor(jw, w.H, w.rows)
  const baseSpd = 34 + round * 8
  w.jars = []
  for (let r = 0; r < w.rows; r++) {
    const count = base + (r < extra ? 1 : 0)
    const lane = Math.max(w.W - jw - 24, 10) / count
    for (let i = 0; i < count; i++) {
      const mult = 0.88 + 0.12 * ((r * 2 + i) % 3)
      w.jars.push({
        rowIdx: r,
        x: 12 + jw / 2 + lane * (i + 0.5),
        vx: ((r + i) % 2 === 0 ? 1 : -1) * Math.min(baseSpd * mult, 170),
        w: jw, h: jh,
        alive: true, fade: 0,
        glass: (r + i) % 3,
      })
    }
  }
  w.shelfWob = [0, 0, 0]
  w.pill = { x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, state: 'ready' }
  w.pillAcc = 0
  w.pillsLeft = 10
  w.streak = 0
  w.roundScore = 0
  w.roundHits = 0
  w.bonusGiven = 0
  w.shards = []
  w.pops = []
  w.endTimer = 0
  w.cleared = false
  w.hudDirty = true
}

/** Haptique légère, sans effet sur les appareils sans vibreur. */
function buzz(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* no-op */
  }
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

function drawShelf(ctx: CanvasRenderingContext2D, y: number, W: number, H: number) {
  const th = clamp(H * 0.028, 8, 14)
  const grad = ctx.createLinearGradient(0, y, 0, y + th)
  grad.addColorStop(0, '#b07a48')
  grad.addColorStop(1, '#84552e')
  ctx.fillStyle = grad
  rr(ctx, 6, y, W - 12, th, 3)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,240,214,0.35)'
  ctx.fillRect(10, y + 1.5, W - 20, 1.5)
  // Équerres
  ctx.fillStyle = 'rgba(90,58,30,0.55)'
  for (let i = 0; i < 3; i++) {
    const bx = 26 + (i * (W - 52)) / 2
    ctx.beginPath()
    ctx.moveTo(bx, y + th)
    ctx.lineTo(bx + 12, y + th)
    ctx.lineTo(bx, y + th + 10)
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

function drawPill(ctx: CanvasRenderingContext2D, x: number, y: number, rot: number, hl: number) {
  const hh = hl * 0.54
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  rr(ctx, -hl, -hh, hl * 2, hh * 2, hh)
  ctx.fillStyle = '#f8f1e4'
  ctx.fill()
  ctx.save()
  rr(ctx, -hl, -hh, hl * 2, hh * 2, hh)
  ctx.clip()
  ctx.fillStyle = '#e2725b'
  ctx.fillRect(-hl, -hh, hl, hh * 2)
  ctx.restore()
  ctx.strokeStyle = '#b34d3a'
  ctx.lineWidth = Math.max(1.2, hl * 0.11)
  rr(ctx, -hl, -hh, hl * 2, hh * 2, hh)
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
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const bestScore = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-score']?.value ?? 0)
  const bestCombo = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-combo']?.value ?? 0)

  const [phase, setPhase] = useState<'idle' | 'playing' | 'roundEnd' | 'done'>('idle')
  const [hud, setHud] = useState({ score: 0, round: 1, pills: 10, streak: 0 })
  const [summary, setSummary] = useState<null | {
    round: number; hits: number; used: number; acc: number; cleared: boolean
    roundScore: number; bonus: number; total: number; isRecord: boolean; bestStreak: number; iq: number
  }>(null)
  const [confetti, setConfetti] = useState(0)
  const [burstKey, setBurstKey] = useState(0)

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worldRef = useRef<World>(makeWorld())
  const phaseRef = useRef(phase)
  const reduceRef = useRef(reduce)
  const langRef = useRef(lang)
  const rafRef = useRef(0)
  const pausedRef = useRef(false)
  const lastStartRef = useRef(0)
  const nextBtnRef = useRef<HTMLButtonElement>(null)

  /* Effets « juice » (Task 20) — helpers visuels décoratifs, sans re-render. */
  const juice = useJuice()
  const juiceRef = useRef(juice)
  /* Éclat blanc au point d'impact d'un touché (overlay DOM au-dessus du canvas). */
  const [hitFx, setHitFx] = useState<{ key: number; x: number; y: number } | null>(null)

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { reduceRef.current = reduce }, [reduce])
  useEffect(() => { langRef.current = lang }, [lang])
  useEffect(() => { juiceRef.current = juice }, [juice])

  /* Focus clavier sur « Manche suivante » dès le résumé de fin de manche. */
  useEffect(() => {
    if (phase === 'roundEnd') nextBtnRef.current?.focus({ preventScroll: true })
  }, [phase])

  const pushHud = useCallback(() => {
    const w = worldRef.current
    setHud({ score: w.totalScore, round: w.round, pills: w.pillsLeft, streak: w.streak })
  }, [])

  /* ---------- fin de manche (appelée depuis la boucle, jamais depuis un effet) ---------- */
  const finishRound = useCallback(() => {
    const w = worldRef.current
    const used = Math.max(0, 10 - w.pillsLeft)
    const acc = used > 0 ? Math.round((w.roundHits / used) * 100) : 0
    /* QI estimé (Task 18) : précision = touchés/lancers (la « Précision » du
     * résumé), clampée [0,15 ; 1]. Pas de chrono : rapidité omise ;
     * difficulté 2 (manches standard du lance-pierre). */
    const iq = computeIq(gameId, { accuracy: clamp(w.roundHits / Math.max(used, 1), 0.15, 1), difficulty: 2 })
    // Les deux records sont évalués séparément (l'un ne doit pas masquer l'autre).
    const recScore = w.totalScore > 0 && setBest(gameId, 'best-score', w.totalScore)
    const recCombo = w.maxStreakSession > 0 && setBest(gameId, 'best-combo', w.maxStreakSession)
    const isRecord = Boolean(recScore || recCombo)
    if (w.roundScore >= 3000) unlockBadge('toss-score-30')
    if (w.cleared) {
      addWin(gameId)
      addXp(14 + w.roundHits * 4)
      addGameXp(gameId, 22)
      setBurstKey((k) => k + 1)
      sfx.play('levelup')
    } else {
      addXp(6 + w.roundHits * 4)
      addGameXp(gameId, 10)
      sfx.play('lose', { volume: 0.45 })
    }
    if (isRecord) setConfetti((k) => k + 1)
    setSummary({
      round: w.round, hits: w.roundHits, used, acc, cleared: w.cleared,
      roundScore: w.roundScore, bonus: w.bonusGiven, total: w.totalScore, isRecord,
      bestStreak: w.maxStreakSession, iq,
    })
    setPhase('roundEnd')
  }, [addWin, addXp, addGameXp, setBest, unlockBadge])

  /* ---------- démarrage ---------- */
  /* Garde anti double-clic (double addPlay, saut de manche sur « Manche
   * suivante », Entrée maintenue sur un bouton autofocalisé). */
  const startGate = () => {
    const now = Date.now()
    if (now - lastStartRef.current < 350) return false
    lastStartRef.current = now
    return true
  }
  const handleStart = useCallback(() => {
    if (!startGate()) return
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
    if (!startGate()) return
    sfx.play('click')
    const w = worldRef.current
    startRound(w, w.round + 1)
    setSummary(null)
    setPhase('playing')
    pushHud()
  }, [pushHud])

  const handleRestart = useCallback(() => {
    if (!startGate()) return
    sfx.play('click')
    const w = worldRef.current
    w.totalScore = 0
    w.maxStreakSession = 0
    startRound(w, 1)
    setSummary(null)
    setPhase('playing')
    pushHud()
  }, [pushHud])

  const handleEnd = useCallback(() => {
    sfx.play('click')
    setPhase('done')
  }, [])

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
    let aimId = -1

    const pillHL = () => clamp(Math.min(w.W, w.H * 1.45) * 0.037, 10, 15)
    // Lance-pierre centré en bas : toute la puissance est atteignable EN
    // RESTANT dans le canevas (traction vers le bas / bas-gauche / bas-droite).
    const anchor = () => ({ x: w.W * 0.5, y: w.H * 0.72 })
    const gravity = () => w.H * 3.2
    const shelfY = (r: number) => {
      if (w.rows === 1) return 0.34 * w.H
      if (w.rows === 2) return (0.26 + r * 0.32) * w.H
      return (0.22 + r * 0.19) * w.H
    }
    const jarCY = (j: Jar) => shelfY(j.rowIdx) - j.h / 2 - 5

    const resize = () => {
      const cw = wrap.clientWidth
      const ch = wrap.clientHeight
      if (cw < 40 || ch < 40) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w.W = cw
      w.H = ch
      cv.width = Math.round(cw * dpr)
      cv.height = Math.round(ch * dpr)
      // Les fioles vivantes suivent la nouvelle géométrie (rotation, redimensionnement).
      const jw = jarWidthFor(cw, ch, w.round)
      const jh = jarHeightFor(jw, ch, w.rows)
      for (const j of w.jars) {
        j.w = jw
        j.h = jh
        j.x = clamp(j.x, 12 + jw / 2, Math.max(cw - 12 - jw / 2, 12 + jw / 2))
      }
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

    /* ----- entrées pointeur (un seul doigt ne pilote la visée) ----- */
    const rectPos = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onDown = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return
      if (e.button !== 0) return
      if (w.pill.state !== 'ready' || w.pillsLeft <= 0 || w.endTimer > 0) return
      const p = rectPos(e)
      const a = anchor()
      const grab = Math.max(100, w.H * 0.3)
      if (Math.hypot(p.x - a.x, p.y - a.y) < grab) {
        w.pill.state = 'aiming'
        w.aim = { x: clamp(p.x, 4, w.W - 4), y: clamp(p.y, 4, w.H - 4) }
        aimId = e.pointerId
        try {
          cv.setPointerCapture(e.pointerId)
        } catch {
          /* capture best-effort */
        }
      }
    }
    const onMove = (e: PointerEvent) => {
      if (w.pill.state !== 'aiming' || e.pointerId !== aimId) return
      const p = rectPos(e)
      w.aim = { x: clamp(p.x, 4, w.W - 4), y: clamp(p.y, 4, w.H - 4) }
    }
    const pullVec = () => {
      const a = anchor()
      let dx = w.aim.x - a.x
      let dy = w.aim.y - a.y
      const len = Math.hypot(dx, dy)
      const maxPull = w.H * 0.3
      if (len > maxPull) {
        dx *= maxPull / len
        dy *= maxPull / len
      }
      return { dx, dy }
    }
    const launchVec = (px: number, py: number) => {
      const a = anchor()
      return { vx: (a.x - px) * 9, vy: (a.y - py) * 9 }
    }
    const onUp = (e: PointerEvent) => {
      if (w.pill.state !== 'aiming' || e.pointerId !== aimId) return
      aimId = -1
      const a = anchor()
      const { dx, dy } = pullVec()
      if (Math.hypot(dx, dy) < 14) {
        w.pill.state = 'ready'
        return
      }
      const px = a.x + dx
      const py = a.y + dy
      const { vx, vy } = launchVec(px, py)
      w.pill.x = px
      w.pill.y = py
      w.pill.vx = vx
      w.pill.vy = vy
      w.pill.rot = Math.atan2(vy, vx)
      w.pill.vr = 5
      w.pill.state = 'flying'
      w.pillAcc = 0
      w.pillsLeft--
      sfx.play('swish')
      buzz(10)
      w.hudDirty = true
    }
    const cancelAim = (e: PointerEvent) => {
      if (e.pointerId !== aimId) return
      aimId = -1
      if (w.pill.state === 'aiming') w.pill.state = 'ready'
    }
    const onCtx = (e: Event) => e.preventDefault()
    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointercancel', cancelAim)
    cv.addEventListener('lostpointercapture', cancelAim)
    cv.addEventListener('contextmenu', onCtx)

    /* ----- pause quand l'onglet est masqué ----- */
    const onVis = () => { pausedRef.current = document.hidden }
    document.addEventListener('visibilitychange', onVis)

    /* ----- résolution d'un lancer ----- */
    const resolvePill = (hit: boolean) => {
      if (!hit) {
        w.streak = 0
        sfx.play('wrong', { volume: 0.3 })
      }
      w.pill.state = 'ready'
      w.hudDirty = true
      if (w.jars.every((j) => !j.alive)) {
        if (!w.cleared) {
          w.cleared = true
          const bonus = w.pillsLeft * 150
          w.bonusGiven = bonus
          w.roundScore += bonus
          w.totalScore += bonus
          w.pops.push({
            x: w.W / 2, y: w.H * 0.42,
            text: `${L[langRef.current].cleared} +${bonus}`,
            life: 1.4, max: 1.4, color: '#b45309', size: 20,
          })
          sfx.play('win')
          buzz(20)
          setConfetti((k) => k + 1)
          w.endTimer = 1.15
        }
      } else if (w.pillsLeft <= 0) {
        w.endTimer = 0.7
      } else if (hit) {
        // pilule suivante prête (uniquement après un touché — un raté a déjà
        // son feedback « wrong »)
        sfx.play('pop', { volume: 0.35 })
      }
    }

    /* ----- simulation ----- */
    /** Fioles : glissement physique avec rebond sur les bords et échange de
     *  vitesses au contact (choc élastique 1D) — elles ne se traversent jamais. */
    const moveJars = (dt: number) => {
      for (let r = 0; r < w.rows; r++) {
        const row: Jar[] = []
        for (const j of w.jars) if (j.alive && j.rowIdx === r) row.push(j)
        if (row.length === 0) continue
        for (const j of row) {
          j.x += j.vx * dt
          const xMin = 12 + j.w / 2
          const xMax = Math.max(w.W - 12 - j.w / 2, xMin)
          if (j.x < xMin) {
            j.x = xMin
            j.vx = Math.abs(j.vx)
          } else if (j.x > xMax) {
            j.x = xMax
            j.vx = -Math.abs(j.vx)
          }
        }
        row.sort((p, q) => p.x - q.x)
        for (let i = 0; i < row.length - 1; i++) {
          const p = row[i]
          const q = row[i + 1]
          const minGap = (p.w + q.w) / 2 + 2
          if (q.x - p.x < minGap && p.vx > q.vx) {
            const tv = p.vx
            p.vx = q.vx
            q.vx = tv
          }
        }
      }
    }

    /* ----- projectile : un pas fixe d'intégration (retourne true si résolu) ----- */
    const integrate = () => {
      const p = w.pill
      p.vy += gravity() * STEP
      p.x += p.vx * STEP
      p.y += p.vy * STEP
      p.rot += p.vr * STEP
      const hl = pillHL()
      for (const j of w.jars) {
        if (!j.alive) continue
        const jx = j.x
        const jy = jarCY(j)
        if (Math.abs(p.x - jx) < j.w / 2 + hl && Math.abs(p.y - jy) < j.h / 2 + hl * 0.75) {
          j.alive = false
          j.fade = 0.45
          w.shelfWob[j.rowIdx] = 1
          w.streak++
          w.maxStreakSession = Math.max(w.maxStreakSession, w.streak)
          const pts = 100 + (w.streak - 1) * 50
          w.roundScore += pts
          w.totalScore += pts
          w.roundHits++
          sfx.play('coin')
          buzz(10)
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
          // Effets « juice » (Task 20) : micro-pulse du plateau + éclat blanc
          // positionné à l'impact (jx/jy en px CSS = % exact du conteneur).
          juiceRef.current.pulse(wrap, 1.012, 240)
          if (!reduceRef.current) setHitFx({ key: Date.now(), x: jx / w.W, y: jy / w.H })
          if (w.streak >= 8) unlockBadge('toss-combo-8')
          w.hudDirty = true
          resolvePill(true)
          return true
        }
      }
      if (p.y > w.H + 60 || p.x < -90 || p.x > w.W + 90) {
        resolvePill(false)
        return true
      }
      return false
    }

    const update = (dt: number) => {
      moveJars(dt)
      for (let i = 0; i < 3; i++) w.shelfWob[i] *= Math.exp(-5 * dt)
      for (const j of w.jars) if (!j.alive && j.fade > 0) j.fade -= dt

      if (phaseRef.current === 'playing' && w.pill.state === 'flying') {
        w.pillAcc += dt
        let guard = 0
        while (w.pillAcc >= STEP && w.pill.state === 'flying' && guard < 24) {
          w.pillAcc -= STEP
          guard++
          if (integrate()) break
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
      const hl = pillHL()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      if (bg) ctx.drawImage(bg, 0, 0, W, H)

      // Étagères
      for (let r = 0; r < w.rows; r++) {
        drawShelf(ctx, shelfY(r) + Math.sin(w.t * 26) * 3 * w.shelfWob[r], W, H)
      }
      // Fioles
      for (const j of w.jars) {
        if (!j.alive && j.fade <= 0) continue
        drawJar(ctx, j.x, jarCY(j), j, j.alive ? 1 : clamp(j.fade / 0.45, 0, 1))
      }

      // Lance-pierre (socle + pied jusqu'au sol)
      const a = anchor()
      const fw = hl
      const fh = hl * 1.8
      const restY = a.y - fh
      ctx.fillStyle = '#84552e'
      const postTop = a.y + hl * 1.4
      ctx.fillRect(a.x - hl * 0.18, postTop, hl * 0.36, Math.max(0, H - 14 - postTop))
      rr(ctx, a.x - hl * 1.35, a.y + hl * 0.55, hl * 2.7, hl * 0.85, hl * 0.3)
      ctx.fill()
      rr(ctx, a.x - hl * 0.3, a.y - hl * 0.35, hl * 0.6, hl * 1.15, hl * 0.22)
      ctx.fill()
      ctx.strokeStyle = '#84552e'
      ctx.lineWidth = Math.max(3, hl * 0.28)
      ctx.beginPath()
      ctx.moveTo(a.x - hl * 0.24, a.y - hl * 0.3)
      ctx.lineTo(a.x - fw, restY)
      ctx.moveTo(a.x + hl * 0.24, a.y - hl * 0.3)
      ctx.lineTo(a.x + fw, restY)
      ctx.stroke()

      // Visée / pilule
      if (w.pill.state === 'aiming') {
        const { dx, dy } = pullVec()
        const px = a.x + dx
        const py = a.y + dy
        // élastiques tendus
        ctx.strokeStyle = '#5f3d1e'
        ctx.lineWidth = Math.max(2.5, hl * 0.22)
        ctx.beginPath()
        ctx.moveTo(a.x - fw, restY)
        ctx.lineTo(px, py)
        ctx.lineTo(a.x + fw, restY)
        ctx.stroke()
        // trajectoire prévue — même intégration pas-à-pas que le vol réel
        const { vx, vy } = launchVec(px, py)
        const g = gravity()
        let tx = px, ty = py, tvy = vy
        let dots = 0
        for (let i = 1; i <= 240 && dots < 16; i++) {
          tvy += g * STEP
          tx += vx * STEP
          ty += tvy * STEP
          if (ty > H - 6 || tx < 4 || tx > W - 4) break
          if (i % 8 === 0) {
            dots++
            const k = 1 - dots / 17
            ctx.globalAlpha = 0.9 * k
            ctx.fillStyle = '#fff8ec'
            ctx.beginPath()
            ctx.arc(tx, ty, Math.max(1.6, hl * 0.34 * k), 0, Math.PI * 2)
            ctx.fill()
          }
        }
        ctx.globalAlpha = 1
        drawPill(ctx, px, py, Math.atan2(a.y - py, a.x - px), hl)
      } else if (w.pill.state === 'ready') {
        // bande détendue
        ctx.strokeStyle = 'rgba(95,61,30,0.5)'
        ctx.lineWidth = Math.max(2, hl * 0.18)
        ctx.beginPath()
        ctx.moveTo(a.x - fw, restY)
        ctx.lineTo(a.x + fw, restY)
        ctx.stroke()
        // halo de préhension (invitation au geste)
        if (phaseRef.current === 'playing' && w.pillsLeft > 0 && w.endTimer <= 0) {
          const rad = hl + 9 + (reduceRef.current ? 0 : Math.sin(w.t * 2.6) * 2.5)
          ctx.strokeStyle = 'rgba(255,248,236,0.65)'
          ctx.lineWidth = 2
          ctx.setLineDash([4, 5])
          ctx.beginPath()
          ctx.arc(a.x, restY, rad, 0, Math.PI * 2)
          ctx.stroke()
          ctx.setLineDash([])
        }
        drawPill(ctx, a.x, restY, -0.5, hl)
      } else {
        drawPill(ctx, w.pill.x, w.pill.y, w.pill.rot, hl)
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
      cv.removeEventListener('pointercancel', cancelAim)
      cv.removeEventListener('lostpointercapture', cancelAim)
      cv.removeEventListener('contextmenu', onCtx)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [finishRound, pushHud, unlockBadge])

  /* ================= Rendu React ================= */
  return (
    <div className="relative select-none touch-manipulation my-auto w-full flex h-[var(--board-h,auto)] flex-col justify-center">
      <Confetti fire={confetti} count={reduce ? 0 : 90} waves={2} gold />
      <VictoryBurst fire={burstKey} stars={summary ? (summary.acc >= 80 ? 3 : summary.acc >= 50 ? 2 : 1) : 3} />

      {/* HUD compact sur une seule ligne (caché à l'accueil : le bouton Jouer
          arrive plus tôt à l'écran, sans le moindre scroll). */}
      {phase !== 'idle' ? (
        <div className="mb-1.5 flex h-9 shrink-0 flex-wrap items-center gap-1.5 text-xs font-bold">
          <div className="flex h-8 items-center gap-1 rounded-full bg-secondary/70 px-2" title={T.round}>
            <span aria-hidden="true">🎯</span>
            <span className="tabular-nums">{hud.round}</span>
          </div>
          <div className="flex h-8 items-center gap-1 rounded-full bg-secondary/70 px-2" title={T.score}>
            <span aria-hidden="true">⭐</span>
            <span key={hud.score} className={cn('tabular-nums', !reduce && 'anim-pop-in')}>
              {hud.score}
            </span>
          </div>
          {hud.streak >= 2 ? (
            <div
              className="flex h-8 items-center gap-1 rounded-full bg-amber-100 px-2 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
              title={T.streak}
            >
              <span aria-hidden="true">🔥</span>
              <span key={hud.streak} className={cn('tabular-nums', !reduce && 'anim-pop-in')}>
                ×{hud.streak}
              </span>
            </div>
          ) : null}
          <div
            className="flex h-8 items-center gap-[2px] rounded-full bg-secondary/70 px-2"
            role="img"
            aria-label={`${T.pillsLeft} : ${hud.pills}`}
            title={`${T.pillsLeft} : ${hud.pills}`}
          >
            <span className="flex items-center gap-[2px]" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className={cn('h-1.5 w-1 rounded-full', i < hud.pills ? 'bg-rose-500' : 'bg-foreground/15')}
                />
              ))}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ms-auto h-9 w-9 rounded-full p-0"
            aria-label={T.restart}
            title={T.restart}
            onClick={handleRestart}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      ) : null}

      {/* Canevas — ratio vertical (lance-pierre) plafonné au budget du chrome
          partagé (Task 9) : surface entièrement visible sans scroll ; sur
          mobile portrait elle remplit ~90 % du budget vertical disponible. */}
      <div
        ref={wrapRef}
        className="relative mx-auto aspect-[5/8] max-h-[var(--board-maxh,calc(100dvh_-_290px))] w-full max-w-[560px] overflow-hidden rounded-2xl border shadow-inner"
      >
        <canvas
          ref={canvasRef}
          role="img"
          className="block h-full w-full touch-none cursor-crosshair"
          style={{ touchAction: 'none' }}
          aria-label={T.canvasLabel}
        />

        {/* Effet « juice » (Task 20) : éclat d'impact d'un touché — rejoué par
            key, purement décoratif, ne capte jamais le pointeur. */}
        {hitFx ? (
          <div
            key={hitFx.key}
            aria-hidden="true"
            className="pointer-events-none absolute z-10 h-12 w-12"
            style={{ left: `${hitFx.x * 100}%`, top: `${hitFx.y * 100}%`, transform: 'translate(-50%, -50%)' }}
          >
            <FxCellBurst colorClass="bg-white" particles={2} size="26%" />
          </div>
        ) : null}

        {/* Mention permanente : pilules fictives (pointer-events-none : la
            zone de traction vers le bas-droite reste saisissable) */}
        <span className="pointer-events-none absolute bottom-1.5 right-2 z-10 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-stone-600 shadow-sm backdrop-blur-sm dark:bg-stone-800/80 dark:text-stone-300">
          💊 {T.disclaimer}
        </span>

        {/* Écran d'accueil — compact, bouton Jouer immédiatement visible */}
        {phase === 'idle' ? (
          <div className="absolute inset-0 z-20 flex overflow-y-auto bg-stone-900/45 p-4 backdrop-blur-[2px]">
            <div className="m-auto flex flex-col items-center gap-2.5 text-center">
              {/* Défi QI bienveillant — mis en avant dès l'ouverture (Task 19) */}
              <IqChallengeBanner gameId={gameId} />
              <div className="flex gap-2 [@media(max-height:420px)]:hidden" aria-hidden="true">
                {['💊', '🧪', '🎯'].map((e, i) => (
                  <span key={i} className={cn('text-3xl', !reduce && 'anim-floaty')} style={{ animationDelay: `${i * 0.4}s` }}>{e}</span>
                ))}
              </div>
              <h3 className="font-display text-xl font-extrabold text-white drop-shadow">{T.aimTitle}</h3>
              {hydrated && (bestScore > 0 || bestCombo > 0) ? (
                <p className="text-xs font-semibold text-stone-100">
                  {bestScore > 0 ? (
                    <span title={T.bestScoreLabel}>⭐ {bestScore}</span>
                  ) : null}
                  {bestScore > 0 && bestCombo > 0 ? ' · ' : null}
                  {bestCombo > 0 ? (
                    <span title={T.bestStreakLabel}>🔥 ×{bestCombo}</span>
                  ) : null}
                </p>
              ) : null}
              <Button size="lg" className={cn('h-11 rounded-full px-7 text-base', !reduce && 'anim-glow')} onClick={handleStart}>
                <Play className="h-5 w-5" aria-hidden="true" /> {T.play}
              </Button>
            </div>
          </div>
        ) : null}

        {/* Résumé de manche — compact, tient dans l'aire de jeu */}
        {phase === 'roundEnd' && summary ? (
          <div className="absolute inset-0 z-20 flex overflow-y-auto bg-stone-900/50 p-3 backdrop-blur-[2px]" role="status">
            <div className="anim-rise m-auto w-full max-w-[300px] rounded-2xl border bg-card p-4 text-center shadow-xl">
              <p className="font-display text-lg font-extrabold text-primary">
                {summary.cleared ? `🎉 ${T.cleared}` : T.roundOver.replace('{n}', String(summary.round))}
              </p>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center">
                <div className="rounded-xl bg-secondary/70 p-1.5">
                  <p className="text-base font-extrabold leading-tight tabular-nums">{summary.hits}/{summary.used}</p>
                  <p className="text-[10px] leading-tight text-muted-foreground">{T.hits}</p>
                </div>
                <div className="rounded-xl bg-secondary/70 p-1.5">
                  <p className="text-base font-extrabold leading-tight tabular-nums">{summary.acc}%</p>
                  <p className="text-[10px] leading-tight text-muted-foreground">{T.accuracy}</p>
                </div>
                <div className="rounded-xl bg-secondary/70 p-1.5">
                  <p className="text-base font-extrabold leading-tight tabular-nums">{summary.roundScore}</p>
                  <p className="text-[10px] leading-tight text-muted-foreground">{T.roundScore}</p>
                </div>
              </div>
              {summary.bonus > 0 ? (
                <p className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  💥 {T.bonus} : +{summary.bonus}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-muted-foreground">
                {T.total} : <span className="font-extrabold tabular-nums text-foreground">{summary.total}</span>
              </p>
              {summary.isRecord ? (
                <p className="mt-1 text-xs font-bold text-amber-600 dark:text-amber-400">🏆 {T.newBest}</p>
              ) : null}
              {/* Empilés sur mobile : les libellés FR ne tiennent pas côte à
                  côte dans 288 px (whitespace-nowrap des boutons). */}
              <div className="mt-3">
                <RoundEndActions
                  gameId={gameId}
                  variant="inline" // transitions de manche : reste compact, sans popup
                  onReplay={handleNext}
                  replayLabel={T.next}
                  replayIcon={<SkipForward className="h-5 w-5" aria-hidden="true" />}
                  primaryRef={nextBtnRef}
                  iq={summary.iq}
                  shareResult={
                    summary.cleared
                      ? T.shareCleared.replace('{n}', String(summary.used))
                      : T.shareMissed.replace('{hits}', String(summary.hits)).replace('{n}', String(summary.used))
                  }
                />
                <button
                  type="button"
                  onClick={handleEnd}
                  className="mx-auto mt-1.5 flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Square className="h-3 w-3" aria-hidden="true" /> {T.end}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Fin de session */}
        {phase === 'done' && summary ? (
          <div className="absolute inset-0 z-20 flex overflow-y-auto bg-stone-900/55 p-3 backdrop-blur-[2px]" role="status">
            <div className="anim-rise m-auto w-full max-w-[300px] rounded-2xl border bg-card p-5 text-center shadow-xl">
              <p className="font-display text-xl font-extrabold">🏁 {T.sessionOver}</p>
              <p className="mt-2 text-4xl font-extrabold tabular-nums text-primary">{summary.total}</p>
              <p className="text-xs text-muted-foreground">{T.total}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {T.bestStreak} : <span className="font-bold tabular-nums text-foreground">×{summary.bestStreak}</span>
              </p>
              <div className="mt-3">
                <RoundEndActions
                  gameId={gameId}
                  onReplay={handleStart}
                  replayLabel={T.again}
                  iq={summary.iq}
                  shareResult={T.shareSession.replace('{score}', String(summary.total)).replace('{streak}', String(summary.bestStreak))}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Une seule ligne d'aide, sous l'aire de jeu, à l'accueil uniquement */}
      {phase === 'idle' ? (
        <p className="mt-1.5 text-center text-[11px] leading-tight text-muted-foreground">{T.hint}</p>
      ) : null}
    </div>
  )
}
