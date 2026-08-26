'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { INK, MUTED, PLUM, RULE_SOFT, SOFT, TRACK } from './palette';

/**
 * The interactive chart layer.
 *
 * Every chart on the dashboard reads back the same way: move across it and the
 * nearest point is picked horizontally, highlighted in place, and named beneath
 * the plot. Picking by x rather than by proximity to the mark keeps a series
 * usable where points cluster or where a bar is only two pixels tall.
 *
 * The readout sits under the plot rather than floating over it, because these
 * SVGs are stretched with preserveAspectRatio="none" — text inside them would
 * be squashed with the geometry.
 */

export type Mark = {
  key: string;
  /** Centre of the mark in viewBox units, for picking and the crosshair. */
  cx: number;
  label: string;
  sub: string;
};

/** Fades and slides a chart in once, unless the viewer asked for less motion. */
export function useMounted(delay = 0) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    // Always deferred to a timer, even at zero delay: setting state synchronously
    // inside the effect would land in the same commit and there would be no
    // transition to watch.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const t = window.setTimeout(() => setOn(true), reduce ? 0 : delay);
    return () => window.clearTimeout(t);
  }, [delay]);
  return on;
}

function Readout({ mark, hint }: { mark: Mark | null; hint: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      gap: 12, marginTop: 8, minHeight: 18,
    }}>
      {mark ? (
        <>
          <span style={{ fontSize: 12.5, color: INK }}>{mark.label}</span>
          <span style={{ fontSize: 11, color: MUTED }}>{mark.sub}</span>
        </>
      ) : (
        <span style={{ fontSize: 11, color: MUTED, fontStyle: 'italic' }}>{hint}</span>
      )}
    </div>
  );
}

/** Shared pointer handling: pick the nearest mark by x and report its index. */
function usePicker(marks: Mark[], width: number) {
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement | null>(null);

  const pick = (clientX: number) => {
    const el = ref.current;
    if (!el || !marks.length) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * width;
    let best = 0;
    for (let i = 1; i < marks.length; i++) {
      if (Math.abs(marks[i].cx - x) < Math.abs(marks[best].cx - x)) best = i;
    }
    setActive(best);
  };

  const handlers = {
    onMouseMove: (e: React.MouseEvent) => pick(e.clientX),
    onMouseLeave: () => setActive(null),
    onTouchStart: (e: React.TouchEvent) => pick(e.touches[0].clientX),
    onTouchMove: (e: React.TouchEvent) => pick(e.touches[0].clientX),
    onTouchEnd: () => setActive(null),
  };

  return { active, setActive, ref, handlers };
}

/* ── Bars ────────────────────────────────────────────────────────────────── */

export type BarMark = Mark & {
  x: number; y: number; w: number; h: number; fill: string;
};

export function BarSeries({
  bars, width, height, hint, zeroY, children, onSelect, selectedKey,
}: {
  bars: BarMark[];
  width: number;
  height: number;
  hint: string;
  /** Draws a baseline, for series that go both ways. */
  zeroY?: number;
  children?: ReactNode;
  onSelect?: (key: string) => void;
  selectedKey?: string | null;
}) {
  const { active, ref, handlers } = usePicker(bars, width);
  const mounted = useMounted(60);
  const mark = active === null ? null : bars[active] ?? null;

  return (
    <div>
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height, display: 'block', touchAction: 'pan-y', cursor: onSelect ? 'pointer' : 'default' }}
        role="img"
        aria-label={hint}
        onClick={() => { if (onSelect && mark) onSelect(mark.key); }}
        {...handlers}
      >
        {zeroY !== undefined && (
          <line x1="0" y1={zeroY} x2={width} y2={zeroY} stroke="rgba(34,28,36,0.22)" strokeWidth="0.75" />
        )}
        {bars.map((b, i) => {
          const on = i === active || b.key === selectedKey;
          // Bars grow from the baseline on mount, so a period change is visible
          // as movement rather than a silent swap.
          const h = mounted ? b.h : 0;
          const y = mounted ? b.y : (zeroY ?? height);
          return (
            <rect
              key={b.key}
              x={b.x} y={y} width={b.w} height={h}
              fill={b.fill}
              opacity={active === null || on ? 1 : 0.45}
              style={{ transition: 'height 420ms cubic-bezier(0.4,0,0.2,1), y 420ms cubic-bezier(0.4,0,0.2,1), opacity 140ms' }}
            />
          );
        })}
        {children}
      </svg>
      <Readout mark={mark} hint={hint} />
    </div>
  );
}

