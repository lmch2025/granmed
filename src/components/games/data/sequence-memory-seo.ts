import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu sequence-memory (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const sequenceMemorySeoContent: GameSEOContent = {
  tagline: {
    fr: "Mémorisez et reproduisez des séquences de couleurs et de sons de plus en plus longues : chaque manche révèle votre QI estimé, façon Simon classique.",
    en: "Memorize and repeat ever-longer color and sound sequences: every round reveals your estimated IQ, classic Simon style.",
  },
  description: {
    fr: [
      "Gran' Mémoire est un jeu de séquences lumineuses inspiré du Simon classique : quatre pastilles colorées s'allument tour à tour avec leur note musicale, et vous devez reproduire la séquence exacte dans le même ordre. Chaque tour réussi ajoute une couleur, la séquence s'allonge et votre mémoire de travail est mise à l'épreuve.",
      "Deux modes sont proposés : le mode Classique, à vitesse constante, et le mode Rapide, qui accélère légèrement tous les cinq niveaux. Votre score correspond à la longueur de séquence reproduite, avec des records séparés par mode, des succès à débloquer (séquences de 10 et de 20) et de l'XP gagnée à chaque niveau réussi. En fin de partie, un QI estimé — calculé à partir de la longueur de séquence atteinte et du mode joué — vous attribue un niveau d'intelligence, du Novice au Génie, à élever en rejouant.",
      "Cet entraînement cérébral se joue en quelques minutes, sans inscription, sur mobile comme sur ordinateur. Les quatre tons distincts (do, mi, sol, do aigu) permettent à l'oreille de soutenir la mémoire visuelle : écoutez autant que vous regardez.",
    ],
    en: [
      "Gran's Memory is a light-sequence game inspired by the classic Simon: four colored pads light up one after another with their own musical tone, and you must repeat the exact sequence in the same order. Every successful round adds one more color, the sequence grows longer and your working memory is put to the test.",
      "Two modes are available: Classic, at a constant speed, and Fast, which speeds up slightly every five levels. Your score is the sequence length you reproduced, with separate personal bests per mode, achievements to unlock (sequences of 10 and 20) and XP earned on every completed level. At the end of a run, an estimated IQ — computed from the sequence length you reached and the mode you played — assigns you an intelligence level, from Novice to Genius, to raise as you replay.",
      "This brain-training game plays in a few minutes, with no sign-up, on mobile and desktop alike. The four distinct tones (C, E, G, high C) let your ears support your visual memory: listen as much as you watch.",
    ],
  },
  rules: {
    fr: [
      'Choisissez un mode : Classique (vitesse constante) ou Rapide (accélère tous les 5 niveaux).',
      'Appuyez sur Commencer : les pastilles s’allument une à une, chacune avec sa note.',
      'Observez et écoutez la séquence complète sans toucher l’écran.',
      'À votre tour : touchez les pastilles dans le même ordre.',
      'Chaque séquence réussie ajoute une couleur ; le niveau suivant rejoue toute la séquence depuis le début.',
      'Une seule erreur et la partie s’arrête : votre score est la longueur de séquence reproduite.',
    ],
    en: [
      'Pick a mode: Classic (constant speed) or Fast (speeds up every 5 levels).',
      'Press Start: the pads light up one by one, each with its own tone.',
      'Watch and listen to the whole sequence without touching the screen.',
      'Your turn: tap the pads in the same order.',
      'Each successful sequence adds one color; the next level replays the whole sequence from the start.',
      'One single mistake ends the game: your score is the sequence length you reproduced.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez les grandes pastilles colorées.',
      'Ordinateur : cliquez sur les pastilles, ou utilisez les touches 1, 2, 3 et 4 (dans l’ordre de lecture du plateau).',
      'Le son se coupe depuis la barre d’outils ; chaque pastille conserve sa propre note.',
    ],
    en: [
      'Mobile & tablet: tap the large colored pads.',
      'Desktop: click the pads, or use the 1, 2, 3 and 4 keys (in the board’s reading order).',
      'Sound can be muted from the toolbar; each pad keeps its own tone.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      '4 grandes pastilles aux dégradés rose, ambre, émeraude et violet',
      'Tons musicaux distincts (do, mi, sol, do aigu) générés en direct',
      'Mode Classique et mode Rapide accéléré (jusqu’à 150 ms par couleur)',
      'Records personnels séparés pour chaque mode',
      'Succès « Séquence 10 » et « Séquence 20 » à débloquer',
      'Rejouer instantanément, sans rechargement',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      '4 large pads with rose, amber, emerald and violet gradients',
      'Distinct musical tones (C, E, G, high C) generated live',
      'Classic mode and accelerating Fast mode (down to 150 ms per color)',
      'Separate personal bests for each mode',
      '“Sequence 10” and “Sequence 20” achievements to unlock',
      'Instant replay, no reload needed',
    ],
  },
  tips: {
    fr: [
      'Répétez la séquence à voix haute (« rose, ambre, ambre, violet… ») : la mémoire verbale soutient la mémoire visuelle.',
      'Mémorisez chaque pastille avec sa note : l’oreille reconnaît souvent la bonne couleur avant l’œil.',
      'Fixez un point au centre du plateau pour embrasser les quatre pastilles d’un seul regard, sans bouger la tête.',
      'En mode Rapide, regroupez la séquence par blocs de deux ou trois couleurs pour mieux l’anticiper.',
    ],
    en: [
      'Say the sequence out loud (“rose, amber, amber, violet…”): verbal memory supports visual memory.',
      'Memorize each pad with its tone: your ear often spots the right color before your eye does.',
      'Stare at a point in the center of the board to take in all four pads at once, without moving your head.',
      'In Fast mode, chunk the sequence into groups of two or three colors to anticipate better.',
    ],
  },
  faq: {
    fr: [
      { q: "Gran' Mémoire est-il vraiment gratuit ?", a: "Oui : les deux modes, les records et les succès sont accessibles gratuitement, sans inscription ni téléchargement." },
      { q: 'Comment le score est-il calculé ?', a: 'Le score est la longueur de séquence que vous avez réussi à reproduire entièrement. Si vous échouez au niveau 7, votre score est de 6.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé s’appuie sur la précision (la longueur de séquence que vous avez réussi à reproduire entièrement) et la difficulté du mode (Classique ou Rapide) ; la rapidité n’entre pas en compte dans ce jeu. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu de mémoire de travail — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour allonger vos séquences.' },
      { q: 'Quelle est la différence entre les modes Classique et Rapide ?', a: 'En Classique, chaque couleur reste allumée 400 ms du début à la fin. En Rapide, on démarre à 300 ms et la vitesse augmente de 10 ms tous les cinq niveaux, jusqu’à un minimum de 150 ms.' },
      { q: 'Ce jeu améliore-t-il vraiment la mémoire ?', a: "Il fait travailler la mémoire de travail auditive et visuelle, comme tout exercice régulier de ce type. Il mesure surtout votre entraînement à ce jeu, sans prétendre évaluer vos capacités cognitives globales." },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui, le plateau 2×2 est conçu pour l’écran tactile et occupe toute la largeur en portrait comme en paysage.' },
    ],
    en: [
      { q: "Is Gran's Memory really free?", a: 'Yes: both modes, records and achievements are free to play, with no sign-up and no download.' },
      { q: 'How is the score calculated?', a: 'The score is the sequence length you fully reproduced. If you fail at level 7, your score is 6.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ rests on accuracy (the sequence length you fully reproduced) and the mode’s difficulty (Classic or Fast); speed does not come into play in this game. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this working-memory game — not a clinical IQ test — and the best way to raise it is to keep playing to lengthen your sequences.' },
      { q: 'What is the difference between Classic and Fast modes?', a: 'In Classic, every color stays lit for 400 ms from start to finish. In Fast, you start at 300 ms and the speed increases by 10 ms every five levels, down to a minimum of 150 ms.' },
      { q: 'Does this game really improve memory?', a: 'It exercises auditory and visual working memory, like any regular practice of this kind. It mostly measures your training at this game, not your overall cognitive abilities.' },
      { q: 'Can I play on my phone?', a: 'Yes, the 2×2 board is designed for touch and fills the width in portrait or landscape.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-sequence-classic': { fr: 'Meilleure séquence — Classique', en: 'Best sequence — Classic' },
    'best-sequence-fast': { fr: 'Meilleure séquence — Rapide', en: 'Best sequence — Fast' },
  },
}
