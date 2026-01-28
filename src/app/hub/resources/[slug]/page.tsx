import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getUserEntitlements } from '@/lib/entitlements';
import { ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, FileText, Clock } from 'lucide-react';

// Resource content database
const resources: Record<string, {
  title: string;
  description: string;
  isLocked: boolean;
  readTime: string;
  sections: {
    title: string;
    content: string[];
    type?: 'checklist' | 'warning' | 'tip' | 'normal';
  }[];
}> = {
  'paeds-respiratory-assessment': {
    title: 'Paeds Respiratory Assessment',
    description: 'Complete guide to assessing respiratory function in children including work of breathing and red flags.',
    isLocked: false,
    readTime: '5 min read',
    sections: [
      {
        title: 'Initial Approach',
        type: 'normal',
        content: [
          'Observe from a distance before touching the child - note positioning, colour, and breathing effort.',
          'Use age-appropriate communication and involve parents/carers.',
          'Count respiratory rate for a full 60 seconds while child is calm.',
        ],
      },
      {
        title: 'Normal Respiratory Rates by Age',
        type: 'checklist',
        content: [
          'Newborn: 30-60 breaths/min',
          'Infant (1-12 months): 25-50 breaths/min',
          'Toddler (1-3 years): 20-40 breaths/min',
          'Preschool (3-5 years): 20-30 breaths/min',
          'School age (6-12 years): 15-25 breaths/min',
          'Adolescent: 12-20 breaths/min',
        ],
      },
      {
        title: 'Work of Breathing Assessment',
        type: 'checklist',
        content: [
          'Nasal flaring - nostrils widening with each breath',
          'Tracheal tug - inward movement at the neck',
          'Subcostal recession - pulling in below the ribs',
          'Intercostal recession - pulling in between the ribs',
          'Sternal recession - pulling in of the breastbone',
          'Head bobbing (in infants) - head moves with each breath',
          'Grunting - expiratory noise indicating respiratory distress',
        ],
      },
      {
        title: 'Red Flags - Escalate Immediately',
        type: 'warning',
        content: [
          'Silent chest on auscultation',
          'Cyanosis (central - lips, tongue)',
          'Exhaustion or decreased consciousness',
          'Apnoea or irregular breathing',
          'SpO2 <92% on air (or dropping despite oxygen)',
          'Severe recession with minimal air entry',
        ],
      },
      {
        title: 'Documentation Tips',
        type: 'tip',
        content: [
          'Always document respiratory rate, work of breathing, SpO2, and oxygen requirements.',
          'Note the child\'s position and activity level when assessing.',
          'Record any interventions and the child\'s response.',
        ],
      },
    ],
  },
  'sepsis-6-escalation': {
    title: 'Sepsis 6 & Escalation',
    description: 'Step-by-step sepsis recognition and the Sepsis 6 bundle with escalation pathways.',
    isLocked: true,
    readTime: '7 min read',
    sections: [
      {
        title: 'Recognising Sepsis - NICE Criteria',
        type: 'warning',
        content: [
          'High risk if: objective evidence of altered mental state, systolic BP ≤90 or >40 below normal, heart rate >130, respiratory rate ≥25, needs O2 to keep SpO2 ≥92%, non-blanching rash/mottled/ashen/cyanotic, not passed urine in 18 hours (<0.5ml/kg/hr if catheterised), lactate ≥2 mmol/L, recent chemotherapy',
        ],
      },
      {
        title: 'The Sepsis 6 - Complete Within 1 Hour',
        type: 'checklist',
        content: [
          '1. GIVE high-flow oxygen (target SpO2 94-98%, or 88-92% if COPD)',
          '2. TAKE blood cultures (before antibiotics if possible)',
          '3. GIVE IV antibiotics (as per local guidelines)',
          '4. GIVE IV fluid challenge (500ml crystalloid stat, reassess)',
          '5. TAKE lactate level',
          '6. MEASURE urine output (catheterise if needed)',
        ],
      },
      {
        title: 'Escalation Pathway',
        type: 'normal',
        content: [
          'NEWS2 score 5-6 or 3 in one parameter: Urgent clinical review within 1 hour',
          'NEWS2 score ≥7: Emergency assessment by critical care team',
          'Suspected sepsis with red flag: Immediate senior review and Sepsis 6',
          'Document all escalations, times, and responses clearly',
        ],
      },
      {
        title: 'Key Nursing Actions',
        type: 'tip',
        content: [
          'Don\'t wait for a full set of results to escalate - clinical suspicion is enough',
          'Ensure IV access is secured early (ideally 2 large-bore cannulae)',
          'Prepare fluids and antibiotics while awaiting review',
          'Reassess after each fluid bolus - check BP, HR, cap refill, urine output',
        ],
      },
    ],
  },
  'wound-care-infection-control': {
    title: 'Wound Care & Infection Control',
    description: 'Wound assessment, dressing selection, and infection prevention best practices.',
    isLocked: false,
    readTime: '6 min read',
    sections: [
      {
        title: 'Wound Assessment - TIME Framework',
        type: 'checklist',
        content: [
          'T - Tissue: Is it viable (healthy, granulating) or non-viable (sloughy, necrotic)?',
          'I - Infection/Inflammation: Signs of infection? Increased exudate, odour, erythema?',
          'M - Moisture: Is the wound too wet or too dry?',
          'E - Edge: Are the wound edges advancing? Any undermining or rolled edges?',
        ],
      },
      {
        title: 'Signs of Wound Infection',
        type: 'warning',
        content: [
          'Increased pain or tenderness',
          'Spreading erythema (redness beyond wound edge)',
          'Increased warmth around wound',
          'Purulent or increased exudate',
          'Malodour',
          'Delayed healing or wound breakdown',
          'Systemic signs: fever, raised WCC, feeling unwell',
        ],
      },
      {
        title: 'Dressing Selection Guide',
        type: 'normal',
        content: [
          'Dry wounds: Hydrogels, hydrocolloids to donate moisture',
          'Moderate exudate: Foam dressings, alginates',
          'Heavy exudate: Superabsorbent dressings, negative pressure wound therapy',
          'Infected wounds: Antimicrobial dressings (silver, iodine, honey)',
          'Granulating wounds: Non-adherent dressings, hydrocolloids',
          'Sloughy wounds: May need debridement - hydrogels, larvae therapy',
        ],
      },
      {
        title: 'Infection Prevention',
        type: 'tip',
        content: [
          'Hand hygiene before AND after wound care - even with gloves',
          'Use aseptic non-touch technique (ANTT) for all wound care',
          'Clean from cleanest to dirtiest area',
          'Single-use equipment where possible',
          'Document wound appearance, size, and any changes at each dressing change',
        ],
      },
    ],
  },
  'medicines-management-osce': {
    title: 'Medicines Management OSCE',
    description: 'Drug calculations, administration routes, and common medication errors to avoid.',
    isLocked: true,
    readTime: '8 min read',
    sections: [
      {
        title: 'The 6 Rights of Medication Administration',
        type: 'checklist',
        content: [
          'Right PATIENT - check ID band, ask to state name and DOB',
          'Right DRUG - check prescription, indication, allergies',
          'Right DOSE - calculate if needed, check appropriateness',
          'Right ROUTE - oral, IV, IM, SC, topical, etc.',
          'Right TIME - check frequency and when last given',
          'Right DOCUMENTATION - sign after administration',
        ],
      },
      {
        title: 'Essential Drug Calculations',
        type: 'normal',
        content: [
          'Basic formula: What you want ÷ What you\'ve got × Volume',
          'Example: Need 250mg, have 500mg in 10ml = 250÷500×10 = 5ml',
          'IV rate (ml/hr): Volume (ml) ÷ Time (hours)',
          'Drops per minute: (Volume × Drop factor) ÷ (Time in minutes)',
          'Weight-based: Dose (mg/kg) × Patient weight (kg)',
        ],
      },
      {
        title: 'Common Medication Errors to Avoid',
        type: 'warning',
        content: [
          'Never leave medications unattended at bedside',
          'Don\'t assume - always check allergies even for "simple" drugs',
          'Look-alike/sound-alike drugs: amlodipine vs amiloride, metformin vs metronidazole',
          'Decimal point errors: 1.0mg could be misread as 10mg - write "1 mg"',
          'Don\'t crush modified-release tablets',
          'Check renal/hepatic function for dose adjustments',
        ],
      },
      {
        title: 'OSCE Tips',
        type: 'tip',
        content: [
          'Talk through your process out loud - examiners can\'t mark what they can\'t hear',
          'Always wash hands at start and end',
          'Check expiry dates and integrity of packaging',
          'If you make an error, acknowledge it and explain what you would do',
          'Ask the patient about swallowing ability before giving oral meds',
        ],
      },
    ],
  },
  'sbar-handover': {
    title: 'SBAR Handover Template',
    description: 'Printable SBAR template with examples for confident clinical handovers.',
    isLocked: false,
    readTime: '3 min read',
    sections: [
      {
        title: 'S - Situation',
        type: 'normal',
        content: [
          '"I am calling about [patient name] in [bed/ward]"',
          '"The problem I am calling about is..."',
          'State the issue clearly and concisely',
          'Include vital signs if relevant',
        ],
      },
      {
        title: 'B - Background',
        type: 'normal',
        content: [
          '"The patient was admitted on [date] with [diagnosis]"',
          '"Relevant medical history includes..."',
          '"Current treatment includes..."',
          'Include allergies and recent changes',
        ],
      },
      {
        title: 'A - Assessment',
        type: 'normal',
        content: [
          '"I think the problem is..." or "I\'m not sure what the problem is but..."',
          '"The patient\'s condition is: stable / worsening / improving"',
          'Include your clinical observations and concerns',
          'NEWS2 score if relevant',
        ],
      },
      {
        title: 'R - Recommendation',
        type: 'normal',
        content: [
          '"I would like you to..." (come see the patient, prescribe X, advise on Y)',
          '"Do you agree?"',
          '"Is there anything else I should do in the meantime?"',
          'Clarify timeframe for review',
        ],
      },
      {
        title: 'Example SBAR',
        type: 'tip',
        content: [
          'S: "I\'m calling about Mrs Jones in bed 4. She\'s become acutely short of breath, RR 28, SpO2 88% on air."',
          'B: "She\'s day 2 post hip replacement, history of COPD. Was stable this morning."',
          'A: "I\'m concerned she may have a PE or COPD exacerbation. NEWS2 is 7."',
          'R: "I\'d like you to review her urgently please. I\'ve started oxygen and will get an ECG."',
        ],
      },
    ],
  },
  'iv-fluids-vitals': {
    title: 'IV Fluids & Vitals Red Flags',
    description: 'Fluid balance essentials and vital signs that need immediate escalation.',
    isLocked: true,
    readTime: '6 min read',
    sections: [
      {
        title: 'Common IV Fluids',
        type: 'normal',
        content: [
          '0.9% Sodium Chloride (Normal Saline): Resuscitation, dehydration, diluting medications',
          'Hartmann\'s (Ringer\'s Lactate): Resuscitation, surgical patients, more physiological',
          '5% Dextrose: Maintenance fluid, NOT for resuscitation (distributes to all compartments)',
          'Dextrose-Saline: Maintenance when both glucose and sodium needed',
          'Plasmalyte: Balanced crystalloid, increasingly used for resuscitation',
        ],
      },
      {
        title: 'Fluid Balance Red Flags',
        type: 'warning',
        content: [
          'Urine output <0.5ml/kg/hr for 2+ hours - may indicate AKI or dehydration',
          'Positive fluid balance >2L in 24hrs - risk of overload',
          'Rising creatinine with oliguria - escalate urgently',
          'Signs of overload: peripheral oedema, raised JVP, crackles in lungs, increasing O2 requirement',
        ],
      },
      {
        title: 'Vital Signs Red Flags - Escalate Immediately',
        type: 'warning',
        content: [
          'RR <8 or >25',
          'SpO2 <92% (or <88% in COPD) on oxygen',
          'HR <40 or >130',
          'Systolic BP <90 or >200',
          'New confusion or reduced GCS',
          'Temperature <35°C or >39°C with other concerns',
        ],
      },
      {
        title: 'Monitoring Tips',
        type: 'tip',
        content: [
          'Record accurate fluid input AND output - check drains, catheter, vomit, diarrhoea',
          'Weigh patients daily if on strict fluid balance',
          'Check cannula site regularly for phlebitis',
          'Know your patient\'s normal baseline - a BP of 100 may be normal for some, low for others',
        ],
      },
    ],
  },
  'news2-guide': {
    title: 'NEWS2 Quick Guide',
    description: 'National Early Warning Score explained with scoring chart and response triggers.',
    isLocked: false,
    readTime: '4 min read',
    sections: [
      {
        title: 'NEWS2 Parameters',
        type: 'checklist',
        content: [
          'Respiratory rate (scores 0-3)',
          'SpO2 Scale 1 or Scale 2 (scores 0-3)',
          'Air or oxygen (0 or 2)',
          'Systolic blood pressure (scores 0-3)',
          'Pulse/heart rate (scores 0-3)',
          'Consciousness (Alert, Confusion, Voice, Pain, Unresponsive) (scores 0-3)',
          'Temperature (scores 0-3)',
        ],
      },
      {
        title: 'SpO2 Scale 2 - When to Use',
        type: 'tip',
        content: [
          'Use Scale 2 ONLY for patients with confirmed hypercapnic respiratory failure (usually COPD)',
          'Must have written prescription for target SpO2 88-92%',
          'If in doubt, use Scale 1 (target 94-98%)',
        ],
      },
      {
        title: 'Response Triggers',
        type: 'normal',
        content: [
          'Score 0: Routine monitoring (minimum 12-hourly)',
          'Score 1-4: Increase monitoring frequency, inform registered nurse',
          'Score 3 in any single parameter: Urgent review within 1 hour',
          'Score 5-6: Urgent response - hourly monitoring, urgent clinician review',
          'Score 7+: Emergency response - continuous monitoring, emergency clinical review, consider critical care',
        ],
      },
      {
        title: 'Key Points',
        type: 'warning',
        content: [
          'NEW confusion scores 3 - always escalate new confusion',
          'Don\'t just document the score - ACT on it',
          'Clinical judgement still matters - escalate if concerned even with low score',
          'Trends matter - a rising score is concerning even if not yet at threshold',
        ],
      },
    ],
  },
  'pressure-area-care': {
    title: 'Pressure Area Care Plan',
    description: 'Waterlow scoring, prevention strategies, and SSKIN bundle implementation.',
    isLocked: true,
    readTime: '5 min read',
    sections: [
      {
        title: 'Waterlow Risk Assessment Categories',
        type: 'checklist',
        content: [
          'Build/weight for height',
          'Skin type and visual risk areas',
          'Sex and age',
          'Continence',
          'Mobility',
          'Appetite and nutrition',
          'Special risks: tissue malnutrition, neurological deficit, major surgery/trauma, medication',
        ],
      },
      {
        title: 'Waterlow Scores',
        type: 'normal',
        content: [
          '10-14: At risk',
          '15-19: High risk',
          '20+: Very high risk',
          'Reassess regularly and when condition changes',
        ],
      },
      {
        title: 'SSKIN Bundle',
        type: 'checklist',
        content: [
          'S - Surface: appropriate mattress/cushion for risk level',
          'S - Skin inspection: check pressure areas at every opportunity',
          'K - Keep moving: reposition 2-4 hourly, mobilise where possible',
          'I - Incontinence/moisture: keep skin clean and dry, use barrier products',
          'N - Nutrition: ensure adequate nutrition and hydration',
        ],
      },
      {
        title: 'Pressure Ulcer Categories',
        type: 'warning',
        content: [
          'Category 1: Non-blanching erythema (redness that doesn\'t fade when pressed)',
          'Category 2: Partial thickness skin loss - shallow open ulcer or blister',
          'Category 3: Full thickness skin loss - fat visible, may see slough',
          'Category 4: Full thickness tissue loss - bone/tendon/muscle exposed',
          'Unstageable: Full thickness, base obscured by slough/eschar',
          'Deep tissue injury: Purple/maroon discoloured intact skin',
        ],
      },
    ],
  },
  'ae-assessment': {
    title: 'A-E Assessment Checklist',
    description: 'Systematic ABCDE assessment approach with printable pocket checklist.',
    isLocked: false,
    readTime: '5 min read',
    sections: [
      {
        title: 'A - Airway',
        type: 'checklist',
        content: [
          'Is the patient talking? (Patent airway if speaking)',
          'Look for obstruction: secretions, vomit, blood, foreign body',
          'Listen for abnormal sounds: stridor, gurgling, snoring',
          'Feel for air movement',
          'If obstructed: head tilt/chin lift, suction, consider airway adjuncts',
          'Call for help early if airway compromised',
        ],
      },
      {
        title: 'B - Breathing',
        type: 'checklist',
        content: [
          'Respiratory rate (count for 60 seconds)',
          'SpO2 on air, then on oxygen if needed',
          'Work of breathing: accessory muscles, recession',
          'Chest expansion: equal bilateral?',
          'Auscultate: air entry, added sounds (wheeze, crackles)',
          'Percussion if indicated',
          'Give oxygen if SpO2 <94% (or <88% COPD)',
        ],
      },
      {
        title: 'C - Circulation',
        type: 'checklist',
        content: [
          'Heart rate and rhythm (manual pulse)',
          'Blood pressure',
          'Capillary refill time (<2 seconds normal)',
          'Skin colour, temperature, moisture',
          'Urine output (if catheterised)',
          'Look for bleeding (visible and consider hidden)',
          'IV access if unwell, take bloods, consider fluids',
        ],
      },
      {
        title: 'D - Disability',
        type: 'checklist',
        content: [
          'AVPU: Alert, Voice, Pain, Unresponsive',
          'GCS if reduced consciousness',
          'Pupil size and reactivity',
          'Blood glucose (treat if <4mmol/L)',
          'Check drug chart: sedatives, opioids, insulin?',
          'Consider causes: hypoxia, hypoglycaemia, opiates, seizures, stroke',
        ],
      },
      {
        title: 'E - Exposure',
        type: 'checklist',
        content: [
          'Temperature',
          'Full body inspection (maintain dignity)',
          'Look for rashes, wounds, swelling, bruising',
          'Check behind/underneath patient',
          'Review charts, notes, observation trends',
          'Keep patient warm after examination',
        ],
      },
    ],
  },
  'end-of-life-communication': {
    title: 'End of Life Communication Phrases',
    description: 'Compassionate phrases and frameworks for difficult conversations with families.',
    isLocked: true,
    readTime: '6 min read',
    sections: [
      {
        title: 'Setting Up the Conversation',
        type: 'normal',
        content: [
          'Find a private, quiet space',
          'Ensure you have time and won\'t be interrupted',
          'Sit at eye level, maintain appropriate eye contact',
          'Ask who they would like present',
          '"I need to talk to you about something important. Is now a good time?"',
        ],
      },
      {
        title: 'Delivering Difficult News',
        type: 'normal',
        content: [
          'Give a warning shot: "I\'m afraid I have some difficult news..."',
          'Be clear and avoid euphemisms: "dying" not "passing away"',
          'Pause after giving information - allow time to process',
          'Don\'t fill silences - let them lead',
          '"I\'m so sorry. This must be very hard to hear."',
        ],
      },
      {
        title: 'Helpful Phrases',
        type: 'tip',
        content: [
          '"What is your understanding of what\'s happening?"',
          '"I wish things were different."',
          '"This must be really frightening/overwhelming."',
          '"What matters most to you/them right now?"',
          '"We will make sure they are comfortable and not in pain."',
          '"You don\'t have to make any decisions right now."',
          '"It\'s okay to feel however you\'re feeling."',
        ],
      },
      {
        title: 'Things to Avoid',
        type: 'warning',
        content: [
          'Don\'t say "I know how you feel" - you don\'t',
          'Avoid "at least they had a good life" - minimises grief',
          'Don\'t give false hope or unrealistic reassurance',
          'Avoid medical jargon',
          'Don\'t rush - this conversation can\'t be hurried',
        ],
      },
      {
        title: 'After the Conversation',
        type: 'normal',
        content: [
          'Summarise what was discussed',
          'Ask if they have questions',
          'Explain next steps clearly',
          'Offer written information if available',
          'Arrange follow-up and give contact details',
          'Document the conversation in the notes',
          'Debrief with colleagues if you need support',
        ],
      },
    ],
  },
};

