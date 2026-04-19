'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';

// ─── design tokens (matches homepage exactly) ────────────────────────────────
const serif   = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";

const ink      = '#1A1815';
const inkMid   = '#5A5750';
const inkLight = '#9C8878';
const cream    = '#FAFAF8';
const parchment = '#F5F3F0';
const panel    = '#FFFFFF';
const border   = 'rgba(0,0,0,0.08)';
const green    = '#1E8A4D';
const greenBg  = '#E6F4EA';
const tagBg    = '#F3F1EE';

export default function ReviewPage() {
  const [name,          setName]          = useState('');
  const [text,          setText]          = useState('');
  const [rating,        setRating]        = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [submitted,     setSubmitted]     = useState(false);
  const [error,         setError]         = useState('');
  const [reviewSource,  setReviewSource]  = useState<'loading' | 'google' | 'supabase'>('loading');
  const [googleReviewUrl, setGoogleReviewUrl] = useState<string | null>(null);

  useEffect(() => {
    void fetch('/api/reviews')
      .then((response) => response.json())
      .then((data) => {
        setReviewSource(data.source === 'google' ? 'google' : 'supabase');
        setGoogleReviewUrl(data.reviewUrl || null);
      })
      .catch(() => {
        setReviewSource('supabase');
        setGoogleReviewUrl(null);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text, rating }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409 && data.reviewUrl) {
          window.location.href = data.reviewUrl;
          return;
        }
        throw new Error(data.error || 'Failed to submit review');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ── success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ background: cream, minHeight: '100vh' }}>
        <main style={{ padding: '128px 24px 96px' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                border: `0.5px solid ${border}`,

                background: panel,
                padding: '48px 40px',

              }}
            >
              {/* icon */}
              <div
                style={{
                  width: '56px',
                  height: '56px',

                  background: greenBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h1
                style={{
                  fontFamily: display,
                  fontSize: '2rem',
                  fontWeight: 400,
                  color: ink,
                  marginBottom: '12px',
                  lineHeight: 1.15,
                }}
              >
                Thank you.
              </h1>

              <p
                style={{
                  fontFamily: serif,
                  fontSize: '15px',
                  lineHeight: 1.85,
                  fontWeight: 300,
                  color: inkMid,
                  marginBottom: '32px',
                  maxWidth: '340px',
                  margin: '0 auto 32px',
                }}
              >
                Your review has been submitted. It'll appear on the site once I've had a chance to read it.
              </p>

              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: serif,
                  fontSize: '14px',
                  fontWeight: 400,
                  background: ink,
                  color: cream,
                  padding: '12px 24px',
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={14} />
                Back home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (reviewSource === 'loading') {
    return (
      <div style={{ background: cream, minHeight: '100vh' }}>
        <main style={{ padding: '128px 24px 96px' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <div
              style={{
                border: `0.5px solid ${border}`,
                background: panel,
                padding: '36px 36px 32px',
                textAlign: 'center',
              }}
            >
              <Loader2 size={18} className="spin" style={{ color: inkLight, marginBottom: '12px' }} />
              <p style={{ fontFamily: serif, fontSize: '14px', color: inkMid, fontWeight: 300 }}>
                Checking the latest review source…
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (reviewSource === 'google' && googleReviewUrl) {
    return (
      <div style={{ background: cream, minHeight: '100vh' }}>
        <main style={{ padding: '128px 24px 96px' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <div style={{ marginBottom: '36px' }}>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: inkLight,
                  marginBottom: '14px',
                }}
              >
                Leave a review
              </p>
              <h1
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: ink,
                  marginBottom: '14px',
                }}
              >
                Reviews now go through Google.
              </h1>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: '15px',
                  lineHeight: 1.85,
                  fontWeight: 300,
                  color: inkMid,
                }}
              >
                New testimonials on the site are pulled from your Google Business Profile, so leaving a review now happens there instead of through the site form.
              </p>
            </div>

            <div
              style={{
                border: `0.5px solid ${border}`,
                background: panel,
                padding: '36px 36px 32px',
              }}
            >
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  fontFamily: serif,
                  fontSize: '14px',
                  fontWeight: 400,
                  background: ink,
                  color: cream,
                  padding: '14px 24px',
                  border: 'none',
                  textDecoration: 'none',
                }}
              >
                Leave a Google review
              </a>
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: serif,
                  fontSize: '13px',
                  fontWeight: 300,
                  color: inkLight,
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={12} />
                Back home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── form ───────────────────────────────────────────────────────────────────
  const activeRating = hoveredRating || rating;

  return (
    <div style={{ background: cream, minHeight: '100vh' }}>

      <main style={{ padding: '128px 24px 96px' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>

          {/* page header */}
          <div style={{ marginBottom: '36px' }}>
            <p
              style={{
                fontFamily: serif,
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: inkLight,
                marginBottom: '14px',
              }}
            >
              Leave a review
            </p>
            <h1
              style={{
                fontFamily: display,
                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                color: ink,
                marginBottom: '14px',
              }}
            >
              Found it helpful? Let other students know.
            </h1>
            <p
              style={{
                fontFamily: serif,
                fontSize: '15px',
                lineHeight: 1.85,
                fontWeight: 300,
                color: inkMid,
              }}
            >
              Reviews go live after a quick check. Takes less than a minute to write one.
            </p>
          </div>

          {/* card */}
          <div
            style={{
              border: `0.5px solid ${border}`,
              background: panel,
              padding: '36px 36px 32px',
            }}
          >
            <form onSubmit={handleSubmit}>

              {/* ── rating ── */}
              <div style={{ marginBottom: '28px' }}>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: inkLight,
                    marginBottom: '14px',
                  }}
                >
                  Your rating
                </p>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '2px',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                        display: 'flex',
                      }}
                      className="star-btn"
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill={star <= activeRating ? '#D97706' : 'none'}
                        stroke={star <= activeRating ? '#D97706' : '#C9C1B5'}
                        strokeWidth="1.5"
                        style={{ transition: 'fill 0.15s ease, stroke 0.15s ease' }}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}

                  <span
                    style={{
                      fontFamily: serif,
                      fontSize: '12px',
                      color: inkLight,
                      marginLeft: '8px',
                    }}
                  >
                    {activeRating === 5 ? 'Excellent'
                      : activeRating === 4 ? 'Really good'
                      : activeRating === 3 ? 'Pretty good'
                      : activeRating === 2 ? 'Could be better'
                      : 'Needs work'}
                  </span>
                </div>
              </div>

              {/* ── divider ── */}
              <div style={{ height: '1px', background: border, marginBottom: '28px' }} />

              {/* ── name ── */}
              <div style={{ marginBottom: '22px' }}>
                <label
                  htmlFor="name"
                  style={{
                    display: 'block',
                    fontFamily: serif,
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: inkLight,
                    marginBottom: '10px',
                  }}
                >
                  First name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah"
                  maxLength={50}
                  required
                  style={{
                    width: '100%',
                    fontFamily: serif,
                    fontSize: '14px',
                    color: ink,
                    background: parchment,
                    border: `0.5px solid ${border}`,

                    padding: '13px 16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.18s ease',
                  }}
                  className="review-input"
                />
              </div>

              {/* ── review text ── */}
              <div style={{ marginBottom: '28px' }}>
                <label
                  htmlFor="text"
                  style={{
                    display: 'block',
                    fontFamily: serif,
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: inkLight,
                    marginBottom: '10px',
                  }}
                >
                  Your review
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What did you find most useful? How did it help with placement or OSCEs?"
                  maxLength={500}
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    fontFamily: serif,
                    fontSize: '14px',
                    lineHeight: 1.75,
                    color: ink,
                    background: parchment,
                    border: `0.5px solid ${border}`,

                    padding: '13px 16px',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.18s ease',
                  }}
                  className="review-input"
                />
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '12px',
                    color: inkLight,
                    textAlign: 'right',
                    marginTop: '6px',
                  }}
                >
                  {text.length} / 500
                </p>
              </div>

              {/* ── error ── */}
              {error && (
                <div
                  style={{
                    padding: '14px 16px',
                    background: '#F6E6E6',
                    border: '0.5px solid #E1B1B1',
                    fontFamily: serif,
                    fontSize: '13px',
                    color: '#B05A5A',
                    marginBottom: '22px',
                  }}
                >
                  {error}
                </div>
              )}

              {/* ── submit ── */}
              <button
                type="submit"
                disabled={loading || !name.trim() || !text.trim()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  fontFamily: serif,
                  fontSize: '14px',
                  fontWeight: 400,
                  background: loading || !name.trim() || !text.trim() ? '#C9C1B5' : ink,
                  color: cream,
                  padding: '14px 24px',
                  border: 'none',
                  cursor: loading || !name.trim() || !text.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background 0.18s ease, transform 0.18s ease',
                }}
                className="submit-btn"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit review
                  </>
                )}
              </button>
            </form>
          </div>

          {/* back link */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: serif,
                fontSize: '13px',
                fontWeight: 300,
                color: inkLight,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={12} />
              Back home
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        .review-input::placeholder {
          color: #B8AD9E;
        }
        .review-input:focus {
          border-color: #B8AD9E !important;
          background: #FFFFFF !important;
        }
        .star-btn:hover {
          transform: scale(1.18);
        }
        .submit-btn:not(:disabled):hover {
          transform: translateY(-1px);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}
