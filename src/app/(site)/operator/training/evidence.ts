import type { Findings } from '@/lib/health/whatWorked';

import { AMBER, BLUE, GREEN, INK, MUTED, PLUM, ROSE, SOFT } from './palette';

/**
 * The record's findings, dressed for the page.
 *
 * `whatWorked.ts` decides what eight years of logging actually say; this decides
 * how to put it into words and bars. The split matters here more than anywhere
 * else on the dashboard, because these are the only figures that carry an
 * implicit "so do more of that" — and the moment a formatting file starts
 * choosing which differences to show, the honesty of the analysis stops being
 * checkable in one place.
 *
 * Nothing here claims a cause. A difference between two stretches is a
 * difference, and it is labelled as one.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const nf = (n: number, d = 0) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });

const fmt = (iso: string, withYear = true) => {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  if (!Number.isFinite(d.getTime())) return iso;
  const base = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
  return withYear ? `${base} ${d.getUTCFullYear()}` : base;
};

const weeksOf = (days: number) => {
  const w = days / 7;
  return w >= 2 ? `${nf(w, w % 1 >= 0.05 ? 1 : 0)} weeks` : `${days} days`;
};

export type EvidenceView = {
  ok: boolean;
  loading: boolean;
  note: string;
  spanLabel: string;

  /** The lowest sustained weight in the record. */
  lowest: { kg: string; when: string; agoLabel: string } | null;

  /** The longest stretch where the weight actually came off. */
  best: {
    range: string; lengthLabel: string; rateLabel: string; changeLabel: string; lostLabel: string;
  } | null;

  /** Every classified stretch, oldest first, as a proportional timeline. */
  episodes: Array<{
    key: string; phase: string; range: string; lengthLabel: string;
    rateLabel: string; changeLabel: string; colour: string;
    leftPct: number; widthPct: number;
  }>;
  timelineFrom: string;
  timelineTo: string;

  /** What was different in the losing stretches. */
  contrasts: Array<{
    key: string; label: string; unit: string;
    losing: string; other: string; diff: string;
    higher: boolean; pct: number; otherPct: number;
    trustworthy: boolean; coverNote: string;
  }>;
  contrastNote: string;
  thinContrasts: string[];

  /** Maintenance calories, solved for rather than modelled. */
  maintenance: {
    ok: boolean;
    measured: string;
    band: string;
    windows: string;
    logged: string;
    modelled: string;
    gapKcal: number | null;
    verdict: string;
    colour: string;
    note: string;
  };
};

const EMPTY: EvidenceView = {
  ok: false, loading: true, note: '', spanLabel: '',
  lowest: null, best: null, episodes: [], timelineFrom: '', timelineTo: '',
  contrasts: [], contrastNote: '', thinContrasts: [],
  maintenance: {
    ok: false, measured: '—', band: '—', windows: '—', logged: '—', modelled: '—',
    gapKcal: null, verdict: '', colour: MUTED, note: '',
  },
};

export function buildEvidence(
  findings: Findings | null,
  loaded: boolean,
  /** The modelled expenditure the rest of the dashboard works from. */
  modelledTdee: number | null,
): EvidenceView {
  if (!loaded) return EMPTY;
  if (!findings || !findings.ok) {
    return {
      ...EMPTY,
      loading: false,
      note: findings?.note || 'The record could not be read.',
    };
  }

  const { episodes, best, contrasts, lowest, maintenance } = findings;

  /* the timeline ---------------------------------------------------------- */

  const at = (d: string) => Date.parse(`${d}T12:00:00Z`);
  const from = at(findings.from ?? episodes[0]?.from ?? '2021-01-01');
  const to = at(findings.to ?? episodes[episodes.length - 1]?.to ?? '2026-01-01');
  const span = Math.max(1, to - from);

  const colourOf = (phase: string) =>
    phase === 'losing' ? GREEN : phase === 'gaining' ? ROSE : MUTED;

  const timeline = episodes.map((e, i) => ({
    key: `${e.from}-${i}`,
    phase: e.phase,
    range: `${fmt(e.from, false)} – ${fmt(e.to)}`,
    lengthLabel: weeksOf(e.days),
    rateLabel: `${e.ratePerWeek < 0 ? '−' : '+'}${nf(Math.abs(e.ratePerWeek), 2)} kg/wk`,
    changeLabel: `${nf(e.startKg, 1)} → ${nf(e.endKg, 1)} kg`,
    colour: colourOf(e.phase),
    leftPct: ((at(e.from) - from) / span) * 100,
    widthPct: Math.max(0.8, ((at(e.to) - at(e.from)) / span) * 100),
  }));

  /* the contrast ---------------------------------------------------------- */

  // A difference that rounds away at the precision it is shown in reads as a
  // finding of nothing, which is worse than not listing it.
  const shown = contrasts.filter((c) => {
    if (!c.trustworthy || c.losing === null || c.other === null) return false;
    const dp = c.unit === 'h/night' || c.unit === '/week' ? 1 : 0;
    return Math.abs(c.losing - c.other) >= (dp === 1 ? 0.05 : 0.5);
  });
  const thin = contrasts.filter((c) => !c.trustworthy).map((c) => c.label);

  // Bars are drawn against the larger of the two sides so the pair is readable
  // as a pair rather than each being scaled to itself.
  const rows = shown.map((c) => {
    const a = c.losing as number;
    const b = c.other as number;
    const top = Math.max(a, b) || 1;
    const dp = c.unit === 'h/night' || c.unit === '/week' ? 1 : 0;
    return {
      key: c.key,
      label: c.label,
      unit: c.unit,
      losing: nf(a, dp),
      other: nf(b, dp),
      diff: `${a >= b ? '+' : '−'}${nf(Math.abs(a - b), dp)}`,
      higher: a >= b,
      pct: (a / top) * 100,
      otherPct: (b / top) * 100,
      trustworthy: true,
      coverNote: `${c.losingCovered} days losing, ${c.otherCovered} days not`,
    };
  });

  const losingDays = episodes.filter((e) => e.phase === 'losing').reduce((a, e) => a + e.days, 0);
  const otherDays = episodes.filter((e) => e.phase !== 'losing').reduce((a, e) => a + e.days, 0);

  /* maintenance ----------------------------------------------------------- */

  const m = buildMaintenance(maintenance, modelledTdee);

  const lowKg = lowest
    ? {
      kg: nf(lowest.kg, 1),
      when: fmt(lowest.on),
      agoLabel: (() => {
        const yrs = (Date.now() - at(lowest.on)) / (365.25 * 86_400_000);
        return yrs >= 1 ? `${nf(yrs, 1)} years ago` : `${Math.round(yrs * 12)} months ago`;
      })(),
    }
    : null;

  const longest = best[0] ?? null;

  return {
    ok: true,
    loading: false,
    note: '',
    spanLabel: `${nf(findings.weighCount)} weigh-ins and ${nf(findings.dayCount)} logged days, ${fmt(findings.from ?? '', true)} to now`,
    lowest: lowKg,
    best: longest
      ? {
        range: `${fmt(longest.from, false)} – ${fmt(longest.to)}`,
        lengthLabel: weeksOf(longest.days),
        rateLabel: `${nf(Math.abs(longest.ratePerWeek), 2)} kg a week`,
        changeLabel: `${nf(longest.startKg, 1)} → ${nf(longest.endKg, 1)} kg`,
        lostLabel: `${nf(Math.abs(longest.startKg - longest.endKg), 1)} kg`,
      }
      : null,
    episodes: timeline,
    timelineFrom: fmt(findings.from ?? '', true),
    timelineTo: fmt(findings.to ?? '', true),
    contrasts: rows,
    contrastNote: `Measured across ${nf(losingDays)} days inside stretches where the weight was actually falling, against ${nf(otherDays)} days inside stretches where it was holding or rising. These are differences that sat alongside the loss, not causes of it.`,
    thinContrasts: thin,
    maintenance: m,
  };
}

