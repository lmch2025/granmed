'use client'

import { Heart, ShieldCheck, Sparkles } from 'lucide-react'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useAppStore } from '@/lib/app-store'
import { CATEGORIES, popularGames } from '@/lib/games/catalog'
import { LogoMark } from '@/components/layout/site-header'

export function SiteFooter() {
  const t = useT()
  const lang = useLang()
  const navigate = useAppStore((s) => s.navigate)

  const go = (fn: () => void) => {
    sfx.play('click', { volume: 0.5 })
    fn()
  }

  const colClass = 'min-w-0'
  const linkClass =
    'block w-full truncate rounded px-1 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline'

  return (
    <footer className="mt-auto border-t bg-card/60">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
        <div className={colClass}>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-lg font-extrabold tracking-tight">
              Gran<span className="text-primary">med</span>
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('footer.free')}</p>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
            {t('footer.healthNote')}
          </p>
        </div>

        <nav className={colClass} aria-label={t('footer.gamesCol')}>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide">{t('footer.gamesCol')}</h2>
          {popularGames(5).map((g) => (
            <button key={g.slug} type="button" className={linkClass} onClick={() => go(() => navigate({ type: 'game', slug: g.slug }))}>
              {g.icon} {g.title[lang]}
            </button>
          ))}
        </nav>

        <nav className={colClass} aria-label={t('footer.catsCol')}>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide">{t('footer.catsCol')}</h2>
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className={linkClass} onClick={() => go(() => navigate({ type: 'category', id: c.id }))}>
              {c.icon} {c.name[lang]}
            </button>
          ))}
        </nav>

        <nav className={colClass} aria-label={t('footer.resCol')}>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide">{t('footer.resCol')}</h2>
          <button type="button" className={linkClass} onClick={() => go(() => navigate({ type: 'guides' }))}>
            📚 {t('footer.guides')}
          </button>
          <button type="button" className={linkClass} onClick={() => go(() => navigate({ type: 'home' }))}>
            ❓ {t('footer.faq')}
          </button>
          <button type="button" className={linkClass} onClick={() => go(() => navigate({ type: 'about' }))}>
            💛 {t('footer.about')}
          </button>
          <button type="button" className={linkClass} onClick={() => go(() => navigate({ type: 'dashboard' }))}>
            <Heart className="mb-0.5 me-1 inline h-3.5 w-3.5" aria-hidden="true" />
            {t('nav.dashboard')}
          </button>
        </nav>

        <nav className={colClass} aria-label={t('footer.legalCol')}>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide">{t('footer.legalCol')}</h2>
          <button type="button" className={linkClass} onClick={() => go(() => navigate({ type: 'legal', doc: 'privacy' }))}>
            {t('footer.privacy')}
          </button>
          <button type="button" className={linkClass} onClick={() => go(() => navigate({ type: 'legal', doc: 'terms' }))}>
            {t('footer.terms')}
          </button>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            FR / EN — {t('common.noSignup')}
          </p>
        </nav>
      </div>

      <div className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6">
          <p>© {new Date().getFullYear()} Granmed. {t('footer.rights')}</p>
          <p>granmed.store</p>
        </div>
      </div>
    </footer>
  )
}
