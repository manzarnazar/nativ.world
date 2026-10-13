#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const BASE_URL = (process.env.NEXT_PUBLIC_WEB_URL || "https://estay-web.wrteam.me").replace(/\/$/, "");
const API_URL  = (process.env.NEXT_PUBLIC_API_URL  || "https://estay.wrteam.me").replace(/\/$/, "");
const END_POINT = (process.env.NEXT_PUBLIC_END_POINT || "api").replace(/^\//, "");
const apiUrl = (path) => `${API_URL}/${END_POINT}/${path}`;

const DEFAULT_LANG = "en";

async function fetchJson(url) {
  try {
    const res = await fetch(url, { headers: { Accept: "application/json", "Accept-Language": DEFAULT_LANG } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.error ? null : json;
  } catch { return null; }
}

async function fetchAllSlugs(endpoint, extraParams = {}) {
  const slugs = [];
  const limit = 50;
  let offset = 0;
  const params = new URLSearchParams({ limit: String(limit), ...extraParams });
  while (true) {
    params.set("offset", String(offset));
    const data = await fetchJson(`${apiUrl(endpoint)}?${params}`);
    const items = data?.data?.items ?? [];
    if (!items.length) break;
    for (const item of items) if (item.slug) slugs.push(item.slug);
    if (!data?.data?.pagination?.has_more) break;
    offset += limit;
  }
  return slugs;
}

async function getLangCodes() {
  const data = await fetchJson(apiUrl("settings"));
  const langs = data?.data?.languages ?? [];
  return langs.length ? langs.map((l) => l.code).filter(Boolean) : [DEFAULT_LANG];
}

function urlFor(lang, route) {
  return `${BASE_URL}/${lang}${route ? `/${route}` : ""}`;
}

function buildEntry(route, langCodes, changefreq, priority) {
  return langCodes.map((code) => {
    const loc = urlFor(code, route);
    const alts = langCodes.map((lc) =>
      `    <xhtml:link rel="alternate" hreflang="${lc}" href="${urlFor(lc, route)}"/>`
    ).join("\n");
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n${alts}\n  </url>`;
  }).join("\n");
}

const STATIC_ROUTES = [
  { route: "",                     changefreq: "daily",  priority: 1.0 },
  { route: "about-us",             changefreq: "weekly", priority: 0.8 },
  { route: "contact-us",           changefreq: "weekly", priority: 0.8 },
  { route: "gallery",              changefreq: "weekly", priority: 0.7 },
  { route: "blogs",                changefreq: "daily",  priority: 0.9 },
  { route: "properties",           changefreq: "daily",  priority: 0.9 },
  { route: "rooms",                changefreq: "daily",  priority: 0.9 },
  { route: "help-support",         changefreq: "weekly", priority: 0.7 },
  { route: "help-support/faqs",    changefreq: "weekly", priority: 0.7 },
  { route: "cancellation-refunds", changefreq: "weekly", priority: 0.6 },
  { route: "platform-policy",      changefreq: "weekly", priority: 0.6 },
  { route: "privacy-policy",       changefreq: "weekly", priority: 0.6 },
  { route: "terms-conditions",     changefreq: "weekly", priority: 0.6 },
];

(async () => {
  console.log("→ Generating sitemap...");
  console.log(`  BASE_URL: ${BASE_URL}`);

  const [langCodes, propertySlugs] = await Promise.all([getLangCodes(), fetchAllSlugs("properties")]);
  const [roomSlugs, blogSlugs] = await Promise.all([
    Promise.all(propertySlugs.map((s) => fetchAllSlugs("properties/rooms", { property_slug: s }))).then((r) => r.flat()),
    fetchAllSlugs("blogs"),
  ]);

  const dynamicRoutes = [
    ...propertySlugs.map((s) => ({ route: `properties/${s}`, changefreq: "daily",  priority: 0.9 })),
    ...roomSlugs.map((s)     => ({ route: `rooms/${s}`,      changefreq: "daily",  priority: 0.9 })),
    ...blogSlugs.map((s)     => ({ route: `blogs/${s}`,      changefreq: "weekly", priority: 0.7 })),
  ];

  const entries = [...STATIC_ROUTES, ...dynamicRoutes]
    .map(({ route, changefreq, priority }) => buildEntry(route, langCodes, changefreq, priority))
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${entries}
</urlset>`;

  const outPath = join(ROOT, "public", "sitemap.xml");
  mkdirSync(join(ROOT, "public"), { recursive: true });
  writeFileSync(outPath, xml, "utf-8");
  console.log(`✓ Sitemap written → public/sitemap.xml (${propertySlugs.length} properties, ${roomSlugs.length} rooms, ${blogSlugs.length} blogs)`);
})();
