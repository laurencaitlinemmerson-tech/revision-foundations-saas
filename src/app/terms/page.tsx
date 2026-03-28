'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EditorialLayout from '@/components/EditorialLayout';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">


    <EditorialLayout
      kicker="Terms"
      title="Terms & Conditions"
      standfirst="Please read these terms carefully before using Revision Foundations."
      byline="Revision Foundations"
      backHref="/dashboard"
      backLabel="Back to Dashboard"
    >
      <div className="ed-card p-6 mb-8">
        <h2 className="text-lg font-semibold mb-2">Use of Service</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/70">
          <li className="mb-2">You must be a registered user to access premium content</li>
          <li className="mb-2">Do not share your login details with others</li>
          <li className="mb-2">Content is for personal use only</li>
        </ul>
      </div>
      <div className="ed-card p-6 mb-8">
        <h2 className="text-lg font-semibold mb-2">Refunds</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/70">
          <li className="mb-2">Refunds are available within 14 days of purchase if you have not accessed premium content</li>
          <li className="mb-2">Contact us for refund requests</li>
        </ul>
      </div>
      <div className="ed-card p-6">
        <h2 className="text-lg font-semibold mb-2">Contact</h2>
        <p className="text-[var(--plum-dark)]/70">For any questions about these terms, please <a href="/contact" className="text-[var(--purple)] hover:underline">contact us</a>.</p>
      </div>
    </EditorialLayout>
  );
              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Welcome!</h2>
                <p>
                  By using Revision Foundations, you agree to these terms. I've tried to keep them
                  straightforward and fair. If anything is unclear, just ask!
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">What You're Getting</h2>
                <p className="mb-3">When you purchase a tool from Revision Foundations, you receive:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Lifetime access to the tool(s) you've purchased</li>
                  <li>All future updates to those tools at no extra cost</li>
                  <li>Access via the website - no downloads required</li>
                </ul>
                <p className="mt-3">
                  "Lifetime" means for as long as Revision Foundations exists and operates. I have no
                  plans to shut down, but life happens - if it ever does, I'll give plenty of notice
                  and provide downloadable versions where possible.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">What You Can't Do</h2>
                <p className="mb-3">Please don't:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Share your account or login details with others</li>
                  <li>Copy, redistribute, or resell the content</li>
                  <li>Use automated tools to scrape or download content</li>
                  <li>Try to hack, break, or exploit the website</li>
                  <li>Use the tools for anything illegal</li>
                </ul>
                <p className="mt-3">
                  Basically, be a good egg! These tools took ages to make and I'd really appreciate
                  if you didn't share them around for free.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Payments</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>All payments are processed securely through Stripe</li>
                  <li>Prices are in GBP (British Pounds) and include VAT where applicable</li>
                  <li>Once payment is confirmed, you get instant access</li>
                  <li>I don't store your card details - that's all handled by Stripe</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Refunds</h2>
                <p>
                  I offer a <strong>7-day refund policy</strong>. If you're not happy with your purchase
                  for any reason, just message me within 7 days and I'll sort out a full refund - no
                  questions asked!
                </p>
                <p className="mt-3">
                  After 7 days, refunds are at my discretion, but I'm generally pretty reasonable.
                  Just get in touch and we'll figure it out.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">The Content</h2>
                <p className="mb-3">A few important things about the study content:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    The tools are designed to <strong>supplement</strong> your studies, not replace
                    proper teaching or clinical experience
                  </li>
                  <li>
                    I do my best to keep everything accurate and up-to-date, but nursing guidelines
                    change - always check with your university and placement
                  </li>
                  <li>
                    The content is based on UK nursing practice and may not apply to other countries
                  </li>
                  <li>
                    I can't guarantee you'll pass your exams (I wish I could!) - that's down to
                    your hard work
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Account Responsibility</h2>
                <p>
                  If you create an account, you're responsible for keeping your login details safe.
                  If you think someone else has accessed your account, let me know straight away so
                  I can help secure it.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Changes to the Service</h2>
                <p>
                  I may update the tools, add new features, or make changes to improve things.
                  I'll try to keep the core functionality you purchased, but the exact appearance
                  and features may evolve over time (usually for the better!).
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Termination</h2>
                <p>
                  I reserve the right to terminate accounts that violate these terms (e.g., sharing
                  accounts or attempting to hack the site). But I'll always try to reach out and
                  resolve things first - mistakes happen!
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Liability</h2>
                <p>
                  While I do my best to provide accurate and helpful content, Revision Foundations
                  is provided "as is". I'm not liable for any issues arising from using the tools,
                  including (but not limited to) exam results, clinical decisions, or any other
                  outcomes. Always use professional judgement and follow your university's guidance.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Governing Law</h2>
                <p>
                  These terms are governed by the laws of England and Wales. Any disputes will be
                  handled in UK courts, but honestly, I'd much rather we just chat and sort things
                  out like reasonable people!
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-3">Questions?</h2>
                <p>
                  If you have any questions about these terms, please reach out. I'm always happy
                  to clarify anything!
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
