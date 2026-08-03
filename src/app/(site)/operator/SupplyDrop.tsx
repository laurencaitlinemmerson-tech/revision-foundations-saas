'use client';

// ─── Ward Arcade: Supply Drop ────────────────────────────────────────────────
// Cabinet two. The stores chute above the paeds ward has jammed open and the
// restock is raining down — for the whole degree. Push the meds trolley LEFT
// and RIGHT through the five real placements of the KCL BSc Children's
// Nursing programme, one 15-second shift each, straight from the Nursing
// page's timeline: 🌸 Oncology (Feb 2026), 🧠 Neurosurgery (Jul 2026), then
// the three Year 2 wards still marked TBC. Two placements run as night
// shifts — the ward dims to slate and the windows show a moon over Russell
// Square. Catch teddies, meds pots, and
// jelly; sign the PAD off on every placement; dodge the toy blocks and
// bedpans. An end-of-shift results screen lands between placements — NMC
// practice hours banked (460 per shift toward the 2,300), achievements, and
// what's next, including the same live countdown to the July neurosurgery
// block that the Nursing page shows. Your catch rate is your final grade,
// marked on the real classification boundaries — 70% or better graduates
// with a first. Drop all three hearts and it's a refer-and-resit.
//
// Same tech as Ward Run: a fixed 320×180 canvas scaled up with
// image-rendering: pixelated, all game state in a ref mutated inside a rAF
// loop, React only tracking the phase and the saved high score. Sound is
// synthesised with the Web Audio API — square-wave bleeps, no sample files.

import React, { useCallback, useEffect, useRef, useState } from 'react';

const W = 320;
const H = 180;
const FLOOR = 160;             // top of the lino
const CATCH_Y = 138;           // top shelf of the trolley
const TROLLEY_W = 26;
const SHIFT_LEN = 15;          // seconds per placement shift

// The five real placements from the Nursing page (NursingSection), one shift
// each: Year 1's oncology and neurosurgery blocks, then the three Year 2
// placements whose wards are still marked TBC.
interface PlacementLevel { emoji: string; name: string; specialty: string; year: string; night?: boolean; }
const PLACEMENTS: PlacementLevel[] = [
  { emoji: '🌸', name: 'FEBRUARY 2026', specialty: 'ONCOLOGY', year: 'YEAR 1' },
  { emoji: '🧠', name: 'JULY 2026', specialty: 'NEUROSURGERY', year: 'YEAR 1', night: true },
  { emoji: '🍂', name: 'OCTOBER 2026', specialty: 'WARD TBC', year: 'YEAR 2' },
  { emoji: '🌷', name: 'FEBRUARY 2027', specialty: 'WARD TBC', year: 'YEAR 2', night: true },
  { emoji: '🌻', name: 'JULY 2027', specialty: 'WARD TBC', year: 'YEAR 2' },
];
const SHIFT = SHIFT_LEN * PLACEMENTS.length;   // the whole run, five shifts
// One PAD drop per placement, mid-shift — it gets signed off on every one.
const PAD_TIMES = PLACEMENTS.map((_, i) => (i + 0.5) * SHIFT_LEN);
const NMC_HOURS = 2300;                        // practice hours for registration
const HOURS_PER_SHIFT = NMC_HOURS / PLACEMENTS.length;
// The real July 2026 neurosurgery block starts 13 July — the results screen
// shows the same live countdown as the Nursing page's next-placement callout.
const NEURO_START = Date.UTC(2026, 6, 13);
const BEST_KEY = 'op-arcade-supply-best';
const SFX_KEY = 'op-arcade-sfx';

type Phase = 'title' | 'playing' | 'interlude' | 'paused' | 'won' | 'over';
type DropKind = 'teddy' | 'meds' | 'jelly' | 'pad' | 'block' | 'bedpan';

// ─── 8-bit sound effects ─────────────────────────────────────────────────────
// Square-wave bleeps synthesised with the Web Audio API — no sample files.
// The context is created lazily on the first user gesture (autoplay rules);
// sfxOn mirrors the persisted toggle in the frame header.

let actx: AudioContext | null = null;
let sfxOn = true;

interface Note { f: number; t: number; d: number; }  // freq (Hz), start (s), length (s)

function play(notes: Note[], type: OscillatorType = 'square', vol = 0.035) {
  if (!sfxOn || typeof window === 'undefined') return;
  try {
    actx = actx ?? new AudioContext();
    if (actx.state === 'suspended') void actx.resume();
  } catch { return; }
  const now = actx.currentTime;
  for (const n of notes) {
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(n.f, now + n.t);
    gain.gain.setValueAtTime(vol, now + n.t);
    gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
    osc.connect(gain).connect(actx.destination);
    osc.start(now + n.t);
    osc.stop(now + n.t + n.d + 0.02);
  }
}

