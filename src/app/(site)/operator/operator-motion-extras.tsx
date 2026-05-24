'use client';

/* ============================================================
   operator-motion-extras.tsx
   ============================================================
   Drop-in motion helpers and a small wiring hook to enable the
   classes in operator-dashboard-polish.css.

   Pairs with framer-motion which is already in your project.

   Usage in OperatorDashboardClient.tsx
   ────────────────────────────────────
       import { useDashboardMotion, Breather, SectionRail } from './operator-motion-extras';

       export default function OperatorDashboardClient() {
         useDashboardMotion();
         …
         return (
           <div className="fitness-reference-shell">
             …
             <Breather num="01" title="Today's reading" />
             …
             <SectionRail kicker="Performance" />
             …
           </div>
         );
       }

   Then add the `polish.css` import in your page.tsx after the
   existing dashboard CSS.
   ============================================================ */

import {
  useEffect, useRef, useMemo, type ReactNode, type CSSProperties,
} from 'react';
import { motion, useInView, useReducedMotion, useMotionValue, animate, useTransform } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* ─── Wiring: scroll progress + ambient + in-view + parallax ───────── */
export function useDashboardMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      root.style.setProperty('--scroll-progress', `${pct.toFixed(2)}%`);
      root.style.setProperty('--scroll-y', String(window.scrollY));
      root.style.setProperty('--ambient-shift', `${(window.scrollY * 0.06).toFixed(1)}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const SELECTOR = '[data-section], .fit-section, .fit-block, .fit-breather, .fit-chart, [data-hero-num]';
    const observed = new WeakSet<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('in-view', e.isIntersecting));
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    const observeAll = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
    };
    observeAll();

    // Authed content mounts after first paint — re-scan when the DOM changes.
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

/* ─── Section breather (between major blocks) ───────── */
export function Breather({ num, title, children }: { num: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="fit-breather" data-section>
      <div>
        <div className="fit-breather-title">{title}</div>
        {children}
      </div>
      <div className="fit-breather-num">{num}</div>
    </div>
  );
}

/* ─── Sticky kicker rail ───────── */
export function SectionRail({ kicker }: { kicker: ReactNode }) {
  return (
    <div className="fit-kicker" data-rail style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: 'var(--ink-mute)',
    }}>
      {kicker}
    </div>
  );
}

/* ─── Decorative rule ───────── */
export function DecorativeRule() {
  return <div className="fit-rule-decorative" />;
}

/* ─── In-view reveal with stagger ───────── */
export function RevealStagger({ children, gap = 80, className }: { children: ReactNode[]; gap?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * (gap / 1000)} className={className}>{child}</Reveal>
      ))}
    </>
  );
}

/* ─── Mirror of existing Reveal so consumers don't need two imports ───────── */
export function Reveal({ children, delay = 0, y = 14, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
  const reduce = useReducedMotion();
  if (reduce) return <div ref={ref} className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Magnetic hover for primary CTAs ───────── */
export function Magnetic({ children, strength = 0.18, className, style }: { children: ReactNode; strength?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const el = ref.current; if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onLeave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength, reduce]);
  return (
    <div ref={ref} className={className} style={{ ...style, transition: 'transform 280ms cubic-bezier(.16, 1, .3, 1)' }}>
      {children}
    </div>
  );
}

/* ─── Counter that animates only when scrolled into view ───────── */
export function ViewportCounter({ value, decimals = 0, duration = 1.4, className, suffix }: { value: number; decimals?: number; duration?: number; className?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(reduce ? value : 0);
  const display = useTransform(motionValue, (v) => `${v.toFixed(decimals)}${suffix ?? ''}`);

  useEffect(() => {
    if (reduce) { motionValue.set(value); return; }
    if (!inView) return;
    const c = animate(motionValue, value, { duration, ease: EASE_OUT });
    return c.stop;
  }, [inView, value, duration, reduce, motionValue]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}

/* ─── Animated chart line: tag your <path> with data-trend="observed"
       and your points with data-point. Polish.css handles the rest. ─── */
export const chartPathProps = (length: number) => ({
  'data-trend': 'observed',
  style: { '--len': length } as CSSProperties,
});

/* ─── Section helper: wrap any block with data attribute for polish ─── */
export function Section({ id, children, className, style }: { id?: string; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <section id={id} data-section className={className} style={style}>
      {children}
    </section>
  );
}
