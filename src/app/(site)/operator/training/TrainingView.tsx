'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import type { TrainingVals } from './logic';
import {
  AMBER, CARD, INK, LILAC_HAZE, MUTED, PAPER, PINK, PINK_DEEP, PINK_FILL, PINK_LINE,
  PLUM, PLUM_FILL, PLUM_FILL_FAINT, RULE, RULE_SOFT, SIDEBAR, SOFT, SPARK, TINT,
  TRACK, TRACK_PREV,
} from './palette';

/**
 * The Training dashboard, as drawn.
 *
 * A direct translation of the approved design: same nine screens, same grid,
 * same type scale. It holds no logic of its own — every string, colour and bar
 * width arrives already computed from `logic.ts`, so what the design decides and
 * what the data decides stay in separate files.
 */


/**
 * The spacing scale.
 *
 * The design was drawn tight; these are the same proportions opened up so the
 * page has room to breathe. Changing a value here moves every instance of it,
 * which is the point — the rhythm is one decision, not sixty.
 */
const PAGE_X = 64;      // main gutter
const PAGE_TOP = 56;
const SECTION_GAP = 56; // between major sections
const CARD_PAD = 32;    // inside a bordered card
const PANEL_PAD = 40;   // inside a large split panel
const GRID_GAP = 28;    // between side-by-side cards
const ROW_Y = 16;       // a list row's vertical padding
const CELL_Y = 18;      // a table cell's vertical padding

/* The activity heatmap's grid, shared by the squares and the month strip. */
const HEAT_CELL = 16;
const HEAT_GAP = 5;
const HEAT_WEEKS = 12;

const eyebrow: CSSProperties = {
  fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED,
};
const card: CSSProperties = { border: RULE, background: CARD };
const display = (size: number, color = INK): CSSProperties => ({
  fontFamily: 'var(--font-display)', fontSize: size, fontWeight: 400,
  letterSpacing: '-0.015em', lineHeight: 1, color,
});
const th = (align: 'left' | 'right' = 'left'): CSSProperties => ({
  textAlign: align, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
  color: MUTED, fontWeight: 400, padding: `16px 14px ${ROW_Y - 2}px`, borderBottom: RULE,
});
const td: CSSProperties = { padding: `${CELL_Y}px 14px`, borderBottom: RULE_SOFT, fontSize: 13, color: SOFT };

function Eyebrow({ children }: { children: ReactNode }) {
  return <div style={eyebrow}>{children}</div>;
}

function SectionHeading({ title, aside }: { title: string; aside?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      gap: 16, borderBottom: RULE, paddingBottom: 12,
    }}>
      <h2 style={{ ...display(24), margin: 0 }}>{title}</h2>
      {aside && (
        <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>
          {aside}
        </span>
      )}
    </div>
  );
}

