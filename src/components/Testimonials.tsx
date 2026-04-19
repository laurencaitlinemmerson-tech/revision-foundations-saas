'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

// ─── types ────────────────────────────────────────────────────────────

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

// ─── configuration ────────────────────────────────────────────────────────────

const accents = [
  { color: '#2F8A7E', bg: '#E6F3F1' }, // teal
  { color: '#2E67B1', bg: '#E7EEF8' }, // blue
  { color: '#1E8A4D', bg: '#E6F4EA' }, // green
  { color: '#D96C55', bg: '#F8E7E2' }, // coral
];

function getAccent(i: number) {
  return accents[i % accents.length];
}

// ─── sub-components ────────────────────────────────────────────────────────────

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-[3px] mb-3.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 12 12" fill="#1E8A4D">
          <path d="M6 0l1.545 3.13 3.455.502-2.5 2.436.59 3.44L6 7.895 2.91 9.508l.59-3.44L1 3.632l3.455-.502z" />
        </svg>
      ))}
    </div>
  );
}

function ProofGrid({
  items,
}: {
  items: Array<{ label: string; value: string; note: string; accent: string; bg: string }>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
      {items.map((item) => (
        <div key={item.label} className="border border-[var(--border)] bg-white p-[18px_20px]">
          <span
            className="inline-flex items-center px-2.5 py-1 font-serif text-[11px] tracking-[0.08em] uppercase mb-2.5"
            style={{ color: item.accent, backgroundColor: item.bg }}
          >
            {item.label}
          </span>
          <p className="font-display text-[26px] text-[var(--espresso)] leading-[1.05] mb-[5px]">
            {item.value}
          </p>
          <p className="font-serif text-[12px] text-[var(--charcoal)] font-light leading-[1.6]">
            {item.note}
          </p>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ r, isGoogleSource, accent }: { r: Review; isGoogleSource: boolean; accent: { color: string; bg: string; } }) {
  return (
    <div className="flex flex-col p-[24px_24px_22px] border border-[var(--border)] bg-white transition-all duration-200 hover:border-[#B8AD9E] hover:shadow-[0_16px_40px_rgba(15,23,42,0.06)] cursor-default">
      <Stars count={r.rating} />
      <p
        className="font-display text-[40px] leading-[0.6] opacity-20 mb-2.5 select-none"
        style={{ color: accent.color }}
        aria-hidden="true"
      >
        &ldquo;
      </p>
      <p className="font-serif text-[14px] leading-[1.85] font-light text-[var(--charcoal)] flex-grow mb-5">
        {r.text}
      </p>
      <div className="h-[1px] bg-[var(--border)] mb-3.5" />
      <div className="flex items-center justify-between gap-2.5 flex-wrap">
        <div className="flex items-center gap-2.5">
          {r.authorPhotoUrl && (
            <img
              src={r.authorPhotoUrl}
              alt=""
              width={28}
              height={28}
              className="w-7 h-7 rounded-full object-cover bg-[var(--linen-light)]"
            />
          )}
          {r.authorUrl ? (
            <a href={r.authorUrl} target="_blank" rel="noreferrer" className="font-serif text-[13px] font-medium text-[var(--espresso)] leading-[1.4] no-underline">
              {r.name}
            </a>
          ) : (
            <p className="font-serif text-[13px] font-medium text-[var(--espresso)] leading-[1.4]">{r.name}</p>
          )}
        </div>
        <span
          className="inline-flex items-center px-2.5 py-[5px] font-serif text-[11px] tracking-[0.08em] uppercase whitespace-nowrap"
          style={{ color: accent.color, backgroundColor: accent.bg }}
        >
          {isGoogleSource ? 'Google review' : 'Verified'}
        </span>
      </div>
    </div>
  );
}

// ─── main component ────────────────────────────────────────────────────────────

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
        const response = await fetch('/api/reviews', { method: 'GET', signal: controller.signal });
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

  const proofItems = useMemo(() => [
    {
      label: isGoogleSource ? 'Google ratings' : 'Approved reviews',
      value: summary.totalCount > 0 ? String(summary.totalCount) : 'New',
      note: summary.totalCount > 0
        ? (isGoogleSource ? 'Ratings shown from your Google Business Profile' : 'Student feedback live on site')
        : 'First feedback cycle in progress',
      accent: '#2F8A7E',
      bg: '#E6F3F1',
    },
    {
      label: 'Average rating',
      value: summary.totalCount > 0 ? `${summary.averageRating.toFixed(1)}/5` : 'Student-led',
      note: summary.totalCount > 0
        ? (isGoogleSource ? 'Across Google ratings' : 'Across approved reviews')
        : "Built while studying children's nursing",
      accent: '#2E67B1',
      bg: '#E7EEF8',
    },
    {
      label: 'Free to try',
      value: 'Hub pages',
      note: 'Browse free practical pages before paying',
      accent: '#1E8A4D',
      bg: '#E6F4EA',
    },
    {
      label: 'Pricing model',
      value: 'One payment',
      note: 'No subscription or recurring charge',
      accent: '#D96C55',
      bg: '#F8E7E2',
    },
  ], [isGoogleSource, summary.averageRating, summary.totalCount]);

  const visibleReviews = compact ? reviews.slice(0, 3) : reviews;
  const heading = compact
    ? 'Students are already using it before placement and OSCEs.'
    : 'From students who used it before placement and OSCEs.';

  return (
    <section className={`bg-[var(--linen-light)] ${compact ? 'pt-14 px-6 pb-16' : 'pt-20 px-6 pb-[92px] border-t border-[var(--border)]'}`}>
      <div className="max-w-[1120px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-8">
          <div>
            <p className="font-serif text-[11px] tracking-[0.12em] uppercase text-[var(--charcoal-light)] mb-3">
              What students say
            </p>
            <h2 className={`font-display text-[clamp(2rem,4vw,2.5rem)] font-normal leading-[1.12] text-[var(--espresso)] max-w-[${compact ? '16ch' : '18ch'}]`}>
              {heading}
            </h2>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0 mt-4 md:mt-0">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 12 12" fill="#1E8A4D">
                  <path d="M6 0l1.545 3.13 3.455.502-2.5 2.436.59 3.44L6 7.895 2.91 9.508l.59-3.44L1 3.632l3.455-.502z" />
                </svg>
              ))}
            </div>
            <p className="font-serif text-[13px] text-[var(--charcoal)] font-light">
              {summary.totalCount > 0
                ? (isGoogleSource
                    ? `${summary.totalCount} Google rating${summary.totalCount === 1 ? '' : 's'} · average ${summary.averageRating.toFixed(1)} / 5`
                    : `${summary.totalCount} approved review${summary.totalCount === 1 ? '' : 's'} · average ${summary.averageRating.toFixed(1)} / 5`)
                : 'Student feedback and reviews are building'}
            </p>
            {!compact && (
              reviewUrl ? (
                <a href={reviewUrl} target="_blank" rel="noreferrer" className="font-serif text-[12px] text-[var(--espresso)] underline underline-offset-4">
                  {isGoogleSource ? 'Leave a Google review ↗' : 'Leave a review →'}
                </a>
              ) : (
                <Link href="/review" className="font-serif text-[12px] text-[var(--espresso)] underline underline-offset-4">
                  Leave a review →
                </Link>
              )
            )}
          </div>
        </div>

        {!loading && sortDescription && (
          <p className="font-serif text-[12px] text-[var(--charcoal-light)] font-light mb-[18px]">
            {sortDescription}
          </p>
        )}

        {/* Proof Grid */}
        {showProof && <ProofGrid items={proofItems} />}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: compact ? 3 : 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-[var(--linen-deep)]/20 border border-[var(--border)] h-[200px]" />
            ))}
          </div>
        )}

        {/* Reviews Grid */}
        {!loading && visibleReviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleReviews.map((r, i) => (
              <ReviewCard key={r.id} r={r} isGoogleSource={isGoogleSource} accent={getAccent(i)} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && visibleReviews.length === 0 && (
          <p className="font-serif text-[14px] text-[var(--charcoal-light)] font-light text-center py-10">
            Reviews coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
