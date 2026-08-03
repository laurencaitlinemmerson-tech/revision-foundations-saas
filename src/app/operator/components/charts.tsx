'use client';

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { fmtDate, fmtNumber, niceTicks } from './format';

/* ============================================================
   charts.tsx — the SVG primitives
   ============================================================
   Hand-rolled rather than pulled from a charting library: the
   marks here follow one fixed spec (2px lines, ≥8px markers with
   a 2px surface ring, 24px-max bars with a 2px surface gap,
   solid hairline grid) and every chart ships a crosshair or
   per-mark tooltip plus a table-view twin.

   Charts scale by viewBox, so one set of coordinates works at
   every width.
   ============================================================ */

export interface TooltipRow {
  label: string;
  value: string;
  color?: string;
  shape?: 'line' | 'block';
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
          <span className="op-tooltip-key">
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

/* ── Trajectory: readings, smoothed trend, projection band, goal ── */

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

const VB_W = 860;
const VB_H = 330;
const PAD = { top: 18, right: 62, bottom: 30, left: 46 };

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
    for (const point of projection) {
      values.push(point.lower, point.upper);
    }
    if (goal !== null) values.push(goal);
    if (!values.length) return null;

    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const pad = Math.max(0.5, (rawMax - rawMin) * 0.12);
    const min = rawMin - pad;
    const max = rawMax + pad;

    // The x axis spans readings plus the projected tail.
    const total = points.length + (projection.length ? projection.length - 1 : 0);
    const plotW = VB_W - PAD.left - PAD.right;
    const plotH = VB_H - PAD.top - PAD.bottom;

    const x = (index: number) => PAD.left + (total <= 1 ? 0 : (index / (total - 1)) * plotW);
    const y = (value: number) => PAD.top + plotH - ((value - min) / (max - min)) * plotH;

