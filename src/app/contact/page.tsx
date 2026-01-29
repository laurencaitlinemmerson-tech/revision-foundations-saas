'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Send, Loader2, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

export default function ContactPage() {
  useScrollAnimation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    // In production, this would send to an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Compact Hero */}
      <section className="pt-28 pb-8 bg-gradient-to-b from-[var(--lilac-soft)] to-cream">
        <div className="max-w-4xl mx-auto px-6">
          <div className="hero-center">
            <h1 className="animate-on-scroll hero-title mb-2">
              <span className="gradient-text">Get in Touch</span> 💬
            </h1>
            <p className="animate-on-scroll text-[var(--plum)] text-lg">
              Have a question or feedback? We&apos;d love to hear from you
            </p>
          </div>
        </div>
      </section>

      <main className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          {submitted ? (
            /* Success Message */
            <div className="card p-8 text-center animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-[var(--plum)] mb-2">
                Message Sent!
              </h2>
              <p className="text-[var(--plum-dark)]/70 mb-6">
                Thanks for reaching out. We&apos;ll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* Contact Form */
            <div className="card p-8 animate-on-scroll">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[var(--plum-text)] mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--glass-border)] bg-white focus:border-[var(--lavender-primary)] focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[var(--plum-text)] mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--glass-border)] bg-white focus:border-[var(--lavender-primary)] focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[var(--plum-text)] mb-2"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--glass-border)] bg-white focus:border-[var(--lavender-primary)] focus:outline-none transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Enquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="refund">Refund Request</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[var(--plum-text)] mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--glass-border)] bg-white focus:border-[var(--lavender-primary)] focus:outline-none transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient w-full justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Alternative Contact */}
          <div className="mt-8 text-center">
            <p className="text-[var(--plum-text)]/70 mb-2">
              Prefer email? Reach us directly at:
            </p>
            <a
              href="mailto:hello@revisionfoundations.com"
              className="inline-flex items-center gap-2 text-[var(--lavender-primary)] font-medium hover:underline"
            >
              <Mail className="w-4 h-4" />
              lauren@revisionfoundations.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
