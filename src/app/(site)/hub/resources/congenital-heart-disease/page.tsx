'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import { HeartFlowFigure } from '@/components/hub/HeartFigures';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.chd-guide *, .chd-guide *::before, .chd-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.chd-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.chd-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

.chd-back {
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
.chd-back:hover { color: var(--ink-soft); }
.chd-back-arrow { font-style: normal; }

.chd-kicker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.chd-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.chd-year-pill {
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--purple-50);
  color: var(--purple-800);
}

.chd-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 52px;
  font-weight: 400;
  line-height: 1.1;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.chd-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.chd-prereq {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--ink-soft);
  background: var(--surface-sunken);
  border: 0.5px solid var(--hairline-firm);
  padding: 8px 14px;
  margin-bottom: 24px;
  text-decoration: none;
}
.chd-prereq:hover { color: var(--ink-strong); }

.chd-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

.chd-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.chd-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.chd-golden-cell:last-child { border-right: none; }

.chd-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.chd-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.chd-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

.chd-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.chd-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.chd-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.chd-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.chd-step-content {
  padding-left: 32px;
}

.chd-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.chd-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

.chd-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.chd-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.chd-content-col:last-child { border-right: none; }

.chd-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.chd-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.chd-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.chd-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

.chd-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.chd-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.chd-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

