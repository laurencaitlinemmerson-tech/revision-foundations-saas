/**
 * A dated snapshot of Lauren's Notion "Nursing Dashboard" (BSc Children's
 * Nursing, King's College London). Notion cannot be read at runtime, so this is
 * refreshed by hand: re-query the sources listed in the project memory and
 * update the constants below, then bump AS_OF.
 */

export const AS_OF = '2026-09-26';
export const NOTION_URL = 'https://www.notion.so/26a306dad85580b3947bc80a68a3be01';

export const DEGREE = {
  course: "BSc Children's Nursing",
  university: "King's College London",
  totalCredits: 360,
  earnedCredits: 120,
  currentYear: 2,
  totalYears: 3,
};

export type Assessment = {
  name: string;
  kind: string;
  weight: number; // 0–100; 0 means pass/fail
  mark?: number; // real result
  projected?: number; // placeholder until the result lands
};

export type Module = {
  code: string;
  title: string;
  credits: number;
  assessments: Assessment[];
  grade?: number;
  passFail?: boolean;
  /** Hub pages built from this module's lectures. */
  guides?: Array<{ label: string; href: string }>;
};

export type Year = {
  key: 'y1' | 'y2' | 'y3';
  label: string;
  span: string;
  status: 'complete' | 'current' | 'upcoming';
  modules: Module[];
};

export const YEARS: Year[] = [
  {
    key: 'y1',
    label: 'Year 1',
    span: '2025–26',
    status: 'complete',
    modules: [
      {
        code: '4KNIC001',
        title: "Foundations for Children's Nursing",
        credits: 60,
        grade: 67,
        assessments: [
          { name: 'Open book exam', kind: 'Exam', weight: 80, mark: 68 },
          { name: 'Group presentation', kind: 'Presentation', weight: 20, mark: 65 },
          { name: 'Numeracy assessment', kind: 'Pass / fail', weight: 0 },
        ],
      },
      {
        code: '4KNIC002',
        title: "Fundamental Skills for Children's Nursing",
        credits: 30,
        grade: 92,
        assessments: [{ name: 'OSCE', kind: 'Exam', weight: 100, mark: 92 }],
      },
      {
        code: '4KNIC003',
        title: "Becoming a Children's Nurse",
        credits: 15,
        grade: 90,
        assessments: [{ name: 'Essay', kind: 'Essay', weight: 100, mark: 90 }],
      },
      {
        code: '4KNIC041',
        title: "Women's Health",
        credits: 15,
        grade: 78,
        assessments: [{ name: '1,500-word report', kind: 'Essay', weight: 100, mark: 78 }],
      },
      {
        code: '4KNIC000',
        title: 'Practice Assessment Document (PAD)',
        credits: 0,
        passFail: true,
        assessments: [
          { name: 'PAD part 1', kind: 'Practice', weight: 0 },
          { name: 'Placement hours', kind: 'Practice', weight: 0 },
        ],
      },
    ],
  },
  {
    key: 'y2',
    label: 'Year 2',
    span: '2026–27',
    status: 'current',
    modules: [
      {
        code: '5KNIC011',
        title: 'Promoting & Optimising Health in Children’s Nursing',
        credits: 60,
        assessments: [
          { name: 'Essay', kind: 'Essay', weight: 50, projected: 70 },
          { name: 'Case study', kind: 'Essay', weight: 50, projected: 70 },
          { name: 'Numeracy assessment', kind: 'Pass / fail', weight: 0 },
        ],
      },
      {
        code: '5KNIC012',
        title: 'Nursing Process in Action',
        credits: 30,
        assessments: [{ name: 'Exam', kind: 'Exam', weight: 100, projected: 70 }],
        guides: [
          { label: 'Shock: recognition & management', href: '/hub/resources/shock-recognition-management' },
          { label: 'Congenital heart disease', href: '/hub/resources/congenital-heart-disease' },
          { label: 'ECG & cardiac conduction', href: '/hub/resources/ecg-cardiac-conduction' },
          { label: 'Common respiratory conditions', href: '/hub/resources/paediatric-respiratory-conditions' },
          { label: 'Tracheostomy care', href: '/hub/resources/tracheostomy-care' },
          { label: 'Disability assessment & neuro obs', href: '/hub/resources/disability-assessment-neuro-observations' },
        ],
      },
      {
        code: '5KNIA013',
        title: 'Pharmacology for Healthcare Practice',
        credits: 15,
        assessments: [{ name: 'MCQ exam', kind: 'Exam', weight: 100, projected: 70 }],
        guides: [
          { label: 'Drug calculations cheat sheet', href: '/hub/resources/drug-calculations-cheat-sheet' },
          { label: '9 rights of medication', href: '/hub/resources/9-rights-medication' },
        ],
      },
      {
        code: '5KNIC019',
        title: 'Haemoglobinopathies: Client-Centred Care',
        credits: 15,
        assessments: [{ name: 'Analysis of an aspect of care management', kind: 'Essay', weight: 100, projected: 70 }],
      },
      {
        code: '5KNIC000',
        title: 'Practice Assessment Document (PAD)',
        credits: 0,
        passFail: true,
        assessments: [{ name: 'PAD', kind: 'Practice', weight: 0 }],
      },
    ],
  },
  {
    key: 'y3',
    label: 'Year 3',
    span: '2027–28',
    status: 'upcoming',
    modules: [
      { code: '6KNIC021', title: "Professional Practice as a Children's Nurse", credits: 60, assessments: [] },
      { code: '6KNIC022', title: 'Clinical Care & Decision-Making', credits: 30, assessments: [] },
      { code: 'Optional', title: 'Optional module, term 1 (to be confirmed)', credits: 15, assessments: [] },
      { code: 'Optional', title: 'Optional module, term 2 (to be confirmed)', credits: 15, assessments: [] },
      { code: '6KNIC000', title: 'Practice Assessment Document (PAD)', credits: 0, passFail: true, assessments: [] },
    ],
  },
];

