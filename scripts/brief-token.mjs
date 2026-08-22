#!/usr/bin/env node
/**
 * Print (or copy) the read-only token for the daily health brief.
 *
 * The brief endpoint accepts a token derived from OPERATOR_SYNC_TOKEN by HMAC,
 * so a scheduled email job can read the summary without holding the credential
 * that can also write to the health tables. This regenerates that value.
 *
 *   node scripts/brief-token.mjs          → copies to the clipboard, prints nothing
 *   node scripts/brief-token.mjs --show   → prints it instead
 */

import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

function readSyncToken() {
  if (process.env.OPERATOR_SYNC_TOKEN) return process.env.OPERATOR_SYNC_TOKEN;

  const envFile = readFileSync(join(repoRoot, '.env.local'), 'utf8');
  const line = envFile.split('\n').find((l) => l.startsWith('OPERATOR_SYNC_TOKEN='));
  if (!line) {
    console.error('OPERATOR_SYNC_TOKEN not found in .env.local');
    process.exit(1);
  }
  return line.slice('OPERATOR_SYNC_TOKEN='.length).trim().replace(/^["']|["']$/g, '');
}

const token = createHmac('sha256', readSyncToken()).update('health-brief-v1').digest('hex');

if (process.argv.includes('--show')) {
  console.log(token);
} else {
  const copy = spawnSync('pbcopy', { input: token });
  if (copy.status !== 0) {
    console.error('Could not reach pbcopy. Re-run with --show to print it instead.');
    process.exit(1);
  }
  console.log('Read-only brief token copied to the clipboard.');
  console.log('It can only read /api/operator/health/brief — it cannot write health data.');
}
