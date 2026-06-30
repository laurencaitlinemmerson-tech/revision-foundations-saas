'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  serif,
  display,
  ink,
  inkMid,
  inkLight,
  cream,
  parchment,
  panel,
  border,
} from '@/components/home/styles';

/* ------------------------------------------------------------------ *
 *  Muswell Hill Makeover — a Homescapes-style match-3 game           *
 *  Match North London icons to earn stars, then spend them doing up  *
 *  a tired Victorian terrace just off Muswell Hill Broadway (N10).    *
 * ------------------------------------------------------------------ */

const ROWS = 8;
const COLS = 8;
const SIZE = ROWS * COLS;
const BASE_MOVES = 20;

type TileDef = { emoji: string; name: string; bg: string; ring: string };

const TILES: TileDef[] = [
  { emoji: '🏰', name: 'Ally Pally', bg: '#E7EEF8', ring: '#2E67B1' },
  { emoji: '☕', name: 'Flat white', bg: '#F1E9DF', ring: '#A9794F' },
  { emoji: '🦊', name: 'Wood fox', bg: '#FBEAE2', ring: '#D96C55' },
  { emoji: '📚', name: 'Bookshop', bg: '#E6F4EA', ring: '#1E8A4D' },
  { emoji: '🥐', name: 'The bakery', bg: '#FBF3DC', ring: '#D9A441' },
  { emoji: '🌳', name: "Queen's Wood", bg: '#E6F3F1', ring: '#2F8A7E' },
];
const TYPES = TILES.length;

type Board = number[]; // each cell is a tile index, or -1 when cleared

const rc = (r: number, c: number) => r * COLS + c;
const rowOf = (i: number) => Math.floor(i / COLS);
const colOf = (i: number) => i % COLS;
const randTile = () => Math.floor(Math.random() * TYPES);

function areAdjacent(a: number, b: number) {
  const dr = Math.abs(rowOf(a) - rowOf(b));
  const dc = Math.abs(colOf(a) - colOf(b));
  return dr + dc === 1;
}

/** Build a starting board guaranteed to contain no immediate matches. */
function createBoard(): Board {
  const b: Board = new Array(SIZE).fill(-1);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let t = randTile();
      // avoid two-in-a-row to the left and two stacked above
      let guard = 0;
      while (
        guard++ < 20 &&
        ((c >= 2 && b[rc(r, c - 1)] === t && b[rc(r, c - 2)] === t) ||
          (r >= 2 && b[rc(r - 1, c)] === t && b[rc(r - 2, c)] === t))
      ) {
        t = randTile();
      }
      b[rc(r, c)] = t;
    }
  }
  return b;
}

/** Indices that belong to any horizontal or vertical run of 3+. */
function findMatches(b: Board): Set<number> {
  const matched = new Set<number>();
  // horizontal
  for (let r = 0; r < ROWS; r++) {
    let runStart = 0;
    for (let c = 1; c <= COLS; c++) {
      const same =
        c < COLS && b[rc(r, c)] !== -1 && b[rc(r, c)] === b[rc(r, runStart)];
      if (!same) {
        if (c - runStart >= 3) {
          for (let k = runStart; k < c; k++) matched.add(rc(r, k));
        }
        runStart = c;
      }
    }
  }
  // vertical
  for (let c = 0; c < COLS; c++) {
    let runStart = 0;
    for (let r = 1; r <= ROWS; r++) {
      const same =
        r < ROWS && b[rc(r, c)] !== -1 && b[rc(r, c)] === b[rc(runStart, c)];
      if (!same) {
        if (r - runStart >= 3) {
          for (let k = runStart; k < r; k++) matched.add(rc(k, c));
        }
        runStart = r;
      }
    }
  }
  return matched;
}

/** Drop tiles into gaps (-1) and refill the top of each column. */
function collapse(b: Board): Board {
  const next = b.slice();
  for (let c = 0; c < COLS; c++) {
    const column: number[] = [];
    for (let r = ROWS - 1; r >= 0; r--) {
      const v = next[rc(r, c)];
      if (v !== -1) column.push(v);
    }
    for (let r = ROWS - 1; r >= 0; r--) {
      const fromBottom = ROWS - 1 - r;
      next[rc(r, c)] = fromBottom < column.length ? column[fromBottom] : randTile();
    }
  }
  return next;
}

