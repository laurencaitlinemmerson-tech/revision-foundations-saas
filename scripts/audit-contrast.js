#!/usr/bin/env node
/**
 * Contrast audit for the study colour system.
 *
 * Parses the real token values out of src/app/globals.css — both the :root
 * block and the html[data-a11y-theme='night'] block — and checks every
 * foreground/background pairing the UI actually produces.
 *
 * Rules:
 *   *-text   >= 4.5:1 on page, on raised card, and on its own -surface
 *   *-solid  >= 3.0:1 on page and on its own -surface   (dots, bars, spines)
 *   ink-*    >= 4.5:1 on page and card
 *
 * Run:  node scripts/audit-contrast.js
 * Exits non-zero if anything fails, so it can gate CI.
 */
const fs = require('fs');
const path = require('path');

const CSS_PATH = path.join(__dirname, '..', 'src', 'app', 'globals.css');

function parseBlock(css, selector) {
  // Grab the outermost { ... } following the selector.
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`selector not found: ${selector}`);
  const open = css.indexOf('{', start);
  let depth = 0;
  let i = open;
  for (; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  const body = css.slice(open + 1, i);
  const vars = {};
  for (const m of body.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    vars[m[1].trim()] = m[2].trim();
  }
  return vars;
}

function hexToRgb(h) {
  h = h.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16));
}
function lum(rgb) {
  const s = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
}
function ratio(a, b) {
  const L1 = lum(hexToRgb(a));
  const L2 = lum(hexToRgb(b));
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

const css = fs.readFileSync(CSS_PATH, 'utf8');
const light = parseBlock(css, ':root');
const nightOverrides = parseBlock(css, "html[data-a11y-theme='night']");
const night = { ...light, ...nightOverrides };

const FAMILIES = [
  'assessment',
  'emergency',
  'meds',
  'skills',
  'anatomy',
  'professional',
  'foundations',
];
const STATES = ['correct', 'incorrect', 'warning', 'info', 'locked'];
const INKS = ['--ink-strong', '--ink-mid', '--ink-soft', '--ink-faint'];

let failures = 0;
let checks = 0;

function check(theme, label, fg, bg, min) {
  if (!fg || !bg || !fg.startsWith('#') || !bg.startsWith('#')) {
    console.log(`  SKIP  [${theme}] ${label} (non-hex: ${fg} on ${bg})`);
    return;
  }
  const r = ratio(fg, bg);
  checks++;
  const ok = r >= min;
  if (!ok) {
    failures++;
    console.log(
      `  FAIL  [${theme}] ${label.padEnd(46)} ${r.toFixed(2).padStart(6)}  need ${min}`,
    );
  }
}

function auditTheme(name, vars) {
  const page = vars['--surface-page'];
  const card = vars['--surface-raised'];

  for (const f of FAMILIES) {
    const surface = vars[`--topic-${f}-surface`];
    const text = vars[`--topic-${f}-text`];
    const solid = vars[`--topic-${f}-solid`];
    check(name, `topic-${f}-text on page`, text, page, 4.5);
    check(name, `topic-${f}-text on card`, text, card, 4.5);
    check(name, `topic-${f}-text on own surface`, text, surface, 4.5);
    check(name, `topic-${f}-solid on page`, solid, page, 3.0);
    check(name, `topic-${f}-solid on own surface`, solid, surface, 3.0);
  }

  for (const s of STATES) {
    const surface = vars[`--state-${s}-surface`];
    const text = vars[`--state-${s}-text`];
    const solid = vars[`--state-${s}-solid`];
    check(name, `state-${s}-text on page`, text, page, 4.5);
    check(name, `state-${s}-text on card`, text, card, 4.5);
    check(name, `state-${s}-text on own surface`, text, surface, 4.5);
    check(name, `state-${s}-solid on own surface`, solid, surface, 3.0);
  }

  for (const ink of INKS) {
    check(name, `${ink} on page`, vars[ink], page, 4.5);
    check(name, `${ink} on card`, vars[ink], card, 4.5);
    check(name, `${ink} on sunken`, vars[ink], vars['--surface-sunken'], 4.5);
  }

  // Primary action pair must stay legible against itself.
  check(name, 'action-text on action-bg', vars['--action-text'], vars['--action-bg'], 4.5);
  check(
    name,
    'surface-inverse-text on surface-inverse',
    vars['--surface-inverse-text'],
    vars['--surface-inverse'],
    4.5,
  );
  check(name, 'fab-text on fab-bg', vars['--fab-text'], vars['--fab-bg'], 4.5);
}

console.log('Contrast audit — reading real tokens from globals.css\n');
auditTheme('light', light);
auditTheme('night', night);

console.log(
  `\n${checks} checks run, ${failures} failure${failures === 1 ? '' : 's'}.`,
);
if (failures > 0) process.exit(1);
console.log('All pass.');
