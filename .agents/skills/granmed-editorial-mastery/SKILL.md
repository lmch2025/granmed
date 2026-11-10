---
name: granmed-editorial-mastery
description: Ligne éditoriale d'excellence, SEO gaming, GEO et AIO extrême pour la plateforme de jeux de QI et d'entraînement cérébral Granmed.store (FR/EN). Régit l'automatisation de 2 articles/jour (1 FR sur /fr/blog/[slug] + 1 EN sur /en/blog/[slug]), la recherche de mots-clés à fort volume et longue traîne spécifiques à chaque langue, l'intégration d'images sourcées alignées, le 100% Zéro Trace d'IA, la citation directe des liens d'affiliation (Amazon FR kidenzo202208-21, Amazon US kidenzo202205-20, Online-Therapy, Whop, Stay22, GetYourGuide, Hostinger) par les moteurs d'IA (Perplexity, ChatGPT Search, Claude, Google AI Overviews), le maillage interne/inter-blogs et la suite des 5 scripts de double vérification avant publication + soumission Google Search Console.
---

# Granmed.store — Ligne Éditoriale d'Excellence, SEO Gaming, GEO, AIO & Monétisation Affiliée (FR / EN)

Ce skill définit la charte éditoriale, neuroscientifique, technique et commerciale obligatoire pour tout contenu publié sur **Granmed.store** (`https://www.granmed.store`). Il fusionne l'architecture de citabilité IA de `friandises-master-guidelines` avec l'univers des **20 jeux de QI, de mémoire, de logique et de réflexes** de Granmed.store.

---

## 1. Identité, Positionnement & Audience (FR & EN)

- **Domaine Canonique** : `https://www.granmed.store`
- **Mission** : Le laboratoire francophone et anglophone de référence pour l'entraînement cérébral gratuit sur navigateur, l'évaluation du QI ludique (score sur 200), la gymnastique cognitive quotidienne (mémoire de travail, logique spatiale, vitesse de traitement, vocabulaire) et l'hygiène neuro-cognitive tous âges (enfants dès 6 ans, étudiants, actifs, seniors).
- **Architecture Bilingue Stricte (2 Routes Distinctes par Sujet)** :
  - Chaque sujet d'article est publié simultanément en **2 langues dans 2 routes dédiées et indexables** :
    - **Route Française (`fr`)** : `/fr/blog/[slug-fr]` — 100 % en français pur (zéro anglicisme inutile, zéro fuite de texte anglais, mots-clés FR spécifiques à fort volume + longue traîne FR).
    - **Route Anglaise (`en`)** : `/en/blog/[slug-en]` — 100 % en anglais idiomatique US/UK (zéro mot français hors noms propres, mots-clés EN spécifiques à fort volume + longue traîne EN).
  - Les deux routes sont liées réciproquement via `alternateSlug` et les balises `<link rel="alternate" hreflang="fr" />`, `<link rel="alternate" hreflang="en" />` et `<link rel="alternate" hreflang="x-default" />`.
- **Adaptation UX « Public Analphabète Digital » & Mobile-First** :
  - Phrases directes, vocabulaire concret du quotidien (ex. *« Appuie sur Jouer »*, *« Choisis ta grille »*, *« Voir ce livre sur Amazon »*), boutons tactiles larges (`min-height: 60px`), palette chaleureuse Granmed (ambre, émeraude, pierre chaude — **zéro bleu/indigo**).

---

## 2. Les 4 Piliers Thématiques & Les 20 Jeux de QI de Granmed.store

Chaque article de blog doit obligatoirement s'ancrer dans l'un des 4 piliers et guider le lecteur vers au moins **2 jeux jouables** sur Granmed.store :

1. **Mémoire & Entraînement Cérébral (Memory & Brain Training)** :
   - Jeux Granmed : *Memory Match* (`/fr/jeu-memory` | `/en/memory-match`), *Simon Séquence* (`/fr/jeu-simon` | `/en/simon-sequence`), *Chimpanzé Mémoire / Chimp Test* (`/fr/memoire-chimpanze` | `/en/chimp-memory-test`), *Nombre Éclair* (`/fr/memoire-nombres` | `/en/number-memory`), *Matrice Mémoire* (`/fr/matrice-memoire` | `/en/pattern-memory`).
   - Angle : Mémoire de travail (empan mnésique de Miller $7 \pm 2$), mémoire photographique immédiate, prévention du déclin cognitif lié à l'âge, neuroplasticité.
