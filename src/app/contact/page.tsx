'use client';

import { useState } from 'react';
import EditorialLayout from '@/components/EditorialLayout';
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
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
    <EditorialLayout
      kicker="Contact"
      title="We’d love to hear from you"
      standfirst="Whether you have questions, feedback, or want to suggest a topic, we’re here to help."
      byline="Revision Foundations"
      backHref="/"
      backLabel="Back to Home"
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="bg-white rounded-2xl shadow p-6 md:p-8">
          {submitted ? (
            <div className="flex flex-col items-start gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                <CheckCircle className="h-4 w-4" />
                Message sent
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--plum-dark)]">
                  Thanks for reaching out!
                </h2>
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
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[var(--plum-dark)]">
                  Send a message
                </h2>
                <p className="mt-2 text-sm text-[var(--plum-dark)]/70">
                  Need help, want to leave feedback, or have a question? Please use the form below.
                </p>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
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
                    placeholder="How can I help?"
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
            </>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[var(--purple)]/10 p-2">
                <Mail className="h-5 w-5 text-[var(--purple)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--plum-dark)]">
                  Email support
                </h3>
                <p className="mt-2 text-sm text-[var(--plum-dark)]/70">
                  Prefer email? You can reach me directly at:
                </p>
                <a
                  href="mailto:hello@revisionfoundations.com"
                  className="mt-3 inline-block text-sm font-medium text-[var(--purple)] hover:underline"
                >
                  hello@revisionfoundations.com
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </EditorialLayout>
  );
}
