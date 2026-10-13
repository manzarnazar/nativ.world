import type { Metadata } from "next";

interface GenerateMetaInfoParams {
    page: string;
    language_code?: string;
    fallbackTitle?: string;
    fallbackDescription?: string;
    fallbackKeywords?: string;
}

interface GetSchemaMarkupParams {
    page: string;
    language_code?: string;
}

const PAGE_TYPES = [
    "home",
    "hotels",
    "rooms",
    "gallery",
    "about-us",
    "contact-us",
    "help-support",
    "help-support-faq",
    "blogs",
    "list-property"
];

async function fetchSeoPage(type: string) {
    const base = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}`;
    const res = await fetch(`${base}/get-seo-pages?type=${type}`, {
        // headers: { "Accept-Language": language_code },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.error || !json.data?.data?.length) return null;
    return json.data.data[0];
}

export async function generateMetaInfo(params: GenerateMetaInfoParams): Promise<Metadata> {
    const {
        page,
        language_code = "en",
        fallbackTitle = process.env.NEXT_PUBLIC_TITLE,
        fallbackDescription = process.env.NEXT_PUBLIC_DESCRIPTION,
        fallbackKeywords = process.env.NEXT_PUBLIC_KEYWORDS,
    } = params;

    const pageType = PAGE_TYPES.includes(page) ? page : "home";

    const canonical = pageType === 'home' ? `${process.env.NEXT_PUBLIC_WEB_URL}/${language_code}` : `${process.env.NEXT_PUBLIC_WEB_URL}/${language_code}/${pageType === 'hotels' ? 'properties' : pageType === 'help-support-faq' ? 'help-support/faqs' : pageType}`;


    const fallback: Metadata = {
        title: fallbackTitle,
        description: fallbackDescription,
        keywords: fallbackKeywords,
        openGraph: {
            title: fallbackTitle,
            description: fallbackDescription,
            type: "website",
            siteName: process.env.NEXT_PUBLIC_WEB_NAME,
        },
        twitter: {
            card: "summary_large_image",
            title: fallbackTitle,
            description: fallbackDescription,
        },
        robots: { index: true, follow: true },
        alternates: { canonical },
    };

    try {
        const seo = await fetchSeoPage(page);
        if (!seo) return fallback;

        const ogImage = seo.og_image

        return {
            title: seo.meta_title || fallbackTitle,
            description: seo.meta_description || fallbackDescription,
            keywords: seo.meta_keyword || fallbackKeywords,
            openGraph: {
                title: seo.meta_title || fallbackTitle,
                description: seo.meta_description || fallbackDescription,
                images: ogImage,
                type: "website",
                siteName: process.env.NEXT_PUBLIC_WEB_NAME,
            },
            twitter: {
                card: "summary_large_image",
                title: seo.meta_title || fallbackTitle,
                description: seo.meta_description || fallbackDescription,
                images: ogImage,
            },
            robots: { index: true, follow: true },
            alternates: { canonical },
        };
    } catch (error) {
        console.error(`generateMetaInfo error for "${page}":`, error);
        return fallback;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSchemaMarkup(params: GetSchemaMarkupParams): Promise<Record<string, any> | null> {
    const { page } = params;
    try {
        const seo = await fetchSeoPage(page);
        if (!seo?.schema_markup) return null;
        try {
            return JSON.parse(seo.schema_markup);
        } catch {
            return null;
        }
    } catch (error) {
        console.error(`getSchemaMarkup error for "${page}":`, error);
        return null;
    }
}
