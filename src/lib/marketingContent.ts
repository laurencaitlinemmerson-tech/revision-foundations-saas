export type AccessOptionId = 'free' | 'osce' | 'quiz' | 'bundle';

export interface AccessOption {
  id: AccessOptionId;
  label: string;
  title: string;
  price: string;
  summary: string;
  bestFor: string;
  highlights: string[];
  href: string;
  cta: string;
}

export interface AccessComparisonRow {
  feature: string;
  values: Record<AccessOptionId, string>;
}

export const accessOptions: AccessOption[] = [
  {
    id: 'free',
    label: 'Start free',
    title: 'Free Hub',
    price: '£0',
    summary:
      'Open the free practical pages first if you want to check the tone, layout, and clinical usefulness before paying.',
    bestFor:
      'Placement refreshers, browsing, and deciding whether the site fits your revision style.',
    highlights: [
      'Free practical guides',
      'No account needed to browse',
      'Best first click if you are unsure',
    ],
    href: '/hub/childrens',
    cta: 'Browse free hub',
  },
  {
    id: 'osce',
    label: 'Focused',
    title: 'OSCE Tool',
    price: '£4.99',
    summary:
      'Paediatric station practice with timed runs, checklists, and calmer structure when OSCE prep is your loudest problem.',
    bestFor:
      'Students who mainly need station reps, spoken structure, and checklist-based practice.',
    highlights: ['50+ paediatric stations', 'Timed mode', 'Marking checklists'],
    href: '/osce',
    cta: 'Explore OSCE tool',
  },
  {
    id: 'quiz',
    label: 'Focused',
    title: 'Core Quiz',
    price: '£4.99',
    summary:
      'Question-based revision with instant feedback across high-yield topics like calculations, observations, and core theory.',
    bestFor:
      'Students who revise best through active recall and need weak topics to show up quickly.',
    highlights: ['17 core topics', 'Instant feedback', 'Good for short revision blocks'],
    href: '/quiz',
    cta: 'Explore quiz',
  },
  {
    id: 'bundle',
    label: 'Most complete',
    title: "Children's Bundle",
    price: '£9.99',
    summary:
      'The fullest route right now, bringing together paediatric OSCE practice, quiz revision, and the revision hub in one place.',
    bestFor:
      'Students who want one calmer setup for placement, OSCE prep, and theory revision together.',
    highlights: ['OSCE + quiz + hub', 'One payment', 'All future updates included'],
    href: '/pricing',
    cta: 'See the bundle',
  },
];

export const accessComparisonRows: AccessComparisonRow[] = [
  {
    feature: 'Payment',
    values: {
      free: 'Free',
      osce: 'One payment',
      quiz: 'One payment',
      bundle: 'One payment',
    },
  },
  {
    feature: 'Try before you buy',
    values: {
      free: 'Free pages live now',
      osce: 'Preview available',
      quiz: 'Preview available',
      bundle: 'Browse every route first',
    },
  },
  {
    feature: 'Paediatric OSCE practice',
    values: {
      free: '-',
      osce: '50+ stations',
      quiz: '-',
      bundle: '50+ stations',
    },
  },
  {
    feature: 'Question-based revision',
    values: {
      free: '-',
      osce: '-',
      quiz: '17 topics',
      bundle: '17 topics',
    },
  },
  {
    feature: 'Revision hub access',
    values: {
      free: 'Selected free pages',
      osce: '-',
      quiz: '-',
      bundle: 'Full hub + updates',
    },
  },
  {
    feature: 'Best for',
    values: {
      free: 'Placement refreshers',
      osce: 'Station practice',
      quiz: 'Active recall',
      bundle: 'Full revision setup',
    },
  },
];
