# Daily health brief

Everything the morning email needs, from one HTTP call. The maths — averages,
baselines, trends, targets — happens server-side, so the assistant writing the
email only has to write.

## The endpoint

```
GET https://www.nurselab.co.uk/api/operator/health/brief?format=text
Authorization: Bearer <read-only brief token>
```

### Which token to use

Use the **read-only brief token**. Generate it with:

```bash
node scripts/brief-token.mjs
```

That copies it to the clipboard without printing it. It is derived from
`OPERATOR_SYNC_TOKEN` by HMAC, so there is no second environment variable to
configure, and it opens this endpoint only — presented to the auto-sync route it
returns 401. Rotating it means rotating `OPERATOR_SYNC_TOKEN`.

`OPERATOR_SYNC_TOKEN` itself still works here, but it also authorises POSTs to
`/api/operator/fitness/auto-sync`, so anything holding it can overwrite the
health history it is meant to be reporting on. Don't hand it to a scheduled job.

### Callers that cannot set headers

Some clients — a plain web-fetch tool, a sandbox that only allows simple GETs —
cannot send an `Authorization` header. The same read-only token works in the
query string, so no separate endpoint is needed:

```bash
node scripts/brief-token.mjs --url
```

That copies a complete authenticated URL. It is a genuine trade: a token in a
query string is recorded in access logs at every hop, where a header is not.
Prefer the header whenever the caller can send one. Invalidating a leaked URL
means rotating `OPERATOR_SYNC_TOKEN`, which also means updating Health Auto
Export on the phone.

**Use the `www` host.** The apex `nurselab.co.uk` answers with a 307 to `www`,
and most clients — curl included — drop the `Authorization` header when a
redirect crosses hosts. The call then arrives unauthenticated and fails with a
401 that looks like a bad token rather than a redirect problem.

| Param | Default | What it does |
| --- | --- | --- |
| `format` | `json` | `text` returns the plain-text digest below. JSON returns structured data **and** the same text under `text`. |
| `date` | today | Backfill or test another day. |
| `goal` | `0.5` | Target weekly weight change in kg, used for the intake target. |
| `history` | `14` | Days of raw daily rows in the JSON payload. |

Auth also accepts `x-operator-pw: <OPERATOR_PASSWORD>`, or `?token=` as a last
resort — prefer the bearer header, since query strings end up in logs.

## What it contains

- **Weigh-in** — last reading, days since, change over the *actual* span between
  comparison points, 28-day regression trend in kg/week with an R² confidence,
  plateau detection.
- **Activity, heart, sleep, nutrition** — yesterday against its own 7-day and
  28-day baselines.
- **Energy** — BMR, TDEE (from measured active energy, not a flat multiplier),
  target intake, and yesterday's balance.
- **Protein** — target derived from fat-free mass where body composition is
  known, because g/kg of body weight overshoots badly at higher body fat.
- **Today's admin** — one piece of upkeep per weekday (the rota lives in
  `WEEKLY_ADMIN` in `src/lib/health/dailyBrief.ts` — edit it there).
- **Cues** — three buckets: things worth saying out loud, things worth a gentle
  mention, and things the data does not support saying at all.

## The three rules it enforces

1. **A missing metric is `null`, never `0`.** Apple Health writes real zeroes, so
   conflating the two would let a failed sync read as a lazy day.
2. **Implausible derived figures are suppressed.** The measured-maintenance
   calculation divides a fortnight's weight change by a fortnight, so a couple of
   kilos of water reads as a metabolic collapse — one real run returned
   "maintenance is 866 kcal, eat 320". Anything implying maintenance at or below
   BMR is dropped, and the brief says so instead.
3. **Gaps are stated, not filled.** Sleep stage data too thin to be a real night,
   or water that never synced, arrives labelled *do not invent*.

## Setting up the daily email in Claude Cowork

Give Claude this prompt, and schedule it daily. It fetches the brief itself.

```text
Fetch my health brief:

  GET https://www.nurselab.co.uk/api/operator/health/brief?format=text
  Authorization: Bearer <read-only brief token>

Then email me a summary at laurencaitlinemmerson@gmail.com.

Voice — warm, chatty, like a friend who has my back. Second person. Emoji where
they land naturally, not in every line. Open with the day ("Morning babe! ☀️").

Structure:
1. Open warm, then the weigh-in nudge — remind me to log today's number, and
   remind me the number is one data point, not a verdict. Bodies fluctuate with
   water, sleep, hormones, salt.
2. Yesterday in a few lines. Lead with what went well — the brief's "worth saying
   out loud" cues are already the earned ones. Then anything from "gently worth a
   mention", framed as information, never as a telling-off.
3. Today's admin, from the brief's admin section. Make it feel like two minutes
   of upkeep, not a chore list.
4. Close with something true and encouraging about the system I'm building, not
   just the outcome.

Hard rules:
- Never quote a number the brief listed under "do not invent". If sleep is
  flagged unreliable, do not mention sleep at all.
- Never suggest a calorie target below my BMR, and never repeat a maintenance
  figure the brief suppressed.
- If the scale trend is up, name it calmly with its likely causes attached. Do
  not skip it, and do not moralise about it.
- No food guilt, ever. No "earning" or "burning off" food.
- Keep it under ~300 words.
```

Schedule it for around 07:00 Europe/London. The brief covers *yesterday*, so any
morning slot after the overnight sync works.

## Known gaps in the source data

- **Water is not syncing.** Nothing has ever landed in `water_ml`, so hydration
  can be nudged but never measured. Fix by enabling water in Health Auto Export's
  metric list.
- **Sleep arrives as fragments.** Stage samples land without a session behind
  them (a "night" of 8 minutes), so the brief refuses to report a sleep figure.
  Same fix — check sleep analysis is enabled in the export.
- **Weigh-ins before 2026-07 are stored twice.** The brief dedupes by date
  defensively, but `operator_fitness_readings` itself still holds ~396 duplicate
  rows.
