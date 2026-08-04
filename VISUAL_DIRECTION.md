# Visual Direction — Phase 3

The design system behind `sagitta.systems`. Tokens live in
[`src/app/globals.css`](src/app/globals.css); this document explains what they
are for and the rules that govern them.

Phase 1 built the architecture, Phase 2 established content truth. Phase 3 is
the visual and conversion pass over both. Nothing here changes a verified claim,
an operating state, a price, or a statistic.

---

## 1. What was already there, and kept

| Asset | Where it came from | What happened to it |
|---|---|---|
| `sagitta.png` — the network mark | Pre-existing | Kept, used in the header, footer, and favicon |
| `sagitta-hero.png` — constellation graphic | Pre-existing homepage hero | Kept in the media library. **Replaced in the hero** by the interactive constellation, which carries information the still image could not |
| `diagram.png` — protocol architecture | Pre-existing, press-cleared | Kept, and now the hero image of its newsroom record |
| `aaa.png`, `sce.png`, `defense.png`, `protocol.png`, `selun.svg` | Pre-existing product marks | Kept in the media library. **Removed from system cards**, which now use family icons so a card reads as a member of a family rather than as a logo grid |
| `ConstellationGraphic.tsx` | Unused inline SVG, kept as a brand asset in Phase 1 | Still unused, still kept. `SystemConstellation` supersedes it |

The dark institutional foundation, the constellation motif, and the technical
register of the copy are all carried forward. What changed is depth, family
differentiation, and the fact that the network is now drawn rather than asserted.

---

## 2. Core principles

1. **Evidence is a visual category.** Operating state, verification date, and
   supporting links get their own surface treatment (`.evidence-panel`) —
   inset, left-ruled, technical. A reader should be able to find what backs a
   claim without reading the page.
2. **State is never colour alone.** Each operating state has a distinct glyph
   *and* its name in text. Removing colour loses nothing.
3. **One identity, three families.** Same foundation, typography, grid, and
   spacing throughout; families separate through accent, icon, and background
   motif only.
4. **Nothing important is hover-only.** Every fact the constellation reveals on
   hover is also in its structured list.
5. **Restraint over decoration.** Depth comes from a fine grid, controlled
   luminosity, and hairline rules — not from shadows stacked on gradients.
6. **The record outranks the marketing.** Where the two conflict, the record
   wins: an in-development system says so before it says anything else.

---

## 3. Colour

### Foundations

| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#04070d` | Page background, near-black with a navy cast |
| `--bg-raised` | `#070c16` | Alternating sections, hero, evidence panels |
| `--surface` → `--surface-3` | `#0a111e` → `#142138` | Card and control surfaces |
| `--border` / `--border-strong` | `#1b2942` / `#2b3f61` | Hairlines and hover states |

A 64px grid runs across the page background at ~5% opacity — the institutional
substrate, visible but never legible as pattern.

### Type

| Token | Value | Contrast on `--bg-base` |
|---|---|---|
| `--text-primary` | `#eef2f8` | ~17:1 |
| `--text-secondary` | `#a2b3c9` | ~9:1 |
| `--text-tertiary` | `#77899f` | ~5.2:1 |

All three clear WCAG AA for body text. `--text-tertiary` was raised from the
Phase 1 value specifically to clear it.

### Accents

**Gold** (`--gold` `#d9b168`) is the institutional accent: primary buttons,
links outside a family context, eyebrows, statistics, the active-route marker.
**Violet** (`--violet` `#a78bfa`) is the secondary accent and the allocation
family. Both were specified in the brief; Phase 1's blue `#3b82f6` is gone.

### Signal / status

Four evidence-based states, each with a colour *and* a shape:

| State | Colour | Glyph |
|---|---|---|
| Operating | `#35d39a` emerald | filled dot |
| Public Test | `#4ec8d8` cyan | hollow ring |
| In Development | `#a78bfa` violet | half-filled dot |
| Research Horizon | `#8095ad` slate | dash |

Status colours are deliberately kept off gold, so an accent is never mistaken
for a state.

---

## 4. The three families

Each family gets an accent, an icon, and a background motif. The accent is bound
by a scope class — `.family-continuity-defense` and friends set
`--family-accent`, and every component inside reads that generic name. A card
never needs to know which family it is in.

| Family | Accent | Motif | Icon |
|---|---|---|---|
| **Continuity and Defense** | `#4ec8d8` cyan | `signal` — radar arcs sweeping outward from an origin | Origin point with three expanding arcs |
| **Allocation and Agent Intelligence** | `#a78bfa` violet | `intelligence` — one input, a decision node, governed outputs | Routing diagram |
| **Capital Infrastructure** | `#d9b168` gold | `ledger` — settlement rails with value moving along them | Stacked rails with blocks |

Motifs are `aria-hidden` and carry no information not also in text.

