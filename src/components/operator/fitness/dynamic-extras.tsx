'use client';

/* ============================================================
   dynamic-extras.tsx — interactive + animated additions
   ============================================================
   Bundles every dynamic feature into one importable module.

   Exports
   ───────
   useTickerObserver()          attaches count-up to elements with
                                 [data-ticker] — runs once on entry
   useChartDrawObserver()       triggers line draw + point pop on
                                 [data-chart] entry (works with the
                                 classes in operator-dashboard-polish.css)
   useDimOnRead()               dims sections that aren't currently
                                 centred in the viewport
   useStickyRail()              attaches vertical Roman-numeral rail
                                 to a target container

   <TickerNumber value={x} />   drop-in animated figure
   <ChartTooltip />             hover popover for chart points
   <StatRowHover />             wraps a stat row to render gutter
                                 sparkline on hover
   <DraggableEndpoint />        drag-handle for the projection line
                                 endpoint
   <ExpandableTdeeComponent />  click-to-expand TDEE row with slider
   <RunningBalance />           live today's intake vs TDEE ticker
   <StreakChip />               italic streak marker
   <RecoveryBanner />           daily training prescription
   <Breather />                 cinematic full-viewport interstitial
   ============================================================ */

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion, AnimatePresence } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── 1. Universal number ticker ─────────────────────── */
export function TickerNumber({ value, decimals = 0, suffix = '', prefix = '', duration = 1.2, className }: {
  value: number; decimals?: number; suffix?: string; prefix?: string; duration?: number; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const display = useTransform(mv, v => `${prefix}${v.toFixed(decimals)}${suffix}`);
  useEffect(() => {
    if (reduce) { mv.set(value); return; }
    if (!inView) return;
    const c = animate(mv, value, { duration, ease: EASE });
    return c.stop;
  }, [inView, value, duration, reduce, mv]);
  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}

/* ── 2. Chart draw observer ─────────────────────── */
export function useChartDrawObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-chart]:not(.in)').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── 3. Section dimming on read ─────────────────────── */
export function useDimOnRead(selector = 'section[data-section]') {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    if (sections.length === 0) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        (e.target as HTMLElement).style.opacity = e.intersectionRatio > 0.4 ? '1' : '0.45';
        (e.target as HTMLElement).style.transition = 'opacity 600ms cubic-bezier(0.16,1,0.3,1)';
      });
    }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, [selector]);
}

