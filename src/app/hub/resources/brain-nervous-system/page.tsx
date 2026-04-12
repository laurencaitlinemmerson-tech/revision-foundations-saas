'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import PremiumHubPageGate from '@/components/PremiumHubPageGate';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.ns-guide *, .ns-guide *::before, .ns-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.ns-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.ns-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
}

/* Back nav */
.ns-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #999;
  text-decoration: none;
  margin-bottom: 44px;
}
.ns-back:hover { color: #555; }
.ns-back-arrow { font-style: normal; }

/* Masthead */
.ns-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.ns-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.ns-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.ns-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
}

/* Golden rules grid */
.ns-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.ns-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.ns-golden-cell:last-child { border-right: none; }

.ns-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.ns-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.ns-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.ns-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 52px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 36px;
}

.ns-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.ns-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.ns-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.ns-step-content {
  padding-left: 32px;
}

.ns-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.ns-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.ns-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ns-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ns-content-col:last-child { border-right: none; }

.ns-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.ns-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ns-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.ns-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Red flags */
.ns-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.ns-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.ns-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.ns-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.ns-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.ns-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.ns-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 18px;
  padding-top: 36px;
  margin-top: 52px;
  padding-bottom: 16px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

/* Table */
.ns-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 0;
  font-size: 13px;
}

