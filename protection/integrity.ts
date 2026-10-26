#!/usr/bin/env bun
/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GRANMED.STORE — GARDE-FOU D'INTÉGRITÉ DE L'ACQUIS  (protection/integrity.ts)
 * ═══════════════════════════════════════════════════════════════════════════
 *  Sécurise les 20 jeux et l'ensemble des fonctionnalités du portail contre
 *  toute suppression ou modification non justifiée lors des implémentations
 *  futures (demande utilisateur, Task 14 du worklog).
 *
 *  UTILISATION
 *    bun run integrity                              → VÉRIFIER l'acquis (défaut)
 *    bun run integrity:update -- --reason "…"       → FORCE MAJEURE documentée
 *    bun protection/integrity.ts --update --reason "…" [--accept-deletions]
 *    bun protection/integrity.ts --help
 *
 *  POLITIQUE COMPLÈTE : lire PROTECTION.md à la racine du projet.
 *
 *  Ce que le vérificateur considère comme RÉGRESSION (échec, code sortie 1) :
 *    - un fichier gelé supprimé, renommé ou dont le SHA-256 a changé ;
 *    - un jeu absent du catalogue, ou une entrée de jeu modifiée
 *      (chemins FR/EN, titres, icône, catégorie, difficulté, daily…) ;
 *    - un loader manquant dans le registre, ou un jeu du catalogue sans loader ;
 *    - un marqueur de fonctionnalité perdu dans un fichier de jeu
 *      (exports SEO, sons, immersif, fin de manche, niveaux, célébration…) ;
 *    - un asset manquant (son, image, robots.txt, sitemap.xml, llms.txt) ;
 *    - le script d'intégrité retiré de package.json, ou le garde-fou lui-même
 *      (protection/integrity.ts, PROTECTION.md) supprimé/altéré.
 *
 *  Ce qui est AUTORISÉ (développement additif, simple information) :
 *    - un nouveau fichier de jeu + sa nouvelle entrée catalogue + son loader ;
 *    - un nouveau son, une nouvelle image, un nouveau fichier source ;
 *    → à officialiser ensuite via `bun run integrity:update -- --reason "…"`.
 */

import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync, appendFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// ─────────────────────────────────────────────────────────── chemins & règles

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const MANIFEST_PATH = join(ROOT, 'protection', 'manifest.json')
const CHANGELOG_PATH = join(ROOT, 'protection', 'CHANGELOG.md')

/** Fichiers « append-only » : additions permises, base protégée sémantiquement. */
const APPEND_ONLY_FILES = ['src/lib/games/catalog.ts', 'src/lib/games/registry.tsx'] as const
/** Fichier surveillé : modifications tolérées (dépendances), invariants contrôlés. */
const WATCHED = 'package.json'
/** Fichiers dont l'existence est exigée mais le contenu vivant (non hashés). */
const PRESENCE_ONLY = ['worklog.md', 'protection/CHANGELOG.md']
/** Racines intégralement gelées (énumérées récursivement à la génération). */
const FROZEN_ROOTS = ['src', 'public']
/** Fichiers isolés gelés (hors racines ci-dessus). */
const FROZEN_EXTRA = [
  'protection/integrity.ts',
  'PROTECTION.md',
  'tailwind.config.ts',
  'next.config.ts',
  'tsconfig.json',
  'components.json',
  'postcss.config.mjs',
  'eslint.config.mjs',
  'Caddyfile',
  'prisma/schema.prisma',
]

/** Jeux zen sans écran de fin de manche (par design, voir worklog Task 13). */
const ZEN_WITHOUT_ROUND_END = new Set(['merge-garden', 'zen-fishing'])
/** Jeu sans victoire possible (pas de célébration, par design). */
const GAMES_WITHOUT_VICTORY = new Set(['block-puzzle'])

const TAG = 'v1.0-stable'
const MIN_REASON_LENGTH = 10

// ──────────────────────────────────────────────────────────────────── types

interface FileEntry {
  sha256: string
  bytes: number
}

interface GameDefSnapshot {
  slug: string
  paths: Record<string, string>
  title: Record<string, string>
  short: Record<string, string>
  icon: string
  category: string
  difficulty: number
  popularity: number
  releasedAt: string
  similar: string[]
  daily: boolean
}

