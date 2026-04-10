import Link from 'next/link';
import EditorialLayout from '@/components/EditorialLayout';

export default function TermsPage() {
  return (
    <EditorialLayout
      kicker="Legal"
      title="Terms of Service"
      standfirst="The terms and conditions for using The Nurse Lab."
      byline="The Nurse Lab"
      backHref="/"
      backLabel="Back to home"
    >
      <div className="border border-[rgba(26,24,21,0.08)] bg-white px-6 py-7 md:px-8 md:py-8">
        <p className="text-sm leading-7 text-[var(--charcoal)]/78">
          Our terms of service will appear here soon. In the meantime, if you have any questions please{' '}
          <Link href="/contact" className="text-[var(--espresso)] underline underline-offset-4">
            get in touch
          </Link>
          .
        </p>
      </div>
    </EditorialLayout>
  );
}