const sfx = {
  start: () => play([{ f: 440, t: 0, d: 0.08 }, { f: 660, t: 0.09, d: 0.12 }]),
  catch: (kind: DropKind) =>
    play([{ f: kind === 'teddy' ? 523 : kind === 'meds' ? 659 : 784, t: 0, d: 0.09 }]),
  pad: () => play([
    { f: 523, t: 0, d: 0.07 }, { f: 659, t: 0.08, d: 0.07 },
    { f: 784, t: 0.16, d: 0.07 }, { f: 1047, t: 0.24, d: 0.16 },
  ]),
  streak: () => play([{ f: 784, t: 0, d: 0.06 }, { f: 988, t: 0.07, d: 0.1 }]),
  ouch: () => play([{ f: 220, t: 0, d: 0.12 }, { f: 155, t: 0.1, d: 0.16 }], 'sawtooth', 0.05),
  splat: () => play([{ f: 196, t: 0, d: 0.1 }], 'triangle', 0.05),
  year: () => play([{ f: 523, t: 0, d: 0.1 }, { f: 659, t: 0.11, d: 0.1 }, { f: 784, t: 0.22, d: 0.2 }]),
  grad: () => play([
    { f: 523, t: 0, d: 0.12 }, { f: 659, t: 0.13, d: 0.12 },
    { f: 784, t: 0.26, d: 0.12 }, { f: 1047, t: 0.39, d: 0.3 },
  ]),
  over: () => play([{ f: 392, t: 0, d: 0.14 }, { f: 311, t: 0.15, d: 0.14 }, { f: 233, t: 0.3, d: 0.3 }], 'sawtooth', 0.04),
};

// Degree classification, same boundaries as the Nursing page (NursingSection).
function classOf(pct: number): string {
  if (pct >= 70) return '1st';
  if (pct >= 60) return '2:1';
  if (pct >= 50) return '2:2';
  if (pct >= 40) return '3rd';
  return 'Fail';
}
const CLASS_LONG: Record<string, string> = {
  '1st': 'FIRST CLASS HONOURS',
  '2:1': 'UPPER SECOND · 2:1',
  '2:2': 'LOWER SECOND · 2:2',
  '3rd': 'THIRD CLASS',
  Fail: 'REFERRED',
};

// Which placement a moment of game time falls in.
const placementAt = (t: number): PlacementLevel =>
  PLACEMENTS[Math.min(PLACEMENTS.length - 1, Math.floor(t / SHIFT_LEN))];

interface Drop { kind: DropKind; x: number; y: number; vy: number; seed: number; dead?: boolean; }
interface Floater { x: number; y: number; txt: string; ttl: number; }

interface GameState {
  t: number; timeLeft: number;
  px: number; moving: number;
  hearts: number; score: number; inv: number; streak: number;
  caught: number; missed: number;          // decided supplies → the grade
  shiftIdx: number; padIdx: number;
  // per-placement tallies for the end-of-shift results screen
  yCaught: number; yMissed: number; yPad: boolean; yLost: number;
  drops: Drop[]; floaters: Floater[];
  nextDrop: number;
}

interface Input { left: boolean; right: boolean; target: number | null; }

const freshState = (): GameState => ({
  t: 0, timeLeft: SHIFT,
  px: W / 2 - TROLLEY_W / 2, moving: 0,
  hearts: 3, score: 0, inv: 0, streak: 0,
  caught: 0, missed: 0,
  shiftIdx: 0, padIdx: 0,
  yCaught: 0, yMissed: 0, yPad: false, yLost: 0,
  drops: [], floaters: [],
  nextDrop: 1.2,
});

// Final grade = catch rate over every supply whose fate is decided.
const gradePct = (s: GameState) => {
  const d = s.caught + s.missed;
  return d > 0 ? Math.round((s.caught / d) * 100) : 100;
};

const rnd = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0');

// ─── Sprites (shared visual language with Ward Run) ──────────────────────────

type Pal = Record<string, string>;

const NURSE_PAL: Pal = {
  H: '#4a3123', S: '#e9b48a', K: '#1d2530', P: '#d96a9f',
  D: '#2b3f6b', W: '#f4f4f4', R: '#d64545',
};
const NURSE_BODY = [
  '....HHHH....',
  '..HHHHHHH...',
  '.H.HSSSSH...',
  '..HHSKSKH...',
  '.H.HSSSSH...',
  '....SSSS....',
  '...PPPPPP...',
  '..PPWPPWPP..',
  '.SPPPPPPPPS.',
  '.SPPPRPPPPS.',
  '...PWPPWP...',
];
const NURSE_A = [...NURSE_BODY, '...DDDDDD...', '..DD....DD..'];
const NURSE_B = [...NURSE_BODY, '...DDDDDD...', '....DD.DD...'];

const TEDDY_PAL: Pal = { T: '#b07b3f', t: '#d9a967', K: '#2b2118' };
const TEDDY = [
  '.TT..TT.',
  'TTTTTTTT',
  'TTKTTKTT',
  'TTTttTTT',
  '.TTTTTT.',
  'TTTTTTTT',
  'TT.TT.TT',
  '.T....T.',
];

// Meds pot — little white cup with the red pills showing.
const MEDS_PAL: Pal = { W: '#f4f4f4', R: '#d0342c', C: '#cfe4f5' };
const MEDS = [
  '.RR..RR.',
  'WWWWWWWW',
  '.WWCCWW.',
  '.WWWWWW.',
  '..WWWW..',
];

// Jelly pot — green, on a little plate. The paeds ward currency.
const JELLY_PAL: Pal = { G: '#67b06f', g: '#8fcf96', W: '#f4f4f4' };
const JELLY = [
  '..gGGg..',
  '.GGGGGG.',
  '.GgGGgG.',
  'WWWWWWWW',
];

