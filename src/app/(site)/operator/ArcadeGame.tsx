'use client';

// ─── Ward Arcade: GOSH Ward Run ──────────────────────────────────────────────
// An 8-bit paeds shift: a student nurse runs the ward at Great Ormond Street —
// twelve bays from the ward doors to handover — collecting teddies, bravery
// stickers, and balloons while dodging wet-floor signs, dropped toy blocks,
// runaway playroom balls, and the one pigeon that got in through a window.
// Russell Square is visible through the ward windows.
//
// The canvas renders at a fixed 320×180 and scales up with
// image-rendering: pixelated, so everything stays chunky. All game state
// lives in a ref and mutates inside a rAF loop; React only tracks the phase
// (title / playing / paused / won / over) and the saved high score.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import SupplyDrop from './SupplyDrop';

const W = 320;
const H = 180;
const GROUND = 150;            // y of the ward floor (player feet rest here)
const GOAL = 3600;             // scroll length of the shift, in world px
const BAYS = 12;
const PLAYER_X = 44;
const BEST_KEY = 'op-arcade-best';

type Phase = 'title' | 'playing' | 'paused' | 'won' | 'over';

interface Obstacle { kind: 'wet' | 'blocks' | 'ball' | 'pigeon'; x: number; seed: number; }
interface Pickup { kind: 'teddy' | 'star' | 'balloon'; x: number; y: number; taken: boolean; }
interface Floater { x: number; y: number; txt: string; ttl: number; }

interface GameState {
  t: number; worldX: number; speed: number;
  py: number; vy: number; jumps: number;
  hearts: number; score: number; inv: number;
  obstacles: Obstacle[]; pickups: Pickup[]; floaters: Floater[];
  nextObs: number; nextPick: number;
}

const freshState = (): GameState => ({
  t: 0, worldX: 0, speed: 112,
  py: GROUND - 16, vy: 0, jumps: 0,
  hearts: 3, score: 0, inv: 0,
  obstacles: [], pickups: [], floaters: [],
  nextObs: 560, nextPick: 320,
});

// Deterministic pseudo-random from a world position, so scenery is stable.
const rnd = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0');

// ─── Sprites ─────────────────────────────────────────────────────────────────

type Pal = Record<string, string>;

// Paeds student nurse: pink polka-dot scrubs, ponytail trailing behind,
// fob watch on the chest.
const NURSE_PAL: Pal = {
  H: '#4a3123', S: '#e9b48a', K: '#1d2530', P: '#d96a9f',
  D: '#2b3f6b', W: '#f4f4f4', R: '#d64545',
};
// Ward sister at the handover desk — same build, teal scrubs.
const SISTER_PAL: Pal = { ...NURSE_PAL, P: '#4d9d97', H: '#2b2118' };
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
const NURSE_A = [...NURSE_BODY,
  '...DDDDDD...',
  '..DDD..DDD..',
  '..DD....DD..',
  '..WW....WW..',
];
const NURSE_B = [...NURSE_BODY,
  '...DDDDDD...',
  '....DD.DD...',
  '....DD.DD...',
  '....WW.WW...',
];
const NURSE_JUMP = [...NURSE_BODY,
  '...DDDDDD...',
  '...DDDDDD...',
  '...WW..WW...',
];

const PIGEON_PAL: Pal = { g: '#9aa0ab', G: '#6f7480', O: '#e08a2e' };
const PIGEON_A = [
  '..gg......',
  'Ogggg.....',
  '.ggggGGGG.',
  '.gggGGGG..',
  '..ggggg...',
  '...g.g....',
  '...O.O....',
];
const PIGEON_B = [
  '..gg..GG..',
  'Ogggg.GG..',
  '.gggggGG..',
  '.ggggggg..',
  '..ggggg...',
  '...g.g....',
  '...O.O....',
];

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

const STAR_PAL: Pal = { Y: '#e8b83a', y: '#f6d878' };
const STAR = [
  '...Y...',
  '..yYy..',
  'YYYYYYY',
  '.YYYYY.',
  '..YyY..',
  '.Y...Y.',
];

// Runaway playroom ball.
const BALL_PAL: Pal = { R: '#d0342c', W: '#f4f4f4' };
const BALL = [
  '..RRRR..',
  '.RRRRRR.',
  'RRRRRRRR',
  'WWWWWWWW',
  'RRRRRRRR',
  '.RRRRRR.',
  '..RRRR..',
];

