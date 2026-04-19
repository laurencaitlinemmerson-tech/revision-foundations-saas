export interface StudySkillsGuide {
  id: string;
  href: string;
  kicker: string;
  title: string;
  description: string;
  bestFor: string;
  tags: string[];
}

export const studySkillsGuides: StudySkillsGuide[] = [
  {
    id: 'how-to-use',
    href: '/how-to-use',
    kicker: 'Getting Started',
    title: 'How to Use The Nurse Lab',
    description:
      'A calmer way to use the quiz, OSCE tool, and hub without turning revision into a huge plan.',
    bestFor:
      'Students who need a simple order: recall first, practise one thing properly, then fix one weak spot.',
    tags: ['Getting started', 'Revision structure', 'Small sessions'],
  },
  {
    id: 'neurodivergent-guide',
    href: '/neurodivergent-guide',
    kicker: 'Neurodivergent-Friendly Guide',
    title: 'Neurodivergent Revision Guide',
    description:
      'A practical, low-pressure guide for revising with ADHD, autism, dyslexia, anxiety, or any mix of them.',
    bestFor:
      'Students who need gentler starts, clearer structure, or a study setup that works with their brain rather than against it.',
    tags: ['ADHD', 'Autism', 'Dyslexia', 'Anxiety'],
  },
];
