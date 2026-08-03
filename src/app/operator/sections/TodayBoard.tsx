'use client';

import type { Derived } from '@/lib/operator/fitness/derive';
import type { OperatorSettings } from '@/lib/operator/types';
import { fmtCompact, fmtDuration, fmtLongDate, fmtNumber } from '../components/format';
import { StatTile } from '../components/ui';

/**
 * The board beside the hero: where today actually landed against each
 * target. Every tile is a number plus its target — no chart, because
 * the story of each one *is* a single number.
 */
export default function TodayBoard({
  data,
  settings,
}: {
  data: Derived;
  settings: OperatorSettings;
}) {
  const today = data.today;
  const tail = data.days.slice(-14);

  const intake = today?.intakeKcal ?? null;
  const target = data.tdee.targetIntake;

  return (
    <div>
      <div className="op-grid op-grid-3">
        <StatTile
          label="Intake"
          value={intake === null ? '—' : fmtNumber(intake)}
          unit={`/ ${fmtNumber(target)} kcal`}
          meter={{ value: intake, target, overIsBad: true }}
          foot={
            intake === null
              ? 'Not logged today'
              : intake > target
                ? `${fmtNumber(intake - target)} over`
                : `${fmtNumber(target - intake)} left`
          }
        />

        <StatTile
          label="Protein"
          value={today?.proteinG === null || today?.proteinG === undefined ? '—' : fmtNumber(today.proteinG)}
          unit={`/ ${fmtNumber(settings.proteinTargetG)} g`}
          meter={{ value: today?.proteinG ?? null, target: settings.proteinTargetG }}
          foot={`${data.streaks.protein.current}-day streak`}
        />

        <StatTile
          label="Steps"
          value={fmtCompact(today?.steps ?? null)}
          unit={`/ ${fmtCompact(settings.stepTarget)}`}
          meter={{ value: today?.steps ?? null, target: settings.stepTarget }}
          foot={`${data.streaks.steps.current}-day streak`}
        />

        <StatTile
          label="Active energy"
          value={fmtNumber(today?.activeKcal ?? null)}
          unit="kcal"
          spark={tail.map((day) => day.activeKcal)}
          sparkColor="var(--series-2)"
          foot={`${fmtNumber(data.averages.activeKcal)} avg`}
        />

        <StatTile
          label="Sleep"
          value={fmtDuration(today?.sleepTotalMin ?? null)}
          meter={{ value: today?.sleepTotalMin ?? null, target: settings.sleepTargetMin }}
          foot={`${fmtDuration(settings.sleepTargetMin)} target`}
        />

        <StatTile
          label="Water"
          value={
            today?.waterMl === null || today?.waterMl === undefined
              ? '—'
              : (today.waterMl / 1000).toFixed(1)
          }
          unit={`/ ${(settings.waterTargetMl / 1000).toFixed(1)} L`}
          meter={{ value: today?.waterMl ?? null, target: settings.waterTargetMl }}
          foot={`${fmtNumber((data.averages.waterMl ?? 0) / 1000, 1)} L avg`}
        />
      </div>

      <p className="op-kicker" style={{ marginTop: 12 }}>
        Latest signal {today ? fmtLongDate(today.date) : '—'} · deficit streak{' '}
        {data.streaks.deficit.current} days (best {data.streaks.deficit.best})
      </p>
    </div>
  );
}
