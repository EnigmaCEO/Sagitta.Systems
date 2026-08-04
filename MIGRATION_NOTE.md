# Migration Note

Record of the structural and content passes on `sagitta.systems`.

Stack unchanged throughout: Next.js 15 App Router, React 19, TypeScript
(strict), Tailwind 4, `output: "export"` static export. No runtime dependencies
have been added.

- **Phase 1** — architecture, routes, templates, navigation, content layer (§6 onward)
- **Phase 2** — content truth, taxonomy, hierarchy, relationships (§3–§5)
- **Phase 3** — visual authority, constellation, mixed media, conversion (§1–§2)
- **Phase 4** — the promotional front page and editorial reduction (§0)

Detailed record classification lives in [`CONTENT_AUDIT.md`](CONTENT_AUDIT.md).
The design system is documented in
[`VISUAL_DIRECTION.md`](VISUAL_DIRECTION.md).

**Identity, as published:** Sagitta Systems is the development identity behind
Sagitta's continuity, allocation, and capital infrastructure. It operates within
Sagitta Labs, the emerging umbrella brand for the broader Sagitta portfolio —
currently a brand architecture rather than an incorporated entity. The eight
open decisions from the first Phase 2 pass were resolved by owner decision on
29 July 2026 — see [`CONTENT_AUDIT.md` §0](CONTENT_AUDIT.md). Phase 3 revisited
one of them: **decision 5, product attribution, was reversed** (§1 below).

---

## 0. Phase 4 — the promotional front page and editorial reduction

Phase 4 replaces the ten-section institutional homepage with a promotional front
page, and gives every major route one audience and one job. **No verified claim,
metric, launch, publication, media item, testimony, partnership, price, operating
state, or external destination was introduced.** The system count is still 10,
the published-record count is still 10, the roadmap is still 14 items, and every
statistic keeps its original source and verification date.

### The promotion content layer

New typed collection: `src/content/promotions.ts`, with types in
`src/content/types.ts`. Format, channel, and placement are modelled as three
separate concepts — what kind of subject it is, where the source or destination
lives, and how the homepage stages it. All 13 promotional formats are in the
model; 8 decision lenses map promotions onto the systems that serve them.

15 promotion records, 13 active across 6 formats. Every one is assembled from
material already on the public record: a launch that happened, a figure a Sagitta
surface publishes, a document that resolves, an interface that runs. Editorial
`priority` sets order, so date does not choose the lead story — the Defense launch
leads while two verification records carry a later date.

`scripts/check-content.mjs` now enforces the promotion rules: valid taxonomy,
namespaced and unique action ids, one sentence of context, a dated as-of value on
every signal, snapshot labelling, real local assets, alternative text on every
image, no action that exceeds a system's operating state, per-placement density
limits, 4–6 active formats, no restated system count, and agreement between the
model and `PROMOTION_COVERAGE.md`.

### The homepage

Retired: hero constellation, lead story, latest grid, system families, editorial
desks, roadmap signal, press room, careers, founder's desk.

New rhythm: lead carousel → signal strip → product moment → video → network
headlines → cinematic feature → institutional footer.

- **Lead carousel** — three slides, one visible at a time. Every slide ships in
  the HTML, so with scripting unavailable the lead story still renders in full.
- **Signal strip** — four dated figures, text and hairlines only. The Radar
  exposure figure renders as "Snapshot as of 29 Jul 2026", never as a live value.
- **Product moment** — Selun, one at a time. The Wallet demonstration is a real
  promotion held archived behind it.
- **Video stage** — built, wired, and rendering nothing. No Sagitta video,
  YouTube channel, or episode destination exists anywhere in this repository, so
  the stage is absent rather than filled with a poster for something that has not
  been made. It appears the day a real episode enters the collection.
- **Network headlines** — four typographic rows across two AAA research notes, a
  system verification record, and the architecture diagram.
- **Cinematic feature** — Sagitta Protocol v0.1 on Moonbase Alpha, with the
  testnet qualification stated in the action itself.

