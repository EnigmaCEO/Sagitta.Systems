# Promotion coverage inventory

Internal editorial planning record for the Sagitta Systems front page. It is not
rendered publicly and nothing on the homepage displays this matrix.

Compiled 2026-07-29, rewritten 2026-07-31, and updated 2026-08-04 against the repository content
layer, the live Sagitta surfaces, and the network's off-site publishing —
`src/content/systems.ts`, `src/content/newsroom.ts`, `src/content/press.ts`,
`src/content/promotions.ts`, and `src/content/artifacts.ts`.

`scripts/check-content.mjs` fails the build if a promotional format or a decision
lens exists in the model but is missing from this file, so a new format cannot be
added to the type layer and left unplanned.

## What changed on 2026-08-04

The Continuity Desk published a fourth article, **The Missing Layer in Crypto
Security: Continuity Defense**, and it was staged on the lead carousel at slide
three. Both candidate stages were at their hard cap, so this was a rotation
rather than an addition:

- **The Three Deaths Doctrine moved from the carousel to the network desk.** It
  is not superseded by the new article and is not demoted on merit — it is the
  older and more foundational piece, and it keeps a homepage slot for that
  reason. What changed is which article is the current reason to enter SCE.
- **What a Public-Surface Authority Review Actually Proves is archived from the
  homepage.** The desk renders four rows and the doctrine took the fourth. The
  article is unchanged, verified, and still canonical at its newsroom record.

The new article is the first promotion whose newsroom record restates external
facts. It turns on Cosmos advisory **ASA-2026-002**: fifteen chains ran the
affected ICS20 precompile code, six had the feature disabled, most of the
remainder mitigated before exploitation, and one was exploited first for an
estimated ~$7M. Those figures are not taken on the article's authority — they
are corroborated against the official `cosmos/evm` advisory
(`GHSA-54gx-3cgr-7mfm`), which states the loss as an estimate, and the record
publishes it as an estimate for that reason. The carousel promotion itself
quotes no figure; the numbers live only on the newsroom record, next to their
source.

## What changed on 2026-07-31

The previous version of this document was written when the repository recorded
no Sagitta presence on any external channel. It stated, correctly at the time,
that there was "no Sagitta Systems account on X" and "no Sagitta video, YouTube
channel, or episode destination." Both statements were wrong about the world
rather than about the repository: the accounts and the publications existed and
had simply never been recorded here. They now are.

Three corrections to the system model were applied in the same pass:

- **Selun x402 is a capability of Selun**, not a system. It has no column below.
  Its content is assigned to Selun and carries x402 as capability metadata.
- **The Treasury Decision Desk has been removed entirely.** It is not a Sagitta
  product. Phrases like *treasury decision* and *allocation decision* remain in
  use as ordinary decision language.
- **Sagitta Wallet is concept-stage** (Research Horizon). It is marked **N/A**
  rather than **P** throughout: having no promotional material for a
  concept-stage system is the correct state, not a coverage gap.

## The system model

Three core foundations, four services attached to them, one concept-stage
system. The relationship is carried in the type layer by `systemKind` and
`parentSystem`, and asserted by the content check.

| Layer | System | Relationship |
| --- | --- | --- |
| Core | Autonomous Allocation Agent | Allocation and policy foundation |
| Service | Selun | Service built on AAA |
| Core | Sagitta Continuity Engine | Continuity foundation |
| Service | Sagitta Defense | Service attached to the Continuity Engine |
| Service | Sagitta Radar | Service attached to the Continuity Engine |
| Core | Sagitta Protocol | Financial infrastructure foundation |
| Service | Sagitta Banking | Service attached to Sagitta Protocol |
| — | Sagitta Wallet | Concept stage, attached to no foundation |

All seven of the first group are treated as systems in the promotional layer:
each has its own identity, activity, audience, and destination.

## Readiness states

| State | Meaning |
| --- | --- |
| **Ready** | A real current promotional asset and a real destination both exist. |
| **Evidence-ready** | Real source material exists and can become a promotion without inventing anything. |
| **Production needed** | The format fits the system, but the asset still has to be produced. |
| **Not useful** | The format adds little for that system, usually because there is no public surface or no real subject. |

