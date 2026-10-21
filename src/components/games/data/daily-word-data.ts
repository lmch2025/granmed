/**
 * Dictionnaires du jeu « Mot du Jour » (daily-word).
 * - Mots de 5 lettres, réels, sans diacritiques (ou forme sans accent non ambiguë :
 *   APRES, ARRET, SANTE…).
 * - FR et EN ont des dictionnaires SÉPARÉS (réponses + mots de tentative supplémentaires).
 * - Le mot du jour est déterministe : index = jours écoulés depuis le 2025-01-01
 *   (date locale) modulo la taille de la liste.
 */

export const FR_ANSWERS: string[] = [
  'ABORD', 'ACHAT', 'ACIER', 'ACTIF', 'ADIEU', 'AIGLE', 'AIGRE', 'AJOUT', 'ALBUM', 'ALGUE',
  'ALLER', 'AMOUR', 'AMPLE', 'ANGES', 'ANGLE', 'ANNEE', 'APPEL', 'APRES', 'ARBRE', 'ARGON',
  'ARMEE', 'ARRET', 'ASILE', 'ASSEZ', 'ASSIS', 'ATOME', 'AUCUN', 'AUTEL', 'AVANT', 'AVION',
  'AVOIR', 'ACCES', 'ANCRE', 'LAINE', 'BACON', 'BAGUE', 'BALAI', 'BALLE', 'BANAL', 'BANDE',
  'BANJO', 'BARBE', 'BARIL', 'BARRE', 'BASSE', 'BATON', 'BEIGE', 'BELGE', 'BENNE', 'BIJOU',
  'BILAN', 'BLANC', 'BLOND', 'BOIRE', 'BOITE', 'BOMBE', 'BONTE', 'BOTTE', 'BOULE', 'BOURG',
  'BRAVO', 'BRIDE', 'BRISE', 'BRUIT', 'BRUME', 'BUCHE', 'BULLE', 'BUTIN', 'CABAS', 'CABLE',
  'CACAO', 'CACHE', 'CADRE', 'CALME', 'CANAL', 'CANNE', 'CANON', 'CARRE', 'CARTE', 'CASTE',
  'CAUSE', 'CEDRE', 'CHAIR', 'CHAMP', 'CHANT', 'CHAUD', 'CHIEN', 'CHOIX', 'CHOSE', 'CIVET',
  'CIVIL', 'CLAIR', 'COLLE', 'CONTE', 'COPIE', 'COUDE', 'COUPE', 'COQUE', 'CORDE', 'CORNE',
  'CORPS', 'COTON', 'COURS', 'CRABE', 'CRAIE', 'CRANE', 'CRIER', 'CREME', 'CREPE', 'CRISE',
  'CRIME', 'CROIX', 'CUIRE', 'CYCLE', 'CYGNE', 'CHAOS', 'CERNE', 'CARPE', 'CHATS', 'CIDRE',
  'COLON', 'DANSE', 'DATTE', 'DEBUT', 'DECOR', 'DEGRE', 'DELAI', 'DEMON', 'DESIR', 'DETTE',
  'DINDE', 'DIGNE', 'DENTS', 'DOIGT', 'DOUZE', 'DRAME', 'DROIT', 'DRONE', 'DIEUX', 'DUNES',
  'ECOLE', 'ECART', 'ECRAN', 'ECHEC', 'EFFET', 'ENFER', 'ENFIN', 'ENNUI', 'ENTRE', 'ENVIE',
  'ENVOI', 'EPAIS', 'EPOUX', 'ETAGE', 'ETANG', 'ETAPE', 'ETUDE', 'EXACT', 'EXCES', 'ESSAI',
  'ENCRE', 'FABLE', 'FARCE', 'FAUTE', 'FEMME', 'FERME', 'FIBRE', 'FIGUE', 'FILET', 'FILLE',
  'FINAL', 'FLEUR', 'FLUTE', 'FOIRE', 'FOLIE', 'FORCE', 'FORET', 'FORGE', 'FORME', 'FOSSE',
  'FOULE', 'FOYER', 'FRAIS', 'FRANC', 'FREIN', 'FRITE', 'FRONT', 'FRUIT', 'FUMEE', 'FUSEE',
  'FUSIL', 'FLANC', 'FICHE', 'FELIN', 'FENTE', 'FUMER', 'GAINS', 'GALET', 'GALOP', 'GARDE',
  'GEANT', 'GELEE', 'GENIE', 'GENOU', 'GENRE', 'GEOLE', 'GERBE', 'GERME', 'GESTE', 'GIVRE',
  'GLACE', 'GLAND', 'GLOBE', 'GOMME', 'GORGE', 'GOSSE', 'GRADE', 'GRAIN', 'GRAND', 'GRAVE',
  'GUEPE', 'GUIDE', 'HACHE', 'HABIT', 'HARPE', 'HERBE', 'HEROS', 'HEURE', 'HIVER', 'HOMME',
  'HONTE', 'HOTEL', 'HUILE', 'ICONE', 'IDEAL', 'IMAGE', 'IMPOT', 'INDEX', 'ISSUE', 'JADIS',
  'JAMBE', 'JAUGE', 'JAUNE', 'JETON', 'JEUDI', 'JEUNE', 'JOKER', 'JOLIE', 'JOUES', 'JOUER',
  'JOUET', 'JOIES', 'JOURS', 'JUGER', 'JUPON', 'JURER', 'JUSTE', 'JARRE', 'JOYAU', 'LABEL',
  'LAMPE', 'LANCE', 'LAPIN', 'LARGE', 'LASER', 'LATIN', 'LAVER', 'LEVER', 'LEVRE', 'LIBRE',
  'LIEGE', 'LIGNE', 'LIMON', 'LINGE', 'LISSE', 'LISTE', 'LITRE', 'LIVRE', 'LOGER', 'LOTUS',
  'LOUPE', 'LOUVE', 'LUNDI', 'LUTIN', 'LUTTE', 'LYCEE', 'MACON', 'MAGIE', 'MALIN', 'MAMAN',
  'MAREE', 'MARGE', 'MARIN', 'MATIN', 'MAUVE', 'MELON', 'MENER', 'MERCI', 'METAL', 'METEO',
  'METRE', 'MIEUX', 'MILLE', 'MINCE', 'MINES', 'MOINE', 'MOINS', 'MOMIE', 'MONDE', 'MOTIF',
  'MOULE', 'MURET', 'MUSEE', 'MYTHE', 'MAINS', 'MELEE', 'NAVET', 'NEIGE', 'NICHE', 'NOBLE',
  'NOEUD', 'NOTRE', 'NOUER', 'NOYAU', 'NOIRE', 'OASIS', 'OBEIR', 'OBJET', 'OCEAN', 'ODEUR',
  'OFFRE', 'OLIVE', 'OMBRE', 'ONCLE', 'OPERA', 'ORAGE', 'ORDRE', 'OSIER', 'OTAGE', 'OURSE',
  'OUTIL', 'OUBLI', 'OUVRE', 'OVULE', 'ORGUE', 'PAIRE', 'PALME', 'PANDA', 'PAROI', 'PARER',
  'PASSE', 'PATES', 'PATIN', 'PATTE', 'PAVOT', 'PAUSE', 'PELLE', 'PENDU', 'PENTE', 'PERDU',
  'PERLE', 'PESER', 'PETIT', 'PHARE', 'PHOTO', 'PIANO', 'PIECE', 'PIEGE', 'PILON', 'PINCE',
  'PLACE', 'PLAIE', 'PLAGE', 'PLAID', 'PLEIN', 'PLEUR', 'PLIER', 'PLUIE', 'PLUME', 'POCHE',
  'POELE', 'POEME', 'POIDS', 'POING', 'POINT', 'POIRE', 'POMME', 'POMPE', 'PORTE', 'POSTE',
  'POUCE', 'POULE', 'PRISE', 'PRIVE', 'PRUNE', 'PUITS', 'PREND', 'QUART', 'QUEUE', 'RADIO',
  'RAIDE', 'RAMPE', 'RATER', 'RAVIN', 'RECIT', 'REGAL', 'REGLE', 'REINE', 'RENNE', 'REPAS',
  'REFUS', 'REPOS', 'RESTE', 'RHUME', 'RICHE', 'RIVAL', 'ROBOT', 'ROCHE', 'ROMAN', 'RONDE',
  'ROUGE', 'ROUTE', 'RUINE', 'RUSSE', 'SABLE', 'SACRE', 'SALLE', 'SALON', 'SALUT', 'SANTE',
  'SAUCE', 'SAULE', 'SATIN', 'SAUVE', 'SAVON', 'SCENE', 'SCIER', 'SEIZE', 'SELON', 'SENAT',
  'SEPIA', 'SERIE', 'SERRE', 'SERUM', 'SEUIL', 'SIEGE', 'SIGNE', 'SILEX', 'SINGE', 'SINON',
  'SIROP', 'SOMME', 'SONGE', 'SORTE', 'SOUPE', 'SOURD', 'SPORT', 'STADE', 'STAGE', 'STYLE',
  'SUCRE', 'SUITE', 'SUJET', 'SUPER', 'TABAC', 'TABLE', 'TACHE', 'TAIRE', 'TALON', 'TANTE',
  'TAPIS', 'TARIF', 'TASSE', 'TAXER', 'TEINT', 'TEMPS', 'TENIR', 'TENTE', 'TERME', 'TERRE',
  'TEXTE', 'TIGRE', 'TIENS', 'TIRER', 'TOILE', 'TOMBE', 'TONNE', 'TORSE', 'TOTAL', 'TOTEM',
  'TOURS', 'TRACT', 'TRAIN', 'TRAIT', 'TRIBU', 'TRIER', 'TROIS', 'TRONE', 'TUYAU', 'UNITE',
  'USAGE', 'USINE', 'USURE', 'UTILE', 'VACHE', 'VAGUE', 'VALET', 'VALSE', 'VASTE', 'VEINE',
  'VENIR', 'VENTE', 'VERRE', 'VESTE', 'VIDEO', 'VIDER', 'VIEIL', 'VIEUX', 'VIGNE', 'VILLE',
  'VIOLE', 'VIRUS', 'VISER', 'VITRE', 'VOICI', 'VOILE', 'VOLET', 'VOLER', 'VOTRE', 'VRAIE',
  'WAGON', 'ZEBRE',
]

