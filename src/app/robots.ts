import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://revisionfoundations.com';

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