Codes used in the matrix: **R** Ready · **E** Evidence-ready · **P** Production
needed · **N** Not useful · **—** not applicable (concept stage).

## Systems

| Code | System | Kind | Operating state |
| --- | --- | --- | --- |
| SCE | Sagitta Continuity Engine | Core | Operating |
| DEF | Sagitta Defense | Service (SCE) | Operating |
| RAD | Sagitta Radar | Service (SCE) | Operating |
| AAA | Autonomous Allocation Agent | Core | Operating |
| SEL | Selun (incl. the x402 capability) | Service (AAA) | Operating |
| BNK | Sagitta Banking | Service (Protocol) | In Development |
| PRO | Sagitta Protocol | Core | Public Test |
| WAL | Sagitta Wallet | Concept | Research Horizon |

Operating states are taken from the system records and are not restated
promotionally: a promotion for a Public Test or In Development system offers a
state-appropriate action or it is not published.

## Format × system matrix

| # | Format | SCE | DEF | RAD | AAA | SEL | BNK | PRO | WAL | Ready | Evidence-ready |
| --- | --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 1 | Live metric or signal | R | E | R | R | R | N | E | — | 4 | 2 |
| 2 | Alert or status update | E | R | R | E | R | E | R | — | 4 | 3 |
| 3 | Launch or milestone | E | R | R | R | R | N | R | — | 5 | 1 |
| 4 | Product interface or demonstration | E | E | E | E | R | N | R | — | 2 | 4 |
| 5 | Use case or market reaction | P | P | P | P | P | N | P | — | 0 | 0 |
| 6 | Article or founder perspective | R | R | E | R | E | R | E | — | 4 | 3 |
| 7 | Research report or data brief | R | R | E | R | E | R | R | — | 5 | 2 |
| 8 | Social post | E | R | E | R | R | E | R | — | 4 | 3 |
| 9 | Video episode | P | P | P | E | R | P | R | — | 2 | 1 |
| 10 | Audio briefing or podcast | P | P | P | P | P | N | P | — | 0 | 0 |
| 11 | Case study, result, or testimony | P | P | P | P | P | P | P | — | 0 | 0 |
| 12 | Press or external coverage | P | P | P | P | P | P | P | — | 0 | 0 |
| 13 | Event, interview, or presentation | P | P | P | P | P | P | P | — | 0 | 0 |

**Totals: 29 Ready, 19 Evidence-ready.**

Sagitta Wallet contributes no cell in either direction. That is deliberate and
is not a shortfall — see the note above.

## Ready register

Every Ready cell, with the asset or destination behind it.

### 1 — Live metric or signal

| System | Subject | Source or destination | On the homepage |
| --- | --- | --- | --- |
| RAD | Over $300B infrastructure monitored — **live rollup** | `radar.sagitta.systems` | Yes — signal strip |
| SCE | 801 critical incidents in the tracked set — snapshot, 2026-07-29 | `defense.sagitta.systems` | Yes — signal strip |
| SEL | Nine agent-payable endpoints advertised — snapshot, 2026-07-29 | `selun.sagitta.systems/.well-known/x402` | Yes — signal strip |
| AAA | Four access tiers, starting with free Observer Access — **live rollup** | `aaa.sagitta.systems/pricing` | Yes — signal strip |

Two kinds of figure run here and they are not interchangeable. A **snapshot** is
a moving value read once: it is published with the date it was read and labelled
a snapshot. A **rollup** is a standing figure the operating surface itself keeps
current: it carries no as-of date, because it was never frozen and dating it
would be an invention.

The Radar figure is a rollup published at an owner-approved threshold. The
precise figure the product displays moves continuously and is **not stored
anywhere in this repository** — not in a record, not in an editorial note. Both
the content check and the unit tests fail if a precise moving exposure figure
reappears.

Per-call x402 prices, Radar plan prices, and AAA tier prices move and are read on
the product pages. They are never quoted as promotional figures.

### 2 — Alert or status update

