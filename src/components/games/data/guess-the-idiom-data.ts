/**
 * Données du jeu « Devine l'Expression » (guess-the-idiom).
 * ~45 expressions françaises + ~45 expressions anglaises, soigneusement sélectionnées.
 * - definition : ce que l'expression signifie (donnée au joueur).
 * - literal : lecture mot à mot (servant d'indice).
 * - origin : étymologie établie, ou null quand elle est débattue/incertaine.
 * FR et EN sont de vraies adaptations culturelles : chaque langue joue avec
 * ses propres expressions (pas des traductions).
 */

export type IdiomCategory = 'animaux' | 'nourriture' | 'temps' | 'corps' | 'quotidien'

export interface IdiomEntry {
  id: string
  expression: string
  definition: { fr: string; en: string }
  literal: { fr: string; en: string }
  origin: { fr: string; en: string } | null
  category: IdiomCategory
  difficulty: 1 | 2 | 3
}

/* ==================== Expressions françaises ==================== */

export const FR_IDIOMS: IdiomEntry[] = [
  {
    id: 'fr-poser-un-lapin',
    expression: 'Poser un lapin',
    definition: {
      fr: 'Ne pas se rendre à un rendez-vous sans prévenir la personne qui nous attend.',
      en: 'To not show up for an appointment without warning the person waiting.',
    },
    literal: {
      fr: 'Déposer un lapin à quelqu’un.',
      en: 'To leave someone a rabbit.',
    },
    origin: {
      fr: 'Au XIXᵉ siècle, « poser un lapin » signifiait en argot partir sans payer ce qui était dû. L’expression a glissé au XXᵉ siècle vers le rendez-vous manqué.',
      en: 'In the 19th century, “poser un lapin” was slang for leaving without paying what was owed; by the 20th century it had drifted to mean a missed appointment.',
    },
    category: 'animaux',
    difficulty: 1,
  },
  {
    id: 'fr-chat-dans-la-gorge',
    expression: 'Avoir un chat dans la gorge',
    definition: {
      fr: 'Avoir la voix enrouée, rauque, comme empêchée par quelque chose.',
      en: 'To have a hoarse, rough voice, as if something were blocking it.',
    },
    literal: {
      fr: 'Avoir un chat logé dans sa gorge.',
      en: 'To have a cat lodged in one’s throat.',
    },
    origin: {
      fr: 'On disait au Moyen Âge « avoir un maton dans le gozier » : le maton était un morceau de lait caillé qui enrobait la gorge. « Maton » se serait déformé en « matou », puis en « chat ».',
      en: 'In the Middle Ages one said “avoir un maton dans le gozier”: a “maton” was a curdled piece of milk coating the throat. “Maton” is said to have morphed into “matou” (tomcat), then “chat”.',
    },
    category: 'animaux',
    difficulty: 1,
  },
  {
    id: 'fr-taureau-par-les-cornes',
    expression: 'Prendre le taureau par les cornes',
    definition: {
      fr: 'Affronter une difficulté de front, avec détermination, plutôt que de la fuir.',
      en: 'To face a difficulty head-on with determination rather than avoid it.',
    },
    literal: {
      fr: 'Saisir un taureau par ses cornes.',
      en: 'To grab a bull by its horns.',
    },
    origin: {
      fr: 'L’image vient des jeux taurins : seul celui qui saisit l’animal par les cornes domine le danger au lieu de le subir.',
      en: 'The image comes from bull games: only the one who grabs the animal by the horns masters the danger instead of enduring it.',
    },
    category: 'animaux',
    difficulty: 1,
  },
  {
    id: 'fr-appeler-un-chat-un-chat',
    expression: 'Appeler un chat un chat',
    definition: {
      fr: 'Nommer les choses franchement, sans détour ni euphémisme.',
      en: 'To call things by their name, plainly and without euphemism.',
    },
    literal: {
      fr: 'Appeler un chat en lui disant « chat ».',
      en: 'To call a cat a cat.',
    },
    origin: {
      fr: 'La formule est attribuée au poète Nicolas de Malherbe, au début du XVIIᵉ siècle : « J’appelle un chat un chat. »',
      en: 'The phrase is attributed to the poet Nicolas de Malherbe in the early 17th century: “I call a cat a cat.”',
    },
    category: 'animaux',
    difficulty: 2,
  },
  {
    id: 'fr-charrue-avant-les-boeufs',
    expression: 'Mettre la charrue avant les bœufs',
    definition: {
      fr: 'Faire les choses dans le mauvais ordre, commencer par la fin.',
      en: 'To do things in the wrong order, starting with the end.',
    },
    literal: {
      fr: 'Placer la charrue devant les bœufs qui devraient la tirer.',
      en: 'To put the plough in front of the oxen that should pull it.',
    },
    origin: {
      fr: 'Image paysanne limpide : attelée à l’envers, la charrue rend tout labour impossible.',
      en: 'A crystal-clear farming image: hitched backwards, the plough makes any tilling impossible.',
    },
    category: 'animaux',
    difficulty: 1,
  },
  {
    id: 'fr-revenir-a-nos-moutons',
    expression: 'Revenir à nos moutons',
    definition: {
      fr: 'Revenir au sujet principal après une digression.',
      en: 'To get back to the main topic after a digression.',
    },
    literal: {
      fr: 'Revenir à nos moutons, comme un berger distrait.',
      en: 'To return to our sheep, like a distracted shepherd.',
    },
    origin: {
      fr: 'Elle vient de la « Farce de Maître Pathelin » (XVᵉ siècle) : un juge sans cesse distrait répète « Revenons à nos moutons » pour ramener un plaignant à son affaire… de moutons volés.',
      en: 'It comes from the “Farce de Maître Pathelin” (15th century): a distracted judge keeps repeating “let us return to our sheep” to bring a plaintiff back to his case… about stolen sheep.',
    },
    category: 'animaux',
    difficulty: 2,
  },
  {
    id: 'fr-autres-chats-a-fouetter',
    expression: 'Avoir d’autres chats à fouetter',
    definition: {
      fr: 'Avoir des occupations ou des préoccupations plus importantes.',
      en: 'To have more important things to do or worry about.',
    },
    literal: {
      fr: 'Avoir d’autres chats qu’il faut fouetter.',
      en: 'To have other cats to whip.',
    },
    origin: {
      fr: 'Au XVIIᵉ siècle, on disait « avoir d’autres chiens à fouetter », image de la chasse à courre ; le chat a remplacé le chien au XIXᵉ siècle.',
      en: 'In the 17th century the phrase was “to have other dogs to whip”, from stag hunting; the cat replaced the dog in the 19th century.',
    },
    category: 'animaux',
    difficulty: 2,
  },
  {
    id: 'fr-poules-auront-des-dents',
    expression: 'Quand les poules auront des dents',
    definition: {
      fr: 'Jamais : sert à désigner un événement impossible ou très improbable.',
      en: 'Never: used for an impossible or highly unlikely event.',
    },
    literal: {
      fr: 'Au moment où les poules pousseront des dents.',
      en: 'When hens grow teeth.',
    },
    origin: {
      fr: 'Le proverbe railleur figure déjà, sous des formes voisines, chez Rabelais au XVIᵉ siècle.',
      en: 'The mocking proverb already appears, in nearby forms, in Rabelais in the 16th century.',
    },
    category: 'animaux',
    difficulty: 2,
  },
  {
    id: 'fr-dindon-de-la-farce',
    expression: 'Être le dindon de la farce',
    definition: {
      fr: 'Être la dupe, celui dont les autres rient et qui perd dans l’affaire.',
      en: 'To be the dupe, the one others laugh at, who loses out.',
    },
    literal: {
      fr: 'Être le dindon d’une farce (petite comédie).',
      en: 'To be the turkey of a farce.',
    },
    origin: {
      fr: 'Apparue au XVIIIᵉ siècle : dans les « farces », courtes pièces comiques des foires, le dindon était le personnage trompé par tous — comme l’oiseau que l’on farcit.',
      en: 'It appeared in the 18th century: in fairground “farces”, short comic plays, the turkey was the character tricked by everyone — like the bird that gets stuffed.',
    },
    category: 'animaux',
    difficulty: 2,
  },
  {
    id: 'fr-donner-sa-langue-au-chat',
    expression: 'Donner sa langue au chat',
    definition: {
      fr: 'Renoncer à deviner, prier l’autre de donner la réponse.',
      en: 'To give up guessing and ask for the answer.',
    },
    literal: {
      fr: 'Tendre sa langue au chat.',
      en: 'To hand one’s tongue to the cat.',
    },
    origin: {
      fr: 'On disait d’abord « jeter sa langue aux chiens » (se taire) ; au XIXᵉ siècle, la formule devient « donner sa langue au chat » pour abandonner une devinette.',
      en: 'One first said “to throw one’s tongue to the dogs” (to stay silent); in the 19th century it became “to give one’s tongue to the cat” when giving up on a riddle.',
    },
    category: 'animaux',
    difficulty: 1,
  },
  {
    id: 'fr-tomber-dans-les-pommes',
    expression: 'Tomber dans les pommes',
    definition: {
      fr: 'S’évanouir, perdre connaissance un instant.',
      en: 'To faint, to lose consciousness briefly.',
    },
    literal: {
      fr: 'Tomber au milieu d’une caisse de pommes.',
      en: 'To fall into a crate of apples.',
    },
    origin: {
      fr: 'Les linguistes rattachent souvent l’expression à l’ancien verbe « pâmer » (s’évanouir) : Rabelais écrivait déjà « tomber pasmé », que le langage populaire aurait transformé en « pommes ».',
      en: 'Linguists often link it to the old verb “pâmer” (to faint): Rabelais already wrote “tomber pasmé”, which popular speech is said to have turned into “pommes”.',
    },
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'fr-mettre-la-main-a-la-pate',
    expression: 'Mettre la main à la pâte',
    definition: {
      fr: 'Participer soi-même au travail, agir concrètement avec les autres.',
      en: 'To take part in the work oneself, to act hands-on with others.',
    },
    literal: {
      fr: 'Plonger sa main dans la pâte à pain.',
      en: 'To put one’s hand in the dough.',
    },
    origin: {
      fr: 'Voltaire rapporte le mot au maréchal de Villars, qui exhortait ainsi à travailler : l’image est celle du pétrissage de la pâte à pain.',
      en: 'Voltaire attributes the words to Marshal Villars, urging people to work: the image is kneading bread dough.',
    },
    category: 'nourriture',
    difficulty: 2,
  },
  {
    id: 'fr-occupe-toi-de-tes-oignons',
    expression: 'Occupe-toi de tes oignons',
    definition: {
      fr: 'Mêle-toi de tes propres affaires, ne te mêle pas des miennes.',
      en: 'Mind your own business, stay out of mine.',
    },
    literal: {
      fr: 'Occupe-toi de tes oignons, dans ton potager.',
      en: 'Take care of your own onions.',
    },
    origin: {
      fr: 'Expression populaire du XXᵉ siècle née dans les potagers : chacun butte ses oignons, pas ceux du voisin.',
      en: 'A popular 20th-century phrase born in vegetable gardens: everyone hills up their own onions, not the neighbour’s.',
    },
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'fr-raconter-des-salades',
    expression: 'Raconter des salades',
    definition: {
      fr: 'Raconter des mensonges, des histoires invraisemblables.',
      en: 'To tell lies, far-fetched stories.',
    },
    literal: {
      fr: 'Raconter des salades, comme on prépare un saladier.',
      en: 'To tell salads, as one tosses a salad bowl.',
    },
    origin: {
      fr: 'À la fin du XIXᵉ siècle, l’image est celle du saladier : comme la salade mélange des ingrédients variés, le menteur mêle le vrai et le faux.',
      en: 'In the late 19th century, the image was the salad bowl: as a salad mixes varied ingredients, the liar mixes truth and falsehood.',
    },
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'fr-moutarde-au-nez',
    expression: 'La moutarde lui monte au nez',
    definition: {
      fr: 'La colère s’empare soudainement de quelqu’un.',
      en: 'Anger suddenly takes over someone.',
    },
    literal: {
      fr: 'La moutarde lui remonte jusqu’au nez.',
      en: 'Mustard rises up to their nose.',
    },
    origin: {
      fr: 'À la fin du XVIIᵉ siècle, la moutarde, réputée âcre et piquante, « montait au nez » comme elle chatouille les narines quand on la goûte.',
      en: 'By the late 17th century, mustard, known for its sharpness, “rose to the nose” just as it tickles the nostrils when tasted.',
    },
    category: 'nourriture',
    difficulty: 2,
  },
  {
    id: 'fr-mettre-de-l-eau-dans-son-vin',
    expression: 'Mettre de l’eau dans son vin',
    definition: {
      fr: 'Tempérer ses exigences, adoucir ses positions ou ses ambitions.',
      en: 'To moderate one’s demands, to soften one’s positions or ambitions.',
    },
    literal: {
      fr: 'Allonger son vin avec de l’eau.',
      en: 'To water down one’s wine.',
    },
    origin: {
      fr: 'Image de table, où l’on coupait le vin d’eau pour le rendre moins fort : le sens figuré est attesté dès le XVIIᵉ siècle.',
      en: 'A dinner-table image, cutting wine with water to make it weaker: the figurative sense is attested as early as the 17th century.',
    },
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'fr-pas-dans-son-assiette',
    expression: 'Ne pas être dans son assiette',
    definition: {
      fr: 'Ne pas se sentir bien, être mal à l’aise physiquement ou moralement.',
      en: 'To not feel well, to be ill at ease physically or morally.',
    },
    literal: {
      fr: 'Être hors de son assiette de table.',
      en: 'To be out of one’s dinner plate.',
    },
    origin: {
      fr: 'L’« assiette » désignait autrefois la façon d’être assis, surtout à cheval : n’être pas dans son assiette, c’était être mal assis — donc mal à l’aise.',
      en: '“Assiette” once meant one’s way of sitting, especially on horseback: to be out of one’s “assiette” was to sit badly — hence uneasy.',
    },
    category: 'nourriture',
    difficulty: 2,
  },
  {
    id: 'fr-en-faire-tout-un-fromage',
    expression: 'En faire tout un fromage',
    definition: {
      fr: 'Transformer un détail minuscule en affaire énorme, dramatiser.',
      en: 'To turn a tiny detail into a huge affair, to overdramatize.',
    },
    literal: {
      fr: 'Fabriquer un fromage entier à partir de presque rien.',
      en: 'To make a whole cheese out of almost nothing.',
    },
    origin: {
      fr: 'Née dans les années 1950 : comme le lait gonfle en devenant fromage, un petit fait « gonflé » devient une grosse histoire.',
      en: 'Born in the 1950s: as milk swells into cheese, a small fact “puffed up” becomes a big story.',
    },
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'fr-coeur-d-artichaut',
    expression: 'Avoir le cœur d’artichaut',
    definition: {
      fr: 'Tomber amoureux facilement, un peu de chaque personne rencontrée.',
      en: 'To fall in love easily, a little bit with everyone.',
    },
    literal: {
      fr: 'Avoir un cœur fait comme un artichaut, feuille à feuille.',
      en: 'To have a heart made like an artichoke, leaf by leaf.',
    },
    origin: {
      fr: 'Popularisée par une chanson de 1892 : « Le cœur d’artichaut, une feuille pour toi, une feuille pour moi. »',
      en: 'Popularized by an 1892 song: “The artichoke heart, one leaf for you, one leaf for me.”',
    },
    category: 'nourriture',
    difficulty: 2,
  },
  {
    id: 'fr-beurre-et-l-argent-du-beurre',
    expression: 'Vouloir le beurre et l’argent du beurre',
    definition: {
      fr: 'Vouloir tous les avantages d’une affaire sans rien concéder.',
      en: 'To want all the benefits of a deal without giving up anything.',
    },
    literal: {
      fr: 'Garder son beurre et empocher aussi son prix de vente.',
      en: 'To keep one’s butter and pocket its price too.',
    },
    origin: null,
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'fr-chanter-comme-une-casserole',
    expression: 'Chanter comme une casserole',
    definition: {
      fr: 'Chanter très faux, avec un son désagréable.',
      en: 'To sing very out of tune, with an unpleasant sound.',
    },
    literal: {
      fr: 'Chanter avec la voix d’une casserole.',
      en: 'To sing with the voice of a saucepan.',
    },
    origin: {
      fr: 'L’image parle d’elle-même : frappée ou frottée, la casserole rend un son faux — la comparaison a traversé les cuisines.',
      en: 'The image speaks for itself: struck or scraped, a saucepan makes a false sound — the comparison came straight out of the kitchen.',
    },
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'fr-manger-les-pissenlits-par-la-racine',
    expression: 'Manger les pissenlits par la racine',
    definition: {
      fr: 'Être mort et enterré.',
      en: 'To be dead and buried.',
    },
    literal: {
      fr: 'Croquer les pissenlits par la racine, sous la terre.',
      en: 'To nibble dandelions from the root, underground.',
    },
    origin: {
      fr: 'Image macabre mais plaisante du XIXᵉ siècle : allongé sous l’herbe, le défunt « mangerait » les racines des pissenlits.',
      en: 'A grim but playful 19th-century image: lying under the grass, the departed would “eat” the dandelions’ roots.',
    },
    category: 'nourriture',
    difficulty: 3,
  },
  {
    id: 'fr-grasse-matinee',
    expression: 'Faire la grasse matinée',
    definition: {
      fr: 'Rester au lit plus tard que d’habitude le matin.',
      en: 'To stay in bed later than usual in the morning.',
    },
    literal: {
      fr: 'Faire une matinée « grasse », c’est-à-dire épaisse.',
      en: 'To have a “fat”, that is thick, morning.',
    },
    origin: {
      fr: 'Au XVIᵉ siècle, « grasse » signifiait « épaisse, abondante » : une grasse matinée est littéralement une matinée épaisse de sommeil.',
      en: 'In the 16th century, “grasse” meant “thick, abundant”: a fat morning is literally a morning thick with sleep.',
    },
    category: 'temps',
    difficulty: 1,
  },
  {
    id: 'fr-il-pleut-des-cordes',
    expression: 'Il pleut des cordes',
    definition: {
      fr: 'Il pleut très fort.',
      en: 'It is raining very hard.',
    },
    literal: {
      fr: 'Des cordes tombent du ciel.',
      en: 'Ropes are falling from the sky.',
    },
    origin: null,
    category: 'temps',
    difficulty: 1,
  },
  {
    id: 'fr-un-temps-de-chien',
    expression: 'Un temps de chien',
    definition: {
      fr: 'Un très mauvais temps, froid, pluvieux ou gris.',
      en: 'Very bad weather: cold, rainy or grey.',
    },
    literal: {
      fr: 'Un temps qui appartient au chien.',
      en: 'Weather that belongs to a dog.',
    },
    origin: {
      fr: 'À la fin du XIXᵉ siècle, « de chien » sert d’intensif péjoratif : une vie de chien, une faim de chien… et un temps de chien.',
      en: 'In the late 19th century, “de chien” worked as a negative intensifier: a dog’s life, a dog’s hunger… and dog weather.',
    },
    category: 'temps',
    difficulty: 1,
  },
  {
    id: 'fr-la-saint-glinglin',
    expression: 'À la Saint-Glinglin',
    definition: {
      fr: 'À une date indéterminée, dans un avenir hypothétique — donc jamais.',
      en: 'At an unspecified date, in a hypothetical future — so, never.',
    },
    literal: {
      fr: 'Le jour de la fête d’un saint nommé Glinglin.',
      en: 'On the feast day of a saint named Glinglin.',
    },
    origin: {
      fr: '« Glinglin » est un saint inventé par plaisanterie : l’expression raille les promesses jamais tenues, « quand Glinglin sonnera ».',
      en: '“Glinglin” is a saint invented as a joke: the phrase mocks never-kept promises, “when Glinglin rings”.',
    },
    category: 'temps',
    difficulty: 3,
  },
  {
    id: 'fr-froid-de-canard',
    expression: 'Faire un froid de canard',
    definition: {
      fr: 'Faire très froid, un froid mordant.',
      en: 'To be extremely cold, a biting cold.',
    },
    literal: {
      fr: 'Un froid digne d’un canard.',
      en: 'A cold worthy of a duck.',
    },
    origin: {
      fr: 'Elle évoque la chasse au canard : immobiles au bord de l’eau par les matins glaciaux, les chasseurs connaissent ce froid-là mieux que personne.',
      en: 'It evokes duck hunting: motionless by the water on freezing mornings, hunters know that cold better than anyone.',
    },
    category: 'temps',
    difficulty: 1,
  },
  {
    id: 'fr-en-un-clin-d-oeil',
    expression: 'En un clin d’œil',
    definition: {
      fr: 'Très rapidement, en un instant.',
      en: 'Very quickly, in an instant.',
    },
    literal: {
      fr: 'Dans le temps qu’il faut pour cligner l’œil.',
      en: 'In the time it takes to blink an eye.',
    },
    origin: null,
    category: 'temps',
    difficulty: 1,
  },
  {
    id: 'fr-couter-les-yeux-de-la-tete',
    expression: 'Coûter les yeux de la tête',
    definition: {
      fr: 'Être très cher, hors de prix.',
      en: 'To be extremely expensive.',
    },
    literal: {
      fr: 'Payer avec les yeux de sa propre tête.',
      en: 'To pay with the eyes of one’s own head.',
    },
    origin: null,
    category: 'corps',
    difficulty: 1,
  },
  {
    id: 'fr-dormir-sur-ses-deux-oreilles',
    expression: 'Dormir sur ses deux oreilles',
    definition: {
      fr: 'Dormir tranquillement, sans aucune inquiétude.',
      en: 'To sleep soundly, without a worry.',
    },
    literal: {
      fr: 'Dormir appuyé sur ses deux oreilles à la fois.',
      en: 'To sleep resting on both ears at once.',
    },
    origin: {
      fr: 'Image inversée de l’animal qui ne dort que « d’une oreille », prêt à s’enfuir : l’être humain qui dort sur ses deux oreilles n’a peur de rien.',
      en: 'The reverse of an animal sleeping “with one ear” ready to flee: a person sleeping on both ears fears nothing.',
    },
    category: 'corps',
    difficulty: 1,
  },
  {
    id: 'fr-un-poil-dans-la-main',
    expression: 'Avoir un poil dans la main',
    definition: {
      fr: 'Être paresseux, éviter soigneusement le travail.',
      en: 'To be lazy, carefully avoiding work.',
    },
    literal: {
      fr: 'Avoir un poil qui pousse dans la paume de la main.',
      en: 'To have a hair growing in one’s palm.',
    },
    origin: {
      fr: 'Plaisanterie d’écoliers du XIXᵉ siècle : le paresseux aurait un poil dans la main, qui pousse d’autant plus vite qu’il ne s’en sert jamais.',
      en: 'A 19th-century schoolyard joke: the lazy one has a hair in their palm, growing faster the less they use their hand.',
    },
    category: 'corps',
    difficulty: 1,
  },
  {
    id: 'fr-casser-les-pieds',
    expression: 'Casser les pieds',
    definition: {
      fr: 'Ennuyer fortement quelqu’un, l’agacer par insistance.',
      en: 'To bore someone deeply, to annoy them with insistence.',
    },
    literal: {
      fr: 'Casser les pieds de quelqu’un.',
      en: 'To break someone’s feet.',
    },
    origin: null,
    category: 'corps',
    difficulty: 1,
  },
  {
    id: 'fr-prendre-ses-jambes-a-son-cou',
    expression: 'Prendre ses jambes à son cou',
    definition: {
      fr: 'S’enfuir très vite, détalant sans se retourner.',
      en: 'To run away very fast, without looking back.',
    },
    literal: {
      fr: 'Empoigner ses jambes et les porter autour de son cou.',
      en: 'To grab one’s legs and carry them around one’s neck.',
    },
    origin: null,
    category: 'corps',
    difficulty: 1,
  },
  {
    id: 'fr-tete-dans-les-nuages',
    expression: 'Avoir la tête dans les nuages',
    definition: {
      fr: 'Être distrait, rêveur, loin des réalités concrètes.',
      en: 'To be absent-minded, dreamy, far from practical realities.',
    },
    literal: {
      fr: 'Avoir la tête là-haut, parmi les nuages.',
      en: 'To have one’s head up among the clouds.',
    },
    origin: {
      fr: 'Image poétique ancienne : le rêveur aurait la tête « dans les nuages », bien au-dessus du sol et des soucis.',
      en: 'An old poetic image: the dreamer’s head would be “in the clouds”, well above the ground and its worries.',
    },
    category: 'corps',
    difficulty: 1,
  },
  {
    id: 'fr-se-mettre-martel-en-tete',
    expression: 'Se mettre martel en tête',
    definition: {
      fr: 'Se faire du souci, ruminer une idée obsédante.',
      en: 'To worry, to ruminate over an obsessive idea.',
    },
    literal: {
      fr: 'Se mettre un martel — un marteau — dans la tête.',
      en: 'To put a martel — a hammer — in one’s head.',
    },
    origin: {
      fr: '« Martel » est une ancienne forme du mot « marteau » : les idées noires frappent la tête à coups répétés, comme un forgeron.',
      en: '“Martel” is an old form of “hammer”: dark thoughts strike the head repeatedly, like a blacksmith.',
    },
    category: 'corps',
    difficulty: 3,
  },
  {
    id: 'fr-rester-bouche-bee',
    expression: 'Rester bouche bée',
    definition: {
      fr: 'Rester la bouche ouverte, saisi d’étonnement ou d’admiration.',
      en: 'To stand with one’s mouth open, stunned or in admiration.',
    },
    literal: {
      fr: 'Rester avec une bouche grande ouverte.',
      en: 'To remain with a wide-open mouth.',
    },
    origin: {
      fr: '« Bée » vient du verbe ancien « béer », qui signifiait « être grand ouvert » ; on le retrouve dans la locution « la bouche bée ».',
      en: '“Bée” comes from the old verb “béer”, meaning “to be wide open”; it survives in the phrase “bouche bée”.',
    },
    category: 'corps',
    difficulty: 2,
  },
  {
    id: 'fr-yeux-plus-gros-que-le-ventre',
    expression: 'Avoir les yeux plus gros que le ventre',
    definition: {
      fr: 'Vouloir plus que ce qu’on peut réellement absorber ou accomplir.',
      en: 'To want more than one can actually take in or achieve.',
    },
    literal: {
      fr: 'Avoir des yeux plus grands que son estomac.',
      en: 'To have eyes bigger than one’s stomach.',
    },
    origin: null,
    category: 'corps',
    difficulty: 1,
  },
  {
    id: 'fr-tenir-la-jambe',
    expression: 'Tenir la jambe',
    definition: {
      fr: 'Retenir quelqu’un en lui parlant longuement, sans le laisser partir.',
      en: 'To hold someone back by talking at length, not letting them go.',
    },
    literal: {
      fr: 'Saisir quelqu’un par la jambe et ne pas lâcher.',
      en: 'To seize someone by the leg and not let go.',
    },
    origin: null,
    category: 'corps',
    difficulty: 2,
  },
  {
    id: 'fr-coup-de-foudre',
    expression: 'Avoir le coup de foudre',
    definition: {
      fr: 'Ressentir une passion ou un amour soudain et irrésistible.',
      en: 'To feel a sudden, irresistible passion or love.',
    },
    literal: {
      fr: 'Être frappé par la foudre.',
      en: 'To be struck by lightning.',
    },
    origin: {
      fr: 'La foudre frappe sans prévenir : depuis longtemps, elle symbolise l’événement brutal et imprévisible. L’image s’est appliquée à l’amour au XVIIIᵉ siècle.',
      en: 'Lightning strikes without warning: it has long symbolized a sudden, unforeseeable event. The image was applied to love in the 18th century.',
    },
    category: 'quotidien',
    difficulty: 1,
  },
  {
    id: 'fr-chercher-midi-a-quatorze-heures',
    expression: 'Chercher midi à quatorze heures',
    definition: {
      fr: 'Se compliquer inutilement l’existence, voir des difficultés là où il n’y en a pas.',
      en: 'To needlessly complicate things, to see difficulties where there are none.',
    },
    literal: {
      fr: 'Chercher l’heure de midi à l’heure de quatorze heures.',
      en: 'To look for noon at two in the afternoon.',
    },
    origin: null,
    category: 'quotidien',
    difficulty: 2,
  },
  {
    id: 'fr-couper-l-herbe-sous-le-pied',
    expression: 'Couper l’herbe sous le pied',
    definition: {
      fr: 'Devancer quelqu’un en agissant le premier, ruiner ses projets.',
      en: 'To get ahead of someone by acting first, to ruin their plans.',
    },
    literal: {
      fr: 'Faucher l’herbe juste sous les pieds de quelqu’un.',
      en: 'To mow the grass right under someone’s feet.',
    },
    origin: {
      fr: 'Image des prés : l’herbe coupée sous ses pieds fait perdre l’équilibre à l’adversaire et l’empêche d’avancer.',
      en: 'A meadow image: grass cut from under one’s feet makes the opponent lose balance and stops their advance.',
    },
    category: 'quotidien',
    difficulty: 2,
  },
  {
    id: 'fr-le-vent-en-poupe',
    expression: 'Avoir le vent en poupe',
    definition: {
      fr: 'Être porté par la réussite, bénéficier d’une situation favorable.',
      en: 'To be carried along by success, to enjoy a favourable situation.',
    },
    literal: {
      fr: 'Recevoir le vent par la poupe, à l’arrière du navire.',
      en: 'To get wind at the stern, at the back of the ship.',
    },
    origin: {
      fr: 'Vocabulaire de la marine à voile : un vent « en poupe » souffle vers l’avant du navire et le pousse — une situation qui aide à avancer.',
      en: 'Sailing vocabulary: wind “at the stern” blows toward the bow and pushes the ship forward — a helping situation.',
    },
    category: 'quotidien',
    difficulty: 2,
  },
  {
    id: 'fr-vendre-la-meche',
    expression: 'Vendre la mèche',
    definition: {
      fr: 'Révéler un secret, trahir un projet destiné à rester caché.',
      en: 'To give away a secret, to betray a plan meant to stay hidden.',
    },
    literal: {
      fr: 'Vendre la mèche (de cheveux, ou de fusée).',
      en: 'To sell the wick (or the fuse).',
    },
    origin: null,
    category: 'quotidien',
    difficulty: 3,
  },
  {
    id: 'fr-tourner-la-page',
    expression: 'Tourner la page',
    definition: {
      fr: 'Passer à une nouvelle étape de sa vie après une épreuve ou une période.',
      en: 'To move on to a new stage of life after a trial or a period.',
    },
    literal: {
      fr: 'Tourner la page d’un livre pour passer à la suite.',
      en: 'To turn a book’s page to move on.',
    },
    origin: null,
    category: 'quotidien',
    difficulty: 1,
  },
  {
    id: 'fr-poser-un-regard-neuf',
    expression: 'Poser un regard neuf',
    definition: {
      fr: 'Considérer quelque chose comme si on le voyait pour la première fois, sans a priori.',
      en: 'To look at something as if seeing it for the first time, without preconceptions.',
    },
    literal: {
      fr: 'Poser sur les choses un regard tout neuf, comme sorti d’usine.',
      en: 'To lay a brand-new gaze on things, factory-fresh.',
    },
    origin: null,
    category: 'quotidien',
    difficulty: 2,
  },
]

