'use client';

import { useCallback, useMemo, useState } from 'react';
import DailyLogView from './DailyLogView';
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
 * the generated view. The prototype was a single stateful component; the split
 * keeps the regenerable markup free of state plumbing.
 */
export default function DailyLogClient({ props = DEFAULT_PROPS }: { props?: DailyLogProps }) {
  const [state, setStateRaw] = useState<DailyLogState>(INITIAL_STATE);

  const setState = useCallback<
    (patch: Partial<DailyLogState> | ((s: DailyLogState) => Partial<DailyLogState>)) => void
  >((patch) => {
    setStateRaw((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  const vals = useMemo(() => deriveVals(state, setState, props), [state, setState, props]);

  return (
    <div className="daily-log-shell">
      <DailyLogView v={vals} />
    </div>
  );
}
