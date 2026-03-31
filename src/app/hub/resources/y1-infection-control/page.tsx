'use client';

import EditorialLayout from '@/components/EditorialLayout';
import SelfTestQuiz from '@/components/SelfTestQuiz';

const quizQuestions = [
  { question: 'How long should alcohol hand rub be applied for?', options: ['10 seconds', '20-30 seconds', '40-60 seconds', '2 minutes'], answer: 1, explanation: 'Alcohol hand rub should be applied for 20-30 seconds, ensuring all areas of the hands are covered.' },
  { question: 'When should you wash with soap and water instead of using alcohol gel?', options: ['When your hands look clean', 'When caring for C. diff patients or visibly soiled hands', 'Never — gel is always better', 'Only before eating'], answer: 1, explanation: 'Alcohol gel does NOT kill C. diff spores. Use soap and water when hands are visibly soiled or after caring for patients with diarrhoea/vomiting.' },
  { question: 'What does MRSA stand for?', options: ['Multiple Resistant Skin Allergy', 'Methicillin-Resistant Staphylococcus Aureus', 'Micro-Resistant Staph Infection', 'Medication-Related Skin Abscess'], answer: 1, explanation: 'MRSA is Methicillin-Resistant Staphylococcus Aureus — a bacteria resistant to many common antibiotics.' },
  { question: 'Which type of isolation requires a negative pressure room?', options: ['Contact isolation', 'Droplet isolation', 'Airborne isolation', 'Protective isolation'], answer: 2, explanation: 'Airborne isolation (e.g., TB, measles, chickenpox) requires negative pressure rooms to prevent spread through air currents.' },
  { question: 'What is the chain of infection?', options: ['A type of bacterial infection', 'The sequence of events required for infection to spread', 'A list of antibiotic treatments', 'The order of PPE application'], answer: 1, explanation: 'The chain of infection describes the 6 links needed for infection: organism, reservoir, exit, transmission, entry, susceptible host.' },
  { question: 'After a needlestick injury, when should you attend occupational health?', options: ['Within the next week', 'Within 24 hours', 'Within 1 hour', 'Only if you feel unwell'], answer: 2, explanation: 'Needlestick injuries need URGENT assessment — ideally within 1 hour — as HIV post-exposure prophylaxis must start within 72 hours to be effective.' },
  { question: 'What colour bag are clinical waste items disposed in?', options: ['Black', 'Yellow/Orange', 'Clear', 'Blue'], answer: 1, explanation: 'Clinical waste goes in yellow or orange bags (varies by trust). Black is domestic waste, clear is recycling.' },
  { question: 'Which of the following does NOT require contact precautions?', options: ['MRSA', 'C. difficile', 'Common cold', 'Scabies'], answer: 2, explanation: 'Common cold is spread by droplets, not contact. MRSA, C. diff, and scabies all require contact precautions.' },
];