Family data lives on the content records (`token`, `motif`, `shortName` on
`SystemFamily`), so the visual system is driven by the content layer rather than
by a lookup table in a component.

### The network schematic

`SystemConstellation` on `/systems#network` is a **wiring diagram, not a star
map**. It was a scatter of glowing dots over three radial-gradient family
regions; the glow and the gradients broke principle 5 above, and on a page whose
subject is infrastructure they read as decoration standing in for structure.

What it is now:

| Element | Treatment |
|---|---|
| Column | One family, left to right: continuity, allocation, capital. A small caps heading over a hairline names it, so a column is a family without needing colour to say so |
| Box | `--surface`, 1px `--border`, and a 2px `--family-accent` rule down the left edge. Short name, family icon, operating state with its glyph. No shadow, no halo |
| Wire | 1px orthogonal polyline in `--border-strong`. Solid for `structural`, dashed for `contextual` |
| Wire label | The relationship in two or three words, knocked out of the wire — so the diagram states all eight relationships without a legend |
| Selection | The hovered or focused box turns gold and its wires with it; everything else drops to low opacity. Exactly one thing on the diagram is ever gold |

Wire labels come from `shortReason` on `SystemConnection` — a compression of the
`reason` already published on the record, never a new claim. Omit it and the
wire simply draws unlabelled.

**Boxes and routes are both authored**, in `src/lib/constellation.ts`, for the
reason the positions always were: eight fixed members whose grouping is the
point, and a solver would reshuffle the picture on any content change while
costing a runtime dependency. Because the routes are hand-drawn, `assertLayout`
re-checks them on every build and throws rather than shipping a diagram that
misdraws the network — no diagonal runs, every end on the perimeter of the box
it claims to join, no run through a third box, no two boxes overlapping, and a
clearance gutter around every label. A label that merely *nearly* touches
another already reads as touching, so the test demands the gutter rather than
bare non-intersection.

---

## 5. Reusable patterns introduced

| Pattern | Class / component | What it does |
|---|---|---|
| Family scope | `.family-*` | Binds `--family-accent` for a subtree |
| Family card | `.family-card` | Accent hairline along the top edge, accent border and glow on hover/focus |
| Evidence panel | `.evidence-panel` | Raised, left-ruled surface for verification material |
| Section rule | `.section-rule` | Section divider with a short accent signal at its left edge |
| Eyebrow | `.eyebrow` | Uppercase, letterspaced, family-accented section label |
| State glyph | `<StateGlyph>` | Shape-coded operating state |
| Family icon | `<FamilyIcon>` | Motif icon at any size |
| Family backdrop | `<FamilyBackdrop>` | Decorative motif behind a hero |
| Tagged CTA | `<CtaLink>` | State-aware action with analytics data attributes |
| Text alternative | `.alt-text-at-lg` | Below `lg` it is the presentation; from `lg` up it is the graphic's accessible equivalent |

---

## 6. Typography, spacing, radius

Type scale runs `--text-xs` `0.75rem` through `--text-4xl` `3rem`. Display
headings use `--tracking-tight` `-0.022em` and `text-wrap: balance`. Eyebrows use
`--tracking-eyebrow` `0.14em`.

Spacing is a 4px-based scale (`--space-1` … `--space-24`). Radius runs
`--radius-sm` `4px` through `--radius-xl` `16px`, plus `--radius-pill`.

No web font is loaded. The system font stack is unchanged from Phase 1 — it
costs nothing, renders immediately, and there is no layout shift to manage.

---

## 7. Motion