interface GameProtection {
  slug: string
  file: string
  daily: boolean
  /** Marqueurs sémantiques exigés dans le fichier du jeu. */
  requires: string[]
}

interface Manifest {
  manifestVersion: number
  generatedAt: string
  reason: string
  baselineCommit: string | null
  stableTag: string
  games: GameProtection[]
  /** Chemin → empreinte. Tout changement = régression. */
  frozen: Record<string, FileEntry>
  appendOnly: Record<
    string,
    FileEntry & {
      /** Pour catalog.ts : photographie exacte des entrées de la base. */
      games?: GameDefSnapshot[]
      /** Pour registry.tsx : slug → chemin d'import du loader. */
      loaders?: Record<string, string>
    }
  >
  watched: Record<string, FileEntry>
  presenceOnly: string[]
}

interface Problems {
  failures: string[]
  warnings: string[]
  infos: string[]
}

// ─────────────────────────────────────────────────────────────── utilitaires

const OK = '✅'
const KO = '❌'
const WARN = '⚠️ '
const INFO = 'ℹ️ '

function hashFile(rel: string): FileEntry | null {
  const abs = join(ROOT, rel)
  if (!existsSync(abs)) return null
  const buf = readFileSync(abs)
  return { sha256: createHash('sha256').update(buf).digest('hex'), bytes: buf.byteLength }
}

function readText(rel: string): string | null {
  const abs = join(ROOT, rel)
  return existsSync(abs) ? readFileSync(abs, 'utf8') : null
}

/** Énumère récursivement tous les fichiers d'un dossier (chemins relatifs). */
function walkFiles(relDir: string): string[] {
  const absDir = join(ROOT, relDir)
  if (!existsSync(absDir)) return []
  const out: string[] = []
  for (const name of readdirSync(absDir)) {
    const rel = `${relDir}/${name}`
    const abs = join(ROOT, rel)
    if (statSync(abs).isDirectory()) out.push(...walkFiles(rel))
    else out.push(rel)
  }
  return out
}

function gitHead(): string | null {
  try {
    return execSync('git rev-parse HEAD', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return null
  }
}

function nowIso(): string {
  return new Date().toISOString()
}

function stable(value: unknown): string {
  return JSON.stringify(value)
}

// ───────────────────────────────────────────── lecture du catalogue & registre

async function loadCatalogGames(): Promise<GameDefSnapshot[]> {
  const mod = (await import(join(ROOT, 'src', 'lib', 'games', 'catalog.ts'))) as {
    GAMES?: GameDefSnapshot[]
  }
  if (!Array.isArray(mod.GAMES)) {
    throw new Error('catalog.ts n’expose pas GAMES — fichier corrompu ?')
  }
  return mod.GAMES
}

function parseLoaders(registrySource: string): Record<string, string> {
  const loaders: Record<string, string> = {}
  const re = /'([a-z0-9-]+)':\s*\(\)\s*=>\s*import\('([^']+)'\)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(registrySource)) !== null) loaders[m[1]] = m[2]
  return loaders
}

/** Marqueurs de fonctionnalités exigés pour un jeu (la réalité du code = vérité). */
function requiredMarkers(slug: string, daily: boolean): string[] {
  const markers = [
    'export default',
    'export const content',
    `export const gameId = '${slug}'`,
    'sfx.',
    'my-auto',
    'addGameXp',
  ]
  if (!ZEN_WITHOUT_ROUND_END.has(slug)) markers.push('RoundEndActions')
  if (!GAMES_WITHOUT_VICTORY.has(slug)) markers.push('VictoryBurst')
  if (daily) markers.push('completeDaily')
  return markers
}

// ───────────────────────────────────────────────────────────── scan & manifest