/** The segmented control the design uses for every tab row. */
function Segmented({
  items, size = 'md',
}: {
  items: Array<{ label: string; go: () => void; active: boolean }>;
  size?: 'sm' | 'md';
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', border: RULE, background: CARD, flexShrink: 0 }}>
      {items.map((t) => (
        <button
          key={t.label}
          type="button"
          onClick={t.go}
          aria-pressed={t.active}
          className="hv-tab"
          style={{
            all: 'unset', cursor: 'pointer',
            padding: size === 'sm' ? '7px 11px' : '9px 15px',
            fontSize: size === 'sm' ? 11.5 : 12,
            letterSpacing: '0.04em',
            borderRight: RULE,
            background: t.active ? PLUM : 'transparent',
            color: t.active ? '#FBF8FA' : SOFT,
            transition: 'background 150ms',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Bar({ pct, color = PLUM, height = 4 }: { pct: string; color?: string; height?: number }) {
  return (
    <div style={{ height, background: TRACK, marginTop: 8 }}>
      <div style={{ height, width: pct, background: color }} />
    </div>
  );
}

/**
 * The body-composition trend.
 *
 * Points arrive already positioned by date rather than by index, so an irregular
 * run of weigh-ins draws the shape it actually has. Hovering reads a point back:
 * the nearest one horizontally, so it stays usable when readings cluster.
 */
function TrendChart({
  points, path, area, ariaLabel,
}: {
  points: TrainingVals['bodyPoints'];
  path: string;
  area: string;
  ariaLabel: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const W = 680;
  const H = 166;

  const pick = (clientX: number, rect: DOMRect) => {
    if (!points.length) return null;
    const x = ((clientX - rect.left) / rect.width) * W;
    let best = 0;
    for (let i = 1; i < points.length; i++) {
      if (Math.abs(points[i].x - x) < Math.abs(points[best].x - x)) best = i;
    }
    return best;
  };

  const p = active === null ? null : points[active] ?? null;

  return (
    <div style={{ position: 'relative', marginTop: 22 }}>
      <svg
        viewBox={`0 0 ${W} ${H + 24}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: 190, display: 'block', touchAction: 'pan-y' }}
        role="img"
        aria-label={ariaLabel}
        onMouseLeave={() => setActive(null)}
        onMouseMove={(e) => setActive(pick(e.clientX, e.currentTarget.getBoundingClientRect()))}
        onTouchStart={(e) => setActive(pick(e.touches[0].clientX, e.currentTarget.getBoundingClientRect()))}
        onTouchMove={(e) => setActive(pick(e.touches[0].clientX, e.currentTarget.getBoundingClientRect()))}
        onTouchEnd={() => setActive(null)}
      >
        <g stroke="rgba(34,28,36,0.06)" strokeWidth="0.5">
          <line x1="0" y1="24" x2={W} y2="24" />
          <line x1="0" y1="83" x2={W} y2="83" />
          <line x1="0" y1="142" x2={W} y2="142" />
        </g>
        {area && <path d={area} fill={PLUM_FILL_FAINT} stroke="none" />}
        {path && <path d={path} fill="none" stroke={PLUM} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />}

        {/* Every reading is marked, so a cluster reads as a cluster. */}
        {points.map((pt) => (
          <circle key={pt.key} cx={pt.x} cy={pt.y} r="2" fill={PLUM} opacity={0.35} />
        ))}

        {p && (
          <g>
            <line x1={p.x} y1="0" x2={p.x} y2={H} stroke={PLUM} strokeWidth="0.75" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            <circle cx={p.x} cy={p.y} r="4" fill={PLUM} />
          </g>
        )}
      </svg>

      {/* Read out beside the chart rather than in it, so the SVG can stay
          non-uniformly scaled without stretching the type. */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        gap: 12, marginTop: 6, minHeight: 18,
      }}>
        {p ? (
          <>
            <span style={{ fontSize: 12, color: INK }}>{p.valueLabel}</span>
            <span style={{ fontSize: 11, color: MUTED }}>{p.dateLabel}</span>
          </>
        ) : (
          <span style={{ fontSize: 11, color: MUTED, fontStyle: 'italic' }}>
            Hover or drag across the chart to read a weigh-in.
          </span>
        )}
      </div>
    </div>
  );
}

function Empty({ title, note }: { title: string; note: string }) {
  return (
    <div style={{ padding: '56px 0', textAlign: 'center' }}>
      <div style={display(20)}>{title}</div>
      <div style={{ fontSize: 13, color: MUTED, marginTop: 8 }}>{note}</div>
    </div>
  );
}

export default function TrainingView({ v }: { v: TrainingVals }) {
  return (
    <div
      className="training-grid"
      style={{ display: 'grid', gridTemplateColumns: '252px 1fr', minHeight: '100vh', background: PAPER }}
    >
      <aside
        className="training-aside"
        style={{
          borderRight: RULE, background: SIDEBAR, padding: '40px 0 28px',
          position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ padding: '0 28px 32px' }}>
          <Eyebrow>The Nurse Lab</Eyebrow>
          <div style={{ ...display(24), marginTop: 6 }}>Training</div>
        </div>
        <nav className="training-nav" style={{ display: 'flex', flexDirection: 'column', borderTop: RULE }}>
          {v.nav.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.go}
              aria-current={item.active ? 'page' : undefined}
              className="hv-nav"
              style={{
                all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 12,
                padding: '15px 28px', borderBottom: RULE_SOFT, fontSize: 14,
                fontWeight: item.active ? 400 : 300,
                color: item.active ? PLUM : SOFT,
                background: item.active ? LILAC_HAZE : 'transparent',
                transition: 'background 200ms cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: MUTED, minWidth: 18 }}>
                {item.numeral}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: CARD_PAD, borderTop: RULE }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: '#E9C0D0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 15, color: INK,
            }}>
              {v.operatorInitial}
            </div>
            <div>
              <div style={{ fontSize: 13, color: INK }}>{v.operatorName}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{v.operatorNote}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="training-main" style={{ padding: `${PAGE_TOP}px ${PAGE_X}px 120px`, maxWidth: 1320 }}>
        <header style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 40, paddingBottom: 32, borderBottom: RULE, flexWrap: 'wrap',
        }}>
          <div>
            <Eyebrow>{v.todayLabel}</Eyebrow>
            <h1 style={{ ...display(38), margin: '10px 0 8px' }}>{v.pageTitle}</h1>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: SOFT, maxWidth: '54ch', textWrap: 'pretty' }}>
              {v.pageSub}
            </p>
          </div>
          <Segmented items={v.ranges} />
        </header>

        {v.isCustom && (
          <div style={{
            display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
            marginTop: 16, padding: '14px 18px', border: RULE, background: CARD,
          }}>
            <span style={eyebrow}>Custom range</span>
            <label style={{ fontSize: 12, color: SOFT, display: 'flex', gap: 8, alignItems: 'center' }}>
              From
              <input
                type="date"
                value={v.customFrom}
                max={v.customTo}
                onChange={(e) => v.onCustomFrom(e.target.value)}
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 13,
                  padding: '7px 10px', border: RULE, background: CARD, color: INK, outline: 'none',
                }}
              />
            </label>
            <label style={{ fontSize: 12, color: SOFT, display: 'flex', gap: 8, alignItems: 'center' }}>
              To
              <input
                type="date"
                value={v.customTo}
                min={v.customFrom}
                onChange={(e) => v.onCustomTo(e.target.value)}
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 13,
                  padding: '7px 10px', border: RULE, background: CARD, color: INK, outline: 'none',
                }}
              />
            </label>
          </div>
        )}

        {!v.loaded && (
          <Empty title="Reading your data…" note="Weigh-ins, Apple Health, workouts and the lift log." />
        )}

        {v.loaded && v.setupRequired && (
          <div style={{ ...card, marginTop: GRID_GAP, padding: '18px 22px', fontSize: 13, color: SOFT }}>
            One of the operator tables is not set up yet, so part of this dashboard has nothing to read.
            Run the Supabase migrations and refresh.
          </div>
        )}

        {v.loaded && (
          <>
            {v.screen === 'Dashboard' && <Dashboard v={v} />}
            {v.screen === 'Head to head' && <HeadToHead v={v} />}
            {v.screen === 'Workouts' && <Workouts v={v} />}
            {v.screen === 'Exercises' && <Exercises v={v} />}
            {v.screen === 'Progress' && <Progress v={v} />}
            {v.screen === 'Goals' && <Goals v={v} />}
            {v.screen === 'Nutrition' && <Nutrition v={v} />}
            {v.screen === 'Recovery' && <Recovery v={v} />}
            {v.screen === 'Insights' && <Insights v={v} />}
            {v.screen === 'Settings' && <Settings v={v} />}
          </>
        )}

        <footer style={{
          marginTop: 64, paddingTop: 20, borderTop: RULE,
          fontSize: 11.5, fontStyle: 'italic', color: MUTED,
        }}>
          Everything above is computed from your own logged data over {v.rangeLabel}. These figures
          support training decisions; they are not a medical or dietary assessment.
        </footer>
      </main>
    </div>
  );
}

/* ── Dashboard ───────────────────────────────────────────────────────────── */

function Dashboard({ v }: { v: TrainingVals }) {
  return (
    <div>
      <section style={{ ...card, marginTop: 44 }}>
        <div className="training-split" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr' }}>
          <div style={{ padding: PANEL_PAD, borderRight: RULE }}>
            <Eyebrow>Fitness overview</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: 18 }}>
              <div style={{ ...display(76, PLUM), lineHeight: 0.9, letterSpacing: '-0.02em' }}>{v.overall}</div>
              <div style={{ paddingBottom: 10 }}>
                <div style={{ fontSize: 13, color: MUTED }}>/ 100</div>
                <div style={{ fontSize: 13, color: v.overallDeltaColor, marginTop: 4 }}>{v.overallDelta}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: SOFT, margin: '24px 0 0', maxWidth: '46ch', textWrap: 'pretty' }}>
              Fitness is a combination of strength, cardiovascular fitness, activity, nutrition,
              recovery and consistency. No single dimension carries the score, and a dimension with
              nothing logged is left out rather than counted as zero.
            </p>
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {v.dims.map((d) => (
                <div key={d.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 13, color: INK }}>
                    <span>{d.label}</span>
                    <span style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>{d.score}</span>
                      <span style={{ fontSize: 11, color: d.deltaColor, minWidth: 44, textAlign: 'right' }}>{d.delta}</span>
                    </span>
                  </div>
                  <div style={{ height: 3, background: TRACK, marginTop: 7 }}>
                    <div style={{ height: 3, width: d.pct, background: d.bar }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: PANEL_PAD, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: TINT }}>
            <div style={{ ...eyebrow, alignSelf: 'flex-start' }}>Six dimensions</div>
            <svg
              viewBox="0 0 420 360"
              style={{ width: '100%', maxWidth: 420, marginTop: 8 }}
              role="img"
              aria-label={`Radar chart of six fitness dimensions: ${v.dims.map((d) => `${d.label} ${d.score}`).join(', ')}`}
            >
              <g fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="0.5">
                {v.radarRings.map((r, i) => <polygon key={i} points={r.points} />)}
              </g>
              <g stroke="rgba(0,0,0,0.07)" strokeWidth="0.5">
                {v.radarSpokes.map((s, i) => <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />)}
              </g>
              <polygon points={v.radarPrev} fill="none" stroke={PINK_LINE} strokeWidth="1" strokeDasharray="3 3" />
              <polygon points={v.radarNow} fill={PLUM_FILL} stroke={PLUM} strokeWidth="1.25" />
              <g>
                {v.radarDots.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.75" fill={PLUM} />)}
              </g>
              <g fontFamily="Inter, sans-serif" fontSize="10.5" fill={SOFT}>
                {v.radarLabels.map((l, i) => (
                  <text key={i} x={l.x} y={l.y} textAnchor={l.anchor}>{l.label}</text>
                ))}
              </g>
            </svg>
            <div style={{ display: 'flex', gap: 20, fontSize: 11, color: MUTED, marginTop: 4 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 16, height: 1.5, background: PLUM }} />This period
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 16, height: 0, borderTop: `1px dashed ${PINK_LINE}` }} />Previous
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="training-split-3" style={{ ...card, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', marginTop: GRID_GAP }}>
        {v.topCards.map((c) => (
          <div key={c.eyebrow} style={{ padding: '30px 34px', borderRight: RULE }}>
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <div style={{ fontSize: 13, color: INK, marginTop: 14 }}>{c.label}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 6 }}>
              <span style={display(40)}>{c.value}</span>
              <span style={{ fontSize: 13, color: MUTED, paddingBottom: 5 }}>{c.unit}</span>
            </div>
            <div style={{ fontSize: 12, color: c.trendColor, marginTop: 8 }}>{c.trend}</div>
            <svg viewBox="0 0 200 44" preserveAspectRatio="none" style={{ width: '100%', height: 44, marginTop: 16 }} aria-hidden="true">
              {c.spark && <path d={c.spark} fill="none" stroke={SPARK} strokeWidth="1.25" />}
            </svg>
            <div style={{ fontSize: 12.5, color: SOFT, marginTop: 12, lineHeight: 1.65 }}>{c.note}</div>
          </div>
        ))}
      </div>

      <section style={{ marginTop: SECTION_GAP }}>
        <SectionHeading title="Multi-dimensional progress" aside={v.againstLabel} />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...th(), paddingLeft: 0 }}>Dimension</th>
              <th style={{ ...th(), width: '36%' }}>Movement</th>
              <th style={th('right')}>Previous</th>
              <th style={th('right')}>Current</th>
              <th style={{ ...th('right'), paddingRight: 0 }}>Change</th>
            </tr>
          </thead>
          <tbody>
            {v.dims.map((d) => (
              <tr key={d.label}>
                <td style={{ ...td, paddingLeft: 0, fontSize: 14, color: INK }}>{d.label}</td>
                <td style={td}>
                  <div style={{ position: 'relative', height: 6, background: TRACK }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: 6, width: d.prevPct, background: TRACK_PREV }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, height: 6, width: d.pct, background: d.bar }} />
                  </div>
                </td>
                <td style={{ ...td, textAlign: 'right', fontSize: 14, color: MUTED }}>{d.prev}</td>
                <td style={{ ...td, textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: 19, color: PLUM }}>{d.score}</td>
                <td style={{ ...td, textAlign: 'right', paddingRight: 0, color: d.deltaColor }}>{d.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 12, fontStyle: 'italic', color: MUTED, margin: '16px 0 0' }}>{v.dimNote}</p>
      </section>

      <section className="training-pair" style={{ marginTop: SECTION_GAP, display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: GRID_GAP }}>
        <div style={{ ...card, padding: CARD_PAD }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <Eyebrow>Body composition — one of six dimensions</Eyebrow>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 14 }}>
                <span style={display(44)}>{v.bodyValue}</span>
                <span style={{ fontSize: 14, color: MUTED, paddingBottom: 6 }}>{v.bodyUnit}</span>
              </div>
              <div style={{ fontSize: 13, color: SOFT, marginTop: 8 }}>{v.bodyDelta}</div>
            </div>
            <Segmented items={v.bodyTabs} size="sm" />
          </div>
          <TrendChart
            points={v.bodyPoints}
            path={v.bodyPath}
            area={v.bodyArea}
            ariaLabel={`Body composition trend: ${v.bodyCount} weigh-ins from ${v.bodyStart} to ${v.bodyEnd}, low ${v.bodyMin}, high ${v.bodyMax}`}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginTop: 4, gap: 12 }}>
            <span>{v.bodyStart}</span>
            <span>{v.bodyMin} – {v.bodyMax}</span>
            <span>{v.bodyEnd}</span>
          </div>
          <div style={{ fontSize: 11.5, color: MUTED, marginTop: 10 }}>{v.bodySpanNote}</div>
          <p style={{ fontSize: 12.5, lineHeight: 1.75, color: SOFT, margin: '22px 0 0', paddingTop: 20, borderTop: RULE, textWrap: 'pretty' }}>
            {v.bodyNote}
          </p>
        </div>
        <div style={{ ...card, padding: CARD_PAD }}>
          <Eyebrow>Measurements</Eyebrow>
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column' }}>
            {v.measurements.map((m) => (
              <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: `${ROW_Y}px 0`, borderBottom: RULE_SOFT }}>
                <span style={{ fontSize: 13, color: SOFT }}>{m.label}</span>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: INK }}>{m.value}</span>
                  <span style={{ fontSize: 11, color: m.color, minWidth: 62, textAlign: 'right' }}>{m.change}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="training-pair" style={{ marginTop: SECTION_GAP, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: GRID_GAP }}>
        <div style={{ ...card, padding: CARD_PAD }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <Eyebrow>{v.nutritionDayLabel}</Eyebrow>
            <span style={{ fontSize: 11, color: MUTED }}>{v.nutritionTargetNote}</span>
          </div>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {v.nutrition.map((n) => (
              <div key={n.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontSize: 13, color: INK }}>{n.label}</span>
                  <span style={{ fontSize: 12, color: SOFT }}>
                    {n.text}<span style={{ color: n.statusColor, marginLeft: 8 }}>{n.status}</span>
                  </span>
                </div>
                <Bar pct={n.pct} color={n.bar} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...card, padding: CARD_PAD }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Eyebrow>Recovery</Eyebrow>
            {v.recoveryNeedsAttention && <span style={{ fontSize: 11, color: AMBER }}>Needs attention</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 14 }}>
            <span style={display(44)}>{v.recoveryScore}</span>
            <span style={{ fontSize: 14, color: MUTED, paddingBottom: 6 }}>/ 100</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', marginTop: 22, borderTop: RULE }}>
            {v.recoveryStats.map((r) => (
              <div key={r.label} style={{ padding: '20px 16px 18px 0' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>{r.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: INK, marginTop: 6 }}>{r.value}</div>
                <div style={{ fontSize: 11, color: r.color, marginTop: 4 }}>{r.change}</div>
              </div>
            ))}
          </div>
          <svg viewBox="0 0 320 70" preserveAspectRatio="none" style={{ width: '100%', height: 70, marginTop: 12 }} role="img" aria-label="Sleep duration trend">
            {v.sleepPath && <path d={v.sleepPath} fill="none" stroke={PINK} strokeWidth="1.4" />}
          </svg>
          <div style={{ fontSize: 12, color: SOFT, marginTop: 10 }}>{v.sleepNote}</div>
        </div>
      </section>

      <section style={{ ...card, marginTop: SECTION_GAP, padding: CARD_PAD }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: GRID_GAP, flexWrap: 'wrap' }}>
          <div>
            <Eyebrow>Consistency</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 12 }}>
              <span style={display(44)}>{v.consistencyScore}</span>
              <span style={{ fontSize: 13, color: SOFT, paddingBottom: 7, fontStyle: 'italic' }}>{v.consistencyNote}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {v.adherence.map((a) => (
              <div key={a.label}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>{a.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: INK, marginTop: 5 }}>{a.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 40, marginTop: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
            <div style={{ display: 'flex', gap: HEAT_GAP, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: HEAT_GAP, marginRight: 10 }}>
                {v.dayLabels.map((d, i) => (
                  <div key={i} style={{ height: HEAT_CELL, fontSize: 9.5, lineHeight: `${HEAT_CELL}px`, color: MUTED, width: 26 }}>{d}</div>
                ))}
              </div>
              {v.heatmap.map((week) => (
                <div key={week.key} style={{ display: 'flex', flexDirection: 'column', gap: HEAT_GAP }}>
                  {week.days.map((day) => (
                    <div
                      key={day.key}
                      title={day.tip}
                      style={{
                        width: HEAT_CELL, height: HEAT_CELL, background: day.color,
                        border: day.color === 'transparent'
                          ? '0.5px dashed rgba(34,28,36,0.07)'
                          : '0.5px solid rgba(34,28,36,0.06)',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            {/* The month strip is pinned to the grid's exact width so its labels
                sit under the weeks they name rather than drifting past them. */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED,
              marginTop: 14, marginLeft: 26 + 10, width: HEAT_WEEKS * (HEAT_CELL + HEAT_GAP) - HEAT_GAP,
            }}>
              {v.heatMonths.map((m, i) => <span key={i}>{m}</span>)}
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.85, maxWidth: 210, paddingTop: 2 }}>
            <div>Each square is one day.</div>
            <div>Darker means more work logged — strength, cardio or steps.</div>
          </div>
        </div>
      </section>

      <section className="training-pair" style={{ marginTop: SECTION_GAP, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: GRID_GAP }}>
        <div>
          <h2 style={{ ...display(24), margin: '0 0 4px' }}>Progress timeline</h2>
          <div style={{ borderTop: RULE, marginTop: 14 }}>
            {v.timeline.length === 0 && (
              <Empty title="Nothing to show yet." note="Log a session and the moments that moved the score appear here." />
            )}
            {v.timeline.map((t) => (
              <div key={t.key} style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: 16, padding: '20px 0', borderBottom: RULE_SOFT }}>
                <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, paddingTop: 2 }}>{t.date}</div>
                <div>
                  <div style={{ fontSize: 14, color: INK }}>{t.title}</div>
                  <div style={{ fontSize: 12.5, color: SOFT, marginTop: 6, lineHeight: 1.65 }}>{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 style={{ ...display(24), margin: '0 0 4px' }}>Personal records</h2>
          <div style={{ ...card, display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: 14 }}>
            {v.prs.map((p) => (
              <div key={p.key} style={{ padding: 24, borderRight: RULE_SOFT, borderBottom: RULE_SOFT }}>
                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED }}>{p.kind}</div>
                <div style={{ fontSize: 13, color: INK, marginTop: 10 }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: INK, marginTop: 4 }}>{p.value}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>{p.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Head to head ────────────────────────────────────────────────────────── */

/** A single bar split between the two people, so a close round looks close. */
function Versus({ youShare, height = 6 }: { youShare: string; height?: number }) {
  return (
    <div style={{ display: 'flex', height, background: TRACK, overflow: 'hidden' }}>
      <div style={{ width: youShare, background: PLUM }} />
      <div style={{ flex: 1, background: PINK }} />
    </div>
  );
}

function Stepper({
  label, onPrev, onNext, canPrev, canNext,
}: {
  label: string; onPrev: () => void; onNext: () => void; canPrev: boolean; canNext: boolean;
}) {
  const arrow = (dir: string, on: () => void, enabled: boolean, aria: string) => (
    <button
      type="button" onClick={on} disabled={!enabled} aria-label={aria}
      className={enabled ? 'hv-tab' : undefined}
      style={{
        all: 'unset', cursor: enabled ? 'pointer' : 'default', padding: '8px 16px',
        fontSize: 16, lineHeight: 1, color: enabled ? SOFT : 'rgba(34,28,36,0.18)',
      }}
    >
      {dir}
    </button>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: RULE, background: CARD }}>
      {arrow('\u2039', onPrev, canPrev, 'Previous day')}
      <span style={{
        flex: 1, textAlign: 'center', fontSize: 11, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: INK, padding: '0 12px', minWidth: 140,
      }}>
        {label}
      </span>
      {arrow('\u203a', onNext, canNext, 'Next day')}
    </div>
  );
}

type Card = NonNullable<TrainingVals['h2h']['you']>;

function PersonCard({ p, dayLabel, stepper }: { p: Card; dayLabel: string; stepper: ReactNode }) {
  return (
    <div style={{ ...card, padding: CARD_PAD }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
          border: `1px solid ${p.accent}`, background: CARD,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 20, color: p.accent,
        }}>
          {/* The peer's own https URL on their domain, so next/image's optimiser
              has no configured loader for it — a plain img is correct here. */}
          {p.avatarUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={p.avatarUrl} alt="" width={52} height={52} style={{ objectFit: 'cover' }} />
            : p.initial}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={display(24)}>{p.name}</span>
            {p.isLeader && (
              <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: p.accent }}>
                Leading
              </span>
            )}
          </div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{p.journey}</div>
        </div>
      </div>

      <div style={{ fontSize: 13, color: SOFT, marginTop: 18, paddingBottom: 18, borderBottom: RULE }}>
        {p.vitals}
      </div>

      <div style={{ marginTop: 20 }}>{stepper}</div>

      <div style={{ marginTop: 22, paddingBottom: 20, borderBottom: RULE }}>
        <div style={display(40)}>{p.headline}</div>
        <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginTop: 8 }}>
          Steps · {p.headlineNote}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <Eyebrow>This week</Eyebrow>
        {p.weekRows.map((r) => (
          <div key={r.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            padding: `${ROW_Y}px 0`, borderBottom: RULE_SOFT, fontSize: 13, color: SOFT,
          }}>
            <span>{r.label}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: INK }}>{r.value}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <Eyebrow>{dayLabel}</Eyebrow>
        {p.dayRows.map((r) => (
          <div key={r.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            padding: `${ROW_Y}px 0`, borderBottom: RULE_SOFT, fontSize: 13, color: SOFT,
          }}>
            <span>{r.label}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: r.color }}>{r.value}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <Eyebrow>{p.goalLabel}</Eyebrow>
          <span style={{ fontSize: 12, color: SOFT }}>{p.goalText}</span>
        </div>
        <Bar pct={p.goalPct} color={p.accent} height={5} />
      </div>

      {/* [] is "logged nothing today"; null is "does not publish food". */}
      {p.food !== null && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <Eyebrow>Food</Eyebrow>
            <span style={{ fontSize: 12, color: SOFT }}>{p.foodTotal}</span>
          </div>
          {p.food.length === 0 && (
            <div style={{ fontSize: 12.5, color: MUTED, marginTop: 12, fontStyle: 'italic' }}>
              Nothing logged today.
            </div>
          )}
          {p.food.map((f) => (
            <div key={f.key} style={{ padding: `${ROW_Y}px 0`, borderBottom: RULE_SOFT }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, color: INK }}>{f.name}</span>
                <span style={{ fontSize: 12.5, color: SOFT, flexShrink: 0 }}>{f.kcal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, marginTop: 5 }}>
                <span style={{ fontSize: 11.5, color: MUTED }}>{f.meta}</span>
                <span style={{ fontSize: 11.5, color: MUTED, flexShrink: 0 }}>{f.macros}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: 11, color: MUTED, marginTop: 18 }}>Published {p.updatedAt}</div>
    </div>
  );
}

function HeadToHead({ v }: { v: TrainingVals }) {
  const h = v.h2h;

  if (!h.loaded) return <Empty title="Reading both sides…" note="Yours from here, theirs from their site." />;
  if (!h.you) {
    return <Empty title="Your own document could not be built." note="The peer endpoint reads from your stored data; check the sync has run." />;
  }

  const stepper = (
    <Stepper
      label={h.dayLabel} onPrev={h.prevDay} onNext={h.nextDay}
      canPrev={h.canGoBackDay} canNext={h.canGoForwardDay}
    />
  );

  return (
    <div style={{ marginTop: 40 }}>
      {/* A quiet line rather than a headline — the verdict belongs at the end,
          after the numbers it is drawn from. */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        gap: 16, flexWrap: 'wrap', paddingBottom: 14, borderBottom: RULE,
      }}>
        <Eyebrow>{h.weekLabel}</Eyebrow>
        <span style={{ fontSize: 12.5, color: SOFT }}>
          {h.connected ? `${h.roundsDecided} of ${h.roundsTotal} rounds settled` : 'Not connected'}
        </span>
      </div>

      {!h.connected && (
        <div style={{ marginTop: 24, padding: '20px 24px', background: TINT, border: RULE }}>
          <div style={{ fontSize: 13.5, color: SOFT, lineHeight: 1.7 }}>
            {h.configured ? h.peerMessage ?? 'The other side is not answering.'
              : 'No peer endpoint is configured yet — set PEER_URL and PEER_KEY.'}
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 10, fontStyle: 'italic' }}>
            Your own figures below are unaffected.
          </div>
        </div>
      )}

      {/* The two of you, side by side. This is the substance. */}
      <div className="training-pair" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: GRID_GAP, marginTop: GRID_GAP,
      }}>
        <PersonCard p={h.you} dayLabel={h.dayLabel} stepper={stepper} />
        {h.them
          ? <PersonCard p={h.them} dayLabel={h.dayLabel} stepper={stepper} />
          : (
            <div style={{ ...card, padding: CARD_PAD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Empty title="Not connected" note={h.peerMessage ?? 'Their side is not answering right now.'} />
            </div>
          )}
      </div>

      {/* The rounds, as a quiet ledger. */}
      <section style={{ marginTop: SECTION_GAP }}>
        <SectionHeading title="The rounds" aside="A point each" />
        <div style={{ ...card, borderTop: 0 }}>
          {h.rounds.map((r) => (
            <div key={r.key} style={{ padding: '20px 26px', borderBottom: RULE_SOFT }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 18, alignItems: 'baseline' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: r.youLead ? PLUM : INK }}>
                  {r.you}
                  {r.youLead && <span style={{ fontSize: 10, marginLeft: 9, color: PLUM }}>{'\u25b2'}</span>}
                </div>
                <div style={{ textAlign: 'center', minWidth: 170 }}>
                  <div style={{ fontSize: 12.5, color: INK }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>{r.note}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, textAlign: 'right', color: r.themLead ? PINK : INK }}>
                  {r.themLead && <span style={{ fontSize: 10, marginRight: 9, color: PINK }}>{'\u25b2'}</span>}
                  {r.them}
                </div>
              </div>
              <div style={{ marginTop: 14 }}><Versus youShare={r.youShare} height={5} /></div>
            </div>
          ))}
        </div>
      </section>

      {/* The verdict, last — after everything it is drawn from. */}
      {h.connected && (
        <section style={{ marginTop: SECTION_GAP }}>
          <div style={{ ...card, padding: PANEL_PAD, background: TINT }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ ...display(52, h.leader === 'you' ? PLUM : INK), lineHeight: 1 }}>{h.yourPoints}</div>
                <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED, marginTop: 10 }}>
                  {h.you.name}
                </div>
              </div>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED }}>vs</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ ...display(52, h.leader === 'them' ? PINK : INK), lineHeight: 1 }}>{h.theirPoints}</div>
                <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED, marginTop: 10 }}>
                  {h.them?.name}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 20, borderTop: RULE }}>
              <div style={{ ...display(22), color: INK }}>{h.scoreline}</div>
            </div>
          </div>
          <p style={{ fontSize: 12, fontStyle: 'italic', color: MUTED, margin: '18px auto 0', lineHeight: 1.75, maxWidth: '66ch', textAlign: 'center' }}>
            {h.fairnessNote}
          </p>
        </section>
      )}
    </div>
  );
}

/* ── Workouts ────────────────────────────────────────────────────────────── */

function Workouts({ v }: { v: TrainingVals }) {
  if (!v.workouts.length) {
    return <Empty title="No sessions logged yet." note="Lifts you log and workouts Apple Health syncs both land here." />;
  }
  return (
    <div className="training-pair" style={{ marginTop: 44, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 32, alignItems: 'start' }}>
      <div>
        <div style={{ ...eyebrow, paddingBottom: 12, borderBottom: RULE }}>{v.workoutsHeading}</div>
        {v.workouts.map((w) => (
          <button
            key={w.key}
            type="button"
            onClick={w.go}
            aria-pressed={w.active}
            className="hv-row"
            style={{
              all: 'unset', cursor: 'pointer', display: 'block', width: '100%', boxSizing: 'border-box',
              padding: '24px 20px 24px 0', borderBottom: RULE_SOFT,
              background: w.active ? TINT : 'transparent', transition: 'background 150ms',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <span style={{ ...display(20), paddingLeft: w.active ? 16 : 0 }}>{w.name}</span>
              <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED }}>{w.date}</span>
            </div>
            <div style={{ display: 'flex', gap: 22, marginTop: 10, fontSize: 12.5, color: SOFT, flexWrap: 'wrap', paddingLeft: w.active ? 16 : 0 }}>
              {w.meta.map((m) => <span key={m}>{m}</span>)}
              <span style={{ color: w.prColor }}>{w.prs}</span>
            </div>
          </button>
        ))}
      </div>
      {v.sel && (
        <div style={{ ...card, padding: CARD_PAD, position: 'sticky', top: 32 }}>
          <Eyebrow>{v.sel.date}</Eyebrow>
          <h2 style={{ ...display(28), margin: '10px 0 0' }}>{v.sel.name}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', marginTop: 22, borderTop: RULE, borderBottom: RULE }}>
            {v.sel.stats.map((s) => (
              <div key={s.label} style={{ padding: '20px 14px 20px 0' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: INK, marginTop: 5 }}>{s.value}</div>
              </div>
            ))}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
            <thead>
              <tr>
                <th style={{ ...th(), paddingLeft: 0 }}>Exercise</th>
                <th style={th('right')}>Sets × reps</th>
                <th style={th('right')}>Weight</th>
                <th style={{ ...th('right'), paddingRight: 0 }}>Volume</th>
              </tr>
            </thead>
            <tbody>
              {v.sel.rows.map((s, i) => (
                <tr key={`${s.name}-${i}`}>
                  <td style={{ ...td, padding: `${CELL_Y}px 10px ${CELL_Y}px 0`, fontSize: 13.5, color: INK }}>
                    {s.name}
                    {s.pr && <span style={{ color: PINK, fontSize: 11, marginLeft: 6 }}>{s.pr}</span>}
                  </td>
                  <td style={{ ...td, padding: `${CELL_Y}px 10px`, textAlign: 'right' }}>{s.sets}</td>
                  <td style={{ ...td, padding: `${CELL_Y}px 10px`, textAlign: 'right' }}>{s.weight}</td>
                  <td style={{ ...td, padding: `${CELL_Y}px 0 ${CELL_Y}px 10px`, textAlign: 'right' }}>{s.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 12, fontStyle: 'italic', color: MUTED, margin: '16px 0 0' }}>{v.sel.note}</p>
        </div>
      )}
    </div>
  );
}

/* ── Exercises ───────────────────────────────────────────────────────────── */

function Exercises({ v }: { v: TrainingVals }) {
  if (!v.exercises.length) {
    return <Empty title="No exercises logged yet." note="Every lift you record builds this table and its records." />;
  }
  const heads: Array<[string, 'left' | 'right']> = [
    ['Exercise', 'left'], ['Muscle group', 'left'], ['Equipment', 'left'],
    ['PR', 'right'], ['Est. 1RM', 'right'], ['Volume in range', 'right'],
    ['Trend', 'right'], ['History', 'right'],
  ];
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={v.query}
          onChange={(e) => v.onQuery(e.target.value)}
          placeholder="Search exercises"
          aria-label="Search exercises"
          style={{
            fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 14, padding: '11px 14px',
            border: RULE, background: CARD, color: INK, width: 260, outline: 'none',
          }}
        />
        <Segmented items={v.groups} />
        <span style={{ fontSize: 12, color: MUTED, marginLeft: 'auto' }}>{v.exerciseCount}</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: GRID_GAP, minWidth: 780 }}>
          <thead>
            <tr>
              {heads.map(([label, align], i) => (
                <th key={label} style={{ ...th(align), paddingLeft: i === 0 ? 0 : 12, paddingRight: i === heads.length - 1 ? 0 : 12 }}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {v.exercisesFiltered.map((e) => (
              <tr key={e.key} className="hv-cell" style={{ background: CARD }}>
                <td style={{ ...td, paddingLeft: 0, fontSize: 14, color: INK }}>{e.name}</td>
                <td style={{ ...td, fontSize: 12.5 }}>{e.group}</td>
                <td style={{ ...td, fontSize: 12.5 }}>{e.equipment}</td>
                <td style={{ ...td, textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: 17, color: INK }}>{e.pr}</td>
                <td style={{ ...td, textAlign: 'right' }}>{e.e1rm}</td>
                <td style={{ ...td, textAlign: 'right' }}>{e.volume}</td>
                <td style={{ ...td, textAlign: 'right', color: e.trendColor }}>{e.trend}</td>
                <td style={{ ...td, padding: `${CELL_Y}px 0 ${CELL_Y}px 14px`, width: 104 }}>
                  <svg viewBox="0 0 100 26" preserveAspectRatio="none" style={{ width: 100, height: 26, display: 'block' }} aria-hidden="true">
                    {e.spark && <path d={e.spark} fill="none" stroke={SPARK} strokeWidth="1.25" />}
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {v.noExercises && (
        <div style={{ borderBottom: RULE_SOFT }}>
          <Empty title="No exercises match that search." note="Try a muscle group, or clear the filters." />
        </div>
      )}
    </div>
  );
}

/* ── Progress ────────────────────────────────────────────────────────────── */

function Progress({ v }: { v: TrainingVals }) {
  return (
    <div style={{ marginTop: 44 }}>
      <section style={{ ...card, padding: CARD_PAD }}>
        {v.exSel ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: GRID_GAP, flexWrap: 'wrap' }}>
              <div>
                <Eyebrow>Strength progression</Eyebrow>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 14 }}>
                  <span style={display(44)}>{v.exSel.pr}</span>
                  <span style={{ fontSize: 13, color: v.exSel.trendColor, paddingBottom: 7 }}>{v.exSel.trend}</span>
                </div>
                <div style={{ fontSize: 13, color: SOFT, marginTop: 8 }}>
                  {v.exSel.name} — previous best {v.exSel.prev}, estimated 1RM {v.exSel.e1rm}, {v.exSel.sessions} session{v.exSel.sessions === 1 ? '' : 's'} in range
                </div>
              </div>
              <select
                value={v.exKey}
                onChange={(e) => v.onExercise(e.target.value)}
                aria-label="Choose an exercise"
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 13, padding: '10px 12px',
                  border: RULE, background: CARD, color: INK, outline: 'none',
                }}
              >
                {v.exercises.map((e) => <option key={e.key} value={e.name}>{e.name}</option>)}
              </select>
            </div>
            <svg viewBox="0 0 900 220" preserveAspectRatio="none" style={{ width: '100%', height: 220, marginTop: 22 }} role="img" aria-label="Strength progression for the selected exercise">
              <g stroke="rgba(0,0,0,0.06)" strokeWidth="0.5">
                <line x1="0" y1="30" x2="900" y2="30" />
                <line x1="0" y1="95" x2="900" y2="95" />
                <line x1="0" y1="160" x2="900" y2="160" />
              </g>
              {v.exSel.area && <path d={v.exSel.area} fill={PLUM_FILL_FAINT} />}
              {v.exSel.path && <path d={v.exSel.path} fill="none" stroke={PLUM} strokeWidth="1.5" />}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginTop: 8 }}>
              <span>{v.exSel.span}</span><span>Most recent</span>
            </div>
          </>
        ) : (
          <Empty title="No lifts logged yet." note="Progression needs at least one recorded set." />
        )}
      </section>

      <section className="training-pair" style={{ marginTop: GRID_GAP, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: GRID_GAP }}>
        <div style={{ ...card, padding: CARD_PAD }}>
          <Eyebrow>Strength distribution</Eyebrow>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 19 }}>
            {v.distribution.map((d) => (
              <div key={d.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: INK }}>
                  <span>{d.label}</span><span style={{ color: SOFT }}>{d.value}</span>
                </div>
                <Bar pct={d.pct} />
              </div>
            ))}
            {!v.distribution.length && <div style={{ fontSize: 13, color: MUTED }}>No lift volume in this window.</div>}
          </div>
          <p style={{ fontSize: 12, fontStyle: 'italic', color: MUTED, margin: '18px 0 0' }}>{v.distributionNote}</p>
        </div>
        <div style={{ ...card, padding: CARD_PAD }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <Eyebrow>Cardio fitness</Eyebrow>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 14 }}>
                <span style={display(40)}>{v.cardioValue}</span>
                <span style={{ fontSize: 13, color: MUTED, paddingBottom: 6 }}>{v.cardioUnit}</span>
              </div>
              <div style={{ fontSize: 13, color: v.cardioTrendColor, marginTop: 8 }}>{v.cardioTrend}</div>
            </div>
            <div style={{ maxWidth: 190 }}><Segmented items={v.cardioTabs} size="sm" /></div>
          </div>
          <svg viewBox="0 0 420 150" preserveAspectRatio="none" style={{ width: '100%', height: 150, marginTop: 20 }} role="img" aria-label="Cardio metric over the selected period">
            {v.cardioBars.map((b) => <rect key={b.key} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.fill} />)}
          </svg>
          <div style={{ fontSize: 12, color: SOFT, marginTop: 12 }}>
            VO₂ max is estimated by your watch from pace and heart rate, not measured in a lab.
          </div>
        </div>
      </section>

      <section style={{ marginTop: SECTION_GAP }}>
        <h2 style={{ ...display(24), margin: '0 0 14px' }}>Timeline</h2>
        <div style={{ borderTop: RULE }}>
          {v.timeline.map((t) => (
            <div key={t.key} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 20, padding: '22px 0', borderBottom: RULE_SOFT }}>
              <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, paddingTop: 2 }}>{t.date}</div>
              <div>
                <div style={{ fontSize: 15, color: INK }}>{t.title}</div>
                <div style={{ fontSize: 13, color: SOFT, marginTop: 4 }}>{t.detail}</div>
              </div>
            </div>
          ))}
          {!v.timeline.length && <Empty title="Nothing to show yet." note="Events appear as sessions and weigh-ins accumulate." />}
        </div>
      </section>
    </div>
  );
}

/* ── Goals ───────────────────────────────────────────────────────────────── */

function Goals({ v }: { v: TrainingVals }) {
  return (
    <div style={{ marginTop: 44 }}>
      <div className="training-pair" style={{ ...card, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {v.goals.map((g) => (
          <div key={g.key} style={{ padding: CARD_PAD, borderRight: RULE_SOFT, borderBottom: RULE_SOFT }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED }}>{g.dimension}</div>
              <div style={{ fontSize: 11, color: g.statusColor }}>{g.status}</div>
            </div>
            <h3 style={{ ...display(23), margin: '12px 0 0' }}>{g.title}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 14 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: INK }}>{g.current}</span>
              <span style={{ fontSize: 13, color: MUTED }}>of {g.target}</span>
            </div>
            <div style={{ height: 5, background: TRACK, marginTop: 16 }}>
              <div style={{ height: 5, width: g.pct, background: PLUM }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: SOFT, marginTop: 10 }}>
              <span>{g.pct} complete</span><span>{g.due}</span>
            </div>
            <div style={{ fontSize: 12.5, color: SOFT, marginTop: 18, paddingTop: 18, borderTop: RULE_SOFT, lineHeight: 1.65 }}>{g.note}</div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={v.newGoal}
        aria-expanded={v.goalDraft}
        className="hv-solid"
        style={{
          all: 'unset', cursor: 'pointer', marginTop: GRID_GAP, padding: '12px 24px',
          background: PLUM, color: '#FBF8FA', fontSize: 14, transition: 'background 200ms',
        }}
      >
        New goal →
      </button>
      {v.goalDraft && (
        <div style={{ marginTop: 20, border: RULE, background: TINT, padding: CARD_PAD, maxWidth: 520 }}>
          <Eyebrow>New goal</Eyebrow>
          <p style={{ fontSize: 13.5, color: SOFT, margin: '12px 0 0', lineHeight: 1.6 }}>
            The four goals above are the targets set in Settings, measured against what you have
            logged — nothing is entered twice. Custom goals with their own target and date are not
            stored yet; change a target in Settings to move one of these.
          </p>
          <button
            type="button"
            onClick={v.newGoal}
            style={{
              all: 'unset', cursor: 'pointer', marginTop: 16, fontSize: 13,
              color: INK, borderBottom: '0.5px solid rgba(0,0,0,0.24)',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Nutrition ───────────────────────────────────────────────────────────── */

function Nutrition({ v }: { v: TrainingVals }) {
  return (
    <div className="training-pair" style={{ marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: GRID_GAP, alignItems: 'start' }}>
      <div style={{ ...card, padding: CARD_PAD }}>
        <Eyebrow>{v.nutritionDayLabel}</Eyebrow>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 14 }}>
          <span style={display(44)}>{v.nutritionHeadline}</span>
          <span style={{ fontSize: 14, color: MUTED, paddingBottom: 6 }}>of {v.nutritionTargetShort}</span>
        </div>
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {v.nutrition.map((n) => (
            <div key={n.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 13.5, color: INK }}>{n.label}</span>
                <span style={{ fontSize: 12, color: SOFT }}>
                  {n.text}<span style={{ color: n.statusColor, marginLeft: 8 }}>{n.status}</span>
                </span>
              </div>
              <Bar pct={n.pct} color={n.bar} />
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, fontStyle: 'italic', color: MUTED, margin: '22px 0 0', paddingTop: 16, borderTop: RULE }}>
          Targets are guides, not tests. Being close to target most days is what moves the nutrition score.
        </p>
      </div>
      <div style={{ ...card, padding: CARD_PAD }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <Eyebrow>Weekly consistency</Eyebrow>
          <span style={{ fontSize: 12, color: SOFT }}>{v.nutritionConsistency}</span>
        </div>
        <svg viewBox="0 0 560 220" preserveAspectRatio="none" style={{ width: '100%', height: 220, marginTop: 20 }} role="img" aria-label="Daily calorie intake against target over the last 4 weeks">
          <line x1="0" y1={v.calTargetY} x2="560" y2={v.calTargetY} stroke={PLUM} strokeWidth="0.75" strokeDasharray="4 4" />
          {v.nutritionBars.map((b) => <rect key={b.key} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.fill} />)}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginTop: 10, gap: 12 }}>
          <span>4 weeks ago</span><span>Dashed line — {v.nutritionTargetNote}</span><span>Today</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', marginTop: GRID_GAP, borderTop: RULE }}>
          {v.nutritionStats.map((s) => (
            <div key={s.label} style={{ padding: '22px 18px 0 0' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: INK, marginTop: 6 }}>{s.value}</div>
              <div style={{ fontSize: 11.5, color: SOFT, marginTop: 4 }}>{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Recovery ────────────────────────────────────────────────────────────── */

function Recovery({ v }: { v: TrainingVals }) {
  return (
    <div style={{ marginTop: 44 }}>
      <section className="training-split" style={{ ...card, display: 'grid', gridTemplateColumns: '1fr 1.3fr' }}>
        <div style={{ padding: PANEL_PAD, borderRight: RULE }}>
          <Eyebrow>Recovery score</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 16 }}>
            <span style={{ ...display(70, PLUM), lineHeight: 0.9 }}>{v.recoveryScore}</span>
            <span style={{ fontSize: 13, color: MUTED, paddingBottom: 10 }}>/ 100</span>
          </div>
          <div style={{
            display: 'inline-block', marginTop: 16, padding: '5px 11px',
            background: TINT, color: PINK_DEEP, fontSize: 11.5, letterSpacing: '0.06em',
          }}>
            {v.recoveryBadge}
          </div>
          <div style={{ marginTop: 26, borderTop: RULE }}>
            {v.recoveryRows.map((r) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: `${ROW_Y}px 0`, borderBottom: RULE_SOFT }}>
                <span style={{ fontSize: 13, color: SOFT }}>{r.label}</span>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: INK }}>{r.value}</span>
                  <span style={{ fontSize: 11, color: r.color, minWidth: 62, textAlign: 'right' }}>{r.change}</span>
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11.5, fontStyle: 'italic', color: MUTED, margin: '18px 0 0', lineHeight: 1.6 }}>
            These figures support training decisions. They are not a medical assessment.
          </p>
        </div>
        <div style={{ padding: PANEL_PAD, background: TINT }}>
          <Eyebrow>Sleep duration — last {v.sleepCount} night{v.sleepCount === 1 ? '' : 's'}</Eyebrow>
          <svg viewBox="0 0 600 230" preserveAspectRatio="none" style={{ width: '100%', height: 230, marginTop: 18 }} role="img" aria-label="Sleep duration over recent nights against the target">
            <line x1="0" y1={v.sleepTargetY} x2="600" y2={v.sleepTargetY} stroke="rgba(0,0,0,0.18)" strokeWidth="0.75" strokeDasharray="4 4" />
            {v.sleepArea && <path d={v.sleepArea} fill={PINK_FILL} />}
            {v.sleepBig && <path d={v.sleepBig} fill="none" stroke={PINK} strokeWidth="1.5" />}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginTop: 8, gap: 12 }}>
            <span>{v.sleepCount} nights ago</span><span>8h target</span><span>Last night</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', marginTop: 26, borderTop: RULE }}>
            {v.recoveryStats.map((r) => (
              <div key={r.label} style={{ padding: '22px 18px 0 0' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>{r.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: INK, marginTop: 6 }}>{r.value}</div>
                <div style={{ fontSize: 11.5, color: r.color, marginTop: 4 }}>{r.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Insights ────────────────────────────────────────────────────────────── */

function Insights({ v }: { v: TrainingVals }) {
  if (!v.insights.length) {
    return <Empty title="No observations yet." note="Insights appear once a source has enough logged days to compare." />;
  }
  return (
    <div className="training-pair" style={{ ...card, marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {v.insights.map((i) => (
        <div key={i.key} style={{ padding: 36, borderRight: RULE_SOFT, borderBottom: RULE_SOFT }}>
          <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: i.tagColor }}>{i.tag}</div>
          <h3 style={{ ...display(23), margin: '12px 0 0' }}>{i.title}</h3>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: SOFT, margin: '14px 0 0', textWrap: 'pretty' }}>{i.body}</p>
          <div style={{ fontSize: 11.5, color: MUTED, marginTop: 16, paddingTop: 14, borderTop: RULE_SOFT }}>{i.source}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Settings ────────────────────────────────────────────────────────────── */

function Settings({ v }: { v: TrainingVals }) {
  return (
    <div style={{ marginTop: 44, maxWidth: 620 }}>
      <div style={card}>
        {v.settings.map((s) => (
          <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: GRID_GAP, padding: '26px 30px', borderBottom: RULE_SOFT }}>
            <div>
              <div style={{ fontSize: 14, color: INK }}>{s.label}</div>
              <div style={{ fontSize: 12.5, color: SOFT, marginTop: 4 }}>{s.note}</div>
            </div>
            <div style={{ fontSize: 13, color: MUTED, flexShrink: 0, textAlign: 'right' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, fontStyle: 'italic', color: MUTED, margin: '18px 0 0', lineHeight: 1.6 }}>
        Targets are set in code for now, in <code>targets.ts</code>. Every score on this dashboard is
        measured against them, so changing one changes what the dimensions mean.
      </p>
    </div>
  );
}