export type Placement = {
  name: string;
  year: 1 | 2 | 3;
  specialty: string | null;
  start: string | null; // ISO
  end: string | null;
  signOff?: boolean;
  guides?: { label: string; href: string }[]; // specialty revision, shown ahead of PLACEMENT_GUIDES
};

export const PLACEMENTS: Placement[] = [
  { name: 'February 2026', year: 1, specialty: 'Oncology', start: '2026-02-02', end: '2026-03-15' },
  { name: 'July 2026', year: 1, specialty: 'Neurosurgery', start: '2026-07-13', end: '2026-08-15' },
  {
    name: 'October 2026', year: 2, specialty: 'Renal', start: '2026-09-28', end: '2026-11-08',
    guides: [
      { label: 'Renal system', href: '/hub/resources/renal-system' },
      { label: 'Fluids, electrolytes and homeostasis', href: '/hub/resources/fluids-electrolytes-homeostasis' },
    ],
  },
  { name: 'February 2027', year: 2, specialty: null, start: '2027-02-22', end: '2027-03-21' },
  { name: 'July 2027', year: 2, specialty: null, start: null, end: null },
  { name: 'November 2027', year: 3, specialty: null, start: null, end: null },
  { name: 'February 2028', year: 3, specialty: null, start: null, end: null },
  { name: 'Sign-off placement', year: 3, specialty: null, start: '2028-05-01', end: '2028-07-31', signOff: true },
];

export const PLACEMENT_PREP = [
  'Confirm the start time, ward and who to ask for',
  'Uniform, lanyard, watch and pens ready',
  'PAD to hand and my proficiencies re-read',
  'Refresh A–E assessment and paediatric vital signs',
  'Medication safety: 9 rights and the calculations I use most',
  'Know the escalation route on the ward',
];

export const PLACEMENT_GUIDES = [
  { label: 'Placement survival guide', href: '/hub/resources/placement-survival' },
  { label: 'A–E assessment framework', href: '/hub/resources/ae-assessment-guide' },
  { label: 'Paediatric vital signs', href: '/hub/resources/paeds-vital-signs-cheat-sheet' },
  { label: 'IM & SC injections', href: '/hub/resources/im-sc-injection' },
];


// ── Practice hours (Notion "Placement Hours Tracker") ─────────────────────────
export const NMC_HOURS = 2300;

export const HOURS = {
  signedOff: { clinical: 417, simulated: 184, rpl: 75 }, // Year 1, all signed off
  y2Planned: { placements: 588.5, simulated: 126 },
  placement1: { required: 225, rostered: 218.5, balance: 6.5 },
  y1Shifts: { longDays: 33, nights: 5 },
};

export type Shift = { date: string; start: string; end: string; ward: string; missingHours?: boolean };

/** October 2026 placement rota, as entered in Notion (times are wall-clock). */
export const ROTA: Shift[] = [
  { date: '2026-09-29', start: '07:45', end: '20:15', ward: 'Eagle' },
  { date: '2026-10-03', start: '07:45', end: '20:15', ward: 'Eagle' },
  { date: '2026-10-04', start: '07:45', end: '20:15', ward: 'Eagle' },
  { date: '2026-10-07', start: '07:45', end: '20:15', ward: 'Eagle' },
  { date: '2026-10-08', start: '07:45', end: '20:15', ward: 'Placement', missingHours: true },
  { date: '2026-10-09', start: '07:45', end: '20:15', ward: 'Eagle', missingHours: true },
  { date: '2026-10-12', start: '08:00', end: '20:30', ward: 'Placement' },
  { date: '2026-10-13', start: '08:00', end: '20:30', ward: 'Placement' },
  { date: '2026-10-17', start: '07:45', end: '20:15', ward: 'Placement' },
  { date: '2026-10-18', start: '07:45', end: '20:15', ward: 'Placement' },
  { date: '2026-10-20', start: '07:45', end: '20:15', ward: 'Placement' },
  { date: '2026-10-21', start: '07:45', end: '20:15', ward: 'Placement' },
  { date: '2026-10-22', start: '07:45', end: '20:15', ward: 'Placement' },
  { date: '2026-10-28', start: '07:45', end: '20:15', ward: 'Placement' },
  { date: '2026-10-29', start: '07:45', end: '20:15', ward: 'Placement' },
  { date: '2026-10-31', start: '07:45', end: '20:15', ward: 'Placement' },
  { date: '2026-11-03', start: '07:45', end: '20:15', ward: 'Placement' },
  { date: '2026-11-04', start: '07:45', end: '20:15', ward: 'Placement' },
  { date: '2026-11-05', start: '07:45', end: '20:15', ward: 'Placement' },
  { date: '2026-11-07', start: '07:45', end: '20:15', ward: 'Placement' },
];

// ── Deadlines (Notion "Master Assignment / Exam Planner") ─────────────────────
export type Deadline = {
  id: string;
  title: string;
  module: string;
  date: string;
  time?: string;
  kind: string;
  weight?: number;
  priority?: 'Urgent' | 'High' | 'Medium';
  status: string;
  detail: string;
};

