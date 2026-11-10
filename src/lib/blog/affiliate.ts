import type { Language } from "@/lib/i18n";

export const AMAZON_AFFILIATE_CONFIG = {
  fr: {
    tag: "kidenzo202208-21",
    domain: "amazon.fr",
    baseUrl: "https://www.amazon.fr/s",
    currency: "EUR",
    currencySymbol: "€",
    disclosure:
      "Transparence : En tant que Partenaire Amazon et partenaire affilié sélectionné, Granmed.store peut percevoir une commission sur les achats éligibles, sans aucun surcoût pour vous.",
    ctaLabel: "Voir sur Amazon.fr",
    badgeLabel: "Sélection Cognitive Vérifiée Amazon.fr",
  },
  en: {
    tag: "kidenzo202205-20",
    domain: "amazon.com",
    baseUrl: "https://www.amazon.com/s",
    currency: "USD",
    currencySymbol: "$",
    disclosure:
      "Disclosure: As an Amazon Associate and selected affiliate partner, Granmed.store may earn a commission from qualifying purchases at no extra cost to you.",
    ctaLabel: "Check Price on Amazon.com",
    badgeLabel: "Verified Cognitive Pick on Amazon.com",
  },
} as const;

export interface PartnerAffiliateOffer {
  id: string;
  partnerName: string;
  category: "memory" | "logic" | "reflex" | "words" | "all";
  url: Record<Language, string>;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  cta: Record<Language, string>;
  priceRange: Record<Language, string>;
}

export const PARTNER_AFFILIATE_OFFERS: PartnerAffiliateOffer[] = [
  {
    id: "online-therapy-cbt-focus",
    partnerName: "Online-Therapy.com",
    category: "memory",
    url: {
      fr: "https://go.online-therapy.com/SH12v",
      en: "https://go.online-therapy.com/SH12u",
    },
    title: {
      fr: "Programme TCC Online-Therapy (Concentration, Stress & Clarté Mentale)",
      en: "Online-Therapy CBT Program (Focus, Cognitive Stress & Mental Clarity)",
    },
    subtitle: {
      fr: "Accompagnement structuré par la thérapie cognitivo-comportementale pour lever le brouillard mental et restaurer l'attention soutenue.",
      en: "Structured cognitive behavioral therapy toolkit to clear brain fog, reduce performance anxiety, and restore sustained attention.",
    },
    cta: {
      fr: "Découvrir le programme TCC (-20 %)",
      en: "Explore the CBT Focus Program (20% Off)",
    },
    priceRange: {
      fr: "Dès 40 € / sem.",
      en: "From $40 / wk",
    },
  },
  {
    id: "online-therapy-sleep-recovery",
    partnerName: "Online-Therapy.com",
    category: "reflex",
    url: {
      fr: "https://go.online-therapy.com/SH130",
      en: "https://go.online-therapy.com/SH130",
    },
    title: {
      fr: "Protocole Sommeil Réparateur & Consolidation Mnésique (TCC-I)",
      en: "Deep Sleep & Memory Consolidation CBT-I Protocol",
    },
    subtitle: {
      fr: "Optimisez vos cycles de sommeil profond pour accélérer vos temps de réaction et consolider la mémoire de travail nocturne.",
      en: "Optimize deep sleep architecture to sharpen visual reaction times and lock in daytime working-memory gains.",
    },
    cta: {
      fr: "Voir le protocole Sommeil & Mémoire",
      en: "View the Sleep & Memory Protocol",
    },
    priceRange: {
      fr: "Programme complet",
      en: "Full CBT-I Access",
    },
  },
  {
    id: "whop-verbal-social-mastery",
    partnerName: "Whop Blueprints",
    category: "words",
    url: {
      fr: "https://whop.com/ds-parenting-and-dating/persuasion-action-plan-for-beginners?a=fabricewilliam",
      en: "https://whop.com/ds-parenting-and-dating/persuasion-action-plan-for-beginners?a=fabricewilliam",
    },
    title: {
      fr: "Plan d'Action Aisance Verbale, Rhétorique & Répartie Mentale",
      en: "Verbal Fluency, Persuasion & Mental Agility Action Plan",
    },
    subtitle: {
      fr: "Transformez votre richesse lexicale acquise sur Mot Mystère et Pendu en aisance orale et force de persuasion au quotidien.",
      en: "Turn the vocabulary and lexical speed built on Word Guess and Hangman into real-world persuasion and articulate communication.",
    },
    cta: {
      fr: "Accéder au guide sur Whop",
      en: "Access Blueprint on Whop",
    },
    priceRange: {
      fr: "Accès immédiat",
      en: "Instant Access",
    },
  },
  {
    id: "hostinger-brain-game-creator",
    partnerName: "Hostinger",
    category: "logic",
    url: {
      fr: "https://www.hostinger.com?REFERRALCODE=XVCFABRICNC4",
      en: "https://www.hostinger.com?REFERRALCODE=XVCFABRICNC4",
    },
    title: {
      fr: "Hostinger Cloud & Web — Créez et hébergez vos propres jeux de logique",
      en: "Hostinger Cloud & Web — Build and Host Your Own Logic & Puzzle Apps",
    },
    subtitle: {
      fr: "L'hébergement haute vitesse avec IA intégrée pour les passionnés d'algorithmes (Sudoku, 2048, Tour de Hanoï) qui veulent lancer leur site.",
      en: "High-speed web hosting for puzzle enthusiasts and developers building interactive Sudoku, 2048, or Tower of Hanoi projects.",
    },
    cta: {
      fr: "Lancer un projet sur Hostinger",
      en: "Launch Your Project on Hostinger",
    },
    priceRange: {
      fr: "Dès 2,99 € / mois",
      en: "From $2.99 / mo",
    },
  },
];

