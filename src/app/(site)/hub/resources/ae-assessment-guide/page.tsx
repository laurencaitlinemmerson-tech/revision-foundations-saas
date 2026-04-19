'use client';

import { useState } from 'react';
import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.ae-guide *, .ae-guide *::before, .ae-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.ae-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.ae-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
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
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
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
  margin-bottom: 36px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 24px;
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
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
  border-radius: 0;
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
  padding-top: 24px;
  margin-top: 36px;
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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
        ],
      },
    ],
    redFlags: ['Stridor', 'Silence', 'Cyanosis', 'Cannot speak/cry', 'Drooling', 'Grunting'],
    pearl:
      'In children the narrowest part of the airway is the cricoid ring just below the cords, so even mild swelling can make breathing much harder. In anaphylaxis, give IM adrenaline early rather than waiting for every sign to appear.',
  },
  {
    letter: 'B',
    colour: 'b',
    name: 'Breathing',
    question: 'Is breathing okay in speed, depth, and effort?',
    cols: [
      {
        header: 'Rate & pattern',
        items: ['RR compared with normal for age', 'Depth and rhythm', 'SpO₂ target 94–98%', 'Nasal flaring in infants'],
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
        header: 'Listen',
        items: ['Air entry both sides', 'Added sounds (wheeze/creps)', 'Dullness on percussion', 'Silent chest (emergency)'],
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
    question: 'Is blood getting around the body well enough?',
    cols: [
      {
        header: 'Pulse & BP',
        items: ['Heart rate against age norms', 'Blood pressure (low is late)', 'Pulse strength', 'Peripheral vs central pulse'],
      },
      {
        header: 'Blood reaching the body',
        items: ['CRT <2s centrally', 'Skin colour and temperature', 'Mottling pattern', 'Behaviour change', 'Nappy output'],
      },
      {
        header: 'Monitoring',
        items: ['ECG or cardiac monitor', 'Blood tests (including gas/lactate)', 'Urine output ≥1 ml/kg/hr', 'Fluid balance'],
      },
      {
        header: 'Act',
        items: ['IV or IO access', 'Fluid bolus 10 ml/kg', 'Reassess after bolus', 'Repeat bolus if needed', 'Escalate early'],
      },
    ],
    redFlags: ['HR outside age norms', 'Hypotension (late sign)', 'CRT >2s', 'Mottled/pale/grey skin', 'No urine output'],
    pearl:
      'Children can look as if they are coping, then suddenly get much worse. Do not wait for low blood pressure before escalating. A fluid bolus in children is 10 ml/kg, not the adult 250 ml, and you reassess after every bolus.',
  },
  {
    letter: 'D',
    colour: 'd',
    name: 'Disability',
    question: 'How awake are they, and what is the blood glucose?',
    cols: [
      {
        header: 'Consciousness',
        items: ['AVPU scale', 'GCS if older child', 'Response to parents', 'Eye opening and tone', 'Posturing (late sign)'],
      },
      {
        header: 'Glucose',
        items: ['Blood sugar check is essential', 'Treat if <4 mmol/L', 'Recheck after treatment', 'Consider IV dextrose', 'Repeat sugar in 15 min'],
      },
      {
        header: 'Pupils & soft spot',
        items: ['Size and symmetry', 'Reaction to light', 'Bulging can mean raised pressure in the head', 'Sunken can suggest dehydration', 'Only check the fontanelle in babies and young infants'],
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
    redFlags: ['Responds only to pain or is unresponsive', 'Not responding to parents', 'BM <4 mmol/L', 'Bulging fontanelle', 'Active seizure'],
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

const quizQuestions = [
  {
    question: 'What is the first thing you should assess in the A–E approach?',
    options: ['Breathing rate', 'Airway patency', 'Blood pressure', 'Level of consciousness'],
    answer: 1,
    explanation: 'Always start with airway. If they can talk, the airway is patent, but you still assess it properly.',
  },
  {
    question: 'A patient has a respiratory rate of 28 and SpO₂ of 88% on room air. Which part of A–E does this sit under?',
    options: ['Airway', 'Breathing', 'Circulation', 'Disability'],
    answer: 1,
    explanation: 'Respiratory rate and oxygen saturation are both part of Breathing.',
  },
  {
    question: 'What does AVPU stand for?',
    options: ['Alert, Verbal, Pain, Unconscious', 'Airway, Ventilation, Pulse, Urine', 'Alert, Voice, Pain, Unresponsive', 'Assess, Verify, Perform, Update'],
    answer: 2,
    explanation: 'AVPU means Alert, responds to Voice, responds to Pain, Unresponsive.',
  },
  {
    question: 'A capillary refill time of 4 seconds suggests what?',
    options: ['Normal perfusion', 'Possible poor peripheral perfusion', 'Excellent circulation', 'Need for CPR'],
    answer: 1,
    explanation: 'Normal CRT is usually under 2 seconds. Four seconds is a red flag for poor perfusion.',
  },
  {
    question: 'Which E (Exposure) finding is a genuine red flag?',
    options: ['Warm skin', 'A surgical scar', 'Petechial or purpuric rash', 'Mild bruising'],
    answer: 2,
    explanation: 'A petechial or purpuric rash is a red flag and needs urgent escalation.',
  },
  {
    question: 'When should you call for help during an A–E assessment?',
    options: ['Only after completing all five stages', 'After Exposure', 'Early if concerns show up at any stage', 'Only if the patient becomes unconscious'],
    answer: 2,
    explanation: 'You escalate early. A–E is not something you finish before acting.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AEAssessmentGuidePage() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setChecked((prev) => {
      const n = new Set(prev);
      if (n.has(i)) {
        n.delete(i);
      } else {
        n.add(i);
      }
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
          The A–E guide students usually wish they had sooner: the real framework, explained in wording you can actually think with under pressure.
        </p>
        <p className="ae-byline">Children&apos;s nursing · Paediatric OSCE prep · The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="ae-assessment-guide"
          hubItemTitle="A–E Assessment Framework"
        />

        <div className="ae-pearl" style={{ marginBottom: '40px' }}>
          <p className="ae-pearl-label">Student note</p>
          <p>If the words feel heavy, translate them back to the bedside. Perfusion means how well blood is getting around the body, AVPU is a quick way of saying how awake the child is, and escalation means asking for more senior help early.</p>
        </div>

        {/* Golden rules */}
        <div className="ae-golden">
          {[
            {
              n: '01',
              title: 'Reassess always',
              text: 'After every intervention, go back to A and look again. Do not assume the problem is fixed just because you have done something.',
            },
            {
              n: '02',
              title: 'PEWS score',
              text: 'Work out the PEWS each time you assess. The trend matters most, and a rising score should make you more concerned, not less.',
            },
            {
              n: '03',
              title: 'Escalate early',
              text: 'Children can compensate for a while and then deteriorate quickly. Do not wait for perfect proof before acting on concern.',
            },
            {
              n: '04',
              title: 'Parents know',
              text: 'If a parent says their child is not right, take that seriously. They usually know what is normal for their child better than you do on first meeting.',
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

        <h2 className="ae-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: A–E Assessment" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'Resuscitation Council UK (2021)', title: '2021 Resuscitation Guidelines', href: 'https://www.resus.org.uk/library/2021-resuscitation-guidelines' },
          { citation: 'NICE (2016)', title: 'Sepsis: recognition, diagnosis and early management (NG51)', href: 'https://www.nice.org.uk/guidance/ng51' },
          { citation: 'NICE (2007)', title: 'Acutely ill adults in hospital: recognising and responding to deterioration (CG50)', href: 'https://www.nice.org.uk/guidance/cg50' },
          { citation: 'NMC (2018)', title: 'The Code: Professional standards of practice and behaviour for nurses', href: 'https://www.nmc.org.uk/standards/code/' },
        ]} />
      </div>
    </div>
  );
}
