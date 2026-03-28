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
      `User ID: ${isSignedIn ? user?.id : 'Guest'}\n`
    );
    // ...rest of logic...
  };

  return (
    <EditorialLayout
      kicker="Delete Data"
      title="Request Data Deletion"
      standfirst="You can request deletion of your account and all associated data here."
      byline="Revision Foundations"
      backHref="/dashboard"
      backLabel="Back to Dashboard"
    >
      <main className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="ed-card p-6 mb-8">
            <h2 className="text-lg font-semibold mb-2">How to Request Deletion</h2>
            <ul className="list-disc pl-6 text-[var(--plum-dark)]/70">
              <li className="mb-2">Email us at <a href="mailto:hello@revisionfoundations.com" className="text-[var(--purple)] hover:underline">hello@revisionfoundations.com</a></li>
              <li className="mb-2">Include your account email address</li>
              <li className="mb-2">We’ll confirm deletion within 7 days</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="ed-card p-6 space-y-6">
            {!isSignedIn && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--plum-dark)] mb-1">Your Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded border border-[var(--lilac-medium)] focus:ring-[var(--lavender)]"
                />
              </div>
            )}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-[var(--plum-dark)] mb-1">Reason (optional)</label>
              <textarea
                id="reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded border border-[var(--lilac-medium)] focus:ring-[var(--lavender)]"
              />
            </div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
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
          <p className="text-center text-sm text-[var(--plum-dark)]/50 mt-6">
            Questions? <Link href="/contact" className="text-[var(--purple)] hover:underline">Contact me</Link> instead.
          </p>
        </div>
      </main>
    </EditorialLayout>
  );
}
