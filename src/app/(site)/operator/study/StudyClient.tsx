'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import '../../dashboard/dashboard-premium.css';
import '../nursing/nursing.css';
import './study.css';
import { useOperatorState, type SyncStatus } from '@/lib/useOperatorState';
import { CASE_STUDY } from '../nursing/nursingData';
import { useNotionLive } from '../nursing/useNotionLive';
import { CONFIDENCE_LABEL, EXAMS, REVIEW_DAYS, TOPICS } from './studyData';
import {
  DEFAULT_SETTINGS, completedExtras, daysBetween, dueIn, iso, parse, planDays, readiness, shiftOn, streak,
  type Block, type DoneState, type Settings, type TopicState,
} from './studyLogic';

const SYNC_TEXT: Record<SyncStatus, string> = {
  loading: '',
  synced: 'Synced across your devices',
  saving: 'Saving…',
  local: 'Saved on this device only',
  setup: 'Saved on this device only. Cross-device sync is not set up yet',
  error: 'Could not reach the server. Saved on this device',
};

const fmtDay = (s: string, long = false) =>
  parse(s).toLocaleDateString('en-GB', long ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'short', day: 'numeric' });

function Heading({ label, context }: { label: string; context?: string }) {
  const words = label.split(' ');
  const last = words.pop();
  return (
    <div className="dash-section-head">
      <span className="dash-section-bar" aria-hidden="true" />
      <h2 className="dash-section-title">
        {words.length ? `${words.join(' ')} ` : ''}<em>{last}</em>
      </h2>
      {context && <p className="dash-section-context">{context}</p>}
    </div>
  );
}

