export const SHEETS: Record<string, { title: string; blurb: string; answers: boolean }> = {
  heart: { title: 'The Heart & Blood Flow', blurb: 'Colour oxygenated and deoxygenated blood, then label every line.', answers: false },
  conduction: { title: 'The Conduction System', blurb: 'Trace the electrical pathway from the SA node to the Purkinje fibres.', answers: false },
  lungs: { title: 'The Airways', blurb: 'Trachea to alveoli, with a labelled answer page.', answers: true },
  kidney: { title: 'The Kidney', blurb: 'Cortex, pyramids, calyces and vessels, with a labelled answer page.', answers: true },
  brain: { title: 'The Brain (side view)', blurb: 'Colour each lobe, then label the regions from your notes.', answers: false },
};

export function sheetHref(slug: string, ext: 'pdf' | 'png') {
  return `/downloads/colouring-sheets/${slug}-colouring-sheet.${ext}`;
}

export default function SheetLinks({ slug }: { slug: string }) {
  return (
    <p className="sheet-links">
      <a href={sheetHref(slug, 'pdf')} download>Download colouring sheet (PDF for iPad)</a>
      <span aria-hidden="true">&middot;</span>
      <a href={sheetHref(slug, 'png')} download>PNG for Procreate</a>
      <style>{`
        .sheet-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 14px; margin: 12px 0 0; font-size: 12px; color: var(--ink-faint); }
        .sheet-links a { color: var(--ink-mid); text-decoration: underline; text-decoration-color: rgba(166, 144, 107, 0.6); text-underline-offset: 4px; }
        .sheet-links a:hover { color: var(--gold-deep, #8a7350); }
      `}</style>
    </p>
  );
}
