'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { T } from '@/components/operator/theme';

const SHOP_STORAGE_KEY = 'operator-eating-plan-shop-v1';

// ─── Local primitives ──────────────────────────────────────────────────────

function Kicker({ children, color, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return (
    <div style={{
      fontFamily: T.sans,
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: color ?? T.muted,
      ...style,
    }}>{children}</div>
  );
}

function Hairline({ style, weight = 0.5 }: { style?: CSSProperties; weight?: number }) {
  return <div style={{ borderTop: `${weight}px solid ${T.line}`, ...style }} />;
}

function SectionHead({ num, title, eyebrow }: { num: string; title: ReactNode; eyebrow?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {eyebrow ? <Kicker color={T.pink} style={{ marginBottom: 12 }}>{eyebrow}</Kicker> : null}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
        <span style={{
          fontFamily: T.display,
          fontStyle: 'normal',
          fontSize: 18,
          color: T.pink,
          letterSpacing: '-0.01em',
        }}>{num}</span>
        <h3 style={{
          fontFamily: T.display,
          fontWeight: 400,
          fontSize: 26,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          color: T.ink,
          margin: 0,
        }}>{title}</h3>
      </div>
    </div>
  );
}

function Lede({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p style={{
      fontFamily: T.sans,
      fontSize: 14,
      fontWeight: 300,
      color: T.body,
      lineHeight: 1.7,
      margin: '0 0 22px',
      maxWidth: '58ch',
      ...style,
    }}>{children}</p>
  );
}

// ─── Content (Lauren's standalone eating plan, sprinkled with pink emoji) ─

const TIMELINE: Array<{
  phase: string;
  title: string;
  body: string;
  startIso: string;
  endIso: string;
  tone: 'now' | 'next' | 'hold' | 'steady';
}> = [
  {
    phase: 'Week 1 · w/c 22 Jun',
    title: 'Breakfast + a walk',
    body: "One breakfast every morning (overnight oats). One daily walk. That's the entire job — nothing else changes yet.",
    startIso: '2026-06-22', endIso: '2026-06-28',
    tone: 'now',
  },
  {
    phase: 'Week 2 · w/c 29 Jun',
    title: 'Add cook-double dinners',
    body: 'Keep week 1 going. Add two easy dinners (assembly bowl + salmon traybake), cook double so lunch is just leftovers.',
    startIso: '2026-06-29', endIso: '2026-07-05',
    tone: 'next',
  },
  {
    phase: 'Week 3 · w/c 6 Jul',
    title: 'Add snacks + stock up',
    body: 'Keep both going. Add your two daily snacks, do one big shop, and batch-cook a chilli, a tikka and a bolognese for the freezer — your placement stash.',
    startIso: '2026-07-06', endIso: '2026-07-12',
    tone: 'next',
  },
  {
    phase: 'Placement · 13 Jul – 21 Aug',
    title: 'Hold steady',
    body: "Goal flips on purpose: maintain and stay fuelled, don't chase loss. Frozen batch defrosted the night before, eat on every break, protein each meal. Holding steady through this stretch is the win.",
    startIso: '2026-07-13', endIso: '2026-08-21',
    tone: 'hold',
  },
  {
    phase: 'From w/c 24 Aug',
    title: 'Steady, on repeat',
    body: "The long stretch. Same week every week: gym Wed/Sat/Sun, a daily-ish walk, the meal structure, one shop, one weigh-in. Repeat it unchanged — that's the whole engine.",
    startIso: '2026-08-24', endIso: '2099-12-31',
    tone: 'steady',
  },
];

const PORTIONS = [
  { emoji: '🌸', big: '1 palm',         small: 'protein' },
  { emoji: '🌷', big: '½ plate',        small: 'veg / salad' },
  { emoji: '🪻', big: '1 cupped hand', small: 'carbs' },
  { emoji: '💗', big: '1 thumb',        small: 'fats / oils' },
];

const BREAKFAST = [
  { name: 'Overnight oats',     body: 'Oats + Greek yogurt (or milk) + frozen berries + a spoon of peanut butter, in a jar the night before. Make 3–4 at once on Sunday and just grab one. Zero effort on the day.' },
  { name: 'Yogurt bowl',        body: 'High-protein Greek yogurt + granola + berries + a few nuts. No cooking, 30 seconds.' },
  { name: 'Batch eggs',         body: 'Boil 6 at the start of the week. Grab 2–3 with toast, or eat them as you go.' },
  { name: 'Blended smoothie',   body: 'Greek yogurt + banana + frozen berries + a spoon of peanut butter, blended. For flying-out-the-door mornings.' },
];

const SNACKS = [
  { name: 'Snack 1', body: 'High-protein Greek yogurt, or a couple of boiled eggs.' },
  { name: 'Snack 2', body: 'Edamame, or fruit + a small handful of nuts.' },
];

const MEALS = [
  { name: 'Stir-fry',           body: 'Chicken or turkey + frozen stir-fry veg + noodles or rice + soy or sweet chilli.' },
  { name: 'Chilli con carne',   body: 'Lean mince + kidney beans + tinned tomatoes + spices, over rice. Huge batch, freezes, costs almost nothing.' },
  { name: 'Turkey bolognese',   body: 'Turkey mince + tomato sauce with veg blended in, over pasta with a side salad.' },
  { name: 'Loaded jacket potato', body: 'Baked spud + tuna or chicken + cheese + beans + a bit of salad.' },
  { name: 'Fajita bowl',        body: 'Chicken + peppers and onions + rice + salsa, with a wrap on the side if you want.' },
  { name: 'Salmon traybake',    body: 'Salmon + baby potatoes + greens, all on one tray. One wash-up.' },
  { name: 'Egg fried rice',     body: 'Leftover rice + eggs + chicken or prawns + frozen peas and veg. Great for using bits up.' },
  { name: 'Assembly bowl',      body: 'Chicken + microwave rice pouch + bagged salad. Zero cooking skill, for tired days.' },
];

const WEEK = [
  { dow: 'Mon', breakfast: 'Overnight oats', lunch: 'Leftover bolognese',  dinner: 'Chilli con carne' },
  { dow: 'Tue', breakfast: 'Yogurt bowl',    lunch: 'Leftover chilli',     dinner: 'Tikka masala' },
  { dow: 'Wed', breakfast: 'Eggs + toast',   lunch: 'Leftover tikka',      dinner: 'Stir-fry' },
  { dow: 'Thu', breakfast: 'Overnight oats', lunch: 'Leftover stir-fry',   dinner: 'Peri chicken + rice' },
  { dow: 'Fri', breakfast: 'Smoothie',       lunch: 'Leftover peri chicken', dinner: 'Burger + wedges' },
  { dow: 'Sat', breakfast: 'Yogurt bowl',    lunch: 'Jacket potato + tuna', dinner: 'Salmon traybake' },
  { dow: 'Sun', breakfast: 'Eggs + toast',   lunch: 'Leftover salmon',     dinner: 'Turkey bolognese' },
];

const RECIPES: Array<{
  emoji: string;
  name: string;
  serves: number;
  ingredients: string;
  method: string;
  budget: string;
  variant?: string;
}> = [
  {
    emoji: '🌶',
    name: 'Peri-Peri Chicken',
    serves: 3,
    ingredients: '600g chicken thighs · 1 red pepper · 2 red chillies · 4 garlic cloves · 1 tsp smoked paprika · 1 tsp dried oregano · 3 tbsp red wine vinegar · 2 tbsp olive oil · juice of 1 lemon · 1 tsp salt',
    method: 'Char the pepper and peel it. Blend with the chillies, garlic, paprika, oregano, vinegar, oil, lemon and salt until smooth. Keep a third back for serving. Marinate the chicken in the rest (30 min+), then griddle or roast 6–7 min a side until cooked through. Drizzle the reserved sauce over.',
    budget: 'Thighs over breast, a jarred roasted pepper instead of fresh, serve with rice + frozen veg.',
  },
  {
    emoji: '🍔',
    name: 'The Burger',
    serves: 2,
    ingredients: '250g lean mince (beef, turkey or chicken) · ½ onion, grated · 1 garlic clove, grated · 1 tsp Worcestershire sauce · ½ tsp smoked paprika · salt & pepper · 2 buns · lettuce, tomato, red onion, gherkins',
    method: 'Mix the mince with the grated onion, garlic, Worcestershire, paprika, salt and pepper — just until combined. Shape 2 patties a little wider than the bun and dimple the centres. Cook 3–4 min a side on a hot pan. Toast the buns and build with salad and sauce. Melt a cheese slice over the patty if you fancy.',
    budget: 'Value mince, own-brand buns, frozen oven chips on the side.',
  },
  {
    emoji: '🍛',
    name: 'Chicken Tikka Masala',
    serves: 3,
    ingredients: '600g chicken thighs · 100g natural yogurt · juice of ½ lemon · 40g butter · 1 onion · 4 garlic cloves · thumb of ginger · 2 tbsp tomato puree · 1 tbsp each cumin, coriander & garam masala · 1 tsp each paprika & turmeric · ½ tsp chilli · 400g tinned tomatoes · 150ml double cream · salt · fresh coriander',
    method: 'Marinate the chicken in yogurt, lemon and half the garlic & ginger (30 min+). Melt the butter, soften the onion till golden, add the rest of the garlic & ginger. Stir in the puree and all the spices for a minute. Add the chicken + marinade, brown 4 min. Add tinned tomatoes + salt, simmer covered 20 min. Stir in the cream, warm gently, finish with coriander.',
    budget: 'Thighs not breast, a tin of chickpeas stretches it further, spices from the world-food aisle, yogurt in place of cream.',
    variant: 'Swap the cream for coconut milk and use oil instead of butter.',
  },
];

const GYM_SPLIT: Array<{ day: string; focus: string; exercises: string[] }> = [
  {
    day: 'Wed', focus: 'Full body',
    exercises: [
      'Goblet squat or leg press',
      'Chest press (machine or dumbbell)',
      'Lat pulldown',
      'Dumbbell Romanian deadlift',
      'Seated shoulder press',
      'Plank — hold, 3 rounds',
    ],
  },
  {
    day: 'Sat', focus: 'Legs',
    exercises: [
      'Leg press or goblet squat',
      'Romanian deadlift',
      'Hip thrust',
      'Walking lunges or split squats',
      'Leg curl',
      'Calf raise',
    ],
  },
  {
    day: 'Sun', focus: 'Upper body',
    exercises: [
      'Chest press (machine or dumbbell)',
      'Lat pulldown or assisted pull-up',
      'Seated row',
      'Shoulder press',
      'Bicep curl',
      'Tricep pushdown',
    ],
  },
];

const BUDGET = [
  { name: 'Cheaper cuts',           body: 'Chicken thighs over breast (about half the price, juicier anyway), value mince for burgers and chilli.' },
  { name: 'Bulk it out',            body: 'A tin of chickpeas or beans stretches the same meat across more meals — cost-per-meal drops fast.' },
  { name: 'Go frozen',              body: 'Chicken, veg, spinach, chopped onion — cheaper, zero waste, lasts forever.' },
  { name: 'World-food spice aisle', body: 'A big bag for the price of one tiny jar. The biggest curry saving there is.' },
  { name: 'Own-brand everything',   body: "Tinned tomatoes, yogurt, buns, oats, rice — the flavour's in your spices, not the label." },
];

const SHOPPING_GROUPS: Array<{ group: string; items: string[] }> = [
  { group: 'Protein', items: [
    'Chicken thighs (cheaper than breast)', 'Lean mince', 'Eggs', 'Turkey rashers',
    'Salmon / white fish', 'Tofu', 'Tinned tuna', 'Greek yogurt (big tub)',
  ]},
  { group: 'Veg', items: [
    'Bagged salad', 'Frozen stir-fry veg', 'Frozen mixed veg',
    'Onions & peppers', 'Any fresh veg you like',
  ]},
  { group: 'Carbs', items: [
    'Oats', 'Rice (big bag)', 'Pasta & noodles', 'Burger buns / wraps', 'Baby / jacket potatoes',
  ]},
  { group: 'Curry cupboard', items: [
    'Tinned tomatoes', 'Tomato puree', 'Coconut milk or cream', 'Natural yogurt',
    'Chickpeas / kidney beans', 'Garam masala, cumin, coriander', 'Paprika, turmeric, chilli', 'Garlic & ginger',
  ]},
  { group: 'Extras', items: [
    'High-protein yogurt', 'Granola', 'Edamame', 'Frozen berries',
    'Peanut butter', 'Nuts + fruit + bananas', 'Sauces (soy, peri, Worcestershire)',
  ]},
];

const ROUGH_DAYS = [
  { strong: 'An off day changes nothing.',  body: "One meal, one day — it's the run of weeks that counts, never a single plate. Don't “make up for it” by skipping the next meal; just carry on as normal." },
  { strong: 'Low spoons?',                  body: "Lean on the easiest stuff — yogurt bowl, a smoothie, the assembly bowl, the forgot-to-eat backups. Eating something easy always beats eating nothing." },
  { strong: 'Placement weeks:',             body: "Prep the night before. A tub of last night's dinner, a yogurt, fruit and nuts in your bag. Eat on your breaks even if you're not hungry — long shifts plus skipping meals is a guaranteed energy crash. Your freezer batches are the hero here." },
  { strong: 'Be kind to yourself.',         body: 'This is meant to make life easier, not add pressure. Consistent and gentle beats perfect every time.' },
];

const WINS = [
  'clothes feeling looser',
  'stairs feeling easier',
  'stronger in the gym',
  'a good run of consistent days',
  'more energy on shift',
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function todayParts(iso?: string) {
  const d = iso ? new Date(iso + 'T00:00:00') : new Date();
  const jsDow = d.getDay();
  const mondayIndex = (jsDow + 6) % 7;
  const today = d.toISOString().slice(0, 10);
  return { mondayIndex, today, weekday: d.toLocaleDateString('en-GB', { weekday: 'long' }) };
}

function inRange(iso: string, startIso: string, endIso: string) {
  return iso >= startIso && iso <= endIso;
}

// ─── Component ─────────────────────────────────────────────────────────────

type Props = {
  proteinTargetG?: number;
  intakeKcal?: number;
  todayIso?: string;
};

export default function EatingPlan({ proteinTargetG, intakeKcal, todayIso }: Props) {
  const { mondayIndex, today, weekday } = useMemo(() => todayParts(todayIso), [todayIso]);
  const todayMeal = WEEK[mondayIndex];

  const activePhaseIdx = useMemo(() => {
    for (let i = 0; i < TIMELINE.length; i++) {
      if (inRange(today, TIMELINE[i].startIso, TIMELINE[i].endIso)) return i;
    }
    return -1;
  }, [today]);

  // Shopping list persistence
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const skipFirstWriteRef = useRef(true);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(SHOP_STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    if (skipFirstWriteRef.current) { skipFirstWriteRef.current = false; return; }
    if (typeof window === 'undefined') return;
    try { window.localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(checked)); } catch {}
  }, [checked]);

  const toggleItem = (key: string) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  const clearChecked = () => setChecked({});
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const totalItems = SHOPPING_GROUPS.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <section
      aria-label="Your full eating plan"
      style={{
        marginTop: 56,
        background: T.paper,
        border: `0.5px solid ${T.line}`,
        padding: 'clamp(28px, 4vw, 56px)',
      }}
    >
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 56 }}>
        <div style={{
          fontFamily: T.display, fontSize: 28, color: T.pink,
          lineHeight: 1, marginBottom: 18, letterSpacing: '0.04em',
        }} aria-hidden>💗</div>
        <Kicker style={{ marginBottom: 18 }}>Your full plan · made gentle</Kicker>
        <h2 style={{
          fontFamily: T.display,
          fontWeight: 400,
          fontSize: 'clamp(36px, 5vw, 56px)',
          lineHeight: 1.02,
          letterSpacing: '-0.025em',
          color: T.ink,
          margin: '0 0 18px',
          maxWidth: '18ch',
        }}>
          One small step,<br/>
          <em style={{ color: T.pinkDeeper }}>repeated.</em>
        </h2>
        <p style={{
          fontFamily: T.sans,
          fontSize: 16,
          fontWeight: 300,
          color: T.body,
          lineHeight: 1.7,
          margin: 0,
          maxWidth: '54ch',
        }}>
          Everything in one place — built so you barely have to think, and so the big goal never has to feel big. 🌷
        </p>
      </div>

      {/* ── Mindset · stones ─────────────────────────────────────────── */}
      <div style={{
        background: T.surface,
        border: `0.5px solid ${T.line}`,
        padding: 'clamp(24px, 3vw, 36px)',
        marginBottom: 56,
      }}>
        <Kicker color={T.lavenderDeeper} style={{ marginBottom: 12 }}>Read this first 💜</Kicker>
        <h3 style={{
          fontFamily: T.display,
          fontWeight: 400,
          fontSize: 26,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          color: T.ink,
          margin: '0 0 14px',
        }}>You&rsquo;re <em style={{ color: T.pink }}>not</em> losing it all at once.</h3>
        <p style={{
          fontFamily: T.sans,
          fontSize: 14,
          fontWeight: 300,
          color: T.body,
          lineHeight: 1.75,
          margin: '0 0 26px',
          maxWidth: '58ch',
        }}>
          You&rsquo;re losing <b style={{ color: T.ink, fontWeight: 500 }}>one small block</b>, then the next, then the next.
          You never carry the whole thing — you only ever work on the step right in front of you,
          at a gentle pace you&rsquo;ll hardly feel. Slow is the point. Slow is what lasts.
        </p>

        {/* Stones */}
        <div style={{ position: 'relative', margin: '14px 0 22px' }}>
          <div style={{
            position: 'absolute', top: 14, left: 0, right: 0,
            borderTop: `0.5px dashed ${T.line}`, zIndex: 0,
          }} aria-hidden />
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6,
            justifyItems: 'center',
          }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const isNow = i === 0;
              const isGoal = i === 6;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 14, height: 14,
                    background: isNow ? T.pink : isGoal ? T.lavender : T.paper,
                    border: `0.5px solid ${isNow ? T.pink : isGoal ? T.lavender : T.line}`,
                    transform: 'rotate(45deg)',
                  }} />
                  <small style={{
                    fontFamily: T.sans, fontSize: 9, fontWeight: 500,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: isNow ? T.pink : isGoal ? T.lavenderDeeper : T.muted,
                    textAlign: 'center', minHeight: 22,
                  }}>{isNow ? 'you are here' : isGoal ? 'goal' : ''}</small>
                </div>
              );
            })}
          </div>
        </div>

        <p style={{
          fontFamily: T.sans,
          fontSize: 13,
          fontWeight: 300,
          color: T.body,
          lineHeight: 1.7,
          margin: '0 0 18px',
          maxWidth: '58ch',
          fontStyle: 'normal',
        }}>
          The only job on any given day is the daily structure — eat enough, get your protein, move a bit.
          Don&rsquo;t watch the scale day to day; watch the wins below. 🌸
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {WINS.map((w) => (
            <span key={w} style={{
              fontFamily: T.sans, fontSize: 11, fontWeight: 400,
              color: T.ink, background: T.paper,
              border: `0.5px solid ${T.line}`,
              padding: '6px 12px',
            }}>{w}</span>
          ))}
        </div>
      </div>

      {/* ── 01 · Portions ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHead num="01" title="Portions, by eye" />
        <Lede>No scales, no maths. Just your hand. 🌷</Lede>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          border: `0.5px solid ${T.line}`,
          background: T.surface,
        }}>
          {PORTIONS.map((p, i) => (
            <div key={p.big} style={{
              padding: '24px 22px',
              borderRight: i < PORTIONS.length - 1 ? `0.5px solid ${T.line}` : 'none',
              borderBottom: i < 2 ? `0.5px solid ${T.line}` : 'none',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span style={{ fontSize: 28, lineHeight: 1 }} aria-hidden>{p.emoji}</span>
              <div>
                <div style={{ fontFamily: T.display, fontSize: 20, color: T.ink, lineHeight: 1.1 }}>{p.big}</div>
                <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>{p.small}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 300, color: T.muted, lineHeight: 1.6, marginTop: 12, fontStyle: 'normal' }}>
          Follow the picture, not a number. Tracking is there if you ever want to check in — a tool, never a chore.
          {proteinTargetG && intakeKcal ? (
            <> Today&rsquo;s sketch: around <b style={{ color: T.ink, fontWeight: 500, fontStyle: 'normal' }}>{intakeKcal.toLocaleString()} kcal</b> with <b style={{ color: T.pink, fontWeight: 500, fontStyle: 'normal' }}>{proteinTargetG}g protein</b>.</>
          ) : null}
        </p>
      </div>

      {/* ── 02 · Timeline ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHead num="02" title="Start to goal, by week" eyebrow="The whole journey · mapped 🌸" />
        <Lede>
          Built around your real calendar. The dates and actions are the part you control — those are exact.
          The scale moves on its own schedule, so judge progress by the milestones, not a weekly number.
        </Lede>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', border: `0.5px solid ${T.line}` }}>
          {TIMELINE.map((node, i) => {
            const isNow = i === activePhaseIdx;
            const accent = node.tone === 'hold' ? T.lavender : node.tone === 'steady' ? T.green : T.pink;
            return (
              <div key={node.phase} style={{
                position: 'relative',
                padding: '22px 20px 24px',
                background: isNow ? T.pinkSoft : T.paper,
                borderRight: i < TIMELINE.length - 1 ? `0.5px solid ${T.line}` : 'none',
              }}>
                {isNow ? (
                  <span style={{
                    position: 'absolute', top: 10, right: 12,
                    fontFamily: T.sans, fontSize: 9, fontWeight: 600, letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: T.pinkDeeper,
                  }}>💗 You are here</span>
                ) : null}
                <Kicker color={accent} style={{ marginBottom: 8 }}>{node.phase}</Kicker>
                <div style={{
                  fontFamily: T.display, fontStyle: 'normal', fontSize: 19, color: T.ink,
                  margin: '0 0 10px', lineHeight: 1.25,
                }}>{node.title}</div>
                <p style={{ fontFamily: T.sans, fontSize: 12.5, fontWeight: 300, color: T.body, lineHeight: 1.6, margin: 0 }}>
                  {node.body}
                </p>
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: 22,
          padding: '18px 22px',
          background: T.lavenderSoft,
          borderLeft: `2px solid ${T.lavender}`,
        }}>
          <p style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 300, color: T.body, lineHeight: 1.7, margin: 0 }}>
            <b style={{ color: T.ink, fontWeight: 500 }}>The scale won&rsquo;t move in a straight line — that&rsquo;s normal, not failure.</b>{' '}
            Some weeks drop, some hold, some bounce up with water, your cycle or a heavy gym week.
            Nail the dates and actions above; the rest follows on its own time. 💜
          </p>
        </div>
      </div>

      {/* ── 03 · This week's loop ────────────────────────────────────── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHead num="03" title="How your week runs" eyebrow="No weekly deciding 🌷" />
        <Lede>A worked example so you never plan from scratch. Lunch is just last night&rsquo;s dinner — the loop sorts itself.</Lede>

        {/* Tonight's hero */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 0,
          marginBottom: 16,
          border: `0.5px solid ${T.line}`,
          background: T.pinkSoft,
        }}>
          <div style={{ padding: '20px 22px', borderRight: `0.5px solid ${T.line}` }}>
            <Kicker color={T.pinkDeeper} style={{ marginBottom: 6 }}>Tonight · {weekday} 💗</Kicker>
            <div style={{ fontFamily: T.display, fontStyle: 'normal', fontSize: 24, color: T.ink, lineHeight: 1.15 }}>
              {todayMeal.dinner}
            </div>
          </div>
          <div style={{ padding: '20px 22px', borderRight: `0.5px solid ${T.line}` }}>
            <Kicker style={{ marginBottom: 6 }}>For lunch tomorrow</Kicker>
            <div style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 400, color: T.ink }}>Leftovers from tonight</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 300, color: T.muted, marginTop: 4 }}>Cook double — that&rsquo;s the whole trick.</div>
          </div>
          <div style={{ padding: '20px 22px' }}>
            <Kicker style={{ marginBottom: 6 }}>Breakfast on autopilot</Kicker>
            <div style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 400, color: T.ink }}>{todayMeal.breakfast}</div>
          </div>
        </div>

        {/* Full table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', minWidth: 640, borderCollapse: 'collapse',
            background: T.paper, border: `0.5px solid ${T.line}`,
          }}>
            <thead>
              <tr style={{ background: T.surface }}>
                <th style={thStyle}>Day</th>
                <th style={thStyle}>Breakfast</th>
                <th style={thStyle}>Lunch</th>
                <th style={thStyle}>Dinner (cook double)</th>
              </tr>
            </thead>
            <tbody>
              {WEEK.map((d, i) => {
                const isToday = i === mondayIndex;
                return (
                  <tr key={d.dow} style={{
                    background: isToday ? T.pinkSoft : 'transparent',
                    borderTop: `0.5px solid ${T.softLine}`,
                  }}>
                    <td style={{ ...tdStyle, fontFamily: T.display, fontStyle: 'normal', fontSize: 16, color: isToday ? T.pinkDeeper : T.ink }}>
                      {d.dow}
                      {isToday ? <span style={{ fontFamily: T.sans, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.pinkDeeper, marginLeft: 8 }}>today 💗</span> : null}
                    </td>
                    <td style={tdStyle}>{d.breakfast}</td>
                    <td style={tdStyle}>{d.lunch}</td>
                    <td style={{ ...tdStyle, fontWeight: 400, color: T.ink }}>{d.dinner}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 300, color: T.muted, lineHeight: 1.6, marginTop: 14, fontStyle: 'normal' }}>
          Sunday&rsquo;s bolognese rolls into Monday&rsquo;s lunch and the loop starts again. Swap any meal for another from the list — the shape stays the same.
        </p>
      </div>

      {/* ── 04 · Breakfasts ──────────────────────────────────────────── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHead num="04" title="Breakfast" eyebrow="Fixed · easy · grab-and-go" />
        <Lede>Pick one or two and rotate. Least effort first.</Lede>
        <CardGrid items={BREAKFAST} />
      </div>

      {/* ── 05 · Snacks ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHead num="05" title="Snacks" eyebrow="Fixed · grab-and-go" />
        <Lede>Same two, daily. Slot them wherever hunger lands.</Lede>
        <CardGrid items={SNACKS} />
      </div>

      {/* ── 06 · Full meals ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHead num="06" title="Full meals" eyebrow="Cook double · lunch sorts itself" />
        <Lede>
          Each one&rsquo;s a complete plate — protein, veg and carbs.
          On a low-energy day, the assembly bowl, jacket potato and traybake are the no-brainers.
          Cook double and tomorrow&rsquo;s lunch is done.
        </Lede>
        <CardGrid items={MEALS} />
      </div>

      {/* ── 07 · Takeaway swaps ─────────────────────────────────────── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHead num="07" title="The takeaway swaps" eyebrow="Your favourites · made at home 💗" />
        <Lede>The foods you love, cooked so they fit — and cheaper than ordering in. All three batch-cook and freeze.</Lede>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {RECIPES.map((r) => (
            <details key={r.name} style={{
              border: `0.5px solid ${T.line}`,
              background: T.paper,
              padding: '0 22px',
            }}>
              <summary style={{ cursor: 'pointer', padding: '18px 0', listStyle: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <span style={{ fontSize: 18 }} aria-hidden>{r.emoji}</span>
                    <span style={{ fontFamily: T.display, fontSize: 21, color: T.ink, letterSpacing: '-0.01em' }}>{r.name}</span>
                  </div>
                  <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted }}>
                    serves {r.serves} · tap for recipe
                  </span>
                </div>
              </summary>
              <div style={{ paddingBottom: 22 }}>
                <Hairline style={{ marginBottom: 16 }} />
                <RecipeRow label="You need" body={r.ingredients} />
                <RecipeRow label="Method"   body={r.method} />
                {r.variant ? <RecipeRow label="Lighter / DF" body={r.variant} /> : null}
                <RecipeRow label="Cheaper"  body={r.budget} tone="pink" />
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* ── 08 · The split ──────────────────────────────────────────── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHead num="08" title="The split" eyebrow="Keep your strength · Wed · Sat · Sun 💪" />
        <Lede>
          Three days, three lists. Walk in, work down the list, leave. 3 sets, 8–12 reps, rest whenever you need.
          When the top of the range feels easy, nudge the weight up one notch — that&rsquo;s the whole progression system.
        </Lede>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          border: `0.5px solid ${T.line}`,
          background: T.paper,
        }}>
          {GYM_SPLIT.map((d, i) => (
            <div key={d.day} style={{
              padding: '22px 22px 24px',
              borderRight: i < GYM_SPLIT.length - 1 ? `0.5px solid ${T.line}` : 'none',
            }}>
              <Kicker color={T.pink} style={{ marginBottom: 8 }}>{d.day}</Kicker>
              <div style={{
                fontFamily: T.display, fontStyle: 'normal', fontSize: 20, color: T.ink,
                margin: '0 0 16px', letterSpacing: '-0.01em',
              }}>{d.focus}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
                {d.exercises.map((ex, j) => (
                  <li key={j} style={{
                    fontFamily: T.sans, fontSize: 13, fontWeight: 300, color: T.body,
                    lineHeight: 1.5, padding: '8px 0',
                    borderTop: `0.5px solid ${T.softLine}`,
                  }}>{ex}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 22,
          padding: '18px 22px',
          background: T.lavenderSoft,
          borderLeft: `2px solid ${T.lavender}`,
        }}>
          <p style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 300, color: T.body, lineHeight: 1.7, margin: 0 }}>
            <b style={{ color: T.ink, fontWeight: 500 }}>Low-energy day? Do the first three exercises and go home.</b>{' '}
            A short session still counts. &ldquo;I can&rsquo;t do the whole thing so I&rsquo;ll skip it&rdquo; is what breaks streaks —
            showing up small beats not showing up. 💜
          </p>
        </div>
      </div>

      {/* ── 09 · Rough days & placement ─────────────────────────────── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHead num="09" title="The rough days & placement" eyebrow="For real life 🌷" />
        <Lede>No plan survives a 12-hour shift untouched. Here&rsquo;s how it bends instead of breaks.</Lede>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {ROUGH_DAYS.map((row) => (
            <li key={row.strong} style={{
              padding: '18px 0',
              borderTop: `0.5px solid ${T.softLine}`,
            }}>
              <p style={{ fontFamily: T.sans, fontSize: 13.5, fontWeight: 300, color: T.body, lineHeight: 1.7, margin: 0 }}>
                <b style={{ color: T.ink, fontWeight: 500 }}>{row.strong}</b>{' '}{row.body}
              </p>
            </li>
          ))}
        </ul>
        <div style={{
          marginTop: 22,
          padding: '18px 22px',
          background: T.pinkSoft,
          borderLeft: `2px solid ${T.pink}`,
        }}>
          <p style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 300, color: T.body, lineHeight: 1.7, margin: 0 }}>
            <b style={{ color: T.ink, fontWeight: 500 }}>If a food feels wrong — texture, taste, just nope — swap it for a safe food in the same slot.</b>{' '}
            The structure holds even when the foods change. Protein-first is the only rule that never moves. Never force anything your body&rsquo;s saying no to. 💗
          </p>
        </div>
      </div>

      {/* ── 10 · Budget levers ──────────────────────────────────────── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHead num="10" title="Five budget levers" eyebrow="Eat it cheap" />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {BUDGET.map((row) => (
            <li key={row.name} style={{
              display: 'grid', gridTemplateColumns: '180px 1fr',
              padding: '16px 0',
              borderBottom: `0.5px solid ${T.softLine}`,
              gap: 14, alignItems: 'baseline',
            }}>
              <span style={{ fontFamily: T.display, fontStyle: 'normal', fontSize: 16, color: T.pink }}>{row.name}</span>
              <span style={{ fontFamily: T.sans, fontSize: 13.5, fontWeight: 300, color: T.body, lineHeight: 1.7 }}>{row.body}</span>
            </li>
          ))}
        </ul>
        <p style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 300, color: T.muted, lineHeight: 1.6, marginTop: 14, fontStyle: 'normal' }}>
          And batch-cook-and-freeze — which you&rsquo;re already doing — is the cheapest way to eat there is. Beats a takeaway every time.
        </p>
      </div>

      {/* ── 11 · Shopping ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
          <SectionHead num="11" title="Shopping" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.pinkDeeper }}>
              {checkedCount} / {totalItems} ticked
            </span>
            <button
              type="button"
              onClick={clearChecked}
              disabled={checkedCount === 0}
              style={{
                background: 'transparent',
                border: `0.5px solid ${T.line}`,
                color: checkedCount === 0 ? T.muted : T.ink,
                fontFamily: T.sans, fontSize: 10, fontWeight: 500,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '8px 14px',
                cursor: checkedCount === 0 ? 'default' : 'pointer',
              }}
            >Reset list</button>
          </div>
        </div>
        <Lede>Same staples weekly, cheap version noted where it counts — so the shop runs on autopilot. Tap to tick off; the list remembers itself. 💗</Lede>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', border: `0.5px solid ${T.line}` }}>
          {SHOPPING_GROUPS.map((group, gi) => (
            <div key={group.group} style={{
              padding: '20px 22px',
              borderRight: gi < SHOPPING_GROUPS.length - 1 ? `0.5px solid ${T.line}` : 'none',
              borderBottom: `0.5px solid ${T.softLine}`,
            }}>
              <h4 style={{
                fontFamily: T.display, fontStyle: 'normal',
                fontSize: 18, color: T.ink, margin: '0 0 14px',
                letterSpacing: '-0.01em',
              }}>{group.group}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.items.map((item) => {
                  const key = `${group.group}::${item}`;
                  const isChecked = !!checked[key];
                  return (
                    <li key={key}>
                      <label style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        cursor: 'pointer',
                        fontFamily: T.sans, fontSize: 13, fontWeight: 300,
                        color: isChecked ? T.muted : T.body,
                        textDecoration: isChecked ? 'line-through' : 'none',
                        lineHeight: 1.5,
                      }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(key)}
                          style={{
                            marginTop: 3, width: 14, height: 14,
                            accentColor: 'var(--pink)',
                            flexShrink: 0,
                          }}
                        />
                        <span>{item}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div style={{ marginTop: 56, textAlign: 'center' }}>
        <div style={{ fontFamily: T.display, fontSize: 22, color: T.pink, marginBottom: 10 }} aria-hidden>💗</div>
        <p style={{ fontFamily: T.display, fontStyle: 'normal', fontSize: 17, color: T.muted, margin: 0 }}>
          One small step, repeated.
        </p>
      </div>
    </section>
  );
}

// ─── Subcomponents ─────────────────────────────────────────────────────────

function CardGrid({ items }: { items: Array<{ name: string; body: string }> }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      border: `0.5px solid ${T.line}`,
    }}>
      {items.map((item, i) => (
        <div key={item.name} style={{
          padding: '20px 22px',
          borderRight: (i + 1) % 2 === 1 ? `0.5px solid ${T.line}` : 'none',
          borderBottom: `0.5px solid ${T.softLine}`,
          background: T.paper,
        }}>
          <div style={{
            fontFamily: T.display, fontSize: 18, color: T.ink,
            margin: '0 0 8px', letterSpacing: '-0.005em',
          }}>{item.name}</div>
          <p style={{
            fontFamily: T.sans, fontSize: 13, fontWeight: 300,
            color: T.body, lineHeight: 1.65, margin: 0,
          }}>{item.body}</p>
        </div>
      ))}
    </div>
  );
}

function RecipeRow({ label, body, tone }: { label: string; body: string; tone?: 'pink' }) {
  return (
    <p style={{
      fontFamily: T.sans, fontSize: 13, fontWeight: 300,
      color: T.body, lineHeight: 1.7,
      margin: '0 0 12px',
    }}>
      <span style={{
        display: 'inline-block', marginRight: 10,
        fontFamily: T.sans, fontSize: 9, fontWeight: 600,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: tone === 'pink' ? T.pink : T.muted,
        verticalAlign: 'baseline',
      }}>{label}</span>
      {body}
    </p>
  );
}

// ─── Inline cell styles ───────────────────────────────────────────────────

const thStyle: CSSProperties = {
  fontFamily: T.sans,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: T.muted,
  textAlign: 'left',
  padding: '12px 16px',
};

const tdStyle: CSSProperties = {
  fontFamily: T.sans,
  fontSize: 13,
  fontWeight: 300,
  color: T.body,
  padding: '14px 16px',
  verticalAlign: 'baseline',
};
