'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search, X } from 'lucide-react';

const serif = "var(--font-body)";
const display = "var(--font-display)";
const ink = "var(--espresso)";
const bodyColor = "var(--charcoal)";
const mid = "var(--charcoal-light)";
const muted = "var(--charcoal-light)";
const borderMid = "var(--border)";
const border = "var(--border)";

const HUB_RESOURCES = [
  { title: 'A–E Assessment Framework', href: '/hub/resources/ae-assessment-guide', tag: 'OSCE' },
  { title: 'IM & SC Injections', href: '/hub/resources/im-sc-injection', tag: 'Clinical Skills' },
  { title: 'NG Tube Insertion & Testing', href: '/hub/resources/ng-tube-insertion', tag: 'Clinical Skills' },
  { title: 'Drug Calculations Cheat Sheet', href: '/hub/resources/drug-calculations-cheat-sheet', tag: 'Meds' },
  { title: 'Placement Survival Guide', href: '/hub/resources/placement-survival', tag: 'Placement' },
  { title: 'Paediatric Vital Signs', href: '/hub/resources/paeds-vital-signs-cheat-sheet', tag: 'Paeds' },
  { title: 'Cardiovascular System', href: '/hub/resources/cardiovascular-system', tag: 'Anatomy' },
  { title: 'Respiratory System', href: '/hub/resources/respiratory-system', tag: 'Anatomy' },
  { title: 'Renal System', href: '/hub/resources/renal-system', tag: 'Anatomy' },
  { title: 'Brain & Nervous System', href: '/hub/resources/brain-nervous-system', tag: 'Anatomy' },
  { title: 'Medication Abbreviations', href: '/hub/resources/medication-abbreviations', tag: 'Meds' },
  { title: '9 Rights of Medication', href: '/hub/resources/9-rights-medication', tag: 'Meds' },
  { title: 'Sepsis 6 & Escalation', href: '/hub/resources/sepsis-6-escalation', tag: 'Emergency' },
  { title: 'Pain Assessment in Children', href: '/hub/resources/y1-pain-assessment', tag: 'Assessment' },
  { title: 'Safeguarding Children', href: '/hub/resources/y1-safeguarding', tag: 'Placement' },
  { title: 'Consent & Gillick Competence', href: '/hub/resources/y1-consent-gillick', tag: 'Ethics' },
  { title: 'Paediatric Medications', href: '/hub/resources/y1-paeds-medications', tag: 'Meds' },
  { title: 'Communicating with Children', href: '/hub/resources/y1-child-communication', tag: 'Communication' },
  { title: 'Anatomy & Physiology Basics', href: '/hub/resources/y1-anatomy-physiology', tag: 'Y1' },
  { title: 'Documentation & Record Keeping', href: '/hub/resources/y1-documentation', tag: 'Placement' },
  { title: 'Infection Prevention & Control', href: '/hub/resources/y1-infection-control', tag: 'Placement' },
  { title: 'Professionalism & Ethics', href: '/hub/resources/y1-professionalism-ethics', tag: 'Ethics' },
  { title: 'Theories of Development', href: '/hub/resources/theories-of-development', tag: 'Paeds' },
  { title: 'Nursing Glossary', href: '/hub/glossary', tag: 'Reference' },
  { title: 'Palliative Care in Children', href: '/hub/resources/palliative-care-children', tag: 'Paeds' },
];

