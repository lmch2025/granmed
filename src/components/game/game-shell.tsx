'use client'

import { useState } from 'react'
import { Volume2, VolumeX, BookOpen, Trophy, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useAppStore, buildHash } from '@/lib/app-store'
import { useProfileStore } from '@/lib/progress/store'
import { getGame } from '@/lib/games/catalog'
import { useGameContent } from '@/lib/games/registry'
import { useHydrated, shareText } from '@/lib/utils-game'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FavoriteHeart } from '@/components/shared/ui-bits'
import { toast } from 'sonner'

/**
 * Chrome commun de tous les jeux :
 * barre d'outils (règles, son, favoris, partage, records) + zone de plateau.
 * Le contenu du jeu est rendu en enfant ; chaque jeu garde son moteur propre.
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
  const [rulesOpen, setRulesOpen] = useState(false)
  const [recOpen, setRecOpen] = useState(false)
  const content = useGameContent(gameId)
  const game = getGame(gameId)
  const soundOn = useProfileStore((s) => s.profile.settings.sound)
  const recordsRef = useProfileStore((s) => s.profile.games[gameId]?.records)
  const records = recordsRef ?? {}
  const updateSettings = useProfileStore((s) => s.updateSettings)

  const recordEntries = Object.entries(records)

  async function onShare() {
    sfx.play('click')
    const url = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}${buildHash(lang, { type: 'game', slug: gameId })}` : ''
    const title = game?.title[lang] ?? 'Granmed'
    const text = content ? `${title} — ${content.tagline[lang]}\n${url}` : `${title}\n${url}`
    const ok = await shareText(title, text)
    if (ok) toast.success(t('common.copied'))
  }

  return (
    <div className={cn('relative overflow-hidden rounded-3xl border bg-card/80 p-2.5 shadow-sm backdrop-blur sm:p-4', className)}>
      <div className="mb-2 flex flex-wrap items-center gap-1 sm:mb-3 sm:gap-1.5">
        <Dialog open={rulesOpen} onOpenChange={setRulesOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="h-9 gap-1.5 rounded-full px-3" onClick={() => sfx.play('click')}>
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>{t('common.rulesShort')}</span>
            </Button>
          </DialogTrigger>
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
        </Dialog>

        {toolbarExtra}

        <div className="ms-auto flex items-center gap-1.5">
          <Popover open={recOpen} onOpenChange={setRecOpen}>
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
            aria-label={soundOn ? t('misc.soundOff') : t('misc.soundOn')}
            onClick={() => {
              updateSettings({ sound: !soundOn })
              if (!soundOn) sfx.play('pop')
            }}
          >
            {hydrated && soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
          </Button>

          <FavoriteHeart gameId={gameId} className="h-9 w-9" />

          <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0" aria-label={t('common.share')} onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div id="game-board" className={cn('relative scroll-mt-20 touch-manipulation', boardClassName)}>
        {children}
      </div>
    </div>
  )
}

function formatRecordValue(v: number): string {
  if (v >= 10000) return v.toLocaleString('fr-FR')
  return String(v)
}
