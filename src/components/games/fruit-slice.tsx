'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, Swords, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { useHydrated, useReducedMotion, clamp, todayKey, mulberry32, seedFromString } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { StatChip } from '@/components/shared/ui-bits'
import { Confetti } from '@/components/shared/confetti'

export const gameId = 'fruit-slice'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Tranchez les fruits du verger d’un geste fluide, enchaînez les combos et évitez les savons piégés.',
    en: 'Slice the orchard fruits with a fluid swipe, chain combos and avoid the trap soaps.',
  },
  description: {
    fr: [
      'Le Verger de Gran (Fruit Slice) est un jeu d’action et de réflexes gratuit dans lequel vous découpez au doigt les fruits projetés depuis le bas de l’écran. Balayez l’écran comme un couteau : chaque fruit traversé par votre geste se coupe en deux moitiés qui volent.',
      'Les fruits montent en arcs paraboliques, par vagues de 1 à 4, de plus en plus rapides. La pastèque géante rapporte 30 points, et trancher 3 fruits ou plus dans un même geste déclenche un combo bonus (×10 points par fruit). Attention aux savons 🧼 interdits : en couper un coûte une vie, et vous n’en avez que trois.',
      'Laisser tomber un fruit n’enlève rien : il casse simplement votre combo. Le jeu s’accélère progressivement, votre meilleur score est sauvegardé sur votre appareil, et un défi du jour déterministe vous donne un objectif de points différent chaque matin.',
    ],
    en: [
      'Gran’s Orchard (Fruit Slice) is a free action and reflex game in which you slice with your finger the fruits tossed up from the bottom of the screen. Swipe across the game like a knife: every fruit crossed by your gesture splits into two flying halves.',
      'Fruits rise in parabolic arcs, in waves of 1 to 4, faster and faster. The giant watermelon is worth 30 points, and slicing 3 or more fruits within one continuous swipe triggers a combo bonus (×10 points per fruit). Watch out for the forbidden soaps 🧼: slicing one costs a life, and you only have three.',
      'Letting a fruit fall costs nothing: it merely breaks your combo. The game speeds up progressively, your best score is saved on your device, and a deterministic daily challenge gives you a fresh points goal every morning.',
    ],
  },
  rules: {
    fr: [
      'Balayez l’écran avec le doigt (ou la souris) pour trancher : le geste doit être rapide pour couper.',
      'Chaque fruit tranché rapporte 10 points ; la pastèque géante 🍉 en rapporte 30.',
      'Tranchez 3 fruits ou plus en un seul geste (moins de 350 ms entre chaque coupe) : bonus de combo ×10 points par fruit.',
      'Ne tranchez jamais les savons 🧼 : chaque savon coupé coûte une vie (3 vies au total).',
      'Un fruit qui retombe entière n’enlève rien : il casse seulement votre combo.',
      'La partie s’arrête à 0 vie : le score final devient votre record.',
    ],
    en: [
      'Swipe across the screen with your finger (or the mouse) to slice: the gesture must be fast to cut.',
      'Each sliced fruit is worth 10 points; the giant watermelon 🍉 is worth 30.',
      'Slice 3 or more fruits in a single gesture (under 350 ms between cuts): combo bonus of ×10 points per fruit.',
      'Never slice the soaps 🧼: each soap cut costs a life (3 lives in total).',
      'A fruit falling off the screen costs nothing: it only breaks your combo.',
      'The game ends at 0 lives: the final score becomes your record.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : balayez l’écran avec un doigt, comme un couteau.',
      'Ordinateur : cliquez et tirez un trait rapide avec la souris.',
      'Un geste lent ne coupe pas : la vitesse fait la lame.',
    ],
    en: [
      'Mobile & tablet: swipe across the screen with one finger, like a knife.',
      'Desktop: click and drag a fast line with the mouse.',
      'A slow gesture does not cut: speed makes the blade.',
    ],
  },
  features: {
    fr: [
      'Découpe au doigt avec trainée lumineuse et jus de fruits',
      '9 fruits dont la pastèque géante à 30 points',
      'Combos : bonus ×10 points par fruit au-delà de 3 en un geste',
      'Savons piégés à éviter : 3 vies, flash rouge à l’erreur',
      'Vagues de plus en plus rapides et fréquentes',
      'Record de score sauvegardé + défi du jour déterministe',
    ],
    en: [
      'Finger slicing with a glowing trail and fruit juice',
      '9 fruits including the 30-point giant watermelon',
      'Combos: ×10 bonus points per fruit past 3 in one swipe',
      'Trap soaps to avoid: 3 lives, red flash on mistake',
      'Waves that get faster and more frequent',
      'Saved score record + deterministic daily challenge',
    ],
  },
  tips: {
    fr: [
      'Balayez en travers d’une vague entière plutôt que fruit par fruit : les combos font décoller le score.',
      'Repérez les savons avant de balayer : leur violet-rose se distingue des fruits au sommet de l’arc, quand tout ralentit.',
      'Les fruits sont plus lents au sommet de leur arc : c’est le meilleur moment pour trancher plusieurs fruits d’un geste.',
      'Gardez un œil sur vos vies, pas sur le score : la prudence avec les savons prolonge toujours les parties.',
    ],
    en: [
      'Sweep across a whole wave rather than fruit by fruit: combos make the score take off.',
      'Spot the soaps before swiping: their pink stands out from the fruits at the top of the arc, when everything slows down.',
      'Fruits are slowest at the top of their arc: it is the best moment to slice several with one gesture.',
      'Watch your lives, not the score: caution with soaps always makes games last longer.',
    ],
  },
  faq: {
    fr: [
      { q: 'Que se passe-t-il quand un fruit tombe sans être tranché ?', a: 'Rien de grave : vous ne perdez ni points ni vie. Seul votre combo en cours est remis à zéro, ce qui vous encourage à trancher la vague suivante en un seul geste.' },
      { q: 'Comment fonctionne le combo ?', a: 'Chaque coupe effectuée moins de 350 ms après la précédente augmente le compteur. À partir de 3 fruits, chaque coupe supplémentaire rapporte un bonus de 10 points × le nombre de fruits du combo, affiché en « COMBO ×N ».' },
      { q: 'Les savons apparaissent-ils dès le début ?', a: 'Non : ils apparaissent après environ 8 secondes, dans environ une projection sur huit. Leur proportion n’augmente pas avec le temps — seule la vitesse du jeu augmente.' },
      { q: 'Le jeu devient-il trop rapide ?', a: 'La vitesse et la fréquence des vagues augmentent progressivement et plafonnent après quelques minutes : le jeu reste jouable longtemps, sans mur de difficulté.' },
      { q: 'Puis-je jouer sans regarder les savons ?', a: 'Mieux vaut ne pas : chaque savon tranché coûte une vie. Mais un savon qui retombe intact ne pénalise en rien — l’ignorer complètement est une stratégie valide.' },
    ],
    en: [
      { q: 'What happens when a fruit falls unsliced?', a: 'Nothing bad: you lose neither points nor a life. Only your current combo resets, which encourages you to slice the next wave in one gesture.' },
      { q: 'How does the combo work?', a: 'Every cut made less than 350 ms after the previous one increases the counter. From 3 fruits up, each extra cut earns a bonus of 10 points × the number of fruits in the combo, shown as “COMBO ×N”.' },
      { q: 'Do soaps appear from the start?', a: 'No: they show up after about 8 seconds, in roughly one toss out of eight. Their share does not grow over time — only the game speed does.' },
      { q: 'Does the game get too fast?', a: 'Wave speed and frequency rise gradually and cap after a few minutes: the game stays playable for a long time, with no difficulty wall.' },
      { q: 'Can I play while ignoring the soaps?', a: 'Best not to: every sliced soap costs a life. But a soap falling back untouched penalizes nothing at all — fully ignoring them is a valid strategy.' },
    ],
  },
  records: {
    'best-score': { fr: 'Meilleur score', en: 'Best score' },
  },
}

