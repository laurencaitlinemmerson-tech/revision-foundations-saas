'use client';

import { useEffect, useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  course?: string;
}

// Default reviews to show if none from database
const defaultReviews: Review[] = [
  {
    id: 'default-1',
    name: 'Javine',
    text: "It's quick and easy revision which is practically accessible on the go!",
    rating: 5,
    course: 'Adult Nursing',
  },
  {
    id: 'default-2',
    name: 'Sarah',
    text: 'The OSCE tool helped me feel so much more confident before my exam.',
    rating: 5,
    course: 'Mental Health Nursing',
  },
  {
    id: 'default-3',
    name: 'Emily',
    text: 'These tools break everything down into manageable chunks. Perfect!',
    rating: 5,
    course: 'Child Nursing',
  },
  {
    id: 'default-4',
    name: 'Priya',
    text: 'Finally found something that actually helps with OSCEs. The structured approach is brilliant.',
    rating: 5,
    course: 'Adult Nursing',
  },
  {
    id: 'default-5',
    name: 'James',
    text: 'Used this throughout second year. The quizzes really helped cement my knowledge.',
    rating: 5,
    course: 'Mental Health Nursing',
  },
  {
    id: 'default-6',
    name: 'Amara',
    text: 'Love how accessible it is on my phone. Perfect for commute revision sessions!',
    rating: 5,
    course: 'Learning Disabilities',
  },
  {
    id: 'default-7',
    name: 'Lucy',
    text: 'The Hub resources are gold. Everything I need in one place.',
    rating: 5,
    course: 'Adult Nursing',
  },
  {
    id: 'default-8',
    name: 'Mohammed',
    text: 'Wish I had this in first year! Makes complex topics so much clearer.',
    rating: 5,
    course: 'Child Nursing',
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check viewport size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();

        if (data.reviews && data.reviews.length > 0) {
          // Use database reviews, fill with defaults if less than 6
          const dbReviews = data.reviews.slice(0, 8);
          if (dbReviews.length >= 6) {
            setReviews(dbReviews);
          } else {
            // Mix database reviews with defaults
            const needed = 8 - dbReviews.length;
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

  // Calculate visible count based on viewport
  const visibleCount = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(reviews.length / visibleCount);

  // Auto-play carousel
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Get current visible reviews
  const getVisibleReviews = () => {
    const startIndex = currentIndex * visibleCount;
    const endIndex = startIndex + visibleCount;
    
    // Handle wrap-around for infinite loop effect
    const visible: Review[] = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (startIndex + i) % reviews.length;
      visible.push(reviews[index]);
    }
    return visible;
  };

  const slideVariants = {
    enter: {
      x: 100,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -100,
      opacity: 0,
    },
  };

  return (
    <section className="gradient-hero py-16 md:py-20 relative overflow-hidden">
      <div className="blob blob-2" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="badge mb-4">Reviews</span>
          <h2>Students Love It</h2>
        </div>

        <div 
          className="flex flex-col items-center gap-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel Container */}
          <div className="w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                className={`grid gap-6 w-full ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ 
                  duration: 0.8, 
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
              >
                {getVisibleReviews().map((review, idx) => (
                  <motion.div 
                    key={`${review.id}-${currentIndex}-${idx}`} 
                    className="testimonial-card group cursor-pointer"
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                            j < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          style={{ transitionDelay: `${j * 50}ms` }}
                        />
                      ))}
                    </div>
                    <p className="text-[var(--plum-dark)]/80 text-sm mb-4 leading-relaxed">"{review.text}"</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center text-white text-sm font-semibold shadow-md">
                          {review.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-[var(--plum)]">{review.name}</span>
                          {review.course && (
                            <span className="text-xs text-[var(--plum-dark)]/50">{review.course}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex gap-2 mt-4">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-gradient-to-r from-[var(--lavender)] to-[var(--pink)]'
                    : 'w-2 h-2 bg-[var(--lavender)]/30 hover:bg-[var(--lavender)]/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Pause indicator */}
          <AnimatePresence>
            {isPaused && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-xs text-[var(--plum-dark)]/40"
              >
                Paused
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
