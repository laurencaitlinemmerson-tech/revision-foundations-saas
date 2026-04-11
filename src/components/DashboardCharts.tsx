'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { STORAGE_KEYS } from './DashboardWidgets';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  studyDates: string[];
}

interface SessionStats {
  totalSessions: number;
  totalQuestions: number;
  totalOsceStations: number;
  weekSessions: number[];
  lastWeekTotal: number;
}

interface WeakTopic {
  topic: string;
  score: number;
  attempts: number;
  lastSeen: string;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// ─────────────────────────────────────────────
// COLOUR PALETTE — soft, "cute" editorial
// ─────────────────────────────────────────────

const CHART_COLOURS = [
  '#D4A574', // warm caramel
  '#8BBCAA', // soft sage
  '#C89BB0', // muted rose
  '#7BA7CC', // gentle blue
  '#D4B896', // sand
  '#A3C4BC', // seafoam
  '#D9A7A7', // blush
  '#9BB5D4', // periwinkle
];

// ─────────────────────────────────────────────
// ANIMATED PIE / DONUT CHART (pure SVG)
// ─────────────────────────────────────────────

interface PieSlice {
  label: string;
  value: number;
  colour: string;
}

function DonutChart({
  slices,
  size = 160,
  thickness = 28,
  centreLabel,
  centreValue,
}: {
  slices: PieSlice[];
  size?: number;
  thickness?: number;
  centreLabel?: string;
  centreValue?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  let accumulated = 0;

  return (
    <div ref={ref} style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={thickness}
        />
        {/* Slices */}
        {slices.map((slice, i) => {
          const pct = total > 0 ? slice.value / total : 0;
          const dashLength = pct * circumference;
          const dashOffset = -(accumulated / total) * circumference;
          accumulated += slice.value;

          return (
            <motion.circle
              key={i}
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke={slice.colour}
              strokeWidth={thickness}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={total > 0 ? dashOffset : 0}
              strokeLinecap="butt"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            />
          );
        })}
      </svg>
      {/* Centre text */}
      {(centreLabel || centreValue) && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          {centreValue && (
            <motion.p
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '28px', fontStyle: 'italic', fontWeight: 400,
                color: '#1A1815', lineHeight: 1, margin: 0,
              }}
            >
              {centreValue}
            </motion.p>
          )}
          {centreLabel && (
            <p style={{
              fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#9C8878', margin: '4px 0 0', fontWeight: 400,
            }}>
              {centreLabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MINI BAR CHART (horizontal)
// ─────────────────────────────────────────────

function HorizontalBarChart({
  items,
}: {
  items: { label: string; value: number; maxValue: number; colour: string }[];
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {items.map((item, i) => (
        <div key={i}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: '4px',
          }}>
            <span style={{
              fontSize: '12px', fontWeight: 300, color: '#2C2A27',
            }}>
              {item.label}
            </span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '14px', fontStyle: 'italic', color: '#1A1815',
            }}>
              {item.value}
            </span>
          </div>
          <div style={{
            height: '6px', background: 'rgba(0,0,0,0.04)', borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <motion.div
              style={{
                height: '100%', borderRadius: '3px', background: item.colour,
              }}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${Math.min((item.value / item.maxValue) * 100, 100)}%` } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// WEEKLY ACTIVITY GRAPH (vertical bars with dots)
// ─────────────────────────────────────────────

function WeeklyBarGraph({ sessions }: { sessions: number[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const maxVal = Math.max(...sessions, 1);
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div ref={ref}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px',
        padding: '0 4px', marginBottom: '8px',
      }}>
        {sessions.map((val, i) => {
          const pct = Math.max((val / maxVal) * 100, val > 0 ? 12 : 4);
          const isToday = i === todayIdx;
          return (
            <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
              {val > 0 && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.06 + 0.5 }}
                  style={{
                    fontSize: '10px', color: '#9C8878', fontWeight: 300,
                    marginBottom: '4px',
                  }}
                >
                  {val}
                </motion.span>
              )}
              <motion.div
                style={{
                  width: '100%', maxWidth: '28px',
                  borderRadius: '4px 4px 2px 2px',
                  background: isToday
                    ? 'linear-gradient(180deg, #D4A574 0%, #C89570 100%)'
                    : val > 0
                    ? 'linear-gradient(180deg, #8BBCAA 0%, #7BAA98 100%)'
                    : 'rgba(0,0,0,0.04)',
                }}
                initial={{ height: 0 }}
                animate={isInView ? { height: `${pct}%` } : {}}
                transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '6px', padding: '0 4px' }}>
        {DAYS.map((d, i) => (
          <span key={i} style={{
            flex: 1, textAlign: 'center',
            fontSize: '9px', letterSpacing: '0.04em',
            color: i === todayIdx ? '#1A1815' : 'rgba(0,0,0,0.3)',
            fontWeight: i === todayIdx ? 500 : 300,
          }}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LEGEND
// ─────────────────────────────────────────────

function ChartLegend({ items }: { items: { label: string; colour: string; value?: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: item.colour, flexShrink: 0,
          }} />
          <span style={{
            fontSize: '12px', fontWeight: 300, color: '#2C2A27', flex: 1,
          }}>
            {item.label}
          </span>
          {item.value && (
            <span style={{
              fontSize: '12px', fontWeight: 400, color: '#1A1815',
            }}>
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════
// EXPORTED DASHBOARD CHART CARDS
// ═════════════════════════════════════════════

// ─────────────────────────────────────────────
// 1. STUDY BREAKDOWN PIE CHART
// ─────────────────────────────────────────────

export function StudyBreakdownChart() {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const s = load<SessionStats>(STORAGE_KEYS.stats, {
      totalSessions: 0, totalQuestions: 0, totalOsceStations: 0,
      weekSessions: Array(7).fill(0), lastWeekTotal: 0,
    });
    setStats(s);
  }, []);

  if (!stats) return null;

  const hasData = stats.totalQuestions > 0 || stats.totalOsceStations > 0;

  const slices: PieSlice[] = hasData
    ? [
        { label: 'Quiz questions', value: stats.totalQuestions, colour: CHART_COLOURS[0] },
        { label: 'OSCE stations', value: stats.totalOsceStations, colour: CHART_COLOURS[1] },
      ]
    : [
        { label: 'Quiz questions', value: 60, colour: CHART_COLOURS[0] },
        { label: 'OSCE stations', value: 40, colour: CHART_COLOURS[1] },
      ];

  const total = stats.totalQuestions + stats.totalOsceStations;

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{
        padding: '24px',
        background: 'white',
        border: '0.5px solid rgba(0,0,0,0.08)',
      }}
    >
      <p style={{
        fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
        color: '#9C8878', marginBottom: '18px',
      }}>
        Study breakdown
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '28px',
        flexWrap: 'wrap',
      }}>
        <DonutChart
          slices={slices}
          size={140}
          thickness={24}
          centreValue={hasData ? String(total) : '—'}
          centreLabel={hasData ? 'total' : 'no data yet'}
        />
        <div style={{ flex: 1, minWidth: '120px' }}>
          <ChartLegend
            items={slices.map(s => ({
              label: s.label,
              colour: s.colour,
              value: hasData ? String(s.value) : '—',
            }))}
          />
          {!hasData && (
            <p style={{
              fontSize: '11px', fontWeight: 300, color: '#9C8878',
              marginTop: '12px', lineHeight: 1.6,
            }}>
              Start a quiz or OSCE session and this chart will fill in automatically.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 2. WEEKLY ACTIVITY CHART
// ─────────────────────────────────────────────

export function WeeklyActivityChart() {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setStats(load<SessionStats>(STORAGE_KEYS.stats, {
      totalSessions: 0, totalQuestions: 0, totalOsceStations: 0,
      weekSessions: Array(7).fill(0), lastWeekTotal: 0,
    }));
  }, []);

  if (!stats) return null;

  const thisWeek = stats.weekSessions.reduce((a, b) => a + b, 0);
  const lastWeek = stats.lastWeekTotal;
  const diff = thisWeek - lastWeek;

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{
        padding: '24px',
        background: 'white',
        border: '0.5px solid rgba(0,0,0,0.08)',
      }}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '18px',
      }}>
        <p style={{
          fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#9C8878', margin: 0,
        }}>
          Weekly activity
        </p>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px', fontStyle: 'italic', color: '#1A1815',
            lineHeight: 1, margin: 0,
          }}>
            {thisWeek}
          </p>
          <p style={{
            fontSize: '10px', color: diff > 0 ? '#1C7A67' : diff < 0 ? '#A14A57' : '#9C8878',
            fontWeight: 300, margin: '2px 0 0',
          }}>
            {diff > 0 ? `+${diff} vs last week` : diff < 0 ? `${diff} vs last week` : 'same as last week'}
          </p>
        </div>
      </div>

      <WeeklyBarGraph sessions={stats.weekSessions} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 3. TOPIC STRENGTH CHART
// ─────────────────────────────────────────────

export function TopicStrengthChart() {
  const [topics, setTopics] = useState<WeakTopic[]>([]);
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setMounted(true);
    setTopics(load<WeakTopic[]>(STORAGE_KEYS.weakTopics, []));
  }, []);

  if (!mounted) return null;

  const hasData = topics.length > 0;

  const displayTopics = hasData
    ? topics.slice(0, 5)
    : [
        { topic: 'Respiratory', score: 72, attempts: 3, lastSeen: '' },
        { topic: 'Medications', score: 55, attempts: 2, lastSeen: '' },
        { topic: 'Pathophysiology', score: 40, attempts: 1, lastSeen: '' },
        { topic: 'Assessment', score: 85, attempts: 4, lastSeen: '' },
      ];

  const maxScore = 100;

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{
        padding: '24px',
        background: 'white',
        border: '0.5px solid rgba(0,0,0,0.08)',
      }}
    >
      <p style={{
        fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
        color: '#9C8878', marginBottom: '18px',
      }}>
        {hasData ? 'Topic strength' : 'Topic strength (preview)'}
      </p>

      <HorizontalBarChart
        items={displayTopics.map((t, i) => ({
          label: t.topic,
          value: t.score,
          maxValue: maxScore,
          colour: t.score >= 80 ? '#8BBCAA' : t.score >= 50 ? '#D4A574' : '#C89BB0',
        }))}
      />

      {!hasData && (
        <p style={{
          fontSize: '11px', fontWeight: 300, color: '#9C8878',
          marginTop: '14px', lineHeight: 1.6, fontStyle: 'italic',
        }}>
          This is sample data. Complete quiz sessions to see your real topic scores here.
        </p>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 4. MOCK EXAM PROGRESS DONUT
// ─────────────────────────────────────────────

export function MockExamProgressChart() {
  const [mockData, setMockData] = useState<{ answered: number; total: number; wordCount: number } | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    // Read mock progress from localStorage
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('rf_mock_v2_bronchiolitis');
      if (raw) {
        const progress = JSON.parse(raw);
        const answers = progress.answers || {};
        const answered = Object.values(answers).filter((a: unknown) => {
          const text = a as string;
          return text && text.trim().split(/\s+/).filter(Boolean).length > 0;
        }).length;
        const wordCount = Object.values(answers).reduce((sum: number, a: unknown) => {
          const text = a as string;
          return sum + (text ? text.trim().split(/\s+/).filter(Boolean).length : 0);
        }, 0);
        setMockData({ answered, total: 8, wordCount });
      }
    } catch { /* ignore */ }
  }, []);

  const answered = mockData?.answered || 0;
  const total = mockData?.total || 8;
  const wordCount = mockData?.wordCount || 0;
  const hasData = answered > 0;

  const slices: PieSlice[] = [
    { label: 'Answered', value: answered, colour: '#8BBCAA' },
    { label: 'Remaining', value: total - answered, colour: 'rgba(0,0,0,0.04)' },
  ];

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{
        padding: '24px',
        background: 'white',
        border: '0.5px solid rgba(0,0,0,0.08)',
      }}
    >
      <p style={{
        fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
        color: '#9C8878', marginBottom: '18px',
      }}>
        Mock exam progress
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '24px',
        flexWrap: 'wrap',
      }}>
        <DonutChart
          slices={slices}
          size={120}
          thickness={20}
          centreValue={`${answered}/${total}`}
          centreLabel="questions"
        />
        <div style={{ flex: 1, minWidth: '100px' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '20px', fontStyle: 'italic', color: '#1A1815',
                lineHeight: 1, margin: 0,
              }}>
                {hasData ? wordCount.toLocaleString() : '—'}
              </p>
              <p style={{
                fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#9C8878', margin: '4px 0 0',
              }}>
                words written
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '20px', fontStyle: 'italic', color: '#1A1815',
                lineHeight: 1, margin: 0,
              }}>
                {hasData ? `${Math.round((answered / total) * 100)}%` : '—'}
              </p>
              <p style={{
                fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#9C8878', margin: '4px 0 0',
              }}>
                complete
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
