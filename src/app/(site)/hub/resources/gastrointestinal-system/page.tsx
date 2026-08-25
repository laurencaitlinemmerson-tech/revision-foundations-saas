'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.gi-guide *, .gi-guide *::before, .gi-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.gi-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.gi-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.gi-back {
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
.gi-back:hover { color: var(--ink-soft); }
.gi-back-arrow { font-style: normal; }

/* Masthead */
.gi-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.gi-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.gi-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.gi-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

/* Golden rules grid */
.gi-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.gi-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.gi-golden-cell:last-child { border-right: none; }

.gi-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.gi-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.gi-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.gi-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.gi-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.gi-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.gi-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.gi-step-content {
  padding-left: 32px;
}

.gi-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.gi-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

/* 4-column content grid */
.gi-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.gi-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.gi-content-col:last-child { border-right: none; }

.gi-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.gi-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.gi-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.gi-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

/* Red flags */
.gi-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.gi-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.gi-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.gi-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.gi-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.gi-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.gi-section-title {
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
.gi-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.gi-table th {
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
.gi-table th:last-child { border-right: none; }

.gi-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.gi-table td:last-child { border-right: none; }
.gi-table tr:last-child td { border-bottom: none; }
.gi-table td:first-child { font-weight: 400; color: var(--ink-mid); }

/* 4-col info grid */
.gi-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.gi-info-cell {
  padding: 18px 16px;
  border-right: 0.5px solid var(--hairline-firm);
}
.gi-info-cell:last-child { border-right: none; }

.gi-info-cell-title {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #333;
  margin-bottom: 12px;
  font-weight: 400;
  padding-bottom: 8px;
  border-bottom: 0.5px solid var(--hairline-soft);
}

.gi-info-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.gi-info-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0 2px 10px;
  font-weight: 300;
  position: relative;
}
.gi-info-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

/* 2-col grid */
.gi-two-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.gi-two-cell {
  padding: 18px 16px;
  border-right: 0.5px solid var(--hairline-firm);
}
.gi-two-cell:last-child { border-right: none; }

.gi-two-cell-title {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #333;
  margin-bottom: 12px;
  font-weight: 400;
  padding-bottom: 8px;
  border-bottom: 0.5px solid var(--hairline-soft);
}

.gi-two-text {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Step colour system */
.gi-letter-1 { color: var(--blue-600); }
.gi-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.gi-letter-2 { color: var(--teal-600); }
.gi-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.gi-letter-3 { color: var(--coral-600); }
.gi-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.gi-letter-4 { color: var(--purple-600); }
.gi-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.gi-letter-5 { color: var(--gray-600); }
.gi-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.gi-letter-6 { color: #8B5E3C; }
.gi-badge-6 { background: var(--surface-sunken); color: #6B4529; }

/* Responsive */
@media (max-width: 860px) {
  .gi-wrap { padding: 24px 20px 48px; }
  .gi-headline { font-size: 36px; }
  .gi-golden { grid-template-columns: 1fr 1fr; }
  .gi-golden-cell { border-bottom: 0.5px solid var(--hairline-firm); }
  .gi-step { grid-template-columns: 1fr; }
  .gi-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid var(--hairline-firm); padding-bottom: 16px; margin-bottom: 16px; padding-right: 0; }
  .gi-step-content { padding-left: 0; }
  .gi-content-grid { grid-template-columns: 1fr 1fr; }
  .gi-content-col { border-bottom: 0.5px solid var(--hairline-firm); }
  .gi-info-grid { grid-template-columns: 1fr 1fr; }
  .gi-info-cell { border-bottom: 0.5px solid var(--hairline-firm); }
  .gi-two-grid { grid-template-columns: 1fr; }
  .gi-two-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .gi-table { font-size: 11px; }
}

@media (max-width: 520px) {
  .gi-golden { grid-template-columns: 1fr; }
  .gi-content-grid { grid-template-columns: 1fr; }
  .gi-info-grid { grid-template-columns: 1fr; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Overview of the Gastrointestinal System',
    question: 'What does the GI system actually do, and why does it matter so much in children?',
    cols: [
      {
        header: 'What the GI tract does',
        items: [
          'Breaks down food into smaller usable pieces',
          'Absorbs nutrients, water, and electrolytes into the blood',
          'Stores and eliminates what the body cannot use',
          'Houses much of the body’s immune defence',
        ],
      },
      {
        header: 'Why children matter more',
        items: [
          'Children dehydrate quickly with vomiting or diarrhoea',
          'Smaller fluid reserves and higher water turnover',
          'Feeding is closely tied to growth and development',
          'GI symptoms can be the first sign of wider illness',
        ],
      },
      {
        header: 'GI tract order',
        items: [
          'Mouth, pharynx, oesophagus: chewing and swallowing',
          'Stomach: storage, acid, mechanical mixing',
          'Small intestine: most digestion and absorption',
          'Large intestine, rectum, anus: water reclaim and elimination',
        ],
      },
      {
        header: 'Accessory organs',
        items: [
          'Liver: bile production, metabolism, detoxification',
          'Gallbladder: stores and releases bile',
          'Pancreas: digestive enzymes and insulin',
          'Salivary glands: start carbohydrate digestion',
        ],
      },
    ],
    redFlags: ['Bile-stained (green) vomit', 'Blood in stool or vomit', 'Severe dehydration', 'Abdominal distension with no stool or wind'],
    pearl:
      'The GI system is not just about feeding and pooing. It is one of the most important fluid and electrolyte regulators in the body. When a child stops absorbing, or starts losing, fluid through the gut, the whole-body picture can change quickly.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Digestion and Absorption',
    question: 'How does food actually turn into something the body can use?',
    cols: [
      {
        header: 'Mechanical digestion',
        items: [
          'Chewing breaks food into smaller pieces',
          'Stomach churning mixes food with acid and enzymes',
          'Peristalsis pushes contents along the tract',
          'Surface area matters: smaller pieces digest faster',
        ],
      },
      {
        header: 'Chemical digestion',
        items: [
          'Saliva starts on carbohydrates',
          'Stomach acid and pepsin work on protein',
          'Pancreatic enzymes break down fats, proteins, and carbs',
          'Bile from the liver emulsifies fats',
        ],
      },
      {
        header: 'Absorption',
        items: [
          'Most absorption happens in the small intestine',
          'Villi and microvilli massively increase surface area',
          'Nutrients pass into blood or lymph',
          'Vitamin B12 needs intrinsic factor from the stomach',
        ],
      },
      {
        header: 'Water and electrolytes',
        items: [
          'Small intestine absorbs most water with nutrients',
          'Large intestine reclaims remaining water and sodium',
          'If transit is too fast, water cannot be reabsorbed',
          'This is why diarrhoea causes dehydration so quickly',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Children with diarrhoea are not just losing water. They are losing sodium, potassium, and bicarbonate too. That is why oral rehydration solution is not the same as plain water, and why severe diarrhoea can cause electrolyte and acid-base problems alongside dehydration.',
  },
  {
    number: '3',
    colour: '3',
    name: 'Common Paediatric GI Conditions',
    question: 'Which GI problems should you recognise on placement?',
    cols: [
      {
        header: 'Gastroenteritis',
        items: [
          'Usually viral (rotavirus, norovirus)',
          'Vomiting, diarrhoea, abdominal cramps',
          'Main risk is dehydration, not the infection itself',
          'Most children manage with oral rehydration at home',
        ],
      },
      {
        header: 'Constipation',
        items: [
          'Very common in children',
          'Hard, infrequent, or painful stools',
          'Can cause overflow diarrhoea (mistaken for diarrhoea)',
          'Long-term effects on appetite, mood, and continence',
        ],
      },
      {
        header: 'Reflux and vomiting',
        items: [
          'GORD common in infants, usually improves with age',
          'Projectile vomiting may suggest pyloric stenosis',
          'Bile-stained (green) vomit is always a red flag',
          'Persistent vomiting risks dehydration and electrolyte loss',
        ],
      },
      {
        header: 'Surgical and serious causes',
        items: [
          'Intussusception: severe colicky pain, redcurrant jelly stool',
          'Appendicitis: pain moving to right iliac fossa, fever',
          'Volvulus: surgical emergency with green vomit',
          'IBD: chronic diarrhoea, weight loss, blood in stool',
        ],
      },
    ],
    redFlags: ['Bile-stained vomit', 'Blood in stool or vomit', 'Severe abdominal pain with guarding', 'Signs of shock with abdominal symptoms'],
    pearl:
      'Not every vomit or loose stool is gastroenteritis. Bile in vomit, blood in stool, severe localised pain, or a distended quiet abdomen all need urgent review. A "GI bug" assumption is only safe once you have ruled out the things that need surgery.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Liver, Pancreas, and Accessory Organs',
    question: 'What do the accessory organs add, and what happens if they go wrong?',
    cols: [
      {
        header: 'Liver functions',
        items: [
          'Produces bile to help digest fats',
          'Metabolises drugs, hormones, and toxins',
          'Stores glycogen and releases glucose',
          'Makes clotting factors and many proteins',
        ],
      },
      {
        header: 'When the liver struggles',
        items: [
          'Jaundice (yellow skin and eyes)',
          'Bruising and bleeding from poor clotting',
          'Confusion from rising ammonia',
          'Drug doses may need adjusting',
        ],
      },
      {
        header: 'Pancreas',
        items: [
          'Exocrine: enzymes for digestion',
          'Endocrine: insulin and glucagon for glucose control',
          'Pancreatitis: severe pain, vomiting, raised amylase',
          'Cystic fibrosis affects pancreatic enzyme release',
        ],
      },
      {
        header: 'Gallbladder',
        items: [
          'Stores bile between meals',
          'Releases bile in response to fatty food',
          'Gallstones rare in children but possible',
          'Biliary atresia is a serious neonatal condition',
        ],
      },
    ],
    redFlags: ['New jaundice in a child', 'Severe upper abdominal pain with vomiting', 'Pale stools with dark urine'],
    pearl:
      'Pale stools with dark urine is a classic combination that suggests bile is not getting through to the gut. In a baby, this picture should never be dismissed: prolonged jaundice with pale stools needs urgent investigation for biliary atresia.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Paediatric GI Assessment',
    question: 'What should you check at the bedside, and how do you measure it properly?',
    cols: [
      {
        header: 'History',
        items: [
          'How many vomits or stools, and what did they look like?',
          'Any blood, bile, or mucus?',
          'Last wet nappy or wee?',
          'Feeding, appetite, and weight changes',
        ],
      },
      {
        header: 'End-of-bed look',
        items: [
          'Is the child alert, miserable, floppy, or playful?',
          'Skin colour, hydration, and perfusion',
          'Abdomen: distended, flat, or scaphoid?',
          'Pain behaviour: still, drawing knees up, guarding',
        ],
      },
      {
        header: 'Examination',
        items: [
          'Inspect first: scars, swelling, visible peristalsis',
          'Auscultate: present, increased, or absent bowel sounds',
          'Palpate gently: tenderness, masses, guarding',
          'Note where the pain is and whether it moves',
        ],
      },
      {
        header: 'Output and fluid balance',
        items: [
          'Record vomits and stools accurately',
          'Weigh nappies for true output',
          'Look at trends, not single readings',
          'Daily weight if dehydration is a concern',
        ],
      },
    ],
    redFlags: ['Rigid or board-like abdomen', 'No bowel sounds with distension', 'Severe pain that wakes the child from sleep', 'Bilious vomiting'],
    pearl:
      'A quiet, still child with a distended abdomen is not a calm child. They may be staying still because moving hurts. Always read GI assessment alongside how the child is behaving overall, not just what the abdomen feels like under your hands.',
  },
  {
    number: '6',
    colour: '6',
    name: 'GI Problems and Whole-Child Impact',
    question: 'Why do GI symptoms affect so much more than the gut?',
    cols: [
      {
        header: 'GI + fluid balance',
        items: [
          'Vomiting and diarrhoea cause rapid fluid loss',
          'Children can become dehydrated within hours',
          'Output losses must be matched in replacement',
          'See the dehydration page for full assessment',
        ],
      },
      {
        header: 'GI + electrolytes',
        items: [
          'Vomiting loses hydrogen, chloride, and potassium',
          'Diarrhoea loses sodium, potassium, and bicarbonate',
          'Imbalance affects heart rhythm and consciousness',
          'Always check U&Es in significant losses',
        ],
      },
      {
        header: 'GI + nutrition and growth',
        items: [
          'Poor intake or absorption affects growth',
          'Chronic GI illness affects school and energy',
          'Weight loss is a red flag in any child',
          'Failure to thrive needs systematic review',
        ],
      },
      {
        header: 'GI + wellbeing',
        items: [
          'Pain, urgency, and accidents affect confidence',
          'Constipation can cause behavioural changes',
          'Eating problems may be physical or psychological',
          'Family stress often follows GI illness',
        ],
      },
    ],
    redFlags: [
      'Severe dehydration with reduced consciousness',
      'Weight loss with chronic diarrhoea or vomiting',
      'Significant electrolyte disturbance',
      'Abdominal signs of obstruction or peritonitis',
    ],
    pearl:
      'GI illness is rarely "just" GI. By the time a child has been vomiting for a day, you may be looking at dehydration, electrolyte imbalance, low blood sugar, exhaustion, and a worried family. Treat the whole child, not just the symptom in front of you.',
  },
];

const quizQuestions = [
  {
    question: 'Where does most nutrient absorption happen?',
    options: ['Stomach', 'Small intestine', 'Large intestine', 'Oesophagus'],
    answer: 1,
    explanation: 'The small intestine is where most digestion and absorption happens, helped by villi and microvilli that hugely increase surface area.',
  },
  {
    question: 'Which finding is always a red flag in a vomiting child?',
    options: ['Vomit after a big meal', 'Bile-stained (green) vomit', 'One small vomit with no other symptoms', 'Posseting in a baby after feeds'],
    answer: 1,
    explanation: 'Green, bile-stained vomit can suggest intestinal obstruction (including volvulus) and should always be escalated quickly.',
  },
  {
    question: 'Why does diarrhoea cause dehydration so quickly in children?',
    options: ['It stops the kidneys working', 'Water and electrolytes are lost faster than they can be reabsorbed', 'It always causes fever', 'It stops the child from feeling thirsty'],
    answer: 1,
    explanation: 'When transit is too fast, water and electrolytes do not have time to be reabsorbed, so they are lost in stool.',
  },
  {
    question: 'What can overflow diarrhoea suggest in a constipated child?',
    options: ['Infection only', 'Liquid stool leaking past a hard impacted stool', 'A new food intolerance', 'A normal bowel pattern'],
    answer: 1,
    explanation: 'In chronic constipation, liquid stool can leak around an impacted mass and be mistaken for diarrhoea. The history is the clue.',
  },
  {
    question: 'Pale stools with dark urine in a baby should make you think of which group of conditions?',
    options: ['Reflux only', 'Bile flow problems such as biliary atresia', 'Lactose intolerance', 'Simple viral gastroenteritis'],
    answer: 1,
    explanation: 'Pale stools and dark urine suggest bile is not reaching the gut, which is a serious sign and needs urgent investigation in a baby.',
  },
  {
    question: 'Which is the most important early sign that gastroenteritis is becoming dangerous?',
    options: ['Mild tummy ache', 'Reduced wet nappies and signs of dehydration', 'One episode of loose stool', 'A small amount of mucus in stool'],
    answer: 1,
    explanation: 'The main danger of gastroenteritis is dehydration, so reduced output and dry signs matter more than the number of stools.',
  },
  {
    question: 'Which combination most strongly suggests a surgical abdomen?',
    options: ['Mild pain that comes and goes after eating', 'Severe pain, rigid abdomen, and absent bowel sounds', 'Mild diarrhoea with normal observations', 'Posseting after feeds in a thriving baby'],
    answer: 1,
    explanation: 'A rigid abdomen with severe pain and absent bowel sounds suggests peritonitis or significant pathology and needs urgent surgical review.',
  },
  {
    question: 'Which electrolyte is most at risk with significant vomiting?',
    options: ['Calcium only', 'Potassium', 'Magnesium only', 'Phosphate only'],
    answer: 1,
    explanation: 'Vomiting can cause significant potassium loss, alongside hydrogen and chloride, which is why U&Es are important after prolonged vomiting.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function GastrointestinalSystemPage() {
  return (
    <div className="gi-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="gi-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="gi-back">
          <span className="gi-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="gi-kicker">Children&apos;s Nursing &middot; Paediatric Assessment</p>
        <h1 className="gi-headline">Gastrointestinal System &amp; Assessment</h1>
        <p className="gi-standfirst">
          How the gut digests, absorbs, and regulates fluid, which paediatric GI conditions to recognise, and the signs that need escalation early.
        </p>
        <p className="gi-byline">Children&apos;s nursing &middot; Gastrointestinal &amp; nutrition &middot; The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="gastrointestinal-system"
          hubItemTitle="Gastrointestinal System & Assessment"
        />

        <div className="gi-pearl" style={{ marginBottom: '40px' }}>
          <p className="gi-pearl-label">Student note</p>
          <p>
            Peristalsis means the muscular wave that pushes food along the gut. Villi and microvilli are the tiny folds in the small intestine that hugely increase surface area for absorption. Bile is a digestive fluid made by the liver that helps break down fats. ORS stands for oral rehydration solution. Failure to thrive means a child is not gaining weight or growing as expected. Bilious vomit means vomit that is stained green by bile and is always a red flag.
          </p>
        </div>

        {/* Golden rules */}
        <div className="gi-golden">
          {[
            {
              n: '01',
              title: 'GI tract order',
              text: 'Mouth, oesophagus, stomach, small intestine, large intestine, rectum. Plus liver, gallbladder, and pancreas helping along the way.',
            },
            {
              n: '02',
              title: 'Most absorption',
              text: 'Happens in the small intestine. Villi and microvilli massively increase the surface area available for nutrients and water.',
            },
            {
              n: '03',
              title: 'Fluid losses matter',
              text: 'Vomiting and diarrhoea remove water and electrolytes quickly. Children lose ground faster than adults and need watching closely.',
            },
            {
              n: '04',
              title: 'Golden rule',
              text: 'Bile-stained vomit, blood in stool, severe pain, or a rigid abdomen are never "just a tummy bug". Escalate the pattern early.',
            },
          ].map((cell) => (
            <div key={cell.n} className="gi-golden-cell">
              <span className="gi-golden-numeral">{cell.n}</span>
              <p className="gi-golden-title">{cell.title}</p>
              <p className="gi-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Numbered sections */}
        {SECTIONS.map((section) => (
          <div key={section.number} className="gi-step">
            {/* Sidebar */}
            <div className="gi-step-sidebar">
              <span className={`gi-step-letter gi-letter-${section.colour}`}>{section.number}</span>
              <span className={`gi-step-badge gi-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            {/* Content */}
            <div className="gi-step-content">
              <h2 className="gi-step-name">{section.name}</h2>
              <p className="gi-step-question">{section.question}</p>

              {/* 4-col grid */}
              <div className="gi-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="gi-content-col">
                    <p className="gi-col-header">{col.header}</p>
                    <ul className="gi-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Red flags */}
              {section.redFlags.length > 0 && (
                <>
                  <p className="gi-redflags-label">Red flags</p>
                  <div className="gi-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="gi-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Pearl */}
              {section.pearl && (
                <div className="gi-pearl">
                  <p className="gi-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Vomit & stool clues table */}
        <h2 className="gi-section-title">Vomit &amp; Stool Clues</h2>
        <table className="gi-table" style={{ marginBottom: '18px' }}>
          <thead>
            <tr>
              <th>Finding</th>
              <th>What it might mean</th>
              <th>What to do</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Bile-stained (green) vomit', 'Possible intestinal obstruction, including volvulus.', 'Escalate urgently. Surgical review needed.'],
              ['Coffee-ground vomit', 'Old blood from upper GI bleeding.', 'Escalate. Check observations, hydration, and clotting picture.'],
              ['Fresh blood in vomit', 'Active upper GI bleeding.', 'Escalate urgently. Monitor for shock.'],
              ['Redcurrant jelly stool', 'Possible intussusception (classic late sign).', 'Escalate urgently. Surgical assessment.'],
              ['Pale stool with dark urine', 'Bile not reaching the gut, possible biliary atresia in infants.', 'Escalate for urgent investigation in any age, especially babies.'],
              ['Hard, infrequent stool', 'Constipation, possibly chronic.', 'Review diet, fluid, toilet routine; consider stool softeners.'],
              ['Watery diarrhoea', 'Most commonly viral gastroenteritis.', 'Focus on hydration assessment and ORS as needed.'],
            ].map(([finding, meaning, action]) => (
              <tr key={finding}>
                <td>{finding}</td>
                <td>{meaning}</td>
                <td>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* GI pictures side by side */}
        <div className="gi-two-grid">
          <div className="gi-two-cell">
            <p className="gi-two-cell-title">Worrying GI picture</p>
            <ul className="gi-info-list">
              <li>Bile-stained vomiting</li>
              <li>Blood in stool or vomit</li>
              <li>Distended, rigid abdomen</li>
              <li>Severe localised or worsening pain</li>
              <li>Pale stools with dark urine</li>
            </ul>
          </div>
          <div className="gi-two-cell">
            <p className="gi-two-cell-title">Reassuring GI picture</p>
            <ul className="gi-info-list">
              <li>Alert, interactive child</li>
              <li>Drinking and keeping fluid down</li>
              <li>Soft, non-tender abdomen with normal sounds</li>
              <li>Normal urine output</li>
              <li>Symptoms improving over hours, not worsening</li>
            </ul>
          </div>
        </div>

        {/* Whole-child links table */}
        <h2 className="gi-section-title">Why GI Problems Affect the Whole Child</h2>
        <table className="gi-table" style={{ marginBottom: '18px' }}>
          <thead>
            <tr>
              <th>Link</th>
              <th>What connects them</th>
              <th>Bedside meaning</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['GI + fluid balance', 'Vomiting and diarrhoea cause rapid water and electrolyte losses through the gut.', 'A short illness can leave a child clinically dehydrated within hours, especially infants.'],
              ['GI + cardiovascular', 'Fluid loss reduces circulating volume, which raises heart rate and can drop perfusion.', 'Tachycardia and prolonged capillary refill in a vomiting child are not "just upset", they are warning signs.'],
              ['GI + neurological', 'Electrolyte shifts (especially sodium) and dehydration affect consciousness.', 'A drowsy child with vomiting needs prompt review, not reassurance alone.'],
              ['GI + nutrition', 'Chronic GI problems affect intake, absorption, growth, and energy.', 'Weight loss or failure to thrive points to a chronic process, not a one-off bug.'],
            ].map(([link, mechanism, meaning]) => (
              <tr key={link}>
                <td>{link}</td>
                <td>{mechanism}</td>
                <td>{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Quick recap */}
        <div className="gi-info-grid" style={{ marginTop: '32px' }}>
          <div className="gi-info-cell">
            <p className="gi-info-cell-title">GI tract</p>
            <ul className="gi-info-list">
              <li>Mouth to anus, plus liver, gallbladder, pancreas</li>
            </ul>
          </div>
          <div className="gi-info-cell">
            <p className="gi-info-cell-title">Main job</p>
            <ul className="gi-info-list">
              <li>Digest, absorb, eliminate, regulate fluid</li>
            </ul>
          </div>
          <div className="gi-info-cell">
            <p className="gi-info-cell-title">Assessment rule</p>
            <ul className="gi-info-list">
              <li>Look, listen, then feel. History is half the answer.</li>
            </ul>
          </div>
          <div className="gi-info-cell">
            <p className="gi-info-cell-title">Red flags</p>
            <ul className="gi-info-list">
              <li>Bile vomit, blood, rigid abdomen, pale stool with dark urine</li>
            </ul>
          </div>
        </div>

        <h2 className="gi-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Gastrointestinal System & Assessment" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'Waugh A & Grant A (2018)', title: 'Ross and Wilson Anatomy and Physiology in Health and Illness (13th edn)', href: 'https://www.elsevier.com/' },
          { citation: 'NICE (2009, updated 2024)', title: 'Diarrhoea and vomiting caused by gastroenteritis in under 5s (CG84)', href: 'https://www.nice.org.uk/guidance/cg84' },
          { citation: 'NICE (2010, updated 2017)', title: 'Constipation in children and young people (CG99)', href: 'https://www.nice.org.uk/guidance/cg99' },
          { citation: 'RCPCH', title: 'Paediatric Care Online and clinical resources', href: 'https://www.rcpch.ac.uk/' },
        ]} />
      </div>
    </div>
  );
}
