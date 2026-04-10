'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const TOOLBAR_CSS = `
/* ── Reading progress bar ── */
.study-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #185FA5 0%, #0F6E56 50%, #534AB7 100%);
  z-index: 9999;
  transition: width 80ms linear;
  pointer-events: none;
}

/* ── Toolbar ── */
.study-toolbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  background: rgba(250, 250, 248, 0.82);
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
  z-index: 9998;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  transition: opacity 0.25s, transform 0.25s;
}

.study-toolbar-hidden {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
  pointer-events: none;
}

.study-toolbar-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ── Toolbar buttons ── */
.study-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #706A63;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
  user-select: none;
}

.study-btn:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #2C2A27;
}

.study-btn-active {
  background: #1A1815 !important;
  color: #FAFAF8 !important;
}

.study-btn svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.study-btn-divider {
  width: 0.5px;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 4px;
  flex-shrink: 0;
}

/* ── Flashcard mode ── */
.study-flashcard-mode [class*="-pearl"] > p:not([class*="-pearl-label"]):not([class*="-label"]),
.study-flashcard-mode [class*="-pearl"] > p:not([class*="label"]) {
  /* We target paragraph children of pearl boxes */
}

.study-flashcard-mode .study-flash-hide {
  position: relative;
  cursor: pointer;
}

.study-flashcard-mode .study-flash-hide > *:not([class*="label"]):not(.study-flash-label) {
  filter: blur(6px);
  user-select: none;
  transition: filter 0.3s;
}

.study-flashcard-mode .study-flash-hide.study-flash-revealed > *:not([class*="label"]):not(.study-flash-label) {
  filter: blur(0);
}

.study-flash-overlay {
  display: none;
}

.study-flashcard-mode .study-flash-hide:not(.study-flash-revealed) .study-flash-overlay {
  display: flex;
  position: absolute;
  inset: 0;
  align-items: center;
  justify-content: center;
  z-index: 2;
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #706A63;
  cursor: pointer;
}

/* ── Key terms mode ── */
.study-key-terms-mode strong,
.study-key-terms-mode b,
.study-key-terms-mode td:first-child {
  background: linear-gradient(to bottom, transparent 60%, rgba(24, 95, 165, 0.12) 60%);
  padding: 0 2px;
  border-radius: 2px;
  transition: background 0.2s;
}

/* ── Print: hide toolbar ── */
@media print {
  .study-toolbar,
  .study-progress-bar,
  .study-flash-overlay { display: none !important; }
}

/* ── Mobile adjustments ── */
@media (max-width: 640px) {
  .study-toolbar {
    bottom: 12px;
    padding: 5px 6px;
    gap: 1px;
  }
  .study-btn {
    padding: 7px 10px;
    font-size: 10px;
    gap: 5px;
  }
  .study-btn span.study-btn-label {
    display: none;
  }
}
`;

// ─── Icons ────────────────────────────────────────────────────────────────────

function FlashcardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function HighlightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudyToolbar() {
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [keyTermsMode, setKeyTermsMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // ── Scroll progress ──
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    setScrollProgress(progress);

    // Show toolbar once user scrolls 100px
    setIsVisible(scrollTop > 100);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ── Persist toggles in localStorage ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem('study-toolbar-state');
      if (saved) {
        const state = JSON.parse(saved);
        if (state.flashcardMode) setFlashcardMode(true);
        if (state.keyTermsMode) setKeyTermsMode(true);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('study-toolbar-state', JSON.stringify({ flashcardMode, keyTermsMode }));
    } catch { /* ignore */ }
  }, [flashcardMode, keyTermsMode]);

  // ── Apply body classes for CSS-driven modes ──
  useEffect(() => {
    const body = document.body;
    if (flashcardMode) {
      body.classList.add('study-flashcard-mode');
      // Find all pearl-like elements and add flashcard wrappers
      const pearls = document.querySelectorAll('[class*="-pearl"]:not([class*="-pearl-label"]):not([class*="label"])');
      pearls.forEach((pearl) => {
        if (!pearl.classList.contains('study-flash-hide')) {
          pearl.classList.add('study-flash-hide');
          // Add tap-to-reveal overlay if not present
          if (!pearl.querySelector('.study-flash-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'study-flash-overlay';
            overlay.textContent = 'Tap to reveal';
            overlay.addEventListener('click', (e) => {
              e.stopPropagation();
              pearl.classList.toggle('study-flash-revealed');
            });
            pearl.appendChild(overlay);
          }
          // Also allow clicking the pearl itself
          pearl.addEventListener('click', () => {
            pearl.classList.toggle('study-flash-revealed');
          });
        }
      });
    } else {
      body.classList.remove('study-flashcard-mode');
      // Clean up
      document.querySelectorAll('.study-flash-hide').forEach(el => {
        el.classList.remove('study-flash-hide', 'study-flash-revealed');
        el.querySelector('.study-flash-overlay')?.remove();
      });
    }
  }, [flashcardMode]);

  useEffect(() => {
    if (keyTermsMode) {
      document.body.classList.add('study-key-terms-mode');
    } else {
      document.body.classList.remove('study-key-terms-mode');
    }
  }, [keyTermsMode]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('study-flashcard-mode', 'study-key-terms-mode');
      document.querySelectorAll('.study-flash-hide').forEach(el => {
        el.classList.remove('study-flash-hide', 'study-flash-revealed');
        el.querySelector('.study-flash-overlay')?.remove();
      });
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TOOLBAR_CSS }} />

      {/* Reading progress bar */}
      <div
        className="study-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Toolbar */}
      <div
        className={`study-toolbar ${isVisible ? 'study-toolbar-visible' : 'study-toolbar-hidden'}`}
        id="study-toolbar"
      >
        <button
          className={`study-btn ${flashcardMode ? 'study-btn-active' : ''}`}
          onClick={() => setFlashcardMode(!flashcardMode)}
          title="Flashcard mode — hides pearl content behind a blur until you tap"
          id="study-flashcard-toggle"
        >
          <FlashcardIcon />
          <span className="study-btn-label">Flashcards</span>
        </button>

        <div className="study-btn-divider" />

        <button
          className={`study-btn ${keyTermsMode ? 'study-btn-active' : ''}`}
          onClick={() => setKeyTermsMode(!keyTermsMode)}
          title="Key terms — highlights important terms and definitions"
          id="study-keyterms-toggle"
        >
          <HighlightIcon />
          <span className="study-btn-label">Key Terms</span>
        </button>

        <div className="study-btn-divider" />

        <div className="study-btn" style={{ cursor: 'default', color: '#aaa', fontSize: '10px' }}>
          {Math.round(scrollProgress)}%
        </div>
      </div>
    </>
  );
}
