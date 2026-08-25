#!/usr/bin/env node
/**
 * Print the Health Auto Export URL to hand to the partner.
 *
 * The token it prints is derived from OPERATOR_SYNC_TOKEN and only authorises
 * POSTs to /api/operator/partner. It cannot write to the operator's own health
 * history and cannot read the morning brief, so it is safe to give to the person
 * whose data is being compared.
 *
 *   node scripts/partner-sync-url.mjs louis
 */

import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const person = (process.argv[2] ?? 'partner').trim().toLowerCase();

function readEnv(file) {
  try {
    const out = {};
    for (const line of readFileSync(resolve(process.cwd(), file), 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
    return out;
  } catch {
    return {};
  }
}

const env = { ...readEnv('.env.local'), ...readEnv('.env') };
const syncToken = process.env.OPERATOR_SYNC_TOKEN || env.OPERATOR_SYNC_TOKEN;

if (!syncToken) {
  console.error('OPERATOR_SYNC_TOKEN not found in .env.local or the environment.');
  process.exit(1);
}

const base = (process.env.NEXT_PUBLIC_APP_URL || env.NEXT_PUBLIC_APP_URL || 'https://nurselab.co.uk')
  .replace(/\/+$/, '');
const token = createHmac('sha256', syncToken).update('partner-sync-v1').digest('hex');
const url = `${base}/api/operator/partner?token=${token}&person=${encodeURIComponent(person)}`;

console.log('');
console.log(`  Health Auto Export URL for ${person}:`);
console.log('');
console.log(`  ${url}`);
console.log('');
console.log('  This token only writes to the partner endpoint. It cannot touch your own');
console.log('  health history and cannot read your morning brief.');
console.log('');
