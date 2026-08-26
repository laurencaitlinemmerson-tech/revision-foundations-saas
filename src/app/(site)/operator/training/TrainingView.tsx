'use client';

import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { TrainingVals } from './logic';
import {
  AMBER, BLUE, BLUE_LINE, BLUE_SOFT, CARD, GREEN, INK, LILAC_HAZE, MUTED, PAPER,
  PINK, PINK_DEEP, PINK_FILL, PINK_LINE, PINK_SOFT, PLUM, PLUM_FILL, PLUM_FILL_FAINT,
  PLUM_SOFT, ROSE, RULE, RULE_SOFT, SIDEBAR,
  SOFT, SPARK, TINT, TRACK, TRACK_PREV,
} from './palette';
import { BarSeries, Figure, LineSeries, Sparkline } from './charts';
import { TAGS } from './palette';

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

/** A subject label, set in its own colour — the design fills nothing. */
function Pill({ label, tone = 'grey' }: { label: string; tone?: keyof typeof TAGS }) {
  const t = TAGS[tone] ?? TAGS.grey;
  return (
    <span style={{
      fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
      color: t.fg, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

/** Which pill colour a subject takes. */
const toneFor = (tag: string): keyof typeof TAGS => {
  const t = tag.toLowerCase();
  if (/strength|consistency|pattern/.test(t)) return 'plum';
  if (/cardio|recovery|plateau/.test(t)) return 'pink';
  if (/body|year|nutrition/.test(t)) return 'blue';
  if (/activity/.test(t)) return 'green';
  return 'grey';
};
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
            background: t.active ? INK : 'transparent',
            color: t.active ? '#FAFAF8' : SOFT,
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
 * Twelve months of the six dimensions, sharing one crosshair.
 *
 * Replaces the radar, which plotted six numbers already listed beside it. One
 * hover reads every dimension for that month at once, which is the comparison
 * the radar was pretending to make.
 */
function Ribbon({ ribbon }: { ribbon: TrainingVals['ribbon'] }) {
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  if (!ribbon.ok) {
    return <div style={{ fontSize: 12.5, color: MUTED, fontStyle: 'italic' }}>{ribbon.note}</div>;
  }

  const pick = (clientX: number) => {
    const el = ref.current;
    if (!el || ribbon.months.length < 2) return;
    const r = el.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    setActive(Math.round(frac * (ribbon.months.length - 1)));
  };

  const month = active === null ? null : ribbon.months[active] ?? null;
  const step = ribbon.width / Math.max(1, ribbon.months.length - 1);

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        gap: 12, marginBottom: 12,
      }}>
        <Eyebrow>Twelve months</Eyebrow>
        <span style={{ fontSize: 11.5, color: month ? INK : MUTED }}>
          {month ? month.label : 'Hover to read a month'}
        </span>
      </div>

      <div
        ref={ref}
        onMouseMove={(e) => pick(e.clientX)}
        onMouseLeave={() => setActive(null)}
        onTouchStart={(e) => pick(e.touches[0].clientX)}
        onTouchMove={(e) => pick(e.touches[0].clientX)}
        onTouchEnd={() => setActive(null)}
        style={{ touchAction: 'pan-y' }}
      >
        {ribbon.rows.map((row) => {
          const at = active === null ? null : row.points[active] ?? null;
          const value = month?.scores?.[row.key];
          return (
            <div key={row.key} style={{
              display: 'grid', gridTemplateColumns: '96px 1fr 62px',
              gap: 14, alignItems: 'center',
              padding: '5px 0', borderBottom: RULE_SOFT,
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span style={{ width: 8, height: 8, background: row.colour, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: INK, whiteSpace: 'nowrap' }}>{row.label}</span>
              </span>

              <svg viewBox={`0 0 ${ribbon.width} ${ribbon.rowHeight}`} preserveAspectRatio="none"
                style={{ width: '100%', height: ribbon.rowHeight, display: 'block' }}
                role="img" aria-label={`${row.label} across twelve months`}>
                <line x1="0" y1={ribbon.rowHeight - 3} x2={ribbon.width} y2={ribbon.rowHeight - 3}
                  stroke="rgba(34,28,36,0.07)" strokeWidth="0.5" />
                {row.path && (
                  <path d={row.path} fill="none" stroke={row.colour} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                )}
                {active !== null && (
                  <line x1={active * step} y1="0" x2={active * step} y2={ribbon.rowHeight}
                    stroke="rgba(34,28,36,0.22)" strokeWidth="0.75" vectorEffect="non-scaling-stroke" />
                )}
                {at?.cy != null && <circle cx={at.cx} cy={at.cy} r="3" fill={row.colour} />}
              </svg>

              <span style={{ textAlign: 'right', fontSize: 12, whiteSpace: 'nowrap' }}>
                {month ? (
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: value == null ? MUTED : INK }}>
                    {value == null ? '—' : value}
                  </span>
                ) : (
                  <span style={{ color: row.changeColour }}>{row.change}</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 11, color: MUTED, marginTop: 12, lineHeight: 1.6 }}>{ribbon.note}</div>
    </div>
  );
}

/**
 * The whole history, with the selected window shown inside it.
 *
 * Drag across to set a custom range. Everything above uses one window at a time,
 * which makes it easy to forget how much of the record you are not looking at —
 * this puts the eight years on screen and marks the slice in view.
 */
function HistoryBrush({ history }: { history: NonNullable<TrainingVals['history']> }) {
  // The drag origin lives in a ref, not state. A mousedown and the first
  // mousemove can land in the same frame, and a handler closed over state would
  // still see null there — which is exactly what a quick drag looks like.
  const origin = useRef<number | null>(null);
  const last = useRef(0);
  const [band, setBand] = useState<{ from: number; to: number } | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const frac = (clientX: number) => {
    const el = ref.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width));
  };

  const start = (clientX: number) => {
    const f = frac(clientX);
    origin.current = f;
    last.current = f;
    setBand({ from: f, to: f });
  };
  const move = (clientX: number) => {
    if (origin.current === null) return;
    const f = frac(clientX);
    last.current = f;
    setBand({ from: origin.current, to: f });
  };
  const end = () => {
    const from = origin.current;
    origin.current = null;
    setBand(null);
    // A few pixels is a mis-click, not a selection.
    if (from !== null && Math.abs(last.current - from) > 0.004) {
      history.selectRange(from, last.current);
    }
  };

  const W = history.width;
  const H = history.height;
  const shown = band
    ? { x: Math.min(band.from, band.to) * W, w: Math.abs(band.to - band.from) * W }
    : { x: history.selFrom, w: history.selWidth };

  return (
    <div style={{ ...card, padding: '22px 26px 20px', marginTop: GRID_GAP }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <Eyebrow>The whole record · {history.count} weigh-ins</Eyebrow>
        <button
          type="button" onClick={history.reset} className="hv-tab"
          style={{
            all: 'unset', cursor: 'pointer', padding: '4px 11px', fontSize: 11.5,
            color: SOFT, border: RULE, background: CARD,
          }}
        >
          Reset to month
        </button>
      </div>

      <div
        ref={ref}
        onMouseDown={(e) => start(e.clientX)}
        onMouseMove={(e) => move(e.clientX)}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={(e) => start(e.touches[0].clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        onTouchEnd={end}
        style={{ marginTop: 14, cursor: 'ew-resize', touchAction: 'pan-y', userSelect: 'none' }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
          style={{ width: '100%', height: H, display: 'block' }}
          role="img" aria-label={`Weight across the whole record, ${history.startLabel} to ${history.endLabel}`}>
          <rect x={shown.x} y="0" width={shown.w} height={H} fill={PLUM_FILL_FAINT} />
          <rect x={shown.x} y="0" width="1" height={H} fill={PLUM} />
          <rect x={shown.x + shown.w - 1} y="0" width="1" height={H} fill={PLUM} />
          {history.years.map((y) => (
            <line key={y.key} x1={y.x} y1="0" x2={y.x} y2={H}
              stroke="rgba(34,28,36,0.10)" strokeWidth="0.5" />
          ))}
          <path d={history.path} fill="none" stroke={SPARK} strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginTop: 8, gap: 12 }}>
        <span>{history.startLabel}</span>
        <span style={{ fontStyle: 'italic' }}>Drag across to select a range</span>
        <span>{history.endLabel}</span>
      </div>
    </div>
  );
}

/**
 * A month at a time, the way a calendar is actually read.
 *
 * The heatmap shows twelve weeks as an abstract grid, which is good for spotting
 * a pattern and useless for answering "what did I do on the 14th". This is the
 * same information with the dates on it.
 */
function Calendar({ cal, detail }: { cal: TrainingVals['calendar']; detail: TrainingVals['dayDetail'] }) {
  return (
    <div style={{ ...card, padding: CARD_PAD }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <Eyebrow>Calendar</Eyebrow>
          <div style={{ ...display(22), marginTop: 8 }}>{cal.monthLabel}</div>
          <div style={{ fontSize: 11.5, color: MUTED, marginTop: 5 }}>{cal.summary}</div>
        </div>
        <div style={{ display: 'flex', border: RULE, background: CARD }}>
          <button type="button" onClick={cal.prev} aria-label="Previous month" className="hv-tab"
            style={{ all: 'unset', cursor: 'pointer', padding: '8px 15px', fontSize: 15, color: SOFT }}>‹</button>
          <button type="button" onClick={cal.next} aria-label="Next month" disabled={!cal.canNext}
            className={cal.canNext ? 'hv-tab' : undefined}
            style={{
              all: 'unset', cursor: cal.canNext ? 'pointer' : 'default', padding: '8px 15px',
              fontSize: 15, color: cal.canNext ? SOFT : 'rgba(34,28,36,0.18)',
              borderLeft: RULE,
            }}>›</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, marginTop: 22 }}>
        {cal.dayNames.map((d) => (
          <div key={d} style={{
            fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: MUTED, paddingBottom: 8, textAlign: 'center',
          }}>
            {d}
          </div>
        ))}

        {cal.cells.map((c) => c.pad ? (
          <div key={c.key} />
        ) : (
          <button
            key={c.key}
            type="button"
            onClick={c.select}
            disabled={c.future}
            aria-pressed={c.selected}
            aria-label={`${c.date}${c.hasSession ? ', has a session' : ''}`}
            className={c.future ? undefined : 'hv-tab'}
            style={{
              all: 'unset', boxSizing: 'border-box',
              cursor: c.future ? 'default' : 'pointer',
              minHeight: 62, padding: '7px 8px',
              background: c.selected ? TINT : c.tint,
              border: c.selected
                ? `1px solid ${PLUM}`
                : c.isToday ? `1px solid ${PINK}` : RULE_SOFT,
              opacity: c.future ? 0.4 : 1,
              display: 'flex', flexDirection: 'column', gap: 4,
              transition: 'background 150ms',
            }}
          >
            <span style={{
              fontSize: 11, color: c.isToday ? PLUM : c.hasSession ? INK : MUTED,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {c.day}
            </span>

            {/* One dot per session, coloured by what kind it was. */}
            {c.hasSession && (
              <span style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {Array.from({ length: Math.min(3, c.strength) }, (_, i) => (
                  <span key={`s${i}`} style={{ width: 5, height: 5, borderRadius: '50%', background: PLUM }} />
                ))}
                {Array.from({ length: Math.min(3, c.cardio) }, (_, i) => (
                  <span key={`c${i}`} style={{ width: 5, height: 5, borderRadius: '50%', background: PINK }} />
                ))}
                {Array.from({ length: Math.min(2, c.other) }, (_, i) => (
                  <span key={`o${i}`} style={{ width: 5, height: 5, borderRadius: '50%', background: MUTED }} />
                ))}
              </span>
            )}

            {c.weight && (
              <span style={{ fontSize: 10, color: SOFT, marginTop: 'auto', fontVariantNumeric: 'tabular-nums' }}>
                {c.weight}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 18, marginTop: 16, fontSize: 11, color: MUTED, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: PLUM }} />Strength
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: PINK }} />Cardio
        </span>
        <span style={{ marginLeft: 'auto' }}>Select a day to open it</span>
      </div>

      {detail && (
        <div style={{ marginTop: 24, paddingTop: 22, borderTop: RULE }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ ...display(20) }}>{detail.label}</div>
            <button
              type="button" onClick={detail.close} className="hv-tab"
              style={{
                all: 'unset', cursor: 'pointer', padding: '4px 11px', fontSize: 11.5,
                color: SOFT, border: RULE, background: CARD,
              }}
            >
              Close
            </button>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(112px, 1fr))',
            gap: 0, marginTop: 18, borderTop: RULE_SOFT,
          }}>
            {detail.metrics.map((m) => (
              <div key={m.label} style={{ padding: '14px 14px 14px 0' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>
                  {m.label}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: INK, marginTop: 5 }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, paddingTop: 16, borderTop: RULE_SOFT }}>
            {detail.empty ? (
              <div style={{ fontSize: 12.5, color: MUTED, fontStyle: 'italic' }}>
                No session logged on this day.
              </div>
            ) : detail.sessions.map((sn) => (
              <div key={sn.key} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                gap: 14, padding: '11px 0', borderBottom: RULE_SOFT, flexWrap: 'wrap',
              }}>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
                  <span style={{
                    width: 6, height: 6, flexShrink: 0,
                    background: sn.kind === 'Cardio' ? PINK : sn.kind === 'Other' ? MUTED : PLUM,
                  }} />
                  <span style={{ fontSize: 13, color: INK }}>{sn.name}</span>
                  {sn.source && <span style={{ fontSize: 11, color: MUTED }}>{sn.source}</span>}
                </span>
                <span style={{ fontSize: 12, color: SOFT }}>{sn.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
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

      <main className="training-main" style={{ padding: `${PAGE_TOP}px ${PAGE_X}px 120px`, maxWidth: 1320, margin: '0 auto', width: '100%' }}>
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

        {v.focusLabel && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
            marginTop: 18, padding: '12px 18px', background: TINT, border: RULE,
          }}>
            <span style={{ fontSize: 12.5, color: INK }}>{v.focusLabel}</span>
            <span style={{ fontSize: 11.5, color: MUTED }}>{v.focusCount}</span>
            <button
              type="button"
              onClick={v.clearFocus}
              className="hv-tab"
              style={{
                all: 'unset', cursor: 'pointer', marginLeft: 'auto', padding: '5px 12px',
                fontSize: 11.5, letterSpacing: '0.06em', color: SOFT, border: RULE, background: CARD,
              }}
            >
              Clear filter
            </button>
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
            {v.screen === 'Calendar' && <CalendarScreen v={v} />}
            {v.screen === 'Progress' && <Progress v={v} />}
            {v.screen === 'Goals' && <Goals v={v} />}
            {v.screen === 'Nutrition' && <Nutrition v={v} />}
            {v.screen === 'Recovery' && <Recovery v={v} />}
            {v.screen === 'Review' && <Review v={v} />}
            {v.screen === 'Evidence' && <Evidence v={v} />}
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

/**
 * The selected period, drawn as the thing it is made of.
 *
 * Week becomes seven days side by side, month becomes its weeks, year becomes
 * its months. A single day has nothing smaller to break into — the data is daily
 * totals all the way down — so Day shows the day itself against yesterday.
 * Changing the period changes what you are looking at, not only what it says.
 */
function PeriodView({ pv }: { pv: TrainingVals['periodView'] }) {
  if (pv.shape === 'day') {
    return (
      <section style={{ marginTop: SECTION_GAP }}>
        <SectionHeading title={pv.title} aside="Against yesterday" />
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(168px, 1fr))',
          marginTop: 6,
        }}>
          {pv.tiles.map((t) => (
            <div key={t.label} style={{ padding: '22px 24px 22px 0', borderBottom: RULE_SOFT }}>
              <div style={eyebrow}>{t.label}</div>
              <div style={{ marginTop: 10 }}>
                <Figure value={t.value} style={display(30, t.colour)} />
              </div>
              <div style={{ fontSize: 11.5, color: SOFT, marginTop: 8, lineHeight: 1.55 }}>{t.note}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12.5, color: MUTED, margin: '18px 0 0', lineHeight: 1.7, maxWidth: '68ch' }}>
          {pv.note}
        </p>
      </section>
    );
  }

  /* Seven days fit as columns; weeks and months read better as rows. */
  const asColumns = pv.shape === 'days';
  const countLabel = `${pv.units.length} ${pv.shape === 'days' ? 'days' : pv.shape}`;

  return (
    <section style={{ marginTop: SECTION_GAP }}>
      <SectionHeading title={pv.title} aside={countLabel} />

      {asColumns ? (
        <div style={{
          display: 'grid', gridTemplateColumns: `repeat(${pv.units.length}, 1fr)`,
          marginTop: 6, borderTop: RULE_SOFT,
        }}>
          {pv.units.map((u) => (
            <div key={u.key} style={{
              padding: '18px 14px 18px 0',
              background: u.current ? TINT : 'transparent',
              borderBottom: RULE_SOFT,
              opacity: u.empty ? 0.42 : 1,
            }}>
              <div style={{
                fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: u.current ? PLUM : INK,
              }}>
                {u.label}
              </div>
              <div style={{ fontSize: 10.5, color: MUTED, marginTop: 3 }}>{u.sub}</div>

              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: INK, marginTop: 14, letterSpacing: '-0.01em' }}>
                {u.stepsLabel}
              </div>
              <div style={{ height: 3, background: TRACK, marginTop: 8 }}>
                <div style={{
                  height: 3, width: `${u.stepPct}%`, background: u.stepPct >= 100 ? GREEN : PLUM,
                  transition: 'width 420ms cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>

              <div style={{ marginTop: 14, display: 'flex', gap: 4, alignItems: 'center', minHeight: 12 }}>
                {u.sessions > 0
                  ? Array.from({ length: Math.min(4, u.sessions) }, (_, i) => (
                      <span key={i} style={{ width: 5, height: 5, background: PINK }} />
                    ))
                  : <span style={{ fontSize: 10.5, color: MUTED }}>rest</span>}
              </div>

              <div style={{ fontSize: 10.5, color: SOFT, marginTop: 12, lineHeight: 1.7 }}>
                <div>{u.sleepLabel === '—' ? <span style={{ color: MUTED }}>no sleep</span> : u.sleepLabel}</div>
                <div>{u.weightLabel === '—' ? <span style={{ color: MUTED }}>—</span> : u.weightLabel}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 6, borderTop: RULE_SOFT }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '150px 104px 1fr 96px 84px 88px',
            gap: 20, padding: '10px 0', ...eyebrow,
          }}>
            <span />
            <span style={{ textAlign: 'right' }}>Steps</span>
            <span />
            <span style={{ textAlign: 'right' }}>Sessions</span>
            <span style={{ textAlign: 'right' }}>Sleep</span>
            <span style={{ textAlign: 'right' }}>Weight</span>
          </div>
          {pv.units.map((u) => (
            <div key={u.key} style={{
              display: 'grid', gridTemplateColumns: '150px 104px 1fr 96px 84px 88px',
              gap: 20, alignItems: 'center',
              padding: `${ROW_Y}px 0`, borderTop: RULE_SOFT,
              background: u.current ? TINT : 'transparent',
              opacity: u.empty ? 0.42 : 1,
            }}>
              <span>
                <span style={{ fontSize: 13.5, color: u.current ? PLUM : INK, display: 'block' }}>{u.label}</span>
                <span style={{ fontSize: 10.5, color: MUTED }}>{u.sub}</span>
              </span>

              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 19, color: INK,
                textAlign: 'right', fontVariantNumeric: 'tabular-nums',
              }}>
                {u.stepsLabel}
              </span>

              <span style={{ display: 'block', height: 5, background: TRACK }}>
                <span style={{
                  display: 'block', height: 5, width: `${u.stepPct}%`,
                  background: u.stepPct >= 100 ? GREEN : PLUM,
                  transition: 'width 420ms cubic-bezier(0.4,0,0.2,1)',
                }} />
              </span>

              <span style={{ fontSize: 12.5, color: u.sessions ? SOFT : MUTED, textAlign: 'right' }}>
                {u.sessions ? `${u.sessions} session${u.sessions === 1 ? '' : 's'}` : 'none'}
              </span>
              <span style={{ fontSize: 12.5, color: u.sleepLabel === '—' ? MUTED : SOFT, textAlign: 'right' }}>{u.sleepLabel}</span>
              <span style={{ fontSize: 12.5, color: u.weightLabel === '—' ? MUTED : SOFT, textAlign: 'right' }}>{u.weightLabel}</span>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 12.5, color: MUTED, margin: '18px 0 0', lineHeight: 1.7, maxWidth: '68ch' }}>
        {pv.note}
      </p>
    </section>
  );
}

function Dashboard({ v }: { v: TrainingVals }) {
  return (
    <div>
      {/* The brief already decides what is worth saying about yesterday, so the
          dashboard surfaces that rather than forming a second opinion beside it. */}
      {v.brief.ok && (v.brief.cues.length > 0 || v.brief.staleNote) && (
        <section style={{ marginTop: 36, paddingBottom: 24, borderBottom: RULE }}>
          <Eyebrow>Worth knowing today</Eyebrow>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {v.brief.staleNote && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span style={{ width: 5, height: 5, background: AMBER, flexShrink: 0, marginTop: 6 }} />
                <span style={{ fontSize: 14, color: SOFT, lineHeight: 1.6 }}>{v.brief.staleNote}</span>
              </div>
            )}
            {v.brief.cues.map((c) => (
              <div key={c.key} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span style={{ width: 5, height: 5, background: c.colour, flexShrink: 0, marginTop: 6 }} />
                <span style={{ fontSize: 14, color: SOFT, lineHeight: 1.6 }}>{c.text}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <PeriodView pv={v.periodView} />

      <section style={{ ...card, marginTop: SECTION_GAP }}>
        <div className="training-split" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr' }}>
          <div style={{ padding: PANEL_PAD, borderRight: RULE }}>
            <Eyebrow>Fitness overview</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: 18 }}>
              <Figure value={v.overall} style={{ ...display(76, PLUM), lineHeight: 0.9, letterSpacing: '-0.02em' }} />
              <div style={{ paddingBottom: 10 }}>
                <div style={{ fontSize: 13, color: MUTED }}>/ 100</div>
                <div style={{ fontSize: 13, color: v.overallDeltaColor, marginTop: 4 }}>{v.overallDelta}</div>
              </div>
            </div>
            {v.movers.length > 0 && (
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: RULE_SOFT }}>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>
                  What moved
                </div>
                <div style={{ display: 'flex', gap: 22, marginTop: 12, flexWrap: 'wrap' }}>
                  {v.movers.map((m) => (
                    <div key={m.label}>
                      <div style={{ fontSize: 12, color: INK }}>{m.label}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 3 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: m.color }}>{m.text}</span>
                        <span style={{ fontSize: 11, color: MUTED }}>{m.from} → {m.to}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p style={{ fontSize: 14, lineHeight: 1.75, color: SOFT, margin: '24px 0 0', maxWidth: '46ch', textWrap: 'pretty' }}>
              Fitness is a combination of strength, cardiovascular fitness, activity, nutrition,
              recovery and consistency. No single dimension carries the score, and a dimension with
              nothing logged is left out rather than counted as zero.
            </p>
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {v.dims.map((d) => (
                <div key={d.label}>
                  <button
                    type="button"
                    onClick={d.toggle}
                    aria-expanded={d.open}
                    className="hv-tab"
                    style={{
                      all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
                      boxSizing: 'border-box', padding: '9px 10px 11px', margin: '0 -10px',
                      transition: 'background 150ms',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 13, color: INK }}>
                      <span style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                        <span style={{ fontSize: 9, color: MUTED, transform: d.open ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 160ms' }}>▶</span>
                        {d.label}
                      </span>
                      <span style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>{d.score}</span>
                        <span style={{ fontSize: 11, color: d.deltaColor, minWidth: 44, textAlign: 'right' }}>{d.delta}</span>
                      </span>
                    </div>
                    <div style={{ height: 3, background: TRACK, marginTop: 7 }}>
                      <div style={{ height: 3, width: d.pct, background: d.bar, transition: 'width 320ms cubic-bezier(0.4,0,0.2,1)' }} />
                    </div>
                  </button>

                  {d.open && (
                    <div style={{ padding: '14px 0 18px 16px', borderLeft: `1px solid ${TRACK_PREV}`, margin: '4px 0 8px 2px' }}>
                      {d.parts.map((p) => (
                        <div key={p.label} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                            <span style={{ fontSize: 12.5, color: INK }}>{p.label}</span>
                            <span style={{ fontSize: 12, color: p.color, fontFamily: 'var(--font-display)' }}>{p.valueLabel}</span>
                          </div>
                          <div style={{ height: 2, background: TRACK, marginTop: 6 }}>
                            <div style={{ height: 2, width: p.pct, background: p.color }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 5 }}>
                            <span style={{ fontSize: 11, color: SOFT, lineHeight: 1.5 }}>{p.detail}</span>
                            <span style={{ fontSize: 10.5, color: MUTED, flexShrink: 0 }}>{p.weightLabel}</span>
                          </div>
                        </div>
                      ))}
                      {d.missingNote && (
                        <div style={{ fontSize: 11.5, color: MUTED, fontStyle: 'italic', lineHeight: 1.6, marginTop: 10 }}>
                          {d.missingNote}
                        </div>
                      )}
                      {d.lever && (
                        <div style={{ fontSize: 12, color: INK, lineHeight: 1.6, marginTop: 10, paddingTop: 10, borderTop: RULE_SOFT }}>
                          {d.lever}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={d.openScreen}
                        style={{
                          all: 'unset', cursor: 'pointer', marginTop: 12, fontSize: 11.5,
                          color: PLUM, borderBottom: `1px solid ${TRACK_PREV}`,
                        }}
                      >
                        Open {d.screen} →
                      </button>
                    </div>
                  )}
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
              aria-label={`Radar of six dimensions: ${v.dims.map((d) => `${d.label} ${d.score}`).join(', ')}`}
            >
              <g fill="none" stroke="rgba(34,28,36,0.09)" strokeWidth="0.5">
                {v.radarRings.map((r, i) => <polygon key={i} points={r.points} />)}
              </g>
              <g stroke="rgba(34,28,36,0.07)" strokeWidth="0.5">
                {v.radarSpokes.map((sp, i) => <line key={i} x1={sp.x1} y1={sp.y1} x2={sp.x2} y2={sp.y2} />)}
              </g>
              <polygon points={v.radarPrev} fill="none" stroke={PINK_LINE} strokeWidth="1" strokeDasharray="3 3" />
              <polygon points={v.radarNow} fill={PLUM_FILL} stroke={PLUM} strokeWidth="1.25" />
              <g>{v.radarDots.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.75" fill={PLUM} />)}</g>
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

      {/* The ribbon gets its own width — six rows of twelve months were cramped
          in a side panel, and the whole point is reading across them. */}
      <section style={{ ...card, marginTop: GRID_GAP, padding: PANEL_PAD }}>
        <Ribbon ribbon={v.ribbon} />
      </section>

      <div className="training-split-3" style={{ ...card, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', marginTop: GRID_GAP }}>
        {v.topCards.map((c) => (
          <div key={c.eyebrow} style={{ padding: '30px 34px', borderRight: RULE }}>
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <div style={{ fontSize: 13, color: INK, marginTop: 14 }}>{c.label}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 6 }}>
              <Figure value={c.value} style={display(40)} />
              <span style={{ fontSize: 13, color: MUTED, paddingBottom: 5 }}>{c.unit}</span>
            </div>
            <div style={{ fontSize: 12, color: c.trendColor, marginTop: 8 }}>{c.trend}</div>
            <div style={{ marginTop: 16 }}>
              <Sparkline path={c.spark} stroke={SPARK} label={`${c.label} over ${v.rangeLabel}`} />
            </div>
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
                <Figure value={v.bodyValue} style={display(44)} />
                <span style={{ fontSize: 14, color: MUTED, paddingBottom: 6 }}>{v.bodyUnit}</span>
              </div>
              <div style={{ fontSize: 13, color: SOFT, marginTop: 8 }}>{v.bodyDelta}</div>
            </div>
            <Segmented items={v.bodyTabs} size="sm" />
          </div>
          <div style={{ marginTop: 22 }}>
            <LineSeries
              marks={v.bodyPoints}
              path={v.bodyPath}
              area={v.bodyArea}
              width={680}
              height={166}
              gridY={[24, 83, 142]}
              fill={PLUM_FILL_FAINT}
              hint={`${v.bodyCount} weigh-ins, ${v.bodyStart} to ${v.bodyEnd} — hover to read one`}
            />
          </div>
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
            <Figure value={v.recoveryScore} style={display(44)} />
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
          <div style={{ marginTop: 12 }}>
            <Sparkline path={v.sleepPath} stroke={PINK} width={320} height={70} label="Sleep duration trend" />
          </div>
          <div style={{ fontSize: 12, color: SOFT, marginTop: 10 }}>{v.sleepNote}</div>
        </div>
      </section>

      <section style={{ ...card, marginTop: SECTION_GAP, padding: CARD_PAD }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: GRID_GAP, flexWrap: 'wrap' }}>
          <div>
            <Eyebrow>Consistency</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 12 }}>
              <Figure value={v.consistencyScore} style={display(44)} />
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
                    <button
                      key={day.key}
                      type="button"
                      onClick={day.select}
                      disabled={day.future}
                      aria-pressed={day.selected}
                      aria-label={day.tip || 'No data'}
                      title={day.tip}
                      style={{
                        all: 'unset', boxSizing: 'border-box', display: 'block',
                        cursor: day.future ? 'default' : 'pointer',
                        width: HEAT_CELL, height: HEAT_CELL, background: day.color,
                        border: day.selected
                          ? `1.5px solid ${PLUM}`
                          : day.color === 'transparent'
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
            <div style={{ marginTop: 10, color: SOFT }}>Select one to open it.</div>
          </div>
        </div>

        {/* The same panel the calendar opens. Both plot the same days, so
            selecting one should not behave differently for being a square. */}
        {v.dayDetail && (
          <div style={{ marginTop: 26, paddingTop: 22, borderTop: RULE }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <div style={display(20)}>{v.dayDetail.label}</div>
              <span style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button" onClick={v.dayDetail.openSessions} className="hv-tab"
                  style={{
                    all: 'unset', cursor: 'pointer', padding: '4px 11px', fontSize: 11.5,
                    color: PLUM, border: RULE, background: CARD,
                  }}
                >
                  All sessions →
                </button>
                <button
                  type="button" onClick={v.dayDetail.close} className="hv-tab"
                  style={{
                    all: 'unset', cursor: 'pointer', padding: '4px 11px', fontSize: 11.5,
                    color: SOFT, border: RULE, background: CARD,
                  }}
                >
                  Close
                </button>
              </span>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(108px, 1fr))',
              marginTop: 16, borderTop: RULE_SOFT,
            }}>
              {v.dayDetail.metrics.map((m) => (
                <div key={m.label} style={{ padding: '14px 14px 14px 0' }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>{m.label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: INK, marginTop: 5 }}>{m.value}</div>
                </div>
              ))}
            </div>

            {v.dayDetail.empty ? (
              <div style={{ fontSize: 12.5, color: MUTED, fontStyle: 'italic', marginTop: 14 }}>
                No session logged on this day.
              </div>
            ) : (
              <div style={{ marginTop: 12, paddingTop: 14, borderTop: RULE_SOFT }}>
                {v.dayDetail.sessions.map((sn) => (
                  <div key={sn.key} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    gap: 14, padding: '10px 0', borderBottom: RULE_SOFT, flexWrap: 'wrap',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
                      <span style={{
                        width: 6, height: 6, flexShrink: 0,
                        background: sn.kind === 'Cardio' ? PINK : sn.kind === 'Other' ? MUTED : PLUM,
                      }} />
                      <span style={{ fontSize: 13, color: INK }}>{sn.name}</span>
                    </span>
                    <span style={{ fontSize: 12, color: SOFT }}>{sn.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
        <Figure value={p.headline} style={display(40)} />
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
      {/* The scoreboard leads — compact, two figures and a line, rather than the
          oversized headline it replaced. */}
      {h.connected && (
        <div style={{ ...card, padding: '30px 40px', background: TINT, marginBottom: GRID_GAP }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <Figure value={String(h.yourPoints)} style={{ ...display(46, h.leader === 'you' ? PLUM : INK), lineHeight: 1 }} />
              <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED, marginTop: 9 }}>
                {h.you.name}
              </div>
            </div>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED }}>vs</div>
            <div style={{ textAlign: 'center' }}>
              <Figure value={String(h.theirPoints)} style={{ ...display(46, h.leader === 'them' ? PINK : INK), lineHeight: 1 }} />
              <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED, marginTop: 9 }}>
                {h.them?.name}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 22, paddingTop: 18, borderTop: RULE }}>
            <div style={{ ...display(20), color: INK }}>{h.scoreline}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>
              {h.weekLabel} · {h.roundsDecided} of {h.roundsTotal} rounds settled
            </div>
          </div>
        </div>
      )}

      {!h.connected && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          gap: 16, flexWrap: 'wrap', paddingBottom: 14, borderBottom: RULE,
        }}>
          <Eyebrow>{h.weekLabel}</Eyebrow>
          <span style={{ fontSize: 12.5, color: SOFT }}>Not connected</span>
        </div>
      )}

      {/* What the rounds still in reach would actually take. */}
      {h.connected && h.plan.length > 0 && (
        <section style={{ marginBottom: GRID_GAP }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            gap: 12, paddingBottom: 12, borderBottom: RULE, flexWrap: 'wrap',
          }}>
            <Eyebrow>Still in reach</Eyebrow>
            <span style={{ fontSize: 12, color: SOFT }}>{h.planNote}</span>
          </div>
          {h.plan.map((p) => (
            <div key={p.key} style={{
              display: 'grid', gridTemplateColumns: '150px 1fr', gap: 20,
              padding: '15px 0', borderBottom: RULE_SOFT, alignItems: 'baseline',
            }}>
              <span style={{ fontSize: 12.5, color: INK }}>{p.label}</span>
              <span style={{ fontSize: 13, color: SOFT, lineHeight: 1.6 }}>{p.gap}</span>
            </div>
          ))}
        </section>
      )}

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
              {r.gap && (
                <div style={{ fontSize: 11.5, color: PINK_DEEP, marginTop: 10, textAlign: 'center' }}>
                  {r.gap}
                </div>
              )}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, fontStyle: 'italic', color: MUTED, margin: '18px 0 0', lineHeight: 1.75, maxWidth: '68ch' }}>
          {h.fairnessNote}
        </p>
      </section>

    </div>
  );
}

/* ── Workouts ────────────────────────────────────────────────────────────── */

function Workouts({ v }: { v: TrainingVals }) {
  if (!v.workouts.length) {
    return (
      <div style={{ marginTop: 40 }}>
        <ActivityStrip v={v} />
        <Empty title="No sessions in this window." note="Lifts you log and workouts Apple Health syncs both land here." />
      </div>
    );
  }

  // Grouped by week, so the list reads as a training history rather than an
  // undifferentiated stack — a quiet fortnight looks quiet.
  const weeks: Array<{ key: string; label: string; rows: typeof v.workouts }> = [];
  for (const w of v.workouts) {
    const last = weeks[weeks.length - 1];
    if (last && last.key === w.week) last.rows.push(w);
    else weeks.push({ key: w.week, label: w.weekLabel, rows: [w] });
  }

  return (
    <div style={{ marginTop: 40 }}>
      <ActivityStrip v={v} />

      <div className="training-pair" style={{
        display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 48,
        alignItems: 'start', marginTop: SECTION_GAP,
      }}>
        <div>
          <div style={{ ...eyebrow, paddingBottom: 14, borderBottom: RULE }}>{v.workoutsHeading}</div>

          {weeks.map((wk) => (
            <div key={wk.key}>
              <div style={{
                fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: MUTED, padding: '26px 0 10px',
              }}>
                {wk.label}
              </div>

              {wk.rows.map((w) => (
                <button
                  key={w.key}
                  type="button"
                  onClick={w.go}
                  aria-pressed={w.active}
                  className="hv-row"
                  style={{
                    all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
                    boxSizing: 'border-box', padding: '15px 14px 15px 0',
                    borderBottom: RULE_SOFT, transition: 'background 150ms',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    {/* A thin rule in the session's own colour, marking the
                        selected row without shifting the layout under it. */}
                    <span style={{
                      width: 2, alignSelf: 'stretch', minHeight: 30, flexShrink: 0,
                      background: w.active ? (w.kind === 'Cardio' ? PINK : PLUM) : 'transparent',
                    }} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                        <span style={{ ...display(19), color: w.active ? PLUM : INK }}>{w.name}</span>
                        <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, flexShrink: 0 }}>
                          {w.date}
                        </span>
                      </span>

                      <span style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: SOFT, flexWrap: 'wrap' }}>
                        {w.meta.map((m) => <span key={m}>{m}</span>)}
                        {w.prs !== 'No PRs' && <span style={{ color: w.prColor }}>{w.prs}</span>}
                      </span>

                      {/* Effort, scaled against the hardest session in view. */}
                      <span style={{ display: 'block', height: 2, background: TRACK, marginTop: 10 }}>
                        <span style={{
                          display: 'block', height: 2, width: w.effort,
                          background: w.kind === 'Cardio' ? PINK : PLUM,
                          opacity: w.active ? 1 : 0.5,
                          transition: 'width 420ms cubic-bezier(0.4,0,0.2,1)',
                        }} />
                      </span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>

        {v.sel && (
          <div style={{ position: 'sticky', top: 32 }}>
            <Eyebrow>{v.sel.date}</Eyebrow>
            <h2 style={{ ...display(30), margin: '12px 0 0' }}>{v.sel.name}</h2>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              marginTop: 24, paddingTop: 20, borderTop: RULE,
            }}>
              {v.sel.stats.map((st2) => (
                <div key={st2.label}>
                  <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>
                    {st2.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: INK, marginTop: 6 }}>
                    {st2.value}
                  </div>
                </div>
              ))}
            </div>

            {/* A list rather than a four-column table: most sessions have two or
                three values worth reading, and a table pads the rest with dashes. */}
            <div style={{ marginTop: 26 }}>
              {v.sel.rows.map((r, i) => (
                <div key={`${r.name}-${i}`} style={{ padding: '13px 0', borderBottom: RULE_SOFT }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 14 }}>
                    <span style={{ fontSize: 13.5, color: INK }}>
                      {r.name}
                      {r.pr && <span style={{ color: PINK, fontSize: 10.5, marginLeft: 8, letterSpacing: '0.08em' }}>{r.pr}</span>}
                    </span>
                    <span style={{ fontSize: 12.5, color: SOFT, flexShrink: 0 }}>{r.sets}</span>
                  </div>
                  {(r.weight !== '—' || r.volume !== '—') && (
                    <div style={{ fontSize: 11.5, color: MUTED, marginTop: 4 }}>
                      {[r.weight, r.volume].filter((x) => x !== '—').join('  ·  ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12.5, fontStyle: 'italic', color: MUTED, margin: '20px 0 0', lineHeight: 1.7 }}>
              {v.sel.note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Exercises ───────────────────────────────────────────────────────────── */

/**
 * The kinds of training, as a light strip rather than an eleven-column table.
 *
 * Selecting one filters every screen. The table this replaces carried the same
 * figures but read as a wall — most of its columns were empty for most rows,
 * because a walk has no pace worth showing and a gym session has no distance.
 */
function ActivityStrip({ v }: { v: TrainingVals }) {
  if (!v.activities.length) return null;

  return (
    <div style={{ marginTop: 4 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        gap: 12, paddingBottom: 12, borderBottom: RULE, flexWrap: 'wrap',
      }}>
        <Eyebrow>Kinds of training</Eyebrow>
        <span style={{ fontSize: 11.5, color: MUTED }}>
          {v.focus ? 'Selected — click again to clear' : 'Select one to filter every screen'}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(212px, 1fr))',
        gap: 0,
      }}>
        {v.activities.slice(0, 12).map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={a.focus}
            aria-pressed={a.focused}
            className="hv-tab"
            style={{
              all: 'unset', cursor: 'pointer', display: 'block', boxSizing: 'border-box',
              padding: '18px 20px 20px 0', borderBottom: RULE_SOFT,
              background: a.focused ? TINT : 'transparent',
              transition: 'background 150ms',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{
                width: 7, height: 7, flexShrink: 0,
                background: a.kind === 'Strength' ? PLUM : a.kind === 'Cardio' ? PINK : MUTED,
              }} />
              <span style={{ fontSize: 13.5, color: a.focused ? PLUM : INK }}>{a.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginTop: 9, paddingLeft: 15 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: INK }}>{a.sessions}</span>
              <span style={{ fontSize: 11.5, color: MUTED }}>in range · {a.allTime} all time</span>
            </div>
            <div style={{ fontSize: 11.5, color: SOFT, marginTop: 6, paddingLeft: 15 }}>
              {[a.time !== '—' ? a.time : null, a.distance !== '—' ? a.distance : null, a.last !== '—' ? `last ${a.last}` : null]
                .filter(Boolean).join('  ·  ')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The calendar as a screen rather than a panel.
 *
 * On Progress it sat under everything else and had to earn its space against
 * four charts. A month is a period in its own right — it is how the training
 * week actually repeats — so it gets the width, its own totals, and the opened
 * day alongside instead of underneath.
 */
function CalendarScreen({ v }: { v: TrainingVals }) {
  const cal = v.calendar;
  const detail = v.dayDetail;

  return (
    <div style={{ marginTop: 40 }}>
      <section style={{ ...card, padding: PANEL_PAD }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <Eyebrow>Month</Eyebrow>
            <h2 style={{ ...display(32), margin: '12px 0 0' }}>{cal.monthLabel}</h2>
            <div style={{ fontSize: 13, color: SOFT, marginTop: 8 }}>{cal.summary}</div>
          </div>
          <div style={{ display: 'flex', border: RULE, background: CARD }}>
            <button type="button" onClick={cal.prev} aria-label="Previous month" className="hv-tab"
              style={{ all: 'unset', cursor: 'pointer', padding: '9px 17px', fontSize: 16, color: SOFT }}>‹</button>
            <button type="button" onClick={cal.next} aria-label="Next month" disabled={!cal.canNext}
              className={cal.canNext ? 'hv-tab' : undefined}
              style={{
                all: 'unset', cursor: cal.canNext ? 'pointer' : 'default', padding: '9px 17px',
                fontSize: 16, color: cal.canNext ? SOFT : 'rgba(26,24,21,0.18)', borderLeft: RULE,
              }}>›</button>
          </div>
        </div>

        {/* What the month came to, so the grid is not the only thing here. */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(116px, 1fr))',
          marginTop: 28, paddingTop: 22, borderTop: RULE,
        }}>
          {cal.stats.map((c) => (
            <div key={c.label} style={{ paddingRight: 18 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>
                {c.label}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: INK, marginTop: 6 }}>
                {c.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="training-pair" style={{
        display: 'grid', gridTemplateColumns: detail ? '1.5fr 1fr' : '1fr',
        gap: GRID_GAP, marginTop: GRID_GAP, alignItems: 'start',
      }}>
        <div style={{ ...card, padding: CARD_PAD }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
            {cal.dayNames.map((d) => (
              <div key={d} style={{
                fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: MUTED, paddingBottom: 10, textAlign: 'center',
              }}>
                {d}
              </div>
            ))}

            {cal.cells.map((c) => c.pad ? <div key={c.key} /> : (
              <button
                key={c.key}
                type="button"
                onClick={c.select}
                disabled={c.future}
                aria-pressed={c.selected}
                aria-label={`${c.date}${c.hasSession ? ', has a session' : ''}`}
                className={c.future ? undefined : 'hv-tab'}
                style={{
                  all: 'unset', boxSizing: 'border-box',
                  cursor: c.future ? 'default' : 'pointer',
                  minHeight: 86, padding: '9px 10px',
                  background: c.selected ? TINT : c.tint,
                  border: c.selected ? `1px solid ${INK}` : c.isToday ? `1px solid ${AMBER}` : RULE_SOFT,
                  opacity: c.future ? 0.4 : 1,
                  display: 'flex', flexDirection: 'column', gap: 5,
                  transition: 'background 150ms',
                }}
              >
                <span style={{
                  fontSize: 12, color: c.isToday ? AMBER : c.hasSession ? INK : MUTED,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {c.day}
                </span>

                {c.hasSession && (
                  <span style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {Array.from({ length: Math.min(3, c.strength) }, (_, i) => (
                      <span key={`s${i}`} style={{ width: 5, height: 5, borderRadius: '50%', background: INK }} />
                    ))}
                    {Array.from({ length: Math.min(3, c.cardio) }, (_, i) => (
                      <span key={`c${i}`} style={{ width: 5, height: 5, borderRadius: '50%', background: AMBER }} />
                    ))}
                    {Array.from({ length: Math.min(2, c.other) }, (_, i) => (
                      <span key={`o${i}`} style={{ width: 5, height: 5, borderRadius: '50%', background: MUTED }} />
                    ))}
                  </span>
                )}

                <span style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {c.weight && (
                    <span style={{ fontSize: 10.5, color: SOFT, fontVariantNumeric: 'tabular-nums' }}>{c.weight} kg</span>
                  )}
                  {c.steps && (
                    <span style={{ fontSize: 10, color: MUTED, fontVariantNumeric: 'tabular-nums' }}>{c.steps}</span>
                  )}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 20, marginTop: 18, fontSize: 11, color: MUTED, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: INK }} />Strength
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: AMBER }} />Cardio
            </span>
            <span style={{ marginLeft: 'auto' }}>Figures are that day&rsquo;s weigh-in and step count</span>
          </div>
        </div>

        {detail && (
          <div style={{ ...card, padding: CARD_PAD, position: 'sticky', top: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <Eyebrow>Selected</Eyebrow>
              <button
                type="button" onClick={detail.close} className="hv-tab"
                style={{
                  all: 'unset', cursor: 'pointer', padding: '4px 11px', fontSize: 11.5,
                  color: SOFT, border: RULE, background: CARD,
                }}
              >
                Close
              </button>
            </div>
            <h3 style={{ ...display(22), margin: '12px 0 0' }}>{detail.label}</h3>

            <div style={{ marginTop: 20, borderTop: RULE }}>
              {detail.metrics.map((m) => (
                <div key={m.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '12px 0', borderBottom: RULE_SOFT,
                }}>
                  <span style={{ fontSize: 12.5, color: SOFT }}>{m.label}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: INK }}>{m.value}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <Eyebrow>Sessions</Eyebrow>
              {detail.empty ? (
                <div style={{ fontSize: 12.5, color: MUTED, fontStyle: 'italic', marginTop: 12 }}>
                  Nothing logged on this day.
                </div>
              ) : detail.sessions.map((sn) => (
                <div key={sn.key} style={{ padding: '12px 0', borderBottom: RULE_SOFT }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
                    <span style={{
                      width: 6, height: 6, flexShrink: 0,
                      background: sn.kind === 'Cardio' ? AMBER : sn.kind === 'Other' ? MUTED : INK,
                    }} />
                    <span style={{ fontSize: 13, color: INK }}>{sn.name}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: SOFT, marginTop: 5, paddingLeft: 15 }}>{sn.detail}</div>
                </div>
              ))}
            </div>

            <button
              type="button" onClick={detail.openSessions}
              style={{
                all: 'unset', cursor: 'pointer', marginTop: 18, fontSize: 12,
                color: INK, borderBottom: `1px solid ${TRACK_PREV}`,
              }}
            >
              All sessions →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Progress ────────────────────────────────────────────────────────────── */

function Progress({ v }: { v: TrainingVals }) {
  const b = v.bodyAnalysis;

  return (
    <div style={{ marginTop: 40 }}>
      {v.history && <HistoryBrush history={v.history} />}
      {/* Body composition replaces lift progression: weight alone conflates fat,
          lean tissue and water, and the split is the part worth knowing. */}
      <section style={{ ...card, padding: PANEL_PAD, marginTop: GRID_GAP }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: GRID_GAP, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '52ch' }}>
            <Eyebrow>Body composition</Eyebrow>
            {b.verdict
              ? <h2 style={{ ...display(30, b.verdictColor), margin: '14px 0 0' }}>{b.verdict}</h2>
              : <h2 style={{ ...display(30), margin: '14px 0 0' }}>Not enough weigh-ins yet</h2>}
            {b.detail && (
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: SOFT, margin: '14px 0 0', textWrap: 'pretty' }}>
                {b.detail}
              </p>
            )}
          </div>
          {b.fatShare !== null && (
            <div style={{ minWidth: 210 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>
                {b.fatShareLabel}
              </div>
              <div style={{ display: 'flex', height: 10, marginTop: 12, background: TRACK, overflow: 'hidden' }}>
                <div style={{ width: `${b.fatShare}%`, background: PINK, transition: 'width 420ms cubic-bezier(0.4,0,0.2,1)' }} />
                <div style={{ flex: 1, background: '#8E6FA3' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginTop: 8 }}>
                <span>Fat</span><span>Lean</span>
              </div>
            </div>
          )}
        </div>

        {b.rows.length > 0 && (
          <div className="table-scroll" style={{ overflowX: 'auto', marginTop: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
              <thead>
                <tr>
                  <th style={{ ...th(), paddingLeft: 0 }}>Measure</th>
                  <th style={th('right')}>Start</th>
                  <th style={th('right')}>Now</th>
                  <th style={th('right')}>Change</th>
                  <th style={{ ...th(), paddingRight: 0 }}>What it is</th>
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r) => (
                  <tr key={r.label}>
                    <td style={{ ...td, paddingLeft: 0, fontSize: 14, color: INK }}>{r.label}</td>
                    <td style={{ ...td, textAlign: 'right', color: MUTED }}>{r.from}</td>
                    <td style={{ ...td, textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: 17, color: INK }}>{r.to}</td>
                    <td style={{ ...td, textAlign: 'right', color: r.color }}>{r.change}</td>
                    <td style={{ ...td, paddingRight: 0, fontSize: 12, color: SOFT }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Four series side by side rather than one at a time behind a tab row —
          the comparison between them is the whole point. */}
      {b.series.length > 0 ? (
        <section className="training-pair" style={{
          // Two across, so four series read as a 2×2 block rather than a row of
          // three with an orphan under it.
          display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: GRID_GAP, marginTop: GRID_GAP,
        }}>
          {b.series.map((sx) => (
            <div key={sx.key} style={{ ...card, padding: CARD_PAD }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 7, height: 7, background: sx.color }} />
                  <span style={{ fontSize: 12.5, color: INK }}>{sx.label}</span>
                </span>
                <span style={{ fontSize: 11.5, color: sx.changeColor }}>{sx.change}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 12 }}>
                <Figure value={sx.latest} style={display(30, sx.color)} />
                <span style={{ fontSize: 11.5, color: MUTED, paddingBottom: 5 }}>{sx.rate}</span>
              </div>

              <div style={{ marginTop: 14 }}>
                <LineSeries
                  marks={sx.points} path={sx.path} area={sx.area}
                  width={680} height={110} stroke={sx.color} fill={PLUM_FILL_FAINT}
                  gridY={[20, 55, 90]}
                  hint={`${sx.points_n} readings · low ${sx.lo} · high ${sx.hi}`}
                />
              </div>

              <div style={{ fontSize: 11, color: MUTED, marginTop: 8 }}>
                Trend explains {sx.fit} of the movement
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section style={{ ...card, padding: PANEL_PAD, marginTop: GRID_GAP }}>
          <Empty title="Nothing to plot yet." note={b.emptyNote || 'Weigh in a few times and the trends fill in.'} />
        </section>
      )}

      <section style={{ marginTop: GRID_GAP }}>
        <Calendar cal={v.calendar} detail={v.dayDetail} />
      </section>

      <section className="training-pair" style={{ marginTop: GRID_GAP, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: GRID_GAP }}>
        {/* Training split, from workout minutes — the lift-volume version this
            replaces sat empty whenever the sets lived in a coaching app. */}
        <div style={{ ...card, padding: CARD_PAD }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <Eyebrow>Training split</Eyebrow>
            <span style={{ fontSize: 12, color: SOFT }}>{v.trainingSplit.totalLabel}</span>
          </div>

          {v.trainingSplit.rows.length > 0 ? (
            <>
              <div style={{ display: 'flex', height: 10, marginTop: 18, background: TRACK, overflow: 'hidden' }}>
                {v.trainingSplit.rows.map((r) => (
                  <div key={r.label} title={`${r.label} — ${r.value}`}
                    style={{ width: `${r.share}%`, background: r.colour, transition: 'width 420ms cubic-bezier(0.4,0,0.2,1)' }} />
                ))}
              </div>
              <div style={{ marginTop: 18 }}>
                {v.trainingSplit.rows.map((r) => (
                  <div key={r.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    gap: 12, padding: '12px 0', borderBottom: RULE_SOFT,
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ width: 8, height: 8, background: r.colour, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: INK }}>{r.label}</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: INK }}>{r.value}</span>
                      <span style={{ fontSize: 11.5, color: MUTED, minWidth: 34, textAlign: 'right' }}>{r.pct}</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: MUTED, marginTop: 18 }}>{v.trainingSplit.note}</div>
          )}

          {v.trainingSplit.rows.length > 0 && (
            <p style={{ fontSize: 12, fontStyle: 'italic', color: MUTED, margin: '16px 0 0', lineHeight: 1.6 }}>
              {v.trainingSplit.note}
            </p>
          )}
        </div>

        {/* Cardio. The tab row gets its own line rather than being squeezed into
            190px beside the figure, and the caption follows the metric on show. */}
        <div style={{ ...card, padding: CARD_PAD }}>
          <Eyebrow>Cardio</Eyebrow>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 14 }}>
            <Figure value={v.cardioValue} style={display(40)} />
            <span style={{ fontSize: 13, color: MUTED, paddingBottom: 6 }}>{v.cardioUnit}</span>
          </div>
          <div style={{ fontSize: 13, color: v.cardioTrendColor, marginTop: 8 }}>{v.cardioTrend}</div>

          <div style={{ marginTop: 18 }}>
            <Segmented items={v.cardioTabs} size="sm" />
          </div>

          <div style={{ marginTop: 18 }}>
            <BarSeries bars={v.cardioBars} width={420} height={140} hint="By week — hover to read one" />
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            marginTop: 18, paddingTop: 16, borderTop: RULE,
          }}>
            {v.cardioSummary.map((c) => (
              <div key={c.label}>
                <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>
                  {c.label}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: INK, marginTop: 5 }}>
                  {c.value}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: SOFT, marginTop: 14, lineHeight: 1.6 }}>{v.cardioNote}</p>
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
  const j = v.journey;
  return (
    <div style={{ marginTop: 40 }}>
      {/* The journey leads. It is the one goal here with an end rather than a
          rate, and the only one worth a picture. */}
      <section style={{ paddingBottom: 44, borderBottom: RULE, marginBottom: SECTION_GAP }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <Eyebrow>Fat loss journey</Eyebrow>
            <h2 style={{ ...display(38), margin: '14px 0 0' }}>
              {j.startKg} <span style={{ color: MUTED }}>→</span> {j.goalKg} kg
            </h2>
            {j.nextMilestone && (
              <div style={{ fontSize: 14, color: SOFT, marginTop: 12 }}>
                Next stop <strong style={{ color: PLUM, fontWeight: 400 }}>{j.nextMilestone.label}</strong>
                {j.nextMilestone.away && ` — ${j.nextMilestone.away}`}
                {j.nextMilestone.eta && `, around ${j.nextMilestone.eta}`}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <Figure value={j.currentKg} style={{ ...display(52, PLUM), lineHeight: 1 }} />
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginTop: 10 }}>
              kg today · {j.pctLabel} of the way
            </div>
          </div>
        </div>

        {/* The plan and what actually happened. Fitted to what has happened by
            default, because across the whole plan the first weeks are a
            squiggle in the corner. */}
        <div style={{ marginTop: 30 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            gap: 12, marginBottom: 12, flexWrap: 'wrap',
          }}>
            <span style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11.5, color: MUTED }}>Showing {j.chart.rangeLabel}</span>
              {j.chartFollows && (
                <span style={{ fontSize: 11, color: MUTED, fontStyle: 'italic' }}>
                  following the period above
                </span>
              )}
            </span>
            <Segmented items={j.chartTabs} size="sm" />
          </div>

          <LineSeries
            marks={j.chart.marks}
            path={j.chart.actualPath}
            width={j.chart.width}
            height={j.chart.height}
            stroke={PLUM}
            hint={`Weight from ${j.startKg} kg toward ${j.goalKg} kg — hover to read a weigh-in`}
          >
            {j.chart.gridLines.map((g) => (
              <line key={g.key} x1="0" y1={g.y} x2={j.chart.width} y2={g.y}
                stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
            ))}
            {/* The cone of rates actually held before, projected from the last
                reading. Drawn first so everything else sits on top of it. */}
            {j.chart.cone && (
              <>
                <path d={j.chart.cone.path} fill={PLUM_FILL_FAINT} stroke="none" />
                <path d={j.chart.cone.likelyPath} fill="none" stroke={PLUM_SOFT}
                  strokeWidth="1" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
              </>
            )}

            {/* The weigh-ins an averaged line is built from, left visible so the
                smoothing hides nothing. */}
            {j.chart.ghosts.map((g) => (
              <circle key={`g-${g.key}`} cx={g.cx} cy={g.cy} r="1.6" fill={PINK} opacity={0.4} />
            ))}
            {j.chart.goalY !== null && (
              <line x1="0" y1={j.chart.goalY} x2={j.chart.width} y2={j.chart.goalY}
                stroke={BLUE} strokeWidth="0.75" strokeDasharray="5 4" />
            )}
            <path d={j.chart.planPath} fill="none" stroke={BLUE_LINE} strokeWidth="1.5"
              strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          </LineSeries>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginTop: 4, gap: 12 }}>
            <span>{j.chart.startLabel}</span>
            <span style={{ fontStyle: 'italic' }}>
              <span style={{ color: BLUE }}>Dashed blue</span> is the plan at {j.targetRate};
              {' '}<span style={{ color: PLUM }}>solid violet</span> is what the scale said
            </span>
            <span>{j.chart.endLabel}</span>
          </div>

          <div style={{ fontSize: 11, color: MUTED, marginTop: 8, lineHeight: 1.7 }}>
            {j.chart.pointNote} Vertical axis covers {j.chart.bandLabel}, not the whole journey.
            {j.chartThinNote && (
              <span style={{ color: AMBER, marginLeft: 6 }}>{j.chartThinNote}</span>
            )}
          </div>
        </div>

        {/* Milestones, because twenty kilograms is too far away to aim at. */}
        <div style={{
          display: 'flex', gap: 0, marginTop: 32, flexWrap: 'wrap',
          borderTop: RULE_SOFT, paddingTop: 4,
        }}>
          {j.milestones.map((m) => (
            <div key={m.key} style={{
              flex: '1 1 84px', padding: '16px 12px 16px 0', minWidth: 84,
              opacity: m.done ? 0.55 : 1,
            }}>
              <div style={{
                height: 3, background: m.done ? PLUM : m.isNext ? PINK : TRACK, marginBottom: 12,
              }} />
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 17,
                color: m.done ? MUTED : m.isNext ? PINK : INK,
              }}>
                {m.label}
                {m.isGoal && <span style={{ fontSize: 10, color: MUTED, marginLeft: 6 }}>goal</span>}
              </div>
              <div style={{ fontSize: 10.5, color: MUTED, marginTop: 5, lineHeight: 1.5 }}>
                {m.done ? 'passed' : m.eta ?? m.away ?? ''}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(122px, 1fr))',
          marginTop: 26, paddingTop: 22, borderTop: RULE_SOFT,
        }}>
          {[
            { label: 'Lost so far', value: `${j.lostKg} kg`, colour: INK },
            { label: 'Still to go', value: `${j.toGoKg} kg`, colour: INK },
            { label: 'Current rate', value: j.rate, colour: j.rateColor },
            { label: 'Planned rate', value: j.targetRate, colour: MUTED },
            { label: 'On plan', value: j.targetEtaLabel, colour: MUTED },
          ].map((c) => (
            <div key={c.label} style={{ paddingRight: 18 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>
                {c.label}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: c.colour, marginTop: 6 }}>
                {c.value}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13.5, lineHeight: 1.75, color: SOFT, margin: '24px 0 0', maxWidth: '68ch', textWrap: 'pretty' }}>
          {j.note}
        </p>

        {/* Three dates rather than one. A single arrival date is the least
            honest number on the page; these are speeds already held. */}
        {j.forecast && (
          <div style={{ marginTop: 30, paddingTop: 24, borderTop: RULE }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
              <Eyebrow>When 68 kg arrives</Eyebrow>
              <span style={{ fontSize: 11.5, color: j.forecast.planIsRealistic ? GREEN : AMBER }}>
                {j.forecast.planIsRealistic ? 'the plan is inside what you have held' : 'the plan is faster than your usual'}
              </span>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              marginTop: 18,
            }}>
              {j.forecast.legs.map((leg) => (
                <div key={leg.key} style={{
                  paddingRight: 22,
                  borderLeft: leg.key === 'likely' ? `2px solid ${PLUM}` : `1px solid ${TRACK_PREV}`,
                  paddingLeft: 16,
                }}>
                  <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5, minHeight: 32 }}>{leg.label}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 22,
                    color: leg.key === 'likely' ? PLUM : INK, marginTop: 8,
                  }}>
                    {leg.etaLabel}
                  </div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>
                    {leg.rateLabel} · {leg.monthsLabel}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, color: MUTED, margin: '18px 0 0', lineHeight: 1.75, maxWidth: '76ch' }}>
              {j.forecast.note}
            </p>
          </div>
        )}

        {/* The journey week by week, where the accountability actually lives —
            the trajectory shows the shape, this shows whether last week counted. */}
        {j.buckets.length > 0 && (
          <div style={{ marginTop: 38, paddingTop: 26, borderTop: RULE }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              gap: 16, flexWrap: 'wrap', marginBottom: 18,
            }}>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <Eyebrow>The journey, broken down</Eyebrow>
                {j.grainFollows && (
                  <span style={{ fontSize: 11, color: MUTED }}>matching the chart above</span>
                )}
              </span>
              <Segmented items={j.grainTabs} size="sm" />
            </div>

            <div>
              {j.buckets.map((b) => (
                <div key={b.key} style={{
                  display: 'grid',
                  gridTemplateColumns: '168px 88px 1fr 104px',
                  gap: 18, alignItems: 'center',
                  padding: '13px 0', borderBottom: RULE_SOFT,
                  opacity: b.beforeStart ? 0.55 : 1,
                }}>
                  <span style={{ fontSize: 12.5, color: INK }}>
                    {b.label}
                    {b.beforeStart && (
                      <span style={{ fontSize: 10, color: MUTED, marginLeft: 7 }}>before</span>
                    )}
                  </span>

                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: 17, color: INK,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {b.weight}
                  </span>

                  {/* Drawn from the centre: loss to the left, gain to the right,
                      scaled so the target rate reaches halfway. */}
                  <span style={{ display: 'block', position: 'relative', height: 6, background: TRACK }}>
                    <span style={{
                      position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1,
                      background: TRACK_PREV,
                    }} />
                    <span style={{
                      position: 'absolute', top: 0, height: 6,
                      width: b.barPct,
                      [b.losing ? 'right' : 'left']: '50%',
                      background: b.onPlan ? INK : b.drifting ? ROSE : PINK_SOFT,
                      transition: 'width 420ms cubic-bezier(0.4,0,0.2,1)',
                    } as CSSProperties} />
                  </span>

                  <span style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 12.5, color: b.changeColor, display: 'block' }}>{b.change}</span>
                    <span style={{ fontSize: 10.5, color: MUTED }}>{b.note || b.readings}</span>
                  </span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, fontStyle: 'italic', color: MUTED, margin: '16px 0 0', lineHeight: 1.7, maxWidth: '72ch' }}>
              {j.grainNote}
            </p>
          </div>
        )}
      </section>

      <div className="training-pair" style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: GRID_GAP,
      }}>
        {v.goals.map((g) => (
          <div key={g.key} style={{ ...card, padding: PANEL_PAD }}>
            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* A ring rather than a bar: progress toward something has an end,
                  and a ring shows how much of it is left as well as done. */}
              <div style={{ position: 'relative', flexShrink: 0, width: 108, height: 108 }}>
                <svg viewBox="0 0 108 108" style={{ width: 108, height: 108, transform: 'rotate(-90deg)' }} aria-hidden="true">
                  <circle cx="54" cy="54" r={g.radius} fill="none" stroke={TRACK} strokeWidth="7" />
                  <circle
                    cx="54" cy="54" r={g.radius} fill="none"
                    stroke={g.statusColor} strokeWidth="7" strokeLinecap="butt"
                    strokeDasharray={g.dash}
                    style={{ transition: 'stroke-dasharray 600ms cubic-bezier(0.4,0,0.2,1)' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: INK, lineHeight: 1 }}>
                    {g.pct}
                  </span>
                </div>
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED }}>
                    {g.dimension}
                  </span>
                  <Pill
                    label={g.status}
                    tone={g.status === 'On track' ? 'green' : g.status === 'Close' ? 'amber' : g.status === 'Behind' ? 'pink' : 'grey'}
                  />
                </div>

                <h3 style={{ ...display(23), margin: '12px 0 0' }}>{g.title}</h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
                  <Figure value={g.current} style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: INK }} />
                  <span style={{ fontSize: 13, color: MUTED }}>of {g.target}</span>
                </div>

                <div style={{ fontSize: 11.5, color: MUTED, marginTop: 8 }}>{g.due}</div>
              </div>
            </div>

            <p style={{
              fontSize: 12.5, color: SOFT, margin: '22px 0 0', paddingTop: 18,
              borderTop: RULE_SOFT, lineHeight: 1.7,
            }}>
              {g.note}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button" onClick={v.newGoal} aria-expanded={v.goalDraft} className="hv-solid"
        style={{
          all: 'unset', cursor: 'pointer', marginTop: GRID_GAP, padding: '13px 26px',
          background: PLUM, color: '#FBF8FA', fontSize: 14, transition: 'background 200ms',
        }}
      >
        New goal →
      </button>

      {v.goalDraft && (
        <div style={{ marginTop: 20, border: RULE, background: TINT, padding: CARD_PAD, maxWidth: 560 }}>
          <Eyebrow>New goal</Eyebrow>
          <p style={{ fontSize: 13.5, color: SOFT, margin: '12px 0 0', lineHeight: 1.7 }}>
            The four above are the targets set in Settings, measured against what you have logged —
            nothing is entered twice. Custom goals with their own target and date are not stored yet;
            change a target in Settings to move one of these.
          </p>
          <button
            type="button" onClick={v.newGoal}
            style={{
              all: 'unset', cursor: 'pointer', marginTop: 16, fontSize: 13,
              color: INK, borderBottom: `0.5px solid ${MUTED}`,
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
    <div style={{ marginTop: 44 }}>
    <div className="training-pair" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: GRID_GAP, alignItems: 'start' }}>
      <div style={{ ...card, padding: CARD_PAD }}>
        <Eyebrow>{v.nutritionDayLabel}</Eyebrow>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 14 }}>
          <Figure value={v.nutritionHeadline} style={display(44)} />
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
        <div style={{ marginTop: 20 }}>
          <BarSeries
            bars={v.nutritionBars} width={560} height={220}
            hint="Daily intake against target — hover to read a day"
          >
            <line x1="0" y1={v.calTargetY} x2="560" y2={v.calTargetY} stroke={BLUE} strokeWidth="0.75" strokeDasharray="4 4" />
          </BarSeries>
        </div>
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
      <EnergySection v={v} />
    </div>
  );
}

/** Energy balance, and what the scale says about it. */
function EnergySection({ v }: { v: TrainingVals }) {
  const e = v.energy;
  return (
    <section style={{ marginTop: SECTION_GAP }}>
      <SectionHeading title="Energy balance" aside={`${e.complete} complete days`} />

      <div className="training-pair" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: GRID_GAP, marginTop: GRID_GAP }}>
        <div style={{ ...card, padding: CARD_PAD }}>
          <Eyebrow>{e.title}</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 14 }}>
            <Figure value={e.headline} style={display(46, e.headlineColor)} />
            <span style={{ fontSize: 13, color: MUTED, paddingBottom: 7 }}>{e.headlineUnit}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: 24, borderTop: RULE }}>
            <div style={{ padding: '18px 14px 0 0' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>Average in</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: INK, marginTop: 6 }}>{e.inLabel}</div>
            </div>
            <div style={{ padding: '18px 0 0 0' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>Average out</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: INK, marginTop: 6 }}>{e.outLabel}</div>
            </div>
          </div>

          {/* Where the burn goes. BMR, NEAT and EAT are measured; only TEF is modelled. */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: RULE }}>
            <Eyebrow>Where the burn goes</Eyebrow>

            <div style={{ display: 'flex', height: 10, marginTop: 14, background: TRACK, overflow: 'hidden' }}>
              {e.components.map((c, i) => (
                <div
                  key={c.key}
                  title={`${c.label} — ${c.valueLabel} kcal`}
                  style={{
                    width: `${c.share}%`,
                    background: [PLUM, PLUM_SOFT, PINK, BLUE_SOFT][i],
                    transition: 'width 420ms cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              {e.components.map((c, i) => (
                <div key={c.key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  gap: 12, padding: '10px 0', borderBottom: RULE_SOFT,
                }}>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 9, minWidth: 0 }}>
                    <span style={{ width: 9, height: 9, background: [PLUM, PLUM_SOFT, PINK, BLUE_SOFT][i], flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: INK }}>{c.label}</span>
                    <span style={{ fontSize: 11, color: MUTED }}>{c.note}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: INK }}>{c.valueLabel}</span>
                    <span style={{ fontSize: 11, color: MUTED, minWidth: 32, textAlign: 'right' }}>{c.pct}</span>
                  </span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 11.5, color: SOFT, marginTop: 12, lineHeight: 1.6 }}>{e.componentsNote}</div>
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: RULE }}>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>
              Projected from the log
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: PLUM, marginTop: 8 }}>{e.projectedLabel}</div>
            <div style={{ fontSize: 11.5, color: SOFT, marginTop: 6, lineHeight: 1.6 }}>{e.projectedNote}</div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: RULE_SOFT }}>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>
              What the scale actually did
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: INK, marginTop: 8 }}>{e.actualLabel}</div>
            <div style={{ fontSize: 11.5, color: SOFT, marginTop: 6 }}>Fitted across the weigh-ins in this window.</div>
          </div>
        </div>

        <div style={{ ...card, padding: CARD_PAD }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <Eyebrow>Daily balance</Eyebrow>
            <span style={{ fontSize: 11.5, color: MUTED }}>
              <span style={{ color: PLUM }}>&#9660; deficit</span> &middot; <span style={{ color: PINK }}>&#9650; surplus</span>
            </span>
          </div>

          <div style={{ marginTop: 18 }}>
            <BarSeries
              bars={e.bars} width={560} height={200} zeroY={e.zeroY}
              hint="Daily balance — hover to read a day"
            />
          </div>
          <div style={{ fontSize: 11.5, color: MUTED, marginTop: 10 }}>{e.coverageNote}</div>

          {e.reconciliation && (
            <div style={{ marginTop: 22, paddingTop: 20, borderTop: RULE }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>
                Log against scale
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.7, color: e.reconciliationColor, margin: '10px 0 0' }}>
                {e.reconciliation}
              </p>
            </div>
          )}

          <div style={{ marginTop: 20, paddingTop: 18, borderTop: RULE_SOFT }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 12.5, color: INK }}>Implied daily expenditure</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 20,
                color: e.impliedTdeeCredible ? INK : MUTED,
              }}>
                {e.impliedTdeeCredible ? e.impliedTdeeLabel : 'Not credible'}
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: SOFT, marginTop: 6, lineHeight: 1.6 }}>{e.impliedTdeeNote}</div>
          </div>
        </div>
      </div>
    </section>
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
            <Figure value={v.recoveryScore} style={{ ...display(70, PLUM), lineHeight: 0.9 }} />
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
          <div style={{ marginTop: 18 }}>
            <LineSeries
              marks={v.sleepMarks} path={v.sleepBig} area={v.sleepArea}
              width={600} height={230} stroke={PINK} fill={PINK_FILL}
              hint={`Last ${v.sleepCount} nights — hover to read one`}
            />
          </div>
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

/**
 * This week, against the levels that actually worked.
 *
 * The rest of the dashboard measures the week against a target someone chose.
 * This measures it against what she was doing during the stretches where the
 * weight came off, which is a bar already cleared for weeks at a time.
 */
function Review({ v }: { v: TrainingVals }) {
  const r = v.review;

  if (!r.ok) return <div style={{ marginTop: 40 }}><Empty title="Not yet" note={r.note} /></div>;

  return (
    <div style={{ marginTop: 40 }}>
      <section style={{ paddingBottom: 36, borderBottom: RULE }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
          <Eyebrow>{r.weekLabel}</Eyebrow>
          <span style={{ fontSize: 11.5, color: MUTED }}>{r.spanLabel}</span>
        </div>

        <p style={{
          ...display(26, r.headlineColour), margin: '18px 0 0', lineHeight: 1.4,
          maxWidth: '32ch', textWrap: 'pretty',
        }}>
          {r.headline}
        </p>

        <p style={{ fontSize: 14, lineHeight: 1.75, color: r.weightColour, margin: '18px 0 0', maxWidth: '64ch' }}>
          {r.weightLine}
        </p>
      </section>

      {/* One thing to change, named. A review that lists eight is a list. */}
      {r.focus && (
        <section style={{ marginTop: SECTION_GAP, padding: PANEL_PAD, background: TINT, border: RULE }}>
          <Eyebrow>The one to move</Eyebrow>
          <div style={{ ...display(30, PLUM), marginTop: 14 }}>{r.focus.label}</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: SOFT, margin: '14px 0 0', maxWidth: '62ch', textWrap: 'pretty' }}>
            {r.focus.line}
          </p>
        </section>
      )}

      {r.levers.length > 0 && (
        <section style={{ marginTop: SECTION_GAP }}>
          <SectionHeading title="Every lever, against what worked" aside={`${r.levers.length} measured`} />

          <div style={{ marginTop: 6, borderTop: RULE_SOFT }}>
            {r.levers.map((l) => (
              <div key={l.key} style={{
                display: 'grid', gridTemplateColumns: '160px 96px 1fr 190px',
                gap: 20, alignItems: 'center', padding: `${ROW_Y}px 0`, borderBottom: RULE_SOFT,
              }}>
                <span>
                  <span style={{ fontSize: 13.5, color: INK, display: 'block' }}>{l.label}</span>
                  <span style={{ fontSize: 10.5, color: MUTED }}>{l.unit}</span>
                </span>

                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 19, color: l.colour,
                  textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                }}>
                  {l.nowLabel}
                </span>

                {/* This week as a bar against the level that worked, which is
                    marked on it. The track runs to 140% of that level so the
                    mark sits inside the bar rather than at its end. */}
                <span style={{ display: 'block', position: 'relative', height: 8, background: TRACK }}>
                  <span style={{
                    display: 'block', height: 8, width: `${(Math.min(l.pct, 140) / 140) * 100}%`,
                    background: l.colour,
                    transition: 'width 420ms cubic-bezier(0.4,0,0.2,1)',
                  }} />
                  <span
                    title={`Worked at ${l.workedLabel} ${l.unit}`}
                    style={{
                      position: 'absolute', top: -4, bottom: -4, left: `${(100 / 140) * 100}%`,
                      borderLeft: `1.5px solid ${BLUE}`,
                    }}
                  />
                </span>

                <span style={{ fontSize: 11.5, color: SOFT, textAlign: 'right', lineHeight: 1.5 }}>
                  <span style={{ color: BLUE }}>{l.workedLabel}</span> when it worked
                  <br />
                  <span style={{ color: MUTED }}>{l.gapLabel}</span>
                </span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: MUTED, margin: '16px 0 0', lineHeight: 1.7, maxWidth: '72ch' }}>
            {r.benchNote}
            {r.setAside.length > 0 && (
              <> Set aside because the record disagrees with the body about which way it runs: {r.setAside.join(', ').toLowerCase()}.</>
            )}
          </p>
        </section>
      )}
    </div>
  );
}

