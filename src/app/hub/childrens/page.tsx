import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, ArrowRight, Lock, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: "Children's Nursing Hub | Revision Foundations",
  description:
    'Paediatric OSCEs, PEWS, age-based normal ranges, Gillick competence, family-centred care, developmental milestones, and more.',
};

const serif = "'Source Serif 4', Georgia, serif";
const display = "'Playfair Display', Georgia, serif";
const espresso = '#301906';
const charcoal = '#5A5750';
const mist = '#8A8178';
const linenDeep = '#E8E0D8';
const linenLight = '#F7F3EF';
const white = '#FFFFFF';

const resources = [
  {
    slug: 'pews-guide',
    title: 'PEWS – Paediatric Early Warning Score',
    description: 'Age-appropriate early warning scoring with escalation triggers and response guidance.',
    readTime: '5 min read',
    isLocked: false,
    tags: ['Escalation', 'Vitals'],
  },
  {
    slug: 'paeds-respiratory-assessment',
    title: 'Paeds Respiratory Assessment',
    description: 'Complete guide to assessing respiratory function in children including work of breathing and red flags.',
    readTime: '5 min read',
    isLocked: false,
    tags: ['OSCE prep', 'Assessment'],
  },
  {
    slug: 'ae-assessment',
    title: 'A–E Assessment Checklist',
    description: 'Systematic ABCDE assessment with clinical pearls, red flags, and printable pocket checklist.',
    readTime: '8 min read',
    isLocked: false,
    tags: ['OSCE prep', 'Cheat sheet'],
  },
  {
    slug: 'y1-growth-milestones',
    title: 'Growth & Development Milestones',
    description: 'Key developmental milestones from birth to 5 years with red flags. Based on NHS and RCPCH guidance.',
    readTime: '6 min read',
    isLocked: false,
    tags: ['Paediatrics', 'Year 1'],
  },
  {
    slug: 'y1-family-centred-care',
    title: 'Family-Centred Care Principles',
    description: 'Understanding family-centred care in paediatrics and how to apply it on placement.',
    readTime: '5 min read',
    isLocked: false,
    tags: ['Paediatrics', 'Year 1'],
  },
  {
    slug: 'y1-play-distraction',
    title: 'Play & Distraction Techniques',
    description: 'Age-appropriate play and distraction strategies for procedures, hospital stays, and anxiety reduction.',
    readTime: '8 min read',
    isLocked: false,
    tags: ['OSCE prep', 'Paediatrics'],
  },
  {
    slug: 'y1-immunisation-schedule',
    title: 'Immunisation Schedule (UK)',
    description: 'Clear overview of the UK childhood immunisation schedule including timing, vaccines, and rationale.',
    readTime: '5 min read',
    isLocked: false,
    tags: ['Paediatrics', 'Year 1'],
  },
  {
    slug: 'sbar-handover',
    title: 'SBAR Handover Template',
    description: 'Printable SBAR template with examples for confident clinical handovers.',
    readTime: '3 min read',
    isLocked: false,
    tags: ['Cheat sheet', 'Communication'],
  },
  {
    slug: 'news2-guide',
    title: 'NEWS2 Quick Guide',
    description: 'National Early Warning Score explained with scoring chart and response triggers.',
    readTime: '4 min read',
    isLocked: false,
    tags: ['Escalation', 'Cheat sheet'],
  },
  {
    slug: 'wound-care-infection-control',
    title: 'Wound Care & Infection Control',
    description: 'Wound assessment using the TIME framework, dressing selection, and infection prevention.',
    readTime: '6 min read',
    isLocked: false,
    tags: ['Clinical skills'],
  },
  {
    slug: 'y1-consent-gillick',
    title: 'Consent & Gillick Competence',
    description: 'Understanding consent in paediatrics, including Gillick competence and Fraser guidelines.',
    readTime: '6 min read',
    isLocked: true,
    tags: ['Law & Ethics', 'Year 1'],
  },
  {
    slug: 'y1-pain-assessment',
    title: 'Pain Assessment in Children',
    description: 'Age-appropriate pain tools including FLACC, Wong-Baker, and numeric scales.',
    readTime: '7 min read',
    isLocked: true,
    tags: ['OSCE prep', 'Assessment'],
  },
  {
    slug: 'y1-safeguarding',
    title: 'Safeguarding Children Essentials',
    description: 'Key safeguarding concepts, signs of abuse, and your responsibilities as a student nurse.',
    readTime: '8 min read',
    isLocked: true,
    tags: ['Law & Ethics', 'Year 1'],
  },
  {
    slug: 'y1-child-communication',
    title: 'Communicating with Children',
    description: 'How to adapt your communication for different ages and developmental stages.',
    readTime: '6 min read',
    isLocked: true,
    tags: ['Communication', 'Year 1'],
  },
  {
    slug: 'y1-paeds-medications',
    title: 'Paediatric Medications Guide',
    description: 'Weight-based dosing, common paediatric medications, and safety considerations.',
    readTime: '7 min read',
    isLocked: true,
    tags: ['Medications', 'Year 1'],
  },
  {
    slug: 'paediatric-dose-calculator',
    title: 'Paediatric Dose Calculator Guide',
    description: 'Weight-based dosing formulas, common medications, and safety checks for children.',
    readTime: '6 min read',
    isLocked: true,
    tags: ['Medications', 'Calculations'],
  },
  {
    slug: 'iv-drip-rate-calculations',
    title: 'IV Drip Rate Calculations',
    description: 'Master IV drip rate calculations with worked examples, formulas, and practice questions.',
    readTime: '6 min read',
    isLocked: true,
    tags: ['Calculations', 'Medications'],
  },
  {
    slug: 'high-risk-medications',
    title: 'High-Risk Medications Checklist',
    description: 'Insulin, anticoagulants, opioids, and more — with safety checks for each.',
    readTime: '5 min read',
    isLocked: true,
    tags: ['Medications', 'Safety'],
  },
  {
    slug: 'sepsis-6-escalation',
    title: 'Sepsis 6 & Escalation',
    description: 'Step-by-step sepsis recognition and the Sepsis 6 bundle with escalation pathways.',
    readTime: '7 min read',
    isLocked: true,
    tags: ['Escalation', 'Clinical skills'],
  },
  {
    slug: 'medicines-management-osce',
    title: 'Medicines Management OSCE',
    description: 'Drug calculations, administration routes, and common medication errors to avoid.',
    readTime: '8 min read',
    isLocked: true,
    tags: ['OSCE prep', 'Medications'],
  },
  {
    slug: 'iv-fluids-vitals',
    title: 'IV Fluids & Vitals Red Flags',
    description: 'Fluid balance essentials and vital signs that need immediate escalation.',
    readTime: '6 min read',
    isLocked: true,
    tags: ['Clinical skills', 'Escalation'],
  },
  {
    slug: 'pressure-area-care',
    title: 'Pressure Area Care Plan',
    description: 'Waterlow scoring, prevention strategies, and SSKIN bundle implementation.',
    readTime: '5 min read',
    isLocked: true,
    tags: ['Clinical skills', 'Cheat sheet'],
  },
  {
    slug: 'end-of-life-communication',
    title: 'End of Life Communication Phrases',
    description: 'Compassionate phrases and frameworks for difficult conversations with families.',
    readTime: '6 min read',
    isLocked: true,
    tags: ['Communication'],
  },
];

