'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.fe-guide *, .fe-guide *::before, .fe-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.fe-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.fe-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

.fe-back {
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
.fe-back:hover { color: var(--ink-soft); }
.fe-back-arrow { font-style: normal; }

.fe-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.fe-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.fe-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.fe-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

.fe-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.fe-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.fe-golden-cell:last-child { border-right: none; }

.fe-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.fe-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.fe-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

.fe-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.fe-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.fe-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.fe-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.fe-step-content {
  padding-left: 32px;
}

.fe-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.fe-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

.fe-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.fe-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.fe-content-col:last-child { border-right: none; }

.fe-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.fe-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.fe-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.fe-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

.fe-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.fe-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.fe-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

.fe-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.fe-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.fe-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.fe-section-title {
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

.fe-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.fe-table th {
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
.fe-table th:last-child { border-right: none; }

.fe-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.fe-table td:last-child { border-right: none; }
.fe-table tr:last-child td { border-bottom: none; }
.fe-table td:first-child { font-weight: 400; color: var(--ink-mid); }

.fe-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.fe-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.fe-grid-2-cell:nth-child(2n) { border-right: none; }

.fe-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.fe-diagram {
  border: 0.5px solid var(--hairline-firm);
  padding: 24px 16px 14px;
  margin-bottom: 32px;
  background: var(--surface-page);
}
.fe-diagram svg { display: block; width: 100%; max-width: 460px; height: auto; margin: 0 auto; }
.fe-diagram-caption {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-align: center;
  margin-top: 12px;
}
.fe-diagram-key {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 14px;
}
.fe-diagram-key span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
}
.fe-diagram-key i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.fe-letter-1 { color: var(--blue-600); }
.fe-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.fe-letter-2 { color: var(--teal-600); }
.fe-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.fe-letter-3 { color: var(--coral-600); }
.fe-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.fe-letter-4 { color: var(--purple-600); }
.fe-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.fe-letter-5 { color: var(--gray-600); }
.fe-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.fe-letter-6 { color: #8B5E3C; }
.fe-badge-6 { background: var(--surface-sunken); color: #6B4729; }

@media (max-width: 860px) {
  .fe-wrap { padding: 24px 20px 48px; }
  .fe-headline { font-size: 34px; }
  .fe-golden { grid-template-columns: repeat(2, 1fr); }
  .fe-golden-cell:nth-child(2) { border-right: none; }
  .fe-golden-cell:nth-child(1), .fe-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .fe-step { grid-template-columns: 64px 1fr; }
  .fe-step-letter { font-size: 48px; }
  .fe-content-grid { grid-template-columns: repeat(2, 1fr); }
  .fe-content-col:nth-child(2) { border-right: none; }
  .fe-content-col:nth-child(1), .fe-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .fe-grid-2 { grid-template-columns: 1fr; }
  .fe-grid-2-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .fe-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .fe-golden { grid-template-columns: 1fr; }
  .fe-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .fe-golden-cell:last-child { border-bottom: none; }
  .fe-content-grid { grid-template-columns: 1fr; }
  .fe-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .fe-content-col:last-child { border-bottom: none; }
  .fe-step { grid-template-columns: 52px 1fr; }
  .fe-step-letter { font-size: 38px; }
  .fe-step-content { padding-left: 18px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Homeostasis Basics',
    question: 'How does the body keep its internal environment stable?',
    cols: [
      {
        header: 'What homeostasis means',
        items: [
          'Keeping the internal environment within a stable range',
          'Applies to temperature, pH, glucose, fluid, electrolytes',
          'A dynamic balance, not a fixed, unchanging state',
          'Constantly adjusted in response to internal/external change',
        ],
      },
      {
        header: 'Negative feedback',
        items: [
          'The most common homeostatic mechanism',
          'A change triggers a response that reverses the change',
          'Example: rising temperature triggers sweating to cool down',
          'Brings the body back towards its set point',
        ],
      },
      {
        header: 'Positive feedback',
        items: [
          'A change triggers a response that amplifies the change',
          'Much less common – used for a specific end point',
          'Example: contractions intensifying during labour',
          'Stops once the triggering event is complete',
        ],
      },
      {
        header: 'Key players',
        items: [
          'Receptor: detects the change',
          'Control centre: processes and decides the response',
          'Effector: carries out the response',
          'Nervous and endocrine systems drive most responses',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Almost every system you learn about – temperature, blood glucose, blood pressure, fluid balance – comes back to this same loop: receptor detects change, control centre decides, effector responds. Learning that one pattern well makes many other topics easier to understand.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Body Water & Compartments',
    question: 'Where is water held in the body, and how does this change with age?',
    cols: [
      {
        header: 'Fluid compartments',
        items: [
          'Intracellular fluid (ICF): inside cells, largest compartment',
          'Extracellular fluid (ECF): outside cells',
          'ECF splits into interstitial fluid and plasma',
          'Fluid moves between compartments to maintain balance',
        ],
      },
      {
        header: 'Water movement basics',
        items: [
          'Osmosis: water moves towards higher solute concentration',
          'Diffusion: particles move from high to low concentration',
          'Active transport: moves substances against their gradient, uses energy',
          'These three mechanisms underpin most fluid shifts',
        ],
      },
      {
        header: 'Why infants differ',
        items: [
          'Total body water is a higher percentage in infants',
          'A larger share of that water sits in the ECF',
          'Higher surface-area-to-body-weight ratio increases losses',
          'Higher metabolic rate increases fluid turnover',
        ],
      },
      {
        header: 'Why this matters clinically',
        items: [
          'Infants can dehydrate faster than older children or adults',
          'Smaller absolute fluid losses matter proportionally more',
          'Older adults often have lower total body water too',
          'Both ends of the age range need closer fluid monitoring',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Infants are not just "small adults" when it comes to fluid balance. A higher proportion of body water, more of it in the easily-lost extracellular compartment, and a higher metabolic rate all mean the same percentage fluid loss can become clinically significant much faster than in an adult.',
  },
  {
    number: '3',
    colour: '3',
    name: 'Key Electrolytes',
    question: 'What do the main electrolytes actually do, and what happens when they go out of range?',
    cols: [
      {
        header: 'Sodium (Na⁺)',
        items: [
          'Main extracellular cation, controls fluid distribution',
          'Essential for nerve impulse conduction',
          'Low (hyponatraemia): confusion, headache, seizures',
          'High (hypernatraemia): thirst, confusion, irritability',
        ],
      },
      {
        header: 'Potassium (K⁺)',
        items: [
          'Main intracellular cation, essential for cardiac rhythm',
          'Even small shifts can affect the heart significantly',
          'Low (hypokalaemia): weakness, arrhythmias, cramps',
          'High (hyperkalaemia): weakness, dangerous arrhythmias',
        ],
      },
      {
        header: 'Calcium (Ca²⁺)',
        items: [
          'Needed for bone strength, muscle contraction, clotting',
          'Regulated by parathyroid hormone and vitamin D',
          'Low (hypocalcaemia): tingling, muscle spasm, cramps',
          'High (hypercalcaemia): fatigue, constipation, confusion',
        ],
      },
      {
        header: 'Magnesium (Mg²⁺)',
        items: [
          'Involved in muscle and nerve function, enzyme activity',
          'Works closely alongside calcium and potassium',
          'Low (hypomagnesaemia): tremor, weakness, arrhythmias',
          'Imbalances often occur alongside other electrolyte shifts',
        ],
      },
    ],
    redFlags: ['Severe hyperkalaemia', 'Severe hyponatraemia with seizures', 'Cardiac arrhythmia linked to an electrolyte result'],
    pearl:
      'Potassium is the electrolyte most likely to kill quickly if badly deranged, because both very high and very low levels can cause life-threatening cardiac arrhythmias. Any significantly abnormal potassium result deserves prompt attention, not a "we’ll check again later" approach.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Fluid Balance in Children',
    question: 'How do you assess and grade dehydration in a child?',
    cols: [
      {
        header: 'Why children are higher risk',
        items: [
          'Cannot always communicate thirst clearly',
          'Higher fluid turnover for their size',
          'Vomiting and diarrhoea cause rapid losses',
          'Small absolute losses are proportionally larger',
        ],
      },
      {
        header: 'Clinical signs to check',
        items: [
          'Alertness, activity, and interaction',
          'Mucous membranes: moist or dry',
          'Skin turgor and capillary refill time',
          'Urine output and number of wet nappies',
        ],
      },
      {
        header: 'Grading severity',
        items: [
          'Mild (no clinical signs): usually manageable at home',
          'Moderate: some signs, e.g. dry mucous membranes, reduced urine',
          'Severe: sunken eyes, prolonged CRT, lethargy, shock features',
          'Grading guides whether oral, ORS, or IV fluids are needed',
        ],
      },
      {
        header: 'Management approach',
        items: [
          'Mild-moderate: oral rehydration solution (ORS) usually first line',
          'Severe or unable to tolerate oral fluids: IV fluids',
          'Reassess regularly – status can change quickly',
          'Encourage continued breastfeeding/feeding where appropriate',
        ],
      },
    ],
    redFlags: [
      'Sunken eyes or fontanelle in an infant',
      'Prolonged capillary refill time',
      'Lethargy or reduced consciousness',
      'Significantly reduced urine output',
    ],
    pearl:
      'A child can look reasonably well and then deteriorate quickly once dehydration becomes severe, because children compensate well until they suddenly do not. Reassessing regularly matters more than relying on a single snapshot assessment.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Fluid Balance in Adults',
    question: 'What changes in adult fluid assessment, especially in older adults and long-term conditions?',
    cols: [
      {
        header: 'Dehydration in adults',
        items: [
          'Older adults have a blunted thirst response',
          'Reduced total body water compared with younger adults',
          'Confusion can be an early sign, not just a late one',
          'Certain medications (e.g. diuretics) increase risk',
        ],
      },
      {
        header: 'Fluid overload',
        items: [
          'Heart failure: fluid can back up into the lungs',
          'Renal failure: kidneys cannot excrete fluid effectively',
          'Watch for breathlessness, oedema, weight gain',
          'Fluid restriction may be part of management',
        ],
      },
      {
        header: 'Assessment in adults',
        items: [
          'Fluid balance chart: input vs output over 24 hours',
          'Daily weight trends for those at risk of overload',
          'Skin turgor is less reliable in older adults',
          'Blood results (U&Es) support the clinical picture',
        ],
      },
      {
        header: 'Special situations',
        items: [
          'Post-operative patients: watch third-spacing of fluid',
          'Patients on diuretics: monitor electrolytes closely',
          'Enteral/parenteral feeding: fluid is part of the regimen',
          'Sepsis: fluid needs can change rapidly',
        ],
      },
    ],
    redFlags: [
      'New confusion with signs of dehydration',
      'Breathlessness and frothy sputum with fluid overload',
      'Rapid weight gain over a short period',
      'Reduced urine output with rising creatinine',
    ],
    pearl:
      'Skin turgor is a less reliable sign of dehydration in older adults because skin naturally loses elasticity with age. New or worsening confusion is often a more useful early clue in this group and should not automatically be written off as "just their normal."',
  },
  {
    number: '6',
    colour: '6',
    name: 'Nursing Assessment & Documentation',
    question: 'How do you monitor and document fluid balance accurately at the bedside?',
    cols: [
      {
        header: 'Fluid balance chart',
        items: [
          'Record all input: oral, IV, enteral',
          'Record all output: urine, vomit, drains, stoma losses',
          'Calculate a running total, usually every 24 hours',
          'A negative or strongly positive balance needs review',
        ],
      },
      {
        header: 'Bedside checks',
        items: [
          'Weight trends are one of the most reliable indicators',
          'Urine output: aim is roughly 0.5–1 ml/kg/hour as a guide',
          'Oedema: check ankles, sacrum, and around IV sites',
          'Vital signs alongside fluid status, not in isolation',
        ],
      },
      {
        header: 'Escalation triggers',
        items: [
          'Significantly negative or positive fluid balance',
          'New confusion, breathlessness, or reduced consciousness',
          'Abnormal electrolyte results, especially potassium',
          'Any deterioration in an already-vulnerable patient',
        ],
      },
      {
        header: 'Communication',
        items: [
          'Document clearly, legibly, and in real time where possible',
          'Hand over fluid status and trends, not just a single number',
          'Flag concerns early rather than waiting for the next round',
          'Involve the patient/family in fluid intake where appropriate',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'A single fluid balance figure tells you much less than a trend. A patient who is "balanced" today after being significantly negative yesterday still needs watching – the direction of travel often matters as much as the number itself.',
  },
];

const compartmentRows = [
  { compartment: 'Intracellular fluid (ICF)', location: 'Inside cells', note: 'The largest fluid compartment by volume; potassium is the dominant cation here.' },
  { compartment: 'Interstitial fluid', location: 'Between cells, outside blood vessels', note: 'Part of the extracellular fluid; bathes tissues and exchanges with plasma and cells.' },
  { compartment: 'Plasma', location: 'Inside blood vessels', note: 'The fluid portion of blood; sodium is the dominant cation in the extracellular fluid overall.' },
];

const electrolyteRangeRows = [
  { electrolyte: 'Sodium (Na⁺)', typicalRange: 'Roughly 135–145 mmol/L (adult)', role: 'Fluid balance, nerve conduction, acid-base balance' },
  { electrolyte: 'Potassium (K⁺)', typicalRange: 'Roughly 3.5–5.0 mmol/L (adult)', role: 'Cardiac rhythm, nerve and muscle function' },
  { electrolyte: 'Calcium (Ca²⁺)', typicalRange: 'Roughly 2.2–2.6 mmol/L (adult, total)', role: 'Bone strength, muscle contraction, blood clotting' },
  { electrolyte: 'Magnesium (Mg²⁺)', typicalRange: 'Roughly 0.7–1.0 mmol/L (adult)', role: 'Enzyme function, muscle and nerve activity' },
];

const sodiumRows = [
  { direction: 'Hyponatraemia (low)', signs: 'Headache, nausea, confusion, lethargy; severe cases can cause seizures.', causes: 'Excess water relative to sodium, some diuretics, SIADH, vomiting with water replacement only.' },
  { direction: 'Hypernatraemia (high)', signs: 'Thirst, dry mucous membranes, confusion, irritability, lethargy.', causes: 'Insufficient water intake, excessive water loss, or excess sodium intake relative to water.' },
];

const potassiumRows = [
  { direction: 'Hypokalaemia (low)', signs: 'Muscle weakness, cramps, fatigue, cardiac arrhythmias.', causes: 'Diuretics, vomiting, diarrhoea, inadequate intake.' },
  { direction: 'Hyperkalaemia (high)', signs: 'Muscle weakness, tingling, potentially dangerous cardiac arrhythmias.', causes: 'Renal impairment, certain medications, tissue injury, excess intake.' },
];

const dehydrationGradeRows = [
  { grade: 'Mild (no clinical signs)', signs: 'Child looks well, alert, normal mucous membranes and skin turgor.', approach: 'Encourage normal fluids; ORS often not needed unless losses continue.' },
  { grade: 'Moderate', signs: 'Slightly reduced activity, dry mucous membranes, reduced urine output.', approach: 'Oral rehydration solution (ORS) given in small, frequent amounts is usually first line.' },
  { grade: 'Severe', signs: 'Lethargy, sunken eyes/fontanelle, prolonged capillary refill, features of shock.', approach: 'Needs urgent assessment; IV fluids are often required alongside close monitoring.' },
];

const fluidChartRows = [
  { entry: 'Input', includes: 'Oral fluids, IV fluids, enteral feed, any fluid given with medications.' },
  { entry: 'Output', includes: 'Urine, vomit, diarrhoea, drain losses, stoma output, significant wound exudate.' },
  { entry: 'Running total', includes: 'Input minus output, usually calculated over a 24-hour period, reviewed at handover.' },
];

const quizQuestions = [
  {
    question: 'What is the key difference between negative and positive feedback in homeostasis?',
    options: [
      'Negative feedback amplifies a change, positive feedback reverses it',
      'Negative feedback reverses a change, positive feedback amplifies it',
      'They are two names for the same mechanism',
      'Positive feedback is the most common mechanism in the body',
    ],
    answer: 1,
    explanation: 'Negative feedback reverses a change to bring the body back to its set point and is the most common mechanism. Positive feedback amplifies a change until a specific end point, such as labour contractions.',
  },
  {
    question: 'Why can infants dehydrate faster than adults?',
    options: [
      'They have a lower proportion of total body water',
      'They have a higher proportion of total body water, more of it extracellular, and a higher metabolic rate',
      'They have a lower surface-area-to-body-weight ratio',
      'Their kidneys concentrate urine more effectively than an adult’s',
    ],
    answer: 1,
    explanation: 'Infants have a higher percentage of total body water, more of it sitting in the more easily lost extracellular compartment, plus a higher metabolic rate and surface-area-to-weight ratio, all of which increase fluid turnover and risk.',
  },
  {
    question: 'Which electrolyte imbalance is most associated with dangerous cardiac arrhythmias at both extremes?',
    options: ['Calcium', 'Magnesium', 'Potassium', 'Sodium'],
    answer: 2,
    explanation: 'Both hypokalaemia and hyperkalaemia can cause significant, potentially life-threatening cardiac arrhythmias, which is why abnormal potassium results are treated with urgency.',
  },
  {
    question: 'A child has dry mucous membranes and reduced urine output but is still alert. Which dehydration grade does this best fit?',
    options: ['Mild (no clinical signs)', 'Moderate', 'Severe', 'This is a normal finding, no grading needed'],
    answer: 1,
    explanation: 'Dry mucous membranes and reduced urine output with preserved alertness are typical of moderate dehydration, usually managed with oral rehydration solution.',
  },
  {
    question: 'Why is skin turgor a less reliable sign of dehydration in older adults?',
    options: [
      'Older adults never become dehydrated',
      'Skin naturally loses elasticity with age, independent of hydration status',
      'Skin turgor only applies to infants',
      'Older adults have more extracellular fluid than younger adults',
    ],
    answer: 1,
    explanation: 'Skin naturally becomes less elastic with age, so reduced turgor is a less reliable dehydration sign in older adults; new confusion is often a more useful clue in this group.',
  },
  {
    question: 'What does a fluid balance chart running total tell you?',
    options: [
      'The patient’s current blood pressure',
      'The difference between total fluid input and output, usually over 24 hours',
      'The patient’s electrolyte levels',
      'Whether the patient is in pain',
    ],
    answer: 1,
    explanation: 'A fluid balance chart tracks input (oral, IV, enteral) against output (urine, vomit, drains, stoma losses) to give a running total that highlights whether a patient is becoming fluid negative or positive.',
  },
  {
    question: 'Which is a red flag suggesting fluid overload rather than dehydration?',
    options: [
      'Sunken eyes and dry mucous membranes',
      'Breathlessness with frothy sputum and rapid weight gain',
      'Prolonged capillary refill time',
      'Reduced skin turgor',
    ],
    answer: 1,
    explanation: 'Breathlessness, frothy sputum, and rapid weight gain suggest fluid overload, for example in heart failure, rather than dehydration.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FluidsElectrolytesHomeostasisPage() {
  return (
    <div className="fe-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="fe-wrap">
        <Link href="/hub" className="fe-back">
          <span className="fe-back-arrow">&larr;</span>
          Nursing Hub
        </Link>

        <p className="fe-kicker">Anatomy &amp; Physiology &middot; Children&apos;s &amp; Adult Nursing</p>
        <h1 className="fe-headline">Fluids, Electrolytes &amp; Homeostasis</h1>
        <p className="fe-standfirst">
          How the body keeps its internal balance, where fluid sits, what electrolytes actually do, and how dehydration and overload show up differently in children and adults.
        </p>
        <p className="fe-byline">Children&apos;s &amp; adult nursing &middot; The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="fluids-electrolytes-homeostasis"
          hubItemTitle="Fluids, Electrolytes & Homeostasis"
        />

        <div className="fe-pearl" style={{ marginBottom: '40px' }}>
          <p className="fe-pearl-label">Student note</p>
          <p>A cation is a positively charged ion (sodium and potassium are the two you will use most). Osmosis is water moving towards a higher solute concentration. ORS stands for oral rehydration solution. U&amp;Es refers to the urea and electrolytes blood test used to check kidney function and electrolyte balance.</p>
        </div>

        <div className="fe-golden">
          {[
            { n: '01', title: 'Core loop', text: 'Receptor detects change → control centre decides → effector responds. Most homeostasis topics use this pattern.' },
            { n: '02', title: 'Age rule', text: 'More body water, more of it extracellular, higher metabolic rate – infants dehydrate faster than adults.' },
            { n: '03', title: 'Potassium rule', text: 'Both high and low potassium can cause dangerous arrhythmias – treat abnormal results with urgency.' },
            { n: '04', title: 'Trend rule', text: 'A single fluid balance number matters less than the trend over the last 24–48 hours.' },
          ].map((cell) => (
            <div key={cell.n} className="fe-golden-cell">
              <span className="fe-golden-numeral">{cell.n}</span>
              <p className="fe-golden-title">{cell.title}</p>
              <p className="fe-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="fe-step">
            <div className="fe-step-sidebar">
              <span className={`fe-step-letter fe-letter-${section.colour}`}>{section.number}</span>
              <span className={`fe-step-badge fe-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="fe-step-content">
              <h2 className="fe-step-name">{section.name}</h2>
              <p className="fe-step-question">{section.question}</p>

              <div className="fe-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="fe-content-col">
                    <p className="fe-col-header">{col.header}</p>
                    <ul className="fe-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="fe-redflags-label">Red flags</p>
                  <div className="fe-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="fe-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="fe-pearl">
                  <p className="fe-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        <h2 className="fe-section-title">Fluid Compartments</h2>
        <table className="fe-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Compartment</th>
              <th>Location</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {compartmentRows.map((row) => (
              <tr key={row.compartment}>
                <td>{row.compartment}</td>
                <td>{row.location}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="fe-diagram">
          <svg viewBox="0 0 500 180" role="img" aria-label="Diagram of body water split into intracellular fluid, and extracellular fluid split further into interstitial fluid and plasma">
            <rect x={20} y={20} width={300} height={60} style={{ fill: 'var(--teal-50)', stroke: 'var(--teal-600)', strokeWidth: 1 }} />
            <text x={170} y={48} textAnchor="middle" style={{ fill: 'var(--teal-800)', fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600 }}>ICF</text>
            <text x={170} y={64} textAnchor="middle" style={{ fill: 'var(--teal-800)', fontFamily: "'Inter', sans-serif", fontSize: 8 }}>about 2/3 of body water</text>

            <rect x={330} y={20} width={150} height={60} style={{ fill: 'var(--blue-50)', stroke: 'var(--blue-600)', strokeWidth: 1 }} />
            <text x={405} y={48} textAnchor="middle" style={{ fill: 'var(--blue-800)', fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600 }}>ECF</text>
            <text x={405} y={64} textAnchor="middle" style={{ fill: 'var(--blue-800)', fontFamily: "'Inter', sans-serif", fontSize: 8 }}>about 1/3 of body water</text>

            <line x1={330} y1={80} x2={340} y2={120} style={{ stroke: 'var(--ink-faint)', strokeWidth: 1, strokeDasharray: '3 2' }} />
            <line x1={480} y1={80} x2={470} y2={120} style={{ stroke: 'var(--ink-faint)', strokeWidth: 1, strokeDasharray: '3 2' }} />

            <rect x={340} y={120} width={95} height={50} style={{ fill: 'var(--blue-50)', stroke: 'var(--blue-600)', strokeWidth: 1, opacity: 0.65 }} />
            <text x={387} y={149} textAnchor="middle" style={{ fill: 'var(--blue-800)', fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 600 }}>INTERSTITIAL</text>

            <rect x={435} y={120} width={35} height={50} style={{ fill: 'var(--coral-50)', stroke: 'var(--coral-600)', strokeWidth: 1 }} />
          </svg>
          <div className="fe-diagram-key">
            <span><i style={{ background: 'var(--teal-600)' }} />ICF &mdash; inside cells</span>
            <span><i style={{ background: 'var(--blue-600)' }} />Interstitial fluid</span>
            <span><i style={{ background: 'var(--coral-600)' }} />Plasma</span>
          </div>
          <p className="fe-diagram-caption">ECF splits into interstitial fluid (around the cells) and plasma (inside vessels) &mdash; proportions are illustrative</p>
        </div>

        <h2 className="fe-section-title">Electrolyte Reference</h2>
        <table className="fe-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Electrolyte</th>
              <th>Typical adult range</th>
              <th>Main role</th>
            </tr>
          </thead>
          <tbody>
            {electrolyteRangeRows.map((row) => (
              <tr key={row.electrolyte}>
                <td>{row.electrolyte}</td>
                <td>{row.typicalRange}</td>
                <td>{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="fe-pearl" style={{ marginBottom: '32px' }}>
          <p className="fe-pearl-label">Student note</p>
          <p>These ranges are typical adult reference ranges used widely in UK nursing education. Paediatric ranges can differ slightly by age, and every lab publishes its own local reference range on the result – always check the range printed alongside the result rather than relying on memory alone.</p>
        </div>

        <h2 className="fe-section-title">Sodium Imbalance</h2>
        <table className="fe-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Direction</th>
              <th>Signs</th>
              <th>Common causes</th>
            </tr>
          </thead>
          <tbody>
            {sodiumRows.map((row) => (
              <tr key={row.direction}>
                <td>{row.direction}</td>
                <td>{row.signs}</td>
                <td>{row.causes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="fe-section-title">Potassium Imbalance</h2>
        <table className="fe-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Direction</th>
              <th>Signs</th>
              <th>Common causes</th>
            </tr>
          </thead>
          <tbody>
            {potassiumRows.map((row) => (
              <tr key={row.direction}>
                <td>{row.direction}</td>
                <td>{row.signs}</td>
                <td>{row.causes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="fe-section-title">Dehydration Grading in Children</h2>
        <table className="fe-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Grade</th>
              <th>Typical signs</th>
              <th>Usual approach</th>
            </tr>
          </thead>
          <tbody>
            {dehydrationGradeRows.map((row) => (
              <tr key={row.grade}>
                <td>{row.grade}</td>
                <td>{row.signs}</td>
                <td>{row.approach}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="fe-section-title">Fluid Balance Chart Components</h2>
        <table className="fe-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Entry type</th>
              <th>What it includes</th>
            </tr>
          </thead>
          <tbody>
            {fluidChartRows.map((row) => (
              <tr key={row.entry}>
                <td>{row.entry}</td>
                <td>{row.includes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="fe-pearl" style={{ marginBottom: '32px' }}>
          <p className="fe-pearl-label">Clinical pearl</p>
          <p>If you are worried about fluid status in either a child or an adult: check trends not single numbers, look at the whole clinical picture (alertness, colour, perfusion, urine output), escalate early, and always cross-reference against U&amp;E results where available rather than fluid balance alone.</p>
        </div>

        <h2 className="fe-section-title">Quick Mnemonic Recap</h2>
        <div className="fe-golden" style={{ marginBottom: '40px' }}>
          {[
            { n: '01', title: 'Feedback types', text: 'Negative reverses change (common); positive amplifies change (rare, e.g. labour)' },
            { n: '02', title: 'Compartments', text: 'ICF (inside cells) is largest; ECF splits into interstitial fluid and plasma' },
            { n: '03', title: 'Big two ions', text: 'Sodium: mainly extracellular. Potassium: mainly intracellular. Both critical to monitor' },
            { n: '04', title: 'Escalate on', text: 'Confusion, breathlessness, reduced urine output, or abnormal potassium result' },
          ].map((cell) => (
            <div key={cell.n} className="fe-golden-cell">
              <span className="fe-golden-numeral">{cell.n}</span>
              <p className="fe-golden-title">{cell.title}</p>
              <p className="fe-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        <h2 className="fe-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Fluids, Electrolytes & Homeostasis" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'Waugh A & Grant A (2018)', title: 'Ross and Wilson Anatomy and Physiology in Health and Illness (13th edn)', href: 'https://www.elsevier.com/' },
          { citation: 'NICE (2015, updated 2021)', title: 'Intravenous fluid therapy in children and young people in hospital (NG29)', href: 'https://www.nice.org.uk/guidance/ng29' },
          { citation: 'NICE (2013, updated 2017)', title: 'Intravenous fluid therapy in adults in hospital (CG174)', href: 'https://www.nice.org.uk/guidance/cg174' },
          { citation: 'NICE (2009, updated 2019)', title: 'Diarrhoea and vomiting caused by gastroenteritis in under 5s (CG84)', href: 'https://www.nice.org.uk/guidance/cg84' },
        ]} />
      </div>
    </div>
  );
}
