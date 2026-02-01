'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Scale, Heart, Shield, Users, AlertTriangle, CheckCircle2, Lightbulb, BookOpen, MessageSquare, Eye, XCircle } from 'lucide-react';

export default function Y1ProfessionalismEthicsPage() {
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
              <Scale className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                FREE
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-3">
            Y1 Professionalism & Ethics ⚖️
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg">
            Essential professional values and ethical principles that underpin safe, compassionate nursing practice.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        
        {/* NMC Code Overview */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)]">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--purple)]" />
            The NMC Code - Your Professional Foundation
          </h2>
          <p className="text-[var(--plum-dark)]/80 mb-4 text-sm">
            The NMC Code sets out the professional standards that all nurses and nursing students must uphold. It has four key themes:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { num: '1', title: 'Prioritise people', desc: 'Put patients first, treat with kindness and respect' },
              { num: '2', title: 'Practise effectively', desc: 'Assess, plan, deliver and evaluate care competently' },
              { num: '3', title: 'Preserve safety', desc: 'Act without delay if patient safety is at risk' },
              { num: '4', title: 'Promote professionalism & trust', desc: 'Uphold reputation of the profession' },
            ].map((theme) => (
              <div key={theme.num} className="bg-white rounded-lg p-3 border border-[var(--lavender)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-[var(--purple)] text-white text-xs flex items-center justify-center font-bold">{theme.num}</span>
                  <span className="font-medium text-[var(--plum)] text-sm">{theme.title}</span>
                </div>
                <p className="text-xs text-[var(--plum-dark)]/70 ml-8">{theme.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Four Ethical Principles */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6 text-blue-500" />
            The Four Ethical Principles
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-[var(--plum-dark)]/80">
              These four principles (Beauchamp & Childress) guide ethical decision-making in healthcare:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Autonomy
                </h3>
                <p className="text-sm text-blue-800/80 mb-2">
                  Respect the patient&apos;s right to make their own decisions
                </p>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-700 mb-1">In practice:</p>
                  <ul className="text-xs text-blue-800/70 space-y-1">
                    <li>• Provide information for informed decisions</li>
                    <li>• Respect refusal of treatment</li>
                    <li>• Support patient choice even if you disagree</li>
                    <li>• Gain valid consent before procedures</li>
                  </ul>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Beneficence
                </h3>
                <p className="text-sm text-emerald-800/80 mb-2">
                  Act in the best interest of the patient; do good
                </p>
                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">In practice:</p>
                  <ul className="text-xs text-emerald-800/70 space-y-1">
                    <li>• Provide evidence-based care</li>
                    <li>• Advocate for patient needs</li>
                    <li>• Act as a compassionate professional</li>
                    <li>• Consider overall wellbeing</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Non-maleficence
                </h3>
                <p className="text-sm text-red-800/80 mb-2">
                  Do no harm; avoid causing injury or suffering
                </p>
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="text-xs font-semibold text-red-700 mb-1">In practice:</p>
                  <ul className="text-xs text-red-800/70 space-y-1">
                    <li>• Check, check, and check again</li>
                    <li>• Know your limitations</li>
                    <li>• Report concerns and errors</li>
                    <li>• Follow safety protocols</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Justice
                </h3>
                <p className="text-sm text-purple-800/80 mb-2">
                  Treat all patients fairly and equitably
                </p>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className="text-xs font-semibold text-purple-700 mb-1">In practice:</p>
                  <ul className="text-xs text-purple-800/70 space-y-1">
                    <li>• No discrimination on any grounds</li>
                    <li>• Fair allocation of resources</li>
                    <li>• Equal access to care</li>
                    <li>• Challenge unfair practices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Consent */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            Consent
          </h2>
          
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-3">Valid Consent Requires:</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { title: 'Capacity', desc: 'Patient can understand, retain, weigh info, and communicate decision' },
                  { title: 'Information', desc: 'Risks, benefits, alternatives, and consequences of refusal explained' },
                  { title: 'Voluntary', desc: 'No coercion or undue pressure from anyone' },
                ].map((req) => (
                  <div key={req.title} className="bg-white rounded-lg p-3 border border-emerald-200">
                    <p className="font-semibold text-emerald-700 text-sm">{req.title}</p>
                    <p className="text-xs text-emerald-800/80">{req.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">Types of Consent</p>
                <ul className="text-sm text-emerald-800/80 space-y-1">
                  <li><strong>Implied:</strong> Holding out arm for BP check</li>
                  <li><strong>Verbal:</strong> Agreeing to medication</li>
                  <li><strong>Written:</strong> Surgery, procedures with significant risk</li>
                </ul>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">When Consent May Not Be Needed</p>
                <ul className="text-sm text-amber-800/80 space-y-1">
                  <li>• Emergency life-saving treatment (patient unconscious)</li>
                  <li>• Mental Health Act detainment</li>
                  <li>• Public health emergencies (certain conditions)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            Mental Capacity Act 2005 (Key Principles)
          </h2>
          
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3">5 Statutory Principles</h3>
              <ol className="space-y-2 list-decimal list-inside text-sm text-amber-800/80">
                <li><strong>Assume capacity</strong> - Every adult has capacity unless proven otherwise</li>
                <li><strong>Support decision-making</strong> - Help the person make their own decision if possible</li>
                <li><strong>Unwise decisions are allowed</strong> - A bad decision doesn&apos;t mean lack of capacity</li>
                <li><strong>Best interests</strong> - Decisions for someone lacking capacity must be in their best interests</li>
                <li><strong>Least restrictive</strong> - Choose the option that restricts rights/freedom least</li>
              </ol>
            </div>

            <div className="bg-white rounded-xl p-5 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3">Assessing Capacity (Two-Stage Test)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="font-semibold text-amber-700 mb-2">Stage 1: Impairment</p>
                  <p className="text-sm text-amber-800/80">
                    Is there an impairment of, or disturbance in, the functioning of the mind or brain?
                  </p>
                  <p className="text-xs text-amber-700/70 mt-2">
                    E.g., dementia, delirium, learning disability, intoxication, brain injury
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="font-semibold text-amber-700 mb-2">Stage 2: Functional Test</p>
                  <p className="text-sm text-amber-800/80">Can the person:</p>
                  <ul className="text-xs text-amber-800/70 mt-1 space-y-1">
                    <li>• <strong>Understand</strong> the information?</li>
                    <li>• <strong>Retain</strong> it long enough to decide?</li>
                    <li>• <strong>Weigh</strong> the information?</li>
                    <li>• <strong>Communicate</strong> their decision?</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confidentiality */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-pink-500" />
            Confidentiality
          </h2>
          
          <div className="space-y-4">
            <div className="bg-pink-50 rounded-xl p-5 border border-pink-200">
              <h3 className="font-semibold text-pink-800 mb-3">Key Principles</h3>
              <ul className="space-y-2">
                {[
                  'Patient information is confidential by default',
                  'Share only on a need-to-know basis within the care team',
                  'Gain consent before sharing with others',
                  'Don\'t discuss patients in public areas',
                  'Secure all records (paper and electronic)',
                  'Don\'t access records you don\'t need for patient care',
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-sm text-pink-800/80">
                    <CheckCircle2 className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
              <h3 className="font-semibold text-pink-800 mb-2">When You Can Break Confidentiality</h3>
              <ul className="text-sm text-pink-800/80 space-y-1">
                <li>• <strong>Patient consents</strong> to disclosure</li>
                <li>• <strong>Required by law</strong> (e.g., notifiable diseases, safeguarding, court order)</li>
                <li>• <strong>Public interest</strong> - serious harm to patient or others (rare - seek advice)</li>
                <li>• <strong>Sharing with other healthcare professionals</strong> for direct care (implied consent)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Professionalism in Practice */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            Professionalism in Practice
          </h2>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                <h3 className="font-semibold text-indigo-800 mb-2">Professional Behaviours</h3>
                <ul className="text-sm text-indigo-800/80 space-y-1">
                  {[
                    'Punctuality and reliability',
                    'Professional appearance (uniform policy)',
                    'Respectful communication',
                    'Taking responsibility for actions',
                    'Continuous learning and reflection',
                    'Working within scope of practice',
                    'Maintaining boundaries',
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-indigo-600 mt-1 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                <h3 className="font-semibold text-indigo-800 mb-2">Professional Boundaries</h3>
                <ul className="text-sm text-indigo-800/80 space-y-1">
                  {[
                    'No personal relationships with patients',
                    'Don\'t accept significant gifts',
                    'Maintain therapeutic relationship',
                    'No social media contact with patients',
                    'Don\'t share personal problems',
                    'Refer if personal feelings interfere',
                    'Self-disclosure only if therapeutic',
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Shield className="w-3 h-3 text-indigo-600 mt-1 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Raising Concerns */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-orange-500" />
            Raising Concerns (Duty of Candour)
          </h2>
          
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
              <p className="text-sm text-orange-800/80 mb-3">
                You have a <strong>professional duty</strong> to raise concerns if you believe patient safety is at risk, even if it feels difficult.
              </p>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-orange-700 mb-2">Steps to Raise a Concern</h3>
                <ol className="text-sm text-orange-800/80 space-y-1 list-decimal list-inside">
                  <li>Speak to your mentor/supervisor first if possible</li>
                  <li>Use your organisation&apos;s raising concerns procedure</li>
                  <li>Document your concerns clearly</li>
                  <li>If not resolved, escalate to more senior staff</li>
                  <li>External bodies: NMC, CQC, or prescribed persons if needed</li>
                </ol>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">Protection for Whistleblowers</p>
              <p className="text-sm text-orange-800/80">
                The Public Interest Disclosure Act 1998 protects staff who raise genuine concerns in good faith. You should not be penalised for raising safety concerns through proper channels.
              </p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-sky-500" />
            Social Media & Digital Professionalism
          </h2>
          
          <div className="space-y-4">
            <div className="bg-sky-50 rounded-xl p-5 border border-sky-200">
              <h3 className="font-semibold text-sky-800 mb-3">Golden Rules</h3>
              <ul className="grid md:grid-cols-2 gap-2">
                {[
                  'Never post identifiable patient information',
                  'Don\'t add/accept patients on social media',
                  'Don\'t discuss work complaints online',
                  'Be mindful that posts reflect on the profession',
                  'Use privacy settings appropriately',
                  'Don\'t post photos from workplace',
                  'Think before you post - would NMC approve?',
                  'Remember: employers and NMC can see posts',
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-sm text-sky-800/80">
                    <Shield className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Red Flags */}
        <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
          <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Fitness to Practise - What Could Get You in Trouble
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { issue: 'Dishonesty', eg: 'Falsifying records, plagiarism, lying' },
              { issue: 'Patient harm', eg: 'Through neglect or incompetence' },
              { issue: 'Breach of confidentiality', eg: 'Sharing patient info inappropriately' },
              { issue: 'Boundary violations', eg: 'Personal/sexual relationships with patients' },
              { issue: 'Criminal behaviour', eg: 'Theft, violence, drink-driving' },
              { issue: 'Substance misuse', eg: 'Drugs, alcohol affecting practice' },
              { issue: 'Social media misconduct', eg: 'Posting patient info, inappropriate content' },
              { issue: 'Failure to raise concerns', eg: 'Not reporting safety issues' },
            ].map((item) => (
              <div key={item.issue} className="bg-white rounded-lg p-3 border border-red-200">
                <p className="font-semibold text-red-700 text-sm">{item.issue}</p>
                <p className="text-xs text-red-800/70">{item.eg}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)]">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[var(--purple)]" />
            The &quot;Newspaper Test&quot;
          </h2>
          <p className="text-sm text-[var(--plum-dark)]/80">
            Before any action, ask yourself: <strong>&quot;How would this look on the front page of a newspaper?&quot;</strong>
          </p>
          <p className="text-sm text-[var(--plum-dark)]/80 mt-2">
            If you wouldn&apos;t want your actions reported publicly, reconsider what you&apos;re about to do. This simple test helps maintain professional standards.
          </p>
        </div>

        {/* Back to Hub */}
        <div className="text-center pt-8">
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-[var(--purple)] hover:text-[var(--plum)] font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Nursing Hub
          </Link>
        </div>
      </main>
    </div>
  );
}
