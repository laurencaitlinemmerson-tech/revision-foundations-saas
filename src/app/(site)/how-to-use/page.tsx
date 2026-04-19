'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import DesktopAppButton from '@/components/DesktopAppButton';

const CSS = `

.how-guide *, .how-guide *::before, .how-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.how-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.how-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
}

/* Back nav */
.how-back {
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
.how-back:hover { color: #555; }

/* Masthead */
.how-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.how-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
  max-width: 11ch;
}

.how-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 700px;
  margin-bottom: 14px;
}

.how-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
}

/* Pearl */
.how-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  margin-bottom: 40px;
}

.how-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.how-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Golden rules */
.how-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.how-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.how-golden-cell:last-child { border-right: none; }

.how-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.how-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.how-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Section layout */
.how-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 52px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 36px;
}

.how-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.how-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.how-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.how-step-content {
  padding-left: 32px;
}

.how-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.how-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.how-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.how-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.how-content-col:last-child { border-right: none; }

.how-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.how-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.how-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.how-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

.how-tag-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 7px;
}

.how-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.how-tag {
  font-size: 11px;
  background: #F5F3F0;
  color: #5A5750;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

.how-link-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.how-primary-link {
  display: inline-flex;
  align-items: center;
  background: #1A1815;
  color: #FAFAF8;
  padding: 11px 20px;
  text-decoration: none;
  font-size: 13px;
}

.how-secondary-link {
  display: inline-flex;
  align-items: center;
  padding: 11px 0;
  color: #2C2A27;
  text-decoration: underline;
  text-underline-offset: 4px;
  font-size: 13px;
}

.how-section-title {
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

.how-anchor-target {
  scroll-margin-top: 120px;
}

.how-mini-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
}

.how-mini-cell {
  padding: 22px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.how-mini-cell:last-child { border-right: none; }

.how-mini-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 10px;
}

.how-mini-text {
  font-size: 13px;
  line-height: 1.7;
  color: #5A5750;
}

.how-checklist-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 0.5px solid rgba(0,0,0,0.1);
}

.how-checklist-col {
  padding: 22px 26px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.how-checklist-col:last-child { border-right: none; }

.how-checklist-col-title {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

.how-checklist-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.how-checklist-list li {
  font-size: 13px;
  color: #555;
  line-height: 1.55;
  font-weight: 300;
  padding: 6px 0 6px 12px;
  position: relative;
}

.how-checklist-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #bbb;
}

/* Colour system */
.how-letter-s { color: #5A4A9B; }
.how-badge-s { background: #EEEAFE; color: #43348A; }
.how-letter-o { color: #0F6E56; }
.how-badge-o { background: #E1F5EE; color: #085041; }
.how-letter-q { color: #993C1D; }
.how-badge-q { background: #FAECE7; color: #712B13; }
.how-letter-r { color: #5F5E5A; }
.how-badge-r { background: #F1EFE8; color: #444441; }

@media (max-width: 980px) {
  .how-golden,
  .how-content-grid,
  .how-mini-grid,
  .how-checklist-grid {
    grid-template-columns: 1fr 1fr;
  }

  .how-step {
    grid-template-columns: 72px 1fr;
  }

  .how-step-letter {
    font-size: 56px;
  }

  .how-headline {
    font-size: 44px;
  }
}

@media (max-width: 720px) {
  .how-wrap {
    padding: 28px 20px 80px;
  }

  .how-golden,
  .how-content-grid,
  .how-mini-grid,
  .how-checklist-grid {
    grid-template-columns: 1fr;
  }

  .how-golden-cell,
  .how-content-col,
  .how-mini-cell,
  .how-checklist-col {
    border-right: none;
    border-bottom: 0.5px solid rgba(0,0,0,0.1);
  }

  .how-golden-cell:last-child,
  .how-content-col:last-child,
  .how-mini-cell:last-child,
  .how-checklist-col:last-child {
    border-bottom: none;
  }

  .how-step {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .how-step-sidebar {
    border-right: none;
    border-bottom: 0.5px solid rgba(0,0,0,0.1);
    padding-right: 0;
    padding-bottom: 14px;
  }

  .how-step-content {
    padding-left: 0;
  }

  .how-headline {
    font-size: 36px;
    max-width: none;
  }
}
`;

const RULES = [
  {
    n: '01',
    title: 'Start smaller',
    text: 'You do not need a huge revision plan to make the tools useful. A few questions, one proper station, and one fixed weak spot is enough.',
  },
  {
    n: '02',
    title: 'Say it out loud',
    text: 'Use the tools to practise wording, structure, and safety aloud. Reading passively is not the same as performing under pressure.',
  },
  {
    n: '03',
    title: 'Fix one weak spot',
    text: 'Do not try to improve everything in one sitting. Pick the bit that felt messy, shaky, or slow, and tighten that first.',
  },
  {
    n: '04',
    title: 'Come back often',
    text: 'Ten to fifteen minutes most days usually works better than waiting for the perfect long session you never quite start.',
  },
];

