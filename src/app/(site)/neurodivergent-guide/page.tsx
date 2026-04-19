import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';

const CSS = `

.nd-guide *, .nd-guide *::before, .nd-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.nd-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.nd-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
}

.nd-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #666;
  text-decoration: none;
  margin-bottom: 44px;
}
.nd-back:hover { color: #2C2A27; }

.nd-kicker {
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 14px;
}

.nd-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
  max-width: 14ch;
}

.nd-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 720px;
  margin-bottom: 14px;
}

.nd-byline {
  font-size: 12px;
  color: #666;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 28px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 24px;
}

.nd-save-wrap { margin-bottom: 16px; }
.nd-save-wrap > div { margin-top: 0 !important; margin-bottom: 16px !important; }

.nd-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  margin-bottom: 40px;
}

.nd-pearl-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.nd-pearl p {
  font-size: 14px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.nd-intro-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 40px;
}

.nd-intro-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.nd-intro-cell:last-child { border-right: none; }

.nd-intro-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.nd-intro-title {
  font-size: 12px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.nd-intro-text {
  font-size: 14px;
  color: #555;
  line-height: 1.55;
  font-weight: 300;
}

.nd-jump-nav {
  border: 0.5px solid rgba(0,0,0,0.12);
  padding: 18px 20px;
  margin-bottom: 20px;
}

.nd-jump-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 10px;
}

.nd-jump-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nd-jump-list a {
  font-size: 14px;
  color: #1A1815;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.nd-jump-list a:hover { color: #633806; }
.nd-jump-list a:focus-visible {
  outline: 2px solid #1A1815;
  outline-offset: 3px;
}

.nd-step {
  display: grid;
  grid-template-columns: 120px 1fr;
  margin-bottom: 44px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 28px;
  scroll-margin-top: 24px;
}

.nd-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.nd-step-tag {
  font-family: 'Playfair Display', serif;
  font-size: 34px;
  font-style: italic;
  font-weight: 400;
  line-height: 1.05;
  margin-bottom: 10px;
}

.nd-step-badge {
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  font-weight: 400;
}

.nd-step-content {
  padding-left: 32px;
}

.nd-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.nd-step-question {
  font-size: 13px;
  font-style: italic;
  color: #666;
  margin-bottom: 22px;
}

.nd-content-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.nd-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.nd-content-col:last-child { border-right: none; }

.nd-col-header {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #666;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.nd-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nd-col-list li {
  font-size: 14px;
  color: #555;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.nd-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #999;
}

.nd-link-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.nd-hub-pair {
  margin-top: 22px;
  padding-top: 16px;
  border-top: 0.5px solid rgba(0,0,0,0.08);
}

.nd-hub-pair-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 8px;
}

.nd-hub-pair-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
}

.nd-hub-pair-list li { position: relative; }
.nd-hub-pair-list li + li::before {
  content: '·';
  position: absolute;
  left: -10px;
  color: #999;
}

.nd-hub-pair-list a {
  font-size: 14px;
  color: #1A1815;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.nd-hub-pair-list a:hover { color: #633806; }

.nd-primary-link {
  display: inline-flex;
  align-items: center;
  background: #1A1815;
  color: #FAFAF8;
  padding: 11px 20px;
  text-decoration: none;
  font-size: 14px;
}

.nd-secondary-link {
  display: inline-flex;
  align-items: center;
  padding: 11px 0;
  color: #2C2A27;
  text-decoration: underline;
  text-underline-offset: 4px;
  font-size: 14px;
}

.nd-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 18px;
  padding-top: 24px;
  margin-top: 32px;
  padding-bottom: 14px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.nd-section-intro {
  font-size: 15px;
  color: #5A5750;
  line-height: 1.7;
  max-width: 68ch;
  margin-bottom: 22px;
}

.nd-mini-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 40px;
}

.nd-mini-cell {
  padding: 22px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.nd-mini-cell:last-child { border-right: none; }

.nd-mini-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 10px;
}

.nd-mini-text {
  font-size: 14px;
  line-height: 1.7;
  color: #555;
}

.nd-checklist-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 0.5px solid rgba(0,0,0,0.1);
}

.nd-checklist-col {
  padding: 22px 26px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.nd-checklist-col:last-child { border-right: none; }

.nd-checklist-col-title {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

.nd-checklist-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nd-checklist-list li {
  font-size: 14px;
  color: #555;
  line-height: 1.55;
  font-weight: 300;
  padding: 6px 0 6px 12px;
  position: relative;
}

.nd-checklist-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #999;
}

.nd-route-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 44px;
}

.nd-route-card {
  border: 0.5px solid rgba(0,0,0,0.1);
  background: #FFFFFF;
  padding: 22px 22px 24px;
}

.nd-route-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 10px;
}

.nd-route-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  line-height: 1.1;
  color: #1A1815;
  margin-bottom: 10px;
}

.nd-route-copy {
  font-size: 14px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 16px;
}

.nd-route-link {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: #1A1815;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.nd-summary-card {
  border: 0.5px solid rgba(0,0,0,0.1);
  background: #F5F3F0;
  padding: 26px 24px 28px;
  margin-top: 40px;
}

.nd-summary-card h2 {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 10px;
  max-width: 16ch;
}

.nd-summary-card p {
  font-size: 14px;
  line-height: 1.85;
  color: #5A5750;
  max-width: 48ch;
}

/* Section colours — each trait profile gets its own muted tone */
.nd-tag-adhd { color: #5A4A9B; }
.nd-badge-adhd { background: #EEEAFE; color: #43348A; }
.nd-tag-autistic { color: #0F6E56; }
.nd-badge-autistic { background: #E1F5EE; color: #085041; }
.nd-tag-dyslexia { color: #993C1D; }
.nd-badge-dyslexia { background: #FAECE7; color: #712B13; }
.nd-tag-anxiety { color: #3A5F8A; }
.nd-badge-anxiety { background: #E4EEF8; color: #24415F; }
.nd-tag-audhd { color: #7A4B2E; }
.nd-badge-audhd { background: #F6E7DC; color: #6A3E22; }
.nd-tag-dyspraxia { color: #1F6B73; }
.nd-badge-dyspraxia { background: #DFEEEF; color: #134348; }
.nd-tag-dyscalculia { color: #6B3E5F; }
.nd-badge-dyscalculia { background: #F1E3EC; color: #4A2B42; }

@media (max-width: 980px) {
  .nd-intro-grid,
  .nd-content-grid,
  .nd-route-grid,
  .nd-mini-grid,
  .nd-checklist-grid {
    grid-template-columns: 1fr 1fr;
  }

  .nd-step {
    grid-template-columns: 100px 1fr;
  }

  .nd-step-tag {
    font-size: 26px;
  }

  .nd-headline {
    font-size: 44px;
  }
}

@media (max-width: 720px) {
  .nd-wrap {
    padding: 28px 20px 80px;
  }

  .nd-intro-grid,
  .nd-content-grid,
  .nd-route-grid,
  .nd-mini-grid,
  .nd-checklist-grid {
    grid-template-columns: 1fr;
  }

  .nd-intro-cell,
  .nd-content-col,
  .nd-mini-cell,
  .nd-checklist-col {
    border-right: none;
    border-bottom: 0.5px solid rgba(0,0,0,0.1);
  }

  .nd-intro-cell:last-child,
  .nd-content-col:last-child,
  .nd-mini-cell:last-child,
  .nd-checklist-col:last-child {
    border-bottom: none;
  }

  .nd-step {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .nd-step-sidebar {
    border-right: none;
    border-bottom: 0.5px solid rgba(0,0,0,0.1);
    padding-right: 0;
    padding-bottom: 14px;
  }

  .nd-step-content {
    padding-left: 0;
  }

  .nd-headline {
    font-size: 36px;
    max-width: none;
  }
}
`;

