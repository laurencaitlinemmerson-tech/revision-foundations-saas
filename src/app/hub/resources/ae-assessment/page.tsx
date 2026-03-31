'use client';

import EditorialLayout from '@/components/EditorialLayout';
import SelfTestQuiz from '@/components/SelfTestQuiz';

const steps = [
  {
    letter: 'A',
    title: 'Airway',
    subtitle: 'Is the airway patent?',
    assess: [
      'If talking → airway is patent',
      'Look: visible obstruction, swelling, cyanosis, accessory muscles',
      'Listen: stridor (upper obstruction), gurgling (fluid), snoring (tongue), silence (complete obstruction)',
      'Feel: air movement at mouth/nose, chest rise, tracheal position',
    ],
    actions: [
      'Head tilt, chin lift (no C-spine concern)',
      'Jaw thrust (C-spine concern)',
      'Suction secretions',
      'Airway adjuncts: OPA or NPA',
      'Call for anaesthetic help if severe',
    ],
    redFlags: 'Stridor · Complete silence · Cyanosis · Inability to speak · Drooling (can\'t swallow)',
    pearl: 'In anaphylaxis, airway swelling can progress rapidly. Give IM adrenaline early and call for help.',
  },
  {
    letter: 'B',
    title: 'Breathing',
    subtitle: 'Is breathing adequate?',
    assess: [
      'Respiratory rate (count for 60 seconds)',
      'SpO₂ — target 94–98%; 88–92% in COPD',
      'Work of breathing: nasal flaring, tracheal tug, intercostal/subcostal recession, accessory muscles, see-saw breathing, tripod position',
      'Auscultate: air entry, wheeze (bronchospasm), crackles (fluid/infection), silent areas (pneumothorax?)',
      'Chest expansion: equal on both sides?',
    ],
    actions: [
      'Give oxygen if SpO₂ <94% (or <88% COPD)',
      'Sit patient upright if conscious',
      'Nebulisers if bronchospasm',
      'Consider tension pneumothorax if tracheal deviation',
    ],
    redFlags: 'RR <8 or >30 · SpO₂ <92% on O₂ · Silent chest · Tracheal deviation · Exhaustion/can\'t speak',
    pearl: 'Respiratory rate is often the first vital sign to change in deterioration. A "silent chest" in asthma is a pre-arrest sign — escalate immediately.',
  },
  {
    letter: 'C',
    title: 'Circulation',
    subtitle: 'Is circulation adequate?',
    assess: [
      'Heart rate (rate, rhythm)',
      'Blood pressure',
      'Capillary refill time (<2 seconds normal)',
      'Skin colour (pale, mottled?), temperature (core vs peripheries)',
      'JVP (raised or flat?)',
      'Visible bleeding',
      'Urine output',
    ],
    actions: [
      'IV access (×2 large bore if shocked)',
      'Take bloods: FBC, U&E, clotting, crossmatch',
      'Fluid bolus if hypovolaemic (250ml, reassess — 10ml/kg in children)',
      'Control bleeding with direct pressure',
      'ECG if arrhythmia suspected',
    ],
    redFlags: 'Systolic BP <90 · HR >130 or <40 · CRT >4 seconds · Oliguria · Altered consciousness',
    pearl: 'Tachycardia is often the FIRST sign of shock. Young patients compensate well and can look fine until they suddenly crash. Don\'t forget hidden bleeding sources: chest, abdomen, pelvis, long bones.',
  },
  {
    letter: 'D',
    title: 'Disability',
    subtitle: 'What is their neurological status?',
    assess: [
      'AVPU: Alert · responds to Voice · responds to Pain · Unresponsive',
      'GCS if more detailed assessment needed (use AVPU in young children)',
      'Pupils: size, equal, reactive',
      'Blood glucose — always check',
      'Limb movement/focal weakness',
      'Review drug chart: opioids, sedatives, hypoglycaemics',
    ],
    actions: [
      'Check blood glucose NOW',
      'Treat hypoglycaemia if <4 mmol/L',
      'Consider naloxone if opioid toxicity suspected',
      'Recovery position if unconscious with patent airway',
      'Consider CT head if new focal neurology',
    ],
    redFlags: 'GCS ≤8 (airway at risk) · Unequal/unreactive pupils · New focal weakness · BM <3 · Prolonged seizure',
    pearl: 'ALWAYS check glucose in altered consciousness — it\'s reversible. GCS ≤8 means the patient cannot protect their airway. Opioid overdose: pinpoint pupils + low RR → give naloxone.',
  },
  {
    letter: 'E',
    title: 'Exposure',
    subtitle: 'What else could be going on?',
    assess: [
      'Fully expose (maintain dignity + warmth)',
      'Check for rashes: petechial, purpuric, urticarial',
      'Wounds, surgical sites, drains, lines',
      'Check the back (log roll if needed)',
      'Pressure areas',
      'Temperature',
    ],
    actions: [
      'Keep patient warm (prevent hypothermia)',
      'Document all findings',
      'Review observation charts, notes, drug chart',
      'Escalate using SBAR',
    ],
    redFlags: 'Non-blanching rash · Temp <35°C or >40°C · Rapidly spreading redness · Signs of abuse',
    pearl: 'Petechial rash + fever = sepsis (possibly meningococcal) until proven otherwise. Don\'t forget to check the back — log roll if trauma suspected.',
  },
];

