#!/usr/bin/env bun
/* ============================================================
 * SITEMAP-CHECK — Garde-fou de soumission Google Search Console.
 *
 * Certifie AVANT chaque soumission / déploiement que le sitemap et
 * son écosystème SEO sont intègres :
 *
 *  1. STATIQUE (toujours exécuté)
 *     - public/sitemap.xml présent, prologue XML, bien formé
 *       (parseur XML minimal : balises équilibrées, attributs cités) ;
 *     - racine <urlset> avec les espaces de noms sitemap + xhtml ;
 *     - chaque <loc> : URL absolue https sur le domaine officiel ;
 *     - cluster hreflang COMPLET par URL (auto-référence incluse),
 *       réciproque (tout href cité existe comme <loc>) et cohérent
 *       (le même cluster couvre toutes les URLs qu'il mentionne) ;
 *     - <lastmod> au format W3C, jamais dans le futur ;
 *     - robots.txt : directive « Sitemap: » absolue, cohérente.
 *
 *  2. LIVE (si le serveur répond sur l'origine locale)
 *     - /sitemap.xml servi en 200 + Content-Type application/xml,
 *       octet pour octet identique au fichier statique ;
 *     - chaque <loc> répond 200, robots meta « index »,
 *       <link rel=canonical> EXACTEMENT égal au loc (domaîne
 *       officiel), cluster hreflang du HTML == cluster du sitemap ;
 *     - /robots.txt servi en 200 avec la directive Sitemap.
 *
 * Sortie : rapport lisible + code 0 (OK) / 1 (échec).
 * Usage : bun run sitemap:check   (ou bun protection/sitemap-check.ts)
 * Origine locale personnalisable : SITEMAP_CHECK_ORIGIN=http://…
 * ============================================================ */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const SITE_ORIGIN = 'https://granmed.store'
const LOCAL_ORIGIN = process.env.SITEMAP_CHECK_ORIGIN ?? 'http://localhost:3000'
const ROOT = join(import.meta.dir, '..')

const failures: string[] = []
const wins: string[] = []
function ok(msg: string) {
  wins.push(msg)
}
function ko(msg: string) {
  failures.push(msg)
}

/* ---------- Parseur XML minimal (validation stricte) ---------- */

interface XmlNode {
  tag: string
  attrs: Record<string, string>
  children: XmlNode[]
  text: string
}

class XmlSyntaxError extends Error {}

function parseXml(src: string): XmlNode {
  let i = 0
  const n = src.length

  function skipInsignificant(): void {
    for (;;) {
      while (i < n && /\s/.test(src[i])) i++
      if (src.startsWith('<?', i)) {
        const end = src.indexOf('?>', i)
        if (end === -1) throw new XmlSyntaxError('prologue/traitement non fermé (?>)')
        i = end + 2
      } else if (src.startsWith('<!--', i)) {
        const end = src.indexOf('-->', i)
        if (end === -1) throw new XmlSyntaxError('commentaire non fermé (-->)')
        i = end + 3
      } else {
        return
      }
    }
  }

  function parseElement(): XmlNode {
    if (src[i] !== '<') throw new XmlSyntaxError(`caractère inattendu « ${src[i] ?? 'EOF'} » (balise attendue)`)
    i++
    const m = /^([A-Za-z_:][\w.:-]*)/.exec(src.slice(i))
    if (!m) throw new XmlSyntaxError('nom de balise invalide')
    const tag = m[1]
    i += tag.length
    const attrs: Record<string, string> = {}
    for (;;) {
      skipInsignificant()
      if (src.startsWith('/>', i)) {
        i += 2
        return { tag, attrs, children: [], text: '' }
      }
      if (src[i] === '>') {
        i++
        break
      }
      const am = /^([A-Za-z_:][\w.:-]*)\s*=\s*("([^"]*)"|'([^']*)')/.exec(src.slice(i))
      if (!am) throw new XmlSyntaxError(`attribut invalide dans <${tag}>`)
      attrs[am[1]] = am[3] ?? am[4] ?? ''
      i += am[0].length
    }
    /* Contenu : texte + enfants jusqu'à la balise fermante. */
    let text = ''
    const children: XmlNode[] = []
    for (;;) {
      const nextTag = src.indexOf('<', i)
      if (nextTag === -1) throw new XmlSyntaxError(`<${tag}> jamais fermé`)
      text += src.slice(i, nextTag)
      i = nextTag
      if (src.startsWith(`</${tag}`, i)) {
        const end = src.indexOf('>', i)
        if (end === -1) throw new XmlSyntaxError(`</${tag}> malformé`)
        const closing = src.slice(i, end + 1)
        if (!/^<\/[\w.:-]+\s*>$/.test(closing) || closing.slice(2, -1).trim() !== tag) {
          throw new XmlSyntaxError(`imbrication invalide : ${closing} ferme <${tag}> de travers`)
        }
        i = end + 1
        return { tag, attrs, children, text }
      }
      children.push(parseElement())
    }
  }

  skipInsignificant()
  const root = parseElement()
  skipInsignificant()
  if (i < n) throw new XmlSyntaxError('contenu superflu après la racine')
  return root
}

