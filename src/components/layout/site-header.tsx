'use client'

import { useState } from 'react'
import { Volume2, VolumeX, Sun, Moon, Menu, Heart, Home, BookOpen, Compass, Info } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useAppStore } from '@/lib/app-store'
import { useProfileStore } from '@/lib/progress/store'
import { useHydrated } from '@/lib/utils-game'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-400 shadow-sm', className)}>
      <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" fill="none" aria-hidden="true" style={{ width: 22, height: 22 }}>
        <path d="M12 21c-4.5-2.2-7.5-5.6-7.5-9.6C4.5 7.5 7.5 5 10.2 5c1 0 1.8.4 1.8.4S12.8 5 13.8 5C16.5 5 19.5 7.5 19.5 11.4c0 4-3 7.4-7.5 9.6Z" fill="#fff7ed" opacity="0.95" />
        <path d="M12 17.5v-5m0 0c0-1.8 1.6-3 3.4-3 0 1.9-1.5 3-3.4 3Zm0 1.2c0-1.6-1.4-2.8-3-2.8 0 1.7 1.3 2.8 3 2.8Z" stroke="#c2410c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function SiteHeader() {
  const t = useT()
  const lang = useLang()
  const hydrated = useHydrated()
  const navigate = useAppStore((s) => s.navigate)
  const setLang = useAppStore((s) => s.setLang)
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const soundOn = useProfileStore((s) => s.profile.settings.sound)
  const favCount = useProfileStore((s) => s.profile.favorites.length)
  const updateSettings = useProfileStore((s) => s.updateSettings)

  const go = (fn: () => void) => {
    sfx.play('click')
    setMenuOpen(false)
    fn()
  }

  const navItems = (
    <>
      <button type="button" onClick={() => go(() => navigate({ type: 'home' }))} className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
        {t('nav.home')}
      </button>
      <button type="button" onClick={() => go(() => navigate({ type: 'guides' }))} className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
        {t('nav.guides')}
      </button>
      <button type="button" onClick={() => go(() => navigate({ type: 'dashboard' }))} className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
        {t('nav.dashboard')}
      </button>
      <button type="button" onClick={() => go(() => navigate({ type: 'about' }))} className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
        {t('nav.about')}
      </button>
    </>
  )

  return (
    <header id="site-header" className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground">
        {t('misc.skipToContent')}
      </a>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-4 sm:px-6">
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-full py-1 pe-2 focus-visible:outline-2 focus-visible:outline-ring"
          aria-label="Granmed — Accueil"
          onClick={() => go(() => navigate({ type: 'home' }))}
        >
          <LogoMark />
          <span className="font-display text-lg font-extrabold tracking-tight sm:text-xl">
            Gran<span className="text-primary">med</span>
          </span>
        </button>

        <nav aria-label="Navigation principale" className="ms-4 hidden items-center gap-1 md:flex">
          {navItems}
        </nav>

        <div className="ms-auto flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            aria-label={t('nav.favorites')}
            title={t('nav.favorites')}
            onClick={() => go(() => navigate({ type: 'dashboard', tab: 'favorites' }))}
            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
          >
            <Heart className="h-5 w-5" />
            {hydrated && favCount > 0 ? (
              <span className="absolute -end-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground" style={{ height: 18, minWidth: 18 }}>
                {favCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            aria-label={soundOn ? t('misc.soundOff') : t('misc.soundOn')}
            title={soundOn ? t('misc.soundOff') : t('misc.soundOn')}
            onClick={() => {
              updateSettings({ sound: !soundOn })
              if (!soundOn) sfx.play('pop')
            }}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {hydrated && soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>

          <button
            type="button"
            aria-label={t('misc.toggleTheme')}
            title={t('misc.toggleTheme')}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:inline-flex"
          >
            {hydrated && theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div role="group" aria-label={t('common.language')} className="flex shrink-0 items-center rounded-full bg-secondary/70 p-0.5 text-[11px] font-bold sm:p-1 sm:text-xs">
            {(['fr', 'en'] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => {
                  sfx.play('click')
                  setLang(l)
                }}
                className={cn(
                  'h-8 rounded-full px-2.5 uppercase transition-all sm:px-3',
                  lang === l ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {l}
              </button>
            ))}
          </div>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full md:hidden" aria-label={t('nav.menu')}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-display">
                  <LogoMark className="h-8 w-8" /> Granmed
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Navigation mobile" className="mt-2 flex flex-col gap-1 px-4">
                <MobileNavItem icon={<Home className="h-4 w-4" />} label={t('nav.home')} onClick={() => go(() => navigate({ type: 'home' }))} />
                <MobileNavItem icon={<BookOpen className="h-4 w-4" />} label={t('nav.guides')} onClick={() => go(() => navigate({ type: 'guides' }))} />
                <MobileNavItem icon={<Compass className="h-4 w-4" />} label={t('nav.dashboard')} onClick={() => go(() => navigate({ type: 'dashboard' }))} />
                <MobileNavItem icon={<Info className="h-4 w-4" />} label={t('nav.about')} onClick={() => go(() => navigate({ type: 'about' }))} />
                <MobileNavItem
                  icon={hydrated && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  label={t('misc.toggleTheme')}
                  onClick={() => {
                    sfx.play('click', { volume: 0.4 })
                    setTheme(theme === 'dark' ? 'light' : 'dark')
                  }}
                />
                <Separator className="my-2" />
                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('nav.categories')}</p>
                {/* Les catégories sont accessibles depuis l'accueil */}
                <MobileNavItem icon={<Heart className="h-4 w-4" />} label={t('nav.favorites')} onClick={() => go(() => navigate({ type: 'dashboard', tab: 'favorites' }))} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function MobileNavItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
    >
      <span className="text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      {label}
    </button>
  )
}
