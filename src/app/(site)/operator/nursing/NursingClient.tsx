'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useOperatorState } from '@/lib/useOperatorState';
import ShiftLog from './ShiftLog';
import { useNotionLive, type LiveState } from './useNotionLive';
import '../../dashboard/dashboard-premium.css';
import './nursing.css';
import {
  AS_OF, BANK, CASE_STUDY, DEADLINES, DEGREE, FEEDBACK, HOURS, NMC_HOURS, NOTION_URL, PLACEMENTS,
  PLACEMENT_GUIDES, PLACEMENT_NOTES, PLACEMENT_WHY, PLACEMENT_PREP, ROTA, Y1_SESSIONS_DONE, Y2_SESSIONS, YEARS,
  type Deadline, type Module, type Placement, type Shift,
} from './nursingData';

const PREP_KEY = 'nursing-placement-prep-v1';
const TASKS_KEY = 'nursing-case-tasks-v1';
const DAY = 86_400_000;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const parse = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const daysFrom = (iso: string, today: Date) => Math.round((parse(iso).getTime() - today.getTime()) / DAY);
const weeksBetween = (a: string, b: string) => Math.max(1, Math.round((parse(b).getTime() - parse(a).getTime() + DAY) / (7 * DAY)));
const fmt = (iso: string, withYear = false) =>
  parse(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) });
const fmtLong = (iso: string) => parse(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const range = (p: Placement) => (p.start && p.end ? `${fmt(p.start)} – ${fmt(p.end, true)}` : 'Dates to be confirmed');
const classOf = (pct: number) => (pct >= 70 ? '1st' : pct >= 60 ? '2:1' : pct >= 50 ? '2:2' : pct >= 40 ? '3rd' : 'Fail');
const num = (n: number) => n.toLocaleString('en-GB');
const when = (d: number | null) =>
  d === null ? '' : d === 0 ? 'today' : d === 1 ? 'tomorrow' : d > 0 ? `in ${d} days` : `${Math.abs(d)} days ago`;

type Status = 'complete' | 'current' | 'upcoming' | 'tbc';
function statusOf(p: Placement, today: Date | null): Status {
  if (!p.start || !p.end) return 'tbc';
  if (!today) return 'upcoming';
  if (parse(p.end).getTime() < today.getTime()) return 'complete';
  if (parse(p.start).getTime() <= today.getTime()) return 'current';
  return 'upcoming';
}

function Heading({ label, context, id }: { label: string; context?: string; id?: string }) {
  const words = label.split(' ');
  const last = words.pop();
  return (
    <div className="dash-section-head" id={id}>
      <span className="dash-section-bar" aria-hidden="true" />
      <h2 className="dash-section-title">
        {words.length ? `${words.join(' ')} ` : ''}<em>{last}</em>
      </h2>
      {context && <p className="dash-section-context">{context}</p>}
    </div>
  );
}

function loadTicks(key: string, size: number): boolean[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const saved = JSON.parse(raw) as boolean[];
      return Array.from({ length: size }, (_, i) => Boolean(saved[i]));
    }
  } catch {
    /* first visit or blocked storage */
  }
  return Array.from({ length: size }, () => false);
}
function saveTicks(key: string, ticks: boolean[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(ticks));
  } catch {
    /* ignore */
  }
}

