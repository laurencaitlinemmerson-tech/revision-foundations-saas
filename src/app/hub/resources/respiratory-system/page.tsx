'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import {
  STUDY_COMPONENTS_CSS,
  GlossaryChips,
  FormulaBox,
  ClinicalCallout,
  MnemonicRow,
  SplitCompare,
  QuickRefGrid,
  SentenceBank,
  ConditionCard,
  ExpandableSection,
  RelatedResourceLink,
  SourceLinks,
} from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.rs-guide *, .rs-guide *::before, .rs-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.rs-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.rs-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.rs-back {
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
.rs-back:hover { color: #555; }
.rs-back-arrow { font-style: normal; }

/* Masthead */
.rs-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.rs-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.rs-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.rs-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
}

/* Golden rules grid */
.rs-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.rs-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.rs-golden-cell:last-child { border-right: none; }

.rs-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.rs-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.rs-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.rs-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 24px;
}

.rs-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.rs-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.rs-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.rs-step-content {
  padding-left: 32px;
}

.rs-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.rs-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.rs-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.rs-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.rs-content-col:last-child { border-right: none; }

.rs-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.rs-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.rs-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.rs-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Red flags */
.rs-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.rs-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.rs-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.rs-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.rs-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.rs-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.rs-section-title {
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
.rs-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 0;
  font-size: 13px;
}

