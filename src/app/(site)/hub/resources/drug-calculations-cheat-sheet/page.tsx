'use client';
/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const quizQuestions = [
  { question: 'What is the basic drug calculation formula?', options: ['Dose ÷ Volume × Stock', 'What you want ÷ What you have × Volume', 'Volume × Rate ÷ Time', 'Stock × Dose ÷ Rate'], answer: 1 },
  { question: 'A child needs 250mg of amoxicillin. The suspension contains 125mg per 5ml. How much do you give?', options: ['5ml', '10ml', '15ml', '2.5ml'], answer: 1 },
  { question: 'How many micrograms are in 1 milligram?', options: ['100', '500', '1,000', '10,000'], answer: 2 },
  { question: 'What is the IV drip rate formula?', options: ['Volume × Time', 'Volume ÷ Time (hours)', 'Volume × Drop factor ÷ Time (minutes)', 'Rate × Volume'], answer: 2 },
  { question: 'A patient needs 500ml of fluid over 4 hours. What rate do you set the pump to?', options: ['100 ml/hr', '125 ml/hr', '150 ml/hr', '200 ml/hr'], answer: 1 },
  { question: 'Why should you NEVER abbreviate micrograms as µg in handwriting?', options: ['It is old-fashioned', 'It looks like mg, which is 1000 times larger', 'It takes too long to write', 'Pharmacists do not recognise it'], answer: 1 },
  { question: 'A paediatric giving set delivers how many drops per ml?', options: ['15', '20', '60', '100'], answer: 2 },
  { question: 'What should you do if a calculated dose looks unusually large or small?', options: ['Give it anyway', 'Round it to the nearest whole number', 'Stop and recheck before giving', 'Give half and see what happens'], answer: 2 },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.dc-guide *, .dc-guide *::before, .dc-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.dc-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
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
  color: var(--ink-faint);
  text-decoration: none;
  margin-bottom: 44px;
}
.dc-back:hover { color: var(--ink-soft); }
.dc-back-arrow { font-style: normal; }

/* Masthead */
.dc-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.dc-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.dc-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.dc-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

/* Pearl / info callout */
.dc-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.dc-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.dc-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Golden rules grid */
.dc-golden {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.dc-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.dc-golden-cell:last-child { border-right: none; }

.dc-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
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

.dc-golden-text a {
  color: var(--amber-800);
  text-decoration: underline;
}

/* Step sections */
.dc-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.dc-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.dc-step-numeral {
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
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.dc-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

/* Formula box */
.dc-formula {
  font-family: 'Courier New', Courier, monospace;
  font-size: 18px;
  text-align: center;
  padding: 20px;
  background: var(--surface-sunken);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
  color: var(--ink-strong);
}

.dc-formula-sm {
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
  padding: 10px 14px;
  background: var(--surface-sunken);
  border: 0.5px solid var(--hairline-firm);
  color: var(--ink-strong);
  margin-top: 8px;
}

/* 4-column content grid */
.dc-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.dc-content-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.dc-content-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.dc-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.dc-content-col:last-child { border-right: none; }

.dc-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.dc-col-text {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  font-weight: 300;
}

.dc-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dc-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
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
  color: var(--ink-faint);
}

/* Red flags */
.dc-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
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
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Section headings */
.dc-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 18px;
  padding-top: 24px;
  margin-top: 36px;
  padding-bottom: 16px;
  border-top: 0.5px solid var(--hairline-firm);
  border-bottom: 0.5px solid var(--hairline-firm);
}

/* Table */
.dc-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.dc-table th {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  font-weight: 400;
  padding: 11px 16px;
  border-bottom: 0.5px solid var(--hairline-firm);
  border-right: 0.5px solid var(--hairline-firm);
  text-align: left;
  background: var(--surface-sunken);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.dc-table th:last-child { border-right: none; }

.dc-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.dc-table td:last-child { border-right: none; }
.dc-table tr:last-child td { border-bottom: none; }
.dc-table td:first-child { font-weight: 400; color: var(--ink-mid); }

/* Staircase */
.dc-stair-step {
  display: flex;
  align-items: stretch;
}

.dc-stair-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  border-top: 0.5px solid var(--hairline-firm);
  border-left: 0.5px solid var(--hairline-firm);
  border-right: 0.5px solid var(--hairline-firm);
  padding: 14px 20px;
}

.dc-stair-unit {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-style: italic;
  font-weight: 400;
  min-width: 52px;
}

.dc-stair-label {
  font-size: 12px;
  color: var(--ink-faint);
  font-weight: 300;
  letter-spacing: 0.06em;
}

