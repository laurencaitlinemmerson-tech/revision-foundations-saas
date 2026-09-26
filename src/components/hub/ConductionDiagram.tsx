type Callout = {
  name: string;
  lines: [string, string];
  side: 'left' | 'right';
  y: number;
  tx: number;
  ty: number;
};

const IMG_X = 450;

const CALLOUTS: Callout[] = [
  { name: 'SA node', lines: ['Natural pacemaker', 'Fires 60–100 bpm → P wave'], side: 'left', y: 520, tx: 155, ty: 520 },
  { name: 'Purkinje fibres', lines: ['Spread through the ventricles', '→ QRS complex'], side: 'left', y: 1110, tx: 800, ty: 1105 },
  { name: 'AV node', lines: ['Holds the signal for ~0.1 s', '→ PR segment'], side: 'right', y: 330, tx: 555, ty: 715 },
  { name: 'Bundle of His', lines: ['Carries the signal on to', 'the bundle branches'], side: 'right', y: 590, tx: 585, ty: 800 },
  { name: 'Bundle branches', lines: ['Run down the septum', 'to the Purkinje fibres'], side: 'right', y: 850, tx: 655, ty: 960 },
];

const BOX_W = 420;

export default function ConductionDiagram() {
  return (
    <div className="cd-scroll">
      <svg
        className="cd-svg"
        viewBox="0 0 1900 1210"
        role="img"
        aria-label="Heart with the conduction system drawn in yellow and labelled: SA node (natural pacemaker, fires 60 to 100 beats per minute, produces the P wave); AV node (holds the signal for about 0.1 seconds, the PR segment); Bundle of His (carries the signal to the bundle branches); bundle branches (run down the septum to the Purkinje fibres); Purkinje fibres (spread the signal through the ventricles, producing the QRS complex)."
      >
        <image href="/hub-diagrams/conduction-heart.webp" x={IMG_X} y="0" width="1000" height="1210" />
        {CALLOUTS.map((c) => {
          const left = c.side === 'left';
          const edge = left ? 20 + BOX_W : 1460;
          const tx = left ? edge : edge;
          const anchor = left ? 'end' : 'start';
          const lineStart = left ? edge + 16 : edge - 16;
          const px = IMG_X + c.tx;
          const top = c.y - 38;
          return (
            <g key={c.name}>
              <line x1={lineStart} y1={c.y + 6} x2={px} y2={c.ty} className="cd-line" />
              <circle cx={px} cy={c.ty} r="7" className="cd-dot" />
              <text x={tx} y={top} textAnchor={anchor} className="cd-name">{c.name}</text>
              <text x={tx} y={top + 40} textAnchor={anchor} className="cd-sub">{c.lines[0]}</text>
              <text x={tx} y={top + 74} textAnchor={anchor} className="cd-sub">{c.lines[1]}</text>
            </g>
          );
        })}
      </svg>
      <style>{`
        .cd-scroll { overflow-x: auto; }
        .cd-svg { display: block; width: 100%; min-width: 690px; height: auto; }
        .cd-line { stroke: var(--ink-faint); stroke-width: 2; }
        .cd-dot { fill: var(--ink-strong); stroke: #fff; stroke-width: 2.5; }
        .cd-name { font-family: var(--font-display, 'Playfair Display', serif); font-size: 46px; fill: var(--ink-strong); }
        .cd-sub { font-family: var(--font-body, 'Inter', sans-serif); font-size: 29px; font-weight: 300; fill: var(--ink-soft); }
      `}</style>
    </div>
  );
}
