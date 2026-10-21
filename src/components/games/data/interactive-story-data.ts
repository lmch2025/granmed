/**
 * Données des Histoires Interactives (gameId 'interactive-story').
 *
 * Deux récits à embranchements, chacun disponible en français et en anglais.
 * IMPORTANT : les versions FR et EN partagent EXACTEMENT le même graphe
 * (mêmes identifiants de nœuds, mêmes destinations de choix) mais l'écriture
 * est une véritable adaptation culturelle localisée — pas une traduction
 * littérale (noms, lieux et saveur changent selon la langue).
 *
 * Structure de chaque histoire :
 * - un nœud de départ ;
 * - des nœuds de chapitre avec 2-3 choix menant à des chemins différents ;
 * - 3 nœuds de fin (propriété `ending`), sans choix.
 */

export interface StoryChoice {
  label: string
  next: string
}

export interface StoryNode {
  id: string
  title: string
  paragraphs: string[]
  choices: StoryChoice[]
  ending?: { name: string; emoji: string }
}

export interface Story {
  id: string
  title: { fr: string; en: string }
  cover: string
  nodes: Record<'fr' | 'en', Record<string, StoryNode>>
}

/* ======================================================================
 * HISTOIRE 1 — « Le Jardin de Grand-Mère » 🌻
 * Personnages FR : Mamie Jeanne, Papy Robert (disparu), les voisins
 * Léo et ses jumeaux, Mme Rosa — village de Sainte-Colombe.
 * ====================================================================== */