// The PAD — Practice Assessment Document, the pass/fail booklet every year
// hinges on. White paper, ruled lines, gold sign-off seal in the corner.
const PAD_PAL: Pal = { W: '#f4f4f4', L: '#8f9aa5', G: '#e8b83a' };
const PAD = [
  'WWWWWWW',
  'WLLLL.W',
  'WWWWWWW',
  'WLLLLLW',
  'WWWWWWW',
  'WLLL..W',
  'WWWWWGG',
  'WWWWWGG',
];

// Bedpan — papier-mâché grey, handle first.
const BEDPAN_PAL: Pal = { S: '#8f9aa5', s: '#c2cbd2', K: '#3a424c' };
const BEDPAN = [
  'KK......',
  'KSSSSSS.',
  '.ssssss.',
  '..SSSS..',
];

const HEART = [
  '.RR.RR.',
  'RRRRRRR',
  'RRRRRRR',
  '.RRRRR.',
  '..RRR..',
  '...R...',
];

const BLOCK_COLS = ['#d0342c', '#3577c9', '#e8b83a', '#67b06f'];

function sprite(ctx: CanvasRenderingContext2D, rows: string[], pal: Pal, x: number, y: number, sc = 1) {
  const ox = Math.round(x); const oy = Math.round(y);
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const col = pal[row[c]];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(ox + c * sc, oy + r * sc, sc, sc);
    }
  }
}

// A single dropped toy block, colour picked from its seed.
function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, seed: number) {
  const bx = Math.round(x); const by = Math.round(y);
  ctx.fillStyle = BLOCK_COLS[Math.floor(seed * 17) % 4];
  ctx.fillRect(bx, by, 8, 8);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillRect(bx + 3, by + 2, 2, 2);
}

function drawDrop(ctx: CanvasRenderingContext2D, d: Drop, t: number) {
  const sway = Math.sin(t * 3 + d.seed * 30) * 1.5;
  const x = d.x + sway;
  if (d.kind === 'teddy') sprite(ctx, TEDDY, TEDDY_PAL, x, d.y);
  else if (d.kind === 'meds') sprite(ctx, MEDS, MEDS_PAL, x, d.y);
  else if (d.kind === 'jelly') sprite(ctx, JELLY, JELLY_PAL, x, d.y);
  else if (d.kind === 'pad') sprite(ctx, PAD, PAD_PAL, x, d.y);
  else if (d.kind === 'block') drawBlock(ctx, x, d.y, d.seed);
  else sprite(ctx, BEDPAN, BEDPAN_PAL, x, d.y);
}

// The meds trolley: open steel frame, three shelves, already half-stocked.
function drawTrolley(ctx: CanvasRenderingContext2D, x: number) {
  const px = Math.round(x); const py = CATCH_Y;
  ctx.fillStyle = '#c2cbd2';
  ctx.fillRect(px + 1, py + 1, TROLLEY_W - 2, 1);
  ctx.fillStyle = '#8f9aa5';
  ctx.fillRect(px, py, TROLLEY_W, 2);              // top shelf
  ctx.fillRect(px, py + 9, TROLLEY_W, 2);          // mid shelf
  ctx.fillRect(px, py + 18, TROLLEY_W, 2);         // low shelf
  ctx.fillRect(px, py, 2, 20);                     // uprights
  ctx.fillRect(px + TROLLEY_W - 2, py, 2, 20);
  ctx.fillStyle = '#d0342c';
  ctx.fillRect(px + 4, py + 4, 5, 5);              // stocked boxes
  ctx.fillStyle = '#3577c9';
  ctx.fillRect(px + 11, py + 4, 5, 5);
  ctx.fillStyle = '#e8b83a';
  ctx.fillRect(px + 17, py + 13, 5, 5);
  ctx.fillStyle = '#2b2118';
  ctx.fillRect(px + 3, py + 20, 3, 2);             // wheels
  ctx.fillRect(px + TROLLEY_W - 6, py + 20, 3, 2);
}

// ─── World drawing ───────────────────────────────────────────────────────────

