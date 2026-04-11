'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.rn-guide *, .rn-guide *::before, .rn-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.rn-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.rn-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
}

/* Back nav */
.rn-back {
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
.rn-back:hover { color: #555; }
.rn-back-arrow { font-style: normal; }

/* Masthead */
.rn-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.rn-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.rn-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.rn-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
}

/* Golden rules grid */
.rn-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.rn-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.rn-golden-cell:last-child { border-right: none; }

.rn-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.rn-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.rn-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.rn-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 52px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 36px;
}

.rn-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.rn-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.rn-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.rn-step-content {
  padding-left: 32px;
}

.rn-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.rn-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.rn-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.rn-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.rn-content-col:last-child { border-right: none; }

.rn-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.rn-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.rn-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.rn-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Red flags */
.rn-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.rn-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.rn-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.rn-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.rn-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.rn-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.rn-section-title {
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

/* Table */
.rn-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 0;
  font-size: 13px;
}

.rn-table th {
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
.rn-table th:last-child { border-right: none; }

.rn-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.rn-table td:last-child { border-right: none; }
.rn-table tr:last-child td { border-bottom: none; }
.rn-table td:first-child { font-weight: 400; color: #2C2A27; }

/* 4-col info grid */
.rn-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.rn-info-cell {
  padding: 18px 16px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.rn-info-cell:last-child { border-right: none; }

.rn-info-cell-title {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #333;
  margin-bottom: 12px;
  font-weight: 400;
  padding-bottom: 8px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

.rn-info-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.rn-info-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0 2px 10px;
  font-weight: 300;
  position: relative;
}
.rn-info-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* 2-col grid */
.rn-two-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.rn-two-cell {
  padding: 18px 16px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.rn-two-cell:last-child { border-right: none; }

.rn-two-cell-title {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #333;
  margin-bottom: 12px;
  font-weight: 400;
  padding-bottom: 8px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

.rn-two-text {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Step colour system */
.rn-letter-1 { color: #185FA5; }
.rn-badge-1 { background: #E6F1FB; color: #0C447C; }
.rn-letter-2 { color: #0F6E56; }
.rn-badge-2 { background: #E1F5EE; color: #085041; }
.rn-letter-3 { color: #993C1D; }
.rn-badge-3 { background: #FAECE7; color: #712B13; }
.rn-letter-4 { color: #534AB7; }
.rn-badge-4 { background: #EEEDFE; color: #3C3489; }
.rn-letter-5 { color: #5F5E5A; }
.rn-badge-5 { background: #F1EFE8; color: #444441; }
.rn-letter-6 { color: #8B5E3C; }
.rn-badge-6 { background: #F5EDE5; color: #6B4529; }

/* Responsive */
@media (max-width: 860px) {
  .rn-wrap { padding: 28px 20px 60px; }
  .rn-headline { font-size: 36px; }
  .rn-golden { grid-template-columns: 1fr 1fr; }
  .rn-golden-cell { border-bottom: 0.5px solid rgba(0,0,0,0.12); }
  .rn-step { grid-template-columns: 1fr; }
  .rn-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); padding-bottom: 16px; margin-bottom: 16px; padding-right: 0; }
  .rn-step-content { padding-left: 0; }
  .rn-content-grid { grid-template-columns: 1fr 1fr; }
  .rn-content-col { border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .rn-info-grid { grid-template-columns: 1fr 1fr; }
  .rn-info-cell { border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .rn-two-grid { grid-template-columns: 1fr; }
  .rn-two-cell { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .rn-table { font-size: 11px; }
}

@media (max-width: 520px) {
  .rn-golden { grid-template-columns: 1fr; }
  .rn-content-grid { grid-template-columns: 1fr; }
  .rn-info-grid { grid-template-columns: 1fr; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Overview of the Renal System',
    question: 'What does the renal system actually do, and why does it matter in children?',
    cols: [
      {
        header: 'Filtration system',
        items: [
          'Removes waste from the blood by making urine',
          'Balances water, sodium, potassium, and acid-base status',
          'Helps control blood pressure',
          '"Renal" is never just about wee: it is about whole-body stability',
        ],
      },
      {
        header: 'Why children matter more',
        items: [
          'Children lose fluid quickly through fever, diarrhoea, vomiting, and fast breathing',
          'They have less physiological reserve',
          'Urine output becomes a warning sign early',
          'Renal problems affect BP, consciousness, breathing, and medication safety',
        ],
      },
      {
        header: 'Urinary tract order',
        items: [
          'Kidneys: filter blood, regulate water and electrolytes',
          'Ureters: carry urine down to the bladder',
          'Bladder: stores urine until voiding',
          'Urethra: final passage out',
        ],
      },
      {
        header: 'Extra kidney jobs',
        items: [
          'Acid-base balance via hydrogen ions and bicarbonate',
          'Blood pressure control via renin and RAAS',
          'Erythropoietin for red blood cell production',
          'Vitamin D activation',
        ],
      },
    ],
    redFlags: ['Oliguria or anuria', 'Visible haematuria', 'Severe dehydration or poor perfusion', 'Rapidly worsening creatinine'],
    pearl:
      'The kidneys are not just plumbing. They are perfusion-sensitive organs. If circulating volume falls, or the child\u2019s cardiac output drops, filtration can fall before the blood pressure looks dramatically abnormal.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Kidney Structure and the Nephron',
    question: 'How is the kidney organised, and what does the nephron do?',
    cols: [
      {
        header: 'Kidney layout',
        items: [
          'Cortex is the outer region, medulla is the inner region',
          'Medulla arranged into pyramids that drain into calyces',
          'Calyces join into the renal pelvis, which becomes the ureter',
          'The kidney is both a filter and a drainage system',
        ],
      },
      {
        header: 'Nephron basics',
        items: [
          'The nephron is the functional unit of the kidney',
          'Each starts with a glomerulus and Bowman\u2019s capsule',
          'Runs through tubules where fluid is reworked in detail',
          'Urine only appears at the end after the tubules modify the filtrate all the way through',
        ],
      },
      {
        header: 'Nephron route',
        items: [
          'Glomerulus: knot of capillaries under pressure',
          'Bowman\u2019s capsule: catches the filtrate',
          'Proximal tubule: reabsorbs most water, sodium, glucose',
          'Loop of Henle: builds the concentration gradient',
        ],
      },
      {
        header: 'Fine-tuning and drainage',
        items: [
          'Distal tubule: adjusts electrolytes and acid-base further',
          'Collecting duct: ADH acts here to control water',
          'Calyces and renal pelvis: final drainage inside the kidney',
          'Then ureter, bladder, urethra',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Children generally have a higher water turnover and less reserve than adults. In infants and younger children, illness can also bring rapid losses through vomiting, diarrhoea, fever, or tachypnoea. Their kidneys can conserve water, but they cannot always protect the child fast enough if the deficit is building quickly.',
  },
  {
    number: '3',
    colour: '3',
    name: 'How Urine Is Formed',
    question: 'What are the steps from blood to urine?',
    cols: [
      {
        header: 'Filtration',
        items: [
          'Pressure pushes water and small solutes out of the glomerular capillaries',
          'Filtrate enters Bowman\u2019s capsule',
          'Cells and most large proteins should stay in the blood',
        ],
      },
      {
        header: 'Reabsorption',
        items: [
          'The tubules take back what the body still needs',
          'Water, sodium, glucose, bicarbonate, and other useful substances are reclaimed',
          'Without reabsorption the body would lose huge amounts of water and nutrients',
        ],
      },
      {
        header: 'Secretion',
        items: [
          'The tubules actively move extra substances from blood into tubular fluid',
          'Helps get rid of acids, potassium, some drugs, and additional waste',
          'This helps regulate potassium and acid-base balance',
        ],
      },
      {
        header: 'Excretion',
        items: [
          'What is left becomes urine',
          'Leaves through collecting ducts, calyces, pelvis, ureter, bladder, and urethra',
          'This is what the body has decided not to keep',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Dark concentrated urine often means the body is trying to conserve water, but one nappy or one void does not tell the whole story. Always match urine appearance with intake, measured output, perfusion, weight, and how the child actually looks.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Fluid, Electrolytes, and Hormonal Control',
    question: 'What are the kidneys balancing all day, and which hormones help?',
    cols: [
      {
        header: 'Sodium and water',
        items: [
          'Sodium is the main extracellular electrolyte',
          'Water tends to follow sodium',
          'Too much or too little changes fluid distribution',
          'Can affect neurological status',
        ],
      },
      {
        header: 'Potassium',
        items: [
          'Mostly inside cells but kidneys keep blood level safe',
          'Abnormal potassium causes weakness and dangerous heart rhythms',
          'Always interpret potassium carefully',
        ],
      },
      {
        header: 'ADH',
        items: [
          'Tells the kidney to save more water',
          'Acts on the collecting duct',
          'When ADH is high, urine becomes more concentrated',
          'Output can fall',
        ],
      },
      {
        header: 'Aldosterone and RAAS',
        items: [
          'Promotes sodium reabsorption and potassium excretion',
          'Helps defend circulating volume',
          'Can worsen potassium loss',
          'Renin links kidneys to RAAS and volume control',
        ],
      },
    ],
    redFlags: ['Significant potassium disturbance', 'Altered consciousness with sodium imbalance', 'Seizures with electrolyte disturbance'],
    pearl:
      'Children can move from compensated dehydration to significant clinical compromise faster than adults. Sodium and water problems are therefore never just "lab issues" if the child is also dry, tachycardic, drowsy, or not passing urine.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Paediatric Renal Assessment',
    question: 'What should you check at the bedside, and how do you measure it properly?',
    cols: [
      {
        header: 'Start from the end of the bed',
        items: [
          'Look at alertness, colour, breathing pattern',
          'Check for puffiness or dry appearance',
          'Check mucous membranes, tears, skin turgor',
          'Sunken eyes or fontanelle',
        ],
      },
      {
        header: 'Urine output',
        items: [
          'Children: at least 1 ml/kg/hour roughly',
          'Neonates may pass more',
          'Use catheter totals or accurate nappy weights',
          'Trends over time matter more than one short interval',
        ],
      },
      {
        header: 'Fluid balance and weight',
        items: [
          'Fluid balance chart: intake versus output',
          'Daily weights: 1 kg change is roughly 1 litre of fluid',
          'Only useful if the chart is complete',
          'Missed drinks, vomits, or nappies make charts misleading',
        ],
      },
      {
        header: 'Blood pressure, oedema, and bloods',
        items: [
          'BP: kidneys both affect it and depend on it',
          'Oedema: check eyelids, sacrum, ankles, hands',
          'Blood tests: creatinine, urea, sodium, potassium, bicarbonate',
          'Urinalysis: first clue about direction of the problem',
        ],
      },
    ],
    redFlags: ['Oliguria or anuria', 'Oedema with rising blood pressure', 'Breathlessness with suspected fluid overload', 'Cola-coloured urine'],
    pearl:
      'A single result matters less than the direction of travel. A creatinine that is still inside the reference range can still be clinically important if it has risen quickly, especially alongside oliguria, dehydration, or new oedema.',
  },
  {
    number: '6',
    colour: '6',
    name: 'Common Renal Problems and Whole-Child Impact',
    question: 'Which conditions should you recognise, and why do renal problems affect everything?',
    cols: [
      {
        header: 'Dehydration and UTI',
        items: [
          'Dehydration: reduced volume lowers perfusion, urine output falls',
          'Dry mucous membranes, tachycardia, delayed CRT, weight loss',
          'UTI: infection irritates bladder or ascends to kidneys',
          'In younger children: fever, vomiting, poor feeding, irritability',
        ],
      },
      {
        header: 'AKI types',
        items: [
          'Pre-renal: kidneys not being perfused properly',
          'Intrinsic renal: kidney tissue itself is injured',
          'Post-renal: urine cannot drain due to obstruction',
          'Pre-renal recognised early may recover quickly',
        ],
      },
      {
        header: 'Fluid overload and electrolyte imbalance',
        items: [
          'Fluid overload: puffy eyes, oedema, rapid weight gain, rising BP',
          'Crackles, increased work of breathing',
          'Electrolyte imbalance: weakness, irritability, arrhythmia risk',
          'Altered consciousness, seizures, muscle cramps',
        ],
      },
      {
        header: 'System connections',
        items: [
          'Renal + cardiovascular: poor perfusion triggers RAAS, fluid retention',
          'Renal + neurological: brain sensitive to sodium shifts, uraemia',
          'Renal + respiratory: fluid overload and acidosis change breathing',
          'Renal + endocrine: ADH, aldosterone, renin, vitamin D, EPO',
        ],
      },
    ],
    redFlags: [
      'Rapidly worsening creatinine or blood results',
      'Altered consciousness, seizure, or increasing lethargy',
      'Severe dehydration or poor perfusion',
      'Breathlessness with suspected fluid overload',
    ],
    pearl:
      'Do not wait for the renal picture to become dramatic. A child with falling urine output, a dry appearance, rising heart rate, or new oedema is giving you a pattern. Escalate the pattern early rather than hoping the next set of numbers will explain it away.',
  },
];

const quizQuestions = [
  {
    question: 'Which structure actually performs the first step of blood filtration?',
    options: ['Collecting duct', 'Glomerulus', 'Renal pelvis', 'Ureter'],
    answer: 1,
    explanation: "Filtration starts at the glomerulus, where pressure pushes water and small solutes out of the blood into Bowman's capsule.",
  },
  {
    question: 'What is the most accurate simple summary of creatinine?',
    options: ['A direct measure of hydration only', 'A bedside sign of infection', 'A practical blood marker used to judge filtration', 'A hormone that controls urine output'],
    answer: 2,
    explanation: 'Creatinine is commonly used as a marker of how well the kidneys are filtering, but it is most useful when you compare trends rather than stare at one number in isolation.',
  },
  {
    question: 'Which hormone mainly helps the kidney keep water by acting on the collecting duct?',
    options: ['Insulin', 'ADH', 'Thyroxine', 'Erythropoietin'],
    answer: 1,
    explanation: 'ADH helps the collecting duct reabsorb more water, so urine can become more concentrated and output may fall.',
  },
  {
    question: 'Why can children dehydrate faster than adults?',
    options: ['They have fewer nephrons at birth and never compensate', 'They have lower blood volume and no hormonal control', 'They have higher water turnover and less physiological reserve', 'Their kidneys do not filter until adolescence'],
    answer: 2,
    explanation: 'Children generally have higher water turnover, can lose fluid quickly during illness, and often have less reserve, which is why dehydration can become clinically important faster.',
  },
  {
    question: 'Which bedside finding should make you think early about worsening renal perfusion?',
    options: ['A child who is playing and voiding normally', 'Falling urine output in a child who looks drier', 'One isolated dark urine sample with otherwise normal observations', 'A normal blood pressure with no other concerns'],
    answer: 1,
    explanation: 'A dry-looking child with falling urine output is telling you something important about perfusion and filtration until proved otherwise.',
  },
  {
    question: 'What is the main effect of aldosterone in the distal nephron?',
    options: ['Keeps sodium and water, while promoting potassium excretion', 'Directly filters protein through the glomerulus', 'Turns urea into creatinine', 'Causes the bladder to contract'],
    answer: 0,
    explanation: 'Aldosterone helps the body retain sodium, which helps retain water, and it encourages potassium excretion.',
  },
  {
    question: 'Which combination is most concerning for AKI or significant renal dysfunction?',
    options: ['Good urine output, normal weight, and stable blood pressure', 'Reduced urine output, oedema, and a rising creatinine trend', 'Frequency alone after lots of drinks', 'A single borderline urea with a well child'],
    answer: 1,
    explanation: 'Reduced output, fluid retention, and worsening blood tests fit a much more serious renal picture and need prompt review.',
  },
  {
    question: 'Which red flag needs immediate escalation?',
    options: ['Clear urine after a fluid bolus', 'Anuria with increasing drowsiness', 'A child asking to drink more on a hot day', 'A full bladder before bed'],
    answer: 1,
    explanation: 'Anuria plus altered consciousness is never something to watch casually. It suggests significant renal compromise or severe illness and needs urgent escalation.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RenalSystemPage() {
  return (
    <div className="rn-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="rn-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="rn-back">
          <span className="rn-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="rn-kicker">Children&apos;s Nursing &middot; Paediatric Assessment</p>
        <h1 className="rn-headline">Renal System &amp; Assessment</h1>
        <p className="rn-standfirst">
          How the kidneys make urine, control fluid and electrolytes, what to check at the bedside, and which signs mean a child needs help early.
        </p>
        <p className="rn-byline">Children&apos;s nursing &middot; Renal &amp; fluid balance &middot; The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="renal-system"
          hubItemTitle="Renal System & Assessment"
        />

        <div className="rn-pearl" style={{ marginBottom: '40px' }}>
          <p className="rn-pearl-label">Student note</p>
          <p>
            Creatinine is a practical blood marker used to judge filtration. Urea is another waste product that can rise when the kidneys are not clearing well or when the child is dry. Perfusion means blood flow reaching the kidneys. Filtration is the first step where water and small solutes leave the blood at the glomerulus. Oliguria means too little urine. Fluid balance means what has gone in, what has come out, and whether the child is retaining or losing fluid overall.
          </p>
        </div>

        {/* Golden rules */}
        <div className="rn-golden">
          {[
            {
              n: '01',
              title: 'Urinary tract order',
              text: 'Kidneys, ureters, bladder, urethra. Filter it, carry it, store it, release it.',
            },
            {
              n: '02',
              title: 'Nephron basics',
              text: 'Glomerulus, Bowman\u2019s capsule, proximal tubule, loop of Henle, distal tubule, collecting duct. That is the route from first filtrate to final fine-tuning.',
            },
            {
              n: '03',
              title: 'Urine output matters',
              text: 'Less urine often means less perfusion, less circulating volume, or less filtration. It is one of the simplest early warning signs you have.',
            },
            {
              n: '04',
              title: 'Golden rule',
              text: 'Falling urine output in a child who looks unwell is never "just a number". Always read it alongside hydration, weight, blood pressure, and the whole child.',
            },
          ].map((cell) => (
            <div key={cell.n} className="rn-golden-cell">
              <span className="rn-golden-numeral">{cell.n}</span>
              <p className="rn-golden-title">{cell.title}</p>
              <p className="rn-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Numbered sections */}
        {SECTIONS.map((section) => (
          <div key={section.number} className="rn-step">
            {/* Sidebar */}
            <div className="rn-step-sidebar">
              <span className={`rn-step-letter rn-letter-${section.colour}`}>{section.number}</span>
              <span className={`rn-step-badge rn-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            {/* Content */}
            <div className="rn-step-content">
              <h2 className="rn-step-name">{section.name}</h2>
              <p className="rn-step-question">{section.question}</p>

              {/* 4-col grid */}
              <div className="rn-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="rn-content-col">
                    <p className="rn-col-header">{col.header}</p>
                    <ul className="rn-col-list">
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
                  <p className="rn-redflags-label">Red flags</p>
                  <div className="rn-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="rn-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Pearl */}
              {section.pearl && (
                <div className="rn-pearl">
                  <p className="rn-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Kidney function tests table */}
        <h2 className="rn-section-title">Kidney Function Tests</h2>
        <table className="rn-table" style={{ marginBottom: '18px' }}>
          <thead>
            <tr>
              <th>Test</th>
              <th>Plain-English meaning</th>
              <th>Why trends matter</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Creatinine', 'A waste product used as a practical marker of filtration.', "A rising creatinine usually means filtration is worsening. A 'normal' value can still be worrying if it has risen from that child's baseline."],
              ['Urea', 'A waste product from protein breakdown.', 'It can rise with dehydration as well as renal impairment, so interpret it with the overall clinical picture.'],
              ['Sodium', "A clue to water balance rather than just 'salt level'.", 'Look at symptoms and trends. Sodium problems can affect behaviour, consciousness, and seizure risk.'],
              ['Potassium', 'One of the most urgent electrolytes to notice when abnormal.', 'If potassium is significantly high or low, escalate because the heart may be at risk.'],
              ['Bicarbonate', 'A clue to acid-base balance.', 'A low bicarbonate can fit with dehydration, poor perfusion, sepsis, or renal dysfunction.'],
              ['Urinalysis', 'A bedside test that can show blood, protein, nitrites, leucocytes, glucose, or ketones.', 'It does not replace blood tests, but it often gives the first clue about what direction the problem is taking.'],
            ].map(([test, meaning, trend]) => (
              <tr key={test}>
                <td>{test}</td>
                <td>{meaning}</td>
                <td>{trend}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Fluid pictures side by side */}
        <div className="rn-two-grid">
          <div className="rn-two-cell">
            <p className="rn-two-cell-title">Low-volume picture</p>
            <ul className="rn-info-list">
              <li>Dry mucous membranes</li>
              <li>Reduced tears</li>
              <li>Tachycardia and delayed capillary refill</li>
              <li>Sunken eyes or fontanelle</li>
              <li>Reduced urine output and weight loss</li>
            </ul>
          </div>
          <div className="rn-two-cell">
            <p className="rn-two-cell-title">Fluid-overload picture</p>
            <ul className="rn-info-list">
              <li>Puffy eyelids or dependent oedema</li>
              <li>Rapid weight gain</li>
              <li>Rising blood pressure</li>
              <li>Breathlessness or crackles</li>
              <li>Reduced urine output despite increasing fluid in the body</li>
            </ul>
          </div>
        </div>

        {/* Whole-child links table */}
        <h2 className="rn-section-title">Why Renal Problems Affect the Whole Child</h2>
        <table className="rn-table" style={{ marginBottom: '18px' }}>
          <thead>
            <tr>
              <th>Link</th>
              <th>What connects them</th>
              <th>Bedside meaning</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Renal + cardiovascular', 'The kidneys need blood flow and pressure to filter. If cardiac output or circulating volume drops, urine output often falls before blood pressure becomes dramatically abnormal.', 'Poor perfusion can trigger RAAS activation, fluid retention, and worsening blood pressure problems.'],
              ['Renal + endocrine', 'The kidneys respond to ADH and aldosterone, release renin, activate vitamin D, and help with erythropoietin production.', 'Renal problems can therefore affect water handling, blood pressure control, bone health, and longer-term haemoglobin.'],
              ['Renal + neurological', 'The brain is very sensitive to sodium, water shifts, uraemia, and severe hypertension.', 'Confusion, irritability, headache, seizures, or reduced consciousness can all be renal red flags.'],
              ['Renal + respiratory', 'Fluid overload and metabolic acidosis both change breathing.', 'A child with renal dysfunction may become tachypnoeic because they are acidotic, or breathless because they are overloaded.'],
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
        <div className="rn-info-grid" style={{ marginTop: '32px' }}>
          <div className="rn-info-cell">
            <p className="rn-info-cell-title">Urinary tract</p>
            <ul className="rn-info-list">
              <li>Kidneys, ureters, bladder, urethra</li>
            </ul>
          </div>
          <div className="rn-info-cell">
            <p className="rn-info-cell-title">Urine formation</p>
            <ul className="rn-info-list">
              <li>Filter, reabsorb, secrete, excrete</li>
            </ul>
          </div>
          <div className="rn-info-cell">
            <p className="rn-info-cell-title">Hormonal control</p>
            <ul className="rn-info-list">
              <li>ADH saves water; aldosterone saves sodium</li>
            </ul>
          </div>
          <div className="rn-info-cell">
            <p className="rn-info-cell-title">Assessment rule</p>
            <ul className="rn-info-list">
              <li>Trends beat isolated blood results</li>
            </ul>
          </div>
        </div>

        <h2 className="rn-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Renal System & Assessment" questions={quizQuestions} />
      </div>
    </div>
  );
}
