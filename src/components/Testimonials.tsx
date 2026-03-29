'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  course?: string;
}

// Only real reviews - Javine is our first!
const defaultReviews: Review[] = [
  {
    id: 'default-1',
    name: 'Javine',
    text: "It's quick and easy revision which is practically accessible on the go!",
    rating: 5,
    course: 'Adult Nursing',
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);

  // Fetch real reviews from API
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

  return (
    <section className="bg-[var(--linen-light)] border-y border-[var(--linen-deep)] py-16">
      <div className="max-w-4xl mx-auto px-6">
        <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#aaa', fontWeight: 400, marginBottom: '12px' }}>Reviews</p>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 400, color: 'var(--espresso)', marginBottom: '8px' }}>What students say</h2>
        <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '14px', color: 'var(--charcoal)', fontWeight: 300, marginBottom: '32px' }}>Real feedback from nursing students.</p>

        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-5 border border-[var(--linen-deep)]" style={{ borderRadius: '8px' }}>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${
                      j < review.rating
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-[var(--linen-deep)]'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-[var(--charcoal)] mb-4 leading-relaxed">&quot;{review.text}&quot;</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[var(--linen-deep)] flex items-center justify-center text-[var(--espresso)] text-xs font-semibold">
                  {review.name[0]}
                </div>
                <div>
                  <span className="text-sm font-medium text-[var(--espresso)]">{review.name}</span>
                  {review.course && (
                    <span className="text-xs text-[var(--charcoal-light)] ml-2">{review.course}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Honest invite — dashed border */}
          <div className="bg-white p-5 border border-dashed border-[var(--linen-deep)] flex flex-col justify-center items-center text-center gap-2" style={{ borderRadius: '8px' }}>
            <p className="text-sm text-[var(--charcoal-light)]">
              Used the tools? I&apos;d love to hear what you think — good or bad.
            </p>
            <Link
              href="/review"
              className="text-sm text-[var(--espresso)] underline underline-offset-2 hover:opacity-75 transition-opacity"
            >
              Leave a review →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
