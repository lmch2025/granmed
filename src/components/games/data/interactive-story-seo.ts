import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu interactive-story (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const interactiveStorySeoContent: GameSEOContent = {
  tagline: {
    fr: 'Deux récits à embranchements où vos décisions mènent à six fins différentes — et dessinent votre QI estimé.',
    en: 'Two branching tales where your choices lead to six different endings — and shape your estimated IQ.',
  },
  description: {
    fr: [
      "Histoire Interactive est un jeu de narration à choix multiples dans lequel vous lisez un récit court, chapitre par chapitre, et décidez à chaque étape de ce que fait le personnage. Vos choix orientent l'intrigue et mènent à l'une des trois fins de chaque histoire.",
      "Le jeu propose deux récits chaleureux — « Le Jardin de Grand-Mère » et « La Lettre au Fond du Tiroir » — écrits en chapitres courts, avec des personnages attachants et des décisions qui mènent vraiment à des chemins différents.",
      "Chaque chapitre s'écrit sous vos yeux dans un panneau de lecture confortable — un simple toucher révèle le texte en entier. Votre progression est sauvegardée automatiquement : reprenez votre chapitre en cours, relisez l'historique de vos décisions et collectionnez les six fins à découvrir (trois par histoire). À chaque fin atteinte, un QI estimé — fonction de la qualité de vos choix — vous attribue un niveau d'intelligence, du Novice au Génie, à élever en explorant d'autres chemins.",
    ],
    en: [
      'Interactive Story is a choose-your-own-adventure game in which you read a short tale chapter by chapter and decide, at every step, what the hero does next. Your choices steer the plot toward one of three endings per story.',
      'The game offers two warm tales — “Grandma\u2019s Garden” and “The Letter at the Bottom of the Drawer” — written in short chapters, with endearing characters and decisions that genuinely branch the narrative.',
      'Each chapter types itself before your eyes in a comfortable reading panel — a single tap reveals the full text. Your progress is saved automatically: resume your current chapter, review the history of your decisions, and collect all six endings to discover (three per story). At every ending you reach, an estimated IQ — a function of the quality of your choices — assigns you an intelligence level, from Novice to Genius, to raise by exploring other paths.',
    ],
  },
  rules: {
    fr: [
      "Choisissez l'une des deux histoires depuis la bibliothèque.",
      'Lisez le chapitre, puis touchez l\u2019une des décisions proposées.',
      'Vos choix modifient le récit et conduisent vers l\u2019une des trois fins de chaque histoire.',
      'Une fin découverte reste mémorisée : rejouez pour explorer les autres chemins.',
    ],
    en: [
      'Pick one of the two tales from the library.',
      'Read the chapter, then tap one of the decisions offered.',
      'Your choices change the story and lead to one of the three endings of each tale.',
      'A discovered ending stays recorded: replay to explore the other paths.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez une décision pour continuer le récit.',
      'Ordinateur : cliquez sur les décisions, ou utilisez les touches 1, 2, 3 pour choisir et Entrée pour afficher d’un coup tout le texte du chapitre.',
      'Le texte s’écrit au fil de la lecture : touchez le panneau (ou appuyez sur Entrée) pour l’afficher en entier immédiatement.',
      'Le bouton retour en haut du lecteur ramène à la bibliothèque sans perdre votre progression.',
    ],
    en: [
      'Mobile & tablet: tap a decision to continue the tale.',
      'Desktop: click decisions, or use keys 1, 2, 3 to choose and Enter to reveal the whole chapter at once.',
      'Text types itself as you read: tap the panel (or press Enter) to display it fully right away.',
      'The back button at the top of the reader returns to the library without losing your progress.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      '2 histoires complètes à embranchements (19 et 16 chapitres)',
      '6 fins à découvrir — 3 par histoire',
      'Reprise automatique du chapitre en cours',
      'Historique « Vos décisions » consultable depuis la barre du lecteur',
      'Texte qui s’écrit progressivement — un simple toucher révèle tout',
      'Véritables adaptations culturelles FR/EN (mêmes embranchements, écriture localisée)',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      '2 complete branching tales (19 and 16 chapters)',
      '6 endings to discover — 3 per story',
      'Automatic resume of your current chapter',
      '“Your decisions” history at hand from the reader bar',
      'Text that types itself — one tap reveals everything',
      'Genuine FR/EN cultural adaptations (same branching, localized writing)',
    ],
  },
  tips: {
    fr: [
      'Explorez chaque choix : deux boutons peuvent mener à des chapitres très différents.',
      'Les fins « quartier » passent par les autres personnages ; la fin « trésor » demande de la curiosité.',
      'Utilisez l\u2019historique de décisions pour vous souvenir du chemin déjà pris.',
      'Après une fin, « Explorer une autre fin » relance immédiatement l\u2019histoire.',
    ],
    en: [
      'Explore every choice: two buttons can lead to very different chapters.',
      'The “neighborhood” endings come through other characters; the “treasure” ending takes curiosity.',
      'Use the decision history to remember the path you already took.',
      'After an ending, “Explore another ending” restarts the story right away.',
    ],
  },
  faq: {
    fr: [
      { q: 'Histoire Interactive est-elle adaptée aux enfants ?', a: 'Oui : les deux récits sont doux, sans violence ni moment effrayant, avec des personnages bienveillants et des chapitres très courts.' },
      { q: 'Combien de temps dure une lecture ?', a: 'Un chemin complet se lit en trois à cinq minutes. Comptez une vingtaine de minutes pour explorer les six fins des deux histoires.' },
      { q: 'Mes choix ont-ils vraiment un impact ?', a: 'Oui : chaque histoire est un vrai graphe à embranchements, et chaque fin n\u2019est accessible que par certains chemins. Deux lectures diffèrent réellement.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'À chaque fin atteinte, votre QI estimé récompense la qualité de votre lecture : une base pour avoir mené le récit à son terme, un bonus si la fin est une découverte (vous avez su trouver un chemin inédit) et un autre au prorata de la profondeur de votre cheminement (le nombre de décisions prises). Le résultat est ramené sur l\u2019échelle classique du QI (moyenne 100, écart-type 15) et vous attribue un niveau, du Novice au Génie. C\u2019est une estimation ludique de la finesse de vos choix narratifs — pas un test de QI clinique — et le meilleur moyen de l\u2019élever reste de relire les histoires pour explorer des chemins plus riches et de nouvelles fins.' },
      { q: 'Le texte s’affiche lettre par lettre, puis-je le voir en entier ?', a: 'Oui : touchez le panneau de lecture (ou appuyez sur Entrée au clavier) pour afficher instantanément le chapitre complet. L’effet d’écriture est aussi désactivé automatiquement quand votre appareil demande une réduction des animations.' },
      { q: 'Puis-je reprendre une histoire en cours ?', a: 'Oui : votre chapitre et vos décisions sont sauvegardés automatiquement sur votre appareil. Un bandeau « Reprendre » s\u2019affiche sur la couverture concernée.' },
      { q: 'Les histoires sont-elles les mêmes en français et en anglais ?', a: 'Elles partagent la même structure et les mêmes embranchements, mais chaque version est une véritable adaptation culturelle : noms, lieux et détails changent.' },
    ],
    en: [
      { q: 'Is Interactive Story suitable for children?', a: 'Yes: both tales are gentle, with no violence or scary moments, kind-hearted characters and very short chapters.' },
      { q: 'How long is one read-through?', a: 'A full path takes three to five minutes. Allow about twenty minutes to explore all six endings across both tales.' },
      { q: 'Do my choices really matter?', a: 'Yes: each story is a true branching graph, and each ending is reachable only through certain paths. Two playthroughs genuinely differ.' },
      { q: 'How is my estimated IQ calculated?', a: 'At every ending you reach, your estimated IQ rewards the quality of your reading: a base for carrying the tale through to its end, a bonus if the ending is a first discovery (you managed to find an unseen path) and another proportional to the depth of your journey (the number of decisions you made). The result maps onto the classic IQ scale (mean 100, standard deviation 15) and assigns you a level, from Novice to Genius. It is a playful estimate of how finely you choose your narrative paths — not a clinical IQ test — and the best way to raise it is to reread the tales to explore richer paths and new endings.' },
      { q: 'The text appears letter by letter — can I see it all at once?', a: 'Yes: tap the reading panel (or press Enter on a keyboard) to display the whole chapter instantly. The writing effect is also turned off automatically when your device requests reduced motion.' },
      { q: 'Can I resume a story in progress?', a: 'Yes: your chapter and decisions are saved automatically on your device. A “Resume” badge appears on the relevant cover.' },
      { q: 'Are the stories the same in French and English?', a: 'They share the same structure and branching, but each version is a genuine cultural adaptation: names, places and details change.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'endings-found': { fr: 'Fins découvertes (cumul des 2 histoires)', en: 'Endings found (both tales combined)' },
  },
}
