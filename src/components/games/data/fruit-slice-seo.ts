import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu fruit-slice (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const fruitSliceSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Tranchez les fruits du verger d’un geste fluide, enchaînez les combos et révélez votre QI estimé — savons interdits.',
    en: 'Slice the orchard fruits with a fluid swipe, chain combos and reveal your estimated IQ — soaps forbidden.',
  },
  description: {
    fr: [
      'Le Verger de Gran (Fruit Slice) est un jeu d’action et de réflexes gratuit dans lequel vous découpez au doigt les fruits projetés depuis le bas de l’écran. Balayez l’écran comme un couteau : chaque fruit traversé par votre geste se coupe en deux moitiés qui volent.',
      'Les fruits montent en arcs paraboliques, par vagues de 1 à 4, de plus en plus rapides. La pastèque géante rapporte 30 points, et trancher 3 fruits ou plus dans un même geste déclenche un combo bonus (×10 points par fruit). Attention aux savons 🧼 interdits : en couper un coûte une vie, et vous n’en avez que trois. Au game over, un QI estimé — calculé à partir de la précision de votre session et de la difficulté — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'Laisser tomber un fruit n’enlève rien : il casse simplement votre combo. Le jeu s’accélère progressivement, vos records de score et de combo sont sauvegardés sur votre appareil, et un défi du jour déterministe vous donne un objectif de points différent chaque matin.',
    ],
    en: [
      'Gran’s Orchard (Fruit Slice) is a free action and reflex game in which you slice with your finger the fruits tossed up from the bottom of the screen. Swipe across the game like a knife: every fruit crossed by your gesture splits into two flying halves.',
      'Fruits rise in parabolic arcs, in waves of 1 to 4, faster and faster. The giant watermelon is worth 30 points, and slicing 3 or more fruits within one continuous swipe triggers a combo bonus (×10 points per fruit). Watch out for the forbidden soaps 🧼: slicing one costs a life, and you only have three. On game over, an estimated IQ — computed from your session accuracy and the difficulty — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'Letting a fruit fall costs nothing: it merely breaks your combo. The game speeds up progressively, your score and combo records are saved on your device, and a deterministic daily challenge gives you a fresh points goal every morning.',
    ],
  },
  rules: {
    fr: [
      'Balayez l’écran avec le doigt (ou la souris) pour trancher : le geste doit être rapide pour couper.',
      'Chaque fruit tranché rapporte 10 points ; la pastèque géante 🍉 en rapporte 30.',
      'Tranchez 3 fruits ou plus en un seul geste (moins de 350 ms entre chaque coupe) : bonus de combo ×10 points par fruit.',
      'Ne tranchez jamais les savons 🧼 : chaque savon coupé coûte une vie (3 vies au total).',
      'Un fruit qui retombe entier n’enlève rien : il casse seulement votre combo.',
      'La partie s’arrête à 0 vie : le score final devient votre record.',
    ],
    en: [
      'Swipe across the screen with your finger (or the mouse) to slice: the gesture must be fast to cut.',
      'Each sliced fruit is worth 10 points; the giant watermelon 🍉 is worth 30.',
      'Slice 3 or more fruits in a single gesture (under 350 ms between cuts): combo bonus of ×10 points per fruit.',
      'Never slice the soaps 🧼: each soap cut costs a life (3 lives in total).',
      'A fruit falling off the screen whole costs nothing: it only breaks your combo.',
      'The game ends at 0 lives: the final score becomes your record.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : balayez l’écran avec un doigt, comme un couteau — l’aire de jeu ne fait jamais défiler la page.',
      'Ordinateur : cliquez et tirez un trait rapide avec la souris.',
      'Un geste lent ne coupe pas : la vitesse fait la lame.',
      'Barre de jeu : bouton Recommencer disponible à tout moment pendant la partie.',
    ],
    en: [
      'Mobile & tablet: swipe across the screen with one finger, like a knife — the play area never scrolls the page.',
      'Desktop: click and drag a fast line with the mouse.',
      'A slow gesture does not cut: speed makes the blade.',
      'Game bar: a Restart button is available at any time during a run.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Découpe au doigt avec trainée lumineuse, éclat de lame et jus de fruits',
      '9 fruits dont la pastèque géante à 30 points, dimensionnés à l’écran',
      'Combos : bonus ×10 points par fruit au-delà de 3 en un geste',
      'Savons piégés à éviter : 3 vies, flash rouge et secousse à l’erreur',
      'Vagues de plus en plus rapides et fréquentes',
      'Records de score et de combo sauvegardés + défi du jour déterministe',
      'Retour haptique léger sur chaque coupe et célébration de record',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      'Finger slicing with a glowing trail, blade flash and fruit juice',
      '9 fruits including the 30-point giant watermelon, sized to your screen',
      'Combos: ×10 bonus points per fruit past 3 in one swipe',
      'Trap soaps to avoid: 3 lives, red flash and shake on mistake',
      'Waves that get faster and more frequent',
      'Saved score and combo records + deterministic daily challenge',
      'Light haptic feedback on every cut and a record celebration',
    ],
  },
  tips: {
    fr: [
      'Balayez en travers d’une vague entière plutôt que fruit par fruit : les combos font décoller le score.',
      'Repérez les savons avant de balayer : leur violet-rose se distingue des fruits au sommet de l’arc, quand tout ralentit.',
      'Les fruits sont plus lents au sommet de leur arc : c’est le meilleur moment pour trancher plusieurs fruits d’un geste.',
      'Gardez un œil sur vos vies, pas sur le score : la prudence avec les savons prolonge toujours les parties.',
    ],
    en: [
      'Sweep across a whole wave rather than fruit by fruit: combos make the score take off.',
      'Spot the soaps before swiping: their pink stands out from the fruits at the top of the arc, when everything slows down.',
      'Fruits are slowest at the top of their arc: it is the best moment to slice several with one gesture.',
      'Watch your lives, not the score: caution with soaps always makes games last longer.',
    ],
  },
  faq: {
    fr: [
      { q: 'Que se passe-t-il quand un fruit tombe sans être tranché ?', a: 'Rien de grave : vous ne perdez ni points ni vie. Seul votre combo en cours est remis à zéro, ce qui vous encourage à trancher la vague suivante en un seul geste.' },
      { q: 'Comment fonctionne le combo ?', a: 'Chaque coupe effectuée moins de 350 ms après la précédente augmente le compteur. À partir de 3 fruits, chaque coupe supplémentaire rapporte un bonus de 10 points × le nombre de fruits du combo, affiché en « COMBO ×N ».' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'À la fin de la partie, votre QI estimé mesure la précision réelle de votre session : votre score est rapporté au par d’une manche d’arcade brillante (200 points — la victoire se joue à 150, la manche de trois étoiles à 300), en tenant compte de la difficulté croissante des vagues. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15) et vous attribue un niveau, du Novice au Génie. C’est une estimation ludique de votre performance à ce jeu d’action — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour trancher plus juste et plus longtemps.' },
      { q: 'Les savons apparaissent-ils dès le début ?', a: 'Non : ils apparaissent après environ 8 secondes, dans environ une projection sur huit. Leur proportion n’augmente pas avec le temps — seule la cadence du jeu augmente.' },
      { q: 'Le jeu devient-il trop rapide ?', a: 'La cadence et la fréquence des vagues augmentent progressivement et plafonnent après quelques minutes : le jeu reste jouable longtemps, sans mur de difficulté.' },
      { q: 'Puis-je jouer sans regarder les savons ?', a: 'Mieux vaut ne pas : chaque savon tranché coûte une vie. Mais un savon qui retombe intact ne pénalise en rien — pas même votre combo — l’ignorer complètement est une stratégie valide.' },
    ],
    en: [
      { q: 'What happens when a fruit falls unsliced?', a: 'Nothing bad: you lose neither points nor a life. Only your current combo resets, which encourages you to slice the next wave in one gesture.' },
      { q: 'How does the combo work?', a: 'Every cut made less than 350 ms after the previous one increases the counter. From 3 fruits up, each extra cut earns a bonus of 10 points × the number of fruits in the combo, shown as “COMBO ×N”.' },
      { q: 'How is my estimated IQ calculated?', a: 'At the end of the run, your estimated IQ measures the real accuracy of your session: your score is compared against the par of a brilliant arcade run (200 points — the win line sits at 150, the three-star round at 300), weighted by the rising difficulty of the waves. The result maps onto the classic IQ scale (mean 100, standard deviation 15) and assigns you a level, from Novice to Genius. It is a playful estimate of your performance at this action game — not a clinical IQ test — and the best way to raise it is to keep playing to slice sharper and last longer.' },
      { q: 'Do soaps appear from the start?', a: 'No: they show up after about 8 seconds, in roughly one toss out of eight. Their share does not grow over time — only the game pace does.' },
      { q: 'Does the game get too fast?', a: 'Wave pace and frequency rise gradually and cap after a few minutes: the game stays playable for a long time, with no difficulty wall.' },
      { q: 'Can I play while ignoring the soaps?', a: 'Best not to: every sliced soap costs a life. But a soap falling back untouched penalizes nothing at all — not even your combo — so fully ignoring them is a valid strategy.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-score': { fr: 'Meilleur score', en: 'Best score' },
    'best-combo': { fr: 'Meilleur combo', en: 'Best combo' },
  },
}
