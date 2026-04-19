'use client';

import { useState } from 'react';
import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.vs-guide *, .vs-guide *::before, .vs-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.vs-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.vs-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.vs-back {
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
.vs-back:hover { color: #555; }
.vs-back-arrow { font-style: normal; }

/* Masthead */
.vs-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.vs-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.vs-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.vs-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
}

/* Golden rules grid */
.vs-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.vs-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.vs-golden-cell:last-child { border-right: none; }

.vs-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.vs-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.vs-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.vs-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 24px;
}

.vs-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.vs-step-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.vs-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.vs-step-content {
  padding-left: 32px;
}

.vs-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.vs-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.vs-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.vs-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.vs-content-col:last-child { border-right: none; }

.vs-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.vs-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.vs-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.vs-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* 2-column grid */
.vs-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.vs-grid-2-cell {
  padding: 18px 16px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.vs-grid-2-cell:nth-child(2n) { border-right: none; }
.vs-grid-2-cell:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.1); }

.vs-cell-title {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #333;
  margin-bottom: 12px;
  font-weight: 400;
  padding-bottom: 8px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

.vs-cell-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.vs-cell-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0 2px 10px;
  font-weight: 300;
  position: relative;
}
.vs-cell-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Red flags */
.vs-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.vs-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.vs-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.vs-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.vs-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.vs-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.vs-section-title {
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

/* Table */
.vs-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 0;
  font-size: 13px;
}

