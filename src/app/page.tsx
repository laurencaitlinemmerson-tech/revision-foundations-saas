'use client';

import Link from 'next/link';
import EditorialLayout from '@/components/EditorialLayout';
import Testimonials from '@/components/Testimonials';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <EditorialLayout
      kicker="OSCE prep · Theory revision · Placement survival"
      title="Pass your nursing assessments."
      standfirst="Revision tools built by a nursing student, for nursing students. OSCE practice, theory quizzes, cheat sheets, and a full reference hub — no generic content."
      byline="Revision Foundations"
      backHref="/hub"
      backLabel="Nursing Hub"
    >
      <div className="grid sm:grid-cols-2 gap-4 max-w-xl mb-8">
        <Link
          href="/hub/childrens"
          className="group bg-white/80 backdrop-blur-sm border border-[var(--linen-deep)] rounded-xl p-5 text-left hover:border-[var(--espresso)]/30 hover:shadow-md transition-all"
        >
          <div className="text-2xl mb-3">🧒</div>
          <h2 className="text-base font-semibold text-[var(--espresso)] mb-1">Children&apos;s Nursing</h2>
          <p className="text-xs text-[var(--charcoal)] mb-3 leading-relaxed">
            Paed obs, PEWS, paediatric OSCEs, family-centred care
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--espresso)] bg-[var(--linen-light)] px-2.5 py-1 rounded-full">
            Available now <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
        <Link
          href="/hub/adult"
          className="group bg-white/50 backdrop-blur-sm border border-[var(--linen-deep)] rounded-xl p-5 text-left hover:border-[var(--charcoal-light)]/30 transition-all opacity-70"
        >
          <div className="text-2xl mb-3">🏥</div>
          <h2 className="text-base font-semibold text-[var(--espresso)] mb-1">Adult Nursing</h2>
          <p className="text-xs text-[var(--charcoal)] mb-3 leading-relaxed">
            NEWS2, sepsis, wound care, adult OSCE stations
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-[var(--charcoal-light)] bg-[var(--linen-light)]/80 px-2.5 py-1 rounded-full">
            Coming soon
          </span>
        </Link>
      </div>
      {/* ...existing content... */}
      {/* Panel 2 — OSCE checklist */}
      <div className="bg-white border border-[var(--linen-deep)] rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-widest text-[var(--charcoal-light)] mb-3 font-medium">OSCE Station</p>
        <p className="text-sm font-semibold text-[var(--espresso)] mb-1">Paediatric Vital Signs</p>
        <p className="text-xs text-[var(--charcoal-light)] mb-4 leading-relaxed">4-year-old admitted to the ward. Take a full set of obs and document correctly.</p>
        <ul className="space-y-2 mb-4">
          {[
            { text: 'Introduces self, checks patient ID', done: true },
            { text: 'Explains to child & carer appropriately', done: true },
            { text: 'Washes hands / correct PPE', done: true },
            { text: 'Records HR, RR, SpO₂, temp, BP', done: false, bold: true },
            { text: 'Documents using SBAR, escalates if abnormal', done: false },
          ].map((item) => (
            <li key={item.text} className="flex items-start gap-2 text-xs text-[var(--charcoal)]">
              {item.done ? (
                <span className="text-green-600 flex-shrink-0 mt-px">✓</span>
              ) : (
                <span className="w-3 h-3 mt-0.5 rounded-sm border border-gray-400 flex-shrink-0" />
              )}
              <span className={`${item.done ? 'line-through text-[var(--charcoal-light)]' : ''} ${item.bold ? 'font-semibold' : ''}`}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-[var(--charcoal-light)] leading-relaxed">
          Each station has a full marking sheet with pass/fail criteria.
        </p>
      </div>

              {/* Panel 3 — Reference table */}
              <div className="bg-white border border-[var(--linen-deep)] rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-[var(--charcoal-light)] mb-3 font-medium">Hub Resource</p>
                <p className="text-sm font-semibold text-[var(--espresso)] mb-4">Paed Normal Obs Ranges</p>
                <table className="w-full text-xs mb-4">
                  <thead>
                    <tr className="text-left text-[var(--charcoal-light)] border-b border-[var(--linen-deep)]">
                      <th className="pb-2 font-medium">Age</th>
                      <th className="pb-2 font-medium">HR</th>
                      <th className="pb-2 font-medium">RR</th>
                      <th className="pb-2 font-medium">SBP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { age: 'Newborn', hr: '100–160', rr: '30–60', sbp: '50–70' },
                      { age: '1–12mo', hr: '100–150', rr: '25–50', sbp: '70–90' },
                      { age: '1–5yr', hr: '90–140', rr: '20–40', sbp: '80–100' },
                      { age: '5–12yr', hr: '70–120', rr: '15–25', sbp: '90–110' },
                    ].map((row, i) => (
                      <tr key={row.age} className={`${i % 2 === 0 ? 'bg-[var(--linen-light)]' : ''}`}>
                        <td className="py-1.5 pr-2 text-[var(--charcoal)] font-medium">{row.age}</td>
                        <td className="py-1.5 pr-2 text-[var(--charcoal)]">{row.hr}</td>
                        <td className="py-1.5 pr-2 text-[var(--charcoal)]">{row.rr}</td>
                        <td className="py-1.5 text-[var(--charcoal)]">{row.sbp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-[var(--charcoal-light)] leading-relaxed">
    			Part of the Paediatric Vital Signs cheat sheet in the Hub.
                </p>
              </div>
            </section>

        {/* Tools Section — What's Inside */}
        <section id="whats-inside" className="py-16 md:py-24 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl text-[var(--espresso)] mb-8">What&apos;s included</h2>

            <div className="flex flex-col gap-4">
              {/* OSCE Tool */}
              <Link href={isPro ? "/hub" : "/osce"} className="card bg-white dark:bg-[var(--bg-card)] p-5 hover:scale-[1.01] transition-transform">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--linen-deep)] flex items-center justify-center flex-shrink-0 text-xl">
                    🩺
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--plum-dark)] dark:text-[var(--text-primary)] mb-1">Children&apos;s OSCE Tool</h3>
                    <p className="text-sm text-[var(--plum-dark)]/70 dark:text-[var(--text-secondary)] mb-3">
                      50+ practice stations covering paediatric obs, A-E assessment, medication administration, safeguarding, and SBAR handover. Each station has an examiner marking checklist and timed mode for realistic practice.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Paed obs', 'ABCDE approach', 'Medication admin', 'Safeguarding', 'SBAR handover'].map((tag) => (
                        <span key={tag} className="text-xs bg-[var(--linen-light)] dark:bg-[var(--bg-tertiary)] text-[var(--charcoal)] dark:text-[var(--text-muted)] px-2 py-1 rounded-full border border-[var(--linen-deep)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Quiz Tool */}
              <Link href={isPro ? "/hub" : "/quiz"} className="card bg-white dark:bg-[var(--bg-card)] p-5 hover:scale-[1.01] transition-transform">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--linen-deep)] flex items-center justify-center flex-shrink-0 text-xl">
                    📋
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--plum-dark)] dark:text-[var(--text-primary)] mb-1">Core Nursing Quiz</h3>
                    <p className="text-sm text-[var(--plum-dark)]/70 dark:text-[var(--text-secondary)] mb-3">
                      17 topic areas: vital signs, drug calculations, anatomy &amp; physiology, pharmacology, infection control, fluid balance. Every answer includes an explanation — not just right or wrong.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Drug calculations', 'Vital signs', 'Anatomy', 'Pharmacology', 'Infection control'].map((tag) => (
                        <span key={tag} className="text-xs bg-[var(--linen-light)] dark:bg-[var(--bg-tertiary)] text-[var(--charcoal)] dark:text-[var(--text-muted)] px-2 py-1 rounded-full border border-[var(--linen-deep)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Hub */}
              <Link href="/hub" className="card bg-white dark:bg-[var(--bg-card)] p-5 hover:scale-[1.01] transition-transform">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--linen-deep)] flex items-center justify-center flex-shrink-0 text-xl">
                    📚
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--plum-dark)] dark:text-[var(--text-primary)] mb-1">Revision Hub</h3>
                    <p className="text-sm text-[var(--plum-dark)]/70 dark:text-[var(--text-secondary)] mb-3">
                      Cheat sheets, clinical guides, and practice questions. Includes paediatric obs reference ranges, A-E assessment guide, SBAR template, and a placement survival guide. Plus a Q&amp;A section for anything you&apos;re stuck on.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Cheat sheets', 'Clinical guides', 'Placement tips', 'Q&A'].map((tag) => (
                        <span key={tag} className="text-xs bg-[var(--linen-light)] dark:bg-[var(--bg-tertiary)] text-[var(--charcoal)] dark:text-[var(--text-muted)] px-2 py-1 rounded-full border border-[var(--linen-deep)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <p className="text-sm text-[var(--charcoal-light)] mt-6">
              £4.99 one-time — includes everything above plus new content as it&apos;s added.{' '}
              <Link href="/pricing" className="underline underline-offset-2 hover:opacity-75 transition-opacity">See pricing →</Link>
            </p>
          </div>
        </section>

        {/* Why I built this */}
        <section className="bg-[var(--linen-light)] border-y border-[var(--linen-deep)] py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl text-[var(--espresso)] mb-10">Why I built this</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-base font-semibold text-[var(--espresso)] mb-2">Branch-specific content</h3>
                <p className="text-sm text-[var(--charcoal-light)] leading-relaxed">
                  Generic revision tools miss what matters for your branch. Children&apos;s nursing is live now — paed obs ranges, family-centred care, PEWS, safeguarding. Adult nursing is coming next.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--espresso)] mb-2">What actually gets tested</h3>
                <p className="text-sm text-[var(--charcoal-light)] leading-relaxed">
                  I made these tools while preparing for my own OSCEs and theory exams. The topics and scenarios reflect what nursing students actually face — not what a textbook assumes they face.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--espresso)] mb-2">No recurring cost</h3>
                <p className="text-sm text-[var(--charcoal-light)] leading-relaxed">
                  Students don&apos;t have spare cash. One payment, and it&apos;s yours. I use these tools myself so new content is added regularly — and you get all future updates at no extra cost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Bottom CTA */}
        <section className="bg-cream py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl text-[var(--espresso)] mb-3">Start revising today</h2>
            <p className="text-sm text-[var(--charcoal-light)] mb-8">One-time access. Works on mobile. Built for nursing students.</p>

            <div className="flex flex-col sm:flex-row gap-3">
              {!accessLoading && isPro ? (
                <Link href="/hub" className="btn-primary px-8 py-4">
                  Go to Hub <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              ) : (
                <>
                  <Link href="/pricing" className="btn-primary px-8 py-4">
                    Get Access — £9.99
                  </Link>
                  <Link href="/quiz" className="btn-secondary px-8 py-4">
                    Try a free preview →
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Contact strip */}
        <section className="bg-[var(--linen-light)] border-t border-[var(--linen-deep)] py-10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-sm text-[var(--charcoal-light)] mb-1">
              Got a question? Spotted something that needs updating?
            </p>
            <p className="text-sm text-[var(--charcoal-light)]">
              <a
                href="https://wa.me/447572650980"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-75 transition-opacity text-[var(--espresso)]"
              >
                WhatsApp me
              </a>
              {' '}or{' '}
              <Link href="/contact" className="underline underline-offset-2 hover:opacity-75 transition-opacity text-[var(--espresso)]">
                use the contact form
              </Link>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--linen-light)] border-t border-[var(--linen-deep)] px-6 pb-10 pt-16 text-[var(--charcoal-light)]" role="contentinfo">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div className="space-y-2">
              <div className="font-serif text-2xl font-semibold text-[var(--espresso)]">
                Revision Foundations
              </div>
              <p className="text-sm">Made by Lauren — children&apos;s nursing student</p>
              <p className="text-sm text-[var(--charcoal-light)]">Built because good paeds revision tools didn&apos;t exist.</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--espresso)]">Tools</p>
              <div className="flex flex-col gap-2">
                <Link href="/osce" className="footer-link">
                  OSCE Tool
                </Link>
                <Link href="/quiz" className="footer-link">
                  Core Quiz
                </Link>
                <Link href="/hub" className="footer-link">
                  Revision Hub
                </Link>
                <Link href="/pricing" className="footer-link">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--espresso)]">Info</p>
              <div className="flex flex-col gap-2">
                <Link href="/about" className="footer-link">
                  About
                </Link>
                <Link href="/contact" className="footer-link">
                  Contact
                </Link>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="footer-link">
                  Terms of Service
                </Link>
                <Link href="/delete-data" className="footer-link">
                  Delete My Data
                </Link>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--espresso)]">Account</p>
              <div className="flex flex-col gap-2">
                <Link href="/sign-in" className="footer-link">
                  Sign In
                </Link>
                <Link href="/sign-up" className="footer-link">
                  Sign Up
                </Link>
                <Link href="/dashboard" className="footer-link">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--linen-deep)] pt-6 text-center text-sm">
            © 2026 Revision Foundations
          </div>
        </div>
      </footer>
    </div>
  );
}
