# Promotion and authority review

A review pass over sagitta.systems as a *promotional* and *authority-building*
surface, rather than as a content-accuracy exercise. Accuracy is already well
covered by `CONTENT_AUDIT.md` and the coverage model by
`PROMOTION_COVERAGE.md`; this document deliberately does not re-audit either.

Reviewed 2026-08-02 against the repository content layer, the page templates,
`src/lib/jsonld.ts`, `src/lib/metadata.ts`, the metadata routes, and the
component tree.

**The one-line summary.** The site is unusually disciplined about *not
overclaiming*, and that discipline has been so thoroughly applied that it now
suppresses claims Sagitta is entitled to make. The remaining authority gaps are
almost all structural rather than editorial: everything published has Sagitta as
its subject, the depth lives off-domain, there is no way for a reader to come
back, and the promotional machinery is instrumented but never measured.

**Scope decision, 2026-08-02.** Third-party validation — customers, coverage,
testimony, references — is **out of scope** by owner decision. There are no
customers and no coverage, and none can be manufactured. §1 has been rewritten
accordingly: it no longer recommends pursuing external validation, and instead
addresses the thing that is actually within reach. Every other finding stands
unchanged and none of them depended on it.

**Implementation status, 2026-08-02.** An immediate pass closed most of this
list. Shipped: the newsroom RSS feed plus per-desk feeds and autodiscovery (§3);
the four AAA research notes repatriated with the hub as canonical, and every
remaining stub replaced with a full treatment (§2); analytics connected to the
existing CTA taxonomy, with a published measurement disclosure on `/legal` (§4);
`founder`, `VideoObject`, and `BreadcrumbList` emitted (§7); the LinkedIn profile
resolved and attached to the `Person` rather than the `Organization` (§8); the
Selun date conflict resolved in favour of the channel's own date (§9); and press
and commercial enquiry separated into distinct paths on `/contact`, with the
backend disclaimer removed (§5). A 120-word minimum on published record bodies
now fails the build, so the stub pattern cannot return.

Still open: the recurring incident brief and the Radar methodology page (§1),
the response-time commitment (§5), the founder credential line on the homepage
(§6), and `foundingDate` (§7). `rel="canonical"` from the AAA research-note
pages back to the hub belongs to that project and has not been made.

Findings are ordered by how much authority each is costing, not by effort.

---

## 1. Everything published has Sagitta as its subject

The original framing of this finding was that authority is self-asserted, and
the fix was third-party validation. That path is closed and is not worth
returning to: there are no customers, no coverage, and no way to conjure either.

The more useful diagnosis is narrower, and it points somewhere reachable.

"Sagitta says" is only a weakness when what Sagitta says is *about Sagitta*.
Almost everything on this site is:

- Every `verification` block — the mechanism the whole site rests on — resolves
  to "owner confirmation", "this site", "the operating Sagitta product
  surfaces", or a Sagitta-owned URL. Of the seven records in
  `promotionChannelRecords`, five are Sagitta's own.
- All four evidence artifacts in `src/content/artifacts.ts` describe Sagitta
  architecture, Sagitta deliverables, or Sagitta capital design.
- All four homepage signals are readings Sagitta takes of Sagitta surfaces.
- Of nineteen newsroom records, the overwhelming majority announce a Sagitta
  launch, describe a Sagitta system, or argue a Sagitta position.

A reader can therefore check that Sagitta is internally consistent. They cannot
check anything against the world, because the site gives them nothing to check
*against*. That is the real ceiling — not the missing testimonial.

**The reachable substitute is falsifiable subject matter.** Analysis of real,
public, independently verifiable events carries the same weight with a skeptical
reader as a reference does, and it requires no one's permission, consent, or
budget. The reader verifies it against the chain instead of against Sagitta.

Sagitta is already sitting on the corpus. The Continuity Engine tracks 801
critical incidents. Radar covers Chainlink, Uniswap v3, Aerodrome, and bridge
routes across a large body of third-party infrastructure. Every one of those is
someone else's system, publicly observable, and checkable by anyone who doubts
the reading. That material is currently used only to produce a headline number
about how much Sagitta watches — which is, again, a claim about Sagitta.

**How to improve it, in order of value:**

1. **Turn the incident corpus into a recurring public brief.** A dated, regular
   piece of analysis about what actually happened to other people's
   infrastructure — what failed, which control was missing, what the authority
   surface looked like beforehand. *The Three Deaths Doctrine* already works
   this way and it is the strongest thing Sagitta has published; it is a format,
   not a one-off. This is the single highest-authority move available, it is
   entirely unilateral, and it is the only item on this list that gets stronger
   the longer it runs.
