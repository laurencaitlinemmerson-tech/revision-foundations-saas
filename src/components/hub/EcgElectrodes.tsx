/**
 * Where the ECG stickers go: the 12-lead layout (4 limb + 6 chest electrodes)
 * and the 3-lead triangle. Schematic, drawn to match the site rather than to
 * scale. Front view, so the patient's right is on the left of the picture.
 */

const RED = '#C0392B';
const YELLOW = '#D9A520';
const GREEN = '#2F8F5B';
const BLACK = '#222222';
const BROWN = '#8B5A2B';
const VIOLET = '#7B4BA8';

const BODY =
  'M225,20 L225,55 C190,62 130,70 95,95 C80,120 76,220 80,300 C81,360 84,405 90,440 L410,440 C416,405 419,360 420,300 C424,220 420,120 405,95 C370,70 310,62 275,55 L275,20';

const label = { fontFamily: "'Inter', sans-serif", fontSize: 11 } as const;

function Torso() {
  return (
    <>
      <path d={BODY} fill="none" stroke="var(--ink-faint)" strokeWidth="1.2" />
      {/* collarbones and breastbone */}
      <path d="M250,78 C215,78 175,82 140,92" fill="none" stroke="var(--hairline-firm)" strokeWidth="1.4" />
      <path d="M250,78 C285,78 325,82 360,92" fill="none" stroke="var(--hairline-firm)" strokeWidth="1.4" />
      <rect x="243" y="78" width="14" height="230" rx="3" fill="none" stroke="var(--hairline-firm)" strokeWidth="1.2" />
    </>
  );
}

function Dot({ x, y, fill, text, dark = false }: { x: number; y: number; fill: string; text: string; dark?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="14" fill={fill} stroke="var(--surface-page)" strokeWidth="2" />
      <text x={x} y={y + 4} textAnchor="middle" style={{ ...label, fontSize: 11, fontWeight: 600, fill: dark ? '#222' : '#fff' }}>{text}</text>
    </g>
  );
}

export function TwelveLeadFigure() {
  const ics = [
    { y: 150, t: '2nd' },
    { y: 185, t: '3rd' },
    { y: 220, t: '4th' },
    { y: 255, t: '5th' },
  ];
  return (
    <figure className="ecgel">
      <svg viewBox="0 0 800 540" role="img" aria-label="Front view of the chest showing where the six chest electrodes V1 to V6 go, and the four limb electrodes listed beneath">
        <Torso />
        {ics.map((r) => (
          <g key={r.y}>
            <line x1="110" y1={r.y} x2="390" y2={r.y} stroke="var(--hairline-soft)" strokeWidth="1" />
            <text x="446" y={r.y + 4} style={{ ...label, fill: 'var(--ink-faint)' }}>{r.t} intercostal space</text>
          </g>
        ))}
        {/* landmark lines on the patient's left */}
        {[
          { x: 335, t: 'Mid-clavicular' },
          { x: 380, t: 'Ant. axillary' },
          { x: 405, t: 'Mid-axillary' },
        ].map((l, i) => (
          <g key={l.t}>
            <line x1={l.x} y1="130" x2={l.x} y2="300" stroke="var(--gold)" strokeWidth="1" strokeDasharray="4 4" />
            <text x={l.x} y={320 + (i % 2) * 14} textAnchor="middle" style={{ ...label, fontSize: 10, fill: 'var(--gold-deep, #8a7350)' }}>{l.t}</text>
          </g>
        ))}
        <line x1="320" y1="255" x2="420" y2="255" stroke="var(--red-600)" strokeWidth="1" strokeDasharray="2 3" />
        <text x="446" y="275" style={{ ...label, fill: 'var(--red-600)' }}>V4, V5, V6 on the same level</text>

        <Dot x={230} y={220} fill={RED} text="V1" />
        <Dot x={270} y={220} fill={YELLOW} text="V2" dark />
        <Dot x={302} y={238} fill={GREEN} text="V3" />
        <Dot x={335} y={255} fill={BROWN} text="V4" />
        <Dot x={380} y={255} fill={BLACK} text="V5" />
        <Dot x={405} y={255} fill={VIOLET} text="V6" />

        <text x="446" y="335" style={{ ...label, fill: 'var(--ink-mid)' }}>V1: 4th space, right of sternum</text>
        <text x="446" y="352" style={{ ...label, fill: 'var(--ink-mid)' }}>V2: 4th space, left of sternum</text>
        <text x="446" y="369" style={{ ...label, fill: 'var(--ink-mid)' }}>V3: halfway between V2 and V4</text>
        <text x="446" y="386" style={{ ...label, fill: 'var(--ink-mid)' }}>V4: 5th space, mid-clavicular line</text>
        <text x="446" y="403" style={{ ...label, fill: 'var(--ink-mid)' }}>V5: same level, anterior axillary line</text>
        <text x="446" y="420" style={{ ...label, fill: 'var(--ink-mid)' }}>V6: same level, mid-axillary line</text>

        {/* limb electrodes */}
        <text x="90" y="478" style={{ ...label, fill: 'var(--ink-faint)', letterSpacing: '0.1em' }}>LIMB ELECTRODES</text>
        <Dot x={110} y={506} fill={RED} text="RA" />
        <text x="132" y="510" style={{ ...label, fill: 'var(--ink-mid)' }}>right wrist</text>
        <Dot x={245} y={506} fill={YELLOW} text="LA" dark />
        <text x="267" y="510" style={{ ...label, fill: 'var(--ink-mid)' }}>left wrist</text>
        <Dot x={370} y={506} fill={GREEN} text="LL" />
        <text x="392" y="510" style={{ ...label, fill: 'var(--ink-mid)' }}>left ankle</text>
        <Dot x={500} y={506} fill={BLACK} text="RL" />
        <text x="522" y="510" style={{ ...label, fill: 'var(--ink-mid)' }}>right ankle (earth)</text>
      </svg>
      <figcaption className="ecgel-cap">The 12-lead layout: 4 limb and 6 chest electrodes. Usual UK colours shown, so check the labels on your own machine.</figcaption>
      <Styles />
    </figure>
  );
}

