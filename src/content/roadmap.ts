import type { RoadmapHorizon, RoadmapItem, Verification } from "./types";

// Public roadmap.
//
// Phase 1 derived one roadmap item per system, which produced a roadmap that
// only restated the directory. These items are hand-authored milestones: each
// names a specific capability, states an evidence-based position, and links the
// evidence where public evidence exists.
//
// No delivery dates or quarters appear anywhere below. None have been publicly
// committed, so sequence language ("Now", "Next", "Horizon") carries the timing.

const VERIFIED_ON = "2026-07-29";

function verified(source: string, note?: string): Verification {
  return { status: "verified", source, lastVerifiedAt: VERIFIED_ON, note };
}

/**
 * Owner confirmation, 1 August 2026. Kept as its own dated helper rather than
 * folded into `VERIFIED_ON`, so a claim confirmed by the owner on a later date
 * does not silently re-date the items checked against live sources on 29 July.
 */
const CONFIRMED_ON = "2026-08-01";

function ownerConfirmed(source: string, note?: string): Verification {
  return { status: "verified", source, lastVerifiedAt: CONFIRMED_ON, note };
}

export const roadmapItems: RoadmapItem[] = [
  // ── Now — operating today ──────────────────────────────────────────────────
  {
    id: "defense-review-fixed-scope",
    title: "Fixed-scope Defense Review available at a published price",
    systemSlug: "sagitta-defense",
    state: "Operating",
    horizon: "Now",
    summary:
      "A Starter Defense Review is purchasable at a flat $3,000, delivered in about seven days, with a sample report published so buyers can see the deliverable before committing.",
    evidence: {
      label: "defense.sagitta.systems",
      href: "https://defense.sagitta.systems",
      external: true,
    },
    updatedAt: "2026-05-06",
    featured: true,
    verification: verified("https://defense.sagitta.systems"),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "radar-three-pillar-monitoring",
    title: "Three-pillar infrastructure monitoring on a public subscription",
    systemSlug: "sagitta-radar",
    state: "Operating",
    horizon: "Now",
    summary:
      "Oracle, bridge, and liquidity-pool monitoring is running behind four published plans, with watchlists and alert delivery to Discord, Telegram, and webhooks.",
    evidence: {
      label: "radar.sagitta.systems",
      href: "https://radar.sagitta.systems",
      external: true,
    },
    updatedAt: null,
    featured: true,
    verification: verified(
      "https://radar.sagitta.systems + SCE/SCE_BUILD_STATE.md (2026-07-05)",
      "Live adapters confirmed for Chainlink oracles, CCTP and Across bridge routes, and Uniswap v3 / Aerodrome / Curve pools.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "aaa-policy-governed-allocation",
    title: "Policy-governed allocation with published methodology and pricing",
    systemSlug: "aaa",
    state: "Operating",
    horizon: "Now",
    summary:
      "AAA is available across four tiers from free Observer Access to enterprise, with its methodology, decision records, changelog, and research programme published openly.",
    evidence: {
      label: "aaa.sagitta.systems/docs",
      href: "https://aaa.sagitta.systems/docs",
      external: true,
    },
    updatedAt: null,
    featured: true,
    verification: verified("https://aaa.sagitta.systems/sitemap.xml and /pricing"),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "selun-guided-allocation",
    title: "Guided allocation with card and onchain USDC settlement",
    systemSlug: "selun",
    state: "Operating",
    horizon: "Now",
    summary:
      "Selun's allocation wizard runs end to end, with both card checkout and onchain USDC settlement, and an optional certified decision report.",
    evidence: {
      label: "selun.sagitta.systems",
      href: "https://selun.sagitta.systems",
      external: true,
    },
    updatedAt: null,
    featured: false,
    verification: verified("AAA/SelunAgent/README.md + live host"),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "x402-agent-payable-surface",
    title: "Agent-payable intelligence discoverable over Selun's x402 surface",
    systemSlug: "selun",
    state: "Operating",
    horizon: "Now",
    summary:
      "Nine allocation and continuity endpoints are advertised in a live x402 discovery document, callable and settleable by an agent without a human account.",
    evidence: {
      label: "/.well-known/x402",
      href: "https://selun.sagitta.systems/.well-known/x402",
      external: true,
    },
    updatedAt: null,
    featured: true,
    verification: verified("https://selun.sagitta.systems/.well-known/x402"),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "sce-decision-records",
    title: "Continuity scenarios producing auditable decision records",
    systemSlug: "sagitta-continuity-engine",
    state: "Operating",
    horizon: "Now",
    summary:
      "SCE runs failure scenarios and emits a decision record for each, hashed and written to an append-only audit layer so the reasoning stays inspectable after the fact.",
    evidence: {
      label: "sce.sagitta.systems",
      href: "https://sce.sagitta.systems",
      external: true,
    },
    updatedAt: null,
    featured: false,
    verification: verified(
      "SCE/README.md + https://sce.sagitta.systems",
      "README documents the scenario/decision-record API and the AO audit adapter. The public site currently reports some live feeds as reconnecting.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "sce-public-alert-distribution",
    title: "Operator-approved public distribution of infrastructure alerts",
    systemSlug: "sagitta-radar",
    state: "Operating",
    horizon: "Now",
    summary:
      "Cross-pillar alert previews can be approved and sent manually to public channels. Automatic public broadcast remains off for the bridge and liquidity-pool pillars.",
    evidence: {
      label: "radar.sagitta.systems",
      href: "https://radar.sagitta.systems",
      external: true,
    },
    updatedAt: "2026-08-01",
    featured: false,
    verification: ownerConfirmed(
      "Owner confirmation (2026-08-01) + SCE/SCE_BUILD_STATE.md (baseline 2026-07-05)",
      "Moved from Public Test / Next to Operating / Now on owner confirmation that operator-approved distribution is available. The mechanism is unchanged from the 2026-07-05 build state, which already recorded manual approve/send paths as active; what changed is the published state, not the capability. The summary still says automatic public broadcast is off for the bridge and liquidity-pool pillars, because that remains true and is a different milestone.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // ── Next — in public test or gated access ──────────────────────────────────
  {
    id: "protocol-testnet-v01",
    title: "Protocol v0.1 reachable on Moonbase Alpha",
    systemSlug: "sagitta-protocol",
    state: "Public Test",
    horizon: "Next",
    summary:
      "Vault, Treasury, Escrow, and Reserve are deployed to Moonbeam's testnet at v0.1, with a wallet-connect interface and portfolio view. No mainnet deployment is published.",
    evidence: {
      label: "protocol.sagitta.systems",
      href: "https://protocol.sagitta.systems",
      external: true,
    },
    updatedAt: null,
    featured: true,
    verification: verified("https://protocol.sagitta.systems"),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "banking-design-partners",
    title: "Institutional settlement control layer in design-partner discussions",
    systemSlug: "sagitta-banking",
    state: "In Development",
    horizon: "Next",
    summary:
      "The control surface — eligibility, allocation ceilings, approved routes, approval boundaries, lifecycle state, and evidence return — is specified publicly and is being shaped with banks and core banking partners.",
    evidence: {
      label: "banking.sagitta.systems",
      href: "https://banking.sagitta.systems",
      external: true,
    },
    updatedAt: null,
    featured: true,
    verification: verified("https://banking.sagitta.systems"),
    publicationState: "published",
    visibility: "public",
  },

  // ── Horizon — architecture still forming ───────────────────────────────────
  {
    id: "wallet-guided-experience-demo",
    title: "Guided wallet experience demonstrable end to end",
    systemSlug: "sagitta-wallet",
    state: "In Development",
    horizon: "Horizon",
    summary:
      "Onboarding, portfolio stance, guided allocation through Selun, research, and monthly reporting are all walkable in a public demo running on sample data — not on live funds.",
    evidence: {
      label: "wallet.sagitta.systems",
      href: "https://wallet.sagitta.systems",
      external: true,
    },
    updatedAt: null,
    featured: false,
    verification: verified(
      "https://wallet.sagitta.systems + Wallet/README.md",
      "Re-sequenced from Next to Horizon on owner direction, 1 August 2026. The claim is unchanged and was not re-verified: horizons carry sequence rather than evidence, and Wallet is already published as a concept-stage system. The state stays In Development because it describes this milestone's demo, which exists on sample data.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "protocol-mainnet",
    title: "Protocol beyond testnet",
    systemSlug: "sagitta-protocol",
    state: "Research Horizon",
    horizon: "Horizon",
    summary:
      "Moving the protocol past a v0.1 testnet deployment requires the reserve, escrow, and continuity paths to hold under adversarial conditions. No mainnet timing has been committed publicly.",
    evidence: {
      label: "Whitepaper",
      href: "https://sagitta-protocol.gitbook.io/sagitta-whitepaper",
      external: true,
    },
    updatedAt: null,
    featured: false,
    verification: verified(
      "https://protocol.sagitta.systems + whitepaper",
      "Interface reports testnet only. No published mainnet plan or date exists — summary deliberately states no timing.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "cross-chain-capital-routing",
    title: "Cross-chain capital routing through XCM",
    systemSlug: "sagitta-protocol",
    state: "Research Horizon",
    horizon: "Horizon",
    summary:
      "The batch-based Escrow is designed to route investment to other parachains over XCM — parachain treasury strategies, cross-chain staking, and RWA flows without bridging risk. Described in the protocol documentation as future use.",
    evidence: {
      label: "Whitepaper",
      href: "https://sagitta-protocol.gitbook.io/sagitta-whitepaper",
      external: true,
    },
    updatedAt: null,
    featured: false,
    verification: verified(
      "SAGProtocol/README.md",
      "README labels cross-chain investment routing explicitly as '(Future Use)'.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "radar-provider-expansion",
    title: "Broader bridge and liquidity-pool provider coverage",
    systemSlug: "sagitta-radar",
    state: "In Development",
    horizon: "Horizon",
    summary:
      "Additional bridge providers are staged behind activation flags, and further pool adapters remain in the backlog. Coverage claims stay limited to providers that have actually been checked live.",
    evidence: {
      label: "radar.sagitta.systems",
      href: "https://radar.sagitta.systems",
      external: true,
    },
    updatedAt: "2026-07-05",
    featured: false,
    verification: verified(
      "SCE/SCE_BUILD_STATE.md (baseline 2026-07-05)",
      "Wormhole EVM routes activation-ready but disabled by default; Wormhole Solana pending; LayerZero/Axelar/Hyperlane in backlog with no adapter.",
    ),
    publicationState: "published",
    visibility: "public",
  },
];

export const roadmapHorizons: { id: RoadmapHorizon; title: string; description: string }[] = [
  {
    id: "Now",
    title: "Now",
    description: "Operating today on a public surface, with evidence you can open.",
  },
  {
    id: "Next",
    title: "Next",
    description:
      "In public test, in demo, or in design-partner development. Reachable, but not finished.",
  },
  {
    id: "Horizon",
    title: "Horizon",
    description:
      "Architecture still forming. Documented intent, no committed delivery timing.",
  },
];

/** The only list public roadmap views may use. */
export const publicRoadmapItems = roadmapItems.filter(
  (item) => item.publicationState === "published" && item.visibility === "public",
);

export function roadmapByHorizon(horizon: RoadmapHorizon): RoadmapItem[] {
  return publicRoadmapItems.filter((item) => item.horizon === horizon);
}

export function roadmapForSystem(slug: string): RoadmapItem[] {
  return publicRoadmapItems.filter((item) => item.systemSlug === slug);
}

/** Current priorities shown on the homepage roadmap signal. */
export const featuredRoadmapItems = publicRoadmapItems.filter((item) => item.featured);
