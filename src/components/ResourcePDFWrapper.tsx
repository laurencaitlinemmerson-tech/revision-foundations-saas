'use client';

import { useRef, useState, ReactNode, useCallback } from 'react';

interface ResourcePDFWrapperProps {
  children: ReactNode;
}

export default function ResourcePDFWrapper({ children }: ResourcePDFWrapperProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    const el = contentRef.current;
    if (!el || generating) return;

    setGenerating(true);

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      // Extract title from the h1 for filename
      const h1 = el.querySelector('h1');
      const title = h1?.textContent?.trim().replace(/[^a-zA-Z0-9\s\-–]/g, '').replace(/\s+/g, '-') || 'resource';

      // ── Hide interactive / non-print elements ──
      const hidden: HTMLElement[] = [];
      const hide = (node: HTMLElement | null) => {
        if (!node) return;
        node.style.display = 'none';
        hidden.push(node);
      };

      // Back navigation
      el.querySelectorAll<HTMLElement>('[class*="-back"]').forEach(hide);
      // Save / bookmark row
      el.querySelectorAll<HTMLElement>('.mt-1.flex').forEach(hide);
      // Download button itself
      el.querySelectorAll<HTMLElement>('.pdf-download-btn').forEach(hide);

      // Checklist grids and their headings
      el.querySelectorAll<HTMLElement>('[class*="checklist"], [class*="check-item"]').forEach(hide);

      // SelfTestQuiz components (mt-8 print:hidden wrapper)
      el.querySelectorAll<HTMLElement>('.mt-8.print\\:hidden').forEach(hide);

      // Find and hide "Quick self-test" / "Checklist" section headings
      el.querySelectorAll<HTMLElement>('h2').forEach((h2) => {
        const text = h2.textContent?.trim().toLowerCase() || '';
        if (text.includes('self-test') || text.includes('checklist')) {
          hide(h2);
        }
      });

      // ── Add page-break hints ──
      el.classList.add('pdf-generating');

      const opt = {
        margin: [12, 10, 14, 10] as [number, number, number, number],
        filename: `${title}-TheNurseLab.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          scrollY: 0,
          windowWidth: 1180,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait' as const,
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().set(opt).from(el).save();
    } finally {
      // Restore all hidden elements
      const el = contentRef.current;
      if (el) {
        el.classList.remove('pdf-generating');
        el.querySelectorAll<HTMLElement>('[style*="display: none"]').forEach((node) => {
          node.style.display = '';
        });
      }
      setGenerating(false);
    }
  }, [generating]);

  return (
    <div ref={contentRef} className="resource-pdf-root">
      <style dangerouslySetInnerHTML={{ __html: PDF_CSS }} />
      {children}

      <button
        className="pdf-download-btn"
        onClick={handleDownload}
        disabled={generating}
        aria-label="Download as PDF"
      >
        {generating ? (
          <span className="pdf-download-spinner" />
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        )}
        <span>{generating ? 'Generating…' : 'Download PDF'}</span>
      </button>
    </div>
  );
}

/* ─── Scoped styles ─────────────────────────────────────────────────────────── */

const PDF_CSS = `
  .pdf-download-btn {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 900;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #2C2A27;
    background: #FAFAF8;
    border: 0.5px solid rgba(0,0,0,0.15);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
  }
  .pdf-download-btn:hover {
    border-color: rgba(0,0,0,0.35);
    color: #1A1815;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .pdf-download-btn:disabled {
    opacity: 0.6;
    cursor: wait;
  }
  .pdf-download-btn svg {
    flex-shrink: 0;
  }

  .pdf-download-spinner {
    width: 14px;
    height: 14px;
    border: 1.5px solid rgba(0,0,0,0.15);
    border-top-color: #2C2A27;
    border-radius: 50%;
    animation: pdf-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes pdf-spin {
    to { transform: rotate(360deg); }
  }

  /* ── PDF generation layout overrides ── */

  /* Fix sidebar/content overlap — shrink letter, narrow sidebar */
  .pdf-generating [class*="-step"] {
    grid-template-columns: 72px 1fr !important;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-generating [class*="-step-letter"] {
    font-size: 52px !important;
  }

  .pdf-generating [class*="-step-sidebar"] {
    padding-right: 14px !important;
  }

  .pdf-generating [class*="-step-content"] {
    padding-left: 20px !important;
  }

  /* Tighten 4-column content grids for PDF */
  .pdf-generating [class*="-content-grid"] {
    grid-template-columns: repeat(4, 1fr) !important;
    font-size: 11px !important;
  }

  .pdf-generating [class*="-content-col"] {
    padding: 10px 10px 14px !important;
  }

  /* Reduce main wrap padding for more content space */
  .pdf-generating [class*="-wrap"] {
    padding-left: 32px !important;
    padding-right: 32px !important;
  }

  /* Keep golden rules grid together */
  .pdf-generating [class*="-golden"],
  .pdf-generating [class*="golden-rules"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Keep pearl/callout boxes together */
  .pdf-generating [class*="-pearl"],
  .pdf-generating [class*="-callout"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Keep red flags section together */
  .pdf-generating [class*="-flags"],
  .pdf-generating [class*="red-flag"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Keep tables together */
  .pdf-generating table,
  .pdf-generating [class*="-table"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Keep data grids together */
  .pdf-generating [class*="-grid"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Avoid breaks after section titles */
  .pdf-generating h2,
  .pdf-generating [class*="section-title"] {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* PDF footer branding */
  .pdf-generating::after {
    content: 'thenurselab.co.uk';
    display: block;
    text-align: center;
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #aaa;
    padding: 32px 0 16px;
    border-top: 0.5px solid rgba(0,0,0,0.08);
    margin-top: 48px;
  }

  @media print {
    .pdf-download-btn { display: none !important; }
  }
`;
