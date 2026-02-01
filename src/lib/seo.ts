import type { Metadata } from 'next';

// Base URL for the site
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://revisionfoundations.com';

// Default SEO configuration
export const defaultSEO = {
  siteName: 'Revision Foundations',
  title: 'Revision Foundations - Your Nursing Bestie for OSCEs & Exams',
  description: 'Interactive OSCE practice, core nursing quizzes, and study resources for UK nursing students. Pass your nursing exams with confidence.',
  locale: 'en_GB',
  type: 'website',
} as const;

// JSON-LD structured data for organization
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Revision Foundations',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: defaultSEO.description,
    founder: {
      '@type': 'Person',
      name: 'Lauren',
    },
    sameAs: [],
  };
}

// JSON-LD structured data for educational website
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Revision Foundations',
    url: siteUrl,
    description: defaultSEO.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/hub?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// JSON-LD for educational course
export function getCourseSchema(courseName: string, description: string, price: string = '4.99') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: courseName,
    description,
    provider: {
      '@type': 'Organization',
      name: 'Revision Foundations',
      url: siteUrl,
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
    },
  };
}

// JSON-LD for FAQ page
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// JSON-LD for product (the subscription/access)
export function getProductSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Revision Foundations Pro Access',
    description: 'Lifetime access to all nursing study resources, OSCE tools, and quizzes.',
    brand: {
      '@type': 'Brand',
      name: 'Revision Foundations',
    },
    offers: {
      '@type': 'Offer',
      price: '4.99',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2027-12-31',
    },
  };
}

// Generate metadata for pages
export function generatePageMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteUrl}${path}`;
  const ogImage = image || `${siteUrl}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: defaultSEO.siteName,
      locale: defaultSEO.locale,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  };
}

// Breadcrumb schema generator
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}
