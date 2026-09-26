import AnnotatedDiagram from './AnnotatedDiagram';

export default function KidneyDiagram({ caption }: { caption?: string }) {
  return (
    <AnnotatedDiagram
      sheet="kidney"
      src="/hub-diagrams/organ-kidney.webp"
      width={930}
      height={1050}
      margin={{ left: 320, right: 380 }}
      alt="Cross-section of the kidney. Labelled: renal cortex, renal capsule, calyces, renal pelvis, ureter, renal pyramid, renal papilla, renal column, and the renal, segmental, arcuate and interlobar blood vessels."
      caption={caption ?? 'Cross-section of the kidney — name the numbered lines yourself, then check your notes'}
      minWidth={560}
      leaders={[
        { x: 58, y: 110, side: 'left', text: 'Renal cortex' },
        { x: 137, y: 215, side: 'left', text: 'Renal capsule' },
        { x: 122, y: 318, side: 'left', text: 'Major calyx' },
        { x: 82, y: 412, side: 'left', text: 'Renal artery' },
        { x: 75, y: 585, side: 'left', text: 'Renal vein' },
        { x: 133, y: 665, side: 'left', text: 'Segmental artery' },
        { x: 125, y: 778, side: 'left', text: 'Segmental vein' },
        { x: 82, y: 885, side: 'left', text: 'Renal pelvis' },
        { x: 17, y: 963, side: 'left', text: 'Ureter' },
        { x: 780, y: 222, side: 'right', text: 'Renal papilla' },
        { x: 802, y: 333, side: 'right', text: 'Minor calyx' },
        { x: 850, y: 462, side: 'right', text: 'Renal pyramid' },
        { x: 853, y: 594, side: 'right', text: 'Arcuate artery' },
        { x: 835, y: 688, side: 'right', text: 'Arcuate vein' },
        { x: 793, y: 802, side: 'right', text: 'Renal column' },
        { x: 810, y: 896, side: 'right', text: 'Interlobar artery' },
      ]}
    />
  );
}