const PRINCIPLES = [
  {
    n: '01',
    title: 'Smaller is smarter',
    text: 'Ten useful minutes beats two hours that never start. Shrink the session until the first step feels obviously doable.',
  },
  {
    n: '02',
    title: 'Structure beats willpower',
    text: 'Decide the shape before you start — one quiz block, one station, one guide. Removing choice removes the stuck feeling.',
  },
  {
    n: '03',
    title: 'Senses matter',
    text: 'Light, sound, temperature, posture. If your body is overstimulated, your brain cannot revise. Adjust the room before the plan.',
  },
  {
    n: '04',
    title: 'Done, not perfect',
    text: 'Finishing one small thing rebuilds momentum. Leaving a session half-finished on a bad note does the opposite.',
  },
];

const START_PATHS = [
  {
    label: 'Need the gentlest possible start?',
    title: 'Do the smallest useful version first.',
    text: 'Three quiz questions, one OSCE intro, or one guide skim still counts. The first useful action matters more than the perfect plan.',
    href: '/quiz',
    cta: 'Open quiz practice →',
  },
  {
    label: 'Need more structure first?',
    title: 'Read the study method, then come back.',
    text: 'If you are getting stuck deciding what order to do things in, use the general guide as the scaffold instead of making a fresh plan from scratch.',
    href: '/how-to-use',
    cta: 'Read the study method →',
  },
  {
    label: 'Need the page to feel easier first?',
    title: 'Change the reading settings before forcing yourself through it.',
    text: 'Use the Accessibility button in the bottom-left corner. It switches the whole site to Atkinson Hyperlegible (a dyslexia-friendly font), opens up line and paragraph spacing, and turns off scroll animations and transitions. The setting is saved to this device.',
    href: '/study-skills',
    cta: 'See all study skills →',
  },
] as const;

