'use client';

import EditorialLayout from '@/components/EditorialLayout';
import SelfTestQuiz from '@/components/SelfTestQuiz';

const vitalSignsData = [
  { ageGroup: 'Newborn', ageRange: '0–28 days', hr: '100–160', rr: '30–60', systolic: '60–90', capRefill: '<3 sec', notes: 'Irregular breathing normal. Periodic breathing (pauses up to 20s) expected.' },
  { ageGroup: 'Infant', ageRange: '1–12 months', hr: '100–150', rr: '25–50', systolic: '70–100', capRefill: '<2 sec', notes: 'Obligate nose breathers — nasal congestion can cause significant distress.' },
  { ageGroup: 'Toddler', ageRange: '1–3 years', hr: '90–140', rr: '20–40', systolic: '80–110', capRefill: '<2 sec', notes: 'Fear of strangers common — observe before touching. Use parents for reassurance.' },
  { ageGroup: 'Pre-school', ageRange: '3–5 years', hr: '80–120', rr: '20–30', systolic: '85–110', capRefill: '<2 sec', notes: 'May cooperate with distraction. Explain procedures in simple terms.' },
  { ageGroup: 'School-age', ageRange: '6–11 years', hr: '70–110', rr: '16–24', systolic: '90–120', capRefill: '<2 sec', notes: 'Can understand explanations. Involve them in their care. Privacy becoming important.' },
  { ageGroup: 'Adolescent', ageRange: '12–18 years', hr: '60–100', rr: '12–20', systolic: '100–135', capRefill: '<2 sec', notes: 'Approaching adult values. Consider confidentiality — offer time alone.' },
];

const quizQuestions = [
  { question: 'What is the normal heart rate range for a 6-month-old infant?', options: ['60–100 bpm', '80–120 bpm', '100–150 bpm', '120–180 bpm'], answer: 2, explanation: 'Infants (1–12 months) have a normal heart rate of 100–150 bpm. Their hearts are smaller and need to beat faster to meet metabolic demands.' },
  { question: 'A 2-year-old has a respiratory rate of 45. Is this normal?', options: ['Yes, this is within normal range', 'No, this is tachypnoea', 'No, this is bradypnoea', 'Cannot determine'], answer: 0, explanation: 'Toddlers (1–3 years) have a normal RR of 20–40. A rate of 45 is slightly elevated — continue monitoring and assess other signs.' },
  { question: 'What capillary refill time is considered abnormal in children?', options: ['>1 second', '>2 seconds', '>5 seconds', '>10 seconds'], answer: 1, explanation: 'Capillary refill >2 seconds (>3 seconds in newborns) is abnormal and may indicate poor peripheral perfusion or shock.' },
  { question: 'A newborn has a respiratory rate of 55 with occasional pauses of 15 seconds. What should you do?', options: ['Immediate resuscitation', 'This is normal periodic breathing', 'Start oxygen therapy', 'Call 2222'], answer: 1, explanation: 'Newborns can have periodic breathing with pauses up to 20 seconds. RR 30–60 is normal. Only concerning if pauses exceed 20s or accompanied by colour change or bradycardia.' },
  { question: 'Which vital sign is often the FIRST to change in a deteriorating child?', options: ['Blood pressure', 'Heart rate', 'Temperature', 'Respiratory rate'], answer: 3, explanation: 'Respiratory rate is often the first vital sign to change in a deteriorating child. Children compensate well initially — hypotension is a LATE sign of shock.' },
  { question: 'What is a normal systolic BP for a 4-year-old?', options: ['60–80 mmHg', '85–110 mmHg', '110–130 mmHg', '130–150 mmHg'], answer: 1, explanation: 'Pre-school children (3–5 years) have a normal systolic BP of 85–110 mmHg. Hypotension is a late and serious sign in children.' },
];

