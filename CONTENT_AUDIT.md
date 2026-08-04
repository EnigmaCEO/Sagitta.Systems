# Content Audit

Every public record on sagitta.systems, classified by what it is, how it is
sourced, and whether it may be published. Companion to `MIGRATION_NOTE.md`.

**Audit date:** 29 July 2026
**Owner decisions applied:** 29 July 2026 (§0)
**Phase 3 revision:** decision 5 reversed; conversion and relationship fields
added (§0, §9). No verified claim, state, price, or statistic changed.
**Enforced by:** `npm run check:content` (`scripts/check-content.mjs`),
`npm run test`, and `npm run test:export`

**2026-07-31 revision:** the system model was corrected and the network's
off-site publishing was added to the record. Read §0.1 before anything below it
— several statements in the 29 July audit are superseded there, and the sections
that follow are preserved as the record of what was true on that date.

---

## 0.1 Corrections and additions — 31 July 2026

### The system model was wrong in three places

| # | Was | Now | Why |
|---|---|---|---|
| A | Selun x402 published as a **system** | A **capability of Selun** | The discovery document is served from the Selun host and advertises Selun's own intelligence. It is a surface of one product, not a second product. `capabilities` in `systems.ts`; x402 promotions route into Selun and carry `capabilitySlugs: ["selun-x402"]` |
| B | Treasury Decision Desk published as a **system** | **Removed entirely** | Owner correction: it is not a Sagitta product. Removed from the directory, the roadmap, the decision-lens mapping, the constellation, the audience router, and all public copy. A sweep in the content check fails the build if the name reappears |
| C | Sagitta Wallet published as **In Development** | **Research Horizon**, typed as a concept-stage system | It is a demo on mocked data with no live wallet, custody path, or funded account. Its lack of promotional material is now the correct state rather than a coverage gap |

The model is now **three core foundations and four attached services**, plus one
concept-stage system, carried in the type layer by `systemKind` and
`parentSystem`:

| Layer | System | Attached to |
|---|---|---|
| Core | Autonomous Allocation Agent | — |
| Service | Selun | AAA |
| Core | Sagitta Continuity Engine | — |
| Service | Sagitta Defense | Continuity Engine |
| Service | Sagitta Radar | Continuity Engine |
| Core | Sagitta Protocol | — |
| Service | Sagitta Banking | Sagitta Protocol |
| Concept | Sagitta Wallet | — |

The public system count is **8**, not 10. The content check asserts the three
counts separately, so a service cannot be silently promoted to a foundation
while the headline number stays right.

### The network publishes off-site, and now says so

The 29 July audit recorded no Sagitta presence on any external channel. That was
accurate about the repository and wrong about the world. Four channels are now
modelled in data, each with the destination that proves it:

| Channel | Account | Home | Records |
|---|---|---|---|
| Paragraph | The Continuity Desk | `paragraph.com/@sagitta` | 3 articles, titles and dates read from the publication's own llms.txt index and RSS feed |
| LinkedIn | Xavier D. Moore | *none resolved* | 2 articles, owner-supplied canonical titles, dates, and URLs |
| YouTube | Sagitta Labs | `youtube.com/@SagittaLabs` | 1 video; title and channel resolved via oEmbed |
| X | @SagittaSystems | `x.com/SagittaSystems` | 4 posts, owner-supplied URLs; 3 with owner-supplied dates |

Nine newsroom records were added: the five articles, the video, and three
verified release milestones. Two editorial desks — SCE Wire and Words from the
Architect — moved from `upcoming` to `active` because they now have published
work behind them. This supersedes decision 6 in §0 for those two desks.

### Verified release milestones added

| Milestone | Date | Note |
|---|---|---|
| Sagitta Protocol launched on Moonbase Alpha Testnet | 2026-04-13 | Separate milestone from Arc |
| Sagitta Protocol launched on Arc Testnet | 2026-05-11 | Separate milestone from Moonbase Alpha |
| Sagitta Radar launched | 2026-07-28 | Supersedes the dated status check below |

This supersedes decision 7 in §0 **for Radar only**: a launch date now exists and
is published as one. The Selun x402 status record remains a dated verification
check, because no launch date has been supplied for it. The earlier Radar status
record has been corrected so it no longer asserts that no launch date exists.

