'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import LungsDiagram from '@/components/hub/LungsDiagram';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.tc-guide *, .tc-guide *::before, .tc-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.tc-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.tc-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

.tc-back {
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
.tc-back:hover { color: var(--ink-soft); }
.tc-back-arrow { font-style: normal; }

.tc-kicker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.tc-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.tc-year-pill {
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--purple-50);
  color: var(--purple-800);
}

.tc-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 52px;
  font-weight: 400;
  line-height: 1.1;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.tc-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.tc-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

.tc-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.tc-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.tc-golden-cell:last-child { border-right: none; }

.tc-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.tc-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.tc-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

.tc-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.tc-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.tc-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.tc-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.tc-step-content {
  padding-left: 32px;
}

.tc-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.tc-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

.tc-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.tc-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.tc-content-col:last-child { border-right: none; }

.tc-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.tc-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tc-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.tc-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

.tc-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.tc-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.tc-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

.tc-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.tc-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.tc-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.tc-section-title {
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

.tc-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.tc-table th {
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
.tc-table th:last-child { border-right: none; }

.tc-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.tc-table td:last-child { border-right: none; }
.tc-table tr:last-child td { border-bottom: none; }
.tc-table td:first-child { font-weight: 400; color: var(--ink-mid); }

.tc-letter-1 { color: var(--blue-600); }
.tc-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.tc-letter-2 { color: var(--teal-600); }
.tc-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.tc-letter-3 { color: var(--coral-600); }
.tc-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.tc-letter-4 { color: var(--purple-600); }
.tc-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.tc-letter-5 { color: var(--gray-600); }
.tc-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.tc-letter-6 { color: #8B5E3C; }
.tc-badge-6 { background: var(--surface-sunken); color: #6B4729; }

@media (max-width: 860px) {
  .tc-wrap { padding: 24px 20px 48px; }
  .tc-headline { font-size: 32px; }
  .tc-golden { grid-template-columns: repeat(2, 1fr); }
  .tc-golden-cell:nth-child(2) { border-right: none; }
  .tc-golden-cell:nth-child(1), .tc-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .tc-step { grid-template-columns: 64px 1fr; }
  .tc-step-letter { font-size: 48px; }
  .tc-content-grid { grid-template-columns: repeat(2, 1fr); }
  .tc-content-col:nth-child(2) { border-right: none; }
  .tc-content-col:nth-child(1), .tc-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
}

@media (max-width: 520px) {
  .tc-golden { grid-template-columns: 1fr; }
  .tc-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .tc-golden-cell:last-child { border-bottom: none; }
  .tc-content-grid { grid-template-columns: 1fr; }
  .tc-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .tc-content-col:last-child { border-bottom: none; }
  .tc-step { grid-template-columns: 52px 1fr; }
  .tc-step-letter { font-size: 38px; }
  .tc-step-content { padding-left: 18px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Why Children Obstruct Fast',
    question: 'What is actually different about a child’s airway that makes a tracheostomy higher-stakes?',
    cols: [
      {
        header: 'Structural differences',
        items: [
          'Large head, short neck, prominent occiput – poor positioning flexes the neck',
          'Large tongue – falls back and obstructs if consciousness is reduced',
          'High larynx at C3–C4 – more anterior, harder to visualise',
          'U-shaped epiglottis that falls posteriorly – easily obstructs',
        ],
      },
      {
        header: 'Why small changes matter',
        items: [
          'Narrow nasal passages, obligate nose breathing in infants',
          'Funnel-shaped, narrow airway throughout',
          'Small amounts of swelling/mucus cause a large rise in resistance',
          'The margin for error is small – deterioration can be fast',
        ],
      },
      {
        header: 'Positioning matters',
        items: [
          'A pillow under the head can flex the neck and worsen obstruction',
          'Shoulder support (not head support) often keeps the airway neutral',
          'Position needs reassessing as the child moves or tires',
        ],
      },
      {
        header: 'The clinical shortcut',
        items: [
          'When the airway is already small, tiny problems escalate quickly',
          'Swelling, secretions, wrong tube size, or displacement can all tip into emergency',
          'This is the same logic that makes tracheostomy care high-stakes',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Children are not small adults when it comes to airway anatomy. A large head, large tongue, high anterior larynx, and floppy epiglottis all narrow the margin for error – which is exactly why airway adjuncts and tracheostomies need such careful, precise management in children.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Airway Adjuncts: Guedel & NPA',
    question: 'When the airway needs help before or instead of a tracheostomy, what are the options?',
    cols: [
      {
        header: 'Guedel (oropharyngeal) airway',
        items: [
          'Sits in the mouth, stops the tongue falling back',
          'Measure: corner of mouth to angle of the mandible',
          'Only for reduced consciousness/airway reflexes',
          'Too awake = gagging, vomiting, aspiration, laryngospasm risk',
        ],
      },
      {
        header: 'Nasopharyngeal airway (NPA)',
        items: [
          'Passes through the nostril into the nasopharynx',
          'Measure: nose to the tragus of the ear',
          'Better tolerated when the gag reflex is present',
          'Avoid if a basal skull fracture is suspected',
        ],
      },
      {
        header: 'Sizing matters both ways',
        items: [
          'Too small: does not lift the tongue, doesn’t help',
          'Too large: pushes structures backward, causes trauma',
          'Reassess if the child becomes more alert and tries to remove it',
        ],
      },
      {
        header: 'Paediatric lens',
        items: [
          'Infants rely heavily on nasal breathing',
          'Anything placed through the nose can help – or narrow an already tiny passage',
          'Complications: blockage, dislodgement, bleeding, pressure injury',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
  {
    number: '3',
    colour: '3',
    name: 'Why a Tracheostomy & Tube Anatomy',
    question: 'What actually leads to a tracheostomy, and what do the parts of the tube do?',
    cols: [
      {
        header: 'Common indications',
        items: [
          'Airway stenosis or malacia (narrowed or floppy airway)',
          'Long-term ventilation needed (>16 hours/day)',
          'Burns, trauma, or a mass (cystic hygroma, haemangioma) distorting the airway',
          'Severe infection, or foreign body/inhalation injury',
        ],
      },
      {
        header: 'Where it sits',
        items: [
          'Surgical opening between the 3rd and 4th tracheal rings',
          'Bypasses upper airway problems – direct access to the trachea',
          'Also bypasses the body’s normal warming/filtering/humidifying system',
        ],
      },
      {
        header: 'The three key parts',
        items: [
          'Cannula: the tube itself, in the stoma – the actual airway channel',
          'Neck flanges: side wings, secured with tapes',
          'Hub: outer connector for oxygen/humidification/ventilation',
        ],
      },
      {
        header: 'If something goes wrong',
        items: [
          'Cannula blockage/displacement: airway can be lost quickly',
          'Loose tapes: dislodgement risk',
          'Tight tapes: skin/pressure damage',
          'Poor hub connection: interrupted oxygen/humidification/ventilation',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'A tracheostomy gives direct access to the trachea, which can be lifesaving – but it also means there is no upper airway "backup" the way there is in a child breathing normally. That trade-off is why tube security and patency are such a constant nursing focus.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Tube Types & Humidification',
    question: 'Why do different tube designs exist, and why is humidification described as a "hidden" safety intervention?',
    cols: [
      {
        header: 'Cuffed vs uncuffed',
        items: [
          'Cuffed: inflatable seal, supports positive pressure ventilation, reduces aspiration',
          'Too much cuff pressure: reduces tracheal blood flow, causes trauma/stenosis',
          'Uncuffed: common in young children, less pressure injury risk',
          'No cuff seal – tube position/tapes become even more important',
        ],
      },
      {
        header: 'Fenestrated & inner tube',
        items: [
          'Fenestrated: holes let air pass through vocal cords – supports voice',
          'Use a non-fenestrated inner tube before suctioning a fenestrated tube',
          'Inner tube: removable, cleaned regularly to clear secretion build-up',
          'Thick secretions may need inner tube cleaning every 2–4 hours',
        ],
      },
      {
        header: 'Why humidification matters',
        items: [
          'Normal airway warms, filters, and humidifies air – tracheostomy bypasses this',
          'Without it: thick secretions, poor ciliary function, blockage risk',
          'HME (heat and moisture exchanger): traps heat/moisture on exhale',
          'Wet ventilator circuits: active humidification for ventilated children',
        ],
      },
      {
        header: 'Practical safety points',
        items: [
          'Replace a dropped HME immediately – never reuse it',
          'Check tapes: roughly one to two fingers of space, secure not tight',
          'If unstable but tapes are secure: stabilise and escalate, don’t change tapes',
        ],
      },
    ],
    redFlags: ['Thick, tenacious secretions with reduced humidification', 'Tube blockage signs developing over hours'],
    pearl:
      'Humidification sounds like a comfort measure, but it is a genuine safety intervention. Without it, secretions thicken, cilia stop clearing them properly, and the tube itself can block – the single most dangerous tracheostomy complication.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Suctioning & Daily Care',
    question: 'Suctioning helps, so why is it also risky – and what does safe technique actually look like?',
    cols: [
      {
        header: 'Why suction is needed',
        items: [
          'Prevents airway obstruction from secretions',
          'Reduces effort of breathing',
          'Removes microbial contaminants, improves oxygenation',
          'Only when indicated – not routine/unnecessary',
        ],
      },
      {
        header: 'Suction risks',
        items: [
          'Hypoxia, trauma, granulation tissue, bleeding',
          'Cardiovascular changes, arrhythmias',
          'Pneumothorax, atelectasis, infection',
          'This is why depth, pressure, and timing are tightly controlled',
        ],
      },
      {
        header: 'Safe technique rules',
        items: [
          'Catheter size (French) = double the tube’s internal diameter',
          'Insert only to the prescribed depth – usually to the end of the tube',
          'Apply suction only while withdrawing',
          'Maximum 5–10 seconds; pressure should not exceed 30 mmHg',
        ],
      },
      {
        header: 'Daily care essentials',
        items: [
          'Cleaning: at least once daily, always a two-person procedure',
          'One person holds the tube while tapes are removed',
          'Tape changes: daily or when soiled – never during instability',
          'Document tape changes and any skin/tube concerns',
        ],
      },
    ],
    redFlags: ['Suctioning depth exceeding what is prescribed', 'Attempting a tape change in an unstable child'],
    pearl:
      'Suctioning removes secretions, but it also briefly interrupts airflow and stimulates the airway – which is exactly why it should never be routine. Only suction when there is a clear clinical indication, and reassess afterwards.',
  },
  {
    number: '6',
    colour: '6',
    name: 'Emergencies: Blocked or Displaced',
    question: 'The tube stops working – what do you actually do, in order?',
    cols: [
      {
        header: 'The two big emergencies',
        items: [
          'Blocked tube: secretions or a plug stop air moving',
          'Displaced tube: the tube has come out of the stoma',
          'Both mean the airway is not functioning – act fast',
        ],
      },
      {
        header: 'Emergency sequence',
        items: [
          '1. Call for help',
          '2. Ensure emergency equipment is nearby',
          '3. Give oxygen (via the tracheostomy)',
          '4. Attempt suction – if unsuccessful, change the tube',
        ],
      },
      {
        header: 'The critical safety question',
        items: [
          'Does this child have a patent upper airway without the tube?',
          'If yes: mouth/nose ventilation may work as a bridge',
          'If no: ventilation may need to go via the stoma directly',
          'Bedside documentation must state this clearly, in advance',
        ],
      },
      {
        header: 'What must be at the bedside',
        items: [
          'Same-size tube + one-size-smaller tube',
          'Scissors, tapes, dressing, gauze, saline, HME',
          'Suction catheters, disconnection wedge',
          'Suction machine travels with the child everywhere, including the playroom',
        ],
      },
    ],
    redFlags: ['Falling SpO₂ with rising work of breathing', 'No air movement felt/heard at the tube', 'Tube visibly displaced or partially out'],
    pearl:
      'With a tracheostomy child, always think "blocked tube vs displaced tube" first. Do not spend time describing the tube in detail – check whether air is moving, call for help, oxygenate, suction if appropriate, and prepare for an emergency tube change.',
  },
];

const airwayAnatomyRows = [
  { feature: 'Large head, short neck, prominent occiput', why: 'Positioning can flex the neck and obstruct the airway; may need shoulder support rather than head support.' },
  { feature: 'Large tongue', why: 'Can fall back and obstruct the airway, especially with reduced consciousness.' },
  { feature: 'High larynx (C3–C4)', why: 'More anterior and higher than in adults, making visualisation and airway manoeuvres different.' },
  { feature: 'U-shaped, posteriorly-falling epiglottis', why: 'More likely to obstruct and makes airway management technically harder.' },
  { feature: 'Narrow nasal passages, obligate nose breathing (infants)', why: 'Secretions, swelling, or tubes can significantly affect breathing and feeding.' },
  { feature: 'Funnel-shaped, narrow airway', why: 'Small amounts of swelling or mucus cause a disproportionately large rise in resistance.' },
];

const adjunctRows = [
  { adjunct: 'Guedel (oropharyngeal) airway', what: 'Sits in the mouth, holds space so the tongue cannot fall back.', caution: 'Only for reduced consciousness – if the child is too awake it can trigger gagging, vomiting, or laryngospasm. Care after oral, dental, tonsil/adenoid, or cleft-palate surgery.' },
  { adjunct: 'Nasopharyngeal airway (NPA)', what: 'Passes through the nostril into the nasopharynx, bypassing tongue/soft-palate obstruction.', caution: 'Avoid if basal skull fracture suspected. Paediatric nasal passages are small – wrong size/force risks bleeding or pressure injury.' },
];

const indicationRows = [
  { indication: 'Airway stenosis', mechanism: 'Airflow through the normal route is restricted, so bypassing the narrowed area can improve ventilation.' },
  { indication: 'Airway malacia', mechanism: 'The airway is floppy and collapses; the tracheostomy bypasses or supports the unstable section.' },
  { indication: 'Long-term ventilation (>16 hrs/day)', mechanism: 'Gives a more stable, secure route for ventilation than prolonged upper-airway tubes.' },
  { indication: 'Burns / trauma', mechanism: 'Secures breathing below damaged or swollen tissue if the upper airway is unsafe.' },
  { indication: 'Cystic hygroma / haemangioma', mechanism: 'Provides an alternate route for air if a mass narrows the normal airway.' },
  { indication: 'Infection / foreign body', mechanism: 'Protects ventilation if swelling or obstruction threatens the airway.' },
];

const tubeTypeRows = [
  { type: 'Cuffed tube', mechanism: 'Inflatable cuff seals the trachea, supporting positive pressure ventilation and reducing aspiration risk.', safety: 'Inflate to minimal occlusion volume – too high damages tracheal mucosa, too low allows leak/aspiration.' },
  { type: 'Uncuffed tube', mechanism: 'No cuff seal; common in young children, lower pressure-injury risk.', safety: 'No cuff seal means tube position and tapes are vital – easier to dislodge.' },
  { type: 'Fenestrated tube', mechanism: 'Holes allow air through the vocal cords, supporting voice.', safety: 'Insert a non-fenestrated inner tube before suctioning to avoid tissue damage.' },
  { type: 'Inner tube', mechanism: 'Removable inner liner, cleared of secretion build-up while the outer tube keeps the stoma open.', safety: 'Thick secretions may need cleaning every 2–4 hours; replacements must match exact type/size.' },
];

const suctionAgeRows = [
  { age: 'Preterm–1 month', tubeSize: '3.0', pressure: '8–10 mmHg' },
  { age: '0–3 years', tubeSize: '3.5–5.0', pressure: '10–12 mmHg' },
  { age: '3–10 years', tubeSize: '5.0–6.0', pressure: '12–15 mmHg' },
  { age: '10–16 years', tubeSize: '6.0–7.0', pressure: '15–30 mmHg' },
];

const emergencyBoxRows = [
  { item: 'Same-size tube', why: 'For a like-for-like planned or emergency change.' },
  { item: 'One-size-smaller tube', why: 'Used if the stoma is starting to close or the same size will not pass.' },
  { item: 'Scissors, tapes, dressing, gauze, saline', why: 'For securing, cleaning, and dressing the stoma during a change.' },
  { item: 'HME', why: 'Restores humidification immediately after a tube change.' },
  { item: 'Suction catheters', why: 'To clear the tube or assist guided reinsertion.' },
  { item: 'Disconnection wedge', why: 'Used to help disconnect ventilator tubing safely if needed.' },
];

const quizQuestions = [
  {
    question: 'Why can positioning a child’s head on a pillow worsen airway obstruction?',
    options: [
      'It has no effect on the airway',
      'A large head and short neck mean a pillow can flex the neck and narrow the airway – shoulder support is often better',
      'Pillows only affect adult airways',
      'It improves airway alignment in every case',
    ],
    answer: 1,
    explanation: 'Children’s large heads and short necks mean head-height support can flex the neck and worsen obstruction; shoulder support often keeps the airway more neutral.',
  },
  {
    question: 'What must be done before suctioning a fenestrated tracheostomy tube?',
    options: [
      'Nothing extra is needed',
      'Insert a non-fenestrated inner tube first, so the catheter does not pass through the hole and damage tissue',
      'Remove the outer tube completely',
      'Inflate the cuff fully',
    ],
    answer: 1,
    explanation: 'A non-fenestrated inner tube must be inserted before suctioning a fenestrated tracheostomy to prevent the catheter passing through the fenestration and causing tissue trauma.',
  },
  {
    question: 'Why is humidification described as a "hidden" but essential safety intervention?',
    options: [
      'It is only for patient comfort',
      'A tracheostomy bypasses the nose/upper airway that normally warms and humidifies air, so without it secretions thicken and the tube can block',
      'It has no effect on secretions',
      'It replaces the need for suctioning entirely',
    ],
    answer: 1,
    explanation: 'The tracheostomy bypasses the body’s normal humidifying system. Without added humidification, secretions become thick and sticky, cilia function poorly, and the tube itself can block.',
  },
  {
    question: 'What is the maximum recommended suction time and pressure from the lecture?',
    options: [
      '30–60 seconds, up to 60 mmHg',
      '5–10 seconds, not exceeding 30 mmHg',
      'No time limit as long as pressure is low',
      '1–2 minutes, at maximum pressure',
    ],
    answer: 1,
    explanation: 'Suctioning should take no longer than 5–10 seconds with pressure not exceeding 30 mmHg, applying suction only on withdrawal, to limit hypoxia and trauma risk.',
  },
  {
    question: 'A child with a tracheostomy suddenly desaturates and you cannot feel air movement at the tube. What is the first priority?',
    options: [
      'Document the finding and reassess in 10 minutes',
      'Call for help, then give oxygen, attempt suction, and prepare for an emergency tube change if suction fails',
      'Immediately remove the tube without assessment',
      'Wait for the tracheostomy-competent specialist before doing anything',
    ],
    answer: 1,
    explanation: 'The emergency sequence is: call for help, ensure equipment is available, give oxygen, attempt suction, and change the tube if suction is unsuccessful – acting fast because the airway is not functioning.',
  },
  {
    question: 'Why does bedside documentation need to state whether a child has a patent upper airway?',
    options: [
      'It is just a formality with no clinical use',
      'If the tube blocks or comes out, the team needs to know immediately whether mouth/nose ventilation could work as a bridge',
      'It only matters for discharge planning',
      'Upper airway patency is irrelevant once a tracheostomy is placed',
    ],
    answer: 1,
    explanation: 'If the tracheostomy tube fails, knowing whether the child has a usable upper airway tells the team immediately whether mouth/nose ventilation is a viable bridge while the tube is replaced.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TracheostomyCarePage() {
  return (
    <div className="tc-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="tc-wrap">
        <Link href="/hub/childrens" className="tc-back">
          <span className="tc-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        <div className="tc-kicker-row">
          <p className="tc-kicker">Nursing Process in Action &middot; Children&apos;s Nursing</p>
          <span className="tc-year-pill">Year 2</span>
        </div>
        <h1 className="tc-headline">Tracheostomy Care</h1>
        <p className="tc-standfirst">
          Airway adjuncts, why a child needs a tracheostomy, tube types, humidification, safe suctioning, and the blocked-vs-displaced-tube emergency that every tracheostomy nurse needs at their fingertips.
        </p>
        <p className="tc-byline">Children&apos;s nursing &middot; Year 2 &middot; The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="tracheostomy-care"
          hubItemTitle="Tracheostomy Care"
        />

        <div className="tc-pearl" style={{ marginBottom: '40px' }}>
          <p className="tc-pearl-label">Student note</p>
          <p>A stoma is the surgically created opening into the trachea. The cannula is the tube sitting in the stoma. Flanges are the side wings that hold the securing tapes. The hub is the outer connector for oxygen, humidification, or ventilator tubing. HME stands for heat and moisture exchanger. NPA here means nasopharyngeal airway (not to be confused with a nasopharyngeal aspirate sample).</p>
        </div>

        <LungsDiagram caption="The airway a tracheostomy bypasses and protects &mdash; trachea, bronchi and lungs" />

        <div className="tc-golden">
          {[
            { n: '01', title: 'Airway rule', text: 'Small airway + swelling/secretions = disproportionately large rise in resistance in children.' },
            { n: '02', title: 'Two emergencies', text: 'A tracheostomy fails in one of two ways: the tube is blocked, or the tube is displaced.' },
            { n: '03', title: 'Humidification rule', text: 'The tracheostomy bypasses the body’s natural humidifying system – add it back or secretions thicken and block the tube.' },
            { n: '04', title: 'Suction rule', text: 'Correct size, prescribed depth, suction only on withdrawal, max 5–10 seconds, ≤30 mmHg.' },
          ].map((cell) => (
            <div key={cell.n} className="tc-golden-cell">
              <span className="tc-golden-numeral">{cell.n}</span>
              <p className="tc-golden-title">{cell.title}</p>
              <p className="tc-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="tc-step">
            <div className="tc-step-sidebar">
              <span className={`tc-step-letter tc-letter-${section.colour}`}>{section.number}</span>
              <span className={`tc-step-badge tc-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="tc-step-content">
              <h2 className="tc-step-name">{section.name}</h2>
              <p className="tc-step-question">{section.question}</p>

              <div className="tc-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="tc-content-col">
                    <p className="tc-col-header">{col.header}</p>
                    <ul className="tc-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="tc-redflags-label">Red flags</p>
                  <div className="tc-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="tc-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="tc-pearl">
                  <p className="tc-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        <h2 className="tc-section-title">Paediatric Airway Anatomy Reference</h2>
        <table className="tc-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Why it matters clinically</th>
            </tr>
          </thead>
          <tbody>
            {airwayAnatomyRows.map((row) => (
              <tr key={row.feature}>
                <td>{row.feature}</td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="tc-section-title">Guedel vs NPA</h2>
        <table className="tc-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Adjunct</th>
              <th>What it does</th>
              <th>Key caution</th>
            </tr>
          </thead>
          <tbody>
            {adjunctRows.map((row) => (
              <tr key={row.adjunct}>
                <td>{row.adjunct}</td>
                <td>{row.what}</td>
                <td>{row.caution}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="tc-section-title">Why a Tracheostomy? Common Indications</h2>
        <table className="tc-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Indication</th>
              <th>Why a tracheostomy helps</th>
            </tr>
          </thead>
          <tbody>
            {indicationRows.map((row) => (
              <tr key={row.indication}>
                <td>{row.indication}</td>
                <td>{row.mechanism}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="tc-section-title">Tube Types Reference</h2>
        <table className="tc-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Tube type</th>
              <th>Mechanism</th>
              <th>Safety point</th>
            </tr>
          </thead>
          <tbody>
            {tubeTypeRows.map((row) => (
              <tr key={row.type}>
                <td>{row.type}</td>
                <td>{row.mechanism}</td>
                <td>{row.safety}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="tc-section-title">Suction Depth &amp; Pressure by Age</h2>
        <table className="tc-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Age</th>
              <th>Approx. tube size</th>
              <th>Suction pressure (from lecture slides)</th>
            </tr>
          </thead>
          <tbody>
            {suctionAgeRows.map((row) => (
              <tr key={row.age}>
                <td>{row.age}</td>
                <td>{row.tubeSize}</td>
                <td>{row.pressure}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="tc-pearl" style={{ marginBottom: '32px' }}>
          <p className="tc-pearl-label">Student note</p>
          <p>These figures are transcribed from lecture slides for revision purposes. Always check your local trust protocol and the child&apos;s own care plan before any real suctioning &mdash; this page does not replace clinical teaching or competency sign-off.</p>
        </div>

        <h2 className="tc-section-title">Emergency Tracheostomy Box</h2>
        <table className="tc-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Why it&apos;s there</th>
            </tr>
          </thead>
          <tbody>
            {emergencyBoxRows.map((row) => (
              <tr key={row.item}>
                <td>{row.item}</td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="tc-pearl" style={{ marginBottom: '32px' }}>
          <p className="tc-pearl-label">Clinical pearl</p>
          <p>The suction machine is not part of the emergency box, but it must travel with the child everywhere &mdash; including the playroom. The box itself should be checked at the start of every shift and before the child leaves the ward, with that check documented.</p>
        </div>

        <h2 className="tc-section-title">Quick Mnemonic Recap</h2>
        <div className="tc-golden" style={{ marginBottom: '40px' }}>
          {[
            { n: '01', title: 'Guedel vs NPA', text: 'Guedel = mouth, needs reduced consciousness. NPA = nose, better tolerated awake' },
            { n: '02', title: 'Cuffed vs uncuffed', text: 'Cuffed seals for ventilation/aspiration protection. Uncuffed common in young children' },
            { n: '03', title: 'Suction safety', text: 'Correct size → prescribed depth → suction on withdrawal only → 5–10 sec, ≤30 mmHg' },
            { n: '04', title: 'Emergency order', text: 'Call for help → oxygen → suction → change the tube if suction fails' },
          ].map((cell) => (
            <div key={cell.n} className="tc-golden-cell">
              <span className="tc-golden-numeral">{cell.n}</span>
              <p className="tc-golden-title">{cell.title}</p>
              <p className="tc-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        <h2 className="tc-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Tracheostomy Care" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'National Tracheostomy Safety Project (2025)', title: 'NTSP Manual and Paediatric Resuscitation Algorithm', href: 'https://www.tracheostomy.org.uk' },
          { citation: 'McQueen S, Bruce E & Gibson F (2012)', title: 'The Great Ormond Street Hospital Manual of Children’s Nursing Practices', href: 'https://www.wiley.com/' },
          { citation: 'Coyne I, Neill F & Timmins F (2010)', title: 'Clinical Skills in Children’s Nursing', href: 'https://global.oup.com/' },
          { citation: 'Watters KF (2017)', title: 'Tracheostomy in infants and children, Respiratory Care 62(6)', href: 'https://rc.rcjournal.com/' },
        ]} />
      </div>
    </div>
  );
}