export default function PaedsVitalSignsCheatSheet() {
  return (
    <EditorialLayout
      kicker="Children's Nursing · Free Resource"
      title="Paediatric Vital Signs Cheat Sheet"
      standfirst="Normal ranges by age group — from newborn to adolescent. Essential for OSCEs, placement, and recognising the deteriorating child."
      byline="Revision Foundations · Children's Hub"
    >

      {/* Key principles */}
      <div className="ed-card" style={{ marginBottom: '32px' }}>
        <p className="ed-card-title">Key principles before you look at the numbers</p>
        <div className="ed-grid-2">
          {[
            { num: '1', text: 'Respiratory rate is often the FIRST sign to change in a deteriorating child' },
            { num: '2', text: 'Hypotension is a LATE sign — children compensate well until they crash' },
            { num: '3', text: 'Always use age-appropriate cuff size for BP (cuff width = ⅔ upper arm)' },
            { num: '4', text: 'Trends matter more than single readings — compare to baseline' },
          ].map(p => (
            <div key={p.num} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontStyle: 'italic', color: '#c8c4be', lineHeight: 1, flexShrink: 0 }}>{p.num}</span>
              <p style={{ fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.6 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main vitals table */}
      <h2 className="ed-section-title">Normal Ranges by Age</h2>
      <table className="ed-table" style={{ marginBottom: '32px' }}>
        <thead>
          <tr>
            <th>Age group</th>
            <th>Heart rate (bpm)</th>
            <th>Resp rate (/min)</th>
            <th>Systolic BP (mmHg)</th>
            <th>Cap refill</th>
          </tr>
        </thead>
        <tbody>
          {vitalSignsData.map(row => (
            <tr key={row.ageGroup}>
              <td>
                <strong style={{ fontSize: '13px' }}>{row.ageGroup}</strong>
                <br />
                <span style={{ fontSize: '11px', color: '#999' }}>{row.ageRange}</span>
              </td>
              <td className="ed-mono" style={{ fontSize: '13px' }}>{row.hr}</td>
              <td className="ed-mono" style={{ fontSize: '13px' }}>{row.rr}</td>
              <td className="ed-mono" style={{ fontSize: '13px' }}>{row.systolic}</td>
              <td style={{ fontSize: '12px' }}>{row.capRefill}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* O2 sats note */}
      <div className="ed-info" style={{ marginBottom: '32px' }}>
        <p className="ed-info-label">Oxygen saturation</p>
        <p>Normal SpO₂ is 95–100% for all age groups. SpO₂ below 94% warrants assessment and consideration of supplemental oxygen. Temperature is normal at 36.5–37.5°C across all ages.</p>
      </div>

      {/* Notes per age group */}
      <h2 className="ed-section-title">Clinical Notes by Age</h2>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        {vitalSignsData.map(row => (
          <div key={row.ageGroup} className="ed-cell">
            <p className="ed-cell-title">{row.ageGroup} <span style={{ fontWeight: 300, color: '#999' }}>({row.ageRange})</span></p>
            <p>{row.notes}</p>
          </div>
        ))}
      </div>

      {/* Paediatric anatomy differences */}
      <h2 className="ed-section-title">Why Children Are Not Small Adults</h2>
      <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Airway & Breathing</p>
          <ul className="ed-list">
            <li>Larger head, shorter neck — airway positioning different</li>
            <li>Tongue proportionally larger</li>
            <li>Narrowest point = cricoid ring (not vocal cords)</li>
            <li>Obligate nose breathers under 6 months</li>
            <li>Higher metabolic rate → faster desaturation</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Circulation</p>
          <ul className="ed-list">
            <li>Cardiac output is heart-rate dependent</li>
            <li>Compensate well — then crash suddenly</li>
            <li>Hypotension is a LATE and serious sign</li>
            <li>CRT, colour, behaviour are early warning signs</li>
            <li>Fluid bolus = 10 ml/kg (NOT 250 ml)</li>
          </ul>
        </div>
      </div>

      {/* Recognising deterioration */}
      <div className="ed-pearl" style={{ marginBottom: '16px' }}>
        <p className="ed-pearl-label">Recognising early deterioration</p>
        <p>CRT, skin colour, and behavioural changes often come before vital sign changes. A quiet, still child who isn't responding to parents is very concerning — escalate early, trust your instincts.</p>
      </div>

      <p className="ed-redflags-label">Red flags — escalate immediately</p>
      <div className="ed-redflags" style={{ marginBottom: '40px' }}>
        {[
          'Floppy child not responding to parents',
          'Weak or absent cry',
          'Mottled or grey skin colour',
          'Grunting (sign of respiratory distress)',
          'Non-blanching rash',
          'RR or HR outside normal range',
          'CRT >2 seconds (>3 seconds newborn)',
          'SpO₂ <94%',
        ].map(f => <span key={f} className="ed-red-pill">{f}</span>)}
      </div>

      {/* PEWS note */}
      <div className="ed-card" style={{ marginBottom: '40px' }}>
        <p className="ed-card-title">PEWS — Paediatric Early Warning Score</p>
        <p style={{ fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.7 }}>Your trust will have a PEWS (or similar) chart. It scores behaviour, cardiovascular status, and respiratory status. Any score above your trust's threshold triggers escalation. PEWS is most useful when tracked over time — a rising score is more concerning than a single reading.</p>
      </div>

      <SelfTestQuiz title="Test Yourself: Paediatric Vital Signs" questions={quizQuestions} />

    </EditorialLayout>
  );
}
