// The network glossary: the vocabulary used across Sagitta surfaces, in one
// place.
//
// Every definition is taken from text Sagitta has already published, condensed
// where needed, and links to where that text lives. A term with no published
// definition is not given one here. This page records how the network already
// uses a word; it does not coin meanings.

import type { SystemFamilyId } from "./types";

export type GlossaryGroup = "network" | SystemFamilyId;

export interface GlossarySource {
  label: string;
  href: string;
  external?: boolean;
}

export interface GlossaryEntry {
  /** Anchor id on /documentation/glossary. */
  slug: string;
  term: string;
  group: GlossaryGroup;
  definition: string;
  source: GlossarySource;
  /** Slugs of related entries. */
  related?: string[];
}

export const glossaryGroups: { id: GlossaryGroup; name: string }[] = [
  { id: "network", name: "The network" },
  { id: "continuity-defense", name: "Continuity and Defense" },
  { id: "allocation-agent-intelligence", name: "Allocation and Agent Intelligence" },
  { id: "capital-infrastructure", name: "Capital Infrastructure" },
];

const SELUN_CAPABILITIES: GlossarySource = {
  label: "Selun capabilities",
  href: "https://selun.sagitta.systems/capabilities",
  external: true,
};
const PROTOCOL_OVERVIEW: GlossarySource = {
  label: "Sagitta Protocol overview",
  href: "/newsroom/sagitta-protocol-overview",
};
const STATUS: GlossarySource = { label: "Network status", href: "/status" };

