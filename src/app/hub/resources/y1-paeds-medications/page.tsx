'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const quizQuestions = [
  { question: 'How are most paediatric drug doses calculated?', options: ['By age alone', 'By weight in kilograms', 'By height', 'By body surface area only'], answer: 1 },
  { question: 'What is the reference source for paediatric drug doses in the UK?', options: ['BNF for Adults', 'MIMS', 'BNF for Children (BNFC)', 'WHO drug guide'], answer: 2 },
  { question: 'Why must you NEVER abbreviate "units" as "U"?', options: ['It is not medical terminology', 'It can be misread as "0", causing a 10-fold overdose', 'It saves too little time', 'Pharmacists reject it'], answer: 1 },
  { question: 'What is the paracetamol dose for children?', options: ['10 mg/kg', '15 mg/kg every 4\u20136 hours', '20 mg/kg every 2 hours', '5 mg/kg every 8 hours'], answer: 1 },
  { question: 'What should always be co-prescribed with opioids?', options: ['Antibiotics', 'A laxative', 'An antihistamine', 'A vitamin supplement'], answer: 1 },
  { question: 'What syringe type must be used for insulin?', options: ['Standard syringe', 'Insulin syringe only', 'Any syringe with markings', 'The largest available'], answer: 1 },
  { question: 'How many people must independently check high-risk medications?', options: ['1', '2', '3', 'It depends on the ward'], answer: 1 },
  { question: 'If you make a medication error in an OSCE, what should you do?', options: ['Pretend it did not happen', 'Acknowledge it and state you would report it', 'Ask to restart the station', 'Blame the prescription'], answer: 1 },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap');

.pm-guide *, .pm-guide *::before, .pm-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.pm-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.pm-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
}

.pm-back {
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
.pm-back:hover { color: #555; }

.pm-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.pm-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.pm-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.pm-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
}

/* Principles grid */
.pm-principles {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}
.pm-principle-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.pm-principle-cell:last-child { border-right: none; }
.pm-principle-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}
.pm-principle-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}
.pm-principle-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Section steps */
.pm-section {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 52px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 36px;
}
.pm-section-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}
.pm-section-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}
.pm-section-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 3px;
  font-family: 'Inter', -apple-system, sans-serif;
  font-weight: 400;
}
.pm-section-content { padding-left: 32px; }
.pm-section-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}
.pm-section-sub {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* Content grid */
.pm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}
.pm-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.pm-col:last-child { border-right: none; }
.pm-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}
.pm-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.pm-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0 2px 10px;
  font-weight: 300;
  position: relative;
}
.pm-list li::before { content: '–'; position: absolute; left: 0; color: #ccc; }

/* Danger pills */
.pm-danger-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}
.pm-danger-pills { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
.pm-danger-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 2px;
  font-weight: 300;
}

