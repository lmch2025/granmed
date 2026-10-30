# 🧠 Granmed — 20 jeux pour entraîner votre QI

**PWA bilingue (FR/EN)** de 20 jeux de réflexion conçus pour mesurer et entraîner votre QI : mémoire, logique, vitesse, vocabulaire, concentration. Jouable hors-ligne, installable, optimisée SEO / GEO / AIO.

---

## 🎯 Le concept

Chaque partie alimente un **moteur QI** (précision · rapidité · difficulté → échelle inspirée de Wechsler, 70–150). À la fin de chaque manche, une **carte QI spectaculaire** révèle votre score, votre percentile, votre niveau (Novice → Génie) et votre record personnel — puis vous invite à rejouer pour l'élever.

## 🎮 Les 20 jeux

| Réflexion | Vitesse | Détente |
|---|---|---|
| Sudoku | Math rapide | Jardin Fusion |
| 2048 Nutrition | Tranche Fruits | Pêche Zen |
| Démineur | Lancer Pilule | Puzzle (jigsaw) |
| Block Puzzle | Évasion Incendie | |
| Mots croisés | | |
| Mot du jour | | |
| Mot le plus long | | |
| Devine l'expression | | |
| Paires mémoire | | |
| Séquence mémoire | | |
| Table de Schulte | | |
| Vrai/Faux Santé | | |
| Histoire interactive | | |

## ✨ Fonctionnalités clés

- **🌐 Bilingue FR/EN** — langue détectée côté serveur, URL canoniques + cluster `hreflang`, contenus 100 % localisés (y compris le HTML brut pour les crawlers)
- **📊 Moteur QI** — score, percentile, 6 niveaux, records persistants (localStorage)
- **📱 PWA complète** — manifest, service worker offline, icônes maskable, composant d'installation élégant (jamais après installation, courtois pendant les parties)
- **🔍 SEO / GEO / AIO** — JSON-LD `VideoGame` ×20 + `FAQPage`, `llms.txt` avec réponses directes, `robots.txt` ouvert aux 10+ crawlers IA, sitemap avec `hreflang`, métadonnées par langue, mots-clés fort volume + longue traîne FR/EN
- **🔊 19 sons libres de droits** (MP3) + effets visuels « juice » non bloquants
- **🔒 Intégrité vérrouillée** — 168 fichiers gelés par SHA-256 (`protection/`)

## 🛠️ Stack technique

- **Next.js 16** (App Router, Turbopack) + **TypeScript 5** strict
- **Tailwind CSS 4** + **shadcn/ui** (New York) + Lucide icons
- **Prisma ORM** (SQLite) — Prisma ORM (SQLite)
- SPA hybride : 40 pages jeu réelles indexables (`/fr/jeu-…`, `/en/…` — proxy + métadonnées dédiées) + navigation interne hash sans rechargement
- Runtime **Bun**

## 📁 Structure

```
src/
  app/                 # layout.tsx, page.tsx (entrée unique), proxy.ts
  components/games/    # 20 jeux autonomes + fichiers de données
  components/          # RoundEndActions, VictoryBurst, carte QI, install PWA…
  lib/games/           # catalogue (SEO FR/EN), registry, moteur IQ, sfx
public/                # sons, images, robots.txt, sitemap.xml, llms.txt
protection/            # manifeste SHA-256, garde-fou, CHANGELOG
prisma/                # schéma
worklog.md             # journal de développement (22 tâches)
```

## 🚀 Lancer en local

```bash
bun install
bun run dev        # http://localhost:3000
```

Scripts utiles : `lint` · `integrity` (vérifie les 168 fichiers gelés) · `integrity:update` (force majeure documentée uniquement)

## 🔐 Protection de l'acquis

Le dossier `protection/` gèle par SHA-256 l'intégralité de l'acquis (20 jeux, sons, images, fichiers SEO). Toute modification d'un fichier gelé doit passer par une **force majeure** : justification dans le worklog → `integrity:update --reason "…"` → revue du diff → commit. Voir `PROTECTION.md`.

## 📜 Crédits

- Sons : 19 effets libres de droits (licence par fichier dans `public/sounds/LICENSE.md`)
- Images : générées par IA (usage libre)
- Jeux : conçus et développés sur mesure — aucun template tiers

---

# 🧠 Granmed — 20 Games to Train Your IQ

**Bilingual PWA (EN/FR)** featuring 20 brain games built to measure and train your IQ: memory, logic, speed, vocabulary, focus. Works offline, installable, fully optimized for SEO / GEO / AIO.

Every round feeds an **IQ engine** (accuracy · speed · difficulty → Wechsler-inspired scale, 70–150). At the end of each round, a **spectacular IQ card** reveals your score, percentile, level (Novice → Genius) and personal best — then invites you to play again to raise it.

**Tech:** Next.js 16 (App Router) · TypeScript 5 · Tailwind CSS 4 · shadcn/ui · Prisma (SQLite) · Bun. Hybrid SPA: 40 real indexable game pages (`/fr/jeu-…`, `/en/…` — dedicated metadata via proxy rewrite) + in-app hash navigation.

```bash
bun install && bun run dev   # http://localhost:3000
```

See `PROTECTION.md` for the SHA-256 integrity system guarding the 168 frozen files, and `worklog.md` for the full 22-task development journal.
