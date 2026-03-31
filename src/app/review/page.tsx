'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Star, Send, ArrowLeft, Loader2 } from 'lucide-react';

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
                Your review has been submitted. It will appear on the site once I have had a
                chance to read it!
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
          {/* Intro Section */}
          <div className="text-center mb-8">
            <h2 className="text-xl mb-3">Why Leave a Review?</h2>
            <p className="text-[var(--plum-dark)]/70 mb-6">
              The Nurse Lab helps student nurses prepare for OSCEs and exams with focused tools, practice questions, and feedback. If you’ve used the platform, please share what helped most.
            </p>
          </div>

          {/* Product/Service Highlights */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[var(--plum)] mb-4">Why Choose The Nurse Lab?</h2>
            <ul className="list-inside list-disc space-y-2 text-[var(--plum-dark)]/70">
              <li>Trusted by nursing students for OSCE success</li>
              <li>Practice materials aligned with current exam standards</li>
              <li>Easy-to-use interface and explanations</li>
            </ul>
          </div>

          {/* Call to Action - Top */}
          <div className="text-center mb-8">
            <Link href="/reviews" className="btn-primary">
              See Full Reviews
            </Link>
          </div>

          {/* Existing Reviews (Social Proof) */}
          <div className="mb-6 text-center">
            <h2 className="text-lg font-medium text-[var(--plum)]">What Others Are Saying</h2>
            <p className="text-sm text-gray-500">Average Rating: 4.8/5 from recent reviews</p>
            <div className="mt-4 space-y-4">
              {/* Sample Reviews */}
              {[
                { name: 'Sarah', review: 'This tool helped me immensely with my OSCE prep. Highly recommend!', rating: 5, date: 'March 2026', location: 'UK' },
                { name: 'Emily', review: 'Great resources! Simple to follow and very effective.', rating: 4, date: 'February 2026', location: 'USA' },
                { name: 'John', review: 'Helpful, but some areas could use more explanation.', rating: 3, date: 'January 2026', location: 'Canada' },
              ].map(({ name, review, rating, date, location }, idx) => (
                <div key={idx} className="p-4 border border-[var(--lilac-medium)] rounded-lg">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-4 h-4 ${starIdx < rating ? 'fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">{rating}★</span>
                  </div>
                  <blockquote className="text-[var(--plum-dark)]/80 mt-2">"{review}"</blockquote>
                  <p className="text-sm text-[var(--plum-dark)]/50 mt-2">
                    — {name}, {location}, {date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card" id="review-form">
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
                disabled={loading || !name || !text || rating === 0}
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

          {/* Call to Action - Bottom */}
          <div className="text-center mt-8">
            <button
              onClick={() => document.getElementById("review-form").scrollIntoView()}
              className="btn-primary"
            >
              Submit Your Feedback
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