export const glossary: GlossaryEntry[] = [
  // ── The network ──────────────────────────────────────────────────────────
  {
    slug: "authority-precedes-automation",
    term: "Authority precedes automation",
    group: "network",
    definition:
      "The principle the Autonomous Allocation Agent is built on. An automated system decides only inside a policy agreed in advance; the authority is set before the automation runs, not by it.",
    source: { label: "Autonomous Allocation Agent", href: "/systems/aaa" },
    related: ["policy-envelope", "decision-record"],
  },
  {
    slug: "operating",
    term: "Operating",
    group: "network",
    definition: "An operating state: the system is live on a public surface you can open today.",
    source: STATUS,
    related: ["public-test", "in-development", "research-horizon"],
  },
  {
    slug: "public-test",
    term: "Public Test",
    group: "network",
    definition:
      "An operating state: the system is reachable, but on a test deployment rather than in production.",
    source: STATUS,
    related: ["operating"],
  },
  {
    slug: "in-development",
    term: "In Development",
    group: "network",
    definition:
      "An operating state: the system is being built. What exists is a demo, a briefing, or a specification, not a product.",
    source: STATUS,
    related: ["operating"],
  },
  {
    slug: "research-horizon",
    term: "Research Horizon",
    group: "network",
    definition:
      "An operating state: the architecture is still forming, with no committed delivery timing.",
    source: STATUS,
    related: ["operating"],
  },
  {
    slug: "sagitta-systems-and-sagitta-labs",
    term: "Sagitta Systems and Sagitta Labs",
    group: "network",
    definition:
      "Sagitta Systems is the development identity behind the network, operating within Sagitta Labs, the emerging umbrella brand. Sagitta Labs is currently a brand architecture rather than an incorporated entity. Products take their own names, such as Sagitta Radar, with no attribution beside them.",
    source: { label: "Press room", href: "/press" },
  },

  // ── Continuity and Defense ──────────────────────────────────────────────
  {
    slug: "continuity-defense",
    term: "Continuity defense",
    group: "continuity-defense",
    definition:
      "Determining whether vulnerable code is reachable, containing exposure with the controls the protocol already has, and verifying that recovery is safe before normal operation resumes. It is neither auditing nor incident response, and it replaces neither; it is the operational judgement exercised between them.",
    source: {
      label: "The missing layer in crypto security",
      href: "/newsroom/the-missing-layer-in-crypto-security-continuity-defense",
    },
    related: ["reachability", "decision-record"],
  },
  {
    slug: "reachability",
    term: "Reachability",
    group: "continuity-defense",
    definition:
      "Whether vulnerable code can actually be reached in a protocol's own deployment. It is the first question continuity defense answers, ahead of containment and recovery.",
    source: {
      label: "The missing layer in crypto security",
      href: "/newsroom/the-missing-layer-in-crypto-security-continuity-defense",
    },
    related: ["continuity-defense"],
  },
  {
    slug: "decision-record",
    term: "Decision record",
    group: "continuity-defense",
    definition:
      "A record of the reasoning behind a decision. In the Continuity Engine, decision records are hashed and written to an append-only audit layer, so the reasoning behind a continuity decision stays inspectable after the fact. Selun's Allocation with Report returns a certified decision record alongside the allocation.",
    source: { label: "Sagitta Continuity Engine", href: "/systems/sagitta-continuity-engine" },
    related: ["continuity-defense", "authority-precedes-automation"],
  },
  {
    slug: "case-library",
    term: "Case Library",
    group: "continuity-defense",
    definition:
      "The Continuity Engine's library of tracked incidents and advisories, including CVEs from sources such as the NVD, classified by severity. Recent critical cases appear in the incident tickers on the SCE and Defense sites.",
    source: { label: "sce.sagitta.systems", href: "https://sce.sagitta.systems", external: true },
    related: ["case-relevance"],
  },
  {
    slug: "three-deaths-doctrine",
    term: "Three Deaths Doctrine",
    group: "continuity-defense",
    definition:
      "A treasury doctrine that starts from what happens when protection is no longer enough. It names three failures, each with its own revival path: stablecoin failure (substitute a replacement stablecoin base), reserve failure (reconstruct and rebalance the reserve around what survived), and protocol token collapse (restore from stablecoin backing, without depending on the token's price recovering).",
    source: { label: "The Three Deaths Doctrine", href: "/newsroom/the-three-deaths-doctrine" },
  },
  {
    slug: "signing-authority",
    term: "Signing authority",
    group: "continuity-defense",
    definition:
      "Who can authorize an action, what they are signing, when it can execute, and which custody domain controls the path. Multisigs, timelocks, hashes and custody providers matter, but DeFi security depends on signing authority, which makes it the real custody layer.",
    source: {
      label: "Signing Authority Is the Real Custody Layer",
      href: "/newsroom/signing-authority-is-the-real-custody-layer",
    },
  },
  {
    slug: "continuity-mode",
    term: "Continuity mode",
    group: "continuity-defense",
    definition:
      "The Continuity Engine's current on-chain threat posture: NORMAL, INCIDENT, or DEGRADED, with a recommended posture, reason codes, and risk by domain (authority, governance, oracle, bridge, dependency, and more). Agents read it as the default check before any protocol interaction or capital movement.",
    source: SELUN_CAPABILITIES,
    related: ["execution-preflight", "doctrine-action"],
  },
  {
    slug: "case-relevance",
    term: "Case relevance",
    group: "continuity-defense",
    definition:
      "Whether a specific protocol, asset type, or threat family is relevant to the Continuity Engine's active intelligence. Returns a relevance score and level, the matched threat families and doctrine tags, and reason codes.",
    source: SELUN_CAPABILITIES,
    related: ["case-library", "execution-preflight"],
  },
  {
    slug: "doctrine-action",
    term: "Doctrine action",
    group: "continuity-defense",
    definition:
      "The Continuity Engine's verdict on a proposed action: BLOCK, ALLOW, or ESCALATE, with a risk level, score, domains and reason codes. On BLOCK, an agent halts the action and surfaces the reasons to its user.",
    source: SELUN_CAPABILITIES,
    related: ["continuity-mode", "execution-preflight"],
  },

  // ── Allocation and Agent Intelligence ───────────────────────────────────
  {
    slug: "policy-envelope",
    term: "Policy envelope",
    group: "allocation-agent-intelligence",
    definition:
      "The hard constraints any compliant allocation must satisfy for a given risk tolerance and timeframe: maximum exposure caps by asset class, a minimum stablecoin floor, and a risk budget.",
    source: SELUN_CAPABILITIES,
    related: ["authority-precedes-automation", "market-regime"],
  },
  {
    slug: "market-regime",
    term: "Market regime",
    group: "allocation-agent-intelligence",
    definition:
      "A classification of current market conditions, returning volatility, liquidity and sentiment, plus the allocation authorization inputs that automated portfolio workflows use. Read before allocating or rebalancing.",
    source: SELUN_CAPABILITIES,
    related: ["policy-envelope", "rebalance"],
  },
  {
    slug: "rebalance",
    term: "Rebalance",
    group: "allocation-agent-intelligence",
    definition:
      "Comparing current holdings with the target allocation, and returning the drift and the adjustments needed to return within policy constraints. Run after allocation or on a monitoring schedule.",
    source: SELUN_CAPABILITIES,
    related: ["policy-envelope"],
  },
  {
    slug: "execution-preflight",
    term: "Execution preflight",
    group: "allocation-agent-intelligence",
    definition:
      "The safety checks an agent runs before it moves capital, built on the Continuity Engine: Continuity Mode on every execution cycle, Case Relevance for a specific protocol or asset, and Risk Evaluate when the mode is not NORMAL.",
    source: SELUN_CAPABILITIES,
    related: ["continuity-mode", "case-relevance", "doctrine-action"],
  },
  {
    slug: "x402",
    term: "x402",
    group: "allocation-agent-intelligence",
    definition:
      "An HTTP payment protocol for pay-per-call APIs. An unpaid request gets a 402 Payment Required response with the payment terms, and the caller retries with payment. Selun publishes its endpoints in a discovery document at /.well-known/x402, callable and settleable by an agent without a human account.",
    source: { label: "Selun for Developers", href: "https://selun.sagitta.systems/for-developers", external: true },
    related: ["execution-preflight"],
  },

  // ── Capital Infrastructure ──────────────────────────────────────────────
  {
    slug: "vault",
    term: "Vault",
    group: "capital-infrastructure",
    definition: "The Sagitta Protocol component that handles custody and accounting.",
    source: PROTOCOL_OVERVIEW,
    related: ["treasury", "reserve", "escrow"],
  },
  {
    slug: "treasury",
    term: "Treasury",
    group: "capital-infrastructure",
    definition: "The Sagitta Protocol component that manages liquidity and settlement.",
    source: PROTOCOL_OVERVIEW,
    related: ["vault", "reserve"],
  },
  {
    slug: "reserve",
    term: "Reserve",
    group: "capital-infrastructure",
    definition: "The Sagitta Protocol's gold-backed insurance layer.",
    source: PROTOCOL_OVERVIEW,
    related: ["vault", "three-deaths-doctrine"],
  },
  {
    slug: "escrow",
    term: "Escrow",
    group: "capital-infrastructure",
    definition:
      "The Sagitta Protocol's interface to external allocation venues, so capital leaving for a third-party venue crosses a boundary that was designed rather than improvised.",
    source: PROTOCOL_OVERVIEW,
    related: ["vault"],
  },
];

/** Entries in authored order, which keeps sequences such as the operating states intact. */
export function glossaryByGroup(group: GlossaryGroup): GlossaryEntry[] {
  return glossary.filter((entry) => entry.group === group);
}

export function getGlossaryEntry(slug: string): GlossaryEntry | undefined {
  return glossary.find((entry) => entry.slug === slug);
}
