'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Folder } from '@/lib/bookmarks/types';
import { folderColour } from '@/lib/bookmarks/folderColours';
import './folders.css';

interface FolderGridProps {
  folders: Folder[];
  folderPreviews?: Map<number, { latestSavedAt: string; latestTitle: string; previewItems: Array<{ title: string; type: string }> }>;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onOpenFolder: (folderId: number) => void;
  onCreateFolder: () => void;
  onEditFolder: (folderId: number) => void;
  onDeleteFolder: (folderId: number) => void;
}

const formatDay = (iso: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(iso));

export default function FolderGrid({
  folders,
  folderPreviews,
  loading = false,
  error = null,
  onRetry,
  onOpenFolder,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
}: FolderGridProps) {
  const [menuFolderId, setMenuFolderId] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="fld-grid" aria-busy="true">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="fld-skel" />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="fld-error" role="alert">
        <p>{error}</p>
        {onRetry ? <button type="button" className="fld-btn" onClick={onRetry}>Try again</button> : null}
      </div>
    );
  }

  if (!folders.length) {
    return (
      <div className="fld-empty">
        <p className="fld-eyebrow">Saved library</p>
        <h3>No folders yet.</h3>
        <p>Save pages as you go. Folders are the quickest way back to the guides you keep reusing.</p>
        <button type="button" className="fld-btn fld-btn-dark" onClick={onCreateFolder}>
          <Plus aria-hidden="true" /> Create your first folder
        </button>
      </div>
    );
  }

  const totalItems = folders.reduce((n, f) => n + f.itemCount, 0);

  return (
    <div>
      <div className="fld-bar">
        <p className="fld-count">
          <strong>{folders.length}</strong> {folders.length === 1 ? 'folder' : 'folders'} &middot; <strong>{totalItems}</strong> saved {totalItems === 1 ? 'page' : 'pages'}
        </p>
        <button type="button" className="fld-btn" onClick={onCreateFolder}>
          <Plus aria-hidden="true" /> New folder
        </button>
      </div>

      <div className="fld-grid">
        {folders.map((folder) => {
          const preview = folderPreviews?.get(folder.id);
          return (
            <div key={folder.id} className="fld-card" style={{ ['--fld-c' as string]: folderColour(folder.emoji) }}>
              <div className="fld-head">
                <button type="button" className="fld-open" onClick={() => onOpenFolder(folder.id)} aria-label={`Open ${folder.name}`}>
                  <h3 className="fld-name">{folder.name}</h3>
                  <p className="fld-meta">{folder.itemCount} {folder.itemCount === 1 ? 'saved page' : 'saved pages'}</p>
                </button>

                <div className="fld-menu-wrap">
                  <button
                    type="button"
                    className="fld-menu-btn"
                    onClick={() => setMenuFolderId(menuFolderId === folder.id ? null : folder.id)}
                    aria-label={`Manage ${folder.name}`}
                    aria-expanded={menuFolderId === folder.id}
                  >
                    <MoreHorizontal aria-hidden="true" />
                  </button>
                  {menuFolderId === folder.id ? (
                    <div className="fld-menu" role="menu">
                      <button type="button" role="menuitem" onClick={() => { setMenuFolderId(null); onEditFolder(folder.id); }}>
                        <Pencil aria-hidden="true" /> Edit folder
                      </button>
                      <button type="button" role="menuitem" className="is-danger" onClick={() => { setMenuFolderId(null); onDeleteFolder(folder.id); }}>
                        <Trash2 aria-hidden="true" /> Delete folder
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {preview ? (
                <div className="fld-latest">
                  <p className="fld-eyebrow">Latest saved</p>
                  <p>{preview.latestTitle}</p>
                </div>
              ) : null}

              <div className="fld-foot">
                <span>Updated {formatDay(preview?.latestSavedAt ?? folder.updatedAt)}</span>
                <button type="button" onClick={() => onOpenFolder(folder.id)}>Open folder &rarr;</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
