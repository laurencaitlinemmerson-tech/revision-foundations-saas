import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="bg-[var(--lilac)] px-6 pb-10 pt-16 text-[var(--plum-dark)]/70"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container flex flex-col gap-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <div className="font-serif text-2xl font-semibold text-[var(--plum)]">
              Revision Foundations
            </div>
            <p className="text-sm">Made with <span aria-label="love">💜</span> by Lauren</p>
            <p className="text-xs text-[var(--plum-dark)]/50">
              Helping nursing students ace their exams since 2024
            </p>
          </div>

          <nav aria-label="Products">
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--plum)]">Products</p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/osce" className="footer-link">
                    OSCE Tool
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="footer-link">
                    Core Quiz
                  </Link>
                </li>
                <li>
                  <Link href="/hub" className="footer-link">
                    Nursing Hub
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="footer-link">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <nav aria-label="Company">
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--plum)]">Company</p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/about" className="footer-link">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="footer-link">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="footer-link">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="footer-link">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/delete-data" className="footer-link">
                    Delete My Data
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <nav aria-label="Account">
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--plum)]">Account</p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/sign-in" className="footer-link">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="footer-link">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="footer-link">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="border-t border-[var(--lavender)]/40 pt-6 text-center text-sm">
          <p>© {currentYear} Revision Foundations. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