No approved interface capture exists for any Sagitta product. Promotions use the
system's own mark or the architecture diagram and state the media kind in the
record, so a mark is never dressed up as a screenshot and no interface is
simulated. This is the highest-value asset gap on the coverage inventory.

### Editorial reduction

| Moved from | To | Reason |
| --- | --- | --- |
| Homepage constellation | `/systems#network` | The portfolio's picture of itself belongs to the route that owns the portfolio. |
| `/about` — "Find your entry point" | `/systems#entry-point` | Engagement paths are the systems route's job. |
| `/about` — operating posture cards | `/roadmap`, `/status` | Both already publish the states and the evidence. |
| `/about` — documents grid | `/documentation` | The documentation index is canonical; About links to it. |
| `/about` — per-system family lists | `/systems` | About states the structure once and links to the record. |
| Footer — ten system rows with states | `/systems` | The footer now carries three families and a count. |

The system count is now published on `/systems` only. The `systems-count` press
statistic is unchanged and accurate but held `internal`: it was being restated as
a slogan, and the press room's extended description still gives a journalist the
portfolio structure in prose. Xavier D. Moore's full profile appears only on
`/about`; the press room keeps one compact approved reference and links to it.

### Tests

- `tests/unit/interaction.test.mjs` — 15 promotion-model tests: format
  completeness, the format/channel/placement separation, lens routing, active-only
  rendering, editorial ordering, one-item stages, signal dating, state-appropriate
  actions, real destinations, honest media kinds, and the absence of records for
  formats with no real asset.
- `tests/export/rendered.test.mjs` — the constellation suite now runs against
  `/systems`; new suites assert the homepage rhythm, one dominant slide, tagged
  promotional actions, snapshot labelling, headline and video limits, the absence
  of the founder biography, press kit, careers, roadmap, and inventory modules,
  and one canonical home per subject.

### What Phase 4 did not do

- Did not invent a launch, metric, episode, article, testimonial, customer
  result, partnership, or piece of external coverage.
- Did not add an X, LinkedIn, YouTube, or Paragraph destination. None is recorded
  anywhere in this repository, so those channels are modelled and unused.
- Did not change a product name, operating state, price, date, or the Sagitta
  Labs relationship.
- Did not promote any system beyond its verified state: Sagitta Protocol is
  explored, not opened, and Sagitta Wallet's demo is described as sample data.

---

## 1. Phase 3 — what changed for the public record

Phase 3 is a visual and conversion pass. **No verified claim, operating state,
price, statistic, partnership, role, or publication was changed or added.** The
system count is still 10, the published-record count is still 10, the roadmap is
still 14 items, and the eight statistics still carry their original sources and
verification dates.

Three things did change on the public record.

### Product attribution removed — reverses Phase 2 decision 5

Phase 2 recorded `"by Sagitta Labs"` as attribution on the Sagitta Radar system
record and rendered it beside the product name. Phase 3 removes it: the product
is **Sagitta Radar**, published with no adjacent lockup, badge, subtitle, or
attribution line. The site itself already supplies the development context.

The `attribution` field is gone from `SystemRecord` entirely rather than left
empty, so it cannot be quietly repopulated. The institutional relationship is
still published — on `/about#identity`, in the press room's naming guidance, and
in the footer — which is where it belongs.

The validator now sweeps every string that could render publicly and fails the
build on `Radar by Sagitta Labs`, `Sagitta Radar by Sagitta Labs`, `Developed by
Sagitta Systems`, or any `Sagitta <product>, by Sagitta Labs` construction. One
record is exempt by id: the press room's naming guidance, whose whole purpose is
to quote the forbidden form in order to forbid it. The exemption is keyed to
that single id so it cannot widen silently.

### Sagitta Labs described more precisely

`identityHierarchy` and the footer now state that Sagitta Labs is the emerging
umbrella brand for the broader Sagitta portfolio, **currently a brand
architecture rather than an incorporated entity**. The validator fails the build
if that qualifier is dropped while incorporation language is present.

### Network relationships published

