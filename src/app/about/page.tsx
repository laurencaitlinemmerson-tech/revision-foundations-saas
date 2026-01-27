'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Heart, BookOpen, Users, Sparkles, GraduationCap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen gradient-bg-light">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block bg-[var(--lilac-tint)] text-[var(--lavender-primary)] px-4 py-1 rounded-full text-sm font-semibold mb-4">
              ABOUT US
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--plum-text)] mb-6">
              Built by Students,<br />For Students
            </h1>
            <p className="text-lg text-[var(--plum-text)]/70 max-w-2xl mx-auto">
              We understand the challenges of nursing education because we&apos;ve been there.
            </p>
          </div>

          {/* Story Section */}
          <div className="glass-card p-8 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--purple-gradient-start)] to-[var(--purple-gradient-end)] flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--plum-text)]">
                Our Story
              </h2>
            </div>
            <div className="space-y-4 text-[var(--plum-text)]/80">
              <p>
                Revision Foundations was born out of a real need. As first-year children&apos;s nursing
                students, we found ourselves overwhelmed by the sheer volume of content to learn
                and the pressure of upcoming OSCE exams.
              </p>
              <p>
                We searched for revision tools that were specifically designed for our course,
                but couldn&apos;t find anything that hit the mark. So, we decided to create our own.
              </p>
              <p>
                What started as personal study aids quickly grew into something bigger. Our
                classmates loved them, and we realised these tools could help nursing students
                everywhere.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: GraduationCap,
                title: 'Student-Focused',
                description: 'Every feature is designed with the student experience in mind.',
              },
              {
                icon: BookOpen,
                title: 'Quality Content',
                description: 'Carefully crafted questions and checklists aligned with nursing curricula.',
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Built to support nursing students on their journey to becoming qualified nurses.',
              },
            ].map((value, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[var(--lilac-tint)] flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-[var(--lavender-primary)]" />
                </div>
                <h3 className="font-semibold text-[var(--plum-text)] mb-2">{value.title}</h3>
                <p className="text-sm text-[var(--plum-text)]/70">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="glass-card p-8 bg-gradient-to-r from-[var(--purple-gradient-start)]/10 to-[var(--purple-gradient-end)]/10 border-[var(--lavender-primary)]/30">
            <h2 className="font-display text-xl font-bold text-[var(--plum-text)] mb-4 text-center">
              Our Mission
            </h2>
            <p className="text-center text-[var(--plum-text)]/80 max-w-2xl mx-auto">
              To provide accessible, high-quality revision tools that help nursing students
              feel confident and prepared for their exams, without breaking the bank.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-[var(--plum-text)]/70 mb-4">
              Ready to start your revision journey?
            </p>
            <Link href="/pricing" className="btn-gradient inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              View Our Tools
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
