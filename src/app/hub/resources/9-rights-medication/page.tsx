'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, Shield, AlertCircle, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import SelfTestQuiz from '@/components/SelfTestQuiz';

const quizQuestions = [
  {
    question: 'How many identifiers should you use to confirm patient identity?',
    options: ['One (name only)', 'At least two (e.g., name and DOB)', 'Three or more', 'Just check the bed number'],
    answer: 1,
    explanation: 'Always use at least TWO identifiers. Bed numbers can change, and patients may answer "yes" to any name if confused.',
  },
  {
    question: 'When should you read the medication label?',
    options: ['Just before giving it', 'When picking up and before giving', 'Three times: picking up, preparing, and administering', 'Once is enough if you\'re experienced'],
    answer: 2,
    explanation: 'Read the label THREE times to catch errors - when picking up, when preparing, and before administering.',
  },
  {
    question: 'A prescription says "PO" but the drug is only available as an injection. What should you do?',
    options: ['Give it as an injection - same drug, doesn\'t matter', 'Stop and contact the prescriber', 'Ask a colleague to decide', 'Skip the dose'],
    answer: 1,
    explanation: 'NEVER change the route yourself. Contact the prescriber - they need to write a new prescription for the correct route.',
  },
  {
    question: 'For paediatric doses, who should you get to double-check your calculation?',
    options: ['No one - if you\'re confident it\'s correct', 'A student nurse', 'Another registered nurse or pharmacist', 'The parent'],
    answer: 2,
    explanation: 'Paediatric doses must ALWAYS be double-checked by another registered professional due to the risk of calculation errors.',
  },
  {
    question: 'A diabetic patient\'s meal-time insulin is prescribed for 12:00. Their lunch arrives late at 13:30. What should you do?',
    options: ['Give insulin at 12:00 as prescribed', 'Wait and give insulin with the meal', 'Skip the insulin dose', 'Give double dose later'],
    answer: 1,
    explanation: 'Meal-time insulin should be given WITH the meal, not at a fixed time. Giving it without food can cause dangerous hypoglycaemia.',
  },
  {
    question: 'What is the purpose of documenting the REASON for giving a medication?',
    options: ['It\'s not necessary for routine medications', 'To show you know why the patient needs it', 'To check the prescription is appropriate', 'Both B and C'],
    answer: 3,
    explanation: 'Understanding WHY helps you spot inappropriate prescriptions and ensures the medication is still needed.',
  },
  {
    question: 'A child needs paracetamol but refuses to swallow liquid. Can you use a suppository instead?',
    options: ['Yes, it\'s the same drug so it\'s fine', 'No - you need a new prescription for the different form', 'Only if the parent agrees', 'Only in emergencies'],
    answer: 1,
    explanation: 'Different forms may have different absorption rates and doses. You MUST get a new prescription for a different formulation.',
  },
  {
    question: 'What should you monitor after giving a medication?',
    options: ['Nothing - your job is done once it\'s given', 'Whether the patient takes it', 'The patient\'s response - both expected effects and side effects', 'Just check for allergic reactions'],
    answer: 2,
    explanation: 'Monitor for BOTH therapeutic effects (is it working?) and adverse effects (side effects, allergic reactions).',
  },
];

