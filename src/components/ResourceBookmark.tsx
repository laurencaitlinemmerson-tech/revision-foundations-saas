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
      className="mr-3 border-none p-2 transition-colors"
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this resource'}
      type="button"
      style={{
        flexShrink: 0,
        background: bookmarked ? 'var(--surface-sunken)' : '#FFFFFF',
        boxShadow: '0 1px 0 rgba(26,24,21,0.04)',
      }}
    >
      {bookmarked ? (
        <BookmarkCheck className="w-5 h-5" style={{ color: 'var(--blue-600)' }} />
      ) : (
        <Bookmark className="w-5 h-5" style={{ color: '#9A948C' }} />
      )}
    </button>
  );
}
