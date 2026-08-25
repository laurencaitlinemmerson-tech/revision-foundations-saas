# Training dashboard — design system

The operator's Training dashboard at `/operator`. Warm-editorial structure — cream
ground, hairline rules, serif display type — with plum and rose carrying the data.

Scoped entirely to `.training-shell`, so none of it leaks into the marketing site
or the older Daily log at `/operator/daily-log`, which runs its own tokens.

---

## Principles

**An absent number and a bad number must never look the same.** A dimension with
nothing behind it scores `null`, renders as an em dash, and is left *out* of the
overall mean rather than counted as zero. Copy says which source is empty.

**Say what a number is being compared against.** Not "vs previous period" but
"vs the same 25 days of July". The comparison belongs on the page, not in the
reader's head.

**Colour carries data, type carries text.** Plum and rose are for marks — lines,
bars, fills, active chrome. Body text stays near-black. Nothing pays for colour
in legibility.

**Green, amber and rose are semantic.** They mean good, attention, and falling.
Never decorative.

**Charts must not lie about time.** Irregular readings are positioned by date,
never by index. See `logic.ts` → `bodyChart`.

---

## Colour

All values live in `palette.ts`. Never hard-code a hex in a component.

### Ground
| Token | Value | Use |
|---|---|---|
| `PAPER` | `#FBF8FA` | Page background |
| `SIDEBAR` | `#F5F1F5` | Nav column |
| `CARD` | `#FFFFFF` | Bordered panels |
| `TINT` | `#FBF4F7` | Soft panel fill — radar, selected row, verdict |
| `LILAC_HAZE` | `#F4EFF6` | Active nav row |

### Type
| Token | Value | Use |
|---|---|---|
| `INK` | `#221C24` | Headings, figures, primary text |
| `SOFT` | `#57515A` | Body copy, table cells |
| `MUTED` | `#9C8894` | Eyebrows, captions, axis labels |

### Data marks
| Token | Value | Use |
|---|---|---|
| `PLUM` | `#5F4472` | Primary series, active chrome, hero figure |
| `PLUM_SOFT` | `#8E6FA3` | Secondary bar state |
| `PLUM_FILL` | `rgba(95,68,114,0.08)` | Radar fill |
| `PLUM_FILL_FAINT` | `rgba(95,68,114,0.05)` | Area under a line |
| `PINK` | `#C06C84` | Second person, PR marks, sleep line |
| `PINK_DEEP` | `#8A4459` | Badge text on tint |
| `PINK_SOFT` | `#F2DCE4` | Off-target bars |
| `PINK_LINE` | `#D9AFC0` | Previous-period dashed series |

### Furniture
| Token | Value |
|---|---|
| `TRACK` | `#F1EBF0` — bar track |
| `TRACK_PREV` | `#E6DCE8` — previous value behind a bar |
| `SPARK` | `#C3AECC` — sparkline stroke |
| `RULE` | `0.5px solid rgba(34,28,36,0.10)` |
| `RULE_SOFT` | `0.5px solid rgba(34,28,36,0.07)` |

### Semantic
`GREEN #1E8A4D` · `AMBER #C8700A` · `ROSE #A14A57`

### Heatmap ramp
`HEAT` — palest to darkest: `#F7F3F6` → `#EEDFE9` → `#DFBFD3` → `#A87CA8` → `PLUM`

Levels: nothing logged · steps only · light day · session logged · session and cardio.

---

## Type

Two families, both already loaded globally in `globals.css`.

- `var(--font-display)` — **Playfair Display**. Every numeral, every heading.
- `var(--font-body)` — **Inter**, weight 300. All prose, labels, table cells.

### Scale

| Role | Size | Family | Notes |
|---|---|---|---|
| Hero figure | 76 | display | `line-height: 0.9`, plum |
| Page title | 38 | display | |
| Section heading | 24 | display | |
| Card heading | 22–28 | display | |
| Large figure | 40–52 | display | Top cards, verdict |
| Medium figure | 17–22 | display | Table cells, row values |
| Body | 14–15 | body | `line-height: 1.65–1.75` |
| Small | 12–13 | body | Captions, notes |
| Eyebrow | 10 | body | `letter-spacing: 0.2em`, uppercase, muted |

