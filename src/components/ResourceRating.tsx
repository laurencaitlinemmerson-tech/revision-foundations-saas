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
  const [hover, setHover] = useState<number>(0);

  function handleRate(star: number) {
    setRating(star);
    if (typeof window !== 'undefined') {
      localStorage.setItem('resource-rating-' + resourceId, String(star));
    }
  }

  return (
    <div className="flex items-center gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          className="focus:outline-none"
        >
          <svg
            className={`w-5 h-5 ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-xs text-gray-500">{rating ? `You rated ${rating}/5` : 'Not rated'}</span>
    </div>
  );
}