/** Tentatives supplémentaires acceptées (5 lettres, sans diacritiques). */
export const FR_EXTRA: string[] = [
  'ABOLI', 'ABOUT', 'ADMIS', 'AIDES', 'AIDER', 'AIMER', 'AIMES', 'AMENE', 'AMIES', 'AMONT',
  'AMUSE', 'ANTAN', 'APPUI', 'ARENE', 'AROME', 'AURAS', 'AVALE', 'AVONS', 'AVAIT', 'ALLEE',
  'AVALA', 'AGITE', 'AUNES', 'BATTU', 'BAIES', 'BAINS', 'BERCE', 'BISES', 'BLOCS', 'BOUGE',
  'BONDS', 'BORDS', 'BOUCS', 'BOUTS', 'BRINS', 'BRUNE', 'BRULE', 'BADGE', 'BATIS', 'BENIR',
  'BETON', 'BLEUE', 'BORNE', 'BRAVE', 'BRUNS', 'CAVES', 'CABAN', 'CADET', 'CAMPE', 'CASSE',
  'CEINT', 'CERFS', 'CESSE', 'CHAPE', 'CHERE', 'CHERS', 'CIELS', 'CIRER', 'CLONE', 'CLOUS',
  'COACH', 'COINS', 'COLIS', 'COULE', 'COUPS', 'COURT', 'CROIS', 'CROIT', 'CULOT', 'CHOCS',
  'CIMES', 'COUTS', 'DAMES', 'DEBIT', 'DEFIS', 'DEVIS', 'DINER', 'DORER', 'DOUCE', 'DONNE',
  'DELTA', 'DEGEL', 'DEUIL', 'DIGUE', 'DOYEN', 'EBENE', 'ECRIT', 'ECUME', 'ELIRE', 'ERRER',
  'ETHER', 'ETAIN', 'EVIER', 'EPRIS', 'ESSOR', 'ENJEU', 'ENVOL', 'ECLAT', 'FONDU', 'FOINS',
  'FONCE', 'FETES', 'FILER', 'FINIR', 'FINIS', 'FIXER', 'FLORE', 'FAUVE', 'GAGNE', 'GAGES',
  'GITES', 'GRECS', 'GRELE', 'GRIVE', 'GEMIR', 'GUEUX', 'HAIES', 'HAUTS', 'HEBDO', 'HERSE',
  'HERON', 'HEURT', 'HORDE', 'HOULE', 'HUMER', 'IDEES', 'IMITE', 'IDOLE', 'IGLOU', 'JABOT',
  'JETES', 'JUPES', 'JUGES', 'JETER', 'JALON', 'JURON', 'KAKIS', 'LEVEE', 'LOUPS', 'LAQUE',
  'LIANE', 'LILAS', 'LARVE', 'MAJOR', 'MARES', 'MATHS', 'MEURT', 'MOULU', 'MONTS', 'MUSES',
  'MODES', 'MISES', 'MANGE', 'MELER', 'MURER', 'MECHE', 'MERLE', 'METRO', 'MICRO', 'NERFS',
  'NOTER', 'NOTES', 'NUAGE', 'ONDES', 'ORAUX', 'ORQUE', 'PALES', 'PAPAS', 'PARCS', 'PAUME',
  'PENSE', 'PRETE', 'PRIER', 'PIPES', 'PARTI', 'PREAU', 'PRIME', 'RANCE', 'RAIES', 'RATON',
  'REBUT', 'REVES', 'RIENT', 'RIRES', 'ROBES', 'ROUES', 'RUSES', 'RARES', 'RALER', 'RAMER',
  'RAMES', 'RAYER', 'REVER', 'RIVER', 'RIVES', 'RUBAN', 'RUCHE', 'RUMBA', 'RABOT', 'SAPIN',
  'SCEAU', 'SERPE', 'SOUCI', 'STELE', 'TAROT', 'TEMPE', 'TITRE', 'VIGIE', 'VISON', 'SAUTE',
  'FINIT', 'JETTE', 'NAGES', 'OBEIS', 'OBEIT', 'ROTIT', 'SALUE', 'TAPES', 'TESTE', 'TIRES',
  'TRACE', 'VERSE', 'VOLES', 'VOTES', 'BANCS', 'CAGES', 'COTES', 'AILES', 'FILMS', 'GANTS',
  'PURES', 'CHOUX', 'NORDS', 'PIEDS', 'PORTS', 'RANGS', 'SITES', 'TROUS', 'CLANS', 'FOURS',
  'BUVEZ', 'SERAS', 'SERAI', 'COCON', 'CODES', 'BAGNE', 'BOEUF', 'CANOT', 'CARGO', 'DORMI',
  'INCLU', 'JOINT', 'PEINT', 'SAISI', 'SENTI', 'SERVI', 'SORTI', 'SUIVI', 'CEDER', 'PAYER',
  'ROTIR', 'SEMER', 'ABIME', 'BATTE', 'BAUME', 'BONZE', 'GAULE', 'GOURD', 'MEULE', 'NAPPE',
  'RAYON', 'SONDE', 'FACON', 'GIGOT', 'HAVRE', 'ETUVE', 'EXILE', 'MOTTE',
]

