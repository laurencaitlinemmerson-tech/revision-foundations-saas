import AnnotatedDiagram from './AnnotatedDiagram';

export default function LungsDiagram({ caption }: { caption?: string }) {
  return (
    <AnnotatedDiagram
      sheet="lungs"
      src="/hub-diagrams/organ-lungs.webp"
      width={1460}
      height={980}
      alt="The lungs and airways: the trachea splits into the main bronchi, which branch into smaller bronchi and bronchioles, ending in clusters of alveoli shown magnified in a circle. Right and left lung are labelled."
      caption={caption ?? 'The airways — trachea to bronchi to bronchioles to alveoli, where gas exchange happens'}
      labels={[
        { text: 'Trachea', x: 985, y: 203 },
        { text: 'Main bronchus', x: 985, y: 367 },
        { text: 'Bronchi', x: 985, y: 481 },
        { text: 'Bronchioles', x: 985, y: 580 },
        { text: 'Alveoli', x: 1055, y: 875, anchor: 'middle' },
        { text: 'Right lung', x: 223, y: 940, anchor: 'end' },
        { text: 'Left lung', x: 908, y: 940 },
      ]}
    />
  );
}