Each system record now carries `connections` — links to other systems, each with
the reason for the link and whether it is structural or contextual. Every reason
restates a relationship that record's own `overview` copy already published;
nothing new is claimed. Ten edges result, and they are what the constellation
draws. The validator requires each connection to name a real system, not point
at itself, and carry a stated reason.

### State-aware conversion architecture

Generic calls to action are replaced by actions derived from each system's real
state and real public destination. Every system carries a `primaryAction` and
usually a `secondaryAction`, each with a label, destination, type, availability,
audience, and a stable analytics identifier.

The validator enforces the rules that matter:

- A system that is not `Operating` may not offer an `open-product` action.
- An `Operating` system's primary action may not be merely `documented`.
- A label may not be `Learn more`, `Read more`, `Click here`, or similar.
- An absolute URL must be marked external and an internal one must not be.
- Every analytics identifier is unique.
- An archived capability carries no call to action at all.

Identifiers are emitted as `data-cta`, `data-cta-type`, and
`data-cta-availability`. **Nothing reads them at runtime** — no analytics vendor
was added, as scoped. They exist so a later phase can measure system entry,
operating-product visits, documentation visits, Defense Review inquiries,
partnership inquiries, press inquiries, and career actions without
re-instrumenting every template.

### What the actions say now

| System | State | Primary action |
|---|---|---|
| Sagitta Continuity Engine | Operating | Open the Continuity Engine |
| Sagitta Defense | Operating | Request a Defense Review — *$3,000 flat, fixed scope* |
| Sagitta Radar | Operating | Open Sagitta Radar |
| AAA | Operating | Open AAA |
| Selun | Operating | Open the allocation wizard |
| Selun x402 | Operating | Review the available endpoints |
| Sagitta Protocol | Public Test | Explore the public test — *v0.1 on Moonbase Alpha* |
| Sagitta Banking | In Development | Discuss an integration — *design-partner briefings only* |
| Treasury Decision Desk | In Development | Arrange an engagement |
| Sagitta Wallet | In Development | View the demonstration — *sample data, holds no funds* |

The Defense Review's fixed $3,000 engagement price is preserved. No moving
figure was introduced: the export test fails if `$29`, `$99`, `$149`, `$79/mo`,
or `$499/mo` appears anywhere in the build.

---

## 2. Phase 3 — build and interface

### Design system

Tokens for background and surface levels, borders, text, gold and violet
accents, four signal colours, three family accents, shadows, glow, spacing, type
scale, radius, motion duration, and easing — all in
[`src/app/globals.css`](src/app/globals.css), documented in
[`VISUAL_DIRECTION.md`](VISUAL_DIRECTION.md).

Phase 1's blue accent is gone; the palette is now the deep navy, near-black,
gold, off-white, and deep violet the brief specifies. `--text-tertiary` was
lightened to clear WCAG AA at 5.2:1.

Families are bound by scope class (`.family-continuity-defense` and friends set
`--family-accent`), so a component inside a family subtree never needs to know
which family it is in. Family identity data — accent token, motif, short name —
lives on the `SystemFamily` records, not in a component lookup table.

### The system constellation

`SystemConstellation` draws the ten systems, three families, and ten documented
relationships. Constraints it was built to:

- Every node is a real `<a href="/systems/…">`. With scripting unavailable the
  graphic still renders and every node still navigates.
- Selection follows **focus as well as hover**, so a keyboard user drives the
  detail panel exactly as a mouse user does.
- Below `lg` the graphic is replaced by a stacked network map, not shrunk.
- The structured list is the graphic's text alternative, rendered **once**:
  `.alt-text-at-lg` makes it the presentation on narrow screens and the
  accessible equivalent on wide ones, so only one copy is ever in the
  accessibility tree.
- The edge layer is decorative and `aria-hidden`; every relationship it draws is
  also stated in words.
- Structural edges are solid and animate in; contextual edges are dashed and
  static.

Node positions are authored rather than force-directed: ten fixed members whose
grouping is the point, and no runtime layout dependency.

### Mixed media

All eight media types have an accent, a glyph, and a card treatment. Documents
and recordings lead with a visual; system updates read as technical records with
a monospace stamp and no image.

