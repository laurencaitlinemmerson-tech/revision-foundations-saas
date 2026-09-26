'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

type Blood = 'Deoxygenated' | 'Oxygenated';

type Part = {
  id: string;
  name: string;
  x: number;
  y: number;
  blood: Blood;
  what: string;
  route: string;
};

const PARTS: Part[] = [
  { id: 'svc', name: 'Superior vena cava', x: 40, y: 23, blood: 'Deoxygenated', what: 'The large vein that brings blood back from the head, neck and arms. The inferior vena cava does the same for the lower body.', route: 'Body → right atrium' },
  { id: 'ivc', name: 'Inferior vena cava', x: 39, y: 73, blood: 'Deoxygenated', what: 'Returns blood from the abdomen and legs. It joins the right atrium from below.', route: 'Lower body → right atrium' },
  { id: 'ra', name: 'Right atrium', x: 42, y: 48, blood: 'Deoxygenated', what: 'A collecting chamber. It receives blood from both vena cavae, and it is where the SA node (the natural pacemaker) sits.', route: 'Vena cavae → tricuspid valve' },
  { id: 'tricuspid', name: 'Tricuspid valve', x: 44, y: 59, blood: 'Deoxygenated', what: 'Three-flap valve between the right atrium and right ventricle. It opens to let blood down, then shuts so it cannot flow back.', route: 'Right atrium → right ventricle' },
  { id: 'rv', name: 'Right ventricle', x: 50, y: 69, blood: 'Deoxygenated', what: 'Pumps blood to the lungs only, so its wall is thinner than the left ventricle.', route: 'Tricuspid valve → pulmonary valve' },
  { id: 'pulmonaryValve', name: 'Pulmonary valve', x: 50.5, y: 50, blood: 'Deoxygenated', what: 'Lets blood leave the right ventricle for the lungs and stops it falling back in between beats.', route: 'Right ventricle → pulmonary artery' },
  { id: 'pa', name: 'Pulmonary artery', x: 55, y: 34, blood: 'Deoxygenated', what: 'The only artery that carries deoxygenated blood. It splits into a right and left branch and takes blood to the lungs to pick up oxygen.', route: 'Right ventricle → lungs' },
  { id: 'pv', name: 'Pulmonary veins', x: 65.5, y: 39, blood: 'Oxygenated', what: 'The only veins that carry oxygenated blood. They bring freshly oxygenated blood from the lungs back to the heart.', route: 'Lungs → left atrium' },
  { id: 'la', name: 'Left atrium', x: 62, y: 42, blood: 'Oxygenated', what: 'Receives oxygenated blood from the lungs and passes it down to the left ventricle.', route: 'Pulmonary veins → mitral valve' },
  { id: 'mitral', name: 'Mitral valve', x: 62, y: 50, blood: 'Oxygenated', what: 'Two-flap valve between the left atrium and left ventricle. Also called the bicuspid valve.', route: 'Left atrium → left ventricle' },
  { id: 'lv', name: 'Left ventricle', x: 62, y: 64, blood: 'Oxygenated', what: 'The strongest chamber, with the thickest wall, because it has to push blood round the whole body.', route: 'Mitral valve → aortic valve' },
  { id: 'aorticValve', name: 'Aortic valve', x: 57.5, y: 50.5, blood: 'Oxygenated', what: 'Opens as the left ventricle squeezes and closes to keep blood from leaking back. The second heart sound (“dub”) is valves like this one closing.', route: 'Left ventricle → aorta' },
  { id: 'aorta', name: 'Aorta', x: 53, y: 17, blood: 'Oxygenated', what: 'The body’s main artery. Every other systemic artery branches from it, including the coronary arteries that feed the heart itself.', route: 'Left ventricle → the whole body' },
];

const FLOW = ['svc', 'ra', 'tricuspid', 'rv', 'pulmonaryValve', 'pa', 'pv', 'la', 'mitral', 'lv', 'aorticValve', 'aorta'];
const LUNG_STEP = FLOW.indexOf('pv');
const BLUE = '#3b7fc0';
const RED = '#e5484d';
const VIOLET = '#8b6fc0';
const ASPECT = 0.625;

