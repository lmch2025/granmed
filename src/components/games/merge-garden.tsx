'use client'

import { useEffect, useRef, useState } from 'react'
import { BookOpen, Sprout, CircleCheckBig, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang, type Lang } from '@/lib/i18n'
import { useProfileStore } from '@/lib/progress/store'
import { loadSave, saveSave } from '@/lib/save'
import { useReducedMotion } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

export const gameId = 'merge-garden'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Fusionnez graines et plantes pour découvrir 16 espèces, du bourgeon jusqu’au jardin complet de Gran.',
    en: 'Merge seeds and plants to discover 16 species, from tiny buds all the way to Gran’s complete garden.',
  },
  description: {
    fr: [
      'Jardin de Gran est un jeu de fusion zen et gratuit dans lequel vous plantez des graines sur un plateau de 6×7 cases, puis combinez deux plantes identiques pour les faire évoluer en l’espèce supérieure, de la simple graine jusqu’au grand chêne et au jardin complet de Gran.',
      'Chaque fusion rapporte de l’expérience et chaque nouvelle espèce découverte enrichit votre livre de collection. Votre stock de graines se recharge automatiquement (une toutes les 20 secondes, dans la limite de 5), même quand vous quittez la page : le jardin pousse à votre rythme, sans game-over ni pression.',
      'Cinq objectifs progressifs structurent la partie — découvrir le tournesol, atteindre le grand chêne, planter 50 graines, fusionner 100 fois et compléter les 16 espèces — et tout est sauvegardé automatiquement sur votre appareil.',
    ],
    en: [
      'Gran’s Garden is a calm, free merge game where you plant seeds on a 6×7 board, then combine two identical plants to evolve them into the next species, from a simple seed all the way to the great oak and Gran’s complete garden.',
      'Every merge earns experience and each newly discovered species enriches your collection book. Your seed stock refills automatically (one every 20 seconds, up to 5), even while you are away: the garden grows at your own pace, with no game over and no pressure.',
      'Five progressive goals structure the game — discover the sunflower, reach the great oak, plant 50 seeds, merge 100 times and complete all 16 species — and everything is saved automatically on your device.',
    ],
  },
  rules: {
    fr: [
      'Touchez une plante pour la sélectionner (anneau de sélection).',
      'Touchez une case vide pour y déplacer la plante sélectionnée.',
      'Touchez une plante identique pour fusionner les deux en l’espèce supérieure.',
      'Le bouton « Planter une graine » place une graine (niveau 1) sur une case libre.',
      'Le stock de graines (maximum 5) se recharge d’une unité toutes les 20 secondes.',
      'Il n’y a pas de fin : découvrez les 16 espèces à votre rythme.',
    ],
    en: [
      'Tap a plant to select it (selection ring).',
      'Tap an empty cell to move the selected plant there.',
      'Tap an identical plant to merge both into the next species.',
      'The “Plant a seed” button drops a seed (tier 1) on a free cell.',
      'The seed stock (max 5) refills by one every 20 seconds.',
      'There is no end: discover the 16 species at your own pace.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez une plante puis une autre case pour fusionner ou déplacer.',
      'Ordinateur : cliquez pour sélectionner puis agir ; maintenez et faites glisser une plante vers une autre case fonctionne aussi.',
      'Aucune commande clavier nécessaire — tout se joue au doigt ou à la souris.',
    ],
    en: [
      'Mobile & tablet: tap a plant, then tap another cell to merge or move.',
      'Desktop: click to select then act; holding and dragging a plant onto another cell works too.',
      'No keyboard needed — everything is played by finger or mouse.',
    ],
  },
  features: {
    fr: [
      '16 espèces à découvrir, de la graine 🌱 au jardin de Gran 🏡',
      'Plateau 6×7 sans game-over : une progression zen',
      'Stock de 5 graines rechargeable (1 toutes les 20 s, même hors ligne)',
      'Livre de collection des espèces découvertes',
      '5 objectifs progressifs avec récompenses d’expérience',
      'Sauvegarde automatique du jardin sur votre appareil',
    ],
    en: [
      '16 species to discover, from the seed 🌱 to Gran’s garden 🏡',
      '6×7 board with no game over: a zen progression',
      'Refillable stock of 5 seeds (1 every 20 s, even offline)',
      'Collection book of discovered species',
      '5 progressive goals with experience rewards',
      'Automatic save of your garden on your device',
    ],
  },
  tips: {
    fr: [
      'Regroupez les espèces par niveau dans des zones du plateau : vous verrez immédiatement les fusions possibles.',
      'Ne montez pas trop vite : garder plusieurs plantes de niveau intermédiaire évite de bloquer le plateau.',
      'Plantez vos graines à côté de plants de même niveau pour fusionner en un seul geste.',
      'Le stock se recharge même page fermée : revenez plus tard pour une session de plantation plus généreuse.',
    ],
    en: [
      'Group species by tier in zones of the board: you will instantly see the possible merges.',
      'Do not climb too fast: keeping several mid-tier plants avoids locking the board.',
      'Plant seeds next to same-tier sprouts to merge in a single gesture.',
      'The stock refills even with the page closed: come back later for a more generous planting session.',
    ],
  },
  faq: {
    fr: [
      { q: 'Jardin de Gran est-il vraiment gratuit ?', a: 'Oui, le jeu est entièrement gratuit, sans inscription ni téléchargement, et votre jardin est sauvegardé localement sur votre appareil.' },
      { q: 'Que se passe-t-il quand le plateau est plein ?', a: 'Il n’y a pas de game-over : fusionnez des plantes identiques pour libérer des cases. Avec 16 espèces pour 42 cases, une fusion reste toujours possible.' },
      { q: 'Comment se recharge le stock de graines ?', a: 'Une graine est ajoutée toutes les 20 secondes, jusqu’à un maximum de 5. La recharge continue même si vous quittez la page, grâce à l’horodatage sauvegardé.' },
      { q: 'Combien d’espèces existe-t-il ?', a: '16 espèces, de la graine (niveau 1) au jardin de Gran (niveau 16). Le livre de collection vous montre celles découvertes et celles qui restent.' },
      { q: 'Puis-je jouer sur mobile ?', a: 'Oui, le jeu est conçu pour le tactile : chaque case dépasse 44 pixels et se joue au doigt, en portrait comme en paysage.' },
    ],
    en: [
      { q: 'Is Gran’s Garden really free?', a: 'Yes, the game is completely free, with no sign-up and no download, and your garden is saved locally on your device.' },
      { q: 'What happens when the board is full?', a: 'There is no game over: merge identical plants to free cells. With 16 species for 42 cells, a merge is always still possible.' },
      { q: 'How does the seed stock refill?', a: 'One seed is added every 20 seconds, up to a maximum of 5. Refilling continues even if you leave the page, thanks to the saved timestamp.' },
      { q: 'How many species are there?', a: '16 species, from the seed (tier 1) to Gran’s garden (tier 16). The collection book shows the ones you have discovered and the ones left.' },
      { q: 'Can I play on mobile?', a: 'Yes, the game is touch-first: every cell is larger than 44 pixels and playable with a finger, in portrait or landscape.' },
    ],
  },
  records: {
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
    plant: 'Planter une graine',
    collection: 'Collection',
    species: 'Espèces',
    merges: 'Fusions',
    goals: 'Objectifs du jardin',
    goalReached: 'Objectif du jardin atteint',
    newSpecies: 'Nouvelle espèce découverte',
    howTo: 'Touchez une plante puis une autre case : deux plantes identiques fusionnent, une case vide accueille un déplacement. Le glisser-déposer fonctionne aussi.',
    nextSeed: 'prochaine graine',
    bookTitle: 'Livre du jardin',
    bookSub: 'Espèces découvertes',
    emptyCell: 'Case vide',
    board: 'Plateau du jardin',
    tier: 'niveau',
    boardFull: 'Plateau complet — fusionnez des plantes identiques !',
    noSeeds: 'Plus de graines — patientez la recharge',
  },
  en: {
    plant: 'Plant a seed',
    collection: 'Collection',
    species: 'Species',
    merges: 'Merges',
    goals: 'Garden goals',
    goalReached: 'Garden goal reached',
    newSpecies: 'New species discovered',
    howTo: 'Tap a plant then another cell: two identical plants merge, an empty cell receives a move. Drag & drop works too.',
    nextSeed: 'next seed',
    bookTitle: 'Garden book',
    bookSub: 'Discovered species',
    emptyCell: 'Empty cell',
    board: 'Garden board',
    tier: 'tier',
    boardFull: 'Board full — merge identical plants!',
    noSeeds: 'No seeds left — wait for the refill',
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

/* ================= Composant principal ================= */
export default function MergeGardenGame() {
  const lang = useLang()
  const reduce = useReducedMotion()
  const L = STR[lang]
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const addPlay = useProfileStore((s) => s.addPlay)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)

  const [board, setBoard] = useState<(number | null)[]>(() => new Array(CELLS).fill(null))
  const [discovered, setDiscovered] = useState<number[]>([])
  const [goalsDone, setGoalsDone] = useState<number[]>([])
  const [plants, setPlants] = useState(0)
  const [merges, setMerges] = useState(0)
  const [seedState, setSeedState] = useState<{ seeds: number; last: number }>(() => ({ seeds: 3, last: Date.now() }))
  const [selected, setSelected] = useState<number | null>(null)
  const [bumps, setBumps] = useState<number[]>(() => new Array(CELLS).fill(0))
  const [dragTarget, setDragTarget] = useState<number | null>(null)
  const [bookOpen, setBookOpen] = useState(false)
  const [now, setNow] = useState(0)

  const restoredRef = useRef(false)
  const playCountedRef = useRef(false)
  const dragRef = useRef<{ from: number; target: number | null } | null>(null)
  const suppressUntilRef = useRef(0)

  /* --- Recharge des graines : 1 toutes les 20 s (avec rattrapage hors ligne) --- */
  function regen(s: { seeds: number; last: number }): { seeds: number; last: number } {
    if (s.seeds >= SEED_MAX) return s
    const elapsed = Date.now() - s.last
    const gained = Math.floor(elapsed / SEED_MS)
    if (gained <= 0) return s
    const seeds = Math.min(SEED_MAX, s.seeds + gained)
    return { seeds, last: seeds >= SEED_MAX ? Date.now() : s.last + gained * SEED_MS }
  }

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeedState((s) => (s.seeds >= SEED_MAX ? s : regen(s)))
      setNow(Date.now())
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

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
        s.board.every((v) => v === null || (typeof v === 'number' && v >= 1 && v <= MAX_TIER)) &&
        Array.isArray(s.discovered)
      ) {
        restoredRef.current = true
        setBoard(s.board)
        setDiscovered(s.discovered)
        setGoalsDone(Array.isArray(s.goalsDone) ? s.goalsDone : [])
        setPlants(typeof s.plants === 'number' ? s.plants : 0)
        setMerges(typeof s.merges === 'number' ? s.merges : 0)
        setSeedState(regen({ seeds: typeof s.seeds === 'number' ? s.seeds : 3, last: typeof s.lastSeed === 'number' ? s.lastSeed : Date.now() }))
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

  /* --- Animations ciblées (remontée de la clé) --- */
  function bump(idx: number) {
    setBumps((b) => {
      const n = [...b]
      n[idx]++
      return n
    })
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
    addXp(xp)
    toast('🏅', { description: `${L.goalReached} (+${xp} XP)`, duration: 4500 })
  }

  /* --- Découverte d'une espèce --- */
  function onDiscover(tier: number, nd: number[]) {
    sfx.play('reveal')
    const sp = SPECIES[tier - 1]
    toast(sp.emoji, { description: `${L.newSpecies} — ${sp.name[lang]} (+${10 * tier} XP)`, duration: 4500 })
    addXp(10 * tier)
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
    } else if (target === tier && tier < MAX_TIER) {
      const nt = tier + 1
      const next = [...board]
      next[to] = nt
      next[from] = null
      setBoard(next)
      setSelected(null)
      bump(to)
      sfx.play('merge')
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

  /* --- Plantation d'une graine --- */
  function plantSeed() {
    if (seedState.seeds <= 0) {
      sfx.play('wrong', { volume: 0.35 })
      return
    }
    const empties: number[] = []
    for (let i = 0; i < CELLS; i++) if (board[i] === null) empties.push(i)
    if (empties.length === 0) {
      sfx.play('wrong', { volume: 0.35 })
      return
    }
    const idx = empties[Math.floor(Math.random() * empties.length)]
    const next = [...board]
    next[idx] = 1
    setBoard(next)
    bump(idx)
    setSelected(null)
    setSeedState((s) => ({ seeds: Math.max(0, s.seeds - 1), last: s.seeds >= SEED_MAX ? Date.now() : s.last }))
    sfx.play('pop')
    const p = plants + 1
    setPlants(p)
    checkGoals(discovered, p, merges)
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

  /* --- Glisser-déposer (bonus, tactile + souris) --- */
  function cellFromPoint(x: number, y: number): number | null {
    const el = document.elementFromPoint(x, y) as HTMLElement | null
    const cell = el?.closest ? (el.closest('[data-cell]') as HTMLElement | null) : null
    if (!cell) return null
    const v = Number(cell.dataset.cell)
    return Number.isFinite(v) ? v : null
  }

  function onBoardPointerDown(e: React.PointerEvent) {
    suppressUntilRef.current = 0
    const idx = cellFromPoint(e.clientX, e.clientY)
    if (idx === null || board[idx] === null) return
    dragRef.current = { from: idx, target: null }
  }

  function onBoardPointerMove(e: React.PointerEvent) {
    const d = dragRef.current
    if (!d) return
    const idx = cellFromPoint(e.clientX, e.clientY)
    const target = idx !== null && idx !== d.from ? idx : null
    if (target !== d.target) {
      d.target = target
      setDragTarget(target)
    }
  }

  function onBoardPointerUp(e: React.PointerEvent) {
    const d = dragRef.current
    dragRef.current = null
    setDragTarget(null)
    if (!d) return
    const idx = cellFromPoint(e.clientX, e.clientY)
    if (idx !== null && idx !== d.from && board[idx] !== undefined) {
      suppressUntilRef.current = Date.now() + 500
      doAction(d.from, idx)
    }
  }

  function clearDrag() {
    dragRef.current = null
    setDragTarget(null)
  }

  const progress =
    seedState.seeds >= SEED_MAX
      ? 1
      : Math.max(0, Math.min(1, (now > 0 ? now - seedState.last : 0) / SEED_MS))

  const maxTier = discovered.reduce((a, b) => Math.max(a, b), 0)

  /* --- Rendu --- */
  return (
    <div className="relative select-none">
      {/* Barre d'actions */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div
          className="flex h-11 items-center gap-2.5 rounded-full border border-emerald-200 bg-card px-3.5 dark:border-emerald-500/25"
          role="status"
          aria-label={`${L.species} : ${seedState.seeds}/${SEED_MAX}`}
        >
          <span className="text-lg" aria-hidden="true">🌱</span>
          <span className="text-sm font-extrabold tabular-nums">
            {seedState.seeds}
            <span className="font-semibold text-muted-foreground">/{SEED_MAX}</span>
          </span>
          <span className="relative block h-2 w-16 overflow-hidden rounded-full bg-secondary" title={L.nextSeed} aria-hidden="true">
            <span
              className="absolute inset-y-0 start-0 rounded-full bg-emerald-500 transition-[width] duration-500"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </span>
        </div>
        <Button size="lg" className="h-11 rounded-full" onClick={plantSeed} disabled={seedState.seeds <= 0} title={seedState.seeds <= 0 ? L.noSeeds : L.plant}>
          <Sprout className="h-4 w-4" aria-hidden="true" />
          {L.plant}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="h-11 rounded-full"
          onClick={() => {
            sfx.play('pop')
            setBookOpen(true)
          }}
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          {L.collection}
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold tabular-nums">
            {discovered.length}/{MAX_TIER}
          </span>
        </Button>
        <div className="ms-auto flex flex-wrap items-center gap-2">
          <StatPill icon="🌸" label={L.species} value={`${discovered.length}/${MAX_TIER}`} />
          <StatPill icon="✨" label={L.merges} value={merges} />
        </div>
      </div>

      {/* Plateau */}
      <div
        role="grid"
        aria-label={L.board}
        className="checkerboard touch-none relative grid grid-cols-6 gap-1.5 rounded-2xl border-2 border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-amber-50 to-rose-50 p-2 dark:border-emerald-500/20 dark:from-emerald-500/10 dark:via-transparent dark:to-rose-500/10"
        onPointerDown={onBoardPointerDown}
        onPointerMove={onBoardPointerMove}
        onPointerUp={onBoardPointerUp}
        onPointerCancel={clearDrag}
      >
        {board.map((tier, i) => {
          const isSel = selected === i
          const isDrop = dragTarget === i
          const sp = tier !== null ? SPECIES[tier - 1] : null
          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              data-cell={i}
              aria-label={sp ? `${sp.name[lang]} (${L.tier} ${tier})` : L.emptyCell}
              onClick={() => onTap(i)}
              className={cn(
                'relative flex aspect-square items-center justify-center rounded-xl border transition-all duration-150 focus-visible:outline-2 focus-visible:outline-ring',
                tier === null
                  ? 'border-emerald-200/40 bg-white/40 dark:border-white/5 dark:bg-white/5'
                  : 'border-amber-200/70 bg-white shadow-sm hover:border-amber-300 dark:border-amber-500/20 dark:bg-card',
                isSel && 'z-10 scale-105 ring-2 ring-primary',
                isDrop && 'z-10 scale-105 ring-2 ring-primary/60',
              )}
            >
              {sp && tier !== null ? (
                <span
                  key={`${tier}-${bumps[i]}`}
                  className={cn('no-select text-2xl leading-none sm:text-3xl', !reduce && 'anim-pop-in')}
                  aria-hidden="true"
                >
                  {sp.emoji}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">{L.howTo}</p>

      {/* Objectifs */}
      <div className="mt-4 rounded-2xl border bg-card/70 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
          <span aria-hidden="true">🎯</span> {L.goals}
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {GOALS.map((g, i) => {
            const done = goalsDone.includes(i)
            const count = i === 2 ? Math.min(plants, 50) : i === 3 ? Math.min(merges, 100) : null
            return (
              <li
                key={i}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border p-2.5 text-sm',
                  done ? 'border-emerald-300/70 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-500/10' : 'border-border bg-card',
                )}
              >
                {done ? (
                  <CircleCheckBig className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted-foreground/50" aria-hidden="true" />
                )}
                <span className={cn('min-w-0 flex-1 leading-tight', done && 'line-through opacity-70')}>{g.label[lang]}</span>
                {count !== null && !done ? (
                  <span className="shrink-0 text-xs font-bold tabular-nums text-muted-foreground">{count}/{i === 2 ? 50 : 100}</span>
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
          <p className="text-sm text-muted-foreground">
            {L.bookSub} — {discovered.length}/{MAX_TIER} · {L.tier} max : {maxTier || '–'}
          </p>
          <div className="grid grid-cols-4 gap-2.5">
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
    </div>
  )
}

function StatPill({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <span className="flex h-11 items-center gap-2 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
      <span aria-hidden="true">{icon}</span>
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