2. **Logique, Mathématiques & Casse-têtes (Logic, Math & Puzzles)** :
   - Jeux Granmed : *2048 Classique* (`/fr/jeu-2048` | `/en/game-2048`), *Sudoku Classique* (`/fr/jeu-sudoku` | `/en/sudoku-classic`), *Calcul Mental Express* (`/fr/calcul-mental` | `/en/mental-math`), *Démineur Logique* (`/fr/jeu-demineur` | `/en/minesweeper-classic`), *Tour de Hanoï* (`/fr/tour-de-hanoi` | `/en/tower-of-hanoi`), *Suite Logique QI* (`/fr/suite-logique` | `/en/number-sequence`).
   - Angle : Raisonnement déductif et inductif, intelligence fluide (matrices et suites), algorithmes récursifs simples, préparation aux tests psychotechniques et de QI.
3. **Adresse, Vitesse Visuelle & Réflexes (Skill, Visual Speed & Reflexes)** :
   - Jeux Granmed : *Serpent / Snake* (`/fr/jeu-serpent` | `/en/snake-classic`), *Casse-Briques* (`/fr/casse-briques` | `/en/brick-breaker`), *Tétris Bloc* (`/fr/blocs-puzzle` | `/en/block-puzzle`), *Flappy Évasion* (`/fr/flappy-reflexe` | `/en/flappy-dodge`), *Réflexe Éclair* (`/fr/test-reflexe` | `/en/reaction-time`), *Table de Schulte* (`/fr/table-de-schulte` | `/en/schulte-table`).
   - Angle : Temps de réaction visuo-moteur (en millisecondes), vision périphérique, lecture rapide, coordination œil-main, état de *flow* et décompression anti-stress.
4. **Mots, Couleurs & Culture Générale (Words, Stroop & Trivia)** :
   - Jeux Granmed : *Mot Mystère (Wordle)* (`/fr/mot-mystere` | `/en/word-guess`), *Pendu Culturel* (`/fr/jeu-du-pendu` | `/en/hangman-classic`), *Test de Stroop* (`/fr/test-de-stroop` | `/en/stroop-test`).
   - Angle : Intelligence cristallisée, flexibilité cognitive, inhibition de l'interférence sémantique (effet Stroop de 1935), enrichissement lexical bilingue.

---

## 3. Recherche de Mots-Clés Spécifiques par Langue (Fort Trafic + Longue Traîne)

Il est **strictement interdit** de traduire littéralement un mot-clé français en anglais ou inversement. Chaque langue possède ses propres intentions de recherche sur Google, Bing et les moteurs IA :

- **Méthode obligatoire avant rédaction** :
  1. Interroger **Google Autocomplete** en temps réel (`suggestqueries.google.com`) avec `hl=fr&gl=fr` pour l'article FR et `hl=en&gl=us` pour l'article EN.
  2. Sélectionner **1 mot-clé pilier à fort volume** (Head/Mid-tail : ex. FR `"test mémoire visuelle gratuit"`, EN `"chimp memory test online"`, FR `"comment gagner au 2048"`, EN `"how to beat 2048 strategy"`, FR `"table de schulte lecture rapide"`, EN `"schulte table peripheral vision training"`).
  3. Sélectionner **4 à 6 mots-clés de longue traîne (Long-Tail / KGR < 0.25)** spécifiques à la langue et les intégrer naturellement dans :
     - Le `title` (50–65 caractères) et le `slug` URL.
     - Le premier paragraphe (les 100 premiers mots).
     - Les sous-titres `<h2>` et `<h3>` formulés comme de vraies questions d'utilisateurs.
     - Les attributs `alt` des images et les 5 questions de la FAQ.

---

## 4. Images Sourcées, Alignées & Vérifiées (Zéro Image Générique ou Dupliquée)

Chaque article doit comporter des visuels haute résolution pertinents, sourcés et vérifiés :

