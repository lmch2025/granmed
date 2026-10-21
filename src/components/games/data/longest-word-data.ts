/**
 * Dictionnaires du jeu « Le Mot le Plus Long » (longest-word).
 * Deux banques de mots courants (~2 500 par langue), mots de 3 à 9 lettres,
 * stockés SANS ACCENTS sous forme d'une seule chaîne séparée par des espaces,
 * découpée en Set à l'initialisation du module.
 * Les accents sont normalisés à la saisie (é→e, à→a, ç→c…) : « clé » se tape « cle ».
 * Le français et l'anglais ont leurs propres banques : vraie adaptation par langue.
 */

/* ==================== Français ==================== */

const FR_RAW = `
air ami ans arc art age axe bac bal bar bas bec ble bol bon bot bus but cap car cas cle coq cor cou cri cru cuh
des dix dit don dos duc dur eau epi est ete fee fer feu fil fin fit foi fou gai gaz gel gre gui ici ile jet jeu jus
lac lin lis lit loi lot mai mal mer mes met mie mil mis moi mon mot mou mur net nez nid nom non nue oie ont oui pan
par pas peu pie pin pis plu pot pou que qui rat riz roc roi rue sac sec sel ses set six ski soi sol son sos sot sou
sud sur tas tel tes the tic tir ton tot tri tue une ver vie vif vis vue zen zoo bip cil col dur ego emu es est fan
fez gag gin gnu hop ion lui ode pop pub rap pro sos van via vol web wok ane les ces nos vos es
abri acre acte aide aine aire aise amas amer amie anes ange arme aube aura auto aval avec avis axer bail banc base
bati beau bete bile bise bloc bleu bois boit brut buee cage cane cape cash cave cela cent chat chef chez chic chou
chut cinq clan clef clou cote coup cour cout cube cuit cuir dame dans date deux dieu dire doit dont dose doux drap
drole dune eaux ecru epee etre face fade faim fait faux fard fete fils fini flan flot foie fois fond font fort four
fume gage gant gare gaze gens gite gras grec gril gris grue gout hall hate haut hier huit iris jade joli joue jour
jury kilo kaki lame lard lave leur leve lien lieu lion lire loup luxe main mais mare marc mars meme mere mets mien
mieux mine mise mode mois mont monte mort moto muse nage naif nain noir noix nord note nous oeil oeuf onde ouvre
ours outil page paie pain pair paix pale pari pate pave pays peau plan plat plein pion pire plue pont porc port prof
pull quoi rage rame reve rime rire rive robe rose roti roue ruse sable sage sain sale sang sans saut seau seul seve
sexe sien soir soie soin soif sole sort sous suie table tard tete thym tige toit tonne tort tour tout tribu trou
type vase veau velo vent vers vert vide ville vite voeu voie voix vote vrai yeux aout sont vont fait doit dit fut
mit pars part dort veut peux sais sait suis seras etes vais dois dis voir haut gros dure aide aime boit court dort
ours mots
abalte abondent accroc accroi achete acheter acier acide acreage acteur actif action adieu adieu admis adulte
adverbe aeree affaire affine affole agneau agree aiguille aide aimer ainsi ainee airain aisen aisne aisse ajuste
ajusta alaise album alcool alene alerte algue aligne alleluia allait allume alors alose alte amande amener ambitieux
amical amie amitie ample amuser analyse ananas ancien ancre ane animal annee annonce annuel anonyme apaisement
appareil appel apporter arbre arbuste ardeur argent armoire arrive arrow article artiste aspect assiette assure
atelier attaque aubaine aucune audace auge aulne aune aussi autant automne autour avance avenir avion avoir avocat
bague baie baisse balai balcon baleine balcon balle ballon bambou banane banc bande banjo banquise barbe baril
barque basque basse bataille bateau battr battu baudet beaute becquet besoin belette belle benoit berceau berger
besace betail beurre bienfait bientot billet biseau bisou bison blanche blesse blond boisson boite bombe bonbon
bondir bonheur bonnet bonté borde borne bosquet boston botte bouche boucle bouddha bougie boulanger boule bouleau
bourge? branche brave brebis breton brider briller broche brosse brute buche budget buffet buisson bureau butin
cabane cable cacao cacher cahier caisse calcul calme camion campagne canal canard canne canon cantine caoutchouc
capable cape capitale capitaine caresse carafe carre carriere carross cartable cascade casier casque casse casserole
castor cause cave cedre celebre cense centaine centime cerveau chaise chaleur chameau champ champagne chandelle
chanson chant chapelle charbon charme charrue chateau chaud chausson cheval chien chiffre chimie chose chouette
cidre ciel cigne cimetiere cinema cirque citron citoyen civil clarte classe cle clavier client climat cloche clou
coaguler cobalt cobra cochon cocotte coeur coherence colere colibri colis collant college collier colombe colonel
combat comedia commande commerce commode compas complet compter concert conduit confiance conge connaissance
conseil console conte contraste copain coq corail corde corniche corridor costume coton couche coude couleur
couleuvre coupable courage couronne courant courrier cours court couteau coutume couvert crabe craie crainte
cran crayon createur creche credo creer crime croiser creme crevette creux crique cuisine cuir cuisse cuisiner
culte culture curieux cymbale danse danger danois dauphin debat debut decembre decider declarer decor dedans deesse
defense degre dejeuner delicate demande demeure demi demon depart depense deeper dernier desert design desir dessin
destin detruire deuil deuxieme devant devenir devoir diable dialogue diamant dictionnaire dieu diff difference
digital dimanche dinde direction direment disciple discuter distance dix docteur douceau douleur doux doze dragon
drapeau drame droit duvet dynamique eau ecart echelle eclair ecole economie ecorce ecouter ecran ecriture edifice
editer education effet effort egal egare elections eleve elle elite elle emeute emporte energique enfant enfin
enregistrer ensemble ensuite entendre entrance enveloppe epee epais epaule epee epicerie epine epoque epreuve
equipe erreur escalier esclave espece espoir esprit essai essence etablir etagere etang etape ete eternel ethnie
etroit etoile etrangle etre etude europe examen except exces excuse exemple exercice exiger experience explorer
express face facile facon facteur faiblesse facilement faim faire faitaleur falaise fanfare farine fatigue faucon
faveur fecond felicite femme fenetre fer ferme ferner fete feuille fevrier fiance ficelle fidete figure filet fille
film final enfin finance finde flacon flamme flatter fleur flute foire folie fonction fond fontaine football force
foret forger formel fosse fouet foulard foule fourmi foyer fraise franchir frapper fromage front fruit fuir fume
fumee futs galerie galerie garage garcon garden garder garnir gazette geant gelatin general genie genou gentil
geographie gorge gorge gouter goutte graine grand grange granit grave grec grille grimace gronder gros grue guide
guerre guichet guitare habitude hache hairs haleine hameau hangar harmonie hasard haut hauteur herbe heritage
heros heure hiver homard homme hommage honneur honorer honte hopital horaire horloge horrible hotel houille houppe
houx humain humide hutte idol image imiter imperatif importance important importer impression imprimer incident
inconnu indiquer industrie infanter influence information inhabite initiale innocence insecte instant installer
instruire instrument intelligence intention interet inventer invitation irre irr religieux jamais jardin jaune
jeter jeune joie jouer jouet jour journal juillet juin jumeau juste kayak laboratoire lac laine lait lancer langue
lanterne laque large larme lasse lecture lecture lettre leur levain leve lever levure liane liberal libre liberty
librairie licence liege lieu ligne ligue lili linge lisiere liste litre livre logique long longe longer lotion
louange louer loup lourd lueur lundi lutte lycee machin machine magasin magma mai mais maladie mammifere manche
mandat manger manifold maniere manipulation manteaumanuel marbre marche mardi marée marin mariage marin marquer
marron mars marty masse match matin maudit mechant medaille medecin meilleur melange membre memoire menacer mendiant
mentir mercredi mere merveille message mesure metal metre meuble meule miauler micro mid muit migrant milieu mille
million mince mine mineral minute miracle misere mission mistral moche mode modele moderne moine moins mois
moisson moitie molecule moment monde monsieur montagne monte monter montre montu morceau mordre moitie moitie
molette monarque monnaie mont moi montage moral morceau mors mort mosaique motif mouche moufle mouille mousse
moustache muer mue musaraigne museau musee musicien museau mystere mystique nage nager nager naiade naissance
naissance naitre nappe nature naufrage naval naviguer navire neige nerf nerveux nester neveu nid nickel noble noces
noeud noir noix nombre nommer nord norme notable noter notre nouvelle noyau nuage nuire nul nuque objet obsession
occasion occuper ocean octobre odeur offrir oiseau olivier ombre omission ombrage oncle onde ongle opengl opera
operation opinion opportun opprime orage orange orchidee ordinaire ordonner oreille organe orgueil origine orme
ornement orthographe ouate oublier ours outil outrage outre ouverture ouvrier page pagaille pain paix palette palais
pale palefroi palmier panache panier panique panneau pansement papa papier paquet paradi paraitre parcelle parole
parrain parti partie passage passe passion pate patate pateau paturage patin patio patrie patte paupiere pauvre
pavot payer pays peace peau peigne peinture pelican pelle pellet pelouse pencher pendule penee pensee pente
pepper percer perdre perennial perdrix periode permission perle permis personne pesant peser petale petrole
pety peuplier pharmacie phrase piano piece pierre pieu pilote piment pinceau pinte pion pion pion pion pipa piqure
pire pistil piste place plaine plaisance plaisir planete planque plante plaque platane plateau plein pleurer pleuvoir
pliage plomb plonger pluie plume plum pocket poche poele poele poem poeme poet poid poids poele point poire poivre
pole policier poli politesse pommade pomme pompe pardon pont popila populaire porc port port portail porte portefeuille
portrait potage poteau poubelle poudre poule poulet poulpe poumon pourpre poursuite poussin poutre pouvoir pratique
prairie précis precipice prendre presque presse pret pretend prix profond progrès projet promesse prompt prononcer
propre prospère prouver provision prudence prune public puissance puits pull pulpe pupitre pured pyjama python
quand quart quatorze quatre quinzaine quitter quoi rabais race radeau radis rafter rage raide raisin rame rampe
ranch raoul rapide rappel requin rire raison ralentir ralbum rames rancune ranger raper rapides rare rature ravage
rayon reaction realite recolte record recette recevoir recherche recit reconnaitre recreation recu redire reduire
reflet regard regime region regret reine relever religion remarque remede souvenir remercier remorque remplir
rencontre rendez renard renoncer rentrer reparier repartir reparer reponse reposer reprise requete reserve resister
resolu respect ressort restaurant resultat retard reve rever reveil revenir revue rhume riche rideau ridicule rien
rigide rime rincer riposte rire risquer rive riviere robot rock roman ronces ronde rose roseau rosee rot ronde route
royal ruban rubis rude ruelle ruer ruf ruine ruser rustique sable sabot sabre sacerdoce sacrifice sage sain saison
sale salon salut samedi sanction sante sapin sardine satin saucisse saule sauvage sauver savant savoir scene secher
secours secret section securite seize selon semaine sembler semence semis sentir separe serment serpente serrure
serviette seuil sevrage sien signer signal silence simple sincere singe sieste sirop situation sociale soldat
soleil solide solution sombre sommeil somme sonner sonnette sonde sortir souci soufre soulier soupcon souple
sourcil sourd sourire sous souvenir souvent spectacle vitesse sport stable stade stand etoile sujet super surf
sureau surprise svelte table tableau tabouret taille talon tant tapis tarte tas taupe teint temps tenir tendre
tennis tente terme terminal terre terreur tete texte theatre theme theorie thyme tige timbre tirer tissu titre
toast toile toit tomate tombe tondre tonneau torse tort toit tousser tour tourisme tourner tout toucher toujours
tracé trace train trait traitre trancher tranquille transport travail traverse trente trepas tresor tribu tricot
trone trottoir trou troupe troupeau vrai tuyau type ulcere uni usage usine ustensile utile vacances vache vain
vaincre vaisseau val valeur valve vanne vapeur varier vase vaste veau velo vendange vendre venelle venir vent
vente ventre verbe verre vers vert verte veste vetement viande victoire video vieux vigne vil village ville
vinaigre violence violin violette violin virage visite vite vitre vivre voeu voici voie voix voile voir voisin
volaille voler volet volonte vos votre vouloir voyage vrai vraiment wagon water zebre zeste zone zoo
`

