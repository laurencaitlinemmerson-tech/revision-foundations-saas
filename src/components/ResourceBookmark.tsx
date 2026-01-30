import React, { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface ResourceBookmarkProps {
  resourceId: string;
}

export default function ResourceBookmark({ resourceId }: ResourceBookmarkProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBookmarked(localStorage.getItem('resource-bookmark-' + resourceId) === 'true');
    }
  }, [resourceId]);

  function toggleBookmark(e: React.MouseEvent) {
    e.stopPropagation();
    const newVal = !bookmarked;
    setBookmarked(newVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('resource-bookmark-' + resourceId, newVal ? 'true' : 'false');
    }
  }

  return (
    <button
      onClick={toggleBookmark}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this resource'}
      className={`absolute top-16 left-8 z-20 p-2 rounded-full border-none bg-white shadow hover:bg-[var(--lilac-soft)] transition-colors`}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this resource'}
      type="button"
    >
      {bookmarked ? (
        <BookmarkCheck className="w-5 h-5 text-[var(--purple)]" />
      ) : (
        <Bookmark className="w-5 h-5 text-[var(--lilac-medium)]" />
      )}
    </button>
  );
}