/** True if at least one swap exists that would create a match. */
function hasPossibleMove(b: Board): boolean {
  const test = (i: number, j: number) => {
    const copy = b.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return findMatches(copy).size > 0;
  };
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = rc(r, c);
      if (c < COLS - 1 && test(i, rc(r, c + 1))) return true;
      if (r < ROWS - 1 && test(i, rc(r + 1, c))) return true;
    }
  }
  return false;
}

function targetForLevel(level: number) {
  return 700 + (level - 1) * 350;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/* --------------------------- Renovation meta --------------------------- */

type Task = { id: string; label: string; cost: number };
type Room = { id: string; name: string; emoji: string; intro: string; tasks: Task[] };

const ROOMS: Room[] = [
  {
    id: 'garden',
    name: 'The Front Garden',
    emoji: '🌿',
    intro:
      "You've inherited a tired Victorian terrace on a side street off Muswell Hill Broadway. Start at the front — first impressions count on the school run.",
    tasks: [
      { id: 'garden-path', label: 'Relay the original tessellated path tiles', cost: 1 },
      { id: 'garden-hedge', label: 'Trim back the overgrown privet hedge', cost: 1 },
      { id: 'garden-bins', label: 'Build a tidy bin store for the recycling', cost: 2 },
      { id: 'garden-door', label: 'Repaint the front door in heritage green', cost: 2 },
    ],
  },
  {
    id: 'living',
    name: 'The Living Room',
    emoji: '🛋️',
    intro:
      'Inside, the bay-windowed front room has good bones — a cast-iron fireplace under decades of paint and a ceiling rose worth saving.',
    tasks: [
      { id: 'living-fire', label: 'Restore the cast-iron Victorian fireplace', cost: 2 },
      { id: 'living-floor', label: 'Sand and oil the original floorboards', cost: 2 },
      { id: 'living-sofa', label: 'Add a deep sofa for Ally Pally fireworks night', cost: 2 },
      { id: 'living-shelves', label: 'Build alcove shelves for the bookshop hauls', cost: 3 },
    ],
  },
  {
    id: 'kitchen',
    name: 'The Kitchen',
    emoji: '🍳',
    intro:
      'The galley kitchen at the back opens onto the garden. Knock it through and it becomes the heart of the house.',
    tasks: [
      { id: 'kitchen-units', label: 'Fit shaker units and a butler sink', cost: 3 },
      { id: 'kitchen-doors', label: 'Install bi-fold doors onto the garden', cost: 3 },
      { id: 'kitchen-coffee', label: 'Plumb in the espresso machine (Broadway-grade)', cost: 2 },
      { id: 'kitchen-table', label: 'Reclaim an oak table for Sunday roasts', cost: 2 },
    ],
  },
  {
    id: 'loft',
    name: 'The Loft Conversion',
    emoji: '🪟',
    intro:
      'Finally, up into the eaves. A dormer here catches the view clean across to Alexandra Palace.',
    tasks: [
      { id: 'loft-dormer', label: 'Add a dormer with a view to Ally Pally', cost: 3 },
      { id: 'loft-velux', label: 'Cut in Velux roof lights over the desk', cost: 3 },
      { id: 'loft-ensuite', label: 'Squeeze in a slate-tiled en-suite', cost: 4 },
      { id: 'loft-reading', label: 'Build a reading nook above Queen’s Wood', cost: 3 },
    ],
  },
];

const ALL_TASKS = ROOMS.flatMap((r) => r.tasks);
const TOTAL_TASK_COUNT = ALL_TASKS.length;

/* ------------------------------- Storage ------------------------------- */

const STORE_KEY = 'mh_makeover_v1';
type SaveState = { stars: number; done: string[]; level: number; best: number };

function loadState(): SaveState {
  if (typeof window === 'undefined') return { stars: 0, done: [], level: 1, best: 0 };
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return { stars: 0, done: [], level: 1, best: 0 };
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    return {
      stars: parsed.stars ?? 0,
      done: Array.isArray(parsed.done) ? parsed.done : [],
      level: parsed.level ?? 1,
      best: parsed.best ?? 0,
    };
  } catch {
    return { stars: 0, done: [], level: 1, best: 0 };
  }
}

/* ================================ Component =============================== */

