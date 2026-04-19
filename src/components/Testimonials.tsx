'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

// ─── design tokens ────────────────────────────────────────────────────────────
const serif    = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display  = "'Playfair Display', Georgia, serif";
const ink      = '#1A1815';
const inkMid   = '#5A5750';
const inkLight = '#9C8878';
const panel    = '#FFFFFF';
const parchment = '#F5F3F0';
const border   = 'rgba(0,0,0,0.08)';
const green    = '#1E8A4D';
const greenBg  = '#E6F4EA';
const teal     = '#2F8A7E';
const tealBg   = '#E6F3F1';
const blue     = '#2E67B1';
const blueBg   = '#E7EEF8';
const coral    = '#D96C55';
const coralBg  = '#F8E7E2';
const wrap     = '1120px';

const accents = [
  { color: teal,  bg: tealBg  },
  { color: blue,  bg: blueBg  },
  { color: green, bg: greenBg },
  { color: coral, bg: coralBg },
  { color: teal,  bg: tealBg  },
  { color: blue,  bg: blueBg  },
];

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  created_at?: string | null;
  authorUrl?: string | null;
  authorPhotoUrl?: string | null;
  reviewUrl?: string | null;
}

interface ReviewSummary {
  totalCount: number;
  averageRating: number;
  latestApprovedAt?: string | null;
}

type ReviewSource = 'google' | 'supabase';