const GARDEN_FR: Record<string, StoryNode> = {
  'g-start': {
    id: 'g-start',
    title: 'Un été chez Mamie Jeanne',
    paragraphs: [
      "Les vacances commencent toujours pareil : le train, la grand-rue de Sainte-Colombe, et la barrière verte qui grince pour dire bonjour. Cette année pourtant, quelque chose cloche.",
      "Le jardin de Mamie Jeanne, d'habitude fier comme un dimanche, semble fatigué. Les tournesols baissent la tête, la terre est craquelée, et le vieux banc reste vide.",
      "Votre valise posée sur le chemin, vous hésitez un instant. Il faudrait peut-être faire quelque chose.",
    ],
    choices: [
      { label: 'Courir embrasser Mamie et lui demander des nouvelles', next: 'g-mamie' },
      { label: 'Faire d\u2019abord le tour du jardin, en douceur', next: 'g-tour' },
    ],
  },
  'g-mamie': {
    id: 'g-mamie',
    title: 'Le sourire fatigué de Mamie',
    paragraphs: [
      "Mamie Jeanne vous serre très fort ; ses mains sentent la menthe et le savon. « Te voilà enfin ! » Puis son regard glisse vers la fenêtre, et le sourire s'effrite un peu.",
      "« L'été est trop sec, mon cœur. Mes genoux grincent autant que la barrière, et l'arrosoir pèse une tonne. » Elle soupire : « Dans dix jours, c'est la fête des récoltes au village. J'aurais tant voulu que le jardin soit beau. »",
      "Puis elle secoue la tête en riant doucement : « Mais te voilà, tout de même. Ça, c'est déjà une belle récolte. »",
    ],
    choices: [
      { label: 'Proposer un plan de sauvetage, dès ce soir', next: 'g-plan' },
      { label: 'Lui demander s\u2019il existe un secret de famille pour ce jardin', next: 'g-secret' },
    ],
  },
  'g-tour': {
    id: 'g-tour',
    title: 'Le tour du propriétaire',
    paragraphs: [
      "Vous marchez entre les rangées. Les tomates pendouillent, le bassin n'est plus qu'une flaque polie, et les roses de Mme Rosa, de l'autre côté de la haie, semblent se moquer un peu.",
      "Dans le petit abri, pêle-mêle : un rateau fatigué, des ficelles, et un arrosoir en zinc gravé d'un « R. » majuscule. Vous ne l'aviez jamais remarqué.",
      "Au-dessus de l'abri, le grenier garde peut-être des trésors d'un autre temps.",
    ],
    choices: [
      { label: 'Arroser les tomates tout de suite', next: 'g-tomates' },
      { label: 'Monter au grenier voir le vieux matériel', next: 'g-grenier' },
    ],
  },
  'g-plan': {
    id: 'g-plan',
    title: 'Le plan de sauvetage',
    paragraphs: [
      "Ce soir, sur une serviette à carreaux, Mamie Jeanne dessine le jardin comme une carte au trésor. « L'eau le matin, tôt, avant que le soleil n'ait des idées. Du paillage pour garder l'humidité. Et on bavarde en travaillant — ça, c'est obligatoire. »",
      "Elle vous regarde par-dessus ses lunettes : « Papy Robert aurait adoré te voir tricher ainsi avec la météo. »",
    ],
    choices: [
      { label: 'Biner et pailler les rangées dès demain matin', next: 'g-paillage' },
      { label: 'Chercher le vieux matériel de Papy au grenier', next: 'g-grenier' },
    ],
  },
  'g-secret': {
    id: 'g-secret',
    title: 'Le secret de famille',
    paragraphs: [
      "Un sourire mystérieux passe sur le visage de Mamie Jeanne. « Un secret, dis-tu ? » Elle tapote le bord de son tablier. « Papy Robert répétait que son potager tenait debout grâce au secret du grenier. »",
      "« Il ne m'a jamais tout dit. Ou plutôt… il l'a écrit, quelque part, là-haut. » Et elle vous fait un clin d'œil de complice.",
    ],
    choices: [
      { label: 'Monter au grenier sur la pointe des pieds', next: 'g-grenier' },
      { label: 'Prendre d\u2019abord le goûter avec elle sous le tilleul', next: 'g-gouter' },
    ],
  },
  'g-tomates': {
    id: 'g-tomates',
    title: 'Des tomates comme des vieilles amies',
    paragraphs: [
      "Vous arrosez au pied, sans mouiller les feuilles, comme Mamie vous l'a montré cent fois. Elle arrive avec deux tabourets et s'installe à côté de vous.",
      "« Celle-ci, c'est la Marmande de ta marraine. La verte, une Pomme d'Amour qui a fait pleurer ton oncle de rire. » Chaque plant a un nom, une histoire, un côté de la famille.",
      "Sur l'appui de la fenêtre, un bocal de graines séchées attend patiemment.",
    ],
    choices: [
      { label: 'Récolter des graines avec elle pour l\u2019an prochain', next: 'g-semis' },
      { label: 'Aller voir ce fameux grenier', next: 'g-grenier' },
    ],
  },
  'g-paillage': {
    id: 'g-paillage',
    title: 'Paille, binage et commères',
    paragraphs: [
      "Le lendemain, le jardin sent la terre fraîche. Vous binez, vous étalez la tonte de gazon entre les rangs : le sol respire déjà mieux.",
      "Au-dessus de la haie, une tête curieuse apparaît : Léo, le voisin, ses jumeaux juchés sur les épaules. « Dis donc, on joue les jardins en plein air, ici ? »",
      "Du balcon, Mme Rosa renifle avec intérêt. Tout le quartier a les yeux tournés vers le jardin.",
    ],
    choices: [
      { label: 'Inviter les voisins à donner un coup de main', next: 'g-voisins' },
      { label: 'Faire une pause goûter sous le tilleul', next: 'g-gouter' },
    ],
  },
  'g-grenier': {
    id: 'g-grenier',
    title: 'Le grenier à secrets',
    paragraphs: [
      "L'escalier grince, et l'odeur de pommes et de bois ancien descend à votre rencontre. Dans la lumière dansante : des outils suspendus, un semoir d'un autre siècle.",
      "Sur l'établi trône un coffret en cèdre, fermé d'un petit cadenas en laiton. Il n'attend que vous — mais il faut la clé.",
      "Juste en dessous, une étiquette à moitié effacée : « À J., pour toujours. R. »",
    ],
    choices: [
      { label: 'Chercher la clé dans l\u2019atelier, en bas', next: 'g-cle-atelier' },
      { label: 'Redescendre demander la clé à Mamie', next: 'g-cle-mamie' },
    ],
  },
  'g-cle-atelier': {
    id: 'g-cle-atelier',
    title: 'La clé dans la boîte à graines',
    paragraphs: [
      "Dans l'atelier, entre les pots de confiture retournés et les étiquettes jaunies, une boîte à graines en fer rouillé. Dedans, ficelées, des enveloppes kraft — et une minuscule clé de laiton.",
      "Le cœur battant, vous la frottez sur votre manche. Elle brille comme une promesse.",
    ],
    choices: [
      { label: 'Monter ouvrir le coffret sans plus attendre', next: 'g-coffret' },
      { label: 'Apporter la clé à Mamie pour ouvrir ensemble', next: 'g-cle-mamie' },
    ],
  },
  'g-cle-mamie': {
    id: 'g-cle-mamie',
    title: 'La clé contre un baiser',
    paragraphs: [
      "Mamie Jeanne fouille dans la poche de son tablier, hésite, puis vous tend une petite clé attachée à un ruban usé. « Je l'ai portée des années, contre mon cœur. »",
      "« Papy Robert disait toujours : ce coffret s'ouvrira le jour où quelqu'un de curieux et de tendre le méritera. » Elle vous embrasse sur le front : « Va, je monte avec toi. »",
    ],
    choices: [
      { label: 'Ouvrir le coffret ensemble', next: 'g-coffret' },
      { label: 'La remercier d\u2019abord en préparant le goûter', next: 'g-gouter' },
    ],
  },
  'g-coffret': {
    id: 'g-coffret',
    title: 'Le coffret de cèdre',
    paragraphs: [
      "La clé tourne avec un petit clic de montre. À l'intérieur : un carnet à couverture toilée, des paquets de graines soigneusement pliés, et une photo noir et blanc de deux jeunes gens riant au milieu des tomates.",
      "Sur chaque paquet, une écriture appliquée : « Cœur de Mamie, 1961 — garder pour les années tristes. »",
      "Mamie Jeanne pose la main sur le carnet. « Le jardinier est rentré », murmure-t-elle.",
    ],
    choices: [
      { label: 'Dévorer le carnet de Papy Robert', next: 'g-journal' },
      { label: 'Semer ces graines précieuses dès demain', next: 'g-semis' },
    ],
  },
  'g-journal': {
    id: 'g-journal',
    title: 'Le carnet du jardinier',
    paragraphs: [
      "Page après page, l'écriture ferme de Papy Robert note tout : la lune, la pluie, les limaces déjouées. Et entre les lignes, une philosophie : « Arroser le matin, remercier le soir. Parler aux plants, ça ne coûte rien et ça fait du bien au jardinier. »",
      "La dernière page est presque blanche. Une seule phrase : « Le vrai secret d'un jardin, c'est d'avoir quelqu'un pour l'aimer. »",
      "Mamie Jeanne essuie une lueur en riant : « Le garnement. Il me l'a écrite pour moi. »",
    ],
    choices: [
      { label: 'Reconstituer le carré de Papy selon le carnet', next: 'g-fin-secret' },
      { label: 'Partager les graines avec tout le quartier', next: 'g-voisins' },
    ],
  },
  'g-voisins': {
    id: 'g-voisins',
    title: 'Le jardin s\u2019agrandit',
    paragraphs: [
      "Le samedi suivant, ils sont tous là : Léo et ses jumeaux armés de petits arrosoirs, Mme Rosa et ses boutures de roses, même le boulanger, « de passage », avec des croissants.",
      "Chacun adopte un rang, une plante, un coin. En un après-midi, le jardin de Mamie devient le jardin de tout le monde.",
      "Léo s'essuie le front : « Il faudrait faire quelque chose de tout ça pour la fête du village… »",
    ],
    choices: [
      { label: 'Organiser une fête des récoltes digne de ce nom', next: 'g-fete-prep' },
      { label: 'Apprendre aux enfants à semer', next: 'g-semis' },
    ],
  },
  'g-gouter': {
    id: 'g-gouter',
    title: 'Le goûter sous le tilleul',
    paragraphs: [
      "Sous le tilleul : la nappe à carreaux, le pain d'épices, et le thé de Mamie dans les tasses fleuries. Le temps ralentit d'un coup.",
      "Elle raconte Papy Robert, leurs premières tomates, l'hiver du grand gel où tout le village avait partagé ses graines. « Un jardin, c'est des souvenirs qu'on arrose. »",
      "Avant que vous repartiez, elle vous glisse dans la main une enveloppe kraft : des graines, et un mot — « À toi, pour continuer. »",
    ],
    choices: [
      { label: 'Semer ensemble les graines de Mamie', next: 'g-semis' },
      { label: 'Sonner chez les voisins pour une grande journée jardin', next: 'g-voisins' },
    ],
  },
  'g-fete-prep': {
    id: 'g-fete-prep',
    title: 'Dix jours pour une fête',
    paragraphs: [
      "Pendant dix jours, le quartier s'affaire : guirlandes entre les pommiers, confitures étiquetées, concours de la plus belle tomate annoncé sur des panneaux peints. Mamie Jeanne préside tout, électrisée.",
      "La veille de la fête, le jardin brille de mille feux doux. « C'est fou », souffle Léo. « On dirait qu'il attendait ça depuis des années. »",
    ],
    choices: [
      { label: 'Ouvrir les festivités au village', next: 'g-fin-fete' },
      { label: 'Garder une enveloppe de graines pour l\u2019an prochain', next: 'g-fin-graine' },
    ],
  },
  'g-semis': {
    id: 'g-semis',
    title: 'Le soir des semis',
    paragraphs: [
      "Le soleil descend quand vous semez enfin le carré du fond. Mamie Jeanne guide vos mains : « Pas trop profond. Les graines savent faire le reste — elles ont juste besoin qu'on leur fasse confiance. »",
      "Vous arrosez en pluie fine. Elle reste longtemps silencieuse, les mains pleines de terre, puis sourit : « Voilà. On vient de planter un petit bout de demain. »",
    ],
    choices: [
      { label: 'Lui promettre de revenir chaque été', next: 'g-fin-graine' },
      { label: 'Inscrire le jardin au concours de la fête du village', next: 'g-fete-prep' },
    ],
  },
  'g-fin-fete': {
    id: 'g-fin-fete',
    title: 'La plus belle des fêtes',
    paragraphs: [
      "Le jour J, la foule déborde de la grand-rue jusqu'à la barrière verte. Les tomates « Cœur de Mamie » remportent une mention spéciale du jury, et les jumeaux de Léo courent la relaye avec des parts de tarte.",
      "Quand la fanfare se tait, le maire s'approche de Mamie Jeanne : « Votre jardin a réconcilié tout le village avec l'été. »",
      "Assise sur son banc, entourée, elle vous adresse un petit signe discret. La fête des récoltes ne s'est jamais aussi bien portée.",
    ],
    choices: [],
    ending: { name: 'La fête des récoltes', emoji: '🎉' },
  },
  'g-fin-secret': {
    id: 'g-fin-secret',
    title: 'Le carré de Papy Robert',
    paragraphs: [
      "En une semaine, le carré renaît selon le carnet : les tuteurs en fagots, la capucine au pied des tomates, la sauge au coin nord, comme en 1961.",
      "Un matin, Mamie Jeanne trouve le carnet ouvert sur le banc, à la dernière page. Elle s'assoit et pose sa main à plat sur le bois.",
      "« Le secret du grenier, dit-elle doucement. Il n'a jamais été enfermé — il attendait juste qu'on vienne le lire. » Autour d'elle, le jardin semble hocher la tête.",
    ],
    choices: [],
    ending: { name: 'Le secret du grenier', emoji: '🗝️' },
  },
  'g-fin-graine': {
    id: 'g-fin-graine',
    title: 'Ce qui pousse après l\u2019été',
    paragraphs: [
      "À la fin de l'été, vous repartez avec une valise plus légère et une enveloppe plus lourde : « Cœur de Mamie, génération 2 », écrit de votre main.",
      "Au printemps suivant, chez vous, le premier plant pointe. Vous prenez l'habitude d'arroser le matin, de remercier le soir, de raconter votre journée aux feuilles.",
      "Quelque part, un vieux jardin rit sous cape. Une graine pour demain, c'est planté.",
    ],
    choices: [],
    ending: { name: 'Une graine pour demain', emoji: '🌱' },
  },
}