export function ThreeLeadFigure() {
  const R = { x: 185, y: 112 };
  const L = { x: 315, y: 112 };
  const F = { x: 318, y: 335 };
  return (
    <figure className="ecgel">
      <svg viewBox="0 0 800 470" role="img" aria-label="Front view of the torso showing three electrodes: red below the right collarbone, yellow below the left collarbone and green on the left lower chest, forming a triangle that gives leads I, II and III">
        <Torso />
        <polygon points={`${R.x},${R.y} ${L.x},${L.y} ${F.x},${F.y}`} fill="rgba(203, 174, 120, 0.10)" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x="250" y="102" textAnchor="middle" style={{ ...label, fill: 'var(--gold-deep, #8a7350)', fontWeight: 600 }}>Lead I</text>
        <text x="228" y="232" textAnchor="middle" transform="rotate(-54 228 232)" style={{ ...label, fill: 'var(--gold-deep, #8a7350)', fontWeight: 600 }}>Lead II</text>
        <text x="304" y="232" textAnchor="middle" transform="rotate(88 304 232)" style={{ ...label, fill: 'var(--gold-deep, #8a7350)', fontWeight: 600 }}>Lead III</text>
        <Dot x={R.x} y={R.y} fill={RED} text="RA" />
        <Dot x={L.x} y={L.y} fill={YELLOW} text="LA" dark />
        <Dot x={F.x} y={F.y} fill={GREEN} text="LL" />

        <text x="440" y="118" style={{ ...label, fill: 'var(--ink-mid)' }}>Red: right, just below the collarbone</text>
        <text x="440" y="138" style={{ ...label, fill: 'var(--ink-mid)' }}>Yellow: left, just below the collarbone</text>
        <text x="440" y="158" style={{ ...label, fill: 'var(--ink-mid)' }}>Green: left lower chest or abdomen</text>
        <text x="440" y="196" style={{ ...label, fill: 'var(--ink-faint)' }}>The monitor shows one lead at a time.</text>
        <text x="440" y="214" style={{ ...label, fill: 'var(--ink-faint)' }}>Lead II is the usual choice for rhythm.</text>
      </svg>
      <figcaption className="ecgel-cap">The 3-lead triangle: each side is one view, made from a pair of electrodes.</figcaption>
      <Styles />
    </figure>
  );
}

function Styles() {
  return (
    <style>{`
      .ecgel { margin: 0 0 32px; padding: 24px; border: 0.5px solid var(--hairline-firm); background: var(--surface-page); border-radius: 2px; }
      .ecgel svg { display: block; width: 100%; height: auto; min-width: 520px; }
      .ecgel { overflow-x: auto; }
      .ecgel-cap { margin-top: 14px; text-align: center; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); }
      @media (max-width: 720px) { .ecgel { padding: 14px; } }
    `}</style>
  );
}