| System | Subject | Source or destination | On the homepage |
| --- | --- | --- | --- |
| DEF | Defense Reviews available, fixed scope | `defense.sagitta.systems` | Via the launch promotion |
| RAD | Coverage verified across oracle, bridge, and liquidity-pool pillars (2026-07-29) | `radar.sagitta.systems` | No — archived behind the dated launch |
| SEL | x402 discovery document verified, nine endpoints (2026-07-29) | `/newsroom/selun-x402-operating-status-july-2026` | No — archived; the same fact runs as a signal |
| PRO | v0.1 reported Active on Moonbase Alpha Testnet | `protocol.sagitta.systems` | Via the launch promotions |

### 3 — Launch or milestone

| System | Subject | Date | Source or destination | On the homepage |
| --- | --- | --- | --- | --- |
| RAD | Sagitta Radar launched | 2026-07-28 | `/newsroom/sagitta-radar-launched` | Yes — lead carousel, slide 1 |
| DEF | Sagitta Defense began operating | 2026-05-06 | `/newsroom/sagitta-defense-now-operating` | Yes — lead carousel, slide 2 |
| PRO | Launched on Arc Testnet | 2026-05-11 | `/newsroom/sagitta-protocol-launched-on-arc-testnet` | Yes — lead carousel, slide 4 |
| PRO | Launched on Moonbase Alpha Testnet | 2026-04-13 | `/newsroom/sagitta-protocol-launched-on-moonbase-alpha-testnet` | No — archived behind the Arc launch |
| AAA | Launch announced on X | 2026-02-07 | `x.com/SagittaSystems/status/2020219494086373390` | Yes — network desk |
| SEL | Launch announced on X | 2026-02-22 | `x.com/SagittaSystems/status/2025629787876630993` | No — archived |

The two Protocol testnet launches are **separate milestones** and are never
merged. Every Protocol state claim carries "Testnet", enforced by a sweep in the
content check.

Network-level: the hub launch of 2026-05-04 is real and on the record, archived
since the Radar and Defense launches supersede it as current news.

### 4 — Product interface or demonstration

| System | Subject | Source or destination | On the homepage |
| --- | --- | --- | --- |
| SEL | Guided allocation wizard, card and onchain USDC settlement | `selun.sagitta.systems/wizard` | Yes — product moment |
| PRO | Wallet-connect interface and portfolio view on testnet | `protocol.sagitta.systems` | Via the launch promotions |

No approved interface capture exists for any Sagitta product. The product moment
therefore renders the Selun wizard's **own steps, controls, and option sets**,
read from the production interface's constants, and captions itself as a
rendering rather than a session capture. No allocation, holding, percentage, or
portfolio value is shown, because each run produces its own. Producing approved
captures for SCE, Radar, and AAA remains the highest-value asset gap on this
list.

### 6 — Article or founder perspective

| System | Subject | Date | Source | On the homepage |
| --- | --- | --- | --- | --- |
| SCE | The Missing Layer in Crypto Security: Continuity Defense | 2026-08-04 | Paragraph | Yes — lead carousel, slide 3 |
| AAA | A Risk Policy Is Only Real When It Constrains the Decision | 2026-07-30 | LinkedIn | Yes — lead carousel, slide 4 |
| BNK | The Account-to-Treasury Lifecycle Behind an Onchain Financial Product | 2026-07-28 | LinkedIn | Yes — network desk lead |
| SCE | The Three Deaths Doctrine | 2026-06-30 | Paragraph | Yes — network desk |
| SCE | Signing Authority Is the Real Custody Layer | 2026-06-04 | Paragraph | Yes — network desk |
| DEF | What a Public-Surface Authority Review Actually Proves | 2026-05-26 | Paragraph | No — archived from the homepage 2026-08-04 |
| AAA | Four research notes (2025-12-30 to 2026-01-25) | — | `aaa.sagitta.systems/research-notes` | No — archived behind the newer articles |

Canonical titles are recorded verbatim. Where a stage cannot set one well, an
approved `displayHeadline` carries a shorter form and the canonical title stays
available to the reader — currently only the 68-character Banking title, in the
desk's lead slot. The content check rejects a display headline that is not
actually shorter than the canonical one.

Xavier D. Moore's institutional profile lives on `/about` and does not appear on
the homepage. His name appears there only as the byline of the two articles he
wrote, which is attribution rather than a biography.

### 7 — Research report or data brief

