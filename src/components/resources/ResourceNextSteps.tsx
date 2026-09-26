'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  getCatalogItem,
  getRelatedCatalogItems,
} from '@/lib/bookmarks/catalog';
import { getResourceLoopActions } from '@/lib/productLoop';

function getSlugFromPathname(pathname: string | null) {
  if (!pathname) return null;
  const match = pathname.match(/^\/hub\/resources\/([^/]+)/);
  return match?.[1] ?? null;
}

export default function ResourceNextSteps() {
  const pathname = usePathname();
  const slug = getSlugFromPathname(pathname);

  if (!slug) return null;

  const currentItem = getCatalogItem(slug);
  if (!currentItem) return null;
  const tags = currentItem.tags ?? [];

  const isAdult = tags.includes('Adult Nursing');
  const branchHref = isAdult ? '/hub/adult' : '/hub/childrens';
  const branchLabel = isAdult ? 'Return to adult hub' : "Return to children's hub";

  const loopActions = getResourceLoopActions(slug, tags);
  const practiceCards = [
    loopActions.quiz ? { tone: 'var(--blue-600)', soft: 'var(--topic-assessment-surface)', eyebrow: 'Quiz next', ...loopActions.quiz } : null,
    loopActions.osce ? { tone: 'var(--topic-skills-text)', soft: 'var(--topic-skills-surface)', eyebrow: 'OSCE next', ...loopActions.osce } : null,
  ].filter(Boolean) as Array<{
    tone: string;
    soft: string;
    eyebrow: string;
    href: string;
    label: string;
    description: string;
  }>;

  const related = getRelatedCatalogItems(slug, 3);

  return (
    <section className="rns">
      <div className="rns-head">
        <span className="rns-bar" aria-hidden="true" />
        <h2 className="rns-title">
          Keep the <em>momentum</em>
        </h2>
        <p className="rns-sub">One useful next step beats opening twelve new tabs.</p>
      </div>

      <div className="rns-grid">
        <div className="rns-col">
          <p className="rns-eyebrow">Practise next</p>
          <h3 className="rns-lead">Use this page, then move straight into practice.</h3>
          <p className="rns-text">
            You have already done the reading. The best next move is a short practice block or one related guide, while the details are still fresh.
          </p>

          <div className="rns-list">
            {practiceCards.length > 0 ? practiceCards.map((card) => (
              <Link key={card.label} href={card.href} className="rns-row">
                <span className="rns-row-body">
                  <span className="rns-row-eyebrow" style={{ color: card.tone }}>{card.eyebrow}</span>
                  <span className="rns-row-title">{card.label}</span>
                  <span className="rns-row-desc">{card.description}</span>
                </span>
                <span className="rns-arrow" aria-hidden="true">→</span>
              </Link>
            )) : (
              <Link href={branchHref} className="rns-row">
                <span className="rns-row-body">
                  <span className="rns-row-eyebrow">Hub next</span>
                  <span className="rns-row-title">Open more related refreshers.</span>
                  <span className="rns-row-desc">Stay in the same branch and keep the topic moving without opening a completely different lane.</span>
                </span>
                <span className="rns-arrow" aria-hidden="true">→</span>
              </Link>
            )}
          </div>

          <Link href={branchHref} className="rns-textlink">
            {branchLabel} →
          </Link>
        </div>

        <div className="rns-col rns-col-right">
          <p className="rns-eyebrow">Read next</p>
          <div className="rns-list">
            {related.map((item) => (
              <Link key={item.hubItemId} href={item.href} className="rns-row">
                <span className="rns-row-body">
                  <span className="rns-row-title">{item.title}</span>
                  <span className="rns-row-desc">{(item.tags ?? []).slice(0, 3).join(' \u00b7 ')}</span>
                </span>
                <span className="rns-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .rns { max-width: 980px; margin: 0 auto; padding: 8px 40px 96px; }
        .rns-head { position: relative; display: flex; align-items: baseline; flex-wrap: wrap; gap: 6px 18px; padding-top: 22px; margin-bottom: 30px; }
        .rns-bar { position: absolute; top: 0; left: 0; width: 44px; height: 3px; border-radius: 999px; background: var(--gold); }
        .rns-title { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-weight: 400; font-size: clamp(1.6rem, 3vw, 2rem); line-height: 1.15; color: var(--ink-strong); }
        .rns-sub { margin: 0 0 0 auto; font-size: 12px; font-weight: 300; color: var(--ink-faint); }
        .rns-grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); border-top: 0.5px solid var(--hairline-firm); border-bottom: 0.5px solid var(--hairline-firm); }
        .rns-col { padding: 28px 32px 30px 0; }
        .rns-col-right { padding: 28px 0 30px 32px; border-left: 0.5px solid var(--hairline-firm); }
        .rns-eyebrow { margin: 0 0 14px; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold-deep, #8a7350); font-weight: 500; }
        .rns-lead { margin: 0 0 12px; font-family: 'Playfair Display', Georgia, serif; font-weight: 400; font-size: clamp(1.5rem, 2.6vw, 1.9rem); line-height: 1.15; color: var(--ink-strong); max-width: 20ch; }
        .rns-text { margin: 0 0 22px; font-size: 13.5px; line-height: 1.8; font-weight: 300; color: var(--ink-soft); max-width: 46ch; }
        .rns-list { border-top: 0.5px solid var(--hairline-soft); }
        .rns-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 2px; border-bottom: 0.5px solid var(--hairline-soft); text-decoration: none; color: var(--ink-strong); transition: padding-left 0.2s ease; }
        .rns-row:hover { padding-left: 8px; }
        .rns-row-body { display: block; min-width: 0; }
        .rns-row-eyebrow { display: block; margin-bottom: 4px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; }
        .rns-row-title { display: block; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; line-height: 1.2; font-weight: 400; transition: color 0.2s ease; }
        .rns-row:hover .rns-row-title { color: var(--gold-deep, #8a7350); }
        .rns-row-desc { display: block; margin-top: 4px; font-size: 12px; line-height: 1.65; font-weight: 300; color: var(--ink-soft); }
        .rns-arrow { flex-shrink: 0; color: var(--gold); transition: transform 0.2s ease; }
        .rns-row:hover .rns-arrow { transform: translateX(4px); }
        .rns-textlink { display: inline-block; margin-top: 20px; font-size: 12.5px; color: var(--ink-mid); text-decoration: underline; text-decoration-color: rgba(166, 144, 107, 0.6); text-underline-offset: 4px; }
        .rns-textlink:hover { color: var(--gold-deep, #8a7350); }
        @media (max-width: 860px) {
          .rns-grid { grid-template-columns: 1fr; }
          .rns-col { padding: 24px 0 8px; }
          .rns-col-right { padding: 24px 0 26px; border-left: none; border-top: 0.5px solid var(--hairline-firm); }
          .rns-sub { margin-left: 0; width: 100%; }
        }
        @media (max-width: 720px) {
          .rns { padding-left: 20px; padding-right: 20px; padding-bottom: 88px; }
        }
      `}</style>
    </section>
  );
}
