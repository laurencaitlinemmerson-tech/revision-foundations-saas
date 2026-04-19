'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const quizQuestions = [
  { question: 'How early should you arrive on your first day of placement?', options: ['Exactly on time', '5 minutes early', '15 minutes early', '30 minutes early'], answer: 2 },
  { question: 'What reflective model is suggested for placement learning?', options: ['Driscoll', 'Kolb', 'Gibbs\' Reflective Cycle', 'Johns'], answer: 2 },
  { question: 'If you witness poor practice on placement, what should you do?', options: ['Copy it to fit in', 'Ignore it', 'Report your concerns to your mentor or academic assessor', 'Discuss it on social media'], answer: 2 },
  { question: 'What does the acronym PAD stand for?', options: ['Personal Assessment Document', 'Practice Assessment Document', 'Placement Administration Document', 'Professional Assessment Diary'], answer: 1 },
  { question: 'Which phrase is most helpful when you do not know how to do something?', options: ['"I already know that"', '"I haven\'t done this before, can you show me?"', '"I\'ll figure it out myself"', '"Someone else can do it"'], answer: 1 },
  { question: 'What should you do if you make a mistake on placement?', options: ['Hide it', 'Own it immediately and report honestly', 'Wait until the shift ends', 'Tell another student only'], answer: 1 },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.ps-guide *, .ps-guide *::before, .ps-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.ps-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.ps-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.ps-back {
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
.ps-back:hover { color: #555; }
.ps-back-arrow { font-style: normal; }

/* Masthead */
.ps-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.ps-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.ps-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.ps-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
}

/* Pearl */
.ps-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.ps-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.ps-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Step sections */
.ps-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 24px;
}

.ps-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.ps-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.ps-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.ps-step-content {
  padding-left: 32px;
}

.ps-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.ps-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.ps-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ps-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ps-content-col:last-child { border-right: none; }

.ps-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.ps-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ps-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.ps-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* 2-column grid */
.ps-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ps-grid-2-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ps-grid-2-col:last-child { border-right: none; }

/* Red flags */
.ps-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.ps-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.ps-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Golden rules grid */
.ps-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.ps-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.ps-golden-cell:last-child { border-right: none; }

.ps-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.ps-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.ps-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Section headings */
.ps-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 18px;
  padding-top: 24px;
  margin-top: 36px;
  padding-bottom: 16px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

/* Challenge cards */
.ps-challenge {
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 16px 20px;
  margin-bottom: 6px;
}

.ps-challenge-title {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 4px;
}

.ps-challenge-text {
  font-size: 12px;
  color: #5A5750;
  font-weight: 300;
  line-height: 1.6;
  margin: 0;
}

