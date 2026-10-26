# 🔒 Charte de protection de l'acquis — Granmed.store

> **Version 1.0 — basée sur la demande utilisateur (Task 14 du worklog) :**
> *« Sécurisons tous les jeux et fonctionnalités implémentés dans ce projet afin que les
> prochaines implémentations ne suppriment pas les anciennes, et qu'au cours des prochaines
> implémentations celles existantes ne soient pas modifiées — sauf force majeure, où l'on
> devrait modifier une fonctionnalité pour en implémenter une nouvelle. »*

Cette charte est **contraignante pour toute intervention future** sur le projet
(agent IA comme développeur humain). Elle est **appliquée par machine** via le
garde-fou `protection/integrity.ts` (commande `bun run integrity`).

---

## 1. Ce qui est protégé

### 1.1 Les 20 jeux (fichiers gelés + marqueurs de fonctionnalités)

Chaque jeu vit dans **un seul fichier** `src/components/games/<slug>.tsx`
(+ données éventuelles dans `src/components/games/data/`). Pour chacun, le
garde-fou vérifie l'empreinte SHA-256 **et** la présence des marqueurs de
fonctionnalités suivants :

| Marqueur (dans le code du jeu) | Fonctionnalité garantie |
|---|---|
| `export default` + `export const content` + `export const gameId` | composant jouable + contenu SEO/AIO bilingue FR/EN |
| `sfx.` | sons libres de droits liés aux actions |
| `my-auto` | intégration surface de jeu immersif mobile |
| `addGameXp` | niveaux par jeu (gamification, 12 paliers) |
| `RoundEndActions` *(sauf jeux zen)* | fin de manche « Poursuivre / Quitter » + recommandation subtile |
| `VictoryBurst` *(sauf block-puzzle)* | célébration satisfaisante en cas de gain |
| `completeDaily` *(jeux quotidiens)* | défi du jour validé |

Exceptions de design (documentées, volontaires — ne pas « corriger ») :
- `merge-garden` et `zen-fishing` : jeux zen **sans fin de manche** → pas de `RoundEndActions` ;
- `block-puzzle` : jeu **sans victoire** → pas de `VictoryBurst`.

### 1.2 Le socle partagé (gel intégral de `src/` hors append-only)

Routeur SPA + i18n FR/EN, GameShell immersif, RoundEndActions/VictoryBurst,
niveaux (`progress/levels.ts`), store de progression et 47 badges, sons
(19 MP3 Mixkit + licence), sauvegardes, dashboard, accueil, guides, pages
catégories/légales, JSON-LD et metadata SEO, composants shadcn/ui.

### 1.3 Les assets & le référencement

`public/` entier : 19 sons + `LICENSE.md`, 8 images IA originales,
`robots.txt`, `sitemap.xml`, `llms.txt` (GEO), `logo.svg`.

### 1.4 Les configurations

`tailwind.config.ts`, `next.config.ts`, `tsconfig.json`, `components.json`,
`postcss.config.mjs`, `eslint.config.mjs`, `Caddyfile`, `prisma/schema.prisma`,
ainsi que le garde-fou lui-même (`protection/integrity.ts` + ce fichier).

### 1.5 Les points d'extension (append-only)

Deux fichiers peuvent être **uniquement complétés** — jamais amputés ni édités
dans leurs entrées existantes :

- `src/lib/games/catalog.ts` → **ajouter** des entrées à `GAMES` (jeux 21, 22…) ;
- `src/lib/games/registry.tsx` → **ajouter** des lignes à `LOADERS`.

Le garde-fou vérifie champ par champ que chaque entrée de la base reste
strictement identique (chemins FR/EN, titres, icône, catégorie, difficulté,
popularité, similarités, daily) et qu'aucun loader ne disparaît.

---

## 2. Règle d'or — développement additif

1. **Ajouter un fichier plutôt que modifier un fichier existant.**
2. **Interdictions absolues** : supprimer, renommer, vider ou réécrire un
   fichier protégé ; retirer un jeu du catalogue ou du registre ; modifier une
   entrée de jeu existante ; retirer un marqueur de fonctionnalité ; supprimer
   un son, une image ou un fichier SEO ; neutraliser le garde-fou.
