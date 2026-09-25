'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.prc-guide *, .prc-guide *::before, .prc-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.prc-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.prc-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

.prc-back {
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
.prc-back:hover { color: var(--ink-soft); }
.prc-back-arrow { font-style: normal; }

.prc-kicker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.prc-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.prc-year-pill {
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--purple-50);
  color: var(--purple-800);
}

.prc-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 50px;
  font-weight: 400;
  line-height: 1.1;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.prc-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.prc-prereq {
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
.prc-prereq:hover { color: var(--ink-strong); }

.prc-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

.prc-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.prc-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.prc-golden-cell:last-child { border-right: none; }

.prc-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.prc-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.prc-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

.prc-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.prc-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.prc-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.prc-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.prc-step-content {
  padding-left: 32px;
}

.prc-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.prc-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

.prc-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.prc-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.prc-content-col:last-child { border-right: none; }

.prc-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.prc-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.prc-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.prc-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

.prc-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.prc-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.prc-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

.prc-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.prc-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.prc-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.prc-section-title {
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

.prc-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.prc-table th {
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
.prc-table th:last-child { border-right: none; }

.prc-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.prc-table td:last-child { border-right: none; }
.prc-table tr:last-child td { border-bottom: none; }
.prc-table td:first-child { font-weight: 400; color: var(--ink-mid); }

.prc-letter-1 { color: var(--blue-600); }
.prc-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.prc-letter-2 { color: var(--teal-600); }
.prc-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.prc-letter-3 { color: var(--coral-600); }
.prc-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.prc-letter-4 { color: var(--purple-600); }
.prc-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.prc-letter-5 { color: var(--gray-600); }
.prc-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.prc-letter-6 { color: #8B5E3C; }
.prc-badge-6 { background: var(--surface-sunken); color: #6B4729; }

@media (max-width: 860px) {
  .prc-wrap { padding: 24px 20px 48px; }
  .prc-headline { font-size: 30px; }
  .prc-golden { grid-template-columns: repeat(2, 1fr); }
  .prc-golden-cell:nth-child(2) { border-right: none; }
  .prc-golden-cell:nth-child(1), .prc-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .prc-step { grid-template-columns: 64px 1fr; }
  .prc-step-letter { font-size: 48px; }
  .prc-content-grid { grid-template-columns: repeat(2, 1fr); }
  .prc-content-col:nth-child(2) { border-right: none; }
  .prc-content-col:nth-child(1), .prc-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
}

@media (max-width: 520px) {
  .prc-golden { grid-template-columns: 1fr; }
  .prc-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .prc-golden-cell:last-child { border-bottom: none; }
  .prc-content-grid { grid-template-columns: 1fr; }
  .prc-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .prc-content-col:last-child { border-bottom: none; }
  .prc-step { grid-template-columns: 52px 1fr; }
  .prc-step-letter { font-size: 38px; }
  .prc-step-content { padding-left: 18px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Why Children Deteriorate Fast',
    question: 'What is actually different about a child’s airway, not just its size?',
    cols: [
      {
        header: 'Upper airway differences',
        items: [
          'Larger tongue in proportion to the mouth',
          'Smaller pharynx – less room for swelling/secretions',
          'Floppier, larger epiglottis',
          'Larynx sits more anterior – harder to visualise/intubate',
        ],
      },
      {
        header: 'Lower airway & lung differences',
        items: [
          'Narrower airway diameter throughout',
          'Less rigid trachea – can collapse under pressure',
          'Fewer/underdeveloped alveoli – alveoli keep forming through childhood',
          'Less respiratory reserve overall',
        ],
      },
      {
        header: 'Positioning & behaviour',
        items: [
          'Larger head, poor head control in babies',
          'Neck flexion from poor positioning can compromise the airway',
          'Predominantly nasal breathing in young babies',
          'A blocked nose can seriously increase work of breathing and feeding difficulty',
        ],
      },
      {
        header: 'The physics that matters',
        items: [
          'Airway resistance rises sharply as radius falls (Poiseuille’s principle)',
          'A small amount of oedema or mucus in a narrow airway = big resistance jump',
          'This is why a child can look like they are coping, then suddenly tire',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'A tiny amount of airway swelling does far more damage in a child than in an adult, purely because the airway is already narrower. This single physics point explains why paediatric respiratory conditions can look deceptively stable right up until they are not.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Reading the Signs',
    question: 'What does each individual respiratory sign actually tell you about the mechanism?',
    cols: [
      {
        header: 'Effort signs',
        items: [
          'Recession: negative pressure pulls soft tissue in – breathing is hard work',
          'Tracheal tug: strong inspiratory effort pulling tissue around the trachea',
          'Nasal flaring: widening nostrils to reduce airway resistance',
          'Grunting: back-pressure to keep small airways/alveoli open – concerning',
        ],
      },
      {
        header: 'Sound signs',
        items: [
          'Wheeze: air squeezed through narrowed lower airways (asthma, bronchiolitis, CF)',
          'Stridor: air squeezed through a narrowed upper airway (croup, foreign body, epiglottitis)',
          'Crackles: small airways/alveoli popping open through fluid or mucus',
        ],
      },
      {
        header: 'Late/danger signs',
        items: [
          'Low SpO₂: oxygen not reaching or crossing into the blood effectively',
          'Silent chest: air entry so poor that wheeze disappears – not improvement',
          'Altered consciousness: brain affected by hypoxia, CO₂ retention, or exhaustion',
        ],
      },
      {
        header: 'The core reasoning chain',
        items: [
          'Airway swelling/mucus/infection/bronchoconstriction',
          '→ air movement or gas exchange affected',
          '→ increased work of breathing or hypoxia',
          '→ signs appear → A–E assessment → trend → escalate early',
        ],
      },
    ],
    redFlags: ['Silent chest', 'Reduced respiratory effort in a previously tachypnoeic child', 'Altered consciousness', 'Persistent hypoxia despite oxygen'],
    pearl:
      'A falling respiratory rate in a tiring child is not reassurance – it can mean exhaustion, not improvement. Always interpret rate alongside effort, not instead of it.',
  },
  {
    number: '3',
    colour: '3',
    name: 'Asthma',
    question: 'How does inflamed, reactive airway become a silent chest?',
    cols: [
      {
        header: 'The mechanism chain',
        items: [
          'Trigger exposure (exercise, pollen, smoke, vaping, infection)',
          'Mast cells activate → histamine/prostaglandins released',
          'Bronchoconstriction → wheeze as air is squeezed through',
          'Mucus increases → air trapping → fatigue and hypoxia',
        ],
      },
      {
        header: 'Severity: moderate vs severe',
        items: [
          'Moderate: SpO₂ ≥ 92%, PEF ≥ 50% best/predicted',
          'Severe: SpO₂ < 92%, PEF 33–50%, HR > 125, RR > 30, accessory muscle use',
          'Life-threatening: PEF < 33%, silent chest, poor effort, altered consciousness',
        ],
      },
      {
        header: 'Treatment ladder',
        items: [
          'Salbutamol – short-acting beta-2 agonist, relaxes airway muscle',
          'Ipratropium bromide – added in severe attacks',
          'Steroids – oral prednisolone or IV hydrocortisone, reduces inflammation (not instant)',
          'Escalation: IV magnesium sulfate, IV salbutamol, IV aminophylline',
        ],
      },
      {
        header: 'Before stepping up treatment',
        items: [
          'Check inhaler technique and adherence first',
          'Consider smoking/vaping, allergens, pollution, mould exposure',
          'Increasing medication will not fix a technique or environment problem',
        ],
      },
    ],
    redFlags: ['Silent chest', 'PEF < 33% predicted', 'Poor respiratory effort', 'Cyanosis or altered consciousness'],
    pearl:
      'Children can still die from asthma. Silent chest is not a sign the wheeze has resolved – it means airflow is so poor there is no longer enough movement to generate a sound. Treat it as a life-threatening emergency.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Bronchiolitis',
    question: 'Why does a viral chest infection in a baby become a feeding and breathing crisis together?',
    cols: [
      {
        header: 'The mechanism chain',
        items: [
          'Virus (commonly RSV) infects bronchiolar epithelium',
          'Oedema narrows tiny airways → tachypnoea, recession, nasal flaring',
          'Mucus and cell debris plug airways → crackles, wheeze, air trapping',
          'Feeding becomes unsafe → baby tires → apnoea risk in severe cases',
        ],
      },
      {
        header: 'Typical trajectory',
        items: [
          'Usually affects babies/children under 2',
          'Often peaks around days 3–5 of illness',
          'A baby unwell on day 1–2 may still get worse before better',
          'A baby on day 5 may be at or near the peak',
        ],
      },
      {
        header: 'Supportive management',
        items: [
          'Oxygen if SpO₂ falls below local threshold (often ~90–92%)',
          'HFNC/Optiflow – warmed, humidified high-flow, splints airways open',
          'CPAP – positive pressure, keeps small airways/alveoli open',
          'Suction/secretion management – babies rely heavily on nasal breathing',
        ],
      },
      {
        header: 'Why treatment is mainly supportive',
        items: [
          'It is viral – no routine antibiotics',
          'Not classic bronchoconstriction – salbutamol/steroids/ipratropium not routine',
          'NG feeds or IV fluids protect energy when feeding becomes exhausting',
          'Clustering cares lets the baby rest between interventions',
        ],
      },
    ],
    redFlags: ['Apnoea', 'Sleepy or floppy baby', 'Reduced feeding with dehydration signs', 'SpO₂ below local threshold despite oxygen'],
    pearl:
      'A young baby with bronchiolitis has to coordinate sucking, swallowing, and breathing while already fighting for air. Poor feeding is not a side issue – it is often the clearest early sign the baby is tiring.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Croup & Pneumonia',
    question: 'One is upper-airway swelling, one is alveolar infection – how do you tell them apart at the bedside?',
    cols: [
      {
        header: 'Croup mechanism',
        items: [
          'Usually viral, common under age 5, worse at night',
          'Swelling around larynx/trachea → barking cough, hoarse voice, stridor',
          'Agitation worsens obstruction – keeping the child calm matters clinically',
        ],
      },
      {
        header: 'Croup severity',
        items: [
          'Mild: barking cough, no stridor/recession at rest',
          'Moderate: stridor + recession at rest, no agitation/lethargy',
          'Severe: stridor + recession + agitation or lethargy',
          'Impending failure: fatigue, pallor/cyanosis, reduced consciousness',
        ],
      },
      {
        header: 'Pneumonia mechanism',
        items: [
          'Alveoli inflamed, fill with fluid/exudate',
          'Oxygen cannot cross into blood efficiently → low SpO₂',
          'Community-acquired, hospital-acquired, or aspiration pneumonia',
          'Likely organism shifts with age – viral in toddlers, Mycoplasma in school age',
        ],
      },
      {
        header: 'Pneumonia complications',
        items: [
          'Pleurisy, pleural effusion, lung abscess',
          'Sepsis and respiratory failure – this can become a circulation problem too',
          'Immunosuppressed children carry higher risk',
        ],
      },
    ],
    redFlags: ['Stridor at rest with agitation or lethargy (croup)', 'Reduced air entry with tachycardia/poor perfusion (pneumonia)', 'Signs of sepsis in either'],
    pearl:
      'Dexamethasone is given in croup regardless of severity because it reduces airway inflammation; nebulised adrenaline is added for severe cases as a temporary bridge while steroids take effect. In pneumonia, remember that treating the chest is not enough on its own – you are also watching for sepsis.',
  },
  {
    number: '6',
    colour: '6',
    name: 'Cystic Fibrosis',
    question: 'How does one faulty gene explain sticky secretions, salty sweat, and recurrent infection?',
    cols: [
      {
        header: 'The mechanism chain',
        items: [
          'Faulty CFTR gene (chromosome 7) disrupts chloride/sodium/water movement',
          'Secretions become dehydrated, thick, and sticky',
          'Mucociliary clearance fails → bacteria are not cleared properly',
          'Recurrent infection → airway damage → bronchiectasis over time',
        ],
      },
      {
        header: 'Genetics',
        items: [
          'Autosomal recessive inheritance',
          'Two carrier parents: 1 in 4 chance of an affected child',
          'Around 1 in 25 people may be unaffected carriers',
        ],
      },
      {
        header: 'Diagnosis & monitoring',
        items: [
          'UK newborn blood spot around day 5–8 screens for common mutations',
          'Sweat test: CFTR dysfunction raises sweat chloride concentration',
          'Ongoing monitoring: bone health, liver function, CF-related diabetes',
        ],
      },
      {
        header: 'Why sweat is salty',
        items: [
          'CFTR normally reabsorbs chloride/sodium in sweat glands',
          'When CFTR is faulty, this reabsorption fails',
          'More salt stays in the sweat – the basis of the diagnostic test',
        ],
      },
    ],
    redFlags: ['Acute exacerbation with falling lung function from baseline', 'New haemoptysis', 'Signs of CF-related diabetes decompensation'],
    pearl:
      'CF nursing is about baseline comparison, not just today’s numbers. A "mild" chest sounds very different from person to person – what matters is whether this child has changed from their own normal.',
  },
];

const airwayDifferenceRows = [
  { feature: 'Larger tongue (proportionally)', why: 'Can obstruct the airway more easily, especially with reduced consciousness.', see: 'Noisy breathing, obstruction, difficulty maintaining airway.' },
  { feature: 'Smaller pharynx', why: 'Less space for swelling or secretions.', see: 'Increased work of breathing, obstruction signs.' },
  { feature: 'Floppier, larger epiglottis', why: 'The upper airway can obstruct more easily.', see: 'Stridor, increased effort, distress.' },
  { feature: 'More anterior larynx', why: 'Airway positioning and intubation can be more difficult.', see: 'Need for careful airway support and early escalation.' },
  { feature: 'Narrower airway diameter', why: 'Small swelling causes a large increase in resistance.', see: 'Recession, tachypnoea, tiring, reduced air entry.' },
  { feature: 'Less rigid trachea', why: 'The airway can collapse more easily under pressure.', see: 'Increased work of breathing, noisy breathing, fatigue.' },
  { feature: 'Fewer/underdeveloped alveoli', why: 'Alveoli continue developing through childhood.', see: 'Less respiratory reserve, greater vulnerability.' },
];

const conditionComparisonRows = [
  { condition: 'Asthma', problem: 'Lower airway inflammation, bronchoconstriction, mucus plugging', signs: 'Wheeze, prolonged expiration, cough, reduced air entry, silent chest if severe', priority: 'Open airways, support oxygenation, bronchodilators/steroids, escalate if poor response' },
  { condition: 'Bronchiolitis', problem: 'Viral swelling, mucus, and debris in tiny bronchioles', signs: 'Wheeze/crackles, recession, nasal flaring, poor feeding, apnoea if severe', priority: 'Support breathing and hydration/feeding; oxygen, HFNC/CPAP, or fluids' },
  { condition: 'Croup', problem: 'Upper airway swelling around larynx/trachea', signs: 'Barking cough, hoarse voice, stridor, recession, worse at night', priority: 'Keep calm, avoid distress, dexamethasone, escalate/nebulised adrenaline if severe' },
  { condition: 'Pneumonia', problem: 'Alveoli inflamed and filled with fluid/exudate', signs: 'Fever, cough, crackles, hypoxia, reduced air entry, increased WOB', priority: 'Treat infection, support oxygenation/hydration, watch for sepsis' },
  { condition: 'Cystic fibrosis', problem: 'CFTR dysfunction – thick secretions, poor clearance', signs: 'Chronic cough, thick sputum, crackles/wheeze, recurrent infections', priority: 'Airway clearance, antibiotics when indicated, nutrition/enzymes, MDT, baseline comparison' },
];

const pneumoniaAgeRows = [
  { age: 'Neonates', organisms: 'Birth-canal organisms: group B streptococci, Klebsiella, E. coli, Listeria' },
  { age: 'Infants/toddlers (30 days–2 years)', organisms: 'Viral causes are common' },
  { age: '2–5 years', organisms: 'Respiratory viruses remain common; S. pneumoniae, H. influenzae type B may occur' },
  { age: '5–13 years', organisms: 'Mycoplasma pneumoniae often seen; S. pneumoniae remains important' },
  { age: 'Adolescents', organisms: 'Similar risks to adults; consider TB if exposure/background risk' },
];

const quizQuestions = [
  {
    question: 'Why does a small amount of airway swelling cause a much bigger problem in a child than an adult?',
    options: [
      'Children have more mucus glands than adults',
      'Children’s airways are already narrower, so small swelling causes a disproportionately large rise in resistance',
      'Children cannot compensate for any airway change',
      'This is not actually true – children and adults respond identically',
    ],
    answer: 1,
    explanation: 'Because resistance rises sharply as airway radius falls, a small amount of oedema or mucus causes a much bigger increase in resistance in an already-narrow paediatric airway.',
  },
  {
    question: 'What does a silent chest in a child with asthma actually mean?',
    options: [
      'The attack has resolved and no treatment is needed',
      'Airflow is so poor that there is not enough movement to generate a wheeze – a life-threatening sign',
      'The child is breathing normally and quietly',
      'It only occurs in mild asthma',
    ],
    answer: 1,
    explanation: 'Silent chest means airflow has become so severely restricted that wheeze can no longer be heard. It is a life-threatening sign of asthma, not an improvement.',
  },
  {
    question: 'Why is bronchiolitis usually managed supportively rather than with salbutamol or steroids?',
    options: [
      'Bronchiolitis is caused by bacteria, so it needs antibiotics instead',
      'The pathophysiology is viral oedema, mucus, and debris in tiny bronchioles, not classic bronchoconstriction',
      'Babies cannot tolerate any medication',
      'Salbutamol is too expensive to give routinely',
    ],
    answer: 1,
    explanation: 'Bronchiolitis is driven by viral inflammation, mucus, and debris rather than smooth-muscle bronchoconstriction, so bronchodilators and steroids do not usually help.',
  },
  {
    question: 'A child has a barking cough, stridor and recession at rest, but is not agitated or lethargic. What croup severity is this?',
    options: ['Mild', 'Moderate', 'Severe', 'Impending respiratory failure'],
    answer: 1,
    explanation: 'Stridor and recession present at rest, without agitation or lethargy, is classified as moderate croup.',
  },
  {
    question: 'Why can pneumonia become more than just a "breathing problem"?',
    options: [
      'It cannot – pneumonia only ever affects the lungs',
      'It can progress to sepsis and shock, affecting circulation and other organs',
      'Pneumonia always resolves without treatment',
      'It only affects premature babies',
    ],
    answer: 1,
    explanation: 'Pneumonia can progress to sepsis and respiratory failure, meaning it can become a circulation and whole-body problem, not just a respiratory one.',
  },
  {
    question: 'What is the underlying genetic mechanism in cystic fibrosis?',
    options: [
      'A viral infection that damages the airway permanently',
      'A faulty CFTR gene disrupts chloride/sodium/water movement, making secretions thick and sticky',
      'An autoimmune reaction against lung tissue',
      'A bacterial toxin that thickens mucus',
    ],
    answer: 1,
    explanation: 'CF is caused by a faulty CFTR gene that disrupts chloride, sodium, and water movement across cell membranes, leading to thick, dehydrated secretions and impaired mucociliary clearance.',
  },
  {
    question: 'Why is a sweat test used to help diagnose cystic fibrosis?',
    options: [
      'CFTR dysfunction impairs chloride/sodium reabsorption in sweat glands, so sweat chloride is higher',
      'Sweat testing measures lung function directly',
      'It detects antibodies against CFTR',
      'It has no real diagnostic value and is only historical',
    ],
    answer: 0,
    explanation: 'Because CFTR dysfunction reduces chloride and sodium reabsorption in sweat glands, sweat chloride concentration is higher in people with CF, which is the basis of the sweat test.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaediatricRespiratoryConditionsPage() {
  return (
    <div className="prc-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="prc-wrap">
        <Link href="/hub/childrens" className="prc-back">
          <span className="prc-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        <div className="prc-kicker-row">
          <p className="prc-kicker">Nursing Process in Action &middot; Children&apos;s Nursing</p>
          <span className="prc-year-pill">Year 2</span>
        </div>
        <h1 className="prc-headline">Common Respiratory Conditions: A Year 2 Deep Dive</h1>
        <p className="prc-standfirst">
          Why children&apos;s airways deteriorate fast, how to read wheeze vs stridor vs crackles, and asthma, bronchiolitis, croup, pneumonia, and cystic fibrosis compared by mechanism, signs, and nursing priority.
        </p>
        <Link href="/hub/resources/respiratory-system" className="prc-prereq">
          &larr; New to respiratory anatomy and A&ndash;E basics? Start with the Year 1 Respiratory System guide first.
        </Link>
        <p className="prc-byline">Children&apos;s nursing &middot; Year 2 &middot; The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="paediatric-respiratory-conditions"
          hubItemTitle="Common Respiratory Conditions: A Year 2 Deep Dive"
        />

        <div className="prc-pearl" style={{ marginBottom: '40px' }}>
          <p className="prc-pearl-label">Student note</p>
          <p>Recession means visible indrawing of soft tissue from increased work of breathing. Stridor is a harsh sound from upper airway narrowing; wheeze is from lower airway narrowing. CFTR is the gene/protein faulty in cystic fibrosis. HFNC means high-flow nasal cannula (e.g. Optiflow). A silent chest in asthma is an emergency, not an improvement.</p>
        </div>

        <div className="prc-golden">
          {[
            { n: '01', title: 'Physics rule', text: 'Resistance rises sharply as airway radius falls – small swelling, big effect in a child’s narrow airway.' },
            { n: '02', title: 'Sound rule', text: 'Stridor = upper airway. Wheeze = lower airway. Crackles = fluid/mucus popping alveoli open.' },
            { n: '03', title: 'Silent chest rule', text: 'No wheeze in a known asthmatic in distress is not better – it can mean airflow is almost gone.' },
            { n: '04', title: 'Trajectory rule', text: 'Bronchiolitis often peaks around day 3–5 – a "better" day 1 does not mean the illness has peaked yet.' },
          ].map((cell) => (
            <div key={cell.n} className="prc-golden-cell">
              <span className="prc-golden-numeral">{cell.n}</span>
              <p className="prc-golden-title">{cell.title}</p>
              <p className="prc-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="prc-step">
            <div className="prc-step-sidebar">
              <span className={`prc-step-letter prc-letter-${section.colour}`}>{section.number}</span>
              <span className={`prc-step-badge prc-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="prc-step-content">
              <h2 className="prc-step-name">{section.name}</h2>
              <p className="prc-step-question">{section.question}</p>

              <div className="prc-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="prc-content-col">
                    <p className="prc-col-header">{col.header}</p>
                    <ul className="prc-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="prc-redflags-label">Red flags</p>
                  <div className="prc-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="prc-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="prc-pearl">
                  <p className="prc-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        <h2 className="prc-section-title">Child Airway Differences Reference</h2>
        <table className="prc-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Why it matters</th>
              <th>What you may see</th>
            </tr>
          </thead>
          <tbody>
            {airwayDifferenceRows.map((row) => (
              <tr key={row.feature}>
                <td>{row.feature}</td>
                <td>{row.why}</td>
                <td>{row.see}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="prc-section-title">Condition Comparison at a Glance</h2>
        <table className="prc-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Condition</th>
              <th>Core problem</th>
              <th>Signs you may see/hear</th>
              <th>Nursing priority</th>
            </tr>
          </thead>
          <tbody>
            {conditionComparisonRows.map((row) => (
              <tr key={row.condition}>
                <td>{row.condition}</td>
                <td>{row.problem}</td>
                <td>{row.signs}</td>
                <td>{row.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="prc-section-title">Pneumonia: Likely Organisms by Age</h2>
        <table className="prc-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Age group</th>
              <th>Likely organisms/causes</th>
            </tr>
          </thead>
          <tbody>
            {pneumoniaAgeRows.map((row) => (
              <tr key={row.age}>
                <td>{row.age}</td>
                <td>{row.organisms}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="prc-pearl" style={{ marginBottom: '32px' }}>
          <p className="prc-pearl-label">Exam tip</p>
          <p>Don&apos;t stop at &ldquo;the child is wheezy&rdquo; or &ldquo;the saturations are low.&rdquo; Explain why using the condition&apos;s physiology: asthma is bronchoconstriction + inflammation + mucus; bronchiolitis is viral oedema + mucus + debris in tiny bronchioles; croup is upper-airway swelling; pneumonia is fluid/exudate in the alveoli; CF is thick secretions and poor clearance. Naming the mechanism is what separates a pass answer from a strong one.</p>
        </div>

        <h2 className="prc-section-title">Quick Mnemonic Recap</h2>
        <div className="prc-golden" style={{ marginBottom: '40px' }}>
          {[
            { n: '01', title: 'Sound = site', text: 'Stridor = upper airway. Wheeze = lower airway. Crackles = fluid/mucus in small airways/alveoli' },
            { n: '02', title: 'Asthma danger', text: 'Silent chest = emergency, not improvement' },
            { n: '03', title: 'Bronchiolitis', text: 'Mainly supportive care – oxygen, HFNC/CPAP, feeding support; no routine antibiotics/bronchodilators' },
            { n: '04', title: 'CF logic', text: 'Faulty CFTR → thick secretions → poor clearance → recurrent infection → bronchiectasis' },
          ].map((cell) => (
            <div key={cell.n} className="prc-golden-cell">
              <span className="prc-golden-numeral">{cell.n}</span>
              <p className="prc-golden-title">{cell.title}</p>
              <p className="prc-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        <h2 className="prc-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Common Respiratory Conditions" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'NICE (2021)', title: 'Asthma: diagnosis, monitoring and chronic asthma management (NG80)', href: 'https://www.nice.org.uk/guidance/ng80' },
          { citation: 'NICE (2015, updated 2021)', title: 'Bronchiolitis in children: diagnosis and management (NG9)', href: 'https://www.nice.org.uk/guidance/ng9' },
          { citation: 'NICE CKS', title: 'Croup – Clinical Knowledge Summary', href: 'https://cks.nice.org.uk/topics/croup/' },
          { citation: 'NICE (2011, reviewed)', title: 'Pneumonia in children – community-acquired: antimicrobial prescribing (NG138 and related CKS)', href: 'https://cks.nice.org.uk/topics/chest-infections-adult/' },
          { citation: 'Cystic Fibrosis Trust', title: 'CF standards of care and clinical guidelines', href: 'https://www.cysticfibrosis.org.uk/' },
        ]} />
      </div>
    </div>
  );
}
