'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowLeft, FileText, Clock, Syringe, Pill } from 'lucide-react';

const abbreviations = {
  frequency: [
    { abbr: 'OD', meaning: 'Once daily', latin: 'Omni die' },
    { abbr: 'BD / BID', meaning: 'Twice daily', latin: 'Bis in die' },
    { abbr: 'TDS / TID', meaning: 'Three times daily', latin: 'Ter die sumendum' },
    { abbr: 'QDS / QID', meaning: 'Four times daily', latin: 'Quater die sumendum' },
    { abbr: 'PRN', meaning: 'As needed/when required', latin: 'Pro re nata' },
    { abbr: 'Stat', meaning: 'Immediately', latin: 'Statim' },
    { abbr: 'Mane', meaning: 'In the morning', latin: 'Mane' },
    { abbr: 'Nocte', meaning: 'At night', latin: 'Nocte' },
    { abbr: 'AC', meaning: 'Before food', latin: 'Ante cibum' },
    { abbr: 'PC', meaning: 'After food', latin: 'Post cibum' },
  ],
  routes: [
    { abbr: 'PO', meaning: 'By mouth (oral)', latin: 'Per os' },
    { abbr: 'IV', meaning: 'Intravenous (into vein)', latin: '' },
    { abbr: 'IM', meaning: 'Intramuscular (into muscle)', latin: '' },
    { abbr: 'SC / SubCut', meaning: 'Subcutaneous (under skin)', latin: '' },
    { abbr: 'SL', meaning: 'Sublingual (under tongue)', latin: '' },
    { abbr: 'PR', meaning: 'Per rectum', latin: '' },
    { abbr: 'PV', meaning: 'Per vagina', latin: '' },
    { abbr: 'INH', meaning: 'Inhaled', latin: '' },
    { abbr: 'TOP', meaning: 'Topical (on skin)', latin: '' },
    { abbr: 'NG', meaning: 'Via nasogastric tube', latin: '' },
    { abbr: 'NJ', meaning: 'Via nasojejunal tube', latin: '' },
    { abbr: 'PEG', meaning: 'Via PEG tube', latin: '' },
  ],
  units: [
    { abbr: 'g', meaning: 'Gram', note: '' },
    { abbr: 'mg', meaning: 'Milligram (1/1000 gram)', note: '' },
    { abbr: 'mcg / μg', meaning: 'Microgram (1/1000 milligram)', note: 'Never abbreviate to "μg" in handwriting!' },
    { abbr: 'ml / mL', meaning: 'Millilitre', note: '' },
    { abbr: 'L', meaning: 'Litre', note: '' },
    { abbr: 'mmol', meaning: 'Millimole', note: '' },
    { abbr: 'units', meaning: 'Units (e.g., insulin)', note: 'Never abbreviate "units" to "U"' },
  ],
  forms: [
    { abbr: 'Tab', meaning: 'Tablet', note: '' },
    { abbr: 'Cap', meaning: 'Capsule', note: '' },
    { abbr: 'Susp', meaning: 'Suspension', note: '' },
    { abbr: 'Sol', meaning: 'Solution', note: '' },
    { abbr: 'Inj', meaning: 'Injection', note: '' },
    { abbr: 'Supp', meaning: 'Suppository', note: '' },
    { abbr: 'MDI', meaning: 'Metered dose inhaler', note: '' },
    { abbr: 'Neb', meaning: 'Nebuliser', note: '' },
    { abbr: 'EC', meaning: 'Enteric coated', note: '' },
    { abbr: 'MR / SR', meaning: 'Modified/Slow release', note: '' },
  ],
};