/* ── 4. Sticky Roman-numeral rail ─────────────────────── */
export function StickyNumeralRail({ items }: { items: { id: string; numeral: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      const hits = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (hits[0]) setActive(hits[0].target.id);
    }, { threshold: [0.3, 0.6] });
    items.forEach(it => { const el = document.getElementById(it.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [items]);
  return (
    <nav style={{ position: 'fixed', left: 24, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 22, zIndex: 50 }}>
      {items.map(it => (
        <a key={it.id} href={`#${it.id}`} style={{
          fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
          fontSize: active === it.id ? 16 : 13,
          color: active === it.id ? 'var(--ink)' : 'var(--ink-mute)',
          letterSpacing: '-0.005em', textDecoration: 'none',
          transition: 'color 320ms, font-size 320ms', cursor: 'pointer',
        }} title={it.label}>{it.numeral}</a>
      ))}
    </nav>
  );
}

/* ── 5. Chart tooltip on point hover ─────────────────────── */
export function ChartTooltip({ x, y, date, weight, bmi, note }: {
  x: number; y: number; date: string; weight: number; bmi?: number; note?: string;
}) {
  return (
    <foreignObject x={x - 110} y={y - 90} width={220} height={80} style={{ pointerEvents: 'none' }}>
      <div style={{
        background: 'var(--paper)', border: '0.5px solid var(--rule)',
        padding: '10px 14px', fontFamily: "'Inter', sans-serif",
        boxShadow: '0 12px 32px rgba(26,24,21,0.08)',
      }}>
        <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontWeight: 500 }}>
          {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: 'var(--ink)', marginTop: 4, letterSpacing: '-0.01em' }}>
          {weight.toFixed(1)} <span style={{ fontSize: 10, color: 'var(--ink-mute)' }}>kg</span>
          {bmi !== undefined && <span style={{ marginLeft: 12, fontStyle: 'italic', fontSize: 13, color: 'var(--ink-mute)' }}>BMI {bmi.toFixed(1)}</span>}
        </div>
        {note && (
          <div style={{ marginTop: 6, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
            {note}
          </div>
        )}
      </div>
    </foreignObject>
  );
}

/* ── 6. Stat row with gutter sparkline on hover ─────────────────────── */
export function StatRowHover({ children, sparkPoints, color = 'var(--ink)' }: {
  children: ReactNode; sparkPoints: number[]; color?: string;
}) {
  const [hover, setHover] = useState(false);
  const min = Math.min(...sparkPoints) - 0.2, max = Math.max(...sparkPoints) + 0.2;
  const w = 120, h = 32;
  const path = sparkPoints.map((y, i) => {
    const px = (i / (sparkPoints.length - 1)) * (w - 4) + 2;
    const py = h - ((y - min) / (max - min)) * (h - 4) - 2;
    return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(' ');
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ position: 'relative', transition: 'padding 280ms', paddingLeft: hover ? 14 : 0 }}>
      {children}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{ position: 'absolute', right: -140, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
              <path d={path} fill="none" stroke={color} strokeWidth="1" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 7. Draggable projection endpoint ─────────────────────── */
export function DraggableEndpoint({ x, y, onDrag, label }: {
  x: number; y: number; onDrag: (dx: number, dy: number) => void; label: string;
}) {
  const startRef = useRef<{ mx: number; my: number; x: number; y: number } | null>(null);
  return (
    <g
      style={{ cursor: 'grab' }}
      onMouseDown={(e) => {
        startRef.current = { mx: e.clientX, my: e.clientY, x, y };
        const move = (ev: MouseEvent) => {
          if (!startRef.current) return;
          onDrag(ev.clientX - startRef.current.mx, ev.clientY - startRef.current.my);
        };
        const up = () => {
          window.removeEventListener('mousemove', move);
          window.removeEventListener('mouseup', up);
          startRef.current = null;
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
      }}
    >
      <circle cx={x} cy={y} r="8" fill="var(--paper)" stroke="var(--brass-deep)" strokeWidth="1.5" />
      <circle cx={x} cy={y} r="3" fill="var(--brass-deep)" />
      <text x={x + 14} y={y + 4} fontFamily="Playfair Display" fontStyle="italic" fontSize="13" fill="var(--brass-deep)">{label}</text>
    </g>
  );
}

/* ── 8. Expandable TDEE component with slider ─────────────────────── */
export function ExpandableTdeeComponent({ acronym, fullName, value, percent, color, children, onTune }: {
  acronym: string; fullName: string; value: number; percent: number; color: string; children?: ReactNode; onTune?: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tuneVal, setTuneVal] = useState(value);
  return (
    <div style={{ borderBottom: '0.5px solid var(--rule-soft)' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        all: 'unset', cursor: 'pointer', display: 'grid', gridTemplateColumns: '140px 1fr auto',
        gap: 28, padding: '20px 0', alignItems: 'baseline', width: '100%',
      }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            {value.toLocaleString()} <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: 'var(--ink-mute)' }}>kcal</span>
          </div>
          <div style={{ marginTop: 4, fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontWeight: 500 }}>
            {percent}% of TDEE
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, fontWeight: 600, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--ink)' }}>{acronym}</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 13, color: 'var(--ink-soft)' }}>{fullName}</span>
          </div>
          <div style={{ height: 2, background: 'var(--rule-soft)', marginTop: 10, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, width: `${percent}%`, background: color }} />
          </div>
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 18, color: 'var(--ink-mute)' }}>
          {open ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }} style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 0 24px', fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '64ch' }}>
              {children}
              {onTune && (
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>Tune</span>
                  <input
                    type="range" min={value * 0.5} max={value * 1.5} value={tuneVal}
                    onChange={e => { setTuneVal(+e.target.value); onTune(+e.target.value); }}
                    style={{ flex: 1, accentColor: color }}
                  />
                  <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, color: 'var(--ink)' }}>{Math.round(tuneVal).toLocaleString()}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 9. Today's running balance ticker ─────────────────────── */
export function RunningBalance({ intakeSoFar, tdee, mealsLogged }: {
  intakeSoFar: number; tdee: number; mealsLogged: number;
}) {
  const balance = intakeSoFar - tdee;
  const proRated = (new Date().getHours() / 24) * tdee;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, padding: '14px 18px', background: 'var(--surface)', border: '0.5px solid var(--rule)', marginTop: 16 }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, fontWeight: 500, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>Today</span>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
        <TickerNumber value={intakeSoFar} /> <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: 'var(--ink-mute)' }}>kcal in</span>
      </span>
      <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, color: 'var(--ink-mute)' }}>
        of {Math.round(proRated).toLocaleString()} pro-rated budget · {mealsLogged} meals
      </span>
      <span style={{ marginLeft: 'auto', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, color: balance < 0 ? 'var(--green)' : 'var(--rose)' }}>
        {balance >= 0 ? '+' : ''}{balance.toLocaleString()} kcal
      </span>
    </div>
  );
}