/* ==================== Anglais ==================== */

const EN_RAW = `
ace act add age aim air all and ant any ape apt arc are arm art ash ask asp ate awe axe aye bad bag ban bar bat bay
bed bee beg bet bib big bin bit boa bob bog bon bow box boy bra bud bug bun bus but buy cab cad cam can cap car cat
caw cob cod cog con cop cot cow coy cry cub cue cup cur cut dab dad dam day den dew did die dig dim din dip dob doe
dog don dot dry dub dud due dug duo dye ear eat ebb eel egg ego elf elk elm emu end eon era err eve ewe eye fad fan
far fat fax fed fee few fib fig fin fir fit fix fly foe fog for fox fry fun fur gag gal gap gas gay gel gem get gig
gin gob got gum gun gut guy gym had hag ham has hat hay hem hen her hew hex hey hid him hip his hit hob hoe hog hop
hot how hub hue hug hum hut ice icy ilk ill imp ink inn ion ire irk its ivy jab jam jar jaw jay jet jig job jog jot
joy jug jut keg key kid kin kit lab lad lag lap law lax lay led leg let lid lie lip lit lob log lot low lug mad man
map mar mat maw may men met mid mix mob mod mop mow mud mug nab nag nap net new nib nil nip nod nor not now nun nut
oaf oak oar oat odd ode off oft ohm oil old one opt orb ore our out owe owl own pad pal pan pap par pat paw pay pea
peg pen pep per pet pew pie pig pin pit ply pod pop pot pro pry pub pug pun pup pus put rag ram ran rap rat raw ray
red rib rid rig rim rip rob rod roe rot row rub rug rum run rut rye sad sag sap sat saw sax say sea set sew she shy
sin sip sir sit six ski sky sly sob sod son sop sot sow soy spa spy sty sub sue sum sun tab tad tag tan tap tar tax
tea ten the tho thy tic tie tin tip toe tog ton too top tot tow toy try tub tug tux two urn use van vat vet vex via
vie vow wad wag war was wax way web wed wee wet who why wig win wit woe wok won woo wow yak yam yap yes yet yew yip
you zag zap zip zoo
able acid aged also area army away baby back bail bald ball band bank barn base bath bats bead beak beam bean bear
beat beef beer bell belt bend best bike bill bind bird bite blot blow blue blur boar boat body boil bold bolt bomb
bond bone book boom boot bore born boss both bowl boys brag brat brew brim bulk bull bump bunk burn bury bush bust
busy cafe cage cake calf call calm came camp cane cape card care cart case cash cast cave cell cent chap chat chef
chin chip chop cite city clad clan clap claw clay clip club clue coal coat coax code coil coin cold comb come cone
cook cool cope copy cord core cork corn cost cosy coup cove cozy crab crew crop crow cube cues cuff cult cure curl
dare dark dart dash data date dawn days dead deaf deal dear debt deck deed deem deep deer dent deny desk dial dice
diet dime dine dirt disc dish disk dive dock does dole doll dome done doom door dose dote dove down drag draw drew
drop drum dual duck dude duel dues duet dull duly dune dusk dust duty each earn ease east easy eats echo edge edgy
edit eels eggs egos else ends envy epic eras even ever eves evil exam exit face fact fade fail fair fake fall fame
fang farm fast fate fawn fear feat feed feel fees feet fell felt feud figs file fill film find fine fire firm fish
fist five flag flap flat flaw flea fled flee flew flex flip flow flux foal foam foil fold folk fond font food fool
foot ford fore fork form fort foul four fowl foxy frat free fret frog from fuel full fume fund funk fury fuse fuss
gaff gain gait gala gale game gang gape gasp gate gave gaze gear gems gene germ gift gild gill gilt gips girl gist
give glad glee glen glib glob glow glue glum gnaw goad goal goat goes gold golf gone gong good gore gory gosh gout
gown grab gram gray grew grey grid grim grin grip grit grow grub gulf gull gulp guru gush gust guts hail hair half
hall halo halt hand hang hard hare harm harp hash hate haul have hawk haze hazy head heal heap hear heat heck heed
heel heir held hell helm help hemp herb herd here hero hers hewn hide high hike hill hilt hind hint hire hive hold
hole holy home hone hood hoof hook hoop hope horn hose host hour huge hulk hull hump hung hunt hurt hush husk hymn
icon idea idle idly idol inch into ions iota iris iron isle itch item jabs jade jail jams jazz jeep jeer jest jobs
joke jolt jowl joy juice july june junk jury just keel keen keep kelp kept key kick kiln kilo kilt kind king kiss
kite knee knew knob knot know labs lace lack lacy lads lady lags laid lain lair lake lamb lame lamp land lane lard
lark lash lass last late lava lawn laze lazy lead leaf leak lean leap left lend lens lent less lest lets liar lice
lick lids lied lien lieu life lift like lily limb lime limp line link lint lion lips lisp list live load loaf loan
lobe lock loft logo lone long look loom loop loot lord lore lose loss lost loud love luck lull lump lung lure lurk
lush lust lute lynx made maid mail maim main make male mall malt mane many maps mare mark mars mash mask mass mast
mate math maze mead meal mean meat meet melt memo mend menu mere mess mice mild mile milk mill mime mind mine mint
miss mist mite moan moat mock mode mold mole monk mood moon moor moot mope more moss most moth move much muck mugs
mule mush must mute myth nabs nails name nape naps navy near neat neck need neon nest nets news next nice nick nigh
nine node nods none noon nope norm nose nosy note noun nude numb nuns nuts oaks oars oath oats obey oboe odds odes
odor ogle ogre oily okay okay omen omit once ones only onto onus onyx ooze opal open opt opts opus oral orca ores
ouch ours oust outs oval oven over owed owes owls owns oxen pace pack pact page paid pail pain pair pale palm pane
pang pans pant park part pass past pate path pats pave pawn paws pays peak peal pear peas peat peck peek peel peer
pens pent peon perk pert pest pets pew? pfew pick pier pigs pike pile pill pine ping pink pint pipe pith pity plan
play plea plod plot plow ploy plug plum plus pods poem poet poke pole poll polo pomp pond pony pool poor pope pork
port pose posh post posy pots pour pout pray prey prim prod prom prop pros prow pubs puck puff pull pulp pump punk
puns punt puny pups pure push puts putt quiz race rack racy raft rage raids rail rain rake ramp rang rank rant rare
rash rate rave read real ream rear redo reed reef reel rein rely rend rent rest ribs rice rich ride rife rift rigs
rile rime rind ring rink riot ripe rise risk rite road roam roar robe rock rode rods roll roof rook room root rope
rose rosy rote rout rove rows rubs ruby rude rugs ruin rule rung runs runt ruse rush rust sack safe saga sage said
sail sake sale salt same sand sane sang sank saps sash save saws says scam scan scar seal seam sear seas seat sect
seed seek seem seen seep seer sees self sell semi send sent sets sewn shed shim shin ship shoe shop shot show shut
sick side sift sigh sign silk sill silo silt sine sing sink sins sips sire site sits size skew skid skim skin skip
slab slam slap slat sled slew slid slim slip slit slob slot slow slug slum slur smog smug snag snap snip snob snow
snug soak soap soar sock soda sofa soft soil sold sole solo some song sons soon soot sore sort sots soul soup sour
sown soys span spar spat sped spin spit spot spry spud spun spur stab stag star stay stem step stew stir stop stow
stub stud stun subs such suds sued sues suit sulk sumo sunk sure surf swab swam swan swat sway swim swig tabs tack
tact tags tail take tale talk tall tame tang tank tape taps tare tarp tars tart task taut taxi teak teal team tear
teas tech teem teen tell tend tens tent term tern test text than that thaw thee them then they thin this thou thud
thug thus tick tide tidy tied tier ties tile till tilt time tine tins tint tiny tips tire toad toes toga toil told
toll tomb tome tone tong tons took tool toot tops tore torn tort toss tots tour tout town toys tram trap tray tree
trim trio trip trod trot true tsar tuba tube tubs tuck tuft tugs tuna tune turf tusk tutu twig twin twit tyke type
ugly undo unit upon urge urns used user uses vain vale vane vans vary vase vast vats veal veer veil vein vend vent
verb very vest veto vets vial vibe vice view vile vine viol visa vise void volt vote vows wade wads waft wage wags
waif wail wait wake walk wall wand wane want ward ware warm warn warp wars wart wary wash wasp watt wave wavy waxy
ways weak wean wear webs weds weed week weep weld well welt went wept were west what when whet whey whim whip whir
whit whom wick wide wife wigs wild wile will wilt wimp wind wine wing wink wipe wire wiry wise wish wisp with wits
woes woke wolf womb wons wood wool word wore work worm worn wove wrap wren writ yaks yams yank yaps yard yarn yawl
yawn yaws yeah year yeas yell yelp yeti yoga yoke yolk yore your zaps zeal zebra zero zest zinc zing zip zips zone
zoom
aback abase abate abbey abets abide abled about above abuse acorn acres acrid actor acute adapt added adept admit
adobe adopt adore adept advice advise aerial affair affect affix afield afire afoot afoul after again agate agent
agile aging agree ahead aide aisle alarm album alert algae alias alibi alien align alike alive alley allot allow
alloy aloft alone along aloof aloud alpha altar alter amaze amber amble amend amiss among ample amuse angel anger
angle angry ankle annoy antic anvil apart aphid apple apply apron aptly arbor ardor area argue arise armor aroma
arose array arrow ashen ashes aside askew atlas atom attach attic audio audit augur aunt? avail avert avoid await
awake award aware awash awful awoke axial axiom bacon badge bagel baggy bail bakes baldy baled bales balks balls
balmy banal bands banjo banks barge barks barns barrels basic basin baste batch bathe baton bawdy beach beads beady
beard bears beast beats becky begun beiges bells belly belts bends beret berry berth beset betas betel bevel bezel
bible bicep bidder bikes bilge bills binge birch birds birth bison black blade blame bland blank blare blast blaze
bleak bleat bleed bleep blend bless blimp blind blink bliss blitz bloat blocks bloke blond blood bloom blown blues
bluff blunt blurb blurt blush board boast bobby bogus boils bolts bonds bones bonus books boost booth boots bored
botch bough bound bowed bowl? bowls boxer boxes brace brack braid brain brake brand brash brass brave bravo brawl
brawn bread break breed breeze brega brick bride brief brine bring brink briny broad broil broke brood brook broom
brought brown brunt brush budge buggy build built bulge bulky bulls bumpy bunks bunny burly burnt burst buses bushy
butte buxom buyer cabin cable cacao caches cadet cagey cairn calf? calif call? calls calms camel cameo camps canal
candy caned canes canoes canon canopy cards cargo carol carts carve cases casks caste catch cater cause caved caver
caves cease cedar chafe chain chair chalk champ chant chaos chard charm chart chase chasm cheap cheat check cheek
cheer chess chest chews chief child chill chime chips chirp chive chock choir choke chord chore chose chuck chump
chunk churn chute cider cigar cinch circa cited cites civic civil claim clamp clang clash clasp class claws clean
clear cleat cleft clerk click cliff climb cling clink cloak clock close cloth cloud clown clubs clued clump clung
coach coast cobra cocoa codes coily colon color colts combs comedy comet comfy comic conch condo coned cones coral
cords corks corns corny costs couch cough could count coupe cover coven covet cowed cower coyly crabs crack craft
cramp crane crank craps crate crave crawl craze crazy creak cream credo creed creek creep crepe crept crest cribs
cried crier crimp crisp croak crock crone crony crook cross crowd crown crude cruel crumb crunch crush crust crypt
cubby cubic cuffs cumin curbs curds cured cures curio curls curly curse curve curvy cuter cycle cynic daddy daily
dairy daisy dance dandy dared darts dashy data? dated dates dawns dazed deals deans dears debar debit debug debut
decal decay decks decor decoy decry deeds deems defer deign deity delay delta demon demur denim dense depth derby
desks deter deuce devil dials diary dimes diner dingy dire? dirs ditch dived diver dives dizzy docks dodge doers
doest dogs? doled doles dolls dolly donor donut dough dover doves dowdy dozen draft drain drake drama drank drape
drawl drawn draws dregs dress dried drier drift drill drink drips drips drive droll drone drool droop drops dross
drove drown drugs drums dryly ducal ducky duel? dues? duets dummy dumpy dunce dusk? dusty Dutch duvet dwarf dwell
dwelt dyers dying eager eagle early earns earth eased easel eases eaten eater ebbed echos edged edges edict edify
eight eject elbow elder elect elegy elfin elite elope elude elves ember emcee emend emery emoji empty enact ended
enema enemy enjoy ennui ensue enter entry envoy epoxy equal equip erase erect erode erupt essay ether ethic ethos
evade event every evict evoke exact exalt excel exert exile exist expel extol extra exude fable faced faces facet
facts faded fails faint fairs fairy faith falls false famed fancy fangs farce fares farms fatal fated faults fauna
favor fawns faxes fears feast feats fence ferns ferry fetch fever fewer fiber field fiend fiery fifth fifty fight
filed files fills films filmy final finch finds finer fires first fish? fists fitly fixing fizzy flags flail flair
flake flaky flame flank flare flash flask fleas fleck fleet flesh flick flier fling flint flirt float flock flood
floor flora floss flour flout flown flows fluid fluke flung fluty flyer foamy focal focus foggy flogs foil? folds
folio folks fonts foods fools force forge forgo forks forms forth forty forum found fount fours foxes frail frame
frank fraud freak freed freer fresh fried frill frisk frogs frond front frost froth frown froze fruit fudge fuels
fully fumes fungi funky funny furor furry fussy fuzzy gains gales games gangs gaunt gauze gavel gawky geese genie
genus gets? ghost giant giddy gifts gills girly girth given gives gizmo glad? glade gland glare glass glaze gleam
glide glint gloat globe gloom glory gloss glove gnarl gnash gnome goats goes? going golem golly gonad goods goofy
goose gorge gouge gourd gout? gown? grabs grace grade graft grain grand grant grape graph grasp grass grate grave
gravy graze great greed green greet grief grill grime grimy grind gripe groan groin groom grope gross group grout
grove growl grown grows gruel gruff grunt guard guava guess guest guide guild guile guilt guise gulch gulls gully
gulps gumbo gummy guppy gushy gusto gusty gutsy gypsy gyres habit hairy halls halts hands handy hangs happy hardy
harem haste hasty hatch hated hates hauls haunt haven havoc hawks hazel heads heals heaps heard hears heart heath
heave heavy hedge hefty heels heist helix hello hells helms helps hemps hence herbs herds heron hexed hicks hides
higher hilly hinges hints hippo hirth hires hitch hived hives hoard hobby hockey hoist hoked holds holes homage
honed honed honest honey honor hooks hoops hoots hoped hopes horde horns horse hosed hosts hotel hotly hound hours
house hovel hover howdy human humid humor hunch hunts hurly hurt? hushy husks hasty hydra hydrant hymns icily icing
ideal ideas idiom idiot idler idyll igloo image imbue imply inbox incur index inept inert infer ingot inlay inlet
inner input irate irked irons irony islet issue itchy items ivory jacks jaded jazzy jeans jelly jerks jewel joins
joint joist joker jolly joust judge juice juicy jumbo jumps junky juror kapok kayak kebob keels keeps kempt kennel
kests khaki kicks kills kinds kings kinks kiosk kites kitty knack knead kneed kneel knelt knife knits knobs knock
knoll knots known knows koala labor laced laces lacks lakes lambs lamps lands lanes lanky lapel lapse large larva
lasso lasts latch later lathe laths laugh lawns layer leads leafy leaks leaks leans leaps learn lease leash least
leave ledge leech lefty legal lemon lends leper level lever light liked likes lilac limes limbs lined linen liner
lines links lions lippy lisle listy lithe litre lived liver lives llama loads loamy loath loans lobby local locks
locus lodge lofty logic login loopy loose lorry loser loses lotus lousy loved loves lower loyal lucid lucks lumpy
lunar lunch lungs lurch lured lures lurks lying lyres maces macho macro madam magic magma maize major maker makes
males mall? malls mango manly manor maple march mares marks marry marsh masks mason masts match mated mates math?
maxim maybe mayor meals meant meaty medal media medic meets melon melts mends menus mercy merge merit merry messy
metal meter meted metro micro midge midst might milks milky mimic mince minds mined miner mines minor mints minty
minus mirth miser missy mists misty miter moans moats mocha mocks modal model modem mogul moist molar mold? moles
molls money month moody moose moped moral morph mossy motel moths motor motto mound mount mourn mouse mouth moved
mover moves movie mower mucus muddy mules mummy mumps munch mural murky mushy music musty muted myths nadir nails
naive naked named names nanny nasal nasty natal naval navel needs nerdy nerve nervy nests never newer newly nicer
niche nicks niece nifty night ninja ninth noble nobly nodes noise noisy nomad noose norms north nosey notch noted
notes noun? nova? novae nosey nudge nurse nutty nylon oaked oaken oasis oaths obese occur ocean ochre octal octet
odder oddly odors offer often ogres okapi olden olive omega omens onion onset opera opine optic orbit order organ
other otter ought ounce ovals ovens overt ovine owing owned owner oxide ozone paced paces packs pacts paddy pagan
pager pails pains paint pairs palms panda panel panic pansy pants papal paper parch parka parks party pascal pasta
paste pasty patch paths patio patsy patty pause paved paves pawn? pawns peach peaks pearl pears pecan pedal peers
pelts penal pence pens? peony perch peril perky pesky pesto petal petty phase phone phony photo piano picks piece
piety piggy pilot pinch pines pinky pinto pious pipes pique pitch pithy pivot pixel pizza place plaid plain plait
plane plank plans plant plate plays plaza plead pleat pledge pledge plied plier plies plots plows pluck plumb
plume plump plums plunk plush poach pocket poems poets point poise poked poker poles polka polls polo? poly? pomps
ponds pony? pools poor? poppa pops? porch posed poses posit posse posts pouch pound pours power prank prawn preen
press price prick pride pried prime primo primp print prior prism privy prize probe prone prong proof props prose
proud prove prowl proxy prude prune psalm pubic puck? pudgy puffy pulpy pulse pumps punch pupil puppy puree purge
purse pushy putty pylon pygmy quack quail quake qualm quart quash quasi queens queer quell query quest queue quick
quiet quill quilt quirk quite quota quote rabbi rabid races racks radar radii radio radon rafts rage? ragged raid?
rails rains rainy raise rally ranch range rangy ranks rants rapid rare? rash? rated rates ratio ratty raven rayon
razor reach react reads ready realm reaps rebel rebus recap recur reedy reefs refer regal reign relax relay relic
remit remix renal renew repay repel reply repos reres repro rerun reset resin rests retro retry reuse revel revue
rhino rhyme rider rides ridge rifle right rigid rigor riled riles rings rinse rips? risen rises risks rites rival
river rivet roach roads roar? roast robed robes robin robot rocks rocky rodeo rods? rogue rolls roman roomy roost
roots ropes rosa? rosin rotor rouge rough round rouse route rover rows? royal ruddy ruins rules rumba rumor rupee
rural rusty sable sadly safer sails saint sakes salad sales salon salsa salty salute samed sands sandy saner sappy
sassy satin sauce sauna saved saves savor savory scale scalp scaly scamp scant scare scarf scary scene scent scoff
scold scone scoop scoot scope score scorn scour scout scowl scram scrap screw scrub scuba scuff seals seams seats
sedan sedge seeks seems seize sells semen sends sense serif serum setup seven sever sewer shack shade shady shaft
shake shaky shale shall shame shank shape shard share shark sharp shave shawl sheaf shear sheds sheen sheep sheer
sheet shelf shell shied shift shine shiny ships shire shirt shoal shock shoes shone shook shoot shops shore short
shots shout shove shown shows shrub shrug shuns shunt shuts sick? sides siege sieve sights sigma silly since sinew
sing? siren sixth sixty sized sizes skate skier skies skill skimp skin? skirt skull skunk slabs slack slags slain
slang slant slaps slash slate slats slave sleek sleep sleet slept slice slick slide slime slimy sling slink slips
slits slope sloppy slops sloth slots slow? slug? slums slurp small smart smash smear smell smelt smile smirk smite
smith smock smoke smoky snack snail snake snaky snaps snare snarl sneak sneer snide sniff snipe snoop snore snort
notch? snout snowy snuck soaks soaps soapy sober socks soggy solar soled soles solid solve sonar songs sonic soon?
sooth sooty sorts souls sound soups south space spade spare spark spasm spawn speak spear speck speed spell spend
spent sperm spice spicy spied spiel spike spill spine spins spiny spire spite splat split spoil spoke spoof spook
spool spoon spore sport spots spout spray spree sprig spunk spurn spurt squad squat squid stack staff stage staid
stain stair stake stale stalk stall stamp stand stank staph stare stark stars start stash state stave stays stead
steak steal steam steed steel steep steer stein stems steno stern stew? sticks stiff still stilt stings stinky
stint stoic stoke stole stomp stone stony stood stool stoop stops store stork storm story stout stove strap straw
stray strips strum strut stuck studs study stuff stump stung stunk stunt style suave sugar suite suits sulky sully
sumac sunny super surge sut? swamp swans swarm swath swear sweat sweep sweet swell swept swift swims swine swing
swipe swirl swish swoon swoop sword swore sworn syrup table tacit tacks taffy tails taint taken taker takes tales
talks tally talon tamed tango tangy tanks taped tapes tards tasks taste tasty taunt taut? teach teaks teal? teams
tears tease teeth tempo tenor tense tenth tepee tepid terms terse tests thanx thank thaws theft their theme there
these thick thief thigh thing think third thong thorn those three threw throb throw thrum thuds thumb thump thyme
tiara tibia tidal tided tides tier? tiger tight tiled tiles till? tilt? timer times tinge tinfo tints tipsy tired
titles toads toast today toddy toils token tolls tombs tonal toned tones tongs tonic tools tooth toots topic torso
total totem touch tough tours towel tower towns toxic toxin trace track tract trade trail train trait tramp traps
trash trawl tread treat trees trek? trend triad trial tribe trice trick tried tries trill trims trios tripe trite
troll troop trope trout trove truce truck truly trump trunk truss trust truth tubes tufts tulip tummy tuned tunes
tunic turbo turf? turned tusk? tutor twang tweak tweed tweet twice twigs twine twins twirl twist tying udder ulcer
ultra umber umpire units unbar unbid uncle under undid undue unfed unfit unify union unite units unity unjam unlit
untie until unwed unzip upset urban urged urges usage users usher using usual utter vague valet valid valor value
valve vapor vault veers vegan venom venue verge verse video views vigil vigor villa vinyl viola viper viral virus
visit visor vista vital vivid vixen vocal vodka vogue voice voila? voled? vowel vroom vulgar wacky waded wades wafer
wafts wager wages wagon waist waits waked waken walks walls waltz wands waned wants wards wares warms warns warts
washy wasps waste watch water watts waver waxes weary weave wedge weedy weighs weird wells welsh whack whale wharf
wheat wheel whelp where which whiff while whims whirl whisk white whole whose widen wider widow width wield wilds
wills wilts wince winch winds windy wines wings winks wiped wiper wires wiry wisps wised wisps witch wits? woken
woman women woody wooed words works world worms worry worse worst worth would wound woven wrath wreak wreck wrest
wried? wring writ? yacht yahoo yearn years yeast yells yield yolks young yours youth yummy zappy zebra zests zesty
zippy zoned zooms

  absorb accent accept access across action active afford agency agenda almost always amount animal annual answer anyone appeal appear around arrive artist aspect assist assume attack attend author autumn avenue bamboo banana banner barrel basket battle beauty become before behalf behave behind belief belong better beyond bishop bitter blouse border bottle bottom bounce branch breath bridge bright broken bronze bubble budget bullet bundle burden bureau butter button camera campus canvas canyon carbon career carpet carrot castle casual cellar cement center cereal chapel charge cheese cherry choice choose chosen church circle circus clever client closet coffee column combat common copper corner cotton county couple coupon course cousin crater credit crisis cruise cursor custom dagger damage danger debate decade decide defeat defend define degree demand dental depart depend desert design desire detail detect device dinner direct divide doctor dollar domain donkey double dragon drawer driven driver during easily editor effect effort either eleven emerge empire employ enable energy engage engine enough ensure entire entity escape estate exceed except excess excite excuse expand expect expert export expose extend extent fabric factor fallen family famous farmer father fellow female fierce figure filter finger finish flavor flight flower follow forest forget formal format former foster fourth fridge friend frozen future galaxy garage garden garlic gather gender gentle ginger glance global golden gospel govern guitar hammer handle happen harbor hardly health heaven height hidden holder hollow hungry hunter impact import income indoor infant inform inside insist intent invest invite island itself jacket jersey jigsaw junior kettle kidney kitten knight ladder lately latest latter launch lawyer leader league legend length lesson letter liquid listen little lonely luxury magnet makeup mammal manage manner marble margin marine market meadow medium member memory mentor merely method middle minute mirror mobile modern modest module moment monkey mosque motion museum mutual myself narrow nation native nature nearby nearly needle nephew notice notion number object obtain occupy office online option orange orchid origin orphan outfit output oxygen oyster palace pantry parrot pastry patrol peanut pencil people pepper period permit person phrase picnic pigeon pillow pirate planet plasma player please plenty poetry police policy polish poster potato powder praise prayer prefer pretty priest prince prison profit prompt proper public puddle purple pursue puzzle rabbit racket rarely rather reason recall recent recipe record reduce reform refuse region relate relief remain remark remind remote remove repair repeat replay report rescue resort result retail retain retire return reveal review reward rhythm ribbon riddle ritual rocket rotate rubber runner runway sacred saddle safari safety sailor salmon sample scenic scheme school screen script season second secret sector secure seldom select senior sensor sermon settle severe shadow shrimp signal silent silver simple singer single sister sketch slowly smooth soccer social solemn sought source spider spirit splash spoken sponge spread spring sprint square squash stable static statue steady stereo sticky stitch stolen stream street stress strict strike string stripe strong studio submit subtle suburb subway sudden suffer summer summit sunset supply surely survey symbol system tablet tactic talent target tattoo temple tenant tender tennis thread threat thrive throat ticket timber tissue toilet tomato tongue tonight toward treaty tropic trophy trying tunnel turkey turtle twelve twenty unfair unique urgent useful vacuum valley vanish vector velvet vendor verify vessel volume waffle walnut wander warmth wealth weight window winner winter within wonder wooden writer yellow yogurt zephyr zigzag ability absence account achieve acquire address advance adverse advised adviser airline airport alcohol alleged analyst ancient another anxiety anybody applied arrange arrival article assault attempt auction average balcony battery because bedroom believe beneath benefit besides between billion biology bonfire caption careful carrier caution ceiling central century certain chamber chapter charity charter chicken chimney circuit citizen classic climate cluster collect college combine comfort command comment compact company compare concept concern concert conduct confirm connect consent consist contact context control convert correct cottage council counter country courage crystal culture curious current decline default defense deliver density deposit desktop despite destroy develop diamond digital discard display dispute distant diverse dolphin equator evening exactly examine example exclude exhibit expense explain explore express extreme factory faculty fantasy fashion feature federal fiction fifteen fighter fitness fixture florist forever formula fortune forward freedom gateway general genetic genuine giraffe gravity haircut handful helpful herself highway history holiday however hundred illness imagine immense improve impulse include initial inquiry insight install instant instead intense involve justify lantern liberty library license manager maximum medical mention mercury message million mineral miracle mission mixture monster morning mystery natural neither nervous network nothing nowhere nuclear observe obvious offense officer opinion organic outline overall package painter palette panther paradox partial partner passage passion patient pattern payment pension percent perfect perform perhaps persist physics picture pioneer prairie precise predict premier premium prepare present prevent primary printer privacy problem proceed process produce product profile program project promise promote protein protest provide publish purpose pursuit quantum quarter railway reality receipt receive recover reflect regular release replace replica request require reserve resolve respect restore retreat revenue reverse scholar science scratch section sensory serious service setting several shelter sheriff silence similar sixteen soldier somehow someone speaker special species sponsor station storage strange stretch subject succeed success summary support suppose supreme surgeon surplus teacher theatre thermal thought through thunder together tourist traffic tragedy trailer transit trouble typical upgrade upright utility vacancy variety vehicle venture verdict version vintage violent virtual visible warrior warrant whisker whisper willing without witness worried younger zealous accident activity aircraft alliance alphabet ancestor annually apparent approval argument artistic assembly athletic attitude audience aviation basement bathroom birthday boundary business calendar campaign capacity casualty category cathedral chairman checklist chemistry childhood chocolate christmas clothing commerce computer concrete conflict congress contrast convince corridor coverage creative criminal critical customer database daughter deadline decision decrease delivery diameter director discount disorder distance district dividend doctrine dramatic editorial education election electric elephant employee engineer enormous evidence exchange exercise expansion exposure facility familiar favorite feedback festival football forecast forehead fountain fourteen frontier furniture gardener gasoline guidance heritage historic hospital industry infinite interval isolated junction keyboard landlord laughter learning marketing marriage material medicine midnight momentum mountain movement national nineteen northern notebook novelist numerous obstacle occasion offering official operator opposite ordinary organize ornament outbreak overcome overview parallel patience peaceful personal petition pharmacy pleasant politics portrait position positive possible powerful practice precious pregnant presence princess printing priority prominent protocol province quantity question rational reaction remember reminder renewable reporter research resident resource romantic rotation routine scenario schedule sciences scramble sculptor seashore seasonal security seminar sensible separate sequence shoulder sickness situated slightly splendid straight strategy strength striking stunning sunshine superior surprise swimming sympathy template thousand training transfer troubled umbrella universe valuable variable vertical wardrobe waterway whatever whenever wireless withdrew woodland workshop yearbook yourself youthful adventure aftermath agreement ambulance apartment architect astronaut attention autograph beautiful beginning blueprint breakfast broadcast carefully celebrity champagne classroom clubhouse committee companion confident confusion container dangerous defensive delighted detective different direction discovery drumstick effective elaborate emergency encounter endurance essential everybody excellent excursion expensive fantastic firework fisherman footprint fortunate geography gratitude greatness happiness hazardous hurricane identical important influence inspector interview introduce invention invitation journalist knowledge landscape lifestyle lightning loneliness narrative newspaper nutrition operation orchestra packaging paragraph passenger patiently perimeter permanent photograph realistic reasoning recognize recommend rectangle represent resistant satellite satisfied scientist sculpture secondary secretary selection seriously signature situation snapshot spotlight steadily stopwatch strategic structure submarine substance technical telephone telescope temporary territory timetable tolerance tradition translate transport treatment vegetable warehouse wonderful yesterday
`

