'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
 * the generated view. The prototype was a single stateful component; the split
 * keeps the regenerable markup free of state plumbing.
 */
export default function DailyLogClient({ props = DEFAULT_PROPS }: { props?: DailyLogProps }) {
  const [state, setStateRaw] = useState<DailyLogState>(INITIAL_STATE);
  const live = useOperatorData();
  const seeded = useRef(false);

  const setState = useCallback<
    (patch: Partial<DailyLogState> | ((s: DailyLogState) => Partial<DailyLogState>)) => void
  >((patch) => {
    setStateRaw((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  // Today's intake, protein, steps and water are editable in the UI (the ring
  // steppers, the water glasses, the log-food presets), so Apple Health seeds
  // them once on load rather than overwriting whatever has been adjusted since.
  useEffect(() => {
    if (!live.loaded || seeded.current) return;
    seeded.current = true;
    const iso = new Date().toISOString().slice(0, 10);
    const day = live.days?.find((d) => d.date.slice(0, 10) === iso);
    if (!day) return;

    const { dietaryEnergyKcal, proteinG, waterMl } = day.nutrition;
    const steps = day.activity.steps;
    const activeEnergy = day.activity.activeEnergyKcal;

    // Seeding editable state from data that arrives asynchronously is exactly
    // what this effect is for; the ref above makes it run once, so it cannot
    // clobber a later edit or loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((s) => ({
      logged: {
        kcal: dietaryEnergyKcal == null ? s.logged.kcal : Math.round(dietaryEnergyKcal),
        protein: proteinG == null ? s.logged.protein : Math.round(proteinG),
        steps: steps == null ? s.logged.steps : Math.round(steps),
      },
      water: waterMl == null ? s.water : Math.max(0, Math.min(8, Math.round(waterMl / 250))),
      // Active energy is the measured half of expenditure; the rest of the TDEE
      // breakdown stays user-tunable.
      tune: activeEnergy == null ? s.tune : { ...s.tune, exercise: Math.round(activeEnergy) },
    }));
  }, [live, setState]);

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
