'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Play, RotateCcw, Swords, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { useHydrated, useReducedMotion, clamp, todayKey, mulberry32, seedFromString } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { fruitSliceSeoContent } from './data/fruit-slice-seo'
import { computeIq } from '@/lib/games/iq'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'
import { IqChallengeBanner } from '@/components/game/iq-banner'
import { useJuice } from '@/components/game/fx'

export const gameId = 'fruit-slice'

/* ================= Contenu SEO bilingue ================= */
/* Task 27 : objet déplacé en données pures dans ./data/fruit-slice-seo.ts —
 * double-usage serveur/client (HTML brut des pages jeu réelles), source unique. */
export const content: GameSEOContent = fruitSliceSeoContent

/* ================= Textes UI ================= */
const L = {
  fr: {
    play: 'Trancher !', replay: 'Rejouer', restart: 'Recommencer', score: 'Score', best: 'Record', lives: 'Vies',
    combo: 'Combo', over: 'Verger terminé !', fruitsSliced: 'Fruits tranchés', bestCombo: 'Meilleur combo',
    daily: 'Défi du jour : atteindre {n} points', dailyDone: 'Défi du jour réussi !',
    newBest: 'Nouveau record !', hint: 'Balayez rapidement pour trancher — évitez les savons 🧼 !',
    shareScore: '{n} points · combo ×{c}',
    lostLife: '−1 vie', title: 'Le Verger de Gran',
    area: 'Aire de jeu du Verger de Gran : tranchez les fruits d’un geste rapide et évitez les savons.',
  },
  en: {
    play: 'Slice!', replay: 'Play again', restart: 'Restart', score: 'Score', best: 'Best', lives: 'Lives',
    combo: 'Combo', over: 'Orchard over!', fruitsSliced: 'Fruits sliced', bestCombo: 'Best combo',
    daily: 'Daily challenge: reach {n} points', dailyDone: 'Daily challenge complete!',
    newBest: 'New record!', hint: 'Swipe fast to slice — avoid the soaps 🧼!',
    shareScore: '{n} points · ×{c} combo',
    lostLife: '−1 life', title: 'Gran’s Orchard',
    area: 'Gran’s Orchard play area: slice the fruits with a fast swipe and avoid the soaps.',
  },
} as const

/* ================= Données fruits ================= */
interface FruitDef { emoji: string; r: number; points: number; juice: string }
const FRUITS: FruitDef[] = [
  { emoji: '🍎', r: 26, points: 10, juice: '#e05b4b' },
  { emoji: '🍊', r: 27, points: 10, juice: '#f59a3c' },
  { emoji: '🍋', r: 25, points: 10, juice: '#ead94e' },
  { emoji: '🍐', r: 26, points: 10, juice: '#a8c66c' },
  { emoji: '🍑', r: 26, points: 10, juice: '#f4a07a' },
  { emoji: '🥝', r: 24, points: 10, juice: '#8fbf7f' },
  { emoji: '🍇', r: 27, points: 10, juice: '#a4536a' },
  { emoji: '🍌', r: 28, points: 10, juice: '#ead48a' },
  { emoji: '🍉', r: 42, points: 30, juice: '#e05b4b' },
]
const SOAP = { emoji: '🧼', r: 26 }

/* ================= Monde ================= */
interface Fruit {
  id: number; emoji: string; x: number; y: number; vx: number; vy: number
  r: number; rot: number; vr: number; points: number; soap: boolean; juice: string
}
interface Half {
  emoji: string; x: number; y: number; vx: number; vy: number
  r: number; rot: number; vr: number; side: number; life: number
}
interface Juice { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; color: string }
interface Pop { x: number; y: number; text: string; life: number; max: number; color: string; size: number }
interface Slash { x: number; y: number; ang: number; len: number; life: number; max: number }
interface TrailPt { x: number; y: number; t: number }

interface World {
  W: number; H: number; t: number
  startT: number
  scale: number
  fruits: Fruit[]
  halves: Half[]
  juices: Juice[]
  pops: Pop[]
  slashes: Slash[]
  trail: TrailPt[]
  swipe: { active: boolean; x: number; y: number; t: number }
  lives: number
  score: number
  chain: number
  lastSlice: number
  bestChain: number
  fruitsSliced: number
  spawnT: number
  flash: number
  dead: boolean
  winCounted: boolean
  nextId: number
}