export function buildAmazonAffiliateUrl(searchQuery: string, lang: Language): string {
  const config = AMAZON_AFFILIATE_CONFIG[lang] ?? AMAZON_AFFILIATE_CONFIG.fr;
  const params = new URLSearchParams({
    k: searchQuery,
    tag: config.tag,
  });
  return `${config.baseUrl}?${params.toString()}`;
}

export interface GranmedAffiliateProduct {
  id: string;
  category: "memory" | "logic" | "reflex" | "words";
  relatedGameIds: string[];
  badge: Record<Language, string>;
  name: Record<Language, string>;
  brand: string;
  description: Record<Language, string>;
  cognitiveBenefit: Record<Language, string>;
  priceRange: Record<Language, string>;
  rating: number;
  reviewCount: number;
  searchQuery: Record<Language, string>;
  image: string;
}

export const GRANMED_AFFILIATE_CATALOG: GranmedAffiliateProduct[] = [
  {
    id: "memory-brain-book",
    category: "memory",
    relatedGameIds: ["sequence-memory", "memory-match", "jigsaw-puzzle", "health-true-false"],
    badge: {
      fr: "N°1 Mémoire de Travail",
      en: "#1 Working Memory Workbook",
    },
    name: {
      fr: "Grand Cahier d'Entraînement Cérébral & Mémoire Photographique (150 Exercices)",
      en: "Complete Working Memory & Photographic Brain Training Workbook for Adults",
    },
    brand: "NeuroGym Éditions",
    description: {
      fr: "150 exercices progressifs sur papier pour consolider l'empan visuo-spatial, la mémoire des chiffres et le rappel différé sans fatigue oculaire.",
      en: "150 progressive paper-based drills designed to expand visuospatial span, digit recall, and delayed memory retention away from screens.",
    },
    cognitiveBenefit: {
      fr: "Renforce le transfert synaptique entre la mémoire immédiate sur écran (Chimp Test, Matrice Mémoire) et l'écriture manuscrite.",
      en: "Bridges short-term digital recall (Chimp Test, Pattern Matrix) with handwriting-driven hippocampal consolidation.",
    },
    priceRange: {
      fr: "14,90 € – 19,90 €",
      en: "$13.99 – $18.99",
    },
    rating: 4.8,
    reviewCount: 640,
    searchQuery: {
      fr: "cahier entrainement cerebral memoire exercices adultes",
      en: "brain training memory workbook exercises for adults",
    },
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sudoku-logic-book",
    category: "logic",
    relatedGameIds: ["sudoku", "minesweeper", "2048-nutrition", "speed-math", "block-puzzle"],
    badge: {
      fr: "Référence Logique & QI",
      en: "Top Logic & Sudoku Pick",
    },
    name: {
      fr: "Recueil 1000 Grilles Sudoku Expert, Suites Logiques & Déduction Pure",
      en: "1000 Hard-to-Extreme Sudoku & Deductive Logic Puzzles Compendium",
    },
    brand: "Mensa / Larousse Logique",
    description: {
      fr: "Un pavé d'entraînement papier à gros caractères réunissant grilles de Sudoku progressives et problèmes de déduction pure inspirés des tests psychotechniques.",
      en: "Large-print logic compendium combining tournament-grade Sudoku grids with deductive matrix problems inspired by psychometric IQ batteries.",
    },
    cognitiveBenefit: {
      fr: "Stimule le cortex préfrontal dorsolatéral et l'élimination d'hypothèses sans aucune aide automatique.",
      en: "Activates the dorsolateral prefrontal cortex through pure pencil-mark candidate elimination.",
    },
    priceRange: {
      fr: "12,50 € – 16,90 €",
      en: "$11.99 – $16.50",
    },
    rating: 4.9,
    reviewCount: 1120,
    searchQuery: {
      fr: "livre 1000 sudoku expert casse tete logique adulte",
      en: "1000 sudoku puzzle book adults hard logic puzzles",
    },
    image: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "wooden-brain-teaser",
    category: "logic",
    relatedGameIds: ["2048-nutrition", "block-puzzle", "jigsaw-puzzle", "merge-garden", "minesweeper"],
    badge: {
      fr: "Logique Spatiale 3D",
      en: "3D Spatial Logic Pick",
    },
    name: {
      fr: "Tour de Hanoï en Bois Massif (9 Disques) & Coffret Casse-Têtes Logiques 3D",
      en: "Solid Wood 9-Ring Tower of Hanoi & 3D Mechanical Brain Teaser Set",
    },
    brand: "SiamMandalay / Montessori Pro",
    description: {
      fr: "Version physique artisanale en bois noble de la célèbre Tour de Hanoï d'Édouard Lucas, accompagnée de casse-têtes d'assemblage géométrique.",
      en: "Handcrafted solid-wood edition of Édouard Lucas's classic Tower of Hanoi paired with interlocking geometric brain teasers.",
    },
    cognitiveBenefit: {
      fr: "Mobilise la mémoire procédurale kinesthésique et la planification récursive $2^n - 1$ par la manipulation tactile.",
      en: "Engages kinesthetic procedural memory and recursive $2^n - 1$ planning through tactile manipulation.",
    },
    priceRange: {
      fr: "19,90 € – 27,90 €",
      en: "$18.99 – $26.99",
    },
    rating: 4.8,
    reviewCount: 490,
    searchQuery: {
      fr: "tour de hanoi bois casse tete logique 3d",
      en: "wooden tower of hanoi puzzle 3d brain teaser",
    },
    image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "schulte-speed-reading-book",
    category: "reflex",
    relatedGameIds: ["schulte-table", "speed-math", "fire-escape", "fruit-slice", "pill-toss"],
    badge: {
      fr: "Vision Périphérique & Lecture",
      en: "Peripheral Vision & Speed Reading",
    },
    name: {
      fr: "Guide Pratique de Lecture Rapide, Tables de Schulte & Attention Visuelle",
      en: "Speed Reading, Schulte Table Drills & Peripheral Vision Training Guide",
    },
    brand: "Eyrolles / Tony Buzan Collection",
    description: {
      fr: "Méthode complète avec grilles de Schulte imprimées (5x5 à 7x7), exercices de fixation fovéale et suppression de la subvocalisation.",
      en: "Complete training manual featuring printed Schulte grids (5x5 to 7x7), foveal fixation drills, and subvocalization reduction protocols.",
    },
    cognitiveBenefit: {
      fr: "Élargit le champ visuel utile de 35 % et réduit la fatigue des saccades oculaires lors de la lecture rapide.",
      en: "Expands functional visual span by up to 35% while reducing saccadic eye fatigue during rapid scanning.",
    },
    priceRange: {
      fr: "16,00 € – 22,00 €",
      en: "$15.50 – $21.99",
    },
    rating: 4.7,
    reviewCount: 380,
    searchQuery: {
      fr: "livre lecture rapide exercices concentration visuelle",
      en: "speed reading workbook peripheral vision exercises",
    },
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "blue-light-glasses",
    category: "reflex",
    relatedGameIds: ["schulte-table", "fire-escape", "fruit-slice", "pill-toss", "zen-fishing"],
    badge: {
      fr: "Protection Rétinienne Écran",
      en: "Screen Focus & Eye Comfort",
    },
    name: {
      fr: "Lunettes Anti-Lumière Bleue Haute Clarté pour Gaming & Concentration",
      en: "High-Clarity Blue Light Blocking Glasses for Cognitive Gaming & Focus",
    },
    brand: "Horus X / Gunnar Optiks",
    description: {
      fr: "Verres antireflets filtrant le spectre bleu-violet (380-450 nm) pour préserver la vigilance visuelle et le cycle de mélatonine en soirée.",
      en: "Anti-glare lenses filtering high-energy blue-violet light (380–450 nm) to preserve visual contrast and protect evening melatonin rhythms.",
    },
    cognitiveBenefit: {
      fr: "Maintient un temps de réaction stable sous les 230 ms même après une journée de travail sur ordinateur.",
      en: "Helps sustain sub-230 ms visual reaction times without digital eye strain after long workdays.",
    },
    priceRange: {
      fr: "29,90 € – 39,90 €",
      en: "$24.99 – $39.99",
    },
    rating: 4.8,
    reviewCount: 2450,
    searchQuery: {
      fr: "lunettes anti lumiere bleue ordinateur gaming fatigue oculaire",
      en: "blue light blocking glasses gaming computer eye strain",
    },
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "word-scrabble-dictionary",
    category: "words",
    relatedGameIds: ["daily-word", "longest-word", "mini-crossword", "guess-the-idiom", "interactive-story"],
    badge: {
      fr: "Bible des Jeux de Lettres",
      en: "Official Word Game Reference",
    },
    name: {
      fr: "L'Officiel des Jeux de Lettres, Anagrammes & Mots de 5 à 8 Lettres",
      en: "Official Word Game & 5-Letter Anagram Strategy Dictionary",
    },
    brand: "Larousse / Merriam-Webster",
    description: {
      fr: "Répertoire exhaustif des mots de 2 à 8 lettres, préfixes, suffixes et anagrammes fréquentes pour devenir imbattable à Mot Mystère et au Pendu.",
      en: "Comprehensive lexicon of 2-to-8 letter words, high-frequency vowel starters, and anagram patterns for Word Guess and Hangman mastery.",
    },
    cognitiveBenefit: {
      fr: "Enrichit l'intelligence cristallisée et accélère l'accès au lexique mental dans l'aire de Wernicke et de Broca.",
      en: "Expands crystallized verbal intelligence and speeds up lexical retrieval across language networks.",
    },
    priceRange: {
      fr: "22,90 € – 31,90 €",
      en: "$19.99 – $28.99",
    },
    rating: 4.9,
    reviewCount: 1890,
    searchQuery: {
      fr: "dictionnaire officiel scrabble mots croises jeux de lettres",
      en: "official scrabble players dictionary word games anagram book",
    },
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "precision-stylus",
    category: "logic",
    relatedGameIds: ["minesweeper", "sudoku", "mini-crossword", "memory-match", "jigsaw-puzzle"],
    badge: {
      fr: "Précision Tactile Zéro Erreur",
      en: "Zero-Misclick Touch Precision",
    },
    name: {
      fr: "Stylet Tactile Capacitif Haute Précision (Pointe Fine 1,5 mm Universelle)",
      en: "High-Precision 1.5mm Fine-Point Capacitive Stylus for Smartphone & Tablet",
    },
    brand: "Adonit / Metapen Pro",
    description: {
      fr: "Stylet équilibré en alliage d'aluminium offrant une visibilité parfaite sur les petites grilles de Démineur, Sudoku et Matrice Mémoire sur mobile.",
      en: "Balanced aluminum-alloy stylus delivering pinpoint accuracy on dense Minesweeper, Sudoku, and Pattern Matrix grids on mobile screens.",
    },
    cognitiveBenefit: {
      fr: "Élimine les erreurs de frappe tactile et améliore la vitesse de pointage fin de 28 % sur smartphone.",
      en: "Eliminates fat-finger misclicks and boosts fine motor pointing speed by 28% on touchscreens.",
    },
    priceRange: {
      fr: "18,90 € – 26,90 €",
      en: "$16.99 – $24.99",
    },
    rating: 4.7,
    reviewCount: 930,
    searchQuery: {
      fr: "stylet tactile haute precision smartphone tablette pointe fine",
      en: "fine point capacitive stylus pen for iphone ipad android tablet",
    },
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "omega3-brain-nutrition",
    category: "memory",
    relatedGameIds: ["sequence-memory", "memory-match", "speed-math", "health-true-false"],
    badge: {
      fr: "Nutrition Neuro-Cognitive",
      en: "Evidence-Based Brain Nutrition",
    },
    name: {
      fr: "Complexe Oméga-3 DHA Haute Pureté (EPA/DHA) & Magnésium Bisglycinate",
      en: "Ultra-Pure Omega-3 DHA Brain Complex & Magnesium L-Threonate",
    },
    brand: "Nutripure / Nordic Naturals",
    description: {
      fr: "Acides gras essentiels DHA certifiés Epax/IFOS soutenant la fluidité des membranes neuronales, la vitesse synaptique et la résistance à la fatigue mentale.",
      en: "IFOS-certified DHA essential fatty acids supporting neuronal membrane fluidity, synaptic transmission speed, and mental stamina.",
    },
    cognitiveBenefit: {
      fr: "Le DHA contribue au fonctionnement normal du cerveau dès 250 mg/jour (allégation officielle EFSA).",
      en: "Supports healthy synaptic plasticity, working-memory endurance, and calm cognitive focus.",
    },
    priceRange: {
      fr: "24,90 € – 34,90 €",
      en: "$26.99 – $36.99",
    },
    rating: 4.8,
    reviewCount: 1540,
    searchQuery: {
      fr: "omega 3 dha memoire cerveau concentration",
      en: "omega 3 dha brain memory focus supplement",
    },
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
  },
];

export function getAffiliateProductById(id: string): GranmedAffiliateProduct {
  return (
    GRANMED_AFFILIATE_CATALOG.find((item) => item.id === id) ??
    GRANMED_AFFILIATE_CATALOG[0]
  );
}

export function getAffiliateProductForGame(gameId: string): GranmedAffiliateProduct {
  return (
    GRANMED_AFFILIATE_CATALOG.find((item) => item.relatedGameIds.includes(gameId)) ??
    GRANMED_AFFILIATE_CATALOG[0]
  );
}

export function getPartnerOfferForCategory(
  category: "memory" | "logic" | "reflex" | "words"
): PartnerAffiliateOffer {
  return (
    PARTNER_AFFILIATE_OFFERS.find((offer) => offer.category === category) ??
    PARTNER_AFFILIATE_OFFERS[0]
  );
}
