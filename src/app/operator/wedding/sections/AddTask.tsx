'use client';

import { useState } from 'react';
import { TASK_PHASES } from '@/lib/wedding/types';
import type { WeddingWriter } from './types';

/* The add-a-task form, shared by the checklist and the hen-do section.
   `isHen` decides which list the new task lands in. */
export default function AddTask({
  writer,
  isHen = false,
  defaultPhase = 'Anytime',
}: {
  writer: WeddingWriter;
  isHen?: boolean;
  defaultPhase?: string;
}) {
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState(defaultPhase);
  const [dueDate, setDueDate] = useState('');

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    writer
      .save('tasks', {
        title: trimmed,
        phase,
        isHen,
        dueDate: dueDate || null,
      })
      .then((ok) => {
        if (ok) {
          setTitle('');
          setDueDate('');
        }
      });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto auto auto',
        gap: 8,
        marginTop: 14,
        paddingTop: 14,
        borderTop: '0.5px solid var(--hairline)',
      }}
    >
      <input
        className="op-input"
        style={{ fontSize: 13, padding: '9px 12px' }}
        placeholder={isHen ? 'Add a hen-do task' : 'Add a task'}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') submit();
        }}
        aria-label="Task title"
      />
      {!isHen ? (
        <select
          className="op-input"
          style={{ fontSize: 12.5, padding: '9px 10px', fontFamily: 'var(--font-ui)' }}
          value={phase}
          onChange={(event) => setPhase(event.target.value)}
          aria-label="Phase"
        >
          {TASK_PHASES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : null}
      <input
        className="op-input"
        style={{ fontSize: 12.5, padding: '9px 10px', fontFamily: 'var(--font-ui)' }}
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        aria-label="Due date"
      />
      <button
        type="button"
        className="op-btn"
        data-variant="solid"
        disabled={writer.busy || !title.trim()}
        onClick={submit}
      >
        Add
      </button>
    </div>
  );
}
