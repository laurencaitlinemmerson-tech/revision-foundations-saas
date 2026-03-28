'use client';

import EditorialLayout from '@/components/EditorialLayout';
import { EDITORIAL_CSS } from '@/lib/editorialStyles';

export default function DrugCalculationsCheatSheetPage() {
  return (
    <EditorialLayout
      kicker="Medication Safety · Free Resource"
      title="Drug Calculations Cheat Sheet"
      standfirst="Essential formulas and step-by-step methods for common drug calculations — from oral liquids to IV rates and weight-based paediatric dosing."
      byline="Revision Foundations · Children's Hub"
    >
      <>
          {/* NHS Formula */}
          <h2 className="ed-section-title">The NHS Formula</h2>
          <div className="ed-mono" style={{ fontSize: '18px', textAlign: 'center', padding: '20px' }}>
            Need ÷ Have × Stock
          </div>
          <div className="ed-grid-3" style={{ marginBottom: '16px' }}>
            <div className="ed-cell">
              <p className="ed-cell-title">Need</p>
              <p>What the prescription says — the dose prescribed</p>
            </div>
            <div className="ed-cell">
              <p className="ed-cell-title">Have</p>
              <p>Strength of medication you have (per tablet or ml)</p>
            </div>
            <div className="ed-cell">
              <p className="ed-cell-title">Stock</p>
              <p>Volume or quantity it comes in (ml or number of tablets)</p>
            </div>
          </div>
          <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
            <div className="ed-cell">
              <p className="ed-cell-title">Worked example — oral liquid</p>
              <p>Child needs 150mg ibuprofen. You have ibuprofen 100mg/5ml.</p>
              <div className="ed-mono" style={{ marginTop: '8px', fontSize: '13px' }}>150 ÷ 100 × 5 = 7.5ml</div>
            </div>
            <div className="ed-cell">
              <p className="ed-cell-title">Worked example — tablets</p>
              <p>Patient needs 7.5mg bisoprolol. You have 5mg tablets.</p>
              <div className="ed-mono" style={{ marginTop: '8px', fontSize: '13px' }}>7.5 ÷ 5 × 1 = 1.5 tablets</div>
            </div>
          </div>

          {/* IV drip rate */}
          <h2 className="ed-section-title">IV Drip Rate (drops/min)</h2>
          <div className="ed-mono" style={{ textAlign: 'center', padding: '16px', marginBottom: '16px' }}>
            Drops/min = (Volume × Drop factor) ÷ Time in minutes
          </div>
          <div className="ed-pearl" style={{ marginBottom: '16px' }}>
            <p className="ed-pearl-label">Important</p>
            <p>Drop factor is NOT calculated — it's printed on the IV giving set packaging. Just look at the box. Standard: 20 drops/ml. Blood: 15 drops/ml. Micro/Paeds: 60 drops/ml.</p>
          </div>
          <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
            <div className="ed-cell">
              <p className="ed-cell-title">Post-op fluids</p>
              <p>1L 0.9% saline over 8 hours. Standard set (20 drops/ml).</p>
              <div className="ed-mono" style={{ marginTop: '8px', fontSize: '12px' }}>
                Time = 8 × 60 = 480 min<br />
                (1000 × 20) ÷ 480 = 41.6 ≈ 42 drops/min
              </div>
            </div>
            <div className="ed-cell">
              <p className="ed-cell-title">Paediatric IV</p>
              <p>Child needs 250ml over 6 hours. Microdrop set (60 drops/ml).</p>
              <div className="ed-mono" style={{ marginTop: '8px', fontSize: '12px' }}>
                Time = 6 × 60 = 360 min<br />
                (250 × 60) ÷ 360 = 41.6 ≈ 42 drops/min
              </div>
            </div>
          </div>

          {/* IV pump rate */}
          <h2 className="ed-section-title">IV Rate for Pumps (ml/hr)</h2>
          <div className="ed-mono" style={{ textAlign: 'center', padding: '16px', marginBottom: '16px' }}>
            Rate (ml/hr) = Volume (ml) ÷ Time (hours)
          </div>
          <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
            <div className="ed-cell">
              <p className="ed-cell-title">Maintenance fluids</p>
              <p>3L over 24 hours via pump.</p>
              <div className="ed-mono" style={{ marginTop: '8px', fontSize: '13px' }}>3000 ÷ 24 = 125 ml/hr</div>
            </div>
            <div className="ed-cell">
              <p className="ed-cell-title">Antibiotic infusion</p>
              <p>500mg vancomycin in 100ml over 2 hours.</p>
              <div className="ed-mono" style={{ marginTop: '8px', fontSize: '13px' }}>100 ÷ 2 = 50 ml/hr</div>
            </div>
          </div>

          {/* Holliday-Segar */}
          <h2 className="ed-section-title">Holliday-Segar — Paediatric Maintenance Fluids</h2>
          <table className="ed-table" style={{ marginBottom: '16px' }}>
            <thead>
              <tr>
                <th>Weight range</th>
                <th>Daily allowance</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>First 10 kg</td><td>100 ml/kg/day</td></tr>
              <tr><td>Next 10 kg (11–20 kg)</td><td>50 ml/kg/day</td></tr>
              <tr><td>Each kg above 20 kg</td><td>20 ml/kg/day</td></tr>
            </tbody>
          </table>
          <div className="ed-grid-3" style={{ marginBottom: '32px' }}>
            {[
              { weight: '8 kg', calc: '8 × 100 = 800 ml/day', rate: '33 ml/hr' },
              { weight: '18 kg', calc: '(10×100) + (8×50) = 1,400 ml/day', rate: '58 ml/hr' },
              { weight: '25 kg', calc: '(10×100) + (10×50) + (5×20) = 1,700 ml/day', rate: '71 ml/hr' },
            ].map(ex => (
              <div key={ex.weight} className="ed-cell">
                <p className="ed-cell-title">{ex.weight}</p>
                <div className="ed-mono" style={{ marginTop: '4px', fontSize: '11px' }}>{ex.calc}</div>
                <p style={{ fontSize: '12px', color: '#301906', marginTop: '6px', fontWeight: 400 }}>→ {ex.rate}</p>
              </div>
            ))}
          </div>

          {/* Weight-based dosing */}
          <h2 className="ed-section-title">Weight-Based Dosing</h2>
          <div className="ed-mono" style={{ textAlign: 'center', padding: '16px', marginBottom: '16px' }}>
            Total dose = Dose per kg × Patient weight (kg)
          </div>
          <div className="ed-grid-2" style={{ marginBottom: '16px' }}>
            <div className="ed-cell">
              <p className="ed-cell-title">Gentamicin (adult)</p>
              <p>Patient weighs 80kg. 5mg/kg once daily.</p>
              <div className="ed-mono" style={{ marginTop: '8px', fontSize: '13px' }}>5 × 80 = 400mg</div>
            </div>
            <div className="ed-cell">
              <p className="ed-cell-title">Paracetamol (child)</p>
              <p>Child weighs 25kg. Paracetamol 15mg/kg PRN.</p>
              <div className="ed-mono" style={{ marginTop: '8px', fontSize: '13px' }}>15 × 25 = 375mg</div>
            </div>
          </div>
          <div className="ed-card" style={{ marginBottom: '32px' }}>
            <p className="ed-card-title">Divided doses — step by step</p>
            <div className="ed-grid-2">
              <div>
                <p style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>Step 1</p>
                <div className="ed-mono" style={{ fontSize: '12px' }}>Daily dose = mg/kg/day × weight (kg)</div>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>Step 2</p>
                <div className="ed-mono" style={{ fontSize: '12px' }}>Single dose = Daily dose ÷ Number of doses</div>
              </div>
            </div>
            <div className="ed-pearl" style={{ marginTop: '16px' }}>
              <p className="ed-pearl-label">Example</p>
              <p>Child weighs 20kg. Amoxicillin 25mg/kg/day in 3 divided doses (TDS).<br />Step 1: 25 × 20 = 500mg/day. Step 2: 500 ÷ 3 = 166.6mg per dose.</p>
            </div>
          </div>

          {/* Safe dose checking */}
          <h2 className="ed-section-title">Safe Dose Range Checking</h2>
          <div className="ed-card" style={{ marginBottom: '16px' }}>
            <p className="ed-card-title">Always verify against BNF/BNFc</p>
            <p style={{ fontSize: '13px', color: '#5A5750', fontWeight: 300, marginBottom: '12px' }}>Doctor prescribes 200mg ibuprofen TDS for an 18kg child. BNFc says max 30mg/kg/day. Is it safe?</p>
            <div className="ed-mono" style={{ fontSize: '12px' }}>
              Prescribed daily: 200 × 3 = 600mg<br />
              Maximum daily: 30 × 18 = 540mg<br />
              <strong style={{ color: '#A32D2D' }}>⚠ OVER the maximum — query with prescriber!</strong>
            </div>
          </div>

          {/* Unit conversions */}
          <h2 className="ed-section-title">Unit Conversion Quick Reference</h2>
          <div className="ed-grid-2" style={{ marginBottom: '32px' }}>
            <div className="ed-cell">
              <p className="ed-cell-title">Weight</p>
              <ul className="ed-list">
                <li>1 kg = 1,000 g</li>
                <li>1 g = 1,000 mg</li>
                <li>1 mg = 1,000 mcg</li>
                <li>1 mcg = 1,000 ng</li>
                <li>500 mcg = 0.5 mg</li>
              </ul>
            </div>
            <div className="ed-cell">
              <p className="ed-cell-title">Volume</p>
              <ul className="ed-list">
                <li>1 L = 1,000 ml</li>
                <li>1 ml = 1,000 microlitres (μL)</li>
                <li>5 ml ≈ 1 teaspoon</li>
              </ul>
            </div>
          </div>

          {/* Safety reminders */}
          <p className="ed-redflags-label">Calculation safety reminders</p>
          <div className="ed-redflags">
            {[
              'Always double-check paediatric calculations',
              'NEVER write "U" for units',
              'NEVER write "μg" — looks like mg',
              'Check max dose before giving',
              'If answer seems odd — recheck',
              'Unsure? Ask a pharmacist',
            ].map(flag => <span key={flag} className="ed-red-pill">{flag}</span>)}
          </div>
        </>
    </EditorialLayout>
  );
}
