import React, { useState } from 'react';

interface ResourceRatingProps {
  resourceId: string;
}

export default function ResourceRating({ resourceId }: ResourceRatingProps) {
  const [rating, setRating] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('resource-rating-' + resourceId);
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });
  const [hover, setHover] = useState<number | null>(null);

  function handleRate(heart: number) {
    setRating(heart);
    if (typeof window !== 'undefined') {
      localStorage.setItem('resource-rating-' + resourceId, String(heart));
    }
  }

  return (
    <div className="flex items-center gap-1 mb-3 mt-2">
      {/* Allow 0 hearts (clear rating) */}
      <button
        type="button"
        onClick={() => handleRate(0)}
        onMouseEnter={() => setHover(0)}
        onMouseLeave={() => setHover(null)}
        aria-label="Clear rating"
        className="focus:outline-none"
      >
        <svg
          className={`w-6 h-6 ${hover === 0 ? 'text-pink-300' : rating === 0 ? 'text-gray-300' : 'text-pink-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </button>
      {[1, 2, 3, 4, 5].map((heart) => (
        <button
          key={heart}
          type="button"
          onClick={() => handleRate(heart)}
          onMouseEnter={() => setHover(heart)}
          onMouseLeave={() => setHover(null)}
          aria-label={`Rate ${heart} heart${heart > 1 ? 's' : ''}`}
          className="focus:outline-none"
        >
          <svg
            className={`w-6 h-6 ${heart <= (hover !== null ? hover : rating) ? 'text-pink-500' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        </button>
      ))}
      <span className="ml-3 text-xs text-gray-500 min-w-[70px] text-left">
        {rating ? `You rated ${rating}/5` : 'Not rated'}
      </span>
    </div>
  );
}
