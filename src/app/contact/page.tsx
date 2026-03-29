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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace this with your real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Contact form submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditorialLayout
      kicker="Contact"
      title="Get in Touch"
      standfirst="Questions about the bundle, support, content updates, or feedback — send a message and I’ll get back to you."
      byline="Revision Foundations"
      backHref="/dashboard"
      backLabel="Back to Dashboard"
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
                  Thanks for getting in touch
                </h2>
                <p className="mt-2 text-[var(--plum-dark)]/70">
                  Your message has been received. I usually reply within 1–2 working days.
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
                  Use the form below for support, feedback, business enquiries, or to suggest a topic.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-[var(--plum-dark)]"
                    >
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
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-[var(--plum-dark)]"
                    >
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
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-[var(--plum-dark)]"
                  >
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
                    <option value="general">General question</option>
                    <option value="support">Technical support</option>
                    <option value="content">Content update / correction</option>
                    <option value="billing">Billing / refund</option>
                    <option value="business">Business enquiry</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-[var(--plum-dark)]"
                  >
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
          <div className="bg-white rounded-2xl shadow p-6">
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

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-[var(--plum-dark)]">
              Support notes
            </h3>
            <ul className="mt-3 space-y-3 text-sm text-[var(--plum-dark)]/70">
              <li>Replies usually within 1–2 working days</li>
              <li>Use this page for support, corrections, or feedback</li>
              <li>For urgent account issues, include the email used at checkout</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-[var(--plum-dark)]">
              Common questions
            </h3>
            <div className="mt-4 space-y-4 text-sm text-[var(--plum-dark)]/70">
              <div>
                <p className="font-medium text-[var(--plum-dark)]">
                  Do I get lifetime access?
                </p>
                <p className="mt-1">Yes — the bundle is a one-time payment with future updates included.</p>
              </div>
              <div>
                <p className="font-medium text-[var(--plum-dark)]">
                  Can I suggest a topic?
                </p>
                <p className="mt-1">Yes — feedback and topic requests are always welcome.</p>
              </div>
              <div>
                <p className="font-medium text-[var(--plum-dark)]">
                  Can I report an error?
                </p>
                <p className="mt-1">Absolutely. If you spot something outdated or incorrect, please send it over.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </EditorialLayout>
  );
}
