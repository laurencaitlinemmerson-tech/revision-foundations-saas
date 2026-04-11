import type { MockExam } from './mockTypes';

export const allMocks: MockExam[] = [
  {
    id: 'bronchiolitis',
    system: 'respiratory',
    title: 'Bronchiolitis in Infancy',
    condition: 'Bronchiolitis',
    description: 'A 7-month-old presenting with acute bronchiolitis. This mock builds from normal respiratory anatomy and physiology through to pathophysiology, clinical signs, applied impact, developmental theory, psychosocial care, and MDT management.',
    scenario: {
      childName: 'Ellie',
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
      familyContext: 'Ellie is the first child of a young single mother, Sara (19), who is visibly anxious. Sara was discharged from postnatal care six months ago and has limited family support nearby. She has been managing Ellie\u2019s symptoms at home with saline drops and is worried about Ellie being admitted.',
    },
    whatThisMockTests: [
      'Describing normal respiratory anatomy and physiology with accurate terminology',
      'Explaining the mechanics of ventilation and gas exchange',
      'Linking pathophysiology to clinical signs in a paediatric context',
      'Applying clinical reasoning to an infant scenario',
      'Using developmental theories to assess hospitalisation impact',
      'Planning family-centred, multidisciplinary care',
    ],
    partAProgression: [
      'Q1\u2013Q2 build the foundation: normal structure and how breathing works',
      'Q3 introduces disease: what bronchiolitis does to the airways',
      'Q4 applies that knowledge: why Ellie shows specific signs',
      'Q5 connects the clinical picture to a practical impact: feeding',
      'Each question assumes you can draw on the one before it',
    ],

    // ════════════════════════════════════════════════════════════════════════
    //  PART A
    // ════════════════════════════════════════════════════════════════════════

    questionsPartA: [
      // ── Q1 ─────────────────────────────────────────────────────────────────
      {
        id: 'q1',
        partLabel: 'Part A',
        number: 1,
        title: 'Structure & Function',
        prompt: 'Describe the normal structure and function of the respiratory system. Support your answer with evidence.',
        wordGuide: '250 words',
        howToApproach: {
          whatItsAsking: 'This is a foundational anatomy and physiology question. It wants you to name the key structures of the respiratory system in order and explain what each one does. It is not asking about disease yet \u2014 focus on the healthy system.',
          commandWord: 'Describe \u2014 give a clear, detailed account of the structures and their roles. Go beyond naming them; explain their function.',
          highScoringMustInclude: [
            'Upper and lower airway structures named in order (nasal cavity, pharynx, larynx, trachea, bronchi, bronchioles, alveoli)',
            'Function of each key structure (warming, filtering, conducting, gas exchange)',
            'Clear explanation of gas exchange at the alveolar level: diffusion across the respiratory membrane, driven by partial pressure gradients',
            'Mention of the respiratory membrane structure (type I pneumocytes, capillary endothelium, basement membranes)',
            'At least one referenced source (e.g. Peate & Nair, 2016; Waugh & Grant, 2018)',
          ],
        },
        answerStructure: [
          'Open with a broad statement about the role of the respiratory system (ventilation and gas exchange)',
          'Work through the structures from upper to lower airway, stating the function of each',
          'Focus the second half of the answer on gas exchange: what happens at the alveoli, how O\u2082 and CO\u2082 move, and why',
          'Close with a sentence about why understanding normal structure matters for recognising abnormality',
        ],
        toScoreHighly: [
          'Name structures accurately and in anatomical order \u2014 do not jump around',
          'Explain gas exchange using the correct mechanism: passive diffusion down a partial pressure gradient',
          'Mention the respiratory membrane and why its thinness matters for efficient diffusion',
          'Reference at least one anatomy and physiology source to support your answer',
          'Keep the focus on normal, healthy function \u2014 do not introduce disease here',
        ],
        thinkAbout: [
          'Why is the trachea supported by C-shaped cartilage rings rather than complete rings?',
          'What would happen to gas exchange if the respiratory membrane became thickened or damaged?',
          'Why do the airways divide so many times before reaching the alveoli?',
        ],
        examinerInsight: {
          commonMistakes: 'Students often list structures without explaining what they do, or jump straight to gas exchange without covering the conducting airways. Another common error is describing gas exchange as "active transport" rather than passive diffusion.',
          whatPushesToFirst: 'A first-class answer names structures in order, explains the mechanism of gas exchange precisely (partial pressure gradients, diffusion across the respiratory membrane), and supports the answer with a referenced source. The tone is confident and the language is clinical.',
        },
        clinicalReasoning: null,
        commonLowMarkAnswer: 'A weaker answer lists a few structures without explaining their roles, describes gas exchange vaguely as "oxygen goes in and carbon dioxide comes out", and does not reference any source.',
        deterioration: null,
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'Cell Biology & the Body', href: '/hub/resources/cell-biology' },
        ],
        markingCriteria: [
          'Named upper and lower airway structures in anatomical order',
          'Explained the function of each key structure',
          'Described gas exchange at the alveolar level using correct mechanism (passive diffusion)',
          'Mentioned the respiratory membrane and its significance',
          'Referenced at least one anatomy and physiology source',
          'Maintained focus on normal, healthy function throughout',
        ],
      },

      // ── Q2 ─────────────────────────────────────────────────────────────────
      {
        id: 'q2',
        partLabel: 'Part A',
        number: 2,
        title: 'Mechanics of Ventilation',
        prompt: 'Outline how air moves in and out of the lungs during normal breathing.',
        wordGuide: '280 words',
        howToApproach: {
          whatItsAsking: 'This question is about ventilation \u2014 the physical movement of air, not gas exchange. It wants you to explain the mechanics of inspiration and expiration: what the muscles do, how pressure changes, and how air moves as a result.',
          commandWord: 'Outline \u2014 give the main points clearly and in a logical order. You do not need excessive detail, but each step must be accurate.',
          highScoringMustInclude: [
            'The role of the diaphragm and external intercostals during inspiration',
            'Boyle\u2019s law: as thoracic volume increases, intrapulmonary pressure falls below atmospheric pressure, and air flows in',
            'Expiration as a passive process during quiet breathing (elastic recoil of the lungs)',
            'The role of surfactant in reducing surface tension and preventing alveolar collapse',
            'A brief note on how this differs in infants: diaphragm dependence, horizontal ribs, compliant chest wall',
          ],
        },
        answerStructure: [
          'Define ventilation as the movement of air in and out of the lungs',
          'Describe inspiration: diaphragm contracts and flattens, thoracic cavity expands, pressure drops, air flows in',
          'Describe expiration: diaphragm relaxes, elastic recoil of lung tissue, pressure rises, air flows out',
          'Mention surfactant and its role in keeping alveoli open',
          'Close with a brief note on why infant ventilation mechanics are different and more vulnerable',
        ],
        toScoreHighly: [
          'Explain the pressure changes clearly using Boyle\u2019s law \u2014 do not just say "the diaphragm moves down"',
          'Distinguish between inspiration (active) and expiration (passive during quiet breathing)',
          'Include surfactant and explain what would happen without it (atelectasis)',
          'Note the paediatric differences: infants rely almost entirely on the diaphragm, their ribs are more horizontal, and their chest wall is more compliant',
        ],
        thinkAbout: [
          'Why does abdominal distension (e.g. from swallowed air or a full stomach) compromise an infant\u2019s breathing?',
          'What happens to ventilation when the airways are narrowed by inflammation or mucus?',
          'If an infant\u2019s chest wall is more compliant, why does recession happen so easily?',
        ],
        examinerInsight: {
          commonMistakes: 'Students often confuse ventilation with gas exchange. Another common error is describing expiration as an active process without specifying that it is passive during quiet breathing. Many also forget to mention surfactant.',
          whatPushesToFirst: 'A first-class answer explains the pressure mechanics step by step, uses Boyle\u2019s law correctly, includes surfactant, and makes a clear link to why infants are more vulnerable. This sets up the next question perfectly.',
        },
        clinicalReasoning: 'Diaphragm contracts \u2192 thoracic volume increases \u2192 intrapulmonary pressure drops below atmospheric pressure \u2192 air flows into the lungs. During expiration: diaphragm relaxes \u2192 elastic recoil of lung tissue \u2192 intrapulmonary pressure rises \u2192 air flows out.',
        commonLowMarkAnswer: 'A weaker answer says "the diaphragm moves down and air comes in" without explaining the pressure gradient, does not mention expiration mechanics, and ignores surfactant entirely.',
        deterioration: null,
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'Cell Biology & the Body', href: '/hub/resources/cell-biology' },
        ],
        markingCriteria: [
          'Defined ventilation as the movement of air in and out of the lungs',
          'Explained inspiration mechanics using Boyle\u2019s law',
          'Described expiration as a passive process during quiet breathing',
          'Included the role of surfactant and consequences of its absence',
          'Noted paediatric differences (diaphragm dependence, compliant chest wall)',
        ],
      },

      // ── Q3 ─────────────────────────────────────────────────────────────────
      {
        id: 'q3',
        partLabel: 'Part A',
        number: 3,
        title: 'Pathophysiology of Bronchiolitis',
        prompt: 'What is bronchiolitis and how does it affect the flow of air in the respiratory system? Support your answer with evidence.',
        wordGuide: '250 words',
        howToApproach: {
          whatItsAsking: 'This is where you move from normal to abnormal. The question wants you to define bronchiolitis, identify the cause, and then explain step by step what happens inside the bronchioles and how that disrupts airflow. You need to link pathology to physiology.',
          commandWord: 'What is / how does \u2014 define the condition, then explain the mechanism of disruption. This requires both knowledge and application.',
          highScoringMustInclude: [
            'Definition of bronchiolitis as a viral lower respiratory tract infection, most commonly caused by RSV',
            'The inflammatory process: viral invasion of bronchiolar epithelium, oedema, mucus hypersecretion, epithelial necrosis, cellular debris',
            'How this narrows the bronchiolar lumen, increasing airway resistance',
            'Reference to Poiseuille\u2019s law: halving the radius increases resistance sixteen-fold',
            'Consequences: air trapping, atelectasis, ventilation-perfusion (V/Q) mismatch, hypoxaemia',
            'At least one referenced source',
          ],
        },
        answerStructure: [
          'Define bronchiolitis and identify RSV as the most common cause',
          'Describe the pathological process step by step: infection, inflammation, oedema, mucus, debris',
          'Explain the effect on airflow: narrowed lumen, increased resistance, air trapping',
          'Apply Poiseuille\u2019s law to explain why infants are disproportionately affected',
          'Close with the downstream consequence: V/Q mismatch leading to hypoxaemia',
        ],
        toScoreHighly: [
          'Walk through the inflammatory cascade in a logical sequence \u2014 do not just list features',
          'Use Poiseuille\u2019s law to explain why small airways are so vulnerable to narrowing',
          'Explain both obstruction (mucus, oedema) and its consequence (V/Q mismatch, hypoxaemia)',
          'Use precise terminology: "bronchiolar lumen", "airway resistance", "atelectasis", not "blocked tubes"',
          'Support with a referenced source (e.g. NICE, 2021; Tpalpalus & Tpalpalus, 2020)',
        ],
        thinkAbout: [
          'Why are the bronchioles, rather than the bronchi, the main site of obstruction in bronchiolitis?',
          'How does mucus plugging lead to both air trapping and atelectasis in different parts of the lung?',
          'Why is bronchiolitis not the same as asthma, even though both cause wheeze?',
        ],
        examinerInsight: {
          commonMistakes: 'Students often describe bronchiolitis as "like asthma" or say the bronchi are affected. The key distinction is that bronchiolitis involves inflammation and obstruction of the bronchioles, not bronchospasm. Many also forget Poiseuille\u2019s law, which is the clearest way to explain why infants are disproportionately compromised.',
          whatPushesToFirst: 'A first-class answer explains the inflammatory cascade as a connected sequence, uses Poiseuille\u2019s law correctly, and finishes by linking the pathology to a physiological consequence (V/Q mismatch causing hypoxaemia). It reads as a chain of reasoning, not a list.',
        },
        clinicalReasoning: 'RSV invades bronchiolar epithelium \u2192 inflammatory response \u2192 oedema + mucus hypersecretion + epithelial debris \u2192 bronchiolar lumen narrows \u2192 airway resistance increases dramatically (Poiseuille\u2019s law) \u2192 air trapping + atelectasis \u2192 V/Q mismatch \u2192 impaired gas exchange \u2192 hypoxaemia.',
        commonLowMarkAnswer: 'A weaker answer defines bronchiolitis vaguely ("a chest infection in babies"), does not describe the inflammatory process, and says "the airways get blocked" without explaining resistance, V/Q mismatch, or why infants are particularly affected.',
        deterioration: {
          clinicalChanges: 'Rising respiratory rate (>60), deepening recession, SpO\u2082 falling below 90%, exhaustion (reduced recession paradoxically), reduced consciousness',
          whatItIndicates: 'Worsening airway obstruction, respiratory muscle fatigue, and impending respiratory failure. A child who was previously working hard to breathe and then becomes quiet is deteriorating, not improving.',
          nurseAction: 'Escalate immediately using SBAR. Prepare for high-flow nasal cannula or CPAP. Call medical team for urgent review. Ensure senior nurse and paediatric registrar are informed.',
        },
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'Cell Biology & the Body', href: '/hub/resources/cell-biology' },
        ],
        markingCriteria: [
          'Defined bronchiolitis and identified RSV as the most common cause',
          'Described the inflammatory cascade in logical sequence',
          'Explained airway resistance using Poiseuille\u2019s law',
          'Linked pathology to V/Q mismatch and hypoxaemia',
          'Used precise clinical terminology throughout',
          'Referenced at least one source',
        ],
      },

      // ── Q4 ─────────────────────────────────────────────────────────────────
      {
        id: 'q4',
        partLabel: 'Part A',
        number: 4,
        title: 'Signs & Symptoms',
        prompt: 'Discuss the potential signs and symptoms of bronchiolitis in infants. Support your answer with evidence.',
        wordGuide: '200 words',
        howToApproach: {
          whatItsAsking: 'This question wants you to identify the signs and symptoms of bronchiolitis and, critically, explain why they occur. It is testing whether you can connect what you see clinically to the pathophysiology you described in Q3. Do not just list \u2014 explain.',
          commandWord: 'Discuss \u2014 explore the topic from more than one angle. Here, that means identifying signs and symptoms and explaining the physiological reason behind each one.',
          highScoringMustInclude: [
            'Signs: tachypnoea, tachycardia, subcostal/intercostal recession, nasal flaring, wheeze, crackles, reduced SpO\u2082',
            'Symptoms: coryzal symptoms, poor feeding, irritability, reduced wet nappies',
            'Physiological explanation for each key sign (e.g. tachypnoea as a compensatory response to hypoxia)',
            'Application to Ellie\u2019s specific observations where possible',
            'Referenced source (e.g. NICE bronchiolitis guideline, 2021)',
          ],
        },
        answerStructure: [
          'Open by distinguishing signs (observable by the nurse) from symptoms (reported by Sara)',
          'Work through the key signs: tachypnoea, recession, nasal flaring, tachycardia, wheeze, crackles',
          'For each, give the physiological explanation (e.g. recession occurs because the infant must generate greater negative intrathoracic pressure to move air past narrowed airways)',
          'Include reduced feeding and fewer wet nappies as clinically significant symptoms',
          'Close by linking Ellie\u2019s presentation to the expected picture of moderate bronchiolitis',
        ],
        toScoreHighly: [
          'Explain the mechanism behind each sign, not just its name',
          'Link tachycardia to the sympathetic response to maintain oxygen delivery, not just "the heart beats faster"',
          'Explain recession as a visible marker of increased work of breathing due to airway resistance',
          'Mention that reduced feeding reflects the inability to coordinate suck-swallow-breathe during tachypnoea',
          'Reference NICE or a paediatric nursing source',
        ],
        thinkAbout: [
          'What would it mean if Ellie suddenly stopped showing recession and became quiet? Is that a good sign or a bad sign?',
          'Why is reduced urine output (fewer wet nappies) a concerning sign alongside respiratory distress?',
          'How does tachypnoea itself contribute to insensible fluid loss?',
        ],
        examinerInsight: {
          commonMistakes: 'The most common error is listing signs without any physiological reasoning. Writing "tachypnoea" is not enough \u2014 you must explain why respiratory rate increases. Students also frequently forget to include feeding difficulties and hydration concerns, which are central to the clinical picture.',
          whatPushesToFirst: 'A first-class answer treats each sign as a window into the underlying physiology. It reads as: "This sign is present because this physiological process is happening." The student applies this to Ellie specifically and references clinical guidance.',
        },
        clinicalReasoning: 'Bronchiolar narrowing \u2192 increased airway resistance \u2192 greater effort to breathe \u2192 visible recession + nasal flaring. Impaired gas exchange \u2192 hypoxaemia \u2192 tachypnoea (compensatory) + tachycardia (sympathetic response to maintain O\u2082 delivery). Tachypnoea \u2192 inability to coordinate suck-swallow-breathe \u2192 poor feeding \u2192 dehydration risk.',
        commonLowMarkAnswer: 'A weaker answer lists "cough, wheeze, fast breathing, not feeding" without any physiological explanation, does not distinguish between signs and symptoms, and does not mention Ellie.',
        deterioration: {
          clinicalChanges: 'Grunting, see-saw breathing, apnoeic episodes, decreasing SpO\u2082 despite oxygen therapy, reduced responsiveness',
          whatItIndicates: 'Respiratory exhaustion and impending failure. Grunting is an attempt to create auto-PEEP to keep alveoli open. Apnoea in a young infant with bronchiolitis can occur without warning.',
          nurseAction: 'Urgent escalation. Position the child to optimise the airway. Apply high-flow oxygen. Prepare for potential transfer to HDU or PICU. Document the timing and nature of the change clearly.',
        },
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'A\u2013E Assessment Framework', href: '/hub/resources/ae-assessment-guide' },
          { label: 'Paediatric Vital Signs Cheat Sheet', href: '/hub/resources/paeds-vital-signs-cheat-sheet' },
        ],
        markingCriteria: [
          'Distinguished between signs and symptoms',
          'Explained the physiological mechanism behind each key sign',
          'Linked tachycardia to the sympathetic compensatory response',
          'Included feeding difficulties and hydration concerns',
          'Applied findings to Ellie\u2019s specific presentation',
          'Referenced NICE or a paediatric nursing source',
        ],
      },

      // ── Q5 ─────────────────────────────────────────────────────────────────
      {
        id: 'q5',
        partLabel: 'Part A',
        number: 5,
        title: 'Applied Clinical Impact',
        prompt: 'Discuss how feeding difficulties might relate to Ellie\u2019s respiratory condition.',
        wordGuide: '180 words',
        howToApproach: {
          whatItsAsking: 'This question applies everything from Q1\u2013Q4 to one practical problem: why Ellie is not feeding. It tests whether you can connect respiratory physiology to a real clinical consequence. Think about the mechanics of feeding, the impact of tachypnoea, and the downstream risks.',
          commandWord: 'Discuss \u2014 explore the relationship between respiratory compromise and feeding. Consider multiple factors and link them.',
          highScoringMustInclude: [
            'The suck-swallow-breathe cycle and why it breaks down during tachypnoea',
            'Increased metabolic demand from increased work of breathing',
            'Nasal congestion further limiting ability to feed (infants are obligate nasal breathers)',
            'Consequences: dehydration, weight loss, reduced energy reserves, prolonged recovery',
            'The nursing and clinical response: fluid balance monitoring, nasogastric feeding if intake falls below threshold',
          ],
        },
        answerStructure: [
          'Open by explaining why feeding is directly affected by respiratory distress',
          'Explain the suck-swallow-breathe coordination and how tachypnoea disrupts it',
          'Add nasal congestion as a contributing factor (obligate nasal breathing in infants)',
          'State the clinical consequences: dehydration risk, increased metabolic demand not being met',
          'Close with what the nursing team should do about it (fluid balance, NG feeding threshold, escalation)',
        ],
        toScoreHighly: [
          'Name the suck-swallow-breathe cycle specifically \u2014 do not just say "she is too tired to eat"',
          'Explain that infants are obligate nasal breathers, so nasal congestion directly impairs feeding',
          'Connect reduced intake to clinical risk: dehydration, hypoglycaemia, and prolonged illness',
          'Mention the NICE threshold for considering nasogastric feeding (typically <50\u201375% of normal intake)',
          'Apply this directly to Ellie: her intake is less than 50% and she has fewer wet nappies',
        ],
        thinkAbout: [
          'Why is dehydration particularly dangerous alongside respiratory distress?',
          'How does increased work of breathing raise metabolic demand, and what happens when caloric intake falls at the same time?',
          'At what point should the nurse escalate feeding concerns to the medical team?',
        ],
        examinerInsight: {
          commonMistakes: 'Students often write "she is too breathless to eat" without explaining the physiological mechanism. The suck-swallow-breathe cycle is the key concept here. Many also forget to link reduced feeding to dehydration risk or to suggest what the nurse should do about it.',
          whatPushesToFirst: 'A first-class answer explains the physiological mechanism (suck-swallow-breathe disruption), identifies the consequences (dehydration, metabolic deficit), and states the nursing response (monitoring, NG feeding, escalation). It treats feeding difficulty as a clinical problem to be managed, not just a symptom to describe.',
        },
        clinicalReasoning: 'Tachypnoea (\u226560 breaths/min) \u2192 infant cannot coordinate suck-swallow-breathe safely \u2192 feeds shorten or are refused \u2192 caloric intake drops below metabolic demand (already raised by increased work of breathing) \u2192 risk of dehydration + hypoglycaemia. Nasal congestion (obligate nasal breather) \u2192 further impairs feeding. Fewer wet nappies = reduced urine output = possible dehydration.',
        commonLowMarkAnswer: 'A weaker answer says Ellie "doesn\u2019t want to eat because she is ill" without any physiological reasoning, does not mention the suck-swallow-breathe cycle, and does not consider nursing actions.',
        deterioration: {
          clinicalChanges: 'No wet nappy for 6+ hours, sunken fontanelle, dry mucous membranes, prolonged CRT (>3 seconds), tachycardia worsening',
          whatItIndicates: 'Clinical dehydration progressing. Combined with respiratory compromise, this increases the risk of circulatory compromise and organ hypoperfusion.',
          nurseAction: 'Strict fluid balance. Weigh nappies. Commence nasogastric feeds or IV fluids as prescribed. Escalate to medical team for fluid resuscitation plan. Assess for signs of shock.',
        },
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'Paediatric Vital Signs Cheat Sheet', href: '/hub/resources/paeds-vital-signs-cheat-sheet' },
        ],
        markingCriteria: [
          'Named the suck-swallow-breathe cycle and explained its disruption',
          'Identified obligate nasal breathing as a contributing factor',
          'Connected reduced intake to dehydration and metabolic risk',
          'Mentioned the NICE threshold for nasogastric feeding',
          'Applied directly to Ellie\u2019s intake and wet nappy output',
          'Stated what the nursing team should do (monitoring, NG feeding, escalation)',
        ],
        priorityStack: [
          'Respiratory stabilisation (reduce work of breathing)',
          'Feeding assessment (suck-swallow-breathe coordination)',
          'Hydration monitoring (fluid balance, wet nappies)',
          'Caloric intake support (NG feeding if <50% intake)',
          'Escalation to medical team if deteriorating',
        ],
      },
    ],

    // ════════════════════════════════════════════════════════════════════════
    //  PART B
    // ════════════════════════════════════════════════════════════════════════

    questionsPartB: [
      // ── Q6 ─────────────────────────────────────────────────────────────────
      {
        id: 'q6',
        partLabel: 'Part B',
        number: 6,
        title: 'Development & Hospitalisation',
        prompt: 'Discuss how patients stage of development might be affected by her hospitalisation. Outline key developmental theories to support your answer and relate them to Ellie\u2019s case.',
        wordGuide: '400 words',
        howToApproach: {
          whatItsAsking: 'This question moves from clinical science to child development. It wants you to identify Ellie\u2019s developmental stage, name relevant theories, and explain how hospitalisation could disrupt her development. You must apply the theories to Ellie specifically \u2014 do not just describe them in the abstract.',
          commandWord: 'Discuss / Outline \u2014 explore the topic in depth and present the key developmental theories clearly. Then relate them directly to Ellie\u2019s situation.',
          highScoringMustInclude: [
            'Expected milestones for a 7-month-old across at least three domains (gross motor, fine motor, communication, social/emotional)',
            'Three developmental theories applied to Ellie: Bowlby (attachment and separation anxiety), Erikson (trust vs. mistrust), Piaget (sensorimotor stage)',
            'Specific ways hospitalisation could disrupt development: disrupted routine, sensory overload, separation from Sara, regression',
            'Practical nursing actions to support development: maintaining routine, encouraging parental involvement, play, minimising distressing procedures',
          ],
        },
        answerStructure: [
          'Open with Ellie\u2019s expected developmental stage: key milestones at 7 months',
          'Introduce Bowlby: attachment theory, separation anxiety emerging at this age, impact of hospitalisation on the attachment relationship',
          'Introduce Erikson: trust vs. mistrust stage, how inconsistent care in hospital could undermine trust',
          'Introduce Piaget: sensorimotor stage, learning through exploration, and how illness/restriction limits this',
          'Discuss how hospitalisation could cause regression or disruption',
          'Close with specific nursing actions to support Ellie\u2019s development during admission',
        ],
        toScoreHighly: [
          'Name milestones accurately for a 7-month-old \u2014 do not guess or describe a different age',
          'Apply each theory to Ellie\u2019s specific circumstances, not to infants in general',
          'Explain how separation anxiety is developmentally normal at this age and is heightened by hospitalisation',
          'Suggest practical, specific nursing actions (not vague statements like "support the child")',
          'Show awareness that development can regress during illness and that this is usually temporary',
        ],
        thinkAbout: [
          'How does the unfamiliar hospital environment affect a sensorimotor-stage infant who learns through touch, taste, and movement?',
          'What happens if Sara is too anxious to engage with Ellie\u2019s care \u2014 how does this affect the attachment relationship?',
          'Why might Ellie temporarily lose a recently acquired skill (e.g. sitting unsupported) during her admission?',
        ],
        examinerInsight: {
          commonMistakes: 'Students often describe theories in isolation without connecting them to Ellie. Writing a paragraph about Bowlby\u2019s theory in general terms scores much lower than explaining what separation anxiety looks like for a 7-month-old in hospital. Another error is confusing the developmental stages (e.g. placing Ellie in Piaget\u2019s preoperational stage, which begins at 2 years).',
          whatPushesToFirst: 'A first-class answer integrates theory with scenario. Each theory is introduced, applied to Ellie\u2019s age and context, and followed by a practical nursing action. The answer flows as a connected discussion rather than three separate paragraphs about three theories.',
        },
        clinicalReasoning: null,
        commonLowMarkAnswer: 'A weaker answer describes Bowlby, Erikson, and Piaget in textbook terms without mentioning Ellie, gives milestones for the wrong age, and does not suggest any nursing actions to support development.',
        deterioration: null,
        revisionLinks: [
          { label: 'Theories of Development', href: '/hub/resources/theories-of-development' },
          { label: 'Communicating with Children', href: '/hub/resources/y1-child-communication' },
        ],
        markingCriteria: [
          'Identified expected milestones for a 7-month-old across multiple domains',
          'Applied Bowlby\u2019s attachment theory to Ellie\u2019s hospitalisation',
          'Applied Erikson\u2019s trust vs. mistrust stage to Ellie\u2019s context',
          'Applied Piaget\u2019s sensorimotor stage to Ellie\u2019s limited exploration',
          'Discussed potential developmental regression',
          'Suggested specific, practical nursing actions to support development',
        ],
      },

      // ── Q7 ─────────────────────────────────────────────────────────────────
      {
        id: 'q7',
        partLabel: 'Part B',
        number: 7,
        title: 'Emotional & Practical Impact',
        prompt: 'Explore the possible emotional and practical issues surrounding Ellie\u2019s hospitalisation. Consider the impacts on both patient and mum. Support your answer with evidence.',
        wordGuide: '350 words',
        howToApproach: {
          whatItsAsking: 'This is a psychosocial question. It wants you to think about how hospitalisation affects Ellie emotionally and practically, and equally, how it affects Sara. You must consider Sara\u2019s specific context: young, single, limited support, anxious. The question tests empathy, awareness of family dynamics, and knowledge of family-centred care.',
          commandWord: 'Explore \u2014 consider the topic from multiple perspectives. Look at emotional and practical impacts separately for both Ellie and Sara.',
          highScoringMustInclude: [
            'Impact on Ellie: separation anxiety, fear of strangers, disrupted routine, unfamiliar sensory environment, potential for regression',
            'Impact on Sara: anxiety about Ellie\u2019s condition, feeling out of control, practical concerns (transport, finances, other responsibilities), potential guilt, limited support',
            'Family-centred care: defining the principles and applying them to this scenario',
            'Specific nursing actions: keeping Sara informed, involving her in care, offering practical support, non-judgemental communication',
            'Referenced source (e.g. Smith et al., 2018; Shields et al., 2012; PALPALUS)',
          ],
        },
        answerStructure: [
          'Open with Ellie\u2019s emotional experience: what hospitalisation feels like for a 7-month-old',
          'Discuss Sara\u2019s emotional response: fear, anxiety, guilt, isolation',
          'Cover practical impacts on Sara: being away from home, potential loss of income, limited support network',
          'Introduce family-centred care as the framework for addressing these needs',
          'Close with specific nursing actions that support both Ellie and Sara',
        ],
        toScoreHighly: [
          'Give equal weight to Ellie and Sara \u2014 do not focus only on the child',
          'Show awareness of Sara\u2019s specific context: young parent, single, limited support. These details are in the scenario for a reason',
          'Avoid assumptions about young parents \u2014 Sara is managing well but needs support, not judgement',
          'Define family-centred care and then apply it practically (e.g. involving Sara in Ellie\u2019s care, explaining treatments clearly, asking Sara what she needs)',
          'Reference a source on family-centred care or psychosocial impact of hospitalisation',
        ],
        thinkAbout: [
          'How might Sara\u2019s anxiety affect her ability to comfort Ellie? And how could the nurse help break that cycle?',
          'What practical barriers might stop Sara from staying at Ellie\u2019s bedside (transport, money, no one to cover at home)?',
          'Why is it important that the nurse does not assume Sara\u2019s needs based on her age?',
        ],
        examinerInsight: {
          commonMistakes: 'Students often focus entirely on the child and write one line about the parent. This is a family-centred question \u2014 Sara\u2019s experience is equally important. Another error is defining family-centred care in textbook terms without giving any practical examples of what the nurse would actually do.',
          whatPushesToFirst: 'A first-class answer gives balanced attention to both Ellie and Sara, addresses emotional and practical impacts separately, applies family-centred care with specific actions, and shows sensitivity to Sara\u2019s individual circumstances. It reads as though the student has thought about what this admission feels like from Sara\u2019s perspective.',
        },
        clinicalReasoning: null,
        commonLowMarkAnswer: 'A weaker answer says "Sara will be worried" without elaboration, ignores practical issues entirely, defines family-centred care without applying it, and does not suggest any specific nursing actions.',
        deterioration: null,
        revisionLinks: [
          { label: 'Theories of Development', href: '/hub/resources/theories-of-development' },
          { label: 'Communicating with Children', href: '/hub/resources/y1-child-communication' },
        ],
        markingCriteria: [
          'Addressed emotional impact on Ellie (separation anxiety, unfamiliar environment)',
          'Addressed emotional impact on Sara (anxiety, guilt, isolation)',
          'Discussed practical impacts on Sara (transport, finances, support)',
          'Defined and applied family-centred care with specific examples',
          'Showed sensitivity to Sara\u2019s individual circumstances without assumptions',
          'Referenced a source on family-centred care or psychosocial impact',
        ],
      },

      // ── Q8 ─────────────────────────────────────────────────────────────────
      {
        id: 'q8',
        partLabel: 'Part B',
        number: 8,
        title: 'Nursing Care & MDT Support',
        prompt: 'Explain how the nurse and wider multidisciplinary team could support patient and mum during admission and after discharge, ensuring both clinical and psychosocial needs are met. Support your answer with evidence.',
        wordGuide: '400 words',
        howToApproach: {
          whatItsAsking: 'This is the big-picture question. It wants a care plan that covers clinical management (airway, breathing, hydration, monitoring) and psychosocial support (family-centred care, parental education, MDT involvement), and extends beyond discharge. You need to show you can prioritise, coordinate, and think about the whole picture.',
          commandWord: 'Explain \u2014 make your reasoning clear. Do not just list interventions; explain why each one matters and who is responsible.',
          highScoringMustInclude: [
            'Clinical priorities structured using A\u2013E: airway positioning, oxygen therapy, respiratory monitoring, fluid balance, feeding support, temperature management',
            'MDT roles: physiotherapy (chest physio if indicated), dietetics (feeding plan), play therapy (developmental support), health visitor (post-discharge), medical team (prescribing, escalation)',
            'Psychosocial support: keeping Sara informed, involving her in care decisions, referring to social work or young parent support if needed',
            'Discharge planning: safety-netting advice, when to return to hospital, GP follow-up, health visitor referral',
            'Referenced source (e.g. NICE bronchiolitis guideline, 2021; NMC Code)',
          ],
        },
        answerStructure: [
          'Open with the priority: airway and breathing management using an A\u2013E framework',
          'Cover clinical interventions: oxygen therapy, SpO\u2082 monitoring, fluid balance, NG feeding if needed, minimal handling',
          'Identify MDT members and what each contributes to Ellie\u2019s care',
          'Address psychosocial support: how the nurse supports Sara, involves her, communicates, and refers',
          'Close with discharge planning: safety-netting, follow-up, ongoing support in the community',
        ],
        toScoreHighly: [
          'Structure the clinical section using A\u2013E \u2014 this shows systematic thinking',
          'Name specific MDT members and state what each one does (not just "the MDT will help")',
          'Show that psychosocial care is not an add-on but an integrated part of the plan',
          'Include discharge planning \u2014 care does not end when Ellie leaves the ward',
          'Reference NICE guidelines for bronchiolitis management and the NMC Code for professional standards',
        ],
        thinkAbout: [
          'What is the priority problem right now: airway, breathing, or hydration? How do you decide?',
          'When should the nurse escalate to the medical team? What specific triggers should prompt this?',
          'How do you ensure Sara feels involved in care decisions rather than excluded by clinical activity?',
        ],
        examinerInsight: {
          commonMistakes: 'Students often write a list of clinical interventions without prioritising them or explaining who does what. Many forget discharge planning entirely, even though the question specifically asks about support "after discharge". Another common error is treating the MDT as a vague concept rather than naming specific roles.',
          whatPushesToFirst: 'A first-class answer uses A\u2013E to structure clinical priorities, names MDT members with their specific roles, integrates psychosocial support alongside clinical care, and includes a clear discharge plan. It shows that the student understands nursing as coordination, advocacy, and holistic care \u2014 not just a series of tasks.',
        },
        clinicalReasoning: 'Priority: Airway (position, suction if needed) \u2192 Breathing (SpO\u2082 monitoring, oxygen therapy, assess WOB) \u2192 Circulation (CRT, HR, fluid balance) \u2192 Disability (alertness, tone, feeding behaviour) \u2192 Exposure (temperature, skin assessment). Alongside: MDT coordination, family support, discharge planning.',
        commonLowMarkAnswer: 'A weaker answer lists "give oxygen, monitor observations, call the doctor" without any structure, does not mention psychosocial care, names no specific MDT members, and ignores discharge entirely.',
        deterioration: {
          clinicalChanges: 'SpO\u2082 not maintaining above 92% despite high-flow oxygen, apnoeic episodes, bradycardia, reduced consciousness, silent chest',
          whatItIndicates: 'Respiratory failure requiring escalation to HDU or PICU. A silent chest indicates critically reduced air entry. Bradycardia in a previously tachycardic infant is a pre-terminal sign.',
          nurseAction: 'Activate the paediatric emergency team. Maintain airway and continue oxygen. Prepare for potential intubation. Ensure Sara is supported and kept informed. Document all observations and actions clearly with timings.',
        },
        revisionLinks: [
          { label: 'A\u2013E Assessment Framework', href: '/hub/resources/ae-assessment-guide' },
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'Sepsis 6 & Escalation', href: '/hub/resources/sepsis-6-escalation' },
        ],
        markingCriteria: [
          'Structured clinical priorities using A\u2013E framework',
          'Named specific MDT members and their roles',
          'Integrated psychosocial support alongside clinical care',
          'Included Sara in care planning with specific examples',
          'Included discharge planning with safety-netting advice',
          'Referenced NICE guidelines and/or NMC Code',
        ],
        priorityStack: [
          'Airway and breathing management',
          'Oxygenation and SpO\u2082 monitoring',
          'Hydration and fluid balance',
          'Feeding support (NG if indicated)',
          'Psychosocial and family-centred care',
          'Discharge planning and community follow-up',
        ],
      },
    ],

    // ════════════════════════════════════════════════════════════════════════
    //  SENTENCE BANK
    // ════════════════════════════════════════════════════════════════════════

    sentenceBank: [
      'Gas exchange occurs via passive diffusion down a partial pressure gradient across the respiratory membrane (Waugh & Grant, 2018).',
      'According to Poiseuille\u2019s law, halving the airway radius increases resistance sixteen-fold, explaining why small amounts of mucosal swelling cause disproportionate airway compromise in infants.',
      'Inflammation, oedema, and mucus hypersecretion narrow the bronchiolar lumen, increasing airway resistance and resulting in a ventilation-perfusion mismatch (NICE, 2021).',
      'Tachypnoea is a compensatory mechanism aimed at increasing minute ventilation in response to hypoxia and rising arterial CO\u2082.',
      'The inability to coordinate the suck-swallow-breathe cycle during tachypnoea is a primary cause of feeding difficulty in bronchiolitis (Tpalpalus & Tpalpalus, 2020).',
      'Prolonged capillary refill time suggests peripheral vasoconstriction, which may indicate early compensatory circulatory compromise or dehydration.',
      'Bowlby\u2019s attachment theory highlights that separation from the primary caregiver during the critical period of attachment formation can cause significant distress in infants (Bowlby, 1969).',
      'According to Erikson (1963), infants in the trust versus mistrust stage rely on consistent, responsive caregiving to develop a sense of security.',
      'Family-centred care recognises parents as partners in the child\u2019s care, promoting shared decision-making and reducing parental anxiety (Shields et al., 2012).',
      'An A\u2013E approach ensures a systematic, prioritised assessment that addresses the most life-threatening problems first (Resuscitation Council UK, 2021).',
      'The nurse\u2019s role includes continuous assessment, early recognition of deterioration, coordination of the multidisciplinary team, and advocacy for the child and family (NMC, 2018).',
      'Discharge planning should include safety-netting advice, clear criteria for returning to hospital, and referral to the health visitor for ongoing community support.',
    ],

    // ════════════════════════════════════════════════════════════════════════
    //  POST-MOCK ANALYSIS
    // ════════════════════════════════════════════════════════════════════════

    whatGetsYouAFirst: [
      'Every clinical sign is explained, not just listed \u2014 you show you understand why it occurs',
      'Pathophysiology is presented as a chain of reasoning, not isolated facts',
      'Paediatric-specific anatomy and physiology are woven throughout, not added as an afterthought',
      'Developmental theories are applied to Ellie specifically, with practical nursing actions linked to each',
      'Family-centred care is applied practically: you describe what the nurse does, not just what the concept means',
      'Language is precise and professional: "tachypnoea" not "fast breathing", "recession" not "pulling in", "bronchiolar lumen" not "tubes"',
      'Answers are structured with a clear opening sentence, logical flow, and a closing statement that ties the answer together',
      'Every answer links back to Ellie\u2019s scenario \u2014 her name, her observations, her mother Sara',
    ],
    commonMistakes: [
      'Listing signs and symptoms without explaining the physiological mechanism behind each one',
      'Describing bronchiolitis as "like asthma" without distinguishing the pathophysiology (inflammation and obstruction vs. bronchospasm)',
      'Forgetting paediatric-specific anatomy: narrower airways, fewer alveoli, compliant chest wall, diaphragm-dependent breathing',
      'Confusing ventilation (air movement) with gas exchange (O\u2082/CO\u2082 diffusion)',
      'Writing about family-centred care in theory without giving practical examples',
      'Ignoring Sara\u2019s specific context \u2014 her age, anxiety, and support needs are in the scenario for a reason',
      'Structuring answers as bullet-point lists instead of flowing academic paragraphs',
      'Forgetting discharge planning in the MDT question \u2014 care does not end at the hospital door',
    ],
    howToStructure: [
      'Open each answer with a clear topic sentence that directly addresses the question',
      'Use one paragraph per concept \u2014 do not try to cover everything in one block',
      'Link each point back to the scenario: mention Ellie by name, reference her observations, connect to the clinical picture',
      'Use precise clinical language consistently \u2014 this signals competence to the examiner',
      'Close with a sentence that ties the answer together or states the clinical significance',
      'Stay within the word guide \u2014 conciseness is valued over volume. Every sentence should earn its place.',
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  //  MOCK 2 — ACUTE ASTHMA IN A SCHOOL-AGE CHILD
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: 'asthma',
    system: 'respiratory',
    title: 'Acute Asthma in a School-Age Child',
    condition: 'Acute Asthma',
    description: 'A 9-year-old presenting with a severe asthma attack not responding to his usual salbutamol inhaler. This mock builds from normal respiratory anatomy and physiology through to three-component pathophysiology, clinical signs, BTS/SIGN severity classification, developmental theory, psychosocial care, and MDT management.',
    scenario: {
      childName: 'Jamie',
      age: '9 years',
      presentingComplaint: 'Worsening wheeze and increasing shortness of breath for 3 hours, not responding to salbutamol inhaler',
      duration: '3 hours',
      observations: [
        { label: 'Respiratory rate', value: '34 breaths/min' },
        { label: 'Heart rate', value: '118 bpm' },
        { label: 'SpO\u2082', value: '92% on room air' },
        { label: 'PEFR', value: '42% of predicted' },
        { label: 'Temperature', value: '37.1\u00B0C' },
      ],
      clinicalSigns: [
        'Audible wheeze on expiration',
        'Prolonged expiratory phase',
        'Use of accessory muscles (sternocleidomastoid and intercostals)',
        'Subcostal and intercostal recession',
        'Anxious appearance, difficulty completing sentences',
        'Unable to perform PEFR effectively due to breathlessness',
      ],
      diagnosis: 'Severe acute asthma (BTS/SIGN classification)',
      familyContext: 'Jamie is a 9-year-old with a 4-year history of asthma, prescribed regular inhaled corticosteroids and salbutamol PRN. His mother Alison (38) is a single parent working full-time and arrived visibly frightened. She mentions she has two younger children at home with a neighbour. This is Jamie\u2019s third hospital admission in the past year. Alison is worried about losing more time from work.',
    },
    whatThisMockTests: [
      'Describing normal respiratory anatomy and physiology with accurate terminology',
      'Explaining the mechanics of ventilation and the significance of airway smooth muscle',
      'Explaining the three-component pathophysiology of asthma: bronchospasm, mucosal oedema, mucus hypersecretion',
      'Applying BTS/SIGN severity classification to clinical observations',
      'Explaining why salbutamol alone is insufficient in severe asthma',
      'Using developmental theories relevant to a 9-year-old (Erikson, Piaget)',
      'Addressing psychosocial impact on both child and parent in the context of a chronic condition',
      'Planning MDT-coordinated care including discharge and asthma action planning',
    ],
    partAProgression: [
      'Q1\u2013Q2 build the foundation: normal respiratory structure and how breathing works',
      'Q3 introduces disease: the three components of asthma pathophysiology',
      'Q4 applies that knowledge: BTS/SIGN classification and why Jamie shows specific signs',
      'Q5 pushes deeper: why salbutamol has not worked and what this means clinically',
      'Each question assumes you can draw on the one before it',
    ],

    // ════════════════════════════════════════════════════════════════════════
    //  PART A
    // ════════════════════════════════════════════════════════════════════════

    questionsPartA: [
      // ── Q1 ─────────────────────────────────────────────────────────────────
      {
        id: 'q1',
        partLabel: 'Part A',
        number: 1,
        title: 'Structure & Function',
        prompt: 'Describe the normal structure and function of the respiratory system. Support your answer with evidence.',
        wordGuide: '250 words',
        howToApproach: {
          whatItsAsking: 'This is a foundational anatomy and physiology question. Name the key structures in order and explain what each one does. Do not introduce disease yet \u2014 focus on the healthy system.',
          commandWord: 'Describe \u2014 give a clear, detailed account of the structures and their roles. Go beyond naming them; explain their function.',
          highScoringMustInclude: [
            'Upper and lower airway structures named in order (nasal cavity, pharynx, larynx, trachea, bronchi, bronchioles, alveoli)',
            'Function of each key structure (warming, filtering, conducting, gas exchange)',
            'Clear explanation of gas exchange: passive diffusion across the respiratory membrane, driven by partial pressure gradients',
            'Mention of smooth muscle in the bronchiolar walls and goblet cells — both relevant to asthma pathophysiology',
            'At least one referenced source (e.g. Peate & Nair, 2016; Waugh & Grant, 2018)',
          ],
        },
        answerStructure: [
          'Open with a broad statement about the role of the respiratory system (ventilation and gas exchange)',
          'Work through structures upper to lower airway, stating the function of each',
          'Focus the second half on gas exchange: alveoli, respiratory membrane, O\u2082/CO\u2082 diffusion',
          'Note the smooth muscle layer of bronchioles and goblet cells \u2014 this prepares the foundation for Q3',
          'Close with a sentence about why understanding normal structure matters for recognising abnormality',
        ],
        toScoreHighly: [
          'Name structures accurately and in anatomical order',
          'Explain gas exchange as passive diffusion down a partial pressure gradient \u2014 not active transport',
          'Mention smooth muscle in bronchiolar walls and goblet cells',
          'Reference at least one anatomy and physiology source',
          'Keep the focus on normal, healthy function throughout',
        ],
        thinkAbout: [
          'Why does the bronchiole have smooth muscle in its walls but the alveolus does not?',
          'What would happen to airflow if bronchiolar smooth muscle contracted involuntarily?',
          'How does the mucociliary escalator protect the lower airways, and what happens when it is overwhelmed?',
        ],
        examinerInsight: {
          commonMistakes: 'Students often list structures without explaining their function, or skip straight to gas exchange without covering the conducting airways. A commonly missed detail is the smooth muscle layer of the bronchioles \u2014 essential for understanding bronchospasm in Q3.',
          whatPushesToFirst: 'A first-class answer names structures in order, explains gas exchange precisely via partial pressure gradients, mentions smooth muscle and goblet cells as structural features relevant to asthma, and references a source. It lays a foundation for the questions that follow.',
        },
        clinicalReasoning: null,
        commonLowMarkAnswer: 'A weaker answer lists a few structures without explaining their roles, describes gas exchange as "oxygen goes in and carbon dioxide comes out", and does not reference any source.',
        deterioration: null,
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'Cell Biology & the Body', href: '/hub/resources/cell-biology' },
        ],
        markingCriteria: [
          'Named upper and lower airway structures in anatomical order',
          'Explained the function of each key structure',
          'Described gas exchange using the correct mechanism (passive diffusion)',
          'Mentioned smooth muscle in bronchiolar walls',
          'Referenced at least one anatomy and physiology source',
        ],
      },

      // ── Q2 ─────────────────────────────────────────────────────────────────
      {
        id: 'q2',
        partLabel: 'Part A',
        number: 2,
        title: 'Mechanics of Ventilation',
        prompt: 'Outline how air moves in and out of the lungs during normal breathing.',
        wordGuide: '280 words',
        howToApproach: {
          whatItsAsking: 'This is about ventilation \u2014 the physical movement of air, not gas exchange. Explain what the muscles do, how pressure changes, and how air moves. Pay particular attention to expiration, since expiratory airflow limitation is the hallmark of asthma.',
          commandWord: 'Outline \u2014 give the main points clearly and in logical order. Each step must be accurate.',
          highScoringMustInclude: [
            'The role of the diaphragm and external intercostal muscles during inspiration',
            "Boyle\u2019s law: as thoracic volume increases, intrapulmonary pressure falls below atmospheric pressure, air flows in",
            'Expiration as a passive process during quiet breathing (elastic recoil)',
            'The role of surfactant in reducing surface tension',
            'That expiration becomes active when airways are obstructed \u2014 relevant to asthma',
          ],
        },
        answerStructure: [
          'Define ventilation as the movement of air in and out of the lungs',
          'Describe inspiration: diaphragm contracts, thoracic cavity expands, pressure drops, air flows in',
          'Describe normal expiration: diaphragm relaxes, elastic recoil, pressure rises, air flows out',
          'Mention surfactant and its role',
          'Note that expiration becomes effortful when airways narrow \u2014 this sets up the asthma pathophysiology',
        ],
        toScoreHighly: [
          "Explain pressure changes using Boyle\u2019s law \u2014 do not just say \"the diaphragm moves down\"",
          'Distinguish clearly between active inspiration and passive expiration during quiet breathing',
          'Note that obstructive airway conditions specifically impair expiration \u2014 explaining the prolonged expiratory phase in Q4',
          'Reference at least one source',
        ],
        thinkAbout: [
          'Why does a person with asthma find it harder to breathe out than to breathe in?',
          'What happens to trapped air when expiration is incomplete? Why does this increase the work of breathing?',
          "Why does Jamie sit upright and lean forward? What does this do to his breathing mechanics?",
        ],
        examinerInsight: {
          commonMistakes: "Students often confuse ventilation with gas exchange. A common error is describing expiration as always being active. Many miss the connection between airway obstruction and expiratory difficulty, which is the central mechanism behind wheeze and air trapping in asthma.",
          whatPushesToFirst: "A first-class answer explains pressure mechanics step by step using Boyle\u2019s law, clearly distinguishes active and passive expiration, and notes that airway narrowing makes expiration effortful \u2014 setting up the asthma pathophysiology in Q3.",
        },
        clinicalReasoning: "Diaphragm contracts \u2192 thoracic volume increases \u2192 intrapulmonary pressure drops below atmospheric \u2192 air flows in. Expiration: diaphragm relaxes \u2192 elastic recoil \u2192 pressure rises \u2192 air flows out. In obstruction: expiration becomes active, accessory muscles engaged, air traps, hyperinflation develops.",
        commonLowMarkAnswer: "A weaker answer says \"the diaphragm moves down and air comes in\" without explaining the pressure gradient, does not distinguish active from passive expiration, and makes no connection between airway narrowing and expiratory difficulty.",
        deterioration: null,
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'A\u2013E Assessment Framework', href: '/hub/resources/ae-assessment-guide' },
        ],
        markingCriteria: [
          'Defined ventilation as movement of air in and out of the lungs',
          "Explained inspiration mechanics using Boyle\u2019s law",
          'Described expiration as a passive process during quiet breathing',
          'Included the role of surfactant',
          'Noted that expiration becomes active during airway obstruction',
        ],
      },

      // ── Q3 ─────────────────────────────────────────────────────────────────
      {
        id: 'q3',
        partLabel: 'Part A',
        number: 3,
        title: 'Pathophysiology of Asthma',
        prompt: 'What is asthma and how does it obstruct airflow in the respiratory system? Support your answer with evidence.',
        wordGuide: '300 words',
        howToApproach: {
          whatItsAsking: 'This moves from normal to abnormal. Define asthma, then explain the three mechanisms that obstruct airflow. You must go beyond "airways narrow" \u2014 explain what causes the narrowing and how each component contributes.',
          commandWord: 'What is / how does \u2014 define the condition, then explain the mechanism. Requires both knowledge and application.',
          highScoringMustInclude: [
            'Definition: chronic inflammatory airway disease with variable, reversible airflow obstruction and airway hyperresponsiveness',
            'Component 1: Bronchospasm \u2014 trigger-induced mast cell degranulation releases histamine and leukotrienes causing smooth muscle contraction',
            'Component 2: Mucosal oedema \u2014 inflammatory mediators increase vascular permeability, thickening the airway wall',
            'Component 3: Mucus hypersecretion \u2014 goblet cell stimulation produces excess viscous mucus',
            "Poiseuille\u2019s law: small reductions in lumen radius dramatically increase airway resistance",
            'Consequences: expiratory airflow limitation, air trapping, hyperinflation, V/Q mismatch, hypoxaemia',
            'At least one referenced source (BTS/SIGN, 2022; NICE, 2017)',
          ],
        },
        answerStructure: [
          'Define asthma: chronic inflammatory condition with reversible obstruction',
          'Explain component 1: trigger exposure, mast cell activation, smooth muscle contraction (bronchospasm)',
          'Explain component 2: mucosal inflammation and oedema increasing wall thickness',
          'Explain component 3: goblet cell stimulation and viscous mucus production',
          "Apply Poiseuille\u2019s law: why even small luminal changes cause large resistance increases",
          'Close: air trapping \u2192 hyperinflation \u2192 V/Q mismatch \u2192 hypoxaemia',
        ],
        toScoreHighly: [
          'Present all three components \u2014 do not reduce asthma to bronchospasm alone',
          "Apply Poiseuille\u2019s law to explain why expiration is specifically affected",
          'Distinguish the reversible component (bronchospasm) from the less reversible (mucosal inflammation)',
          'Connect pathophysiology to expiratory airflow limitation \u2014 this explains the wheeze and prolonged expiration',
          'Reference BTS/SIGN or NICE guidelines',
        ],
        thinkAbout: [
          'Why does salbutamol reverse bronchospasm but not the inflammatory or mucus components?',
          "Why might a child with severe asthma have a 'silent chest'? What does the absence of wheeze actually indicate?",
          'How does air trapping lead to hyperinflation, and why does hyperinflation increase the work of breathing further?',
        ],
        examinerInsight: {
          commonMistakes: "Students often reduce asthma to 'airways narrow' and focus only on bronchospasm. This misses the clinical point: salbutamol only reverses bronchospasm \u2014 it does not address inflammation or mucus, which is why Jamie is not responding to his inhaler. This connection runs from Q3 straight into Q5.",
          whatPushesToFirst: "A first-class answer presents all three components as distinct mechanisms, uses Poiseuille\u2019s law, explains why expiration is specifically impaired, and plants the seed for why salbutamol is insufficient. The answer reads as a chain of cause and effect.",
        },
        clinicalReasoning: "Trigger exposure \u2192 mast cell degranulation \u2192 histamine, leukotrienes, prostaglandins released \u2192 (1) smooth muscle contraction (bronchospasm) + (2) mucosal oedema (inflammation) + (3) mucus hypersecretion \u2192 airway lumen narrows \u2192 resistance increases dramatically (Poiseuille\u2019s law) \u2192 expiratory airflow limitation \u2192 air trapping and hyperinflation \u2192 V/Q mismatch \u2192 hypoxaemia.",
        commonLowMarkAnswer: "A weaker answer says 'asthma is when the airways narrow and you can't breathe' without describing the inflammatory mechanism, only mentions bronchospasm, and does not explain why expiration is specifically affected.",
        deterioration: {
          clinicalChanges: 'Worsening wheeze then silent chest, SpO\u2082 falling despite oxygen, increasing recession, exhaustion, cyanosis, bradycardia, reduced consciousness',
          whatItIndicates: "Life-threatening asthma. A silent chest indicates critically reduced air entry \u2014 it is a pre-arrest sign, not improvement. Bradycardia in a previously tachycardic child suggests imminent respiratory arrest.",
          nurseAction: 'Call resuscitation team immediately. Maintain high-flow oxygen. Continue nebulised treatment but prepare for IV magnesium sulphate and PICU transfer. Keep Alison informed. Document all interventions with precise timings.',
        },
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'A\u2013E Assessment Framework', href: '/hub/resources/ae-assessment-guide' },
        ],
        markingCriteria: [
          'Defined asthma as a chronic inflammatory condition with reversible obstruction',
          'Described bronchospasm: trigger, mast cell degranulation, smooth muscle contraction',
          'Described mucosal oedema and inflammatory wall thickening',
          'Described mucus hypersecretion and its contribution to obstruction',
          "Applied Poiseuille\u2019s law to explain the impact of lumen narrowing",
          'Linked pathophysiology to expiratory airflow limitation and hypoxaemia',
          'Referenced BTS/SIGN or NICE guidelines',
        ],
      },

      // ── Q4 ─────────────────────────────────────────────────────────────────
      {
        id: 'q4',
        partLabel: 'Part A',
        number: 4,
        title: 'Signs, Symptoms & Severity',
        prompt: "Discuss the signs and symptoms of a severe asthma attack in a school-age child, relating your answer to Jamie\u2019s presentation where possible. Support your answer with evidence.",
        wordGuide: '250 words',
        howToApproach: {
          whatItsAsking: "Identify the signs and symptoms of severe asthma, explain why each occurs, and apply BTS/SIGN severity classification to Jamie's observations. This tests whether you can link clinical findings to the pathophysiology from Q3.",
          commandWord: 'Discuss \u2014 explore from multiple angles. Identify signs and symptoms and explain the physiological reason behind each.',
          highScoringMustInclude: [
            'Signs: tachypnoea, tachycardia, wheeze, prolonged expiratory phase, accessory muscle use, recession, SpO\u2082 92%, PEFR 42% predicted',
            'Symptoms: breathlessness, inability to complete sentences, anxiety',
            'BTS/SIGN severe asthma criteria: PEFR 40\u201360% predicted, SpO\u2082 <95%, too breathless to complete sentences',
            'Physiological explanation for each key sign',
            'Application to Jamie\u2019s specific observations',
            'Referenced source (BTS/SIGN, 2022)',
          ],
        },
        answerStructure: [
          "Open by classifying Jamie\u2019s attack using BTS/SIGN criteria",
          'Discuss respiratory signs: wheeze, prolonged expiration, tachypnoea \u2014 explain each physiologically',
          'Discuss accessory muscle use and recession \u2014 explain what this indicates about work of breathing',
          'Discuss tachycardia as a compensatory response',
          "Close with the clinical significance of inability to complete sentences and PEFR 42%",
        ],
        toScoreHighly: [
          "Apply BTS/SIGN classification to Jamie\u2019s observations \u2014 do not describe signs in the abstract",
          'Explain the physiological mechanism behind each sign',
          "Describe wheeze as turbulent airflow through a narrowed bronchiole, not just 'a sound'",
          'Connect SpO\u2082 92% to the V/Q mismatch from Q3',
          'Reference BTS/SIGN guidelines',
        ],
        thinkAbout: [
          'Why does the wheeze in asthma occur predominantly during expiration?',
          "What does it mean clinically when a wheezing child suddenly becomes quiet?",
          'Why does anxiety worsen bronchospasm, and how does the nurse\u2019s communication approach matter?',
        ],
        examinerInsight: {
          commonMistakes: "Students often list signs without explaining them. Many miss BTS/SIGN classification entirely. Some confuse wheeze in asthma (expiratory bronchospasm) with wheeze in bronchiolitis (mucus and oedema in smaller airways) without noting the distinction.",
          whatPushesToFirst: "A first-class answer classifies Jamie's attack using BTS/SIGN criteria, explains the physiological mechanism behind each sign, and makes explicit links back to the three-component pathophysiology from Q3. Jamie\u2019s name and specific observations appear throughout.",
        },
        clinicalReasoning: "Airway narrowing \u2192 turbulent airflow \u2192 wheeze (predominantly expiratory) + prolonged expiratory phase. Reduced gas exchange \u2192 hypoxaemia \u2192 tachypnoea (compensatory) + tachycardia + SpO\u2082 \u2193. Increased work of breathing \u2192 primary muscles insufficient \u2192 accessory muscle recruitment + recession. PEFR 42% = severe asthma by BTS/SIGN (40\u201360% predicted).",
        commonLowMarkAnswer: "A weaker answer lists signs without explanation, does not apply BTS/SIGN criteria, and makes no reference to Jamie\u2019s specific observations or the pathophysiology from Q3.",
        deterioration: null,
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'A\u2013E Assessment Framework', href: '/hub/resources/ae-assessment-guide' },
        ],
        markingCriteria: [
          "Classified Jamie\u2019s attack using BTS/SIGN severe asthma criteria",
          'Identified major signs: wheeze, tachypnoea, accessory muscle use, recession, low SpO\u2082, low PEFR',
          'Explained the physiological mechanism behind at least three signs',
          'Linked SpO\u2082 92% to V/Q mismatch',
          'Referenced BTS/SIGN guidelines',
          "Applied findings to Jamie\u2019s specific observations",
        ],
      },

      // ── Q5 ─────────────────────────────────────────────────────────────────
      {
        id: 'q5',
        partLabel: 'Part A',
        number: 5,
        title: 'Treatment Response',
        prompt: "Using the relevant anatomy and physiology, explain why Jamie\u2019s usual salbutamol inhaler has not relieved his symptoms. Support your answer with evidence.",
        wordGuide: '200 words',
        howToApproach: {
          whatItsAsking: "This tests applied clinical reasoning. Why is the reliever inhaler not working? To answer well you need to explain what salbutamol does, what it does not do, and why both matter in Jamie\u2019s case.",
          commandWord: 'Explain \u2014 state the mechanism, then apply it directly to the scenario.',
          highScoringMustInclude: [
            'Salbutamol as a short-acting beta-2 agonist: binds beta-2 receptors on bronchiolar smooth muscle, causing relaxation and bronchodilation',
            'Salbutamol addresses bronchospasm only \u2014 it does not reduce mucosal oedema or mucus hypersecretion',
            'In severe attacks, the inflammatory and mucus components are significant contributors that salbutamol cannot address',
            'Drug delivery problem: severe bronchospasm reduces inspiratory flow, meaning insufficient drug reaches the lower airways via a standard MDI',
            'What is now needed: nebulised salbutamol, ipratropium bromide, systemic corticosteroids',
            'Referenced source (BTS/SIGN, 2022)',
          ],
        },
        answerStructure: [
          "Explain salbutamol\u2019s mechanism: beta-2 agonist causing bronchodilation",
          'State clearly what it does not address: mucosal inflammation and mucus',
          'Explain the drug delivery problem in severe bronchospasm',
          'Connect to the three components from Q3: one drug cannot address all three',
          'State what additional treatments are required',
        ],
        toScoreHighly: [
          "Show you understand salbutamol\u2019s mechanism precisely, not just its name",
          'Explicitly connect back to the three-component pathophysiology from Q3',
          'Address both the pharmacological limitation and the delivery limitation',
          'Suggest appropriate escalation: nebuliser, steroids, ipratropium',
          'Reference BTS/SIGN stepwise management',
        ],
        thinkAbout: [
          'Why is a nebuliser more effective than an MDI inhaler in severe asthma?',
          'What is the role of systemic corticosteroids in asthma, and how long do they take to work?',
          'At what point would IV magnesium sulphate be considered, and what is its mechanism of action?',
        ],
        examinerInsight: {
          commonMistakes: "Students often say 'the inhaler doesn't work' without explaining why. The central clinical teaching point is that salbutamol only reverses bronchospasm \u2014 leaving mucosal inflammation and mucus unaddressed. Many also miss the drug delivery problem, which is a key reason why nebulisers are used instead of MDIs in acute severe attacks.",
          whatPushesToFirst: "A first-class answer explains salbutamol's mechanism precisely, uses the three-component framework from Q3 to explain its limitations, addresses the delivery problem, and suggests escalation aligned with BTS/SIGN guidelines. It reads as applied clinical reasoning.",
        },
        clinicalReasoning: "Salbutamol binds beta-2 receptors on bronchiolar smooth muscle \u2192 relaxation \u2192 bronchodilation (reverses bronchospasm only). Mucosal oedema and mucus plugging unresolved \u2192 ongoing obstruction. Severe bronchospasm \u2192 reduced inspiratory flow \u2192 inadequate drug delivery via MDI. Required: nebulised salbutamol (higher, continuous dose) + ipratropium (anticholinergic bronchodilation via different mechanism) + oral/IV prednisolone (reduces inflammation; onset 4\u20136 hours).",
        commonLowMarkAnswer: "A weaker answer says 'the inhaler didn't work because the asthma is too bad' without explaining salbutamol's mechanism, does not mention the drug delivery problem, and does not suggest any escalation treatments.",
        deterioration: {
          clinicalChanges: 'SpO\u2082 continuing to fall despite high-flow oxygen, silent chest, exhaustion, cyanosis, bradycardia',
          whatItIndicates: 'Life-threatening asthma. Failure to respond to nebulised treatment indicates refractory bronchospasm with critical hypoxaemia. Immediate escalation required.',
          nurseAction: 'Escalate to senior nurse and medical team using SBAR. Ensure IV access. Prepare IV magnesium sulphate per BTS/SIGN. Notify PICU. Continue oxygen and nebulised treatment while awaiting team.',
        },
        revisionLinks: [
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'A\u2013E Assessment Framework', href: '/hub/resources/ae-assessment-guide' },
          { label: 'Drug Calculations Cheat Sheet', href: '/hub/resources/drug-calculations-cheat-sheet' },
        ],
        markingCriteria: [
          "Explained salbutamol\u2019s mechanism as a beta-2 agonist causing bronchodilation",
          'Stated that salbutamol addresses bronchospasm only, not mucosal oedema or mucus',
          'Explained the drug delivery limitation in severe bronchospasm',
          'Identified need for nebulised treatment and systemic corticosteroids',
          'Referenced BTS/SIGN management guidelines',
        ],
      },
    ],

    // ════════════════════════════════════════════════════════════════════════
    //  PART B
    // ════════════════════════════════════════════════════════════════════════

    questionsPartB: [
      // ── Q6 ─────────────────────────────────────────────────────────────────
      {
        id: 'q6',
        partLabel: 'Part B',
        number: 6,
        title: 'Developmental Impact',
        prompt: "Using relevant developmental theories, discuss the impact of hospitalisation and a long-term condition on Jamie\u2019s development and wellbeing. Support your answer with evidence.",
        wordGuide: '300 words',
        howToApproach: {
          whatItsAsking: "This shifts from clinical to psychosocial. Apply developmental theories appropriate for a 9-year-old and connect them to what it means to have asthma and be hospitalised. Jamie is not an infant \u2014 the theories, milestones, and concerns are completely different.",
          commandWord: 'Discuss \u2014 consider from multiple perspectives. Apply each theory to Jamie\u2019s specific context.',
          highScoringMustInclude: [
            "Erikson\u2019s industry versus inferiority stage (6\u201312 years): Jamie\u2019s need to feel competent, fear of falling behind at school, sport limitations, feeling different from peers",
            "Piaget\u2019s concrete operations stage (7\u201311 years): Jamie can understand cause and effect; benefits from honest, concrete explanations about his asthma",
            "Impact on self-concept: embarrassment about inhaler use in school, fear of exclusion or being seen as 'the sick one'",
            'School absence: academic disruption, fractured friendships, reduced participation in physical activity',
            'Chronic condition considerations: repeated admissions affect sense of normality and control',
            'Nursing actions: age-appropriate explanations, involving Jamie in his own care, supporting his confidence and self-management skills',
            'Referenced source (e.g. Erikson, 1963; Piaget, 1954)',
          ],
        },
        answerStructure: [
          "Open by identifying Jamie\u2019s developmental stage and what it means for his experience of illness",
          "Apply Erikson: industry versus inferiority \u2014 what asthma and hospitalisation threaten (school, sport, peer relationships)",
          "Apply Piaget: concrete operations \u2014 what Jamie can understand and how the nurse should communicate",
          'Discuss self-concept: embarrassment about the condition, managing an inhaler in front of peers',
          'Close with nursing actions that promote competence and control',
        ],
        toScoreHighly: [
          "Apply theories to Jamie specifically, not to 'school-age children' in general",
          "Acknowledge the pattern of repeated admissions \u2014 chronic disruption affects development differently from a one-off event",
          'Consider the specific threat asthma poses to industry: restriction of sport and PE affects a key area of school-age competence',
          "Suggest concrete actions: involving Jamie in inhaler education, giving him a role in his own asthma action plan",
          'Reference at least one developmental theory source',
        ],
        thinkAbout: [
          "How might using an inhaler in school affect Jamie\u2019s sense of identity among his peers?",
          'What is the difference in how a 9-year-old and a 4-year-old understand hospitalisation?',
          'How can the nurse help Jamie feel more in control of his asthma rather than controlled by it?',
        ],
        examinerInsight: {
          commonMistakes: "Students frequently apply infant theories (Bowlby, sensorimotor stage) to a 9-year-old. Another error is describing Erikson\u2019s theory without connecting it to Jamie's specific circumstances: school, sport, and peer relationships. Erikson is essential here but must be applied, not just named.",
          whatPushesToFirst: "A first-class answer names the correct developmental stage, applies Erikson's industry versus inferiority to Jamie's experience of chronic asthma, considers social and academic impacts, and suggests nursing actions that promote competence and control. Jamie is named throughout.",
        },
        clinicalReasoning: null,
        commonLowMarkAnswer: "A weaker answer applies Bowlby\u2019s attachment theory to a 9-year-old, describes theories in textbook terms without mentioning Jamie, and does not suggest any nursing actions beyond 'reassure the child'.",
        deterioration: null,
        revisionLinks: [
          { label: 'Theories of Development', href: '/hub/resources/theories-of-development' },
          { label: 'Placement Survival Guide', href: '/hub/resources/placement-survival' },
        ],
        markingCriteria: [
          "Applied Erikson\u2019s industry versus inferiority stage to Jamie\u2019s context",
          "Applied Piaget\u2019s concrete operations stage to communication and explanation",
          'Discussed impact on school, sport, and peer relationships',
          'Considered the effect of repeated admissions on sense of normality',
          'Suggested specific nursing actions to promote competence and self-management',
          'Referenced at least one developmental theory',
        ],
      },

      // ── Q7 ─────────────────────────────────────────────────────────────────
      {
        id: 'q7',
        partLabel: 'Part B',
        number: 7,
        title: 'Emotional & Practical Impact',
        prompt: "Explore the possible emotional and practical issues surrounding Jamie\u2019s admission and long-term condition. Consider both Jamie and his mother Alison. Support your answer with evidence.",
        wordGuide: '350 words',
        howToApproach: {
          whatItsAsking: "This asks you to consider the full human picture. Emotional and practical impacts on both Jamie and Alison, taking account of their specific circumstances. Alison\u2019s situation \u2014 single parent, working full-time, two other children, third admission this year \u2014 is in the scenario for a reason.",
          commandWord: 'Explore \u2014 consider from multiple perspectives. Address emotional and practical impacts for both individuals.',
          highScoringMustInclude: [
            "Jamie\u2019s emotional experience: acute fear of not being able to breathe, post-episode anxiety, worry about school absence and falling behind",
            "Jamie\u2019s practical concerns: missing PE and sport, managing inhalers in school, being perceived differently by peers",
            "Alison\u2019s emotional response: acute fear during the attack, guilt (could this have been prevented?), cumulative exhaustion from repeated admissions",
            "Alison\u2019s practical concerns: time off work, childcare for two younger children, financial impact of repeated hospital visits",
            'Impact of chronic illness: repeated disruption normalises anxiety; risk of carer burnout',
            'Family-centred care: definition and practical application to Jamie and Alison',
            "Non-judgemental approach to adherence: inhaler technique is a sensitive topic that should not be raised in a way that makes Alison feel blamed",
            'Referenced source (e.g. Shields et al., 2012)',
          ],
        },
        answerStructure: [
          "Open with Jamie\u2019s immediate emotional experience: the fear of not being able to breathe",
          'Discuss ongoing concerns: school, sport, identity, peer relationships',
          "Address Alison\u2019s emotional response: acute fear, guilt, and the cumulative weight of repeated admissions",
          "Cover Alison\u2019s practical issues: work, childcare for younger siblings, financial impact",
          'Introduce family-centred care as the nursing framework',
          'Close with specific nursing actions for both Jamie and Alison',
        ],
        toScoreHighly: [
          'Give equal weight to Jamie and Alison',
          "Acknowledge the cumulative nature of repeated admissions \u2014 this is not a first crisis for Alison",
          'Avoid moralising about adherence or inhaler technique',
          'Apply family-centred care with specific examples rather than just naming the concept',
          'Reference a source on family-centred care or psychosocial impact of chronic illness',
        ],
        thinkAbout: [
          "How might repeated hospital admissions affect Alison\u2019s own mental health over time?",
          "What might make Jamie reluctant to use his inhaler in school, and how can the nurse address this without judgement?",
          'What is the long-term risk to a child\u2019s sense of safety if they repeatedly experience severe breathlessness?',
        ],
        examinerInsight: {
          commonMistakes: "Students often write two lines about the parent after a long paragraph about the child. This question expects equal weighting. Another error is ignoring the chronic and repeated nature of Jamie\u2019s asthma \u2014 the scenario mentions three admissions in a year, and this context must feature in the answer.",
          whatPushesToFirst: "A first-class answer gives balanced attention to Jamie and Alison, addresses both emotional and practical impacts, acknowledges the cumulative burden of chronic illness, applies family-centred care with practical examples, and is sensitive to adherence issues. It reads as though the student has considered what this day feels like from Alison\u2019s perspective.",
        },
        clinicalReasoning: null,
        commonLowMarkAnswer: "A weaker answer says 'Alison will be worried' without elaboration, ignores the practical impact entirely, defines family-centred care without applying it, and does not acknowledge that this is Jamie\u2019s third hospital admission.",
        deterioration: null,
        revisionLinks: [
          { label: 'Theories of Development', href: '/hub/resources/theories-of-development' },
          { label: 'Placement Survival Guide', href: '/hub/resources/placement-survival' },
        ],
        markingCriteria: [
          "Addressed Jamie\u2019s emotional experience (fear, post-episode anxiety, school concerns)",
          "Addressed Jamie\u2019s practical concerns (sport, inhaler use in school, peer perception)",
          "Addressed Alison\u2019s emotional response (fear, guilt, cumulative burden)",
          "Addressed Alison\u2019s practical issues (work, childcare, finances)",
          'Defined and applied family-centred care with specific examples',
          'Acknowledged the chronic and repeated nature of the condition',
          'Referenced a relevant source',
        ],
      },

      // ── Q8 ─────────────────────────────────────────────────────────────────
      {
        id: 'q8',
        partLabel: 'Part B',
        number: 8,
        title: 'Nursing Care & MDT Management',
        prompt: "Explain how the nurse and wider multidisciplinary team could support Jamie and Alison during admission and following discharge, ensuring clinical, educational, and psychosocial needs are met. Support your answer with evidence.",
        wordGuide: '400 words',
        howToApproach: {
          whatItsAsking: "This is the big-picture care question. It wants an acute management plan, MDT coordination, patient and family education, and a discharge plan that addresses the recurrence pattern. 'Educational' needs is a specific signal: asthma self-management education is central here.",
          commandWord: 'Explain \u2014 state what is done, why it is done, and who is responsible.',
          highScoringMustInclude: [
            'Clinical priorities using A\u2013E: positioning, high-flow oxygen, continuous nebulised salbutamol \u00b1 ipratropium, SpO\u2082 monitoring, IV access, systemic corticosteroids, PEFR reassessment',
            'Escalation criteria: when to call senior team, preparation for IV magnesium sulphate, PICU referral',
            'MDT roles: paediatric registrar (prescribing, escalation), specialist asthma nurse (education, action plan), physiotherapist (breathing techniques), play therapist (procedural support), school nurse (ongoing support), GP (follow-up, step-up of regular therapy)',
            'Patient education: written personalised asthma action plan, inhaler technique check, trigger identification, understanding preventer versus reliever',
            'Family education: Alison\u2019s ability to recognise deterioration, when to call 999, preventer adherence, follow-up plan',
            "Discharge criteria: PEFR \u226575% predicted, written asthma action plan, GP follow-up within 48 hours, school nurse notification",
            'Referenced source (BTS/SIGN, 2022; NICE, 2017; NMC Code, 2018)',
          ],
        },
        answerStructure: [
          'Open with acute clinical priorities using A\u2013E framework',
          'Cover treatment plan: oxygen, nebulisers, steroids, monitoring',
          'State escalation triggers: when to call the team, what life-threatening signs indicate',
          'Name MDT members and their specific roles',
          'Address educational needs: Jamie\u2019s self-management and Alison\u2019s home management',
          'Close with discharge criteria, written asthma action plan, and community follow-up',
        ],
        toScoreHighly: [
          'Structure clinical priorities using A\u2013E',
          'Name specific MDT members with their roles \u2014 do not say "the MDT" without detail',
          "Address the educational element specifically \u2014 it is in the question prompt and is central to preventing Jamie\u2019s fourth admission",
          'Include discharge criteria with PEFR threshold and community follow-up',
          "Acknowledge the pattern of repeated admissions: step-up of regular therapy and adherence review are essential",
          'Reference BTS/SIGN and NMC Code',
        ],
        thinkAbout: [
          'What PEFR reading would indicate Jamie is safe for discharge, and what follow-up is required within 48 hours?',
          'Why is adherence to the preventer inhaler (inhaled corticosteroid) the most important factor in reducing future admissions?',
          "How does the nurse approach an inhaler technique check without making Alison feel blamed for this admission?",
        ],
        examinerInsight: {
          commonMistakes: "Students write lists of clinical interventions without structure or rationale. Many neglect the educational component entirely despite the question specifically including it. The pattern of repeated admissions demands that step-up of therapy and trigger review feature in the discharge plan \u2014 but most students ignore this history.",
          whatPushesToFirst: "A first-class answer uses A\u2013E to structure acute priorities, names specific MDT members, addresses asthma education as the key to preventing readmission, includes clear discharge criteria, a written asthma action plan, and connects the care plan to the history of repeated admissions. It reads as a coordinated plan, not a task list.",
        },
        clinicalReasoning: "A \u2013 position upright, high-flow oxygen via non-rebreathe mask. B \u2013 continuous nebulised salbutamol 2.5mg + ipratropium 250mcg, SpO\u2082 monitoring, reassess PEFR. C \u2013 IV access, fluid balance, HR monitoring. D \u2013 alertness, anxiety management, age-appropriate communication with Jamie. E \u2013 temperature, skin. Alongside: oral prednisolone 1\u20132mg/kg, MDT coordination, written asthma action plan pre-discharge, GP follow-up within 48h.",
        commonLowMarkAnswer: "A weaker answer lists 'give nebuliser, check oxygen, call the doctor' without structure, does not mention education or discharge planning, names no specific MDT members, and ignores the pattern of repeated admissions.",
        deterioration: {
          clinicalChanges: 'Failure to respond to three back-to-back nebulisers, SpO\u2082 <92% despite high-flow oxygen, silent chest, bradycardia, altered consciousness',
          whatItIndicates: 'Life-threatening asthma. Requires immediate PICU escalation, IV magnesium sulphate (smooth muscle relaxation via calcium antagonism), possible intubation.',
          nurseAction: 'Activate resuscitation team. Maintain airway and high-flow oxygen. Establish IV access if not in place. Prepare IV magnesium sulphate 40mg/kg per protocol. Keep Alison with Jamie unless resuscitation is required. Document every intervention with timestamps.',
        },
        revisionLinks: [
          { label: 'A\u2013E Assessment Framework', href: '/hub/resources/ae-assessment-guide' },
          { label: 'Respiratory System & Assessment', href: '/hub/resources/respiratory-system' },
          { label: 'Drug Calculations Cheat Sheet', href: '/hub/resources/drug-calculations-cheat-sheet' },
        ],
        markingCriteria: [
          'Structured acute clinical priorities using A\u2013E framework',
          'Outlined treatment: oxygen, nebulised salbutamol + ipratropium, systemic corticosteroids',
          'Named specific MDT members and their roles',
          'Addressed patient and family education: asthma action plan, inhaler technique, triggers',
          'Included discharge criteria and community follow-up plan',
          "Acknowledged the pattern of repeated admissions and need for step-up review",
          'Referenced BTS/SIGN and NMC Code',
        ],
        priorityStack: [
          'Airway positioning and high-flow oxygen',
          'Continuous nebulised bronchodilator therapy',
          'SpO\u2082 monitoring and PEFR reassessment',
          'Systemic corticosteroids',
          'MDT coordination and escalation planning',
          'Asthma education and written personalised action plan',
          'Discharge planning and community follow-up within 48 hours',
        ],
      },
    ],

    // ════════════════════════════════════════════════════════════════════════
    //  SENTENCE BANK
    // ════════════════════════════════════════════════════════════════════════

    sentenceBank: [
      'Asthma is a chronic inflammatory airway disease characterised by variable, reversible airflow obstruction and airway hyperresponsiveness to a range of stimuli (BTS/SIGN, 2022).',
      'The three pathophysiological components of asthma are bronchospasm, mucosal oedema, and mucus hypersecretion, each contributing to airway luminal narrowing and increased resistance.',
      'Salbutamol, a short-acting beta-2 agonist, causes relaxation of bronchiolar smooth muscle and bronchodilation, but does not address the inflammatory or mucus components of obstruction.',
      "According to Poiseuille\u2019s law, resistance to airflow is inversely proportional to the fourth power of the radius; small reductions in airway diameter therefore cause dramatic increases in airway resistance.",
      'In severe asthma, the expiratory phase is prolonged because airway narrowing limits the rate of outflow; air trapping and hyperinflation follow, increasing the work of breathing further.',
      'BTS/SIGN guidelines classify severe acute asthma in children as PEFR 40\u201360% of predicted, SpO\u2082 <95%, and too breathless to complete sentences (BTS/SIGN, 2022).',
      'Tachypnoea is a physiological compensatory response to hypoxaemia and hypercapnia, increasing minute ventilation in an attempt to restore normal gas exchange.',
      "Erikson (1963) described the school-age years as the stage of industry versus inferiority; a child with a chronic condition that limits physical activity and school attendance is at risk of developing a sense of inadequacy among peers.",
      'Family-centred care is a partnership model recognising parents and carers as integral to the child\u2019s wellbeing, promoting shared decision-making and reducing parental anxiety (Shields et al., 2012).',
      'An A\u2013E approach ensures a systematic, prioritised assessment that addresses the most immediately life-threatening problems first (Resuscitation Council UK, 2021).',
      'A written personalised asthma action plan incorporating PEFR-based self-management thresholds and clear guidance on when to seek emergency help is recommended following every acute attack (BTS/SIGN, 2022).',
      'The NMC Code (2018) requires nurses to prioritise people, practise effectively, preserve safety, and promote professionalism \u2014 principles that underpin every element of Jamie\u2019s care.',
    ],

    // ════════════════════════════════════════════════════════════════════════
    //  POST-MOCK ANALYSIS
    // ════════════════════════════════════════════════════════════════════════

    whatGetsYouAFirst: [
      'All three pathophysiological components of asthma are explained \u2014 bronchospasm, mucosal oedema, and mucus \u2014 not just "airways narrow"',
      "Salbutamol's mechanism and its limitations are explained precisely, with clear reasoning for why it is insufficient alone in severe asthma",
      'Clinical signs are explained physiologically: wheeze is not just described, it is explained as turbulent airflow through a narrowed bronchiolar lumen',
      "BTS/SIGN severity classification is applied to Jamie\u2019s specific observations, not just mentioned in passing",
      "Developmental theory is applied to Jamie as a 9-year-old: industry versus inferiority, school, sport, and peer identity feature specifically",
      "Alison\u2019s context is acknowledged and taken seriously: single parent, working full-time, two other children, third admission in a year",
      'Clinical questions are structured with A\u2013E; discussion questions are written in coherent paragraphs, not bullet points',
      "Every answer links back to Jamie\u2019s scenario: his name, his PEFR, his history of repeated admissions, his mother Alison",
    ],
    commonMistakes: [
      "Reducing asthma to 'airways narrow' without explaining bronchospasm, mucosal oedema, and mucus as three distinct mechanisms",
      "Not explaining why salbutamol is insufficient \u2014 this is the central clinical teaching point of the mock",
      'Applying infant or toddler developmental theories (Bowlby, sensorimotor stage) to a 9-year-old',
      "Ignoring PEFR 42% predicted and failing to apply BTS/SIGN severity classification",
      "Describing wheeze without explaining what produces it (turbulent airflow through a narrowed bronchiolar lumen)",
      "Writing two lines about Alison after a long section on Jamie \u2014 the psychosocial questions require equal weighting",
      "Ignoring the history of repeated admissions \u2014 this is a pattern, not an isolated episode, and it must shape the care and discharge plan",
      'Structuring answers as bullet-point lists rather than flowing academic paragraphs with reasoning',
    ],
    howToStructure: [
      'Open each answer with a clear topic sentence that directly addresses the question',
      'In Part A: follow the chain from normal physiology \u2192 pathophysiology \u2192 clinical signs \u2192 treatment limitation \u2014 each question builds on the last',
      'In Part B: apply the correct theories for a 9-year-old, name specific impacts, then link each to a nursing action',
      "Use precise clinical language: 'bronchospasm' not 'tightening', 'tachypnoea' not 'fast breathing', 'BTS/SIGN severe' not 'really bad'",
      "Name Jamie and Alison throughout \u2014 this signals to the examiner that you are applying knowledge, not reciting it",
      'Close each answer with a sentence that states the clinical significance or ties the answer back to Jamie\u2019s care',
      'Stay within the word guide \u2014 every sentence should earn its place',
    ],
  },
];

export function getMocksBySystem(systemId: string): MockExam[] {
  return allMocks.filter((m) => m.system === systemId);
}

export function getMockById(systemId: string, mockId: string): MockExam | undefined {
  return allMocks.find((m) => m.system === systemId && m.id === mockId);
}