export default function NursingClient() {
  const live = useNotionLive();
  const { deadlines, rota, hours, sessions } = live;
  const [today, setToday] = useState<Date | null>(null);
  const [prep, setPrep, prepStatus] = useOperatorState<boolean[]>('nursing.prep', PLACEMENT_PREP.map(() => false));
  const [tasks, setTasks] = useOperatorState<boolean[]>('nursing.caseTasks', CASE_STUDY.tasks.map(() => false));
  const [showRota, setShowRota] = useState(false);

  useEffect(() => {
    setToday(startOfDay(new Date()));
  }, []);

  // One-off: carry over ticks saved in this browser before they synced.
  useEffect(() => {
    if (prepStatus === 'loading') return;
    const oldPrep = loadTicks(PREP_KEY, PLACEMENT_PREP.length);
    if (oldPrep.some(Boolean) && !prep.some(Boolean)) setPrep(oldPrep);
    const oldTasks = loadTicks(TASKS_KEY, CASE_STUDY.tasks.length);
    if (oldTasks.some(Boolean) && !tasks.some(Boolean)) setTasks(oldTasks);
    try {
      window.localStorage.removeItem(PREP_KEY);
      window.localStorage.removeItem(TASKS_KEY);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prepStatus === 'loading']);

  const toggle = (which: 'prep' | 'tasks', i: number) => {
    const setter = which === 'prep' ? setPrep : setTasks;
    setter((cur) => cur.map((v, j) => (j === i ? !v : v)));
  };

  const hour = today ? new Date().getHours() : 12;
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const nextPlacement = useMemo(() => {
    const live = PLACEMENTS.filter((p) => p.start && p.end && ['current', 'upcoming'].includes(statusOf(p, today)))
      .sort((a, b) => (a.start as string).localeCompare(b.start as string));
    return live[0] ?? null;
  }, [today]);
  const nextStatus = nextPlacement ? statusOf(nextPlacement, today) : null;

  const upcomingShifts: Shift[] = useMemo(
    () => (today ? rota.filter((s) => daysFrom(s.date, today) >= 0) : rota),
    [today],
  );
  const nextShift = upcomingShifts[0] ?? null;
  const daysToShift = nextShift && today ? daysFrom(nextShift.date, today) : null;

  const upcomingDeadlines: Deadline[] = useMemo(
    () => (today ? deadlines.filter((d) => daysFrom(d.date, today) >= 0) : deadlines),
    [today],
  );
  const nextDeadline = upcomingDeadlines[0] ?? null;
  const daysToDeadline = nextDeadline && today ? daysFrom(nextDeadline.date, today) : null;

  const donePlacements = PLACEMENTS.filter((p) => statusOf(p, today) === 'complete').length;
  const y1 = YEARS[0];
  const y1Credits = y1.modules.reduce((s, m) => s + (m.grade ? m.credits : 0), 0);
  const y1Average = Math.round(y1.modules.reduce((s, m) => s + (m.grade ? m.grade * m.credits : 0), 0) / y1Credits);
  const creditPct = Math.round((DEGREE.earnedCredits / DEGREE.totalCredits) * 100);
  const signedOff = hours.signedOff.clinical + hours.signedOff.simulated + hours.signedOff.rpl;
  const planned = hours.y2Planned.placements + hours.y2Planned.simulated;
  const sessionsTotal = sessions.reduce((s, m) => s + m.done + m.inProgress + m.todo, 0);
  const sessionsDone = sessions.reduce((s, m) => s + m.done, 0);
  const sessionsProg = sessions.reduce((s, m) => s + m.inProgress, 0);
  const prepDone = prep.filter(Boolean).length;
  const overBy = CASE_STUDY.words - CASE_STUDY.limit;

  const dateChip = today ? today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : '';

  return (
    <div className="dash-shell ns-page">
      <div className="ns-container">
        <nav className="ns-nav ns-nav-split" aria-label="Operator">
          <Link href="/operator" className="ns-back"><span aria-hidden="true">&larr;</span> Training</Link>
          <Link href="/operator/study" className="ns-back">Study &amp; today <span aria-hidden="true">&rarr;</span></Link>
        </nav>

        {/* ── Hero ── */}
        <header className="ns-hero">
          <p className="ns-kicker">Operator &middot; Nursing</p>
          <h1 className="ns-title">{greeting}, <em>Lauren</em>.</h1>
          <p className="ns-lede">
            {DEGREE.course} at {DEGREE.university}. Your shifts, deadlines, hours and results in one place, with the guides that go with them.
          </p>
          <p className="ns-byline">{dateChip ? `${dateChip} \u00b7 ` : ''}Year {DEGREE.currentYear} of {DEGREE.totalYears} &middot; Private</p>
          <p className={`ns-live ns-live-${live.state}`}>{liveText(live.state, live.fetchedAt, Object.keys(live.errors))}</p>
          <svg className="dash-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,30 L180,30 L196,30 L204,24 L212,30 L232,30 L238,36 L246,4 L254,44 L260,30 L280,30 L296,20 L312,30 L520,30 L536,30 L544,24 L552,30 L572,30 L578,36 L586,4 L594,44 L600,30 L620,30 L636,20 L652,30 L1000,30" fill="none" />
          </svg>
          <nav className="ns-jump" aria-label="On this page">
            {[['up-next', 'Next shift'], ['shiftlog', 'Shift log'], ['deadlines', 'Deadlines'], ['case-study', 'Case study'], ['hours', 'Hours'], ['placements', 'Placements'], ['learnt', 'What I\'ve learnt'], ['this-year', 'This year'], ['results', 'Results']].map(([id, label]) => (
              <a key={id} href={`#${id}`}>{label}</a>
            ))}
          </nav>
        </header>

        {/* ── Key figures ── */}
        <div className="ns-stats">
          <div className="dash-stat-card">
            <p className="dash-stat-label">Next shift</p>
            <p className="dash-stat-value">{daysToShift === null ? '—' : daysToShift === 0 ? 'Today' : daysToShift}</p>
            <p className="dash-stat-unit">{nextShift ? `${daysToShift === 1 ? 'day' : 'days'} · ${fmtLong(nextShift.date)}, ${nextShift.start}` : 'no shifts left on the rota'}</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-label">Next deadline</p>
            <p className="dash-stat-value">{daysToDeadline === null ? '—' : daysToDeadline}</p>
            <p className="dash-stat-unit">{nextDeadline ? `days · ${nextDeadline.title}, ${fmt(nextDeadline.date)}` : 'nothing due'}</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-label">Practice hours</p>
            <p className="dash-stat-value">{num(signedOff)}<span className="ns-of">/{num(NMC_HOURS)}</span></p>
            <p className="dash-stat-unit">{Math.round((signedOff / NMC_HOURS) * 100)}% of the NMC requirement, signed off</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-label">Year 1 average</p>
            <p className="dash-stat-value">{y1Average}%</p>
            <p className="dash-stat-unit">first-class range · {y1Credits} credits</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-label">Credits</p>
            <p className="dash-stat-value">{DEGREE.earnedCredits}<span className="ns-of">/{DEGREE.totalCredits}</span></p>
            <p className="dash-stat-unit">{creditPct}% of the degree · {donePlacements}/{PLACEMENTS.length} placements</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-label">Year 2 sessions</p>
            <p className="dash-stat-value">{sessionsDone}<span className="ns-of">/{sessionsTotal}</span></p>
            <p className="dash-stat-unit">{sessionsProg} in progress · {Y1_SESSIONS_DONE} done in Year 1</p>
          </div>
        </div>

        {/* ── Up next ── */}
        {nextPlacement && (
          <section className="ns-step">
            <Heading label="Next shift" id="up-next" context={nextStatus === 'current' ? 'Placement in progress' : 'Placement starts soon'} />
            <div className="ns-next">
              <div className="ns-next-main">
                <p className="ns-eyebrow">Year {nextPlacement.year} placement · {nextPlacement.name}{nextPlacement.specialty ? ` · ${nextPlacement.specialty}` : ''}</p>
                {nextShift ? (
                  <>
                    <h3 className="ns-next-title">{fmtLong(nextShift.date)}</h3>
                    <p className="ns-next-dates">{nextShift.start}–{nextShift.end} · {nextShift.ward} · {when(daysToShift)}</p>
                  </>
                ) : (
                  <h3 className="ns-next-title">{nextPlacement.name}</h3>
                )}
                <p className="ns-next-meta">
                  {range(nextPlacement)}
                  {nextPlacement.start && nextPlacement.end ? ` · ${weeksBetween(nextPlacement.start, nextPlacement.end)} weeks` : ''}
                </p>

                <div className="ns-meter">
                  <div className="ns-meter-top"><span>Placement 1 hours</span><span>{hours.placement1.rostered} of {hours.placement1.required} rostered</span></div>
                  <div className="ns-meter-bar" aria-hidden="true"><span style={{ width: `${(hours.placement1.rostered / hours.placement1.required) * 100}%` }} /></div>
                  <p className="ns-meter-note">{hours.placement1.balance}h still to find. The 19 rostered long days come to {hours.placement1.rostered}h, and Part 2 needs {hours.placement1.required}h.</p>
                </div>

                <div className="ns-guides">
                  <p className="ns-eyebrow">Revise before you go</p>
                  {[...(nextPlacement.guides ?? []), ...PLACEMENT_GUIDES].map((g) => (
                    <Link key={g.href} href={g.href} className="ns-link">
                      <span>{g.label}</span><span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="ns-prep">
                <div className="ns-prep-head">
                  <p className="ns-eyebrow">Before you start</p>
                  <span className="ns-prep-count">{prepDone}/{PLACEMENT_PREP.length}</span>
                </div>
                <div className="ns-prep-bar" aria-hidden="true"><span style={{ width: `${(prepDone / PLACEMENT_PREP.length) * 100}%` }} /></div>
                <ul className="ns-checks">
                  {PLACEMENT_PREP.map((item, i) => (
                    <li key={item}>
                      <label className={prep[i] ? 'is-done' : ''}>
                        <input type="checkbox" checked={prep[i]} onChange={() => toggle('prep', i)} />
                        <span>{item}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="ns-rota">
              <div className="ns-rota-head">
                <p className="ns-eyebrow">Your rota</p>
                <button type="button" className="ns-toggle" onClick={() => setShowRota((v) => !v)}>
                  {showRota ? 'Show fewer' : `Show all ${rota.length} shifts`}
                </button>
              </div>
              <ul className="ns-shifts">
                {(showRota ? rota : upcomingShifts.slice(0, 6)).map((s, i) => {
                  const d = today ? daysFrom(s.date, today) : null;
                  const past = d !== null && d < 0;
                  return (
                    <li key={s.date} className={`${past ? 'is-past' : ''}${!showRota && i === 0 ? ' is-next' : ''}`}>
                      <span className="ns-shift-date">{fmtLong(s.date)}</span>
                      <span className="ns-shift-time">{s.start}–{s.end}</span>
                      <span className="ns-shift-ward">{s.ward}{s.missingHours ? ' · hours not entered' : ''}</span>
                      <span className="ns-shift-when">{when(d)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        {/* ── Shift log ── */}
        <section className="ns-step">
          <Heading label="Shift log" id="shiftlog" context="Saved across devices" />
          <ShiftLog rota={rota} />
        </section>

        {/* ── Deadlines ── */}
        <section className="ns-step">
          <Heading label="Coming up" id="deadlines" context={`${upcomingDeadlines.length} assessments this year`} />
          <div className="ns-deadlines">
            {deadlines.map((d) => {
              const days = today ? daysFrom(d.date, today) : null;
              const dt = parse(d.date);
              return (
                <article key={d.id} className={`ns-deadline${d.id === nextDeadline?.id ? ' is-next' : ''}`}>
                  <div className="ns-deadline-date" aria-hidden="true">
                    <span>{dt.toLocaleDateString('en-GB', { day: 'numeric' })}</span>
                    <em>{dt.toLocaleDateString('en-GB', { month: 'short' })}</em>
                    <small>{dt.getFullYear()}</small>
                  </div>
                  <div className="ns-deadline-body">
                    <div className="ns-deadline-top">
                      <h3>{d.title}</h3>
                      <span className="ns-chip">{d.module}</span>
                      {d.priority && <span className={`ns-prio ns-prio-${d.priority.toLowerCase()}`}>{d.priority}</span>}
                    </div>
                    <p className="ns-deadline-meta">
                      {d.kind}{d.weight !== undefined && d.weight > 0 ? ` · ${d.weight}% of the module` : ''}{d.time ? ` · ${d.time}` : ''} · {d.status}
                    </p>
                    <p className="ns-deadline-detail">{d.detail}</p>
                  </div>
                  <div className="ns-deadline-when">{when(days)}</div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Case study workbench ── */}
        <section className="ns-step">
          <Heading label="Case study" id="case-study" context="5KNIC011 · 50% of the module" />
          <div className="ns-case">
            <div className="ns-case-main">
              <p className="ns-eyebrow">Word count</p>
              <p className="ns-case-num">{num(CASE_STUDY.words)}<span className="ns-of"> / {num(CASE_STUDY.limit)}</span></p>
              <div className="ns-meter-bar ns-meter-over" aria-hidden="true">
                <span style={{ width: `${Math.min(100, (CASE_STUDY.limit / CASE_STUDY.words) * 100)}%` }} />
              </div>
              <p className="ns-meter-note">
                {overBy > 0 ? `${overBy} words over the limit.` : `${Math.abs(overBy)} words under.`} Drafting at around {CASE_STUDY.expectedMark}%.
              </p>
              <p className="ns-eyebrow" style={{ marginTop: 22 }}>The question</p>
              <p className="ns-case-brief">
                Analyse how two or three WHO-defined social determinants of health affect a child or young person with a long-term condition and their family.
              </p>
            </div>
            <div className="ns-case-tasks">
              <p className="ns-eyebrow">Before you submit</p>
              <ul className="ns-checks ns-checks-detail">
                {CASE_STUDY.tasks.map((t, i) => {
                  const d = today ? daysFrom(t.date, today) : null;
                  const overdue = !tasks[i] && d !== null && d < 0;
                  return (
                    <li key={t.id}>
                      <label className={tasks[i] ? 'is-done' : ''}>
                        <input type="checkbox" checked={tasks[i]} onChange={() => toggle('tasks', i)} />
                        <span>
                          <strong>{t.title}</strong>
                          <em className={overdue ? 'is-late' : ''}>{overdue ? `Due ${fmt(t.date)}, overdue` : `Due ${fmt(t.date)}`}</em>
                          <small>{t.detail}</small>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <p className="ns-foot">Ticks here are saved on this device only. They don&apos;t change Notion.</p>
            </div>
          </div>
        </section>

        {/* ── Hours ── */}
        <section className="ns-step">
          <Heading label="Practice hours" id="hours" context={`${num(NMC_HOURS)} needed for the NMC`} />
          <div className="ns-hours">
            <div className="ns-hours-bar" role="img" aria-label={`${signedOff} hours signed off, ${planned} planned for Year 2, out of ${NMC_HOURS}`}>
              <span className="ns-h-clinical" style={{ width: `${(hours.signedOff.clinical / NMC_HOURS) * 100}%` }} />
              <span className="ns-h-sim" style={{ width: `${(hours.signedOff.simulated / NMC_HOURS) * 100}%` }} />
              <span className="ns-h-rpl" style={{ width: `${(hours.signedOff.rpl / NMC_HOURS) * 100}%` }} />
              <span className="ns-h-plan" style={{ width: `${(planned / NMC_HOURS) * 100}%` }} />
            </div>
            <div className="ns-hours-key">
              <span><i className="ns-h-clinical" />Clinical shifts {hours.signedOff.clinical}h</span>
              <span><i className="ns-h-sim" />Simulated {hours.signedOff.simulated}h</span>
              <span><i className="ns-h-rpl" />Prior learning {hours.signedOff.rpl}h</span>
              <span><i className="ns-h-plan" />Year 2 planned {planned}h</span>
            </div>
            <div className="ns-hours-grid">
              <div><p className="ns-eyebrow">Signed off</p><p className="ns-h-num">{num(signedOff)}h</p><p className="ns-h-sub">Year 1: {hours.y1Shifts.longDays} long days and {hours.y1Shifts.nights} nights, plus simulated and prior learning</p></div>
              <div><p className="ns-eyebrow">Planned for Year 2</p><p className="ns-h-num">{num(planned)}h</p><p className="ns-h-sub">{hours.y2Planned.placements}h of placements and {hours.y2Planned.simulated}h of KCL simulation</p></div>
              <div><p className="ns-eyebrow">After Year 2</p><p className="ns-h-num">{num(signedOff + planned)}h</p><p className="ns-h-sub">{Math.round(((signedOff + planned) / NMC_HOURS) * 100)}% of {num(NMC_HOURS)}, with Year 3 still to come</p></div>
            </div>
          </div>
        </section>

        {/* ── Placements ── */}
        <section className="ns-step">
          <Heading label="Your placements" id="placements" context={`${PLACEMENTS.length} across the degree`} />
          <div className="ns-rows">
            {PLACEMENTS.map((p) => {
              const st = statusOf(p, today);
              const label =
                st === 'complete' ? 'Complete'
                : st === 'current' ? 'In progress'
                : st === 'tbc' ? 'Dates TBC'
                : p.start && today ? `In ${daysFrom(p.start, today)} days` : 'Upcoming';
              return (
                <div key={p.name} className={`ns-row ns-row-${st}`}>
                  <span className="ns-row-year">Y{p.year}</span>
                  <span className="ns-row-main">
                    <span className="ns-row-title">{p.name}</span>
                    <span className="ns-row-sub">{p.specialty ?? 'Specialty to be confirmed'}</span>
                  </span>
                  <span className="ns-row-dates">
                    {range(p)}
                    {p.start && p.end && <span className="ns-row-weeks">{weeksBetween(p.start, p.end)} weeks</span>}
                  </span>
                  <span className={`ns-pill ns-pill-${st}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── What I've learnt ── */}
        <section className="ns-step">
          <Heading label="What I've learnt" id="learnt" context="By specialty" />
          <LearntSection />
        </section>

        {/* ── Year 2 ── */}
        <section className="ns-step">
          <Heading label="This year" id="this-year" context="Year 2 · 2026–27" />
          <div className="ns-sessions">
            <p className="ns-eyebrow">Lectures, seminars and simulation</p>
            {sessions.map((m) => {
              const total = m.done + m.inProgress + m.todo;
              return (
                <div key={m.code} className="ns-session">
                  <span className="ns-session-name">{m.name}<em>{m.code}</em></span>
                  <div className="ns-session-bar" aria-hidden="true">
                    <span className="ns-s-done" style={{ width: `${(m.done / total) * 100}%` }} />
                    <span className="ns-s-prog" style={{ width: `${(m.inProgress / total) * 100}%` }} />
                  </div>
                  <span className="ns-session-count">{m.done} done · {m.inProgress} in progress · {total} total</span>
                </div>
              );
            })}
          </div>
          <ModuleList modules={YEARS[1].modules} />
          <p className="ns-foot">Dashed marks are the 70% you assume for ungraded work in your degree projection. They turn solid when a result lands.</p>
        </section>

        {/* ── Year 1 results ── */}
        <section className="ns-step">
          <Heading label="Year 1 results" id="results" context={`${y1Average}% average`} />
          <ModuleList modules={y1.modules} results />

          <div className="ns-feedback">
            <p className="ns-eyebrow">What your markers said</p>
            <div className="ns-feedback-grid">
              {FEEDBACK.map((f) => (
                <article key={f.title} className="ns-fb">
                  <div className="ns-fb-head">
                    <h3>{f.title}</h3>
                    <span className="ns-grade-class">{f.mark}% · {classOf(f.mark)}</span>
                  </div>
                  <p className="ns-fb-who">{f.marker}, {f.when}</p>
                  <p className="ns-eyebrow">What worked</p>
                  <ul>{f.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
                  <p className="ns-eyebrow">Carry forward</p>
                  <ul>{f.develop.map((s) => <li key={s}>{s}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Study bank ── */}
        <section className="ns-step">
          <Heading label="Study bank" id="bank" context="From your Notion" />
          <div className="ns-bank">
            <div className="ns-bank-cell"><span>{BANK.conditions}</span><p>conditions in your condition bank</p></div>
            <div className="ns-bank-cell"><span>{BANK.drugs}</span><p>drugs in your paediatric formulary</p></div>
            <div className="ns-bank-cell"><span>{BANK.flashcards}</span><p>flashcards to recall</p></div>
            <div className="ns-bank-links">
              <Link href="/quiz" className="ns-link"><span>Core quiz</span><span aria-hidden="true">→</span></Link>
              <Link href="/osce" className="ns-link"><span>OSCE stations</span><span aria-hidden="true">→</span></Link>
              <Link href="/hub/childrens" className="ns-link"><span>Children&apos;s hub</span><span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        {/* ── Degree map ── */}
        <section className="ns-step">
          <Heading label="The degree" id="degree" context={`${DEGREE.earnedCredits} of ${DEGREE.totalCredits} credits`} />
          <div className="ns-map">
            {YEARS.map((y) => (
              <div key={y.key} className={`ns-map-year ns-map-${y.status}`}>
                <div className="ns-map-bar" aria-hidden="true" />
                <p className="ns-eyebrow">{y.label} · {y.span}</p>
                <p className="ns-map-status">
                  {y.status === 'complete' ? 'Complete' : y.status === 'current' ? 'In progress' : 'Upcoming'}
                </p>
                <ul>
                  {y.modules.filter((m) => m.credits > 0).map((m) => (
                    <li key={m.code + m.title}><span>{m.title}</span><span>{m.credits}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <footer className="ns-end">
          <p>
            Deadlines, hours, rota and lecture progress come live from Notion when connected, and otherwise from the snapshot of {fmt(AS_OF, true)}. Results, placements and the study notes are still snapshots. Countdowns and statuses always update themselves.
          </p>
          <a href={NOTION_URL} target="_blank" rel="noreferrer">Open in Notion →</a>
        </footer>
      </div>
    </div>
  );
}

function ModuleList({ modules, results = false }: { modules: Module[]; results?: boolean }) {
  return (
    <div className="ns-modules">
      {modules.map((m) => {
        const grade = m.grade;
        return (
          <article key={m.code + m.title} className="ns-module">
            <div className="ns-module-head">
              <div>
                <p className="ns-eyebrow">{m.code}{m.credits ? ` · ${m.credits} credits` : ' · pass / fail'}</p>
                <h3 className="ns-module-title">{m.title}</h3>
              </div>
              {results && grade !== undefined && (
                <div className="ns-grade">
                  <span className="ns-grade-num">{grade}%</span>
                  <span className="ns-grade-class">{classOf(grade)}</span>
                </div>
              )}
              {results && m.passFail && <span className="ns-pill ns-pill-complete">Passed</span>}
            </div>
            {results && grade !== undefined && (
              <div className="ns-grade-bar" aria-hidden="true"><span style={{ width: `${grade}%` }} /></div>
            )}
            {m.assessments.length > 0 && (
              <ul className="ns-assess">
                {m.assessments.map((a) => (
                  <li key={a.name} className={a.mark === undefined && a.projected !== undefined ? 'is-projected' : ''}>
                    <span className="ns-assess-name">{a.name}<em>{a.kind}{a.weight ? ` · ${a.weight}%` : ''}</em></span>
                    <span className="ns-assess-mark">
                      {a.mark !== undefined ? `${a.mark}%` : a.projected !== undefined ? `~${a.projected}%` : results ? 'Pass' : 'Pass / fail'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {m.guides && (
              <div className="ns-modguides">
                <p className="ns-eyebrow">Revise on the site</p>
                <div>
                  {m.guides.map((g) => (
                    <Link key={g.href} href={g.href} className="ns-tag">{g.label}</Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function LearntSection() {
  const [open, setOpen] = useState(PLACEMENT_NOTES.length - 1);
  const note = PLACEMENT_NOTES[open];
  const groups = Array.from(new Set(note.conditions.map((c) => c.group)));
  const why = PLACEMENT_WHY[note.name];
  return (
    <div className="ns-learnt">
      <div className="ns-tabs" role="tablist">
        {PLACEMENT_NOTES.map((n, i) => (
          <button key={n.name} type="button" role="tab" aria-selected={i === open} className={i === open ? 'is-on' : ''} onClick={() => setOpen(i)}>
            <span>{n.specialty}</span><em>{n.name}</em>
          </button>
        ))}
      </div>
      <p className="ns-eyebrow">{note.name}{note.setting ? ` \u00b7 ${note.setting}` : ''}{note.prep ? ' \u00b7 Written before the placement' : ''}</p>
      <p className="ns-learnt-intro">{note.intro}</p>

      <div className="ns-cols">
        <div>
          <p className="ns-eyebrow">Worth knowing about {note.specialty.toLowerCase()}</p>
          <ul className="ns-know">
            {note.know.map((k, i) => (
              <li key={k}>{k}{why?.know[i] && <span className="ns-why"><b>Why</b>{why.know[i]}</span>}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="ns-eyebrow">{note.prep ? 'Skills to practise' : 'Skills I practised'}</p>
          <ul className="ns-know">{note.skills.map((k) => <li key={k}>{k}</li>)}</ul>
          {note.said.length > 0 && (
            <>
              <p className="ns-eyebrow" style={{ marginTop: 26 }}>What supervisors said</p>
              <ul className="ns-know">{note.said.map((k) => <li key={k}>{k}</li>)}</ul>
            </>
          )}
        </div>
      </div>

      <p className="ns-eyebrow" style={{ marginTop: 34 }}>{note.prep ? 'Conditions to expect' : 'Conditions I met'}</p>
      {groups.map((g) => (
        <div key={g} className="ns-cond-group">
          <p className="ns-group-name">{g}</p>
          {note.conditions.filter((c) => c.group === g).map((c) => (
            <div key={c.name} className="ns-cond">
              <h3>{c.name}</h3>
              <p>{c.know}</p>
              {why?.cond[c.name] && <p className="ns-why"><b>Why</b>{why.cond[c.name]}</p>}
              <p className="ns-cond-flag"><strong>Red flag</strong> {c.flag}</p>
            </div>
          ))}
        </div>
      ))}

      <p className="ns-eyebrow" style={{ marginTop: 34 }}>{note.prep ? 'Drugs to expect' : 'Drugs I met'}</p>
      <div className="ns-drugs">
        {note.drugs.map((d) => (
          <div key={d.name} className="ns-drug">
            <span className="ns-drug-name">{d.name}</span>
            <span className="ns-drug-cls">{d.cls}</span>
            <span className="ns-drug-use">{d.use}{why?.drug[d.name] && <span className="ns-why"><b>Why</b>{why.drug[d.name]}</span>}</span>
          </div>
        ))}
      </div>

      <div className="ns-learnt-links">
        {note.guides.map((g) => (
          <Link key={g.href} href={g.href} className="ns-tag">{g.label}</Link>
        ))}
      </div>
    </div>
  );
}

function liveText(state: LiveState, at: string | null, failed: string[]) {
  const time = at ? new Date(at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
  if (state === 'live') return `Live from Notion, updated ${time}`;
  if (state === 'partial') return `Live from Notion, updated ${time}. Not shared with the integration yet: ${failed.join(', ')}. Those show the snapshot`;
  if (state === 'loading') return 'Checking Notion\u2026';
  if (state === 'error') return 'Could not reach Notion. Showing the snapshot';
  return `Snapshot of ${fmt(AS_OF, true)}. Add NOTION_TOKEN to make deadlines, hours, rota and lectures live`;
}
