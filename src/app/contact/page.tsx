'use client';

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

const textLink: CSSProperties = {
  fontFamily: serif,
  fontSize: '15px',
  color: ink,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
};

export default function ContactPage() {
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

      <section style={{ padding: '0 24px 88px' }}>
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
        }
      `}</style>
    </div>
  );
}