const SECTIONS = [
  {
    letter: 'S',
    colour: 's',
    name: 'Start with recall',
    question: 'What feels easy, and what is not sticking yet?',
    cols: [
      {
        header: 'Use it for',
        items: [
          'Warming up before a longer session',
          'Spotting weak areas quickly',
          'Checking what you actually know',
          'Breaking revision into smaller starts',
        ],
      },
      {
        header: 'What to do',
        items: [
          'Do 5 to 10 questions',
          'Commit before checking the answer',
          'Read the explanation properly',
          'Notice repeated mistakes',
        ],
      },
      {
        header: 'Avoid',
        items: [
          'Clicking through too quickly',
          'Only doing topics you already like',
          'Treating the score as the whole point',
          'Ignoring the feedback',
        ],
      },
      {
        header: 'Use when',
        items: [
          'You have 10 minutes',
          'You need a warm-up',
          'You feel stuck starting',
          'You want a quick gap-check',
        ],
      },
    ],
    tags: ['Short quiz', 'Warm-up block', 'Gap spotting', 'Topic recall'],
    pearl:
      'The quiz works best as feedback, not proof. A wrong answer is still useful if it shows you exactly what needs tightening.',
    primaryHref: '/quiz',
    primaryLabel: 'Open core quiz',
    secondaryHref: '/quiz',
    secondaryLabel: 'Explore topics',
  },
  {
    letter: 'O',
    colour: 'o',
    name: 'One proper OSCE run',
    question: 'Can you say it clearly, safely, and in the right order?',
    cols: [
      {
        header: 'Use it for',
        items: [
          'Practising structure',
          'Improving spoken wording',
          'Building confidence under pressure',
          'Repeating awkward stations until they feel normal',
        ],
      },
      {
        header: 'What to do',
        items: [
          'Choose one station',
          'Read the prompt properly',
          'Say your answer out loud',
          'Reflect and repeat if needed',
        ],
      },
      {
        header: 'Focus on',
        items: [
          'Introduction, consent, and safety',
          'Clear sequence',
          'Clinical reasoning where it matters',
          'Sounding calm instead of rushed',
        ],
      },
      {
        header: 'Use when',
        items: [
          'You need speaking practice',
          'You freeze in stations',
          'Your structure feels messy',
          'You want safer wording',
        ],
      },
    ],
    tags: ['Structure', 'Wording', 'Safety', 'Timed practice'],
    pearl:
      'The goal is not just to finish a station. It is to sound clearer, safer, and less flustered each time you repeat one.',
    primaryHref: '/osce',
    primaryLabel: 'Open OSCE tool',
    secondaryHref: '/dashboard',
    secondaryLabel: 'Back to dashboard',
  },
  {
    letter: 'Q',
    colour: 'q',
    name: 'Quietly fix the weak bit',
    question: 'What went wrong, and what do you want to sound better on next time?',
    cols: [
      {
        header: 'Look for',
        items: [
          'Topics you keep missing',
          'Stations where you ramble',
          'Gaps in clinical reasoning',
          'Parts that feel vague or slow',
        ],
      },
      {
        header: 'What to do',
        items: [
          'Review the explanation',
          'Read one guide or summary',
          'Say the corrected version out loud',
          'Repeat once while it is fresh',
        ],
      },
      {
        header: 'Do not do',
        items: [
          'Open five new topics at once',
          'Turn one mistake into a huge plan',
          'Keep revising passively only',
          'Stay with the easy bits',
        ],
      },
      {
        header: 'Best result',
        items: [
          'One thing feels clearer',
          'Your wording gets cleaner',
          'You know what to revisit later',
          'The session feels finished, not endless',
        ],
      },
    ],
    tags: ['Review', 'Tighten', 'Repeat', 'Stop there'],
    pearl:
      'Most good sessions do not end with doing more. They end with one thing making more sense than it did half an hour ago.',
    primaryHref: '/hub',
    primaryLabel: 'Open the hub',
    secondaryHref: '/hub',
    secondaryLabel: 'Browse guides',
  },
];