function makeWorld(): World {
  return {
    W: 320, H: 240, t: 0,
    startT: 0,
    scale: 1,
    fruits: [], halves: [], juices: [], pops: [], slashes: [], trail: [],
    swipe: { active: false, x: 0, y: 0, t: 0 },
    lives: 3, score: 0, chain: 0, lastSlice: 0, bestChain: 0,
    fruitsSliced: 0, spawnT: 0.6, flash: 0, dead: false, winCounted: false, nextId: 1,
  }
}

/* ================= Helpers ================= */
function emojiFont(size: number) {
  return `${Math.round(size)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",system-ui,sans-serif`
}

/** Haptique légère — no-op propre si non supportée. */
function buzz(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* ignoré */
  }
}

function segCircle(
  x0: number, y0: number, x1: number, y1: number,
  cx: number, cy: number, r: number,
): boolean {
  const dx = x1 - x0
  const dy = y1 - y0
  const l2 = dx * dx + dy * dy
  let t = 0
  if (l2 > 0) t = clamp(((cx - x0) * dx + (cy - y0) * dy) / l2, 0, 1)
  const px = x0 + t * dx
  const py = y0 + t * dy
  return (px - cx) * (px - cx) + (py - cy) * (py - cy) <= r * r
}

function drawBackdrop(ctx: CanvasRenderingContext2D, W: number, H: number, s: number) {
  // Ciel chaud
  const sky = ctx.createLinearGradient(0, 0, 0, H)
  sky.addColorStop(0, '#ffedd0')
  sky.addColorStop(0.55, '#f9d9a6')
  sky.addColorStop(1, '#f2c48c')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, W, H)
  // Halo de soleil
  const sun = ctx.createRadialGradient(W * 0.78, H * 0.16, 8, W * 0.78, H * 0.16, H * 0.5)
  sun.addColorStop(0, 'rgba(255,244,214,0.9)')
  sun.addColorStop(1, 'rgba(255,244,214,0)')
  ctx.fillStyle = sun
  ctx.fillRect(0, 0, W, H)
  // Collines
  ctx.fillStyle = 'rgba(143,191,127,0.55)'
  ctx.beginPath()
  ctx.moveTo(0, H)
  ctx.lineTo(0, H - 34 * s)
  ctx.quadraticCurveTo(W * 0.3, H - 72 * s, W * 0.62, H - 30 * s)
  ctx.quadraticCurveTo(W * 0.85, H - 2 * s, W, H - 26 * s)
  ctx.lineTo(W, H)
  ctx.closePath()
  ctx.fill()
  // Silhouettes d'arbres
  const tree = (x: number, ts: number) => {
    ctx.fillStyle = 'rgba(109,124,82,0.75)'
    ctx.fillRect(x - 3 * ts, H - 34 * ts, 6 * ts, 34 * ts)
    ctx.beginPath()
    ctx.arc(x, H - 44 * ts, 16 * ts, 0, Math.PI * 2)
    ctx.arc(x - 12 * ts, H - 36 * ts, 11 * ts, 0, Math.PI * 2)
    ctx.arc(x + 12 * ts, H - 36 * ts, 11 * ts, 0, Math.PI * 2)
    ctx.fill()
  }
  tree(W * 0.14, s)
  tree(W * 0.52, s * 0.8)
  tree(W * 0.88, s * 1.1)
  // Sol
  ctx.fillStyle = 'rgba(122,96,58,0.5)'
  ctx.fillRect(0, H - 12 * s, W, 12 * s)
}

