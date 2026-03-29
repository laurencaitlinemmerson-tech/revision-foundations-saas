'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';

const serif = "'Source Serif 4', Georgia, serif";
const display = "'Playfair Display', Georgia, serif";

const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';
const cream = '#F9F6F0';
const parchment = '#F3EEE4';
const border = '#D9D0C1';
const softLine = 'rgba(217, 208, 193, 0.7)';

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  course?: string;
}

const defaultReviews: Review[] = [
  {
    id: 'default-1',
    name: 'Javine',
    text: "It's quick and easy revision which is practically accessible on the go!",
    rating: 5,
    course: 'Adult Nursing',
  },
];

const sectionLabel: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  // All items including the CTA card
  const totalSlides = reviews.length + 1;

  const goTo = useCallback((index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 200);
  }, []);

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % totalSlides);
  }, [activeIndex, totalSlides, goTo]);

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + totalSlides) % totalSlides);
  }, [activeIndex, totalSlides, goTo]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    intervalRef.current = setInterval(goNext, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext]);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goNext, 6000);
  };

  // For desktop: show grid. For fewer reviews, show them all.
  const showCarousel = totalSlides > 3;

  return (
    <section
      style={{
        background: parchment,
        borderTop: `1px solid ${border}`,
        borderBottom: `1px solid ${border}`,
        padding: '72px 24px 80px',
      }}
    >
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        {/* Header row */}
        <div
          className="testimonials-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
          }}
        >
          <div>
            <p style={sectionLabel}>Reviews</p>
            <h2
              style={{
                fontFamily: display,
                fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                color: ink,
                marginBottom: '6px',
              }}
            >
              What students say
            </h2>
            <p
              style={{
                fontFamily: serif,
                fontSize: '15px',
                fontWeight: 300,
                color: inkMid,
              }}
            >
              Real feedback from people who actually use this.
            </p>
          </div>

          {/* Navigation arrows — shown when carousel mode */}
          {showCarousel && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { goPrev(); resetInterval(); }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: `1px solid ${border}`,
                  background: cream,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.15s',
                }}
                aria-label="Previous review"
              >
                <ChevronLeft style={{ width: '16px', height: '16px', color: inkMid }} />
              </button>
              <button
                onClick={() => { goNext(); resetInterval(); }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: `1px solid ${border}`,
                  background: cream,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.15s',
                }}
                aria-label="Next review"
              >
                <ChevronRight style={{ width: '16px', height: '16px', color: inkMid }} />
              </button>
            </div>
          )}
        </div>

        {/* Reviews grid — show all when few, carousel when many */}
        {!showCarousel ? (
          <div className="testimonials-grid">
            {reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
            <CTACard />
          </div>
        ) : (
          <>
            {/* Carousel mode for many reviews */}
            <div
              style={{
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'translateY(6px)' : 'translateY(0)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
            >
              {activeIndex < reviews.length ? (
                <ReviewCard review={reviews[activeIndex]} index={activeIndex} featured />
              ) : (
                <CTACard featured />
              )}
            </div>

            {/* Dot indicators */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '32px',
              }}
            >
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { goTo(i); resetInterval(); }}
                  style={{
                    width: activeIndex === i ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    background: activeIndex === i ? ink : border,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    padding: 0,
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        @media (max-width: 640px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
          .testimonials-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 20px;
          }
        }
      `}</style>
    </section>
  );
}

function ReviewCard({
  review,
  index,
  featured = false,
}: {
  review: Review;
  index: number;
  featured?: boolean;
}) {
  return (
    <div
      style={{
        border: `1px solid ${border}`,
        borderRadius: '24px',
        background: '#FFFFFF',
        padding: featured ? '40px 36px' : '30px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: featured ? '200px' : undefined,
      }}
    >
      {/* Stars */}
      <div>
        <div style={{ display: 'flex', gap: '3px', marginBottom: '18px' }}>
          {[...Array(5)].map((_, j) => (
            <Star
              key={j}
              style={{
                width: '15px',
                height: '15px',
                fill: j < review.rating ? '#D4A055' : 'transparent',
                color: j < review.rating ? '#D4A055' : border,
              }}
            />
          ))}
        </div>

        <p
          style={{
            fontFamily: serif,
            fontSize: featured ? '18px' : '15px',
            lineHeight: 1.8,
            fontWeight: 300,
            color: inkMid,
            fontStyle: 'italic',
            marginBottom: '24px',
          }}
        >
          &ldquo;{review.text}&rdquo;
        </p>
      </div>

      {/* Attribution */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: parchment,
            border: `1px solid ${softLine}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: serif,
            fontSize: '13px',
            fontWeight: 400,
            color: inkMid,
          }}
        >
          {review.name[0]}
        </div>
        <div>
          <p
            style={{
              fontFamily: serif,
              fontSize: '14px',
              fontWeight: 400,
              color: ink,
              lineHeight: 1.3,
            }}
          >
            {review.name}
          </p>
          {review.course && (
            <p
              style={{
                fontFamily: serif,
                fontSize: '12px',
                fontWeight: 300,
                color: inkLight,
                lineHeight: 1.3,
              }}
            >
              {review.course}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CTACard({ featured = false }: { featured?: boolean }) {
  return (
    <div
      style={{
        border: `1px dashed ${border}`,
        borderRadius: '24px',
        background: cream,
        padding: featured ? '40px 36px' : '30px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '12px',
        minHeight: featured ? '200px' : undefined,
      }}
    >
      <p
        style={{
          fontFamily: serif,
          fontSize: '15px',
          fontWeight: 300,
          color: inkMid,
          maxWidth: '320px',
          lineHeight: 1.7,
        }}
      >
        Used the tools? I'd love to hear what you think — good or bad.
      </p>
      <Link
        href="/review"
        style={{
          fontFamily: serif,
          fontSize: '14px',
          color: ink,
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          transition: 'opacity 0.15s',
        }}
      >
        Leave a review →
      </Link>
    </div>
  );
}
