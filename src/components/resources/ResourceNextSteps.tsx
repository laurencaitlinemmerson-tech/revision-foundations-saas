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
    <section
      className="resource-next-steps"
      style={{
        maxWidth: '980px',
        margin: '0 auto',
        padding: '8px 40px 96px',
      }}
    >
      <div
        style={{
          borderTop: '0.5px solid rgba(26,24,21,0.11)',
          paddingTop: '18px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#9A948C',
          }}
        >
          Keep the momentum
        </p>
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: '#9A948C',
            fontWeight: 300,
          }}
        >
          One useful next step beats opening twelve new tabs.
        </p>
      </div>

      <div
        className="resource-next-steps-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
          gap: '18px',
        }}
      >
        <div
          style={{
            border: '0.5px solid rgba(26,24,21,0.11)',
            background: 'var(--surface-sunken)',
            padding: '24px 24px 26px',
          }}
        >
          <p
            style={{
              margin: '0 0 12px',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--blue-600)',
            }}
          >
            Suggested next block
          </p>
          <h2
            style={{
              margin: '0 0 12px',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(28px, 3vw, 38px)',
              lineHeight: 1.08,
              fontWeight: 400,
              color: 'var(--ink-strong)',
              maxWidth: '12ch',
            }}
          >
            Use this page, then move straight into practice.
          </h2>
          <p
            style={{
              margin: '0 0 20px',
              fontSize: '14px',
              lineHeight: 1.8,
              color: 'var(--ink-soft)',
              fontWeight: 300,
              maxWidth: '44ch',
            }}
          >
            You have already done the reading. The best next move is a short practice block or one related guide, while the details are still fresh.
          </p>

          <div style={{ display: 'grid', gap: '10px', marginBottom: '18px' }}>
            {practiceCards.length > 0 ? practiceCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  border: '0.5px solid rgba(26,24,21,0.11)',
                  background: 'var(--surface-raised)',
                  padding: '14px 15px 15px',
                  color: 'var(--ink-strong)',
                }}
              >
                <p
                  style={{
                    margin: '0 0 7px',
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: card.tone,
                  }}
                >
                  {card.eyebrow}
                </p>
                <p
                  style={{
                    margin: '0 0 6px',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '24px',
                    lineHeight: 1.12,
                    fontWeight: 400,
                  }}
                >
                  {card.label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    lineHeight: 1.7,
                    color: 'var(--ink-soft)',
                    fontWeight: 300,
                  }}
                >
                  {card.description}
                </p>
              </Link>
            )) : (
              <Link
                href={branchHref}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  border: '0.5px solid rgba(26,24,21,0.11)',
                  background: 'var(--surface-raised)',
                  padding: '14px 15px 15px',
                  color: 'var(--ink-strong)',
                }}
              >
                <p style={{ margin: '0 0 7px', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A948C' }}>
                  Hub next
                </p>
                <p style={{ margin: '0 0 6px', fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', lineHeight: 1.12, fontWeight: 400 }}>
                  Open more related refreshers.
                </p>
                <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.7, color: 'var(--ink-soft)', fontWeight: 300 }}>
                  Stay in the same branch and keep the topic moving without opening a completely different lane.
                </p>
              </Link>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <Link
              href={branchHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'transparent',
                color: 'var(--ink-strong)',
                textDecoration: 'none',
                padding: '12px 18px',
                border: '0.5px solid rgba(26,24,21,0.11)',
                fontSize: '13px',
              }}
            >
              {branchLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div
          style={{
            border: '0.5px solid rgba(26,24,21,0.11)',
            background: 'var(--surface-raised)',
            padding: '24px',
          }}
        >
          <p
            style={{
              margin: '0 0 16px',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#9A948C',
            }}
          >
            Read next
          </p>

          <div style={{ display: 'grid', gap: '10px' }}>
            {related.map((item) => (
              <Link
                key={item.hubItemId}
                href={item.href}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  padding: '14px 14px 16px',
                  border: '0.5px solid rgba(26,24,21,0.08)',
                  color: 'var(--ink-strong)',
                  background: 'var(--surface-raised)',
                }}
              >
                <p
                  style={{
                    margin: '0 0 5px',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '22px',
                    lineHeight: 1.15,
                    fontWeight: 400,
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    lineHeight: 1.7,
                    color: 'var(--ink-soft)',
                    fontWeight: 300,
                  }}
                >
                  {(item.tags ?? []).slice(0, 3).join(' · ')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .resource-next-steps-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 720px) {
          .resource-next-steps {
            padding-left: 20px !important;
            padding-right: 20px !important;
            padding-bottom: 88px !important;
          }
        }
      `}</style>
    </section>
  );
}