Display type carries `letter-spacing: -0.015em`. Eyebrows are the only uppercase
element; never uppercase body copy.

---

## Spacing

A named scale at the top of `TrainingView.tsx`. Change a value there and the
rhythm moves everywhere — that is the point.

```
PAGE_X      64    main gutter
PAGE_TOP    56
SECTION_GAP 56    between major sections
CARD_PAD    32    inside a bordered card
PANEL_PAD   40    inside a large split panel
GRID_GAP    28    between side-by-side cards
ROW_Y       16    a list row's vertical padding
CELL_Y      18    a table cell's vertical padding
```

Heatmap grid: `HEAT_CELL 16` · `HEAT_GAP 5` · `HEAT_WEEKS 12`. The month strip is
pinned to `HEAT_WEEKS * (HEAT_CELL + HEAT_GAP) - HEAT_GAP` so labels sit under the
weeks they name.

---

## Components

**`Eyebrow`** — 10px uppercase muted label. Opens almost every panel.

**`SectionHeading`** — display heading with an optional right-aligned aside.
Bottom-ruled.

**`Segmented`** — the tab control. Active is plum ground, cream text. Sizes `sm`
and `md`. Used for period, body metric, muscle group, cardio metric.

**`Bar`** — a track with a fill. Defaults to plum. `height` 3–6 by density.

**`Versus`** — one bar split between two people, plum from the left, rose filling
the rest. A close round looks close.

**`Stepper`** — ‹ label › day navigation. Disabled arrows drop to
`rgba(34,28,36,0.18)`.

**`TrendChart`** — the interactive body trend. Points positioned by date, hover
and touch-drag read back the nearest reading horizontally. Every reading is
dotted so a cluster reads as a cluster.

**`Empty`** — display-type title plus a muted note. Used wherever a source has
nothing, never a blank panel.

---

## Layout

Two columns: a 252px sticky nav and the main content, max-width 1320.

Below 900px the grid collapses to one column, the nav becomes a horizontal
scrolling strip, and `.training-split` / `.training-split-3` / `.training-pair`
all fall to a single column. Wide content scrolls inside its own container — the
page body never scrolls horizontally.

`@media (prefers-reduced-motion: reduce)` disables every transition.

---

## Interaction

Hover states are real CSS classes in `training.css`, not inline handlers:

| Class | Effect |
|---|---|
| `.hv-nav` | lilac haze — nav rows |
| `.hv-tab` | tint — segmented buttons, steppers |
| `.hv-row` | tint — session list rows |
| `.hv-cell` | tint — table rows |
| `.hv-solid` | `#4A3459` — the solid plum button |

Focus is `2px solid var(--plum)` at `2px` offset on every button, input and select.

---

## Where the rules live

| File | Owns |
|---|---|
| `palette.ts` | Every colour |
| `targets.ts` | Every target a score is measured against |
| `periods.ts` | Day/Week/Month/Year windows and their comparisons |
| `scoring.ts` | The six dimensions and how a period becomes a score |
| `exercises.ts` | Muscle group and equipment from a lift's name |
| `workoutKind.ts` | Strength vs cardio from a synced workout |
| `historyInsights.ts` | Observations that need years, not a window |
| `logic.ts` | Every string, colour and width the view renders |
| `TrainingView.tsx` | Layout only — no logic, no data decisions |
| `training.css` | Scoped tokens, hover states, responsive rules |

The split matters: `logic.ts` decides what the data says, `TrainingView.tsx`
decides how it looks. A number is never computed in the view, and a layout
decision is never made in the logic.

---

## Adding a screen

1. Add the name to `SCREENS` in `logic.ts` — the nav numeral follows automatically.
2. Add a `titles` entry: heading and one-sentence subtitle.
3. Build the view model in `deriveVals`, returning strings and colours, never raw numbers.
4. Add the component to `TrainingView.tsx` and wire it into the screen switch.
5. Every figure that can be absent must degrade to `—` with copy explaining which
   source is empty.