// Wet floor sign — the classic yellow A-frame.
const WET_PAL: Pal = { Y: '#e8c53a', K: '#2b2118' };
const WET = [
  '....YY....',
  '...YYYY...',
  '...YKKY...',
  '..YYKKYY..',
  '..YYYYYY..',
  '..YYKKYY..',
  '.YYYYYYYY.',
  '.YY....YY.',
  '.YY....YY.',
  'KKK....KKK',
];

// Small patient in a mint gown who waves you in at handover.
const CHILD_PAL: Pal = { H: '#5b4130', S: '#eec9a5', K: '#1d2530', G: '#bfe3d2', W: '#f4f4f4' };
const CHILD_A = [
  '..HHHH..',
  '.HSSSSH.',
  '.HSKKSH.',
  '..SSSS..',
  '.GGGGGG.',
  'SGGGGGGS',
  '.GGGGGG.',
  '.GG..GG.',
  '.S....S.',
  '.W....W.',
];
const CHILD_B = [
  '..HHHH.S',
  '.HSSSSHS',
  '.HSKKSH.',
  '..SSSS.S',
  '.GGGGGG.',
  'SGGGGGG.',
  '.GGGGGG.',
  '.GG..GG.',
  '.S....S.',
  '.W....W.',
];

const HEART = [
  '.RR.RR.',
  'RRRRRRR',
  'RRRRRRR',
  '.RRRRR.',
  '..RRR..',
  '...R...',
];

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

// ─── World drawing ───────────────────────────────────────────────────────────

const pigeonTop = (o: Obstacle, t: number) => GROUND - 22 + Math.sin(t * 6 + o.seed * 40) * 3;
// The ball bounces between the floor and about knee-to-chest height.
const ballTop = (o: Obstacle, t: number) => GROUND - 7 - Math.abs(Math.sin(t * 3.2 + o.seed * 20)) * 30;

// A dropped tower of toy blocks — the classic paeds floor hazard.
function drawBlocks(ctx: CanvasRenderingContext2D, sx: number) {
  const x = Math.round(sx);
  ctx.fillStyle = '#d0342c';
  ctx.fillRect(x, GROUND - 7, 8, 7);
  ctx.fillStyle = '#3577c9';
  ctx.fillRect(x + 9, GROUND - 7, 8, 7);
  ctx.fillStyle = '#e8b83a';
  ctx.fillRect(x + 4, GROUND - 14, 8, 7);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillRect(x + 3, GROUND - 5, 2, 2);
  ctx.fillRect(x + 12, GROUND - 5, 2, 2);
  ctx.fillRect(x + 7, GROUND - 12, 2, 2);
}

const BALLOON_COLS = ['#d0342c', '#e8b83a', '#3577c9', '#67b06f'];

function drawBalloon(ctx: CanvasRenderingContext2D, x: number, y: number, col: string, s = 1) {
  const bx = Math.round(x); const by = Math.round(y);
  ctx.fillStyle = col;
  ctx.fillRect(bx, by, 5 * s, 6 * s);
  ctx.fillRect(bx + s, by - s, 3 * s, s);
  ctx.fillRect(bx + s, by + 6 * s, 3 * s, s);
  ctx.fillStyle = '#e8e8e8';
  ctx.fillRect(bx + 2 * s, by + 7 * s, 1, 9 * s);
}

// A ward bay: bed with a sleeping child, blanket colour and extras by hash.
function drawBed(ctx: CanvasRenderingContext2D, bx: number, seed: number) {
  const x = Math.round(bx);
  ctx.fillStyle = '#b58a5a';
  ctx.fillRect(x, 120, 3, 30);                       // headboard
  ctx.fillStyle = '#f4f4f4';
  ctx.fillRect(x + 3, 131, 31, 9);                   // mattress + pillow line
  ctx.fillStyle = '#eec9a5';
  ctx.fillRect(x + 6, 127, 5, 5);                    // child, tucked in
  ctx.fillStyle = '#5b4130';
  ctx.fillRect(x + 6, 126, 5, 2);
  const blankets = ['#d96a9f', '#3577c9', '#67b06f', '#e8b83a'];
  ctx.fillStyle = blankets[Math.floor(seed * 4) % 4];
  ctx.fillRect(x + 13, 132, 21, 8);                  // blanket
  ctx.fillStyle = '#8f9aa5';
  ctx.fillRect(x + 3, 140, 31, 2);                   // frame
  ctx.fillRect(x + 4, 142, 2, 8);
  ctx.fillRect(x + 31, 142, 2, 8);
  if (seed > 0.62) {
    drawBalloon(ctx, x + 28, 106 + Math.sin(seed * 30) * 2, BALLOON_COLS[Math.floor(seed * 7) % 4]);
  } else if (seed < 0.3) {
    ctx.fillStyle = '#8f9aa5';                       // IV stand
    ctx.fillRect(x + 38, 116, 1, 34);
    ctx.fillRect(x + 35, 116, 7, 1);
    ctx.fillStyle = '#cfe4f5';
    ctx.fillRect(x + 35, 117, 4, 6);
  }
}

