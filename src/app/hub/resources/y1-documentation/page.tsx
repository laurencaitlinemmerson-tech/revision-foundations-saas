'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const quizQuestions = [
  { question: 'What does SBAR stand for?', options: ['Situation, Background, Assessment, Recommendation', 'Summary, Brief, Action, Report', 'Situation, Baseline, Anxiety, Referral', 'Standard, Background, Analysis, Review'], answer: 0 },
  { question: 'How should you correct an error in paper records?', options: ['Use correction fluid', 'Erase and rewrite', 'Single line through, sign, and date', 'Scribble it out heavily'], answer: 2 },
  { question: 'When should medication administration be documented?', options: ['Before giving the drug', 'At the end of the shift', 'Immediately after giving it', 'The next morning'], answer: 2 },
  { question: 'What ink colour should handwritten notes use?', options: ['Blue', 'Black', 'Red', 'Any colour'], answer: 1 },
  { question: 'How long are children\'s health records usually retained?', options: ['5 years', '8 years', '15 years', '25 years'], answer: 3 },
  { question: 'What is the "S" in SBAR?', options: ['Summary', 'Situation', 'Safety', 'Standard'], answer: 1 },
  { question: 'Which body sets the record keeping standards for nurses in the UK?', options: ['CQC', 'GMC', 'NMC', 'NHS England'], answer: 2 },
  { question: 'Which of these is an example of POOR documentation?', options: ['"Patient fine"', '"Pain reduced from 7/10 to 3/10 post-analgesia"', '"BP 128/76, HR 72, RR 16"', '"Dr Patel reviewed at 10:15"'], answer: 0 },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.dc-guide *, .dc-guide *::before, .dc-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.dc-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.dc-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.dc-back {
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
.dc-back:hover { color: #555; }
.dc-back-arrow { font-style: normal; }

/* Masthead */
.dc-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.dc-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.dc-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.dc-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
}

/* Pearl */
.dc-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.dc-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.dc-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Step sections */
.dc-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 24px;
}

.dc-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.dc-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.dc-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.dc-step-content {
  padding-left: 32px;
}

.dc-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.dc-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.dc-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.dc-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.dc-content-col:last-child { border-right: none; }

.dc-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.dc-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dc-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.dc-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* 2-column grid */
.dc-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.dc-grid-2-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.dc-grid-2-col:last-child { border-right: none; }

/* Red flags */
.dc-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.dc-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.dc-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Golden rules grid */
.dc-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.dc-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.dc-golden-cell:last-child { border-right: none; }

.dc-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.dc-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.dc-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Table */
.dc-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 18px;
  font-size: 13px;
}

