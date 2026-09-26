'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.sz-guide *, .sz-guide *::before, .sz-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.sz-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.sz-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.sz-back {
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
.sz-back:hover { color: var(--ink-soft); }
.sz-back-arrow { font-style: normal; }

/* Masthead */
.sz-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.sz-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.sz-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.sz-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

/* Golden rules grid */
.sz-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.sz-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.sz-golden-cell:last-child { border-right: none; }

.sz-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.sz-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.sz-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.sz-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.sz-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.sz-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.sz-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.sz-step-content {
  padding-left: 32px;
}

.sz-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.sz-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

/* 4-column content grid */
.sz-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.sz-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.sz-content-col:last-child { border-right: none; }

.sz-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.sz-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sz-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.sz-col-list li::before {
  content: '\u2013';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

/* Red flags */
.sz-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.sz-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.sz-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.sz-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.sz-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.sz-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.sz-section-title {
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

/* Table */
.sz-table-wrap { overflow-x: auto; }
.sz-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.sz-table th {
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
.sz-table th:last-child { border-right: none; }

.sz-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.sz-table td:last-child { border-right: none; }
.sz-table tr:last-child td { border-bottom: none; }
.sz-table td:first-child { font-weight: 400; color: var(--ink-mid); }

/* 2-col grid */
.sz-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.sz-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.sz-grid-2-cell:nth-child(2n) { border-right: none; }

.sz-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

/* Step colour system */
.sz-letter-1 { color: var(--blue-600); }
.sz-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.sz-letter-2 { color: var(--teal-600); }
.sz-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.sz-letter-3 { color: var(--coral-600); }
.sz-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.sz-letter-4 { color: var(--purple-600); }
.sz-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.sz-letter-5 { color: var(--gray-600); }
.sz-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.sz-letter-6 { color: #8B5E3C; }
.sz-badge-6 { background: var(--surface-sunken); color: #6B4729; }

/* Flow path mono */
.sz-mono {
  font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 12px;
  color: var(--ink-soft);
  background: var(--surface-sunken);
  border: 0.5px solid var(--hairline-firm);
  padding: 16px;
  text-align: center;
  margin-bottom: 18px;
  line-height: 1.7;
}

/* Diagram */
.sz-diagram {
  border: 0.5px solid var(--hairline-firm);
  padding: 20px 16px 14px;
  margin-bottom: 18px;
  background: var(--surface-page);
}
.sz-diagram svg { display: block; width: 100%; height: auto; }
.sz-diagram-caption {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-align: center;
  margin-top: 10px;
}
.sz-diagram-key {
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.sz-diagram-key span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
}
.sz-diagram-key i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* Responsive */
@media (max-width: 860px) {
  .sz-wrap { padding: 24px 20px 48px; }
  .sz-headline { font-size: 34px; }
  .sz-golden { grid-template-columns: repeat(2, 1fr); }
  .sz-golden-cell:nth-child(2) { border-right: none; }
  .sz-golden-cell:nth-child(1), .sz-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .sz-step { grid-template-columns: 64px 1fr; }
  .sz-step-letter { font-size: 48px; }
  .sz-content-grid { grid-template-columns: repeat(2, 1fr); }
  .sz-content-col:nth-child(2) { border-right: none; }
  .sz-content-col:nth-child(1), .sz-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .sz-grid-2 { grid-template-columns: 1fr; }
  .sz-grid-2-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .sz-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .sz-golden { grid-template-columns: 1fr; }
  .sz-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .sz-golden-cell:last-child { border-bottom: none; }
  .sz-content-grid { grid-template-columns: 1fr; }
  .sz-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .sz-content-col:last-child { border-bottom: none; }
  .sz-step { grid-template-columns: 52px 1fr; }
  .sz-step-letter { font-size: 38px; }
  .sz-step-content { padding-left: 18px; }
}
/* ── Polish layer ───────────────────────────────────────────── */
.sz-kicker { color: var(--gold-deep, #8a7350); }
.sz-headline { font-size: 60px; }
.sz-byline { border-bottom: none; padding-bottom: 6px; margin-bottom: 0; }
.sz-pulse { display: block; width: 100%; height: 40px; margin-bottom: 40px; overflow: visible; }
.sz-pulse path { stroke: var(--gold, #cbae78); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; animation: sz-pulse-draw 2.6s ease-out 0.3s forwards; }
@keyframes sz-pulse-draw { to { stroke-dashoffset: 0; } }
.sz-golden { gap: 14px; border: none; }
.sz-golden-cell { border: 0.5px solid var(--hairline-firm); border-radius: 2px; background: var(--surface-page); transition: transform 0.2s ease, border-color 0.2s ease; }
.sz-golden-cell:last-child { border-right: 0.5px solid var(--hairline-firm); }
.sz-golden-cell:hover { transform: translateY(-2px); border-color: var(--gold); }
.sz-golden-numeral { color: var(--gold); font-size: 34px; }
.sz-section-title { border: none; padding: 18px 0 0; margin-top: 56px; font-size: 28px; position: relative; }
.sz-section-title::before { content: ''; position: absolute; top: 0; left: 0; width: 44px; height: 3px; border-radius: 999px; background: var(--gold); }
.sz-content-grid, .sz-table { border-radius: 2px; }
.sz-content-grid { overflow: hidden; border-color: var(--hairline-firm); }
.sz-table { border-collapse: separate; border-spacing: 0; overflow: hidden; border-color: var(--hairline-firm); }
.sz-table th { background: transparent; color: var(--gold-deep, #8a7350); border-bottom-color: var(--hairline-firm); }
.sz-table td { padding: 13px 16px; line-height: 1.65; }
.sz-table td:first-child { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; color: var(--ink-strong); }
.sz-table tbody tr:nth-child(even) td { background: rgba(203, 174, 120, 0.06); }
.sz-table tbody tr:hover td { background: rgba(203, 174, 120, 0.14); }
.sz-step { border-top-color: var(--hairline-soft); }
.sz-step-letter { text-shadow: none; }
.sz-step-name { font-size: 34px; }
.sz-step-badge, .sz-red-pill { border-radius: 999px; }
.sz-pearl { background: transparent; border: 0.5px solid var(--hairline-firm); border-left: 3px solid var(--gold); border-radius: 2px; padding: 18px 24px; }
.sz-pearl-label { color: var(--gold-deep, #8a7350); font-size: 10px; letter-spacing: 0.18em; margin-bottom: 8px; }
.sz-pearl p { color: var(--ink-mid); font-size: 13.5px; line-height: 1.75; }
.sz-diagram { border-radius: 2px; padding: 28px; border-color: var(--hairline-firm); background: var(--surface-page); }
.sz-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.sz-reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .sz-pulse path { animation: none; stroke-dashoffset: 0; }
  .sz-reveal { opacity: 1; transform: none; transition: none; }
}
@media (max-width: 860px) { .sz-headline { font-size: 36px; } .sz-step-name { font-size: 26px; } .sz-diagram { padding: 18px; } }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const GOLDEN = [
 {
  "n": "01",
  "title": "Time it",
  "text": "Look at the clock at the start. A seizure that reaches 5 minutes needs treatment, not more waiting."
 },
 {
  "n": "02",
  "title": "Keep them safe",
  "text": "Protect the head, do not restrain, and never put anything in the mouth."
 },
 {
  "n": "03",
  "title": "Check the glucose",
  "text": "Low blood sugar is a common, treatable cause and it can mimic or cause a seizure."
 },
 {
  "n": "04",
  "title": "Rescue drug at 5 minutes",
  "text": "Follow the child’s plan or your protocol. Benzodiazepine first, then second-line drugs, then anaesthetic help."
 }
];

const SECTIONS = [
 {
  "number": "1",
  "colour": "1",
  "name": "What Is a Seizure",
  "question": "What are you looking at, and what could be causing it?",
  "cols": [
   {
    "header": "Seizure or epilepsy",
    "items": [
     "A seizure is a single event of abnormal brain electrical activity",
     "Epilepsy means a tendency to recurrent seizures with no immediate trigger",
     "A first seizure is not automatically epilepsy",
     "Causes of a seizure include fever, low glucose, infection, head injury, poisoning and raised pressure in the brain"
    ]
   },
   {
    "header": "Types",
    "items": [
     "Focal: starts in one part of the brain, with or without awareness",
     "Tonic-clonic: stiffening, then jerking, loss of awareness and drowsiness afterwards",
     "Absence: brief vacant staring, common in school-age children",
     "Myoclonic and atonic: sudden jerks or drops"
    ]
   },
   {
    "header": "Febrile seizures",
    "items": [
     "Occur with fever, usually between 6 months and 6 years",
     "A simple one is generalised, lasts under 15 minutes and does not recur within 24 hours",
     "Most children recover fully and do not go on to have epilepsy",
     "Look for the source of the fever, and consider meningitis if the child is unwell"
    ]
   },
   {
    "header": "In children",
    "items": [
     "Seizures can look subtle in babies: lip smacking, eye deviation, cycling movements or apnoea",
     "Unusual behaviour may not be recognised as a seizure by families",
     "Anti-seizure medicine doses change as children grow",
     "A prolonged seizure is more likely in a child who has had one before"
    ]
   }
  ],
  "redFlags": [
   "Seizure with a stiff neck, rash or very unwell",
   "A first seizure with head injury or focal weakness",
   "Seizure lasting 5 minutes or more"
  ],
  "pearl": "Ask what happened before, during and after. Eyewitness description from a parent or carer is often the most useful piece of evidence you can collect."
 },
 {
  "number": "2",
  "colour": "2",
  "name": "During and After",
  "question": "What do you do at the bedside?",
  "cols": [
   {
    "header": "While it is happening",
    "items": [
     "Note the time it started, and stay with the child",
     "Protect the head with something soft and move hazards away",
     "Do not restrain movements, and do not put anything in the mouth",
     "Loosen tight clothing around the neck"
    ]
   },
   {
    "header": "Airway and breathing",
    "items": [
     "Once jerking stops, place the child in the recovery position",
     "Give oxygen if the child is blue or their oxygen saturation is low",
     "Suction only if there is secretion and you can see it",
     "Watch breathing closely, especially after a rescue drug"
    ]
   },
   {
    "header": "Look for causes",
    "items": [
     "Check blood glucose straight away",
     "Take a temperature and full set of observations, including neuro obs",
     "Ask about medication doses, illness, recent head injury or poisoning",
     "Consider infection, raised pressure, and a shunt problem in a child with a VP shunt"
    ]
   },
   {
    "header": "Afterwards",
    "items": [
     "The post-ictal period can last minutes to hours",
     "Keep observing airway, breathing, GCS and pupils until fully recovered",
     "Stay calm and reassure the family, and offer privacy",
     "Record the duration, the type of movements, colour, and any incontinence or injury"
    ]
   }
  ],
  "redFlags": [
   "Not breathing normally after the jerking stops",
   "Injury from the fall or a head strike",
   "Not returning to baseline"
  ],
  "pearl": "Nothing in the mouth is not a rule to be polite about. Objects can break teeth, block the airway and injure fingers. The tongue cannot be swallowed."
 },
 {
  "number": "3",
  "colour": "3",
  "name": "Status Epilepticus",
  "question": "What is the emergency, and what is the order of treatment?",
  "cols": [
   {
    "header": "What it is",
    "items": [
     "A seizure lasting 5 minutes or more, or repeated seizures with no recovery between them",
     "It is a medical emergency, and a reason to call for help early",
     "The longer it lasts, the harder it is to stop",
     "Prolonged seizures cause low oxygen, acidosis, a rise in brain pressure and can injure the brain"
    ]
   },
   {
    "header": "First steps",
    "items": [
     "Airway, breathing and circulation, with high-flow oxygen",
     "Check blood glucose and treat low sugar",
     "Get IV or IO access, and take bloods",
     "Call for senior and anaesthetic help early"
    ]
   },
   {
    "header": "The order of drugs",
    "items": [
     "First: a benzodiazepine, such as buccal or intranasal midazolam, IV lorazepam or rectal diazepam",
     "If still fitting: a second dose or a second-line drug, such as IV levetiracetam, phenytoin or sodium valproate",
     "If still fitting: rapid sequence induction and intensive care",
     "Doses come from the BNFC and your local protocol"
    ]
   },
   {
    "header": "Watch for",
    "items": [
     "Benzodiazepines can depress breathing, so watch it closely and be ready to support it",
     "Record the time of each drug given and the response",
     "Any child who seizes again needs a plan and a review",
     "Time every step"
    ]
   }
  ],
  "redFlags": [
   "Seizing at 5 minutes",
   "Breathing slowed after a benzodiazepine",
   "Blood glucose low or not measured"
  ],
  "pearl": "The steps are always the same: airway, breathing, glucose, then a benzodiazepine, then a second-line drug, then anaesthetic help. Learn the order, and use the child’s own plan if they have one."
 },
 {
  "number": "4",
  "colour": "4",
  "name": "Rescue Medicines",
  "question": "How does buccal midazolam work, and how is it given?",
  "cols": [
   {
    "header": "Why buccal",
    "items": [
     "Midazolam is absorbed through the lining of the mouth and passes quickly into the blood",
     "It avoids the gut and the first pass through the liver, which is why it works quickly",
     "It is easier to give to a fitting child than an injection or a rectal drug",
     "Intranasal midazolam works in the same way"
    ]
   },
   {
    "header": "How it is given",
    "items": [
     "Draw up the prescribed dose, which is by age or weight from the care plan",
     "Squeeze it slowly into the space between the cheek and the gum, not down the throat",
     "Tip the child on their side and give it in small amounts",
     "Note the time given and start the clock for the next step"
    ]
   },
   {
    "header": "Safety",
    "items": [
     "Midazolam is a controlled drug, so follow storage and recording rules",
     "It can cause drowsiness and slow breathing",
     "Watch airway and oxygen saturation for at least as long as your local policy says",
     "Check the child’s individual plan for how much and when"
    ]
   },
   {
    "header": "Care plans",
    "items": [
     "Children with epilepsy may have an emergency care plan and a rescue drug",
     "Know where it is, who can give it, and the child’s usual seizure pattern",
     "Parents and school staff are often trained to give it",
     "Always ask what is on the plan"
    ]
   }
  ],
  "redFlags": [
   "Drug given down the throat",
   "No record of the time of the dose",
   "Breathing slow after the dose"
  ],
  "pearl": "Buccal midazolam is a good example of pharmacokinetics in practice. The route was chosen for speed, so the drug reaches the brain before a seizure has time to become dangerous."
 },
 {
  "number": "5",
  "colour": "5",
  "name": "Neuro Links",
  "question": "When is a seizure a sign of something else?",
  "cols": [
   {
    "header": "Raised pressure",
    "items": [
     "A new seizure with headache, vomiting and drowsiness needs urgent assessment",
     "Rising pressure in the brain squeezes the brainstem and can cause Cushing’s triad, a late sign",
     "Keep the head midline and 30 degrees up, and escalate"
    ]
   },
   {
    "header": "VP shunts",
    "items": [
     "A blocked or infected shunt can cause seizures",
     "Look for morning headache, vomiting, drowsiness, fever or redness along the shunt track",
     "Any child with a shunt and a new seizure needs a neurosurgical review"
    ]
   },
   {
    "header": "Head injury and infection",
    "items": [
     "A seizure after a head injury needs urgent review and often imaging",
     "Fever with a seizure and a stiff neck, rash or floppiness may be meningitis",
     "Give antibiotics without delay if sepsis or meningitis is suspected"
    ]
   },
   {
    "header": "Neuro observations",
    "items": [
     "Repeat GCS, pupils and limb power after a seizure",
     "A slow recovery, a new weakness or unequal pupils is not a normal post-ictal state",
     "Use the disability assessment page for the full neuro observation routine"
    ]
   }
  ],
  "redFlags": [
   "New focal weakness after the seizure",
   "Unequal pupils",
   "Drowsy and vomiting with a shunt"
  ],
  "pearl": "A seizure is a symptom. Always ask why it happened, especially in a baby, after an injury, with a fever, or in a child with a shunt or brain tumour."
 },
 {
  "number": "6",
  "colour": "6",
  "name": "Living With Epilepsy",
  "question": "What do families and school need to know?",
  "cols": [
   {
    "header": "Medication",
    "items": [
     "Anti-seizure drugs must be taken regularly, and at the same times",
     "Stopping suddenly can cause withdrawal seizures, because the brain has adapted to the drug being there",
     "A missed dose is a common reason for a breakthrough seizure",
     "Any change to a dose needs medical advice"
    ]
   },
   {
    "header": "Triggers",
    "items": [
     "Missed medicine, illness and fever, poor sleep, and stress are common triggers",
     "Flashing lights trigger seizures only in a small group of children",
     "Keep a seizure diary of the date, time, length and what happened",
     "Share it with the epilepsy nurse"
    ]
   },
   {
    "header": "Safety",
    "items": [
     "Supervise swimming, and give showers rather than baths where advised",
     "Use helmets and care around heights and roads where needed",
     "Do not over-restrict, because being included matters too",
     "The epilepsy team gives individual advice"
    ]
   },
   {
    "header": "School and support",
    "items": [
     "A written plan and a trained adult in school",
     "Tell teachers what a seizure looks like and what to do",
     "Support for the child’s confidence, sleep and learning",
     "Epilepsy Action and Young Epilepsy give practical help"
    ]
   }
  ],
  "redFlags": [
   "Medicine stopped suddenly",
   "Seizures becoming more frequent",
   "Family worried about unattended seizures at night"
  ],
  "pearl": "Consistency helps. Regular medicine, regular sleep and a clear plan lower the chance of a seizure, and make a seizure less frightening when it does happen."
 }
];

type Block =
  | { kind: 'table'; title: string; head: string[]; rows: string[][] }
  | { kind: 'pearl'; label: string; text: string }
  | { kind: 'diagram'; id: string; title: string }
  | { kind: 'flow'; title: string; items: { top: string; title: string; lines: string[] }[]; caption: string; hl: number };

const BLOCKS: Block[] = [
 {
  "kind": "flow",
  "title": "A Prolonged Seizure, Step by Step",
  "items": [
   {
    "top": "Start",
    "title": "Time it, ABC",
    "lines": [
     "Note the clock",
     "Oxygen, recovery",
     "position, glucose"
    ]
   },
   {
    "top": "About 5 minutes",
    "title": "First benzodiazepine",
    "lines": [
     "Buccal midazolam,",
     "IV lorazepam or",
     "rectal diazepam"
    ]
   },
   {
    "top": "Still fitting",
    "title": "Second-line drug",
    "lines": [
     "Second dose, or",
     "levetiracetam, phenytoin",
     "or valproate"
    ]
   },
   {
    "top": "Still fitting",
    "title": "Anaesthetic help",
    "lines": [
     "Rapid sequence",
     "induction and",
     "intensive care"
    ]
   }
  ],
  "caption": "Times vary between guidelines. The order is the constant, so follow your local protocol and the child’s own plan.",
  "hl": 1
 },
 {
  "kind": "table",
  "title": "Seizure Types at a Glance",
  "head": [
   "Type",
   "What you see",
   "Awareness",
   "Points to know"
  ],
  "rows": [
   [
    "Focal aware",
    "Twitching, tingling or a strange feeling in one area",
    "Kept",
    "May spread to become a bigger seizure"
   ],
   [
    "Focal impaired awareness",
    "Staring, lip smacking, picking at clothes, wandering",
    "Reduced",
    "Often mistaken for daydreaming or behaviour"
   ],
   [
    "Tonic-clonic",
    "Stiffening, then jerking, and then drowsy",
    "Lost",
    "The classic seizure. Time it and protect the head"
   ],
   [
    "Absence",
    "Brief blank stare, then carries on",
    "Lost for seconds",
    "Many times a day, and often missed at school"
   ],
   [
    "Myoclonic or atonic",
    "Sudden jerks or a drop",
    "Varies",
    "Can cause injury from falls"
   ]
  ]
 },
 {
  "kind": "table",
  "title": "Febrile Seizure or Something Else?",
  "head": [
   "Feature",
   "Simple febrile seizure",
   "Warning signs"
  ],
  "rows": [
   [
    "Age",
    "6 months to 6 years",
    "Under 6 months or a much older child"
   ],
   [
    "Length",
    "Under 15 minutes",
    "Over 15 minutes"
   ],
   [
    "Type",
    "Generalised",
    "One-sided or focal"
   ],
   [
    "Recurrence",
    "Not again within 24 hours",
    "Repeated seizures in the same illness"
   ],
   [
    "Child afterwards",
    "Recovers fully",
    "Drowsy, stiff neck, rash or floppy"
   ]
  ]
 },
 {
  "kind": "table",
  "title": "Seizure Mimics",
  "head": [
   "Event",
   "Clues",
   "Why it is not a seizure"
  ],
  "rows": [
   [
    "Breath-holding spell",
    "After crying or a fright, child goes blue or pale, then floppy",
    "Clear trigger and quick recovery"
   ],
   [
    "Faint (syncope)",
    "Pale, sweaty, dizzy on standing, brief jerks after collapse",
    "Recovers when lying flat"
   ],
   [
    "Night terrors",
    "Screaming and agitation in the first part of the night",
    "Cannot be woken, and no memory in the morning"
   ],
   [
    "Tics",
    "Repeated movements or sounds that can be suppressed briefly",
    "Awareness is kept"
   ]
  ]
 },
 {
  "kind": "pearl",
  "label": "Study aid only",
  "text": "This page explains the principles. Follow your trust’s status epilepticus protocol, the child’s own care plan and the BNFC for drugs and doses."
 }
];

const quizQuestions = [
 {
  "question": "A child has a tonic-clonic seizure. What should you do first?",
  "options": [
   "Put something in the mouth",
   "Note the time and protect the head",
   "Hold the limbs still",
   "Give a drink"
  ],
  "answer": 1,
  "explanation": "Time it and keep the child safe. Never restrain them or put anything in the mouth."
 },
 {
  "question": "Status epilepticus is best defined as:",
  "options": [
   "Any seizure",
   "A seizure lasting 5 minutes or more, or repeated seizures without recovery",
   "A seizure with a fever",
   "A seizure that happens at night"
  ],
  "answer": 1,
  "explanation": "Five minutes or more, or repeated seizures without recovery in between."
 },
 {
  "question": "Which should you check straight away in a seizing child?",
  "options": [
   "Blood glucose",
   "Height",
   "Hearing",
   "Vision"
  ],
  "answer": 0,
  "explanation": "Low blood glucose is a treatable cause, and it can be missed."
 },
 {
  "question": "Why does buccal midazolam work quickly?",
  "options": [
   "It is swallowed",
   "It is absorbed through the lining of the mouth and skips the gut and liver",
   "It is injected",
   "It is stronger"
  ],
  "answer": 1,
  "explanation": "Absorption through the mouth lining goes straight into the blood, avoiding the first pass through the liver."
 },
 {
  "question": "What is the order of drug treatment for a prolonged seizure?",
  "options": [
   "Second-line drug, then benzodiazepine",
   "Benzodiazepine, then a second-line drug, then anaesthetic help",
   "Anaesthetic help first",
   "Paracetamol first"
  ],
  "answer": 1,
  "explanation": "Benzodiazepine first, then a second-line drug, then anaesthetic help."
 },
 {
  "question": "What is a common reason for a breakthrough seizure in a child with epilepsy?",
  "options": [
   "A missed dose of medicine",
   "Drinking water",
   "Washing hands",
   "Reading"
  ],
  "answer": 0,
  "explanation": "Missing anti-seizure medicine is one of the commonest triggers."
 },
 {
  "question": "Why can stopping anti-seizure medicine suddenly be dangerous?",
  "options": [
   "The brain has adapted to the drug and withdrawal can cause seizures",
   "The drug turns toxic",
   "It causes a rash",
   "It has no effect"
  ],
  "answer": 0,
  "explanation": "Sudden withdrawal can cause rebound seizures, which is why doses should only be changed with advice."
 },
 {
  "question": "A child with a VP shunt has a new seizure and is vomiting and drowsy. What is the priority?",
  "options": [
   "Reassure and observe",
   "Consider shunt blockage and raised pressure, and escalate urgently",
   "Give a snack",
   "Discharge"
  ],
  "answer": 1,
  "explanation": "A blocked shunt can cause raised pressure, which needs urgent neurosurgical review."
 }
];

const SOURCES = [
 {
  "citation": "NICE (2022)",
  "title": "Epilepsies in children, young people and adults (NG217)",
  "href": "https://www.nice.org.uk/guidance/ng217"
 },
 {
  "citation": "BNF for Children (NICE)",
  "title": "Anticonvulsants and treatment of status epilepticus",
  "href": "https://bnfc.nice.org.uk/"
 },
 {
  "citation": "Advanced Life Support Group",
  "title": "Advanced Paediatric Life Support: the practical approach",
  "href": "https://www.alsg.org/"
 },
 {
  "citation": "Epilepsy Action",
  "title": "Information and support for families",
  "href": "https://www.epilepsy.org.uk/"
 }
];


function wrapTitle(t: string, max = 15): string[] {
  if (t.length <= max) return [t];
  const words = t.split(' ');
  let best = [t];
  let bestGap = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const gap = Math.abs(a.length - b.length);
    if (gap < bestGap) { bestGap = gap; best = [a, b]; }
  }
  return best;
}

function FlowDiagram({ items, label, prefix, hl }: { items: { top: string; title: string; lines: string[] }[]; label: string; prefix: string; hl: number }) {
  const n = items.length;
  const gap = 34;
  const bw = (860 - gap * (n - 1)) / n;
  const id = `${prefix}-flow-arrow`;
  return (
    <svg viewBox="0 0 900 236" role="img" aria-label={label}>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: 'var(--ink-faint)' }} />
        </marker>
      </defs>
      {items.map((it, i) => {
        const x = 20 + i * (bw + gap);
        const t = wrapTitle(it.title);
        return (
          <g key={i}>
            <text x={x + bw / 2} y={30} textAnchor="middle" style={{ fill: 'var(--gold-deep, #8a7350)', fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{it.top}</text>
            <rect x={x} y={44} width={bw} height={156} rx={2} style={{ fill: i === hl ? 'rgba(203, 174, 120, 0.2)' : 'var(--surface-page)', stroke: i === hl ? 'var(--gold-deep, #8a7350)' : 'var(--hairline-firm)', strokeWidth: 1 }} />
            {t.map((line, k) => (
              <text key={k} x={x + bw / 2} y={78 + k * 22} textAnchor="middle" style={{ fill: 'var(--ink-strong)', fontFamily: "'Playfair Display', serif", fontSize: 17 }}>{line}</text>
            ))}
            {it.lines.map((line, k) => (
              <text key={k} x={x + bw / 2} y={t.length === 2 ? 138 + k * 17 : 116 + k * 17} textAnchor="middle" style={{ fill: 'var(--ink-mid)', fontFamily: "'Inter', sans-serif", fontSize: 12.5 }}>{line}</text>
            ))}
            {i < n - 1 && <line x1={x + bw} y1={122} x2={x + bw + gap - 4} y2={122} style={{ stroke: 'var(--ink-faint)', strokeWidth: 1.5 }} markerEnd={`url(#${id})`} />}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaediatricSeizuresPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.sz-guide .sz-step, .sz-guide .sz-diagram, .sz-guide .sz-golden-cell, .sz-guide .sz-pearl'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('sz-reveal'); io.observe(el); }
    });
    return () => io.disconnect();
  }, []);


  const renderDiagram = (id: string) => {
    switch (id) {

      default: return null;
    }
  };

  return (
    <div className="sz-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="sz-wrap">
        <Link href="/hub" className="sz-back">
          <span className="sz-back-arrow">&larr;</span>
          Nursing Hub
        </Link>

        <p className="sz-kicker">{"Neurology · Children’s Nursing"}</p>
        <h1 className="sz-headline">Seizures & Status Epilepticus</h1>
        <p className="sz-standfirst">{"What a seizure is, what to do while it is happening, and how to recognise and treat one that will not stop. Time it, keep them safe, check the glucose, and know the rescue drug."}</p>
        <p className="sz-byline">{"Children’s nursing · The Nurse Lab"}</p>
        <svg className="sz-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,30 L180,30 L196,30 L204,24 L212,30 L232,30 L238,36 L246,4 L254,44 L260,30 L280,30 L296,20 L312,30 L520,30 L536,30 L544,24 L552,30 L572,30 L578,36 L586,4 L594,44 L600,30 L620,30 L636,20 L652,30 L1000,30" fill="none" pathLength={1} />
        </svg>
        <EditorialSaveButton
          hubItemId="paediatric-seizures"
          hubItemTitle="Seizures & Status Epilepticus"
        />

        <div className="sz-pearl" style={{ marginBottom: '40px' }}>
          <p className="sz-pearl-label">Student note</p>
          <p>{"A seizure is a burst of abnormal electrical activity in the brain. Epilepsy is a tendency to have repeated seizures that were not provoked by something else. Status epilepticus is a seizure lasting 5 minutes or more, or repeated seizures without recovery in between. Post-ictal describes the drowsy, confused period afterwards. A rescue medicine is a fast-acting drug, often buccal midazolam, given for a prolonged seizure."}</p>
        </div>

        <div className="sz-golden">
          {GOLDEN.map((cell) => (
            <div key={cell.n} className="sz-golden-cell">
              <span className="sz-golden-numeral">{cell.n}</span>
              <p className="sz-golden-title">{cell.title}</p>
              <p className="sz-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="sz-step">
            <div className="sz-step-sidebar">
              <span className={`sz-step-letter sz-letter-${section.colour}`}>{section.number}</span>
              <span className={`sz-step-badge sz-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="sz-step-content">
              <h2 className="sz-step-name">{section.name}</h2>
              <p className="sz-step-question">{section.question}</p>

              <div className="sz-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="sz-content-col">
                    <p className="sz-col-header">{col.header}</p>
                    <ul className="sz-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="sz-redflags-label">Watch for</p>
                  <div className="sz-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="sz-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="sz-pearl">
                  <p className="sz-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {BLOCKS.map((block, idx) => {
          if (block.kind === 'table') {
            return (
              <div key={idx}>
                <h2 className="sz-section-title">{block.title}</h2>
                <div className="sz-table-wrap">
                  <table className="sz-table" style={{ marginBottom: '32px' }}>
                    <thead>
                      <tr>{block.head.map((h) => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row) => (
                        <tr key={row[0]}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }
          if (block.kind === 'pearl') {
            return (
              <div key={idx} className="sz-pearl" style={{ marginBottom: '32px' }}>
                <p className="sz-pearl-label">{block.label}</p>
                <p>{block.text}</p>
              </div>
            );
          }
          if (block.kind === 'flow') {
            return (
              <div key={idx}>
                <h2 className="sz-section-title">{block.title}</h2>
                <div className="sz-diagram">
                  <FlowDiagram items={block.items} label={block.title} prefix="sz" hl={block.hl} />
                  <p className="sz-diagram-caption">{block.caption}</p>
                </div>
              </div>
            );
          }
          return (
            <div key={idx}>
              <h2 className="sz-section-title">{block.title}</h2>
              {renderDiagram(block.id)}
            </div>
          );
        })}

        <h2 className="sz-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Seizures & Status Epilepticus" questions={quizQuestions} />

        <SourceLinks sources={SOURCES} />
      </div>
    </div>
  );
}
