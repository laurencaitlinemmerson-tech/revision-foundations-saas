'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.an-guide *, .an-guide *::before, .an-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.an-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.an-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.an-back {
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
.an-back:hover { color: var(--ink-soft); }
.an-back-arrow { font-style: normal; }

/* Masthead */
.an-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.an-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.an-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.an-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

/* Golden rules grid */
.an-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.an-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.an-golden-cell:last-child { border-right: none; }

.an-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.an-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.an-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.an-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.an-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.an-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.an-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.an-step-content {
  padding-left: 32px;
}

.an-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.an-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

/* 4-column content grid */
.an-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.an-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.an-content-col:last-child { border-right: none; }

.an-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.an-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.an-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.an-col-list li::before {
  content: '\u2013';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

/* Red flags */
.an-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.an-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.an-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.an-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.an-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.an-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.an-section-title {
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
.an-table-wrap { overflow-x: auto; }
.an-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.an-table th {
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
.an-table th:last-child { border-right: none; }

.an-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.an-table td:last-child { border-right: none; }
.an-table tr:last-child td { border-bottom: none; }
.an-table td:first-child { font-weight: 400; color: var(--ink-mid); }

/* 2-col grid */
.an-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.an-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.an-grid-2-cell:nth-child(2n) { border-right: none; }

.an-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

/* Step colour system */
.an-letter-1 { color: var(--blue-600); }
.an-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.an-letter-2 { color: var(--teal-600); }
.an-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.an-letter-3 { color: var(--coral-600); }
.an-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.an-letter-4 { color: var(--purple-600); }
.an-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.an-letter-5 { color: var(--gray-600); }
.an-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.an-letter-6 { color: #8B5E3C; }
.an-badge-6 { background: var(--surface-sunken); color: #6B4729; }

/* Flow path mono */
.an-mono {
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
.an-diagram {
  border: 0.5px solid var(--hairline-firm);
  padding: 20px 16px 14px;
  margin-bottom: 18px;
  background: var(--surface-page);
}
.an-diagram svg { display: block; width: 100%; height: auto; }
.an-diagram-caption {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-align: center;
  margin-top: 10px;
}
.an-diagram-key {
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.an-diagram-key span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
}
.an-diagram-key i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* Responsive */
@media (max-width: 860px) {
  .an-wrap { padding: 24px 20px 48px; }
  .an-headline { font-size: 34px; }
  .an-golden { grid-template-columns: repeat(2, 1fr); }
  .an-golden-cell:nth-child(2) { border-right: none; }
  .an-golden-cell:nth-child(1), .an-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .an-step { grid-template-columns: 64px 1fr; }
  .an-step-letter { font-size: 48px; }
  .an-content-grid { grid-template-columns: repeat(2, 1fr); }
  .an-content-col:nth-child(2) { border-right: none; }
  .an-content-col:nth-child(1), .an-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .an-grid-2 { grid-template-columns: 1fr; }
  .an-grid-2-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .an-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .an-golden { grid-template-columns: 1fr; }
  .an-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .an-golden-cell:last-child { border-bottom: none; }
  .an-content-grid { grid-template-columns: 1fr; }
  .an-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .an-content-col:last-child { border-bottom: none; }
  .an-step { grid-template-columns: 52px 1fr; }
  .an-step-letter { font-size: 38px; }
  .an-step-content { padding-left: 18px; }
}
/* ── Polish layer ───────────────────────────────────────────── */
.an-kicker { color: var(--gold-deep, #8a7350); }
.an-headline { font-size: 60px; }
.an-byline { border-bottom: none; padding-bottom: 6px; margin-bottom: 0; }
.an-pulse { display: block; width: 100%; height: 40px; margin-bottom: 40px; overflow: visible; }
.an-pulse path { stroke: var(--gold, #cbae78); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; animation: an-pulse-draw 2.6s ease-out 0.3s forwards; }
@keyframes an-pulse-draw { to { stroke-dashoffset: 0; } }
.an-golden { gap: 14px; border: none; }
.an-golden-cell { border: 0.5px solid var(--hairline-firm); border-radius: 2px; background: var(--surface-page); transition: transform 0.2s ease, border-color 0.2s ease; }
.an-golden-cell:last-child { border-right: 0.5px solid var(--hairline-firm); }
.an-golden-cell:hover { transform: translateY(-2px); border-color: var(--gold); }
.an-golden-numeral { color: var(--gold); font-size: 34px; }
.an-section-title { border: none; padding: 18px 0 0; margin-top: 56px; font-size: 28px; position: relative; }
.an-section-title::before { content: ''; position: absolute; top: 0; left: 0; width: 44px; height: 3px; border-radius: 999px; background: var(--gold); }
.an-content-grid, .an-table { border-radius: 2px; }
.an-content-grid { overflow: hidden; border-color: var(--hairline-firm); }
.an-table { border-collapse: separate; border-spacing: 0; overflow: hidden; border-color: var(--hairline-firm); }
.an-table th { background: transparent; color: var(--gold-deep, #8a7350); border-bottom-color: var(--hairline-firm); }
.an-table td { padding: 13px 16px; line-height: 1.65; }
.an-table td:first-child { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; color: var(--ink-strong); }
.an-table tbody tr:nth-child(even) td { background: rgba(203, 174, 120, 0.06); }
.an-table tbody tr:hover td { background: rgba(203, 174, 120, 0.14); }
.an-step { border-top-color: var(--hairline-soft); }
.an-step-letter { text-shadow: none; }
.an-step-name { font-size: 34px; }
.an-step-badge, .an-red-pill { border-radius: 999px; }
.an-pearl { background: transparent; border: 0.5px solid var(--hairline-firm); border-left: 3px solid var(--gold); border-radius: 2px; padding: 18px 24px; }
.an-pearl-label { color: var(--gold-deep, #8a7350); font-size: 10px; letter-spacing: 0.18em; margin-bottom: 8px; }
.an-pearl p { color: var(--ink-mid); font-size: 13.5px; line-height: 1.75; }
.an-diagram { border-radius: 2px; padding: 28px; border-color: var(--hairline-firm); background: var(--surface-page); }
.an-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.an-reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .an-pulse path { animation: none; stroke-dashoffset: 0; }
  .an-reveal { opacity: 1; transform: none; transition: none; }
}
@media (max-width: 860px) { .an-headline { font-size: 36px; } .an-step-name { font-size: 26px; } .an-diagram { padding: 18px; } }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const GOLDEN = [
 {
  "n": "01",
  "title": "Adrenaline first",
  "text": "Give IM adrenaline as soon as you recognise it. It is the only drug that reverses the airway, breathing and circulation problems together."
 },
 {
  "n": "02",
  "title": "Think A, B, C",
  "text": "Sudden airway, breathing or circulation problems are the diagnosis. Skin changes are common but can be missing."
 },
 {
  "n": "03",
  "title": "Lie flat, do not stand",
  "text": "Sitting or standing a collapsed patient up can be fatal. Lie flat with legs raised, unless breathing is the main problem."
 },
 {
  "n": "04",
  "title": "Repeat at 5 minutes",
  "text": "If there is no improvement after 5 minutes, give a second dose and keep calling for help."
 }
];

const SECTIONS = [
 {
  "number": "1",
  "colour": "1",
  "name": "Recognising It",
  "question": "What does anaphylaxis look like, and how fast does it come on?",
  "cols": [
   {
    "header": "What is happening",
    "items": [
     "An allergen sets off mast cells and basophils, which release histamine and other mediators all at once",
     "Blood vessels dilate and leak, so blood pressure falls and tissues swell",
     "The airway swells and the smaller airways tighten",
     "It is usually within minutes of exposure and can worsen very quickly"
    ]
   },
   {
    "header": "Common triggers",
    "items": [
     "Foods are the commonest cause in children: nuts, milk, egg, fish, sesame",
     "Insect stings such as wasp or bee",
     "Medicines: antibiotics and anti-inflammatories most often, and contrast dyes and some anaesthetic drugs in hospital",
     "Latex, and sometimes no cause is found"
    ]
   },
   {
    "header": "What you will see",
    "items": [
     "A: swollen lips, tongue or throat, hoarse voice, stridor",
     "B: wheeze, fast breathing, persistent cough, low oxygen saturations",
     "C: pale, clammy, fast pulse, low blood pressure, floppy or collapsed",
     "Skin and mucosa: hives, flushing, itching, swelling, but these can be absent"
    ]
   },
   {
    "header": "In children",
    "items": [
     "Airway and breathing problems are more common than low blood pressure",
     "Young children cannot describe symptoms. Look for sudden clinginess, distress, going quiet or floppy",
     "A baby may be irritable, refuse a feed, or suddenly look pale and drowsy",
     "Asthma that is poorly controlled raises the risk of a severe reaction"
    ]
   }
  ],
  "redFlags": [
   "Stridor or a hoarse voice",
   "Wheeze or difficulty breathing",
   "Pale, floppy or unresponsive",
   "Low blood pressure, fast pulse, cold peripheries"
  ],
  "pearl": "Skin signs help, but you do not need them. A sudden airway, breathing or circulation problem after a likely exposure should be treated as anaphylaxis until you can prove it is not."
 },
 {
  "number": "2",
  "colour": "2",
  "name": "Adrenaline",
  "question": "Why adrenaline first, and how do you give it safely?",
  "cols": [
   {
    "header": "Why it comes first",
    "items": [
     "Adrenaline reverses all of the problem at once",
     "It tightens blood vessels (alpha effect), which lifts blood pressure and reduces swelling",
     "It strengthens the heartbeat (beta-1) and opens the airways (beta-2)",
     "It also slows further release of mediators from mast cells. Antihistamines and steroids do none of this quickly"
    ]
   },
   {
    "header": "How to give it",
    "items": [
     "Intramuscular into the outer middle third of the thigh, through clothing if needed",
     "Use the 1 mg per mL (1:1,000) strength for IM injection",
     "Note the time, and repeat after 5 minutes if there is no improvement",
     "An auto-injector is fine if that is what you have. Hold it in place for the time the device states"
    ]
   },
   {
    "header": "The safety check",
    "items": [
     "Two strengths exist. 1 mg per mL (1:1,000) is for IM use. 0.1 mg per mL (1:10,000) is for IV use by experts",
     "Reading the ampoule wrongly is a classic, dangerous error, so check the label and the volume with a second person if you can",
     "IV adrenaline is for specialists with monitoring, not for a first response"
    ]
   },
   {
    "header": "Common worries",
    "items": [
     "Adrenaline given to someone who turns out not to be anaphylactic is much less dangerous than delay in someone who is",
     "A racing heart, tremor and pale skin after adrenaline are expected effects",
     "Patients on beta blockers may respond poorly, so tell the team, because glucagon may be needed"
    ]
   }
  ],
  "redFlags": [
   "No improvement after 5 minutes",
   "Wrong strength or volume drawn up",
   "Delaying adrenaline to give an antihistamine first"
  ],
  "pearl": "Delay is what kills. Give adrenaline first, then position, oxygen and fluids, and note the time you gave it."
 },
 {
  "number": "3",
  "colour": "3",
  "name": "The A to E Response",
  "question": "What do you do around the adrenaline?",
  "cols": [
   {
    "header": "Call and position",
    "items": [
     "Call for help immediately, using your emergency call or resus team",
     "Lie the patient flat with legs raised if they are pale or shocked",
     "If breathing is the main problem, let them sit up. If they are unconscious, place them on their side",
     "Never sit or stand a collapsed patient up suddenly"
    ]
   },
   {
    "header": "Airway and breathing",
    "items": [
     "High-flow oxygen through a reservoir mask",
     "Watch for swelling of the lips, tongue and voice change. Call anaesthetics early if the airway is threatened",
     "Salbutamol is an add-on for wheeze, not a replacement for adrenaline",
     "Record oxygen saturations and respiratory rate"
    ]
   },
   {
    "header": "Circulation",
    "items": [
     "Attach monitoring and record heart rate, blood pressure and capillary refill",
     "Get IV or IO access",
     "Give an IV fluid bolus of crystalloid if shocked: 10 mL per kg in a child, then reassess",
     "Repeat adrenaline if still shocked at 5 minutes"
    ]
   },
   {
    "header": "D, E and the trigger",
    "items": [
     "Check AVPU and blood glucose",
     "Expose enough to look at the skin and record the rash",
     "Remove the trigger if you can do so quickly: stop an infusion, take out a sting, or stop the drug",
     "Never let removing the trigger delay adrenaline"
    ]
   }
  ],
  "redFlags": [
   "Airway swelling that is getting worse",
   "Blood pressure not responding to fluids",
   "Loss of consciousness"
  ],
  "pearl": "Lying flat protects the brain. In anaphylaxis blood has pooled in leaky vessels, and standing someone up can drop the blood returning to the heart and cause cardiac arrest."
 },
 {
  "number": "4",
  "colour": "4",
  "name": "What Not to Rely On",
  "question": "Which drugs are extra, and which are not first-line?",
  "cols": [
   {
    "header": "Antihistamines",
    "items": [
     "Chlorphenamine and similar drugs treat itching and hives, but they do not treat airway or circulation problems",
     "They act too slowly to help in the first minutes",
     "They are not part of the emergency treatment, and should never delay adrenaline"
    ]
   },
   {
    "header": "Corticosteroids",
    "items": [
     "Hydrocortisone is not routinely recommended in the emergency",
     "Steroids take hours to work",
     "Your team may still use them for a specific reason, such as asthma"
    ]
   },
   {
    "header": "Bronchodilators and others",
    "items": [
     "Nebulised salbutamol helps wheeze as an add-on to adrenaline",
     "Glucagon can help a patient on a beta blocker who is not responding",
     "Adrenaline infusions and airway drugs are decisions for the senior team"
    ]
   },
   {
    "header": "Why this matters",
    "items": [
     "It is easy to reach for the familiar drug first",
     "Every minute spent on something slower is a minute without adrenaline",
     "In an OSCE, examiners look for adrenaline first"
    ]
   }
  ],
  "redFlags": [
   "Antihistamine given first",
   "Waiting to see if it settles"
  ],
  "pearl": "Chlorphenamine and steroids can be given later for a rash, but they are not the treatment for anaphylaxis, and they do not prevent the reaction from worsening."
 },
 {
  "number": "5",
  "colour": "5",
  "name": "After the Emergency",
  "question": "What happens once they are stable?",
  "cols": [
   {
    "header": "Observation",
    "items": [
     "Keep observing after the reaction settles, because a second wave can appear hours later",
     "Observation is usually 6 to 12 hours, longer after a severe reaction. Follow local policy",
     "Repeat adrenaline if symptoms return",
     "A senior review decides when it is safe to go home"
    ]
   },
   {
    "header": "Blood tests",
    "items": [
     "Mast cell tryptase confirms anaphylaxis after the event",
     "First sample as soon as possible after starting treatment, without delaying it",
     "Second sample 1 to 2 hours after symptoms started, and no later than 4 hours",
     "A baseline sample at least 24 hours later"
    ]
   },
   {
    "header": "Documentation",
    "items": [
     "The time symptoms started, the time each dose of adrenaline was given, and the response",
     "Suspected trigger and any exposure",
     "Observations, fluids given and who was called",
     "The reaction should be reported and recorded in the notes and allergy record"
    ]
   },
   {
    "header": "Before discharge",
    "items": [
     "Refer to a specialist allergy service",
     "Give adrenaline auto-injectors, usually two, and teach how to use them",
     "Give written advice and a personal action plan",
     "Explain the trigger to avoid"
    ]
   }
  ],
  "redFlags": [
   "Symptoms returning during observation",
   "Discharge without auto-injector training or a referral"
  ],
  "pearl": "A second wave is called a biphasic reaction. It is one of the reasons observation matters, even when the child looks completely well."
 },
 {
  "number": "6",
  "colour": "6",
  "name": "Family & Prevention",
  "question": "What do families and school need to know?",
  "cols": [
   {
    "header": "The auto-injector",
    "items": [
     "Carry two at all times, and check the expiry dates",
     "Use it for suspected anaphylaxis, in the outer thigh, and then call an ambulance",
     "Teach practise-device use. Families are more likely to act if they have practised",
     "Give a second dose after about 5 minutes if there is no improvement"
    ]
   },
   {
    "header": "Avoiding triggers",
    "items": [
     "Read every food label, and ask about ingredients when eating out",
     "Cross-contamination matters as well as the food itself",
     "Medical alert jewellery or a wallet card help in an emergency",
     "Keep asthma well controlled"
    ]
   },
   {
    "header": "School and childcare",
    "items": [
     "A written allergy action plan and a named trained adult",
     "Auto-injectors kept where staff can reach them fast, not locked away",
     "Younger children need supervision. Teenagers need support to carry and use their own",
     "Tell staff how to recognise a reaction"
    ]
   },
   {
    "header": "Support",
    "items": [
     "Living with food allergy can be frightening for a child and for parents",
     "Older children and teenagers take more risks, so talk about it openly",
     "Allergy UK and the Anaphylaxis Campaign give practical help",
     "Ask about the emotional impact as well as the clinical plan"
    ]
   }
  ],
  "redFlags": [
   "Auto-injector out of date or not carried",
   "A child or family not confident to use it"
  ],
  "pearl": "The best plan is one the family can carry out under stress. Practise with a trainer device, keep the steps short, and revisit it regularly."
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
  "title": "The First Ten Minutes",
  "items": [
   {
    "top": "Minute 0",
    "title": "Recognise",
    "lines": [
     "Sudden A, B or C",
     "problem, with or",
     "without skin signs"
    ]
   },
   {
    "top": "Straight away",
    "title": "Call for help",
    "lines": [
     "Emergency call or",
     "resus team",
     "Note the time"
    ]
   },
   {
    "top": "Straight away",
    "title": "Adrenaline IM",
    "lines": [
     "Outer mid-thigh",
     "1 mg per mL",
     "(1:1,000)"
    ]
   },
   {
    "top": "Then",
    "title": "Position, oxygen",
    "lines": [
     "Lie flat, legs raised",
     "High-flow oxygen",
     "Access, monitoring"
    ]
   },
   {
    "top": "Minute 5",
    "title": "Reassess",
    "lines": [
     "Repeat adrenaline if",
     "no improvement",
     "Fluids if shocked"
    ]
   }
  ],
  "caption": "Adrenaline is the first drug. Everything else happens around it, and none of it should delay it.",
  "hl": 2
 },
 {
  "kind": "table",
  "title": "IM Adrenaline Doses by Age",
  "head": [
   "Age",
   "Dose of adrenaline",
   "Volume of 1 mg per mL"
  ],
  "rows": [
   [
    "Under 6 months",
    "100 to 150 micrograms",
    "0.10 to 0.15 mL"
   ],
   [
    "6 months to 5 years",
    "150 micrograms",
    "0.15 mL"
   ],
   [
    "6 to 12 years",
    "300 micrograms",
    "0.3 mL"
   ],
   [
    "Over 12 years and adults",
    "500 micrograms",
    "0.5 mL"
   ]
  ]
 },
 {
  "kind": "pearl",
  "label": "Clinical pearl",
  "text": "These are the intramuscular doses from the Resuscitation Council UK guideline. A small or prepubertal child over 6 may be given 300 micrograms. Always check the latest guideline and your local policy, and check the strength on the ampoule before you draw up."
 },
 {
  "kind": "table",
  "title": "Anaphylaxis or Something Else?",
  "head": [
   "Condition",
   "Clues",
   "Difference from anaphylaxis"
  ],
  "rows": [
   [
    "Asthma attack",
    "Wheeze and breathlessness",
    "No swelling, hives or low blood pressure, and it did not start after a new exposure"
   ],
   [
    "Panic attack",
    "Fast breathing, tingling, feeling of doom",
    "Normal oxygen saturations, no swelling, no wheeze, no hives"
   ],
   [
    "Faint (vasovagal)",
    "Pale, sweaty, slow pulse after a shock or needle",
    "Recovers quickly when lying flat, with no rash and no breathing problem"
   ],
   [
    "Simple hives",
    "Itchy raised rash",
    "No airway, breathing or circulation problem, so it is allergic but not anaphylaxis"
   ]
  ]
 },
 {
  "kind": "table",
  "title": "Tryptase Samples",
  "head": [
   "Sample",
   "When to take it",
   "Why"
  ],
  "rows": [
   [
    "First",
    "As soon as possible after starting treatment, without delaying it",
    "Shows the level during the reaction"
   ],
   [
    "Second",
    "1 to 2 hours after symptoms began, and no later than 4 hours",
    "Level peaks then falls"
   ],
   [
    "Third",
    "At least 24 hours later, or at follow-up",
    "A baseline to compare with"
   ]
  ]
 },
 {
  "kind": "pearl",
  "label": "Study aid only",
  "text": "This page explains the principles. Always follow the current Resuscitation Council UK anaphylaxis guideline and your local policy, and check the BNFC for doses and cautions."
 }
];

const quizQuestions = [
 {
  "question": "What is the first-line drug in anaphylaxis?",
  "options": [
   "Chlorphenamine",
   "IM adrenaline",
   "Hydrocortisone",
   "Salbutamol"
  ],
  "answer": 1,
  "explanation": "Adrenaline is the only drug that reverses the airway, breathing and circulation problems together, so it comes first."
 },
 {
  "question": "Where is IM adrenaline usually given?",
  "options": [
   "Deltoid",
   "Outer middle third of the thigh",
   "Buttock",
   "Abdomen"
  ],
  "answer": 1,
  "explanation": "The anterolateral thigh gives a reliable, fast absorption and is easy to reach."
 },
 {
  "question": "Which strength of adrenaline is used for IM injection?",
  "options": [
   "1 mg per mL (1:1,000)",
   "0.1 mg per mL (1:10,000)",
   "Either, it does not matter",
   "10 mg per mL"
  ],
  "answer": 0,
  "explanation": "1 mg per mL is the IM strength. 1:10,000 is for IV use by experts. Mixing them up is a serious error."
 },
 {
  "question": "A child with anaphylaxis is pale and floppy. How should you position them?",
  "options": [
   "Sitting upright",
   "Standing",
   "Lying flat with legs raised",
   "On their front"
  ],
  "answer": 2,
  "explanation": "Lying flat helps blood return to the heart. Sitting or standing a shocked patient up can cause cardiac arrest."
 },
 {
  "question": "When should you repeat adrenaline?",
  "options": [
   "After 30 minutes",
   "After 5 minutes if there is no improvement",
   "Never",
   "Only if the rash gets worse"
  ],
  "answer": 1,
  "explanation": "If there is no improvement after 5 minutes, give a second dose."
 },
 {
  "question": "Why are antihistamines not first-line?",
  "options": [
   "They are dangerous",
   "They work too slowly and do not treat airway or circulation problems",
   "They cause anaphylaxis",
   "They are too expensive"
  ],
  "answer": 1,
  "explanation": "Antihistamines settle itching but do not reverse airway or circulatory failure quickly enough."
 },
 {
  "question": "Why observe a patient for hours after they seem well?",
  "options": [
   "Hospital policy only",
   "A second wave of symptoms can appear hours later",
   "To check the ward is safe",
   "To give them a drink"
  ],
  "answer": 1,
  "explanation": "A biphasic reaction can occur after the first has settled."
 },
 {
  "question": "A child has sudden wheeze and stridor after a peanut, with no rash. What should you do?",
  "options": [
   "Wait for a rash to appear",
   "Treat as anaphylaxis and give adrenaline",
   "Give an antihistamine and observe",
   "Give paracetamol"
  ],
  "answer": 1,
  "explanation": "Skin signs are not needed. A sudden airway or breathing problem after a likely exposure is anaphylaxis until proven otherwise."
 }
];

const SOURCES = [
 {
  "citation": "Resuscitation Council UK",
  "title": "Emergency treatment of anaphylactic reactions",
  "href": "https://www.resus.org.uk/"
 },
 {
  "citation": "NICE (2011, updated)",
  "title": "Anaphylaxis: assessment and referral after emergency treatment (CG134)",
  "href": "https://www.nice.org.uk/guidance/cg134"
 },
 {
  "citation": "BNF for Children (NICE)",
  "title": "Adrenaline (epinephrine) and anaphylaxis",
  "href": "https://bnfc.nice.org.uk/"
 },
 {
  "citation": "Allergy UK",
  "title": "Anaphylaxis and allergy support for families",
  "href": "https://www.allergyuk.org/"
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

export default function AnaphylaxisPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.an-guide .an-step, .an-guide .an-diagram, .an-guide .an-golden-cell, .an-guide .an-pearl'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('an-reveal'); io.observe(el); }
    });
    return () => io.disconnect();
  }, []);


  const renderDiagram = (id: string) => {
    switch (id) {

      default: return null;
    }
  };

  return (
    <div className="an-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="an-wrap">
        <Link href="/hub" className="an-back">
          <span className="an-back-arrow">&larr;</span>
          Nursing Hub
        </Link>

        <p className="an-kicker">{"Emergency · Children’s & Adult Nursing"}</p>
        <h1 className="an-headline">Anaphylaxis: Recognise It, Treat It Fast</h1>
        <p className="an-standfirst">{"A severe allergic reaction that can close the airway or drop the blood pressure within minutes. What to look for, why adrenaline comes first, and exactly what to do next."}</p>
        <p className="an-byline">{"Children’s & adult nursing · The Nurse Lab"}</p>
        <svg className="an-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,30 L180,30 L196,30 L204,24 L212,30 L232,30 L238,36 L246,4 L254,44 L260,30 L280,30 L296,20 L312,30 L520,30 L536,30 L544,24 L552,30 L572,30 L578,36 L586,4 L594,44 L600,30 L620,30 L636,20 L652,30 L1000,30" fill="none" pathLength={1} />
        </svg>
        <EditorialSaveButton
          hubItemId="anaphylaxis"
          hubItemTitle="Anaphylaxis"
        />

        <div className="an-pearl" style={{ marginBottom: '40px' }}>
          <p className="an-pearl-label">Student note</p>
          <p>{"Anaphylaxis is a sudden, severe, whole-body allergic reaction. An allergen is the thing that triggers it. Adrenaline (also called epinephrine) is the first-line drug. IM means intramuscular, into the muscle. A biphasic reaction is a second wave of symptoms hours after the first has settled. Mast cell tryptase is a blood test that helps confirm anaphylaxis afterwards."}</p>
        </div>

        <div className="an-golden">
          {GOLDEN.map((cell) => (
            <div key={cell.n} className="an-golden-cell">
              <span className="an-golden-numeral">{cell.n}</span>
              <p className="an-golden-title">{cell.title}</p>
              <p className="an-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="an-step">
            <div className="an-step-sidebar">
              <span className={`an-step-letter an-letter-${section.colour}`}>{section.number}</span>
              <span className={`an-step-badge an-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="an-step-content">
              <h2 className="an-step-name">{section.name}</h2>
              <p className="an-step-question">{section.question}</p>

              <div className="an-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="an-content-col">
                    <p className="an-col-header">{col.header}</p>
                    <ul className="an-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="an-redflags-label">Watch for</p>
                  <div className="an-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="an-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="an-pearl">
                  <p className="an-pearl-label">Clinical pearl</p>
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
                <h2 className="an-section-title">{block.title}</h2>
                <div className="an-table-wrap">
                  <table className="an-table" style={{ marginBottom: '32px' }}>
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
              <div key={idx} className="an-pearl" style={{ marginBottom: '32px' }}>
                <p className="an-pearl-label">{block.label}</p>
                <p>{block.text}</p>
              </div>
            );
          }
          if (block.kind === 'flow') {
            return (
              <div key={idx}>
                <h2 className="an-section-title">{block.title}</h2>
                <div className="an-diagram">
                  <FlowDiagram items={block.items} label={block.title} prefix="an" hl={block.hl} />
                  <p className="an-diagram-caption">{block.caption}</p>
                </div>
              </div>
            );
          }
          return (
            <div key={idx}>
              <h2 className="an-section-title">{block.title}</h2>
              {renderDiagram(block.id)}
            </div>
          );
        })}

        <h2 className="an-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Anaphylaxis" questions={quizQuestions} />

        <SourceLinks sources={SOURCES} />
      </div>
    </div>
  );
}
