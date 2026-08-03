'use client';

import type { BusinessPulse } from '@/lib/operator/types';
import { ColumnChart } from '../components/charts';
import { fmtMoney, fmtMonth, fmtNumber } from '../components/format';
import { Card, Section, StatTile, TableView } from '../components/ui';

const PRODUCT_LABELS: Record<string, string> = {
  osce: 'OSCE pack',
  quiz: 'Quiz bank',
  bundle: 'Full bundle',
};

function productLabel(key: string) {
  return PRODUCT_LABELS[key] ?? key.replace(/[-_]/g, ' ');
}

/**
 * The other half of an operator's day: what the studio itself is
 * doing. Read straight from the live purchases and entitlements
 * tables — the same numbers Stripe would show, without leaving the page.
 */
export default function StudioPulse({ business }: { business: BusinessPulse }) {
  if (!business.available) {
    return (
      <Section
        kicker="Studio"
        title="The business side"
        note="Revenue, orders and active students, read live from the purchases and entitlements tables."
      >
        <p className="op-empty">
          No purchase data reachable. This section fills in once Supabase is configured for this
          environment.
        </p>
      </Section>
    );
  }

  const revenueColumns = business.revenueByMonth.map((point) => ({
    key: point.month,
    label: fmtMonth(point.month),
    value: point.grossPence / 100,
    tooltip: [
      { label: 'Gross', value: fmtMoney(point.grossPence, business.currency), color: 'var(--series-1)' },
      { label: 'Orders', value: String(point.orders) },
    ],
  }));

  return (
    <Section
      kicker="Studio"
      title="The business side"
      note="Revenue, orders and active students, read live from the purchases and entitlements tables."
    >
      <div className="op-grid op-grid-4">
        <StatTile
          label="Gross, all time"
          value={fmtMoney(business.grossPence, business.currency)}
          foot={`${fmtNumber(business.orders)} orders`}
        />
        <StatTile
          label="Last 30 days"
          value={fmtMoney(business.gross30Pence, business.currency)}
          foot={`${fmtNumber(business.orders30)} orders · ${fmtMoney(business.gross7Pence, business.currency)} in 7`}
        />
        <StatTile
          label="Active entitlements"
          value={fmtNumber(business.entitlements)}
          foot={business.unclaimed ? `${business.unclaimed} purchases unclaimed` : 'All purchases claimed'}
        />
        <StatTile
          label="Students active"
          value={fmtNumber(business.activeStudents7)}
          foot={`${fmtNumber(business.activeStudents30)} in the last 30 days`}
        />
      </div>

      <div style={{ marginTop: 16 }} />

      <div className="op-grid op-grid-2">
        <Card title="Revenue by month" sub={`Gross, ${business.currency.toUpperCase()}`}>
          {revenueColumns.length ? (
            <>
              <ColumnChart
                data={revenueColumns}
                color="var(--series-1)"
                format={(value) => fmtNumber(value)}
                ariaLabel="Gross revenue by month."
              />
              <div style={{ marginTop: 14 }}>
                <TableView
                  caption="Gross revenue by month"
                  columns={['Month', 'Gross', 'Orders']}
                  rows={[...business.revenueByMonth].reverse().map((point) => [
                    fmtMonth(point.month),
                    fmtMoney(point.grossPence, business.currency),
                    point.orders,
                  ])}
                />
              </div>
            </>
          ) : (
            <p className="op-empty">No orders recorded yet.</p>
          )}
        </Card>

        <Card title="By product" sub="Orders and gross since launch">
          {business.byProduct.length ? (
            <div className="op-scroll-x">
              <table className="op-table">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Orders</th>
                    <th scope="col">Gross</th>
                    <th scope="col">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {business.byProduct.map((row) => (
                    <tr key={row.product}>
                      <th scope="row" style={{ textTransform: 'capitalize' }}>
                        {productLabel(row.product)}
                      </th>
                      <td>{fmtNumber(row.orders)}</td>
                      <td>{fmtMoney(row.grossPence, business.currency)}</td>
                      <td>
                        {business.grossPence
                          ? `${Math.round((row.grossPence / business.grossPence) * 100)}%`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="op-empty">No orders recorded yet.</p>
          )}
        </Card>
      </div>
    </Section>
  );
}
