import type { HubItemSummary, HubItemType } from './types';

interface CatalogItem {
  hubItemId: string;
  title: string;
  href: string;
  tags: string[];
}

const catalog: CatalogItem[] = [
  {
    hubItemId: 'ae-assessment-guide',
    title: 'A–E Assessment Framework',
    href: '/hub/resources/ae-assessment-guide',
    tags: ['OSCE', 'Emergency/ABCDE', 'Paeds', 'Assessment'],
  },
  {
    hubItemId: 'im-sc-injection',
    title: 'IM & SC Injections',
    href: '/hub/resources/im-sc-injection',
    tags: ['Clinical Skills', 'OSCE', 'Paeds', 'Placement'],
  },
  {
    hubItemId: 'ng-tube-insertion',
    title: 'NG Tube Insertion & Testing',
    href: '/hub/resources/ng-tube-insertion',
    tags: ['Clinical Skills', 'OSCE', 'Paeds', 'Placement'],
  },
  {
    hubItemId: 'drug-calculations-cheat-sheet',
    title: 'Drug Calculations Cheat Sheet',
    href: '/hub/resources/drug-calculations-cheat-sheet',
    tags: ['Meds & Calculations', 'OSCE', 'Placement'],
  },
  {
    hubItemId: 'placement-survival',
    title: 'Placement Survival Guide',
    href: '/hub/resources/placement-survival',
    tags: ['Placement', 'Y1 Essentials'],
  },
  {
    hubItemId: 'medication-abbreviations',
    title: 'Medication Abbreviations Guide',
    href: '/hub/resources/medication-abbreviations',
    tags: ['Meds & Calculations', 'Placement'],
  },
  {
    hubItemId: 'sepsis-6-escalation',
    title: 'Sepsis 6 & Escalation',
    href: '/hub/resources/sepsis-6-escalation',
    tags: ['Emergency/ABCDE', 'Adult Nursing', 'Critical Care'],
  },
  {
    hubItemId: 'y1-paeds-medications',
    title: 'Y1 Paediatric Medications Guide',
    href: '/hub/resources/y1-paeds-medications',
    tags: ['Paeds', 'Meds & Calculations', 'OSCE', 'Y1 Essentials'],
  },
  {
    hubItemId: 'iv-fluids-vitals',
    title: 'IV Fluids & Vitals Red Flags',
    href: '/hub/resources/iv-fluids-vitals',
    tags: ['Adult Nursing', 'Emergency/ABCDE', 'Critical Care'],
  },
  {
    hubItemId: 'pressure-area-care',
    title: 'Pressure Area Care Plan',
    href: '/hub/resources/pressure-area-care',
    tags: ['Adult Nursing', 'Placement', 'Care Planning'],
  },
  {
    hubItemId: '9-rights-medication',
    title: '9 Rights of Medication Administration',
    href: '/hub/resources/9-rights-medication',
    tags: ['Meds & Calculations', 'OSCE', 'Placement'],
  },
  {
    hubItemId: 'palliative-care-children',
    title: 'Palliative Care in Children',
    href: '/hub/resources/palliative-care-children',
    tags: ['Paeds', 'Palliative', 'Communication', 'Placement'],
  },
  {
    hubItemId: 'palliative-care-adult',
    title: 'Palliative & End of Life Care',
    href: '/hub/resources/palliative-care-adult',
    tags: ['Adult Nursing', 'Palliative', 'Communication', 'Placement'],
  },
  {
    hubItemId: 'paeds-vital-signs-cheat-sheet',
    title: 'Paediatric Vital Signs Cheat Sheet',
    href: '/hub/resources/paeds-vital-signs-cheat-sheet',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment', 'OSCE'],
  },
  {
    hubItemId: 'respiratory-system',
    title: 'Respiratory System & Assessment',
    href: '/hub/resources/respiratory-system',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment', 'Emergency/ABCDE'],
  },
  {
    hubItemId: 'cardiovascular-system',
    title: 'Cardiovascular System & Assessment',
    href: '/hub/resources/cardiovascular-system',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment', 'Emergency/ABCDE'],
  },
  {
    hubItemId: 'renal-system',
    title: 'Renal System & Assessment',
    href: '/hub/resources/renal-system',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment', 'Fluids & Electrolytes'],
  },
  {
    hubItemId: 'brain-nervous-system',
    title: 'Brain & Nervous System Assessment',
    href: '/hub/resources/brain-nervous-system',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment', 'Neuro'],
  },
  {
    hubItemId: 'y1-pain-assessment',
    title: 'Y1 Pain Assessment in Children',
    href: '/hub/resources/y1-pain-assessment',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment', 'OSCE'],
  },
  {
    hubItemId: 'y1-safeguarding',
    title: 'Y1 Safeguarding Children Essentials',
    href: '/hub/resources/y1-safeguarding',
    tags: ['Paeds', 'Y1 Essentials', 'Placement'],
  },
  {
    hubItemId: 'y1-consent-gillick',
    title: 'Y1 Consent & Gillick Competence',
    href: '/hub/resources/y1-consent-gillick',
    tags: ['Paeds', 'Y1 Essentials', 'Ethics'],
  },
  {
    hubItemId: 'y1-paeds-medications',
    title: 'Y1 Paediatric Medications Guide',
    href: '/hub/resources/y1-paeds-medications',
    tags: ['Paeds', 'Y1 Essentials', 'Meds & Calculations'],
  },
  {
    hubItemId: 'y1-child-communication',
    title: 'Y1 Communicating with Children',
    href: '/hub/resources/y1-child-communication',
    tags: ['Paeds', 'Y1 Essentials', 'Communication'],
  },
  {
    hubItemId: 'y1-anatomy-physiology',
    title: 'Y1 Anatomy & Physiology Basics',
    href: '/hub/resources/y1-anatomy-physiology',
    tags: ['Y1 Essentials', 'Revision Plans'],
  },
  {
    hubItemId: 'y1-documentation',
    title: 'Y1 Documentation & Record Keeping',
    href: '/hub/resources/y1-documentation',
    tags: ['Y1 Essentials', 'Placement'],
  },
  {
    hubItemId: 'y1-infection-control',
    title: 'Y1 Infection Control Essentials',
    href: '/hub/resources/y1-infection-control',
    tags: ['Y1 Essentials', 'Placement', 'OSCE'],
  },
  {
    hubItemId: 'y1-professionalism-ethics',
    title: 'Y1 Professionalism & Ethics',
    href: '/hub/resources/y1-professionalism-ethics',
    tags: ['Y1 Essentials', 'Ethics'],
  },
  {
    hubItemId: 'theories-of-development',
    title: 'Theories of Development',
    href: '/hub/resources/theories-of-development',
    tags: ['Paeds', 'Y1 Essentials'],
  },
  {
    hubItemId: 'glossary',
    title: 'Nursing Glossary',
    href: '/hub/glossary',
    tags: ['Y1 Essentials', 'Revision Plans'],
  },
];