/* ================= Composant ================= */
export default function FruitSliceGame() {
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
  const bestScore = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-score']?.value ?? 0)

  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [hud, setHud] = useState({ score: 0, lives: 3, chain: 0 })
  const [result, setResult] = useState<null | { score: number; sliced: number; bestChain: number; isRecord: boolean; xp: number; iq: number }>(null)
  const [confetti, setConfetti] = useState(0)
  /* Célébration de victoire (manche ≥ 150 points) — médaille + étoiles. */
  const [burstStars, setBurstStars] = useState(3)
  const [burstKey, setBurstKey] = useState(0)

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worldRef = useRef<World>(makeWorld())
  const phaseRef = useRef(phase)
  const reduceRef = useRef(reduce)
  const langRef = useRef(lang)
  const dailyDoneRef = useRef(dailyDone)
  const rafRef = useRef(0)
  const pausedRef = useRef(false)
  const lastStartRef = useRef(0)
  const replayBtnRef = useRef<HTMLButtonElement | null>(null)

  /* Effets « juice » (Task 20) — helpers visuels décoratifs, sans re-render. */
  const juice = useJuice()
  const juiceRef = useRef(juice)

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { reduceRef.current = reduce }, [reduce])
  useEffect(() => { langRef.current = lang }, [lang])
  useEffect(() => { dailyDoneRef.current = dailyDone }, [dailyDone])
  useEffect(() => { juiceRef.current = juice }, [juice])

  /* Focus clavier sur « Rejouer » dès l'écran de fin */
  useEffect(() => {
    if (phase === 'over') replayBtnRef.current?.focus({ preventScroll: true })
  }, [phase])

  /* Défi du jour déterministe : 120 / 160 / 200 points selon la date */
  const dayKey = todayKey()
  const dailyTarget = useMemo(() => {
    const r = mulberry32(seedFromString(`fruit-slice:${dayKey}`))
    return [120, 160, 200][Math.floor(r() * 3)]
  }, [dayKey])

  const pushHud = useCallback(() => {
    const w = worldRef.current
    setHud({ score: w.score, lives: w.lives, chain: w.chain })
  }, [])

  const handleStart = useCallback(() => {
    const now = performance.now()
    if (now - lastStartRef.current < 400) return // anti double-clic / double-tap
    lastStartRef.current = now
    sfx.play('click')
    const w = worldRef.current
    const keepW = w.W
    const keepH = w.H
    const keepT = w.t
    const keepScale = w.scale
    Object.assign(w, makeWorld())
    w.W = keepW
    w.H = keepH
    w.t = keepT
    w.scale = keepScale
    w.startT = keepT
    addPlay(gameId)
    setResult(null)
    setHud({ score: 0, lives: 3, chain: 0 })
    setPhase('playing')
  }, [addPlay])

  const finishDeath = useCallback(() => {
    const w = worldRef.current
    if (w.dead) return
    w.dead = true
    const prevBest = useProfileStore.getState().profile.games[gameId]?.records?.['best-score']?.value ?? 0
    const isRecord = w.score > prevBest && w.score > 0
    /* QI estimé (Task 18) : précision = score de la session rapporté au par
     * d’une manche d’arcade brillante (200 pts — victoire à 150, 3 étoiles
     * à 300), difficulté 2 (cadence croissante) ; rapidité omise :
     * la course est une endurance jusqu’aux 3 savons, sans temps cible. */
    const iq = computeIq(gameId, { accuracy: clamp(w.score / 200, 0, 1), difficulty: 2 })
    const xp = w.score > 0 ? Math.max(1, Math.floor(w.score / 10)) : 0
    if (w.score > 0) {
      setBest(gameId, 'best-score', w.score)
      addXp(xp)
    }
    if (w.bestChain >= 2) setBest(gameId, 'best-combo', w.bestChain)
    if (w.score >= 150) unlockBadge('fruit-150')
    // XP du jeu : manche gagnée (≥ 150 pts, même seuil que addWin) 20-28 XP,
    // manche terminée sans victoire 8-12 XP selon le score.
    addGameXp(
      gameId,
      w.winCounted
        ? w.score >= 300 ? 28 : w.score >= 200 ? 24 : 20
        : w.score >= 80 ? 12 : w.score >= 40 ? 10 : 8,
    )
    if (isRecord) {
      sfx.play('win')
      setConfetti((k) => k + 1)
      buzz([20, 40, 20])
    } else {
      sfx.play('lose')
      buzz(30)
    }
    // Victoire arcade : éclat de médaille par paliers de score.
    if (w.winCounted) {
      setBurstStars(w.score >= 300 ? 3 : w.score >= 200 ? 2 : 1)
      setBurstKey((k) => k + 1)
    }
    setResult({ score: w.score, sliced: w.fruitsSliced, bestChain: w.bestChain, isRecord, xp, iq })
    setPhase('over')
  }, [addGameXp, addXp, setBest, unlockBadge])

  /* ================= Boucle principale ================= */
  useEffect(() => {
    const cv = canvasRef.current
    const wrap = wrapRef.current
    if (!cv || !wrap) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const w = worldRef.current

    let bg: HTMLCanvasElement | null = null
    let dpr = 1
    let dirty = true

    /* Géométrie pilotée par le CSS (h-[calc(100dvh-250px)] max-h-[720px]) :
       l'aire remplit le budget vertical mobile sans jamais scroller la page. */
    const resize = () => {
      const cw = wrap.clientWidth
      const ch = wrap.clientHeight
      if (cw < 40 || ch < 40) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w.W = cw
      w.H = ch
      // Fruits dimensionnés en % de la hauteur d'écran (≈ r×2 px pour 430 px d'aire)
      w.scale = clamp(ch / 430, 0.8, 1.6)
      cv.width = Math.round(cw * dpr)
      cv.height = Math.round(ch * dpr)
      bg = document.createElement('canvas')
      bg.width = cv.width
      bg.height = cv.height
      const bctx = bg.getContext('2d')
      if (bctx) {
        bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        drawBackdrop(bctx, cw, ch, w.scale)
      }
      dirty = true
    }
    resize()

    const gravity = () => w.H * 2.6

    /* ----- projection d'un objet ----- */
    const spawnItem = () => {
      const elapsed = w.t - w.startT
      const isSoap = elapsed > 8 && Math.random() < 0.13
      const def = isSoap
        ? null
        : Math.random() < 0.08
          ? FRUITS[FRUITS.length - 1]
          : FRUITS[Math.floor(Math.random() * (FRUITS.length - 1))]
      const r = def ? def.r : SOAP.r
      const x = w.W * (0.12 + Math.random() * 0.76)
      const apex = w.H * (0.62 + Math.random() * 0.28)
      const speedMul = 1 + Math.min(elapsed / 300, 0.35)
      w.fruits.push({
        id: w.nextId++,
        emoji: def ? def.emoji : SOAP.emoji,
        x,
        y: w.H + r * w.scale + 6,
        vx: ((w.W / 2 - x) * 0.42 + (Math.random() - 0.5) * 130) * Math.sqrt(speedMul),
        vy: -Math.sqrt(2 * gravity() * apex) * Math.sqrt(speedMul),
        r,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 5,
        points: def ? def.points : 0,
        soap: isSoap,
        juice: def ? def.juice : '#d98cb3',
      })
    }

    /* ----- trancher ----- */
    const sliceFruit = (f: Fruit, ang: number, now: number) => {
      if (w.dead) return
      w.fruits = w.fruits.filter((o) => o.id !== f.id)
      const s = w.scale
      const px = -Math.sin(ang)
      const py = Math.cos(ang)
      for (const side of [-1, 1]) {
        w.halves.push({
          emoji: f.emoji,
          x: f.x + px * side * f.r * s * 0.4,
          y: f.y + py * side * f.r * s * 0.4,
          vx: f.vx * 0.55 + px * side * 190 * s,
          vy: f.vy * 0.55 + py * side * 190 * s - 60 * s,
          r: f.r,
          rot: ang,
          vr: side * 3.2,
          side,
          life: 0.9,
        })
      }
      // Éclat de lame au point de coupe
      w.slashes.push({ x: f.x, y: f.y, ang, len: f.r * s * 2.9, life: 0.22, max: 0.22 })
      if (!reduceRef.current) {
        for (let i = 0; i < 9; i++) {
          const a = Math.random() * Math.PI * 2
          const sp = (50 + Math.random() * 200) * s
          w.juices.push({
            x: f.x, y: f.y,
            vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60 * s,
            r: (2 + Math.random() * 4) * s,
            life: 0.5 + Math.random() * 0.3, max: 0.8,
            color: f.juice,
          })
        }
      }

      if (f.soap) {
        w.lives--
        w.flash = 1
        w.chain = 0
        sfx.play('wrong')
        buzz([10, 30, 10])
        w.pops.push({ x: f.x, y: f.y - 10 * s, text: L[langRef.current].lostLife, life: 1, max: 1, color: '#d9553f', size: 20 })
        if (w.lives <= 0) {
          finishDeath()
        }
      } else {
        w.fruitsSliced++
        w.chain = now - w.lastSlice <= 350 ? w.chain + 1 : 1
        w.lastSlice = now
        w.bestChain = Math.max(w.bestChain, w.chain)
        buzz(10)
        let gained = f.points
        if (w.chain >= 3) {
          const bonus = w.chain * 10
          gained += bonus
          sfx.play('coin')
          w.pops.push({
            x: f.x, y: f.y - 34 * s,
            text: `COMBO ×${w.chain} +${bonus}`,
            life: 1.1, max: 1.1, color: '#b45309', size: 19,
          })
          // Effet « juice » (Task 20) : micro-pulse du plateau sur un combo —
          // le canvas dessine déjà lame, jus et moitiés volantes, on reste discret.
          juiceRef.current.pulse(wrap, 1.01, 240)
        } else {
          sfx.play('slice')
        }
        w.score += gained
        w.pops.push({ x: f.x, y: f.y - 6 * s, text: `+${gained}`, life: 0.85, max: 0.85, color: '#7c4a1e', size: 15 })
        if (w.chain >= 4) unlockBadge('fruit-combo-4')
        // Victoire « arcade » : une belle manche de 150 points compte comme une victoire
        if (!w.winCounted && w.score >= 150) {
          w.winCounted = true
          addWin(gameId)
        }
        // Défi du jour
        if (!dailyDoneRef.current && w.score >= dailyTarget) {
          completeDaily(gameId)
          sfx.play('win')
          setConfetti((k) => k + 1)
          buzz(20)
        }
      }
      pushHud()
    }

    /* ----- entrées (pointeur unique, anti multi-touch parasite) ----- */
    let activePtr = -1
    const rectPos = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onDown = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return
      if (activePtr !== -1) return // un seul doigt ne tranche
      activePtr = e.pointerId
      const p = rectPos(e)
      w.swipe = { active: true, x: p.x, y: p.y, t: performance.now() }
      w.trail.push({ x: p.x, y: p.y, t: performance.now() })
      try {
        cv.setPointerCapture(e.pointerId)
      } catch {
        /* pointeur déjà relâché */
      }
    }
    const onMove = (e: PointerEvent) => {
      if (!w.swipe.active || phaseRef.current !== 'playing') return
      if (e.pointerId !== activePtr) return
      const now = performance.now()
      const p = rectPos(e)
      const dt = now - w.swipe.t
      const dist = Math.hypot(p.x - w.swipe.x, p.y - w.swipe.y)
      // Seuil : ~6 px par frame (0,36 px/ms) pour que la lame coupe
      if (dt > 0 && dist / dt > 0.36 && dist >= 3) {
        const ang = Math.atan2(p.y - w.swipe.y, p.x - w.swipe.x)
        for (const f of [...w.fruits]) {
          if (segCircle(w.swipe.x, w.swipe.y, p.x, p.y, f.x, f.y, f.r * w.scale * 0.95)) {
            sliceFruit(f, ang, now)
            if (phaseRef.current !== 'playing') break
          }
        }
      }
      w.swipe.x = p.x
      w.swipe.y = p.y
      w.swipe.t = now
      w.trail.push({ x: p.x, y: p.y, t: now })
    }
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== activePtr) return
      activePtr = -1
      w.swipe.active = false
    }
    const onCtx = (e: Event) => e.preventDefault()
    const onVis = () => { pausedRef.current = document.hidden }

    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointercancel', onUp)
    cv.addEventListener('contextmenu', onCtx)
    document.addEventListener('visibilitychange', onVis)

    /* ----- simulation ----- */
    const update = (dt: number, now: number) => {
      if (phaseRef.current !== 'playing') {
        // Les restes continuent de tomber derrière l'écran de fin
        for (const f of w.fruits) {
          f.vy += gravity() * dt
          f.x += f.vx * dt
          f.y += f.vy * dt
          f.rot += f.vr * dt
        }
        w.fruits = w.fruits.filter((f) => f.y < w.H + f.r * w.scale + 60)
        updateDebris(dt)
        return
      }
      const elapsed = w.t - w.startT
      w.spawnT -= dt
      if (w.spawnT <= 0) {
        w.spawnT = Math.max(0.55, 1.35 - elapsed * 0.007) * (0.75 + Math.random() * 0.5)
        const count = 1 + (Math.random() < 0.35 ? 1 : 0) + (Math.random() < 0.2 ? 1 : 0) + (Math.random() < 0.1 ? 1 : 0)
        for (let i = 0; i < count; i++) spawnItem()
      }
      for (const f of w.fruits) {
        f.vy += gravity() * dt
        f.x += f.vx * dt
        f.y += f.vy * dt
        f.rot += f.vr * dt
      }
      // Fruits manqués : casse le combo (les savons ratés ne pénalisent rien)
      let missedFruit = false
      w.fruits = w.fruits.filter((f) => {
        const off = f.y > w.H + f.r * w.scale + 40
        if (off && !f.soap) missedFruit = true
        return !off
      })
      if (missedFruit && w.chain > 0) {
        w.chain = 0
        pushHud()
      }
      // Fin de fenêtre combo
      if (w.chain > 0 && now - w.lastSlice > 350) {
        w.chain = 0
        pushHud()
      }
      updateDebris(dt)
    }
    const updateDebris = (dt: number) => {
      for (let i = w.halves.length - 1; i >= 0; i--) {
        const h = w.halves[i]
        h.vy += gravity() * dt
        h.x += h.vx * dt
        h.y += h.vy * dt
        h.rot += h.vr * dt
        h.life -= dt
        if (h.life <= 0 || h.y > w.H + 90 * w.scale) w.halves.splice(i, 1)
      }
      for (let i = w.juices.length - 1; i >= 0; i--) {
        const j = w.juices[i]
        j.vy += 700 * w.scale * dt
        j.x += j.vx * dt
        j.y += j.vy * dt
        j.life -= dt
        if (j.life <= 0) w.juices.splice(i, 1)
      }
      for (let i = w.slashes.length - 1; i >= 0; i--) {
        const sl = w.slashes[i]
        sl.life -= dt
        if (sl.life <= 0) w.slashes.splice(i, 1)
      }
      for (let i = w.pops.length - 1; i >= 0; i--) {
        const p = w.pops[i]
        p.y -= 32 * dt
        p.life -= dt
        if (p.life <= 0) w.pops.splice(i, 1)
      }
      const cutoff = performance.now() - 150
      while (w.trail.length > 0 && w.trail[0].t < cutoff) w.trail.shift()
      if (w.flash > 0) w.flash = Math.max(0, w.flash - dt * 2.2)
    }

    /* ----- rendu ----- */
    const draw = () => {
      const W = w.W, H = w.H
      const fs = clamp(w.scale, 1, 1.35)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      // Secousse à l'erreur (désactivée si mouvement réduit)
      if (w.flash > 0.55 && !reduceRef.current) {
        ctx.translate((Math.random() - 0.5) * 6 * w.flash, (Math.random() - 0.5) * 6 * w.flash)
      }
      if (bg) ctx.drawImage(bg, 0, 0, W, H)

      // Trainée lumineuse du geste (simplifiée si mouvement réduit)
      if (w.trail.length > 1) {
        const simple = reduceRef.current
        ctx.save()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        if (!simple) {
          ctx.shadowColor = 'rgba(247,200,115,0.9)'
          ctx.shadowBlur = 12
        }
        for (let i = 1; i < w.trail.length; i++) {
          const a = i / w.trail.length
          ctx.strokeStyle = `rgba(255,246,220,${(simple ? 0.55 : 0.7) * a})`
          ctx.lineWidth = (simple ? 1.5 : 2) + (simple ? 3 : 7) * a
          ctx.beginPath()
          ctx.moveTo(w.trail[i - 1].x, w.trail[i - 1].y)
          ctx.lineTo(w.trail[i].x, w.trail[i].y)
          ctx.stroke()
        }
        ctx.restore()
      }

      // Jus
      for (const j of w.juices) {
        ctx.globalAlpha = clamp(j.life / j.max, 0, 1)
        ctx.fillStyle = j.color
        ctx.beginPath()
        ctx.arc(j.x, j.y, j.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Moitiés
      for (const h of w.halves) {
        ctx.save()
        ctx.globalAlpha = clamp(h.life / 0.9, 0, 1)
        ctx.translate(h.x, h.y)
        ctx.rotate(h.rot)
        const cr = h.r * w.scale * 1.6
        ctx.beginPath()
        ctx.rect(-cr, h.side < 0 ? -cr : 0, cr * 2, cr)
        ctx.clip()
        ctx.font = emojiFont(h.r * 2 * w.scale)
        ctx.fillText(h.emoji, 0, 0)
        ctx.restore()
      }

      // Fruits et savons
      for (const f of w.fruits) {
        ctx.save()
        ctx.translate(f.x, f.y)
        ctx.rotate(f.rot)
        ctx.font = emojiFont(f.r * 2 * w.scale)
        ctx.fillText(f.emoji, 0, 0)
        if (f.soap) {
          ctx.fillStyle = 'rgba(217,140,179,0.3)'
          ctx.beginPath()
          ctx.arc(0, 0, (f.r + 7) * w.scale, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      // Éclats de lame
      for (const sl of w.slashes) {
        const a = clamp(sl.life / sl.max, 0, 1)
        ctx.save()
        ctx.translate(sl.x, sl.y)
        ctx.rotate(sl.ang)
        ctx.globalAlpha = a
        ctx.strokeStyle = '#fffdf5'
        ctx.lineWidth = 1 + 3 * a
        ctx.lineCap = 'round'
        if (!reduceRef.current) {
          ctx.shadowColor = 'rgba(255,248,220,0.9)'
          ctx.shadowBlur = 10
        }
        ctx.beginPath()
        ctx.moveTo(-sl.len / 2, 0)
        ctx.lineTo(sl.len / 2, 0)
        ctx.stroke()
        ctx.restore()
      }
      ctx.globalAlpha = 1

      // Textes flottants
      for (const p of w.pops) {
        ctx.globalAlpha = clamp(p.life / p.max, 0, 1)
        ctx.fillStyle = p.color
        ctx.font = `800 ${Math.round(p.size * fs)}px "Nunito", system-ui, sans-serif`
        ctx.fillText(p.text, p.x, p.y)
      }
      ctx.globalAlpha = 1

      // Flash rouge (savon tranché)
      if (w.flash > 0) {
        const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75)
        g.addColorStop(0, 'rgba(200,50,40,0)')
        g.addColorStop(1, `rgba(200,50,40,${0.55 * w.flash})`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      }
    }

    let last = performance.now()
    const step = (now: number) => {
      rafRef.current = requestAnimationFrame(step)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (pausedRef.current) return
      // Économie de batterie : rien à animer hors partie (une fois le décor posé)
      const animating =
        phaseRef.current === 'playing' ||
        w.fruits.length > 0 || w.halves.length > 0 || w.juices.length > 0 ||
        w.pops.length > 0 || w.slashes.length > 0 || w.trail.length > 0 || w.flash > 0
      if (!animating && !dirty) return
      w.t += dt
      update(dt, now)
      draw()
      dirty = false
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
      cv.removeEventListener('pointercancel', onUp)
      cv.removeEventListener('contextmenu', onCtx)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [addWin, completeDaily, dailyTarget, finishDeath, handleStart, pushHud, unlockBadge])

  /* ================= Rendu React ================= */
  return (
    <div className="relative select-none my-auto flex w-full flex-col h-[var(--board-h,auto)]">
      <Confetti fire={confetti} count={reduce ? 0 : 90} waves={2} gold />

      {/* HUD compact — une seule ligne au-dessus de l'aire */}
      <div className="mb-2 flex min-w-0 items-center gap-1.5">
        {phase === 'playing' ? (
          <>
            <div className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-sm font-bold tabular-nums" title={T.score}>
              <span aria-hidden="true">⭐</span>
              <span className="sr-only">{T.score}</span>
              {hud.score}
            </div>
            <div className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-secondary/70 px-2.5" title={T.lives} aria-label={`${T.lives} : ${hud.lives}/3`}>
              <span className="sr-only">{`${T.lives} : ${hud.lives}/3`}</span>
              <span className="flex gap-0.5" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <Heart key={i} className={cn('h-4 w-4', i < hud.lives ? 'fill-rose-500 text-rose-500' : 'text-foreground/20')} />
                ))}
              </span>
            </div>
            {hud.chain >= 2 ? (
              <div
                key={hud.chain}
                className="anim-pop-in flex h-9 shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 text-sm font-bold tabular-nums text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                title={T.combo}
              >
                <span aria-hidden="true">🔥</span>
                <span className="sr-only">{T.combo}</span>
                ×{hud.chain}
              </div>
            ) : null}
            {!dailyDone ? (
              <div
                className="flex h-9 min-w-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 text-sm font-bold tabular-nums text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                title={T.daily.replace('{n}', String(dailyTarget))}
              >
                <span aria-hidden="true">🎯</span>
                <span className="sr-only">{T.daily.replace('{n}', String(dailyTarget))}</span>
                {dailyTarget}
              </div>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              className="ms-auto h-9 w-9 shrink-0 rounded-full p-0"
              aria-label={T.restart}
              title={T.restart}
              onClick={handleStart}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>
          </>
        ) : (
          <>
            {hydrated && bestScore > 0 ? (
              <div
                className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-sm font-bold tabular-nums"
                title={`${T.score} — ${T.best}`}
              >
                <span aria-hidden="true">⭐</span>
                <span className="sr-only">{`${T.score} — ${T.best}`}</span>
                {bestScore}
              </div>
            ) : null}
            {!dailyDone ? (
              <div
                className="flex h-9 min-w-0 items-center gap-1.5 rounded-full bg-amber-100 px-3 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                title={T.daily.replace('{n}', String(dailyTarget))}
              >
                <span aria-hidden="true">🎯</span>
                <span className="min-w-0 truncate">{T.daily.replace('{n}', String(dailyTarget))}</span>
              </div>
            ) : (
              <div className="flex h-9 min-w-0 items-center gap-1.5 rounded-full bg-emerald-100 px-3 text-sm font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                <span aria-hidden="true">✅</span>
                <span className="min-w-0 truncate">{T.dailyDone}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Aire de jeu — remplit le budget vertical mobile, jamais de scroll */}
      <div
        ref={wrapRef}
        className="relative h-[var(--board-h,calc(100dvh-250px))] max-h-[720px] min-h-[300px] w-full overflow-hidden rounded-2xl border shadow-inner"
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full touch-none"
          style={{ touchAction: 'none' }}
          role="img"
          aria-label={T.area}
        />

        {/* Écran d'accueil compact */}
        {phase === 'idle' ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-stone-900/40 p-6 text-center backdrop-blur-[2px]">
            {/* Défi QI bienveillant — mis en avant dès l'ouverture (Task 19) */}
            <IqChallengeBanner gameId={gameId} />
            <div className="flex gap-2" aria-hidden="true">
              {['🍉', '🔪', '🍎'].map((e, i) => (
                <span key={i} className="text-4xl anim-floaty" style={{ animationDelay: `${i * 0.4}s` }}>{e}</span>
              ))}
            </div>
            <h3 className="font-display text-2xl font-extrabold text-white drop-shadow">🍉 {T.title}</h3>
            <p className="max-w-xs rounded-xl bg-white/15 px-3 py-2 text-xs text-stone-100">{T.hint}</p>
            <Button size="lg" className="h-12 rounded-full px-8 text-base anim-glow" onClick={handleStart}>
              <Play className="h-5 w-5" aria-hidden="true" /> {T.play}
            </Button>
          </div>
        ) : null}

        {/* Game over — Rejouer immédiat, focus clavier */}
        {phase === 'over' && result ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-900/55 p-4 backdrop-blur-[2px]">
            <div role="status" aria-live="polite" className="anim-rise max-h-full w-full max-w-sm overflow-y-auto nice-scroll rounded-2xl border bg-card p-5 text-center shadow-xl">
              <p className="font-display text-xl font-extrabold">🍉 {T.over}</p>
              <p className="mt-2 text-5xl font-extrabold tabular-nums text-primary">{result.score}</p>
              <p className="text-xs text-muted-foreground">{T.score}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
                <span className="rounded-xl bg-secondary/70 px-3 py-2">
                  <Swords className="mr-1 inline h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="font-bold tabular-nums">{result.sliced}</span> <span className="text-muted-foreground">{T.fruitsSliced}</span>
                </span>
                <span className="rounded-xl bg-secondary/70 px-3 py-2">
                  🔥 <span className="font-bold tabular-nums">×{result.bestChain}</span> <span className="text-muted-foreground">{T.bestCombo}</span>
                </span>
                {result.xp > 0 ? (
                  <span className="rounded-xl bg-secondary/70 px-3 py-2">
                    <span className="font-bold tabular-nums">+{result.xp}</span> <span className="text-muted-foreground">XP</span>
                  </span>
                ) : null}
              </div>
              {result.isRecord ? (
                <p className="mt-3 text-sm font-bold text-amber-600 dark:text-amber-400">🏆 {T.newBest}</p>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  {T.best} : <span className="font-bold tabular-nums">{Math.max(bestScore, result.score)}</span>
                </p>
              )}
              <div className="mt-4">
                <RoundEndActions
                  gameId={gameId}
                  onReplay={handleStart}
                  replayLabel={T.replay}
                  primaryRef={replayBtnRef}
                  iq={result.iq}
                  shareResult={T.shareScore.replace('{n}', String(result.score)).replace('{c}', String(result.bestChain))}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Célébration de victoire — au-dessus de l'écran de fin (même z, plus tard dans le DOM) */}
      <VictoryBurst fire={burstKey} stars={burstStars} emoji="🍉" />
    </div>
  )
}
