import type { MockExam } from './mockTypes';

export const allMocks: MockExam[] = [
  {
    id: 'bronchiolitis',
    system: 'respiratory',
    title: 'Bronchiolitis in Infancy',
    condition: 'Bronchiolitis',
    description: 'A 7-month-old presenting with acute bronchiolitis. This mock tests respiratory physiology, pathophysiology, clinical assessment, developmental impact, and family-centred nursing care.',
    scenario: {
      childName: 'Elsie',
      age: '7 months',
      presentingComplaint: 'Increased work of breathing, poor feeding, and coryzal symptoms for 48 hours',
      duration: '48 hours',
      observations: [
        { label: 'Respiratory rate', value: '58 breaths/min' },
        { label: 'Heart rate', value: '162 bpm' },
        { label: 'SpO\u2082', value: '91% on room air' },
        { label: 'Temperature', value: '37.9\u00B0C' },
        { label: 'Capillary refill time', value: '3 seconds' },
      ],
      clinicalSigns: [
        'Subcostal and intercostal recession',
        'Nasal flaring',
        'Audible wheeze and widespread crackles on auscultation',
        'Feeding reduced to less than 50% of normal intake',
        'Fewer wet nappies over the past 12 hours',
      ],
      diagnosis: 'Acute bronchiolitis (likely RSV)',
      familyContext: 'Elsie is the first child of a young single mother, Jade (19), who is visibly anxious. Jade was discharged from postnatal care six months ago and has limited family support nearby. She has been managing Elsie\u2019s symptoms at home with saline drops and is worried about Elsie being admitted.',
    },
    whatThisMockTests: [
      'Applying respiratory physiology to a clinical scenario',
      'Linking observable symptoms to underlying pathophysiology',
      'Using precise anatomical and physiological terminology',
      'Structuring clear, evidence-informed written answers',
      'Applying paediatric-specific considerations throughout',
    ],
    questionsPartA: [
      {
        id: 'q1',
        partLabel: 'Part A',
        number: 1,
        title: 'Structure & Function',
        prompt: 'Describe the structure and function of the lower respiratory tract in a healthy infant. Include the key anatomical differences between an infant\u2019s and an adult\u2019s airways that are relevant to Elsie\u2019s presentation.',
        wordGuide: '250 words',
        toScoreHighly: [
          'Name specific structures (bronchi, bronchioles, alveoli, respiratory membrane) and their roles',
          'Explain gas exchange at alveolar level with reference to partial pressure gradients',
          'Identify at least three anatomical differences in infants (narrower airways, fewer alveoli, compliant chest wall, diaphragm-dependent breathing)',
          'Link these differences directly to why Elsie is more vulnerable to respiratory compromise',
        ],
        thinkAbout: [
          'Why does a small amount of swelling cause such a big problem in an infant?',
          'How does Poiseuille\u2019s law apply here?',
          'What role does the diaphragm play in infant breathing that differs from adults?',
        ],
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'Cell Biology & the Body', href: '/hub/resources/cell-biology' },
        ],
        answerStructure: [
          'Open with an overview of the lower respiratory tract structures and their function',
          'Explain gas exchange at the alveolar level (diffusion, partial pressure gradients, respiratory membrane)',
          'Identify 3\u20134 key anatomical differences in infants',
          'Link each difference to clinical vulnerability, finishing with relevance to Elsie\u2019s scenario',
        ],
      },
      {
        id: 'q2',
        partLabel: 'Part A',
        number: 2,
        title: 'Physiology of Gas Exchange',
        prompt: 'Explain the physiology of gas exchange in the lungs. Discuss how oxygen and carbon dioxide are transported in the blood, and explain why Elsie\u2019s SpO\u2082 of 91% is clinically significant.',
        wordGuide: '250\u2013300 words',
        toScoreHighly: [
          'Describe external respiration (alveolar gas exchange) and internal respiration (tissue gas exchange)',
          'Explain oxygen transport (haemoglobin binding, partial pressure gradients, oxygen-haemoglobin dissociation curve)',
          'Explain CO\u2082 transport (bicarbonate ion, carbaminohaemoglobin, dissolved)',
          'Interpret SpO\u2082 91% in context: below NICE threshold, what it means for tissue oxygenation',
        ],
        thinkAbout: [
          'What happens to the oxygen-haemoglobin dissociation curve during illness?',
          'Why might SpO\u2082 91% be more concerning in an infant than in an adult?',
        ],
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'Paediatric Vital Signs Cheat Sheet', href: '/hub/resources/paeds-vital-signs-cheat-sheet' },
        ],
        answerStructure: [
          'Define external and internal respiration',
          'Explain O\u2082 transport (Hb saturation, partial pressure, curve)',
          'Explain CO\u2082 transport (three mechanisms)',
          'Interpret SpO\u2082 91%: clinical significance for Elsie, referencing NICE guidance',
        ],
      },
      {
        id: 'q3',
        partLabel: 'Part A',
        number: 3,
        title: 'Condition & Pathophysiology',
        prompt: 'Explain the pathophysiology of bronchiolitis. Describe what happens at the cellular level in the bronchioles and how this leads to the clinical signs observed in Elsie.',
        wordGuide: '250 words',
        toScoreHighly: [
          'Identify the causative agent (RSV most common) and route of infection',
          'Describe the inflammatory cascade: epithelial cell damage, oedema, mucus hypersecretion, cellular debris',
          'Explain how this narrows the bronchiolar lumen and increases airway resistance',
          'Link pathophysiology directly to Elsie\u2019s signs (recession, wheeze, crackles, tachypnoea)',
        ],
        thinkAbout: [
          'Why are the bronchioles (not the bronchi) the main site of obstruction?',
          'How does mucus plugging lead to air trapping and atelectasis?',
        ],
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'Cell Biology & the Body', href: '/hub/resources/cell-biology' },
        ],
        answerStructure: [
          'Identify RSV and the mechanism of infection',
          'Describe the inflammatory process step by step',
          'Explain the effect on airway calibre and resistance (reference Poiseuille\u2019s law)',
          'Map each pathological change to an observable clinical sign in Elsie',
        ],
      },
      {
        id: 'q4',
        partLabel: 'Part A',
        number: 4,
        title: 'Signs & Symptoms',
        prompt: 'Using Elsie\u2019s observations and clinical signs, explain the physiological basis for each sign. Why is she tachypnoeic, tachycardic, and showing signs of increased work of breathing?',
        wordGuide: '200 words',
        toScoreHighly: [
          'Explain tachypnoea as a compensatory response to hypoxia and increased dead space',
          'Explain tachycardia as a sympathetic response to maintain cardiac output and oxygen delivery',
          'Link recession and nasal flaring to the increased effort needed to generate negative intrathoracic pressure',
          'Explain reduced feeding as a consequence of respiratory distress (inability to coordinate suck-swallow-breathe)',
        ],
        thinkAbout: [
          'What would it mean if Elsie suddenly became quiet and stopped showing recession?',
          'How does reduced feeding contribute to dehydration risk?',
        ],
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'A\u2013E Assessment Framework', href: '/hub/resources/ae-assessment-guide' },
        ],
        answerStructure: [
          'Take each observation/sign in turn',
          'For each, name the physiological mechanism driving it',
          'Connect signs to the underlying pathophysiology of bronchiolitis',
          'Finish with the clinical implication of each finding',
        ],
      },
      {
        id: 'q5',
        partLabel: 'Part A',
        number: 5,
        title: 'Applied Clinical Impact',
        prompt: 'Elsie\u2019s capillary refill time is 3 seconds. Explain why this finding is important and what it tells the nursing team about her circulatory status.',
        wordGuide: '150\u2013200 words',
        toScoreHighly: [
          'Define capillary refill time and normal range in children (\u22642 seconds)',
          'Explain that prolonged CRT suggests peripheral vasoconstriction and early compensated shock',
          'Link to reduced oral intake, increased insensible losses, and potential dehydration',
          'State the nursing response: fluid assessment, escalation, medical review',
        ],
        thinkAbout: [
          'Why might CRT be unreliable in a cold environment?',
          'What other signs of dehydration should the nurse assess alongside CRT?',
        ],
        revisionLinks: [
          { label: 'Cardiovascular System & Assessment', href: '/hub/resources/cardiovascular-system' },
          { label: 'Paediatric Vital Signs Cheat Sheet', href: '/hub/resources/paeds-vital-signs-cheat-sheet' },
        ],
        answerStructure: [
          'Define CRT and the normal threshold',
          'Explain why 3 seconds is abnormal and what it indicates physiologically',
          'Link to Elsie\u2019s wider clinical picture (reduced feeding, dehydration risk)',
          'State the nursing actions this finding should trigger',
        ],
      },
    ],
    questionsPartB: [
      {
        id: 'q6',
        partLabel: 'Part B',
        number: 6,
        title: 'Growth & Development',
        prompt: 'Discuss the expected developmental milestones for a 7-month-old infant. Explain how a hospital admission for bronchiolitis might affect Elsie\u2019s development, and describe how the nursing team can support continued development during her stay.',
        wordGuide: '350\u2013400 words',
        toScoreHighly: [
          'Identify age-appropriate milestones across domains (gross motor, fine motor, communication, social)',
          'Reference a recognised developmental framework (e.g. Palpalus, Sheridan, Mary Sheridan)',
          'Explain how illness and hospitalisation may cause developmental regression or disruption',
          'Suggest specific, practical nursing actions to support development (play, routine, parental involvement)',
        ],
        thinkAbout: [
          'How does separation anxiety manifest at this age?',
          'Why is play important for hospitalised infants?',
          'How can Jade be involved in supporting Elsie\u2019s development during admission?',
        ],
        revisionLinks: [
          { label: 'Theories of Development', href: '/hub/resources/theories-of-development' },
          { label: 'Communicating with Children', href: '/hub/resources/y1-child-communication' },
        ],
        answerStructure: [
          'List key milestones for a 7-month-old across at least three domains',
          'Explain the impact of hospitalisation on development (regression, disrupted routine, sensory overload)',
          'Apply a developmental theory (e.g. Bowlby\u2019s attachment, Piaget\u2019s sensorimotor stage)',
          'Describe 3\u20134 specific nursing actions to promote development during admission',
        ],
      },
      {
        id: 'q7',
        partLabel: 'Part B',
        number: 7,
        title: 'Psychosocial Impact',
        prompt: 'Discuss the psychosocial impact of Elsie\u2019s admission on both Elsie and her mother Jade. Consider Jade\u2019s age, social circumstances, and anxiety. Explain how the nursing team can provide family-centred care.',
        wordGuide: '300\u2013350 words',
        toScoreHighly: [
          'Discuss the impact on Elsie (separation anxiety, disrupted attachment, unfamiliar environment)',
          'Discuss the impact on Jade (anxiety, feeling out of control, young parent, limited support)',
          'Define and apply family-centred care principles (partnership, communication, involvement in care)',
          'Suggest specific nursing interventions to support both Elsie and Jade',
        ],
        thinkAbout: [
          'How might Jade\u2019s anxiety affect her ability to care for Elsie?',
          'What assumptions should the nurse avoid making about young parents?',
        ],
        revisionLinks: [
          { label: 'Theories of Development', href: '/hub/resources/theories-of-development' },
          { label: 'Palliative Care in Children', href: '/hub/resources/palliative-care-children' },
        ],
        answerStructure: [
          'Discuss impact on Elsie: attachment, sensory environment, routine disruption',
          'Discuss impact on Jade: emotional, social, practical',
          'Define family-centred care and why it matters',
          'Propose 3\u20134 specific nursing actions for family support',
        ],
      },
      {
        id: 'q8',
        partLabel: 'Part B',
        number: 8,
        title: 'Nursing Care & MDT Approach',
        prompt: 'Plan the nursing management of Elsie\u2019s bronchiolitis. Include monitoring, interventions, and the role of the multidisciplinary team. Explain how the nurse coordinates and prioritises care.',
        wordGuide: '350\u2013400 words',
        toScoreHighly: [
          'Use a systematic framework (e.g. A\u2013E assessment) to structure the care plan',
          'Include monitoring priorities: SpO\u2082, respiratory rate, work of breathing, fluid balance, feeding',
          'Identify MDT roles: physiotherapy, dietetics, play therapy, medical team, safeguarding if relevant',
          'Discuss evidence-based interventions: high-flow oxygen, NG feeding, minimal handling, parental education',
        ],
        thinkAbout: [
          'What is the nurse\u2019s role in recognising deterioration early?',
          'When should the nurse escalate to senior review?',
        ],
        revisionLinks: [
          { label: 'A\u2013E Assessment Framework', href: '/hub/resources/ae-assessment-guide' },
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'Sepsis 6 & Escalation', href: '/hub/resources/sepsis-6-escalation' },
        ],
        answerStructure: [
          'Open with an A\u2013E assessment structure for Elsie',
          'Prioritise airway and breathing interventions',
          'Include fluid and nutrition management',
          'Identify MDT members and their roles',
          'Close with escalation criteria and discharge planning considerations',
        ],
      },
    ],
    sentenceBank: [
      'Gas exchange occurs via passive diffusion down a partial pressure gradient across the respiratory membrane.',
      'Inflammation, oedema, and mucus hypersecretion narrow the bronchiolar lumen, increasing airway resistance and reducing ventilation.',
      'According to Poiseuille\u2019s law, halving the airway radius increases resistance sixteen-fold, which is why small amounts of mucosal swelling cause disproportionate compromise in infants.',
      'This results in a ventilation-perfusion (V/Q) mismatch, impairing gas exchange and leading to hypoxaemia.',
      'Tachypnoea is a compensatory mechanism to increase minute ventilation in response to hypoxia and rising CO\u2082.',
      'Prolonged capillary refill time suggests peripheral vasoconstriction, which may indicate early compensated shock or dehydration.',
      'Family-centred care recognises parents as partners in the child\u2019s care, promoting shared decision-making and reducing parental anxiety.',
      'Bowlby\u2019s attachment theory highlights the importance of maintaining the primary caregiver\u2019s presence to reduce separation anxiety during hospitalisation.',
      'The nurse\u2019s role includes continuous assessment, early recognition of deterioration, coordination of the MDT, and advocacy for the child and family.',
      'An A\u2013E approach ensures a systematic, prioritised assessment that addresses the most life-threatening problems first.',
    ],
    whatGetsYouAFirst: [
      'Every claim is linked to the underlying physiology or a recognised framework',
      'Clinical signs are explained, not just listed \u2014 show you understand why they occur',
      'Paediatric-specific considerations are woven throughout, not added as an afterthought',
      'Family-centred care is applied practically, not just defined',
      'Language is precise and professional: \u201Ctachypnoea\u201D not \u201Cfast breathing\u201D, \u201Crecession\u201D not \u201Cpulling in\u201D',
      'Answers are structured with a clear opening, logical flow, and a concise closing statement',
    ],
    commonMistakes: [
      'Listing signs and symptoms without explaining the physiological mechanism behind each one',
      'Describing bronchiolitis as \u201Clike asthma\u201D without distinguishing the pathophysiology',
      'Forgetting to apply paediatric-specific anatomy (e.g. narrower airways, fewer alveoli, compliant chest)',
      'Writing about family-centred care in theory without giving practical examples of how to implement it',
      'Ignoring the psychosocial context entirely \u2014 Jade\u2019s age, anxiety, and support needs are part of the scenario for a reason',
      'Structuring answers as bullet-point lists instead of flowing academic paragraphs',
    ],
    howToStructure: [
      'Open each answer with a clear topic sentence that directly addresses the question',
      'Use one paragraph per concept \u2014 do not try to cover everything in a single block of text',
      'Link each point back to the scenario: mention Elsie by name, reference her observations, connect to the clinical picture',
      'Close with a sentence that ties the answer together or states the clinical significance',
      'Stay within the word guide \u2014 conciseness is valued over volume',
    ],
  },
];

export function getMocksBySystem(systemId: string): MockExam[] {
  return allMocks.filter((m) => m.system === systemId);
}

export function getMockById(systemId: string, mockId: string): MockExam | undefined {
  return allMocks.find((m) => m.system === systemId && m.id === mockId);
}
