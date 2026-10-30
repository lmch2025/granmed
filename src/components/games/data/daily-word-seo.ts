import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu daily-word (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const dailyWordSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Un mot mystère de cinq lettres par jour : six tentatives, des indices couleur, une série à entretenir — et un QI estimé qui suit vos essais.',
    en: 'One mystery five-letter word a day: six tries, colour clues, a streak to keep alive — and an estimated IQ that tracks your guesses.',
  },
  description: {
    fr: [
      "Mot du Jour Santé est un jeu de mots gratuit en ligne, inspiré du Wordle, dans lequel vous devez découvrir un mot mystère de cinq lettres en six tentatives maximum. Après chaque essai, les lettres prennent une couleur : verte si la lettre est à la bonne place, orange si elle figure ailleurs dans le mot, grise si elle en est absente.",
      "Un nouveau mot est proposé chaque jour, différent en français et en anglais mais identique pour tous les joueurs d'une même langue : vous pouvez donc comparer vos résultats sans dévoiler le mot. Vos statistiques — parties jouées, victoires, séries consécutives, répartition du nombre d'essais — sont sauvegardées localement sur votre appareil, sans inscription. En fin de partie, un QI estimé — calculé à partir de votre précision (le nombre d'essais utilisés) et de la difficulté — vous attribue un niveau d'intelligence, du Novice au Génie, à élever au fil des mots.",
      "Un mode entraînement illimité, les archives des sept derniers jours et un partage du résultat en grille d'emojis complètent l'expérience : un rendez-vous quotidien de quelques minutes pour entretenir vocabulaire et logique.",
    ],
    en: [
      "Daily Word Game is a free online word game, inspired by Wordle, in which you must uncover a mystery five-letter word in six tries or fewer. After each guess, the letters change colour: green when the letter sits in the right spot, orange when it appears elsewhere in the word, grey when it is absent.",
      "A new word is offered every day — different in French and in English, but identical for every player of a given language — so you can compare results without spoiling the word. Your statistics (games played, wins, consecutive streaks, guess distribution) are saved locally on your device, with no sign-up. At the end of each game, an estimated IQ — computed from your accuracy (the number of guesses used) and the difficulty — assigns you an intelligence level, from Novice to Genius, to raise word after word.",
      "An unlimited practice mode, an archive of the last seven days and emoji-grid sharing round off the experience: a few daily minutes to keep your vocabulary and logic sharp.",
    ],
  },
  rules: {
    fr: [
      'Devinez le mot mystère de 5 lettres en 6 tentatives maximum.',
      'Saisissez un mot valide de 5 lettres puis validez avec Entrée.',
      'Vert : la lettre est bien placée. Orange : elle figure dans le mot, à une autre place. Gris : elle est absente du mot.',
      'Les lettres en double sont gérées comme au Wordle : chaque occurrence n’est validée qu’autant de fois qu’elle apparaît dans le mot.',
      'Le défi du jour est le même pour tous les joueurs d’une même langue ; seule une victoire quotidienne entretient votre série.',
      'Le mode entraînement est illimité et ne compte ni pour le défi du jour, ni pour la série.',
    ],
    en: [
      'Guess the 5-letter mystery word in 6 tries or fewer.',
      'Type a valid 5-letter word and submit it with Enter.',
      'Green: the letter is in the right spot. Orange: it is in the word, elsewhere. Grey: it is not in the word.',
      'Duplicate letters follow Wordle rules: each occurrence is only validated as many times as it appears in the word.',
      'The daily challenge is the same for every player of a given language; only a daily win keeps your streak alive.',
      'Practice mode is unlimited and counts neither for the daily challenge nor for the streak.',
    ],
  },
  controls: {
    fr: [
      'Clavier visuel : touchez les lettres, Entrée pour valider, ⌫ pour effacer.',
      'Clavier physique : saisissez directement les lettres (accents acceptés), Entrée pour valider, Retour arrière pour effacer.',
      'Disposition AZERTY en français, QWERTY en anglais.',
      'Après la partie, partagez votre résultat avec le bouton dédié.',
    ],
    en: [
      'On-screen keyboard: tap the letters, Enter to submit, ⌫ to delete.',
      'Physical keyboard: type letters directly (accents accepted), Enter to submit, Backspace to delete.',
      'AZERTY layout in French, QWERTY in English.',
      'Once the game is over, share your result with the dedicated button.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Défi quotidien déterministe : le même mot pour tous les joueurs d’une même langue, renouvelé chaque jour.',
      'Mode entraînement illimité avec des mots tirés au hasard parmi les réponses.',
      'Clavier AZERTY (français) ou QWERTY (anglais) à l’écran + clavier physique, accents acceptés.',
      'Statistiques complètes : parties, victoires, séries et répartition du nombre d’essais.',
      'Archives des 7 derniers jours : mot révélé si joué, et relecture en mode entraînement.',
      'Partage du résultat en grille d’emojis 🟩🟨⬜, sans jamais révéler le mot.',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      'Deterministic daily challenge: the same word for every player of a given language, refreshed daily.',
      'Unlimited practice mode with random words drawn from the answer list.',
      'On-screen AZERTY (French) or QWERTY (English) keyboard + physical keyboard, accents accepted.',
      'Full statistics: games, wins, streaks and guess distribution.',
      'Archive of the last 7 days: word revealed if played, replayable in practice mode.',
      'Emoji-grid sharing 🟩🟨⬜ that never reveals the word.',
    ],
  },
  tips: {
    fr: [
      'Commencez par un mot riche en voyelles (ADIEU, OCEAN, AUDIO) pour cerner la structure du mot.',
      'Exploitez chaque indice : les lettres grises sont définitivement exclues du mot.',
      'Méfiez-vous des lettres doublées : la couleur ne s’affiche qu’autant de fois que la lettre est présente.',
      'Variez les consonnes de vos premiers essais pour tester un maximum de lettres différentes.',
      'Entraînez-vous en mode libre pour mémoriser les mots de 5 lettres les plus fréquents.',
    ],
    en: [
      'Open with a vowel-heavy word (ADIEU, OCEAN, AUDIO) to map the word’s structure.',
      'Use every clue: grey letters are definitively excluded from the word.',
      'Watch out for duplicate letters: the colour only shows as many times as the letter appears.',
      'Vary the consonants in your early guesses to test as many different letters as possible.',
      'Practise in free mode to memorise the most common 5-letter words.',
    ],
  },
  faq: {
    fr: [
      {
        q: 'Le mot change-t-il tous les jours ?',
        a: 'Oui. Un nouveau mot est généré chaque jour à partir de la date, le même pour tous les joueurs d’une même langue. Le numéro du puzzle (#N) vous permet de comparer vos résultats.',
      },
      {
        q: 'Le mot est-il le même en français et en anglais ?',
        a: 'Non. Chaque langue a sa propre liste de réponses et donc son propre mot du jour, adapté à sa fréquence de lettres.',
      },
      {
        q: 'Que se passe-t-il si je rate le mot ?',
        a: 'Le mot du jour vous est révélé en fin de partie, votre série de victoires quotidiennes est remise à zéro, et il faudra attendre le mot de demain pour recommencer.',
      },
      {
        q: 'Le mode entraînement compte-t-il dans mes statistiques ?',
        a: 'Non. Les parties d’entraînement sont libres et illimitées : elles ne comptent ni pour le défi du jour, ni pour votre série, ni pour la répartition des essais.',
      },
      {
        q: 'Comment partager mon résultat sans spoiler ?',
        a: 'Après la partie, le bouton de partage copie une grille d’emojis 🟩🟨⬜ accompagnée de votre score (ex. « Mot du Jour #42 — 3/6 »). Le mot n’apparaît jamais.',
      },
      {
        q: 'Comment est calculé mon QI estimé ?',
        a: 'Votre QI estimé combine trois dimensions mesurées à la fin de la partie : la précision (le nombre d’essais utilisés pour trouver le mot — trouvé du premier coup, elle est maximale ; en six essais, elle chute), la difficulté de référence (mots de cinq lettres) et l’absence de pression de rapidité — un mot par jour, sans chronomètre. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu de mots — pas un test de QI clinique — et le meilleur moyen de l’élever reste de s’entraîner en mode libre pour affûter vos premières tentatives.',
      },
    ],
    en: [
      {
        q: 'Does the word change every day?',
        a: 'Yes. A new word is generated from the date, the same for every player of a given language. The puzzle number (#N) lets you compare results.',
      },
      {
        q: 'Is the word the same in French and in English?',
        a: 'No. Each language has its own answer list and therefore its own word of the day, suited to its letter frequency.',
      },
      {
        q: 'What happens if I miss the word?',
        a: 'The word is revealed at the end of the game, your daily win streak is reset, and you will have to wait for tomorrow’s word to try again.',
      },
      {
        q: 'Does practice mode count in my statistics?',
        a: 'No. Practice games are free and unlimited: they count neither for the daily challenge, nor for your streak, nor for the guess distribution.',
      },
      {
        q: 'How can I share my result without spoiling?',
        a: 'After the game, the share button copies an emoji grid 🟩🟨⬜ with your score (e.g. “Daily Word #42 — 3/6”). The word never appears.',
      },
      {
        q: 'How is my estimated IQ calculated?',
        a: 'Your estimated IQ combines three dimensions measured at the end of the game: accuracy (the number of guesses used to find the word — solved on the first try, it is maximal; in six guesses, it drops), the reference difficulty (five-letter words) and no time pressure — one word a day, with no timer. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this word game — not a clinical IQ test — and the best way to raise it is to practise in free mode to sharpen your opening guesses.',
      },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    wins: { fr: 'Victoires au défi du jour', en: 'Daily challenge wins' },
    'max-streak': { fr: 'Meilleure série de jours gagnés', en: 'Best winning day streak' },
  },
}
