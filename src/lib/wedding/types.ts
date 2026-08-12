/* Shapes for the wedding hub. camelCase this side of the wire; the
   snake_case Supabase rows are mapped in data.ts. */

export interface WeddingSettings {
  brideName: string;
  partnerName: string;
  /** ISO day, or null if not set yet. */
  weddingDate: string | null;
  venue: string;
  henDate: string | null;
  henLocation: string;
  /** What the maid of honour has committed to spend, null if uncapped. */
  budgetCap: number | null;
  currency: string;
}

export interface WeddingTask {
  id: string;
  title: string;
  phase: string;
  dueDate: string | null;
  done: boolean;
  isHen: boolean;
  notes: string | null;
  sortOrder: number;
}

export interface WeddingContact {
  id: string;
  name: string;
  kind: 'party' | 'vendor';
  role: string;
  phone: string | null;
  email: string | null;
  detail: string | null;
  attendingHen: boolean;
}

export interface WeddingCost {
  id: string;
  label: string;
  amount: number;
  payer: string;
  paid: boolean;
  isHen: boolean;
  dueDate: string | null;
}

export interface WeddingSnapshot {
  generatedAt: string;
  /** True when the wedding_* tables have not been created yet. */
  setupRequired: boolean;
  settings: WeddingSettings;
  tasks: WeddingTask[];
  contacts: WeddingContact[];
  costs: WeddingCost[];
}

export const DEFAULT_WEDDING_SETTINGS: WeddingSettings = {
  brideName: '',
  partnerName: '',
  weddingDate: null,
  venue: '',
  henDate: null,
  henLocation: '',
  budgetCap: null,
  currency: 'GBP',
};

/* The phases a maid-of-honour checklist tends to fall into, ordered
   from furthest out to the day itself. Tasks carry free-text phases, so
   anything unrecognised sorts to the end rather than being dropped. */
export const TASK_PHASES = [
  'Early planning',
  'Six months out',
  'Three months out',
  'One month out',
  'Week of',
  'On the day',
  'Anytime',
] as const;