// Handover: the nurses' station at the end of the round — sign, ward sister
// behind the desk, balloons, and a small patient waving you in.
function drawHandover(ctx: CanvasRenderingContext2D, doors: number, t: number) {
  const d = Math.round(doors);
  // sign
  ctx.fillStyle = '#f4f4f4';
  ctx.fillRect(d - 18, 58, 76, 16);
  ctx.fillStyle = '#9db8ae';
  ctx.fillRect(d - 18, 58, 76, 1);
  ctx.fillRect(d - 18, 73, 76, 1);
  ctx.fillStyle = '#d0342c';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('HANDOVER', d + 20, 69);
  // ward sister (desk drawn after her covers the legs)
  sprite(ctx, NURSE_A, SISTER_PAL, d + 14, GROUND - 16 - 14);
  // desk
  ctx.fillStyle = '#b58a5a';
  ctx.fillRect(d - 14, 133, 62, 17);
  ctx.fillStyle = '#efe9dc';
  ctx.fillRect(d - 16, 129, 66, 5);
  ctx.fillStyle = '#2b3f6b';
  ctx.fillRect(d + 34, 121, 10, 8);                  // obs monitor on the desk
  ctx.fillStyle = '#a9d5e8';
  ctx.fillRect(d + 35, 122, 8, 5);
  // balloons tied to the desk corner
  const bob = Math.sin(t * 3) * 2;
  drawBalloon(ctx, d + 50, 104 + bob, '#d0342c');
  drawBalloon(ctx, d + 57, 98 - bob, '#e8b83a');
  // small patient waving you in
  sprite(ctx, Math.floor(t * 2) % 2 ? CHILD_B : CHILD_A, CHILD_PAL, d - 32, GROUND - 10);
}

