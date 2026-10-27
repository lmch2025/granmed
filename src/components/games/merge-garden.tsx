'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, Sprout, CircleCheckBig, Circle, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang, useT, type Lang } from '@/lib/i18n'
import { buildHash } from '@/lib/app-store'
import { useProfileStore } from '@/lib/progress/store'
import { loadSave, saveSave } from '@/lib/save'
import { useReducedMotion, clamp, shareText } from '@/lib/utils-game'
import { getGame } from '@/lib/games/catalog'
import { computeIq } from '@/lib/games/iq'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Confetti } from '@/components/shared/confetti'
import { VictoryBurst } from '@/components/game/round-end'
import { IqCard } from '@/components/game/iq-card'
import { toast } from 'sonner'

export const gameId = 'merge-garden'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Fusionnez graines et plantes pour découvrir 16 espèces, du bourgeon jusqu’au jardin complet de Gran — et élever votre QI estimé au fil de la collection.',
    en: 'Merge seeds and plants to discover 16 species, from tiny buds all the way to Gran’s complete garden — raising your estimated IQ as the collection grows.',
  },
  description: {
    fr: [
      'Jardin de Gran est un jeu de fusion zen et gratuit dans lequel vous plantez des graines sur un plateau de 6×7 cases, puis combinez deux plantes identiques pour les faire évoluer en l’espèce supérieure, de la simple graine jusqu’au grand chêne et au jardin complet de Gran.',
      'Chaque fusion rapporte de l’expérience et chaque nouvelle espèce découverte enrichit votre livre de collection. Votre stock de graines se recharge automatiquement (une toutes les 20 secondes, dans la limite de 5), même quand vous quittez la page : le jardin pousse à votre rythme, sans game-over ni pression. Votre QI estimé, lié à la progression de votre collection, vous attribue un niveau d’intelligence du Novice au Génie, à élever en faisant grandir le jardin.',
      'Cinq objectifs progressifs structurent la partie — découvrir le tournesol, atteindre le grand chêne, planter 50 graines, fusionner 100 fois et compléter les 16 espèces — et tout est sauvegardé automatiquement sur votre appareil.',
    ],
    en: [
      'Gran’s Garden is a calm, free merge game where you plant seeds on a 6×7 board, then combine two identical plants to evolve them into the next species, from a simple seed all the way to the great oak and Gran’s complete garden.',
      'Every merge earns experience and each newly discovered species enriches your collection book. Your seed stock refills automatically (one every 20 seconds, up to 5), even while you are away: the garden grows at your own pace, with no game over and no pressure. Your estimated IQ, tied to the growth of your species collection, assigns you an intelligence level from Novice to Genius, to raise as the garden keeps growing.',
      'Five progressive goals structure the game — discover the sunflower, reach the great oak, plant 50 seeds, merge 100 times and complete all 16 species — and everything is saved automatically on your device.',
    ],
  },
  rules: {
    fr: [
      'Touchez une plante pour la sélectionner (anneau de sélection).',
      'Touchez une case vide pour y déplacer la plante sélectionnée.',
      'Touchez une plante identique pour fusionner les deux en l’espèce supérieure.',
      'Le bouton « Planter » sème une graine (niveau 1) sur une case libre aléatoire ; glissez plutôt la graine 🌱 du compteur pour choisir sa case exacte.',
      'Le stock de graines (maximum 5) se recharge d’une unité toutes les 20 secondes.',
      'Il n’y a pas de fin : découvrez les 16 espèces à votre rythme.',
    ],
    en: [
      'Tap a plant to select it (selection ring).',
      'Tap an empty cell to move the selected plant there.',
      'Tap an identical plant to merge both into the next species.',
      'The “Plant” button drops a seed (tier 1) on a random free cell; drag the 🌱 seed from the counter instead to choose its exact cell.',
      'The seed stock (max 5) refills by one every 20 seconds.',
      'There is no end: discover the 16 species at your own pace.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez une plante puis une autre case pour la fusionner ou la déplacer — ou glissez-la directement du doigt.',
      'Glissez la graine 🌱 du compteur vers une case libre pour la planter exactement où vous voulez.',
      'Ordinateur : cliquez pour sélectionner puis agir ; le glisser-déposer à la souris fonctionne partout.',
      'Aucune commande clavier nécessaire — tout se joue au doigt ou à la souris.',
    ],
    en: [
      'Mobile & tablet: tap a plant, then tap another cell to merge or move — or drag it directly with your finger.',
      'Drag the 🌱 seed from the counter onto a free cell to plant it exactly where you want.',
      'Desktop: click to select then act; drag & drop with the mouse works everywhere.',
      'No keyboard needed — everything is played by finger or mouse.',
    ],
  },
  features: {
    fr: [
      'QI estimé lié à votre collection',
      '16 espèces à découvrir, de la graine 🌱 au jardin de Gran 🏡',
      'Plateau 6×7 sans game-over : une progression zen',
      'Glisser-déposer tactile aimanté : plantes et graines, avec cible illuminée et légère vibration',
      'Stock de 5 graines rechargeable (1 toutes les 20 s, même hors ligne)',
      'Livre de collection des espèces découvertes',
      '5 objectifs progressifs avec récompenses d’expérience',
      'Sauvegarde automatique du jardin sur votre appareil',
    ],
    en: [
      'IQ tied to your collection',
      '16 species to discover, from the seed 🌱 to Gran’s garden 🏡',
      '6×7 board with no game over: a zen progression',
      'Magnetized touch drag & drop: plants and seeds, with a lit target and a light vibration',
      'Refillable stock of 5 seeds (1 every 20 s, even offline)',
      'Collection book of discovered species',
      '5 progressive goals with experience rewards',
      'Automatic save of your garden on your device',
    ],
  },
  tips: {
    fr: [
      'Regroupez les espèces par niveau dans des zones du plateau : vous verrez immédiatement les fusions possibles.',
      'Glissez la graine du compteur à côté d’une plante de niveau 1 pour fusionner en un seul geste.',
      'Ne montez pas trop vite : garder plusieurs plantes de niveau intermédiaire évite de bloquer le plateau.',
      'Le stock se recharge même page fermée : revenez plus tard pour une session de plantation plus généreuse.',
    ],
    en: [
      'Group species by tier in zones of the board: you will instantly see the possible merges.',
      'Drag the seed from the counter next to a tier-1 plant to merge in a single gesture.',
      'Do not climb too fast: keeping several mid-tier plants avoids locking the board.',
      'The stock refills even with the page closed: come back later for a more generous planting session.',
    ],
  },
  faq: {
    fr: [
      { q: 'Jardin de Gran est-il vraiment gratuit ?', a: 'Oui, le jeu est entièrement gratuit, sans inscription ni téléchargement, et votre jardin est sauvegardé localement sur votre appareil.' },
      { q: 'Que se passe-t-il quand le plateau est plein ?', a: 'Il n’y a pas de game-over : fusionnez des plantes identiques pour libérer des cases. Bloquer réellement le plateau demanderait plus de 26 jardins de Gran côte à côte (près d’un million de graines) : en pratique, une fusion reste toujours possible.' },
      { q: 'Comment se recharge le stock de graines ?', a: 'Une graine est ajoutée toutes les 20 secondes, jusqu’à un maximum de 5. La recharge continue même si vous quittez la page, grâce à l’horodatage sauvegardé.' },
      { q: 'Combien d’espèces existe-t-il ?', a: '16 espèces, de la graine (niveau 1) au jardin de Gran (niveau 16). Le livre de collection vous montre celles découvertes et celles qui restent.' },
      { q: 'Puis-je jouer sur mobile ?', a: 'Oui, le jeu est conçu pour le tactile : glissez une plante ou une graine du doigt, chaque case se joue confortablement, en portrait comme en paysage.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Le jardin étant un jeu zen sans fin de manche, votre QI estimé reflète la progression de votre collection : il s’élève avec les espèces découvertes (sur les 16 que compte le jeu), la difficulté de référence étant celle de la progression complète. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre avancée dans ce jeu de fusion — pas un test de QI clinique — et le meilleur moyen de l’élever reste de continuer à faire pousser et fusionner vos plantes.' },
    ],
    en: [
      { q: 'Is Gran’s Garden really free?', a: 'Yes, the game is completely free, with no sign-up and no download, and your garden is saved locally on your device.' },
      { q: 'What happens when the board is full?', a: 'There is no game over: merge identical plants to free cells. Truly locking the board would take more than 26 of Gran’s gardens side by side (close to a million seeds): in practice, a merge is always still possible.' },
      { q: 'How does the seed stock refill?', a: 'One seed is added every 20 seconds, up to a maximum of 5. Refilling continues even if you leave the page, thanks to the saved timestamp.' },
      { q: 'How many species are there?', a: '16 species, from the seed (tier 1) to Gran’s garden (tier 16). The collection book shows the ones you have discovered and the ones left.' },
      { q: 'Can I play on mobile?', a: 'Yes, the game is touch-first: drag a plant or a seed with your finger, every cell is comfortable to play, in portrait or landscape.' },
      { q: 'How is my estimated IQ calculated?', a: 'Because the garden is a zen game with no round end, your estimated IQ reflects the progression of your collection: it rises with the species you discover (out of the 16 the game counts), the reference difficulty being that of the full progression. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your progress in this merge game — not a clinical IQ test — and the best way to raise it is to keep growing and merging your plants.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'species-discovered': { fr: 'Espèces découvertes', en: 'Species discovered' },
    'highest-tier': { fr: 'Espèce la plus élevée', en: 'Highest species reached' },
  },
}

/* ================= Données de jeu ================= */
const COLS = 6
const ROWS = 7
const CELLS = COLS * ROWS
const MAX_TIER = 16
const SEED_MAX = 5
const SEED_MS = 20_000
const DRAG_SLOP_SQ = 64 // 8 px avant activation du glisser

/** Largeur du plateau : 100% du conteneur, plafonnée à 460px, et toujours
 *  compatible avec le budget vertical mobile (board top ≈ 190px + HUD 44px
 *  + marges ≈ 250px) → hauteur = largeur × 7/6 ≤ 100dvh − 250px.
 *  En paysage très court, un plancher de 280px garde des cases carrées
 *  jouables (la page défile alors légèrement, jamais horizontalement). */
const BOARD_WIDTH_CSS = 'min(100%, 460px, max(280px, (100dvh - 250px) * 6 / 7))'

const SPECIES: { emoji: string; name: Record<Lang, string> }[] = [
  { emoji: '🌱', name: { fr: 'Graine', en: 'Seed' } },
  { emoji: '🌿', name: { fr: 'Pousse', en: 'Sprout' } },
  { emoji: '🪴', name: { fr: 'Jeune plant', en: 'Seedling' } },
  { emoji: '🌷', name: { fr: 'Bourgeon', en: 'Bud' } },
  { emoji: '🌸', name: { fr: 'Fleur', en: 'Bloom' } },
  { emoji: '🌺', name: { fr: 'Tulipe', en: 'Tulip' } },
  { emoji: '🌻', name: { fr: 'Tournesol', en: 'Sunflower' } },
  { emoji: '🌹', name: { fr: 'Rose', en: 'Rose' } },
  { emoji: '🌼', name: { fr: 'Marguerite', en: 'Daisy' } },
  { emoji: '🌵', name: { fr: 'Cactus', en: 'Cactus' } },
  { emoji: '🍄', name: { fr: 'Champignon', en: 'Mushroom' } },
  { emoji: '🌾', name: { fr: 'Blé', en: 'Wheat' } },
  { emoji: '🍁', name: { fr: 'Érable', en: 'Maple' } },
  { emoji: '🌲', name: { fr: 'Sapin', en: 'Fir' } },
  { emoji: '🌳', name: { fr: 'Grand chêne', en: 'Great oak' } },
  { emoji: '🏡', name: { fr: 'Jardin de Gran', en: 'Gran’s garden' } },
]

const GOALS: { xp: number; label: Record<Lang, string> }[] = [
  { xp: 30, label: { fr: 'Découvrir le tournesol 🌻', en: 'Discover the sunflower 🌻' } },
  { xp: 60, label: { fr: 'Faire grandir le grand chêne 🌳', en: 'Grow the great oak 🌳' } },
  { xp: 40, label: { fr: 'Planter 50 graines', en: 'Plant 50 seeds' } },
  { xp: 60, label: { fr: 'Fusionner 100 fois', en: 'Merge 100 times' } },
  { xp: 150, label: { fr: 'Découvrir les 16 espèces', en: 'Discover all 16 species' } },
]

const STR = {
  fr: {
    seeds: 'Graines',
    plant: 'Planter',
    plantFull: 'Planter une graine sur une case libre',
    dragSeed: 'Glissez la graine 🌱 vers une case libre du jardin',
    stockFull: 'Stock de graines complet',
    collection: 'Collection',
    species: 'Espèces',
    merges: 'Fusions',
    plants: 'Graines plantées',
    goals: 'Objectifs du jardin',
    goalReached: 'Objectif du jardin atteint',
    allDone: 'Jardin complet 🏡',
    newSpecies: 'Nouvelle espèce découverte',
    howTo: 'Touchez une plante puis une autre case pour fusionner ou déplacer — ou glissez-la directement. Glissez la graine 🌱 du compteur pour planter où vous voulez.',
    nextSeed: 'prochaine graine',
    bookTitle: 'Livre du jardin',
    bookSub: 'Espèces découvertes',
    emptyCell: 'Case vide',
    board: 'Plateau du jardin',
    tier: 'niveau',
    boardFull: 'Plateau complet — fusionnez des plantes identiques !',
    noSeeds: 'Plus de graines — patientez la recharge',
    shareCollection: 'Partager ma collection',
    shareLine: 'Jardin : {n}/{total} espèces découvertes · niveau max {tier}',
  },
  en: {
    seeds: 'Seeds',
    plant: 'Plant',
    plantFull: 'Plant a seed on a free cell',
    dragSeed: 'Drag the 🌱 seed onto a free garden cell',
    stockFull: 'Seed stock full',
    collection: 'Collection',
    species: 'Species',
    merges: 'Merges',
    plants: 'Seeds planted',
    goals: 'Garden goals',
    goalReached: 'Garden goal reached',
    allDone: 'Complete garden 🏡',
    newSpecies: 'New species discovered',
    howTo: 'Tap a plant then another cell to merge or move — or drag it directly. Drag the 🌱 seed from the counter to plant wherever you like.',
    nextSeed: 'next seed',
    bookTitle: 'Garden book',
    bookSub: 'Discovered species',
    emptyCell: 'Empty cell',
    board: 'Garden board',
    tier: 'tier',
    boardFull: 'Board full — merge identical plants!',
    noSeeds: 'No seeds left — wait for the refill',
    shareCollection: 'Share my collection',
    shareLine: 'Garden: {n}/{total} species discovered · top tier {tier}',
  },
}

interface GardenSave {
  board: (number | null)[]
  discovered: number[]
  goalsDone: number[]
  seeds: number
  lastSeed: number
  plants: number
  merges: number
}

interface DragInfo {
  kind: 'move' | 'seed'
  from: number | null
  target: number | null
}

/* ================= Composant principal ================= */
export default function MergeGardenGame() {
  const lang = useLang()
  const t = useT()
  const reduce = useReducedMotion()
  const L = STR[lang]
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)

  const [board, setBoard] = useState<(number | null)[]>(() => new Array(CELLS).fill(null))
  const [discovered, setDiscovered] = useState<number[]>([])
  const [goalsDone, setGoalsDone] = useState<number[]>([])
  const [plants, setPlants] = useState(0)
  const [merges, setMerges] = useState(0)
  const [seedState, setSeedState] = useState<{ seeds: number; last: number }>(() => ({ seeds: 3, last: Date.now() }))
  const [selected, setSelected] = useState<number | null>(null)
  const [bumps, setBumps] = useState<number[]>(() => new Array(CELLS).fill(0))
  const [drag, setDrag] = useState<DragInfo | null>(null)
  const [bookOpen, setBookOpen] = useState(false)
  const [now, setNow] = useState(0)
  const [pops, setPops] = useState<{ id: number; idx: number; text: string }[]>([])
  const [banner, setBanner] = useState<{ id: number; tier: number } | null>(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)

  const restoredRef = useRef(false)
  const playCountedRef = useRef(false)
  const suppressUntilRef = useRef(0)
  const seedsRef = useRef(3)
  const ghostRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const detachDragRef = useRef<() => void>(() => {})
  const bannerTimerRef = useRef<number>(0)
  const bannerIdRef = useRef(0)
  const popIdRef = useRef(0)

  /* --- Recharge des graines : 1 toutes les 20 s (avec rattrapage hors ligne) --- */
  function regen(s: { seeds: number; last: number }): { seeds: number; last: number } {
    if (s.seeds >= SEED_MAX) return s
    const elapsed = Date.now() - s.last
    const gained = Math.floor(elapsed / SEED_MS)
    if (gained <= 0) return s
    const seeds = Math.min(SEED_MAX, s.seeds + gained)
    return { seeds, last: seeds >= SEED_MAX ? Date.now() : s.last + gained * SEED_MS }
  }

  /* --- Tic de recharge : zéro re-rendu quand le stock est plein --- */
  useEffect(() => {
    const id = window.setInterval(() => {
      setSeedState((s) => (s.seeds >= SEED_MAX ? s : regen(s)))
      if (seedsRef.current < SEED_MAX) setNow(Date.now())
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    seedsRef.current = seedState.seeds
  }, [seedState.seeds])

  /* --- Restauration du jardin sauvegardé (callback asynchrone, jamais setState synchrone dans l'effet) --- */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      if (!alive) return
      const s = loadSave<GardenSave>(gameId)
      if (
        s &&
        Array.isArray(s.board) &&
        s.board.length === CELLS &&
        s.board.every((v) => v === null || (typeof v === 'number' && v >= 1 && v <= MAX_TIER))
      ) {
        restoredRef.current = true
        setBoard(s.board)
        const disc = [...new Set((Array.isArray(s.discovered) ? s.discovered : []).filter((v) => typeof v === 'number' && v >= 1 && v <= MAX_TIER))].sort((a, b) => a - b)
        setDiscovered(disc)
        setGoalsDone((Array.isArray(s.goalsDone) ? s.goalsDone : []).filter((v) => typeof v === 'number' && v >= 0 && v < GOALS.length))
        setPlants(Math.max(0, Math.floor(typeof s.plants === 'number' ? s.plants : 0)))
        setMerges(Math.max(0, Math.floor(typeof s.merges === 'number' ? s.merges : 0)))
        setSeedState(regen({ seeds: clamp(typeof s.seeds === 'number' ? s.seeds : 3, 0, SEED_MAX), last: typeof s.lastSeed === 'number' ? s.lastSeed : Date.now() }))
      } else {
        restoredRef.current = true
        // Nouveau jardin : deux graines pré-plantées pour jouer tout de suite
        const b: (number | null)[] = new Array(CELLS).fill(null)
        const i1 = Math.floor(Math.random() * CELLS)
        let i2 = Math.floor(Math.random() * (CELLS - 1))
        if (i2 >= i1) i2++
        b[i1] = 1
        b[i2] = 1
        setBoard(b)
        setDiscovered([1])
        setSeedState({ seeds: 3, last: Date.now() })
      }
      setNow(Date.now())
      if (!playCountedRef.current) {
        playCountedRef.current = true
        addPlay(gameId)
      }
    })
    return () => {
      alive = false
    }
  }, [addPlay])

  /* --- Sauvegarde automatique à chaque changement --- */
  useEffect(() => {
    if (!restoredRef.current) return
    const data: GardenSave = {
      board,
      discovered,
      goalsDone,
      plants,
      merges,
      seeds: seedState.seeds,
      lastSeed: seedState.last,
    }
    saveSave(gameId, data)
  }, [board, discovered, goalsDone, plants, merges, seedState])

  /* --- Nettoyage des minuteurs au démontage --- */
  useEffect(() => () => {
    window.clearTimeout(bannerTimerRef.current)
    detachDragRef.current()
  }, [])

  /* --- Animations ciblées (remontée de la clé) --- */
  function bump(idx: number) {
    setBumps((b) => {
      const n = [...b]
      n[idx]++
      return n
    })
  }

  /* --- « +N » flottant au-dessus de la case fusionnée --- */
  function addPop(idx: number, text: string) {
    setPops((p) => [...p.slice(-3), { id: ++popIdRef.current, idx, text }])
  }

  /* --- Objectifs --- */
  function goalReached(i: number, d: number[], p: number, m: number): boolean {
    if (i === 0) return d.includes(7)
    if (i === 1) return d.includes(15)
    if (i === 2) return p >= 50
    if (i === 3) return m >= 100
    return d.length >= MAX_TIER
  }

  function checkGoals(nd: number[], p: number, m: number) {
    const newly: number[] = []
    for (let i = 0; i < GOALS.length; i++) {
      if (goalsDone.includes(i)) continue
      if (goalReached(i, nd, p, m)) newly.push(i)
    }
    if (newly.length === 0) return
    setGoalsDone([...goalsDone, ...newly])
    const xp = newly.reduce((n, i) => n + GOALS[i].xp, 0)
    sfx.play('achievement')
    navigator.vibrate?.(15)
    setConfettiKey((k) => k + 1)
    addXp(xp)
    /* Niveaux par jeu : petit bonus par objectif de jardin atteint (5 au total,
       jamais de spam — un objectif n'est franchi qu'une fois). */
    addGameXp(gameId, 4)
    toast('🏅', { description: `${L.goalReached} (+${xp} XP)`, duration: 4500 })
    if (newly.includes(GOALS.length - 1)) {
      // Collection complète : la seule « victoire » du jardin
      addWin(gameId)
      sfx.play('win')
      navigator.vibrate?.([20, 40, 20])
    }
  }

  /* --- Découverte d'une espèce --- */
  function onDiscover(tier: number, nd: number[]) {
    const sp = SPECIES[tier - 1]
    sfx.play('levelup')
    navigator.vibrate?.(20)
    setConfettiKey((k) => k + 1)
    setBurstKey((k) => k + 1)
    setBanner({ id: ++bannerIdRef.current, tier })
    window.clearTimeout(bannerTimerRef.current)
    bannerTimerRef.current = window.setTimeout(() => setBanner(null), 2600)
    toast(sp.emoji, { description: `${L.newSpecies} — ${sp.name[lang]} (+${10 * tier} XP)`, duration: 4500 })
    addXp(10 * tier)
    /* Niveaux par jeu : chaque nouvelle espèce découverte = jalon de session. */
    addGameXp(gameId, 12)
    setBest(gameId, 'species-discovered', nd.length, false)
    setBest(gameId, 'highest-tier', tier, false)
    if (nd.length >= 8) unlockBadge('merge-half')
    if (nd.length >= MAX_TIER) unlockBadge('merge-all')
  }

  /* --- Fusion / déplacement --- */
  function doAction(from: number, to: number) {
    if (from === to) {
      setSelected(null)
      return
    }
    const tier = board[from]
    if (tier === null) return
    const target = board[to]
    if (target === null) {
      const next = [...board]
      next[to] = tier
      next[from] = null
      setBoard(next)
      setSelected(null)
      bump(to)
      sfx.play('drop')
      navigator.vibrate?.(5)
    } else if (target === tier && tier < MAX_TIER) {
      const nt = tier + 1
      const next = [...board]
      next[to] = nt
      next[from] = null
      setBoard(next)
      setSelected(null)
      bump(to)
      sfx.play('merge')
      navigator.vibrate?.(10)
      addPop(to, `+${nt}`)
      const m = merges + 1
      setMerges(m)
      addXp(nt)
      let nd = discovered
      if (!discovered.includes(nt)) {
        nd = [...discovered, nt]
        setDiscovered(nd)
        onDiscover(nt, nd)
      }
      checkGoals(nd, plants, m)
    } else {
      setSelected(to)
      sfx.play('click', { volume: 0.5 })
    }
  }

  /* --- Plantation d'une graine sur une case précise --- */
  function plantAt(idx: number) {
    if (seedState.seeds <= 0 || board[idx] !== null) {
      sfx.play('wrong', { volume: 0.35 })
      return
    }
    const next = [...board]
    next[idx] = 1
    setBoard(next)
    bump(idx)
    setSelected(null)
    setSeedState((s) => ({ seeds: Math.max(0, s.seeds - 1), last: s.seeds >= SEED_MAX ? Date.now() : s.last }))
    sfx.play('pop')
    navigator.vibrate?.(10)
    const p = plants + 1
    setPlants(p)
    checkGoals(discovered, p, merges)
  }

  /* --- Bouton « Planter » : case libre aléatoire --- */
  function plantSeed() {
    if (seedState.seeds <= 0) {
      sfx.play('wrong', { volume: 0.35 })
      return
    }
    const empties: number[] = []
    for (let i = 0; i < CELLS; i++) if (board[i] === null) empties.push(i)
    if (empties.length === 0) {
      sfx.play('wrong', { volume: 0.35 })
      navigator.vibrate?.(10)
      return
    }
    plantAt(empties[Math.floor(Math.random() * empties.length)])
  }

  /* --- Tap (clic) sur une case --- */
  function onTap(idx: number) {
    if (Date.now() < suppressUntilRef.current) return
    const tier = board[idx]
    if (selected === null) {
      if (tier !== null) {
        setSelected(idx)
        sfx.play('click', { volume: 0.5 })
      }
      return
    }
    if (selected === idx) {
      setSelected(null)
      sfx.play('click', { volume: 0.4 })
      return
    }
    const selTier = board[selected]
    if (tier === null || (selTier !== null && tier === selTier)) {
      doAction(selected, idx)
    } else {
      setSelected(idx)
      sfx.play('click', { volume: 0.5 })
    }
  }

  /* --- Glisser-déposer (plante depuis le plateau, graine depuis le compteur) --- */
  function cellFromPoint(x: number, y: number): number | null {
    const el = document.elementFromPoint(x, y) as HTMLElement | null
    const cell = el?.closest ? (el.closest('[data-cell]') as HTMLElement | null) : null
    if (!cell) return null
    const v = Number(cell.dataset.cell)
    return Number.isFinite(v) ? v : null
  }

  function hideGhost() {
    if (ghostRef.current) ghostRef.current.style.opacity = '0'
  }

  /** Démarre un geste : écouteurs fenêtre (le suivi survit à une sortie de
   *  plateau), fantôme impératif (zéro re-render par pointermove), cible
   *  magnétisée avec feedback de validité, seuil 8px pour distinguer tap/drag. */
  function startDrag(kind: 'move' | 'seed', from: number | null, e: React.PointerEvent) {
    draggingRef.current = true
    const pid = e.pointerId
    const sx = e.clientX
    const sy = e.clientY
    const sourceTier = kind === 'move' && from !== null ? board[from] : 1
    let active = false
    let target: number | null = null
    const isValidDrop = (t: number) =>
      kind === 'seed' ? board[t] === null : board[t] === null || board[t] === sourceTier
    const placeGhost = (x: number, y: number) => {
      const g = ghostRef.current
      if (g) g.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -65%) scale(1.18)`
    }
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return
      if (!active) {
        const dx = ev.clientX - sx
        const dy = ev.clientY - sy
        if (dx * dx + dy * dy < DRAG_SLOP_SQ) return
        active = true
        setSelected(null)
        const g = ghostRef.current
        if (g && sourceTier !== null) {
          g.textContent = SPECIES[sourceTier - 1].emoji
          placeGhost(ev.clientX, ev.clientY)
          g.style.opacity = '1'
        }
        sfx.play('swish', { volume: 0.35 })
      } else {
        placeGhost(ev.clientX, ev.clientY)
      }
      const t = cellFromPoint(ev.clientX, ev.clientY)
      const nt = t !== null && t !== from && isValidDrop(t) ? t : null
      if (nt !== target) {
        target = nt
        setDrag({ kind, from, target: nt })
      }
    }
    const up = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return
      detach()
      hideGhost()
      setDrag(null)
      if (!active) return
      suppressUntilRef.current = Date.now() + 400
      const t = cellFromPoint(ev.clientX, ev.clientY)
      if (t === null || t === from) return
      if (kind === 'seed') {
        if (board[t] === null) {
          plantAt(t)
        } else {
          sfx.play('wrong', { volume: 0.35 })
          navigator.vibrate?.(10)
        }
      } else if (from !== null) {
        const tt = board[t]
        if (tt === null || tt === board[from]) {
          doAction(from, t)
        } else {
          sfx.play('wrong', { volume: 0.35 })
          navigator.vibrate?.(10)
        }
      }
    }
    const onCancel = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return
      detach()
      hideGhost()
      setDrag(null)
    }
    const detach = () => {
      draggingRef.current = false
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', onCancel)
    }
    detachDragRef.current = detach
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    window.addEventListener('pointercancel', onCancel, { passive: true })
  }

  function onBoardPointerDown(e: React.PointerEvent) {
    if (draggingRef.current) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    suppressUntilRef.current = 0
    const idx = cellFromPoint(e.clientX, e.clientY)
    if (idx === null || board[idx] === null) return
    startDrag('move', idx, e)
  }

  function onSeedPointerDown(e: React.PointerEvent) {
    if (draggingRef.current) return
    if (seedState.seeds <= 0) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    startDrag('seed', null, e)
  }

  /* --- Valeurs dérivées --- */
  const progress =
    seedState.seeds >= SEED_MAX
      ? 1
      : Math.max(0, Math.min(1, (now > 0 ? now - seedState.last : 0) / SEED_MS))
  const maxTier = discovered.reduce((a, b) => Math.max(a, b), 0)
  /* QI estimé (Task 18) : jeu zen sans fin de manche — il reflète la
   * PROGRESSION de la collection (espèces découvertes / 16, plancher 0,15),
   * difficulté 2 (parcours complet). Affiché dans le livre du jardin ; la
   * IqCard enregistre elle-même le record best-iq. */
  const gardenIq = useMemo(
    () => computeIq(gameId, { accuracy: clamp(discovered.length / MAX_TIER, 0.15, 1), difficulty: 2 }),
    [discovered.length],
  )
  const boardFull = board.every((v) => v !== null)
  const nextGoalIdx = GOALS.findIndex((_, i) => !goalsDone.includes(i))
  const goalText =
    nextGoalIdx === -1 ? L.allDone
    : nextGoalIdx === 2 ? L.plants
    : nextGoalIdx === 3 ? L.merges
    : GOALS[nextGoalIdx].label[lang]
  const goalCount =
    nextGoalIdx === 2 ? `${Math.min(plants, 50)}/50`
    : nextGoalIdx === 3 ? `${Math.min(merges, 100)}/100`
    : null
  const goalTitle = nextGoalIdx === -1 ? L.allDone : GOALS[nextGoalIdx].label[lang]
  const seedTitle =
    (seedState.seeds >= SEED_MAX
      ? L.stockFull
      : `${L.nextSeed} : ${Math.max(0, Math.ceil((SEED_MS - Math.max(0, now - seedState.last)) / 1000))} s`) +
    ` — ${L.dragSeed}`

  /* --- Partage discret de la collection (jeu zen sans fin de manche : le
         bouton « Partager ce jeu » de la barre immersive couvre le jeu
         lui-même, celui-ci partage la progression du jardin). --- */
  async function shareCollection() {
    sfx.play('coin', { volume: 0.6 })
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}${buildHash(lang, { type: 'game', slug: gameId })}`
        : ''
    const title = getGame(gameId)?.title[lang] ?? 'Granmed'
    const line = L.shareLine
      .replace('{n}', String(discovered.length))
      .replace('{total}', String(MAX_TIER))
      .replace('{tier}', String(maxTier || 1))
    const ok = await shareText(title, `${line}\n${title} — Granmed\n${url}`)
    if (ok) toast.success(t('common.copied'))
  }

  /* --- Rendu --- */
  return (
    <div className="relative my-auto w-full select-none">
      {/* HUD compact — une ligne : graines + progression, planter, collection
          (avec l’espèce max), fusions, prochain objectif */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
        <div
          role="group"
          aria-label={`${L.seeds} : ${seedState.seeds}/${SEED_MAX}`}
          title={seedTitle}
          onPointerDown={onSeedPointerDown}
          className="flex h-11 cursor-grab touch-none items-center gap-2 rounded-full border border-emerald-200 bg-card pl-2.5 pr-3 transition-colors hover:border-emerald-300 active:cursor-grabbing dark:border-emerald-500/25 dark:hover:border-emerald-500/40"
        >
          <span className="text-lg leading-none" aria-hidden="true">🌱</span>
          <span className="text-sm font-extrabold tabular-nums">
            {seedState.seeds}
            <span className="font-semibold text-muted-foreground">/{SEED_MAX}</span>
          </span>
          <span className="relative block h-2 w-12 overflow-hidden rounded-full bg-secondary sm:w-16" aria-hidden="true">
            <span
              className="absolute inset-y-0 start-0 rounded-full bg-emerald-500 transition-[width] duration-500"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </span>
        </div>

        <Button
          className="h-11 shrink-0 rounded-full px-3 sm:px-4"
          onClick={plantSeed}
          disabled={seedState.seeds <= 0}
          title={seedState.seeds <= 0 ? L.noSeeds : L.plantFull}
          aria-label={L.plantFull}
        >
          <Sprout className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{L.plant}</span>
        </Button>

        <Button
          variant="secondary"
          className="h-11 shrink-0 gap-1.5 rounded-full px-3"
          onClick={() => {
            sfx.play('pop')
            setBookOpen(true)
          }}
          aria-label={`${L.collection} : ${discovered.length}/${MAX_TIER}`}
          title={L.collection}
        >
          {maxTier > 0 ? (
            <span className="text-base leading-none" aria-hidden="true">{SPECIES[maxTier - 1].emoji}</span>
          ) : (
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="text-sm font-extrabold tabular-nums">
            {discovered.length}
            <span className="font-semibold text-muted-foreground">/{MAX_TIER}</span>
          </span>
          <BookOpen className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" aria-hidden="true" />
        </Button>

        <span className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-sm font-semibold" title={L.merges}>
          <span aria-hidden="true">✨</span>
          <span className="tabular-nums">{merges}</span>
          <span className="sr-only">{L.merges}</span>
        </span>

        <span
          className="ms-auto flex h-9 min-w-0 max-w-full items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-2.5 text-xs font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
          title={goalTitle}
        >
          <span aria-hidden="true">🎯</span>
          <span className="truncate">{goalText}</span>
          {goalCount !== null ? <span className="shrink-0 tabular-nums opacity-80">{goalCount}</span> : null}
        </span>
      </div>

      {/* Plateau — largeur bornée par le budget vertical mobile (voir BOARD_WIDTH_CSS) */}
      <div className="relative mx-auto" style={{ width: BOARD_WIDTH_CSS }}>
        <div
          role="group"
          aria-label={L.board}
          onPointerDown={onBoardPointerDown}
          onContextMenu={(e) => e.preventDefault()}
          className="checkerboard touch-none relative grid aspect-[6/7] grid-cols-6 grid-rows-7 gap-1.5 rounded-2xl border-2 border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-amber-50 to-rose-50 p-1.5 dark:border-emerald-500/20 dark:from-emerald-500/10 dark:via-transparent dark:to-rose-500/10 sm:gap-2 sm:p-2"
        >
          {board.map((tier, i) => {
            const isSel = selected === i
            const isDrop = drag !== null && drag.target === i
            const dropMerge = isDrop && drag?.kind === 'move' && drag.from !== null && board[i] !== null && board[drag.from] === board[i]
            const isSource = drag?.kind === 'move' && drag.from === i
            const sp = tier !== null ? SPECIES[tier - 1] : null
            const label = sp ? `${sp.name[lang]} (${L.tier} ${tier})` : L.emptyCell
            return (
              <button
                key={i}
                type="button"
                data-cell={i}
                aria-label={label}
                aria-pressed={isSel}
                title={label}
                onClick={() => onTap(i)}
                className={cn(
                  'no-select relative flex min-h-0 min-w-0 items-center justify-center rounded-xl border transition-all duration-150 focus-visible:outline-2 focus-visible:outline-ring active:scale-95',
                  tier === null
                    ? 'border-emerald-200/40 bg-white/40 dark:border-white/5 dark:bg-white/5'
                    : 'border-amber-200/70 bg-white shadow-sm hover:border-amber-300 dark:border-amber-500/20 dark:bg-card',
                  isSel && 'z-10 scale-105 ring-2 ring-primary',
                  isDrop && dropMerge && 'z-10 scale-[1.06] ring-2 ring-emerald-500',
                  isDrop && !dropMerge && 'z-10 scale-[1.06] ring-2 ring-amber-400',
                  isSource && 'opacity-40',
                )}
              >
                {sp && tier !== null ? (
                  <span
                    key={`${tier}-${bumps[i]}`}
                    className={cn('text-[clamp(17px,5.8vw,32px)] leading-none', !reduce && 'anim-pop-in')}
                    aria-hidden="true"
                  >
                    {sp.emoji}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        {/* « +N » flottants aux fusions */}
        {pops.map((p) => (
          <span
            key={p.id}
            aria-hidden="true"
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 text-sm font-extrabold text-emerald-600 drop-shadow anim-score dark:text-emerald-300"
            style={{
              left: `${((p.idx % COLS) + 0.5) * (100 / COLS)}%`,
              top: `${(Math.floor(p.idx / COLS) + 0.5) * (100 / ROWS)}%`,
            }}
          >
            {p.text}
          </span>
        ))}

        {/* Mise en avant d’une nouvelle espèce découverte */}
        {banner ? (
          <div key={banner.id} className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center" aria-live="polite">
            <div
              className={cn(
                'flex flex-col items-center gap-1 rounded-2xl border-2 border-amber-300 bg-card/95 px-5 py-3 text-center shadow-xl',
                !reduce && 'anim-pop-in',
              )}
            >
              <span className={cn('leading-none', reduce ? 'text-4xl' : 'anim-floaty text-5xl')} aria-hidden="true">
                {SPECIES[banner.tier - 1].emoji}
              </span>
              <span className="font-display text-sm font-extrabold">{L.newSpecies}</span>
              <span className="text-xs text-muted-foreground">
                {SPECIES[banner.tier - 1].name[lang]} · {L.tier} {banner.tier} · +{10 * banner.tier} XP
              </span>
            </div>
          </div>
        ) : null}

        <Confetti fire={confettiKey} count={reduce ? 0 : 90} />
        <VictoryBurst
          fire={burstKey}
          stars={banner ? (banner.tier >= 13 ? 3 : banner.tier >= 8 ? 2 : 1) : 3}
          title={L.newSpecies}
          sub={banner ? `${SPECIES[banner.tier - 1].name[lang]} · ${L.tier} ${banner.tier}` : undefined}
          emoji={banner ? SPECIES[banner.tier - 1].emoji : '🌱'}
        />
      </div>

      {/* Statut + aide contextuelle — toujours SOUS le plateau, jamais au-dessus */}
      {boardFull ? (
        <p role="status" className="anim-rise mt-2 text-center text-xs font-semibold text-amber-700 dark:text-amber-300">
          {L.boardFull}
        </p>
      ) : null}
      <p className="mt-2 text-center text-[11px] leading-snug text-muted-foreground">{L.howTo}</p>

      {/* Objectifs */}
      <div className="mt-3 rounded-2xl border bg-card/70 p-3 sm:p-4">
        <h3 className="mb-2 flex items-center gap-2 font-display text-sm font-bold sm:text-base">
          <span aria-hidden="true">🎯</span> {L.goals}
          <span className="ms-auto text-xs font-bold tabular-nums text-muted-foreground">
            {goalsDone.length}/{GOALS.length}
          </span>
        </h3>
        <ul className="grid gap-1.5 sm:grid-cols-2 sm:gap-2">
          {GOALS.map((g, i) => {
            const done = goalsDone.includes(i)
            const target = i === 2 ? 50 : i === 3 ? 100 : null
            const count = target !== null ? Math.min(i === 2 ? plants : merges, target) : null
            return (
              <li
                key={i}
                className={cn(
                  'flex items-center gap-2 rounded-xl border p-2 text-[13px] sm:p-2.5 sm:text-sm',
                  done
                    ? 'border-emerald-300/70 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                    : 'border-border bg-card',
                )}
              >
                {done ? (
                  <CircleCheckBig className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden="true" />
                )}
                <span className={cn('min-w-0 flex-1 leading-tight', done && 'line-through opacity-70')}>{g.label[lang]}</span>
                {count !== null && !done ? (
                  <span className="shrink-0 text-xs font-bold tabular-nums text-muted-foreground">
                    {count}/{target}
                  </span>
                ) : null}
                {!done ? (
                  <span className="shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">+{g.xp}</span>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Livre de collection */}
      <Dialog open={bookOpen} onOpenChange={(o) => setBookOpen(o)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto nice-scroll">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">📖 {L.bookTitle}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-muted-foreground">
            {L.bookSub} — {discovered.length}/{MAX_TIER} · {L.tier} max : {maxTier || '–'} · {L.plants} : {plants} · {L.merges} : {merges}
          </DialogDescription>
          <Button
            variant="outline"
            className="mt-2 h-11 w-full gap-2 rounded-full text-xs font-bold sm:text-sm"
            onClick={shareCollection}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            {L.shareCollection}
          </Button>
          {/* QI estimé lié à la collection (Task 18) — couronne le livre du jardin */}
          <IqCard gameId={gameId} iq={gardenIq} className="mt-3" />
          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {SPECIES.map((sp, i) => {
              const tier = i + 1
              const found = discovered.includes(tier)
              return (
                <div
                  key={tier}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center',
                    found
                      ? 'border-amber-200 bg-amber-50/70 dark:border-amber-500/25 dark:bg-amber-500/10'
                      : 'border-dashed border-border opacity-60',
                  )}
                >
                  <span className="text-3xl" aria-hidden="true">{found ? sp.emoji : '❓'}</span>
                  <span className="text-[11px] font-semibold leading-tight">{found ? sp.name[lang] : '?'}</span>
                  <span className="text-[10px] tabular-nums text-muted-foreground">#{tier}</span>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Fantôme de glisser-déposer — piloté en impératif (zéro re-render) */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 select-none text-4xl leading-none opacity-0 drop-shadow-xl transition-opacity duration-150 will-change-transform"
      />
    </div>
  )
}
