import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ResourceDiscussion from '@/components/ResourceDiscussion';
import { getUserEntitlements } from '@/lib/entitlements';
import { ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, FileText, Clock } from 'lucide-react';

// Resource content database
const resources: Record<string, {
  title: string;
  description: string;
  isLocked: boolean;
  readTime: string;
  sections: Array<{
    title: string;
    type?: 'checklist' | 'warning' | 'tip' | 'normal';
    content: string[];
  }>;
}> = {
  // --- AUTO-GENERATED PLACEHOLDER ENTRIES FOR MISSING HUB RESOURCES ---
  'y1-growth-milestones': {
    title: 'Y1 Growth & Development Milestones',
    description: 'Key developmental milestones from birth to 5 years with red flags to spot. Based on UK NHS and RCPCH guidance.',
    isLocked: false,
    readTime: '6 min read',
    sections: [
      {
        title: 'Gross Motor Milestones',
        type: 'checklist',
        content: [
          '6 weeks: Head control developing',
          '6 months: Sits with support, rolls over',
          '9 months: Sits without support, pulls to stand',
          '12 months: Cruises, may walk with one hand held',
          '18 months: Walks alone, climbs onto furniture',
          '2 years: Runs, kicks a ball',
          '3 years: Rides a tricycle, stands on one foot',
          '4 years: Hops on one foot, climbs stairs with alternate feet',
          '5 years: Skips, can catch a ball',
        ],
      },
      {
        title: 'Fine Motor & Vision Milestones',
        type: 'checklist',
        content: [
          '6 weeks: Follows face',
          '6 months: Transfers objects hand to hand',
          '9 months: Pincer grip developing',
          '12 months: Points, picks up small objects',
          '18 months: Builds tower of 2-3 blocks',
          '2 years: Draws lines, builds tower of 6 blocks',
          '3 years: Copies a circle, uses a spoon well',
          '4 years: Draws a cross, buttons clothes',
          '5 years: Draws a square, uses cutlery',
        ],
      },
      {
        title: 'Speech, Language & Hearing Milestones',
        type: 'checklist',
        content: [
          '6 weeks: Startles to loud noise',
          '6 months: Babbles, turns to sounds',
          '9 months: Understands "no"',
          '12 months: 1-2 words, points to objects',
          '18 months: 6-20 words, points to body parts',
          '2 years: 2-3 word sentences, 50+ words',
          '3 years: Talks in sentences, strangers understand most',
          '4 years: Tells stories, asks questions',
          '5 years: Fluent speech, knows colours and shapes',
        ],
      },
      {
        title: 'Social & Emotional Milestones',
        type: 'checklist',
        content: [
          '6 weeks: Smiles responsively',
          '6 months: Recognises familiar faces',
          '9 months: Stranger anxiety',
          '12 months: Waves bye-bye, plays peekaboo',
          '18 months: Imitates adults, plays alone',
          '2 years: Parallel play',
          '3 years: Shares toys, takes turns',
          '4 years: Cooperative play, makes friends',
          '5 years: Understands rules, shows empathy',
        ],
      },
      {
        title: 'Red Flags – When to Escalate',
        type: 'warning',
        content: [
          'No social smile by 8 weeks',
          'No head control by 4 months',
          'Not sitting by 9 months',
          'Not walking by 18 months',
          'No single words by 18 months',
          'No 2-3 word phrases by 2.5 years',
          'Persistent toe-walking',
          'Loss of skills at any age',
        ],
      },
      {
        title: 'References',
        type: 'tip',
        content: [
          'NHS: https://www.nhs.uk/conditions/pregnancy-and-baby/baby-development/',
          'RCPCH: https://www.rcpch.ac.uk/resources/child-development-milestones',
          'NICE: https://cks.nice.org.uk/topics/child-development-assessment/',
        ],
      },
    ],
  },
  'y1-paeds-vital-signs': {
    title: 'Y1 Paediatric Vital Signs by Age',
    description: 'Normal vital sign ranges for children from newborn to adolescent, with a quick reference chart. Based on UK NHS and RCPCH guidance.',
    isLocked: false,
    readTime: '4 min read',
    sections: [
      {
        title: 'Normal Vital Signs by Age (RCPCH/NHS)',
        type: 'checklist',
        content: [
          'Newborn (0-1 month): HR 110-160, RR 30-60, Systolic BP 60-90',
          'Infant (1-12 months): HR 100-160, RR 30-40, Systolic BP 70-95',
          'Toddler (1-2 years): HR 90-150, RR 25-35, Systolic BP 80-100',
          'Preschool (3-5 years): HR 80-140, RR 20-30, Systolic BP 80-110',
          'School age (6-12 years): HR 70-120, RR 15-25, Systolic BP 90-115',
          'Adolescent (13+ years): HR 60-100, RR 12-20, Systolic BP 100-120',
        ],
      },
      {
        title: 'Temperature',
        type: 'normal',
        content: [
          'Normal range: 36.5°C – 37.5°C',
          'Fever: >38°C',
          'Hypothermia: <36°C',
        ],
      },
      {
        title: 'Red Flags',
        type: 'warning',
        content: [
          'Tachycardia or bradycardia for age',
          'Tachypnoea or bradypnoea for age',
          'Hypotension (late sign in children)',
          'Persistent fever or hypothermia',
          'Any sudden change from baseline',
        ],
      },
      {
        title: 'Clinical Tips',
        type: 'tip',
        content: [
          'Always interpret vital signs in context (e.g. crying, fever, pain)',
          'Trends are more important than single readings',
          'Hypotension is a late and pre-terminal sign in children',
          'Use age-appropriate equipment (cuffs, probes)',
        ],
      },
      {
        title: 'References',
        type: 'tip',
        content: [
          'NHS: https://www.nhs.uk/conditions/baby/first-aid-and-safety/vital-signs/',
          'RCPCH: https://www.rcpch.ac.uk/resources/paediatric-early-warning-score-pews',
          'Resus Council UK: https://www.resus.org.uk/library/additional-guidance/guidance-paediatric-advanced-life-support',
        ],
      },
    ],
  },
  'y1-family-centred-care': {
    title: 'Y1 Family-Centred Care Principles',
    description: 'Understanding family-centred care in paediatrics and how to apply it on placement. Based on UK NHS and RCPCH guidance.',
    isLocked: false,
    readTime: '5 min read',
    sections: [
      {
        title: 'What is Family-Centred Care?',
        type: 'normal',
        content: [
          'A philosophy of care that recognises the vital role of the family in a child\'s health and wellbeing.',
          'Families are partners in care, not just visitors.',
          'Care is planned and delivered around the whole family, not just the patient.',
        ],
      },
      {
        title: 'Key Principles (NHS/RCN)',
        type: 'checklist',
        content: [
          'Respect and dignity for all family members',
          'Information sharing: open, honest, age-appropriate',
          'Participation: families involved in all decisions',
          'Collaboration: families and professionals work together',
          'Support for family strengths, beliefs, and cultural needs',
        ],
      },
      {
        title: 'Practical Application on Placement',
        type: 'tip',
        content: [
          'Introduce yourself to the child and family, not just the patient',
          'Ask about routines, preferences, and concerns',
          'Encourage parents to be present and involved in care',
          'Support siblings and other family members',
          'Offer choices where possible (e.g. timing of care, involvement in procedures)',
          'Use play specialists and interpreters as needed',
        ],
      },
      {
        title: 'Benefits of Family-Centred Care',
        type: 'normal',
        content: [
          'Improved child and family satisfaction',
          'Better health outcomes and reduced anxiety',
          'Faster recovery and shorter hospital stays',
          'Greater confidence and competence for families',
        ],
      },
      {
        title: 'References',
        type: 'tip',
        content: [
          'NHS: https://www.england.nhs.uk/ourwork/clinical-policy/children/transition/family-centred-care/',
          'RCN: https://www.rcn.org.uk/professional-development/publications/pub-009-409',
        ],
      },
    ],
  },
  'y1-play-distraction': {
    title: 'Y1 Play & Distraction Techniques',
    description: 'Comprehensive guide to age-appropriate play and distraction strategies for procedures, hospital stays, and anxiety reduction. Includes clinical pearls, worked examples, and practical tips for OSCEs and placements.',
    isLocked: false,
    readTime: '8 min read',
    sections: [
      {
        title: 'Why Play & Distraction Matter',
        type: 'normal',
        content: [
          'Play is essential for child development, coping, and emotional wellbeing in hospital.',
          'Distraction reduces pain, anxiety, and trauma during procedures.',
          'Empowers children and gives them a sense of control.',
          'Improves cooperation and outcomes for staff and families.',
        ],
      },
      {
        title: 'Play Techniques by Age Group',
        type: 'checklist',
        content: [
          'Infants (0-1 year): Soft toys, rattles, music, gentle touch, mobiles above cot',
          'Toddlers (1-3 years): Peekaboo, bubbles, picture books, singing, stacking blocks',
          'Preschool (3-5 years): Puppets, drawing, stickers, simple games, role play (doctor/nurse)',
          'School age (6-12 years): Board games, video games, storytelling, crafts, science kits',
          'Adolescents (13+): Music, social media, journaling, talking with friends, creative writing',
        ],
      },
      {
        title: 'Distraction Techniques for Procedures',
        type: 'checklist',
        content: [
          'Blowing bubbles or pinwheels during injections or blood tests',
          'Counting games or I-spy during cannulation or dressing changes',
          'Watching cartoons, videos, or using tablets during procedures',
          'Guided imagery, deep breathing, or mindfulness for anxious children',
          'Allowing child to hold comfort item (toy, blanket, parent’s hand)',
          'Virtual reality headsets for older children/adolescents',
          'Music or headphones to block out hospital sounds',
        ],
      },
      {
        title: 'Worked Example: Venepuncture in a 4-year-old',
        type: 'normal',
        content: [
          'Explain the procedure using simple words and a toy ("We’re going to give your arm a magic straw!")',
          'Let the child choose a sticker or toy to hold.',
          'Use bubbles and ask the child to blow as the needle goes in.',
          'Praise the child and offer a reward after.',
        ],
      },
      {
        title: 'Clinical Pearls & Common Pitfalls',
        type: 'tip',
        content: [
          'Always explain what will happen in age-appropriate language—avoid medical jargon.',
          'Let the child choose their distraction if possible—empowers and reassures.',
          'Involve parents/carers in play and distraction—familiar faces help.',
          'Praise and reward after procedures—stickers, certificates, high-fives.',
          'Be flexible—what works for one child may not work for another.',
          'Don’t force play/distraction—respect the child’s wishes.',
          'Prepare equipment and distractions in advance to avoid delays.',
          'Red flag: Escalate if child is inconsolable, refuses all distraction, or shows signs of severe distress.',
        ],
      },
      {
        title: 'OSCE & Placement Tips',
        type: 'tip',
        content: [
          'Talk through your distraction plan out loud in OSCEs—examiners want to hear your reasoning.',
          'Demonstrate empathy and flexibility—adapt to the child’s mood and preferences.',
          'Document what distraction/play was used and the child’s response.',
          'Ask for feedback from parents/carers after procedures.',
        ],
      },
      {
        title: 'References',
        type: 'tip',
        content: [
          'NHS: https://www.nhs.uk/conditions/social-care-and-support-guide/safeguarding/',
          'NSPCC: https://www.nspcc.org.uk/what-is-child-abuse/',
          'RCPCH: https://www.rcpch.ac.uk/key-topics/safeguarding',
        ],
      },
    ],
  },
  'y1-consent-gillick': {
    title: 'Y1 Consent & Gillick Competence',
    description: 'Understanding consent in paediatrics, including Gillick competence and Fraser guidelines. Based on UK NHS and GMC guidance.',
    isLocked: true,
    readTime: '6 min read',
    sections: [
      {
        title: 'Consent in Children and Young People',
        type: 'normal',
        content: [
          'Consent is required for all examinations, treatments, and procedures.',
          'Children under 16 can consent if they have sufficient understanding and intelligence (Gillick competence).',
          'Young people aged 16-17 are presumed to have capacity to consent.',
        ],
      },
      {
        title: 'Gillick Competence',
        type: 'checklist',
        content: [
          'A child under 16 can consent if they fully understand the proposed treatment, risks, and alternatives.',
          'Assessment is decision-specific and must be documented.',
          'Parental consent is not needed if the child is Gillick competent.',
        ],
      },
      {
        title: 'Fraser Guidelines (Contraceptive Advice)',
        type: 'checklist',
        content: [
          'The young person understands the advice',
          'Cannot be persuaded to inform parents or allow parental involvement',
          'Likely to begin or continue sexual activity with or without treatment',
          'Physical or mental health likely to suffer without advice or treatment',
          'Advice or treatment is in the young person\'s best interests',
        ],
      },
      {
        title: 'When Can Parents Consent?',
        type: 'normal',
        content: [
          'If a child is not Gillick competent, those with parental responsibility can consent.',
          'If a competent child refuses treatment, legal advice may be needed in serious cases.',
        ],
      },
      {
        title: 'References',
        type: 'tip',
        content: [
          'NHS: https://www.nhs.uk/conditions/consent-to-treatment/children/',
          'GMC: https://www.gmc-uk.org/ethical-guidance/ethical-guidance-for-doctors/0-18-years/assessing-capacity-and-competence',
          'NSPCC: https://learning.nspcc.org.uk/child-protection-system/gillick-competence-fraser-guidelines',
        ],
      },
    ],
  },
  'y1-paeds-medications': {
    title: 'Y1 Paediatric Medications Guide',
    description: 'Weight-based dosing, common paediatric medications, and safety considerations. Based on UK BNFC and NHS guidance.',
    isLocked: true,
    readTime: '7 min read',
    sections: [
      {
        title: 'Principles of Paediatric Prescribing',
        type: 'normal',
        content: [
          'Always use weight-based dosing (mg/kg) unless otherwise specified.',
          'Check the child\'s weight and date measured.',
          'Use the most up-to-date BNFC (British National Formulary for Children).',
          'Double-check calculations and have a second checker for high-risk drugs.',
        ],
      },
      {
        title: 'Common Paediatric Medications',
        type: 'checklist',
        content: [
          'Paracetamol: 15 mg/kg every 4–6 hours (max 4 doses/24h)',
          'Ibuprofen: 5–10 mg/kg every 6–8 hours (max 30 mg/kg/24h)',
          'Amoxicillin: 30–50 mg/kg/day in divided doses',
          'Salbutamol (inhaled): 2.5–5 mg via nebuliser',
          'Oral rehydration solution: 50 ml/kg over 4 hours for mild dehydration',
          'Gentamicin: Dose and interval depend on age/weight/renal function—always check BNFC',
        ],
      },
      {
        title: 'High-Risk Medications',
        type: 'warning',
        content: [
          'Insulin: risk of hypoglycaemia—double-check dose and route',
          'Gentamicin: nephrotoxic—dose carefully and monitor levels',
          'Morphine: risk of respiratory depression—titrate carefully',
          'IV fluids: risk of fluid overload—calculate maintenance and monitor closely',
        ],
      },
      {
        title: 'Safety Tips',
        type: 'tip',
        content: [
          'Always check allergies before prescribing or administering',
          'Use oral syringes for liquid medicines',
          'Never round doses up or down without checking with a pharmacist',
          'Document dose, route, time, and any adverse reactions',
        ],
      },
      {
        title: 'References',
        type: 'tip',
        content: [
          'BNFC: https://bnfc.nice.org.uk/',
          'NHS: https://www.nhs.uk/medicines/children/',
          'RCN: https://www.rcn.org.uk/clinical-topics/children-and-young-people/medicines-management',
        ],
      },
      {
        title: 'Deep Dive: Paediatric Drug Calculations',
        type: 'tip',
        content: [
          'Accurate drug calculations are critical for paediatric safety. Children are at higher risk of medication errors due to weight-based dosing, smaller therapeutic windows, and the need for precise measurements.',
          '',
          'Key Concepts:',
          '- Always use the most recent and accurate weight (in kg) for all calculations.',
          '- Double-check all calculations, especially for high-risk drugs (e.g., insulin, gentamicin, morphine).',
          '- Use the BNFC or local guidelines for reference doses and maximum limits.',
          '- Be aware of unit conversions (mg ↔ mcg, ml ↔ L, etc.).',
          '',
          'Common Calculation Types:',
          '- Weight-based dosing: Dose (mg/kg) × Weight (kg)',
          '- IV infusion rates: Volume (ml) ÷ Time (hr) = Rate (ml/hr)',
          '- Drip rates: (Volume × Drop factor) ÷ Time (min) = Drops/min',
          '- Dose per volume: (What you want ÷ What you have) × Volume',
          '',
          'Practical Tips:',
          '- Always round doses according to local policy—never guess or estimate.',
          '- Use oral syringes for liquid medicines to ensure accuracy.',
          '- Document all calculations and have a second checker for high-risk or unfamiliar drugs.',
          '- If unsure, ask a pharmacist or senior colleague.',
          '',
          'Worked Example:',
          'A child weighs 18 kg and needs amoxicillin 30 mg/kg/day in 3 divided doses:',
          '- Total daily dose: 30 × 18 = 540 mg',
          '- Each dose: 540 ÷ 3 = 180 mg per dose',
          '',
          'For a full breakdown of formulas, worked examples, IV rate calculations, and practice questions, see our comprehensive resource:',
          '[Drug Calculations Cheat Sheet →](/hub/resources/drug-calculations-cheat-sheet)',
          '',
          'This deep dive is essential for OSCEs, exams, and safe clinical practice. Mastering these skills will help you avoid common pitfalls and deliver safer care.'
        ],
      },
    ],
  },
  'y1-immunisation-schedule': {
    title: 'Year 1 Immunisation Schedule (UK)',
    description: 'A clear overview of the UK childhood immunisation schedule for Year 1 medical students, including timing, vaccines, and rationale.',
    isLocked: false,
    readTime: '5 min read',
    sections: [
      {
        title: 'UK Childhood Immunisation Schedule (as of 2026)',
        type: 'checklist',
        content: [
          'At birth: BCG (if indicated, e.g. high-risk TB areas), Hepatitis B (if indicated)',
          '8 weeks: 6-in-1 (DTaP/IPV/Hib/HepB), Rotavirus (oral), MenB, PCV (Pneumococcal)',
          '12 weeks: 6-in-1 (2nd dose), Rotavirus (2nd dose), MenC/HiB',
          '16 weeks: 6-in-1 (3rd dose), MenB (2nd dose), PCV (2nd dose)',
          '1 year: Hib/MenC booster, MMR (1st dose), PCV booster, MenB booster',
          '2-10 years (annually): Nasal flu vaccine',
          '3 years 4 months: 4-in-1 pre-school booster (DTaP/IPV), MMR (2nd dose)',
        ],
      },
      {
        title: 'Key Points',
        type: 'tip',
        content: [
          'All vaccines are free on the NHS and given according to the national schedule.',
          'Live vaccines (e.g. MMR, Rotavirus, nasal flu) are not given to immunocompromised children.',
          'Catch-up schedules are available for children who miss doses.',
          'Parental consent is required for all childhood immunisations.',
        ],
      },
      {
        title: 'Why Immunise?',
        type: 'normal',
        content: [
          'Protects children from serious infectious diseases.',
          'Reduces spread in the community (herd immunity).',
          'Some vaccines (e.g. MMR) are required for school entry.',
        ],
      },
      {
        title: 'Resources',
        type: 'tip',
        content: [
          'UK Government Immunisation Resources: https://www.gov.uk/government/collections/immunisation',
          'NHS: Vaccinations and When to Have Them: https://www.nhs.uk/conditions/vaccinations/nhs-vaccinations-and-when-to-have-them/',
        ],
      },
    ],
  },
  'y1-child-communication': {
    title: 'Y1 Communicating with Children',
    description: 'How to adapt your communication for different ages and developmental stages, based on UK NHS and RCPCH guidance.',
    isLocked: true,
    readTime: '6 min read',
    sections: [
      {
        title: 'Principles of Communicating with Children',
        type: 'normal',
        content: [
          'Children are not small adults—communication must be age-appropriate and tailored to their developmental stage.',
          'Involve parents/carers as partners in communication, but always address the child directly as appropriate.',
          'Use simple language, visual aids, and play to support understanding.',
        ],
      },
      {
        title: 'Communication by Age Group',
        type: 'checklist',
        content: [
          'Infants: Use soothing voice, facial expressions, gentle touch. Respond to cues (crying, smiling).',
          'Toddlers: Simple words, short sentences, play-based explanations. Allow choices (e.g. which sticker).',
          'Pre-school: Use stories, drawings, toys. Explain procedures step-by-step. Reassure and praise.',
          'School age: Give clear, honest information. Encourage questions. Use diagrams, involve in care.',
          'Adolescents: Respect privacy, use open questions, involve in decision-making. Be honest about risks/benefits.',
        ],
      },
      {
        title: 'Tips for Practice',
        type: 'tip',
        content: [
          'Get down to the child\'s eye level.',
          'Use the child\'s name and preferred pronouns.',
          'Be patient—allow time for responses.',
          'Check understanding ("Can you tell me what will happen?").',
          'Use play specialists or interpreters if needed.',
        ],
      },
      {
        title: 'References',
        type: 'tip',
        content: [
          'NHS: https://www.nhs.uk/conditions/baby/first-aid-and-safety/communicating-with-children/',
          'RCPCH: https://www.rcpch.ac.uk/resources/communicating-children-young-people-and-families',
          'Great Ormond Street Hospital: https://www.gosh.nhs.uk/your-hospital-visit/coming-hospital/communicating-children/',
        ],
      },
    ],
  },
  'paediatric-dose-calculator': {
    title: 'Paediatric Dose Calculator Guide',
    description: 'Weight-based dosing formulas, common paediatric medications, and safety checks for children. Based on UK BNFC and NHS guidance.',
    isLocked: true,
    readTime: '6 min read',
    sections: [
      {
        title: 'How to Calculate Paediatric Doses',
        type: 'normal',
        content: [
          'Always use the child\'s most recent weight (kg).',
          'Check the recommended dose in the BNFC.',
          'Formula: Dose required = Dose per kg × Weight (kg)',
          'Check maximum dose limits for age/weight.',
        ],
      },
      {
        title: 'Worked Example',
        type: 'checklist',
        content: [
          'Prescription: Amoxicillin 30 mg/kg/day in 3 divided doses',
          'Child\'s weight: 18 kg',
          'Total daily dose: 30 × 18 = 540 mg',
          'Each dose: 540 ÷ 3 = 180 mg per dose',
        ],
      },
      {
        title: 'Safety Checks',
        type: 'warning',
        content: [
          'Double-check calculations with a colleague',
          'Never round doses up or down without checking with a pharmacist',
          'Check for allergies and contraindications',
          'Document dose, route, and time clearly',
        ],
      },
      {
        title: 'References',
        type: 'tip',
        content: [
          'BNFC: https://bnfc.nice.org.uk/',
          'NHS: https://www.nhs.uk/medicines/children/',
        ],
      },
    ],
  },
  'iv-drip-rate-calculations': {
    title: 'IV Drip Rate Calculations',
    description: 'Master IV drip rate calculations with worked examples, formulas, and practice questions. Based on UK NHS and RCN guidance.',
    isLocked: true,
    readTime: '6 min read',
    sections: [
      {
        title: 'Drip Rate Formula (Gravity Sets)',
        type: 'normal',
        content: [
          'Drip rate (drops/min) = (Volume to be infused (ml) × Drop factor) ÷ Time (minutes)',
          'Drop factor is usually 20 drops/ml (check your giving set)',
        ],
      },
      {
        title: 'Worked Example',
        type: 'checklist',
        content: [
          'Order: 1 litre (1000 ml) over 8 hours',
          'Time: 8 × 60 = 480 minutes',
          'Drip rate = (1000 × 20) ÷ 480 = 41.6 ≈ 42 drops/min',
        ],
      },
      {
        title: 'Pump Rate Formula',
        type: 'normal',
        content: [
          'Pump rate (ml/hr) = Total volume (ml) ÷ Time (hours)',
          'E.g. 1000 ml over 8 hours: 1000 ÷ 8 = 125 ml/hr',
        ],
      },
      {
        title: 'Safety Tips',
        type: 'tip',
        content: [
          'Always use a pump for paediatric infusions if possible',
          'Double-check calculations and settings with a colleague',
          'Monitor the child for signs of fluid overload',
        ],
      },
      {
        title: 'References',
        type: 'tip',
        content: [
          'NHS: https://www.nhs.uk/conditions/iv-infusion/',
          'RCN: https://www.rcn.org.uk/clinical-topics/medicines-management/calculations',
        ],
      },
    ],
  },
  'high-risk-medications': {
    title: 'High-Risk Medications Checklist',
    description: 'Know your high-risk medications: insulin, anticoagulants, opioids, and more with safety checks. Based on UK NHS and NPSA guidance.',
    isLocked: true,
    readTime: '5 min read',
    sections: [
      {
        title: 'What are High-Risk Medications?',
        type: 'normal',
        content: [
          'Medications with a high risk of causing significant harm if used incorrectly.',
          'Require extra care, double-checking, and clear documentation.',
        ],
      },
      {
        title: 'Examples of High-Risk Medications',
        type: 'checklist',
        content: [
          'Insulin',
          'Anticoagulants (e.g. warfarin, heparin)',
          'Opioids (e.g. morphine, fentanyl)',
          'IV potassium',
          'Gentamicin and other aminoglycosides',
          'Chemotherapy agents',
        ],
      },
      {
        title: 'Safety Checks',
        type: 'warning',
        content: [
          'Always double-check dose, route, and patient identity',
          'Use pre-mixed solutions where possible',
          'Document administration clearly',
          'Monitor for adverse effects and escalate concerns promptly',
        ],
      },
      {
        title: 'References',
        type: 'tip',
        content: [
          'NHS: https://www.england.nhs.uk/patient-safety/medication-safety/',
          'NPSA: https://www.sps.nhs.uk/articles/high-risk-medicines/',
        ],
      },
    ],
  },
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
  'pews-guide': {
    title: 'PEWS - Paediatric Early Warning Score',
    description: 'Age-appropriate early warning scoring for children with escalation triggers and response guidance.',
    isLocked: false,
    readTime: '5 min read',
    sections: [
      {
        title: 'PEWS Parameters',
        type: 'checklist',
        content: [
          'Behaviour: Playing/appropriate, Sleeping, Irritable, Lethargic/confused, Reduced response to pain',
          'Cardiovascular: Pink, cap refill 1-2s → Pale/grey, cap refill 3s → Mottled, cap refill 4s → Mottled/tachycardic, cap refill ≥5s',
          'Respiratory: Normal RR, no recession → Raised RR, using accessory muscles → RR >20 above normal or 5 below, retractions → Requires 40%+ O2 or 4L/min',
        ],
      },
      {
        title: 'Normal Vital Signs by Age',
        type: 'checklist',
        content: [
          'Infant (0-12 months): HR 110-160, RR 30-40, Systolic BP 70-90',
          'Toddler (1-2 years): HR 100-150, RR 25-35, Systolic BP 80-95',
          'Preschool (3-5 years): HR 95-140, RR 20-30, Systolic BP 80-100',
          'School age (6-12 years): HR 80-120, RR 15-25, Systolic BP 90-110',
          'Adolescent (13+ years): HR 60-100, RR 12-20, Systolic BP 100-120',
        ],
      },
      {
        title: 'Response Triggers',
        type: 'normal',
        content: [
          'Score 1: Increase observation frequency, inform nurse in charge',
          'Score 2: Nurse in charge to review, consider medical review',
          'Score 3: Urgent medical review within 30 minutes',
          'Score 4+: Immediate medical review, consider PICU/resus team',
          'Any score of 3 in a single parameter: Immediate review required',
        ],
      },
      {
        title: 'Red Flags - Escalate Immediately',
        type: 'warning',
        content: [
          'Unresponsive or only responds to pain',
          'Severe respiratory distress or apnoea',
          'Central cyanosis',
          'Weak/absent pulses, cap refill >5 seconds',
          'Significant bradycardia for age',
          'Parental concern that child is "not themselves"',
          'Staff "gut feeling" that something is wrong',
        ],
      },
      {
        title: 'Key Differences from Adult NEWS2',
        type: 'tip',
        content: [
          'Vital signs must be interpreted using age-appropriate ranges',
          'Behaviour is a key parameter - children compensate then deteriorate rapidly',
          'Parental concern should always be taken seriously',
          'Children can maintain BP until very late - watch for subtle signs',
          'Work of breathing is more important than respiratory rate alone',
          'Always consider safeguarding if presentation doesn\'t fit history',
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
    description: 'Expanded systematic ABCDE assessment approach with clinical pearls, red flags, and printable pocket checklist. Ideal for OSCE revision.',
    isLocked: false,
    readTime: '8 min read',
    sections: [
      {
        title: 'A - Airway',
        type: 'checklist',
        content: [
          'Is the patient talking? (Patent airway if speaking)',
          'Look for visible obstruction: secretions, vomit, blood, foreign body, swelling, tongue, trauma',
          'Listen for abnormal sounds: stridor (upper airway), gurgling, snoring, silence',
          'Feel for air movement at mouth/nose and chest rise',
          'Check for tracheal deviation, use of accessory neck muscles, paradoxical movement',
          'If obstructed: head tilt/chin lift, jaw thrust, suction, consider airway adjuncts (OPA/NPA, supraglottic)',
          'Consider C-spine injury in trauma—use jaw thrust only, immobilise neck',
          'Check for facial burns, swelling, anaphylaxis signs',
          'Call for help early if airway compromised',
          'Red flags: No breath sounds, paradoxical chest/abdominal movement, cyanosis, stridor, inability to speak',
          'Pearl: Always reassess airway after any intervention',
        ],
      },
      {
        title: 'B - Breathing',
        type: 'checklist',
        content: [
          'Assess respiratory rate (count for 60 seconds)',
          'Measure SpO2 on air, then on oxygen if needed',
          'Observe work of breathing: accessory muscles, recession, nasal flaring, tracheal tug, pursed lips',
          'Check chest expansion: equal and bilateral? Any asymmetry?',
          'Auscultate: air entry, added sounds (wheeze, crackles, absent breath sounds, bronchial breathing)',
          'Percuss for dullness (consolidation/effusion) or hyperresonance (pneumothorax)',
          'Look for signs of respiratory distress: tachypnoea, cyanosis, agitation/confusion, use of tripod position',
          'Check for chest injuries, surgical emphysema, subcutaneous air',
          'Give oxygen if SpO2 <94% (or <88% in COPD, titrate carefully)',
          'Consider nebulisers, inhalers, or non-invasive ventilation if indicated',
          'Red flags: Silent chest, exhaustion, altered mental status, tracheal deviation, cyanosis',
          'Pearl: Reassess after interventions, document response to oxygen',
        ],
      },
      {
        title: 'C - Circulation',
        type: 'checklist',
        content: [
          'Check heart rate and rhythm (manual pulse, ECG if available)',
          'Measure blood pressure (compare to baseline if possible, postural BP if indicated)',
          'Assess capillary refill time (<2 seconds normal, check centrally and peripherally)',
          'Inspect skin colour, temperature, and moisture (pale, mottled, clammy, flushed)',
          'Check peripheral pulses (volume, regularity, symmetry)',
          'Assess temperature (core and peripheral)',
          'Monitor urine output (if catheterised or able to measure, consider fluid balance)',
          'Look for bleeding (visible and consider hidden sources: GI, retroperitoneal, chest, long bones)',
          'Check for signs of shock: confusion, tachycardia, hypotension, cold peripheries',
          'Establish IV access if unwell, take bloods, consider IV fluids, crossmatch if bleeding',
          'Red flags: Hypotension, tachycardia, cold peripheries, oliguria/anuria, altered mental status',
          'Pearl: Early recognition and treatment of shock saves lives',
        ],
      },
      {
        title: 'D - Disability',
        type: 'checklist',
        content: [
          'Assess level of consciousness: AVPU (Alert, Voice, Pain, Unresponsive)',
          'Calculate GCS if reduced consciousness, monitor for changes',
          'Check pupil size, symmetry, and reactivity to light',
          'Assess limb movement, tone, and sensation',
          'Measure blood glucose (treat if <4mmol/L or >15mmol/L)',
          'Review drug chart: sedatives, opioids, insulin, antiepileptics, anticoagulants?',
          'Look for signs of seizure activity, post-ictal state, or new confusion',
          'Consider causes: hypoxia, hypoglycaemia, opiates, head injury, stroke, infection, metabolic',
          'Red flags: Unresponsive, new focal neurology, persistent hypoglycaemia, seizure',
          'Pearl: Always check glucose and pupils in altered mental status',
        ],
      },
      {
        title: 'E - Exposure',
        type: 'checklist',
        content: [
          'Fully expose patient for head-to-toe inspection (maintain dignity and warmth)',
          'Look for rashes, wounds, swelling, bruising, pressure sores, surgical sites',
          'Check behind/underneath patient (log roll if trauma suspected, check for bleeding)',
          'Review observation charts, fluid balance, medication and notes for trends, look for missed injuries',
          'Check temperature, prevent hypothermia (use blankets, warm fluids)',
          'Red flags: Petechial/purpuric rash, rapidly spreading swelling, hypothermia, missed injuries',
          'Pearl: Always maintain dignity and warmth, reassess after interventions',
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

  // Color and icon for A-E sections
  const getSectionIcon = (type?: string, title?: string) => {
    if (title?.startsWith('A -')) return <CheckCircle2 className="w-6 h-6 text-red-500" />;
    if (title?.startsWith('B -')) return <CheckCircle2 className="w-6 h-6 text-blue-500" />;
    if (title?.startsWith('C -')) return <CheckCircle2 className="w-6 h-6 text-yellow-500" />;
    if (title?.startsWith('D -')) return <CheckCircle2 className="w-6 h-6 text-purple-500" />;
    if (title?.startsWith('E -')) return <CheckCircle2 className="w-6 h-6 text-green-600" />;
    switch (type) {
      case 'checklist': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'tip': return <Lightbulb className="w-5 h-5 text-[var(--purple)]" />;
      default: return <FileText className="w-5 h-5 text-[var(--plum-dark)]/50" />;
    }
  };

  // Color backgrounds for A-E
  const getSectionStyle = (type?: string, title?: string) => {
    const hoverStyle = 'transition-all duration-200 hover:border-[var(--purple)] hover:shadow-md hover:-translate-y-0.5 cursor-default';
    if (title?.startsWith('A -')) return `bg-red-50 border-red-200 ${hoverStyle}`;
    if (title?.startsWith('B -')) return `bg-blue-50 border-blue-200 ${hoverStyle}`;
    if (title?.startsWith('C -')) return `bg-yellow-50 border-yellow-200 ${hoverStyle}`;
    if (title?.startsWith('D -')) return `bg-purple-50 border-purple-200 ${hoverStyle}`;
    if (title?.startsWith('E -')) return `bg-green-50 border-green-200 ${hoverStyle}`;
    switch (type) {
      case 'checklist': return `bg-emerald-50/50 border-emerald-200 ${hoverStyle}`;
      case 'warning': return `bg-amber-50/50 border-amber-200 ${hoverStyle}`;
      case 'tip': return `bg-[var(--lilac-soft)] border-[var(--lavender)] ${hoverStyle}`;
      default: return `bg-white border-[var(--lilac-medium)] ${hoverStyle}`;
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
          <div className="space-y-8">
            {resource.sections.map((section, index) => (
              <div
                key={index}
                className={`rounded-2xl border p-6 shadow-sm ${getSectionStyle(section.type, section.title)}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {getSectionIcon(section.type, section.title)}
                  <h2 className="text-xl font-bold tracking-tight" style={{letterSpacing: '0.01em'}}>{section.title}</h2>
                </div>
                {/* Quick summary/tip for each section */}
                {section.title.startsWith('A -') && (
                  <div className="mb-4 p-3 rounded-lg bg-red-100/60 text-red-800 text-sm font-medium flex items-center gap-2"><Lightbulb className="w-4 h-4" />Airway is always first—look, listen, feel. Call for help early if in doubt!</div>
                )}
                {section.title.startsWith('B -') && (
                  <div className="mb-4 p-3 rounded-lg bg-blue-100/60 text-blue-800 text-sm font-medium flex items-center gap-2"><Lightbulb className="w-4 h-4" />Breathing: rate, effort, and oxygenation. Watch for silent chest!</div>
                )}
                {section.title.startsWith('C -') && (
                  <div className="mb-4 p-3 rounded-lg bg-yellow-100/60 text-yellow-900 text-sm font-medium flex items-center gap-2"><Lightbulb className="w-4 h-4" />Circulation: pulse, BP, perfusion. Shock can be subtle—check cap refill!</div>
                )}
                {section.title.startsWith('D -') && (
                  <div className="mb-4 p-3 rounded-lg bg-purple-100/60 text-purple-900 text-sm font-medium flex items-center gap-2"><Lightbulb className="w-4 h-4" />Disability: AVPU/GCS, glucose, pupils. Think reversible causes!</div>
                )}
                {section.title.startsWith('E -') && (
                  <div className="mb-4 p-3 rounded-lg bg-green-100/60 text-green-900 text-sm font-medium flex items-center gap-2"><Lightbulb className="w-4 h-4" />Exposure: look everywhere, keep warm, preserve dignity.</div>
                )}
                <ul className="space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i} className={`flex items-start gap-3 p-2 -mx-2 rounded-lg transition-colors ${item.toLowerCase().includes('red flag') ? 'bg-amber-100/60 text-amber-900 font-semibold' : 'hover:bg-[var(--purple)]/5'}`}>
                      {section.type === 'checklist' ? (
                        <CheckCircle2 className={`w-4 h-4 mt-1 flex-shrink-0 ${section.title.startsWith('A -') ? 'text-red-400' : section.title.startsWith('B -') ? 'text-blue-400' : section.title.startsWith('C -') ? 'text-yellow-400' : section.title.startsWith('D -') ? 'text-purple-400' : section.title.startsWith('E -') ? 'text-green-500' : 'text-emerald-500'}`} />
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

          {/* Discussion */}
          <ResourceDiscussion slug={slug} />

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