"Testnet" is carried in every Moonbase Alpha and Arc state claim, and a sweep in
the content check fails the build if a claim drops it.

### The Radar figure is now a live rollup, not a dated snapshot

This supersedes decision 9 in §0 and the wording published under it.

**As published now:**

> Over $300B — Infrastructure monitored by Sagitta Radar

The precise figure the product displays moves continuously. It is **not stored
anywhere in this repository** — not in a record, not in an editorial note — and
no as-of date is attached, because the value was never frozen and dating it
would be a fabrication. `PromotionSignal` gained a `reading` field
(`"snapshot" | "rollup"`) to carry the distinction; the original snapshot guard
is unchanged, and a new guard rejects a rollup that carries a date or a precise
moving figure.

### Watch is live

The Watch stage was in its forthcoming state because no Sagitta video was
recorded. One is now: **Introducing Selun**, 0:41, published 19 March 2026 on the
Sagitta Labs channel. The stage switched states on its own — nothing about Selun
is hardcoded in the component. The Sagitta Defense Review programme record is
kept and remains accurate: it is announced and has published nothing, and the
Selun video is not one of its episodes.

### Evidence artifacts are registered and classified

`src/content/artifacts.ts` records four artifacts by what each actually proves.
An architecture brief is not an implemented result and a sample output is not a
customer result; both rules are enforced. **No Mifos or Apache Fineract
integration document exists in this repository**, so none is registered or
described. See PROMOTION_COVERAGE.md for the register.

---

## 0. Identity and owner decisions

### The hierarchy

| Level | Name | What it is |
|---|---|---|
| 1 | **Sagitta Labs** | The emerging umbrella brand for the broader Sagitta portfolio. Currently a brand architecture rather than an incorporated entity |
| 2 | **Sagitta Systems** | The development identity responsible for building and documenting the systems. This site is its public record |
| 3 | **The systems** | Sagitta Radar, SCE, AAA, Selun, Selun x402, Banking, Protocol, Defense, Treasury Decision Desk, Wallet |
| — | **Xavier D. Moore** | Sole public leadership profile for Sagitta Systems |
| — | Orion Gray, Alexander Roth | **Sagitta Labs aliases.** Not Sagitta Systems leadership |

Approved public wording, published on `/about#identity` and `/press#descriptions`:

> Sagitta Systems is the development identity behind Sagitta's continuity,
> allocation, and capital infrastructure. It operates within Sagitta Labs, the
> emerging umbrella for the broader Sagitta network.

### Decisions resolved

| # | Decision | Resolution | Where applied |
|---|---|---|---|
| 1 | Leadership | **Xavier D. Moore only**, owner-confirmed and press-ready | `people.ts`; `/about#leadership`, `/press#leadership`, homepage Founder's Desk |
| 2 | Orion Gray, Alexander Roth | Recorded as **Sagitta Labs aliases**, removed from leadership, press biographies, structured people data, and metadata. Held outside the hub | `people.ts` → `sagittaLabsAliases` (rendered nowhere) |
| 3 | Grants | **Archived** as a historical capability, not a current offering | `publicationState: "archived"`; excluded from current capabilities |
| 4 | Treasury Decision Desk | **In Development, engagement-led**, no standalone operating URL planned | `systems.ts` overview and status evidence |
| 5 | Radar naming | ~~Product name **Sagitta Radar**; **"by Sagitta Labs"** as attribution~~ **Reversed in Phase 3:** the product name is **Sagitta Radar**, published with no adjacent attribution | `attribution` field **removed from the type entirely**; press naming guidance rewritten |
| 6 | Upcoming desks | SCE Wire, Sagitta Podcast, Words from the Architect stay **upcoming** until a first publication exists | `desks.ts`; enforced by the validator |
| 7 | Undated launches | Published as **dated status updates** ("operating as verified 29 July 2026"), never as launch dates | Two newsroom records, with the distinction stated in the body |
| 8 | x402 pricing | **Kept out of evergreen hub copy**; link to the live discovery document | Selun x402 record, x402 statistic, press naming guidance |
| 9 | Radar figure | Preserved **only as a dated snapshot** | `radar-monitored-value` statistic |

