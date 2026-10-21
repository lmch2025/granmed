'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, History, Library, RotateCcw, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useLang } from '@/lib/i18n'
import { useProfileStore } from '@/lib/progress/store'
import { loadSave, saveSave } from '@/lib/save'
import { useReducedMotion } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Confetti } from '@/components/shared/confetti'
import { STORIES, type Story } from '@/components/games/data/interactive-story-data'

export const gameId = 'interactive-story'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Deux récits à embranchements où vos décisions mènent à six fins différentes : lisez, choisissez, recommencez.',
    en: 'Two branching tales where your choices lead to six different endings: read, decide, start again.',
  },
  description: {
    fr: [
      "Histoire Interactive est un jeu de narration à choix multiples dans lequel vous lisez un récit court, chapitre par chapitre, et décidez à chaque étape de ce que fait le personnage. Vos choix orientent l'intrigue et mènent à l'une des trois fins de chaque histoire.",
      "Le jeu propose deux récits chaleureux — « Le Jardin de Grand-Mère » et « La Lettre au Fond du Tiroir » — écrits en chapitres courts, avec des personnages attachants et des décisions qui mènent vraiment à des chemins différents.",
      "Votre progression est sauvegardée automatiquement : reprenez votre chapitre en cours, relisez l'historique de vos décisions et collectionnez les six fins à découvrir (trois par histoire).",
    ],
    en: [
      'Interactive Story is a choose-your-own-adventure game in which you read a short tale chapter by chapter and decide, at every step, what the hero does next. Your choices steer the plot toward one of three endings per story.',
      'The game offers two warm tales — “Grandma\u2019s Garden” and “The Letter at the Bottom of the Drawer” — written in short chapters, with endearing characters and decisions that genuinely branch the narrative.',
      'Your progress is saved automatically: resume your current chapter, review the history of your decisions, and collect all six endings to discover (three per story).',
    ],
  },
  rules: {
    fr: [
      "Choisissez l'une des deux histoires depuis la bibliothèque.",
      'Lisez le chapitre, puis touchez l\u2019une des décisions proposées.',
      'Vos choix modifient le récit et conduisent vers l\u2019une des trois fins de chaque histoire.',
      'Une fin découverte reste mémorisée : rejouez pour explorer les autres chemins.',
    ],
    en: [
      'Pick one of the two tales from the library.',
      'Read the chapter, then tap one of the decisions offered.',
      'Your choices change the story and lead to one of the three endings of each tale.',
      'A discovered ending stays recorded: replay to explore the other paths.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez une décision pour continuer le récit.',
      'Ordinateur : cliquez sur les décisions, ou naviguez avec Tab puis validez avec Entrée.',
      'Le bouton retour en haut du lecteur ramène à la bibliothèque sans perdre votre progression.',
    ],
    en: [
      'Mobile & tablet: tap a decision to continue the tale.',
      'Desktop: click decisions, or navigate with Tab and confirm with Enter.',
      'The back button at the top of the reader returns to the library without losing your progress.',
    ],
  },
  features: {
    fr: [
      '2 histoires complètes à embranchements (19 et 16 chapitres)',
      '6 fins à découvrir — 3 par histoire',
      'Reprise automatique du chapitre en cours',
      'Historique repliable « Vos décisions »',
      'Véritables adaptations culturelles FR/EN (mêmes embranchements, écriture localisée)',
    ],
    en: [
      '2 complete branching tales (19 and 16 chapters)',
      '6 endings to discover — 3 per story',
      'Automatic resume of your current chapter',
      'Collapsible “Your decisions” history',
      'Genuine FR/EN cultural adaptations (same branching, localized writing)',
    ],
  },
  tips: {
    fr: [
      'Explorez chaque choix : deux boutons peuvent mener à des chapitres très différents.',
      'Les fins « quartier » passent par les autres personnages ; la fin « trésor » demande de la curiosité.',
      'Utilisez l\u2019historique de décisions pour vous souvenir du chemin déjà pris.',
      'Après une fin, « Explorer une autre fin » relance immédiatement l\u2019histoire.',
    ],
    en: [
      'Explore every choice: two buttons can lead to very different chapters.',
      'The “neighborhood” endings come through other characters; the “treasure” ending takes curiosity.',
      'Use the decision history to remember the path you already took.',
      'After an ending, “Explore another ending” restarts the story right away.',
    ],
  },
  faq: {
    fr: [
      { q: 'Histoire Interactive est-elle adaptée aux enfants ?', a: 'Oui : les deux récits sont doux, sans violence ni moment effrayant, avec des personnages bienveillants et des chapitres très courts.' },
      { q: 'Combien de temps dure une lecture ?', a: 'Un chemin complet se lit en trois à cinq minutes. Comptez une vingtaine de minutes pour explorer les six fins des deux histoires.' },
      { q: 'Mes choix ont-ils vraiment un impact ?', a: 'Oui : chaque histoire est un vrai graphe à embranchements, et chaque fin n\u2019est accessible que par certains chemins. Deux lectures diffèrent réellement.' },
      { q: 'Puis-je reprendre une histoire en cours ?', a: 'Oui : votre chapitre et vos décisions sont sauvegardés automatiquement sur votre appareil. Un bandeau « Reprendre » s\u2019affiche sur la couverture concernée.' },
      { q: 'Les histoires sont-elles les mêmes en français et en anglais ?', a: 'Elles partagent la même structure et les mêmes embranchements, mais chaque version est une véritable adaptation culturelle : noms, lieux et détails changent.' },
    ],
    en: [
      { q: 'Is Interactive Story suitable for children?', a: 'Yes: both tales are gentle, with no violence or scary moments, kind-hearted characters and very short chapters.' },
      { q: 'How long is one read-through?', a: 'A full path takes three to five minutes. Allow about twenty minutes to explore all six endings across both tales.' },
      { q: 'Do my choices really matter?', a: 'Yes: each story is a true branching graph, and each ending is reachable only through certain paths. Two playthroughs genuinely differ.' },
      { q: 'Can I resume a story in progress?', a: 'Yes: your chapter and decisions are saved automatically on your device. A “Resume” badge appears on the relevant cover.' },
      { q: 'Are the stories the same in French and English?', a: 'They share the same structure and branching, but each version is a genuine cultural adaptation: names, places and details change.' },
    ],
  },
  records: {
    'endings-found': { fr: 'Fins découvertes (cumul des 2 histoires)', en: 'Endings found (both tales combined)' },
  },
}

