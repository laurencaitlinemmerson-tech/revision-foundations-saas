'use client';

import { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

interface SelfTestQuizProps {
  title?: string;
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export default function SelfTestQuiz({
  title = 'Test Your Knowledge',
  questions,
  onComplete,
}: SelfTestQuizProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (i === questions[current].answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    const isLast = current === questions.length - 1;
    if (isLast) {
      const finalScore = score + (selected === questions[current].answer ? 1 : 0);
      setDone(true);
      onComplete?.(finalScore, questions.length);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setDone(false);
  };

  const close = () => { setIsOpen(false); reset(); };

  const pct = (n: number) => Math.round((n / questions.length) * 100);
  const progressWidth = `${pct(current + (revealed ? 1 : 0))}%`;

  const scoreMsg = () => {
    const p = pct(score);
    if (p >= 80) return 'Strong result.';
    if (p >= 60) return 'Good — review the ones you missed.';
    if (p >= 40) return 'Keep going — read through again.';
    return 'Time to review the content carefully.';
  };

  return (
    <div style={{ marginTop: '40px' }} className="print:hidden">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '100%',
            background: 'var(--surface-sunken)',
            border: '0.5px solid var(--hairline-firm)',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--purple-50)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#F5F3F0')}
        >
          <div>
            <p style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '5px', fontWeight: 400 }}>
              Quick self-test
            </p>
            <p style={{ fontSize: '15px', fontWeight: 400, color: 'var(--ink-strong)', fontFamily: "'Playfair Display', Georgia, serif" }}>
              {title}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--ink-faint)', fontWeight: 300, marginTop: '3px' }}>
              {questions.length} questions
            </p>
          </div>
          <span style={{ fontSize: '16px', color: 'var(--ink-faint)', flexShrink: 0, marginLeft: '16px' }}>→</span>
        </button>
      ) : (
        <div style={{ border: '0.5px solid var(--hairline-firm)', background: 'var(--surface-page)' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 24px',
            borderBottom: '0.5px solid var(--hairline-soft)',
          }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-faint)', fontWeight: 400 }}>
              Self-test
            </p>
            <button
              onClick={close}
              style={{
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-faint)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              Close
            </button>
          </div>

          <div style={{ padding: '24px' }}>
            {!done ? (
              <>
                {/* Progress */}
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {current + 1} of {questions.length}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Score {score}
                    </span>
                  </div>
                  <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)' }}>
                    <div style={{ height: '100%', background: '#1A1815', width: progressWidth, transition: 'width 0.25s ease' }} />
                  </div>
                </div>

                {/* Question */}
                <p style={{ fontSize: '14px', fontWeight: 400, color: 'var(--ink-strong)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {questions[current].question}
                </p>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  {questions[current].options.map((opt, i) => {
                    const isCorrect = i === questions[current].answer;
                    const isSelected = selected === i;
                    let bg = '#fff';
                    let borderColor = 'rgba(0,0,0,0.1)';
                    let color = '#2C2A27';
                    let opacity = 1;
                    if (revealed) {
                      if (isCorrect) { bg = 'var(--teal-50)'; borderColor = 'var(--teal-600)'; color = 'var(--teal-800)'; }
                      else if (isSelected) { bg = '#FDF4F4'; borderColor = 'var(--red-600)'; color = '#5A3030'; }
                      else { color = 'var(--ink-faint)'; opacity = 0.5; }
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={revealed}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          border: `0.5px solid ${borderColor}`,
                          background: bg,
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: 300,
                          color,
                          cursor: revealed ? 'default' : 'pointer',
                          lineHeight: 1.55,
                          opacity,
                          transition: 'background 0.12s, border-color 0.12s, opacity 0.12s',
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {revealed && questions[current].explanation && (
                  <div style={{
                    padding: '12px 14px',
                    background: 'var(--surface-sunken)',
                    borderLeft: '2px solid var(--hairline-firm)',
                    marginBottom: '16px',
                  }}>
                    <p style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>
                      {questions[current].explanation}
                    </p>
                  </div>
                )}

                {/* Next */}
                {revealed && (
                  <button
                    onClick={handleNext}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      background: '#1A1815',
                      color: 'var(--surface-page)',
                      border: 'none',
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {current < questions.length - 1 ? 'Next →' : 'See results →'}
                  </button>
                )}
              </>
            ) : (
              /* Results */
              <div style={{ textAlign: 'center', padding: '24px 0 16px' }}>
                <p style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '14px' }}>
                  Result
                </p>
                <p style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '52px',
                  fontWeight: 400,
                  color: 'var(--ink-strong)',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}>
                  {score}
                  <span style={{ fontSize: '24px', color: 'var(--ink-faint)', fontWeight: 300 }}>/{questions.length}</span>
                </p>
                <p style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 300, marginTop: '10px', marginBottom: '28px', lineHeight: 1.6 }}>
                  {scoreMsg()}
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    onClick={reset}
                    style={{
                      padding: '9px 20px',
                      border: '0.5px solid var(--hairline-firm)',
                      background: 'var(--surface-raised)',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-soft)',
                      cursor: 'pointer',
                    }}
                  >
                    Try again
                  </button>
                  <button
                    onClick={close}
                    style={{
                      padding: '9px 20px',
                      border: 'none',
                      background: '#1A1815',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--surface-page)',
                      cursor: 'pointer',
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