/* Step colour system */
.ps-letter-1 { color: #185FA5; }
.ps-badge-1 { background: #E6F1FB; color: #0C447C; }
.ps-letter-2 { color: #0F6E56; }
.ps-badge-2 { background: #E1F5EE; color: #085041; }
.ps-letter-3 { color: #993C1D; }
.ps-badge-3 { background: #FAECE7; color: #712B13; }
.ps-letter-4 { color: #534AB7; }
.ps-badge-4 { background: #EEEDFE; color: #3C3489; }
.ps-letter-5 { color: #5F5E5A; }
.ps-badge-5 { background: #F1EFE8; color: #444441; }
.ps-letter-6 { color: #8B5E3C; }
.ps-badge-6 { background: #F5EDE6; color: #6B4527; }

/* Responsive */
@media (max-width: 800px) {
  .ps-wrap { padding: 24px 18px 60px; }
  .ps-headline { font-size: 32px; }
  .ps-step { grid-template-columns: 1fr; }
  .ps-step-sidebar {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    border-right: none;
    border-bottom: 0.5px solid rgba(0,0,0,0.1);
    padding-bottom: 14px;
    margin-bottom: 18px;
    padding-right: 0;
  }
  .ps-step-content { padding-left: 0; }
  .ps-content-grid { grid-template-columns: 1fr 1fr; }
  .ps-content-col:nth-child(2) { border-right: none; }
  .ps-content-col:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.1); }
  .ps-golden { grid-template-columns: 1fr 1fr; }
  .ps-golden-cell:nth-child(2) { border-right: none; }
  .ps-golden-cell:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.12); }
  .ps-grid-2 { grid-template-columns: 1fr; }
  .ps-grid-2-col { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .ps-grid-2-col:last-child { border-bottom: none; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    num: '1',
    colour: '1',
    name: 'Before Placement Starts',
    subtitle: 'What to sort before day one so you can walk in feeling ready.',
    cols: [
      {
        header: 'Contact & confirm',
        items: [
          'Call or email your placement area',
          'Confirm start time and location',
          'Ask about parking or public transport',
          'Check dress code and uniform policy',
        ],
      },
      {
        header: 'Prepare your kit',
        items: [
          'Clean, ironed uniform',
          'Appropriate footwear',
          'Check Trust policy on jewellery',
          'Pen (black), small notebook',
          'Fob watch, ID badge',
          'Snacks, water bottle',
        ],
      },
      {
        header: 'Know the placement',
        items: [
          'Look up the ward or unit area',
          'Review common conditions seen there',
          'Familiarise yourself with routines',
          'Learn the words used on that ward',
        ],
      },
      {
        header: 'Documents & route',
        items: [
          'Check your PAD or ePAD',
          'Know what you need to achieve',
          'Plan your route in advance',
          'Do a practice run if possible',
          'Account for traffic and parking',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
  {
    num: '2',
    colour: '2',
    name: 'Your First Day',
    subtitle: 'The first day is mostly about getting your bearings, not proving yourself.',
    cols: [
      {
        header: 'Arrive & settle',
        items: [
          'Arrive 15 minutes early',
          'Find where to go and sign in',
          'Settle your nerves',
        ],
      },
      {
        header: 'Introduce yourself',
        items: [
          '"Hi, I\'m [name], a Year [X] student nurse"',
          '"This is my first day"',
          'Meet your mentor or supervisor',
          'Discuss learning objectives together',
        ],
      },
      {
        header: 'Orientation',
        items: [
          'Get a tour of the ward',
          'Fire exits and toilets',
          'Staff room and supplies',
          'Emergency equipment location',
        ],
      },
      {
        header: 'Record key info',
        items: [
          'Ward phone number',
          'Key contacts list',
          'Handover times',
          'Meal break times',
          'Observe and absorb on day one',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
  {
    num: '3',
    colour: '3',
    name: 'Building Relationships',
    subtitle: 'The working relationships that make placement work well.',
    cols: [
      {
        header: 'With your mentor',
        items: [
          'Be proactive, do not wait to be told',
          'Ask for feedback regularly',
          'Share your learning objectives early',
          'Be honest about what you can and cannot do',
          'Thank them for their time and teaching',
        ],
      },
      {
        header: 'With the team',
        items: [
          'Learn everyone\'s names (write them down)',
          'Offer help with small tasks',
          'Be reliable and follow through',
          'Show enthusiasm and willingness',
          'Respect all roles: HCAs, cleaners, porters',
        ],
      },
      {
        header: 'With patients',
        items: [
          'Introduce yourself clearly with your role',
          'Use their preferred name (ask)',
          'Make eye contact and actively listen',
          'Explain what you are doing and why',
          'Maintain privacy and dignity always',
        ],
      },
      {
        header: 'Magic phrases',
        items: [
          '"Can I help with that?"',
          '"I haven\'t done this before, can you show me?"',
          '"I\'m not sure, let me find out"',
          '"Can I observe this procedure?"',
          '"Could you give me some feedback?"',
          '"Is there anything else I can do?"',
          '"Thank you for showing me that"',
          '"I need to escalate this"',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
  {
    num: '4',
    colour: '4',
    name: 'Common Challenges',
    subtitle: 'What usually goes wrong, and what to do about it.',
    cols: [],
    challenges: [
      { challenge: 'Feeling like you\'re in the way', solution: 'This is normal. Ask "where would be helpful for me to stand?" Stay close to your mentor. Offer to get supplies or help with small tasks.' },
      { challenge: 'Not knowing what to do', solution: 'Ask. "What would you like me to focus on today?" Use quiet time to review notes, read care plans, or observe documentation.' },
      { challenge: 'Difficult mentor relationship', solution: 'Stay professional. Try to understand their perspective. If serious, speak to your Academic Assessor or placement coordinator early.' },
      { challenge: 'Witnessing poor practice', solution: 'Do not copy it. Speak to your mentor or academic if unsure. Remember your duty to report concerns about patient safety.' },
      { challenge: 'Making a mistake', solution: 'Own it immediately. Report it honestly. Learn from it. Everyone makes mistakes \u2014 it is how you handle them that matters.' },
      { challenge: 'Emotional situations', solution: 'It is okay to be affected. Take a moment if needed. Debrief with your mentor. Reflect on it. Seek support if struggling.' },
      { challenge: 'Long shifts and exhaustion', solution: 'Prepare food in advance. Stay hydrated. Rest on days off. It gets easier as you adjust.' },
    ],
    redFlags: [
      'Patient safety concern',
      'Bullying or harassment',
      'Witnessed malpractice',
      'You feel unsafe',
      'Mental health struggling',
      'Needlestick injury',
      'Placement breakdown',
    ],
    pearl: null,
  },
  {
    num: '5',
    colour: '5',
    name: 'Maximising Your Learning',
    subtitle: 'How to get more out of every shift.',
    cols: [
      {
        header: 'Clinical learning',
        items: [
          'Follow a patient\'s full journey',
          'Admission to discharge gives big-picture understanding',
          'Attend MDT meetings and ward rounds',
          'See how the team communicates and decides',
        ],
      },
      {
        header: 'Active questioning',
        items: [
          'Ask "why" questions',
          '"Why do we check that?"',
          '"Why is this medication given?"',
          'Practice skills as often as possible',
          'Repetition builds confidence and competence',
        ],
      },
      {
        header: 'Use quiet time',
        items: [
          'Review patient notes',
          'Learn the language of the ward',
          'Read how conditions progress',
          'Study policies and procedures',
          'Ask questions about equipment',
        ],
      },
      {
        header: 'PAD & documentation',
        items: [
          'Review your PAD before each placement',
          'Schedule regular meetings with your mentor',
          'Document experiences as you go',
          'Be specific with evidence (use STAR)',
          'Get feedback in writing',
          'Never forge signatures or evidence',
        ],
      },
    ],
    redFlags: [],
    pearl: 'Use Gibbs\' Reflective Cycle as a simple structure: what happened, how you felt, what went well or badly, what it meant, and what you would do next time. Even a short reflection after an important shift often locks in the learning better than just replaying it in your head all evening.',
  },
  {
    num: '6',
    colour: '6',
    name: 'Self-Care on Placement',
    subtitle: 'Looking after yourself so you can look after others.',
    cols: [
      {
        header: 'Physical',
        items: [
          'Eat properly',
          'Stay hydrated',
          'Wear comfortable shoes',
          'Rest on days off',
        ],
      },
      {
        header: 'Emotional',
        items: [
          'Debrief after tough shifts',
          'Talk to someone you trust',
          'It is okay to cry',
          'Seek support if struggling',
        ],
      },
      {
        header: 'Social',
        items: [
          'Stay connected with friends and family',
          'Do not isolate yourself',
          'Share experiences with peers',
        ],
      },
      {
        header: 'Practical',
        items: [
          'Meal prep in advance',
          'Sort uniform the night before',
          'Plan your commute early',
        ],
      },
    ],
    redFlags: [],
    pearl: 'It is okay to have bad days. They do not define you. Imposter syndrome is common, asking for help is a strength, and every registered nurse was once brand new on placement too.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlacementSurvivalPage() {
  return (
    <div className="ps-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ps-wrap">
        {/* Back nav */}
        <Link href="/hub" className="ps-back">
          <span className="ps-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="ps-kicker">Children&apos;s Nursing &middot; Free Resource</p>
        <h1 className="ps-headline">Placement Survival Guide</h1>
        <p className="ps-standfirst">
          The placement advice students usually want someone to say plainly, from the night before to the awkward first week.
        </p>
        <p className="ps-byline">The Nurse Lab · Nursing Hub</p>
        <EditorialSaveButton
          hubItemId="placement-survival"
          hubItemTitle="Placement Survival Guide"
        />

        <div className="ps-pearl" style={{ marginBottom: '40px' }}>
          <p className="ps-pearl-label">Student note</p>
          <p>This page is written for the moments students usually overthink: what to bring, what to say, how to ask for help, and what to do when placement feels awkward, exposing, or overwhelming.</p>
        </div>

        {/* Golden rules */}
        <div className="ps-golden">
          {[
            {
              n: '01',
              title: 'Be proactive',
              text: 'Do not wait to be told what to do. Offer help, ask questions, and show that you want to learn.',
            },
            {
              n: '02',
              title: 'Stay honest',
              text: 'Say what you can and cannot do. Admitting you need help is always safer than pretending you do not.',
            },
            {
              n: '03',
              title: 'Reflect early',
              text: 'Write short reflections after important shifts. They build your portfolio and help you process what happened.',
            },
            {
              n: '04',
              title: 'Ask for feedback',
              text: 'Do not wait until the end of placement. Regular check-ins keep surprises out of your final assessment.',
            },
          ].map((cell) => (
            <div key={cell.n} className="ps-golden-cell">
              <span className="ps-golden-numeral">{cell.n}</span>
              <p className="ps-golden-title">{cell.title}</p>
              <p className="ps-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Step sections */}
        {SECTIONS.map((section) => (
          <div key={section.num} className="ps-step">
            {/* Sidebar */}
            <div className="ps-step-sidebar">
              <span className={`ps-step-letter ps-letter-${section.colour}`}>{section.num}</span>
              <span className={`ps-step-badge ps-badge-${section.colour}`}>{section.name}</span>
            </div>

            {/* Content */}
            <div className="ps-step-content">
              <h2 className="ps-step-name">{section.name}</h2>
              <p className="ps-step-question">{section.subtitle}</p>

              {/* 4-col grid */}
              {section.cols.length > 0 && (
                <div className="ps-content-grid">
                  {section.cols.map((col) => (
                    <div key={col.header} className="ps-content-col">
                      <p className="ps-col-header">{col.header}</p>
                      <ul className="ps-col-list">
                        {col.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Challenge cards (section 4) */}
              {'challenges' in section && section.challenges && (
                <div style={{ marginBottom: '18px' }}>
                  {section.challenges.map((item: { challenge: string; solution: string }) => (
                    <div key={item.challenge} className="ps-challenge">
                      <p className="ps-challenge-title">{item.challenge}</p>
                      <p className="ps-challenge-text">{item.solution}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Red flags */}
              {section.redFlags.length > 0 && (
                <>
                  <p className="ps-redflags-label">When to escalate</p>
                  <div className="ps-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="ps-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Pearl */}
              {section.pearl && (
                <div className="ps-pearl">
                  <p className="ps-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

        <SelfTestQuiz title="Test Yourself: Placement Survival" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'NMC (2018)', title: 'The Code: Professional standards of practice and behaviour for nurses', href: 'https://www.nmc.org.uk/standards/code/' },
          { citation: 'NMC (2018)', title: 'Standards for student supervision and assessment', href: 'https://www.nmc.org.uk/standards-for-education-and-training/standards-for-student-supervision-and-assessment/' },
          { citation: 'RCN', title: 'Student and learner resources', href: 'https://www.rcn.org.uk/' },
        ]} />
    </div>
  );
}