function drawScene(ctx: CanvasRenderingContext2D, s: GameState) {
  // day or night ward, depending on this placement's shift pattern
  const night = placementAt(s.t).night === true;
  const C = night
    ? { wallTop: '#2b3550', wallRail: '#3d4a6b', wallLow: '#222b43', skirt: '#171f31',
        chute: '#3d4a6b', teeth: '#2b3550', sky: '#141d33', floor: '#20293e',
        floorEdge: '#3a4668', floorTick: '#2f3a56', hud: '#e2e9f5', bar: 'rgba(226,233,245,0.4)' }
    : { wallTop: '#ecf3ec', wallRail: '#b9d2c6', wallLow: '#d3e6de', skirt: '#a8bfb5',
        chute: '#9db8ae', teeth: '#8aa89c', sky: '#bcd8e8', floor: '#e3ecef',
        floorEdge: '#b6c6cc', floorTick: '#cdd9dd', hud: '#16243a', bar: 'rgba(22,36,58,0.35)' };
  // ward walls: pastel two-tone by day, slate by night
  ctx.fillStyle = C.wallTop;
  ctx.fillRect(0, 0, W, 100);
  ctx.fillStyle = C.wallRail;
  ctx.fillRect(0, 100, W, 2);
  ctx.fillStyle = C.wallLow;
  ctx.fillRect(0, 102, W, 55);
  ctx.fillStyle = C.skirt;
  ctx.fillRect(0, 157, W, 3);                      // skirting
  // the jammed stores chute along the ceiling
  ctx.fillStyle = C.chute;
  ctx.fillRect(0, 0, W, 10);
  ctx.fillStyle = C.teeth;
  for (let x = 4; x < W; x += 10) ctx.fillRect(x, 2, 5, 6);
  ctx.fillStyle = '#f4f4f4';
  ctx.fillRect(W / 2 - 26, 1, 52, 8);
  ctx.fillStyle = '#d0342c';
  ctx.font = 'bold 6px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('STORES', W / 2, 8);
  // bunting under the chute
  const bunt = ['#d0342c', '#e8b83a', '#3577c9', '#67b06f', '#d96a9f'];
  ctx.fillStyle = '#9db8ae';
  ctx.fillRect(0, 32, W, 1);
  for (let x = 0, i = 0; x < W; x += 14, i++) {
    ctx.fillStyle = bunt[i % 5];
    ctx.fillRect(x + 3, 33, 6, 3);
    ctx.fillRect(x + 4, 36, 4, 2);
    ctx.fillRect(x + 5, 38, 2, 2);
  }
  // two windows onto Russell Square — plane trees by day, moon and stars by night
  const frame = night ? '#cdd6e6' : '#f4f4f4';
  for (const wx of [34, 242]) {
    ctx.fillStyle = frame;
    ctx.fillRect(wx, 48, 44, 44);
    ctx.fillStyle = C.sky;
    ctx.fillRect(wx + 2, 50, 40, 40);
    if (night) {
      ctx.fillStyle = '#e2e9f5';                   // stars, deterministic per window
      for (let k = 0; k < 7; k++) {
        const sx = wx + 4 + Math.floor(rnd(wx * 3.1 + k * 7.7) * 36);
        const sy = 52 + Math.floor(rnd(wx * 1.7 + k * 5.3) * 24);
        ctx.fillRect(sx, sy, 1, 1);
      }
      ctx.fillStyle = '#f4e9c8';                   // moon
      ctx.fillRect(wx + 28, 55, 9, 9);
      ctx.fillStyle = C.sky;                       // bitten into a crescent
      ctx.fillRect(wx + 25, 53, 7, 7);
    } else {
      ctx.fillStyle = '#4f7f3f';
      ctx.fillRect(wx + 6, 72, 15, 18);
      ctx.fillStyle = '#639750';
      ctx.fillRect(wx + 22, 76, 16, 14);
    }
    ctx.fillStyle = frame;
    ctx.fillRect(wx + 21, 50, 2, 40);              // mullion
    ctx.fillRect(wx - 2, 92, 48, 3);               // sill
  }
  // ward sign between the windows — names the current placement
  ctx.fillStyle = '#f4f4f4';
  ctx.fillRect(W / 2 - 34, 54, 68, 14);
  ctx.fillStyle = '#9db8ae';
  ctx.fillRect(W / 2 - 34, 54, 68, 1);
  ctx.fillRect(W / 2 - 34, 67, 68, 1);
  ctx.fillStyle = '#3577c9';
  ctx.font = 'bold 6px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(placementAt(s.t).specialty, W / 2, 63);
  // a child's crayon rainbow pinned between the windows
  ctx.fillStyle = '#fdfbf4';
  ctx.fillRect(154, 108, 12, 14);
  ctx.fillStyle = '#d0342c'; ctx.fillRect(156, 114, 8, 2);
  ctx.fillStyle = '#e8b83a'; ctx.fillRect(157, 116, 6, 2);
  ctx.fillStyle = '#3577c9'; ctx.fillRect(158, 118, 4, 2);
  // lino floor
  ctx.fillStyle = C.floor;
  ctx.fillRect(0, FLOOR, W, H - FLOOR);
  ctx.fillStyle = C.floorEdge;
  ctx.fillRect(0, FLOOR, W, 1);
  ctx.fillStyle = C.floorTick;
  for (let x = 6; x < W; x += 26) ctx.fillRect(x, FLOOR + 1, 1, H - FLOOR - 1);
  // falling supplies and hazards
  for (const d of s.drops) drawDrop(ctx, d, s.t);
  // player: nurse behind, trolley in front (flashes while invincible)
  if (!(s.inv > 0 && Math.floor(s.t * 14) % 2 === 0)) {
    const frame = s.moving !== 0 && Math.floor(s.px / 9) % 2 ? NURSE_B : NURSE_A;
    sprite(ctx, frame, NURSE_PAL, s.px + 7, CATCH_Y - 11);
    drawTrolley(ctx, s.px);
  }
  // floaters
  ctx.font = '6px monospace';
  ctx.textAlign = 'center';
  for (const f of s.floaters) {
    ctx.fillStyle = '#16243a';
    ctx.fillText(f.txt, f.x + 1, f.y + 1);
    ctx.fillStyle = '#f4f4f4';
    ctx.fillText(f.txt, f.x, f.y);
  }
  // HUD: hearts + running grade, degree bar (Y1 → graduation), score
  for (let i = 0; i < 3; i++) {
    sprite(ctx, HEART, { R: i < s.hearts ? '#d0342c' : 'rgba(29,37,48,0.25)' }, 6 + i * 10, 15);
  }
  const grade = gradePct(s);
  ctx.fillStyle = C.hud;
  ctx.font = '6px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`GRADE ${grade}% · ${classOf(grade).toUpperCase()}`, 6, 30);
  ctx.font = '7px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`SCORE ${pad(s.score)}`, W - 6, 22);
  ctx.font = '6px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('P1', 100, 22);
  ctx.fillText('PIN', 224, 22);
  ctx.fillStyle = C.bar;
  ctx.fillRect(116, 18, 102, 2);
  for (let i = 1; i < PLACEMENTS.length; i++) {    // placement boundaries
    ctx.fillRect(116 + Math.round((i / PLACEMENTS.length) * 102), 16, 1, 6);
  }
  const prog = 1 - s.timeLeft / SHIFT;
  ctx.fillStyle = '#d0342c';
  ctx.fillRect(116 + Math.round(prog * 100), 16, 3, 6);
  ctx.fillStyle = C.hud;
  ctx.textAlign = 'center';
  ctx.fillText(
    s.timeLeft < 10
      ? 'GRADUATION AHEAD'
      : `SHIFT ${Math.min(PLACEMENTS.length, 1 + Math.floor(s.t / SHIFT_LEN))} OF ${PLACEMENTS.length} · ${placementAt(s.t).specialty}${night ? ' · NIGHTS' : ''}`,
    167, 30,
  );
  // opening hint
  if (s.t < 4) {
    ctx.fillStyle = C.hud;
    ctx.fillText('ARROWS / DRAG = STEER THE TROLLEY', W / 2, 122);
  }
}

