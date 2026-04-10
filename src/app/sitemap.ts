import { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const publicRoutes = [
    '',
    '/about',
    '/pricing',
    '/contact',
    '/hub',
    '/hub/adult',
    '/hub/childrens',
    '/hub/glossary',
    '/hub/questions',
    '/osce',
    '/quiz',
    '/privacy',
    '/terms',
    '/how-to-use',
  ];
  const hubResourceRoutes = [
    '/hub/resources/9-rights-medication',
    '/hub/resources/ae-assessment',
    '/hub/resources/ae-assessment-guide',
    '/hub/resources/brain-nervous-system',
    '/hub/resources/cardiovascular-system',
    '/hub/resources/cell-biology',
    '/hub/resources/drug-calculations-cheat-sheet',
    '/hub/resources/glossary-terms',
    '/hub/resources/im-sc-injection',
    '/hub/resources/medication-abbreviations',
    '/hub/resources/ng-tube-insertion',
    '/hub/resources/paeds-vital-signs-cheat-sheet',
    '/hub/resources/palliative-care-adult',
    '/hub/resources/palliative-care-children',
    '/hub/resources/placement-survival',
    '/hub/resources/renal-system',
    '/hub/resources/respiratory-system',
    '/hub/resources/theories-of-development',
    '/hub/resources/y1-anatomy-physiology',
    '/hub/resources/y1-documentation',
    '/hub/resources/y1-infection-control',
    '/hub/resources/y1-paeds-medications',
    '/hub/resources/y1-professionalism-ethics',
  ];

  const staticPages: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency:
      route === ''
        ? 'weekly'
        : route.startsWith('/hub')
          ? 'weekly'
          : 'monthly',
    priority:
      route === ''
        ? 1
        : route === '/pricing'
          ? 0.95
          : route === '/hub/childrens' || route === '/osce' || route === '/quiz'
            ? 0.9
            : 0.8,
  }));

  const hubPages: MetadataRoute.Sitemap = hubResourceRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.78,
  }));

  return [...staticPages, ...hubPages];
}
