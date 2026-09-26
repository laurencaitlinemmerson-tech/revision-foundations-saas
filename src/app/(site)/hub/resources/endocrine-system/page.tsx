'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.en-guide *, .en-guide *::before, .en-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.en-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.en-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

.en-back {
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
.en-back:hover { color: var(--ink-soft); }
.en-back-arrow { font-style: normal; }

.en-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.en-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.en-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.en-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

.en-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.en-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.en-golden-cell:last-child { border-right: none; }

.en-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.en-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.en-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

.en-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.en-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.en-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.en-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.en-step-content {
  padding-left: 32px;
}

.en-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.en-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

.en-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.en-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.en-content-col:last-child { border-right: none; }

.en-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.en-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.en-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.en-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

.en-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.en-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.en-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

.en-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.en-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.en-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.en-section-title {
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

.en-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.en-table th {
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
.en-table th:last-child { border-right: none; }

.en-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.en-table td:last-child { border-right: none; }
.en-table tr:last-child td { border-bottom: none; }
.en-table td:first-child { font-weight: 400; color: var(--ink-mid); }

.en-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.en-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.en-grid-2-cell:nth-child(2n) { border-right: none; }

.en-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

/* ── Diagram slot — leave room to drop in your own artwork ── */
.en-diagram-slot {
  border: 1px dashed var(--hairline-firm);
  background: var(--surface-sunken);
  padding: 32px 20px;
  margin-bottom: 32px;
  text-align: center;
}
.en-diagram-slot p {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin: 0;
}

.en-letter-1 { color: var(--blue-600); }
.en-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.en-letter-2 { color: var(--teal-600); }
.en-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.en-letter-3 { color: var(--coral-600); }
.en-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.en-letter-4 { color: var(--purple-600); }
.en-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.en-letter-5 { color: var(--gray-600); }
.en-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.en-letter-6 { color: #8B5E3C; }
.en-badge-6 { background: var(--surface-sunken); color: #6B4729; }

@media (max-width: 860px) {
  .en-wrap { padding: 24px 20px 48px; }
  .en-headline { font-size: 34px; }
  .en-golden { grid-template-columns: repeat(2, 1fr); }
  .en-golden-cell:nth-child(2) { border-right: none; }
  .en-golden-cell:nth-child(1), .en-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .en-step { grid-template-columns: 64px 1fr; }
  .en-step-letter { font-size: 48px; }
  .en-content-grid { grid-template-columns: repeat(2, 1fr); }
  .en-content-col:nth-child(2) { border-right: none; }
  .en-content-col:nth-child(1), .en-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .en-grid-2 { grid-template-columns: 1fr; }
  .en-grid-2-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .en-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .en-golden { grid-template-columns: 1fr; }
  .en-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .en-golden-cell:last-child { border-bottom: none; }
  .en-content-grid { grid-template-columns: 1fr; }
  .en-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .en-content-col:last-child { border-bottom: none; }
  .en-step { grid-template-columns: 52px 1fr; }
  .en-step-letter { font-size: 38px; }
  .en-step-content { padding-left: 18px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Endocrine Basics',
    question: 'How do glands "talk" to organs that are nowhere near them?',
    cols: [
      {
        header: 'What the system does',
        items: [
          'A network of glands releasing hormones into the blood',
          'Hormones travel to distant target organs/cells',
          'Controls growth, metabolism, reproduction, stress response',
          'Works alongside the nervous system, but acts more slowly',
        ],
      },
      {
        header: 'Major glands',
        items: [
          'Pituitary: the "master gland", controls other glands',
          'Thyroid: sets metabolic rate',
          'Adrenal glands: cortisol, adrenaline, stress response',
          'Pancreas: insulin and glucagon, blood glucose control',
        ],
      },
      {
        header: 'Negative feedback',
        items: [
          'Most hormone levels are self-correcting',
          'Hormone rises → triggers a response → hormone falls back',
          'Example: high blood glucose → insulin released → glucose falls',
          'This is the same feedback-loop pattern used everywhere in physiology',
        ],
      },
      {
        header: 'Why it matters clinically',
        items: [
          'Endocrine problems are often "too much" or "too little" hormone',
          'Signs are usually widespread, not localised to one organ',
          'Many conditions are lifelong and need ongoing monitoring',
          'Small dose/timing errors in replacement hormones can matter a lot',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Almost every endocrine topic comes back to the same shape: a gland releases a hormone, a target tissue responds, and the response feeds back to switch the signal off again. Spot that loop and most of this system becomes much easier to reason through.',
  },
  {
    number: '2',
    colour: '2',
    name: 'The Pancreas & Blood Glucose',
    question: 'What actually goes wrong in diabetes, and how are type 1 and type 2 different?',
    cols: [
      {
        header: 'Normal control',
        items: [
          'Insulin (beta cells): lowers blood glucose, lets it into cells',
          'Glucagon (alpha cells): raises blood glucose from stores',
          'The two work as a push-pull pair around a set point',
          'Both are released by the pancreas, an endocrine and digestive organ',
        ],
      },
      {
        header: 'Type 1 diabetes',
        items: [
          'Autoimmune destruction of insulin-producing beta cells',
          'Little or no insulin produced at all',
          'Usually presents in childhood/young adulthood',
          'Always needs insulin replacement – the body cannot make its own',
        ],
      },
      {
        header: 'Type 2 diabetes',
        items: [
          'Insulin resistance ± reduced insulin production over time',
          'Strongly linked to weight, activity, and genetics',
          'Usually develops gradually in adulthood',
          'May be managed with lifestyle change, tablets, and/or insulin',
        ],
      },
      {
        header: 'Why the distinction matters',
        items: [
          'Type 1 can never be managed on diet/tablets alone',
          'Missing insulin in type 1 risks DKA far faster than in type 2',
          'Type 2 has a much wider range of first-line treatments',
          'Both need patient education on hypo/hyperglycaemia recognition',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Type 1 is an insulin problem – the pancreas cannot make any. Type 2 is more often a resistance problem – the body stops responding well to the insulin it makes. That single distinction explains most of the differences in management you will be asked about.',
  },
  {
    number: '3',
    colour: '3',
    name: 'The Thyroid & Growth',
    question: 'What happens when the body’s metabolic "thermostat" is set too high or too low?',
    cols: [
      {
        header: 'What the thyroid does',
        items: [
          'Produces T3/T4, which set the body’s metabolic rate',
          'Affects heart rate, temperature, energy, growth, and mood',
          'Controlled by TSH from the pituitary (another feedback loop)',
        ],
      },
      {
        header: 'Hypothyroidism (underactive)',
        items: [
          'Fatigue, weight gain, cold intolerance, slow heart rate',
          'Dry skin, constipation, low mood',
          'In children: can affect growth and development if untreated',
        ],
      },
      {
        header: 'Hyperthyroidism (overactive)',
        items: [
          'Weight loss, heat intolerance, fast heart rate, tremor',
          'Anxiety, sweating, difficulty sleeping',
          'Graves’ disease is a common autoimmune cause',
        ],
      },
      {
        header: 'Growth hormone in children',
        items: [
          'Growth hormone (pituitary) drives height and tissue growth',
          'Deficiency: short stature, slow growth velocity',
          'Growth charts and growth velocity matter more than one measurement',
        ],
      },
    ],
    redFlags: ['Thyroid storm features (very high fever, severe tachycardia, confusion)', 'Myxoedema coma features (very low temperature, reduced consciousness)'],
    pearl:
      'A simple way to remember thyroid signs: hyperthyroidism speeds everything up (hot, fast, thin, anxious); hypothyroidism slows everything down (cold, slow, heavier, low mood). Matching signs to "sped up" or "slowed down" gets you most of the way to the right answer.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Adrenal Glands & Stress Response',
    question: 'What do the adrenal glands actually control, and what happens when they fail?',
    cols: [
      {
        header: 'What the adrenals do',
        items: [
          'Cortisol: the body’s main stress hormone, affects glucose/immunity',
          'Aldosterone: controls sodium/potassium and fluid balance',
          'Adrenaline/noradrenaline: fight-or-flight response',
        ],
      },
      {
        header: 'Addison’s disease (too little)',
        items: [
          'Adrenal cortex cannot make enough cortisol/aldosterone',
          'Fatigue, weight loss, low BP, salt craving, skin darkening',
          'An adrenal (Addisonian) crisis is a life-threatening emergency',
        ],
      },
      {
        header: 'Cushing’s syndrome (too much)',
        items: [
          'Excess cortisol, often from long-term steroid medication',
          'Weight gain (central), thin skin, easy bruising, high BP',
          'Can also come from a pituitary or adrenal tumour',
        ],
      },
      {
        header: 'Why steroid medication matters',
        items: [
          'Long-term steroids suppress the body’s own cortisol production',
          'Stopping steroids suddenly can trigger an adrenal crisis',
          'Steroid doses are often reduced gradually ("weaned"), not stopped abruptly',
          'Patients on long-term steroids carry a steroid alert card for this reason',
        ],
      },
    ],
    redFlags: ['Addisonian crisis: severe hypotension, collapse, vomiting', 'Abrupt steroid withdrawal in a long-term steroid patient'],
    pearl:
      'Never assume a long-term steroid dose can just be stopped. The adrenal glands stop making their own cortisol while external steroid is supplying it, so sudden withdrawal can be genuinely dangerous – this is a common safety point in medicines management teaching.',
  },
  {
    number: '5',
    colour: '5',
    name: 'DKA & Hypoglycaemia',
    question: 'What are the two opposite diabetes emergencies, and how do you tell them apart fast?',
    cols: [
      {
        header: 'Diabetic ketoacidosis (DKA)',
        items: [
          'Lack of insulin → body burns fat for fuel → ketones build up',
          'High blood glucose, ketones, and acidosis together',
          'Deep, rapid breathing (Kussmaul breathing), sweet/pear-drop breath',
          'Can develop faster and more severely in children than adults',
        ],
      },
      {
        header: 'DKA triggers',
        items: [
          'Missed or insufficient insulin doses',
          'Infection, illness, or physical stress increasing insulin need',
          'Can be the first presentation of previously undiagnosed diabetes',
        ],
      },
      {
        header: 'Hypoglycaemia (low glucose)',
        items: [
          'Too much insulin relative to glucose intake/activity',
          'Shaking, sweating, hunger, confusion, irritability',
          'Severe: reduced consciousness, seizures – needs urgent treatment',
        ],
      },
      {
        header: 'Why speed matters',
        items: [
          'DKA and severe hypoglycaemia can both be life-threatening',
          'They need opposite corrections – mixing them up is dangerous',
          'Blood glucose ± ketone testing is what actually tells them apart',
          'Always check glucose in any unexplained confusion in a known diabetic',
        ],
      },
    ],
    redFlags: ['Kussmaul breathing with high glucose', 'Reduced consciousness with known diabetes', 'Seizure in a known diabetic', 'Fruity/pear-drop smelling breath'],
    pearl:
      'DKA and hypoglycaemia can look superficially similar (both cause confusion and distress), but they need opposite treatment. That is exactly why a blood glucose check is one of the fastest, highest-value tests you can do in any confused patient with diabetes.',
  },
  {
    number: '6',
    colour: '6',
    name: 'Assessment & Nursing Priorities',
    question: 'What should you actually check, and how does this differ across ages?',
    cols: [
      {
        header: 'Bedside checks',
        items: [
          'Blood glucose (capillary) – quick, repeatable, essential',
          'Ketones (blood or urine) when DKA is suspected',
          'Vital signs: HR, RR, BP, temperature, consciousness',
          'Weight trend – useful in both diabetes and thyroid disease',
        ],
      },
      {
        header: 'Paediatric considerations',
        items: [
          'Children can decompensate into DKA faster than adults',
          'Growth and development are extra vitals to track over time',
          'Insulin doses are weight-based and reviewed often as children grow',
          'Family/carer education is central to day-to-day management',
        ],
      },
      {
        header: 'Adult considerations',
        items: [
          'Type 2 diabetes often coexists with cardiovascular risk factors',
          'Long-term steroid use is common – always check for it',
          'Older adults may have atypical or subtle hypo symptoms',
          'Polypharmacy increases the chance of drug interactions',
        ],
      },
      {
        header: 'Escalation triggers',
        items: [
          'Any suspected DKA – this needs urgent medical review',
          'Severe hypoglycaemia not responding to initial treatment',
          'Signs of adrenal or thyroid crisis',
          'New confusion in anyone with known endocrine disease',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Endocrine assessment often comes down to a small set of repeatable bedside checks – glucose, ketones, weight, and vital signs – read as a trend over time rather than a single reading. The trend usually tells you more than any one number.',
  },
];

const glandRows = [
  { gland: 'Pituitary', hormones: 'Growth hormone, TSH, ACTH, and others', role: 'The "master gland" – controls the activity of several other endocrine glands.' },
  { gland: 'Thyroid', hormones: 'T3, T4', role: 'Sets the body’s metabolic rate; affects heart rate, temperature, growth, and energy.' },
  { gland: 'Adrenal glands', hormones: 'Cortisol, aldosterone, adrenaline', role: 'Stress response, blood pressure and fluid balance, fight-or-flight response.' },
  { gland: 'Pancreas', hormones: 'Insulin, glucagon', role: 'Controls blood glucose – insulin lowers it, glucagon raises it.' },
  { gland: 'Parathyroid glands', hormones: 'Parathyroid hormone (PTH)', role: 'Regulates blood calcium levels, working with vitamin D.' },
];

const diabetesTypeRows = [
  { feature: 'Underlying cause', t1: 'Autoimmune destruction of insulin-producing beta cells', t2: 'Insulin resistance, often with reduced insulin production over time' },
  { feature: 'Typical onset', t1: 'Childhood or young adulthood, often rapid', t2: 'Adulthood, usually gradual' },
  { feature: 'Insulin production', t1: 'Little or none', t2: 'Present initially, may reduce over time' },
  { feature: 'First-line management', t1: 'Insulin replacement is always required', t2: 'Lifestyle change, tablets, and/or insulin depending on severity' },
  { feature: 'Risk of DKA', t1: 'Higher and can develop quickly if insulin is missed', t2: 'Lower, but can still occur, especially with illness' },
];

const thyroidRows = [
  { direction: 'Hypothyroidism (underactive)', signs: 'Fatigue, weight gain, cold intolerance, slow heart rate, dry skin, constipation, low mood.', cause: 'Autoimmune thyroiditis (Hashimoto’s) is a common cause.' },
  { direction: 'Hyperthyroidism (overactive)', signs: 'Weight loss, heat intolerance, fast heart rate, tremor, anxiety, sweating.', cause: 'Graves’ disease is a common autoimmune cause.' },
];

const dkaVsHypoRows = [
  { feature: 'Blood glucose', dka: 'High', hypo: 'Low' },
  { feature: 'Onset', dka: 'Develops over hours, sometimes faster in children', hypo: 'Can develop within minutes' },
  { feature: 'Breathing', dka: 'Deep, rapid (Kussmaul breathing)', hypo: 'Usually normal' },
  { feature: 'Breath odour', dka: 'Sweet, pear-drop/ketotic smell', hypo: 'No characteristic odour' },
  { feature: 'Skin', dka: 'Dry, flushed', hypo: 'Sweaty, pale' },
  { feature: 'Immediate priority', dka: 'Urgent medical review, fluids and insulin per protocol', hypo: 'Fast-acting glucose, recheck level, treat cause' },
];

const quizQuestions = [
  {
    question: 'What is the key underlying difference between type 1 and type 2 diabetes?',
    options: [
      'Type 1 is caused by insulin resistance, type 2 by autoimmune destruction of beta cells',
      'Type 1 is autoimmune destruction of insulin-producing cells; type 2 is mainly insulin resistance',
      'They are the same condition at different ages',
      'Type 2 always requires insulin from diagnosis',
    ],
    answer: 1,
    explanation: 'Type 1 diabetes results from autoimmune destruction of insulin-producing beta cells, meaning little or no insulin is made. Type 2 is mainly driven by insulin resistance, often with a later decline in insulin production.',
  },
  {
    question: 'Which set of signs best fits hyperthyroidism?',
    options: [
      'Weight gain, cold intolerance, slow heart rate',
      'Weight loss, heat intolerance, fast heart rate, tremor',
      'Low blood pressure and salt craving',
      'Central weight gain and thin skin',
    ],
    answer: 1,
    explanation: 'Hyperthyroidism speeds the body up: weight loss, heat intolerance, tachycardia, tremor, and anxiety are classic features.',
  },
  {
    question: 'Why can suddenly stopping long-term steroid medication be dangerous?',
    options: [
      'It has no real effect on the body',
      'The adrenal glands may have reduced their own cortisol production, so sudden withdrawal can trigger an adrenal crisis',
      'It always causes hyperthyroidism',
      'It only affects blood glucose, nothing else',
    ],
    answer: 1,
    explanation: 'Long-term steroid use suppresses the body’s own cortisol production. Stopping abruptly can leave the body without enough cortisol, risking a life-threatening adrenal crisis – doses are usually weaned instead.',
  },
  {
    question: 'Which combination of features points most clearly to DKA rather than hypoglycaemia?',
    options: [
      'Low blood glucose with sweating and hunger',
      'High blood glucose with deep rapid breathing and a pear-drop breath odour',
      'Normal blood glucose with confusion',
      'Low blood pressure with salt craving',
    ],
    answer: 1,
    explanation: 'DKA presents with high blood glucose, ketones, Kussmaul breathing, and a characteristic sweet/pear-drop breath odour from ketones – the opposite picture to hypoglycaemia.',
  },
  {
    question: 'Why is a blood glucose check one of the highest-value tests in a confused patient with known diabetes?',
    options: [
      'It is the only test nurses are allowed to perform',
      'Both DKA and severe hypoglycaemia can cause confusion but need opposite treatment, so glucose testing quickly distinguishes them',
      'Confusion in diabetics is never related to glucose',
      'It replaces the need for any other assessment',
    ],
    answer: 1,
    explanation: 'Because DKA (high glucose) and hypoglycaemia (low glucose) can both cause confusion but require opposite management, a fast glucose check is essential to avoid treating the wrong emergency.',
  },
  {
    question: 'Why might children decompensate into DKA faster than adults?',
    options: [
      'Children have more insulin reserve than adults',
      'Children have less physiological reserve, so illness and missed insulin can tip them into ketoacidosis more quickly',
      'DKA cannot occur in children',
      'Children’s pancreases produce more glucagon than adults’',
    ],
    answer: 1,
    explanation: 'Children generally have less physiological reserve, so missed insulin doses or intercurrent illness can lead to more rapid deterioration into DKA compared with adults.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function EndocrineSystemPage() {
  return (
    <div className="en-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="en-wrap">
        <Link href="/hub" className="en-back">
          <span className="en-back-arrow">&larr;</span>
          Nursing Hub
        </Link>

        <p className="en-kicker">Anatomy &amp; Physiology &middot; Children&apos;s &amp; Adult Nursing</p>
        <h1 className="en-headline">Endocrine System &amp; Assessment</h1>
        <p className="en-standfirst">
          Hormones, feedback loops, and the glands that run in the background &mdash; plus diabetes, thyroid disorders, and the endocrine emergencies that come up in both branches.
        </p>
        <p className="en-byline">Children&apos;s &amp; adult nursing &middot; The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="endocrine-system"
          hubItemTitle="Endocrine System & Assessment"
        />

        <div className="en-pearl" style={{ marginBottom: '40px' }}>
          <p className="en-pearl-label">Student note</p>
          <p>A hormone is a chemical messenger released into the blood by a gland, acting on a distant target tissue. Negative feedback means a hormone&apos;s own effect eventually switches its release back off. DKA stands for diabetic ketoacidosis. TSH, ACTH stand for thyroid-stimulating hormone and adrenocorticotropic hormone &mdash; both released by the pituitary to control other glands.</p>
        </div>

        <div className="en-golden">
          {[
            { n: '01', title: 'Feedback rule', text: 'Hormone rises → triggers a response → hormone falls back. Nearly every topic here uses this loop.' },
            { n: '02', title: 'Type 1 vs type 2', text: 'Type 1: no insulin made at all. Type 2: insulin resistance ± reduced production over time.' },
            { n: '03', title: 'Speed up vs slow down', text: 'Hyperthyroidism speeds the body up; hypothyroidism slows it down. Match signs to that direction.' },
            { n: '04', title: 'Glucose-check rule', text: 'DKA and hypoglycaemia can both cause confusion but need opposite treatment – check glucose fast.' },
          ].map((cell) => (
            <div key={cell.n} className="en-golden-cell">
              <span className="en-golden-numeral">{cell.n}</span>
              <p className="en-golden-title">{cell.title}</p>
              <p className="en-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="en-step">
            <div className="en-step-sidebar">
              <span className={`en-step-letter en-letter-${section.colour}`}>{section.number}</span>
              <span className={`en-step-badge en-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="en-step-content">
              <h2 className="en-step-name">{section.name}</h2>
              <p className="en-step-question">{section.question}</p>

              <div className="en-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="en-content-col">
                    <p className="en-col-header">{col.header}</p>
                    <ul className="en-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="en-redflags-label">Red flags</p>
                  <div className="en-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="en-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="en-pearl">
                  <p className="en-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        <h2 className="en-section-title">Major Endocrine Glands</h2>
        <table className="en-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Gland</th>
              <th>Key hormones</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {glandRows.map((row) => (
              <tr key={row.gland}>
                <td>{row.gland}</td>
                <td>{row.hormones}</td>
                <td>{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Diagram slot: a simple gland-location body diagram would sit nicely here */}
        <div className="en-diagram-slot">
          <p>Diagram slot &mdash; e.g. major endocrine glands on a body outline</p>
        </div>

        <h2 className="en-section-title">Type 1 vs Type 2 Diabetes</h2>
        <table className="en-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Type 1</th>
              <th>Type 2</th>
            </tr>
          </thead>
          <tbody>
            {diabetesTypeRows.map((row) => (
              <tr key={row.feature}>
                <td>{row.feature}</td>
                <td>{row.t1}</td>
                <td>{row.t2}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="en-section-title">Thyroid Disorders</h2>
        <table className="en-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Direction</th>
              <th>Signs</th>
              <th>Common cause</th>
            </tr>
          </thead>
          <tbody>
            {thyroidRows.map((row) => (
              <tr key={row.direction}>
                <td>{row.direction}</td>
                <td>{row.signs}</td>
                <td>{row.cause}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="en-section-title">DKA vs Hypoglycaemia</h2>
        <table className="en-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>DKA</th>
              <th>Hypoglycaemia</th>
            </tr>
          </thead>
          <tbody>
            {dkaVsHypoRows.map((row) => (
              <tr key={row.feature}>
                <td>{row.feature}</td>
                <td>{row.dka}</td>
                <td>{row.hypo}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Diagram slot: a simple side-by-side DKA vs hypo signs diagram would sit nicely here */}
        <div className="en-diagram-slot">
          <p>Diagram slot &mdash; e.g. DKA vs hypoglycaemia sign comparison</p>
        </div>

        <div className="en-pearl" style={{ marginBottom: '32px' }}>
          <p className="en-pearl-label">Clinical pearl</p>
          <p>If you are ever unsure whether a confused patient with diabetes is hyper- or hypoglycaemic, treat it as an emergency either way: check glucose immediately, follow local protocol, and escalate. Guessing wrong in either direction can cause real harm.</p>
        </div>

        <h2 className="en-section-title">Quick Mnemonic Recap</h2>
        <div className="en-golden" style={{ marginBottom: '40px' }}>
          {[
            { n: '01', title: 'Feedback loop', text: 'Gland releases hormone → target responds → response switches the signal back off' },
            { n: '02', title: 'Diabetes types', text: 'Type 1 = no insulin made. Type 2 = resistance ± reduced production' },
            { n: '03', title: 'Thyroid direction', text: 'Hyper = sped up (hot, fast, thin). Hypo = slowed down (cold, slow, heavier)' },
            { n: '04', title: 'Steroid safety', text: 'Never stop long-term steroids abruptly – wean to avoid an adrenal crisis' },
          ].map((cell) => (
            <div key={cell.n} className="en-golden-cell">
              <span className="en-golden-numeral">{cell.n}</span>
              <p className="en-golden-title">{cell.title}</p>
              <p className="en-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        <h2 className="en-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Endocrine System & Assessment" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'Waugh A & Grant A (2018)', title: 'Ross and Wilson Anatomy and Physiology in Health and Illness (13th edn)', href: 'https://www.elsevier.com/' },
          { citation: 'NICE (2015, updated 2023)', title: 'Diabetes (type 1 and type 2) in children and young people: diagnosis and management (NG18)', href: 'https://www.nice.org.uk/guidance/ng18' },
          { citation: 'NICE (2015, updated 2022)', title: 'Type 2 diabetes in adults: management (NG28)', href: 'https://www.nice.org.uk/guidance/ng28' },
          { citation: 'NICE CKS', title: 'Hypothyroidism and hyperthyroidism – Clinical Knowledge Summaries', href: 'https://cks.nice.org.uk/topics/hypothyroidism/' },
          { citation: 'BNF for Children', title: 'Current dosing guidance – always verify against the live BNFc before clinical use', href: 'https://bnfc.nice.org.uk/' },
        ]} />
      </div>
    </div>
  );
}
