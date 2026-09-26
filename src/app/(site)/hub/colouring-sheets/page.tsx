import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { SHEETS, sheetHref } from '@/components/hub/SheetLinks';

export const metadata = generatePageMetadata({
  title: 'Free colouring sheets for iPad',
  description:
    'Hand-drawn anatomy colouring sheets for nursing students: heart, airways, kidney, brain and the conduction system. Free PDFs for GoodNotes and Notability, and PNGs for Procreate.',
  path: '/hub/colouring-sheets',
});

const ORDER = ['heart', 'conduction', 'lungs', 'kidney', 'brain'];

export default function ColouringSheetsPage() {
  return (
    <main className="cs">
      <div className="cs-wrap">
        <Link href="/hub" className="cs-back">&larr; Hub</Link>
        <p className="cs-kicker">Free downloads</p>
        <h1 className="cs-title">
          Colouring sheets for <em>iPad</em>
        </h1>
        <p className="cs-lede">
          Every diagram in the hub, drawn by hand, as a clean line-art page. Import the PDF into GoodNotes or Notability, or drop the PNG into Procreate, then colour it in and label it from memory. Some come with an answer page.
        </p>

        <div className="cs-grid">
          {ORDER.map((slug) => {
            const sheet = SHEETS[slug];
            return (
              <article key={slug} className="cs-card">
                <div className="cs-thumb">
                  <img src={sheetHref(slug, 'png')} alt={`Blank colouring sheet: ${sheet.title}`} loading="lazy" />
                </div>
                <h2 className="cs-card-title">{sheet.title}</h2>
                <p className="cs-card-text">{sheet.blurb}</p>
                <div className="cs-actions">
                  <a className="cs-btn cs-btn-main" href={sheetHref(slug, 'pdf')} download>PDF for iPad</a>
                  <a className="cs-btn" href={sheetHref(slug, 'png')} download>PNG</a>
                  {sheet.answers && <span className="cs-tag">Answers included</span>}
                </div>
              </article>
            );
          })}
        </div>

        <p className="cs-note">
          Made for personal study. Please don&apos;t resell or redistribute the sheets, but do share the link with your cohort.
        </p>
      </div>
      <style>{`
        .cs { background: var(--surface-page); min-height: 100vh; }
        .cs-wrap { max-width: 1080px; margin: 0 auto; padding: 96px 32px 96px; }
        .cs-back { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-faint); text-decoration: none; }
        .cs-back:hover { color: var(--ink-soft); }
        .cs-kicker { margin: 36px 0 12px; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold-deep, #8a7350); font-weight: 500; }
        .cs-title { margin: 0 0 18px; font-family: 'Playfair Display', Georgia, serif; font-weight: 400; font-size: clamp(2.4rem, 5vw, 3.6rem); line-height: 1.08; color: var(--ink-strong); }
        .cs-lede { max-width: 62ch; margin: 0 0 44px; font-size: 16px; line-height: 1.75; font-weight: 300; color: var(--ink-soft); }
        .cs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .cs-card { border: 0.5px solid var(--hairline-firm); padding: 20px 22px 22px; background: var(--surface-page); transition: border-color 0.2s ease; }
        .cs-card:hover { border-color: var(--gold); }
        .cs-thumb { height: 260px; display: flex; align-items: center; justify-content: center; border-bottom: 0.5px solid var(--hairline-soft); margin-bottom: 18px; padding-bottom: 18px; }
        .cs-thumb img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .cs-card-title { margin: 0 0 6px; font-family: 'Playfair Display', Georgia, serif; font-weight: 400; font-size: 22px; color: var(--ink-strong); }
        .cs-card-text { margin: 0 0 16px; font-size: 13px; line-height: 1.7; font-weight: 300; color: var(--ink-soft); }
        .cs-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .cs-btn { font-size: 12px; padding: 8px 16px; border: 0.5px solid var(--hairline-firm); border-radius: 999px; color: var(--ink-mid); text-decoration: none; transition: border-color 0.2s ease; }
        .cs-btn:hover { border-color: var(--gold); }
        .cs-btn-main { background: var(--ink-strong); color: var(--surface-page); border-color: var(--ink-strong); }
        .cs-tag { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal-800); background: var(--teal-50); padding: 4px 10px; border-radius: 999px; }
        .cs-note { margin-top: 36px; font-size: 12px; font-weight: 300; color: var(--ink-faint); }
        @media (max-width: 640px) { .cs-wrap { padding: 80px 20px 72px; } }
      `}</style>
    </main>
  );
}
