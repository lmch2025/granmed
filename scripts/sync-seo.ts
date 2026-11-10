#!/usr/bin/env bun
import { syncSeoFiles } from "../src/lib/blog/sync-seo-files";

const res = syncSeoFiles(process.cwd());
console.log(`✅ SEO Files Synced: ${res.sitemapUrlCount} URLs in sitemap.xml, ${res.blogArticleCount} articles in llms.txt & llms-full.txt`);
