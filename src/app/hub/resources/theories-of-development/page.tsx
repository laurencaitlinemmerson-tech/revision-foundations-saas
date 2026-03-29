'use client';

import EditorialLayout from '@/components/EditorialLayout';

export default function TheoriesOfDevelopmentPage() {
  return (
    <EditorialLayout
      kicker="Children's Nursing · Free Resource"
      title="Theories of Development"
      standfirst="Essential developmental theories for nursing practice — from Piaget to Bowlby, with clinical applications for every stage."
      byline="Revision Foundations · Children's Hub"
    >

      <div className="ed-pearl" style={{ marginBottom: '40px' }}>
        <p className="ed-pearl-label">Why it matters</p>
        <p>Developmental theories help you assess if a child is developing normally, adapt your communication to their stage, understand behaviour in context, recognise delay early, and provide truly age-appropriate care.</p>
      </div>

      {/* Piaget */}
      <h2 className="ed-section-title">Piaget — Cognitive Development</h2>
      <p style={{ fontSize: '14px', color: '#5A5750', fontWeight: 300, lineHeight: 1.7, marginBottom: '20px' }}>
        Jean Piaget described how children's thinking develops through distinct stages. Children aren't just "mini adults" — they think differently at each stage.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {[
          { age: '0–2 years', stage: 'Sensorimotor', desc: 'Learning through senses and movement. Develops object permanence (~8 months) — understanding objects still exist when out of sight.', clinical: 'Use distraction. Infant may cry when parent leaves. Allow comfort objects. Keep parent visible if possible.' },
          { age: '2–7 years', stage: 'Preoperational', desc: 'Symbolic thinking (pretend play) but egocentric — can\'t see others\' perspectives. Magical thinking — may believe thoughts caused illness.', clinical: 'Use simple, concrete explanations. Demonstrate on a teddy or doll. Reassure it\'s not their fault they\'re ill.' },
          { age: '7–11 years', stage: 'Concrete Operational', desc: 'Logical thinking about concrete things. Understands conservation. Can see others\' viewpoints.', clinical: 'Include child in discussions. Give logical explanations. They can learn about their condition.' },
          { age: '12+ years', stage: 'Formal Operational', desc: 'Abstract thinking — can reason hypothetically, consider future consequences, think philosophically.', clinical: 'Involve in decisions about care. Discuss long-term implications. Consider Gillick competence.' },
        ].map((item) => (
          <div key={item.stage} className="ed-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', background: '#F0EDE8', padding: '2px 10px', borderRadius: '3px', color: '#301906', fontFamily: 'Source Serif 4, serif' }}>{item.age}</span>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#1A1815' }}>{item.stage} Stage</span>
            </div>
            <p style={{ fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.6, marginBottom: '8px' }}>{item.desc}</p>
            <div className="ed-info">
              <p className="ed-info-label">Clinical application</p>
              <p>{item.clinical}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Erikson */}
      <h2 className="ed-section-title">Erikson — Psychosocial Development</h2>
      <p style={{ fontSize: '14px', color: '#5A5750', fontWeight: 300, lineHeight: 1.7, marginBottom: '20px' }}>
        Eight stages of psychosocial development, each with a "crisis" to resolve. Success leads to healthy development; failure can cause lasting difficulties.
      </p>
      <table className="ed-table" style={{ marginBottom: '32px' }}>
        <thead>
          <tr>
            <th>Age</th>
            <th>Stage / Crisis</th>
            <th>Key Theme</th>
            <th>Clinical Application</th>
          </tr>
        </thead>
        <tbody>
          {[
            { age: '0–1 yr', stage: 'Trust vs Mistrust', theme: 'Can I trust the world?', clinical: 'Keep routines consistent. Involve parents. Respond to cries.' },
            { age: '1–3 yrs', stage: 'Autonomy vs Shame', theme: '"Me do it!"', clinical: 'Offer simple choices. Allow some control. Be patient.' },
            { age: '3–6 yrs', stage: 'Initiative vs Guilt', theme: 'Am I good or bad?', clinical: 'Encourage questions. Use play for procedures.' },
            { age: '6–12 yrs', stage: 'Industry vs Inferiority', theme: 'Am I competent?', clinical: 'Praise achievements. Keep up with schoolwork if possible.' },
            { age: '12–18 yrs', stage: 'Identity vs Role Confusion', theme: 'Who am I?', clinical: 'Respect autonomy. Address body image. Involve in care decisions.' },
          ].map((row) => (
            <tr key={row.age}>
              <td>{row.age}</td>
              <td>{row.stage}</td>
              <td>{row.theme}</td>
              <td>{row.clinical}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bowlby */}
      <h2 className="ed-section-title">Bowlby — Attachment Theory</h2>
      <p style={{ fontSize: '14px', color: '#5A5750', fontWeight: 300, lineHeight: 1.7, marginBottom: '20px' }}>
        Early attachment with caregivers is crucial for emotional development. The quality of attachment shapes relationships throughout life. Ainsworth's Strange Situation identified four attachment styles.
      </p>
      <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
        {[
          { style: 'Secure', desc: 'Child uses caregiver as safe base. Distressed when separated but easily comforted on reunion. Develops from consistent, responsive care.' },
          { style: 'Insecure–Avoidant', desc: 'Child avoids caregiver. Little distress at separation, ignores on reunion. Often from emotionally unavailable parenting.' },
          { style: 'Insecure–Resistant (Ambivalent)', desc: 'Very distressed at separation, hard to comfort on reunion. From inconsistent caregiving.' },
          { style: 'Disorganised', desc: 'No clear pattern — confused or contradictory behaviours. Often linked to abuse or neglect. Highest risk for later difficulties.' },
        ].map((item) => (
          <div key={item.style} className="ed-cell">
            <p className="ed-cell-title">{item.style}</p>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="ed-pearl" style={{ marginBottom: '32px' }}>
        <p className="ed-pearl-label">Clinical applications</p>
        <p>Keep parents with children wherever possible (family-centred care). Prepare children for separations. Watch for signs of attachment difficulties. Consider attachment in child protection concerns. Support parent-infant bonding, especially if premature or unwell.</p>
      </div>

      {/* Vygotsky */}
      <h2 className="ed-section-title">Vygotsky — Social Development Theory</h2>
      <div className="ed-grid-3" style={{ marginBottom: '16px' }}>
        {[
          { concept: 'ZPD', title: 'Zone of Proximal Development', desc: 'The gap between what a child can do alone and what they can do with help. Learning happens best in this zone — challenging but achievable with support.' },
          { concept: 'Scaffolding', title: 'Scaffolding', desc: 'Temporary support given by a more knowledgeable person, gradually reduced as competence increases. Think: training wheels on a bike.' },
          { concept: 'MKO', title: 'More Knowledgeable Other', desc: 'Someone with more knowledge who guides learning — a parent, teacher, nurse, or even a peer.' },
        ].map((item) => (
          <div key={item.concept} className="ed-cell">
            <p className="ed-cell-title">{item.concept}</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', color: '#1A1815', marginBottom: '6px' }}>{item.title}</p>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="ed-info" style={{ marginBottom: '32px' }}>
        <p className="ed-info-label">Clinical application</p>
        <p>When teaching a child self-care skills (e.g., inhaler technique), provide step-by-step guidance then gradually reduce support as they become competent. Use peer support — children often learn well from others who've been through similar experiences.</p>
      </div>

      {/* Kohlberg */}
      <h2 className="ed-section-title">Kohlberg — Moral Development</h2>
      <table className="ed-table" style={{ marginBottom: '16px' }}>
        <thead>
          <tr>
            <th>Level</th>
            <th>Stage</th>
            <th>Age</th>
            <th>Reasoning</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Pre-Conventional</td><td>1 — Avoid punishment</td><td>~2–6 yrs</td><td>"It's wrong because I'll get in trouble."</td></tr>
          <tr><td>Pre-Conventional</td><td>2 — Self-interest</td><td>~6–9 yrs</td><td>"What's in it for me? Fair exchange."</td></tr>
          <tr><td>Conventional</td><td>3 — Good boy/girl</td><td>Adolescence</td><td>Want approval; relationships matter.</td></tr>
          <tr><td>Conventional</td><td>4 — Law and order</td><td>Adulthood</td><td>Rules and authority are important.</td></tr>
          <tr><td>Post-Conventional</td><td>5 — Social contract</td><td>Some adults</td><td>Rules can be changed for the greater good.</td></tr>
          <tr><td>Post-Conventional</td><td>6 — Universal principles</td><td>Few adults</td><td>Personal ethics may override law.</td></tr>
        </tbody>
      </table>
      <div className="ed-pearl" style={{ marginBottom: '32px' }}>
        <p className="ed-pearl-label">Clinical application</p>
        <p>For young children, link medication adherence to concrete consequences. For older children, appeal to rules. For adolescents, discuss the reasoning and let them participate in decisions.</p>
      </div>

      {/* Other theories */}
      <h2 className="ed-section-title">Other Important Theorists</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
        {[
          { theorist: 'Bandura', theory: 'Social Learning Theory', desc: 'Children learn by observing and imitating others (modelling). Explains how behaviours — good and bad — are learned.', clinical: 'Model healthy behaviours. Be aware children may copy staff. Use role modelling in health education.' },
          { theorist: 'Bronfenbrenner', theory: 'Ecological Systems Theory', desc: 'Development is influenced by multiple systems: family (microsystem), school/community (mesosystem), parental work (exosystem), culture (macrosystem).', clinical: 'Consider the whole context of a child\'s life. Family circumstances, community resources, and cultural background all matter.' },
          { theorist: 'Freud', theory: 'Psychosexual Development', desc: 'Five stages (oral, anal, phallic, latent, genital). While controversial, concepts like defence mechanisms remain clinically relevant.', clinical: 'Understand that behaviour may have unconscious roots. Defence mechanisms such as denial and regression are common coping strategies.' },
        ].map((item) => (
          <div key={item.theorist} className="ed-card" style={{ marginBottom: 0 }}>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#1A1815' }}>{item.theorist}</span>
              <span style={{ fontSize: '12px', color: '#999', marginLeft: '10px' }}>{item.theory}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.6, marginBottom: '8px' }}>{item.desc}</p>
            <p style={{ fontSize: '12px', color: '#777', fontWeight: 300, fontStyle: 'italic' }}>Clinical: {item.clinical}</p>
          </div>
        ))}
      </div>

      {/* Red flags */}
      <p className="ed-redflags-label">Red flags — when to be concerned</p>
      <div className="ed-redflags" style={{ marginBottom: '32px' }}>
        {[
          'Significant developmental delay',
          'Regression — losing acquired skills',
          'Signs of disorganised attachment',
          'Social withdrawal',
          'Lack of empathy or cruelty',
          'Concerning parent-child interactions',
          'Missed key milestones',
        ].map((flag) => (
          <span key={flag} className="ed-red-pill">{flag}</span>
        ))}
      </div>

      {/* Quick reference */}
      <div className="ed-grid-4" style={{ marginTop: '8px' }}>
        {[
          { theorist: 'Piaget', focus: 'How children THINK' },
          { theorist: 'Erikson', focus: 'How children FEEL' },
          { theorist: 'Bowlby', focus: 'How children BOND' },
          { theorist: 'Vygotsky', focus: 'How children LEARN' },
        ].map((t) => (
          <div key={t.theorist} className="ed-grid-4-cell">
            <p className="ed-grid-4-title">Theorist</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '15px', color: '#1A1815', marginBottom: '4px' }}>{t.theorist}</p>
            <p style={{ fontSize: '12px', color: '#777', fontWeight: 300 }}>{t.focus}</p>
          </div>
        ))}
      </div>

    </EditorialLayout>
  );
}