`MediaPlayer` renders audio and video **only** from a record's verified `media`
block. No Sagitta recording has been published, so it renders nowhere today —
which is the point: the capability ships without a fabricated episode to
demonstrate it. An export test fails if an `<audio>` or `<video>` element
appears anywhere in the build.

### Filters

Systems filter by family and operating state; the newsroom filters by desk,
media type, related system, and publication period. The filter logic is
extracted into `src/lib/filters.ts` as pure functions, which is what lets the
central rule be tested exhaustively: **a facet count is the number of records
that would remain if that option were chosen, given the other axes as they
are**. A count never promises results the selection would not return.

Cards are rendered on the server and passed to the client components as nodes,
so filtering ships a small metadata array rather than the content layer.

### Open Graph assets

Ten cards at 1200 × 630 in `public/og/`: homepage, systems, newsroom, roadmap,
careers, about, press, and one per strategic family. System and publication
pages inherit their family's card where no dedicated verified image exists.

**Provenance:** generated by `npm run build:og` from this site's own design
tokens and content — typography, family accents, and geometric motifs. No
third-party imagery, no depiction of a product surface that does not exist, no
figure that moves. Palette-quantised to ~65 kB each.

The generator is an **authoring tool, not a build step**. It is run by hand, its
output is committed, and `npm run verify` never invokes it — so the static
export has no image-generation dependency. It uses `next/og` and `sharp` from
the existing Next.js dependency tree; if `sharp` is unavailable it writes the
uncompressed PNG and says so.

### Route-count reconciliation after Phase 3

**Unchanged: 50 generated, 48 exported.** Phase 3 added no routes and removed
none. The arithmetic in §3 still holds, and `check-links` still prints it.

### Bundle size

Shared first-load JS is unchanged at **101 kB**. Two routes moved materially:

| Route | Phase 2 | Phase 3 | Why |
|---|---|---|---|
| `/` | 105 kB | **123 kB** | The interactive constellation is a client component |
| `/newsroom` | 132 kB | **112 kB** | Story cards are now server-rendered nodes; the client no longer receives the entry list |

The newsroom saving is larger than the homepage cost, so the site is net
lighter. No runtime dependency was added in either direction.

Internal links rose from 1,626 to 2,422. That is the footer: it now lists all
ten systems grouped by family on every page, where Phase 2's footer listed only
the destinations that resolve. Every one of them is checked by `check-links`.

---

## 3. Route-count reconciliation

**The question:** the build reported 53 prerendered static pages while
`check-links.mjs` inspected 51 HTML files.

**The answer: the two missing outputs are the Pages Router fallbacks `/404` and
`/500`**, emitted to `.next/server/pages/404.html` and
`.next/server/pages/500.html`. Next counts them in "Generating static pages
(N/N)" because it renders them, but neither is part of the App Router export.
The App Router's own `/_not-found` is what becomes `out/404.html`.

```
generated = App Router prerendered routes + /_not-found + /404 + /500
exported  = App Router prerendered routes + out/404.html (from /_not-found)
gap       = 2, always
```

At the Phase 1 build: 50 + 1 + 2 = 53 generated, 51 exported.
At the current build: 47 + 1 + 2 = 50 generated, 48 exported.

The link checker was **not** skipping real pages, so its traversal is unchanged.
It now prints this reconciliation on every run, so the arithmetic stays visible
as content changes:

```
Route count reconciled: build reports 50 static pages, out/ holds 48 HTML files.
  47 App Router prerendered routes
  + 1 App Router /_not-found  → out/404.html
  + 2 Pages Router fallbacks (404.html, 500.html) — counted by the build, never exported
  = 50 generated, 48 exported
```

Page count fell from 51 to 48 because seven invented newsroom placeholders were
deleted (−7), four real publications were added (+4), and two fabricated career
records were withdrawn from public display (−2).

---

## 4. Phase 2 — content truth

### Final systems taxonomy — exactly 10