.vs-table th {
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
.vs-table th:last-child { border-right: none; }

.vs-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.vs-table td:last-child { border-right: none; }
.vs-table tr:last-child td { border-bottom: none; }
.vs-table td:first-child { font-weight: 400; color: #2C2A27; }

/* Step colour system */
.vs-numeral-1 { color: #185FA5; }
.vs-badge-1 { background: #E6F1FB; color: #0C447C; }
.vs-numeral-2 { color: #0F6E56; }
.vs-badge-2 { background: #E1F5EE; color: #085041; }
.vs-numeral-3 { color: #993C1D; }
.vs-badge-3 { background: #FAECE7; color: #712B13; }
.vs-numeral-4 { color: #534AB7; }
.vs-badge-4 { background: #EEEDFE; color: #3C3489; }
.vs-numeral-5 { color: #5F5E5A; }
.vs-badge-5 { background: #F1EFE8; color: #444441; }
.vs-numeral-6 { color: #8B5E3C; }
.vs-badge-6 { background: #F5EDE5; color: #6B4529; }

@media (max-width: 800px) {
  .vs-wrap { padding: 24px 18px 60px; }
  .vs-headline { font-size: 34px; }
  .vs-golden { grid-template-columns: repeat(2, 1fr); }
  .vs-golden-cell:nth-child(2) { border-right: none; }
  .vs-golden-cell:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.12); }
  .vs-step { grid-template-columns: 1fr; }
  .vs-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); padding-bottom: 16px; padding-right: 0; margin-bottom: 20px; }
  .vs-step-content { padding-left: 0; }
  .vs-content-grid { grid-template-columns: repeat(2, 1fr); }
  .vs-content-col:nth-child(2) { border-right: none; }
  .vs-content-col:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.1); }
  .vs-grid-2 { grid-template-columns: 1fr; }
  .vs-grid-2-cell { border-right: none; }
  .vs-grid-2-cell:nth-child(n+2) { border-top: 0.5px solid rgba(0,0,0,0.1); }
  .vs-table { font-size: 11px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const vitalSignsData = [
  { ageGroup: 'Newborn', ageRange: '0–28 days', hr: '100–160', rr: '30–60', systolic: '60–90', capRefill: '<3 sec', notes: 'Breathing can look irregular in a well newborn. Short pauses can be normal, but pauses with colour change or bradycardia are not.' },
  { ageGroup: 'Infant', ageRange: '1–12 months', hr: '100–150', rr: '25–50', systolic: '70–100', capRefill: '<2 sec', notes: 'Babies rely heavily on nose breathing, so a blocked nose alone can make feeding and breathing look much harder.' },
  { ageGroup: 'Toddler', ageRange: '1–3 years', hr: '90–140', rr: '20–40', systolic: '80–110', capRefill: '<2 sec', notes: 'Toddlers may cry, fight the obs, and hate strangers. Watch them first if you can, and use parents to help you get a truer baseline.' },
  { ageGroup: 'Pre-school', ageRange: '3–5 years', hr: '80–120', rr: '20–30', systolic: '85–110', capRefill: '<2 sec', notes: 'Simple explanations and distraction usually help more than long instructions.' },
  { ageGroup: 'School-age', ageRange: '6–11 years', hr: '70–110', rr: '16–24', systolic: '90–120', capRefill: '<2 sec', notes: 'They can usually follow the plan if you explain it well. Giving them some choice often improves cooperation.' },
  { ageGroup: 'Adolescent', ageRange: '12–18 years', hr: '60–100', rr: '12–20', systolic: '100–135', capRefill: '<2 sec', notes: 'Obs are getting closer to adult ranges, but privacy, dignity, and confidentiality matter even more.' },
];

const SECTIONS = [
  {
    num: '1',
    colour: '1',
    name: 'Normal Ranges by Age',
    question: 'The numbers you need to know, compared by age group',
    type: 'table' as const,
  },
  {
    num: '2',
    colour: '2',
    name: 'Clinical Notes by Age',
    question: 'What to expect at the bedside for each age group',
    type: 'notes' as const,
  },
  {
    num: '3',
    colour: '3',
    name: 'Airway & Breathing Differences',
    question: 'Why children are not small adults when it comes to breathing',
    type: 'grid' as const,
    cols: [
      {
        header: 'Airway anatomy',
        items: [
          'Head is proportionally larger, so positioning differs from adults',
          'Tongue takes up more room in the mouth',
          'Narrowest point is the cricoid ring, not the vocal cords',
        ],
      },
      {
        header: 'Breathing mechanics',
        items: [
          'Babies under about 6 months rely heavily on nose breathing',
          'They use oxygen faster, so sats can fall quickly when unwell',
        ],
      },
      {
        header: 'Circulation',
        items: [
          'They rely more on heart rate to keep blood moving',
          'They can compensate for a while, then deteriorate quickly',
          'Hypotension is a late and serious sign',
        ],
      },
      {
        header: 'Perfusion clues',
        items: [
          'Cap refill, colour, and behaviour often change before BP does',
          'Think in weight-based amounts, not random adult-style volumes',
        ],
      },
    ],
  },
  {
    num: '4',
    colour: '4',
    name: 'Oxygen Saturation',
    question: 'What to do when the probe number drops',
    type: 'pearl-section' as const,
    pearlLabel: 'Clinical pearl',
    pearlText: 'For most children, sats are usually 95–100%, but always think about the child\'s condition and local guidance. If the reading drops below 94%, do not just stare at the probe. Reassess the child properly, check the trace is believable, and think about whether oxygen or escalation is needed. Normal temperature is still 36.5–37.5\u00b0C across all ages.',
  },
  {
    num: '5',
    colour: '5',
    name: 'Recognising Early Deterioration',
    question: 'The signs that come before the obs chart looks dramatic',
    type: 'deterioration' as const,
  },
  {
    num: '6',
    colour: '6',
    name: 'PEWS',
    question: 'Paediatric Early Warning Score — what it is and why the trend matters',
    type: 'pews' as const,
  },
];

const quizQuestions = [
  { question: 'What is the normal heart rate range for a 6-month-old infant?', options: ['60–100 bpm', '80–120 bpm', '100–150 bpm', '120–180 bpm'], answer: 2, explanation: 'Infants (1–12 months) normally sit around 100–150 bpm, so a number that looks high in an adult can still be normal in a baby.' },
  { question: 'A 2-year-old has a respiratory rate of 45. Is this normal?', options: ['Yes, this is within normal range', 'No, this is tachypnoea', 'No, this is bradypnoea', 'Cannot determine'], answer: 1, explanation: 'Toddlers (1–3 years) usually breathe 20–40 times a minute. A rate of 45 is fast for age, so check the whole child and escalate if other signs look worrying.' },
  { question: 'What capillary refill time is considered abnormal in children?', options: ['>1 second', '>2 seconds', '>5 seconds', '>10 seconds'], answer: 1, explanation: 'Capillary refill over 2 seconds, or over 3 seconds in newborns, is abnormal. It can mean the child is not circulating blood well at the edges of the body.' },
  { question: 'A newborn has a respiratory rate of 55 with occasional pauses of 15 seconds. What should you do?', options: ['Immediate resuscitation', 'This is normal periodic breathing', 'Start oxygen therapy', 'Call 2222'], answer: 1, explanation: 'Newborns can breathe irregularly, with short pauses up to about 20 seconds. It becomes more concerning if the pauses are longer or come with colour change or a slow heart rate.' },
  { question: 'Which vital sign is often the FIRST to change in a deteriorating child?', options: ['Blood pressure', 'Heart rate', 'Temperature', 'Respiratory rate'], answer: 3, explanation: 'Breathing rate is often the earliest clue. Low blood pressure usually shows up later, so do not wait for hypotension before you worry.' },
  { question: 'What is a normal systolic BP for a 4-year-old?', options: ['60–80 mmHg', '85–110 mmHg', '110–130 mmHg', '130–150 mmHg'], answer: 1, explanation: 'A 4-year-old usually sits around 85–110 mmHg systolic. Low blood pressure is a late and serious sign in children.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaedsVitalSignsCheatSheet() {
  return (
    <div className="vs-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="vs-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="vs-back">
          <span className="vs-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="vs-kicker">Children&apos;s Nursing &middot; Free Resource</p>
        <h1 className="vs-headline">Paediatric Vital Signs Cheat Sheet</h1>
        <p className="vs-standfirst">
          The normal numbers students keep checking, plus what they mean at the bedside and which changes should make you pause early.
        </p>
        <p className="vs-byline">The Nurse Lab &middot; Children&apos;s Hub</p>
        <EditorialSaveButton
          hubItemId="paeds-vital-signs-cheat-sheet"
          hubItemTitle="Paediatric Vital Signs Cheat Sheet"
        />

        <div className="vs-pearl" style={{ marginBottom: '40px' }}>
          <p className="vs-pearl-label">Student note</p>
          <p>SpO&#8322; is the oxygen number from the probe. Cap refill is how quickly colour comes back after you press the skin. Escalate means getting help early instead of waiting until the picture is obvious.</p>
        </div>

        {/* Golden rules */}
        <div className="vs-golden">
          {[
            { n: '01', title: 'RR first', text: 'Respiratory rate is often the first clue that a child is getting worse.' },
            { n: '02', title: 'BP is late', text: 'Low blood pressure is late in children, so do not use a normal BP as reassurance on its own.' },
            { n: '03', title: 'Right cuff', text: 'Use the right cuff size for BP, or the number you get may mislead you.' },
            { n: '04', title: 'Trend matters', text: "The trend matters more than one isolated reading, especially if you know the child's usual baseline." },
          ].map((cell) => (
            <div key={cell.n} className="vs-golden-cell">
              <span className="vs-golden-numeral">{cell.n}</span>
              <p className="vs-golden-title">{cell.title}</p>
              <p className="vs-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Section 1: Vital Signs Table */}
        <div className="vs-step">
          <div className="vs-step-sidebar">
            <span className="vs-step-numeral vs-numeral-1">1</span>
            <span className="vs-step-badge vs-badge-1">Ranges</span>
          </div>
          <div className="vs-step-content">
            <h2 className="vs-step-name">Normal Ranges by Age</h2>
            <p className="vs-step-question">The numbers you need to know, compared by age group</p>
            <table className="vs-table" style={{ marginBottom: '18px' }}>
              <thead>
                <tr>
                  <th>Age group</th>
                  <th>Heart rate (bpm)</th>
                  <th>Resp rate (/min)</th>
                  <th>Systolic BP (mmHg)</th>
                  <th>Cap refill</th>
                </tr>
              </thead>
              <tbody>
                {vitalSignsData.map(row => (
                  <tr key={row.ageGroup}>
                    <td>
                      <strong style={{ fontSize: '13px' }}>{row.ageGroup}</strong>
                      <br />
                      <span style={{ fontSize: '11px', color: '#999' }}>{row.ageRange}</span>
                    </td>
                    <td>{row.hr}</td>
                    <td>{row.rr}</td>
                    <td>{row.systolic}</td>
                    <td>{row.capRefill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Clinical Notes */}
        <div className="vs-step">
          <div className="vs-step-sidebar">
            <span className="vs-step-numeral vs-numeral-2">2</span>
            <span className="vs-step-badge vs-badge-2">Notes</span>
          </div>
          <div className="vs-step-content">
            <h2 className="vs-step-name">Clinical Notes by Age</h2>
            <p className="vs-step-question">What to expect at the bedside for each age group</p>
            <div className="vs-grid-2">
              {vitalSignsData.map(row => (
                <div key={row.ageGroup} className="vs-grid-2-cell">
                  <p className="vs-cell-title">{row.ageGroup} <span style={{ fontWeight: 300, color: '#999' }}>({row.ageRange})</span></p>
                  <p style={{ fontSize: '12px', color: '#5A5750', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{row.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Anatomy differences */}
        <div className="vs-step">
          <div className="vs-step-sidebar">
            <span className="vs-step-numeral vs-numeral-3">3</span>
            <span className="vs-step-badge vs-badge-3">Anatomy</span>
          </div>
          <div className="vs-step-content">
            <h2 className="vs-step-name">Why the Same Obs Rules Do Not Fit Every Age</h2>
            <p className="vs-step-question">Children are not small adults when it comes to breathing and circulation</p>
            <div className="vs-content-grid">
              {[
                {
                  header: 'Airway anatomy',
                  items: [
                    'Head is proportionally larger, so positioning differs from adults',
                    'Tongue takes up more room in the mouth',
                    'Narrowest point is the cricoid ring, not the vocal cords',
                  ],
                },
                {
                  header: 'Breathing mechanics',
                  items: [
                    'Babies under about 6 months rely heavily on nose breathing',
                    'They use oxygen faster, so sats can fall quickly when unwell',
                  ],
                },
                {
                  header: 'Circulation',
                  items: [
                    'They rely more on heart rate to keep blood moving',
                    'They can compensate for a while, then deteriorate quickly',
                    'Hypotension is a late and serious sign',
                  ],
                },
                {
                  header: 'Perfusion clues',
                  items: [
                    'Cap refill, colour, and behaviour often change before BP does',
                    'Think in weight-based amounts, not random adult-style volumes',
                  ],
                },
              ].map((col) => (
                <div key={col.header} className="vs-content-col">
                  <p className="vs-col-header">{col.header}</p>
                  <ul className="vs-col-list">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Oxygen Saturation */}
        <div className="vs-step">
          <div className="vs-step-sidebar">
            <span className="vs-step-numeral vs-numeral-4">4</span>
            <span className="vs-step-badge vs-badge-4">SpO&#8322;</span>
          </div>
          <div className="vs-step-content">
            <h2 className="vs-step-name">Oxygen Saturation</h2>
            <p className="vs-step-question">What to do when the probe number drops</p>
            <div className="vs-pearl">
              <p className="vs-pearl-label">Clinical pearl</p>
              <p>For most children, sats are usually 95&ndash;100%, but always think about the child&apos;s condition and local guidance. If the reading drops below 94%, do not just stare at the probe. Reassess the child properly, check the trace is believable, and think about whether oxygen or escalation is needed. Normal temperature is still 36.5&ndash;37.5&deg;C across all ages.</p>
            </div>
          </div>
        </div>

        {/* Section 5: Recognising Deterioration */}
        <div className="vs-step">
          <div className="vs-step-sidebar">
            <span className="vs-step-numeral vs-numeral-5">5</span>
            <span className="vs-step-badge vs-badge-5">Flags</span>
          </div>
          <div className="vs-step-content">
            <h2 className="vs-step-name">Recognising Early Deterioration</h2>
            <p className="vs-step-question">The signs that come before the obs chart looks dramatic</p>

            <div className="vs-pearl" style={{ marginBottom: '18px' }}>
              <p className="vs-pearl-label">Clinical pearl</p>
              <p>Cap refill, colour, effort, and behaviour often change before the obs chart looks dramatic. A child who is quiet, floppy, unusually still, or not responding normally to parents can be much more concerning than one isolated number that still looks &quot;fine&quot;.</p>
            </div>

            <p className="vs-redflags-label">Red flags &mdash; escalate immediately</p>
            <div className="vs-redflags">
              {[
                'Floppy child not responding to parents',
                'Weak or absent cry',
                'Mottled or grey skin colour',
                'Grunting (sign of respiratory distress)',
                'Non-blanching rash',
                'RR or HR outside normal range',
                'CRT >2 seconds (>3 seconds newborn)',
                'SpO\u2082 <94%',
              ].map(f => <span key={f} className="vs-red-pill">{f}</span>)}
            </div>
          </div>
        </div>

        {/* Section 6: PEWS */}
        <div className="vs-step">
          <div className="vs-step-sidebar">
            <span className="vs-step-numeral vs-numeral-6">6</span>
            <span className="vs-step-badge vs-badge-6">PEWS</span>
          </div>
          <div className="vs-step-content">
            <h2 className="vs-step-name">PEWS &mdash; Paediatric Early Warning Score</h2>
            <p className="vs-step-question">What it is and why the trend matters</p>
            <div className="vs-pearl">
              <p className="vs-pearl-label">Clinical pearl</p>
              <p>Your trust will have a PEWS chart, or something close to it. It turns behaviour, breathing, and circulation into a score that helps show how worried the team should be. The score matters, but the direction matters even more: a rising score is often the real warning sign.</p>
            </div>
          </div>
        </div>

        {/* Quiz */}
        <h2 className="vs-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Paediatric Vital Signs" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'NICE (2016)', title: 'Sepsis: recognition, diagnosis and early management (NG51)', href: 'https://www.nice.org.uk/guidance/ng51' },
          { citation: 'Advanced Life Support Group (2021)', title: 'Advanced Paediatric Life Support (7th edn)', href: 'https://alsg.org/en/' },
          { citation: 'RCPCH (2020)', title: 'Paediatric vital signs and clinical assessment guidance', href: 'https://www.rcpch.ac.uk/' },
          { citation: 'Resuscitation Council UK (2021)', title: '2021 Resuscitation Guidelines', href: 'https://www.resus.org.uk/library/2021-resuscitation-guidelines' },
        ]} />
      </div>
    </div>
  );
}
