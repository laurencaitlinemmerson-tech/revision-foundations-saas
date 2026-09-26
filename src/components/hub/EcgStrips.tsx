/**
 * Simulated rhythm strips drawn to match a real 25 mm/s trace: grey grid, one
 * smooth crimson line, and the same beat shape (P, QRS, T) as the real recording
 * on the ECG page. Only the timing and shape change, so each abnormality shows.
 *
 * Units match the real crop: the strip is 1240 wide, 1 second is about 295 units,
 * 1 large box (0.2 s) is about 59 units. These are teaching strips, not patient
 * recordings.
 */

const W = 1240;
const H = 356;
const BASE = 236;
const LINE = '#C8102E';
const gold = 'var(--gold-deep, #8a7350)';

export type StripKind = 'normal' | 'af' | 'svt' | 'vt' | 'chb';

const g = (dx: number, c: number, w: number) => Math.exp(-(((dx - c) / w) ** 2));

/** Offsets in SVG units relative to the baseline; negative is up. */
const narrowQrs = (dx: number, k = 1, w = 1) =>
  12 * g(dx, -9 * w, 3 * w) - 166 * k * g(dx, 0, 3.3 * w) + 22 * g(dx, 8 * w, 4 * w);
const pWave = (dx: number, amp = 17) => -amp * g(dx, 0, 11);
const tWave = (dx: number, amp = 50, c = 76, w = 24) => -amp * g(dx, c, w);
const wideQrs = (dx: number) => 22 * g(dx, -16, 8) - 150 * g(dx, 0, 15) + 112 * g(dx, 34, 17);
/** Small irregular baseline wobble for fibrillation. */
const fWaves = (x: number) => 5 * Math.sin(x / 3.4 + 1) + 3.5 * Math.sin(x / 5.1 + 2.3) + 2.5 * Math.sin(x / 2.3 + 0.4);

const seq = (start: number, gaps: number[]) => {
  const out = [start];
  let cur = start;
  for (let i = 0; cur < W + 100; i++) {
    cur += gaps[i % gaps.length];
    out.push(cur);
  }
  return out;
};

type Spec = { rs: number[]; p: number[]; y: (x: number, rs: number[], p: number[]) => number; label: string };

function spec(kind: StripKind): Spec {
  switch (kind) {
    case 'normal': {
      const rs = seq(110, [252]);
      return {
        rs, p: rs.map((r) => r - 51), label: 'Normal sinus rhythm: a P wave before every narrow QRS, evenly spaced',
        y: (x, r, p) => r.reduce((s, q) => s + narrowQrs(x - q) + tWave(x - q), 0) + p.reduce((s, q) => s + pWave(x - q), 0),
      };
    }
    case 'af': {
      const rs = seq(70, [172, 268, 128, 330, 205, 236, 150, 296, 188]);
      return {
        rs, p: [], label: 'Atrial fibrillation: irregularly spaced narrow QRS complexes, no P waves, wavy baseline',
        y: (x, r) => r.reduce((s, q, i) => s + narrowQrs(x - q, 0.9 + ((i * 7) % 5) / 30) + tWave(x - q, 38), 0) + fWaves(x),
      };
    }
    case 'svt': {
      const rs = seq(60, [102]);
      return {
        rs, p: [], label: 'Supraventricular tachycardia: very fast, regular, narrow QRS complexes with no visible P waves',
        y: (x, r) => r.reduce((s, q) => s + narrowQrs(x - q, 0.88) + tWave(x - q, 20, 46, 18) + 6 * g(x - q, 24, 20), 0),
      };
    }
    case 'vt': {
      const rs = seq(80, [108]);
      return {
        rs, p: [], label: 'Ventricular tachycardia: fast, regular, wide and bizarre QRS complexes',
        y: (x, r) => r.reduce((s, q) => s + wideQrs(x - q) - 22 * g(x - q, 78, 24), 0),
      };
    }
    case 'chb': {
      const rs = seq(150, [500]);
      const p = seq(20, [198]);
      return {
        rs, p, label: 'Complete heart block: regular P waves and regular slow QRS complexes running at independent rates',
        y: (x, r, pp) =>
          r.reduce((s, q) => s + narrowQrs(x - q, 0.92, 1.7) + tWave(x - q, 42, 96, 28), 0) + pp.reduce((s, q) => s + pWave(x - q), 0),
      };
    }
  }
}

