'use client';

import { useEffect, useState } from 'react';
import { Star, MessageCircle, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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

  const hasMultipleReviews = reviews.length > 1;

  return (
    <section className="gradient-hero py-16 md:py-20 relative overflow-hidden">
      <div className="blob blob-2" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="badge mb-4">Reviews</span>
          <h2>What Students Say</h2>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Reviews Grid */}
          <div className={`grid gap-6 w-full ${hasMultipleReviews ? 'md:grid-cols-2 lg:grid-cols-3' : 'max-w-lg mx-auto'}`}>
            {reviews.map((review, idx) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="testimonial-card dark:!bg-[var(--bg-card)]"
              >
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
                <p className="text-gray-700 dark:!text-white text-sm mb-4 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    {review.name[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-[var(--purple)] dark:!text-white">{review.name}</span>
                    {review.course && (
                      <span className="text-xs text-gray-500 dark:!text-gray-300">{review.course}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to action for more reviews */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-4"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[var(--lavender)]/30">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[var(--pink)]" />
                <p className="text-sm text-[var(--plum-dark)]/70">
                  {hasMultipleReviews 
                    ? 'Loving the tools? Share your experience!' 
                    : 'Be one of the first to share your experience!'}
                </p>
              </div>
              <Link
                href="/review"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--lavender)] to-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Leave a Review
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
