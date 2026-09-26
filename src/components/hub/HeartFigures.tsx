import type { ReactNode } from 'react';
import ConductionDiagram from './ConductionDiagram';
import { InteractiveHeart } from './InteractiveHeart';
import SheetLinks from './SheetLinks';

function Frame({ caption, sheet, children }: { caption: string; sheet: string; children: ReactNode }) {
  return (
    <figure className="hf-figure">
      {children}
      <figcaption className="hf-caption">{caption}</figcaption>
      <div className="hf-sheet"><SheetLinks slug={sheet} /></div>
      <style>{`
        .hf-figure { margin: 0 0 40px; padding: 24px; border: 0.5px solid var(--hairline-firm); background: var(--surface-page); }
        .hf-caption { margin-top: 14px; text-align: center; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); }
        @media (max-width: 720px) { .hf-figure { padding: 16px; } }
      `}</style>
    </figure>
  );
}

export function HeartFlowFigure({ caption }: { caption?: string }) {
  return (
    <Frame sheet="heart" caption={caption ?? 'Tap the dots to explore the heart, or follow one full loop of blood'}>
      <InteractiveHeart />
    </Frame>
  );
}

export function ConductionFigure({ caption }: { caption?: string }) {
  return (
    <Frame sheet="conduction" caption={caption ?? 'The conduction system — each label shows what happens and where it appears on the ECG'}>
      <ConductionDiagram />
    </Frame>
  );
}
