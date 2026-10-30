import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu speed-math (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const speedMathSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Tapez les bonnes réponses sur le pavé numérique : 60 secondes, bonus de série et fourchettes qui s’adaptent à vous — et un QI estimé en fin de sprint.',
    en: 'Type the right answers on the number pad: 60 seconds, streak bonuses and ranges that adapt to you — plus an estimated IQ at the end of each sprint.',
  },
  description: {
    fr: [
      'Calcul Éclair est un jeu de calcul mental chronométré : pendant 60 secondes, les opérations s’enchaînent et vous tapez chaque résultat sur un grand pavé numérique pensé pour le pouce. La bonne réponse se valide automatiquement dès qu’elle est exacte ; chaque succès rapporte 10 points, augmentés d’un bonus quand votre série s’allonge (jusqu’à +20 au-delà de 10 bonnes réponses d’affilée).',
      'Trois niveaux sont proposés : Facile (additions et soustractions), Moyen (avec les tables de multiplication) et Difficile (toutes les opérations, divisions au résultat entier garanti). Tous les cinq succès consécutifs, les fourchettes de nombres s’élargissent légèrement : le jeu s’adapte à votre niveau. En fin de sprint, un QI estimé — calculé à partir de votre précision, de votre rapidité et de la difficulté choisie — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'Un sprint terminé enregistre votre score et votre nombre de bonnes réponses comme records, débloque des succès (25 et 40 bonnes réponses) et, chaque jour, un défi du jour propose la même série de calculs à tous les joueurs. Le chrono se met même en pause si vous changez d’onglet en cours de sprint.',
    ],
    en: [
      'Speed Math is a timed mental-arithmetic game: for 60 seconds, operations come one after another and you type each result on a large thumb-friendly number pad. The right answer validates itself as soon as it is exact; each success earns 10 points, topped up with a bonus as your streak grows (up to +20 beyond 10 correct answers in a row).',
      'Three levels are offered: Easy (additions and subtractions), Medium (with multiplication tables) and Hard (all operations, with divisions guaranteed to have whole-number results). Every five correct answers in a row, the number ranges widen slightly: the game adapts to your level. At the end of each sprint, an estimated IQ — computed from your accuracy, speed and chosen difficulty — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'A finished sprint saves your score and your correct-answer count as records, unlocks achievements (25 and 40 correct answers) and, every day, a daily challenge offers the same calculations to every player. The clock even pauses if you switch tabs mid-sprint.',
    ],
  },
  rules: {
    fr: [
      'Choisissez une difficulté : Facile, Moyen ou Difficile — ou lancez le défi du jour.',
      'Le sprint dure 60 secondes et démarre dès la première question.',
      'Tapez le résultat sur le pavé : la bonne réponse se valide automatiquement dès qu’elle est exacte.',
      'Bonne réponse : +10 points, +5 / +10 / +20 de bonus à partir de 3 / 6 / 10 bonnes réponses d’affilée.',
      'Mauvaise réponse ou validation prématurée : la série retombe à zéro et la bonne réponse s’affiche brièvement.',
      'À la fin du chrono : score, bonnes réponses, meilleure série et précision sont enregistrés.',
    ],
    en: [
      'Pick a difficulty: Easy, Medium or Hard — or start the daily challenge.',
      'The sprint lasts 60 seconds and starts with the first question.',
      'Type the result on the pad: the right answer validates itself as soon as it is exact.',
      'Correct answer: +10 points, +5 / +10 / +20 bonus from 3 / 6 / 10 correct answers in a row.',
      'Wrong or premature answer: the streak falls back to zero and the right answer is briefly shown.',
      'When the clock ends: score, correct answers, best streak and accuracy are recorded.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : tapez la réponse sur le pavé numérique 3×4 (grandes touches d’au moins 48 px).',
      'Ordinateur : chiffres 0 à 9 au clavier, Retour arrière pour effacer, Entrée pour valider.',
      'La barre de temps se vide au fil du sprint ; un tic sonore retentit sur les 5 dernières secondes.',
      'Le chrono se met en pause quand vous changez d’onglet, puis reprend sans perdre une seconde.',
    ],
    en: [
      'Mobile & tablet: type the answer on the 3×4 number pad (large keys of at least 48 px).',
      'Desktop: digits 0 to 9 on the keyboard, Backspace to erase, Enter to submit.',
      'The time bar empties as the sprint goes; a ticking sound rings out over the last 5 seconds.',
      'The clock pauses when you switch tabs, then resumes without losing a second.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      '3 difficultés : Facile, Moyen, Difficile (divisions à résultat entier)',
      'Difficulté adaptative : les fourchettes grandissent tous les 5 succès consécutifs',
      'Pavé numérique géant 3×4 et clavier physique pris en charge',
      'Bonus de série avec compteur de flammes animé et paliers sonores',
      'Barre de temps de 60 s, tic-tac et pulsation sur les 5 dernières secondes',
      'Records de score et de bonnes réponses, succès 25 et 40',
      'Défi du jour : la même série de calculs pour tous les joueurs',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      '3 difficulties: Easy, Medium, Hard (whole-number divisions)',
      'Adaptive difficulty: ranges grow every 5 correct answers in a row',
      'Giant 3×4 number pad and physical keyboard support',
      'Streak bonuses with an animated flame counter and sound milestones',
      '60-second time bar, ticking and pulsing over the last 5 seconds',
      'Score and correct-answer records, 25 and 40 achievements',
      'Daily challenge: the same calculation series for every player',
    ],
  },
  tips: {
    fr: [
      'Visez la régularité plutôt que la vitesse : une erreur coûte la série ET 0,7 seconde d’affichage de la réponse.',
      'Pour multiplier par 9, multipliez par 10 puis retirez le nombre : 7 × 9 = 70 − 7 = 63.',
      'Pour diviser, pensez « combien de fois » : 56 ÷ 7, comptez 7, 14, 21… jusqu’à 56 : huit fois.',
      'Décomposez les grands calculs : 47 + 38, c’est 47 + 40 − 2 = 85 — plus vite tapé que posé.',
    ],
    en: [
      'Aim for consistency over speed: one mistake costs your streak AND 0.7 seconds while the answer is shown.',
      'To multiply by 9, multiply by 10 then subtract the number: 7 × 9 = 70 − 7 = 63.',
      'To divide, think “how many times”: for 56 ÷ 7, count 7, 14, 21… up to 56: eight times.',
      'Break big sums down: 47 + 38 is 47 + 40 − 2 = 85 — faster typed than worked out on paper.',
    ],
  },
  faq: {
    fr: [
      { q: 'Les divisions tombent-elles toujours juste ?', a: 'Oui : en difficulté Difficile, chaque division est construite à partir du diviseur et du quotient, donc le résultat est toujours un nombre entier.' },
      { q: 'Comment fonctionne la difficulté adaptative ?', a: 'Tous les 5 succès consécutifs, les nombres des opérations suivantes s’étendent légèrement (par exemple jusqu’à 20+3 par tranche en Facile). Une erreur ramène la fourchette au niveau de votre série actuelle.' },
      { q: 'Comment les points sont-ils calculés ?', a: 'Chaque bonne réponse vaut 10 points, plus 5 à partir de 3 bonnes réponses consécutives, 10 à partir de 6, et 20 à partir de 10. Le score final rapporte la moitié de sa valeur en XP.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé combine trois dimensions mesurées pendant le sprint : la précision (bonnes réponses par rapport aux réponses soumises), la rapidité (20 bonnes réponses en 60 secondes servant de rythme de référence) et la difficulté (Facile, Moyen ou Difficile). Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu de calcul mental — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour gagner en justesse et en vitesse.' },
      { q: 'Faut-il appuyer sur Valider à chaque fois ?', a: 'Non : dès que le nombre tapé est exact, la réponse se valide toute seule. Le bouton Valider sert à soumettre une réponse plus courte, ou à révéler la solution quand on est bloqué.' },
      { q: 'Le défi du jour est-il identique pour tous ?', a: 'Oui : sa difficulté et sa série de calculs sont générées de façon déterministe à partir de la date. Tous les joueurs voient les mêmes opérations jusqu’au lendemain.' },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui : le pavé numérique 3×4 offre de grandes touches pensées pour le pouce, et le clavier virtuel du système n’est jamais appelé.' },
    ],
    en: [
      { q: 'Do divisions always come out even?', a: 'Yes: in Hard difficulty, every division is built from the divisor and the quotient, so the result is always a whole number.' },
      { q: 'How does adaptive difficulty work?', a: 'Every 5 correct answers in a row, the numbers of the following operations stretch slightly (for example up to 20+3 per step in Easy). A mistake brings the range back to your current streak level.' },
      { q: 'How are points calculated?', a: 'Each correct answer is worth 10 points, plus 5 from 3 correct answers in a row, 10 from 6, and 20 from 10. The final score earns half its value in XP.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ combines three dimensions measured during the sprint: accuracy (correct answers relative to submitted answers), speed (20 correct answers in 60 seconds as the reference pace) and difficulty (Easy, Medium or Hard). The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this mental-arithmetic game — not a clinical IQ test — and the best way to raise it is to keep playing for accuracy and pace.' },
      { q: 'Do I have to press Submit every time?', a: 'No: as soon as the typed number is exact, the answer validates itself. The Submit button is there to send a shorter answer, or to reveal the solution when you are stuck.' },
      { q: 'Is the daily challenge identical for everyone?', a: 'Yes: its difficulty and calculation series are generated deterministically from the date. Every player sees the same operations until tomorrow.' },
      { q: 'Can I play on my phone?', a: 'Yes: the 3×4 number pad offers large thumb-friendly keys, and the system’s virtual keyboard is never summoned.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-score': { fr: 'Meilleur score (60 s)', en: 'Best score (60 s)' },
    'best-correct': { fr: 'Bonnes réponses (60 s)', en: 'Correct answers (60 s)' },
  },
}