async function scan(reason: string): Promise<Manifest> {
  const catalogGames = await loadCatalogGames()
  const registrySource = readText('src/lib/games/registry.tsx') ?? ''
  const loaders = parseLoaders(registrySource)

  // Fichiers gelés : toutes les racines produits + extras, moins les append-only.
  const frozenRel: string[] = []
  for (const rootDir of FROZEN_ROOTS) frozenRel.push(...walkFiles(rootDir))
  frozenRel.push(...FROZEN_EXTRA)
  const frozen: Record<string, FileEntry> = {}
  for (const rel of frozenRel) {
    if ((APPEND_ONLY_FILES as readonly string[]).includes(rel)) continue
    const h = hashFile(rel)
    if (h) frozen[rel] = h
  }

  // Append-only : empreinte informative + photographie sémantique de la base.
  const appendOnly: Manifest['appendOnly'] = {}
  for (const rel of APPEND_ONLY_FILES) {
    const h = hashFile(rel)
    if (!h) continue
    if (rel === 'src/lib/games/catalog.ts') appendOnly[rel] = { ...h, games: catalogGames }
    else appendOnly[rel] = { ...h, loaders }
  }

  // Jeux : protections sémantiques dérivées du catalogue réel.
  const games: GameProtection[] = catalogGames.map((g) => ({
    slug: g.slug,
    file: `src/components/games/${g.slug}.tsx`,
    daily: g.daily,
    requires: requiredMarkers(g.slug, g.daily),
  }))

  const watched: Record<string, FileEntry> = {}
  const pw = hashFile(WATCHED)
  if (pw) watched[WATCHED] = pw

  return {
    manifestVersion: 1,
    generatedAt: nowIso(),
    reason,
    baselineCommit: gitHead(),
    stableTag: TAG,
    games,
    frozen,
    appendOnly,
    watched,
    presenceOnly: PRESENCE_ONLY,
  }
}

// ─────────────────────────────────────────────────────────────── vérification

function checkPackageJsonInvariants(p: Problems): void {
  const src = readText(WATCHED)
  if (!src) {
    p.failures.push(`SUPPRIMÉ  ${WATCHED} (fichier surveillé — invariants requis)`)
    return
  }
  try {
    const pkg = JSON.parse(src) as { scripts?: Record<string, string> }
    const scripts = pkg.scripts ?? {}
    for (const key of ['dev', 'lint', 'integrity', 'integrity:update']) {
      if (!scripts[key]) {
        p.failures.push(`package.json : le script npm « ${key} » a disparu (garde-fou neutralisé)`)
      }
    }
  } catch {
    p.failures.push('package.json : JSON illisible')
  }
}

