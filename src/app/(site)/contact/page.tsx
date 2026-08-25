'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ─── design tokens (exact match to homepage) ─────────────────────────────────
const serif   = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";

const ink      = 'var(--ink-strong)';
const inkMid   = 'var(--ink-soft)';
const inkLight = 'var(--ink-faint)';
const cream    = 'var(--surface-page)';
const parchment = 'var(--surface-sunken)';
const panel    = 'var(--surface-raised)';
const border   = 'rgba(0,0,0,0.08)';
const tagBg    = 'var(--surface-sunken)';
const green    = 'var(--state-correct-text)';
const greenBg  = 'var(--state-correct-surface)';
const teal     = 'var(--topic-skills-text)';
const tealBg   = 'var(--topic-skills-surface)';
const blue     = 'var(--topic-assessment-text)';
const blueBg   = 'var(--topic-assessment-surface)';

const wrap = '1120px';
const supportEmail = 'lauren@nurselab.co.uk';

const sectionLabelStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

const primaryButton: CSSProperties = {
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
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap' as const,
};

const secondaryButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  background: 'transparent',
  color: ink,
  padding: '11px 24px',
  border: `0.5px solid ${border}`,
  textDecoration: 'none',
  whiteSpace: 'nowrap' as const,
};

const tagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: serif,
  fontSize: '12px',
  color: inkMid,
  background: tagBg,
  padding: '7px 14px',
  lineHeight: 1,
};

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [focused, setFocused]   = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || 'Something went wrong.'); setStatus('error'); return; }
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const inputStyle = (field: string): CSSProperties => ({
    fontFamily: serif,
    fontSize: '14px',
    color: ink,
    background: parchment,
    border: `0.5px solid ${focused === field ? 'var(--border-strong)' : border}`,
    padding: '13px 16px',
    width: '100%',
    outline: 'none',
    lineHeight: 1.6,
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s ease, background 0.15s ease',
  });

  return (
    <div style={{ background: cream, minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ padding: '128px 24px 0', borderBottom: `0.5px solid ${border}` }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>

          {/* top row: headline + meta strip */}
          <div
            className="contact-hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.1fr) minmax(300px, 0.9fr)',
              gap: '24px',
              alignItems: 'end',
              paddingBottom: '48px',
            }}
          >
            <div>
              <p style={sectionLabelStyle}>Contact</p>
              <h1
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(2.8rem, 6vw, 4.4rem)',
                  lineHeight: 1.02,
                  fontWeight: 400,
                  color: ink,
                  marginBottom: '20px',
                  maxWidth: '14ch',
                }}
              >
                Get in touch.
              </h1>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: '17px',
                  lineHeight: 1.85,
                  fontWeight: 300,
                  color: inkMid,
                  maxWidth: '560px',
                  marginBottom: '28px',
                }}
              >
                Questions about the tools, feedback on a page, broken links, or
                purchase issues all go straight to me. I read everything myself.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={`mailto:${supportEmail}`} style={primaryButton}>
                  Email Lauren →
                </a>
                <a
                  href="https://wa.me/447572650980"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={secondaryButton}
                >
                  WhatsApp →
                </a>
              </div>
            </div>

            {/* right: compact info card */}
            <div
              style={{
                border: `0.5px solid ${border}`,
                background: panel,
                padding: '28px 28px 26px',
              }}
            >
              <p style={{ ...sectionLabelStyle, marginBottom: '20px' }}>How to reach me</p>

              {[
                {
                  method: 'Email',
                  value: supportEmail,
                  note: 'Best for anything that needs a proper reply',
                  timing: 'Usually within 1–2 working days',
                  accent: inkMid,
                  accentBg: tagBg,
                  href: `mailto:${supportEmail}`,
                },
                {
                  method: 'WhatsApp',
                  value: 'Short message',
                  note: 'Quick questions only',
                  timing: 'Replies when available',
                  accent: inkMid,
                  accentBg: tagBg,
                  href: 'https://wa.me/447572650980',
                },
              ].map((item, i) => (
                <a
                  key={item.method}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="contact-method-row"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '16px 0',
                    borderTop: i === 0 ? `0.5px solid ${border}` : `0.5px solid ${border}`,
                    textDecoration: 'none',
                    color: ink,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '5px 10px',
                      fontFamily: serif,
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: item.accent,
                      background: item.accentBg,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {item.method}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: display,
                        fontSize: '15px',
                        color: ink,
                        marginBottom: '3px',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.value}
                    </p>
                    <p style={{ fontFamily: serif, fontSize: '12px', color: inkMid, fontWeight: 300, lineHeight: 1.6, marginBottom: '2px' }}>
                      {item.note}
                    </p>
                    <p style={{ fontFamily: serif, fontSize: '11px', color: inkLight, fontWeight: 300 }}>
                      {item.timing}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* proof strip */}
          <div
            className="contact-proof-strip"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
              borderTop: `0.5px solid ${border}`,
            }}
          >
            {[
              { label: 'Response time',  value: '1–2 days',   note: 'For email enquiries' },
              { label: 'Read by',        value: 'Lauren',     note: 'Every message, personally' },
              { label: 'Contact routes', value: '2',          note: 'Email or WhatsApp' },
            ].map((item, i) => (
              <div
                key={item.label}
                style={{
                  padding: '22px 0',
                  borderRight: i < 2 ? `0.5px solid ${border}` : 'none',
                  paddingLeft: i > 0 ? '28px' : '0',
                }}
              >
                <p style={{ ...sectionLabelStyle, marginBottom: '6px' }}>{item.label}</p>
                <p style={{ fontFamily: display, fontSize: '26px', color: ink, lineHeight: 1, marginBottom: '4px' }}>
                  {item.value}
                </p>
                <p style={{ fontFamily: serif, fontSize: '12px', color: inkMid, fontWeight: 300 }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content: what to contact about + form ── */}
      <section style={{ padding: '48px 24px 80px' }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <div
            className="contact-main-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 0.85fr) minmax(0, 1.15fr)',
              gap: '24px',
              alignItems: 'start',
            }}
          >

            {/* ── left col: what to get in touch about ── */}
            <div style={{ display: 'grid', gap: '16px' }}>

              {/* reasons card */}
              <div
                style={{
                  border: `0.5px solid ${border}`,
                  background: panel,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '26px 26px 0' }}>
                  <p style={sectionLabelStyle}>What to get in touch about</p>
                  <h2
                    style={{
                      fontFamily: display,
                      fontSize: '26px',
                      fontWeight: 400,
                      lineHeight: 1.15,
                      color: ink,
                      marginBottom: '6px',
                    }}
                  >
                    Everything goes to Lauren directly.
                  </h2>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      lineHeight: 1.85,
                      fontWeight: 300,
                      color: inkMid,
                      marginBottom: '22px',
                    }}
                  >
                    No support queue. No bots. Just email or a WhatsApp message.
                  </p>
                </div>

                {[
                  { num: '01', title: 'Feedback',        desc: 'A resource, tool, or page that could be better' },
                  { num: '02', title: 'Broken content',  desc: 'Links, bugs, or anything that needs updating' },
                  { num: '03', title: 'Purchase help',   desc: 'Bundle access, payments, or account questions' },
                  { num: '04', title: 'Quick question',  desc: 'Something you want to ask before buying' },
                ].map((item, i, arr) => (
                  <div
                    key={item.num}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '48px 1fr',
                      gap: '12px',
                      padding: '18px 26px',
                      borderTop: `0.5px solid ${border}`,
                      alignItems: 'start',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: display,
                        fontSize: '20px',
                        color: '#C7B8A5',
                        lineHeight: 1,
                        paddingTop: '2px',
                      }}
                    >
                      {item.num}
                    </p>
                    <div>
                      <p style={{ fontFamily: display, fontSize: '16px', color: ink, marginBottom: '3px', lineHeight: 1.3 }}>
                        {item.title}
                      </p>
                      <p style={{ fontFamily: serif, fontSize: '13px', color: inkMid, fontWeight: 300, lineHeight: 1.6 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* "I read these myself" note card */}
              <div
                style={{
                  border: `0.5px solid ${border}`,
                  background: parchment,
                  padding: '24px 26px',
                }}
              >
                <p style={sectionLabelStyle}>A note</p>
                <p
                  style={{
                    fontFamily: display,
                    fontSize: '22px',
                    fontWeight: 400,
                    lineHeight: 1.15,
                    color: ink,
                    marginBottom: '10px',
                  }}
                >
                  I read these myself.
                </p>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '13px',
                    lineHeight: 1.85,
                    fontWeight: 300,
                    color: inkMid,
                    marginBottom: '10px',
                  }}
                >
                  If something feels broken, confusing, or like something important
                  is missing — I want to know about it.
                </p>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '13px',
                    lineHeight: 1.85,
                    fontWeight: 300,
                    color: inkMid,
                  }}
                >
                  What's helping, what still feels stressful, and what you wish
                  existed usually shapes what gets built next.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '18px' }}>
                  {['Feedback welcome', 'No support queue', 'Built by Lauren'].map(tag => (
                    <span key={tag} style={tagStyle}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── right col: form ── */}
            <div
              style={{
                border: `0.5px solid ${border}`,
                background: panel,
                padding: '36px 36px 32px',
                position: 'sticky' as const,
                top: '24px',
              }}
            >
              <p style={sectionLabelStyle}>Send a message</p>
              <h2
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(1.6rem, 3vw, 2rem)',
                  fontWeight: 400,
                  lineHeight: 1.12,
                  color: ink,
                  marginBottom: '8px',
                }}
              >
                Or fill in the form.
              </h2>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: '13px',
                  lineHeight: 1.85,
                  fontWeight: 300,
                  color: inkMid,
                  marginBottom: '28px',
                }}
              >
                I'll reply to the email address you leave here. If something looks
                wrong on a page, a screenshot or the exact URL helps a lot.
              </p>

              {/* divider */}
              <div style={{ height: '1px', background: border, marginBottom: '28px' }} />

              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      background: greenBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p style={{ fontFamily: display, fontSize: '24px', color: ink, marginBottom: '10px', lineHeight: 1.2 }}>
                    Thanks. I'll reply as soon as I can.
                  </p>
                  <p style={{ fontFamily: serif, fontSize: '13px', color: inkMid, fontWeight: 300, marginBottom: '20px', lineHeight: 1.8 }}>
                    I'll reply to the email address you used here.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      color: inkMid,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>

                  {/* name + email row */}
                  <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label
                        htmlFor="name"
                        style={{ ...sectionLabelStyle, display: 'block', marginBottom: '8px' }}
                      >
                        Name
                      </label>
                      <input
                        id="name" name="name" type="text"
                        value={form.name} onChange={handleChange}
                        onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                        placeholder="Your name"
                        required
                        style={inputStyle('name')}
                        className="contact-input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        style={{ ...sectionLabelStyle, display: 'block', marginBottom: '8px' }}
                      >
                        Email
                      </label>
                      <input
                        id="email" name="email" type="email"
                        value={form.email} onChange={handleChange}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                        placeholder="your@email.com"
                        required
                        style={inputStyle('email')}
                        className="contact-input"
                      />
                    </div>
                  </div>

                  {/* subject */}
                  <div style={{ marginBottom: '14px' }}>
                    <label
                      htmlFor="subject"
                      style={{ ...sectionLabelStyle, display: 'block', marginBottom: '8px' }}
                    >
                      Subject{' '}
                      <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      id="subject" name="subject" type="text"
                      value={form.subject} onChange={handleChange}
                      onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)}
                      placeholder="What's it about?"
                      style={inputStyle('subject')}
                      className="contact-input"
                    />
                  </div>

                  {/* message */}
                  <div style={{ marginBottom: '24px' }}>
                    <label
                      htmlFor="message"
                      style={{ ...sectionLabelStyle, display: 'block', marginBottom: '8px' }}
                    >
                      Message
                    </label>
                    <textarea
                      id="message" name="message"
                      value={form.message} onChange={handleChange}
                      onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                      placeholder="What's on your mind? If something looks broken, the page URL or exact wording helps."
                      required maxLength={2000} rows={6}
                      style={{ ...inputStyle('message'), resize: 'vertical', minHeight: '140px' }}
                      className="contact-input"
                    />
                    <p style={{ fontFamily: serif, fontSize: '12px', color: inkLight, textAlign: 'right', marginTop: '6px' }}>
                      {form.message.length} / 2000
                    </p>
                  </div>

                  {status === 'error' && (
                    <div
                      style={{
                        padding: '14px 16px',
                        background: 'var(--state-incorrect-surface)',
                        border: '0.5px solid #E1B1B1',
                        marginBottom: '20px',
                      }}
                    >
                      <p style={{ fontFamily: serif, fontSize: '13px', color: '#B05A5A', margin: 0 }}>
                        {errorMsg}
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      style={{
                        ...primaryButton,
                        background: status === 'loading' ? '#C9C1B5' : ink,
                        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      }}
                      className="contact-submit"
                    >
                      {status === 'loading' ? 'Sending…' : 'Send message →'}
                    </button>
                    <span style={{ ...tagStyle, background: greenBg, color: green }}>
                      Replies within 1–2 days
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>


      <style>{`
        .contact-input::placeholder {
          color: var(--border-strong);
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .contact-input:focus {
          background: var(--surface-raised) !important;
        }

        .contact-method-row {
          transition: opacity 0.15s ease;
        }
        .contact-method-row:hover {
          opacity: 0.75;
        }

        .contact-submit:not(:disabled):hover {
          transform: translateY(-1px);
          transition: transform 0.18s ease, background 0.18s ease;
        }

        @media (max-width: 900px) {
          .contact-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-main-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-proof-strip {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 580px) {
          .contact-form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