/* ==================== Expressions anglaises ==================== */

export const EN_IDIOMS: IdiomEntry[] = [
  {
    id: 'en-let-the-cat-out',
    expression: 'Let the cat out of the bag',
    definition: {
      fr: 'Révéler un secret par mégarde.',
      en: 'To reveal a secret by accident.',
    },
    literal: {
      fr: 'Laisser sortir le chat du sac.',
      en: 'To release the cat from the bag.',
    },
    origin: {
      fr: 'Aux marchés médiévaux, un cochon de lait vendu dans un sac était parfois remplacé par un chat sans valeur : si le chat s’échappait, la tromperie était démasquée.',
      en: 'At medieval markets, a suckling pig sold in a tied bag was sometimes swapped for a worthless cat: if the cat escaped, the trick was exposed.',
    },
    category: 'animaux',
    difficulty: 1,
  },
  {
    id: 'en-barking-up-the-wrong-tree',
    expression: 'Barking up the wrong tree',
    definition: {
      fr: 'Se tromper complètement de cible ou de soupçon.',
      en: 'To be completely mistaken about a target or a suspicion.',
    },
    literal: {
      fr: 'Aboyer au pied du mauvais arbre.',
      en: 'To bark at the foot of the wrong tree.',
    },
    origin: {
      fr: 'Image de la chasse au ragondin ou au renard : les chiens aboyaient sous l’arbre où l’animal ne se trouvait plus.',
      en: 'From raccoon or fox hunting: hounds bayed under a tree the quarry had already left.',
    },
    category: 'animaux',
    difficulty: 1,
  },
  {
    id: 'en-let-sleeping-dogs-lie',
    expression: 'Let sleeping dogs lie',
    definition: {
      fr: 'Éviter de réveiller un vieux problème ou une vieille querelle.',
      en: 'To avoid stirring up an old problem or quarrel.',
    },
    literal: {
      fr: 'Laisser les chiens endormis tranquilles.',
      en: 'To leave sleeping dogs alone.',
    },
    origin: {
      fr: 'Le proverbe est ancien : Chaucer écrivait déjà au XIVᵉ siècle qu’il n’est pas bon de réveiller un chien qui dort.',
      en: 'The proverb is old: Chaucer wrote in the 14th century that it is not good to wake a sleeping hound.',
    },
    category: 'animaux',
    difficulty: 1,
  },
  {
    id: 'en-curiosity-killed-the-cat',
    expression: 'Curiosity killed the cat',
    definition: {
      fr: 'Avertir que trop de curiosité peut être dangereux.',
      en: 'A warning that too much curiosity can be dangerous.',
    },
    literal: {
      fr: 'La curiosité a tué le chat.',
      en: 'Curiosity killed the cat.',
    },
    origin: {
      fr: 'La formule d’origine était « care killed the cat » (le souci tua le chat), relevée chez Ben Jonson dès 1598 ; « curiosity » l’a remplacée au XIXᵉ siècle.',
      en: 'The original wording was “care killed the cat”, noted in Ben Jonson as early as 1598; “curiosity” took over in the 19th century.',
    },
    category: 'animaux',
    difficulty: 1,
  },
  {
    id: 'en-kill-two-birds',
    expression: 'Kill two birds with one stone',
    definition: {
      fr: 'Atteindre deux objectifs avec une seule action.',
      en: 'To achieve two goals with a single action.',
    },
    literal: {
      fr: 'Tuer deux oiseaux avec une seule pierre.',
      en: 'To kill two birds using one stone.',
    },
    origin: {
      fr: 'L’image apparaît dans les sources anglaises dès le XVIIᵉ siècle ; elle est aussi littérale que efficace.',
      en: 'The image appears in English sources as early as the 17th century; it is as literal as it is efficient.',
    },
    category: 'animaux',
    difficulty: 1,
  },
  {
    id: 'en-when-pigs-fly',
    expression: 'When pigs fly',
    definition: {
      fr: 'Jamais : sert à rejeter une hypothèse impossible.',
      en: 'Never: used to dismiss an impossible idea.',
    },
    literal: {
      fr: 'Quand les cochons voleront.',
      en: 'When pigs fly.',
    },
    origin: {
      fr: 'Un proverbe écossais du XVIᵉ siècle raillait déjà des cochons « volant la queue en avant ».',
      en: 'A 16th-century Scottish proverb already joked about pigs “flying with their tails forward”.',
    },
    category: 'animaux',
    difficulty: 2,
  },
  {
    id: 'en-elephant-in-the-room',
    expression: 'The elephant in the room',
    definition: {
      fr: 'Un problème évident et énorme que tout le monde évite soigneusement d’évoquer.',
      en: 'An obvious, enormous problem everyone carefully avoids mentioning.',
    },
    literal: {
      fr: 'L’éléphant installé dans la pièce.',
      en: 'The elephant standing in the room.',
    },
    origin: {
      fr: 'L’expression « the elephant in the living room » apparaît dans l’Amérique des années 1950, sans inventeur identifié.',
      en: 'The phrase “the elephant in the living room” surfaced in 1950s America, with no identified inventor.',
    },
    category: 'animaux',
    difficulty: 2,
  },
  {
    id: 'en-hold-your-horses',
    expression: 'Hold your horses',
    definition: {
      fr: 'Ralentir, attendre avant d’agir.',
      en: 'To slow down, to wait before acting.',
    },
    literal: {
      fr: 'Retenir ses chevaux.',
      en: 'To rein in one’s horses.',
    },
    origin: {
      fr: 'Littérale à l’origine : au XIXᵉ siècle, on criait « hold your horses » aux cochers emportés.',
      en: 'Originally literal: in the 19th century, “hold your horses” was shouted at hot-headed carriage drivers.',
    },
    category: 'animaux',
    difficulty: 2,
  },
  {
    id: 'en-piece-of-cake',
    expression: 'A piece of cake',
    definition: {
      fr: 'Quelque chose de très facile à faire.',
      en: 'Something very easy to do.',
    },
    literal: {
      fr: 'Une part de gâteau.',
      en: 'A slice of cake.',
    },
    origin: {
      fr: 'Elle dériverait du « cakewalk », concours de danse inventé par les communautés noires américaines du XIXᵉ siècle, dont le prix était… un gâteau.',
      en: 'It is often traced to the cakewalk, a dance contest created by Black American communities in the 19th century, whose prize was… a cake.',
    },
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'en-spill-the-beans',
    expression: 'Spill the beans',
    definition: {
      fr: 'Révéler un secret, lâcher une information confidentielle.',
      en: 'To reveal a secret, to leak confidential information.',
    },
    literal: {
      fr: 'Renverser les haricots.',
      en: 'To knock over the beans.',
    },
    origin: {
      fr: 'Attestée dans l’argot américain du début du XXᵉ siècle ; une légende populaire la relie aux votes à haricots de la Grèce antique — histoire séduisante mais non prouvée.',
      en: 'Recorded in early 20th-century American slang; a popular legend ties it to ancient Greek bean-voting — a charming but unproven story.',
    },
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'en-cry-over-spilled-milk',
    expression: 'Don’t cry over spilled milk',
    definition: {
      fr: 'Ne pas se lamenter sur ce qui est irréversible.',
      en: 'Do not lament what cannot be undone.',
    },
    literal: {
      fr: 'Ne pas pleurer sur le lait renversé.',
      en: 'Do not weep over spilled milk.',
    },
    origin: {
      fr: 'Proverbe anglais attesté dès le XVIIᵉ siècle, dans les recueils de James Howell.',
      en: 'An English proverb attested as early as the 17th century, in James Howell’s proverb collections.',
    },
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'en-eggs-in-one-basket',
    expression: 'Don’t put all your eggs in one basket',
    definition: {
      fr: 'Ne pas concentrer tous ses risques ou ses espoirs sur une seule option.',
      en: 'Do not concentrate all your risks or hopes on a single option.',
    },
    literal: {
      fr: 'Ne pas mettre tous ses œufs dans le même panier.',
      en: 'Do not place every egg in one basket.',
    },
    origin: {
      fr: 'Souvent rattachée au Don Quichotte de Cervantès (1605), qui conseille de ne pas hasarder tous ses œufs dans le même panier.',
      en: 'Often traced to Cervantes’s Don Quixote (1605), which advises against venturing all your eggs in one basket.',
    },
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'en-bite-off-more-than-you-can-chew',
    expression: 'Bite off more than you can chew',
    definition: {
      fr: 'Prendre plus de responsabilités qu’on ne peut en assumer.',
      en: 'To take on more than one can handle.',
    },
    literal: {
      fr: 'Couper à la dent une bouchée trop grosse à mâcher.',
      en: 'To cut off a mouthful too big to chew.',
    },
    origin: {
      fr: 'Image littérale de la bouche trop pleine, popularisée dans l’Amérique des années 1870.',
      en: 'A literal image of an overfull mouth, popularized in 1870s America.',
    },
    category: 'nourriture',
    difficulty: 2,
  },
  {
    id: 'en-have-your-cake',
    expression: 'Have your cake and eat it too',
    definition: {
      fr: 'Vouloir conserver un avantage et en profiter en même temps.',
      en: 'To want to keep an advantage and enjoy it at the same time.',
    },
    literal: {
      fr: 'Garder son gâteau et le manger quand même.',
      en: 'To keep one’s cake and eat it too.',
    },
    origin: {
      fr: 'La plus ancienne version figure dans une lettre de Thomas Cromwell (1538) : « a man can not have his cake and eat his cake ».',
      en: 'The oldest version appears in a 1538 letter by Thomas Cromwell: “a man can not have his cake and eat his cake”.',
    },
    category: 'nourriture',
    difficulty: 2,
  },
  {
    id: 'en-taste-of-your-own-medicine',
    expression: 'A taste of your own medicine',
    definition: {
      fr: 'Subir soi-même le traitement désagréable qu’on inflige aux autres.',
      en: 'To undergo the unpleasant treatment one inflicts on others.',
    },
    literal: {
      fr: 'Goûter à son propre remède.',
      en: 'To taste one’s own medicine.',
    },
    origin: {
      fr: 'Une vieille fable raconte un charlatan obligé d’avaler sa propre mixture : l’image lui a survécu.',
      en: 'One old fable tells of a quack doctor forced to swallow his own brew: the image outlived him.',
    },
    category: 'nourriture',
    difficulty: 2,
  },
  {
    id: 'en-not-my-cup-of-tea',
    expression: 'Not my cup of tea',
    definition: {
      fr: 'Quelque chose qui ne correspond pas à ses goûts.',
      en: 'Something that does not suit one’s tastes.',
    },
    literal: {
      fr: 'Pas ma tasse de thé.',
      en: 'Not my cup of tea.',
    },
    origin: {
      fr: 'Dans l’Angleterre des années 1930, « my cup of tea » désignait tout ce qu’on aime ; la négation a suivi.',
      en: 'In 1930s England, “my cup of tea” meant anything one likes; the negative followed.',
    },
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'en-in-a-nutshell',
    expression: 'In a nutshell',
    definition: {
      fr: 'En résumé très bref.',
      en: 'Summarized very briefly.',
    },
    literal: {
      fr: 'Dans une coque de noix.',
      en: 'Inside a nutshell.',
    },
    origin: {
      fr: 'Pline l’Ancien racontait qu’une copie de l’Iliade tenait dans une coque de noix : l’image a traversé les siècles.',
      en: 'Pliny the Elder told of a copy of the Iliad small enough to fit inside a nutshell: the image stuck.',
    },
    category: 'nourriture',
    difficulty: 1,
  },
  {
    id: 'en-once-in-a-blue-moon',
    expression: 'Once in a blue moon',
    definition: {
      fr: 'Très rarement.',
      en: 'Very rarely.',
    },
    literal: {
      fr: 'Une fois par lune bleue.',
      en: 'Once per blue moon.',
    },
    origin: {
      fr: 'Une « lune bleue » désigne la deuxième pleine lune d’un même mois (ou la troisième d’une saison) : un événement rare, d’où le sens.',
      en: 'A “blue moon” is the second full moon in a calendar month (or the third of four in a season): a rare event, hence the meaning.',
    },
    category: 'temps',
    difficulty: 1,
  },
  {
    id: 'en-under-the-weather',
    expression: 'Under the weather',
    definition: {
      fr: 'Se sentir un peu malade, pas dans son état normal.',
      en: 'To feel slightly ill, not one’s usual self.',
    },
    literal: {
      fr: 'Sous le mauvais temps.',
      en: 'Beneath the weather.',
    },
    origin: {
      fr: 'La plupart des dictionnaires la rattachent à l’argot naval du XIXᵉ siècle : les marins malades descendaient « sous le vent » (under the weather bow).',
      en: 'Most dictionaries trace it to 19th-century naval slang: seasick sailors were sent below the “weather bow”.',
    },
    category: 'temps',
    difficulty: 2,
  },
  {
    id: 'en-burn-the-midnight-oil',
    expression: 'Burn the midnight oil',
    definition: {
      fr: 'Travailler ou étudier tard dans la nuit.',
      en: 'To work or study late into the night.',
    },
    literal: {
      fr: 'Brûler l’huile de minuit.',
      en: 'To burn the oil at midnight.',
    },
    origin: {
      fr: 'Avant l’électricité, on travaillait la nuit à la lampe à huile : brûler l’huile, c’était veiller tard.',
      en: 'Before electricity, night work was done by oil lamp: burning oil meant staying up late.',
    },
    category: 'temps',
    difficulty: 1,
  },
  {
    id: 'en-in-the-nick-of-time',
    expression: 'In the nick of time',
    definition: {
      fr: 'Au tout dernier moment, juste à temps.',
      en: 'At the very last moment, just in time.',
    },
    literal: {
      fr: 'Dans l’entaille du temps.',
      en: 'In the nick of time.',
    },
    origin: {
      fr: 'Au XVIᵉ siècle, le « nick » était l’entaille précise gravée sur un bâton de comptage : le moment exact, ni avant ni après.',
      en: 'In the 16th century, a “nick” was the precise notch cut into a tally stick: the exact moment, neither before nor after.',
    },
    category: 'temps',
    difficulty: 2,
  },
  {
    id: 'en-call-it-a-day',
    expression: 'Call it a day',
    definition: {
      fr: 'Décider d’arrêter de travailler, estimer que c’est suffisant pour aujourd’hui.',
      en: 'To decide to stop working, judging it enough for today.',
    },
    literal: {
      fr: 'Déclarer que c’est une journée.',
      en: 'To declare it a day.',
    },
    origin: {
      fr: 'Attestée d’abord sous la forme « call it half a day » (« disons que c’est une demi-journée ») dans les années 1830.',
      en: 'First recorded as “call it half a day” in the 1830s.',
    },
    category: 'temps',
    difficulty: 1,
  },
  {
    id: 'en-rain-cats-and-dogs',
    expression: 'Rain cats and dogs',
    definition: {
      fr: 'Pleuvoir très fort.',
      en: 'To rain very heavily.',
    },
    literal: {
      fr: 'Il tombe des chats et des chiens.',
      en: 'Cats and dogs are falling.',
    },
    origin: {
      fr: 'L’origine exacte reste débattue ; la satire des rues de Londres par Jonathan Swift (XVIIIᵉ siècle) est souvent citée.',
      en: 'The exact origin is still debated; Jonathan Swift’s satire of London streets (18th century) is often cited.',
    },
    category: 'temps',
    difficulty: 2,
  },
  {
    id: 'en-silver-lining',
    expression: 'Every cloud has a silver lining',
    definition: {
      fr: 'Toute situation difficile cache un côté positif.',
      en: 'Every difficult situation hides a positive side.',
    },
    literal: {
      fr: 'Chaque nuage a une bordure argentée.',
      en: 'Every cloud has a silver lining.',
    },
    origin: {
      fr: 'L’image vient du poème « Comus » de Milton (1634) : « A sable cloud turns forth her silver lining on the night. »',
      en: 'The image comes from Milton’s poem “Comus” (1634): “A sable cloud turns forth her silver lining on the night.”',
    },
    category: 'temps',
    difficulty: 2,
  },
  {
    id: 'en-cost-an-arm-and-a-leg',
    expression: 'Cost an arm and a leg',
    definition: {
      fr: 'Coûter extrêmement cher.',
      en: 'To be extremely expensive.',
    },
    literal: {
      fr: 'Coûter un bras et une jambe.',
      en: 'To cost an arm and a leg.',
    },
    origin: {
      fr: 'Une histoire populaire accuse les portraitistes, facturés plus cher pour les bras et les jambes — séduisant, mais invérifiable.',
      en: 'A popular story blames portrait painters, who charged more for arms and legs — charming, but unproven.',
    },
    category: 'corps',
    difficulty: 1,
  },
  {
    id: 'en-bite-the-bullet',
    expression: 'Bite the bullet',
    definition: {
      fr: 'Endurer courageusement quelque chose de douloureux ou d’inévitable.',
      en: 'To endure something painful or inevitable with courage.',
    },
    literal: {
      fr: 'Mordre la balle.',
      en: 'To bite the bullet.',
    },
    origin: {
      fr: 'Avant l’anesthésie, on faisait parfois serrer une balle entre les dents du patient pendant l’opération.',
      en: 'Before anesthesia, patients were sometimes given a bullet to clench between their teeth during surgery.',
    },
    category: 'corps',
    difficulty: 2,
  },
  {
    id: 'en-see-eye-to-eye',
    expression: 'See eye to eye',
    definition: {
      fr: 'Être entièrement d’accord avec quelqu’un.',
      en: 'To be in full agreement with someone.',
    },
    literal: {
      fr: 'Se regarder œil dans œil.',
      en: 'To see eye to eye.',
    },
    origin: {
      fr: 'Elle est souvent rattachée à un vers d’Ésaïe (52:8) : « ils verront œil à œil » — le sens d’accord total est venu ensuite.',
      en: 'It is often linked to a verse in Isaiah (52:8), “they shall see eye to eye” — the sense of full agreement came later.',
    },
    category: 'corps',
    difficulty: 1,
  },
  {
    id: 'en-skin-of-your-teeth',
    expression: 'By the skin of your teeth',
    definition: {
      fr: 'De justesse, tout juste.',
      en: 'Narrowly, just barely.',
    },
    literal: {
      fr: 'Par la peau de ses dents.',
      en: 'By the skin of your teeth.',
    },
    origin: {
      fr: 'La formule est un quasi-citation du Livre de Job (19:20) dans la Bible du roi Jacques.',
      en: 'The phrase is a near-quote from the Book of Job (19:20) in the King James Bible.',
    },
    category: 'corps',
    difficulty: 2,
  },
  {
    id: 'en-hit-the-nail-on-the-head',
    expression: 'Hit the nail on the head',
    definition: {
      fr: 'Décrire exactement un problème ou une situation.',
      en: 'To describe a problem or situation exactly right.',
    },
    literal: {
      fr: 'Frapper le clou droit sur la tête.',
      en: 'To strike the nail squarely on the head.',
    },
    origin: {
      fr: 'L’image du marteau et du clou frappé d’équerre est utilisée depuis le Moyen Âge.',
      en: 'The image of a hammer striking a nail squarely has been used since the Middle Ages.',
    },
    category: 'corps',
    difficulty: 1,
  },
  {
    id: 'en-head-over-heels',
    expression: 'Head over heels',
    definition: {
      fr: 'Totalement, complètement — surtout en parlant d’amour.',
      en: 'Totally, completely — especially in love.',
    },
    literal: {
      fr: 'La tête par-dessus les talons.',
      en: 'Head above the heels.',
    },
    origin: {
      fr: 'La forme logique « heels over head » (talons par-dessus tête) s’est inversée au fil du temps, sans qu’on sache bien pourquoi.',
      en: 'The logical form “heels over head” flipped over time, for reasons no one quite knows.',
    },
    category: 'corps',
    difficulty: 1,
  },
  {
    id: 'en-cold-shoulder',
    expression: 'Give the cold shoulder',
    definition: {
      fr: 'Traiter quelqu’un avec froideur et distance délibérées.',
      en: 'To treat someone with deliberate coldness and distance.',
    },
    literal: {
      fr: 'Offrir une épaule froide.',
      en: 'To give a cold shoulder.',
    },
    origin: {
      fr: 'Une légende veut qu’on servait du mouton froid aux invités indésirables pour les pousser à partir ; les historiens de la cuisine en doutent, mais l’image est savoureuse.',
      en: 'A legend claims unwelcome guests were served cold mutton to nudge them out; food historians doubt it, but the image is delicious.',
    },
    category: 'corps',
    difficulty: 2,
  },
  {
    id: 'en-turn-a-blind-eye',
    expression: 'Turn a blind eye',
    definition: {
      fr: 'Faire volontairement comme si on n’avait rien vu.',
      en: 'To deliberately pretend not to see something.',
    },
    literal: {
      fr: 'Détourner son œil aveugle.',
      en: 'To turn a blind eye.',
    },
    origin: {
      fr: 'Lors de la bataille de Copenhague (1801), l’amiral Nelson, malvoyant, aurait porté sa lunette sur son œil aveugle pour ignorer le signal de rompre le combat.',
      en: 'At the Battle of Copenhagen (1801), the near-blind Admiral Nelson reportedly held his telescope to his blind eye to ignore the signal to withdraw.',
    },
    category: 'corps',
    difficulty: 2,
  },
  {
    id: 'en-play-it-by-ear',
    expression: 'Play it by ear',
    definition: {
      fr: 'Improviser, décider au fil des événements sans plan fixe.',
      en: 'To improvise, deciding as events unfold without a fixed plan.',
    },
    literal: {
      fr: 'Jouer à l’oreille.',
      en: 'To play it by ear.',
    },
    origin: {
      fr: 'Un musicien qui joue « à l’oreille » se passe de partition : l’expression s’est étendue à toute improvisation.',
      en: 'A musician playing “by ear” skips the sheet music: the phrase extended to any improvisation.',
    },
    category: 'corps',
    difficulty: 2,
  },
  {
    id: 'en-break-the-ice',
    expression: 'Break the ice',
    definition: {
      fr: 'Briser la gêne initiale et lancer la conversation.',
      en: 'To dissolve the initial awkwardness and start conversation.',
    },
    literal: {
      fr: 'Briser la glace.',
      en: 'To break the ice.',
    },
    origin: {
      fr: 'Les navires « brisaient la glace » pour ouvrir la voie aux autres, notamment au commerce ; le sens social est attesté dès le XVIᵉ siècle.',
      en: 'Ships “broke the ice” to open the way for others, especially for trade; the social sense is attested as early as the 16th century.',
    },
    category: 'quotidien',
    difficulty: 1,
  },
  {
    id: 'en-beat-around-the-bush',
    expression: 'Beat around the bush',
    definition: {
      fr: 'Tourner autour d’un sujet sans aborder le fond.',
      en: 'To skirt around a subject without getting to the point.',
    },
    literal: {
      fr: 'Battre autour du buisson.',
      en: 'To beat around the bush.',
    },
    origin: {
      fr: 'À la chasse, des batteurs frappaient les buissons pour faire sortir les oiseaux — battre « autour » évitait de s’engager.',
      en: 'In hunting, beaters struck bushes to flush birds out — beating “around” the bush avoided committing.',
    },
    category: 'quotidien',
    difficulty: 2,
  },
  {
    id: 'en-steal-thunder',
    expression: 'Steal someone’s thunder',
    definition: {
      fr: 'Dérober l’effet d’une annonce ou d’une réussite à quelqu’un.',
      en: 'To take the impact of someone’s announcement or success away from them.',
    },
    literal: {
      fr: 'Voler le tonnerre de quelqu’un.',
      en: 'To steal someone’s thunder.',
    },
    origin: {
      fr: 'Le dramaturge John Dennis (1704) avait inventé une machine à tonnerre pour sa pièce ; ruiné, il entendit « son » tonnerre dans une autre et s’écria qu’on lui volait son tonnerre.',
      en: 'Playwright John Dennis (1704) invented a thunder machine for his play; after it flopped, he heard “his” thunder in another production and cried that they had stolen his thunder.',
    },
    category: 'quotidien',
    difficulty: 2,
  },
  {
    id: 'en-throw-in-the-towel',
    expression: 'Throw in the towel',
    definition: {
      fr: 'Abandonner, renoncer.',
      en: 'To give up, to concede.',
    },
    literal: {
      fr: 'Jeter l’éponge (la serviette).',
      en: 'To throw the towel into the ring.',
    },
    origin: {
      fr: 'Venue de la boxe : le coin d’un boxeur jetait l’éponge (ou la serviette) sur le ring pour arrêter le combat.',
      en: 'From boxing: a fighter’s corner threw the towel (or sponge) into the ring to stop the bout.',
    },
    category: 'quotidien',
    difficulty: 1,
  },
  {
    id: 'en-tie-the-knot',
    expression: 'Tie the knot',
    definition: {
      fr: 'Se marier.',
      en: 'To get married.',
    },
    literal: {
      fr: 'Nouer le nœud.',
      en: 'To tie the knot.',
    },
    origin: {
      fr: 'Elle évoque les très anciennes coutumes nuptiales où l’on nouait des cordons ou unissait les mains des fiancés (« handfasting »).',
      en: 'It evokes age-old wedding customs of tying cords or binding couples’ hands (“handfasting”).',
    },
    category: 'quotidien',
    difficulty: 2,
  },
  {
    id: 'en-sit-on-the-fence',
    expression: 'Sit on the fence',
    definition: {
      fr: 'Refuser de choisir un camp, rester indécis.',
      en: 'To refuse to pick a side, to stay undecided.',
    },
    literal: {
      fr: 'Être assis sur la clôture.',
      en: 'To sit on the fence.',
    },
    origin: {
      fr: 'L’image de l’homme à cheval sur la barrière, entre deux prés, apparaît dans l’Amérique du XIXᵉ siècle.',
      en: 'The image of a man astride the fence, between two fields, emerged in 19th-century America.',
    },
    category: 'quotidien',
    difficulty: 2,
  },
  {
    id: 'en-go-the-extra-mile',
    expression: 'Go the extra mile',
    definition: {
      fr: 'Faire un effort supplémentaire au-delà de ce qui est demandé.',
      en: 'To make an extra effort beyond what is asked.',
    },
    literal: {
      fr: 'Faire le mille supplémentaire.',
      en: 'To walk the extra mile.',
    },
    origin: {
      fr: 'Elle vient du Sermon sur la montagne (Évangile de Matthieu 5:41) : un soldat romain pouvait exiger de porter son paquet sur un mille.',
      en: 'It comes from the Sermon on the Mount (Matthew 5:41): a Roman soldier could compel you to carry his pack for one mile.',
    },
    category: 'quotidien',
    difficulty: 1,
  },
  {
    id: 'en-the-last-straw',
    expression: 'The last straw',
    definition: {
      fr: 'Le petit élément final qui rend une situation intolérable.',
      en: 'The final small element that makes a situation unbearable.',
    },
    literal: {
      fr: 'La dernière paille.',
      en: 'The last straw.',
    },
    origin: {
      fr: 'Ellipse du proverbe « c’est la dernière paille qui rompt le dos du chameau », popularisé par Dickens au XIXᵉ siècle.',
      en: 'Short for the proverb “the last straw breaks the camel’s back”, popularized by Dickens in the 19th century.',
    },
    category: 'quotidien',
    difficulty: 2,
  },
  {
    id: 'en-speak-of-the-devil',
    expression: 'Speak of the devil',
    definition: {
      fr: 'Se dit quand la personne dont on parle apparaît au même moment.',
      en: 'Said when the person being talked about appears at that very moment.',
    },
    literal: {
      fr: 'Parler du diable.',
      en: 'To speak of the devil.',
    },
    origin: {
      fr: 'Raccourci du proverbe du XVIᵉ siècle : « talk of the Devil and he will presently appear ».',
      en: 'Short for the 16th-century proverb: “talk of the Devil and he will presently appear”.',
    },
    category: 'quotidien',
    difficulty: 1,
  },
  {
    id: 'en-on-cloud-nine',
    expression: 'On cloud nine',
    definition: {
      fr: 'Extremement heureux, au septième ciel.',
      en: 'Extremely happy, on top of the world.',
    },
    literal: {
      fr: 'Sur le nuage numéro neuf.',
      en: 'On cloud number nine.',
    },
    origin: null,
    category: 'quotidien',
    difficulty: 2,
  },
  {
    id: 'en-ball-in-your-court',
    expression: 'The ball is in your court',
    definition: {
      fr: 'C’est à toi de décider ou d’agir maintenant.',
      en: 'It is your turn to decide or act now.',
    },
    literal: {
      fr: 'La balle est dans ton camp.',
      en: 'The ball is in your court.',
    },
    origin: {
      fr: 'Métaphore sportive (tennis) passée dans la langue courante au XXᵉ siècle.',
      en: 'A sports (tennis) metaphor that entered everyday language in the 20th century.',
    },
    category: 'quotidien',
    difficulty: 1,
  },
  {
    id: 'en-devils-advocate',
    expression: 'Play devil’s advocate',
    definition: {
      fr: 'Défendre volontairement un avis contraire pour faire avancer le débat.',
      en: 'To deliberately argue the opposite view to advance the debate.',
    },
    literal: {
      fr: 'Jouer l’avocat du diable.',
      en: 'To play the devil’s lawyer.',
    },
    origin: {
      fr: 'Dans le procès de canonisation de l’Église catholique, l’« advocatus diaboli » avait pour rôle de plaider contre la sainteté du candidat.',
      en: 'In the Catholic Church’s canonization process, the “advocatus diaboli” was tasked with arguing against the candidate’s saintliness.',
    },
    category: 'quotidien',
    difficulty: 2,
  },
]