| System | Subject | Source or destination | On the homepage |
| --- | --- | --- | --- |
| BNK | Account-to-treasury lifecycle architecture | `banking.sagitta.systems` | Yes — cinematic feature |
| DEF | Sample Defense Review report (PDF) | `defense.sagitta.systems/sample-review.pdf` | No — archived; see the artifact register |
| PRO | Sagitta whitepaper | `sagitta-protocol.gitbook.io/sagitta-whitepaper` | No — archived; canonical on the system page |
| PRO | Protocol architecture diagram | `/diagram.png` | No — archived; canonical in the media library |
| AAA | Allocation methodology and research programme | `aaa.sagitta.systems/methodology` | Via the article promotions |

### 8 — Social post

| System | Subject | Date | Destination | On the homepage |
| --- | --- | --- | --- | --- |
| AAA | AAA launch | 2026-02-07 | `x.com/SagittaSystems/status/2020219494086373390` | Yes — network desk |
| SEL | Selun launch | 2026-02-22 | `x.com/SagittaSystems/status/2025629787876630993` | No — archived |
| DEF | Sagitta Defense launch | 2026-05-06 | `x.com/SagittaSystems/status/2051978339867369705` | No — archived; Defense already leads |
| PRO | Protocol continuity | **undated** | `x.com/SagittaSystems/status/2070693476400849039` | No — archived, see below |

X publishes no machine-readable metadata that could be read here, so **no post
text, image, or engagement figure is reproduced anywhere on the site**. Each
promotion states what the post is, in Sagitta's own words, and links to the exact
public post.

The Protocol continuity post is real and its URL resolves, but no date could be
verified for it from any source. It is held out of the rotation for exactly that
reason: the network desk renders a date on every row, and an undated row there
would read as a missing fact rather than an honest omission.

### 9 — Video episode

| System | Subject | Date | Destination | On the homepage |
| --- | --- | --- | --- | --- |
| SEL | Introducing Selun — 0:41 | 2026-03-28 † | `youtube.com/watch?v=SHecO67AqfM` | Yes — Watch, playing |
| PRO | Sagitta Protocol Overview \| Trustless Wealth Management Infrastructure — no runtime published | 2026-04-18 | `youtube.com/watch?v=PabWDk6I-HI` | Yes — Watch queue |

Both videos are the complete contents of the Sagitta Labs channel, enumerated
from its own RSS feed. Titles and channel names were resolved from YouTube's
oEmbed endpoint. Posters are YouTube's own thumbnails for each video id, stored
locally so the build does not depend on a third-party host and no request
reaches YouTube before a reader presses play. No view count is published for
either, because none was read. No runtime is recorded for the Protocol video,
because oEmbed does not return one.

† **Date conflict, resolved 2026-08-02.** The owner had supplied 2026-03-19 for
the Selun video and the channel's own RSS feed gave 2026-03-28T23:05:48Z — nine
days later. Resolved by owner decision in favour of the feed: **2026-03-28 is
the publication date and is what the site publishes.** The earlier date was a
production date, not a publication date, and is now held only in the
verification notes on the newsroom record and the promotion. Nothing on the site
renders it. The site and the source it links to therefore state the same date,
which is the rule the rest of this inventory follows.

The Watch stage plays both videos in place. The embed is created on the first
click and uses the privacy-enhanced `youtube-nocookie.com` host, so the page
makes no third-party request on load — verified in the browser at 0 requests
before play, then 25 after. The poster is a real anchor to the video's own page
in the static HTML, and so is every queued item, so the stage still reaches both
videos with scripting unavailable. The embed id is validated against the
promotion's own destination, so the video that plays and the video a reader is
sent to can never be different.

Neither video is a Sagitta Defense Review episode and neither is presented as
one. The Defense Review programme record in `src/content/watch.ts` remains
accurate and unpublished, and the Watch stage keeps both states so a truthful
forthcoming item can render there again.

## Evidence artifacts

Registered in `src/content/artifacts.ts` and classified by what each actually
establishes. The classifications are not interchangeable and the content check
enforces the distinction.