async function verify(manifest: Manifest): Promise<Problems> {
  const p: Problems = { failures: [], warnings: [], infos: [] }

  // 1. Fichiers dont l'existence est exigée.
  for (const rel of manifest.presenceOnly) {
    if (!existsSync(join(ROOT, rel))) p.failures.push(`SUPPRIMÉ  ${rel} (présence exigée)`)
  }

  // 2. Jeux : fichier + empreinte + marqueurs de fonctionnalités.
  for (const game of manifest.games) {
    const current = hashFile(game.file)
    if (!current) {
      p.failures.push(`SUPPRIMÉ  ${game.file} (jeu « ${game.slug} »)`)
      continue
    }
    const expected = manifest.frozen[game.file]
    if (!expected || expected.sha256 !== current.sha256) {
      p.failures.push(`MODIFIÉ  ${game.file} (jeu « ${game.slug} »)`)
      continue
    }
    const src = readText(game.file) ?? ''
    const missing = game.requires.filter((marker) => !src.includes(marker))
    if (missing.length > 0) {
      p.failures.push(
        `FONCTIONNALITÉ PERDUE dans ${game.slug} : marqueur(s) absent(s) ${missing
          .map((m) => `« ${m} »`)
          .join(', ')}`,
      )
    }
  }

  // 3. Catalogue (append-only) : entrées de base inchangées, additions libres.
  let catalogGames: GameDefSnapshot[] | null = null
  try {
    catalogGames = await loadCatalogGames()
  } catch (e) {
    p.failures.push(`src/lib/games/catalog.ts : illisible (${(e as Error).message})`)
  }
  if (catalogGames) {
    const baseline = manifest.appendOnly['src/lib/games/catalog.ts']?.games ?? []
    const bySlug = new Map(catalogGames.map((g) => [g.slug, g]))
    for (const base of baseline) {
      const cur = bySlug.get(base.slug)
      if (!cur) {
        p.failures.push(`CATALOGUE : le jeu « ${base.slug} » a été RETIRÉ de GAMES`)
        continue
      }
      for (const field of Object.keys(base) as (keyof GameDefSnapshot)[]) {
        if (field === 'slug') continue
        if (stable(cur[field]) !== stable(base[field])) {
          p.failures.push(
            `CATALOGUE : entrée « ${base.slug} » modifiée (champ « ${String(field)} » : ${stable(base[field])} → ${stable(cur[field])})`,
          )
        }
      }
    }
    const baselineSlugs = new Set(baseline.map((g) => g.slug))
    const added = catalogGames.filter((g) => !baselineSlugs.has(g.slug))
    if (added.length > 0) {
      p.infos.push(
        `CATALOGUE : ${added.length} nouveau(x) jeu(x) détecté(s) — autorisé (développement additif) : ${added
          .map((g) => g.slug)
          .join(', ')} → officialiser via integrity:update`,
      )
    }

    // 4. Registre : loaders de base intacts + tout jeu du catalogue branché.
    const registrySource = readText('src/lib/games/registry.tsx') ?? ''
    const loaders = parseLoaders(registrySource)
    const baselineLoaders = manifest.appendOnly['src/lib/games/registry.tsx']?.loaders ?? {}
    for (const [slug, importPath] of Object.entries(baselineLoaders)) {
      if (loaders[slug] !== importPath) {
        p.failures.push(
          `REGISTRE : loader « ${slug} » manquant ou modifié (${importPath} → ${loaders[slug] ?? 'ABSENT'})`,
        )
      }
    }
    for (const g of catalogGames) {
      if (!loaders[g.slug]) {
        p.failures.push(`REGISTRE : le jeu « ${g.slug} » du catalogue n’a AUCUN loader (jeu injoignable)`)
      }
    }
  }

  // 5. Fichiers gelés (jeux déjà contrôlés en §2 — pas de doublon de signalement).
  const gameFiles = new Set(manifest.games.map((g) => g.file))
  for (const [rel, expected] of Object.entries(manifest.frozen)) {
    if (gameFiles.has(rel)) continue
    const current = hashFile(rel)
    if (!current) p.failures.push(`SUPPRIMÉ  ${rel}`)
    else if (current.sha256 !== expected.sha256) p.failures.push(`MODIFIÉ  ${rel}`)
  }

  // 6. package.json : invariants durs + dérive en avertissement.
  checkPackageJsonInvariants(p)
  const watchedEntry = manifest.watched[WATCHED]
  const watchedNow = hashFile(WATCHED)
  if (watchedEntry && watchedNow && watchedEntry.sha256 !== watchedNow.sha256) {
    p.warnings.push(
      'package.json a changé (fichier surveillé) — permis pour de nouvelles dépendances, ' +
        'mais vérifiez que dev/lint/integrity demeurent et qu’aucune dépendance utilisée n’a été retirée',
    )
  }

  // 7. Nouveaux fichiers de jeu non répertoriés (candidats jeux futurs).
  const knownGames = new Set(manifest.games.map((g) => g.file))
  const gamesDir = join(ROOT, 'src', 'components', 'games')
  if (existsSync(gamesDir)) {
    for (const f of readdirSync(gamesDir)) {
      const rel = `src/components/games/${f}`
      if (f.endsWith('.tsx') && !knownGames.has(rel)) {
        p.infos.push(`NOUVEAU FICHIER DE JEU non répertorié — autorisé : ${rel} → officialiser via integrity:update`)
      }
    }
  }

  return p
}

// ─────────────────────────────────────────────────────── mode mise à jour

interface UpdateDiff {
  added: string[]
  modified: string[]
  removed: string[]
}

function diffManifests(oldManifest: Manifest | null, next: Manifest): UpdateDiff {
  const oldFiles: Record<string, string> = {}
  if (oldManifest) {
    for (const [rel, e] of Object.entries(oldManifest.frozen)) oldFiles[rel] = e.sha256
    for (const [rel, e] of Object.entries(oldManifest.appendOnly)) oldFiles[rel] = e.sha256
    for (const [rel, e] of Object.entries(oldManifest.watched)) oldFiles[rel] = e.sha256
  }
  const newFiles: Record<string, string> = {}
  for (const [rel, e] of Object.entries(next.frozen)) newFiles[rel] = e.sha256
  for (const [rel, e] of Object.entries(next.appendOnly)) newFiles[rel] = e.sha256
  for (const [rel, e] of Object.entries(next.watched)) newFiles[rel] = e.sha256

  const added = Object.keys(newFiles).filter((rel) => !(rel in oldFiles))
  const modified = Object.keys(newFiles).filter((rel) => rel in oldFiles && oldFiles[rel] !== newFiles[rel])
  const removed = Object.keys(oldFiles).filter((rel) => !(rel in newFiles))
  return { added, modified, removed }
}

