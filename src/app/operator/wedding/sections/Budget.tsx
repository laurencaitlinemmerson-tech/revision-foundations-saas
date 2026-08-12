'use client';

import { useState } from 'react';
import { fmtMoney } from '@/lib/wedding/derive';
import { fmtLongDate } from '../../components/format';
import { Bar, Card } from '../../components/ui';
import type { SectionProps } from './types';

export default function Budget({ snapshot, summary, writer }: SectionProps) {
  const { settings, costs } = snapshot;
  const currency = settings.currency;

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('me');
  const [isHen, setIsHen] = useState(false);

  const submit = () => {
    const trimmed = label.trim();
    const value = Number(amount);
    if (!trimmed || !Number.isFinite(value) || value < 0) return;
    writer
      .save('costs', { label: trimmed, amount: value, payer: payer.trim() || 'me', isHen })
      .then((ok) => {
        if (ok) {
          setLabel('');
          setAmount('');
        }
      });
  };

  const overCap =
    summary.budgetCap !== null && summary.mySpend > summary.budgetCap;

  return (
    <div className="op-stack">
      <div className="op-grid op-grid-4">
        <div className="op-kpi">
          <div className="op-kpi-label">My spend</div>
          <div className="op-kpi-value" style={{ marginTop: 12 }}>
            {fmtMoney(summary.mySpend, currency)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
            {summary.budgetCap !== null
              ? `of ${fmtMoney(summary.budgetCap, currency)} budget`
              : 'no cap set'}
          </div>
        </div>
        <div className="op-kpi">
          <div className="op-kpi-label">Outstanding</div>
          <div className="op-kpi-value" style={{ marginTop: 12 }}>
            {fmtMoney(summary.myOutstanding, currency)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
            {fmtMoney(summary.myPaid, currency)} already paid
          </div>
        </div>
        <div className="op-kpi">
          <div className="op-kpi-label">Hen do</div>
          <div className="op-kpi-value" style={{ marginTop: 12 }}>
            {fmtMoney(summary.henSpend, currency)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>across everyone</div>
        </div>
        <div className="op-kpi">
          <div className="op-kpi-label">Everything</div>
          <div className="op-kpi-value" style={{ marginTop: 12 }}>
            {fmtMoney(summary.totalSpend, currency)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
            whoever is paying
          </div>
        </div>
      </div>

      {summary.budgetCap !== null ? (
        <Card
          title="Against your budget"
          sub={
            overCap
              ? 'Over the cap you set — worth a look before anything else goes on.'
              : 'What you have committed to, versus what you set aside.'
          }
          action={
            <span className="op-chip" data-tone={overCap ? 'bad' : 'good'}>
              {Math.round((summary.mySpend / Math.max(1, summary.budgetCap)) * 100)}% used
            </span>
          }
        >
          <Bar
            value={summary.mySpend}
            target={summary.budgetCap}
            color={overCap ? 'var(--critical)' : 'var(--violet)'}
            label="Spend against budget"
          />
        </Card>
      ) : null}

      <Card title="Costs" sub="Tick when paid. Anything marked as yours counts toward your budget.">
        {costs.length ? (
          costs.map((cost) => (
            <div
              key={cost.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0,1fr) auto auto auto',
                gap: 12,
                alignItems: 'center',
                padding: '11px 0',
                borderTop: '0.5px solid var(--hairline)',
              }}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={cost.paid}
                aria-label={cost.paid ? `Mark ${cost.label} unpaid` : `Mark ${cost.label} paid`}
                disabled={writer.busy}
                onClick={() => writer.save('costs', { paid: !cost.paid }, cost.id)}
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
                  borderColor: cost.paid ? 'transparent' : 'var(--line-violet)',
                  background: cost.paid ? 'var(--good)' : 'var(--plane)',
                  color: '#fff',
                }}
              >
                {cost.paid ? '✓' : ''}
              </button>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, color: 'var(--ink)' }}>{cost.label}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {cost.payer.toLowerCase() === 'me' ? 'you' : cost.payer}
                  {cost.dueDate ? ` · due ${fmtLongDate(cost.dueDate)}` : ''}
                </div>
              </div>

              {cost.isHen ? <span className="op-chip">hen</span> : <span />}

              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 17,
                  color: 'var(--ink)',
                  minWidth: 72,
                  textAlign: 'right',
                }}
              >
                {fmtMoney(cost.amount, currency)}
              </span>

              <button
                type="button"
                className="op-step"
                aria-label={`Delete ${cost.label}`}
                disabled={writer.busy}
                onClick={() => writer.remove('costs', cost.id)}
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <p className="op-empty">Nothing tracked yet — add the first cost below.</p>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) 96px 110px auto auto',
            gap: 8,
            marginTop: 14,
            paddingTop: 14,
            borderTop: '0.5px solid var(--hairline)',
            alignItems: 'center',
          }}
        >
          <input
            className="op-input"
            style={{ fontSize: 13, padding: '9px 12px' }}
            placeholder="What is it?"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit();
            }}
            aria-label="Cost label"
          />
          <input
            className="op-input"
            style={{ fontSize: 13, padding: '9px 12px' }}
            placeholder="0"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-label="Amount"
          />
          <input
            className="op-input"
            style={{ fontSize: 12.5, padding: '9px 10px', fontFamily: 'var(--font-ui)' }}
            placeholder="who pays"
            value={payer}
            onChange={(event) => setPayer(event.target.value)}
            aria-label="Who is paying"
          />
          <button
            type="button"
            className="op-btn"
            aria-pressed={isHen}
            onClick={() => setIsHen((v) => !v)}
            style={
              isHen
                ? { background: 'var(--card-tint)', borderColor: 'var(--line-violet)', color: 'var(--mauve)' }
                : undefined
            }
          >
            hen
          </button>
          <button
            type="button"
            className="op-btn"
            data-variant="solid"
            disabled={writer.busy || !label.trim() || !amount}
            onClick={submit}
          >
            Add
          </button>
        </div>
      </Card>
    </div>
  );
}