export const DEADLINES: Deadline[] = [
  {
    id: 'plan', title: 'Formative plan', module: '5KNIC011', date: '2026-12-02', kind: 'Plan · 250 words',
    status: 'Plan drafted', detail: 'Child and family, the condition, three WHO social determinants, and sources.',
  },
  {
    id: 'feedback', title: 'Formative feedback returned', module: '5KNIC011', date: '2026-12-11', kind: 'Feedback',
    status: 'Waiting', detail: 'Act on anything flagged before the January submission.',
  },
  {
    id: 'case', title: 'Case study essay', module: '5KNIC011', date: '2027-01-12', time: '23:59', kind: 'Essay · 2,000 words', weight: 50,
    priority: 'High', status: 'Writing',
    detail: 'How 2–3 WHO-defined social determinants of health affect a child or young person with a long-term condition and their family.',
  },
  {
    id: 'essay', title: 'Essay', module: '5KNIC011', date: '2027-01-14', kind: 'Essay', weight: 50,
    priority: 'Medium', status: 'Not started',
    detail: 'Build early reading around health promotion, inequalities, child and family-centred care, MECC and evidence-based public health.',
  },
  {
    id: 'pharm', title: 'Pharmacology MCQ exam', module: '5KNIA013', date: '2027-01-14', time: '11:00–15:00', kind: 'Exam · computer-based', weight: 100,
    priority: 'High', status: 'Not started',
    detail: "Guy's, New Hunts House 2.15 (SCR). Practise drug calculations and weight-based dosing.",
  },
  {
    id: 'numeracy', title: 'Numeracy assessment', module: '5KNIC011', date: '2027-05-01', kind: 'Pass / fail hurdle', weight: 0,
    priority: 'Urgent', status: 'Not started',
    detail: 'Weighted 0% but treated as a hurdle you must pass. Drug calculations, IV rates, units and conversions.',
  },
  {
    id: 'haem', title: 'Haemoglobinopathies essay', module: '5KNIC019', date: '2027-05-01', kind: 'Essay', weight: 100,
    status: 'Not started', detail: 'Analysis of an aspect of care management.',
  },
  {
    id: 'npia', title: 'Nursing Process in Action exam', module: '5KNIC012', date: '2027-05-18', kind: 'Exam', weight: 100,
    priority: 'High', status: 'Not started',
    detail: 'Assessment, care planning, clinical reasoning, documentation, escalation and child and family-centred nursing process.',
  },
];

export const CASE_STUDY = {
  words: 2152,
  limit: 2000,
  expectedMark: 79,
  tasks: [
    {
      id: 'citations', title: 'Verify three citations', date: '2026-09-12',
      detail: 'Wu et al. (2024) needs the full author list, not "et al.". D\'Alessandro et al. (2024), Paediatrics & Child Health 29(4), 224–230. Baugh et al. (2024), Neuro-Oncology Advances 6(1): Kramm is the last author, not the first.',
    },
    {
      id: 'refs', title: 'Reference list formatting sweep', date: '2026-09-19',
      detail: 'Same font size throughout, journal titles and volume numbers italicised consistently, uniform hanging indents and identical DOI format. Kimberley flagged this on Women\'s Health. Check the APA guidance on KEATS.',
    },
    {
      id: 'brief', title: 'Check brief details and coversheet', date: '2026-09-26',
      detail: 'Are subheadings allowed? Is 2,000 words a hard limit or 10% either way (you are at 2,152)? Coversheet: candidate number from myKCL, Level 2 AI declaration, module lead, module code 5KNIC011.',
    },
  ],
};

// ── Sessions (Notion "Nursing Lecture Notes") ────────────────────────────────
export type SessionCount = { code: string; name: string; done: number; inProgress: number; todo: number };

export const Y2_SESSIONS: SessionCount[] = [
  { code: '5KNIC011', name: 'Promoting & Optimising Health', done: 2, inProgress: 4, todo: 36 },
  { code: '5KNIC012', name: 'Nursing Process in Action', done: 6, inProgress: 2, todo: 28 },
  { code: '5KNIA013', name: 'Pharmacology', done: 0, inProgress: 5, todo: 12 },
  { code: '5KNIKYRQ', name: 'Key Requirements', done: 0, inProgress: 0, todo: 6 },
  { code: '6KNIN314', name: 'Interprofessional module', done: 0, inProgress: 0, todo: 10 },
];

export const Y1_SESSIONS_DONE = 127;

// ── Marker feedback worth carrying forward ────────────────────────────────────
export const FEEDBACK = [
  {
    title: 'Reflective essay', mark: 90, marker: 'Laura Gilmore', when: 'Jan 2026',
    strengths: ['Excellent level of reflection, with practical learning and emotions considered well.', 'Showed how the NMC Code is woven into the work of a nurse.'],
    develop: ['Use more up-to-date policy sources (the one cited was from 2012).', 'Format the reference list per APA 7th, with a hanging indent.'],
  },
  {
    title: "Women's Health essay", mark: 78, marker: 'Kimberley Whitehead', when: 'Jun 2026',
    strengths: ['"An excellent essay, with a compelling rationale and argument."'],
    develop: ['Unpack every point. Proof-read and ask whether someone new to the essay would follow it.', 'For marks in the 80s, make explicit why your idea or approach is original.', 'Keep referencing consistent (font size and presentation).'],
  },
];

// ── Study bank (Notion databases) ─────────────────────────────────────────────
export const BANK = { conditions: 29, drugs: 26, flashcards: 36 };

// ── What I learnt on each placement (Notion placement pages + Condition Bank / Drug Formulary) ──
export type PlacementNote = {
  name: string;          // matches PLACEMENTS[].name
  specialty: string;
  setting?: string;
  intro: string;
  know: string[];        // things to know about the specialty
  conditions: { group: string; name: string; know: string; flag: string }[];
  drugs: { name: string; cls: string; use: string }[];
  skills: string[];
  said: string[];        // themes from supervisor feedback
  guides: { label: string; href: string }[];
  prep?: boolean;        // written before the placement: what to expect rather than what I met
};

