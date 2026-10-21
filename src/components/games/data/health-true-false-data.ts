/**
 * Données du jeu « Vrai ou Faux — Santé » (health-true-false).
 * 48 affirmations bilingues (FR/EN), 24 vraies / 24 fausses.
 *
 * POLITIQUE ÉDITORIALE (cahier des charges) :
 * - Chaque affirmation est fondée sur les repères du consensus de santé publique
 *   (OMS, NHS, Inserm, Harvard Health, ANSES, EFSA, FDA, Santé publique France).
 * - Aucun remède traditionnel présenté comme traitement prouvé ; aucun ton alarmiste.
 * - Formulations prudentes (« en général », « les données montrent ») pour les sujets
 *   où les preuves sont observationnelles ou nuancées.
 * - `source` = l'institution dont les repères appuient l'affirmation (texte, sans URL).
 * - FR et EN sont de vraies adaptations (pas des traductions mot à mot).
 */

export interface QuizStatement {
  id: string
  statement: { fr: string; en: string }
  answer: 'true' | 'false'
  explanation: { fr: string; en: string } // 2-3 phrases, à visée éducative
  source: string // ex. 'OMS', 'NHS', 'Inserm', 'Harvard Health', 'ANSES'
  difficulty: 1 | 2 | 3
  category: 'nutrition' | 'sommeil' | 'hydratation' | 'activité' | 'hygiène' | 'idées-reçues'
}

