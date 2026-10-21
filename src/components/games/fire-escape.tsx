'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, Droplets, Ruler } from 'lucide-react'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { useHydrated, useReducedMotion, clamp, todayKey, mulberry32, seedFromString } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { StatChip } from '@/components/shared/ui-bits'
import { Confetti } from '@/components/shared/confetti'

export const gameId = 'fire-escape'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Montez toujours plus haut à travers les flammes, d’un seul geste : maintenez pour monter, relâchez pour descendre.',
    en: 'Climb ever higher through the flames with a single gesture: hold to rise, release to fall.',
  },
  description: {
    fr: [
      'Le Pompier de Gran (Fire Escape) est un jeu de réflexes vertical gratuit dans lequel vous guidez un pompier qui escalade un immeuble en flammes. Maintenez l’écran pour activer la propulsion et grimper, relâchez pour retomber : toute la partie se joue avec un seul doigt.',
      'Des flammes jaillissent des murs de gauche et de droite en laissant toujours un couloir franchissable, de plus en plus étroit avec l’altitude. À partir de 150 m, des poutres brûlantes balayent horizontalement le couloir. Collectez les gouttes d’eau pour 50 points bonus chacune. Le score se mesure en mètres gravitis.',
      'La vitesse de montée augmente doucement avec la distance : le jeu reste prévisible, jamais injuste. Votre record de distance est sauvegardé sur votre appareil, avec un défi du jour différent chaque matin et des succès à débloquer (500 m, 1 500 m).',
    ],
    en: [
      'Gran’s Firefighter (Fire Escape) is a free vertical reflex game in which you steer a firefighter climbing a burning building. Hold the screen to fire the thruster and rise, release to fall: the whole game plays with a single finger.',
      'Flames jut out from the left and right walls, always leaving a passable corridor that narrows with altitude. From 150 m up, burning beams sweep horizontally across the corridor. Collect water drops for 50 bonus points each. Your score is measured in meters climbed.',
      'The climb speed rises gently with distance: the game stays predictable, never unfair. Your distance record is saved on your device, along with a different daily challenge every morning and achievements to unlock (500 m, 1,500 m).',
    ],
  },
  rules: {
    fr: [
      'Maintenez l’écran (ou la barre d’espace) : le pompier monte.',
      'Relâchez : il retombe sous l’effet de la gravité.',
      'Glissez horizontalement tout en maintenant pour vous déplacer à gauche ou à droite.',
      'Passez dans les couloirs laissés libres entre les flammes des deux murs.',
      'Ramassez les gouttes d’eau 💧 : +50 points chacune.',
      'Évitez les flammes, les poutres balayantes et le brasier du bas de l’écran.',
      'Le score se compte en mètres : la vitesse augmente doucement avec l’altitude.',
    ],
    en: [
      'Hold the screen (or the space bar): the firefighter rises.',
      'Release: gravity pulls him back down.',
      'Drag horizontally while holding to steer left or right.',
      'Fly through the corridors left open between the flames on both walls.',
      'Pick up water drops 💧: +50 points each.',
      'Avoid the flames, the sweeping beams and the blaze at the bottom of the screen.',
      'Your score counts in meters: the speed rises gently with altitude.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : maintenez n’importe où sur le jeu, glissez à gauche/droite pour diriger.',
      'Ordinateur : maintenez le bouton de la souris et déplacez-la, ou utilisez la barre d’espace + les flèches ← →.',
      'Après une défaite, touchez le jeu ou « Rejouer » pour repartir immédiatement.',
    ],
    en: [
      'Mobile & tablet: press and hold anywhere on the game, drag left/right to steer.',
      'Desktop: hold the mouse button and move it, or use the space bar + the ← → arrow keys.',
      'After a crash, tap the game or “Play again” to restart instantly.',
    ],
  },
  features: {
    fr: [
      'Commande à un seul geste : maintenez pour monter, relâchez pour descendre',
      'Couloirs toujours franchissables, de plus en plus étroits',
      'Poutres mobiles et gouttes d’eau à collecter au-delà de 150 m',
      'Vitesse progressive, sans frustration artificielle',
      'Record de distance sauvegardé sur votre appareil',
      'Défi du jour déterministe et succès 500 m / 1 500 m',
    ],
    en: [
      'One-gesture control: hold to rise, release to fall',
      'Always-passable corridors that grow tighter over time',
      'Moving beams and water drops to collect past 150 m',
      'Progressive speed with no artificial frustration',
      'Distance record saved on your device',
      'Deterministic daily challenge and 500 m / 1,500 m achievements',
    ],
  },
  tips: {
    fr: [
      'Alternez rapidement maintenir/relâcher pour rester à hauteur constante : c’est la clé pour attendre le bon moment devant un couloir étroit.',
      'Les flammes vacillent visuellement, mais leur zone de danger est fixe : fiez-vous à la base des flammes, pas à leurs pointes.',
      'Repérez le couloir suivant dès que le précédent est franchi : un demi-écran d’avance suffit pour se placer.',
      'Les gouttes d’eau sont toujours placées dans les passages sûrs : les viser est un bon moyen de rester sur la bonne trajectoire.',
    ],
    en: [
      'Pulse hold/release quickly to hover at a constant height: it is the key to waiting for the right moment in front of a tight corridor.',
      'Flames flicker visually but their danger zone is fixed: trust the base of the flames, not their tips.',
      'Spot the next corridor as soon as you clear the previous one: half a screen of lookahead is enough to line up.',
      'Water drops always sit in safe passages: aiming for them is a great way to stay on the correct line.',
    ],
  },
  faq: {
    fr: [
      { q: 'Le jeu devient-il impossible à haute altitude ?', a: 'Non. Les couloirs rétrécissent et la vitesse augmente, mais chaque passage reste franchissable : la génération garantit toujours un couloir plus large que le pompier, avec un espacement atteignable.' },
      { q: 'Comment est calculé le score ?', a: 'Le score principal est la distance grimpée, en mètres (10 pixels = 1 mètre). Les gouttes d’eau ajoutent 50 points bonus chacune, affichés séparément.' },
      { q: 'Pourquoi le pompier descend-il quand je ne touche pas l’écran ?', a: 'C’est le principe du jeu : la gravité est permanente et le monde défile vers le bas. Maintenir active la propulsion qui vous fait monter plus vite que le défilement.' },
      { q: 'Le défi du jour est-il le même pour tous les joueurs ?', a: 'Oui : l’objectif du jour (250, 400 ou 600 m selon la date) est généré de façon déterministe à partir de la date, identique pour tous jusqu’au lendemain.' },
      { q: 'Puis-je jouer au clavier ?', a: 'Oui : barre d’espace pour monter, flèches gauche/droite pour se diriger. Le jeu reste jouable à la souris ou au doigt.' },
    ],
    en: [
      { q: 'Does the game become impossible at high altitude?', a: 'No. Corridors narrow and speed increases, but every passage remains passable: generation always guarantees a corridor wider than the firefighter, with reachable spacing.' },
      { q: 'How is the score calculated?', a: 'The main score is the distance climbed, in meters (10 pixels = 1 meter). Water drops each add 50 bonus points, shown separately.' },
      { q: 'Why does the firefighter fall when I’m not touching the screen?', a: 'That is the core of the game: gravity is permanent and the world scrolls downwards. Holding activates the thruster that makes you climb faster than the scroll.' },
      { q: 'Is the daily challenge the same for every player?', a: 'Yes: the day’s goal (250, 400 or 600 m depending on the date) is generated deterministically from the date, identical for everyone until the next morning.' },
      { q: 'Can I play with a keyboard?', a: 'Yes: space bar to climb, left/right arrows to steer. The game is equally playable with a mouse or a finger.' },
    ],
  },
  records: {
    'best-distance': { fr: 'Plus grande distance (m)', en: 'Greatest distance (m)' },
  },
}

