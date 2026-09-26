import { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';
import { blogPosts } from '@/lib/blog';

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
    '/study-skills',
    '/how-to-use',
    '/neurodivergent-guide',
    '/blog',
    ...blogPosts.map((post) => post.href),
  ];
  const hubResourceRoutes = [
    '/hub/resources/9-rights-medication',
    '/hub/resources/ae-assessment',
    '/hub/resources/ae-assessment-guide',
    '/hub/resources/brain-nervous-system',
    '/hub/resources/cardiovascular-system',
    '/hub/resources/congenital-heart-disease',
    '/hub/resources/cell-biology',
    '/hub/resources/disability-assessment-neuro-observations',
    '/hub/resources/drug-calculations-cheat-sheet',
    '/hub/resources/ecg-cardiac-conduction',
    '/hub/resources/endocrine-system',
    '/hub/resources/fluids-electrolytes-homeostasis',
    '/hub/resources/glossary-terms',
    '/hub/resources/im-sc-injection',
    '/hub/resources/medication-abbreviations',
    '/hub/resources/musculoskeletal-system',
    '/hub/resources/ng-tube-insertion',
    '/hub/resources/paediatric-respiratory-conditions',
    '/hub/resources/paeds-vital-signs-cheat-sheet',
    '/hub/resources/palliative-care-adult',
    '/hub/resources/palliative-care-children',
    '/hub/resources/placement-survival',
    '/hub/resources/renal-system',
    '/hub/resources/shock-recognition-management',
    '/hub/resources/respiratory-system',
    '/hub/resources/theories-of-development',
    '/hub/resources/tracheostomy-care',
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
