import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu guess-the-idiom (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const guessTheIdiomSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Retrouvez cinq expressions populaires à partir de leur définition : précision, rapidité… et QI estimé à la clé.',
    en: 'Guess five popular idioms from their definitions: accuracy, speed… and an estimated IQ to match.',
  },
  description: {
    fr: [
      'Devine l’Expression est un jeu de mots et de culture gratuit en ligne dans lequel vous devez retrouver une expression populaire — comme « poser un lapin » ou « prendre le taureau par les cornes » — à partir de sa seule définition. Les lettres de l’expression sont cachées dans des cases : tapez votre réponse et les lettres correctes s’illuminent en direct.',
      'Chaque manche affiche la définition de l’expression, sa catégorie (animaux, nourriture, temps, corps, quotidien) et sa difficulté. Trois indices sont disponibles au prix de quelques points — révéler la première lettre, révéler une lettre au hasard ou afficher la lecture littérale de l’expression — et vous pouvez passer si vous séchez. Au bilan, un QI estimé — calculé à partir de votre précision, de votre rapidité et de la difficulté — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant. Après chaque manche, une carte « Le saviez-vous ? » raconte l’origine de l’expression.',
      'Le jeu existe en deux langues avec de vraies adaptations culturelles : la version française joue avec des expressions françaises, la version anglaise avec des idiomes anglais. Le défi du jour propose les mêmes trois expressions à tous les joueurs d’une même langue, une partie en cours est restaurée automatiquement, et vos records (meilleur score, expressions trouvées au total) sont sauvegardés sur votre appareil.',
    ],
    en: [
      'Guess the Idiom is a free online word and culture game in which you must identify a popular idiom — such as “to let the cat out of the bag” or “the ball is in your court” — from its definition alone. The letters of the expression are hidden in slots: type your answer and watch the correct letters light up live as you go.',
      'Each round shows the idiom’s definition, its category (animals, food, time, body, everyday life) and its difficulty. Three hints are available for a few points — reveal the first letter, reveal a random letter or display the literal word-by-word reading — and you can skip an expression if you are stuck. At the summary, an estimated IQ — computed from your accuracy, speed and the difficulty — assigns you an intelligence level, from Novice to Genius, to raise as you replay. After every round, a “Did you know?” card tells the story behind the idiom.',
      'The game is a genuine cultural adaptation: the French version plays with French idioms, the English version with English idioms. The daily challenge gives everyone the same three expressions, an unfinished game is restored automatically, and your records (best score, total idioms solved) are saved on your device.',
    ],
  },
  rules: {
    fr: [
      'Lisez la définition affichée et observez les cases : elles cachent les lettres de l’expression (espaces, apostrophes et tirets restent visibles).',
      'Composez votre réponse avec le clavier à l’écran ou votre clavier physique : chaque lettre correcte s’illumine, une lettre incorrecte s’affiche en rouge et tremble.',
      'Validez : la bonne réponse résout la manche. Une réponse complète mais fausse coûte 10 points ; une réponse incomplète n’en coûte aucun — continuez simplement.',
      'Utilisez les indices si besoin : première lettre (−20), lettre au hasard (−20), lecture littérale (−30).',
      'Une manche résolue rapporte 100 points, moins le coût des indices et des erreurs, plus un bonus de rapidité allant jusqu’à +20 si vous trouvez en moins de 15 secondes.',
      'Après chaque manche, lisez l’origine de l’expression puis passez à la suivante jusqu’au bilan final sur 5 manches (3 pour le défi du jour).',
    ],
    en: [
      'Read the definition and look at the slots: they hide the letters of the idiom (spaces, apostrophes and hyphens stay visible).',
      'Build your answer with the on-screen keyboard or your physical keyboard: each correct letter lights up, an incorrect one shows in red and shakes.',
      'Submit: the right answer solves the round. A complete but wrong answer costs 10 points; an incomplete one costs nothing — just keep typing.',
      'Use hints if needed: first letter (−20), random letter (−20), literal reading (−30).',
      'A solved round earns 100 points, minus hint costs and mistakes, plus a speed bonus of up to +20 if you solve it in under 15 seconds.',
      'After each round, read the origin of the idiom then move on until the final summary over 5 rounds (3 for the daily challenge).',
    ],
  },
  controls: {
    fr: [
      'Clavier à l’écran : touchez les lettres (AZERTY en français), ⌫ efface, Valider soumet — le clavier système n’est jamais ouvert sur mobile, la page ne saute pas.',
      'Clavier physique : tapez les lettres (accents acceptés, é = e, œ = oe), Retour arrière efface, Entrée valide puis passe à la manche suivante.',
      'Les espaces, apostrophes et tirets sont ignorés : seules les lettres comptent, elles remplissent les cases dans l’ordre.',
      'Souris / tactile : appuyez sur les boutons d’indices, Passer, puis Suivant pour changer de manche.',
    ],
    en: [
      'On-screen keyboard: tap the letters (QWERTY in English), ⌫ deletes, Submit validates — the system keyboard never opens on mobile, so the page never jumps.',
      'Physical keyboard: type letters (accents accepted, é = e), Backspace deletes, Enter submits then moves to the next round.',
      'Spaces, apostrophes and hyphens are ignored: only letters count, filling the slots in order.',
      'Mouse / touch: tap the hint buttons, Skip, then Next to move to the next round.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      '45 expressions françaises et 45 idiomes anglais : une vraie adaptation culturelle par langue.',
      'Clavier à l’écran AZERTY / QWERTY selon la langue, coloré en direct (vert, ambre, rouge) au fil de vos lettres.',
      'Révélation en direct des lettres au fil de la frappe, avec secousse en cas d’erreur et révélation animée à la fin de manche.',
      'Trois indices progressifs et un bouton Passer pour ne jamais rester bloqué.',
      'Carte « Le saviez-vous ? » après chaque manche : l’origine vérifiée de l’expression.',
      'Défi du jour de 3 expressions identiques pour tous les joueurs de la même langue, reprise automatique de la partie en cours.',
      'Records sauvegardés (meilleur score, expressions trouvées au total) et succès à débloquer.',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      '45 French idioms and 45 English idioms: a genuine cultural adaptation per language.',
      'On-screen AZERTY / QWERTY keyboard depending on the language, colored live (green, amber, red) as you type.',
      'Live letter reveal as you type, with a shake on mismatches and an animated reveal at the end of each round.',
      'Three progressive hints and a Skip button so you never stay stuck.',
      'A “Did you know?” card after each round: the verified origin of the idiom.',
      'A daily challenge of 3 identical expressions for everyone playing the same language, with automatic resume of an unfinished game.',
      'Saved records (best score, total idioms solved) and achievements to unlock.',
    ],
  },
  tips: {
    fr: [
      'Cherchez d’abord le verbe ou le nom le plus imagé de la définition : c’est souvent le cœur de l’expression.',
      'La catégorie (animaux, nourriture…) est un indice à elle seule : « avoir un chat dans la gorge » ne peut être que dans Animaux.',
      'Tapez une première version même incomplète : les lettres vertes confirment le début de l’expression, et une soumission incomplète ne coûte rien.',
      'Gardez la lecture littérale (−30) pour les expressions résistantes : elle révèle souvent l’image d’origine.',
      'Le bonus de rapidité (jusqu’à +20) récompense les intuitions bien senties : osez dès que vous avez une idée.',
    ],
    en: [
      'Look for the most vivid verb or noun in the definition: it is often the heart of the idiom.',
      'The category (animals, food…) is a hint in itself: start by ruling out impossible themes.',
      'Type a first guess even if incomplete: green letters confirm the start of the expression, and an incomplete submission costs nothing.',
      'Save the literal reading (−30) for stubborn idioms: it often reveals the original image.',
      'The speed bonus (up to +20) rewards well-aimed first instincts: trust your gut when you have one.',
    ],
  },
  faq: {
    fr: [
      { q: 'Le jeu Devine l’Expression est-il vraiment gratuit ?', a: 'Oui, le jeu est entièrement gratuit, sans inscription ni téléchargement, directement dans votre navigateur.' },
      { q: 'Les expressions sont-elles les mêmes en français et en anglais ?', a: 'Non : chaque langue joue avec ses propres expressions. La version française utilise des expressions françaises et la version anglaise des idiomes anglais — c’est une adaptation culturelle, pas une traduction.' },
      { q: 'Comment fonctionne le score ?', a: 'Chaque expression résolue rapporte 100 points, desquels sont retranchés le coût des indices utilisés (20 à 30 points) et 10 points par réponse complète incorrecte. Une réponse incomplète ne coûte rien. Un bonus de rapidité allant jusqu’à +20 points s’ajoute si vous trouvez en moins de 15 secondes.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Au bilan de la série, votre QI estimé combine trois dimensions : la précision (expressions résolues par rapport au total), la rapidité (les bonus de rapidité gagnés, mesurés sur la fenêtre de 15 secondes par expression) et la difficulté du jeu. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15) et vous attribue un niveau, du Novice au Génie. C’est une estimation ludique de votre performance à ce jeu de mots — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour deviner plus juste, plus vite et sans indices.' },
      { q: 'Que m’apprend la carte « Le saviez-vous ? » ?', a: 'Après chaque manche, elle affiche l’origine historique vérifiée de l’expression. Quand cette origine est débattue ou incertaine, une phrase de remplacement vous l’indique honnêtement.' },
      { q: 'Puis-je rejouer au défi du jour ?', a: 'Vous pouvez le rejouer pour le plaisir, mais les trois expressions du jour restent les mêmes et le défi n’est compté qu’une seule fois : une relecture ne rajoute ni victoire, ni XP.' },
      { q: 'Ma partie est-elle sauvegardée si je ferme la page ?', a: 'Oui : la manche en cours (lettres déjà tapées, indices, score) est restaurée automatiquement le même jour quand vous rouvrez le jeu. Le lendemain, une nouvelle partie vous attend.' },
    ],
    en: [
      { q: 'Is Guess the Idiom really free?', a: 'Yes, the game is completely free, with no sign-up or download, straight in your browser.' },
      { q: 'Are the expressions the same in French and English?', a: 'No: each language plays with its own idioms. The French version uses French expressions and the English version English idioms — a cultural adaptation, not a translation.' },
      { q: 'How does scoring work?', a: 'Each solved idiom earns 100 points, minus the cost of the hints used (20 to 30 points) and 10 points per complete but wrong submission. An incomplete answer costs nothing. A speed bonus of up to +20 is added if you solve it in under 15 seconds.' },
      { q: 'How is my estimated IQ calculated?', a: 'At the end of the series, your estimated IQ combines three dimensions: accuracy (idioms solved out of the total), speed (the speed bonuses you earned, measured over the 15-second window per expression) and the game’s difficulty. The result maps onto the classic IQ scale (mean 100, standard deviation 15) and assigns you a level, from Novice to Genius. It is a playful estimate of your performance at this word game — not a clinical IQ test — and the best way to raise it is to keep playing to guess more accurately, faster and without hints.' },
      { q: 'What does the “Did you know?” card teach me?', a: 'After each round it shows the verified historical origin of the idiom. When that origin is debated or uncertain, an honest fallback sentence tells you so.' },
      { q: 'Can I replay the daily challenge?', a: 'You can replay it for fun, but the three expressions of the day stay the same and the challenge only counts once: a replay adds neither a win nor XP.' },
      { q: 'Is my game saved if I close the page?', a: 'Yes: the round in progress (letters already typed, hints, score) is automatically restored the same day when you reopen the game. The next day, a fresh game awaits.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-score': { fr: 'Meilleur score', en: 'Best score' },
    'total-solved': { fr: 'Expressions trouvées (total)', en: 'Idioms solved (total)' },
  },
}
