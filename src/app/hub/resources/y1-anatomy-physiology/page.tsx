'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Heart, Brain, Wind, Droplets, Bone, Shield, Zap, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';

export default function Y1AnatomyPhysiologyPage() {
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
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                FREE
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-3">
            Y1 Anatomy & Physiology 🫀
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg">
            Essential body systems knowledge for Year 1 nursing students with clinical applications.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        
        {/* Quick Reference Card */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)]">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[var(--purple)]" />
            Why A&P Matters in Nursing
          </h2>
          <p className="text-[var(--plum-dark)]/80 mb-4">
            Understanding anatomy and physiology helps you:
          </p>
          <ul className="grid md:grid-cols-2 gap-2">
            {[
              'Understand why patients have certain symptoms',
              'Recognise deterioration early',
              'Explain procedures to patients',
              'Understand drug actions and side effects',
              'Make sense of blood test results',
              'Provide holistic, informed care',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[var(--plum-dark)]/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Cardiovascular System */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Cardiovascular System
          </h2>
          
          <div className="space-y-4">
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">Key Structures</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-red-700 mb-2">The Heart</p>
                  <ul className="text-sm text-red-800/80 space-y-1">
                    <li>• 4 chambers: 2 atria (top), 2 ventricles (bottom)</li>
                    <li>• Right side = deoxygenated blood to lungs</li>
                    <li>• Left side = oxygenated blood to body</li>
                    <li>• 4 valves prevent backflow</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700 mb-2">Blood Vessels</p>
                  <ul className="text-sm text-red-800/80 space-y-1">
                    <li>• <strong>Arteries</strong> = away from heart (thick walls)</li>
                    <li>• <strong>Veins</strong> = towards heart (have valves)</li>
                    <li>• <strong>Capillaries</strong> = gas exchange (1 cell thick)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">Cardiac Conduction System</h3>
              <div className="bg-red-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800 font-mono text-center">
                  SA Node → AV Node → Bundle of His → Bundle Branches → Purkinje Fibres
                </p>
              </div>
              <p className="text-sm text-red-800/80">
                <strong>SA Node</strong> = pacemaker (60-100 bpm). If it fails, AV node takes over (40-60 bpm).
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">📋 Clinical Link: Blood Pressure</p>
                <p className="text-sm text-red-800/80">
                  <strong>Normal:</strong> &lt;140/90 mmHg<br/>
                  <strong>Hypertension:</strong> ≥140/90 mmHg<br/>
                  <strong>Hypotension:</strong> &lt;90/60 mmHg
                </p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">📋 Clinical Link: Heart Rate</p>
                <p className="text-sm text-red-800/80">
                  <strong>Normal:</strong> 60-100 bpm (adult)<br/>
                  <strong>Tachycardia:</strong> &gt;100 bpm<br/>
                  <strong>Bradycardia:</strong> &lt;60 bpm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Respiratory System */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Wind className="w-6 h-6 text-blue-500" />
            Respiratory System
          </h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Key Structures</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-2">Upper Airways</p>
                  <ul className="text-sm text-blue-800/80 space-y-1">
                    <li>• Nose & nasal cavity (warms, filters, humidifies)</li>
                    <li>• Pharynx (throat)</li>
                    <li>• Larynx (voice box)</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-2">Lower Airways</p>
                  <ul className="text-sm text-blue-800/80 space-y-1">
                    <li>• Trachea (windpipe)</li>
                    <li>• Bronchi → Bronchioles</li>
                    <li>• Alveoli (gas exchange)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Gas Exchange at Alveoli</h3>
              <div className="bg-blue-50 rounded-lg p-4 text-center mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Oxygen</strong> diffuses from alveoli → blood (via capillaries)<br/>
                  <strong>Carbon dioxide</strong> diffuses from blood → alveoli (to be exhaled)
                </p>
              </div>
              <p className="text-sm text-blue-800/80">
                ~300 million alveoli give a huge surface area for gas exchange. Surfactant prevents alveoli from collapsing.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">📋 Clinical Link: O2 Sats</p>
                <p className="text-sm text-blue-800/80">
                  <strong>Normal:</strong> 94-98% (on room air)<br/>
                  <strong>COPD target:</strong> 88-92%<br/>
                  <strong>&lt;94%</strong> = consider oxygen therapy
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">📋 Clinical Link: RR</p>
                <p className="text-sm text-blue-800/80">
                  <strong>Normal adult:</strong> 12-20 breaths/min<br/>
                  <strong>Tachypnoea:</strong> &gt;20/min<br/>
                  <strong>Bradypnoea:</strong> &lt;12/min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Renal System */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Droplets className="w-6 h-6 text-amber-500" />
            Renal & Urinary System
          </h2>
          
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3">Key Functions of the Kidneys</h3>
              <ul className="grid md:grid-cols-2 gap-2">
                {[
                  'Filter waste products from blood',
                  'Regulate fluid balance',
                  'Control blood pressure (renin)',
                  'Produce erythropoietin (for red blood cells)',
                  'Activate vitamin D',
                  'Regulate electrolytes (Na+, K+, Ca2+)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-amber-800/80">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-5 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3">Urine Formation</h3>
              <div className="bg-amber-50 rounded-lg p-4 text-center mb-4">
                <p className="text-sm text-amber-800 font-mono">
                  Filtration (glomerulus) → Reabsorption → Secretion → Excretion
                </p>
              </div>
              <p className="text-sm text-amber-800/80">
                Each kidney contains ~1 million nephrons. Normal urine output: <strong>0.5-1 ml/kg/hour</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">📋 Clinical Link: Urine Output</p>
                <p className="text-sm text-amber-800/80">
                  <strong>Normal:</strong> &gt;0.5 ml/kg/hr<br/>
                  <strong>Oliguria:</strong> &lt;400 ml/24hr<br/>
                  <strong>Anuria:</strong> &lt;100 ml/24hr
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">📋 Clinical Link: Kidney Function</p>
                <p className="text-sm text-amber-800/80">
                  <strong>Creatinine:</strong> ↑ = kidney damage<br/>
                  <strong>eGFR:</strong> &lt;60 = chronic kidney disease<br/>
                  <strong>Urea:</strong> ↑ in dehydration/kidney failure
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nervous System */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            Nervous System
          </h2>
          
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3">Key Divisions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-2">Central Nervous System (CNS)</p>
                  <ul className="text-sm text-purple-800/80 space-y-1">
                    <li>• Brain (cerebrum, cerebellum, brainstem)</li>
                    <li>• Spinal cord</li>
                    <li>• Protected by meninges and CSF</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-2">Peripheral Nervous System (PNS)</p>
                  <ul className="text-sm text-purple-800/80 space-y-1">
                    <li>• Cranial nerves (12 pairs)</li>
                    <li>• Spinal nerves (31 pairs)</li>
                    <li>• Autonomic: Sympathetic & Parasympathetic</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3">Autonomic Nervous System</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <p className="text-sm font-semibold text-red-700 mb-2">⚡ Sympathetic (&quot;Fight or Flight&quot;)</p>
                  <ul className="text-xs text-red-800/80 space-y-1">
                    <li>• ↑ Heart rate & BP</li>
                    <li>• Dilates pupils</li>
                    <li>• ↑ Blood to muscles</li>
                    <li>• ↓ Digestion</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-sm font-semibold text-green-700 mb-2">😌 Parasympathetic (&quot;Rest & Digest&quot;)</p>
                  <ul className="text-xs text-green-800/80 space-y-1">
                    <li>• ↓ Heart rate & BP</li>
                    <li>• Constricts pupils</li>
                    <li>• ↑ Digestion</li>
                    <li>• ↑ Secretions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">📋 Clinical Link: GCS (Glasgow Coma Scale)</p>
              <p className="text-sm text-purple-800/80">
                <strong>Eye (1-4)</strong> + <strong>Verbal (1-5)</strong> + <strong>Motor (1-6)</strong> = 3-15<br/>
                Normal: 15 | Severe injury: ≤8 | &lt;8 = protect airway
              </p>
            </div>
          </div>
        </div>

        {/* Musculoskeletal System */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Bone className="w-6 h-6 text-gray-500" />
            Musculoskeletal System
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Key Functions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Skeletal System (206 bones)</p>
                  <ul className="text-sm text-gray-800/80 space-y-1">
                    <li>• Support & protection</li>
                    <li>• Movement (with muscles)</li>
                    <li>• Blood cell production (bone marrow)</li>
                    <li>• Mineral storage (calcium, phosphate)</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Muscular System (600+ muscles)</p>
                  <ul className="text-sm text-gray-800/80 space-y-1">
                    <li>• Skeletal (voluntary movement)</li>
                    <li>• Cardiac (heart muscle)</li>
                    <li>• Smooth (organs, involuntary)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">📋 Clinical Link: Mobility Assessment</p>
              <p className="text-sm text-gray-800/80">
                Assess range of motion, muscle strength, gait, and balance. Consider falls risk, pressure area care, and VTE prophylaxis for immobile patients.
              </p>
            </div>
          </div>
        </div>

        {/* Integumentary System */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-pink-500" />
            Integumentary System (Skin)
          </h2>
          
          <div className="space-y-4">
            <div className="bg-pink-50 rounded-xl p-5 border border-pink-200">
              <h3 className="font-semibold text-pink-800 mb-3">Skin Layers</h3>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm font-medium text-pink-700">Epidermis (outer)</p>
                  <p className="text-xs text-pink-800/80">Waterproof barrier, contains melanocytes</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm font-medium text-pink-700">Dermis (middle)</p>
                  <p className="text-xs text-pink-800/80">Blood vessels, nerves, hair follicles, sweat glands</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm font-medium text-pink-700">Hypodermis (subcutaneous)</p>
                  <p className="text-xs text-pink-800/80">Fat storage, insulation, cushioning</p>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
              <p className="text-xs font-semibold text-pink-600 uppercase tracking-wide mb-2">📋 Clinical Link: Skin Assessment</p>
              <p className="text-sm text-pink-800/80">
                Check for colour changes (pallor, cyanosis, jaundice), turgor (hydration), temperature, and integrity. Use tools like Waterlow score for pressure ulcer risk.
              </p>
            </div>
          </div>
        </div>

        {/* Homeostasis */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Homeostasis
          </h2>
          
          <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
            <p className="text-sm text-yellow-800/80 mb-4">
              <strong>Homeostasis</strong> is the body&apos;s ability to maintain a stable internal environment despite external changes.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { param: 'Body Temperature', normal: '36.5-37.5°C' },
                { param: 'Blood Glucose', normal: '4-7 mmol/L (fasting)' },
                { param: 'Blood pH', normal: '7.35-7.45' },
                { param: 'Serum Sodium', normal: '135-145 mmol/L' },
                { param: 'Serum Potassium', normal: '3.5-5.0 mmol/L' },
                { param: 'Serum Calcium', normal: '2.2-2.6 mmol/L' },
              ].map((item) => (
                <div key={item.param} className="bg-white rounded-lg p-3">
                  <p className="text-sm font-medium text-yellow-700">{item.param}</p>
                  <p className="text-xs text-yellow-800/80">Normal: {item.normal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Red Flags */}
        <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
          <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Red Flags - When A&P Knowledge Saves Lives
          </h2>
          <ul className="space-y-2">
            {[
              'Hypoxia (low O2) + confusion = URGENT - needs immediate assessment',
              'Chest pain + sweating + pale = potential MI - call for help',
              'Sudden severe headache = possible stroke/SAH - time critical',
              'No urine output + rising creatinine = acute kidney injury',
              'Hot, red, swollen limb + SOB = DVT/PE - escalate immediately',
              'Altered consciousness + fever = meningitis until proven otherwise',
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
