import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu health-true-false (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const healthTrueFalseSeoContent: GameSEOContent = {
  tagline: {
    fr: '48 affirmations santé sourcées à juger Vrai ou Faux : nutrition, sommeil, hydratation, activité, hygiène — et un QI estimé au bilan.',
    en: 'Judge 48 sourced health statements true or false: nutrition, sleep, hydration, activity and hygiene — plus an estimated IQ at the results screen.',
  },
  description: {
    fr: [
      'Vrai ou Faux — Santé est un jeu de quiz gratuit en ligne qui vous demande de juger des affirmations sur la santé : chaque phrase, tirée d’un corpus de 48 affirmations vérifiées, doit être marquée vraie ou fausse. Nutrition, sommeil, hydratation, activité physique, hygiène et idées reçues y passent au peigne fin.',
      'Chaque réponse déclenche une explication pédagogique de deux à trois phrases, appuyée par une source institutionnelle (OMS, NHS, Inserm, Harvard Health, ANSES…). Le jeu propose une série du jour identique pour tous les joueurs et une série rapide mélangée, sans chronomètre, pour apprendre à son rythme. Au bilan, un QI estimé — calculé à partir de votre précision sur la série — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'Les scores, séries de bonnes réponses et étoiles alimentent votre parcours Granmed : XP, records personnels et succès viennent récompenser votre culture santé, au fil d’une série de 12 affirmations par partie.',
    ],
    en: [
      'True or False — Health is a free online quiz game that asks you to judge health statements: each sentence, drawn from a corpus of 48 fact-checked statements, must be marked true or false. Nutrition, sleep, hydration, physical activity, hygiene and common myths all come under scrutiny.',
      'Every answer unlocks a two-to-three sentence educational explanation, backed by an institutional source (WHO, NHS, Inserm, Harvard Health, ANSES…). The game offers a daily series that is identical for every player, plus a shuffled quick series, with no timer — learn at your own pace. At the results screen, an estimated IQ — computed from your accuracy across the series — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'Scores, correct-answer streaks and stars feed your Granmed journey: XP, personal bests and achievements reward your health knowledge over a 12-statement series per game.',
    ],
  },
  rules: {
    fr: [
      'Choisissez un mode : la série du jour (12 affirmations identiques pour tous) ou une série rapide mélangée.',
      'Lisez l’affirmation affichée, avec sa catégorie et sa difficulté.',
      'Décidez si elle est vraie ou fausse, puis touchez le gros bouton VRAI ou FAUX.',
      'La correction s’affiche immédiatement : explication et source institutionnelle.',
      'Poursuivez les 12 affirmations : chaque bonne réponse vaut 1 point et alimente votre série.',
      'Terminez avec 10 bonnes réponses ou plus pour décrocher les 3 étoiles et la victoire.',
    ],
    en: [
      'Pick a mode: the daily series (12 statements, identical for everyone) or a shuffled quick series.',
      'Read the statement shown, along with its category and difficulty.',
      'Decide whether it is true or false, then tap the big TRUE or FALSE button.',
      'The correction appears immediately: explanation and institutional source.',
      'Work through the 12 statements: each correct answer is worth 1 point and feeds your streak.',
      'Finish with 10 or more correct answers to earn 3 stars and the win.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez les gros boutons VRAI ou FAUX, puis « Suivant ».',
      'Ordinateur : cliquez sur les boutons, ou utilisez ← ou V pour vrai, → ou F pour faux, Entrée pour continuer.',
      'L’icône maison dans la barre de jeu permet d’abandonner une série en cours (aucune récompense).',
      'Le jeu est sans chronomètre : prenez le temps de réfléchir.',
    ],
    en: [
      'Mobile & tablet: tap the big TRUE or FALSE buttons, then “Next”.',
      'Desktop: click the buttons, or use ← or T for true, → or F for false, Enter to continue.',
      'The home icon in the game bar lets you abandon a series in progress (no rewards).',
      'The game has no timer: take all the time you need to think.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      '48 affirmations bilingues fondées sur les repères des agences de santé publiques',
      'Explications pédagogiques avec source (OMS, NHS, Inserm, Harvard Health, ANSES…)',
      'Série du jour déterministe, identique pour tous les joueurs',
      'Série rapide aléatoire équilibrée, sans répétition immédiate des 20 dernières affirmations',
      'Séries de bonnes réponses, étoiles, XP et records personnels',
      'Retour haptique léger à chaque réponse (appareils compatibles)',
      'Jeu sans chronomètre, pensé pour apprendre tranquillement',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      '48 bilingual statements grounded in public-health agency guidance',
      'Educational explanations with sources (WHO, NHS, Inserm, Harvard Health, ANSES…)',
      'Deterministic daily series, identical for every player',
      'Balanced random quick series with no immediate repeat of the last 20 statements',
      'Correct-answer streaks, stars, XP and personal bests',
      'Gentle haptic feedback on every answer (on supported devices)',
      'Untimed game designed for relaxed learning',
    ],
  },
  tips: {
    fr: [
      'Méfiez-vous des mots absolus : « toujours », « jamais », « automatiquement » cachent souvent une exagération.',
      'Les repères chiffrés officiels (400 g de fruits et légumes, 150 minutes par semaine, 20 secondes de lavage des mains) sont souvent vrais : mémorisez-les.',
      'Demandez-vous ce que disent les grandes agences de santé plutôt que les anecdotes personnelles.',
      'Lisez les explications même quand vous avez juste : c’est là que l’on apprend le plus.',
      'Une série de bonnes réponses se construit sur les questions faciles : ne précipitez pas votre lecture.',
    ],
    en: [
      'Watch out for absolute words: “always”, “never”, “automatically” often hide an exaggeration.',
      'Official numbers (400 g of fruit and veg, 150 minutes a week, 20 seconds of handwashing) are usually true: memorise them.',
      'Ask what major health agencies say rather than relying on personal anecdotes.',
      'Read the explanations even when you’re right: that’s where you learn the most.',
      'A correct-answer streak is built on the easy questions: don’t rush your reading.',
    ],
  },
  faq: {
    fr: [
      { q: 'Les affirmations sont-elles fiables ?', a: 'Oui : chacune s’appuie sur les repères d’institutions de santé publique (OMS, NHS, Inserm, Harvard Health, ANSES…). Le jeu reste informatif et ne remplace pas un avis médical.' },
      { q: 'La série du jour est-elle la même pour tous ?', a: 'Oui. Elle est générée de façon déterministe à partir de la date : tous les joueurs voient les mêmes 12 affirmations jusqu’au lendemain.' },
      { q: 'Combien de temps dure une partie ?', a: 'Une série compte 12 affirmations sans chronomètre : comptez environ 3 à 5 minutes, le temps de lire les explications.' },
      { q: 'Comment gagner les 3 étoiles ?', a: 'Il faut au moins 10 bonnes réponses sur 12. À 8, vous obtenez 2 étoiles ; à 6, 1 étoile. Un sans-faute déclenche en plus les confettis.' },
      { q: 'Ce jeu peut-il remplacer un conseil médical ?', a: 'Non. C’est un jeu de culture générale santé : pour toute question personnelle, adressez-vous à un professionnel de santé.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé reflète avant tout votre précision : les bonnes réponses sur les 12 affirmations de la série. Le jeu étant volontairement sans chronomètre, la rapidité n’entre pas en compte, et la difficulté de référence est celle du quiz de culture santé. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour ancrer les repères santé.' },
    ],
    en: [
      { q: 'Are the statements reliable?', a: 'Yes: each one builds on guidance from public-health institutions (WHO, NHS, Inserm, Harvard Health, ANSES…). The game is informational and does not replace medical advice.' },
      { q: 'Is the daily series the same for everyone?', a: 'Yes. It is generated deterministically from the date: every player sees the same 12 statements until tomorrow.' },
      { q: 'How long does a game last?', a: 'A series has 12 untimed statements: expect about 3 to 5 minutes, including time to read the explanations.' },
      { q: 'How do I earn 3 stars?', a: 'You need at least 10 correct answers out of 12. At 8 you get 2 stars; at 6, 1 star. A flawless run also triggers the confetti.' },
      { q: 'Can this game replace medical advice?', a: 'No. It is a health general-knowledge game: for any personal question, please see a healthcare professional.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ primarily reflects your accuracy: the correct answers across the 12 statements of the series. Since the game is deliberately untimed, speed does not come into play, and the reference difficulty is that of the health-knowledge quiz. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this game — not a clinical IQ test — and the best way to raise it is to keep playing to anchor the health guidelines.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-score': { fr: 'Meilleur score — série de 12', en: 'Best score — 12-question series' },
    'best-streak': { fr: 'Plus longue série de bonnes réponses', en: 'Longest correct-answer streak' },
  },
}