/* Pearl */
.pm-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  margin-bottom: 18px;
}
.pm-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}
.pm-pearl p { font-size: 12px; color: #633806; line-height: 1.6; font-weight: 300; margin: 0; }

/* Tip */
.pm-tip { background: #E8F5EE; padding: 14px 18px; margin-bottom: 18px; }
.pm-tip-label { font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase; color: #0F6E56; margin-bottom: 6px; }
.pm-tip p { font-size: 12px; color: #0F6E56; line-height: 1.6; font-weight: 300; margin: 0; }

/* Section heading */
.pm-heading {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: #1A1815;
  padding-top: 36px;
  margin-top: 52px;
  padding-bottom: 16px;
  margin-bottom: 18px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

/* Table */
.pm-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 24px;
}
.pm-table th {
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
  font-family: 'Inter', -apple-system, sans-serif;
}
.pm-table th:last-child { border-right: none; }
.pm-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
  line-height: 1.55;
  vertical-align: top;
}
.pm-table td:last-child { border-right: none; }
.pm-table tr:last-child td { border-bottom: none; }
.pm-table td:first-child { font-weight: 500; color: #2C2A27; }

/* Colour system */
.pm-num-1 { color: #185FA5; }
.pm-badge-1 { background: #E6F1FB; color: #0C447C; }
.pm-num-2 { color: #0F6E56; }
.pm-badge-2 { background: #E1F5EE; color: #085041; }
.pm-num-3 { color: #993C1D; }
.pm-badge-3 { background: #FAECE7; color: #712B13; }
.pm-num-4 { color: #534AB7; }
.pm-badge-4 { background: #EEEDFE; color: #3C3489; }
.pm-num-5 { color: #5F5E5A; }
.pm-badge-5 { background: #F1EFE8; color: #444441; }

@media (max-width: 768px) {
  .pm-wrap { padding: 24px 20px 60px; }
  .pm-headline { font-size: 36px; }
  .pm-section { grid-template-columns: 1fr; }
  .pm-section-sidebar { flex-direction: row; align-items: center; gap: 12px; padding-right: 0; border-right: none; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .pm-section-numeral { font-size: 48px; }
  .pm-section-content { padding-left: 0; }
  .pm-grid { grid-template-columns: 1fr 1fr; }
  .pm-col { border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .pm-principles { grid-template-columns: 1fr 1fr; }
  .pm-principle-cell { border-bottom: 0.5px solid rgba(0,0,0,0.12); }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRINCIPLES = [
  { n: '01', title: 'Always weight-based', text: 'Every paediatric dose is calculated per kilogram. Use the most recent weight, measured in kg, before any calculation.' },
  { n: '02', title: 'BNFC is your reference', text: 'The British National Formulary for Children is the definitive source. Check it every time — do not rely on memory for paediatric doses.' },
  { n: '03', title: 'Double-check always', text: 'Two people must independently check high-risk medications. Never skip the second check because you are busy or confident.' },
  { n: '04', title: 'Therapeutic window is narrow', text: 'Children have less margin for error than adults. A small miscalculation in a neonate can cause serious harm. Work slowly and precisely.' },
];

const SECTIONS = [
  {
    numeral: '1',
    colour: '1',
    name: 'Common Paediatric Medications',
    subtitle: 'What are the drugs you will see most on placement?',
    badge: 'Common drugs',
    cols: [
      {
        header: 'Analgesia',
        items: [
          'Paracetamol: 15 mg/kg every 4–6 h (max 4 doses/24 h)',
          'Ibuprofen: 5–10 mg/kg every 6–8 h (max 30 mg/kg/24 h)',
          'Avoid ibuprofen under 3 months, asthma, or dehydration',
          'Morphine: 0.1–0.2 mg/kg — titrate carefully, monitor resp rate',
        ],
      },
      {
        header: 'Antibiotics',
        items: [
          'Amoxicillin: 30–50 mg/kg/day in 3 divided doses',
          'Co-amoxiclav: 30 mg/kg/day (amoxicillin component)',
          'Gentamicin: dose and interval depend on age/weight/renal — always check BNFC',
          'Metronidazole: 7.5 mg/kg three times daily',
        ],
      },
      {
        header: 'Respiratory',
        items: [
          'Salbutamol inhaler: 1–2 puffs (100 mcg each) via spacer',
          'Salbutamol nebuliser: 2.5 mg (<5 years), 5 mg (≥5 years)',
          'Prednisolone: 1–2 mg/kg/day (max 40 mg) for acute asthma',
          'Ipratropium: added to salbutamol in severe wheeze',
        ],
      },
      {
        header: 'Fluids & other',
        items: [
          'Oral rehydration: 50 ml/kg over 4 h for mild dehydration',
          'IV maintenance (Holliday-Segar): 100 ml/kg/day for first 10 kg',
          'Dextrose: 2 ml/kg of 10% for hypoglycaemia (<2.6 mmol/L)',
          'Adrenaline IM (anaphylaxis): 0.01 mg/kg (max 0.5 mg)',
        ],
      },
    ],
    danger: [],
    pearl: 'Always use oral syringes (not spoons) for liquid medicines in children. Spoon measurements are inaccurate. For neonates, draw up in a 1 ml syringe for precision.',
  },
  {
    numeral: '2',
    colour: '2',
    name: 'Drug Calculations',
    subtitle: 'The formulas and worked examples for paediatric meds.',
    badge: 'Calculations',
    cols: [
      {
        header: 'Basic formula',
        items: [
          'What you want ÷ What you have × Volume',
          'Example: need 250 mg, have 500 mg in 10 ml',
          '= 250 ÷ 500 × 10 = 5 ml',
          'Write units clearly at every step',
          'Never round mid-calculation — round at the end',
        ],
      },
      {
        header: 'Weight-based',
        items: [
          'Dose (mg/kg) × weight (kg) = total dose (mg)',
          'Example: 15 mg/kg paracetamol for 12 kg child',
          '= 15 × 12 = 180 mg',
          'Always verify the weight is recent and accurate',
          'Max dose caps apply — check BNFC',
        ],
      },
      {
        header: 'IV rate (ml/hr)',
        items: [
          'Volume (ml) ÷ Time (hours) = rate (ml/hr)',
          'Example: 100 ml over 4 hours',
          '= 100 ÷ 4 = 25 ml/hr',
          'Most pumps take ml/hr — confirm with device',
        ],
      },
      {
        header: 'Infusion & drips',
        items: [
          'Drip rate (drops/min): Volume × drop factor ÷ time (min)',
          'Standard giving set: 20 drops/ml',
          'Paediatric giving set: 60 drops/ml (microdrip)',
          'Example: 120 ml over 60 min, 20 drop factor',
          '= 120 × 20 ÷ 60 = 40 drops/min',
        ],
      },
    ],
    danger: [],
    pearl: 'Unit conversions cause the most errors. 1 g = 1000 mg. 1 mg = 1000 mcg. If a calculated dose looks unusually large or small for a child, stop and recheck before giving anything.',
  },
  {
    numeral: '3',
    colour: '3',
    name: 'High-Risk Medications',
    subtitle: 'Which drugs need the most care, and why?',
    badge: 'High risk',
    cols: [
      {
        header: 'Insulin',
        items: [
          'Risk of hypoglycaemia — double-check dose and route',
          'Units must be written in full, not abbreviated "U" (misread as 0)',
          'Never drawn up in a standard syringe — use insulin syringe only',
          'Blood glucose check before and after administration',
        ],
      },
      {
        header: 'Opioids',
        items: [
          'Morphine: risk of respiratory depression',
          'Titrate slowly — start at lowest effective dose',
          'Monitor respiratory rate closely after each dose',
          'Naloxone must be available and staff must know how to use it',
          'Constipation is near-universal — always prescribe a laxative',
        ],
      },
      {
        header: 'Aminoglycosides',
        items: [
          'Gentamicin: nephrotoxic and ototoxic',
          'Dosing depends on age, weight, and renal function',
          'Drug levels must be checked (trough before dose, peak after)',
          'Dose interval extended in neonates and renal impairment',
          'Always check BNFC — do not estimate',
        ],
      },
      {
        header: 'IV fluids',
        items: [
          'Risk of fluid overload, hyponatraemia, or hypernatraemia',
          'Calculate maintenance requirements carefully (Holliday-Segar)',
          '0.9% saline + 5% glucose most common maintenance solution',
          'Boluses: 10 ml/kg (not adult 250 ml) — reassess after each',
          'Strict fluid balance chart mandatory',
        ],
      },
    ],
    danger: ['Insulin in wrong syringe', 'Opioid without resp monitoring', 'Gentamicin without levels', 'IV bolus at adult dose', 'Units abbreviated as "U"'],
    pearl: null,
  },
  {
    numeral: '4',
    colour: '4',
    name: 'Medicines Management OSCE',
    subtitle: 'What do examiners actually look for?',
    badge: 'OSCE',
    cols: [
      {
        header: 'Before you start',
        items: [
          'Wash hands — both at the start and the end',
          'Check the prescription: name, DOB, drug, dose, route, time',
          'Check allergies — even for familiar drugs',
          'Check expiry date and integrity of packaging',
          'Ask about swallowing ability before giving oral medication',
        ],
      },
      {
        header: '9 Rights check',
        items: [
          'Right patient — ID band, state name and DOB',
          'Right drug — check prescription and indication',
          'Right dose — calculate if needed, check appropriateness',
          'Right route — oral, IV, IM, SC, topical',
          'Right time — frequency and when last given',
          'Right documentation — sign after administration',
          'Right reason, right response, right to refuse',
        ],
      },
      {
        header: 'Calculations in OSCE',
        items: [
          'Talk through your process out loud — examiners mark what they hear',
          'Write the formula, the substitution, and the answer',
          'Check your answer makes clinical sense',
          'State the answer with units: "I would give 5 ml"',
          'If unsure, say so and ask for a second check',
        ],
      },
      {
        header: 'Common mistakes',
        items: [
          'Not checking allergies for "simple" drugs like paracetamol',
          'Leaving medications unattended at the bedside',
          'Decimal errors: write "1 mg" not "1.0 mg"',
          'Crushing modified-release tablets',
          'Not documenting after administration',
          'Failing to acknowledge an error if spotted',
        ],
      },
    ],
    danger: ['Not checking allergies', 'Skipping the second checker', 'Decimal point error', 'Giving without documenting', 'Crushing modified-release tablet'],
    pearl: 'If you make a mistake in an OSCE, acknowledge it clearly: "I have identified an error — I would stop, inform the senior nurse, and complete an incident report." Examiners mark professional response to error, not just error-free performance.',
  },
  {
    numeral: '5',
    colour: '5',
    name: 'Safety, Consent & Documentation',
    subtitle: 'What wraps around every medicines administration?',
    badge: 'Safety',
    cols: [
      {
        header: 'Consent',
        items: [
          'Children under 16 may have Gillick competence to consent to medication',
          'Parental consent usually needed under 16 if not Gillick competent',
          'Parents can refuse treatment — escalate if this puts the child at risk',
          'Document consent discussions clearly',
        ],
      },
      {
        header: 'Covert administration',
        items: [
          'Giving medication hidden in food without the patient\'s knowledge',
          'Only permitted if the patient lacks capacity AND it is in their best interests',
          'Requires a best interests decision and MDT agreement',
          'Must be documented fully — never done informally',
        ],
      },
      {
        header: 'Documentation',
        items: [
          'Sign the drug chart immediately after administration — never before',
          'Record dose given, route, time, and batch number for vaccines',
          'Document refusals and reasons',
          'Record any adverse reactions and report via datix/incident form',
          'Controlled drugs: two signatures always required',
        ],
      },
      {
        header: 'Error management',
        items: [
          'If you make a medication error, tell a senior immediately',
          'Complete an incident report (datix or local equivalent)',
          'Monitor the patient for any adverse effects',
          'Be honest — covering up an error is a serious professional breach',
          'Reflect: what led to the error and what would prevent recurrence',
        ],
      },
    ],
    danger: [],
    pearl: 'Controlled drugs must be counted and signed by two registered practitioners at every administration and at every shift handover. The CD register and the patient\'s drug chart must both be completed before the CD cupboard is locked.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Y1PaedsMedicationsPage() {
  return (
    <div className="pm-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pm-wrap">
        <Link href="/hub/childrens" className="pm-back">
          <span>←</span>
          Children&apos;s Nursing Hub
        </Link>

        <p className="pm-kicker">Medications · Children&apos;s Nursing · Premium</p>
        <h1 className="pm-headline">Y1 Paediatric Medications Guide</h1>
        <p className="pm-standfirst">
          The paediatric meds basics for first year: common drugs and doses, weight-based calculations with worked examples, high-risk medications and why they matter, and what examiners look for in a medicines management OSCE.
        </p>
        <p className="pm-byline">Children&apos;s nursing · Meds &amp; Calculations · The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="18"
          hubItemTitle="Y1 Paediatric Medications Guide"
        />

        <div className="pm-pearl" style={{ marginBottom: '40px' }}>
          <p className="pm-pearl-label">Student note</p>
          <p>Medication errors are the most common cause of serious harm in paediatric nursing. This is not meant to scare you — it is meant to make you slow down, check twice, and always use the BNFC. Confidence in meds comes from doing the process correctly every time, not from doing it quickly.</p>
        </div>

        {/* Core principles */}
        <div className="pm-principles">
          {PRINCIPLES.map((p) => (
            <div key={p.n} className="pm-principle-cell">
              <span className="pm-principle-numeral">{p.n}</span>
              <p className="pm-principle-title">{p.title}</p>
              <p className="pm-principle-text">{p.text}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <div key={section.numeral} className="pm-section">
            <div className="pm-section-sidebar">
              <span className={`pm-section-numeral pm-num-${section.colour}`}>{section.numeral}</span>
              <span className={`pm-section-badge pm-badge-${section.colour}`}>{section.badge}</span>
            </div>
            <div className="pm-section-content">
              <h2 className="pm-section-name">{section.name}</h2>
              <p className="pm-section-sub">{section.subtitle}</p>

              <div className="pm-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="pm-col">
                    <p className="pm-col-header">{col.header}</p>
                    <ul className="pm-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.danger.length > 0 && (
                <>
                  <p className="pm-danger-label">Never do this</p>
                  <div className="pm-danger-pills">
                    {section.danger.map((d) => (
                      <span key={d} className="pm-danger-pill">{d}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="pm-pearl">
                  <p className="pm-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Quick reference table */}
        <h2 className="pm-heading">Quick Reference: Common Doses</h2>
        <table className="pm-table">
          <thead>
            <tr>
              <th>Drug</th>
              <th>Route</th>
              <th>Dose</th>
              <th>Frequency</th>
              <th>Key safety point</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Paracetamol', 'Oral / IV / PR', '15 mg/kg', 'Every 4–6 h (max 4 doses/24 h)', 'Check weight; IV dose differs from oral in neonates'],
              ['Ibuprofen', 'Oral', '5–10 mg/kg', 'Every 6–8 h (max 30 mg/kg/24 h)', 'Avoid <3 months, asthma, dehydration, renal impairment'],
              ['Amoxicillin', 'Oral / IV', '30–50 mg/kg/day', '3 divided doses', 'Penicillin allergy — always check'],
              ['Salbutamol', 'Inhaler / nebuliser', '2–10 puffs or 2.5–5 mg', 'As needed / every 20–30 min in acute wheeze', 'Spacer device for inhaler in children <8 years'],
              ['Prednisolone', 'Oral', '1–2 mg/kg/day (max 40 mg)', 'Once daily for 3–5 days', 'Not for routine mild asthma — for acute exacerbation'],
              ['Morphine', 'Oral / IV / SC', '0.1–0.2 mg/kg', 'Every 4 h (IR) — titrate', 'Monitor respiratory rate; have naloxone available'],
              ['Adrenaline (anaphylaxis)', 'IM (anterolateral thigh)', '0.01 mg/kg (max 0.5 mg)', 'Repeat after 5 min if no response', 'Always IM — never IV unless experienced team'],
              ['Oral rehydration', 'Oral', '50 ml/kg over 4 h (mild); 100 ml/kg (moderate)', 'Continuous sips', 'NG route if unable to tolerate oral'],
            ].map(([drug, route, dose, freq, safety]) => (
              <tr key={drug}>
                <td>{drug}</td>
                <td style={{ fontWeight: 300 }}>{route}</td>
                <td style={{ fontWeight: 300 }}>{dose}</td>
                <td style={{ fontWeight: 300 }}>{freq}</td>
                <td style={{ fontWeight: 300 }}>{safety}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pm-tip">
          <p className="pm-tip-label">Always verify</p>
          <p>Doses in this guide are for reference only. Always check the current edition of the BNFC before prescribing or administering any paediatric medication. Local guidelines may differ.</p>
        </div>

        <SelfTestQuiz title="Test Yourself: Paediatric Medications" questions={quizQuestions} />
      </div>
    </div>
  );
}