| Token | Value |
|---|---|
| `--duration-instant` … `--duration-reveal` | 90ms … 800ms |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--ease-signal` | `cubic-bezier(0.34, 1.2, 0.64, 1)` |

Four animations exist: `sag-rise` (staggered hero reveal), `sag-pulse` (active
desk and open-role indicators), `sag-sweep` (radar), and `sag-trace` (the
schematic's structural wires drawing themselves in — contextual wires stay
static, because their dash pattern carries the meaning and a trace animation
would fight it for the same `stroke-dasharray`).

Rules:

- Motion moves content that is **already present and readable**. A failed or
  disabled animation never hides anything.
- No autoplay audio or video anywhere.
- No information appears only through animation.
- `prefers-reduced-motion: reduce` collapses every duration to `0.001ms`,
  disables smooth scrolling, and removes the reveal transforms entirely.
- All motion is CSS. The only client JavaScript added this phase is the header's
  scroll state, the mobile drawer, the two filter components, and the
  constellation's selection state.

---

## 8. Responsive behaviour

Three reference widths: **390** (mobile), **768** (tablet), **1440** (desktop).

- The page body never scrolls horizontally. Wide content scrolls inside its own
  `.scroll-x` container.
- The constellation is a laid-out graphic from `lg` (1024px) up. Below that it
  becomes a stacked network map — the same records, laid out for a narrow,
  touch-driven screen, not a shrunken diagram.
- Touch targets are at least 44px on coarse pointers (`.tap-target`).
- The header is fixed and transparent over the hero, solidifying on scroll.
  `.hero-section` reserves the header's height, so nothing starts underneath it.
- The mobile drawer is a full-screen modal: focus moves in on open, is trapped,
  returns to the toggle on close, closes on Escape, and locks the page behind.

---

## 9. Accessibility requirements

Target: WCAG 2.2 AA.

- Semantic landmarks on every page: `header`, `main`, `footer`, plus a skip
  link. One `h1` per page, and no heading level is skipped.
- Visible focus on every interactive element: 2px gold outline, 2px offset.
- Status is communicated by shape and text as well as colour.
- Every complex graphic has a structured-text equivalent. The constellation's
  list is that equivalent, and only one version is ever in the accessibility
  tree at a given width.
- Filters are labelled radio groups; result counts are announced via
  `aria-live="polite"`.
- External links carry `target="_blank"`, `rel="noopener noreferrer"`, a visual
  affordance, and a screen-reader-only "(opens in a new tab)".
- Decorative graphics are `aria-hidden`; decorative images carry `alt=""`.

Assertions for most of the above run in `tests/export/rendered.test.mjs` against
the real static export.

---

## 10. Performance

No runtime dependency was added. Shared first-load JS is unchanged at ~101 kB;
see [`MIGRATION_NOTE.md`](MIGRATION_NOTE.md) §8 for the per-route figures and
the reason for each change.

- No web font, so no font loading strategy is needed.
- Open Graph cards are palette-quantised PNGs at ~65 kB each, generated once by
  `npm run build:og` and committed. The generator is not part of the build.
- The schematic is inline SVG plus positioned anchors — no canvas, no chart
  library, no layout thrash. Wire-label widths are estimated from character
  count rather than measured, so nothing reads layout in the browser.
- Client components receive pre-rendered card nodes plus a small metadata array,
  so filtering never pulls the content layer into the browser bundle.

---

## 11. The front page — a broadcast grammar

The institutional routes keep everything above: `Section`, `SectionHeading`,
`surface-card`, one measure, an even rhythm. The homepage does not, and the
distinction is the point. A document is read; a broadcast is watched.

The grammar lives in the `.broadcast` block of
[`src/app/globals.css`](src/app/globals.css) and is used by no other route.

### The five rules

1. **The viewport is the canvas.** `.canvas` is a full-width band aligned only
   by `--gutter` — not a narrow centred column repeated six times. A stage
   aligns its *text* to an inner measure; it never confines its *composition*
   to one.

   The gutter is
   `max(clamp(1.25rem, 5vw, 5.5rem), calc((100vw - 100rem) / 2))`. The second
   term is what caps the content: past 100rem of usable width the gutter
   absorbs the surplus, rather than a centred `max-width` box doing it. That
   matters for more than tidiness — with a centred box, an element trying to
   reach the viewport edge would have to cross the gutter *and* whatever
   centring leftover the viewport happened to have, which is not a distance an
   element can know. Every bleed stopped short by exactly that leftover. With
   the cap in the gutter, `-1 * var(--gutter)` lands on the edge at any width.

   `--gutter` is a `:root` token, not a `.broadcast` one, because the header
   sits over the front page and takes its alignment: `[data-home="true"]` drops
   the header's `max-w-6xl` for the same gutter, which is what keeps the
   wordmark on the same line as the headline beneath it.
2. **Important media breaks the gutter.** The lead picture and the Selun
   interface run off the right edge of the viewport; the Watch poster runs off
   the left. Whatever runs past an edge loses the border along that edge —
   `.interface-bleed-right`, `.poster-bleed-left` — because a frame with four
   sides reads as a picture of a window rather than as a window.
3. **A border means a real frame.** `.interface-frame` (a running interface),
   `.poster` (a programme poster), and a document page are the only things on
   this page allowed a rectangle. Nothing decorative gets one.
4. **Gold illuminates; it does not fill.** The front page has exactly one action
   treatment, `.action-line` in `PromoAction` — a precise label over a gold rule
   that brightens and glows on hover. `btn-primary` is not used on this page.
   Gold otherwise appears as an eyebrow, a hairline, a marker fill, and the
   light in `.haze-*`.
5. **Violet is depth, not a wash.** It sits low and wide in `.haze-lead` and
   `.haze-close`, and is the accent of the allocation family on the interface.

### The stages

| Stage | Character | Composition |
|---|---|---|
| Lead carousel | Cinematic, dominant | `78svh` / `88svh` at `lg`. One slide at a time. Picture bled right and capped at `min(64svh, 680px)`; headline layered over it at `clamp(3.25rem, 7vw, 7.5rem)`; source, date, and system as compact metadata. A numbered rail of three markers, each a rule that fills. |
| Signal strip | Typographic, immediate | A single `.ticker` line, four figures at `clamp(1.75rem, 2.6vw, 2.75rem)`, split by hairlines. Wider than any text column. Horizontal snap-scroll below `900px` — the one place lateral movement belongs, because the content is genuinely sequential. |
| Product moment | Operational, asymmetrical | The Selun wizard at 8/12 running past the right edge; the editorial column at 4/12. Violet light from the right. |
| Watch | Cinematic, anticipatory | 16:9 poster at 7–8/12 bled left, editorial column beside it. Always renders; two states (below). |
| From the network | Editorial, text-led | Two columns: one lead item at `clamp(1.9rem, 3.4vw, 3.4rem)` with a gold rule, three rows at `clamp(1.25rem, 1.9vw, 1.9rem)`. Hairlines, a directional cue, no cards. |
| Closing feature | Immersive, consequential | `76svh`, full-bleed image drifting under a radial-plus-linear falloff, Sagitta's constellation drawn over it, type set low in the frame. Lit from below and behind — the opposite of the lead. |

Light falls across the sequence rather than resetting at every border: the lead
opens with gold high and violet low, the ticker drops to near-black, the product
stage turns violet, Watch goes darker still, the desk goes quiet, and the
closing feature is the deepest field on the page. There is no repeated
horizontal section border anywhere in the sequence.

### The Watch stage's two states

Watch is the only stage that always renders, because a permanent programme slot
is part of the composition. Which state it takes is decided by the promotion
collection, never by markup:

- **Published** — one or two verified `video-feature` promotions exist. Verified
  16:9 poster, `.play-badge`, series, title, destination, and a duration only
  where the source publishes one.
- **Forthcoming** — no verified episode exists, which is the case today.
  `forthcomingProgramme` in [`src/content/watch.ts`](src/content/watch.ts)
  presents *Sagitta Defense Review* with the status *First episode forthcoming*.

The forthcoming state is a programme announcement, not a simulated player. It
carries no play control, no runtime, no view count, no episode link, and no
YouTube destination, and its only link is `/systems/sagitta-defense` — a page
that already exists. `tests/export/rendered.test.mjs` asserts every one of those
absences, so the state cannot quietly acquire an unearned claim.

### Media rules

- Media is real, approved, and described for what it is. Every promotion still
  states its `kind`; a mark is presented as a mark.
- **A mark is not a picture, and never gets a picture's treatment.** The lead
  stage branches on `data-fit`. A `cover` composition is scrimmed for
  legibility and has its free edges dissolved with a `mask-image`, so it reads
  as a picture the page opens onto. A `contain` mark gets *no* scrim and no
  fill — only a soft well of gold-into-violet light behind it — because
  scrimming a transparent mark paints a lit rectangle around it, which is the
  framed logo tile this pass exists to remove.
- The Selun stage renders the production wizard's own prompt, controls, option
  sets, segments, and seven processing steps from `selunInterface`, read from
  `AAA/SelunAgent/app/wizard/page.tsx`. It shows the *surface*, never a result —
  a run produces an allocation for the reader who made it, and Sagitta publishes
  none here. The `figcaption` says so, and a unit test fails if any percentage
  or currency value enters the record.
- A decorative composition carries `alt=""`. The interface stays live text in
  the accessibility tree rather than being hidden behind its caption: what it
  asks and what it does is information, and this page puts no information
  anywhere a reader can only see it.

### Motion

Slow, atmospheric, and always optional. `sag-drift` moves the closing image over
34–40s, `sag-scan` turns the lead's radar trace over 18s, `sag-media-settle`
lands a slide's picture out of a 5.5% over-scale, `sag-slide-in` brings a slide
forward, and `sag-fill` fills the active marker's rule once. Nothing
auto-advances: the carousel moves only on a reader's action, and the marker fill
is a reveal rather than a countdown. Every one of these is neutralised under
`prefers-reduced-motion: reduce`, which leaves all content present and unmoved.

### Small screens

Mobile is its own composition, not the desktop arrangement scaled down:

- The lead keeps a dominant picture at a `4 / 3` crop — a landscape band, not
  the desktop proportion shrunk — with the headline immediately beneath it at
  full clamp scale.
- The ticker becomes a snapping horizontal scroll and keeps its live character.
  `.ticker-scroll` returns to `overflow-x: visible` above 900px, where the four
  figures share the width and nothing overflows — a scroll container left in
  place there only reserves scrollbar space at the edge of the stage.
- The interface and the poster keep cinematic width and stack their columns.
- Section heights shorten; negative space does not.
- One action per promotion stays visible throughout.
