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
        prompt: 'Discuss how Ellie\u2019s stage of development might be affected by her hospitalisation. Outline key developmental theories to support your answer and relate them to Ellie\u2019s case.',
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
      },

      // ── Q7 ─────────────────────────────────────────────────────────────────
      {
        id: 'q7',
        partLabel: 'Part B',
        number: 7,
        title: 'Emotional & Practical Impact',
        prompt: 'Explore the possible emotional and practical issues surrounding Ellie\u2019s hospitalisation. Consider the impacts on both Ellie and Sara. Support your answer with evidence.',
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
      },

      // ── Q8 ─────────────────────────────────────────────────────────────────
      {
        id: 'q8',
        partLabel: 'Part B',
        number: 8,
        title: 'Nursing Care & MDT Support',
        prompt: 'Explain how the nurse and wider multidisciplinary team could support Ellie and Sara during admission and after discharge, ensuring both clinical and psychosocial needs are met. Support your answer with evidence.',
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
];

export function getMocksBySystem(systemId: string): MockExam[] {
  return allMocks.filter((m) => m.system === systemId);
}

export function getMockById(systemId: string, mockId: string): MockExam | undefined {
  return allMocks.find((m) => m.system === systemId && m.id === mockId);
}