/** Banques prêtes à l'emploi (découpées une seule fois à l'initialisation). */
export const FR_WORDS: ReadonlySet<string> = new Set(
  FR_RAW.trim()
    .split(/\s+/)
    .filter((w) => w.length >= 3 && w.length <= 9 && /^[a-z]+$/.test(w)),
)

export const EN_WORDS: ReadonlySet<string> = new Set(
  EN_RAW.trim()
    .split(/\s+/)
    .filter((w) => w.length >= 3 && w.length <= 9 && /^[a-z]+$/.test(w)),
)

/** Poids de tirage des lettres (inspirés des distributions de Scrabble, ajustés). */
export const FR_LETTER_WEIGHTS: Record<string, number> = {
  a: 9, b: 2, c: 2, d: 4, e: 15, f: 2, g: 2, h: 2, i: 8, j: 1, k: 1, l: 5, m: 3,
  n: 6, o: 6, p: 2, q: 1, r: 6, s: 6, t: 6, u: 6, v: 2, w: 1, x: 1, y: 1, z: 1,
}

export const EN_LETTER_WEIGHTS: Record<string, number> = {
  a: 9, b: 2, c: 2, d: 4, e: 12, f: 2, g: 3, h: 2, i: 9, j: 1, k: 1, l: 4, m: 2,
  n: 6, o: 8, p: 2, q: 1, r: 6, s: 4, t: 6, u: 4, v: 2, w: 2, x: 1, y: 2, z: 1,
}
