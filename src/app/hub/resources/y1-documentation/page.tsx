'use client';

import EditorialLayout from '@/components/EditorialLayout';

export default function Y1DocumentationPage() {
  return (
    <EditorialLayout
      kicker="Year 1 Essentials · Free Resource"
      title="Documentation & Record Keeping"
      standfirst="Essential documentation skills for safe, legal, and professional nursing practice. If it isn't documented, it didn't happen."
      byline="Revision Foundations · Children's Hub"
    >

      <div className="ed-pearl" style={{ marginBottom: '40px' }}>
        <p className="ed-pearl-label">Why documentation matters</p>
        <p>Good records provide continuity of care between shifts, legal protection for you and your patient, communication across the MDT, an evidence base for clinical decisions, and they're required by the NMC Code of Conduct.</p>
      </div>

      {/* NMC Standards */}
      <h2 className="ed-section-title">NMC Record Keeping Standards</h2>
      <p style={{ fontSize: '14px', color: '#5A5750', fontWeight: 300, lineHeight: 1.7, marginBottom: '20px' }}>Records must be:</p>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        {[
          { title: 'Clear & Accurate', desc: 'Factual, consistent, and without jargon patients wouldn\'t understand' },
          { title: 'Legible', desc: 'If handwritten, must be readable. Use black ink.' },
          { title: 'Timely', desc: 'Documented as soon as possible after care is given' },
          { title: 'Signed & Dated', desc: 'Full name, designation, date and time on every entry' },
          { title: 'Without Alterations', desc: 'No correction fluid. Single line through errors with signature.' },
          { title: 'Contemporaneous', desc: 'Made at the time of the event, or as soon as practical' },
        ].map((item) => (
          <div key={item.title} className="ed-cell">
            <p className="ed-cell-title">{item.title}</p>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* SBAR */}
      <h2 className="ed-section-title">SBAR — Structured Communication</h2>
      <p style={{ fontSize: '14px', color: '#5A5750', fontWeight: 300, lineHeight: 1.7, marginBottom: '20px' }}>
        Use SBAR for handovers, escalations, and documenting phone calls to doctors:
      </p>
      <div className="ed-grid-4" style={{ marginBottom: '32px' }}>
        {[
          { letter: 'S', word: 'Situation', desc: 'What is happening right now?', eg: '"I\'m calling about Mr Smith in bed 4 who has become acutely short of breath."' },
          { letter: 'B', word: 'Background', desc: 'What is the clinical context?', eg: '"He\'s 78, admitted with COPD exacerbation yesterday, was stable on 2L O2."' },
          { letter: 'A', word: 'Assessment', desc: 'What do you think the problem is?', eg: '"O2 sats 85%, RR 28, NEWS 7 — I\'m concerned he\'s deteriorating."' },
          { letter: 'R', word: 'Recommendation', desc: 'What do you need?', eg: '"I\'d like you to come and review him urgently please."' },
        ].map((item) => (
          <div key={item.letter} className="ed-grid-4-cell">
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontStyle: 'italic', color: '#c8c4be', lineHeight: 1, marginBottom: '6px' }}>{item.letter}</p>
            <p className="ed-grid-4-title">{item.word}</p>
            <p style={{ fontSize: '12px', color: '#5A5750', fontWeight: 300, lineHeight: 1.5, marginBottom: '8px' }}>{item.desc}</p>
            <p style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', lineHeight: 1.5 }}>{item.eg}</p>
          </div>
        ))}
      </div>

      {/* Good vs Bad */}
      <h2 className="ed-section-title">Good vs Poor Documentation</h2>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        <div>
          <p className="ed-redflags-label">Poor documentation</p>
          <div className="ed-card">
            <ul className="ed-list">
              {['"Patient fine"', '"Meds given"', '"Obs done"', '"Pt slept well"', '"Reviewed by Dr"', '"Pain managed"'].map(bad => (
                <li key={bad}>{bad}</li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <p style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#2E7D32', marginBottom: '7px', fontFamily: 'Source Serif 4, serif' }}>Good documentation</p>
          <div className="ed-card">
            <ul className="ed-list">
              {[
                '"Patient reports pain reduced from 7/10 to 3/10 post-analgesia"',
                '"Paracetamol 1g PO administered at 14:30 as prescribed for headache"',
                '"0800 obs: BP 128/76, HR 72, RR 16, SpO2 98% RA, Temp 36.8°C"',
                '"Dr Patel reviewed at 10:15 — plan: continue treatment, repeat bloods tomorrow"',
              ].map(good => (
                <li key={good}>{good}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Correcting Errors */}
      <h2 className="ed-section-title">Correcting Documentation Errors</h2>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Paper Records</p>
          <ol style={{ paddingLeft: '16px', fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.7 }}>
            <li>Draw a <strong>single line</strong> through the error (keep it readable)</li>
            <li>Write <strong>"written in error"</strong> next to it</li>
            <li><strong>Sign and date</strong> the correction</li>
            <li>Write the correct information nearby</li>
          </ol>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Electronic Records</p>
          <ul className="ed-list">
            <li>Use the system's amendment/addendum function</li>
            <li>Never delete — add a note explaining the correction</li>
            <li>Systems create an automatic audit trail</li>
            <li>Follow your Trust's specific policy</li>
          </ul>
        </div>
      </div>

      {/* Confidentiality */}
      <h2 className="ed-section-title">Confidentiality & Data Protection</h2>
      <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Key Rules</p>
          <ul className="ed-list">
            <li>Never share login credentials</li>
            <li>Log out when leaving a computer</li>
            <li>Don't leave records visible/unattended</li>
            <li>Only access records you need for care</li>
            <li>Don't discuss patients in public areas</li>
            <li>Don't take photos of records or patients</li>
            <li>Follow Caldicott Principles</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Caldicott Principles</p>
          <ol style={{ paddingLeft: '16px', fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.7 }}>
            <li>Justify the purpose</li>
            <li>Use only when necessary</li>
            <li>Use minimum necessary</li>
            <li>Access on need-to-know basis</li>
            <li>Everyone must understand their duties</li>
            <li>Comply with the law</li>
            <li>Duty to share can be as important as protecting</li>
          </ol>
        </div>
      </div>

      {/* Timing Reference */}
      <div className="ed-pearl" style={{ marginBottom: '32px' }}>
        <p className="ed-pearl-label">Documentation timing reference</p>
        <p>
          Medication administration — document <em>immediately after giving</em>. Significant events — as soon as safe to do so. Escalations/doctor calls — immediately with time noted. Deteriorating patient — in real-time if possible. Record retention: 8 years for adults, 25 years for children/maternity records.
        </p>
      </div>

      {/* Red flags — documentation don'ts */}
      <p className="ed-redflags-label">Documentation don'ts</p>
      <div className="ed-redflags" style={{ marginBottom: '32px' }}>
        {[
          'Document before care is given',
          'Use correction fluid or erase',
          'Leave blank spaces',
          'Use unprofessional language',
          'Include personal opinions',
          'Copy-paste without checking',
          'Use unapproved abbreviations',
          'Document on behalf of someone else',
        ].map((flag) => (
          <span key={flag} className="ed-red-pill">{flag}</span>
        ))}
      </div>

      {/* When critical */}
      <p className="ed-redflags-label">When documentation is critical</p>
      <div className="ed-redflags">
        {[
          'Patient deterioration',
          'Medication errors',
          'Falls or incidents',
          'Patient complaints',
          'Capacity assessments',
          'Safeguarding concerns',
          'End of life decisions',
        ].map((flag) => (
          <span key={flag} className="ed-red-pill">{flag}</span>
        ))}
      </div>

    </EditorialLayout>
  );
}