export const EN_ANSWERS: string[] = [
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
  'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE',
  'ALONG', 'ALTER', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'ANKLE', 'APART', 'APPLE', 'APPLY',
  'ARENA', 'ARGUE', 'ARISE', 'AROMA', 'ARRAY', 'ARROW', 'ASIDE', 'ASSET', 'AUDIO', 'AVOID',
  'AWAKE', 'AWARD', 'AWARE', 'BADGE', 'BAKER', 'BASIC', 'BEACH', 'BEGIN', 'BEING', 'BELOW',
  'BENCH', 'BERRY', 'BIRTH', 'BLACK', 'BLADE', 'BLAME', 'BLANK', 'BLAST', 'BLEND', 'BLESS',
  'BLIND', 'BLOCK', 'BLOOD', 'BLOOM', 'BOARD', 'BONUS', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN',
  'BRAND', 'BRAVE', 'BREAD', 'BREAK', 'BRICK', 'BRIDE', 'BRIEF', 'BRING', 'BROAD', 'BROKE',
  'BROWN', 'BRUSH', 'BUILD', 'BUNCH', 'BURST', 'BUYER', 'CABIN', 'CABLE', 'CANDY', 'CARGO',
  'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHALK', 'CHARM', 'CHART', 'CHASE', 'CHEAP',
  'CHECK', 'CHEEK', 'CHEER', 'CHESS', 'CHEST', 'CHIEF', 'CHILD', 'CHILL', 'CHOSE', 'CLAIM',
  'CLASS', 'CLEAN', 'CLEAR', 'CLERK', 'CLICK', 'CLIFF', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD',
  'COACH', 'COAST', 'COLOR', 'COMET', 'COMIC', 'CORAL', 'COUCH', 'COUGH', 'COULD', 'COUNT',
  'COURT', 'COVER', 'CRAFT', 'CRANE', 'CRASH', 'CRAWL', 'CRAZY', 'CREAM', 'CRIME', 'CRISP',
  'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CURVE', 'CYCLE', 'DAILY', 'DAIRY', 'DANCE', 'DEBUT',
  'DELAY', 'DEPTH', 'DERBY', 'DEVIL', 'DIARY', 'DIGIT', 'DIRTY', 'DONOR', 'DOUGH', 'DOZEN',
  'DRAFT', 'DRAIN', 'DRAMA', 'DREAM', 'DRESS', 'DRIED', 'DRIFT', 'DRILL', 'DRINK', 'DRIVE',
  'DROVE', 'DYING', 'EAGER', 'EAGLE', 'EARLY', 'EARTH', 'EIGHT', 'ELITE', 'EMPTY', 'ENEMY',
  'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA',
  'FAITH', 'FALSE', 'FANCY', 'FAULT', 'FAVOR', 'FEAST', 'FENCE', 'FERRY', 'FEVER', 'FEWER',
  'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FLAME', 'FLASH', 'FLEET',
  'FLESH', 'FLOAT', 'FLOCK', 'FLOOD', 'FLOOR', 'FLOUR', 'FLUID', 'FLUTE', 'FOCUS', 'FORCE',
  'FORGE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRAUD', 'FRESH', 'FRONT', 'FROST',
  'FRUIT', 'FUNNY', 'GAUGE', 'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GLOVE', 'GOING', 'GRACE',
  'GRADE', 'GRAIN', 'GRAND', 'GRANT', 'GRAPE', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GREET',
  'GRIEF', 'GRILL', 'GROSS', 'GROUP', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'GUILT', 'HAPPY',
  'HEART', 'HEAVY', 'HELLO', 'HENCE', 'HOBBY', 'HONEY', 'HONOR', 'HORSE', 'HOTEL', 'HOUSE',
  'HUMAN', 'HUMOR', 'HURRY', 'IDEAL', 'IMAGE', 'IMPLY', 'INDEX', 'INNER', 'INPUT', 'ISSUE',
  'IVORY', 'JELLY', 'JOINT', 'JUDGE', 'JUICE', 'JUICY', 'KNIFE', 'KNOCK', 'KNOWN', 'LABEL',
  'LARGE', 'LASER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEMON',
  'LEVEL', 'LIGHT', 'LIMIT', 'LINEN', 'LIVER', 'LOCAL', 'LOGIC', 'LOOSE', 'LOWER', 'LOYAL',
  'LUCKY', 'LUNCH', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MAPLE', 'MARCH', 'MATCH', 'MAYBE',
  'MAYOR', 'MEANT', 'MEDAL', 'MEDIA', 'MERCY', 'MERGE', 'MERIT', 'METAL', 'METER', 'MIDST',
  'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT',
  'MOUSE', 'MOUTH', 'MOVIE', 'MUSIC', 'NAKED', 'NASTY', 'NAVAL', 'NERVE', 'NEVER', 'NEWLY',
  'NIGHT', 'NOBLE', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER',
  'OFTEN', 'OLIVE', 'ONION', 'ONSET', 'OPERA', 'ORBIT', 'ORDER', 'ORGAN', 'OTHER', 'OUGHT',
  'OUNCE', 'OUTER', 'OWNER', 'OXIDE', 'OZONE', 'PAINT', 'PANEL', 'PAPER', 'PARTY', 'PASTA',
  'PATCH', 'PAUSE', 'PEACE', 'PEACH', 'PEARL', 'PENNY', 'PHASE', 'PHONE', 'PHOTO', 'PIANO',
  'PIECE', 'PILOT', 'PITCH', 'PIZZA', 'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'PLAZA',
  'POINT', 'POLAR', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR',
  'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'PULSE', 'PUPIL', 'PURSE', 'QUEEN', 'QUICK', 'QUIET',
  'QUITE', 'RADIO', 'RAISE', 'RALLY', 'RANCH', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'REACT',
  'READY', 'REALM', 'REBEL', 'REFER', 'RELAX', 'REPLY', 'RIGHT', 'RIGID', 'RISKY', 'RIVAL',
  'RIVER', 'ROAST', 'ROBIN', 'ROBOT', 'ROMAN', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RURAL',
  'SADLY', 'SALAD', 'SAUCE', 'SCALE', 'SCARE', 'SCENE', 'SCOPE', 'SCORE', 'SCOUT', 'SENSE',
  'SERVE', 'SEVEN', 'SHADE', 'SHAKE', 'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEEP', 'SHEET',
  'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORE', 'SHORT', 'SHOUT',
  'SHOWN', 'SIGHT', 'SILLY', 'SINCE', 'SIXTH', 'SIXTY', 'SKILL', 'SLEEP', 'SLICE', 'SLIDE',
  'SMALL', 'SMART', 'SMELL', 'SMILE', 'SMOKE', 'SNACK', 'SOLAR', 'SOLID', 'SOLVE', 'SORRY',
  'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPARK', 'SPEAK', 'SPEED', 'SPEND', 'SPICE', 'SPLIT',
  'SPOON', 'SPORT', 'SQUAD', 'STAFF', 'STAGE', 'STAKE', 'STAND', 'STARE', 'START', 'STATE',
  'STEAM', 'STEEL', 'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM', 'STORY',
  'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUNNY', 'SUPER', 'SWEET', 'SWIFT',
  'SWING', 'SWORD', 'TABLE', 'TAKEN', 'TASTE', 'TEACH', 'TEETH', 'TEMPO', 'TENTH', 'THANK',
  'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD', 'THOSE',
  'THREE', 'THREW', 'THROW', 'TIGER', 'TIGHT', 'TIRED', 'TITLE', 'TODAY', 'TOKEN', 'TOPIC',
  'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TOXIC', 'TRACE', 'TRACK', 'TRADE', 'TRAIL', 'TRAIN',
  'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH',
  'TWICE', 'UNCLE', 'UNDER', 'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE',
  'USUAL', 'VALID', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VIVID', 'VOCAL', 'VOICE',
  'WAGON', 'WASTE', 'WATCH', 'WATER', 'WHALE', 'WHEAT', 'WHEEL', 'WHERE', 'WHICH', 'WHILE',
  'WHITE', 'WHOLE', 'WHOSE', 'WIDTH', 'WOMAN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH',
  'WOULD', 'WOUND', 'WRITE', 'WRONG', 'WROTE', 'YIELD', 'YOUNG', 'YOUTH',
]

