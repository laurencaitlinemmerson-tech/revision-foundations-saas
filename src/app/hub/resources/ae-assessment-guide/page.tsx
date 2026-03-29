'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.ae-guide *, .ae-guide *::before, .ae-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.ae-guide {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.ae-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
}

/* Back nav */
.ae-back {
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
.ae-back:hover { color: #555; }
.ae-back-arrow { font-style: normal; }

/* Masthead */
.ae-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.ae-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.ae-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.ae-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
}

/* Golden rules grid */
.ae-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.ae-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.ae-golden-cell:last-child { border-right: none; }

.ae-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.ae-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.ae-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.ae-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 52px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 36px;
}

.ae-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.ae-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.ae-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 3px;
  font-family: 'Source Serif 4', serif;
  font-weight: 400;
}

.ae-step-content {
  padding-left: 32px;
}

.ae-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.ae-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.ae-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ae-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ae-content-col:last-child { border-right: none; }

.ae-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.ae-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ae-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.ae-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Red flags */
.ae-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.ae-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.ae-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 2px;
  font-weight: 300;
}

/* Pearl */
.ae-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.ae-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.ae-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.ae-section-title {
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

/* Vitals table */
.ae-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 0;
  font-size: 13px;
}

.ae-table th {
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
  font-family: 'Source Serif 4', serif;
}
.ae-table th:last-child { border-right: none; }

.ae-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.ae-table td:last-child { border-right: none; }
.ae-table tr:last-child td { border-bottom: none; }
.ae-table td:first-child { font-weight: 400; color: #2C2A27; }

/* Paeds considerations */
.ae-paeds-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
}

.ae-paeds-cell {
  padding: 18px 16px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ae-paeds-cell:last-child { border-right: none; }

.ae-paeds-cell-title {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #333;
  margin-bottom: 12px;
  font-weight: 400;
  padding-bottom: 8px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

.ae-paeds-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.ae-paeds-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0 2px 10px;
  font-weight: 300;
  position: relative;
}
.ae-paeds-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Checklist */
.ae-checklist-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 0.5px solid rgba(0,0,0,0.1);
}

