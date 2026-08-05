'use client';

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react';

const STORAGE_PREFIX = 'daily-log-photo:';

/**
 * A user-fillable photo frame — the progress-picture slots on the Progress tab.
 *
 * The redesign prototype used the authoring runtime's `<image-slot>` element,
 * which persists dropped images to a sidecar file. That runtime does not exist
 * in the app, so the image is read as a data URL and kept in localStorage:
 * progress photos stay on the operator's own device and never reach the server.
 */
export default function ImageSlot({
  id,
  placeholder = 'Drop an image',
  style,
}: {
  id: string;
  shape?: string;
  placeholder?: string;
  style?: CSSProperties;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    try {
      setSrc(window.localStorage.getItem(STORAGE_PREFIX + id));
    } catch {
      /* storage unavailable — the slot simply stays empty */
    }
  }, [id]);

  const accept = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        setSrc(url);
        try {
          window.localStorage.setItem(STORAGE_PREFIX + id, url);
        } catch {
          /* over quota — the image still shows for this session */
        }
      };
      reader.readAsDataURL(file);
    },
    [id],
  );

  const clear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSrc(null);
      try {
        window.localStorage.removeItem(STORAGE_PREFIX + id);
      } catch {
        /* nothing to clean up */
      }
    },
    [id],
  );

  return (
    <div
      style={{
        ...style,
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        background: over ? 'rgba(194,168,124,0.10)' : undefined,
        outline: over ? '1.5px dashed rgba(194,168,124,0.55)' : undefined,
        outlineOffset: '-4px',
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        accept(e.dataTransfer.files?.[0]);
      }}
    >
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={placeholder}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <button
            type="button"
            onClick={clear}
            aria-label={`Remove ${placeholder} photo`}
            style={{
              position: 'absolute', top: 8, right: 8, width: 24, height: 24,
              borderRadius: '50%', border: '0.5px solid rgba(27,39,51,0.12)',
              background: 'rgba(255,255,255,0.92)', color: '#6E7A88',
              fontSize: 13, lineHeight: 1, cursor: 'pointer',
            }}
          >
            ×
          </button>
        </>
      ) : (
        <span style={{ fontSize: 12, color: '#9AA6B4', textAlign: 'center', padding: '0 12px' }}>
          {placeholder}
        </span>
      )}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => accept(e.target.files?.[0])}
      />
    </div>
  );
}
