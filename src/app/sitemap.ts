import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://revisionfoundations.com';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/pricing',
    '/contact',
    '/hub',
    '/osce',
    '/quiz',
    '/privacy',
    '/terms',
    '/how-to-use',
    '/sign-in',
    '/sign-up',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: (route === '' ? 'weekly' : 'monthly') as ChangeFrequency,
    priority: route === '' ? 1 : route === '/pricing' ? 0.9 : 0.8,
  }));

  // Hub resource pages (add more as needed)
  const hubPages: MetadataRoute.Sitemap = [
    '/hub/glossary',
    '/hub/questions',
    '/hub/resources/9-rights-medication',
    '/hub/resources/drug-calculations-cheat-sheet',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.7,
  }));

  return [...staticPages, ...hubPages];
}
