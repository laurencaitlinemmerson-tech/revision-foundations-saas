import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nursing Hub | Revision Foundations',
  description:
    'Choose your nursing branch to find OSCE guides, cheat sheets, and revision materials tailored to your pathway.',
};

export default function HubPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-[var(--charcoal-light)] mb-3 tracking-wide uppercase text-[10px]">
            Revision Hub
          </p>
          <h1 className="text-3xl md:text-4xl font-display text-[var(--espresso)] mb-4">
            Which branch are you studying?
          </h1>
          <p className="text-[var(--charcoal)] mb-12 max-w-xl">
            Pick your pathway to find resources, cheat sheets, and OSCE prep tailored to your branch.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Children's Nursing */}
            <Link
              href="/hub/childrens"
              className="group bg-white border border-[var(--linen-deep)] rounded-2xl p-8 hover:border-[var(--espresso)]/30 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-5">🧒</div>
              <h2 className="text-xl font-semibold text-[var(--espresso)] mb-3">
                Children&apos;s Nursing
              </h2>
              <p className="text-sm text-[var(--charcoal)] mb-6 leading-relaxed">
                Paediatric OSCEs, PEWS, normal ranges by age, Gillick competence, family-centred care,
                developmental milestones, and more.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--espresso)] group-hover:underline underline-offset-2">
                Browse resources <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Adult Nursing — Coming Soon */}
            <Link
              href="/hub/adult"
              className="relative bg-[var(--linen-light)] border border-[var(--linen-deep)] rounded-2xl p-8 transition-all hover:border-[var(--charcoal-light)]/30"
            >
              <span className="absolute top-5 right-5 text-xs bg-[var(--charcoal-light)]/10 text-[var(--charcoal)] px-3 py-1 rounded-full font-medium">
                Coming soon
              </span>
              <div className="text-3xl mb-5">🏥</div>
              <h2 className="text-xl font-semibold text-[var(--espresso)] mb-3">
                Adult Nursing
              </h2>
              <p className="text-sm text-[var(--charcoal)] mb-6 leading-relaxed">
                NEWS2, sepsis recognition, wound care, medication management, and adult-specific OSCE
                stations. In development.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm text-[var(--charcoal-light)]">
                Join the waitlist <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