const rights = [
  {
    number: 1,
    title: 'Right Patient',
    description: 'Confirm the patient\'s identity using at least two identifiers (e.g., name, date of birth, hospital number).',
    tip: 'Always check the wristband and ask the patient to state their name and DOB.',
    emoji: '👤',
    adultScenario: {
      situation: 'You\'re about to give paracetamol to Mrs Jones in Bed 4. The patient says "yes" when you ask if she\'s Mrs Jones, but when you check her wristband, it says "Mrs James".',
      whatWentWrong: 'Confused or drowsy patients may answer "yes" to any name. The patient in Bed 4 was moved and Mrs Jones is now in Bed 6.',
      correctAction: 'Always use TWO identifiers - check the wristband AND ask them to state their full name and date of birth. Never rely on bed numbers alone.',
    },
    childScenario: {
      situation: 'You need to give antibiotics to 4-year-old Lily. Her mum says "yes, this is Lily" but the child is asleep and you can\'t see a wristband.',
      whatWentWrong: 'Parents can be tired and distracted. There may be siblings visiting, or another child with a similar name on the ward.',
      correctAction: 'Always check the child\'s wristband yourself - even if a parent confirms. Ask the parent to state the child\'s full name AND date of birth. If no wristband, get one fitted before giving medications.',
    },
  },
  {
    number: 2,
    title: 'Right Medication/Drug',
    description: 'Verify the medication name matches the prescription. Check for allergies and contraindications.',
    tip: 'Read the label three times: when picking up, preparing, and administering.',
    emoji: '💊',
    adultScenario: {
      situation: 'A patient is prescribed Amlodipine 5mg. In the drug cupboard, you grab what you think is Amlodipine but it\'s actually Amitriptyline 5mg - the boxes look almost identical.',
      whatWentWrong: 'Look-alike/sound-alike (LASA) medications are a major cause of errors. Both start with "Am" and have similar packaging.',
      correctAction: 'Read the FULL medication name carefully. Check it matches the prescription exactly. Read it three times: when you pick it up, when you prepare it, and before you give it.',
    },
    childScenario: {
      situation: 'A 6-year-old is prescribed Cetirizine (antihistamine) liquid. You pick up a bottle that says "Cetirizine" but it\'s the adult 10mg/5ml strength, not the paediatric 5mg/5ml.',
      whatWentWrong: 'Same medication name but different concentrations. Giving the adult strength would double the dose.',
      correctAction: 'Always check the CONCENTRATION as well as the drug name, especially with liquids. Paediatric formulations often have different strengths to adult versions.',
    },
  },
  {
    number: 3,
    title: 'Right Route',
    description: 'Administer via the correct route as prescribed (oral, IV, IM, SC, topical, etc.).',
    tip: 'Some medications look similar but have different routes – always check the prescription!',
    emoji: '🛤️',
    adultScenario: {
      situation: 'A patient needs methotrexate. The prescription says "PO" (oral) but the pharmacy has sent injectable methotrexate because oral was out of stock.',
      whatWentWrong: 'You cannot substitute routes without a new prescription. Injectable medications given orally (or vice versa) can cause serious harm or be ineffective.',
      correctAction: 'STOP. Contact pharmacy and the prescriber. Never change the route yourself - a new prescription is needed.',
    },
    childScenario: {
      situation: 'A toddler needs paracetamol but keeps spitting out the oral liquid. A colleague suggests using a paracetamol suppository instead since "it\'s the same drug".',
      whatWentWrong: 'Suppositories have different absorption rates and the dose may differ. You cannot swap routes without a prescription.',
      correctAction: 'Contact the prescriber to request the rectal route if appropriate. They\'ll need to prescribe the correct suppository dose. Meanwhile, try the oral route with a syringe to the side of the cheek.',
    },
  },
  {
    number: 4,
    title: 'Right Dose',
    description: 'Ensure the dose is correct for the patient. Double-check calculations, especially for paediatrics. Use the NHS formula and always check units and maximum doses.',
    tip: 'If in doubt, always get a second checker. Never guess doses.',
    emoji: '⚖️',
    formula: 'Dose = (What you need ÷ What you have) × Volume/Stock',
    formulaExample: 'Example: Patient needs 250mg, tablets are 125mg each. 250 ÷ 125 × 1 = 2 tablets.',
    workedExample: 'Paediatric: Child weighs 20kg, needs paracetamol 15mg/kg. 15 × 20 = 300mg. If you have 120mg/5ml suspension: 300 ÷ 120 × 5 = 12.5ml.',
    safetyReminders: [
      'Always check the maximum single and daily dose for the patient’s age/weight.',
      'Double-check calculations with a colleague for paediatric and high-risk drugs.',
      'Be careful with unit conversions (mg, mcg, g, ml).',
      'Never round doses unless guidelines say it is safe.',
    ],
    adultScenario: {
      situation: 'An elderly patient weighing 45kg is prescribed gentamicin. The standard adult dose is calculated, but this patient is frail with reduced kidney function.',
      whatWentWrong: 'Standard adult doses don\'t account for weight, age, or renal function. Gentamicin is nephrotoxic and needs careful dosing.',
      correctAction: 'Check if the dose is appropriate for the patient\'s weight and renal function. Gentamicin requires therapeutic drug monitoring. Query with pharmacy if unsure.',
    },
    childScenario: {
      situation: 'A child weighing 15kg needs ibuprofen. The prescription says 150mg but the BNFc recommends 5-10mg/kg. You calculate: 10mg × 15kg = 150mg... but that\'s the MAXIMUM dose.',
      whatWentWrong: 'Paediatric doses are weight-based and easy to miscalculate. Using maximum doses routinely leaves no room for dose increases if needed.',
      correctAction: 'Start with a moderate dose (e.g., 7.5mg/kg = 112.5mg, round to 100mg). Always double-check calculations with a colleague for paediatric patients.',
    },
  },
  {
    number: 5,
    title: 'Right Time',
    description: 'Give the medication at the correct time and frequency as prescribed.',
    tip: 'Know the reason for timing (e.g., before food, at specific intervals).',
    emoji: '⏰',
    adultScenario: {
      situation: 'A diabetic patient is prescribed insulin with meals, but lunch arrives late. You give the insulin at the usual 12pm time, but lunch doesn\'t arrive until 1:30pm.',
      whatWentWrong: 'Giving rapid-acting insulin without food available can cause dangerous hypoglycaemia.',
      correctAction: 'Meal-time insulin should be given WITH the meal, not at a set time. Wait for the food, or contact the kitchen/check why it\'s delayed.',
    },
    childScenario: {
      situation: 'A baby needs 6-hourly antibiotics (06:00, 12:00, 18:00, 00:00). The parents ask if they can skip the midnight dose so the baby can sleep through.',
      whatWentWrong: 'Skipping doses or changing intervals affects antibiotic blood levels and can lead to treatment failure or antibiotic resistance.',
      correctAction: 'Explain why timing matters for antibiotics. If the schedule is problematic, discuss with the prescriber - some antibiotics can be given 8-hourly instead, but this needs a new prescription.',
    },
  },
  {
    number: 6,
    title: 'Right Documentation',
    description: 'Document administration immediately after giving the medication. Never pre-sign.',
    tip: 'If it\'s not documented, it didn\'t happen. Include time, dose, route, and your signature.',
    emoji: '📝',
    adultScenario: {
      situation: 'You\'re busy, so you sign the MAR chart for Mrs Smith\'s evening medications before the drug round. You get called to an emergency and someone else does the round, also giving Mrs Smith her meds.',
      whatWentWrong: 'Pre-signing led to a double dose. The second nurse saw no signature and assumed the meds hadn\'t been given.',
      correctAction: 'NEVER pre-sign. Document immediately AFTER administration. If you\'re interrupted, document what you\'ve given so far before leaving.',
    },
    childScenario: {
      situation: 'You give a child their morning medications, but get interrupted by the child vomiting. You clean them up, comfort them, and forget to sign the MAR chart. Later, the afternoon nurse gives the same meds again.',
      whatWentWrong: 'Undocumented administration led to a double dose. Paediatric patients are more vulnerable to overdose effects.',
      correctAction: 'Document IMMEDIATELY after giving each medication. If the child vomits within 30 minutes, document this too - they may need the dose repeated (check guidelines and contact prescriber).',
    },
  },
  {
    number: 7,
    title: 'Right Reason/Indication',
    description: 'Understand why the patient is receiving this medication. Does it align with their condition?',
    tip: 'If the prescription doesn\'t make sense for the patient\'s diagnosis, question it before administering.',
    emoji: '🤔',
    adultScenario: {
      situation: 'A patient admitted for a chest infection has metformin on their drug chart. You check their notes - there\'s no mention of diabetes, and their blood glucose has been normal.',
      whatWentWrong: 'The prescription may have been copied from an old record incorrectly, or it\'s the wrong patient\'s medication list.',
      correctAction: 'Question prescriptions that don\'t match the patient\'s condition. Ask the prescriber: "Can you confirm the indication for metformin? I can\'t see diabetes in their history."',
    },
    childScenario: {
      situation: 'A 3-year-old admitted with bronchiolitis has salbutamol nebulisers prescribed. You recall that bronchiolitis guidelines say bronchodilators aren\'t recommended for infants with bronchiolitis.',
      whatWentWrong: 'Evidence shows salbutamol doesn\'t help bronchiolitis in young children and may cause side effects without benefit.',
      correctAction: 'Query the prescription with the prescriber, citing NICE guidelines. They may have a specific reason, or it may be a prescribing habit that needs challenging.',
    },
  },
  {
    number: 8,
    title: 'Right Form',
    description: 'Ensure the medication is in the correct form (tablet, liquid, injection, patch, inhaler, etc.).',
    tip: 'Some patients can\'t swallow tablets – check if an alternative form is needed.',
    emoji: '💉',
    adultScenario: {
      situation: 'An elderly patient with dysphagia (swallowing difficulties) is prescribed omeprazole 20mg capsules. You notice they struggle to swallow their morning tablets.',
      whatWentWrong: 'Patients with dysphagia risk choking or aspiration. Some tablets can\'t be crushed (e.g., enteric-coated, modified-release).',
      correctAction: 'Check the patient\'s swallowing assessment. Contact the prescriber to change to dispersible tablets or oral suspension. Never crush medications without checking if it\'s safe.',
    },
    childScenario: {
      situation: 'A 7-year-old is prescribed prednisolone 20mg tablets for an asthma exacerbation. The child refuses to swallow tablets and the tablets taste extremely bitter if crushed.',
      whatWentWrong: 'Forcing a distressed child to take bitter medication can cause vomiting, trauma, and medication refusal in future.',
      correctAction: 'Request prednisolone soluble tablets which dissolve in water - they\'re designed for children. If unavailable, discuss alternatives with pharmacy. Some children manage tablets hidden in food (check compatibility first).',
    },
  },
  {
    number: 9,
    title: 'Right Response',
    description: 'Monitor the patient for expected therapeutic effects and potential adverse reactions.',
    tip: 'Know what to look for and when to escalate if the response isn\'t as expected.',
    emoji: '📊',
    adultScenario: {
      situation: 'You give IV morphine 5mg for severe pain. 20 minutes later, the patient\'s pain score is still 8/10, but their respiratory rate has dropped to 8 breaths/min.',
      whatWentWrong: 'The morphine isn\'t controlling pain but IS causing respiratory depression - a dangerous combination requiring immediate action.',
      correctAction: 'Stop further opioids. Stay with patient, ensure naloxone is available. Escalate immediately - they may need a different analgesic approach or lower opioid doses.',
    },
    childScenario: {
      situation: 'You give a child their first dose of amoxicillin. 30 minutes later, they develop an itchy rash and their lips look slightly swollen.',
      whatWentWrong: 'These are signs of an allergic reaction that could progress to anaphylaxis. Penicillin allergies are common and can be severe.',
      correctAction: 'STOP the antibiotic immediately. Call for help. Monitor airway, breathing, circulation. Give antihistamine/adrenaline per protocol. Document the reaction and update allergy status. The child should never receive penicillins again.',
    },
  },
];

