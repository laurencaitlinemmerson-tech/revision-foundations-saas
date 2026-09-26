'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.oc-guide *, .oc-guide *::before, .oc-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.oc-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.oc-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.oc-back {
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
.oc-back:hover { color: var(--ink-soft); }
.oc-back-arrow { font-style: normal; }

/* Masthead */
.oc-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.oc-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.oc-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.oc-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

/* Golden rules grid */
.oc-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.oc-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.oc-golden-cell:last-child { border-right: none; }

.oc-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.oc-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.oc-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.oc-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.oc-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.oc-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.oc-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.oc-step-content {
  padding-left: 32px;
}

.oc-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.oc-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

/* 4-column content grid */
.oc-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.oc-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.oc-content-col:last-child { border-right: none; }

.oc-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.oc-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.oc-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.oc-col-list li::before {
  content: '\u2013';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

/* Red flags */
.oc-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.oc-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.oc-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.oc-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.oc-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.oc-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.oc-section-title {
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
.oc-table-wrap { overflow-x: auto; }
.oc-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.oc-table th {
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
.oc-table th:last-child { border-right: none; }

.oc-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.oc-table td:last-child { border-right: none; }
.oc-table tr:last-child td { border-bottom: none; }
.oc-table td:first-child { font-weight: 400; color: var(--ink-mid); }

/* 2-col grid */
.oc-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.oc-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.oc-grid-2-cell:nth-child(2n) { border-right: none; }

.oc-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

/* Step colour system */
.oc-letter-1 { color: var(--blue-600); }
.oc-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.oc-letter-2 { color: var(--teal-600); }
.oc-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.oc-letter-3 { color: var(--coral-600); }
.oc-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.oc-letter-4 { color: var(--purple-600); }
.oc-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.oc-letter-5 { color: var(--gray-600); }
.oc-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.oc-letter-6 { color: #8B5E3C; }
.oc-badge-6 { background: var(--surface-sunken); color: #6B4729; }

/* Flow path mono */
.oc-mono {
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
.oc-diagram {
  border: 0.5px solid var(--hairline-firm);
  padding: 20px 16px 14px;
  margin-bottom: 18px;
  background: var(--surface-page);
}
.oc-diagram svg { display: block; width: 100%; height: auto; }
.oc-diagram-caption {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-align: center;
  margin-top: 10px;
}
.oc-diagram-key {
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.oc-diagram-key span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
}
.oc-diagram-key i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* Responsive */
@media (max-width: 860px) {
  .oc-wrap { padding: 24px 20px 48px; }
  .oc-headline { font-size: 34px; }
  .oc-golden { grid-template-columns: repeat(2, 1fr); }
  .oc-golden-cell:nth-child(2) { border-right: none; }
  .oc-golden-cell:nth-child(1), .oc-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .oc-step { grid-template-columns: 64px 1fr; }
  .oc-step-letter { font-size: 48px; }
  .oc-content-grid { grid-template-columns: repeat(2, 1fr); }
  .oc-content-col:nth-child(2) { border-right: none; }
  .oc-content-col:nth-child(1), .oc-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .oc-grid-2 { grid-template-columns: 1fr; }
  .oc-grid-2-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .oc-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .oc-golden { grid-template-columns: 1fr; }
  .oc-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .oc-golden-cell:last-child { border-bottom: none; }
  .oc-content-grid { grid-template-columns: 1fr; }
  .oc-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .oc-content-col:last-child { border-bottom: none; }
  .oc-step { grid-template-columns: 52px 1fr; }
  .oc-step-letter { font-size: 38px; }
  .oc-step-content { padding-left: 18px; }
}
/* ── Polish layer ───────────────────────────────────────────── */
.oc-kicker { color: var(--gold-deep, #8a7350); }
.oc-headline { font-size: 60px; }
.oc-byline { border-bottom: none; padding-bottom: 6px; margin-bottom: 0; }
.oc-pulse { display: block; width: 100%; height: 40px; margin-bottom: 40px; overflow: visible; }
.oc-pulse path { stroke: var(--gold, #cbae78); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; animation: oc-pulse-draw 2.6s ease-out 0.3s forwards; }
@keyframes oc-pulse-draw { to { stroke-dashoffset: 0; } }
.oc-golden { gap: 14px; border: none; }
.oc-golden-cell { border: 0.5px solid var(--hairline-firm); border-radius: 2px; background: var(--surface-page); transition: transform 0.2s ease, border-color 0.2s ease; }
.oc-golden-cell:last-child { border-right: 0.5px solid var(--hairline-firm); }
.oc-golden-cell:hover { transform: translateY(-2px); border-color: var(--gold); }
.oc-golden-numeral { color: var(--gold); font-size: 34px; }
.oc-section-title { border: none; padding: 18px 0 0; margin-top: 56px; font-size: 28px; position: relative; }
.oc-section-title::before { content: ''; position: absolute; top: 0; left: 0; width: 44px; height: 3px; border-radius: 999px; background: var(--gold); }
.oc-content-grid, .oc-table { border-radius: 2px; }
.oc-content-grid { overflow: hidden; border-color: var(--hairline-firm); }
.oc-table { border-collapse: separate; border-spacing: 0; overflow: hidden; border-color: var(--hairline-firm); }
.oc-table th { background: transparent; color: var(--gold-deep, #8a7350); border-bottom-color: var(--hairline-firm); }
.oc-table td { padding: 13px 16px; line-height: 1.65; }
.oc-table td:first-child { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; color: var(--ink-strong); }
.oc-table tbody tr:nth-child(even) td { background: rgba(203, 174, 120, 0.06); }
.oc-table tbody tr:hover td { background: rgba(203, 174, 120, 0.14); }
.oc-step { border-top-color: var(--hairline-soft); }
.oc-step-letter { text-shadow: none; }
.oc-step-name { font-size: 34px; }
.oc-step-badge, .oc-red-pill { border-radius: 999px; }
.oc-pearl { background: transparent; border: 0.5px solid var(--hairline-firm); border-left: 3px solid var(--gold); border-radius: 2px; padding: 18px 24px; }
.oc-pearl-label { color: var(--gold-deep, #8a7350); font-size: 10px; letter-spacing: 0.18em; margin-bottom: 8px; }
.oc-pearl p { color: var(--ink-mid); font-size: 13.5px; line-height: 1.75; }
.oc-diagram { border-radius: 2px; padding: 28px; border-color: var(--hairline-firm); background: var(--surface-page); }
.oc-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.oc-reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .oc-pulse path { animation: none; stroke-dashoffset: 0; }
  .oc-reveal { opacity: 1; transform: none; transition: none; }
}
@media (max-width: 860px) { .oc-headline { font-size: 36px; } .oc-step-name { font-size: 26px; } .oc-diagram { padding: 18px; } }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const GOLDEN = [
 {
  "n": "01",
  "title": "Fever means sepsis",
  "text": "A temperature of 38 °C or more in a child on chemotherapy is neutropenic sepsis until proven otherwise."
 },
 {
  "n": "02",
  "title": "One hour",
  "text": "Give IV broad-spectrum antibiotics within 60 minutes of arrival. Do not wait for blood results."
 },
 {
  "n": "03",
  "title": "No pus, no redness",
  "text": "Without neutrophils the usual signs of infection may be absent, so watch the observations and the child’s behaviour."
 },
 {
  "n": "04",
  "title": "Central line care",
  "text": "ANTT every time. The line is a lifeline and a route for infection."
 }
];

const SECTIONS = [
 {
  "number": "1",
  "colour": "1",
  "name": "The Big Picture",
  "question": "What are the childhood cancers, and how do they present?",
  "cols": [
   {
    "header": "What is common",
    "items": [
     "Leukaemias are about a third of childhood cancers, and ALL is the commonest",
     "Brain and spinal tumours are the commonest solid tumours",
     "Others include lymphoma, neuroblastoma, Wilms tumour, bone sarcomas and soft tissue sarcomas",
     "Childhood cancer is rare, and survival for many types is now high"
    ]
   },
   {
    "header": "Presenting signs",
    "items": [
     "Persistent unexplained pallor and tiredness",
     "Bruising, petechiae and bleeding",
     "Repeated infection or fever",
     "Bone or joint pain, limping, lumps and weight loss"
    ]
   },
   {
    "header": "Why it differs from adults",
    "items": [
     "Cancers in children start from developing tissue rather than from lifelong exposure",
     "They tend to grow faster and to respond well to chemotherapy",
     "Treatment is delivered in specialist centres, often with shared care locally",
     "Growing bodies, learning and family life all need protecting during treatment"
    ]
   },
   {
    "header": "What nurses see",
    "items": [
     "Children who are unwell from the illness, and from the treatment",
     "Frightened families who need clear, kind explanations",
     "A team: oncologist, clinical nurse specialist, play specialist, dietitian and teacher",
     "Long stays and repeated admissions"
    ]
   }
  ],
  "redFlags": [
   "Bruising or bleeding with no clear cause",
   "Fever in a child on chemotherapy",
   "Back pain with weakness"
  ],
  "pearl": "Cancer is not the only cause of pallor, bruising or bone pain in a child, but it is the reason to take those signs seriously and to escalate when they persist or do not fit a simple explanation."
 },
 {
  "number": "2",
  "colour": "2",
  "name": "Leukaemia",
  "question": "How do ALL and AML differ, and what do you see at the bedside?",
  "cols": [
   {
    "header": "Why it makes children ill",
    "items": [
     "Leukaemic cells crowd out the bone marrow, so normal cells are not made",
     "Few red cells causes pallor and tiredness",
     "Few neutrophils causes infection and fever",
     "Few platelets causes bruising and bleeding"
    ]
   },
   {
    "header": "ALL",
    "items": [
     "The commonest childhood cancer, with a peak at 2 to 5 years",
     "Also causes bone pain, swollen glands and an enlarged liver and spleen",
     "Treatment is in phases: induction, consolidation and maintenance, lasting about 2 to 3 years",
     "CNS-directed treatment is added because chemotherapy reaches the brain poorly"
    ]
   },
   {
    "header": "AML",
    "items": [
     "Less common, and more aggressive, with treatment that is more intense and shorter",
     "Can affect any age, including infants",
     "May cause gum overgrowth and skin deposits",
     "The APML type can cause DIC, a bleeding and clotting emergency"
    ]
   },
   {
    "header": "Emergencies",
    "items": [
     "Neutropenic sepsis: fever with a low neutrophil count",
     "Severe bleeding or DIC",
     "Leucostasis: a very high white cell count blocking small vessels",
     "Tumour lysis syndrome, especially at the start of treatment"
    ]
   }
  ],
  "redFlags": [
   "Fever of 38 °C or more",
   "Severe bruising or bleeding",
   "Very high white cell count"
  ],
  "pearl": "Chemotherapy works because it targets fast-dividing cells, and that is also why it lowers blood counts, damages the lining of the mouth and gut, and causes hair loss. The side effects are the same mechanism as the treatment."
 },
 {
  "number": "3",
  "colour": "3",
  "name": "Solid Tumours",
  "question": "What are the other cancers you might meet?",
  "cols": [
   {
    "header": "Neuroblastoma",
    "items": [
     "The commonest cancer in infants, and the commonest solid tumour outside the brain",
     "Grows from sympathetic nervous tissue, often in the abdomen",
     "Signs: an abdominal mass, weight loss, fever, bone pain, high blood pressure, black eyes and droopy lids",
     "A rare sign is rapid jerking eye movements"
    ]
   },
   {
    "header": "Spinal cord compression",
    "items": [
     "A tumour growing through the spinal canal can press on the cord",
     "Signs: back pain, weak legs, and bladder or bowel change",
     "It is an emergency, so escalate immediately",
     "Steroids and urgent imaging are usual"
    ]
   },
   {
    "header": "Brain tumours",
    "items": [
     "Often at the back of the brain in children",
     "Signs of raised pressure: morning headache, vomiting, drowsiness",
     "Also unsteadiness, squint, and changes in behaviour or school performance",
     "See the seizures and neuro pages for observations"
    ]
   },
   {
    "header": "Wilms tumour",
    "items": [
     "A kidney tumour, usually in young children",
     "A painless abdominal mass, sometimes with blood in the urine or high blood pressure",
     "Do not palpate the abdomen repeatedly once a mass is suspected",
     "Treatment combines chemotherapy and surgery"
    ]
   }
  ],
  "redFlags": [
   "Back pain with new leg weakness",
   "Morning headache and vomiting",
   "A hard abdominal mass"
  ],
  "pearl": "Suspecting a mass is a reason to be gentle and to hand over, not to keep examining. Rough or repeated palpation of an abdominal tumour is discouraged, and the escalation route is the oncology team."
 },
 {
  "number": "4",
  "colour": "4",
  "name": "Neutropenic Sepsis",
  "question": "What is the emergency, and what do you do in the first hour?",
  "cols": [
   {
    "header": "What it is",
    "items": [
     "Sepsis in a child whose neutrophils are very low, usually from chemotherapy",
     "Usually a temperature of 38 °C or more, or other signs of sepsis or being unwell",
     "Neutrophil count of 0.5 x 10⁹ per litre or below, or expected to fall to that",
     "It can progress to septic shock within hours"
    ]
   },
   {
    "header": "Why it is dangerous",
    "items": [
     "Neutrophils are the main defence against bacteria",
     "Without them a small infection spreads quickly",
     "Redness and pus come from neutrophils arriving, so they may be missing",
     "The clues are the observations: fast heart rate, fast breathing, cool peripheries, drowsy, not feeding"
    ]
   },
   {
    "header": "The first hour",
    "items": [
     "Treat as an emergency and call for help",
     "ABCDE, oxygen if needed, and IV access. Use the central line if there is one",
     "Blood cultures from the line and a peripheral sample if possible, but never delay antibiotics for cultures",
     "Give IV broad-spectrum antibiotics within 60 minutes of arrival, as your local policy states"
    ]
   },
   {
    "header": "Also",
    "items": [
     "IV fluids if shocked, and repeat reassessment",
     "Escalate to the oncology team and the senior doctor early",
     "Avoid rectal temperatures, medicines or examinations",
     "Check with the team before giving an antipyretic, because it can hide a fever"
    ]
   }
  ],
  "redFlags": [
   "Temperature of 38 °C or more on chemotherapy",
   "Fast pulse, cool hands, drowsy",
   "Antibiotics not given within 60 minutes"
  ],
  "pearl": "For a child on chemotherapy, treat a temperature first and worry about the cause afterwards. The 60-minute standard is a race against the bacteria, so every step before the antibiotic should be quick."
 },
 {
  "number": "5",
  "colour": "5",
  "name": "Treatment & Supportive Care",
  "question": "What does a child need day to day?",
  "cols": [
   {
    "header": "Central lines",
    "items": [
     "A CVC, such as a Hickman line, PICC or implanted port, gives reliable access for months",
     "They are a common route for infection, so use ANTT for every access and dressing",
     "Watch for redness, swelling, leaking, fever or a blocked line",
     "Keep dressings dry and secure"
    ]
   },
   {
    "header": "Chemotherapy safety",
    "items": [
     "Give only as prescribed and checked by trained staff",
     "Follow the local cytotoxic handling policy for spills, waste and body fluids, which lasts for a stated period after each dose",
     "Wear the right PPE",
     "Pregnant staff and families need advice on handling"
    ]
   },
   {
    "header": "Common side effects",
    "items": [
     "Sickness: ondansetron and other antiemetics",
     "Sore mouth (mucositis): gentle cleaning, pain relief and checking for infection",
     "Low counts: transfusions, and protection from infection",
     "Poor appetite, weight loss and fatigue"
    ]
   },
   {
    "header": "Tumour lysis",
    "items": [
     "Fast cell death releases potassium, phosphate and uric acid, which can injure the kidneys",
     "Prevented with good hydration and drugs that lower uric acid, such as allopurinol or rasburicase",
     "Watch fluid balance, urine output and bloods closely",
     "Report low urine output straight away"
    ]
   }
  ],
  "redFlags": [
   "Line site red, swollen or leaking",
   "Very low urine output on chemotherapy",
   "A child who will not eat or drink"
  ],
  "pearl": "A central line is convenient because it saves needles, and dangerous because it goes directly into the bloodstream. Good line care is one of the biggest things a nurse can do to prevent sepsis."
 },
 {
  "number": "6",
  "colour": "6",
  "name": "The Child & Family",
  "question": "How do you look after the whole child?",
  "cols": [
   {
    "header": "Play and school",
    "items": [
     "Play specialists help with fear, procedures and normality",
     "Hospital and home teaching keep learning going",
     "Keep routines as normal as possible",
     "Include siblings"
    ]
   },
   {
    "header": "Talking",
    "items": [
     "Use honest, age-appropriate words, and follow what the parents want to say and when",
     "Let children ask questions and show what they understand through play or drawing",
     "Tell the truth about what will hurt",
     "Involve the child in choices where you can"
    ]
   },
   {
    "header": "Long-term effects",
    "items": [
     "Some treatments can affect growth, fertility, learning and the heart or kidneys later on",
     "Fertility is discussed before treatment starts",
     "Long-term follow-up continues into adulthood",
     "Survivors may need support as they grow up"
    ]
   },
   {
    "header": "When treatment is not curative",
    "items": [
     "Some children will not survive, and families need honest information and support",
     "Palliative care and symptom control work alongside treatment",
     "Involve the specialist palliative team early",
     "Look after yourself, because this work is emotional"
    ]
   }
  ],
  "redFlags": [
   "A family who seem overwhelmed",
   "A teenager who is withdrawn",
   "Uncontrolled pain or sickness"
  ],
  "pearl": "Children with cancer are still children. Play, school, friends and routine are part of the treatment, not extras, and they are often what families remember most."
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
  "title": "Fever on Chemotherapy: the First Hour",
  "items": [
   {
    "top": "Arrival",
    "title": "Recognise",
    "lines": [
     "Temperature 38 °C",
     "or more, or unwell",
     "on chemotherapy"
    ]
   },
   {
    "top": "Minutes",
    "title": "ABCDE, access",
    "lines": [
     "Oxygen if needed",
     "IV access, use the",
     "central line"
    ]
   },
   {
    "top": "Minutes",
    "title": "Cultures, fluids",
    "lines": [
     "Blood cultures, but",
     "do not delay drugs",
     "Fluids if shocked"
    ]
   },
   {
    "top": "Within 60 min",
    "title": "IV antibiotics",
    "lines": [
     "Broad-spectrum,",
     "per local policy",
     "Give without waiting"
    ]
   },
   {
    "top": "Then",
    "title": "Escalate and reassess",
    "lines": [
     "Oncology team",
     "Repeat observations",
     "Look for improvement"
    ]
   }
  ],
  "caption": "The clock starts when the child arrives. The antibiotic goes in before the results come back.",
  "hl": 3
 },
 {
  "kind": "table",
  "title": "ALL and AML Compared",
  "head": [
   "Feature",
   "ALL",
   "AML"
  ],
  "rows": [
   [
    "How common",
    "Commonest childhood cancer",
    "Less common"
   ],
   [
    "Peak age",
    "2 to 5 years",
    "Any age, including infants"
   ],
   [
    "How aggressive",
    "Aggressive but often responds well",
    "More aggressive"
   ],
   [
    "Treatment",
    "Phased over about 2 to 3 years, with CNS-directed treatment",
    "Shorter and more intense courses"
   ],
   [
    "Special problem",
    "Bone pain, lumps and swollen glands",
    "Gum overgrowth, and DIC in the APML type"
   ]
  ]
 },
 {
  "kind": "table",
  "title": "Oncology Emergencies",
  "head": [
   "Emergency",
   "Clue",
   "First actions"
  ],
  "rows": [
   [
    "Neutropenic sepsis",
    "Fever of 38 °C or more on chemotherapy",
    "Treat as an emergency, IV antibiotics within 60 minutes"
   ],
   [
    "Tumour lysis syndrome",
    "Low urine output, abnormal bloods after starting treatment",
    "Hydration, urgent bloods, escalate"
   ],
   [
    "Spinal cord compression",
    "Back pain, leg weakness, bladder or bowel change",
    "Urgent escalation, steroids, imaging"
   ],
   [
    "Raised intracranial pressure",
    "Morning headache, vomiting, drowsiness, slow pulse",
    "Neuro obs, head up, escalate urgently"
   ],
   [
    "Severe bleeding or DIC",
    "Widespread bruising, bleeding from lines",
    "Escalate, blood products per the team"
   ]
  ]
 },
 {
  "kind": "table",
  "title": "Blood Counts and What They Mean",
  "head": [
   "Count",
   "Low means",
   "Nursing meaning"
  ],
  "rows": [
   [
    "Neutrophils",
    "Neutropenia, severe below 0.5 x 10⁹ per litre",
    "Very high infection risk. Fever is an emergency"
   ],
   [
    "Haemoglobin",
    "Anaemia",
    "Pale, tired, breathless. May need a red cell transfusion"
   ],
   [
    "Platelets",
    "Thrombocytopenia",
    "Bruising and bleeding. Avoid injuries. May need platelets"
   ]
  ]
 },
 {
  "kind": "pearl",
  "label": "Study aid only",
  "text": "This page explains the principles. Follow your trust’s neutropenic sepsis pathway, the local cytotoxic policy, and the BNFC for drugs and doses."
 }
];

const quizQuestions = [
 {
  "question": "A child on chemotherapy has a temperature of 38.4 °C. What is this until proven otherwise?",
  "options": [
   "A cold",
   "Neutropenic sepsis",
   "A teething fever",
   "Normal"
  ],
  "answer": 1,
  "explanation": "Fever in a child on chemotherapy is neutropenic sepsis until proven otherwise, and it is an emergency."
 },
 {
  "question": "Within what time should IV antibiotics be given?",
  "options": [
   "24 hours",
   "6 hours",
   "60 minutes of arrival",
   "After blood results"
  ],
  "answer": 2,
  "explanation": "The standard is within 60 minutes, and antibiotics should not wait for the blood results."
 },
 {
  "question": "Why may a neutropenic child not show redness or pus?",
  "options": [
   "Their skin is thicker",
   "Neutrophils create those signs, and there are too few",
   "They are not infected",
   "It is hidden by clothes"
  ],
  "answer": 1,
  "explanation": "Redness and pus are made by neutrophils arriving, so with few neutrophils the signs can be missing."
 },
 {
  "question": "Which is the commonest childhood cancer?",
  "options": [
   "Neuroblastoma",
   "Wilms tumour",
   "Acute lymphoblastic leukaemia",
   "Lymphoma"
  ],
  "answer": 2,
  "explanation": "ALL is the commonest childhood cancer, peaking at 2 to 5 years."
 },
 {
  "question": "Why do low platelets cause bruising?",
  "options": [
   "They carry oxygen",
   "They help blood to clot",
   "They fight infection",
   "They make bones"
  ],
  "answer": 1,
  "explanation": "Platelets help form clots, so low counts cause bruising and bleeding."
 },
 {
  "question": "What is the best way to reduce the risk of central line infection?",
  "options": [
   "Ignoring the dressing",
   "Using ANTT for every access",
   "Flushing rarely",
   "Leaving it open"
  ],
  "answer": 1,
  "explanation": "ANTT and careful dressing care reduce the chance of infection."
 },
 {
  "question": "A child with neuroblastoma has new back pain and weak legs. What is the concern?",
  "options": [
   "Growing pains",
   "Spinal cord compression, which needs urgent escalation",
   "A pulled muscle",
   "Boredom"
  ],
  "answer": 1,
  "explanation": "A tumour can compress the spinal cord, and it is an emergency."
 },
 {
  "question": "Why is tumour lysis syndrome a risk at the start of treatment?",
  "options": [
   "Cells die quickly and release potassium, phosphate and uric acid",
   "Treatment causes infection",
   "Cells stop dividing",
   "It affects hair"
  ],
  "answer": 0,
  "explanation": "Fast cell death releases contents that can injure the kidneys, so hydration and urine output matter."
 }
];

const SOURCES = [
 {
  "citation": "NICE (2012, updated)",
  "title": "Neutropenic sepsis: prevention and management in people with cancer (CG151)",
  "href": "https://www.nice.org.uk/guidance/cg151"
 },
 {
  "citation": "Children’s Cancer and Leukaemia Group",
  "title": "Guidance and information for professionals",
  "href": "https://www.cclg.org.uk/"
 },
 {
  "citation": "BNF for Children (NICE)",
  "title": "Cytotoxic drugs, antiemetics and antibiotics",
  "href": "https://bnfc.nice.org.uk/"
 },
 {
  "citation": "Cancer Research UK",
  "title": "Children’s cancers statistics and information",
  "href": "https://www.cancerresearchuk.org/"
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

export default function ChildhoodCancerPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.oc-guide .oc-step, .oc-guide .oc-diagram, .oc-guide .oc-golden-cell, .oc-guide .oc-pearl'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('oc-reveal'); io.observe(el); }
    });
    return () => io.disconnect();
  }, []);


  const renderDiagram = (id: string) => {
    switch (id) {

      default: return null;
    }
  };

  return (
    <div className="oc-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="oc-wrap">
        <Link href="/hub" className="oc-back">
          <span className="oc-back-arrow">&larr;</span>
          Nursing Hub
        </Link>

        <p className="oc-kicker">{"Haematology & Oncology · Children’s Nursing"}</p>
        <h1 className="oc-headline">Childhood Cancers & Neutropenic Sepsis</h1>
        <p className="oc-standfirst">{"The cancers you will meet on a children’s ward, why these children can become very sick very fast, and the one emergency every nurse must know: fever in a child with a low neutrophil count."}</p>
        <p className="oc-byline">{"Children’s nursing · The Nurse Lab"}</p>
        <svg className="oc-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,30 L180,30 L196,30 L204,24 L212,30 L232,30 L238,36 L246,4 L254,44 L260,30 L280,30 L296,20 L312,30 L520,30 L536,30 L544,24 L552,30 L572,30 L578,36 L586,4 L594,44 L600,30 L620,30 L636,20 L652,30 L1000,30" fill="none" pathLength={1} />
        </svg>
        <EditorialSaveButton
          hubItemId="childhood-cancer-neutropenic-sepsis"
          hubItemTitle="Childhood Cancers & Neutropenic Sepsis"
        />

        <div className="oc-pearl" style={{ marginBottom: '40px' }}>
          <p className="oc-pearl-label">Student note</p>
          <p>{"Neutrophils are the white blood cells that fight bacteria, and neutropenia is a low neutrophil count. Neutropenic sepsis is sepsis in a child whose neutrophils are low, usually after chemotherapy. Leukaemia is cancer of the blood-forming cells in the bone marrow. A central venous catheter (CVC) is a long-term line into a large vein. Tumour lysis syndrome is the harmful release of cell contents when cancer cells die quickly."}</p>
        </div>

        <div className="oc-golden">
          {GOLDEN.map((cell) => (
            <div key={cell.n} className="oc-golden-cell">
              <span className="oc-golden-numeral">{cell.n}</span>
              <p className="oc-golden-title">{cell.title}</p>
              <p className="oc-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="oc-step">
            <div className="oc-step-sidebar">
              <span className={`oc-step-letter oc-letter-${section.colour}`}>{section.number}</span>
              <span className={`oc-step-badge oc-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="oc-step-content">
              <h2 className="oc-step-name">{section.name}</h2>
              <p className="oc-step-question">{section.question}</p>

              <div className="oc-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="oc-content-col">
                    <p className="oc-col-header">{col.header}</p>
                    <ul className="oc-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="oc-redflags-label">Watch for</p>
                  <div className="oc-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="oc-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="oc-pearl">
                  <p className="oc-pearl-label">Clinical pearl</p>
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
                <h2 className="oc-section-title">{block.title}</h2>
                <div className="oc-table-wrap">
                  <table className="oc-table" style={{ marginBottom: '32px' }}>
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
              <div key={idx} className="oc-pearl" style={{ marginBottom: '32px' }}>
                <p className="oc-pearl-label">{block.label}</p>
                <p>{block.text}</p>
              </div>
            );
          }
          if (block.kind === 'flow') {
            return (
              <div key={idx}>
                <h2 className="oc-section-title">{block.title}</h2>
                <div className="oc-diagram">
                  <FlowDiagram items={block.items} label={block.title} prefix="oc" hl={block.hl} />
                  <p className="oc-diagram-caption">{block.caption}</p>
                </div>
              </div>
            );
          }
          return (
            <div key={idx}>
              <h2 className="oc-section-title">{block.title}</h2>
              {renderDiagram(block.id)}
            </div>
          );
        })}

        <h2 className="oc-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Childhood Cancers & Neutropenic Sepsis" questions={quizQuestions} />

        <SourceLinks sources={SOURCES} />
      </div>
    </div>
  );
}
