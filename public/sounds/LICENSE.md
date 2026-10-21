# Bibliothèque sonore Granmed

Tous les effets sonores de `public/sounds/` proviennent de **Mixkit** (https://mixkit.co/free-sound-effects/),
plateforme d'effets sonores gratuits utilisée selon la **Mixkit License** :
utilisation libre pour projets personnels et commerciaux, sans attribution requise.
Source : https://mixkit.co/license/

Chaque fichier a été retaillé (durée + fondu de sortie) pour l'usage jeu. Fichiers d'origine : MP3 preview.

| Fichier | Son d'origine (Mixkit) | Réf. |
|---|---|---|
| click.mp3 | Cool interface click tone | https://mixkit.co/free-sound-effects/click/ |
| flip.mp3 | Page turn single | https://mixkit.co/free-sound-effects/paper/ |
| pop.mp3 | Arcade video game pop | https://mixkit.co/free-sound-effects/arcade/ |
| correct.mp3 | Correct answer tone | https://mixkit.co/free-sound-effects/correct/ |
| wrong.mp3 | Wrong answer fail notification | https://mixkit.co/free-sound-effects/wrong/ |
| pair.mp3 | Video game treasure | https://mixkit.co/free-sound-effects/game/ |
| merge.mp3 | Magic glitter shot | https://mixkit.co/free-sound-effects/game/ |
| sweep.mp3 | Magic sweep game trophy | https://mixkit.co/free-sound-effects/game/ |
| drop.mp3 | Small hit in a game | https://mixkit.co/free-sound-effects/game/ |
| reveal.mp3 | Tile game reveal | https://mixkit.co/free-sound-effects/notification/ |
| coin.mp3 | Winning a coin, video game | https://mixkit.co/free-sound-effects/game/ |
| splash.mp3 | Water splash | https://mixkit.co/free-sound-effects/water/ |
| slice.mp3 | Quick magic sword slice | https://mixkit.co/free-sound-effects/sword/ |
| tick.mp3 | Clock ticker single | https://mixkit.co/free-sound-effects/clock/ |
| levelup.mp3 | Game experience level increased | https://mixkit.co/free-sound-effects/game/ |
| win.mp3 | Game level completed | https://mixkit.co/free-sound-effects/game/ |
| lose.mp3 | Arcade retro game over | https://mixkit.co/free-sound-effects/arcade/ |
| achievement.mp3 | Achievement bell | https://mixkit.co/free-sound-effects/bell/ |
| swish.mp3 | Short wind swoosh | https://mixkit.co/free-sound-effects/swoosh/ |

Les tonalités du jeu Gran' Mémoire (séquences) sont générées localement via la Web Audio API
(oscillateurs) — aucune ressource externe.

## Bonnes pratiques appliquées (cahier des charges §6)

- Chargement à la demande (aucun préchargement global de la bibliothèque).
- Déverrouillage audio uniquement après une interaction utilisateur (politique d'autoplay).
- Volume global + coupure du son depuis l'en-tête et la coque de chaque jeu (persistés).
- Aucune musique automatique sans interaction explicite.
- Fichiers optimisés (MP3, durées courtes, fondu de sortie).