/* --- Version anglaise : « Grandma's Garden » — adaptation locale
 * (Grandma June, Grandpa Robert, Cedarville, Sam et ses jumeaux, Mme Rosie). --- */

const GARDEN_EN: Record<string, StoryNode> = {
  'g-start': {
    id: 'g-start',
    title: "A Summer at Grandma June's",
    paragraphs: [
      "Every summer starts the same: the rattling bus, Cedarville's main street, and the green gate squeaking its welcome. This year, though, something feels wrong.",
      "Grandma June's garden — usually proud as a Sunday roast — looks worn out. The sunflowers droop, the ground is cracked, and the old bench sits empty.",
      "You set your duffel bag down on the path and stand there a moment. Somebody should do something.",
    ],
    choices: [
      { label: "Run inside for a hug and ask Grandma what's wrong", next: 'g-mamie' },
      { label: 'Take a quiet lap around the garden first', next: 'g-tour' },
    ],
  },
  'g-mamie': {
    id: 'g-mamie',
    title: "Grandma's Tired Smile",
    paragraphs: [
      "Grandma June hugs you tight; her hands smell of mint and soap. “There you are!” Then her gaze drifts to the window, and the smile fades a little.",
      "“Too dry a summer, sweetheart. My knees creak like the gate, and the watering can weighs a ton.” She sighs. “The harvest fair is in ten days. I so wanted the garden to look proud.”",
      "Then she laughs softly, shaking her head. “But here you are. That's a fine harvest already.”",
    ],
    choices: [
      { label: 'Offer to draw up a rescue plan tonight', next: 'g-plan' },
      { label: 'Ask if there is a family secret to this garden', next: 'g-secret' },
    ],
  },
  'g-tour': {
    id: 'g-tour',
    title: 'A Walk Around',
    paragraphs: [
      "You stroll between the rows. Tomatoes hang limp, the pond is down to a polished puddle, and Mrs. Rosie's roses next door seem just a little smug.",
      "Inside the shed: a weary rake, a ball of twine, and a zinc watering can engraved with a capital “R.” You have never noticed it before.",
      "The attic above the shed may keep treasures from another time.",
    ],
    choices: [
      { label: 'Water the tomatoes right away', next: 'g-tomates' },
      { label: 'Climb up to the attic for the old tools', next: 'g-grenier' },
    ],
  },
  'g-plan': {
    id: 'g-plan',
    title: 'The Rescue Plan',
    paragraphs: [
      "That evening, on a checkered dish towel, Grandma June sketches the garden like a treasure map. “Water early, before the sun gets ideas. Mulch to hold the damp. And we chat while we work — that part is mandatory.”",
      "She peers at you over her glasses. “Grandpa Robert would have loved watching you cheat the weather like this.”",
    ],
    choices: [
      { label: 'Hoe and mulch the rows first thing tomorrow', next: 'g-paillage' },
      { label: "Dig through Grandpa's old tools in the attic", next: 'g-grenier' },
    ],
  },
  'g-secret': {
    id: 'g-secret',
    title: 'The Family Secret',
    paragraphs: [
      "A mysterious little smile crosses Grandma June's face. “A secret, is it?” She pats the hem of her apron. “Grandpa Robert used to say his vegetable patch stood tall thanks to the attic secret.”",
      "“He never told me everything. Or rather… he wrote it down, somewhere up there.” She winks like a co-conspirator.",
    ],
    choices: [
      { label: 'Climb to the attic on tiptoe', next: 'g-grenier' },
      { label: 'Take afternoon snacks with her under the maple first', next: 'g-gouter' },
    ],
  },
  'g-tomates': {
    id: 'g-tomates',
    title: 'Tomatoes Like Old Friends',
    paragraphs: [
      "You water at the base, keeping the leaves dry, the way Grandma has shown you a hundred times. She comes out with two stools and settles in beside you.",
      "“This one is your godmother's Marmande. The green one, a Love Apple that made your uncle laugh till he cried.” Every plant has a name, a story, a branch of the family.",
      "On the windowsill, a jar of dried seeds waits patiently.",
    ],
    choices: [
      { label: 'Gather seeds with her for next year', next: 'g-semis' },
      { label: 'Go see that famous attic', next: 'g-grenier' },
    ],
  },
  'g-paillage': {
    id: 'g-paillage',
    title: 'Straw, Hoeing and Busybodies',
    paragraphs: [
      "Next morning, the garden smells of fresh soil. You hoe, you spread grass clippings between the rows: the ground already breathes easier.",
      "Over the hedge, a curious head pops up — Sam from next door, twins riding on his shoulders. “Well, look at this open-air gardening show!”",
      "From her balcony, Mrs. Rosie sniffs with interest. The whole street has its eyes on the garden.",
    ],
    choices: [
      { label: 'Invite the neighbors to lend a hand', next: 'g-voisins' },
      { label: 'Take a snack break under the maple', next: 'g-gouter' },
    ],
  },
  'g-grenier': {
    id: 'g-grenier',
    title: 'The Attic of Secrets',
    paragraphs: [
      "The stairs complain, and the smell of apples and old wood comes down to meet you. In the dancing light: hanging tools, a seed drill from another century.",
      "On the workbench stands a cedar box, shut with a small brass lock. It seems to be waiting for you — but you will need the key.",
      "Just beneath it, a half-faded label: “To J., forever. R.”",
    ],
    choices: [
      { label: 'Hunt for the key in the workshop downstairs', next: 'g-cle-atelier' },
      { label: 'Go back down and ask Grandma for the key', next: 'g-cle-mamie' },
    ],
  },
  'g-cle-atelier': {
    id: 'g-cle-atelier',
    title: 'The Key in the Seed Box',
    paragraphs: [
      "In the workshop, between upturned jam jars and yellowed labels, sits a rusty tin seed box. Inside, tied with string: kraft envelopes — and one tiny brass key.",
      "Heart thumping, you rub it on your sleeve. It shines like a promise.",
    ],
    choices: [
      { label: 'Run up and open the box at once', next: 'g-coffret' },
      { label: 'Bring the key to Grandma to open it together', next: 'g-cle-mamie' },
    ],
  },
  'g-cle-mamie': {
    id: 'g-cle-mamie',
    title: 'A Key for a Kiss',
    paragraphs: [
      "Grandma June digs into her apron pocket, hesitates, then hands you a small key on a worn ribbon. “I carried it for years, right against my heart.”",
      "“Grandpa Robert always said: that box will open the day someone curious and kind comes along.” She kisses your forehead. “Come — I'll climb with you.”",
    ],
    choices: [
      { label: 'Open the box together', next: 'g-coffret' },
      { label: 'Thank her first by fixing afternoon snacks', next: 'g-gouter' },
    ],
  },
  'g-coffret': {
    id: 'g-coffret',
    title: 'The Cedar Box',
    paragraphs: [
      "The key turns with a soft watchmaker's click. Inside: a canvas-covered notebook, carefully folded seed packets, and a black-and-white photo of two young people laughing among tomato vines.",
      "On each packet, in careful handwriting: “Grandma's Heart, 1961 — keep for the sad years.”",
      "Grandma June lays her hand on the notebook. “The gardener has come home,” she whispers.",
    ],
    choices: [
      { label: "Devour Grandpa Robert's notebook", next: 'g-journal' },
      { label: 'Sow those precious seeds tomorrow', next: 'g-semis' },
    ],
  },
  'g-journal': {
    id: 'g-journal',
    title: "The Gardener's Notebook",
    paragraphs: [
      "Page after page, Grandpa Robert's steady hand notes it all: the moon, the rain, outfoxed slugs. And between the lines, a whole philosophy: “Water in the morning, give thanks in the evening. Talk to your plants — costs nothing, does the gardener good.”",
      "The last page is nearly blank. One sentence only: “The real secret of a garden is having someone to love it.”",
      "Grandma June laughs while wiping a tear. “The rascal. He wrote that for me.”",
    ],
    choices: [
      { label: "Rebuild Grandpa's plot by the notebook", next: 'g-fin-secret' },
      { label: 'Share the seeds with the whole street', next: 'g-voisins' },
    ],
  },
  'g-voisins': {
    id: 'g-voisins',
    title: 'The Garden Grows Bigger',
    paragraphs: [
      "The following Saturday, they all show up: Sam and his twins armed with tiny watering cans, Mrs. Rosie with rose cuttings, even the baker, “just passing by,” with a box of doughnuts.",
      "Everyone adopts a row, a plant, a corner. In one afternoon, Grandma's garden becomes everyone's garden.",
      "Sam wipes his brow. “We ought to do something with all this for the town fair…”",
    ],
    choices: [
      { label: 'Throw a proper harvest fair', next: 'g-fete-prep' },
      { label: 'Teach the kids how to sow seeds', next: 'g-semis' },
    ],
  },
  'g-gouter': {
    id: 'g-gouter',
    title: 'Snacks Under the Maple',
    paragraphs: [
      "Under the maple: the checkered cloth, warm cornbread, and Grandma's sweet tea in flowered cups. Time slows right down.",
      "She tells about Grandpa Robert, their first tomatoes, the winter of the big freeze when the whole town shared its seeds. “A garden is just memories you water.”",
      "Before you leave the table, she presses a kraft envelope into your hand: seeds, and a note — “Yours now. Keep it going.”",
    ],
    choices: [
      { label: "Sow Grandma's seeds together", next: 'g-semis' },
      { label: 'Knock on the neighbors\u2019 doors for a big garden day', next: 'g-voisins' },
    ],
  },
  'g-fete-prep': {
    id: 'g-fete-prep',
    title: 'Ten Days to the Fair',
    paragraphs: [
      "For ten days the street bustles: bunting strung between the apple trees, labeled jam jars, a best-tomato contest announced on hand-painted signs. Grandma June runs it all, electrified.",
      "The night before the fair, the garden glows with soft lights. “It's uncanny,” Sam whispers. “As if it had been waiting for this for years.”",
    ],
    choices: [
      { label: 'Open the festivities with the whole town', next: 'g-fin-fete' },
      { label: 'Pocket a seed envelope for next year', next: 'g-fin-graine' },
    ],
  },
  'g-semis': {
    id: 'g-semis',
    title: 'Sowing Evening',
    paragraphs: [
      "The sun sinks low as you finally sow the back plot. Grandma June guides your hands: “Not too deep. Seeds know the rest — they just need someone to trust them.”",
      "You water a fine rain over the bed. She stays silent a long while, hands full of soil, then smiles. “There. We just planted a little piece of tomorrow.”",
    ],
    choices: [
      { label: 'Promise to come back every summer', next: 'g-fin-graine' },
      { label: 'Enter the garden in the town fair contest', next: 'g-fete-prep' },
    ],
  },
  'g-fin-fete': {
    id: 'g-fin-fete',
    title: 'The Fairest of Them All',
    paragraphs: [
      "On the big day, the crowd spills from Main Street all the way to the green gate. The “Grandma's Heart” tomatoes win a special mention from the judges, and Sam's twins run relay with slices of pie.",
      "When the band falls quiet, the mayor steps over to Grandma June. “Your garden made peace between this whole town and the summer.”",
      "Sitting on her bench, surrounded on every side, she gives you a small secret wave. The harvest fair has never gone so well.",
    ],
    choices: [],
    ending: { name: 'The Harvest Fair', emoji: '🎉' },
  },
  'g-fin-secret': {
    id: 'g-fin-secret',
    title: "Grandpa Robert's Plot",
    paragraphs: [
      "In one week, the plot comes back to life by the book: twig teepees, nasturtiums at the tomatoes' feet, sage in the north corner, just like 1961.",
      "One morning, Grandma June finds the notebook open on the bench, at the very last page. She sits down and lays her hand flat on the wood.",
      "“The attic secret,” she says softly. “It was never locked away — it was only waiting for someone to come and read it.” Around her, the garden seems to nod.",
    ],
    choices: [],
    ending: { name: 'The Attic Secret', emoji: '🗝️' },
  },
  'g-fin-graine': {
    id: 'g-fin-graine',
    title: 'What Grows After Summer',
    paragraphs: [
      "At summer's end you go home with a lighter bag and one heavier envelope: “Grandma's Heart, generation 2,” in your own handwriting.",
      "The following spring, back home, the first seedling breaks through. You take to watering in the morning, giving thanks in the evening, telling your day to the leaves.",
      "Somewhere, an old garden chuckles. A seed for tomorrow, planted.",
    ],
    choices: [],
    ending: { name: 'A Seed for Tomorrow', emoji: '🌱' },
  },
}

