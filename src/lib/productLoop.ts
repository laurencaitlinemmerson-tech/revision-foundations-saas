import { getCatalogItem } from '@/lib/bookmarks/catalog';

export interface LoopAction {
  href: string;
  label: string;
  description: string;
}

export interface LoopGuideCard {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

const resourceTopicOverrides: Record<string, { quizTopic?: string; osceTopic?: string }> = {
  'ae-assessment-guide': { quizTopic: 'respiratory', osceTopic: 'respiratory' },
  'drug-calculations-cheat-sheet': { quizTopic: 'numeracy', osceTopic: 'medication' },
  '9-rights-medication': { quizTopic: 'numeracy', osceTopic: 'medication' },
  'medication-abbreviations': { quizTopic: 'numeracy', osceTopic: 'medication' },
  'im-sc-injection': { osceTopic: 'injection' },
  'ng-tube-insertion': { osceTopic: 'ngtubes' },
  'paeds-vital-signs-cheat-sheet': { quizTopic: 'respiratory', osceTopic: 'deteriorating' },
  'respiratory-system': { quizTopic: 'respiratory', osceTopic: 'respiratory' },
  'cardiovascular-system': { quizTopic: 'cardiovascular', osceTopic: 'circulation' },
  'renal-system': { quizTopic: 'renal' },
  'y1-infection-control': { quizTopic: 'hospitalPrep', osceTopic: 'handwashing' },
  'y1-child-communication': { osceTopic: 'communication' },
  'palliative-care-children': { osceTopic: 'communication' },
  'y1-pain-assessment': { osceTopic: 'pain' },
  'y1-paeds-medications': { quizTopic: 'numeracy', osceTopic: 'medication' },
};

function buildQuizHref(topic: string, fromSlug?: string) {
  const params = new URLSearchParams({ topic });
  if (fromSlug) params.set('from', fromSlug);
  return `/quiz?${params.toString()}`;
}

function buildOsceHref(topic: string, fromSlug?: string) {
  const params = new URLSearchParams({ topic, mode: 'osce' });
  if (fromSlug) params.set('from', fromSlug);
  return `/osce?${params.toString()}`;
}

function inferTopicsFromTags(tags: string[] = []) {
  const joined = tags.join(' ');

  const quizTopic =
    tags.includes('Meds & Calculations') ? 'numeracy'
    : tags.includes('Fluids & Electrolytes') ? 'fluidsElectrolytes'
    : tags.includes('Assessment') || tags.includes('Emergency/ABCDE') ? 'respiratory'
    : tags.includes('Revision Plans') ? 'cellBiology'
    : undefined;

  const osceTopic =
    tags.includes('OSCE') && tags.includes('Meds & Calculations') ? 'medication'
    : joined.includes('Clinical Skills') ? 'injection'
    : tags.includes('Assessment') || tags.includes('Emergency/ABCDE') ? 'respiratory'
    : tags.includes('Communication') ? 'communication'
    : tags.includes('Placement') && tags.includes('OSCE') ? 'deteriorating'
    : undefined;

  return { quizTopic, osceTopic };
}

export function getResourceLoopActions(slug: string, tags: string[] = []) {
  const override = resourceTopicOverrides[slug] ?? {};
  const inferred = inferTopicsFromTags(tags);
  const quizTopic = override.quizTopic ?? inferred.quizTopic;
  const osceTopic = override.osceTopic ?? inferred.osceTopic;

  const actions: { quiz?: LoopAction; osce?: LoopAction } = {};

  if (quizTopic) {
    actions.quiz = {
      href: buildQuizHref(quizTopic, slug),
      label: 'Open the matching quiz block',
      description: 'Turn this page into active recall while the details are still fresh.',
    };
  }

  if (osceTopic) {
    actions.osce = {
      href: buildOsceHref(osceTopic, slug),
      label: 'Practise the matching OSCE topic',
      description: 'Use the same topic in a more spoken, checklist-based format.',
    };
  }

  return actions;
}

export function getGuideCardFromSlug(slug: string | null | undefined): LoopGuideCard | null {
  if (!slug) return null;
  const guide = getCatalogItem(slug);
  if (!guide) return null;

  return {
    eyebrow: 'From the hub',
    title: guide.title,
    description: 'Keep the matching guide nearby while you practise, then come back to it for the exact gap you noticed.',
    href: guide.href,
    cta: 'Open guide',
  };
}

export function getQuizLoopCards(fromSlug?: string | null): LoopGuideCard[] {
  const cards: LoopGuideCard[] = [];
  const fromGuide = getGuideCardFromSlug(fromSlug);
  if (fromGuide) cards.push(fromGuide);

  cards.push(
    {
      eyebrow: 'Pair with guide',
      title: 'Drug Calculations Cheat Sheet',
      description: 'Use the quiz for quick checking, then return to the worked formulas when you hit a slower question.',
      href: '/hub/resources/drug-calculations-cheat-sheet',
      cta: 'Read cheat sheet',
    },
    {
      eyebrow: 'Pair with guide',
      title: 'A–E Assessment Framework',
      description: 'Use the quiz to tighten recall, then read the A–E guide for the structure behind the answers.',
      href: '/hub/resources/ae-assessment-guide',
      cta: 'Open A–E guide',
    },
    {
      eyebrow: 'Switch format',
      title: 'Move into OSCE practice',
      description: 'Once the recall is steadier, say it out loud in the OSCE tool so the wording feels more natural under pressure.',
      href: '/osce',
      cta: 'Open OSCE tool',
    },
  );

  return cards.slice(0, 3);
}

export function getOsceLoopCards(fromSlug?: string | null): LoopGuideCard[] {
  const cards: LoopGuideCard[] = [];
  const fromGuide = getGuideCardFromSlug(fromSlug);
  if (fromGuide) cards.push(fromGuide);

  cards.push(
    {
      eyebrow: 'Pair with guide',
      title: 'A–E Assessment Framework',
      description: 'Keep the clinical order in view, then use the OSCE tool to practise saying it clearly and safely.',
      href: '/hub/resources/ae-assessment-guide',
      cta: 'Read A–E guide',
    },
    {
      eyebrow: 'Pair with guide',
      title: 'IM & SC Injections',
      description: 'Use the guide for the exact steps and safety checks, then come back to rehearse them aloud.',
      href: '/hub/resources/im-sc-injection',
      cta: 'Open injection guide',
    },
    {
      eyebrow: 'Switch format',
      title: 'Back up the station with quiz recall',
      description: 'If the station felt wobbly, a short quiz block is the quickest way to clean up the knowledge underneath it.',
      href: '/quiz',
      cta: 'Open core quiz',
    },
  );

  return cards.slice(0, 3);
}
