import type { MediaType, NewsroomBodyBlock, NewsroomEntry, Verification } from "./types";

// Newsroom records.
//
// Every entry below indexes material that exists and was checked on 2026-07-29.
// The Phase 1 placeholder entries — one per desk, invented purely to exercise
// the templates — have been removed. A desk with no published work is now
// represented as an upcoming desk (see desks.ts), never as a story card.
//
// Publication dates are only present where the source states one. The four AAA
// research notes carry the dates published on aaa.sagitta.systems; the two
// system updates carry dates confirmed by this repository's git history. Nothing
// else is dated, and nothing is dated by inference.

// The 2026-07-31 pass added the network's off-site publishing to this record:
// the Paragraph publication, the two LinkedIn articles, the first YouTube
// video, and the verified release milestones. Each was resolved from its own
// public source — Paragraph titles and dates from the publication's RSS feed
// and per-article metadata, the video title and channel from YouTube's oEmbed
// endpoint — and each entry points at a canonical public URL rather than at an
// authoring dashboard. This is where the archive lives; the homepage only
// promotes from it.

const VERIFIED_ON = "2026-07-29";
const VERIFIED_JUL_31 = "2026-07-31";

function verified(source: string, note?: string): Verification {
  return { status: "verified", source, lastVerifiedAt: VERIFIED_ON, note };
}

/** Verified in the 2026-07-31 real-content pass. */
function verifiedJul31(source: string, note?: string): Verification {
  return { status: "verified", source, lastVerifiedAt: VERIFIED_JUL_31, note };
}

/**
 * The four AAA research notes, repatriated on 2026-08-02.
 *
 * These records previously carried a two-sentence stub and pointed at
 * `aaa.sagitta.systems` as the canonical publication, so the hub indexed the
 * network's own research without publishing any of it. Both surfaces are
 * Sagitta's, so which one is canonical was an internal decision rather than a
 * permission question — and the hub is the right answer, because it is the
 * surface that claims to be the public record.
 *
 * `externalRole` is therefore now `reference`: the AAA research-notes index is
 * a product surface where the same note also appears, and this page is the
 * canonical record. That flips `articleLd` on for all four, which is the point.
 *
 * **What the body is.** Each argument was read from the published note on
 * 2026-08-02 and set out in full here — every claim it makes, in its own order,
 * including its own formulations where they are the sharpest statement of the
 * point. It is Sagitta's argument published on Sagitta's own record. It is not
 * a character-for-character transcription of the AAA page, and it is not
 * represented as a quotation of one.
 *
 * **Outstanding.** `rel="canonical"` should now point from each AAA
 * research-note page back to this hub record. That change belongs to the AAA
 * project, not this repository, and has not been made here.
 */
function repatriated(): Verification {
  return {
    status: "verified",
    source: "https://aaa.sagitta.systems/research-notes (argument read in full on 2026-08-02)",
    lastVerifiedAt: "2026-08-02",
    note: "Repatriated 2026-08-02. The note's full argument was read from the AAA research-notes surface and is published here, with this hub record as the canonical location; the AAA page is now recorded as a reference to the same note rather than as the canonical publication. Both surfaces are Sagitta's own, so no third-party permission was involved. The text is a full statement of the note's argument rather than a verbatim transcription, and nothing is presented as a quotation. The publication date is unchanged: it is the date the note was originally published on the AAA surface, not the date it was repatriated.",
  };
}

export const mediaTypes: MediaType[] = [
  "Article",
  "Report",
  "Audio",
  "Video",
  "Briefing",
  "Press Release",
  "Data",
  "System Update",
];

