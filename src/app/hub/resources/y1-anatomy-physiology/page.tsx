'use client';

import EditorialLayout from '@/components/EditorialLayout';

export default function Y1AnatomyPhysiologyPage() {
  return (
    <EditorialLayout
      kicker="Year 1 Essentials · Free Resource"
      title="Anatomy & Physiology"
      standfirst="Essential body systems knowledge for Year 1 nursing students — with clinical links, normal ranges, and the values that actually come up on placement."
      byline="The Nurse Lab · Children's Hub"
    >

      <div className="ed-pearl" style={{ marginBottom: '40px' }}>
        <p className="ed-pearl-label">Why A&P matters in nursing</p>
        <p>Understanding anatomy and physiology helps you explain symptoms, recognise deterioration early, understand drug actions, make sense of blood results, and provide informed, holistic care.</p>
      </div>

      {/* Cardiovascular */}
      <h2 className="ed-section-title">Cardiovascular System</h2>
      <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">The Heart</p>
          <ul className="ed-list">
            <li>4 chambers: 2 atria (top), 2 ventricles (bottom)</li>
            <li>Right side → deoxygenated blood to lungs</li>
            <li>Left side → oxygenated blood to body</li>
            <li>4 valves prevent backflow</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Blood Vessels</p>
          <ul className="ed-list">
            <li>Arteries — away from heart (thick walls)</li>
            <li>Veins — towards heart (have valves)</li>
            <li>Capillaries — gas exchange (1 cell thick)</li>
          </ul>
        </div>
      </div>
      <div className="ed-mono" style={{ marginBottom: '12px' }}>
        SA Node → AV Node → Bundle of His → Bundle Branches → Purkinje Fibres
      </div>
      <p style={{ fontSize: '13px', color: '#5A5750', fontWeight: 300, marginBottom: '16px' }}>SA Node = pacemaker (60–100 bpm). If it fails, AV node takes over (40–60 bpm).</p>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Blood Pressure</p>
          <ul className="ed-list">
            <li>Normal: &lt;140/90 mmHg</li>
            <li>Hypertension: ≥140/90</li>
            <li>Hypotension: &lt;90/60</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Heart Rate</p>
          <ul className="ed-list">
            <li>Normal: 60–100 bpm (adult)</li>
            <li>Tachycardia: &gt;100 bpm</li>
            <li>Bradycardia: &lt;60 bpm</li>
          </ul>
        </div>
      </div>

      {/* Respiratory */}
      <h2 className="ed-section-title">Respiratory System</h2>
      <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Upper Airways</p>
          <ul className="ed-list">
            <li>Nose & nasal cavity (warms, filters, humidifies)</li>
            <li>Pharynx (throat)</li>
            <li>Larynx (voice box)</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Lower Airways</p>
          <ul className="ed-list">
            <li>Trachea (windpipe)</li>
            <li>Bronchi → Bronchioles</li>
            <li>Alveoli (gas exchange)</li>
          </ul>
        </div>
      </div>
      <div className="ed-info" style={{ marginBottom: '16px' }}>
        <p className="ed-info-label">Gas exchange at alveoli</p>
        <p>Oxygen diffuses from alveoli → blood. Carbon dioxide diffuses from blood → alveoli to be exhaled. ~300 million alveoli provide a huge surface area. Surfactant prevents alveoli from collapsing.</p>
      </div>
      <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">O2 Sats</p>
          <ul className="ed-list">
            <li>Normal: 94–98% (room air)</li>
            <li>COPD target: 88–92%</li>
            <li>&lt;94% — consider oxygen therapy</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Respiratory Rate</p>
          <ul className="ed-list">
            <li>Normal adult: 12–20 breaths/min</li>
            <li>Tachypnoea: &gt;20/min</li>
            <li>Bradypnoea: &lt;12/min</li>
          </ul>
        </div>
      </div>

      {/* Renal */}
      <h2 className="ed-section-title">Renal & Urinary System</h2>
      <div className="ed-mono" style={{ marginBottom: '12px' }}>
        Filtration (glomerulus) → Reabsorption → Secretion → Excretion
      </div>
      <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Key Kidney Functions</p>
          <ul className="ed-list">
            <li>Filter waste products from blood</li>
            <li>Regulate fluid balance</li>
            <li>Control blood pressure (renin)</li>
            <li>Produce erythropoietin (red blood cells)</li>
            <li>Activate vitamin D</li>
            <li>Regulate electrolytes (Na+, K+, Ca2+)</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Urine Output & Kidney Function</p>
          <ul className="ed-list">
            <li>Normal: &gt;0.5 ml/kg/hr</li>
            <li>Oliguria: &lt;400 ml/24hr</li>
            <li>Anuria: &lt;100 ml/24hr</li>
            <li>↑ Creatinine = kidney damage</li>
            <li>eGFR &lt;60 = chronic kidney disease</li>
            <li>↑ Urea = dehydration/failure</li>
          </ul>
        </div>
      </div>

      {/* Nervous System */}
      <h2 className="ed-section-title">Nervous System</h2>
      <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Central Nervous System</p>
          <ul className="ed-list">
            <li>Brain (cerebrum, cerebellum, brainstem)</li>
            <li>Spinal cord</li>
            <li>Protected by meninges and CSF</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Peripheral Nervous System</p>
          <ul className="ed-list">
            <li>Cranial nerves (12 pairs)</li>
            <li>Spinal nerves (31 pairs)</li>
            <li>Autonomic: Sympathetic & Parasympathetic</li>
          </ul>
        </div>
      </div>
      <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
        <div className="ed-cell">
          <p className="ed-cell-title">Sympathetic — "Fight or Flight"</p>
          <ul className="ed-list">
            <li>↑ Heart rate & BP</li>
            <li>Dilates pupils</li>
            <li>↑ Blood to muscles</li>
            <li>↓ Digestion</li>
          </ul>
        </div>
        <div className="ed-cell">
          <p className="ed-cell-title">Parasympathetic — "Rest & Digest"</p>
          <ul className="ed-list">
            <li>↓ Heart rate & BP</li>
            <li>Constricts pupils</li>
            <li>↑ Digestion</li>
            <li>↑ Secretions</li>
          </ul>
        </div>
      </div>
      <div className="ed-info" style={{ marginBottom: '32px' }}>
        <p className="ed-info-label">GCS — Glasgow Coma Scale</p>
        <p>Eye (1–4) + Verbal (1–5) + Motor (1–6) = 3–15. Normal: 15. Severe injury: ≤8. GCS &lt;8 — protect the airway.</p>
      </div>

      {/* Homeostasis */}
      <h2 className="ed-section-title">Homeostasis — Normal Ranges</h2>
      <table className="ed-table" style={{ marginBottom: '32px' }}>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Normal Range</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Body Temperature</td><td>36.5–37.5°C</td></tr>
          <tr><td>Blood Glucose (fasting)</td><td>4–7 mmol/L</td></tr>
          <tr><td>Blood pH</td><td>7.35–7.45</td></tr>
          <tr><td>Serum Sodium</td><td>135–145 mmol/L</td></tr>
          <tr><td>Serum Potassium</td><td>3.5–5.0 mmol/L</td></tr>
          <tr><td>Serum Calcium</td><td>2.2–2.6 mmol/L</td></tr>
          <tr><td>Urine Output</td><td>&gt;0.5 ml/kg/hr</td></tr>
        </tbody>
      </table>

      {/* Red flags */}
      <p className="ed-redflags-label">Red flags — when A&P knowledge saves lives</p>
      <div className="ed-redflags">
        {[
          'Hypoxia + confusion — urgent assessment',
          'Chest pain + sweating + pallor — possible MI',
          'Sudden severe headache — possible SAH',
          'No urine + rising creatinine — AKI',
          'Hot red swollen limb + SOB — DVT/PE',
          'Altered consciousness + fever — meningitis',
        ].map((flag) => (
          <span key={flag} className="ed-red-pill">{flag}</span>
        ))}
      </div>

    </EditorialLayout>
  );
}
