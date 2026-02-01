'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowLeft, FileText, Clock, Shield, CheckCircle2, XCircle, AlertTriangle, Lightbulb, PenTool, Eye, Lock } from 'lucide-react';

export default function Y1DocumentationPage() {
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
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                FREE
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-3">
            Y1 Documentation & Record Keeping 📝
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg">
            Essential documentation skills for safe, legal, and professional nursing practice.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        
        {/* Why Documentation Matters */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)]">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[var(--purple)]" />
            Why Documentation Matters
          </h2>
          <p className="text-[var(--plum-dark)]/80 mb-4 text-sm">
            &quot;If it isn&apos;t documented, it didn&apos;t happen&quot; - This phrase captures the legal and clinical importance of accurate records.
          </p>
          <ul className="grid md:grid-cols-2 gap-2">
            {[
              'Provides continuity of care between shifts',
              'Legal protection for you and the patient',
              'Communication between MDT members',
              'Evidence base for clinical decisions',
              'Quality improvement and audit',
              'Required by NMC Code of Conduct',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[var(--plum-dark)]/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* NMC Standards */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            NMC Record Keeping Standards
          </h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Records Must Be:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { title: 'Clear & Accurate', desc: 'Factual, consistent, and without jargon patients wouldn\'t understand' },
                  { title: 'Legible', desc: 'If handwritten, must be readable; use black ink' },
                  { title: 'Timely', desc: 'Documented as soon as possible after care given' },
                  { title: 'Signed & Dated', desc: 'With full name, designation, date and time' },
                  { title: 'Without Alterations', desc: 'No correction fluid; single line through errors with signature' },
                  { title: 'Contemporaneous', desc: 'Made at the time of the event or as soon as practical' },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="font-semibold text-blue-700 text-sm">{item.title}</p>
                    <p className="text-xs text-blue-800/80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* What to Document */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <PenTool className="w-6 h-6 text-emerald-500" />
            What to Document
          </h2>
          
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-3">Essential Elements</h3>
              <ul className="space-y-2">
                {[
                  { item: 'Assessment findings', eg: 'Patient observations, physical assessment, patient-reported symptoms' },
                  { item: 'Care given', eg: 'Medications administered, treatments, procedures' },
                  { item: 'Patient response', eg: 'How they responded to treatment, changes in condition' },
                  { item: 'Referrals & escalations', eg: 'Who was contacted, when, and their response/advice' },
                  { item: 'Patient wishes & consent', eg: 'Verbal consent obtained, patient preferences discussed' },
                  { item: 'Discharge planning', eg: 'Education provided, follow-up arrangements' },
                  { item: 'Incidents & near-misses', eg: 'Falls, medication errors, witnessed events' },
                ].map((doc) => (
                  <li key={doc.item} className="bg-white rounded-lg p-3 border border-emerald-200">
                    <p className="font-semibold text-emerald-700 text-sm">{doc.item}</p>
                    <p className="text-xs text-emerald-800/80"><strong>E.g.:</strong> {doc.eg}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SBAR Framework */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-500" />
            SBAR Communication Framework
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-[var(--plum-dark)]/80">
              Use SBAR for structured handovers and documentation of escalations:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">S</span>
                  <p className="font-semibold text-purple-800">Situation</p>
                </div>
                <p className="text-sm text-purple-800/80">What is happening right now?</p>
                <p className="text-xs text-purple-700/70 mt-1 italic">&quot;I&apos;m calling about Mr Smith in bed 4 who has become acutely short of breath&quot;</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">B</span>
                  <p className="font-semibold text-blue-800">Background</p>
                </div>
                <p className="text-sm text-blue-800/80">What is the clinical context?</p>
                <p className="text-xs text-blue-700/70 mt-1 italic">&quot;He&apos;s 78, admitted with COPD exacerbation yesterday, was stable on 2L O2&quot;</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center">A</span>
                  <p className="font-semibold text-amber-800">Assessment</p>
                </div>
                <p className="text-sm text-amber-800/80">What do you think the problem is?</p>
                <p className="text-xs text-amber-700/70 mt-1 italic">&quot;His O2 sats have dropped to 85%, RR 28, NEWS score is now 7 - I&apos;m concerned he&apos;s deteriorating&quot;</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">R</span>
                  <p className="font-semibold text-emerald-800">Recommendation</p>
                </div>
                <p className="text-sm text-emerald-800/80">What do you need?</p>
                <p className="text-xs text-emerald-700/70 mt-1 italic">&quot;I&apos;d like you to come and review him urgently please&quot;</p>
              </div>
            </div>
          </div>
        </div>

        {/* Good vs Bad Documentation */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-orange-500" />
            Examples: Good vs Poor Documentation
          </h2>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Poor Documentation
                </h3>
                <ul className="space-y-2">
                  {[
                    '"Patient fine"',
                    '"Meds given"',
                    '"Obs done"',
                    '"Pt slept well"',
                    '"Reviewed by Dr"',
                    '"Pain managed"',
                  ].map((bad) => (
                    <li key={bad} className="text-sm text-red-800/80 bg-white rounded-lg p-2 border border-red-200">
                      {bad}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Good Documentation
                </h3>
                <ul className="space-y-2">
                  {[
                    '"Patient reports feeling better, pain reduced from 7/10 to 3/10 post-analgesia"',
                    '"Paracetamol 1g PO administered at 14:30 as prescribed for headache"',
                    '"0800 obs: BP 128/76, HR 72, RR 16, SpO2 98% RA, Temp 36.8°C"',
                    '"Patient slept 2300-0600 with no call bell use, denies pain"',
                    '"Dr Patel reviewed at 10:15, plan to continue current treatment, repeat bloods tomorrow"',
                    '"Pain 6/10 at 09:00, Morphine 5mg SC given, re-assessed at 09:30 - pain now 2/10"',
                  ].map((good) => (
                    <li key={good} className="text-sm text-emerald-800/80 bg-white rounded-lg p-2 border border-emerald-200">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Correcting Errors */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <PenTool className="w-6 h-6 text-amber-500" />
            Correcting Documentation Errors
          </h2>
          
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3">Paper Records</h3>
              <ol className="space-y-2 list-decimal list-inside text-sm text-amber-800/80">
                <li>Draw a <strong>single line</strong> through the error (so it&apos;s still readable)</li>
                <li>Write <strong>&quot;error&quot;</strong> or &quot;written in error&quot; next to it</li>
                <li><strong>Sign and date</strong> the correction</li>
                <li>Write the correct information nearby</li>
              </ol>
              <div className="bg-white rounded-lg p-3 mt-3 border border-amber-200">
                <p className="text-sm text-amber-800 font-mono">
                  <span className="line-through">BP 180/90</span> <span className="text-xs">error - JSmith 14/03/24</span><br/>
                  BP 128/90
                </p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3">Electronic Records</h3>
              <ul className="space-y-1 text-sm text-amber-800/80">
                <li>• Use the system&apos;s <strong>amendment/addendum</strong> function</li>
                <li>• Never delete - add a note explaining the correction</li>
                <li>• System usually creates an automatic audit trail</li>
                <li>• Follow your Trust&apos;s specific policy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Confidentiality */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-pink-500" />
            Confidentiality & Data Protection
          </h2>
          
          <div className="space-y-4">
            <div className="bg-pink-50 rounded-xl p-5 border border-pink-200">
              <h3 className="font-semibold text-pink-800 mb-3">Key Rules</h3>
              <ul className="grid md:grid-cols-2 gap-2">
                {[
                  'Never share login credentials',
                  'Log out when leaving a computer',
                  'Don\'t leave records visible/unattended',
                  'Use secure systems for patient info',
                  'Don\'t discuss patients in public areas',
                  'Only access records you need for care',
                  'Don\'t take photos of records/patients',
                  'Follow Caldicott Principles',
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-sm text-pink-800/80">
                    <CheckCircle2 className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                <p className="text-xs font-semibold text-pink-600 uppercase tracking-wide mb-2">📋 Sharing Information</p>
                <p className="text-sm text-pink-800/80">
                  Share on a <strong>need-to-know basis</strong> within the care team. For disclosure outside the team, check:
                </p>
                <ul className="text-xs text-pink-800/70 mt-2 space-y-1">
                  <li>• Patient consent?</li>
                  <li>• Statutory requirement?</li>
                  <li>• Public interest?</li>
                </ul>
              </div>
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                <p className="text-xs font-semibold text-pink-600 uppercase tracking-wide mb-2">📋 Caldicott Principles</p>
                <ul className="text-xs text-pink-800/70 space-y-1">
                  <li>1. Justify the purpose</li>
                  <li>2. Use only when necessary</li>
                  <li>3. Use minimum necessary</li>
                  <li>4. Access on need-to-know</li>
                  <li>5. Everyone must understand their duties</li>
                  <li>6. Comply with the law</li>
                  <li>7. Duty to share can be as important as protecting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Common Pitfalls */}
        <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
          <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Documentation Don&apos;ts
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { dont: 'Document before care is given', why: 'If care doesn\'t happen, record is false' },
              { dont: 'Use correction fluid/erase', why: 'Looks like you\'re hiding something' },
              { dont: 'Leave gaps or blank spaces', why: 'Others could add false information' },
              { dont: 'Use unprofessional language', why: 'Records are legal documents' },
              { dont: 'Include personal opinions', why: 'Stick to objective facts' },
              { dont: 'Copy-paste without checking', why: 'May include incorrect information' },
              { dont: 'Use unapproved abbreviations', why: 'Can cause misinterpretation' },
              { dont: 'Document for someone else', why: 'Each person signs their own care' },
            ].map((item) => (
              <div key={item.dont} className="bg-white rounded-lg p-3 border border-red-200">
                <p className="font-semibold text-red-700 text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  {item.dont}
                </p>
                <p className="text-xs text-red-800/70 ml-6">{item.why}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timing Reference */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)]">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--purple)]" />
            Timing Reference
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { when: 'Routine care', timing: 'Document at end of shift or episode' },
              { when: 'Medication administration', timing: 'Document immediately after giving' },
              { when: 'Significant events', timing: 'Document as soon as safe to do so' },
              { when: 'Escalations/calls to doctors', timing: 'Document immediately with time' },
              { when: 'Deteriorating patient', timing: 'Document in real-time if possible' },
              { when: 'Record retention', timing: '8 years adult, 25 years children/maternity' },
            ].map((t) => (
              <div key={t.when} className="bg-white rounded-lg p-3">
                <p className="text-sm font-medium text-[var(--plum)]">{t.when}</p>
                <p className="text-xs text-[var(--plum-dark)]/70">{t.timing}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags */}
        <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
          <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            When Documentation is Critical
          </h2>
          <ul className="space-y-2">
            {[
              'Patient deterioration - document all observations, escalations, and responses',
              'Medication errors - document what happened, actions taken, who was informed',
              'Falls or incidents - complete incident form AND document in notes',
              'Patient complaints or concerns - record factually and objectively',
              'Capacity assessments - document the assessment process and decision',
              'Safeguarding concerns - detailed factual account with who was informed',
              'End of life decisions - DNACPR discussions, advance care planning',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
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
