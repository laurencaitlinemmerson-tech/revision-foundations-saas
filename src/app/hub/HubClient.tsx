'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ToastProvider, useToast } from '@/components/Toast';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import {
  Search,
  Sparkles,
  ArrowDown,
  CheckCircle2,
  Stethoscope,
  Lock,
  Zap,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Heart,
  MessageCircle,
  Calculator,
  FileText,
} from 'lucide-react';

// Hub content items
interface HubItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: 'Quick Win' | 'Moderate' | 'Deep Dive';
  isLocked: boolean;
  href: string;
  isNew?: boolean;
}

interface HubItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: 'Quick Win' | 'Moderate' | 'Deep Dive';
  isLocked: boolean;
  href: string;
  isNew?: boolean;
  keyPoints?: string[];
}

const hubItems: HubItem[] = [
// Placement Survival Guide removed from hubItems
          {
            id: 'y1-professionalism-ethics',
            title: 'Y1 Professionalism & Ethics',
            description: 'Comprehensive introduction to professional behaviour, NMC Code, values, and ethical principles for Year 1 nursing students. Includes real-world scenarios, common dilemmas, and tips for upholding professionalism on placement.',
            tags: ['Y1 Essentials', 'Ethics', 'Professionalism'],
            difficulty: 'Quick Win',
            isLocked: false,
            href: '/hub/resources/y1-professionalism-ethics',
            isNew: true,
            keyPoints: [
              'Understand the NMC Code and its real-life application',
              'Recognise common ethical dilemmas on placement',
              'Tips for maintaining professionalism as a student',
            ],
          },
        {
          id: 'y1-documentation',
          title: 'Y1 Documentation & Record Keeping',
          description: 'Step-by-step guide to accurate, legal, and professional documentation. Covers SOAP notes, common abbreviations, legal pitfalls, and practical tips for clear record keeping on placement.',
          tags: ['Y1 Essentials', 'Documentation', 'Placement'],
          difficulty: 'Quick Win',
          isLocked: false,
          href: '/hub/resources/y1-documentation',
          isNew: true,
          keyPoints: [
            'How to write clear, legal, and professional notes',
            'Common documentation pitfalls and how to avoid them',
            'SOAP note structure explained',
          ],
        },
      {
        id: 'y1-infection-control',
        title: 'Y1 Infection Control',
        description: 'Core principles of infection prevention and control: hand hygiene, PPE, aseptic technique, and real-life placement scenarios. Includes common mistakes, red flags, and how to protect yourself and patients.',
        tags: ['Y1 Essentials', 'Infection Control', 'Placement'],
        difficulty: 'Quick Win',
        isLocked: false,
        href: '/hub/resources/y1-infection-control',
        isNew: true,
        keyPoints: [
          'Hand hygiene and PPE best practices',
          'Red flags for infection on placement',
          'Aseptic technique step-by-step',
        ],
      },
    {
      id: 'y1-anatomy-physiology',
      title: 'Y1 Anatomy & Physiology',
      description: 'Overview of major body systems, functions, and key facts for Year 1 nursing. Includes diagrams, clinical relevance, and memory aids for exams and placement.',
      tags: ['Y1 Essentials', 'Anatomy', 'Physiology'],
      difficulty: 'Quick Win',
      isLocked: false,
      href: '/hub/resources/y1-anatomy-physiology',
      isNew: true,
      keyPoints: [
        'Major body systems and their functions',
        'Clinical relevance for each system',
        'Memory aids for anatomy exams',
      ],
    },
  {
    id: 'theories-dev',
    title: 'Theories of Development',
    description: 'Key developmental theories (Piaget, Erikson, Bowlby, Vygotsky, and more) explained for nursing and exams. Includes practical examples, comparison tables, and how to apply theory to patient care.',
    tags: ['Y1 Essentials', 'Paeds', 'Theory', 'Assessment'],
    difficulty: 'Moderate',
    isLocked: false,
    href: '/hub/resources/theories-of-development',
    isNew: true,
    keyPoints: [
      'Compare Piaget, Erikson, Bowlby, Vygotsky',
      'Apply theory to real patient scenarios',
      'Quick reference comparison tables',
    ],
  },
  {
    id: '1',
    title: 'Paeds Respiratory Assessment',
    description:
      'Complete guide to assessing respiratory function in children: inspection, auscultation, work of breathing, and red flags. Includes normal vs abnormal findings, escalation triggers, and OSCE tips.',
    tags: ['OSCE', 'Paeds', 'Assessment'],
    keyPoints: [
      'Normal vs abnormal respiratory findings',
      'Escalation triggers for paediatric patients',
      'OSCE tips for respiratory assessment',
    ],
    difficulty: 'Moderate',
    isLocked: false,
    href: '/hub/resources/paeds-respiratory-assessment',
  },
  {
    id: '2',
    title: 'Sepsis 6 & Escalation',
    description: 'Step-by-step sepsis recognition, the Sepsis 6 bundle, escalation pathways, and case studies. Includes early warning signs, documentation tips, and what to do if you suspect sepsis.',
    tags: ['Emergency/ABCDE', 'Adult Nursing', 'Critical Care'],
    keyPoints: [
      'Recognise early signs of sepsis',
      'Understand the Sepsis 6 bundle',
      'Escalation and documentation tips',
    ],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/sepsis-6-escalation',
  },
  {
    id: '3',
    title: 'Wound Care & Infection Control',
    description: 'Wound assessment, dressing selection, infection prevention, and practical wound care tips. Includes wound types, red flags, and documentation essentials.',
    tags: ['Adult Nursing', 'Placement', 'Practical'],
    keyPoints: [
      'Wound types and dressing selection',
      'Infection prevention strategies',
      'Documentation essentials for wounds',
    ],
    difficulty: 'Moderate',
    isLocked: false,
    href: '/hub/resources/wound-care-infection-control',
  },
  {
    id: '4',
    title: 'Medicines Management OSCE',
    description: 'Drug calculations, administration routes, common medication errors, and worked examples. Includes formulas, safety checks, and how to avoid the most frequent mistakes on placement.',
    tags: ['OSCE', 'Meds & Calculations'],
    keyPoints: [
      'Drug calculation formulas and worked examples',
      'Common medication errors to avoid',
      'Safety checks before administration',
    ],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/medicines-management-osce',
  },
  {
    id: '5',
    title: 'SBAR Handover Template',
    description: 'Printable SBAR template with worked examples for confident clinical handovers. Includes tips for clear communication, common pitfalls, and how to escalate concerns effectively.',
    tags: ['Placement', 'Communication'],
    keyPoints: [
      'SBAR structure and printable template',
      'Example handover scripts',
      'Escalation tips for handover',
    ],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/sbar-handover',
  },
  {
    id: '6',
    title: 'IV Fluids & Vitals Red Flags',
    description: 'Fluid balance essentials, vital signs that need immediate escalation, and practical fluid management tips. Includes worked examples, red flags, and documentation advice.',
    tags: ['Adult Nursing', 'Emergency/ABCDE', 'Critical Care'],
    keyPoints: [
      'Vital signs that require escalation',
      'Fluid balance worked examples',
      'Documentation advice for fluids',
    ],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/iv-fluids-vitals',
  },
  {
    id: '7',
    title: 'NEWS2 Quick Guide',
    description: 'National Early Warning Score (NEWS2) explained with scoring chart, response triggers, and case examples. Includes how to interpret scores and when to escalate.',
    tags: ['Adult Nursing', 'Assessment', 'Emergency/ABCDE'],
    keyPoints: [
      'How to use the NEWS2 chart',
      'Response triggers and escalation',
      'Case examples for practice',
    ],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/news2-guide',
  },
  {
    id: '11',
    title: 'PEWS - Paediatric Early Warning Score',
    description: 'PEWS: Age-appropriate early warning scoring for children, escalation triggers, and normal ranges. Includes charts, red flags, and how to use PEWS in practice.',
    tags: ['Paeds', 'Assessment', 'Emergency/ABCDE'],
    keyPoints: [
      'PEWS scoring and normal ranges',
      'Red flags for paediatric deterioration',
      'How to escalate using PEWS',
    ],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/pews-guide',
  },
  {
    id: '8',
    title: 'Pressure Area Care Plan',
    description: 'Waterlow scoring, prevention strategies, SSKIN bundle implementation, and pressure ulcer case studies. Includes risk factors, prevention tips, and documentation essentials.',
    tags: ['Adult Nursing', 'Placement', 'Care Planning'],
    keyPoints: [
      'Waterlow scoring explained',
      'SSKIN bundle for prevention',
      'Case studies for pressure ulcers',
    ],
    difficulty: 'Moderate',
    isLocked: true,
    href: '/hub/resources/pressure-area-care',
  },
  {
    id: '9',
    title: 'A-E Assessment Checklist',
    description: 'Systematic ABCDE assessment approach with printable pocket checklist, OSCE tips, and real-life scenarios. Includes what to do at each step and when to escalate.',
    tags: ['OSCE', 'Emergency/ABCDE', 'Assessment'],
    keyPoints: [
      'ABCDE assessment steps',
      'Printable pocket checklist',
      'When and how to escalate',
    ],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/ae-assessment',
  },
  {
    id: '10',
    title: 'End of Life Communication Phrases',
    description: 'Compassionate phrases, frameworks, and practical scripts for difficult conversations with families. Includes communication tips, cultural considerations, and self-care advice.',
    tags: ['Mental Health', 'Palliative', 'Communication'],
    keyPoints: [
      'Compassionate phrases for families',
      'Frameworks for difficult conversations',
      'Self-care tips for staff',
    ],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/end-of-life-communication',
  },
  // Y1 Child Nursing Resources
  {
    id: '12',
    title: 'Y1 Growth & Development Milestones',
    description: 'Key developmental milestones from birth to 5 years, red flags to spot, and practical assessment tips. Includes charts, case examples, and how to document concerns.',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment'],
    keyPoints: [
      'Milestones from birth to 5 years',
      'Red flags and when to escalate',
      'How to document concerns',
    ],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/y1-growth-milestones',
  },
  {
    id: '13',
    title: 'Y1 Paediatric Vital Signs by Age',
    description: 'Normal vital sign ranges for children from newborn to adolescent, quick reference chart, and clinical relevance. Includes how to interpret abnormal values and when to escalate.',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment'],
    keyPoints: [
      'Normal paediatric vital sign ranges',
      'Quick reference chart included',
      'How to interpret abnormal values',
    ],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/y1-paeds-vital-signs',
  },
  {
    id: '14',
    title: 'Y1 Family-Centred Care Principles',
    description: 'Understanding family-centred care in paediatrics, how to apply it on placement, and real-life examples. Includes communication tips, cultural sensitivity, and involving families in care.',
    tags: ['Paeds', 'Y1 Essentials', 'Placement'],
    keyPoints: [
      'Principles of family-centred care',
      'Cultural sensitivity in paediatrics',
      'Involving families in care',
    ],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/y1-family-centred-care',
  },
  {
    id: '15',
    title: 'Y1 Pain Assessment in Children',
    description: 'Age-appropriate pain assessment tools (FLACC, Wong-Baker, numeric scales), how to use them, and practical examples. Includes red flags, documentation tips, and when to escalate.',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment', 'OSCE'],
    keyPoints: [
      'Pain assessment tools for children',
      'When to escalate pain concerns',
      'Documentation tips for pain',
    ],
    difficulty: 'Moderate',
    isLocked: true,
    href: '/hub/resources/y1-pain-assessment',
  },
  {
    id: '16',
    title: 'Y1 Safeguarding Children Essentials',
    description: 'Key safeguarding concepts, signs of abuse, responsibilities as a student nurse, and escalation pathways. Includes case studies, documentation advice, and support resources.',
    tags: ['Paeds', 'Y1 Essentials', 'Placement'],
    keyPoints: [
      'Recognising signs of abuse',
      'Escalation pathways for safeguarding',
      'Support resources for students',
    ],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/y1-safeguarding',
  },
  {
    id: '17',
    title: 'Y1 Consent & Gillick Competence',
    description: 'Understanding consent in paediatrics, Gillick competence, Fraser guidelines, and practical scenarios. Includes communication tips, legal considerations, and documentation advice.',
    tags: ['Paeds', 'Y1 Essentials', 'Ethics'],
    keyPoints: [
      'Gillick competence explained',
      'Fraser guidelines in practice',
      'Legal considerations for consent',
    ],
    difficulty: 'Moderate',
    isLocked: true,
    href: '/hub/resources/y1-consent-gillick',
  },
  {
    id: '18',
    title: 'Y1 Paediatric Medications Guide',
    description: 'Weight-based dosing, common paediatric medications, safety considerations, and worked examples. Includes formulas, double-checking tips, and how to avoid common errors.',
    tags: ['Paeds', 'Y1 Essentials', 'Meds & Calculations'],
    keyPoints: [
      'Weight-based dosing formulas',
      'Common paediatric medications',
      'Safety checks and double-checking',
    ],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/y1-paeds-medications',
  },
  {
    id: '19',
    title: 'Y1 Immunisation Schedule UK',
    description: 'Complete UK childhood immunisation schedule, catch-up information, and practical tips for discussing vaccines with families. Includes charts and red flags.',
    tags: ['Paeds', 'Y1 Essentials', 'Health Promotion'],
    keyPoints: [
      'UK immunisation schedule overview',
      'Catch-up vaccine information',
      'Tips for discussing vaccines',
    ],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/y1-immunisation-schedule',
  },
  {
    id: '20',
    title: 'Y1 Play & Distraction Techniques',
    description: 'Age-appropriate play and distraction techniques for procedures and hospital stays, with practical examples. Includes tips for reducing anxiety and involving families.',
    tags: ['Paeds', 'Y1 Essentials', 'Placement'],
    keyPoints: [
      'Play techniques for different ages',
      'Reducing anxiety during procedures',
      'Involving families in distraction',
    ],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/y1-play-distraction',
  },
  {
    id: '21',
    title: 'Y1 Communicating with Children',
    description: 'How to adapt your communication for different ages and developmental stages, with practical scripts and examples. Includes tips for building rapport and overcoming barriers.',
    tags: ['Paeds', 'Y1 Essentials', 'Communication'],
    keyPoints: [
      'Adapting communication by age',
      'Building rapport with children',
      'Overcoming communication barriers',
    ],
    difficulty: 'Moderate',
    isLocked: true,
    href: '/hub/resources/y1-child-communication',
  },
  // Glossary of Terms
  {
    id: '22',
    title: 'Glossary of Terms',
    description: 'Quick definitions for OSCEs, placement & exams. Search nursing terms & abbreviations. Includes common pitfalls, memory aids, and links to further resources.',
    tags: ['Y1 Essentials', 'OSCE', 'Placement'],
    keyPoints: [
      'Quick definitions for OSCEs and exams',
      'Common abbreviations and pitfalls',
      'Memory aids for revision',
    ],
    difficulty: 'Quick Win',
    isLocked: false,
    isNew: true,
    href: '/hub/glossary',
  },
  // Medications Calculations Section
  {
    id: '23',
    title: 'Drug Calculations Cheat Sheet',
    description: 'Essential formulas and step-by-step methods for common drug calculations: IV rates, doses, dilutions, and worked examples. Includes safety reminders, common errors, and practice questions.',
    tags: ['Meds & Calculations', 'OSCE', 'Placement'],
    keyPoints: [
      'IV rate and dose calculation formulas',
      'Worked examples and practice questions',
      'Safety reminders for calculations',
    ],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/drug-calculations-cheat-sheet',
  },
  {
    id: '24',
    title: 'Paediatric Dose Calculator Guide',
    description: 'Weight-based dosing formulas, common paediatric medications, safety checks for children, and worked examples. Includes double-checking tips and escalation advice.',
    tags: ['Meds & Calculations', 'Paeds', 'Y1 Essentials'],
    keyPoints: [
      'Paediatric dosing formulas',
      'Common paediatric medication safety',
      'Escalation advice for errors',
    ],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/paediatric-dose-calculator',
  },
  {
    id: '25',
    title: 'IV Drip Rate Calculations',
    description: 'Master IV drip rate calculations with worked examples, formulas, practice questions, and safety reminders. Includes common pitfalls and how to check your answer.',
    tags: ['Meds & Calculations', 'Adult Nursing', 'Critical Care'],
    keyPoints: [
      'IV drip rate calculation steps',
      'Practice questions included',
      'How to check your answer',
    ],
    difficulty: 'Moderate',
    isLocked: true,
    href: '/hub/resources/iv-drip-rate-calculations',
  },
  {
    id: '26',
    title: 'Medication Abbreviations Guide',
    description: 'Common medication abbreviations, units, routes, and frequencies you\'ll see on prescriptions. Includes worked examples, red flags, and tips for safe prescribing.',
    tags: ['Meds & Calculations', 'Placement', 'Y1 Essentials'],
    keyPoints: [
      'Common medication abbreviations',
      'Units, routes, and frequencies',
      'Red flags for safe prescribing',
    ],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/medication-abbreviations',
  },
  {
    id: '28',
    title: '9 Rights of Medication Administration',
    description: 'The essential safety checks before giving any medication: 9 Rights explained, worked examples, and safety reminders. A must-know for OSCEs and placement.',
    tags: ['Meds & Calculations', 'OSCE', 'Y1 Essentials', 'Placement'],
    keyPoints: [
      '9 Rights of Medication explained',
      'Worked examples for each right',
      'Safety reminders for OSCEs',
    ],
    difficulty: 'Quick Win',
    isLocked: false,
    isNew: true,
    href: '/hub/resources/9-rights-medication',
  },
  {
    id: '27',
    title: 'High-Risk Medications Checklist',
    description: 'Know your high-risk medications: insulin, anticoagulants, opioids, and more with safety checks, case examples, and escalation advice. Includes double-checking tips and red flags.',
    tags: ['Meds & Calculations', 'Adult Nursing', 'Critical Care'],
    keyPoints: [
      'High-risk medication safety checks',
      'Case examples for insulin, anticoagulants, opioids',
      'Red flags and escalation advice',
    ],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/high-risk-medications',
  },
];

