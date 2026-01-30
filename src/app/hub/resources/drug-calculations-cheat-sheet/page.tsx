'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import LockedContent from '@/components/LockedContent';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { ArrowLeft, Calculator, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function DrugCalculationsCheatSheetPage() {
  const { isPro, isLoading } = useEntitlements();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-pulse text-[var(--purple)]">Loading...</div>
      </div>
    );
  }

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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--purple)] to-[var(--lavender)] flex items-center justify-center">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--purple)]/10 text-[var(--purple)]">
                PREMIUM
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-3">
            Drug Calculations Cheat Sheet 💊
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg">
            Essential formulas and step-by-step methods for common drug calculations.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {!isPro ? (
          <LockedContent
            title="Unlock Drug Calculations Cheat Sheet"
            description="Master medication calculations with our comprehensive cheat sheet including formulas, worked examples, and practice questions."
            features={[
              'Essential formulas explained',
              'Step-by-step worked examples',
              'IV rate calculations',
              'Unit conversions guide',
              'Common calculation errors to avoid',
              'Practice questions with answers',
            ]}
          />
        ) : (
          <div className="space-y-8">
            {/* Key Formulas Card */}
            <div className="card">
              <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
                <span className="text-2xl">📐</span> Essential Formulas
              </h2>
              
              <div className="space-y-6">
                {/* NHS Formula */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-300">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🏥</span>
                    <h3 className="font-semibold text-blue-800">NHS Formula</h3>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-medium">Most Common</span>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 text-center mb-4 shadow-sm">
                    <p className="text-2xl font-bold text-blue-900 mb-2">
                      <span className="text-blue-600">Need</span> ÷ <span className="text-blue-600">Have</span> × <span className="text-blue-600">Stock</span>
                    </p>
                    <p className="text-sm text-blue-600 font-medium">or written as a fraction:</p>
                    <div className="mt-3 inline-flex items-center gap-2">
                      <div className="inline-block">
                        <div className="text-xl font-bold text-blue-900 border-b-2 border-blue-400 pb-1 px-4">Need</div>
                        <div className="text-xl font-bold text-blue-900 pt-1 px-4">Have</div>
                      </div>
                      <span className="text-xl font-bold text-blue-900">× Stock</span>
                    </div>
                  </div>

                  <div className="bg-blue-100/50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800 mb-2"><strong>What each part means:</strong></p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li><strong>Need</strong> = What the prescription says (dose prescribed)</li>
                      <li><strong>Have</strong> = Strength of medication you have (per tablet/ml)</li>
                      <li><strong>Stock</strong> = Volume or quantity it comes in (ml, tablets)</li>
                    </ul>
                  </div>

                  {/* Scenarios */}
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-2">📋 Scenario 1: Oral Liquid</p>
                      <p className="text-sm text-slate-700 mb-2">A child needs 150mg ibuprofen. You have ibuprofen 100mg/5ml.</p>
                      <div className="bg-blue-50 rounded p-2 text-xs font-mono text-blue-800">
                        150 ÷ 100 × 5 = <strong>7.5ml</strong>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-2">📋 Scenario 2: Tablets</p>
                      <p className="text-sm text-slate-700 mb-2">Patient needs 7.5mg bisoprolol. You have 5mg tablets.</p>
                      <div className="bg-blue-50 rounded p-2 text-xs font-mono text-blue-800">
                        7.5 ÷ 5 × 1 = <strong>1.5 tablets</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic dose formula */}
                <div className="bg-[var(--lilac-soft)] rounded-xl p-5">
                  <h3 className="font-semibold text-[var(--purple)] mb-2">Alternative Way to Remember</h3>
                  <div className="bg-white rounded-lg p-4 text-center font-mono text-lg mb-3">
                    Dose = (What you want ÷ What you&apos;ve got) × Volume
                  </div>
                  
                  {/* Triangle Diagram */}
                  <div className="bg-gradient-to-br from-[var(--purple)]/5 to-[var(--lavender)]/20 rounded-xl p-6 mb-4">
                    <p className="text-center text-sm font-semibold text-[var(--plum)] mb-4">📐 The Formula Triangle</p>
                    <div className="flex justify-center">
                      <div className="relative">
                        {/* Triangle using CSS */}
                        <svg viewBox="0 0 200 180" className="w-48 h-44">
                          {/* Triangle outline */}
                          <polygon 
                            points="100,10 10,170 190,170" 
                            fill="white" 
                            stroke="var(--purple)" 
                            strokeWidth="3"
                          />
                          {/* Horizontal line dividing top from bottom */}
                          <line x1="30" y1="100" x2="170" y2="100" stroke="var(--purple)" strokeWidth="2" />
                          {/* Vertical line dividing bottom */}
                          <line x1="100" y1="100" x2="100" y2="170" stroke="var(--purple)" strokeWidth="2" />
                          
                          {/* Labels */}
                          <text x="100" y="65" textAnchor="middle" className="text-sm font-bold fill-[var(--plum)]">NEED</text>
                          <text x="55" y="145" textAnchor="middle" className="text-sm font-bold fill-[var(--plum)]">HAVE</text>
                          <text x="145" y="145" textAnchor="middle" className="text-sm font-bold fill-[var(--plum)]">STOCK</text>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-[var(--plum-dark)]/80">
                      <p className="text-center font-medium">Cover what you need to find:</p>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-white/70 rounded-lg p-2">
                          <p className="font-semibold text-[var(--purple)]">Find DOSE?</p>
                          <p>Need ÷ Have × Stock</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-2">
                          <p className="font-semibold text-[var(--purple)]">Find NEED?</p>
                          <p>Dose × Have ÷ Stock</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-2">
                          <p className="font-semibold text-[var(--purple)]">Find STOCK?</p>
                          <p>Dose × Have ÷ Need</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--plum-dark)]/70">
                    <strong>Same example:</strong> Need 250mg, Have 500mg/5ml<br />
                    Dose = (250 ÷ 500) × 5 = <strong>2.5ml</strong>
                  </p>
                </div>

                {/* IV drip rate */}
                <div className="bg-[var(--lilac-soft)] rounded-xl p-5">
                  <h3 className="font-semibold text-[var(--purple)] mb-2">IV Drip Rate (drops/min)</h3>
                  <div className="bg-white rounded-lg p-4 text-center font-mono text-lg mb-3">
                    Drops/min = (Volume × Drop factor) ÷ Time in minutes
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-amber-800 flex items-start gap-2">
                      <span className="text-lg">💡</span>
                      <span><strong>Drop factor is NOT calculated!</strong> It&apos;s printed on the IV giving set packaging. Just look at the box/wrapper.</span>
                    </p>
                  </div>

                  <div className="bg-white/70 rounded-lg p-3">
                    <p className="text-sm text-[var(--plum-dark)]/70 mb-2"><strong>Common drop factors:</strong></p>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-[var(--lilac)] rounded-lg p-2">
                        <p className="font-bold text-[var(--purple)]">20</p>
                        <p className="text-[var(--plum-dark)]/70">drops/ml</p>
                        <p className="text-[var(--plum-dark)]/50 mt-1">Standard</p>
                      </div>
                      <div className="bg-red-100 rounded-lg p-2">
                        <p className="font-bold text-red-700">15</p>
                        <p className="text-red-600/70">drops/ml</p>
                        <p className="text-red-600/50 mt-1">Blood</p>
                      </div>
                      <div className="bg-blue-100 rounded-lg p-2">
                        <p className="font-bold text-blue-700">60</p>
                        <p className="text-blue-600/70">drops/ml</p>
                        <p className="text-blue-600/50 mt-1">Micro/Paeds</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--plum-dark)]/70 mt-3">
                    <strong>Example:</strong> 500ml over 4 hours with standard set (20 drops/ml)<br/>
                    = (500 × 20) ÷ 240 = <strong>41.6 ≈ 42 drops/min</strong>
                  </p>

                  {/* IV Scenarios */}
                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    <div className="bg-white rounded-lg p-3 border border-[var(--lavender)]">
                      <p className="text-xs font-semibold text-[var(--purple)] uppercase tracking-wide mb-2">📋 Scenario: Post-op fluids</p>
                      <p className="text-xs text-slate-700 mb-2">Patient needs 1L 0.9% saline over 8 hours. Standard giving set (20 drops/ml).</p>
                      <div className="bg-[var(--lilac-soft)] rounded p-2 text-xs font-mono">
                        Time = 8 × 60 = 480 mins<br/>
                        (1000 × 20) ÷ 480 = <strong>41.6 ≈ 42 drops/min</strong>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-[var(--lavender)]">
                      <p className="text-xs font-semibold text-[var(--purple)] uppercase tracking-wide mb-2">📋 Scenario: Paediatric IV</p>
                      <p className="text-xs text-slate-700 mb-2">Child needs 250ml over 6 hours. Microdrop set (60 drops/ml).</p>
                      <div className="bg-[var(--lilac-soft)] rounded p-2 text-xs font-mono">
                        Time = 6 × 60 = 360 mins<br/>
                        (250 × 60) ÷ 360 = <strong>41.6 ≈ 42 drops/min</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IV rate ml/hr */}
                <div className="bg-[var(--lilac-soft)] rounded-xl p-5">
                  <h3 className="font-semibold text-[var(--purple)] mb-2">IV Rate (ml/hr) for pumps</h3>
                  <div className="bg-white rounded-lg p-4 text-center font-mono text-lg mb-3">
                    Rate (ml/hr) = Volume (ml) ÷ Time (hours)
                  </div>
                  <p className="text-sm text-[var(--plum-dark)]/70 mb-3">
                    <strong>Example:</strong> 1000ml over 8 hours = 1000 ÷ 8 = <strong>125 ml/hr</strong>
                  </p>

                  {/* Pump Scenarios */}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-[var(--lavender)]">
                      <p className="text-xs font-semibold text-[var(--purple)] uppercase tracking-wide mb-2">📋 Scenario: Maintenance fluids</p>
                      <p className="text-xs text-slate-700 mb-2">Patient prescribed 3L of fluid over 24 hours via infusion pump.</p>
                      <div className="bg-[var(--lilac-soft)] rounded p-2 text-xs font-mono">
                        3000 ÷ 24 = <strong>125 ml/hr</strong>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-[var(--lavender)]">
                      <p className="text-xs font-semibold text-[var(--purple)] uppercase tracking-wide mb-2">📋 Scenario: Antibiotic infusion</p>
                      <p className="text-xs text-slate-700 mb-2">500mg vancomycin in 100ml to run over 2 hours.</p>
                      <div className="bg-[var(--lilac-soft)] rounded p-2 text-xs font-mono">
                        100 ÷ 2 = <strong>50 ml/hr</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weight-based dosing */}
                                {/* Holiday-Segar Method */}
                                <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-xl p-5 border-2 border-green-300">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xl">🧮</span>
                                    <h3 className="font-semibold text-green-800">Holiday-Segar Method (Paediatric Maintenance Fluids)</h3>
                                  </div>
                                  <div className="bg-white rounded-xl p-6 text-center mb-4 shadow-sm">
                                    <p className="text-lg font-bold text-green-900 mb-2">Maintenance fluids (ml/day):</p>
                                    <div className="text-base text-green-800 mb-2">• <strong>First 10 kg:</strong> 100 ml/kg</div>
                                    <div className="text-base text-green-800 mb-2">• <strong>Next 10 kg:</strong> 50 ml/kg</div>
                                    <div className="text-base text-green-800 mb-2">• <strong>Each kg above 20 kg:</strong> 20 ml/kg</div>
                                  </div>
                                  <div className="bg-green-100/50 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-green-800 mb-2"><strong>How to calculate:</strong></p>
                                    <ul className="text-sm text-green-700 space-y-1">
                                      <li>• For a child weighing <strong>8 kg</strong>: 8 × 100 = <strong>800 ml/day</strong></li>
                                      <li>• For a child weighing <strong>18 kg</strong>: (10 × 100) + (8 × 50) = <strong>1,400 ml/day</strong></li>
                                      <li>• For a child weighing <strong>25 kg</strong>: (10 × 100) + (10 × 50) + (5 × 20) = <strong>1,700 ml/day</strong></li>
                                    </ul>
                                  </div>
                                  <div className="bg-white/70 rounded-lg p-3">
                                    <p className="text-sm text-[var(--plum-dark)]/70 mb-2"><strong>Tip:</strong> Divide total by 24 for hourly rate (ml/hr).</p>
                                    <p className="text-sm text-[var(--plum-dark)]/70">E.g. 1,400 ml/day ÷ 24 = <strong>58 ml/hr</strong></p>
                                  </div>
                                </div>
                <div className="bg-[var(--lilac-soft)] rounded-xl p-5">
                  <h3 className="font-semibold text-[var(--purple)] mb-2">Weight-Based Dosing</h3>
                  <div className="bg-white rounded-lg p-4 text-center font-mono text-lg mb-3">
                    Total dose = Dose per kg × Patient weight (kg)
                  </div>
                  <p className="text-sm text-[var(--plum-dark)]/70 mb-3">
                    <strong>Example:</strong> 15mg/kg for 70kg patient = 15 × 70 = <strong>1050mg</strong>
                  </p>

                  {/* Weight Scenarios */}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-[var(--lavender)]">
                      <p className="text-xs font-semibold text-[var(--purple)] uppercase tracking-wide mb-2">📋 Scenario: Gentamicin (adult)</p>
                      <p className="text-xs text-slate-700 mb-2">Patient weighs 80kg. Gentamicin 5mg/kg once daily.</p>
                      <div className="bg-[var(--lilac-soft)] rounded p-2 text-xs font-mono">
                        5 × 80 = <strong>400mg</strong>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-[var(--lavender)]">
                      <p className="text-xs font-semibold text-[var(--purple)] uppercase tracking-wide mb-2">📋 Scenario: Paracetamol (child)</p>
                      <p className="text-xs text-slate-700 mb-2">Child weighs 25kg. Paracetamol 15mg/kg PRN.</p>
                      <div className="bg-[var(--lilac-soft)] rounded p-2 text-xs font-mono">
                        15 × 25 = <strong>375mg</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Safe Dose Calculation - Divided Doses */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">👶</span>
                    <h3 className="font-semibold text-emerald-800">Safe Dose Calculation (Divided Doses)</h3>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-sm text-emerald-700 mb-2"><strong>Step 1:</strong> Calculate total daily dose</p>
                    <div className="bg-emerald-50 rounded p-2 text-center font-mono text-sm mb-3">
                      Daily dose = mg/kg/day × weight (kg)
                    </div>
                    
                    <p className="text-sm text-emerald-700 mb-2"><strong>Step 2:</strong> Divide by number of doses per day</p>
                    <div className="bg-emerald-50 rounded p-2 text-center font-mono text-sm">
                      Single dose = Daily dose ÷ Number of doses
                    </div>
                  </div>

                  <div className="bg-white/70 rounded-lg p-3 mb-4">
                    <p className="text-sm text-emerald-800 mb-2"><strong>How many doses per day?</strong></p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-emerald-100 rounded-lg p-2">
                        <p className="font-bold text-emerald-700">Every 4hrs</p>
                        <p className="text-emerald-600">= 6 doses/day</p>
                      </div>
                      <div className="bg-emerald-100 rounded-lg p-2">
                        <p className="font-bold text-emerald-700">Every 6hrs</p>
                        <p className="text-emerald-600">= 4 doses/day</p>
                      </div>
                      <div className="bg-emerald-100 rounded-lg p-2">
                        <p className="font-bold text-emerald-700">Every 8hrs</p>
                        <p className="text-emerald-600">= 3 doses/day</p>
                      </div>
                      <div className="bg-emerald-100 rounded-lg p-2">
                        <p className="font-bold text-emerald-700">Every 12hrs</p>
                        <p className="text-emerald-600">= 2 doses/day</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-sm text-emerald-800 mb-2"><strong>Example:</strong></p>
                    <p className="text-sm text-emerald-700">
                      Child weighs 20kg. Amoxicillin prescribed: 25mg/kg/day in 3 divided doses (every 8 hours).<br/><br/>
                      <span className="font-mono bg-emerald-50 px-2 py-1 rounded block mb-1">
                        Step 1: 25 × 20 = 500mg total daily dose
                      </span>
                      <span className="font-mono bg-emerald-50 px-2 py-1 rounded block">
                        Step 2: 500 ÷ 3 = <strong>166.6mg per dose</strong> (every 8 hours)
                      </span>
                    </p>
                  </div>

                  {/* Divided Dose Scenarios */}
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded-lg p-3 border border-emerald-200">
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">📋 Scenario: Antibiotic QDS</p>
                      <p className="text-xs text-slate-700 mb-2">Baby weighs 8kg. Flucloxacillin 50mg/kg/day in 4 divided doses (every 6 hours).</p>
                      <div className="bg-emerald-50 rounded p-2 text-xs font-mono">
                        Daily: 50 × 8 = 400mg<br/>
                        Per dose: 400 ÷ 4 = <strong>100mg every 6hrs</strong>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-emerald-200">
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">📋 Scenario: Antibiotic TDS</p>
                      <p className="text-xs text-slate-700 mb-2">Child weighs 15kg. Co-amoxiclav 30mg/kg/day in 3 divided doses (every 8 hours).</p>
                      <div className="bg-emerald-50 rounded p-2 text-xs font-mono">
                        Daily: 30 × 15 = 450mg<br/>
                        Per dose: 450 ÷ 3 = <strong>150mg every 8hrs</strong>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-emerald-200">
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">📋 Scenario: Check if safe</p>
                      <p className="text-xs text-slate-700 mb-2">Doctor prescribes 200mg ibuprofen TDS for 18kg child. BNFc says max 30mg/kg/day. Is it safe?</p>
                      <div className="bg-emerald-50 rounded p-2 text-xs font-mono">
                        Prescribed daily: 200 × 3 = 600mg<br/>
                        Max daily: 30 × 18 = 540mg<br/>
                        <strong className="text-red-600">⚠️ OVER max - query!</strong>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-emerald-200">
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">📋 Scenario: BD dosing</p>
                      <p className="text-xs text-slate-700 mb-2">Child weighs 12kg. Azithromycin 10mg/kg/day as single daily dose for 3 days.</p>
                      <div className="bg-emerald-50 rounded p-2 text-xs font-mono">
                        10 × 12 = <strong>120mg once daily</strong><br/>
                        (Some drugs are given as single daily dose!)
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-800 flex items-start gap-2">
                      <span className="text-base">⚠️</span>
                      <span><strong>Always check:</strong> Is this dose within the safe range? Compare your calculated dose against BNF/BNFc min and max doses for that drug and patient&apos;s age/weight.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Unit Conversions */}
            <div className="card">
              <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
                <span className="text-2xl">🔄</span> Unit Conversions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[var(--mint)] rounded-xl p-4">
                  <h4 className="font-semibold text-emerald-800 mb-2">Weight</h4>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    <li>1 kg = 1000 g</li>
                    <li>1 g = 1000 mg</li>
                    <li>1 mg = 1000 mcg (micrograms)</li>
                    <li>1 mcg = 1000 ng (nanograms)</li>
                  </ul>
                  <div className="mt-3 pt-3 border-t border-emerald-200">
                    <p className="text-xs text-emerald-600 font-medium mb-1">Quick reference:</p>
                    <ul className="text-xs text-emerald-600 space-y-0.5">
                      <li>• mcg also written as μg or mic</li>
                      <li>• 500 mcg = 0.5 mg</li>
                      <li>• 250 ng = 0.25 mcg = 0.00025 mg</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-[var(--peach)] rounded-xl p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">Volume</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>1 L = 1000 ml</li>
                    <li>1 ml = 1000 microlitres (μL)</li>
                    <li>5 ml = 1 teaspoon (approx)</li>
                  </ul>
                </div>
                
                <div className="bg-[var(--pink-soft)] rounded-xl p-4">
                  <h4 className="font-semibold text-pink-800 mb-2">Time</h4>
                  <ul className="text-sm text-pink-700 space-y-1">
                    <li>1 hour = 60 minutes</li>
                    <li>1 day = 24 hours</li>
                    <li>Remember: ml/hr vs drops/min!</li>
                  </ul>
                </div>
                
                <div className="bg-[var(--lilac)] rounded-xl p-4">
                  <h4 className="font-semibold text-[var(--purple)] mb-2">Percentages</h4>
                  <ul className="text-sm text-[var(--plum)] space-y-1">
                    <li>1% = 1g per 100ml = 10mg/ml</li>
                    <li>0.9% NaCl = 9g per 1L</li>
                    <li>5% glucose = 50g per 1L</li>
                  </ul>
                </div>
              </div>

              {/* Conversion ladder visual */}
              <div className="mt-6 bg-gradient-to-r from-[var(--lilac-soft)] to-white rounded-xl p-5">
                <h4 className="font-semibold text-[var(--plum)] mb-3 text-center">Weight Conversion Ladder</h4>
                <div className="flex items-center justify-center gap-2 flex-wrap text-sm">
                  <span className="bg-white px-3 py-2 rounded-lg font-mono text-[var(--plum)] shadow-sm">kg</span>
                  <span className="text-[var(--plum-dark)]/50">×1000→</span>
                  <span className="bg-white px-3 py-2 rounded-lg font-mono text-[var(--plum)] shadow-sm">g</span>
                  <span className="text-[var(--plum-dark)]/50">×1000→</span>
                  <span className="bg-white px-3 py-2 rounded-lg font-mono text-[var(--plum)] shadow-sm">mg</span>
                  <span className="text-[var(--plum-dark)]/50">×1000→</span>
                  <span className="bg-white px-3 py-2 rounded-lg font-mono text-[var(--plum)] shadow-sm">mcg</span>
                  <span className="text-[var(--plum-dark)]/50">×1000→</span>
                  <span className="bg-white px-3 py-2 rounded-lg font-mono text-[var(--plum)] shadow-sm">ng</span>
                </div>
                <p className="text-center text-xs text-[var(--plum-dark)]/60 mt-3">
                  Going down: multiply by 1000 · Going up: divide by 1000
                </p>
              </div>

              {/* Staircase Diagram */}
              <div className="mt-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-4 text-center">📐 Unit Conversion Staircase</h4>
                
                {/* CSS Staircase - clearer visual */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    {/* Steps going down-right */}
                    <div className="flex flex-col items-start">
                      {/* kg step */}
                      <div className="flex items-center">
                        <div className="w-16 h-12 bg-white border-2 border-emerald-500 rounded-lg flex items-center justify-center font-bold text-emerald-700 text-lg shadow-md">
                          kg
                        </div>
                        <div className="ml-1 text-emerald-500 text-xs font-semibold">×1000 ↓</div>
                      </div>
                      
                      {/* g step */}
                      <div className="flex items-center ml-10 -mt-1">
                        <div className="w-16 h-12 bg-white border-2 border-emerald-500 rounded-lg flex items-center justify-center font-bold text-emerald-700 text-lg shadow-md">
                          g
                        </div>
                        <div className="ml-1 text-emerald-500 text-xs font-semibold">×1000 ↓</div>
                      </div>
                      
                      {/* mg step */}
                      <div className="flex items-center ml-20 -mt-1">
                        <div className="w-16 h-12 bg-white border-2 border-emerald-500 rounded-lg flex items-center justify-center font-bold text-emerald-700 text-lg shadow-md">
                          mg
                        </div>
                        <div className="ml-1 text-emerald-500 text-xs font-semibold">×1000 ↓</div>
                      </div>
                      
                      {/* mcg step */}
                      <div className="flex items-center ml-[120px] -mt-1">
                        <div className="w-16 h-12 bg-white border-2 border-emerald-500 rounded-lg flex items-center justify-center font-bold text-emerald-700 text-lg shadow-md">
                          mcg
                        </div>
                        <div className="ml-1 text-emerald-500 text-xs font-semibold">×1000 ↓</div>
                      </div>
                      
                      {/* ng step */}
                      <div className="flex items-center ml-40 -mt-1">
                        <div className="w-16 h-12 bg-white border-2 border-emerald-500 rounded-lg flex items-center justify-center font-bold text-emerald-700 text-lg shadow-md">
                          ng
                        </div>
                      </div>
                    </div>
                    
                    {/* Direction labels */}
                    <div className="absolute -left-8 top-2 text-xs font-bold text-gray-500 rotate-[-90deg]">BIG</div>
                    <div className="absolute right-[-30px] bottom-2 text-xs font-bold text-gray-500 rotate-[-90deg]">small</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/70 rounded-lg p-4 border border-emerald-200">
                    <p className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                      <span>⬇️</span> Going DOWN the stairs
                    </p>
                    <p className="text-emerald-600 text-xs mb-2">Big units → Small units</p>
                    <p className="text-emerald-800 font-mono text-sm">× 1000 at each step</p>
                    <p className="text-xs text-emerald-600 mt-2">
                      <strong>Example:</strong> 2.5 mg → mcg<br/>
                      2.5 × 1000 = <strong>2500 mcg</strong>
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4 border border-emerald-200">
                    <p className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                      <span>⬆️</span> Going UP the stairs
                    </p>
                    <p className="text-emerald-600 text-xs mb-2">Small units → Big units</p>
                    <p className="text-emerald-800 font-mono text-sm">÷ 1000 at each step</p>
                    <p className="text-xs text-emerald-600 mt-2">
                      <strong>Example:</strong> 500 mcg → mg<br/>
                      500 ÷ 1000 = <strong>0.5 mg</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-xs text-amber-800 flex items-start gap-2">
                    <span className="text-lg">💡</span>
                    <span><strong>Memory trick:</strong> Going DOWN to smaller units makes the NUMBER bigger (more of them fit). Going UP to bigger units makes the NUMBER smaller.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="card bg-amber-50 border-amber-200">
              <h2 className="text-xl text-amber-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6" /> Top Tips
              </h2>
              
              <div className="space-y-3">
                {[
                  'Always double-check your calculations with a colleague',
                  'Make sure units match before calculating (convert if needed)',
                  'Write down each step - don\'t try to do it all in your head',
                  'If the answer seems unusually high or low, recalculate',
                  'Use a calculator for complex calculations',
                  'Check the prescription against your calculated dose',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-amber-900 text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Errors */}
            <div className="card bg-red-50 border-red-200">
              <h2 className="text-xl text-red-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" /> Common Errors to Avoid
              </h2>
              
              <div className="space-y-3">
                {[
                  'Mixing up mg and mcg (1000x difference!)',
                  'Forgetting to convert units before calculating',
                  'Confusing ml/hr with drops/min',
                  'Decimal point errors (10mg vs 1.0mg)',
                  'Not checking the concentration of the stock solution',
                  'Calculating for wrong patient weight',
                ].map((error, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span className="text-red-900 text-sm">{error}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Questions */}
            <div className="card">
              <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
                <span className="text-2xl">✏️</span> Practice Questions
              </h2>
              
              <div className="space-y-4">
                <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                  <p className="font-medium text-[var(--plum)] mb-2">Q1: A patient is prescribed 750mg of amoxicillin. Stock is 250mg/5ml. What volume do you give?</p>
                  <details className="mt-2">
                    <summary className="text-[var(--purple)] cursor-pointer font-medium text-sm">Show Answer</summary>
                    <p className="mt-2 text-sm text-[var(--plum-dark)]/70 bg-white rounded-lg p-3">
                      (750 ÷ 250) × 5 = <strong>15ml</strong>
                    </p>
                  </details>
                </div>
                
                <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                  <p className="font-medium text-[var(--plum)] mb-2">Q2: Infuse 500ml of 0.9% saline over 4 hours. What rate on the pump (ml/hr)?</p>
                  <details className="mt-2">
                    <summary className="text-[var(--purple)] cursor-pointer font-medium text-sm">Show Answer</summary>
                    <p className="mt-2 text-sm text-[var(--plum-dark)]/70 bg-white rounded-lg p-3">
                      500 ÷ 4 = <strong>125 ml/hr</strong>
                    </p>
                  </details>
                </div>
                
                <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                  <p className="font-medium text-[var(--plum)] mb-2">Q3: A child weighing 25kg needs paracetamol 15mg/kg. What is the total dose?</p>
                  <details className="mt-2">
                    <summary className="text-[var(--purple)] cursor-pointer font-medium text-sm">Show Answer</summary>
                    <p className="mt-2 text-sm text-[var(--plum-dark)]/70 bg-white rounded-lg p-3">
                      15 × 25 = <strong>375mg</strong>
                    </p>
                  </details>
                </div>
              </div>
            </div>

            {/* Print reminder */}
            <div className="text-center text-sm text-[var(--plum-dark)]/60">
              💡 Tip: Print this page for a handy reference on placement!
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--lilac)] px-6 py-8 text-center text-[var(--plum-dark)]/70 text-sm">
        <p>Made with love by Lauren</p>
        <div className="flex justify-center gap-4 mt-3">
          <Link href="/privacy" className="hover:text-[var(--plum)]">Privacy</Link>
          <Link href="/terms" className="hover:text-[var(--plum)]">Terms</Link>
          <Link href="/hub" className="hover:text-[var(--plum)]">Hub</Link>
        </div>
      </footer>
    </div>
  );
}