const FLOW_NOTE: Record<string, string> = {
  pa: 'Between here and the next step, the blood passes through the lungs and picks up oxygen.',
  pv: 'The blood has just been through the lungs, so it is now oxygen-rich.',
  aorta: 'From here the blood travels round the body, gives up its oxygen, and returns through the vena cavae. The loop starts again.',
};

const partById = (id: string) => PARTS.find((p) => p.id === id) as Part;

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

export function InteractiveHeart() {
  const [selected, setSelected] = useState<string | null>(null);
  const [flowIndex, setFlowIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const part = PARTS.find((p) => p.id === selected) ?? null;
  const inFlow = flowIndex !== null;

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      const cur = flowIndex ?? 0;
      if (cur >= FLOW.length - 1) {
        setPlaying(false);
        return;
      }
      setFlowIndex(cur + 1);
      setSelected(FLOW[cur + 1]);
    }, 3200);
    return () => clearTimeout(t);
  }, [playing, flowIndex]);

  const pick = (id: string) => {
    setPlaying(false);
    setFlowIndex(null);
    setSelected((cur) => (cur === id ? null : id));
  };
  const startFlow = () => {
    setFlowIndex(0);
    setSelected(FLOW[0]);
    setPlaying(true);
  };
  const jump = (i: number) => {
    setPlaying(false);
    setFlowIndex(i);
    setSelected(FLOW[i]);
  };
  const go = (delta: number) => jump(((flowIndex ?? 0) + delta + FLOW.length) % FLOW.length);
  const stop = () => {
    setPlaying(false);
    setFlowIndex(null);
    setSelected(null);
  };

  const pt = (id: string) => {
    const p = partById(id);
    return { x: p.x, y: p.y * ASPECT };
  };

  const accent = part ? (part.blood === 'Oxygenated' ? RED : BLUE) : 'var(--gold)';

  return (
    <div className="ih">
      <style>{CSS}</style>
      <div className="ih-scroll">
        <div className="ih-stage">
          <img
            src="/hub-diagrams/heart-blood-flow-labelled.svg"
            alt="Labelled diagram of the heart with arrows showing the direction of blood flow"
            loading="lazy"
          />
          {inFlow && (
            <svg className="ih-trail" viewBox={`0 0 100 ${100 * ASPECT}`} preserveAspectRatio="none" aria-hidden="true">
              {FLOW.slice(1, (flowIndex ?? 0) + 1).map((id, k) => {
                const i = k + 1;
                const a = pt(FLOW[i - 1]);
                const b = pt(id);
                const lung = i === LUNG_STEP;
                const colour = lung ? VIOLET : i < LUNG_STEP ? BLUE : RED;
                return (
                  <line
                    key={id}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    pathLength={1}
                    className={`ih-seg${i === flowIndex ? ' is-new' : ''}`}
                    style={{ stroke: colour, strokeDasharray: lung ? '0.03 0.03' : undefined }}
                  />
                );
              })}
            </svg>
          )}
          {PARTS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-name={p.name}
              className={`ih-dot${selected === p.id ? ' is-on' : ''}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-label={p.name}
              aria-pressed={selected === p.id}
              onClick={() => pick(p.id)}
            />
          ))}
        </div>
      </div>

      <div className="ih-bar">
        {!inFlow ? (
          <button type="button" className="ih-btn ih-btn-main" onClick={startFlow}>
            <span aria-hidden="true">{'▶'}</span> Follow the blood
          </button>
        ) : (
          <>
            <button type="button" className="ih-btn" onClick={() => go(-1)} aria-label="Previous step">{'←'}</button>
            <button type="button" className="ih-btn ih-btn-main" onClick={() => setPlaying((v) => !v)}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <button type="button" className="ih-btn" onClick={() => go(1)} aria-label="Next step">{'→'}</button>
            <button type="button" className="ih-btn" onClick={stop}>Stop</button>
          </>
        )}
      </div>

      {inFlow && (
        <div className="ih-progress" role="group" aria-label="Steps in the loop of blood">
          {FLOW.map((id, i) => {
            const done = i <= (flowIndex ?? 0);
            const colour = i === LUNG_STEP ? VIOLET : i < LUNG_STEP ? BLUE : RED;
            return (
              <button
                key={id}
                type="button"
                className={`ih-pip${i === flowIndex ? ' is-now' : ''}`}
                style={{ background: done ? colour : undefined }}
                aria-label={`Step ${i + 1}: ${partById(id).name}`}
                onClick={() => jump(i)}
              />
            );
          })}
        </div>
      )}

      <div className="ih-panel" style={{ ['--accent' as string]: accent }} aria-live="polite">
        {part ? (
          <div key={part.id} className="ih-fade">
            <div className="ih-head">
              {inFlow && <span className="ih-count">{(flowIndex ?? 0) + 1}/{FLOW.length}</span>}
              <span className="ih-name">{part.name}</span>
              <span className={`ih-pill ${part.blood === 'Oxygenated' ? 'oxy' : 'deoxy'}`}>{part.blood}</span>
            </div>
            <p className="ih-what">{part.what}</p>
            <p className="ih-route"><strong>Flow:</strong> {part.route}</p>
            {inFlow && FLOW_NOTE[part.id] && <p className="ih-note">{FLOW_NOTE[part.id]}</p>}
          </div>
        ) : (
          <p className="ih-hint">Tap any dot to see what that part does, or press &ldquo;Follow the blood&rdquo; to watch one full loop draw itself.</p>
        )}
      </div>
    </div>
  );
}

type Seg = {
  id: string;
  label: string;
  color: string;
  x1: number;
  x2: number;
  kind: 'wave' | 'interval';
  status: string;
  heart: string;
  check: string;
};

const SEGS: Seg[] = [
  { id: 'p', label: 'P wave', color: '#2f7fc4', x1: 50, x2: 110, kind: 'wave', status: 'Atria contracting', heart: 'The SA node fires and the signal spreads across both atria. The atria contract and push blood into the ventricles.', check: 'One P wave before every QRS means the SA node is in charge. No P waves, or a wavy baseline, points towards atrial fibrillation.' },
  { id: 'pr', label: 'PR segment', color: '#3aa15a', x1: 110, x2: 150, kind: 'wave', status: 'Pausing at the AV node', heart: 'The flat pause while the AV node holds the signal back, so the ventricles have time to fill.', check: 'You do not usually measure this on its own. It is the flat part inside the PR interval.' },
  { id: 'qrs', label: 'QRS complex', color: '#e5484d', x1: 150, x2: 202, kind: 'wave', status: 'Ventricles contracting', heart: 'The signal races down the bundle branches and Purkinje fibres and the ventricles contract: the big squeeze. Q is the first small dip, R the tall spike, S the dip after it. The atria reset at the same time, hidden behind this.', check: 'Should be narrow (under 0.12 s, three small squares). A wide QRS means the signal is taking a slower route, as in bundle branch block or a rhythm starting in the ventricles.' },
  { id: 'st', label: 'ST segment', color: '#8b6fc0', x1: 202, x2: 250, kind: 'wave', status: 'Ventricles holding', heart: 'The ventricles are fully depolarised and squeezing. Nothing is changing, so the line sits flat.', check: 'Should sit level with the baseline. Raised or dipped ST can point to cardiac ischaemia or a heart attack, so report it.' },
  { id: 't', label: 'T wave', color: '#d98a1f', x1: 250, x2: 342, kind: 'wave', status: 'Ventricles resetting', heart: 'Ventricular repolarisation: the ventricles reset, ready for the next beat.', check: 'Usually a gentle upright hump. Very tall, peaked T waves can be a sign of high potassium. Inverted T waves can mean ischaemia (in children, some inversion is normal).' },
  { id: 'pri', label: 'PR interval', color: '#f5a623', x1: 50, x2: 150, kind: 'interval', status: 'Atria to ventricles', heart: 'Start of the P wave to the start of the QRS: the whole journey from the SA node, through the atria and the AV node, to the ventricles.', check: 'Normally 0.12–0.20 s (three to five small squares). Longer than that is first-degree heart block.' },
  { id: 'qt', label: 'QT interval', color: '#3b7fc0', x1: 150, x2: 342, kind: 'interval', status: 'Whole ventricular cycle', heart: 'Start of the QRS to the end of the T wave: the ventricles’ whole electrical cycle, contract then reset.', check: 'Depends on heart rate. A long QT can trigger dangerous rhythms (torsades de pointes), and some medicines lengthen it.' },
];

const TRACE_START = 50;
const TRACE_END = 342;
const FULL_TRACE = 'M50,130 C60,130 68,100 80,100 C92,100 100,130 110,130 L150,130 L158,142 L176,28 L194,168 L202,130 L250,130 C262,130 275,88 296,88 C317,88 330,130 342,130';
const BEAT_ORDER = ['p', 'pr', 'qrs', 'st', 't'];

const PATHS: Record<string, string> = {
  p: 'M50,130 C60,130 68,100 80,100 C92,100 100,130 110,130',
  pr: 'M110,130 L150,130',
  qrs: 'M150,130 L158,142 L176,28 L194,168 L202,130',
  st: 'M202,130 L250,130',
  t: 'M250,130 C262,130 275,88 296,88 C317,88 330,130 342,130',
};

export function InteractiveEcgBeat() {
  const [sel, setSel] = useState<string | null>('qrs');
  const [playing, setPlaying] = useState(false);
  const [dragX, setDragX] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dotY, setDotY] = useState(130);
  const [wrapRef, seen] = useInView<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const s = SEGS.find((x) => x.id === sel) ?? null;
  const dim = (id: string) => (sel && sel !== id ? 0.4 : 1);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      const i = BEAT_ORDER.indexOf(sel ?? '');
      if (i >= BEAT_ORDER.length - 1) {
        setPlaying(false);
        return;
      }
      setSel(BEAT_ORDER[i + 1]);
    }, 2300);
    return () => clearTimeout(t);
  }, [playing, sel]);

  const playBeat = () => {
    setDragX(null);
    setSel(BEAT_ORDER[0]);
    setPlaying(true);
  };
  const choose = (id: string) => {
    setPlaying(false);
    setDragX(null);
    setSel(id);
  };
  const scrubTo = (x: number) => {
    const cx = Math.min(TRACE_END, Math.max(TRACE_START, x));
    const w = SEGS.filter((g) => g.kind === 'wave').find((g) => cx >= g.x1 && cx < g.x2) ?? SEGS[4];
    setPlaying(false);
    setDragX(cx);
    setSel(w.id);
  };
  const toSvg = (e: PointerEvent<SVGSVGElement>) => {
    const r = (svgRef.current as SVGSVGElement).getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 480, y: ((e.clientY - r.top) / r.height) * 240 };
  };
  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    const p = toSvg(e);
    if (p.y > 190 || p.x < TRACE_START - 24 || p.x > TRACE_END + 24) return;
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
    setDragging(true);
    scrubTo(p.x);
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (dragging) scrubTo(toSvg(e).x);
  };
  const onUp = () => setDragging(false);
  const onHandleKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    scrubTo(cursorX + (e.key === 'ArrowRight' ? 8 : -8));
  };
  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(id);
    }
  };

  const waves = SEGS.filter((x) => x.kind === 'wave');
  const ivals = SEGS.filter((x) => x.kind === 'interval');
  const cursorX = dragX ?? (s ? (s.x1 + s.x2) / 2 : TRACE_START);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    let lo = 0;
    let hi = path.getTotalLength();
    for (let i = 0; i < 22; i++) {
      const mid = (lo + hi) / 2;
      if (path.getPointAtLength(mid).x < cursorX) lo = mid;
      else hi = mid;
    }
    setDotY(path.getPointAtLength(lo).y);
  }, [cursorX]);

  return (
    <div className="ih" ref={wrapRef}>
      <style>{CSS}</style>
      <div className="ih-scroll">
        <svg
          ref={svgRef}
          viewBox="0 0 480 240"
          className={`ih-ecg${dragging ? ' is-dragging' : ''}`}
          role="group"
          aria-label="One heartbeat on an ECG. Drag along the trace or select a part to see what it means."
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <defs>
            <pattern id="ih-grid-s" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10,0 L0,0 L0,10" fill="none" stroke="rgba(214,96,96,0.13)" strokeWidth="0.6" />
            </pattern>
            <pattern id="ih-grid-l" width="50" height="50" patternUnits="userSpaceOnUse">
              <rect width="50" height="50" fill="url(#ih-grid-s)" />
              <path d="M50,0 L0,0 L0,50" fill="none" stroke="rgba(214,96,96,0.28)" strokeWidth="0.9" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="480" height="240" fill="url(#ih-grid-l)" />

          <path d="M0,130 L50,130" fill="none" style={{ stroke: 'var(--ink-faint)', strokeWidth: 2.5 }} />
          <path d="M342,130 L480,130" fill="none" style={{ stroke: 'var(--ink-faint)', strokeWidth: 2.5 }} />

          {waves.map((w, i) => (
            <path
              key={w.id}
              d={PATHS[w.id]}
              pathLength={1}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ih-trace"
              style={{
                stroke: w.color,
                strokeWidth: sel === w.id ? 5 : 3,
                opacity: dim(w.id),
                strokeDasharray: 1,
                strokeDashoffset: seen ? 0 : 1,
                transitionDelay: seen ? `${i * 0.28}s, 0s, 0s, 0s` : '0s',
                filter: sel === w.id ? `drop-shadow(0 0 5px ${w.color})` : 'none',
              }}
            />
          ))}

          <path ref={pathRef} d={FULL_TRACE} fill="none" stroke="none" />

          <g className="ih-cursor" style={{ transform: `translateX(${cursorX}px)`, opacity: s ? 1 : 0 }}>
            <line x1="0" y1="8" x2="0" y2="182" style={{ stroke: s?.color ?? 'transparent', strokeWidth: 1.5, strokeDasharray: '3 4' }} />
            <circle cx="0" cy="8" r="4" style={{ fill: s?.color ?? 'transparent' }} />
          </g>

          <g
            className="ih-handle"
            style={{ transform: `translate(${cursorX}px, ${dotY}px)`, opacity: s ? 1 : 0 }}
            role="slider"
            tabIndex={0}
            aria-label="Position along the heartbeat"
            aria-valuemin={TRACE_START}
            aria-valuemax={TRACE_END}
            aria-valuenow={Math.round(cursorX)}
            aria-valuetext={s?.label}
            onKeyDown={onHandleKey}
          >
            <circle r="17" style={{ fill: s?.color ?? 'transparent', opacity: 0.18 }} className="ih-handle-halo" />
            <circle r="9" style={{ fill: '#fff', stroke: s?.color ?? 'transparent', strokeWidth: 3 }} />
            <path d="M-3.5,-2.5 L-6.5,0 L-3.5,2.5 M3.5,-2.5 L6.5,0 L3.5,2.5" fill="none" style={{ stroke: s?.color ?? 'transparent', strokeWidth: 1.4 }} strokeLinecap="round" strokeLinejoin="round" />
          </g>

          <g style={{ fill: 'var(--ink-soft)', fontSize: 13, fontWeight: 500 }} textAnchor="middle">
            <text x="80" y="90">P</text>
            <text x="153" y="158">Q</text>
            <text x="176" y="18">R</text>
            <text x="194" y="186">S</text>
            <text x="296" y="78">T</text>
          </g>

          {waves.map((w) => (
            <rect
              key={w.id}
              x={w.x1}
              y={10}
              width={w.x2 - w.x1}
              height={170}
              fill="transparent"
              role="button"
              tabIndex={0}
              aria-label={w.label}
              aria-pressed={sel === w.id}
              className="ih-hit"
              onClick={() => choose(w.id)}
              onKeyDown={(e) => onKey(e, w.id)}
            />
          ))}

          {ivals.map((v, i) => {
            const y = 205 + i * 24;
            return (
              <g
                key={v.id}
                role="button"
                tabIndex={0}
                aria-label={v.label}
                aria-pressed={sel === v.id}
                className="ih-hit"
                style={{ opacity: dim(v.id) }}
                onClick={() => choose(v.id)}
                onKeyDown={(e) => onKey(e, v.id)}
              >
                <rect x={v.x1} y={y - 11} width={v.x2 - v.x1} height={22} fill="transparent" />
                <line x1={v.x1} y1={y} x2={v.x2} y2={y} style={{ stroke: v.color, strokeWidth: sel === v.id ? 4 : 2.5 }} />
                <line x1={v.x1} y1={y - 5} x2={v.x1} y2={y + 5} style={{ stroke: v.color, strokeWidth: 2.5 }} />
                <line x1={v.x2} y1={y - 5} x2={v.x2} y2={y + 5} style={{ stroke: v.color, strokeWidth: 2.5 }} />
                <text x={v.x2 + 10} y={y + 4} style={{ fill: 'var(--ink-soft)', fontSize: 11 }}>{v.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="ih-bar">
        <button type="button" className="ih-btn ih-btn-main" onClick={playing ? () => setPlaying(false) : playBeat}>
          {playing ? 'Pause' : '▶ Play the beat'}
        </button>
      </div>

      <div className="ih-panel" style={{ ['--accent' as string]: s?.color ?? 'var(--gold)' }} aria-live="polite">
        {s ? (
          <div key={s.id} className="ih-fade">
            <div className="ih-head">
              <span className="ih-name">{s.label}</span>
              <span className="ih-status" style={{ background: s.color }}>{s.status}</span>
            </div>
            <p className="ih-what"><strong>In the heart:</strong> {s.heart}</p>
            <p className="ih-route"><strong>What to look for:</strong> {s.check}</p>
          </div>
        ) : (
          <p className="ih-hint">Drag the handle along the trace, tap any part of the beat, or press play to watch the heart work through one full beat.</p>
        )}
      </div>
    </div>
  );
}


const CSS = `
.ih-scroll { overflow-x: auto; }
.ih-stage { position: relative; min-width: 560px; }
.ih-stage img { display: block; width: 100%; height: auto; }
.ih-trail { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.ih-seg { fill: none; stroke-width: 1.1; stroke-linecap: round; opacity: 0.9; filter: drop-shadow(0 0 0.6px rgba(255,255,255,0.9)); }
.ih-seg.is-new { stroke-dasharray: 1; animation: ih-draw 1.6s ease-out forwards; }
@keyframes ih-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
.ih-ecg { display: block; width: 100%; min-width: 480px; height: auto; border-radius: 2px; background: var(--surface-sunken); }
.ih-trace { transition: stroke-dashoffset 0.9s ease, stroke-width 0.25s ease, opacity 0.25s ease, filter 0.25s ease; }
.ih-cursor { transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease; }
.ih-handle { transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease; cursor: grab; outline: none; }
.ih-handle:focus-visible .ih-handle-halo { opacity: 0.4; }
.ih-ecg { touch-action: pan-y; cursor: ew-resize; user-select: none; -webkit-user-select: none; }
.ih-ecg.is-dragging { cursor: grabbing; }
.ih-ecg.is-dragging .ih-cursor, .ih-ecg.is-dragging .ih-handle { transition: none; cursor: grabbing; }
.ih-hit { cursor: pointer; outline: none; }
.ih-hit:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
.ih-dot {
  position: absolute;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  border: 2px solid #fff;
  background: rgba(166, 144, 107, 0.85);
  box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.55);
  cursor: pointer;
  padding: 0;
  animation: ih-pulse 2.4s ease-out infinite;
  transition: background 0.2s ease;
}
.ih-dot::after {
  content: attr(data-name);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translate(-50%, 4px);
  white-space: nowrap;
  font-size: 11px;
  line-height: 1;
  padding: 5px 9px;
  border-radius: 999px;
  background: var(--ink-strong, #1f1a17);
  color: var(--surface-page, #fff);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.ih-dot:hover, .ih-dot:focus-visible { background: #d9bd83; outline: none; z-index: 3; }
.ih-dot:hover::after, .ih-dot:focus-visible::after { opacity: 1; transform: translate(-50%, 0); }
.ih-dot.is-on { background: #1f1a17; animation: none; box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.55), 0 0 0 6px rgba(255, 255, 255, 0.85); z-index: 2; }
@keyframes ih-pulse {
  0% { box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.55), 0 0 0 0 rgba(255, 255, 255, 0.8); }
  70% { box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.55), 0 0 0 9px rgba(255, 255, 255, 0); }
  100% { box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.55), 0 0 0 0 rgba(255, 255, 255, 0); }
}
.ih-bar { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 16px 0 4px; flex-wrap: wrap; }
.ih-btn {
  font: inherit;
  font-size: 12px;
  padding: 8px 18px;
  border-radius: 999px;
  border: 0.5px solid var(--hairline-firm);
  background: transparent;
  color: var(--ink-mid);
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.ih-btn:hover { border-color: var(--gold); transform: translateY(-1px); box-shadow: var(--shadow-sm); }
.ih-btn-main { background: var(--ink-strong); color: var(--surface-page); border-color: var(--ink-strong); }
.ih-progress { display: flex; justify-content: center; gap: 6px; margin: 12px 0 2px; flex-wrap: wrap; }
.ih-pip {
  width: 22px;
  height: 6px;
  border-radius: 999px;
  border: none;
  padding: 0;
  cursor: pointer;
  background: var(--hairline-firm);
  transition: background 0.4s ease, transform 0.2s ease;
}
.ih-pip:hover { transform: scaleY(1.6); }
.ih-pip.is-now { transform: scaleY(1.8); box-shadow: 0 0 6px rgba(0, 0, 0, 0.25); }
.ih-panel {
  margin-top: 14px;
  padding: 16px 18px 14px 20px;
  border: 0.5px solid var(--hairline-firm);
  border-left: 4px solid var(--accent, var(--gold));
  border-radius: 2px;
  background: var(--surface-sunken);
  min-height: 92px;
  transition: border-left-color 0.4s ease;
}
.ih-fade { animation: ih-fade 0.35s ease both; }
@keyframes ih-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.ih-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
.ih-count { font-size: 10px; letter-spacing: 0.1em; color: var(--ink-faint); text-transform: uppercase; }
.ih-name { font-family: 'Playfair Display', serif; font-size: 19px; color: var(--ink-strong); }
.ih-pill, .ih-status { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 10px; border-radius: 999px; font-weight: 500; }
.ih-pill.oxy { background: var(--red-50); color: var(--red-600); }
.ih-pill.deoxy { background: var(--blue-50); color: var(--blue-800); }
.ih-status { color: #fff; }
.ih-what, .ih-route, .ih-note, .ih-hint { font-size: 13px; line-height: 1.7; color: var(--ink-soft); font-weight: 300; margin: 0 0 6px; }
.ih-what strong, .ih-route strong { font-weight: 500; color: var(--ink-mid); }
.ih-note { font-style: italic; }
.ih-hint { margin: 0; }
@media (prefers-reduced-motion: reduce) {
  .ih-dot, .ih-fade, .ih-seg.is-new { animation: none; }
  .ih-trace, .ih-cursor, .ih-handle, .ih-pip, .ih-btn, .ih-dot::after { transition: none; }
}
`;
