'use client';

import {
  useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode,
} from 'react';
import {
  MAJOR_MUSCLES, MUSCLE_NAMES, WEEKLY_SETS,
  type MuscleBalance, type MuscleKey, type MuscleMap,
} from './muscleMap';
import {
  BLUE, BLUE_FILL, CARD, INK, MUTED, PINK, PINK_DEEP, PLUM, PLUM_SOFT, RULE, RULE_SOFT, SOFT, TINT,
  TRACK, TRACK_PREV,
} from './palette';

/**
 * The body, drawn from the lift log.
 *
 * "Last session" fills each muscle by what the most recent session asked of it:
 * plum where it did the work, soft plum where it helped, track grey where it
 * rested, with the movements set by set and a next-time target for each.
 *
 * "7 days" and "28 days" turn the same figures into a balance check: each muscle
 * is filled by its sets per week against the 10–20 range, so a muscle that is
 * being skipped shows up as pale before it shows up in the mirror.
 *
 * Colours follow the dashboard's rule — violet is you, pink a personal best,
 * blue the target — and every figure comes from `muscleMap.ts`.
 */

type View = 'session' | 'week' | 'month';

const nf = (n: number, d = 0) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
const display = (size: number, color = INK): CSSProperties => ({
  fontFamily: 'var(--font-display)', fontSize: size, fontWeight: 400,
  letterSpacing: '-0.015em', lineHeight: 1, color,
});
const eyebrow: CSSProperties = { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED };
const fmtDay = (iso: string, weekday = true) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', weekday
    ? { weekday: 'short', day: 'numeric', month: 'short' }
    : { day: 'numeric', month: 'short' });

type Shape =
  | { k: MuscleKey; t: 'e'; cx: number; cy: number; rx: number; ry: number }
  | { k: MuscleKey; t: 'p'; d: string }
  | { k: MuscleKey; t: 'r'; x: number; y: number; w: number; h: number };

/** Both figures share one silhouette; only the muscles laid over it differ. */
const SILHOUETTE = (
  <>
    <circle cx="100" cy="30" r="20" /><rect x="90" y="46" width="20" height="18" rx="6" />
    <rect x="64" y="64" width="72" height="132" rx="26" /><rect x="70" y="184" width="60" height="42" rx="18" />
    <rect x="38" y="70" width="26" height="140" rx="13" /><rect x="136" y="70" width="26" height="140" rx="13" />
    <rect x="68" y="212" width="31" height="186" rx="15" /><rect x="101" y="212" width="31" height="186" rx="15" />
  </>
);

const pair = (k: MuscleKey, cx: number, cy: number, rx: number, ry: number): Shape[] => [
  { k, t: 'e', cx, cy, rx, ry }, { k, t: 'e', cx: 200 - cx, cy, rx, ry },
];

const FRONT: Shape[] = [
  ...pair('deltsFront', 60, 82, 13, 14),
  ...pair('deltsSide', 50, 94, 6, 10),
  { k: 'chest', t: 'p', d: 'M99 74 C86 70 72 72 68 86 C68 102 82 112 99 110 Z' },
  { k: 'chest', t: 'p', d: 'M101 74 C114 70 128 72 132 86 C132 102 118 112 101 110 Z' },
  ...pair('biceps', 51, 126, 9, 20),
  ...pair('forearms', 49, 178, 8, 24),
  { k: 'abs', t: 'r', x: 87, y: 114, w: 26, h: 72 },
  ...pair('obliques', 76, 150, 9, 28),
  ...pair('quads', 84, 256, 13, 42),
  ...pair('adductors', 95, 236, 4, 20),
  ...pair('calves', 84, 352, 9, 30),
];

const BACK: Shape[] = [
  { k: 'traps', t: 'p', d: 'M100 54 L128 76 L114 92 L86 92 L72 76 Z' },
  ...pair('deltsRear', 60, 86, 14, 15),
  { k: 'midBack', t: 'p', d: 'M87 95 L113 95 L107 134 L93 134 Z' },
  { k: 'lats', t: 'p', d: 'M84 96 C70 112 70 150 92 178 L94 138 Z' },
  { k: 'lats', t: 'p', d: 'M116 96 C130 112 130 150 108 178 L106 138 Z' },
  ...pair('triceps', 51, 122, 9, 21),
  ...pair('forearms', 49, 178, 8, 24),
  { k: 'lowerBack', t: 'r', x: 89, y: 140, w: 22, h: 42 },
  ...pair('glutes', 86, 206, 15, 17),
  ...pair('hamstrings', 84, 266, 14, 40),
  ...pair('calves', 84, 346, 11, 30),
];