2. **Publish the Radar measurement methodology.** Which sources are read, what
   counts as covered, how the aggregate is computed. This converts the
   most-quoted figure on the site from a number Sagitta reports into a method a
   reader can reproduce. Reproducibility is the form of credibility that does
   not require a witness.
3. **Publish observations that can later be checked.** A dated coverage or
   risk-posture reading on a named third-party protocol is falsifiable: it can
   be wrong, and a reader can find out. Nothing on the site currently can be
   wrong, which is precisely why none of it can be right in a way that counts.
   This carries genuine risk and should be scoped deliberately — but a record of
   dated, checkable observations is the closest a pre-customer organisation gets
   to a track record.
4. **Make the free surfaces the proof.** AAA's free Observer tier, the Selun
   wizard, the x402 endpoints, and the sample Defense Review are things a
   skeptic can operate without speaking to anyone. Usage is the one form of
   evidence available here that does not pass through a claim at all. Promote
   them as the way to check Sagitta, not as products to buy.

What to stop doing: treating "no coverage recorded" as a gap to be closed. The
press room's explicit nil return (`src/content/press.ts:243-259`) is well
written and should stay exactly as it is. It is not a hole in the site.

---

## 2. The depth is off-domain; the hub is a pointer index

Twelve of the nineteen newsroom records carry `externalRole: "canonical"`. Their
`body` arrays are two sentences, and the second sentence is usually a variation
of "Published in full on the AAA research-notes index. This page is the canonical
network record."

So a reader arriving from search at `/newsroom/determinism-discretion-and-trust`
gets roughly fifty words and a button to leave. `src/lib/jsonld.ts` then
correctly declines to emit `Article` for those twelve — honest, and it also means
two-thirds of the newsroom is invisible as article-shaped content.

Three costs compound here:

- **Search authority accrues elsewhere.** The topical depth signals land on
  `paragraph.com`, `linkedin.com`, `gitbook.io`, and `aaa.sagitta.systems`.
  `sagitta.systems` presents as a 58-page site that is broad and thin.
- **The best asset is never on the page.** The writing is the strongest thing
  Sagitta has. It is one click away from every surface and readable on none of
  them.
- **The stub bodies undercut the tone.** Everything else on the site reads as
  written by someone with something to say. These read as CMS filler, which is
  exactly the impression the rest of the site is engineered to avoid.

**How to improve it:**

1. **Republish the four AAA research notes on the hub in full**, with
   `sagitta.systems` as canonical and a `rel="canonical"` pointing here from the
   subdomain. Both properties are Sagitta's, so this is an internal decision with
   no permission cost and no duplicate-content penalty. It converts four stubs
   into four real pages and consolidates the strongest topical cluster
   (allocation policy, determinism, authority gating) onto the hub.
2. **For Paragraph and LinkedIn, publish a real extended abstract** — 300–500
   words that make the actual argument and end at the point where the full piece
   earns the click — with cross-canonical to the external publication. The
   current pattern gives the reader neither the argument nor a reason to want it.
3. **Enforce a minimum in `scripts/check-content.mjs`**: a published record with
   a body under, say, 120 words fails the build. The site's whole method is that
   editorial rules are machine-enforced; this rule is currently unwritten and
   consequently violated twelve times.

---

## 3. There is no owned audience channel

Nothing on the site captures a returning reader.

- **No RSS or Atom feed.** No `feed.xml`, no `rss`, no `<link rel="alternate">`
  in `src/app/layout.tsx`. The irony is sharp: the content layer's provenance
  notes show Sagitta reading *other people's* feeds — Paragraph's RSS, the
  YouTube channel's RSS — to build its own records, while publishing none.
- **No email capture**, no subscribe affordance, no follow prompt beyond a
  footer link to X.
- The editorial apparatus is fully built around this absence: desks with
  published cadences (`src/content/desks.ts`), media types, an
  `EditorialSchedule` component. All of it describes a publication that a reader
  cannot subscribe to.

For a site shaped like a publication, this is the largest *structural* promotion
gap. Every visit terminates. Nineteen records of accumulated work generate no
compounding audience.

**How to improve it:**

1. **Ship `/newsroom/feed.xml`.** Derive it from `publishedEntries` exactly the
   way `src/app/sitemap.ts` derives from the same collections — same
   `dynamic = "force-static"` pattern, fully compatible with
   `output: "export"`, no backend. Include the extended abstract, not the stub.
   This is a few hours of work and it is the highest ratio of authority to effort
   on this entire list.
