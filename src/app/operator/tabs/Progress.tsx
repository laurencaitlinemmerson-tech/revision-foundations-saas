'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fmtLongDate, fmtMonth, fmtNumber, toUnit } from '../components/format';
import { Card } from '../components/ui';
import { isoDay } from '@/lib/operator/fitness/derive';
import type { ProgressPhoto } from '@/lib/operator/types';
import type { TabProps } from './types';

/* Four fixed frames rather than a free-form gallery: the comparison
   only means anything when the shots are spaced and repeatable. */
const FRAMES = [
  { slot: 'start', label: 'Starting out' },
  { slot: 'month-1', label: 'Month one' },
  { slot: 'month-3', label: 'Month three' },
  { slot: 'latest', label: 'Most recent' },
];

function PhotoFrame({
  slot,
  label,
  photo,
  weightKg,
  unit,
  onChanged,
}: {
  slot: string;
  label: string;
  photo: ProgressPhoto | undefined;
  weightKg: number | null;
  unit: 'kg' | 'lb';
  onChanged: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('slot', slot);
      form.append('date', isoDay(new Date()));
      if (weightKg) form.append('weight', String(weightKg));

      const response = await fetch('/api/operator/photos', { method: 'POST', body: form });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        setError(
          detail?.error === 'not_configured'
            ? 'Supabase not configured'
            : detail?.error === 'too_large'
              ? 'Image is over 8 MB'
              : 'Upload failed — is the operator-photos bucket created?',
        );
        return;
      }
      onChanged();
    } catch {
      setError('Could not reach the server');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div
        className="op-photo-frame"
        role="button"
        tabIndex={0}
        aria-label={photo?.url ? `Replace ${label} photo` : `Add ${label} photo`}
        onClick={() => input.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            input.current?.click();
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
      >
        {photo?.url ? (
          // eslint-disable-next-line @next/next/no-img-element -- signed, short-lived storage URL
          <img src={photo.url} alt={`${label} progress photo`} />
        ) : (
          <div className="op-photo-empty">
            <span aria-hidden="true">＋</span>
            {busy ? 'Uploading…' : 'Drop a photo or click to browse'}
          </div>
        )}
      </div>

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
          event.target.value = '';
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
        <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>
          {photo ? fmtLongDate(photo.date) : label}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>
          {photo?.weightKg ? `${fmtNumber(toUnit(photo.weightKg, unit), 1)}` : '—'}
        </span>
      </div>
      {error ? (
        <div style={{ fontSize: 10.5, color: 'var(--critical-ink)', marginTop: 4 }}>{error}</div>
      ) : null}
    </div>
  );
}