function appendChangelog(reason: string, diff: UpdateDiff, head: string | null, gameCount: number): void {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  const lines = [
    `## ${stamp} — ${reason}`,
    `- Commit : ${head ? `\`${head.slice(0, 12)}\`` : 'hors git'}`,
    `- Jeux protégés : ${gameCount}`,
    `- Ajouts (${diff.added.length}) : ${diff.added.length ? diff.added.join(', ') : 'aucun'}`,
    `- Modifications (${diff.modified.length}) : ${diff.modified.length ? diff.modified.join(', ') : 'aucune'}`,
    `- Suppressions (${diff.removed.length}) : ${diff.removed.length ? diff.removed.join(', ') : 'aucune'}`,
    '',
  ]
  appendFileSync(CHANGELOG_PATH, `${lines.join('\n')}\n`, 'utf8')
}

// ───────────────────────────────────────────────────────────────── rendu

function countAssets(manifest: Manifest): string {
  const sounds = Object.keys(manifest.frozen).filter((f) => f.startsWith('public/sounds/')).length
  const images = Object.keys(manifest.frozen).filter((f) => f.startsWith('public/images/')).length
  const seo = Object.keys(manifest.frozen).filter((f) =>
    ['public/robots.txt', 'public/sitemap.xml', 'public/llms.txt'].includes(f),
  ).length
  return `${sounds} sons · ${images} images · ${seo} fichiers SEO/AIO/GEO`
}

function printReport(manifest: Manifest, p: Problems): void {
  console.log('')
  console.log('🔒 GRANMED.STORE — Garde-fou d’intégrité de l’acquis')
  console.log(`   Manifeste : protection/manifest.json (généré le ${manifest.generatedAt})`)
  console.log(`   Raison    : « ${manifest.reason} »`)
  console.log(`   Tag de restauration : ${manifest.stableTag}`)
  console.log('')
  console.log(`   Jeux protégés ............ ${manifest.games.length}`)
  console.log(`   Fichiers gelés ........... ${Object.keys(manifest.frozen).length}`)
  console.log(`   Assets ................... ${countAssets(manifest)}`)
  console.log('')

  if (p.failures.length > 0) {
    console.log(`${KO} ${p.failures.length} PROBLÈME(S) D’INTÉGRITÉ DÉTECTÉ(S) :`)
    for (const f of p.failures) console.log(`   ${KO} ${f}`)
    console.log('')
    console.log(`─ Restauration (voir PROTECTION.md §5) ${'─'.repeat(20)}`)
    console.log('   • un fichier précis :   git checkout -- <chemin_du_fichier>')
    console.log(`   • tout l’acquis :        git reset --hard ${TAG} && git clean -fd src public protection`)
    console.log('')
    console.log(`─ Force majeure (si la modification est VRAIMENT justifiée) ${'─'.repeat(4)}`)
    console.log('   1. Documenter la justification dans worklog.md (section de la tâche).')
    console.log('   2. bun run integrity:update -- --reason "justification détaillée"')
    console.log('   3. Relire le diff signalé, puis committer (git add + commit).')
    console.log('')
  } else {
    console.log(`${OK} ACQUIS INTÈGRE — aucun des éléments protégés n’a été supprimé ni modifié.`)
  }

  for (const w of p.warnings) console.log(`   ${WARN} ${w}`)
  for (const i of p.infos) console.log(`   ${INFO} ${i}`)
  console.log('')
}

// ─────────────────────────────────────────────────────────────────── entrée

function printHelp(): void {
  console.log(`
Granmed — Garde-fou d’intégrité de l’acquis

  bun run integrity
      Vérifie que rien n’a été supprimé ni modifié dans l’acquis protégé
      (20 jeux, socle partagé, SEO/AIO/GEO, sons, images, configs).
      Code sortie 0 = intègre, 1 = régression détectée.

  bun run integrity:update -- --reason "justification détaillée"
      FORCE MAJEURE documentée : régénère le manifeste après une modification
      assumée. La raison (≥ ${MIN_REASON_LENGTH} caractères) est consignée dans
      protection/CHANGELOG.md. Refuse les suppressions sauf --accept-deletions.

  Flags :
      --reason "<texte>"     justification obligatoire du mode --update
      --accept-deletions     autorise exceptionnellement les suppressions
      --help                 cette aide

Politique complète : PROTECTION.md (racine du projet).
`)
}

async function main(): Promise<number> {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    printHelp()
    return 0
  }
  const update = args.includes('--update')
  const acceptDeletions = args.includes('--accept-deletions')
  const reasonIdx = args.indexOf('--reason')
  const reason = reasonIdx >= 0 ? (args[reasonIdx + 1] ?? '') : ''

  if (!existsSync(MANIFEST_PATH) && !update) {
    console.error(`${KO} protection/manifest.json introuvable — la base de protection n’existe pas.`)
    console.error('   Restaurer : git checkout -- protection/manifest.json')
    console.error('   (ou l’initialiser : bun protection/integrity.ts --update --reason "init")')
    return 1
  }

  if (update) {
    if (reason.trim().length < MIN_REASON_LENGTH) {
      console.error(
        `${KO} --update exige --reason "<justification ≥ ${MIN_REASON_LENGTH} caractères>" (force majeure documentée).`,
      )
      return 2
    }
    const oldManifest: Manifest | null = existsSync(MANIFEST_PATH)
      ? (JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as Manifest)
      : null
    const next = await scan(reason)

    // Refus par défaut de toute suppression (jeux comme fichiers).
    const diff = diffManifests(oldManifest, next)
    const oldGames = oldManifest?.games.map((g) => g.slug) ?? []
    const newGames = next.games.map((g) => g.slug)
    const removedGames = oldGames.filter((s) => !newGames.includes(s))
    if ((diff.removed.length > 0 || removedGames.length > 0) && !acceptDeletions) {
      console.error(`${KO} FORCE MAJEURE REFUSÉE : des éléments protégés ont été SUPPRIMÉS.`)
      if (removedGames.length > 0) console.error(`   Jeux supprimés : ${removedGames.join(', ')}`)
      if (diff.removed.length > 0) console.error(`   Fichiers supprimés : ${diff.removed.join(', ')}`)
      console.error('   Si la suppression est réellement indispensable (démantèlement volontaire')
      console.error('   et assumé), relancez avec --accept-deletions ET une raison explicite.')
      return 2
    }

    writeFileSync(MANIFEST_PATH, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
    appendChangelog(reason, diff, next.baselineCommit, next.games.length)

    console.log('')
    console.log(`${OK} Manifeste régénéré (force majeure documentée).`)
    console.log(`   Raison : « ${reason} »`)
    console.log(`   Jeux protégés : ${next.games.length} · Fichiers gelés : ${Object.keys(next.frozen).length}`)
    console.log(
      `   Ajouts : ${diff.added.length} · Modifications : ${diff.modified.length} · Suppressions : ${diff.removed.length}`,
    )
    if (diff.modified.length > 0) console.log(`   ${WARN} Modifiés : ${diff.modified.join(', ')}`)
    console.log(`   ${INFO} Consigné dans protection/CHANGELOG.md — pensez à committer (git).`)
    console.log('')
    return 0
  }

  // Mode vérification (défaut).
  let manifest: Manifest
  try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as Manifest
  } catch (e) {
    console.error(`${KO} protection/manifest.json illisible : ${(e as Error).message}`)
    console.error('   Restaurer : git checkout -- protection/manifest.json')
    return 1
  }
  const problems = await verify(manifest)
  printReport(manifest, problems)
  return problems.failures.length > 0 ? 1 : 0
}

void main().then(
  (code) => {
    process.exit(code)
  },
  (err) => {
    console.error(`${KO} Erreur inattendue du garde-fou :`, err)
    process.exit(1)
  },
)
