'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Star, Send, ArrowLeft, Heart, Loader2 } from 'lucide-react';

export default function ReviewPage() {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text, rating }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main className="pt-28 pb-20 px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="card">
              <div className="text-6xl mb-4">💜</div>
              <h1 className="text-2xl mb-3">Thank you!</h1>
              <p className="text-[var(--plum-dark)]/70 mb-6">
                Your review has been submitted. It'll appear on the site once I've had a chance to read it!
              </p>
              <Link href="/" className="btn-primary">
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
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">✨</div>
            <h1 className="mb-2">Leave a Review</h1>
            <p className="text-[var(--plum-dark)]/70">
              Loved the tools? Your feedback means the world!
            </p>
          </div>

          {/* Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-[var(--plum)] mb-2">
                  Your Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--plum)] mb-2">
                  Your First Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah"
                  maxLength={50}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--lilac-medium)] bg-white focus:border-[var(--lavender)] focus:outline-none transition"
                />
              </div>

              {/* Review Text */}
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-[var(--plum)] mb-2">
                  Your Review
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What did you love about the tools?"
                  maxLength={500}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--lilac-medium)] bg-white focus:border-[var(--lavender)] focus:outline-none transition resize-none"
                />
                <p className="text-xs text-[var(--plum-dark)]/50 mt-1 text-right">
                  {text.length}/500
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !name || !text}
                className="btn-primary w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Back link */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-[var(--plum-dark)]/60 hover:text-[var(--purple)] inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Back home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
