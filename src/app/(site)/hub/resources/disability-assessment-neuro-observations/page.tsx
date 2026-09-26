'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.da-guide *, .da-guide *::before, .da-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.da-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.da-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

.da-back {
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
.da-back:hover { color: var(--ink-soft); }
.da-back-arrow { font-style: normal; }

.da-kicker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.da-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.da-year-pill {
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--purple-50);
  color: var(--purple-800);
}

.da-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 50px;
  font-weight: 400;
  line-height: 1.1;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.da-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.da-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

.da-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.da-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.da-golden-cell:last-child { border-right: none; }

.da-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.da-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.da-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

.da-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.da-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.da-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.da-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.da-step-content {
  padding-left: 32px;
}

.da-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.da-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

.da-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.da-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.da-content-col:last-child { border-right: none; }

.da-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.da-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.da-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.da-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

.da-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.da-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.da-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

.da-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.da-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.da-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.da-section-title {
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

.da-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.da-table th {
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
.da-table th:last-child { border-right: none; }

.da-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.da-table td:last-child { border-right: none; }
.da-table tr:last-child td { border-bottom: none; }
.da-table td:first-child { font-weight: 400; color: var(--ink-mid); }

.da-letter-1 { color: var(--blue-600); }
.da-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.da-letter-2 { color: var(--teal-600); }
.da-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.da-letter-3 { color: var(--coral-600); }
.da-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.da-letter-4 { color: var(--purple-600); }
.da-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.da-letter-5 { color: var(--gray-600); }
.da-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.da-letter-6 { color: #8B5E3C; }
.da-badge-6 { background: var(--surface-sunken); color: #6B4729; }

@media (max-width: 860px) {
  .da-wrap { padding: 24px 20px 48px; }
  .da-headline { font-size: 30px; }
  .da-golden { grid-template-columns: repeat(2, 1fr); }
  .da-golden-cell:nth-child(2) { border-right: none; }
  .da-golden-cell:nth-child(1), .da-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .da-step { grid-template-columns: 64px 1fr; }
  .da-step-letter { font-size: 48px; }
  .da-content-grid { grid-template-columns: repeat(2, 1fr); }
  .da-content-col:nth-child(2) { border-right: none; }
  .da-content-col:nth-child(1), .da-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
}

@media (max-width: 520px) {
  .da-golden { grid-template-columns: 1fr; }
  .da-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .da-golden-cell:last-child { border-bottom: none; }
  .da-content-grid { grid-template-columns: 1fr; }
  .da-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .da-content-col:last-child { border-bottom: none; }
  .da-step { grid-template-columns: 52px 1fr; }
  .da-step-letter { font-size: 38px; }
  .da-step-content { padding-left: 18px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Nervous System Basics',
    question: 'What actually needs to be working for a child to be "neurologically normal"?',
    cols: [
      {
        header: 'The two systems',
        items: [
          'CNS: brain + spinal cord – the control centre and main pathway',
          'PNS: 12 cranial nerves, 31 spinal nerves, autonomic nerves',
          'PNS connects the CNS to sensory organs, muscles, vessels, organs',
        ],
      },
      {
        header: 'The autonomic nervous system',
        items: [
          'Runs the "life support systems" without conscious control',
          'Heart rate, BP, respiratory drive, pupils, sweating, digestion',
          'A neurological problem can show up across ABCDE, not just in the D box',
        ],
      },
      {
        header: 'Why cranial nerves matter',
        items: [
          'Pupils depend on cranial nerve + brainstem pathways',
          'Pupil checks are neurological checks, not just "eye checks"',
          'Facial movement, swallowing, gag reflex all tie back to specific nerves',
        ],
      },
      {
        header: 'Why the brain deteriorates',
        items: [
          'Needs constant oxygen, glucose, blood flow, safe pressure, normal signalling',
          'Head injury, raised ICP, hypoxia, hypoglycaemia, infection, shock, seizures all threaten this',
          'Assess the whole child – not every neuro sign means a primary brain problem',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Disability is never separate from the rest of ABCDE. A compromised airway, hypoxic breathing, poor circulation, or low glucose can all present as "neurological" signs – sleepiness, confusion, or reduced responsiveness – without any primary brain problem at all.',
  },
  {
    number: '2',
    colour: '2',
    name: 'AVPU: The Rapid Check',
    question: 'Before anything detailed, how do you get a fast read on consciousness?',
    cols: [
      {
        header: 'What AVPU stands for',
        items: [
          'Alert – spontaneously awake and responsive',
          'Voice – responds to verbal stimulation',
          'Pain – only responds to a painful stimulus',
          'Unresponsive – no response at all',
        ],
      },
      {
        header: 'Why it comes first',
        items: [
          'Quick, needs no equipment, usable by anyone',
          'A fast first read before a detailed GCS',
          'A change from Alert to Voice or below is a red flag on its own',
        ],
      },
      {
        header: 'What it does not tell you',
        items: [
          'Not detailed enough to show which part of function has changed',
          'Does not separate eye, verbal, and motor components',
          'GCS is needed for that level of detail',
        ],
      },
      {
        header: 'How to use it clinically',
        items: [
          'Use AVPU as the rapid screen in any A–E assessment',
          'Move to full GCS if AVPU is anything other than Alert',
          'Always compare with the child’s own baseline',
        ],
      },
    ],
    redFlags: ['Any drop from Alert to Voice, Pain, or Unresponsive'],
    pearl: null,
  },
  {
    number: '3',
    colour: '3',
    name: 'GCS: Eye, Verbal, Motor',
    question: 'Why does GCS separate into three scores instead of just one number?',
    cols: [
      {
        header: 'Eye opening (E4–E1)',
        items: [
          'E4 spontaneous → E3 to voice → E2 to pain → E1 none',
          '"C" if eyes are closed by swelling/bandage – do not score as poor response',
          'Shows whether enough arousal exists to open the eyes at all',
        ],
      },
      {
        header: 'Verbal response (V5–V1)',
        items: [
          'Older child: orientated → confused → inappropriate words → sounds → none',
          'Younger child: usual babble/words → irritable cry → cries to pain → moans → none',
          'Always compare with what carers say is usual for that child',
        ],
      },
      {
        header: 'Motor response (M6–M1)',
        items: [
          'M6 obeys commands/normal movement – most reassuring',
          'M5–M4: localises or withdraws to pain',
          'M3–M2: abnormal flexion or extension – serious',
          'M1: no response – emergency if new',
        ],
      },
      {
        header: 'Why the total score is not enough',
        items: [
          'A GCS of 14 could mean a fallen eye score OR a fallen motor score',
          'The pattern of change matters, not just the number',
          'Always report and document E, V, and M separately',
        ],
      },
    ],
    redFlags: ['New M1–M3 motor response', 'Falling GCS on repeat observation'],
    pearl:
      'Do not just say "GCS 14." Say what changed – eyes, verbal, or motor – and whether the trend is improving or worsening. That distinction is what separates a safe handover from a vague one.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Paediatric GCS: Under 5 vs Over 5',
    question: 'Why can’t you score a toddler the same way you score a teenager?',
    cols: [
      {
        header: 'The core problem',
        items: [
          'You cannot ask an 18-month-old orientation questions',
          'Paediatric GCS compares the child against their own developmental stage',
          'Eye opening scoring stays the same across all ages',
        ],
      },
      {
        header: 'Verbal response differs most',
        items: [
          'Under 5: alert/babbles/coos/words → irritable cry → cries to pain → moans → none',
          'Over 5: orientated → confused → inappropriate words → sounds → none',
          'Carers are often the only ones who know the child’s "usual" cry/interaction',
        ],
      },
      {
        header: 'Motor response also adapts',
        items: [
          'Under 5: normal spontaneous movement → withdraws to touch → withdraws to pain → flexion → extension → none',
          'Over 5: obeys commands → localises/withdraws → withdraws to pain → flexion → extension → none',
        ],
      },
      {
        header: 'Why this matters clinically',
        items: [
          'Missing the age adjustment can make a normal toddler look falsely concerning',
          'Or mask real deterioration by expecting adult-level responses',
          'Always ask: is this normal for this child, at this age?',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Parent and carer knowledge is not a "nice extra" in paediatric neuro observations – it is often essential data. They can tell you whether this cry, this level of interaction, or this amount of movement is usual for their child.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Pupils & Posturing',
    question: 'What do the eyes and the limbs reveal about what is happening deep in the brain?',
    cols: [
      {
        header: 'Assessing pupils',
        items: [
          'Check equal, then measure size before testing reactivity',
          'Measuring first avoids missing a baseline abnormality the light would mask',
          'Document size (mm), equality, and reaction (brisk/sluggish/non-reactive)',
        ],
      },
      {
        header: 'Why pupils matter',
        items: [
          'Pupil light reflex depends on cranial nerve + brainstem pathways',
          'New unequal or non-reactive pupils can mean pressure, swelling, or bleeding',
          'New unequal pupils after head injury are always urgent',
        ],
      },
      {
        header: 'Decorticate posturing',
        items: [
          'Abnormal flexion pattern',
          'Suggests serious neurological dysfunction',
          'Not a normal withdrawal-from-pain movement',
        ],
      },
      {
        header: 'Decerebrate posturing',
        items: [
          'Extension pattern: shoulders adducted, elbows extended, wrists hyperpronated',
          'Hips/knees extended, ankles plantar-flexed',
          'Often reflects more severe brain/brainstem involvement than decorticate',
        ],
      },
    ],
    redFlags: ['New unequal pupils', 'Non-reactive pupil', 'New decorticate or decerebrate posturing'],
    pearl:
      'Always measure pupil size before shining a light. If you test reactivity first, the light itself makes the pupil constrict – and you can miss whether it was already abnormal at rest.',
  },
  {
    number: '6',
    colour: '6',
    name: 'Blood Glucose & The Trend',
    question: 'Why is a finger-prick glucose one of the most important "neuro" checks you can do?',
    cols: [
      {
        header: 'Why glucose is part of disability',
        items: [
          'Normal range from the lecture: 4–8 mmol/L',
          'The brain depends heavily on glucose for energy',
          'Hypoglycaemia can look exactly like neurological deterioration',
        ],
      },
      {
        header: 'Hypoglycaemia signs',
        items: [
          'Shakiness, sweating, hunger, anxiety – stress hormone response',
          'Confusion or abnormal behaviour – can mimic distress',
          'Severe: seizures, loss of consciousness',
        ],
      },
      {
        header: 'Why it is reversible',
        items: [
          'Unlike many causes of neuro deterioration, hypoglycaemia is quickly treatable',
          'Missing it means missing an easy fix for a dangerous picture',
          'Always check glucose in any unexplained altered consciousness',
        ],
      },
      {
        header: 'Why the trend matters most',
        items: [
          'A GCS of 14 after a previous 15 is deterioration, even though 14 "sounds fine"',
          'Stable, improving, or deteriorating – that classification drives the action',
          'New posturing, new pupil change, or falling scores should never be ignored',
        ],
      },
    ],
    redFlags: ['Altered consciousness with unknown glucose', 'Any falling trend across repeated observations'],
    pearl:
      'A single neuro observation tells you a moment. Repeated observations tell you a story. The direction of travel – stable, improving, or deteriorating – usually matters more than any single score in isolation.',
  },
];

const cranialNerveRows = [
  { number: 'I', nerve: 'Olfactory', why: 'Smell.' },
  { number: 'II', nerve: 'Optic', why: 'Vision and part of the light reflex pathway.' },
  { number: 'III', nerve: 'Oculomotor', why: 'Eye movement and pupil constriction.' },
  { number: 'IV', nerve: 'Trochlear', why: 'Eye movement.' },
  { number: 'V', nerve: 'Trigeminal', why: 'Facial sensation and chewing.' },
  { number: 'VI', nerve: 'Abducens', why: 'Eye movement.' },
  { number: 'VII', nerve: 'Facial', why: 'Facial movement and expression.' },
  { number: 'VIII', nerve: 'Vestibulocochlear', why: 'Hearing and balance.' },
  { number: 'IX', nerve: 'Glossopharyngeal', why: 'Swallowing and gag reflex contribution.' },
  { number: 'X', nerve: 'Vagus', why: 'Autonomic control, heart rate, swallowing/voice.' },
  { number: 'XI', nerve: 'Spinal accessory', why: 'Shoulder and neck movement.' },
  { number: 'XII', nerve: 'Hypoglossal', why: 'Tongue movement.' },
];

const eyeOpeningRows = [
  { score: 'E4', meaning: 'Opens eyes spontaneously', why: 'Enough arousal to open eyes without stimulation.' },
  { score: 'E3', meaning: 'Opens eyes to voice', why: 'Reduced alertness – needs verbal stimulation.' },
  { score: 'E2', meaning: 'Opens eyes to pain', why: 'More concerning – needs a stronger stimulus.' },
  { score: 'E1', meaning: 'No eye opening even to pain', why: 'Significant reduction in responsiveness.' },
  { score: 'C', meaning: 'Eyes closed by swelling/bandage', why: 'Cannot be assessed normally – document as C, do not score as poor.' },
];

const paediatricGcsRows = [
  { area: 'Eyes', under5: 'E4 spontaneous, E3 to voice, E2 to pain, E1 none, C closed by swelling/bandage', over5: 'Same as under 5' },
  { area: 'Verbal', under5: 'V5 alert/babbles/coos/words to usual ability; V4 irritable cry; V3 cries to pain; V2 moans to pain; V1 none', over5: 'V5 orientated; V4 confused; V3 inappropriate words; V2 incomprehensible sounds; V1 none' },
  { area: 'Motor', under5: 'M6 normal spontaneous movement; M5 withdraws to touch; M4 withdraws to nail-bed pain; M3 flexion; M2 extension; M1 none', over5: 'M6 obeys commands; M5 localises/withdraws to pain; M4 withdraws to nail-bed pain; M3 flexion; M2 extension; M1 none' },
];

const posturingRows = [
  { posture: 'Decorticate', pattern: 'Abnormal flexion', meaning: 'Suggests serious neurological dysfunction; not a normal withdrawal movement.' },
  { posture: 'Decerebrate', pattern: 'Extension: shoulders adducted, elbows extended, wrists hyperpronated, hips/knees extended, ankles plantar-flexed', meaning: 'Often indicates more severe brain/brainstem involvement than decorticate.' },
];

const pupilRows = [
  { finding: 'Equal, reactive pupils', why: 'Both pupil pathways responding normally to light.', meaning: 'Reassuring alongside a reassuring overall assessment.' },
  { finding: 'Unequal pupils', why: 'One side of the pathway may be affected, or eye injury/drugs/pre-existing difference.', meaning: 'New unequal pupils after head injury are urgent.' },
  { finding: 'Sluggish reaction', why: 'The light reflex pathway is responding slowly.', meaning: 'May suggest neurological compromise.' },
  { finding: 'Non-reactive pupil', why: 'Pupil is not constricting to light at all.', meaning: 'Concerning if new, especially with reduced GCS.' },
];

const hypoglycaemiaRows = [
  { sign: 'Shakiness, sweating, hunger, anxiety', why: 'Stress hormones released to try to raise blood glucose.' },
  { sign: 'Fast or irregular heartbeat', why: 'Adrenaline response increases heart rate.' },
  { sign: 'Confusion or abnormal behaviour', why: 'The brain is not getting enough glucose for normal function.' },
  { sign: 'Visual disturbance', why: 'Low glucose can affect brain and visual processing.' },
  { sign: 'Seizures / loss of consciousness', why: 'Severe neuroglycopenia affects brain function dramatically – treat as an emergency.' },
];

const quizQuestions = [
  {
    question: 'What does AVPU assess, and why is it used before a full GCS?',
    options: [
      'It measures blood pressure trends over time',
      'It is a rapid consciousness screen (Alert, Voice, Pain, Unresponsive) used before a more detailed GCS assessment',
      'It replaces the need for GCS entirely',
      'It only applies to adult patients',
    ],
    answer: 1,
    explanation: 'AVPU is a fast, equipment-free way to screen consciousness. Anything other than Alert should prompt a full GCS assessment for more detail.',
  },
  {
    question: 'Why is paediatric GCS scored differently for a child under 5?',
    options: [
      'Younger children cannot be assessed at all',
      'Younger children cannot be assessed with adult-style orientation questions, so scoring is based on developmental ability, cry, sounds, and interaction',
      'The eye-opening scale is completely different under 5',
      'GCS is not used in children under 5',
    ],
    answer: 1,
    explanation: 'Under-5 GCS adapts the verbal and motor scales to developmental stage – using babble, cry, and spontaneous movement – since young children cannot answer orientation questions like older children or adults.',
  },
  {
    question: 'Why should you measure pupil size before shining a light into it?',
    options: [
      'It makes no difference to the assessment',
      'Shining the light first can make the pupil constrict, so you could miss whether it was already abnormal at rest',
      'The light must always come first per protocol',
      'Measuring after the light gives a more accurate reading',
    ],
    answer: 1,
    explanation: 'If the light reflex is tested before measuring size, the pupil may already be constricting, masking a baseline abnormality such as an already unequal or dilated pupil.',
  },
  {
    question: 'What distinguishes decerebrate from decorticate posturing?',
    options: [
      'Decerebrate is flexion, decorticate is extension',
      'Decorticate is abnormal flexion; decerebrate is an extension pattern often indicating more severe brain/brainstem involvement',
      'They are two names for the same posture',
      'Neither is a concerning finding',
    ],
    answer: 1,
    explanation: 'Decorticate posturing is abnormal flexion, while decerebrate posturing is an extension pattern that often reflects more severe brainstem involvement.',
  },
  {
    question: 'Why must blood glucose always be considered in a child with reduced consciousness?',
    options: [
      'It has no relevance to neurological status',
      'Hypoglycaemia can closely mimic neurological deterioration and is a reversible cause if caught quickly',
      'Glucose only matters in children with known diabetes',
      'It is only checked after all other causes are ruled out',
    ],
    answer: 1,
    explanation: 'The brain depends heavily on glucose, so hypoglycaemia can cause confusion, seizures, or loss of consciousness that looks just like primary neurological deterioration – but unlike many causes, it is quickly reversible if identified.',
  },
  {
    question: 'A child’s GCS is 14 today, having been 15 yesterday. What is the correct interpretation?',
    options: [
      'A GCS of 14 is always normal, so no action is needed',
      'This represents a deterioration from baseline, even though 14 might look reassuring in isolation',
      'The trend does not matter, only the absolute number',
      'GCS scores cannot be compared day to day',
    ],
    answer: 1,
    explanation: 'The trend matters more than a single score. A drop from a known baseline of 15 to 14 is deterioration and should prompt closer assessment, even though 14 alone might look reassuring.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DisabilityAssessmentPage() {
  return (
    <div className="da-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="da-wrap">
        <Link href="/hub/childrens" className="da-back">
          <span className="da-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        <div className="da-kicker-row">
          <p className="da-kicker">Nursing Process in Action &middot; Children&apos;s Nursing</p>
          <span className="da-year-pill">Year 2</span>
        </div>
        <h1 className="da-headline">Disability Assessment &amp; Neuro Observations</h1>
        <p className="da-standfirst">
          AVPU, paediatric GCS under vs over 5, pupils, decorticate vs decerebrate posturing, and why a finger-prick glucose can be the most important neuro check you do &mdash; the D in ABCDE, explained.
        </p>
        <p className="da-byline">Children&apos;s nursing &middot; Year 2 &middot; The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="disability-assessment-neuro-observations"
          hubItemTitle="Disability Assessment & Neuro Observations"
        />

        <div className="da-pearl" style={{ marginBottom: '40px' }}>
          <p className="da-pearl-label">Student note</p>
          <p>CNS is the brain and spinal cord; PNS is everything outside them (cranial nerves, spinal nerves, autonomic nerves). AVPU stands for Alert, Voice, Pain, Unresponsive. GCS is the Glasgow Coma Scale, scored across Eye, Verbal, and Motor responses. PERRL means pupils equal, round, and reactive to light.</p>
        </div>

        <div className="da-golden">
          {[
            { n: '01', title: 'Whole-child rule', text: 'Airway, breathing, and circulation problems can all present as "neurological" signs without a primary brain problem.' },
            { n: '02', title: 'AVPU first', text: 'Any drop from Alert prompts a full GCS – fast screen before detailed assessment.' },
            { n: '03', title: 'Report E, V, M', text: 'Never just say "GCS 14" – say which component changed and which direction the trend is going.' },
            { n: '04', title: 'Glucose rule', text: 'Hypoglycaemia can mimic neuro deterioration exactly – and it is reversible if caught fast.' },
          ].map((cell) => (
            <div key={cell.n} className="da-golden-cell">
              <span className="da-golden-numeral">{cell.n}</span>
              <p className="da-golden-title">{cell.title}</p>
              <p className="da-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="da-step">
            <div className="da-step-sidebar">
              <span className={`da-step-letter da-letter-${section.colour}`}>{section.number}</span>
              <span className={`da-step-badge da-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="da-step-content">
              <h2 className="da-step-name">{section.name}</h2>
              <p className="da-step-question">{section.question}</p>

              <div className="da-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="da-content-col">
                    <p className="da-col-header">{col.header}</p>
                    <ul className="da-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="da-redflags-label">Red flags</p>
                  <div className="da-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="da-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="da-pearl">
                  <p className="da-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        <h2 className="da-section-title">The 12 Cranial Nerves</h2>
        <table className="da-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Number</th>
              <th>Cranial nerve</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {cranialNerveRows.map((row) => (
              <tr key={row.number}>
                <td>{row.number}</td>
                <td>{row.nerve}</td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="da-section-title">Eye Opening (GCS)</h2>
        <table className="da-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Score</th>
              <th>Meaning</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {eyeOpeningRows.map((row) => (
              <tr key={row.score}>
                <td>{row.score}</td>
                <td>{row.meaning}</td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="da-section-title">Paediatric GCS: Under 5 vs Over 5</h2>
        <table className="da-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Response area</th>
              <th>Under 5 years</th>
              <th>Over 5 years</th>
            </tr>
          </thead>
          <tbody>
            {paediatricGcsRows.map((row) => (
              <tr key={row.area}>
                <td>{row.area}</td>
                <td>{row.under5}</td>
                <td>{row.over5}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="da-section-title">Decorticate vs Decerebrate Posturing</h2>
        <table className="da-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Posture</th>
              <th>Pattern</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {posturingRows.map((row) => (
              <tr key={row.posture}>
                <td>{row.posture}</td>
                <td>{row.pattern}</td>
                <td>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="da-section-title">Pupil Findings</h2>
        <table className="da-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Finding</th>
              <th>Why it can happen</th>
              <th>Assessment meaning</th>
            </tr>
          </thead>
          <tbody>
            {pupilRows.map((row) => (
              <tr key={row.finding}>
                <td>{row.finding}</td>
                <td>{row.why}</td>
                <td>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="da-section-title">Hypoglycaemia Signs</h2>
        <table className="da-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Sign</th>
              <th>Why it happens</th>
            </tr>
          </thead>
          <tbody>
            {hypoglycaemiaRows.map((row) => (
              <tr key={row.sign}>
                <td>{row.sign}</td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="da-pearl" style={{ marginBottom: '32px' }}>
          <p className="da-pearl-label">Case in practice</p>
          <p>Kiki, 18 months, is admitted with a head injury and a GCS of 14, needing observations every 30 minutes. At 3am her parents are quietly angry that she has just been woken again. The right response is not to skip the observation — it is to explain calmly why: after a head injury, changes in alertness, pupils, movement, or behaviour can be early signs that pressure or swelling is changing, and repeated checks are how that gets caught early.</p>
        </div>

        <h2 className="da-section-title">Quick Mnemonic Recap</h2>
        <div className="da-golden" style={{ marginBottom: '40px' }}>
          {[
            { n: '01', title: 'AVPU', text: 'Alert, Voice, Pain, Unresponsive – the rapid first screen' },
            { n: '02', title: 'GCS = E + V + M', text: 'Eye opening, Verbal response, Motor response – report separately' },
            { n: '03', title: 'Pupils: size first', text: 'Measure before testing reactivity, or the light masks a baseline abnormality' },
            { n: '04', title: 'Glucose check', text: 'Hypoglycaemia mimics neuro deterioration – and is reversible if caught fast' },
          ].map((cell) => (
            <div key={cell.n} className="da-golden-cell">
              <span className="da-golden-numeral">{cell.n}</span>
              <p className="da-golden-title">{cell.title}</p>
              <p className="da-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        <h2 className="da-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Disability Assessment & Neuro Observations" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'Teasdale G & Jennett B (1974)', title: 'Assessment of coma and impaired consciousness: a practical scale, The Lancet', href: 'https://www.thelancet.com/' },
          { citation: 'Resuscitation Council UK (2021)', title: '2021 Resuscitation Guidelines – paediatric assessment', href: 'https://www.resus.org.uk/library/2021-resuscitation-guidelines' },
          { citation: 'NICE (2023)', title: 'Head injury: assessment and early management (CG176)', href: 'https://www.nice.org.uk/guidance/cg176' },
          { citation: 'McQueen S, Bruce E & Gibson F (2012)', title: 'The Great Ormond Street Hospital Manual of Children’s Nursing Practices', href: 'https://www.wiley.com/' },
        ]} />
      </div>
    </div>
  );
}
