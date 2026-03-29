'use client';

import EditorialLayout from '@/components/EditorialLayout';

const rights = [
  {
    number: 1,
    title: 'Right Patient',
    description: 'Confirm the patient\'s identity using at least two identifiers (e.g., name, date of birth, hospital number).',
    tip: 'Always check the wristband and ask the patient to state their name and DOB.',
    paediatric: 'Always check the child\'s wristband yourself — even if a parent confirms. Ask the parent to state the child\'s full name AND date of birth. If no wristband, get one fitted before giving medications.',
  },
  {
    number: 2,
    title: 'Right Medication',
    description: 'Verify the medication name matches the prescription exactly. Check for allergies and contraindications.',
    tip: 'Read the label three times: when picking up, preparing, and administering.',
    paediatric: 'Always check the CONCENTRATION as well as the drug name with liquids. Paediatric formulations often have different strengths to adult versions.',
  },
  {
    number: 3,
    title: 'Right Route',
    description: 'Administer via the correct route as prescribed (oral, IV, IM, SC, topical, etc.).',
    tip: 'Some medications look similar but have different routes — always check the prescription.',
    paediatric: 'A toddler refusing oral liquid does not mean you can give a suppository instead. Different routes need a new prescription. Contact the prescriber.',
  },
  {
    number: 4,
    title: 'Right Dose',
    description: 'Ensure the dose is correct for the patient. Double-check calculations, especially for paediatrics.',
    tip: 'If in doubt, always get a second checker. Never guess doses.',
    formula: 'Dose = (What you need ÷ What you have) × Volume',
    paediatric: 'Paediatric doses are weight-based and easy to miscalculate. Always double-check calculations with another registered professional.',
  },
  {
    number: 5,
    title: 'Right Time',
    description: 'Give the medication at the correct time and frequency as prescribed.',
    tip: 'Know the reason for timing (e.g., before food, at specific intervals).',
    paediatric: 'A baby needing 6-hourly antibiotics — skipping or changing intervals affects blood levels and can cause treatment failure or antibiotic resistance.',
  },
  {
    number: 6,
    title: 'Right Documentation',
    description: 'Document administration immediately after giving. Never pre-sign.',
    tip: 'If it\'s not documented, it didn\'t happen. Include time, dose, route, and your signature.',
    paediatric: 'Document IMMEDIATELY after giving each medication. If the child vomits within 30 minutes, document this too — they may need the dose repeated.',
  },
  {
    number: 7,
    title: 'Right Reason',
    description: 'Understand why the patient is receiving this medication. Does it align with their condition?',
    tip: 'If the prescription doesn\'t make sense for the patient\'s diagnosis, question it before administering.',
    paediatric: 'Evidence shows salbutamol doesn\'t help bronchiolitis in young children. Query the prescription — cite NICE guidelines when necessary.',
  },
  {
    number: 8,
    title: 'Right Form',
    description: 'Ensure the medication is in the correct form (tablet, liquid, injection, patch, etc.).',
    tip: 'Some patients can\'t swallow tablets — check if an alternative form is needed.',
    paediatric: 'Request prednisolone soluble tablets which dissolve in water — designed for children. Never crush medications without checking it\'s safe to do so.',
  },
  {
    number: 9,
    title: 'Right Response',
    description: 'Monitor the patient for expected therapeutic effects and potential adverse reactions.',
    tip: 'Know what to look for and when to escalate if the response isn\'t as expected.',
    paediatric: 'Signs of allergic reaction (itchy rash, lip swelling) within 30 minutes of first dose — STOP the antibiotic, call for help, monitor airway, breathing, circulation.',
  },
];

export default function NineRightsMedicationPage() {
  return (
    <EditorialLayout
      kicker="Medication Safety · Free Resource"
      title="9 Rights of Medication Administration"
      standfirst="The essential safety checks before giving any medication — memorise these for OSCEs and apply them on every single placement, every time."
      byline="Revision Foundations · Children's Hub"
    >

      <div className="ed-pearl" style={{ marginBottom: '40px' }}>
        <p className="ed-pearl-label">Why this matters</p>
        <p>Medication errors are one of the most common causes of patient harm. Following the 9 Rights every single time creates a safety habit that protects your patients and your registration. In OSCEs, examiners specifically watch for these checks — say each one out loud as you do it.</p>
      </div>

      {rights.map((right) => (
        <div key={right.number} className="ed-step-row">
          <div className="ed-step-sidebar">
            <span className="ed-step-numeral">{right.number}</span>
          </div>
          <div className="ed-step-content">
            <h2 className="ed-step-heading">{right.title}</h2>
            <p className="ed-step-sub">{right.description}</p>

            <div className="ed-pearl" style={{ marginBottom: '12px' }}>
              <p className="ed-pearl-label">Tip</p>
              <p>{right.tip}</p>
            </div>

            {right.formula && (
              <div className="ed-mono" style={{ marginBottom: '12px' }}>
                {right.formula}
              </div>
            )}

            <div className="ed-info">
              <p className="ed-info-label">Paediatric consideration</p>
              <p>{right.paediatric}</p>
            </div>
          </div>
        </div>
      ))}

      {/* OSCE tip */}
      <div className="ed-pearl" style={{ marginTop: '16px' }}>
        <p className="ed-pearl-label">OSCE station tip</p>
        <p>In medication administration OSCEs, verbalise every check: "I'm checking the patient's wristband — their name is..." Examiners can only mark what they see and hear. Talk through each right even if you're doing it mentally.</p>
      </div>

      {/* Quick memory aid */}
      <h2 className="ed-section-title">Quick Memory Aid</h2>
      <div className="ed-mono">
        Patient → Drug → Route → Dose → Time → Document → Reason → Form → Response
      </div>

      <p className="ed-redflags-label" style={{ marginTop: '24px' }}>Never do this with medications</p>
      <div className="ed-redflags">
        {[
          'Pre-sign the MAR chart',
          'Give without checking wristband',
          'Change route without a new prescription',
          'Guess a dose calculation',
          'Give without knowing the indication',
          'Skip documentation after giving',
        ].map(flag => <span key={flag} className="ed-red-pill">{flag}</span>)}
      </div>

    </EditorialLayout>
  );
}