.dc-stair-arrow {
  margin-left: auto;
  font-size: 11px;
  color: var(--ink-soft);
  font-weight: 300;
}

/* Step colour system */
.dc-numeral-1 { color: var(--blue-600); }
.dc-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.dc-numeral-2 { color: var(--teal-600); }
.dc-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.dc-numeral-3 { color: var(--coral-600); }
.dc-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.dc-numeral-4 { color: var(--purple-600); }
.dc-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.dc-numeral-5 { color: var(--gray-600); }
.dc-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.dc-numeral-6 { color: #8B5E3C; }
.dc-badge-6 { background: var(--surface-sunken); color: #6B4529; }

/* Responsive */
@media (max-width: 800px) {
  .dc-wrap { padding: 24px 20px 60px; }
  .dc-headline { font-size: 34px; }
  .dc-golden { grid-template-columns: 1fr; }
  .dc-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .dc-golden-cell:last-child { border-bottom: none; }
  .dc-step { grid-template-columns: 1fr; }
  .dc-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid var(--hairline-firm); padding-bottom: 12px; padding-right: 0; margin-bottom: 16px; }
  .dc-step-numeral { font-size: 48px; }
  .dc-step-content { padding-left: 0; }
  .dc-content-grid, .dc-content-grid-3, .dc-content-grid-2 { grid-template-columns: 1fr 1fr; }
  .dc-content-col { border-bottom: 0.5px solid var(--hairline-firm); }
  .dc-formula { font-size: 14px; }
}

@media (max-width: 500px) {
  .dc-content-grid, .dc-content-grid-3, .dc-content-grid-2 { grid-template-columns: 1fr; }
  .dc-content-col { border-right: none; }
}
`;


// ─── Component ────────────────────────────────────────────────────────────────

export default function DrugCalculationsCheatSheetPage() {
  return (
    <div className="dc-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="dc-wrap">
        {/* Back nav */}
        <Link href="/hub" className="dc-back">
          <span className="dc-back-arrow">←</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="dc-kicker">Medication Safety · Paediatric Calculations</p>
        <h1 className="dc-headline">Drug Calculations Cheat Sheet</h1>
        <p className="dc-standfirst">
          The formulas students keep coming back to for oral meds, IV rates, and paediatric maths, explained without the extra noise.
        </p>
        <p className="dc-byline">The Nurse Lab · Nursing Hub</p>
        <EditorialSaveButton
          hubItemId="drug-calculations-cheat-sheet"
          hubItemTitle="Drug Calculations Cheat Sheet"
        />

        {/* Student note */}
        <div className="dc-pearl" style={{ marginBottom: '40px' }}>
          <p className="dc-pearl-label">Student note</p>
          <p>
            This page is for the maths part only. Set the question up calmly, write each step out, and sense-check the answer at the end. If the final number looks wildly too big or too small, that is your cue to stop and rework it before anything is given.
          </p>
        </div>

        {/* Golden rules / orientation grid */}
        <div className="dc-golden">
          <div className="dc-golden-cell">
            <p className="dc-golden-title">Come here for</p>
            <p className="dc-golden-text">Oral formulas, IV drip rates, pump rates, and paediatric dose maths in one place.</p>
          </div>
          <div className="dc-golden-cell">
            <p className="dc-golden-title">If you were looking for</p>
            <p className="dc-golden-text">The old paediatric dose calculator or IV drip-rate page, it all lives here now so you are not jumping between near-duplicate pages.</p>
          </div>
          <div className="dc-golden-cell">
            <p className="dc-golden-title">Pair it with</p>
            <p className="dc-golden-text">
              <Link href="/hub/resources/9-rights-medication" className="dc-golden-text" style={{ color: 'var(--amber-800)', textDecoration: 'underline' }}>
                9 Rights of Medication Administration
              </Link>{' '}
              for the safety checks and{' '}
              <Link href="/hub/resources/medication-abbreviations" className="dc-golden-text" style={{ color: 'var(--amber-800)', textDecoration: 'underline' }}>
                Medication Abbreviations Guide
              </Link>{' '}
              for chart shorthand.
            </p>
          </div>
        </div>

        {/* ── Section 1: Main Formula ── */}
        <div className="dc-step">
          <div className="dc-step-sidebar">
            <span className="dc-step-numeral dc-numeral-1">1</span>
            <span className="dc-step-badge dc-badge-1">Oral</span>
          </div>
          <div className="dc-step-content">
            <h2 className="dc-step-name">The Main Formula</h2>
            <p className="dc-step-question">The one you will use most — oral liquids and tablets</p>

            <div className="dc-formula">Need ÷ Have × Stock</div>

            <div className="dc-content-grid-3">
              <div className="dc-content-col">
                <p className="dc-col-header">Need</p>
                <p className="dc-col-text">What the chart says the patient should have.</p>
              </div>
              <div className="dc-content-col">
                <p className="dc-col-header">Have</p>
                <p className="dc-col-text">The strength you actually have in your hand, per tablet or per ml.</p>
              </div>
              <div className="dc-content-col">
                <p className="dc-col-header">Stock</p>
                <p className="dc-col-text">The amount that strength comes in, such as 5 ml or 1 tablet.</p>
              </div>
            </div>

            <div className="dc-content-grid-2">
              <div className="dc-content-col">
                <p className="dc-col-header">Worked example — oral liquid</p>
                <p className="dc-col-text">Child needs 150mg ibuprofen. You have ibuprofen 100mg/5ml.</p>
                <div className="dc-formula-sm">150 ÷ 100 × 5 = 7.5ml</div>
              </div>
              <div className="dc-content-col">
                <p className="dc-col-header">Worked example — tablets</p>
                <p className="dc-col-text">Patient needs 7.5mg bisoprolol. You have 5mg tablets.</p>
                <div className="dc-formula-sm">7.5 ÷ 5 × 1 = 1.5 tablets</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: IV Drip Rate ── */}
        <div className="dc-step">
          <div className="dc-step-sidebar">
            <span className="dc-step-numeral dc-numeral-2">2</span>
            <span className="dc-step-badge dc-badge-2">IV drip</span>
          </div>
          <div className="dc-step-content">
            <h2 className="dc-step-name">IV Drip Rate</h2>
            <p className="dc-step-question">Drops per minute — for gravity sets without a pump</p>

            <div className="dc-formula">Drops/min = (Volume × Drop factor) ÷ Time in minutes</div>

            <div className="dc-pearl" style={{ marginBottom: '18px' }}>
              <p className="dc-pearl-label">Important</p>
              <p>Drop factor is not something you calculate from memory. It is printed on the IV giving set packaging, so check the pack first. Common examples are 20 drops/ml for a standard set, 15 drops/ml for blood, and 60 drops/ml for a microdrip or paediatric set.</p>
            </div>

            <div className="dc-content-grid-2">
              <div className="dc-content-col">
                <p className="dc-col-header">Post-op fluids</p>
                <p className="dc-col-text">1L 0.9% saline over 8 hours. Standard set (20 drops/ml).</p>
                <div className="dc-formula-sm">
                  Time = 8 × 60 = 480 min<br />
                  (1000 × 20) ÷ 480 = 41.6 ≈ 42 drops/min
                </div>
              </div>
              <div className="dc-content-col">
                <p className="dc-col-header">Paediatric IV</p>
                <p className="dc-col-text">Child needs 250ml over 6 hours. Microdrop set (60 drops/ml).</p>
                <div className="dc-formula-sm">
                  Time = 6 × 60 = 360 min<br />
                  (250 × 60) ÷ 360 = 41.6 ≈ 42 drops/min
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3: IV Pump Rate ── */}
        <div className="dc-step">
          <div className="dc-step-sidebar">
            <span className="dc-step-numeral dc-numeral-3">3</span>
            <span className="dc-step-badge dc-badge-3">IV pump</span>
          </div>
          <div className="dc-step-content">
            <h2 className="dc-step-name">IV Rate for Pumps</h2>
            <p className="dc-step-question">ml per hour — for electronic infusion pumps</p>

            <div className="dc-formula">Rate (ml/hr) = Volume (ml) ÷ Time (hours)</div>

            <div className="dc-content-grid-2">
              <div className="dc-content-col">
                <p className="dc-col-header">Maintenance fluids</p>
                <p className="dc-col-text">3L over 24 hours via pump.</p>
                <div className="dc-formula-sm">3000 ÷ 24 = 125 ml/hr</div>
              </div>
              <div className="dc-content-col">
                <p className="dc-col-header">Antibiotic infusion</p>
                <p className="dc-col-text">500mg vancomycin in 100ml over 2 hours.</p>
                <div className="dc-formula-sm">100 ÷ 2 = 50 ml/hr</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 4: Holliday-Segar ── */}
        <div className="dc-step">
          <div className="dc-step-sidebar">
            <span className="dc-step-numeral dc-numeral-4">4</span>
            <span className="dc-step-badge dc-badge-4">Paeds fluids</span>
          </div>
          <div className="dc-step-content">
            <h2 className="dc-step-name">Holliday-Segar</h2>
            <p className="dc-step-question">The standard paediatric maintenance-fluid estimate</p>

            <table className="dc-table" style={{ marginBottom: '18px' }}>
              <thead>
                <tr>
                  <th>Weight range</th>
                  <th>Daily allowance</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>First 10 kg</td><td>100 ml/kg/day</td></tr>
                <tr><td>Next 10 kg (11–20 kg)</td><td>50 ml/kg/day</td></tr>
                <tr><td>Each kg above 20 kg</td><td>20 ml/kg/day</td></tr>
              </tbody>
            </table>

            <div className="dc-pearl" style={{ marginBottom: '18px' }}>
              <p className="dc-pearl-label">Plain English</p>
              <p>
                Holliday-Segar is just a standard way to estimate how much maintenance fluid a child needs over 24 hours. Work through the weight in blocks: first 10 kg, next 10 kg, then anything above 20 kg.
              </p>
            </div>

            <div className="dc-content-grid-3">
              {[
                { weight: '8 kg', calc: '8 × 100 = 800 ml/day', rate: '→ 33 ml/hr' },
                { weight: '18 kg', calc: '(10×100) + (8×50) = 1,400 ml/day', rate: '→ 58 ml/hr' },
                { weight: '25 kg', calc: '(10×100) + (10×50) + (5×20) = 1,700 ml/day', rate: '→ 71 ml/hr' },
              ].map(ex => (
                <div key={ex.weight} className="dc-content-col">
                  <p className="dc-col-header">{ex.weight}</p>
                  <div className="dc-formula-sm" style={{ marginBottom: '6px' }}>{ex.calc}</div>
                  <p className="dc-col-text" style={{ fontWeight: 400, color: 'var(--ink-mid)' }}>{ex.rate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 5: Weight-Based Dosing ── */}
        <div className="dc-step">
          <div className="dc-step-sidebar">
            <span className="dc-step-numeral dc-numeral-5">5</span>
            <span className="dc-step-badge dc-badge-5">Dosing</span>
          </div>
          <div className="dc-step-content">
            <h2 className="dc-step-name">Weight-Based Dosing</h2>
            <p className="dc-step-question">When the dose depends on the patient's weight in kilograms</p>

            <div className="dc-formula">Total dose = Dose per kg × Patient weight (kg)</div>

            <div className="dc-content-grid-2">
              <div className="dc-content-col">
                <p className="dc-col-header">Gentamicin (adult)</p>
                <p className="dc-col-text">Patient weighs 80kg. 5mg/kg once daily.</p>
                <div className="dc-formula-sm">5 × 80 = 400mg</div>
              </div>
              <div className="dc-content-col">
                <p className="dc-col-header">Paracetamol (child)</p>
                <p className="dc-col-text">Child weighs 25kg. Paracetamol 15mg/kg PRN.</p>
                <div className="dc-formula-sm">15 × 25 = 375mg</div>
              </div>
            </div>

            <div className="dc-pearl" style={{ marginTop: '18px', marginBottom: '18px' }}>
              <p className="dc-pearl-label">Divided doses — step by step</p>
              <p>Step 1: Daily dose = mg/kg/day × weight (kg). Step 2: Single dose = Daily dose ÷ Number of doses.</p>
            </div>

            <div className="dc-pearl">
              <p className="dc-pearl-label">Example</p>
              <p>Child weighs 20 kg. Amoxicillin is prescribed at 25 mg/kg/day in 3 divided doses (TDS). Step 1: 25 × 20 = 500 mg/day. Step 2: 500 ÷ 3 = 166.6 mg per dose.</p>
            </div>
          </div>
        </div>

        {/* ── Section 6: Safe Dose Range Checking ── */}
        <div className="dc-step">
          <div className="dc-step-sidebar">
            <span className="dc-step-numeral dc-numeral-6">6</span>
            <span className="dc-step-badge dc-badge-6">Safety</span>
          </div>
          <div className="dc-step-content">
            <h2 className="dc-step-name">Safe Dose Range Checking</h2>
            <p className="dc-step-question">Always check the safe range in the BNF or BNFc</p>

            <div className="dc-content-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="dc-content-col">
                <p className="dc-col-header">Worked example</p>
                <p className="dc-col-text" style={{ marginBottom: '8px' }}>Doctor prescribes 200mg ibuprofen TDS for an 18kg child. The BNFc (the children&apos;s British National Formulary) says the maximum is 30mg/kg/day. Is it safe?</p>
                <div className="dc-formula-sm">
                  Prescribed daily: 200 × 3 = 600mg<br />
                  Maximum daily: 30 × 18 = 540mg<br />
                  <strong style={{ color: 'var(--red-600)' }}>⚠ OVER the maximum — query with prescriber!</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Unit Conversion Staircase ── */}
        <h2 className="dc-section-title">Unit Conversion Staircase</h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-soft)', fontWeight: 300, lineHeight: 1.7, marginBottom: '20px' }}>
          Moving <strong style={{ fontWeight: 600 }}>down</strong> the staircase (to a smaller unit) — multiply by 1,000. Moving <strong style={{ fontWeight: 600 }}>up</strong> the staircase (to a larger unit) — divide by 1,000.
        </p>

        <div style={{ marginBottom: '32px', overflow: 'hidden' }}>
          <div style={{ position: 'relative', paddingBottom: '8px' }}>
            {[
              { unit: 'kg', label: 'kilogram', offset: 0 },
              { unit: 'g', label: 'gram', offset: 1 },
              { unit: 'mg', label: 'milligram', offset: 2 },
              { unit: 'mcg', label: 'microgram', offset: 3 },
              { unit: 'ng', label: 'nanogram', offset: 4 },
            ].map((step, i) => (
              <div key={step.unit} className="dc-stair-step">
                <div style={{ width: `${step.offset * 56}px`, flexShrink: 0 }} />
                <div className="dc-stair-box" style={{
                  background: i === 2 ? 'var(--amber-50)' : i % 2 === 0 ? '#F5F3F0' : 'var(--surface-page)',
                  borderBottom: i === 4 ? '0.5px solid rgba(0,0,0,0.12)' : 'none',
                }}>
                  <span className="dc-stair-unit" style={{ color: i === 2 ? 'var(--amber-800)' : '#1A1815' }}>{step.unit}</span>
                  <span className="dc-stair-label" style={{ color: i === 2 ? 'var(--amber-800)' : 'var(--ink-faint)' }}>{step.label}</span>
                  {i < 4 && (
                    <span className="dc-stair-arrow">
                      &darr; &times; 1,000 &nbsp;&nbsp; &uarr; &divide; 1,000
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Volume staircase */}
          <div style={{ marginTop: '24px', position: 'relative' }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'var(--ink-faint)', marginBottom: '8px' }}>Volume</p>
            {[
              { unit: 'L', label: 'litre', offset: 0 },
              { unit: 'ml', label: 'millilitre', offset: 1 },
              { unit: 'μL', label: 'microlitre', offset: 2 },
            ].map((step, i) => (
              <div key={step.unit} className="dc-stair-step">
                <div style={{ width: `${step.offset * 56}px`, flexShrink: 0 }} />
                <div className="dc-stair-box" style={{
                  background: i % 2 === 0 ? '#F5F3F0' : 'var(--surface-page)',
                  borderBottom: i === 2 ? '0.5px solid rgba(0,0,0,0.12)' : 'none',
                }}>
                  <span className="dc-stair-unit" style={{ color: 'var(--ink-strong)' }}>{step.unit}</span>
                  <span className="dc-stair-label">{step.label}</span>
                  {i < 2 && (
                    <span className="dc-stair-arrow">
                      &darr; &times; 1,000 &nbsp;&nbsp; &uarr; &divide; 1,000
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dc-pearl" style={{ marginBottom: '32px' }}>
          <p className="dc-pearl-label">How to use the staircase</p>
          <p>Convert 0.25 mg to mcg: you are moving one step <em>down</em> from mg to mcg, so multiply by 1,000. Answer: 250 mcg. Convert 500 ml to L: you are moving one step <em>up</em> from ml to L, so divide by 1,000. Answer: 0.5 L.</p>
        </div>

        {/* Safety reminders */}
        <p className="dc-redflags-label">Calculation safety reminders</p>
        <div className="dc-redflags">
          {[
            'Always double-check paediatric calculations',
            'NEVER write "U" for units',
            'NEVER write "μg" — looks like mg',
            'Check max dose before giving',
            'If the answer seems odd — stop and recheck',
            'Unsure? Ask a pharmacist',
          ].map(flag => <span key={flag} className="dc-red-pill">{flag}</span>)}
        </div>

        <SelfTestQuiz title="Test Yourself: Drug Calculations" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'BNFC', title: 'British National Formulary for Children', href: 'https://bnf.nice.org.uk/' },
          { citation: 'NMC (2018)', title: 'The Code: Professional standards of practice and behaviour for nurses', href: 'https://www.nmc.org.uk/standards/code/' },
          { citation: 'RCN', title: 'Medicines management guidance for nurses and healthcare professionals', href: 'https://www.rcn.org.uk/clinical-topics/medicines-management' },
          { citation: 'NHS England', title: 'Medication safety resources', href: 'https://www.england.nhs.uk/patient-safety/medication-safety/' },
        ]} />
      </div>
    </div>
  );
}
