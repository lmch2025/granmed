import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu fire-escape (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const fireEscapeSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Montez toujours plus haut à travers les flammes, d’un seul geste — et révélez votre QI estimé à chaque chute.',
    en: 'Climb ever higher through the flames with a single gesture — and reveal your estimated IQ with every crash.',
  },
  description: {
    fr: [
      'Le Pompier de Gran (Fire Escape) est un jeu de réflexes vertical gratuit dans lequel vous guidez un pompier qui escalade un immeuble en flammes. Maintenez l’écran pour activer la propulsion et grimper, relâchez pour retomber : toute la partie se joue avec un seul doigt.',
      'Des flammes jaillissent des murs de gauche et de droite en laissant toujours un couloir franchissable, de plus en plus étroit avec l’altitude. À partir de 150 m, des poutres brûlantes balayent horizontalement le couloir. Collectez les gouttes d’eau pour 50 points bonus chacune. Le score se mesure en mètres gravitis. En fin de course, un QI estimé — fonction de la distance atteinte, rapportée au par de 600 mètres — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'La vitesse de montée augmente doucement avec la distance : le jeu reste prévisible, jamais injuste. Chaque palier de 100 m est célébré, votre record de distance est sauvegardé sur votre appareil, avec un défi du jour différent chaque matin et des succès à débloquer (500 m, 1 500 m).',
    ],
    en: [
      'Gran’s Firefighter (Fire Escape) is a free vertical reflex game in which you steer a firefighter climbing a burning building. Hold the screen to fire the thruster and rise, release to fall: the whole game plays with a single finger.',
      'Flames jut out from the left and right walls, always leaving a passable corridor that narrows with altitude. From 150 m up, burning beams sweep horizontally across the corridor. Collect water drops for 50 bonus points each. Your score is measured in meters climbed. At the end of each run, an estimated IQ — based on the distance you reached, measured against a 600-metre par — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'The climb speed rises gently with distance: the game stays predictable, never unfair. Every 100 m milestone is celebrated, your distance record is saved on your device, along with a different daily challenge every morning and achievements to unlock (500 m, 1,500 m).',
    ],
  },
  rules: {
    fr: [
      'Maintenez l’écran (ou la barre d’espace) : le pompier monte.',
      'Relâchez : il retombe sous l’effet de la gravité.',
      'Glissez horizontalement tout en maintenant pour vous déplacer à gauche ou à droite — le déplacement est relatif, le pompier ne saute jamais sous votre doigt.',
      'Passez dans les couloirs laissés libres entre les flammes des deux murs.',
      'Ramassez les gouttes d’eau 💧 : +50 points chacune.',
      'Évitez les flammes, les poutres balayantes et le brasier du bas de l’écran.',
      'Le score se compte en mètres : la vitesse augmente doucement avec l’altitude, et chaque palier de 100 m est célébré.',
    ],
    en: [
      'Hold the screen (or the space bar): the firefighter rises.',
      'Release: gravity pulls him back down.',
      'Drag horizontally while holding to steer left or right — steering is relative, the firefighter never jumps under your finger.',
      'Fly through the corridors left open between the flames on both walls.',
      'Pick up water drops 💧: +50 points each.',
      'Avoid the flames, the sweeping beams and the blaze at the bottom of the screen.',
      'Your score counts in meters: the speed rises gently with altitude, and every 100 m milestone is celebrated.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : maintenez n’importe où sur le jeu, glissez à gauche/droite pour diriger.',
      'Ordinateur : maintenez le bouton de la souris et déplacez-la, ou utilisez la barre d’espace + les flèches ← →.',
      'Après une défaite, touchez le jeu, la touche Entrée ou « Rejouer » pour repartir immédiatement.',
    ],
    en: [
      'Mobile & tablet: press and hold anywhere on the game, drag left/right to steer.',
      'Desktop: hold the mouse button and move it, or use the space bar + the ← → arrow keys.',
      'After a crash, tap the game, press Enter or “Play again” to restart instantly.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Commande à un seul geste : maintenez pour monter, relâchez pour descendre',
      'Couloirs toujours franchissables, de plus en plus étroits',
      'Poutres mobiles et gouttes d’eau à collecter au-delà de 150 m',
      'Palier sonore et vibré célébré tous les 100 m',
      'Vitesse progressive, sans frustration artificielle',
      'Pause automatique quand l’onglet est masqué',
      'Record de distance sauvegardé sur votre appareil',
      'Défi du jour déterministe et succès 500 m / 1 500 m',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      'One-gesture control: hold to rise, release to fall',
      'Always-passable corridors that grow tighter over time',
      'Moving beams and water drops to collect past 150 m',
      'Sound and haptic celebration every 100 m milestone',
      'Progressive speed with no artificial frustration',
      'Automatic pause when the tab is hidden',
      'Distance record saved on your device',
      'Deterministic daily challenge and 500 m / 1,500 m achievements',
    ],
  },
  tips: {
    fr: [
      'Alternez rapidement maintenir/relâcher pour rester à hauteur constante : c’est la clé pour attendre le bon moment devant un couloir étroit.',
      'Les flammes vacillent visuellement, mais leur zone de danger est fixe : fiez-vous à la base des flammes, pas à leurs pointes.',
      'Repérez le couloir suivant dès que le précédent est franchi : un demi-écran d’avance suffit pour se placer.',
      'Les gouttes d’eau sont toujours placées dans les passages sûrs : les viser est un bon moyen de rester sur la bonne trajectoire.',
    ],
    en: [
      'Pulse hold/release quickly to hover at a constant height: it is the key to waiting for the right moment in front of a tight corridor.',
      'Flames flicker visually but their danger zone is fixed: trust the base of the flames, not their tips.',
      'Spot the next corridor as soon as you clear the previous one: half a screen of lookahead is enough to line up.',
      'Water drops always sit in safe passages: aiming for them is a great way to stay on the correct line.',
    ],
  },
  faq: {
    fr: [
      { q: 'Le jeu devient-il impossible à haute altitude ?', a: 'Non. Les couloirs rétrécissent et la vitesse augmente, mais chaque passage reste franchissable : la génération garantit toujours un couloir plus large que le pompier, avec un espacement atteignable.' },
      { q: 'Comment est calculé le score ?', a: 'Le score principal est la distance grimpée, en mètres (10 pixels = 1 mètre). Les gouttes d’eau ajoutent 50 points bonus chacune, affichés séparément.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé repose sur votre précision à slalomer entre les flammes : la distance grimpée est rapportée à un par de 600 mètres (l’objectif le plus élevé du défi du jour, juste au-dessus du succès des 500 m) — une course de 420 à 510 m correspond à une précision de 0,70 à 0,85. Sans temps de référence, la rapidité n’entre pas en compte. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu de réflexes — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour grimper plus haut.' },
      { q: 'Pourquoi le pompier descend-il quand je ne touche pas l’écran ?', a: 'C’est le principe du jeu : la gravité est permanente et le monde défile vers le bas. Maintenir active la propulsion qui vous fait monter plus vite que le défilement.' },
      { q: 'Que se passe-t-il si je change d’onglet en pleine ascension ?', a: 'La partie se met automatiquement en pause : l’incendie n’avance plus tant que vous n’êtes pas revenu, et vous reprenez exactement où vous en étiez.' },
      { q: 'Le défi du jour est-il le même pour tous les joueurs ?', a: 'Oui : l’objectif du jour (250, 400 ou 600 m selon la date) est généré de façon déterministe à partir de la date, identique pour tous jusqu’au lendemain.' },
      { q: 'Puis-je jouer au clavier ?', a: 'Oui : barre d’espace pour monter, flèches gauche/droite pour se diriger, Entrée pour relancer après une défaite. Le jeu reste jouable à la souris ou au doigt.' },
    ],
    en: [
      { q: 'Does the game become impossible at high altitude?', a: 'No. Corridors narrow and speed increases, but every passage remains passable: generation always guarantees a corridor wider than the firefighter, with reachable spacing.' },
      { q: 'How is the score calculated?', a: 'The main score is the distance climbed, in meters (10 pixels = 1 meter). Water drops each add 50 bonus points, shown separately.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ rests on how precisely you slalom between the flames: the distance climbed is measured against a 600-metre par (the highest daily-challenge goal, just above the 500 m achievement) — a 420–510 m run maps to 0.7–0.85 accuracy. With no reference clock, speed does not come into it. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this reflex game — not a clinical IQ test — and the best way to raise it is to keep playing to climb higher.' },
      { q: 'Why does the firefighter fall when I’m not touching the screen?', a: 'That is the core of the game: gravity is permanent and the world scrolls downwards. Holding activates the thruster that makes you climb faster than the scroll.' },
      { q: 'What happens if I switch tabs mid-climb?', a: 'The game pauses automatically: the fire stops advancing until you come back, and you resume exactly where you left off.' },
      { q: 'Is the daily challenge the same for every player?', a: 'Yes: the day’s goal (250, 400 or 600 m depending on the date) is generated deterministically from the date, identical for everyone until the next morning.' },
      { q: 'Can I play with a keyboard?', a: 'Yes: space bar to climb, left/right arrows to steer, Enter to restart after a crash. The game is equally playable with a mouse or a finger.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-distance': { fr: 'Plus grande distance (m)', en: 'Greatest distance (m)' },
  },
}