// Map slug to resource
function getResourceBySlug(slug: string) {
  return resources[slug] || null;
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const { userId } = await auth();

  // Check access for locked resources
  if (resource.isLocked) {
    if (!userId) {
      redirect('/sign-in');
    }

    const entitlements = await getUserEntitlements(userId);
    const isPro = entitlements.length > 0;

    if (!isPro) {
      redirect('/pricing');
    }
  }

  const getSectionIcon = (type?: string) => {
    switch (type) {
      case 'checklist': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'tip': return <Lightbulb className="w-5 h-5 text-[var(--purple)]" />;
      default: return <FileText className="w-5 h-5 text-[var(--plum-dark)]/50" />;
    }
  };

  const getSectionStyle = (type?: string) => {
    switch (type) {
      case 'checklist': return 'bg-emerald-50/50 border-emerald-200';
      case 'warning': return 'bg-amber-50/50 border-amber-200';
      case 'tip': return 'bg-[var(--lilac-soft)] border-[var(--lavender)]';
      default: return 'bg-white border-[var(--lilac-medium)]';
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-[var(--purple)] font-medium mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                resource.isLocked
                  ? 'bg-[var(--purple)]/10 text-[var(--purple)]'
                  : 'bg-emerald-50 text-emerald-700'
              }`}>
                {resource.isLocked ? 'PREMIUM' : 'FREE'}
              </span>
              <span className="flex items-center gap-1 text-sm text-[var(--plum-dark)]/60">
                <Clock className="w-4 h-4" />
                {resource.readTime}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl mb-3">{resource.title}</h1>
            <p className="text-lg text-[var(--plum-dark)]/70">{resource.description}</p>
          </div>

          {/* Content sections */}
          <div className="space-y-6">
            {resource.sections.map((section, index) => (
              <div
                key={index}
                className={`rounded-2xl border p-6 ${getSectionStyle(section.type)}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {getSectionIcon(section.type)}
                  <h2 className="text-lg font-semibold text-[var(--plum)]">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {section.type === 'checklist' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--purple)] mt-2 flex-shrink-0" />
                      )}
                      <span className="text-[var(--plum-dark)]/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-12 text-center">
            <p className="text-[var(--plum-dark)]/60 mb-4">Found this helpful?</p>
            <Link
              href="/hub"
              className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--plum)] transition-all"
            >
              Explore More Resources
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
