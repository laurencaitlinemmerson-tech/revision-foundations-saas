'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink, Loader2, X } from 'lucide-react';
import type { BookmarkItem, Folder } from '@/lib/bookmarks/types';
import { folderColour } from '@/lib/bookmarks/folderColours';
import './folders.css';

interface FolderViewProps {
  folder: Folder;
  items: BookmarkItem[];
  loading?: boolean;
  error?: string | null;
  isRemoving?: boolean;
  onRetry?: () => void;
  onBack: () => void;
  onRemove: (bookmarkId: number, folderName: string) => Promise<void>;
}

const formatDate = (iso: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));

export default function FolderView({
  folder,
  items,
  loading = false,
  error = null,
  isRemoving = false,
  onRetry,
  onBack,
  onRemove,
}: FolderViewProps) {
  const colour = { ['--fld-c' as string]: folderColour(folder.emoji) };

  const back = (
    <button type="button" className="fld-back" onClick={onBack}>
      <ArrowLeft aria-hidden="true" /> All folders
    </button>
  );

  if (error) {
    return (
      <div>
        {back}
        <div className="fld-error" role="alert">
          <p>{error}</p>
          {onRetry ? <button type="button" className="fld-btn" onClick={onRetry}>Try again</button> : null}
        </div>
      </div>
    );
  }

  return (
    <div>
      {back}

      <div className="fld-title" style={colour}>
        <h2>{folder.name}</h2>
        <p>
          {loading ? 'Loading…' : `${items.length} saved ${items.length === 1 ? 'page' : 'pages'}`} &middot; updated {formatDate(folder.updatedAt)}
        </p>
      </div>

      {loading ? (
        <div className="fld-list" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="fld-skel" style={{ height: 72, marginTop: 12 }} />)}
        </div>
      ) : !items.length ? (
        <div className="fld-empty">
          <h3>Nothing in this folder yet</h3>
          <p>Save a guide or cheat sheet and it will appear here.</p>
        </div>
      ) : (
        <div className="fld-list">
          {items.map((bookmark) => (
            <div key={bookmark.id} className="fld-item">
              <div className="fld-item-main">
                <div className="fld-item-top">
                  <span className="fld-type">{bookmark.item.type}</span>
                  <span className="fld-saved">Saved {formatDate(bookmark.savedAt)}</span>
                </div>
                <Link href={bookmark.item.href} className="fld-link">
                  {bookmark.item.title}
                  <ExternalLink aria-hidden="true" />
                </Link>
                {bookmark.item.description ? <p className="fld-desc">{bookmark.item.description}</p> : null}
              </div>

              <button
                type="button"
                className="fld-remove"
                onClick={() => onRemove(bookmark.id, folder.name)}
                disabled={isRemoving}
                aria-label={`Remove ${bookmark.item.title}`}
              >
                {isRemoving ? <Loader2 className="animate-spin" aria-hidden="true" /> : <X aria-hidden="true" />}
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