.chd-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.chd-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.chd-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.chd-section-title {
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

.chd-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.chd-table th {
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
.chd-table th:last-child { border-right: none; }

.chd-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.chd-table td:last-child { border-right: none; }
.chd-table tr:last-child td { border-bottom: none; }
.chd-table td:first-child { font-weight: 400; color: var(--ink-mid); }

.chd-letter-1 { color: var(--blue-600); }
.chd-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.chd-letter-2 { color: var(--teal-600); }
.chd-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.chd-letter-3 { color: var(--coral-600); }
.chd-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.chd-letter-4 { color: var(--purple-600); }
.chd-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.chd-letter-5 { color: var(--gray-600); }
.chd-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.chd-letter-6 { color: #8B5E3C; }
.chd-badge-6 { background: var(--surface-sunken); color: #6B4729; }

@media (max-width: 860px) {
  .chd-wrap { padding: 24px 20px 48px; }
  .chd-headline { font-size: 32px; }
  .chd-golden { grid-template-columns: repeat(2, 1fr); }
  .chd-golden-cell:nth-child(2) { border-right: none; }
  .chd-golden-cell:nth-child(1), .chd-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .chd-step { grid-template-columns: 64px 1fr; }
  .chd-step-letter { font-size: 48px; }
  .chd-content-grid { grid-template-columns: repeat(2, 1fr); }
  .chd-content-col:nth-child(2) { border-right: none; }
  .chd-content-col:nth-child(1), .chd-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
}

@media (max-width: 520px) {
  .chd-golden { grid-template-columns: 1fr; }
  .chd-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .chd-golden-cell:last-child { border-bottom: none; }
  .chd-content-grid { grid-template-columns: 1fr; }
  .chd-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .chd-content-col:last-child { border-bottom: none; }
  .chd-step { grid-template-columns: 52px 1fr; }
  .chd-step-letter { font-size: 38px; }
  .chd-step-content { padding-left: 18px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Duct-Dependent Circulation',
    question: 'Why can a baby with CHD collapse suddenly in the first days of life?',
    cols: [
      {
        header: 'What duct-dependent means',
        items: [
          'The baby needs the ductus arteriosus to stay open',
          'It is bridging a structural problem elsewhere',
          'If it closes, pulmonary or systemic flow can fall suddenly',
          'Prostin (prostaglandin) keeps the duct open medically',
        ],
      },
      {
        header: 'Pre-ductal saturations',
        items: [
          'Taken from the right hand',
          'Reflects blood reaching the brain and upper body',
          'Sits before the ductal mixing point',
        ],
      },
      {
        header: 'Post-ductal saturations',
        items: [
          'Taken from a foot',
          'Reflects blood reaching the lower body',
          'Sits after ductal-level mixing',
        ],
      },
      {
        header: 'Why the difference matters',
        items: [
          'A significant pre/post gap can suggest ductal shunting',
          'May suggest pulmonary hypertension or duct-dependent flow',
          'Always interpret alongside the full clinical picture',
          'Escalate a significant difference',
        ],
      },
    ],
    redFlags: ['Sudden collapse in the first days of life', 'Large pre/post-ductal saturation gap'],
    pearl:
      'Many neonatal CHD emergencies are really "the duct closed and nothing is bridging the gap anymore." This is why some babies who look fine on day 1 deteriorate sharply on day 2–3 as the ductus arteriosus naturally closes.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Cyanotic vs Acyanotic: Four Groups',
    question: 'How does the lecture actually sort congenital heart disease?',
    cols: [
      {
        header: 'Cyanotic – decreased pulmonary flow',
        items: [
          'Tetralogy of Fallot, tricuspid atresia',
          'Not enough blood reaches the lungs to oxygenate',
        ],
      },
      {
        header: 'Cyanotic – mixed blood flow',
        items: [
          'TGA, TAPVD, HLHS, truncus arteriosus',
          'Oxygenated and deoxygenated blood mix or circulate abnormally',
        ],
      },
      {
        header: 'Acyanotic – left-to-right shunt',
        items: [
          'VSD, ASD, AVSD, PDA',
          'Blood moves high-pressure left → right, raising pulmonary flow',
        ],
      },
      {
        header: 'Acyanotic – obstruction',
        items: [
          'Pulmonary/aortic stenosis or atresia, coarctation',
          'Flow out of the ventricles or through a major vessel is restricted',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Cyanotic = the oxygenation problem is visible because low-oxygen blood reaches the body. Acyanotic = there may be no obvious blue tinge at first, but the heart can still be under real strain from shunting or obstruction.',
  },
  {
    number: '3',
    colour: '3',
    name: 'Coarctation & Transposition',
    question: 'One is an obstruction problem, one is a plumbing problem – how do you tell them apart?',
    cols: [
      {
        header: 'Coarctation – the question to ask',
        items: [
          '"Can blood get past the narrowing to the lower body?"',
          'Do four-limb blood pressures if concerned',
          'Weak/absent femoral pulses, cool lower limbs',
          'Poor gut perfusion raises NEC risk',
        ],
      },
      {
        header: 'Coarctation – management',
        items: [
          'Often needs Prostin if duct-dependent, then surgical repair',
          'Post-op: BP monitoring, pain control (high BP stresses the repair)',
          'Watch limb perfusion and gut perfusion/NEC risk',
        ],
      },
      {
        header: 'TGA – why mixing is lifesaving',
        items: [
          'Aorta and pulmonary artery are switched',
          'Creates two parallel circuits that never meet',
          'Without mixing, oxygenated blood cannot reach the body',
        ],
      },
      {
        header: 'TGA – how mixing happens',
        items: [
          'Via PDA, ASD, or VSD',
          'Balloon atrial septostomy if needed',
          'Two separate circuits + no mixing = rapid deterioration',
        ],
      },
    ],
    redFlags: ['Weak or absent femoral pulses', 'Upper/lower limb BP difference', 'Rapid deterioration in suspected TGA'],
    pearl:
      'Coarctation is a "can blood get past?" problem. TGA is a "does blood ever meet?" problem. Keeping that distinction clear stops the two conditions blurring together in revision.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Tetralogy of Fallot & TOF Spells',
    question: 'What are the four features, and what actually happens in a tet spell?',
    cols: [
      {
        header: 'The classic four',
        items: [
          'Pulmonary stenosis – less blood reaches the lungs',
          'VSD – hole allowing right/left ventricle mixing',
          'Overriding aorta – sits over the VSD, receives mixed blood',
          'Right ventricular hypertrophy – RV thickens against obstruction',
        ],
      },
      {
        header: 'What triggers a tet spell',
        items: [
          'Pulmonary blood flow suddenly falls',
          'Often when the child is upset, crying, or agitated',
          'Child becomes very blue, distressed, and unwell',
        ],
      },
      {
        header: 'Emergency response',
        items: [
          'High-flow oxygen – a pulmonary vasodilator',
          'Knees-to-chest positioning',
          'Keep the child calm; escalate urgently',
          'Morphine may be prescribed in some cases',
        ],
      },
      {
        header: 'Why knees-to-chest works',
        items: [
          'Increases systemic vascular resistance',
          'Makes it harder for blood to flow out to the body',
          'Pushes more blood towards the lungs instead',
        ],
      },
    ],
    redFlags: ['Sudden severe cyanosis with agitation', 'Child becoming increasingly distressed and blue'],
    pearl:
      'A tet spell is one of the few paediatric cardiac emergencies with an immediate physical first-aid response you can start before any drug: knees-to-chest, calm the child, high-flow oxygen, escalate.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Hypoplastic Left Heart Syndrome',
    question: 'How does a baby survive when the left side of the heart barely functions?',
    cols: [
      {
        header: 'What HLHS is',
        items: [
          'Severely underdeveloped left ventricle',
          'Mitral and/or aortic valve problems',
          'Very small/underdeveloped aorta',
          'The right ventricle has to support the whole circulation',
        ],
      },
      {
        header: 'Keeping the baby alive',
        items: [
          'Needs mixing, usually via ASD and PDA',
          'Prostin keeps the ductus arteriosus open',
          'Without intervention, this is not compatible with survival',
        ],
      },
      {
        header: 'Staged palliative surgery',
        items: [
          'Stage 1: neonatal period',
          'Stage 2: around 4–6 months / when weight allows',
          'Later: Fontan-type circulation in childhood',
        ],
      },
      {
        header: 'Important wording',
        items: [
          'These are palliative, not curative surgeries',
          'They do not make the heart structurally normal',
          'They create a circulation that can support life',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Cardiac is "plumbing + electrics." HLHS is the ultimate plumbing problem – the left-side pump is barely there, so staged surgery re-routes the entire circulation around a single functioning ventricle.',
  },
  {
    number: '6',
    colour: '6',
    name: 'Rhythm, Feeding & Nursing Care',
    question: 'Beyond the structural defects – what does day-to-day cardiac nursing actually involve?',
    cols: [
      {
        header: 'SVT (supraventricular tachycardia)',
        items: [
          'Fast rhythm above the ventricles, often >200 bpm',
          'P waves may be absent/hard to see',
          'Starts and stops suddenly – unlike a gradual rise from fever/pain',
          'Vagal manoeuvres: swaddle + cold stimulus (babies), syringe blow (older)',
        ],
      },
      {
        header: 'Vagal stimulation in babies',
        items: [
          'Mask ventilation pressure near the nose/face',
          'Passing an NG tube',
          'Very cold feeds/stimulation',
          'Straining – all can trigger sudden bradycardia',
        ],
      },
      {
        header: 'Feeding & fluid balance',
        items: [
          'Cardiac babies need calories to grow, but feeding is hard work',
          'Too much fluid raises preload, can worsen heart failure',
          'High-calorie feeds in smaller volumes; diuretics if overloaded',
          'Fluid boluses often smaller/more cautious (e.g. 5 ml/kg)',
        ],
      },
      {
        header: 'Oxygen therapy nuance',
        items: [
          'Not automatically "bad" – give it in an emergency',
          'Some cyanotic children have individual target sats (~75–85%)',
          'Oxygen is a pulmonary vasodilator – too much can raise pulmonary flow',
          'Check the child’s own cardiac plan once immediate safety is addressed',
        ],
      },
    ],
    redFlags: ['New arrhythmia with symptoms', 'Sudden bradycardia during handling/NG insertion', 'Signs of fluid overload in a cardiac baby'],
    pearl:
      'The ECG tells you the rhythm; the child’s pulse, CRT, colour, and consciousness tell you whether that rhythm is actually producing effective circulation. Always link the monitor to the bedside.',
  },
];

const heartDevelopmentRows = [
  { timing: 'Around day 22', event: 'The primitive heart tube starts to form.' },
  { timing: 'Around day 28', event: 'Heart looping begins – the tube twists and starts forming atria, ventricles, and the septum.' },
  { timing: 'Around week 5–7', event: 'The aortic and pulmonary trunks divide into the two great vessels; valves develop.' },
  { timing: 'By about week 7', event: 'The fetal heart has a recognisable structure, though fetal circulation still differs from postnatal circulation.' },
];

const riskFactorRows = [
  { group: 'Genetic/family', examples: 'Consanguineous parents, monozygotic twins, chromosomal abnormalities (22q11 deletion, trisomy 18, trisomy 21)' },
  { group: 'Genetic syndromes', examples: 'Marfan syndrome, Noonan syndrome, Duchenne muscular dystrophy' },
  { group: 'Maternal/environmental', examples: 'Maternal diabetes, maternal alcohol use, maternal drug use including anticonvulsants and methamphetamines' },
];

const presentationRows = [
  { sign: 'Low saturations/cyanosis', why: 'Not enough oxygenated blood is reaching systemic circulation.', meaning: 'Assess A–B–C, give oxygen as prescribed/appropriate, escalate.' },
  { sign: 'Tachypnoea / increased work of breathing', why: 'Trying to improve oxygen delivery, or pulmonary overcirculation/fluid.', meaning: 'Respiratory signs can be cardiac, not just respiratory in origin.' },
  { sign: 'Poor feeding', why: 'Feeding is hard work; cardiac babies tire quickly with poor reserve.', meaning: 'Monitor intake, weight, fatigue, sweating, breathlessness, feed duration.' },
  { sign: 'Poor weight gain', why: 'High energy use plus poor intake can cause failure to thrive.', meaning: 'Feeding support and dietetic/cardiac review may be needed.' },
  { sign: 'Cool peripheries / delayed CRT', why: 'Peripheral perfusion is reduced.', meaning: 'Suggests compromised circulation or compensation.' },
  { sign: 'Poor or unequal pulses', why: 'Cardiac output or vessel flow reduced; obstruction can cause inequality.', meaning: 'Compare central/peripheral and upper/lower limb pulses.' },
];

const svtRows = [
  { feature: 'Meaning', detail: 'An abnormally fast rhythm arising above the ventricles.' },
  { feature: 'Rate', detail: 'Often very fast, commonly over 200 bpm in babies/children.' },
  { feature: 'ECG clue', detail: 'P waves may be absent or very hard to see – QRS complexes come too rapidly.' },
  { feature: 'Pattern', detail: 'Starts and stops suddenly, unlike a gradual rise from fever, pain, crying, or sepsis.' },
  { feature: 'Why it matters', detail: 'Ventricles may not have enough time to fill, reducing stroke volume, cardiac output, and BP.' },
];

const quizQuestions = [
  {
    question: 'Why might a baby with duct-dependent CHD look well on day 1 but deteriorate sharply on day 2–3?',
    options: [
      'The heart defect gets worse over time on its own',
      'The ductus arteriosus naturally closes over the first days, removing the bridge the circulation depended on',
      'This pattern is unrelated to the ductus arteriosus',
      'It only happens in acyanotic defects',
    ],
    answer: 1,
    explanation: 'Duct-dependent lesions rely on the ductus arteriosus staying open. As it naturally closes over the first days of life, pulmonary or systemic blood flow can fall suddenly, causing collapse.',
  },
  {
    question: 'Pre-ductal oxygen saturations are usually taken from which site?',
    options: ['A foot', 'The right hand', 'The left hand', 'An earlobe'],
    answer: 1,
    explanation: 'Pre-ductal saturations are usually taken from the right hand, reflecting blood reaching the brain and upper body before the ductal mixing point.',
  },
  {
    question: 'Which best describes the core problem in transposition of the great arteries (TGA)?',
    options: [
      'A narrowing that blocks blood reaching the lower body',
      'Two parallel circuits that never meet, so oxygenated blood cannot reach the body without mixing',
      'A hole between the atria only',
      'An infection of the heart valves',
    ],
    answer: 1,
    explanation: 'In TGA the aorta and pulmonary artery are switched, creating two separate circuits. Without mixing via a PDA, ASD, VSD, or septostomy, oxygenated blood cannot reach the body.',
  },
  {
    question: 'During a Tetralogy of Fallot "tet spell," why does knees-to-chest positioning help?',
    options: [
      'It lowers the child’s heart rate directly',
      'It increases systemic vascular resistance, pushing more blood towards the lungs',
      'It has no real physiological effect, only a calming one',
      'It reduces the VSD size temporarily',
    ],
    answer: 1,
    explanation: 'Knees-to-chest positioning increases systemic vascular resistance, making it harder for blood to flow out to the body and encouraging more flow towards the pulmonary circulation.',
  },
  {
    question: 'In hypoplastic left heart syndrome, staged surgeries are best described as:',
    options: [
      'Curative – they restore normal heart structure',
      'Palliative – they create a circulation that can support life without making the heart structurally normal',
      'Unnecessary if Prostin is given long-term',
      'Only used after the age of 10',
    ],
    answer: 1,
    explanation: 'HLHS staged surgeries are palliative: they re-route the circulation around a single functioning ventricle rather than restoring normal two-ventricle anatomy.',
  },
  {
    question: 'What ECG feature is characteristic of SVT?',
    options: [
      'A gradual rise in heart rate over hours',
      'P waves that are absent or very hard to see, with a very fast rate that starts and stops suddenly',
      'A heart rate that never exceeds 120 bpm',
      'Wide QRS complexes with a slow rate',
    ],
    answer: 1,
    explanation: 'SVT typically shows a very fast rate (often >200 bpm) with absent or hard-to-see P waves, and characteristically starts and stops abruptly.',
  },
  {
    question: 'Why must oxygen be given cautiously in some cyanotic cardiac children once they are stable?',
    options: [
      'Oxygen has no effect on the pulmonary vessels',
      'Oxygen is a pulmonary vasodilator and can increase pulmonary blood flow beyond what some lesions can tolerate',
      'Oxygen should never be given to any cardiac child',
      'It only matters after cardiac surgery',
    ],
    answer: 1,
    explanation: 'Oxygen dilates pulmonary vessels and can increase pulmonary blood flow, which can be undesirable in some cardiac lesions once the child is stable – hence checking the individual cardiac plan.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CongenitalHeartDiseasePage() {
  return (
    <div className="chd-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="chd-wrap">
        <Link href="/hub/childrens" className="chd-back">
          <span className="chd-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        <div className="chd-kicker-row">
          <p className="chd-kicker">Nursing Process in Action &middot; Children&apos;s Nursing</p>
          <span className="chd-year-pill">Year 2</span>
        </div>
        <h1 className="chd-headline">Congenital Heart Disease: A Year 2 Deep Dive</h1>
        <p className="chd-standfirst">
          Duct-dependent circulation, cyanotic vs acyanotic categories, coarctation, transposition, Tetralogy of Fallot spells, and HLHS &mdash; the CHD detail that builds on first-year cardiovascular basics.
        </p>
        <Link href="/hub/resources/cardiovascular-system" className="chd-prereq">
          &larr; New to heart anatomy and fetal circulation? Start with the Year 1 Cardiovascular System guide first.
        </Link>
        <p className="chd-byline">Children&apos;s nursing &middot; Year 2 &middot; The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="congenital-heart-disease"
          hubItemTitle="Congenital Heart Disease: A Year 2 Deep Dive"
        />

        <div className="chd-pearl" style={{ marginBottom: '40px' }}>
          <p className="chd-pearl-label">Student note</p>
          <p>Duct-dependent means a baby&apos;s circulation relies on the ductus arteriosus staying open. Prostin is the prostaglandin infusion used to keep it open. Cyanotic means low-oxygen blood is reaching the body (visible blue tinge). Acyanotic means the main problem is shunting or obstruction, often without obvious cyanosis at first. A tet spell (TOF spell) is a sudden drop in pulmonary blood flow in Tetralogy of Fallot.</p>
        </div>

        <HeartFlowFigure caption="The normal heart and direction of blood flow &mdash; the starting point for every congenital defect" />

        <div className="chd-golden">
          {[
            { n: '01', title: 'Mindset', text: 'Cardiac is "plumbing + electrics." Plumbing = flow, valves, vessels, pressure. Electrics = rhythm and conduction.' },
            { n: '02', title: 'Duct-dependent rule', text: 'If the duct closes and nothing bridges the gap, flow can fail suddenly – classic day 2–3 collapse pattern.' },
            { n: '03', title: 'Cyanotic vs acyanotic', text: 'Cyanotic = oxygenation problem is visible. Acyanotic = shunting/obstruction, may not look blue at first.' },
            { n: '04', title: 'Tet spell response', text: 'Knees-to-chest, calm the child, high-flow oxygen, escalate urgently.' },
          ].map((cell) => (
            <div key={cell.n} className="chd-golden-cell">
              <span className="chd-golden-numeral">{cell.n}</span>
              <p className="chd-golden-title">{cell.title}</p>
              <p className="chd-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="chd-step">
            <div className="chd-step-sidebar">
              <span className={`chd-step-letter chd-letter-${section.colour}`}>{section.number}</span>
              <span className={`chd-step-badge chd-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="chd-step-content">
              <h2 className="chd-step-name">{section.name}</h2>
              <p className="chd-step-question">{section.question}</p>

              <div className="chd-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="chd-content-col">
                    <p className="chd-col-header">{col.header}</p>
                    <ul className="chd-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="chd-redflags-label">Red flags</p>
                  <div className="chd-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="chd-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="chd-pearl">
                  <p className="chd-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        <h2 className="chd-section-title">Heart Development Timeline</h2>
        <table className="chd-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Timing</th>
              <th>What happens</th>
            </tr>
          </thead>
          <tbody>
            {heartDevelopmentRows.map((row) => (
              <tr key={row.timing}>
                <td>{row.timing}</td>
                <td>{row.event}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="chd-section-title">Risk Factors for CHD</h2>
        <table className="chd-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Risk factor group</th>
              <th>Examples from the lecture</th>
            </tr>
          </thead>
          <tbody>
            {riskFactorRows.map((row) => (
              <tr key={row.group}>
                <td>{row.group}</td>
                <td>{row.examples}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="chd-section-title">Presentation: Why Each Sign Happens</h2>
        <table className="chd-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Sign</th>
              <th>Why it may happen</th>
              <th>Nursing meaning</th>
            </tr>
          </thead>
          <tbody>
            {presentationRows.map((row) => (
              <tr key={row.sign}>
                <td>{row.sign}</td>
                <td>{row.why}</td>
                <td>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="chd-section-title">SVT Reference</h2>
        <table className="chd-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>What to remember</th>
            </tr>
          </thead>
          <tbody>
            {svtRows.map((row) => (
              <tr key={row.feature}>
                <td>{row.feature}</td>
                <td>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="chd-pearl" style={{ marginBottom: '32px' }}>
          <p className="chd-pearl-label">Clinical pearl</p>
          <p>Vagal stimulation is a useful concept beyond SVT management too: mask ventilation pressure near the nose/face, passing an NG tube, very cold feeds, and straining can all trigger sudden bradycardia in babies. If a baby&apos;s heart rate suddenly drops during handling, think vagal response as one possible cause.</p>
        </div>

        <h2 className="chd-section-title">Summary: The Five Sentences</h2>
        <div className="chd-golden" style={{ marginBottom: '40px' }}>
          {[
            { n: '01', title: 'Delivery system', text: 'The cardiovascular system moves oxygen, nutrients, and waste around the body' },
            { n: '02', title: 'CO depends on 4 things', text: 'Heart rate, preload, afterload, and contractility – any can reduce perfusion' },
            { n: '03', title: 'Shunts can be lifesaving', text: 'The ductus arteriosus can bridge duct-dependent CHD until repair' },
            { n: '04', title: 'Cyanotic vs acyanotic', text: 'Depends on whether oxygenation/mixing or shunting/obstruction dominates' },
          ].map((cell) => (
            <div key={cell.n} className="chd-golden-cell">
              <span className="chd-golden-numeral">{cell.n}</span>
              <p className="chd-golden-title">{cell.title}</p>
              <p className="chd-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        <h2 className="chd-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Congenital Heart Disease" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'British Congenital Cardiac Association', title: 'Standards and resources for congenital heart disease', href: 'https://www.bcca-uk.org/' },
          { citation: 'NHS England', title: 'Congenital heart disease standards and specifications', href: 'https://www.england.nhs.uk/' },
          { citation: 'Resuscitation Council UK (2021)', title: '2021 Resuscitation Guidelines', href: 'https://www.resus.org.uk/library/2021-resuscitation-guidelines' },
          { citation: 'BNF for Children', title: 'Current dosing guidance – always verify against the live BNFc before clinical use', href: 'https://bnfc.nice.org.uk/' },
        ]} />
      </div>
    </div>
  );
}
