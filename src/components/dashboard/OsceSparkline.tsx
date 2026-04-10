'use client';

import { useEffect, useState } from 'react';
import { getOsceScores, type OsceScore } from '@/lib/dashboardTracking';

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";
const ink = '#1A1815';
const mid = '#5A5750';
const muted = '#999';
const borderMid = 'rgba(0,0,0,0.12)';

const SEED_SCORES: OsceScore[] = [
  { date: '2026-03-18', score: 60, stationName: 'Hand Hygiene' },
  { date: '2026-03-21', score: 68, stationName: 'A–E Assessment' },
  { date: '2026-03-25', score: 65, stationName: 'IM Injection' },
  { date: '2026-03-28', score: 74, stationName: 'NG Tube' },
  { date: '2026-04-01', score: 78, stationName: 'Drug Calcs' },
  { date: '2026-04-02', score: 82, stationName: 'A–E Assessment' },
  { date: '2026-04-03', score: 79, stationName: 'Communication' },
];

function Sparkline({ scores }: { scores: OsceScore[] }) {
  if (scores.length < 2) return null;

  const W = 160;
  const H = 44;
  const values = scores.map(s => s.score);
  const min = Math.min(...values) - 8;
  const max = Math.max(...values) + 8;
  const range = max - min || 1;

  const pts = scores
    .map((s, i) => {
      const x = (i / (scores.length - 1)) * W;
      const y = H - ((s.score - min) / range) * H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const last = scores[scores.length - 1].score;
  const prev = scores[scores.length - 2].score;
  const up = last >= prev;
  const lineColor = up ? 'var(--teal-600)' : 'var(--coral-600)';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        <polyline points={pts} fill="none" stroke={lineColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {scores.map((s, i) => {
          const x = (i / (scores.length - 1)) * W;
          const y = H - ((s.score - min) / range) * H;
          return (
            <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={i === scores.length - 1 ? 3.5 : 2} fill={i === scores.length - 1 ? lineColor : '#C8C4BE'} />
          );
        })}
      </svg>
      <div>
        <p style={{ fontFamily: display, fontSize: '2rem', fontStyle: 'italic', fontWeight: 400, lineHeight: 1, color: ink, marginBottom: '4px' }}>
          {last}%
        </p>
        <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.12em', color: muted }}>
          {up ? '↑' : '↓'} last station
        </p>
      </div>
    </div>
  );
}

export default function OsceSparkline() {
  const [scores, setScores] = useState<OsceScore[]>([]);
  const [isPlaceholder, setIsPlaceholder] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const real = getOsceScores();
    if (real.length >= 2) {
      setScores(real);
      setIsPlaceholder(false);
    } else {
      setScores(SEED_SCORES);
      setIsPlaceholder(true);
    }
  }, []);

  if (!mounted) return null;

  const latest = scores[scores.length - 1];

  return (
    <div style={{ border: `0.5px solid ${borderMid}`, background: 'white', padding: '24px 24px 28px' }}>
      <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, marginBottom: '18px' }}>
        OSCE score trend
      </p>
      <Sparkline scores={scores} />
      {latest && (
        <p style={{ fontFamily: serif, fontSize: '11px', color: mid, marginTop: '14px' }}>
          {latest.stationName}
          {isPlaceholder && <span style={{ color: muted }}> · example data until you run stations</span>}
        </p>
      )}
    </div>
  );
}
