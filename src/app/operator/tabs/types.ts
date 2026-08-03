import type { Derived, RangeKey } from '@/lib/operator/fitness/derive';
import type { OperatorSettings, OperatorSnapshot } from '@/lib/operator/types';
import type { Unit } from '../components/format';

/** Posting helper shared by every control that writes. */
export interface Logger {
  busy: boolean;
  /** Merge partial metrics into a day. Only the fields passed are written. */
  saveDay: (date: string, fields: Record<string, number>) => Promise<boolean>;
  saveWeight: (date: string, weightKg: number) => Promise<boolean>;
  /** Merge partial fields into the single operator_settings row. */
  saveSettings: (fields: Record<string, number | string>) => Promise<boolean>;
  /** Append one set to the day's session of the given type (default Strength). */
  logSet: (date: string, move: string, loadKg: number, reps: number, type?: string) => Promise<boolean>;
}

/* Lives in its own module rather than beside the dashboard component so
   the tabs can type their props without importing their own parent. */
export interface TabProps {
  data: Derived;
  settings: OperatorSettings;
  unit: Unit;
  logger: Logger;
  snapshot: OperatorSnapshot;
  range: RangeKey;
  setRange: (range: RangeKey) => void;
}
