import type {
  DecisionLens,
  PromotionChannel,
  PromotionChannelRecord,
  PromotionFormat,
  PromotionPlacement,
  PromotionRecord,
  Verification,
} from "./types";

// Promotions — the editorial layer behind the homepage.
//
// The homepage promotes the latest reason to enter each system. It does not
// explain the systems: the system pages do that. Every record below is assembled
// from material that already exists on the public record — a launch that
// happened, a figure a Sagitta surface publishes, an article that resolves at
// its own URL, a video that plays, an interface that runs.
//
// Four rules govern this file:
//
//   1. A promotion has a real subject and a real destination, or it does not
//      exist. Nothing here is written to fill a stage.
//   2. A promotion never promises more than the system's operating state
//      supports. Sagitta Protocol is in public test, so it is explored, not
//      opened, and every Protocol state claim carries "Testnet".
//   3. A moving value is published with the date it was read and is labelled a
//      snapshot. A standing figure the product keeps current is published as a
//      rollup, at a threshold, with no invented as-of date.
//   4. A canonical title is recorded verbatim in `headline`. Where a stage
//      cannot set it well, `displayHeadline` carries an approved shorter form
//      and the canonical title stays available to the reader.
//
// ── The 2026-07-31 real-content pass ────────────────────────────────────────
//
// This file previously held twelve promotions assembled entirely from Sagitta's
// own product surfaces, because no off-site publishing was recorded anywhere in
// the repository. That was true when it was written and is no longer true. The
// collection now draws on:
//
//   Paragraph  The Continuity Desk — four articles, resolved from the
//              publication's RSS feed and per-article og metadata.
//   LinkedIn   Two founder articles, owner-supplied with canonical titles.
//   YouTube    "Introducing Selun", title and channel resolved via oEmbed.
//   X          Four launch and system posts on @SagittaSystems.
//   Milestones Radar's launch, and Protocol's two separate testnet launches.
//
// Formats with no real Sagitta asset — use cases, audio briefings, case
// studies, external coverage, event appearances — are modelled by the type
// layer and tracked in PROMOTION_COVERAGE.md. They hold no record here.

const VERIFIED_ON = "2026-07-29";
const VERIFIED_JUL_31 = "2026-07-31";
const VERIFIED_AUG_4 = "2026-08-04";

function verified(source: string, note?: string): Verification {
  return { status: "verified", source, lastVerifiedAt: VERIFIED_ON, note };
}

/** Verified in the 2026-07-31 real-content pass. */
function verifiedJul31(source: string, note?: string): Verification {
  return { status: "verified", source, lastVerifiedAt: VERIFIED_JUL_31, note };
}

/** Verified in the 2026-08-04 pass that staged the fourth Continuity Desk article. */
function verifiedAug4(source: string, note?: string): Verification {
  return { status: "verified", source, lastVerifiedAt: VERIFIED_AUG_4, note };
}

const WHITEPAPER = "https://sagitta-protocol.gitbook.io/sagitta-whitepaper";
const YOUTUBE_SELUN = "https://www.youtube.com/watch?v=SHecO67AqfM";
const YOUTUBE_PROTOCOL = "https://www.youtube.com/watch?v=PabWDk6I-HI";

/**
 * The thirteen formats, each with its editorial label and the stage it is built
 * for. This is the model's own record that the format set is complete, and it is
 * what PROMOTION_COVERAGE.md is written against.
 */
export const promotionFormats: {
  id: PromotionFormat;
  label: string;
  /** The placements this format is designed to be staged in. */
  stages: PromotionPlacement[];
}[] = [
  { id: "live-signal", label: "Live metric or signal", stages: ["signal-strip", "product-feature"] },
  { id: "alert-status", label: "Alert or status update", stages: ["signal-strip", "lead-carousel", "network-headlines"] },
  { id: "launch-milestone", label: "Launch or milestone", stages: ["lead-carousel", "cinematic-feature", "network-headlines"] },
  { id: "product-interface", label: "Product interface or demonstration", stages: ["product-feature", "lead-carousel"] },
  { id: "use-case", label: "Use case or market reaction", stages: ["product-feature", "lead-carousel"] },
  { id: "article", label: "Article or founder perspective", stages: ["network-headlines", "lead-carousel"] },
  { id: "research-report", label: "Research report or data brief", stages: ["lead-carousel", "cinematic-feature", "network-headlines"] },
  { id: "social-post", label: "Social post", stages: ["network-headlines"] },
  { id: "video-episode", label: "Video episode", stages: ["video-feature", "lead-carousel"] },
  { id: "audio-briefing", label: "Audio briefing or podcast", stages: ["network-headlines", "video-feature"] },
  { id: "case-study", label: "Case study, result, or testimony", stages: ["cinematic-feature", "product-feature"] },
  { id: "external-coverage", label: "Press or external coverage", stages: ["network-headlines", "cinematic-feature"] },
  { id: "event-appearance", label: "Event, interview, or presentation", stages: ["network-headlines", "video-feature"] },
];

/**
 * The channels Sagitta publishes on, with the destination that proves each one.
 *
 * Held here rather than in component markup so a channel's label and its URL
 * cannot drift apart across the stages that render them. A channel is `active`
 * only where a real publication on it is on the record, and it carries a `url`
 * only where a public channel home was actually resolved — LinkedIn is active
 * through two published articles, but no verified channel home was read, so it
 * has none.
 */