/* ================= Textes UI ================= */
const L = {
  fr: {
    play: 'Trancher !', replay: 'Rejouer', score: 'Score', best: 'Record', lives: 'Vies',
    combo: 'Combo', over: 'Verger terminé !', fruitsSliced: 'Fruits tranchés', bestCombo: 'Meilleur combo',
    daily: 'Défi du jour : atteindre {n} points', dailyDone: 'Défi du jour réussi !',
    newBest: 'Nouveau record !', hint: 'Balayez rapidement pour trancher — évitez les savons 🧼 !',
    tip: 'Astuce : tranchez au sommet de l’arc, là où les fruits ralentissent.',
    lostLife: '−1 vie', title: 'Le Verger de Gran',
  },
  en: {
    play: 'Slice!', replay: 'Play again', score: 'Score', best: 'Best', lives: 'Lives',
    combo: 'Combo', over: 'Orchard over!', fruitsSliced: 'Fruits sliced', bestCombo: 'Best combo',
    daily: 'Daily challenge: reach {n} points', dailyDone: 'Daily challenge complete!',
    newBest: 'New record!', hint: 'Swipe fast to slice — avoid the soaps 🧼!',
    tip: 'Tip: slice at the top of the arc, where fruits slow down.',
    lostLife: '−1 life', title: 'Gran’s Orchard',
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
interface TrailPt { x: number; y: number; t: number }

interface World {
  W: number; H: number; t: number
  startT: number
  fruits: Fruit[]
  halves: Half[]
  juices: Juice[]
  pops: Pop[]
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
  nextId: number
}

function makeWorld(): World {
  return {
    W: 320, H: 240, t: 0,
    startT: 0,
    fruits: [], halves: [], juices: [], pops: [], trail: [],
    swipe: { active: false, x: 0, y: 0, t: 0 },
    lives: 3, score: 0, chain: 0, lastSlice: 0, bestChain: 0,
    fruitsSliced: 0, spawnT: 0.6, flash: 0, dead: false, nextId: 1,
  }
}

/* ================= Helpers ================= */
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

function drawBackdrop(ctx: CanvasRenderingContext2D, W: number, H: number) {
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
  ctx.lineTo(0, H - 34)
  ctx.quadraticCurveTo(W * 0.3, H - 72, W * 0.62, H - 30)
  ctx.quadraticCurveTo(W * 0.85, H - 2, W, H - 26)
  ctx.lineTo(W, H)
  ctx.closePath()
  ctx.fill()
  // Silhouettes d'arbres
  const tree = (x: number, s: number) => {
    ctx.fillStyle = 'rgba(109,124,82,0.75)'
    ctx.fillRect(x - 3 * s, H - 34 * s, 6 * s, 34 * s)
    ctx.beginPath()
    ctx.arc(x, H - 44 * s, 16 * s, 0, Math.PI * 2)
    ctx.arc(x - 12 * s, H - 36 * s, 11 * s, 0, Math.PI * 2)
    ctx.arc(x + 12 * s, H - 36 * s, 11 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  tree(W * 0.14, 1)
  tree(W * 0.52, 0.8)
  tree(W * 0.88, 1.1)
  // Sol
  ctx.fillStyle = 'rgba(122,96,58,0.5)'
  ctx.fillRect(0, H - 12, W, 12)
}

/* ================= Composant ================= */
export default function FruitSliceGame() {
  const lang = useLang()
  const reduce = useReducedMotion()
  const hydrated = useHydrated()
  const dailyDone = useIsDailyDone(gameId)
  const T = L[lang]

  const addPlay = useProfileStore((s) => s.addPlay)
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)
  const bestScore = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-score']?.value ?? 0)

  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [hud, setHud] = useState({ score: 0, lives: 3, chain: 0 })
  const [result, setResult] = useState<null | { score: number; sliced: number; bestChain: number; isRecord: boolean }>(null)
  const [confetti, setConfetti] = useState(0)

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worldRef = useRef<World>(makeWorld())
  const phaseRef = useRef(phase)
  const reduceRef = useRef(reduce)
  const langRef = useRef(lang)
  const dailyDoneRef = useRef(dailyDone)
  const rafRef = useRef(0)
  const pausedRef = useRef(false)

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { reduceRef.current = reduce }, [reduce])
  useEffect(() => { langRef.current = lang }, [lang])
  useEffect(() => { dailyDoneRef.current = dailyDone }, [dailyDone])

  /* Défi du jour déterministe : 120 / 160 / 200 points selon la date */
  const dailyTarget = (() => {
    const r = mulberry32(seedFromString(`fruit-slice:${todayKey()}`))
    return [120, 160, 200][Math.floor(r() * 3)]
  })()

  const pushHud = useCallback(() => {
    const w = worldRef.current
    setHud({ score: w.score, lives: w.lives, chain: w.chain })
  }, [])

  const handleStart = useCallback(() => {
    sfx.play('click')
    const w = worldRef.current
    const keepW = w.W
    const keepH = w.H
    const keepT = w.t
    Object.assign(w, makeWorld())
    w.W = keepW
    w.H = keepH
    w.t = keepT
    w.startT = w.t
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
    if (w.score > 0) {
      setBest(gameId, 'best-score', w.score)
      addXp(Math.max(1, Math.floor(w.score / 10)))
    }
    if (w.score >= 150) unlockBadge('fruit-150')
    sfx.play('lose')
    setResult({ score: w.score, sliced: w.fruitsSliced, bestChain: w.bestChain, isRecord })
    setPhase('over')
  }, [addXp, setBest, unlockBadge])

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
      const apex = w.H * (0.66 + Math.random() * 0.28)
      const speedMul = 1 + Math.min(elapsed / 300, 0.35)
      w.fruits.push({
        id: w.nextId++,
        emoji: def ? def.emoji : SOAP.emoji,
        x,
        y: w.H + r + 6,
        vx: ((w.W / 2 - x) * 0.45 + (Math.random() - 0.5) * 140) * speedMul,
        vy: -Math.sqrt(2 * gravity() * apex) * speedMul,
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
      const px = -Math.sin(ang)
      const py = Math.cos(ang)
      for (const side of [-1, 1]) {
        w.halves.push({
          emoji: f.emoji,
          x: f.x + px * side * f.r * 0.4,
          y: f.y + py * side * f.r * 0.4,
          vx: f.vx * 0.55 + px * side * 190,
          vy: f.vy * 0.55 + py * side * 190 - 60,
          r: f.r,
          rot: ang,
          vr: side * 3.2,
          side,
          life: 0.9,
        })
      }
      if (!reduceRef.current) {
        for (let i = 0; i < 9; i++) {
          const a = Math.random() * Math.PI * 2
          const sp = 50 + Math.random() * 200
          w.juices.push({
            x: f.x, y: f.y,
            vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60,
            r: 2 + Math.random() * 4,
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
        w.pops.push({ x: f.x, y: f.y - 10, text: L[langRef.current].lostLife, life: 1, max: 1, color: '#d9553f', size: 20 })
        if (w.lives <= 0) {
          finishDeath()
        }
      } else {
        w.fruitsSliced++
        w.chain = now - w.lastSlice <= 350 ? w.chain + 1 : 1
        w.lastSlice = now
        w.bestChain = Math.max(w.bestChain, w.chain)
        let gained = f.points
        if (w.chain >= 3) {
          const bonus = w.chain * 10
          gained += bonus
          sfx.play('coin')
          w.pops.push({
            x: f.x, y: f.y - 34,
            text: `COMBO ×${w.chain} +${bonus}`,
            life: 1.1, max: 1.1, color: '#b45309', size: 19,
          })
        } else {
          sfx.play('slice')
        }
        w.score += gained
        w.pops.push({ x: f.x, y: f.y - 6, text: `+${gained}`, life: 0.85, max: 0.85, color: '#7c4a1e', size: 15 })
        if (w.chain >= 4) unlockBadge('fruit-combo-4')
        // Défi du jour
        if (!dailyDoneRef.current && w.score >= dailyTarget) {
          completeDaily(gameId)
          sfx.play('win')
          setConfetti((k) => k + 1)
        }
      }
      pushHud()
    }

    /* ----- entrées ----- */
    const rectPos = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onDown = (e: PointerEvent) => {
      if (phaseRef.current === 'over') {
        handleStart()
        return
      }
      if (phaseRef.current !== 'playing') return
      const p = rectPos(e)
      w.swipe = { active: true, x: p.x, y: p.y, t: performance.now() }
      w.trail.push({ x: p.x, y: p.y, t: performance.now() })
      cv.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!w.swipe.active || phaseRef.current !== 'playing') return
      const now = performance.now()
      const p = rectPos(e)
      const dt = now - w.swipe.t
      const dist = Math.hypot(p.x - w.swipe.x, p.y - w.swipe.y)
      // Seuil : ~6 px par frame (0,36 px/ms) pour que la lame coupe
      if (dt > 0 && dist / dt > 0.36 && dist >= 3) {
        const ang = Math.atan2(p.y - w.swipe.y, p.x - w.swipe.x)
        for (const f of [...w.fruits]) {
          if (segCircle(w.swipe.x, w.swipe.y, p.x, p.y, f.x, f.y, f.r * 0.95)) {
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
    const onUp = () => { w.swipe.active = false }
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
        w.fruits = w.fruits.filter((f) => f.y < w.H + f.r + 60)
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
      // Fruits manqués : casse le combo, rien de plus
      const before = w.fruits.length
      w.fruits = w.fruits.filter((f) => f.y < w.H + f.r + 40)
      if (w.fruits.length < before && w.chain > 0) {
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
        if (h.life <= 0 || h.y > w.H + 90) w.halves.splice(i, 1)
      }
      for (let i = w.juices.length - 1; i >= 0; i--) {
        const j = w.juices[i]
        j.vy += 700 * dt
        j.x += j.vx * dt
        j.y += j.vy * dt
        j.life -= dt
        if (j.life <= 0) w.juices.splice(i, 1)
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      // Secousse à l'erreur (désactivée si mouvement réduit)
      if (w.flash > 0.55 && !reduceRef.current) {
        ctx.translate((Math.random() - 0.5) * 6 * w.flash, (Math.random() - 0.5) * 6 * w.flash)
      }
      if (bg) ctx.drawImage(bg, 0, 0, W, H)

      // Trainée lumineuse du geste
      if (!reduceRef.current && w.trail.length > 1) {
        ctx.save()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        for (let i = 1; i < w.trail.length; i++) {
          const a = i / w.trail.length
          ctx.strokeStyle = `rgba(255,246,220,${0.7 * a})`
          ctx.lineWidth = 2 + 7 * a
          ctx.shadowColor = 'rgba(247,200,115,0.9)'
          ctx.shadowBlur = 12
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
        const cr = h.r * 1.6
        ctx.beginPath()
        ctx.rect(-cr, h.side < 0 ? -cr : 0, cr * 2, cr)
        ctx.clip()
        ctx.font = emojiFont(h.r * 2)
        ctx.fillText(h.emoji, 0, 0)
        ctx.restore()
      }

      // Fruits et savons
      for (const f of w.fruits) {
        ctx.save()
        ctx.translate(f.x, f.y)
        ctx.rotate(f.rot)
        ctx.font = emojiFont(f.r * 2)
        ctx.fillText(f.emoji, 0, 0)
        if (f.soap) {
          ctx.fillStyle = 'rgba(217,140,179,0.3)'
          ctx.beginPath()
          ctx.arc(0, 0, f.r + 7, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      // Textes flottants
      for (const p of w.pops) {
        ctx.globalAlpha = clamp(p.life / p.max, 0, 1)
        ctx.fillStyle = p.color
        ctx.font = `800 ${p.size}px "Nunito", system-ui, sans-serif`
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
      w.t += dt
      update(dt, now)
      draw()
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
  }, [completeDaily, dailyTarget, finishDeath, handleStart, pushHud, unlockBadge])

  /* ================= Rendu React ================= */
  return (
    <div className="relative select-none">
      <Confetti fire={confetti} count={reduce ? 0 : 90} />

      {/* Barre d'état */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {phase === 'playing' ? (
          <>
            <StatChip icon="⭐" label={T.score} value={hud.score} />
            <div className="flex h-11 items-center gap-1.5 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold" aria-label={T.lives}>
              <span className="text-muted-foreground">{T.lives}</span>
              <span className="flex gap-0.5" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <Heart key={i} className={cn('h-4 w-4', i < hud.lives ? 'fill-rose-500 text-rose-500' : 'text-foreground/20')} />
                ))}
              </span>
            </div>
            {hud.chain >= 2 ? <StatChip icon="🔥" label={T.combo} value={`×${hud.chain}`} /> : null}
            {!dailyDone ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                🎯 {T.daily.replace('{n}', String(dailyTarget))}
              </span>
            ) : null}
          </>
        ) : (
          <>
            {hydrated && bestScore > 0 ? <StatChip icon="⭐" label={`${T.score} — ${T.best}`} value={bestScore} /> : null}
            {!dailyDone ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                🎯 {T.daily.replace('{n}', String(dailyTarget))}
              </span>
            ) : null}
          </>
        )}
      </div>

      {/* Canvas + habillage */}
      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-2xl border shadow-inner">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none"
          style={{ touchAction: 'none' }}
          aria-label="Fruit Slice"
        />

        {/* Écran d'accueil */}
        {phase === 'idle' ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-stone-900/40 p-6 text-center backdrop-blur-[2px]">
            <div className="flex gap-2" aria-hidden="true">
              {['🍉', '🔪', '🍎'].map((e, i) => (
                <span key={i} className="text-4xl anim-floaty" style={{ animationDelay: `${i * 0.4}s` }}>{e}</span>
              ))}
            </div>
            <h3 className="font-display text-2xl font-extrabold text-white drop-shadow">🍉 {T.title}</h3>
            <p className="max-w-sm text-sm text-stone-100">{content.tagline[lang]}</p>
            <p className="max-w-xs rounded-xl bg-white/15 px-3 py-2 text-xs text-stone-100">{T.hint}</p>
            <Button size="lg" className="h-12 rounded-full px-7 text-base anim-glow" onClick={handleStart}>
              <Play className="h-5 w-5" aria-hidden="true" /> {T.play}
            </Button>
          </div>
        ) : null}

        {/* Game over */}
        {phase === 'over' && result ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-900/55 p-4 backdrop-blur-[2px]">
            <div className="anim-rise w-full max-w-sm rounded-2xl border bg-card p-6 text-center shadow-xl">
              <p className="font-display text-xl font-extrabold">🍉 {T.over}</p>
              <p className="mt-3 text-5xl font-extrabold tabular-nums text-primary">{result.score}</p>
              <p className="text-xs text-muted-foreground">{T.score}</p>
              <div className="mt-3 flex justify-center gap-3 text-sm">
                <span className="rounded-xl bg-secondary/70 px-3 py-2">
                  <Swords className="mr-1 inline h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="font-bold tabular-nums">{result.sliced}</span> <span className="text-muted-foreground">{T.fruitsSliced}</span>
                </span>
                <span className="rounded-xl bg-secondary/70 px-3 py-2">
                  🔥 <span className="font-bold tabular-nums">×{result.bestChain}</span> <span className="text-muted-foreground">{T.bestCombo}</span>
                </span>
              </div>
              {result.isRecord ? (
                <p className="mt-3 text-sm font-bold text-amber-600 dark:text-amber-400">🏆 {T.newBest}</p>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  {T.best} : <span className="font-bold tabular-nums">{Math.max(bestScore, result.score)}</span>
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">{T.tip}</p>
              <div className="mt-4 flex justify-center">
                <Button size="lg" className="h-12 rounded-full px-8" onClick={handleStart}>
                  <RotateCcw className="h-5 w-5" aria-hidden="true" /> {T.replay}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
