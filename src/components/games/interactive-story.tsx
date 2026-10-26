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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'
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
      "Chaque chapitre s'écrit sous vos yeux dans un panneau de lecture confortable — un simple toucher révèle le texte en entier. Votre progression est sauvegardée automatiquement : reprenez votre chapitre en cours, relisez l'historique de vos décisions et collectionnez les six fins à découvrir (trois par histoire).",
    ],
    en: [
      'Interactive Story is a choose-your-own-adventure game in which you read a short tale chapter by chapter and decide, at every step, what the hero does next. Your choices steer the plot toward one of three endings per story.',
      'The game offers two warm tales — “Grandma\u2019s Garden” and “The Letter at the Bottom of the Drawer” — written in short chapters, with endearing characters and decisions that genuinely branch the narrative.',
      'Each chapter types itself before your eyes in a comfortable reading panel — a single tap reveals the full text. Your progress is saved automatically: resume your current chapter, review the history of your decisions, and collect all six endings to discover (three per story).',
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
      'Ordinateur : cliquez sur les décisions, ou utilisez les touches 1, 2, 3 pour choisir et Entrée pour afficher d’un coup tout le texte du chapitre.',
      'Le texte s’écrit au fil de la lecture : touchez le panneau (ou appuyez sur Entrée) pour l’afficher en entier immédiatement.',
      'Le bouton retour en haut du lecteur ramène à la bibliothèque sans perdre votre progression.',
    ],
    en: [
      'Mobile & tablet: tap a decision to continue the tale.',
      'Desktop: click decisions, or use keys 1, 2, 3 to choose and Enter to reveal the whole chapter at once.',
      'Text types itself as you read: tap the panel (or press Enter) to display it fully right away.',
      'The back button at the top of the reader returns to the library without losing your progress.',
    ],
  },
  features: {
    fr: [
      '2 histoires complètes à embranchements (19 et 16 chapitres)',
      '6 fins à découvrir — 3 par histoire',
      'Reprise automatique du chapitre en cours',
      'Historique « Vos décisions » consultable depuis la barre du lecteur',
      'Texte qui s’écrit progressivement — un simple toucher révèle tout',
      'Véritables adaptations culturelles FR/EN (mêmes embranchements, écriture localisée)',
    ],
    en: [
      '2 complete branching tales (19 and 16 chapters)',
      '6 endings to discover — 3 per story',
      'Automatic resume of your current chapter',
      '“Your decisions” history at hand from the reader bar',
      'Text that types itself — one tap reveals everything',
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
      { q: 'Le texte s’affiche lettre par lettre, puis-je le voir en entier ?', a: 'Oui : touchez le panneau de lecture (ou appuyez sur Entrée au clavier) pour afficher instantanément le chapitre complet. L’effet d’écriture est aussi désactivé automatiquement quand votre appareil demande une réduction des animations.' },
      { q: 'Puis-je reprendre une histoire en cours ?', a: 'Oui : votre chapitre et vos décisions sont sauvegardés automatiquement sur votre appareil. Un bandeau « Reprendre » s\u2019affiche sur la couverture concernée.' },
      { q: 'Les histoires sont-elles les mêmes en français et en anglais ?', a: 'Elles partagent la même structure et les mêmes embranchements, mais chaque version est une véritable adaptation culturelle : noms, lieux et détails changent.' },
    ],
    en: [
      { q: 'Is Interactive Story suitable for children?', a: 'Yes: both tales are gentle, with no violence or scary moments, kind-hearted characters and very short chapters.' },
      { q: 'How long is one read-through?', a: 'A full path takes three to five minutes. Allow about twenty minutes to explore all six endings across both tales.' },
      { q: 'Do my choices really matter?', a: 'Yes: each story is a true branching graph, and each ending is reachable only through certain paths. Two playthroughs genuinely differ.' },
      { q: 'The text appears letter by letter — can I see it all at once?', a: 'Yes: tap the reading panel (or press Enter on a keyboard) to display the whole chapter instantly. The writing effect is also turned off automatically when your device requests reduced motion.' },
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
    endingsAria: (f: number, t: number) => `${f} sur ${t} fins découvertes`,
    resumeBadge: 'Reprendre',
    backToLibrary: 'Retour aux histoires',
    chapterOf: (n: number) => `Chapitre ${n}`,
    whatDoYouDo: 'Que faites-vous ?',
    yourDecisions: 'Vos décisions',
    noDecisions: 'Aucune décision pour l\u2019instant — l\u2019histoire vient de commencer.',
    endingReached: 'Fin atteinte',
    newEnding: 'Nouvelle fin découverte !',
    knownEnding: 'Fin déjà explorée — tentez un autre chemin.',
    endingsTitle: 'Fins de cette histoire',
    mysteryEnding: 'Fin mystère',
    exploreAnother: 'Explorer une autre fin',
    tapToSkip: 'Touchez pour tout afficher',
    kbdHint: 'Au clavier : touches 1, 2, 3 pour choisir · Entrée pour tout afficher',
    xpGain: (n: number) => `+${n} XP`,
    shareResult: (name: string, found: number, total: number) =>
      `Fin « ${name} » atteinte · ${found}/${total} fins découvertes`,
    resumeTitle: 'Reprendre la lecture ?',
    resumeCta: 'Reprendre le chapitre',
    restartCta: 'Recommencer',
    resumeAt: (n: number, title: string) => `Vous étiez au chapitre ${n} de « ${title} ».`,
  },
  en: {
    pickerTitle: 'Story Library',
    pickerSub: 'Two branching tales, six endings to discover. Your choices write the story.',
    endingsFound: 'endings found',
    endingsAria: (f: number, t: number) => `${f} of ${t} endings found`,
    resumeBadge: 'Resume',
    backToLibrary: 'Back to stories',
    chapterOf: (n: number) => `Chapter ${n}`,
    whatDoYouDo: 'What do you do?',
    yourDecisions: 'Your decisions',
    noDecisions: 'No decisions yet — the story has only just begun.',
    endingReached: 'Ending reached',
    newEnding: 'New ending discovered!',
    knownEnding: 'Ending already explored — try another path.',
    endingsTitle: 'Endings of this story',
    mysteryEnding: 'Mystery ending',
    exploreAnother: 'Explore another ending',
    tapToSkip: 'Tap to reveal all',
    kbdHint: 'Keyboard: 1, 2, 3 to choose · Enter to reveal all',
    xpGain: (n: number) => `+${n} XP`,
    shareResult: (name: string, found: number, total: number) =>
      `Ending “${name}” reached · ${found}/${total} endings found`,
    resumeTitle: 'Resume reading?',
    resumeCta: 'Resume chapter',
    restartCta: 'Start over',
    resumeAt: (n: number, title: string) => `You were on chapter ${n} of \u201C${title}\u201D.`,
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

/** XP accordée pour une fin nouvellement découverte (fin + lecture terminée). */
const ENDING_XP = 25

const EMPTY_PARAS: string[] = []

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
          const n = typeof r.node === 'string' ? st.nodes.fr[r.node] : undefined
          return (
            n != null &&
            !n.ending &&
            typeof r.idx === 'number' &&
            r.idx >= 0 &&
            r.idx < n.choices.length
          )
        }).slice(-40)
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
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)

  const [saveMap, setSaveMap] = useState<SaveMap | null>(null)
  const [screen, setScreen] = useState<'picker' | 'read'>('picker')
  const [storyId, setStoryId] = useState<string | null>(null)
  const [nodeId, setNodeId] = useState('')
  const [history, setHistory] = useState<ChoiceRef[]>([])
  const [runKey, setRunKey] = useState(0)
  const [confetti, setConfetti] = useState(0)
  /* Célébration de victoire (fin inédite) — médaille + étoiles. */
  const [burst, setBurst] = useState<{ emoji: string; title?: string } | null>(null)
  const [burstKey, setBurstKey] = useState(0)
  const [pendingResume, setPendingResume] = useState<string | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  /** Nombre de caractères révélés par l'effet d'écriture. */
  const [typed, setTyped] = useState(0)
  /** Vrai lorsque l'écran de fin actuel est une fin pas encore découverte. */
  const [endingIsNew, setEndingIsNew] = useState(false)

  const saveRef = useRef<SaveMap>({})
  const nodeIdRef = useRef('')
  const typedRef = useRef(0)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const lastStartRef = useRef(0)
  const handlersRef = useRef<{ choose: (i: number) => void; skip: () => void }>({
    choose: () => {},
    skip: () => {},
  })

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

  /** Écriture : garde l'état et le ref strictement synchronisés. */
  const setTypedBoth = useCallback((v: number) => {
    typedRef.current = v
    setTyped(v)
  }, [])

  const story: Story | undefined = useMemo(
    () => STORIES.find((s) => s.id === storyId),
    [storyId],
  )
  const node = story && nodeId ? story.nodes[lang][nodeId] : undefined
  const paragraphs = node?.paragraphs ?? EMPTY_PARAS
  const chapter = history.length + 1
  const nodeKey = `${runKey}-${nodeId}`

  /* --- Bornes de frappe par paragraphe (le +1 sépare les paragraphes).
   *     Calcul purement fonctionnel (aucune réassignation). --- */
  const paraInfo = useMemo(() => {
    const lens = paragraphs.map((p) => p.length)
    const bounds = lens.map((len, i) => ({
      start: lens.slice(0, i).reduce((acc, l) => acc + l + 1, 0),
      len,
    }))
    const total = lens.reduce((acc, l) => acc + l + 1, 0) - (lens.length > 0 ? 1 : 0)
    return { bounds, total: Math.max(0, total) }
  }, [paragraphs])
  const typedTotal = paraInfo.total
  const typingDone = typed >= typedTotal

  /* --- Effet machine à écrire : intervalle court, vitesse constante
   *     (~2,5 s par chapitre), sons de frappe discrets, suivi doux du
   *     curseur si le lecteur est déjà en bas du panneau. Aucun setState
   *     synchrone dans le corps de l'effet (uniquement dans l'intervalle). --- */
  useEffect(() => {
    if (reduce || typingDone || typedTotal === 0) return
    const step = Math.max(2, Math.round(typedTotal / 140))
    const id = window.setInterval(() => {
      const v = typedRef.current
      const nv = Math.min(typedTotal, v + step)
      typedRef.current = nv
      if (Math.floor(nv / 56) > Math.floor(v / 56) && !document.hidden) {
        sfx.play('tick', { volume: 0.12 })
      }
      const el = panelRef.current
      if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 28) {
        el.scrollTop = el.scrollHeight
      }
      setTyped(nv)
    }, 18)
    return () => window.clearInterval(id)
  }, [nodeKey, reduce, typingDone, typedTotal])

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

  /* --- Lancer une nouvelle lecture (garde anti double-tap 350 ms) --- */
  const startStory = useCallback(
    (id: string) => {
      const st = getStory(id)
      if (!st) return
      const start = STORY_START[id]
      if (!start || !st.nodes[lang][start]) return
      const now = Date.now()
      if (now - lastStartRef.current < 350) return
      lastStartRef.current = now
      sfx.play('reveal')
      setStoryId(id)
      nodeIdRef.current = start
      setNodeId(start)
      setHistory([])
      setRunKey((k) => k + 1)
      setScreen('read')
      setHistoryOpen(false)
      setEndingIsNew(false)
      setTypedBoth(0)
      if (panelRef.current) panelRef.current.scrollTop = 0
      addPlay(gameId)
      const map: SaveMap = { ...saveRef.current }
      const prev = map[id]
      map[id] = { discovered: prev?.discovered ?? [], node: start, history: [] }
      commit(map)
    },
    [lang, addPlay, commit, setTypedBoth],
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
      const now = Date.now()
      if (now - lastStartRef.current < 350) return
      lastStartRef.current = now
      sfx.play('reveal')
      setStoryId(id)
      nodeIdRef.current = sv.node
      setNodeId(sv.node)
      setHistory(sv.history)
      setRunKey((k) => k + 1)
      setScreen('read')
      setHistoryOpen(false)
      setEndingIsNew(false)
      setTypedBoth(0)
      if (panelRef.current) panelRef.current.scrollTop = 0
      addPlay(gameId)
    },
    [lang, saveMap, addPlay, startStory, setTypedBoth],
  )

  /* --- Choisir une décision (toutes les transitions et récompenses
   *     se font dans le handler, jamais dans un effet). La comparaison
   *     nodeIdRef/nodeId neutralise le double-clic sur un choix. --- */
  const choose = useCallback(
    (idx: number) => {
      if (!story || !node || node.ending) return
      if (nodeIdRef.current !== nodeId) return
      const choice = node.choices[idx]
      if (!choice) return
      const nextNode = story.nodes[lang][choice.next]
      if (!nextNode) return
      sfx.play('click', { volume: 0.45 })
      navigator.vibrate?.(10)

      const newHistory = [...history, { node: nodeId, idx }]
      setHistory(newHistory)
      nodeIdRef.current = choice.next
      setNodeId(choice.next)
      setTypedBoth(0)
      if (panelRef.current) panelRef.current.scrollTop = 0

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

        setEndingIsNew(isNew)
        if (isNew) {
          /* Confettis et fanfare uniquement pour une fin pas encore vue. */
          setConfetti((k) => k + 1)
          sfx.play('win')
          navigator.vibrate?.(30)
          addWin(gameId)
          // 20 XP (nouvelle fin) + 5 XP (lecture terminée) — rejouer une fin
          // déjà connue ne rapporte rien.
          addXp(ENDING_XP)
          // XP du jeu : fin inédite 22, fin déjà connue 8.
          addGameXp(gameId, 22)
          setBurst({ emoji: nextNode.ending?.emoji ?? '📖', title: DICT[lang].newEnding })
          setBurstKey((k) => k + 1)
          const total = STORIES.reduce((n, s) => n + (map[s.id]?.discovered.length ?? 0), 0)
          setBest(gameId, 'endings-found', total, false)
          unlockBadge('story-first')
          if (sv.discovered.length >= endingIds[story.id].length) unlockBadge('story-explorer')
        } else {
          sfx.play('levelup', { volume: 0.7 })
          navigator.vibrate?.(15)
          addGameXp(gameId, 8)
        }
      } else {
        /* ----- Chapitre suivant ----- */
        sfx.play('reveal', { volume: 0.7 })
        sv.node = choice.next
        sv.history = newHistory
        map[story.id] = sv
        commit(map)
      }
    },
    [story, node, lang, nodeId, history, endingIds, addWin, addXp, addGameXp, setBest, unlockBadge, commit, setTypedBoth],
  )

  /* --- Révéler tout le chapitre (tap sur le panneau ou Entrée) --- */
  const skipTyping = useCallback(() => {
    if (typedRef.current >= typedTotal) return
    sfx.play('swish', { volume: 0.35 })
    setTypedBoth(typedTotal)
  }, [typedTotal, setTypedBoth])

  const backToPicker = useCallback(() => {
    sfx.play('click', { volume: 0.5 })
    setScreen('picker')
    setStoryId(null)
    nodeIdRef.current = ''
    setNodeId('')
    setHistory([])
    setHistoryOpen(false)
    setEndingIsNew(false)
    setTypedBoth(0)
  }, [setTypedBoth])

  const onCardClick = (id: string) => {
    if (isSavedInProgress(id)) {
      sfx.play('click', { volume: 0.5 })
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

  /* --- Clavier : 1-3 = décision, Entrée/Espace = révéler le chapitre.
   *     Abonnement unique, handlers frais via ref ; jamais actif quand un
   *     dialogue (règles, reprise) ou un popover du chrome a le focus. --- */
  useEffect(() => {
    handlersRef.current = { choose, skip: skipTyping }
  }, [choose, skipTyping])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
      if (document.querySelector('[role="dialog"], [data-radix-popper-content-wrapper]')) return
      const target = e.target as HTMLElement | null
      if (e.key >= '1' && e.key <= '3') {
        e.preventDefault()
        handlersRef.current.choose(Number(e.key) - 1)
        return
      }
      if (e.key === 'Enter' || e.key === ' ') {
        if (target && ['BUTTON', 'INPUT', 'TEXTAREA', 'A'].includes(target.tagName)) return
        e.preventDefault()
        handlersRef.current.skip()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const totalEndings = useMemo(
    () => STORIES.reduce((n, s) => n + endingIds[s.id].length, 0),
    [endingIds],
  )
  const totalFound = saveMap
    ? STORIES.reduce((n, s) => n + (saveMap[s.id]?.discovered.length ?? 0), 0)
    : 0
  const currentEnding = node?.ending
  const storyFound = story ? saveMap?.[story.id]?.discovered.length ?? 0 : 0
  const storyTotal = story ? endingIds[story.id].length : 0

  /* ================= Rendu ================= */
  return (
    <div className="relative select-none my-auto w-full">
      <Confetti fire={confetti} count={reduce ? 0 : 120} waves={2} gold />
      <VictoryBurst fire={burstKey} stars={3} emoji={burst?.emoji ?? '📖'} title={burst?.title} />

      {screen === 'picker' || !story || !node ? (
        /* ---------- Bibliothèque ---------- */
        <div className="anim-rise">
          <div className="flex items-center gap-2.5">
            <h2 className="flex min-w-0 flex-1 items-center gap-2 font-display text-lg font-bold tracking-tight sm:text-2xl">
              <Library className="h-5 w-5 shrink-0 text-orange-500" aria-hidden="true" />
              <span className="truncate">{L.pickerTitle}</span>
            </h2>
            <span
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-amber-100 px-3 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
              aria-label={L.endingsAria(totalFound, totalEndings)}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {totalFound}/{totalEndings}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{L.pickerSub}</p>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STORIES.map((st) => {
              const found = saveMap?.[st.id]?.discovered.length ?? 0
              const total = endingIds[st.id].length
              const resume = isSavedInProgress(st.id)
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onCardClick(st.id)}
                  className="group relative flex w-full items-start gap-3.5 rounded-2xl border-2 border-amber-300/50 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 p-3.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-ring sm:p-4 dark:border-amber-500/20 dark:from-amber-500/10 dark:via-orange-500/5 dark:to-rose-500/10"
                >
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-3xl shadow-inner transition-transform group-hover:scale-105 sm:h-16 sm:w-16 sm:text-4xl dark:bg-white/10"
                    aria-hidden="true"
                  >
                    {st.cover}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="flex items-start justify-between gap-2">
                      <span className="min-w-0 font-display text-base font-bold leading-tight sm:text-lg">
                        {st.title[lang]}
                      </span>
                      {resume ? (
                        <span className="flex h-7 shrink-0 items-center gap-1 rounded-full bg-amber-500 px-2.5 text-[10px] font-bold text-white shadow-sm">
                          <BookOpen className="h-3 w-3" aria-hidden="true" />
                          {L.resumeBadge}
                        </span>
                      ) : null}
                    </span>
                    <span className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                      {TEASERS[st.id][lang]}
                    </span>
                    <span className="mt-auto flex flex-wrap items-center gap-2 pt-0.5">
                      <span className="flex h-6 items-center gap-1 rounded-full bg-white/60 px-2 text-[11px] font-bold text-foreground/80 dark:bg-white/10">
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
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        /* ---------- Lecteur : colonne à hauteur bornée — le panneau de
             lecture défile DANS son cadre, les décisions restent visibles ---------- */
        <div className="mx-auto flex h-[max(240px,calc(100dvh-244px))] w-full max-w-2xl flex-col">
          {/* HUD compact sur une ligne : retour, chapitre, fins, décisions */}
          <div className="mb-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={backToPicker}
              aria-label={L.backToLibrary}
              title={L.backToLibrary}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-card transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="flex h-9 min-w-0 flex-1 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-sm font-semibold">
              <BookOpen className="h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
              <span key={chapter} className={cn('truncate', !reduce && 'anim-pop-in')}>
                {story.cover} · {L.chapterOf(chapter)}
              </span>
            </span>
            <span
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-amber-100 px-3 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
              aria-label={L.endingsAria(storyFound, storyTotal)}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {storyFound}/{storyTotal}
            </span>
            <Popover
              open={historyOpen}
              onOpenChange={(o) => {
                sfx.play('click', { volume: 0.5 })
                setHistoryOpen(o)
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={`${L.yourDecisions} (${history.length})`}
                  title={L.yourDecisions}
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-card transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <History className="h-4 w-4 text-orange-500" aria-hidden="true" />
                  {history.length > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold tabular-nums text-white">
                      {history.length}
                    </span>
                  ) : null}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                <div className="space-y-2">
                  <p className="flex items-center gap-2 font-display text-sm font-bold">
                    <History className="h-4 w-4 text-orange-500" aria-hidden="true" />
                    {L.yourDecisions}
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold tabular-nums">
                      {history.length}
                    </span>
                  </p>
                  <div className="max-h-56 overflow-y-auto nice-scroll">
                    {history.length === 0 ? (
                      <p className="pr-2 text-sm text-muted-foreground">{L.noDecisions}</p>
                    ) : (
                      <ol className="space-y-2 pr-2">
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
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Panneau de lecture (défilement interne) */}
          <div className="relative min-h-[110px] flex-1">
            <div
              ref={panelRef}
              onClick={skipTyping}
              className="nice-scroll h-full overflow-y-auto overscroll-contain rounded-2xl border bg-card/80 p-4 shadow-sm sm:p-6"
            >
              <article key={nodeKey} className={cn(!reduce && 'anim-rise')}>
                <header>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-orange-500 sm:text-xs">
                    {story.cover} {story.title[lang]}
                  </p>
                  <h3 className="font-display text-xl font-bold leading-tight sm:text-2xl">{node.title}</h3>
                </header>

                <div className="mt-3 space-y-3">
                  {paragraphs.map((p, i) => {
                    const b = paraInfo.bounds[i]
                    const visible = typingDone
                      ? p
                      : p.slice(0, Math.max(0, Math.min(typed - b.start, b.len)))
                    const showCursor = !typingDone && typed >= b.start && typed <= b.start + b.len
                    return (
                      <p key={i} className="text-[15px] leading-relaxed text-foreground/90 sm:text-base">
                        {typingDone ? (
                          p
                        ) : (
                          <>
                            <span className="sr-only">{p}</span>
                            <span aria-hidden="true">
                              {visible}
                              {showCursor ? (
                                <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse rounded-full bg-orange-400" />
                              ) : null}
                            </span>
                          </>
                        )}
                      </p>
                    )
                  })}
                </div>
              </article>
            </div>
            {!typingDone ? (
              <span className="pointer-events-none absolute bottom-2 right-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground shadow-sm backdrop-blur-sm">
                {L.tapToSkip}
              </span>
            ) : null}
          </div>

          {/* Zone d'actions — decisions toujours à l'écran */}
          {currentEnding ? (
            /* ---------- Écran de fin ---------- */
            <div
              key={nodeKey}
              role="status"
              className={cn(
                'mt-2 rounded-2xl border-2 border-amber-300/60 bg-gradient-to-br from-amber-50 to-rose-50 p-3.5 text-center sm:p-5 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-rose-500/10',
                !reduce && 'anim-rise',
              )}
            >
              <div className="flex flex-col items-center justify-center gap-1.5 sm:flex-row sm:gap-4">
                <span className={cn('text-4xl leading-none', !reduce && 'anim-pop-in')} aria-hidden="true">
                  {currentEnding.emoji}
                </span>
                <div className="min-w-0 sm:text-left">
                  <p className="font-display text-lg font-extrabold leading-tight text-amber-700 dark:text-amber-300 sm:text-xl">
                    {currentEnding.name}
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {L.endingReached} · {storyFound}/{storyTotal}
                  </p>
                </div>
              </div>

              {endingIsNew ? (
                <p className="mt-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  ✨ {L.newEnding} · {L.xpGain(ENDING_XP)}
                </p>
              ) : (
                <p className="mt-2 text-xs font-semibold text-muted-foreground">{L.knownEnding}</p>
              )}

              <div className="mt-2.5 flex flex-wrap justify-center gap-1.5" aria-label={L.endingsTitle}>
                {endingIds[story.id].map((eid) => {
                  const endNode = story.nodes[lang][eid]
                  const found = saveMap?.[story.id]?.discovered.includes(eid)
                  return (
                    <span
                      key={eid}
                      className={cn(
                        'flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-bold',
                        found
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                          : 'border border-dashed border-foreground/25 text-muted-foreground',
                      )}
                    >
                      <span aria-hidden="true">{found ? '✨' : '❓'}</span>
                      <span className="max-w-36 truncate">
                        {found && endNode?.ending ? endNode.ending.name : L.mysteryEnding}
                      </span>
                    </span>
                  )
                })}
              </div>

              <div className="mt-3 flex flex-col items-center gap-2.5">
                <RoundEndActions
                  gameId={gameId}
                  onReplay={() => startStory(story.id)}
                  replayLabel={L.exploreAnother}
                  shareResult={L.shareResult(currentEnding.name, storyFound, storyTotal)}
                />
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
            <div key={nodeKey} className="mt-2">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {L.whatDoYouDo}
              </p>
              <div className="space-y-2">
                {node.choices.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => choose(idx)}
                    className={cn(
                      'block w-full rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-[2px] text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-0',
                      !reduce && 'anim-rise',
                    )}
                    style={reduce ? undefined : { animationDelay: `${150 + idx * 70}ms` }}
                  >
                    <span className="flex min-h-12 items-center gap-2.5 rounded-[14px] bg-card px-4 py-3 text-sm font-semibold sm:text-base">
                      <span
                        className="hidden h-5 w-5 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] font-bold tabular-nums sm:flex"
                        aria-hidden="true"
                      >
                        {idx + 1}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-orange-500 sm:hidden" aria-hidden="true" />
                      <span className="flex-1">{c.label}</span>
                      <ChevronRight className="hidden h-4 w-4 shrink-0 text-orange-500 sm:block" aria-hidden="true" />
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-1.5 hidden text-center text-[10px] text-muted-foreground/70 sm:block">
                {L.kbdHint}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ---------- Invite de reprise ---------- */}
      <Dialog
        open={pendingResume !== null}
        onOpenChange={(o) => {
          if (!o) {
            sfx.play('click', { volume: 0.4 })
            setPendingResume(null)
          }
        }}
      >
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