/* ================= Textes locaux ================= */
const DICT = {
  fr: {
    pickerTitle: 'Bibliothèque d\u2019histoires',
    pickerSub: 'Deux récits à embranchements, six fins à découvrir. Vos décisions écrivent l\u2019histoire.',
    endingsFound: 'fins découvertes',
    endingsTotal: 'Fins découvertes',
    resumeBadge: 'Reprendre',
    chapter: 'Chapitre',
    back: 'Retour',
    backToLibrary: 'Retour aux histoires',
    whatDoYouDo: 'Que faites-vous ?',
    yourDecisions: 'Vos décisions',
    noDecisions: 'Aucune décision pour l\u2019instant — l\u2019histoire vient de commencer.',
    endingReached: 'Fin atteinte',
    newEnding: 'Nouvelle fin découverte !',
    knownEnding: 'Fin déjà explorée — tentez un autre chemin.',
    endingsMapTitle: 'Fins de cette histoire',
    mysteryEnding: 'Fin mystère',
    exploreAnother: 'Explorer une autre fin',
    resumeTitle: 'Reprendre la lecture ?',
    resumeCta: 'Reprendre le chapitre',
    restartCta: 'Recommencer',
    resumeAt: (n: number, title: string) => `Vous étiez au chapitre ${n} de « ${title} ».`,
    chapterOf: (n: number) => `Chapitre ${n}`,
  },
  en: {
    pickerTitle: 'Story Library',
    pickerSub: 'Two branching tales, six endings to discover. Your choices write the story.',
    endingsFound: 'endings found',
    endingsTotal: 'Endings found',
    resumeBadge: 'Resume',
    chapter: 'Chapter',
    back: 'Back',
    backToLibrary: 'Back to stories',
    whatDoYouDo: 'What do you do?',
    yourDecisions: 'Your decisions',
    noDecisions: 'No decisions yet — the story has only just begun.',
    endingReached: 'Ending reached',
    newEnding: 'New ending discovered!',
    knownEnding: 'Ending already explored — try another path.',
    endingsMapTitle: 'Endings of this story',
    mysteryEnding: 'Mystery ending',
    exploreAnother: 'Explore another ending',
    resumeTitle: 'Resume reading?',
    resumeCta: 'Resume chapter',
    restartCta: 'Start over',
    resumeAt: (n: number, title: string) => `You were on chapter ${n} of \u201C${title}\u201D.`,
    chapterOf: (n: number) => `Chapter ${n}`,
  },
} as const