/* ── Line ────────────────────────────────────────────────────────────────── */

export type LineMark = Mark & { cy: number };

export function LineSeries({
  marks, path, area, width, height, hint, stroke = PLUM, fill, gridY = [], children,
}: {
  marks: LineMark[];
  path: string;
  area?: string;
  width: number;
  height: number;
  hint: string;
  stroke?: string;
  fill?: string;
  gridY?: number[];
  /** Drawn beneath the series — target lines, bands, reference marks. */
  children?: ReactNode;
}) {
  const { active, ref, handlers } = usePicker(marks, width);
  const mounted = useMounted(60);
  const mark = active === null ? null : marks[active] ?? null;

  return (
    <div>
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height, display: 'block', touchAction: 'pan-y' }}
        role="img"
        aria-label={hint}
        {...handlers}
      >
        <g stroke="rgba(34,28,36,0.06)" strokeWidth="0.5">
          {gridY.map((y) => <line key={y} x1="0" y1={y} x2={width} y2={y} />)}
        </g>
        {children}
        {area && fill && <path d={area} fill={fill} stroke="none" opacity={mounted ? 1 : 0} style={{ transition: 'opacity 500ms' }} />}
        {path && (
          <path
            d={path} fill="none" stroke={stroke} strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            // The line draws itself in on mount.
            style={{
              strokeDasharray: 2000, strokeDashoffset: mounted ? 0 : 2000,
              transition: 'stroke-dashoffset 900ms cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        )}
        {marks.map((m) => (
          <circle key={m.key} cx={m.cx} cy={m.cy} r="2" fill={stroke} opacity={0.35} />
        ))}
        {mark && (
          <g>
            <line x1={mark.cx} y1="0" x2={mark.cx} y2={height} stroke={stroke} strokeWidth="0.75" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            <circle cx={mark.cx} cy={mark.cy} r="4" fill={stroke} />
          </g>
        )}
      </svg>
      <Readout mark={mark} hint={hint} />
    </div>
  );
}

/* ── Sparkline ───────────────────────────────────────────────────────────── */

/** Small, inline, and still readable — hover names the point in a title. */
export function Sparkline({
  path, stroke, width = 200, height = 44, label,
}: {
  path: string; stroke: string; width?: number; height?: number; label: string;
}) {
  const mounted = useMounted(120);
  if (!path) return <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height }} aria-hidden="true" />;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"
      style={{ width: '100%', height, display: 'block' }} role="img" aria-label={label}>
      <title>{label}</title>
      <path
        d={path} fill="none" stroke={stroke} strokeWidth="1.25" vectorEffect="non-scaling-stroke"
        style={{
          strokeDasharray: 1200, strokeDashoffset: mounted ? 0 : 1200,
          transition: 'stroke-dashoffset 800ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </svg>
  );
}

/* ── Count-up ────────────────────────────────────────────────────────────── */

/**
 * A figure that counts up when it changes, so a period switch reads as movement.
 *
 * The animated text is tagged with the value it is counting toward and is only
 * ever written from inside the frame loop — nothing is set synchronously in the
 * effect, and nothing is read from a ref during render. A value that cannot be
 * animated (an em dash, a first render, a viewer who asked for less motion)
 * simply renders itself, because the tag will not match.
 */
export function Figure({ value, style }: { value: string; style?: CSSProperties }) {
  const [anim, setAnim] = useState<{ of: string; text: string } | null>(null);
  const prev = useRef(value);

  useEffect(() => {
    const num = (v: string) => Number(v.replace(/[^0-9.-]/g, ''));
    const target = num(value);
    const from = num(prev.current);
    const was = prev.current;
    prev.current = value;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || was === value || !Number.isFinite(target) || !Number.isFinite(from)) return;

    const dp = (value.split('.')[1] ?? '').replace(/\D/g, '').length;
    const start = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 520);
      const eased = 1 - (1 - t) ** 3;
      const at = from + (target - from) * eased;
      setAnim({
        of: value,
        text: t >= 1
          ? value
          : at.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp }),
      });
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span style={style}>{anim?.of === value ? anim.text : value}</span>;
}

export { TRACK, SOFT, RULE_SOFT };
