/**
 * GRANMED.STORE — Synchronisation Automatique Google Search Console via OAuth2
 * Soumet https://www.granmed.store/sitemap.xml et inspecte les nouvelles routes /fr/blog/[slug] et /en/blog/[slug].
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const TOKEN_PATH = "C:\\Users\\Administrateur\\Documents\\project\\Blogger\\token_gsc.json";
const SITE_URL = "https://www.granmed.store";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

function httpsRequest(url, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = https.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : {} });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on("error", (e) => reject(e));
    if (postData) req.write(postData);
    req.end();
  });
}

async function getAccessToken(tokenData) {
  const postData = new URLSearchParams({
    client_id: tokenData.client_id,
    client_secret: tokenData.client_secret,
    refresh_token: tokenData.refresh_token,
    grant_type: "refresh_token",
  }).toString();

  const res = await httpsRequest(
    tokenData.token_uri || "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    },
    postData
  );

  if (res.status !== 200 || !res.data.access_token) {
    throw new Error(`Échec du rafraîchissement du token OAuth : ${JSON.stringify(res.data)}`);
  }
  return res.data.access_token;
}

async function main() {
  console.log("=== GRANMED.STORE — GOOGLE SEARCH CONSOLE API SYNC ===");

  if (!fs.existsSync(TOKEN_PATH)) {
    console.log(`⚠️ Token OAuth GSC absent (${TOKEN_PATH}) — synchronisation GSC ignorée en local.`);
    return;
  }

  const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
  const accessToken = await getAccessToken(tokenData);
  console.log("✅ Token OAuth2 GSC rafraîchi avec succès.");

  const sitesRes = await httpsRequest(
    "https://www.googleapis.com/webmasters/v3/sites",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const sites = (sitesRes.data.siteEntry || []).map((s) => s.siteUrl);
  let targetSite = sites.find((s) => s.includes("granmed.store"));

  if (!targetSite) {
    targetSite = "https://www.granmed.store/";
    await httpsRequest(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(targetSite)}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Length": "0" },
      }
    );
  }

  const submitUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(targetSite)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`;
  const submitRes = await httpsRequest(submitUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Length": "0" },
  });

  if (submitRes.status === 200 || submitRes.status === 204) {
    console.log(`✅ Sitemap soumis avec succès : ${SITEMAP_URL}`);
  } else {
    console.log(`ℹ️ Statut soumission Sitemap (${submitRes.status}) :`, JSON.stringify(submitRes.data));
  }

  // Ping / Inspection des dernières URLs de blog
  const sitemapPath = path.join(__dirname, "../public/sitemap.xml");
  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, "utf-8");
    const blogUrls = [...xml.matchAll(/<loc>(https:\/\/www\.granmed\.store\/(?:fr|en)\/blog\/[^<]+)<\/loc>/g)]
      .map((m) => m[1])
      .slice(0, 6);

    console.log(`🔍 Inspection GSC des ${blogUrls.length} dernières URLs de blog...`);
    for (const url of blogUrls) {
      const postBody = JSON.stringify({
        inspectionUrl: url,
        siteUrl: targetSite,
        languageCode: url.includes("/fr/") ? "fr-FR" : "en-US",
      });
      const inspectRes = await httpsRequest(
        "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postBody),
          },
        },
        postBody
      );
      if (inspectRes.status === 200) {
        const verdict =
          inspectRes.data?.inspectionResult?.indexStatusResult?.verdict || "CHECKED";
        console.log(`  ✅ [${verdict}] ${url}`);
      } else {
        console.log(`  ℹ️ [${inspectRes.status}] ${url}`);
      }
    }
  }
}

main().catch((err) => {
  console.warn("⚠️ Avertissement GSC Sync :", err.message);
});
