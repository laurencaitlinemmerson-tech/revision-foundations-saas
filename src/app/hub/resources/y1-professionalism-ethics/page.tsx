'use client';

import EditorialLayout from '@/components/EditorialLayout';

export default function Y1ProfessionalismEthicsPage() {
  return (
    <EditorialLayout
      kicker="Year 1 Essentials · Free Resource"
      title="Professionalism & Ethics"
      standfirst="The professional values and ethical principles that underpin safe, compassionate nursing practice — from the NMC Code to the Mental Capacity Act."
      byline="Revision Foundations · Children's Hub"
    >

      {/* NMC Code */}
      <h2 className="ed-section-title">The NMC Code</h2>
      <p style={{ fontSize: '14px', color: '#5A5750', fontWeight: 300, lineHeight: 1.7, marginBottom: '20px' }}>
        The NMC Code sets out the professional standards all nurses and nursing students must uphold. It has four key themes:
      </p>
      <div className="ed-grid-4" style={{ marginBottom: '32px' }}>
        {[
          { num: '1', title: 'Prioritise people', desc: 'Put patients first, treat with kindness and respect' },
          { num: '2', title: 'Practise effectively', desc: 'Assess, plan, deliver, and evaluate care competently' },
          { num: '3', title: 'Preserve safety', desc: 'Act without delay if patient safety is at risk' },
          { num: '4', title: 'Promote professionalism & trust', desc: 'Uphold the reputation of the profession' },
        ].map((theme) => (
          <div key={theme.num} className="ed-grid-4-cell">
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontStyle: 'italic', color: '#c8c4be', lineHeight: 1, marginBottom: '6px' }}>{theme.num}</p>
            <p className="ed-grid-4-title">{theme.title}</p>
            <p style={{ fontSize: '12px', color: '#5A5750', fontWeight: 300, lineHeight: 1.5 }}>{theme.desc}</p>
          </div>
        ))}
      </div>

      {/* Four Principles */}
      <h2 className="ed-section-title">The Four Ethical Principles</h2>
      <p style={{ fontSize: '14px', color: '#5A5750', fontWeight: 300, lineHeight: 1.7, marginBottom: '20px' }}>
        Beauchamp & Childress — the foundation of ethical decision-making in healthcare:
      </p>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        {[
          { principle: 'Autonomy', desc: 'Respect the patient\'s right to make their own decisions.', practice: ['Provide information for informed decisions', 'Respect refusal of treatment', 'Gain valid consent before procedures'] },
          { principle: 'Beneficence', desc: 'Act in the best interest of the patient; do good.', practice: ['Provide evidence-based care', 'Advocate for patient needs', 'Consider overall wellbeing'] },
          { principle: 'Non-maleficence', desc: 'Do no harm; avoid causing injury or suffering.', practice: ['Check, check, and check again', 'Know your limitations', 'Report concerns and errors'] },
          { principle: 'Justice', desc: 'Treat all patients fairly and equitably.', practice: ['No discrimination on any grounds', 'Fair allocation of resources', 'Challenge unfair practices'] },
        ].map((item) => (
          <div key={item.principle} className="ed-cell">
            <p className="ed-cell-title">{item.principle}</p>
            <p style={{ fontSize: '13px', color: '#5A5750', fontWeight: 300, marginBottom: '8px' }}>{item.desc}</p>
            <ul className="ed-list">
              {item.practice.map(p => <li key={p}>{p}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* Consent */}
      <h2 className="ed-section-title">Consent</h2>
      <div className="ed-grid-3" style={{ marginBottom: '16px' }}>
        {[
          { title: 'Capacity', desc: 'Patient can understand, retain, weigh information, and communicate their decision' },
          { title: 'Information', desc: 'Risks, benefits, alternatives, and consequences of refusal fully explained' },
          { title: 'Voluntary', desc: 'No coercion or undue pressure from anyone' },
        ].map((req) => (
          <div key={req.title} className="ed-cell">
            <p className="ed-cell-title">{req.title}</p>
            <p>{req.desc}</p>
          </div>
        ))}
      </div>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Types of Consent</p>
          <ul className="ed-list">
            <li><strong>Implied:</strong> Holding out arm for BP check</li>
            <li><strong>Verbal:</strong> Agreeing to take medication</li>
            <li><strong>Written:</strong> Surgery, procedures with significant risk</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">When Consent May Not Be Needed</p>
          <ul className="ed-list">
            <li>Emergency life-saving treatment (unconscious patient)</li>
            <li>Mental Health Act detainment</li>
            <li>Certain public health emergencies</li>
          </ul>
        </div>
      </div>

      {/* Mental Capacity Act */}
      <h2 className="ed-section-title">Mental Capacity Act 2005</h2>
      <div className="ed-card" style={{ marginBottom: '16px' }}>
        <p className="ed-card-title">5 Statutory Principles</p>
        <ol style={{ paddingLeft: '16px', fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.8 }}>
          <li><strong>Assume capacity</strong> — every adult has capacity unless proven otherwise</li>
          <li><strong>Support decision-making</strong> — help the person decide if possible</li>
          <li><strong>Unwise decisions are allowed</strong> — a bad decision doesn't mean lack of capacity</li>
          <li><strong>Best interests</strong> — decisions for those lacking capacity must be in their best interests</li>
          <li><strong>Least restrictive</strong> — choose the option that restricts rights/freedom the least</li>
        </ol>
      </div>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Stage 1 — Impairment</p>
          <p>Is there an impairment of, or disturbance in, the functioning of the mind or brain?</p>
          <p style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', marginTop: '6px' }}>E.g., dementia, delirium, learning disability, intoxication, brain injury</p>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Stage 2 — Functional Test</p>
          <p>Can the person:</p>
          <ul className="ed-list">
            <li><strong>Understand</strong> the information?</li>
            <li><strong>Retain</strong> it long enough to decide?</li>
            <li><strong>Weigh</strong> the information?</li>
            <li><strong>Communicate</strong> their decision?</li>
          </ul>
        </div>
      </div>

      {/* Professionalism */}
      <h2 className="ed-section-title">Professionalism in Practice</h2>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Professional Behaviours</p>
          <ul className="ed-list">
            <li>Punctuality and reliability</li>
            <li>Professional appearance (uniform policy)</li>
            <li>Respectful communication</li>
            <li>Taking responsibility for actions</li>
            <li>Continuous learning and reflection</li>
            <li>Working within scope of practice</li>
            <li>Maintaining professional boundaries</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Professional Boundaries</p>
          <ul className="ed-list">
            <li>No personal relationships with patients</li>
            <li>Don't accept significant gifts</li>
            <li>No social media contact with patients</li>
            <li>Don't share personal problems</li>
            <li>Self-disclosure only if therapeutic</li>
            <li>Refer if personal feelings interfere with care</li>
          </ul>
        </div>
      </div>

      {/* Raising Concerns */}
      <h2 className="ed-section-title">Raising Concerns — Duty of Candour</h2>
      <div className="ed-card" style={{ marginBottom: '16px' }}>
        <p className="ed-card-title">Steps to Raise a Concern</p>
        <ol style={{ paddingLeft: '16px', fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.8 }}>
          <li>Speak to your mentor/supervisor first if possible</li>
          <li>Use your organisation's raising concerns procedure</li>
          <li>Document your concerns clearly</li>
          <li>If not resolved, escalate to more senior staff</li>
          <li>External bodies: NMC, CQC, or prescribed persons if needed</li>
        </ol>
      </div>
      <div className="ed-info" style={{ marginBottom: '32px' }}>
        <p className="ed-info-label">Whistleblower protection</p>
        <p>The Public Interest Disclosure Act 1998 protects staff who raise genuine concerns in good faith. You should not be penalised for raising safety concerns through proper channels.</p>
      </div>

      {/* Social Media */}
      <h2 className="ed-section-title">Social Media & Digital Professionalism</h2>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        {[
          'Never post identifiable patient information',
          'Don\'t add or accept patients on social media',
          'Don\'t discuss work complaints online',
          'Be mindful that posts reflect on the profession',
          'Use privacy settings appropriately',
          'Don\'t post photos from the workplace',
          'Think before you post — would the NMC approve?',
          'Remember: employers and the NMC can see posts',
        ].map((rule) => (
          <div key={rule} className="ed-cell">
            <p style={{ fontSize: '13px', color: '#5A5750', fontWeight: 300, margin: 0 }}>{rule}</p>
          </div>
        ))}
      </div>

      {/* Newspaper test pearl */}
      <div className="ed-pearl" style={{ marginBottom: '32px' }}>
        <p className="ed-pearl-label">The Newspaper Test</p>
        <p>Before any action, ask yourself: "How would this look on the front page of a newspaper?" If you wouldn't want your actions reported publicly, reconsider. This simple test helps maintain professional standards in everyday practice.</p>
      </div>

      {/* Fitness to Practise red flags */}
      <p className="ed-redflags-label">Fitness to practise — what could get you in trouble</p>
      <div className="ed-redflags">
        {[
          'Dishonesty (falsifying records, plagiarism)',
          'Patient harm through neglect',
          'Breach of confidentiality',
          'Boundary violations',
          'Criminal behaviour',
          'Substance misuse affecting practice',
          'Social media misconduct',
          'Failure to raise safety concerns',
        ].map((flag) => (
          <span key={flag} className="ed-red-pill">{flag}</span>
        ))}
      </div>

    </EditorialLayout>
  );
}