/**
 * What the measurement means once it meets the model.
 *
 * A measured maintenance well below the modelled one is not a slow metabolism —
 * a body cannot maintain below its own resting burn. It is the food log running
 * short, and saying so is more useful than either number alone, because it turns
 * the calorie target into something that can be set in the units actually being
 * logged.
 */
function buildMaintenance(
  m: Findings['maintenance'],
  modelled: number | null,
): EvidenceView['maintenance'] {
  const base = {
    ok: false, measured: '—', band: '—', windows: String(m.windows),
    logged: m.loggedKcal === null ? '—' : nf(Math.round(m.loggedKcal)),
    modelled: modelled === null ? '—' : nf(Math.round(modelled)),
    gapKcal: null as number | null,
    verdict: '', colour: MUTED, note: m.note,
  };

  if (m.medianKcal === null) return base;

  const measured = Math.round(m.medianKcal);
  const gap = modelled === null ? null : Math.round(modelled - measured);

  // Within this of the model, the two agree and the log can be taken at face
  // value. Beyond it, the gap is the finding.
  const AGREE = 200;

  const verdict = gap === null
    ? `Across ${m.windows} four-week stretches with the food log full enough to measure, your intake and the scale imply you burn about ${nf(measured)} kcal a day.`
    : Math.abs(gap) <= AGREE
      ? `Across ${m.windows} four-week stretches, what you ate and what the scale did imply you burn about ${nf(measured)} kcal a day — within ${nf(Math.abs(gap))} of the ${nf(modelled as number)} the model estimates. The log can be taken at face value, so a target set in logged calories means what it says.`
      : gap > 0
        ? (() => {
          // Expressed as a share rather than a new target. The offset is very
          // unlikely to be a constant number of calories — it is the meals that
          // never get logged — so subtracting it from a target would produce a
          // figure that looks precise and would be wrong, and low enough to be
          // worth not printing at all.
          const captured = Math.round((measured / (modelled as number)) * 100);
          return `Across ${m.windows} four-week stretches, your logged intake and what the scale actually did imply maintenance of ${nf(measured)} kcal a day — about ${nf(gap)} below the ${nf(modelled as number)} your own basal and active energy add up to. A body cannot maintain below its own resting burn, so this is not a finding about your metabolism: it is the food log running roughly ${captured}% of the way. That is worth knowing, because it means the number beside a calorie target is not measuring what it claims to. Logged calories are still good for tracking consistency day to day — a week of 1,400s against a week of 1,900s is a real difference — but the absolute figure cannot be compared to a target taken from a formula.`;
        })()
        : `Across ${m.windows} four-week stretches, your logged intake and the scale imply maintenance of ${nf(measured)} kcal a day — about ${nf(Math.abs(gap))} above the ${nf(modelled as number)} the model estimates. Either the model is understating your activity, or some of the weight change over these stretches was water rather than tissue.`;

  return {
    ...base,
    ok: true,
    measured: nf(measured),
    band: m.lowKcal !== null && m.highKcal !== null
      ? `${nf(Math.round(m.lowKcal))} – ${nf(Math.round(m.highKcal))}`
      : '—',
    gapKcal: gap,
    verdict,
    colour: gap === null || Math.abs(gap) <= AGREE ? GREEN : gap > 0 ? AMBER : BLUE,
  };
}

export const evidencePalette = { ink: INK, soft: SOFT, muted: MUTED, plum: PLUM, blue: BLUE };