/* ======================================================================
 * HISTOIRE 2 — « La Lettre au Fond du Tiroir » ✉️
 * Personnages FR : le gardien M. Baptiste, Madame Alice Roussel,
 * le boulanger Léon, Henri Roussel (marin parti au Portel), 1962.
 * ====================================================================== */

const LETTER_FR: Record<string, StoryNode> = {
  'l-start': {
    id: 'l-start',
    title: 'Un samedi de pluie',
    paragraphs: [
      "Il pleut sur la rue des Lilas, un samedi sans horaire. M. Baptiste, le gardien, vous recrute pour trier le vieux meuble de la loge : « Un tiroir par personne. On ne garde que l'essentiel. »",
      "Au fond du vôtre, sous des factures jaunies : une enveloppe fine, à l'encre passée. « Madame Alice Roussel, appartement 32. » Pas de timbre, pas de tampon. Juste un cachet de cire frappé d'une ancre.",
      "Personne n'a ouvert ce tiroir depuis très longtemps.",
    ],
    choices: [
      { label: 'Monter sonner chez Madame Alice', next: 'l-alice' },
      { label: 'Examiner l\u2019enveloppe à la loupe', next: 'l-enveloppe' },
    ],
  },
  'l-alice': {
    id: 'l-alice',
    title: 'La sonnette du 32',
    paragraphs: [
      "Deux étages, un couloir qui sent la cire et la lavande. Madame Alice ouvre — petite, droite, des yeux vifs derrière des lunettes rondes.",
      "Elle voit l'enveloppe, et pendant trois secondes plus rien ne bouge. « Où donc l'avez-vous trouvée ? » Derrière elle, la bouilloire siffle comme un rappel.",
    ],
    choices: [
      { label: 'Lui tendre la lettre sans un mot', next: 'l-lecture' },
      { label: 'Lui demander d\u2019abord son histoire', next: 'l-histoire' },
    ],
  },
  'l-enveloppe': {
    id: 'l-enveloppe',
    title: 'L\u2019encre, la cire, l\u2019ancre',
    paragraphs: [
      "À la loupe du gardien, l'enveloppe livre ses secrets : un papier vergé, une écriture penchée qui appuie sur les R, et ce cachet de cire frappé d'une ancre. Initiales : H.R.",
      "M. Baptiste fronce les sourcils : « Ce tiroir était déjà à mon père. H. quelque chose… Un locataire d'avant ? Un voisin ? »",
      "Il désigne la trappe du sous-sol : « La réponse dort peut-être dans le registre. »",
    ],
    choices: [
      { label: 'Demander au concierge ce qu\u2019il sait vraiment', next: 'l-concierge' },
      { label: 'Aller interroger le boulanger, mémoire du quartier', next: 'l-boulanger' },
    ],
  },
  'l-concierge': {
    id: 'l-concierge',
    title: 'La mémoire du gardien',
    paragraphs: [
      "Dans la loge, entre deux cartons, M. Baptiste se souvient par morceaux : un monsieur qui sifflait en montant l'escalier, des journaux pliés sous le bras, un départ « pour la mer » au printemps.",
      "« Mon père notait tout dans le registre des locataires, à la cave. Si votre H. a habité ici, il y est forcément. »",
    ],
    choices: [
      { label: 'Descendre fouiller le registre à la cave', next: 'l-registre' },
      { label: 'Prendre le chemin de la boulangerie', next: 'l-boulanger' },
    ],
  },
  'l-boulanger': {
    id: 'l-boulanger',
    title: 'Le boulanger qui sait tout',
    paragraphs: [
      "Chez Léon, le comptoir est tiède et l'odeur de pain raconte la semaine du quartier. Il ajuste ses lunettes sur l'enveloppe et s'illumine : « Mais… c'est l'écriture d'Henri ! »",
      "« Henri, le vendeur de journaux de la place. Fou de la mer. Parait-il qu'il écrivait des lettres et n'en postait aucune. » Il soupire : « Allez le chercher là où l'eau est salée. »",
      "Sur le dos d'un ticket de commande, il griffonne un nom de port.",
    ],
    choices: [
      { label: 'Monter sonner chez Madame Alice', next: 'l-alice' },
      { label: 'Suivre la piste du kiosque à journaux', next: 'l-kiosque' },
    ],
  },
  'l-histoire': {
    id: 'l-histoire',
    title: '1962, racontée par Alice',
    paragraphs: [
      "Autour du thé, Alice parle comme on déplie un papier précieux. En 1962, elle avait vingt ans et un fiancé trop sage. Henri vendait les journaux de la place et lui gardait le dernier exemplaire, chaque soir.",
      "« Il m'écrivait des lettres, m'a-t-on rapporté plus tard. Des lettres qu'il n'osait pas donner. » Elle lisse la nappe : « Le soir, je lisais tard, persuadée que minuit portait conseil. Quelle idée — le matin est bien plus sage. »",
      "Un printemps, Henri est parti sans un mot vers le grand large. L'enveloppe n'est jamais arrivée.",
    ],
    choices: [
      { label: 'Ouvrir l\u2019enveloppe ensemble', next: 'l-lecture' },
      { label: 'Lui promettre de retrouver Henri', next: 'l-enquete' },
    ],
  },
  'l-lecture': {
    id: 'l-lecture',
    title: 'La lettre, enfin ouverte',
    paragraphs: [
      "La cire cède avec un petit craquement. La lettre tient une page, à l'encre brune : des nouvelles du port, une blague sur les mouettes, et cette phrase à la fin : « Si un jour tu lis ceci, sonne deux fois à ma porte. »",
      "Alice relit trois fois la dernière ligne. Puis elle rit, d'un rire tout neuf : « Il aurait pu sonner lui-même, le poltron. »",
    ],
    choices: [
      { label: 'Rester pour le thé de quatre heures', next: 'l-the' },
      { label: 'Lui proposer de retrouver Henri', next: 'l-enquete' },
    ],
  },
  'l-registre': {
    id: 'l-registre',
    title: 'Le registre de la cave',
    paragraphs: [
      "À la lampe, dans l'odeur de la pierre froide, le grand cahier cuir s'ouvre sur les années soixante. Et là, entre deux noms raturés : « Roussel, Henri — marin. Sortie : printemps 1963. »",
      "En marge, de la main de l'ancien gardien : « Parti rejoindre l'oncle, gardien du sémaphore, côté Portel. »",
      "L'ancre du cachet de cire avait donc bien un port d'attache.",
    ],
    choices: [
      { label: 'Suivre la piste jusqu\u2019au port', next: 'l-kiosque' },
      { label: 'Monter tout raconter à Madame Alice', next: 'l-alice' },
    ],
  },
  'l-kiosque': {
    id: 'l-kiosque',
    title: 'Là où l\u2019eau devient salée',
    paragraphs: [
      "Au Portel, la première personne à qui vous demandez votre chemin rit aux éclats : « Henri ? Tout le monde connaît Henri. La librairie du môle, celle avec les filets de pêche au plafond. »",
      "Dans l'arrière-boutique, entre deux théières, un homme aux mains de bois et d'écume relève la tête. Il a les yeux de 1962.",
    ],
    choices: [
      { label: 'Organiser les retrouvailles au bord de la mer', next: 'l-mer' },
      { label: 'Rentrer raconter la nouvelle au quartier', next: 'l-mur' },
    ],
  },
  'l-enquete': {
    id: 'l-enquete',
    title: 'L\u2019enquête de l\u2019ancre',
    paragraphs: [
      "Vous menez l'enquête comme dans les livres : le cachet à l'ancre, le registre de la cave, la mémoire du boulanger, le numéro de l'appartement. Chaque pièce s'emboîte, et le quartier entier s'y met — jusqu'à la mercière du Portel, qui répond à votre lettre.",
      "Une réponse arrive enfin, sur papier à pois, d'une écriture appliquée : « Dites à Alice que je garde toujours le dernier journal du soir pour elle. »",
      "Il ne reste qu'à choisir le dénouement.",
    ],
    choices: [
      { label: 'Organiser les retrouvailles au bord de la mer', next: 'l-mer' },
      { label: 'Rassembler tout le quartier pour la suite', next: 'l-mur' },
    ],
  },
  'l-the': {
    id: 'l-the',
    title: 'Le dimanche chez Alice',
    paragraphs: [
      "Le dimanche chez Alice, ce sont tasses fleuries, madeleines tièdes et conversation lente. La lettre trône sur la desserte, entre la photo de communion et l'horloge comtoise.",
      "Elle vous apprend à replier les serviettes « comme autrefois », vous raconte le quartier d'avant, les cloches, les récoltes du dimanche. « Vous savez, jeunes et vieux, ça se cultive comme un jardin — il suffit d'en prendre soin. »",
    ],
    choices: [
      { label: 'Revenir chaque dimanche pour le thé', next: 'l-fin-the' },
      { label: 'Proposer de retrouver Henri avant qu\u2019il ne soit trop tard', next: 'l-enquete' },
    ],
  },
  'l-mer': {
    id: 'l-mer',
    title: 'Le môle en bord de mer',
    paragraphs: [
      "Vous organisez le voyage comme une fête : le gardien prête sa voiture, le boulanger fournit le pain, et Alice ressort son chapeau du dimanche.",
      "Au bout du môle, Henri ferme sa librairie le temps d'un après-midi. Il sonne deux fois à la porte — comme dans la lettre — et Alice ouvre.",
      "Vous vous éloignez discrètement vers la digue. Certaines conversations n'ont pas besoin de public.",
    ],
    choices: [
      { label: 'Laisser la mer finir l\u2019histoire', next: 'l-fin-mer' },
      { label: 'Rentrer raconter cette histoire au quartier', next: 'l-fin-mur' },
    ],
  },
  'l-mur': {
    id: 'l-mur',
    title: 'Le mur aux lettres',
    paragraphs: [
      "De retour rue des Lilas, l'histoire court les étages. M. Baptiste ressort sa vieille boîte à outils et fixe une planche dans le hall : « Pour les lettres qu'on n'ose pas donner. »",
      "En un mois, le mur accueille des mots doux, des remerciements, des recettes, une invitation à l'opéra. Alice, élue « mémoire de l'immeuble », tient le registre des histoires.",
    ],
    choices: [
      { label: 'Laisser le mur grandir tout l\u2019hiver', next: 'l-fin-mur' },
      { label: 'Écrire sa première lettre — pour Henri', next: 'l-fin-mer' },
    ],
  },
  'l-fin-the': {
    id: 'l-fin-the',
    title: 'Les dimanches qui durent',
    paragraphs: [
      "Dimanche après dimanche, les tasses fleuries se remplissent. Alice vous apprend ses jeux de cartes, sa soupe, sa façon d'écouter la tête un peu penchée.",
      "La lettre reste sur la desserte, dans un petit cadre maintenant. « Non pas pour me souvenir de lui, dit-elle. Pour me souvenir qu'il n'est jamais trop tard pour sonner à une porte. »",
      "Rue des Lilas, tout le monde sait désormais que le dimanche à quatre heures, la bouilloire d'Alice chante — et qu'il y a toujours une tasse pour celui qui vient.",
    ],
    choices: [],
    ending: { name: 'Le thé de quatre heures', emoji: '🫖' },
  },
  'l-fin-mer': {
    id: 'l-fin-mer',
    title: 'Deux chaises au bout du môle',
    paragraphs: [
      "Années trop tard et juste à temps : la lettre a enfin trouvé sa lectrice, et son auteur, sa maison. Sur le môle, la librairie garde désormais deux chaises au lieu d'une.",
      "En vitrine, entre deux almanachs, une enveloppe au cachet d'ancre, encadrée. « Livrée, précise l'étiquette, soixante ans après — à un dimanche près. »",
      "Vous gardez la photo de cet après-midi-là : deux personnes qui rient, la mer derrière elles, comme en 1962.",
    ],
    choices: [],
    ending: { name: 'Une lettre en bord de mer', emoji: '🌊' },
  },
  'l-fin-mur': {
    id: 'l-fin-mur',
    title: 'Le hall des mots presque perdus',
    paragraphs: [
      "Tout l'hiver, le mur s'enrichit : une recette de confiture de prunes, des excuses qui attendaient dix ans, un dessin d'enfant pour le facteur. M. Baptiste ajoute une petite boîte aux lettres en laiton, « pour les cœurs lents ».",
      "Le jour de l'inauguration, Alice coupe le ruban avec des ciseaux de couturière et baptise le hall « musée des mots presque perdus ».",
      "Et tout en haut du mur, dans un cadre, la photocopie de la première lettre — celle qui a tout commencé.",
    ],
    choices: [],
    ending: { name: 'Le mur aux lettres', emoji: '📮' },
  },
}

