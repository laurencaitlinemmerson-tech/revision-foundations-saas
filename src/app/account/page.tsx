import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import { User, Mail, Calendar, Package, CheckCircle, XCircle, Sparkles, ExternalLink } from 'lucide-react';

export default async function AccountPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();
  const entitlements = await getUserEntitlements(userId);
  const hasOsce = hasAccessToContent(entitlements, 'osce');
  const hasQuiz = hasAccessToContent(entitlements, 'quiz');

  const products = [
    {
      id: 'osce',
      name: "Children's OSCE Tool",
      owned: hasOsce,
      href: '/osce',
    },
    {
      id: 'quiz',
      name: 'Nursing Theory Quiz',
      owned: hasQuiz,
      href: '/quiz',
    },
  ];

  return (
    <div className="min-h-screen gradient-bg-light">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--purple-gradient-start)] to-[var(--purple-gradient-end)] flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-4xl font-bold text-[var(--plum-text)] mb-4">
              My Account
            </h1>
            <p className="text-[var(--plum-text)]/70">
              Manage your profile and view your purchases.
            </p>
          </div>

          {/* Profile Card */}
          <div className="glass-card p-8 mb-8">
            <h2 className="font-display text-xl font-bold text-[var(--plum-text)] mb-6">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[var(--lilac-tint)]/50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--purple-gradient-start)] to-[var(--purple-gradient-end)] flex items-center justify-center text-white font-bold text-lg">
                  {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-[var(--plum-text)]">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : 'User'}
                  </p>
                  <p className="text-sm text-[var(--plum-text)]/60">
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--glass-border)]">
                  <Mail className="w-5 h-5 text-[var(--lavender-primary)]" />
                  <div>
                    <p className="text-xs text-[var(--plum-text)]/60">Email</p>
                    <p className="text-sm text-[var(--plum-text)]">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--glass-border)]">
                  <Calendar className="w-5 h-5 text-[var(--lavender-primary)]" />
                  <div>
                    <p className="text-xs text-[var(--plum-text)]/60">Member Since</p>
                    <p className="text-sm text-[var(--plum-text)]">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchases Card */}
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-[var(--plum-text)]">
                My Products
              </h2>
              <Package className="w-5 h-5 text-[var(--lavender-primary)]" />
            </div>

            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-[var(--glass-border)]"
                >
                  <div className="flex items-center gap-3">
                    {product.owned ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-300" />
                    )}
                    <span className="text-[var(--plum-text)]">{product.name}</span>
                  </div>
                  {product.owned ? (
                    <Link
                      href={product.href}
                      className="text-sm text-[var(--lavender-primary)] hover:underline flex items-center gap-1"
                    >
                      Launch
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <Link
                      href={`/pricing?product=${product.id}`}
                      className="text-sm text-[var(--lavender-primary)] hover:underline"
                    >
                      Purchase
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {entitlements.length === 0 && (
              <div className="mt-6 p-4 bg-[var(--lilac-tint)]/50 rounded-xl text-center">
                <p className="text-[var(--plum-text)]/70 mb-3">
                  You haven&apos;t purchased any products yet.
                </p>
                <Link href="/pricing" className="btn-gradient inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  View Products
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="glass-card p-8">
            <h2 className="font-display text-xl font-bold text-[var(--plum-text)] mb-6">
              Quick Links
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/dashboard"
                className="p-4 rounded-xl border border-[var(--glass-border)] text-center hover:border-[var(--lavender-primary)] transition-colors"
              >
                <span className="text-sm text-[var(--plum-text)]">Dashboard</span>
              </Link>
              <Link
                href="/pricing"
                className="p-4 rounded-xl border border-[var(--glass-border)] text-center hover:border-[var(--lavender-primary)] transition-colors"
              >
                <span className="text-sm text-[var(--plum-text)]">Pricing</span>
              </Link>
              <Link
                href="/contact"
                className="p-4 rounded-xl border border-[var(--glass-border)] text-center hover:border-[var(--lavender-primary)] transition-colors"
              >
                <span className="text-sm text-[var(--plum-text)]">Support</span>
              </Link>
              <a
                href="https://accounts.clerk.dev/user"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-[var(--glass-border)] text-center hover:border-[var(--lavender-primary)] transition-colors"
              >
                <span className="text-sm text-[var(--plum-text)]">Settings</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