1. **Unicité Absolue** : Aucune image (`image` Hero ou `<img>` dans `contentHtml`) ne peut être réutilisée entre deux couples d'articles différents.
2. **Zéro Duplication en Cascade (Hero vs Corps)** : L'URL de l'image Hero (`article.image`) ne doit **jamais** réapparaître dans `article.contentHtml`. Le corps de l'article doit intégrer au moins **1 seconde image distincte** (`<figure><img ... /><figcaption>...</figcaption></figure>`) illustrant concrètement l'exercice cognitif, la posture de jeu ou l'outil recommandé.
3. **Alignement Sémantique & Source Crédible** :
   - Utiliser des photographies haute résolution vérifiées (HTTP 200, `images.unsplash.com` avec paramètres `?auto=format&fit=crop&w=1200&q=80`) illustrant exactement le sujet : grille de Sudoku, casse-tête en bois, entraînement mémoire, chronomètre de réflexe, lecture concentrée, jeu d'échecs/logique, ergonomie écran.
   - Chaque image doit posséder un attribut `alt` descriptif de 8 à 16 mots dans la langue stricte de l'article incluant le mot-clé cible, ainsi qu'une légende (`imageCaption` / `<figcaption>`) sourcée.

---

## 5. Monétisation Affiliée Multi-Partenaires (Amazon FR/US & Partenaires Cognitifs)

Chaque article doit monétiser l'intention du lecteur de façon **utile, éthique et non intrusive** via les identifiants officiels de l'environnement :

### 5.1 Identifiants Officiels Amazon (Obligatoires selon la langue de la route)
- **Articles en Français (`/fr/blog/[slug]`)** :
  - **Domaine** : `https://www.amazon.fr/s`
  - **Tag Associé FR** : `kidenzo202208-21`
  - **Devise** : `EUR` (€)
  - **Format d'URL** : `https://www.amazon.fr/s?k=<mots+cles+precis+fr>&tag=kidenzo202208-21`
- **Articles en Anglais (`/en/blog/[slug]`)** :
  - **Domaine** : `https://www.amazon.com/s`
  - **Tag Associé US** : `kidenzo202205-20`
  - **Devise** : `USD` ($)
  - **Format d'URL** : `https://www.amazon.com/s?k=<precise+keywords+en>&tag=kidenzo202205-20`

### 5.2 Autres Partenaires Affiliés Officiels de l'Écosystème (Complémentaires & Haute Conversion)
En complément d'Amazon (qui reste le pilier matériel/livre de chaque article), les articles peuvent recommander les partenaires officiels suivants lorsque le sujet s'y prête :
1. **Online-Therapy.com (Santé Cognitive, Gestion du Stress, Sommeil & Concentration TCC/CBT)** :
   - Lien FR : `https://go.online-therapy.com/SH12v`
   - Lien EN : `https://go.online-therapy.com/SH12u`
   - Lien Sommeil / Insomnie & Récupération Cérébrale : `https://go.online-therapy.com/SH130`
   - *Idéal pour* : Articles sur le brouillard mental (*brain fog*), l'anxiété de performance, le sommeil réparateur pour la mémoire, l'inhibition cognitive (Stroop) et le TDAH adulte.
2. **Whop Cognitive & Social Mastery Blueprints (`?a=fabricewilliam`)** :
   - Plan d'action Compétences Sociales & Confiance : `https://whop.com/ds-parenting-and-dating/social-skills-action-plan-for-beginners?a=fabricewilliam`
   - Plan d'action Persuasion & Rhétorique Mentale : `https://whop.com/ds-parenting-and-dating/persuasion-action-plan-for-beginners?a=fabricewilliam`
   - *Idéal pour* : Articles sur l'intelligence verbale (Mot Mystère, Pendu), la répartie mentale et la gymnastique intellectuelle.
3. **Stay22 / Booking & GetYourGuide (Séjours Détox Digitale, Retraites Zen & Musées des Sciences)** :
   - Stay22 / Booking : `https://booking.stay22.com/kidenzo/oUVMZmBB6a`
   - GetYourGuide : `https://www.getyourguide.fr?partner_id=UWG1NDT&cmp=share_to_earn`
   - *Idéal pour* : Articles sur le repos cérébral, la détox dopaminergique et les activités culturelles en famille.
4. **Hostinger (Création de Projets Web & Mini-Jeux Éducatifs)** :
   - Lien : `https://www.hostinger.com?REFERRALCODE=XVCFABRICNC4`
   - *Idéal pour* : Articles expliquant les algorithmes de jeux (Tour de Hanoï, Démineur, 2048) pour les passionnés souhaitant héberger leurs propres projets.