/**
 * Every stretch where the weight actually moved, and what was different.
 *
 * This is the only screen that can say something she does not already know, and
 * it earns that by refusing to say anything the coverage will not carry.
 */
function Evidence({ v }: { v: TrainingVals }) {
  const e = v.evidence;

  if (!e.ok) {
    return (
      <div style={{ marginTop: 40 }}>
        <Empty title={e.loading ? 'Reading eight years' : 'Not yet'} note={e.note || 'The record is still loading.'} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: 40 }}>
      {/* The floor of the record. It is the single most useful fact here: this
          has been done before, and the data knows how far. */}
      <section style={{ paddingBottom: 36, borderBottom: RULE, display: 'flex', gap: 56, flexWrap: 'wrap' }}>
        {e.lowest && (
          <div>
            <Eyebrow>Lowest on record</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 14 }}>
              <Figure value={e.lowest.kg} style={{ ...display(56, PLUM), lineHeight: 1 }} />
              <span style={{ fontSize: 14, color: MUTED }}>kg</span>
            </div>
            <div style={{ fontSize: 12.5, color: SOFT, marginTop: 10 }}>
              {e.lowest.when} · {e.lowest.agoLabel}
            </div>
          </div>
        )}

        {e.best && (
          <div style={{ maxWidth: '40ch' }}>
            <Eyebrow>Longest stretch that worked</Eyebrow>
            <div style={{ ...display(26), marginTop: 14 }}>{e.best.range}</div>
            <div style={{ fontSize: 13, color: SOFT, marginTop: 10, lineHeight: 1.7 }}>
              {e.best.lengthLabel} · {e.best.changeLabel} · {e.best.rateLabel}
              <br />
              <span style={{ color: GREEN }}>{e.best.lostLabel} off</span>
            </div>
          </div>
        )}
      </section>

      {/* The whole record as one bar, so the shape of five years is visible at
          a glance rather than as a table of dates. */}
      {e.episodes.length > 0 && (
        <section style={{ marginTop: SECTION_GAP }}>
          <SectionHeading title="Every stretch, in order" aside={`${e.episodes.length} on record`} />

          <div style={{ position: 'relative', height: 26, background: TRACK, marginTop: 18 }}>
            {e.episodes.map((ep) => (
              <span
                key={ep.key}
                title={`${ep.range} — ${ep.rateLabel}`}
                style={{
                  position: 'absolute', top: 0, bottom: 0,
                  left: `${ep.leftPct}%`, width: `${ep.widthPct}%`,
                  background: ep.colour, opacity: 0.85,
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginTop: 6 }}>
            <span>{e.timelineFrom}</span>
            <span>{e.timelineTo}</span>
          </div>

          <div style={{ marginTop: 24, borderTop: RULE_SOFT }}>
            {e.episodes.map((ep) => (
              <div key={`row-${ep.key}`} style={{
                display: 'grid', gridTemplateColumns: '92px 1fr 110px 130px 110px',
                gap: 18, alignItems: 'center', padding: '13px 0', borderBottom: RULE_SOFT,
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: SOFT }}>
                  <span style={{ width: 8, height: 8, background: ep.colour, flexShrink: 0 }} />
                  {ep.phase}
                </span>
                <span style={{ fontSize: 13, color: INK }}>{ep.range}</span>
                <span style={{ fontSize: 12, color: MUTED, textAlign: 'right' }}>{ep.lengthLabel}</span>
                <span style={{ fontSize: 12.5, color: SOFT, textAlign: 'right' }}>{ep.changeLabel}</span>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 16, color: ep.colour, textAlign: 'right',
                }}>
                  {ep.rateLabel}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* The contrast — the actual finding. */}
      {e.contrasts.length > 0 && (
        <section style={{ marginTop: SECTION_GAP }}>
          <SectionHeading title="What was different when it worked" aside="losing vs the rest" />

          {/* Two unlabelled bars is a puzzle, so the pair is named once here
              rather than on every row. */}
          <div style={{ display: 'flex', gap: 24, marginTop: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: SOFT }}>
              <span style={{ width: 16, height: 8, background: GREEN }} />
              in the stretches where the weight was falling
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: MUTED }}>
              <span style={{ width: 16, height: 8, background: TRACK_PREV }} />
              in the stretches where it was holding or rising
            </span>
          </div>

          <div style={{ marginTop: 16, borderTop: RULE_SOFT }}>
            {e.contrasts.map((c) => (
              <div key={c.key} style={{
                display: 'grid', gridTemplateColumns: '170px 1fr 96px',
                gap: 22, alignItems: 'center', padding: '18px 0', borderBottom: RULE_SOFT,
              }}>
                <span>
                  <span style={{ fontSize: 13.5, color: INK, display: 'block' }}>{c.label}</span>
                  <span style={{ fontSize: 10.5, color: MUTED }}>{c.unit}</span>
                </span>

                <span style={{ display: 'block' }}>
                  {/* Losing on top in green, everything else beneath in grey,
                      both drawn against the larger of the two. */}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ display: 'block', flex: 1, height: 9, background: TRACK }}>
                      <span style={{
                        display: 'block', height: 9, width: `${c.pct}%`, background: GREEN,
                        transition: 'width 420ms cubic-bezier(0.4,0,0.2,1)',
                      }} />
                    </span>
                    <span style={{ fontSize: 12.5, color: GREEN, minWidth: 62, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {c.losing}
                    </span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
                    <span style={{ display: 'block', flex: 1, height: 9, background: TRACK }}>
                      <span style={{
                        display: 'block', height: 9, width: `${c.otherPct}%`, background: TRACK_PREV,
                        transition: 'width 420ms cubic-bezier(0.4,0,0.2,1)',
                      }} />
                    </span>
                    <span style={{ fontSize: 12.5, color: MUTED, minWidth: 62, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {c.other}
                    </span>
                  </span>
                  <span style={{ display: 'block', fontSize: 10.5, color: MUTED, marginTop: 7 }}>
                    {c.coverNote}
                  </span>
                </span>

                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 20,
                  color: c.higher ? GREEN : ROSE, textAlign: 'right',
                }}>
                  {c.diff}
                </span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12.5, color: MUTED, margin: '18px 0 0', lineHeight: 1.75, maxWidth: '76ch' }}>
            {e.contrastNote}
            {e.thinContrasts.length > 0 && (
              <> Not shown for want of coverage on one side or the other: {e.thinContrasts.join(', ').toLowerCase()}.</>
            )}
          </p>
        </section>
      )}

      {/* Maintenance, solved for rather than modelled. */}
      <section style={{ marginTop: SECTION_GAP, padding: PANEL_PAD, border: RULE, background: CARD }}>
        <Eyebrow>Maintenance, measured</Eyebrow>

        {e.maintenance.ok ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
              <Figure value={e.maintenance.measured} style={{ ...display(52, e.maintenance.colour), lineHeight: 1 }} />
              <span style={{ fontSize: 13, color: MUTED }}>kcal/day</span>
              <span style={{ fontSize: 12, color: MUTED, marginLeft: 8 }}>
                middle half {e.maintenance.band} · {e.maintenance.windows} four-week stretches
              </span>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              marginTop: 26, paddingTop: 20, borderTop: RULE_SOFT,
            }}>
              {[
                { label: 'Measured', value: e.maintenance.measured, colour: e.maintenance.colour },
                { label: 'Modelled', value: e.maintenance.modelled, colour: BLUE },
                { label: 'You logged', value: e.maintenance.logged, colour: INK },
              ].map((c) => (
                <div key={c.label} style={{ paddingRight: 20 }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>
                    {c.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: c.colour, marginTop: 7 }}>
                    {c.value}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13.5, lineHeight: 1.8, color: SOFT, margin: '22px 0 0', maxWidth: '72ch', textWrap: 'pretty' }}>
              {e.maintenance.verdict}
            </p>
          </>
        ) : (
          <p style={{ fontSize: 13.5, lineHeight: 1.8, color: SOFT, margin: '16px 0 0', maxWidth: '72ch' }}>
            {e.maintenance.note}
          </p>
        )}
      </section>
    </div>
  );
}