| Artifact | Kind | System | What it proves | Public destination |
| --- | --- | --- | --- | --- |
| Sagitta Banking account-to-treasury lifecycle | Architecture brief | BNK | A specified control surface and rail. **Not** a delivered integration | `banking.sagitta.systems` |
| Sample Defense Review report | Sample output | DEF | The structure of the deliverable, on illustrative input. **Not** a customer result | `defense.sagitta.systems/sample-review.pdf` |
| Protocol capital architecture diagram | Architecture brief | PRO | How capital moves through the protocol's components | `/diagram.png` |
| Sagitta whitepaper | Research document | PRO | The architecture, doctrine, and capital-flow design, published in full | GitBook |

Notes on what is deliberately absent:

- **No Mifos or Apache Fineract integration document exists in this
  repository.** The Banking product surface references Fineract and a Fineract
  checkout is present in the wider projects tree, but no integration document
  was found to classify, so none is registered and none is described.
- **No page count is recorded for the sample review PDF.** A count has to be
  read from the file, not estimated, and it was not read.
- **No preview is registered for the sample review PDF.** A preview is only ever
  rendered from the artifact itself; a system mark would not be a page of it.
  The content check rejects a `system-mark` preview outright.
- **No `executed-result` artifact exists.** None has been published.

## Production gaps

Formats that fit but have no asset yet, with what is actually blocking each one.

| Format | Blocker |
| --- | --- |
| Use case or market reaction | Requires a real market condition and a published portfolio response read from a live surface. Neither is captured anywhere in the repository, so no market metric may be quoted. |
| Audio briefing or podcast | The Sagitta Podcast desk exists and has published nothing. No recording exists. |
| Case study, result, or testimony | Would require a client engagement result and that client's consent. Nothing is published. The Defense sample report is a specimen and is classified as one. |
| Press or external coverage | The press room records an explicit nil return: no coverage or interviews to date. Not producible unilaterally. |
| Event, interview, or presentation | No event, interview, or presentation is recorded. |
| Video episodes beyond Selun | One video is published. Nothing else is recorded on the channel. |

## Decision lens mapping

Every Ready and Evidence-ready item maps to at least one lens. The mapping is
editorial routing: it decides which system a promotion hands the reader to, and
is never rendered as a taxonomy.

| Decision lens | Contributing systems | Ready | Evidence-ready |
| --- | --- | :-: | :-: |
| Fund allocation | AAA, Selun | 6 | 3 |
| Policy governance | AAA, Sagitta Protocol | 7 | 3 |
| Sector portfolios | Selun, AAA | 5 | 3 |
| DeFi health and alerts | Sagitta Radar, Sagitta Continuity Engine | 7 | 3 |
| Protocol readiness | Sagitta Continuity Engine, Sagitta Defense | 8 | 3 |
| CVE defense | Sagitta Defense, Sagitta Continuity Engine, Sagitta Radar | 11 | 5 |
| Onchain banking | Sagitta Banking, Sagitta Protocol | 6 | 3 |
| Crypto functionality | Selun, Sagitta Protocol | 7 | 3 |

Counts are per lens across all formats, and an item contributing to more than one
lens is counted under each. `crypto-functionality` previously routed through
Selun x402 and Sagitta Wallet; it now routes through Selun and Sagitta Protocol,
because x402 is a Selun capability and Wallet is concept-stage.

## Rotation notes

- Four to six formats are active at once. Six are: launch or milestone, article,
  live signal, product interface, video episode, and research report. The rest
  stay in the model and enter later rotations.
- The lead carousel holds three to five editorially selected promotions. Order is
  set by `priority`, never by date — the Radar launch leads, and the most recent
  item on the page (the 4 August article) sits third.
- The network desk is composed as one lead plus up to three supporting rows —
  four items, across at least three verified external channels. Four is a hard
  cap in the content check, not a preference: the page renders four, so a fifth
  promotion would pass validation and then never appear.
- The Watch stage holds up to four videos: one plays at full scale and the rest
  queue beside it. Both real channel videos are staged.
- One product moment renders at a time. Selun holds it because it is Operating;
  the Wallet demonstration is archived behind it and is not a gap.
- Seventeen of thirty-one promotions are active. The remainder are archived:
  verified, real, and held back editorially rather than for want of evidence.
- A snapshot figure is republished only with a re-read date. A rollup is
  republished only at a threshold, and never with a date.