export const EN_EXTRA: string[] = [
  'ABIDE', 'ABYSS', 'ACORN', 'ADORE', 'AGILE', 'AISLE', 'ALGAE', 'ALLEY', 'ALOUD', 'AMBER',
  'AMPLE', 'ANGST', 'AORTA', 'APRON', 'AREAS', 'ARMOR', 'ATLAS', 'ATTIC', 'AVAIL', 'AXIOM',
  'BACON', 'BADLY', 'BAGEL', 'BALMY', 'BANJO', 'BARGE', 'BARON', 'BASIL', 'BATON', 'BEARD',
  'BEAST', 'BEGUN', 'BELLY', 'BIBLE', 'BINGO', 'BISON', 'BLAZE', 'BLEAK', 'BLISS', 'BLUNT',
  'BLUSH', 'BORNE', 'BOUGH', 'BRASS', 'BRAWL', 'BREED', 'BRIBE', 'BRINE', 'BROIL', 'BROOK',
  'BROOM', 'BROTH', 'BRUTE', 'BUDGE', 'BUGGY', 'BULKY', 'BULLY', 'BURLY', 'BUSHY', 'BUILT',
  'BURNT', 'CANOE', 'CADET', 'CAMEL', 'CANAL', 'CAROL', 'CEDAR', 'CELLO', 'CHANT', 'CHAOS',
  'CHIME', 'CHOIR', 'CHORD', 'CHORE', 'CHUCK', 'CHUNK', 'CIDER', 'CIGAR', 'CLAMP', 'CLASH',
  'CLASP', 'CLING', 'CLOAK', 'CLOWN', 'CLUMP', 'COBRA', 'COCOA', 'COMMA', 'CONCH', 'COVET',
  'CRAMP', 'CRANK', 'CREST', 'CROOK', 'CRUMB', 'CRUST', 'CUBIC', 'CUMIN', 'CURLY', 'CURRY',
  'DAISY', 'DECAY', 'DECOY', 'DELTA', 'DENIM', 'DENSE', 'DEPOT', 'DITCH', 'DIVER', 'DODGE',
  'DOING', 'DRAPE', 'DREAD', 'DROWN', 'DRUNK', 'DUSTY', 'DUVET', 'DWARF', 'DWELL', 'EATEN',
  'EMBER', 'EPOCH', 'ERASE', 'ERUPT', 'ETHIC', 'EXERT', 'EXILE', 'FAINT', 'FAIRY', 'FEMUR',
  'FETCH', 'FIERY', 'FINCH', 'FJORD', 'FLICK', 'FLING', 'FLINT', 'FLOWN', 'FLUSH', 'FOGGY',
  'FRAIL', 'FRIED', 'FUNGI', 'GECKO', 'GENIE', 'GENRE', 'GLARE', 'GLAZE', 'GLEAM', 'GLIDE',
  'GLOOM', 'GLOSS', 'GNOME', 'GOOSE', 'GORGE', 'GRASP', 'GRAVY', 'GRAZE', 'GREED', 'GRIME',
  'GRIND', 'GROAN', 'GROOM', 'GROWL', 'GRUNT', 'GUAVA', 'GUSTO', 'HABIT', 'HANDY', 'HARDY',
  'HARSH', 'HASTE', 'HATCH', 'HAUNT', 'HAVEN', 'HAZEL', 'HEARD', 'HEDGE', 'HEFTY', 'HERON',
  'HINGE', 'HIPPO', 'HOARD', 'HOIST', 'HOLLY', 'HOUND', 'HOVER', 'HUMID', 'HUSKY', 'HYENA',
  'ICING', 'IDIOM', 'IGLOO', 'INGOT', 'IRONY', 'ITCHY', 'JEWEL', 'JOLLY', 'JUMBO', 'KARMA',
  'KIOSK', 'KITTY', 'KNACK', 'KNEEL', 'LAPEL', 'LARVA', 'LATCH', 'LATTE', 'LEAFY', 'LEVER',
  'LILAC', 'LLAMA', 'LODGE', 'LOFTY', 'LOTUS', 'LOUSY', 'LUNAR', 'LYRIC', 'MADAM', 'MANGO',
  'MANOR', 'MARSH', 'MELON', 'MERRY', 'MIMIC', 'MISTY', 'MOCHA', 'MOIST', 'MOOSE', 'MOSSY',
  'MOTEL', 'MOTIF', 'MOUND', 'MUDDY', 'MURAL', 'MUSTY', 'NANNY', 'NASAL', 'NICHE', 'NIECE',
  'NINJA', 'NOTCH', 'NUDGE', 'NYLON', 'OASIS', 'OMEGA', 'OTTER', 'PANDA', 'PASTE', 'PATIO',
  'PECAN', 'PEDAL', 'PESTO', 'PETAL', 'PIVOT', 'PIXEL', 'PLAID', 'PLANK', 'PLUSH', 'POUCH',
  'PRANK', 'PRAWN', 'PRISM', 'PROBE', 'PRUNE', 'PUPPY', 'QUACK', 'QUAIL', 'QUAKE', 'QUEST',
  'RAINY', 'RAVEN', 'RADAR', 'RELIC', 'RETRO', 'RHYME', 'RINSE', 'RISEN', 'ROCKY', 'RODEO',
  'ROTOR', 'ROUGE', 'RUSTY', 'RIFLE', 'SALTY', 'SANDY', 'SATIN', 'SCARF', 'SCENT', 'SCOOP',
  'SCRUB', 'SCUBA', 'SEDAN', 'SEPIA', 'SERUM', 'SHADY', 'SHAFT', 'SHAKY', 'SHARK', 'SHAME',
  'SHAVE', 'SHINY', 'SHRUB', 'SIREN', 'SKATE', 'SKUNK', 'SNAIL', 'SNEAK', 'SNIFF', 'SNOWY',
  'SOGGY', 'SWAMP', 'SWEAR', 'SWEAT', 'SWIRL', 'TANGO', 'THORN', 'THUMB', 'TIARA', 'TULIP',
  'VAGUE', 'VEGAN', 'VAULT', 'VIOLA', 'VISTA', 'WALTZ', 'WHISK', 'WITCH', 'YACHT', 'ZEBRA',
  'AIMED', 'BAKED', 'BASED', 'CARED', 'CARVE', 'CEASE', 'CITED', 'CRAVE', 'CURED', 'DARED',
  'DRAWN', 'EXCEL', 'FILED', 'FINED', 'FIRED', 'FIXED', 'FLOWS', 'GLUED', 'GROWN', 'HANDS',
  'HIRED', 'HITCH', 'HOMES', 'HOPED', 'HURTS', 'IDEAS', 'JOINS', 'JOKED', 'JUMPS', 'KEEPS',
  'KICKS', 'KNOTS', 'LABOR', 'LACES', 'LADLE', 'LAPSE', 'LEADS', 'LEAKS', 'LENDS', 'LIMBS',
  'LIONS', 'LISTS', 'LOADS', 'LOANS', 'LOCKS', 'LOOKS', 'LOVED', 'LOVES', 'LUNGS', 'MAKES',
  'MARKS', 'MASKS', 'MEALS', 'MEATS', 'MEETS', 'MENUS', 'MILES', 'MINER', 'MINDS', 'MINTS',
  'MODEM', 'MOLDS', 'MOODS', 'MOONS', 'MOVES', 'NAILS', 'NAMED', 'NEEDS', 'NESTS', 'NOTES',
  'NOUNS', 'OBEYS', 'OILED', 'OLDER', 'OPENS', 'PAIRS', 'PARKS', 'PARTS', 'PATHS', 'PEAKS',
  'PEARS', 'PERCH', 'PICKS', 'PILES', 'PLANS', 'PLAYS', 'PLUGS', 'POLES', 'POOLS', 'PORTS',
  'POSTS', 'PRAYS', 'RACED', 'RACES', 'RAILS', 'RATED', 'RATES', 'READS', 'REEDS', 'RENTS',
  'RIDES', 'ROLES', 'ROLLS', 'ROOFS', 'ROOMS', 'ROOTS', 'ROPES', 'RULES', 'SAINT', 'SALES',
  'SANDS', 'SAVED', 'SEALS', 'SEATS', 'SEEDS', 'SHIPS', 'SHOES', 'SHOOK', 'SHOPS', 'SHOWS',
  'SIDES', 'SIGNS', 'SITES', 'SKINS', 'SKIPS', 'SLOTS', 'SPELL', 'SPICY', 'SPOTS', 'STAIR',
  'STAMP', 'STEAL', 'STEEP', 'STEPS', 'STOVE', 'SUITS', 'SURGE', 'SWEEP', 'SWIMS', 'TAKES',
  'TALES', 'TALKS', 'TAPES', 'TASKS', 'TAXES', 'TEAMS', 'TEARS', 'TELLS', 'TERMS', 'THIEF',
  'TIDES', 'TIMER', 'TOAST', 'TONES', 'TORCH', 'TRAIT', 'TRAPS', 'TRAYS', 'TREES', 'TRIED',
  'TRIES', 'TUBES', 'TUNES', 'TURNS', 'TWIST', 'VALVE', 'VAPOR', 'VIGOR', 'VILLA', 'VOTES',
  'WAGES', 'WEEDS', 'WEEKS', 'WINDS', 'WIRES', 'WISER', 'WOODS', 'WORDS', 'WORKS', 'WOVEN',
  'ZONES', 'COOKS', 'HEATS', 'MAIDS', 'MOANS',
]

