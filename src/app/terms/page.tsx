import Link from 'next/link';
import EditorialLayout from '@/components/EditorialLayout';

export default function TermsPage() {
  return (
    <EditorialLayout
      kicker="Legal"
      title="Terms of Service"
      standfirst="Last updated: April 2025"
      byline="The Nurse Lab"
      backHref="/"
      backLabel="Back to home"
    >
      <div className="prose prose-sm max-w-none space-y-8 text-[var(--charcoal)]">

        <section>
          <h2 className="text-base font-medium text-[var(--espresso)] mb-3">About these terms</h2>
          <p className="leading-7">
            These terms govern your use of The Nurse Lab, a revision platform for UK nursing students,
            operated by Lauren Emmerson as a sole trader. By creating an account or purchasing access,
            you agree to these terms. If you have any questions, please{' '}
            <Link href="/contact" className="text-[var(--espresso)] underline underline-offset-4">get in touch</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-[var(--espresso)] mb-3">What The Nurse Lab provides</h2>
          <p className="leading-7 mb-3">
            The Nurse Lab offers educational revision resources for student nurses. These include:
          </p>
          <ul className="list-disc pl-5 space-y-2 leading-7">
            <li><strong>Free hub content</strong> — revision guides and cheat sheets available without a paid account.</li>
            <li><strong>Paid tools</strong> — the OSCE practice tool, quiz tool, and mock exams, available via a one-time purchase.</li>
          </ul>
          <p className="leading-7 mt-3">
            All content is intended for educational purposes only. It is not medical advice and should
            not be used as a substitute for professional clinical judgement, university teaching, or
            official NHS guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-[var(--espresso)] mb-3">Your account</h2>
          <p className="leading-7">
            Accounts are managed through Clerk. You are responsible for keeping your login credentials
            secure and for all activity under your account. Please let us know immediately if you
            suspect unauthorised access.
          </p>
          <p className="leading-7 mt-3">
            Accounts are for personal use only. You may not share access with others or use your
            account on behalf of a group.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-[var(--espresso)] mb-3">Purchases and access</h2>
          <p className="leading-7">
            Paid access is sold as a one-time payment. Once purchased, you have lifetime access to the
            tools included in your plan — there are no recurring fees and no subscription to cancel.
          </p>
          <p className="leading-7 mt-3">
            Access is granted to your account immediately on payment confirmation. If you experience
            any issues accessing your purchase, please contact us and we will resolve it promptly.
          </p>
          <p className="leading-7 mt-3">
            Prices are in pounds sterling (GBP) and include VAT where applicable.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-[var(--espresso)] mb-3">7-day satisfaction guarantee</h2>
          <p className="leading-7">
            If you are not satisfied with your purchase for any reason, you may request a full refund
            within 7 days of your payment date. To request a refund, please{' '}
            <Link href="/contact" className="text-[var(--espresso)] underline underline-offset-4">contact us</Link>{' '}
            with your order details.
          </p>
          <p className="leading-7 mt-3">
            Refunds are processed via Stripe and typically appear within 5–10 business days depending
            on your bank. After 7 days, refunds are issued at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-[var(--espresso)] mb-3">Acceptable use</h2>
          <p className="leading-7 mb-3">When using The Nurse Lab, you agree not to:</p>
          <ul className="list-disc pl-5 space-y-2 leading-7">
            <li>Copy, redistribute, or resell any content from the platform.</li>
            <li>Attempt to reverse-engineer, scrape, or extract content in bulk.</li>
            <li>Use the platform in any way that breaches UK law or infringes third-party rights.</li>
            <li>Share your login credentials or allow others to use your account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium text-[var(--espresso)] mb-3">Intellectual property</h2>
          <p className="leading-7">
            All content on The Nurse Lab — including guides, question sets, OSCE station scripts,
            and design — is owned by Lauren Emmerson or used with permission. Nothing on the platform
            grants you any licence to reproduce or distribute it outside of personal study use.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-[var(--espresso)] mb-3">Disclaimer</h2>
          <p className="leading-7">
            The Nurse Lab is an educational revision aid. While every effort is made to keep content
            accurate and up to date, we make no warranty that it is complete, error-free, or reflects
            current clinical guidelines. Always defer to your university, placement supervisors, and
            official NHS or NMC guidance for clinical decisions.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-[var(--espresso)] mb-3">Limitation of liability</h2>
          <p className="leading-7">
            To the fullest extent permitted by law, The Nurse Lab is not liable for any indirect,
            incidental, or consequential loss arising from your use of the platform. Our total
            liability to you will not exceed the amount you paid for your purchase.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-[var(--espresso)] mb-3">Changes to the service or these terms</h2>
          <p className="leading-7">
            We may update these terms from time to time. If we make significant changes, we will
            notify you by email or via a notice on the site. Continued use after changes are posted
            means you accept the updated terms.
          </p>
          <p className="leading-7 mt-3">
            We reserve the right to modify, suspend, or discontinue any part of the service with
            reasonable notice, though we will always aim to preserve your access to content you have
            paid for.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-[var(--espresso)] mb-3">Governing law</h2>
          <p className="leading-7">
            These terms are governed by the laws of England and Wales. Any disputes will be subject
            to the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-[var(--espresso)] mb-3">Questions?</h2>
          <p className="leading-7">
            If you have any questions about these terms or your account, please get in touch — I am
            always happy to help.
          </p>
          <div className="mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center text-sm text-[var(--espresso)] underline underline-offset-4"
            >
              Contact us →
            </Link>
          </div>
        </section>

      </div>
    </EditorialLayout>
  );
}