export default function StudyClient() {
  const [today, setToday] = useState<string | null>(null);
  const [topics, setTopics, status] = useOperatorState<TopicState>('study.topics', {});
  const [done, setDone] = useOperatorState<DoneState>('study.done', {});
  const [settings, setSettings] = useOperatorState<Settings>('study.settings', DEFAULT_SETTINGS);
  const [tasksDone, setTasksDone] = useOperatorState<boolean[]>('nursing.caseTasks', CASE_STUDY.tasks.map(() => false));
  const [dueOnly, setDueOnly] = useState(false);
  const live = useNotionLive();

  useEffect(() => {
    setToday(iso(new Date()));
  }, []);

  const week = useMemo(() => {
    if (!today) return [];
    const days = planDays(today, topics, tasksDone, settings, 7, { deadlines: live.deadlines, rota: live.rota });
    const extras = completedExtras(today, done, new Set(days[0].blocks.map((b) => b.id)));
    days[0] = { ...days[0], blocks: [...days[0].blocks, ...extras] };
    return days;
  }, [today, topics, tasksDone, settings, done, live.deadlines, live.rota]);
  const todayPlan = week[0];
  const shiftToday = today ? shiftOn(today, live.rota) : null;

  const isDone = (date: string, id: string) => Boolean(done[`${date}|${id}`]);
  const setBlockDone = (date: string, id: string, on: boolean) =>
    setDone((prev) => {
      const next = { ...prev };
      if (on) next[`${date}|${id}`] = true;
      else delete next[`${date}|${id}`];
      return next;
    });

  const rate = (topicId: string, conf: 1 | 2 | 3, blockDate?: string) => {
    if (!today) return;
    setTopics((prev) => ({ ...prev, [topicId]: { conf, last: today } }));
    if (blockDate) setBlockDone(blockDate, `rv:${topicId}`, true);
  };

  const tick = (b: Block, date: string, on: boolean) => {
    if (b.id.startsWith('tk:')) {
      const idx = CASE_STUDY.tasks.findIndex((t) => `tk:${t.id}` === b.id);
      if (idx >= 0) setTasksDone((prev) => prev.map((v, i) => (i === idx ? on : v)));
    }
    setBlockDone(date, b.id, on);
  };

  if (!today || !todayPlan) return <div className="dash-shell ns-page" />;

  const todayBlocks = todayPlan.blocks;
  const doneToday = todayBlocks.filter((b) => isDone(today, b.id)).length;
  const dueCount = TOPICS.filter((t) => (dueIn(t, topics, today) ?? -1) >= 0).length;
  const pharm = readiness('Pharmacology', topics, today);
  const npia = readiness('Nursing Process in Action', topics, today);
  const daysToPharm = daysBetween(today, EXAMS.Pharmacology.date);
  const nextDeadline = live.deadlines.filter((d) => d.date >= today && d.weight !== undefined && d.kind !== 'Feedback')[0];
  const minutes = todayBlocks.reduce((s, b) => s + (isDone(today, b.id) ? 0 : b.minutes), 0);

  const lede = shiftToday
    ? `Shift day on ${shiftToday.ward}, ${shiftToday.start}–${shiftToday.end}. ${todayBlocks.length > 1 ? 'A little study around it, then write up your shift.' : 'Keep it light: write up your shift and rest.'}`
    : todayBlocks.length
      ? `${todayBlocks.length} block${todayBlocks.length === 1 ? '' : 's'} today, about ${minutes} minutes left. The plan puts what is overdue and closest to a deadline first.`
      : 'Nothing is due today. Rate a topic below or take the day.';

  const groups = (['Pharmacology', 'Nursing Process in Action'] as const).map((m) => ({
    module: m,
    items: TOPICS.filter((t) => t.module === m).filter((t) => !dueOnly || (dueIn(t, topics, today) ?? -1) >= 0),
  }));

  return (
    <div className="dash-shell ns-page">
      <div className="ns-container">
        <nav className="ns-nav ns-nav-split" aria-label="Operator">
          <Link href="/operator" className="ns-back"><span aria-hidden="true">&larr;</span> Training</Link>
          <Link href="/operator/nursing" className="ns-back">Nursing <span aria-hidden="true">&rarr;</span></Link>
        </nav>

        <header className="ns-hero">
          <p className="ns-kicker">Operator &middot; Study</p>
          <h1 className="ns-title">Today, <em>{fmtDay(today, true)}</em></h1>
          <p className="ns-lede">{lede}</p>
          <p className="ns-byline">{SYNC_TEXT[status] || 'Loading'}</p>
          <svg className="dash-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,30 L180,30 L196,30 L204,24 L212,30 L232,30 L238,36 L246,4 L254,44 L260,30 L280,30 L296,20 L312,30 L520,30 L536,30 L544,24 L552,30 L572,30 L578,36 L586,4 L594,44 L600,30 L620,30 L636,20 L652,30 L1000,30" fill="none" />
          </svg>
          {status === 'setup' && (
            <p className="st-setup">
              To sync between phone and laptop, run <code>supabase-operator-state.sql</code> once in the Supabase SQL editor. Until then everything is saved on this device.
            </p>
          )}
        </header>

        <div className="ns-stats">
          <div className="dash-stat-card">
            <p className="dash-stat-label">Done today</p>
            <p className="dash-stat-value">{doneToday}<span className="ns-of">/{todayBlocks.length}</span></p>
            <p className="dash-stat-unit">{minutes ? `about ${minutes} min left` : 'all clear'}</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-label">Streak</p>
            <p className="dash-stat-value">{streak(done, today)}</p>
            <p className="dash-stat-unit">{streak(done, today) === 1 ? 'day' : 'days'} in a row</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-label">Topics due</p>
            <p className="dash-stat-value">{dueCount}</p>
            <p className="dash-stat-unit">to revise or rate</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-label">Pharmacology exam</p>
            <p className="dash-stat-value">{daysToPharm}</p>
            <p className="dash-stat-unit">days &middot; {parse(EXAMS.Pharmacology.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-label">Pharmacology ready</p>
            <p className="dash-stat-value">{pharm.pct}%</p>
            <p className="dash-stat-unit">{pharm.rated} of {pharm.taught} taught topics rated</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-label">Next deadline</p>
            <p className="dash-stat-value">{nextDeadline ? daysBetween(today, nextDeadline.date) : '—'}</p>
            <p className="dash-stat-unit">{nextDeadline ? `days · ${nextDeadline.title}` : 'nothing due'}</p>
          </div>
        </div>

        {/* 1 Today */}
        <section className="ns-step">
          <Heading label="Today's plan" context="Ticked blocks are saved" />
          {shiftToday && (
            <div className="st-onshift">
              <span className="ns-eyebrow">On shift</span>
              <strong>{shiftToday.ward}, {shiftToday.start}&ndash;{shiftToday.end}</strong>
              <Link href="/operator/nursing#learnt" className="ns-tag">Skim specialty notes</Link>
            </div>
          )}
          {todayBlocks.length === 0 && <p className="st-empty">Nothing planned. Everything due is up to date.</p>}
          <ul className="st-blocks">
            {todayBlocks.map((b) => {
              const on = isDone(today, b.id);
              return (
                <li key={b.id} className={`st-block st-${b.kind}${on ? ' is-done' : ''}`}>
                  {b.kind === 'review' ? (
                    <span className="st-mark" aria-hidden="true">{on ? '✓' : ''}</span>
                  ) : (
                    <input type="checkbox" checked={on} onChange={() => tick(b, today, !on)} aria-label={`Done: ${b.title}`} />
                  )}
                  <span className="st-block-main">
                    <span className="st-block-title">{b.title}</span>
                    <span className="st-block-sub">{b.sub} &middot; {b.minutes} min</span>
                  </span>
                  {b.href && <Link href={b.href} className="st-open">Open &rarr;</Link>}
                  {b.kind === 'review' && b.topicId && (
                    <span className="st-rate" role="group" aria-label="How did it feel?">
                      {([1, 2, 3] as const).map((c) => (
                        <button key={c} type="button" className={topics[b.topicId!]?.conf === c && topics[b.topicId!]?.last === today ? 'is-on' : ''} onClick={() => rate(b.topicId!, c, today)}>
                          {CONFIDENCE_LABEL[c]}
                        </button>
                      ))}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="ns-foot">For a review block, tap how it felt when you finish: Shaky comes back in {REVIEW_DAYS[1]} days, Okay in {REVIEW_DAYS[2]}, Solid in {REVIEW_DAYS[3]}.</p>
        </section>

        {/* 2 Week */}
        <section className="ns-step">
          <Heading label="This week" context="Planned around your shifts" />
          <div className="st-week">
            {week.map((d) => (
              <div key={d.date} className={`st-day${d.date === today ? ' is-today' : ''}${d.shift ? ' has-shift' : ''}`}>
                <p className="st-day-name">{fmtDay(d.date)}</p>
                {d.shift && <p className="st-day-shift">Shift &middot; {d.shift.ward}</p>}
                <ul>
                  {d.blocks.filter((b) => b.kind !== 'shift').map((b) => (
                    <li key={b.id} className={isDone(d.date, b.id) ? 'is-done' : ''}>{b.title.replace(/^(Revise|Work on|Prepare): /, '')}</li>
                  ))}
                  {d.blocks.filter((b) => b.kind !== 'shift').length === 0 && <li className="st-none">{d.shift ? 'Rest' : 'Free'}</li>}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 3 Readiness */}
        <section className="ns-step">
          <Heading label="Exam readiness" context="From your own ratings" />
          <div className="st-ready">
            {(['Pharmacology', 'Nursing Process in Action'] as const).map((m) => {
              const r = m === 'Pharmacology' ? pharm : npia;
              const left = daysBetween(today, EXAMS[m].date);
              return (
                <div key={m} className="st-ready-row">
                  <div className="st-ready-head">
                    <h3>{EXAMS[m].label}</h3>
                    <span>{left} days &middot; {parse(EXAMS[m].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="ns-meter-bar" aria-hidden="true"><span style={{ width: `${r.pct}%` }} /></div>
                  <p className="ns-meter-note">{r.pct}% ready. {r.taught} topics taught so far, {r.rated} rated, {r.solid} solid, {r.due} due for another look.</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4 Tracker */}
        <section className="ns-step">
          <Heading label="Revision tracker" context="Tap a rating whenever you revise" />
          <div className="st-filter">
            <button type="button" className={!dueOnly ? 'is-on' : ''} onClick={() => setDueOnly(false)}>All topics</button>
            <button type="button" className={dueOnly ? 'is-on' : ''} onClick={() => setDueOnly(true)}>Due only</button>
          </div>
          {groups.map((g) => (
            <div key={g.module} className="st-group">
              <p className="ns-group-name">{g.module}</p>
              {g.items.length === 0 && <p className="st-empty">Nothing due in this module.</p>}
              {g.items.map((t) => {
                const s = topics[t.id];
                const over = dueIn(t, topics, today);
                const taught = t.taught <= today;
                const ago = s ? daysBetween(s.last, today) : null;
                return (
                  <div key={t.id} className={`st-topic${taught ? '' : ' is-future'}`}>
                    <span className="st-topic-main">
                      <span className="st-topic-title">{t.title}</span>
                      <span className="st-topic-sub">
                        {taught ? `Taught ${fmtDay(t.taught)}` : `Taught ${fmtDay(t.taught)}, not yet`}
                        {s ? ` · revised ${ago === 0 ? 'today' : `${ago} day${ago === 1 ? '' : 's'} ago`}` : taught ? ' · not revised yet' : ''}
                      </span>
                    </span>
                    {taught && over !== null && over >= 0 && <span className="st-due">Due</span>}
                    {t.hub && <Link href={t.hub} className="st-open">Guide &rarr;</Link>}
                    {taught && (
                      <span className="st-rate" role="group" aria-label={`Confidence: ${t.title}`}>
                        {([1, 2, 3] as const).map((c) => (
                          <button key={c} type="button" className={s?.conf === c ? 'is-on' : ''} onClick={() => rate(t.id, c)}>
                            {CONFIDENCE_LABEL[c]}
                          </button>
                        ))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </section>

        {/* 5 Settings */}
        <section className="ns-step">
          <Heading label="How much to plan" context="Blocks are about 25 to 45 minutes" />
          <div className="st-settings">
            {([
              ['offDayBlocks', 'On a free day', 'Study blocks on days with no shift'],
              ['shiftDayBlocks', 'On a shift day', 'A long day is enough. Zero keeps it to your shift write-up'],
            ] as const).map(([key, label, sub]) => (
              <div key={key} className="st-setting">
                <div>
                  <p className="st-setting-label">{label}</p>
                  <p className="st-setting-sub">{sub}</p>
                </div>
                <span className="st-step-ctl">
                  <button type="button" aria-label={`Fewer blocks ${label.toLowerCase()}`} onClick={() => setSettings((p) => ({ ...p, [key]: Math.max(0, p[key] - 1) }))}>&minus;</button>
                  <strong>{settings[key]}</strong>
                  <button type="button" aria-label={`More blocks ${label.toLowerCase()}`} onClick={() => setSettings((p) => ({ ...p, [key]: Math.min(5, p[key] + 1) }))}>+</button>
                </span>
              </div>
            ))}
          </div>
          <p className="ns-foot">Deadlines and shifts come live from Notion when connected, otherwise from the snapshot of 26 Sep 2026. Lecture dates are in <code>studyData.ts</code>.</p>
        </section>
      </div>
    </div>
  );
}
