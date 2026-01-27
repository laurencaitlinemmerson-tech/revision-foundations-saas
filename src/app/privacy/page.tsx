'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="text-sm text-[var(--purple)] hover:underline inline-flex items-center gap-1 mb-4">
              <ArrowLeft className="w-3 h-3" />
              Back home
            </Link>
            <h1 className="mb-2">Privacy Policy</h1>
            <p className="text-[var(--plum-dark)]/60 text-sm">Last updated: January 2025</p>
          </div>

          {/* Content */}
          <div className="card">
            <div className="prose prose-sm max-w-none space-y-6 text-[var(--plum-dark)]/80">
              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Hi there!</h2>
                <p>
                  I'm Lauren, and I run Revision Foundations. I take your privacy seriously and want to be
                  completely transparent about what data I collect and why. This policy explains everything
                  in plain English - no confusing legal jargon!
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">What I Collect</h2>
                <p className="mb-3">I only collect what's necessary to provide you with the service:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Email address</strong> - Used to send you access details and important updates
                    about your purchase. I won't spam you, promise!
                  </li>
                  <li>
                    <strong>Account information</strong> - If you create an account via Clerk (my authentication
                    provider), your basic profile info is stored securely with them.
                  </li>
                  <li>
                    <strong>Payment information</strong> - Handled entirely by Stripe. I never see or store
                    your card details - Stripe handles all of that securely.
                  </li>
                  <li>
                    <strong>Purchase history</strong> - I keep a record of what you've purchased so you can
                    access your tools.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">How I Use Your Data</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>To give you access to the tools you've purchased</li>
                  <li>To send you purchase confirmations and access details</li>
                  <li>To respond if you contact me with questions</li>
                  <li>To improve the tools based on how they're used (anonymously)</li>
                </ul>
                <p className="mt-3">
                  I will <strong>never</strong> sell your data to third parties or send you marketing emails
                  without your consent.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Third-Party Services</h2>
                <p className="mb-3">I use a few trusted services to run the site:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Clerk</strong> - For secure account management and login
                  </li>
                  <li>
                    <strong>Stripe</strong> - For secure payment processing
                  </li>
                  <li>
                    <strong>Supabase</strong> - For storing purchase records securely
                  </li>
                  <li>
                    <strong>Vercel</strong> - For hosting the website
                  </li>
                </ul>
                <p className="mt-3">
                  Each of these services has their own privacy policy and maintains high security standards.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Cookies</h2>
                <p>
                  The site uses essential cookies to keep you logged in and remember your preferences.
                  I don't use tracking cookies or analytics that follow you around the internet.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Your Rights</h2>
                <p className="mb-3">You have the right to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Access the data I hold about you</li>
                  <li>Request correction of any incorrect data</li>
                  <li>Request deletion of your data</li>
                  <li>Withdraw consent for marketing (if applicable)</li>
                </ul>
                <div className="mt-4">
                  <Link href="/delete-data" className="text-[var(--purple)] hover:underline text-sm">
                    Request data deletion →
                  </Link>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Data Security</h2>
                <p>
                  I take security seriously. All data is transmitted over HTTPS, passwords are never stored
                  in plain text, and payment processing is handled by Stripe (who are PCI compliant).
                  Your data is stored securely and I regularly review my security practices.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Changes to This Policy</h2>
                <p>
                  If I make any significant changes to this policy, I'll let you know via email or a notice
                  on the website. Minor changes may be made without notice.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Questions?</h2>
                <p>
                  If you have any questions about this privacy policy or how I handle your data, please
                  get in touch! I'm always happy to help.
                </p>
                <div className="mt-4">
                  <Link href="/contact" className="btn-secondary inline-flex">
                    Contact Me
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
