'use client';

import { Bar, Card } from '../../components/ui';
import TaskRow from './TaskRow';
import AddTask from './AddTask';
import type { SectionProps } from './types';

export default function TaskList({ summary, writer, phases }: SectionProps) {
  const hasAny = phases.some((group) => group.tasks.length);

  return (
    <div className="op-stack">
      {summary.overdue.length ? (
        <Card soft title="Needs attention" sub="Past its due date and still open.">
          {summary.overdue.map((task) => (
            <TaskRow key={task.id} task={task} writer={writer} />
          ))}
        </Card>
      ) : null}

      <Card
        title="The checklist"
        sub="Grouped by how far out it belongs. Tick things off as you go."
        action={
          summary.tasksTotal ? (
            <span className="op-chip">
              {summary.tasksDone} of {summary.tasksTotal} done
            </span>
          ) : null
        }
      >
        {summary.tasksTotal ? (
          <div style={{ marginBottom: 18 }}>
            <Bar
              value={summary.tasksDone}
              target={summary.tasksTotal}
              color="var(--violet)"
              label="Checklist progress"
            />
          </div>
        ) : null}

        {hasAny ? (
          phases
            .filter((group) => group.tasks.length)
            .map((group) => (
              <div key={group.phase} style={{ marginBottom: 22 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <span className="op-eyebrow">{group.phase}</span>
                  <span style={{ fontSize: 11, color: 'var(--faint)' }}>
                    {group.done}/{group.tasks.length}
                  </span>
                </div>
                {group.tasks.map((task) => (
                  <TaskRow key={task.id} task={task} writer={writer} />
                ))}
              </div>
            ))
        ) : (
          <p className="op-empty">
            Nothing on the list yet — add the first thing below and it&apos;ll group itself.
          </p>
        )}

        <AddTask writer={writer} />
      </Card>
    </div>
  );
}
