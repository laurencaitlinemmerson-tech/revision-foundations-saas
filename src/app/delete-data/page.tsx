'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Trash2, ArrowLeft, Send, Loader2, AlertTriangle } from 'lucide-react';

export default function DeleteDataPage() {
  const { user, isSignedIn } = useUser();
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;

    setLoading(true);

    // In a real app, you'd send this to an API endpoint
    // For now, we'll open an email with the request
    const userEmail = isSignedIn ? user?.primaryEmailAddress?.emailAddress : email;
    const subject = encodeURIComponent('Data Deletion Request');
    const body = encodeURIComponent(
      `Data Deletion Request\n\n` +
      `Email: ${userEmail}\n` +
      `User ID: ${isSignedIn ? user?.id : 'Guest'}\n` +
      `Reason: ${reason || 'Not specified'}\n\n` +
      `Please delete all my data from Revision Foundations.`
    );

    window.location.href = `mailto:lauren@revisionfoundations.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main className="pt-28 pb-20 px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="card">
              <div className="text-5xl mb-4">📧</div>
              <h1 className="text-xl mb-3">Request Submitted</h1>
              <p className="text-[var(--plum-dark)]/70 mb-6">
                Your email app should have opened with the deletion request. Send that email and I'll process your request within 7 days.
              </p>
              <p className="text-sm text-[var(--plum-dark)]/50 mb-6">
                If your email didn't open, please email lauren@revisionfoundations.com directly.
              </p>
              <Link href="/" className="btn-secondary">
                <ArrowLeft className="w-4 h-4" />
                Back Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/privacy" className="text-sm text-[var(--purple)] hover:underline inline-flex items-center gap-1 mb-4">
              <ArrowLeft className="w-3 h-3" />
              Back to Privacy Policy
            </Link>
            <h1 className="mb-2">Delete Your Data</h1>
            <p className="text-[var(--plum-dark)]/70">
              Request deletion of all your personal data
            </p>
          </div>

          {/* Warning Card */}
          <div className="card bg-amber-50 border-amber-200 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Before you continue</h3>
                <p className="text-sm text-amber-700">
                  This will permanently delete all your data including:
                </p>
                <ul className="text-sm text-amber-700 mt-2 space-y-1">
                  <li>• Your account and profile information</li>
                  <li>• Purchase history and access to tools</li>
                  <li>• Any progress or saved data</li>
                </ul>
                <p className="text-sm text-amber-700 mt-2 font-medium">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email - only show if not signed in */}
              {!isSignedIn ? (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--plum)] mb-2">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter the email you used"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--lilac-medium)] bg-white focus:border-[var(--lavender)] focus:outline-none transition"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[var(--lilac-soft)]">
                  <p className="text-sm text-[var(--plum)]">
                    Signed in as: <strong>{user?.primaryEmailAddress?.emailAddress}</strong>
                  </p>
                </div>
              )}

              {/* Reason (optional) */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-[var(--plum)] mb-2">
                  Reason for deletion <span className="text-[var(--plum-dark)]/50">(optional)</span>
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Help me improve - why are you leaving?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--lilac-medium)] bg-white focus:border-[var(--lavender)] focus:outline-none transition resize-none"
                />
              </div>

              {/* Confirmation checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirm"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[var(--lilac-medium)] text-[var(--purple)] focus:ring-[var(--lavender)]"
                />
                <label htmlFor="confirm" className="text-sm text-[var(--plum-dark)]/80">
                  I understand that this will permanently delete all my data and I will lose access to any purchased tools. This cannot be undone.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !confirmed || (!isSignedIn && !email)}
                className="w-full py-3 px-6 rounded-full font-semibold transition-all flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Request Data Deletion
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Help text */}
          <p className="text-center text-sm text-[var(--plum-dark)]/50 mt-6">
            Questions? <Link href="/contact" className="text-[var(--purple)] hover:underline">Contact me</Link> instead.
          </p>
        </div>
      </main>
    </div>
  );
}