export default function Progress({ data, settings, unit, snapshot }: TabProps) {
  const router = useRouter();

  const first = data.first;
  const latest = data.latest;
  const lost = first && latest ? first.weight - latest.weight : null;
  const toGo = latest ? latest.weight - settings.targetWeightKg : null;
  const totalToLose = first ? first.weight - settings.targetWeightKg : null;
  const pct =
    lost !== null && totalToLose && totalToLose > 0
      ? Math.min(100, Math.max(0, (lost / totalToLose) * 100))
      : 0;

  // Month-by-month change, from the first to the last reading in each month.
  const byMonth = new Map<string, { first: number; last: number }>();
  for (const day of data.days) {
    if (day.weight === null) continue;
    const month = day.date.slice(0, 7);
    const entry = byMonth.get(month);
    if (entry) entry.last = day.weight;
    else byMonth.set(month, { first: day.weight, last: day.weight });
  }
  const monthly = [...byMonth.entries()].map(([month, v]) => ({
    month,
    delta: v.last - v.first,
  }));
  const maxSwing = Math.max(0.1, ...monthly.map((m) => Math.abs(m.delta)));

  const milestones = totalToLose && totalToLose > 0
    ? Array.from({ length: Math.min(8, Math.ceil(totalToLose)) }, (_, i) => {
        const kg = i + 1;
        return { kg, done: lost !== null && lost >= kg };
      })
    : [];

  const photoBySlot = new Map(snapshot.photos.map((p) => [p.slot, p]));

  return (
    <div className="op-stack">
      <Card>
        <div
          className="op-grid"
          style={{ gridTemplateColumns: 'auto minmax(0, 1fr)', gap: 40, alignItems: 'center' }}
        >
          <div>
            <div className="op-hero-label">Lost so far</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(44px, 6vw, 68px)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.03em',
                  color: 'var(--series-1)',
                }}
              >
                {lost === null ? '—' : fmtNumber(Math.abs(toUnit(lost, unit) ?? 0), 1)}
              </span>
              <span className="op-hero-unit">{unit}</span>
            </div>
            <p style={{ marginTop: 10, fontSize: 13, color: 'var(--muted)', maxWidth: '26ch' }}>
              {first ? `Since ${fmtLongDate(first.date)}.` : 'No readings yet.'}{' '}
              {toGo !== null && toGo > 0
                ? `${fmtNumber(toUnit(toGo, unit), 1)} ${unit} to go.`
                : toGo !== null
                  ? 'Goal reached.'
                  : ''}
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--faint)', marginBottom: 10 }}>
              <span>{first ? `${fmtNumber(toUnit(first.weight, unit), 1)} ${unit}` : '—'}</span>
              <span>
                {Math.round(pct)}% of the way to {fmtNumber(toUnit(settings.targetWeightKg, unit), 1)} {unit}
              </span>
            </div>
            <div
              style={{ position: 'relative', height: 14, borderRadius: 999, background: 'var(--track)', overflow: 'hidden' }}
              role="meter"
              aria-valuenow={Math.round(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progress toward goal weight"
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, var(--series-1), var(--series-2))',
                  transition: 'width 0.6s var(--ease)',
                }}
              />
            </div>

            {milestones.length ? (
              <div style={{ display: 'flex', marginTop: 14, gap: 8, flexWrap: 'wrap' }}>
                {milestones.map((m) => (
                  <span
                    key={m.kg}
                    className="op-chip"
                    data-tone={m.done ? 'good' : 'flat'}
                    title={m.done ? 'Reached' : 'Still ahead'}
                  >
                    {m.done ? '✓ ' : ''}
                    {fmtNumber(toUnit(m.kg, unit), 0)} {unit}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <Card
        title="Progress pictures"
        sub="Same light, same time of day, and the comparison actually means something."
        action={<span className="op-chip">private to you</span>}
      >
        <div className="op-grid op-grid-4">
          {FRAMES.map((frame) => (
            <PhotoFrame
              key={frame.slot}
              slot={frame.slot}
              label={frame.label}
              photo={photoBySlot.get(frame.slot)}
              weightKg={latest?.weight ?? null}
              unit={unit}
              onChanged={() => router.refresh()}
            />
          ))}
        </div>
        <p style={{ marginTop: 14, fontSize: 11.5, color: 'var(--muted)' }}>
          Images go to a private Supabase bucket and are shown through short-lived signed links —
          never publicly addressable.
        </p>
      </Card>

      <Card title="Month by month" sub="Change from the first to the last weigh-in of each month.">
        {monthly.length ? (
          monthly.map((m) => (
            <div
              key={m.month}
              style={{
                display: 'grid',
                gridTemplateColumns: '78px minmax(0, 1fr) auto',
                gap: 14,
                alignItems: 'center',
                padding: '11px 0',
                borderTop: '0.5px solid var(--hairline)',
              }}
            >
              <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{fmtMonth(m.month)}</span>
              <span className="op-bar">
                <span
                  style={{
                    width: `${(Math.abs(m.delta) / maxSwing) * 100}%`,
                    background: m.delta <= 0 ? 'var(--series-1)' : 'var(--series-2)',
                  }}
                />
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 17,
                  minWidth: 68,
                  textAlign: 'right',
                  color: m.delta <= 0 ? 'var(--good-ink)' : 'var(--critical-ink)',
                }}
              >
                {m.delta > 0 ? '+' : '−'}
                {fmtNumber(Math.abs(toUnit(m.delta, unit) ?? 0), 1)} {unit}
              </span>
            </div>
          ))
        ) : (
          <p className="op-empty">Not enough weigh-ins yet to break down by month.</p>
        )}
      </Card>
    </div>
  );
}
