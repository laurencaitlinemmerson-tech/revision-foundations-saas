'use client';

import { daysUntil } from '@/lib/wedding/derive';
import { fmtLongDate } from '../../components/format';
import type { WeddingTask } from '@/lib/wedding/types';
import type { WeddingWriter } from './types';

/* One checklist line. Shared by the wedding checklist and the hen-do
   section, which differ only in which tasks they pass in. */
export default function TaskRow({
  task,
  writer,
}: {
  task: WeddingTask;
  writer: WeddingWriter;
}) {
  const days = daysUntil(task.dueDate);
  const overdue = !task.done && days !== null && days < 0;
  const soon = !task.done && days !== null && days >= 0 && days <= 14;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr) auto auto',
        gap: 12,
        alignItems: 'center',
        padding: '11px 0',
        borderTop: '0.5px solid var(--hairline)',
      }}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.done ? `Mark "${task.title}" not done` : `Mark "${task.title}" done`}
        disabled={writer.busy}
        onClick={() => writer.save('tasks', { done: !task.done }, task.id)}
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          flex: 'none',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          fontSize: 12,
          lineHeight: 1,
          border: '0.5px solid',
          borderColor: task.done ? 'transparent' : 'var(--line-violet)',
          background: task.done ? 'var(--violet)' : 'var(--plane)',
          color: '#fff',
        }}
      >
        {task.done ? '✓' : ''}
      </button>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13.5,
            color: task.done ? 'var(--faint)' : 'var(--ink)',
            textDecoration: task.done ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </div>
        {task.notes ? (
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{task.notes}</div>
        ) : null}
      </div>

      <span
        className="op-chip"
        data-tone={overdue ? 'bad' : soon ? undefined : 'flat'}
        style={{ visibility: task.dueDate ? 'visible' : 'hidden' }}
      >
        {task.dueDate
          ? overdue
            ? `${Math.abs(days as number)}d overdue`
            : days === 0
              ? 'today'
              : fmtLongDate(task.dueDate)
          : '—'}
      </span>

      <button
        type="button"
        className="op-step"
        aria-label={`Delete "${task.title}"`}
        disabled={writer.busy}
        onClick={() => writer.remove('tasks', task.id)}
      >
        ×
      </button>
    </div>
  );
}
