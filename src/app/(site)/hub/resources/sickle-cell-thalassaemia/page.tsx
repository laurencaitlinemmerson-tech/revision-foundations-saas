'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.hb-guide *, .hb-guide *::before, .hb-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.hb-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.hb-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.hb-back {
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
.hb-back:hover { color: var(--ink-soft); }
.hb-back-arrow { font-style: normal; }

/* Masthead */
.hb-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.hb-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.hb-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.hb-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

/* Golden rules grid */
.hb-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.hb-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.hb-golden-cell:last-child { border-right: none; }

.hb-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.hb-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.hb-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.hb-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.hb-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.hb-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.hb-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.hb-step-content {
  padding-left: 32px;
}

.hb-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.hb-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

/* 4-column content grid */
.hb-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.hb-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.hb-content-col:last-child { border-right: none; }

.hb-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.hb-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.hb-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.hb-col-list li::before {
  content: '\u2013';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

/* Red flags */
.hb-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.hb-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.hb-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.hb-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.hb-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.hb-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.hb-section-title {
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
.hb-table-wrap { overflow-x: auto; }
.hb-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.hb-table th {
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
.hb-table th:last-child { border-right: none; }

.hb-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.hb-table td:last-child { border-right: none; }
.hb-table tr:last-child td { border-bottom: none; }
.hb-table td:first-child { font-weight: 400; color: var(--ink-mid); }

/* 2-col grid */
.hb-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.hb-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.hb-grid-2-cell:nth-child(2n) { border-right: none; }

.hb-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

/* Step colour system */
.hb-letter-1 { color: var(--blue-600); }
.hb-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.hb-letter-2 { color: var(--teal-600); }
.hb-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.hb-letter-3 { color: var(--coral-600); }
.hb-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.hb-letter-4 { color: var(--purple-600); }
.hb-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.hb-letter-5 { color: var(--gray-600); }
.hb-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.hb-letter-6 { color: #8B5E3C; }
.hb-badge-6 { background: var(--surface-sunken); color: #6B4729; }

/* Flow path mono */
.hb-mono {
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
.hb-diagram {
  border: 0.5px solid var(--hairline-firm);
  padding: 20px 16px 14px;
  margin-bottom: 18px;
  background: var(--surface-page);
}
.hb-diagram svg { display: block; width: 100%; height: auto; }
.hb-diagram-caption {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-align: center;
  margin-top: 10px;
}
.hb-diagram-key {
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.hb-diagram-key span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
}
.hb-diagram-key i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* Responsive */
@media (max-width: 860px) {
  .hb-wrap { padding: 24px 20px 48px; }
  .hb-headline { font-size: 34px; }
  .hb-golden { grid-template-columns: repeat(2, 1fr); }
  .hb-golden-cell:nth-child(2) { border-right: none; }
  .hb-golden-cell:nth-child(1), .hb-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .hb-step { grid-template-columns: 64px 1fr; }
  .hb-step-letter { font-size: 48px; }
  .hb-content-grid { grid-template-columns: repeat(2, 1fr); }
  .hb-content-col:nth-child(2) { border-right: none; }
  .hb-content-col:nth-child(1), .hb-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .hb-grid-2 { grid-template-columns: 1fr; }
  .hb-grid-2-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .hb-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .hb-golden { grid-template-columns: 1fr; }
  .hb-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .hb-golden-cell:last-child { border-bottom: none; }
  .hb-content-grid { grid-template-columns: 1fr; }
  .hb-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .hb-content-col:last-child { border-bottom: none; }
  .hb-step { grid-template-columns: 52px 1fr; }
  .hb-step-letter { font-size: 38px; }
  .hb-step-content { padding-left: 18px; }
}
/* ── Polish layer ───────────────────────────────────────────── */
.hb-kicker { color: var(--gold-deep, #8a7350); }
.hb-headline { font-size: 60px; }
.hb-byline { border-bottom: none; padding-bottom: 6px; margin-bottom: 0; }
.hb-pulse { display: block; width: 100%; height: 40px; margin-bottom: 40px; overflow: visible; }
.hb-pulse path { stroke: var(--gold, #cbae78); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; animation: hb-pulse-draw 2.6s ease-out 0.3s forwards; }
@keyframes hb-pulse-draw { to { stroke-dashoffset: 0; } }
.hb-golden { gap: 14px; border: none; }
.hb-golden-cell { border: 0.5px solid var(--hairline-firm); border-radius: 2px; background: var(--surface-page); transition: transform 0.2s ease, border-color 0.2s ease; }
.hb-golden-cell:last-child { border-right: 0.5px solid var(--hairline-firm); }
.hb-golden-cell:hover { transform: translateY(-2px); border-color: var(--gold); }
.hb-golden-numeral { color: var(--gold); font-size: 34px; }
.hb-section-title { border: none; padding: 18px 0 0; margin-top: 56px; font-size: 28px; position: relative; }
.hb-section-title::before { content: ''; position: absolute; top: 0; left: 0; width: 44px; height: 3px; border-radius: 999px; background: var(--gold); }
.hb-content-grid, .hb-table { border-radius: 2px; }
.hb-content-grid { overflow: hidden; border-color: var(--hairline-firm); }
.hb-table { border-collapse: separate; border-spacing: 0; overflow: hidden; border-color: var(--hairline-firm); }
.hb-table th { background: transparent; color: var(--gold-deep, #8a7350); border-bottom-color: var(--hairline-firm); }
.hb-table td { padding: 13px 16px; line-height: 1.65; }
.hb-table td:first-child { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; color: var(--ink-strong); }
.hb-table tbody tr:nth-child(even) td { background: rgba(203, 174, 120, 0.06); }
.hb-table tbody tr:hover td { background: rgba(203, 174, 120, 0.14); }
.hb-step { border-top-color: var(--hairline-soft); }
.hb-step-letter { text-shadow: none; }
.hb-step-name { font-size: 34px; }
.hb-step-badge, .hb-red-pill { border-radius: 999px; }
.hb-pearl { background: transparent; border: 0.5px solid var(--hairline-firm); border-left: 3px solid var(--gold); border-radius: 2px; padding: 18px 24px; }
.hb-pearl-label { color: var(--gold-deep, #8a7350); font-size: 10px; letter-spacing: 0.18em; margin-bottom: 8px; }
.hb-pearl p { color: var(--ink-mid); font-size: 13.5px; line-height: 1.75; }
.hb-diagram { border-radius: 2px; padding: 28px; border-color: var(--hairline-firm); background: var(--surface-page); }
.hb-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.hb-reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .hb-pulse path { animation: none; stroke-dashoffset: 0; }
  .hb-reveal { opacity: 1; transform: none; transition: none; }
}
@media (max-width: 860px) { .hb-headline { font-size: 36px; } .hb-step-name { font-size: 26px; } .hb-diagram { padding: 18px; } }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const GOLDEN = [
 {
  "n": "01",
  "title": "Cells that sickle",
  "text": "HbS clumps when it gives up its oxygen, so red cells bend into a sickle shape, block small vessels and break down."
 },
 {
  "n": "02",
  "title": "Pain is an emergency",
  "text": "Give strong pain relief within 30 minutes of arrival, and believe the patient."
 },
 {
  "n": "03",
  "title": "Fever is an emergency",
  "text": "A temperature of 38 °C or more in sickle cell disease needs urgent assessment and antibiotics."
 },
 {
  "n": "04",
  "title": "Think chest, spleen, brain",
  "text": "Acute chest syndrome, splenic sequestration and stroke are the emergencies behind a “crisis”."
 }
];

const SECTIONS = [
 {
  "number": "1",
  "colour": "1",
  "name": "Haemoglobin & Inheritance",
  "question": "What goes wrong, and who is affected?",
  "cols": [
   {
    "header": "Normal haemoglobin",
    "items": [
     "Haemoglobin carries oxygen in red cells",
     "Adults mostly make HbA. Babies make HbF before birth, and HbF slowly falls after birth",
     "Haemoglobin is made of protein chains, and a fault in the genes changes the chains",
     "A fault can change the shape (sickle cell) or reduce the amount (thalassaemia)"
    ]
   },
   {
    "header": "Inheritance",
    "items": [
     "Both conditions are autosomal recessive",
     "A child needs a faulty gene from each parent to have the disease",
     "Carriers, called having trait, have one gene and are usually well",
     "Two carriers have a one in four chance with each pregnancy of a child with the disease"
    ]
   },
   {
    "header": "Who is affected",
    "items": [
     "Sickle cell is commonest in people of African and Caribbean heritage",
     "Thalassaemia is commonest in people of Mediterranean, Middle Eastern, and South and South-East Asian heritage",
     "Migration means both are found in all parts of the UK",
     "Carrying trait can protect against malaria, which is why the genes are common"
    ]
   },
   {
    "header": "Screening",
    "items": [
     "In England, babies are screened for sickle cell disease with the newborn heel-prick test",
     "Antenatal screening offers testing in pregnancy",
     "Early diagnosis means treatment and penicillin can start early",
     "Families are offered counselling and support"
    ]
   }
  ],
  "redFlags": [
   "Baby with a positive screening result not yet seen",
   "Family with no plan for infection prevention"
  ],
  "pearl": "Sickle cell trait is not sickle cell disease. It usually causes no illness, but the family should still be told, because two carriers can have a child with the disease."
 },
 {
  "number": "2",
  "colour": "2",
  "name": "Sickle Cell Disease",
  "question": "How does the sickle cell cause harm?",
  "cols": [
   {
    "header": "The mechanism",
    "items": [
     "HbS forms long stiff chains when it gives up its oxygen",
     "Red cells become curved (sickled) and sticky",
     "They block small vessels, so tissues are starved of oxygen and hurt",
     "They also break down early, which causes anaemia and jaundice"
    ]
   },
   {
    "header": "What sets it off",
    "items": [
     "Cold, dehydration and infection",
     "Low oxygen, such as flying, altitude or breathing problems",
     "Stress, pain and strenuous exercise",
     "Sometimes nothing is found"
    ]
   },
   {
    "header": "Features over time",
    "items": [
     "Babies may get painful swollen hands and feet (dactylitis) from about 6 months",
     "Repeated painful episodes, tiredness and pallor from anaemia, and jaundice",
     "Damage to the spleen means a lifelong risk of serious infection",
     "Growth and puberty may be delayed"
    ]
   },
   {
    "header": "Why the spleen matters",
    "items": [
     "The spleen filters bacteria from the blood",
     "In sickle cell the spleen is damaged early in life",
     "This makes infection with bacteria such as pneumococcus dangerous",
     "That is why daily penicillin and vaccinations are so important"
    ]
   }
  ],
  "redFlags": [
   "Fever of 38 °C or more",
   "Pain not controlled at home",
   "New pallor, drowsiness or a swollen belly"
  ],
  "pearl": "The sickle shape is not a fixed fault. Sickling happens when the haemoglobin gives up its oxygen, so anything that lowers oxygen, dries the child out or slows blood flow makes it worse."
 },
 {
  "number": "3",
  "colour": "3",
  "name": "Crises & Emergencies",
  "question": "What are the emergencies, and what do you do?",
  "cols": [
   {
    "header": "Painful crisis",
    "items": [
     "Sudden severe pain in limbs, back, chest or abdomen",
     "Give strong pain relief within 30 minutes of arrival, then reassess often",
     "Offer oral or IV fluids to hydrate, oxygen if the saturations are low, and warmth",
     "Look for a trigger such as infection"
    ]
   },
   {
    "header": "Acute chest syndrome",
    "items": [
     "Chest pain, cough, fast breathing, fever and low oxygen saturations",
     "It is a leading cause of death, so treat it as an emergency",
     "Oxygen, careful fluids, pain relief, antibiotics, and an urgent senior review",
     "Transfusion may be needed"
    ]
   },
   {
    "header": "Other emergencies",
    "items": [
     "Splenic sequestration: a swollen belly, pallor, fast pulse and collapse in a young child",
     "Stroke: sudden weakness, speech or vision change, seizure or severe headache",
     "Aplastic crisis after parvovirus infection: severe pallor and tiredness",
     "Priapism, and sepsis"
    ]
   },
   {
    "header": "Fever",
    "items": [
     "A temperature of 38 °C or more is a medical emergency in sickle cell disease",
     "Take a full set of observations and blood cultures, and give IV antibiotics promptly",
     "Do not wait to see if it settles",
     "Escalate to the haematology team"
    ]
   }
  ],
  "redFlags": [
   "Chest pain with fast breathing",
   "Swollen tender belly and pallor",
   "Any new neurological sign",
   "Fever of 38 °C or more"
  ],
  "pearl": "Undertreating sickle cell pain is a well-recognised problem. Patients are sometimes disbelieved or suspected of drug seeking. Believe the reported pain, treat it early, and use the patient’s own care plan."
 },
 {
  "number": "4",
  "colour": "4",
  "name": "Long-Term Care",
  "question": "What keeps children with sickle cell well?",
  "cols": [
   {
    "header": "Preventing infection",
    "items": [
     "Daily penicillin V from about 3 months, and lifelong for most",
     "Full immunisations, plus extra vaccines such as pneumococcal, and yearly flu",
     "Seek help early for any fever",
     "Malaria prevention when travelling"
    ]
   },
   {
    "header": "Medicines",
    "items": [
     "Folic acid supports red cell production",
     "Hydroxycarbamide raises fetal haemoglobin, which does not sickle, so there are fewer crises",
     "Regular or emergency transfusion, or exchange transfusion, for stroke risk and some emergencies",
     "Pain relief plans for home"
    ]
   },
   {
    "header": "Preventing stroke",
    "items": [
     "A special ultrasound of the brain arteries (transcranial Doppler) screens children for stroke risk, usually from age 2 to 16",
     "Regular transfusions can reduce the risk in those who are at high risk",
     "Teach signs of stroke",
     "Keep appointments"
    ]
   },
   {
    "header": "Everyday life",
    "items": [
     "Drink plenty, dress warmly and avoid extreme cold",
     "Rest when tired and avoid exhausting exercise",
     "Have a hospital passport or care plan",
     "School staff need to know about pain, fluids and toilet breaks"
    ]
   }
  ],
  "redFlags": [
   "Missed penicillin doses",
   "Not up to date with vaccines",
   "Family unsure when to seek help"
  ],
  "pearl": "Most emergencies in sickle cell disease can be reduced by boring daily things: penicillin, vaccines, fluids, warmth and knowing when to come in. That is where nursing education has the most effect."
 },
 {
  "number": "5",
  "colour": "5",
  "name": "Thalassaemia",
  "question": "How does thalassaemia differ from sickle cell?",
  "cols": [
   {
    "header": "What it is",
    "items": [
     "The genes make too little of one of the haemoglobin chains",
     "Beta thalassaemia major is the severe form and needs lifelong treatment",
     "Signs appear from about 3 to 6 months as fetal haemoglobin falls",
     "A severe anaemia gives pallor, tiredness, poor feeding, poor growth and jaundice"
    ]
   },
   {
    "header": "Untreated",
    "items": [
     "The bone marrow expands to make more cells, which changes the bones of the face and skull",
     "The liver and spleen enlarge",
     "Children fail to thrive and can develop heart failure",
     "This is why regular transfusion matters"
    ]
   },
   {
    "header": "Treatment",
    "items": [
     "Regular blood transfusions, typically every 3 to 4 weeks",
     "Iron chelation, using drugs such as desferrioxamine or deferasirox, because transfusions load the body with iron",
     "Folic acid",
     "A stem cell transplant is the only cure"
    ]
   },
   {
    "header": "Complications",
    "items": [
     "Iron overload can damage the heart, liver and hormone glands",
     "Watch growth, puberty and diabetes",
     "Gallstones and bone problems",
     "Transfusion reactions and infection"
    ]
   }
  ],
  "redFlags": [
   "Missed transfusion or chelation",
   "Shortness of breath or swelling in a transfused child",
   "Poor growth or delayed puberty"
  ],
  "pearl": "The treatment causes the main long-term problem. Transfusions keep a child well but load the body with iron the body cannot remove, so chelation is not optional."
 },
 {
  "number": "6",
  "colour": "6",
  "name": "Nursing & Family",
  "question": "What should you remember at the bedside?",
  "cols": [
   {
    "header": "Assess",
    "items": [
     "Full observations, including SpO₂ and temperature",
     "Pain score using an age-appropriate tool, and repeat often",
     "Hydration and urine output",
     "Look for signs of infection, chest problems, an enlarged belly and neurological change"
    ]
   },
   {
    "header": "Act",
    "items": [
     "Analgesia early and on time, following the individual care plan",
     "Oxygen, fluids and warmth",
     "Escalate promptly for fever, chest signs or neurological change",
     "Involve the haematology team"
    ]
   },
   {
    "header": "Communicate",
    "items": [
     "Listen to the child and family. They know the patient’s usual pattern better than you",
     "Avoid judgement about pain relief",
     "Use clear, respectful language",
     "Recognise the impact of a long-term inherited condition"
    ]
   },
   {
    "header": "Support",
    "items": [
     "Genetic counselling for the family",
     "Sickle Cell Society and UK Thalassaemia Society give advice and support",
     "Help with school, travel and transition to adult services",
     "Look for low mood and anxiety"
    ]
   }
  ],
  "redFlags": [
   "Delay in giving pain relief",
   "Patient described as drug seeking without assessment",
   "Family without an emergency plan"
  ],
  "pearl": "People with sickle cell often say their care was affected by disbelief and delays. Being fast, kind and believing the patient is a clinical intervention."
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
  "title": "How a Sickle Cell Crisis Develops",
  "items": [
   {
    "top": "Trigger",
    "title": "Cold, dehydration,",
    "lines": [
     "infection, low oxygen",
     "or stress"
    ]
   },
   {
    "top": "HbS",
    "title": "Gives up oxygen",
    "lines": [
     "HbS clumps into",
     "long stiff chains"
    ]
   },
   {
    "top": "Red cells",
    "title": "Sickle",
    "lines": [
     "Curved and sticky",
     "cells"
    ]
   },
   {
    "top": "Blockage",
    "title": "Small vessels blocked",
    "lines": [
     "Tissues starved of",
     "oxygen"
    ]
   },
   {
    "top": "Result",
    "title": "Pain and damage",
    "lines": [
     "Painful crisis, chest,",
     "spleen or brain harm"
    ]
   }
  ],
  "caption": "Each step is a chance to help: warmth, fluids, oxygen and early treatment interrupt the chain.",
  "hl": 2
 },
 {
  "kind": "table",
  "title": "Sickle Cell Emergencies",
  "head": [
   "Emergency",
   "Signs",
   "First actions"
  ],
  "rows": [
   [
    "Painful crisis",
    "Severe pain in limbs, back, chest or abdomen",
    "Strong analgesia within 30 minutes, fluids, warmth, oxygen if needed"
   ],
   [
    "Acute chest syndrome",
    "Chest pain, cough, fast breathing, fever, low SpO₂",
    "Oxygen, senior review, antibiotics, careful fluids, possible transfusion"
   ],
   [
    "Splenic sequestration",
    "Swollen belly, pallor, fast pulse, collapse in a young child",
    "Emergency, fluids and urgent transfusion"
   ],
   [
    "Stroke",
    "Sudden weakness, speech or vision change, seizure",
    "Emergency, ABCDE, urgent exchange transfusion"
   ],
   [
    "Fever or sepsis",
    "Temperature of 38 °C or more",
    "Cultures and IV antibiotics without delay"
   ],
   [
    "Aplastic crisis",
    "Severe pallor and tiredness after a viral illness",
    "Escalate, transfusion may be needed"
   ]
  ]
 },
 {
  "kind": "table",
  "title": "Sickle Cell and Thalassaemia Compared",
  "head": [
   "Feature",
   "Sickle cell disease",
   "Beta thalassaemia major"
  ],
  "rows": [
   [
    "The fault",
    "Abnormal haemoglobin (HbS) that sickles",
    "Too little beta-globin, so too little haemoglobin"
   ],
   [
    "Main problem",
    "Blocked vessels, pain and organ damage",
    "Severe anaemia from early red cell breakdown"
   ],
   [
    "Usual treatment",
    "Penicillin, folic acid, hydroxycarbamide, transfusion when needed",
    "Regular transfusion, iron chelation and folic acid"
   ],
   [
    "Special risk",
    "Infection, chest syndrome, stroke",
    "Iron overload in the heart, liver and glands"
   ],
   [
    "Commonest in",
    "African and Caribbean heritage",
    "Mediterranean, Middle Eastern and South Asian heritage"
   ]
  ]
 },
 {
  "kind": "table",
  "title": "Medicines You Will Meet",
  "head": [
   "Medicine",
   "Class",
   "What it does"
  ],
  "rows": [
   [
    "Penicillin V",
    "Antibiotic",
    "Protects against infection when the spleen does not work"
   ],
   [
    "Folic acid",
    "Vitamin",
    "Supports red cell production during rapid cell turnover"
   ],
   [
    "Hydroxycarbamide",
    "Haematology",
    "Raises fetal haemoglobin, which does not sickle, so fewer crises"
   ],
   [
    "Red cell transfusion",
    "Blood product",
    "Replaces faulty or missing red cells and helps prevent stroke"
   ],
   [
    "Iron chelation",
    "Haematology",
    "Removes iron built up by repeated transfusion"
   ],
   [
    "Morphine and other opioids",
    "Analgesic",
    "Strong pain relief in a crisis. Watch breathing and sedation"
   ]
  ]
 },
 {
  "kind": "pearl",
  "label": "Study aid only",
  "text": "This page explains the principles. Follow your trust’s sickle cell pathway, the patient’s own care plan, and the BNFC for drugs and doses."
 }
];

const quizQuestions = [
 {
  "question": "What triggers sickling in sickle cell disease?",
  "options": [
   "Warm weather",
   "Low oxygen, cold, dehydration or infection",
   "Good sleep",
   "Exercise only"
  ],
  "answer": 1,
  "explanation": "HbS sickles when it gives up its oxygen, so low oxygen, cold and dehydration make it worse."
 },
 {
  "question": "Within what time should strong analgesia be given in a sickle cell crisis?",
  "options": [
   "30 minutes of arrival",
   "4 hours",
   "Next morning",
   "After blood tests"
  ],
  "answer": 0,
  "explanation": "Pain in a sickle cell crisis should be treated within 30 minutes of arrival."
 },
 {
  "question": "A child with sickle cell disease has a temperature of 38.5 °C. What should you do?",
  "options": [
   "Give paracetamol and wait",
   "Treat it as an emergency: full observations, cultures and prompt IV antibiotics",
   "Send them home",
   "Observe for a day"
  ],
  "answer": 1,
  "explanation": "The spleen is damaged, so infection can be overwhelming. Fever is an emergency."
 },
 {
  "question": "Which pair is a sign of acute chest syndrome?",
  "options": [
   "Chest pain and fast breathing with fever",
   "Ankle swelling and a rash",
   "Headache and thirst",
   "Hunger and sleepiness"
  ],
  "answer": 0,
  "explanation": "Chest pain, cough, fast breathing, fever and low oxygen saturation."
 },
 {
  "question": "Why is daily penicillin given?",
  "options": [
   "To treat pain",
   "Because the spleen is damaged and infection risk is high",
   "To raise haemoglobin",
   "To prevent sickling"
  ],
  "answer": 1,
  "explanation": "A damaged spleen cannot filter bacteria, so daily penicillin protects against serious infection."
 },
 {
  "question": "How does hydroxycarbamide help?",
  "options": [
   "It raises fetal haemoglobin, which does not sickle",
   "It removes iron",
   "It replaces red cells",
   "It treats pain"
  ],
  "answer": 0,
  "explanation": "Fetal haemoglobin does not sickle, so more of it means fewer crises."
 },
 {
  "question": "Why do children with beta thalassaemia major need iron chelation?",
  "options": [
   "They lose iron",
   "Regular transfusions load the body with iron it cannot remove",
   "They eat too much iron",
   "It treats infection"
  ],
  "answer": 1,
  "explanation": "Each transfusion adds iron, and the body has no way to excrete it, so it builds up in the heart and liver."
 },
 {
  "question": "What does sickle cell trait mean?",
  "options": [
   "The person has the disease",
   "The person carries one abnormal gene and is usually well",
   "The person is immune",
   "The person needs transfusions"
  ],
  "answer": 1,
  "explanation": "Trait means a carrier with one abnormal gene. It is usually harmless but matters for family planning."
 }
];

const SOURCES = [
 {
  "citation": "NICE (2012, updated)",
  "title": "Sickle cell disease: managing acute painful episodes in hospital (CG143)",
  "href": "https://www.nice.org.uk/guidance/cg143"
 },
 {
  "citation": "NHS Sickle Cell and Thalassaemia Screening Programme",
  "title": "Handbooks and information for professionals",
  "href": "https://www.gov.uk/government/collections/sickle-cell-and-thalassaemia-screening-programme"
 },
 {
  "citation": "BNF for Children (NICE)",
  "title": "Sickle cell disease, thalassaemia and related drugs",
  "href": "https://bnfc.nice.org.uk/"
 },
 {
  "citation": "The Sickle Cell Society",
  "title": "Support and information for families",
  "href": "https://www.sicklecellsociety.org/"
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

export default function SickleCellThalassaemiaPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.hb-guide .hb-step, .hb-guide .hb-diagram, .hb-guide .hb-golden-cell, .hb-guide .hb-pearl'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('hb-reveal'); io.observe(el); }
    });
    return () => io.disconnect();
  }, []);


  const renderDiagram = (id: string) => {
    switch (id) {

      default: return null;
    }
  };

  return (
    <div className="hb-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="hb-wrap">
        <Link href="/hub" className="hb-back">
          <span className="hb-back-arrow">&larr;</span>
          Nursing Hub
        </Link>

        <p className="hb-kicker">{"Haematology · Children’s & Adult Nursing"}</p>
        <h1 className="hb-headline">Sickle Cell Disease & Thalassaemia</h1>
        <p className="hb-standfirst">{"The two commonest inherited blood disorders you will meet: why the red cells go wrong, what a sickle cell crisis is and how to treat it quickly, and the long-term care that keeps children well."}</p>
        <p className="hb-byline">{"Children’s & adult nursing · The Nurse Lab"}</p>
        <svg className="hb-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,30 L180,30 L196,30 L204,24 L212,30 L232,30 L238,36 L246,4 L254,44 L260,30 L280,30 L296,20 L312,30 L520,30 L536,30 L544,24 L552,30 L572,30 L578,36 L586,4 L594,44 L600,30 L620,30 L636,20 L652,30 L1000,30" fill="none" pathLength={1} />
        </svg>
        <EditorialSaveButton
          hubItemId="sickle-cell-thalassaemia"
          hubItemTitle="Sickle Cell Disease & Thalassaemia"
        />

        <div className="hb-pearl" style={{ marginBottom: '40px' }}>
          <p className="hb-pearl-label">Student note</p>
          <p>{"Haemoglobin is the protein in red blood cells that carries oxygen. A haemoglobinopathy is an inherited disorder of haemoglobin. HbS is the abnormal haemoglobin in sickle cell disease and HbF is fetal haemoglobin. A vaso-occlusive crisis is a painful blockage of small blood vessels by sickled cells. Trait means someone carries one abnormal gene and is usually well."}</p>
        </div>

        <div className="hb-golden">
          {GOLDEN.map((cell) => (
            <div key={cell.n} className="hb-golden-cell">
              <span className="hb-golden-numeral">{cell.n}</span>
              <p className="hb-golden-title">{cell.title}</p>
              <p className="hb-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="hb-step">
            <div className="hb-step-sidebar">
              <span className={`hb-step-letter hb-letter-${section.colour}`}>{section.number}</span>
              <span className={`hb-step-badge hb-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="hb-step-content">
              <h2 className="hb-step-name">{section.name}</h2>
              <p className="hb-step-question">{section.question}</p>

              <div className="hb-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="hb-content-col">
                    <p className="hb-col-header">{col.header}</p>
                    <ul className="hb-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="hb-redflags-label">Watch for</p>
                  <div className="hb-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="hb-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="hb-pearl">
                  <p className="hb-pearl-label">Clinical pearl</p>
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
                <h2 className="hb-section-title">{block.title}</h2>
                <div className="hb-table-wrap">
                  <table className="hb-table" style={{ marginBottom: '32px' }}>
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
              <div key={idx} className="hb-pearl" style={{ marginBottom: '32px' }}>
                <p className="hb-pearl-label">{block.label}</p>
                <p>{block.text}</p>
              </div>
            );
          }
          if (block.kind === 'flow') {
            return (
              <div key={idx}>
                <h2 className="hb-section-title">{block.title}</h2>
                <div className="hb-diagram">
                  <FlowDiagram items={block.items} label={block.title} prefix="hb" hl={block.hl} />
                  <p className="hb-diagram-caption">{block.caption}</p>
                </div>
              </div>
            );
          }
          return (
            <div key={idx}>
              <h2 className="hb-section-title">{block.title}</h2>
              {renderDiagram(block.id)}
            </div>
          );
        })}

        <h2 className="hb-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Sickle Cell Disease & Thalassaemia" questions={quizQuestions} />

        <SourceLinks sources={SOURCES} />
      </div>
    </div>
  );
}
