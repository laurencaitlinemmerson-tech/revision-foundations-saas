import SheetLinks from './SheetLinks';

type Label = {
  text: string;
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
};

type Leader = {
  x: number;
  y: number;
  side: 'left' | 'right' | 'up' | 'down';
  text?: string;
  n?: number;
  anchor?: 'start' | 'middle' | 'end';
};

type Props = {
  sheet?: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  labels?: Label[];
  leaders?: Leader[];
  margin?: { left?: number; right?: number; top?: number; bottom?: number };
  minWidth?: number;
};

export default function AnnotatedDiagram({
  sheet,
  src,
  width,
  height,
  alt,
  caption,
  labels = [],
  leaders = [],
  margin = {},
  minWidth = 520,
}: Props) {
  const mL = margin.left ?? 0;
  const mR = margin.right ?? 0;
  const mT = margin.top ?? 0;
  const mB = margin.bottom ?? 0;
  const vw = width + mL + mR;
  const vh = height + mT + mB;

  return (
    <figure className="ad-figure">
      <div className="ad-scroll">
        <svg className="ad-svg" viewBox={`0 0 ${vw} ${vh}`} role="img" aria-label={alt} style={{ minWidth }}>
          <image href={src} x={mL} y={mT} width={width} height={height} />
          {labels.map((l) => (
            <text key={l.text} x={l.x} y={l.y} textAnchor={l.anchor ?? 'start'} className="ad-label">
              {l.text}
            </text>
          ))}
          {leaders.map((l, i) => {
            const x = l.x + mL;
            const y = l.y + mT;
            if (l.text) {
              const pos =
                l.side === 'left' ? { x: x - 12, y: y + 11, a: 'end' as const }
                : l.side === 'right' ? { x: x + 12, y: y + 11, a: 'start' as const }
                : l.side === 'up' ? { x: x + (l.anchor === 'end' ? 8 : l.anchor === 'start' ? -8 : 0), y: y - 14, a: (l.anchor ?? 'middle') as 'start' | 'middle' | 'end' }
                : { x, y: y + 36, a: (l.anchor ?? 'middle') as 'start' | 'middle' | 'end' };
              return (
                <text key={`${l.text}-${i}`} x={pos.x} y={pos.y} textAnchor={pos.a} className="ad-label">
                  {l.text}
                </text>
              );
            }
            const c =
              l.side === 'left' ? { x: x - 26, y }
              : l.side === 'right' ? { x: x + 26, y }
              : l.side === 'up' ? { x, y: y - 26 }
              : { x, y: y + 26 };
            return (
              <g key={`n-${l.n}-${i}`}>
                <circle cx={c.x} cy={c.y} r="19" className="ad-badge" />
                <text x={c.x} y={c.y + 8} textAnchor="middle" className="ad-badge-n">{l.n}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="ad-caption">{caption}</figcaption>
      {sheet && <div className="ad-sheet"><SheetLinks slug={sheet} /></div>}
      <style>{`
        .ad-figure { margin: 0 0 40px; padding: 24px; border: 0.5px solid var(--hairline-firm); background: var(--surface-page); }
        .ad-scroll { overflow-x: auto; }
        .ad-svg { display: block; width: 100%; height: auto; }
        .ad-label { font-family: var(--font-display, 'Playfair Display', serif); font-size: 34px; fill: var(--ink-strong); }
        .ad-badge { fill: var(--surface-page); stroke: var(--gold-deep, #8a7350); stroke-width: 2; }
        .ad-badge-n { font-family: var(--font-body, 'Inter', sans-serif); font-size: 22px; font-weight: 500; fill: var(--gold-deep, #8a7350); }
        .ad-caption { margin-top: 14px; text-align: center; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); }
        @media (max-width: 720px) { .ad-figure { padding: 16px; } }
      `}</style>
    </figure>
  );
}