**The Radar figure, as published:**

> $328.393M in aggregate exposure monitored at verification on 29 July 2026.
> Live coverage changes continuously.

Prices are now handled the same way throughout: the hub states *how many* plans
or tiers exist and links to the product page for current figures, so the record
does not go stale. The one price still published is the Defense Review's $3,000
flat fee, which is a fixed-scope engagement price rather than a moving figure.

---

## 1. The rules this audit enforces

Every record carries three fields (`src/content/types.ts`):

| Field | Values | Meaning |
|---|---|---|
| `verification.status` | `verified` · `provisional` · `pending` | How well the claim is sourced |
| `publicationState` | `published` · `upcoming` · `draft` · `archived` | Editorial lifecycle |
| `visibility` | `public` · `internal` | Whether it may render at all |

**A record reaches a public feed only if it is `published` AND `public`.** The
validator fails the build if a `pending` record is publicly visible, if a
published record has no source, if a slug reference dangles, if a local asset is
missing, if a date is not `YYYY-MM-DD`, if an `Operating` roadmap item sits
outside `Now`, if a role is `Open` without published compensation terms, if an
`active` desk has no published records (or an `upcoming` desk has some), or if
the public system count is not exactly 8 — asserted as three core foundations,
four attached services, and one concept-stage system, so a service cannot be
silently promoted while the headline number stays right (§0.1).

Content types in use: **System**, **Service / capability**, **Publication**,
**Evidence**, **Press resource**, **Career**, **Person**, **Roadmap item**.

---

## 2. Verified content

Checked against the named source on 29 July 2026.

### Systems — operating states and their evidence

| System | State | Source checked | What the source shows |
|---|---|---|---|
| Sagitta Continuity Engine | Operating | `sce.sagitta.systems`, `SCE/README.md` | Public product surface, portal sign-in, sample report. Site itself reports the critical-incident feed as temporarily unavailable and case-library sync as pending — reflected in the status copy. |
| Sagitta Defense | Operating | `defense.sagitta.systems` | $3,000 flat-fee Starter Defense Review, ~7-day delivery, downloadable sample report, no-key access model |
| Sagitta Radar | Operating | `radar.sagitta.systems`, `SCE/SCE_BUILD_STATE.md` (2026-07-05) | Four priced plans, live alert feed, Oracle/Bridge/LP adapters live |
| AAA | Operating | `aaa.sagitta.systems/sitemap.xml`, `/pricing`, `/research-notes` | 23 public URLs, four pricing tiers, docs, methodology, changelog v1.0→v2.0, four research notes |
| Selun | Operating | `AAA/SelunAgent/README.md`, live host | Allocation wizard, Stripe checkout, onchain USDC settlement, referrals, certified reports |
| Selun x402 | Operating | `selun.sagitta.systems/.well-known/x402` | Live discovery document advertising nine agent-payable endpoints |
| Sagitta Protocol | Public Test | `protocol.sagitta.systems`, whitepaper | Reports v0.1 "Active" on **Moonbase Alpha testnet**. No mainnet, no contract addresses |
| Sagitta Banking | In Development | `banking.sagitta.systems` | Site states "Sagitta Banking is in product development". Only action is a design-partner briefing request |
| Sagitta Wallet | In Development | `wallet.sagitta.systems`, `Wallet/README.md` | Concept/demo page. README: "investor-demo-ready vertical slice … mocked portfolio, onboarding, research, Selun, and reporting data" |
| Treasury Decision Desk | In Development | DNS check | `treasury.sagitta.systems` does not resolve. No public surface |

### Publications — 10 published records