export default function QuickTopicSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const deferredQuery = useDeferredValue(query);

  const searchTerm = deferredQuery.trim().toLowerCase();

  const results = useMemo(
    () =>
      searchTerm.length > 1
        ? HUB_RESOURCES.filter(
            (resource) =>
              resource.title.toLowerCase().includes(searchTerm) ||
              resource.tag.toLowerCase().includes(searchTerm),
          ).slice(0, 6)
        : [],
    [searchTerm],
  );

  const featured = useMemo(
    () => [
      HUB_RESOURCES[0],
      HUB_RESOURCES[4],
      HUB_RESOURCES[5],
      HUB_RESOURCES[11],
      HUB_RESOURCES[17],
    ],
    [],
  );

  const showFeatured = open && searchTerm.length <= 1;
  const showNoResults = open && searchTerm.length > 1 && results.length === 0;

  function closeAndReset() {
    setOpen(false);
    setQuery('');
  }

  function goTo(href: string) {
    closeAndReset();
    router.push(href);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className="dash-search-shell"
      style={{ border: borderMid }}
    >
      <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, marginBottom: '12px' }}>
        Quick lookup
      </p>

      <h3 style={{ fontFamily: display, fontSize: '1.6rem', fontWeight: 400, lineHeight: 1.08, color: ink, marginBottom: '10px' }}>
        Search guides, skills, and quick references.
      </h3>

      <p style={{ fontFamily: serif, fontSize: '13px', color: mid, fontWeight: 300, lineHeight: 1.8, marginBottom: '16px', maxWidth: '36rem' }}>
        Search by topic or tag and press Enter to open the top result. If you do not know what to search yet, start with one of the shortcuts below.
      </p>

      <div className="dash-search-input">
        <Search size={14} color={mid} style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search hub resources..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false);
            }

            if (event.key === 'Enter' && results[0]) {
              event.preventDefault();
              goTo(results[0].href);
            }
          }}
          aria-label="Search dashboard resources"
          style={{
            fontFamily: serif,
            fontSize: '13px',
            color: ink,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            width: '100%',
          }}
        />
        {query ? (
          <button
            type="button"
            onClick={closeAndReset}
            className="dash-search-clear"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <span className="dash-search-hint">Enter</span>
        )}
      </div>

      {showFeatured ? (
        <div className="dash-search-panel">
          <p className="dash-search-panel-label">Popular shortcuts</p>
          <div className="dash-search-shortcuts">
            {featured.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                onClick={closeAndReset}
                className="dash-search-shortcut"
              >
                <span>{resource.title}</span>
                <span className="dash-search-tag">{resource.tag}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {open && results.length > 0 ? (
        <div className="dash-search-panel">
          <p className="dash-search-panel-label">Top matches</p>
          <div className="dash-search-results">
            {results.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                onClick={closeAndReset}
                className="dash-search-result"
              >
                <div>
                  <p className="dash-search-result-title">{resource.title}</p>
                  <p className="dash-search-result-copy">Open this if you want the quickest route back into {resource.tag.toLowerCase()} revision.</p>
                </div>
                <div className="dash-search-result-end">
                  <span className="dash-search-tag">{resource.tag}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {showNoResults ? (
        <div className="dash-search-panel">
          <p className="dash-search-panel-label">No exact matches</p>
          <p className="dash-search-empty-copy">
            Try a broader term like <em>meds</em>, <em>placement</em>, or <em>paeds</em>, or jump into the full hub instead.
          </p>
          <Link href="/hub" onClick={closeAndReset} className="dash-search-empty-link">
            Browse the hub <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}

      <style>{`
        .dash-search-shell {
          position: relative;
          background: #FAFAF8;
          padding: 24px 26px;
          min-height: 100%;
        }

        .dash-search-input {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 0.5px solid ${border};
          background: rgba(255,255,255,0.94);
          padding: 12px 14px;
        }

        .dash-search-hint {
          font-family: ${serif};
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${muted};
          padding-left: 12px;
          border-left: 0.5px solid ${border};
          flex-shrink: 0;
        }

        .dash-search-clear {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: ${mid};
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          flex-shrink: 0;
          transition: color 0.15s ease;
        }
        .dash-search-clear:hover {
          color: ${ink};
        }

        .dash-search-panel {
          margin-top: 14px;
          border-top: 0.5px solid ${border};
          padding-top: 14px;
        }

        .dash-search-panel-label {
          font-family: ${serif};
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${muted};
          margin: 0 0 12px;
        }

        .dash-search-shortcuts,
        .dash-search-results {
          display: grid;
          gap: 10px;
        }

        .dash-search-shortcut,
        .dash-search-result {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 14px;
          text-decoration: none;
          color: ${bodyColor};
          background: rgba(255,255,255,0.86);
          border: 0.5px solid ${border};
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }

        .dash-search-shortcut:hover,
        .dash-search-result:hover {
          border-color: ${borderMid};
          background: rgba(255,255,255,1);
          transform: translateY(-1px);
        }

        .dash-search-result-title {
          font-family: ${serif};
          font-size: 13px;
          color: ${ink};
          margin: 0 0 3px;
        }

        .dash-search-result-copy {
          font-family: ${serif};
          font-size: 11px;
          line-height: 1.6;
          color: ${mid};
          margin: 0;
        }

        .dash-search-result-end {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          color: ${mid};
        }

        .dash-search-tag {
          font-family: ${serif};
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${muted};
        }

        .dash-search-empty-copy {
          font-family: ${serif};
          font-size: 12px;
          line-height: 1.75;
          color: ${mid};
          margin: 0 0 10px;
        }

        .dash-search-empty-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: ${serif};
          font-size: 12px;
          color: ${bodyColor};
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      `}</style>
    </div>
  );
}