/* ================= Textes UI ================= */
const L = {
  fr: {
    play: 'Grimper !', replay: 'Rejouer', distance: 'Distance', best: 'Record',
    water: 'Gouttes', over: 'Le pompier a besoin d’un repos !', meters: 'm',
    title: 'Le Pompier de Gran',
    hint: 'Maintenez pour monter, relâchez pour descendre, glissez pour diriger.',
    daily: 'Défi du jour : atteindre {n} m', dailyDone: 'Défi du jour réussi !',
    newBest: 'Nouveau record !', tip: 'Astuce : pulsez maintenir/relâcher pour rester à hauteur constante.',
    goal: 'Objectif', waterBonus: 'Bonus gouttes',
  },
  en: {
    play: 'Climb!', replay: 'Play again', distance: 'Distance', best: 'Best',
    water: 'Drops', over: 'The firefighter needs a rest!', meters: 'm',
    title: 'Gran’s Firefighter',
    hint: 'Hold to rise, release to fall, drag to steer.',
    daily: 'Daily challenge: reach {n} m', dailyDone: 'Daily challenge complete!',
    newBest: 'New record!', tip: 'Tip: pulse hold/release to hover at a constant height.',
    goal: 'Goal', waterBonus: 'Drop bonus',
  },
} as const

/* ================= Monde ================= */
interface Band {
  worldY: number
  leftLen: number
  rightLen: number
  h: number
  seed: number
}
interface Beam {
  worldY: number
  w: number
  h: number
  amp: number
  speed: number
  phase: number
}
interface Drop { worldY: number; x: number; taken: boolean }
interface Ember { x: number; y: number; vy: number; r: number; life: number; max: number }
interface Pop { x: number; y: number; text: string; life: number; max: number; color: string; size: number }

