'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Brain, Heart, Users, Baby, GraduationCap, AlertTriangle, CheckCircle2, Lightbulb, Eye, Scale } from 'lucide-react';

export default function TheoriesOfDevelopmentPage() {
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
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                FREE
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-3">
            Theories of Development 🧒
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg">
            Essential developmental theories for nursing practice, from Piaget to Bowlby - with clinical applications.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        
        {/* Why This Matters */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)]">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[var(--purple)]" />
            Why Developmental Theories Matter for Nurses
          </h2>
          <ul className="grid md:grid-cols-2 gap-2">
            {[
              'Assess if a child is developing normally',
              'Adapt communication to developmental stage',
              'Understand behaviour in context',
              'Support parents with appropriate expectations',
              'Recognise developmental delay early',
              'Provide age-appropriate care and education',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[var(--plum-dark)]/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Piaget */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-500" />
            Piaget&apos;s Cognitive Development
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-[var(--plum-dark)]/80">
              Jean Piaget described how children&apos;s thinking develops through distinct stages. Children aren&apos;t just &quot;mini adults&quot; - they think differently at each stage.
            </p>
            
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded-full bg-blue-200 text-blue-800 text-xs font-semibold">0-2 years</span>
                  <h3 className="font-semibold text-blue-800">Sensorimotor Stage</h3>
                </div>
                <p className="text-sm text-blue-800/80 mb-2">
                  Learning through senses and movement. Develops <strong>object permanence</strong> (~8 months) - understanding objects still exist when out of sight.
                </p>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-700 mb-1">📋 Clinical Application:</p>
                  <p className="text-xs text-blue-800/70">Use distraction techniques. Infant may cry when parent leaves (separation anxiety after 6-8 months). Allow comfort objects. Keep parent visible if possible.</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded-full bg-purple-200 text-purple-800 text-xs font-semibold">2-7 years</span>
                  <h3 className="font-semibold text-purple-800">Preoperational Stage</h3>
                </div>
                <p className="text-sm text-purple-800/80 mb-2">
                  Symbolic thinking (pretend play) but <strong>egocentric</strong> - can&apos;t see others&apos; perspectives. <strong>Magical thinking</strong> - may believe thoughts caused illness.
                </p>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className="text-xs font-semibold text-purple-700 mb-1">📋 Clinical Application:</p>
                  <p className="text-xs text-purple-800/70">Use simple, concrete explanations. Demonstrate on teddy/doll. Reassure it&apos;s not their fault they&apos;re ill. Use play therapy. Avoid medical jargon.</p>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded-full bg-emerald-200 text-emerald-800 text-xs font-semibold">7-11 years</span>
                  <h3 className="font-semibold text-emerald-800">Concrete Operational Stage</h3>
                </div>
                <p className="text-sm text-emerald-800/80 mb-2">
                  Logical thinking about <strong>concrete</strong> things. Understands <strong>conservation</strong> (quantity stays same despite appearance change). Can see others&apos; viewpoints.
                </p>
                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">📋 Clinical Application:</p>
                  <p className="text-xs text-emerald-800/70">Include child in discussions. Give logical explanations. They can learn about their condition. Use diagrams and models. Prepare them before procedures.</p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded-full bg-amber-200 text-amber-800 text-xs font-semibold">12+ years</span>
                  <h3 className="font-semibold text-amber-800">Formal Operational Stage</h3>
                </div>
                <p className="text-sm text-amber-800/80 mb-2">
                  <strong>Abstract thinking</strong> - can reason hypothetically, consider future consequences, think philosophically.
                </p>
                <div className="bg-white rounded-lg p-3 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-700 mb-1">📋 Clinical Application:</p>
                  <p className="text-xs text-amber-800/70">Involve in decisions about care. Discuss long-term implications. Consider confidentiality and autonomy (Gillick competence). They may worry about future, body image, peer acceptance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Erikson */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            Erikson&apos;s Psychosocial Development
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-[var(--plum-dark)]/80">
              Erik Erikson described 8 stages of psychosocial development, each with a &quot;crisis&quot; to resolve. Success leads to healthy development; failure can cause difficulties.
            </p>
            
            <div className="space-y-3">
              {[
                { 
                  age: '0-1 year', 
                  stage: 'Trust vs Mistrust', 
                  desc: 'Baby learns to trust caregivers through consistent care. Inconsistent care → mistrust.',
                  clinical: 'Keep routines consistent. Involve parents. Respond to cries. Build trusting relationship.'
                },
                { 
                  age: '1-3 years', 
                  stage: 'Autonomy vs Shame', 
                  desc: 'Toddler develops independence ("me do it!"). Over-control → shame and doubt.',
                  clinical: 'Offer simple choices. Allow some control. Praise efforts. Be patient with toileting accidents.'
                },
                { 
                  age: '3-6 years', 
                  stage: 'Initiative vs Guilt', 
                  desc: 'Child initiates activities and games. Criticism of initiative → guilt.',
                  clinical: 'Encourage questions. Allow age-appropriate independence. Use play for procedures. Don\'t shame behaviour.'
                },
                { 
                  age: '6-12 years', 
                  stage: 'Industry vs Inferiority', 
                  desc: 'Child develops competence through achievements. Failure/criticism → inferiority.',
                  clinical: 'Praise accomplishments. Keep up with schoolwork if able. Help maintain friendships. Acknowledge their abilities.'
                },
                { 
                  age: '12-18 years', 
                  stage: 'Identity vs Role Confusion', 
                  desc: 'Teenager forms identity - who am I? Failure → role confusion.',
                  clinical: 'Respect privacy and autonomy. Allow expression of identity. Involve in care decisions. Address body image concerns.'
                },
              ].map((item) => (
                <div key={item.stage} className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 rounded-full bg-pink-200 text-pink-800 text-xs font-semibold">{item.age}</span>
                    <h3 className="font-semibold text-pink-800">{item.stage}</h3>
                  </div>
                  <p className="text-sm text-pink-800/80 mb-2">{item.desc}</p>
                  <div className="bg-white rounded-lg p-3 border border-pink-200">
                    <p className="text-xs font-semibold text-pink-700 mb-1">📋 Clinical Application:</p>
                    <p className="text-xs text-pink-800/70">{item.clinical}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
              <p className="text-sm font-semibold text-pink-700 mb-2">Adult Stages (for completeness):</p>
              <ul className="text-xs text-pink-800/80 space-y-1">
                <li>• <strong>Young Adult:</strong> Intimacy vs Isolation (forming relationships)</li>
                <li>• <strong>Middle Adult:</strong> Generativity vs Stagnation (contributing to society)</li>
                <li>• <strong>Late Adult:</strong> Ego Integrity vs Despair (reflecting on life)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bowlby */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Baby className="w-6 h-6 text-rose-500" />
            Bowlby&apos;s Attachment Theory
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-[var(--plum-dark)]/80">
              John Bowlby proposed that early attachment with caregivers is crucial for emotional development. The quality of attachment affects relationships throughout life.
            </p>
            
            <div className="bg-rose-50 rounded-xl p-5 border border-rose-200">
              <h3 className="font-semibold text-rose-800 mb-3">Attachment Styles (identified by Ainsworth)</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                  <p className="font-semibold text-emerald-700 text-sm">✅ Secure Attachment</p>
                  <p className="text-xs text-emerald-800/80 mt-1">Child uses caregiver as safe base. Distressed when separated but easily comforted on reunion. Develops from consistent, responsive care.</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-amber-200">
                  <p className="font-semibold text-amber-700 text-sm">⚠️ Insecure-Avoidant</p>
                  <p className="text-xs text-amber-800/80 mt-1">Child avoids caregiver. Little distress at separation, ignores on reunion. Often from emotionally unavailable parenting.</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-orange-200">
                  <p className="font-semibold text-orange-700 text-sm">⚠️ Insecure-Resistant (Ambivalent)</p>
                  <p className="text-xs text-orange-800/80 mt-1">Very distressed at separation, hard to comfort on reunion (mixed approach-avoidance). From inconsistent caregiving.</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="font-semibold text-red-700 text-sm">🚨 Disorganised</p>
                  <p className="text-xs text-red-800/80 mt-1">No clear pattern, confused/contradictory behaviours. Often linked to abuse, neglect, or frightening parenting. Highest risk for difficulties.</p>
                </div>
              </div>
            </div>

            <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
              <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide mb-2">📋 Clinical Applications</p>
              <ul className="text-sm text-rose-800/80 space-y-1">
                <li>• Keep parents with children wherever possible (family-centred care)</li>
                <li>• Prepare children for separations (surgery, procedures)</li>
                <li>• Watch for signs of attachment difficulties</li>
                <li>• Consider attachment in child protection concerns</li>
                <li>• Support parent-infant bonding, especially if premature/unwell</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Vygotsky */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            Vygotsky&apos;s Social Development Theory
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-[var(--plum-dark)]/80">
              Lev Vygotsky emphasised the role of <strong>social interaction</strong> in learning. We learn through others, not just by ourselves.
            </p>
            
            <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-200">
              <h3 className="font-semibold text-indigo-800 mb-3">Key Concepts</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <p className="font-semibold text-indigo-700 text-sm">Zone of Proximal Development (ZPD)</p>
                  <p className="text-xs text-indigo-800/80 mt-1">The gap between what a child can do alone and what they can do with help. Learning happens best in this zone - challenging but achievable with support.</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <p className="font-semibold text-indigo-700 text-sm">Scaffolding</p>
                  <p className="text-xs text-indigo-800/80 mt-1">Temporary support given by a more knowledgeable person, gradually reduced as competence increases. Think training wheels on a bike!</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <p className="font-semibold text-indigo-700 text-sm">More Knowledgeable Other (MKO)</p>
                  <p className="text-xs text-indigo-800/80 mt-1">Someone with more knowledge/skill who can guide learning - parent, teacher, nurse, or even a peer.</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">📋 Clinical Application</p>
              <p className="text-sm text-indigo-800/80">
                When teaching a child self-care skills (e.g., inhaler technique), provide step-by-step guidance, then gradually reduce support as they become competent. Use peer support - children often learn well from other children who&apos;ve been through similar experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Kohlberg */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6 text-teal-500" />
            Kohlberg&apos;s Moral Development
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-[var(--plum-dark)]/80">
              Lawrence Kohlberg described how moral reasoning develops through stages. Useful for understanding how children think about right and wrong.
            </p>
            
            <div className="space-y-3">
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                <h3 className="font-semibold text-teal-800 mb-2">Pre-Conventional (Up to ~9 years)</h3>
                <ul className="text-sm text-teal-800/80 space-y-1">
                  <li>• <strong>Stage 1:</strong> Avoid punishment. &quot;It&apos;s wrong because I&apos;ll get in trouble.&quot;</li>
                  <li>• <strong>Stage 2:</strong> Self-interest. &quot;What&apos;s in it for me?&quot; Fair exchange.</li>
                </ul>
              </div>
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                <h3 className="font-semibold text-teal-800 mb-2">Conventional (Adolescence-Adulthood)</h3>
                <ul className="text-sm text-teal-800/80 space-y-1">
                  <li>• <strong>Stage 3:</strong> Good boy/girl. Want approval, relationships matter.</li>
                  <li>• <strong>Stage 4:</strong> Law and order. Rules and authority are important.</li>
                </ul>
              </div>
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                <h3 className="font-semibold text-teal-800 mb-2">Post-Conventional (Some Adults)</h3>
                <ul className="text-sm text-teal-800/80 space-y-1">
                  <li>• <strong>Stage 5:</strong> Social contract. Rules can be changed for greater good.</li>
                  <li>• <strong>Stage 6:</strong> Universal principles. Personal ethics may override law.</li>
                </ul>
              </div>
            </div>

            <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">📋 Clinical Application</p>
              <p className="text-sm text-teal-800/80">
                When explaining why a child needs to take medication: for a young child, link to concrete consequences. For older children, appeal to rules and doing the right thing. For adolescents, discuss the reasoning and let them participate in decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Other Theories */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-violet-500" />
            Other Important Theories
          </h2>
          
          <div className="space-y-4">
            <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
              <h3 className="font-semibold text-violet-800 mb-2">Bandura - Social Learning Theory</h3>
              <p className="text-sm text-violet-800/80 mb-2">
                Children learn by <strong>observing and imitating</strong> others (modelling). Explains how behaviours (good and bad) are learned.
              </p>
              <p className="text-xs text-violet-700/70">
                <strong>Clinical:</strong> Model healthy behaviours. Be aware children may copy staff. Use role modelling for health education.
              </p>
            </div>

            <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
              <h3 className="font-semibold text-violet-800 mb-2">Bronfenbrenner - Ecological Systems Theory</h3>
              <p className="text-sm text-violet-800/80 mb-2">
                Development is influenced by <strong>multiple systems</strong>: immediate family (microsystem), school/community (mesosystem), parent&apos;s work (exosystem), culture/society (macrosystem).
              </p>
              <p className="text-xs text-violet-700/70">
                <strong>Clinical:</strong> Consider the whole context of a child&apos;s life. Family circumstances, community resources, cultural background all matter.
              </p>
            </div>

            <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
              <h3 className="font-semibold text-violet-800 mb-2">Freud - Psychosexual Development</h3>
              <p className="text-sm text-violet-800/80 mb-2">
                5 stages (oral, anal, phallic, latent, genital). While controversial, some concepts remain influential (e.g., defense mechanisms, unconscious mind).
              </p>
              <p className="text-xs text-violet-700/70">
                <strong>Clinical:</strong> Understanding that behaviour may have unconscious roots. Defense mechanisms (denial, regression) are common coping strategies.
              </p>
            </div>
          </div>
        </div>

        {/* Red Flags */}
        <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
          <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Red Flags - When to Be Concerned
          </h2>
          <ul className="space-y-2">
            {[
              'Significant developmental delay compared to age norms',
              'Regression - losing previously acquired skills',
              'Attachment behaviours suggesting abuse/neglect (disorganised attachment)',
              'Social withdrawal or inability to form relationships',
              'Concerning moral reasoning (e.g., lack of empathy, cruelty)',
              'Parent-child interactions that seem harmful or neglectful',
              'Child not meeting key milestones (speak to health visitor/GP)',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Reference */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)]">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[var(--purple)]" />
            Quick Memory Aid
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { theorist: 'Piaget', focus: 'How children THINK', keyword: 'Cognitive stages' },
              { theorist: 'Erikson', focus: 'How children FEEL about themselves', keyword: 'Psychosocial crises' },
              { theorist: 'Bowlby', focus: 'How children BOND', keyword: 'Attachment styles' },
              { theorist: 'Vygotsky', focus: 'How children LEARN from others', keyword: 'ZPD, scaffolding' },
              { theorist: 'Kohlberg', focus: 'How children understand RIGHT/WRONG', keyword: 'Moral reasoning' },
              { theorist: 'Bandura', focus: 'How children COPY behaviour', keyword: 'Observation, imitation' },
            ].map((t) => (
              <div key={t.theorist} className="bg-white rounded-lg p-3">
                <p className="font-medium text-[var(--plum)] text-sm">{t.theorist}</p>
                <p className="text-xs text-[var(--plum-dark)]/70">{t.focus}</p>
                <p className="text-xs text-[var(--purple)] mt-1 italic">{t.keyword}</p>
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