function path(s: Spec) {
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 1.5) {
    const y = Math.min(H - 12, Math.max(12, BASE + s.y(x, s.rs, s.p)));
    pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

const note = { fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 600, fill: gold, paintOrder: 'stroke', stroke: '#fff', strokeWidth: 6, strokeLinejoin: 'round' } as const;

export function EcgStrip({ kind }: { kind: StripKind }) {
  const s = spec(kind);
  const uid = `ecgs-${kind}`;
  const visible = s.rs.filter((r) => r > 30 && r < W - 30);
  return (
    <div className="ecgstrip">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={s.label}>
        <defs>
          <pattern id={`${uid}-s`} width="11.81" height="11.81" patternUnits="userSpaceOnUse">
            <path d="M11.81 0 H0 V11.81" fill="none" stroke="#e4e4e4" strokeWidth="1" />
          </pattern>
          <pattern id={`${uid}-l`} width="59.06" height="59.06" patternUnits="userSpaceOnUse">
            <path d="M59.06 0 H0 V59.06" fill="none" stroke="#c9c9c9" strokeWidth="1.6" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="#fff" />
        <rect width={W} height={H} fill={`url(#${uid}-s)`} />
        <rect width={W} height={H} fill={`url(#${uid}-l)`} />
        <path d={path(s)} fill="none" stroke={LINE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {kind === 'normal' && (
          <>
            <text x={s.p[1] - 12} y={BASE - 42} style={note}>P</text>
            <text x={s.rs[1] + 12} y={44} style={note}>QRS</text>
            <text x={s.rs[1] + 76} y={BASE - 78} style={note}>T</text>
          </>
        )}

        {(kind === 'af' || kind === 'normal') &&
          visible.slice(0, -1).map((r, i) => {
            const nx = visible[i + 1];
            return (
              <g key={r}>
                <line x1={r} y1="20" x2={nx} y2="20" stroke={gold} strokeWidth="2.5" />
                <line x1={r} y1="12" x2={r} y2="28" stroke={gold} strokeWidth="2.5" />
                <line x1={nx} y1="12" x2={nx} y2="28" stroke={gold} strokeWidth="2.5" />
              </g>
            );
          })}
        {kind === 'af' && <text x="30" y={H - 26} style={note}>No P waves, wavy baseline, uneven gaps</text>}

        {kind === 'svt' && <text x="30" y={H - 26} style={note}>Very fast and regular, narrow QRS, no visible P waves</text>}
        {kind === 'vt' && <text x="30" y={H - 26} style={note}>Wide, bizarre QRS, fast and regular</text>}

        {kind === 'chb' && (
          <>
            {s.p.filter((p) => p > 20 && p < W - 20).map((p) => (
              <polygon key={p} points={`${p - 9},${BASE - 74} ${p + 9},${BASE - 74} ${p},${BASE - 56}`} fill="#2C6FB7" />
            ))}
            <text x="30" y={H - 26} style={{ ...note, fill: '#2C6FB7' }}>&#9660; P waves march on at their own rate, unrelated to the QRS</text>
          </>
        )}
      </svg>
    </div>
  );
}

export function EcgStripStyles() {
  return (
    <style>{`
      .ecgstrip { border: 0.5px solid var(--hairline-firm); border-radius: 2px; overflow: hidden; margin: 14px 0 16px; background: #fff; }
      .ecgstrip svg { display: block; width: 100%; height: auto; }
    `}</style>
  );
}