| Continuity and Defense | Allocation and Agent Intelligence | Capital Infrastructure |
|---|---|---|
| Sagitta Continuity Engine — Operating | AAA — Operating | Sagitta Banking — In Development |
| Sagitta Defense — Operating | Selun — Operating | Sagitta Protocol — Public Test |
| Sagitta Radar — Operating | Selun x402 — Operating | Treasury Decision Desk — In Development |
| | | Sagitta Wallet — In Development |

Every state was assigned from observable evidence, not from the existence of a
DNS record. Sources are recorded per system in `src/content/systems.ts` and
tabulated in the content audit.

**State changes from Phase 1:**

| System | Phase 1 | Phase 2 | Why |
|---|---|---|---|
| Sagitta Radar | In Development, no URL, "description pending" | **Operating** | `radar.sagitta.systems` is a public subscription product with four priced plans and a live alert feed |
| Selun x402 | In Development, no URL, "description pending" | **Operating** | The x402 discovery document resolves and advertises nine agent-payable endpoints |
| Sagitta Banking | Research Horizon, no URL, "description pending" | **In Development** | `banking.sagitta.systems` is live and states its own development status |
| Treasury Decision Desk | Public Test with an operating URL | **In Development**, no URL | `treasury.sagitta.systems` does not resolve |
| Sagitta Wallet | In Development, presented plainly | **In Development**, described as a demo | The public surface runs on mocked data — the repository calls it an investor-demo vertical slice |

### Leadership

Sagitta Systems publishes **one** leadership profile: **Xavier D. Moore**,
owner-confirmed and press-ready, sourced to owner confirmation plus
`xaviermoore.com`.

The two names previously published here as founder-operators — Orion Gray and
Alexander Roth — are **Sagitta Labs aliases**, not Sagitta Systems leadership.
They have been removed from leadership, press biographies, the structured
`people` collection, and page metadata. They are retained in
`sagittaLabsAliases` in `src/content/people.ts` for provenance: nothing in this
hub reads that array, and nothing should. If a Sagitta Labs page is ever built,
that is where its leadership copy should come from — explicitly. The validator
fails the build if either name reappears in `people`, and if a published
leadership profile is anything other than `verified`.

### Grants and Rebalancing reclassified

Both were presented as peer systems in Phase 1. Neither is one.

- **Grants** → **archived** historical capability, not a current offering. Its original description is preserved on the record; it is excluded from the current-capabilities list and from every system page's supporting-capability block, and appears on `/systems` only under an "Archived" line. `grants.sagitta.systems` does not resolve.
- **Rebalancing** → current capability of the allocation family, delivered through Selun (the wizard) and Selun x402 (the `rebalance` endpoint advertised in the discovery document) on AAA intelligence. `rebalancing.sagitta.systems` does not resolve.

They keep all their copy and links, appear under **Supporting Capabilities** on
`/systems` after the three families, carry no operating-status badge, and are
excluded from every system count — `systemCount` is derived from
`publicSystems`, which excludes capabilities by construction, and the validator
asserts it equals 10.

**Compatibility:** `/systems/grants` and `/systems/rebalancing` were public
destinations in Phase 1, so both paths still resolve. They render a
capability template — labelled "Supporting capability", stating which systems
deliver it and how to access it — rather than 404ing or redirecting.

### Newsroom

**Removed:** all seven Phase 1 desk placeholders. They were invented to exercise
the templates and had no material behind them.

**Added — four real publications**, the AAA research notes, with titles, dates,
and destinations read from `aaa.sagitta.systems/research-notes`. **Added — two
dated status updates** for Sagitta Radar and Selun x402: neither has a launch
announcement, so both are published as verification records dated 29 July 2026,
each stating in its own body that the date is when the state was checked and not
when the system launched. The lead story is chosen editorially rather than by
recency, so a status check never becomes the network's headline.

10 published records across 5 desks. The three desks with nothing behind them
(SCE Wire, Sagitta Podcast, Words from the Architect) appear in the editorial
schedule with their cadence and format and an explicit "This desk has not
published yet" — they generate no story card. The validator enforces the match
between a desk's `active`/`upcoming` state and its published-record count.

