'use client';

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { fmtDate, fmtNumber, niceTicks } from './format';

/* ============================================================
   charts.tsx — the SVG primitives
   ============================================================
   Hand-rolled rather than pulled from a charting library, so the
   marks follow one fixed spec: 2px lines, ≥8px markers with a 2px
   surface ring, bars capped at 24px with a 2px surface gap between
   neighbours, solid hairline grid. Every chart ships a crosshair or
   per-mark tooltip and a table-view twin.

   Charts scale by viewBox, so one set of coordinates works at any
   width.
   ============================================================ */

export interface TooltipRow {
  label: string;
  value: string;
  color?: string;
  shape?: 'line' | 'block' | 'dot';
}

interface TooltipState {
  x: number;
  y: number;
  title: string;
  rows: TooltipRow[];
}

function Tooltip({ state, width, height }: { state: TooltipState; width: number; height: number }) {
  // Keep the bubble inside the card even at the extreme ends.
  const left = Math.min(88, Math.max(12, (state.x / width) * 100));
  const top = (state.y / height) * 100;

  return (
    <div className="op-tooltip" style={{ left: `${left}%`, top: `${top}%` }} role="status">
      <div className="op-tooltip-title">{state.title}</div>
      {state.rows.map((row) => (
        <div className="op-tooltip-row" key={row.label}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            {row.color ? (
              <span
                className="op-swatch"
                data-shape={row.shape ?? 'block'}
                style={{ background: row.color }}
              />
            ) : null}
            {row.label}
          </span>
          <span>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

const VB_W = 900;
const VB_H = 340;
const PAD = { top: 22, right: 54, bottom: 54, left: 54 };

/* ── Trajectory: raw readings, trend, fluctuation band, projection ── */

export interface TrajectoryPoint {
  date: string;
  weight: number | null;
  trend: number | null;
}

export interface ProjectionPoint {
  date: string;
  y: number;
  lower: number;
  upper: number;
}

export function TrajectoryChart({
  points,
  projection,
  goal,
  unit = 'kg',
}: {
  points: TrajectoryPoint[];
  projection: ProjectionPoint[];
  goal: number | null;
  unit?: string;
}) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const clipId = useId();

  const geometry = useMemo(() => {
    const values: number[] = [];
    for (const point of points) {
      if (point.weight !== null) values.push(point.weight);
      if (point.trend !== null) values.push(point.trend);
    }
    for (const point of projection) values.push(point.lower, point.upper);
    if (!values.length) return null;

    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const pad = Math.max(0.5, (rawMax - rawMin) * 0.14);
    const min = rawMin - pad;
    const max = rawMax + pad;

    const total = points.length + (projection.length ? projection.length - 1 : 0);
    const plotW = VB_W - PAD.left - PAD.right;
    const plotH = VB_H - PAD.top - PAD.bottom;

    const x = (index: number) => PAD.left + (total <= 1 ? 0 : (index / (total - 1)) * plotW);
    const y = (value: number) => PAD.top + plotH - ((value - min) / (max - min)) * plotH;

    return { x, y, min, max, plotW, plotH, total };
  }, [points, projection]);

  const indexAt = useCallback(
    (clientX: number) => {
      if (!geometry || !svgRef.current) return null;
      const bounds = svgRef.current.getBoundingClientRect();
      const svgX = ((clientX - bounds.left) / bounds.width) * VB_W;
      const ratio = (svgX - PAD.left) / geometry.plotW;
      const index = Math.round(ratio * (geometry.total - 1));
      return Math.max(0, Math.min(points.length - 1, index));
    },
    [geometry, points.length],
  );

  if (!geometry) return <p className="op-empty">No readings in this range yet.</p>;

  const { x, y, min, max } = geometry;
  const ticks = niceTicks(min, max, 4);
  // The goal only earns a line — and a legend entry — when it falls inside
  // the plotted range. Forcing it into the domain would flatten the trend.
  const goalInRange = goal !== null && goal >= min && goal <= max;

  const trendPath = buildPath(points.map((p, i) => (p.trend === null ? null : [x(i), y(p.trend)])));

  // The band shows how far single readings stray from the trend — the
  // daily-fluctuation envelope, drawn from the residuals themselves.
  const residuals = points
    .filter((p) => p.weight !== null && p.trend !== null)
    .map((p) => Math.abs((p.weight as number) - (p.trend as number)));
  const spread = residuals.length
    ? residuals.reduce((a, b) => a + b, 0) / residuals.length
    : 0;

  const trendPoints = points
    .map((p, i) => (p.trend === null ? null : { i, t: p.trend }))
    .filter((v): v is { i: number; t: number } => v !== null);

  const bandPath =
    trendPoints.length > 1 && spread > 0
      ? [
          ...trendPoints.map((p, k) => `${k === 0 ? 'M' : 'L'}${x(p.i)},${y(p.t + spread)}`),
          ...[...trendPoints].reverse().map((p) => `L${x(p.i)},${y(p.t - spread)}`),
          'Z',
        ].join(' ')
      : '';

  // Two dot layers, as in the spec: a fine dust of small trend-line dots
  // for texture, and larger ringed markers on the days actually weighed
  // in — the endpoint reading drawn bigger than the rest.
  const dustDots = trendPoints.map((p) => ({ cx: x(p.i), cy: y(p.t) }));

  const readingDots = points
    .map((p, i) => (p.weight === null ? null : { i, cx: x(i), cy: y(p.weight), value: p.weight }))
    .filter((d): d is { i: number; cx: number; cy: number; value: number } => d !== null);

  const projOffset = points.length - 1;
  const projLine = buildPath(projection.map((p, i) => [x(projOffset + i), y(p.y)]));
  const projBand =
    projection.length > 1
      ? [
          ...projection.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(projOffset + i)},${y(p.upper)}`),
          ...[...projection]
            .reverse()
            .map((p, i) => `L${x(projOffset + projection.length - 1 - i)},${y(p.lower)}`),
          'Z',
        ].join(' ')
      : '';

  const lastReading = readingDots[readingDots.length - 1] ?? null;
  const lastProjection = projection[projection.length - 1] ?? null;
  const xTickIndexes = pickTickIndexes(points.length, 6);

  // Lowest and highest weigh-in in the visible range, each called out —
  // the two numbers a reader actually goes looking for on a weight chart.
  const loPoint = readingDots.reduce<typeof readingDots[number] | null>(
    (min, dot) => (min === null || dot.value < min.value ? dot : min),
    null,
  );
  const hiPoint = readingDots.reduce<typeof readingDots[number] | null>(
    (max, dot) => (max === null || dot.value > max.value ? dot : max),
    null,
  );
  const showLoHi = loPoint && hiPoint && loPoint.i !== hiPoint.i;

  return (
    <div className="op-chart">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label={`Weight in ${unit}: daily readings, a seven-day trend line, and a projection of the current fit.`}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD.left} y={0} width={VB_W - PAD.left - PAD.right + 34} height={VB_H} />
          </clipPath>
        </defs>

        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={VB_W - PAD.right} y1={y(tick)} y2={y(tick)} stroke="var(--grid)" strokeWidth={0.5} />
            <text className="op-tick" x={PAD.left - 10} y={y(tick) + 3.5} textAnchor="end" fill="var(--faint)">
              {fmtNumber(tick, 1)}
            </text>
          </g>
        ))}

        {goalInRange ? (
          <g>
            <line
              x1={PAD.left}
              x2={VB_W - PAD.right}
              y1={y(goal)}
              y2={y(goal)}
              stroke="var(--blush)"
              strokeWidth={1.2}
              strokeDasharray="5 5"
            />
            <text className="op-tick" x={PAD.left + 4} y={y(goal) - 5} fill="var(--marker-hi)" letterSpacing={1.6}>
              GOAL {fmtNumber(goal, 1)}
            </text>
          </g>
        ) : null}

        {xTickIndexes.map((index) => (
          <text
            key={index}
            className="op-tick"
            x={x(index)}
            y={VB_H - PAD.bottom + 30}
            textAnchor="middle"
            fill="var(--faint)"
          >
            {fmtDate(points[index].date)}
          </text>
        ))}

        <g clipPath={`url(#${clipId})`}>
          {bandPath ? <path d={bandPath} fill="var(--lilac)" opacity={0.42} /> : null}
          {projBand ? <path d={projBand} fill="var(--sky-band)" opacity={0.34} /> : null}

          {dustDots.map((dot, index) => (
            <circle key={index} cx={dot.cx} cy={dot.cy} r={1.9} fill="var(--blush)" opacity={0.62} />
          ))}

          {trendPath ? (
            <path className="op-line" d={trendPath} stroke="var(--violet)" strokeWidth={2.4} />
          ) : null}

          {projLine ? (
            <path className="op-line" d={projLine} stroke="var(--sky)" strokeWidth={1.8} strokeDasharray="6 6" />
          ) : null}

          {lastProjection ? (
            <circle
              cx={x(projOffset + projection.length - 1)}
              cy={y(lastProjection.y)}
              r={5}
              fill="var(--card)"
              stroke="var(--sky)"
              strokeWidth={1.8}
            />
          ) : null}

          {/* Each actual weigh-in: a white-ringed dot, the most recent one
              drawn larger so the eye lands on it first. */}
          {readingDots.map((dot) => (
            <circle
              key={dot.i}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.i === lastReading?.i ? 5.5 : 3.4}
              fill="var(--card)"
              stroke="var(--violet)"
              strokeWidth={1.8}
            />
          ))}
        </g>

        {lastProjection ? (
          <text
            className="op-mark-label"
            x={x(projOffset + projection.length - 1) - 10}
            y={y(lastProjection.y) - 12}
            textAnchor="end"
            fill="var(--marker-lo)"
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, fontWeight: 400 }}
          >
            {fmtNumber(lastProjection.y, 1)} {unit}
          </text>
        ) : null}

        {showLoHi && loPoint ? (
          <g>
            <circle cx={loPoint.cx} cy={loPoint.cy} r={3} fill="var(--marker-lo)" />
            <text
              className="op-tick"
              x={loPoint.cx}
              y={loPoint.cy + 20}
              textAnchor="middle"
              fill="var(--marker-lo)"
              letterSpacing={1.2}
            >
              Lowest {fmtNumber(loPoint.value, 1)}
            </text>
          </g>
        ) : null}
        {showLoHi && hiPoint ? (
          <g>
            <circle cx={hiPoint.cx} cy={hiPoint.cy} r={3} fill="var(--marker-hi)" />
            <text
              className="op-tick"
              x={hiPoint.cx}
              y={hiPoint.cy - 12}
              textAnchor="middle"
              fill="var(--marker-hi)"
              letterSpacing={1.2}
            >
              Highest {fmtNumber(hiPoint.value, 1)}
            </text>
          </g>
        ) : null}

        {activeIndex !== null && points[activeIndex].trend !== null ? (
          <g opacity={0.9}>
            <line
              x1={x(activeIndex)}
              x2={x(activeIndex)}
              y1={PAD.top}
              y2={VB_H - PAD.bottom}
              stroke="var(--violet)"
              strokeWidth={0.75}
              strokeDasharray="3 4"
              opacity={0.55}
            />
            <circle cx={x(activeIndex)} cy={y(points[activeIndex].trend as number)} r={5.5} fill="var(--violet)" />
            <circle
              cx={x(activeIndex)}
              cy={y(points[activeIndex].trend as number)}
              r={10}
              fill="none"
              stroke="var(--violet)"
              strokeWidth={0.8}
              opacity={0.4}
            />
          </g>
        ) : null}

        <rect
          className="op-hit"
          x={PAD.left}
          y={PAD.top}
          width={VB_W - PAD.left - PAD.right}
          height={VB_H - PAD.top - PAD.bottom}
          onMouseMove={(event) => {
            const index = indexAt(event.clientX);
            if (index === null) return;
            setActiveIndex(index);
            const point = points[index];
            setTooltip({
              x: x(index),
              y: point.trend !== null ? y(point.trend) : PAD.top,
              title: fmtDate(point.date),
              rows: [
                {
                  label: 'Reading',
                  value: point.weight === null ? '—' : `${fmtNumber(point.weight, 1)} ${unit}`,
                  color: 'var(--blush)',
                  shape: 'dot',
                },
                {
                  label: '7-day trend',
                  value: point.trend === null ? '—' : `${fmtNumber(point.trend, 1)} ${unit}`,
                  color: 'var(--violet)',
                  shape: 'line',
                },
              ],
            });
          }}
          onMouseLeave={() => {
            setTooltip(null);
            setActiveIndex(null);
          }}
        />
      </svg>

      {tooltip ? <Tooltip state={tooltip} width={VB_W} height={VB_H} /> : null}

      <div className="op-legend">
        <span className="op-legend-item">
          <span className="op-swatch" data-shape="dot" style={{ background: 'var(--blush)' }} />
          Daily scale reading
        </span>
        <span className="op-legend-item">
          <span className="op-swatch" data-shape="line" style={{ background: 'var(--violet)' }} />
          7-day trend
        </span>
        <span className="op-legend-item">
          <span className="op-swatch" style={{ background: 'var(--lilac)' }} />
          Daily fluctuation
        </span>
        <span className="op-legend-item">
          <span className="op-swatch" data-shape="line" style={{ background: 'var(--sky)' }} />
          Projection
        </span>
        {goalInRange ? (
          <span className="op-legend-item">
            <span className="op-swatch" data-shape="line" style={{ background: 'var(--blush)' }} />
            Goal
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* ── Columns ────────────────────────────────────────────────── */

export interface ColumnDatum {
  key: string;
  label: string;
  value: number | null;
  tooltip?: TooltipRow[];
}

const COL_H = 220;

export function ColumnChart({
  data,
  color = 'var(--series-1)',
  negativeColor,
  format = (value: number) => fmtNumber(value),
  ariaLabel,
  onSelect,
  selectedKey,
}: {
  data: ColumnDatum[];
  color?: string;
  negativeColor?: string;
  format?: (value: number) => string;
  ariaLabel: string;
  onSelect?: (key: string) => void;
  selectedKey?: string | null;
}) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const values = data.map((d) => d.value).filter((v): v is number => v !== null);
  if (!values.length) return <p className="op-empty">Nothing logged in this range yet.</p>;

  const rawMax = Math.max(0, ...values);
  const rawMin = Math.min(0, ...values);
  const max = rawMax === rawMin ? rawMax + 1 : rawMax;

  const plotW = VB_W - PAD.left - PAD.right;
  const plotH = COL_H - PAD.top - PAD.bottom;
  const band = plotW / data.length;
  // 2px surface gap between neighbours; never fill the slot.
  const barWidth = Math.min(24, Math.max(3, band - 2));

  const y = (value: number) => PAD.top + plotH - ((value - rawMin) / (max - rawMin)) * plotH;
  const zeroY = y(0);
  const ticks = niceTicks(rawMin, max, 4);
  const tickIndexes = pickTickIndexes(data.length, 6);

  return (
    <div className="op-chart">
      <svg viewBox={`0 0 ${VB_W} ${COL_H}`} role="img" aria-label={ariaLabel}>
        {ticks.map((tick) => (
          <g key={tick}>
            <line className="op-grid-line" x1={PAD.left} x2={VB_W - PAD.right} y1={y(tick)} y2={y(tick)} />
            <text className="op-tick" x={PAD.left - 10} y={y(tick) + 3.5} textAnchor="end">
              {format(tick)}
            </text>
          </g>
        ))}

        <line className="op-axis-line" x1={PAD.left} x2={VB_W - PAD.right} y1={zeroY} y2={zeroY} />

        {data.map((datum, index) => {
          if (datum.value === null) return null;
          const cx = PAD.left + band * index + band / 2;
          const top = Math.min(y(datum.value), zeroY);
          const height = Math.max(1.5, Math.abs(zeroY - y(datum.value)));
          const fill = datum.value < 0 && negativeColor ? negativeColor : color;
          const selected = selectedKey === datum.key;
          const rows = datum.tooltip ?? [{ label: 'Value', value: format(datum.value), color: fill }];

          const show = () => setTooltip({ x: cx, y: top, title: datum.label, rows });

          return (
            <g
              key={datum.key}
              className="op-bar-group"
              tabIndex={onSelect ? 0 : -1}
              role={onSelect ? 'button' : undefined}
              aria-label={`${datum.label}: ${format(datum.value)}`}
              onMouseEnter={show}
              onFocus={show}
              onMouseLeave={() => setTooltip(null)}
              onBlur={() => setTooltip(null)}
              onClick={() => onSelect?.(datum.key)}
              onKeyDown={(event) => {
                if (onSelect && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  onSelect(datum.key);
                }
              }}
            >
              {/* Hit area is wider than the mark so hovering is forgiving. */}
              <rect className="op-hit" x={cx - band / 2} y={PAD.top} width={band} height={plotH} />
              {selected ? (
                <rect
                  x={cx - barWidth / 2 - 3}
                  y={PAD.top}
                  width={barWidth + 6}
                  height={plotH}
                  rx={6}
                  fill="var(--card-soft)"
                />
              ) : null}
              <rect
                className="op-mark"
                x={cx - barWidth / 2}
                y={top}
                width={barWidth}
                height={height}
                rx={Math.min(4, barWidth / 2)}
                fill={fill}
                opacity={selected ? 1 : 0.9}
              />
            </g>
          );
        })}

        {tickIndexes.map((index) => (
          <text
            key={data[index].key}
            className="op-tick"
            x={PAD.left + band * index + band / 2}
            y={COL_H - PAD.bottom + 20}
            textAnchor="middle"
          >
            {data[index].label}
          </text>
        ))}
      </svg>

      {tooltip ? <Tooltip state={tooltip} width={VB_W} height={COL_H} /> : null}
    </div>
  );
}

/* ── Stacked columns ────────────────────────────────────────── */

export interface StackSeries {
  key: string;
  label: string;
  color: string;
}

export interface StackDatum {
  key: string;
  label: string;
  values: Record<string, number | null>;
}

export function StackedColumnChart({
  data,
  series,
  format = (value: number) => fmtNumber(value),
  ariaLabel,
}: {
  data: StackDatum[];
  series: StackSeries[];
  format?: (value: number) => string;
  ariaLabel: string;
}) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const totals = data.map((d) => series.reduce((acc, s) => acc + (d.values[s.key] ?? 0), 0));
  const max = Math.max(1, ...totals);

  const plotW = VB_W - PAD.left - PAD.right;
  const plotH = COL_H - PAD.top - PAD.bottom;
  const band = plotW / Math.max(1, data.length);
  const barWidth = Math.min(24, Math.max(3, band - 2));

  const y = (value: number) => PAD.top + plotH - (value / max) * plotH;
  const ticks = niceTicks(0, max, 3);
  const tickIndexes = pickTickIndexes(data.length, 6);

  return (
    <div className="op-chart">
      <svg viewBox={`0 0 ${VB_W} ${COL_H}`} role="img" aria-label={ariaLabel}>
        {ticks.map((tick) => (
          <g key={tick}>
            <line className="op-grid-line" x1={PAD.left} x2={VB_W - PAD.right} y1={y(tick)} y2={y(tick)} />
            <text className="op-tick" x={PAD.left - 10} y={y(tick) + 3.5} textAnchor="end">
              {format(tick)}
            </text>
          </g>
        ))}

        <line className="op-axis-line" x1={PAD.left} x2={VB_W - PAD.right} y1={y(0)} y2={y(0)} />

        {data.map((datum, index) => {
          const cx = PAD.left + band * index + band / 2;
          let cursor = 0;
          const rows = series.map((s) => ({
            label: s.label,
            value: format(datum.values[s.key] ?? 0),
            color: s.color,
          }));
          const show = () =>
            setTooltip({ x: cx, y: y(totals[index]), title: datum.label, rows });

          return (
            <g
              key={datum.key}
              className="op-bar-group"
              tabIndex={0}
              aria-label={`${datum.label}: ${rows.map((r) => `${r.label} ${r.value}`).join(', ')}`}
              onMouseEnter={show}
              onFocus={show}
              onMouseLeave={() => setTooltip(null)}
              onBlur={() => setTooltip(null)}
            >
              <rect className="op-hit" x={cx - band / 2} y={PAD.top} width={band} height={plotH} />
              {series.map((s) => {
                const value = datum.values[s.key] ?? 0;
                if (value <= 0) return null;
                const top = y(cursor + value);
                // A 2px surface gap does the separating — never a stroke.
                const height = Math.max(1, y(cursor) - top - 2);
                cursor += value;
                return (
                  <rect
                    key={s.key}
                    className="op-mark"
                    x={cx - barWidth / 2}
                    y={top}
                    width={barWidth}
                    height={height}
                    rx={2}
                    fill={s.color}
                  />
                );
              })}
            </g>
          );
        })}

        {tickIndexes.map((index) => (
          <text
            key={data[index].key}
            className="op-tick"
            x={PAD.left + band * index + band / 2}
            y={COL_H - PAD.bottom + 20}
            textAnchor="middle"
          >
            {data[index].label}
          </text>
        ))}
      </svg>

      {tooltip ? <Tooltip state={tooltip} width={VB_W} height={COL_H} /> : null}

      <div className="op-legend">
        {series.map((s) => (
          <span className="op-legend-item" key={s.key}>
            <span className="op-swatch" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Multi-line ─────────────────────────────────────────────── */

export interface LineSeries {
  key: string;
  label: string;
  color: string;
  values: (number | null)[];
}

export function MultiLineChart({
  labels,
  series,
  unit = '%',
  ariaLabel,
}: {
  labels: string[];
  series: LineSeries[];
  unit?: string;
  ariaLabel: string;
}) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const values = series.flatMap((s) => s.values).filter((v): v is number => v !== null);
  if (!values.length) return <p className="op-empty">No readings in this range yet.</p>;

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const pad = Math.max(0.4, (rawMax - rawMin) * 0.15);
  const min = rawMin - pad;
  const max = rawMax + pad;

  const height = 260;
  const plotW = VB_W - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;

  const x = (i: number) => PAD.left + (labels.length <= 1 ? 0 : (i / (labels.length - 1)) * plotW);
  const y = (v: number) => PAD.top + plotH - ((v - min) / (max - min)) * plotH;

  const ticks = niceTicks(min, max, 4);
  const tickIndexes = pickTickIndexes(labels.length, 6);

  return (
    <div className="op-chart">
      <svg ref={svgRef} viewBox={`0 0 ${VB_W} ${height}`} role="img" aria-label={ariaLabel}>
        {ticks.map((tick) => (
          <g key={tick}>
            <line className="op-grid-line" x1={PAD.left} x2={VB_W - PAD.right} y1={y(tick)} y2={y(tick)} />
            <text className="op-tick" x={PAD.left - 10} y={y(tick) + 3.5} textAnchor="end">
              {fmtNumber(tick, 0)}
            </text>
          </g>
        ))}

        <line
          className="op-axis-line"
          x1={PAD.left}
          x2={VB_W - PAD.right}
          y1={height - PAD.bottom}
          y2={height - PAD.bottom}
        />

        {activeIndex !== null ? (
          <line
            x1={x(activeIndex)}
            x2={x(activeIndex)}
            y1={PAD.top}
            y2={height - PAD.bottom}
            stroke="var(--series-1)"
            strokeWidth={0.75}
            strokeDasharray="3 4"
            opacity={0.5}
          />
        ) : null}

        {series.map((s) => {
          const path = buildPath(s.values.map((v, i) => (v === null ? null : [x(i), y(v)])));
          if (!path) return null;

          let lastIndex = -1;
          for (let i = s.values.length - 1; i >= 0; i -= 1) {
            if (s.values[i] !== null) { lastIndex = i; break; }
          }
          const lastValue = lastIndex >= 0 ? s.values[lastIndex] : null;

          return (
            <g key={s.key}>
              <path className="op-line" d={path} stroke={s.color} />
              {lastValue !== null && lastIndex >= 0 ? (
                <>
                  <circle className="op-dot-ring" cx={x(lastIndex)} cy={y(lastValue)} r={4} fill={s.color} />
                  <text className="op-tick" x={x(lastIndex) + 9} y={y(lastValue) + 3.5}>
                    {fmtNumber(lastValue, 1)}
                  </text>
                </>
              ) : null}
            </g>
          );
        })}

        {tickIndexes.map((index) => (
          <text key={index} className="op-tick" x={x(index)} y={height - PAD.bottom + 20} textAnchor="middle">
            {fmtDate(labels[index])}
          </text>
        ))}

        <rect
          className="op-hit"
          x={PAD.left}
          y={PAD.top}
          width={plotW}
          height={plotH}
          onMouseMove={(event) => {
            if (!svgRef.current) return;
            const bounds = svgRef.current.getBoundingClientRect();
            const svgX = ((event.clientX - bounds.left) / bounds.width) * VB_W;
            const ratio = (svgX - PAD.left) / plotW;
            const index = Math.max(0, Math.min(labels.length - 1, Math.round(ratio * (labels.length - 1))));
            setActiveIndex(index);
            setTooltip({
              x: x(index),
              y: PAD.top + 8,
              title: fmtDate(labels[index]),
              rows: series.map((s) => ({
                label: s.label,
                value: s.values[index] === null ? '—' : `${fmtNumber(s.values[index], 1)}${unit}`,
                color: s.color,
                shape: 'line',
              })),
            });
          }}
          onMouseLeave={() => {
            setTooltip(null);
            setActiveIndex(null);
          }}
        />
      </svg>

      {tooltip ? <Tooltip state={tooltip} width={VB_W} height={height} /> : null}

      <div className="op-legend">
        {series.map((s) => (
          <span className="op-legend-item" key={s.key}>
            <span className="op-swatch" data-shape="line" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Activity rings ─────────────────────────────────────────── */

export interface Ring {
  key: string;
  label: string;
  color: string;
  value: number;
  target: number;
}

export function Rings({
  rings,
  focusKey,
  onFocus,
}: {
  rings: Ring[];
  focusKey: string;
  onFocus: (key: string) => void;
}) {
  const focus = rings.find((r) => r.key === focusKey) ?? rings[0];

  return (
    <svg viewBox="0 0 200 200" style={{ width: 196, height: 196, maxWidth: '100%' }} role="img"
      aria-label={rings
        .map((r) => `${r.label} ${Math.round((r.value / r.target) * 100)} percent of target`)
        .join(', ')}
    >
      {rings.map((ring, index) => {
        const radius = 82 - index * 22;
        const circumference = 2 * Math.PI * radius;
        const pct = ring.target > 0 ? Math.min(1, Math.max(0, ring.value / ring.target)) : 0;
        return (
          <g key={ring.key} style={{ cursor: 'pointer' }} onClick={() => onFocus(ring.key)}>
            <circle cx={100} cy={100} r={radius} fill="none" stroke="var(--track)" strokeWidth={9} />
            <circle
              cx={100}
              cy={100}
              r={radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={9}
              strokeLinecap="round"
              strokeDasharray={`${circumference * pct} ${circumference}`}
              transform="rotate(-90 100 100)"
              style={{ transition: 'stroke-dasharray 600ms cubic-bezier(.16,1,.3,1)' }}
            />
          </g>
        );
      })}
      {focus ? (
        <text x={100} y={104} textAnchor="middle" className="op-tick" style={{ letterSpacing: 1.4 }}>
          {focus.label}
        </text>
      ) : null}
    </svg>
  );
}

/* ── Sparkline ──────────────────────────────────────────────── */

export function Sparkline({
  values,
  color = 'var(--series-1)',
  label,
}: {
  values: (number | null)[];
  color?: string;
  label: string;
}) {
  const clean = values.filter((v): v is number => v !== null && Number.isFinite(v));
  if (clean.length < 2) return null;

  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const width = 120;
  const height = 28;
  const span = max - min || 1;

  const x = (i: number) => (i / (values.length - 1)) * width;
  const y = (v: number) => height - 3 - ((v - min) / span) * (height - 6);

  const path = buildPath(values.map((v, i) => (v === null ? null : [x(i), y(v)])));
  if (!path) return null;

  let lastIndex = values.length - 1;
  while (lastIndex >= 0 && values[lastIndex] === null) lastIndex -= 1;
  const lastValue = lastIndex >= 0 ? values[lastIndex] : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '100%', height: 24, display: 'block', overflow: 'visible' }}
      role="img"
      aria-label={label}
    >
      <path d={path} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
      {lastValue !== null ? (
        <circle className="op-dot-ring" cx={x(lastIndex)} cy={y(lastValue)} r={2.8} fill={color} strokeWidth={1.5} />
      ) : null}
    </svg>
  );
}

/* ── Helpers ────────────────────────────────────────────────── */

/** Build a path that breaks across gaps rather than bridging them. */
function buildPath(points: ([number, number] | null)[]): string {
  let path = '';
  let pen = false;
  for (const point of points) {
    if (!point) { pen = false; continue; }
    path += `${pen ? 'L' : 'M'}${point[0].toFixed(2)},${point[1].toFixed(2)} `;
    pen = true;
  }
  return path.trim();
}

/** Evenly spaced label positions that always include both ends. */
function pickTickIndexes(length: number, count: number): number[] {
  if (length <= 0) return [];
  if (length <= count) return Array.from({ length }, (_, i) => i);
  const step = (length - 1) / (count - 1);
  const indexes = new Set<number>();
  for (let i = 0; i < count; i += 1) indexes.add(Math.round(i * step));
  return [...indexes].sort((a, b) => a - b);
}