// Filter tags
const filterTags = [
  'Y1 Essentials',
  'OSCE',
  'Paeds',
  'Adult Nursing',
  'Mental Health',
  'Meds & Calculations',
  'Placement',
  'Revision Plans',
  'Emergency/ABCDE',
] as const;

const difficultyStyles: Record<HubItem['difficulty'], string> = {
  'Quick Win': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  'Deep Dive': 'bg-purple-50 text-purple-700 border-purple-200',
};

const difficultyIcons: Record<HubItem['difficulty'], React.ComponentType<{ className?: string }>> = {
  'Quick Win': Zap,
  Moderate: BookOpen,
  'Deep Dive': Sparkles,
};

// Hub Card Component
function HubCard({
  item,
  isPro,
  isSignedIn,
}: {
  item: HubItem;
  isPro: boolean;
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const canAccess = !item.isLocked || isPro;
  const DifficultyIcon = difficultyIcons[item.difficulty];

  const handleClick = () => {
    if (canAccess) {
      router.push(item.href);
      return;
    }

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    showToast("That's a Pro resource 💜", 'info');
    router.push('/pricing');
  };

  const [expanded, setExpanded] = React.useState(false);
  const handleCardClick = () => {
    if (canAccess) setExpanded((prev) => !prev);
    handleClick();
  };

  // Progress tracking state
  const [completed, setCompleted] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const done = localStorage.getItem('resource-completed-' + item.id) === 'true';
      setCompleted(done);
    }
  }, [item.id]);

  const toggleCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newVal = !completed;
    setCompleted(newVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('resource-completed-' + item.id, newVal ? 'true' : 'false');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        relative card card-lift cursor-pointer transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2
        ${!canAccess ? 'overflow-hidden' : ''}
        ${completed ? 'opacity-70 grayscale' : ''}
      `}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      role="button"
    >
      {/* Locked overlay */}
      {!canAccess && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-[var(--lilac)] flex items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-[var(--purple)]" />
          </div>
          <span className="text-xs font-semibold text-[var(--purple)] bg-[var(--lilac-soft)] px-3 py-1 rounded-full">
            Upgrade to access
          </span>
        </div>
      )}

      {/* Status badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              item.isLocked
                ? 'bg-[var(--purple)]/10 text-[var(--purple)]'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {item.isLocked ? 'PREMIUM' : 'FREE'}
          </span>
          {item.isNew && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              NEW
            </span>
          )}
        </div>

        <span
          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${difficultyStyles[item.difficulty]}`}
        >
          <DifficultyIcon className="w-3 h-3" />
          {item.difficulty}
        </span>
      </div>

      {/* Content */}

      <h3 className="text-[var(--plum)] text-base font-semibold mb-2 line-clamp-2">{item.title}</h3>

      <p className="text-sm text-[var(--plum-dark)]/70 mb-2 line-clamp-2">{item.description}</p>



      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-[var(--lilac-soft)] text-[var(--plum-dark)]/70 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>


      {/* Progress tracking button (moved below tags) */}
      {canAccess && (
        <button
          onClick={toggleCompleted}
          className={`w-full mb-3 py-2 rounded-full text-sm font-semibold border transition-all
            ${completed ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-white text-[var(--plum-dark)] border-[var(--lilac-medium)] hover:bg-[var(--lilac-soft)]'}`}
          title={completed ? 'Mark as not completed' : 'Mark as completed'}
        >
          {completed ? '✓ Completed' : 'Mark as Done'}
        </button>
      )}

      {/* CTA */}
      <div
        className={`
          w-full py-2 rounded-full text-sm font-semibold text-center transition-all
          ${canAccess ? 'bg-[var(--purple)] text-white hover:bg-[var(--plum)]' : 'bg-[var(--lilac)] text-[var(--purple)]'}
        `}
      >
        {canAccess ? 'Open Resource' : 'Unlock'}
      </div>
    </div>
  );
}