/* ── 10. Streak chip ─────────────────────── */
export function StreakChip({ days, label, tone = 'brass' }: { days: number; label: string; tone?: 'brass' | 'green' | 'rose' }) {
  if (days < 2) return null;
  const colour = tone === 'green' ? 'var(--green)' : tone === 'rose' ? 'var(--rose)' : 'var(--brass-deep)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'baseline', gap: 6,
      fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 13,
      color: colour,
    }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.22em' }}>{days}</span>
      <span>{label}</span>
    </span>
  );
}

/* ── 11. Recovery banner ─────────────────────── */
export function RecoveryBanner({ hrv, rhr, plannedSession }: { hrv: number | null; rhr: number | null; plannedSession: string }) {
  const ready = hrv !== null && rhr !== null && hrv >= 45 && rhr <= 65;
  const recover = hrv !== null && (hrv < 35 || (rhr !== null && rhr > 72));
  const prescription = ready ? `Train as planned — ${plannedSession.toLowerCase()}.`
    : recover ? `Substitute a walk or mobility session — HRV ${hrv}, RHR ${rhr ?? '—'}.`
    : `Train moderately — ease the top sets if effort climbs early.`;
  return (
    <div style={{ padding: '20px 0', borderTop: '0.5px solid var(--rule)', borderBottom: '0.5px solid var(--rule)' }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, fontWeight: 500, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>Today's training</span>
      <p style={{ margin: '8px 0 0', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.005em', lineHeight: 1.35 }}>
        {prescription}
      </p>
    </div>
  );
}

/* ── 12. Cinematic breather ─────────────────────── */
export function Breather({ numeral, italic, plain }: { numeral: string; italic: string; plain?: string }) {
  return (
    <section style={{ minHeight: '60vh', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '64px 0', gap: 48 }}>
      <div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.15, letterSpacing: '-0.015em', color: 'var(--ink)', margin: 0, maxWidth: '20ch' }}>
          {italic}
        </p>
        {plain && (
          <p style={{ marginTop: 18, fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '50ch' }}>
            {plain}
          </p>
        )}
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(96px, 14vw, 168px)', lineHeight: 0.85, color: 'var(--ink)', letterSpacing: '-0.04em' }}>
        {numeral}
      </div>
    </section>
  );
}