const SECTIONS = [
  {
    tag: 'ADHD',
    slug: 'adhd',
    colour: 'adhd',
    name: 'If starting is the hardest part',
    question: 'How do I stop circling the desk and actually begin?',
    cols: [
      {
        header: 'Try',
        items: [
          'Open the quiz before you sit down',
          'Commit to only five questions',
          'Use a short visible timer',
          'Put your phone in another room',
          'Narrate the first step out loud',
        ],
      },
      {
        header: 'Helps because',
        items: [
          'Low-friction openings beat big plans',
          'A small target reduces initiation load',
          'A timer turns time back into something visible',
          'Out of sight genuinely lowers pull',
          'Speaking activates a different gear',
        ],
      },
      {
        header: 'Avoid',
        items: [
          'Planning the whole week first',
          'Starting with the hardest topic',
          'Long reading blocks with no interaction',
          'Piling tabs open before you begin',
        ],
      },
    ],
    pearl:
      'ADHD brains respond to novelty, urgency, and stakes. A short quiz or timed OSCE station gives all three without demanding a whole revision plan first.',
    primaryHref: '/quiz',
    primaryLabel: 'Start a 5-question quiz',
    secondaryHref: '/osce',
    secondaryLabel: 'Try one OSCE station →',
    hubLinks: [
      { href: '/hub/resources/placement-survival', label: 'Placement survival' },
      { href: '/hub/resources/9-rights-medication', label: '9 rights of medication' },
      { href: '/hub/resources/medication-abbreviations', label: 'Medication abbreviations' },
    ],
  },
  {
    tag: 'Autistic',
    slug: 'autistic',
    colour: 'autistic',
    name: 'If routine and clarity help you focus',
    question: 'How do I make the session predictable enough to commit to?',
    cols: [
      {
        header: 'Try',
        items: [
          'Use the same tool, same chair, same time',
          'Write the three steps of today\'s session down',
          'Finish one section fully before switching',
          'Read the OSCE prompt twice before answering',
          'Use the hub guides as a closed reference',
        ],
      },
      {
        header: 'Helps because',
        items: [
          'Predictable cues lower activation cost',
          'An explicit plan removes hidden decisions',
          'Completing feels cleaner than context-switching',
          'Re-reading confirms the rules before starting',
          'A bounded resource is calmer than open web',
        ],
      },
      {
        header: 'Avoid',
        items: [
          'Jumping between tools in one sitting',
          'Background music or noisy study cafés',
          'Vague goals like "do some revision"',
          'Unstructured group chat during focus time',
        ],
      },
    ],
    pearl:
      'Clarity is not a luxury — it is the thing that makes the session possible. Write the shape of the session down so your brain is not quietly negotiating with itself the whole time.',
    primaryHref: '/how-to-use',
    primaryLabel: 'Read the study method',
    secondaryHref: '/hub',
    secondaryLabel: 'Open the hub →',
    hubLinks: [
      { href: '/hub/resources/placement-survival', label: 'Placement survival' },
      { href: '/hub/resources/theories-of-development', label: 'Theories of development' },
      { href: '/hub/resources/ae-assessment-guide', label: 'A&E assessment guide' },
    ],
  },
  {
    tag: 'AuDHD',
    slug: 'audhd',
    colour: 'audhd',
    name: 'If you need structure and stimulation at the same time',
    question: 'How do I revise when one part of my brain wants sameness and the other part wants novelty?',
    cols: [
      {
        header: 'Try',
        items: [
          'Keep the same session shape, but rotate the topic',
          'Use a two-step plan: one quiz block, then one OSCE station',
          'Set up the desk the same way each time',
          'Write a visible finish line before you start',
          'Keep one low-friction fallback for overload days',
        ],
      },
      {
        header: 'Helps because',
        items: [
          'Predictable structure lowers resistance while novelty keeps interest alive',
          'A fixed order removes decision fatigue',
          'Stable sensory cues make it easier to settle in',
          'A clear ending stops the session from sprawling',
          'Fallbacks protect momentum when your capacity drops fast',
        ],
      },
      {
        header: 'Avoid',
        items: [
          'Trying to make every session feel exactly the same',
          'Building a huge revision plan before doing the first task',
          'Forcing yourself through sensory discomfort for the sake of productivity',
          'Switching tools every few minutes once you feel restless',
        ],
      },
    ],
    pearl:
      'AuDHD revision often works best when the container stays familiar but the task inside it changes. Keep the routine steady; let the content provide enough freshness to hold attention.',
    primaryHref: '/quiz',
    primaryLabel: 'Start with a quiz block',
    secondaryHref: '/osce',
    secondaryLabel: 'Then try one OSCE station →',
    hubLinks: [
      { href: '/hub/resources/placement-survival', label: 'Placement survival' },
      { href: '/hub/resources/drug-calculations-cheat-sheet', label: 'Drug calculations cheat sheet' },
      { href: '/hub/resources/9-rights-medication', label: '9 rights of medication' },
    ],
  },
  {
    tag: 'Dyslexia',
    slug: 'dyslexia',
    colour: 'dyslexia',
    name: 'If reading is the slowest part',
    question: 'How do I revise without getting stuck on the page?',
    cols: [
      {
        header: 'Try',
        items: [
          'Increase browser zoom to 125% or 150%',
          'Use your device\'s screen reader on long guides',
          'Say the OSCE answer aloud before writing',
          'Watch for patterns instead of memorising words',
          'Use the quiz to learn shapes of questions',
        ],
      },
      {
        header: 'Helps because',
        items: [
          'Larger text reduces tracking effort',
          'Audio bypasses the slow decoding loop',
          'Speaking engages memory differently to reading',
          'Concepts stick when decoupled from spelling',
          'Multiple choice rewards recognition over recall',
        ],
      },
      {
        header: 'Avoid',
        items: [
          'Dense paragraphs late at night',
          'Copying notes word-for-word',
          'Relying on one format only',
          'Reading for hours with no active recall',
        ],
      },
    ],
    pearl:
      'Dyslexia does not mean you know the material less — it means you prove it through slower routes. OSCE practice out loud is often a faster way to show what you actually know.',
    primaryHref: '/osce',
    primaryLabel: 'Practise out loud',
    secondaryHref: '/hub',
    secondaryLabel: 'Open the hub guides →',
    hubLinks: [
      { href: '/hub/resources/glossary-terms', label: 'Glossary of nursing terms' },
      { href: '/hub/resources/medication-abbreviations', label: 'Medication abbreviations' },
      { href: '/hub/resources/placement-survival', label: 'Placement survival' },
    ],
  },
  {
    tag: 'Dyspraxia',
    slug: 'dyspraxia',
    colour: 'dyspraxia',
    name: 'If the physical part of nursing is the hardest bit',
    question: 'How do I practise clinical skills when my hands and planning do not always cooperate?',
    cols: [
      {
        header: 'Try',
        items: [
          'Rehearse OSCE station steps out loud in order',
          'Practise skills physically, not just by watching videos',
          'Use templates for drug calculations, one step per line',
          'Sign-post what your hands are doing as you do it',
          'Ask for extra time on practical assessments through DSA',
        ],
      },
      {
        header: 'Helps because',
        items: [
          'Verbal sequencing cements the motor order',
          'Dyspraxic memory is often movement-based, not visual',
          'Single-variable steps stop calculations collapsing together',
          'Narrating slows the hand down to match the plan',
          'Reasonable adjustments are built for this, not a cheat',
        ],
      },
      {
        header: 'Avoid',
        items: [
          'Only learning by watching demonstrations',
          'Cramming physical practice into one long session',
          'Handwriting notes at speed for revision',
          'Doing calculations in your head under pressure',
        ],
      },
    ],
    pearl:
      'Dyspraxia is not an absence of skill — it is a different route to the same outcome. Physical rehearsal, spoken sequencing, and structured templates are not crutches; they are how the skill consolidates.',
    primaryHref: '/osce',
    primaryLabel: 'Practise OSCE stations step-by-step',
    secondaryHref: '/hub/resources/drug-calculations-cheat-sheet',
    secondaryLabel: 'Open the calculations sheet →',
    hubLinks: [
      { href: '/hub/resources/im-sc-injection', label: 'IM & SC injection technique' },
      { href: '/hub/resources/ng-tube-insertion', label: 'NG tube insertion' },
      { href: '/hub/resources/ae-assessment', label: 'A&E assessment station' },
    ],
  },
  {
    tag: 'Dyscalculia',
    slug: 'dyscalculia',
    colour: 'dyscalculia',
    name: 'If numbers and drug calculations feel like quicksand',
    question: 'How do I revise calculations when digits slip away as I read them?',
    cols: [
      {
        header: 'Try',
        items: [
          'Write the full formula before plugging numbers in',
          'Use a calculator for every step — accuracy over pride',
          'Do one variable per line, never combine steps',
          'Say the numbers out loud as you write them',
          'Estimate first: does the answer roughly sound right?',
        ],
      },
      {
        header: 'Helps because',
        items: [
          'The formula anchors the logic before the numbers move',
          'A calculator frees up brain space for the clinical reasoning',
          'Single-step lines prevent transposition errors',
          'Speaking numbers engages a second memory route',
          'A rough estimate catches decimal-point slips early',
        ],
      },
      {
        header: 'Avoid',
        items: [
          'Multi-step calculations done in your head',
          'Trusting a number just because it "looks about right"',
          'Copying digits off a screen without saying them',
          'Revising calculations when you are already tired',
        ],
      },
    ],
    pearl:
      'Dyscalculia rarely shows up as "I do not understand the drug" — it shows up as lost digits and shifted decimal places. Structure and redundancy are more useful than trying harder.',
    primaryHref: '/hub/resources/drug-calculations-cheat-sheet',
    primaryLabel: 'Open the drug calculations sheet',
    secondaryHref: '/quiz',
    secondaryLabel: 'Practise with the quiz →',
    hubLinks: [
      { href: '/hub/resources/9-rights-medication', label: '9 rights of medication' },
      { href: '/hub/resources/paeds-vital-signs-cheat-sheet', label: 'Paeds vital signs' },
      { href: '/hub/resources/medication-abbreviations', label: 'Medication abbreviations' },
    ],
  },
  {
    tag: 'Anxiety',
    slug: 'anxiety',
    colour: 'anxiety',
    name: 'If exams make your brain go quiet',
    question: 'How do I revise without making the fear worse?',
    cols: [
      {
        header: 'Try',
        items: [
          'Do the topic you are avoiding first, briefly',
          'Use the quiz as exposure, not judgement',
          'Set a finish line, not a start line',
          'Breathe for thirty seconds before the station',
          'End the session on something you got right',
        ],
      },
      {
        header: 'Helps because',
        items: [
          'Avoidance grows fear; small contact shrinks it',
          'Reframing removes the score as a verdict',
          'Knowing when you stop lowers dread',
          'A reset breath interrupts the spiral',
          'Ending well shapes how you feel next time',
        ],
      },
      {
        header: 'Avoid',
        items: [
          'Marathon sessions to "prove" something',
          'Checking other students\' progress mid-session',
          'Revising straight before sleep',
          'Treating a bad question as evidence of failure',
        ],
      },
    ],
    pearl:
      'The goal of revising anxious is not to feel calm. It is to show yourself, over and over, that you can do the thing even when the feeling is there.',
    primaryHref: '/quiz',
    primaryLabel: 'Gentle 5-question warm-up',
    secondaryHref: '/dashboard',
    secondaryLabel: 'Back to dashboard →',
    hubLinks: [
      { href: '/hub/resources/placement-survival', label: 'Placement survival' },
      { href: '/hub/resources/ae-assessment-guide', label: 'A&E assessment guide' },
      { href: '/hub/resources/9-rights-medication', label: '9 rights of medication' },
    ],
  },
];

