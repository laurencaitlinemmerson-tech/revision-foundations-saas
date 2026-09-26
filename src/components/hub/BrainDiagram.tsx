import AnnotatedDiagram from './AnnotatedDiagram';

export default function BrainDiagram({ caption }: { caption?: string }) {
  return (
    <AnnotatedDiagram
      sheet="brain"
      src="/hub-diagrams/organ-brain.webp"
      width={1120}
      height={970}
      margin={{ left: 270, right: 300, top: 50, bottom: 40 }}
      alt="Side view of the brain with the lobes shown in different colours. Labelled: frontal lobe, parietal lobe, occipital lobe, temporal lobe, cerebellum and brainstem. Numbered lines mark other regions to name yourself."
      caption={caption ?? 'The brain from the side — name the numbered lines yourself, then check your notes'}
      minWidth={620}
      leaders={[
        { x: 15, y: 372, side: 'left', text: 'Frontal lobe' },
        { x: 980, y: 297, side: 'right', text: 'Parietal lobe' },
        { x: 1088, y: 680, side: 'right', text: 'Occipital lobe' },
        { x: 195, y: 697, side: 'left', text: 'Temporal lobe' },
        { x: 920, y: 833, side: 'right', text: 'Cerebellum' },
        { x: 772, y: 943, side: 'right', text: 'Brainstem' },
        { x: 818, y: 15, side: 'up', text: 'Primary somatosensory cortex', anchor: 'start' },
        { x: 572, y: 15, side: 'up', text: 'Primary motor cortex', anchor: 'end' },
        { x: 365, y: 75, side: 'up', n: 1 },
        { x: 885, y: 95, side: 'right', n: 2 },
        { x: 203, y: 138, side: 'left', n: 3 },
        { x: 888, y: 178, side: 'right', n: 4 },
        { x: 155, y: 213, side: 'left', n: 5 },
        { x: 1070, y: 436, side: 'right', n: 6 },
        { x: 165, y: 590, side: 'left', n: 7 },
        { x: 225, y: 793, side: 'left', n: 8 },
        { x: 425, y: 820, side: 'down', n: 9 },
        { x: 537, y: 860, side: 'down', n: 10 },
      ]}
    />
  );
}
