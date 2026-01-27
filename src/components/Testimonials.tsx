'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
}

// Default reviews to show if none from database
const defaultReviews: Review[] = [
  {
    id: 'default-1',
    name: 'Javine',
    text: "It's quick and easy revision which is practically accessible on the go!",
    rating: 5,
  },
  {
    id: 'default-2',
    name: 'Sarah',
    text: 'The OSCE tool helped me feel so much more confident before my exam.',
    rating: 5,
  },
  {
    id: 'default-3',
    name: 'Emily',
    text: 'These tools break everything down into manageable chunks. Perfect!',
    rating: 5,
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();

        if (data.reviews && data.reviews.length > 0) {
          // Use database reviews, fill with defaults if less than 3
          const dbReviews = data.reviews.slice(0, 6);
          if (dbReviews.length >= 3) {
            setReviews(dbReviews);
          } else {
            // Mix database reviews with defaults
            const needed = 3 - dbReviews.length;
            setReviews([...dbReviews, ...defaultReviews.slice(0, needed)]);
          }
        }
      } catch (error) {
        // Keep default reviews on error
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="gradient-hero section relative overflow-hidden">
      <div className="blob blob-2" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="badge mb-4">Reviews</span>
          <h2 className="mb-4">Students Love It</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="testimonial-card">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${
                      j < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[var(--plum-dark)]/80 text-sm mb-4">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center text-white text-sm font-semibold">
                  {review.name[0]}
                </div>
                <span className="font-medium text-sm text-[var(--plum)]">{review.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Leave a review CTA */}
        <div className="text-center mt-10">
          <Link
            href="/review"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition text-sm"
          >
          
  );
}