export default function NeurodivergentGuidePage() {
  return (
    <div className="nd-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <main id="main-content" className="nd-wrap">
        <Link href="/dashboard" className="nd-back">
          <span>←</span>
          Back to Dashboard
        </Link>

        <p className="nd-kicker">Study Skills · Neurodivergent-Friendly Guide</p>
        <h1 className="nd-headline">Revising with a brain that works differently</h1>
        <p className="nd-standfirst">
          Nursing training was not built around ADHD, AuDHD, autism, dyslexia, dyspraxia, dyscalculia, or anxious
          brains — but your revision can be. This is a practical guide to using the tools in a way that respects how
          you actually focus, read, move, and recover.
        </p>
        <p className="nd-byline">ADHD · AuDHD · Autistic · Dyslexia · Dyspraxia · Dyscalculia · Anxiety · The Nurse Lab</p>

        <div className="nd-save-wrap">
          <EditorialSaveButton
            hubItemId="neurodivergent-guide"
            hubItemTitle="Neurodivergent Revision Guide"
          />
        </div>

        <div className="nd-pearl">
          <p className="nd-pearl-label">Before you start</p>
          <p>
            Nothing in this guide replaces reasonable adjustments from your university or occupational health team.
            If you have not yet told your programme about your diagnosis, that is often the single most useful revision
            tool available to you — see the section on reasonable adjustments below.
          </p>
        </div>

        <div className="nd-intro-grid">
          {PRINCIPLES.map((p) => (
            <div key={p.n} className="nd-intro-cell">
              <span className="nd-intro-numeral">{p.n}</span>
              <p className="nd-intro-title">{p.title}</p>
              <p className="nd-intro-text">{p.text}</p>
            </div>
          ))}
        </div>

        <nav className="nd-jump-nav" aria-label="Jump to profile">
          <p className="nd-jump-label">Jump to a profile</p>
          <ul className="nd-jump-list">
            {SECTIONS.map((section) => (
              <li key={section.slug}>
                <a href={`#${section.slug}`}>{section.tag}</a>
              </li>
            ))}
            <li>
              <a href="#reasonable-adjustments">Reasonable adjustments</a>
            </li>
          </ul>
        </nav>

        <h2 className="nd-section-title">Pick the lightest useful next step</h2>
        <div className="nd-route-grid">
          {START_PATHS.map((path) => (
            <div key={path.title} className="nd-route-card">
              <p className="nd-route-label">{path.label}</p>
              <h3 className="nd-route-title">{path.title}</h3>
              <p className="nd-route-copy">{path.text}</p>
              <Link href={path.href} className="nd-route-link">
                {path.cta}
              </Link>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <article key={section.tag} id={section.slug} className="nd-step">
            <div className="nd-step-sidebar">
              <span className={`nd-step-tag nd-tag-${section.colour}`}>{section.tag}</span>
              <span className={`nd-step-badge nd-badge-${section.colour}`}>Profile</span>
            </div>

            <div className="nd-step-content">
              <h3 className="nd-step-name">{section.name}</h3>
              <p className="nd-step-question">{section.question}</p>

              <div className="nd-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="nd-content-col">
                    <p className="nd-col-header">{col.header}</p>
                    <ul className="nd-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="nd-pearl">
                <p className="nd-pearl-label">Worth remembering</p>
                <p>{section.pearl}</p>
              </div>

              <div className="nd-link-row">
                <Link href={section.primaryHref} className="nd-primary-link">
                  {section.primaryLabel}
                </Link>
                <Link href={section.secondaryHref} className="nd-secondary-link">
                  {section.secondaryLabel}
                </Link>
              </div>

              {section.hubLinks && section.hubLinks.length > 0 && (
                <div className="nd-hub-pair">
                  <p className="nd-hub-pair-label">Hub guides that pair well</p>
                  <ul className="nd-hub-pair-list">
                    {section.hubLinks.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>
        ))}

        <h2 id="reasonable-adjustments" className="nd-section-title">Reasonable adjustments and DSA</h2>
        <p className="nd-section-intro">
          In the UK, universities have a legal duty to make reasonable adjustments for disabled students, which
          includes most neurodivergent conditions when they affect study. Disabled Students&rsquo; Allowance (DSA)
          is a separate fund that pays for assistive software, specialist 1-to-1 study support, and equipment.
          Telling your programme early usually matters more than any single revision technique.
        </p>
        <div className="nd-checklist-grid">
          <div className="nd-checklist-col">
            <p className="nd-checklist-col-title">What to tell your university</p>
            <ul className="nd-checklist-list">
              <li>Your diagnosis or suspected diagnosis — a referral letter is enough to start.</li>
              <li>Which parts of the course are affected (reading, numeracy, OSCEs, placement).</li>
              <li>Any adjustments you already know help (extra time, quiet room, screen reader).</li>
              <li>Whether you have applied for, or are waiting on, DSA funding.</li>
              <li>Ask who your named disability adviser is and how to contact them directly.</li>
            </ul>
          </div>

          <div className="nd-checklist-col">
            <p className="nd-checklist-col-title">Common adjustments for OSCEs and exams</p>
            <ul className="nd-checklist-list">
              <li>25% extra time on written exams and calculation papers.</li>
              <li>A separate, quieter room for OSCE stations or written assessments.</li>
              <li>Rest breaks that do not count against your time.</li>
              <li>Permission to read the OSCE prompt aloud or ask for it to be re-read.</li>
              <li>Use of a calculator during drug-calc assessments (often standard now).</li>
              <li>Sensory-friendly waiting areas before high-stakes assessments.</li>
            </ul>
          </div>
        </div>

        <div className="nd-route-grid" style={{ marginTop: '32px' }}>
          <div className="nd-route-card">
            <p className="nd-route-label">Official UK guidance</p>
            <h3 className="nd-route-title">Apply for Disabled Students&rsquo; Allowance</h3>
            <p className="nd-route-copy">
              The gov.uk page covers eligibility, how to apply, and what DSA can pay for. Apply as soon as you have
              a diagnosis or referral — processing can take weeks.
            </p>
            <a
              href="https://www.gov.uk/disabled-students-allowance-dsa"
              className="nd-route-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open gov.uk DSA guidance →
            </a>
          </div>
          <div className="nd-route-card">
            <p className="nd-route-label">Student support</p>
            <h3 className="nd-route-title">Equality Act adjustments at university</h3>
            <p className="nd-route-copy">
              A short explainer from Disability Rights UK on what counts as a reasonable adjustment in higher
              education and how to request one if your programme has not offered it yet.
            </p>
            <a
              href="https://www.disabilityrightsuk.org/resources/adjustments-disabled-students"
              className="nd-route-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the explainer →
            </a>
          </div>
          <div className="nd-route-card">
            <p className="nd-route-label">On this site</p>
            <h3 className="nd-route-title">Turn on Easier Reading Mode</h3>
            <p className="nd-route-copy">
              The Accessibility button in the bottom-left corner switches the site to Atkinson Hyperlegible font,
              opens up line and paragraph spacing, and turns off scroll animations. The setting stays on this device.
            </p>
            <Link href="/study-skills" className="nd-route-link">
              See all study skills →
            </Link>
          </div>
        </div>

        <h2 className="nd-section-title">Sensory &amp; environment checklist</h2>
        <div className="nd-mini-grid">
          <div className="nd-mini-cell">
            <p className="nd-mini-label">Sound</p>
            <p className="nd-mini-text">
              Brown noise, loop earplugs, or instrumental-only tracks are often better than silence or lyrics. Test before the session, not during.
            </p>
          </div>
          <div className="nd-mini-cell">
            <p className="nd-mini-label">Light</p>
            <p className="nd-mini-text">
              Warm light, not overhead fluorescents. If you can sit near a window with daylight, do. Dim the screen at night.
            </p>
          </div>
          <div className="nd-mini-cell">
            <p className="nd-mini-label">Body</p>
            <p className="nd-mini-text">
              Water within reach, a snack, a blanket if you run cold. A dysregulated body reads revision as a threat.
            </p>
          </div>
        </div>

        <h2 className="nd-section-title">If you can only manage a short session</h2>
        <div className="nd-checklist-grid">
          <div className="nd-checklist-col">
            <p className="nd-checklist-col-title">Low-energy day (5 minutes)</p>
            <ul className="nd-checklist-list">
              <li>Open the quiz and do three questions.</li>
              <li>Read one explanation properly.</li>
              <li>Close the tab. That counts.</li>
            </ul>
          </div>

          <div className="nd-checklist-col">
            <p className="nd-checklist-col-title">Slightly better day (15 minutes)</p>
            <ul className="nd-checklist-list">
              <li>Five quiz questions as warm-up.</li>
              <li>One OSCE station said out loud.</li>
              <li>One hub guide skim-read on the weakest bit.</li>
            </ul>
          </div>
        </div>

        <h2 className="nd-section-title">When to stop for the day</h2>
        <div className="nd-checklist-grid">
          <div className="nd-checklist-col">
            <p className="nd-checklist-col-title">Red flags worth respecting</p>
            <ul className="nd-checklist-list">
              <li>You are re-reading the same line three times.</li>
              <li>Your jaw, shoulders, or hands have gone tight.</li>
              <li>You feel more panicked than when you started.</li>
              <li>You are scoring lower than you did an hour ago.</li>
            </ul>
          </div>

          <div className="nd-checklist-col">
            <p className="nd-checklist-col-title">Closing the session well</p>
            <ul className="nd-checklist-list">
              <li>Write down the one thing you want to revisit next time.</li>
              <li>End on a question you got right, not wrong.</li>
              <li>Close tabs so tomorrow opens cleanly.</li>
              <li>Plan the restart, not the rest of the week.</li>
            </ul>
          </div>
        </div>

        <div className="nd-pearl" style={{ marginTop: '52px' }}>
          <p className="nd-pearl-label">A final note</p>
          <p>
            You are not behind because your brain is different. You are probably behind because the system assumes one kind of brain.
            The tools on this site are written to be used in small, honest sessions — there is no version of revision here that requires you to grind.
          </p>
        </div>

        <div className="nd-summary-card">
          <p className="nd-pearl-label" style={{ marginBottom: '8px' }}>More study skills</p>
          <h2>Build a calmer revision setup around this guide.</h2>
          <p>
            If this page helped, the wider study skills section now holds the general
            study method too. Use it when you want more structure, a clearer order,
            or just a lighter route back into the tools.
          </p>
          <div className="nd-link-row">
            <Link href="/study-skills" className="nd-primary-link">
              Browse study skills
            </Link>
            <Link href="/how-to-use" className="nd-secondary-link">
              Read the general study method →
            </Link>
          </div>
        </div>

        <div className="nd-link-row" style={{ marginTop: '32px' }}>
          <Link href="/study-skills" className="nd-primary-link">
            Back to study skills
          </Link>
          <Link href="/dashboard" className="nd-secondary-link">
            Back to dashboard →
          </Link>
        </div>
      </main>
    </div>
  );
}