| Record | Desk | Date | Source |
|---|---|---|---|
| Scenario Governance in On-Chain Markets | AAA / Policy Notes | 2026-01-25 | `aaa.sagitta.systems/research-notes` |
| Designing Enforceable Allocation Policy | AAA / Policy Notes | 2026-01-15 | same |
| Authority-Gated Decision Intelligence | AAA / Policy Notes | 2026-01-08 | same |
| Determinism, Discretion, and Trust | AAA / Policy Notes | 2025-12-30 | same |
| Sagitta Defense is operating | Defense Review | 2026-05-06 | git `d3f2cd4` + live service page |
| Sagitta Systems hub published | Continuity Desk | 2026-05-04 | git `c59c4a2` |
| Sagitta Radar: operating as verified 29 July 2026 | Radar Report | 2026-07-29 † | `radar.sagitta.systems` |
| Selun x402: agent endpoints discoverable as verified 29 July 2026 | Selun / Allocation Read | 2026-07-29 † | `/.well-known/x402` |
| Sagitta Protocol whitepaper | Continuity Desk | *undated* | GitBook (document states no version or date) |
| Protocol architecture diagram | Continuity Desk | *undated* | `public/diagram.png` |

† **Verification date, not a launch date.** Neither Radar nor Selun x402 has a
published launch announcement. These records are dated status checks and say so
in their own body copy. The lead story is chosen editorially rather than by
recency, so a status check never becomes the network's headline.

### Official statistics — 8 published, all sourced

Every figure carries metric, scope, source, and last-verified date. All are
Sagitta-published figures; the scope line says so where it matters.

| Figure | Value | Source |
|---|---|---|
| Systems in the network | 10 | this site |
| Starter Defense Review fee | $3,000 | `defense.sagitta.systems` |
| Defense Review delivery | 7 days typical | `defense.sagitta.systems` |
| Critical incidents tracked by SCE | 801 | `defense.sagitta.systems` |
| Aggregate exposure monitored by Sagitta Radar | $328.393M **at 29 Jul 2026** | `radar.sagitta.systems` |
| Sagitta Radar subscription plans | 4 plans | `radar.sagitta.systems` |
| AAA access tiers | 4 tiers | `aaa.sagitta.systems/pricing` |
| Agent-payable x402 endpoints | 9 | `/.well-known/x402` |

> **The Radar figure is a snapshot, not a standing claim.** It is published as
> "$328.393M in aggregate exposure monitored at verification on 29 July 2026.
> Live coverage changes continuously," and its verification note requires the
> date to travel with it.

**Moving prices are no longer published as figures.** Radar plan prices and AAA
tier prices were published as ranges in the first pass; they now report the
*number* of plans and link to the product page. The Defense Review's $3,000 is a
fixed-scope engagement price and stays.

---

## 3. Provisional content

**None.** Both records that were provisional after the first pass have been
resolved by owner decision:

- **Leadership** — was two unconfirmed founder-operator biographies. Now one owner-confirmed, press-ready profile (Xavier D. Moore), sourced to owner confirmation plus `xaviermoore.com`. The previous two names are recorded as Sagitta Labs aliases in `sagittaLabsAliases` and render nowhere.
- **Grants** — was a preserved description with no surface to check it against. Now archived as a historical capability, which is itself the confirmed fact.

The validator fails the build if a published leadership profile is anything
other than `verified`, and if either alias name reappears in the `people`
collection.

---

## 4. Pending facts — deliberately not published

### Careers

Of 13 preserved roles, the previous listing published only title, description,
and remote location. These fields remain "Not yet published" and render as such:

- **First expected deliverable** — all 13 roles
- **Required experience** — all 13 roles
- **Compensation structure** — 12 of 13 (the Sales Engine Operator's $1,000 per closed Defense Review is the exception)
- **Updated date** — all 13

### Press resources — the "available on request" list

Not published, tracked here, surfaced on `/press` as a single line rather than
nine pending cards:

- Company fact sheet (entity details, founding date, headcount, location)
- Approved photography
- Per-system one-sheets
- Formal brand guidelines
- Press-kit download package

### Legal

Five notices remain unpublished on `/legal` (terms, privacy, cookies,
disclaimer, trademarks). Publishing unreviewed legal text would be worse than
publishing none.

### Dates

Six of ten published records carry no publication date because their sources
state none. They render "No published date" rather than an inferred one.

---

## 5. Broken or unavailable sources — found and fixed

Three hosts published as operating URLs in Phase 1 **do not resolve**:

| Host | Was published as | Now |
|---|---|---|
| `treasury.sagitta.systems` | Treasury Decision Desk operating URL, footer link, status link | URL removed. System downgraded Public Test → In Development |
| `grants.sagitta.systems` | Grants operating URL, footer link | URL removed. Grants reclassified as a capability with no public surface |
| `rebalancing.sagitta.systems` | Rebalancing operating URL, footer link | URL removed. Rebalancing reclassified as a capability of Selun / Selun x402 |

The footer's "Operating systems" column was generated from every `operatingUrl`,
so all three were live broken links on every page of the site. `networkLinks` is
now derived only from destinations that exist.

Two hosts were found that Phase 1 had **no record of**, both live and now
published: `radar.sagitta.systems` and `banking.sagitta.systems`.

---

## 6. Records hidden from public display

| Record | Type | Why hidden |
|---|---|---|
| 7 Phase 1 desk placeholders | Publication | Invented to exercise templates. **Deleted** — they were never real records |
| `sagitta-protocol-workstream` | Career | Not a real listing; created to fill an empty division. Retained as `draft` / `internal` |
| `sagitta-wallet-workstream` | Career | Same |
| Orion Gray, Alexander Roth | Person | Sagitta Labs aliases, not Sagitta Systems leadership. Moved out of the `people` collection entirely into `sagittaLabsAliases`, which nothing renders |
| Grants | Capability | Archived by decision. Its record and route remain; it is excluded from current capabilities and from every system page's supporting-capability list |

The career and alias records are kept rather than deleted so the decisions stay
inspectable. Neither generates a route or reaches metadata. Career pages dropped
from 15 to 13.

---

## 7. Open items

All eight decisions raised in the first pass are resolved (§0). What remains is
maintenance, not ambiguity:

1. **The Radar snapshot will age.** `$328.393M at 29 July 2026` is correct today and will drift. It carries its date, so it stays accurate as a historical reading — but re-verify and re-date it rather than leaving it to imply a current figure.
2. **Three desks are still upcoming.** SCE Wire, Sagitta Podcast, and Words from the Architect flip to `active` on their first publication. The validator enforces the flip in both directions, so the desk state cannot drift from reality.
3. **The Founder's Desk is an intentional empty state.** It says no dispatch has been published and points at the editorial schedule. Publishing to Words from the Architect fills it.
4. **Career detail fields remain unpublished** — first deliverable, required experience, and compensation for 12 of 13 roles (§4).
5. **Five press categories remain on request**, and five legal notices remain undrafted (§4).
6. **A Sagitta Labs page does not exist.** If one is built, the aliases in `sagittaLabsAliases` are where its leadership copy should come from — deliberately, not by accident.
7. **No audio or video has been published.** The newsroom's media components ship and are validated, but render nowhere. The Sagitta Podcast desk flips to `active` on its first recording, and that record is where the first `media` block belongs.
8. **The analytics hooks are inert.** `data-cta` identifiers are emitted throughout and nothing reads them. Wiring a vendor to them is a Phase 4 decision, not an accident waiting to happen.

---

## 8. What the validator checks

`npm run check:content` compiles `src/content/` and asserts:

- Exactly 8 public systems — 3 core, 4 services, 1 concept-stage, asserted separately; Selun x402, Grants, and Rebalancing are capabilities, not systems
- Every family has public systems; every system has family, state, problem, overview, availableToday, audience, status evidence
- Capabilities carry no operating state and reference only real systems
- Published newsroom records have title, slug, summary, desk, media type, author, and either an external destination with a label or internal body content
- No record whose slug or title contains "placeholder" is publicly published
- Desk `active`/`upcoming` state matches published-record counts exactly
- Public roles have a supporting system and hiring contact; `Open` roles have published compensation
- Roadmap items have a valid state, horizon, and related system; `Operating` items sit in `Now`; every horizon is populated
- Every statistic has metric, value, scope, source, and last-verified date
- No `pending` record is publicly visible; no published record lacks a source
- Every slug reference resolves; every local asset exists in `public/`; every date is `YYYY-MM-DD`
- Exactly one public leadership profile exists, and it is `verified`
- Neither Sagitta Labs alias appears in the `people` collection, and the alias record itself is not empty
- Grants is `archived` and no archived capability appears in the current-capabilities list

### Added in Phase 3

**Naming and identity**

- No system record carries an `attribution` field
- No publicly renderable string matches `Radar by Sagitta Labs`, `Sagitta Radar by Sagitta Labs`, `Developed by Sagitta Systems`, or `Sagitta <product>, by Sagitta Labs`. `verification.note` and `verification.source` are excluded from the sweep, since they are the editorial record of why the rule exists and may quote the wording it forbids. One record is exempt by id — the press room's naming guidance, whose purpose is to quote the form in order to forbid it
- Sagitta Labs is not described as an incorporated entity

**Conversion**

- Every public system has a primary action with an id, label, destination, type, and availability
- A system that is not `Operating` offers no `open-product` action
- An `Operating` system's primary action is not merely `documented`
- No action label is generic (`Learn more`, `Read more`, `Click here`, …)
- An absolute destination is marked external; an internal one is not
- Every action identifier is unique across systems and capabilities
- An archived capability carries no call to action

**Relationships**

- Every declared connection names a real system, does not point at itself, carries a valid strength, and states a reason

**Media**

- A populated `media` block names a real file or an approved embed, and belongs to a `verified` record

### Added at launch — the discovery layer

`npm run check:links` now also asserts, against the real export:

- `out/robots.txt` and `out/sitemap.xml` were both written
- Every `<loc>` in the sitemap resolves to an exported page — a sitemap of 404s is worse than no sitemap, since it is the one file a crawler treats as authoritative
- The sitemap names every required route, so a page cannot ship undiscoverable
- The route-count reconciliation **fails the build** on a mismatch rather than printing one, and accounts for metadata routes that export as `.txt` and `.xml` instead of HTML

`src/app/sitemap.ts` derives every entry from the same collections the routes
themselves are generated from, so an unpublished, internal, or archived record
leaves the sitemap in the same commit that removes its route. Undated records
omit `lastmod` rather than substituting the build date — the same rule §4
applies to publication dates.

### Added at launch — structured data

`src/lib/jsonld.ts` publishes an `Organization`, a `WebSite`, one `Person`, and
seven `Article` nodes. Every value is read from the content layer, so nothing is
asserted to a crawler that a reader cannot also see. Three omissions are
decisions rather than gaps, and `npm run test:export` fails the build if any of
them is reversed by accident:

| Not emitted | Why |
|---|---|
| `parentOrganization` for Sagitta Labs | Labs is an umbrella brand and explicitly not an incorporated entity (§0). A parent-organisation edge would publish a corporate relationship the record does not support |
| The Sagitta Labs YouTube channel in `sameAs` | `sameAs` asserts *the same entity*. The channel is Labs', not Systems'; listing it would conflate the two identities the rest of this audit separates. `sameAs` carries X and Paragraph only |
| `JobPosting` on the 13 roles | Twelve publish no compensation, first deliverable, or required experience by decision (§4). Emitting the type would push the site to advertise exactly the fields it deliberately withholds |

**`externalUrl` was carrying two meanings, and now says which.** On the
Paragraph, LinkedIn, YouTube, AAA research-note, and whitepaper records it is
the canonical publication — the full work is there and this page is the
network's record of it. On the status checks, the launch milestones, and the
architecture diagram it is a *reference*: the product surface the record is
about, while the record itself is original writing canonical to this site. The
new required field `externalRole` (`"canonical" | "reference"`) makes the
distinction explicit, and the content check fails the build if a record with an
`externalUrl` does not declare one.

Nothing renders differently either way. What depends on it is `Article` markup,
which is emitted only for `reference` records: claiming authorship on a page
whose canonical is somebody else's competes with the real publication. Twelve
records are canonical elsewhere and carry no `Article`; seven are canonical here
and do. The architecture diagram is canonical here but undated, so it carries
none either — `datePublished` is not inferred from the build date.

---

## 9. Phase 3 — content-layer additions

Phase 3 added four fields to the content layer. None of them asserts anything
new; each makes something already published machine-readable.

| Field | On | What it holds | Why it is not a new claim |
|---|---|---|---|
| `primaryAction` / `secondaryAction` | `SystemRecord`, `CapabilityRecord` | Label, destination, type, availability, audience, note, analytics id | Every destination was already published on the record as `operatingUrl`, `documentationUrl`, or an evidence link |
| `connections` | `SystemRecord` | Related system, reason, structural or contextual | Every reason restates a relationship that record's own `overview` copy already states |
| `media` | `NewsroomEntry` | Audio or video source, delivery, duration, poster, transcript | **Empty on every record.** The components exist; no recording has been published, and none was invented to demonstrate them |
| `shortName`, `token`, `motif` | `SystemFamily` | Family visual identity | Presentation metadata, not a claim |

`attribution` was **removed** from `SystemRecord`.

### The one price still published

Unchanged from Phase 2: the Defense Review's **$3,000 flat fee**, which is a
fixed-scope engagement price rather than a moving figure. It now also appears as
the qualifier on Sagitta Defense's primary action.

Moving prices remain unpublished, and an export test now enforces it — the build
fails if `$29`, `$99`, `$149`, `$79/mo`, or `$499/mo` appears anywhere in the
rendered site.

### Open Graph assets — provenance

Ten cards in `public/og/`, generated by `npm run build:og` from this site's own
design tokens and content. They contain typography, family accents, and
geometric motifs only: no third-party imagery, no product screenshot, no
depiction of an interface that does not exist, and no figure that moves. The
generator is an authoring tool run by hand; its output is committed and the
build does not invoke it.

---

## 10. Phase 4 — the promotion layer

A new collection, `src/content/promotions.ts`, drives the homepage. It adds no
facts: every record points at a launch, figure, document, or interface already
audited in the sections above.

### Promotions published — 13 active of 15

| Format | Active | Subject | Source |
|---|:-:|---|---|
| Launch or milestone | 2 | Defense began operating (2026-05-06); Protocol v0.1 on Moonbase Alpha | `/newsroom/sagitta-defense-now-operating`; `protocol.sagitta.systems` |
| Alert or status update | 2 | Radar coverage verified; x402 endpoints verified | `radar.sagitta.systems`; `/newsroom/selun-x402-operating-status-july-2026` |
| Live metric or signal | 4 | $328.393M under monitoring; 801 tracked incidents; 9 x402 endpoints; 4 AAA tiers | The four Sagitta surfaces that publish them |
| Product interface or demonstration | 1 | Selun allocation wizard | `selun.sagitta.systems/wizard` |
| Research report or data brief | 2 | Protocol whitepaper; architecture diagram | GitBook; `public/diagram.png` |
| Article or founder perspective | 2 | Two AAA research notes | `aaa.sagitta.systems/research-notes` |

Archived, real, held for a later rotation: the Sagitta Wallet demonstration and
the 2026-05-04 hub launch.

### Figures re-used, not re-derived

Every number on the homepage is one of the audited statistics in §2 of this
document, published with the same value, the same source, and the same
verification date. The two that move — the Radar exposure figure and the SCE
incident count — render with `Snapshot as of 29 Jul 2026` beside them, and the
validator fails the build if a signal loses its as-of date.

### Formats deliberately empty

Seven formats hold no record because the material does not exist: use case or
market reaction, social post, video episode, audio briefing, case study, external
coverage, and event or presentation. No Sagitta account on X or LinkedIn, no
YouTube channel, no Paragraph publication, and no recorded episode is referenced
anywhere in this repository or on any linked Sagitta property. The stages for
those formats are built and render nothing.

No market metric is quoted anywhere. A Fear & Greed reading, a portfolio
response, or any other third-party market figure would need a live source this
repository does not have.

### Media provenance

Promotional imagery is limited to assets already in `public/`: the Defense, SCE,
and Selun marks, the protocol architecture diagram, and the constellation
graphic. No product screenshot exists and none is simulated — each record states
its media kind, and the validator rejects a record claiming to be a
`product-screenshot`. Approved interface captures for SCE, Radar, AAA, and Selun
are the open asset request, recorded in
[`PROMOTION_COVERAGE.md`](PROMOTION_COVERAGE.md).

### Withheld from public display

| Record | Type | Why hidden |
|---|---|---|
| `systems-count` | Statistic | Accurate and unchanged, held `internal`. The count was being restated as a slogan on five routes; `/systems` owns it. |
| `wallet-demonstration` | Promotion | Real, archived. One product moment renders at a time and Selun is Operating where Wallet is In Development. |
| `hub-published` | Promotion | Real, archived. Superseded as current network news by the Defense launch. |