export default function MedicationAbbreviationsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero pt-28 pb-12 relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.25 }} />
        <div className="blob blob-2" style={{ opacity: 0.25 }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-[var(--plum)] hover:text-[var(--purple)] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--lavender)] to-[var(--purple)] flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                FREE
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-3">
            Medication Abbreviations Guide 💊
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg">
            Common abbreviations you&apos;ll see on prescriptions and drug charts.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Frequency */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-[var(--purple)]" />
            Frequency / Timing
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--lilac)]">
                  <th className="text-left py-2 font-semibold text-[var(--purple)]">Abbreviation</th>
                  <th className="text-left py-2 font-semibold text-[var(--purple)]">Meaning</th>
                  <th className="text-left py-2 font-semibold text-[var(--purple)] hidden sm:table-cell">Latin</th>
                </tr>
              </thead>
              <tbody>
                {abbreviations.frequency.map((item, i) => (
                  <tr key={i} className="border-b border-[var(--lilac-soft)]">
                    <td className="py-2 font-mono font-semibold text-[var(--plum)]">{item.abbr}</td>
                    <td className="py-2 text-[var(--plum-dark)]">{item.meaning}</td>
                    <td className="py-2 text-[var(--plum-dark)]/60 italic hidden sm:table-cell">{item.latin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Routes */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Syringe className="w-6 h-6 text-[var(--purple)]" />
            Routes of Administration
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--lilac)]">
                  <th className="text-left py-2 font-semibold text-[var(--purple)]">Abbreviation</th>
                  <th className="text-left py-2 font-semibold text-[var(--purple)]">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {abbreviations.routes.map((item, i) => (
                  <tr key={i} className="border-b border-[var(--lilac-soft)]">
                    <td className="py-2 font-mono font-semibold text-[var(--plum)]">{item.abbr}</td>
                    <td className="py-2 text-[var(--plum-dark)]">{item.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Units */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            Units & Measurements
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--lilac)]">
                  <th className="text-left py-2 font-semibold text-[var(--purple)]">Abbreviation</th>
                  <th className="text-left py-2 font-semibold text-[var(--purple)]">Meaning</th>
                  <th className="text-left py-2 font-semibold text-[var(--purple)] hidden sm:table-cell">Note</th>
                </tr>
              </thead>
              <tbody>
                {abbreviations.units.map((item, i) => (
                  <tr key={i} className="border-b border-[var(--lilac-soft)]">
                    <td className="py-2 font-mono font-semibold text-[var(--plum)]">{item.abbr}</td>
                    <td className="py-2 text-[var(--plum-dark)]">{item.meaning}</td>
                    <td className="py-2 text-amber-600 text-xs hidden sm:table-cell">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
            ⚠️ <strong>Safety reminder:</strong> Never abbreviate &quot;units&quot; to &quot;U&quot; or &quot;micrograms&quot; to &quot;μg&quot; in handwriting - these can be misread!
          </div>
        </div>

        {/* Drug Forms */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Pill className="w-6 h-6 text-[var(--purple)]" />
            Drug Forms
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--lilac)]">
                  <th className="text-left py-2 font-semibold text-[var(--purple)]">Abbreviation</th>
                  <th className="text-left py-2 font-semibold text-[var(--purple)]">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {abbreviations.forms.map((item, i) => (
                  <tr key={i} className="border-b border-[var(--lilac-soft)]">
                    <td className="py-2 font-mono font-semibold text-[var(--plum)]">{item.abbr}</td>
                    <td className="py-2 text-[var(--plum-dark)]">{item.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Print tip */}
        <div className="text-center text-sm text-[var(--plum-dark)]/60">
          💡 Tip: Print this page for a handy reference on placement!
        </div>

        {/* More resources CTA */}
        <div className="card bg-[var(--lilac-soft)] border-0 text-center">
          <h3 className="text-lg text-[var(--plum)] mb-2">Want more medications resources?</h3>
          <p className="text-sm text-[var(--plum-dark)]/70 mb-4">
            Check out our drug calculations cheat sheets and high-risk medications guide.
          </p>
          <Link href="/hub" className="btn-primary inline-flex items-center gap-2">
            Browse Hub
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--lilac)] px-6 py-8 text-center text-[var(--plum-dark)]/70 text-sm">
        <p>Made with love by Lauren</p>
        <div className="flex justify-center gap-4 mt-3">
          <Link href="/privacy" className="hover:text-[var(--plum)]">Privacy</Link>
          <Link href="/terms" className="hover:text-[var(--plum)]">Terms</Link>
          <Link href="/hub" className="hover:text-[var(--plum)]">Hub</Link>
        </div>
      </footer>
    </div>
  );
}
