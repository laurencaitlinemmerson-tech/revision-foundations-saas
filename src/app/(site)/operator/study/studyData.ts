/**
 * What there is to revise, and when each thing was taught.
 *
 * A snapshot from the Notion lecture notes (Pharmacology sessions are dated
 * there); the Nursing Process in Action topics are the hub deep dives. A topic
 * only enters the plan once it has been taught.
 */

export type Topic = {
  id: string;
  module: 'Pharmacology' | 'Nursing Process in Action';
  code: '5KNIA013' | '5KNIC012';
  title: string;
  /** Date the topic was (or will be) taught, ISO. */
  taught: string;
  /** Hub page to open when revising. */
  hub?: string;
};

export const EXAMS = {
  'Pharmacology': { date: '2027-01-14', label: 'Pharmacology MCQ' },
  'Nursing Process in Action': { date: '2027-05-18', label: 'Nursing Process in Action exam' },
} as const;

export const TOPICS: Topic[] = [
  // Pharmacology (5KNIA013), dates from the Notion lecture notes
  { id: 'ph-intro', module: 'Pharmacology', code: '5KNIA013', title: 'Introduction & drug formulation', taught: '2026-09-08' },
  { id: 'ph-abx', module: 'Pharmacology', code: '5KNIA013', title: 'Antibiotics', taught: '2026-09-08' },
  { id: 'ph-pd', module: 'Pharmacology', code: '5KNIA013', title: 'Pharmacodynamics', taught: '2026-09-08', hub: '/hub/resources/pharmacodynamics' },
  { id: 'ph-pk', module: 'Pharmacology', code: '5KNIA013', title: 'Pharmacokinetics', taught: '2026-09-15', hub: '/hub/resources/pharmacokinetics' },
  { id: 'ph-resp', module: 'Pharmacology', code: '5KNIA013', title: 'Respiratory pharmacology', taught: '2026-09-15' },
  { id: 'ph-cvs', module: 'Pharmacology', code: '5KNIA013', title: 'Cardiovascular pharmacology', taught: '2026-09-15' },
  { id: 'ph-gi', module: 'Pharmacology', code: '5KNIA013', title: 'GI tract pharmacology', taught: '2026-09-22' },
  { id: 'ph-diur', module: 'Pharmacology', code: '5KNIA013', title: 'Diuretics', taught: '2026-09-22' },
  { id: 'ph-antithromb', module: 'Pharmacology', code: '5KNIA013', title: 'Antithrombotics', taught: '2026-11-10' },
  { id: 'ph-adverse', module: 'Pharmacology', code: '5KNIA013', title: 'Adverse effects', taught: '2026-11-10' },
  { id: 'ph-cns', module: 'Pharmacology', code: '5KNIA013', title: 'Blood-brain barrier & CNS pharmacology', taught: '2026-11-17' },
  { id: 'ph-mh', module: 'Pharmacology', code: '5KNIA013', title: 'Mental health pharmacology', taught: '2026-11-17' },
  { id: 'ph-analg', module: 'Pharmacology', code: '5KNIA013', title: 'Analgesics', taught: '2026-11-24' },
  { id: 'ph-cancer', module: 'Pharmacology', code: '5KNIA013', title: 'Cancer therapy', taught: '2026-11-24' },
  { id: 'ph-diab', module: 'Pharmacology', code: '5KNIA013', title: 'Diabetes & thyroid', taught: '2026-12-01' },
  // Nursing Process in Action (5KNIC012): the hub deep dives that go with the module
  { id: 'np-trach', module: 'Nursing Process in Action', code: '5KNIC012', title: 'Tracheostomy care', taught: '2026-09-01', hub: '/hub/resources/tracheostomy-care' },
  { id: 'np-neuro', module: 'Nursing Process in Action', code: '5KNIC012', title: 'Disability assessment & neuro observations', taught: '2026-09-01', hub: '/hub/resources/disability-assessment-neuro-observations' },
  { id: 'np-ecg', module: 'Nursing Process in Action', code: '5KNIC012', title: 'ECG & cardiac conduction', taught: '2026-09-01', hub: '/hub/resources/ecg-cardiac-conduction' },
  { id: 'np-chd', module: 'Nursing Process in Action', code: '5KNIC012', title: 'Congenital heart disease', taught: '2026-09-01', hub: '/hub/resources/congenital-heart-disease' },
  { id: 'np-resp', module: 'Nursing Process in Action', code: '5KNIC012', title: 'Common respiratory conditions', taught: '2026-09-01', hub: '/hub/resources/paediatric-respiratory-conditions' },
  { id: 'np-shock', module: 'Nursing Process in Action', code: '5KNIC012', title: 'Shock: recognition & management', taught: '2026-09-01', hub: '/hub/resources/shock-recognition-management' },
  { id: 'np-endo', module: 'Nursing Process in Action', code: '5KNIC012', title: 'Endocrine system', taught: '2026-09-01', hub: '/hub/resources/endocrine-system' },
];

/** 1 shaky, 2 okay, 3 solid: days until a topic is due for another look. */
export const REVIEW_DAYS: Record<1 | 2 | 3, number> = { 1: 2, 2: 5, 3: 12 };

export const CONFIDENCE_LABEL: Record<1 | 2 | 3, string> = { 1: 'Shaky', 2: 'Okay', 3: 'Solid' };
