'use client'

import { useAppStore } from '@/lib/app-store'

export type Lang = 'fr' | 'en'
export const LANGS: Lang[] = ['fr', 'en']

/** Dictionnaire partagé (UI, gamification, dashboard, métadonnées).
 * Les textes propres à chaque jeu vivent dans le fichier du jeu (GameSEOContent + dictionnaire local). */
const DICT: Record<string, Record<Lang, string>> = {
  // --- Marque & navigation
  'brand.name': { fr: 'Granmed', en: 'Granmed' },
  'brand.tagline': { fr: 'Jouez, defyiez votre esprit, détendez-vous', en: 'Play, challenge your mind, relax' },
  'nav.home': { fr: 'Accueil', en: 'Home' },
  'nav.games': { fr: 'Jeux', en: 'Games' },
  'nav.dashboard': { fr: 'Mon parcours', en: 'My journey' },
  'nav.guides': { fr: 'Guides', en: 'Guides' },
  'nav.about': { fr: 'À propos', en: 'About' },
  'nav.favorites': { fr: 'Favoris', en: 'Favorites' },
  'nav.menu': { fr: 'Menu', en: 'Menu' },
  'nav.categories': { fr: 'Catégories', en: 'Categories' },
  'nav.popular': { fr: 'Populaires', en: 'Popular' },
  'nav.recent': { fr: 'Nouveautés', en: 'Recently added' },
  'nav.allGames': { fr: 'Tous les jeux', en: 'All games' },

  // --- Commun
  'common.play': { fr: 'Jouer', en: 'Play' },
  'common.playNow': { fr: 'Jouer maintenant', en: 'Play now' },
  'common.playAgain': { fr: 'Rejouer', en: 'Play again' },
  'common.restart': { fr: 'Recommencer', en: 'Restart' },
  'common.start': { fr: 'Commencer', en: 'Start' },
  'common.pause': { fr: 'Pause', en: 'Pause' },
  'common.resume': { fr: 'Reprendre', en: 'Resume' },
  'common.rules': { fr: 'Règles du jeu', en: 'How to play' },
  'common.rulesShort': { fr: 'Règles', en: 'Rules' },
  'common.close': { fr: 'Fermer', en: 'Close' },
  'common.back': { fr: 'Retour', en: 'Back' },
  'common.share': { fr: 'Partager', en: 'Share' },
  'common.copy': { fr: 'Copier', en: 'Copy' },
  'common.copied': { fr: 'Copié !', en: 'Copied!' },
  'common.next': { fr: 'Suivant', en: 'Next' },
  'common.confirm': { fr: 'Confirmer', en: 'Confirm' },
  'common.cancel': { fr: 'Annuler', en: 'Cancel' },
  'common.continue': { fr: 'Continuer', en: 'Continue' },
  'common.loading': { fr: 'Chargement…', en: 'Loading…' },
  'common.newRecord': { fr: 'Nouveau record !', en: 'New personal best!' },
  'common.wellDone': { fr: 'Bien joué !', en: 'Well done!' },
  'common.tryAgain': { fr: 'Essaie encore !', en: 'Try again!' },
  'common.victory': { fr: 'Victoire !', en: 'You win!' },
  'common.defeat': { fr: 'Partie terminée', en: 'Game over' },
  'common.score': { fr: 'Score', en: 'Score' },
  'common.best': { fr: 'Record', en: 'Best' },
  'common.time': { fr: 'Temps', en: 'Time' },
  'common.moves': { fr: 'Coups', en: 'Moves' },
  'common.level': { fr: 'Niveau', en: 'Level' },
  'common.hint': { fr: 'Indice', en: 'Hint' },
  'common.hints': { fr: 'Indices', en: 'Hints' },
  'common.daily': { fr: 'Défi du jour', en: 'Daily challenge' },
  'common.dailyDone': { fr: 'Défi du jour réussi !', en: 'Daily challenge complete!' },
  'common.streak': { fr: 'Série', en: 'Streak' },
  'common.days': { fr: 'jours', en: 'days' },
  'common.day': { fr: 'jour', en: 'day' },
  'common.settings': { fr: 'Paramètres', en: 'Settings' },
  'common.language': { fr: 'Langue', en: 'Language' },
  'common.sound': { fr: 'Son', en: 'Sound' },
  'common.volume': { fr: 'Volume', en: 'Volume' },
  'common.reduceMotion': { fr: 'Réduire les animations', en: 'Reduce animations' },
  'common.theme': { fr: 'Thème', en: 'Theme' },
  'common.light': { fr: 'Clair', en: 'Light' },
  'common.dark': { fr: 'Sombre', en: 'Dark' },
  'common.system': { fr: 'Système', en: 'System' },
  'common.easy': { fr: 'Facile', en: 'Easy' },
  'common.medium': { fr: 'Moyen', en: 'Medium' },
  'common.hard': { fr: 'Difficile', en: 'Hard' },
  'common.expert': { fr: 'Expert', en: 'Expert' },
  'common.classic': { fr: 'Classique', en: 'Classic' },
  'common.mode': { fr: 'Mode', en: 'Mode' },
  'common.stats': { fr: 'Statistiques', en: 'Statistics' },
  'common.progress': { fr: 'Progression', en: 'Progress' },
  'common.completed': { fr: 'Terminé', en: 'Completed' },
  'common.locked': { fr: 'Verrouillé', en: 'Locked' },
  'common.unlocked': { fr: 'Débloqué', en: 'Unlocked' },
  'common.of': { fr: 'sur', en: 'of' },
  'common.optionalTimer': { fr: 'Chronomètre', en: 'Timer' },
  'common.size': { fr: 'Taille', en: 'Size' },
  'common.difficulty': { fr: 'Difficulté', en: 'Difficulty' },
  'common.theme_name': { fr: 'Thème', en: 'Theme' },
  'common.yes': { fr: 'Oui', en: 'Yes' },
  'common.no': { fr: 'Non', en: 'No' },
  'common.true': { fr: 'Vrai', en: 'True' },
  'common.false': { fr: 'Faux', en: 'False' },
  'common.category': { fr: 'Catégorie', en: 'Category' },
  'common.games': { fr: 'jeux', en: 'games' },
  'common.free': { fr: 'Gratuit', en: 'Free' },
  'common.noDownload': { fr: 'Sans téléchargement', en: 'No download' },
  'common.noSignup': { fr: 'Sans inscription', en: 'No sign-up' },

  // --- Page jeu
  'game.favoriteAdd': { fr: 'Ajouter aux favoris', en: 'Add to favorites' },
  'game.favoriteRemove': { fr: 'Retirer des favoris', en: 'Remove from favorites' },
  'game.records': { fr: 'Vos records', en: 'Your records' },
  'game.noRecords': { fr: 'Aucun record pour le moment — lancez une partie !', en: 'No records yet — play a game!' },
  'game.similar': { fr: 'Jeux similaires', en: 'Similar games' },
  'game.about': { fr: 'À propos de ce jeu', en: 'About this game' },
  'game.howToPlay': { fr: 'Comment jouer', en: 'How to play' },
  'game.controls': { fr: 'Commandes', en: 'Controls' },
  'game.features': { fr: 'Fonctionnalités', en: 'Features' },
  'game.tips': { fr: 'Astuces et stratégie', en: 'Tips & strategy' },
  'game.faq': { fr: 'Questions fréquentes', en: 'Frequently asked questions' },
  'game.playNow': { fr: 'Lancer une partie', en: 'Start a game' },
  'game.plays': { fr: 'parties', en: 'games played' },
  'game.wins': { fr: 'victoires', en: 'wins' },
  'game.shareResult': { fr: 'Partager ce résultat', en: 'Share this result' },
  'game.dailyAvailable': { fr: 'Défi du jour disponible', en: 'Daily challenge available' },
  'game.startDaily': { fr: 'Jouer le défi du jour', en: "Play today's challenge" },
  'game.resume': { fr: 'Reprendre la partie sauvegardée', en: 'Resume saved game' },
  'game.newGame': { fr: 'Nouvelle partie', en: 'New game' },

  // --- Accueil
  'home.heroTitle': {
    fr: '20 jeux gratuits pour jouer, entraîner votre esprit et vous détendre',
    en: '20 free games to play, train your mind and relax',
  },
  'home.heroSub': {
    fr: 'Mémoire, sudoku, mots, réflexes, puzzles… Des jeux immédiatement jouables dans votre navigateur, sans inscription ni téléchargement. Défis quotidiens, succès et records personnels.',
    en: 'Memory, sudoku, words, reflexes, puzzles… Instantly playable in your browser, no sign-up, no download. Daily challenges, achievements and personal bests.',
  },
  'home.heroCta': { fr: 'Jouer maintenant', en: 'Play now' },
  'home.heroCta2': { fr: 'Voir les 20 jeux', en: 'Browse all 20 games' },
  'home.statGames': { fr: 'jeux gratuits', en: 'free games' },
  'home.statLangs': { fr: 'langues', en: 'languages' },
  'home.statNoSignup': { fr: 'sans inscription', en: 'no sign-up' },
  'home.dailyTitle': { fr: 'Votre défi du jour', en: 'Your daily challenge' },
  'home.dailySub': {
    fr: 'Un nouveau défi chaque jour dans un jeu différent. Revenez tous les jours pour garder votre série !',
    en: 'A new challenge every day in a different game. Come back daily to keep your streak alive!',
  },
  'home.popularTitle': { fr: 'Jeux populaires', en: 'Popular games' },
  'home.recentTitle': { fr: 'Récemment ajoutés', en: 'Recently added' },
  'home.recentSub': { fr: 'Les dernières nouveautés du portail', en: 'The latest additions to the portal' },
  'home.viewAll': { fr: 'Voir tout', en: 'View all' },
  'home.faqTitle': { fr: 'Questions fréquentes', en: 'Frequently asked questions' },
  'home.guidesTitle': { fr: 'Guides et stratégies', en: 'Guides & strategies' },
  'home.guidesSub': {
    fr: 'Progresser, mémoriser, se détendre : nos articles pour mieux jouer.',
    en: 'Improve, memorize, relax: our articles to play better.',
  },
  'home.journeyTitle': { fr: 'Mon parcours Granmed', en: 'My Granmed journey' },
  'home.journeySub': {
    fr: 'Vos records, succès et défis quotidiens, sauvegardés sur votre appareil.',
    en: 'Your records, achievements and daily challenges, saved on your device.',
  },
  'home.openJourney': { fr: 'Ouvrir mon parcours', en: 'Open my journey' },

  // --- Catégories
  'cat.memory': { fr: 'Mémoire et entraînement cérébral', en: 'Memory & brain training' },
  'cat.logic': { fr: 'Puzzles et logique', en: 'Puzzles & logic' },
  'cat.reflex': { fr: 'Adresse et réflexes', en: 'Skill & reflexes' },
  'cat.words': { fr: 'Mots et culture', en: 'Words & culture' },

  // --- Dashboard
  'dash.title': { fr: 'Mon parcours Granmed', en: 'My Granmed journey' },
  'dash.sub': {
    fr: 'Vos statistiques ludiques, records et succès. Des scores élevés témoignent de votre entraînement à ces jeux, sans prétendre mesurer vos capacités cognitives globales.',
    en: 'Your playful stats, records and achievements. High scores reflect your practice at these games, not your overall cognitive abilities.',
  },
  'dash.overview': { fr: 'Aperçu', en: 'Overview' },
  'dash.badgesTab': { fr: 'Succès', en: 'Achievements' },
  'dash.recordsTab': { fr: 'Records', en: 'Records' },
  'dash.favTab': { fr: 'Favoris', en: 'Favorites' },
  'dash.level': { fr: 'Niveau', en: 'Level' },
  'dash.xp': { fr: 'XP', en: 'XP' },
  'dash.xpToNext': { fr: '{n} XP avant le niveau suivant', en: '{n} XP to next level' },
  'dash.totalPlays': { fr: 'Parties jouées', en: 'Games played' },
  'dash.totalWins': { fr: 'Victoires', en: 'Wins' },
  'dash.badgesCount': { fr: 'Succès débloqués', en: 'Achievements unlocked' },
  'dash.streakDays': { fr: 'Série quotidienne', en: 'Daily streak' },
  'dash.dailiesDone': { fr: 'Défis du jour réussis', en: 'Daily challenges done' },
  'dash.lastDays': { fr: 'Vos 21 derniers jours', en: 'Your last 21 days' },
  'dash.noFavorites': { fr: 'Aucun favori pour le moment. Touchez le cœur sur un jeu pour le retrouver ici.', en: 'No favorites yet. Tap the heart on any game to find it here.' },
  'dash.noRecords': { fr: 'Aucun record pour le moment.', en: 'No records yet.' },
  'dash.reset': { fr: 'Réinitialiser mon profil', en: 'Reset my profile' },
  'dash.resetConfirm': {
    fr: 'Effacer tous vos records, succès et statistiques ? Cette action est irréversible.',
    en: 'Erase all your records, achievements and stats? This cannot be undone.',
  },
  'dash.gamesTried': { fr: 'Jeux essayés', en: 'Games tried' },
  'dash.favoriteGames': { fr: 'Vos jeux préférés', en: 'Your favorite games' },
  'dash.recentActivity': { fr: 'Activité récente', en: 'Recent activity' },
  'dash.noActivity': { fr: 'Lancez votre première partie pour commencer votre parcours !', en: 'Play your first game to start your journey!' },
  'dash.challengeOf': { fr: 'Défi du jour : {game}', en: 'Today’s challenge: {game}' },

  // --- Gamification
  'gam.xpGain': { fr: '+{n} XP', en: '+{n} XP' },
  'gam.levelUp': { fr: 'Niveau {n} atteint !', en: 'Level {n} reached!' },
  'gam.badgeUnlock': { fr: 'Succès débloqué : {name}', en: 'Achievement unlocked: {name}' },
  'gam.streakKeep': { fr: 'Série de {n} jours — revenez demain !', en: '{n}-day streak — come back tomorrow!' },

  // --- Footer
  'footer.free': { fr: 'Portail de jeux gratuit, sans inscription.', en: 'Free games portal, no sign-up required.' },
  'footer.gamesCol': { fr: 'Jeux populaires', en: 'Popular games' },
  'footer.catsCol': { fr: 'Catégories', en: 'Categories' },
  'footer.resCol': { fr: 'Ressources', en: 'Resources' },
  'footer.legalCol': { fr: 'Informations', en: 'Information' },
  'footer.privacy': { fr: 'Confidentialité', en: 'Privacy' },
  'footer.terms': { fr: 'Mentions légales', en: 'Terms' },
  'footer.about': { fr: 'À propos', en: 'About' },
  'footer.guides': { fr: 'Guides', en: 'Guides' },
  'footer.faq': { fr: 'FAQ', en: 'FAQ' },
  'footer.healthNote': {
    fr: 'Les contenus santé de Granmed sont informatifs et ne remplacent pas l’avis d’un professionnel de santé.',
    en: 'Granmed’s health content is informational and does not replace advice from a healthcare professional.',
  },
  'footer.rights': { fr: 'Tous droits réservés.', en: 'All rights reserved.' },

  // --- Divers
  'misc.backHome': { fr: "Retour à l'accueil", en: 'Back to home' },
  'misc.notFound': { fr: 'Page introuvable', en: 'Page not found' },
  'misc.notFoundSub': { fr: 'Cette page n’existe pas ou a été déplacée.', en: 'This page does not exist or has moved.' },
  'misc.soundOn': { fr: 'Activer le son', en: 'Sound on' },
  'misc.soundOff': { fr: 'Couper le son', en: 'Sound off' },
  'misc.toggleTheme': { fr: 'Changer de thème', en: 'Toggle theme' },
  'misc.skipToContent': { fr: 'Aller au contenu', en: 'Skip to content' },
}

export function translate(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const entry = DICT[key]
  let out = entry ? entry[lang] : key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v))
  }
  return out
}

export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  return translate(lang, key, vars)
}

/** Hook : fonction de traduction liée à la langue courante. */
export function useT(): (key: string, vars?: Record<string, string | number>) => string {
  const lang = useAppStore((s) => s.lang)
  return (key, vars) => translate(lang, key, vars)
}

export function useLang(): Lang {
  return useAppStore((s) => s.lang)
}