function descendants(node: XmlNode, tag: string): XmlNode[] {
  const out: XmlNode[] = []
  for (const c of node.children) {
    if (c.tag === tag) out.push(c)
    out.push(...descendants(c, tag))
  }
  return out
}

/* ---------- 1. Contrôles statiques ---------- */

interface SitemapUrl {
  loc: string
  lastmod: string | null
  alternates: Map<string, string> /* hreflang -> href */
}

function staticChecks(): SitemapUrl[] {
  let raw = ''
  try {
    raw = readFileSync(join(ROOT, 'public', 'sitemap.xml'), 'utf8')
    ok('public/sitemap.xml lisible')
  } catch {
    ko('public/sitemap.xml introuvable')
    return []
  }

  let root: XmlNode
  try {
    root = parseXml(raw)
    ok('XML bien formé (balises équilibrées, attributs cités)')
  } catch (e) {
    ko(`XML mal formé : ${(e as Error).message}`)
    return []
  }

  if (!raw.startsWith('<?xml')) ko('prologue <?xml?> absent')
  else ok('prologue <?xml?> présent')

  if (root.tag !== 'urlset') {
    ko(`racine <${root.tag}> au lieu de <urlset>`)
    return []
  }
  const nsOk = root.attrs.xmlns === 'http://www.sitemaps.org/schemas/sitemap/0.9'
  const xhtmlNs = 'http://www.w3.org/1999/xhtml'
  const xhtmlOk = Object.entries(root.attrs).some(([k, v]) => k === 'xmlns:xhtml' && v === xhtmlNs)
  if (nsOk && xhtmlOk) ok('espaces de noms sitemap 0.9 + xhtml déclarés')
  else ko(`espaces de noms : sitemap ${nsOk ? 'OK' : 'MANQUANT'} · xhtml ${xhtmlOk ? 'OK' : 'MANQUANT'}`)

  const urlNodes = descendants(root, 'url')
  if (urlNodes.length === 0) ko('aucun <url> dans le sitemap')
  else ok(`${urlNodes.length} URL(s) déclarée(s)`)

  const urls: SitemapUrl[] = []
  for (const u of urlNodes) {
    const locNode = u.children.find((c) => c.tag === 'loc')
    const lastmodNode = u.children.find((c) => c.tag === 'lastmod')
    if (!locNode) {
      ko('un <url> sans <loc>')
      continue
    }
    const loc = locNode.text.trim()
    let valid = true
    try {
      const parsed = new URL(loc)
      if (parsed.protocol !== 'https:') {
        ko(`<loc> non https : ${loc}`)
        valid = false
      }
      if (parsed.origin !== SITE_ORIGIN) {
        ko(`<loc> hors domaine officiel (${SITE_ORIGIN}) : ${loc}`)
        valid = false
      }
    } catch {
      ko(`<loc> non parsable : ${loc}`)
      valid = false
    }
    if (valid) ok(`<loc> absolu https sur le domaine : ${loc}`)

    const lastmod = lastmodNode ? lastmodNode.text.trim() : null
    if (lastmod) {
      if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2}))?$/.test(lastmod)) {
        ko(`<lastmod> hors format W3C : ${lastmod}`)
      } else {
        const d = new Date(lastmod)
        if (Number.isNaN(d.getTime())) ko(`<lastmod> invalide : ${lastmod}`)
        else if (d.getTime() > Date.now() + 24 * 3600 * 1000) ko(`<lastmod> dans le futur : ${lastmod}`)
        else ok(`<lastmod> valide : ${lastmod}`)
      }
    } else {
      ko(`<lastmod> absent pour ${loc} (Google s'y fie pour le re-crawl)`)
    }

    const alternates = new Map<string, string>()
    for (const link of u.children.filter((c) => c.tag === 'xhtml:link')) {
      const rel = link.attrs.rel
      const hreflang = link.attrs.hreflang
      const href = link.attrs.href
      if (rel !== 'alternate') {
        ko(`xhtml:link rel="${rel}" inattendu pour ${loc}`)
        continue
      }
      if (!hreflang || !href) {
        ko(`xhtml:link incomplet (hreflang/href) pour ${loc}`)
        continue
      }
      alternates.set(hreflang, href)
    }
    urls.push({ loc, lastmod, alternates })
  }

  /* Réciprocité hreflang : auto-référence + cluster complet + cohérence. */
  const locs = new Set(urls.map((u) => u.loc))
  for (const u of urls) {
    if (u.alternates.size === 0) {
      ko(`aucun hreflang pour ${u.loc}`)
      continue
    }
    if (![...u.alternates.values()].includes(u.loc)) {
      ko(`hreflang sans auto-référence pour ${u.loc}`)
    }
    if (!u.alternates.has('x-default')) {
      ko(`hreflang x-default absent pour ${u.loc}`)
    }
    for (const [lang, href] of u.alternates) {
      if (!locs.has(href)) ko(`hreflang ${lang} → ${href} absent du sitemap (non réciproque)`)
    }
  }
  /* Cohérence : toutes les URLs d'un même cluster partagent le même cluster. */
  const clusterByLoc = new Map<string, Map<string, string>>()
  for (const u of urls) {
    for (const href of u.alternates.values()) {
      const existing = clusterByLoc.get(href)
      if (existing && existing !== u.alternates) {
        let same = existing.size === u.alternates.size
        if (same) {
          for (const [k, v] of existing) if (u.alternates.get(k) !== v) same = false
        }
        if (!same) ko(`clusters hreflang divergents autour de ${href}`)
      } else {
        clusterByLoc.set(href, u.alternates)
      }
    }
  }
  if (urls.length > 0 && !failures.some((f) => f.includes('hreflang'))) {
    ok(`clusters hreflang réciproques et cohérents (${[...(urls[0]?.alternates.keys() ?? [])].join(', ')})`)
  }

  /* robots.txt : directive Sitemap. */
  let robots = ''
  try {
    robots = readFileSync(join(ROOT, 'public', 'robots.txt'), 'utf8')
  } catch {
    ko('public/robots.txt introuvable')
  }
  if (robots) {
    const m = /^Sitemap:\s*(\S+)\s*$/im.exec(robots)
    if (!m) ko('robots.txt sans directive « Sitemap: »')
    else {
      try {
        const u = new URL(m[1])
        if (u.origin === SITE_ORIGIN && u.pathname === '/sitemap.xml') ok(`robots.txt → Sitemap: ${m[1]}`)
        else ko(`directive Sitemap incohérente : ${m[1]} (attendu ${SITE_ORIGIN}/sitemap.xml)`)
      } catch {
        ko(`directive Sitemap non parsable : ${m[1]}`)
      }
    }
  }

  return urls
}

