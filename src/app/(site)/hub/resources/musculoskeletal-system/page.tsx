'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.ms-guide *, .ms-guide *::before, .ms-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.ms-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.ms-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

.ms-back {
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
.ms-back:hover { color: var(--ink-soft); }
.ms-back-arrow { font-style: normal; }

.ms-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.ms-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.ms-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.ms-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

.ms-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.ms-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.ms-golden-cell:last-child { border-right: none; }

.ms-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.ms-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.ms-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

.ms-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.ms-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.ms-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.ms-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.ms-step-content {
  padding-left: 32px;
}

.ms-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.ms-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

.ms-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.ms-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.ms-content-col:last-child { border-right: none; }

.ms-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.ms-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ms-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.ms-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

.ms-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.ms-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.ms-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

.ms-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.ms-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.ms-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.ms-section-title {
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

.ms-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.ms-table th {
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
.ms-table th:last-child { border-right: none; }

.ms-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.ms-table td:last-child { border-right: none; }
.ms-table tr:last-child td { border-bottom: none; }
.ms-table td:first-child { font-weight: 400; color: var(--ink-mid); }

.ms-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.ms-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.ms-grid-2-cell:nth-child(2n) { border-right: none; }

.ms-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.ms-diagram {
  border: 0.5px solid var(--hairline-firm);
  padding: 24px 16px 14px;
  margin-bottom: 32px;
  background: var(--surface-page);
}
.ms-diagram svg { display: block; width: 100%; max-width: 360px; height: auto; margin: 0 auto; }
.ms-diagram-caption {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-align: center;
  margin-top: 12px;
}
.ms-diagram-key {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 14px;
}
.ms-diagram-key span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
}
.ms-diagram-key i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.ms-letter-1 { color: var(--blue-600); }
.ms-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.ms-letter-2 { color: var(--teal-600); }
.ms-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.ms-letter-3 { color: var(--coral-600); }
.ms-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.ms-letter-4 { color: var(--purple-600); }
.ms-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.ms-letter-5 { color: var(--gray-600); }
.ms-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.ms-letter-6 { color: #8B5E3C; }
.ms-badge-6 { background: var(--surface-sunken); color: #6B4729; }

@media (max-width: 860px) {
  .ms-wrap { padding: 24px 20px 48px; }
  .ms-headline { font-size: 34px; }
  .ms-golden { grid-template-columns: repeat(2, 1fr); }
  .ms-golden-cell:nth-child(2) { border-right: none; }
  .ms-golden-cell:nth-child(1), .ms-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .ms-step { grid-template-columns: 64px 1fr; }
  .ms-step-letter { font-size: 48px; }
  .ms-content-grid { grid-template-columns: repeat(2, 1fr); }
  .ms-content-col:nth-child(2) { border-right: none; }
  .ms-content-col:nth-child(1), .ms-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .ms-grid-2 { grid-template-columns: 1fr; }
  .ms-grid-2-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .ms-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .ms-golden { grid-template-columns: 1fr; }
  .ms-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .ms-golden-cell:last-child { border-bottom: none; }
  .ms-content-grid { grid-template-columns: 1fr; }
  .ms-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .ms-content-col:last-child { border-bottom: none; }
  .ms-step { grid-template-columns: 52px 1fr; }
  .ms-step-letter { font-size: 38px; }
  .ms-step-content { padding-left: 18px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Bone Structure',
    question: 'What is bone actually made of, and how is it different across a lifespan?',
    cols: [
      {
        header: 'Bone types',
        items: [
          'Long bones: femur, humerus – growth and leverage',
          'Short bones: carpals, tarsals – stability',
          'Flat bones: skull, ribs, sternum – protection',
          'Irregular bones: vertebrae – complex support',
        ],
      },
      {
        header: 'Bone tissue',
        items: [
          'Compact (cortical) bone: dense outer layer',
          'Cancellous (spongy) bone: honeycomb, absorbs shock',
          'Periosteum: outer membrane, blood supply, healing',
          'Bone marrow: red (blood cell production), yellow (fat)',
        ],
      },
      {
        header: 'Growing bone (child)',
        items: [
          'Growth plate (physis): cartilage near bone ends',
          'Bone lengthens here until it fuses in late teens',
          'Growth plates are weaker than mature bone',
          'A fall that sprains an adult can fracture a child',
        ],
      },
      {
        header: 'Ageing bone (adult)',
        items: [
          'Peak bone mass reached around the late 20s',
          'Bone remodelling continues throughout life',
          'Density gradually falls after midlife, faster post-menopause',
          'Falling density raises fracture risk over time',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'A child’s bone is not just a smaller adult bone. The growth plate is the weakest part of a child’s skeleton, so injuries near a joint that would sprain an adult can fracture a child through the growth plate instead.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Joints & Movement',
    question: 'How are joints classified, and what actually lets them move?',
    cols: [
      {
        header: 'Fibrous & cartilaginous',
        items: [
          'Fibrous: little or no movement, e.g. skull sutures',
          'Cartilaginous: slight movement, e.g. intervertebral discs',
          'Symphysis pubis is a cartilaginous joint',
          'These prioritise stability over range of motion',
        ],
      },
      {
        header: 'Synovial joint anatomy',
        items: [
          'Freely movable – the most common joint type',
          'Joint capsule encloses the synovial cavity',
          'Synovial fluid lubricates and nourishes cartilage',
          'Articular cartilage cushions the bone ends',
        ],
      },
      {
        header: 'Types of movement',
        items: [
          'Flexion/extension: bending and straightening',
          'Abduction/adduction: away from/towards midline',
          'Rotation: turning around an axis',
          'Circumduction: circular combined movement',
        ],
      },
      {
        header: 'Joints across the lifespan',
        items: [
          'Children: cartilage is thicker, more flexible',
          'Adults: cartilage thins gradually with use and age',
          'Cartilage has a poor blood supply, so it heals slowly',
          'Repeated joint stress accelerates wear over decades',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
  {
    number: '3',
    colour: '3',
    name: 'Muscles & Tone',
    question: 'How do muscles generate movement, and how does tone differ by age and condition?',
    cols: [
      {
        header: 'Muscle types',
        items: [
          'Skeletal: voluntary, attached to bone by tendons',
          'Smooth: involuntary, in organ and vessel walls',
          'Cardiac: involuntary, only in the heart',
          'Skeletal muscle is the focus for mobility care',
        ],
      },
      {
        header: 'How contraction works',
        items: [
          'Nerve impulse triggers calcium release in the fibre',
          'Actin and myosin filaments slide together',
          'The muscle shortens and pulls on the tendon/bone',
          'ATP is needed for both contraction and relaxation',
        ],
      },
      {
        header: 'Tone & posture',
        items: [
          'Muscle tone: baseline tension even at rest',
          'Supports posture and joint stability',
          'Hypotonia: reduced tone, floppy',
          'Hypertonia: increased tone, stiff or spastic',
        ],
      },
      {
        header: 'Muscle across the lifespan',
        items: [
          'Children: muscle mass builds through growth and activity',
          'Adults: sarcopenia – gradual muscle loss with ageing',
          'Inactivity and illness accelerate muscle loss at any age',
          'Muscle loss increases falls and fracture risk',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Sarcopenia is not just “getting older and weaker.” It is a measurable loss of muscle mass and strength that raises the risk of falls, fractures, and loss of independence – and it accelerates fast during illness, immobility, or a hospital stay.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Paediatric MSK Conditions',
    question: 'Which hip, bone, and growth-plate conditions come up again and again in children’s nursing?',
    cols: [
      {
        header: 'Hip conditions',
        items: [
          'DDH: hip joint develops abnormally, often newborn screen',
          'Perthes disease: loss of blood supply to femoral head, ages 4–8',
          'SUFE: growth plate slips, typically adolescent, often overweight',
          'All three can present as a limp or unequal leg length',
        ],
      },
      {
        header: 'Fracture patterns',
        items: [
          'Greenstick: bone bends and partly breaks, not fully through',
          'Buckle (torus): bone compresses and bulges, does not break through',
          'Growth plate (Salter-Harris) fractures: through or near the physis',
          'Children’s bones are more flexible, so patterns differ from adults',
        ],
      },
      {
        header: 'Why growth plates matter',
        items: [
          'A growth-plate fracture can affect future bone growth',
          'Even a straightforward-looking injury needs careful follow-up',
          'Angular deformity can develop months to years later',
          'Orthopaedic review is important, not just “pain relief”',
        ],
      },
      {
        header: 'Safeguarding awareness',
        items: [
          'A fracture in a non-mobile infant needs careful thought',
          'Delayed presentation without a clear explanation is a flag',
          'Injury pattern not matching the story given is a flag',
          'Multiple fractures at different healing stages is a flag',
        ],
      },
    ],
    redFlags: [
      'Fracture in a non-mobile infant',
      'Injury inconsistent with the explanation given',
      'Delayed presentation for a significant injury',
      'Bruising or fractures in unusual patterns or sites',
    ],
    pearl:
      'A limp in a child is never “just growing pains” until something more serious has been ruled out. DDH, Perthes, SUFE, septic arthritis, and safeguarding concerns can all present as a limp, so a full history and examination matter every time.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Adult MSK Conditions',
    question: 'What are the degenerative and inflammatory conditions that come up most in adult care?',
    cols: [
      {
        header: 'Osteoarthritis',
        items: [
          'Wear-and-tear joint disease, cartilage breaks down',
          'Common in weight-bearing joints: hips, knees, spine',
          'Pain worse with activity, better with rest',
          'Morning stiffness usually settles within 30 minutes',
        ],
      },
      {
        header: 'Rheumatoid arthritis',
        items: [
          'Autoimmune, symmetrical small-joint inflammation',
          'Morning stiffness often lasts over an hour',
          'Can cause systemic symptoms: fatigue, malaise',
          'Needs early specialist referral to limit joint damage',
        ],
      },
      {
        header: 'Osteoporosis',
        items: [
          'Reduced bone density, bone becomes more fragile',
          'Often silent until a fragility fracture occurs',
          'Risk rises after menopause and with steroid use',
          'Wrist, hip, and vertebral fractures are classic sites',
        ],
      },
      {
        header: 'Fractures in older adults',
        items: [
          'A fall that would bruise a younger adult can fracture',
          'Hip fracture carries significant morbidity and mortality risk',
          'Falls assessment matters as much as the fracture itself',
          'Post-fracture rehab and bone health review both matter',
        ],
      },
    ],
    redFlags: [
      'Hot, swollen, acutely painful single joint (possible septic arthritis)',
      'Fever with joint pain',
      'Sudden severe back pain with leg weakness or saddle numbness',
      'Loss of bladder or bowel control with back pain',
    ],
    pearl:
      'A hot, swollen, acutely painful joint is a medical emergency until septic arthritis has been ruled out, because untreated joint infection can destroy the joint within days. It is not automatically “just a flare of arthritis.”',
  },
  {
    number: '6',
    colour: '6',
    name: 'Assessment, Mobility & Safety',
    question: 'What should you actually check at the bedside, and how do you keep movement safe?',
    cols: [
      {
        header: 'Paediatric screen (pGALS)',
        items: [
          'Gait: watch the child walk, look for limp or asymmetry',
          'Arms: check joints, grip, and movement',
          'Legs: check hips, knees, and ankles',
          'Spine: check posture and spinal movement',
        ],
      },
      {
        header: 'Adult MSK & falls check',
        items: [
          'Pain, swelling, deformity, and range of movement',
          'Neurovascular check distal to any injury',
          'Falls history and balance/mobility assessment',
          'Medication review – some drugs raise falls risk',
        ],
      },
      {
        header: 'Moving & handling',
        items: [
          'Assess before you move – never assume capability',
          'Use equipment (hoists, slide sheets) rather than lifting manually',
          'Explain each step to the patient before you move them',
          'Your own posture and technique protect you too',
        ],
      },
      {
        header: 'Immobility risks',
        items: [
          'Pressure injury risk rises quickly with reduced movement',
          'Muscle wasting can begin within days of bed rest',
          'VTE risk rises with immobility – prophylaxis matters',
          'Encourage safe, early mobilisation wherever appropriate',
        ],
      },
    ],
    redFlags: [
      'Pale, cold, pulseless limb distal to an injury or cast',
      'Severe pain out of proportion to the injury',
      'New numbness, tingling, or weakness distal to an injury',
      'Compartment syndrome features after a fracture or cast',
    ],
    pearl:
      'The 5 Ps of a neurovascular check – pain, pallor, pulselessness, paraesthesia, paralysis – are a quick way to remember what to check distal to a fracture or cast. Severe pain out of proportion to the injury, especially with pain on passive stretch, should make you think of compartment syndrome and escalate immediately.',
  },
];

const boneTypeRows = [
  { type: 'Long bones', examples: 'Femur, humerus, tibia, radius', role: 'Provide leverage for movement and bear weight. Contain the growth plate in children.' },
  { type: 'Short bones', examples: 'Carpals, tarsals', role: 'Provide stability with some limited movement, mostly in the wrist and ankle.' },
  { type: 'Flat bones', examples: 'Skull, ribs, sternum, scapula', role: 'Protect underlying organs and provide broad surfaces for muscle attachment.' },
  { type: 'Irregular bones', examples: 'Vertebrae, facial bones', role: 'Complex shapes suited to their specific protective or structural job.' },
  { type: 'Sesamoid bones', examples: 'Patella', role: 'Sit within a tendon and reduce friction over a joint.' },
];

const jointTypeRows = [
  { joint: 'Ball and socket', examples: 'Hip, shoulder', movement: 'Widest range of movement: flexion, extension, abduction, adduction, rotation, circumduction.' },
  { joint: 'Hinge', examples: 'Elbow, knee', movement: 'Flexion and extension in one plane only.' },
  { joint: 'Pivot', examples: 'Atlas/axis (neck)', movement: 'Rotation around a single axis.' },
  { joint: 'Saddle', examples: 'Base of thumb', movement: 'Flexion, extension, abduction, adduction – but not full rotation.' },
  { joint: 'Gliding (plane)', examples: 'Carpals, tarsals', movement: 'Small gliding movements between flat bone surfaces.' },
];

const hipConditionRows = [
  { condition: 'Developmental dysplasia of the hip (DDH)', age: 'Newborn – screened at birth and 6–8 week check', features: 'Asymmetrical skin creases, unequal leg length, clunk on Ortolani/Barlow testing, limited hip abduction.', management: 'Pavlik harness for younger infants; bracing or surgery if diagnosed later or harness is unsuccessful.' },
  { condition: 'Perthes disease', age: 'Usually 4–8 years, more common in boys', features: 'Gradual-onset limp, hip or referred knee pain, reduced hip movement, no clear injury.', management: 'Ranges from monitoring to bracing or surgery depending on severity; aims to protect the femoral head while it revascularises.' },
  { condition: 'Slipped upper femoral epiphysis (SUFE)', age: 'Typically adolescent, often peri-pubertal and overweight', features: 'Limp with hip, groin, thigh, or knee pain; leg often held externally rotated.', management: 'Urgent orthopaedic referral – surgical fixation to stabilise the growth plate and prevent further slip.' },
];

const fractureTypeRows = [
  { type: 'Greenstick fracture', description: 'The bone bends and partially breaks on one side, like a green twig, without breaking all the way through.', note: 'Reflects the flexibility of a child’s bone compared with an adult’s.' },
  { type: 'Buckle (torus) fracture', description: 'The bone compresses and bulges outward without a clear break line.', note: 'Usually stable and often needs simple splinting rather than a full cast.' },
  { type: 'Growth plate (Salter-Harris) fracture', description: 'The fracture line runs through or near the growth plate (physis).', note: 'Needs careful assessment and follow-up because it can affect future bone growth.' },
  { type: 'Complete fracture', description: 'The bone breaks all the way through into two or more pieces.', note: 'Seen in children and adults; management depends on displacement and stability.' },
];

const oaRaRows = [
  { feature: 'Underlying cause', oa: 'Mechanical wear and cartilage breakdown over time', ra: 'Autoimmune inflammation of the synovium' },
  { feature: 'Typical pattern', oa: 'Weight-bearing joints, often asymmetrical', ra: 'Small joints of hands and feet, usually symmetrical' },
  { feature: 'Morning stiffness', oa: 'Usually under 30 minutes', ra: 'Often over an hour' },
  { feature: 'Pain pattern', oa: 'Worse with activity, better with rest', ra: 'Can be present at rest, worse after inactivity' },
  { feature: 'Systemic features', oa: 'Uncommon', ra: 'Fatigue, malaise, low-grade fever can occur' },
];

const osteoporosisRows = [
  { factor: 'Age and menopause', why: 'Bone density falls with age and drops more quickly after menopause as oestrogen falls.' },
  { factor: 'Long-term steroid use', why: 'Corticosteroids reduce bone formation and increase bone breakdown over time.' },
  { factor: 'Low body weight and inactivity', why: 'Less mechanical loading on bone is linked to lower bone density.' },
  { factor: 'Smoking and excess alcohol', why: 'Both are associated with lower bone density and higher fracture risk.' },
  { factor: 'Family history and previous fragility fracture', why: 'A prior fragility fracture is one of the strongest predictors of another.' },
];

const pgalsRows = [
  { step: 'Gait', what: 'Watch the child walk normally, then on heels and toes if able.', lookFor: 'Limp, asymmetry, toe-walking, or reluctance to bear weight.' },
  { step: 'Arms', what: 'Check shoulders, elbows, wrists, and hands for movement and grip.', lookFor: 'Reduced range of movement, swelling, or pain on movement.' },
  { step: 'Legs', what: 'Check hip, knee, and ankle movement, and look for swelling or deformity.', lookFor: 'Reduced hip abduction, knee swelling, or leg-length asymmetry.' },
  { step: 'Spine', what: 'Check posture from behind and ask the child to bend forward.', lookFor: 'Scoliosis, abnormal curvature, or reduced spinal movement.' },
];

const movingHandlingRows = [
  { principle: 'Assess before you move', detail: 'Check the patient’s ability, any lines/drains/casts, pain, and cognition before deciding how to move them.' },
  { principle: 'Use equipment, not muscle', detail: 'Hoists, slide sheets, and transfer boards protect both the patient and you – manual lifting is a last resort, not a first option.' },
  { principle: 'Communicate every step', detail: 'Tell the patient what is about to happen and what you need them to do, even if they cannot respond verbally.' },
  { principle: 'Reassess afterwards', detail: 'Check pain, skin, and the position is safe and comfortable once the move is complete.' },
];

const quizQuestions = [
  {
    question: 'Why can a fall that would only sprain an adult sometimes fracture a child?',
    options: [
      'Children have thicker bones than adults',
      'The growth plate is a weaker point in a child’s skeleton',
      'Children have no cartilage in their joints',
      'Children’s bones contain no periosteum',
    ],
    answer: 1,
    explanation: 'The growth plate (physis) is cartilage and is weaker than the surrounding mature bone, so injuries can fracture through it in a child where an adult would only sprain a ligament.',
  },
  {
    question: 'A 6-year-old presents with a gradual limp, hip pain, and no history of injury. Which condition should you consider?',
    options: ['Slipped upper femoral epiphysis', 'Perthes disease', 'Osteoarthritis', 'Rheumatoid arthritis'],
    answer: 1,
    explanation: 'Perthes disease typically presents in children aged around 4–8 with a gradual-onset limp and hip or knee pain, without a clear injury.',
  },
  {
    question: 'Which adolescent presentation should make you think of SUFE?',
    options: [
      'A toddler with asymmetrical hip skin creases',
      'An overweight adolescent with a limp and hip, groin, or knee pain, leg externally rotated',
      'An older adult with morning stiffness lasting 20 minutes',
      'A newborn with a positive Ortolani test',
    ],
    answer: 1,
    explanation: 'SUFE typically presents in overweight, peri-pubertal adolescents with a limp and hip, groin, thigh, or knee pain, often with the leg held externally rotated.',
  },
  {
    question: 'What distinguishes rheumatoid arthritis from osteoarthritis?',
    options: [
      'RA is a mechanical wear-and-tear condition',
      'RA typically causes symmetrical small-joint inflammation with prolonged morning stiffness',
      'OA usually causes systemic symptoms like fatigue and fever',
      'OA is an autoimmune condition',
    ],
    answer: 1,
    explanation: 'RA is autoimmune and typically causes symmetrical small-joint inflammation with morning stiffness often lasting over an hour, unlike the mechanical, activity-related pain of OA.',
  },
  {
    question: 'A patient has severe pain out of proportion to their injury after a limb was put in a cast, worse on passive stretch. What should you think of?',
    options: ['Normal post-fracture pain', 'Compartment syndrome', 'Osteoarthritis flare', 'Muscle tone changes'],
    answer: 1,
    explanation: 'Severe pain out of proportion to the injury, especially worse on passive stretch, is a key warning sign of compartment syndrome and needs urgent escalation.',
  },
  {
    question: 'Why is osteoporosis often described as a "silent" condition?',
    options: [
      'It causes no changes in bone at all',
      'It often has no symptoms until a fragility fracture occurs',
      'It only affects young adults',
      'It always causes joint swelling',
    ],
    answer: 1,
    explanation: 'Osteoporosis reduces bone density gradually with no obvious symptoms, so it is frequently only discovered after a fragility fracture such as a wrist, hip, or vertebral fracture.',
  },
  {
    question: 'What does the "gait" part of a pGALS screen assess?',
    options: [
      'Grip strength only',
      'How the child walks, looking for limp or asymmetry',
      'Spinal curvature only',
      'Range of shoulder movement',
    ],
    answer: 1,
    explanation: 'The gait component of pGALS involves watching the child walk to look for a limp, asymmetry, toe-walking, or reluctance to bear weight.',
  },
  {
    question: 'Why should manual lifting be a last resort in moving and handling?',
    options: [
      'It is always faster than using equipment',
      'Equipment such as hoists and slide sheets protects both patient and staff better than manual lifting',
      'Manual lifting is required by law for all transfers',
      'Patients prefer to be lifted manually',
    ],
    answer: 1,
    explanation: 'Moving and handling equipment reduces injury risk for both the patient and the member of staff, so it should be used in preference to manual lifting wherever possible.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MusculoskeletalSystemPage() {
  return (
    <div className="ms-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ms-wrap">
        <Link href="/hub" className="ms-back">
          <span className="ms-back-arrow">&larr;</span>
          Nursing Hub
        </Link>

        <p className="ms-kicker">Anatomy &amp; Physiology &middot; Children&apos;s &amp; Adult Nursing</p>
        <h1 className="ms-headline">Musculoskeletal System &amp; Assessment</h1>
        <p className="ms-standfirst">
          Bones, joints, and muscles from growth plate to old age &mdash; the paediatric conditions, adult degenerative disease, and bedside checks that come up in both branches.
        </p>
        <p className="ms-byline">Children&apos;s &amp; adult nursing &middot; The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="musculoskeletal-system"
          hubItemTitle="Musculoskeletal System & Assessment"
        />

        <div className="ms-pearl" style={{ marginBottom: '40px' }}>
          <p className="ms-pearl-label">Student note</p>
          <p>The growth plate (physis) is the site of bone growth in children and closes in the late teens. Sarcopenia means age-related muscle loss. A fragility fracture is a fracture caused by a fall from standing height or less &mdash; the kind of fall that would not normally break a healthy bone. Compartment syndrome is dangerous pressure build-up inside a muscle compartment, usually after a fracture or tight cast.</p>
        </div>

        <div className="ms-golden">
          {[
            { n: '01', title: 'Growth plate rule', text: 'The physis is the weakest point in a child’s skeleton until it fuses. Injuries near a joint can fracture through it.' },
            { n: '02', title: 'Limp rule', text: 'A limp in a child is never assumed to be growing pains until DDH, Perthes, SUFE, infection, and safeguarding have been considered.' },
            { n: '03', title: 'Hot joint rule', text: 'A hot, swollen, acutely painful single joint is septic arthritis until ruled out – it is an emergency, not a routine flare.' },
            { n: '04', title: '5 Ps rule', text: 'Pain, pallor, pulselessness, paraesthesia, paralysis – check these distal to any fracture or cast, every time.' },
          ].map((cell) => (
            <div key={cell.n} className="ms-golden-cell">
              <span className="ms-golden-numeral">{cell.n}</span>
              <p className="ms-golden-title">{cell.title}</p>
              <p className="ms-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="ms-step">
            <div className="ms-step-sidebar">
              <span className={`ms-step-letter ms-letter-${section.colour}`}>{section.number}</span>
              <span className={`ms-step-badge ms-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="ms-step-content">
              <h2 className="ms-step-name">{section.name}</h2>
              <p className="ms-step-question">{section.question}</p>

              <div className="ms-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="ms-content-col">
                    <p className="ms-col-header">{col.header}</p>
                    <ul className="ms-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="ms-redflags-label">Red flags</p>
                  <div className="ms-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="ms-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="ms-pearl">
                  <p className="ms-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        <h2 className="ms-section-title">Bone Type Reference</h2>
        <table className="ms-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Bone type</th>
              <th>Examples</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {boneTypeRows.map((row) => (
              <tr key={row.type}>
                <td>{row.type}</td>
                <td>{row.examples}</td>
                <td>{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="ms-section-title">Synovial Joint Types</h2>
        <table className="ms-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Joint type</th>
              <th>Examples</th>
              <th>Movement allowed</th>
            </tr>
          </thead>
          <tbody>
            {jointTypeRows.map((row) => (
              <tr key={row.joint}>
                <td>{row.joint}</td>
                <td>{row.examples}</td>
                <td>{row.movement}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ms-diagram">
          <svg viewBox="0 0 400 260" role="img" aria-label="Cross-section diagram of a synovial joint showing bone, articular cartilage, joint capsule, and synovial fluid">
            <rect x={70} y={90} width={260} height={80} rx={30} style={{ fill: 'var(--surface-sunken)', stroke: 'var(--hairline-firm)', strokeWidth: 1, strokeDasharray: '4 3' }} />
            <rect x={90} y={96} width={220} height={14} style={{ fill: 'var(--peach-warm)' }} />
            <rect x={90} y={150} width={220} height={14} style={{ fill: 'var(--peach-warm)' }} />
            <rect x={90} y={110} width={220} height={40} rx={8} style={{ fill: 'var(--blue-50)' }} />
            <text x={200} y={134} textAnchor="middle" style={{ fill: 'var(--blue-800)', fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: '0.04em' }}>SYNOVIAL FLUID</text>
            <rect x={60} y={10} width={280} height={86} rx={14} style={{ fill: 'var(--surface-raised)', stroke: 'var(--hairline-firm)', strokeWidth: 1 }} />
            <rect x={60} y={164} width={280} height={86} rx={14} style={{ fill: 'var(--surface-raised)', stroke: 'var(--hairline-firm)', strokeWidth: 1 }} />
            <text x={200} y={58} textAnchor="middle" style={{ fill: 'var(--ink-mid)', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em' }}>BONE</text>
            <text x={200} y={212} textAnchor="middle" style={{ fill: 'var(--ink-mid)', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em' }}>BONE</text>
          </svg>
          <div className="ms-diagram-key">
            <span><i style={{ background: 'var(--ink-faint)' }} />Bone</span>
            <span><i style={{ background: 'var(--peach-warm)' }} />Articular cartilage</span>
            <span><i style={{ background: 'var(--hairline-firm)' }} />Joint capsule</span>
            <span><i style={{ background: 'var(--blue-600)' }} />Synovial fluid</span>
          </div>
          <p className="ms-diagram-caption">A synovial joint: cartilage cushions the bone ends, the capsule seals the joint space, and synovial fluid lubricates movement</p>
        </div>

        <h2 className="ms-section-title">Paediatric Hip Conditions</h2>
        <table className="ms-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Condition</th>
              <th>Typical age</th>
              <th>Key features</th>
              <th>Management</th>
            </tr>
          </thead>
          <tbody>
            {hipConditionRows.map((row) => (
              <tr key={row.condition}>
                <td>{row.condition}</td>
                <td>{row.age}</td>
                <td>{row.features}</td>
                <td>{row.management}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ms-pearl" style={{ marginBottom: '32px' }}>
          <p className="ms-pearl-label">Clinical pearl</p>
          <p>DDH, Perthes, and SUFE can all present as a limp with no clear injury &mdash; the difference is usually age. DDH is picked up in infancy through screening, Perthes typically presents around 4&ndash;8 years, and SUFE typically presents in overweight adolescents around puberty.</p>
        </div>

        <h2 className="ms-section-title">Fracture Patterns in Children</h2>
        <table className="ms-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Fracture type</th>
              <th>What it looks like</th>
              <th>Clinical note</th>
            </tr>
          </thead>
          <tbody>
            {fractureTypeRows.map((row) => (
              <tr key={row.type}>
                <td>{row.type}</td>
                <td>{row.description}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="ms-section-title">Osteoarthritis vs Rheumatoid Arthritis</h2>
        <table className="ms-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Osteoarthritis</th>
              <th>Rheumatoid arthritis</th>
            </tr>
          </thead>
          <tbody>
            {oaRaRows.map((row) => (
              <tr key={row.feature}>
                <td>{row.feature}</td>
                <td>{row.oa}</td>
                <td>{row.ra}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="ms-section-title">Osteoporosis Risk Factors</h2>
        <table className="ms-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Risk factor</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {osteoporosisRows.map((row) => (
              <tr key={row.factor}>
                <td>{row.factor}</td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="ms-section-title">pGALS Screen (Paediatric)</h2>
        <table className="ms-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Step</th>
              <th>What you do</th>
              <th>What you are looking for</th>
            </tr>
          </thead>
          <tbody>
            {pgalsRows.map((row) => (
              <tr key={row.step}>
                <td>{row.step}</td>
                <td>{row.what}</td>
                <td>{row.lookFor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ms-pearl" style={{ marginBottom: '32px' }}>
          <p className="ms-pearl-label">Exam tip</p>
          <p>pGALS stands for paediatric Gait, Arms, Legs, Spine &mdash; a quick screening examination used to pick up joint or musculoskeletal problems in children. It is not a substitute for a full assessment if something looks abnormal, but it is a useful structure to describe in an OSCE.</p>
        </div>

        <h2 className="ms-section-title">Moving &amp; Handling Principles</h2>
        <div className="ms-grid-2" style={{ marginBottom: '32px' }}>
          {movingHandlingRows.map((row) => (
            <div key={row.principle} className="ms-grid-2-cell">
              <p className="ms-grid-2-header">{row.principle}</p>
              <ul className="ms-col-list">
                <li>{row.detail}</li>
              </ul>
            </div>
          ))}
        </div>

        <div className="ms-pearl" style={{ marginBottom: '32px' }}>
          <p className="ms-pearl-label">Clinical pearl</p>
          <p>Immobility affects the whole body, not just muscles and joints. Pressure injury risk, muscle wasting, and venous thromboembolism risk can all rise within days of reduced movement, which is why safe, early mobilisation is a nursing priority in both paediatric and adult care wherever it is appropriate.</p>
        </div>

        <h2 className="ms-section-title">Quick Mnemonic Recap</h2>
        <div className="ms-golden" style={{ marginBottom: '40px' }}>
          {[
            { n: '01', title: 'DDH, Perthes, SUFE', text: 'Infant screening → ages 4–8 → overweight adolescent – age is the key differentiator' },
            { n: '02', title: 'Fracture patterns', text: 'Greenstick and buckle reflect flexible young bone; watch growth-plate fractures closely' },
            { n: '03', title: 'OA vs RA', text: 'OA: activity-related, under 30 min stiffness. RA: symmetrical, over 1hr stiffness' },
            { n: '04', title: '5 Ps', text: 'Pain, pallor, pulselessness, paraesthesia, paralysis – check distal to any injury' },
          ].map((cell) => (
            <div key={cell.n} className="ms-golden-cell">
              <span className="ms-golden-numeral">{cell.n}</span>
              <p className="ms-golden-title">{cell.title}</p>
              <p className="ms-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        <h2 className="ms-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Musculoskeletal System & Assessment" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'Waugh A & Grant A (2018)', title: 'Ross and Wilson Anatomy and Physiology in Health and Illness (13th edn)', href: 'https://www.elsevier.com/' },
          { citation: 'NICE (2022)', title: 'Osteoarthritis in over 16s: diagnosis and management (NG226)', href: 'https://www.nice.org.uk/guidance/ng226' },
          { citation: 'NICE (2018)', title: 'Rheumatoid arthritis in adults: management (NG100)', href: 'https://www.nice.org.uk/guidance/ng100' },
          { citation: 'NICE (2021)', title: 'Osteoporosis – prevention of fragility fractures (Clinical Knowledge Summary)', href: 'https://cks.nice.org.uk/topics/osteoporosis-prevention-of-fragility-fractures/' },
          { citation: 'Royal College of Nursing', title: 'Moving and handling guidance', href: 'https://www.rcn.org.uk/' },
        ]} />
      </div>
    </div>
  );
}
