'use client';

import BookmarkButton from '@/components/BookmarkButton';

interface EditorialSaveButtonProps {
  hubItemId: string;
  hubItemTitle: string;
}

export default function EditorialSaveButton({
  hubItemId,
  hubItemTitle,
}: EditorialSaveButtonProps) {
  return (
    <div className="mt-6" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
      <p
        className="text-[10px] uppercase tracking-[0.18em] text-black/40"
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
      >
        Save for later
      </p>
      <div>
        <BookmarkButton hubItemId={hubItemId} hubItemTitle={hubItemTitle} />
      </div>
    </div>
  );
}