export default function HowToUsePage() {
  return (
    <div className="how-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="how-wrap">
        <Link href="/dashboard" className="how-back">
          <span>←</span>
          Back to Dashboard
        </Link>

        <p className="how-kicker">Study Skills · Getting Started</p>
        <h1 className="how-headline">How to Use The Nurse Lab</h1>
        <p className="how-standfirst">
          A calmer way to use the tools without turning revision into a huge plan. Start with recall, practise one thing properly, then fix one weak spot.
        </p>
        <p className="how-byline">Children&apos;s nursing · OSCE prep · Theory revision · The Nurse Lab</p>

        <EditorialSaveButton
          hubItemId="how-to-use"
          hubItemTitle="How to Use The Nurse Lab"
        />

        <div className="how-pearl">
          <p className="how-pearl-label">Student note</p>
          <p>
            You do not need to use everything in one sitting. The tools work best when you keep the session small, say things out loud, and stop once you have fixed one weak bit.
          </p>
        </div>

        <div className="how-golden">
          {RULES.map((rule) => (
            <div key={rule.n} className="how-golden-cell">
              <span className="how-golden-numeral">{rule.n}</span>
              <p className="how-golden-title">{rule.title}</p>
              <p className="how-golden-text">{rule.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.letter} className="how-step">
            <div className="how-step-sidebar">
              <span className={`how-step-letter how-letter-${section.colour}`}>{section.letter}</span>
              <span className={`how-step-badge how-badge-${section.colour}`}>{section.name}</span>
            </div>

            <div className="how-step-content">
              <h2 className="how-step-name">{section.name}</h2>
              <p className="how-step-question">{section.question}</p>

              <div className="how-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="how-content-col">
                    <p className="how-col-header">{col.header}</p>
                    <ul className="how-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <p className="how-tag-label">Useful for</p>
              <div className="how-tags">
                {section.tags.map((tag) => (
                  <span key={tag} className="how-tag">{tag}</span>
                ))}
              </div>

              <div className="how-pearl">
                <p className="how-pearl-label">Clinical pearl</p>
                <p>{section.pearl}</p>
              </div>

              <div className="how-link-row">
                <Link href={section.primaryHref} className="how-primary-link">
                  {section.primaryLabel}
                </Link>
                <Link href={section.secondaryHref} className="how-secondary-link">
                  {section.secondaryLabel} →
                </Link>
              </div>
            </div>
          </div>
        ))}

        <h2 className="how-section-title">If you only have a few minutes</h2>
        <div className="how-mini-grid">
          <div className="how-mini-cell">
            <p className="how-mini-label">10 minutes</p>
            <p className="how-mini-text">
              Do a short quiz, read the feedback, and say one tricky concept out loud before you leave it there.
            </p>
          </div>
          <div className="how-mini-cell">
            <p className="how-mini-label">20 minutes</p>
            <p className="how-mini-text">
              Start with a few quiz questions, run one OSCE station properly, then fix the weakest bit while it is still fresh.
            </p>
          </div>
        </div>

        <h2 className="how-section-title">A few rules that make the tools more useful</h2>
        <div className="how-checklist-grid">
          <div className="how-checklist-col">
            <p className="how-checklist-col-title">Keep sessions workable</p>
            <ul className="how-checklist-list">
              <li>Ten to fifteen minutes most days is enough.</li>
              <li>Use the smallest useful version of the session.</li>
              <li>Start even if you do not feel fully ready.</li>
            </ul>
          </div>

          <div className="how-checklist-col">
            <p className="how-checklist-col-title">Make practice count</p>
            <ul className="how-checklist-list">
              <li>Quiz helps with recall. OSCE helps with structure and wording.</li>
              <li>The topics you avoid are often the ones worth opening.</li>
              <li>Saying things out loud makes the practice much more real.</li>
            </ul>
          </div>
        </div>

        <h2 id="desktop-app" className="how-section-title how-anchor-target">Desktop app</h2>
        <div className="how-checklist-grid">
          <div className="how-checklist-col">
            <p className="how-checklist-col-title">Fastest route</p>
            <ul className="how-checklist-list">
              <li>Open The Nurse Lab in Chrome or Edge on your laptop or desktop.</li>
              <li>Use the Download desktop app button on the homepage.</li>
              <li>Accept the browser install prompt to add it like a desktop app.</li>
            </ul>
          </div>

          <div className="how-checklist-col">
            <p className="how-checklist-col-title">If no prompt appears</p>
            <ul className="how-checklist-list">
              <li>Use Chrome or Edge if you can, because they support the install flow best.</li>
              <li>Look for Install app in the browser address bar or the browser menu.</li>
              <li>There is not a separate `.dmg` or `.exe` download yet. It installs from the browser.</li>
            </ul>
          </div>
        </div>

        <div className="how-link-row">
          <DesktopAppButton
            className="how-primary-link"
            label="Download desktop app"
            title="Install The Nurse Lab as a desktop app"
          />
          <Link href="/" className="how-secondary-link">
            Back to homepage →
          </Link>
        </div>
      </div>
    </div>
  );
}