const quizQuestions = [
  { question: 'What is the FIRST thing you should assess in the A-E approach?', options: ['Breathing rate', 'Airway patency', 'Blood pressure', 'Level of consciousness'], answer: 1, explanation: 'Always start with Airway. A patient who is talking has a patent airway, but always assess systematically.' },
  { question: 'A patient has a respiratory rate of 28 and SpO₂ of 88% on room air. Which assessment is this?', options: ['A – Airway', 'B – Breathing', 'C – Circulation', 'D – Disability'], answer: 1, explanation: 'Respiratory rate and oxygen saturation are key Breathing (B) assessments. This patient needs oxygen.' },
  { question: 'What does AVPU stand for?', options: ['Alert, Verbal, Pain, Unconscious', 'Airway, Ventilation, Pulse, Urine', 'Alert, Voice, Pain, Unresponsive', 'Assess, Verify, Perform, Update'], answer: 2, explanation: 'AVPU: Alert, responds to Voice, responds to Pain, Unresponsive.' },
  { question: 'A capillary refill time of 4 seconds indicates:', options: ['Normal perfusion', 'Possible poor peripheral perfusion', 'Excellent circulation', 'Need for immediate CPR'], answer: 1, explanation: 'Normal CRT is <2 seconds. A CRT of 4 seconds suggests poor peripheral perfusion and possible circulatory compromise.' },
  { question: 'In the E (Exposure) assessment, which is a red flag finding?', options: ['Warm skin', 'A surgical scar', 'Petechial/purpuric rash', 'Mild bruising'], answer: 2, explanation: 'A petechial or purpuric rash is a red flag — it can indicate meningococcal septicaemia or other serious conditions requiring urgent treatment.' },
  { question: 'When should you call for help during an A-E assessment?', options: ['Only after completing all 5 assessments', 'After the E assessment', 'Early if any concerns are found', 'Only if the patient becomes unconscious'], answer: 2, explanation: 'Call for help EARLY if you have any concerns. Treat problems as you find them — don\'t wait until you\'ve completed the whole assessment.' },
];