function drawTitle(ctx: CanvasRenderingContext2D, blink: boolean, best: number) {
  ctx.fillStyle = '#101a2c';
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 46; i++) {
    const r1 = rnd(i * 7.3); const r2 = rnd(i * 3.1);
    ctx.fillStyle = r1 > 0.5 ? '#2c3d57' : '#3d5273';
    ctx.fillRect(Math.floor(r1 * W), Math.floor(r2 * 66), 1, 1);
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8fa8c5';
  ctx.font = '7px monospace';
  ctx.fillText('WARD ARCADE PRESENTS', W / 2, 34);
  ctx.fillStyle = '#f4d06f';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('SUPPLY DROP', W / 2, 54);
  ctx.fillStyle = '#bcd8e8';
  ctx.font = '7px monospace';
  ctx.fillText('five real placements, days and night shifts', W / 2, 68);
  sprite(ctx, NURSE_A, NURSE_PAL, 44, 86, 2);
  sprite(ctx, TEDDY, TEDDY_PAL, 92, 100, 2);
  sprite(ctx, MEDS, MEDS_PAL, 124, 104, 2);
  sprite(ctx, JELLY, JELLY_PAL, 154, 106, 2);
  sprite(ctx, PAD, PAD_PAL, 186, 100, 2);
  drawBlock(ctx, 222, 100, 0.3);
  sprite(ctx, BEDPAN, BEDPAN_PAL, 244, 102, 2);
  ctx.font = '6px monospace';
  ctx.fillStyle = '#8fa8c5';
  ctx.fillText('YOU', 56, 126);
  ctx.fillText('+10', 100, 126);
  ctx.fillText('+25', 132, 126);
  ctx.fillText('+40', 162, 126);
  ctx.fillText('+50', 193, 126);
  ctx.fillStyle = '#e08a8a';
  ctx.fillText('AVOID', 244, 126);
  ctx.fillStyle = '#8fa8c5';
  ctx.font = '7px monospace';
  ctx.fillText('ARROWS OR DRAG TO MOVE — EARN YOUR 2,300 HOURS', W / 2, 142);
  if (blink) {
    ctx.fillStyle = '#e05e4e';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('PRESS START', W / 2, 160);
  }
  if (best > 0) {
    ctx.fillStyle = '#f4d06f';
    ctx.font = '7px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`BEST ${pad(best)}`, W - 6, 12);
  }
}