.dc-table th {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  font-weight: 400;
  padding: 11px 16px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  border-right: 0.5px solid rgba(0,0,0,0.1);
  text-align: left;
  background: #F5F3F0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.dc-table th:last-child { border-right: none; }

.dc-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.dc-table td:last-child { border-right: none; }
.dc-table tr:last-child td { border-bottom: none; }
.dc-table td:first-child { font-weight: 400; color: #2C2A27; }

/* Section headings */
.dc-section-title {
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

/* Good-label (green variant) */
.dc-good-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #2E7D32;
  margin-bottom: 7px;
}

/* Step colour system */
.dc-letter-1 { color: #185FA5; }
.dc-badge-1 { background: #E6F1FB; color: #0C447C; }
.dc-letter-2 { color: #0F6E56; }
.dc-badge-2 { background: #E1F5EE; color: #085041; }
.dc-letter-3 { color: #993C1D; }
.dc-badge-3 { background: #FAECE7; color: #712B13; }
.dc-letter-4 { color: #534AB7; }
.dc-badge-4 { background: #EEEDFE; color: #3C3489; }
.dc-letter-5 { color: #5F5E5A; }
.dc-badge-5 { background: #F1EFE8; color: #444441; }
.dc-letter-6 { color: #8B5E3C; }
.dc-badge-6 { background: #F5EDE6; color: #6B4527; }

/* Responsive */
@media (max-width: 800px) {
  .dc-wrap { padding: 24px 18px 60px; }
  .dc-headline { font-size: 32px; }
  .dc-step { grid-template-columns: 1fr; }
  .dc-step-sidebar {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    border-right: none;
    border-bottom: 0.5px solid rgba(0,0,0,0.1);
    padding-bottom: 14px;
    margin-bottom: 18px;
    padding-right: 0;
  }
  .dc-step-content { padding-left: 0; }
  .dc-content-grid { grid-template-columns: 1fr 1fr; }
  .dc-content-col:nth-child(2) { border-right: none; }
  .dc-content-col:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.1); }
  .dc-golden { grid-template-columns: 1fr 1fr; }
  .dc-golden-cell:nth-child(2) { border-right: none; }
  .dc-golden-cell:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.12); }
  .dc-grid-2 { grid-template-columns: 1fr; }
  .dc-grid-2-col { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .dc-grid-2-col:last-child { border-bottom: none; }
}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Y1DocumentationPage() {
  return (
    <div className="dc-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="dc-wrap">
        {/* Back nav */}
        <Link href="/hub" className="dc-back">
          <span className="dc-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="dc-kicker">Year 1 Essentials &middot; Free Resource</p>
        <h1 className="dc-headline">Documentation &amp; Record Keeping</h1>
        <p className="dc-standfirst">
          How to write notes that are clear, useful, and safe, without overcomplicating what good documentation looks like.
        </p>
        <p className="dc-byline">The Nurse Lab · Nursing Hub</p>
        <EditorialSaveButton
          hubItemId="y1-documentation"
          hubItemTitle="Documentation & Record Keeping"
        />

        <div className="dc-pearl" style={{ marginBottom: '40px' }}>
          <p className="dc-pearl-label">Student note</p>
          <p>Good documentation is not about sounding impressive. It is about helping the next person understand what happened, what you did, what changed, and what needs doing next.</p>
        </div>

        {/* Golden rules */}
        <div className="dc-golden">
          {[
            {
              n: '01',
              title: 'Write for the next reader',
              text: 'Good records help care stay joined up between shifts, protect both you and the patient, and support team communication.',
            },
            {
              n: '02',
              title: 'Document promptly',
              text: 'Write things down as soon as it is safe to do so. Memories fade quickly, and contemporaneous notes carry more weight.',
            },
            {
              n: '03',
              title: 'Be specific',
              text: '"Patient fine" tells the next person nothing. Say what you observed, what you did, and what changed.',
            },
            {
              n: '04',
              title: 'Follow NMC standards',
              text: 'The Nursing and Midwifery Council sets the standards for record keeping. They are also part of your professional accountability.',
            },
          ].map((cell) => (
            <div key={cell.n} className="dc-golden-cell">
              <span className="dc-golden-numeral">{cell.n}</span>
              <p className="dc-golden-title">{cell.title}</p>
              <p className="dc-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Section 1: NMC Standards */}
        <div className="dc-step">
          <div className="dc-step-sidebar">
            <span className="dc-step-letter dc-letter-1">1</span>
            <span className="dc-step-badge dc-badge-1">Standards</span>
          </div>
          <div className="dc-step-content">
            <h2 className="dc-step-name">NMC Record Keeping Standards</h2>
            <p className="dc-step-question">What your notes need to be, every time.</p>

            <div className="dc-content-grid">
              {[
                {
                  header: 'Clear & accurate',
                  items: [
                    'Factual and consistent',
                    'No jargon patients would not understand',
                    'Written in plain English where possible',
                  ],
                },
                {
                  header: 'Legible & timely',
                  items: [
                    'If handwritten, must be readable',
                    'Use black ink',
                    'Documented as soon as possible after care',
                  ],
                },
                {
                  header: 'Signed & dated',
                  items: [
                    'Full name and designation',
                    'Date and time on every entry',
                    'Contemporaneous: written at the time or as soon after as safe',
                  ],
                },
                {
                  header: 'No alterations',
                  items: [
                    'No correction fluid',
                    'Single line through errors',
                    'Sign and date the correction',
                    'Write the correct information nearby',
                  ],
                },
              ].map((col) => (
                <div key={col.header} className="dc-content-col">
                  <p className="dc-col-header">{col.header}</p>
                  <ul className="dc-col-list">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: SBAR */}
        <div className="dc-step">
          <div className="dc-step-sidebar">
            <span className="dc-step-letter dc-letter-2">2</span>
            <span className="dc-step-badge dc-badge-2">SBAR</span>
          </div>
          <div className="dc-step-content">
            <h2 className="dc-step-name">SBAR &mdash; Structured Communication</h2>
            <p className="dc-step-question">A four-part structure for handing over clearly, escalating concerns, and recording phone calls to doctors.</p>

            <div className="dc-content-grid">
              {[
                {
                  header: 'S \u2014 Situation',
                  items: [
                    'What is happening right now?',
                    '"I\'m calling about Mr Smith in bed 4 who has become acutely short of breath"',
                  ],
                },
                {
                  header: 'B \u2014 Background',
                  items: [
                    'What is the clinical context?',
                    '"He\'s 78, admitted with COPD exacerbation yesterday, was stable on 2L O\u2082"',
                  ],
                },
                {
                  header: 'A \u2014 Assessment',
                  items: [
                    'What do you think the problem is?',
                    '"O\u2082 sats 85%, RR 28, NEWS 7 \u2014 I\'m concerned he\'s deteriorating"',
                  ],
                },
                {
                  header: 'R \u2014 Recommendation',
                  items: [
                    'What do you need?',
                    '"I\'d like you to come and review him urgently please"',
                  ],
                },
              ].map((col) => (
                <div key={col.header} className="dc-content-col">
                  <p className="dc-col-header">{col.header}</p>
                  <ul className="dc-col-list">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Good vs Poor */}
        <div className="dc-step">
          <div className="dc-step-sidebar">
            <span className="dc-step-letter dc-letter-3">3</span>
            <span className="dc-step-badge dc-badge-3">Examples</span>
          </div>
          <div className="dc-step-content">
            <h2 className="dc-step-name">Good vs Poor Documentation</h2>
            <p className="dc-step-question">Side by side, so you can see the difference.</p>

            <div className="dc-grid-2">
              <div className="dc-grid-2-col">
                <p className="dc-redflags-label">Poor documentation</p>
                <ul className="dc-col-list">
                  {[
                    '"Patient fine"',
                    '"Meds given"',
                    '"Obs done"',
                    '"Pt slept well"',
                    '"Reviewed by Dr"',
                    '"Pain managed"',
                  ].map((bad) => (
                    <li key={bad}>{bad}</li>
                  ))}
                </ul>
              </div>
              <div className="dc-grid-2-col">
                <p className="dc-good-label">Good documentation</p>
                <ul className="dc-col-list">
                  {[
                    '"Patient reports pain reduced from 7/10 to 3/10 post-analgesia"',
                    '"Paracetamol 1g PO administered at 14:30 as prescribed for headache"',
                    '"0800 obs: BP 128/76, HR 72, RR 16, SpO\u2082 98% RA, Temp 36.8\u00b0C"',
                    '"Dr Patel reviewed at 10:15 \u2014 plan: continue treatment, repeat bloods tomorrow"',
                  ].map((good) => (
                    <li key={good}>{good}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Correcting Errors */}
        <div className="dc-step">
          <div className="dc-step-sidebar">
            <span className="dc-step-letter dc-letter-4">4</span>
            <span className="dc-step-badge dc-badge-4">Corrections</span>
          </div>
          <div className="dc-step-content">
            <h2 className="dc-step-name">Correcting Documentation Errors</h2>
            <p className="dc-step-question">What to do when you write something wrong.</p>

            <div className="dc-grid-2">
              <div className="dc-grid-2-col">
                <p className="dc-col-header">Paper records</p>
                <ul className="dc-col-list">
                  <li>Draw a single line through the error (keep it readable)</li>
                  <li>Write &ldquo;written in error&rdquo; next to it</li>
                  <li>Sign and date the correction</li>
                  <li>Write the correct information nearby</li>
                </ul>
              </div>
              <div className="dc-grid-2-col">
                <p className="dc-col-header">Electronic records</p>
                <ul className="dc-col-list">
                  <li>Use the system&apos;s amendment or addendum function</li>
                  <li>Never delete &mdash; add a note explaining the correction</li>
                  <li>Systems create an automatic audit trail</li>
                  <li>Follow your Trust&apos;s specific policy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Confidentiality */}
        <div className="dc-step">
          <div className="dc-step-sidebar">
            <span className="dc-step-letter dc-letter-5">5</span>
            <span className="dc-step-badge dc-badge-5">Privacy</span>
          </div>
          <div className="dc-step-content">
            <h2 className="dc-step-name">Confidentiality &amp; Data Protection</h2>
            <p className="dc-step-question">How to handle patient information safely.</p>

            <div className="dc-grid-2">
              <div className="dc-grid-2-col">
                <p className="dc-col-header">Key rules</p>
                <ul className="dc-col-list">
                  <li>Never share login credentials</li>
                  <li>Log out when leaving a computer</li>
                  <li>Do not leave records visible or unattended</li>
                  <li>Only access records you need for care</li>
                  <li>Do not discuss patients in public areas</li>
                  <li>Do not take photos of records or patients</li>
                  <li>Follow Caldicott Principles: share only what is needed, with the right people, for the right reason</li>
                </ul>
              </div>
              <div className="dc-grid-2-col">
                <p className="dc-col-header">Caldicott Principles in plain English</p>
                <ul className="dc-col-list">
                  <li>Have a clear reason for sharing information</li>
                  <li>Only use it if it is genuinely necessary</li>
                  <li>Share the minimum amount needed</li>
                  <li>Only let people access it if they need to know</li>
                  <li>Make sure everyone understands their responsibility</li>
                  <li>Follow the law and local policy</li>
                  <li>Remember that sharing important information can be just as important as protecting it</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Timing & Retention */}
        <div className="dc-step">
          <div className="dc-step-sidebar">
            <span className="dc-step-letter dc-letter-6">6</span>
            <span className="dc-step-badge dc-badge-6">Timing</span>
          </div>
          <div className="dc-step-content">
            <h2 className="dc-step-name">Documentation Timing &amp; Retention</h2>
            <p className="dc-step-question">When to write things down, and how long records are kept.</p>

            <table className="dc-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>When to document</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Medication administration</td>
                  <td>Immediately after giving</td>
                </tr>
                <tr>
                  <td>Significant events</td>
                  <td>As soon as it is safe to do so</td>
                </tr>
                <tr>
                  <td>Escalations or doctor calls</td>
                  <td>Document straight away, with the time</td>
                </tr>
                <tr>
                  <td>Deteriorating patient</td>
                  <td>In real time if possible</td>
                </tr>
                <tr>
                  <td>Record retention (adults)</td>
                  <td>Usually 8 years</td>
                </tr>
                <tr>
                  <td>Record retention (children / maternity)</td>
                  <td>Usually 25 years</td>
                </tr>
              </tbody>
            </table>

            {/* Red flags: unsafe notes */}
            <p className="dc-redflags-label">Things that make notes unsafe</p>
            <div className="dc-redflags">
              {[
                'Document before care is given',
                'Use correction fluid or erase',
                'Leave blank spaces',
                'Use unprofessional language',
                'Include personal opinions',
                'Copy-paste without checking',
                'Use unapproved abbreviations',
                'Document on behalf of someone else',
              ].map((flag) => (
                <span key={flag} className="dc-red-pill">{flag}</span>
              ))}
            </div>

            {/* Red flags: critical moments */}
            <p className="dc-redflags-label" style={{ marginTop: '14px' }}>When documentation is critical</p>
            <div className="dc-redflags">
              {[
                'Patient deterioration',
                'Medication errors',
                'Falls or incidents',
                'Patient complaints',
                'Capacity assessments',
                'Safeguarding concerns',
                'End of life decisions',
              ].map((flag) => (
                <span key={flag} className="dc-red-pill">{flag}</span>
              ))}
            </div>
          </div>
        </div>

        <SelfTestQuiz title="Test Yourself: Documentation & Record Keeping" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'NMC (2018)', title: 'The Code: Professional standards of practice and behaviour for nurses', href: 'https://www.nmc.org.uk/standards/code/' },
          { citation: 'NMC (2019)', title: 'The professional duty of candour', href: 'https://www.nmc.org.uk/standards/guidance/the-professional-duty-of-candour/' },
          { citation: 'ICO', title: 'Guide to UK GDPR — data protection for health records', href: 'https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/' },
          { citation: 'NHS England', title: 'Records management code of practice', href: 'https://www.england.nhs.uk/ig/records-management/' },
        ]} />
      </div>
    </div>
  );
}