function Insights({ v }: { v: TrainingVals }) {
  if (!v.insights.length) {
    return <Empty title="No observations yet." note="Insights appear once a source has enough logged days to compare." />;
  }

  return (
    <div style={{ marginTop: 44, maxWidth: 860 }}>
      {/* A spine rather than a grid. Most of these observations are about a
          stretch of time — a flat fortnight, a year-on-year comparison, a streak
          that ended in 2023 — and reading them in order is how they add up. */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 6, top: 10, bottom: 10, width: 1,
          background: TRACK_PREV,
        }} />

        {v.insights.map((i, idx) => (
          <article
            key={i.key}
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              gap: 32,
              padding: idx === 0 ? '0 0 38px 40px' : '38px 0 38px 40px',
              borderTop: idx === 0 ? 'none' : RULE_SOFT,
              alignItems: 'start',
            }}
          >
            {/* The marker sits on the spine, in the subject's own colour. */}
            <span style={{
              position: 'absolute', left: 0, top: idx === 0 ? 4 : 42,
              width: 13, height: 13, borderRadius: '50%',
              background: PAPER, border: `2px solid ${i.tagColor}`,
            }} />

            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <Pill label={i.tag} tone={toneFor(i.tag)} />
                {i.when && (
                  <span style={{ fontSize: 11, color: MUTED }}>{i.when}</span>
                )}
              </div>

              <h3 style={{
                ...display(idx === 0 ? 27 : 22),
                margin: '12px 0 0', maxWidth: '26ch',
              }}>
                {i.title}
              </h3>

              <p style={{
                fontSize: idx === 0 ? 15.5 : 14.5, lineHeight: 1.8, color: SOFT,
                margin: '12px 0 0', maxWidth: '62ch', textWrap: 'pretty',
              }}>
                {i.body}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: MUTED }}>{i.source}</span>
                {i.open && (
                  <button
                    type="button"
                    onClick={i.open}
                    style={{
                      all: 'unset', cursor: 'pointer', fontSize: 11.5,
                      color: i.tagColor, borderBottom: `1px solid ${TRACK_PREV}`,
                    }}
                  >
                    Open {i.screen} →
                  </button>
                )}
              </div>
            </div>

            {i.metric && (
              <div style={{ textAlign: 'right', flexShrink: 0, paddingTop: 2 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: idx === 0 ? 38 : 27,
                  color: i.tagColor, lineHeight: 1,
                }}>
                  {i.metric.value}
                </div>
                <div style={{
                  fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: MUTED, marginTop: 8, maxWidth: 120, marginLeft: 'auto',
                }}>
                  {i.metric.unit}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
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
      <div style={{ ...card, marginTop: GRID_GAP, padding: CARD_PAD }}>
        <Eyebrow>Today&rsquo;s computed targets</Eyebrow>
        <p style={{ fontSize: 13.5, color: SOFT, margin: '12px 0 0', lineHeight: 1.7 }}>
          {v.targets.note}
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          marginTop: 20, paddingTop: 18, borderTop: RULE_SOFT,
        }}>
          {[
            { label: 'BMR', value: v.targets.bmrLabel },
            { label: 'TDEE', value: v.targets.tdeeLabel },
            { label: 'Eat', value: v.targets.calorieLabel },
            { label: 'Protein', value: v.targets.proteinLabel },
            { label: 'Confidence', value: v.targets.confidenceLabel },
          ].map((c) => (
            <div key={c.label} style={{ paddingRight: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>
                {c.label}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: INK, marginTop: 6 }}>
                {c.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 12, fontStyle: 'italic', color: MUTED, margin: '18px 0 0', lineHeight: 1.6 }}>
        Fixed defaults live in <code>targets.ts</code>; the figures above are recomputed from your
        latest weigh-in, so they move as you do. Confidence is the share of the estimate resting on
        measured rather than assumed signals.
      </p>
    </div>
  );
}
