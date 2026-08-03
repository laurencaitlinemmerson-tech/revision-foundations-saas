'use client';

import { useId, useState, type ReactNode } from 'react';
import { Sparkline } from './charts';

/* Small building blocks shared across the dashboard sections. */

export function Section({
  title,
  kicker,
  note,
  action,
  children,
  id,
}: {
  title: string;
  kicker?: string;
  note?: string;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section className="op-section" id={id} aria-label={title}>
      <div className="op-section-head">
        <div>
          {kicker ? <div className="op-kicker">{kicker}</div> : null}
          <h2 className="op-section-title">{title}</h2>
          {note ? <p className="op-section-note">{note}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Card({
  title,
  sub,
  action,
  children,
  className,
}: {
  title?: string;
  sub?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className ? `op-card ${className}` : 'op-card'}>
      {title ? (
        <div className="op-card-head">
          <h3 className="op-card-title">{title}</h3>
          {action}
        </div>
      ) : null}
      {sub ? <p className="op-card-sub">{sub}</p> : null}
      {children}
    </div>
  );
}

/**
 * A signed change. The arrow glyph carries direction alongside the
 * colour, so the meaning survives without hue.
 */
export function Delta({
  value,
  suffix = '',
  digits = 1,
  goodDirection = 'down',
  period,
}: {
  value: number | null;
  suffix?: string;
  digits?: number;
  goodDirection?: 'up' | 'down' | 'none';
  period?: string;
}) {
  if (value === null || !Number.isFinite(value)) {
    return <span className="op-delta">— {period ? <span>{period}</span> : null}</span>;
  }

  const rising = value > 0;
  const flat = Math.abs(value) < 10 ** -digits / 2;
  const tone =
    goodDirection === 'none' || flat
      ? 'flat'
      : (goodDirection === 'up') === rising
        ? 'good'
        : 'bad';

  return (
    <span className="op-delta" data-tone={tone}>
      <span aria-hidden="true">{flat ? '→' : rising ? '↑' : '↓'}</span>
      {`${flat ? '' : rising ? '+' : '−'}${Math.abs(value).toFixed(digits)}${suffix}`}
      {period ? <span style={{ fontWeight: 400, color: 'var(--muted)' }}>{period}</span> : null}
    </span>
  );
}

export function Meter({
  value,
  target,
  label,
  /** Overshooting a calorie target is bad; overshooting protein is not. */
  overIsBad = false,
}: {
  value: number | null;
  target: number;
  label: string;
  overIsBad?: boolean;
}) {
  const ratio = value === null || target <= 0 ? 0 : value / target;
  const tone = overIsBad
    ? ratio > 1.05
      ? 'over'
      : ratio > 0.95
        ? 'near'
        : 'under'
    : ratio >= 1
      ? 'hit'
      : ratio >= 0.8
        ? 'near'
        : 'under';

  return (
    <span
      className="op-meter"
      data-tone={tone}
      role="meter"
      aria-valuenow={value ?? 0}
      aria-valuemin={0}
      aria-valuemax={target}
      aria-label={label}
    >
      <span style={{ width: `${Math.min(100, Math.max(0, ratio * 100))}%` }} />
    </span>
  );
}

export function StatTile({
  label,
  value,
  unit,
  foot,
  delta,
  spark,
  sparkColor,
  meter,
}: {
  label: string;
  value: string;
  unit?: string;
  foot?: ReactNode;
  delta?: ReactNode;
  spark?: (number | null)[];
  sparkColor?: string;
  meter?: { value: number | null; target: number; overIsBad?: boolean };
}) {
  return (
    <div className="op-stat">
      <div className="op-stat-label">{label}</div>
      <div className="op-stat-value">
        {value}
        {unit ? <small>{unit}</small> : null}
      </div>
      {meter ? (
        <Meter value={meter.value} target={meter.target} label={label} overIsBad={meter.overIsBad} />
      ) : null}
      <div className="op-stat-foot">
        <span>{foot}</span>
        {delta ?? (spark ? <Sparkline values={spark} color={sparkColor} label={`${label} trend`} /> : null)}
      </div>
    </div>
  );
}

/**
 * Every chart ships one of these. It is the WCAG-clean twin — the
 * route to a value that never depends on colour or hover.
 */
export function TableView({
  caption,
  columns,
  rows,
  buttonLabel = 'Table view',
}: {
  caption: string;
  columns: string[];
  rows: (string | number)[][];
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <>
      <button
        type="button"
        className="op-btn"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? 'Hide table' : buttonLabel}
      </button>

      {open ? (
        <div className="op-tableview" id={id}>
          <table className="op-table">
            <caption>{caption}</caption>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) =>
                    cellIndex === 0 ? (
                      <th key={cellIndex} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={cellIndex}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}

export function Note({
  tone = 'neutral',
  icon = '◆',
  children,
}: {
  tone?: 'neutral' | 'good' | 'warning';
  icon?: string;
  children: ReactNode;
}) {
  return (
    <div className="op-note" data-tone={tone}>
      <span className="op-note-icon" aria-hidden="true">
        {icon}
      </span>
      <p style={{ margin: 0 }}>{children}</p>
    </div>
  );
}
