'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.pk-guide *, .pk-guide *::before, .pk-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.pk-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.pk-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.pk-back {
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
.pk-back:hover { color: var(--ink-soft); }
.pk-back-arrow { font-style: normal; }

/* Masthead */
.pk-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.pk-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.pk-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.pk-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

/* Golden rules grid */
.pk-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.pk-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.pk-golden-cell:last-child { border-right: none; }

.pk-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.pk-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.pk-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.pk-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.pk-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.pk-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.pk-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.pk-step-content {
  padding-left: 32px;
}

.pk-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.pk-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

/* 4-column content grid */
.pk-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.pk-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.pk-content-col:last-child { border-right: none; }

.pk-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.pk-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pk-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.pk-col-list li::before {
  content: '\u2013';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

/* Red flags */
.pk-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.pk-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.pk-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.pk-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.pk-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.pk-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.pk-section-title {
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
.pk-table-wrap { overflow-x: auto; }
.pk-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.pk-table th {
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
.pk-table th:last-child { border-right: none; }

.pk-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.pk-table td:last-child { border-right: none; }
.pk-table tr:last-child td { border-bottom: none; }
.pk-table td:first-child { font-weight: 400; color: var(--ink-mid); }

/* 2-col grid */
.pk-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.pk-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.pk-grid-2-cell:nth-child(2n) { border-right: none; }

.pk-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

/* Step colour system */
.pk-letter-1 { color: var(--blue-600); }
.pk-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.pk-letter-2 { color: var(--teal-600); }
.pk-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.pk-letter-3 { color: var(--coral-600); }
.pk-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.pk-letter-4 { color: var(--purple-600); }
.pk-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.pk-letter-5 { color: var(--gray-600); }
.pk-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.pk-letter-6 { color: #8B5E3C; }
.pk-badge-6 { background: var(--surface-sunken); color: #6B4729; }

/* Flow path mono */
.pk-mono {
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
.pk-diagram {
  border: 0.5px solid var(--hairline-firm);
  padding: 20px 16px 14px;
  margin-bottom: 18px;
  background: var(--surface-page);
}
.pk-diagram svg { display: block; width: 100%; height: auto; }
.pk-diagram-caption {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-align: center;
  margin-top: 10px;
}
.pk-diagram-key {
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.pk-diagram-key span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
}
.pk-diagram-key i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* Responsive */
@media (max-width: 860px) {
  .pk-wrap { padding: 24px 20px 48px; }
  .pk-headline { font-size: 34px; }
  .pk-golden { grid-template-columns: repeat(2, 1fr); }
  .pk-golden-cell:nth-child(2) { border-right: none; }
  .pk-golden-cell:nth-child(1), .pk-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .pk-step { grid-template-columns: 64px 1fr; }
  .pk-step-letter { font-size: 48px; }
  .pk-content-grid { grid-template-columns: repeat(2, 1fr); }
  .pk-content-col:nth-child(2) { border-right: none; }
  .pk-content-col:nth-child(1), .pk-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .pk-grid-2 { grid-template-columns: 1fr; }
  .pk-grid-2-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .pk-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .pk-golden { grid-template-columns: 1fr; }
  .pk-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .pk-golden-cell:last-child { border-bottom: none; }
  .pk-content-grid { grid-template-columns: 1fr; }
  .pk-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .pk-content-col:last-child { border-bottom: none; }
  .pk-step { grid-template-columns: 52px 1fr; }
  .pk-step-letter { font-size: 38px; }
  .pk-step-content { padding-left: 18px; }
}
/* ── Polish layer ───────────────────────────────────────────── */
.pk-kicker { color: var(--gold-deep, #8a7350); }
.pk-headline { font-size: 60px; }
.pk-byline { border-bottom: none; padding-bottom: 6px; margin-bottom: 0; }
.pk-pulse { display: block; width: 100%; height: 40px; margin-bottom: 40px; overflow: visible; }
.pk-pulse path { stroke: var(--gold, #cbae78); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; animation: pk-pulse-draw 2.6s ease-out 0.3s forwards; }
@keyframes pk-pulse-draw { to { stroke-dashoffset: 0; } }
.pk-golden { gap: 14px; border: none; }
.pk-golden-cell { border: 0.5px solid var(--hairline-firm); border-radius: 2px; background: var(--surface-page); transition: transform 0.2s ease, border-color 0.2s ease; }
.pk-golden-cell:last-child { border-right: 0.5px solid var(--hairline-firm); }
.pk-golden-cell:hover { transform: translateY(-2px); border-color: var(--gold); }
.pk-golden-numeral { color: var(--gold); font-size: 34px; }
.pk-section-title { border: none; padding: 18px 0 0; margin-top: 56px; font-size: 28px; position: relative; }
.pk-section-title::before { content: ''; position: absolute; top: 0; left: 0; width: 44px; height: 3px; border-radius: 999px; background: var(--gold); }
.pk-content-grid, .pk-table { border-radius: 2px; }
.pk-content-grid { overflow: hidden; border-color: var(--hairline-firm); }
.pk-table { border-collapse: separate; border-spacing: 0; overflow: hidden; border-color: var(--hairline-firm); }
.pk-table th { background: transparent; color: var(--gold-deep, #8a7350); border-bottom-color: var(--hairline-firm); }
.pk-table td { padding: 13px 16px; line-height: 1.65; }
.pk-table td:first-child { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; color: var(--ink-strong); }
.pk-table tbody tr:nth-child(even) td { background: rgba(203, 174, 120, 0.06); }
.pk-table tbody tr:hover td { background: rgba(203, 174, 120, 0.14); }
.pk-step { border-top-color: var(--hairline-soft); }
.pk-step-letter { text-shadow: none; }
.pk-step-name { font-size: 34px; }
.pk-step-badge, .pk-red-pill { border-radius: 999px; }
.pk-pearl { background: transparent; border: 0.5px solid var(--hairline-firm); border-left: 3px solid var(--gold); border-radius: 2px; padding: 18px 24px; }
.pk-pearl-label { color: var(--gold-deep, #8a7350); font-size: 10px; letter-spacing: 0.18em; margin-bottom: 8px; }
.pk-pearl p { color: var(--ink-mid); font-size: 13.5px; line-height: 1.75; }
.pk-diagram { border-radius: 2px; padding: 28px; border-color: var(--hairline-firm); background: var(--surface-page); }
.pk-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.pk-reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .pk-pulse path { animation: none; stroke-dashoffset: 0; }
  .pk-reveal { opacity: 1; transform: none; transition: none; }
}
@media (max-width: 860px) { .pk-headline { font-size: 36px; } .pk-step-name { font-size: 26px; } .pk-diagram { padding: 18px; } }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const GOLDEN = [
 {
  "n": "01",
  "title": "ADME",
  "text": "Absorption, Distribution, Metabolism, Excretion. Every dose goes through all four, and each can change the level."
 },
 {
  "n": "02",
  "title": "Same dose, different level",
  "text": "The chart shows the dose given, not the dose absorbed. Ask: too little, enough, or too much?"
 },
 {
  "n": "03",
  "title": "Half-life rule",
  "text": "About 5–6 half-lives for a drug’s effect to stop. Long half-life means it is still active days later."
 },
 {
  "n": "04",
  "title": "Not small adults",
  "text": "Babies and older adults differ at every ADME stage, so doses and monitoring differ too."
 }
];

const SECTIONS = [
 {
  "number": "1",
  "colour": "1",
  "name": "Absorption",
  "question": "Did enough drug actually get into the blood?",
  "cols": [
   {
    "header": "What it means",
    "items": [
     "Absorption is how a drug gets from where it is given into the circulation",
     "If it is poor, delayed or unpredictable the patient can get too little drug, a late effect, or a sudden surge later",
     "The drug must dissolve in watery gut fluid, then cross fatty cell membranes, so it needs some of both kinds of solubility",
     "IV skips absorption and is effectively 100% bioavailable"
    ]
   },
   {
    "header": "Route matters",
    "items": [
     "Enteral (oral, rectal): slower and less predictable, but safer and non-invasive",
     "Parenteral (buccal, sublingual, topical, inhaled, SC, IV and others): avoids the gut or reaches a target directly",
     "Sublingual and buccal skip the gut and the liver’s first pass, so onset is faster",
     "IV cannot be taken back: an adverse reaction appears quickly"
    ]
   },
   {
    "header": "Gut factors",
    "items": [
     "Oesophageal passage, gut pH, how fast the stomach empties, and food and drink",
     "“With food” and “on an empty stomach” are pharmacokinetic instructions, not conveniences",
     "Efflux proteins in the gut wall pump some drug back out, like bouncers",
     "Vomiting, diarrhoea, enteral feeds and poor gut perfusion make oral absorption unreliable"
    ]
   },
   {
    "header": "In children",
    "items": [
     "Babies are about 80% water, so a water-soluble drug is spread thinner and can need a larger mg/kg dose",
     "Neonatal skin is thinner and more permeable, with more surface per kg, so topical steroids can be absorbed systemically and are avoided",
     "Neonates have less stomach acid, so oral absorption differs",
     "IM can be poorly absorbed and damaging, and WHO advice is to keep it for emergencies in paediatrics"
    ]
   }
  ],
  "redFlags": [
   "Vomited soon after an oral dose",
   "Shock or poor gut perfusion on an oral drug",
   "Crushed modified-release tablet",
   "Topical steroid over a large area in a neonate"
  ],
  "pearl": "When a medicine “doesn’t work”, do not jump straight to “wrong drug”. Ask whether it was absorbed: vomiting, feeds, food, diarrhoea, altered formulation, poor perfusion, or another drug changing gut pH or motility."
 },
 {
  "number": "2",
  "colour": "2",
  "name": "Distribution",
  "question": "Where does the drug go once it is in the blood?",
  "cols": [
   {
    "header": "What it means",
    "items": [
     "The amount of drug in tissues, fluids and spaces, and how it moves between plasma and tissue until it settles",
     "Well-perfused organs such as the brain, heart, liver and kidneys receive drug first",
     "In shock, dehydration or hypothermia, perfusion changes and effects become less predictable",
     "Volume of distribution (Vd) shows how far a drug leaves the blood"
    ]
   },
   {
    "header": "What decides it",
    "items": [
     "Lipid solubility: fat-soluble drugs cross membranes and enter tissue and fat more easily",
     "Size: big molecules cross poorly, which is one reason insulin cannot be taken like a small tablet",
     "Charge: ionised drugs stay water-soluble and cross membranes poorly",
     "pH changes how much of a weak acid or base is ionised"
    ]
   },
   {
    "header": "Protein binding",
    "items": [
     "Many drugs ride on albumin, like a taxi",
     "Only the free (unbound) drug can leave the blood and act",
     "Bound drug is a reservoir that releases more as free drug is used up",
     "Warfarin is 98–99% bound, so a small drop in binding is a big rise in free drug"
    ]
   },
   {
    "header": "Low albumin",
    "items": [
     "Malnutrition, liver disease, inflammation, nephrotic syndrome, burns and severe illness",
     "Fewer binding sites means more free drug and more toxicity risk",
     "One drug can displace another from albumin",
     "Watch for bleeding, sedation and toxicity, especially with warfarin, phenytoin and diazepam"
    ]
   }
  ],
  "redFlags": [
   "Malnourished or very unwell patient on a highly bound drug",
   "Two highly protein-bound drugs started together",
   "Fat-soluble sedative in an older adult"
  ],
  "pearl": "A high volume of distribution means the drug has left the blood and is sitting in tissue. The blood level can look low while the total in the body is high, and the drug can take a long time to clear."
 },
 {
  "number": "3",
  "colour": "3",
  "name": "Metabolism",
  "question": "Is the liver changing this drug at the expected speed?",
  "cols": [
   {
    "header": "What it means",
    "items": [
     "Mostly in the liver, changing drugs into forms that are easier to excrete",
     "It is not always detoxification: it can inactivate a drug, switch on a prodrug or create a toxic metabolite",
     "Phase I (often CYP450 enzymes) modifies the molecule",
     "Phase II adds a water-soluble tag, such as glucuronic acid, so it can leave in urine or bile"
    ]
   },
   {
    "header": "CYP interactions",
    "items": [
     "CYP3A4 handles more than 60% of drugs",
     "Inhibitors jam the enzyme, so the level rises and toxicity risk grows",
     "Inducers rev it up, so the level falls and treatment can fail",
     "Grapefruit inhibits CYP3A4, and St John’s Wort induces it"
    ]
   },
   {
    "header": "Paracetamol",
    "items": [
     "Mostly metabolised safely, but a small part is turned into NAPQI",
     "NAPQI is toxic, and glutathione normally mops it up",
     "In overdose glutathione runs out and NAPQI damages liver cells",
     "The patient can feel well early while the liver is already injured, so early treatment matters"
    ]
   },
   {
    "header": "Age and liver disease",
    "items": [
     "Infant livers have fewer enzyme systems, so elimination is slower and half-lives are longer",
     "Babies, especially premature ones, have less protein, so more drug is unbound",
     "Liver disease, heart failure, shock and ageing reduce liver blood flow and slow metabolism",
     "Codeine is a prodrug switched on by CYP2D6 and does not work the same in everyone"
    ]
   }
  ],
  "redFlags": [
   "New antibiotic, antifungal or amiodarone started",
   "Enzyme inducer added, such as rifampicin or carbamazepine",
   "Paracetamol overdose history"
  ],
  "pearl": "Ask: has anything new been started? Medicines, antibiotics, antifungals, herbal products, supplements, even grapefruit. A patient will rarely think of these as “drug interactions”."
 },
 {
  "number": "4",
  "colour": "4",
  "name": "Excretion",
  "question": "Can the patient clear the drug safely?",
  "cols": [
   {
    "header": "What it means",
    "items": [
     "Drugs leave by redistribution, liver metabolism and kidney excretion",
     "Other routes: bile, faeces, lungs, saliva, sweat, breast milk and hair",
     "Reduced clearance lengthens half-life and lets drug build up with repeat doses",
     "Accumulation is what turns a usual dose into toxicity"
    ]
   },
   {
    "header": "The kidney",
    "items": [
     "Filtration at the glomerulus, then secretion, reabsorption, and finally urine",
     "Water-soluble drugs are largely passed in urine without being reabsorbed",
     "Lipid-soluble drugs are reabsorbed more easily, so they stay longer",
     "Some drugs go out in bile, are freed again by gut bacteria and reabsorbed, which is enterohepatic cycling"
    ]
   },
   {
    "header": "Infants",
    "items": [
     "Kidney filtration is only 30–40% of the adult level",
     "Tubular secretion is about 30% of the adult level",
     "Half-lives are longer, so doses may need longer intervals",
     "A dehydrated child clears drugs more slowly still"
    ]
   },
   {
    "header": "Older adults",
    "items": [
     "GFR falls by around 30% by age 65",
     "Less muscle means less creatinine, so a “normal” creatinine can hide poor filtration",
     "Use eGFR or CrCl and the trend, not creatinine alone",
     "Digoxin’s half-life lengthens, raising toxicity risk"
    ]
   }
  ],
  "redFlags": [
   "Falling urine output",
   "Dehydration on a renally cleared drug",
   "Confusion after a usual dose in an older adult"
  ],
  "pearl": "Urine output is a drug-safety observation as well as a fluid observation. If it falls, ask whether the next dose of a renally cleared drug is still safe before you give it."
 },
 {
  "number": "5",
  "colour": "5",
  "name": "Half-life & Levels",
  "question": "How long will it last, and how narrow is the safe range?",
  "cols": [
   {
    "header": "Bioavailability",
    "items": [
     "The degree to which a drug is absorbed and reaches the general circulation",
     "IV is 100%",
     "Oral is lower because of incomplete absorption, gut wall metabolism and first-pass loss",
     "A bigger oral dose does not mean oral is stronger. Less of it gets in"
    ]
   },
   {
    "header": "Half-life (T½)",
    "items": [
     "The time for the amount of drug in the body to fall by 50%",
     "About 5–6 half-lives for the effect to stop",
     "It predicts duration and helps set the dosing interval",
     "A long half-life means the drug can be active for days after stopping"
    ]
   },
   {
    "header": "Therapeutic index",
    "items": [
     "The margin of safety between a useful dose and a toxic one",
     "Too low: no effect. Therapeutic range: intended effect. Too high: toxic",
     "Narrow index drugs include digoxin, warfarin, lithium, aminoglycosides and some anti-epileptics",
     "Narrow index means closer monitoring"
    ]
   },
   {
    "header": "Accumulation",
    "items": [
     "A dose given before the last has cleared builds up",
     "Highest risk in renal impairment, liver impairment, older adults and infants",
     "Missed doses and stopping suddenly matter for the same reason",
     "It also decides when steady state is reached"
    ]
   }
  ],
  "redFlags": [
   "Level above the target range",
   "Symptoms of toxicity on a narrow-index drug",
   "Dose not adjusted for renal function"
  ],
  "pearl": "After each half-life, half of what is left goes. That is 50%, 25%, 12.5%, 6.25% and about 3%, which is why it takes around 5–6 half-lives for an effect to fade."
 },
 {
  "number": "6",
  "colour": "6",
  "name": "At the Bedside",
  "question": "How does PK change what you do?",
  "cols": [
   {
    "header": "Before giving",
    "items": [
     "Check the route and the exact form, not just the name",
     "Think about the patient: age, weight, hydration, pregnancy, liver and kidney function",
     "Look for interactions: grapefruit, St John’s Wort, antibiotics, antifungals, anticonvulsants, anticoagulants, sedatives",
     "Know which of your patient’s drugs are narrow-index, highly protein-bound or renally cleared"
    ]
   },
   {
    "header": "While monitoring",
    "items": [
     "Watch for effect and toxicity: sedation, pain, BP, pulse, breathing, urine output, bleeding, confusion, electrolytes",
     "Use blood results sensibly: renal and liver function, albumin, and drug levels where used",
     "Record dose and sample times exactly"
    ]
   },
   {
    "header": "Polypharmacy",
    "items": [
     "More than 5 medicines is a rough marker of a heavier drug load",
     "More medicines means more chances for interactions and errors",
     "Deprescribing is tapering or stopping to reduce that load. It is not simply deleting a drug",
     "Patients must not stop medicines suddenly without advice"
    ]
   },
   {
    "header": "Educate and escalate",
    "items": [
     "Explain timing with food, missed doses and what to avoid",
     "Teach the toxicity signs to report",
     "Escalate a dose that is too high for the kidneys, poor absorption, swallowing problems and polypharmacy concerns"
    ]
   }
  ],
  "redFlags": [
   "Toxicity signs after a usual dose",
   "Unexpected lack of effect",
   "New drug added to a complex regimen"
  ],
  "pearl": "The right dose is not enough. The same dose can give different blood levels depending on absorption, protein binding, the liver, the kidneys and interactions, so link every drug you give to an assessment."
 }
];

type Block =
  | { kind: 'table'; title: string; head: string[]; rows: string[][] }
  | { kind: 'pearl'; label: string; text: string }
  | { kind: 'diagram'; id: string; title: string };

const BLOCKS: Block[] = [
 {
  "kind": "table",
  "title": "Why the Same Dose Behaves Differently",
  "head": [
   "Stage",
   "What can vary",
   "Example"
  ],
  "rows": [
   [
    "Absorption",
    "Vomiting, diarrhoea, gut motility, pH, feeds, food, perfusion",
    "A child vomits ten minutes after an oral analgesic"
   ],
   [
    "Distribution",
    "Albumin, oedema, dehydration, body fat and water, tissue perfusion",
    "Low albumin raises free warfarin"
   ],
   [
    "Metabolism",
    "Liver disease, immature enzymes, genetics, CYP inhibitors and inducers",
    "Grapefruit with a CYP3A4 drug"
   ],
   [
    "Excretion",
    "GFR, dehydration, renal disease, immature or ageing kidneys",
    "A renally cleared drug in renal impairment"
   ]
  ]
 },
 {
  "kind": "pearl",
  "label": "Clinical pearl",
  "text": "Every prescribed dose can lead to one of three outcomes. Too little drug means treatment failure, pain not relieved or infection untreated. Enough drug means the intended effect with acceptable side effects. Too much drug means toxicity: sedation, bleeding, hypotension, kidney injury, respiratory depression or arrhythmias."
 },
 {
  "kind": "diagram",
  "id": "curve",
  "title": "The Journey of One Dose"
 },
 {
  "kind": "diagram",
  "id": "firstpass",
  "title": "First-Pass Effect"
 },
 {
  "kind": "table",
  "title": "Routes Compared",
  "head": [
   "Route",
   "Speed of onset",
   "What to know"
  ],
  "rows": [
   [
    "Intravenous (IV)",
    "Immediate",
    "100% reaches the blood. Fastest, and errors cannot be undone quickly."
   ],
   [
    "Intramuscular (IM)",
    "Fast to moderate",
    "Depends on muscle blood flow. Can be poorly absorbed, and WHO advice is to keep it for emergencies in babies and children."
   ],
   [
    "Subcutaneous (SC)",
    "Slower",
    "Slower and steadier than IM."
   ],
   [
    "Oral",
    "Slowest of the common routes",
    "Affected by food, vomiting, gut transit and first-pass metabolism."
   ],
   [
    "Buccal / sublingual",
    "Fast",
    "Absorbed through the mouth lining and skips the first pass."
   ],
   [
    "Rectal",
    "Variable",
    "Partly avoids first pass. Useful when oral is not possible."
   ],
   [
    "Inhaled",
    "Fast, local",
    "Acts on the airways over a large surface. Technique changes the dose delivered."
   ],
   [
    "Topical / transdermal",
    "Slow and steady",
    "Absorption rises with heat, broken skin and, in neonates, thin skin."
   ]
  ]
 },
 {
  "kind": "table",
  "title": "When the Level Changes: Cause to Check",
  "head": [
   "Scenario",
   "What changes",
   "Why the level changes",
   "What you may see",
   "What to check"
  ],
  "rows": [
   [
    "Vomiting after an oral dose",
    "Absorption falls",
    "The drug may leave the stomach before it dissolves and crosses the gut wall",
    "Symptoms continue",
    "Time of dose and vomit, reassess, ask before repeating"
   ],
   [
    "Shock or poor gut perfusion",
    "Oral absorption unreliable",
    "Blood is diverted to vital organs, so less reaches the gut",
    "Delayed or reduced effect",
    "ABCDE, perfusion, urine output, escalation"
   ],
   [
    "Sublingual or buccal dose",
    "Faster absorption, less first pass",
    "Drug enters the circulation without the gut and liver first",
    "Quicker, stronger effect",
    "Correct technique, do not let it be swallowed"
   ],
   [
    "Low albumin",
    "More free drug",
    "Fewer binding sites are available",
    "Stronger effect, toxicity",
    "Albumin, nutrition, bleeding, sedation"
   ],
   [
    "CYP inhibitor added",
    "Metabolism falls",
    "The enzyme is blocked",
    "Level rises, exaggerated effect",
    "Recent antibiotics, antifungals, grapefruit, herbal products"
   ],
   [
    "CYP inducer added",
    "Metabolism rises",
    "The enzyme works faster",
    "Level falls, treatment fails",
    "St John’s Wort, rifampicin, carbamazepine, phenytoin"
   ],
   [
    "Renal impairment",
    "Excretion falls",
    "Less drug is filtered or secreted",
    "Longer half-life, accumulation",
    "eGFR/CrCl, urine output, hydration, dose adjustment"
   ],
   [
    "Older adult, normal creatinine",
    "Hidden fall in clearance",
    "Low muscle mass makes creatinine look normal",
    "Toxicity at a usual dose",
    "eGFR/CrCl, frailty, trend, symptoms"
   ]
  ]
 },
 {
  "kind": "table",
  "title": "Volume of Distribution",
  "head": [
   "Drug",
   "Vd (L/kg)",
   "Fat solubility",
   "What it means"
  ],
  "rows": [
   [
    "Paracetamol",
    "0.9",
    "0.91",
    "Moderate distribution"
   ],
   [
    "Propofol",
    "60",
    "3.81",
    "Very fat-soluble and spreads widely"
   ],
   [
    "Simvastatin",
    "about 124",
    "4.5",
    "Very high distribution into tissue"
   ]
  ]
 },
 {
  "kind": "pearl",
  "label": "Clinical pearl",
  "text": "Vd compares how much of the drug is in the tissues with how much is in the plasma. If a drug stayed only in the blood of a 70 kg adult with about 3 L of blood, Vd would be roughly 3 ÷ 70 = 0.04 L/kg. High-Vd drugs are harder to remove quickly, because most of the drug is outside the plasma."
 },
 {
  "kind": "table",
  "title": "CYP3A4: Substrates, Inhibitors and Inducers",
  "head": [
   "Group",
   "Examples"
  ],
  "rows": [
   [
    "Substrates (broken down by CYP3A4)",
    "Fentanyl, buprenorphine, oxycodone, methadone, diazepam, midazolam, metoprolol, losartan, amlodipine, rivaroxaban, apixaban, tacrolimus"
   ],
   [
    "Inhibitors (level rises)",
    "Amiodarone, cimetidine, azole antifungals, diltiazem, verapamil, erythromycin, clarithromycin, fluoxetine, isoniazid, protease inhibitors, grapefruit"
   ],
   [
    "Inducers (level falls)",
    "St John’s Wort, phenytoin, carbamazepine, rifampicin, dexamethasone, pioglitazone"
   ]
  ]
 },
 {
  "kind": "diagram",
  "id": "halflife",
  "title": "Half-Life in Practice"
 },
 {
  "kind": "table",
  "title": "Narrow Therapeutic Index: What to Monitor",
  "head": [
   "Drug",
   "Monitor"
  ],
  "rows": [
   [
    "Digoxin",
    "Pulse, nausea, visual changes, confusion, potassium, renal function"
   ],
   [
    "Warfarin",
    "INR, bleeding, bruising, diet and interaction changes"
   ],
   [
    "Lithium",
    "Levels, renal and thyroid function, dehydration, tremor, confusion"
   ],
   [
    "Aminoglycosides (such as gentamicin)",
    "Levels, renal function, hearing and balance"
   ]
  ]
 },
 {
  "kind": "table",
  "title": "Babies, Children and Older Adults",
  "head": [
   "Stage",
   "Babies and children",
   "Older adults"
  ],
  "rows": [
   [
    "Absorption",
    "Less stomach acid, thin permeable skin, unpredictable IM",
    "Less gastric acid, altered motility, slower oral absorption"
   ],
   [
    "Distribution",
    "About 80% water in infants; less protein; blood–brain barrier not fully mature until around a year",
    "Less body water, more fat, less albumin"
   ],
   [
    "Metabolism",
    "Fewer enzyme systems, slower elimination, longer half-lives",
    "Reduced liver blood flow"
   ],
   [
    "Excretion",
    "Filtration about 30–40% and secretion about 30% of adult level",
    "GFR about 30% lower by 65, misleading creatinine"
   ]
  ]
 },
 {
  "kind": "pearl",
  "label": "Study aid only",
  "text": "This page explains the principles. Always check the current BNFC or BNF and your local policy for doses, monitoring and interactions, and ask the prescriber or pharmacist if anything is unclear."
 }
];

const quizQuestions = [
 {
  "question": "Pharmacokinetics is best described as:",
  "options": [
   "What a drug does to the body",
   "What the body does to a drug",
   "The side effects of a drug",
   "How drugs are made"
  ],
  "answer": 1,
  "explanation": "Pharmacokinetics is the effect of the body on the drug: ADME. Pharmacodynamics is the effect of the drug on the body."
 },
 {
  "question": "Why can a sublingual medicine work faster than the same drug swallowed?",
  "options": [
   "It is stronger",
   "It bypasses the gut and the liver’s first pass, so more reaches the circulation quickly",
   "It is absorbed more slowly",
   "It is metabolised faster"
  ],
  "answer": 1,
  "explanation": "Sublingual and buccal drugs enter the circulation through the mouth lining without going through the gut and portal vein to the liver first."
 },
 {
  "question": "A child vomits ten minutes after an oral analgesic. What is the best response?",
  "options": [
   "Repeat the full dose straight away",
   "Assume the drug has worked",
   "Document timings, reassess, and check guidance or ask before repeating",
   "Give the next dose early"
  ],
  "answer": 2,
  "explanation": "Vomiting may have reduced absorption, but you cannot tell how much. Record the timing, reassess and ask before repeating."
 },
 {
  "question": "Why does low albumin increase the risk of toxicity with a highly protein-bound drug?",
  "options": [
   "The liver stops working",
   "More of the drug is free and active",
   "The kidneys clear it faster",
   "The drug is not absorbed"
  ],
  "answer": 1,
  "explanation": "Only free drug is active. With fewer binding sites, a larger fraction is free, which raises the effect and the risk."
 },
 {
  "question": "A CYP3A4 inhibitor (such as clarithromycin or grapefruit) is added to a CYP3A4 substrate. What is the likely result?",
  "options": [
   "The level falls and the drug fails",
   "The level rises and toxicity risk increases",
   "Nothing changes",
   "The drug is absorbed less"
  ],
  "answer": 1,
  "explanation": "Inhibitors slow metabolism, so more active drug stays in the body and the level rises."
 },
 {
  "question": "An older adult has toxicity signs on a renally cleared drug but a normal creatinine. Why?",
  "options": [
   "Creatinine is always accurate",
   "Low muscle mass can make creatinine look normal despite reduced filtration",
   "Their kidneys work better with age",
   "The drug is not renally cleared"
  ],
  "answer": 1,
  "explanation": "Creatinine comes from muscle. Less muscle means less creatinine, so use eGFR or CrCl and the trend."
 },
 {
  "question": "Roughly how many half-lives does it take for a drug’s effect to stop?",
  "options": [
   "1",
   "2",
   "5–6",
   "20"
  ],
  "answer": 2,
  "explanation": "After about 5–6 half-lives only around 3% of the drug remains, so the effect has effectively stopped."
 },
 {
  "question": "Why do infants often need longer dosing intervals for kidney-cleared drugs?",
  "options": [
   "Their kidneys filter only about 30–40% of the adult amount",
   "They have too much albumin",
   "They absorb less",
   "Their liver is overactive"
  ],
  "answer": 0,
  "explanation": "Immature filtration and secretion prolong half-life, so drug can accumulate if given too often."
 },
 {
  "question": "Which statement about the first-pass effect is correct?",
  "options": [
   "It affects IV drugs most",
   "Intestinal and hepatic enzymes can break down part of an oral dose before it reaches the general circulation",
   "It only happens in children",
   "It increases bioavailability"
  ],
  "answer": 1,
  "explanation": "First pass lowers the bioavailability of many oral drugs, which is why oral doses can be larger than IV doses."
 },
 {
  "question": "Which is a narrow therapeutic index drug?",
  "options": [
   "Paracetamol",
   "Digoxin",
   "Vitamin C",
   "Saline"
  ],
  "answer": 1,
  "explanation": "Digoxin has a small gap between a useful and toxic level, so levels, pulse and potassium need monitoring."
 }
];

const SOURCES = [
 {
  "citation": "Simonsen T et al. (2006)",
  "title": "Illustrated Pharmacology for Nurses",
  "href": "https://www.routledge.com/"
 },
 {
  "citation": "Khan E (2010)",
  "title": "Medicine management: pharmacokinetics update for community nurses, British Journal of Community Nursing 15(9)",
  "href": "https://www.magonlinelibrary.com/journal/bjcn"
 },
 {
  "citation": "Rang HP et al.",
  "title": "Rang and Dale’s Pharmacology",
  "href": "https://www.elsevier.com/"
 },
 {
  "citation": "BNF for Children (NICE)",
  "title": "Prescribing in children",
  "href": "https://bnfc.nice.org.uk/"
 }
];

function concentrationCurve() {
  const ka = 1.1, ke = 0.28;
  const pts: string[] = [];
  let max = 0;
  const f = (t: number) => Math.exp(-ke * t) - Math.exp(-ka * t);
  for (let t = 0; t <= 16; t += 0.25) max = Math.max(max, f(t));
  let tmax = 0, best = 0;
  for (let t = 0; t <= 16; t += 0.25) {
    const x = 70 + (t / 16) * 780;
    const y = 250 - (f(t) / max) * 0.7 * 190;
    pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  for (let t = 0; t <= 16; t += 0.05) if (f(t) > best) { best = f(t); tmax = t; }
  return { d: pts.join(' '), peakX: 70 + (tmax / 16) * 780, peakY: 250 - 0.7 * 190 };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PharmacokineticsPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.pk-guide .pk-step, .pk-guide .pk-diagram, .pk-guide .pk-golden-cell, .pk-guide .pk-pearl'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('pk-reveal'); io.observe(el); }
    });
    return () => io.disconnect();
  }, []);
  const curve = concentrationCurve();

  const renderDiagram = (id: string) => {
    switch (id) {
      case 'curve': return (
        <div className="pk-diagram">
          <svg viewBox="0 0 900 300" role="img" aria-label="Graph of drug level over time after an oral dose, rising to a peak then falling, with the therapeutic window shaded between the minimum effective and minimum toxic levels">
            <rect x="70" y={250 - 0.86 * 190} width="780" height={(0.86 - 0.34) * 190} style={{ fill: 'rgba(203, 174, 120, 0.18)' }} />
            <line x1="70" y1="40" x2="70" y2="250" style={{ stroke: 'var(--ink-faint)', strokeWidth: 1 }} />
            <line x1="70" y1="250" x2="850" y2="250" style={{ stroke: 'var(--ink-faint)', strokeWidth: 1 }} />
            <line x1="70" y1={250 - 0.86 * 190} x2="850" y2={250 - 0.86 * 190} style={{ stroke: 'var(--red-600)', strokeWidth: 1, strokeDasharray: '5 4' }} />
            <line x1="70" y1={250 - 0.34 * 190} x2="850" y2={250 - 0.34 * 190} style={{ stroke: 'var(--teal-600)', strokeWidth: 1, strokeDasharray: '5 4' }} />
            <path d={curve.d} fill="none" style={{ stroke: 'var(--gold-deep, #8a7350)', strokeWidth: 2.5, strokeLinecap: 'round' }} />
            <circle cx={curve.peakX} cy={curve.peakY} r="4.5" style={{ fill: 'var(--gold-deep, #8a7350)' }} />
            <text x={curve.peakX + 10} y={curve.peakY - 8} style={{ fill: 'var(--ink-mid)', fontFamily: "'Inter', sans-serif", fontSize: 12 }}>Peak</text>
            <text x="856" y={250 - 0.86 * 190 + 4} style={{ fill: 'var(--red-600)', fontFamily: "'Inter', sans-serif", fontSize: 11 }}>Toxic</text>
            <text x="856" y={250 - 0.34 * 190 + 4} style={{ fill: 'var(--teal-600)', fontFamily: "'Inter', sans-serif", fontSize: 11 }}>Effective</text>
            <text x="450" y="282" textAnchor="middle" style={{ fill: 'var(--ink-faint)', fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: '0.1em' }}>TIME AFTER THE DOSE</text>
            <text x="20" y="150" textAnchor="middle" transform="rotate(-90 20 150)" style={{ fill: 'var(--ink-faint)', fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: '0.1em' }}>DRUG LEVEL IN BLOOD</text>
            <text x="110" y="234" style={{ fill: 'var(--ink-soft)', fontFamily: "'Inter', sans-serif", fontSize: 11 }}>Absorption: the level rises</text>
            <text x="470" y="176" style={{ fill: 'var(--ink-soft)', fontFamily: "'Inter', sans-serif", fontSize: 11 }}>Metabolism and excretion: the level falls</text>
          </svg>
          <div className="pk-diagram-key">
            <span><i style={{ background: 'rgba(203, 174, 120, 0.6)' }} />Therapeutic window</span>
            <span><i style={{ background: 'var(--teal-600)' }} />Minimum effective level</span>
            <span><i style={{ background: 'var(--red-600)' }} />Minimum toxic level</span>
          </div>
          <p className="pk-diagram-caption">Illustrative curve for one oral dose. Real curves depend on the drug, the patient and the route.</p>
        </div>
      );
      case 'firstpass': return (
        <div className="pk-diagram">
          <svg viewBox="0 0 900 200" role="img" aria-label="Flow of an oral drug: gut wall, portal vein, liver where first-pass metabolism happens, general circulation, then tissues and the target">
            <defs>
              <marker id="pk-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" style={{ fill: 'var(--ink-faint)' }} />
              </marker>
            </defs>
            {['Oral dose', 'Gut wall', 'Portal vein', 'Liver', 'Circulation', 'Target tissue'].map((label, i) => {
              const x = 15 + i * 145;
              const hot = i === 3;
              return (
                <g key={label}>
                  <rect x={x} y={80} width={110} height={56} rx={2} style={{ fill: hot ? 'rgba(203, 174, 120, 0.22)' : 'var(--surface-page)', stroke: hot ? 'var(--gold-deep, #8a7350)' : 'var(--hairline-firm)', strokeWidth: 1 }} />
                  <text x={x + 55} y={112} textAnchor="middle" style={{ fill: 'var(--ink-strong)', fontFamily: "'Playfair Display', serif", fontSize: 14 }}>{label}</text>
                  {i < 5 && <line x1={x + 110} y1={108} x2={x + 145} y2={108} style={{ stroke: 'var(--ink-faint)', strokeWidth: 1.5 }} markerEnd="url(#pk-arrow)" />}
                </g>
              );
            })}
            <text x="525" y="160" textAnchor="middle" style={{ fill: 'var(--gold-deep, #8a7350)', fontFamily: "'Inter', sans-serif", fontSize: 11 }}>First pass: part of the dose is broken down here</text>
            <line x1="650" y1="40" x2="650" y2="76" style={{ stroke: 'var(--teal-600)', strokeWidth: 1.5, strokeDasharray: '5 4' }} markerEnd="url(#pk-arrow)" />
            <text x="650" y="30" textAnchor="middle" style={{ fill: 'var(--teal-600)', fontFamily: "'Inter', sans-serif", fontSize: 11 }}>IV, sublingual and buccal skip the first pass</text>
          </svg>
          <p className="pk-diagram-caption">An oral drug can be partly broken down by the gut wall and liver before it ever reaches the general circulation.</p>
        </div>
      );
      case 'halflife': return (
        <div className="pk-diagram">
          <svg viewBox="0 0 900 290" role="img" aria-label="Bar chart of how much drug remains after each half-life: 100 percent, 50, 25, 12.5, 6.25 and about 3 percent">
            <line x1="70" y1="240" x2="850" y2="240" style={{ stroke: 'var(--ink-faint)', strokeWidth: 1 }} />
            {[100, 50, 25, 12.5, 6.25, 3.1].map((pct, i) => {
              const h = (pct / 100) * 190;
              const x = 110 + i * 125;
              return (
                <g key={i}>
                  <rect x={x} y={240 - h} width={70} height={h} style={{ fill: i === 0 ? 'var(--gold-deep, #8a7350)' : 'rgba(203, 174, 120, 0.55)' }} />
                  <text x={x + 35} y={240 - h - 8} textAnchor="middle" style={{ fill: 'var(--ink-mid)', fontFamily: "'Inter', sans-serif", fontSize: 13 }}>{i === 5 ? 'about 3%' : `${pct}%`}</text>
                  <text x={x + 35} y={262} textAnchor="middle" style={{ fill: 'var(--ink-faint)', fontFamily: "'Inter', sans-serif", fontSize: 12 }}>{i === 0 ? 'Start' : `${i} half-li${i === 1 ? 'fe' : 'ves'}`}</text>
                </g>
              );
            })}
          </svg>
          <p className="pk-diagram-caption">Each half-life removes half of what is left. After about 5–6 half-lives the effect has effectively stopped.</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="pk-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pk-wrap">
        <Link href="/hub" className="pk-back">
          <span className="pk-back-arrow">&larr;</span>
          Nursing Hub
        </Link>

        <p className="pk-kicker">{"Pharmacology · Children’s & Adult Nursing"}</p>
        <h1 className="pk-headline">Pharmacokinetics</h1>
        <p className="pk-standfirst">{"What the body does to a drug: how it gets in, where it goes, how it is changed and how it leaves — and why the same dose can give very different blood levels in different patients."}</p>
        <p className="pk-byline">{"Children’s & adult nursing · The Nurse Lab"}</p>
        <svg className="pk-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,30 L180,30 L196,30 L204,24 L212,30 L232,30 L238,36 L246,4 L254,44 L260,30 L280,30 L296,20 L312,30 L520,30 L536,30 L544,24 L552,30 L572,30 L578,36 L586,4 L594,44 L600,30 L620,30 L636,20 L652,30 L1000,30" fill="none" pathLength={1} />
        </svg>
        <EditorialSaveButton
          hubItemId="pharmacokinetics"
          hubItemTitle="Pharmacokinetics"
        />

        <div className="pk-pearl" style={{ marginBottom: '40px' }}>
          <p className="pk-pearl-label">Student note</p>
          <p>{"Pharmacokinetics (PK) is the effect of the body on the drug. ADME stands for absorption, distribution, metabolism and excretion. Bioavailability is the share of a dose that reaches the general circulation. First-pass effect is the breakdown of an oral drug by the gut wall and liver before it reaches the bloodstream. Half-life is the time for the amount of drug in the body to fall by half. Therapeutic index is the margin between a useful dose and a toxic one."}</p>
        </div>

        <div className="pk-golden">
          {GOLDEN.map((cell) => (
            <div key={cell.n} className="pk-golden-cell">
              <span className="pk-golden-numeral">{cell.n}</span>
              <p className="pk-golden-title">{cell.title}</p>
              <p className="pk-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="pk-step">
            <div className="pk-step-sidebar">
              <span className={`pk-step-letter pk-letter-${section.colour}`}>{section.number}</span>
              <span className={`pk-step-badge pk-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="pk-step-content">
              <h2 className="pk-step-name">{section.name}</h2>
              <p className="pk-step-question">{section.question}</p>

              <div className="pk-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="pk-content-col">
                    <p className="pk-col-header">{col.header}</p>
                    <ul className="pk-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="pk-redflags-label">Watch for</p>
                  <div className="pk-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="pk-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="pk-pearl">
                  <p className="pk-pearl-label">Clinical pearl</p>
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
                <h2 className="pk-section-title">{block.title}</h2>
                <div className="pk-table-wrap">
                  <table className="pk-table" style={{ marginBottom: '32px' }}>
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
              <div key={idx} className="pk-pearl" style={{ marginBottom: '32px' }}>
                <p className="pk-pearl-label">{block.label}</p>
                <p>{block.text}</p>
              </div>
            );
          }
          return (
            <div key={idx}>
              <h2 className="pk-section-title">{block.title}</h2>
              {renderDiagram(block.id)}
            </div>
          );
        })}

        <h2 className="pk-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Pharmacokinetics" questions={quizQuestions} />

        <SourceLinks sources={SOURCES} />
      </div>
    </div>
  );
}
