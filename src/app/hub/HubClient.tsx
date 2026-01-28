'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Sparkles, BookOpen, FileText, Crown, Heart } from 'lucide-react';

type Product = 'osce' | 'quiz' | 'bundle';

interface Entitlement {
  product: Product;
  status: string;
}

export default function HubClient() {
  const { user, isLoaded } = useUser();
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    fetch('/api/entitlements/check')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (data.entitlements) {
          setEntitlements(data.entitlements);
        }
        setError(false);
      })
      .catch((err) => {
        console.error('Entitlements error:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [isLoaded, user]);

  const hasProduct = (product: Product) => {
    return entitlements.some((e) => e.product === product && e.status === 'active');
  };

  const hasAnyAccess = hasProduct('osce') || hasProduct('quiz') || hasProduct('bundle');

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-purple-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
          <div className="text-center max-w-lg mx-auto px-6">
            <div className="text-4xl mb-6">🔒</div>
            <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
            <p className="mb-8">Sign in to access your revision tools.</p>
            <Link href="/sign-in" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Your Dashboard</h1>
            <p className="text-xl">Hey {user.firstName || 'there'}! Ready to revise?</p>
          </div>

          {error && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8 text-center">
              <p className="text-yellow-800 mb-4">Unable to load your entitlements. You can still try the tools!</p>
            </div>
          )}

          {!hasAnyAccess && !error && (
            <div className="text-center mb-12 p-8 bg-white rounded-2xl">
              <div className="text-4xl mb-4">🎁</div>
              <h2 className="text-2xl mb-4">Ready to Get Started?</h2>
              <p className="mb-6">Unlock both OSCE and Quiz tools for just £9.99 one-time.</p>
              <Link href="/pricing" className="btn-primary">
                View Pricing
              </Link>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" />
                <h3 className="text-xl font-bold">Children's OSCE Tool</h3>
              </div>
              <p className="mb-6">50+ stations to prepare you for placements.</p>
              {hasProduct('osce') || hasProduct('bundle') ? (
                <Link href="/osce" className="btn-primary w-full block text-center">
                  Start OSCE Practice
                </Link>
              ) : (
                <Link href="/osce" className="btn-secondary w-full block text-center">
                  Try OSCE Tool
                </Link>
              )}
            </div>

            <div className="card p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
                <h3 className="text-xl font-bold">Core Nursing Quiz</h3>
              </div>
              <p className="mb-6">17 topic areas covering essential knowledge.</p>
              {hasProduct('quiz') || hasProduct('bundle') ? (
                <Link href="/quiz" className="btn-primary w-full block text-center">
                  Start Quiz Practice
                </Link>
              ) : (
                <Link href="/quiz" className="btn-secondary w-full block text-center">
                  Try Quiz Tool
                </Link>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="mb-4">Got questions? I'm always happy to chat!</p>
            <Link 
              href="https://wa.me/447572650980" 
              className="btn-primary inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
