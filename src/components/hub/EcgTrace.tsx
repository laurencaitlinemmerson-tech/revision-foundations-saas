/**
 * A real single-lead ECG (Apple Watch, lead I equivalent, 25 mm/s), cropped from
 * a 30 second recording and annotated. All identifying text was cropped away.
 *
 * Coordinates are in the pixels of the cropped image: 1 large box (5 mm, 0.2 s)
 * is about 59 px, so 1 second is about 295 px.
 */

const W = 1240;
const H = 356;
const TOP = 190;
const BOT = 130;
const BASE = 246;

const t = { fontFamily: "'Inter', sans-serif", fontSize: 21, fill: 'var(--ink-strong)' } as const;
const halo = { paintOrder: 'stroke', stroke: 'var(--surface-page)', strokeWidth: 6, strokeLinejoin: 'round' } as const;
const gold = 'var(--gold-deep, #8a7350)';

function Bracket({ x1, x2, y, label, anchor = 'middle', lx }: { x1: number; x2: number; y: number; label: string; anchor?: 'start' | 'middle' | 'end'; lx?: number }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={gold} strokeWidth="2.5" />
      <line x1={x1} y1={y - 9} x2={x1} y2={y + 9} stroke={gold} strokeWidth="2.5" />
      <line x1={x2} y1={y - 9} x2={x2} y2={y + 9} stroke={gold} strokeWidth="2.5" />
      <text x={lx ?? (x1 + x2) / 2} y={y + 32} textAnchor={anchor} style={{ ...t, ...halo, fill: gold, fontWeight: 600 }}>{label}</text>
    </g>
  );
}

export default function EcgTrace() {
  return (
    <figure className="ecgtr">
      <div className="ecgtr-scroll">
        <svg className="ad-svg ecgtr-svg" viewBox={`0 0 ${W} ${H + TOP + BOT}`} role="img" aria-label="A real sinus rhythm ECG strip with the P wave, PR interval, QRS complex, ST segment, T wave and R to R interval labelled, and a scale showing that five large boxes equal one second">
          <image href="/hub-diagrams/ecg-sinus-rhythm-lead-i.webp" x="0" y={TOP} width={W} height={H} />

          {/* R to R: two neighbouring R waves */}
          <g>
            <line x1="448" y1={TOP + 70} x2="448" y2={TOP - 34} stroke={gold} strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="678" y1={TOP + 92} x2="678" y2={TOP - 34} stroke={gold} strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="448" y1={TOP - 34} x2="678" y2={TOP - 34} stroke={gold} strokeWidth="2.5" />
            <line x1="448" y1={TOP - 43} x2="448" y2={TOP - 25} stroke={gold} strokeWidth="2.5" />
            <line x1="678" y1={TOP - 43} x2="678" y2={TOP - 25} stroke={gold} strokeWidth="2.5" />
            <text x="563" y={TOP - 56} textAnchor="middle" style={{ ...t, fill: gold, fontWeight: 600 }}>R&ndash;R interval</text>
            <text x="563" y={TOP - 82} textAnchor="middle" style={{ ...t, fontSize: 18, fill: 'var(--ink-mid)' }}>about 4 large boxes &rarr; 300 &divide; 4 &asymp; 75 beats a minute</text>
          </g>

          {/* P wave */}
          <text x="330" y={TOP + 205} textAnchor="end" style={{ ...t, ...halo, fontWeight: 600 }}>P wave</text>
          <line x1="336" y1={TOP + 200} x2="392" y2={TOP + 238} stroke="var(--ink-faint)" strokeWidth="1.5" />

          {/* QRS */}
          <text x="478" y={TOP + 44} style={{ ...t, ...halo, fontWeight: 600 }}>QRS complex</text>
          <line x1="474" y1={TOP + 38} x2="452" y2={TOP + 70} stroke="var(--ink-faint)" strokeWidth="1.5" />

          {/* T wave */}
          <text x="560" y={TOP + 130} style={{ ...t, ...halo, fontWeight: 600 }}>T wave</text>
          <line x1="556" y1={TOP + 124} x2="530" y2={TOP + 184} stroke="var(--ink-faint)" strokeWidth="1.5" />

          {/* PR interval and ST segment sit under the baseline */}
          <Bracket x1={385} x2={433} y={TOP + 300} label="PR interval" anchor="end" lx={433} />
          <Bracket x1={462} x2={496} y={TOP + 300} label="ST segment" anchor="start" lx={470} />

          {/* one second scale */}
          <g transform={`translate(0 ${TOP + H + 46})`}>
            <line x1="20" y1="0" x2="315.3" y2="0" stroke={gold} strokeWidth="2.5" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1={20 + i * 59.06} y1="-8" x2={20 + i * 59.06} y2="8" stroke={gold} strokeWidth="2.5" />
            ))}
            <text x="20" y="38" style={{ ...t, fill: gold, fontWeight: 600 }}>5 large boxes = 1 second</text>
            <text x="20" y="64" style={{ ...t, fontSize: 18, fill: 'var(--ink-mid)' }}>1 large box = 0.2 s, 1 small box = 0.04 s</text>
          </g>
        </svg>
      </div>
      <figcaption className="ecgtr-cap">A real 30-second Apple Watch ECG (lead I equivalent), cropped to about four seconds. Average 66 beats a minute, so sinus rhythm.</figcaption>
      <style>{`
        .ecgtr { margin: 0 0 32px; padding: 24px; border: 0.5px solid var(--hairline-firm); background: var(--surface-page); border-radius: 2px; }
        .ecgtr-scroll { overflow-x: auto; }
        .ecgtr-svg { display: block; width: 100%; height: auto; min-width: 640px; }
        .ecgtr-cap { margin-top: 14px; text-align: center; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); }
        @media (max-width: 720px) { .ecgtr { padding: 14px; } }
      `}</style>
    </figure>
  );
}
