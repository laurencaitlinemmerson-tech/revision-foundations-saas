'use client';

import {
  useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode,
} from 'react';
import { MUSCLE_NAMES, type MuscleKey, type MuscleMap } from './muscleMap';
import {
  CARD, INK, MUTED, PINK, PINK_DEEP, PLUM, PLUM_SOFT, RULE, RULE_SOFT, SOFT, TINT, TRACK, TRACK_PREV,
} from './palette';

/**
 * The latest lifting session, drawn on the body.
 *
 * Front and back figures with each muscle filled by what the session asked of
 * it: plum where it did the work, soft plum where it helped, track grey where it
 * rested. Pointing at a muscle (or tapping it, which holds the selection) filters
 * the list beside it to the movements that hit it, set by set.
 *
 * Colours follow the dashboard's rule — violet is you, pink marks a personal
 * best — and every figure here comes from the lift log via `muscleMap.ts`.
 */

const nf = (n: number) => Math.round(n).toLocaleString('en-GB');
const display = (size: number, color = INK): CSSProperties => ({
  fontFamily: 'var(--font-display)', fontSize: size, fontWeight: 400,
  letterSpacing: '-0.015em', lineHeight: 1, color,
});
const eyebrow: CSSProperties = { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED };

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

export default function MuscleMapPanel({ m, children }: { m: MuscleMap; children?: ReactNode }) {
  const [hover, setHover] = useState<MuscleKey | null>(null);
  const [held, setHeld] = useState<MuscleKey | null>(null);
  const sel = held ?? hover;

  const role = (k: MuscleKey) => (m.load[k].primary ? 'primary' : m.load[k].secondary ? 'secondary' : 'rest');
  const fill = (k: MuscleKey) => ({ primary: PLUM, secondary: PLUM_SOFT, rest: TRACK_PREV }[role(k)]);
  const toggle = (k: MuscleKey) => setHeld((h) => (h === k ? null : k));

  const worked = (Object.keys(MUSCLE_NAMES) as MuscleKey[])
    .filter((k) => m.load[k].primary || m.load[k].secondary)
    .sort((a, b) => (m.load[b].primary * 2 + m.load[b].secondary) - (m.load[a].primary * 2 + m.load[a].secondary));

  const list = sel
    ? m.exercises.filter((e) => e.primary.includes(sel) || e.secondary.includes(sel))
    : m.exercises;

  const dateLabel = m.date
    ? new Date(`${m.date}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    : '';

  const figure = (shapes: Shape[], label: string) => (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg viewBox="0 0 200 420" role="group" aria-label={`${label} of body`} style={{ width: '100%', maxWidth: 180, height: 'auto', display: 'block' }}>
        <g fill={TRACK}>{SILHOUETTE}</g>
        {shapes.map((s, i) => {
          const k = s.k;
          const dim = sel && sel !== k;
          const key = `${k}-${i}`;
          const common = {
            fill: fill(k),
            opacity: dim ? 0.3 : 1,
            stroke: sel === k ? INK : CARD,
            strokeWidth: sel === k ? 2 : 1.5,
            tabIndex: 0,
            role: 'button',
            'aria-pressed': held === k,
            'aria-label': `${MUSCLE_NAMES[k]}, ${role(k) === 'primary' ? `worked, ${m.load[k].primary} sets` : role(k) === 'secondary' ? 'helped' : 'rested'}`,
            style: { cursor: 'pointer', transition: 'opacity .15s' } as CSSProperties,
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

  return (
    <section style={{ marginTop: 56, border: RULE, background: CARD, padding: 40 }} aria-labelledby="muscle-map-title">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', borderBottom: RULE, paddingBottom: 20 }}>
        <div>
          <div style={eyebrow}>{m.empty ? 'Last session' : `Last session · ${dateLabel}`}</div>
          <h2 id="muscle-map-title" style={{ ...display(28), margin: '10px 0 0' }}>
            What it <em>hit</em>
          </h2>
        </div>
        {!m.empty && (
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[
              ['Movements', nf(m.totals.exercises)],
              ['Sets', nf(m.totals.sets)],
              ['Moved', `${nf(m.totals.volumeKg)} kg`],
              ['PBs', nf(m.totals.pbs)],
            ].map(([l, val]) => (
              <div key={l}>
                <div style={{ ...eyebrow, fontSize: 9.5 }}>{l}</div>
                <div style={{ ...display(26, l === 'PBs' && m.totals.pbs ? PINK : INK), marginTop: 6 }}>{val}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {m.empty ? (
        <p style={{ fontSize: 13, color: SOFT, lineHeight: 1.7, margin: '24px 0 0', maxWidth: 560 }}>
          Nothing in the lift log yet. Log the sets from your next session below and the muscles it worked light up here.
        </p>
      ) : (
        <>
          <div className="training-pair" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 28, marginTop: 28 }}>
            <div style={{ background: TINT, border: RULE_SOFT, padding: '24px 12px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                {figure(FRONT, 'Front')}
                {figure(BACK, 'Back')}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap', fontSize: 11, color: SOFT }}>
                {[['Worked', PLUM], ['Helped', PLUM_SOFT], ['Rested', TRACK_PREV]].map(([l, c]) => (
                  <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />{l}
                  </span>
                ))}
              </div>
            </div>

            <div aria-live="polite" style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, borderBottom: RULE, paddingBottom: 12 }}>
                <div>
                  <div style={eyebrow}>{sel ? (role(sel) === 'primary' ? 'Worked' : role(sel) === 'secondary' ? 'Helped' : 'Rested') : 'Point at a muscle'}</div>
                  <div style={{ ...display(22), marginTop: 6 }}>{sel ? MUSCLE_NAMES[sel] : 'Every movement'}</div>
                </div>
                {held && (
                  <button type="button" onClick={() => setHeld(null)} style={{
                    background: 'none', border: RULE, padding: '6px 12px', fontSize: 11, color: SOFT, cursor: 'pointer',
                  }}>Show all</button>
                )}
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
                    {e.pb && <span style={{ ...eyebrow, fontSize: 9.5, color: PINK_DEEP }}>PB · {e.topSetKg} kg</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {e.sets.map((s, i) => (
                      <span key={i} style={{
                        fontSize: 11.5, padding: '4px 8px', fontVariantNumeric: 'tabular-nums',
                        border: s.pb ? `1px solid ${PINK}` : RULE, color: s.pb ? PINK_DEEP : SOFT,
                      }}>{s.label}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 11.5, color: MUTED, marginTop: 6 }}>
                    {e.sets.length} set{e.sets.length === 1 ? '' : 's'} · {nf(e.volumeKg)} kg moved · est. 1RM {nf(e.e1rmKg)} kg
                  </div>
                </div>
              ))}
            </div>
          </div>

          {worked.length > 0 && (
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
                  top {e.topSetKg} kg
                </div>
              </div>
            ))}
          </div>

          {m.unmatched.length > 0 && (
            <p style={{ fontSize: 12, color: MUTED, fontStyle: 'italic', margin: '16px 0 0' }}>
              Not drawn on the body: {m.unmatched.join(', ')} — the name did not match a known movement.
            </p>
          )}
        </>
      )}
      {children}
    </section>
  );
}