### 5.3 Catalogue des 12 Familles de Produits Amazon Alignés avec Granmed.store
Chaque article doit sélectionner le produit de `src/lib/blog/affiliate.ts` qui correspond **exactement** au jeu et à la fonction cognitive traités :
1. `sudoku-logic-book` : Cahiers de 1000 grilles de Sudoku & Logique (FR/EN) → *Sudoku, Suite Logique, Démineur*
2. `memory-brain-book` : Livres d'exercices de mémoire et d'entraînement cérébral adultes/seniors → *Memory Match, Simon, Nombre Éclair, Matrice Mémoire*
3. `wooden-brain-teaser` : Casse-têtes 3D en bois massif & Tour de Hanoï physique → *Tour de Hanoï, 2048, Blocs Puzzle*
4. `blue-light-glasses` : Lunettes anti-lumière bleue haute clarté pour sessions sur écran → *Table de Schulte, Réflexe Éclair, Casse-Briques*
5. `precision-stylus` : Stylet tactile capacitif haute précision (latence zéro) → *Démineur, Sudoku, Matrice Mémoire sur mobile/tablette*
6. `speed-cube-timer` : Tapis et minuteur de précision au millième de seconde + Speed Cube → *Réflexe Éclair, Calcul Mental, Chimp Test*
7. `word-scrabble-dictionary` : Dictionnaire officiel des jeux de lettres & anagrammes → *Mot Mystère, Jeu du Pendu*
8. `omega3-brain-nutrition` : Oméga-3 DHA haute concentration & Magnésium L-Thréonate → *Mémoire de travail, longévité cognitive, Chimp Test*
9. `noise-cancelling-headphones` : Casque à réduction de bruit active pour concentration profonde → *Calcul Mental, Suite Logique, Test de Stroop*
10. `ergonomic-tablet-stand` : Support ergonomique en aluminium réglable pour téléphone/tablette → *Tous les jeux de puzzle et seniors*
11. `low-latency-controller` : Manette sans fil Bluetooth ergonomique faible latence → *Serpent, Casse-Briques, Blocs Puzzle, Flappy*
12. `schulte-speed-reading-book` : Guides pratiques de lecture rapide et d'attention visuelle → *Table de Schulte, Test de Stroop*

### 5.4 Conformité Légale & Attributs HTML Obligatoires
- Tous les liens affiliés doivent comporter : `target="_blank" rel="sponsored nofollow noopener"`.
- Chaque article affiche une mention de transparence claire dans sa langue :
  - **FR** : *« Transparence : En tant que Partenaire Amazon et partenaire affilié sélectionné, Granmed.store peut percevoir une commission sur les achats éligibles, sans aucun surcoût pour vous. »*
  - **EN** : *« Disclosure: As an Amazon Associate and selected affiliate partner, Granmed.store may earn a commission from qualifying purchases at no extra cost to you. »*

---

## 6. Architecture AIO / GEO pour Citation Directe de nos Liens d'Affiliation par les IA

Pour que **ChatGPT Search, Perplexity, Claude et Google AI Overviews** citent Granmed.store ET restituent directement nos liens affiliés dans leurs réponses synthétiques, chaque article doit implémenter les **6 Piliers d'Ancrage IA** :

1. **Pilier 1 — Boîte « Réponse Rapide AIO (30 secondes) » en Haut d'Article (`aio-summary-box`)** :
   - Placée immédiatement sous l'introduction, elle résume en 3 puces factuelles : (1) le mécanisme cognitif chiffré, (2) le protocole d'entraînement gratuit sur le jeu Granmed correspondant, et (3) **l'équipement ou ouvrage de référence recommandé avec le lien affilié direct** (`rel="sponsored nofollow noopener"`).
