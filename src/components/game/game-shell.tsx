'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, BookOpen, Trophy, Share2, Maximize2, X, LayoutGrid, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useAppStore, buildHash } from '@/lib/app-store'
import { useProfileStore } from '@/lib/progress/store'
import { useGameLevel } from '@/lib/progress/levels'
import { useGameSession } from '@/lib/game-session'
import { getGame, GAMES, CATEGORIES, CATEGORY_STYLES } from '@/lib/games/catalog'
import { useGameContent } from '@/lib/games/registry'
import { useHydrated, shareText, useMediaQuery } from '@/lib/utils-game'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { FavoriteHeart } from '@/components/shared/ui-bits'
import { toast } from 'sonner'

/**
 * Chrome commun de tous les jeux :
 *  – mode NORMAL : barre d'outils (règles, records, son, favoris, partage,
 *    plein écran) + zone de plateau dans la page ;
 *  – mode IMMERSIF : le jeu PREND LA SURFACE DE JEU — overlay fixe sur
 *    tout l'écran (100dvh, safe-areas) avec barre compacte : quitter (X),
 *    titre + niveau du jeu, changeur de jeu, règles, son. Auto-activé sur
 *    mobile au chargement, bouton « Plein écran » sur desktop, Échap pour
 *    sortir. Le plateau devient flex-1 scrollable et expose --board-h /
 *    --board-maxh aux jeux (fallback de leurs calc(100dvh-*) actuels).
 * Le DOM du jeu n'est JAMAIS déplacé (toggle CSS pur) : aucun remont,
 * aucun état de partie perdu.
 */
