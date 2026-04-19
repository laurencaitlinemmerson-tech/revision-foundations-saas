'use client';

import { useEffect, useRef, useState } from 'react';
import {
  A11Y_CHANGE_EVENT,
  A11Y_STORAGE_KEY,
  type A11ySettings,
  applyA11ySettingsToRoot,
  DEFAULT_A11Y_SETTINGS,
  readA11ySettingsFromStorage,
} from '@/lib/accessibility';

export default function AccessibilitySettings() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_A11Y_SETTINGS);
  const panelRef = useRef<HTMLDivElement>(null);

  function syncOpenIframes(nextSettings: A11ySettings) {
    document.querySelectorAll('iframe').forEach((frame) => {
      try {
        const root = frame.contentDocument?.documentElement;
        if (root) {
          applyA11ySettingsToRoot(root, nextSettings);
        }
      } catch {
        /* ignore cross-document frames */
      }
    });
  }

  // On mount: load from storage and apply to <html>
  useEffect(() => {
    const s = readA11ySettingsFromStorage(window.localStorage);
    setSettings(s);
    applyA11ySettingsToRoot(document.documentElement, s);
    syncOpenIframes(s);
    setMounted(true);
  }, []);

  // Apply + persist whenever settings change (after initial mount)
  useEffect(() => {
    if (!mounted) return;
    applyA11ySettingsToRoot(document.documentElement, settings);
    syncOpenIframes(settings);
    try {
      window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* localStorage unavailable — silent */
    }
    window.dispatchEvent(
      new CustomEvent(A11Y_CHANGE_EVENT, { detail: settings }),
    );
  }, [settings, mounted]);

  // Close panel on Escape, or when clicking outside
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  function update<K extends keyof A11ySettings>(key: K, on: boolean, onVal: A11ySettings[K]) {
    setSettings((prev) => ({
      ...prev,
      [key]: on ? onVal : DEFAULT_A11Y_SETTINGS[key],
    }));
  }

  function reset() {
    setSettings(DEFAULT_A11Y_SETTINGS);
  }

  function togglePreset(enabled: boolean) {
    setSettings(
      enabled
        ? {
            font: 'dyslexic',
            lineHeight: 'loose',
            motion: 'reduced',
          }
        : DEFAULT_A11Y_SETTINGS,
    );
  }

  const dyslexic = settings.font === 'dyslexic';
  const loose = settings.lineHeight === 'loose';
  const reduced = settings.motion === 'reduced';
  const presetEnabled = dyslexic && loose && reduced;

  const anyOn = dyslexic || loose || reduced;

  return (
    <>
      <style>{`
        .a11y-fab {
          position: fixed;
          left: 16px;
          bottom: 16px;
          z-index: 90;
          background: #1A1815;
          color: #FAFAF8;
          border: 0.5px solid rgba(255,255,255,0.14);
          padding: 10px 14px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 12px;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
        }
        .a11y-fab:focus-visible {
          outline: 3px solid var(--peach-warm, #EFCBB6);
          outline-offset: 2px;
        }
        .a11y-fab-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${anyOn ? '#EFCBB6' : '#5A5750'};
          display: inline-block;
        }
        .a11y-panel {
          position: fixed;
          left: 16px;
          bottom: 68px;
          z-index: 91;
          background: #FAFAF8;
          color: #2C2A27;
          border: 0.5px solid rgba(0,0,0,0.12);
          padding: 18px 18px 14px;
          width: 300px;
          max-width: calc(100vw - 32px);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .a11y-panel h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 400;
          font-size: 18px;
          margin: 0 0 4px;
          color: #1A1815;
        }
        .a11y-panel p.a11y-sub {
          font-size: 11px;
          color: #8A8680;
          margin: 0 0 16px;
          line-height: 1.5;
        }
        .a11y-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0;
          border-top: 0.5px solid rgba(0,0,0,0.08);
        }
        .a11y-row:first-of-type { border-top: none; padding-top: 0; }
        .a11y-row[data-feature="preset"] {
          padding-bottom: 14px;
          margin-bottom: 4px;
          border-bottom: 0.5px solid rgba(0,0,0,0.08);
        }
        .a11y-row-label {
          font-size: 13px;
          color: #2C2A27;
          display: block;
          margin-bottom: 2px;
        }
        .a11y-row-hint {
          font-size: 11px;
          color: #8A8680;
          line-height: 1.5;
        }
        .a11y-toggle {
          appearance: none;
          -webkit-appearance: none;
          width: 36px;
          height: 20px;
          background: #D8D3CB;
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 2px;
          border: none;
          border-radius: 999px;
          transition: background 0.15s ease;
        }
        .a11y-toggle::after {
          content: '';
          position: absolute;
          top: 2px; left: 2px;
          width: 16px; height: 16px;
          background: #FAFAF8;
          border-radius: 50%;
          transition: transform 0.15s ease;
        }
        .a11y-toggle:checked {
          background: #1A1815;
        }
        .a11y-toggle:checked::after {
          transform: translateX(16px);
        }
        .a11y-toggle:focus-visible {
          outline: 3px solid var(--peach-warm, #EFCBB6);
          outline-offset: 2px;
        }
        .a11y-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 0.5px solid rgba(0,0,0,0.08);
        }
        .a11y-reset {
          font-size: 11px;
          background: none;
          border: none;
          color: #5A5750;
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: pointer;
          padding: 0;
        }
        .a11y-close {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: none;
          border: 0.5px solid rgba(0,0,0,0.15);
          padding: 6px 10px;
          cursor: pointer;
          color: #2C2A27;
        }
      `}</style>

      <button
        type="button"
        className="a11y-fab"
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="Accessibility settings"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="a11y-fab-dot" aria-hidden="true" />
        Accessibility
      </button>

      {open && (
        <div
          id="a11y-panel"
          role="dialog"
          aria-label="Accessibility settings"
          ref={panelRef}
          className="a11y-panel"
        >
          <h2>Reading &amp; motion</h2>
          <p className="a11y-sub">
            Changes save to this device. No account needed.
          </p>

          <div className="a11y-row" data-feature="preset">
            <label htmlFor="a11y-preset">
              <span className="a11y-row-label">Easier reading mode</span>
              <span className="a11y-row-hint">Turn on the dyslexia-friendly font, relaxed spacing, and reduced motion together.</span>
            </label>
            <input
              id="a11y-preset"
              type="checkbox"
              className="a11y-toggle"
              checked={presetEnabled}
              onChange={(e) => togglePreset(e.target.checked)}
            />
          </div>

          <div className="a11y-row">
            <label htmlFor="a11y-font">
              <span className="a11y-row-label">Dyslexia-friendly font</span>
              <span className="a11y-row-hint">Atkinson Hyperlegible across the site.</span>
            </label>
            <input
              id="a11y-font"
              type="checkbox"
              className="a11y-toggle"
              checked={dyslexic}
              onChange={(e) => update('font', e.target.checked, 'dyslexic')}
            />
          </div>

          <div className="a11y-row">
            <label htmlFor="a11y-lh">
              <span className="a11y-row-label">Relaxed line spacing</span>
              <span className="a11y-row-hint">More space between lines and paragraphs.</span>
            </label>
            <input
              id="a11y-lh"
              type="checkbox"
              className="a11y-toggle"
              checked={loose}
              onChange={(e) => update('lineHeight', e.target.checked, 'loose')}
            />
          </div>

          <div className="a11y-row">
            <label htmlFor="a11y-motion">
              <span className="a11y-row-label">Reduce motion</span>
              <span className="a11y-row-hint">Turn off scroll animations and transitions.</span>
            </label>
            <input
              id="a11y-motion"
              type="checkbox"
              className="a11y-toggle"
              checked={reduced}
              onChange={(e) => update('motion', e.target.checked, 'reduced')}
            />
          </div>

          <div className="a11y-foot">
            <button type="button" className="a11y-reset" onClick={reset}>
              Reset to defaults
            </button>
            <button type="button" className="a11y-close" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
