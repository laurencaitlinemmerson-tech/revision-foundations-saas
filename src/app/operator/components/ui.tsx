'use client';

import { useId, useState, type ReactNode } from 'react';
import { Sparkline } from './charts';

/* Small building blocks shared across the dashboard tabs. */

export function Card({
  title,
  sub,
  action,
  soft,
  children,
  style,
}: {
  title?: string;
  sub?: string;
  action?: ReactNode;
  soft?: boolean;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className={soft ? 'op-card op-card-soft' : 'op-card'} style={style}>
      {title || action ? (
        <div className="op-card-head">
          {title ? <h2>{title}</h2> : <span />}
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
export function Chip({
  value,
  suffix = '',
  digits = 1,
  goodDirection = 'down',
  label,
}: {
  value: number | null;
  suffix?: string;
  digits?: number;
  goodDirection?: 'up' | 'down' | 'none';
  label?: string;
}) {
  if (value === null || !Number.isFinite(value)) {
    return <span className="op-chip" data-tone="flat">{label ?? 'no data'}</span>;
  }

  const rising = value > 0;
  const flat = Math.abs(value) < 10 ** -digits / 2;
  const tone =
    goodDirection === 'none' || flat ? 'flat' : (goodDirection === 'up') === rising ? 'good' : 'bad';

  return (
    <span className="op-chip" data-tone={tone}>
      <span aria-hidden="true">{flat ? '→' : rising ? '↑' : '↓'}</span>
      {`${flat ? '' : rising ? '+' : '−'}${Math.abs(value).toFixed(digits)}${suffix}`}
      {label ? ` ${label}` : ''}
    </span>
  );
}

export function Bar({
  value,
  target,
  color = 'var(--series-1)',
  label,
}: {
  value: number | null;
  target: number;
  color?: string;
  label: string;
}) {
  const pct = value === null || target <= 0 ? 0 : Math.min(100, Math.max(0, (value / target) * 100));
  return (
    <span
      className="op-bar"
      role="meter"
      aria-valuenow={value ?? 0}
      aria-valuemin={0}
      aria-valuemax={target}
      aria-label={label}
    >
      <span style={{ width: `${pct}%`, background: color }} />
    </span>
  );
}

export function Kpi({
  label,
  value,
  unit,
  chip,
  spark,
  color = 'var(--series-1)',
}: {
  label: string;
  value: string;
  unit?: string;
  chip?: ReactNode;
  spark?: (number | null)[];
  color?: string;
}) {
  return (
    <div className="op-kpi">
      <div className="op-kpi-top">
        <span className="op-kpi-label">{label}</span>
        {chip}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 12 }}>
        <span className="op-kpi-value">{value}</span>
        {unit ? <span className="op-kpi-unit">{unit}</span> : null}
      </div>
      <div style={{ marginTop: 10, minHeight: 24 }}>
        {spark ? <Sparkline values={spark} color={color} label={`${label} trend`} /> : null}
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
        style={{ marginTop: 14 }}
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
                  <th key={column} scope="col">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) =>
                    cellIndex === 0 ? (
                      <th key={cellIndex} scope="row">{cell}</th>
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

export function Note({ children }: { children: ReactNode }) {
  return <p className="op-note">{children}</p>;
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <div className="op-field-label">{children}</div>;
}
