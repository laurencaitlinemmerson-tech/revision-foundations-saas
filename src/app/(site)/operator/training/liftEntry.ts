'use client';

import { useCallback, useState } from 'react';
import { storedOperatorPassword } from '../OperatorGate';

/**
 * Logging a lift.
 *
 * Apple Health records that a session happened, not what was lifted in it, so
 * sets and loads have to be typed. This is the only place on the dashboard where
 * that happens, and it writes to the same table the strength score, the volume
 * totals and the personal bests already read from — nothing new has to be taught
 * about the data once it is in.
 */

export type SetEntry = { reps: number; weightKg: number };

export type LiftEntry = {
  save: (input: { performedOn: string; exercise: string; sets: SetEntry[]; note?: string | null }) => Promise<boolean>;
  saving: boolean;
  /** The last thing that went wrong, in words, or null. */
  error: string | null;
  /** The exercise most recently saved, so the form can confirm it. */
  lastSaved: string | null;
};

export function useLiftEntry(onSaved: () => void): LiftEntry {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const save = useCallback<LiftEntry['save']>(async ({ performedOn, exercise, sets, note = null }) => {
    const clean = sets.filter((s) => s.reps > 0);
    if (!exercise.trim()) { setError('Give the movement a name.'); return false; }
    if (!clean.length) { setError('A lift needs at least one set with reps in it.'); return false; }

    const pw = storedOperatorPassword();
    if (!pw) { setError('Locked — unlock the dashboard first.'); return false; }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/operator/lifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-operator-pw': pw },
        body: JSON.stringify({ performedOn, exercise: exercise.trim(), sets: clean, note }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { setup_required?: boolean };
        setError(body.setup_required
          ? 'The lift table has not been created yet — run supabase-operator-lifts.sql.'
          : 'That did not save. Try again.');
        return false;
      }
      setLastSaved(exercise.trim());
      // Everything downstream reads lifts from the same fetch, so one refresh
      // updates the score, the volume and the bests together.
      onSaved();
      return true;
    } catch {
      setError('That did not save. Try again.');
      return false;
    } finally {
      setSaving(false);
    }
  }, [onSaved]);

  return { save, saving, error, lastSaved };
}