// Main Client Component
export default function HubClient({
  isPro = false,
  isSignedIn = false,
}: {
  isPro?: boolean;
  isSignedIn?: boolean;
}) {
  useScrollAnimation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const freeCount = hubItems.filter((i) => !i.isLocked).length;
  const premiumCount = hubItems.filter((i) => i.isLocked).length;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return hubItems.filter((item) => {
      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesTags = selectedTags.size === 0 || item.tags.some((tag) => selectedTags.has(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream">
        <Navbar />

        {/* Smaller Hero */}
        <section className="gradient-hero pt-28 pb-12 relative overflow-hidden">
          <div className="blob blob-1" style={{ opacity: 0.25 }} />
          <div className="blob blob-2" style={{ opacity: 0.25 }} />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="animate-on-scroll hero-badge">
                <Stethoscope className="w-4 h-4 text-[var(--purple)]" />
                <span className="text-[var(--plum)]">Content Library</span>
                <Sparkles className="w-4 h-4 text-[var(--pink)] icon-pulse" />
              </div>

              <h1 className="animate-on-scroll mb-2 hero-title">
                <span className="gradient-text">Nursing Hub</span>
              </h1>

              <p className="animate-on-scroll hero-description !mb-6">
                Find exactly what you need for OSCEs, exams &amp; placement survival.
              </p>

              <div className="animate-on-scroll flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#resources"
                  className="btn-secondary btn-hover text-base px-7 py-3 inline-flex items-center justify-center gap-2"
                >
                  <ArrowDown className="w-5 h-5" />
                  Browse resources
                </a>

                <Link
                  href="/pricing"
                  className="btn-primary btn-hover text-base px-7 py-3 inline-flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Unlock everything
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section id="resources" className="bg-cream py-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="animate-on-scroll relative max-w-md mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--plum-dark)]/40" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-[var(--lilac-medium)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:border-transparent text-[var(--plum-dark)]"
              />
            </div>

            <div className="animate-on-scroll flex flex-wrap justify-center gap-2 mb-6">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.has(tag)
                      ? 'bg-[var(--purple)] text-white'
                      : 'bg-[var(--lilac-soft)] text-[var(--plum-dark)]/70 hover:bg-[var(--lilac)]'
                  }`}
                  type="button"
                >
                  {tag}
                </button>
              ))}

              {selectedTags.size > 0 && (
                <button
                  onClick={() => setSelectedTags(new Set())}
                  className="px-4 py-2 rounded-full text-sm font-medium text-[var(--purple)] hover:underline"
                  type="button"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="animate-on-scroll flex justify-center gap-6 text-sm text-[var(--plum-dark)]/60 mb-8">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                FREE ({freeCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[var(--purple)]" />
                PREMIUM ({premiumCount})
              </span>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="bg-cream pb-16">
          <div className="max-w-6xl mx-auto px-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[var(--plum-dark)]/60">No resources match your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTags(new Set());
                  }}
                  className="mt-4 text-[var(--purple)] font-medium hover:underline"
                  type="button"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, i) => (
                  <div
                    key={item.id}
                    className="animate-on-scroll fade-in-up"
                    style={{ animationDelay: i * 0.06 + 's' }}
                  >
                    <HubCard item={item} isPro={isPro} isSignedIn={isSignedIn} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Medications Calculations Section */}
        <section className="bg-gradient-to-r from-[var(--lilac-soft)] to-[var(--cream-pink)] py-12 border-y border-[var(--lilac-medium)]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--purple)] to-[var(--lavender)] flex items-center justify-center">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-[var(--plum)] mb-2">Medications &amp; Calculations 💊</h3>
                <p className="text-[var(--plum-dark)]/70">
                  Cheat sheets, formulas, and step-by-step guides for drug calculations. Never second-guess your maths again!
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTags(new Set(['Meds & Calculations']));
                  document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--plum)] transition-all flex-shrink-0"
              >
                View Cheat Sheets
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Glossary Section */}
        <section className="bg-white py-12 border-b border-[var(--lilac-medium)]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-shrink-0 relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--purple)] flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                  NEW
                </span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-[var(--plum)] mb-2">Glossary of Terms 📖</h3>
                <p className="text-[var(--plum-dark)]/70">
                  Quick definitions for OSCEs, placement &amp; exams. Search nursing terms, abbreviations &amp; clinical definitions.
                </p>
              </div>
              <Link
                href="/hub/glossary"
                className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--plum)] transition-all flex-shrink-0"
              >
                Open Glossary
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Q&A Board Section */}
        <section className="bg-white py-12 border-y border-[var(--lilac-medium)]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-[var(--plum)] mb-2">Q&amp;A Board</h3>
                <p className="text-[var(--plum-dark)]/70">
                  Got a nursing question? Ask the community! Browse questions from other students or post your own.
                </p>
              </div>
              <Link
                href="/hub/questions"
                className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--plum)] transition-all flex-shrink-0"
              >
                Browse Q&amp;A
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Premium Upsell */}
        {!isPro && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="gradient-hero rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="blob blob-1" style={{ opacity: 0.3 }} />

                <div className="relative z-10">
                  <div className="animate-on-scroll text-4xl mb-4 emoji-float">✨</div>
                  <h2 className="animate-on-scroll text-white mb-4">Unlock the Full Library</h2>
                  <p className="animate-on-scroll text-white/80 mb-8 max-w-lg mx-auto">
                    Get instant access to every resource, updated weekly with new content.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-left">
                    {[
                      'Full OSCE station packs',
                      'Smart quizzes with feedback',
                      'Progress tracking dashboard',
                      'Printable checklists & guides',
                      'New content added weekly',
                      'Lifetime access, one payment',
                    ].map((feature, i) => (
                      <div
                        key={feature}
                        className="animate-on-scroll fade-in-up flex items-start gap-2 text-white/90"
                        style={{ animationDelay: i * 0.06 + 's' }}
                      >
                        <CheckCircle2 className="w-5 h-5 mt-0.5 text-white" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/pricing"
                    className="animate-on-scroll btn-primary btn-hover text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Upgrade to Pro
                  </Link>

                  <p className="animate-on-scroll text-white/70 text-sm mt-4">
                    One payment • Lifetime access • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Need Help */}
        <section className="bg-[var(--lilac-soft)] py-12">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-[var(--pink)]" />
              <h3 className="text-[var(--plum)]">Need help?</h3>
            </div>
            <p className="text-[var(--plum-dark)]/70 mb-6">
              Got questions about the resources or need study advice? I&apos;m here to help!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--plum)] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Get in Touch
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[var(--lilac)] px-6 py-8 text-center text-[var(--plum-dark)]/70 text-sm">
          <p>Made with love by Lauren</p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/privacy" className="hover:text-[var(--plum)]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--plum)]">
              Terms
            </Link>
            <Link href="/about" className="hover:text-[var(--plum)]">
              About
            </Link>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