export default function Y1InfectionControlPage() {
  return (
    <EditorialLayout
      kicker="Year 1 Essentials · Free Resource"
      title="Infection Prevention & Control"
      standfirst="Essential IPC knowledge to protect patients, yourself, and colleagues — from hand hygiene moments to isolation precautions."
      byline="The Nurse Lab · Children's Hub"
    >

      {/* Chain of Infection */}
      <div className="ed-pearl" style={{ marginBottom: '40px' }}>
        <p className="ed-pearl-label">Chain of infection</p>
        <p>Breaking ANY link in the chain prevents spread: <strong>Pathogen → Reservoir → Exit → Transmission → Entry → Susceptible Host</strong>. Standard precautions target the transmission and entry links.</p>
      </div>

      {/* Hand Hygiene */}
      <h2 className="ed-section-title">Hand Hygiene — The Most Important IPC Measure</h2>
      <div className="ed-card" style={{ marginBottom: '16px' }}>
        <p className="ed-card-title">WHO 5 Moments for Hand Hygiene</p>
        <table className="ed-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Moment</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            {[
              { num: '1', text: 'BEFORE touching a patient', why: 'Protect patient from your germs' },
              { num: '2', text: 'BEFORE a clean/aseptic procedure', why: 'Protect patient from germs entering body' },
              { num: '3', text: 'AFTER body fluid exposure risk', why: 'Protect yourself and environment' },
              { num: '4', text: 'AFTER touching a patient', why: 'Protect yourself and environment' },
              { num: '5', text: 'AFTER touching patient surroundings', why: 'Protect yourself and environment' },
            ].map(m => (
              <tr key={m.num}>
                <td>{m.num}</td>
                <td>{m.text}</td>
                <td>{m.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Soap & Water (40–60 seconds)</p>
          <ul className="ed-list">
            <li>Hands are visibly soiled</li>
            <li>After using the toilet</li>
            <li>Caring for C. diff or norovirus patients</li>
            <li>After removing gloves if hands are dirty</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Alcohol Gel (20–30 seconds)</p>
          <ul className="ed-list">
            <li>Hands are visibly clean</li>
            <li>Between patient contacts</li>
            <li>Before and after putting on gloves</li>
            <li>Quick decontamination needed</li>
          </ul>
        </div>
      </div>
      <div className="ed-info" style={{ marginBottom: '32px' }}>
        <p className="ed-info-label">Ayliffe technique — 6 steps</p>
        <p>Palm to palm → Backs of hands → Interlace fingers → Backs of fingers → Thumbs → Fingertips. All areas must be covered.</p>
      </div>

      {/* PPE */}
      <h2 className="ed-section-title">Personal Protective Equipment (PPE)</h2>
      <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
        {[
          { item: 'Gloves', when: 'Contact with blood/body fluids, non-intact skin, mucous membranes. Change between procedures.' },
          { item: 'Aprons', when: 'Direct patient care, risk of splashing, decontamination of equipment. Single-use per patient.' },
          { item: 'Surgical Mask', when: 'Droplet precautions (flu, COVID). Procedures generating splashes. Within 1m of symptomatic patient.' },
          { item: 'Eye Protection', when: 'Risk of splash to face or eyes. Aerosol-generating procedures. Airborne precautions.' },
        ].map(p => (
          <div key={p.item} className="ed-cell">
            <p className="ed-cell-title">{p.item}</p>
            <p>{p.when}</p>
          </div>
        ))}
      </div>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Donning order (putting ON)</p>
          <ol style={{ paddingLeft: '16px', fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.8 }}>
            <li>Hand hygiene</li>
            <li>Apron/Gown</li>
            <li>Mask (fit-check!)</li>
            <li>Eye protection</li>
            <li>Gloves (over gown cuffs)</li>
          </ol>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Doffing order (taking OFF)</p>
          <ol style={{ paddingLeft: '16px', fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.8 }}>
            <li>Gloves (most contaminated)</li>
            <li>Hand hygiene</li>
            <li>Apron/Gown</li>
            <li>Eye protection</li>
            <li>Mask (by straps only)</li>
            <li>Hand hygiene AGAIN</li>
          </ol>
        </div>
      </div>

      {/* Transmission */}
      <h2 className="ed-section-title">Transmission Routes & Precautions</h2>
      <table className="ed-table" style={{ marginBottom: '32px' }}>
        <thead>
          <tr>
            <th>Route</th>
            <th>Particle size</th>
            <th>Examples</th>
            <th>Precautions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Contact</td>
            <td>Direct/indirect touch</td>
            <td>MRSA, C. diff, scabies, norovirus</td>
            <td>Gloves + apron, isolation, hand hygiene</td>
          </tr>
          <tr>
            <td>Droplet</td>
            <td>&gt;5μm — falls within 1–2m</td>
            <td>Influenza, COVID-19, pertussis</td>
            <td>Surgical mask, eye protection if close</td>
          </tr>
          <tr>
            <td>Airborne</td>
            <td>&lt;5μm — remains suspended</td>
            <td>TB, measles, chickenpox</td>
            <td>FFP3/N95 mask, negative pressure room</td>
          </tr>
        </tbody>
      </table>

      {/* ANTT */}
      <h2 className="ed-section-title">Aseptic Non-Touch Technique (ANTT)</h2>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        {[
          { title: 'Key-Parts', desc: 'Parts of equipment that must remain sterile (needle tip, catheter tip). Never touch these directly.' },
          { title: 'Key-Sites', desc: 'Patient body sites that must be protected (wound, insertion site). Keep the aseptic field around them.' },
          { title: 'Standard ANTT', desc: 'For simpler procedures: IM/SC injections, cannulation, simple wound dressings.' },
          { title: 'Surgical ANTT', desc: 'For complex procedures: urinary catheterisation, central line care, complex wound care.' },
        ].map(p => (
          <div key={p.title} className="ed-cell">
            <p className="ed-cell-title">{p.title}</p>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>

      {/* HCAIs */}
      <h2 className="ed-section-title">Common Healthcare-Associated Infections</h2>
      <table className="ed-table" style={{ marginBottom: '32px' }}>
        <thead>
          <tr>
            <th>Organism</th>
            <th>Spread</th>
            <th>Key control measure</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: 'MRSA', spread: 'Contact', key: 'Screening, decolonisation, contact precautions' },
            { name: 'C. difficile', spread: 'Contact (spores)', key: 'Soap & water (not alcohol gel), isolation, antibiotic stewardship' },
            { name: 'VRE', spread: 'Contact', key: 'Contact precautions, environmental cleaning' },
            { name: 'Norovirus', spread: 'Contact/Faecal-oral', key: 'Soap & water, isolation, terminal clean' },
            { name: 'TB (pulmonary)', spread: 'Airborne', key: 'Negative pressure room, FFP3 mask' },
          ].map(inf => (
            <tr key={inf.name}>
              <td>{inf.name}</td>
              <td>{inf.spread}</td>
              <td>{inf.key}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sharps Safety */}
      <h2 className="ed-section-title">Sharps Safety</h2>
      <p className="ed-redflags-label">Sharps rules — never break these</p>
      <div className="ed-redflags" style={{ marginBottom: '16px' }}>
        {['Never re-cap needles', 'Dispose at point of use', 'Fill to ¾ max', 'Your sharp — your responsibility', 'Never hand-to-hand', 'Use neutral zone'].map(r => <span key={r} className="ed-red-pill">{r}</span>)}
      </div>
      <div className="ed-card" style={{ marginBottom: '32px' }}>
        <p className="ed-card-title">Needlestick Injury — What to Do</p>
        <ol style={{ paddingLeft: '16px', fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.8 }}>
          <li><strong>Encourage bleeding</strong> — do NOT suck the wound</li>
          <li><strong>Wash</strong> with soap and running water</li>
          <li><strong>Cover</strong> with waterproof dressing</li>
          <li><strong>Report</strong> immediately to senior/manager</li>
          <li><strong>Attend Occupational Health</strong> ASAP — ideally within 1 hour</li>
          <li><strong>Document</strong> — complete incident report (Datix)</li>
        </ol>
      </div>

      {/* Timing reference */}
      <div className="ed-pearl" style={{ marginBottom: '32px' }}>
        <p className="ed-pearl-label">Timing reference</p>
        <p>Alcohol hand rub: 20–30 seconds. Soap & water: 40–60 seconds. Surgical scrub: 3–5 minutes. Needlestick — attend Occ Health within 1 hour. HIV post-exposure prophylaxis: must start within 72 hours.</p>
      </div>

      {/* IPC Red Flags */}
      <p className="ed-redflags-label">IPC red flags — escalate immediately</p>
      <div className="ed-redflags" style={{ marginBottom: '40px' }}>
        {[
          'Suspected outbreak (2+ linked cases)',
          'Needlestick from known HIV/Hep B/C patient',
          'Unexplained cluster of infections',
          'Breach of isolation with high-risk organism',
          'Healthcare worker with symptoms working',
        ].map(flag => <span key={flag} className="ed-red-pill">{flag}</span>)}
      </div>

      {/* Quiz */}
      <SelfTestQuiz title="Test Yourself: Infection Control" questions={quizQuestions} />

    </EditorialLayout>
  );
}
