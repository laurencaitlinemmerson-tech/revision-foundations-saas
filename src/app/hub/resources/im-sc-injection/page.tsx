'use client';

import EditorialLayout from '@/components/EditorialLayout';

export default function IMSCInjectionPage() {
  return (
    <EditorialLayout
      kicker="Clinical Skills · Children's Nursing"
      title="IM & SC Injections"
      standfirst="A step-by-step guide to intramuscular and subcutaneous injection technique in paediatric patients — site selection, needle choice, technique, and common mistakes."
      byline="Revision Foundations · Children's Hub"
    >
      {/* ── Overview ── */}
      <section style={{ marginBottom: '48px' }}>
        <div className="ed-info" style={{ marginBottom: '24px' }}>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#5A5750', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
            Injections are one of the most common clinical skills you&apos;ll perform on placement. Getting the technique right matters — wrong site, wrong angle, or wrong needle length can cause pain, tissue damage, or poor drug absorption. This guide covers both IM and SC routes with paediatric-specific considerations.
          </p>
        </div>
      </section>

      {/* ── IM vs SC at a glance ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 400, color: '#1A1815', marginBottom: '18px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          IM vs SC at a glance
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          {/* IM column */}
          <div style={{ padding: '18px 20px', borderRight: '0.5px solid rgba(0,0,0,0.1)' }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '12px' }}>Intramuscular (IM)</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                'Into muscle tissue',
                'Angle: 90° to skin',
                'Faster absorption than SC',
                'Larger volumes (up to 1ml in infants, 2ml in children)',
                'Common drugs: vaccines, antibiotics, adrenaline',
              ].map((item, i) => (
                <li key={i} style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#5A5750', lineHeight: 1.6, fontWeight: 300, padding: '3px 0 3px 12px', position: 'relative' as const }}>
                  <span style={{ position: 'absolute' as const, left: 0, color: '#ccc' }}>–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* SC column */}
          <div style={{ padding: '18px 20px' }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '12px' }}>Subcutaneous (SC)</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                'Into fatty tissue beneath the skin',
                'Angle: 45° (or 90° with short needle)',
                'Slower, sustained absorption',
                'Smaller volumes (up to 1ml)',
                'Common drugs: insulin, heparin, some vaccines',
              ].map((item, i) => (
                <li key={i} style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#5A5750', lineHeight: 1.6, fontWeight: 300, padding: '3px 0 3px 12px', position: 'relative' as const }}>
                  <span style={{ position: 'absolute' as const, left: 0, color: '#ccc' }}>–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── IM Injection ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 400, color: '#1A1815', marginBottom: '8px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Intramuscular injection
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', fontStyle: 'italic', color: '#999', marginBottom: '28px' }}>
          Into skeletal muscle for rapid absorption
        </p>

        {/* Site selection */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 400, color: '#1A1815', marginBottom: '14px' }}>
          Site selection — paediatric
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          {[
            {
              site: 'Vastus lateralis',
              age: 'Neonates & infants (preferred)',
              detail: 'Outer middle third of the thigh. Well-developed even in small babies. The go-to site for infant immunisations.',
            },
            {
              site: 'Deltoid',
              age: 'Children > 1 year (if muscle bulk adequate)',
              detail: 'Two finger-widths below the acromion process. Only for small volumes (≤0.5ml in toddlers, ≤1ml in older children).',
            },
            {
              site: 'Ventrogluteal',
              age: 'Older children & adolescents',
              detail: 'Between the anterior superior iliac spine and the iliac crest. Avoids major nerves and vessels. Increasingly recommended over dorsogluteal.',
            },
          ].map((s, i) => (
            <div key={i} style={{ padding: '16px 18px', borderRight: i < 2 ? '0.5px solid rgba(0,0,0,0.1)' : 'none' }}>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '8px' }}>Site {i + 1}</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontStyle: 'italic', color: '#1A1815', marginBottom: '4px' }}>{s.site}</p>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '11px', color: '#B8824A', marginBottom: '8px', fontWeight: 400 }}>{s.age}</p>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#5A5750', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>{s.detail}</p>
            </div>
          ))}
        </div>

        <div className="ed-pearl" style={{ marginBottom: '24px' }}>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#633806', marginBottom: '6px', fontWeight: 400 }}>Clinical pearl</p>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#633806', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
            The dorsogluteal site (upper outer quadrant of the buttock) is no longer recommended in paediatrics — the sciatic nerve is relatively larger in children and the gluteal muscles are underdeveloped until a child has been walking for at least a year.
          </p>
        </div>

        {/* Needle selection */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 400, color: '#1A1815', marginBottom: '14px' }}>
          Needle selection
        </h3>

        <div style={{ border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '0.5px solid rgba(0,0,0,0.1)', padding: '10px 18px' }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa' }}>Patient</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa' }}>Needle gauge</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa' }}>Needle length</p>
          </div>
          {[
            { patient: 'Preterm / neonate', gauge: '25G', length: '16mm (⅝ inch)' },
            { patient: 'Infant (1–12 months)', gauge: '25G', length: '25mm (1 inch)' },
            { patient: 'Toddler / child', gauge: '23–25G', length: '25mm (1 inch)' },
            { patient: 'Adolescent', gauge: '23–25G', length: '25–38mm (1–1.5 inch)' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '10px 18px', borderBottom: i < 3 ? '0.5px solid rgba(0,0,0,0.08)' : 'none' }}>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#2C2A27', fontWeight: 400 }}>{row.patient}</p>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#5A5750', fontWeight: 300 }}>{row.gauge}</p>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#5A5750', fontWeight: 300 }}>{row.length}</p>
            </div>
          ))}
        </div>

        {/* IM Technique */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 400, color: '#1A1815', marginBottom: '14px' }}>
          Step-by-step technique
        </h3>

        <ol style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: '24px' }}>
          {[
            'Check prescription, patient identity, allergies — follow the 9 Rights.',
            'Gather equipment: correct drug, appropriate needle and syringe, alcohol swab, sharps bin, cotton wool or gauze.',
            'Explain the procedure to the child (age-appropriately) and parent/carer. Gain consent.',
            'Perform hand hygiene. Put on gloves if indicated by local policy.',
            'Select and expose the injection site. Landmark carefully.',
            'Clean the site with an alcohol swab if required by policy. Allow to dry for 30 seconds.',
            'Hold the syringe like a dart. Spread the skin taut (or bunch the muscle in small infants).',
            'Insert the needle at 90° in one smooth, swift motion.',
            'Aspirate is no longer routinely recommended for IM injections (except dorsogluteal, which you shouldn\'t be using in paeds anyway).',
            'Inject slowly and steadily — approximately 1ml per 10 seconds.',
            'Withdraw the needle swiftly at the same angle. Apply gentle pressure with gauze.',
            'Do not recap the needle. Dispose immediately into the sharps bin.',
            'Document: drug, dose, route, site, time, batch number, expiry, and who administered.',
          ].map((step, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', padding: '10px 0', borderBottom: i < 12 ? '0.5px solid rgba(0,0,0,0.06)' : 'none' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontStyle: 'italic', color: '#ccc' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#2C2A27', lineHeight: 1.6, fontWeight: 300 }}>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── SC Injection ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 400, color: '#1A1815', marginBottom: '8px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Subcutaneous injection
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', fontStyle: 'italic', color: '#999', marginBottom: '28px' }}>
          Into the fatty layer between skin and muscle
        </p>

        {/* SC Sites */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 400, color: '#1A1815', marginBottom: '14px' }}>
          Site selection
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          {[
            { site: 'Outer upper arm', note: 'Posterior aspect — good for vaccines' },
            { site: 'Anterior thigh', note: 'Middle third — common for insulin in children' },
            { site: 'Abdomen', note: 'Avoid 5cm around the umbilicus — used for heparin/insulin' },
            { site: 'Upper buttock', note: 'Above the gluteal fold — good fat pad in most children' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '14px 16px', borderRight: i < 3 ? '0.5px solid rgba(0,0,0,0.1)' : 'none' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontStyle: 'italic', color: '#1A1815', marginBottom: '4px' }}>{s.site}</p>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#5A5750', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>{s.note}</p>
            </div>
          ))}
        </div>

        {/* SC Technique */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 400, color: '#1A1815', marginBottom: '14px' }}>
          Technique differences from IM
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ border: '0.5px solid rgba(0,0,0,0.1)', padding: '18px 20px' }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '10px' }}>Angle</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#2C2A27', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
              Insert at <strong style={{ fontWeight: 600 }}>45°</strong> for standard needles. If using a short needle (e.g. insulin pen needle), 90° is acceptable. The goal is to stay in the subcutaneous fat — not reach muscle.
            </p>
          </div>
          <div style={{ border: '0.5px solid rgba(0,0,0,0.1)', padding: '18px 20px' }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '10px' }}>Skin pinch</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#2C2A27', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
              <strong style={{ fontWeight: 600 }}>Pinch up</strong> a fold of skin and fat between your thumb and forefinger. This lifts the subcutaneous tissue away from the muscle. Hold the pinch throughout the injection. Do not aspirate.
            </p>
          </div>
        </div>

        <div style={{ border: '0.5px solid rgba(0,0,0,0.1)', padding: '18px 20px', marginBottom: '24px' }}>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '10px' }}>Needle choice</p>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#2C2A27', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
            Use a <strong style={{ fontWeight: 600 }}>25–27G</strong> needle, <strong style={{ fontWeight: 600 }}>16mm (⅝ inch)</strong> length. Orange needle cap is typically 25G 16mm — the standard SC needle in most trusts.
          </p>
        </div>
      </section>

      {/* ── Site rotation ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 400, color: '#1A1815', marginBottom: '14px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Site rotation
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#5A5750', lineHeight: 1.7, fontWeight: 300, marginBottom: '16px' }}>
          For children having repeated injections (insulin, growth hormone, heparin), site rotation is essential to prevent lipohypertrophy — hard lumps of fatty tissue that impair absorption.
        </p>
        <div className="ed-pearl">
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#633806', marginBottom: '6px', fontWeight: 400 }}>Clinical pearl</p>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#633806', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
            Rotate within the same anatomical region (e.g. different spots on the abdomen) rather than jumping between regions each time — absorption rates differ between sites, so consistency within a region gives more predictable drug levels. Leave at least 2.5cm between injection points.
          </p>
        </div>
      </section>

      {/* ── Red flags ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 400, color: '#1A1815', marginBottom: '14px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Red flags &amp; complications
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginBottom: '18px' }}>
          {[
            'Abscess at injection site',
            'Nerve damage (foot drop / numbness)',
            'Accidental IV injection',
            'Tissue necrosis',
            'Lipohypertrophy (repeated SC)',
            'Anaphylaxis',
          ].map((flag) => (
            <span key={flag} style={{ fontFamily: "'Source Serif 4', serif", fontSize: '11px', background: '#FCEBEB', color: '#A32D2D', padding: '3px 11px', borderRadius: '2px', fontWeight: 300 }}>
              {flag}
            </span>
          ))}
        </div>

        <div className="ed-info">
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#5A5750', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
            After administering any injection, monitor the child for at least 15 minutes if it&apos;s their first dose or a known allergen risk. Always have adrenaline (1:1000) available when giving vaccines or IM medications with anaphylaxis risk.
          </p>
        </div>
      </section>

      {/* ── Distraction techniques ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 400, color: '#1A1815', marginBottom: '14px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Pain minimisation in paeds
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#5A5750', lineHeight: 1.7, fontWeight: 300, marginBottom: '16px' }}>
          Children are not small adults — managing their pain and anxiety around injections is a core part of the skill, not an afterthought.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { title: 'Topical anaesthetic', text: 'Apply EMLA or Ametop cream 30–60 minutes before if planned. Not always practical for emergency or routine vaccines.' },
            { title: 'Distraction', text: 'Bubbles, counting games, videos, or talking to the parent. Distraction is evidence-based and genuinely effective.' },
            { title: 'Positioning', text: 'Cuddle hold (child on parent\'s lap facing into their chest) gives comfort and stabilises the limb. Avoid pinning the child down.' },
            { title: 'Sucrose for neonates', text: 'Oral sucrose solution (24%) given 2 minutes before the procedure reduces pain response in neonates. Use with non-nutritive sucking.' },
          ].map((item) => (
            <div key={item.title} style={{ border: '0.5px solid rgba(0,0,0,0.1)', padding: '16px 18px' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontStyle: 'italic', color: '#1A1815', marginBottom: '6px' }}>{item.title}</p>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#5A5750', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OSCE tips ── */}
      <section style={{ marginBottom: '0' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 400, color: '#1A1815', marginBottom: '14px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          OSCE station tips
        </h2>

        <div className="ed-pearl">
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#633806', marginBottom: '6px', fontWeight: 400 }}>Exam pearl</p>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#633806', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
            Examiners want to see: correct site identification with landmarking (not just pointing), appropriate needle selection with rationale, infection control throughout, consent and age-appropriate explanation, disposal into sharps bin without recapping, and accurate documentation. The most commonly lost marks are for skipping hand hygiene, not checking allergies, and recapping the needle.
          </p>
        </div>
      </section>
    </EditorialLayout>
  );
}
