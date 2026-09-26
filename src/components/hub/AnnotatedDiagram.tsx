type Label = {
  text: string;
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
};

type Props = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  labels?: Label[];
  minWidth?: number;
};

export default function AnnotatedDiagram({ src, width, height, alt, caption, labels = [], minWidth = 520 }: Props) {
  return (
    <figure className="ad-figure">
      <div className="ad-scroll">
        <svg className="ad-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={alt} style={{ minWidth }}>
          <image href={src} x="0" y="0" width={width} height={height} />
          {labels.map((l) => (
            <text key={l.text} x={l.x} y={l.y} textAnchor={l.anchor ?? 'start'} className="ad-label">
              {l.text}
            </text>
          ))}
        </svg>
      </div>
      <figcaption className="ad-caption">{caption}</figcaption>
      <style>{`
        .ad-figure { margin: 0 0 40px; padding: 24px; border: 0.5px solid var(--hairline-firm); background: var(--surface-page); }
        .ad-scroll { overflow-x: auto; }
        .ad-svg { display: block; width: 100%; height: auto; }
        .ad-label { font-family: var(--font-display, 'Playfair Display', serif); font-size: 34px; fill: var(--ink-strong); }
        .ad-caption { margin-top: 14px; text-align: center; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); }
        @media (max-width: 720px) { .ad-figure { padding: 16px; } }
      `}</style>
    </figure>
  );
}
