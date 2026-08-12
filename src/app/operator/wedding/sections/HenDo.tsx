'use client';

import { fmtMoney } from '@/lib/wedding/derive';
import { fmtLongDate } from '../../components/format';
import { Bar, Card } from '../../components/ui';
import TaskRow from './TaskRow';
import AddTask from './AddTask';
import type { SectionProps } from './types';

export default function HenDo({ snapshot, summary, writer }: SectionProps) {
  const { settings, tasks, contacts, costs } = snapshot;

  const henTasks = tasks.filter((task) => task.isHen);
  const henDone = henTasks.filter((task) => task.done).length;
  const henCosts = costs.filter((cost) => cost.isHen);
  const attending = contacts.filter((contact) => contact.attendingHen);

  // Split per head across everyone actually coming — the number the
  // group always ends up asking for.
  const perHead = attending.length ? summary.henSpend / attending.length : null;

  return (
    <div className="op-stack">
      <div className="op-grid op-grid-4">
        <div className="op-kpi">
          <div className="op-kpi-label">Countdown</div>
          <div className="op-kpi-value" data-empty={summary.daysToHen === null} style={{ marginTop: 12 }}>
            {summary.daysToHen === null
              ? 'no date yet'
              : summary.daysToHen >= 0
                ? summary.daysToHen
                : 'done'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
            {settings.henDate ? fmtLongDate(settings.henDate) : 'set one in Details'}
          </div>
        </div>
        <div className="op-kpi">
          <div className="op-kpi-label">Coming</div>
          <div className="op-kpi-value" style={{ marginTop: 12 }}>{attending.length}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
            of {contacts.filter((c) => c.kind === 'party').length} in the party
          </div>
        </div>
        <div className="op-kpi">
          <div className="op-kpi-label">Hen budget</div>
          <div className="op-kpi-value" style={{ marginTop: 12 }}>
            {fmtMoney(summary.henSpend, settings.currency)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
            {henCosts.length} cost{henCosts.length === 1 ? '' : 's'} tracked
          </div>
        </div>
        <div className="op-kpi">
          <div className="op-kpi-label">Per head</div>
          <div className="op-kpi-value" data-empty={perHead === null} style={{ marginTop: 12 }}>
            {perHead === null ? 'no one added' : fmtMoney(perHead, settings.currency)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
            split across everyone coming
          </div>
        </div>
      </div>

      <div className="op-grid op-grid-wide" style={{ alignItems: 'start' }}>
        <Card
          title="Hen do checklist"
          sub={settings.henLocation ? `${settings.henLocation} · what still needs doing` : 'What still needs doing'}
          action={
            henTasks.length ? (
              <span className="op-chip">
                {henDone} of {henTasks.length} done
              </span>
            ) : null
          }
        >
          {henTasks.length ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <Bar
                  value={henDone}
                  target={henTasks.length}
                  color="var(--blush)"
                  label="Hen do progress"
                />
              </div>
              {henTasks.map((task) => (
                <TaskRow key={task.id} task={task} writer={writer} />
              ))}
            </>
          ) : (
            <p className="op-empty">
              Nothing yet. Venue, dates, who&apos;s coming, activities, decorations — add the first below.
            </p>
          )}
          <AddTask writer={writer} isHen defaultPhase="Anytime" />
        </Card>

        <div className="op-stack">
          <Card soft title="Who's coming" sub="Tick people in the People tab to add them here.">
            {attending.length ? (
              attending.map((contact) => (
                <div
                  key={contact.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 10,
                    padding: '9px 0',
                    borderTop: '0.5px solid var(--line-violet)',
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--ink)' }}>{contact.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{contact.role || '—'}</span>
                </div>
              ))
            ) : (
              <p className="op-note" style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                No one marked as attending yet.
              </p>
            )}
          </Card>

          <Card title="Hen costs" sub="Anything flagged as a hen expense.">
            {henCosts.length ? (
              henCosts.map((cost) => (
                <div
                  key={cost.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 10,
                    padding: '9px 0',
                    borderTop: '0.5px solid var(--hairline)',
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--ink)' }}>
                    {cost.label}
                    {cost.paid ? (
                      <span className="op-chip" data-tone="good" style={{ marginLeft: 8 }}>
                        paid
                      </span>
                    ) : null}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink)' }}>
                    {fmtMoney(cost.amount, settings.currency)}
                  </span>
                </div>
              ))
            ) : (
              <p className="op-note" style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                Add costs in the Budget tab and tick &ldquo;hen&rdquo; to see them here.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
