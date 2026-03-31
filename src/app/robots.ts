import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nurselab.co.uk';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/account/',
          '/checkout/',
          '/success/',
          '/_next/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
