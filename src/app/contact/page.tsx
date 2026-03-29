'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';

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

const editorialCard: CSSProperties = {
  border: `1px solid ${border}`,
  borderRadius: '34px',
  background: parchment,
  overflow: 'hidden',
};

const noteCard: CSSProperties = {
  border: `1px solid ${border}`,
  borderRadius: '30px',
  background: paper,
};

export default function ContactPage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section className="contact-hero" style={{ padding: '132px 24px 72px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <p style={sectionLabel}>Contact</p>

          <h1
            style={{
              fontFamily: display,
              fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
              lineHeight: 1.02,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: ink,
              marginBottom: '22px',
            }}
          >
            Say hello.
          </h1>

          <p
            style={{
              ...body,
              fontSize: '18px',
              maxWidth: '560px',
              marginBottom: '0',
            }}
          >
            Whether it's a question about the tools, feedback on something that
            could be better, or just a quick hello — I read everything and reply
            as soon as I can.
          </p>
        </div>
      </section>

      {/* Contact methods */}
      <section style={{ padding: '0 24px 76px' }}>
        <div className="contact-cards-grid" style={{ maxWidth: '920px', margin: '0 auto' }}>
          {/* Email card */}
          <a
            href="mailto:hello@revisionfoundations.com"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div className="contact-card-hover" style={{ ...editorialCard, background: parchment, padding: '38px 36px 40px', cursor: 'pointer', transition: 'border-color 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: cream,
                  border: `1px solid ${softLine}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Mail style={{ width: '18px', height: '18px', color: inkMid }} />
                </div>
                <p style={{ ...sectionLabel, marginBottom: '0' }}>Email</p>
              </div>

              <p
                className="contact-email-heading"
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(1.2rem, 2.8vw, 1.8rem)',
                  lineHeight: 1.15,
                  color: ink,
                  marginBottom: '12px',
                  wordBreak: 'break-word',
                }}
              >
                hello@revisionfoundations.com
              </p>

              <p style={{ ...body, fontSize: '15px', marginBottom: '20px', maxWidth: '420px' }}>
                Best for feedback, questions about the resources, or anything
                that needs a proper reply.
              </p>

              <span style={{
                fontFamily: serif,
                fontSize: '14px',
                color: ink,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                Send an email <ArrowRight style={{ width: '14px', height: '14px' }} />
              </span>
            </div>
          </a>

          {/* WhatsApp card */}
          <a
            href="https://wa.me/447572650980"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div className="contact-card-hover" style={{ ...noteCard, padding: '38px 36px 40px', cursor: 'pointer', transition: 'border-color 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: cream,
                  border: `1px solid ${softLine}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <MessageCircle style={{ width: '18px', height: '18px', color: inkMid }} />
                </div>
                <p style={{ ...sectionLabel, marginBottom: '0' }}>WhatsApp</p>
              </div>

              <p
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                  lineHeight: 1.15,
                  color: ink,
                  marginBottom: '12px',
                }}
              >
                Quick message
              </p>

              <p style={{ ...body, fontSize: '15px', marginBottom: '20px', maxWidth: '420px' }}>
                If you prefer something quicker or just want to ask something
                short. Usually reply within a few hours.
              </p>

              <span style={{
                fontFamily: serif,
                fontSize: '14px',
                color: ink,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                Message on WhatsApp <ArrowRight style={{ width: '14px', height: '14px' }} />
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* Small note */}
      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div
            style={{
              ...editorialCard,
              background: cream,
            }}
          >
            <div style={{ padding: '38px 36px 40px' }}>
              <p style={sectionLabel}>A note</p>

              <p
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                  lineHeight: 1.12,
                  color: ink,
                  marginBottom: '14px',
                  maxWidth: '560px',
                }}
              >
                This isn't a faceless support inbox.
              </p>

              <p style={{ ...body, maxWidth: '600px', marginBottom: '18px' }}>
                It's just me — Lauren. I built all of this, so if something's
                broken, confusing, or you think something's missing, I genuinely
                want to know.
              </p>

              <p style={{ ...body, maxWidth: '600px' }}>
                I also just like hearing from people who use it. Makes the late
                nights worth it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .contact-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .contact-card-hover:hover {
          border-color: #B8AD9E !important;
        }
        @media (max-width: 640px) {
          .contact-cards-grid {
            grid-template-columns: 1fr;
          }
          .contact-hero {
            padding-top: 108px !important;
          }
        }
      `}</style>
    </div>
  );
}