export const QUIZ_STATEMENTS: QuizStatement[] = [
  /* ==================== Nutrition ==================== */
  {
    id: 'nt-400g-fruits-legumes',
    statement: {
      fr: 'Il est recommandé de manger au moins 400 g de fruits et légumes par jour, soit environ cinq portions.',
      en: 'Adults are generally advised to eat at least 400 g of fruit and vegetables a day — roughly five portions.',
    },
    answer: 'true',
    explanation: {
      fr: 'L’Organisation mondiale de la santé recommande au minimum 400 g de fruits et légumes par jour, pommes de terre exclues. Les campagnes « 5 par jour » reprennent ce repère, car ces aliments apportent fibres, vitamines et minéraux. En pratique, une portion correspond à peu près à un fruit de la taille de la main ou à une poignée de légumes.',
      en: 'The World Health Organization recommends at least 400 g of fruit and vegetables per day, excluding potatoes. National “5 a day” campaigns build on this benchmark, because these foods provide fibre, vitamins and minerals. In practice, one portion is roughly a palm-sized fruit or a handful of vegetables.',
    },
    source: 'OMS',
    difficulty: 1,
    category: 'nutrition',
  },
  {
    id: 'nt-jus-fruit',
    statement: {
      fr: 'Un verre de jus de fruits vaut nutritionnellement un fruit entier.',
      en: 'A glass of fruit juice is nutritionally equivalent to a whole fruit.',
    },
    answer: 'false',
    explanation: {
      fr: 'Faux : le jus garde les sucres du fruit mais perd une grande partie des fibres, et ses sucres libres passent plus vite dans le sang. L’OMS compte d’ailleurs les sucres des jus parmi les sucres libres à limiter. Manger le fruit entier rassasie mieux et reste le meilleur choix au quotidien.',
      en: 'False: juice keeps the fruit’s sugars but loses most of its fibre, and its free sugars reach the bloodstream faster. The WHO counts the sugars in juice among the free sugars to limit. Eating whole fruit is more filling and remains the better everyday choice.',
    },
    source: 'OMS',
    difficulty: 2,
    category: 'nutrition',
  },
  {
    id: 'nt-petit-dejeuner-metabo',
    statement: {
      fr: 'Sauter le petit-déjeuner ralentit automatiquement le métabolisme et fait grossir.',
      en: 'Skipping breakfast automatically slows your metabolism and makes you gain weight.',
    },
    answer: 'false',
    explanation: {
      fr: 'Les données montrent qu’omettre un repas n’entraîne pas, en soi, de ralentissement métabolique : ce qui compte est l’apport calorique global de la journée. Les études sur le petit-déjeuner donnent des résultats contrastés selon les habitudes de chacun. Le meilleur rythme reste celui que l’on tient durablement, sans grignotage compensatoire.',
      en: 'Data show that missing a meal does not, by itself, slow your metabolism: total daily intake is what matters most. Breakfast studies give mixed results depending on personal habits. The best routine is simply one you can keep up long-term without compensating with snacks.',
    },
    source: 'Harvard Health',
    difficulty: 2,
    category: 'nutrition',
  },
  {
    id: 'nt-fibres-transit',
    statement: {
      fr: 'Les fibres alimentaires facilitent le transit intestinal et nourrissent le microbiote.',
      en: 'Dietary fibre helps keep digestion regular and feeds the gut microbiome.',
    },
    answer: 'true',
    explanation: {
      fr: 'Les fibres, présentes dans les céréales complètes, les légumineuses, les fruits et les légumes, augmentent le volume des selles et accélèrent le transit. Elles servent aussi de nourriture aux bactéries intestinales bénéfiques. La plupart des adultes restent en dessous des apports recommandés, autour de 25 à 30 g par jour.',
      en: 'Fibre — found in whole grains, pulses, fruit and vegetables — increases stool bulk and speeds up transit. It also feeds beneficial gut bacteria. Most adults fall short of recommended intakes, around 25 to 30 g per day.',
    },
    source: 'ANSES',
    difficulty: 1,
    category: 'nutrition',
  },
  {
    id: 'nt-complements-vitamines',
    statement: {
      fr: 'En cas d’alimentation déjà équilibrée, les compléments de vitamines améliorent encore la santé.',
      en: 'If you already eat a balanced diet, vitamin supplements further improve your health.',
    },
    answer: 'false',
    explanation: {
      fr: 'Chez une personne bien nourrie, les données ne montrent pas de bénéfice global des multivitamines sur la santé. Certains compléments sont utiles dans des situations précises — grossesse, carence démontrée, manque de soleil en hiver — sur avis médical. Mieux vaut viser une assiette variée qu’une étagère de vitamines.',
      en: 'In well-nourished people, data show no overall health benefit from multivitamins. Some supplements are useful in specific situations — pregnancy, a proven deficiency, little winter sunlight — on medical advice. A varied plate beats a shelf full of vitamins.',
    },
    source: 'Inserm',
    difficulty: 2,
    category: 'nutrition',
  },
  {
    id: 'nt-sucres-libres',
    statement: {
      fr: 'L’OMS conseille de rester en dessous de 10 % de l’apport énergétique quotidien en sucres libres.',
      en: 'The WHO advises keeping free sugars below 10% of your daily energy intake.',
    },
    answer: 'true',
    explanation: {
      fr: 'Selon l’Organisation mondiale de la santé, les sucres libres — ajoutés par le fabricant ou le cuisinier, plus ceux du miel, des sirops et des jus — devraient représenter moins de 10 % de l’énergie quotidienne, idéalement moins de 5 %. Pour un adulte moyen, cela correspond à environ 50 g, au mieux 25 g. Les sucres « cachés » des plats préparés et des boissons comptent aussi.',
      en: 'According to the World Health Organization, free sugars — those added by manufacturers or cooks, plus those in honey, syrups and juice — should stay below 10% of daily energy, and ideally below 5%. For an average adult that is about 50 g, and at best 25 g. The “hidden” sugars in processed foods and drinks count too.',
    },
    source: 'OMS',
    difficulty: 2,
    category: 'nutrition',
  },
  {
    id: 'nt-graisses-mauvaises',
    statement: {
      fr: 'Toutes les matières grasses sont mauvaises pour la santé.',
      en: 'All dietary fat is bad for your health.',
    },
    answer: 'false',
    explanation: {
      fr: 'Faux : la qualité des graisses importe davantage que leur quantité absolue. Les graisses insaturées de l’huile d’olive, des oléagineux ou des poissons font partie d’une alimentation favorable à la santé cardiovasculaire. En revanche, l’OMS recommande de limiter les graisses saturées et surtout les graisses trans industrielles.',
      en: 'False: the quality of fat matters more than its total amount. Unsaturated fats from olive oil, nuts or fish are part of a diet that supports cardiovascular health. The WHO does, however, recommend limiting saturated fats and especially industrial trans fats.',
    },
    source: 'OMS',
    difficulty: 1,
    category: 'nutrition',
  },
  {
    id: 'nt-legumineuses-proteines',
    statement: {
      fr: 'Les légumineuses comme les lentilles ou les pois chiches sont d’excellentes sources de protéines végétales.',
      en: 'Pulses such as lentils and chickpeas are excellent sources of plant protein.',
    },
    answer: 'true',
    explanation: {
      fr: 'Les légumineuses apportent des protéines, des fibres, du fer et des glucides complexes, pour un coût faible. L’OMS et plusieurs repères nutritionnels nationaux les classent parmi les aliments à privilégier, aussi pour leur intérêt environnemental. Associées à des céréales, elles couvrent bien les besoins en acides aminés.',
      en: 'Pulses provide protein, fibre, iron and complex carbohydrates at low cost. The WHO and several national dietary guidelines list them among the foods to favour, including for environmental reasons. Combined with grains, they cover amino-acid needs well.',
    },
    source: 'OMS',
    difficulty: 2,
    category: 'nutrition',
  },
  {
    id: 'nt-oeufs-cholesterol',
    statement: {
      fr: 'Manger des œufs fait grimper fortement le cholestérol sanguin chez la plupart des gens.',
      en: 'Eating eggs sharply raises blood cholesterol in most people.',
    },
    answer: 'false',
    explanation: {
      fr: 'Pour la majorité des personnes, le cholestérol alimentaire n’influe que modérément sur le cholestérol sanguin : c’est le foie qui régule l’essentiel. Les données actuelles n’incriminent pas la consommation modérée d’œufs — environ un par jour — dans les maladies cardiovasculaires. Les personnes diabétiques ou ayant un taux élevé suivent simplement un avis médical personnalisé.',
      en: 'For most people, dietary cholesterol has only a modest effect on blood cholesterol: the liver regulates most of it. Current data do not link moderate egg consumption — about one a day — to cardiovascular disease. People with diabetes or high cholesterol simply follow personalised medical advice.',
    },
    source: 'Harvard Health',
    difficulty: 3,
    category: 'nutrition',
  },
  {
    id: 'nt-sel-tension',
    statement: {
      fr: 'Une consommation excessive de sel augmente la tension artérielle.',
      en: 'Eating too much salt raises blood pressure.',
    },
    answer: 'true',
    explanation: {
      fr: 'Un apport élevé en sodium est un facteur bien établi d’hypertension artérielle, elle-même risque cardiovasculaire majeur. L’OMS recommande de ne pas dépasser 5 g de sel par jour, alors que la plupart des régimes occidentaux en apportent davantage. L’essentiel du sel consommé est « caché » dans le pain, les fromages et les plats préparés.',
      en: 'A high sodium intake is a well-established contributor to high blood pressure, itself a major cardiovascular risk. The WHO recommends no more than 5 g of salt per day, while most Western diets exceed that. Most of the salt we eat is “hidden” in bread, cheese and ready meals.',
    },
    source: 'OMS',
    difficulty: 1,
    category: 'nutrition',
  },
  {
    id: 'nt-ultra-transformes',
    statement: {
      fr: 'Les grandes études d’observation associent les aliments ultra-transformés à un risque accru de maladies chroniques.',
      en: 'Large observational studies link ultra-processed foods to a higher risk of chronic diseases.',
    },
    answer: 'true',
    explanation: {
      fr: 'De grandes cohortes, dont NutriNet-Santé suivie avec l’Inserm, associent une part élevée d’aliments ultra-transformés à davantage de maladies cardiovasculaires, de diabète et de certains cancers. Ces travaux restent observationnels et les mécanismes précis sont encore étudiés. En attendant, les repères officiels conseillent de privilégier les aliments peu transformés et faits maison.',
      en: 'Large cohorts, including the Inserm-backed NutriNet-Santé study, associate a high share of ultra-processed foods with more cardiovascular disease, diabetes and certain cancers. This evidence is observational, and precise mechanisms are still being studied. In the meantime, official guidelines favour minimally processed and home-cooked foods.',
    },
    source: 'Inserm',
    difficulty: 3,
    category: 'nutrition',
  },

  /* ==================== Hydratation ==================== */
  {
    id: 'hy-8-verres',
    statement: {
      fr: 'Il faut impérativement boire huit verres d’eau par jour, pas un de plus ni de moins.',
      en: 'Everyone must drink exactly eight glasses of water a day — no more, no less.',
    },
    answer: 'false',
    explanation: {
      fr: 'Le fameux « 8 verres » n’est pas une recommandation officielle : les besoins varient selon le corps, le climat et l’activité. Les apports venant des aliments comptent aussi — ils fournissent environ un cinquième de l’eau. Chez l’adulte en bonne santé, la soif reste un guide fiable.',
      en: 'The famous “eight glasses” is not an official recommendation: needs vary with body size, climate and activity. Water from food counts too — it supplies about a fifth of our intake. For a healthy adult, thirst remains a reliable guide.',
    },
    source: 'Harvard Health',
    difficulty: 1,
    category: 'hydratation',
  },
  {
    id: 'hy-cafe-hydratation',
    statement: {
      fr: 'Le café, bu avec modération, contribue à l’hydratation quotidienne.',
      en: 'Coffee, in moderation, contributes to your daily fluid intake.',
    },
    answer: 'true',
    explanation: {
      fr: 'La caféine a un léger effet diurétique, mais aux doses habituelles — jusqu’à trois ou quatre tasses par jour — le bilan hydrique reste positif. Les boissons comme le café ou le thé comptent donc dans les apports hydriques de la journée. Elles ne remplacent pas l’eau, mais ne déshydratent pas non plus.',
      en: 'Caffeine has a mild diuretic effect, but at usual intakes — up to three or four cups a day — the fluid balance stays positive. Drinks like coffee or tea therefore count towards the day’s fluids. They don’t replace water, but they don’t dehydrate you either.',
    },
    source: 'NHS',
    difficulty: 2,
    category: 'hydratation',
  },
  {
    id: 'hy-soif-indicateur',
    statement: {
      fr: 'Chez l’adulte en bonne santé, la sensation de soif est un bon indicateur des besoins en eau.',
      en: 'In a healthy adult, the feeling of thirst is a good indicator of water needs.',
    },
    answer: 'true',
    explanation: {
      fr: 'Chez la plupart des adultes, boire quand on a soif suffit à maintenir l’équilibre hydrique. La couleur des urines — jaune paille clair — offre un second repère simple. Cette règle vaut moins bien pour les personnes âgées, dont la soif s’émousse avec l’âge, ou lors d’efforts intenses.',
      en: 'For most adults, drinking when thirsty is enough to maintain fluid balance. Urine colour — pale straw — offers a second simple check. The rule holds less well for older adults, whose thirst sensation dulls with age, or during intense exercise.',
    },
    source: 'Harvard Health',
    difficulty: 3,
    category: 'hydratation',
  },
  {
    id: 'hy-eau-toxines',
    statement: {
      fr: 'Boire beaucoup plus que ses besoins accélère l’élimination des « toxines ».',
      en: 'Drinking far more than you need speeds up the removal of “toxins”.',
    },
    answer: 'false',
    explanation: {
      fr: 'Les reins filtrent le sang en continu, à un rythme qu’ils régulent eux-mêmes : boire davantage augmente surtout le volume des urines. Sauf situation médicale particulière, aucun « rinçage » accéléré n’a été démontré. En très grande quantité, l’excès d’eau peut même provoquer une dilution dangereuse du sodium sanguin.',
      en: 'The kidneys filter blood continuously at a rate they regulate themselves: drinking more mostly increases urine volume. Aside from specific medical situations, no accelerated “flushing” has been shown. In very large amounts, excess water can even dangerously dilute blood sodium.',
    },
    source: 'Inserm',
    difficulty: 2,
    category: 'hydratation',
  },
  {
    id: 'hy-eau-gazeuse',
    statement: {
      fr: 'L’eau gazeuse hydrate aussi bien que l’eau plate.',
      en: 'Sparkling water hydrates just as well as still water.',
    },
    answer: 'true',
    explanation: {
      fr: 'Les bulles de dioxyde de carbone ne changent rien à la teneur en eau de la boisson. L’eau pétillante hydrate donc aussi efficacement que l’eau plate. Seules différences : elle peut donner une impression de ballonnement aux estomacs sensibles, et certaines eaux gazeuses sont plus salées.',
      en: 'Carbon-dioxide bubbles change nothing about the drink’s water content. Sparkling water therefore hydrates just as effectively as still water. The only differences: it can feel bloating for sensitive stomachs, and some sparkling waters are saltier.',
    },
    source: 'NHS',
    difficulty: 2,
    category: 'hydratation',
  },
  {
    id: 'hy-aliments-eau',
    statement: {
      fr: 'Les aliments solides apportent environ un cinquième de l’eau que nous consommons chaque jour.',
      en: 'Solid foods provide roughly a fifth of the water we take in each day.',
    },
    answer: 'true',
    explanation: {
      fr: 'Selon les repères européens, environ 20 % des apports en eau viennent des aliments — soupes, fruits, légumes, yaourts. Un concombre ou une pastèque est gorgé d’eau à plus de 90 %. C’est pourquoi « boire 1,5 litre » ne raconte qu’une partie de l’histoire.',
      en: 'According to European dietary reference values, about 20% of water intake comes from food — soups, fruit, vegetables, yoghurts. Cucumber or watermelon is more than 90% water. That’s why “drink 1.5 litres” only tells part of the story.',
    },
    source: 'EFSA',
    difficulty: 3,
    category: 'hydratation',
  },
  {
    id: 'hy-seniors-soif',
    statement: {
      fr: 'Avec l’âge, la sensation de soif diminue : les personnes âgées doivent veiller à boire régulièrement.',
      en: 'Thirst fades with age, so older adults should take care to drink regularly.',
    },
    answer: 'true',
    explanation: {
      fr: 'Le mécanisme de la soif s’émousse au fil des années, surtout après 65 ans. Une personne âgée peut être déshydratée sans ressentir la soif attendue. Les recommandations officielles invitent donc à boire par habitude, à heures régulières, sans attendre la sensation de soif.',
      en: 'The thirst mechanism dulls over the years, especially after 65. An older person can be dehydrated without feeling the expected thirst. Official guidance therefore suggests drinking by routine, at regular times, without waiting to feel thirsty.',
    },
    source: 'OMS',
    difficulty: 2,
    category: 'hydratation',
  },

  /* ==================== Sommeil ==================== */
  {
    id: 'sl-7-9-heures',
    statement: {
      fr: 'La plupart des adultes ont besoin de sept à neuf heures de sommeil par nuit.',
      en: 'Most adults need seven to nine hours of sleep per night.',
    },
    answer: 'true',
    explanation: {
      fr: 'Les repères de santé publique situent entre 7 et 9 heures le besoin de la grande majorité des adultes. Le meilleur indicateur reste un réveil en forme et une vigilance stable dans la journée. Les adolescents, eux, ont besoin de 8 à 10 heures.',
      en: 'Public-health benchmarks put the needs of the vast majority of adults between 7 and 9 hours. The best indicator remains waking up refreshed and staying alert through the day. Teenagers need 8 to 10 hours.',
    },
    source: 'Santé publique France',
    difficulty: 1,
    category: 'sommeil',
  },
  {
    id: 'sl-cerveau-repos',
    statement: {
      fr: 'Pendant le sommeil, le cerveau se met totalement au repos.',
      en: 'During sleep, the brain switches off completely.',
    },
    answer: 'false',
    explanation: {
      fr: 'Le cerveau reste très actif pendant la nuit : il consolide les mémoires, régule les émotions et évacue ses déchets métaboliques. Certaines zones sont même plus actives qu’à l’éveil, notamment en sommeil paradoxal. Dormir est un travail, pas une simple mise en veille.',
      en: 'The brain stays highly active at night: it consolidates memories, regulates emotions and clears metabolic waste. Some regions are even more active than during wakefulness, especially in REM sleep. Sleeping is work, not simply switching off.',
    },
    source: 'Inserm',
    difficulty: 2,
    category: 'sommeil',
  },
  {
    id: 'sl-sieste-courte',
    statement: {
      fr: 'Une sieste courte, autour de 20 à 30 minutes, améliore la vigilance.',
      en: 'A short nap of around 20 to 30 minutes improves alertness.',
    },
    answer: 'true',
    explanation: {
      fr: 'Les études sur la sieste montrent qu’une pause de 10 à 30 minutes restaure la vigilance sans abîmer le sommeil nocturne. Au-delà d’une trentaine de minutes, on risque de se réveiller en pleine phase de sommeil profond, avec une sensation de coup de pompe. Les siestes longues sont plutôt à réserver aux vrais manques de sommeil.',
      en: 'Nap studies show that a 10-to-30-minute break restores alertness without harming night sleep. Beyond about thirty minutes, you risk waking from deep sleep with that groggy, sluggish feeling. Long naps are best kept for genuine sleep debt.',
    },
    source: 'NHS',
    difficulty: 2,
    category: 'sommeil',
  },
  {
    id: 'sl-dormir-moins',
    statement: {
      fr: 'On peut s’entraîner à dormir moins : le corps finit par s’habituer.',
      en: 'You can train yourself to sleep less — your body eventually adapts.',
    },
    answer: 'false',
    explanation: {
      fr: 'Les expériences de restriction de sommeil montrent que la vigilance continue de baisser même quand on « s’habitue » subjectivement. On sous-estime ainsi sa propre somnolence. Seule une petite minorité, porteuse d’un profil génétique particulier, vit vraiment bien avec peu de sommeil.',
      en: 'Sleep-restriction experiments show alertness keeps declining even when people subjectively “get used to it”. We tend to underestimate our own sleepiness. Only a small minority, with a specific genetic profile, truly thrives on little sleep.',
    },
    source: 'Inserm',
    difficulty: 2,
    category: 'sommeil',
  },
  {
    id: 'sl-ecrans-soir',
    statement: {
      fr: 'La lumière vive des écrans le soir peut retarder l’endormissement.',
      en: 'Bright screen light in the evening can delay falling asleep.',
    },
    answer: 'true',
    explanation: {
      fr: 'La lumière vive, surtout en fin de journée, retarde la sécrétion de mélatonine et décale l’horloge biologique. Les recommandations officielles conseillent d’arrêter les écrans environ une heure avant le coucher, ou d’en baisser la luminosité. Le contenu stimulant des écrans joue aussi un rôle.',
      en: 'Bright light, especially late in the day, delays melatonin secretion and shifts the body clock. Official advice suggests stopping screens about an hour before bed, or at least dimming them. Stimulating content on those screens plays a role too.',
    },
    source: 'Santé publique France',
    difficulty: 1,
    category: 'sommeil',
  },
  {
    id: 'sl-alcool-sommeil',
    statement: {
      fr: 'Un verre d’alcool le soir améliore la qualité du sommeil.',
      en: 'A glass of alcohol in the evening improves sleep quality.',
    },
    answer: 'false',
    explanation: {
      fr: 'L’alcool raccourcit certes le délai d’endormissement, mais il fragmente la seconde moitié de la nuit et réduit le sommeil paradoxal. Le sommeil obtenu est moins réparateur. À dose plus élevée, il aggrave même les apnées du sommeil.',
      en: 'Alcohol does shorten the time it takes to fall asleep, but it fragments the second half of the night and reduces REM sleep. The sleep you get is less restorative. At higher doses it can even worsen sleep apnoea.',
    },
    source: 'Inserm',
    difficulty: 2,
    category: 'sommeil',
  },
  {
    id: 'sl-dette-une-nuit',
    statement: {
      fr: 'Une seule bonne nuit permet de rattraper toute une semaine de sommeil écourté.',
      en: 'A single good night’s sleep can make up for a whole short-slept week.',
    },
    answer: 'false',
    explanation: {
      fr: 'La dette de sommeil se rembourse lentement : une nuit de récupération améliore la vigilance mais n’efface pas tous les effets. Les données suggèrent que certains marqueurs ne reviennent à la normale qu’après plusieurs nuits allongées. Le plus efficace reste un rythme régulier tout au long de la semaine.',
      en: 'Sleep debt repays slowly: one recovery night improves alertness but doesn’t erase every effect. Data suggest some markers only return to normal after several extended nights. A consistent rhythm throughout the week works best.',
    },
    source: 'Inserm',
    difficulty: 3,
    category: 'sommeil',
  },
  {
    id: 'sl-manque-accidents',
    statement: {
      fr: 'Le manque chronique de sommeil augmente le risque d’accidents et d’erreurs d’attention.',
      en: 'Chronic sleep loss raises the risk of accidents and attention lapses.',
    },
    answer: 'true',
    explanation: {
      fr: 'La somnolence diurne est un facteur reconnu d’accidents de la route et du travail. Après des nuits trop courtes répétées, la vigilance et le temps de réaction se dégradent durablement. C’est l’un des arguments clés des campagnes de santé publique sur le sommeil.',
      en: 'Daytime sleepiness is a recognised factor in road and workplace accidents. After repeated short nights, alertness and reaction times stay degraded for a long time. It’s one of the key arguments in public-health campaigns about sleep.',
    },
    source: 'Inserm',
    difficulty: 2,
    category: 'sommeil',
  },

  /* ==================== Activité physique ==================== */
  {
    id: 'ac-150-minutes',
    statement: {
      fr: 'L’OMS recommande au moins 150 minutes d’activité physique modérée par semaine chez l’adulte.',
      en: 'The WHO recommends at least 150 minutes of moderate physical activity per week for adults.',
    },
    answer: 'true',
    explanation: {
      fr: 'La recommandation mondiale est de 150 minutes d’endurance d’intensité modérée par semaine, ou 75 minutes d’intensité soutenue, en plus des activités quotidiennes. L’équivalent : 30 minutes de marche rapide cinq jours sur sept. Chaque mouvement compte, même fractionné dans la journée.',
      en: 'The global recommendation is 150 minutes of moderate endurance activity per week, or 75 minutes at vigorous intensity, on top of daily routines. That equals 30 minutes of brisk walking five days out of seven. Every bit of movement counts, even split across the day.',
    },
    source: 'OMS',
    difficulty: 2,
    category: 'activité',
  },
  {
    id: 'ac-etirements-courbatures',
    statement: {
      fr: 'S’étirer longuement avant l’effort prévient les courbatures.',
      en: 'Long static stretching before exercise prevents muscle soreness.',
    },
    answer: 'false',
    explanation: {
      fr: 'Les essais contrôlés montrent que les étirements statiques prolongés avant l’effort ne préviennent pas les courbatures, et peuvent même réduire légèrement la force musculaire sur l’instant. Un échauffement progressif et dynamique reste la bonne approche. Les étirements gardent tout leur intérêt pour la souplesse, en dehors de l’effort.',
      en: 'Controlled trials show that prolonged static stretching before exercise does not prevent soreness, and may even slightly reduce strength in the moment. A progressive, dynamic warm-up remains the right approach. Stretching is still valuable for flexibility — just not as a pre-workout shield.',
    },
    source: 'Harvard Health',
    difficulty: 2,
    category: 'activité',
  },
  {
    id: 'ac-marche-rapide',
    statement: {
      fr: 'Marcher d’un pas rapide compte comme une activité physique modérée.',
      en: 'Brisk walking counts as moderate physical activity.',
    },
    answer: 'true',
    explanation: {
      fr: 'La marche rapide — environ 5 à 6 km/h, un rythme où l’on peut parler mais pas chanter — est l’exemple type d’activité modérée selon l’OMS. Elle sollicite le cœur et la circulation sans choc articulaire majeur. C’est l’activité la plus accessible pour atteindre les 150 minutes hebdomadaires.',
      en: 'Brisk walking — roughly 5 to 6 km/h, a pace where you can talk but not sing — is the textbook example of moderate activity according to the WHO. It works the heart and circulation without major joint impact. It’s the most accessible way to reach the weekly 150 minutes.',
    },
    source: 'OMS',
    difficulty: 2,
    category: 'activité',
  },
  {
    id: 'ac-seances-10-min',
    statement: {
      fr: 'Pour que cela compte, l’activité physique doit se faire par séances d’au moins 10 minutes.',
      en: 'For it to count, physical activity has to come in bouts of at least 10 minutes.',
    },
    answer: 'false',
    explanation: {
      fr: 'Les recommandations mondiales de 2020 ont supprimé la durée minimale de séance : tout mouvement compte désormais, quelle que soit sa longueur. Grimper des escaliers ou marcher cinq minutes s’additionne sur la journée. L’essentiel est le volume total et la régularité.',
      en: 'The 2020 global guidelines dropped the minimum session length: every movement now counts, however short. Taking the stairs or walking five minutes adds up across the day. What matters is total volume and regularity.',
    },
    source: 'OMS',
    difficulty: 3,
    category: 'activité',
  },
  {
    id: 'ac-renforcement-2j',
    statement: {
      fr: 'Il est recommandé de renforcer ses muscles au moins deux jours par semaine.',
      en: 'It’s recommended to strengthen your muscles at least two days a week.',
    },
    answer: 'true',
    explanation: {
      fr: 'En plus de l’endurance, l’OMS recommande des exercices de renforcement musculaire des grands groupes deux jours par semaine ou plus. Utile à tout âge, cette pratique protège la masse musculaire et l’autonomie. Haltères, élastiques ou exercices au poids du corps conviennent.',
      en: 'On top of endurance work, the WHO recommends muscle-strengthening of the large muscle groups on two or more days a week. Valuable at any age, it protects muscle mass and independence. Weights, resistance bands or bodyweight exercises all work.',
    },
    source: 'OMS',
    difficulty: 2,
    category: 'activité',
  },
  {
    id: 'ac-transpiration-graisses',
    statement: {
      fr: 'Plus on transpire, plus on brûle de graisses.',
      en: 'The more you sweat, the more fat you burn.',
    },
    answer: 'false',
    explanation: {
      fr: 'La transpiration est un mécanisme de refroidissement, pas un compteur de calories : elle dépend de la chaleur, de l’effort et de la physiologie de chacun. Transpirer beaucoup fait perdre de l’eau, reprise dès qu’on boit. La dépense se juge à l’intensité et à la durée de l’effort, pas aux vêtements mouillés.',
      en: 'Sweating is a cooling mechanism, not a calorie counter: it depends on heat, exertion and individual physiology. Heavy sweating loses water, which you regain as soon as you drink. Expenditure is judged by exercise intensity and duration, not by soaked clothes.',
    },
    source: 'Harvard Health',
    difficulty: 1,
    category: 'activité',
  },
  {
    id: 'ac-actif-65-ans',
    statement: {
      fr: 'Rester actif après 65 ans reste bénéfique pour la santé.',
      en: 'Staying active after 65 still benefits your health.',
    },
    answer: 'true',
    explanation: {
      fr: 'L’activité physique adaptée réduit le risque de chutes, protège le cœur et entretient l’équilibre et la mémoire à tout âge. Les recommandations de l’OMS pour les personnes âgées restent proches de celles des adultes. Même commencer tard apporte des bénéfices.',
      en: 'Adapted physical activity reduces fall risk, protects the heart, and maintains balance and memory at any age. WHO recommendations for older adults remain close to those for younger adults. Even a late start brings benefits.',
    },
    source: 'OMS',
    difficulty: 1,
    category: 'activité',
  },
  {
    id: 'ac-escaliers',
    statement: {
      fr: 'Prendre les escaliers au quotidien compte comme activité physique.',
      en: 'Taking the stairs in everyday life counts as physical activity.',
    },
    answer: 'true',
    explanation: {
      fr: 'Les recommandations actuelles valorisent tous les mouvements du quotidien, y compris brefs. Monter les escaliers élève rapidement l’intensité et se cumule sur la journée. Remplacer l’ascenseur quand c’est possible est un geste simple et efficace.',
      en: 'Current guidelines value all everyday movement, however brief. Climbing stairs quickly raises intensity and adds up over the day. Skipping the lift when possible is one simple, effective habit.',
    },
    source: 'OMS',
    difficulty: 1,
    category: 'activité',
  },

  /* ==================== Hygiène ==================== */
  {
    id: 'hg-lavage-20s',
    statement: {
      fr: 'Se laver les mains pendant une vingtaine de secondes réduit efficacement les germes.',
      en: 'Washing your hands for about twenty seconds effectively reduces germs.',
    },
    answer: 'true',
    explanation: {
      fr: 'La technique recommandée par l’OMS — savon, eau et 20 secondes en frottant toutes les surfaces — élimine une grande partie des microbes des mains. C’est l’un des gestes les plus efficaces contre les infections digestives et respiratoires. Le gel hydroalcoolique est une alternative quand l’eau manque.',
      en: 'The WHO-recommended technique — soap, water and 20 seconds rubbing all surfaces — removes a large share of the germs on hands. It’s one of the most effective defences against digestive and respiratory infections. Hand sanitiser is an alternative when water isn’t available.',
    },
    source: 'OMS',
    difficulty: 1,
    category: 'hygiène',
  },
  {
    id: 'hg-savons-antibacteriens',
    statement: {
      fr: 'À la maison, les savons antibactériens sont bien plus efficaces que le savon ordinaire.',
      en: 'At home, antibacterial soaps are far more effective than plain soap.',
    },
    answer: 'false',
    explanation: {
      fr: 'Les données examinées par la FDA n’ont pas montré de supériorité des savons antibactériens grand public face au savon classique pour prévenir les infections. Un lavage soigneux et assez long avec un savon ordinaire suffit au quotidien. Certains agents antibactériens posent même des questions environnementales.',
      en: 'Data reviewed by the FDA showed no superiority of consumer antibacterial soaps over plain soap for preventing infections. Careful, long-enough washing with ordinary soap does the daily job. Some antibacterial agents even raise environmental questions.',
    },
    source: 'FDA',
    difficulty: 2,
    category: 'hygiène',
  },
  {
    id: 'hg-toux-coude',
    statement: {
      fr: 'Tousser ou éternuer dans son coude limite la propagation des germes.',
      en: 'Coughing or sneezing into your elbow limits the spread of germs.',
    },
    answer: 'true',
    explanation: {
      fr: 'Les gouttelettes émises en toussant peuvent projeter des microbes à plusieurs mètres. Le coude les retient mieux que la main, qui touche ensuite objets et proches. C’est un geste barrière recommandé dans le monde entier.',
      en: 'Droplets released by a cough can carry germs several metres. The elbow traps them better than a hand, which then touches objects and people. It’s a barrier gesture recommended worldwide.',
    },
    source: 'OMS',
    difficulty: 1,
    category: 'hygiène',
  },
  {
    id: 'hg-vinaigre-microbes',
    statement: {
      fr: 'Le vinaigre blanc tue tous les microbes de la maison.',
      en: 'White vinegar kills every germ in the home.',
    },
    answer: 'false',
    explanation: {
      fr: 'Le vinaigre a une action limitée sur certaines bactéries, mais il n’est pas un désinfectant au sens propre : il est peu efficace contre la plupart des virus. Pour les surfaces à risque, l’ANSES rappelle l’usage de désinfectants adaptés ou d’eau de javel diluée. Le vinaigre reste très bon pour dégraisser et détartrer.',
      en: 'Vinegar has limited action on some bacteria, but it is not a true disinfectant: it is largely ineffective against most viruses. For risky surfaces, ANSES points to proper disinfectants or diluted bleach. Vinegar remains great for degreasing and descaling.',
    },
    source: 'ANSES',
    difficulty: 2,
    category: 'hygiène',
  },
  {
    id: 'hg-brosse-dents',
    statement: {
      fr: 'Il est conseillé de changer de brosse à dents environ tous les trois mois.',
      en: 'You’re advised to replace your toothbrush about every three months.',
    },
    answer: 'true',
    explanation: {
      fr: 'Les poils usés nettoient moins bien et peuvent irriter les gencives ; une brosse s’use en quelques mois d’usage normal. Les recommandations dentaires parlent d’un remplacement tous les trois à quatre mois, et après une infection de la bouche ou de la gorge. Des poils écartés sont un signal clair.',
      en: 'Worn bristles clean less well and can irritate the gums; a brush wears out within a few months of normal use. Dental advice suggests replacing it every three to four months, and after a mouth or throat infection. Splayed bristles are a clear sign.',
    },
    source: 'NHS',
    difficulty: 2,
    category: 'hygiène',
  },
  {
    id: 'hg-eau-froide',
    statement: {
      fr: 'Se laver les mains à l’eau froide est moins efficace qu’à l’eau chaude.',
      en: 'Washing your hands with cold water is less effective than with hot water.',
    },
    answer: 'false',
    explanation: {
      fr: 'Des études comparatives montrent que la température de l’eau — froide ou tiède — compte bien moins que le savon et la durée du lavage. Une eau trop chaude peut même irriter la peau et faire bâcler le geste. Vingt secondes de frottage soigneux restent la clé.',
      en: 'Comparative studies show that water temperature — cold or warm — matters far less than soap and washing time. Very hot water can even irritate the skin and rush the gesture. Twenty seconds of careful rubbing remains the key.',
    },
    source: 'Harvard Health',
    difficulty: 3,
    category: 'hygiène',
  },

  /* ==================== Idées reçues ==================== */
  {
    id: 'my-detox',
    statement: {
      fr: 'Les cures de « détox » éliminent les toxines accumulées dans l’organisme.',
      en: 'Detox cures flush out the toxins that have built up in your body.',
    },
    answer: 'false',
    explanation: {
      fr: 'Aucune « cure détox » n’a démontré d’élimination accélérée de toxines : ce rôle revient au foie et aux reins, qui fonctionnent en continu. Les jus, sirops et cures diverses ne remplacent pas ces organes. L’idée même de « toxines » à drainer ne correspond à aucune définition médicale précise.',
      en: 'No “detox” cure has been shown to speed up toxin removal: that job belongs to the liver and kidneys, which work around the clock. Juices, syrups and assorted cures don’t stand in for those organs. The very idea of “toxins” to drain has no precise medical definition.',
    },
    source: 'NHS',
    difficulty: 1,
    category: 'idées-reçues',
  },
  {
    id: 'my-rhume-fievre',
    statement: {
      fr: 'Quand on est malade, il faut « nourrir un rhume et jeûner une fièvre ».',
      en: 'When you’re ill, you should “feed a cold and starve a fever”.',
    },
    answer: 'false',
    explanation: {
      fr: 'Ce vieil adage ne repose sur aucune donnée : rhume ou fièvre, le corps a besoin d’énergie et surtout d’eau pour se défendre. Manger selon son appétit et bien s’hydrater reste la règle. Se forcer à jeûner comme à manger n’accélère pas le rétablissement.',
      en: 'This old saying has no evidence behind it: with a cold or a fever, the body needs energy and above all fluids to fight back. Eating to your appetite and staying well hydrated remains the rule. Forcing yourself to fast — or to eat — doesn’t speed recovery.',
    },
    source: 'Harvard Health',
    difficulty: 2,
    category: 'idées-reçues',
  },
  {
    id: 'my-carottes-vision',
    statement: {
      fr: 'Manger beaucoup de carottes donne une vision nocturne surpuissante.',
      en: 'Eating lots of carrots gives you superpowered night vision.',
    },
    answer: 'false',
    explanation: {
      fr: 'Les carottes fournissent du bêta-carotène, converti en vitamine A, nécessaire à une bonne vision — mais sans bonus une fois les besoins couverts. La rumeur d’une « vision nocturne supérieure » vient d’une propagande britannique de la Seconde Guerre mondiale masquant l’usage des radars. Une carence en vitamine A abîme, elle, réellement la vision de nuit.',
      en: 'Carrots provide beta-carotene, converted into vitamin A, which eyes need — but there’s no bonus once your needs are met. The “superior night vision” rumour comes from British WWII propaganda concealing the use of radar. A vitamin A deficiency, on the other hand, genuinely harms night vision.',
    },
    source: 'Harvard Health',
    difficulty: 2,
    category: 'idées-reçues',
  },
  {
    id: 'my-craquer-doigts',
    statement: {
      fr: 'Se craquer les doigts provoque de l’arthrose.',
      en: 'Cracking your knuckles causes arthritis.',
    },
    answer: 'false',
    explanation: {
      fr: 'Les études de suivi n’ont pas trouvé de lien entre le craquement des doigts et l’arthrose. Le bruit vient d’un phénomène de bulles dans le liquide articulaire, sans dégât connu du cartilage. Le craquement peut tout au plus agacer l’entourage ; s’il devient douloureux, un avis médical s’impose.',
      en: 'Long-term studies have found no link between knuckle cracking and arthritis. The pop comes from bubbles forming in the joint fluid, with no known cartilage damage. At worst it annoys the people around you; if it ever hurts, do get it checked.',
    },
    source: 'Harvard Health',
    difficulty: 2,
    category: 'idées-reçues',
  },
  {
    id: 'my-lire-penombre',
    statement: {
      fr: 'Lire dans la pénombre abîme durablement les yeux.',
      en: 'Reading in dim light permanently damages your eyes.',
    },
    answer: 'false',
    explanation: {
      fr: 'Lire avec peu de lumière fatigue passagèrement les yeux — tension, sécheresse, maux de tête — mais ne les abîme pas durablement. La vision floue d’effort redevient normale au repos. Un bon éclairage reste conseillé pour le confort.',
      en: 'Reading in poor light temporarily strains the eyes — tightness, dryness, headaches — but doesn’t damage them lastingly. Effort-related blurry vision returns to normal with rest. Good lighting is still recommended for comfort.',
    },
    source: 'Harvard Health',
    difficulty: 1,
    category: 'idées-reçues',
  },
  {
    id: 'my-10-cerveau',
    statement: {
      fr: 'Nous n’utilisons que 10 % de notre cerveau.',
      en: 'We only use 10% of our brain.',
    },
    answer: 'false',
    explanation: {
      fr: 'L’imagerie cérébrale montre une activité répartie dans l’ensemble du cerveau, y compris pendant le sommeil. Aucune zone ne resterait inutilisée à 90 %. Ce mythe tient sans doute à de vieilles interprétations mal datées, popularisées ensuite par la publicité et le cinéma.',
      en: 'Brain imaging shows activity spread across the whole brain, including during sleep. No region sits 90% unused. The myth probably stems from old, misdated interpretations, later popularised by advertising and movies.',
    },
    source: 'Inserm',
    difficulty: 1,
    category: 'idées-reçues',
  },
  {
    id: 'my-stress-immunite',
    statement: {
      fr: 'Un stress chronique peut affaiblir les défenses immunitaires.',
      en: 'Chronic stress can weaken immune defences.',
    },
    answer: 'true',
    explanation: {
      fr: 'Les travaux en psycho-neuro-immunologie montrent qu’un stress prolongé module la réponse immunitaire et augmente la sensibilité aux infections, rhumes en tête. Le stress ponctuel, lui, prépare brièvement le corps à l’action. Ce sont la durée et l’absence de répit qui pèsent.',
      en: 'Work in psychoneuroimmunology shows that prolonged stress modulates the immune response and raises susceptibility to infections, colds in particular. Short bursts of stress, by contrast, briefly prime the body for action. It’s the duration and the lack of relief that take their toll.',
    },
    source: 'Inserm',
    difficulty: 2,
    category: 'idées-reçues',
  },
  {
    id: 'my-antibiotiques-grippe',
    statement: {
      fr: 'Les antibiotiques soignent la grippe et le rhume.',
      en: 'Antibiotics cure flu and colds.',
    },
    answer: 'false',
    explanation: {
      fr: 'Les antibiotiques n’agissent que sur les bactéries : grippe et rhume sont des infections virales contre lesquelles ils sont sans effet. Les prendre « pour rien » favorise la résistance aux antibiotiques, un enjeu majeur de santé publique selon l’OMS. Les viroses se soignent surtout par le repos, les boissons et le traitement des symptômes.',
      en: 'Antibiotics only work on bacteria: flu and colds are viral infections on which they have no effect. Taking them “just in case” fuels antibiotic resistance, a major public-health concern flagged by the WHO. Viral illnesses are mostly managed with rest, fluids and symptom relief.',
    },
    source: 'OMS',
    difficulty: 1,
    category: 'idées-reçues',
  },
]