export default function AEAssessmentPage() {
  return (
    <EditorialLayout
      kicker="Children's Nursing · Free Resource"
      title="A-E Assessment Framework"
      standfirst="The systematic approach to assessing acutely unwell patients — assess in order, treat as you find, and call for help early."
      byline="The Nurse Lab · Children's Hub"
    >

      {/* Golden rules */}
      <div className="ed-card" style={{ marginBottom: '32px' }}>
        <p className="ed-card-title">The Golden Rules</p>
        <div className="ed-grid-2">
          {[
            { num: '1', title: 'Treat as you find', desc: 'Don\'t wait until you\'ve finished — fix problems immediately' },
            { num: '2', title: 'Call for help early', desc: 'If concerned at any point, get senior support' },
            { num: '3', title: 'Reassess constantly', desc: 'After any intervention, go back to A' },
            { num: '4', title: 'Use SBAR to escalate', desc: 'Situation, Background, Assessment, Recommendation' },
          ].map(r => (
            <div key={r.num} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontStyle: 'italic', color: '#c8c4be', lineHeight: 1 }}>{r.num}</span>
              <div>
                <p style={{ fontWeight: 500, fontSize: '13px', color: '#1A1815', marginBottom: '2px' }}>{r.title}</p>
                <p style={{ fontSize: '12px', color: '#5A5750', fontWeight: 300 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ABCDE steps */}
      {steps.map(step => (
        <div key={step.letter} className="ed-step-row">
          <div className="ed-step-sidebar">
            <span className="ed-step-numeral" style={{ fontSize: '36px' }}>{step.letter}</span>
          </div>
          <div className="ed-step-content">
            <h2 className="ed-step-heading">{step.title}</h2>
            <p className="ed-step-sub">{step.subtitle}</p>

            <div className="ed-grid-2" style={{ marginBottom: '12px' }}>
              <div className="ed-cell">
                <p className="ed-cell-title">Assess</p>
                <ul className="ed-list">
                  {step.assess.map(a => <li key={a}>{a}</li>)}
                </ul>
              </div>
              <div className="ed-cell">
                <p className="ed-cell-title">Actions</p>
                <ul className="ed-list">
                  {step.actions.map(a => <li key={a}>{a}</li>)}
                </ul>
              </div>
            </div>

            <div className="ed-info" style={{ marginBottom: '10px' }}>
              <p className="ed-info-label">Red flags</p>
              <p>{step.redFlags}</p>
            </div>

            <div className="ed-pearl">
              <p className="ed-pearl-label">Clinical pearl</p>
              <p>{step.pearl}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Paediatric differences */}
      <h2 className="ed-section-title">Paediatric Differences</h2>
      <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Airway & Breathing</p>
          <ul className="ed-list">
            <li>Larger head, shorter neck</li>
            <li>Tongue relatively larger</li>
            <li>Narrowest point = cricoid (not vocal cords)</li>
            <li>Obligate nose breathers under 6 months</li>
            <li>Higher metabolic rate → faster desaturation</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Circulation</p>
          <ul className="ed-list">
            <li>Cardiac output is heart-rate dependent</li>
            <li>Compensate well then crash suddenly</li>
            <li>Hypotension is a LATE sign of shock</li>
            <li>CRT, colour, behaviour = early signs</li>
            <li>Fluid bolus = 10ml/kg (not 250ml)</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Disability</p>
          <ul className="ed-list">
            <li>Use AVPU (GCS harder in young children)</li>
            <li>Fontanelle: bulging (↑ ICP) or sunken (dehydration)</li>
            <li>Hypoglycaemia more common</li>
            <li>Febrile convulsions more common</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">What makes children different</p>
          <ul className="ed-list">
            <li>Floppy, not responding to parents</li>
            <li>Weak or absent cry</li>
            <li>Mottled or grey skin colour</li>
            <li>Grunting (sign of respiratory distress)</li>
            <li>Non-blanching rash</li>
          </ul>
        </div>
      </div>

      <div className="ed-pearl" style={{ marginBottom: '32px' }}>
        <p className="ed-pearl-label">Trust your instincts</p>
        <p>A quiet, still child who doesn't react to their parent is very concerning. If a child "doesn't look right" — escalate early.</p>
      </div>

      {/* After assessment */}
      <h2 className="ed-section-title">After the A-E Assessment</h2>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Always do</p>
          <ul className="ed-list">
            <li>Reassess from A after any intervention</li>
            <li>Calculate NEWS2 (adults) or PEWS (paediatrics)</li>
            <li>Escalate concerns using SBAR</li>
            <li>Document all findings and actions</li>
            <li>Increase monitoring frequency if unwell</li>
            <li>Review again in 15–30 minutes</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">SBAR escalation</p>
          <ul className="ed-list">
            <li><strong>S</strong>ituation — what is happening now?</li>
            <li><strong>B</strong>ackground — relevant history</li>
            <li><strong>A</strong>ssessment — what do you think is wrong?</li>
            <li><strong>R</strong>ecommendation — what do you need?</li>
          </ul>
        </div>
      </div>

      <p className="ed-redflags-label">A-E red flags — always escalate immediately</p>
      <div className="ed-redflags" style={{ marginBottom: '40px' }}>
        {[
          'Stridor or complete airway silence',
          'SpO₂ <92% on oxygen',
          'Silent chest in asthma',
          'Systolic BP <90 mmHg',
          'CRT >4 seconds',
          'GCS ≤8',
          'Non-blanching rash + fever',
          'Floppy child not responding to parents',
        ].map(f => <span key={f} className="ed-red-pill">{f}</span>)}
      </div>

      <SelfTestQuiz title="Test Yourself: A-E Assessment" questions={quizQuestions} />

    </EditorialLayout>
  );
}
