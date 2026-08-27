'use client';

import { useCallback, useMemo, useState } from 'react';
import { useOperatorData } from '../daily-log/data';
import { usePeerData } from './peerData';
import { useBrief } from './briefData';
import { useHistory } from './historyData';
import { usePlan } from './planData';
import { useLiftEntry } from './liftEntry';
import { useSessionDetail } from './sessionData';
import { stateFromUrl, useUrlState } from './urlState';
import TrainingView from './TrainingView';
import {
  DEFAULT_PROPS, INITIAL_STATE, deriveVals,
  type TrainingProps, type TrainingState,
} from './logic';
import './training.css';

/**
 * Holds the dashboard's interaction state and hands the derived view-model down.
 *
 * Only preferences live here — which screen, which range, which unit. Every
 * measured figure is read from the operator sources on each render, so the
 * numbers roll over on their own when the date changes and there is no stale
 * copy to clear.
 */
export default function TrainingClient({ props = DEFAULT_PROPS }: { props?: TrainingProps }) {
  // Read once, lazily: the URL is the source of truth on first paint, so a
  // refresh or a shared link opens on the view it names rather than flashing the
  // dashboard and then correcting itself.
  const [state, setStateRaw] = useState<TrainingState>(() => ({
    ...INITIAL_STATE,
    ...(typeof window === 'undefined' ? {} : stateFromUrl()),
  }));
  const live = useOperatorData();
  const peer = usePeerData();
  const brief = useBrief();
  const history = useHistory();
  const plan = usePlan();

  // The open session's per-minute record, fetched only while one is open.
  const session = useSessionDetail(state.openSession);
  const lift = useLiftEntry(live.refresh);

  const setState = useCallback<
    (patch: Partial<TrainingState> | ((s: TrainingState) => Partial<TrainingState>)) => void
  >((patch) => {
    setStateRaw((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  useUrlState(state, setState);

  const vals = useMemo(
    () => deriveVals(state, setState, props, live, peer, brief, history, plan, session, lift),
    [state, setState, props, live, peer, brief, history, plan, session, lift],
  );

  return (
    <div className="training-shell">
      <TrainingView v={vals} />
    </div>
  );
}