.ns-table th {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  font-weight: 400;
  padding: 11px 16px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  border-right: 0.5px solid rgba(0,0,0,0.1);
  text-align: left;
  background: #F5F3F0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.ns-table th:last-child { border-right: none; }

.ns-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.ns-table td:last-child { border-right: none; }
.ns-table tr:last-child td { border-bottom: none; }
.ns-table td:first-child { font-weight: 400; color: #2C2A27; }

/* 4-col info grid */
.ns-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ns-info-cell {
  padding: 18px 16px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ns-info-cell:last-child { border-right: none; }

.ns-info-cell-title {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #333;
  margin-bottom: 12px;
  font-weight: 400;
  padding-bottom: 8px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

.ns-info-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.ns-info-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0 2px 10px;
  font-weight: 300;
  position: relative;
}
.ns-info-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Step colour system */
.ns-letter-1 { color: #185FA5; }
.ns-badge-1 { background: #E6F1FB; color: #0C447C; }
.ns-letter-2 { color: #0F6E56; }
.ns-badge-2 { background: #E1F5EE; color: #085041; }
.ns-letter-3 { color: #993C1D; }
.ns-badge-3 { background: #FAECE7; color: #712B13; }
.ns-letter-4 { color: #534AB7; }
.ns-badge-4 { background: #EEEDFE; color: #3C3489; }
.ns-letter-5 { color: #5F5E5A; }
.ns-badge-5 { background: #F1EFE8; color: #444441; }
.ns-letter-6 { color: #8B5E3C; }
.ns-badge-6 { background: #F5EDE5; color: #6B4529; }

/* Responsive */
@media (max-width: 860px) {
  .ns-wrap { padding: 28px 20px 60px; }
  .ns-headline { font-size: 36px; }
  .ns-golden { grid-template-columns: 1fr 1fr; }
  .ns-golden-cell { border-bottom: 0.5px solid rgba(0,0,0,0.12); }
  .ns-step { grid-template-columns: 1fr; }
  .ns-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); padding-bottom: 16px; margin-bottom: 16px; padding-right: 0; }
  .ns-step-content { padding-left: 0; }
  .ns-content-grid { grid-template-columns: 1fr 1fr; }
  .ns-content-col { border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .ns-info-grid { grid-template-columns: 1fr 1fr; }
  .ns-info-cell { border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .ns-table { font-size: 11px; }
}

@media (max-width: 520px) {
  .ns-golden { grid-template-columns: 1fr; }
  .ns-content-grid { grid-template-columns: 1fr; }
  .ns-info-grid { grid-template-columns: 1fr; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Nervous System Overview',
    question: 'What does the nervous system do, and how is it organised?',
    cols: [
      {
        header: 'Core job',
        items: [
          'Detect information from inside and outside the body',
          'Process that information',
          'Help the body respond in a coordinated way',
          'Detect \u2013 Process \u2013 Respond is the nervous system in one line',
        ],
      },
      {
        header: 'CNS vs PNS',
        items: [
          'CNS = brain + spinal cord (the control centre)',
          'PNS = all the nerves outside the brain and spinal cord',
          'Sensory pathways carry information towards the CNS',
          'Motor pathways carry instructions away from the CNS',
        ],
      },
      {
        header: 'Somatic vs autonomic',
        items: [
          'Somatic system controls voluntary movement',
          'This is what you assess when you ask a child to squeeze, push, or wiggle',
          'Autonomic system controls automatic body functions',
          'Influences heart rate, BP, breathing, pupils, and digestion',
        ],
      },
      {
        header: 'Why this matters in children',
        items: [
          'Neurological change may show as feeding change, irritability, or floppiness',
          'A child may not describe headache, numbness, or visual change clearly',
          'Behaviour and trend matter just as much as formal scoring tools',
          'A changed child is a neurological sign until proved otherwise',
        ],
      },
    ],
    redFlags: ['Reduced consciousness or difficult to rouse', 'Sudden behaviour change or not acting like themselves'],
    pearl:
      'If sensory information cannot get in, or motor instructions cannot get out, the child may look weak, unsteady, floppy, less responsive, or simply not like themselves. That is why a short neurological assessment can tell you a lot very quickly.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Neurons and How Messages Move',
    question: 'How does a nerve cell send a message from one place to another?',
    cols: [
      {
        header: 'Neuron basics',
        items: [
          'A neuron is a nerve cell built to send messages',
          'Signals travel along the cell and then pass to the next cell',
          'Myelin helps make that signal travel faster and more smoothly',
        ],
      },
      {
        header: 'Neuron parts',
        items: [
          'Dendrites: receive messages from other cells',
          'Cell body: processes and manages the cell',
          'Axon: carries the electrical signal away from the cell body',
          'Nerve endings: pass the message on at the synapse',
        ],
      },
      {
        header: 'Synapse in plain English',
        items: [
          'The message reaches the end of one neuron',
          'Chemicals help carry the message across the synapse',
          'The next cell then responds',
          'A synapse is the tiny gap where one nerve cell passes a message to the next',
        ],
      },
      {
        header: 'Spinal cord and reflexes',
        items: [
          'The spinal cord carries messages between the brain and the rest of the body',
          'If affected, movement, sensation, bladder function, and reflexes can all change',
          'Reflexes are quick automatic responses that help protect the body',
          'Reduced or altered reflexes can matter, especially if new or asymmetrical',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
  {
    number: '3',
    colour: '3',
    name: 'Brain Anatomy and Main Functions',
    question: 'Which parts of the brain do what, and why does the brainstem get special attention?',
    cols: [
      {
        header: 'Major brain parts',
        items: [
          'Cerebrum: thinking, awareness, memory, movement, speech, and sensory interpretation',
          'Cerebellum: balance, posture, coordination, and smooth controlled movement',
          'Brainstem: breathing, heart rate, BP, consciousness, swallowing, and pupil responses',
        ],
      },
      {
        header: 'Lobes of the brain',
        items: [
          'Frontal: planning, behaviour, personality, speech, and voluntary movement',
          'Parietal: touch, position, and other sensory information',
          'Temporal: hearing, language understanding, and memory',
          'Occipital: mainly linked with vision',
        ],
      },
      {
        header: 'Brainstem control',
        items: [
          'Breathing: helps control respiratory drive and pattern',
          'Heart rate and BP: linked to autonomic cardiovascular control',
          'Consciousness, swallow, and pupils: involved in wakefulness and protective reflexes',
          'If affected, the child\u2019s breathing, HR, BP, pupils, and conscious level can all change',
        ],
      },
      {
        header: 'Why the brainstem matters',
        items: [
          'The brainstem is where neuro and vital signs meet',
          'Neurological deterioration is never just a "head problem"',
          'Irregular breathing with neurological change is a major concern',
          'Reduced conscious level can quickly become an airway risk',
        ],
      },
    ],
    redFlags: ['Focal weakness or one-sided limb change', 'Unequal pupils or poor pupil reaction'],
    pearl:
      'The brainstem is where neuro and vital signs meet. If it is affected, the child\u2019s breathing, heart rate, blood pressure, pupils, swallow, and conscious level can all change. That is why neurological deterioration is never just a "head problem".',
  },
  {
    number: '4',
    colour: '4',
    name: 'Brain Protection and Intracranial Pressure',
    question: 'What protects the brain, and why does rising pressure inside the skull matter?',
    cols: [
      {
        header: 'Protective features',
        items: [
          'Skull: hard bony protection, but a fixed space so swelling is a problem',
          'Meninges: protective layers; inflammation here is meningitis',
          'CSF: fluid cushioning the brain and spinal cord',
          'Helps protect, support, and maintain a stable environment around the CNS',
        ],
      },
      {
        header: 'Raised ICP basics',
        items: [
          'The skull does not have much spare room',
          'If pressure rises, the brain can be compressed',
          'Vomiting, reduced consciousness, pupil change, headache, or a bulging fontanelle matter',
          'Children may first look irritable, sleepy, off feeds, or just not quite right',
        ],
      },
      {
        header: 'Early concerning clues',
        items: [
          'Headache, vomiting, irritability',
          'Sleepiness, behaviour change',
          'Bulging fontanelle',
          'These are enough to escalate concern; do not wait for a dramatic collapse',
        ],
      },
      {
        header: 'Later and more ominous clues',
        items: [
          'Marked pupil change',
          'Worsening reduced consciousness',
          'Abnormal posturing',
          'Cushing\u2019s triad: bradycardia, hypertension, irregular respirations (a late sign)',
        ],
      },
    ],
    redFlags: ['Bulging fontanelle', 'Signs of raised intracranial pressure', 'Persistent vomiting with neurological signs'],
    pearl:
      'Cushing\u2019s triad means bradycardia, hypertension, and irregular respirations. It is a late sign of raised intracranial pressure, not an early screening tool, so never wait for it before escalating concern.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Neurological Observations at the Bedside',
    question: 'What should you check, and why do neuro obs matter so much?',
    cols: [
      {
        header: 'Why neuro obs matter',
        items: [
          'They show trend: one score matters less than the direction',
          'They catch subtle change before the picture looks dramatic',
          'They guide escalation and early senior review',
          'Neuro obs should always be read alongside full observations',
        ],
      },
      {
        header: 'Consciousness and pupils',
        items: [
          'AVPU: quick screen \u2013 Alert, Voice, Pain, Unresponsive',
          'GCS: structured score using eye, verbal, and motor response',
          'Pupils: size, equality, and response to light',
          'Unequal pupils or poor reaction to light are worrying signs',
        ],
      },
      {
        header: 'Limb strength and behaviour',
        items: [
          'Power and symmetry in arms and legs',
          'Ask for squeeze, push, pull, lift, or simple movement',
          'New weakness or one-sided difference matters',
          'Behaviour, interaction, and feeding: whether the child is acting like themselves',
        ],
      },
      {
        header: 'Vital signs as neuro clues',
        items: [
          'Heart rate: may change if brainstem under pressure',
          'Blood pressure: can rise in serious neurological deterioration',
          'Breathing pattern: can become irregular if brainstem affected',
          'Abnormal respirations are a neurological sign as well as a respiratory one',
        ],
      },
    ],
    redFlags: ['Seizures or new fitting activity', 'Unequal pupils or poor pupil reaction', 'Focal weakness or one-sided limb change'],
    pearl: null,
  },
  {
    number: '6',
    colour: '6',
    name: 'Clinical Relevance and Conditions',
    question: 'Which conditions should you recognise, and how does neurological illness present in children?',
    cols: [
      {
        header: 'GBS and transverse myelitis',
        items: [
          'GBS: inflammation of peripheral nerves; weakness can progress upwards',
          'Progressive weakness, reduced reflexes, pain, floppiness',
          'Possible breathing involvement',
          'Transverse myelitis: inflammation across part of the spinal cord',
        ],
      },
      {
        header: 'Encephalitis and meningitis',
        items: [
          'Encephalitis: inflammation of the brain itself',
          'Fever, drowsiness, confusion, irritability, seizures',
          'Meningitis: inflammation of the protective layers',
          'Fever, poor feeding, vomiting, photophobia, neck stiffness, bulging fontanelle',
        ],
      },
      {
        header: 'Age-specific presentation',
        items: [
          'Baby: off feeds, floppy, irritable, difficult to wake, abnormal cry, bulging fontanelle',
          'Toddler: clinginess, sudden quietness, unusual behaviour, poor balance, vomiting',
          'Older child: headache, photophobia, weakness, confusion, altered speech, seizure',
        ],
      },
      {
        header: 'Whole-child link',
        items: [
          'If conscious level drops, the airway may no longer be protected',
          'If brainstem affected, breathing and circulation can change',
          'Neurological concern should always lead back to a full A\u2013E reassessment',
          'Not just another GCS score',
        ],
      },
    ],
    redFlags: [
      'Reduced consciousness or difficult to rouse',
      'Seizures or new fitting activity',
      'Persistent vomiting with neurological signs',
      'Sudden behaviour change or not acting like themselves',
    ],
    pearl:
      'Neurological illness in children does not always present in a neat textbook way. A baby may be off feeds, difficult to wake, more irritable, floppy, or have a bulging fontanelle. An older child may show headache, vomiting, behaviour change, limb weakness, or seizure activity. The bedside pattern matters.',
  },
];

const quizQuestions = [
  {
    question: 'What is the simplest overall job of the nervous system?',
    options: ['Store blood, filter waste, and make urine', 'Detect, process, and respond', 'Produce hormones and enzymes', 'Absorb oxygen and remove carbon dioxide'],
    answer: 1,
    explanation: 'At foundation level, the nervous system can be thought of as a detect -> process -> respond system.',
  },
  {
    question: 'Which option correctly matches the CNS?',
    options: ['Brain and spinal cord', 'All the nerves in the limbs only', 'Cranial nerves only', 'Autonomic nerves only'],
    answer: 0,
    explanation: 'The CNS is the brain and spinal cord. The PNS is everything outside that central control centre.',
  },
  {
    question: 'What is the difference between sensory and motor pathways?',
    options: ['Sensory pathways send instructions out; motor pathways bring information in', 'Sensory pathways bring information in; motor pathways send instructions out', 'Both do exactly the same job', 'Motor pathways only control pupils'],
    answer: 1,
    explanation: 'Sensory pathways carry information towards the CNS, while motor pathways carry instructions away from it.',
  },
  {
    question: 'Which part of the brain is most linked to balance and coordination?',
    options: ['Cerebrum', 'Cerebellum', 'Brainstem', 'Meninges'],
    answer: 1,
    explanation: 'The cerebellum is the area most associated with balance, posture, and smooth coordinated movement.',
  },
  {
    question: 'Why is the brainstem especially important in a sick child?',
    options: ['It mainly stores memories', 'It controls vital automatic functions like breathing and heart rate', 'It only interprets vision', 'It makes CSF'],
    answer: 1,
    explanation: 'The brainstem is a vital control area linked to breathing, heart rate, blood pressure, consciousness, swallowing, and pupils.',
  },
  {
    question: 'Which observation is the quickest simple consciousness screen?',
    options: ['GCS', 'AVPU', 'PEWS', 'Urinalysis'],
    answer: 1,
    explanation: 'AVPU is the quick consciousness screen. GCS gives a more structured and detailed assessment.',
  },
  {
    question: "What should you remember about Cushing's triad?",
    options: ['It is an early sign of mild dehydration', 'It is a late sign of raised intracranial pressure', 'It only matters after seizures have stopped', 'It is mainly a gastrointestinal sign'],
    answer: 1,
    explanation: "Cushing's triad is a late sign of raised intracranial pressure. Do not wait for it before escalating concern.",
  },
  {
    question: 'Which condition from this page is especially linked with progressive weakness that can affect breathing?',
    options: ['Meningitis', 'Encephalitis', 'GBS', 'Transverse myelitis'],
    answer: 2,
    explanation: 'GBS can cause progressive ascending weakness and may involve the respiratory muscles, which is why close observation matters.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function BrainNervousSystemPage() {
  return (
    <PremiumHubPageGate resourceTitle="Brain & Nervous System Assessment">
      <div className="ns-guide">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />

        <div className="ns-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="ns-back">
          <span className="ns-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="ns-kicker">Children&apos;s Nursing &middot; Paediatric Assessment</p>
        <h1 className="ns-headline">Brain &amp; Nervous System Assessment</h1>
        <p className="ns-standfirst">
          How the nervous system detects, processes, and responds, what to check during neuro observations, and which signs mean a child needs help urgently.
        </p>
        <p className="ns-byline">Children&apos;s nursing &middot; Neurological assessment &middot; The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="brain-nervous-system"
          hubItemTitle="Brain & Nervous System Assessment"
        />

        <div className="ns-pearl" style={{ marginBottom: '40px' }}>
          <p className="ns-pearl-label">Student note</p>
          <p>
            CNS means the brain and spinal cord. PNS means the nerves outside them. A synapse is the tiny gap where one nerve cell passes a message to the next. AVPU is a quick consciousness check. GCS is a more structured neurological score. ICP means intracranial pressure, which is the pressure inside the skull.
          </p>
        </div>

        {/* Golden rules */}
        <div className="ns-golden">
          {[
            {
              n: '01',
              title: 'Core job',
              text: 'Detect \u2013 Process \u2013 Respond. That is the nervous system in one line.',
            },
            {
              n: '02',
              title: 'CNS vs PNS',
              text: 'CNS = brain + spinal cord. PNS = the nerves carrying messages in and out. Sensory comes in, motor goes out.',
            },
            {
              n: '03',
              title: 'Sensory vs motor',
              text: 'Sensory comes in. Motor goes out. That simple direction rule helps a lot in exams and at the bedside.',
            },
            {
              n: '04',
              title: 'Golden rule',
              text: 'A changed child is a neurological sign until proved otherwise. Reduced interaction, feeding change, floppiness, or odd behaviour all count.',
            },
          ].map((cell) => (
            <div key={cell.n} className="ns-golden-cell">
              <span className="ns-golden-numeral">{cell.n}</span>
              <p className="ns-golden-title">{cell.title}</p>
              <p className="ns-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Numbered sections */}
        {SECTIONS.map((section) => (
          <div key={section.number} className="ns-step">
            {/* Sidebar */}
            <div className="ns-step-sidebar">
              <span className={`ns-step-letter ns-letter-${section.colour}`}>{section.number}</span>
              <span className={`ns-step-badge ns-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            {/* Content */}
            <div className="ns-step-content">
              <h2 className="ns-step-name">{section.name}</h2>
              <p className="ns-step-question">{section.question}</p>

              {/* 4-col grid */}
              <div className="ns-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="ns-content-col">
                    <p className="ns-col-header">{col.header}</p>
                    <ul className="ns-col-list">
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
                  <p className="ns-redflags-label">Red flags</p>
                  <div className="ns-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="ns-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Pearl */}
              {section.pearl && (
                <div className="ns-pearl">
                  <p className="ns-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Nervous system parts table */}
        <h2 className="ns-section-title">Nervous System Parts</h2>
        <table className="ns-table" style={{ marginBottom: '18px' }}>
          <thead>
            <tr>
              <th>Part</th>
              <th>What it means</th>
              <th>Simple clinical meaning</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Central nervous system (CNS)', 'Brain and spinal cord', 'This is the main control centre where information is processed and responses are organised.'],
              ['Peripheral nervous system (PNS)', 'All the nerves outside the brain and spinal cord', 'This is the communication network carrying messages in and instructions out.'],
              ['Sensory pathways', 'Carry information towards the CNS', 'They bring in things like pain, touch, temperature, sight, and sound.'],
              ['Motor pathways', 'Carry instructions away from the CNS', 'They help produce movement, speech, swallowing, and posture.'],
              ['Somatic system', 'Controls voluntary movement', 'This is the part you assess when you ask a child to squeeze, push, lift, or wiggle.'],
              ['Autonomic system', 'Controls automatic body functions', 'This influences heart rate, blood pressure, breathing, pupils, and digestion without the child having to think about it.'],
            ].map(([part, meaning, relevance]) => (
              <tr key={part}>
                <td>{part}</td>
                <td>{meaning}</td>
                <td>{relevance}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Neurological observations table */}
        <h2 className="ns-section-title">Neurological Observation Details</h2>
        <table className="ns-table" style={{ marginBottom: '18px' }}>
          <thead>
            <tr>
              <th>Observation</th>
              <th>What it tells you</th>
              <th>What to keep in mind</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['AVPU', 'Quick screen: Alert, responds to Voice, responds to Pain, Unresponsive', 'Useful for the first impression. Any drop from fully alert matters.'],
              ['GCS', 'Structured score using eye, verbal, and motor response', 'Helpful for trends. A score only matters properly if you compare it with earlier observations.'],
              ['Pupils', 'Size, equality, and response to light', 'Unequal pupils or poor reaction to light are worrying neurological signs.'],
              ['Limb strength', 'Power and symmetry in arms and legs', 'Ask for squeeze, push, pull, lift, or simple movement. New weakness or one-sided difference matters.'],
              ['Behaviour, interaction, and feeding', 'Whether the child is behaving like themselves', 'Irritability, floppiness, poor feeding, difficult waking, or sudden quietness can all be neurological clues.'],
              ['Vital signs', 'Heart rate, blood pressure, and breathing pattern', 'Neurological deterioration can affect all three, so neuro obs should always be read alongside full observations.'],
            ].map(([obs, meaning, note]) => (
              <tr key={obs}>
                <td>{obs}</td>
                <td>{meaning}</td>
                <td>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Conditions table */}
        <h2 className="ns-section-title">Conditions at a Glance</h2>
        <table className="ns-table" style={{ marginBottom: '18px' }}>
          <thead>
            <tr>
              <th>Condition</th>
              <th>What&apos;s going on</th>
              <th>Key signs</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Guillain-Barr\u00e9 syndrome (GBS)', 'Inflammation of peripheral nerves slows or blocks nerve signals, so weakness can progress upwards.', 'Progressive weakness, reduced reflexes, pain, floppiness, difficulty walking, possible breathing involvement'],
              ['Encephalitis', 'Inflammation of the brain itself can affect behaviour, consciousness, and seizures.', 'Fever, drowsiness, confusion, irritability, seizures, headache, vomiting'],
              ['Meningitis', 'Inflammation of the protective layers around the brain and spinal cord.', 'Fever, irritability, poor feeding, vomiting, photophobia, neck stiffness, bulging fontanelle, reduced consciousness'],
              ['Transverse myelitis', 'Inflammation across part of the spinal cord interrupts messages travelling up and down.', 'Weakness, sensory change, altered reflexes, back pain, bladder or bowel problems'],
            ].map(([condition, what, signs]) => (
              <tr key={condition}>
                <td>{condition}</td>
                <td>{what}</td>
                <td>{signs}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Escalation pearl */}
        <div className="ns-pearl" style={{ marginTop: '18px', marginBottom: '18px' }}>
          <p className="ns-pearl-label">Escalation mindset</p>
          <p>
            Do not talk yourself out of neurological concern because the child is still moving or because one number looks acceptable. A changed conscious level, new weakness, pupil change, seizure, or worrying trend in behaviour deserves urgent review.
          </p>
        </div>

        {/* All red flags */}
        <p className="ns-redflags-label">Red flags &ndash; escalate immediately</p>
        <div className="ns-redflags" style={{ marginBottom: '18px' }}>
          {[
            'Reduced consciousness or difficult to rouse',
            'Seizures or new fitting activity',
            'Unequal pupils or poor pupil reaction',
            'Focal weakness or one-sided limb change',
            'Persistent vomiting with neurological signs',
            'Bulging fontanelle',
            'Sudden behaviour change or not acting like themselves',
            'Signs of raised intracranial pressure',
          ].map((flag) => (
            <span key={flag} className="ns-red-pill">{flag}</span>
          ))}
        </div>

        {/* Quick recap */}
        <div className="ns-info-grid" style={{ marginTop: '32px' }}>
          <div className="ns-info-cell">
            <p className="ns-info-cell-title">System job</p>
            <ul className="ns-info-list">
              <li>Detect \u2013 process \u2013 respond</li>
            </ul>
          </div>
          <div className="ns-info-cell">
            <p className="ns-info-cell-title">Organisation</p>
            <ul className="ns-info-list">
              <li>CNS = brain and spinal cord</li>
              <li>PNS = nerves outside them</li>
            </ul>
          </div>
          <div className="ns-info-cell">
            <p className="ns-info-cell-title">Key observations</p>
            <ul className="ns-info-list">
              <li>AVPU, GCS, pupils, limb strength, behaviour, vital signs</li>
            </ul>
          </div>
          <div className="ns-info-cell">
            <p className="ns-info-cell-title">Critical rule</p>
            <ul className="ns-info-list">
              <li>Cushing&apos;s triad is late; do not wait for it</li>
            </ul>
          </div>
        </div>

        <h2 className="ns-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Brain & Nervous System Assessment" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'Waugh A & Grant A (2018)', title: 'Ross and Wilson Anatomy and Physiology in Health and Illness (13th edn)', href: 'https://www.elsevier.com/' },
          { citation: 'NICE (2023)', title: 'Head injury: assessment and early management (NG232)', href: 'https://www.nice.org.uk/guidance/ng232' },
          { citation: 'The Glasgow Coma Scale (2018)', title: 'GCS-40 official resource', href: 'https://www.glasgowcomascale.org/' },
          { citation: 'NICE (2020)', title: 'Epilepsies in children, young people and adults (NG217)', href: 'https://www.nice.org.uk/guidance/ng217' },
        ]} />
        </div>
      </div>
    </PremiumHubPageGate>
  );
}
