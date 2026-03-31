'use client';

import EditorialLayout from '@/components/EditorialLayout';

export default function PlacementSurvivalPage() {
  return (
    <EditorialLayout
      kicker="Children's Nursing · Free Resource"
      title="Placement Survival Guide"
      standfirst="Everything you need to know to survive and thrive on your nursing placements — from the night before to your final day."
      byline="The Nurse Lab · Children's Hub"
    >

      {/* Before You Go */}
      <h2 className="ed-section-title">Before Placement Starts</h2>
      <div className="ed-grid-2">
        {[
          { item: 'Contact your placement', detail: 'Call or email to confirm start time, location, parking, dress code' },
          { item: 'Prepare your uniform', detail: 'Clean, ironed, appropriate footwear. Check Trust policy on jewellery' },
          { item: 'Gather essentials', detail: 'Pen (black), small notebook, fob watch, ID badge, snacks, water bottle' },
          { item: 'Review patient group', detail: 'Research the speciality — common conditions, procedures, terminology' },
          { item: 'Check your PAD/ePAD', detail: 'Know what competencies you need to achieve' },
          { item: 'Plan your route', detail: 'Do a practice run if possible. Account for traffic/parking' },
        ].map((prep) => (
          <div key={prep.item} className="ed-cell">
            <p className="ed-cell-title">{prep.item}</p>
            <p>{prep.detail}</p>
          </div>
        ))}
      </div>

      {/* First Day */}
      <h2 className="ed-section-title">Your First Day</h2>
      <div className="ed-card">
        <p className="ed-card-title">First Day Checklist</p>
        <ul className="ed-list">
          {[
            { task: 'Arrive 15 minutes early', tip: 'Find where to go, sign in, settle nerves' },
            { task: 'Introduce yourself', tip: '"Hi, I\'m [name], a Year [X] student nurse. This is my first day."' },
            { task: 'Get a tour', tip: 'Fire exits, toilets, staff room, supplies, emergency equipment' },
            { task: 'Meet your mentor/supervisor', tip: 'Discuss learning objectives and how you\'ll work together' },
            { task: 'Write down key info', tip: 'Ward phone number, key contacts, handover times, meal times' },
            { task: 'Observe and absorb', tip: 'First day is for getting oriented — don\'t pressure yourself' },
          ].map((item) => (
            <li key={item.task}>
              <strong>{item.task}</strong> — {item.tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Building Relationships */}
      <h2 className="ed-section-title">Building Relationships</h2>
      <div className="ed-grid-3">
        <div className="ed-cell">
          <p className="ed-cell-title">With Your Mentor</p>
          <ul className="ed-list">
            <li>Be proactive — don't wait to be told</li>
            <li>Ask for feedback regularly</li>
            <li>Share your learning objectives early</li>
            <li>Be honest about what you can/can't do</li>
            <li>Thank them for their time and teaching</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">With the Team</p>
          <ul className="ed-list">
            <li>Learn everyone's names (write them down!)</li>
            <li>Offer help with small tasks</li>
            <li>Be reliable and follow through</li>
            <li>Show enthusiasm and willingness to learn</li>
            <li>Respect all roles — HCAs, cleaners, porters</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">With Patients</p>
          <ul className="ed-list">
            <li>Introduce yourself clearly with your role</li>
            <li>Use their preferred name (ask!)</li>
            <li>Make eye contact and actively listen</li>
            <li>Explain what you're doing and why</li>
            <li>Maintain privacy and dignity always</li>
          </ul>
        </div>
      </div>

      {/* Magic Phrases */}
      <h2 className="ed-section-title">Magic Phrases for Students</h2>
      <div className="ed-grid-2">
        {[
          { phrase: '"Can I help with that?"', when: 'Shows initiative and willingness' },
          { phrase: '"I haven\'t done this before — can you show me?"', when: 'Honest and eager to learn' },
          { phrase: '"I\'m not sure, let me find out"', when: 'Better than guessing' },
          { phrase: '"Can I observe this procedure?"', when: 'Great for learning new skills' },
          { phrase: '"Could you give me some feedback?"', when: 'Shows you want to improve' },
          { phrase: '"Is there anything else I can do?"', when: 'Shows proactivity at quiet times' },
          { phrase: '"Thank you for showing me that"', when: 'Shows appreciation for teaching' },
          { phrase: '"I need to escalate this"', when: 'When you recognise something isn\'t right' },
        ].map((item) => (
          <div key={item.phrase} className="ed-cell">
            <p className="ed-cell-title" style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>{item.phrase}</p>
            <p>{item.when}</p>
          </div>
        ))}
      </div>

      {/* Challenges */}
      <h2 className="ed-section-title">Common Challenges & How to Handle Them</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        {[
          { challenge: 'Feeling like you\'re in the way', solution: 'This is normal. Ask "where would be helpful for me to stand?" Stay close to your mentor. Offer to get supplies or help with small tasks.' },
          { challenge: 'Not knowing what to do', solution: 'Ask. "What would you like me to focus on today?" Use quiet time to review notes, read care plans, or observe documentation.' },
          { challenge: 'Difficult mentor relationship', solution: 'Stay professional. Try to understand their perspective. If serious, speak to your Academic Assessor or placement coordinator early.' },
          { challenge: 'Witnessing poor practice', solution: 'Don\'t copy it. Speak to your mentor/academic if unsure. Remember your duty to report concerns about patient safety.' },
          { challenge: 'Making a mistake', solution: 'Own it immediately. Report it honestly. Learn from it. Everyone makes mistakes — it\'s how you handle them that matters.' },
          { challenge: 'Emotional situations', solution: 'It\'s okay to be affected. Take a moment if needed. Debrief with mentor. Reflect on it. Seek support if struggling.' },
          { challenge: 'Long shifts and exhaustion', solution: 'Prepare food in advance. Stay hydrated. Rest on days off. It gets easier as you adjust.' },
        ].map((item) => (
          <div key={item.challenge} className="ed-card" style={{ marginBottom: 0, padding: '16px 20px' }}>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: 400, color: '#1A1815', marginBottom: '4px' }}>{item.challenge}</p>
            <p style={{ fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{item.solution}</p>
          </div>
        ))}
      </div>

      {/* Red flags */}
      <p className="ed-redflags-label">When to escalate</p>
      <div className="ed-redflags">
        {[
          'Patient safety concern',
          'Bullying or harassment',
          'Witnessed malpractice',
          'You feel unsafe',
          'Mental health struggling',
          'Needlestick injury',
          'Placement breakdown',
        ].map((flag) => (
          <span key={flag} className="ed-red-pill">{flag}</span>
        ))}
      </div>

      {/* Maximising Learning */}
      <h2 className="ed-section-title">Maximising Your Learning</h2>
      <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
        {[
          { strategy: 'Follow a patient\'s full journey', desc: 'Admission to discharge gives big-picture understanding' },
          { strategy: 'Attend MDT meetings & ward rounds', desc: 'See how teams communicate and make decisions' },
          { strategy: 'Ask "why" questions', desc: '"Why do we check that?" "Why is this medication given?"' },
          { strategy: 'Practice skills as often as possible', desc: 'Repetition builds confidence and competence' },
          { strategy: 'Review patient notes', desc: 'Learn the language and how conditions progress' },
          { strategy: 'Use quiet time productively', desc: 'Study, read policies, ask questions about equipment' },
        ].map((item) => (
          <div key={item.strategy} className="ed-cell">
            <p className="ed-cell-title">{item.strategy}</p>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="ed-pearl" style={{ marginBottom: '32px' }}>
        <p className="ed-pearl-label">Reflective Practice</p>
        <p>Use Gibbs' Reflective Cycle: Description → Feelings → Evaluation → Analysis → Conclusion → Action Plan. Writing a brief reflection after significant experiences cements learning and builds your portfolio evidence.</p>
      </div>

      {/* PAD */}
      <h2 className="ed-section-title">PAD / ePAD & Documentation</h2>
      <div className="ed-card">
        <p className="ed-card-title">Staying on Top of Your PAD</p>
        <ul className="ed-list">
          {[
            { tip: 'Review your PAD before each placement', detail: 'Know what proficiencies and skills you need to achieve' },
            { tip: 'Schedule regular meetings with your mentor', detail: 'Weekly is ideal — don\'t leave everything to the end' },
            { tip: 'Document as you go', detail: 'Write up experiences and evidence regularly, not all at once' },
            { tip: 'Be specific in your evidence', detail: 'Use STAR method: Situation, Task, Action, Result' },
            { tip: 'Get feedback in writing', detail: 'Ask your mentor to document observations' },
            { tip: 'Don\'t forge signatures or evidence', detail: 'Academic misconduct has serious consequences' },
          ].map((item) => (
            <li key={item.tip}>
              <strong>{item.tip}</strong> — {item.detail}
            </li>
          ))}
        </ul>
      </div>

      {/* Self-Care */}
      <h2 className="ed-section-title">Self-Care on Placement</h2>
      <div className="ed-grid-2">
        {[
          { area: 'Physical', tips: 'Eat properly, stay hydrated, wear comfy shoes, rest on days off' },
          { area: 'Emotional', tips: 'Debrief after tough shifts, talk to someone, it\'s okay to cry' },
          { area: 'Social', tips: 'Stay connected with friends/family, don\'t isolate yourself' },
          { area: 'Practical', tips: 'Meal prep, sort uniform the night before, plan your commute' },
        ].map((item) => (
          <div key={item.area} className="ed-cell">
            <p className="ed-cell-title">{item.area}</p>
            <p>{item.tips}</p>
          </div>
        ))}
      </div>

      <div className="ed-pearl">
        <p className="ed-pearl-label">Remember</p>
        <p>It's okay to have bad days — they don't define you. Imposter syndrome is normal; most students feel it. Asking for help is a strength, not a weakness. Your university has support services — use them. Every registered nurse was once exactly where you are now.</p>
      </div>

    </EditorialLayout>
  );
}
