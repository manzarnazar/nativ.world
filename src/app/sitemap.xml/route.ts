import { NextResponse } from "next/server";

const BASE_URL = (
  process.env.NEXT_PUBLIC_WEB_URL || "https://estay-web.wrteam.me"
).replace(/\/$/, "");
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://estay.wrteam.me"
).replace(/\/$/, "");
const END_POINT = (process.env.NEXT_PUBLIC_END_POINT || "api").replace(/^\//, "");
const apiUrl = (path: string) => `${API_URL}/${END_POINT}/${path}`;

const DEFAULT_LANG = "en";
const REVALIDATE = 3600;

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE },
      headers: { Accept: "application/json", "Accept-Language": DEFAULT_LANG },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.error) return null;
    return json as T;
  } catch {
    return null;
  }
}

interface PaginatedResponse<T> {
  data: { items: T[]; pagination: { has_more: boolean } };
}

async function fetchAllSlugs(
  endpoint: string,
  extraParams: Record<string, string> = {}
): Promise<string[]> {
  const slugs: string[] = [];
  const limit = 50;
  let offset = 0;
  const params = new URLSearchParams({ limit: String(limit), ...extraParams });

  while (true) {
    params.set("offset", String(offset));
    const data = await fetchJson<PaginatedResponse<{ slug: string }>>(
      `${apiUrl(endpoint)}?${params}`
    );
    const items = data?.data?.items ?? [];
    if (!items.length) break;
    for (const item of items) {
      if (item.slug) slugs.push(item.slug);
    }
    if (!data?.data?.pagination?.has_more) break;
    offset += limit;
  }

  return slugs;
}

async function getLanguageCodes(): Promise<string[]> {
  const data = await fetchJson<{
    data: { languages: { code: string }[] };
  }>(apiUrl("settings"));
  const langs = data?.data?.languages ?? [];
  return langs.length ? langs.map((l) => l.code).filter(Boolean) : [DEFAULT_LANG];
}

async function getPropertySlugs(): Promise<string[]> {
  return fetchAllSlugs("properties");
}

async function getRoomSlugs(propertySlugs: string[]): Promise<string[]> {
  const results = await Promise.all(
    propertySlugs.map((slug) =>
      fetchAllSlugs("properties/rooms", { property_slug: slug })
    )
  );
  return results.flat();
}

async function getBlogSlugs(): Promise<string[]> {
  return fetchAllSlugs("blogs");
}

interface RouteConfig {
  route: string;
  changefreq: string;
  priority: number;
}

const STATIC_ROUTES: RouteConfig[] = [
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

function urlFor(langCode: string, route: string): string {
  return `${BASE_URL}/${langCode}${route ? `/${route}` : ""}`;
}

function buildUrlEntry(
  route: string,
  langCodes: string[],
  changefreq: string,
  priority: number
): string {
  return langCodes
    .map((code) => {
      const loc = urlFor(code, route);
      const alternates = langCodes
        .map(
          (lc) =>
            `    <xhtml:link rel="alternate" hreflang="${lc}" href="${urlFor(lc, route)}"/>`
        )
        .join("\n");
      return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
  </url>`;
    })
    .join("\n");
}

export async function GET(): Promise<NextResponse> {
  const [langCodes, propertySlugs] = await Promise.all([
    getLanguageCodes(),
    getPropertySlugs(),
  ]);

  const [roomSlugs, blogSlugs] = await Promise.all([
    getRoomSlugs(propertySlugs),
    getBlogSlugs(),
  ]);

  const dynamicRoutes: RouteConfig[] = [
    ...propertySlugs.map((s) => ({ route: `properties/${s}`, changefreq: "daily",  priority: 0.9 })),
    ...roomSlugs.map((s)     => ({ route: `rooms/${s}`,      changefreq: "daily",  priority: 0.9 })),
    ...blogSlugs.map((s)     => ({ route: `blogs/${s}`,      changefreq: "weekly", priority: 0.7 })),
  ];

  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];

  const urlEntries = allRoutes
    .map(({ route, changefreq, priority }) =>
      buildUrlEntry(route, langCodes, changefreq, priority)
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urlEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, s-maxage=${REVALIDATE}, stale-while-revalidate`,
    },
  });
}
