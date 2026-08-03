'use client';

import { useMemo, useState } from 'react';
import { fmtDate, fmtDuration, fmtNumber } from '../components/format';
import { Card } from '../components/ui';
import { compareToAnimals, fmtAnimalCount } from '../components/animals';
import { isoDay } from '@/lib/operator/fitness/derive';
import type { Workout } from '@/lib/operator/types';
import type { TabProps } from './types';

/* Fixed slot order — a training type keeps its colour whatever the range. */
const TYPE_COLORS = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
];

/** One synthesized detail line for a workout that has no logged sets —
 *  everything Health actually gives us for a cardio session. */
function autoDetail(workout: Workout): string | null {
  const bits: string[] = [];
  if (workout.distanceKm) bits.push(`${fmtNumber(workout.distanceKm, 1)} km`);
  if (workout.durationMin) bits.push(fmtDuration(workout.durationMin));
  if (workout.avgHr) bits.push(`${workout.avgHr} bpm avg`);
  return bits.length ? bits.join(' · ') : null;
}

function AddSetForm({
  onSubmit,
  busy,
}: {
  onSubmit: (move: string, loadKg: number, reps: number) => void;
  busy: boolean;
}) {
  const [move, setMove] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');

  const submit = () => {
    const loadKg = Number(load);
    const repCount = Number(reps);
    if (!move.trim() || !Number.isFinite(loadKg) || loadKg <= 0 || !Number.isInteger(repCount) || repCount <= 0) {
      return;
    }
    onSubmit(move.trim(), loadKg, repCount);
    setMove('');
    setLoad('');
    setReps('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 84px 64px auto', gap: 8, marginTop: 10 }}>
      <input
        className="op-input"
        style={{ fontSize: 13, padding: '9px 12px' }}
        placeholder="Exercise"
        value={move}
        onChange={(event) => setMove(event.target.value)}
        aria-label="Exercise"
      />
      <input
        className="op-input"
        style={{ fontSize: 13, padding: '9px 12px' }}
        placeholder="kg"
        inputMode="decimal"
        value={load}
        onChange={(event) => setLoad(event.target.value)}
        aria-label="Load in kilograms"
      />
      <input
        className="op-input"
        style={{ fontSize: 13, padding: '9px 12px' }}
        placeholder="reps"
        inputMode="numeric"
        value={reps}
        onChange={(event) => setReps(event.target.value)}
        aria-label="Reps"
      />
      <button type="button" className="op-btn" disabled={busy} onClick={submit}>
        Add
      </button>
    </div>
  );
}

