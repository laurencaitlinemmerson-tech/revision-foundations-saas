/** Keys of the shared semantic palette in globals.css (-50 / -600 / -800 trios). */
export type BlogAccent = 'purple' | 'teal' | 'coral' | 'blue' | 'amber' | 'sage';

export interface AccentTokens {
  tint: string;
  mid: string;
  deep: string;
}

/** Each accent resolves to tokens that already have light and dark values. */
export const blogAccents: Record<BlogAccent, AccentTokens> = {
  purple: { tint: 'var(--purple-50)', mid: 'var(--purple-600)', deep: 'var(--purple-800)' },
  teal: { tint: 'var(--teal-50)', mid: 'var(--teal-600)', deep: 'var(--teal-800)' },
  coral: { tint: 'var(--coral-50)', mid: 'var(--coral-600)', deep: 'var(--coral-800)' },
  blue: { tint: 'var(--blue-50)', mid: 'var(--blue-600)', deep: 'var(--blue-800)' },
  amber: { tint: 'var(--amber-50)', mid: 'var(--amber-600)', deep: 'var(--amber-800)' },
  sage: { tint: 'var(--sage-50)', mid: 'var(--sage-600)', deep: 'var(--sage-800)' },
};

export interface BlogPost {
  slug: string;
  href: string;
  kicker: string;
  title: string;
  excerpt: string;
  /** ISO date, used for schema.org and sorting. */
  date: string;
  /** Human date shown on the page. */
  dateLabel: string;
  readingTime: string;
  tags: string[];
  /** Colour the post is keyed to across the index card and the article. */
  accent: BlogAccent;
}

/** Newest first — the index renders them in this order. */
export const blogPosts: BlogPost[] = [
  {
    slug: '10-things-first-year',
    href: '/blog/10-things-first-year',
    kicker: 'First Year',
    title: '10 Things You Should Know as a First Year',
    excerpt:
      'The things nobody puts in the handbook: hours, your PAD, drug calculations, and why attendance is the one thing you cannot claw back later.',
    date: '2026-09-01',
    dateLabel: '1 September 2026',
    readingTime: '7 min read',
    tags: ['First year', 'Placement', 'Practice hours', 'Getting started'],
    accent: 'purple',
  },
  {
    slug: 'wellness-during-placement',
    href: '/blog/wellness-during-placement',
    kicker: 'Placement',
    title: 'Wellness During My Haem/Onc Placement',
    excerpt:
      'How meal prep, ten-minute walks and a few boundaries got me through an emotionally heavy placement without running myself into the ground.',
    date: '2026-04-19',
    dateLabel: '19 April 2026',
    readingTime: '5 min read',
    tags: ['Placement', 'Burnout', 'Meal prep', 'Self-care'],
    accent: 'teal',
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