/* ---------- 2. Contrôles live (serveur local) ---------- */

async function liveChecks(urls: SitemapUrl[]): Promise<void> {
  let serverUp = false
  try {
    const res = await fetch(`${LOCAL_ORIGIN}/sitemap.xml`, { redirect: 'manual' })
    serverUp = res.ok
  } catch {
    /* pas de serveur — contrôles live ignorés */
  }
  if (!serverUp) {
    console.log(`\nℹ️  Serveur local injoignable sur ${LOCAL_ORIGIN} — contrôles live ignorés (statique suffisant).`)
    return
  }

  /* Sitemap servi == fichier statique, bon Content-Type. */
  try {
    const res = await fetch(`${LOCAL_ORIGIN}/sitemap.xml`)
    const ct = res.headers.get('content-type') ?? ''
    if (!res.ok) ko(`live /sitemap.xml → HTTP ${res.status}`)
    else if (!ct.includes('xml')) ko(`live /sitemap.xml Content-Type « ${ct} » (application/xml attendu)`)
    else ok('live /sitemap.xml → 200 application/xml')
    const live = await res.text()
    const raw = readFileSync(join(ROOT, 'public', 'sitemap.xml'), 'utf8')
    if (live === raw) ok('sitemap servi octet pour octet identique au fichier statique')
    else ko('sitemap servi DIFFÉRENT du fichier statique public/sitemap.xml')
  } catch (e) {
    ko(`live /sitemap.xml : ${(e as Error).message}`)
  }

  /* Chaque loc : 200, canonical == loc, hreflang HTML == sitemap, index. */
  for (const u of urls) {
    const parsed = new URL(u.loc)
    const localUrl = `${LOCAL_ORIGIN}${parsed.pathname}${parsed.search}`
    try {
      const res = await fetch(localUrl)
      if (!res.ok) {
        ko(`live ${u.loc} → HTTP ${res.status}`)
        continue
      }
      const html = await res.text()
      const canonical = /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?>/.exec(html)?.[1]
      if (canonical === u.loc) ok(`canonical == loc pour ${u.loc}`)
      else ko(`canonical « ${canonical ?? 'ABSENT'} » ≠ loc ${u.loc}`)

      const robotsMeta = /<meta\s+name="robots"\s+content="([^"]*)"/.exec(html)?.[1] ?? ''
      if (/\bindex\b/.test(robotsMeta) && !/\bnoindex\b/.test(robotsMeta)) ok(`robots meta « ${robotsMeta} » pour ${u.loc}`)
      else ko(`robots meta « ${robotsMeta} » (index attendu) pour ${u.loc}`)

      /* hreflang du HTML (Next rend hrefLang — casse normale par le DOM). */
      const htmlAlts = new Map<string, string>()
      for (const m of html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*\/?>/gi)) {
        htmlAlts.set(m[1].toLowerCase(), m[2])
      }
      if (htmlAlts.size === 0) ko(`aucun hreflang dans le HTML de ${u.loc}`)
      else {
        let same = htmlAlts.size === u.alternates.size
        for (const [k, v] of u.alternates) {
          if (htmlAlts.get(k) !== v) same = false
        }
        if (same) ok(`hreflang HTML == sitemap pour ${u.loc}`)
        else ko(`hreflang HTML ≠ sitemap pour ${u.loc} (${[...htmlAlts].map(([k, v]) => `${k}→${v}`).join(', ')})`)
      }
    } catch (e) {
      ko(`live ${u.loc} : ${(e as Error).message}`)
    }
  }

  /* robots.txt servi. */
  try {
    const res = await fetch(`${LOCAL_ORIGIN}/robots.txt`)
    const body = await res.text()
    if (res.ok && /^Sitemap:\s*\S+/im.test(body)) ok('live /robots.txt → 200 avec directive Sitemap')
    else ko(`live /robots.txt → HTTP ${res.status}`)
  } catch (e) {
    ko(`live /robots.txt : ${(e as Error).message}`)
  }
}

/* ---------- Point d'entrée ---------- */

async function main() {
  console.log('🛡️  SITEMAP-CHECK — garde-fou de soumission Google Search Console')
  console.log(`   Domaine officiel : ${SITE_ORIGIN}`)
  console.log('─'.repeat(64))

  const urls = staticChecks()
  await liveChecks(urls)

  console.log('─'.repeat(64))
  for (const w of wins) console.log(`  ✅ ${w}`)
  for (const f of failures) console.log(`  ❌ ${f}`)
  console.log('─'.repeat(64))
  if (failures.length > 0) {
    console.log(`❌ ${failures.length} problème(s) — NE SOUMETTEZ PAS ce sitemap à Search Console.`)
    process.exit(1)
  }
  const urlCount = urls.length || '—'
  console.log(`✅ SITEMAP ROBUSTE — ${urlCount} URL(s), prêt pour la soumission Search Console :`)
  console.log(`     ${SITE_ORIGIN}/sitemap.xml`)
}

main().catch((e) => {
  console.error('Erreur inattendue :', e)
  process.exit(1)
})
