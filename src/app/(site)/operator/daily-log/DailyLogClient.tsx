'use client';

import { useCallback, useMemo, useState } from 'react';
import DailyLogView from './DailyLogView';
import { useOperatorData } from './data';
import {
  deriveVals,
  DEFAULT_PROPS,
  INITIAL_STATE,
  type DailyLogProps,
  type DailyLogState,
} from './logic';
import './daily-log.css';

/**
 * Holds the dashboard's interaction state and hands the derived view-model to
 * the generated view.
 *
 * Only preferences live here — which tab, which range, which unit. Everything
 * measured comes from Apple Health on each render, so today's figures reset by
 * themselves when the date rolls over and there is no stale copy to clear.
 */
export default function DailyLogClient({ props = DEFAULT_PROPS }: { props?: DailyLogProps }) {
  const [state, setStateRaw] = useState<DailyLogState>(INITIAL_STATE);
  const live = useOperatorData();

  const setState = useCallback<
    (patch: Partial<DailyLogState> | ((s: DailyLogState) => Partial<DailyLogState>)) => void
  >((patch) => {
    setStateRaw((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  const vals = useMemo(
    () => deriveVals(state, setState, props, live),
    [state, setState, props, live],
  );

  return (
    <div className="daily-log-shell">
      <DailyLogView v={vals} />
    </div>
  );
}