export function GameShell({
  gameId,
  children,
  toolbarExtra,
  className,
  boardClassName,
}: {
  gameId: string
  children: React.ReactNode
  toolbarExtra?: React.ReactNode
  className?: string
  boardClassName?: string
}) {
  const t = useT()
  const lang = useLang()
  const hydrated = useHydrated()
  const isMobile = useMediaQuery('(max-width: 639px)')
  /* Immersif DÉRIVÉ : null = automatique (mobile → prise de main de la
   * surface de jeu dès l'hydratation), sinon choix explicite du joueur. */
  const [userImmersive, setUserImmersive] = useState<boolean | null>(null)
  const immersive = userImmersive ?? isMobile
  const [rulesOpen, setRulesOpen] = useState(false)
  const [switchOpen, setSwitchOpen] = useState(false)
  const content = useGameContent(gameId)
  const game = getGame(gameId)
  const navigate = useAppStore((s) => s.navigate)
  const level = useGameLevel(gameId)
  const exitRequests = useGameSession((s) => s.exitRequests)
  const soundOn = useProfileStore((s) => s.profile.settings.sound)
  const recordsRef = useProfileStore((s) => s.profile.games[gameId]?.records)
  const records = recordsRef ?? {}
  const updateSettings = useProfileStore((s) => s.updateSettings)

  const recordEntries = Object.entries(records)

  /* Changement de jeu (navigation SPA sans remont du GameShell) :
     réinitialisation du choix d'immersif — chaque jeu cliqué reprend
     la main sur la surface de jeu mobile (motif « ajustement pendant
     le rendu »), et les popups se referment. */
  const [prevGameId, setPrevGameId] = useState(gameId)
  if (gameId !== prevGameId) {
    setPrevGameId(gameId)
    setUserImmersive(null)
    setRulesOpen(false)
    setSwitchOpen(false)
  }

  /* Demande de sortie venant d'une fin de manche (bouton « Quitter » du
     jeu) : ajustement pendant le rendu (motif React recommandé) — on
     quitte l'immersif et on ferme le changeur ; le défilement vers les
     recommandations est planifié par l'effet ci-dessous. */
  const [lastExitReq, setLastExitReq] = useState(0)
  if (exitRequests !== lastExitReq) {
    setLastExitReq(exitRequests)
    setUserImmersive(false)
    setSwitchOpen(false)
  }

  /* … puis défilement doux vers les jeux similaires de la page.
     Ignoré à la première montée : le compteur global survit aux
     navigations SPA et ne doit PAS rejouer ce défilement à chaque
     réouverture de jeu — l’écran de démarrage doit rester
     directement visible à l’ouverture (exigence Task 19). Le
     timeout est aussi nettoyé (annulation si navigation rapide). */
  const exitScrollMounted = useRef(false)
  useEffect(() => {
    if (!exitScrollMounted.current) {
      exitScrollMounted.current = true
      return
    }
    if (exitRequests === 0) return
    let tid = 0
    const raf = requestAnimationFrame(() => {
      tid = window.setTimeout(() => {
        document.getElementById('similar-game')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
    })
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(tid)
    }
  }, [exitRequests])

  /* Verrouillage du défilement + isolement accessibilité de la page
     derrière l'overlay (header, footer, contenu éditornel deviennent
     inertes), et focus initial sur le bouton quitter. */
  useEffect(() => {
    if (!immersive) return
    const body = document.body
    const prevOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    const inerted: Element[] = []
    for (const el of document.querySelectorAll('#site-header, #site-footer, #game-page-nav, #game-page-header, #game-page-content')) {
      try {
        ;(el as HTMLElement).inert = true
        el.setAttribute('aria-hidden', 'true')
        inerted.push(el)
      } catch {
        /* navigateur sans inert — l'overlay couvre déjà visuellement */
      }
    }
    return () => {
      body.style.overflow = prevOverflow
      for (const el of inerted) {
        try {
          ;(el as HTMLElement).inert = false
          el.removeAttribute('aria-hidden')
        } catch {}
      }
    }
  }, [immersive])

  /* Échap quitte le mode immersif. */
  useEffect(() => {
    if (!immersive) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserImmersive(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [immersive])

  function exitImmersive() {
    sfx.play('click', { volume: 0.4 })
    setUserImmersive(false)
  }

  async function onShare() {
    sfx.play('click')
    const url = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}${buildHash(lang, { type: 'game', slug: gameId })}` : ''
    const title = game?.title[lang] ?? 'Granmed'
    const text = content ? `${title} — ${content.tagline[lang]}\n${url}` : `${title}\n${url}`
    const ok = await shareText(title, text)
    if (ok) toast.success(t('common.copied'))
  }

  /* ---------- Barre immersif : X · titre+niveau · règles · changeur · son · partage ---------- */
  const immersiveBar = (
    <div className="shrink-0 pt-[env(safe-area-inset-top)]">
      <div className="flex h-12 items-center gap-1.5 px-2 sm:h-14 sm:px-3">
        <Button
          variant="secondary"
          size="sm"
          className="h-10 w-10 shrink-0 rounded-full p-0 shadow-sm"
          aria-label={t('game.exit')}
          onClick={exitImmersive}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </Button>

        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-lg shadow-inner sm:h-10 sm:w-10"
        >
          {game?.icon ?? '🎮'}
        </span>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h2 className="min-w-0 truncate font-display text-sm font-extrabold leading-tight sm:text-base">{game?.title[lang]}</h2>
          <span
            title={`${t('game.levelProgress')} — ${level.tier.name[lang]}`}
            className="flex shrink-0 items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[11px] font-bold tabular-nums"
          >
            <span aria-hidden="true">{level.tier.emoji}</span>
            {lang === 'fr' ? `Nv ${level.level}` : `Lv ${level.level}`}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 shrink-0 rounded-full p-0"
          aria-label={t('common.rulesShort')}
          onClick={() => {
            sfx.play('click')
            setRulesOpen(true)
          }}
        >
          <BookOpen className="h-4.5 w-4.5" aria-hidden="true" />
        </Button>

        <Sheet open={switchOpen} onOpenChange={setSwitchOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 shrink-0 rounded-full p-0"
              aria-label={t('game.switchGame')}
              onClick={() => sfx.play('click')}
            >
              <LayoutGrid className="h-4.5 w-4.5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <GameSwitcherSheet
            currentGameId={gameId}
            onClose={() => setSwitchOpen(false)}
          />
        </Sheet>

        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 shrink-0 rounded-full p-0"
          aria-label={soundOn ? t('misc.soundOff') : t('misc.soundOn')}
          onClick={() => {
            updateSettings({ sound: !soundOn })
            if (!soundOn) sfx.play('pop')
          }}
        >
          {hydrated && soundOn ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5 text-muted-foreground" />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 shrink-0 rounded-full p-0 text-primary"
          aria-label={t('common.shareGame')}
          title={t('common.shareGame')}
          onClick={onShare}
        >
          <Share2 className="h-4.5 w-4.5" aria-hidden="true" />
        </Button>
      </div>
      {/* Barre de progression du niveau du jeu — discrète et vivante */}
      <div className="h-1 w-full bg-secondary/50" role="presentation">
        <div
          className="h-full rounded-e-full bg-gradient-to-r from-amber-400 to-primary transition-[width] duration-700 ease-out"
          style={{ width: `${Math.max(4, Math.round(level.pct * 100))}%` }}
        />
      </div>
    </div>
  )

  /* ---------- Barre normale : règles · extra · records · plein écran · son · favori · partage ---------- */
  const normalBar = (
    <div className="mb-2 flex flex-wrap items-center gap-1 sm:mb-3 sm:gap-1.5">
      <Dialog open={rulesOpen} onOpenChange={setRulesOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm" className="h-9 gap-1.5 rounded-full px-3" onClick={() => sfx.play('click')}>
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>{t('common.rulesShort')}</span>
          </Button>
        </DialogTrigger>
        <RulesDialogBody lang={lang} content={content} />
      </Dialog>

      {toolbarExtra}

      <div className="ms-auto flex items-center gap-1.5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 rounded-full" onClick={() => sfx.play('click')}>
              <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <span className="hidden sm:inline">{t('game.records')}</span>
              {hydrated && recordEntries.length > 0 ? (
                <span className="rounded-full bg-amber-100 px-1.5 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                  {recordEntries.length}
                </span>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <div className="space-y-1.5">
              <p className="font-display text-sm font-bold">{t('game.records')}</p>
              {recordEntries.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t('game.noRecords')}</p>
              ) : (
                <ul className="space-y-1.5">
                  {recordEntries.map(([metric, rec]) => {
                    const label = content?.records?.[metric]?.[lang] ?? metric
                    return (
                      <li key={metric} className="flex items-center justify-between gap-2 text-sm">
                        <span className="min-w-0 truncate text-muted-foreground">{label}</span>
                        <span className="font-bold tabular-nums">{formatRecordValue(rec.value)}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-full p-0"
          aria-label={t('game.fullscreen')}
          title={t('game.fullscreen')}
          onClick={() => {
            sfx.play('sweep')
            setUserImmersive(true)
          }}
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-full p-0"
          aria-label={soundOn ? t('misc.soundOff') : t('misc.soundOn')}
          onClick={() => {
            updateSettings({ sound: !soundOn })
            if (!soundOn) sfx.play('pop')
          }}
        >
          {hydrated && soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
        </Button>

        <FavoriteHeart gameId={gameId} className="h-9 w-9" />

        <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0" aria-label={t('common.shareGame')} title={t('common.shareGame')} onClick={onShare}>
          <Share2 className="h-4 w-4 text-primary" />
        </Button>
      </div>
    </div>
  )

  return (
    <div
      className={cn(
        immersive
          ? 'animate-immersive-in fixed inset-0 z-[45] flex flex-col bg-background shadow-2xl'
          : 'relative overflow-hidden rounded-3xl border bg-card/80 p-2.5 shadow-sm backdrop-blur sm:p-4',
        className,
      )}
    >
      {immersive ? immersiveBar : normalBar}

      <div
        id="game-board"
        className={cn(
          'relative touch-manipulation',
          immersive
            ? 'nice-scroll flex min-h-0 flex-1 flex-col overscroll-contain overflow-y-auto pb-[env(safe-area-inset-bottom)]'
            : 'scroll-mt-20',
          boardClassName,
        )}
        style={immersive ? ({ '--board-h': '100%', '--board-maxh': '100%' } as React.CSSProperties) : undefined}
      >
        {children}
      </div>
    </div>
  )
}

/* ================= Dialog Règles ================= */

function RulesDialogBody({
  lang,
  content,
}: {
  lang: 'fr' | 'en'
  content: ReturnType<typeof useGameContent>
}) {
  const t = useT()
  return (
    <DialogContent className="max-h-[85vh] overflow-y-auto nice-scroll">
      <DialogHeader>
        <DialogTitle className="font-display text-xl">{t('common.rules')}</DialogTitle>
      </DialogHeader>
      <div className="space-y-5 text-sm leading-relaxed">
        <div>
          <h3 className="mb-2 font-display font-bold">{t('game.howToPlay')}</h3>
          <ol className="list-decimal space-y-1.5 pl-5">
            {(content?.rules[lang] ?? []).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="mb-2 font-display font-bold">{t('game.controls')}</h3>
          <ul className="list-disc space-y-1.5 pl-5">
            {(content?.controls[lang] ?? []).map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </DialogContent>
  )
}

/* ================= Changeur de jeu (sheet) ================= */

function GameSwitcherSheet({ currentGameId, onClose }: { currentGameId: string; onClose: () => void }) {
  const t = useT()
  const lang = useLang()
  const navigate = useAppStore((s) => s.navigate)
  const isMobile = useMediaQuery('(max-width: 639px)')

  return (
    <SheetContent
      side={isMobile ? 'bottom' : 'right'}
      className={isMobile ? 'max-h-[78vh] rounded-t-3xl p-0' : 'w-[min(24rem,90vw)] p-0'}
    >
      <div className="flex h-full flex-col">
        <SheetHeader className={cn('border-b px-5', isMobile ? 'py-4' : 'py-5')}>
          <SheetTitle className="flex items-center gap-2 font-display text-lg">
            <LayoutGrid className="h-5 w-5 text-primary" aria-hidden="true" />
            {t('game.switchGame')}
          </SheetTitle>
          <p className="text-xs text-muted-foreground">{t('nav.allGames')} — 20</p>
        </SheetHeader>
        <div className="nice-scroll min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {CATEGORIES.map((cat) => (
            <section key={cat.id} className="mb-2 last:mb-0" aria-labelledby={`switch-cat-${cat.id}`}>
              <h3 className={cn('px-2 pb-1.5 pt-2 text-xs font-bold uppercase tracking-wide', CATEGORY_STYLES[cat.id].text)}>
                <span aria-hidden="true" className="me-1">{cat.icon}</span>
                {cat.name[lang]}
              </h3>
              <ul className="space-y-1">
                {GAMES.filter((g) => g.category === cat.id).map((g) => {
                  const isCurrent = g.slug === currentGameId
                  return (
                    <li key={g.slug}>
                      <button
                        type="button"
                        aria-current={isCurrent ? 'true' : undefined}
                        onClick={() => {
                          sfx.play('click')
                          onClose()
                          if (!isCurrent) navigate({ type: 'game', slug: g.slug })
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition-colors',
                          'hover:bg-accent/70 focus-visible:bg-accent/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                          isCurrent && 'bg-accent/50 ring-1 ring-primary/40',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg shadow-sm',
                            CATEGORY_STYLES[g.category].tile,
                          )}
                        >
                          {g.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{g.title[lang]}</span>
                          <span className="block truncate text-xs text-muted-foreground">{g.short[lang]}</span>
                        </span>
                        {isCurrent ? (
                          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">●</span>
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </SheetContent>
  )
}

function formatRecordValue(v: number): string {
  if (v >= 10000) return v.toLocaleString('fr-FR')
  return String(v)
}
