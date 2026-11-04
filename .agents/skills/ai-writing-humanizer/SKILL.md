---
name: ai-writing-humanizer
description: Moteur de détection, d'audit et d'humanisation chirurgicale de contenu (Zéro Trace d'IA). Nettoie impitoyablement les 120+ marqueurs lexicaux d'IA, les structures syntaxiques robotiques, l'overdose de tirets cadratins, les caractères invisibles Unicode et la monotonie de phrase (Burstiness) pour garantir un contenu indétectable par GPTZero, CopyLeaks, Winston AI et les filtres SpamBrain de Google.
---

# 🕵️‍♂️ AI WRITING HUMANIZER — LE BOUCLIER ANTI-DÉTECTEUR & ZERO TRACE D'IA

Ce skill est le filtre de sécurité ultime de notre réseau éditorial. Il prend n'importe quel brouillon, plan ou texte et applique un protocole d'assainissement en **5 passes déterministes** pour éliminer toute trace statistique d'intelligence artificielle, garantissant que le texte se lise comme l'œuvre authentique d'un expert humain chevronné.

---

## 🔬 LES 5 PASSED D'ASSAINISSEMENT CHIRURGICAL

### PASSE 1 : Élimination des Caractères Invisibles & Watermarks Unicode
Certains générateurs et éditeurs injectent des caractères non imprimables qui servent de marqueurs ou qui cassent l'affichage :
- **Espaces sans chasse (`\u200B` - Zero-Width Space)**.
- **Marques directionnelles (`\u200E`, `\u200F`) et overrides LTR/RTL**.
- **Caractères d'étiquettes Unicode (Unicode Tags `\uE0000` à `\uE007F`)**.
- **Espaces insécables exotiques non standard**.
*Action : Purge systématique de tous ces glyphes invisibles.*

---

### PASSE 2 : Éradication des Tirets Cadratins (Em Dashes —)
Le tiret cadratin (`—`) est l'indicateur statistique le plus fiable utilisé par les détecteurs d'IA (CopyLeaks, Turnitin, GPTZero). Les modèles de langage l'utilisent compulsivement pour créer une fausse variété de phrase sans devoir choisir entre une virgule, une parenthèse ou un point-virgule.

**RÈGLE STRICTE :**
- Maximum absolu : **0 à 1 tiret cadratin sur la totalité d'un article**.
- Remplacement systématique :
  - `Le résultat — qui était surprenant — a montré...` $\rightarrow$ `Le résultat, pourtant surprenant, a montré...`
  - `Cette approche — contrairement aux méthodes classiques — permet...` $\rightarrow$ `Cette approche (contrairement aux méthodes classiques) permet...`
  - `Trois éléments sont requis — le temps, la farine et l'eau.` $\rightarrow$ `Trois éléments sont requis : le temps, la farine et l'eau.`

---

### PASSE 3 : Remplacement Systématique des 120+ Mots et Tournures d'IA

#### Verbes Surutilisés par les LLM :
| Verbe Banni | Remplacement Humain Obligatoire |
| :--- | :--- |
| *Delve (into) / Plonger au cœur de* | Explorer, analyser, examiner, décortiquer |
| *Leverage / Tirer parti de / Exploiter* | Utiliser, appliquer, s'appuyer sur |
| *Foster / Favoriser / Nourrir* | Encourager, stimuler, aider à développer |
| *Bolster / Renforcer* | Consolider, soutenir, appuyer |
| *Underscore / Souligner avec insistance* | Montrer, mettre en évidence, pointer |
| *Streamline / Rationaliser / Optimiser à l'extrême* | Simplifier, accélérer, fluidifier |
| *Navigate / Naviguer à travers les défis* | Gérer, traverser, surmonter |
| *Elucidate / Élucider* | Expliquer, clarifier |

#### Adjectifs & Superlatifs Artificiels :
| Adjectif Banni | Remplacement Humain Obligatoire |
| :--- | :--- |
| *Crucial / Pivotal / Vital / Primordial* | Déterminant, essentiel, clé, important |
| *Robust / Robuste (dans un contexte vague)* | Solide, fiable, éprouvé |
| *Seamless / Sans couture / Fluide à souhait* | Simple, direct, sans friction |
| *Comprehensive / Exhaustif* | Complet, détaillé, pas-à-pas |
| *Transformative / Révolutionnaire* | Efficace, rentable (donner le chiffre exact) |
| *Nuanced / Nuancé / Multifaceted* | Précis, varié, complexe |
| *Holistic / Holistique* | Global, d'ensemble |

#### Connecteurs & Tics de Transition d'IA :
| Transition Bannie | Remplacement Humain Obligatoire |
| :--- | :--- |
| *Dans un monde en constante évolution...* | SUPPRIMER. Commencer par l'action directe. |
| *En conclusion... / En somme...* | « Le verdict », « Ce qu'il faut retenir », « En clair » |
| *Il convient de noter que... / Il est important de...* | « Retenez que », « Point clé : » ou attaquer directement |
| *Force est de constater...* | Citer le chiffre réel directement |
| *Tapestry / Mosaïque / Symbiose parfaite* | Assemblage, ensemble, réalité |
| *Que vous soyez X, Y ou Z...* | SUPPRIMER. Parler directement à l'intention du lecteur. |
| *Non seulement X, mais aussi Y...* | Faire deux phrases courtes distinctes. |

---

### PASSE 4 : Calibration du Rythme et du Burstiness (Variance de Longueur)
Les détecteurs d'IA mesurent la **Perplexité** (imprévisibilité du choix des mots) et le **Burstiness** (variation de la longueur et de la structure des phrases). L'écriture d'IA a un rythme métronome (phrases de 15 à 22 mots régulières).

#### La Formule du Rythme Humain :
1. **La Frappe Courte (3 à 7 mots)** :
   - *« C'est faux. »*
   - *« Voici la règle exacte. »*
   - *« Le thermomètre ne ment pas. »*
   - *« L'attente est inutile. »*
2. **Le Développement Moyen (12 à 18 mots)** :
   - *« Au-delà de 24 heures au frais, la dégradation du réseau glutineux s'accélère et la pâte perd son élasticité. »*
3. **L'Analyse Pratique (avec chiffres et nuances vécues)** :
   - *« Lors de nos 14 jours de test, la batterie a tenu 32 heures avec l'écran allumé à 50% de luminosité. »*

**Règle mathématique** : Sur 10 phrases consécutives, il doit y avoir au moins 2 phrases de moins de 8 mots et aucune phrase identique en nombre de mots que sa voisine immédiate.

---

### PASSE 5 : Injection d'Expérience Première Main (First-Hand E-E-A-T)
Pour rendre un texte 100% inattaquable par les algorithmes de spam :
- **Injecter des détails physiques tangibles** :
  - Mentionner des outils précis (thermomètre sonde testo, balance 0.01 g, sonomètre, chronomètre).
  - Décrire des sensations concrètes (l'odeur acidulée du levain à pH 4.1, la sensation de chauffe d'un chargeur à 42°C, le silence pesant d'un salon à 23h).
  - Inclure un échec ou une anomalie rencontrée lors du test (*« Au premier essai, la préparation a débordé parce que... »*). Les IA ne génèrent jamais d'échecs réalistes spontanés.

---

## 🛠️ CHECKLIST D'AUTO-CONTRÔLE RAPIDE (AUDIT 60 SECONDES)

Avant de valider un texte pour publication :
- [ ] Zéro tiret cadratin `—` (ou max 1 justifié).
- [ ] Aucun des mots interdits (*delve, tapestry, crucial, non seulement... mais aussi*).
- [ ] Première phrase de l'article percutante (zéro « Dans un monde moderne... »).
- [ ] Présence d'au moins 3 phrases courtes percutantes (< 8 mots) dans les 300 premiers mots.
- [ ] Au moins 1 détail d'expérimentation réelle ou métrique chiffrée issue du terrain.
- [ ] Texte 100% dans la langue cible (zéro mot de franglais ou d'anglicisme résiduel).
