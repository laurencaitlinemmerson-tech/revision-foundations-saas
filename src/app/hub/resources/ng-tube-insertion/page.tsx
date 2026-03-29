'use client';

import EditorialLayout from '@/components/EditorialLayout';

export default function NGTubeInsertionPage() {
  return (
    <EditorialLayout
      kicker="Clinical Skills · Children's Nursing"
      title="NG Tube Insertion & Testing"
      standfirst="How to insert, confirm placement, and safely use a nasogastric tube in paediatric patients — including why syringe size matters and what to do when you can't get aspirate."
      byline="Revision Foundations · Children's Hub"
    >
      {/* ── Overview ── */}
      <section style={{ marginBottom: '48px' }}>
        <div className="ed-info" style={{ marginBottom: '24px' }}>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#5A5750', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
            NG tubes are used in paediatrics for feeding (when a child can&apos;t take oral nutrition safely), medication administration, and gastric decompression. Getting placement confirmation right is safety-critical — a misplaced tube can deliver feed into the lungs. This guide covers insertion technique, the pH testing method, and common placement problems.
          </p>
        </div>
      </section>

      {/* ── Indications ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 400, color: '#1A1815', marginBottom: '18px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Indications for NG tube
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          {[
            {
              heading: 'Feeding',
              items: ['Unsafe swallow (dysphagia)', 'Premature infants', 'Faltering growth / poor oral intake', 'Post-operative nutrition', 'Neurological conditions'],
            },
            {
              heading: 'Medication',
              items: ['Child unable to take oral meds', 'Continuous infusions (e.g. omeprazole)', 'When accurate dosing is critical'],
            },
            {
              heading: 'Decompression',
              items: ['Bowel obstruction', 'Post-operative ileus', 'Gastric drainage', 'Reducing abdominal distension'],
            },
          ].map((col, i) => (
            <div key={i} style={{ padding: '16px 18px', borderRight: i < 2 ? '0.5px solid rgba(0,0,0,0.1)' : 'none' }}>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '10px' }}>{col.heading}</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {col.items.map((item, j) => (
                  <li key={j} style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#5A5750', lineHeight: 1.6, fontWeight: 300, padding: '2px 0 2px 12px', position: 'relative' as const }}>
                    <span style={{ position: 'absolute' as const, left: 0, color: '#ccc' }}>–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Measuring length ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 400, color: '#1A1815', marginBottom: '14px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Measuring the tube
        </h2>

        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#5A5750', lineHeight: 1.7, fontWeight: 300, marginBottom: '16px' }}>
          The NEX measurement (Nose–Ear–Xiphisternum) estimates the insertion length:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr', marginBottom: '24px' }}>
          {[
            'Place the tip of the tube at the nose.',
            'Loop the tube over the ear.',
            'Extend down to the xiphisternum (bottom of the sternum).',
            'Mark the tube at the nostril point or note the centimetre marking.',
          ].map((step, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontStyle: 'italic', color: '#ccc', padding: '8px 0' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#2C2A27', lineHeight: 1.6, fontWeight: 300, padding: '8px 0', borderBottom: i < 3 ? '0.5px solid rgba(0,0,0,0.06)' : 'none' }}>{step}</span>
            </div>
          ))}
        </div>

        <div className="ed-pearl">
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#633806', marginBottom: '6px', fontWeight: 400 }}>Clinical pearl</p>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#633806', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
            NEX measurement is a guide, not a guarantee. Studies show it can underestimate the required length, placing the tip in the oesophagus rather than the stomach. This is why pH testing of aspirate is essential — you cannot rely on length alone. Some trusts now use modified NEX (nose to ear, then ear to a point midway between xiphisternum and umbilicus) for improved accuracy.
          </p>
        </div>
      </section>

      {/* ── Insertion technique ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 400, color: '#1A1815', marginBottom: '8px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Insertion technique
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', fontStyle: 'italic', color: '#999', marginBottom: '28px' }}>
          Step by step — paediatric specific
        </p>

        <ol style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: '24px' }}>
          {[
            'Check prescription and confirm indication. Verify there are no contraindications (basal skull fracture, oesophageal atresia/stricture, recent nasal surgery).',
            'Gather equipment: correct-size NG tube, 20ml or 50ml syringe (never smaller — see below), pH paper (CE-marked), tape or fixation device, water or water-based lubricant, gloves, receiver/bowl.',
            'Explain to the child and family. Use age-appropriate language. Gain consent. Position the child — upright or semi-upright if possible, with head in a neutral or slightly flexed position.',
            'Perform hand hygiene. Put on gloves.',
            'Measure using NEX and mark the tube.',
            'Lubricate the tip of the tube with water or water-based lubricant. Do not use oil-based lubricant.',
            'Insert the tube into the more patent nostril (check by gently occluding each nostril and asking the child to sniff). Advance along the floor of the nasal passage — aim straight back, not upwards.',
            'If the child is old enough, ask them to swallow sips of water as you advance the tube. In infants, use a dummy/pacifier to trigger the swallowing reflex.',
            'If you feel resistance, do not force. Withdraw slightly and re-angle. Gagging is common and usually passes — coughing, cyanosis, or voice change means stop immediately.',
            'Advance to the marked length. Secure the tube to the cheek with tape or a nasal bridle/fixation device.',
            'Confirm placement before any use — see testing section below.',
          ].map((step, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', padding: '10px 0', borderBottom: i < 10 ? '0.5px solid rgba(0,0,0,0.06)' : 'none' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontStyle: 'italic', color: '#ccc' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#2C2A27', lineHeight: 1.6, fontWeight: 300 }}>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── THE SYRINGE SECTION ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 400, color: '#1A1815', marginBottom: '8px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Why a 20–60ml syringe?
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', fontStyle: 'italic', color: '#999', marginBottom: '28px' }}>
          This is a common exam question — and it matters clinically
        </p>

        <div style={{ border: '0.5px solid rgba(0,0,0,0.12)', marginBottom: '24px' }}>
          <div style={{ padding: '20px 22px', borderBottom: '0.5px solid rgba(0,0,0,0.1)' }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '10px' }}>The physics</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#2C2A27', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
              Pressure = Force &divide; Area. A smaller syringe (e.g. 5ml or 10ml) has a <strong style={{ fontWeight: 600 }}>smaller cross-sectional area</strong> of the plunger. When you pull back on a small syringe, the same hand force generates <strong style={{ fontWeight: 600 }}>much higher negative pressure</strong> inside the tube. This can cause the fine-bore tube to collapse against the gastric mucosa, making it impossible to get aspirate — and potentially damaging the stomach lining.
            </p>
          </div>
          <div style={{ padding: '20px 22px', borderBottom: '0.5px solid rgba(0,0,0,0.1)' }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '10px' }}>The clinical implication</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#2C2A27', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
              A <strong style={{ fontWeight: 600 }}>20ml, 50ml, or 60ml syringe</strong> has a larger plunger area, so the same hand force produces <strong style={{ fontWeight: 600 }}>gentler, lower-pressure suction</strong>. This is enough to draw up gastric contents without collapsing the tube or suctioning the mucosa. It gives you a better chance of actually obtaining aspirate for pH testing.
            </p>
          </div>
          <div style={{ padding: '20px 22px' }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '10px' }}>The rule</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#2C2A27', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
              <strong style={{ fontWeight: 600 }}>Never use a syringe smaller than 20ml</strong> to aspirate from an NG tube. Most trusts specify 50ml or 60ml as standard. A smaller syringe risks tube collapse, mucosal damage, inability to obtain aspirate, and a false assumption that the tube is misplaced when it may actually be correctly positioned.
            </p>
          </div>
        </div>

        <div className="ed-pearl">
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#633806', marginBottom: '6px', fontWeight: 400 }}>Exam pearl</p>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#633806', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
            If asked &ldquo;why do we use a large syringe?&rdquo; — your answer is about pressure physics: a larger barrel area means lower negative pressure for the same applied force, preventing tube collapse and mucosal injury. Examiners want to hear that you understand the mechanism, not just &ldquo;because policy says so.&rdquo;
          </p>
        </div>
      </section>

      {/* ── Confirming placement ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 400, color: '#1A1815', marginBottom: '8px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Confirming placement
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', fontStyle: 'italic', color: '#999', marginBottom: '28px' }}>
          First-line method: pH testing of gastric aspirate
        </p>

        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 400, color: '#1A1815', marginBottom: '14px' }}>
          pH testing
        </h3>

        <ol style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: '24px' }}>
          {[
            'Attach a 20–60ml syringe to the end of the NG tube.',
            'Gently pull back to aspirate gastric contents. You need a small amount — even 0.5ml is enough.',
            'If no aspirate is obtained, don\u2019t panic — work through these: (1) Turn the patient onto their left side. The stomach sits to the left, so this helps pool gastric contents around the tube tip. (2) Sit the patient more upright if possible. (3) Advance or withdraw the tube by 1\u20132cm. (4) Wait 15\u201330 minutes and try again. (5) If you still can\u2019t get aspirate after all of the above, request an X-ray as a last resort to confirm placement.',
            'Apply the aspirate to CE-marked pH indicator paper (not litmus paper).',
            'Read the pH against the colour chart immediately.',
            'Gastric placement is confirmed if pH is ≤5.5.',
            'If pH is >5.5, do NOT use the tube. Seek senior advice. An X-ray may be needed.',
          ].map((step, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', padding: '10px 0', borderBottom: i < 6 ? '0.5px solid rgba(0,0,0,0.06)' : 'none' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontStyle: 'italic', color: '#ccc' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#2C2A27', lineHeight: 1.6, fontWeight: 300 }}>{step}</span>
            </li>
          ))}
        </ol>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#EDFAEF', padding: '18px 20px', borderRadius: '0' }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#1a6b2a', marginBottom: '8px', fontWeight: 400 }}>Safe to use</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontStyle: 'italic', color: '#1a6b2a', marginBottom: '6px' }}>pH &le; 5.5</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#1a6b2a', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
              Confirms gastric placement. Document pH reading, tube length at nostril, and time of check.
            </p>
          </div>
          <div style={{ background: '#FCEBEB', padding: '18px 20px', borderRadius: '0' }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#A32D2D', marginBottom: '8px', fontWeight: 400 }}>Do not use</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontStyle: 'italic', color: '#A32D2D', marginBottom: '6px' }}>pH &gt; 5.5</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#A32D2D', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
              Could be in the oesophagus, respiratory tract, or intestine. Do not administer anything. Escalate.
            </p>
          </div>
        </div>

        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 400, color: '#1A1815', marginBottom: '14px' }}>
          Things that affect pH readings
        </h3>

        <div style={{ border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          {[
            { factor: 'Antacids / PPIs / H2 blockers', effect: 'Raise gastric pH — may give readings >5.5 even with correct placement. These children often need X-ray confirmation.' },
            { factor: 'Recent feed', effect: 'Milk and formula buffer stomach acid. Wait at least 1 hour after a feed before testing, or aspirate before the next feed.' },
            { factor: 'Continuous feeds', effect: 'Gastric pH may never drop below 5.5. Consider a planned break in feeding to allow pH to fall, or use X-ray.' },
            { factor: 'Using litmus paper', effect: 'Litmus paper is not accurate enough. Only CE-marked pH indicator paper with 0.5 graduations should be used.' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', borderBottom: i < 3 ? '0.5px solid rgba(0,0,0,0.08)' : 'none' }}>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#2C2A27', fontWeight: 400, padding: '12px 18px', borderRight: '0.5px solid rgba(0,0,0,0.08)' }}>{row.factor}</p>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#5A5750', fontWeight: 300, lineHeight: 1.6, padding: '12px 18px', margin: 0 }}>{row.effect}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What NOT to do ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 400, color: '#1A1815', marginBottom: '14px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Unsafe methods — never use these
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginBottom: '18px' }}>
          {[
            'Whoosh test (auscultation)',
            'Bubbling in water',
            'Observing for respiratory distress alone',
            'Litmus paper',
          ].map((flag) => (
            <span key={flag} style={{ fontFamily: "'Source Serif 4', serif", fontSize: '11px', background: '#FCEBEB', color: '#A32D2D', padding: '3px 11px', borderRadius: '2px', fontWeight: 300 }}>
              {flag}
            </span>
          ))}
        </div>

        <div className="ed-info">
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#5A5750', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
            The &ldquo;whoosh test&rdquo; (injecting air and listening over the stomach with a stethoscope) was historically common but is <strong style={{ fontWeight: 600 }}>no longer accepted practice</strong>. Air injected into a tube sitting in the lung can sound identical to air in the stomach. The NPSA issued a patient safety alert (2011) banning this method after fatal incidents where feed was delivered into the lungs. pH testing of aspirate or X-ray confirmation are the only safe methods.
          </p>
        </div>
      </section>

      {/* ── Ongoing checks ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 400, color: '#1A1815', marginBottom: '14px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Ongoing checks
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#5A5750', lineHeight: 1.7, fontWeight: 300, marginBottom: '16px' }}>
          Placement must be re-confirmed:
        </p>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: '24px' }}>
          {[
            'Before each bolus feed or medication',
            'At the start of each shift (for continuous feeds)',
            'After any episode of vomiting, retching, or coughing',
            'If the external length at the nostril has changed',
            'If the tube has been displaced or pulled at',
            'If there are any signs of respiratory distress',
          ].map((item, i) => (
            <li key={i} style={{ fontFamily: "'Source Serif 4', serif", fontSize: '13px', color: '#2C2A27', lineHeight: 1.6, fontWeight: 300, padding: '6px 0 6px 14px', position: 'relative' as const, borderBottom: i < 5 ? '0.5px solid rgba(0,0,0,0.06)' : 'none' }}>
              <span style={{ position: 'absolute' as const, left: 0, color: '#ccc' }}>–</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="ed-pearl">
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#633806', marginBottom: '6px', fontWeight: 400 }}>Clinical pearl</p>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#633806', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
            Always document the external tube length at the nostril when you first confirm placement. This gives you a reference — if the length changes, the tube has migrated and must be re-tested before use. Mark it on the nursing care plan and record it at every check.
          </p>
        </div>
      </section>

      {/* ── Tube sizes ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 400, color: '#1A1815', marginBottom: '14px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Tube size guide
        </h2>

        <div style={{ border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '0.5px solid rgba(0,0,0,0.1)', padding: '10px 18px' }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa' }}>Age / weight</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#aaa' }}>French gauge (Fr)</p>
          </div>
          {[
            { age: 'Premature neonate', size: '5 Fr' },
            { age: 'Term neonate', size: '6 Fr' },
            { age: 'Infant (1–12 months)', size: '6–8 Fr' },
            { age: 'Toddler (1–3 years)', size: '8 Fr' },
            { age: 'Child (3–10 years)', size: '8–10 Fr' },
            { age: 'Adolescent', size: '10–12 Fr' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '10px 18px', borderBottom: i < 5 ? '0.5px solid rgba(0,0,0,0.08)' : 'none' }}>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#2C2A27', fontWeight: 400 }}>{row.age}</p>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#5A5750', fontWeight: 300 }}>{row.size}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Complications ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 400, color: '#1A1815', marginBottom: '14px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
          Complications &amp; red flags
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginBottom: '18px' }}>
          {[
            'Pulmonary aspiration',
            'Oesophageal perforation',
            'Nasal trauma / epistaxis',
            'Tube misplacement in lung',
            'Aspiration pneumonia',
            'Skin breakdown at nostril',
            'Tube blockage',
          ].map((flag) => (
            <span key={flag} style={{ fontFamily: "'Source Serif 4', serif", fontSize: '11px', background: '#FCEBEB', color: '#A32D2D', padding: '3px 11px', borderRadius: '2px', fontWeight: 300 }}>
              {flag}
            </span>
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
            The most common questions: &ldquo;Why do we use a large syringe?&rdquo; (pressure physics — larger barrel = lower suction pressure), &ldquo;What pH confirms gastric placement?&rdquo; (&le;5.5), and &ldquo;Why don&apos;t we use the whoosh test?&rdquo; (NPSA safety alert — it cannot distinguish gastric from pulmonary placement). Examiners also look for correct NEX measurement technique, confirmation that you would not use the tube until placement is verified, and that you know to escalate when pH is &gt;5.5 or aspirate cannot be obtained.
          </p>
        </div>

        <div className="ed-pearl" style={{ marginTop: '16px' }}>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#633806', marginBottom: '6px', fontWeight: 400 }}>&ldquo;What if you can&apos;t get aspirate?&rdquo;</p>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: '12px', color: '#633806', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
            This comes up a lot in OSCEs. Know the order: <strong style={{ fontWeight: 600 }}>turn the patient onto their left side</strong> (the stomach sits to the left of the body, so gravity pools gastric contents around the tube tip), <strong style={{ fontWeight: 600 }}>sit them more upright</strong> if possible, <strong style={{ fontWeight: 600 }}>advance or withdraw the tube by 1–2cm</strong>, then <strong style={{ fontWeight: 600 }}>wait 15–30 minutes</strong> and try again. If none of that works, <strong style={{ fontWeight: 600 }}>request an X-ray</strong> as a last resort. Never use the tube until placement is confirmed. Never inject air to try and free the tube — that&apos;s no longer safe practice.
          </p>
        </div>
      </section>
    </EditorialLayout>
  );
}
