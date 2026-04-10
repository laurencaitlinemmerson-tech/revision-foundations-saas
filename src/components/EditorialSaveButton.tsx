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
    <div className="mt-1 flex flex-wrap items-center gap-3">
      <p
        className="text-[10px] uppercase tracking-[0.18em] text-black/50"
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
      >
        Save for later
      </p>
      <BookmarkButton hubItemId={hubItemId} hubItemTitle={hubItemTitle} />
    </div>
  );
}
