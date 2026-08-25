'use client';

import { useRef, useState } from 'react';
import { AREAS, AreaOption, OPTIONS, OPTION_LABELS, OPTION_COLORS, OPTION_BG, ACCENT, PIP_TOKEN } from './constants';

type SendState = 'idle' | 'sending' | 'sent' | 'error';

type Answer = {
  option: AreaOption | null;
  note: string;
};

export default function PipForm() {
  const [answers, setAnswers] = useState<Record<string, Answer>>(
    () => Object.fromEntries(AREAS.map((a) => [a.id, { option: null, note: '' }])),
  );
  const [extra, setExtra] = useState('');
  const [sendState, setSendState] = useState<SendState>('idle');
  const summaryRef = useRef<HTMLDivElement>(null);

  const answeredCount = AREAS.filter((a) => answers[a.id].option).length;
  const missingNotes = AREAS.filter((a) => {
    const ans = answers[a.id];
    return (ans.option === 'some-trouble' || ans.option === 'real-struggle') && !ans.note.trim();
  });

  function setAnswer(areaId: string, partial: Partial<Answer>) {
    setAnswers((prev) => ({
      ...prev,
      [areaId]: { ...prev[areaId], ...partial },
    }));
  }

  async function downloadPdf() {
    const el = summaryRef.current;
    if (!el) return;
    const html2pdf = (await import('html2pdf.js')).default;
    await html2pdf()
      .set({
        margin: 12,
        filename: 'how-shes-doing.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: 'var(--surface-page)' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(el)
      .save();
  }

  async function sendToLauren() {
    setSendState('sending');
    try {
      const res = await fetch('/api/pip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: PIP_TOKEN, answers, extra }),
      });
      setSendState(res.ok ? 'sent' : 'error');
    } catch {
      setSendState('error');
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <header style={styles.header}>
          <p style={styles.eyebrow}>For Louis</p>
          <h1 style={styles.heading}>How she&apos;s really doing</h1>
          <p style={styles.intro}>
            Tap how she is with each thing on a normal-to-bad day — not her best day. If you pick
            anything other than Fine, please add a quick note on what that looks like. Thank you. x
          </p>
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${(answeredCount / AREAS.length) * 100}%`,
              }}
            />
          </div>
          <p style={styles.progressLabel}>
            {answeredCount} / {AREAS.length} answered
          </p>
        </header>

        <div style={styles.list}>
          {AREAS.map((area) => (
            <AreaRow
              key={area.id}
              area={area}
              answer={answers[area.id]}
              onChange={(partial) => setAnswer(area.id, partial)}
            />
          ))}
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionHeading}>Anything else?</h2>
          <p style={styles.sectionHint}>
            Bad patches, things she avoids, ways you help that have just become normal —
            whatever comes to mind. Optional.
          </p>
          <textarea
            style={styles.textarea}
            rows={4}
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
          />
        </section>

        {answeredCount > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionHeading}>Summary</h2>
            <p style={styles.sectionHint}>
              Updates as you go. When you&apos;re done, send it to Lauren or save a PDF.
            </p>
            <div ref={summaryRef} style={styles.summarySheet}>
              <div style={styles.summaryList}>
                {AREAS.map((area) => {
                  const answer = answers[area.id];
                  return (
                    <div key={area.id} style={styles.summaryRow}>
                      <span style={styles.summaryAreaName}>{area.name}</span>
                      {answer.option ? (
                        <span
                          style={{
                            ...styles.summaryBadge,
                            color: OPTION_COLORS[answer.option],
                            backgroundColor: OPTION_BG[answer.option],
                          }}
                        >
                          {OPTION_LABELS[answer.option]}
                        </span>
                      ) : (
                        <span style={{ ...styles.summaryBadge, ...styles.summaryBadgeEmpty }}>
                          Not answered
                        </span>
                      )}
                      {answer.note && <p style={styles.summaryNote}>{answer.note}</p>}
                    </div>
                  );
                })}
                {extra && (
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryAreaName}>Anything else</span>
                    <p style={styles.summaryNote}>{extra}</p>
                  </div>
                )}
              </div>
            </div>

            {missingNotes.length > 0 && (
              <p style={styles.warnNote}>
                Add a quick note for: {missingNotes.map((a) => a.name).join(', ')}.
              </p>
            )}

            <div style={styles.actions}>
              <button
                style={{
                  ...styles.primaryButton,
                  ...(missingNotes.length > 0 ? styles.buttonDisabled : {}),
                }}
                onClick={sendToLauren}
                disabled={missingNotes.length > 0 || sendState === 'sending' || sendState === 'sent'}
              >
                {sendState === 'sending'
                  ? 'Sending…'
                  : sendState === 'sent'
                    ? 'Sent to Lauren ✓'
                    : 'Send to Lauren'}
              </button>
              <button
                style={{
                  ...styles.secondaryButton,
                  ...(missingNotes.length > 0 ? styles.buttonDisabled : {}),
                }}
                onClick={downloadPdf}
                disabled={missingNotes.length > 0}
              >
                Download PDF
              </button>
            </div>
            {sendState === 'error' && (
              <p style={styles.errorNote}>
                Couldn&apos;t send just now — please download the PDF and send it to Lauren instead.
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function AreaRow({
  area,
  answer,
  onChange,
}: {
  area: { id: string; name: string; subtitle: string };
  answer: Answer;
  onChange: (partial: Partial<Answer>) => void;
}) {
  const showNote = answer.option === 'some-trouble' || answer.option === 'real-struggle';
  const noteMissing = showNote && !answer.note.trim();

  return (
    <div style={styles.row}>
      <div style={styles.rowText}>
        <span style={styles.rowName}>{area.name}</span>
        <span style={styles.rowSubtitle}>{area.subtitle}</span>
      </div>

      <div style={styles.pillGroup}>
        {OPTIONS.map((option) => {
          const selected = answer.option === option;
          return (
            <button
              key={option}
              onClick={() => onChange({ option })}
              style={{
                ...styles.pillButton,
                ...(selected
                  ? {
                      backgroundColor: OPTION_COLORS[option],
                      color: '#FFFFFF',
                      border: `0.5px solid ${OPTION_COLORS[option]}`,
                    }
                  : {}),
              }}
            >
              {OPTION_LABELS[option]}
            </button>
          );
        })}
      </div>

      <div
        style={{
          ...styles.noteWrap,
          ...(showNote ? styles.noteWrapOpen : styles.noteWrapClosed),
        }}
      >
        <textarea
          style={{
            ...styles.noteTextarea,
            ...(noteMissing ? styles.noteTextareaMissing : {}),
          }}
          rows={2}
          placeholder="What does this look like for her? (required)"
          value={answer.note}
          onChange={(e) => onChange({ note: e.target.value })}
        />
        {noteMissing && <span style={styles.noteRequiredHint}>Please add a quick note</span>}
      </div>
    </div>
  );
}

const HAIRLINE = '0.5px solid rgba(0,0,0,0.08)';

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'var(--surface-page)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    color: 'var(--ink-strong)',
  },
  inner: {
    maxWidth: 560,
    margin: '0 auto',
    padding: '40px 20px 80px',
  },
  header: {
    marginBottom: 32,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--ink-soft)',
    margin: '0 0 8px',
  },
  heading: {
    fontSize: 26,
    fontWeight: 600,
    margin: '0 0 12px',
    color: 'var(--ink-strong)',
  },
  intro: {
    fontSize: 15,
    lineHeight: 1.6,
    color: 'var(--ink-soft)',
    margin: '0 0 20px',
  },
  progressTrack: {
    height: 3,
    width: '100%',
    backgroundColor: 'var(--surface-sunken)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ACCENT,
    transition: 'width 0.25s ease',
  },
  progressLabel: {
    fontSize: 12,
    color: 'var(--ink-soft)',
    margin: '8px 0 0',
  },
  list: {
    borderTop: HAIRLINE,
  },
  row: {
    padding: '20px 0',
    borderBottom: HAIRLINE,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  rowText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  rowName: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--ink-strong)',
  },
  rowSubtitle: {
    fontSize: 13,
    color: 'var(--ink-soft)',
  },
  pillGroup: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  pillButton: {
    flex: '1 1 auto',
    padding: '10px 14px',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'inherit',
    color: 'var(--ink-strong)',
    backgroundColor: 'var(--surface-raised)',
    border: HAIRLINE,
    borderRadius: 0,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, color 0.15s ease',
  },
  noteWrap: {
    overflow: 'hidden',
    transition: 'max-height 0.25s ease, opacity 0.25s ease',
  },
  noteWrapOpen: {
    maxHeight: 160,
    opacity: 1,
  },
  noteWrapClosed: {
    maxHeight: 0,
    opacity: 0,
  },
  noteTextarea: {
    width: '100%',
    padding: 10,
    fontFamily: 'inherit',
    fontSize: 14,
    color: 'var(--ink-strong)',
    backgroundColor: 'var(--surface-page)',
    border: HAIRLINE,
    borderRadius: 0,
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  noteTextareaMissing: {
    border: `1px solid ${OPTION_COLORS['real-struggle']}`,
    backgroundColor: 'var(--surface-raised)',
  },
  noteRequiredHint: {
    display: 'block',
    fontSize: 12,
    color: OPTION_COLORS['real-struggle'],
    marginTop: 4,
  },
  section: {
    marginTop: 32,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 600,
    margin: '0 0 6px',
    color: 'var(--ink-strong)',
  },
  sectionHint: {
    fontSize: 13,
    color: 'var(--ink-soft)',
    margin: '0 0 12px',
  },
  textarea: {
    width: '100%',
    padding: 12,
    fontFamily: 'inherit',
    fontSize: 15,
    color: 'var(--ink-strong)',
    backgroundColor: 'var(--surface-raised)',
    border: HAIRLINE,
    borderRadius: 0,
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  summarySheet: {
    backgroundColor: 'var(--surface-page)',
  },
  summaryList: {
    borderTop: HAIRLINE,
  },
  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  primaryButton: {
    flex: '1 1 160px',
    padding: '13px 18px',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: 'inherit',
    color: '#FFFFFF',
    backgroundColor: ACCENT,
    border: `0.5px solid ${ACCENT}`,
    borderRadius: 0,
    cursor: 'pointer',
  },
  secondaryButton: {
    flex: '1 1 160px',
    padding: '13px 18px',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: 'inherit',
    color: 'var(--ink-strong)',
    backgroundColor: 'var(--surface-raised)',
    border: HAIRLINE,
    borderRadius: 0,
    cursor: 'pointer',
  },
  errorNote: {
    fontSize: 13,
    color: '#A8364F',
    margin: '12px 0 0',
    lineHeight: 1.5,
  },
  warnNote: {
    fontSize: 13,
    color: OPTION_COLORS['real-struggle'],
    margin: '0 0 12px',
    lineHeight: 1.5,
  },
  buttonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  summaryBadgeEmpty: {
    color: '#8A8178',
    backgroundColor: 'var(--surface-sunken)',
  },
  summaryRow: {
    padding: '14px 0',
    borderBottom: HAIRLINE,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  summaryAreaName: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--ink-strong)',
    flex: '1 1 auto',
  },
  summaryBadge: {
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 0,
  },
  summaryNote: {
    fontSize: 13,
    color: 'var(--ink-soft)',
    margin: '4px 0 0',
    width: '100%',
    lineHeight: 1.5,
  },
};
