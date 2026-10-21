import type { Lang } from '@/lib/i18n'

/** Contenu SEO bilingue exporté par chaque jeu (contrat des agents). */
export interface FaqItem {
  q: string
  a: string
}

export interface GameSEOContent {
  /** Accroche courte sous le titre (≈ 80–120 caractères). */
  tagline: Record<Lang, string>
  /** Paragraphes de description ; le 1er doit DÉFINIR le jeu (style AIO : « X est un … »). */
  description: Record<Lang, string[]>
  /** Étapes des règles, dans l'ordre. */
  rules: Record<Lang, string[]>
  /** Commandes mobile + ordinateur. */
  controls: Record<Lang, string[]>
  /** Fonctionnalités réelles du jeu. */
  features: Record<Lang, string[]>
  /** Astuces / stratégie. */
  tips: Record<Lang, string[]>
  /** FAQ utile (4–6 entrées). */
  faq: Record<Lang, FaqItem[]>
  /** Clé de record (metric) → libellé. */
  records: Record<string, Record<Lang, string>>
}

/** Chaque jeu lit lang/sons/progression via les stores partagés (aucune prop requise). */
export interface GameComponentProps {
  lang: Lang
}