Filters, counts, and every feed read `publishedEntries`, never the raw array.

### Careers

All 13 preserved listings audited. **Open Now contains one role** — the Sales
Engine Operator, the only role whose compensation was ever published, selling a
product that is itself publicly priced. The five contract and on-call
engagements sit in the Contributor Network; the one role the previous site
labelled "Future / Contract" is the sole Future Workstream; the six roles whose
old description was literally `"Closed"` are Archived and stay on the record.

The two "future workstream" records invented in Phase 1 for Protocol and Wallet
have been withdrawn from public display (`draft` / `internal`). They were not
real listings. The validator fails the build if a role is `Open` without
published compensation terms.

### Roadmap

Phase 1 derived one roadmap item per system, which only restated the directory.
Replaced with **14 hand-authored milestones**, each naming a specific capability,
carrying an evidence-based state, and linking its evidence: 6 in Now, 4 in Next,
4 in Horizon. No dates or quarters appear anywhere — none have been committed,
so sequence language carries the timing.

### Press room

Phase 1 published fourteen sections, nine of them a "pending" card. Now:
**eight sourced statistics** (each with metric, scope, source, and last-verified
date), an identity statement, approved short and extended descriptions, naming
and attribution guidance, one press-ready leadership biography, system and
documentation references, logos, the architecture diagram, dated announcements,
media usage guidance, and an explicit nil return on press coverage. The five
unpublishable categories collapse into one "Additional materials available on
request" panel and are tracked in the audit.

**Moving figures are handled by structure, not by promise.** The Radar exposure
figure is published only as a dated snapshot — "$328.393M in aggregate exposure
monitored at verification on 29 July 2026. Live coverage changes continuously."
Radar plan prices, AAA tier prices, and x402 per-call prices are no longer
quoted at all: the hub states how many plans, tiers, or endpoints exist and links
to the live source. Only the Defense Review's $3,000 flat fee remains as a price,
because a fixed-scope engagement price is not a moving figure.

### Relationships

Joins now filter to published + public on both sides, and detail pages omit a
related block entirely rather than rendering an empty container. System pages
show published records, roadmap milestones, roles, evidence, and supporting
capabilities; newsroom entries show their desk, primary and secondary systems,
related roadmap work, and the external destination; career pages show the
supporting system and roadmap work on it; roadmap items link system and evidence.

### Content validation

`scripts/check-content.mjs` (`npm run check:content`) compiles `src/content/`
with the TypeScript already in devDependencies and validates the same values the
pages import. It is wired into `npm run verify` **before** the build, so
incomplete or pending records fail fast. The full rule list is in the content
audit, §8.

### Metadata

Page metadata is now derived from the content layer — system descriptions carry
their operating state, the newsroom and roadmap carry live counts, careers
carries the open-role count. Nothing in development or public test is described
as a mature operating product.

---

## 5. Phase 2 — what is not done

Deferred to Phase 3, as scoped: full visual redesign, custom artwork, animation,
interactive system constellation, rich audio/video players, advanced newsroom
search, CMS integration, newsletter, application and interview backends, press-kit
downloads, new social images, and component-architecture changes.

Content gaps are in [`CONTENT_AUDIT.md`](CONTENT_AUDIT.md) §4. No decisions
remain open — §7 is now maintenance items rather than ambiguity. The two worth
watching: the Radar exposure snapshot will age and should be re-verified and
re-dated, and three editorial desks flip from upcoming to active on their first
publication.

---

## 6. Phase 1 — content already represented in the new structure

| Previous location | New home |
|---|---|
| `ecosystemItems` (AAA, SCE, Selun, Protocol, Wallet, Defense, Treasury, Grants, Rebalancing) | `src/content/systems.ts` — nine of these became systems or capabilities; all copy preserved |
| `careerAreas` — all 13 role titles and descriptions | `src/content/careers.ts`, rendered at `/careers` and `/careers/[slug]` |
| Founder-operator names, roles, biographies | Superseded — those names are Sagitta Labs aliases and are held in `sagittaLabsAliases`, rendered nowhere. Sagitta Systems leadership is Xavier D. Moore, in `src/content/people.ts` |
| "Proof of work" cards | `proofResources` in `src/content/site.ts`, on `/about#documents` and `/documentation` |
| Audience router | `audienceRoutes` in `src/content/site.ts`, on `/about#entry-point` |
| Constellation hero image | Homepage hero, unchanged |
| Footer link groups | `primaryNav` / `utilityNav` / `networkLinks` in `src/content/site.ts` |
| Status vocabulary (`Live` / `Beta / Waitlist` / `Roadmap`) | Replaced by the four evidence-based states, shared by the directory and the roadmap |

