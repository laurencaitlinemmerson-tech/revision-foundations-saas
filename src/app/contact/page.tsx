'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MessageCircle, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const serif = "'Source Serif 4', Georgia, serif";
const display = "'Playfair Display', Georgia, serif";

const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';
const cream = '#F9F6F0';
const parchment = '#F3EEE4';
const paper = '#F7F2E8';
const border = '#D9D0C1';
const softLine = 'rgba(217, 208, 193, 0.7)';

const sectionLabel: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '16px',
};

const body: CSSProperties = {
  fontFamily: serif,
  fontSize: '16px',
  lineHeight: 2,
  fontWeight: 300,
  color: inkMid,
};

const textLink: CSSProperties = {
  fontFamily: serif,
  fontSize: '15px',
  color: ink,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
};

const editorialCard: CSSProperties = {
  border: `1px solid ${border}`,
  borderRadius: '34px',
  overflow: 'hidden',
};

const inputBase: CSSProperties = {
  fontFamily: serif,
  fontSize: '15px',
  color: ink,
  background: cream,
  border: `1px solid ${border}`,
  borderRadius: '12px',
  padding: '13px 16px',
  width: '100%',
  outline: 'none',
  lineHeight: 1.6,
  boxSizing: 'border-box',
};

const labelStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '12px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: inkLight,
  display: 'block',
  marginBottom: '8px',
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const inputStyle = (field: string): CSSProperties => ({
    ...inputBase,
    borderColor: focused === field ? '#B8AD9E' : border,
    transition: 'border-color 0.15s ease',
  });

  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      <section className="contact-hero" style={{ padding: '132px 24px 54px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <p style={sectionLabel}>Contact</p>

          <h1
            style={{
              fontFamily: display,
              fontSize: 'clamp(2.8rem, 6vw, 4.4rem)',
              lineHeight: 1.02,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: ink,
              marginBottom: '20px',
              maxWidth: '620px',
            }}
          >
            Say hello.
          </h1>

          <p
            style={{
              ...body,
              fontSize: '18px',
              maxWidth: '620px',
              marginBottom: '18px',
            }}
          >
            Whether it&apos;s a question about the tools, feedback on something that
            could be better, or just a quick hello — I read everything and reply
            as soon as I can.
          </p>

          <a href="mailto:lauren@revisionfoundations.com" style={textLink}>
            lauren@revisionfoundations.com
          </a>
        </div>
      </section>

      {/* Contact method cards */}
      <section style={{ padding: '0 24px 52px' }}>
        <div className="contact-layout" style={{ maxWidth: '920px', margin: '0 auto' }}>
          <a
            href="mailto:lauren@revisionfoundations.com"
            className="contact-panel contact-panel-main"
            style={{ textDecoration: 'none' }}
          >
            <div className="contact-icon-wrap">
              <Mail style={{ width: '18px', height: '18px', color: inkMid }} />
            </div>

            <p style={{ ...sectionLabel, marginBottom: '14px' }}>Email</p>

            <p
              style={{
                fontFamily: display,
                fontSize: 'clamp(1.45rem, 3vw, 2.1rem)',
                lineHeight: 1.12,
                color: ink,
                marginBottom: '14px',
                wordBreak: 'break-word',
              }}
            >
              lauren@revisionfoundations.com
            </p>

            <p style={{ ...body, fontSize: '15px', marginBottom: '22px', maxWidth: '460px' }}>
              Best for feedback, questions about the resources, or anything that
              needs a proper reply.
            </p>

            <span className="contact-cta">
              Send an email <ArrowRight style={{ width: '14px', height: '14px' }} />
            </span>
          </a>

          <a
            href="https://wa.me/447572650980"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-panel contact-panel-side"
            style={{ textDecoration: 'none' }}
          >
            <div className="contact-icon-wrap">
              <MessageCircle style={{ width: '18px', height: '18px', color: inkMid }} />
            </div>

            <p style={{ ...sectionLabel, marginBottom: '14px' }}>WhatsApp</p>

            <p
              style={{
                fontFamily: display,
                fontSize: 'clamp(1.35rem, 2.5vw, 1.8rem)',
                lineHeight: 1.12,
                color: ink,
                marginBottom: '14px',
              }}
            >
              Quick message
            </p>

            <p style={{ ...body, fontSize: '15px', marginBottom: '22px' }}>
              Better for something short, quick, or easy to answer in a few
              messages.
            </p>

            <span className="contact-cta">
              Message on WhatsApp <ArrowRight style={{ width: '14px', height: '14px' }} />
            </span>
          </a>
        </div>
      </section>

      {/* Contact form */}
      <section style={{ padding: '0 24px 76px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={{ ...editorialCard, background: cream }}>
            <div style={{ padding: '48px 44px 52px' }} className="contact-form-padding">
              <p style={sectionLabel}>Send a message</p>

              <p
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                  lineHeight: 1.12,
                  color: ink,
                  marginBottom: '8px',
                  maxWidth: '560px',
                }}
              >
                Prefer to write it here?
              </p>

              <p style={{ ...body, fontSize: '15px', maxWidth: '540px', marginBottom: '36px' }}>
                Fill in the form below and I&apos;ll get back to you by email.
              </p>

              {status === 'success' ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '48px 24px',
                  gap: '16px',
                }}>
                  <CheckCircle style={{ width: '40px', height: '40px', color: '#7A9E7E' }} />
                  <p style={{
                    fontFamily: display,
                    fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                    color: ink,
                    lineHeight: 1.2,
                  }}>
                    Message sent!
                  </p>
                  <p style={{ ...body, fontSize: '15px', maxWidth: '400px' }}>
                    Thanks for getting in touch. I&apos;ll reply to your email as soon as I can.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    style={{
                      fontFamily: serif,
                      fontSize: '14px',
                      color: inkMid,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '8px',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label htmlFor="name" style={labelStyle}>Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        placeholder="Your name"
                        required
                        style={inputStyle('name')}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" style={labelStyle}>Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        placeholder="your@email.com"
                        required
                        style={inputStyle('email')}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="subject" style={labelStyle}>
                      Subject <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: '11px', color: inkLight }}>(optional)</span>
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      onFocus={() => setFocused('subject')}
                      onBlur={() => setFocused(null)}
                      placeholder="What's it about?"
                      style={inputStyle('subject')}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="message" style={labelStyle}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      placeholder="What's on your mind?"
                      required
                      rows={6}
                      style={{
                        ...inputStyle('message'),
                        resize: 'vertical',
                        minHeight: '140px',
                      }}
                    />
                    <p style={{
                      fontFamily: serif,
                      fontSize: '12px',
                      color: inkLight,
                      marginTop: '6px',
                      textAlign: 'right',
                    }}>
                      {form.message.length}/2000
                    </p>
                  </div>

                  {status === 'error' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      background: '#FDF0EF',
                      border: '1px solid #EAC4C1',
                      borderRadius: '10px',
                      marginBottom: '20px',
                    }}>
                      <AlertCircle style={{ width: '16px', height: '16px', color: '#C0534F', flexShrink: 0 }} />
                      <p style={{ fontFamily: serif, fontSize: '14px', color: '#C0534F', margin: 0 }}>
                        {errorMsg}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      fontFamily: serif,
                      fontSize: '15px',
                      color: cream,
                      background: status === 'loading' ? inkLight : ink,
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px 28px',
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s ease',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {status === 'loading' ? 'Sending…' : (
                      <>Send message <ArrowRight style={{ width: '14px', height: '14px' }} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* A note */}
      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div className="contact-note">
            <div style={{ maxWidth: '620px' }}>
              <p style={sectionLabel}>A note</p>

              <p
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(1.7rem, 3.5vw, 2.3rem)',
                  lineHeight: 1.12,
                  color: ink,
                  marginBottom: '14px',
                }}
              >
                This isn&apos;t a faceless support inbox.
              </p>

              <p style={{ ...body, marginBottom: '18px' }}>
                It&apos;s just me — Lauren. I built all of this, so if something feels
                broken, confusing, or like something&apos;s missing, I genuinely want
                to know.
              </p>

              <p style={{ ...body }}>
                I also just like hearing from people who use it. Makes the late
                nights worth it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(260px, 0.75fr);
          gap: 18px;
          align-items: start;
        }

        .contact-panel {
          display: block;
          border: 1px solid ${border};
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .contact-panel:hover {
          border-color: #B8AD9E;
          transform: translateY(-1px);
        }

        .contact-panel-main {
          background: ${parchment};
          border-radius: 38px;
          padding: 40px 38px 42px;
        }

        .contact-panel-side {
          background: ${paper};
          border-radius: 30px;
          padding: 34px 30px 36px;
        }

        .contact-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: 999px;
          background: ${cream};
          border: 1px solid ${softLine};
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .contact-cta {
          font-family: ${serif};
          font-size: 14px;
          color: ${ink};
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .contact-note {
          border-top: 1px solid ${softLine};
          padding-top: 34px;
        }

        .contact-form-row {
          grid-template-columns: 1fr 1fr;
        }

        input::placeholder,
        textarea::placeholder {
          color: #B8AD9E;
          font-family: 'Source Serif 4', Georgia, serif;
        }

        input:focus,
        textarea:focus {
          outline: none;
        }

        @media (max-width: 768px) {
          .contact-hero {
            padding-top: 108px !important;
            padding-bottom: 42px !important;
          }

          .contact-layout {
            grid-template-columns: 1fr;
          }

          .contact-panel-main,
          .contact-panel-side {
            padding: 30px 24px 32px;
            border-radius: 26px;
          }

          .contact-form-row {
            grid-template-columns: 1fr !important;
          }

          .contact-form-padding {
            padding: 32px 24px 36px !important;
          }
        }
      `}</style>
    </div>
  );
}