export default function Training({ data, logger }: TabProps) {
  const { training } = data;
  const [openId, setOpenId] = useState<string | null>(null);

  const typeRows = useMemo(() => {
    const top = training.byType.slice(0, 5);
    const rest = training.byType.slice(5);
    return rest.length
      ? [
          ...top,
          {
            type: 'Other',
            sessions: rest.reduce((a, r) => a + r.sessions, 0),
            minutes: rest.reduce((a, r) => a + r.minutes, 0),
            kcal: rest.reduce((a, r) => a + r.kcal, 0),
          },
        ]
      : top;
  }, [training.byType]);

  const colorForType = (type: string) => {
    const index = typeRows.findIndex((row) => row.type === type);
    return TYPE_COLORS[index] ?? 'var(--axis)';
  };

  const weeklyLoad = training.weekly.slice(-8);
  const maxKcal = Math.max(1, ...weeklyLoad.map((w) => w.kcal));

  const comparison = compareToAnimals(training.volumeKg);
  const unitSquares = comparison ? Math.min(24, Math.max(1, Math.round(comparison.count))) : 0;

  // Cardio's own "personal bests" — the closest a duration/distance-only
  // sport gets to a PR, since HealthKit carries no set data for it.
  const cardioBests = useMemo(() => {
    const withDistance = training.recent.filter((w) => w.distanceKm);
    const longest = withDistance.length
      ? withDistance.reduce((max, w) => ((w.distanceKm ?? 0) > (max.distanceKm ?? 0) ? w : max))
      : null;
    const biggestBurn = training.recent.length
      ? training.recent.reduce((max, w) => ((w.energyKcal ?? 0) > (max.energyKcal ?? 0) ? w : max))
      : null;
    const bests: { move: string; value: string }[] = [];
    if (longest?.distanceKm) bests.push({ move: `Longest ${longest.type.toLowerCase()}`, value: `${fmtNumber(longest.distanceKm, 1)} km` });
    if (biggestBurn?.energyKcal) bests.push({ move: `Biggest burn (${biggestBurn.type.toLowerCase()})`, value: `${fmtNumber(biggestBurn.energyKcal)} kcal` });
    return bests;
  }, [training.recent]);

  const liftBests = training.bests.slice(0, 4).map((b) => ({
    move: `${b.move} · ${b.reps} rep${b.reps === 1 ? '' : 's'}`,
    value: `${fmtNumber(b.loadKg, 1)} kg`,
  }));

  const bests = [...liftBests, ...cardioBests].slice(0, 5);

  return (
    <div className="op-stack">
      <Card
        title="Total weight moved"
        sub="Every rep, every set, added up — sets × reps × load."
      >
        {comparison ? (
          <div
            className="op-grid"
            style={{ gridTemplateColumns: 'auto auto minmax(0,1fr)', gap: 34, alignItems: 'center' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 52, lineHeight: 0.9, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
                  {fmtNumber(training.volumeKg)}
                </span>
                <span className="op-hero-unit" style={{ fontSize: 18 }}>kg</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                across {training.recent.reduce((a, w) => a + w.sets.length, 0)} logged sets
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: '50%',
                  background: 'var(--card-tint)',
                  border: '0.5px solid var(--line-violet)',
                  flex: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--violet)' }}>
                  {fmtNumber(comparison.best.kg)}
                </span>
                <span style={{ fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mauve)' }}>
                  kg each
                </span>
              </div>
              <div>
                <div className="op-hero-stat-label">that is about</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--ink)', letterSpacing: '-0.02em', marginTop: 4 }}>
                  {fmtAnimalCount(comparison.count)}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: 'var(--violet)' }}>
                  {comparison.best.name}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 4 }}>
                  one {comparison.best.name.replace(/s$/, '')} ≈ {fmtNumber(comparison.best.kg)} kg
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 320, marginBottom: 12 }}>
                {Array.from({ length: unitSquares }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 5,
                      display: 'inline-block',
                      background: i % 2 ? 'var(--blush)' : 'var(--lilac)',
                      opacity: i < comparison.count ? 1 : 0.35,
                    }}
                  />
                ))}
              </div>
              {comparison.scale.map((row) => (
                <div key={row.ref.name} style={{ display: 'grid', gridTemplateColumns: '104px minmax(0,1fr) auto', gap: 10, alignItems: 'center', padding: '4px 0' }}>
                  <span style={{ fontSize: 11, color: row.isBest ? 'var(--violet)' : 'var(--muted)' }}>{row.ref.name}</span>
                  <span className="op-bar" style={{ height: 8 }}>
                    <span style={{ width: `${row.barWidthPct}%`, background: row.isBest ? 'var(--violet)' : 'var(--lilac)' }} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, minWidth: 52, textAlign: 'right', color: row.isBest ? 'var(--violet)' : 'var(--muted)' }}>
                    {fmtAnimalCount(row.count)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="op-empty">Log a set below to see this — total weight moved needs at least one logged set.</p>
        )}
      </Card>

      <div className="op-grid op-grid-wide" style={{ alignItems: 'start' }}>
        <Card title="Sessions" sub="Tap a session for the set detail; open a strength session to log one.">
          {training.recent.length ? (
            training.recent.map((workout) => {
              const isOpen = openId === workout.id;
              const isStrength = workout.sets.length > 0 || workout.type.toLowerCase().includes('strength');
              const detail = autoDetail(workout);

              return (
                <div key={workout.id} style={{ borderTop: '0.5px solid var(--hairline)' }}>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : workout.id)}
                    style={{
                      width: '100%',
                      display: 'grid',
                      gridTemplateColumns: 'auto minmax(0,1fr) auto auto',
                      gap: 14,
                      alignItems: 'center',
                      padding: '14px 2px',
                      background: 'transparent',
                      border: 0,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: 'var(--card-tint)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 10,
                        letterSpacing: '0.06em',
                        color: 'var(--mauve)',
                      }}
                    >
                      {fmtDate(isoDay(workout.startedAt)).split(' ')[0]}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: 'var(--ink)' }}>
                        <span className="op-swatch" style={{ background: colorForType(workout.type) }} />
                        {workout.type}
                      </span>
                      <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                        {workout.sets.length ? `${workout.sets.length} sets logged` : detail ?? 'No detail synced'}
                      </span>
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--ink)' }}>
                      {workout.energyKcal ? fmtNumber(workout.energyKcal) : '—'}
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}> kcal</span>
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen ? (
                    <div style={{ padding: '0 2px 16px' }}>
                      {workout.sets.map((set, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0,1fr) auto auto',
                            gap: 12,
                            padding: '7px 0',
                            borderTop: '0.5px dashed var(--hairline)',
                            fontSize: 12.5,
                            color: 'var(--body)',
                          }}
                        >
                          <span>{set.move}</span>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink)' }}>
                            {fmtNumber(set.loadKg, 1)} kg
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{set.reps} reps</span>
                        </div>
                      ))}
                      {!workout.sets.length && detail ? (
                        <div style={{ fontSize: 12, color: 'var(--muted)', padding: '7px 0', borderTop: '0.5px dashed var(--hairline)' }}>
                          {detail}
                        </div>
                      ) : null}
                      {isStrength ? (
                        <AddSetForm
                          busy={logger.busy}
                          onSubmit={(move, loadKg, reps) =>
                            logger.logSet(isoDay(workout.startedAt), move, loadKg, reps, workout.type)
                          }
                        />
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <p className="op-empty">No sessions logged in this range.</p>
          )}
        </Card>

        <div className="op-stack">
          <Card title="Weekly load" sub="Active energy, kcal per week">
            {weeklyLoad.length ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 130 }}>
                {weeklyLoad.map((week, index) => (
                  <div
                    key={week.weekStart}
                    title={`${fmtNumber(week.kcal)} kcal active energy`}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: `${(week.kcal / maxKcal) * 100}%`,
                        borderRadius: '8px 8px 0 0',
                        background: index === weeklyLoad.length - 1 ? 'var(--violet)' : 'var(--lilac)',
                        transition: 'height 500ms var(--ease)',
                        minHeight: 2,
                      }}
                    />
                    <span style={{ fontSize: 9.5, letterSpacing: '0.1em', color: 'var(--muted)' }}>
                      {fmtDate(week.weekStart).split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="op-empty">No sessions logged in this range.</p>
            )}
          </Card>

          <Card soft title="Recent bests">
            {bests.length ? (
              bests.map((pr) => (
                <div key={pr.move} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderTop: '0.5px solid var(--hairline)' }}>
                  <span style={{ fontSize: 13, color: 'var(--body)' }}>{pr.move}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>{pr.value}</span>
                </div>
              ))
            ) : (
              <p className="op-note">Log a set or complete a synced session to see bests here.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
