'use client';

import { useMemo, useState } from 'react';
import { storedOperatorPassword } from '../OperatorGate';
import type { Lift } from './data';

/**
 * The lift log's entry form.
 *
 * Everything else on the dashboard is read from Apple Health, which does not
 * record sets, reps or load. Total weight moved, per-session set detail and
 * per-movement bests all depend on this, so it is the one thing typed in.
 *
 * Sets are entered as `reps x weight` pairs — "4x62.5" or "4 x 62.5" — because
 * that is how they are written in a notebook between sets.
 */

const INK = '#1B2733';
const MUTED = '#6E7A88';
const GOLD = '#17365D';
const LINE = 'rgba(27,39,51,0.14)';

type Parsed = { reps: number; weightKg: number };

/** "4x62.5, 3x60" or "4x62.5 3x60" -> individual sets. */
export function parseSets(input: string): Parsed[] {
  const out: Parsed[] = [];
  for (const chunk of input.split(/[,;\n]+/)) {
    const m = chunk.trim().match(/^(\d+)\s*[x×*]\s*([\d.]+)$/i);
    if (!m) continue;
    const count = parseInt(m[1], 10);
    const weightKg = parseFloat(m[2]);
    if (!Number.isFinite(count) || !Number.isFinite(weightKg)) continue;
    // "4x62.5" means four sets at 62.5, which is how it is said aloud.
    for (let i = 0; i < Math.min(count, 20); i++) out.push({ reps: 1, weightKg });
  }
  return out;
}

/** "62.5 x 6,6,5" -> three sets at that load for those rep counts. */
export function parseRepScheme(exerciseLine: string): Parsed[] | null {
  const m = exerciseLine.trim().match(/^([\d.]+)\s*[x×*]\s*([\d,\s]+)$/);
  if (!m) return null;
  const weightKg = parseFloat(m[1]);
  const reps = m[2].split(/[,\s]+/).map((r) => parseInt(r, 10)).filter((n) => Number.isFinite(n) && n > 0);
  if (!Number.isFinite(weightKg) || !reps.length) return null;
  return reps.map((r) => ({ reps: r, weightKg }));
}

export default function LiftLogger({
  lifts,
  onSaved,
}: {
  lifts: Lift[] | null;
  onSaved: () => void;
}) {
  const [exercise, setExercise] = useState('');
  const [setsText, setSetsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => parseRepScheme(setsText) ?? parseSets(setsText), [setsText]);
  const volume = parsed.reduce((a, s) => a + s.reps * s.weightKg, 0);

  // Offer the movements already logged, so naming stays consistent enough for
  // per-movement bests to group correctly.
  const known = useMemo(
    () => [...new Set((lifts ?? []).map((l) => l.exercise))].sort(),
    [lifts],
  );

  const submit = async () => {
    if (!exercise.trim() || !parsed.length) return;
    setSaving(true);
    setError(null);
    const pw = storedOperatorPassword();
    try {
      const res = await fetch('/api/operator/lifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-operator-pw': pw ?? '' },
        body: JSON.stringify({
          performedOn: new Date().toISOString().slice(0, 10),
          exercise: exercise.trim(),
          sets: parsed,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { setup_required?: boolean };
        setError(body.setup_required
          ? 'The lift table is not set up yet — run supabase-operator-lifts.sql.'
          : 'Could not save that. Try again.');
        return;
      }
      setExercise('');
      setSetsText('');
      onSaved();
    } catch {
      setError('Could not reach the server.');
    } finally {
      setSaving(false);
    }
  };

  const field: React.CSSProperties = {
    padding: '11px 13px',
    border: `0.5px solid ${LINE}`,
    borderRadius: 8,
    background: '#FFFFFF',
    fontSize: 13.5,
    color: INK,
    outline: 'none',
    minWidth: 0,
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr) auto', gap: 10, alignItems: 'stretch' }}>
        <input
          list="lift-known"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Back squat"
          aria-label="Exercise"
          style={field}
        />
        <datalist id="lift-known">
          {known.map((k) => <option key={k} value={k} />)}
        </datalist>
        <input
          value={setsText}
          onChange={(e) => setSetsText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') void submit(); }}
          placeholder="62.5 × 6,6,5"
          aria-label="Sets"
          style={field}
        />
        <button
          type="button"
          onClick={() => void submit()}
          disabled={saving || !exercise.trim() || !parsed.length}
          style={{
            padding: '11px 20px', borderRadius: 8, border: 0, cursor: 'pointer',
            background: INK, color: '#FFFFFF', fontSize: 12.5,
            opacity: saving || !exercise.trim() || !parsed.length ? 0.4 : 1,
          }}
        >
          {saving ? 'Saving…' : 'Log →'}
        </button>
      </div>

      <p style={{ margin: '9px 0 0', fontSize: 11.5, color: MUTED, lineHeight: 1.5 }}>
        {parsed.length ? (
          <>
            {parsed.length} set{parsed.length === 1 ? '' : 's'} ·{' '}
            <span style={{ color: GOLD }}>{Math.round(volume).toLocaleString()} kg</span> moved
          </>
        ) : (
          <>Write it as load × reps — <code>62.5 × 6,6,5</code> is three sets at 62.5 kg.</>
        )}
      </p>

      {error && <p style={{ margin: '8px 0 0', fontSize: 11.5, color: '#C0492F' }}>{error}</p>}
    </div>
  );
}