const TEASERS: Record<string, { fr: string; en: string }> = {
  garden: {
    fr: 'Mamie Jeanne, un jardin assoiffé et un secret au fond du grenier.',
    en: 'Grandma June, a thirsty garden, and a secret hiding in the attic.',
  },
  letter: {
    fr: 'Une enveloppe de 1962, une voisine discrète, une énigme de quartier.',
    en: 'A 1962 envelope, a quiet neighbor, and a small street mystery.',
  },
}

/** Nœud de départ de chaque histoire (structure FR/EN identique). */
const STORY_START: Record<string, string> = { garden: 'g-start', letter: 'l-start' }

/* ================= Sauvegarde ================= */
interface ChoiceRef {
  node: string
  idx: number
}

interface StorySave {
  /** Ids des nœuds de fin découverts (les noms se résolvent selon la langue). */
  discovered: string[]
  /** Nœud courant ; null = aucune lecture en cours. */
  node: string | null
  /** Décisions prises depuis le début de la lecture. */
  history: ChoiceRef[]
}

type SaveMap = Record<string, StorySave>

function sanitizeSaveMap(raw: unknown, endingsByStory: Record<string, string[]>): SaveMap {
  const out: SaveMap = {}
  if (!raw || typeof raw !== 'object') return out
  const rec = raw as Record<string, unknown>
  for (const st of STORIES) {
    const v = rec[st.id]
    if (!v || typeof v !== 'object') continue
    const s = v as Partial<StorySave>
    const validEndings = new Set(endingsByStory[st.id] ?? [])
    const discovered = Array.isArray(s.discovered)
      ? s.discovered.filter((d): d is string => typeof d === 'string' && validEndings.has(d))
      : []
    const node =
      typeof s.node === 'string' && st.nodes.fr[s.node] && !st.nodes.fr[s.node]?.ending ? s.node : null
    const history = Array.isArray(s.history)
      ? s.history.filter((h): h is ChoiceRef => {
          if (!h || typeof h !== 'object') return false
          const r = h as Partial<ChoiceRef>
          return typeof r.node === 'string' && typeof r.idx === 'number' && st.nodes.fr[r.node] != null
        })
      : []
    out[st.id] = { discovered, node, history }
  }
  return out
}

