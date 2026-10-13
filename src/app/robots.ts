import type { MetadataRoute } from 'next';

/**
 * Generates the robots.txt content for search engines
 * This helps search engines understand which parts of the site they can access
 * @returns MetadataRoute.Robots - The robots.txt configuration in Next.js format
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || '';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/private/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/no-google/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