interface World {
  W: number; H: number; t: number
  scroll: number
  px: number; py: number; pvy: number
  holding: boolean
  targetX: number
  hasPointer: boolean
  keys: { left: boolean; right: boolean }
  bands: Band[]
  beams: Beam[]
  drops: Drop[]
  embers: Ember[]
  pops: Pop[]
  nextBandY: number
  prevGapX: number
  water: number
  distM: number
  emberT: number
  dead: boolean
}

function makeWorld(): World {
  return {
    W: 320, H: 240, t: 0,
    scroll: 0,
    px: 160, py: 160, pvy: 0,
    holding: false, targetX: 160, hasPointer: false,
    keys: { left: false, right: false },
    bands: [], beams: [], drops: [], embers: [], pops: [],
    nextBandY: 0, prevGapX: 0,
    water: 0, distM: 0, emberT: 0,
    dead: false,
  }
}

function resetWorld(w: World) {
  w.scroll = 0
  w.px = w.W / 2
  w.py = w.H * 0.62
  w.pvy = -60
  w.holding = false
  w.hasPointer = false
  w.keys.left = false
  w.keys.right = false
  w.bands = []
  w.beams = []
  w.drops = []
  w.embers = []
  w.pops = []
  w.nextBandY = w.H * 1.35
  w.prevGapX = w.W / 2
  w.water = 0
  w.distM = 0
  w.dead = false
}

/* ================= Helpers dessin ================= */
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
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#5e2a1b')
  g.addColorStop(0.5, '#4a2115')
  g.addColorStop(1, '#33150d')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  // Vignette terracotta sombre sur les bords
  const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.max(W, H) * 0.8)
  v.addColorStop(0, 'rgba(0,0,0,0)')
  v.addColorStop(1, 'rgba(20,8,4,0.55)')
  ctx.fillStyle = v
  ctx.fillRect(0, 0, W, H)
}