/* ================= Normalisation & outils ================= */

/** Diacritiques → lettres de base (é→e, è→e, à→a, ç→c…), en majuscules. */
export function normalizeWord(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
}

/** Jours écoulés entre le 2025-01-01 et une clé de date locale YYYY-MM-DD. */
export function daysSinceEpoch(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map((v) => Number.parseInt(v, 10))
  if (!y || !m || !d) return 0
  const t = Date.UTC(y, m - 1, d)
  const base = Date.UTC(2025, 0, 1)
  return Math.max(0, Math.floor((t - base) / 86400000))
}

/** Numéro du puzzle (1 = 2025-01-01). */
export function puzzleNumber(dateKey: string): number {
  return daysSinceEpoch(dateKey) + 1
}

/** Liste des réponses pour une langue. */
export function answersFor(lang: 'fr' | 'en'): string[] {
  return lang === 'fr' ? FR_ANSWERS : EN_ANSWERS
}

/** Mot du jour pour une langue et une date (déterministe). */
export function wordForDate(lang: 'fr' | 'en', dateKey: string): string {
  const list = answersFor(lang)
  return list[daysSinceEpoch(dateKey) % list.length]
}

/** Dictionnaire complet (réponses + extras) normalisé, pour valider les tentatives. */
export function buildDictionary(lang: 'fr' | 'en'): Set<string> {
  const set = new Set<string>()
  for (const w of answersFor(lang)) set.add(w)
  for (const w of lang === 'fr' ? FR_EXTRA : EN_EXTRA) set.add(w)
  return set
}

/** Évaluation deux phases (gère les lettres en double comme le vrai Wordle). */
export function evaluateGuess(
  guess: string,
  answer: string,
): Array<'correct' | 'present' | 'absent'> {
  const res: Array<'correct' | 'present' | 'absent'> = ['absent', 'absent', 'absent', 'absent', 'absent']
  const counts: Record<string, number> = {}
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      res[i] = 'correct'
    } else {
      counts[answer[i]] = (counts[answer[i]] ?? 0) + 1
    }
  }
  for (let i = 0; i < 5; i++) {
    if (res[i] === 'correct') continue
    const c = guess[i]
    if ((counts[c] ?? 0) > 0) {
      res[i] = 'present'
      counts[c]--
    }
  }
  return res
}