/* ================= Composant principal ================= */
export default function InteractiveStoryGame() {
  const lang = useLang()
  const reduce = useReducedMotion()
  const L = DICT[lang]

  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)

  const [saveMap, setSaveMap] = useState<SaveMap | null>(null)
  const [screen, setScreen] = useState<'picker' | 'read'>('picker')
  const [storyId, setStoryId] = useState<string | null>(null)
  const [nodeId, setNodeId] = useState('')
  const [history, setHistory] = useState<ChoiceRef[]>([])
  const [runKey, setRunKey] = useState(0)
  const [confetti, setConfetti] = useState(0)
  const [pendingResume, setPendingResume] = useState<string | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)

  const saveRef = useRef<SaveMap>({})

  /* --- Fins de chaque histoire (graphe identique FR/EN → version fr) --- */
  const endingIds = useMemo(() => {
    const map: Record<string, string[]> = {}
    for (const st of STORIES) {
      map[st.id] = Object.entries(st.nodes.fr)
        .filter(([, n]) => n.ending)
        .map(([id]) => id)
    }
    return map
  }, [])

  /* --- Restauration asynchrone post-mount (conforme React 19 : jamais de
   *     setState synchrone dans le corps d'un useEffect) --- */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      if (!alive) return
      const clean = sanitizeSaveMap(loadSave<SaveMap>(gameId), endingIds)
      saveRef.current = clean
      setSaveMap(clean)
    })
    return () => {
      alive = false
    }
  }, [endingIds])

  const commit = useCallback((map: SaveMap) => {
    saveRef.current = map
    setSaveMap(map)
    saveSave(gameId, map)
  }, [])

  const story: Story | undefined = useMemo(
    () => STORIES.find((s) => s.id === storyId),
    [storyId],
  )
  const node = story && nodeId ? story.nodes[lang][nodeId] : undefined
  const chapter = history.length + 1

  const getStory = (id: string): Story | undefined => STORIES.find((s) => s.id === id)

  /* Lecture en cours pour une histoire ? (basé sur l'état, jamais sur un ref
   * pendant le rendu — le saveRef n'est lu que dans les handlers) */
  const isSavedInProgress = (id: string): boolean => {
    const st = getStory(id)
    const sv = saveMap?.[id]
    if (!st || !sv?.node) return false
    const n = st.nodes[lang][sv.node]
    return n != null && !n.ending
  }

  /* --- Lancer une nouvelle lecture --- */
  const startStory = useCallback(
    (id: string) => {
      const st = getStory(id)
      if (!st) return
      const start = STORY_START[id]
      if (!start || !st.nodes[lang][start]) return
      sfx.play('reveal')
      setStoryId(id)
      setNodeId(start)
      setHistory([])
      setRunKey((k) => k + 1)
      setScreen('read')
      setHistoryOpen(false)
      addPlay(gameId)
      const map: SaveMap = { ...saveRef.current }
      const prev = map[id]
      map[id] = { discovered: prev?.discovered ?? [], node: start, history: [] }
      commit(map)
    },
    [lang, addPlay, commit],
  )

  /* --- Reprendre une lecture sauvegardée --- */
  const resumeStory = useCallback(
    (id: string) => {
      const st = getStory(id)
      const sv = saveMap?.[id]
      if (!st || !sv?.node || !st.nodes[lang][sv.node]) {
        startStory(id)
        return
      }
      sfx.play('reveal')
      setStoryId(id)
      setNodeId(sv.node)
      setHistory(sv.history)
      setRunKey((k) => k + 1)
      setScreen('read')
      setHistoryOpen(false)
      addPlay(gameId)
    },
    [lang, saveMap, addPlay, startStory],
  )

  /* --- Choisir une décision (toutes les transitions et récompenses
   *     se font dans le handler, jamais dans un effet) --- */
  const choose = useCallback(
    (idx: number) => {
      if (!story || !node || node.ending) return
      const choice = node.choices[idx]
      if (!choice) return
      const nextNode = story.nodes[lang][choice.next]
      if (!nextNode) return
      sfx.play('click')

      const newHistory = [...history, { node: nodeId, idx }]
      setHistory(newHistory)
      setNodeId(choice.next)

      const map: SaveMap = { ...saveRef.current }
      const sv: StorySave = { ...(map[story.id] ?? { discovered: [], node: null, history: [] }) }

      if (nextNode.ending) {
        /* ----- Fin atteinte ----- */
        const isNew = !sv.discovered.includes(choice.next)
        if (isNew) sv.discovered = [...sv.discovered, choice.next]
        sv.node = null
        sv.history = []
        map[story.id] = sv
        commit(map)

        setConfetti((k) => k + 1)
        sfx.play('win')
        if (isNew) {
          addWin(gameId)
          // 20 XP (nouvelle fin) + 5 XP (lecture terminée) — un rejoue de la
          // même fin ne rapporte rien.
          addXp(25)
          const total = STORIES.reduce((n, s) => n + (map[s.id]?.discovered.length ?? 0), 0)
          setBest(gameId, 'endings-found', total, false)
          unlockBadge('story-first')
          if (sv.discovered.length >= endingIds[story.id].length) unlockBadge('story-explorer')
        }
      } else {
        /* ----- Chapitre suivant ----- */
        sfx.play('reveal', { volume: 0.8 })
        sv.node = choice.next
        sv.history = newHistory
        map[story.id] = sv
        commit(map)
      }
    },
    [story, node, lang, nodeId, history, endingIds, addWin, addXp, setBest, unlockBadge, commit],
  )

  const backToPicker = () => {
    sfx.play('click')
    setScreen('picker')
    setStoryId(null)
    setNodeId('')
    setHistory([])
    setHistoryOpen(false)
  }

  const onCardClick = (id: string) => {
    if (isSavedInProgress(id)) {
      sfx.play('click')
      setPendingResume(id)
    } else {
      startStory(id)
    }
  }

  /* --- Libellé d'une décision passée, résolu dans la langue courante --- */
  const choiceLabel = (ref: ChoiceRef): string => {
    if (!story) return ''
    return story.nodes[lang][ref.node]?.choices[ref.idx]?.label ?? ''
  }

  const totalEndings = STORIES.reduce((n, s) => n + endingIds[s.id].length, 0)
  const totalFound = saveMap
    ? STORIES.reduce((n, s) => n + (saveMap[s.id]?.discovered.length ?? 0), 0)
    : 0
  const currentEnding = node?.ending
  const isNewEnding = !!(story && currentEnding && saveMap && !(saveMap[story.id]?.discovered.includes(nodeId)))
  const storyFound = story ? saveMap?.[story.id]?.discovered.length ?? 0 : 0
  const storyTotal = story ? endingIds[story.id].length : 0

  /* ================= Rendu ================= */
  return (
    <div className="relative select-none">
      <Confetti fire={confetti} count={reduce ? 0 : 120} />

      {screen === 'picker' || !story || !node ? (
        /* ---------- Bibliothèque ---------- */
        <div className="anim-rise">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                <Library className="h-6 w-6 text-orange-500" aria-hidden="true" />
                {L.pickerTitle}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">{L.pickerSub}</p>
            </div>
            <span className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {totalFound}/{totalEndings}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {STORIES.map((st) => {
              const found = saveMap?.[st.id]?.discovered.length ?? 0
              const total = endingIds[st.id].length
              const resume = isSavedInProgress(st.id)
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onCardClick(st.id)}
                  className="group relative flex min-h-44 w-full flex-col gap-3 rounded-3xl border-2 border-amber-300/50 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-ring sm:p-6 dark:border-amber-500/20 dark:from-amber-500/10 dark:via-orange-500/5 dark:to-rose-500/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70 text-4xl shadow-inner transition-transform group-hover:scale-105 sm:h-20 sm:w-20 sm:text-5xl dark:bg-white/10"
                      aria-hidden="true"
                    >
                      {st.cover}
                    </span>
                    {resume ? (
                      <span className="flex h-9 items-center gap-1.5 rounded-full bg-amber-500 px-3 text-xs font-bold text-white shadow-sm">
                        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                        {L.resumeBadge}
                      </span>
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold leading-tight sm:text-xl">{st.title[lang]}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{TEASERS[st.id][lang]}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="flex h-9 items-center gap-1.5 rounded-full bg-white/60 px-3 text-xs font-bold text-foreground/80 dark:bg-white/10">
                      <span aria-hidden="true">✨</span>
                      {found}/{total} {L.endingsFound}
                    </span>
                    <span className="flex gap-1.5" aria-hidden="true">
                      {endingIds[st.id].map((eid) => (
                        <span
                          key={eid}
                          className={cn(
                            'h-2.5 w-2.5 rounded-full border',
                            saveMap?.[st.id]?.discovered.includes(eid)
                              ? 'border-amber-500 bg-amber-400'
                              : 'border-foreground/25 bg-transparent',
                          )}
                        />
                      ))}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        /* ---------- Lecteur ---------- */
        <div className="mx-auto max-w-2xl">
          {/* Barre supérieure */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={backToPicker}
              className="flex h-11 items-center gap-1.5 rounded-full border bg-card px-3.5 text-sm font-semibold transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{L.backToLibrary}</span>
              <span className="sm:hidden">{L.back}</span>
            </button>
            <span className="flex h-11 items-center gap-1.5 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
              <BookOpen className="h-4 w-4 text-orange-500" aria-hidden="true" />
              {L.chapterOf(chapter)}
            </span>
            <span className="ms-auto flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {storyFound}/{storyTotal}
            </span>
          </div>

          {/* Chapitre */}
          <article
            key={`${runKey}-${nodeId}`}
            className="rounded-3xl border bg-card/80 p-5 shadow-sm sm:p-7"
          >
            <header className="mb-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-500">
                {story.cover} {story.title[lang]}
              </p>
              <h3 className="font-display text-2xl font-bold leading-tight sm:text-3xl">{node.title}</h3>
            </header>

            <div className="space-y-3.5">
              {node.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="anim-rise text-base leading-relaxed text-foreground/90 sm:text-lg"
                  style={{ animationDelay: `${i * 140}ms` }}
                >
                  {p}
                </p>
              ))}
            </div>

            {currentEnding ? (
              /* ---------- Écran de fin ---------- */
              <div
                className="anim-rise mt-6 rounded-2xl border-2 border-amber-300/60 bg-gradient-to-br from-amber-50 to-rose-50 p-5 text-center sm:p-7 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-rose-500/10"
                style={{ animationDelay: `${250 + node.paragraphs.length * 140}ms`}}
                role="status"
              >
                <div className="anim-pop-in text-6xl" aria-hidden="true">
                  {currentEnding.emoji}
                </div>
                <p className="mt-2 font-display text-2xl font-extrabold text-amber-700 dark:text-amber-300">
                  {currentEnding.name}
                </p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {L.endingReached} · {storyFound}/{storyTotal}
                </p>
                <p className="mt-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {isNewEnding ? `✨ ${L.newEnding}` : L.knownEnding}
                </p>

                <div className="mx-auto mt-4 max-w-sm space-y-1.5 rounded-xl border bg-card/70 p-3.5 text-left">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {L.endingsMapTitle}
                  </p>
                  {endingIds[story.id].map((eid) => {
                    const endNode = story.nodes[lang][eid]
                    const found = saveMap?.[story.id]?.discovered.includes(eid)
                    return (
                      <p key={eid} className="flex items-center gap-2 text-sm font-semibold">
                        <span aria-hidden="true">{found ? '✨' : '❓'}</span>
                        {found && endNode?.ending ? endNode.ending.name : L.mysteryEnding}
                      </p>
                    )
                  })}
                </div>

                <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                  <Button
                    size="lg"
                    className="h-12 rounded-full px-5"
                    onClick={() => startStory(story.id)}
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    {L.exploreAnother}
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 rounded-full px-5"
                    onClick={backToPicker}
                  >
                    <Library className="h-4 w-4" aria-hidden="true" />
                    {L.backToLibrary}
                  </Button>
                </div>
              </div>
            ) : (
              /* ---------- Décisions ---------- */
              <div className="mt-6">
                <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {L.whatDoYouDo}
                </p>
                <div className="space-y-2.5">
                  {node.choices.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => choose(idx)}
                      className="anim-rise block w-full rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-[2px] text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-0"
                      style={{ animationDelay: `${250 + node.paragraphs.length * 140 + idx * 90}ms` }}
                    >
                      <span className="flex min-h-12 items-center gap-2.5 rounded-[14px] bg-card px-4 py-3 text-sm font-semibold sm:text-base">
                        <ChevronRight className="h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                        <span className="flex-1">{c.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Historique des décisions */}
          <Collapsible
            open={historyOpen}
            onOpenChange={(o) => {
              sfx.play('click', { volume: 0.5 })
              setHistoryOpen(o)
            }}
            className="mt-4"
          >
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex h-11 w-full items-center gap-2 rounded-full border bg-card px-4 text-sm font-semibold transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-ring"
              >
                <History className="h-4 w-4 text-orange-500" aria-hidden="true" />
                {L.yourDecisions}
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold tabular-nums">
                  {history.length}
                </span>
                <ChevronRight
                  className={cn('ms-auto h-4 w-4 transition-transform', historyOpen && 'rotate-90')}
                  aria-hidden="true"
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 rounded-2xl border bg-card/70 p-4">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">{L.noDecisions}</p>
              ) : (
                <ol className="space-y-2">
                  {history.map((ref, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                        {i + 1}
                      </span>
                      <span className="text-foreground/85">{choiceLabel(ref)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      {/* ---------- Invite de reprise ---------- */}
      <Dialog open={pendingResume !== null} onOpenChange={(o) => !o && setPendingResume(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{L.resumeTitle}</DialogTitle>
            <DialogDescription>
              {pendingResume !== null
                ? L.resumeAt(
                    (saveMap?.[pendingResume]?.history.length ?? 0) + 1,
                    getStory(pendingResume)?.title[lang] ?? '',
                  )
                : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-1 flex flex-col gap-2.5">
            <Button
              size="lg"
              className="h-12 rounded-full"
              onClick={() => {
                const id = pendingResume
                setPendingResume(null)
                if (id) resumeStory(id)
              }}
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              {L.resumeCta}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 rounded-full"
              onClick={() => {
                const id = pendingResume
                setPendingResume(null)
                if (id) startStory(id)
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {L.restartCta}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
