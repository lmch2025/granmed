'use client'

import { useT, useLang } from '@/lib/i18n'
import { useGameStats } from '@/lib/progress/store'
import { IQ_RECORD_METRIC, iqLevel } from '@/lib/games/iq'
import { cn } from '@/lib/utils'

/* ============================================================
 * BANNIÈRE « DÉFI QI » — l'écran de démarrage de CHAQUE jeu
 * (Task 19) : le défi bienveillant sur l'intelligence, MENTIONNÉ
 * ET MIS EN AVANT dès l'ouverture du jeu, avant le premier coup.
 *
 *   • badge dégradé « 🧠 Défi QI » + une ligne d'invitation
 *     courte et bienveillante ;
 *   • PERSONNALISÉE : dès qu'existe un record QI sur CE jeu,
 *     la ligne devient « Record : 118 — le relèverez-vous ? »
 *     (la boucle de rejouabilité démarre AVANT même de jouer) ;
 *   • COMPACTE (une seule ligne) pour ne jamais pousser le
 *     bouton « Jouer » hors de l'écran — l'écran de démarrage
 *     reste entièrement visible sans scroll (exigence Task 19).
 *
 * Bilingue par construction : tous les textes passent par i18n.
 * ============================================================ */

export function IqChallengeBanner({ gameId, className }: { gameId: string; className?: string }) {
  const t = useT()
  const lang = useLang()
  const stats = useGameStats(gameId)
  const best = stats.records[IQ_RECORD_METRIC]?.value

  return (
    <div
      className={cn(
        'flex w-full items-center gap-2.5 rounded-2xl border-2 border-amber-300/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 p-2 shadow-sm',
        'dark:border-amber-400/30 dark:from-amber-500/10 dark:via-orange-500/10 dark:to-rose-500/10',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="anim-glow flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 text-lg shadow-md"
      >
        🧠
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          {t('iq.challenge')}
        </p>
        {best != null ? (
          <p className="truncate text-xs font-bold text-foreground/90">
            👑 {t('iq.challengeBest', { n: `${best} · ${iqLevel(best).name[lang]}` })}
          </p>
        ) : (
          <p className="truncate text-xs font-semibold text-foreground/80">{t('iq.challengeSub')}</p>
        )}
      </div>
    </div>
  )
}