// End-of-placement results: the shift just worked (straight from the real
// placement timeline), NMC hours banked, achievements, and what's next.
function drawInterlude(ctx: CanvasRenderingContext2D, s: GameState, blink: boolean) {
  ctx.fillStyle = '#101a2c';
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 46; i++) {
    const r1 = rnd(i * 7.3); const r2 = rnd(i * 3.1);
    ctx.fillStyle = r1 > 0.5 ? '#2c3d57' : '#3d5273';
    ctx.fillRect(Math.floor(r1 * W), Math.floor(r2 * 66), 1, 1);
  }
  const done = PLACEMENTS[s.shiftIdx - 1];         // placement just completed
  const next = PLACEMENTS[s.shiftIdx];
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8fa8c5';
  ctx.font = '7px monospace';
  ctx.fillText(`PLACEMENT ${s.shiftIdx} OF ${PLACEMENTS.length} COMPLETE · ${done.year}`, W / 2, 28);
  ctx.fillStyle = '#f4d06f';
  ctx.font = 'bold 11px monospace';
  ctx.fillText(`${done.emoji} ${done.name} · ${done.specialty}${done.night ? ' ☾' : ''}`, W / 2, 46);
  ctx.fillStyle = '#bcd8e8';
  ctx.font = 'bold 8px monospace';
  ctx.fillText(
    `${Math.round(HOURS_PER_SHIFT * s.shiftIdx).toLocaleString()} / ${NMC_HOURS.toLocaleString()} NMC PRACTICE HOURS`,
    W / 2, 62,
  );
  // the shift's achievements
  const yTot = s.yCaught + s.yMissed;
  const yGrade = yTot > 0 ? Math.round((s.yCaught / yTot) * 100) : 100;
  const rows = [
    { ok: s.yPad, txt: s.yPad ? 'PAD SIGNED OFF' : 'PAD UNSIGNED' },
    {
      ok: s.yLost === 0,
      txt: s.yLost === 0 ? 'NO INCIDENTS ON THE WARD' : `${s.yLost} INCIDENT${s.yLost > 1 ? 'S' : ''} ON THE WARD`,
    },
    { ok: yGrade >= 70, txt: `SHIFT GRADE ${yGrade}% · ${classOf(yGrade).toUpperCase()}` },
  ];
  ctx.font = '7px monospace';
  rows.forEach((r, i) => {
    const y = 80 + i * 14;
    ctx.textAlign = 'left';
    ctx.fillStyle = r.ok ? '#f4d06f' : '#e08a8a';
    ctx.fillText(r.ok ? '*' : 'x', W / 2 - 78, y);
    ctx.fillStyle = '#bcd8e8';
    ctx.fillText(r.txt, W / 2 - 66, y);
  });
  sprite(ctx, PAD, PAD_PAL, W / 2 + 56, 76, 2);
  // real-world nods, matching the Nursing page's live data
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8fa8c5';
  ctx.font = '6px monospace';
  if (s.shiftIdx === 1) {
    // the Nursing page counts down to this exact placement
    const days = Math.ceil((NEURO_START - Date.now()) / 86400000);
    if (days > 0) ctx.fillText(`IRL: THIS ONE STARTS IN ${days} DAY${days === 1 ? '' : 'S'}`, W / 2, 128);
    else if (days > -34) ctx.fillText('IRL: ON THIS PLACEMENT RIGHT NOW', W / 2, 128);
  } else if (s.shiftIdx === 2) {
    ctx.fillText('END OF YEAR 1 — IRL TRANSCRIPT SAYS 78%. A FIRST.', W / 2, 128);
  }
  if (blink) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e05e4e';
    ctx.font = 'bold 8px monospace';
    ctx.fillText(`SPACE / TAP FOR ${next.emoji} ${next.name}${next.night ? ' · NIGHT SHIFT' : ''}`, W / 2, 152);
  }
}

function drawEnd(ctx: CanvasRenderingContext2D, s: GameState, phase: Phase, blink: boolean, best: number) {
  drawScene(ctx, s);
  ctx.fillStyle = 'rgba(13,19,33,0.82)';
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  if (phase === 'won') {
    const grade = gradePct(s);
    ctx.fillStyle = '#f4d06f';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('GRADUATION DAY!', W / 2, 56);
    ctx.font = 'bold 8px monospace';
    ctx.fillText(`FINAL GRADE ${grade}% · ${CLASS_LONG[classOf(grade)]}`, W / 2, 72);
    ctx.fillStyle = '#bcd8e8';
    ctx.font = '7px monospace';
    ctx.fillText('five placements worked, 2,300 practice hours logged —', W / 2, 88);
    ctx.fillText('NMC pin in the post', W / 2, 98);
  } else if (phase === 'over') {
    ctx.fillStyle = '#e05e4e';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('REFER & RESIT', W / 2, 60);
    ctx.fillStyle = '#bcd8e8';
    ctx.font = '7px monospace';
    ctx.fillText('the bedpans take the module this time —', W / 2, 80);
    ctx.fillText('resit and go again', W / 2, 90);
  } else {
    ctx.fillStyle = '#bcd8e8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('PAUSED', W / 2, 70);
  }
  if (phase !== 'paused') {
    ctx.fillStyle = '#f4f4f4';
    ctx.font = '8px monospace';
    ctx.fillText(`SCORE ${pad(s.score)}   BEST ${pad(best)}`, W / 2, 112);
  }
  if (blink) {
    ctx.fillStyle = '#e05e4e';
    ctx.font = 'bold 8px monospace';
    ctx.fillText(phase === 'paused' ? 'SPACE / P TO RESUME' : 'SPACE / TAP TO GO AGAIN', W / 2, 138);
  }
}

// ─── Simulation ──────────────────────────────────────────────────────────────