export const PLACEMENT_NOTES: PlacementNote[] = [
  {
    name: 'February 2026',
    specialty: 'Oncology',
    intro:
      'Children with cancer and blood disorders. The theme running through everything is that these children get sick fast, and they often don’t look it.',
    know: [
      'Fever of 38°C or more in a neutropenic child is neutropenic sepsis. Give IV antibiotics within 1 hour and do not wait for results.',
      'With too few neutrophils there may be no pus or redness, so watch for tachycardia, tachypnoea, lethargy, poor feeding and mottling instead.',
      'Marrow failure shows up three ways: pallor and fatigue (anaemia), fever and infections (neutropenia), bruising and bleeding (low platelets).',
      'Tumour-lysis prophylaxis means hydration plus allopurinol or rasburicase. Central lines (CVLs) are the normal access.',
      'Sickle cell and thalassaemia sit on the same ward pathway. Sickle triggers are cold, dehydration, infection, hypoxia and stress.',
    ],
    conditions: [
      { group: 'Cancers', name: 'Acute lymphoblastic leukaemia (ALL)', know: 'Commonest childhood cancer, peaking at 2–5 years. Chemotherapy runs in phases (induction, consolidation, maintenance) over about 2–3 years.', flag: 'Neutropenic fever; severe bruising or bleeding' },
      { group: 'Cancers', name: 'Acute myeloid leukaemia (AML)', know: 'Rarer and more aggressive than ALL, with shorter, more intensive chemotherapy. The APML subtype brings DIC.', flag: 'Neutropenic sepsis, DIC, leucostasis, severe bleeding' },
      { group: 'Cancers', name: 'Neuroblastoma', know: 'Commonest extracranial solid tumour and the commonest cancer in infants. Look for an abdominal mass, raccoon eyes, Horner’s and opsoclonus-myoclonus.', flag: 'Spinal cord compression: back pain, limb weakness, bladder or bowel change' },
      { group: 'Complications', name: 'Neutropenic sepsis', know: 'Sepsis 6 with broad-spectrum IV antibiotics inside the hour. Escalate to oncology early and reassess often.', flag: 'Temp ≥38°C in a neutropenic child' },
      { group: 'Blood disorders', name: 'Sickle cell disease', know: 'Painful crises, dactylitis in infants, and hyposplenism, which is why penicillin prophylaxis matters.', flag: 'Acute chest syndrome: chest pain, fever, hypoxia' },
    ],
    drugs: [
      { name: 'Gentamicin', cls: 'Antibiotic', use: 'Severe Gram-negative infection and sepsis' },
      { name: 'Ondansetron', cls: 'Antiemetic', use: 'Nausea and vomiting, including from chemotherapy' },
      { name: 'Paracetamol', cls: 'Analgesic', use: 'Pain and fever' },
      { name: 'Morphine', cls: 'Analgesic', use: 'Severe or acute pain' },
      { name: 'Hydroxycarbamide', cls: 'Haematology', use: 'Raises HbF and cuts the number of sickle crises' },
      { name: 'Red cell transfusion', cls: 'Blood product', use: 'Severe anaemia; helps prevent stroke in sickle cell' },
      { name: 'Penicillin V', cls: 'Antibiotic', use: 'Prevents infection from hyposplenism' },
      { name: 'Folic acid', cls: 'Haematology', use: 'Supports red cell production in chronic haemolysis' },
      { name: 'Iron chelation', cls: 'Haematology', use: 'Removes iron built up by repeated transfusions' },
    ],
    skills: ['Manual blood pressures', 'A full set of observations', 'Oral medication confidence', 'Family-centred communication'],
    said: [
      'Kind, warm, and quick to build trust with children and families',
      'Proactive: looks for ways to help without being asked',
      'Curious: asks why, then turns it into learning notes',
      'To polish: manual BPs, full obs sets and oral medicines until they feel consistent',
    ],
    guides: [
      { label: 'Paediatric vital signs', href: '/hub/resources/paeds-vital-signs-cheat-sheet' },
      { label: 'Y1 paediatric medications', href: '/hub/resources/y1-paeds-medications' },
    ],
  },
  {
    name: 'July 2026',
    specialty: 'Neurosurgery',
    setting: 'Koala ward, GOSH',
    intro:
      'A surgical ward with neurosurgical children, some on HDU. Most of the work is post-operative: neuro obs, drains, wounds, fluids and knowing when to escalate.',
    know: [
      'Neuro obs mean GCS, pupils and limb power. On HDU that was 2-hourly, and you report any change straight away.',
      'Raised ICP looks like early-morning headache, vomiting and drowsiness. In infants, a bulging fontanelle or growing head. Cushing’s triad is a late sign.',
      'Post-op, use PEWS with an ABCDE approach. Watch for bleeding, hypovolaemia, hypothermia, PONV and pain.',
      'Drains: know the type (closed suction, passive, chest), record volume, colour and consistency each shift, keep them below the wound and secure them.',
      'Wounds: ANTT for every change, and know the signs of infection. Keep fluid balance accurate and flag low urine output.',
      'Safety bundles: WHO surgical safety checklist, VTE assessment and Sepsis 6 if unwell with suspected infection.',
    ],
    conditions: [
      { group: 'Neurological', name: 'Hydrocephalus and VP shunts', know: 'Headache, morning vomiting, drowsiness; bulging fontanelle in infants.', flag: 'Shunt blockage or infection: vomiting with drowsiness, fever, redness along the track' },
      { group: 'Neurological', name: 'Raised intracranial pressure', know: 'Keep the head midline and 30° up, avoid hypoxia, and do frequent neuro obs.', flag: 'Unequal pupils, abnormal breathing, rapid deterioration' },
      { group: 'Neurological', name: 'Brain and spinal tumours (post-op)', know: 'Neuro obs to plan, wound and dressing checks, safe mobilising. Posterior fossa tumours give ataxia, nystagmus and cranial nerve palsies.', flag: 'New deficit, seizure, CSF leak, wound bleeding' },
      { group: 'Neurological', name: 'Epilepsy and seizure management', know: 'Time it, protect the head, never restrain. Status is a seizure over 5 minutes: benzodiazepine, then second line at 10.', flag: 'Seizure over 5 minutes, or repeated without recovery' },
      { group: 'Neurological', name: 'Arteriovenous malformation (AVM)', know: 'Often silent until a bleed. A vein of Galen malformation in neonates can present as heart failure.', flag: 'Thunderclap headache, reduced GCS, new focal deficit' },
      { group: 'Neurological', name: 'Paediatric stroke', know: 'Under-recognised in children. In sickle cell it needs urgent exchange transfusion.', flag: 'FAST signs or new focal seizures' },
      { group: 'Neurological', name: 'Craniofacial conditions and craniosynostosis', know: 'Mostly planned surgery. Post-op cranial vault remodelling can lose a lot of blood.', flag: 'Raised ICP; airway problems in syndromic cases' },
      { group: 'General surgical', name: 'Acute appendicitis', know: 'Pain moves from the umbilicus to the right iliac fossa. Younger children present late and perforate more easily.', flag: 'Sudden relief then worsening, rigid abdomen' },
      { group: 'General surgical', name: 'Pyloric stenosis', know: 'Non-bilious projectile vomiting at 2–8 weeks. Correct fluids and electrolytes before theatre.', flag: 'Dehydration with a hypochloraemic alkalosis' },
      { group: 'General surgical', name: 'Intussusception', know: 'Colicky pain with knees drawn up, then lethargy. Redcurrant jelly stool is a late sign.', flag: 'Bilious vomiting, shock, peritonism' },
      { group: 'General surgical', name: 'Testicular torsion', know: 'Time-critical: do not delay for imaging. Salvage falls sharply after about 6 hours.', flag: 'Any acute scrotal pain' },
      { group: 'General surgical', name: 'Incarcerated inguinal hernia', know: 'Reducible hernias get elective repair. Irreducible and tender means urgent.', flag: 'Vomiting or skin discolouration: strangulation' },
      { group: 'General surgical', name: 'Post-tonsillectomy haemorrhage', know: 'Children swallow blood, so loss is underestimated. Frequent swallowing is the clue.', flag: 'Frequent swallowing with tachycardia; airway compromise' },
    ],
    drugs: [
      { name: 'Paracetamol (peri-operative)', cls: 'Analgesic', use: 'First-line analgesia and antipyretic' },
      { name: 'Ibuprofen (post-operative)', cls: 'Analgesic', use: 'Part of multimodal pain relief; avoid if dehydrated or bleeding risk' },
      { name: 'Morphine (PCA)', cls: 'Analgesic', use: 'Moderate to severe post-operative pain' },
      { name: 'Ondansetron (PONV)', cls: 'Antiemetic', use: 'Post-operative nausea and vomiting' },
      { name: 'Co-amoxiclav', cls: 'Antibiotic', use: 'Surgical prophylaxis; never in penicillin allergy' },
      { name: 'Metronidazole', cls: 'Antibiotic', use: 'Anaerobic cover in bowel surgery' },
      { name: 'Gentamicin', cls: 'Antibiotic', use: 'Gram-negative infection and prophylaxis per local policy' },
    ],
    skills: [
      'Full paediatric obs with PEWS, and knowing when to escalate',
      'Neuro obs including 2-hourly GCS',
      'Oral medicines using the 8 Rs',
      'PICC line dressing change',
      'PEG-J feed and pump set-up',
      'Cannula removal',
      'Handover to the night team',
    ],
    said: [
      'A pleasure to work with, takes an interest in every patient she is allocated',
      'Proactive with initiative: led on patients, escalated to the MDT promptly and confidently',
      'Good time management; documentation and obs done on time to a good standard',
      'Age-appropriate communication that builds rapport with children and families',
      'Keep asking questions and getting involved in cares and tasks',
    ],
    guides: [
      { label: 'Neuro observations', href: '/hub/resources/disability-assessment-neuro-observations' },
      { label: 'Brain and nervous system', href: '/hub/resources/brain-nervous-system' },
      { label: 'A–E assessment', href: '/hub/resources/ae-assessment-guide' },
    ],
  },
  {
    name: 'October 2026',
    specialty: 'Renal',
    setting: 'Eagle ward',
    prep: true,
    intro:
      'Children with kidney disease, from nephrotic syndrome and AKI to dialysis and transplants. Nearly everything comes back to fluid, electrolytes and blood pressure, and in a small child small numbers matter.',
    know: [
      'Fluid balance is the core job. Strict input and output, daily weights on the same scales at the same time, and stick to any fluid restriction. Weigh nappies: 1 g is 1 mL.',
      'Urine output should be at least 1 mL/kg/h. Under 0.5 mL/kg/h in a child (under 1 mL/kg/h in an infant) is oliguria, so escalate it.',
      'Blood pressure matters more here than anywhere. Use the right cuff size and compare with centiles for age, sex and height, not adult numbers.',
      'Potassium is the dangerous electrolyte. A high potassium can stop the heart, so know the latest result before giving anything that contains it.',
      'Many drugs are cleared by the kidneys. Doses are adjusted to kidney function, NSAIDs are usually avoided, and gentamicin, vancomycin and tacrolimus need levels.',
      'Transplant and steroid patients are immunosuppressed. Fever, chickenpox contact and live vaccines all need flagging to the team.',
      'Dialysis access is precious. Keep PD exit sites and haemodialysis lines clean and secure, and cloudy PD fluid means peritonitis until proven otherwise.',
    ],
    conditions: [
      { group: 'Glomerular', name: 'Nephrotic syndrome', know: 'Heavy proteinuria, low albumin and oedema, usually starting around the eyes. Most children aged 2–5 have minimal change disease, which responds to steroids.', flag: 'Abdominal pain, cold peripheries or a long CRT despite oedema (hypovolaemia); fever with abdominal pain (peritonitis); a swollen limb (clot)' },
      { group: 'Glomerular', name: 'Nephritic syndrome (post-infectious, IgA, HSP nephritis)', know: 'Blood in the urine (often cola-coloured), high blood pressure, oedema and less urine. Often follows a throat or skin infection.', flag: 'Headache, visual change or seizure (hypertensive encephalopathy); falling urine output' },
      { group: 'Kidney failure', name: 'Acute kidney injury (AKI)', know: 'Creatinine rises or urine output falls. In children dehydration (pre-renal) is the commonest cause, so fluid status comes first.', flag: 'High potassium, fluid overload with breathlessness, no urine' },
      { group: 'Kidney failure', name: 'Haemolytic uraemic syndrome (HUS)', know: 'Usually follows bloody diarrhoea from E. coli O157. Anaemia from broken red cells, low platelets and AKI. Care is supportive, and some children need dialysis.', flag: 'Stops passing urine, seizures, pallor with bruising' },
      { group: 'Kidney failure', name: 'Chronic kidney disease (CKD)', know: 'Affects the whole child: growth, anaemia, bone health, blood pressure and diet. Congenital kidney and urinary tract problems are the commonest cause in children.', flag: 'High potassium, fluid overload, rising blood pressure' },
      { group: 'Kidney failure', name: 'Dialysis (peritoneal and haemodialysis)', know: 'PD uses the lining of the abdomen as the filter, often overnight at home. Haemodialysis uses a central line or fistula, usually in hospital several times a week.', flag: 'Cloudy PD fluid or abdominal pain (peritonitis); fever with a line (line infection)' },
      { group: 'Transplant', name: 'Kidney transplant', know: 'Lifelong immunosuppression with tacrolimus levels checked regularly. Strict fluid balance straight after surgery.', flag: 'Rising creatinine, less urine, fever or a tender graft (rejection or infection)' },
      { group: 'Urological', name: 'UTI and pyelonephritis', know: 'Infants present vaguely: fever, vomiting, poor feeding. Any fever in a baby under 3 months needs a urine sample.', flag: 'Signs of sepsis; recurrent UTIs, which can scar the kidneys' },
      { group: 'Urological', name: 'Congenital anomalies (CAKUT, reflux, posterior urethral valves)', know: 'Often found as hydronephrosis on antenatal scans. Valves only affect boys and cause a poor urine stream.', flag: 'Poor stream or a palpable bladder in a boy; recurrent UTIs' },
    ],
    drugs: [
      { name: 'Prednisolone', cls: 'Corticosteroid', use: 'First-line treatment for nephrotic syndrome' },
      { name: 'Furosemide', cls: 'Loop diuretic', use: 'Oedema and fluid overload' },
      { name: 'Human albumin 20%', cls: 'Blood product', use: 'Severe nephrotic oedema or hypovolaemia, often with furosemide' },
      { name: 'Tacrolimus', cls: 'Immunosuppressant', use: 'Prevents transplant rejection; trough levels guide the dose' },
      { name: 'Mycophenolate mofetil', cls: 'Immunosuppressant', use: 'Transplant and steroid-dependent nephrotic syndrome' },
      { name: 'Amlodipine', cls: 'Antihypertensive', use: 'High blood pressure' },
      { name: 'Enalapril', cls: 'ACE inhibitor', use: 'High blood pressure and reducing protein leak' },
      { name: 'Erythropoietin', cls: 'Haematology', use: 'Anaemia of CKD' },
      { name: 'Alfacalcidol', cls: 'Vitamin D', use: 'Bone health in CKD' },
      { name: 'Phosphate binders', cls: 'Electrolyte', use: 'Calcium carbonate or sevelamer with meals to lower phosphate' },
      { name: 'Sodium bicarbonate', cls: 'Electrolyte', use: 'Metabolic acidosis in CKD' },
      { name: 'Hyperkalaemia treatment', cls: 'Emergency', use: 'Calcium gluconate, salbutamol and insulin with glucose' },
      { name: 'Trimethoprim', cls: 'Antibiotic', use: 'UTI treatment and prophylaxis' },
    ],
    skills: [
      'Strict fluid balance charts and daily weights',
      'Blood pressure with the right cuff, checked against centiles',
      'Urinalysis and collecting a clean urine sample',
      'Timing drug levels (tacrolimus troughs, gentamicin)',
      'PD exit site care and watching a PD set-up',
      'Central line care with ANTT',
    ],
    said: [],
    guides: [
      { label: 'Renal system', href: '/hub/resources/renal-system' },
      { label: 'Fluids, electrolytes and homeostasis', href: '/hub/resources/fluids-electrolytes-homeostasis' },
      { label: 'Paediatric vital signs', href: '/hub/resources/paeds-vital-signs-cheat-sheet' },
    ],
  },
];