.ae-checklist-col {
  padding: 22px 26px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ae-checklist-col:last-child { border-right: none; }

.ae-checklist-col-title {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

.ae-check-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
  cursor: pointer;
  user-select: none;
}

.ae-check-box {
  width: 14px;
  height: 14px;
  border: 0.5px solid rgba(0,0,0,0.28);
  flex-shrink: 0;
  margin-top: 3px;
  transition: background 0.12s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ae-check-box.ae-checked {
  background: #2C2A27;
  border-color: #2C2A27;
}

.ae-check-mark {
  color: white;
  font-size: 9px;
  line-height: 1;
}

.ae-check-label {
  font-size: 13px;
  color: #555;
  line-height: 1.48;
  font-weight: 300;
  transition: all 0.15s;
}

.ae-check-label.ae-checked {
  text-decoration: line-through;
  color: #bbb;
}

/* Step colour system */
.ae-letter-a { color: #185FA5; }
.ae-badge-a { background: #E6F1FB; color: #0C447C; }
.ae-letter-b { color: #0F6E56; }
.ae-badge-b { background: #E1F5EE; color: #085041; }
.ae-letter-c { color: #993C1D; }
.ae-badge-c { background: #FAECE7; color: #712B13; }
.ae-letter-d { color: #534AB7; }
.ae-badge-d { background: #EEEDFE; color: #3C3489; }
.ae-letter-e { color: #5F5E5A; }
.ae-badge-e { background: #F1EFE8; color: #444441; }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    letter: 'A',
    colour: 'a',
    name: 'Airway',
    question: 'Is the airway open and protected?',
    cols: [
      {
        header: 'Look',
        items: [
          'Visible obstruction',
          'Lip or tongue swelling',
          'Facial trauma',
          'Accessory muscle use',
          'Cyanosis (late sign)',
        ],
      },
      {
        header: 'Listen',
        items: ['Stridor (obstruction)', 'Gurgling (fluid)', 'Snoring (soft tissue)', 'Silence (complete block)'],
      },
      {
        header: 'Feel',
        items: ['Air at mouth/nose', 'Chest rise with breaths', 'Tracheal position'],
      },
      {
        header: 'Act',
        items: [
          'Head tilt chin lift',
          'Jaw thrust if trauma',
          'Suction if secretions',
          'OPA/NPA if tolerated',
          'Call anaesthetics',
        ],
      },
    ],
    redFlags: ['Stridor', 'Silence', 'Cyanosis', 'Cannot speak/cry', 'Drooling', 'Grunting'],
    pearl:
      'In children the narrowest point is the cricoid ring (not the cords) — even mild swelling significantly reduces airway diameter. In anaphylaxis, give IM adrenaline early without waiting for full symptom progression.',
  },
  {
    letter: 'B',
    colour: 'b',
    name: 'Breathing',
    question: 'Is breathing adequate in rate, depth, and effort?',
    cols: [
      {
        header: 'Rate & pattern',
        items: ['RR against age norms', 'Depth and rhythm', 'SpO₂ target 94–98%', 'Nasal flaring in infants'],
      },
      {
        header: 'Inspect',
        items: [
          'Chest expansion',
          'Symmetrical movement',
          'Accessory muscle use',
          'Intercostal recession',
          'Tracheal position',
          'Head bobbing',
          'Shoulder shrugging',
          'Subcostal recession',
          'See-saw breathing',
          'Grunting',
        ],
      },
      {
        header: 'Auscultate',
        items: ['Air entry bilateral', 'Added sounds (wheeze/crep)', 'Dullness on percussion', 'Silent chest (emergency)'],
      },
      {
        header: 'Act',
        items: [
          'O₂ if SpO₂ <94%',
          'Sniffing position',
          'Non-rebreather if needed',
          'Call paediatric team',
          'Prepare for intubation',
        ],
      },
    ],
    redFlags: [
      'RR outside age norms',
      'SpO₂ <94%',
      'Tracheal deviation',
      'Silent chest',
      'Grunting',
      'Severe recession',
      'Head bobbing',
      'See-saw breathing',
    ],
    pearl: null,
  },
  {
    letter: 'C',
    colour: 'c',
    name: 'Circulation',
    question: 'Is cardiac output adequate to perfuse end organs?',
    cols: [
      {
        header: 'Pulse & BP',
        items: ['HR against age norms', 'BP (late sign if low)', 'Pulse character', 'Peripheral vs central pulse'],
      },
      {
        header: 'Perfusion',
        items: ['CRT <2s (central)', 'Skin colour and temp', 'Mottling pattern', 'Behavioural change', 'Nappy output'],
      },
      {
        header: 'Monitoring',
        items: ['ECG/cardiac monitor', 'Bloods (lactate/gas)', 'Urine output ≥1 ml/kg/hr', 'Fluid balance'],
      },
      {
        header: 'Act',
        items: ['IV or IO access', 'Fluid bolus 10 ml/kg', 'Reassess after bolus', 'Repeat bolus if needed', 'Escalate early'],
      },
    ],
    redFlags: ['HR outside age norms', 'Hypotension (late sign)', 'CRT >2s', 'Mottled/pale/grey skin', 'No urine output'],
    pearl:
      'Children compensate remarkably well — then crash suddenly. Do not wait for hypotension before escalating. Fluid bolus in children is 10 ml/kg (not the adult 250 ml). Reassess after every bolus.',
  },
  {
    letter: 'D',
    colour: 'd',
    name: 'Disability',
    question: 'What is the neurological status and blood glucose?',
    cols: [
      {
        header: 'Consciousness',
        items: ['AVPU scale', 'GCS if older child', 'Response to parents', 'Eye opening, tone', 'Posturing (late sign)'],
      },
      {
        header: 'Glucose',
        items: ['BM check — mandatory', 'Treat if <4 mmol/L', 'Recheck after Rx', 'Consider IV dextrose', 'Repeat BM in 15 min'],
      },
      {
        header: 'Pupils & fontanelle',
        items: ['Size and symmetry', 'Reactivity to light', 'Bulging → ↑ICP', 'Sunken → dehydration', 'Fontanelle in <18mo'],
      },
      {
        header: 'Act',
        items: [
          'Recovery position if unconscious',
          'Treat hypoglycaemia',
          'Seizure management',
          'Reduce stimulation',
          'Neurology if needed',
        ],
      },
    ],
    redFlags: ['AVPU P or U', 'Not responding to parents', 'BM <4 mmol/L', 'Bulging fontanelle', 'Active seizure'],
    pearl: null,
  },
  {
    letter: 'E',
    colour: 'e',
    name: 'Exposure',
    question: 'What has been missed? Inspect thoroughly but maintain dignity.',
    cols: [
      {
        header: 'Inspect',
        items: ['Head-to-toe assessment', 'Rashes and wounds', 'Non-blanching rash', 'Bruising pattern', 'Skin turgor'],
      },
      {
        header: 'Temperature',
        items: [
          '<36°C or >38.5°C = concern',
          'Hypothermia in neonates',
          'Keep child warm',
          'Fever with rash → urgent',
          'Neonatal temp strictly normal',
        ],
      },
      {
        header: 'Lines & drains',
        items: ['IV/IO site and flow', 'Catheter output/colour', 'Nappy weight if infant', 'NG tube position', 'Drain output'],
      },
      {
        header: 'Chart review',
        items: [
          'Medication chart',
          'Weight-based dosing',
          'Allergy status',
          'Fluid balance trend',
          'PEWS trajectory',
        ],
      },
    ],
    redFlags: ['Non-blanching rash', 'Temp <36°C or >38.5°C', 'Unexplained bruising', 'Floppy/unresponsive', 'Petechiae'],
    pearl: null,
  },
];

const VITALS = [
  { age: '<1 year', rr: '30–40', hr: '110–160', sbp: '70–90' },
  { age: '1–2 years', rr: '25–35', hr: '100–150', sbp: '80–95' },
  { age: '2–5 years', rr: '25–30', hr: '95–140', sbp: '80–100' },
  { age: '5–12 years', rr: '20–25', hr: '80–120', sbp: '90–110' },
  { age: '>12 years', rr: '15–20', hr: '60–100', sbp: '100–120' },
];

const PAEDS_COLS = [
  {
    title: 'Airway & Breathing',
    items: [
      'Cricoid is narrowest point (not cords)',
      'Sniffing position preferred over neck extension',
      'Nasal flaring = early distress in infants',
      'Obligate nasal breathers under 3 months',
      'High respiratory reserve — rate drops fast when exhausted',
    ],
  },
  {
    title: 'Circulation',
    items: [
      'Compensate longer, then decompensate suddenly',
      'CRT >2s is significant at any age',
      'Fluid bolus = 10 ml/kg (not 250 ml)',
      'Mottling pattern from periphery inward',
      'Urine output ≥1 ml/kg/hr is minimum',
    ],
  },
  {
    title: 'Disability',
    items: [
      'AVPU: use response to parents as baseline',
      'Normal glucose lower in infants — act at <4 mmol/L',
      'Fontanelle palpable in infants <18 months',
      'Bulging fontanelle = raised ICP until proven otherwise',
      'Sunken = dehydration marker',
    ],
  },
  {
    title: 'Red flags in children',
    items: [
      'Non-blanching rash anywhere → immediate review',
      'Quiet, still, not interested in surroundings',
      'Parent reports "not right" — always investigate',
      'Fever + rash + photophobia = meningitis drill',
      'Any age: PEWS ≥3 triggers escalation',
    ],
  },
];

const CHECKLIST = {
  left: [
    'Reassess from A after every intervention',
    'Calculate PEWS score and document',
    'Escalate using SBAR — be specific',
  ],
  right: [
    'Document findings and all actions taken',
    'Increase monitoring frequency if unwell',
    'Review again in 15–30 minutes',
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AEAssessmentGuidePage() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setChecked((prev) => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  const allItems = [...CHECKLIST.left, ...CHECKLIST.right];

  return (
    <div className="ae-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ae-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="ae-back">
          <span className="ae-back-arrow">←</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="ae-kicker">Clinical Skills · Paediatric Assessment</p>
        <h1 className="ae-headline">A–E Assessment Framework</h1>
        <p className="ae-standfirst">
          A systematic approach to assessing any acutely unwell child. Work through each step in order —
          and always return to A after intervening. Covers airway, breathing, circulation, disability,
          and exposure with paediatric-specific values, red flags, and clinical pearls.
        </p>
        <p className="ae-byline">Children&apos;s nursing · Paediatric OSCE prep · Revision Foundations</p>

        {/* Golden rules */}
        <div className="ae-golden">
          {[
            {
              n: '01',
              title: 'Reassess always',
              text: 'After every intervention, return to A before moving to the next step. Never skip ahead.',
            },
            {
              n: '02',
              title: 'PEWS score',
              text: 'Calculate the Paediatric Early Warning Score at each assessment. A score ≥3 triggers escalation.',
            },
            {
              n: '03',
              title: 'Escalate early',
              text: 'Children deteriorate fast and compensate silently. Don\'t wait for confirmation — act on instinct.',
            },
            {
              n: '04',
              title: 'Parents know',
              text: 'If a parent says their child is not right, take it seriously. They know their child\'s baseline.',
            },
          ].map((cell) => (
            <div key={cell.n} className="ae-golden-cell">
              <span className="ae-golden-numeral">{cell.n}</span>
              <p className="ae-golden-title">{cell.title}</p>
              <p className="ae-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Step sections */}
        {STEPS.map((step) => (
          <div key={step.letter} className="ae-step">
            {/* Sidebar */}
            <div className="ae-step-sidebar">
              <span className={`ae-step-letter ae-letter-${step.colour}`}>{step.letter}</span>
              <span className={`ae-step-badge ae-badge-${step.colour}`}>{step.name}</span>
            </div>

            {/* Content */}
            <div className="ae-step-content">
              <h2 className="ae-step-name">{step.name}</h2>
              <p className="ae-step-question">{step.question}</p>

              {/* 4-col grid */}
              <div className="ae-content-grid">
                {step.cols.map((col) => (
                  <div key={col.header} className="ae-content-col">
                    <p className="ae-col-header">{col.header}</p>
                    <ul className="ae-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Red flags */}
              <p className="ae-redflags-label">Red flags</p>
              <div className="ae-redflags">
                {step.redFlags.map((flag) => (
                  <span key={flag} className="ae-red-pill">{flag}</span>
                ))}
              </div>

              {/* Pearl */}
              {step.pearl && (
                <div className="ae-pearl">
                  <p className="ae-pearl-label">Clinical pearl</p>
                  <p>{step.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Respiratory Distress Scenario */}
        <h2 className="ae-section-title">Paediatric Respiratory Distress Scenario</h2>
        <div className="ae-pearl">
          <p className="ae-pearl-label">Respiratory Distress</p>
          <p>A 3-year-old child is brought to the emergency department with a fever, cough, and difficulty breathing. The parent is concerned because the child has become quieter and more lethargic. The child's respiratory rate is 50 breaths per minute (elevated for their age), and the following signs are observed:</p>
          <ul className="ae-col-list">
            <li>Nasal flaring and intercostal recession</li>
            <li>Grunting with each exhalation</li>
            <li>Head bobbing with each breath</li>
            <li>Wheezing audible on auscultation</li>
            <li>SpO₂ is 90%, indicating hypoxia</li>
            <li>The child is lethargic and non-responsive to verbal cues.</li>
          </ul>
          <p className="ae-pearl-label">Management Steps</p>
          <ul className="ae-col-list">
            <li>Check for airway obstruction. The airway is patent, but observe for signs of partial obstruction.</li>
            <li>Administer supplemental oxygen to maintain SpO₂ >94%.</li>
            <li>Prepare for nebulized bronchodilators if asthma or bronchospasm is suspected.</li>
            <li>Assess circulation for signs of hypoperfusion. Consider a fluid bolus if necessary.</li>
            <li>Monitor blood glucose and neurological status. If the child becomes unresponsive, prepare for escalation.</li>
          </ul>

          <div className="ae-pearl">
            <p className="ae-pearl-label">Escalation Reminder</p>
            <p>Escalate to the paediatric team immediately. Prepare for intubation if respiratory distress worsens.</p>
          </div>
        </div>

        {/* After A–E checklist */}
        <h2 className="ae-section-title" style={{ marginBottom: '20px' }}>After A–E Checklist</h2>
        <div className="ae-checklist-grid">
          {(['left', 'right'] as const).map((side) => (
            <div key={side} className="ae-checklist-col">
              <p className="ae-checklist-col-title">
                {side === 'left' ? 'Reassess & escalate' : 'Document & monitor'}
              </p>
              {CHECKLIST[side].map((label) => {
                const idx = allItems.indexOf(label);
                const isChecked = checked.has(idx);
                return (
                  <div key={label} className="ae-check-item" onClick={() => toggle(idx)}>
                    <div className={`ae-check-box${isChecked ? ' ae-checked' : ''}`}>
                      {isChecked && <span className="ae-check-mark">✓</span>}
                    </div>
                    <span className={`ae-check-label${isChecked ? ' ae-checked' : ''}`}>{label}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
