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

    // ── Hide interactive / non-print elements ──
    const hidden: HTMLElement[] = [];
    const hide = (node: HTMLElement | null) => {
      if (!node) return;
      node.style.display = 'none';
      hidden.push(node);
    };

    try {
      // Back navigation
      el.querySelectorAll<HTMLElement>('[class*="-back"]').forEach(hide);
      // Save / bookmark row
      el.querySelectorAll<HTMLElement>('.mt-6').forEach((node) => {
        if (node.querySelector('button')) hide(node);
      });
      // Download button itself
      el.querySelectorAll<HTMLElement>('.pdf-download-btn').forEach(hide);
      // Checklist grids
      el.querySelectorAll<HTMLElement>('[class*="checklist"], [class*="check-item"]').forEach(hide);
      // SelfTestQuiz components
      el.querySelectorAll<HTMLElement>('.mt-8.print\\:hidden').forEach(hide);
      // Self-test / checklist headings
      el.querySelectorAll<HTMLElement>('h2').forEach((h2) => {
        const text = h2.textContent?.trim().toLowerCase() || '';
        if (text.includes('self-test') || text.includes('checklist')) hide(h2);
      });

      el.classList.add('pdf-generating');

      // Extract title for filename
      const h1 = el.querySelector('h1');
      const title = h1?.textContent?.trim().replace(/[^a-zA-Z0-9\s\-–]/g, '').replace(/\s+/g, '-') || 'resource';

      // Dynamic scale to stay under browser canvas limit (~16k px)
      const elHeight = el.scrollHeight;
      const scale = elHeight * 1.5 > 15000 ? 1 : 1.5;

      const [html2canvas, { jsPDF }] = await Promise.all([
        import('html2canvas').then((m) => m.default),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(el, {
        scale,
        useCORS: true,
        scrollY: 0,
        windowWidth: 860,
        logging: false,
      });

      // A4 dimensions in mm
      const pageW = 210;
      const pageH = 297;
      const mTop = 12, mRight = 10, mBottom = 14, mLeft = 10;
      const contentW = pageW - mLeft - mRight; // 190mm
      const contentH = pageH - mTop - mBottom; // 271mm

      // Total image height in mm at content width
      const imgHeight = (canvas.height / canvas.width) * contentW;
      const pagesCount = Math.ceil(imgHeight / contentH);

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

      for (let i = 0; i < pagesCount; i++) {
        if (i > 0) pdf.addPage();

        // How many mm from the top of the full image this page starts
        const yOffsetMm = i * contentH;
        // Corresponding pixel offset in the source canvas
        const sourceY = (yOffsetMm / imgHeight) * canvas.height;
        // Pixels to take for this page
        const sliceH = Math.min(
          (contentH / imgHeight) * canvas.height,
          canvas.height - sourceY,
        );

        // Render this slice to a temporary canvas
        const slice = document.createElement('canvas');
        slice.width = canvas.width;
        slice.height = Math.ceil(sliceH);
        const ctx = slice.getContext('2d')!;
        ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

        const imgData = slice.toDataURL('image/jpeg', 0.95);
        // Height of this slice in mm
        const sliceHMm = (sliceH / canvas.height) * imgHeight;
        pdf.addImage(imgData, 'JPEG', mLeft, mTop, contentW, sliceHMm);
      }

      pdf.save(`${title}-TheNurseLab.pdf`);
    } finally {
      el.classList.remove('pdf-generating');
      hidden.forEach((node) => { node.style.display = ''; });
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
    gap: 9px;
    padding: 12px 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #FAFAF8;
    background: #1A1815;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
    box-shadow: 0 2px 16px rgba(0,0,0,0.18);
  }
  .pdf-download-btn:hover {
    opacity: 0.82;
  }
  .pdf-download-btn:disabled {
    opacity: 0.5;
    cursor: wait;
  }
  .pdf-download-btn svg {
    flex-shrink: 0;
    stroke: #FAFAF8;
  }

  .pdf-download-spinner {
    width: 14px;
    height: 14px;
    border: 1.5px solid rgba(255,255,255,0.2);
    border-top-color: #FAFAF8;
    border-radius: 50%;
    animation: pdf-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes pdf-spin {
    to { transform: rotate(360deg); }
  }

  /* ── PDF generation layout overrides ── */

  .pdf-generating * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  .pdf-generating [class*="-wrap"] {
    padding-left: 28px !important;
    padding-right: 28px !important;
    padding-top: 24px !important;
  }

  .pdf-generating [class*="-step"] {
    grid-template-columns: 64px 1fr !important;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-generating [class*="-step-letter"] {
    font-size: 44px !important;
  }

  .pdf-generating [class*="-step-sidebar"] {
    padding-right: 12px !important;
  }

  .pdf-generating [class*="-step-content"] {
    padding-left: 16px !important;
  }

  .pdf-generating [class*="-golden"] {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .pdf-generating [class*="-content-grid"] {
    grid-template-columns: repeat(4, 1fr) !important;
    font-size: 11px !important;
  }

  .pdf-generating [class*="-content-col"] {
    padding: 10px 10px 14px !important;
  }

  .pdf-generating [class*="-golden"],
  .pdf-generating [class*="golden-rules"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-generating [class*="-pearl"],
  .pdf-generating [class*="-callout"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-generating [class*="-flags"],
  .pdf-generating [class*="red-flag"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-generating table,
  .pdf-generating [class*="-table"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-generating [class*="-grid"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

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
