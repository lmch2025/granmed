import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu merge-garden (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const mergeGardenSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Fusionnez graines et plantes pour découvrir 16 espèces, du bourgeon jusqu’au jardin complet de Gran — et élever votre QI estimé au fil de la collection.',
    en: 'Merge seeds and plants to discover 16 species, from tiny buds all the way to Gran’s complete garden — raising your estimated IQ as the collection grows.',
  },
  description: {
    fr: [
      'Jardin de Gran est un jeu de fusion zen et gratuit dans lequel vous plantez des graines sur un plateau de 6×7 cases, puis combinez deux plantes identiques pour les faire évoluer en l’espèce supérieure, de la simple graine jusqu’au grand chêne et au jardin complet de Gran.',
      'Chaque fusion rapporte de l’expérience et chaque nouvelle espèce découverte enrichit votre livre de collection. Votre stock de graines se recharge automatiquement (une toutes les 20 secondes, dans la limite de 5), même quand vous quittez la page : le jardin pousse à votre rythme, sans game-over ni pression. Votre QI estimé, lié à la progression de votre collection, vous attribue un niveau d’intelligence du Novice au Génie, à élever en faisant grandir le jardin.',
      'Cinq objectifs progressifs structurent la partie — découvrir le tournesol, atteindre le grand chêne, planter 50 graines, fusionner 100 fois et compléter les 16 espèces — et tout est sauvegardé automatiquement sur votre appareil.',
    ],
    en: [
      'Gran’s Garden is a calm, free merge game where you plant seeds on a 6×7 board, then combine two identical plants to evolve them into the next species, from a simple seed all the way to the great oak and Gran’s complete garden.',
      'Every merge earns experience and each newly discovered species enriches your collection book. Your seed stock refills automatically (one every 20 seconds, up to 5), even while you are away: the garden grows at your own pace, with no game over and no pressure. Your estimated IQ, tied to the growth of your species collection, assigns you an intelligence level from Novice to Genius, to raise as the garden keeps growing.',
      'Five progressive goals structure the game — discover the sunflower, reach the great oak, plant 50 seeds, merge 100 times and complete all 16 species — and everything is saved automatically on your device.',
    ],
  },
  rules: {
    fr: [
      'Touchez une plante pour la sélectionner (anneau de sélection).',
      'Touchez une case vide pour y déplacer la plante sélectionnée.',
      'Touchez une plante identique pour fusionner les deux en l’espèce supérieure.',
      'Le bouton « Planter » sème une graine (niveau 1) sur une case libre aléatoire ; glissez plutôt la graine 🌱 du compteur pour choisir sa case exacte.',
      'Le stock de graines (maximum 5) se recharge d’une unité toutes les 20 secondes.',
      'Il n’y a pas de fin : découvrez les 16 espèces à votre rythme.',
    ],
    en: [
      'Tap a plant to select it (selection ring).',
      'Tap an empty cell to move the selected plant there.',
      'Tap an identical plant to merge both into the next species.',
      'The “Plant” button drops a seed (tier 1) on a random free cell; drag the 🌱 seed from the counter instead to choose its exact cell.',
      'The seed stock (max 5) refills by one every 20 seconds.',
      'There is no end: discover the 16 species at your own pace.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez une plante puis une autre case pour la fusionner ou la déplacer — ou glissez-la directement du doigt.',
      'Glissez la graine 🌱 du compteur vers une case libre pour la planter exactement où vous voulez.',
      'Ordinateur : cliquez pour sélectionner puis agir ; le glisser-déposer à la souris fonctionne partout.',
      'Aucune commande clavier nécessaire — tout se joue au doigt ou à la souris.',
    ],
    en: [
      'Mobile & tablet: tap a plant, then tap another cell to merge or move — or drag it directly with your finger.',
      'Drag the 🌱 seed from the counter onto a free cell to plant it exactly where you want.',
      'Desktop: click to select then act; drag & drop with the mouse works everywhere.',
      'No keyboard needed — everything is played by finger or mouse.',
    ],
  },
  features: {
    fr: [
      'QI estimé lié à votre collection',
      '16 espèces à découvrir, de la graine 🌱 au jardin de Gran 🏡',
      'Plateau 6×7 sans game-over : une progression zen',
      'Glisser-déposer tactile aimanté : plantes et graines, avec cible illuminée et légère vibration',
      'Stock de 5 graines rechargeable (1 toutes les 20 s, même hors ligne)',
      'Livre de collection des espèces découvertes',
      '5 objectifs progressifs avec récompenses d’expérience',
      'Sauvegarde automatique du jardin sur votre appareil',
    ],
    en: [
      'IQ tied to your collection',
      '16 species to discover, from the seed 🌱 to Gran’s garden 🏡',
      '6×7 board with no game over: a zen progression',
      'Magnetized touch drag & drop: plants and seeds, with a lit target and a light vibration',
      'Refillable stock of 5 seeds (1 every 20 s, even offline)',
      'Collection book of discovered species',
      '5 progressive goals with experience rewards',
      'Automatic save of your garden on your device',
    ],
  },
  tips: {
    fr: [
      'Regroupez les espèces par niveau dans des zones du plateau : vous verrez immédiatement les fusions possibles.',
      'Glissez la graine du compteur à côté d’une plante de niveau 1 pour fusionner en un seul geste.',
      'Ne montez pas trop vite : garder plusieurs plantes de niveau intermédiaire évite de bloquer le plateau.',
      'Le stock se recharge même page fermée : revenez plus tard pour une session de plantation plus généreuse.',
    ],
    en: [
      'Group species by tier in zones of the board: you will instantly see the possible merges.',
      'Drag the seed from the counter next to a tier-1 plant to merge in a single gesture.',
      'Do not climb too fast: keeping several mid-tier plants avoids locking the board.',
      'The stock refills even with the page closed: come back later for a more generous planting session.',
    ],
  },
  faq: {
    fr: [
      { q: 'Jardin de Gran est-il vraiment gratuit ?', a: 'Oui, le jeu est entièrement gratuit, sans inscription ni téléchargement, et votre jardin est sauvegardé localement sur votre appareil.' },
      { q: 'Que se passe-t-il quand le plateau est plein ?', a: 'Il n’y a pas de game-over : fusionnez des plantes identiques pour libérer des cases. Bloquer réellement le plateau demanderait plus de 26 jardins de Gran côte à côte (près d’un million de graines) : en pratique, une fusion reste toujours possible.' },
      { q: 'Comment se recharge le stock de graines ?', a: 'Une graine est ajoutée toutes les 20 secondes, jusqu’à un maximum de 5. La recharge continue même si vous quittez la page, grâce à l’horodatage sauvegardé.' },
      { q: 'Combien d’espèces existe-t-il ?', a: '16 espèces, de la graine (niveau 1) au jardin de Gran (niveau 16). Le livre de collection vous montre celles découvertes et celles qui restent.' },
      { q: 'Puis-je jouer sur mobile ?', a: 'Oui, le jeu est conçu pour le tactile : glissez une plante ou une graine du doigt, chaque case se joue confortablement, en portrait comme en paysage.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Le jardin étant un jeu zen sans fin de manche, votre QI estimé reflète la progression de votre collection : il s’élève avec les espèces découvertes (sur les 16 que compte le jeu), la difficulté de référence étant celle de la progression complète. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre avancée dans ce jeu de fusion — pas un test de QI clinique — et le meilleur moyen de l’élever reste de continuer à faire pousser et fusionner vos plantes.' },
    ],
    en: [
      { q: 'Is Gran’s Garden really free?', a: 'Yes, the game is completely free, with no sign-up and no download, and your garden is saved locally on your device.' },
      { q: 'What happens when the board is full?', a: 'There is no game over: merge identical plants to free cells. Truly locking the board would take more than 26 of Gran’s gardens side by side (close to a million seeds): in practice, a merge is always still possible.' },
      { q: 'How does the seed stock refill?', a: 'One seed is added every 20 seconds, up to a maximum of 5. Refilling continues even if you leave the page, thanks to the saved timestamp.' },
      { q: 'How many species are there?', a: '16 species, from the seed (tier 1) to Gran’s garden (tier 16). The collection book shows the ones you have discovered and the ones left.' },
      { q: 'Can I play on mobile?', a: 'Yes, the game is touch-first: drag a plant or a seed with your finger, every cell is comfortable to play, in portrait or landscape.' },
      { q: 'How is my estimated IQ calculated?', a: 'Because the garden is a zen game with no round end, your estimated IQ reflects the progression of your collection: it rises with the species you discover (out of the 16 the game counts), the reference difficulty being that of the full progression. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your progress in this merge game — not a clinical IQ test — and the best way to raise it is to keep growing and merging your plants.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'species-discovered': { fr: 'Espèces découvertes', en: 'Species discovered' },
    'highest-tier': { fr: 'Espèce la plus élevée', en: 'Highest species reached' },
  },
}