interface TestimonialsProps {
  compact?: boolean;
  showProof?: boolean;
}

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 12 12" fill={green}>
          <path d="M6 0l1.545 3.13 3.455.502-2.5 2.436.59 3.44L6 7.895 2.91 9.508l.59-3.44L1 3.632l3.455-.502z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ compact = false, showProof = true }: TestimonialsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({
    totalCount: 0,
    averageRating: 0,
    latestApprovedAt: null,
  });
  const [source, setSource] = useState<ReviewSource>('supabase');
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [sortDescription, setSortDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchReviews() {
      try {
        const response = await fetch('/api/reviews', {
          method: 'GET',
          signal: controller.signal,
        });
        const data = await response.json();
        if (!controller.signal.aborted) {
          setReviews(data.reviews || []);
          setSummary({
            totalCount: data.summary?.totalCount || 0,
            averageRating: data.summary?.averageRating || 0,
            latestApprovedAt: data.summary?.latestApprovedAt || null,
          });
          setSource(data.source === 'google' ? 'google' : 'supabase');
          setReviewUrl(data.reviewUrl || null);
          setSortDescription(data.sortDescription || null);
        }
      } catch {
        if (!controller.signal.aborted) {
          setReviews([]);
          setSummary({ totalCount: 0, averageRating: 0, latestApprovedAt: null });
          setSource('supabase');
          setReviewUrl(null);
          setSortDescription(null);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void fetchReviews();

    return () => controller.abort();
  }, []);

  const isGoogleSource = source === 'google';

  const proofItems = useMemo(
    () => [
      {
        label: isGoogleSource ? 'Google ratings' : 'Approved reviews',
        value: summary.totalCount > 0 ? String(summary.totalCount) : 'New',
        note: summary.totalCount > 0
          ? (isGoogleSource ? 'Ratings shown from your Google Business Profile' : 'Student feedback live on site')
          : 'First feedback cycle in progress',
        accent: teal,
        bg: tealBg,
      },
      {
        label: 'Average rating',
        value: summary.totalCount > 0 ? `${summary.averageRating.toFixed(1)}/5` : 'Student-led',
        note: summary.totalCount > 0
          ? (isGoogleSource ? 'Across Google ratings' : 'Across approved reviews')
          : 'Built while studying children\'s nursing',
        accent: blue,
        bg: blueBg,
      },
      {
        label: 'Free to try',
        value: 'Hub pages',
        note: 'Browse free practical pages before paying',
        accent: green,
        bg: greenBg,
      },
      {
        label: 'Pricing model',
        value: 'One payment',
        note: 'No subscription or recurring charge',
        accent: coral,
        bg: coralBg,
      },
    ],
    [isGoogleSource, summary.averageRating, summary.totalCount],
  );

  const visibleReviews = compact ? reviews.slice(0, 3) : reviews;
  const heading = compact
    ? 'Students are already using it before placement and OSCEs.'
    : 'From students who used it before placement and OSCEs.';

  return (
    <section
      style={{
        padding: compact ? '56px 24px 64px' : '80px 24px 92px',
        borderTop: compact ? 'none' : `1px solid ${border}`,
        background: parchment,
      }}
    >
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>

        {/* ── header ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: serif,
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: inkLight,
                marginBottom: '12px',
              }}
            >
              What students say
            </p>
            <h2
              style={{
                fontFamily: display,
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: 400,
                lineHeight: 1.12,
                color: ink,
                maxWidth: compact ? '16ch' : '18ch',
              }}
            >
              {heading}
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '6px',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 12 12" fill={green}>
                  <path d="M6 0l1.545 3.13 3.455.502-2.5 2.436.59 3.44L6 7.895 2.91 9.508l.59-3.44L1 3.632l3.455-.502z" />
                </svg>
              ))}
            </div>
            <p style={{ fontFamily: serif, fontSize: '13px', color: inkMid, fontWeight: 300 }}>
              {summary.totalCount > 0
                ? (isGoogleSource
                    ? `${summary.totalCount} Google rating${summary.totalCount === 1 ? '' : 's'} · average ${summary.averageRating.toFixed(1)} / 5`
                    : `${summary.totalCount} approved review${summary.totalCount === 1 ? '' : 's'} · average ${summary.averageRating.toFixed(1)} / 5`)
                : 'Student feedback and reviews are building'}
            </p>
            {!compact && (
              reviewUrl ? (
                <a
                  href={reviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: serif,
                    fontSize: '12px',
                    color: ink,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  {isGoogleSource ? 'Leave a Google review ↗' : 'Leave a review →'}
                </a>
              ) : (
                <Link
                  href="/review"
                  style={{
                    fontFamily: serif,
                    fontSize: '12px',
                    color: ink,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  Leave a review →
                </Link>
              )
            )}
          </div>
        </div>

        {!loading && sortDescription && (
          <p
            style={{
              fontFamily: serif,
              fontSize: '12px',
              color: inkLight,
              fontWeight: 300,
              marginBottom: '18px',
            }}
          >
            {sortDescription}
          </p>
        )}

        {showProof && (
          <div
            className="testimonials-proof-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            {proofItems.map((item) => (
              <div
                key={item.label}
                style={{
                  border: `1px solid ${border}`,
                  background: panel,
                  padding: '18px 20px',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    fontFamily: serif,
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: item.accent,
                    background: item.bg,
                    marginBottom: '10px',
                  }}
                >
                  {item.label}
                </span>
                <p style={{ fontFamily: display, fontSize: '26px', color: ink, lineHeight: 1.05, marginBottom: '5px' }}>
                  {item.value}
                </p>
                <p style={{ fontFamily: serif, fontSize: '12px', color: inkMid, fontWeight: 300, lineHeight: 1.6 }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── loading skeletons ── */}
        {loading && (
          <div
            className="testimonials-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}
          >
            {Array.from({ length: compact ? 3 : 6 }).map((_, i) => (
              <div
                key={i}
                className="skeleton-card"
                style={{
                  border: `1px solid ${border}`,
                  background: panel,
                  height: '200px',
                }}
              />
            ))}
          </div>
        )}

        {/* ── reviews grid ── */}
        {!loading && visibleReviews.length > 0 && (
          <div
            className="testimonials-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '16px',
            }}
          >
            {visibleReviews.map((r, i) => {
              const accent = accents[i % accents.length];
              return (
                <div
                  key={r.id}
                  className="testimonial-card"
                  style={{
                    border: `1px solid ${border}`,
                    background: panel,
                    padding: '24px 24px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'default',
                  }}
                >
                  <Stars count={r.rating} />

                  <p
                    style={{
                      fontFamily: display,
                      fontSize: '40px',
                      lineHeight: 0.6,
                      color: accent.color,
                      opacity: 0.2,
                      marginBottom: '10px',
                      userSelect: 'none',
                    }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </p>

                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '14px',
                      lineHeight: 1.85,
                      fontWeight: 300,
                      color: inkMid,
                      flexGrow: 1,
                      marginBottom: '20px',
                    }}
                  >
                    {r.text}
                  </p>

                  <div style={{ height: '1px', background: border, marginBottom: '14px' }} />

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {r.authorPhotoUrl && (
                        <img
                          src={r.authorPhotoUrl}
                          alt=""
                          width={28}
                          height={28}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '999px',
                            objectFit: 'cover',
                            background: parchment,
                          }}
                        />
                      )}
                      {r.authorUrl ? (
                        <a
                          href={r.authorUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontFamily: serif,
                            fontSize: '13px',
                            fontWeight: 500,
                            color: ink,
                            lineHeight: 1.4,
                            textDecoration: 'none',
                          }}
                        >
                          {r.name}
                        </a>
                      ) : (
                        <p
                          style={{
                            fontFamily: serif,
                            fontSize: '13px',
                            fontWeight: 500,
                            color: ink,
                            lineHeight: 1.4,
                          }}
                        >
                          {r.name}
                        </p>
                      )}
                    </div>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '5px 10px',
                        fontFamily: serif,
                        fontSize: '11px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: accent.color,
                        background: accent.bg,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isGoogleSource ? 'Google review' : 'Verified'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── empty state ── */}
        {!loading && visibleReviews.length === 0 && (
          <p
            style={{
              fontFamily: serif,
              fontSize: '14px',
              color: inkLight,
              fontWeight: 300,
              textAlign: 'center',
              padding: '40px 0',
            }}
          >
            Reviews coming soon.
          </p>
        )}
      </div>

      <style>{`
        .testimonial-card {
          transition:
            transform 0.26s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.22s ease,
            box-shadow 0.26s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .testimonial-card:hover {
          border-color: #B8AD9E !important;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 0.2; }
        }
        .skeleton-card {
          animation: pulse 1.6s ease-in-out infinite;
        }
        @media (max-width: 900px) {
          .testimonials-proof-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .testimonials-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 580px) {
          .testimonials-proof-grid {
            grid-template-columns: 1fr !important;
          }
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
