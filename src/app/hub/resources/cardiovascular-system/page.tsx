'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.cv-guide *, .cv-guide *::before, .cv-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.cv-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.cv-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
}

/* Back nav */
.cv-back {
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
.cv-back:hover { color: #555; }
.cv-back-arrow { font-style: normal; }

/* Masthead */
.cv-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.cv-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.cv-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.cv-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
}

/* Golden rules grid */
.cv-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.cv-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.cv-golden-cell:last-child { border-right: none; }

.cv-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.cv-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.cv-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.cv-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 52px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 36px;
}

.cv-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.cv-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.cv-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.cv-step-content {
  padding-left: 32px;
}

.cv-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.cv-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.cv-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.cv-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.cv-content-col:last-child { border-right: none; }

.cv-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.cv-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.cv-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.cv-col-list li::before {
  content: '\u2013';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Red flags */
.cv-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.cv-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.cv-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.cv-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.cv-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.cv-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.cv-section-title {
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
.cv-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 0;
  font-size: 13px;
}

.cv-table th {
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
.cv-table th:last-child { border-right: none; }

.cv-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.cv-table td:last-child { border-right: none; }
.cv-table tr:last-child td { border-bottom: none; }
.cv-table td:first-child { font-weight: 400; color: #2C2A27; }

/* 2-col grid */
.cv-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.cv-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.cv-grid-2-cell:nth-child(2n) { border-right: none; }

.cv-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

/* Step colour system */
.cv-letter-1 { color: #185FA5; }
.cv-badge-1 { background: #E6F1FB; color: #0C447C; }
.cv-letter-2 { color: #0F6E56; }
.cv-badge-2 { background: #E1F5EE; color: #085041; }
.cv-letter-3 { color: #993C1D; }
.cv-badge-3 { background: #FAECE7; color: #712B13; }
.cv-letter-4 { color: #534AB7; }
.cv-badge-4 { background: #EEEDFE; color: #3C3489; }
.cv-letter-5 { color: #5F5E5A; }
.cv-badge-5 { background: #F1EFE8; color: #444441; }
.cv-letter-6 { color: #8B5E3C; }
.cv-badge-6 { background: #F5EDE5; color: #6B4729; }

/* Flow path mono */
.cv-mono {
  font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 12px;
  color: #5A5750;
  background: #F5F3F0;
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 16px;
  text-align: center;
  margin-bottom: 18px;
  line-height: 1.7;
}

/* Responsive */
@media (max-width: 860px) {
  .cv-wrap { padding: 28px 20px 60px; }
  .cv-headline { font-size: 34px; }
  .cv-golden { grid-template-columns: repeat(2, 1fr); }
  .cv-golden-cell:nth-child(2) { border-right: none; }
  .cv-golden-cell:nth-child(1), .cv-golden-cell:nth-child(2) { border-bottom: 0.5px solid rgba(0,0,0,0.12); }
  .cv-step { grid-template-columns: 64px 1fr; }
  .cv-step-letter { font-size: 48px; }
  .cv-content-grid { grid-template-columns: repeat(2, 1fr); }
  .cv-content-col:nth-child(2) { border-right: none; }
  .cv-content-col:nth-child(1), .cv-content-col:nth-child(2) { border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .cv-grid-2 { grid-template-columns: 1fr; }
  .cv-grid-2-cell { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .cv-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .cv-golden { grid-template-columns: 1fr; }
  .cv-golden-cell { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.12); }
  .cv-golden-cell:last-child { border-bottom: none; }
  .cv-content-grid { grid-template-columns: 1fr; }
  .cv-content-col { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .cv-content-col:last-child { border-bottom: none; }
  .cv-step { grid-template-columns: 52px 1fr; }
  .cv-step-letter { font-size: 38px; }
  .cv-step-content { padding-left: 18px; }
}
`;


// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Heart Anatomy',
    question: 'What are the chambers, valves, and walls that make up the heart?',
    cols: [
      {
        header: 'Chambers',
        items: [
          'Right atrium: receives deoxygenated blood via SVC/IVC',
          'Right ventricle: pumps blood to lungs',
          'Left atrium: receives oxygenated blood from lungs',
          'Left ventricle: main pressure pump to body',
        ],
      },
      {
        header: 'Valves',
        items: [
          'Tricuspid: RA to RV',
          'Mitral: LA to LV',
          'Pulmonary: RV exit to pulmonary artery',
          'Aortic: LV exit to aorta',
        ],
      },
      {
        header: 'Wall layers',
        items: [
          'Pericardium: protective sac',
          'Myocardium: contracting muscle layer',
          'Endocardium: smooth inner lining',
          'Septum separates right and left sides',
        ],
      },
      {
        header: 'Support structures',
        items: [
          'Papillary muscles inside ventricles',
          'Chordae tendineae attach to AV valves',
          'Pectinate muscles: ridges in atria',
          'Trabeculae carneae: ridges in ventricles',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'The heart is built the same basic way in children and adults, but children have less reserve. That means heart problems often show up first as fast heart rate, poor feeding, colour change, or slow capillary refill rather than as a dramatic low blood pressure straight away.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Blood Flow & Vessels',
    question: 'Where does blood travel and how do the circuits connect?',
    cols: [
      {
        header: 'Pulmonary circuit',
        items: [
          'Right ventricle to lungs to left atrium',
          'Lower-pressure circuit',
          'CO\u2082 released, O\u2082 picked up',
          'Pulmonary arteries carry deoxygenated blood',
        ],
      },
      {
        header: 'Systemic circuit',
        items: [
          'Left ventricle to body to right atrium',
          'Higher-pressure circuit',
          'O\u2082 and nutrients delivered to tissues',
          'CO\u2082 and waste carried back',
        ],
      },
      {
        header: 'Vessel types',
        items: [
          'Arteries: thick, muscular, away from heart',
          'Veins: thinner, valves, towards heart',
          'Capillaries: one cell thick, exchange happens here',
          'Pulmonary vessels are the classic exceptions',
        ],
      },
      {
        header: 'Exchange at capillaries',
        items: [
          'O\u2082 and nutrients move out to tissues',
          'CO\u2082 and wastes move into blood',
          'Walls are single-layer endothelium',
          'Thin wall is why exchange can happen',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Artery means away from the heart, not automatically oxygenated. Vein means towards the heart, not automatically deoxygenated. That is why the pulmonary artery and pulmonary veins are the classic exceptions.',
  },
  {
    number: '3',
    colour: '3',
    name: 'Fetal Circulation & Transition',
    question: 'How does blood flow before birth and what changes when the baby is born?',
    cols: [
      {
        header: 'Before birth',
        items: [
          'Placenta does gas exchange, not lungs',
          'Fetal blood is mixed, not fully oxygenated',
          'Circulation designed to bypass the lungs',
          'Umbilical vein brings O\u2082-rich blood in',
        ],
      },
      {
        header: 'Fetal shunts',
        items: [
          'Ductus venosus: bypasses the liver',
          'Foramen ovale: RA to LA, bypasses lungs',
          'Ductus arteriosus: PA to aorta, bypasses lungs',
          'Umbilical arteries return blood to placenta',
        ],
      },
      {
        header: 'After birth',
        items: [
          'First breaths expand lungs, blood flow rises',
          'Left atrial pressure rises, foramen ovale closes',
          'Falling prostaglandins close ductus arteriosus',
          'Ductus venosus closes as placental flow stops',
        ],
      },
      {
        header: 'Clinical relevance',
        items: [
          'PDA: ductus arteriosus stays open',
          'Persistent cyanosis needs urgent assessment',
          'Brief blue tinge in hands/feet can be normal',
          'Central cyanosis after birth is not normal',
        ],
      },
    ],
    redFlags: ['Persistent central cyanosis', 'Abnormal pre/post-ductal sats difference'],
    pearl: null,
  },
  {
    number: '4',
    colour: '4',
    name: 'Cardiac Cycle & Output',
    question: 'How does the heart fill, squeeze, and maintain flow to the body?',
    cols: [
      {
        header: 'Cardiac cycle phases',
        items: [
          'Diastole: ventricles relax and fill',
          'Heart gets most of its own blood supply here',
          'Atrial systole: final top-up of ventricles',
          'Ventricular systole: blood pumped out',
        ],
      },
      {
        header: 'Cardiac output',
        items: [
          'CO = HR x SV',
          'Preload: how full the ventricle is',
          'Afterload: resistance to push against',
          'Contractility: how strong the squeeze is',
        ],
      },
      {
        header: 'Why HR matters in children',
        items: [
          'Children cannot boost SV as much as adults',
          'Compensate by increasing heart rate first',
          'Tachycardia is an early compensating sign',
          'Bradycardia in a sick child is very worrying',
        ],
      },
      {
        header: 'Why diastole matters',
        items: [
          'Not just a resting phase',
          'Ventricles fill during diastole',
          'Very fast HR shortens filling time',
          'Can reduce SV and worsen a sick child',
        ],
      },
    ],
    redFlags: ['Persistent tachycardia', 'Bradycardia in a sick child', 'Hypotension (late sign)'],
    pearl:
      'Children can look as if they are compensating, then suddenly get much worse. Do not wait for low blood pressure before escalating. Tachycardia and prolonged capillary refill may appear long before hypotension.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Conduction System & ECG',
    question: 'How does the electrical signal travel and what does each part of the ECG show?',
    cols: [
      {
        header: 'Electrical pathway',
        items: [
          'SA node: natural pacemaker in RA',
          'AV node: brief delay for filling',
          'Bundle of His to bundle branches',
          'Purkinje fibres spread through ventricles',
        ],
      },
      {
        header: 'ECG waves',
        items: [
          'P wave: atrial depolarisation',
          'PR interval: signal travelling to ventricles',
          'QRS complex: ventricular contraction',
          'T wave: ventricular repolarisation',
        ],
      },
      {
        header: 'Cell properties',
        items: [
          'Cardiomyocytes: working muscle cells',
          'Contract over and over automatically',
          'Intercalated discs link cells together',
          'Signals pass quickly for coordinated squeeze',
        ],
      },
      {
        header: 'Clinical link',
        items: [
          'Normal sinus rhythm: SA node leads',
          'ECG trace does not always mean effective output',
          'PEA: trace but no pulse',
          'ST segment matters in advanced interpretation',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
  {
    number: '6',
    colour: '6',
    name: 'Paediatric Assessment & CHD',
    question: 'What should you check at the bedside and what are the key congenital patterns?',
    cols: [
      {
        header: 'Look first',
        items: [
          'Colour, interaction, alertness',
          'Breathing effort, warm and well perfused?',
          'Use trends, not isolated numbers',
          'Think compensation before deterioration',
        ],
      },
      {
        header: 'Key observations',
        items: [
          'HR against age norms',
          'Pulse quality: central and peripheral',
          'CRT: usually under 2\u20133 seconds',
          'BP useful but hypotension is late',
        ],
      },
      {
        header: 'Perfusion signs',
        items: [
          'Colour and temperature of peripheries',
          'Urine output ~1 ml/kg/hr guide',
          'General appearance and feeding',
          'Pale, mottled, cold = poor perfusion',
        ],
      },
      {
        header: 'Congenital patterns',
        items: [
          'Acyanotic: L-to-R shunt, may not look blue',
          'Cyanotic: deoxygenated blood to body, blue',
          'ASD, VSD, PDA = common acyanotic',
          'TOF, TGA = common cyanotic',
        ],
      },
    ],
    redFlags: [
      'Capillary refill over 3 seconds',
      'Pale, mottled, or cyanotic appearance',
      'Cold extremities',
      'Weak peripheral pulses',
      'Reduced urine output',
      'Altered consciousness',
      'Persistent tachycardia',
      'Bradycardia in a sick child',
      'Worsening work of breathing',
      'Feeding intolerance in suspected cardiac disease',
    ],
    pearl:
      'Warm, pink skin, quick capillary refill, good urine output, and strong pulses all suggest perfusion is okay. Cold, pale, mottled, sleepy, or poorly responsive children should make you think poor perfusion early, even if the blood pressure has not dropped yet.',
  },
];

const anatomyRows = [
  { structure: 'Right atrium', what: 'The chamber that receives oxygen-poor blood coming back from the body through the superior and inferior vena cava.', why: 'Think of it as the heart\'s receiving room on the right side before blood moves down into the right ventricle.' },
  { structure: 'Right ventricle', what: 'Pumps oxygen-poor blood through the pulmonary valve into the pulmonary arteries.', why: 'Its job is to send blood to the lungs. It does not need as much muscle as the left ventricle because the lungs are a lower-pressure circuit.' },
  { structure: 'Left atrium', what: 'Receives oxygen-rich blood coming back from the lungs through the pulmonary veins.', why: 'It passes that freshly oxygenated blood into the left ventricle ready to be pumped to the body.' },
  { structure: 'Left ventricle', what: 'Pumps oxygen-rich blood through the aortic valve into the aorta and out to the body.', why: 'This is the main pressure pump of the heart, so it has the thickest wall and does the hardest physical work.' },
  { structure: 'Atrioventricular valves', what: 'The tricuspid valve sits between the right atrium and right ventricle. The mitral valve sits between the left atrium and left ventricle.', why: 'They act like one-way doors, keeping blood moving forward instead of letting it fall back into the atria when the ventricles squeeze.' },
  { structure: 'Semilunar valves', what: 'The pulmonary valve sits at the exit to the pulmonary artery. The aortic valve sits at the exit to the aorta.', why: 'They stop blood running backwards into the ventricles once it has been pumped out.' },
  { structure: 'Septum', what: 'The interatrial and interventricular septa are the walls separating the right and left sides of the heart.', why: 'They keep oxygen-poor and oxygen-rich blood apart in normal circulation.' },
  { structure: 'Major vessels', what: 'The SVC and IVC bring blood back from the body. The pulmonary arteries take blood to the lungs. The pulmonary veins bring it back. The aorta sends it out to the body again.', why: 'These are the big routes connecting the heart to the lungs and the rest of the body.' },
];

const circulationRows = [
  { circuit: 'Pulmonary circulation', path: 'Right ventricle -> lungs -> left atrium', job: 'Moves blood to the lungs so carbon dioxide can be released and oxygen can be picked up.', note: 'Lower-pressure circuit.' },
  { circuit: 'Systemic circulation', path: 'Left ventricle -> body -> right atrium', job: 'Delivers oxygen and nutrients to tissues, then brings carbon dioxide and waste products back.', note: 'Higher-pressure circuit.' },
];

const vesselRows = [
  { vessel: 'Arteries', features: 'Carry blood away from the heart. Thick, muscular, elastic walls.', significance: 'They are built for higher pressure. The pulmonary artery is the main exception that carries oxygen-poor blood.' },
  { vessel: 'Veins', features: 'Carry blood towards the heart. Thinner walls, lower pressure, and often valves.', significance: 'They act as the lower-pressure return system. The pulmonary veins are the main exception that carry oxygen-rich blood.' },
  { vessel: 'Capillaries', features: 'Microscopic vessels linking the arterial and venous sides. Walls are only one cell thick and lined by endothelium.', significance: 'Their very thin wall is why exchange can happen here: oxygen and nutrients move out to tissues, while carbon dioxide and wastes move back into the blood.' },
];

const fetalRows = [
  { structure: 'Umbilical vein', beforeBirth: 'Brings the most oxygen-rich blood available from the placenta to the fetus.', afterBirth: 'Closes after the cord is clamped because the placenta is no longer part of the circulation.' },
  { structure: 'Umbilical arteries', beforeBirth: 'Carry blood from the fetus back to the placenta.', afterBirth: 'Close once placental circulation ends.' },
  { structure: 'Ductus venosus', beforeBirth: 'Lets much of the blood from the umbilical vein bypass the liver.', afterBirth: 'Closes after birth as normal liver circulation takes over.' },
  { structure: 'Foramen ovale', beforeBirth: 'An opening between the right and left atria that helps blood bypass the lungs before birth.', afterBirth: 'Usually closes functionally soon after birth when pressure rises on the left side.' },
  { structure: 'Ductus arteriosus', beforeBirth: 'Connects the pulmonary artery to the aorta so much of the blood from the right ventricle can bypass the lungs.', afterBirth: 'Normally closes over the first days to weeks. If it stays open, that is a patent ductus arteriosus (PDA).' },
];

const strokeVolumeRows = [
  { term: 'Preload', meaning: 'How full the ventricle is before it squeezes.', relevance: 'If less blood comes back to the heart, for example with dehydration or blood loss, there is less to pump out.' },
  { term: 'Afterload', meaning: 'How hard it is for the ventricle to push blood out.', relevance: 'If afterload rises, the ventricle has to work harder to eject blood.' },
  { term: 'Contractility', meaning: 'How strong the heart muscle squeeze is.', relevance: 'If contractility is poor, the heart squeeze is weaker and cardiac output can fall.' },
];

const ecgRows = [
  { part: 'P wave', meaning: 'The electrical activity that makes the atria contract.', why: 'A simple way to remember it is: P wave = atria are being triggered to squeeze.' },
  { part: 'PR interval', meaning: 'The signal travelling from the atria, through the AV node, towards the ventricles.', why: 'It includes the normal AV-node delay that gives the ventricles time to fill.' },
  { part: 'QRS complex', meaning: 'The electrical activity that triggers ventricular contraction.', why: 'This is the big squeeze of the ventricles.' },
  { part: 'ST segment', meaning: 'The short section after the ventricles have been triggered and before they reset.', why: 'It matters clinically, especially in more advanced ECG interpretation, but at this level it is enough to recognise where it sits on the trace.' },
  { part: 'T wave', meaning: 'The ventricles resetting electrically.', why: 'After the T wave, the ventricles are ready for the next beat.' },
];

const assessmentRows = [
  { assessment: 'Heart rate', meaning: 'How fast the heart is beating.', points: 'Compare it with age-specific norms. A high heart rate can be pain, fever, anxiety, dehydration, sepsis, or early circulatory compromise. A slow heart rate in a sick child is more worrying and can be late.' },
  { assessment: 'Pulse quality and equality', meaning: 'How strong the pulses feel and whether both sides match.', points: 'Check central and peripheral pulses. Weak, thready, unequal, or absent pulses can point to poor cardiac output, shock, or an obstructive problem.' },
  { assessment: 'Capillary refill time', meaning: 'A bedside sign of peripheral perfusion.', points: 'Usually under 2 to 3 seconds. A prolonged refill time should always be interpreted alongside temperature, colour, pulse quality, and the overall child.' },
  { assessment: 'Colour and temperature', meaning: 'How well the circulation is supporting the skin and peripheries.', points: 'Pale, mottled, cyanotic, or cold peripheries suggest poor perfusion or hypoxaemia.' },
  { assessment: 'Blood pressure', meaning: 'Pressure generated by cardiac output against vascular resistance.', points: 'Useful, but hypotension is a late sign in children. A child can be shocked with a blood pressure that still looks okay.' },
  { assessment: 'Urine output', meaning: 'A practical marker of renal perfusion.', points: 'Around 1 ml/kg/hour is a useful guide. Reduced urine output can mean poor perfusion, dehydration, or both.' },
  { assessment: 'General appearance', meaning: 'What the child looks like before you even touch them.', points: 'Alertness, tone, interaction, cry, behaviour, and feeding matter. Always assess trends, not isolated numbers.' },
];

const pulsePointRows = [
  ['Apical', 'Best for counting heart rate accurately in infants and small children.'],
  ['Brachial', 'Useful in infants and for quick circulation checks.'],
  ['Radial', 'Common in older children if perfusion is reasonable.'],
  ['Femoral', 'Important when checking central perfusion and comparing upper with lower limb pulses.'],
  ['Posterior tibial / dorsalis pedis', 'Helpful when assessing peripheral perfusion in the feet.'],
];

const congenitalRows = [
  { type: 'Congenital heart disease', explanation: 'Present from birth because the problem developed while the baby was forming in the womb, often in the first 6 to 8 weeks of pregnancy.', examples: 'ASD, VSD, PDA, Tetralogy of Fallot, Transposition of the Great Arteries' },
  { type: 'Acquired cardiac disease', explanation: 'Develops after birth rather than during fetal development.', examples: 'Kawasaki disease, cardiomyopathy, acquired arrhythmias, endocarditis' },
];

const congenitalPatternRows = [
  { pattern: 'Acyanotic defects', meaning: 'Usually involve left-to-right shunting or obstruction, so the child may not look blue at first.', examples: 'ASD, VSD, PDA, coarctation of the aorta' },
  { pattern: 'Cyanotic defects', meaning: 'Allow oxygen-poor blood into the systemic circulation or greatly reduce blood flow to the lungs, so the child may look blue.', examples: 'Tetralogy of Fallot, Transposition of the Great Arteries, tricuspid atresia' },
];

const asdFlowRows = [
  { step: 'Defect', explanation: 'An ASD is a gap in the wall between the two atria, so blood can pass between them when it should not.' },
  { step: 'Pressure gradient', explanation: 'Pressure is usually higher in the left atrium, so blood usually moves from left to right across the defect.' },
  { step: 'Right-sided volume load', explanation: 'That extra blood ends up loading the right atrium and right ventricle, so the right side has more volume to handle than normal.' },
  { step: 'Pulmonary overcirculation', explanation: 'The extra volume then gets pumped to the lungs, so pulmonary blood flow rises and the lungs can become congested.' },
  { step: 'Why infants become symptomatic', explanation: 'Infants have less reserve than older children. If both breathing and feeding become harder work, they tire quickly and may not grow well.' },
];

const asdSymptoms = [
  { sign: 'Poor feeding', why: 'The infant has to suck, swallow, and breathe at the same time while already working harder to breathe and circulate blood.' },
  { sign: 'Sweating during feeds', why: 'Feeding is hard physical work for an infant, so the extra effort can make them sweaty.' },
  { sign: 'Tachypnoea', why: 'If the lungs are getting too much blood, breathing becomes less efficient and the infant compensates by breathing faster.' },
  { sign: 'Recurrent respiratory symptoms', why: 'Extra blood flow to the lungs can make them wetter and more prone to congestion-like symptoms or repeated chest problems.' },
  { sign: 'Poor weight gain or faltering growth', why: 'Intake drops while energy expenditure rises, so growth can suffer.' },
  { sign: 'Fatigue', why: 'The heart and lungs are both working harder, so the infant tires more quickly than expected.' },
  { sign: 'Murmur', why: 'Often caused by the extra blood flow moving turbulently across the right side of the heart and pulmonary valve, rather than by the hole itself.' },
];

const feedingCards = [
  { title: 'Feeding is work', text: 'For infants, a feed is active work. They have to coordinate sucking, swallowing, and breathing while still maintaining oxygenation and circulation.' },
  { title: 'Pulmonary overcirculation matters', text: 'If extra blood is going to the lungs, breathing is harder work and feeds are more likely to be stop-start.' },
  { title: 'Cardiac workload rises', text: 'The heart is already handling extra volume, so a long feed can be enough to make the infant visibly tired.' },
  { title: 'Growth can falter', text: 'Smaller feeds, longer feeds, sweating, and higher energy use all make steady weight gain harder.' },
];

const investigationRows = [
  { test: 'ECG', shows: 'Heart rhythm, rate, conduction patterns, and signs of chamber strain.', use: 'A useful first test when you are thinking about rhythm problems or structural heart disease.' },
  { test: 'Echocardiogram with Doppler', shows: 'Heart anatomy, valve function, chamber size, and the direction of blood flow.', use: 'The main test for confirming ASD and looking at how blood is moving through the heart.' },
  { test: 'Chest X-ray', shows: 'Heart size and the appearance of the lungs.', use: 'May show an enlarged heart or signs that there is too much blood flow going to the lungs.' },
  { test: 'Pre- and post-ductal oxygen saturations', shows: 'Comparison of right-hand and foot saturations.', use: 'Useful when you are thinking about transitional-circulation problems or duct-dependent heart disease.' },
  { test: 'Cardiac catheterisation', shows: 'Direct pressure measurements and detailed anatomical information.', use: 'Used when the team needs more detailed information or is planning an intervention.' },
];

const bedsidePatternRows = [
  { pattern: 'Low cardiac output picture', clues: 'Pale or mottled skin, cool peripheries, prolonged capillary refill, weak pulses, reduced urine output', meaning: 'Forward flow to tissues is not meeting the child\u2019s needs well enough.' },
  { pattern: 'Pulmonary overcirculation / heart failure picture', clues: 'Tachypnoea, increased work of breathing, sweating with feeds, poor weight gain, tiring easily', meaning: 'Too much blood is going to the lungs or the heart is struggling to cope with the workload.' },
  { pattern: 'Cyanotic picture', clues: 'Central cyanosis, persistently low saturations, poor colour despite oxygen, abnormal pre- and post-ductal difference', meaning: 'Oxygen-poor blood may be reaching the systemic circulation or pulmonary blood flow may be severely limited.' },
];

const quizQuestions = [
  {
    question: 'Which vessel brings oxygenated blood back from the lungs to the heart?',
    options: ['Pulmonary artery', 'Aorta', 'Pulmonary vein', 'Superior vena cava'],
    answer: 2,
    explanation: 'Pulmonary veins return oxygenated blood from the lungs to the left atrium.',
  },
  {
    question: 'What is the correct equation for cardiac output?',
    options: ['CO = BP x SV', 'CO = HR x SV', 'CO = HR x BP', 'CO = preload x afterload'],
    answer: 1,
    explanation: 'Cardiac output is the amount of blood pumped per minute, so it equals heart rate multiplied by stroke volume.',
  },
  {
    question: 'Why is tachycardia often an early warning sign in children with circulatory compromise?',
    options: [
      'Children mainly increase blood pressure first',
      'Children cannot change vascular tone',
      'Children rely more on heart rate than stroke volume to maintain cardiac output',
      'Tachycardia always means the child is in pain only',
    ],
    answer: 2,
    explanation: 'Children have less ability to boost stroke volume, so they often compensate by increasing heart rate first.',
  },
  {
    question: 'Which fetal shunt allows blood to pass directly from the right atrium to the left atrium before birth?',
    options: ['Ductus arteriosus', 'Foramen ovale', 'Ductus venosus', 'Umbilical artery'],
    answer: 1,
    explanation: 'The foramen ovale is the atrial-level fetal shunt.',
  },
  {
    question: 'What does the P wave represent on an ECG?',
    options: ['Ventricular contraction', 'Atrial depolarisation', 'Ventricular repolarisation', 'The AV valve closing'],
    answer: 1,
    explanation: 'The P wave is the electrical event that represents atrial depolarisation.',
  },
  {
    question: 'In children, hypotension usually means:',
    options: ['Early compensated shock', 'Late circulatory compromise', 'Normal adaptation to illness', 'Only dehydration'],
    answer: 1,
    explanation: 'Children often maintain blood pressure until late, so hypotension is a worrying sign rather than a mild one.',
  },
  {
    question: 'In a typical ASD, blood most often shunts:',
    options: ['Right to left because right atrial pressure is higher', 'Left to right because left atrial pressure is usually higher', 'Only during diastole', 'From the ventricle into the atrium'],
    answer: 1,
    explanation: 'The usual pressure difference is left atrium higher than right atrium, so flow is typically left to right.',
  },
  {
    question: 'Why might an infant with a significant ASD sweat and tire during feeds?',
    options: [
      'Because feeding is unrelated to circulation',
      'Because pulmonary overcirculation and increased cardiac workload make feeds harder work',
      'Because ASD always causes low blood glucose',
      'Because the murmur blocks the airway',
    ],
    answer: 1,
    explanation: 'Feeding is hard work for infants. If breathing is harder and the heart is handling extra volume, they may pause, sweat, tire, and take smaller volumes.',
  },
];


// ─── Component ────────────────────────────────────────────────────────────────

export default function CardiovascularSystemPage() {
  return (
    <div className="cv-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="cv-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="cv-back">
          <span className="cv-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="cv-kicker">Children&apos;s Nursing &middot; Cardiovascular</p>
        <h1 className="cv-headline">Cardiovascular System &amp; Assessment</h1>
        <p className="cv-standfirst">
          How the heart works, where blood flows, what to check at the bedside, and which signs mean a child needs help early.
        </p>
        <p className="cv-byline">Children&apos;s nursing &middot; The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="cardiovascular-system"
          hubItemTitle="Cardiovascular System & Assessment"
        />

        {/* Student note pearl */}
        <div className="cv-pearl" style={{ marginBottom: '40px' }}>
          <p className="cv-pearl-label">Student note</p>
          <p>Perfusion means how well blood is reaching tissues. Preload means how much blood fills the ventricle before it squeezes. Afterload means the resistance it has to push against. Contractility means how strong the squeeze is. A shunt means blood is taking an abnormal route. A murmur is an extra sound caused by turbulent blood flow. Cyanosis means a blue tinge caused by too little oxygenated blood reaching the tissues.</p>
        </div>

        {/* Golden rules */}
        <div className="cv-golden">
          {[
            { n: '01', title: 'Flow order', text: 'Body \u2192 Right heart \u2192 Lungs \u2192 Left heart \u2192 Body. SVC/IVC \u2192 RA \u2192 RV \u2192 lungs \u2192 LA \u2192 LV \u2192 aorta.' },
            { n: '02', title: 'Core formula', text: 'Cardiac Output = Heart Rate \u00d7 Stroke Volume. Children compensate with heart rate before blood pressure drops.' },
            { n: '03', title: 'Golden rule', text: 'A normal blood pressure does not rule out shock in a child. Hypotension is late; cold, pale, slow refill is early.' },
            { n: '04', title: 'Vessel rule', text: 'Artery = away from heart, vein = towards heart. The pulmonary vessels are the classic exceptions.' },
          ].map((cell) => (
            <div key={cell.n} className="cv-golden-cell">
              <span className="cv-golden-numeral">{cell.n}</span>
              <p className="cv-golden-title">{cell.title}</p>
              <p className="cv-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Numbered sections */}
        {SECTIONS.map((section) => (
          <div key={section.number} className="cv-step">
            {/* Sidebar */}
            <div className="cv-step-sidebar">
              <span className={`cv-step-letter cv-letter-${section.colour}`}>{section.number}</span>
              <span className={`cv-step-badge cv-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            {/* Content */}
            <div className="cv-step-content">
              <h2 className="cv-step-name">{section.name}</h2>
              <p className="cv-step-question">{section.question}</p>

              {/* 4-col grid */}
              <div className="cv-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="cv-content-col">
                    <p className="cv-col-header">{col.header}</p>
                    <ul className="cv-col-list">
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
                  <p className="cv-redflags-label">Red flags</p>
                  <div className="cv-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="cv-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Pearl */}
              {section.pearl && (
                <div className="cv-pearl">
                  <p className="cv-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Blood flow path */}
        <h2 className="cv-section-title">Blood Flow Path</h2>
        <div className="cv-mono">
          SVC + IVC &rarr; Right Atrium &rarr; Tricuspid Valve &rarr; Right Ventricle &rarr; Pulmonary Valve &rarr; Pulmonary Arteries &rarr; Lungs &rarr; Pulmonary Veins &rarr; Left Atrium &rarr; Mitral Valve &rarr; Left Ventricle &rarr; Aortic Valve &rarr; Aorta &rarr; Body
        </div>

        {/* Anatomy detail table */}
        <h2 className="cv-section-title">Heart Structure Reference</h2>
        <table className="cv-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Structure</th>
              <th>What it is</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {anatomyRows.map((row) => (
              <tr key={row.structure}>
                <td>{row.structure}</td>
                <td>{row.what}</td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Circulation circuits */}
        <h2 className="cv-section-title">Pulmonary and Systemic Circuits</h2>
        <table className="cv-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Circuit</th>
              <th>Path</th>
              <th>Main job</th>
              <th>Clinical note</th>
            </tr>
          </thead>
          <tbody>
            {circulationRows.map((row) => (
              <tr key={row.circuit}>
                <td>{row.circuit}</td>
                <td>{row.path}</td>
                <td>{row.job}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cv-pearl" style={{ marginBottom: '32px' }}>
          <p className="cv-pearl-label">Clinical pearl</p>
          <p>In the lungs, blood flows past the alveoli, picks up oxygen, and drops off carbon dioxide. Out in the tissues, the opposite happens: oxygen and nutrients leave the capillaries and move into cells, while carbon dioxide and waste move back into the blood. This works because capillary walls are extremely thin and lined by a single layer of endothelial cells.</p>
        </div>

        {/* Vessel types */}
        <h2 className="cv-section-title">Blood Vessel Types</h2>
        <table className="cv-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Vessel type</th>
              <th>Key features</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {vesselRows.map((row) => (
              <tr key={row.vessel}>
                <td>{row.vessel}</td>
                <td>{row.features}</td>
                <td>{row.significance}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Fetal circulation */}
        <h2 className="cv-section-title">Fetal Circulation Reference</h2>
        <table className="cv-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Structure</th>
              <th>Job before birth</th>
              <th>What happens after birth</th>
            </tr>
          </thead>
          <tbody>
            {fetalRows.map((row) => (
              <tr key={row.structure}>
                <td>{row.structure}</td>
                <td>{row.beforeBirth}</td>
                <td>{row.afterBirth}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cv-pearl" style={{ marginBottom: '32px' }}>
          <p className="cv-pearl-label">Clinical pearl</p>
          <p>A brief blue tinge can happen during immediate transition, especially in the hands and feet, but persistent central cyanosis after birth is not something to brush off. It may mean the normal switch from fetal to newborn circulation is not happening properly, or that there is a serious cardiac or respiratory problem underneath.</p>
        </div>

        {/* Stroke volume determinants */}
        <h2 className="cv-section-title">Stroke Volume Determinants</h2>
        <table className="cv-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Determinant</th>
              <th>Meaning</th>
              <th>Clinical relevance</th>
            </tr>
          </thead>
          <tbody>
            {strokeVolumeRows.map((row) => (
              <tr key={row.term}>
                <td>{row.term}</td>
                <td>{row.meaning}</td>
                <td>{row.relevance}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cv-pearl" style={{ marginBottom: '32px' }}>
          <p className="cv-pearl-label">Clinical pearl</p>
          <p>Diastole is not just the resting phase. It is the time when the ventricles fill and when much of the heart muscle itself receives its own blood supply. If the heart rate becomes very fast, filling time gets shorter, which can reduce stroke volume and make a sick child look worse quite quickly.</p>
        </div>

        {/* ECG reference */}
        <h2 className="cv-section-title">ECG Reference</h2>
        <table className="cv-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>ECG part</th>
              <th>What it represents</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {ecgRows.map((row) => (
              <tr key={row.part}>
                <td>{row.part}</td>
                <td>{row.meaning}</td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cv-pearl" style={{ marginBottom: '32px' }}>
          <p className="cv-pearl-label">Clinical pearl</p>
          <p>A normal sinus rhythm means the electrical signal starts in the SA node and follows the usual route. Most of the time electrical activity and a pulse go together, but not always. Pulseless electrical activity is the reminder that an ECG trace does not automatically mean the child has an effective circulation.</p>
        </div>

        {/* Circulatory assessment */}
        <h2 className="cv-section-title">Paediatric Circulatory Assessment</h2>
        <table className="cv-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Assessment</th>
              <th>What it tells you</th>
              <th>Key points</th>
            </tr>
          </thead>
          <tbody>
            {assessmentRows.map((row) => (
              <tr key={row.assessment}>
                <td>{row.assessment}</td>
                <td>{row.meaning}</td>
                <td>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pulse points */}
        <h2 className="cv-section-title">Pulse Points</h2>
        <div className="cv-grid-2">
          {pulsePointRows.map(([site, note]) => (
            <div key={site} className="cv-grid-2-cell">
              <p className="cv-grid-2-header">{site} pulse</p>
              <ul className="cv-col-list">
                <li>{note}</li>
              </ul>
            </div>
          ))}
        </div>

        {/* Bedside patterns */}
        <h2 className="cv-section-title">Bedside Patterns</h2>
        <table className="cv-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Bedside pattern</th>
              <th>What you may notice</th>
              <th>What it may mean</th>
            </tr>
          </thead>
          <tbody>
            {bedsidePatternRows.map((row) => (
              <tr key={row.pattern}>
                <td>{row.pattern}</td>
                <td>{row.clues}</td>
                <td>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Congenital heart disease */}
        <h2 className="cv-section-title">Congenital Heart Disease</h2>
        <table className="cv-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Meaning</th>
              <th>Examples</th>
            </tr>
          </thead>
          <tbody>
            {congenitalRows.map((row) => (
              <tr key={row.type}>
                <td>{row.type}</td>
                <td>{row.explanation}</td>
                <td>{row.examples}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="cv-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Pattern</th>
              <th>What it means</th>
              <th>Examples</th>
            </tr>
          </thead>
          <tbody>
            {congenitalPatternRows.map((row) => (
              <tr key={row.pattern}>
                <td>{row.pattern}</td>
                <td>{row.meaning}</td>
                <td>{row.examples}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cv-pearl" style={{ marginBottom: '32px' }}>
          <p className="cv-pearl-label">Clinical pearl</p>
          <p>Many congenital heart defects develop very early in pregnancy, often before someone even realises they are pregnant. That is why defects such as ASD, VSD, PDA, TOF, and TGA are usually taught alongside fetal development and transition at birth.</p>
        </div>

        {/* ASD detail */}
        <h2 className="cv-section-title">ASD (Atrial Septal Defect)</h2>
        <div className="cv-pearl" style={{ marginBottom: '18px' }}>
          <p className="cv-pearl-label">Exam tip</p>
          <p>Do not stop at saying &ldquo;a hole in the heart.&rdquo; A stronger answer is: an ASD is a defect in the interatrial septum that usually causes a left-to-right shunt, so extra blood ends up on the right side of the heart and then goes to the lungs.</p>
        </div>

        <table className="cv-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Step</th>
              <th>What is happening</th>
            </tr>
          </thead>
          <tbody>
            {asdFlowRows.map((row) => (
              <tr key={row.step}>
                <td>{row.step}</td>
                <td>{row.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ASD symptoms */}
        <h2 className="cv-section-title">Signs and Symptoms of ASD in Infants</h2>
        <table className="cv-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Sign</th>
              <th>Why it can happen</th>
            </tr>
          </thead>
          <tbody>
            {asdSymptoms.map((row) => (
              <tr key={row.sign}>
                <td>{row.sign}</td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Feeding difficulties */}
        <h2 className="cv-section-title">Feeding Difficulties in Infants with ASD</h2>
        <div className="cv-pearl" style={{ marginBottom: '18px' }}>
          <p className="cv-pearl-label">Clinical pearl</p>
          <p>Feeding is almost like an exercise test for an infant. If they become breathless, sweaty, pause often, or only take tiny volumes, that can reflect the extra work their heart and lungs are doing, not just simple tiredness.</p>
        </div>

        <div className="cv-content-grid" style={{ marginBottom: '18px' }}>
          {feedingCards.map((card) => (
            <div key={card.title} className="cv-content-col">
              <p className="cv-col-header">{card.title}</p>
              <ul className="cv-col-list">
                <li>{card.text}</li>
              </ul>
            </div>
          ))}
        </div>

        <div className="cv-pearl" style={{ marginBottom: '18px' }}>
          <p className="cv-pearl-label">What to assess during feeds</p>
          <p>How much the infant takes. How long the feed takes. Whether they pause often or look breathless. Whether they sweat, tire, or fall asleep early. Weight trend over time. Hydration status and urine output.</p>
        </div>

        <div className="cv-pearl" style={{ marginBottom: '32px' }}>
          <p className="cv-pearl-label">Clinical pearl</p>
          <p>A murmur tells you blood is moving turbulently somewhere, but it does not tell you by itself how well the child is coping. Always match the sound with the clinical picture: feeding, colour, work of breathing, pulse quality, growth, and perfusion matter just as much.</p>
        </div>

        {/* Investigations */}
        <h2 className="cv-section-title">Investigations</h2>
        <table className="cv-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Investigation</th>
              <th>What it shows</th>
              <th>Why it is useful</th>
            </tr>
          </thead>
          <tbody>
            {investigationRows.map((row) => (
              <tr key={row.test}>
                <td>{row.test}</td>
                <td>{row.shows}</td>
                <td>{row.use}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cv-pearl" style={{ marginBottom: '32px' }}>
          <p className="cv-pearl-label">Clinical pearl</p>
          <p>If you are worried now: use A-E, escalate early, keep the child warm and calm, reassess often, and support feeding and hydration while senior help is on the way. If perfusion looks poor, do not wait for a low blood pressure before acting.</p>
        </div>

        {/* Mnemonic recap */}
        <h2 className="cv-section-title">Quick Mnemonic Recap</h2>
        <div className="cv-golden" style={{ marginBottom: '40px' }}>
          {[
            { n: '01', title: 'Flow rule', text: 'Body \u2192 Right heart \u2192 Lungs \u2192 Left heart \u2192 Body' },
            { n: '02', title: 'Core formula', text: 'CO = HR \u00d7 SV' },
            { n: '03', title: 'ASD pattern', text: 'Left-to-right shunt \u2192 right-sided volume load \u2192 more blood to lungs' },
            { n: '04', title: 'Early vs late', text: 'Hypotension is late; cold, pale, slow refill is early' },
          ].map((cell) => (
            <div key={cell.n} className="cv-golden-cell">
              <span className="cv-golden-numeral">{cell.n}</span>
              <p className="cv-golden-title">{cell.title}</p>
              <p className="cv-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Quiz */}
        <h2 className="cv-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Cardiovascular System & Assessment" questions={quizQuestions} />
      </div>
    </div>
  );
}