2. **Per-desk feeds** once the main one exists. The desk model already supports
   it and it costs almost nothing further.
3. **Declare the feed** with `<link rel="alternate" type="application/rss+xml">`
   in the root layout, and link it visibly from `/newsroom`.
4. **Email capture is a later step**, because it genuinely needs a backend the
   site has deliberately refused. Do not let that block the feed, which does not.

---

## 4. The promotional machinery is instrumented but never measured

`data-cta` and `data-cta-type` attributes are applied across roughly twenty
conversion points, with a full taxonomy typed in `src/content/types.ts` —
`press`, `evidence`, `contact`, `open-product`, `system-entry`, `documentation`,
`career`.

Nothing consumes them. There is no analytics script in the layout, no consumer
anywhere in `src/`, no configuration for one.

Meanwhile `PROMOTION_COVERAGE.md` §"Rotation notes" describes a real editorial
system: which promotion leads, what is archived, four-to-six active formats, a
hard cap of four network-desk rows. Every one of those decisions is currently
made on judgment alone, with no feedback about which stage a reader actually
enters the network through.

The site holds every *content* claim to a verified source. The promotional
decisions are the one area where nothing is measured and nothing is checked.

**How to improve it:** add a single cookieless, privacy-preserving analytics
consumer (self-hosted or Plausible-class — anything that does not compromise the
site's posture) reading the `data-cta` attributes that already exist. No markup
changes needed. Then `priority` in `src/content/promotions.ts` becomes an
evidence-backed field rather than an editorial guess, which is the same standard
the rest of the repository already meets.

---

## 5. The highest-intent path terminates in a mailto

`/contact` states it plainly: "The form below composes a message; there is no
submission backend in this phase." `InquiryForm` is used identically for press
interview requests and for service enquiries.

For press, this is defensible — a journalist emailing is normal.

For revenue it is a leak. Defense Reviews are a paid product with a fixed scope
and a live surface at `defense.sagitta.systems` that already has sign-in and a
downloadable sample. A protocol lead with a budget and a journalist on deadline
currently hit the identical dead end, and the site tells the buyer up front that
the mechanism is provisional.

Also absent: any response commitment. "We respond to press within one business
day" costs nothing to publish and is a genuine, cheap authority signal — a
statement about conduct that can be held against you.

**How to improve it:**

1. Route service enquiries into the operating surfaces rather than to email —
   Defense already has the surface to receive them.
2. If email stays the mechanism, remove the line advertising it as
   backend-less on the service paths. It is honest about implementation and it
   reads as provisional to a buyer.
3. Publish a response-time commitment on `/contact` and `/press`.

---

## 6. The one named human is underused

Xavier D. Moore's record (`src/content/people.ts`) carries genuinely strong,
owner-confirmed, press-cleared credentials: lead development roles on enterprise
systems at FedEx and Fidelity, founding and operating Enigma Games, building
digital systems since 1997.

That material appears on `/about` and `/press` only.
`PROMOTION_COVERAGE.md` §6 records the deliberate choice: on the homepage his
name appears solely as a byline, "which is attribution rather than a biography."

The institutional reasoning is sound, but the cost is real. The two LinkedIn
articles are among the strongest promotions on the front page, and a first-time
reader has no way to know the byline belongs to someone with twenty-nine years of
systems work behind it without leaving the page. For an organisation with no
external validation (finding 1), the named founder *is* the available authority
signal, and it is being held back.

**How to improve it** without breaking the institutional voice:

1. Give the byline one line of credential in the network desk and the lead
   carousel — "Founder, Sagitta Systems · enterprise systems at FedEx and
   Fidelity" — linked to `/about`. This is attribution enrichment, not a
   biography, and every word is already verified and cleared for press use.
2. Add `founder: { "@id": ... }` to `organizationLd()`. `personLd` already
   exists and is emitted on `/about`; the two nodes are currently unconnected in
   the entity graph, which is a free authority link left unmade.
3. Consider whether the LinkedIn articles should be authored *by Sagitta* with
   his byline rather than by him personally. Right now the strongest writing
   builds a personal brand on a platform where Sagitta has no resolvable
   presence at all (see finding 8).

---

## 7. Structured data leaves supportable authority on the table

Currently emitted: `Organization`, `WebSite`, `Person`, and `Article` for seven
of nineteen records. The three deliberate omissions documented in
`src/lib/jsonld.ts` — `parentOrganization`, YouTube in `sameAs`, `JobPosting` —
are all correctly reasoned and should stay omitted.

Missing, and fully supportable from records that already exist:

- **`VideoObject`** for the two videos. Titles resolved via oEmbed, channel
  resolved, posters stored locally, one runtime known. This is precisely the type
  search engines surface, and it is being left unemitted.
  *Caveat:* the Selun video's date conflict (owner-supplied 2026-03-19 vs. the
  channel feed's 2026-03-28) must be resolved first — `uploadDate` would publish
  a value the site's own record knows is contested. Emit for the Protocol video
  immediately; hold Selun pending the decision.
- **`BreadcrumbList`** on the three nested segments. A 58-page site with a clean
  hierarchy and no breadcrumb markup.
- **`founder`** on `Organization` (see finding 6).
- **`foundingDate`**, if a defensible one can be sourced. Not currently recorded
  anywhere in the content layer, so this is a research task, not an edit.

---

## 8. Distribution is narrow, and the identity is split across four brands

Four active channels: X, LinkedIn, Paragraph, YouTube. Two of the four have
problems that directly suppress authority:

- **LinkedIn has no resolvable channel home.** The record is explicit that no
  public profile URL was ever resolved. So the two strongest recent articles have
  no follow path, and LinkedIn contributes nothing to `sameAs()` — the
  entity-consolidation signal search engines lean on hardest. Resolving one URL
  fixes both.
- **The YouTube channel belongs to Sagitta Labs, not Sagitta Systems.**
  `SAME_AS_EXCLUDED` handles this scrupulously and correctly, which means the
  video authority accrues to a *different identity* than the one this site
  publishes under.

Stepping back: a reader who encounters Sagitta from outside finds
`sagitta.systems`, a `sagittalabs.com` security page, a GitBook whitepaper, a
Paragraph publication called The Continuity Desk, a YouTube channel called
Sagitta Labs, and seven product subdomains. Internally the distinctions are
rigorous and documented. Externally that is four brand names and no obvious
centre — and a fragmented identity reads as a smaller organisation than a
consolidated one, not a larger one.

Volume is also low: two videos, most recently April; nine of thirteen
promotional formats have zero ready assets.

**How to improve it:**

1. Resolve and publish the LinkedIn URL. One lookup; unblocks `sameAs` and a
   follow path for the best content.
2. Decide who owns video. If Systems is the publishing identity, the channel
   should be Systems'; if Labs is, then accept that video builds Labs and stop
   staging it as a Systems asset.
3. Make `sagitta.systems` unambiguously the centre: every off-site property links
   back to it, and it holds the canonical record for everything Sagitta-owned
   (finding 2 is the mechanism).
4. Of the nine empty formats, **audio is the cheapest real one.** The Sagitta
   Podcast desk exists and has published nothing. A ten-minute reading of an
   existing Paragraph essay requires no new argument, no client, and no consent.

---

## 9. One live inconsistency worth closing

The Selun video's published date is contested by the site's own recorded source,
and both the newsroom record and `PROMOTION_COVERAGE.md` say so. The site
publishes the owner-supplied date; a reader checking the video sees the feed's,
nine days later.

It is a small thing that lands on the site's central promise — every claim
carries the evidence behind it. Right now there is exactly one published field
the record itself flags as lowest-confidence. Resolve it, or publish the feed
date with a note. Either is stronger than shipping the conflict.

---

## Priority

If only three things get done:

1. **Ship the RSS feed** (§3). Hours of work, no backend, and it is the only
   change here that makes every future publication compound.
2. **Bring the twelve stub records up to real abstracts, and repatriate the four
   AAA notes in full** (§2). This is where the existing work is currently being
   given away.
3. **Start the recurring incident brief** (§1). The only item on this list that
   compounds, the only one that gives a reader something to check against the
   world rather than against Sagitta, and it needs nothing from anyone outside
   the organisation. Pair it with the Radar methodology page so the analysis and
   the method that produced it land together.

Then, in descending order: connect analytics to the CTAs already instrumented
(§4), add the founder credential line and the `founder` edge (§6), fix the
service conversion path (§5), emit `VideoObject` and `BreadcrumbList` (§7),
resolve the LinkedIn URL (§8), close the date conflict (§9).

---

## Footnote: dead code found in passing

Not promotion-related, noted because it turned up while mapping the component
tree. `DoorCard.tsx`, `CareersAccordion.tsx`, `ConstellationGraphic.tsx`, and
`RoleCard.tsx` have no importers, and `src/data/content.ts` (235 lines, the
pre-migration content model) is read only by two of those four. The whole set
appears to be Phase 1 residue superseded by `src/content/`.
