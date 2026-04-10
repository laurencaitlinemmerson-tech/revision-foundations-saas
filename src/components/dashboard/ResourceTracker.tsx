'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageVisit } from '@/lib/dashboardTracking';

const TITLE_MAP: Record<string, string> = {
  'ae-assessment-guide': 'A–E Assessment Framework',
  'im-sc-injection': 'IM & SC Injections',
  'ng-tube-insertion': 'NG Tube Insertion & Testing',
  'drug-calculations-cheat-sheet': 'Drug Calculations Cheat Sheet',
  'placement-survival': 'Placement Survival Guide',
  'paeds-vital-signs-cheat-sheet': 'Paediatric Vital Signs',
  'cardiovascular-system': 'Cardiovascular System',
  'respiratory-system': 'Respiratory System',
  'renal-system': 'Renal System',
  'brain-nervous-system': 'Brain & Nervous System',
  'glossary-terms': 'Nursing Glossary',
  '9-rights-medication': '9 Rights of Medication',
  'medication-abbreviations': 'Medication Abbreviations',
  'sepsis-6-escalation': 'Sepsis 6 & Escalation',
  'palliative-care-children': 'Palliative Care in Children',
  'y1-pain-assessment': 'Pain Assessment in Children',
  'y1-safeguarding': 'Safeguarding Children',
  'y1-consent-gillick': 'Consent & Gillick Competence',
  'y1-paeds-medications': 'Paediatric Medications',
  'y1-child-communication': 'Communicating with Children',
  'y1-anatomy-physiology': 'Anatomy & Physiology Basics',
  'y1-documentation': 'Documentation & Record Keeping',
  'y1-infection-control': 'Infection Prevention & Control',
  'y1-professionalism-ethics': 'Professionalism & Ethics',
  'theories-of-development': 'Theories of Development',
};

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ResourceTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const slug = pathname.split('/').pop() || '';
    if (!slug) return;
    const title = TITLE_MAP[slug] || slugToTitle(slug);
    trackPageVisit(title, pathname);
  }, [pathname]);

  return null;
}