3. Un bug dans un jeu se corrige **dans le fichier de ce jeu uniquement**
   (force majeure, §4) ; une fonctionnalité transverse nouvelle se code dans un
   **nouveau fichier** et se branche sans éditer les jeux existants.
4. `worklog.md` et `protection/CHANGELOG.md` sont des journaux **vivants**
   (présence exigée, contenu libre).

## 3. Le garde-fou — usage obligatoire

```bash
bun run integrity        # AVANT chaque tâche  → doit afficher ✅ ACQUIS INTÈGRE
bun run integrity        # APRÈS chaque tâche  → doit afficher ✅ ACQUIS INTÈGRE
bun run lint             # APRÈS chaque tâche  → 0 erreur
```

Toute tâche qui se termine avec `integrity` en échec **n'est pas terminée** :
soit on restaure (§5), soit on passe par la force majeure (§4).

Les **ajouts purs** (nouveau jeu, nouveau son, nouveau fichier source) ne font
pas échouer la vérification — ils sont signalés `ℹ️` et doivent être
officialisés (§6) pour entrer dans la base protégée.

## 4. Force majeure — procédure obligatoire

*Cas visé par l'utilisateur : modifier une fonctionnalité existante devient
nécessaire pour en implémenter une nouvelle, ou un bug exige de toucher un
fichier gelé.*

1. **Justifier** : décrire précisément le pourquoi et le quoi dans la section
   de la tâche dans `worklog.md` (quoi change, pourquoi c'est inévitable, quel
   impact sur les joueurs).
2. **Régénérer la base** :
   ```bash
   bun run integrity:update -- --reason "Correction #<tâche> : <justification>"
   ```
   Le garde-fou consigne date, raison, commit et diff (ajouts/modifications/
   suppressions) dans `protection/CHANGELOG.md`.
3. **Relire** le diff signalé : il doit correspondre exactement à ce qui est
   justifié — rien de plus.
4. **Committer** immédiatement (`git add -A && git commit`).

⚠️ Les **suppressions** sont refusées par défaut. Elles exigent en plus
`--accept-deletions` et une raison explicite — elles ne sont légitimes que
pour un démantèlement volontaire et assumé, jamais « par accident ».

## 5. Restauration (régression détectée)

```bash
# Un fichier précis :
git checkout -- src/components/games/memory-match.tsx

# Tout l'acquis protégé (dernier snapshot stable tagué) :
git reset --hard v1.0-stable && git clean -fd src public protection

# Archive froide hors dépôt (ultime recours) :
/home/z/granmed-backups/granmed-stable-v1.0.zip
```

## 6. Ajouter un nouveau jeu (workflow autorisé et encouragé)

1. Créer `src/components/games/<slug>.tsx` (contrat de codage : section
   CONTRAT JEUX du `worklog.md` — un seul fichier, `'use client'`, exports
   `default` + `content` + `gameId`, sons via `sfx.play`, `addPlay`/`addWin`/
   `setBest`/`unlockBadge`, mobile-first, `my-auto w-full`, `RoundEndActions`,
   `VictoryBurst`, `addGameXp`, palette chaude sans bleu/indigo).
2. **Ajouter** (sans toucher aux entrées existantes) l'entrée dans
   `src/lib/games/catalog.ts` (`GAMES`) et le loader dans
   `src/lib/games/registry.tsx` (`LOADERS`).
3. `bun run lint` → 0 erreur ; `bun run integrity` → signale le nouveau jeu
   en `ℹ️` (autorisé).
4. Officialiser l'entrée du jeu dans la base protégée :
   ```bash
   bun run integrity:update -- --reason "Ajout du jeu <slug> (Task <n>)"
   ```
5. Committer.

## 7. Base de données de la protection

`protection/manifest.json` est **généré par machine** — ne jamais l'éditer à
la main. Il contient : l'inventaire des jeux et de leurs marqueurs, les
empreintes SHA-256 de tous les fichiers gelés, la photographie complète des
entrées du catalogue, les loaders du registre, les invariants de `package.json`.
`protection/CHANGELOG.md` retrace l'historique des régénérations (force
majeure et ajouts de jeux).

---

*Dernière mise à jour : Task 14 — sécurisation de l'acquis (20 jeux, socle,
SEO/AIO/GEO, sons, configs).*
