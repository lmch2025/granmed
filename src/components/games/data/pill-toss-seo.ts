import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu pill-toss (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const pillTossSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Tendez l’élastique, visez les fioles glissantes et lancez vos pilules fictives — chaque manche révèle votre QI estimé — dans cette pharmacie chaleureuse.',
    en: 'Stretch the sling, aim at the sliding jars and toss your fictional pills — every round reveals your estimated IQ — in this cozy pharmacy.',
  },
  description: {
    fr: [
      'Pill Toss est un jeu d’adresse et de réflexes gratuit dans lequel vous lancez des pilules fictives à l’aide d’un élastique pour toucher des fioles en mouvement sur les étagères d’une pharmacie. Tirez la pilule vers l’arrière, suivez la trajectoire prévue en pointillés, puis relâchez : la gravité fait le reste.',
      'Chaque manche offre 10 pilules. Au fil des manches, les fioles glissent plus vite, rétrécissent et se multiplient jusqu’à dix, sur trois étagères. Un touché rapporte 100 points, majorés de 50 points par touché consécutif ; un lancer raté remet la série à zéro. Nettoyer toutes les étagères avant d’épuiser vos pilules rapporte un bonus de 150 points par pilule restante. En fin de manche, un QI estimé — fonction de votre précision de lancer — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'Les pilules sont entièrement fictives : ce jeu est une pure fiction ludique, sans référence à un vrai médicament. Les records de score et de série sont sauvegardés sur votre appareil et les manches s’enchaînent sans fin, pour des sessions aussi courtes ou longues que vous le souhaitez.',
    ],
    en: [
      'Pill Toss is a free skill and reflex game in which you fling fictional pills with a slingshot to hit moving jars on pharmacy shelves. Drag the pill backwards, follow the dotted trajectory preview, then release: gravity does the rest.',
      'Each round hands you 10 pills. As rounds go by, the jars slide faster, shrink and multiply up to ten across three shelves. A hit is worth 100 points plus 50 extra for every consecutive hit; a missed throw resets the streak. Clearing every shelf before running out of pills earns a bonus of 150 points per unused pill. At the end of each round, an estimated IQ — based on your throwing accuracy — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'The pills are entirely fictional: this game is pure playful fiction with no reference to any real medication. Score and streak records are saved on your device, and rounds chain endlessly for sessions as short or long as you like.',
    ],
  },
  rules: {
    fr: [
      'Maintenez le doigt (ou la souris) près de la pilule, puis tirez vers l’arrière pour armer l’élastique.',
      'La trajectoire prévue s’affiche en pointillés : plus vous tirez loin, plus le lancer est puissant.',
      'Relâchez pour lancer la pilule ; relâcher sans avoir tiré annule le lancer.',
      'Touchez les fioles glissantes sur les étagères : chaque touché rapporte des points.',
      'Enchaînez les touchés pour faire grimper le bonus de série (+50 points par touché consécutif) ; un raté remet la série à zéro.',
      'La manche se termine après 10 pilules — ou immédiatement si vous nettoyez toutes les étagères (bonus par pilule restante).',
      'À chaque manche, les fioles sont plus rapides et plus petites, et leur nombre augmente (jusqu’à dix fioles sur trois étagères).',
    ],
    en: [
      'Press and hold near the pill (with a finger or the mouse), then drag backwards to stretch the sling.',
      'The predicted path appears as dots: the further you pull, the stronger the throw.',
      'Release to launch; releasing without pulling cancels the throw.',
      'Hit the jars sliding along the shelves: every hit scores points.',
      'Chain hits to grow the streak bonus (+50 points per consecutive hit); a miss resets the streak.',
      'The round ends after 10 pills — or immediately if you clear every shelf (bonus per unused pill).',
      'With each round, jars get faster and smaller, and more of them appear (up to ten jars across three shelves).',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : maintenez près de la pilule, tirez vers l’arrière, puis relâchez.',
      'Ordinateur : cliquez près de la pilule, tirez avec la souris, puis relâchez.',
      'La zone de prise est volontairement très large : inutile d’être précis pour saisir la pilule.',
      'Un bouton « Recommencer » dans la barre de partie permet de repartir de zéro à tout moment.',
    ],
    en: [
      'Mobile & tablet: press near the pill, drag back, then release.',
      'Desktop: click near the pill, drag with the mouse, then release.',
      'The grab zone is deliberately generous: you don’t need to be precise to pick up the pill.',
      'A “Restart” button in the in-game bar lets you start over from scratch at any time.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Physique de lance-pierre avec trajectoire prédictive en pointillés',
      'Fioles animées sur 1 à 3 étagères selon la manche',
      'Bonus de série : +50 points par touché consécutif',
      'Manches infinies à difficulté croissante',
      'Records de score et de série sauvegardés sur votre appareil',
      'Haptique légère sur les lancers et touchés, pause automatique onglet masqué',
      'Pilules 100 % fictives — aucune référence médicale',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      'Slingshot physics with a dotted trajectory preview',
      'Animated jars on 1 to 3 shelves depending on the round',
      'Streak bonus: +50 points per consecutive hit',
      'Endless rounds with rising difficulty',
      'Score and streak records saved on your device',
      'Gentle haptics on throws and hits, auto-pause when the tab is hidden',
      '100% fictional pills — no medical reference',
    ],
  },
  tips: {
    fr: [
      'Visez légèrement devant une fiole en mouvement : la pilule met un instant à arriver.',
      'Les fioles rebroussent chemin aux extrémités et se repoussent quand elles se croisent : anticipez ces rebonds pour des touchés faciles.',
      'Un lancer tendu vers l’étagère du haut protège mieux votre série qu’un lancer en cloche.',
      'Gardez une ou deux pilules de réserve : nettoyer toute l’étagère rapporte 150 points par pilule restante.',
    ],
    en: [
      'Aim slightly ahead of a moving jar: the pill takes a moment to arrive.',
      'Jars turn around at the edges and bump each other when they meet: anticipate those bounces for easy hits.',
      'A flat, fast throw at the top shelf keeps your streak safer than a high lob.',
      'Keep a spare pill or two: clearing a whole shelf pays 150 points per unused pill.',
    ],
  },
  faq: {
    fr: [
      { q: 'Les pilules de ce jeu sont-elles réelles ?', a: 'Non, absolument pas. Toutes les pilules et fioles sont des dessins fictifs créés pour le jeu. Pill Toss est un simple jeu d’adresse, sans aucun lien avec un médicament réel.' },
      { q: 'Comment fonctionne le bonus de série ?', a: 'Chaque touché rapporte 100 points, et chaque touché consécutif ajoute 50 points de plus (150, 200, 250…). Dès qu’une pilule rate les fioles, la série retombe à zéro.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé repose sur votre précision de lancer : le nombre de fioles touchées est rapporté au nombre de pilules lancées pendant la manche — la statistique « Précision » affichée dans le résumé. Ni chronomètre ni temps de référence : la rapidité n’entre pas en compte. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu d’adresse — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour affûter votre visée.' },
      { q: 'Le jeu s’arrête-t-il un jour ?', a: 'Non : les manches s’enchaînent sans fin et deviennent progressivement plus difficiles. Vous pouvez terminer la session quand vous le souhaitez — vos records sont sauvegardés à chaque fin de manche.' },
      { q: 'Comment atteindre 3 000 points en une manche ?', a: 'À partir de la manche 5, dix fioles traversent trois étagères : enchaînez dix touchés d’affilée (100, 150, 200… jusqu’à 550 points par touché) pour dépasser 3 250 points. Sur les premières manches, le bonus de 150 points par pilule restante fait aussi grimper le score.' },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui : le jeu est conçu pour le tactile, en portrait comme en paysage. La zone de saisie de la pilule est volontairement très large pour une visée confortable.' },
    ],
    en: [
      { q: 'Are the pills in this game real?', a: 'No, not at all. Every pill and jar is a fictional drawing made for the game. Pill Toss is purely a skill game with no connection to any real medication.' },
      { q: 'How does the streak bonus work?', a: 'Each hit is worth 100 points, and every consecutive hit adds 50 more (150, 200, 250…). As soon as a pill misses the jars, the streak falls back to zero.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ rests on your throwing accuracy: the number of jars hit is compared with the number of pills thrown during the round — the very “Accuracy” stat shown in the summary. There is no clock and no reference time, so speed does not come into it. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this skill game — not a clinical IQ test — and the best way to raise it is to keep playing to sharpen your aim.' },
      { q: 'Does the game ever end?', a: 'No: rounds chain endlessly and get progressively harder. You can end your session whenever you like — your records are saved at the end of every round.' },
      { q: 'How do I reach 3,000 points in a single round?', a: 'From round 5, ten jars span three shelves: land ten hits in a row (100, 150, 200… up to 550 points per hit) to pass 3,250 points. In earlier rounds, the 150-point bonus per unused pill also lifts your score.' },
      { q: 'Can I play on my phone?', a: 'Yes: the game is touch-first, in portrait or landscape. The pill’s grab zone is deliberately very large for comfortable aiming.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-score': { fr: 'Meilleur score total', en: 'Best total score' },
    'best-combo': { fr: 'Plus longue série de touchés', en: 'Longest hit streak' },
  },
}