const freeResources = resources.filter((r) => !r.isLocked);
const premiumResources = resources.filter((r) => r.isLocked);

export default function ChildrensHubPage() {
  return (
    <div
      style={{
        background: 'var(--cream)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      <main style={{ flex: 1, padding: '96px 20px 72px' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>

          {/* Back link */}
          <Link
            href="/hub"
            style={{
              fontFamily: serif,
              fontSize: '14px',
              color: espresso,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              marginBottom: '32px',
              opacity: 0.7,
            }}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
            Back to Hub
          </Link>

          {/* Hero */}
          <section style={{ marginBottom: '48px', padding: '0 4px' }}>
            <p
              style={{
                fontFamily: serif,
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: mist,
                fontWeight: 500,
                marginBottom: '10px',
              }}
            >
              Children&apos;s Nursing
            </p>
            <h1
              style={{
                fontFamily: display,
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 600,
                color: espresso,
                marginBottom: '14px',
                lineHeight: 1.05,
              }}
            >
              🧒 Children&apos;s Resources
            </h1>
            <p
              style={{
                fontFamily: serif,
                fontSize: '15px',
                color: charcoal,
                fontWeight: 300,
                lineHeight: 1.75,
                maxWidth: '560px',
                margin: 0,
              }}
            >
              Paediatric OSCEs, PEWS, age-based normal ranges, Gillick competence,
              family-centred care, developmental milestones, and more.
            </p>
          </section>

          {/* Free resources */}
          <section style={{ marginBottom: '48px' }}>
            <p
              style={{
                fontFamily: serif,
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: mist,
                marginBottom: '16px',
              }}
            >
              Free resources
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '14px',
              }}
            >
              {freeResources.map((resource) => (
                <ResourceCard key={resource.slug} resource={resource} />
              ))}
            </div>
          </section>

          {/* Premium resources */}
          <section style={{ borderTop: `1px solid ${linenDeep}`, paddingTop: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: mist,
                  margin: 0,
                }}
              >
                Premium resources
              </p>
              <Link
                href="/pricing"
                style={{
                  fontFamily: serif,
                  fontSize: '13px',
                  color: espresso,
                  background: white,
                  border: `1px solid ${linenDeep}`,
                  borderRadius: '999px',
                  padding: '8px 14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Unlock all
                <ArrowRight style={{ width: '12px', height: '12px', color: mist }} />
              </Link>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '14px',
              }}
            >
              {premiumResources.map((resource) => (
                <ResourceCard key={resource.slug} resource={resource} />
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function ResourceCard({ resource }: {
  resource: {
    slug: string;
    title: string;
    description: string;
    readTime: string;
    isLocked: boolean;
    tags: string[];
  };
}) {
  const serif = "'Source Serif 4', Georgia, serif";
  const display = "'Playfair Display', Georgia, serif";
  const espresso = '#301906';
  const charcoal = '#5A5750';
  const mist = '#8A8178';
  const linenDeep = '#E8E0D8';
  const linenLight = '#F7F3EF';
  const white = '#FFFFFF';

  return (
    <Link
      href={`/hub/childrens/resources/${resource.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: resource.isLocked ? linenLight : white,
        border: `1px solid ${linenDeep}`,
        borderRadius: '16px',
        padding: '22px',
        textDecoration: 'none',
        boxShadow: resource.isLocked ? 'none' : '0 1px 2px rgba(48, 25, 6, 0.04)',
        opacity: resource.isLocked ? 0.85 : 1,
      }}
    >
      <div>
        {/* Badge row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          {resource.isLocked ? (
            <span
              style={{
                fontFamily: serif,
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: mist,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Lock style={{ width: '11px', height: '11px' }} />
              Premium
            </span>
          ) : (
            <span
              style={{
                fontFamily: serif,
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#4a7c5f',
              }}
            >
              Free
            </span>
          )}
          <span
            style={{
              fontFamily: serif,
              fontSize: '11px',
              color: mist,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            · {resource.readTime}
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: display,
            fontSize: '17px',
            fontWeight: 500,
            color: espresso,
            marginBottom: '8px',
            lineHeight: 1.3,
          }}
        >
          {resource.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontFamily: serif,
            fontSize: '13px',
            color: charcoal,
            lineHeight: 1.7,
            fontWeight: 300,
            marginBottom: '14px',
          }}
        >
          {resource.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {resource.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: serif,
                fontSize: '11px',
                color: espresso,
                background: linenLight,
                border: `1px solid ${linenDeep}`,
                borderRadius: '999px',
                padding: '4px 9px',
                lineHeight: 1,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <span
        style={{
          fontFamily: serif,
          fontSize: '13px',
          color: resource.isLocked ? mist : espresso,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontWeight: 500,
        }}
      >
        {resource.isLocked ? 'Unlock to read' : 'Read resource'}
        <ArrowRight style={{ width: '13px', height: '13px' }} />
      </span>
    </Link>
  );
}
