import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu zen-fishing (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const zenFishingSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Une pêche détendante à une main : complétez votre collection de 12 espèces et élevez au fil de l’eau votre QI estimé.',
    en: 'Relaxed one-hand fishing: complete your 12-species collection and gently raise your estimated IQ along the way.',
  },
  description: {
    fr: [
      'Pêche Miraculeuse (Zen Fishing) est un jeu de détente gratuit dans lequel vous descendez un hameçon dans une mer apaisante, puis le remontez pour attraper les poissons croisés sur le chemin. Une seule commande : maintenez pour descendre, relâchez pour remonter.',
      'À la descente, les poissons vous ignorent : c’est à la remontée que tout se joue. Sardines et dauphins peuplent les eaux peu profondes, poissons-clowns et tortues la mi-profondeur, tandis que requins et le légendaire poisson doré se cachent dans les grandes profondeurs. Chaque nouvelle espèce rejoint votre carnet de collection.',
      'Le carnet compte 12 espèces à découvrir, des communes aux légendaires, sauvegardé sur votre appareil. Un QI estimé, lié à la progression de votre collection, accompagne cette détente : il vous attribue un niveau d’intelligence, du Novice au Génie, qui s’élève à chaque nouvelle espèce découverte. Trois défis tournent chaque jour (5 poissons en une descente, un poisson des profondeurs, 10 poissons dans la journée) : le défi du jour rapporte un bonus d’XP et alimente votre série.',
    ],
    en: [
      'Miraculous Fishing (Zen Fishing) is a free relaxation game in which you lower a hook into a calm sea, then reel it back up to catch the fish crossed on the way. One single control: hold to descend, release to reel in.',
      'On the way down, fish ignore you: everything happens on the way up. Sardines and dolphins fill the shallow waters, clownfish and turtles the mid depths, while sharks and the legendary golden fish hide in the deep. Every new species joins your collection book.',
      'The book holds 12 species to discover, from common to legendary, saved on your device. An estimated IQ, tied to the progress of your collection, accompanies the relaxation: it assigns you an intelligence level, from Novice to Genius, that rises with every new species you discover. Three challenges rotate daily (5 fish in one descent, a deep-water fish, 10 fish in the day): the daily challenge earns bonus XP and feeds your streak.',
    ],
  },
  rules: {
    fr: [
      'Maintenez l’écran (ou la barre d’espace) pour descendre l’hameçon.',
      'Relâchez pour remonter : la remontée s’arrête à la surface.',
      'À la descente, les poissons traversent l’hameçon sans être pris.',
      'À la remontée, chaque poisson touché par l’hameçon est accroché et remonte avec lui.',
      'De retour en surface, la prise est comptée et les nouvelles espèces rejoignent le carnet.',
      'Relâchez au bon moment : plus vous descendez profond, plus vous remontez à travers de bancs de poissons.',
    ],
    en: [
      'Hold the screen (or the space bar) to lower the hook.',
      'Release to reel it back up: the ascent stops at the surface.',
      'On the way down, fish pass through the hook without being caught.',
      'On the way up, every fish the hook touches gets hooked and rises with it.',
      'Back at the surface, the catch is counted and new species join the book.',
      'Release at the right moment: the deeper you go, the more schools you reel through.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : maintenez n’importe où sur le jeu pour descendre, relâchez pour remonter.',
      'Ordinateur : maintenez le bouton de la souris ou la barre d’espace.',
      'Ouvrez le carnet de collection avec le bouton « Collection ».',
    ],
    en: [
      'Mobile & tablet: press and hold anywhere on the game to descend, release to reel up.',
      'Desktop: hold the mouse button or the space bar.',
      'Open the collection book with the “Collection” button.',
    ],
  },
  features: {
    fr: [
      'QI estimé lié à votre collection',
      'Commande à un doigt, idéale pour une pause zen',
      '12 espèces à collectionner, des communes au poisson doré légendaire',
      '3 zones de profondeur avec faune spécifique',
      'Carnet de collection sauvegardé sur votre appareil',
      'Défis quotidiens rotatifs et série de jours',
      'Ambiance apaisante : rayons de lumière, bulles, algues',
    ],
    en: [
      'Estimated IQ tied to your collection',
      'One-finger control, perfect for a zen break',
      '12 species to collect, from common to the legendary golden fish',
      '3 depth zones with their own wildlife',
      'Collection book saved on your device',
      'Rotating daily challenges and day streak',
      'Soothing atmosphere: light rays, bubbles, seaweed',
    ],
  },
  tips: {
    fr: [
      'Les espèces rares et légendaires vivent en profondeur : prenez le temps de descendre au fond avant de remonter.',
      'Repérez les bancs pendant la descente : c’est à la remontée qu’on pêche, donc mémorisez les passages denses.',
      'Une remontée lente et régulière traverse plus de bancs qu’une remontée précipitée.',
      'Le carnet indique la zone de chaque espèce manquante : ciblez la profondeur qui vous manque.',
    ],
    en: [
      'Rare and legendary species live deep: take the time to reach the bottom before reeling up.',
      'Scout the schools during the descent: you catch on the way up, so memorize the dense passages.',
      'A slow, steady ascent crosses more schools than a rushed one.',
      'The book shows the zone of every missing species: target the depth you still lack.',
    ],
  },
  faq: {
    fr: [
      { q: 'Pourquoi ne prend-on les poissons qu’à la remontée ?', a: 'C’est le cœur du jeu : la descente sert à choisir votre profondeur, la remontée à pêcher. Cela rend chaque lâcher de doigt décisif, sans jamais être punitif.' },
      { q: 'Combien d’espèces peut-on attraper ?', a: '12 espèces réparties en trois zones de profondeur : 3 communes près de la surface, 4 à mi-profondeur (dont le rare homard) et 5 dans les grandes profondeurs (dont le requin et le légendaire poisson doré).' },
      { q: 'Ma collection est-elle sauvegardée ?', a: 'Oui : le carnet est enregistré automatiquement sur votre appareil, ainsi que vos records d’espèces et de plus grosse prise. Vous pouvez y rejouer quand vous voulez.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Ici, pas de chrono ni d’échec : votre QI estimé reflète la progression de votre collection. Il augmente avec le nombre d’espèces découvertes sur les 12 du carnet, des communes au légendaire poisson doré, puis est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15) pour vous attribuer un niveau, du Novice au Génie. C’est une estimation ludique de votre progression — pas un test de QI clinique — et le meilleur moyen de l’élever reste de partir à la recherche des espèces qui vous manquent.' },
      { q: 'Les défis du jour changent-ils ?', a: 'Oui : chaque jour, l’objectif actif est choisi de façon déterministe parmi trois défis (5 poissons en une descente, un poisson des profondeurs, 10 poissons dans la journée). Il est identique pour tous les joueurs.' },
      { q: 'Y a-t-il une fin ou un game over ?', a: 'Non : la pêche est infinie et sans échec. C’est un jeu de détente — les seuls objectifs sont votre collection et vos records personnels.' },
    ],
    en: [
      { q: 'Why are fish only caught on the way up?', a: 'That is the heart of the game: the descent picks your depth, the ascent does the fishing. Every finger release becomes decisive, without ever being punishing.' },
      { q: 'How many species can I catch?', a: '12 species across three depth zones: 3 common ones near the surface, 4 at mid depth (including the rare lobster) and 5 in the deep (including the shark and the legendary golden fish).' },
      { q: 'Is my collection saved?', a: 'Yes: the book is saved automatically on your device, along with your species record and biggest catch. You can come back to it any time.' },
      { q: 'How is my estimated IQ calculated?', a: 'Here there is no timer and no failure: your estimated IQ reflects the progress of your collection. It rises with the number of species discovered out of the 12 in the book, from the common ones to the legendary golden fish, then maps onto the classic IQ scale (mean 100, standard deviation 15) to assign you a level, from Novice to Genius. It is a playful estimate of your progress — not a clinical IQ test — and the best way to raise it is to go hunting for the species you are still missing.' },
      { q: 'Do the daily challenges change?', a: 'Yes: every day the active goal is picked deterministically among three challenges (5 fish in one descent, a deep-water fish, 10 fish in the day). It is identical for every player.' },
      { q: 'Is there an end or a game over?', a: 'No: the fishing is endless and fail-free. It is a relaxation game — the only goals are your collection and your personal records.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'species': { fr: 'Espèces découvertes', en: 'Species discovered' },
    'best-catch': { fr: 'Plus grosse prise (une descente)', en: 'Biggest catch (one descent)' },
  },
}