.rs-table th {
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
.rs-table th:last-child { border-right: none; }

.rs-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.rs-table td:last-child { border-right: none; }
.rs-table tr:last-child td { border-bottom: none; }
.rs-table td:first-child { font-weight: 400; color: #2C2A27; }

/* 2-col grid */
.rs-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.rs-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.rs-grid-2-cell:nth-child(2n) { border-right: none; }

.rs-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

/* Step colour system */
.rs-letter-1 { color: #185FA5; }
.rs-badge-1 { background: #E6F1FB; color: #0C447C; }
.rs-letter-2 { color: #0F6E56; }
.rs-badge-2 { background: #E1F5EE; color: #085041; }
.rs-letter-3 { color: #993C1D; }
.rs-badge-3 { background: #FAECE7; color: #712B13; }
.rs-letter-4 { color: #534AB7; }
.rs-badge-4 { background: #EEEDFE; color: #3C3489; }
.rs-letter-5 { color: #5F5E5A; }
.rs-badge-5 { background: #F1EFE8; color: #444441; }
.rs-letter-6 { color: #8B5E3C; }
.rs-badge-6 { background: #F5EDE5; color: #6B4729; }

/* Responsive */
@media (max-width: 860px) {
  .rs-wrap { padding: 24px 20px 48px; }
  .rs-headline { font-size: 34px; }
  .rs-golden { grid-template-columns: repeat(2, 1fr); }
  .rs-golden-cell:nth-child(2) { border-right: none; }
  .rs-golden-cell:nth-child(1), .rs-golden-cell:nth-child(2) { border-bottom: 0.5px solid rgba(0,0,0,0.12); }
  .rs-step { grid-template-columns: 64px 1fr; }
  .rs-step-letter { font-size: 48px; }
  .rs-content-grid { grid-template-columns: repeat(2, 1fr); }
  .rs-content-col:nth-child(2) { border-right: none; }
  .rs-content-col:nth-child(1), .rs-content-col:nth-child(2) { border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .rs-grid-2 { grid-template-columns: 1fr; }
  .rs-grid-2-cell { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .rs-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .rs-golden { grid-template-columns: 1fr; }
  .rs-golden-cell { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.12); }
  .rs-golden-cell:last-child { border-bottom: none; }
  .rs-content-grid { grid-template-columns: 1fr; }
  .rs-content-col { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .rs-content-col:last-child { border-bottom: none; }
  .rs-step { grid-template-columns: 52px 1fr; }
  .rs-step-letter { font-size: 38px; }
  .rs-step-content { padding-left: 18px; }
}
`;


// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Airway Layout & Gas Exchange',
    question: 'Where does air travel and where does oxygen actually swap into the blood?',
    cols: [
      {
        header: 'Conducting zone',
        items: [
          'Nose to terminal bronchioles',
          'Moves air but no gas exchange yet',
          'Anatomical dead space ~150 ml',
          'Warms, moistens, filters, carries air',
        ],
      },
      {
        header: 'Respiratory zone',
        items: [
          'Respiratory bronchioles to alveoli',
          'Where O₂ moves in and CO₂ moves out',
          'Total surface area around 70 m²',
          'Gas exchange starts at respiratory bronchiole',
        ],
      },
      {
        header: 'Alveolar detail',
        items: [
          'O₂ diffuses into capillary (high to low)',
          'CO₂ diffuses out to be exhaled',
          'Membrane around 0.5 μm thick',
          'Around 300 million alveoli',
        ],
      },
      {
        header: 'Cell types',
        items: [
          'Type I: thin, flat, for gas exchange',
          'Type II: cuboidal, secrete surfactant',
          'Surfactant reduces surface tension',
          'Immature Type II cells cause neonatal RDS',
        ],
      },
    ],
    redFlags: ['Silent chest', 'Stridor with drooling', 'Central cyanosis', 'Grunting', 'See-saw breathing'],
    pearl:
      'This is why tiny swollen airways matter so much in children. If a 4 mm airway swells by 1 mm, you lose about 75% of the space inside it. In practice, that means a small amount of oedema in an infant can cause a very big breathing problem very quickly.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Lungs, Pleura & Airway Defences',
    question: 'What structures protect the lungs and how does the body keep the airways clean?',
    cols: [
      {
        header: 'Right vs left lung',
        items: [
          'Right: three lobes, wider, shorter (liver)',
          'Left: two lobes, smaller, cardiac notch',
          'Right bronchus wider and straighter',
          'Aspiration more likely on right side',
        ],
      },
      {
        header: 'Pleura',
        items: [
          'Visceral pleura covers lung surface',
          'Parietal pleura lines thoracic wall',
          'Pleural cavity has serous fluid',
          'Negative pressure keeps lungs inflated',
        ],
      },
      {
        header: 'Defence mechanisms',
        items: [
          'Nasal hairs and turbinates trap particles',
          'Mucus and goblet cells catch debris',
          'Mucociliary escalator moves mucus up',
          'Cough and sneeze reflexes expel irritants',
        ],
      },
      {
        header: 'Immune defences',
        items: [
          'Alveolar macrophages: clean-up cells',
          'IgA antibodies in mucosal surfaces',
          'Clearance impaired by smoke, cold, dry air',
          'Dehydration and anaesthesia slow clearance',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'As children get older, they gradually develop more tiny side routes for air movement. These connections can help air bypass a blocked area a little, which is one reason very young children can struggle faster when small airways are full of mucus or swelling.',
  },
  {
    number: '3',
    colour: '3',
    name: 'How Breathing Works',
    question: 'What drives air in and out, and what do the lung volume terms mean?',
    cols: [
      {
        header: 'Inspiration',
        items: [
          'Active process requiring energy',
          'Diaphragm contracts and flattens',
          'External intercostals lift ribs up and out',
          'Thoracic volume rises, air moves in',
        ],
      },
      {
        header: 'Expiration',
        items: [
          'Quiet expiration is passive (elastic recoil)',
          'Diaphragm relaxes and domes up',
          'Thoracic volume falls, pressure rises',
          'Forced expiration uses internal intercostals',
        ],
      },
      {
        header: 'Breathing control',
        items: [
          'Central chemoreceptors: medulla, sense CO₂',
          'Peripheral: carotid bodies, aortic arch',
          'Peripheral sense low O₂ and pH drops',
          'CO₂ is the main day-to-day driver',
        ],
      },
      {
        header: 'Lining changes',
        items: [
          'Upper: heavy-duty filtering, mucus trapping',
          'Bronchioles: thinner, simpler lining',
          'Alveoli: thinnest possible for gas exchange',
          'Structure matches function at every level',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Boyle\u2019s law in plain terms: bigger chest space means lower pressure, so air gets pulled in. Smaller chest space means higher pressure, so air moves back out. That is the basic pressure rule behind normal breathing.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Oxygen Transport & Hypoxia',
    question: 'How does oxygen travel in the blood and what goes wrong when it cannot?',
    cols: [
      {
        header: 'O\u2082 transport',
        items: [
          '~98.5% carried bound to haemoglobin',
          'Each Hb carries four O₂ molecules',
          '~1.5% dissolved in plasma',
          'Normal SpO₂ in children: 94\u201398%',
        ],
      },
      {
        header: 'CO\u2082 transport',
        items: [
          '~70% as bicarbonate',
          '~23% bound to Hb (carbaminohaemoglobin)',
          '~7% dissolved in plasma',
        ],
      },
      {
        header: 'V/Q matching',
        items: [
          'V = air in and out, Q = blood flow past',
          'Low V/Q (shunt): poor ventilation, blood flows',
          'High V/Q (dead space): air ok, poor blood flow',
          'Lungs redirect blood from poorly ventilated areas',
        ],
      },
      {
        header: 'Gas exchange efficiency: TSB',
        items: [
          'Thin: 0.5 \u03bcm membrane',
          'Surface area: 300 million alveoli',
          'Blood supply: dense capillary network',
        ],
      },
    ],
    redFlags: ['SpO₂ <94%', 'Rising oxygen requirement', 'SpO₂ falling despite oxygen', 'Silent chest'],
    pearl:
      'O₂-Hb curve in plain English: a right shift means haemoglobin lets go of oxygen more easily, which helps tissues pick it up. A left shift means oxygen is held more tightly, as happens in the lungs and in foetal haemoglobin.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Paediatric Differences',
    question: 'Why can respiratory illness turn faster in children?',
    cols: [
      {
        header: 'Airway structure',
        items: [
          'Narrower, shorter, softer cartilage',
          'Obligate nose breathers until ~3\u20136 months',
          'Congestion alone can trigger distress',
          'Small swelling blocks airflow much more',
        ],
      },
      {
        header: 'Chest and breathing',
        items: [
          'Ribs more horizontal and compliant',
          'Children rely on diaphragm',
          'Recession visible early',
          'RR higher: neonate 30\u201360, infant 25\u201350',
        ],
      },
      {
        header: 'Reserve and demand',
        items: [
          'O₂ consumption ~6\u20138 ml/kg/min vs ~3\u20134 adults',
          'Desaturate faster, tolerate hypoxia less',
          'Lower FRC relative to body size',
          'Smaller oxygen reserve, quicker desat',
        ],
      },
      {
        header: 'Muscle and immunity',
        items: [
          'Diaphragm has more fast-tiring fibres',
          'Can tire earlier if breathing is hard work',
          'More immature immune system, fewer IgA',
          'Greater susceptibility to RSV, pertussis',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'The airway\u2019s normal cleaning system works less well with smoking exposure, dehydration, general anaesthesia, and cold dry air. When that clearance slows down, mucus sits around more easily and infection risk goes up.',
  },
  {
    number: '6',
    colour: '6',
    name: 'Assessment & Common Conditions',
    question: 'What should you check, which signs matter most, and what are the key conditions?',
    cols: [
      {
        header: 'Start from the end of the bed',
        items: [
          'Look at colour, position, alertness',
          'Can they cry, feed, or talk properly?',
          'Count RR for a full 60 seconds',
          'Document effort, SpO₂, device, and look',
        ],
      },
      {
        header: 'Work of breathing signs',
        items: [
          'Nasal flaring',
          'Tracheal tug',
          'Subcostal and intercostal recession',
          'Head bobbing, grunting, sternal recession',
        ],
      },
      {
        header: 'Distress vs failure',
        items: [
          'Distress: tachypnoea, recession, alert child',
          'Distress: sats may still be maintained',
          'Failure: falling RR, bradycardia, lethargy',
          'Failure: silent chest, falling sats on O₂',
        ],
      },
      {
        header: 'Upper vs lower airway',
        items: [
          'Upper: stridor, barking cough, hoarse voice',
          'Upper: think croup, swelling, obstruction',
          'Lower: wheeze, prolonged expiration, crackles',
          'Lower: think bronchiolitis, asthma, pneumonia',
        ],
      },
    ],
    redFlags: [
      'Falling RR in a child who looks worse',
      'Silent chest',
      'Central cyanosis',
      'Drooling with stridor and toxic appearance',
      'Weak or absent cry',
      'Reduced consciousness or floppiness',
      'Rising oxygen requirement',
      'SpO₂ falling despite oxygen',
    ],
    pearl:
      'A full respiratory assessment is not just "count the rate and check the sats". It is how the child looks, how hard they are working, how well they are feeding or talking, what their colour is doing, what their circulation looks like, and whether the trend is improving or drifting the wrong way.',
  },
];

const airwayFunctions = [
  { structure: 'Nose', features: 'Tiny hairs, mucus lining, ridges (turbinates), rich blood supply', job: 'Warms, moistens, and filters breathed-in air' },
  { structure: 'Pharynx', features: 'Back of the throat split into three sections', job: 'Shared passage for food and air; the epiglottis helps stop food going into the airway' },
  { structure: 'Larynx', features: 'Voice box with vocal cords, epiglottis, and supporting cartilage', job: 'Makes sound and helps protect the lower airway during swallowing' },
  { structure: 'Trachea', features: 'Cartilage rings and a moving-hair lining', job: 'Keeps the airway open and helps move mucus and debris upward' },
  { structure: 'Bronchi', features: 'Main branches to each lung; the right side is wider, shorter, and straighter', job: 'Carries air into each lung; the right side is easier to accidentally aspirate into' },
  { structure: 'Bronchioles', features: 'Small airways with no cartilage and smooth muscle walls', job: 'Narrow or open to change airflow' },
  { structure: 'Alveoli', features: 'Tiny air sacs with very thin walls and lots of capillaries', job: 'Where oxygen moves into the blood and carbon dioxide moves out' },
];

const infantAdultDifferences = [
  ['Position', 'Higher: C3-C4', 'Lower: C4-C6'],
  ['Shape', 'Cone-shaped at top', 'More cylindrical'],
  ['Narrowest point', 'Subglottis (cricoid ring)', 'Glottic aperture'],
  ['Epiglottis', 'Narrower, omega-shaped, floppier', 'Flatter, more stable'],
  ['Subglottic diameter', '~4 mm full-term, ~3.5 mm premature', 'Much wider'],
  ['Vocal cords', '6-8 mm and shorter', '~20 mm'],
  ['Trachea', '4-5 cm, narrow and soft', '~11 cm, more rigid'],
  ['Occiput/neck', 'Large occiput, short neck', 'More proportional'],
  ['Function', 'Can breathe and swallow simultaneously', 'Cannot'],
];

const spirometryRows = [
  ['Tidal Volume (TV)', 'Volume of air in or out with a normal breath', '~500 ml'],
  ['Inspiratory Reserve Volume (IRV)', 'Extra air you can inhale after a normal breath', '~3000 ml'],
  ['Expiratory Reserve Volume (ERV)', 'Extra air you can exhale after a normal breath', '~1100 ml'],
  ['Residual Volume (RV)', 'Air always left in the lungs', '~1200 ml'],
  ['Vital Capacity (VC)', 'TV + IRV + ERV', '~4600 ml'],
  ['Total Lung Capacity', 'VC + RV', '~5800 ml'],
  ['Functional Residual Capacity (FRC)', 'ERV + RV; air left after normal expiration', '~2300 ml'],
];

const hypoxiaTypes = [
  ['Hypoxic', 'Not enough oxygen is getting from the lungs into the blood', 'Altitude, obstruction, pneumonia, bronchiolitis'],
  ['Anaemic', 'The blood cannot carry oxygen properly even if the lungs are working', 'Anaemia, haemorrhage, carbon monoxide poisoning'],
  ['Ischaemic', 'Blood flow to tissues is too poor to deliver enough oxygen', 'Heart failure, pulmonary embolism, shock'],
  ['Histotoxic', 'Cells cannot use the oxygen that reaches them', 'Cyanide poisoning'],
];

const vqExamples = [
  ['Low V/Q (shunt)', 'Air is not reaching part of the lung well, but blood still flows past it', 'Pneumonia, bronchiolitis, oedema'],
  ['High V/Q (dead space)', 'Air reaches the alveoli, but not enough blood gets past to pick up oxygen', 'Pulmonary embolism'],
];

const gasExchangeProblemRows = [
  ['Poor ventilation', 'Not enough fresh air reaches the alveoli', 'Mucus plugging, bronchospasm, bronchiolitis, severe fatigue'],
  ['Thicker barrier', 'Gas has further to cross before it gets into the blood', 'Pneumonia, pulmonary oedema, inflammation'],
  ['Less surface area', 'There is less working lung available for exchange', 'Collapse, severe infection, widespread alveolar disease'],
  ['Poor perfusion', 'Blood is not matching the air-filled alveoli properly', 'Shock, severe circulatory compromise, dead-space problems'],
];

const conditionRows = [
  ['Bronchiolitis', 'Usually caused by RSV. The smallest airways swell and fill with mucus, so air gets trapped and oxygen levels can fall.', 'Tachypnoea, recession, wheeze, low saturations, poor feeding'],
  ['Asthma', 'The airways tighten, swell, and make extra mucus.', 'Expiratory wheeze, cough, dyspnoea, accessory muscle use'],
  ['Croup', 'The area just below the vocal cords swells, narrowing the upper airway.', 'Barking cough, inspiratory stridor, hoarse voice, worse at night'],
  ['Pneumonia', 'Fluid or infection in the air sacs makes gas exchange harder.', 'Fever, crackles, tachypnoea, productive cough, low saturations'],
  ['Respiratory Distress Syndrome', 'Premature babies may not have enough surfactant, so the air sacs are harder to keep open.', 'Grunting, nasal flaring, tachypnoea, cyanosis, intercostal recession'],
  ['Epiglottitis', 'Swelling of the epiglottis causes life-threatening upper-airway obstruction.', 'Drooling, tripod position, stridor, toxic appearance, no barking cough'],
  ['Pertussis', 'Whooping cough causes intense coughing fits and lots of mucus.', "Inspiratory 'whoop', post-tussive vomiting, apnoea in young infants"],
];

const oxygenMethods = [
  ['Nasal prongs / cannulae', 'Low-flow oxygen; can be sutured for stability', 'Mild to moderate hypoxia in stable patients'],
  ['HFNC', 'Warm high-flow oxygen that also gives a small pressure effect', 'Bronchiolitis and moderate distress'],
  ['CPAP', 'Continuous pressure through prongs or a mask to help keep the airway and air sacs open', 'Significant distress'],
  ['Face mask', 'Simple mask or non-rebreather with variable FiO₂', 'Moderate to severe hypoxia and emergencies'],
  ['Head box', "Perspex box over a neonate's head delivering controlled oxygen", 'Neonates and small infants who cannot tolerate nasal devices'],
  ["Blow-by ('waft')", 'Oxygen tubing held near the face', 'Very distressed child refusing a device'],
];

const assessmentRows = [
  ['Pulse oximetry', 'The oxygen number from the probe', 'In children aim for 94-98%; the reading can mislead if the child is cold, moving, or poorly perfused'],
  ['Listening with a stethoscope', 'What the breath sounds are like and how much air is moving', 'Listen for wheeze, crackles, stridor, or a silent chest'],
  ['Respiratory rate', 'How fast the child is breathing', 'Fast breathing can be an early warning sign; a slower rate in a worsening child can mean they are tiring'],
  ['Work of breathing', 'How hard they seem to be working for each breath', 'Look for recession, flaring, head bobbing, tracheal tug, grunting, and tummy breathing'],
  ['Oxygen requirement', 'How much oxygen and which device they need', 'Needing more oxygen usually means the illness is worsening; document the device, flow, and FiO₂ if given'],
  ['General appearance', 'The overall picture', 'How awake they are, their colour, tone, feeding, and cry can matter more than one isolated monitor number'],
];

const respiratoryRateRows = [
  ['Newborn', '30-60 breaths/min', 'Can be irregular, but pauses and colour change are not something to brush off'],
  ['Infant (1-12 months)', '25-50 breaths/min', 'Count for a full minute if they are wriggly or upset'],
  ['Toddler (1-3 years)', '20-40 breaths/min', 'A fever or crying child may sit at the higher end'],
  ['Preschool (3-5 years)', '20-30 breaths/min', 'Look at the trend as well as the number'],
  ['School age (6-12 years)', '15-25 breaths/min', 'If they look tired, a "normal" rate can still be worrying'],
  ['Adolescent', '12-20 breaths/min', 'Closer to adult values, but still assess alongside effort and colour'],
];

const workOfBreathingSigns = [
  ['Nasal flaring', 'Trying to pull in more air with each breath'],
  ['Tracheal tug', 'Increased upper-airway effort'],
  ['Subcostal recession', 'The diaphragm is working hard and the child is drawing in below the ribs'],
  ['Intercostal recession', 'Visible increased work between the ribs'],
  ['Sternal recession', 'More marked distress with the chest pulling in centrally'],
  ['Head bobbing', 'Infant compensation and fatigue risk'],
  ['Grunting', 'The child is trying to keep the tiny air sacs open at the end of each breath'],
];

const quizQuestions = [
  {
    question: 'Where does the conducting zone end and the respiratory zone begin?',
    options: ['At the larynx', 'At the trachea', 'At the respiratory bronchioles', 'At the alveolar ducts'],
    answer: 2,
    explanation: 'The PDF gives the changeover point as the respiratory bronchioles: conducting zone runs from the nose to terminal bronchioles, then gas exchange begins.',
  },
  {
    question: 'What is the main job of Type II alveolar cells?',
    options: ['They perform most gas exchange', 'They secrete pulmonary surfactant', 'They form cartilage rings', 'They trigger coughing'],
    answer: 1,
    explanation: 'Type II cells make surfactant, the slippery substance that helps stop the air sacs collapsing.',
  },
  {
    question: 'Why can a small amount of airway swelling be life-threatening in an infant?',
    options: ['Infants have larger alveoli', 'Their pleura contains less fluid', 'Their airway is narrow, so a small reduction in radius greatly increases resistance', 'They have fewer bronchi'],
    answer: 2,
    explanation: 'The notes highlight that a 4 mm airway with 1 mm swelling causes about 75% loss of area, and halving radius causes a major rise in resistance.',
  },
  {
    question: 'Which statement about quiet breathing is correct?',
    options: ['Inspiration is passive and expiration is active', 'Both inspiration and expiration are active', 'Inspiration is active and quiet expiration is passive', 'Both inspiration and expiration are passive'],
    answer: 2,
    explanation: 'Inspiration is active via the diaphragm and external intercostals, while quiet expiration is passive because of elastic recoil.',
  },
  {
    question: 'What is the primary driver for breathing in normal physiology?',
    options: ['Falling oxygen detected by peripheral chemoreceptors', 'Rising carbon dioxide detected via central chemoreceptors', 'Pleural fluid movement', 'A drop in tidal volume alone'],
    answer: 1,
    explanation: 'In day-to-day physiology, the body mostly responds to rising carbon dioxide levels rather than falling oxygen first.',
  },
  {
    question: 'Which type of hypoxia happens when the lungs are working but the blood cannot carry oxygen well?',
    options: ['Hypoxic hypoxia', 'Anaemic hypoxia', 'Ischaemic hypoxia', 'Histotoxic hypoxia'],
    answer: 1,
    explanation: 'Anaemic hypoxia means the blood is not carrying oxygen properly, such as in anaemia or carbon monoxide poisoning.',
  },
  {
    question: 'Which finding suggests respiratory failure rather than compensation?',
    options: ['Tachypnoea with recession', 'Head bobbing in an infant', 'Falling respiratory rate in a child who looks worse', 'Maintained saturations with some work of breathing'],
    answer: 2,
    explanation: 'A dropping breathing rate in a child who otherwise looks worse is dangerous because it can mean they are tiring out, not improving.',
  },
  {
    question: 'What does a silent chest mean on auscultation?',
    options: ['The child has recovered', 'Upper-airway obstruction only', 'A potentially ominous sign of severe compromise', 'Normal quiet breathing'],
    answer: 2,
    explanation: 'A silent chest means very little air is moving. That is a severe and urgent sign, not a reassuring one.',
  },
];


// ─── Component ────────────────────────────────────────────────────────────────

export default function RespiratorySystemPage() {
  return (
    <div className="rs-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS + STUDY_COMPONENTS_CSS }} />

      <div className="rs-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="rs-back">
          <span className="rs-back-arrow">←</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="rs-kicker">Children&apos;s Nursing · Respiratory</p>
        <h1 className="rs-headline">Respiratory System &amp; Assessment</h1>
        <p className="rs-standfirst">
          How breathing works, where oxygen exchange happens, what to check at the bedside, and which signs mean a child needs help sooner rather than later.
        </p>
        <p className="rs-byline">Children&apos;s nursing · The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="respiratory-system"
          hubItemTitle="Respiratory System & Assessment"
        />

        {/* Glossary chips */}
        <GlossaryChips items={[
          { term: 'Alveoli', definition: 'tiny air sacs where gas exchange happens' },
          { term: 'Surfactant', definition: 'reduces surface tension and helps keep alveoli open' },
          { term: 'Perfusion', definition: 'blood flow reaching tissue' },
          { term: 'V/Q ratio', definition: 'relationship between ventilation and perfusion' },
          { term: 'Recession', definition: 'visible pulling in of the chest during increased work of breathing' },
          { term: 'Auscultation', definition: 'listening with your stethoscope' },
        ]} />

        {/* Golden rules */}
        <div className="rs-golden">
          {[
            { n: '01', title: 'Airway order', text: 'Never Phone Liam To Buy Brownies Always — Nose, Pharynx, Larynx, Trachea, Bronchi, Bronchioles, Alveoli.' },
            { n: '02', title: 'Golden rule', text: 'Better numbers but worse child = worse child. Always trust what the child looks like over what the monitor says.' },
            { n: '03', title: 'Efficiency: TSB', text: 'Gas exchange works because the barrier is Thin, the Surface area is huge, and the Blood supply is dense.' },
            { n: '04', title: 'Cell types', text: '1 is Thin (Type I for gas exchange). 2 is Goo (Type II makes surfactant).' },
          ].map((cell) => (
            <div key={cell.n} className="rs-golden-cell">
              <span className="rs-golden-numeral">{cell.n}</span>
              <p className="rs-golden-title">{cell.title}</p>
              <p className="rs-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Numbered sections */}
        {SECTIONS.map((section) => (
          <div key={section.number} className="rs-step">
            {/* Sidebar */}
            <div className="rs-step-sidebar">
              <span className={`rs-step-letter rs-letter-${section.colour}`}>{section.number}</span>
              <span className={`rs-step-badge rs-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            {/* Content */}
            <div className="rs-step-content">
              <h2 className="rs-step-name">{section.name}</h2>
              <p className="rs-step-question">{section.question}</p>

              {/* 4-col grid */}
              <div className="rs-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="rs-content-col">
                    <p className="rs-col-header">{col.header}</p>
                    <ul className="rs-col-list">
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
                  <p className="rs-redflags-label">Red flags</p>
                  <div className="rs-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="rs-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Pearl */}
              {/* Formula boxes for Section 1 (Gas Exchange) */}
              {section.number === '1' && (
                <>
                  <FormulaBox
                    name="Fick's Law of Diffusion"
                    formula="Rate ∝ Surface area × Pressure gradient ÷ Membrane thickness"
                    explanation="Gas exchange is faster when the surface area is large, the pressure difference is steep, and the membrane is thin. Disease processes that reduce surface area (e.g. collapse), thicken the membrane (e.g. pneumonia), or lower the gradient all impair gas exchange."
                  />
                  <ClinicalCallout variant="exam">
                    <p>&ldquo;Gas exchange occurs by passive diffusion down a partial pressure gradient across the respiratory membrane.&rdquo;</p>
                  </ClinicalCallout>
                  <RelatedResourceLink
                    href="/hub/resources/cell-biology"
                    title="Cell Biology"
                    description="For the underlying cell science behind diffusion and membrane transport, review Cell Biology."
                  />
                </>
              )}

              {/* Formula boxes for Section 3 (How Breathing Works) */}
              {section.number === '3' && (
                <>
                  <FormulaBox
                    name="Boyle's Law"
                    formula="P₁V₁ = P₂V₂  —  Pressure and volume are inversely related"
                    explanation="When the thoracic cavity expands during inspiration, pressure inside the chest drops below atmospheric pressure, and air rushes in. During expiration, the cavity shrinks, pressure rises, and air is pushed out."
                  />
                  <FormulaBox
                    name="Poiseuille's Law"
                    formula="Resistance ∝ 1 ÷ radius⁴"
                    explanation="Airway resistance is inversely proportional to the fourth power of the radius. This is why a small reduction in airway diameter (e.g. 1mm of mucosal swelling in an infant) causes a massive increase in resistance and work of breathing."
                  />
                  <SplitCompare
                    leftHeader="Inspiration"
                    rightHeader="Expiration"
                    leftItems={[
                      'Active process — requires energy',
                      'Diaphragm contracts and flattens',
                      'External intercostals lift ribs up and out',
                      'Thoracic volume increases → pressure drops → air enters',
                    ]}
                    rightItems={[
                      'Quiet expiration is passive — elastic recoil',
                      'Diaphragm relaxes and domes upward',
                      'Thoracic volume decreases → pressure rises → air exits',
                      'Forced expiration recruits internal intercostals and abdominals',
                    ]}
                  />
                </>
              )}

              {/* V/Q comparison for Section 4 (Oxygen Transport) */}
              {section.number === '4' && (
                <>
                  <SplitCompare
                    leftHeader="Low V/Q (Shunt)"
                    rightHeader="High V/Q (Dead Space)"
                    leftItems={[
                      'Poor ventilation but blood still flows past',
                      'Blood passes unoxygenated → hypoxaemia',
                      'Examples: pneumonia, bronchiolitis, pulmonary oedema',
                    ]}
                    rightItems={[
                      'Good ventilation but poor blood flow',
                      'Air reaches alveoli but cannot offload gas efficiently',
                      'Examples: pulmonary embolism',
                    ]}
                  />
                  <ClinicalCallout variant="exam">
                    <p>&ldquo;In bronchiolitis, inflammation, oedema, and mucus narrow the bronchioles, reducing ventilation and causing a low V/Q mismatch.&rdquo;</p>
                  </ClinicalCallout>
                </>
              )}

              {/* Paediatric differences exam tip for Section 5 */}
              {section.number === '5' && (
                <>
                  <ClinicalCallout variant="why">
                    <p>Infants are more vulnerable to respiratory compromise because they have narrower airways, higher oxygen demand per kilogram, and less physiological reserve. A 4 mm airway with 1 mm of swelling loses roughly 75% of its cross-sectional area.</p>
                  </ClinicalCallout>
                  <ClinicalCallout variant="exam">
                    <p>&ldquo;Infants are more vulnerable to respiratory compromise because they have narrower airways, higher oxygen demand, and less physiological reserve.&rdquo;</p>
                  </ClinicalCallout>
                </>
              )}

              {/* Assessment exam tip for Section 6 */}
              {section.number === '6' && (
                <ClinicalCallout variant="mistake">
                  <p>Do not rely on SpO₂ alone. A child can maintain saturations while their work of breathing steadily increases. By the time saturations drop, the child may be close to exhaustion. Always assess the whole picture: effort, colour, behaviour, feeding, and trend.</p>
                </ClinicalCallout>
              )}

              {section.pearl && (
                <div className="rs-pearl">
                  <p className="rs-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Airway structures table */}
        <h2 className="rs-section-title">Airway Structures Reference</h2>
        <table className="rs-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Structure</th>
              <th>Key features</th>
              <th>Main job</th>
            </tr>
          </thead>
          <tbody>
            {airwayFunctions.map((row) => (
              <tr key={row.structure}>
                <td>{row.structure}</td>
                <td>{row.features}</td>
                <td>{row.job}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <MnemonicRow
          label="Airway pathway"
          steps={['Nose', 'Pharynx', 'Larynx', 'Trachea', 'Bronchi', 'Bronchioles', 'Alveoli']}
        />

        <ClinicalCallout variant="pearl">
          <p>Remember: <strong>thin membrane</strong>, <strong>large surface area</strong>, and <strong>rich blood supply</strong> are the three structural reasons gas exchange is so efficient at the alveolar level.</p>
        </ClinicalCallout>

        {/* Infant vs adult airway */}
        <h2 className="rs-section-title">Infant and Adult Airway Differences</h2>
        <table className="rs-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Infant</th>
              <th>Adult</th>
            </tr>
          </thead>
          <tbody>
            {infantAdultDifferences.map(([feature, infant, adult]) => (
              <tr key={feature}>
                <td>{feature}</td>
                <td>{infant}</td>
                <td>{adult}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Spirometry */}
        <h2 className="rs-section-title">Lung Volumes and Spirometry</h2>
        <table className="rs-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Term</th>
              <th>Definition</th>
              <th>Approximate value</th>
            </tr>
          </thead>
          <tbody>
            {spirometryRows.map(([term, definition, value]) => (
              <tr key={term}>
                <td>{term}</td>
                <td>{definition}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="rs-pearl" style={{ marginBottom: '32px' }}>
          <p className="rs-pearl-label">Clinical pearl</p>
          <p>Residual volume is the air that always stays behind after the biggest breath out you can do. That leftover air helps stop the lungs collapsing completely. You cannot measure it with standard spirometry alone.</p>
        </div>

        {/* Hypoxia types */}
        <h2 className="rs-section-title">Types of Hypoxia</h2>
        <table className="rs-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Mechanism</th>
              <th>Examples</th>
            </tr>
          </thead>
          <tbody>
            {hypoxiaTypes.map(([type, mechanism, examples]) => (
              <tr key={type}>
                <td>{type}</td>
                <td>{mechanism}</td>
                <td>{examples}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* V/Q mismatch */}
        <h2 className="rs-section-title">V/Q Mismatch</h2>
        <table className="rs-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Problem</th>
              <th>Mechanism</th>
              <th>Examples</th>
            </tr>
          </thead>
          <tbody>
            {vqExamples.map(([problem, mechanism, examples]) => (
              <tr key={problem}>
                <td>{problem}</td>
                <td>{mechanism}</td>
                <td>{examples}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Gas exchange failure */}
        <h2 className="rs-section-title">Why Gas Exchange Can Fail</h2>
        <table className="rs-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Problem</th>
              <th>What it means</th>
              <th>Examples</th>
            </tr>
          </thead>
          <tbody>
            {gasExchangeProblemRows.map(([problem, meaning, examples]) => (
              <tr key={problem}>
                <td>{problem}</td>
                <td>{meaning}</td>
                <td>{examples}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Common conditions */}
        <h2 className="rs-section-title">Common Respiratory Conditions</h2>
        <table className="rs-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Condition</th>
              <th>What&apos;s going on</th>
              <th>Key signs</th>
            </tr>
          </thead>
          <tbody>
            {conditionRows.map(([condition, pathophysiology, signs]) => (
              <tr key={condition}>
                <td>{condition}</td>
                <td>{pathophysiology}</td>
                <td>{signs}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="rs-pearl" style={{ marginBottom: '16px' }}>
          <p className="rs-pearl-label">Clinical pearl</p>
          <p>Do not examine the throat in suspected epiglottitis. It can trigger complete airway obstruction. Treat it as an emergency and get senior help immediately.</p>
        </div>

        {/* Bronchiolitis structured teaching block */}
        <ConditionCard
          title="Bronchiolitis"
          fields={[
            { key: 'What it is', value: 'Viral lower respiratory tract infection, most commonly caused by RSV, affecting infants under 12 months.' },
            { key: 'Pathophysiology', value: 'Inflammation, oedema, and mucus plug the bronchioles, trapping air and reducing ventilation. This creates a low V/Q mismatch and hypoxaemia.' },
            { key: 'Key signs', value: 'Coryzal prodrome, tachypnoea, recession, wheeze or crackles, poor feeding, apnoea in young infants.' },
            { key: 'Why children deteriorate', value: 'Narrow airways mean small amounts of swelling cause disproportionate obstruction. Higher metabolic rate depletes oxygen reserves faster. Immature immunity cannot clear the virus quickly.' },
            { key: 'Nursing implications', value: 'Supportive care: monitor SpO₂, ensure hydration (NG if needed), minimal handling, high-flow nasal cannula if required. No routine antibiotics or bronchodilators.' },
          ]}
        />

        <ClinicalCallout variant="redflag">
          <p>Apnoea can be the presenting sign of bronchiolitis in infants under 6 weeks. A baby who pauses breathing, even briefly, in the context of coryzal symptoms needs urgent assessment.</p>
        </ClinicalCallout>

        {/* Asthma severity */}
        <h2 className="rs-section-title">Paediatric Asthma Severity</h2>
        <table className="rs-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Severity</th>
              <th>Features</th>
              <th>SpO₂</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Mild–moderate', 'SpO₂ ≥92%, able to talk in sentences, RR and HR mildly raised, no cyanosis', '≥92%'],
              ['Severe', 'SpO₂ <92%, too breathless to complete sentences, RR >30 (>5 yr), HR >120, accessory muscle use', '<92%'],
              ['Life-threatening', 'Silent chest, cyanosis, poor respiratory effort, exhaustion, altered consciousness, SpO₂ <92% despite O₂', '<92% on O₂'],
            ].map(([sev, feat, spo2]) => (
              <tr key={sev}>
                <td>{sev}</td>
                <td>{feat}</td>
                <td>{spo2}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ClinicalCallout variant="exam">
          <p>A silent chest in a known asthmatic is a life-threatening emergency — it means air movement is so poor that wheeze has disappeared. Escalate immediately.</p>
        </ClinicalCallout>

        {/* PEWS */}
        <h2 className="rs-section-title">Paediatric Early Warning Score (PEWS)</h2>
        <p style={{ fontSize: '14px', fontWeight: 300, color: '#5A5750', lineHeight: 1.7, marginBottom: '16px' }}>
          PEWS is a structured scoring system used to detect early deterioration in children. It scores behaviour, cardiovascular, and respiratory components, then triggers a defined escalation response.
        </p>
        <table className="rs-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Score</th>
              <th>Meaning</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['0–2', 'Normal range', 'Continue observation per ward policy'],
              ['3–4', 'Caution — increased concern', 'Inform nurse in charge; increase frequency of observations'],
              ['5–6', 'Urgent — significant deterioration risk', 'Urgent medical review required'],
              ['≥7', 'Emergency — immediate risk', 'Immediate emergency response; call for senior help now'],
            ].map(([score, meaning, action]) => (
              <tr key={score}>
                <td>{score}</td>
                <td>{meaning}</td>
                <td>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ClinicalCallout variant="pearl">
          <p>Always document PEWS alongside observations. A rising trend — even within the &ldquo;normal&rdquo; range — is clinically significant and should be communicated to the team.</p>
        </ClinicalCallout>

        {/* Respiratory rates */}
        <h2 className="rs-section-title">Normal Respiratory Rates by Age</h2>
        <table className="rs-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Age</th>
              <th>Usual respiratory rate</th>
              <th>What to keep in mind</th>
            </tr>
          </thead>
          <tbody>
            {respiratoryRateRows.map(([age, rate, note]) => (
              <tr key={age}>
                <td>{age}</td>
                <td>{rate}</td>
                <td>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Work of breathing signs */}
        <h2 className="rs-section-title">Work of Breathing Signs</h2>
        <div className="rs-grid-2">
          {workOfBreathingSigns.map(([sign, meaning]) => (
            <div key={sign} className="rs-grid-2-cell">
              <p className="rs-grid-2-header">{sign}</p>
              <ul className="rs-col-list">
                <li>{meaning}</li>
              </ul>
            </div>
          ))}
        </div>

        {/* Oxygen delivery */}
        <h2 className="rs-section-title">Oxygen Delivery Methods</h2>
        <table className="rs-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
              <th>When used</th>
            </tr>
          </thead>
          <tbody>
            {oxygenMethods.map(([method, description, use]) => (
              <tr key={method}>
                <td>{method}</td>
                <td>{description}</td>
                <td>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Respiratory assessment table */}
        <h2 className="rs-section-title">Bedside Assessment Reference</h2>
        <table className="rs-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Assessment</th>
              <th>What it tells you</th>
              <th>Key points</th>
            </tr>
          </thead>
          <tbody>
            {assessmentRows.map(([assessment, meaning, points]) => (
              <tr key={assessment}>
                <td>{assessment}</td>
                <td>{meaning}</td>
                <td>{points}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="rs-pearl" style={{ marginBottom: '16px' }}>
          <p className="rs-pearl-label">Clinical pearl</p>
          <p>Infants have to suck, swallow, and breathe in a tight rhythm. If breathing gets harder, feeds often become stop-start. Coughing, pausing, short feeds, sweating, or tiring with feeds should make you reassess the breathing picture, not just the feeding chart.</p>
        </div>

        {/* Mnemonic recap */}
        <h2 className="rs-section-title">Quick Mnemonic Recap</h2>
        <div className="rs-golden" style={{ marginBottom: '40px' }}>
          {[
            { n: '01', title: 'Airway order', text: 'Never Phone Liam To Buy Brownies Always' },
            { n: '02', title: 'Inspiration', text: 'I EAT — External intercostals + diAphragm, acTive' },
            { n: '03', title: 'Boyle\u2019s law', text: 'Volume up, pressure down, air rushes in' },
            { n: '04', title: 'Alveolar cells', text: '1 is Thin, 2 is Goo' },
          ].map((cell) => (
            <div key={cell.n} className="rs-golden-cell">
              <span className="rs-golden-numeral">{cell.n}</span>
              <p className="rs-golden-title">{cell.title}</p>
              <p className="rs-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Quick-reference revision cards */}
        <h2 className="rs-section-title">Quick-Reference Revision Facts</h2>
        <QuickRefGrid items={[
          { title: 'Oxygen transport', text: '~98.5% bound to haemoglobin (4 O₂ per Hb molecule), ~1.5% dissolved in plasma.' },
          { title: 'CO₂ transport', text: '~70% as bicarbonate, ~23% bound to Hb, ~7% dissolved in plasma.' },
          { title: 'Normal V/Q ratio', text: '~0.8 overall. Ideally matched ventilation to perfusion for efficient gas exchange.' },
          { title: 'Why infants deteriorate faster', text: 'Narrower airways, higher O₂ consumption per kg, lower FRC, more compliant chest, and a diaphragm that tires quickly.' },
          { title: 'Signs of increased WOB', text: 'Nasal flaring, tracheal tug, subcostal/intercostal/sternal recession, head bobbing, grunting.' },
          { title: 'Target SpO₂ in children', text: '94–98% on room air. Aim ≥92% in bronchiolitis per NICE. Always assess alongside clinical picture.' },
        ]} />

        {/* Sentence bank */}
        <h2 className="rs-section-title">High-Scoring Exam Phrasing</h2>
        <SentenceBank sentences={[
          'Gas exchange occurs by passive diffusion down a partial pressure gradient across the respiratory membrane.',
          'In bronchiolitis, inflammation, oedema, and mucus narrow the bronchioles, reducing ventilation and causing a low V/Q mismatch.',
          'Infants are more vulnerable to respiratory compromise because they have narrower airways, higher oxygen demand, and less physiological reserve.',
          'Poiseuille\'s law tells us that halving the airway radius increases resistance sixteen-fold, explaining why small amounts of mucosal swelling cause disproportionate compromise in children.',
          'A silent chest on auscultation is an ominous sign indicating critically reduced air entry and should prompt immediate escalation.',
          'The oxygen-haemoglobin dissociation curve shifts right with increased CO₂, temperature, and acidosis, facilitating oxygen offloading to metabolically active tissues.',
        ]} />

        <ExpandableSection title="Deeper detail: Oxygen-Haemoglobin Dissociation Curve">
          <p style={{ fontSize: '12px', color: '#5A5750', fontWeight: 300, lineHeight: 1.65 }}>
            The curve describes how readily haemoglobin binds and releases oxygen at different partial pressures. A <strong>right shift</strong> (caused by increased CO₂, higher temperature, lower pH, or higher 2,3-DPG) means Hb releases oxygen more easily — helpful for active tissues. A <strong>left shift</strong> (caused by decreased CO₂, lower temperature, higher pH, or foetal haemoglobin) means Hb holds oxygen more tightly — useful for loading in the lungs and for foetal circulation.
          </p>
        </ExpandableSection>

        {/* Quiz */}
        <h2 className="rs-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Respiratory System & Assessment" questions={quizQuestions} />

        {/* Mock exam CTA */}
        <div style={{
          marginTop: '48px',
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(234,241,250,0.4) 0%, rgba(250,250,248,0.6) 100%)',
          border: '0.5px solid rgba(24,95,165,0.12)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ maxWidth: '520px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: 400, color: '#1A1815', marginBottom: '8px' }}>
              Test yourself: Respiratory Written Practice
            </h2>
            <p style={{ fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>
              Ready to apply what you have learned? Try a full exam-style mock with clinical scenarios, guided questions, and first-class answer support.
            </p>
          </div>
          <Link
            href="/hub/mocks/respiratory"
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#FAFAF8',
              background: '#1A1815',
              padding: '10px 20px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Start a mock &rarr;
          </Link>
        </div>

        <SourceLinks sources={[
          { citation: 'NICE (2021)', title: 'Bronchiolitis in children: diagnosis and management (NG9)', href: 'https://www.nice.org.uk/guidance/ng9' },
          { citation: 'BTS/SIGN (2022)', title: 'British Guideline on the Management of Asthma', href: 'https://brit-thoracic.org.uk/quality-improvement/guidelines/asthma/' },
          { citation: 'Resuscitation Council UK (2021)', title: '2021 Resuscitation Guidelines', href: 'https://www.resus.org.uk/library/2021-resuscitation-guidelines' },
          { citation: 'Waugh A & Grant A (2018)', title: 'Ross and Wilson Anatomy and Physiology in Health and Illness (13th edn)', href: 'https://www.elsevier.com/' },
          { citation: 'RCPCH (2020)', title: 'Paediatric Early Warning Systems', href: 'https://www.rcpch.ac.uk/' },
        ]} />
      </div>
    </div>
  );
}