/* --- Version anglaise : "The Letter at the Bottom of the Drawer" —
 * adaptation locale (Primrose Lane, le gardien Mr. Percy, Mrs. Alice Russell,
 * la boulangère Martha, Henry Ross, Saltmarsh Bay). --- */

const LETTER_EN: Record<string, StoryNode> = {
  'l-start': {
    id: 'l-start',
    title: 'A Rainy Saturday',
    paragraphs: [
      "Rain drums on Primrose Lane, a Saturday with nowhere to be. Mr. Percy, the caretaker, recruits you to sort the old cabinet in his lodge: “One drawer each. We keep only the essentials.”",
      "At the back of yours, under yellowed bills: a slim envelope, the ink gone soft. “Mrs. Alice Russell, Flat 3.” No stamp, no postmark. Only a wax seal pressed with an anchor.",
      "Nobody has opened that drawer in a very long time.",
    ],
    choices: [
      { label: "Go upstairs and ring Mrs. Alice's bell", next: 'l-alice' },
      { label: 'Study the envelope with the magnifier', next: 'l-enveloppe' },
    ],
  },
  'l-alice': {
    id: 'l-alice',
    title: 'The Bell at Flat 3',
    paragraphs: [
      "Two flights up, a hallway smelling of floor wax and lavender. Mrs. Alice opens the door — small, straight-backed, quick eyes behind round glasses.",
      "She sees the envelope, and for three seconds nothing moves. “Wherever did you find that?” Behind her, the kettle whistles like a reminder.",
    ],
    choices: [
      { label: 'Hand her the letter without a word', next: 'l-lecture' },
      { label: 'Ask her for the story first', next: 'l-histoire' },
    ],
  },
  'l-enveloppe': {
    id: 'l-enveloppe',
    title: 'Ink, Wax, Anchor',
    paragraphs: [
      "Under the caretaker's loupe, the envelope gives up its secrets: laid paper, a slanted hand that leans hard on the R's, and that wax seal struck with an anchor. Initials: H.R.",
      "Mr. Percy frowns. “That drawer was my father's before mine. H. somebody… A tenant from way back? Or a neighbor?”",
      "He points at the cellar door. “The answer may be sleeping in the register.”",
    ],
    choices: [
      { label: 'Ask the caretaker what he really knows', next: 'l-concierge' },
      { label: "Go quiz the baker, the street's memory", next: 'l-boulanger' },
    ],
  },
  'l-concierge': {
    id: 'l-concierge',
    title: "The Caretaker's Memory",
    paragraphs: [
      "Among cardboard boxes in the lodge, Mr. Percy remembers in pieces: a gentleman who whistled on the stairs, folded newspapers under his arm, and left “for the sea” one spring.",
      "“My father wrote everything down in the tenants' register, in the cellar. If your H. ever lived here, he is in it.”",
    ],
    choices: [
      { label: 'Go dig through the cellar register', next: 'l-registre' },
      { label: 'Take the road to the bakery', next: 'l-boulanger' },
    ],
  },
  'l-boulanger': {
    id: 'l-boulanger',
    title: 'The Baker Who Knows Everything',
    paragraphs: [
      "At Martha's, the counter is warm and the smell of bread tells the street's whole week. She holds the envelope up to the light and beams. “Why — that is Henry's writing!”",
      "“Henry, the newspaper man from the square. Crazy about the sea. Word was he wrote letters and never posted a single one.” She sighs. “Go find him where the water tastes of salt.”",
      "On the back of an order slip, she scribbles the name of a port.",
    ],
    choices: [
      { label: "Go ring Mrs. Alice's bell", next: 'l-alice' },
      { label: 'Follow the trail of the newspaper kiosk', next: 'l-kiosque' },
    ],
  },
  'l-histoire': {
    id: 'l-histoire',
    title: '1962, as Alice Tells It',
    paragraphs: [
      "Over tea, Alice talks the way you unfold precious paper. In 1962 she was twenty, with a fiancé far too sensible. Henry sold the evening papers and saved the last copy for her, every single night.",
      "“He wrote me letters, I was told much later. Letters he never dared deliver.” She smooths the tablecloth. “I used to read late into the night, certain that midnight made me wiser. Silly girl — mornings are far wiser.”",
      "One spring, Henry left without a word, bound for the open sea. The envelope never arrived.",
    ],
    choices: [
      { label: 'Open the envelope together', next: 'l-lecture' },
      { label: 'Promise to find Henry for her', next: 'l-enquete' },
    ],
  },
  'l-lecture': {
    id: 'l-lecture',
    title: 'The Letter, Opened at Last',
    paragraphs: [
      "The wax gives with a small crack. The letter fills one page, brown ink: news from the harbor, a joke about seagulls, and this line at the very end: “If you ever read this, ring my doorbell twice.”",
      "Alice reads the last line three times over. Then she laughs, a brand-new laugh. “He might have rung it himself, the coward.”",
    ],
    choices: [
      { label: 'Stay for four o\u2019clock tea', next: 'l-the' },
      { label: 'Offer to track Henry down', next: 'l-enquete' },
    ],
  },
  'l-registre': {
    id: 'l-registre',
    title: 'The Cellar Register',
    paragraphs: [
      "By lamplight, in the smell of cold stone, the big leather book opens onto the sixties. And there, between two crossed-out names: “Ross, Henry — seaman. Left: spring 1963.”",
      "In the margin, in the old caretaker's hand: “Gone to his uncle, keeper of the semaphore light, Saltmarsh Bay.”",
      "The anchor on the wax seal had its home port after all.",
    ],
    choices: [
      { label: 'Follow the trail to the coast', next: 'l-kiosque' },
      { label: 'Go upstairs and tell Mrs. Alice everything', next: 'l-alice' },
    ],
  },
  'l-kiosque': {
    id: 'l-kiosque',
    title: 'Where the Water Turns Salty',
    paragraphs: [
      "In Saltmarsh Bay, the first person you ask for directions laughs out loud. “Henry? Everyone knows Henry. The bookshop on the quay — the one with fishing nets on the ceiling.”",
      "In the back room, between two teapots, a man with hands of wood and sea foam looks up. He has the eyes of 1962.",
    ],
    choices: [
      { label: 'Arrange a reunion by the sea', next: 'l-mer' },
      { label: 'Head home to tell the street the news', next: 'l-mur' },
    ],
  },
  'l-enquete': {
    id: 'l-enquete',
    title: 'The Case of the Anchor',
    paragraphs: [
      "You run the investigation like in the books: the anchor seal, the cellar register, the baker's memory, the flat number. Every piece clicks, and the whole street joins in — down to the Saltmarsh haberdasher, who answers your letter.",
      "A reply comes at last, on polka-dot paper, in a careful hand: “Tell Alice I still keep the last paper of the evening for her.”",
      "All that is left is to choose the ending.",
    ],
    choices: [
      { label: 'Arrange the reunion by the sea', next: 'l-mer' },
      { label: 'Gather the whole street for what comes next', next: 'l-mur' },
    ],
  },
  'l-the': {
    id: 'l-the',
    title: 'Sundays at Alice\u2019s',
    paragraphs: [
      "Sundays at Alice's mean flowered cups, warm madeleines and slow conversation. The letter sits on the sideboard, between a christening photo and the mantel clock.",
      "She teaches you to fold napkins “the old way,” and tells you about the street as it was: the bells, the Sunday harvests. “You know, young folks and old folks grow like a garden — you only have to tend it.”",
    ],
    choices: [
      { label: 'Come back every Sunday for tea', next: 'l-fin-the' },
      { label: 'Offer to find Henry before it is too late', next: 'l-enquete' },
    ],
  },
  'l-mer': {
    id: 'l-mer',
    title: 'The Quay by the Sea',
    paragraphs: [
      "You plan the trip like a festival: the caretaker lends his car, the baker sends bread, and Alice gets out her Sunday hat.",
      "At the end of the quay, Henry closes his bookshop for an afternoon. He rings twice at the door — as in the letter — and Alice opens.",
      "You drift away toward the breakwater, tactfully. Some conversations need no audience.",
    ],
    choices: [
      { label: 'Let the sea finish the story', next: 'l-fin-mer' },
      { label: 'Head home to tell the street the story', next: 'l-fin-mur' },
    ],
  },
  'l-mur': {
    id: 'l-mur',
    title: 'The Letter Wall',
    paragraphs: [
      "Back on Primrose Lane, the story climbs the staircases on its own. Mr. Percy fetches his old toolbox and fixes a wooden board in the hall: “For letters we never dared to give.”",
      "Within a month the wall collects love notes, thank-yous, recipes, one invitation to the opera. Alice, elected “memory of the building,” keeps the register of stories.",
    ],
    choices: [
      { label: 'Let the letter wall grow all winter', next: 'l-fin-mur' },
      { label: 'Write its first letter — to Henry', next: 'l-fin-mer' },
    ],
  },
  'l-fin-the': {
    id: 'l-fin-the',
    title: 'Sundays That Last',
    paragraphs: [
      "Sunday after Sunday, the flowered cups fill again. Alice teaches you her card games, her soup, her way of listening with her head tilted just so.",
      "The letter stays on the sideboard, in a small frame now. “Not to remember him,” she says. “To remember that it is never too late to knock on a door.”",
      "On Primrose Lane, everyone now knows that on Sundays at four o'clock, Alice's kettle sings — and there is always a cup for whoever comes.",
    ],
    choices: [],
    ending: { name: 'Four O\u2019Clock Tea', emoji: '🫖' },
  },
  'l-fin-mer': {
    id: 'l-fin-mer',
    title: 'Two Chairs at the End of the Quay',
    paragraphs: [
      "Years too late and right on time: the letter finally reached its reader, and its writer found his way home. On the quay, the bookshop now keeps two chairs instead of one.",
      "In the window, between two almanacs, an envelope with an anchor seal, framed. “Delivered,” says the label underneath, “sixty years later — give or take a Sunday.”",
      "You keep the photo from that afternoon: two people laughing, the sea behind them, exactly as in 1962.",
    ],
    choices: [],
    ending: { name: 'A Letter by the Sea', emoji: '🌊' },
  },
  'l-fin-mur': {
    id: 'l-fin-mur',
    title: 'The Hall of Almost-Lost Words',
    paragraphs: [
      "All winter the wall grows: a recipe for plum jam, an apology that waited ten years, a child's drawing for the postman. Mr. Percy adds a little brass mailbox, “for slow hearts.”",
      "On opening day, Alice cuts the ribbon with sewing scissors and christens the hall “a museum of almost-lost words.”",
      "And at the very top of the wall, in a frame, a photocopy of the first letter — the one that started it all.",
    ],
    choices: [],
    ending: { name: 'The Letter Wall', emoji: '📮' },
  },
}

/* ====================== Export ====================== */

export const STORIES: Story[] = [
  {
    id: 'garden',
    title: { fr: 'Le Jardin de Grand-Mère', en: "Grandma's Garden" },
    cover: '🌻',
    nodes: { fr: GARDEN_FR, en: GARDEN_EN },
  },
  {
    id: 'letter',
    title: { fr: 'La Lettre au Fond du Tiroir', en: 'The Letter at the Bottom of the Drawer' },
    cover: '✉️',
    nodes: { fr: LETTER_FR, en: LETTER_EN },
  },
]
