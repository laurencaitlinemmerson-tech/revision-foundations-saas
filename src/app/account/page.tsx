import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import { 
  User, 
  Mail, 
  Calendar, 
  Package, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
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

  const products = [
    {
      id: 'osce',
      name: "OSCE Practice Tool",
      description: "50+ timed clinical stations",
      owned: hasOsce,
      href: '/osce',
      icon: ClipboardCheck,
      color: 'purple',
    },
    {
      id: 'quiz',
      name: 'Core Knowledge Quiz',
      description: "17 topic areas with instant feedback",
      owned: hasQuiz,
      href: '/quiz',
      icon: BookOpen,
      color: 'pink',
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-8 bg-gradient-to-b from-[var(--lilac-soft)] via-[var(--pink-soft)]/30 to-cream relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.15 }} />
        <div className="blob blob-2" style={{ opacity: 0.15 }} />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--purple)] to-[var(--lavender)] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || '👋'}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--plum)]">
                Hey, {user?.firstName || 'lovely'}! 👋
              </h1>
              <p className="text-[var(--plum-dark)]/60">
                Manage your account and view your products
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Status Banner */}
          {hasBundle ? (
            <div className="card bg-gradient-to-r from-[var(--mint)]/30 to-emerald-50 border-2 border-[var(--mint)] mb-8 -mt-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎉</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">👑</span>
                    <h3 className="font-semibold text-emerald-800">Full Access Member</h3>
                  </div>
                  <p className="text-sm text-emerald-700">You have lifetime access to all tools. Thank you for your support!</p>
                </div>
              </div>
            </div>
          ) : (hasOsce || hasQuiz) ? (
            <div className="card bg-[var(--lilac-soft)] border-[var(--lavender)] mb-8 -mt-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">✨</div>
                  <div>
                    <h3 className="font-semibold text-[var(--plum)]">Want both tools?</h3>
                    <p className="text-sm text-[var(--plum-dark)]/60">Get the bundle and save!</p>
                  </div>
                </div>
                <Link href="/pricing" className="bg-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all flex items-center gap-2">
                  View Bundle <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : null}

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Profile & Products */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Profile Card */}
              <div className="card">
                <div className="flex items-center gap-2 mb-5">
                  <User className="w-5 h-5 text-[var(--purple)]" />
                  <h2 className="font-semibold text-[var(--plum)]">Profile</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[var(--lilac-soft)]/50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-[var(--lilac)] flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[var(--purple)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--plum-dark)]/50 uppercase tracking-wide">Email</p>
                      <p className="text-sm text-[var(--plum)] truncate">
                        {user?.emailAddresses?.[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-[var(--lilac-soft)]/50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-[var(--lilac)] flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[var(--purple)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--plum-dark)]/50 uppercase tracking-wide">Member Since</p>
                      <p className="text-sm text-[var(--plum)]">
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
              <div className="card">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-[var(--purple)]" />
                    <h2 className="font-semibold text-[var(--plum)]">My Products</h2>
                  </div>
                  {(hasOsce || hasQuiz) && (
                    <span className="text-xs bg-[var(--mint)] text-emerald-700 px-2.5 py-1 rounded-full font-medium">
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
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          product.owned 
                            ? 'bg-gradient-to-r from-[var(--mint)]/20 to-emerald-50/50 border-[var(--mint)]' 
                            : 'bg-[var(--lilac-soft)]/30 border-[var(--lilac-medium)] border-dashed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            product.owned ? 'bg-emerald-100' : 'bg-[var(--lilac)]'
                          }`}>
                            <Icon className={`w-5 h-5 ${product.owned ? 'text-emerald-600' : 'text-[var(--purple)]'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[var(--plum)]">{product.name}</span>
                              {product.owned && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            </div>
                            <p className="text-xs text-[var(--plum-dark)]/60">{product.description}</p>
                          </div>
                        </div>
                        {product.owned ? (
                          <Link
                            href={product.href}
                            className="bg-[var(--purple)] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[var(--plum)] transition-all flex items-center gap-1.5"
                          >
                            Launch <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <Link
                            href={`/pricing?product=${product.id}`}
                            className="flex items-center gap-1.5 text-sm text-[var(--purple)] hover:text-[var(--plum)] font-medium"
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
                  <div className="mt-5 p-5 bg-gradient-to-br from-[var(--lilac-soft)] to-white rounded-xl text-center border border-[var(--lavender)]/50">
                    <div className="text-4xl mb-3">✨</div>
                    <p className="text-[var(--plum)] font-medium mb-1">Ready to start revising?</p>
                    <p className="text-sm text-[var(--plum-dark)]/60 mb-4">
                      Unlock tools to help you feel confident for exams and placements!
                    </p>
                    <Link href="/pricing" className="bg-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all inline-flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      View Products
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Quick Links */}
            <div className="space-y-6">
              {/* Quick Links */}
              <div className="card">
                <h2 className="font-semibold text-[var(--plum)] mb-4">Quick Links</h2>
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--lilac-soft)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--lilac-soft)] group-hover:bg-[var(--lilac)] flex items-center justify-center transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-[var(--purple)]" />
                    </div>
                    <span className="text-sm text-[var(--plum)]">Dashboard</span>
                  </Link>
                  
                  <Link
                    href="/hub"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--lilac-soft)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--lilac-soft)] group-hover:bg-[var(--lilac)] flex items-center justify-center transition-colors">
                      <Sparkles className="w-4 h-4 text-[var(--purple)]" />
                    </div>
                    <span className="text-sm text-[var(--plum)]">Nursing Hub</span>
                  </Link>
                  
                  <Link
                    href="/pricing"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--lilac-soft)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--lilac-soft)] group-hover:bg-[var(--lilac)] flex items-center justify-center transition-colors">
                      <CreditCard className="w-4 h-4 text-[var(--purple)]" />
                    </div>
                    <span className="text-sm text-[var(--plum)]">Pricing</span>
                  </Link>
                  
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--lilac-soft)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--lilac-soft)] group-hover:bg-[var(--lilac)] flex items-center justify-center transition-colors">
                      <MessageCircle className="w-4 h-4 text-[var(--purple)]" />
                    </div>
                    <span className="text-sm text-[var(--plum)]">Get Help</span>
                  </Link>
                  
                  <Link
                    href="/review"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--lilac-soft)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--pink-soft)] group-hover:bg-[var(--pink-soft)] flex items-center justify-center transition-colors">
                      <Heart className="w-4 h-4 text-[var(--pink)]" />
                    </div>
                    <span className="text-sm text-[var(--plum)]">Leave a Review</span>
                  </Link>
                </div>
              </div>

              {/* Account Settings */}
              <div className="card">
                <h2 className="font-semibold text-[var(--plum)] mb-4">Account Settings</h2>
                <div className="space-y-2">
                  <a
                    href="https://accounts.clerk.dev/user"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--lilac-soft)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--lilac-soft)] group-hover:bg-[var(--lilac)] flex items-center justify-center transition-colors">
                      <Settings className="w-4 h-4 text-[var(--purple)]" />
                    </div>
                    <span className="text-sm text-[var(--plum)]">Edit Profile</span>
                  </a>
                  
                  <Link
                    href="/privacy"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--lilac-soft)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--lilac-soft)] group-hover:bg-[var(--lilac)] flex items-center justify-center transition-colors">
                      <Shield className="w-4 h-4 text-[var(--purple)]" />
                    </div>
                    <span className="text-sm text-[var(--plum)]">Privacy Policy</span>
                  </Link>
                  
                  <Link
                    href="/delete-data"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-sm text-red-600">Delete My Data</span>
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