function update(s: GameState, dt: number, input: Input): 'won' | 'over' | 'shift' | null {
  s.t += dt;
  s.timeLeft -= dt;
  if (s.inv > 0) s.inv -= dt;
  const diff = 1 - s.timeLeft / SHIFT;             // 0 → 1 across the shift

  // trolley movement: keys give constant speed, drag chases the pointer
  const speed = 150;
  if (input.target !== null) {
    const d = input.target - (s.px + TROLLEY_W / 2);
    s.px += Math.sign(d) * Math.min(Math.abs(d), speed * 1.5 * dt);
    s.moving = Math.abs(d) > 2 ? Math.sign(d) : 0;
  } else {
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    s.px += dir * speed * dt;
    s.moving = dir;
  }
  s.px = Math.max(2, Math.min(W - TROLLEY_W - 2, s.px));

  // placement rollover → hand over to the end-of-shift results screen
  const idx = Math.min(PLACEMENTS.length - 1, Math.floor(s.t / SHIFT_LEN));
  if (idx > s.shiftIdx) { s.shiftIdx = idx; return 'shift'; }

  // one PAD per placement, on a schedule — it gets signed off on every one
  if (s.padIdx < PAD_TIMES.length && s.t >= PAD_TIMES[s.padIdx]) {
    s.padIdx += 1;
    s.drops.push({
      kind: 'pad',
      x: 8 + rnd(s.t * 4.9) * (W - 28),
      y: 10,
      vy: 40 + rnd(s.t * 6.1) * 12,             // drifts down slower — go get it
      seed: rnd(s.t * 2.3),
    });
  }

  // spawn drops from the chute, faster as the degree wears on
  s.nextDrop -= dt;
  if (s.nextDrop <= 0) {
    const r = rnd(s.t * 13.7);
    const kind: DropKind =
      r < 0.30 ? 'teddy' : r < 0.50 ? 'meds' : r < 0.62 ? 'jelly' : r < 0.82 ? 'block' : 'bedpan';
    s.drops.push({
      kind,
      x: 8 + rnd(s.t * 5.1) * (W - 28),
      y: 10,
      vy: 42 + diff * 58 + rnd(s.t * 9.3) * 18,
      seed: rnd(s.t * 7.7),
    });
    s.nextDrop = (0.95 - diff * 0.5) * (0.7 + rnd(s.t * 3.3) * 0.6);
  }

  // fall, catch, splat
  const bl = s.px; const br = s.px + TROLLEY_W;
  for (const d of s.drops) {
    d.y += d.vy * dt;
    const bottom = d.y + 6;
    if (!d.dead && bottom >= CATCH_Y && bottom < CATCH_Y + 9 && d.x + 7 > bl && d.x < br) {
      d.dead = true;
      if (d.kind === 'block' || d.kind === 'bedpan') {
        if (s.inv <= 0) {
          s.hearts -= 1; s.inv = 1.1; s.streak = 0; s.yLost += 1;
          s.floaters.push({ x: d.x, y: CATCH_Y - 8, txt: 'OUCH', ttl: 0.8 });
          sfx.ouch();
          if (s.hearts <= 0) return 'over';
        }
      } else {
        const v = d.kind === 'teddy' ? 10 : d.kind === 'meds' ? 25 : d.kind === 'jelly' ? 40 : 50;
        s.score += v; s.streak += 1; s.caught += 1; s.yCaught += 1;
        if (d.kind === 'pad') { s.yPad = true; sfx.pad(); } else sfx.catch(d.kind);
        s.floaters.push({
          x: d.x, y: CATCH_Y - 8,
          txt: d.kind === 'pad' ? 'PAD SIGNED +50' : `+${v}`,
          ttl: d.kind === 'pad' ? 1 : 0.8,
        });
        if (s.streak % 8 === 0) {
          s.score += 40;
          s.floaters.push({ x: s.px + TROLLEY_W / 2, y: CATCH_Y - 20, txt: 'TIDY WARD +40', ttl: 1 });
          sfx.streak();
        }
      }
    } else if (!d.dead && d.y >= FLOOR - 5) {
      d.dead = true;
      if (d.kind !== 'block' && d.kind !== 'bedpan') {
        s.streak = 0; s.missed += 1; s.yMissed += 1;
        s.floaters.push({ x: d.x, y: FLOOR - 8, txt: d.kind === 'pad' ? 'PAD UNSIGNED' : 'SPLAT', ttl: 0.7 });
        sfx.splat();
      }
    }
  }
  s.drops = s.drops.filter((d) => !d.dead);

  for (const f of s.floaters) { f.y -= 22 * dt; f.ttl -= dt; }
  s.floaters = s.floaters.filter((f) => f.ttl > 0);

  if (s.timeLeft <= 0) return 'won';
  return null;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SupplyDrop({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<GameState>(freshState());
  const inputRef = useRef<Input>({ left: false, right: false, target: null });
  const [phase, setPhase] = useState<Phase>('title');
  const [best, setBest] = useState(0);
  const [sound, setSound] = useState(true);
  const phaseRef = useRef(phase);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    try {
      setBest(Number(window.localStorage.getItem(BEST_KEY) ?? '0') || 0);
      const v = window.localStorage.getItem(SFX_KEY);
      if (v !== null) { sfxOn = v === '1'; setSound(sfxOn); }
    } catch { /* private mode */ }
  }, []);

  const toggleSound = useCallback(() => {
    setSound((prev) => {
      const next = !prev;
      sfxOn = next;
      try { window.localStorage.setItem(SFX_KEY, next ? '1' : '0'); } catch { /* private mode */ }
      return next;
    });
  }, []);

  const finish = useCallback((kind: 'won' | 'over') => {
    const s = gameRef.current;
    if (kind === 'won') { s.score += 100 + s.hearts * 50; sfx.grad(); } else sfx.over();
    setBest((prev) => {
      const next = Math.max(prev, s.score);
      try { window.localStorage.setItem(BEST_KEY, String(next)); } catch { /* private mode */ }
      return next;
    });
    setPhase(kind);
  }, []);

  const action = useCallback(() => {
    const p = phaseRef.current;
    if (p === 'playing') return;
    sfx.start();                                   // also unlocks the AudioContext
    if (p === 'interlude') {
      // resume into the next year with fresh per-year tallies
      const s = gameRef.current;
      s.yCaught = 0; s.yMissed = 0; s.yPad = false; s.yLost = 0;
    } else if (p !== 'paused') {
      gameRef.current = freshState();
      // Mutate rather than replace: the keyboard listeners hold this object.
      const held = inputRef.current;
      held.left = false; held.right = false; held.target = null;
    }
    setPhase('playing');
  }, []);

  // Main loop — only runs while the arcade page is visible and in play.
  useEffect(() => {
    if (phase !== 'playing' || !active) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.045, (now - last) / 1000);
      last = now;
      const s = gameRef.current;
      const end = update(s, dt, inputRef.current);
      drawScene(ctx, s);
      if (end === 'shift') { sfx.year(); setPhase('interlude'); return; }
      if (end) { finish(end); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, active, finish]);

  // Static screens (title / paused / won / over) with a blinking prompt.
  useEffect(() => {
    if (phase === 'playing') return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    let blink = true;
    const draw = () => {
      if (phase === 'title') drawTitle(ctx, blink, best);
      else if (phase === 'interlude') drawInterlude(ctx, gameRef.current, blink);
      else drawEnd(ctx, gameRef.current, phase, blink, best);
    };
    draw();
    const id = window.setInterval(() => { blink = !blink; draw(); }, 520);
    return () => window.clearInterval(id);
  }, [phase, best]);

  // Keyboard controls, only while the arcade page is the active one.
  useEffect(() => {
    if (!active) return;
    const held = inputRef.current;
    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); held.left = true; }
      else if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); held.right = true; }
      else if (e.code === 'Space') { e.preventDefault(); action(); }
      else if (e.code === 'KeyP') setPhase((p) => (p === 'playing' ? 'paused' : p === 'paused' ? 'playing' : p));
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') held.left = false;
      else if (e.code === 'ArrowRight' || e.code === 'KeyD') held.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      held.left = false; held.right = false; held.target = null;
    };
  }, [active, action]);

  // Leaving the page mid-run pauses rather than silently freezing.
  useEffect(() => {
    if (!active) setPhase((p) => (p === 'playing' ? 'paused' : p));
  }, [active]);

  // Pointer x in game coordinates, accounting for the CSS-scaled canvas.
  const toGameX = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * W;
  };

  return (
    <div className="op-arcade-frame">
      <div className="op-arcade-head">
        <span className="op-arcade-kicker">Cabinet 02 · BSc supply run · KCL</span>
        <span className="op-arcade-head-right">
          <button
            type="button"
            className="op-arcade-sound"
            aria-pressed={sound}
            onClick={toggleSound}
          >
            {sound ? 'Sound on' : 'Sound off'}
          </button>
          <span className="op-arcade-best">Best {best > 0 ? best.toLocaleString() : '—'}</span>
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="op-arcade-canvas"
        style={{ touchAction: 'none' }}
        tabIndex={0}
        role="application"
        aria-label="Supply Drop, an 8-bit catch game themed on the BSc Children's Nursing degree. Use the left and right arrow keys or drag to move the meds trolley through the five real placements — oncology, neurosurgery, and three Year 2 wards marked TBC, two of which are night shifts where the ward goes dark. Catch falling teddies, meds pots, jelly, and the PAD document on every placement; avoid the toy blocks and bedpans. A results screen between shifts tallies NMC practice hours and achievements. Your catch rate is your final degree grade."
        onPointerDown={(e) => {
          e.currentTarget.focus();
          if (phase === 'playing') {
            inputRef.current.target = toGameX(e);
            e.currentTarget.setPointerCapture(e.pointerId);
          } else {
            action();
          }
        }}
        onPointerMove={(e) => {
          if (inputRef.current.target !== null && e.buttons & 1) inputRef.current.target = toGameX(e);
        }}
        onPointerUp={() => { inputRef.current.target = null; }}
        onPointerCancel={() => { inputRef.current.target = null; }}
      />
      <p className="op-arcade-note">
        Arrow keys (or A/D) move the trolley — on touch, drag it · P pauses · Five 15-second
        shifts, one per real placement: 🌸 Oncology (Feb 2026), 🧠 Neurosurgery (July 2026), then
        the three Year 2 wards still marked TBC — two of them run as night shifts, when the ward
        goes dark and the moon comes out over Russell Square. A results screen between each banks
        460 NMC practice hours toward the 2,300. Catch teddies (+10), meds pots (+25), jelly (+40),
        and sign the PAD off on every placement (+50); eight in a row earns a tidy-ward bonus.
        Your catch rate is your final grade — 70% graduates with a first. Don&apos;t catch the toy
        blocks or bedpans; run out of hearts and it&apos;s a refer &amp; resit.
      </p>
    </div>
  );
}
