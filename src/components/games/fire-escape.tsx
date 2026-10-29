'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Play, RotateCcw, Droplets, Ruler, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { useHydrated, useReducedMotion, clamp, todayKey, mulberry32, seedFromString } from '@/lib/utils-game'
import { computeIq } from '@/lib/games/iq'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'
import { IqChallengeBanner } from '@/components/game/iq-banner'
import { useJuice } from '@/components/game/fx'

export const gameId = 'fire-escape'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Montez toujours plus haut à travers les flammes, d’un seul geste — et révélez votre QI estimé à chaque chute.',
    en: 'Climb ever higher through the flames with a single gesture — and reveal your estimated IQ with every crash.',
  },
  description: {
    fr: [
      'Le Pompier de Gran (Fire Escape) est un jeu de réflexes vertical gratuit dans lequel vous guidez un pompier qui escalade un immeuble en flammes. Maintenez l’écran pour activer la propulsion et grimper, relâchez pour retomber : toute la partie se joue avec un seul doigt.',
      'Des flammes jaillissent des murs de gauche et de droite en laissant toujours un couloir franchissable, de plus en plus étroit avec l’altitude. À partir de 150 m, des poutres brûlantes balayent horizontalement le couloir. Collectez les gouttes d’eau pour 50 points bonus chacune. Le score se mesure en mètres gravitis. En fin de course, un QI estimé — fonction de la distance atteinte, rapportée au par de 600 mètres — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'La vitesse de montée augmente doucement avec la distance : le jeu reste prévisible, jamais injuste. Chaque palier de 100 m est célébré, votre record de distance est sauvegardé sur votre appareil, avec un défi du jour différent chaque matin et des succès à débloquer (500 m, 1 500 m).',
    ],
    en: [
      'Gran’s Firefighter (Fire Escape) is a free vertical reflex game in which you steer a firefighter climbing a burning building. Hold the screen to fire the thruster and rise, release to fall: the whole game plays with a single finger.',
      'Flames jut out from the left and right walls, always leaving a passable corridor that narrows with altitude. From 150 m up, burning beams sweep horizontally across the corridor. Collect water drops for 50 bonus points each. Your score is measured in meters climbed. At the end of each run, an estimated IQ — based on the distance you reached, measured against a 600-metre par — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'The climb speed rises gently with distance: the game stays predictable, never unfair. Every 100 m milestone is celebrated, your distance record is saved on your device, along with a different daily challenge every morning and achievements to unlock (500 m, 1,500 m).',
    ],
  },
  rules: {
    fr: [
      'Maintenez l’écran (ou la barre d’espace) : le pompier monte.',
      'Relâchez : il retombe sous l’effet de la gravité.',
      'Glissez horizontalement tout en maintenant pour vous déplacer à gauche ou à droite — le déplacement est relatif, le pompier ne saute jamais sous votre doigt.',
      'Passez dans les couloirs laissés libres entre les flammes des deux murs.',
      'Ramassez les gouttes d’eau 💧 : +50 points chacune.',
      'Évitez les flammes, les poutres balayantes et le brasier du bas de l’écran.',
      'Le score se compte en mètres : la vitesse augmente doucement avec l’altitude, et chaque palier de 100 m est célébré.',
    ],
    en: [
      'Hold the screen (or the space bar): the firefighter rises.',
      'Release: gravity pulls him back down.',
      'Drag horizontally while holding to steer left or right — steering is relative, the firefighter never jumps under your finger.',
      'Fly through the corridors left open between the flames on both walls.',
      'Pick up water drops 💧: +50 points each.',
      'Avoid the flames, the sweeping beams and the blaze at the bottom of the screen.',
      'Your score counts in meters: the speed rises gently with altitude, and every 100 m milestone is celebrated.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : maintenez n’importe où sur le jeu, glissez à gauche/droite pour diriger.',
      'Ordinateur : maintenez le bouton de la souris et déplacez-la, ou utilisez la barre d’espace + les flèches ← →.',
      'Après une défaite, touchez le jeu, la touche Entrée ou « Rejouer » pour repartir immédiatement.',
    ],
    en: [
      'Mobile & tablet: press and hold anywhere on the game, drag left/right to steer.',
      'Desktop: hold the mouse button and move it, or use the space bar + the ← → arrow keys.',
      'After a crash, tap the game, press Enter or “Play again” to restart instantly.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Commande à un seul geste : maintenez pour monter, relâchez pour descendre',
      'Couloirs toujours franchissables, de plus en plus étroits',
      'Poutres mobiles et gouttes d’eau à collecter au-delà de 150 m',
      'Palier sonore et vibré célébré tous les 100 m',
      'Vitesse progressive, sans frustration artificielle',
      'Pause automatique quand l’onglet est masqué',
      'Record de distance sauvegardé sur votre appareil',
      'Défi du jour déterministe et succès 500 m / 1 500 m',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      'One-gesture control: hold to rise, release to fall',
      'Always-passable corridors that grow tighter over time',
      'Moving beams and water drops to collect past 150 m',
      'Sound and haptic celebration every 100 m milestone',
      'Progressive speed with no artificial frustration',
      'Automatic pause when the tab is hidden',
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
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé repose sur votre précision à slalomer entre les flammes : la distance grimpée est rapportée à un par de 600 mètres (l’objectif le plus élevé du défi du jour, juste au-dessus du succès des 500 m) — une course de 420 à 510 m correspond à une précision de 0,70 à 0,85. Sans temps de référence, la rapidité n’entre pas en compte. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu de réflexes — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour grimper plus haut.' },
      { q: 'Pourquoi le pompier descend-il quand je ne touche pas l’écran ?', a: 'C’est le principe du jeu : la gravité est permanente et le monde défile vers le bas. Maintenir active la propulsion qui vous fait monter plus vite que le défilement.' },
      { q: 'Que se passe-t-il si je change d’onglet en pleine ascension ?', a: 'La partie se met automatiquement en pause : l’incendie n’avance plus tant que vous n’êtes pas revenu, et vous reprenez exactement où vous en étiez.' },
      { q: 'Le défi du jour est-il le même pour tous les joueurs ?', a: 'Oui : l’objectif du jour (250, 400 ou 600 m selon la date) est généré de façon déterministe à partir de la date, identique pour tous jusqu’au lendemain.' },
      { q: 'Puis-je jouer au clavier ?', a: 'Oui : barre d’espace pour monter, flèches gauche/droite pour se diriger, Entrée pour relancer après une défaite. Le jeu reste jouable à la souris ou au doigt.' },
    ],
    en: [
      { q: 'Does the game become impossible at high altitude?', a: 'No. Corridors narrow and speed increases, but every passage remains passable: generation always guarantees a corridor wider than the firefighter, with reachable spacing.' },
      { q: 'How is the score calculated?', a: 'The main score is the distance climbed, in meters (10 pixels = 1 meter). Water drops each add 50 bonus points, shown separately.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ rests on how precisely you slalom between the flames: the distance climbed is measured against a 600-metre par (the highest daily-challenge goal, just above the 500 m achievement) — a 420–510 m run maps to 0.7–0.85 accuracy. With no reference clock, speed does not come into it. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this reflex game — not a clinical IQ test — and the best way to raise it is to keep playing to climb higher.' },
      { q: 'Why does the firefighter fall when I’m not touching the screen?', a: 'That is the core of the game: gravity is permanent and the world scrolls downwards. Holding activates the thruster that makes you climb faster than the scroll.' },
      { q: 'What happens if I switch tabs mid-climb?', a: 'The game pauses automatically: the fire stops advancing until you come back, and you resume exactly where you left off.' },
      { q: 'Is the daily challenge the same for every player?', a: 'Yes: the day’s goal (250, 400 or 600 m depending on the date) is generated deterministically from the date, identical for everyone until the next morning.' },
      { q: 'Can I play with a keyboard?', a: 'Yes: space bar to climb, left/right arrows to steer, Enter to restart after a crash. The game is equally playable with a mouse or a finger.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-distance': { fr: 'Plus grande distance (m)', en: 'Greatest distance (m)' },
  },
}

/* ================= Textes UI ================= */
const L = {
  fr: {
    play: 'Grimper !', replay: 'Rejouer', restart: 'Recommencer',
    distance: 'Distance', best: 'Record', water: 'Gouttes',
    over: 'Le pompier a besoin d’un repos !', meters: 'm',
    title: 'Le Pompier de Gran',
    hint: 'Maintenez pour monter, relâchez pour descendre, glissez pour diriger.',
    daily: 'Défi du jour : atteindre {n} m', dailyDone: 'Défi du jour réussi !',
    newBest: 'Nouveau record !',
    tip: 'Astuce : pulsez maintenir/relâcher pour rester à hauteur constante.',
    level: 'Niveau', milestone: 'Palier {n} m', elite: 'Honneur du feu !',
    waterBonus: 'Bonus gouttes', xpGained: 'XP gagnés',
    canvasLabel: 'Jeu du pompier : maintenez pour faire monter le pompier entre les flammes, relâchez pour descendre.',
    shareRun: '{n} m parcourus',
  },
  en: {
    play: 'Climb!', replay: 'Play again', restart: 'Restart',
    distance: 'Distance', best: 'Best', water: 'Drops',
    over: 'The firefighter needs a rest!', meters: 'm',
    title: 'Gran’s Firefighter',
    hint: 'Hold to rise, release to fall, drag to steer.',
    daily: 'Daily challenge: reach {n} m', dailyDone: 'Daily challenge complete!',
    newBest: 'New record!',
    tip: 'Tip: pulse hold/release to hover at a constant height.',
    level: 'Level', milestone: '{n} m milestone', elite: 'Fire honor!',
    waterBonus: 'Drop bonus', xpGained: 'XP earned',
    canvasLabel: 'Firefighter game: hold to make the firefighter climb between the flames, release to fall.',
    shareRun: '{n} m climbed',
  },
} as const

/* ================= Monde ================= */
interface Band {
  worldY: number
  /** Bord gauche du couloir, fraction de la largeur (résiste au redimensionnement). */
  gapX01: number
  /** Largeur du couloir, fraction de la largeur. */
  gapW01: number
  h: number
  seed: number
  passed: boolean
}
interface Beam {
  worldY: number
  w01: number
  h: number
  speed: number
  phase: number
  passed: boolean
}
interface Drop { worldY: number; x01: number; taken: boolean }
interface Ember { x: number; y: number; vy: number; r: number; life: number; max: number }
interface Pop { x: number; y: number; text: string; life: number; max: number; color: string; size: number }

interface World {
  W: number; H: number; t: number
  scroll: number
  px: number; py: number; pvy: number
  /** Échelle du pompier (agrandi sur grands écrans). */
  ps: number
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
  prevGapX01: number
  bandSeq: number
  water: number
  distM: number
  level: number
  dailyWon: boolean
  winCounted: boolean
  emberT: number
  dead: boolean
}

function makeWorld(): World {
  return {
    W: 320, H: 240, t: 0,
    scroll: 0,
    px: 160, py: 160, pvy: 0,
    ps: 1,
    holding: false, targetX: 160, hasPointer: false,
    keys: { left: false, right: false },
    bands: [], beams: [], drops: [], embers: [], pops: [],
    nextBandY: 0, prevGapX01: 0.5, bandSeq: 0,
    water: 0, distM: 0, level: 1,
    dailyWon: false, winCounted: false,
    emberT: 0,
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
  w.prevGapX01 = 0.5
  w.bandSeq = 0
  w.water = 0
  w.distM = 0
  w.level = 1
  w.dailyWon = false
  w.winCounted = false
  w.emberT = 0
  w.dead = false
}

/** Haptique légère — no-op propre sur les navigateurs sans Vibration API. */
function buzz(ms: number) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* ignoré */
  }
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

/** Pompier dessiné autour de l'origine — l'appelant gère translate + scale. */
function drawFirefighter(
  ctx: CanvasRenderingContext2D,
  vy: number, holding: boolean, t: number, reduce: boolean,
) {
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
}

/* ================= Composant ================= */
export default function FireEscapeGame() {
  const lang = useLang()
  const reduce = useReducedMotion()
  const hydrated = useHydrated()
  const dailyDone = useIsDailyDone(gameId)
  const T = L[lang]

  const addPlay = useProfileStore((s) => s.addPlay)
  const bestDist = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-distance']?.value ?? 0)

  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [hud, setHud] = useState({ dist: 0, water: 0, level: 1 })
  const [result, setResult] = useState<null | { dist: number; water: number; isRecord: boolean; xp: number; iq: number }>(null)
  const [confetti, setConfetti] = useState(0)
  const [burstKey, setBurstKey] = useState(0)
  const [burstStars, setBurstStars] = useState(3)
  const [shake, setShake] = useState(false)

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worldRef = useRef<World>(makeWorld())
  const phaseRef = useRef(phase)
  const reduceRef = useRef(reduce)
  const langRef = useRef(lang)
  const dailyDoneRef = useRef(dailyDone)
  const dailyTargetRef = useRef(250)
  const rafRef = useRef(0)
  const pausedRef = useRef(false)
  const deathTimerRef = useRef(0)
  const lastStartRef = useRef(0)
  const replayBtnRef = useRef<HTMLButtonElement>(null)

  /* Effets « juice » (Task 20) — helpers visuels décoratifs, sans re-render. */
  const juice = useJuice()
  const juiceRef = useRef(juice)

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { reduceRef.current = reduce }, [reduce])
  useEffect(() => { langRef.current = lang }, [lang])
  useEffect(() => { dailyDoneRef.current = dailyDone }, [dailyDone])
  useEffect(() => { juiceRef.current = juice }, [juice])

  /* Focus clavier sur « Rejouer » dès l'écran de fin de course. */
  useEffect(() => {
    if (phase === 'over') replayBtnRef.current?.focus({ preventScroll: true })
  }, [phase])

  /* Défi du jour déterministe : 250 / 400 / 600 m selon la date (mémoïsé par jour). */
  const dailyKey = todayKey()
  const dailyTarget = useMemo(() => {
    const r = mulberry32(seedFromString(`fire-escape:${dailyKey}`))
    return [250, 400, 600][Math.floor(r() * 3)]
  }, [dailyKey])
  useEffect(() => { dailyTargetRef.current = dailyTarget }, [dailyTarget])

  const handleStart = useCallback(() => {
    const now = performance.now()
    if (now - lastStartRef.current < 350) return
    lastStartRef.current = now
    window.clearTimeout(deathTimerRef.current)
    sfx.play('pop')
    resetWorld(worldRef.current)
    addPlay(gameId)
    setResult(null)
    setShake(false)
    setHud({ dist: 0, water: 0, level: 1 })
    setPhase('playing')
  }, [addPlay])
  const startRef = useRef(handleStart)
  useEffect(() => { startRef.current = handleStart }, [handleStart])

  /* ================= Boucle principale (montée seule — tout passe par des refs) ================= */
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
      const ch = wrap.clientHeight
      if (cw < 40 || ch < 40) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      // Redimensionnement en cours de partie : positions relatives conservées.
      if (cw !== w.W && w.W > 0) {
        const k = cw / w.W
        w.px = clamp(w.px * k, 16, cw - 16)
        w.targetX = clamp(w.targetX * k, 16, cw - 16)
      }
      w.W = cw
      w.H = ch
      w.ps = clamp(cw / 360, 0.95, 1.3)
      w.py = clamp(w.py, 26, ch * 0.8)
      cv.width = Math.round(cw * dpr)
      cv.height = Math.round(ch * dpr)
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

    /* ----- fin de partie (récompenses atomiques, overlay différé) ----- */
    const finishDeath = () => {
      if (w.dead) return
      w.dead = true
      w.holding = false
      w.hasPointer = false
      w.keys.left = false
      w.keys.right = false
      const dist = Math.floor(w.scroll / 10)
      const st = useProfileStore.getState()
      const prevBest = st.profile.games[gameId]?.records?.['best-distance']?.value ?? 0
      const isRecord = dist > prevBest && dist > 0
      const xp = Math.max(1, Math.floor(dist / 20) + Math.floor(w.water / 2))
      /* QI estimé (Task 18) : précision = distance / par de 600 m (objectif le
       * plus élevé du défi du jour, juste au-dessus du succès 500 m), clampée
       * [0,15 ; 1]. Pas de chrono : rapidité omise ; difficulté 2. */
      const iq = computeIq(gameId, { accuracy: clamp(dist / 600, 0.15, 1), difficulty: 2 })
      if (dist > 0) st.setBest(gameId, 'best-distance', dist)
      st.addXp(xp)
      // Niveau de jeu : 10 à 28 XP selon la distance grimpée.
      st.addGameXp(gameId, Math.min(28, 10 + Math.floor(dist / 50)))
      if (dist >= 500) st.unlockBadge('fire-500')
      if (dist >= 1500) st.unlockBadge('fire-1500')
      sfx.play('lose')
      buzz(20)
      if (!reduceRef.current) setShake(true)
      if (isRecord) setConfetti((k) => k + 1)
      // Célébration de fin de course : nouveau record (dès 100 m, objectif
      // d'une première ascension), défi du jour ou victoire 500 m — étoiles
      // par palier de distance.
      if ((isRecord && dist >= 100) || w.dailyWon || dist >= 500) {
        setBurstStars(dist >= 500 ? 3 : dist >= 250 ? 2 : 1)
        setBurstKey((k) => k + 1)
      }
      setResult({ dist, water: w.water, isRecord, xp, iq })
      window.clearTimeout(deathTimerRef.current)
      deathTimerRef.current = window.setTimeout(() => { setPhase('over') }, reduceRef.current ? 260 : 620)
    }

    /* ----- entrées ----- */
    const rectPos = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    // Pilotage relatif : le pompier garde son écart avec le doigt et ne saute
    // jamais sous lui (le doigt ne masque pas le personnage).
    let grabDX = 0
    const onDown = (e: PointerEvent) => {
      e.preventDefault()
      if (phaseRef.current === 'over') {
        startRef.current()
        return
      }
      if (phaseRef.current !== 'playing') return
      if (w.holding && w.hasPointer) return // un seul doigt ne pilote
      const p = rectPos(e)
      w.holding = true
      w.hasPointer = true
      grabDX = w.px - p.x
      w.targetX = p.x + grabDX
      thrustSound()
      try { cv.setPointerCapture(e.pointerId) } catch { /* ignoré */ }
    }
    const onMove = (e: PointerEvent) => {
      if (!w.holding || !w.hasPointer) return
      const p = rectPos(e)
      w.targetX = p.x + grabDX
    }
    const onUp = () => {
      w.holding = false
      w.hasPointer = false
    }
    const overlayOpen = () => {
      try {
        return !!document.querySelector('[role="dialog"],[role="menu"]')
      } catch {
        return false
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (overlayOpen()) return
      if (phaseRef.current === 'over') {
        if ((e.code === 'Enter' || e.code === 'Space') && !e.repeat) {
          e.preventDefault()
          startRef.current()
        }
        return
      }
      if (phaseRef.current !== 'playing') return
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        w.holding = true
        thrustSound()
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
    const onVis = () => {
      pausedRef.current = document.hidden
      if (document.hidden) {
        // Le pointerup manqué ne doit pas laisser la propulsion active.
        w.holding = false
        w.hasPointer = false
        w.keys.left = false
        w.keys.right = false
      }
    }

    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointercancel', onUp)
    cv.addEventListener('contextmenu', onCtx)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    document.addEventListener('visibilitychange', onVis)

    /* ----- génération des obstacles (positions en fractions → résiste au resize) ----- */
    const genObstacles = () => {
      const distM = w.scroll / 10
      while (w.nextBandY < w.scroll + w.H * 1.7) {
        const spacing = 350 - Math.min(distM * 0.04, 60)
        const gapW01 = clamp(0.46 - distM * 0.00013, 0.26, 0.46)
        let gapX01 = w.prevGapX01 + (Math.random() - 0.5) * 0.55
        gapX01 = clamp(gapX01, 0.07, 0.93 - gapW01)
        w.prevGapX01 = gapX01
        w.bands.push({
          worldY: w.nextBandY,
          gapX01,
          gapW01,
          h: 46 + Math.min(distM * 0.012, 30),
          seed: Math.random() * 10,
          passed: false,
        })
        w.bandSeq++
        // Poutre mobile au-delà de 150 m (une bande sur trois, compteur stable)
        if (distM > 150 && w.bandSeq % 3 === 0) {
          w.beams.push({
            worldY: w.nextBandY + spacing * 0.32,
            w01: 0.4,
            h: 20,
            speed: 0.8 + Math.random() * 0.6,
            phase: Math.random() * Math.PI * 2,
            passed: false,
          })
        }
        // Goutte d'eau dans le couloir (sur une rangée distincte de la poutre)
        if (Math.random() < 0.55) {
          w.drops.push({
            worldY: w.nextBandY + spacing * 0.55,
            x01: clamp(gapX01 + gapW01 * (0.25 + Math.random() * 0.5), 0.06, 0.94),
            taken: false,
          })
        }
        w.nextBandY += spacing
      }
      // Nettoyage
      const cutoff = w.scroll - 140
      w.bands = w.bands.filter((b) => b.worldY > cutoff)
      w.beams = w.beams.filter((b) => b.worldY > cutoff)
      w.drops = w.drops.filter((d) => d.worldY > cutoff)
    }

    const beamX = (b: Beam, bw: number) => (w.W - bw) / 2 * (1 + Math.sin(w.t * b.speed + b.phase))

    const pushHud = () => {
      setHud({ dist: w.distM, water: w.water, level: w.level })
    }

    /* ----- effets décoratifs (braises, textes flottants) ----- */
    const updateFx = (dt: number) => {
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
    }

    /* ----- simulation ----- */
    let lastSwish = -1
    const nearMissSound = () => {
      if (w.t - lastSwish < 0.6) return
      lastSwish = w.t
      sfx.play('swish', { volume: 0.4 })
    }
    let lastThrust = -1
    const thrustSound = () => {
      if (w.t - lastThrust < 0.25) return
      lastThrust = w.t
      sfx.play('sweep', { volume: 0.15 })
    }

    const update = (dt: number) => {
      if (phaseRef.current !== 'playing' || w.dead) {
        updateFx(dt)
        return
      }
      const distM = w.scroll / 10
      const scrollSpeed = 150 + Math.min(distM * 0.3, 120)
      w.scroll += scrollSpeed * dt

      // Physique verticale
      w.pvy += (w.holding ? -2500 : 2000) * dt
      w.pvy = clamp(w.pvy, -470, 560)
      w.py += w.pvy * dt

      // Direction horizontale (agilité proportionnelle à la largeur)
      const steerSpeed = Math.max(240, w.W * 0.76)
      let steer: number | null = null
      if (w.holding && w.hasPointer) steer = w.targetX
      else if (w.keys.left) steer = w.px - steerSpeed * dt
      else if (w.keys.right) steer = w.px + steerSpeed * dt
      if (steer !== null) {
        const maxStep = Math.max(380, w.W * 1.28) * dt
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

      const pr = 13 * w.ps
      // Collisions flammes + frôlements
      for (const b of w.bands) {
        const sy = w.H - (b.worldY - w.scroll)
        if (sy < -120 || sy > w.H + 140) continue
        const ll = Math.max(b.gapX01 * w.W - 6, 4)
        const rl = Math.max(w.W - (b.gapX01 + b.gapW01) * w.W - 6, 4)
        if (Math.abs(w.py - sy) < b.h / 2 + pr * 0.7) {
          if (w.px < ll + pr * 0.7 || w.px > w.W - rl - pr * 0.7) {
            finishDeath()
            return
          }
        }
        if (!b.passed && sy > w.py + b.h / 2 + pr) {
          b.passed = true
          const clearance = Math.min(w.px - ll, w.W - rl - w.px)
          if (clearance > 0 && clearance < 26 * w.ps) nearMissSound()
        }
      }
      // Collisions poutres + frôlements
      for (const b of w.beams) {
        const sy = w.H - (b.worldY - w.scroll)
        if (sy < -60 || sy > w.H + 60) continue
        const bw = b.w01 * w.W
        const bx = beamX(b, bw)
        if (Math.abs(w.py - sy) < b.h / 2 + pr * 0.7) {
          if (w.px > bx - pr * 0.6 && w.px < bx + bw + pr * 0.6) {
            finishDeath()
            return
          }
        }
        if (!b.passed && sy > w.py + b.h / 2 + pr) {
          b.passed = true
          const edge = Math.min(Math.abs(w.px - bx), Math.abs(w.px - (bx + bw)))
          if (edge < 30 * w.ps) nearMissSound()
        }
      }
      // Gouttes d'eau
      for (const d of w.drops) {
        if (d.taken) continue
        const sy = w.H - (d.worldY - w.scroll)
        if (sy < -30 || sy > w.H + 30) continue
        const dx = d.x01 * w.W
        if (Math.hypot(w.px - dx, w.py - sy) < 26) {
          d.taken = true
          w.water++
          sfx.play('coin', { volume: 0.7 })
          buzz(8)
          w.pops.push({ x: dx, y: sy, text: '+50', life: 0.8, max: 0.8, color: '#eafaf1', size: 16 })
          // Effet « juice » (Task 20) : respiration douce du plateau à la
          // goutte collectée. Pulse sur le CANVAS (pas le conteneur) : le
          // onAnimationEnd du conteneur pilote la secousse de fin de course.
          juiceRef.current.pulse(cv, 1.012, 240)
          pushHud()
        }
      }

      // Défi du jour (une seule célébration par partie, jamais si déjà réussi)
      const dm = Math.floor(w.scroll / 10)
      if (!w.dailyWon && dm > 0 && dm >= dailyTargetRef.current) {
        w.dailyWon = true
        if (!dailyDoneRef.current) {
          useProfileStore.getState().completeDaily(gameId)
          sfx.play('win')
          setConfetti((k) => k + 1)
          buzz(10)
          w.pops.push({
            x: w.W / 2, y: w.H * 0.3,
            text: `🏆 ${L[langRef.current].dailyDone}`,
            life: 1.6, max: 1.6, color: '#f6c26a', size: 18,
          })
        }
      }
      // Victoire (runner sans fin : 500 m = ascension remarquable)
      if (!w.winCounted && dm >= 500) {
        w.winCounted = true
        useProfileStore.getState().addWin(gameId)
        w.pops.push({
          x: w.W / 2, y: w.H * 0.24,
          text: `🎖️ ${L[langRef.current].elite}`,
          life: 1.6, max: 1.6, color: '#f6c26a', size: 18,
        })
      }

      updateFx(dt)

      const newDist = Math.floor(w.scroll / 10)
      if (newDist !== w.distM) {
        w.distM = newDist
        const lvl = 1 + Math.floor(newDist / 100)
        if (lvl !== w.level) {
          w.level = lvl
          sfx.play('levelup')
          buzz(10)
          w.pops.push({
            x: w.W / 2, y: w.H * 0.36,
            text: `⭐ ${L[langRef.current].milestone.replace('{n}', String((lvl - 1) * 100))}`,
            life: 1.3, max: 1.3, color: '#f6c26a', size: 17,
          })
        }
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
      ctx.font = `${Math.round(19 * w.ps)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",system-ui,sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const d of w.drops) {
        if (d.taken) continue
        const sy = H - (d.worldY - w.scroll)
        if (sy < -30 || sy > H + 30) continue
        ctx.fillText('💧', d.x01 * W, sy)
      }

      // Poutres
      for (const b of w.beams) {
        const sy = H - (b.worldY - w.scroll)
        if (sy < -60 || sy > H + 60) continue
        const bw = b.w01 * W
        const bx = beamX(b, bw)
        const g = ctx.createLinearGradient(bx, sy - b.h / 2, bx + bw, sy + b.h / 2)
        g.addColorStop(0, '#5c3320')
        g.addColorStop(0.5, '#7a4527')
        g.addColorStop(1, '#5c3320')
        ctx.fillStyle = g
        rr(ctx, bx, sy - b.h / 2, bw, b.h, 5)
        ctx.fill()
        ctx.fillStyle = 'rgba(246,194,106,0.5)'
        rr(ctx, bx + 4, sy - b.h / 2 + 2, bw - 8, 3, 1.5)
        ctx.fill()
      }

      // Flammes
      for (const b of w.bands) {
        const sy = H - (b.worldY - w.scroll)
        if (sy < -H * 0.4 || sy > H + 120) continue
        const ll = Math.max(b.gapX01 * W - 6, 4)
        const rl = Math.max(W - (b.gapX01 + b.gapW01) * W - 6, 4)
        drawFlames(ctx, W, sy, ll, rl, b.h, w.t, b.seed, reduceRef.current)
      }

      // Brasier du bas
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

      // Pompier (mis à l'échelle autour de son centre)
      ctx.save()
      ctx.translate(w.px, w.py)
      ctx.scale(w.ps, w.ps)
      drawFirefighter(ctx, w.pvy, w.holding, w.t, reduceRef.current)
      ctx.restore()

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
      if (pausedRef.current || overlayOpen()) return
      w.t += dt
      update(dt)
      draw()
    }
    rafRef.current = requestAnimationFrame(step)

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.clearTimeout(deathTimerRef.current)
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
  }, [])

  /* ================= Rendu React ================= */
  const dailyChip = dailyDone ? (
    <span
      className="flex h-8 min-w-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
      title={T.dailyDone}
    >
      ✓ {dailyTarget} {T.meters}
    </span>
  ) : (
    <span
      className="flex h-8 min-w-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
      title={T.daily.replace('{n}', String(dailyTarget))}
    >
      🎯 {dailyTarget} {T.meters}
    </span>
  )

  return (
    <div className="relative select-none my-auto w-full flex h-[var(--board-h,auto)] flex-col" onContextMenu={(e) => e.preventDefault()}>
      <Confetti fire={confetti} count={reduce ? 0 : 90} waves={2} gold />
      <VictoryBurst fire={burstKey} stars={burstStars} />

      {/* Colonne bornée : HUD une ligne + aire verticale dans le budget mobile */}
      <div className="mx-auto flex w-full max-w-[560px] grow flex-col">
        {/* HUD compact une ligne */}
        <div className="mb-2 flex shrink-0 flex-wrap items-center gap-1.5">
          {phase === 'playing' ? (
            <>
              <HudChip title={T.distance} icon={<Ruler className="h-3.5 w-3.5" aria-hidden="true" />}>
                {hud.dist} {T.meters}
              </HudChip>
              <HudChip title={T.level} icon={<Flame className="h-3.5 w-3.5" aria-hidden="true" />}>
                {hud.level}
              </HudChip>
              <HudChip title={T.water} icon={<Droplets className="h-3.5 w-3.5" aria-hidden="true" />}>
                {hud.water}
              </HudChip>
              {dailyChip}
              <Button
                variant="secondary"
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
              {hydrated && bestDist > 0 ? (
                <HudChip title={`${T.distance} — ${T.best}`} icon={<Ruler className="h-3.5 w-3.5" aria-hidden="true" />}>
                  {bestDist} {T.meters}
                </HudChip>
              ) : null}
              {dailyChip}
            </>
          )}
        </div>

        {/* Aire de jeu — pleine hauteur disponible, jamais de scroll pour jouer */}
        <div
          ref={wrapRef}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) setShake(false)
          }}
          className={cn(
            'relative h-[var(--board-h,calc(100dvh-242px))] max-h-[720px] min-h-[360px] w-full touch-none overflow-hidden rounded-2xl border shadow-inner',
            shake && 'anim-shake',
          )}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full touch-none"
            style={{ touchAction: 'none' }}
            role="img"
            aria-label={T.canvasLabel}
          />

          {/* Écran d'accueil */}
          {phase === 'idle' ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-stone-900/45 p-5 text-center backdrop-blur-[2px]">
              {/* Défi QI bienveillant — mis en avant dès l'ouverture (Task 19) */}
              <IqChallengeBanner gameId={gameId} />
              <div className="flex gap-2.5" aria-hidden="true">
                {['🧑‍🚒', '🔥', '💧'].map((e, i) => (
                  <span key={i} className="text-3xl anim-floaty" style={{ animationDelay: `${i * 0.4}s` }}>{e}</span>
                ))}
              </div>
              <h3 className="font-display text-xl font-extrabold text-white drop-shadow sm:text-2xl">🚒 {T.title}</h3>
              <p className="max-w-[24rem] rounded-xl bg-white/15 px-3 py-1.5 text-xs text-stone-100 sm:text-sm">{T.hint}</p>
              <Button size="lg" className="h-12 rounded-full px-8 text-base anim-glow" onClick={handleStart}>
                <Play className="h-5 w-5" aria-hidden="true" /> {T.play}
              </Button>
              {dailyDone ? null : (
                <p className="text-[11px] font-semibold text-amber-200">
                  🎯 {T.daily.replace('{n}', String(dailyTarget))}
                </p>
              )}
            </div>
          ) : null}

          {/* Game over — toucher le fond relance immédiatement */}
          {phase === 'over' && result ? (
            <div
              role="status"
              className="absolute inset-0 z-20 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-[2px]"
              onClick={handleStart}
            >
              <div
                className="anim-rise w-full max-w-[19rem] rounded-2xl border bg-card p-5 text-center shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="font-display text-lg font-extrabold">🔥 {T.over}</p>
                <div className="mt-3 flex items-end justify-center gap-6">
                  <div>
                    <p className="text-4xl font-extrabold tabular-nums text-primary">{result.dist}</p>
                    <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                      <Ruler className="h-3.5 w-3.5" aria-hidden="true" /> {T.distance} ({T.meters})
                    </p>
                  </div>
                  <div>
                    <p className="text-4xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">+{result.water * 50}</p>
                    <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                      <Droplets className="h-3.5 w-3.5" aria-hidden="true" /> {T.waterBonus}
                    </p>
                  </div>
                </div>
                {result.isRecord ? (
                  <p className="mt-2.5 text-sm font-bold text-amber-600 dark:text-amber-400">🏆 {T.newBest}</p>
                ) : (
                  <p className="mt-2.5 text-xs text-muted-foreground">
                    {T.best} : <span className="font-bold tabular-nums">{Math.max(bestDist, result.dist)} {T.meters}</span>
                  </p>
                )}
                <p className="mt-1 text-[11px] font-semibold text-muted-foreground">+{result.xp} XP · {T.xpGained}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">{T.tip}</p>
                <div className="mt-4">
                  <RoundEndActions
                    gameId={gameId}
                    onReplay={handleStart}
                    replayLabel={T.replay}
                    shareResult={T.shareRun.replace('{n}', String(result.dist))}
                    primaryRef={replayBtnRef}
                    iq={result.iq}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/* ================= HUD ================= */
function HudChip({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <span
      title={title}
      className="flex h-8 min-w-0 items-center gap-1 rounded-full bg-secondary/70 px-2.5 text-xs font-bold text-foreground"
    >
      <span className="text-muted-foreground" aria-hidden="true">{icon}</span>
      <span className="tabular-nums">{children}</span>
    </span>
  )
}
