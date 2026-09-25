'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.sh-guide *, .sh-guide *::before, .sh-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.sh-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.sh-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

.sh-back {
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
.sh-back:hover { color: var(--ink-soft); }
.sh-back-arrow { font-style: normal; }

.sh-kicker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.sh-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.sh-year-pill {
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--purple-50);
  color: var(--purple-800);
}

.sh-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.sh-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.sh-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

.sh-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.sh-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.sh-golden-cell:last-child { border-right: none; }

.sh-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.sh-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.sh-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

.sh-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.sh-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.sh-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.sh-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.sh-step-content {
  padding-left: 32px;
}

.sh-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.sh-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

.sh-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.sh-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.sh-content-col:last-child { border-right: none; }

.sh-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.sh-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sh-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.sh-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

.sh-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.sh-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.sh-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

.sh-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.sh-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.sh-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.sh-section-title {
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

.sh-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.sh-table th {
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
.sh-table th:last-child { border-right: none; }

.sh-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.sh-table td:last-child { border-right: none; }
.sh-table tr:last-child td { border-bottom: none; }
.sh-table td:first-child { font-weight: 400; color: var(--ink-mid); }

.sh-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.sh-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.sh-grid-2-cell:nth-child(2n) { border-right: none; }

.sh-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.sh-letter-1 { color: var(--blue-600); }
.sh-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.sh-letter-2 { color: var(--teal-600); }
.sh-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.sh-letter-3 { color: var(--coral-600); }
.sh-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.sh-letter-4 { color: var(--purple-600); }
.sh-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.sh-letter-5 { color: var(--gray-600); }
.sh-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.sh-letter-6 { color: #8B5E3C; }
.sh-badge-6 { background: var(--surface-sunken); color: #6B4729; }

@media (max-width: 860px) {
  .sh-wrap { padding: 24px 20px 48px; }
  .sh-headline { font-size: 34px; }
  .sh-golden { grid-template-columns: repeat(2, 1fr); }
  .sh-golden-cell:nth-child(2) { border-right: none; }
  .sh-golden-cell:nth-child(1), .sh-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .sh-step { grid-template-columns: 64px 1fr; }
  .sh-step-letter { font-size: 48px; }
  .sh-content-grid { grid-template-columns: repeat(2, 1fr); }
  .sh-content-col:nth-child(2) { border-right: none; }
  .sh-content-col:nth-child(1), .sh-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .sh-grid-2 { grid-template-columns: 1fr; }
  .sh-grid-2-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .sh-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .sh-golden { grid-template-columns: 1fr; }
  .sh-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .sh-golden-cell:last-child { border-bottom: none; }
  .sh-content-grid { grid-template-columns: 1fr; }
  .sh-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .sh-content-col:last-child { border-bottom: none; }
  .sh-step { grid-template-columns: 52px 1fr; }
  .sh-step-letter { font-size: 38px; }
  .sh-step-content { padding-left: 18px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'What Shock Actually Is',
    question: 'Why is shock about perfusion, not just blood pressure?',
    cols: [
      {
        header: 'The core problem',
        items: [
          'Shock = inadequate tissue perfusion for demand',
          'Cells stop receiving enough oxygen and nutrients',
          'Waste products (CO₂, lactate) stop being cleared',
          'Cells shift to anaerobic metabolism → acidosis',
        ],
      },
      {
        header: 'Supply vs demand',
        items: [
          'Supply: what the circulation delivers',
          'Demand: what the body needs (rises with illness/fever)',
          'Shock = supply cannot meet demand',
          'Demand rises fastest with infection, stress, injury',
        ],
      },
      {
        header: 'What oxygen delivery depends on',
        items: [
          'Oxygen in the blood: airway, breathing, SpO₂, Hb',
          'Blood volume: enough circulating fluid to fill the system',
          'Cardiac output: HR, stroke volume, preload, afterload',
          'Vessel tone: whether blood is directed to tissues well',
        ],
      },
      {
        header: 'Why it matters',
        items: [
          'Untreated, cells cannot make energy normally',
          'Lactate rises, acidosis worsens, organs start to fail',
          'A child can be seriously unwell before BP drops',
          'Early recognition changes outcome',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Shock is not "low blood pressure." It is inadequate tissue perfusion – and in children, blood pressure can stay normal for a surprisingly long time while the child is already compensating hard.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Compensated → Decompensated → Irreversible',
    question: 'What actually changes as shock progresses through each stage?',
    cols: [
      {
        header: 'Compensated',
        items: [
          'Body maintains BP by raising HR, constricting vessels',
          'Normal BP, tachycardia, delayed CRT, reduced urine output',
          'The window to catch deterioration before BP collapses',
          'Children rely on HR more than adults – watch it closely',
        ],
      },
      {
        header: 'Decompensated',
        items: [
          'Compensation is failing, hypoxia worsens',
          'Hypotension, anaerobic metabolism, worsening acidosis',
          'Renal failure/oedema may develop',
          'Late and life-threatening, especially in children',
        ],
      },
      {
        header: 'Irreversible',
        items: [
          'Multi-organ dysfunction, intractable acidosis',
          'Poor response to inotropes',
          'Damage may no longer be reversible',
          'The whole point of early recognition is never reaching this',
        ],
      },
      {
        header: 'Why hypotension is late',
        items: [
          'Children have smaller stroke volume reserve than adults',
          'They compensate mainly by raising heart rate',
          'BP can look normal while perfusion is already poor',
          'Persistent tachycardia in an unwell child is a real signal',
        ],
      },
    ],
    redFlags: ['Hypotension in a child', 'Reduced consciousness', 'Poor response to inotropes', 'Multi-organ dysfunction'],
    pearl:
      'Do not wait for low blood pressure before worrying. By the time a child is hypotensive, compensation has already failed – that is decompensated shock, not an early warning.',
  },
  {
    number: '3',
    colour: '3',
    name: 'Reading the Signs',
    question: 'Why does each individual sign of shock actually happen?',
    cols: [
      {
        header: 'Tachycardia',
        items: [
          'Heart beats faster to maintain cardiac output',
          'Do not dismiss as "just anxiety or pain"',
          'Always assess perfusion alongside it',
        ],
      },
      {
        header: 'Delayed CRT & cool skin',
        items: [
          'Peripheral vessels constrict, blood redirected centrally',
          'Blood is protecting vital organs, not the skin',
          'Weak pulses can mean reduced stroke volume/pressure',
        ],
      },
      {
        header: 'Reduced urine & altered mental state',
        items: [
          'Kidneys deprioritised → reduced urine output',
          'Brain receives less oxygen/glucose → confusion, drowsiness',
          'Always check glucose alongside a falling conscious level',
        ],
      },
      {
        header: 'Warm shock vs cold shock',
        items: [
          'Cold shock: cool, mottled, delayed CRT – vessels constricted',
          'Warm shock: warm, flushed, bounding pulses – vessels too relaxed',
          'Warm shock can occur early in septic/distributive shock',
          'Still serious – tissue perfusion can be inadequate either way',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Cold shock and warm shock look almost opposite at the bedside, but both mean the same underlying problem: blood is not reaching tissues effectively. Do not assume warm, flushed skin rules shock out.',
  },
  {
    number: '4',
    colour: '4',
    name: 'D NACHOS: The Seven Types',
    question: 'Why does knowing the shock type change what you do next?',
    cols: [
      {
        header: 'Distributive & neurogenic',
        items: [
          'Distributive: excessive vasodilation, poor blood distribution',
          'Neurogenic: loss of nervous system control of HR/BP/temp',
          'Includes septic, anaphylactic, and neurogenic shock',
        ],
      },
      {
        header: 'Anaphylactic & septic',
        items: [
          'Anaphylactic: histamine release, vasodilation, airway swelling',
          'Septic: infection-triggered inflammatory cascade',
          'Both cause vasodilation and capillary leak',
        ],
      },
      {
        header: 'Cardiogenic & hypovolaemic',
        items: [
          'Cardiogenic: the pump itself is failing',
          'Hypovolaemic: not enough circulating volume',
          'Be cautious with fluids in cardiogenic – can worsen overload',
        ],
      },
      {
        header: 'Obstructive',
        items: [
          'Mechanical block to flow into/out of the heart',
          'Tension pneumothorax, tamponade, massive PE',
          'Drugs/fluids alone cannot fix a mechanical obstruction',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'D NACHOS is not just a memory aid – it stops you treating every shock the same way. Hypovolaemic needs volume. Cardiogenic needs caution with fluids. Anaphylactic needs adrenaline. Septic needs antibiotics and support. Obstructive needs the obstruction physically relieved.',
  },
  {
    number: '5',
    colour: '5',
    name: 'A–E Assessment & Management',
    question: 'What do you actually check, and in what order, in a shocked child?',
    cols: [
      {
        header: 'A & B',
        items: [
          'Airway: patency, swelling, secretions, consciousness',
          'Breathing: RR, work of breathing, SpO₂, air entry',
          'If oxygen content is low, shock worsens regardless of cause',
        ],
      },
      {
        header: 'C & D',
        items: [
          'Circulation: HR, BP, CRT, pulses, skin, urine output',
          'Most shock signs appear here – perfusion is failing',
          'Disability: AVPU/GCS, glucose, agitation, drowsiness',
        ],
      },
      {
        header: 'E & the management sequence',
        items: [
          'Exposure: temperature, rash, bleeding, source of infection',
          'Act fast → identify type (D NACHOS) → full A–E',
          'Use the local guideline/escalation pathway',
        ],
      },
      {
        header: 'Initial treatments',
        items: [
          'Oxygen: improves blood oxygen content',
          'Fluids: raise preload if volume-depleted (caution: cardiogenic)',
          'Dextrose: corrects hypoglycaemia worsening consciousness',
          'Antibiotics: treat suspected sepsis; inotropes if fluids not enough',
        ],
      },
    ],
    redFlags: ['Stridor or airway swelling', 'SpO₂ falling despite oxygen', 'No response to fluid bolus', 'Falling conscious level'],
    pearl:
      'Shock management is dynamic, not a one-off checklist. After every intervention – oxygen, fluids, antibiotics, an inotrope change – repeat A–E and compare the trend. Improving HR, warmer skin, stronger pulses, more alert, and rising urine output are the signs you actually want to see.',
  },
  {
    number: '6',
    colour: '6',
    name: 'Inotropes & Vasoactive Drugs',
    question: 'When fluids are not enough, what do these drugs actually do?',
    cols: [
      {
        header: 'The vocabulary',
        items: [
          'Inotrope: alters heart contractility',
          'Chronotrope: raises heart rate',
          'Vasoconstrictor: narrows vessels, raises BP/resistance',
          'Vasodilator: widens vessels, can reduce cardiac workload',
        ],
      },
      {
        header: 'Adrenaline & noradrenaline',
        items: [
          'Adrenaline: beta effects (↑HR/contractility) at low dose, alpha (vasoconstriction) at higher dose',
          'Noradrenaline: potent vasoconstrictor, useful when vessels are too relaxed',
          'Watch for: tachyarrhythmias, reduced renal blood flow',
        ],
      },
      {
        header: 'Milrinone',
        items: [
          'Supports cardiac function and causes vasodilation',
          'Can help heart failure/cardiomyopathy',
          'Watch for: hypotension, since it also vasodilates',
        ],
      },
      {
        header: 'Safe administration',
        items: [
          'Start low, titrate slowly to cardiovascular signs',
          'Monitor HR/rhythm and perfusion continuously',
          'Change one infusion at a time – you need to know what worked',
          'Watch the child, not just the pump',
        ],
      },
    ],
    redFlags: ['New arrhythmia on an inotrope', 'Worsening hypotension on milrinone', 'Extravasation at the infusion site'],
    pearl:
      'If several infusions are changed together, you cannot tell which one caused an improvement or a problem. Titrating one drug at a time is what makes the response interpretable – and safe.',
  },
];

const bpFormulaRows = [
  { age: '1 year', formula: '1 × 2 + 70', value: '72 mmHg' },
  { age: '3 years', formula: '3 × 2 + 70', value: '76 mmHg' },
  { age: '5 years', formula: '5 × 2 + 70', value: '80 mmHg' },
  { age: '8 years', formula: '8 × 2 + 70', value: '86 mmHg' },
  { age: '10 years', formula: '10 × 2 + 70', value: '90 mmHg' },
];

const shockTypeRows = [
  { type: 'Distributive', problem: 'Excessive vasodilation, poor blood distribution', clue: 'Includes septic, anaphylactic, neurogenic' },
  { type: 'Neurogenic', problem: 'Loss of nervous system control of HR/BP/temperature', clue: 'Follows CNS, brain, or spinal cord injury' },
  { type: 'Anaphylactic', problem: 'Histamine release causing vasodilation, leak, airway swelling', clue: 'Rash, swelling, wheeze/stridor after exposure' },
  { type: 'Cardiogenic', problem: 'The heart pump itself fails', clue: 'Poor feeding, hepatomegaly, crackles – caution with fluids' },
  { type: 'Hypovolaemic', problem: 'Not enough circulating volume', clue: 'Bleeding, vomiting, diarrhoea, burns, dehydration' },
  { type: 'Obstructive', problem: 'Mechanical block to flow into/out of the heart', clue: 'Sudden deterioration, tamponade/pneumothorax clues' },
  { type: 'Septic', problem: 'Infection-triggered inflammatory cascade', clue: 'Fever or hypothermia, altered behaviour, poor perfusion' },
];

const inotropeRows = [
  { drug: 'Adrenaline', action: 'Beta effects (↑HR, contractility) at low dose; alpha (vasoconstriction) at higher dose', dose: '0.01–1.5 mcg/kg/min', watch: 'Tachyarrhythmias, ↑myocardial O₂ demand, ↓renal blood flow' },
  { drug: 'Noradrenaline', action: 'Alpha and beta-1 effects; potent vasoconstrictor', dose: '0.02–1 mcg/kg/min', watch: 'Excess vasoconstriction, perfusion, rhythm' },
  { drug: 'Milrinone', action: 'Supports cardiac function; causes vasodilation', dose: '0.3–1 mcg/kg/min', watch: 'Hypotension (from vasodilation)' },
];

const sepsisStepRows = [
  { step: 'Infection', what: 'A pathogen enters the body or bloodstream.' },
  { step: 'Cytokine release', what: 'Immune chemicals call more infection-fighting cells – helpful locally, dangerous if excessive body-wide.' },
  { step: 'Vasodilation', what: 'Blood vessels relax and widen; pressure falls.' },
  { step: 'Capillary leak', what: 'Fluid moves out of the bloodstream into tissues; effective circulating volume falls.' },
  { step: 'Poor perfusion', what: 'Organs receive less oxygenated blood; lactate may rise.' },
  { step: 'Organ dysfunction', what: 'Brain, kidneys, lungs, circulation, or clotting become affected – this is what makes sepsis life-threatening.' },
];

const caseRows = [
  { name: 'Annabel, age 3', story: 'Sudden fever, given diclofenac, rash 30 minutes later. HR 160, BP 78/40, SpO₂ 68%.', reasoning: 'Rash after drug exposure + hypoxia + hypotension → anaphylactic shock.', outcome: '15 minutes after IM adrenaline: HR 142, BP 106/52, SpO₂ 92%.' },
  { name: 'Jack, age 4', story: '5-day vomiting history, 2-day fever >39.5°C, represented drowsy and confused. HR 170, BP 90/50, SpO₂ 88%, RR 30.', reasoning: 'Fever + vomiting (volume loss) + tachycardia + drowsiness → likely septic/dehydration picture.', outcome: 'Priorities: repeat A–E, oxygen, sepsis/shock pathway, bloods/cultures/lactate, antibiotics, escalate early.' },
];

const quizQuestions = [
  {
    question: 'Why is a normal blood pressure not reassuring on its own in a possibly shocked child?',
    options: [
      'Children cannot develop hypotension',
      'Children compensate by raising heart rate and constricting vessels, so BP can stay normal while perfusion is already poor',
      'Blood pressure is not a real measurement in paediatrics',
      'Compensated shock does not exist in children',
    ],
    answer: 1,
    explanation: 'Children have less stroke volume reserve than adults and compensate mainly by raising heart rate, so BP can remain normal well into shock. Hypotension is a late, decompensated sign.',
  },
  {
    question: 'What does D NACHOS stand for?',
    options: [
      'Distributive, Neurogenic, Anaphylactic, Cardiogenic, Hypovolaemic, Obstructive, Septic',
      'Dehydration, Nausea, Anaemia, Cardiac, Hypoxia, Oedema, Sepsis',
      'Delayed, Normal, Acute, Chronic, Haemorrhage, Obstructed, Shock',
      'Distributive, Neonatal, Allergic, Cardiac, Haemorrhagic, Obstructive, Systemic',
    ],
    answer: 0,
    explanation: 'D NACHOS lists the seven shock types: Distributive, Neurogenic, Anaphylactic, Cardiogenic, Hypovolaemic, Obstructive, Septic – each needing a different first treatment.',
  },
  {
    question: 'Why should fluids be given cautiously in suspected cardiogenic shock?',
    options: [
      'Fluids are never used in any type of shock',
      'The heart pump is already failing, so extra fluid can worsen overload rather than improve output',
      'Cardiogenic shock always needs adrenaline instead',
      'Fluids only work in anaphylactic shock',
    ],
    answer: 1,
    explanation: 'In cardiogenic shock the problem is pump failure, not volume. Extra fluid can overload a failing heart rather than help it, so senior-led caution is needed.',
  },
  {
    question: 'What is the key difference between warm shock and cold shock?',
    options: [
      'Warm shock only happens in adults',
      'Cold shock shows vasoconstriction (cool, mottled, delayed CRT); warm shock shows vasodilation (warm, flushed, bounding pulses) – both mean poor perfusion',
      'Warm shock is never serious',
      'Cold shock means the child has a normal temperature',
    ],
    answer: 1,
    explanation: 'Cold shock reflects vessel constriction redirecting blood centrally; warm shock reflects vessels that are too relaxed. Both can mean inadequate tissue perfusion.',
  },
  {
    question: 'Why is noradrenaline often chosen over adrenaline in distributive/septic shock?',
    options: [
      'It has no cardiovascular effects at all',
      'It is a potent vasoconstrictor, useful when vessels are too relaxed and systemic vascular resistance is low',
      'It only affects the kidneys',
      'It is always safer than adrenaline in every situation',
    ],
    answer: 1,
    explanation: 'Noradrenaline’s alpha and beta-1 effects make it a potent vasoconstrictor, which addresses the low vascular resistance typical of distributive and septic shock.',
  },
  {
    question: 'Why change only one inotrope infusion at a time?',
    options: [
      'It is a hospital billing requirement',
      'Changing several at once makes it impossible to tell which drug caused an improvement or a problem',
      'Only one infusion pump is ever available',
      'It has no clinical reasoning behind it',
    ],
    answer: 1,
    explanation: 'Titrating one infusion at a time keeps the child’s response interpretable, so you can tell what is actually working and what might be causing harm.',
  },
  {
    question: 'In the sepsis physiology chain, what happens immediately after capillary leak?',
    options: [
      'Blood pressure rises sharply',
      'Effective circulating volume falls, reducing preload and perfusion',
      'The infection resolves on its own',
      'Heart rate falls to normal',
    ],
    answer: 1,
    explanation: 'As capillary permeability increases, fluid leaves the bloodstream into tissues, lowering effective circulating volume and therefore preload and perfusion.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShockRecognitionManagementPage() {
  return (
    <div className="sh-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="sh-wrap">
        <Link href="/hub/childrens" className="sh-back">
          <span className="sh-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        <div className="sh-kicker-row">
          <p className="sh-kicker">Nursing Process in Action &middot; Children&apos;s Nursing</p>
          <span className="sh-year-pill">Year 2</span>
        </div>
        <h1 className="sh-headline">Shock: Recognition &amp; Management</h1>
        <p className="sh-standfirst">
          Why shock is about perfusion, not blood pressure, how compensated shock tips into decompensated, the seven D NACHOS types, and what inotropes actually do when fluids are not enough.
        </p>
        <p className="sh-byline">Children&apos;s nursing &middot; Year 2 &middot; The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="shock-recognition-management"
          hubItemTitle="Shock: Recognition & Management"
        />

        <div className="sh-pearl" style={{ marginBottom: '40px' }}>
          <p className="sh-pearl-label">Student note</p>
          <p>Perfusion means blood actually reaching tissues. An inotrope changes how strongly the heart contracts. A chronotrope changes heart rate. A vasopressor narrows blood vessels to raise blood pressure. CRT is capillary refill time. D NACHOS is a mnemonic for the seven shock types: Distributive, Neurogenic, Anaphylactic, Cardiogenic, Hypovolaemic, Obstructive, Septic.</p>
        </div>

        <div className="sh-golden">
          {[
            { n: '01', title: 'Core definition', text: 'Shock = inadequate tissue perfusion for metabolic demand, not simply low blood pressure.' },
            { n: '02', title: 'BP formula', text: 'Lowest acceptable systolic BP = age in years × 2 + 70. A minimum threshold, not proof of good perfusion.' },
            { n: '03', title: 'Hypotension rule', text: 'Hypotension is a late sign in children – by the time it appears, compensation has already failed.' },
            { n: '04', title: 'Treatment rule', text: 'Treatment depends on the type: fluids, adrenaline, antibiotics, inotropes, or relieving an obstruction.' },
          ].map((cell) => (
            <div key={cell.n} className="sh-golden-cell">
              <span className="sh-golden-numeral">{cell.n}</span>
              <p className="sh-golden-title">{cell.title}</p>
              <p className="sh-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="sh-step">
            <div className="sh-step-sidebar">
              <span className={`sh-step-letter sh-letter-${section.colour}`}>{section.number}</span>
              <span className={`sh-step-badge sh-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="sh-step-content">
              <h2 className="sh-step-name">{section.name}</h2>
              <p className="sh-step-question">{section.question}</p>

              <div className="sh-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="sh-content-col">
                    <p className="sh-col-header">{col.header}</p>
                    <ul className="sh-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="sh-redflags-label">Red flags</p>
                  <div className="sh-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="sh-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="sh-pearl">
                  <p className="sh-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        <h2 className="sh-section-title">Lowest Acceptable Systolic BP</h2>
        <table className="sh-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Child&apos;s age</th>
              <th>Formula</th>
              <th>Lowest acceptable systolic BP</th>
            </tr>
          </thead>
          <tbody>
            {bpFormulaRows.map((row) => (
              <tr key={row.age}>
                <td>{row.age}</td>
                <td>{row.formula}</td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="sh-pearl" style={{ marginBottom: '32px' }}>
          <p className="sh-pearl-label">Exam tip</p>
          <p>This formula gives the lowest systolic pressure expected to maintain organ perfusion &mdash; it is a minimum safety threshold, not proof a child is well perfused. A child can be compensating and deteriorating well before they become hypotensive.</p>
        </div>

        <h2 className="sh-section-title">D NACHOS: Shock Types Compared</h2>
        <table className="sh-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Core problem</th>
              <th>Typical clue</th>
            </tr>
          </thead>
          <tbody>
            {shockTypeRows.map((row) => (
              <tr key={row.type}>
                <td>{row.type}</td>
                <td>{row.problem}</td>
                <td>{row.clue}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="sh-section-title">Inotropes &amp; Vasoactive Drugs</h2>
        <table className="sh-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Drug</th>
              <th>Main action</th>
              <th>Dose range (from lecture slides)</th>
              <th>Watch for</th>
            </tr>
          </thead>
          <tbody>
            {inotropeRows.map((row) => (
              <tr key={row.drug}>
                <td>{row.drug}</td>
                <td>{row.action}</td>
                <td>{row.dose}</td>
                <td>{row.watch}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="sh-pearl" style={{ marginBottom: '32px' }}>
          <p className="sh-pearl-label">Student note</p>
          <p>These figures are transcribed from lecture slides for revision purposes. Always check your local trust protocol and the current BNF for Children before any real administration &mdash; this page does not replace clinical teaching or prescribing guidance.</p>
        </div>

        <h2 className="sh-section-title">Sepsis: The Physiology Chain</h2>
        <table className="sh-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Step</th>
              <th>What is happening</th>
            </tr>
          </thead>
          <tbody>
            {sepsisStepRows.map((row) => (
              <tr key={row.step}>
                <td>{row.step}</td>
                <td>{row.what}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="sh-pearl" style={{ marginBottom: '32px' }}>
          <p className="sh-pearl-label">Clinical pearl</p>
          <p>Sepsis is not just &ldquo;a bad infection.&rdquo; It is what happens when the body&apos;s own response to infection becomes harmful: pathogen enters &rarr; immune response becomes excessive &rarr; vessels dilate and leak &rarr; perfusion falls &rarr; organs become hypoxic and dysfunctional. Septic shock is a type of distributive shock.</p>
        </div>

        <h2 className="sh-section-title">Case-Based Thinking</h2>
        <table className="sh-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Case</th>
              <th>Presentation</th>
              <th>Reasoning</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            {caseRows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.story}</td>
                <td>{row.reasoning}</td>
                <td>{row.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="sh-section-title">Quick Mnemonic Recap</h2>
        <div className="sh-golden" style={{ marginBottom: '40px' }}>
          {[
            { n: '01', title: 'D NACHOS', text: 'Distributive, Neurogenic, Anaphylactic, Cardiogenic, Hypovolaemic, Obstructive, Septic' },
            { n: '02', title: '3 stages', text: 'Compensated (normal BP) → decompensated (hypotensive) → irreversible (organ failure)' },
            { n: '03', title: 'Warm vs cold', text: 'Cold = vessels constricted (mottled, delayed CRT). Warm = vessels too relaxed (flushed, bounding)' },
            { n: '04', title: 'One at a time', text: 'Titrate one inotrope change at a time so the response stays interpretable' },
          ].map((cell) => (
            <div key={cell.n} className="sh-golden-cell">
              <span className="sh-golden-numeral">{cell.n}</span>
              <p className="sh-golden-title">{cell.title}</p>
              <p className="sh-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        <h2 className="sh-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Shock Recognition & Management" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'Resuscitation Council UK (2021)', title: '2021 Resuscitation Guidelines – paediatric shock and sepsis recognition', href: 'https://www.resus.org.uk/library/2021-resuscitation-guidelines' },
          { citation: 'NICE (2016, updated 2024)', title: 'Sepsis: recognition, diagnosis and early management (NG51)', href: 'https://www.nice.org.uk/guidance/ng51' },
          { citation: 'NICE (2011, updated 2019)', title: 'Anaphylaxis: assessment and referral after emergency treatment (CG134)', href: 'https://www.nice.org.uk/guidance/cg134' },
          { citation: 'BNF for Children', title: 'Current dosing guidance – always verify against the live BNFc before clinical use', href: 'https://bnfc.nice.org.uk/' },
        ]} />
      </div>
    </div>
  );
}
