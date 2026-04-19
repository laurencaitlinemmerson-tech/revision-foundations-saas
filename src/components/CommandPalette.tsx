'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search, X } from 'lucide-react';
import { hubItems, adultHubItems } from '@/app/(site)/hub/hubData';

const serif = "var(--font-body)";
const display = "var(--font-display)";
const ink = "var(--espresso)";
const bodyColor = "var(--charcoal)";
const mid = "var(--charcoal-light)";
const muted = "var(--charcoal-light)";
const borderMid = "var(--border)";
const border = "var(--border)";

// Combine and deduplicate items from both branches
const allResources = [...hubItems, ...adultHubItems].reduce((acc, current) => {
  if (!acc.find((item) => item.href === current.href)) {
    acc.push(current);
  }
  return acc;
}, [] as typeof hubItems);

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const deferredQuery = useDeferredValue(query);
  const searchTerm = deferredQuery.trim().toLowerCase();

  // Listen for CMD+K, CTRL+K or custom event
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    const openPalette = () => setOpen(true);

    document.addEventListener('keydown', down);
    window.addEventListener('open-command-palette', openPalette);
    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('open-command-palette', openPalette);
    };
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      setQuery(''); // Reset query on close
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Click outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const results = useMemo(
    () =>
      searchTerm.length > 1
        ? allResources.filter(
            (resource) =>
              resource.title.toLowerCase().includes(searchTerm) ||
              resource.tags.some(t => t.toLowerCase().includes(searchTerm))
          ).slice(0, 5)
        : [],
    [searchTerm],
  );

  const featured = useMemo(() => {
    return allResources.filter(r => r.isRecommended).slice(0, 4);
  }, []);

  const showFeatured = searchTerm.length <= 1;
  const showNoResults = searchTerm.length > 1 && results.length === 0;

  function closeAndReset() {
    setOpen(false);
    setQuery('');
  }

  function goTo(href: string) {
    closeAndReset();
    router.push(href);
  }

  if (!open) return null;

  return (
    <div className="cp-backdrop">
      <div ref={ref} className="cp-shell">
        <div className="cp-input-row">
          <Search size={18} color={mid} style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search guides, skills, topics..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpen(false);
              if (event.key === 'Enter' && results.length > 0) {
                event.preventDefault();
                goTo(results[0].href);
              }
            }}
            aria-label="Command palette search"
            className="cp-input"
          />
          <button
            type="button"
            onClick={closeAndReset}
            className="cp-close-btn"
            aria-label="Close search"
          >
            <span style={{ fontSize: '10px', marginRight: '6px', opacity: 0.6 }}>ESC</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="cp-content">
          {showFeatured && (
            <div className="cp-panel">
              <p className="cp-panel-label">Suggested Guides</p>
              <div className="cp-list">
                {featured.map((resource) => (
                  <Link
                    key={resource.href}
                    href={resource.href}
                    onClick={closeAndReset}
                    className="cp-item"
                  >
                    <span>{resource.title}</span>
                    <span className="cp-tag">{resource.tags[0]}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="cp-panel">
              <p className="cp-panel-label">Top Matches</p>
              <div className="cp-list">
                {results.map((resource, i) => (
                  <Link
                    key={resource.href}
                    href={resource.href}
                    onClick={closeAndReset}
                    className="cp-item"
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="cp-item-title text-truncate">{resource.title}</p>
                      <p className="cp-item-copy">
                        {resource.tags.slice(0, 2).join(', ')}
                      </p>
                    </div>
                    {i === 0 && <span className="cp-hint cp-desktop-only">Enter ↵</span>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {showNoResults && (
            <div className="cp-empty">
              <p className="cp-empty-text">No matches found for "{query}"</p>
              <Link href="/hub" onClick={closeAndReset} className="cp-empty-link">
                Browse all hub resources <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cp-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(26,24,21,0.25);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 8vh 16px 16px;
        }

        .cp-shell {
          width: 100%;
          max-width: 580px;
          background: #FFFFFF;
          border-radius: 12px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05);
          overflow: hidden;
          animation: cp-slide 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes cp-slide {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .cp-input-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid ${border};
        }

        .cp-input {
          font-family: ${serif};
          font-size: 16px;
          color: ${ink};
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          flex: 1;
        }
        .cp-input::placeholder {
          color: ${muted};
        }

        .cp-close-btn {
          display: flex;
          align-items: center;
          color: ${mid};
          background: #F5F3F0;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s ease;
          font-family: ${serif};
        }
        .cp-close-btn:hover {
          color: ${ink};
          background: #E8E0D8;
        }

        .cp-content {
          padding: 12px 0;
          max-height: 60vh;
          overflow-y: auto;
        }

        .cp-panel {
          padding: 8px 20px 16px;
        }

        .cp-panel-label {
          font-family: ${serif};
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${muted};
          margin: 0 0 10px;
        }

        .cp-list {
          display: grid;
          gap: 4px;
        }

        .cp-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          text-decoration: none;
          color: ${bodyColor};
          border-radius: 8px;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .cp-item:hover, .cp-item:focus {
          background: #F5F3F0;
          outline: none;
        }
        .cp-item:hover .cp-item-title {
          color: ${ink};
        }

        .cp-item-title {
          font-family: ${serif};
          font-size: 14px;
          font-weight: 500;
          color: ${bodyColor};
          margin: 0 0 2px;
          transition: color 0.15s ease;
        }

        .cp-item-copy {
          font-family: ${serif};
          font-size: 11px;
          color: ${mid};
          margin: 0;
        }

        .text-truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cp-tag {
          font-family: ${serif};
          font-size: 10px;
          background: #F5F3F0;
          color: ${mid};
          padding: 2px 6px;
          border-radius: 4px;
        }

        .cp-hint {
          font-family: ${serif};
          font-size: 11px;
          color: ${muted};
        }

        .cp-empty {
          padding: 32px 20px;
          text-align: center;
        }
        
        .cp-empty-text {
          font-family: ${serif};
          font-size: 14px;
          color: ${mid};
          margin: 0 0 12px;
        }

        .cp-empty-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: ${serif};
          font-size: 13px;
          color: ${ink};
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        @media (max-width: 640px) {
          .cp-desktop-only { display: none; }
          .cp-shell {
            border-radius: 12px;
            margin-top: 0;
          }
          .cp-backdrop {
            padding: 16px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
