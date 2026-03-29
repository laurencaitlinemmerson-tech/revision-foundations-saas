'use client';  // Add this line to mark the component as a client component

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Send, Loader2, CheckCircle, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// If you don't need the CSS module, remove this import and apply styles inline
// import styles from './contact.module.css';

const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';
const cream = '#F9F6F0';
const border = '#D9D0C1';
const green = '#1E8A4D';
const greenBg = '#E6F4EA';

const sectionLabelStyle = {
  fontFamily: "'Source Serif 4', Georgia, serif",
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

const primaryButton = {
  display: 'inline-block',
  fontFamily: "'Source Serif 4', Georgia, serif",
  fontSize: '14px',
  fontWeight: 400,
  background: ink,
  color: cream,
  padding: '12px 24px',
  borderRadius: '9999px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const secondaryButton = {
  display: 'inline-block',
  fontFamily: "'Source Serif 4', Georgia, serif",
  fontSize: '14px',
  fontWeight: 400,
  background: 'transparent',
  color: ink,
  padding: '11px 24px',
  borderRadius: '9999px',
  border: `1px solid ${border}`,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitted(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setLoading(false);

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="contactPage"> {/* Replace with your own layout if not using CSS module */}
      <Navbar />
      <section className="contactSection"> {/* Replace with your own layout if not using CSS module */}
        <div className="wrap"> {/* Replace with your own layout if not using CSS module */}
          <p style={sectionLabelStyle}>Get in touch</p>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: ink,
              marginBottom: '32px',
            }}
          >
            We’d love to hear from you.
          </h2>

          <div className="contactFormContainer"> {/* Replace with your own layout if not using CSS module */}
            {submitted ? (
              <div className="flex flex-col items-start gap-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Message sent
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[var(--plum-dark)]">Thanks for reaching out!</h3>
                  <p className="mt-2 text-[var(--plum-dark)]/70">
                    We’ve received your message and will get back to you within 1–2 working days.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center rounded-xl bg-[var(--purple)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--plum-dark)]">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[var(--plum-dark)]/15 px-4 py-3 text-sm outline-none transition focus:border-[var(--purple)] focus:ring-2 focus:ring-[var(--purple)]/10"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--plum-dark)]">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[var(--plum-dark)]/15 px-4 py-3 text-sm outline-none transition focus:border-[var(--purple)] focus:ring-2 focus:ring-[var(--purple)]/10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-[var(--plum-dark)]">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[var(--plum-dark)]/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--purple)] focus:ring-2 focus:ring-[var(--purple)]/10"
                  >
                    <option value="">Select a subject</option>
                    <option value="General question">General question</option>
                    <option value="Technical support">Technical support</option>
                    <option value="Content update">Content update</option>
                    <option value="Billing / refund">Billing / refund</option>
                    <option value="Business enquiry">Business enquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-[var(--plum-dark)]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[var(--plum-dark)]/15 px-4 py-3 text-sm outline-none transition focus:border-[var(--purple)] focus:ring-2 focus:ring-[var(--purple)]/10"
                    placeholder="How can we help?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--purple)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="contactInfo">
            <p style={sectionLabelStyle}>Get in Touch</p>
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                fontWeight: 400,
                color: ink,
                marginBottom: '24px',
              }}
            >
              We are here to help.
            </h3>
            <div className="contactButtons">
              <Link href="mailto:hello@revisionfoundations.com" style={primaryButton}>
                Email Us
              </Link>
              <Link href="https://wa.me/07572650980" style={secondaryButton}>
                Prefer to chat? Message me instead
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