export const promotionChannelRecords: PromotionChannelRecord[] = [
  {
    id: "sagitta-systems",
    label: "Sagitta Systems",
    url: "https://www.sagitta.systems",
    active: true,
    verification: verified("This site"),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "sagitta-product",
    label: "Sagitta product",
    active: true,
    verification: verified("The operating Sagitta product surfaces"),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "x",
    label: "X",
    accountName: "@SagittaSystems",
    url: "https://x.com/SagittaSystems",
    active: true,
    verification: verifiedJul31(
      "https://x.com/SagittaSystems + four owner-supplied post URLs",
      "Four real posts are on the record: the AAA, Selun, and Sagitta Defense launches, and a Protocol continuity post. Post dates were supplied by the owner for three of the four; X publishes no machine-readable metadata that could be read here, so the fourth carries no date and is kept out of any placement that requires one. No post wording is reproduced anywhere on the site.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    accountName: "Xavier D. Moore",
    url: "https://www.linkedin.com/in/xaviermoore",
    active: true,
    verification: {
      status: "verified",
      source:
        "https://www.linkedin.com/in/xaviermoore, resolved 2026-08-02 from the byline of https://www.linkedin.com/pulse/risk-policy-only-real-when-constrains-decision-xavier-moore-adcqe/ and confirmed against the profile itself",
      lastVerifiedAt: "2026-08-02",
      note: "The channel home was previously unrecorded because no profile URL had been resolved and inferring one from an article slug would have been a guess. It has now been read from the article byline and confirmed on the profile page, which returns Xavier Moore at Sagitta Labs. This is a personal profile, not a Sagitta Systems account: it carries the follow path for the two founder articles, and it is deliberately excluded from the Organization `sameAs` set for the same reason the YouTube channel is — see src/lib/jsonld.ts. It reaches structured data through `personLd` instead, which is where a person's profile belongs.",
    },
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "youtube",
    label: "YouTube",
    accountName: "Sagitta Labs",
    url: "https://www.youtube.com/@SagittaLabs",
    active: true,
    verification: verifiedJul31(
      "https://www.youtube.com/watch?v=SHecO67AqfM via YouTube oEmbed",
      "Channel name and channel URL both returned by oEmbed as author_name and author_url for the published video. One video is on the record.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "paragraph",
    label: "Paragraph",
    accountName: "The Continuity Desk",
    url: "https://paragraph.com/@sagitta",
    active: true,
    verification: verifiedJul31(
      "https://paragraph.com/@sagitta + its llms.txt index and RSS feed",
      "Publication name 'The Continuity Desk' and its description read from the publication's own index. Three articles resolve publicly; each promotion links to its own article URL, never to the publication page or an authoring dashboard.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "external-publication",
    label: "External publication",
    active: true,
    verification: verified("https://sagitta-protocol.gitbook.io/sagitta-whitepaper"),
    publicationState: "published",
    visibility: "public",
  },
];

/** Channel labels, as they are rendered in an eyebrow or a headline row. */
export const channelLabels: Record<PromotionChannel, string> = Object.fromEntries(
  promotionChannelRecords.map((c) => [c.id, c.label]),
) as Record<PromotionChannel, string>;

export function getChannel(id: PromotionChannel): PromotionChannelRecord | undefined {
  return promotionChannelRecords.find((c) => c.id === id);
}

/** Channels Sagitta currently publishes on. */
export const activeChannels = promotionChannelRecords.filter((c) => c.active);

/**
 * Which systems serve which decision. Editorial routing only — the mapping
 * decides where a promotion sends a reader, and is never rendered as a taxonomy.
 *
 * Corrected on 2026-07-31: Selun x402 is a capability of Selun and routes
 * through it; the Treasury Decision Desk is not a Sagitta system and has been
 * removed; Sagitta Wallet is concept-stage and routes nothing, so it appears in
 * no lens.
 */
export const decisionLenses: { id: DecisionLens; label: string; systemSlugs: string[] }[] = [
  { id: "fund-allocation", label: "Fund allocation", systemSlugs: ["aaa", "selun"] },
  {
    id: "policy-governance",
    label: "Policy governance",
    systemSlugs: ["aaa", "sagitta-protocol"],
  },
  { id: "sector-portfolios", label: "Sector portfolios", systemSlugs: ["selun", "aaa"] },
  {
    id: "defi-health",
    label: "DeFi health and alerts",
    systemSlugs: ["sagitta-radar", "sagitta-continuity-engine"],
  },
  {
    id: "protocol-readiness",
    label: "Protocol readiness",
    systemSlugs: ["sagitta-continuity-engine", "sagitta-defense"],
  },
  {
    id: "cve-defense",
    label: "CVE defense",
    systemSlugs: ["sagitta-defense", "sagitta-continuity-engine", "sagitta-radar"],
  },
  {
    id: "onchain-banking",
    label: "Onchain banking",
    systemSlugs: ["sagitta-banking", "sagitta-protocol"],
  },
  {
    id: "crypto-functionality",
    label: "Crypto functionality",
    systemSlugs: ["selun", "sagitta-protocol"],
  },
];

export const promotions: PromotionRecord[] = [
  // ── Lead carousel ──────────────────────────────────────────────────────────
  //
  // Five editorially ordered stories. Order is not chronological: the Radar
  // launch leads because it is the network's most consequential current fact,
  // and the 30 July article — the most recent thing on the page — sits third.
  {
    id: "radar-launched",
    format: "launch-milestone",
    channel: "sagitta-product",
    placement: "lead-carousel",
    systemSlugs: ["sagitta-radar", "sagitta-continuity-engine"],
    lens: ["defi-health", "cve-defense"],
    audience: ["Protocol teams", "Infrastructure operators", "Treasury operators"],
    eyebrow: "Sagitta Radar · Launch",
    headline: "The infrastructure you depend on is being watched.",
    context:
      "Radar launched on 28 July 2026, monitoring oracle freshness, bridge settlement, and liquidity-pool depth for the protocols that rely on them.",
    publishedAt: "2026-07-28",
    sourceName: "radar.sagitta.systems",
    sourceUrl: "https://radar.sagitta.systems",
    action: {
      id: "promo:radar-launched:open",
      label: "Open Sagitta Radar",
      href: "https://radar.sagitta.systems",
      external: true,
      type: "open-product",
      availability: "available",
      audience: "Protocol teams and infrastructure operators",
    },
    media: {
      kind: "system-mark",
      src: "/sce.webp",
      alt: "The Sagitta Continuity Engine mark, the backend Sagitta Radar runs on.",
      fit: "contain",
    },
    priority: 1,
    state: "active",
    canonicalRecord: "/newsroom/sagitta-radar-launched",
    verification: verifiedJul31(
      "https://radar.sagitta.systems + owner-supplied launch date + /newsroom/sagitta-radar-launched",
      "Launch date owner-supplied; coverage pillars and delivery channels read from the live product. Replaces the previous 'coverage verified' alert, which existed only because no launch date had been supplied. Plan prices deliberately not quoted — they move and are published on the product page.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "defense-now-operating",
    format: "launch-milestone",
    channel: "sagitta-product",
    placement: "lead-carousel",
    systemSlugs: ["sagitta-defense", "sagitta-continuity-engine"],
    lens: ["cve-defense", "protocol-readiness"],
    audience: ["Protocol teams", "DAOs", "Treasury operators"],
    eyebrow: "Sagitta Defense · Launch",
    headline: "Sagitta Defense is operating.",
    context:
      "A fixed-scope review maps whether your protocol survives control failure — published at a flat $3,000, typically delivered in seven days.",
    publishedAt: "2026-05-06",
    sourceName: "defense.sagitta.systems",
    sourceUrl: "https://defense.sagitta.systems",
    action: {
      id: "promo:defense-now-operating:launch-details",
      label: "View launch details",
      href: "/newsroom/sagitta-defense-now-operating",
      type: "evidence",
      availability: "available",
      audience: "Protocol teams, DAOs, and treasury operators",
    },
    media: {
      kind: "system-mark",
      src: "/defense.webp",
      alt: "The Sagitta Defense mark: a gold shield carrying a violet infinity figure.",
      fit: "contain",
    },
    priority: 2,
    state: "active",
    verification: verified(
      "https://defense.sagitta.systems + /newsroom/sagitta-defense-now-operating",
      "Promotes the dated launch record. Fee and delivery read from the live service page; the launch date is the commit that published the service (d3f2cd4, 2026-05-06), and is independently corroborated by the launch post on X of the same date.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "continuity-defense-missing-layer",
    format: "article",
    channel: "paragraph",
    placement: "lead-carousel",
    systemSlugs: ["sagitta-continuity-engine", "sagitta-defense"],
    lens: ["cve-defense", "protocol-readiness"],
    audience: ["Protocol teams", "Security leads", "DAOs", "Auditors"],
    eyebrow: "Paragraph · The Continuity Desk",
    headline: "The Missing Layer in Crypto Security: Continuity Defense",
    context:
      "Audits find the defect and monitoring catches the exploit, but neither answers whether the vulnerable path is reachable on your chain.",
    publishedAt: "2026-08-04",
    sourceName: "The Continuity Desk",
    action: {
      id: "promo:continuity-defense-missing-layer:read",
      label: "Read the article on Paragraph",
      href: "https://paragraph.com/@sagitta/the-missing-layer-in-crypto-security-continuity-defense",
      external: true,
      type: "research",
      availability: "available",
      audience: "Protocol teams, security leads, DAOs, and auditors",
    },
    media: {
      kind: "article-cover",
      src: "/paragraph/the-missing-layer-in-crypto-security-continuity-defense.jpg",
      alt: "Cover art published with The Missing Layer in Crypto Security: Continuity Defense on The Continuity Desk.",
      fit: "cover",
    },
    priority: 3,
    state: "active",
    canonicalRecord: "/newsroom/the-missing-layer-in-crypto-security-continuity-defense",
    verification: verifiedAug4(
      "https://paragraph.com/@sagitta/the-missing-layer-in-crypto-security-continuity-defense",
      "Canonical title and date read from the publication's own RSS feed (Tue, 04 Aug 2026). The cover is the article's real cover photo, stored locally. The context line states the article's own argument and quotes no figure: the ASA-2026-002 facts the article turns on are carried by the newsroom record, where they are sourced to the official cosmos/evm advisory. The destination is the article, never the publication page.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "aaa-risk-policy-article",
    format: "article",
    channel: "linkedin",
    placement: "lead-carousel",
    systemSlugs: ["aaa"],
    lens: ["policy-governance", "fund-allocation"],
    audience: ["DAOs", "Treasury operators", "Portfolio managers", "Funds"],
    eyebrow: "LinkedIn · Xavier D. Moore",
    headline: "A Risk Policy Is Only Real When It Constrains the Decision",
    context:
      "The position the Autonomous Allocation Agent is built on: authority precedes automation.",
    publishedAt: "2026-07-30",
    sourceName: "LinkedIn",
    action: {
      id: "promo:aaa-risk-policy-article:read",
      label: "Read the article on LinkedIn",
      href: "https://www.linkedin.com/pulse/risk-policy-only-real-when-constrains-decision-xavier-moore-adcqe/",
      external: true,
      type: "research",
      availability: "available",
      audience: "DAOs, treasury operators, and portfolio managers",
    },
    media: {
      kind: "system-mark",
      src: "/aaa.png",
      alt: "The Autonomous Allocation Agent mark.",
      fit: "contain",
    },
    priority: 4,
    state: "active",
    canonicalRecord: "/newsroom/risk-policy-is-only-real-when-it-constrains-the-decision",
    verification: verifiedJul31(
      "https://www.linkedin.com/pulse/risk-policy-only-real-when-constrains-decision-xavier-moore-adcqe/",
      "Canonical title recorded verbatim and rendered as published — the carousel gives a headline enough room that no shortened form is needed. Date, author, and URL are owner-supplied approved source information. The context line describes AAA's published position, not unread article text.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "protocol-arc-testnet",
    format: "launch-milestone",
    channel: "sagitta-product",
    placement: "lead-carousel",
    systemSlugs: ["sagitta-protocol", "sagitta-banking"],
    lens: ["onchain-banking", "crypto-functionality"],
    audience: ["Protocol teams", "Funds", "Researchers"],
    eyebrow: "Sagitta Protocol · Launch",
    headline: "Sagitta Protocol launched on Arc Testnet.",
    context:
      "A second testnet deployment, 11 May 2026, alongside the Moonbase Alpha Testnet launch of 13 April.",
    publishedAt: "2026-05-11",
    sourceName: "protocol.sagitta.systems",
    sourceUrl: "https://protocol.sagitta.systems",
    action: {
      id: "promo:protocol-arc-testnet:explore",
      label: "Explore the public test",
      href: "https://protocol.sagitta.systems",
      external: true,
      type: "demonstration",
      availability: "available",
      audience: "Protocol teams, funds, and researchers",
      note: "Both deployments are testnets. No mainnet deployment or contract addresses are published.",
    },
    media: {
      kind: "system-mark",
      src: "/protocol.webp",
      alt: "The Sagitta Protocol mark.",
      fit: "contain",
    },
    priority: 5,
    state: "active",
    canonicalRecord: "/newsroom/sagitta-protocol-launched-on-arc-testnet",
    verification: verifiedJul31(
      "https://protocol.sagitta.systems + owner-supplied launch date + /newsroom/sagitta-protocol-launched-on-arc-testnet",
      "Owner-supplied milestone, recorded separately from the Moonbase Alpha Testnet launch. 'Testnet' is carried in the headline, the context line, and the action note. Protocol remains Public Test, so the action explores rather than opens.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // ── Signal strip ───────────────────────────────────────────────────────────
  //
  // Two standing rollups and two dated snapshots, each labelled for what it is.
  {
    id: "radar-infrastructure-monitored",
    format: "live-signal",
    channel: "sagitta-product",
    placement: "signal-strip",
    systemSlugs: ["sagitta-radar"],
    lens: ["defi-health"],
    audience: ["Protocol teams", "Treasury operators"],
    eyebrow: "Sagitta Radar",
    headline: "Infrastructure monitored by Sagitta Radar",
    publishedAt: null,
    sourceName: "radar.sagitta.systems",
    signal: {
      metric: "Infrastructure monitored by Sagitta Radar",
      value: "Over $300B",
      reading: "rollup",
      asOf: null,
      snapshot: false,
    },
    action: {
      id: "promo:radar-infrastructure-monitored:live-coverage",
      label: "View live coverage",
      href: "https://radar.sagitta.systems",
      external: true,
      type: "open-product",
      availability: "available",
    },
    priority: 1,
    state: "active",
    verification: verifiedJul31(
      "https://radar.sagitta.systems + owner-approved public wording (2026-07-31)",
      "A live rollup, not a snapshot. The precise figure the product displays moves continuously, so it is published at an owner-approved threshold — 'Over $300B' — and is deliberately never stored or rendered to the digit. No as-of date is attached: the value was never frozen, and dating it would be a fabrication. Replaces the previous dated exposure snapshot, whose precise value has been removed from the record entirely rather than merely hidden.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "sce-incidents-tracked",
    format: "live-signal",
    channel: "sagitta-product",
    placement: "signal-strip",
    systemSlugs: ["sagitta-continuity-engine", "sagitta-defense"],
    lens: ["cve-defense", "protocol-readiness"],
    audience: ["Protocol teams", "Security leads"],
    eyebrow: "Continuity Engine",
    headline: "Critical incidents in the tracked set",
    publishedAt: "2026-07-29",
    sourceName: "defense.sagitta.systems",
    signal: {
      metric: "Critical incidents in the tracked set",
      value: "801",
      reading: "snapshot",
      asOf: "2026-07-29",
      snapshot: true,
    },
    action: {
      id: "promo:sce-incidents-tracked:review-scope",
      label: "Inspect protocol readiness",
      href: "https://defense.sagitta.systems",
      external: true,
      type: "defense-review",
      availability: "available",
    },
    priority: 2,
    state: "active",
    verification: verified(
      "https://defense.sagitta.systems",
      "A Sagitta-published figure attributed to SCE on the Defense service page, not an independently audited one. Rendered as a dated snapshot.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "x402-endpoints-advertised",
    format: "live-signal",
    channel: "sagitta-product",
    placement: "signal-strip",
    systemSlugs: ["selun"],
    capabilitySlugs: ["selun-x402"],
    lens: ["crypto-functionality"],
    audience: ["Agent developers", "Integrators"],
    eyebrow: "Selun · x402",
    headline: "Agent-payable endpoints advertised",
    publishedAt: "2026-07-29",
    sourceName: "selun.sagitta.systems/.well-known/x402",
    signal: {
      metric: "Agent-payable endpoints advertised",
      value: "9",
      reading: "snapshot",
      asOf: "2026-07-29",
      snapshot: true,
    },
    action: {
      id: "promo:x402-endpoints-advertised:endpoints",
      label: "Review the available endpoints",
      href: "https://selun.sagitta.systems/.well-known/x402",
      external: true,
      type: "documentation",
      availability: "available",
    },
    priority: 3,
    state: "active",
    verification: verifiedJul31(
      "https://selun.sagitta.systems/.well-known/x402",
      "Endpoint count read from the live discovery document. Reassigned on 2026-07-31: x402 is a capability of Selun, so the promotion routes into Selun and carries the capability as metadata rather than naming a system that does not exist. Per-call prices are set in the document and change; they are not quoted here.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "aaa-access-tiers",
    format: "live-signal",
    channel: "sagitta-product",
    placement: "signal-strip",
    systemSlugs: ["aaa"],
    lens: ["fund-allocation", "policy-governance"],
    audience: ["DAOs", "Treasury operators", "Portfolio managers"],
    eyebrow: "Autonomous Allocation Agent",
    headline: "Access tiers, starting with free Observer Access",
    publishedAt: null,
    sourceName: "aaa.sagitta.systems/pricing",
    signal: {
      metric: "Access tiers, starting with free Observer Access",
      value: "4",
      reading: "rollup",
      asOf: null,
      snapshot: false,
    },
    action: {
      id: "promo:aaa-access-tiers:open-aaa",
      label: "Open AAA",
      href: "https://aaa.sagitta.systems",
      external: true,
      type: "open-product",
      availability: "available",
    },
    priority: 4,
    state: "active",
    verification: verified(
      "https://aaa.sagitta.systems/pricing",
      "Tier count read from the pricing page. Reclassified as a rollup on 2026-07-31: the tier structure is a standing product fact the pricing page keeps current, not a point-in-time reading, so it no longer carries an as-of date it never needed. Prices move and are published there rather than here.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // ── Product feature ────────────────────────────────────────────────────────
  //
  // Unchanged by the real-content pass: no approved interface capture exists,
  // and the composition renders the wizard's own steps and controls rather than
  // simulating a session. The stage stays about the decision Selun helps the
  // reader make; the Selun video lives on the Watch stage, not here.
  {
    id: "selun-allocation-wizard",
    format: "product-interface",
    channel: "sagitta-product",
    placement: "product-feature",
    systemSlugs: ["selun", "aaa"],
    lens: ["fund-allocation", "sector-portfolios"],
    audience: ["Individual portfolio holders"],
    eyebrow: "Selun · Operating",
    headline: "The reasoning institutions use, as a plan you can act on.",
    context:
      "The guided wizard runs end to end over the same allocation intelligence AAA gives institutions, and settles by card or onchain in USDC.",
    publishedAt: "2026-07-29",
    sourceName: "selun.sagitta.systems",
    action: {
      id: "promo:selun-allocation-wizard:open-wizard",
      label: "Open the allocation wizard",
      href: "https://selun.sagitta.systems/wizard",
      external: true,
      type: "open-product",
      availability: "available",
      audience: "Individual portfolio holders",
      note: "Card checkout or onchain USDC settlement, with an optional certified decision report.",
    },
    media: {
      kind: "system-mark",
      src: "/selun.svg",
      alt: "The Selun mark: two crossed orbital rings around a luminous core.",
      fit: "contain",
    },
    priority: 1,
    state: "active",
    verification: verified(
      "https://selun.sagitta.systems + AAA/SelunAgent/README.md",
      "Wizard, card checkout, onchain USDC settlement, and the certified report are confirmed by the SelunAgent README; the live x402 document on the same host confirms the deployment. The asset is the Selun mark, not a screenshot of the interface — no approved interface capture exists.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // ── Watch ──────────────────────────────────────────────────────────────────
  //
  // The first real episode. Its presence here is what switches the Watch stage
  // out of its forthcoming state; nothing about Selun is hardcoded in the
  // component.
  {
    id: "introducing-selun-video",
    format: "video-episode",
    channel: "youtube",
    placement: "video-feature",
    systemSlugs: ["selun", "aaa"],
    lens: ["fund-allocation", "sector-portfolios"],
    audience: ["Individual portfolio holders"],
    eyebrow: "YouTube · Sagitta Labs",
    headline: "Introducing Selun",
    publishedAt: "2026-03-28",
    sourceName: "YouTube · Sagitta Labs",
    sourceUrl: YOUTUBE_SELUN,
    action: {
      id: "promo:introducing-selun-video:watch",
      label: "Watch on YouTube",
      href: YOUTUBE_SELUN,
      external: true,
      type: "demonstration",
      availability: "available",
      audience: "Individual portfolio holders",
    },
    media: {
      kind: "video-thumbnail",
      src: "/watch/introducing-selun.jpg",
      alt: "Thumbnail published with the Introducing Selun video on the Sagitta Labs YouTube channel.",
      duration: "0:41",
      embed: { provider: "youtube", id: "SHecO67AqfM" },
      fit: "cover",
    },
    priority: 1,
    state: "active",
    canonicalRecord: "/newsroom/introducing-selun",
    verification: verifiedJul31(
      `${YOUTUBE_SELUN} (title and channel resolved via YouTube oEmbed)`,
      "Exact title 'Introducing Selun' and channel name 'Sagitta Labs' returned by oEmbed. Duration 0:41 is owner-supplied approved source information. The published date is 2026-03-28, the channel feed's own timestamp — resolved by owner decision on 2026-08-02, superseding the owner-supplied 2026-03-19, which was the production date rather than a publication date. See the newsroom record. The poster is YouTube's own thumbnail for this video id, stored locally. No audience figure is published: none was read. This is not a Sagitta Defense Review episode and is not presented as one.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  {
    id: "protocol-overview-video",
    format: "video-episode",
    channel: "youtube",
    placement: "video-feature",
    systemSlugs: ["sagitta-protocol", "aaa", "sagitta-continuity-engine"],
    lens: ["onchain-banking", "policy-governance"],
    audience: ["Protocol teams", "Funds", "Researchers"],
    eyebrow: "YouTube · Sagitta Labs",
    headline: "Sagitta Protocol Overview | Trustless Wealth Management Infrastructure",
    displayHeadline: "Sagitta Protocol Overview",
    publishedAt: "2026-04-18",
    sourceName: "YouTube · Sagitta Labs",
    sourceUrl: YOUTUBE_PROTOCOL,
    action: {
      id: "promo:protocol-overview-video:watch",
      label: "Watch on YouTube",
      href: YOUTUBE_PROTOCOL,
      external: true,
      type: "demonstration",
      availability: "available",
      audience: "Protocol teams, funds, and researchers",
      note: "An architecture overview. Sagitta Protocol is in public test on Moonbase Alpha Testnet and Arc Testnet.",
    },
    media: {
      kind: "video-thumbnail",
      src: "/watch/protocol-overview.jpg",
      alt:
        "Thumbnail published with the Sagitta Protocol Overview video on the Sagitta Labs YouTube channel.",
      // No duration: oEmbed returns none and none was read elsewhere. The
      // stage renders a runtime only where the source publishes one, so this
      // video simply carries no runtime chip.
      embed: { provider: "youtube", id: "PabWDk6I-HI" },
      fit: "cover",
    },
    priority: 2,
    state: "active",
    canonicalRecord: "/newsroom/sagitta-protocol-overview",
    verification: verifiedJul31(
      `${YOUTUBE_PROTOCOL} (title and channel via oEmbed; date via the channel RSS feed)`,
      "Exact title and channel resolved from oEmbed; the publication date is the channel feed's own timestamp (2026-04-18T22:37:45Z). The canonical title runs to 69 characters with a pipe in it, so an approved display headline is recorded for compact stages while the canonical title stays on the record. No duration and no audience figure: neither was read. Protocol is Public Test, so the action demonstrates rather than opens, and the note keeps Testnet attached.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // ── Network headlines ──────────────────────────────────────────────────────
  //
  // Four rows across three verified external channels — LinkedIn, Paragraph,
  // and X. Each carries its source, its date, and its system.
  {
    id: "banking-lifecycle-article",
    format: "article",
    channel: "linkedin",
    placement: "network-headlines",
    systemSlugs: ["sagitta-banking", "sagitta-protocol"],
    lens: ["onchain-banking"],
    audience: ["Banks", "Fintechs", "Core banking partners"],
    eyebrow: "LinkedIn · Xavier D. Moore",
    headline: "The Account-to-Treasury Lifecycle Behind an Onchain Financial Product",
    displayHeadline: "The account-to-treasury lifecycle behind an onchain product",
    publishedAt: "2026-07-28",
    sourceName: "LinkedIn",
    action: {
      id: "promo:banking-lifecycle-article:read",
      label: "Read the article on LinkedIn",
      href: "https://www.linkedin.com/pulse/account-to-treasury-lifecycle-behind-onchain-financial-xavier-moore-2gkle/",
      external: true,
      type: "research",
      availability: "available",
      audience: "Banks, fintechs, and core banking partners",
    },
    priority: 1,
    state: "active",
    canonicalRecord: "/newsroom/account-to-treasury-lifecycle-behind-an-onchain-financial-product",
    verification: verifiedJul31(
      "https://www.linkedin.com/pulse/account-to-treasury-lifecycle-behind-onchain-financial-xavier-moore-2gkle/",
      "The canonical title is recorded verbatim in `headline` and stays available to the reader. `displayHeadline` is an approved shorter form for the desk's lead slot, where the full 68-character title sets to five lines at narrow widths. Date, author, and URL are owner-supplied approved source information.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "signing-authority-custody-layer",
    format: "article",
    channel: "paragraph",
    placement: "network-headlines",
    systemSlugs: ["sagitta-continuity-engine", "sagitta-defense"],
    lens: ["protocol-readiness", "cve-defense"],
    audience: ["Protocol teams", "Security leads", "DAOs"],
    eyebrow: "Paragraph · The Continuity Desk",
    headline: "Signing Authority Is the Real Custody Layer",
    publishedAt: "2026-06-04",
    sourceName: "The Continuity Desk",
    action: {
      id: "promo:signing-authority-custody-layer:read",
      label: "Read the article on Paragraph",
      href: "https://paragraph.com/@sagitta/signing-authority-is-the-real-custody-layer",
      external: true,
      type: "research",
      availability: "available",
    },
    priority: 2,
    state: "active",
    canonicalRecord: "/newsroom/signing-authority-is-the-real-custody-layer",
    verification: verifiedJul31(
      "https://paragraph.com/@sagitta/signing-authority-is-the-real-custody-layer",
      "Title read from the publication's llms.txt index; date read from its RSS feed (Thu, 04 Jun 2026). Destination is the article's own URL.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "aaa-launch-post",
    format: "launch-milestone",
    channel: "x",
    placement: "network-headlines",
    systemSlugs: ["aaa"],
    lens: ["fund-allocation", "policy-governance"],
    audience: ["DAOs", "Treasury operators", "Portfolio managers"],
    eyebrow: "X · @SagittaSystems",
    headline: "Autonomous Allocation Agent launch",
    publishedAt: "2026-02-07",
    sourceName: "X",
    action: {
      id: "promo:aaa-launch-post:view",
      label: "View the launch post on X",
      href: "https://x.com/SagittaSystems/status/2020219494086373390",
      external: true,
      type: "evidence",
      availability: "available",
    },
    priority: 3,
    state: "active",
    verification: verifiedJul31(
      "https://x.com/SagittaSystems/status/2020219494086373390",
      "The post URL and its date are owner-supplied approved source information. X publishes no machine-readable metadata that could be read here, so no post text, image, or engagement figure is reproduced: the headline states what the post is, in Sagitta's own words. The destination is the exact public post.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    // Moved off the lead carousel on 2026-08-04 to make room for the fourth
    // Continuity Desk article. The doctrine is not superseded by it — it is the
    // older and more foundational piece, and it keeps a desk slot for that
    // reason. What changed is which article is the current reason to enter SCE.
    id: "three-deaths-doctrine",
    format: "article",
    channel: "paragraph",
    placement: "network-headlines",
    systemSlugs: ["sagitta-continuity-engine", "sagitta-protocol"],
    lens: ["protocol-readiness", "policy-governance"],
    audience: ["Protocol teams", "Treasury operators", "Researchers"],
    eyebrow: "Paragraph · The Continuity Desk",
    headline: "The Three Deaths Doctrine",
    context: "How Sagitta defines treasury failure as a dormant state, not a terminal collapse.",
    publishedAt: "2026-06-30",
    sourceName: "The Continuity Desk",
    action: {
      id: "promo:three-deaths-doctrine:read",
      label: "Read the doctrine on Paragraph",
      href: "https://paragraph.com/@sagitta/the-three-deaths-doctrine",
      external: true,
      type: "research",
      availability: "available",
    },
    media: {
      kind: "article-cover",
      src: "/paragraph/the-three-deaths-doctrine.jpg",
      alt: "Cover art published with The Three Deaths Doctrine on The Continuity Desk.",
      fit: "cover",
    },
    priority: 4,
    state: "active",
    canonicalRecord: "/newsroom/the-three-deaths-doctrine",
    verification: verifiedJul31(
      "https://paragraph.com/@sagitta/the-three-deaths-doctrine",
      "Title and one-line description are the publication's own, read from its llms.txt index; date read from the RSS feed. The cover is the article's real cover photo from its og:image metadata, stored locally. The destination is the article, never the publication page. The desk renders no media and no context line; both are kept on the record so nothing is lost if it is staged on the carousel again.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    // Archived from the homepage on 2026-08-04. Verified, real, and unchanged —
    // held back because the desk renders four rows and the Three Deaths Doctrine
    // took the slot when it came off the carousel. Canonical at its newsroom
    // record and on Paragraph either way.
    id: "public-surface-authority-review",
    format: "article",
    channel: "paragraph",
    placement: "network-headlines",
    systemSlugs: ["sagitta-defense", "sagitta-continuity-engine"],
    lens: ["cve-defense", "protocol-readiness"],
    audience: ["Protocol teams", "Security leads"],
    eyebrow: "Paragraph · The Continuity Desk",
    headline: "What a Public-Surface Authority Review Actually Proves",
    publishedAt: "2026-05-26",
    sourceName: "The Continuity Desk",
    action: {
      id: "promo:public-surface-authority-review:read",
      label: "Read the article on Paragraph",
      href: "https://paragraph.com/@sagitta/what-a-public-surface-authority-review-actually-proves",
      external: true,
      type: "research",
      availability: "available",
    },
    priority: 5,
    state: "archived",
    canonicalRecord: "/newsroom/what-a-public-surface-authority-review-actually-proves",
    verification: verifiedJul31(
      "https://paragraph.com/@sagitta/what-a-public-surface-authority-review-actually-proves",
      "Title read from the publication's llms.txt index; date read from its RSS feed (Tue, 26 May 2026). Destination is the article's own URL.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // ── Cinematic feature ──────────────────────────────────────────────────────
  //
  // One substantial evidence artifact rather than another launch mark: the
  // published Sagitta Banking lifecycle diagram, rendered from the real asset.
  // It is classified as an architecture brief and the copy says so — Banking is
  // In Development, and nothing here presents a designed control surface as a
  // delivered integration.
  {
    id: "banking-lifecycle-architecture",
    format: "research-report",
    channel: "sagitta-product",
    placement: "cinematic-feature",
    systemSlugs: ["sagitta-banking", "sagitta-protocol"],
    lens: ["onchain-banking", "policy-governance"],
    audience: ["Banks", "Fintechs", "Core banking partners"],
    eyebrow: "Sagitta Banking · Architecture",
    headline: "Deposit, settle, execute, return — under one control layer.",
    context:
      "The published account-to-treasury lifecycle: core banking to USDC to Arc to treasury, with eligibility, ceilings, routes, and approval boundaries enforced at every transition.",
    publishedAt: null,
    sourceName: "banking.sagitta.systems",
    sourceUrl: "https://banking.sagitta.systems",
    artifactId: "banking-account-to-treasury-lifecycle",
    action: {
      id: "promo:banking-lifecycle-architecture:integration",
      label: "Discuss an integration",
      href: "https://banking.sagitta.systems",
      external: true,
      type: "partnership",
      availability: "by-request",
      audience: "Banks, fintechs, and core banking partners",
      note: "An architecture brief for a system in development. Design-partner briefings only — there is no public product, pilot, or waitlist.",
    },
    media: {
      kind: "diagram",
      src: "/banking-lifecycle.webp",
      alt:
        "The Sagitta Banking lifecycle diagram: deposit, settle, execute, and return arranged around a central Sagitta control layer, above a rail running core banking to USDC to Arc to treasury.",
      fit: "cover",
    },
    priority: 1,
    state: "active",
    verification: verifiedJul31(
      "https://banking.sagitta.systems/hero-lifecycle-diagram.webp (HTTP 200) + Banking/public/hero-lifecycle-diagram.webp",
      "The real published diagram, carried into this repository unchanged rather than simulated or redrawn. Classified as an architecture brief in artifacts.ts and promoted as one: the headline describes a designed lifecycle, the action note states the system is in development, and no integration, customer, or result is claimed. No Mifos or Apache Fineract integration document exists in the repository, so none is used.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // ── Archived — real, on the record, not in the current rotation ────────────
  //
  // Kept so the rotation has somewhere to draw from, and so a promotion leaving
  // the homepage is a state change rather than a deletion. Everything below is
  // verified; it is held back editorially, not for want of evidence.

  // The remaining X posts. Real destinations, held out of the current rotation
  // because one social row is enough and the systems behind these already lead
  // elsewhere on the page.
  {
    id: "selun-launch-post",
    format: "launch-milestone",
    channel: "x",
    placement: "network-headlines",
    systemSlugs: ["selun", "aaa"],
    lens: ["fund-allocation", "sector-portfolios"],
    audience: ["Individual portfolio holders"],
    eyebrow: "X · @SagittaSystems",
    headline: "Selun launch",
    publishedAt: "2026-02-22",
    sourceName: "X",
    action: {
      id: "promo:selun-launch-post:view",
      label: "View the launch post on X",
      href: "https://x.com/SagittaSystems/status/2025629787876630993",
      external: true,
      type: "evidence",
      availability: "available",
    },
    priority: 5,
    state: "archived",
    verification: verifiedJul31(
      "https://x.com/SagittaSystems/status/2025629787876630993",
      "URL and date owner-supplied. No post text or image is reproduced. Archived: Selun already holds the product moment and the Watch stage, and a third Selun item would crowd the page.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "defense-launch-post",
    format: "launch-milestone",
    channel: "x",
    placement: "network-headlines",
    systemSlugs: ["sagitta-defense", "sagitta-continuity-engine"],
    lens: ["cve-defense", "protocol-readiness"],
    audience: ["Protocol teams", "DAOs", "Treasury operators"],
    eyebrow: "X · @SagittaSystems",
    headline: "Sagitta Defense launch",
    publishedAt: "2026-05-06",
    sourceName: "X",
    action: {
      id: "promo:defense-launch-post:view",
      label: "View the launch post on X",
      href: "https://x.com/SagittaSystems/status/2051978339867369705",
      external: true,
      type: "evidence",
      availability: "available",
    },
    priority: 6,
    state: "archived",
    verification: verifiedJul31(
      "https://x.com/SagittaSystems/status/2051978339867369705",
      "URL and date owner-supplied, and the date matches the Defense launch record independently. No post text is reproduced. Archived: the Defense launch already leads the carousel, and promoting the same launch twice on one page is a duplication rather than a second story.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "protocol-continuity-post",
    format: "social-post",
    channel: "x",
    placement: "network-headlines",
    systemSlugs: ["sagitta-protocol", "sagitta-continuity-engine"],
    lens: ["protocol-readiness", "crypto-functionality"],
    audience: ["Protocol teams", "Researchers"],
    eyebrow: "X · @SagittaSystems",
    headline: "Protocol continuity",
    publishedAt: null,
    sourceName: "X",
    action: {
      id: "promo:protocol-continuity-post:view",
      label: "View the post on X",
      href: "https://x.com/SagittaSystems/status/2070693476400849039",
      external: true,
      type: "evidence",
      availability: "available",
    },
    priority: 7,
    state: "archived",
    verification: verifiedJul31(
      "https://x.com/SagittaSystems/status/2070693476400849039",
      "The post URL is owner-supplied and real. Its date could not be verified from any source: X exposes no readable metadata here and no owner-supplied date accompanied it, so `publishedAt` is null. Held out of the rotation for exactly that reason — the network desk renders a date on every row, and an undated row there would read as a missing fact rather than an honest omission.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // The Moonbase Alpha Testnet launch. A separate milestone from Arc, kept
  // distinct rather than merged, and archived because one Protocol launch on
  // the page is enough.
  {
    id: "protocol-moonbase-alpha-testnet",
    format: "launch-milestone",
    channel: "sagitta-product",
    placement: "lead-carousel",
    systemSlugs: ["sagitta-protocol", "aaa", "sagitta-continuity-engine"],
    lens: ["onchain-banking", "crypto-functionality", "policy-governance"],
    audience: ["Protocol teams", "Funds", "Researchers"],
    eyebrow: "Sagitta Protocol · Launch",
    headline: "Sagitta Protocol launched on Moonbase Alpha Testnet.",
    context:
      "Deposits are Polkadot-native: DOT crosses into Moonbeam as xcDOT and is accepted directly by the Vault.",
    publishedAt: "2026-04-13",
    sourceName: "protocol.sagitta.systems",
    sourceUrl: "https://protocol.sagitta.systems",
    action: {
      id: "promo:protocol-moonbase-alpha-testnet:explore",
      label: "Explore the public test",
      href: "https://protocol.sagitta.systems",
      external: true,
      type: "demonstration",
      availability: "available",
      note: "A testnet deployment. No mainnet deployment or contract addresses are published.",
    },
    media: {
      kind: "constellation",
      src: "/sagitta-hero.png",
      alt: "",
      fit: "cover",
    },
    priority: 6,
    state: "archived",
    canonicalRecord: "/newsroom/sagitta-protocol-launched-on-moonbase-alpha-testnet",
    verification: verifiedJul31(
      "https://protocol.sagitta.systems + owner-supplied launch date",
      "Owner-supplied milestone, 13 April 2026, recorded separately from the Arc Testnet launch of 11 May. 'Testnet' is carried in the headline. Archived behind the Arc launch: both are real and distinct, and the carousel promotes the later one.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // Evidence and research held for later rotations.
  {
    id: "defense-sample-review",
    format: "research-report",
    channel: "sagitta-product",
    placement: "cinematic-feature",
    systemSlugs: ["sagitta-defense", "sagitta-continuity-engine"],
    lens: ["cve-defense", "protocol-readiness"],
    audience: ["Protocol teams", "DAOs", "Security leads"],
    eyebrow: "Sagitta Defense · Sample output",
    headline: "What a Defense Review actually hands you.",
    context:
      "The sample report shows the structure of the deliverable — authority surface, treasury control, oracle dependency — on illustrative rather than client data.",
    publishedAt: null,
    sourceName: "defense.sagitta.systems",
    artifactId: "defense-sample-review",
    action: {
      id: "promo:defense-sample-review:download",
      label: "Download the sample report",
      href: "https://defense.sagitta.systems/sample-review.pdf",
      external: true,
      type: "evidence",
      availability: "available",
      note: "A specimen of the deliverable on illustrative data. Not an engagement result, and it names no client.",
    },
    priority: 2,
    state: "archived",
    verification: verifiedJul31(
      "https://defense.sagitta.systems/sample-review.pdf (HTTP 200)",
      "Publicly downloadable and real. Archived rather than staged: it carries no cover rendered from the PDF itself, and the cinematic stage is a picture-led composition — running it there would mean borrowing a mark to stand in for a document page. Registered as a sample output in artifacts.ts, never as a case study.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "protocol-whitepaper",
    format: "research-report",
    channel: "external-publication",
    placement: "lead-carousel",
    systemSlugs: ["sagitta-protocol", "aaa", "sagitta-continuity-engine"],
    lens: ["policy-governance", "onchain-banking"],
    audience: ["Funds", "Protocol teams", "Researchers"],
    eyebrow: "Whitepaper · Published in full",
    headline: "How capital is held, allocated, and recovered.",
    context:
      "The Vault, Treasury, Reserve, and Escrow, with the Allocation Agent and the Continuity Engine as components rather than integrations.",
    publishedAt: null,
    sourceName: "GitBook",
    sourceUrl: WHITEPAPER,
    artifactId: "protocol-whitepaper",
    action: {
      id: "promo:protocol-whitepaper:read-architecture",
      label: "Read the architecture",
      href: WHITEPAPER,
      external: true,
      type: "documentation",
      availability: "available",
      note: "No version number or publication date is stated on the document itself.",
    },
    media: {
      kind: "report-cover",
      src: "/diagram.webp",
      alt:
        "The Sagitta Protocol capital architecture diagram, tracing deposits through the Vault, Treasury, Reserve, and Escrow.",
      fit: "cover",
    },
    priority: 7,
    state: "archived",
    verification: verified(
      WHITEPAPER,
      "Executive summary and component set read directly. Undated by the source, so no date is published here. Archived on 2026-07-31 to make room for the dated launches and the real articles; the whitepaper remains canonical on /systems/sagitta-protocol and in the documentation route.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "protocol-architecture-brief",
    format: "research-report",
    channel: "sagitta-systems",
    placement: "network-headlines",
    systemSlugs: ["sagitta-protocol", "aaa", "sagitta-continuity-engine"],
    lens: ["onchain-banking", "policy-governance"],
    audience: ["Funds", "Researchers", "Journalists"],
    eyebrow: "Sagitta Systems",
    headline: "Protocol architecture diagram",
    publishedAt: null,
    sourceName: "Media library",
    artifactId: "protocol-architecture-diagram",
    action: {
      id: "promo:protocol-architecture-brief:open-diagram",
      label: "Open the full diagram",
      href: "/diagram.webp",
      type: "evidence",
      availability: "available",
    },
    priority: 8,
    state: "archived",
    verification: verified(
      "public/diagram.png in this repository",
      "Archived on 2026-07-31: the desk now runs real off-site publishing, and an undated internal asset is a weaker row than a dated article. It stays canonical in the media library.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "scenario-governance-note",
    format: "article",
    channel: "sagitta-product",
    placement: "network-headlines",
    systemSlugs: ["aaa"],
    lens: ["policy-governance", "sector-portfolios"],
    audience: ["DAOs", "Treasury operators", "Portfolio managers"],
    eyebrow: "aaa.sagitta.systems",
    headline: "Scenario Governance in On-Chain Markets",
    publishedAt: "2026-01-25",
    sourceName: "AAA research notes",
    action: {
      id: "promo:scenario-governance-note:read",
      label: "Read the article",
      href: "https://aaa.sagitta.systems/research-notes/scenario-governance-in-on-chain-markets",
      external: true,
      type: "research",
      availability: "available",
    },
    priority: 9,
    state: "archived",
    verification: verified(
      "https://aaa.sagitta.systems/research-notes",
      "Archived on 2026-07-31 behind the newer LinkedIn and Paragraph articles. Still published and still canonical in the newsroom.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "enforceable-allocation-policy-note",
    format: "article",
    channel: "sagitta-product",
    placement: "network-headlines",
    systemSlugs: ["aaa"],
    lens: ["policy-governance"],
    audience: ["DAOs"],
    eyebrow: "aaa.sagitta.systems",
    headline: "Designing Enforceable Allocation Policy for Decentralized Organizations",
    displayHeadline: "Designing enforceable allocation policy for DAOs",
    publishedAt: "2026-01-15",
    sourceName: "AAA research notes",
    action: {
      id: "promo:enforceable-allocation-policy-note:read",
      label: "Read the article",
      href:
        "https://aaa.sagitta.systems/research-notes/designing-enforceable-allocation-policy-for-decentralized-organizations",
      external: true,
      type: "research",
      availability: "available",
    },
    priority: 10,
    state: "archived",
    verification: verified(
      "https://aaa.sagitta.systems/research-notes",
      "Archived on 2026-07-31 behind the newer articles. The canonical title is 73 characters and set to four lines in a desk row, so an approved display headline was recorded against it for whenever it rotates back in.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "x402-endpoints-verified",
    format: "alert-status",
    channel: "sagitta-systems",
    placement: "network-headlines",
    systemSlugs: ["selun", "sagitta-continuity-engine"],
    capabilitySlugs: ["selun-x402"],
    lens: ["crypto-functionality"],
    audience: ["Agent developers", "Integrators"],
    eyebrow: "Sagitta Systems",
    headline: "Nine agent-payable endpoints verified discoverable",
    publishedAt: "2026-07-29",
    sourceName: "Selun x402 discovery document",
    action: {
      id: "promo:x402-endpoints-verified:discovery-document",
      label: "View the live discovery document",
      href: "https://selun.sagitta.systems/.well-known/x402",
      external: true,
      type: "documentation",
      availability: "available",
    },
    priority: 11,
    state: "archived",
    verification: verifiedJul31(
      "https://selun.sagitta.systems/.well-known/x402",
      "A dated verification record, not a launch announcement. Reassigned to Selun with x402 as capability metadata. Archived on 2026-07-31: the same fact already runs as a signal, and the desk has real articles to carry.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "radar-coverage-verified",
    format: "alert-status",
    channel: "sagitta-product",
    placement: "lead-carousel",
    systemSlugs: ["sagitta-radar", "sagitta-continuity-engine"],
    lens: ["defi-health", "cve-defense"],
    audience: ["Protocol teams", "Infrastructure operators"],
    eyebrow: "Sagitta Radar · Coverage",
    headline: "Oracle freshness, bridge settlement, liquidity-pool depth.",
    context:
      "Coverage verified across all three pillars on 29 July 2026, with alerts to Discord, Telegram, and webhooks.",
    publishedAt: "2026-07-29",
    sourceName: "radar.sagitta.systems",
    action: {
      id: "promo:radar-coverage-verified:live-coverage",
      label: "View live coverage",
      href: "https://radar.sagitta.systems",
      external: true,
      type: "open-product",
      availability: "available",
    },
    priority: 8,
    state: "archived",
    verification: verifiedJul31(
      "https://radar.sagitta.systems",
      "Superseded by the dated Radar launch. This record existed because no launch date had been supplied; now that one has, the launch is the story and the coverage check is the supporting fact. Archived rather than deleted — the verification itself still stands.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "wallet-demonstration",
    format: "product-interface",
    channel: "sagitta-product",
    placement: "product-feature",
    systemSlugs: ["sagitta-wallet", "selun"],
    lens: ["crypto-functionality", "fund-allocation"],
    audience: ["Individual portfolio holders", "Agent operators"],
    eyebrow: "Sagitta Wallet · Concept",
    headline: "A wallet that tells you what to do next.",
    context:
      "Onboarding, portfolio stance, guided allocation, research, and reporting, demonstrated end to end on sample data.",
    publishedAt: null,
    sourceName: "wallet.sagitta.systems",
    action: {
      id: "promo:wallet-demonstration:view",
      label: "View the demonstration",
      href: "https://wallet.sagitta.systems",
      external: true,
      type: "demonstration",
      availability: "available",
      note: "A concept demonstration on sample data. Not a live wallet, and it holds no funds.",
    },
    priority: 2,
    state: "archived",
    verification: verifiedJul31(
      "https://wallet.sagitta.systems + Wallet/README.md",
      "Real and demonstrable, and held out of the rotation by design rather than for want of material: Sagitta Wallet is concept-stage, so the absence of a current Wallet promotion is the correct state and is not counted as a coverage gap. Nothing here presents it as operating.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "hub-published",
    format: "launch-milestone",
    channel: "sagitta-systems",
    placement: "network-headlines",
    systemSlugs: ["sagitta-continuity-engine"],
    lens: ["protocol-readiness"],
    audience: ["Journalists", "Partners"],
    eyebrow: "Sagitta Systems",
    headline: "Sagitta Systems hub published",
    publishedAt: "2026-05-04",
    sourceName: "sagitta.systems",
    action: {
      id: "promo:hub-published:record",
      label: "Read the launch record",
      href: "/newsroom/sagitta-systems-hub-published",
      type: "evidence",
      availability: "available",
    },
    priority: 12,
    state: "archived",
    verification: verified(
      "This repository's git history (commit c59c4a2, 2026-05-04)",
      "Superseded as current network news by the Radar and Defense launches. Archived rather than removed.",
    ),
    publicationState: "published",
    visibility: "public",
  },
];

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * The only list the homepage may render: active, published, public. An archived
 * promotion stays in the collection and never reaches a reader.
 */
export const activePromotions = promotions.filter(
  (p) => p.state === "active" && p.publicationState === "published" && p.visibility === "public",
);

export const archivedPromotions = promotions.filter((p) => p.state !== "active");

/** Active promotions staged at one placement, in editorial order. */
export function promotionsAt(placement: PromotionPlacement, limit?: number): PromotionRecord[] {
  const staged = activePromotions
    .filter((p) => p.placement === placement)
    .sort((a, b) => a.priority - b.priority);
  return typeof limit === "number" ? staged.slice(0, limit) : staged;
}

/** The single promotion staged at a placement that renders one at a time. */
export function solePromotionAt(placement: PromotionPlacement): PromotionRecord | undefined {
  return promotionsAt(placement)[0];
}

export function getPromotion(id: string): PromotionRecord | undefined {
  return promotions.find((p) => p.id === id);
}

/**
 * What a stage should set as the headline.
 *
 * Stages with room — the carousel, the cinematic feature — set the canonical
 * title. Compact stages may opt into the approved shorter form, and where they
 * do, the canonical title is still rendered for assistive technology rather
 * than being dropped.
 */
export function headlineFor(
  promotion: PromotionRecord,
  compact = false,
): { text: string; canonical?: string } {
  if (compact && promotion.displayHeadline) {
    return { text: promotion.displayHeadline, canonical: promotion.headline };
  }
  return { text: promotion.headline };
}

/** Formats currently on the homepage. Used to keep the density rules honest. */
export const activePromotionFormats: PromotionFormat[] = [
  ...new Set(activePromotions.map((p) => p.format)),
];

/** Channels currently carrying an active homepage promotion. */
export const activePromotionChannels: PromotionChannel[] = [
  ...new Set(activePromotions.map((p) => p.channel)),
];

/** Systems a decision lens routes into. */
export function systemsForLens(lens: DecisionLens): string[] {
  return decisionLenses.find((l) => l.id === lens)?.systemSlugs ?? [];
}

export function lensLabel(lens: DecisionLens): string {
  return decisionLenses.find((l) => l.id === lens)?.label ?? lens;
}