export default function MuswellHillGame() {
  const [board, setBoard] = useState<Board>(() => createBoard());
  const [selected, setSelected] = useState<number | null>(null);
  const [clearing, setClearing] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(BASE_MOVES);
  const [level, setLevel] = useState(1);
  const [stars, setStars] = useState(0);
  const [best, setBest] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [floaters, setFloaters] = useState<{ id: number; text: string }[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const busy = useRef(false);
  const pointerDown = useRef(false);
  const dragStart = useRef<number | null>(null);
  const floaterId = useRef(0);

  const target = targetForLevel(level);
  const doneSet = useMemo(() => new Set(done), [done]);

  /* ---- load persisted meta progress once on mount ---- */
  useEffect(() => {
    const s = loadState();
    setStars(s.stars);
    setDone(s.done);
    setLevel(s.level);
    setBest(s.best);
    setHydrated(true);
  }, []);

  /* ---- persist meta progress whenever it changes ---- */
  useEffect(() => {
    if (!hydrated) return;
    const payload: SaveState = { stars, done, level, best };
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [stars, done, level, best, hydrated]);

  const pushFloater = useCallback((text: string) => {
    const id = floaterId.current++;
    setFloaters((f) => [...f, { id, text }]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 900);
  }, []);

  /* --------------------------- core resolution --------------------------- */

  const resolve = useCallback(
    async (start: Board) => {
      let working = start;
      let chain = 0;
      let firstPass = true;
      while (true) {
        const matches = findMatches(working);
        if (matches.size === 0) break;
        chain += 1;
        const gained = matches.size * 10 * chain;
        setScore((s) => s + gained);
        if (chain >= 2) pushFloater(`Combo ×${chain}!  +${gained}`);
        else if (firstPass) pushFloater(`+${gained}`);

        setClearing(new Set(matches));
        await delay(170);

        const cleared = working.slice();
        matches.forEach((i) => (cleared[i] = -1));
        working = collapse(cleared);
        setBoard(working);
        setClearing(new Set());
        await delay(150);
        firstPass = false;
      }
      // guarantee the next move is possible
      let guard = 0;
      while (!hasPossibleMove(working) && guard++ < 40) {
        working = createBoard();
        setBoard(working);
        await delay(120);
        // settle any incidental matches from the reshuffle
        let m = findMatches(working);
        while (m.size > 0) {
          const cl = working.slice();
          m.forEach((i) => (cl[i] = -1));
          working = collapse(cl);
          m = findMatches(working);
        }
        setBoard(working);
      }
    },
    [pushFloater],
  );

  const trySwap = useCallback(
    async (a: number, b: number) => {
      if (busy.current || status !== 'playing') return;
      if (!areAdjacent(a, b)) return;
      busy.current = true;

      const swapped = board.slice();
      [swapped[a], swapped[b]] = [swapped[b], swapped[a]];

      if (findMatches(swapped).size === 0) {
        // invalid — show the nudge then snap back
        setBoard(swapped);
        await delay(160);
        setBoard(board);
        busy.current = false;
        return;
      }

      setMoves((m) => m - 1);
      setBoard(swapped);
      await delay(120);
      await resolve(swapped);
      busy.current = false;
    },
    [board, status, resolve],
  );

  /* ----------------------- win / lose evaluation ----------------------- */
  useEffect(() => {
    if (status !== 'playing' || busy.current) return;
    if (score >= target) {
      setStatus('won');
      const earned = score >= target * 1.6 ? 3 : score >= target * 1.25 ? 2 : 1;
      setStars((s) => s + earned);
      setBest((b) => Math.max(b, score));
      void fireConfetti();
    } else if (moves <= 0) {
      setStatus(score >= target ? 'won' : 'lost');
      setBest((b) => Math.max(b, score));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, moves]);

  const starsAwarded =
    status === 'won'
      ? score >= target * 1.6
        ? 3
        : score >= target * 1.25
          ? 2
          : 1
      : 0;

  /* ------------------------------ controls ------------------------------ */

  const startLevel = useCallback((lvl: number) => {
    let b = createBoard();
    let guard = 0;
    while (!hasPossibleMove(b) && guard++ < 20) b = createBoard();
    setBoard(b);
    setSelected(null);
    setClearing(new Set());
    setScore(0);
    setMoves(BASE_MOVES);
    setLevel(lvl);
    setStatus('playing');
    busy.current = false;
  }, []);

  const onTileActivate = useCallback(
    (i: number) => {
      if (busy.current || status !== 'playing') return;
      if (selected === null) {
        setSelected(i);
      } else if (selected === i) {
        setSelected(null);
      } else if (areAdjacent(selected, i)) {
        const a = selected;
        setSelected(null);
        void trySwap(a, i);
      } else {
        setSelected(i);
      }
    },
    [selected, status, trySwap],
  );

  const completeTask = useCallback(
    (task: Task) => {
      if (doneSet.has(task.id) || stars < task.cost) return;
      setStars((s) => s - task.cost);
      setDone((d) => [...d, task.id]);
    },
    [doneSet, stars],
  );

  const resetProgress = useCallback(() => {
    if (typeof window !== 'undefined' && !window.confirm('Start the makeover over from scratch?')) {
      return;
    }
    setStars(0);
    setDone([]);
    setBest(0);
    startLevel(1);
  }, [startLevel]);

  const renoComplete = done.length;
  const renoPct = Math.round((renoComplete / TOTAL_TASK_COUNT) * 100);

  /* -------------------------------- render -------------------------------- */

  return (
    <div style={{ background: cream, minHeight: '100vh', paddingBottom: '64px' }}>
      {/* Hero */}
      <header
        style={{
          background: `linear-gradient(160deg, #2E67B1 0%, #2F8A7E 100%)`,
          color: cream,
          padding: '56px 20px 48px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div
            style={{
              fontFamily: serif,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              opacity: 0.85,
              marginBottom: 14,
            }}
          >
            North London · N10 · A match-3 makeover
          </div>
          <h1
            style={{
              fontFamily: display,
              fontSize: 'clamp(34px, 6vw, 52px)',
              fontWeight: 500,
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Muswell Hill Makeover
          </h1>
          <p
            style={{
              fontFamily: serif,
              fontSize: 16,
              lineHeight: 1.6,
              opacity: 0.92,
              marginTop: 16,
            }}
          >
            Match the icons of the Broadway — Ally Pally, the bakery, a flat white,
            the bookshop, a Queen&apos;s Wood fox — to earn ⭐ stars, then spend them
            doing up a tired Victorian terrace just off Muswell Hill Broadway.
          </p>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '32px 20px 0',
          display: 'grid',
          gap: 28,
          gridTemplateColumns: 'minmax(0, 1fr)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: 28,
            gridTemplateColumns: 'minmax(300px, 1fr) minmax(280px, 380px)',
            alignItems: 'start',
          }}
          className="mh-grid"
        >
          {/* -------------------- Board column -------------------- */}
          <section
            style={{
              background: panel,
              border: `0.5px solid ${border}`,
              borderRadius: 4,
              padding: 18,
              position: 'relative',
            }}
          >
            {/* stat bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 10,
                marginBottom: 14,
                flexWrap: 'wrap',
              }}
            >
              <Stat label="Level" value={level} />
              <Stat label="Moves left" value={moves} highlight={moves <= 5} />
              <Stat label="Stars" value={`⭐ ${stars}`} />
            </div>

            {/* score / target progress */}
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: serif,
                  fontSize: 13,
                  color: inkMid,
                  marginBottom: 6,
                }}
              >
                <span>
                  Score <strong style={{ color: ink }}>{score}</strong>
                </span>
                <span>Target {target}</span>
              </div>
              <div
                style={{
                  height: 8,
                  background: parchment,
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, (score / target) * 100)}%`,
                    background: 'linear-gradient(90deg, #2F8A7E, #1E8A4D)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* the board */}
            <div
              role="grid"
              aria-label="Match-3 board"
              onPointerLeave={() => {
                pointerDown.current = false;
                dragStart.current = null;
              }}
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gap: 4,
                background: parchment,
                padding: 6,
                borderRadius: 6,
                touchAction: 'none',
                userSelect: 'none',
              }}
            >
              {board.map((t, i) => {
                const def = t >= 0 ? TILES[t] : null;
                const isSel = selected === i;
                const isClearing = clearing.has(i);
                return (
                  <button
                    key={i}
                    role="gridcell"
                    aria-label={def ? def.name : 'empty'}
                    onPointerDown={() => {
                      pointerDown.current = true;
                      dragStart.current = i;
                    }}
                    onPointerEnter={() => {
                      if (
                        pointerDown.current &&
                        dragStart.current !== null &&
                        dragStart.current !== i &&
                        areAdjacent(dragStart.current, i)
                      ) {
                        const from = dragStart.current;
                        pointerDown.current = false;
                        dragStart.current = null;
                        setSelected(null);
                        void trySwap(from, i);
                      }
                    }}
                    onPointerUp={() => {
                      pointerDown.current = false;
                      dragStart.current = null;
                    }}
                    onClick={() => onTileActivate(i)}
                    style={{
                      aspectRatio: '1 / 1',
                      border: isSel
                        ? `2px solid ${ink}`
                        : `1px solid rgba(0,0,0,0.05)`,
                      borderRadius: 8,
                      background: def ? def.bg : 'transparent',
                      boxShadow: isSel
                        ? `0 0 0 2px ${def?.ring ?? ink} inset`
                        : 'inset 0 -2px 0 rgba(0,0,0,0.06)',
                      cursor: status === 'playing' ? 'pointer' : 'default',
                      fontSize: 'clamp(18px, 4.4vw, 30px)',
                      lineHeight: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      transition:
                        'transform 0.13s ease, opacity 0.15s ease, background 0.15s ease',
                      transform: isClearing
                        ? 'scale(0.25)'
                        : isSel
                          ? 'scale(1.06)'
                          : 'scale(1)',
                      opacity: isClearing ? 0 : 1,
                    }}
                  >
                    <span aria-hidden>{def ? def.emoji : ''}</span>
                  </button>
                );
              })}

              {/* floating score pops */}
              {floaters.map((f) => (
                <div
                  key={f.id}
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: serif,
                    fontWeight: 600,
                    fontSize: 18,
                    color: '#1E8A4D',
                    background: 'rgba(255,255,255,0.92)',
                    padding: '4px 12px',
                    borderRadius: 999,
                    pointerEvents: 'none',
                    animation: 'mhFloat 0.9s ease-out forwards',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.text}
                </div>
              ))}

              {/* win / lose overlay */}
              {status !== 'playing' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(26,24,21,0.72)',
                    borderRadius: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cream,
                    textAlign: 'center',
                    padding: 24,
                  }}
                >
                  <div style={{ fontFamily: display, fontSize: 30, marginBottom: 8 }}>
                    {status === 'won' ? 'Level complete!' : 'Out of moves'}
                  </div>
                  {status === 'won' ? (
                    <>
                      <div style={{ fontSize: 32, letterSpacing: 4, marginBottom: 6 }}>
                        {'⭐'.repeat(starsAwarded)}
                        <span style={{ opacity: 0.3 }}>
                          {'⭐'.repeat(3 - starsAwarded)}
                        </span>
                      </div>
                      <p style={{ fontFamily: serif, fontSize: 14, opacity: 0.9, margin: '4px 0 18px' }}>
                        You banked {starsAwarded} star{starsAwarded > 1 ? 's' : ''} for
                        the makeover. Score {score}.
                      </p>
                      <button style={overlayBtn} onClick={() => startLevel(level + 1)}>
                        Next level →
                      </button>
                    </>
                  ) : (
                    <>
                      <p style={{ fontFamily: serif, fontSize: 14, opacity: 0.9, margin: '4px 0 18px' }}>
                        You reached {score} of {target}. Give the Broadway another go.
                      </p>
                      <button style={overlayBtn} onClick={() => startLevel(level)}>
                        Try again
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* footer controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 14,
                fontFamily: serif,
                fontSize: 12,
                color: inkLight,
              }}
            >
              <span>Best score: {best}</span>
              <button
                onClick={() => startLevel(level)}
                style={{
                  fontFamily: serif,
                  fontSize: 12,
                  color: inkMid,
                  background: 'transparent',
                  border: `0.5px solid ${border}`,
                  borderRadius: 4,
                  padding: '6px 12px',
                  cursor: 'pointer',
                }}
              >
                Restart level
              </button>
            </div>
          </section>

          {/* -------------------- Renovation column -------------------- */}
          <aside style={{ display: 'grid', gap: 18 }}>
            <div
              style={{
                background: panel,
                border: `0.5px solid ${border}`,
                borderRadius: 4,
                padding: 18,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 4,
                }}
              >
                <h2 style={{ fontFamily: display, fontSize: 20, margin: 0, color: ink }}>
                  The Makeover
                </h2>
                <span style={{ fontFamily: serif, fontSize: 13, color: inkMid }}>
                  ⭐ {stars} to spend
                </span>
              </div>
              <div style={{ fontFamily: serif, fontSize: 12, color: inkLight, marginBottom: 10 }}>
                {renoComplete} / {TOTAL_TASK_COUNT} jobs done · {renoPct}% restored
              </div>
              <div
                style={{
                  height: 8,
                  background: parchment,
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${renoPct}%`,
                    background: 'linear-gradient(90deg, #2E67B1, #2F8A7E)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              {renoPct === 100 && (
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: 13,
                    color: '#1E8A4D',
                    marginTop: 12,
                    marginBottom: 0,
                  }}
                >
                  🏡 The terrace is finished — kettle on, doors open onto the garden,
                  Ally Pally framed in the loft window. Welcome home to N10.
                </p>
              )}
            </div>

            {ROOMS.map((room) => {
              const roomTasks = room.tasks;
              const roomDone = roomTasks.filter((t) => doneSet.has(t.id)).length;
              const roomFinished = roomDone === roomTasks.length;
              return (
                <div
                  key={room.id}
                  style={{
                    background: panel,
                    border: `0.5px solid ${border}`,
                    borderRadius: 4,
                    padding: 18,
                    opacity: roomFinished ? 0.92 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }} aria-hidden>
                      {room.emoji}
                    </span>
                    <h3 style={{ fontFamily: display, fontSize: 17, margin: 0, color: ink }}>
                      {room.name}
                    </h3>
                    {roomFinished && (
                      <span style={{ marginLeft: 'auto', fontSize: 13, color: '#1E8A4D' }}>
                        Done ✓
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: serif, fontSize: 12.5, lineHeight: 1.55, color: inkMid, margin: '0 0 12px' }}>
                    {room.intro}
                  </p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                    {roomTasks.map((task) => {
                      const isDone = doneSet.has(task.id);
                      const affordable = stars >= task.cost;
                      return (
                        <li
                          key={task.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            fontFamily: serif,
                            fontSize: 13,
                          }}
                        >
                          <span
                            style={{
                              flex: 1,
                              color: isDone ? inkLight : ink,
                              textDecoration: isDone ? 'line-through' : 'none',
                            }}
                          >
                            {task.label}
                          </span>
                          {isDone ? (
                            <span style={{ fontSize: 14, color: '#1E8A4D' }} aria-label="completed">
                              ✓
                            </span>
                          ) : (
                            <button
                              onClick={() => completeTask(task)}
                              disabled={!affordable}
                              style={{
                                fontFamily: serif,
                                fontSize: 12,
                                whiteSpace: 'nowrap',
                                color: affordable ? cream : inkLight,
                                background: affordable ? ink : parchment,
                                border: `0.5px solid ${affordable ? ink : border}`,
                                borderRadius: 4,
                                padding: '6px 10px',
                                cursor: affordable ? 'pointer' : 'not-allowed',
                              }}
                            >
                              ⭐ {task.cost}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}

            <button
              onClick={resetProgress}
              style={{
                fontFamily: serif,
                fontSize: 12,
                color: inkLight,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 4,
                justifySelf: 'start',
              }}
            >
              Reset makeover progress
            </button>
          </aside>
        </div>

        {/* How to play */}
        <section
          style={{
            background: parchment,
            border: `0.5px solid ${border}`,
            borderRadius: 4,
            padding: '22px 24px',
            marginTop: 4,
          }}
        >
          <h2 style={{ fontFamily: display, fontSize: 19, margin: '0 0 10px', color: ink }}>
            How to play
          </h2>
          <ul
            style={{
              fontFamily: serif,
              fontSize: 14,
              lineHeight: 1.65,
              color: inkMid,
              margin: 0,
              paddingLeft: 18,
            }}
          >
            <li>Tap a tile then a neighbour — or drag — to swap them.</li>
            <li>Line up <strong>three or more</strong> of the same N10 icon to clear them and score.</li>
            <li>Chained drops stack a <strong>combo multiplier</strong> for bigger points.</li>
            <li>Hit the score target before the moves run out to bank ⭐ — up to three a level.</li>
            <li>Spend ⭐ on the right to restore the terrace, room by room.</li>
          </ul>
        </section>
      </main>

      <style>{`
        @keyframes mhFloat {
          0%   { opacity: 0; transform: translate(-50%, 6px) scale(0.9); }
          25%  { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -26px) scale(1.05); }
        }
        @media (max-width: 760px) {
          .mh-grid { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------ small bits ------------------------------ */

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        flex: '1 1 88px',
        background: parchment,
        borderRadius: 4,
        padding: '8px 12px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: serif,
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: inkLight,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: display,
          fontSize: 22,
          color: highlight ? '#C45D4E' : ink,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const overlayBtn: React.CSSProperties = {
  fontFamily: serif,
  fontSize: 14,
  color: ink,
  background: cream,
  border: 'none',
  borderRadius: 4,
  padding: '11px 22px',
  cursor: 'pointer',
};

async function fireConfetti() {
  try {
    const mod = await import('canvas-confetti');
    const confetti = mod.default;
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  } catch {
    /* confetti is a nice-to-have */
  }
}
