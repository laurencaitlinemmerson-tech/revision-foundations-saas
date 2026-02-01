'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Briefcase, Clock, Heart, MessageSquare, CheckCircle2, AlertTriangle, Lightbulb, BookOpen, Users, Coffee, Sparkles, Target, Calendar, FileText } from 'lucide-react';

export default function PlacementSurvivalPage() {
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
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                FREE
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-3">
            Placement Survival Guide 🏥
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg">
            Everything you need to know to survive and thrive on your nursing placements.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        
        {/* Before Placement */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)]">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--purple)]" />
            Before Placement Starts
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { item: 'Contact your placement', detail: 'Call or email to confirm start time, location, parking, dress code' },
              { item: 'Prepare your uniform', detail: 'Clean, ironed, appropriate footwear. Check Trust policy on jewellery' },
              { item: 'Gather essentials', detail: 'Pen (black), small notebook, fob watch, ID badge, snacks, water bottle' },
              { item: 'Review patient group', detail: 'Research the speciality - common conditions, procedures, terminology' },
              { item: 'Check your PAD/ePAD', detail: 'Know what competencies you need to achieve' },
              { item: 'Plan your route', detail: 'Do a practice run if possible. Account for traffic/parking' },
            ].map((prep) => (
              <div key={prep.item} className="bg-white rounded-lg p-3 border border-[var(--lavender)]">
                <p className="font-medium text-[var(--plum)] text-sm">{prep.item}</p>
                <p className="text-xs text-[var(--plum-dark)]/70">{prep.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* First Day */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Your First Day
          </h2>
          
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3">First Day Checklist</h3>
              <ul className="space-y-2">
                {[
                  { task: 'Arrive 15 minutes early', tip: 'Find where to go, sign in, settle nerves' },
                  { task: 'Introduce yourself', tip: '"Hi, I\'m [name], a Year [X] student nurse. This is my first day."' },
                  { task: 'Get a tour', tip: 'Fire exits, toilets, staff room, supplies, emergency equipment' },
                  { task: 'Meet your mentor/supervisor', tip: 'Discuss learning objectives and how you\'ll work together' },
                  { task: 'Write down key info', tip: 'Ward phone number, key contacts, handover times, meal times' },
                  { task: 'Observe and absorb', tip: 'First day is for getting oriented - don\'t pressure yourself' },
                ].map((item) => (
                  <li key={item.task} className="bg-white rounded-lg p-3 border border-amber-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800 text-sm">{item.task}</p>
                        <p className="text-xs text-amber-700/70">{item.tip}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Building Relationships */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Building Relationships
          </h2>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">With Your Mentor</h3>
                <ul className="text-sm text-blue-800/80 space-y-1">
                  <li>• Be proactive - don&apos;t wait to be told what to do</li>
                  <li>• Ask for feedback regularly</li>
                  <li>• Share your learning objectives early</li>
                  <li>• Be honest about what you can/can&apos;t do</li>
                  <li>• Thank them for their time and teaching</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">With the Team</h3>
                <ul className="text-sm text-blue-800/80 space-y-1">
                  <li>• Learn everyone&apos;s names (write them down!)</li>
                  <li>• Offer help with small tasks</li>
                  <li>• Be reliable and follow through</li>
                  <li>• Show enthusiasm and willingness to learn</li>
                  <li>• Be respectful of all roles - HCAs, cleaners, porters</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">With Patients</h3>
              <ul className="grid md:grid-cols-2 gap-2 text-sm text-blue-800/80">
                {[
                  'Introduce yourself clearly with your role',
                  'Use their preferred name (ask!)',
                  'Make eye contact and active listening',
                  'Explain what you\'re doing and why',
                  'Maintain privacy and dignity always',
                  'Be genuinely interested in them as a person',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Magic Phrases */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-500" />
            Magic Phrases for Students
          </h2>
          
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { phrase: '"Can I help with that?"', when: 'Shows initiative and willingness' },
                  { phrase: '"I haven\'t done this before - can you show me?"', when: 'Honest and shows eagerness to learn' },
                  { phrase: '"I\'m not sure, let me find out"', when: 'Better than guessing or making things up' },
                  { phrase: '"Can I observe this procedure?"', when: 'Great for learning new skills' },
                  { phrase: '"Could you give me some feedback?"', when: 'Shows you want to improve' },
                  { phrase: '"Is there anything else I can do?"', when: 'Shows proactivity at quiet times' },
                  { phrase: '"Thank you for showing me that"', when: 'Shows appreciation for teaching' },
                  { phrase: '"I need to escalate this"', when: 'When you recognise something isn\'t right' },
                ].map((item) => (
                  <div key={item.phrase} className="bg-white rounded-lg p-3 border border-purple-200">
                    <p className="font-medium text-purple-800 text-sm italic">{item.phrase}</p>
                    <p className="text-xs text-purple-700/70 mt-1">{item.when}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Common Challenges */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            Common Challenges & How to Handle Them
          </h2>
          
          <div className="space-y-3">
            {[
              { 
                challenge: 'Feeling like you\'re in the way', 
                solution: 'This is normal! Ask "where would be helpful for me to stand?" Stay close to your mentor. Offer to get supplies or help with small tasks.'
              },
              { 
                challenge: 'Not knowing what to do', 
                solution: 'Ask! "What would you like me to focus on today?" Use quiet time to review notes, read care plans, or observe documentation.'
              },
              { 
                challenge: 'Difficult mentor relationship', 
                solution: 'Stay professional. Try to understand their perspective. If serious, speak to your Academic Assessor or placement coordinator early.'
              },
              { 
                challenge: 'Witnessing poor practice', 
                solution: 'Don\'t copy it. Speak to your mentor/academic if unsure. Remember your duty to report concerns about patient safety.'
              },
              { 
                challenge: 'Making a mistake', 
                solution: 'Own it immediately. Report it honestly. Learn from it. Everyone makes mistakes - it\'s how you handle them that matters.'
              },
              { 
                challenge: 'Emotional situations', 
                solution: 'It\'s okay to be affected. Take a moment if needed. Debrief with mentor. Reflect on it. Seek support if struggling.'
              },
              { 
                challenge: 'Long shifts exhaustion', 
                solution: 'Prepare food in advance. Stay hydrated. Rest on days off. It gets easier as you adjust.'
              },
            ].map((item) => (
              <div key={item.challenge} className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <p className="font-semibold text-orange-800 text-sm mb-1">{item.challenge}</p>
                <p className="text-sm text-orange-800/80">{item.solution}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Maximising Learning */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-500" />
            Maximising Your Learning
          </h2>
          
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-3">Active Learning Strategies</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { strategy: 'Follow a patient through their journey', desc: 'Admission to discharge gives big-picture understanding' },
                  { strategy: 'Attend MDT meetings & ward rounds', desc: 'See how teams communicate and make decisions' },
                  { strategy: 'Ask "why" questions', desc: '"Why do we check that?" "Why is this medication given?"' },
                  { strategy: 'Practice skills as often as possible', desc: 'Repetition builds confidence and competence' },
                  { strategy: 'Review patient notes', desc: 'Learn the language and how conditions progress' },
                  { strategy: 'Use quiet time productively', desc: 'Study, read policies, ask questions about equipment' },
                ].map((item) => (
                  <div key={item.strategy} className="bg-white rounded-lg p-3 border border-emerald-200">
                    <p className="font-medium text-emerald-700 text-sm">{item.strategy}</p>
                    <p className="text-xs text-emerald-800/70">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Reflective Practice
              </h3>
              <p className="text-sm text-emerald-800/80 mb-2">
                Use a model like Gibbs&apos; Reflective Cycle:
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Description', 'Feelings', 'Evaluation', 'Analysis', 'Conclusion', 'Action Plan'].map((stage, i) => (
                  <span key={stage} className="px-3 py-1.5 rounded-full bg-emerald-200 text-emerald-800">
                    {i + 1}. {stage}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Documentation & PAD */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-pink-500" />
            PAD/ePAD & Documentation
          </h2>
          
          <div className="space-y-4">
            <div className="bg-pink-50 rounded-xl p-5 border border-pink-200">
              <h3 className="font-semibold text-pink-800 mb-3">Staying on Top of Your PAD</h3>
              <ul className="space-y-2">
                {[
                  { tip: 'Review your PAD before each placement', detail: 'Know what proficiencies and skills you need to achieve' },
                  { tip: 'Schedule regular meetings with your mentor', detail: 'Weekly is ideal - don\'t leave everything to the end' },
                  { tip: 'Document as you go', detail: 'Write up experiences and evidence regularly, not all at once' },
                  { tip: 'Be specific in your evidence', detail: 'Use STAR method: Situation, Task, Action, Result' },
                  { tip: 'Get feedback in writing', detail: 'Ask your mentor to document observations' },
                  { tip: 'Don\'t forge signatures or evidence', detail: 'Academic misconduct has serious consequences' },
                ].map((item) => (
                  <li key={item.tip} className="bg-white rounded-lg p-3 border border-pink-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-pink-800 text-sm">{item.tip}</p>
                        <p className="text-xs text-pink-700/70">{item.detail}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Self Care */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Coffee className="w-6 h-6 text-amber-500" />
            Self-Care on Placement
          </h2>
          
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <p className="text-sm text-amber-800/80 mb-4 italic">
                &quot;You can&apos;t pour from an empty cup&quot; - looking after yourself IS part of being a good nurse.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { area: 'Physical', tips: 'Eat properly, stay hydrated, wear comfy shoes, rest on days off' },
                  { area: 'Emotional', tips: 'Debrief after tough shifts, talk to someone, it\'s okay to cry' },
                  { area: 'Social', tips: 'Stay connected with friends/family, don\'t isolate yourself' },
                  { area: 'Practical', tips: 'Meal prep, sort uniform night before, plan your commute' },
                ].map((item) => (
                  <div key={item.area} className="bg-white rounded-lg p-3 border border-amber-200">
                    <p className="font-semibold text-amber-700 text-sm">{item.area}</p>
                    <p className="text-xs text-amber-800/70">{item.tips}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Remember</p>
              <ul className="text-sm text-amber-800/80 space-y-1">
                <li>• It&apos;s okay to have bad days - they don&apos;t define you</li>
                <li>• Imposter syndrome is normal - most students feel it</li>
                <li>• Asking for help is a strength, not a weakness</li>
                <li>• Your university has support services - use them</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Info */}
        <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
          <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            When to Escalate or Seek Help
          </h2>
          <ul className="space-y-2">
            {[
              'Patient safety concern - speak to your mentor/senior immediately',
              'Bullying or harassment - report to placement coordinator/university',
              'Witnessed malpractice - follow raising concerns procedure',
              'You feel unsafe - remove yourself and report',
              'Mental health struggling - contact university support/GP',
              'Needlestick injury - follow Trust protocol immediately (within 1 hour)',
              'Placement breakdown - contact Academic Assessor early, don\'t wait until it\'s too late',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Tips Card */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)]">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[var(--purple)]" />
            Lauren&apos;s Top Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'Remember why you started - your compassion is your superpower',
              'Celebrate small wins - first successful cannula, first thank you',
              'Be kind to yourself on hard days',
              'Every registered nurse was once where you are now',
              'The best nurses never stop learning',
              'You\'ve got this! 💪',
            ].map((tip) => (
              <div key={tip} className="bg-white rounded-lg p-3">
                <p className="text-sm text-[var(--plum)]">{tip}</p>
              </div>
            ))}
          </div>
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