/** Sets a week against the 10–20 range: the band is the target, the bar is you. */
function RangeBar({ value }: { value: number }) {
  const max = 26;
  const pct = (n: number) => `${Math.min(100, (n / max) * 100)}%`;
  return (
    <div aria-hidden="true" style={{ position: 'relative', height: 8, background: TRACK }}>
      <span style={{ position: 'absolute', top: 0, bottom: 0, left: pct(WEEKLY_SETS.low), width: `calc(${pct(WEEKLY_SETS.high)} - ${pct(WEEKLY_SETS.low)})`, background: BLUE_FILL, borderLeft: `1px solid ${BLUE}`, borderRight: `1px solid ${BLUE}` }} />
      <span style={{ position: 'absolute', top: 2, bottom: 2, left: 0, width: pct(value), background: value >= WEEKLY_SETS.low ? PLUM : PLUM_SOFT }} />
    </div>
  );
}

export default function MuscleMapPanel({ m, children }: { m: MuscleMap; children?: ReactNode }) {
  const [view, setView] = useState<View>('session');
  const [hover, setHover] = useState<MuscleKey | null>(null);
  const [held, setHeld] = useState<MuscleKey | null>(null);
  const sel = held ?? hover;
  const bal: MuscleBalance | null = view === 'week' ? m.balance.week : view === 'month' ? m.balance.month : null;

  const role = (k: MuscleKey) => (m.load[k].primary ? 'primary' : m.load[k].secondary ? 'secondary' : 'rest');
  const fill = (k: MuscleKey) => {
    if (bal) return { none: TRACK_PREV, under: PLUM_SOFT, in: PLUM, over: PLUM }[bal.status[k]];
    return { primary: PLUM, secondary: PLUM_SOFT, rest: TRACK_PREV }[role(k)];
  };
  const describe = (k: MuscleKey) => {
    if (bal) {
      const w = bal.perWeek[k];
      return w ? `${nf(w, 1)} sets a week` : 'not trained';
    }
    return role(k) === 'primary' ? `worked, ${m.load[k].primary} sets` : role(k) === 'secondary' ? 'helped' : 'rested';
  };
  const toggle = (k: MuscleKey) => setHeld((h) => (h === k ? null : k));
  const switchView = (v: View) => { setView(v); setHeld(null); setHover(null); };

  const worked = (Object.keys(MUSCLE_NAMES) as MuscleKey[])
    .filter((k) => m.load[k].primary || m.load[k].secondary)
    .sort((a, b) => (m.load[b].primary * 2 + m.load[b].secondary) - (m.load[a].primary * 2 + m.load[a].secondary));

  const list = sel
    ? m.exercises.filter((e) => e.primary.includes(sel) || e.secondary.includes(sel))
    : m.exercises;

  const figure = (shapes: Shape[], label: string) => (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg viewBox="0 0 200 420" role="group" aria-label={`${label} of body`} style={{ width: '100%', maxWidth: 200, height: 'auto', display: 'block' }}>
        <g fill={TRACK}>{SILHOUETTE}</g>
        {shapes.map((s, i) => {
          const k = s.k;
          const key = `${k}-${i}`;
          const common = {
            fill: fill(k),
            opacity: sel && sel !== k ? 0.3 : 1,
            stroke: sel === k ? INK : CARD,
            strokeWidth: sel === k ? 2 : 1.5,
            tabIndex: 0,
            role: 'button',
            'aria-pressed': held === k,
            'aria-label': `${MUSCLE_NAMES[k]}, ${describe(k)}`,
            style: { cursor: 'pointer', transition: 'opacity .15s, fill .2s' } as CSSProperties,
            onPointerEnter: (e: PointerEvent) => { if (e.pointerType === 'mouse') setHover(k); },
            onPointerLeave: (e: PointerEvent) => { if (e.pointerType === 'mouse') setHover(null); },
            onClick: () => toggle(k),
            onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(k); } },
          };
          if (s.t === 'e') return <ellipse key={key} {...common} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} />;
          if (s.t === 'r') return <rect key={key} {...common} x={s.x} y={s.y} width={s.w} height={s.h} rx={8} />;
          return <path key={key} {...common} d={s.d} />;
        })}
      </svg>
      <figcaption style={{ ...eyebrow, fontSize: 9.5 }}>{label}</figcaption>
    </figure>
  );

  const legend = bal
    ? [['10+ sets a week', PLUM], ['Under 10', PLUM_SOFT], ['None', TRACK_PREV]]
    : [['Worked', PLUM], ['Helped', PLUM_SOFT], ['Rested', TRACK_PREV]];

  const stats: Array<[string, string, string?]> = bal
    ? [
      ['Sessions', nf(bal.sessions)],
      ['Sets', nf(bal.sets)],
      ['Moved', `${nf(bal.volumeKg)} kg`],
      ['In range', `${bal.inRange}/${MAJOR_MUSCLES.length}`],
    ]
    : [
      ['Movements', nf(m.totals.exercises)],
      ['Sets', nf(m.totals.sets)],
      ['Moved', `${nf(m.totals.volumeKg)} kg`],
      ['PBs', nf(m.totals.pbs), m.totals.pbs ? PINK : undefined],
    ];

  const tabs: Array<[View, string]> = [['session', 'Last session'], ['week', '7 days'], ['month', '28 days']];

  return (
    <section style={{ marginTop: 56, border: RULE, background: CARD, padding: 40 }} aria-labelledby="muscle-map-title">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', borderBottom: RULE, paddingBottom: 20 }}>
        <div>
          <div style={eyebrow}>
            {bal ? `${fmtDay(bal.from, false)} – ${fmtDay(bal.to, false)} · sets per week`
              : m.empty ? 'Last session' : `Last session · ${fmtDay(m.date!)}`}
          </div>
          <h2 id="muscle-map-title" style={{ ...display(28), margin: '10px 0 0' }}>
            {bal ? <>How it <em>balances</em></> : <>What it <em>hit</em></>}
          </h2>
        </div>
        {!m.empty && (
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {stats.map(([l, val, c]) => (
              <div key={l}>
                <div style={{ ...eyebrow, fontSize: 9.5 }}>{l}</div>
                <div style={{ ...display(26, c ?? INK), marginTop: 6 }}>{val}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!m.empty && (
        <div role="tablist" aria-label="Muscle map period" style={{ display: 'flex', gap: 0, marginTop: 20, border: RULE, width: 'fit-content', maxWidth: '100%' }}>
          {tabs.map(([v, label]) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => switchView(v)} style={{
              padding: '8px 16px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
              border: 'none', borderRight: v === 'month' ? 'none' : RULE, minHeight: 36,
              background: view === v ? INK : 'transparent', color: view === v ? CARD : SOFT,
            }}>{label}</button>
          ))}
        </div>
      )}

      {m.empty ? (
        <p style={{ fontSize: 13, color: SOFT, lineHeight: 1.7, margin: '24px 0 0', maxWidth: 560 }}>
          Nothing in the lift log yet. Log the sets from your next session below and the muscles it worked light up here.
        </p>
      ) : (
        <>
          <div className="training-pair" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 28, marginTop: 24 }}>
            <div style={{ background: TINT, border: RULE_SOFT, padding: '24px 12px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                {figure(FRONT, 'Front')}
                {figure(BACK, 'Back')}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap', fontSize: 11, color: SOFT }}>
                {legend.map(([l, c]) => (
                  <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />{l}
                  </span>
                ))}
              </div>
            </div>

            <div aria-live="polite" style={{ minWidth: 0 }}>
              {bal ? (
                <BalanceList bal={bal} sel={sel} held={held} onPick={toggle} onClear={() => setHeld(null)} />
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, borderBottom: RULE, paddingBottom: 12 }}>
                    <div>
                      <div style={eyebrow}>{sel ? (role(sel) === 'primary' ? 'Worked' : role(sel) === 'secondary' ? 'Helped' : 'Rested') : 'Point at a muscle'}</div>
                      <div style={{ ...display(22), marginTop: 6 }}>{sel ? MUSCLE_NAMES[sel] : 'Every movement'}</div>
                    </div>
                    {held && <ClearButton onClick={() => setHeld(null)} />}
                  </div>

                  {sel && !list.length && (
                    <p style={{ fontSize: 13, color: MUTED, fontStyle: 'italic', margin: '16px 0 0' }}>
                      Nothing in this session worked the {MUSCLE_NAMES[sel].toLowerCase()}.
                    </p>
                  )}

                  {list.map((e) => (
                    <div key={e.id} style={{ padding: '14px 0', borderBottom: RULE_SOFT }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13.5, color: INK }}>
                          {e.name}
                          {sel && (
                            <span style={{ ...eyebrow, fontSize: 9, marginLeft: 8, color: e.primary.includes(sel) ? PLUM : MUTED }}>
                              {e.primary.includes(sel) ? 'worked' : 'helped'}
                            </span>
                          )}
                        </span>
                        {e.pb && <span style={{ ...eyebrow, fontSize: 9.5, color: PINK_DEEP }}>PB · {nf(e.topSetKg, e.topSetKg % 1 ? 1 : 0)} kg</span>}
                        {!e.pb && e.firstLog && <span style={{ ...eyebrow, fontSize: 9.5 }}>First log</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                        {e.sets.map((s, i) => (
                          <span key={i} style={{
                            fontSize: 11.5, padding: '4px 8px', fontVariantNumeric: 'tabular-nums',
                            border: s.pb ? `1px solid ${PINK}` : RULE, color: s.pb ? PINK_DEEP : SOFT,
                          }}>{s.label}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', fontSize: 11.5, color: MUTED, marginTop: 6 }}>
                        <span>{e.sets.length} set{e.sets.length === 1 ? '' : 's'} · {nf(e.volumeKg)} kg moved · est. 1RM {nf(e.e1rmKg)} kg</span>
                        {e.next && <span style={{ color: BLUE }}>Next time: {e.next}</span>}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {!bal && worked.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div style={eyebrow}>Muscles, by sets</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {worked.map((k) => (
                  <button key={k} type="button" aria-pressed={held === k} onClick={() => toggle(k)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', cursor: 'pointer',
                    background: held === k ? TINT : 'transparent', border: held === k ? `1px solid ${PLUM}` : RULE,
                    fontSize: 12, color: INK,
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: fill(k) }} />
                    {MUSCLE_NAMES[k]}
                    <span style={{ color: MUTED, fontVariantNumeric: 'tabular-nums' }}>
                      {m.load[k].primary ? `${m.load[k].primary} sets` : 'assist'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!bal && (
            <div style={{ marginTop: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', borderBottom: RULE, paddingBottom: 10 }}>
                <div style={eyebrow}>Every set</div>
                <div style={{ fontSize: 11, color: MUTED }}>bar length is weight × reps · pink is a personal best</div>
              </div>
              {m.exercises.map((e) => (
                <div key={e.id} className="mm-row" style={{
                  display: 'grid', gridTemplateColumns: 'minmax(120px, 200px) 1fr auto', gap: 16, alignItems: 'center',
                  padding: '12px 0', borderBottom: RULE_SOFT,
                }}>
                  <div>
                    <div style={{ fontSize: 13, color: INK }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{nf(e.volumeKg)} kg</div>
                  </div>
                  <div role="img" aria-label={e.sets.map((s) => s.label + (s.pb ? ', personal best' : '')).join('; ')}
                    style={{ display: 'flex', gap: 3, height: 14, width: `${e.volumePct}%`, minWidth: 0 }}>
                    {e.sets.map((s, i) => (
                      <span key={i} title={s.label} style={{ flex: 1, background: s.pb ? PINK : PLUM_SOFT }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11.5, color: SOFT, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                    top {nf(e.topSetKg, e.topSetKg % 1 ? 1 : 0)} kg
                  </div>
                </div>
              ))}
            </div>
          )}

          {!bal && m.unmatched.length > 0 && (
            <p style={{ fontSize: 12, color: MUTED, fontStyle: 'italic', margin: '16px 0 0' }}>
              Not drawn on the body: {m.unmatched.join(', ')} — the name did not match a known movement.
            </p>
          )}

          <p style={{ fontSize: 12, color: MUTED, fontStyle: 'italic', margin: '20px 0 0', lineHeight: 1.7 }}>
            {bal
              ? `Sets per week: a set where the muscle did the work counts 1, a set where it helped counts half. Around ${WEEKLY_SETS.low}–${WEEKLY_SETS.high} sets a week is the range most hypertrophy guidance works to.${bal.coveredDays < bal.days ? ` The lift log only reaches back ${bal.coveredDays} days, so this averages over those.` : ''}`
              : 'Next time follows double progression: build to 12 reps at a weight, then add the smallest jump. A movement logged for the first time has nothing to beat, so it is not counted as a PB.'}
          </p>
        </>
      )}
      {children}
    </section>
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      background: 'none', border: RULE, padding: '6px 12px', fontSize: 11, color: SOFT, cursor: 'pointer',
    }}>Show all</button>
  );
}

/** The balance view's right-hand column: every major muscle against the range, or one muscle's sources. */
function BalanceList({ bal, sel, held, onPick, onClear }: {
  bal: MuscleBalance; sel: MuscleKey | null; held: MuscleKey | null;
  onPick: (k: MuscleKey) => void; onClear: () => void;
}) {
  const extra = (Object.keys(MUSCLE_NAMES) as MuscleKey[])
    .filter((k) => !MAJOR_MUSCLES.includes(k) && bal.perWeek[k] > 0);
  const rows = [...MAJOR_MUSCLES].sort((a, b) => bal.perWeek[b] - bal.perWeek[a]).concat(extra);

  if (sel) {
    const w = bal.perWeek[sel];
    const src = bal.contributors[sel];
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, borderBottom: RULE, paddingBottom: 12 }}>
          <div>
            <div style={eyebrow}>{w >= WEEKLY_SETS.low ? 'In range' : w ? 'Under range' : 'Not trained'}</div>
            <div style={{ ...display(22), marginTop: 6 }}>{MUSCLE_NAMES[sel]}</div>
          </div>
          {held && <ClearButton onClick={onClear} />}
        </div>
        <div style={{ padding: '16px 0', borderBottom: RULE_SOFT }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: SOFT, marginBottom: 8 }}>
            <span>{nf(w, 1)} sets a week</span>
            <span style={{ color: BLUE }}>target {WEEKLY_SETS.low}–{WEEKLY_SETS.high}</span>
          </div>
          <RangeBar value={w} />
        </div>
        {src.length ? src.map((c) => (
          <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderBottom: RULE_SOFT, fontSize: 13 }}>
            <span style={{ color: INK }}>
              {c.name}
              <span style={{ ...eyebrow, fontSize: 9, marginLeft: 8, color: c.role === 'primary' ? PLUM : MUTED }}>
                {c.role === 'primary' ? 'worked' : 'helped'}
              </span>
            </span>
            <span style={{ color: SOFT, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{c.sets} sets</span>
          </div>
        )) : (
          <p style={{ fontSize: 13, color: MUTED, fontStyle: 'italic', margin: '16px 0 0' }}>
            Nothing in these {bal.days} days trained the {MUSCLE_NAMES[sel].toLowerCase()}.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <div style={{ borderBottom: RULE, paddingBottom: 12 }}>
        <div style={eyebrow}>Point at a muscle for its sources</div>
        <div style={{ ...display(22), marginTop: 6 }}>
          {bal.under.length ? <>Under <em>{WEEKLY_SETS.low}</em> sets a week</> : 'Every major muscle in range'}
        </div>
        {bal.under.length > 0 && (
          <p style={{ fontSize: 13, color: SOFT, margin: '8px 0 0', lineHeight: 1.6 }}>
            {bal.under.map((k) => MUSCLE_NAMES[k]).join(', ')}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, fontSize: 10.5, color: BLUE, padding: '10px 0 2px' }}>
        <span>blue band = {WEEKLY_SETS.low}–{WEEKLY_SETS.high} sets a week</span>
      </div>
      {rows.map((k) => (
        <button key={k} type="button" onClick={() => onPick(k)} style={{
          display: 'grid', gridTemplateColumns: '110px 1fr 52px', gap: 12, alignItems: 'center', width: '100%',
          padding: '9px 0', background: 'none', border: 'none', borderBottom: RULE_SOFT, cursor: 'pointer', textAlign: 'left',
        }}>
          <span style={{ fontSize: 12.5, color: MAJOR_MUSCLES.includes(k) ? INK : MUTED }}>{MUSCLE_NAMES[k]}</span>
          <RangeBar value={bal.perWeek[k]} />
          <span style={{ fontSize: 12, color: SOFT, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {bal.perWeek[k] ? nf(bal.perWeek[k], 1) : '—'}
          </span>
        </button>
      ))}
    </>
  );
}
