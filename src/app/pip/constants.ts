export const PIP_TOKEN = process.env.NEXT_PUBLIC_PIP_TOKEN ?? '';

export type AreaOption = 'fine' | 'some-trouble' | 'real-struggle';

export type Area = {
  id: string;
  name: string;
  subtitle: string;
};

export const AREAS: Area[] = [
  { id: 'cooking', name: 'Cooking a meal', subtitle: 'planning & cooking safely from scratch' },
  { id: 'eating', name: 'Eating & drinking', subtitle: 'managing food once it’s in front of her' },
  { id: 'medication', name: 'Medication & treatments', subtitle: 'remembering, organising, taking them' },
  { id: 'washing', name: 'Washing & bathing', subtitle: 'incl. getting in/out safely' },
  { id: 'toilet', name: 'Using the toilet', subtitle: 'getting there, managing it' },
  { id: 'dressing', name: 'Getting dressed', subtitle: 'fastenings, choosing clothes, facing it' },
  { id: 'talking', name: 'Talking & being understood', subtitle: 'esp. when tired, unwell or anxious' },
  { id: 'reading', name: 'Reading & taking it in', subtitle: 'letters, forms, instructions' },
  { id: 'social', name: 'Being around people', subtitle: 'and the cost afterwards' },
  { id: 'money', name: 'Money & budgeting', subtitle: 'bills, spending, decisions' },
  { id: 'journeys', name: 'Journeys', subtitle: 'planning & going somewhere, esp. alone' },
  { id: 'walking', name: 'Walking', subtitle: 'how far before pain / needing to stop' },
];

export const OPTIONS: AreaOption[] = ['fine', 'some-trouble', 'real-struggle'];

export const OPTION_LABELS: Record<AreaOption, string> = {
  fine: 'Fine',
  'some-trouble': 'Some trouble',
  'real-struggle': 'Real struggle',
};

export const OPTION_COLORS: Record<AreaOption, string> = {
  fine: '#5B7A99',
  'some-trouble': '#C0607F',
  'real-struggle': '#A8364F',
};

export const OPTION_BG: Record<AreaOption, string> = {
  fine: '#EDF2F6',
  'some-trouble': '#FBECF1',
  'real-struggle': '#F8E3E8',
};

export const ACCENT = '#C0607F';
