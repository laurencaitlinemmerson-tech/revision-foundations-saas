export default function HomeStyles() {
  return (
    <style>{`
      @media (max-width: 768px) {
        .home-hero-grid {
          grid-template-columns: 1fr !important;
        }
        .home-branch-strip {
          grid-template-columns: 1fr !important;
        }
        .home-tool-visual-grid {
          grid-template-columns: 1fr !important;
        }
        .home-access-grid {
          grid-template-columns: 1fr !important;
        }
        .home-diagnostic-card-grid {
          grid-template-columns: 1fr !important;
        }
        .home-diagnostic-panel-controls {
          border-right: none !important;
          border-bottom: 0.5px solid rgba(0,0,0,0.08) !important;
        }
        .home-trust-grid {
          grid-template-columns: 1fr !important;
        }
        .home-hero-preview-grid {
          grid-template-columns: 1fr !important;
        }
        .home-diagnostic-options {
          grid-template-columns: 1fr !important;
        }
        .home-sample-3col {
          grid-template-columns: 1fr !important;
        }
        .home-sample-secondary {
          display: none !important;
        }
        .home-sample-mobile-links {
          display: flex !important;
        }
        .home-why-grid {
          grid-template-columns: 1fr !important;
          gap: 28px !important;
        }
        .home-osce-grid {
          grid-template-columns: 1fr !important;
        }
        .home-osce-4col {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        .home-tool-row {
          grid-template-columns: 1fr !important;
        }
        .home-bundle-cta {
          padding: 32px 24px !important;
        }
        .home-hub-grid {
          grid-template-columns: 1fr !important;
        }
        .home-journey-grid {
          grid-template-columns: 1fr !important;
        }
        .home-journey-rail {
          position: static !important;
        }
        .home-journey-step-grid {
          grid-template-columns: 1fr !important;
        }
        .home-journey-meta {
          border-left: none !important;
          border-top: 0.5px solid rgba(0,0,0,0.08) !important;
          padding-left: 0 !important;
          padding-top: 14px !important;
        }
        .home-bundle-cta {
          display: none !important;
        }
        .home-final-cta-main {
          padding: 56px 24px 60px !important;
        }
      }
      @media (min-width: 769px) and (max-width: 1024px) {
        .home-access-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        .home-hub-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        .home-journey-grid {
          grid-template-columns: 220px minmax(0, 1fr) !important;
        }
      }
      @media (max-width: 480px) {
        .home-osce-4col {
          grid-template-columns: 1fr !important;
        }
      }
      .home-hub-card:hover {
        border-color: var(--editorial-input-focus) !important;
      }
      .home-preview-card {
        transition: border-color 0.24s ease;
      }
      .home-preview-card:hover {
        border-color: var(--editorial-input-focus) !important;
      }
      .home-diagnostic-panel-controls {
        border-right: 0.5px solid rgba(0,0,0,0.08);
      }
      .home-osce-col {
        transition: background-color 0.2s ease;
      }
      .home-osce-col:hover {
        background: var(--editorial-bg-soft);
      }
      .home-quiz-option {
        transition: transform 0.16s ease, border-color 0.16s ease, background-color 0.16s ease;
      }
      .home-quiz-option:hover {
        transform: translateX(2px);
        border-color: var(--editorial-input-focus) !important;
      }
    `}</style>
  );
}