export default function NineRightsMedicationPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-[var(--lilac-soft)] via-[var(--pink-soft)]/30 to-cream relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.2 }} />
        <div className="blob blob-2" style={{ opacity: 0.2 }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-[var(--plum-dark)]/60 hover:text-[var(--purple)] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">💊</span>
              <div>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[var(--mint)] text-green-700 mb-2">
                  FREE RESOURCE
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--plum)]">
                  9 Rights of Medication Administration
                </h1>
              </div>
            </div>
            <p className="text-[var(--plum-dark)]/70 text-lg max-w-2xl">
              The essential safety checks before giving any medication. Memorise these for OSCEs and use them on every single placement.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Why It Matters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-amber-800 mb-2">Why This Matters</h2>
                <p className="text-amber-700/80 text-sm">
                  Medication errors are one of the most common causes of patient harm. Following the 9 Rights 
                  <strong> every single time</strong> creates a safety habit that protects your patients and your 
                  registration. In OSCEs, examiners specifically watch for these checks.
                </p>
              </div>
            </div>
          </motion.div>

          {/* The 9 Rights */}
          <div className="space-y-4 mb-10">
            {rights.map((right, index) => (
              <motion.div
                key={right.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="card hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--lavender)] to-[var(--purple)] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {right.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{right.emoji}</span>
                      <h3 className="text-lg font-semibold text-[var(--plum)]">{right.title}</h3>
                    </div>
                    <p className="text-[var(--plum-dark)]/70 mb-3">{right.description}</p>
                    {right.formula && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                        <p className="text-sm font-semibold text-blue-800 mb-1">💡 Formula</p>
                        <div className="font-mono text-blue-900 text-base">{right.formula}</div>
                        {right.formulaExample && (
                          <div className="mt-2 text-xs text-blue-700">{right.formulaExample}</div>
                        )}
                        {right.workedExample && (
                          <div className="mt-2 text-xs text-blue-700">{right.workedExample}</div>
                        )}
                      </div>
                    )}
                    {right.safetyReminders && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">
                        <p className="text-sm font-semibold text-amber-800 mb-1">⚠️ Safety Reminders</p>
                        <ul className="list-disc pl-5 text-xs text-amber-700 space-y-1">
                          {right.safetyReminders.map((reminder, i) => (
                            <li key={i}>{reminder}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="bg-[var(--lilac-soft)] rounded-lg p-3 mb-4">
                      <p className="text-sm text-[var(--purple)] flex items-start gap-2">
                        <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>Tip:</strong> {right.tip}</span>
                      </p>
                    </div>
                    
                    {/* Scenarios */}
                    <div className="grid md:grid-cols-2 gap-3">
                      {/* Adult Scenario */}
                      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">🧑 Adult Scenario</p>
                        <p className="text-sm text-slate-700 mb-3">{right.adultScenario.situation}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 bg-red-50 rounded-lg p-2">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-red-700">Risk:</p>
                              <p className="text-xs text-red-600">{right.adultScenario.whatWentWrong}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 bg-emerald-50 rounded-lg p-2">
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-emerald-700">Do this:</p>
                              <p className="text-xs text-emerald-600">{right.adultScenario.correctAction}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Child Scenario */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-2">👶 Paediatric Scenario</p>
                        <p className="text-sm text-slate-700 mb-3">{right.childScenario.situation}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 bg-red-50 rounded-lg p-2">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-red-700">Risk:</p>
                              <p className="text-xs text-red-600">{right.childScenario.whatWentWrong}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 bg-emerald-50 rounded-lg p-2">
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-emerald-700">Do this:</p>
                              <p className="text-xs text-emerald-600">{right.childScenario.correctAction}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* OSCE Tip Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card bg-gradient-to-br from-[var(--lilac-soft)] to-white border-[var(--lavender)] mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--purple)] flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--plum)] mb-2">OSCE Station Tip</h2>
                <p className="text-[var(--plum-dark)]/70 text-sm mb-3">
                  In medication administration OSCEs, <strong>say each check out loud</strong> as you do it. 
                  Examiners can only mark what they see and hear. Even if you're doing the checks mentally, 
                  verbalise them: "I'm checking the patient's wristband - their name is..."
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-[var(--lilac)] text-[var(--purple)] px-3 py-1 rounded-full">Talk through each right</span>
                  <span className="text-xs bg-[var(--lilac)] text-[var(--purple)] px-3 py-1 rounded-full">Check wristband visibly</span>
                  <span className="text-xs bg-[var(--lilac)] text-[var(--purple)] px-3 py-1 rounded-full">Ask patient to confirm identity</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Reference Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card-glass text-center"
          >
            <h2 className="text-lg font-semibold text-[var(--plum)] mb-4">Quick Memory Aid 🧠</h2>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              {rights.map((right) => (
                <div key={right.number} className="bg-white/60 rounded-lg p-2 text-center">
                  <span className="text-lg block mb-1">{right.emoji}</span>
                  <span className="text-xs text-[var(--plum-dark)]/70">{right.title.replace('Right ', '')}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-[var(--plum-dark)]/60 mt-4">
              Patient → Drug → Route → Dose → Time → Document → Reason → Form → Response
            </p>
          </motion.div>

          {/* Self-Test Quiz */}
          <SelfTestQuiz 
            title="Test Your Knowledge: 9 Rights" 
            questions={quizQuestions}
          />

          {/* Back to Hub */}
          <div className="mt-6 text-center">
            <Link
              href="/hub"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Hub
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