const catalogMap = new Map(catalog.map((item) => [item.hubItemId, item]));

export function inferHubItemType(title: string, tags: string[] = []): HubItemType {
  const lowerTitle = title.toLowerCase();
  const lowerTags = tags.map((tag) => tag.toLowerCase());

  if (lowerTitle.includes('cheat sheet')) return 'Cheat Sheet';
  if (lowerTitle.includes('guide') || lowerTitle.includes('framework')) return 'Guide';
  if (lowerTitle.includes('checklist')) return 'Checklist';
  if (lowerTitle.includes('glossary')) return 'Glossary';
  if (lowerTitle.includes('osce') || lowerTags.includes('osce')) return 'OSCE';
  if (lowerTags.includes('placement') || lowerTags.includes('y1 essentials')) return 'Revision Resource';
  return 'Article';
}

export function getCatalogItem(hubItemId: string): HubItemSummary | null {
  const entry = catalogMap.get(hubItemId);
  if (!entry) {
    return null;
  }

  return {
    hubItemId: entry.hubItemId,
    title: entry.title,
    href: entry.href,
    type: inferHubItemType(entry.title, entry.tags),
    tags: entry.tags,
  };
}

export function getRelatedCatalogItems(hubItemId: string, limit = 3): HubItemSummary[] {
  const current = catalogMap.get(hubItemId);
  if (!current) {
    return [];
  }

  return catalog
    .filter((item) => item.hubItemId !== hubItemId)
    .map((item) => {
      const overlap = item.tags.filter((tag) => current.tags.includes(tag)).length;
      const sameCategoryBonus =
        (current.tags.includes('OSCE') && item.tags.includes('OSCE')) ||
        (current.tags.includes('Placement') && item.tags.includes('Placement')) ||
        (current.tags.includes('Meds & Calculations') && item.tags.includes('Meds & Calculations'))
          ? 1
          : 0;

      return {
        item,
        score: overlap + sameCategoryBonus,
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map(({ item }) => ({
      hubItemId: item.hubItemId,
      title: item.title,
      href: item.href,
      type: inferHubItemType(item.title, item.tags),
      tags: item.tags,
    }));
}

export function humanizeHubItemId(hubItemId: string) {
  return hubItemId
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