// ── The reasoning behind the notes above (know[] is index-aligned; conditions/drugs keyed by name) ──
export const PLACEMENT_WHY: Record<string, { know: string[]; cond: Record<string, string>; drug: Record<string, string> }> = {
  'February 2026': {
    know: [
      'Neutrophils are the main defence against bacteria. Without them a small infection can become sepsis within hours, so treatment cannot wait for culture results.',
      'Pus and redness are made by neutrophils arriving at the infection. With none to send, the only clues are changes in the child’s observations and behaviour.',
      'Leukaemic cells crowd out normal marrow, so the child makes fewer red cells (pallor, fatigue), neutrophils (infection) and platelets (bruising).',
      'Chemotherapy kills cells fast and releases potassium, phosphate and uric acid that can injure the kidneys. Fluids flush them, and allopurinol or rasburicase lowers uric acid. Central lines spare small veins from repeated needles.',
      'Sickled cells form when haemoglobin gives up its oxygen. Cold, dehydration, infection and hypoxia all push that along, then the cells block small vessels and cause pain.',
    ],
    cond: {
      'Acute lymphoblastic leukaemia (ALL)': 'One course of drugs leaves some resistant cells, so treatment comes in phases, with maintenance to keep what is left suppressed. Chemotherapy reaches the brain poorly, so CNS-directed therapy is added.',
      'Acute myeloid leukaemia (AML)': 'The cells grow faster, so treatment is more intense but shorter. In the APML subtype the abnormal cells release clot-promoting substances, which is why DIC develops.',
      'Neuroblastoma': 'It grows from sympathetic nervous tissue. That explains the adrenal or abdominal mass, Horner’s syndrome and the high blood pressure from catecholamines. A dumbbell tumour grows through the spinal gaps and squeezes the cord.',
      'Neutropenic sepsis': 'Every hour without antibiotics raises the risk of septic shock. Treat first and let the cultures catch up.',
      'Sickle cell disease': 'HbS clumps when deoxygenated, so cells sickle and block vessels. The spleen is damaged by repeated blockage, so bacteria like pneumococcus are not cleared, which is why penicillin prophylaxis matters.',
    },
    drug: {
      'Gentamicin': 'Fast, broad Gram-negative cover when sepsis is suspected. It can harm the kidneys and hearing, so dose and levels matter.',
      'Ondansetron': 'It blocks the 5-HT3 receptors that trigger vomiting when chemotherapy releases serotonin from the gut.',
      'Paracetamol': 'It treats pain and fever, but it can hide a fever. In a neutropenic child check the temperature and escalate before giving it.',
      'Morphine': 'It acts on opioid receptors to dull severe pain. Watch breathing and sedation for respiratory depression.',
      'Hydroxycarbamide': 'It raises fetal haemoglobin, which does not sickle, so there are fewer crises.',
      'Red cell transfusion': 'It replaces faulty or missing red cells and dilutes the HbS, which is why it can help prevent stroke.',
      'Penicillin V': 'A damaged spleen cannot clear encapsulated bacteria, so a daily antibiotic covers that gap.',
      'Folic acid': 'Red cells are made and destroyed so quickly that the body runs short of folate.',
      'Iron chelation': 'The body has no way to excrete the iron from repeated transfusions, so it builds up in the heart and liver.',
    },
  },
  'July 2026': {
    know: [
      'The skull is a fixed box, so a small rise in pressure from swelling or bleeding does damage quickly. GCS, pupils and limb power pick it up early, and pupils change because pressure squeezes the nerve that controls them.',
      'Fluid or a mass in a fixed skull raises pressure. Lying flat overnight raises it more, hence morning headache and vomiting. Infant skull sutures are open, so the head grows. In Cushing’s triad the squeezed brainstem drives blood pressure up and heart rate down.',
      'Anaesthetic and opioids depress breathing and the airway. PEWS shows a trend before the child collapses, and ABCDE gives a fixed order that stops you missing the life-threatening problem.',
      'Drain output shows bleeding or infection. Below the wound lets gravity drain it and stops backflow, and securing it stops it pulling on the site.',
      'A surgical wound bypasses the skin barrier, so ANTT keeps microbes out. Urine output reflects circulation, so low output is an early sign of hypovolaemia.',
      'A checklist stops wrong-site and wrong-patient errors. Immobility after surgery raises clot risk. Sepsis 6 works because speed matters.',
    ],
    cond: {
      'Hydrocephalus and VP shunts': 'CSF cannot drain, so it builds up. The shunt diverts it to the abdomen, so a blocked shunt means pressure rises again, and infection can travel along it.',
      'Raised intracranial pressure': 'Head-up helps blood drain from the head, and midline stops the neck veins being squeezed. Hypoxia and high CO₂ widen brain vessels and push pressure higher.',
      'Brain and spinal tumours (post-op)': 'The brain swells after surgery, and any leak of CSF or new deficit means something has changed.',
      'Epilepsy and seizure management': 'Restraining causes injury, and anything in the mouth risks choking and broken teeth. A benzodiazepine goes first because it acts quickly, and a long seizure damages the brain.',
      'Arteriovenous malformation (AVM)': 'With no capillary bed, high-pressure arterial blood pours into thin veins that were not built for it and can rupture. A large shunt in a neonate overloads the heart.',
      'Paediatric stroke': 'Brain tissue dies quickly without oxygen. In sickle cell, sickled cells are blocking the arteries, so exchange transfusion lowers the HbS fast.',
      'Craniofacial conditions and craniosynostosis': 'Sutures that fuse early stop the skull growing with the brain, so pressure can rise. Vault surgery opens up a lot of vascular bone, so blood loss can be large.',
      'Acute appendicitis': 'The pain is central first because the gut senses it diffusely, then moves right when the inflamed appendix irritates the lining of the abdomen. Younger children present late, so they perforate more.',
      'Pyloric stenosis': 'Vomiting stomach acid loses chloride and hydrogen, causing an alkalosis. Anaesthetising before correcting it is unsafe.',
      'Intussusception': 'The telescoped bowel squeezes its own blood supply, which is why it ends in ischaemia and redcurrant jelly stool. The colic comes in waves as the bowel contracts.',
      'Testicular torsion': 'The twisted cord cuts off the blood supply, and tissue dies within hours, so exploring beats scanning.',
      'Incarcerated inguinal hernia': 'A trapped loop of bowel has its blood supply squeezed, and once it strangulates the bowel can die.',
      'Post-tonsillectomy haemorrhage': 'Children swallow blood rather than spit it, so the loss is hidden. Frequent swallowing and a fast pulse are the warning.',
    },
    drug: {
      'Paracetamol (peri-operative)': 'A safe base for pain relief that reduces how much opioid is needed.',
      'Ibuprofen (post-operative)': 'It blocks prostaglandins, which reduces pain and inflammation. It also lowers blood flow to the kidneys and affects platelets, so avoid it if dehydrated or at risk of bleeding.',
      'Morphine (PCA)': 'PCA gives steady control and the lockout limits overdose, so the child’s own pain drives the dose.',
      'Ondansetron (PONV)': 'Anaesthetic and opioids trigger vomiting through 5-HT3 receptors, and ondansetron blocks them.',
      'Co-amoxiclav': 'It covers the bacteria most likely to enter during surgery. A penicillin allergy risks anaphylaxis, so always check allergy status first.',
      'Metronidazole': 'It targets anaerobic bacteria that live in the bowel and cause infection when the bowel is perforated.',
      'Gentamicin': 'It covers Gram-negative gut bacteria. Like other aminoglycosides it can harm the kidneys, so follow local dosing.',
    },
  },
  'October 2026': {
    know: [
      'Damaged kidneys cannot get rid of extra water, so fluid builds up. Weight is the most reliable way to track fluid over a day, and small errors matter in a small child.',
      'Urine output shows how well the kidneys are perfused and working. It drops before creatinine rises, so it is the earliest warning.',
      'The kidneys control blood pressure through salt, water and renin. When they are diseased, blood pressure rises, and high pressure damages the kidneys further.',
      'The kidneys are the main way the body gets rid of potassium. When they fail, it builds up and disturbs the electrical activity of the heart.',
      'A drug the kidneys cannot clear builds up to toxic levels. NSAIDs reduce blood flow to the kidneys, and some antibiotics damage them directly.',
      'Immunosuppression blunts the immune response, so infections progress fast and may show fewer signs. Live vaccines can cause the disease they protect against.',
      'Children may need dialysis for years, and each line or catheter has a limited life. Bacteria entering the abdomen through the PD catheter turn the fluid cloudy.',
    ],
    cond: {
      'Nephrotic syndrome': 'Leaky glomeruli let albumin out. With less albumin in the blood, fluid moves into the tissues, so a child can be oedematous and dry inside the vessels at the same time. The liver makes more clotting factors, which is why clots happen.',
      'Nephritic syndrome (post-infectious, IgA, HSP nephritis)': 'Inflamed glomeruli leak blood and filter less, so salt and water are retained. That causes the oedema and high blood pressure.',
      'Acute kidney injury (AKI)': 'With less blood reaching the kidneys they filter less. Correcting the fluid early often reverses it before the kidney itself is damaged.',
      'Haemolytic uraemic syndrome (HUS)': 'The bacterial toxin damages the lining of small blood vessels, especially in the kidney. Clots form there, using up platelets and shredding red cells as they pass.',
      'Chronic kidney disease (CKD)': 'The kidneys also make the hormone that drives red cell production, activate vitamin D and balance acid. Losing them affects blood, bones and growth.',
      'Dialysis (peritoneal and haemodialysis)': 'Both work by diffusion across a membrane: waste moves from high to low concentration. PD uses the abdominal lining, and haemodialysis uses a machine filter.',
      'Kidney transplant': 'The immune system sees the new kidney as foreign. Tacrolimus has a narrow window between rejection and toxicity, which is why levels matter.',
      'UTI and pyelonephritis': 'Infants cannot tell you where it hurts, and infection can climb to the kidneys and scar them. That scarring can lead to high blood pressure and CKD later.',
      'Congenital anomalies (CAKUT, reflux, posterior urethral valves)': 'A blockage or backflow raises pressure in the kidney before birth, and that damages it while it is still developing.',
    },
    drug: {
      'Prednisolone': 'It calms the immune process that makes the glomeruli leak. Long courses affect growth, mood, blood pressure and blood sugar.',
      'Furosemide': 'It blocks salt reabsorption in the loop of Henle, so water follows the salt out. It can drop potassium and blood pressure.',
      'Human albumin 20%': 'It pulls fluid back into the vessels. Giving furosemide afterwards clears that fluid through the kidneys.',
      'Tacrolimus': 'It blocks T-cell activation. It can itself harm the kidneys, so levels are timed just before the next dose (the trough).',
      'Mycophenolate mofetil': 'It stops lymphocytes multiplying, so less steroid or tacrolimus is needed. Watch for low white cells and gut upset.',
      'Amlodipine': 'It relaxes the muscle in artery walls, so blood pressure falls without affecting the kidneys much.',
      'Enalapril': 'It lowers pressure inside the glomerulus, so less protein leaks. It can raise potassium and creatinine, so bloods are checked.',
      'Erythropoietin': 'It replaces the hormone the failing kidney no longer makes, so the marrow produces red cells again.',
      'Alfacalcidol': 'The kidney normally activates vitamin D. This is already active, so calcium absorption and bone growth continue.',
      'Phosphate binders': 'Failing kidneys retain phosphate, which weakens bone. Binders taken with food stop it being absorbed from the gut.',
      'Sodium bicarbonate': 'The kidneys normally excrete acid. Bicarbonate buffers the acid that builds up, which protects bones and growth.',
      'Hyperkalaemia treatment': 'Calcium stabilises the heart muscle straight away. Salbutamol and insulin move potassium into cells, which buys time but does not remove it.',
      'Trimethoprim': 'It blocks folate production in bacteria and is concentrated in urine, which makes it a good choice for the urinary tract.',
    },
  },
};