    return { x, y, min, max, plotW, plotH, total };
  }, [points, projection, goal]);

  /** Nearest reading index to the pointer, in chart coordinates. */
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

  if (!geometry) {
    return <p className="op-empty">No readings in this range yet.</p>;
  }

  const { x, y, min, max } = geometry;
  const ticks = niceTicks(min, max, 4);

  const trendPath = buildPath(points.map((p, i) => (p.trend === null ? null : [x(i), y(p.trend)])));
  const readingDots = points
    .map((p, i) => (p.weight === null ? null : { i, cx: x(i), cy: y(p.weight), value: p.weight }))
    .filter((dot): dot is { i: number; cx: number; cy: number; value: number } => dot !== null);

  const projOffset = points.length - 1;
  const projLine = buildPath(projection.map((p, i) => [x(projOffset + i), y(p.y)]));
  const projBand =
    projection.length > 1
      ? [
          ...projection.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(projOffset + i)},${y(p.upper)}`),
          ...[...projection].reverse().map((p, i) => `L${x(projOffset + projection.length - 1 - i)},${y(p.lower)}`),
          'Z',
        ].join(' ')
      : '';

  const active = activeIndex !== null ? points[activeIndex] : null;
  const lastReading = readingDots[readingDots.length - 1] ?? null;
  const lastProjection = projection[projection.length - 1] ?? null;

  const xTickIndexes = pickTickIndexes(points.length, 6);

  return (
    <div className="op-chart">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label={`Weight trajectory in ${unit}, with a seven-day trend line and a six-week projection band.`}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD.left} y={0} width={VB_W - PAD.left - PAD.right + 30} height={VB_H} />
          </clipPath>
        </defs>

        {ticks.map((tick) => (
          <g key={tick}>
            <line className="op-grid-line" x1={PAD.left} x2={VB_W - PAD.right} y1={y(tick)} y2={y(tick)} />
            <text className="op-tick" x={PAD.left - 10} y={y(tick) + 3.5} textAnchor="end">
              {fmtNumber(tick, 1)}
            </text>
          </g>
        ))}

        {goal !== null && goal >= min && goal <= max ? (
          <g>
            <line
              className="op-axis-line"
              x1={PAD.left}
              x2={VB_W - PAD.right}
              y1={y(goal)}
              y2={y(goal)}
            />
            <text className="op-tick" x={VB_W - PAD.right + 6} y={y(goal) + 3.5}>
              goal {fmtNumber(goal, 1)}
            </text>
          </g>
        ) : null}

        {xTickIndexes.map((index) => (
          <text key={index} className="op-tick" x={x(index)} y={VB_H - PAD.bottom + 18} textAnchor="middle">
            {fmtDate(points[index].date)}
          </text>
        ))}

        <line
          className="op-axis-line"
          x1={PAD.left}
          x2={VB_W - PAD.right}
          y1={VB_H - PAD.bottom}
          y2={VB_H - PAD.bottom}
        />

        <g clipPath={`url(#${clipId})`}>
          {projBand ? <path className="op-band" d={projBand} fill="var(--series-1)" /> : null}
          {projLine ? (
            <path
              className="op-line"
              d={projLine}
              stroke="var(--series-1)"
              strokeOpacity={0.45}
              strokeDasharray="1 7"
            />
          ) : null}

          {readingDots.map((dot) => (
            <circle
              key={dot.i}
              className="op-dot-ring"
              cx={dot.cx}
              cy={dot.cy}
              r={2.6}
              fill="var(--series-1)"
              fillOpacity={0.34}
              strokeWidth={0}
            />
          ))}

          {trendPath ? <path className="op-line" d={trendPath} stroke="var(--series-1)" /> : null}
        </g>

        {/* Endpoint marker + the one direct label this chart carries. */}
        {lastReading ? (
          <>
            <circle className="op-dot-ring" cx={lastReading.cx} cy={lastReading.cy} r={4.5} fill="var(--series-1)" />
            <text className="op-label" x={lastReading.cx + 10} y={lastReading.cy - 9}>
              {fmtNumber(lastReading.value, 1)} {unit}
            </text>
          </>
        ) : null}

        {lastProjection ? (
          <text
            className="op-tick"
            x={x(projOffset + projection.length - 1) + 6}
            y={y(lastProjection.y) + 3.5}
          >
            {fmtNumber(lastProjection.y, 1)}
          </text>
        ) : null}

        {active && activeIndex !== null ? (
          <line
            className="op-crosshair"
            x1={x(activeIndex)}
            x2={x(activeIndex)}
            y1={PAD.top}
            y2={VB_H - PAD.bottom}
          />
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
                { label: 'Reading', value: point.weight === null ? '—' : `${fmtNumber(point.weight, 1)} ${unit}`, color: 'var(--series-1)' },
                { label: '7-day trend', value: point.trend === null ? '—' : `${fmtNumber(point.trend, 1)} ${unit}`, color: 'var(--series-1)', shape: 'line' },
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
    </div>
  );
}

/* ── Columns: single series, signed or unsigned ─────────────── */

export interface ColumnDatum {
  key: string;
  label: string;
  value: number | null;
  tooltip?: TooltipRow[];
}

const COL_H = 210;

export function ColumnChart({
  data,
  color = 'var(--series-1)',
  negativeColor,
  format = (value: number) => fmtNumber(value),
  ariaLabel,
  maxTicks = 4,
  onSelect,
  selectedKey,
}: {
  data: ColumnDatum[];
  color?: string;
  negativeColor?: string;
  format?: (value: number) => string;
  ariaLabel: string;
  maxTicks?: number;
  onSelect?: (key: string) => void;
  selectedKey?: string | null;
}) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const values = data.map((d) => d.value).filter((v): v is number => v !== null);
  if (!values.length) return <p className="op-empty">Nothing logged in this range yet.</p>;

  const rawMax = Math.max(0, ...values);
  const rawMin = Math.min(0, ...values);
  const max = rawMax === rawMin ? rawMax + 1 : rawMax;
  const min = rawMin;

  const plotW = VB_W - PAD.left - PAD.right;
  const plotH = COL_H - PAD.top - PAD.bottom;
  const band = plotW / data.length;
  // 2px surface gap between neighbours, and never a bar that fills its band.
  const barWidth = Math.min(24, Math.max(3, band - 2));

  const y = (value: number) => PAD.top + plotH - ((value - min) / (max - min)) * plotH;
  const zeroY = y(0);
  const ticks = niceTicks(min, max, maxTicks);
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
          const cx = PAD.left + band * index + band / 2;
          if (datum.value === null) return null;

          const top = Math.min(y(datum.value), zeroY);
          const height = Math.max(1.5, Math.abs(zeroY - y(datum.value)));
          const isNegative = datum.value < 0;
          const fill = isNegative && negativeColor ? negativeColor : color;
          const selected = selectedKey === datum.key;

          return (
            <g
              key={datum.key}
              className="op-bar-group"
              tabIndex={onSelect ? 0 : -1}
              role={onSelect ? 'button' : undefined}
              aria-label={`${datum.label}: ${format(datum.value)}`}
              onFocus={() =>
                setTooltip({
                  x: cx,
                  y: top,
                  title: datum.label,
                  rows: datum.tooltip ?? [{ label: 'Value', value: format(datum.value ?? 0), color: fill }],
                })
              }
              onBlur={() => setTooltip(null)}
              onClick={() => onSelect?.(datum.key)}
              onKeyDown={(event) => {
                if (onSelect && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  onSelect(datum.key);
                }
              }}
              onMouseEnter={() =>
                setTooltip({
                  x: cx,
                  y: top,
                  title: datum.label,
                  rows: datum.tooltip ?? [{ label: 'Value', value: format(datum.value ?? 0), color: fill }],
                })
              }
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Hit area is wider than the mark so hovering is forgiving. */}
              <rect className="op-hit" x={cx - band / 2} y={PAD.top} width={band} height={plotH} />
              <rect
                className="op-bar"
                x={cx - barWidth / 2}
                y={top}
                width={barWidth}
                height={height}
                rx={Math.min(4, barWidth / 2)}
                fill={fill}
                opacity={selected ? 1 : 0.88}
              />
              {selected ? (
                <rect
                  x={cx - barWidth / 2 - 2}
                  y={PAD.top}
                  width={barWidth + 4}
                  height={plotH}
                  fill="var(--ink)"
                  opacity={0.05}
                />
              ) : null}
            </g>
          );
        })}

        {tickIndexes.map((index) => (
          <text
            key={data[index].key}
            className="op-tick"
            x={PAD.left + band * index + band / 2}
            y={COL_H - PAD.bottom + 18}
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

  const totals = data.map((datum) =>
    series.reduce((acc, item) => acc + (datum.values[item.key] ?? 0), 0),
  );
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

        <line
          className="op-axis-line"
          x1={PAD.left}
          x2={VB_W - PAD.right}
          y1={y(0)}
          y2={y(0)}
        />

        {data.map((datum, index) => {
          const cx = PAD.left + band * index + band / 2;
          let cursor = 0;

          return (
            <g
              key={datum.key}
              className="op-bar-group"
              tabIndex={0}
              aria-label={`${datum.label}: ${series
                .map((item) => `${item.label} ${format(datum.values[item.key] ?? 0)}`)
                .join(', ')}`}
              onMouseEnter={() =>
                setTooltip({
                  x: cx,
                  y: y(totals[index]),
                  title: datum.label,
                  rows: series.map((item) => ({
                    label: item.label,
                    value: format(datum.values[item.key] ?? 0),
                    color: item.color,
                  })),
                })
              }
              onFocus={() =>
                setTooltip({
                  x: cx,
                  y: y(totals[index]),
                  title: datum.label,
                  rows: series.map((item) => ({
                    label: item.label,
                    value: format(datum.values[item.key] ?? 0),
                    color: item.color,
                  })),
                })
              }
              onMouseLeave={() => setTooltip(null)}
              onBlur={() => setTooltip(null)}
            >
              <rect className="op-hit" x={cx - band / 2} y={PAD.top} width={band} height={plotH} />
              {series.map((item) => {
                const value = datum.values[item.key] ?? 0;
                if (value <= 0) return null;

                const top = y(cursor + value);
                // A 2px surface gap does the separating — never a stroke.
                const height = Math.max(1, y(cursor) - top - 2);
                cursor += value;

                return (
                  <rect
                    key={item.key}
                    className="op-bar"
                    x={cx - barWidth / 2}
                    y={top}
                    width={barWidth}
                    height={height}
                    rx={1.5}
                    fill={item.color}
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
            y={COL_H - PAD.bottom + 18}
            textAnchor="middle"
          >
            {data[index].label}
          </text>
        ))}
      </svg>

      {tooltip ? <Tooltip state={tooltip} width={VB_W} height={COL_H} /> : null}

      <div className="op-legend">
        {series.map((item) => (
          <span className="op-legend-item" key={item.key}>
            <span className="op-swatch" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Multi-line, for indexed comparisons ────────────────────── */

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

  const values = series.flatMap((item) => item.values).filter((v): v is number => v !== null);
  if (!values.length) return <p className="op-empty">No composition readings in this range yet.</p>;

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const pad = Math.max(0.4, (rawMax - rawMin) * 0.15);
  const min = rawMin - pad;
  const max = rawMax + pad;

  const height = 260;
  const plotW = VB_W - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;

  const x = (index: number) => PAD.left + (labels.length <= 1 ? 0 : (index / (labels.length - 1)) * plotW);
  const y = (value: number) => PAD.top + plotH - ((value - min) / (max - min)) * plotH;

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
            className="op-crosshair"
            x1={x(activeIndex)}
            x2={x(activeIndex)}
            y1={PAD.top}
            y2={height - PAD.bottom}
          />
        ) : null}

        {series.map((item) => {
          const path = buildPath(item.values.map((value, i) => (value === null ? null : [x(i), y(value)])));
          if (!path) return null;

          // Direct-label the end of each line; there are few enough
          // series here that they separate at the right edge.
          let lastIndex = -1;
          for (let i = item.values.length - 1; i >= 0; i -= 1) {
            if (item.values[i] !== null) {
              lastIndex = i;
              break;
            }
          }
          const lastValue = lastIndex >= 0 ? item.values[lastIndex] : null;

          return (
            <g key={item.key}>
              <path className="op-line" d={path} stroke={item.color} />
              {lastValue !== null && lastIndex >= 0 ? (
                <>
                  <circle className="op-dot-ring" cx={x(lastIndex)} cy={y(lastValue)} r={4} fill={item.color} />
                  <text className="op-tick" x={x(lastIndex) + 9} y={y(lastValue) + 3.5}>
                    {fmtNumber(lastValue, 1)}
                  </text>
                </>
              ) : null}
            </g>
          );
        })}

        {tickIndexes.map((index) => (
          <text key={index} className="op-tick" x={x(index)} y={height - PAD.bottom + 18} textAnchor="middle">
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
              rows: series.map((item) => ({
                label: item.label,
                value: item.values[index] === null ? '—' : `${fmtNumber(item.values[index], 1)}${unit}`,
                color: item.color,
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
        {series.map((item) => (
          <span className="op-legend-item" key={item.key}>
            <span className="op-swatch" data-shape="line" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Sparkline for stat tiles ───────────────────────────────── */

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
  const width = 96;
  const height = 22;
  const span = max - min || 1;

  const x = (index: number) => (index / (values.length - 1)) * width;
  const y = (value: number) => height - 2 - ((value - min) / span) * (height - 4);

  const path = buildPath(values.map((value, i) => (value === null ? null : [x(i), y(value)])));
  if (!path) return null;

  let lastIndex = values.length - 1;
  while (lastIndex >= 0 && values[lastIndex] === null) lastIndex -= 1;
  const lastValue = lastIndex >= 0 ? values[lastIndex] : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      style={{ overflow: 'visible' }}
    >
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
      {lastValue !== null ? (
        <circle className="op-dot-ring" cx={x(lastIndex)} cy={y(lastValue)} r={2.6} fill={color} strokeWidth={1.5} />
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
    if (!point) {
      pen = false;
      continue;
    }
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
