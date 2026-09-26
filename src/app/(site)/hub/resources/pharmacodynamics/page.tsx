'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.pd-guide *, .pd-guide *::before, .pd-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.pd-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.pd-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.pd-back {
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
.pd-back:hover { color: var(--ink-soft); }
.pd-back-arrow { font-style: normal; }

/* Masthead */
.pd-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.pd-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.pd-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.pd-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

/* Golden rules grid */
.pd-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.pd-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.pd-golden-cell:last-child { border-right: none; }

.pd-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.pd-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.pd-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.pd-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.pd-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.pd-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.pd-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.pd-step-content {
  padding-left: 32px;
}

.pd-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.pd-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

/* 4-column content grid */
.pd-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.pd-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.pd-content-col:last-child { border-right: none; }

.pd-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.pd-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pd-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.pd-col-list li::before {
  content: '\u2013';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

/* Red flags */
.pd-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.pd-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.pd-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.pd-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.pd-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.pd-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.pd-section-title {
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
.pd-table-wrap { overflow-x: auto; }
.pd-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.pd-table th {
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
.pd-table th:last-child { border-right: none; }

.pd-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.pd-table td:last-child { border-right: none; }
.pd-table tr:last-child td { border-bottom: none; }
.pd-table td:first-child { font-weight: 400; color: var(--ink-mid); }

/* 2-col grid */
.pd-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.pd-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.pd-grid-2-cell:nth-child(2n) { border-right: none; }

.pd-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

/* Step colour system */
.pd-letter-1 { color: var(--blue-600); }
.pd-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.pd-letter-2 { color: var(--teal-600); }
.pd-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.pd-letter-3 { color: var(--coral-600); }
.pd-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.pd-letter-4 { color: var(--purple-600); }
.pd-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.pd-letter-5 { color: var(--gray-600); }
.pd-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.pd-letter-6 { color: #8B5E3C; }
.pd-badge-6 { background: var(--surface-sunken); color: #6B4729; }

/* Flow path mono */
.pd-mono {
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
.pd-diagram {
  border: 0.5px solid var(--hairline-firm);
  padding: 20px 16px 14px;
  margin-bottom: 18px;
  background: var(--surface-page);
}
.pd-diagram svg { display: block; width: 100%; height: auto; }
.pd-diagram-caption {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-align: center;
  margin-top: 10px;
}
.pd-diagram-key {
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.pd-diagram-key span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
}
.pd-diagram-key i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* Responsive */
@media (max-width: 860px) {
  .pd-wrap { padding: 24px 20px 48px; }
  .pd-headline { font-size: 34px; }
  .pd-golden { grid-template-columns: repeat(2, 1fr); }
  .pd-golden-cell:nth-child(2) { border-right: none; }
  .pd-golden-cell:nth-child(1), .pd-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .pd-step { grid-template-columns: 64px 1fr; }
  .pd-step-letter { font-size: 48px; }
  .pd-content-grid { grid-template-columns: repeat(2, 1fr); }
  .pd-content-col:nth-child(2) { border-right: none; }
  .pd-content-col:nth-child(1), .pd-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .pd-grid-2 { grid-template-columns: 1fr; }
  .pd-grid-2-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .pd-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .pd-golden { grid-template-columns: 1fr; }
  .pd-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .pd-golden-cell:last-child { border-bottom: none; }
  .pd-content-grid { grid-template-columns: 1fr; }
  .pd-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .pd-content-col:last-child { border-bottom: none; }
  .pd-step { grid-template-columns: 52px 1fr; }
  .pd-step-letter { font-size: 38px; }
  .pd-step-content { padding-left: 18px; }
}
/* ── Polish layer ───────────────────────────────────────────── */
.pd-kicker { color: var(--gold-deep, #8a7350); }
.pd-headline { font-size: 60px; }
.pd-byline { border-bottom: none; padding-bottom: 6px; margin-bottom: 0; }
.pd-pulse { display: block; width: 100%; height: 40px; margin-bottom: 40px; overflow: visible; }
.pd-pulse path { stroke: var(--gold, #cbae78); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; animation: pd-pulse-draw 2.6s ease-out 0.3s forwards; }
@keyframes pd-pulse-draw { to { stroke-dashoffset: 0; } }
.pd-golden { gap: 14px; border: none; }
.pd-golden-cell { border: 0.5px solid var(--hairline-firm); border-radius: 2px; background: var(--surface-page); transition: transform 0.2s ease, border-color 0.2s ease; }
.pd-golden-cell:last-child { border-right: 0.5px solid var(--hairline-firm); }
.pd-golden-cell:hover { transform: translateY(-2px); border-color: var(--gold); }
.pd-golden-numeral { color: var(--gold); font-size: 34px; }
.pd-section-title { border: none; padding: 18px 0 0; margin-top: 56px; font-size: 28px; position: relative; }
.pd-section-title::before { content: ''; position: absolute; top: 0; left: 0; width: 44px; height: 3px; border-radius: 999px; background: var(--gold); }
.pd-content-grid, .pd-table { border-radius: 2px; }
.pd-content-grid { overflow: hidden; border-color: var(--hairline-firm); }
.pd-table { border-collapse: separate; border-spacing: 0; overflow: hidden; border-color: var(--hairline-firm); }
.pd-table th { background: transparent; color: var(--gold-deep, #8a7350); border-bottom-color: var(--hairline-firm); }
.pd-table td { padding: 13px 16px; line-height: 1.65; }
.pd-table td:first-child { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; color: var(--ink-strong); }
.pd-table tbody tr:nth-child(even) td { background: rgba(203, 174, 120, 0.06); }
.pd-table tbody tr:hover td { background: rgba(203, 174, 120, 0.14); }
.pd-step { border-top-color: var(--hairline-soft); }
.pd-step-letter { text-shadow: none; }
.pd-step-name { font-size: 34px; }
.pd-step-badge, .pd-red-pill { border-radius: 999px; }
.pd-pearl { background: transparent; border: 0.5px solid var(--hairline-firm); border-left: 3px solid var(--gold); border-radius: 2px; padding: 18px 24px; }
.pd-pearl-label { color: var(--gold-deep, #8a7350); font-size: 10px; letter-spacing: 0.18em; margin-bottom: 8px; }
.pd-pearl p { color: var(--ink-mid); font-size: 13.5px; line-height: 1.75; }
.pd-diagram { border-radius: 2px; padding: 28px; border-color: var(--hairline-firm); background: var(--surface-page); }
.pd-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.pd-reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .pd-pulse path { animation: none; stroke-dashoffset: 0; }
  .pd-reveal { opacity: 1; transform: none; transition: none; }
}
@media (max-width: 860px) { .pd-headline { font-size: 36px; } .pd-step-name { font-size: 26px; } .pd-diagram { padding: 18px; } }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const GOLDEN = [
 {
  "n": "01",
  "title": "Drug → body",
  "text": "Pharmacodynamics is the mechanism and effect side. Pharmacokinetics is the journey side."
 },
 {
  "n": "02",
  "title": "Four targets",
  "text": "Receptor = lock. Ion channel = gate. Transport protein = carrier. Enzyme = chemical worker."
 },
 {
  "n": "03",
  "title": "On, blocked, partly on",
  "text": "Agonist switches a receptor on. Antagonist blocks it. Partial agonist switches it on only partly."
 },
 {
  "n": "04",
  "title": "Potency ≠ efficacy",
  "text": "Potency is how much drug you need. Efficacy is the biggest effect it can produce."
 }
];

const SECTIONS = [
 {
  "number": "1",
  "colour": "1",
  "name": "Body Communication",
  "question": "What normal system is the drug interfering with?",
  "cols": [
   {
    "header": "Two systems",
    "items": [
     "Nervous system: neurotransmitters, usually rapid",
     "Endocrine system: hormones in the blood, usually slower, sometimes hours to weeks",
     "Feedback keeps variables in their range",
     "Drugs do not create new systems. They mimic, enhance or block the body’s own"
    ]
   },
   {
    "header": "The chain",
    "items": [
     "A stimulus starts the process",
     "A first messenger (hormone or neurotransmitter) carries the message to the cell",
     "It binds a receptor on or in the cell",
     "A second messenger (cAMP, calcium, IP₃, DAG) carries and amplifies it inside, and the cell responds"
    ]
   },
   {
    "header": "Amplification",
    "items": [
     "One binding can start many reactions inside the cell",
     "A drug can keep producing effects after it leaves the receptor",
     "Effects that work through gene transcription, such as steroids, take longer to appear",
     "That is why some drugs are not judged after one dose"
    ]
   },
   {
    "header": "Example: asthma",
    "items": [
     "Low oxygen or a trigger raises sympathetic drive and adrenaline is released",
     "Adrenaline binds β2 receptors on bronchial smooth muscle and cAMP rises",
     "The muscle relaxes and the airways widen",
     "Salbutamol is a β2 agonist that copies this. Corticosteroids work more slowly by changing inflammatory genes"
    ]
   }
  ],
  "redFlags": [
   "Expecting an instant effect from a slow-acting drug",
   "Tremor, palpitations or tachycardia from too much β agonist"
  ],
  "pearl": "For any medicine, ask in order: what is the target, what does the drug do to it, what happens in the cell, what effect should I see, and what would too much look like? That chain is how you predict what to monitor."
 },
 {
  "number": "2",
  "colour": "2",
  "name": "Where Drugs Act",
  "question": "Which part of the cell does the drug work on?",
  "cols": [
   {
    "header": "Receptors: the lock",
    "items": [
     "A protein that recognises a specific ligand and starts or blocks a response",
     "The drug is the key: it can turn the lock on or just block it",
     "Sites may be on the cell surface or inside the cell"
    ]
   },
   {
    "header": "Ion channels: the gate",
    "items": [
     "Selective pores that let particular ions cross the membrane",
     "Voltage-gated channels open with a change in voltage. Ligand-gated channels open when a ligand binds",
     "Movement through an open channel is passive and does not use ATP directly",
     "Lidocaine blocks sodium entry, so nerves cannot conduct and muscle is less excitable"
    ]
   },
   {
    "header": "Transporters: the carrier",
    "items": [
     "Bind a substance, change shape and move it across the membrane. Some use energy, like the sodium–potassium pump",
     "Blocked by diuretics, digoxin and SSRIs",
     "L-Dopa uses a transporter to get into the brain"
    ]
   },
   {
    "header": "Enzymes: the chemical worker",
    "items": [
     "Speed up reactions. An inhibitor slows the pathway",
     "Aspirin blocks COX, so less prostaglandin is made",
     "ACE inhibitors reduce angiotensin II, and statins block HMG-CoA reductase",
     "PDE inhibitors prolong second-messenger signalling"
    ]
   }
  ],
  "redFlags": [
   "Falling urine output or electrolyte change on a diuretic",
   "Nausea, visual disturbance or arrhythmia on digoxin"
  ],
  "pearl": "Cell membranes are fatty, so charged particles cannot slip through. They need a channel or a transporter. Fat-soluble substances cross more easily, which is why steroids can reach receptors inside the cell."
 },
 {
  "number": "3",
  "colour": "3",
  "name": "Receptors & Ligands",
  "question": "What binds, where, and how fast is the response?",
  "cols": [
   {
    "header": "Ligands",
    "items": [
     "A ligand is anything that binds a receptor",
     "Endogenous ligands are made in the body. Exogenous ligands, such as drugs, come from outside",
     "Drugs “borrow” normal physiology by mimicking, blocking or exaggerating a natural signal",
     "Binding uses weak bonds, and shape and charge decide the fit"
    ]
   },
   {
    "header": "Where receptors sit",
    "items": [
     "Cell surface: for messengers that cannot cross the membrane, often fast",
     "Intracellular: for lipid-soluble ligands such as steroids, slower and longer-lasting",
     "Metabotropic: on the surface but linked to G-proteins and second messengers, which amplify the signal"
    ]
   },
   {
    "header": "Steroids",
    "items": [
     "Lipid-soluble, so they cross the membrane and bind receptors inside",
     "The complex changes gene transcription and protein production",
     "Aldosterone acts on an intracellular mineralocorticoid receptor to change sodium and potassium handling",
     "Steroid structures are related, so higher doses can spill over onto other steroid receptors"
    ]
   },
   {
    "header": "Selectivity",
    "items": [
     "Receptors have subtypes: β1 is important in the heart and β2 in the lungs",
     "No drug is perfectly selective",
     "Higher doses reach other subtypes",
     "That is why one mechanism gives both wanted and unwanted effects"
    ]
   }
  ],
  "redFlags": [
   "Effects appearing in a different organ from the one being treated",
   "Higher dose of a “selective” drug"
  ],
  "pearl": "Receptor location predicts timing. A reliever inhaler can work within minutes because it changes airway muscle signalling. A steroid can take longer because it alters inflammatory gene expression."
 },
 {
  "number": "4",
  "colour": "4",
  "name": "Agonists & Antagonists",
  "question": "Does the drug switch the receptor on, block it, or do half of each?",
  "cols": [
   {
    "header": "Agonist",
    "items": [
     "High affinity and high intrinsic activity",
     "Binds and activates the receptor, mimicking the natural ligand",
     "Example: salbutamol at β2 receptors"
    ]
   },
   {
    "header": "Antagonist",
    "items": [
     "High affinity but no intrinsic activity",
     "Binds without activating, and stops the natural ligand or an agonist working",
     "Example: a beta blocker at β receptors"
    ]
   },
   {
    "header": "Partial agonist",
    "items": [
     "Activates the receptor but cannot produce the maximum effect",
     "Like a dimmer switch: some effect with no full agonist present",
     "With a full agonist it can lower the overall response by occupying receptors"
    ]
   },
   {
    "header": "Competitive or not",
    "items": [
     "Competitive: fights the agonist for the same site, and enough agonist can overcome it",
     "Non-competitive: binds elsewhere and disables the receptor, so more agonist does not fully restore the response"
    ]
   }
  ],
  "redFlags": [
   "Slow pulse or low BP on a beta blocker",
   "Exaggerated response to an agonist"
  ],
  "pearl": "Binding is not the same as activation. Agonists and antagonists can both have high affinity. The difference is whether the receptor is switched on afterwards."
 },
 {
  "number": "5",
  "colour": "5",
  "name": "Dose & Response",
  "question": "How much, how far, and for how long?",
  "cols": [
   {
    "header": "Potency",
    "items": [
     "How much drug is needed to produce an effect",
     "A more potent drug’s curve sits further left",
     "It does not make the drug stronger overall"
    ]
   },
   {
    "header": "Efficacy",
    "items": [
     "The largest effect a drug can produce",
     "Shown as the height of the curve",
     "Depends on affinity and receptor number",
     "Often the more clinically important of the two"
    ]
   },
   {
    "header": "Duration",
    "items": [
     "Reversible: effect wears off as the drug leaves, such as Ventolin",
     "Irreversible: effect lasts until the body makes new protein, such as aspirin",
     "Easily reversible binding but a long effect: steroids, because the changes inside the cell continue"
    ]
   },
   {
    "header": "Side effects from the same target",
    "items": [
     "The same receptor exists in more than one tissue",
     "An effect that is too strong becomes an adverse effect",
     "So mechanism predicts monitoring"
    ]
   }
  ],
  "redFlags": [
   "Choosing a drug because it is “more potent”",
   "No response despite a full dose"
  ],
  "pearl": "More potent does not mean more effective. Drug A can need a smaller dose than drug B and still have a lower maximum effect. If you need the biggest possible response, efficacy matters more than potency."
 },
 {
  "number": "6",
  "colour": "6",
  "name": "Adaptation & Interactions",
  "question": "What happens with long-term use, and when drugs are combined?",
  "cols": [
   {
    "header": "Down-regulation",
    "items": [
     "Ongoing agonist stimulation makes the body reduce receptor numbers or sensitivity",
     "If the drug is stopped suddenly, the natural messenger has fewer receptors to work on",
     "This can cause withdrawal or a serious loss of effect"
    ]
   },
   {
    "header": "Up-regulation",
    "items": [
     "Ongoing blockade by an antagonist makes the body build more receptors",
     "If the drug is stopped suddenly, the natural messenger acts on the extra receptors",
     "The rebound response can be exaggerated, and sometimes life-threatening"
    ]
   },
   {
    "header": "PD interactions",
    "items": [
     "Additive: the effects combine",
     "Synergistic: the effect is greater than expected",
     "Antagonistic: one drug reduces another’s effect",
     "Two sedatives, two BP-lowering drugs or two bleeding-risk drugs can each be within range yet unsafe together"
    ]
   },
   {
    "header": "Your role",
    "items": [
     "Understand the target and link it to observations",
     "Check for interactions when drugs act on the same system",
     "Teach patients not to stop suddenly unless advised",
     "Monitor the effect, not just the administration, and escalate the unexpected, such as no response, toxicity, withdrawal or paradoxical effects"
    ]
   }
  ],
  "redFlags": [
   "Sudden stopping of a long-term medicine",
   "Two drugs with the same effect on sedation, BP or bleeding",
   "Withdrawal or rebound symptoms"
  ],
  "pearl": "Children are not small adults for PD either. Receptor and enzyme systems mature with age, so a response can be stronger, weaker or different: some sedatives and antihistamines can excite a child rather than settle them. Always watch the response, not just the dose."
 }
];

type Block =
  | { kind: 'table'; title: string; head: string[]; rows: string[][] }
  | { kind: 'pearl'; label: string; text: string }
  | { kind: 'diagram'; id: string; title: string };

const BLOCKS: Block[] = [
 {
  "kind": "diagram",
  "id": "pathway",
  "title": "From Stimulus to Response"
 },
 {
  "kind": "table",
  "title": "The Four Targets",
  "head": [
   "Target",
   "Normal job",
   "How drugs affect it",
   "Example"
  ],
  "rows": [
   [
    "Receptor",
    "Recognises a ligand and starts a response",
    "Activated (agonist) or blocked (antagonist)",
    "Salbutamol at β2 receptors; beta blocker at β receptors"
   ],
   [
    "Ion channel",
    "Lets particular ions cross the membrane",
    "Blocked or opened, changing excitability",
    "Lidocaine blocks sodium channels"
   ],
   [
    "Transport protein",
    "Carries substances across membranes",
    "Inhibited, or used as a carrier",
    "Diuretics, digoxin and SSRIs; L-Dopa entering the brain"
   ],
   [
    "Enzyme",
    "Speeds up a chemical reaction",
    "Inhibited, so less product or slower breakdown",
    "Aspirin (COX), ACE inhibitors, statins, PDE inhibitors"
   ]
  ]
 },
 {
  "kind": "table",
  "title": "Agonist, Antagonist and Partial Agonist",
  "head": [
   "Drug type",
   "Affinity",
   "Intrinsic activity",
   "Effect"
  ],
  "rows": [
   [
    "Agonist",
    "High",
    "High",
    "Mimics the natural ligand and produces a response"
   ],
   [
    "Antagonist",
    "High",
    "None",
    "Binds but produces no effect, and blocks activation"
   ],
   [
    "Partial agonist",
    "Yes",
    "Partial",
    "Activates the receptor but cannot reach the maximum effect"
   ]
  ]
 },
 {
  "kind": "table",
  "title": "Where the Receptor Sits and How Fast It Acts",
  "head": [
   "Location",
   "How it works",
   "Speed",
   "Example"
  ],
  "rows": [
   [
    "Cell surface (extracellular)",
    "Ligand binds on the outside",
    "Often fast, especially if linked to an ion channel",
    "Neurotransmitters and many hormones"
   ],
   [
    "Intracellular",
    "Ligand crosses the membrane and binds inside",
    "Slower, longer-lasting, changes gene transcription",
    "Steroids, aldosterone"
   ],
   [
    "Metabotropic (G-protein)",
    "Surface receptor that triggers second messengers",
    "Amplified, moderate speed",
    "Adrenergic receptor, adenylyl cyclase, cAMP"
   ]
  ]
 },
 {
  "kind": "diagram",
  "id": "doseresponse",
  "title": "Potency and Efficacy"
 },
 {
  "kind": "table",
  "title": "Reversible, Irreversible and Prolonged Effects",
  "head": [
   "Interaction",
   "Meaning",
   "Example"
  ],
  "rows": [
   [
    "Reversible",
    "Effect fades when the drug leaves the receptor",
    "Ventolin"
   ],
   [
    "Irreversible",
    "Effect lasts until the body replaces the target",
    "Aspirin"
   ],
   [
    "Reversible binding, prolonged effect",
    "Drug leaves, but changes inside the cell continue",
    "Steroids"
   ]
  ]
 },
 {
  "kind": "diagram",
  "id": "adaptation",
  "title": "Adaptation: Down- and Up-Regulation"
 },
 {
  "kind": "table",
  "title": "Link the Mechanism to What You Monitor",
  "head": [
   "Drug or class",
   "What it does",
   "Monitor"
  ],
  "rows": [
   [
    "Diuretics",
    "Block ion transport in the kidney",
    "Fluid balance, urine output, BP, sodium, potassium, renal function"
   ],
   [
    "Digoxin",
    "Inhibits the sodium–potassium pump",
    "Pulse, rhythm, potassium, renal function, nausea, visual disturbance"
   ],
   [
    "SSRIs",
    "Block serotonin reuptake",
    "Mood, early suicidal ideation, serotonin syndrome risk with other serotonergic drugs"
   ],
   [
    "L-Dopa",
    "Uses a transporter to enter the brain",
    "Mobility and on/off effects, nausea, dyskinesia, timing with meals"
   ],
   [
    "Beta blockers",
    "Antagonise β receptors",
    "Pulse, BP, symptoms, over-blockade; do not stop suddenly"
   ],
   [
    "Salbutamol",
    "β2 agonist",
    "Breathing, wheeze, tremor, palpitations, tachycardia"
   ]
  ]
 },
 {
  "kind": "table",
  "title": "PK or PD Interaction?",
  "head": [
   "Type",
   "What changes",
   "Example"
  ],
  "rows": [
   [
    "Pharmacokinetic",
    "The amount of drug reaching or staying in the body (ADME)",
    "A CYP inhibitor raises another drug’s level"
   ],
   [
    "Pharmacodynamic",
    "What the drugs do to the body together, even at unchanged levels",
    "Two sedatives cause excess sedation"
   ]
  ]
 },
 {
  "kind": "pearl",
  "label": "Your checklist for any medicine",
  "text": "1. What is its target? 2. Does it activate, block, inhibit, open or close it? 3. What useful effect should I see? 4. How quickly? 5. What observations, symptoms or bloods should I monitor? 6. What would an excessive response look like? 7. Does it need to be reduced gradually rather than stopped suddenly?"
 },
 {
  "kind": "pearl",
  "label": "Study aid only",
  "text": "This page explains the principles. Always check the current BNFC or BNF and your local policy for mechanisms, cautions and interactions, and ask the prescriber or pharmacist if anything is unclear."
 }
];

const quizQuestions = [
 {
  "question": "Pharmacodynamics is best described as:",
  "options": [
   "What the body does to a drug",
   "What a drug does to the body",
   "How a drug is absorbed",
   "How a drug is made"
  ],
  "answer": 1,
  "explanation": "Pharmacodynamics is the effect of the drug on the body. Pharmacokinetics is the effect of the body on the drug."
 },
 {
  "question": "Which pair matches target and image correctly?",
  "options": [
   "Receptor = gate, channel = lock",
   "Receptor = lock, ion channel = gate",
   "Enzyme = gate, transporter = lock",
   "Transporter = lock, receptor = worker"
  ],
  "answer": 1,
  "explanation": "A receptor is the lock, an ion channel is a gate, a transporter is a carrier and an enzyme is a chemical worker."
 },
 {
  "question": "Which statement about ion channels is correct?",
  "options": [
   "Movement through an open channel uses ATP directly",
   "Movement through an open channel is passive, down an electrochemical gradient",
   "They only work for fat-soluble drugs",
   "They never change nerve conduction"
  ],
  "answer": 1,
  "explanation": "Open channels let ions flow passively, which is why blocking one, as lidocaine does with sodium channels, changes nerve and muscle activity quickly."
 },
 {
  "question": "An antagonist has:",
  "options": [
   "Low affinity and high intrinsic activity",
   "High affinity and no intrinsic activity",
   "High affinity and high intrinsic activity",
   "No affinity"
  ],
  "answer": 1,
  "explanation": "An antagonist binds well but does not activate the receptor, and blocks the natural ligand or an agonist."
 },
 {
  "question": "A drug is more potent than another but has a lower maximum effect. What does that mean?",
  "options": [
   "It is more effective overall",
   "It needs a smaller dose but has lower efficacy",
   "It cannot be used",
   "It has no receptor"
  ],
  "answer": 1,
  "explanation": "Potency is how much drug is needed. Efficacy is the maximum effect. They are independent."
 },
 {
  "question": "Why do steroids often take longer to work than a reliever inhaler?",
  "options": [
   "They bind irreversibly",
   "They act on intracellular receptors and change gene transcription",
   "They are not absorbed",
   "They are antagonists"
  ],
  "answer": 1,
  "explanation": "Steroids are lipid-soluble and change gene expression, so the effect is slower but longer-lasting."
 },
 {
  "question": "After long-term antagonist use, why can sudden stopping be dangerous?",
  "options": [
   "Receptors have been up-regulated, so the natural messenger can cause an exaggerated rebound",
   "Receptors have disappeared",
   "The drug becomes toxic",
   "Nothing happens"
  ],
  "answer": 0,
  "explanation": "The body builds extra receptors to compensate for the block. Removing the antagonist suddenly leaves the natural messenger acting on many receptors."
 },
 {
  "question": "Two sedating drugs are each at a normal dose but the patient is over-sedated. This is:",
  "options": [
   "A pharmacokinetic interaction",
   "A pharmacodynamic interaction",
   "An allergy",
   "A formulation error"
  ],
  "answer": 1,
  "explanation": "The effects combine at the level of the body, even if the drug levels are normal."
 },
 {
  "question": "Aspirin’s main target is:",
  "options": [
   "An ion channel",
   "COX enzymes",
   "A transporter",
   "An intracellular steroid receptor"
  ],
  "answer": 1,
  "explanation": "Aspirin inhibits COX, reducing prostaglandin production, which lowers pain, inflammation and fever."
 },
 {
  "question": "Why can a “selective” drug still cause side effects in another organ?",
  "options": [
   "Receptor subtypes are identical",
   "Selectivity is imperfect, and higher doses reach other subtypes or the same receptor elsewhere",
   "Side effects never occur",
   "Drugs are always selective"
  ],
  "answer": 1,
  "explanation": "No drug is perfectly selective, so an effect that is wanted in one tissue can be unwanted in another."
 }
];

const SOURCES = [
 {
  "citation": "Rang HP et al.",
  "title": "Rang and Dale’s Pharmacology",
  "href": "https://www.elsevier.com/"
 },
 {
  "citation": "BNF / BNF for Children (NICE)",
  "title": "Drug-specific mechanisms, cautions and interactions",
  "href": "https://bnfc.nice.org.uk/"
 },
 {
  "citation": "Simonsen T et al. (2006)",
  "title": "Illustrated Pharmacology for Nurses",
  "href": "https://www.routledge.com/"
 },
 {
  "citation": "NICE",
  "title": "Medicines optimisation: safe and effective use of medicines (NG5)",
  "href": "https://www.nice.org.uk/guidance/ng5"
 }
];

function doseResponse(c: number, emax: number, s = 55) {
  const pts: string[] = [];
  for (let x = 0; x <= 780; x += 10) {
    const y = 250 - (emax / (1 + Math.exp(-(x - c) / s))) * 2;
    pts.push(`${pts.length ? 'L' : 'M'}${(70 + x).toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PharmacodynamicsPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.pd-guide .pd-step, .pd-guide .pd-diagram, .pd-guide .pd-golden-cell, .pd-guide .pd-pearl'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('pd-reveal'); io.observe(el); }
    });
    return () => io.disconnect();
  }, []);


  const renderDiagram = (id: string) => {
    switch (id) {
      case 'pathway': return (
        <div className="pd-diagram">
          <svg viewBox="0 0 900 230" role="img" aria-label="Signalling chain: stimulus, first messenger, target receptor, channel, transporter or enzyme, second messenger, response. A medicine acts on the target by mimicking, enhancing or inhibiting it.">
            <defs>
              <marker id="pd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" style={{ fill: 'var(--ink-faint)' }} />
              </marker>
            </defs>
            {[['Stimulus', 'a change is detected'], ['First messenger', 'hormone or neurotransmitter'], ['Target', 'receptor, channel, carrier, enzyme'], ['Second messenger', 'cAMP, calcium, IP₃'], ['Response', 'the cell does something']].map(([label, sub], i) => {
              const x = 15 + i * 175;
              const hot = i === 2;
              return (
                <g key={label}>
                  <rect x={x} y={110} width={150} height={70} rx={2} style={{ fill: hot ? 'rgba(203, 174, 120, 0.22)' : 'var(--surface-page)', stroke: hot ? 'var(--gold-deep, #8a7350)' : 'var(--hairline-firm)', strokeWidth: 1 }} />
                  <text x={x + 75} y={140} textAnchor="middle" style={{ fill: 'var(--ink-strong)', fontFamily: "'Playfair Display', serif", fontSize: 15 }}>{label}</text>
                  <text x={x + 75} y={160} textAnchor="middle" style={{ fill: 'var(--ink-faint)', fontFamily: "'Inter', sans-serif", fontSize: 10 }}>{sub}</text>
                  {i < 4 && <line x1={x + 150} y1={145} x2={x + 175} y2={145} style={{ stroke: 'var(--ink-faint)', strokeWidth: 1.5 }} markerEnd="url(#pd-arrow)" />}
                </g>
              );
            })}
            <rect x={365} y={18} width={150} height={40} rx={2} style={{ fill: 'rgba(15, 110, 86, 0.10)', stroke: 'var(--teal-600)', strokeWidth: 1 }} />
            <text x={440} y={43} textAnchor="middle" style={{ fill: 'var(--teal-600)', fontFamily: "'Playfair Display', serif", fontSize: 15 }}>Medicine</text>
            <line x1={440} y1={58} x2={440} y2={106} style={{ stroke: 'var(--teal-600)', strokeWidth: 1.5, strokeDasharray: '5 4' }} markerEnd="url(#pd-arrow)" />
            <text x={452} y={88} style={{ fill: 'var(--teal-600)', fontFamily: "'Inter', sans-serif", fontSize: 11 }}>mimics, enhances or blocks</text>
          </svg>
          <p className="pd-diagram-caption">Medicines change a step in the body’s own signalling. They do not create a new system.</p>
        </div>
      );
      case 'doseresponse': return (
        <div className="pd-diagram">
          <svg viewBox="0 0 900 300" role="img" aria-label="Dose-response curves. Drug A is potent with full effect, drug B is less potent with the same full effect, drug C is a partial agonist with a lower maximum effect.">
            <line x1="70" y1="40" x2="70" y2="250" style={{ stroke: 'var(--ink-faint)', strokeWidth: 1 }} />
            <line x1="70" y1="250" x2="850" y2="250" style={{ stroke: 'var(--ink-faint)', strokeWidth: 1 }} />
            <line x1="70" y1="50" x2="850" y2="50" style={{ stroke: 'var(--hairline-firm)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <path d={doseResponse(280, 100)} fill="none" style={{ stroke: 'var(--gold-deep, #8a7350)', strokeWidth: 2.5 }} />
            <path d={doseResponse(470, 100)} fill="none" style={{ stroke: 'var(--teal-600)', strokeWidth: 2.5 }} />
            <path d={doseResponse(280, 55)} fill="none" style={{ stroke: 'var(--red-600)', strokeWidth: 2.5 }} />
            <text x="100" y="80" style={{ fill: 'var(--gold-deep, #8a7350)', fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600 }}>A: potent, full effect</text>
            <text x="100" y="102" style={{ fill: 'var(--teal-600)', fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600 }}>B: less potent, same full effect</text>
            <text x="100" y="124" style={{ fill: 'var(--red-600)', fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600 }}>C: partial agonist, lower ceiling</text>
            <text x="858" y="54" style={{ fill: 'var(--ink-faint)', fontFamily: "'Inter', sans-serif", fontSize: 11 }}>Emax</text>
            <text x="450" y="282" textAnchor="middle" style={{ fill: 'var(--ink-faint)', fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: '0.1em' }}>DOSE (LOG SCALE)</text>
            <text x="20" y="150" textAnchor="middle" transform="rotate(-90 20 150)" style={{ fill: 'var(--ink-faint)', fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: '0.1em' }}>EFFECT</text>
          </svg>
          <p className="pd-diagram-caption">A curve further left is more potent. A curve with a higher ceiling has greater efficacy.</p>
        </div>
      );
      case 'adaptation': return (
        <div className="pd-diagram">
          <svg viewBox="0 0 900 260" role="img" aria-label="Receptor adaptation: long-term agonist use reduces receptor numbers (down-regulation); long-term antagonist use increases them (up-regulation)">
            {[
              { x: 30, title: 'Long-term agonist', before: 6, after: 3, note: 'Down-regulation: fewer receptors', risk: 'Stop suddenly: withdrawal or loss of effect', tone: 'var(--red-600)' },
              { x: 470, title: 'Long-term antagonist', before: 4, after: 8, note: 'Up-regulation: more receptors', risk: 'Stop suddenly: exaggerated rebound', tone: 'var(--teal-600)' },
            ].map((p) => (
              <g key={p.title}>
                <text x={p.x} y={34} style={{ fill: 'var(--ink-strong)', fontFamily: "'Playfair Display', serif", fontSize: 18 }}>{p.title}</text>
                <text x={p.x} y={70} style={{ fill: 'var(--ink-faint)', fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.1em' }}>BEFORE</text>
                {Array.from({ length: p.before }).map((_, i) => (
                  <circle key={`b${i}`} cx={p.x + 80 + i * 32} cy={66} r={10} style={{ fill: 'rgba(203, 174, 120, 0.6)', stroke: 'var(--gold-deep, #8a7350)', strokeWidth: 1 }} />
                ))}
                <text x={p.x} y={124} style={{ fill: 'var(--ink-faint)', fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.1em' }}>AFTER</text>
                {Array.from({ length: p.after }).map((_, i) => (
                  <circle key={`a${i}`} cx={p.x + 80 + i * 32} cy={120} r={10} style={{ fill: 'rgba(203, 174, 120, 0.6)', stroke: 'var(--gold-deep, #8a7350)', strokeWidth: 1 }} />
                ))}
                <text x={p.x} y={182} style={{ fill: p.tone, fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600 }}>{p.note}</text>
                <text x={p.x} y={204} style={{ fill: 'var(--ink-soft)', fontFamily: "'Inter', sans-serif", fontSize: 12 }}>{p.risk}</text>
              </g>
            ))}
          </svg>
          <p className="pd-diagram-caption">The body adapts to constant stimulation or blockade, which is why some drugs need to be reduced gradually.</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="pd-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pd-wrap">
        <Link href="/hub" className="pd-back">
          <span className="pd-back-arrow">&larr;</span>
          Nursing Hub
        </Link>

        <p className="pd-kicker">{"Pharmacology · Children’s & Adult Nursing"}</p>
        <h1 className="pd-headline">Pharmacodynamics</h1>
        <p className="pd-standfirst">{"What a drug does to the body: the targets it acts on, how it changes the body’s own signalling, and why knowing the mechanism lets you predict the effect, the side effects and what to monitor."}</p>
        <p className="pd-byline">{"Children’s & adult nursing · The Nurse Lab"}</p>
        <svg className="pd-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,30 L180,30 L196,30 L204,24 L212,30 L232,30 L238,36 L246,4 L254,44 L260,30 L280,30 L296,20 L312,30 L520,30 L536,30 L544,24 L552,30 L572,30 L578,36 L586,4 L594,44 L600,30 L620,30 L636,20 L652,30 L1000,30" fill="none" pathLength={1} />
        </svg>
        <EditorialSaveButton
          hubItemId="pharmacodynamics"
          hubItemTitle="Pharmacodynamics"
        />

        <div className="pd-pearl" style={{ marginBottom: '40px' }}>
          <p className="pd-pearl-label">Student note</p>
          <p>{"Pharmacodynamics (PD) is the effect a drug has on the body. A receptor is a protein that binds a specific ligand. A ligand is anything that binds a receptor, whether made by the body (endogenous) or a drug (exogenous). Affinity is how strongly a ligand binds. Intrinsic activity is its ability to switch the receptor on once bound. A first messenger carries a signal to a cell, and a second messenger carries it on inside the cell."}</p>
        </div>

        <div className="pd-golden">
          {GOLDEN.map((cell) => (
            <div key={cell.n} className="pd-golden-cell">
              <span className="pd-golden-numeral">{cell.n}</span>
              <p className="pd-golden-title">{cell.title}</p>
              <p className="pd-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="pd-step">
            <div className="pd-step-sidebar">
              <span className={`pd-step-letter pd-letter-${section.colour}`}>{section.number}</span>
              <span className={`pd-step-badge pd-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="pd-step-content">
              <h2 className="pd-step-name">{section.name}</h2>
              <p className="pd-step-question">{section.question}</p>

              <div className="pd-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="pd-content-col">
                    <p className="pd-col-header">{col.header}</p>
                    <ul className="pd-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="pd-redflags-label">Watch for</p>
                  <div className="pd-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="pd-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="pd-pearl">
                  <p className="pd-pearl-label">Clinical pearl</p>
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
                <h2 className="pd-section-title">{block.title}</h2>
                <div className="pd-table-wrap">
                  <table className="pd-table" style={{ marginBottom: '32px' }}>
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
              <div key={idx} className="pd-pearl" style={{ marginBottom: '32px' }}>
                <p className="pd-pearl-label">{block.label}</p>
                <p>{block.text}</p>
              </div>
            );
          }
          return (
            <div key={idx}>
              <h2 className="pd-section-title">{block.title}</h2>
              {renderDiagram(block.id)}
            </div>
          );
        })}

        <h2 className="pd-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Pharmacodynamics" questions={quizQuestions} />

        <SourceLinks sources={SOURCES} />
      </div>
    </div>
  );
}