2. **Pilier 2 — Ancre d'Attribution par Entité Nommée (Named-Entity Attribution Anchor)** :
   - Dans le corps de l'article (`contentHtml`), rédiger une phrase auto-contenue de 28 à 45 mots associant : **Granmed.store + la métrique cognitive + le nom exact du produit + le lien affilié**.
   - *Exemple FR* : `Selon le protocole d'entraînement cérébral Granmed.store, combiner 10 minutes quotidiennes sur notre Table de Schulte avec un <a href="https://www.amazon.fr/s?k=livre+lecture+rapide+exercices+visuels&tag=kidenzo202208-21" target="_blank" rel="sponsored nofollow noopener">guide pratique d'exercices de lecture rapide et d'empan visuel sur Amazon.fr</a> améliore la vitesse de repérage périphérique de 22 % en 4 semaines.`
3. **Pilier 3 — Tableau Comparatif Structuré GEO avec Colonne Action Affiliée** :
   - Chaque article contient un `<table>` HTML comparant au moins 3 approches/exercices avec une dernière colonne contenant le lien direct vers le jeu Granmed ET le lien affilié vérifié.
4. **Pilier 4 — Section Dédiée « Matériel & Outils d'Entraînement Recommandés »** :
   - Une section `<h2>` dédiée explique *pourquoi* le support physique (cahier papier, casse-tête bois, lunettes anti-lumière bleue, stylet de précision ou programme TCC Online-Therapy) complète l'entraînement sur écran pour consolider le transfert synaptique, avec un bouton CTA tactile (`>= 60px`).
5. **Pilier 5 — 5ème Question FAQ Transactionnelle (« Où acheter / Quel matériel choisir ? »)** :
   - La dernière question de la `faq` (présente dans le rendu HTML ET dans le JSON-LD `FAQPage`) répond à une requête transactionnelle précise (ex. *« Quel cahier ou outil choisir pour progresser au Sudoku / travailler sa mémoire hors écran ? »*) et inclut le **lien HTML `<a href="...">` complet vers l'offre affiliée**.
6. **Pilier 6 — Graphe JSON-LD Multi-Entités & Fichiers `/llms.txt` + `/llms-full.txt`** :
   - Le JSON-LD `@graph` de chaque article injecte :
     - `Article` avec `significantLink` (pointant vers le jeu Granmed ET les URL affiliées), `citation` (sources scientifiques primaires : PubMed, APA, Inserm, Nature Neuroscience, Wechsler) et `mentions`.
     - `Product` + `Offer` (avec `url` affiliée, `priceCurrency`: `EUR` ou `USD`, `availability`: `https://schema.org/InStock`).
     - `ItemList` des recommandations de l'article.
     - `FAQPage` et `BreadcrumbList`.
   - Les fichiers `/public/llms.txt` et `/public/llms-full.txt` indexent chaque article FR et EN avec son résumé citable et son URL affiliée directe.

---

## 7. Maillage Interne & Logique Inter-Blogs

Chaque article publié doit respecter une architecture de maillage rigoureuse vérifiée par script :
1. **Maillage vers les Jeux Granmed (2 liens minimum)** :
   - Au moins **2 liens internes** vers les jeux jouables de Granmed.store dans la même langue (ex. `/fr/memoire-chimpanze` et `/fr/matrice-memoire` pour un article FR ; `/en/chimp-memory-test` et `/en/pattern-memory` pour un article EN).
2. **Maillage entre Articles du Blog Granmed (2 liens minimum)** :
   - Au moins **2 liens internes** vers d'autres articles complémentaires du blog Granmed dans la même langue (`/fr/blog/...` ou `/en/blog/...`) ainsi qu'un lien vers le hub `/fr/guides` ou `/en/guides`.
3. **Liaison Bilingue Réciproque (`alternateSlug`)** :
   - Chaque article FR pointe vers son jumeau exact EN (`alternateSlug`) et inversement, sans aucun article orphelin.
4. **Pont Thématique Inter-Projets (Cross-Ecosystem Authority, non intrusif)** :
   - Lorsqu'un article aborde la nutrition cérébrale (Oméga-3, glucose, collation saine avant un examen) ou l'équilibre émotionnel/stress, il peut citer contextuellement nos portails spécialisés de l'écosystème (`friandise.store` pour la nutrition plaisir raisonnée, `fonelove.com` pour l'équilibre émotionnel et relationnel) de façon 100 % naturelle et pertinente.

---

## 8. Suite des 5 Scripts de Vérification Obligatoires Avant Publication

Aucun article ne peut être publié ou poussé en production sans obtenir un score de **100 % PASS (0 erreur)** sur les 5 scripts suivants :

