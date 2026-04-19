import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata, getArticleSchema, siteUrl } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Neurodivergent Revision Guide',
  description:
    'A practical, low-pressure guide to revising for nursing exams and OSCEs with ADHD, AuDHD, autism, dyslexia, dyspraxia, dyscalculia, anxiety, or any mix of neurodivergent traits. Smaller sessions, clearer structure, less burnout.',
  path: '/neurodivergent-guide',
  image: `${siteUrl}/og-image.png`,
});

export default function NeurodivergentGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={getArticleSchema({
          headline: 'Neurodivergent Revision Guide',
          description:
            'A practical, low-pressure guide to revising for nursing exams and OSCEs with ADHD, AuDHD, autism, dyslexia, dyspraxia, dyscalculia, anxiety, or any mix of neurodivergent traits.',
          path: '/neurodivergent-guide',
          image: `${siteUrl}/og-image.png`,
          keywords: [
            'nursing revision ADHD',
            'nursing revision AuDHD',
            'AuDHD revision strategies',
            'nursing revision autism',
            'autistic student nurse study tips',
            'dyslexia study guide nursing',
            'dyspraxia study tips nursing',
            'dyscalculia drug calculations nursing',
            'anxiety exam revision nursing',
            'nursing OSCE neurodivergent',
            'student nurse neurodivergent revision',
            'reasonable adjustments nursing university',
            'DSA nursing students UK',
            'Disabled Students Allowance nursing',
          ],
        })}
      />
      {children}
    </>
  );
}
