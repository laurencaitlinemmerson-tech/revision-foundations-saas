#!/usr/bin/env node
/**
 * Everfit → Operator lift log.
 *
 * Copies the sets from completed Everfit workouts into the portal's lift log
 * (`/api/operator/lifts`), so the strength score, PBs and the muscle map fill in
 * without typing. Runs on this Mac, read-only against Everfit: it never logs,
 * edits or deletes anything there.
 *
 * Uses the unofficial `everfit-mcp` client (pinned, reviewed at 0.0.4). It talks
 * only to Everfit's API with your own client login.
 *
 * Secrets never live in this file or the repo:
 *   - Everfit session: `npx everfit login` (without --save-password) stores a
 *     token and trusted device id in ~/.config/everfit/session.json (mode 600).
 *   - Everfit password, for renewing that token every ~10 days: macOS Keychain,
 *     service "everfit-sync", account = your Everfit email.
 *   - Operator password: macOS Keychain, service "nurselab-operator", account "operator".
 *
 * Usage:
 *   node scripts/everfit-sync.mjs --dry-run          show what would be copied
 *   node scripts/everfit-sync.mjs                    copy the last 3 days
 *   node scripts/everfit-sync.mjs --days 14          copy a longer window
 *   OPERATOR_SITE=http://localhost:3000 node scripts/everfit-sync.mjs
 *
 * Re-running is safe: a lift already in the log for the same day and exercise
 * name is skipped, so nothing is copied twice.
 */

import { execFileSync } from 'node:child_process';
import { createClient } from 'everfit-mcp/client';
import { readSession, storedClientOptions } from 'everfit-mcp/store';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const DRY = flag('dry-run');
const DAYS = Math.max(1, Math.min(60, Number(opt('days', 3)) || 3));
const SITE = (process.env.OPERATOR_SITE ?? 'https://www.nurselab.co.uk').replace(/\/$/, '');
const LB_TO_KG = 0.45359237;

const log = (...a) => console.log(new Date().toISOString().slice(0, 19), ...a);

/** A Keychain item, or null when it is not there. Nothing is printed. */
function keychain(service, account) {
  try {
    return execFileSync('security', ['find-generic-password', '-s', service, '-a', account, '-w'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || null;
  } catch {
    return null;
  }
}

const ymd = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Everfit's `day` is MM-DD-YYYY; start/end dates are ISO. Prefer the local date of the start. */
function performedOn(d) {
  if (d.start_date) {
    const t = new Date(d.start_date);
    if (!Number.isNaN(t.getTime())) return ymd(t);
  }
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(String(d.day ?? ''));
  if (m) return `${m[3]}-${m[1]}-${m[2]}`;
  const t = new Date(d.day);
  return Number.isNaN(t.getTime()) ? null : ymd(t);
}

const num = (v) => {
  const n = Number(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

/**
 * The logged (not prescribed) sets of one workout, as lift-log entries.
 * Sets marked done win; if the coach app marked none, every set with reps counts.
 */
function liftsFrom(detail) {
  const out = [];
  for (const sec of detail.sections_complete ?? []) {
    for (const ex of sec.exercises ?? []) {
      for (const ss of ex.supersets ?? []) {
        const name = ss.exercise?.title?.trim();
        if (!name) continue;
        const all = ss.training_sets ?? [];
        const done = all.filter((s) => s.is_completed);
        const sets = (done.length ? done : all)
          .map((s) => {
            const reps = Math.round(num(s.reps?.value));
            const raw = num(s.weight?.value);
            const unit = String(s.weight?.set_unit?.title ?? 'kg').toLowerCase();
            const weightKg = unit.startsWith('lb') ? Math.round(raw * LB_TO_KG * 10) / 10 : raw;
            return { reps, weightKg };
          })
          .filter((s) => s.reps > 0);
        if (sets.length) out.push({ exercise: name, sets });
      }
    }
  }
  return out;
}

async function main() {
  const session = readSession();
  if (!session?.token && !session?.email) {
    throw new Error('No Everfit session. Run: npx everfit login   (once, in a terminal)');
  }
  const everfitPw = session.email ? keychain('everfit-sync', session.email) : null;
  const operatorPw = process.env.OPERATOR_PASSWORD ?? keychain('nurselab-operator', 'operator');
  if (!operatorPw && !DRY) {
    throw new Error('No operator password in Keychain (service "nurselab-operator", account "operator").');
  }

  const client = createClient({
    ...storedClientOptions(),
    ...(everfitPw ? { email: session.email, password: everfitPw } : {}),
    getOtp: () => { throw new Error('Everfit wants a new emailed code — run: npx everfit login'); },
  });

  const end = new Date();
  const start = new Date(Date.now() - (DAYS - 1) * 864e5);
  const workouts = (await client.listTrainingSessions({ start_date: ymd(start), end_date: ymd(end) }))
    .filter((w) => w.status === 'completed');
  log(`Everfit: ${workouts.length} completed workout(s) from ${ymd(start)} to ${ymd(end)}`);
  if (!workouts.length) return;

  const incoming = [];
  for (const w of workouts) {
    const d = await client.getTrainingSession(w.assignment_id, { raw: true });
    const day = performedOn(d);
    if (!day) { log(`  skipped "${w.title}": no date on it`); continue; }
    for (const l of liftsFrom(d)) incoming.push({ ...l, performedOn: day, note: `Everfit · ${d.title ?? w.title ?? 'workout'}` });
  }

  let existing = [];
  if (operatorPw) {
    const r = await fetch(`${SITE}/api/operator/lifts?from=${ymd(start)}`, { headers: { 'x-operator-pw': operatorPw } });
    if (r.status === 401) throw new Error('The portal refused the operator password.');
    if (!r.ok) throw new Error(`Reading the lift log failed: HTTP ${r.status}`);
    const body = await r.json();
    if (body.setup_required) throw new Error('The lift table is not set up yet — run supabase-operator-lifts.sql in Supabase.');
    existing = body.lifts ?? [];
  }
  const have = new Set(existing.map((l) => `${String(l.performedOn).slice(0, 10)}|${l.exercise.trim().toLowerCase()}`));

  let added = 0;
  let skipped = 0;
  for (const l of incoming) {
    const key = `${l.performedOn}|${l.exercise.toLowerCase()}`;
    const label = `${l.performedOn}  ${l.exercise}  ${l.sets.map((s) => `${s.weightKg}kg×${s.reps}`).join(', ')}`;
    if (have.has(key)) { skipped++; continue; }
    if (DRY) { log(`  would add  ${label}`); added++; continue; }
    const r = await fetch(`${SITE}/api/operator/lifts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-operator-pw': operatorPw },
      body: JSON.stringify(l),
    });
    if (!r.ok) { log(`  FAILED     ${label} (HTTP ${r.status})`); continue; }
    have.add(key);
    added++;
    log(`  added      ${label}`);
  }
  log(`${DRY ? 'Dry run: would add' : 'Added'} ${added}, already there ${skipped}.`);
}

main().catch((e) => {
  console.error(`everfit-sync: ${e.message}`);
  process.exit(1);
});
