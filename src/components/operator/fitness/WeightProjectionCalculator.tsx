'use client';

import { useState } from 'react';

interface WeightProjectionCalculatorProps {
  currentWeightKg: number;
}

export function WeightProjectionCalculator({ currentWeightKg }: WeightProjectionCalculatorProps) {
  const [targetWeight, setTargetWeight] = useState<number>(Math.max(60, Math.round(currentWeightKg - 5)));
  const [weeklyRate, setWeeklyRate] = useState<number>(0.45); // kg per week

  const weightDiff = Math.max(0, currentWeightKg - targetWeight);
  const weeksNeeded = weeklyRate > 0 ? Math.ceil(weightDiff / weeklyRate) : 0;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + weeksNeeded * 7);

  const formattedTargetDate = targetDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const dailyDeficitKcal = Math.round((weeklyRate * 7700) / 7);

  return (
    <div
      style={{
        padding: '20px 24px',
        background: '#FFFFFF',
        border: '0.5px solid rgba(26,24,21,0.12)',
        borderRadius: '12px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8A4459' }}>
            Interactive Weight Projection
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              color: 'var(--ink)',
              margin: '2px 0 0',
            }}
          >
            Estimate reach date & daily deficit
          </h3>
        </div>
        <span
          style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '999px',
            background: '#F4EFF1',
            color: '#3A2A33',
            whiteSpace: 'nowrap',
          }}
        >
          {weeksNeeded} weeks left
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        {/* Controls Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Target Weight Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#8E8A82', marginBottom: '4px' }}>
              <span>Target Weight</span>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{targetWeight.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min={Math.max(45, Math.floor(currentWeightKg - 15))}
              max={currentWeightKg}
              step={0.5}
              value={targetWeight}
              onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#C06C84', cursor: 'pointer' }}
            />
          </div>

          {/* Weekly Rate Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#8E8A82', marginBottom: '4px' }}>
              <span>Pace / Rate of Loss</span>
              <span style={{ fontWeight: 600, color: '#C06C84' }}>-{weeklyRate.toFixed(2)} kg / wk</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={1.0}
              step={0.05}
              value={weeklyRate}
              onChange={(e) => setWeeklyRate(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#C06C84', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Results Banner Column */}
        <div
          style={{
            padding: '16px 20px',
            background: '#FBFAF8',
            border: '0.5px solid rgba(26,24,21,0.08)',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div>
            <div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A29D95' }}>
              Estimated Target Date
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--ink)', marginTop: '2px' }}>
              {formattedTargetDate}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', paddingTop: '8px', borderTop: '0.5px solid rgba(26,24,21,0.08)' }}>
            <div>
              <div style={{ fontSize: '9.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A29D95' }}>
                Total to Lose
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{weightDiff.toFixed(1)} kg</div>
            </div>
            <div>
              <div style={{ fontSize: '9.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A29D95' }}>
                Est. Daily Deficit
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#C06C84' }}>-{dailyDeficitKcal} kcal/day</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