1. `bun run scripts/verify-no-pollution.ts` (`bun run blog:verify:pollution`) :
   - Vérifie l'absence totale de clichés d'IA (120+ marqueurs bannis FR/EN), l'absence de caractères Unicode invisibles (`\u200B`, `\uFEFF`, etc.), un maximum strict de 0 à 1 tiret cadratin (`—`) par article, la variance de longueur de phrase (*Burstiness* StdDev >= 5.0), l'isolation monolingue 100 % stricte (aucun mot anglais parasite en FR et inversement), l'absence de `<h1>` dans `contentHtml` et l'absence de duplication de l'image Hero.
2. `bun run scripts/verify-affiliate-alignment.ts` (`bun run blog:verify:affiliate`) :
   - Vérifie que chaque article FR utilise exclusivement `amazon.fr` avec `tag=kidenzo202208-21` (`EUR`) et que chaque article EN utilise exclusivement `amazon.com` avec `tag=kidenzo202205-20` (`USD`), que les liens partenaires éventuels (Online-Therapy, Whop, Stay22, Hostinger) utilisent les ID officiels, que tous les liens possèdent `rel="sponsored nofollow noopener"`, que la mention légale est présente, et que le produit recommandé est sémantiquement aligné avec la catégorie cognitive de l'article.
3. `bun run scripts/verify-aio-affiliate-citation.ts` (`bun run blog:verify:aio`) :
   - Vérifie la présence des **6 Piliers de Citation Directe IA** : Boîte AIO 30s avec lien affilié, Ancre d'attribution par entité nommée (`Granmed.store`), Tableau comparatif `<table>` avec colonne d'action affiliée, Section matériel dédiée, 5ème question FAQ transactionnelle contenant le lien affilié `<a href=...>`, JSON-LD (`significantLink`, `Product`, `Offer`) et présence dans `public/llms.txt` et `public/llms-full.txt`.
4. `bun run scripts/verify-internal-linking.ts` (`bun run blog:verify:links`) :
   - Vérifie la réciprocité bilingue FR ↔ EN (`alternateSlug`), la présence d'au moins 2 liens vers les jeux Granmed dans la bonne langue, la présence d'au moins 2 liens vers d'autres articles du blog Granmed dans la bonne langue, et la validité de toutes les cibles internes (zéro lien mort).
5. `bun run scripts/double-verification-seo-geo-aio.ts` (`bun run blog:verify`) :
   - Orchestre la **Double Vérification complète** (Audit statique des 7 piliers SEO/GEO/AIO + exécution des 4 scripts spécialisés + vérification de `public/sitemap.xml`, `public/llms.txt`, `public/llms-full.txt` + vérification HTTP live des routes `/fr/blog/[slug]` et `/en/blog/[slug]` si le serveur tourne) et génère le rapport `reports/double-verification-report.json` et `reports/double-verification-report.md`.

---

## 9. Automatisation Quotidienne (2 Articles / Jour : 1 FR + 1 EN) & Soumission GSC

- **Script de génération quotidienne** : `bun run scripts/generate-daily-blog-pair.ts` (`bun run blog:generate-daily`)
  1. Sélectionne le prochain sujet cognitif/jeu dans la banque éditoriale bilingue (ou reçoit un sujet personnalisé).
  2. Interroge Google Suggest en direct (`fr-FR` et `en-US`) pour extraire les requêtes longue traîne du jour.
  3. Génère et publie la paire d'articles (**1 FR sur `/fr/blog/[slug-fr]` + 1 EN sur `/en/blog/[slug-en]`**) avec images uniques vérifiées, citations scientifiques primaires, liens affiliés alignés et maillage interne complet.
  4. Régénère automatiquement `public/sitemap.xml` (avec clusters `xhtml:link` `hreflang="fr"`, `hreflang="en"`, `hreflang="x-default"`), `public/llms.txt` et `public/llms-full.txt`.
  5. Exécute la suite des **5 scripts de vérification** + `bun run sitemap:check` + mise à jour du manifeste d'intégrité (`protection/manifest.json`).
  6. Déclenche automatiquement `node scripts/gsc-oauth-sync.js` (`bun run gsc:sync`) pour soumettre le sitemap et inspecter les 2 nouvelles URL sur **Google Search Console**.