---

## 7. Preserved but no longer rendered

Nothing has been deleted. These files remain in the tree and still compile:

- `src/data/content.ts` — the original data module, kept as the source of record for the careers and systems migration
- `src/components/DoorCard.tsx` — superseded by `SystemCard`
- `src/components/CareersAccordion.tsx` — superseded by `CareerCard` and the careers divisions
- `src/components/RoleCard.tsx` — superseded by `CareerCard`
- `src/components/ConstellationGraphic.tsx` — inline SVG constellation, unused before this work began; kept as a brand asset
- `SAGITTA_SYSTEMS_SITE_CONTEXT.md` — the original brief (gitignored). Its "Main Doors" table and careers table are superseded

All eight images in `public/` still ship and are indexed in `/media-library`.

---

## 8. Repaired

- **Three broken subdomain links** published site-wide in Phase 1 — `treasury`, `grants`, and `rebalancing` — removed. They appeared in the footer on every page.
- `/legal` and `/status` were linked from the old footer with no routes behind them. Both exist.
- `/contact` pointed off-site to `sagittalabs.com/contact`. There is now a first-party route; the Sagitta Labs link is preserved on `/about` and `/documentation`.
- Navigation was same-page anchors only. It is now real routes with an active-route indicator and a responsive mobile drawer.
- Two live Sagitta properties the site had no record of — `radar.sagitta.systems` and `banking.sagitta.systems` — are now published.

---

## 9. Verification

```
npm run typecheck     # passes
npm run lint          # passes, no warnings
npm run check:content # passes — 10 systems, 10 published records, 13 roles,
                      #          14 roadmap items, 8 statistics, 21 tagged CTAs,
                      #          10 network edges, no product-level attribution
npm run test          # passes — 50 unit assertions
npm run build         # passes — 50 static pages generated, 48 exported
npm run test:export   # passes — 45 assertions against the real export
npm run check:links   # passes — internal links resolved, route count reconciled
```

`npm run verify` runs all six in order. `npm run build:og` is separate and
deliberately outside it — see §2.

### Testing, added in Phase 3

Phase 3 introduced real interactive behaviour, so it introduced tests. **No test
framework was added**: both suites are `node:test`, which ships with Node.

- **`tests/unit/`** — the logic half. The rules the interactive components
  depend on are extracted into pure modules (`src/lib/nav.ts`,
  `src/lib/filters.ts`) precisely so they can be tested without a browser, a DOM
  library, or a React renderer. Covers route matching and `aria-current`, the
  drawer's focus-trap wrap-around at both ends, both filter surfaces including
  an exhaustive check that no facet count over-promises, constellation node and
  edge integrity, state-aware CTA rules, and the naming and taxonomy guards.

- **`tests/export/`** — the rendered half, run against `out/` after the build,
  so it asserts what a browser actually receives. Covers landmarks and heading
  order, navigation ARIA, the constellation's no-hover-only and no-JS
  guarantees, CTA tagging and state-appropriateness, external-link safety, the
  absence of withheld records and alias names, filter semantics, reduced-motion
  CSS, media elements rendering only for verified sources, and Open Graph card
  format and dimensions read from the PNG headers.

Both are compiled through `scripts/lib/load-ts.mjs`, shared with the content
validator, so the tests exercise the same values the pages import.

**Not automated:** visual QA at 390 / 768 / 1440 and manual interaction testing
are the owner's to run. The export suite covers structure, semantics, and
safety; it does not judge whether a layout looks right.
