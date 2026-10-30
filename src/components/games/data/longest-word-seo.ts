import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu longest-word (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const longestWordSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Touchez les 9 lettres tirées pour former un maximum de mots en 60 secondes — et révéler votre QI estimé.',
    en: 'Tap the 9 drawn letters to build as many words as you can in 60 seconds — and reveal your estimated IQ.',
  },
  description: {
    fr: [
      'Le Mot le Plus Long est un jeu de lettres gratuit en ligne dans lequel vous recevez neuf lettres et devez former un maximum de mots valides en 60 secondes. Chaque mot rapporte des points proportionnels à sa longueur : un mot de 5 lettres vaut 5 points, un mot de 8 lettres compte double (16 points) et un mot utilisant les 9 lettres vaut 45 points. Répondez vite : chaque mot validé moins de 5 secondes après le précédent rapporte 2 points bonus.',
      'À chaque partie, le tirage garantit au moins 3 voyelles et 3 consonnes, avec des fréquences proches des distributions du Scrabble, et il est rejoué jusqu’à proposer de vraies solutions. Sur mobile comme sur ordinateur, composez vos mots en touchant les grosses pastilles de lettres ou directement au clavier physique : aucun champ de texte n’est utilisé, le clavier du système ne s’ouvre jamais et il est impossible de coller un mot tout fait. La validation vérifie la longueur minimale de 3 lettres, la disponibilité des lettres (doublons compris) et la présence du mot dans le dictionnaire de la langue. Au buzzer, un QI estimé — calculé à partir de votre précision et de la difficulté — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'Le jeu existe en deux langues avec des banques de mots distinctes (plus de 1 600 mots courants en français, plus de 5 400 en anglais) : la version française joue en français, la version anglaise en anglais. Le défi du jour propose le même tirage à tous les joueurs d’une même langue, la pause est automatique si vous changez d’onglet, et vos records (meilleur score, longueur du mot le plus long) sont sauvegardés sur votre appareil.',
    ],
    en: [
      'The Longest Word is a free online word game in which you receive nine letters and must build as many valid words as you can in 60 seconds. Each word scores points based on its length: a 5-letter word is worth 5 points, an 8-letter word counts double (16 points) and a word using all 9 letters is worth 45 points. Answer fast: every word validated less than 5 seconds after the previous one earns a 2-point bonus.',
      'Every draw guarantees at least 3 vowels and 3 consonants, with frequencies close to Scrabble distributions, and is redrawn until it offers real solutions. On mobile and desktop alike, you compose words by tapping the big letter tiles or typing on your physical keyboard: no text field is used, the system keyboard never opens and pasting a ready-made word is impossible. Validation checks the 3-letter minimum, letter availability (duplicates included) and the presence of the word in the language’s dictionary. At the buzzer, an estimated IQ — computed from your accuracy and the difficulty — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'The game comes in two languages with separate word banks (over 1,600 common words in French, over 5,400 in English): the French version plays in French, the English version in English. The daily challenge gives everyone the same draw, the countdown pauses automatically when you switch tabs, and your records (best score, longest word length) are saved on your device.',
    ],
  },
  rules: {
    fr: [
      'Observez les 9 lettres tirées : le tirage contient toujours au moins 3 voyelles et 3 consonnes.',
      'Composez un mot de 3 lettres minimum en touchant les pastilles (ou en tapant au clavier) : chaque lettre ne peut servir qu’autant de fois qu’elle apparaît dans le tirage.',
      'Appuyez sur Entrée ou sur le bouton Valider : si le mot est valide et pas déjà trouvé, il rejoint votre liste et rapporte des points.',
      'Un mot de 8 lettres compte double (16 points) ; un mot de 9 lettres utilise tout le tirage et vaut 45 points ; un mot validé moins de 5 secondes après le précédent gagne 2 points bonus.',
      'Vous avez 60 secondes : les 5 dernières sont signalées par un tic-tac. À la fin, découvrez votre score, le meilleur mot possible du tirage et le récapitulatif complet.',
    ],
    en: [
      'Look at the 9 drawn letters: every draw contains at least 3 vowels and 3 consonants.',
      'Build a word of at least 3 letters by tapping the tiles (or typing on your keyboard): each letter can only be used as many times as it appears in the draw.',
      'Press Enter or the Submit button: if the word is valid and not already found, it joins your list and scores points.',
      'An 8-letter word counts double (16 points); a 9-letter word uses the whole draw and is worth 45 points; a word validated less than 5 seconds after the previous one earns a 2-point bonus.',
      'You have 60 seconds: the last 5 are flagged by a ticking sound. At the end, see your score, the best possible word of the draw and the full recap.',
    ],
  },
  controls: {
    fr: [
      'Tactile / souris : touchez les pastilles de lettres pour composer le mot, ⌫ efface la dernière lettre, ✓ valide le mot.',
      'Clavier : tapez les lettres du tirage (accents acceptés, é = e), Retour arrière efface, Entrée valide.',
      'Aucun champ de texte : le clavier virtuel du système ne s’ouvre jamais sur mobile et le copier-coller d’un mot complet est impossible.',
    ],
    en: [
      'Touch / mouse: tap the letter tiles to compose the word, ⌫ deletes the last letter, ✓ submits the word.',
      'Keyboard: type the letters of the draw (accents accepted, é = e), Backspace deletes, Enter submits.',
      'No text field: the system virtual keyboard never opens on mobile and pasting a whole word is impossible.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Tirage pondéré équilibré : 3 à 6 voyelles garanties, fréquences inspirées du Scrabble, re-tirage jusqu’à garantir au moins 5 mots possibles dont un de 5 lettres ou plus.',
      'Compte à rebours de 60 secondes avec tic-tac sur les 5 dernières et pause automatique si vous changez d’onglet.',
      'Validation instantanée avec raison claire : trop court, lettres indisponibles, absent du dictionnaire ou déjà trouvé.',
      'Bonus spéciaux : mot de 8 lettres ×2, mot de 9 lettres ×5 avec célébration, bonus de rapidité de 2 points.',
      'Fin de manche : solution avec le meilleur mot possible du tirage, récapitulatif des mots trouvés et Rejouer immédiat.',
      'Défi du jour déterministe (même tirage pour tous les joueurs de la langue), partageable, records et succès sauvegardés.',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      'Balanced weighted draw: 3 to 6 guaranteed vowels, Scrabble-inspired frequencies, redrawn until at least 5 words are possible, including one of 5 letters or more.',
      '60-second countdown with ticking on the last 5 seconds and automatic pause when you switch tabs.',
      'Instant validation with a clear reason: too short, letters unavailable, not in the dictionary or already found.',
      'Special bonuses: 8-letter word ×2, 9-letter word ×5 with a celebration, and a 2-point speed bonus.',
      'Round end: solution with the best possible word of the draw, recap of the words you found and instant replay.',
      'Deterministic daily challenge (same draw for everyone in the language), shareable, saved records and achievements.',
    ],
  },
  tips: {
    fr: [
      'Commencez par repérer les terminaisons fréquentes (-ER, -TION, -MENT en français ; -ING, -ED, -ER en anglais) : elles débloquent des mots longs.',
      'Enchaînez vite : un mot validé moins de 5 secondes après le précédent rapporte 2 points bonus — trois mots courts rapides valent mieux qu’une longue hésitation.',
      'Les pluriels et conjugaisons courantes sont souvent dans le dictionnaire : testez les déclinaisons d’un mot déjà trouvé.',
      'Gardez un œil sur les lettres doublées : elles permettent des doubles consonnes (LL, NN, SS…) souvent décisives.',
      'Si un mot de 9 lettres vous échappe à la fin, tentez un 8 lettres : compté double, il reste très rentable.',
    ],
    en: [
      'Start by spotting common endings (-ING, -ED, -ER, -TION): they unlock long words.',
      'Keep the pace: a word validated less than 5 seconds after the previous one earns a 2-point bonus — three quick short words beat one long hesitation.',
      'Common plurals and inflections are often in the dictionary: test variations of a word you already found.',
      'Keep an eye on doubled letters: they enable double consonants (LL, NN, SS…) that are often decisive.',
      'If a 9-letter word escapes you at the end, try an 8-letter one: counted double, it stays very profitable.',
    ],
  },
  faq: {
    fr: [
      { q: 'Le jeu Le Mot le Plus Long est-il vraiment gratuit ?', a: 'Oui, le jeu est entièrement gratuit, sans inscription ni téléchargement, directement dans votre navigateur.' },
      { q: 'Comment jouer sur mobile ?', a: 'Touchez simplement les pastilles de lettres : le jeu utilise son propre clavier de tirage, sans champ de texte. Le clavier du système ne s’ouvre jamais, la page ne saute pas, et il est impossible de coller un mot complet. ⌫ efface la dernière lettre, ✓ valide.' },
      { q: 'Pourquoi mon mot est-il refusé ?', a: 'Un mot refusé est soit trop court (3 lettres minimum), soit composé de lettres indisponibles dans le tirage, soit absent du dictionnaire du jeu, soit déjà trouvé. Le motif exact s’affiche sous la zone de saisie.' },
      { q: 'Comment les points sont-ils calculés ?', a: 'Chaque mot vaut sa longueur en points. Un mot de 8 lettres compte double (16 points) et un mot de 9 lettres, qui utilise tout le tirage, vaut 45 points. Enfin, chaque mot validé moins de 5 secondes après le précédent rapporte 2 points bonus de rapidité.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'À la fin du compte à rebours, votre QI estimé mesure la richesse de votre moisson de mots : le nombre de mots trouvés est rapporté au par de 8 mots en 60 secondes, en tenant compte de la difficulté du jeu. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15) et vous attribue un niveau, du Novice au Génie. C’est une estimation ludique de votre performance à ce jeu de lettres — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour trouver plus de mots, plus longs, plus vite.' },
      { q: 'Les accents sont-ils acceptés ?', a: 'Oui : la saisie normalise automatiquement les accents (é, è, à, ç…), le dictionnaire étant stocké sans accents. « clé » se tape donc indifféremment « cle » ou « clé ».' },
      { q: 'Le défi du jour est-il identique pour tous ?', a: 'Oui : le tirage du jour est généré de façon déterministe, donc identique pour tous les joueurs de la même langue. Il est validé dès que vous trouvez au moins un mot.' },
    ],
    en: [
      { q: 'Is The Longest Word really free?', a: 'Yes, the game is completely free, with no sign-up or download, straight in your browser.' },
      { q: 'How do I play on mobile?', a: 'Simply tap the letter tiles: the game uses its own draw keyboard, with no text field. The system keyboard never opens, the page never jumps, and pasting a whole word is impossible. ⌫ deletes the last letter, ✓ submits.' },
      { q: 'Why is my word rejected?', a: 'A rejected word is either too short (3 letters minimum), uses letters unavailable in the draw, is missing from the game dictionary, or has already been found. The exact reason is displayed under the input area.' },
      { q: 'How are points calculated?', a: 'Each word is worth its length in points. An 8-letter word counts double (16 points) and a 9-letter word, using the whole draw, is worth 45 points. On top of that, every word validated less than 5 seconds after the previous one earns a 2-point speed bonus.' },
      { q: 'How is my estimated IQ calculated?', a: 'When the countdown ends, your estimated IQ measures the richness of your word harvest: the number of words you found is compared against the par of 8 words in 60 seconds, weighted by the game’s difficulty. The result maps onto the classic IQ scale (mean 100, standard deviation 15) and assigns you a level, from Novice to Genius. It is a playful estimate of your performance at this word game — not a clinical IQ test — and the best way to raise it is to keep playing to find more words, longer ones, faster.' },
      { q: 'Are accents accepted?', a: 'Yes: input automatically normalizes accents (é, è, à, ç…), the dictionary being stored without accents. You can type “cafe” or “café” alike.' },
      { q: 'Is the daily challenge the same for everyone?', a: 'Yes: the daily draw is generated deterministically, so it is identical for every player of the same language. It counts as complete as soon as you find at least one word.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-score': { fr: 'Meilleur score', en: 'Best score' },
    'longest-word': { fr: 'Mot le plus long (lettres)', en: 'Longest word (letters)' },
  },
}
