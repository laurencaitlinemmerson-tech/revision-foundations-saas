export interface MockScenario {
  childName: string;
  age: string;
  presentingComplaint: string;
  duration: string;
  observations: { label: string; value: string }[];
  clinicalSigns: string[];
  diagnosis: string;
  familyContext: string;
}

export interface RevisionLink {
  label: string;
  href: string;
}

export interface MockQuestion {
  id: string;
  partLabel: string;
  number: number;
  title: string;
  prompt: string;
  wordGuide: string;
  toScoreHighly: string[];
  thinkAbout: string[];
  revisionLinks: RevisionLink[];
  answerStructure: string[];
}

export interface MockExam {
  id: string;
  system: string;
  title: string;
  condition: string;
  description: string;
  scenario: MockScenario;
  whatThisMockTests: string[];
  questionsPartA: MockQuestion[];
  questionsPartB: MockQuestion[];
  sentenceBank: string[];
  whatGetsYouAFirst: string[];
  commonMistakes: string[];
  howToStructure: string[];
}

export interface BodySystem {
  id: string;
  label: string;
  description: string;
  mockCount: number;
}

export const bodySystems: BodySystem[] = [
  { id: 'respiratory', label: 'Respiratory', description: 'Bronchiolitis, asthma, pneumonia, and airway management scenarios.', mockCount: 1 },
  { id: 'gastrointestinal', label: 'Gastrointestinal', description: 'Gastroenteritis, appendicitis, and fluid management scenarios.', mockCount: 0 },
  { id: 'cardiovascular', label: 'Cardiovascular', description: 'Heart failure, congenital defects, and shock scenarios.', mockCount: 0 },
  { id: 'neurological', label: 'Neurological', description: 'Seizures, meningitis, and neurological assessment scenarios.', mockCount: 0 },
  { id: 'endocrine', label: 'Endocrine', description: 'Diabetic ketoacidosis, thyroid, and metabolic scenarios.', mockCount: 0 },
  { id: 'renal', label: 'Renal', description: 'Nephrotic syndrome, UTI, and fluid balance scenarios.', mockCount: 0 },
  { id: 'musculoskeletal', label: 'Musculoskeletal', description: 'Fractures, osteomyelitis, and mobility scenarios.', mockCount: 0 },
  { id: 'haematological', label: 'Haematological', description: 'Sickle cell, anaemia, and clotting disorder scenarios.', mockCount: 0 },
];
