'use client';

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
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #999;
  text-decoration: none;
  margin-bottom: 44px;
}
.nd-back:hover { color: #555; }

.nd-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
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
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
}

.nd-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  margin-bottom: 40px;
}

.nd-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.nd-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.nd-intro-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
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
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.nd-intro-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

.nd-step {
  display: grid;
  grid-template-columns: 120px 1fr;
  margin-bottom: 52px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 36px;
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
  font-size: 8px;
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
  color: #999;
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
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
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
  font-size: 12px;
  color: #5A5750;
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
  color: #ccc;
}

.nd-link-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.nd-primary-link {
  display: inline-flex;
  align-items: center;
  background: #1A1815;
  color: #FAFAF8;
  padding: 11px 20px;
  text-decoration: none;
  font-size: 13px;
}

.nd-secondary-link {
  display: inline-flex;
  align-items: center;
  padding: 11px 0;
  color: #2C2A27;
  text-decoration: underline;
  text-underline-offset: 4px;
  font-size: 13px;
}

.nd-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 18px;
  padding-top: 36px;
  margin-top: 52px;
  padding-bottom: 16px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
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
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 10px;
}

.nd-mini-text {
  font-size: 13px;
  line-height: 1.7;
  color: #5A5750;
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
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
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
  font-size: 13px;
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
  color: #bbb;
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
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #999;
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
  font-size: 13px;
  line-height: 1.8;
  color: #5A5750;
  margin-bottom: 16px;
}

.nd-route-link {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
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
    text: 'Use the Accessibility button in the bottom-left corner to switch on easier reading mode: dyslexia-friendly font, looser spacing, and reduced motion.',
    href: '/study-skills',
    cta: 'See all study skills →',
  },
] as const;

const SECTIONS = [
  {
    tag: 'ADHD',
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
  },
  {
    tag: 'Autistic',
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
  },
  {
    tag: 'AuDHD',
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
  },
  {
    tag: 'Dyslexia',
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
  },
  {
    tag: 'Anxiety',
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
  },
];

export default function NeurodivergentGuidePage() {
  return (
    <div className="nd-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="nd-wrap">
        <Link href="/dashboard" className="nd-back">
          <span>←</span>
          Back to Dashboard
        </Link>

        <p className="nd-kicker">Study Skills · Neurodivergent-Friendly Guide</p>
        <h1 className="nd-headline">Revising with a brain that works differently</h1>
        <p className="nd-standfirst">
          Nursing training was not built around ADHD, AuDHD, autism, dyslexia, or anxious brains — but your revision
          can be. This is a practical guide to using the tools in a way that respects how you actually focus, read, and recover.
        </p>
        <p className="nd-byline">ADHD · AuDHD · Autistic students · Dyslexia · Anxiety · The Nurse Lab</p>

        <EditorialSaveButton
          hubItemId="neurodivergent-guide"
          hubItemTitle="Neurodivergent Revision Guide"
        />

        <div className="nd-pearl">
          <p className="nd-pearl-label">Before you start</p>
          <p>
            Nothing in this guide replaces reasonable adjustments from your university or occupational health team.
            If you have not yet told your programme about your diagnosis, that is often the single most useful revision
            tool available to you.
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
          <div key={section.tag} className="nd-step">
            <div className="nd-step-sidebar">
              <span className={`nd-step-tag nd-tag-${section.colour}`}>{section.tag}</span>
              <span className={`nd-step-badge nd-badge-${section.colour}`}>Profile</span>
            </div>

            <div className="nd-step-content">
              <h2 className="nd-step-name">{section.name}</h2>
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
            </div>
          </div>
        ))}

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
      </div>
    </div>
  );
}
