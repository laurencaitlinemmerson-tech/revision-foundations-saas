import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--lilac)] px-6 pb-10 pt-16 text-[var(--plum-dark)]/70">
      <div className="container flex flex-col gap-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <div className="font-serif text-2xl font-semibold text-[var(--plum)]">
              Revision Foundations
            </div>
            <p className="text-sm">Made with 💜 by Lauren</p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="font-semibold text-[var(--plum)]">Products</p>
            <div className="flex flex-col gap-2">
              <Link href="/osce" className="footer-link">
                OSCE Tool
              </Link>
              <Link href="/quiz" className="footer-link">
                Core Quiz
              </Link>
              <Link href="/hub" className="footer-link">
                Nursing Hub
              </Link>
              <Link href="/pricing" className="footer-link">
                Pricing
              </Link>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <p className="font-semibold text-[var(--plum)]">Company</p>
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
            <p className="font-semibold text-[var(--plum)]">Account</p>
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

        <div className="border-t border-[var(--lavender)]/40 pt-6 text-center text-sm">
          © 2026 Revision Foundations
        </div>
      </div>
    </footer>
  );
}