function drawScene(ctx: CanvasRenderingContext2D, s: GameState) {
  // ward walls: pastel two-tone with a dado rail
  ctx.fillStyle = '#ecf3ec';
  ctx.fillRect(0, 0, W, 94);
  ctx.fillStyle = '#b9d2c6';
  ctx.fillRect(0, 94, W, 2);
  ctx.fillStyle = '#d3e6de';
  ctx.fillRect(0, 96, W, 54);
  ctx.fillStyle = '#a8bfb5';
  ctx.fillRect(0, 147, W, 3);                        // skirting
  // bunting along the top of the wall
  const bunt = ['#d0342c', '#e8b83a', '#3577c9', '#67b06f', '#d96a9f'];
  ctx.fillStyle = '#9db8ae';
  ctx.fillRect(0, 30, W, 1);
  for (let x = -(s.worldX % 14), i = Math.floor(s.worldX / 14); x < W; x += 14, i++) {
    const c = bunt[((i % 5) + 5) % 5];
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x) + 3, 31, 6, 3);
    ctx.fillRect(Math.round(x) + 4, 34, 4, 2);
    ctx.fillRect(Math.round(x) + 5, 36, 2, 2);
  }
  // windows onto Russell Square — sky, plane trees, one with the roundel
  for (let k = Math.floor(s.worldX / 150) - 1; k < Math.floor((s.worldX + W) / 150) + 1; k++) {
    const wx = Math.round(k * 150 - s.worldX);
    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(wx, 44, 44, 44);
    ctx.fillStyle = '#bcd8e8';
    ctx.fillRect(wx + 2, 46, 40, 40);
    const r = rnd(k * 3.3);
    ctx.fillStyle = '#4f7f3f';
    ctx.fillRect(wx + 4 + Math.floor(r * 6), 68, 15, 18);
    ctx.fillStyle = '#639750';
    ctx.fillRect(wx + 20, 73 + Math.floor(r * 5), 18, 13);
    if (((k % 6) + 6) % 6 === 0) {
      // Russell Square station roundel, glimpsed between the trees
      ctx.strokeStyle = '#d0342c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(wx + 31, 57, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#1a4e9d';
      ctx.fillRect(wx + 25, 56, 12, 3);
    }
    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(wx + 21, 46, 2, 40);                // mullion
    ctx.fillRect(wx - 2, 88, 48, 3);                 // sill
  }
  // children's drawings pinned to the lower wall between bays
  for (let k = Math.floor(s.worldX / 150) - 1; k < Math.floor((s.worldX + W) / 150) + 1; k++) {
    const px = Math.round(k * 150 + 118 - s.worldX);
    const r = rnd(k * 8.7);
    if (r < 0.2) continue;
    ctx.fillStyle = '#fdfbf4';
    ctx.fillRect(px, 102, 12, 14);
    if (r < 0.5) {                                   // crayon sun
      ctx.fillStyle = '#e8b83a';
      ctx.fillRect(px + 4, 106, 4, 4);
      ctx.fillRect(px + 2, 107, 1, 2);
      ctx.fillRect(px + 9, 107, 1, 2);
      ctx.fillRect(px + 5, 103, 2, 1);
      ctx.fillRect(px + 5, 112, 2, 1);
    } else if (r < 0.75) {                           // crayon rainbow
      ctx.fillStyle = '#d0342c'; ctx.fillRect(px + 2, 108, 8, 2);
      ctx.fillStyle = '#e8b83a'; ctx.fillRect(px + 3, 110, 6, 2);
      ctx.fillStyle = '#3577c9'; ctx.fillRect(px + 4, 112, 4, 2);
    } else {                                         // crayon heart
      ctx.fillStyle = '#d96a9f';
      ctx.fillRect(px + 3, 106, 2, 2);
      ctx.fillRect(px + 7, 106, 2, 2);
      ctx.fillRect(px + 2, 108, 8, 3);
      ctx.fillRect(px + 4, 111, 4, 2);
      ctx.fillRect(px + 5, 113, 2, 1);
    }
  }
  // ward bays: beds along the wall
  for (let k = Math.floor(s.worldX / 150) - 1; k < Math.floor((s.worldX + W) / 150) + 1; k++) {
    const bx = k * 150 + 62 - s.worldX;
    const bedWorld = k * 150 + 62;
    if (bedWorld < 50 || bedWorld > GOAL - 120) continue;
    drawBed(ctx, bx, rnd(k * 6.1));
  }
  // ward doors behind the start
  const dx = 6 - s.worldX;
  if (dx > -70) {
    ctx.fillStyle = '#9db8ae';
    ctx.fillRect(Math.round(dx), 96, 52, 54);
    ctx.fillStyle = '#7fa8c9';
    ctx.fillRect(Math.round(dx) + 3, 99, 22, 51);
    ctx.fillRect(Math.round(dx) + 27, 99, 22, 51);
    ctx.fillStyle = '#e8f4fa';
    ctx.fillRect(Math.round(dx) + 10, 108, 8, 8);
    ctx.fillRect(Math.round(dx) + 34, 108, 8, 8);
    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(Math.round(dx) + 6, 82, 40, 11);
    ctx.fillStyle = '#3577c9';
    ctx.font = '5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAEDS WARD', dx + 26, 90);
  }
  // handover desk scrolls in at the finish
  const doors = GOAL - s.worldX;
  if (doors < W + 80) drawHandover(ctx, doors, s.t);
  // lino floor
  ctx.fillStyle = '#e3ecef';
  ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = '#b6c6cc';
  ctx.fillRect(0, GROUND, W, 1);
  ctx.fillStyle = '#cdd9dd';
  for (let x = -(s.worldX % 26); x < W; x += 26) ctx.fillRect(Math.round(x), GROUND + 1, 1, H - GROUND - 1);
  // pickups
  for (const p of s.pickups) {
    const sx = p.x - s.worldX;
    if (sx < -20 || sx > W + 20) continue;
    const bob = Math.sin(s.t * 4 + p.x) * 1.5;
    if (p.kind === 'balloon') drawBalloon(ctx, sx, p.y + bob, BALLOON_COLS[Math.floor(rnd(p.x) * BALLOON_COLS.length)], 2);
    else sprite(ctx, p.kind === 'teddy' ? TEDDY : STAR, p.kind === 'teddy' ? TEDDY_PAL : STAR_PAL, sx, p.y + bob);
  }
  // obstacles
  for (const o of s.obstacles) {
    const sx = o.x - s.worldX;
    if (sx < -40 || sx > W + 40) continue;
    if (o.kind === 'wet') sprite(ctx, WET, WET_PAL, sx, GROUND - 10);
    else if (o.kind === 'blocks') drawBlocks(ctx, sx);
    else if (o.kind === 'ball') sprite(ctx, BALL, BALL_PAL, sx, ballTop(o, s.t));
    else sprite(ctx, Math.floor(s.t * 10 + o.seed * 9) % 2 ? PIGEON_A : PIGEON_B, PIGEON_PAL, sx, pigeonTop(o, s.t));
  }
  // player (flashes while invincible)
  if (!(s.inv > 0 && Math.floor(s.t * 14) % 2 === 0)) {
    const airborne = s.py < GROUND - 16 - 0.5;
    const frame = airborne ? NURSE_JUMP : (Math.floor(s.worldX / 14) % 2 ? NURSE_A : NURSE_B);
    sprite(ctx, frame, NURSE_PAL, PLAYER_X, s.py);
  }
  // floaters
  ctx.font = '6px monospace';
  ctx.textAlign = 'center';
  for (const f of s.floaters) {
    const sx = f.x - s.worldX;
    ctx.fillStyle = '#16243a';
    ctx.fillText(f.txt, sx + 1, f.y + 1);
    ctx.fillStyle = '#f4f4f4';
    ctx.fillText(f.txt, sx, f.y);
  }
  // HUD: hearts, round progress, score
  for (let i = 0; i < 3; i++) {
    sprite(ctx, HEART, { R: i < s.hearts ? '#d0342c' : 'rgba(29,37,48,0.25)' }, 6 + i * 10, 5);
  }
  ctx.fillStyle = '#16243a';
  ctx.font = '7px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`SCORE ${pad(s.score)}`, W - 6, 12);
  ctx.font = '6px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('WARD', 88, 12);
  ctx.fillText('HANDOVER', 218, 12);
  ctx.fillStyle = 'rgba(22,36,58,0.35)';
  ctx.fillRect(112, 8, 102, 2);
  const prog = Math.min(1, s.worldX / (GOAL - 70));
  ctx.fillStyle = '#d0342c';
  ctx.fillRect(112 + Math.round(prog * 100), 6, 3, 6);
  const bay = Math.min(BAYS, 1 + Math.floor((s.worldX / GOAL) * BAYS));
  ctx.fillStyle = '#16243a';
  ctx.textAlign = 'center';
  ctx.fillText(GOAL - s.worldX < 260 ? 'HANDOVER AHEAD' : `BAY ${bay} OF ${BAYS}`, 163, 22);
  // opening hint
  if (s.worldX < 220) {
    ctx.fillStyle = '#16243a';
    ctx.fillText('SPACE / TAP = JUMP', PLAYER_X + 8, 118);
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
  ctx.fillText('GOSH WARD RUN', W / 2, 54);
  ctx.fillStyle = '#bcd8e8';
  ctx.font = '7px monospace';
  ctx.fillText('a paeds shift — ward doors to handover', W / 2, 68);
  sprite(ctx, NURSE_A, NURSE_PAL, 58, 84, 2);
  sprite(ctx, TEDDY, TEDDY_PAL, 112, 100, 2);
  sprite(ctx, STAR, STAR_PAL, 150, 104, 2);
  drawBalloon(ctx, 170, 96, '#d0342c', 2);
  sprite(ctx, BALL, BALL_PAL, 208, 102, 2);
  ctx.font = '6px monospace';
  ctx.fillStyle = '#8fa8c5';
  ctx.fillText('YOU', 70, 126);
  ctx.fillText('+10', 120, 126);
  ctx.fillText('+25', 157, 126);
  ctx.fillText('+40', 183, 126);
  ctx.fillStyle = '#e08a8a';
  ctx.fillText('AVOID', 216, 126);
  ctx.fillStyle = '#8fa8c5';
  ctx.font = '7px monospace';
  ctx.fillText('SPACE / TAP TO JUMP — TWICE FOR A DOUBLE-JUMP', W / 2, 142);
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

function drawEnd(ctx: CanvasRenderingContext2D, s: GameState, phase: Phase, blink: boolean, best: number) {
  drawScene(ctx, s);
  ctx.fillStyle = 'rgba(13,19,33,0.82)';
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  if (phase === 'won') {
    ctx.fillStyle = '#f4d06f';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('HANDOVER COMPLETE!', W / 2, 60);
    ctx.fillStyle = '#bcd8e8';
    ctx.font = '7px monospace';
    ctx.fillText('obs done, stickers all round —', W / 2, 78);
    ctx.fillText('and every teddy found a bed', W / 2, 88);
  } else if (phase === 'over') {
    ctx.fillStyle = '#e05e4e';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('SHIFT OVER', W / 2, 60);
    ctx.fillStyle = '#bcd8e8';
    ctx.font = '7px monospace';
    ctx.fillText('the playroom wins this round — brew, then go again', W / 2, 80);
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

function update(s: GameState, dt: number): 'won' | 'over' | null {
  s.t += dt;
  s.speed = Math.min(172, s.speed + 2.2 * dt);
  s.worldX += s.speed * dt;
  if (s.inv > 0) s.inv -= dt;
  s.vy += 640 * dt;
  s.py += s.vy * dt;
  if (s.py >= GROUND - 16) { s.py = GROUND - 16; s.vy = 0; s.jumps = 0; }
  for (const o of s.obstacles) {
    if (o.kind === 'pigeon') o.x -= 26 * dt;
    else if (o.kind === 'ball') o.x -= 34 * dt;
  }

  while (s.nextObs < s.worldX + W + 80 && s.nextObs < GOAL - 420) {
    const r = rnd(s.nextObs);
    const kind = r < 0.12 ? 'pigeon' : r < 0.42 ? 'ball' : r < 0.72 ? 'wet' : 'blocks';
    const moving = kind === 'pigeon' || kind === 'ball';
    s.obstacles.push({ kind, x: s.nextObs + (moving ? 120 : 0), seed: r });
    s.nextObs += (150 + rnd(s.nextObs + 1) * 170) * (s.speed / 118);
  }
  while (s.nextPick < s.worldX + W + 80 && s.nextPick < GOAL - 160) {
    const r = rnd(s.nextPick * 1.7);
    if (r < 0.78) {
      const kind = r < 0.4 ? 'teddy' : r < 0.62 ? 'star' : 'balloon';
      s.pickups.push({
        kind,
        x: s.nextPick,
        y: kind === 'balloon' ? GROUND - 56
          : kind === 'star' ? GROUND - 52
          : (rnd(s.nextPick + 3) < 0.5 ? GROUND - 22 : GROUND - 40),
        taken: false,
      });
    }
    s.nextPick += 100 + rnd(s.nextPick + 2) * 140;
  }
  s.obstacles = s.obstacles.filter((o) => o.x - s.worldX > -60);
  s.pickups = s.pickups.filter((p) => !p.taken && p.x - s.worldX > -40);
  for (const f of s.floaters) { f.y -= 22 * dt; f.ttl -= dt; }
  s.floaters = s.floaters.filter((f) => f.ttl > 0);

  const pb = { x: PLAYER_X + 2, y: s.py + 2, w: 8, h: 13 };
  const hit = (x: number, y: number, w: number, h: number) =>
    pb.x < x + w && pb.x + pb.w > x && pb.y < y + h && pb.y + pb.h > y;

  for (const o of s.obstacles) {
    const sx = o.x - s.worldX;
    let bx = sx; let by = 0; let bw = 0; let bh = 0;
    if (o.kind === 'wet') { bx = sx + 1; by = GROUND - 10; bw = 8; bh = 10; }
    else if (o.kind === 'blocks') { bx = sx; by = GROUND - 14; bw = 17; bh = 14; }
    else if (o.kind === 'ball') { by = ballTop(o, s.t); bw = 8; bh = 7; }
    else { by = pigeonTop(o, s.t); bw = 10; bh = 7; }
    if (s.inv <= 0 && hit(bx, by, bw, bh)) {
      s.hearts -= 1;
      s.inv = 1.3;
      s.floaters.push({ x: o.x, y: by - 8, txt: 'OUCH', ttl: 0.8 });
      if (s.hearts <= 0) return 'over';
    }
  }
  for (const p of s.pickups) {
    const sx = p.x - s.worldX;
    if (!p.taken && hit(sx - 2, p.y - 2, 13, p.kind === 'balloon' ? 18 : 12)) {
      p.taken = true;
      const v = p.kind === 'teddy' ? 10 : p.kind === 'star' ? 25 : 40;
      s.score += v;
      s.floaters.push({ x: p.x, y: p.y - 6, txt: `+${v}`, ttl: 0.8 });
    }
  }
  if (GOAL - s.worldX <= 70) return 'won';
  return null;
}

// ─── Component ───────────────────────────────────────────────────────────────

function WardRun({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<GameState>(freshState());
  const [phase, setPhase] = useState<Phase>('title');
  const [best, setBest] = useState(0);

  useEffect(() => {
    try { setBest(Number(window.localStorage.getItem(BEST_KEY) ?? '0') || 0); } catch { /* private mode */ }
  }, []);

  const finish = useCallback((kind: 'won' | 'over') => {
    const s = gameRef.current;
    if (kind === 'won') s.score += 150 + s.hearts * 50;
    setBest((prev) => {
      const next = Math.max(prev, s.score);
      try { window.localStorage.setItem(BEST_KEY, String(next)); } catch { /* private mode */ }
      return next;
    });
    setPhase(kind);
  }, []);

  const action = useCallback(() => {
    setPhase((p) => {
      if (p === 'playing') {
        const s = gameRef.current;
        if (s.jumps < 2) { s.vy = s.jumps === 0 ? -218 : -200; s.jumps += 1; }
        return p;
      }
      if (p === 'paused') return 'playing';
      gameRef.current = freshState();
      return 'playing';
    });
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
      const end = update(s, dt);
      drawScene(ctx, s);
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
      else drawEnd(ctx, gameRef.current, phase, blink, best);
    };
    draw();
    const id = window.setInterval(() => { blink = !blink; draw(); }, 520);
    return () => window.clearInterval(id);
  }, [phase, best]);

  // Keyboard controls, only while the arcade page is the active one.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); action(); }
      else if (e.code === 'KeyP') setPhase((p) => (p === 'playing' ? 'paused' : p === 'paused' ? 'playing' : p));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, action]);

  // Leaving the page mid-run pauses rather than silently freezing.
  useEffect(() => {
    if (!active) setPhase((p) => (p === 'playing' ? 'paused' : p));
  }, [active]);

  return (
    <div className="op-arcade-frame">
      <div className="op-arcade-head">
        <span className="op-arcade-kicker">Cabinet 01 · Paeds ward · WC1N</span>
        <span className="op-arcade-best">Best {best > 0 ? best.toLocaleString() : '—'}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="op-arcade-canvas"
        tabIndex={0}
        role="application"
        aria-label="GOSH Ward Run, an 8-bit runner. Press space or tap to jump. Run the paediatric ward from the doors to handover, collecting teddies, bravery stickers, and balloons while dodging wet floors, toy blocks, playroom balls, and a stray pigeon."
        onPointerDown={(e) => { e.currentTarget.focus(); action(); }}
      />
      <p className="op-arcade-note">
        Space or tap to jump — twice for a double-jump · P pauses · Collect teddies (+10), bravery
        stickers (+25), and balloons (+40); dodge the wet floors, dropped toy blocks, runaway playroom
        balls — and the pigeon that got in through the window. Twelve bays from the ward doors to handover.
      </p>
    </div>
  );
}

// ─── Arcade shell ────────────────────────────────────────────────────────────
// Two cabinets share the arcade page: Ward Run (jump) and Supply Drop
// (left/right). Only the selected one mounts, so each game's keyboard
// listeners never fight over the same keys.

const CABINETS = [
  { id: 'run' as const, label: 'Ward Run', hint: 'jump' },
  { id: 'drop' as const, label: 'Supply Drop', hint: 'left / right' },
];

export default function ArcadeGame({ active }: { active: boolean }) {
  const [cabinet, setCabinet] = useState<'run' | 'drop'>('run');
  return (
    <div className="op-arcade">
      <div className="op-arcade-tabs" role="tablist" aria-label="Arcade cabinets">
        {CABINETS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={cabinet === c.id}
            className={`op-arcade-tab ${cabinet === c.id ? 'is-active' : ''}`}
            onClick={(e) => { setCabinet(c.id); e.currentTarget.blur(); }}
          >
            {c.label}
            <span className="op-arcade-tab-hint">{c.hint}</span>
          </button>
        ))}
      </div>
      {cabinet === 'run' ? <WardRun active={active} /> : <SupplyDrop active={active} />}
    </div>
  );
}