export const newsroomEntries: NewsroomEntry[] = [
  {
    slug: "cve-2023-39363",
    canonicalPath: "/defense/reviews/cve-2023-39363",
    title: "What Can Your Protocol Actually Do When a CVE Reaches It?",
    summary:
      "A Sagitta Defense mini-review tracing CVE-2023-39363 from compiler exposure through technical reachability, economic exploitability, protocol authority, migration, and restoration.",
    publishedAt: "2026-08-07",
    updatedAt: null,
    desk: "defense-review",
    mediaType: "Report",
    author: "Sagitta Systems",
    seriesLabel: "Defense Mini-Review · CVE-2023-39363",
    systemSlug: "sagitta-defense",
    relatedSystems: ["sagitta-continuity-engine"],
    heroImage: "/defense-review.jpg",
    body: [
      "A CVE can establish that vulnerable software exists. A Defense review has to determine whether the vulnerable behavior is present and reachable in the deployed system, whether exploitation is economically meaningful, and what authority the protocol has once exposure is confirmed.",
      "In the fictional Meridian ETH Reserve Pool, the affected Vyper version and mechanism are present, the execution path is reachable, and a profitable path is identified. Operator authority is partial: routing and incentives can be stopped, but the pool cannot be paused and user positions cannot be moved.",
      "The resulting continuity posture is **MIGRATION REQUIRED**. Defense tracks the event from exposure reduction and user advisory through replacement, migration, verification, and restoration.",
      "The CVE begins the review; deployed behavior and available authority determine the operational finding.",
    ],
    featured: true,
    verification: {
      status: "verified",
      source:
        "https://nvd.nist.gov/vuln/detail/CVE-2023-39363 + https://github.com/vyperlang/vyper/security/advisories/GHSA-5824-cm3x-3c38 + https://www.llamarisk.com/research/curve-pool-reentrancy-exploit-postmortem",
      lastVerifiedAt: "2026-08-07",
      note: "Technical claims checked against the NVD record, the Vyper project advisory, and LlamaRisk's Curve incident postmortem. Meridian is explicitly fictional and demonstrates the Defense review method.",
    },
    publicationState: "published",
    visibility: "public",
  },
  // Allocation Desk — Allocation Read 001. The newsroom record is canonical;
  // Selun is the evaluated system and receives the record through systemSlug.
  {
    slug: "what-aggressive-means-in-a-defensive-market",
    title: "What Aggressive Means in a Defensive Market",
    summary:
      "A controlled comparison of two Selun allocations showing how risk tolerance changes policy expression while the recorded market state remains Defensive.",
    publishedAt: "2026-08-07",
    updatedAt: null,
    desk: "allocation-read",
    mediaType: "Report",
    author: "Sagitta Systems",
    seriesLabel: "Allocation Read 001",
    systemSlug: "selun",
    body: [
      "What changes when the market stays the same and the operator changes only risk tolerance?",
      "On August 7, 2026, I ran two Selun allocations using the same $10,000 reference portfolio, 1–3 year timeframe and Bluechips segment. Selun recorded the same market state for both runs.",
      "The variable was the operator's risk tolerance: **Conservative versus Aggressive**.",
      "The result was a clear change in both allocation structure and strategy category. Conservative produced **Capital Preservation**. Aggressive produced **Balanced Defensive**.",
      "Aggressive reduced Stable Holdings from 55.80% to 29.67%, reduced Core Holdings from 35.36% to 29.50%, expanded Growth Positions from 8.84% to 30.03%, and introduced a 10.80% Income Position. The portfolio expanded from four allocated assets to seven, while the Speculative role remained at 0%.",
      "The market stayed Defensive. The way Selun expressed the operator's risk tolerance changed materially inside that market condition.",
      { kind: "heading", text: "Market conditions" },
      {
        kind: "table",
        caption: "Market conditions in the Conservative and Aggressive runs",
        columns: ["Market state", "Conservative run", "Aggressive run"],
        rows: [
          ["Market condition", "Defensive", "Defensive"],
          ["Fear & Greed", "29 / Fear", "29 / Fear"],
          ["Volatility", "Low", "Low"],
          ["Liquidity", "Tight", "Tight"],
        ],
      },
      "The Fear & Greed reading of 29 placed the market in **Fear**, and Selun described the environment as supporting defensive tilts. Liquidity was **Tight**, while volatility was **Low**. Together, Selun classified the broader market condition as **Defensive** in both runs.",
      "That shared market context matters because it frames the allocations. Conservative expressed the Defensive condition through heavy Stable and Core exposure. Aggressive accepted more Growth and Income exposure while still resolving to a defensive strategy category.",
      { kind: "heading", text: "The allocations" },
      {
        kind: "table",
        caption: "Asset allocations in the Conservative and Aggressive runs",
        columns: ["Asset", "Conservative role", "Conservative", "Aggressive role", "Aggressive", "Change"],
        numericColumns: [2, 4, 5],
        rows: [
          ["USDT", "Stable Holdings", "55.80%", "Stable Holdings", "29.67%", "-26.13 pp"],
          ["BTC", "Core Holdings", "17.68%", "Core Holdings", "14.75%", "-2.93 pp"],
          ["ETH", "Core Holdings", "17.68%", "Core Holdings", "14.75%", "-2.93 pp"],
          ["SOL", "Growth Positions", "8.84%", "Growth Positions", "12.42%", "+3.58 pp"],
          ["ADA", "—", "—", "Income Position", "10.80%", "+10.80 pp"],
          ["XRP", "—", "—", "Growth Positions", "12.43%", "+12.43 pp"],
          ["BNB", "—", "—", "Growth Positions", "5.18%", "+5.18 pp"],
          ["Total", "", "100.00%", "", "100.00%", "0.00 pp"],
        ],
      },
      "The largest single change was USDT, which fell by **26.13 percentage points**. That capital was redeployed primarily into Growth Positions and the newly active Income Position.",
      "BTC and ETH remained paired in Core Holdings, moving from 17.68% each to 14.75% each. SOL increased from 8.84% to 12.42%, while XRP and BNB entered as additional Growth Positions. ADA entered as an Income Position at 10.80%.",
      "The allocations have a **31.99% policy allocation distance**: the absolute asset-weight changes total 63.98 percentage points, halved because each reallocated weight is counted once leaving one asset and again entering another.",
      { kind: "heading", text: "How the allocation categories changed" },
      {
        kind: "table",
        caption: "Allocation categories in the Conservative and Aggressive runs",
        columns: ["Role", "Conservative", "Aggressive", "Change"],
        numericColumns: [1, 2, 3],
        rows: [
          ["Stable Holdings", "55.80%", "29.67%", "-26.13 pp"],
          ["Core Holdings", "35.36%", "29.50%", "-5.86 pp"],
          ["Income Position", "0%", "10.80%", "+10.80 pp"],
          ["Growth Positions", "8.84%", "30.03%", "+21.19 pp"],
          ["Liquidity Reserve", "0%", "0%", "0.00 pp"],
          ["Speculative", "0%", "0%", "0.00 pp"],
        ],
      },
      "The category shift is the clearest expression of the changed risk tolerance.",
      "Under Conservative, **91.16%** of the portfolio sat in Stable and Core Holdings. Growth represented only 8.84%, and the allocation used four assets.",
      "Under Aggressive, Stable and Core Holdings together fell to **59.17%**. Growth rose to 30.03%, Income appeared at 10.80%, and the allocation expanded to seven assets.",
      "Selun therefore expressed Aggressive risk tolerance by activating more of the Growth and Income categories and broadening the asset set. The Speculative category remained at 0%, and every selected asset in the Aggressive allocation carried Selun's **Large Cap Crypto** risk class.",
      "That structural change also changed the strategy category. Selun categorized the Conservative allocation as **Capital Preservation** and the Aggressive allocation as **Balanced Defensive**. Under the same Defensive market conditions, the different risk tolerance produced a different allocation structure and strategy category.",
      "That is what Aggressive meant in this market: less capital held in Stable and Core categories, more capital deployed into Growth and Income, and a broader asset set. The strategy category was **Balanced Defensive**, while the **Speculative** allocation role remained at 0%.",
      {
        kind: "note",
        text: "Allocation Read is a system demonstration of Selun's allocation-policy behavior for product evaluation and technical analysis. It is not investment guidance.",
      },
    ],
    featured: false,
    verification: {
      status: "verified",
      source: "Owner-supplied Allocation Read 001 (2026-08-07)",
      lastVerifiedAt: "2026-08-07",
      note: "Published from the owner-supplied report. The two allocation runs, their inputs, and their outputs are recorded as product-evaluation evidence rather than investment guidance.",
    },
    publicationState: "published",
    visibility: "public",
  },

  // ── AAA / Policy Notes — four published research notes ─────────────────────
  {
    slug: "scenario-governance-in-on-chain-markets",
    title: "Scenario Governance in On-Chain Markets",
    summary:
      "How rapidly shifting market conditions move volatility, correlation, and liquidity together — and what that means for allocation policy written in advance.",
    publishedAt: "2026-01-25",
    updatedAt: null,
    desk: "policy-notes",
    mediaType: "Article",
    author: "Sagitta Labs",
    systemSlug: "aaa",
    externalUrl:
      "https://aaa.sagitta.systems/research-notes/scenario-governance-in-on-chain-markets",
    externalRole: "reference",
    externalLabel: "Also published on aaa.sagitta.systems",
    body: [
      "On-chain markets are not stationary. Volatility regimes shift abruptly. Correlations converge under stress. Liquidity disappears precisely when it is most needed.",
      "Those three facts are usually stated separately, but they are the same fact observed from different angles, and they arrive together. The diversification a portfolio is relying on thins out at the moment it is called upon, and the exit it assumed was available is the one being used by everybody else simultaneously. A model calibrated on the market's ordinary behaviour is calibrated on the conditions under which its assumptions were never going to be tested.",
      "Sagitta AAA therefore approaches allocation through regime awareness rather than static models. The system does not assume that the environment that produced its parameters is the environment it will be operating in.",
      "Scenario governance is the formal process of adjusting operational posture in response to market conditions while holding deterministic principles intact. The mechanism is deliberately narrow. Operators do not make emotional overrides, and they do not reach into individual decisions. They declare regime context — conservative through drawdowns, neutral through stability, aggressive only where conditions actually justify it — and the allocator's behaviour follows from that declaration through the same rules it always applies.",
      "What this creates is a governed adaptation layer. The allocator remains rule-bound, so every decision stays reconstructable and defensible; but the rules acknowledge environmental reality, because different market states genuinely do warrant different constraint sensitivity. Treating a stressed market and a calm one identically is not discipline. It is a failure to observe.",
      "The strategic case is straightforward. Scenario governance is how institutions survive chaos: it replaces reactive trading with structured posture shifts. The difference between the two is not the direction of the move — often it is the same move — but whether it was a decision the framework anticipated and sanctioned, or an improvisation that happened to be correct.",
      "Crypto markets do not reward perfect prediction. Nobody is paid for having called the regime change. They reward organizations that remain solvent through regime transitions, which is an entirely different capability and one that can actually be engineered.",
      "Sagitta AAA is built to enable that continuity through regime-aware allocation.",
    ],
    featured: true,
    verification: repatriated(),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "designing-enforceable-allocation-policy",
    title: "Designing Enforceable Allocation Policy for Decentralized Organizations",
    summary:
      "Why DAOs need systems that enforce a governance mandate rather than systems that merely vote on one.",
    publishedAt: "2026-01-15",
    updatedAt: null,
    desk: "policy-notes",
    mediaType: "Article",
    author: "Sagitta Labs",
    systemSlug: "aaa",
    externalUrl:
      "https://aaa.sagitta.systems/research-notes/designing-enforceable-allocation-policy-for-decentralized-organizations",
    externalRole: "reference",
    externalLabel: "Also published on aaa.sagitta.systems",
    body: [
      "Decentralized organizations do not fail for want of capital. They fail for want of enforceable governance.",
      "The distinction that matters here is narrow and consequential: governance votes are not policy unless the system can actually constrain action. A vote that passes and is then executed by whoever happens to hold the keys, at whatever time and in whatever size they judge appropriate, has not established a policy. It has established an intention, and an intention is only as durable as the discretion of the person carrying it out.",
      "Allocation policy, properly constructed, is a binding constraint system rather than advisory guidance. It specifies risk ceilings, concentration caps, regime behaviour, liquidity requirements, and mandate priorities — and allocations then emerge mechanically from those rules rather than being argued for one at a time. The rules are the decision. What remains is arithmetic.",
      "This transfers decision authority from individual judgment to structural rules, which is the point rather than a side effect. Instead of evaluating each trade case by case, and re-litigating the organization's risk appetite every time conditions change, the organization establishes behavioural boundaries once and lets the allocator operate inside the permitted space. The argument happens where it belongs — at the level of policy, in advance, with time to think — instead of at the level of the individual position, under pressure, with capital already exposed.",
      "Enforceable policy is also what generates institutional continuity. Panic reallocations, narrative-driven behaviour, and governance drift are all failures of the same kind: the organization did something its stated framework did not sanction, because nothing in the system was capable of refusing. Where the framework binds, those failures are not resisted by discipline. They are unavailable.",
      "The objective therefore shifts away from optimisation and toward systemic discipline. An allocator that produces a marginally better outcome while remaining capable of ignoring its mandate is a worse instrument than one that produces a defensible outcome it could not have deviated from.",
      "Decentralized organizations do not need more opinions. They need allocation law.",
      "This is what Sagitta AAA exists to provide: the conversion of policy from a rhetorical statement into an operational one, where governance constraints are mechanically binding rather than advisory.",
    ],
    featured: false,
    verification: repatriated(),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "authority-gated-decision-intelligence",
    title: "Authority-Gated Decision Intelligence in Crypto-Native Institutions",
    summary:
      "Procedural safeguards for institutions operating under volatility and fast governance cycles.",
    publishedAt: "2026-01-08",
    updatedAt: null,
    desk: "policy-notes",
    mediaType: "Article",
    author: "Sagitta Labs",
    systemSlug: "aaa",
    externalUrl:
      "https://aaa.sagitta.systems/research-notes/authority-gated-decision-intelligence-in-crypto-native-institutions",
    externalRole: "reference",
    externalLabel: "Also published on aaa.sagitta.systems",
    body: [
      "Crypto-native institutions operate under extreme volatility, fast governance cycles, and minimal procedural safety nets. The combination is unusual: the pace of decision-making is high, the consequences are immediate and irreversible, and almost none of the institutional machinery that slows a traditional balance sheet down is present.",
      "In that environment the primary failure mode is not the missed opportunity. It is loss of control. Institutions in this sector are far more often damaged by acting outside the boundary they intended to set for themselves than by failing to act quickly enough — and the second failure is recoverable in a way the first is not.",
      "Sagitta AAA is therefore built as authority-gated decision intelligence. The core proposition is not feature-richness. It is that decision responsibility has to be earned rather than granted by default at the point of sign-up, and that the system should make the boundary explicit rather than leaving it to convention.",
      "Access is tiered accordingly. Observer access allows read-only exploration of allocation outcomes with no ability to modify policy — the whole reasoning surface, none of the authority. Sandbox authority permits controlled experimentation, where the consequences are contained by construction. Higher tiers unlock governed decision modification, mandate enforcement, and institutional accountability, each of which carries obligations that the lower tiers deliberately do not.",
      "The architecture reflects a single principle: allocation is not a UI interaction, it is fiduciary power. A button that moves capital is not a feature in the ordinary sense, and treating it as one is how systems end up granting more authority than anybody consciously decided to grant. So the system separates analysis from execution, and recommendation from authority. What the allocator can compute and what any given operator is permitted to enact are two different questions, answered in two different places.",
      "The effect of that separation is that the allocator can be strong without being dangerous. Its analytical capability can be raised without simultaneously raising the blast radius of a mistake, because capability and permission are not the same axis.",
      "The underlying philosophy reorders the usual priorities: governance comes before automation. In an institutional capital system, the critical question is never what the model can do. It is who is authorised to act on it, and under what constraints.",
    ],
    featured: false,
    verification: repatriated(),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "determinism-discretion-and-trust",
    title: "Determinism, Discretion, and Trust in Automated Allocation",
    summary:
      "Trust does not come from intelligence alone. It comes from repeatability.",
    publishedAt: "2025-12-30",
    updatedAt: null,
    desk: "policy-notes",
    mediaType: "Article",
    author: "Sagitta Labs",
    systemSlug: "aaa",
    externalUrl:
      "https://aaa.sagitta.systems/research-notes/determinism-discretion-and-trust-in-automated-allocation",
    externalRole: "reference",
    externalLabel: "Also published on aaa.sagitta.systems",
    body: [
      "Sagitta AAA operates on a foundational premise: trust does not come from intelligence alone. It comes from repeatability.",
      "Allocation systems rarely fail mathematically. They fail socially. A model can be defensible on its own terms and still leave an institution unable to explain, six weeks later and under pressure, why a particular position was taken. That gap is where confidence collapses — not in the arithmetic, but in the moment someone has to stand behind the decision and finds there is nothing underneath it to stand on. Systems that are discretionary, opaque, or reactive produce exactly this outcome, because none of the three leaves anything behind that a stakeholder can point at.",
      "In capital contexts, the ability to justify a choice matters as much as the result of it. A good outcome that cannot be accounted for is not a good outcome from a governance standpoint — it is an unexplained one that happened to be profitable, and it sets no precedent anyone can rely on next time.",
      "This is why the platform prioritises deterministic allocation. Identical inputs consistently yield identical outputs. A decision can therefore be examined after the fact, reconstructed from the state that produced it, and justified without asking anyone to extend confidence to a process they cannot inspect. Determinism is not a performance claim; it is what makes the rest of the governance apparatus meaningful, because a rule that cannot be shown to have been applied is indistinguishable from a rule that was not.",
      "Discretion is not eliminated. It is constrained, and the distinction matters. Operators can modify policy, adjust risk parameters, and update the assumptions the system reasons from. What they cannot do is reach past the decision rules for a single case. Judgment is exercised on the policy, in advance and on the record; it is not exercised on the trade, in the moment and unrecorded. The allocator functions as infrastructure for governance, not as an autonomous trader with a mandate to be clever.",
      "Trust develops when allocation stops being a matter of confidence in an operator and becomes transparent governance: stable inputs, explicit mandates, bounded adaptation, and institutional restraint. Each of those is a property of the system rather than a quality of the people running it, which is precisely what makes it durable — it survives a change of staff, a change of market, and a change of conviction.",
      "The platform is built to withstand examination rather than to produce appealing results. Where those two goals diverge, the first one wins.",
    ],
    featured: false,
    verification: repatriated(),
    publicationState: "published",
    visibility: "public",
  },

  // ── System updates ─────────────────────────────────────────────────────────
  {
    slug: "sagitta-radar-operating-status-july-2026",
    title: "Sagitta Radar: operating as verified 29 July 2026",
    summary:
      "A dated status check on Sagitta Radar — monitoring oracles, bridges, and liquidity pools on a public subscription across four plans.",
    publishedAt: "2026-07-29",
    updatedAt: null,
    desk: "radar-report",
    mediaType: "System Update",
    author: "Sagitta Systems",
    systemSlug: "sagitta-radar",
    relatedSystems: ["sagitta-continuity-engine"],
    externalUrl: "https://radar.sagitta.systems",
    externalRole: "reference",
    externalLabel: "Open radar.sagitta.systems",
    body: [
      "Verified on 29 July 2026: Sagitta Radar is operating at radar.sagitta.systems with four published plans — Watch, Intel, Signal, and Desk.",
      "A record of this kind exists because an operating state is a claim like any other, and a claim carries the date it was checked and the surface it was checked against. Every state published on this site was read from the live product on a stated date, and this is that reading for Radar rather than a restatement of what the product page says about itself.",
      "Coverage spans oracle price freshness and deviation, bridge route settlement and pauses, and liquidity-pool depth and imbalance, with alert delivery to Discord, Telegram, and webhooks. Radar runs on the Sagitta Continuity Engine backend.",
      "This is a status record, not a launch announcement: the date on it is the date the operating state was checked against the live product. Radar’s launch date was supplied afterwards and is recorded separately, at /newsroom/sagitta-radar-launched. Plan pricing changes; read it on the product page rather than here.",
    ],
    featured: true,
    verification: verified(
      "https://radar.sagitta.systems",
      "Plans, coverage, and delivery channels read from the live product. Published as a dated verification record; the date is explicitly not presented as a launch date. Per-plan prices deliberately left out of evergreen hub copy.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "selun-x402-operating-status-july-2026",
    title: "Selun x402: agent endpoints discoverable as verified 29 July 2026",
    summary:
      "A dated status check on the Selun x402 discovery document, which advertises nine pay-per-call endpoints for allocation, market context, rebalancing, and continuity evaluation.",
    publishedAt: "2026-07-29",
    updatedAt: null,
    desk: "allocation-read",
    mediaType: "System Update",
    author: "Sagitta Systems",
    systemSlug: "selun-x402",
    relatedSystems: ["selun", "aaa", "sagitta-continuity-engine"],
    externalUrl: "https://selun.sagitta.systems/.well-known/x402",
    externalRole: "reference",
    externalLabel: "View the live discovery document",
    body: [
      "Verified on 29 July 2026: an x402 discovery document is published at selun.sagitta.systems/.well-known/x402, advertising nine endpoints an agent can call and settle without a human account.",
      "The advertised surface covers allocation (allocate, allocate-with-report), market and policy context (market-regime, policy-envelope, asset-scorecard), portfolio action (rebalance), and continuity evaluation drawn from SCE (continuity-mode, case-relevance, risk-evaluate).",
      "What makes this worth recording as its own state is the absence of an account. An agent discovers the endpoints from a machine-readable document, calls one, and settles it — with no sign-up, no credential issued in advance, and no human in the path. The discovery document is the whole interface: it is what turns allocation and continuity reasoning from a product a person operates into a capability other software can buy a single unit of.",
      "This is a status record, not a launch announcement — no launch date has been published, and the date here is the date the document was checked. Per-call prices are set in the discovery document itself and change; read them there rather than here.",
    ],
    featured: false,
    verification: verified(
      "https://selun.sagitta.systems/.well-known/x402",
      "Endpoint list read directly from the live discovery document. Published as a dated verification record; the date is explicitly not presented as a launch date. Per-call pricing deliberately left out of evergreen hub copy.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "sagitta-defense-now-operating",
    title: "Sagitta Defense is operating",
    summary:
      "Defense Reviews are available at defense.sagitta.systems as a fixed-scope $3,000 engagement mapping whether a protocol survives control failure.",
    publishedAt: "2026-05-06",
    updatedAt: null,
    desk: "defense-review",
    mediaType: "System Update",
    author: "Sagitta Systems",
    systemSlug: "sagitta-defense",
    relatedSystems: ["sagitta-continuity-engine"],
    externalUrl: "https://defense.sagitta.systems",
    externalRole: "reference",
    externalLabel: "Open defense.sagitta.systems",
    body: [
      "Sagitta Defense is operating at defense.sagitta.systems. The Starter Defense Review is published at a flat $3,000, with a typical delivery of seven days from submission to final report.",
      "The review maps authority structures, treasury controls, oracle dependencies, governance mechanisms, keeper systems, and emergency procedures. It runs on public contract data and project context, and requires no private keys, custody access, signing authority, or transaction approval rights.",
      "That access boundary is a design decision rather than a limitation to work around. A review that required signing authority would itself become a custody domain — one more party able to authorise action, added to a protocol during the exercise meant to establish how many such parties already exist. Working from public surfaces keeps the reviewer outside the authority map they are drawing.",
      "It also fixes what the review can honestly claim. A public-surface review observes authority evidence; it does not prove operational control, and the method classifies each finding by what the evidence actually supports rather than flattening observation and inference into a single list of issues. An unresolved authority path is reported as unresolved. It is not inflated into a vulnerability because the evidence was missing.",
      "The scope is fixed and the price is flat for the same reason: a review whose cost varies with what it finds gives the reviewer an interest in what it finds.",
      "A sample report is available from the service page, showing the structure of the deliverable on illustrative input. It is a specimen rather than a customer result, and no client engagement is published.",
    ],
    featured: true,
    verification: verified(
      "https://defense.sagitta.systems + this repository's git history (commit d3f2cd4, 2026-05-06)",
      "Date is the commit that published the Defense service to this site. Fee and delivery timeline read from the live service page.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "sagitta-systems-hub-published",
    title: "Sagitta Systems hub published",
    summary:
      "sagitta.systems went online as the public directory and routing layer for the network.",
    publishedAt: "2026-05-04",
    updatedAt: null,
    desk: "continuity-desk",
    mediaType: "System Update",
    author: "Sagitta Systems",
    body: [
      "sagitta.systems went online as the public record of the network: a directory of the operating systems, a newsroom, press and journalist resources, a careers and contributor centre, and a public roadmap.",
      "The hub exists because the network had a structural problem that no individual product surface could solve. Sagitta's systems run on their own subdomains, each with its own audience and its own reason to exist, and a reader arriving at any one of them had no way to see how it related to the others — or to establish who was behind it, what state it was actually in, or whether the claims on it could be checked.",
      "So the hub does four things the product surfaces deliberately do not. It explains: each system has a record stating what it is, who it is for, and what is usable today. It connects: the three families — continuity and defense, allocation and agent intelligence, capital infrastructure — are published as a structure rather than left to be inferred from a list of names. It documents: the whitepaper, the architecture, the allocation methodology, and the machine-readable surfaces are indexed in one place. And it routes: every record ends by handing the reader to the surface that can actually serve them.",
      "The operating principle is that every claim carries the evidence behind it. Operating states are recorded with the date they were checked and the surface they were checked against. Figures carry their metric, scope, and source. Where something is not known — a date a source never published, a page count nobody read — the field is left empty rather than filled by inference, and the record says so.",
      "Operating products continue to run on their own subdomains. This hub is the layer that explains, connects, documents, and routes across them, and it is the canonical location for the network's own record of itself.",
    ],
    featured: false,
    verification: verified(
      "This repository's git history (commit c59c4a2, 2026-05-04)",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // ── Documents ──────────────────────────────────────────────────────────────
  {
    slug: "sagitta-whitepaper",
    title: "Sagitta Protocol whitepaper",
    summary:
      "The protocol architecture, doctrine, and capital-flow design: Vault, Treasury, Reserve, Escrow, the Allocation Agent, and the Continuity Engine.",
    publishedAt: null,
    updatedAt: null,
    desk: "continuity-desk",
    mediaType: "Report",
    author: "Sagitta Labs",
    systemSlug: "sagitta-protocol",
    relatedSystems: ["aaa", "sagitta-continuity-engine"],
    externalUrl: "https://sagitta-protocol.gitbook.io/sagitta-whitepaper",
    externalRole: "canonical",
    externalLabel: "Read the whitepaper",
    body: [
      "The whitepaper sets out an autonomous investment management system that prioritises capital safety over yield optimisation, enforcing fiduciary responsibility through architecture rather than operator discretion.",
      "It documents the Vault for custody and accounting, the Treasury for liquidity and settlement, the Reserve as a gold-backed insurance layer, Escrow as the interface to external allocation venues, the Autonomous Allocation Agent for quantitative recommendations, and the Continuity Engine for survival and recovery.",
      "The organising commitment is the ordering of those priorities. Most capital systems are designed to maximise return subject to surviving; this one is designed to survive subject to returning, and the difference shows up in the architecture rather than in the marketing. The Reserve exists outside the allocation path. Continuity is a component of the protocol rather than a procedure invoked after something goes wrong. The allocation agent produces recommendations inside a policy envelope it cannot exceed, and its reasoning is preserved with the decision.",
      "The document also carries the doctrine, which is the part that generalises past this protocol: failure states should be named, bounded, and given revival paths before they occur, and a system should be judged on what it does when protection is insufficient rather than on how unlikely it claims that is.",
      "This is the protocol's design, published in full. It is not a deployment record — Sagitta Protocol remains in Public Test on Moonbase Alpha Testnet and Arc Testnet, and the whitepaper describes the architecture rather than a shipped mainnet system.",
      "It is published and maintained externally on GitBook. No version number or publication date is stated on the document, so none is recorded here.",
    ],
    featured: false,
    verification: verified(
      "https://sagitta-protocol.gitbook.io/sagitta-whitepaper",
      "Executive summary read directly. No version or date stated on the document itself.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "protocol-architecture-diagram",
    title: "Protocol architecture diagram",
    summary:
      "The capital architecture and flow across Vault, Treasury, Reserve, Escrow, AAA, and SCE.",
    publishedAt: null,
    updatedAt: null,
    desk: "continuity-desk",
    mediaType: "Data",
    author: "Sagitta Systems",
    systemSlug: "sagitta-protocol",
    relatedSystems: ["aaa", "sagitta-continuity-engine"],
    heroImage: "/diagram.webp",
    externalUrl: "/diagram.webp",
    externalRole: "reference",
    externalLabel: "Open the full diagram",
    body: [
      "The diagram traces capital through the protocol: deposits into the Vault, liquidity managed by the Treasury, the gold-backed Reserve, Escrow as the interface to external venues, and the two intelligence systems — the Autonomous Allocation Agent and the Sagitta Continuity Engine — governing allocation and continuity.",
      "What it is useful for is seeing the boundaries. A component list tells a reader which parts exist; the diagram shows where capital crosses from one authority domain into another, which is where the design decisions actually live. Capital entering the Vault is under one set of rules. Capital moving through Escrow to an external venue has left the protocol's direct control and is under another. The Reserve sits outside the allocation path entirely, because an insurance layer that can be allocated from is not an insurance layer.",
      "The two intelligence systems are drawn as components rather than as services attached to the outside. That is deliberate and it is the diagram's main claim: allocation decisions and continuity decisions are made inside the protocol's own boundary, not delegated to something the protocol calls out to and hopes is available. A continuity engine reachable only by a working system is not a continuity engine.",
      "This is an architecture document. It shows how capital is designed to move, not a deployment: Sagitta Protocol remains in Public Test on Moonbase Alpha Testnet and Arc Testnet.",
      "The diagram is cleared for press use and is available at full resolution in the media library.",
    ],
    featured: false,
    verification: verified("public/diagram.png in this repository"),
    publicationState: "published",
    visibility: "public",
  },

  // ── Off-site publishing, resolved 2026-07-31 ───────────────────────────────
  //
  // Sagitta publishes on four channels outside its own product surfaces. Each
  // record below indexes one real publication and points at that publication's
  // own public URL — never at an authoring dashboard.

  // Words from the Architect — the two LinkedIn articles.
  {
    slug: "risk-policy-is-only-real-when-it-constrains-the-decision",
    title: "A Risk Policy Is Only Real When It Constrains the Decision",
    summary:
      "A founder perspective on allocation governance: a risk policy that cannot refuse a decision is documentation rather than a constraint.",
    publishedAt: "2026-07-30",
    updatedAt: null,
    desk: "words-from-the-architect",
    mediaType: "Article",
    author: "Xavier D. Moore",
    systemSlug: "aaa",
    externalUrl:
      "https://www.linkedin.com/pulse/risk-policy-only-real-when-constrains-decision-xavier-moore-adcqe/",
    externalRole: "canonical",
    externalLabel: "Read on LinkedIn",
    body: [
      "The article opens on a situation most treasury operations will recognise. Delegates rotate. A position taken eighteen months ago comes under scrutiny, and nobody currently in the room was in the room when it was taken. Without a durable decision record, the team reconstructs the answer from spreadsheets, governance discussions, messages, and individual memory — which is to say it reconstructs an answer, not the answer, and cannot tell the difference.",
      "The usual response is that the institution has an investment policy statement, and it does. The argument here is that this is not where the failure occurs. The operational gap appears at decision time: written policy still requires interpretation, and that interpretation rarely becomes part of the allocation itself. The document says what should happen. Someone reads it, forms a view about what it means in the present circumstance, and acts. The view is what actually governed the decision, and the view is precisely what does not survive.",
      "So a policy that cannot refuse a decision is not functioning as a constraint. It is functioning as documentation of an intention — useful for explaining what the institution meant to do, useless for establishing what it did.",
      "The Autonomous Allocation Agent's answer is to convert approved policy into machine-checkable logic. Once a policy is approved, its rules define the permitted decision space, and the interpretation step disappears because there is nothing left to interpret at decision time. The allocation either falls inside the space the policy describes or it does not occur.",
      "Determinism does the supporting work. Identically declared assets allocate equally, and changing row order cannot alter the result. That second clause is smaller than it sounds and matters more: an allocator whose output depends on the order in which inputs happened to be listed has a hidden input, and a hidden input is unauditable by construction. Removing it is what makes the rest of the record trustworthy.",
      "Each allocation then produces a decision record carrying the declared beliefs, the policy version, the constraints evaluated, the allocator version, the policy effects, the turnover, and the final allocation. The reconstruction problem the article opened with is solved not by better documentation habits but by making the record a by-product of the decision rather than an activity performed afterwards by whoever remembers to.",
      "The governance shape that results is clean: treasury delegates declare the investment beliefs, governance ratifies the policy, and AAA preserves the connection between them. When the question arrives eighteen months later, it is answered from the record — not from whoever is still employed.",
      "The full article is published on LinkedIn.",
    ],
    featured: true,
    verification: {
      status: "verified",
      source:
        "https://www.linkedin.com/pulse/risk-policy-only-real-when-constrains-decision-xavier-moore-adcqe/ (full text read 2026-08-02)",
      lastVerifiedAt: "2026-08-02",
      note: "Canonical title, date, author, and URL are owner-supplied approved source information and are recorded verbatim. UPDATED 2026-08-02: the article body was read from LinkedIn — it had not been, when this record was created — and the record now carries a full treatment of its argument rather than a description assembled from the AAA product record. LinkedIn remains the canonical publication; no Article markup is emitted here.",
    },
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "account-to-treasury-lifecycle-behind-an-onchain-financial-product",
    title: "The Account-to-Treasury Lifecycle Behind an Onchain Financial Product",
    summary:
      "A founder perspective on what a bank actually has to control to put a deposit product onchain: funding, enrolment, term, maturity, and the evidence returned at each transition.",
    publishedAt: "2026-07-28",
    updatedAt: null,
    desk: "words-from-the-architect",
    mediaType: "Article",
    author: "Xavier D. Moore",
    systemSlug: "sagitta-banking",
    relatedSystems: ["sagitta-protocol"],
    externalUrl:
      "https://www.linkedin.com/pulse/account-to-treasury-lifecycle-behind-onchain-financial-xavier-moore-2gkle/",
    externalRole: "canonical",
    externalLabel: "Read on LinkedIn",
    body: [
      "Onchain financial products are often assembled as disconnected components: custody, stablecoin rails, wallets, tokenized assets, and sources of return. Each is real, each works, and none of them individually knows whose money it is holding.",
      "That is the gap the article is about. An institutional product has to connect those components to account ownership, reconciliation, customer balances, exception handling, and treasury policy — and the requirement can be stated in four lines. Every movement needs an account state. Every settlement needs a defined purpose. Every return needs evidence. Every distribution needs a governed destination. A component stack that cannot satisfy all four is a set of capabilities, not a product a regulated institution can operate.",
      "The lifecycle the article specifies runs: operating account, settlement, documented return, treasury distribution.",
      "The operating account establishes ownership, with the institution's core ledger as the source of truth. The design point is that the institution keeps its interface, brand, and customer relationship — USDC is the movement layer, and the bank remains the customer experience. Settlement then connects that ledger to onchain execution: batches record source accounts, purpose, amount, authorization state, and destination, with screening, sanctions controls, and whitelisting applied before release, so every movement stays connected to its originating account events and control history.",
      "The third stage is the one that distinguishes this from a payment rail. On completion, a proof-of-return record is generated and linked back to the original settlement batch, carrying the batch reference, deployed capital, destination, network, transaction identifiers, completion dates, gross return, variance, approval trail, and ledger postings. Operations and finance receive a reconciliation statement rather than reconstructing what happened from a block explorer — which is the difference between an auditable product and an interesting one.",
      "Exception handling is treated as part of the lifecycle rather than as failure. Failed settlements, delayed transactions, stuck batches, depegs, and reconciliation variances enter named states, and the customer's available balance reflects the last confirmed account event while unresolved capital remains visible as pending. Financial truth is preserved through the exception instead of being suspended until someone resolves it.",
      "Treasury distribution then applies the institution's own rules: customer principal and earned return to designated accounts, institutional revenue posted separately, the same accountable path every cycle.",
      "The boundary is explicit throughout. Sagitta orchestrates the lifecycle alongside the institution's existing banking environment; the institution retains the regulated customer relationship, the custody structure, and compliance responsibility. Sagitta does not take custody or hold customer funds.",
      "Sagitta Banking is In Development. The article describes the specified control surface and the two engagement paths — an architecture and diligence engagement, and a pilot — not a delivered integration. The full article is published on LinkedIn.",
    ],
    featured: true,
    verification: {
      status: "verified",
      source:
        "https://www.linkedin.com/pulse/account-to-treasury-lifecycle-behind-onchain-financial-xavier-moore-2gkle/ (full text read 2026-08-02)",
      lastVerifiedAt: "2026-08-02",
      note: "Canonical title, date, author, and URL are owner-supplied approved source information and are recorded verbatim. UPDATED 2026-08-02: the article body was read from LinkedIn and this record now carries a full treatment of its argument. Sagitta Banking remains In Development; the closing paragraph states that explicitly, and nothing here presents the lifecycle as a delivered integration. The article names Mifos and Apache Fineract as the core-ledger context it is designed as an add-on to; that is reported here as the article's own specification, and it does not change the artifact register, which still holds no Fineract integration document because none was found to classify. LinkedIn remains the canonical publication; no Article markup is emitted here.",
    },
    publicationState: "published",
    visibility: "public",
  },

  // SCE Wire — The Continuity Desk, Sagitta's Paragraph publication.
  {
    slug: "the-missing-layer-in-crypto-security-continuity-defense",
    title: "The Missing Layer in Crypto Security: Continuity Defense",
    summary:
      "Audits find defects and monitoring catches exploits. Neither tells an operator whether the vulnerable code is reachable on their own chain.",
    publishedAt: "2026-08-04",
    updatedAt: null,
    desk: "sce-wire",
    mediaType: "Article",
    author: "Sagitta Systems",
    systemSlug: "sagitta-continuity-engine",
    relatedSystems: ["sagitta-defense"],
    heroImage: "/paragraph/the-missing-layer-in-crypto-security-continuity-defense.jpg",
    externalUrl:
      "https://paragraph.com/@sagitta/the-missing-layer-in-crypto-security-continuity-defense",
    externalRole: "canonical",
    externalLabel: "Read on Paragraph",
    body: [
      "Crypto security is well supplied at both ends of an incident. Audits and advisories find defects before they are exploited; monitoring and incident response deal with the aftermath once they are. The article's claim is that the interval between those two — the hours in which a vulnerability is public, unpatched, and live — is served by almost nothing, and that this interval is where continuity is actually won or lost.",
      "The gap is a question of information rather than diligence. An advisory can name the affected code and recommend a patch. What it cannot tell any particular operator is whether the vulnerable feature is enabled on their chain, whether the defective path is reachable given their configuration, which of their contracts sit in front of it, or what their exposure is if it is reached. Those answers are specific to a deployment, and the advisory is written for all of them at once.",
      "The article grounds this in the Cosmos EVM ICS20 precompile flaw disclosed as ASA-2026-002, where state changes made during nested calls were not correctly carried back into the outer execution context, allowing the same balance to be spent more than once inside a single transaction. Fifteen chains were running code that contained the issue. Six had the affected feature disabled and were never exposed by it. Most of the remainder mitigated before anyone reached it. One did not, and was exploited first — an estimated loss of roughly seven million dollars.",
      "That distribution is the argument. Identical vulnerable code produced fifteen different exposures, and the variable separating them was not the presence of the defect but whether the defective path was reachable in that deployment. An operator who could answer the reachability question on the day of disclosure was in a different position from one still reading the advisory to find out whether it applied to them.",
      "Continuity defense is the name the article gives to the capability that answers it: determining whether vulnerable code is reachable, containing exposure with the controls the protocol already has, and verifying that recovery is safe before normal operation resumes. It is neither auditing nor incident response, and it does not replace either. It is the operational judgement exercised between them.",
      "The Sagitta Continuity Engine is presented as the system built to carry that work, coordinating four lanes against a live disclosure. White establishes what the protocol actually runs and where the exposure could reach. Red reproduces the conditions rather than assuming them. Blue separates the controls the protocol holds itself from those it depends on others for. Black documents what recovery would require and what evidence would show it had been achieved.",
      "What the lanes produce is the point of the exercise: a continuity record stating what was exposed, what was contained, and what was verified — the artifact a DAO, an auditor, or a counterparty can read afterwards to establish that the response was deliberate rather than fortunate. The full article is published on The Continuity Desk, Sagitta's Paragraph publication.",
    ],
    featured: true,
    verification: {
      status: "verified",
      source:
        "https://paragraph.com/@sagitta/the-missing-layer-in-crypto-security-continuity-defense (full text read 2026-08-04); ASA-2026-002 facts corroborated against https://github.com/cosmos/evm/security/advisories/GHSA-54gx-3cgr-7mfm (read 2026-08-04)",
      lastVerifiedAt: "2026-08-04",
      note: "Canonical title and publication date read from the publication's own RSS feed (Tue, 04 Aug 2026 04:02:17 GMT). The cover is the article's own cover photo, stored locally so the build does not depend on a third-party host. This record is a treatment of the article's argument in Sagitta's own words, not a reproduction of it. The ASA-2026-002 figures are the only external facts restated here and they are not taken on the article's authority: fifteen affected chains, six with the feature disabled, one exploited before mitigation, and the approximately $7M loss are all stated in the official cosmos/evm advisory, which gives the amount as an estimate — it is written here as an estimate for that reason and is not attributed to secondary incident reporting. Paragraph remains the canonical publication; no Article markup is emitted here.",
    },
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "the-three-deaths-doctrine",
    title: "The Three Deaths Doctrine",
    summary: "How Sagitta defines treasury failure as a dormant state, not a terminal collapse.",
    publishedAt: "2026-06-30",
    updatedAt: null,
    desk: "sce-wire",
    mediaType: "Article",
    author: "Sagitta Systems",
    systemSlug: "sagitta-continuity-engine",
    relatedSystems: ["sagitta-protocol"],
    heroImage: "/paragraph/the-three-deaths-doctrine.jpg",
    externalUrl: "https://paragraph.com/@sagitta/the-three-deaths-doctrine",
    externalRole: "canonical",
    externalLabel: "Read on Paragraph",
    body: [
      "Treasury design is overwhelmingly concerned with protection. The Three Deaths Doctrine starts from a different question: what happens when protection is no longer enough?",
      "The doctrine's answer is that a protocol treasury is resilient when its failure states are named, bounded, and given revival paths in advance — not when it has been engineered to make failure unlikely. Those are different properties, and the second one is the only one that is still doing any work on the day the first one is wrong.",
      "This requires being precise about what death actually means. In the doctrine's terms, death is the loss of origination capacity: when treasury value reaches zero, the protocol can no longer initiate new deposits or accept new collateral. That is treasury brain death, and it is a specific, observable condition rather than a general sense of crisis. Critically, a dead treasury does not mean a dead user. Existing obligations continue along defined paths while origination halts. The system becomes still rather than collapsing, and dormancy is treated as a disciplined design state that was specified in advance — not as the absence of a plan.",
      "The article then names three deaths, each with its own revival path. Death I is stablecoin failure: the active stablecoin collateral depegs and takes treasury value with it, and the revival path is substitution onto a replacement stablecoin base. Death II is reserve failure: the reserve assets themselves fail, and the revival path is reserve reconstruction, rebalancing around whatever survived. Death III is protocol token collapse, where the revival path is stablecoin-backed restoration that does not depend on the token's price recovering — because a recovery plan contingent on the collapsed asset recovering is not a plan.",
      "What makes this a doctrine rather than a contingency list is the standard it generalises into. Any continuity system, Sagitta's or anyone else's, should be able to answer seven questions for each of its failure states: what triggers it, what stops, what obligations continue, which assets have failed, which revival path applies, who is authorised to invoke it, and what metric verifies the return. A continuity plan that cannot answer all seven has not specified a failure state. It has expressed a hope.",
      "The full article works through each death in turn, with the specific assets and mechanisms involved, and is published on The Continuity Desk — Sagitta's Paragraph publication, described there as protocol authority and continuity research.",
    ],
    featured: true,
    verification: {
      status: "verified",
      source: "https://paragraph.com/@sagitta/the-three-deaths-doctrine (full text read 2026-08-02)",
      lastVerifiedAt: "2026-08-02",
      note: "Title and description originally read from the publication's own llms.txt index; publication date from its RSS feed (Tue, 30 Jun 2026). The cover is the article's own cover photo, taken from its og:image metadata and stored locally so the build does not depend on a third-party host. UPDATED 2026-08-02: the article body was read from Paragraph and this record now carries a full treatment of its argument, replacing the two-sentence stub that said only where the article lived. Paragraph remains the canonical publication and this record remains a pointer to it, so no Article markup is emitted here.",
    },
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "signing-authority-is-the-real-custody-layer",
    title: "Signing Authority Is the Real Custody Layer",
    summary:
      "Multisigs, timelocks, hashes, and custody providers matter. But DeFi security depends on who can authorize action, what they are signing, when it can execute, and which custody domain controls the path.",
    publishedAt: "2026-06-04",
    updatedAt: null,
    desk: "sce-wire",
    mediaType: "Article",
    author: "Sagitta Systems",
    systemSlug: "sagitta-continuity-engine",
    relatedSystems: ["sagitta-defense"],
    heroImage: "/paragraph/signing-authority-is-the-real-custody-layer.jpg",
    externalUrl: "https://paragraph.com/@sagitta/signing-authority-is-the-real-custody-layer",
    externalRole: "canonical",
    externalLabel: "Read on Paragraph",
    body: [
      "Custody in DeFi is usually discussed as a question of where assets sit. The larger custody question is authority: who can move funds, who can upgrade contracts, and who can pause markets. A protocol can hold strong technical safeguards and still carry unresolved custody risk if the signing path is unclear.",
      "Two questions frame the whole subject, and the distance between them separates a basic reading from a real analysis. The first is who holds the keys. The second is what those keys can authorise.",
      "Multisigs are where most reviews stop. They are genuinely valuable — shared authorisation reduces single-signer dependency — but a multisig is one part of the custody model, not the model itself. Are the signers actually independent? How are the keys stored? Which contracts can that multisig reach? The custody question starts with the multisig. It does not end there.",
      "Timelocks add the temporal dimension: where a multisig governs who approves, a timelock governs when approval can become execution, creating a reaction window before a sensitive action goes live. Their value is entirely a function of implementation — which actions actually route through them, who can queue and execute, and whether anyone is monitoring the queue at all. A timelock nobody watches is a delay, not a control.",
      "Signatures prove intent, not safety. A signature authorises a message, so the next question is always the message: typed data, a permit, an offchain authorisation? A strong hash protects the message that was actually signed, and nothing more. Cryptography proves integrity; continuity review asks whether the authorised action was bounded, reviewable, and tied to the right custody domain.",
      "That word — domain — carries the argument. A protocol contains many: the treasury Safe, the emergency pause authority, the oracle updater, the bridge operator, the governance timelock. Each has its own authority and its own blast radius, and the risk compounds where one domain appears across several critical paths at once. A single Safe that controls treasury, upgrades, oracle configuration, and emergency pause is not four controls; it is one control wearing four labels. This is why a project map matters, and why it has to show where authority repeats and where control paths converge rather than simply listing contracts.",
      "The article extends the same logic through the signing interface — a signer with excellent key custody can still approve a dangerous action if the transaction builder presented incomplete context — through modules, guards, session keys, relayers, and keepers as alternate execution routes, and through cross-chain systems, where an action may be authorised on one chain and executed on another.",
      "It closes on the distinction between observable and evidential authority. A public call can confirm a specific fact; operating evidence explains the control behind it. The full text is on Paragraph.",
    ],
    featured: false,
    verification: {
      status: "verified",
      source:
        "https://paragraph.com/@sagitta/signing-authority-is-the-real-custody-layer (full text read 2026-08-02)",
      lastVerifiedAt: "2026-08-02",
      note: "Title and description originally read from the publication's own llms.txt index; publication date from its RSS feed (Thu, 04 Jun 2026). The cover is the article's own cover photo from its og:image metadata. UPDATED 2026-08-02: the article body was read from Paragraph and this record now carries a full treatment of its argument. Paragraph remains the canonical publication; no Article markup is emitted here.",
    },
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "what-a-public-surface-authority-review-actually-proves",
    title: "What a Public-Surface Authority Review Actually Proves",
    summary: "A detector can observe authority evidence. It cannot prove operational control.",
    publishedAt: "2026-05-26",
    updatedAt: null,
    desk: "sce-wire",
    mediaType: "Article",
    author: "Sagitta Systems",
    systemSlug: "sagitta-continuity-engine",
    relatedSystems: ["sagitta-defense"],
    heroImage: "/paragraph/what-a-public-surface-authority-review-actually-proves.jpg",
    externalUrl:
      "https://paragraph.com/@sagitta/what-a-public-surface-authority-review-actually-proves",
    externalRole: "canonical",
    externalLabel: "Read on Paragraph",
    body: [
      "A detector can observe authority evidence. It cannot prove operational control. That sentence is the whole argument, and the article is an examination of how much follows from it.",
      "Onchain systems are unusually legible, and a public-surface review can read a great deal without asking anyone's permission. A contract may expose an `owner()` call. A proxy may expose an implementation slot or an admin slot. Owner addresses, proxy paths, multisig structures, timelock delays, oracle behaviour, and role systems are all observable from the outside. These are real observations and they matter.",
      "The limitation is that each observation only proves what it was designed to observe. An owner address establishes that an address owns the contract. It does not establish who controls that address, whether the signer policy behind it is sound, or what happens in an emergency. A timelock establishes a delay. It does not establish governance intent, cancellation policy, or whether an emergency bypass exists.",
      "The mistake, then, is treating visibility as verification — seeing an owner and assuming the authority path is understood, seeing a timelock and assuming governance is safe. The observation was never wrong. The inference drawn from it was.",
      "This matters because of where continuity risk actually lives: in the gap between what a contract exposes and how a team operates it. Signer procedures, upgrade approval, treasury movement, incident response — the real controls are operating policies, and operating policies are invisible to public evidence by their nature. No amount of care in reading the chain will surface them, because they were never written to the chain.",
      "The method the article sets out handles this by classifying every finding rather than flattening it: Observed, Inferred, Unresolved, or Evidence Required. The classification is the discipline. It makes a review incapable of claiming more than its evidence supports, because every claim has to declare which of the four it is before it can be stated at all.",
      "The consequence is a standard that cuts in the direction reviewers usually find uncomfortable. A Defense Review should not inflate severity just because evidence is missing, and it should not turn unresolved authority into a vulnerability claim. An unanswered question is an unanswered question. Reporting it as a finding would be the same error as treating visibility as verification, committed in the opposite direction — and it is the more tempting of the two, because it looks like rigour.",
      "The full article is published on The Continuity Desk, Sagitta's Paragraph publication.",
    ],
    featured: false,
    verification: {
      status: "verified",
      source:
        "https://paragraph.com/@sagitta/what-a-public-surface-authority-review-actually-proves (full text read 2026-08-02)",
      lastVerifiedAt: "2026-08-02",
      note: "Title and description originally read from the publication's own llms.txt index; publication date from its RSS feed (Tue, 26 May 2026). The cover is the article's own cover photo from its og:image metadata. UPDATED 2026-08-02: the article body was read from Paragraph and this record now carries a full treatment of its argument. Paragraph remains the canonical publication; no Article markup is emitted here.",
    },
    publicationState: "published",
    visibility: "public",
  },

  // Allocation Desk — the first published video.
  {
    slug: "introducing-selun",
    title: "Introducing Selun",
    summary:
      "The first published Sagitta video: a short introduction to Selun, the guided allocation product built on the Autonomous Allocation Agent.",
    publishedAt: "2026-03-28",
    videoUploadDate: "2026-03-28T23:05:48Z",
    updatedAt: null,
    desk: "allocation-read",
    mediaType: "Video",
    author: "Sagitta Labs",
    systemSlug: "selun",
    relatedSystems: ["aaa"],
    heroImage: "/watch/introducing-selun.jpg",
    externalUrl: "https://www.youtube.com/watch?v=SHecO67AqfM",
    externalRole: "canonical",
    externalLabel: "Watch on YouTube",
    body: [
      "The first published Sagitta video, running 41 seconds on the Sagitta Labs YouTube channel.",
      "Selun is the guided allocation product built on the Autonomous Allocation Agent. Where AAA is the policy and allocation foundation that institutions configure and operate, Selun is the service that puts the same reasoning in front of an individual: a guided wizard that takes a stated position and returns an allocation plan, with card and onchain USDC settlement.",
      "The design premise is that the reasoning should not be reserved for the institutional tier. The constraint logic, the regime awareness, and the determinism that make an AAA decision reconstructable are the same properties that make a personal allocation plan worth acting on — the difference between the two products is the surface and the authority granted, not the quality of the analysis underneath.",
      "Selun is Operating. Its x402 capability publishes a machine-readable discovery document advertising pay-per-call endpoints that an agent can call and settle without a human account, which makes it the point in the network where the allocation intelligence is reachable both by a person working through a wizard and by software with no interface at all.",
      "This record describes what Selun is, from the Selun and AAA system records. It does not summarise the video's narration, which was not transcribed. The video plays on YouTube, and no audience figure is republished — none was read from the source.",
    ],
    featured: true,
    verification: verifiedJul31(
      "https://www.youtube.com/watch?v=SHecO67AqfM (title and channel resolved via YouTube's oEmbed endpoint)",
      "Exact title 'Introducing Selun' and channel name 'Sagitta Labs' resolved from oEmbed. Duration 0:41 is owner-supplied approved source information. DATE RESOLVED 2026-08-02 by owner decision: the published date is 2026-03-28, the channel's own RSS feed timestamp (2026-03-28T23:05:48Z) and the date a reader checking the video sees. The owner-supplied 2026-03-19 was the production date and is not a publication date; it is recorded here for provenance and is not published anywhere on the site. The site now states the same date as the source it links to, which is the rule the rest of this file follows. The poster is YouTube's own thumbnail for this video id, stored locally.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  {
    slug: "sagitta-protocol-overview",
    title: "Sagitta Protocol Overview | Trustless Wealth Management Infrastructure",
    summary:
      "A video overview of the Sagitta Protocol architecture — the Vault, Treasury, Reserve, and Escrow, and the doctrine behind treating capital protection as a system requirement rather than an operator promise.",
    publishedAt: "2026-04-18",
    videoUploadDate: "2026-04-18T22:37:45Z",
    updatedAt: null,
    desk: "continuity-desk",
    mediaType: "Video",
    author: "Sagitta Labs",
    systemSlug: "sagitta-protocol",
    relatedSystems: ["aaa", "sagitta-continuity-engine"],
    heroImage: "/watch/protocol-overview.jpg",
    externalUrl: "https://www.youtube.com/watch?v=PabWDk6I-HI",
    externalRole: "canonical",
    externalLabel: "Watch on YouTube",
    body: [
      "A video overview of the Sagitta Protocol architecture, published on the Sagitta Labs YouTube channel.",
      "The protocol's subject is trustless wealth management infrastructure: holding, allocating, and recovering capital under rules that are enforced by the system rather than promised by an operator. Its components divide the work. The Vault handles custody and accounting. The Treasury manages liquidity and settlement. The Reserve is a gold-backed insurance layer. Escrow is the interface to external allocation venues, so capital leaving for a third-party venue crosses a boundary that was designed rather than improvised.",
      "Two intelligence systems are embedded as components rather than integrations. The Autonomous Allocation Agent decides where capital goes, inside a policy agreed in advance. The Sagitta Continuity Engine governs what happens when something fails — which is the half of the design most protocols leave to incident response.",
      "The organising claim is that fiduciary responsibility should be enforced through architecture instead of operator discretion, and that capital safety ranks above yield optimisation where the two conflict. That ordering is the whole argument: a system that will take a smaller return in exchange for surviving a bad month is making a different promise from one that will not, and the promise is only credible if the architecture is what enforces it.",
      "This is not a deployment announcement. Sagitta Protocol remains in Public Test on Moonbase Alpha Testnet and Arc Testnet, and no mainnet deployment or contract addresses are published.",
      "This record describes the protocol from its own system record and the whitepaper, not from the video's narration, which was not transcribed. No runtime is recorded, because none was published by the source.",
    ],
    featured: false,
    verification: verifiedJul31(
      "https://www.youtube.com/watch?v=PabWDk6I-HI (title and channel via YouTube oEmbed; date via the channel's RSS feed)",
      "Exact title and channel name resolved from oEmbed. The publication date is the channel feed's own published timestamp (2026-04-18T22:37:45Z). No duration is recorded: oEmbed does not return one and none was read elsewhere, so the field is omitted rather than estimated. The summary describes the subject from the Sagitta Protocol record, not from unread narration.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // Continuity Desk — the verified release milestones.
  {
    slug: "sagitta-radar-launched",
    title: "Sagitta Radar launched",
    summary:
      "Sagitta Radar launched on 28 July 2026, monitoring oracle freshness, bridge settlement, and liquidity-pool depth for the protocols that depend on them.",
    publishedAt: "2026-07-28",
    updatedAt: null,
    desk: "continuity-desk",
    mediaType: "System Update",
    author: "Sagitta Systems",
    systemSlug: "sagitta-radar",
    relatedSystems: ["sagitta-continuity-engine"],
    externalUrl: "https://radar.sagitta.systems",
    externalRole: "reference",
    externalLabel: "Open radar.sagitta.systems",
    body: [
      "Sagitta Radar launched on 28 July 2026. It watches three pillars of external dependency — oracle price freshness and deviation, bridge route settlement and pauses, and liquidity-pool depth and imbalance — and delivers signals as alerts and as structured daily briefings.",
      "The three pillars are not an arbitrary selection. They are the dependencies a protocol does not own and cannot fix. A team can audit its own contracts, rehearse its own incident response, and rewrite its own governance; it cannot make an oracle publish a fresh price, cannot make a bridge settle, and cannot conjure depth into a pool that has thinned. Those are the failure paths that arrive from outside, on someone else's schedule, and they are the ones a protocol is least likely to be watching at the moment they matter.",
      "Radar runs on the Sagitta Continuity Engine backend, which is what connects an infrastructure signal to continuity doctrine rather than leaving it as an isolated alert. The distinction is the product's reason for existing. An alert that a bridge has paused is information. The same alert, read against a doctrine that already names what a paused settlement route means for this protocol and what it should do next, is a decision — and the gap between those two is usually where the damage happens.",
      "Delivery is to Discord, Telegram, and webhooks, which is a deliberate choice to meet operators where incidents are actually handled rather than requiring anyone to be watching a dashboard at the time.",
      "Subscription plans and current pricing are published on the product page and are deliberately not restated here: they move, and a figure republished on an evergreen record is a figure that will eventually be wrong.",
    ],
    featured: true,
    verification: verifiedJul31(
      "https://radar.sagitta.systems + owner-supplied launch date (2026-07-31)",
      "The launch date is owner-supplied approved source information; the live product independently confirms the coverage pillars and delivery channels. This supersedes the earlier record, which was explicitly a dated verification check rather than a launch because no launch date had been supplied at that point.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "sagitta-protocol-launched-on-moonbase-alpha-testnet",
    title: "Sagitta Protocol launched on Moonbase Alpha Testnet",
    summary:
      "Sagitta Protocol launched on Moonbase Alpha Testnet on 13 April 2026, with Polkadot-native deposits crossing into Moonbeam as xcDOT and accepted directly by the Vault.",
    publishedAt: "2026-04-13",
    updatedAt: null,
    desk: "continuity-desk",
    mediaType: "System Update",
    author: "Sagitta Systems",
    systemSlug: "sagitta-protocol",
    relatedSystems: ["aaa", "sagitta-continuity-engine"],
    externalUrl: "https://protocol.sagitta.systems",
    externalRole: "reference",
    externalLabel: "Open protocol.sagitta.systems",
    body: [
      "Sagitta Protocol launched on Moonbase Alpha Testnet — the Moonbeam testnet — on 13 April 2026. The interface reports v0.1 active there.",
      "Deposits on this deployment are Polkadot-native: DOT crosses into Moonbeam as xcDOT via XCM and is accepted directly by the Vault. That last clause is the substance of the milestone. Accepting a cross-consensus asset directly, rather than requiring a holder to bridge and wrap it into something the Vault already understood, means the custody and accounting layer treats an asset that arrived over XCM as a first-class deposit — with the same ownership record and the same accounting treatment as any other.",
      "What this deployment demonstrates is therefore narrow and specific: that the Vault's deposit path works against a real cross-chain asset on a live network, with real transaction semantics rather than a local simulation. It does not demonstrate allocation performance, continuity behaviour under stress, or economic assumptions, none of which a testnet can evidence.",
      "This is a testnet deployment. No mainnet deployment or contract addresses are published, and the protocol's operating state remains Public Test.",
      "It is also one of two separate Protocol milestones. The Arc Testnet launch of 11 May 2026 is recorded on its own and the two are deliberately never merged into a single launch narrative.",
    ],
    featured: false,
    verification: verifiedJul31(
      "https://protocol.sagitta.systems + owner-supplied launch date (2026-07-31)",
      "The launch date is owner-supplied approved source information; the live interface independently confirms v0.1 active on Moonbase Alpha. 'Testnet' is carried in the title, the summary, and every state claim. This is one of two separate Protocol milestones and is deliberately not merged with the Arc Testnet launch.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "sagitta-protocol-launched-on-arc-testnet",
    title: "Sagitta Protocol launched on Arc Testnet",
    summary:
      "Sagitta Protocol launched on Arc Testnet on 11 May 2026 — a second testnet deployment, alongside Moonbase Alpha Testnet.",
    publishedAt: "2026-05-11",
    updatedAt: null,
    desk: "continuity-desk",
    mediaType: "System Update",
    author: "Sagitta Systems",
    systemSlug: "sagitta-protocol",
    relatedSystems: ["sagitta-banking"],
    externalUrl: "https://protocol.sagitta.systems",
    externalRole: "reference",
    externalLabel: "Open protocol.sagitta.systems",
    body: [
      "Sagitta Protocol launched on Arc Testnet on 11 May 2026. It is a separate milestone from the Moonbase Alpha Testnet launch of 13 April 2026, not a continuation of it.",
      "The distinction is kept deliberately, and it is worth stating why rather than leaving it as a formality. Two testnet deployments on two networks are two pieces of evidence about two environments. Merging them into a single narrative would imply a portability claim — that what runs in one place runs in the other — which neither deployment establishes and which nothing in the record supports. Each launch evidences itself.",
      "This record therefore states the launch and stops. No claim is made about which components are exercised on Arc, what assets its deposit path accepts, or how it relates to the Polkadot-native deposit route recorded on the Moonbase Alpha Testnet deployment, because none of that was verified. Where a fact was not read from a source, the record is silent rather than reasoning by analogy from the other deployment.",
      "Both deployments are testnets. No mainnet deployment or contract addresses are published, and the protocol's operating state remains Public Test.",
    ],
    featured: true,
    verification: verifiedJul31(
      "https://protocol.sagitta.systems + owner-supplied launch date (2026-07-31)",
      "The launch date is owner-supplied approved source information. 'Testnet' is carried in the title, the summary, and the body. Recorded as a distinct milestone from the Moonbase Alpha Testnet launch; no claim is made about what runs on Arc beyond the launch itself, because nothing further was verified.",
    ),
    publicationState: "published",
    visibility: "public",
  },
];

// ─── Queries ─────────────────────────────────────────────────────────────────

/** Newest first; undated records follow, alphabetically. */
export function sortByDate(entries: NewsroomEntry[]): NewsroomEntry[] {
  return [...entries].sort((a, b) => {
    if (a.publishedAt && b.publishedAt) return b.publishedAt.localeCompare(a.publishedAt);
    if (a.publishedAt) return -1;
    if (b.publishedAt) return 1;
    return a.title.localeCompare(b.title);
  });
}

/**
 * The only list any public feed, filter, or count may use. Draft, upcoming,
 * archived, and internal records never reach the reader.
 */
export const publishedEntries = sortByDate(
  newsroomEntries.filter((e) => e.publicationState === "published" && e.visibility === "public"),
);

/** Plain-text form used by RSS and content-quality checks. */
export function newsroomBodyText(body: NewsroomBodyBlock[]): string {
  return body
    .map((block) => {
      if (typeof block === "string") return block.replace(/\*\*/g, "");
      if (block.kind === "heading" || block.kind === "note") return block.text;
      return [block.caption, block.columns.join(" | "), ...block.rows.map((row) => row.join(" | "))]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

export function getNewsroomEntry(slug: string): NewsroomEntry | undefined {
  return newsroomEntries.find((e) => e.slug === slug);
}

/** One canonical route for cards, feeds, metadata, citations, and sitemaps. */
export function newsroomEntryPath(entry: NewsroomEntry): string {
  return entry.canonicalPath ?? `/newsroom/${entry.slug}`;
}

/** Media types that actually have published records behind them. */
export const publishedMediaTypes = mediaTypes.filter((type) =>
  publishedEntries.some((e) => e.mediaType === type),
);

export const latestEntries = publishedEntries;

/**
 * The lead story is chosen editorially, not by date. Dated status checks sort
 * to the top of the feed by recency, but a verification record is not the
 * network's headline — a real launch is.
 */
const LEAD_STORY_SLUG = "sagitta-radar-launched";

export const leadStory =
  publishedEntries.find((e) => e.slug === LEAD_STORY_SLUG) ??
  publishedEntries.find((e) => e.featured) ??
  publishedEntries[0];
