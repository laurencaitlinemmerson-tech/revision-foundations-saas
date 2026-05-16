'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.dh-guide *, .dh-guide *::before, .dh-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.dh-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.dh-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.dh-back {
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
.dh-back:hover { color: #555; }
.dh-back-arrow { font-style: normal; }

/* Masthead */
.dh-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.dh-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.dh-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.dh-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
}

/* Golden rules grid */
.dh-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.dh-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.dh-golden-cell:last-child { border-right: none; }

.dh-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.dh-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.dh-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.dh-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 24px;
}

.dh-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.dh-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.dh-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.dh-step-content {
  padding-left: 32px;
}

.dh-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.dh-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.dh-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.dh-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.dh-content-col:last-child { border-right: none; }

.dh-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.dh-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dh-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.dh-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Red flags */
.dh-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.dh-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.dh-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.dh-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.dh-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.dh-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.dh-section-title {
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
.dh-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 0;
  font-size: 13px;
}

.dh-table th {
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
.dh-table th:last-child { border-right: none; }

.dh-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.dh-table td:last-child { border-right: none; }
.dh-table tr:last-child td { border-bottom: none; }
.dh-table td:first-child { font-weight: 400; color: #2C2A27; }

/* 4-col info grid */
.dh-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.dh-info-cell {
  padding: 18px 16px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.dh-info-cell:last-child { border-right: none; }

.dh-info-cell-title {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #333;
  margin-bottom: 12px;
  font-weight: 400;
  padding-bottom: 8px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

.dh-info-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.dh-info-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0 2px 10px;
  font-weight: 300;
  position: relative;
}
.dh-info-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* 2-col grid */
.dh-two-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.dh-two-cell {
  padding: 18px 16px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.dh-two-cell:last-child { border-right: none; }

.dh-two-cell-title {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #333;
  margin-bottom: 12px;
  font-weight: 400;
  padding-bottom: 8px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

.dh-two-text {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Step colour system */
.dh-letter-1 { color: #185FA5; }
.dh-badge-1 { background: #E6F1FB; color: #0C447C; }
.dh-letter-2 { color: #0F6E56; }
.dh-badge-2 { background: #E1F5EE; color: #085041; }
.dh-letter-3 { color: #993C1D; }
.dh-badge-3 { background: #FAECE7; color: #712B13; }
.dh-letter-4 { color: #534AB7; }
.dh-badge-4 { background: #EEEDFE; color: #3C3489; }
.dh-letter-5 { color: #5F5E5A; }
.dh-badge-5 { background: #F1EFE8; color: #444441; }
.dh-letter-6 { color: #8B5E3C; }
.dh-badge-6 { background: #F5EDE5; color: #6B4529; }

/* Responsive */
@media (max-width: 860px) {
  .dh-wrap { padding: 24px 20px 48px; }
  .dh-headline { font-size: 36px; }
  .dh-golden { grid-template-columns: 1fr 1fr; }
  .dh-golden-cell { border-bottom: 0.5px solid rgba(0,0,0,0.12); }
  .dh-step { grid-template-columns: 1fr; }
  .dh-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); padding-bottom: 16px; margin-bottom: 16px; padding-right: 0; }
  .dh-step-content { padding-left: 0; }
  .dh-content-grid { grid-template-columns: 1fr 1fr; }
  .dh-content-col { border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .dh-info-grid { grid-template-columns: 1fr 1fr; }
  .dh-info-cell { border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .dh-two-grid { grid-template-columns: 1fr; }
  .dh-two-cell { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .dh-table { font-size: 11px; }
}

@media (max-width: 520px) {
  .dh-golden { grid-template-columns: 1fr; }
  .dh-content-grid { grid-template-columns: 1fr; }
  .dh-info-grid { grid-template-columns: 1fr; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'What Dehydration Actually Is',
    question: 'What is happening in the body, and why does it matter?',
    cols: [
      {
        header: 'The basic idea',
        items: [
          'Dehydration is loss of body water, often with electrolytes',
          'Total body water sits inside and outside cells',
          'Children have proportionally more body water than adults',
          'Fluid balance is regulated continuously by kidneys and hormones',
        ],
      },
      {
        header: 'Why losses happen',
        items: [
          'Vomiting, diarrhoea, fever, sweating, tachypnoea',
          'Burns and large open wounds',
          'Inadequate intake (unwell, nil by mouth, confused)',
          'Diabetic ketoacidosis and uncontrolled diabetes',
        ],
      },
      {
        header: 'Why it matters',
        items: [
          'Reduced circulating volume lowers perfusion',
          'Heart rate rises to compensate',
          'Kidneys, brain, and gut are sensitive to low perfusion',
          'Severe dehydration can become shock',
        ],
      },
      {
        header: 'Children and adults compared',
        items: [
          'Children dehydrate faster than adults',
          'Older adults often present later and with subtler signs',
          'Both have less reserve than fit young adults',
          'Both groups can decompensate suddenly when they tip',
        ],
      },
    ],
    redFlags: ['Reduced consciousness with poor perfusion', 'Anuria', 'Shock signs (mottled, cold, prolonged CRT, tachycardia, hypotension)'],
    pearl:
      'Dehydration is not just "needing a drink". It is a whole-body problem with cardiovascular, renal, and neurological consequences. By the time blood pressure falls in a child, they have usually been compensating for some time and need urgent fluid resuscitation.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Types of Dehydration',
    question: 'Why does the sodium level change the picture?',
    cols: [
      {
        header: 'Isotonic',
        items: [
          'Equal water and sodium loss',
          'Most common type',
          'Often seen with simple gastroenteritis',
          'Sodium stays in normal range',
        ],
      },
      {
        header: 'Hypotonic',
        items: [
          'More sodium lost than water',
          'Low serum sodium',
          'Water moves into cells, brain can swell',
          'Risk of seizures and altered consciousness',
        ],
      },
      {
        header: 'Hypertonic',
        items: [
          'More water lost than sodium',
          'High serum sodium',
          'Cells shrink as water leaves them',
          'Skin can feel "doughy", child often very irritable',
        ],
      },
      {
        header: 'Why this matters',
        items: [
          'Correction speed depends on the type',
          'Correcting sodium too fast causes serious harm',
          'Always interpret losses alongside U&Es',
          'Senior input needed for non-isotonic pictures',
        ],
      },
    ],
    redFlags: ['Sodium <130 or >150 mmol/L', 'Seizure with dehydration', 'Altered consciousness with abnormal sodium'],
    pearl:
      'Hypertonic and hypotonic dehydration are not just lab labels. They change how fluid replacement is planned, because sodium correction that is too fast can cause cerebral oedema or osmotic demyelination. This is why senior review and slower correction are essential.',
  },
  {
    number: '3',
    colour: '3',
    name: 'Assessment in Children',
    question: 'How do you grade dehydration in a child at the bedside?',
    cols: [
      {
        header: 'No clinical dehydration',
        items: [
          'Alert and responsive',
          'Normal colour and skin turgor',
          'Moist mucous membranes, normal eyes and tears',
          'Normal urine output and capillary refill',
        ],
      },
      {
        header: 'Clinical dehydration',
        items: [
          'Appears unwell or behaviour changed',
          'Reduced urine output',
          'Sunken eyes, decreased skin turgor, dry mucous membranes',
          'Tachycardia, tachypnoea, normal or borderline BP',
        ],
      },
      {
        header: 'Clinical shock',
        items: [
          'Decreased level of consciousness',
          'Pale or mottled skin',
          'Cold extremities and prolonged CRT',
          'Tachycardia, weak peripheral pulses, hypotension (late)',
        ],
      },
      {
        header: 'Useful extras',
        items: [
          'Weight is the best single objective measure',
          '1 kg loss is roughly 1 L fluid deficit',
          'Trends in observations matter more than one reading',
          'Always interpret alongside fontanelle in infants',
        ],
      },
    ],
    redFlags: ['Reduced consciousness', 'Mottled or cold peripheries with prolonged CRT', 'Hypotension', 'Anuria'],
    pearl:
      'Hypotension is a late and serious sign in children. They compensate by increasing heart rate and constricting peripherally, so a child with cold hands, fast heart rate, and prolonged capillary refill is already in trouble, even before blood pressure changes.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Assessment in Adults',
    question: 'What changes in older or adult patients?',
    cols: [
      {
        header: 'Common signs',
        items: [
          'Thirst (may be reduced in older adults)',
          'Dry mucous membranes and reduced skin turgor',
          'Tachycardia, postural hypotension',
          'Concentrated urine and reduced output',
        ],
      },
      {
        header: 'Older adults are different',
        items: [
          'Thirst sensation often blunted',
          'May present with confusion, falls, or "off legs"',
          'Often on diuretics or other meds that worsen losses',
          'Skin turgor less reliable due to skin changes',
        ],
      },
      {
        header: 'Useful measures',
        items: [
          'Daily weights where possible',
          'Strict fluid balance: intake vs output',
          'Urine output target ~0.5 ml/kg/hr in adults',
          'U&Es, creatinine, lactate, and capillary glucose',
        ],
      },
      {
        header: 'When to worry',
        items: [
          'New confusion or drowsiness',
          'Postural drop with symptoms',
          'AKI on bloods or rising creatinine',
          'Hypotension not explained by other causes',
        ],
      },
    ],
    redFlags: ['New confusion in an unwell adult', 'Significant AKI on bloods', 'Hypotension with low urine output', 'Lactate rising with dehydration'],
    pearl:
      'In adults, especially older ones, dehydration often hides behind other labels: a fall, confusion, weakness, a "UTI". Always check fluid intake, observations, urine output, and bloods. Rehydration can be the single most important treatment in a deteriorating older patient.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Fluid Replacement',
    question: 'How do you correct dehydration safely?',
    cols: [
      {
        header: 'Mild to moderate (children)',
        items: [
          'Oral rehydration solution (ORS) is first line',
          'Give small, frequent amounts',
          'Continue breastfeeding or feeding where possible',
          'Reassess regularly and step up if not improving',
        ],
      },
      {
        header: 'When to use IV fluids',
        items: [
          'Shock, severe dehydration, or persistent vomiting',
          'Unable to tolerate or refusing oral fluids',
          'Reduced consciousness or neurological signs',
          'Significant electrolyte disturbance',
        ],
      },
      {
        header: 'Resuscitation fluids',
        items: [
          'Isotonic crystalloid bolus (e.g. 10–20 ml/kg in children, 250–500 ml in adults)',
          'Reassess after every bolus',
          'Escalate early if no response',
          'Senior input for hypertonic or hypotonic pictures',
        ],
      },
      {
        header: 'Maintenance fluids',
        items: [
          'Use weight-based or surface-area formulas (e.g. 4-2-1 in children)',
          'Match ongoing losses (vomiting, drains, stoma, fever)',
          'Recheck U&Es daily on IV fluids',
          'Watch for fluid overload, especially in vulnerable patients',
        ],
      },
    ],
    redFlags: ['No response after two boluses', 'Worsening consciousness during rehydration', 'Sudden drop in urine output despite fluids', 'Rapidly rising sodium or worsening electrolytes'],
    pearl:
      'Fluids are a drug, not just hydration. The wrong type, rate, or volume can cause harm. Always document weight, type of fluid, rate, total volume given, and response. Reassess regularly: the plan should change if the patient changes.',
  },
  {
    number: '6',
    colour: '6',
    name: 'Whole-Body Impact and Prevention',
    question: 'Why does dehydration affect so many systems, and how can it be prevented?',
    cols: [
      {
        header: 'Cardiovascular',
        items: [
          'Reduced volume lowers stroke volume',
          'Tachycardia is an early compensation',
          'Prolonged CRT and cool peripheries follow',
          'Hypotension is a late, serious sign',
        ],
      },
      {
        header: 'Renal',
        items: [
          'Poor perfusion causes pre-renal AKI',
          'Urine output falls before bloods change dramatically',
          'Creatinine and urea may rise',
          'Concentrated dark urine is an early clue',
        ],
      },
      {
        header: 'Neurological',
        items: [
          'Brain is sensitive to sodium and water shifts',
          'Confusion, irritability, drowsiness',
          'Seizures in severe sodium disturbance',
          'Falls and "off legs" in older adults',
        ],
      },
      {
        header: 'Prevention',
        items: [
          'Encourage fluids in heat, illness, and post-op recovery',
          'Education for parents on ORS during gastroenteritis',
          'Regular fluid offering for older adults and care home residents',
          'Fluid balance charts only useful if actually completed',
        ],
      },
    ],
    redFlags: [
      'Reduced consciousness with dehydration',
      'Significant AKI',
      'Severe sodium or potassium disturbance',
      'Signs of shock',
    ],
    pearl:
      'A dehydrated patient is rarely just dehydrated. They may have an AKI, electrolyte problem, infection, or new neurological picture brewing alongside. Treat the fluid deficit, but always look for the cause and reassess everything else too.',
  },
];

const quizQuestions = [
  {
    question: 'Which is usually the EARLIEST sign of significant dehydration in a child?',
    options: ['Hypotension', 'Tachycardia and reduced urine output', 'Reduced consciousness', 'Cold central body'],
    answer: 1,
    explanation: 'Children compensate by increasing heart rate and reducing urine output well before blood pressure falls, so these are the earlier signs.',
  },
  {
    question: 'Which sign suggests a child has moved from clinical dehydration to clinical shock?',
    options: ['Dry mucous membranes', 'Slightly reduced urine output', 'Mottled, cool peripheries with prolonged CRT', 'Asking for more drinks'],
    answer: 2,
    explanation: 'Mottled, cool peripheries with prolonged capillary refill suggest poor perfusion and a shocked picture, not just dehydration.',
  },
  {
    question: 'Which fluid is usually first-line for mild to moderate dehydration in children?',
    options: ['IV 0.9% sodium chloride', 'Plain water at home', 'Oral rehydration solution (ORS)', 'IV 5% dextrose alone'],
    answer: 2,
    explanation: 'ORS replaces water with the right balance of sodium, potassium, and glucose, which is why it works better than plain water for unwell children.',
  },
  {
    question: 'Why is sodium correction speed so important?',
    options: ['It changes the colour of urine', 'Correcting too fast can cause serious neurological harm', 'It changes blood group', 'It always raises potassium'],
    answer: 1,
    explanation: 'Correcting sodium too quickly can cause cerebral oedema or osmotic demyelination, so abnormal sodium needs careful, senior-led management.',
  },
  {
    question: 'Which group is MOST at risk of presenting late with dehydration?',
    options: ['Healthy young adults', 'Older adults, especially those with cognitive impairment', 'Teenagers with sports illness', 'Postnatal women on day one'],
    answer: 1,
    explanation: 'Older adults often have blunted thirst and may present with falls, confusion, or "off legs" rather than typical dehydration signs.',
  },
  {
    question: 'A child has had a 10 ml/kg bolus with little improvement. What should you do?',
    options: ['Wait and see for an hour', 'Discharge home with oral fluids', 'Reassess and escalate; further fluid and senior review needed', 'Stop fluids entirely'],
    answer: 2,
    explanation: 'Poor response to a fluid bolus is a red flag. Reassess fully, escalate, and prepare for further fluids and possible HDU/PICU input.',
  },
  {
    question: 'Which urine finding usually appears first in dehydration?',
    options: ['Frank blood', 'Concentrated, dark urine with reduced volume', 'Frothy urine', 'Bright yellow urine after vitamins'],
    answer: 1,
    explanation: 'Reduced volume and concentration of urine appear early as the kidneys try to conserve water.',
  },
  {
    question: 'Why is daily weight useful in monitoring rehydration?',
    options: ['It diagnoses infection', 'A 1 kg change roughly reflects a 1 L change in fluid', 'It replaces fluid balance charts', 'It tells you the type of dehydration'],
    answer: 1,
    explanation: 'Daily weight is an objective and accessible way to monitor true fluid change, where a 1 kg shift is roughly 1 L of fluid.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DehydrationPage() {
  return (
    <div className="dh-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="dh-wrap">
        {/* Back nav */}
        <Link href="/hub" className="dh-back">
          <span className="dh-back-arrow">&larr;</span>
          Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="dh-kicker">Nursing &middot; Fluid &amp; Electrolyte Balance</p>
        <h1 className="dh-headline">Dehydration &amp; Fluid Replacement</h1>
        <p className="dh-standfirst">
          What dehydration actually is, how to assess it in children and adults, which signs mean a patient is shocked, and how to plan safe fluid replacement.
        </p>
        <p className="dh-byline">The Nurse Lab &middot; Nursing Hub</p>
        <EditorialSaveButton
          hubItemId="dehydration"
          hubItemTitle="Dehydration & Fluid Replacement"
        />

        <div className="dh-pearl" style={{ marginBottom: '40px' }}>
          <p className="dh-pearl-label">Student note</p>
          <p>
            Perfusion means blood flow reaching tissues. Capillary refill time (CRT) is the time taken for colour to return after pressing the skin: prolonged means slow. Isotonic, hypotonic, and hypertonic describe the sodium level alongside the water loss, not just the amount of fluid lost. ORS stands for oral rehydration solution. AKI is acute kidney injury. Maintenance fluids are the ongoing daily fluid requirements, separate from any deficit you are replacing.
          </p>
        </div>

        {/* Golden rules */}
        <div className="dh-golden">
          {[
            {
              n: '01',
              title: 'Read the whole patient',
              text: 'Dehydration is a clinical diagnosis, not a single blood test. Always combine history, observations, urine output, and how the patient looks.',
            },
            {
              n: '02',
              title: 'Children compensate',
              text: 'Heart rate, urine output, and capillary refill change before blood pressure falls. Waiting for hypotension is waiting too long.',
            },
            {
              n: '03',
              title: 'Older adults hide it',
              text: 'Confusion, falls, "off legs", and reduced appetite can be the only signs. Always check fluid intake, observations, and bloods.',
            },
            {
              n: '04',
              title: 'Fluids are a drug',
              text: 'Wrong type, rate, or volume can cause harm. Document, reassess, recheck U&Es, and escalate if no improvement.',
            },
          ].map((cell) => (
            <div key={cell.n} className="dh-golden-cell">
              <span className="dh-golden-numeral">{cell.n}</span>
              <p className="dh-golden-title">{cell.title}</p>
              <p className="dh-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Numbered sections */}
        {SECTIONS.map((section) => (
          <div key={section.number} className="dh-step">
            {/* Sidebar */}
            <div className="dh-step-sidebar">
              <span className={`dh-step-letter dh-letter-${section.colour}`}>{section.number}</span>
              <span className={`dh-step-badge dh-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            {/* Content */}
            <div className="dh-step-content">
              <h2 className="dh-step-name">{section.name}</h2>
              <p className="dh-step-question">{section.question}</p>

              {/* 4-col grid */}
              <div className="dh-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="dh-content-col">
                    <p className="dh-col-header">{col.header}</p>
                    <ul className="dh-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Red flags */}
              {section.redFlags.length > 0 && (
                <>
                  <p className="dh-redflags-label">Red flags</p>
                  <div className="dh-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="dh-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Pearl */}
              {section.pearl && (
                <div className="dh-pearl">
                  <p className="dh-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Severity at a glance table */}
        <h2 className="dh-section-title">Severity at a Glance (Children)</h2>
        <table className="dh-table" style={{ marginBottom: '18px' }}>
          <thead>
            <tr>
              <th>Category</th>
              <th>What you see</th>
              <th>What you do</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['No clinical dehydration', 'Alert, normal observations, moist mucous membranes, normal urine output.', 'Encourage usual fluids, monitor at home with safety-net advice.'],
              ['Clinical dehydration', 'Unwell or behaviour change, reduced output, dry mucous membranes, tachycardia, sunken eyes.', 'Start ORS, reassess regularly, consider hospital review if not improving.'],
              ['Clinical shock', 'Decreased consciousness, pale or mottled, cold peripheries, prolonged CRT, weak pulses, hypotension (late).', 'A–E approach, oxygen as needed, IV access, fluid bolus, urgent senior review.'],
            ].map(([category, signs, action]) => (
              <tr key={category}>
                <td>{category}</td>
                <td>{signs}</td>
                <td>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Adults & children compared */}
        <div className="dh-two-grid">
          <div className="dh-two-cell">
            <p className="dh-two-cell-title">Children: easy to miss</p>
            <ul className="dh-info-list">
              <li>Compensate well, then crash suddenly</li>
              <li>Hypotension is a late sign</li>
              <li>Urine output and CRT change first</li>
              <li>Weight loss roughly tracks fluid loss</li>
              <li>Sunken fontanelle in infants</li>
            </ul>
          </div>
          <div className="dh-two-cell">
            <p className="dh-two-cell-title">Older adults: easy to miss</p>
            <ul className="dh-info-list">
              <li>Thirst sensation often reduced</li>
              <li>Confusion, falls, or &ldquo;off legs&rdquo; may be the first sign</li>
              <li>Skin turgor less reliable</li>
              <li>Often on diuretics or other contributing meds</li>
              <li>AKI may be first picked up on routine bloods</li>
            </ul>
          </div>
        </div>

        {/* Whole-body links table */}
        <h2 className="dh-section-title">Why Dehydration Affects the Whole Body</h2>
        <table className="dh-table" style={{ marginBottom: '18px' }}>
          <thead>
            <tr>
              <th>Link</th>
              <th>What connects them</th>
              <th>Bedside meaning</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Fluid + cardiovascular', 'Reduced circulating volume lowers stroke volume and triggers compensation.', 'Tachycardia, prolonged CRT, and cool peripheries are early warnings. Hypotension is late.'],
              ['Fluid + renal', 'Poor renal perfusion drops filtration and can cause pre-renal AKI.', 'Falling urine output and rising creatinine point to perfusion problems, not just kidney disease.'],
              ['Fluid + neurological', 'Sodium and water shifts affect brain cells.', 'Confusion, irritability, drowsiness, and (in severe cases) seizures can appear with dehydration.'],
              ['Fluid + GI', 'Vomiting and diarrhoea both cause and worsen dehydration.', 'Always think upstream: treat the cause as well as replacing fluid losses.'],
            ].map(([link, mechanism, meaning]) => (
              <tr key={link}>
                <td>{link}</td>
                <td>{mechanism}</td>
                <td>{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Quick recap */}
        <div className="dh-info-grid" style={{ marginTop: '32px' }}>
          <div className="dh-info-cell">
            <p className="dh-info-cell-title">Definition</p>
            <ul className="dh-info-list">
              <li>Loss of body water, usually with electrolytes</li>
            </ul>
          </div>
          <div className="dh-info-cell">
            <p className="dh-info-cell-title">Types</p>
            <ul className="dh-info-list">
              <li>Isotonic, hypotonic, hypertonic</li>
            </ul>
          </div>
          <div className="dh-info-cell">
            <p className="dh-info-cell-title">Assessment</p>
            <ul className="dh-info-list">
              <li>History, observations, urine output, weight, bloods</li>
            </ul>
          </div>
          <div className="dh-info-cell">
            <p className="dh-info-cell-title">Treatment</p>
            <ul className="dh-info-list">
              <li>Treat cause, replace deficit, plan maintenance, reassess</li>
            </ul>
          </div>
        </div>

        <h2 className="dh-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Dehydration & Fluid Replacement" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'NICE (2009, updated 2024)', title: 'Diarrhoea and vomiting caused by gastroenteritis in under 5s (CG84)', href: 'https://www.nice.org.uk/guidance/cg84' },
          { citation: 'NICE (2015, updated 2020)', title: 'Intravenous fluid therapy in children and young people (NG29)', href: 'https://www.nice.org.uk/guidance/ng29' },
          { citation: 'NICE (2013, updated 2017)', title: 'Intravenous fluid therapy in adults in hospital (CG174)', href: 'https://www.nice.org.uk/guidance/cg174' },
          { citation: 'Resuscitation Council UK', title: 'Paediatric and adult advanced life support guidelines', href: 'https://www.resus.org.uk/' },
        ]} />
      </div>
    </div>
  );
}
