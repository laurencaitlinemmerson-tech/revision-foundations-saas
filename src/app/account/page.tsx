import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import { listFoldersForUser } from '@/lib/bookmarks/server';
import { 
  User, 
  Mail, 
  Calendar, 
  Package, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  LayoutDashboard,
  CreditCard,
  MessageCircle,
  Settings,
  Shield,
  Trash2,
  Heart,
  ClipboardCheck,
  BookOpen
} from 'lucide-react';

export default async function AccountPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();
  const entitlements = await getUserEntitlements(userId);
  const hasOsce = hasAccessToContent(entitlements, 'osce');
  const hasQuiz = hasAccessToContent(entitlements, 'quiz');
  const hasBundle = hasOsce && hasQuiz;
  const folders = await listFoldersForUser(userId);
  const totalSavedItems = folders.reduce((count, folder) => count + folder.itemCount, 0);
  const accountName = user?.firstName?.trim() || 'Your account';
  const accountInitial =
    user?.firstName?.[0] ||
    user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
    'N';

  const products = [
    {
      id: 'osce',
      name: "OSCE Practice Tool",
      description: "50+ timed paediatric stations",
      owned: hasOsce,
      href: '/osce',
      icon: ClipboardCheck,
    },
    {
      id: 'quiz',
      name: 'Core Knowledge Quiz',
      description: "17 topic areas with explanations",
      owned: hasQuiz,
      href: '/quiz',
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <section className="border-b border-[rgba(26,24,21,0.08)] bg-cream pt-24 pb-10 md:pt-28 md:pb-12">
        <div className="max-w-5xl mx-auto px-6">
          <p
            className="mb-4 text-[11px] uppercase tracking-[0.16em] text-[var(--charcoal-light)]"
            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
          >
            Account
          </p>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white font-display text-2xl text-[var(--espresso)]">
              {accountInitial}
            </div>
            <div>
              <h1 className="font-display text-[2.2rem] leading-[1.02] text-[var(--espresso)] md:text-[3rem]">
                {accountName}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--charcoal)] md:text-base">
                Access, purchases, and useful links for your Nurse Lab account.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="pb-20 px-6">
        <div className="max-w-5xl mx-auto pt-8">
          
          {/* Status Banner */}
          {hasBundle ? (
            <div className="mb-8border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.82)] px-6 py-6 md:px-7">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/70">Access</p>
              <div className="mt-3 flex items-start justify-between gap-5 flex-wrap">
                <div className="max-w-2xl">
                  <h2 className="font-display text-[1.75rem] leading-[1.08] text-[var(--espresso)]">Full access</h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--charcoal)]">
                    Your OSCE tool, quiz, and revision hub access are all available here.
                  </p>
                </div>
                <Link href="/dashboard" className="inline-flex items-center gap-2 bg-[var(--espresso)] px-5 py-3 text-sm text-white transition-colors hover:bg-[#3a2010]">
                  Open dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (hasOsce || hasQuiz) ? (
            <div className="mb-8border border-[rgba(26,24,21,0.08)] bg-white px-6 py-6 md:px-7">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="max-w-2xl">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/70">Access</p>
                  <h3 className="mt-2 font-display text-[1.75rem] leading-[1.08] text-[var(--espresso)]">One tool unlocked</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--charcoal)]">
                    Keep using what you own and add the other tool whenever you need it.
                  </p>
                </div>
                <Link href="/pricing" className="inline-flex items-center gap-2 border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.82)] px-5 py-3 text-sm text-[var(--espresso)] transition-colors hover:border-[rgba(26,24,21,0.16)]">
                  View Bundle <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : null}

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Profile & Products */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Profile Card */}
              <div className="border border-[rgba(26,24,21,0.08)] bg-white px-6 py-6 md:px-7">
                <div className="flex items-center gap-2 mb-5">
                  <User className="w-5 h-5 text-[var(--espresso)]" />
                  <h2 className="font-display text-[1.45rem] text-[var(--espresso)]">Profile</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.72)] p-4">
                    <div className="flex h-10 w-10 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white">
                      <Mail className="w-5 h-5 text-[var(--espresso)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-[var(--charcoal)]/55">Email</p>
                      <p className="text-sm text-[var(--espresso)] truncate">
                        {user?.emailAddresses?.[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.72)] p-4">
                    <div className="flex h-10 w-10 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white">
                      <Calendar className="w-5 h-5 text-[var(--espresso)]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[var(--charcoal)]/55">Member since</p>
                      <p className="text-sm text-[var(--espresso)]">
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

              {/* Products Card */}
              <div className="border border-[rgba(26,24,21,0.08)] bg-white px-6 py-6 md:px-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-[var(--espresso)]" />
                    <h2 className="font-display text-[1.45rem] text-[var(--espresso)]">Your tools</h2>
                  </div>
                  {(hasOsce || hasQuiz) && (
                    <span className="bg-[rgba(245,243,240,0.82)] px-2.5 py-1 text-xs text-[var(--espresso)]">
                      {hasBundle ? '2 owned' : '1 owned'}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {products.map((product) => {
                    const Icon = product.icon;
                    return (
                      <div
                        key={product.id}
                        className={`flex items-center justify-between gap-4 border px-4 py-4 transition-all ${
                          product.owned 
                            ? 'border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.72)]'
                            : 'border-dashed border-[rgba(26,24,21,0.16)] bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center border border-[rgba(26,24,21,0.08)] ${
                            product.owned ? 'bg-white' : 'bg-[rgba(245,243,240,0.82)]'
                          }`}>
                            <Icon className="w-5 h-5 text-[var(--espresso)]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[var(--espresso)]">{product.name}</span>
                              {product.owned && <CheckCircle2 className="w-4 h-4 text-[var(--espresso)]/70" />}
                            </div>
                            <p className="text-xs text-[var(--charcoal)]/65">{product.description}</p>
                          </div>
                        </div>
                        {product.owned ? (
                          <Link
                            href={product.href}
                            className="inline-flex items-center gap-1.5 bg-[var(--espresso)] px-4 py-2 text-sm text-white transition-colors hover:bg-[#3a2010]"
                          >
                            Launch <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <Link
                            href={`/pricing?product=${product.id}`}
                            className="inline-flex items-center gap-1.5 text-sm text-[var(--espresso)] hover:text-black"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            Unlock
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!hasOsce && !hasQuiz && (
                  <div className="mt-5 border border-dashed border-[rgba(26,24,21,0.16)] bg-[rgba(245,243,240,0.72)] px-5 py-6 text-center">
                    <p className="font-display text-[1.4rem] text-[var(--espresso)]">No tools unlocked yet</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--charcoal)]">
                      Start with a preview or head to pricing when you&apos;re ready.
                    </p>
                    <Link href="/pricing" className="mt-4 inline-flex items-center gap-2 bg-[var(--espresso)] px-5 py-3 text-sm text-white transition-colors hover:bg-[#3a2010]">
                      View pricing
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Quick Links */}
            <div className="space-y-6">
              <div className="border border-[rgba(26,24,21,0.08)] bg-white px-6 py-6">
                <h2 className="mb-4 font-display text-[1.45rem] text-[var(--espresso)]">Open now</h2>

                <div className="mb-4 border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.72)] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/60">Saved library</p>
                  <p className="mt-2 font-display text-[1.5rem] leading-[1.08] text-[var(--espresso)]">
                    {folders.length} {folders.length === 1 ? 'folder' : 'folders'}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-[var(--charcoal)]">
                    {totalSavedItems} {totalSavedItems === 1 ? 'saved page' : 'saved pages'}
                  </p>
                  <Link href="/dashboard#saved-resources" className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--espresso)]">
                    Open saved pages <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="group flex items-center gap-3 p-3 transition-colors hover:bg-[rgba(245,243,240,0.72)]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-[var(--espresso)]" />
                    </div>
                    <span className="text-sm text-[var(--espresso)]">Dashboard</span>
                  </Link>

                  {hasOsce ? (
                    <Link
                      href="/osce"
                      className="group flex items-center gap-3 p-3 transition-colors hover:bg-[rgba(245,243,240,0.72)]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white transition-colors">
                        <ClipboardCheck className="w-4 h-4 text-[var(--espresso)]" />
                      </div>
                      <span className="text-sm text-[var(--espresso)]">Open OSCE tool</span>
                    </Link>
                  ) : null}

                  {hasQuiz ? (
                    <Link
                      href="/quiz"
                      className="group flex items-center gap-3 p-3 transition-colors hover:bg-[rgba(245,243,240,0.72)]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white transition-colors">
                        <BookOpen className="w-4 h-4 text-[var(--espresso)]" />
                      </div>
                      <span className="text-sm text-[var(--espresso)]">Open quiz</span>
                    </Link>
                  ) : null}

                  <Link
                    href="/hub"
                    className="group flex items-center gap-3 p-3 transition-colors hover:bg-[rgba(245,243,240,0.72)]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white transition-colors">
                      <BookOpen className="w-4 h-4 text-[var(--espresso)]" />
                    </div>
                    <span className="text-sm text-[var(--espresso)]">Browse the hub</span>
                  </Link>

                  {!hasBundle ? (
                    <Link
                      href="/pricing"
                      className="group flex items-center gap-3 p-3 transition-colors hover:bg-[rgba(245,243,240,0.72)]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white transition-colors">
                        <CreditCard className="w-4 h-4 text-[var(--espresso)]" />
                      </div>
                      <span className="text-sm text-[var(--espresso)]">View pricing</span>
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="border border-[rgba(26,24,21,0.08)] bg-white px-6 py-6">
                <h2 className="mb-4 font-display text-[1.45rem] text-[var(--espresso)]">Help &amp; account</h2>
                <div className="space-y-2">
                  <Link
                    href="/contact"
                    className="group flex items-center gap-3 p-3 transition-colors hover:bg-[rgba(245,243,240,0.72)]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white transition-colors">
                      <MessageCircle className="w-4 h-4 text-[var(--espresso)]" />
                    </div>
                    <span className="text-sm text-[var(--espresso)]">Get help</span>
                  </Link>

                  <Link
                    href="/review"
                    className="group flex items-center gap-3 p-3 transition-colors hover:bg-[rgba(245,243,240,0.72)]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white transition-colors">
                      <Heart className="w-4 h-4 text-[var(--espresso)]" />
                    </div>
                    <span className="text-sm text-[var(--espresso)]">Leave a review</span>
                  </Link>

                  <a
                    href="https://accounts.clerk.dev/user"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 transition-colors hover:bg-[rgba(245,243,240,0.72)]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white transition-colors">
                      <Settings className="w-4 h-4 text-[var(--espresso)]" />
                    </div>
                    <span className="text-sm text-[var(--espresso)]">Edit profile</span>
                  </a>
                  
                  <Link
                    href="/privacy"
                    className="group flex items-center gap-3 p-3 transition-colors hover:bg-[rgba(245,243,240,0.72)]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white transition-colors">
                      <Shield className="w-4 h-4 text-[var(--espresso)]" />
                    </div>
                    <span className="text-sm text-[var(--espresso)]">Privacy policy</span>
                  </Link>
                  
                  <Link
                    href="/delete-data"
                    className="group flex items-center gap-3 p-3 transition-colors hover:bg-red-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center border border-red-100 bg-red-50 transition-colors group-hover:bg-red-100">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-sm text-red-600">Delete my data</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
