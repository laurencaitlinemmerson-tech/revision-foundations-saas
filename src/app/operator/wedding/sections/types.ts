import type { PhaseGroup, WeddingSummary } from '@/lib/wedding/derive';
import type { WeddingSnapshot } from '@/lib/wedding/types';

/** Every write the hub can make, shared by all sections. */
export interface WeddingWriter {
  busy: boolean;
  /** Omit `id` to create, pass it to update. */
  save: (
    collection: 'tasks' | 'contacts' | 'costs' | 'settings',
    fields: Record<string, unknown>,
    id?: string,
  ) => Promise<boolean>;
  remove: (collection: 'tasks' | 'contacts' | 'costs', id: string) => Promise<boolean>;
}

export interface SectionProps {
  snapshot: WeddingSnapshot;
  summary: WeddingSummary;
  writer: WeddingWriter;
  /** Wedding tasks (not hen) already grouped into phases. */
  phases: PhaseGroup[];
}