function drawBricks(ctx: CanvasRenderingContext2D, W: number, H: number, scroll: number) {
  const layers = [
    { f: 0.22, a: 0.045, rowH: 46, bw: 64 },
    { f: 0.5, a: 0.08, rowH: 60, bw: 78 },
  ]
  for (const L2 of layers) {
    ctx.fillStyle = `rgba(222,164,110,${L2.a})`
    const off = (scroll * L2.f) % L2.rowH
    let rowIdx = -Math.ceil(H / L2.rowH) - 1
    for (let y = -L2.rowH + off; y < H + L2.rowH; y += L2.rowH) {
      const shift = rowIdx % 2 === 0 ? 0 : L2.bw / 2
      for (let x = -L2.bw + shift; x < W + L2.bw; x += L2.bw) {
        rr(ctx, x, y, L2.bw - 5, L2.rowH - 5, 3)
        ctx.fill()
      }
      rowIdx++
    }
  }
}

function flameTongue(
  ctx: CanvasRenderingContext2D, baseX: number, dir: number, ty: number,
  tl: number, th: number, t: number, seed: number, reduce: boolean,
) {
  const tipX = baseX + dir * tl
  const wave = reduce ? 0 : Math.sin(t * 7 + seed) * th * 0.28
  ctx.beginPath()
  ctx.moveTo(baseX, ty - th)
  ctx.quadraticCurveTo(baseX + dir * tl * 0.35, ty - th - wave, tipX, ty - th * 0.12)
  ctx.quadraticCurveTo(baseX + dir * tl * 0.3, ty + th * 0.65, baseX, ty + th)
  ctx.closePath()
  ctx.fill()
}

function drawFlames(
  ctx: CanvasRenderingContext2D, W: number, y: number,
  leftLen: number, rightLen: number, h: number,
  t: number, seed: number, reduce: boolean,
) {
  // Halo chaleureux
  for (const [len, side] of [[leftLen, -1], [rightLen, 1]] as [number, number][]) {
    if (len < 8) continue
    const cx = side < 0 ? len * 0.55 : W - len * 0.55
    const g = ctx.createRadialGradient(cx, y, 4, cx, y, Math.max(len * 0.75, 30))
    g.addColorStop(0, 'rgba(246,194,106,0.30)')
    g.addColorStop(1, 'rgba(246,194,106,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, y - h * 1.6, W, h * 3.2)
  }
  const layers = [
    { c: '#a83226', s: 1 },
    { c: '#e0702c', s: 0.72 },
    { c: '#f6c26a', s: 0.44 },
  ]
  for (const [len, side] of [[leftLen, -1], [rightLen, 1]] as [number, number][]) {
    if (len < 8) continue
    const dir = side < 0 ? 1 : -1
    const baseX = side < 0 ? 1 : W - 1
    // Socle brûlé au mur
    ctx.fillStyle = '#46281a'
    rr(ctx, side < 0 ? 0 : W - 9, y - h / 2 - 4, 9, h + 8, 3)
    ctx.fill()
    for (const layer of layers) {
      ctx.fillStyle = layer.c
      for (let i = 0; i < 3; i++) {
        const ty = y + (i - 1) * h * 0.3
        const scale = i === 1 ? 1 : 0.76
        const tl = len * layer.s * scale * (reduce ? 1 : 1 + Math.sin(t * 9 + i * 2.1 + seed) * 0.08)
        const th = h * 0.3 * (i === 1 ? 1.12 : 0.82)
        flameTongue(ctx, baseX, dir, ty, tl, th, t, seed + i * 1.7, reduce)
      }
    }
  }
}

function drawFirefighter(
  ctx: CanvasRenderingContext2D, x: number, y: number,
  vy: number, holding: boolean, t: number, reduce: boolean,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(clamp(vy * 0.00045, -0.25, 0.3))
  // Jet de propulsion
  if (holding && !reduce) {
    for (let i = 0; i < 3; i++) {
      const p = (t * 2.6 + i * 0.33) % 1
      ctx.globalAlpha = (1 - p) * 0.55
      ctx.fillStyle = '#f4f1ea'
      ctx.beginPath()
      ctx.arc((i - 1) * 5, 23 + p * 15, 3 + p * 4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }
  // Bonbonne (accent violet)
  ctx.fillStyle = '#9b8cf2'
  rr(ctx, -14, -12, 7, 20, 3)
  ctx.fill()
  // Jambes
  ctx.fillStyle = '#6b4a2f'
  rr(ctx, -6, 8, 5, 10, 2.5)
  ctx.fill()
  rr(ctx, 2, 8, 5, 10, 2.5)
  ctx.fill()
  // Veste
  ctx.fillStyle = '#f2a65a'
  rr(ctx, -9, -10, 19, 22, 6)
  ctx.fill()
  // Bande réfléchissante
  ctx.fillStyle = '#f6e3c2'
  rr(ctx, -9, -1, 19, 4, 2)
  ctx.fill()
  // Bras
  ctx.fillStyle = '#e08c3c'
  rr(ctx, 8, -8, 5, 12, 2.5)
  ctx.fill()
  // Tête
  ctx.fillStyle = '#f5cba0'
  ctx.beginPath()
  ctx.arc(2, -17, 7.5, 0, Math.PI * 2)
  ctx.fill()
  // Casque
  ctx.fillStyle = '#d9553f'
  ctx.beginPath()
  ctx.arc(2, -18, 8, Math.PI, 0)
  ctx.fill()
  rr(ctx, -8.5, -19, 21, 3.5, 1.75)
  ctx.fill()
  ctx.fillStyle = '#f6c26a'
  rr(ctx, 0.5, -23, 4, 3, 1)
  ctx.fill()
  ctx.restore()
}

/* ================= Composant ================= */
export default function FireEscapeGame() {
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
  const bestDist = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-distance']?.value ?? 0)

  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [hud, setHud] = useState({ dist: 0, water: 0 })
  const [result, setResult] = useState<null | { dist: number; water: number; isRecord: boolean }>(null)
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

  /* Défi du jour déterministe : 250 / 400 / 600 m selon la date */
  const dailyTarget = (() => {
    const r = mulberry32(seedFromString(`fire-escape:${todayKey()}`))
    return [250, 400, 600][Math.floor(r() * 3)]
  })()

  const pushHud = useCallback(() => {
    const w = worldRef.current
    setHud({ dist: Math.floor(w.scroll / 10), water: w.water })
  }, [])

  const handleStart = useCallback(() => {
    sfx.play('click')
    const w = worldRef.current
    resetWorld(w)
    addPlay(gameId)
    setResult(null)
    setHud({ dist: 0, water: 0 })
    setPhase('playing')
  }, [addPlay])

  const finishDeath = useCallback(() => {
    const w = worldRef.current
    w.dead = true
    const dist = Math.floor(w.scroll / 10)
    const prevBest = useProfileStore.getState().profile.games[gameId]?.records?.['best-distance']?.value ?? 0
    const isRecord = dist > prevBest && dist > 0
    if (dist > 0) setBest(gameId, 'best-distance', dist)
    addXp(Math.max(1, Math.floor(dist / 20)))
    if (dist >= 500) unlockBadge('fire-500')
    if (dist >= 1500) unlockBadge('fire-1500')
    sfx.play('lose')
    setResult({ dist, water: w.water, isRecord })
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
    resetWorld(w)

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
      w.holding = true
      w.hasPointer = true
      w.targetX = p.x
      cv.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!w.holding) return
      const p = rectPos(e)
      w.targetX = p.x
    }
    const onUp = () => {
      w.holding = false
      w.hasPointer = false
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'playing') return
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        w.holding = true
      }
      if (e.code === 'ArrowLeft') { e.preventDefault(); w.keys.left = true }
      if (e.code === 'ArrowRight') { e.preventDefault(); w.keys.right = true }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') w.holding = false
      if (e.code === 'ArrowLeft') w.keys.left = false
      if (e.code === 'ArrowRight') w.keys.right = false
    }
    const onCtx = (e: Event) => e.preventDefault()
    const onVis = () => { pausedRef.current = document.hidden }

    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointercancel', onUp)
    cv.addEventListener('contextmenu', onCtx)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    document.addEventListener('visibilitychange', onVis)

    /* ----- génération des obstacles ----- */
    const genObstacles = () => {
      const distM = w.scroll / 10
      while (w.nextBandY < w.scroll + w.H * 1.6) {
        const spacing = 350 - Math.min(distM * 0.04, 60)
        const gapW = w.W * clamp(0.46 - distM * 0.00013, 0.26, 0.46)
        let gapX = w.prevGapX + (Math.random() - 0.5) * w.W * 0.55
        gapX = clamp(gapX, w.W * 0.07, w.W * 0.93 - gapW)
        w.prevGapX = gapX
        const band: Band = {
          worldY: w.nextBandY,
          leftLen: Math.max(gapX - 6, 4),
          rightLen: Math.max(w.W - (gapX + gapW) - 6, 4),
          h: 46 + Math.min(distM * 0.012, 30),
          seed: Math.random() * 10,
        }
        w.bands.push(band)
        // Poutre mobile au-delà de 150 m (une fois sur trois)
        if (distM > 150 && w.bands.length % 3 === 0) {
          const bw = w.W * 0.4
          w.beams.push({
            worldY: w.nextBandY + spacing * 0.5,
            w: bw,
            h: 20,
            amp: (w.W - bw) / 2,
            speed: 0.8 + Math.random() * 0.6,
            phase: Math.random() * Math.PI * 2,
          })
        }
        // Goutte d'eau dans le couloir
        if (Math.random() < 0.55) {
          w.drops.push({
            worldY: w.nextBandY + spacing * 0.5,
            x: clamp(gapX + gapW * (0.25 + Math.random() * 0.5), 20, w.W - 20),
            taken: false,
          })
        }
        w.nextBandY += spacing
      }
      // Nettoyage
      const cutoff = w.scroll - 120
      w.bands = w.bands.filter((b) => b.worldY > cutoff)
      w.beams = w.beams.filter((b) => b.worldY > cutoff)
      w.drops = w.drops.filter((d) => d.worldY > cutoff)
    }

    const beamX = (b: Beam) => (w.W - b.w) / 2 * (1 + Math.sin(w.t * b.speed + b.phase))

    /* ----- simulation ----- */
    const update = (dt: number) => {
      if (phaseRef.current !== 'playing' || w.dead) return
      const distM = w.scroll / 10
      const scrollSpeed = 150 + Math.min(distM * 0.3, 120)
      w.scroll += scrollSpeed * dt

      // Physique verticale
      w.pvy += (w.holding ? -2500 : 2000) * dt
      w.pvy = clamp(w.pvy, -470, 560)
      w.py += w.pvy * dt

      // Direction horizontale
      let steer: number | null = null
      if (w.holding && w.hasPointer) steer = w.targetX
      else if (w.keys.left) steer = w.px - 260 * dt
      else if (w.keys.right) steer = w.px + 260 * dt
      if (steer !== null) {
        const maxStep = 440 * dt
        w.px += clamp(steer - w.px, -maxStep, maxStep)
      }
      w.px = clamp(w.px, 16, w.W - 16)

      // Plafond : le pompier ne quitte pas l'écran par le haut
      if (w.py < 26) {
        w.py = 26
        if (w.pvy < 0) w.pvy = 0
      }
      // Pompier poussé hors de l'écran par le brasier du bas
      if (w.py > w.H - 14) {
        finishDeath()
        return
      }

      genObstacles()

      // Collisions flammes
      const pr = 13
      for (const b of w.bands) {
        const sy = w.H - (b.worldY - w.scroll)
        if (sy < -80 || sy > w.H + 80) continue
        if (Math.abs(w.py - sy) < b.h / 2 + pr * 0.7) {
          if (w.px < b.leftLen + pr * 0.7 || w.px > w.W - b.rightLen - pr * 0.7) {
            finishDeath()
            return
          }
        }
      }
      // Collisions poutres
      for (const b of w.beams) {
        const sy = w.H - (b.worldY - w.scroll)
        if (sy < -40 || sy > w.H + 40) continue
        if (Math.abs(w.py - sy) < b.h / 2 + pr * 0.7) {
          const bx = beamX(b)
          if (w.px > bx - pr * 0.6 && w.px < bx + b.w + pr * 0.6) {
            finishDeath()
            return
          }
        }
      }
      // Gouttes d'eau
      for (const d of w.drops) {
        if (d.taken) continue
        const sy = w.H - (d.worldY - w.scroll)
        if (sy < -30 || sy > w.H + 30) continue
        if (Math.hypot(w.px - d.x, w.py - sy) < 26) {
          d.taken = true
          w.water++
          sfx.play('coin')
          w.pops.push({ x: d.x, y: sy, text: '+50', life: 0.8, max: 0.8, color: '#eafaf1', size: 16 })
          pushHud()
        }
      }

      // Défi du jour
      const dm = Math.floor(w.scroll / 10)
      if (!dailyDoneRef.current && dm >= dailyTarget && dm > 0) {
        completeDaily(gameId)
        sfx.play('win')
        setConfetti((k) => k + 1)
        w.pops.push({
          x: w.W / 2, y: w.H * 0.3,
          text: `🏆 ${L[langRef.current].dailyDone}`,
          life: 1.6, max: 1.6, color: '#f6c26a', size: 18,
        })
      }

      // Braises
      w.emberT -= dt
      if (w.emberT <= 0 && !reduceRef.current) {
        w.emberT = 0.09
        w.embers.push({
          x: Math.random() * w.W,
          y: w.H + 6,
          vy: -(30 + Math.random() * 55),
          r: 1.5 + Math.random() * 2.5,
          life: 2.2, max: 2.2,
        })
      }
      for (let i = w.embers.length - 1; i >= 0; i--) {
        const e = w.embers[i]
        e.y += e.vy * dt
        e.x += Math.sin(w.t * 3 + e.r * 8) * 12 * dt
        e.life -= dt
        if (e.life <= 0) w.embers.splice(i, 1)
      }
      for (let i = w.pops.length - 1; i >= 0; i--) {
        const p = w.pops[i]
        p.y -= 30 * dt
        p.life -= dt
        if (p.life <= 0) w.pops.splice(i, 1)
      }

      const newDist = Math.floor(w.scroll / 10)
      if (newDist !== w.distM) {
        w.distM = newDist
        pushHud()
      }
    }

    /* ----- rendu ----- */
    const draw = () => {
      const W = w.W, H = w.H
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      if (bg) ctx.drawImage(bg, 0, 0, W, H)
      drawBricks(ctx, W, H, w.scroll)

      // Gouttes d'eau
      ctx.font = '20px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",system-ui,sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const d of w.drops) {
        if (d.taken) continue
        const sy = H - (d.worldY - w.scroll)
        if (sy < -30 || sy > H + 30) continue
        ctx.fillText('💧', d.x, sy)
      }

      // Poutres
      for (const b of w.beams) {
        const sy = H - (b.worldY - w.scroll)
        if (sy < -60 || sy > H + 60) continue
        const bx = beamX(b)
        const g = ctx.createLinearGradient(bx, sy - b.h / 2, bx + b.w, sy + b.h / 2)
        g.addColorStop(0, '#5c3320')
        g.addColorStop(0.5, '#7a4527')
        g.addColorStop(1, '#5c3320')
        ctx.fillStyle = g
        rr(ctx, bx, sy - b.h / 2, b.w, b.h, 5)
        ctx.fill()
        ctx.fillStyle = 'rgba(246,194,106,0.5)'
        rr(ctx, bx + 4, sy - b.h / 2 + 2, b.w - 8, 3, 1.5)
        ctx.fill()
      }

      // Flammes
      for (const b of w.bands) {
        const sy = H - (b.worldY - w.scroll)
        if (sy < -H * 0.4 || sy > H + 120) continue
        drawFlames(ctx, W, sy, b.leftLen, b.rightLen, b.h, w.t, b.seed, reduceRef.current)
      }

      // Brasier du bas
      const fireY = H - 6
      const fg = ctx.createLinearGradient(0, H - 46, 0, H)
      fg.addColorStop(0, 'rgba(224,112,44,0)')
      fg.addColorStop(0.5, 'rgba(224,112,44,0.55)')
      fg.addColorStop(1, 'rgba(168,50,38,0.9)')
      ctx.fillStyle = fg
      ctx.fillRect(0, H - 46, W, 46)

      // Braises
      for (const e of w.embers) {
        ctx.globalAlpha = clamp(e.life / e.max, 0, 1) * 0.8
        ctx.fillStyle = '#f6c26a'
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Pompier
      drawFirefighter(ctx, w.px, w.py, w.pvy, w.holding, w.t, reduceRef.current)

      // Textes flottants
      for (const p of w.pops) {
        ctx.globalAlpha = clamp(p.life / p.max, 0, 1)
        ctx.fillStyle = p.color
        ctx.font = `800 ${p.size}px "Nunito", system-ui, sans-serif`
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
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [dailyTarget, finishDeath, handleStart, pushHud, completeDaily])

  /* ================= Rendu React ================= */
  return (
    <div className="relative select-none">
      <Confetti fire={confetti} count={reduce ? 0 : 90} />

      {/* Barre d'état */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {phase === 'playing' ? (
          <>
            <StatChip icon="📏" label={T.distance} value={`${hud.dist} ${T.meters}`} />
            <StatChip icon="💧" label={T.water} value={`+${hud.water * 50}`} />
            {!dailyDone ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                🎯 {T.daily.replace('{n}', String(dailyTarget))}
              </span>
            ) : null}
          </>
        ) : (
          <>
            {hydrated && bestDist > 0 ? <StatChip icon="📏" label={`${T.distance} — ${T.best}`} value={`${bestDist} ${T.meters}`} /> : null}
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
          aria-label="Fire Escape"
        />

        {/* Écran d'accueil */}
        {phase === 'idle' ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-stone-900/45 p-6 text-center backdrop-blur-[2px]">
            <div className="flex gap-2" aria-hidden="true">
              {['🧑‍🚒', '🔥', '💧'].map((e, i) => (
                <span key={i} className="text-4xl anim-floaty" style={{ animationDelay: `${i * 0.4}s` }}>{e}</span>
              ))}
            </div>
            <h3 className="font-display text-2xl font-extrabold text-white drop-shadow">🚒 {T.title}</h3>
            <p className="max-w-sm text-sm text-stone-100">{content.tagline[lang]}</p>
            <p className="max-w-xs rounded-xl bg-white/15 px-3 py-2 text-xs text-stone-100">{T.hint}</p>
            <Button size="lg" className="h-12 rounded-full px-7 text-base anim-glow" onClick={handleStart}>
              <Play className="h-5 w-5" aria-hidden="true" /> {T.play}
            </Button>
          </div>
        ) : null}

        {/* Game over */}
        {phase === 'over' && result ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-[2px]">
            <div className="anim-rise w-full max-w-sm rounded-2xl border bg-card p-6 text-center shadow-xl">
              <p className="font-display text-xl font-extrabold">🔥 {T.over}</p>
              <div className="mt-4 flex items-end justify-center gap-6">
                <div>
                  <p className="text-4xl font-extrabold tabular-nums text-primary">{result.dist}</p>
                  <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Ruler className="h-3.5 w-3.5" aria-hidden="true" /> {T.distance} ({T.meters})
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">{result.water * 50}</p>
                  <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Droplets className="h-3.5 w-3.5" aria-hidden="true" /> {T.waterBonus}
                  </p>
                </div>
              </div>
              {result.isRecord ? (
                <p className="mt-3 text-sm font-bold text-amber-600 dark:text-amber-400">🏆 {T.newBest}</p>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  {T.best} : <span className="font-bold tabular-nums">{Math.max(bestDist, result.dist)} {T.meters}</span>
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
