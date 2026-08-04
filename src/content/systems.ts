import type {
  CapabilityRecord,
  SystemFamily,
  SystemFamilyId,
  SystemRecord,
  Verification,
} from "./types";

// Systems directory — eight systems across three strategic families.
//
// The ecosystem has three core foundations and four services attached to them:
//
//   AAA (core)                        → Selun (service)
//   Sagitta Continuity Engine (core)  → Sagitta Defense, Sagitta Radar
//   Sagitta Protocol (core)           → Sagitta Banking
//
// Sagitta Wallet is the eighth record and is a concept-stage system: it is not
// attached to a foundation yet, and it is never presented as operating. The
// relationship is carried by `systemKind` and `parentSystem` so the
// architecture is a typed fact rather than something a reader has to infer
// from the family groupings.
//
// Every operating state below was assigned from observable evidence, not from
// the existence of a DNS record. Each system was checked against its public
// surface on 2026-07-29; the `verification.source` field records what was
// checked. Where a repository document is the source, the path is given
// relative to the Sagitta projects root.
//
// Grants, Rebalancing, and Selun x402 are NOT systems. They are supporting
// capabilities delivered through systems, and live in `capabilities` below.

const VERIFIED_ON = "2026-07-29";

function verified(source: string, note?: string): Verification {
  return { status: "verified", source, lastVerifiedAt: VERIFIED_ON, note };
}

export const systemFamilies: SystemFamily[] = [
  {
    id: "continuity-defense",
    name: "Continuity and Defense",
    shortName: "Continuity",
    token: "continuity",
    motif: "signal",
    summary:
      "Keeping protocols operating through control failure: continuity doctrine, defense review, and infrastructure monitoring.",
    order: 1,
  },
  {
    id: "allocation-agent-intelligence",
    name: "Allocation and Agent Intelligence",
    shortName: "Allocation",
    token: "allocation",
    motif: "intelligence",
    summary:
      "Deciding where capital goes: policy-governed allocation for institutions, for individuals, and for other agents.",
    order: 2,
  },
  {
    id: "capital-infrastructure",
    name: "Capital Infrastructure",
    shortName: "Capital",
    token: "capital",
    motif: "ledger",
    summary:
      "Holding and moving capital: the protocol layer, institutional settlement, treasury support, and the wallet surface.",
    order: 3,
  },
];

const WHITEPAPER = "https://sagitta-protocol.gitbook.io/sagitta-whitepaper";

export const systems: SystemRecord[] = [
  // ── Continuity and Defense ─────────────────────────────────────────────────
  {
    slug: "sagitta-continuity-engine",
    name: "Sagitta Continuity Engine",
    shortName: "SCE",
    family: "continuity-defense",
    systemKind: "core",
    summary:
      "A doctrine-driven continuity engine that models how a protocol fails and what it does next.",
    ecosystemRole:
      "The Continuity Engine keeps the ecosystem operational through disruption, and is embedded in Sagitta Protocol as a component rather than an integration.",
    problem:
      "Audits examine code. They do not establish whether a protocol survives the failure of its own controls — a compromised admin key, a stalled oracle, an unreachable keeper, a governance capture.",
    overview: [
      "SCE models catastrophic protocol failure and produces a decision record for each scenario it runs. It works on authority surfaces and control readiness rather than code vulnerabilities, which makes it complementary to an audit rather than a substitute for one.",
      "The engine is the intelligence layer beneath the rest of the Continuity and Defense family: Sagitta Defense delivers its findings as a client engagement, and Sagitta Radar runs its monitoring pillars against live infrastructure.",
      "Decision records are hashed and written to an append-only audit layer, so the reasoning behind a continuity decision remains inspectable after the fact.",
    ],
    availableToday: [
      "A public product surface describing the methodology, threat families, and review scope",
      "A sample defense report showing the structure of the output",
      "Portal sign-in for review clients",
    ],
    audience: ["Protocol teams", "DAOs", "Treasury projects", "Security leads"],
    status: "Operating",
    statusEvidence:
      "Public product surface with sign-in and a downloadable sample report. Some live feeds on the site were showing a reconnecting state when last checked.",
    operatingUrl: "https://sce.sagitta.systems",
    subdomain: "sce.sagitta.systems",
    evidence: [
      { label: "SCE product surface", href: "https://sce.sagitta.systems", external: true },
      { label: "Defense Review methodology", href: "https://defense.sagitta.systems", external: true },
      { label: "Protocol architecture diagram", href: "/diagram.png", external: true },
    ],
    connections: [
      {
        slug: "sagitta-defense",
        reason: "Defense delivers SCE findings as a fixed-scope client engagement",
        shortReason: "delivers findings",
        strength: "structural",
      },
      {
        slug: "sagitta-radar",
        reason: "Radar runs SCE's monitoring pillars against live infrastructure",
        shortReason: "runs monitoring pillars",
        strength: "structural",
      },
    ],
    primaryAction: {
      id: "system:sagitta-continuity-engine:open",
      label: "Open the Continuity Engine",
      href: "https://sce.sagitta.systems",
      external: true,
      type: "open-product",
      availability: "available",
      audience: "Protocol teams and security leads",
    },
    secondaryAction: {
      id: "system:sagitta-continuity-engine:evidence",
      label: "Inspect the evidence",
      href: "/systems/sagitta-continuity-engine#evidence",
      type: "evidence",
      availability: "available",
    },
    logo: "/sce.png",
    featured: true,
    verification: verified(
      "https://sce.sagitta.systems + SCE/README.md",
      "Live surface confirms marketing site, sample report, portal login. Site itself reports 'critical incident feed temporarily unavailable' and 'case library sync pending' — status copy reflects that.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "sagitta-defense",
    name: "Sagitta Defense",
    shortName: "Defense",
    family: "continuity-defense",
    systemKind: "service",
    parentSystem: "sagitta-continuity-engine",
    summary:
      "A fixed-scope Defense Review that maps whether a protocol can survive control failure.",
    ecosystemRole:
      "Sagitta Defense commercializes the Continuity Engine's doctrine as a fixed-scope engagement, and tests it against real protocols outside the ecosystem.",
    problem:
      "Teams discover their authority surface during the incident. Admin paths, upgrade rights, treasury authority, oracle dependencies, and emergency procedures are rarely mapped until they fail.",
    overview: [
      "A Defense Review examines authority structures, treasury controls, oracle dependencies, governance mechanisms, keeper systems, and emergency procedures. As the service puts it: audits review code; Defense Reviews map whether the system can survive control failure.",
      "The review runs on public contract data and project context. It requires no private keys, no custody access, no signing authority, and no transaction approval rights.",
      "Findings are produced from Sagitta Continuity Engine intelligence and delivered as a written report.",
    ],
    availableToday: [
      "A Starter Defense Review at a published flat fee of $3,000",
      "A downloadable sample report showing structure and methodology",
      "A published FAQ covering scope, access requirements, and delivery",
    ],
    audience: ["Protocol teams", "DAOs", "Treasury operators"],
    status: "Operating",
    statusEvidence:
      "Publicly priced engagement with a stated delivery timeline and a sample deliverable available for download.",
    operatingUrl: "https://defense.sagitta.systems",
    subdomain: "defense.sagitta.systems",
    evidence: [
      { label: "Defense Review service", href: "https://defense.sagitta.systems", external: true },
      { label: "Sagitta Labs security posture", href: "https://www.sagittalabs.com/security", external: true },
    ],
    primaryAction: {
      id: "system:sagitta-defense:review-inquiry",
      label: "Request a Defense Review",
      href: "https://defense.sagitta.systems",
      external: true,
      type: "defense-review",
      availability: "available",
      audience: "Protocol teams, DAOs, and treasury operators",
      note: "Starter Defense Review, published at a flat $3,000 for a fixed scope.",
    },
    secondaryAction: {
      id: "system:sagitta-defense:evidence",
      label: "Read the sample report",
      href: "https://defense.sagitta.systems",
      external: true,
      type: "evidence",
      availability: "available",
    },
    logo: "/defense.png",
    featured: true,
    verification: verified(
      "https://defense.sagitta.systems",
      "Confirms $3,000 flat fee Starter Defense Review, ~7 day typical delivery, sample PDF, no-key access model, and the '801 critical incidents' figure attributed to SCE.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "sagitta-radar",
    name: "Sagitta Radar",
    shortName: "Radar",
    family: "continuity-defense",
    systemKind: "service",
    parentSystem: "sagitta-continuity-engine",
    summary:
      "Real-time monitoring of the DeFi infrastructure a protocol depends on — oracles, bridges, and liquidity pools.",
    ecosystemRole:
      "Sagitta Radar commercializes the Continuity Engine's monitoring capability as a live infrastructure surface, and supplies the external signal the ecosystem reacts to.",
    problem:
      "Most protocols do not own the infrastructure they depend on. A stale oracle, a paused bridge route, or a drained pool becomes their problem without ever appearing in their own telemetry.",
    overview: [
      "Radar watches three pillars of external dependency: oracle price freshness and deviation, bridge route settlement and pauses, and liquidity-pool depth, deviation, and imbalance. Signals are delivered as alerts with severity filtering, and as structured daily briefings.",
      "Watchlists scope monitoring to the specific dependencies a protocol actually relies on, so alerts arrive about the infrastructure that matters to that team rather than the whole market.",
      "Radar runs on the Sagitta Continuity Engine backend, which is what connects an infrastructure signal to continuity doctrine rather than leaving it as an isolated alert.",
    ],
    availableToday: [
      "Four published subscription plans — Watch, Intel, Signal, and Desk — priced on the product page",
      "A public alert feed and community channels on Discord and Telegram",
      "Alert delivery to Discord, Telegram, and webhooks with severity filtering",
    ],
    audience: ["Protocol teams", "Infrastructure operators", "Treasury operators", "DAOs"],
    status: "Operating",
    statusEvidence:
      "Public subscription product with four priced plans, sign-in, live alert feed, and published coverage across Chainlink, Uniswap v3, Aerodrome, and bridge routes.",
    operatingUrl: "https://radar.sagitta.systems",
    subdomain: "radar.sagitta.systems",
    evidence: [
      { label: "Radar product and plans", href: "https://radar.sagitta.systems", external: true },
    ],
    primaryAction: {
      id: "system:sagitta-radar:open",
      label: "Open Sagitta Radar",
      href: "https://radar.sagitta.systems",
      external: true,
      type: "open-product",
      availability: "available",
      audience: "Protocol teams and infrastructure operators",
      note: "Four subscription plans. Current pricing is on the product page.",
    },
    secondaryAction: {
      id: "system:sagitta-radar:verification-record",
      label: "Read the verification record",
      href: "/newsroom/sagitta-radar-operating-status-july-2026",
      type: "evidence",
      availability: "available",
    },
    // Radar has its own mark as of the launch pass. It previously borrowed the
    // Continuity Engine's, which was accurate about the backend it runs on and
    // wrong about the product being its own.
    logo: "/radar.png",
    featured: true,
    verification: verified(
      "https://radar.sagitta.systems + SCE/SCE_BUILD_STATE.md (2026-07-05)",
      "Live site confirms plans (Watch $29, Intel $99, Signal $149, Desk $2,500+) and coverage. Build state confirms Oracle/Bridge/LP pillars with live adapters; public broadcast for Bridge and LP pillars is operator-approved rather than automatic — copy avoids claiming automatic public broadcast. The product name is 'Sagitta Radar', used with no adjacent attribution: Phase 3 removed the 'by Sagitta Labs' lockup because this site already supplies the development context.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // ── Allocation and Agent Intelligence ──────────────────────────────────────
  {
    slug: "aaa",
    name: "Autonomous Allocation Agent",
    shortName: "AAA",
    family: "allocation-agent-intelligence",
    systemKind: "core",
    summary:
      "Policy-governed allocation intelligence for DAOs, treasuries, and portfolio managers, built on the principle that authority precedes automation.",
    ecosystemRole:
      "The Autonomous Allocation Agent determines how capital is evaluated and allocated, and is embedded in Sagitta Protocol as a component rather than an integration.",
    problem:
      "Allocation decisions in crypto-native institutions are made faster than governance can review them, and the reasoning behind them is rarely reconstructable afterwards.",
    overview: [
      "AAA produces allocation decisions under explicit governance constraints rather than discretionary judgement. Each decision carries its risk analysis and an explanation, so the record of why capital moved survives the person who moved it.",
      "The product publishes its methodology, decision records, and a research programme covering decision theory, system architecture, policy design, and regime modelling.",
      "AAA is the allocation foundation of the network: Selun is the service built on it, and the same intelligence is what Sagitta Protocol's quantitative recommendations are produced from.",
    ],
    availableToday: [
      "Four access tiers — free Observer Access, then Sandbox Authority, Production Authority, and enterprise Doctrine Authority — priced on the AAA pricing page",
      "Published methodology, decision-record documentation, and a changelog",
      "Four published research notes and audience guides for DAOs, treasury operators, and portfolio managers",
    ],
    audience: ["DAOs", "Treasury operators", "Portfolio managers", "Funds"],
    status: "Operating",
    statusEvidence:
      "Public product with four published access tiers, documentation, a versioned changelog, and a published research programme.",
    operatingUrl: "https://aaa.sagitta.systems",
    subdomain: "aaa.sagitta.systems",
    documentationUrl: "https://aaa.sagitta.systems/docs",
    evidence: [
      { label: "AAA documentation", href: "https://aaa.sagitta.systems/docs", external: true },
      { label: "Methodology", href: "https://aaa.sagitta.systems/methodology", external: true },
      { label: "Research notes", href: "https://aaa.sagitta.systems/research-notes", external: true },
      { label: "Protocol architecture diagram", href: "/diagram.png", external: true },
    ],
    connections: [
      {
        slug: "selun",
        reason: "Selun is the service built on AAA — the same intelligence, as a plan an individual can act on",
        shortReason: "built on",
        strength: "structural",
      },
      {
        slug: "sagitta-protocol",
        reason: "AAA supplies the protocol's quantitative allocation recommendations",
        shortReason: "supplies recommendations",
        strength: "structural",
      },
    ],
    primaryAction: {
      id: "system:aaa:open",
      label: "Open AAA",
      href: "https://aaa.sagitta.systems",
      external: true,
      type: "open-product",
      availability: "available",
      audience: "DAOs, treasury operators, and portfolio managers",
      note: "Four access tiers, starting with free Observer Access.",
    },
    secondaryAction: {
      id: "system:aaa:documentation",
      label: "Read the documentation",
      href: "https://aaa.sagitta.systems/docs",
      external: true,
      type: "documentation",
      availability: "available",
    },
    logo: "/aaa.png",
    featured: true,
    verification: verified(
      "https://aaa.sagitta.systems/sitemap.xml, /pricing, /research-notes",
      "Sitemap confirms 23 public URLs including pricing, docs, methodology, decision-records, changelog and four research notes. Pricing tiers confirmed: Observer Access (free), Sandbox Authority $79/mo, Production Authority $499/mo, Doctrine Authority (enterprise).",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "selun",
    name: "Selun",
    shortName: "Selun",
    family: "allocation-agent-intelligence",
    systemKind: "service",
    parentSystem: "aaa",
    summary:
      "A guided allocation product that turns Sagitta's institutional allocation intelligence into a plan an individual can act on.",
    ecosystemRole:
      "Selun exposes the Allocation Agent's intelligence as a customer-facing agent — to individuals through the wizard, and to other agents through its x402 surface.",
    problem:
      "The reasoning that institutions apply to allocation is not available to individual holders, who are left choosing between unexplained signals and their own judgement.",
    overview: [
      "Selun runs a guided allocation wizard over the same allocation intelligence AAA provides to institutions, and returns a portfolio plan with an optional certified decision report.",
      "Checkout is available both by card and by onchain USDC settlement, with promo and referral support.",
      "Selun is the service built on the Autonomous Allocation Agent, and it is also where Sagitta's agent-payable surface lives: x402 is a capability of Selun, exposing the same intelligence to machines instead of people.",
    ],
    availableToday: [
      "The guided allocation wizard, end to end",
      "Card checkout and onchain USDC settlement",
      "An optional certified decision report",
      "The x402 agent-payable surface, advertising nine priced endpoints at /.well-known/x402",
    ],
    audience: ["Individual portfolio holders", "Operators", "Referral partners"],
    status: "Operating",
    statusEvidence:
      "Public product with a completable wizard and two working payment paths.",
    operatingUrl: "https://selun.sagitta.systems",
    subdomain: "selun.sagitta.systems",
    evidence: [
      { label: "Selun", href: "https://selun.sagitta.systems", external: true },
      { label: "Allocation wizard", href: "https://selun.sagitta.systems/wizard", external: true },
      {
        label: "x402 discovery document",
        href: "https://selun.sagitta.systems/.well-known/x402",
        external: true,
      },
    ],
    capabilitySlugs: ["rebalancing", "selun-x402"],
    connections: [
      {
        slug: "sagitta-continuity-engine",
        reason: "Selun's x402 surface advertises SCE's continuity evaluation to agents",
        shortReason: "advertises via x402",
        strength: "contextual",
      },
    ],
    primaryAction: {
      id: "system:selun:open-wizard",
      label: "Open the allocation wizard",
      href: "https://selun.sagitta.systems/wizard",
      external: true,
      type: "open-product",
      availability: "available",
      audience: "Individual portfolio holders",
      note: "Card checkout or onchain USDC settlement.",
    },
    secondaryAction: {
      id: "system:selun:methodology",
      label: "Read the allocation methodology",
      href: "https://aaa.sagitta.systems/methodology",
      external: true,
      type: "documentation",
      availability: "available",
    },
    logo: "/selun.svg",
    featured: true,
    verification: verified(
      "https://selun.sagitta.systems + AAA/SelunAgent/README.md",
      "Live site is client-rendered so the fetched HTML carries only the title; product surfaces (wizard, Stripe checkout, onchain USDC, referrals, reports) are confirmed by the SelunAgent repository README. The x402 discovery document on the same host independently confirms the deployment is live.",
    ),
    publicationState: "published",
    visibility: "public",
  },

  // ── Capital Infrastructure ─────────────────────────────────────────────────
  {
    slug: "sagitta-banking",
    name: "Sagitta Banking",
    shortName: "Banking",
    family: "capital-infrastructure",
    systemKind: "service",
    parentSystem: "sagitta-protocol",
    summary:
      "A control layer connecting familiar deposit products to programmable USDC settlement and policy-governed allocation.",
    ecosystemRole:
      "Sagitta Banking connects institutional account infrastructure to the Protocol, and is the route by which regulated deposit capital reaches it.",
    problem:
      "A bank cannot put a deposit product onchain by adding a rail. It needs eligibility, allocation ceilings, approved routes, approval boundaries, lifecycle state, and returnable evidence — enforced at every transition.",
    overview: [
      "Sagitta Banking sits between core banking and onchain execution. It translates funding, enrolment, term, maturity, and credit events into one controlled lifecycle, and holds each product's operating rules as versioned configuration enforced at every transition.",
      "It coordinates the path between bank-side funds, USDC settlement, and onchain execution, then hands references, receipts, policy context, and exception records back to the teams accountable for oversight.",
      "The system is in product development and is being shaped through design-partner discussions rather than a public launch.",
    ],
    availableToday: [
      "A public architecture and control-surface description",
      "A design-partner briefing request for banks, fintechs, and core banking partners",
    ],
    audience: ["Banks", "Fintechs", "Core banking partners"],
    status: "In Development",
    statusEvidence:
      "The product surface states plainly that Sagitta Banking is in product development, with scope and launch requirements defined per institution. There is no live product, pilot access, or waitlist.",
    operatingUrl: "https://banking.sagitta.systems",
    subdomain: "banking.sagitta.systems",
    evidence: [
      { label: "Sagitta Banking", href: "https://banking.sagitta.systems", external: true },
    ],
    primaryAction: {
      id: "system:sagitta-banking:partnership",
      label: "Discuss an integration",
      href: "https://banking.sagitta.systems",
      external: true,
      type: "partnership",
      availability: "by-request",
      audience: "Banks, fintechs, and core banking partners",
      note: "Design-partner briefings only. There is no public product, pilot, or waitlist.",
    },
    secondaryAction: {
      id: "system:sagitta-banking:roadmap",
      label: "Review the roadmap",
      href: "/roadmap#next",
      type: "roadmap",
      availability: "available",
    },
    // A horizontal lockup (660×190), not a square mark — so it goes in
    // `wordmark`, and Banking still falls back to the family motif wherever an
    // icon-scale mark is required. See the note on both fields in `types.ts`.
    wordmark: "/wordmark-sagitta-banking.webp",
    featured: false,
    verification: verified(
      "https://banking.sagitta.systems",
      "Site footer states: 'Sagitta Banking is in product development. Features, integrations, and availability may change as the architecture advances with design partners.' Only action available is requesting a briefing.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "sagitta-protocol",
    name: "Sagitta Protocol",
    shortName: "Protocol",
    family: "capital-infrastructure",
    systemKind: "core",
    summary:
      "The protocol layer for trustless capital management: vault custody, treasury liquidity, a gold-backed reserve, and continuity-governed recovery.",
    ecosystemRole:
      "Sagitta Protocol executes and governs the capital system, and is the layer the intelligence and continuity capabilities are built to run inside.",
    problem:
      "Capital protection in DeFi is usually a promise made by operators. It survives exactly as long as their discretion does.",
    overview: [
      "Sagitta Protocol treats capital protection, loss accountability, and survivability as first-class system requirements enforced by architecture rather than operator judgement. Its components are the Vault for custody and accounting, the Treasury for liquidity and settlement, the Reserve as a gold-backed insurance layer, Escrow as the interface to external allocation venues, the Autonomous Allocation Agent for quantitative recommendations, and the Continuity Engine for survival and recovery.",
      "The protocol is deployed on Moonbase Alpha Testnet, the Moonbeam testnet, at v0.1, and on Arc Testnet. Deposits on Moonbase Alpha Testnet are Polkadot-native: DOT crosses into Moonbeam as xcDOT via XCM and is accepted directly by the Vault. Both deployments are testnets.",
      "It is the layer the rest of Capital Infrastructure is designed to settle into.",
    ],
    availableToday: [
      "A v0.1 deployment reachable on Moonbase Alpha Testnet, launched 13 April 2026",
      "A second testnet deployment on Arc Testnet, launched 11 May 2026",
      "A wallet-connect interface, portfolio view, and links into the allocation and continuity systems",
      "The full whitepaper covering architecture, doctrine, and capital-flow design",
    ],
    audience: ["Protocol teams", "Funds", "Ecosystem partners", "Researchers"],
    status: "Public Test",
    statusEvidence:
      "The interface reports v0.1 active on Moonbase Alpha Testnet, and a second deployment launched on Arc Testnet. Both are testnets; no mainnet deployment or contract addresses are published.",
    operatingUrl: "https://protocol.sagitta.systems",
    subdomain: "protocol.sagitta.systems",
    documentationUrl: WHITEPAPER,
    evidence: [
      { label: "Sagitta whitepaper", href: WHITEPAPER, external: true },
      { label: "Protocol interface", href: "https://protocol.sagitta.systems", external: true },
      { label: "Protocol architecture diagram", href: "/diagram.png", external: true },
    ],
    connections: [
      {
        slug: "aaa",
        reason: "The Autonomous Allocation Agent supplies the protocol's quantitative recommendations",
        shortReason: "supplies recommendations",
        strength: "structural",
      },
      {
        slug: "sagitta-continuity-engine",
        reason: "The Continuity Engine governs survival and recovery inside the protocol architecture",
        shortReason: "governs continuity",
        strength: "structural",
      },
      {
        slug: "sagitta-banking",
        reason: "Banking is the service attached to the protocol layer, and settles into it",
        shortReason: "settles into",
        strength: "structural",
      },
    ],
    primaryAction: {
      id: "system:sagitta-protocol:public-test",
      label: "Explore the public test",
      href: "https://protocol.sagitta.systems",
      external: true,
      type: "demonstration",
      availability: "available",
      audience: "Protocol teams, funds, and researchers",
      note: "v0.1 on Moonbase Alpha Testnet, with a second deployment on Arc Testnet. No mainnet deployment is published.",
    },
    secondaryAction: {
      id: "system:sagitta-protocol:whitepaper",
      label: "Read the architecture",
      href: WHITEPAPER,
      external: true,
      type: "documentation",
      availability: "available",
    },
    logo: "/protocol.png",
    featured: true,
    verification: verified(
      "https://protocol.sagitta.systems + whitepaper executive summary + owner-supplied launch dates (2026-07-31)",
      "Interface reports 'Active' on Moonbase Alpha and v0.1. Testnet, not mainnet — status is Public Test, not Operating. The two launch dates (Moonbase Alpha Testnet 2026-04-13, Arc Testnet 2026-05-11) are owner-supplied and are recorded as two separate milestones; neither is presented as a mainnet event, and 'Testnet' is carried in every state claim. Whitepaper confirms component set. No version or publication date is stated on the whitepaper itself.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "sagitta-wallet",
    name: "Sagitta Wallet",
    shortName: "Wallet",
    family: "capital-infrastructure",
    systemKind: "concept",
    summary:
      "A concept-stage wallet surface for agent-native portfolio execution, published as an interactive demo on sample data.",
    // Concept stage, and the sentence says so. A contribution stated in the
    // present tense here would claim an operating capability the demo does not
    // have, which is the same error the promotional layer avoids by marking
    // Wallet N/A rather than a coverage gap.
    ecosystemRole:
      "Sagitta Wallet explores how a holder would act on the ecosystem's decisions directly. It contributes a concept surface, not an operating capability.",
    problem:
      "A wallet tells you what you hold. It does not tell you what to do next, and it carries none of the reasoning that produced the position.",
    overview: [
      "Sagitta Wallet is a concept for guided capital decisions rather than storage: portfolio stance, next best actions, guided allocation through Selun, token research, and monthly reporting.",
      "What is public today is a demo of that experience running on sample data, not a live wallet holding funds. The onboarding, portfolio, allocation, research, and reporting flows are all demonstrable end to end.",
      "It is at research horizon and is not attached to a foundation in the way the four service systems are. Nothing here is offered as an operating product, and the absence of promotional material for it is deliberate rather than a gap.",
    ],
    availableToday: [
      "An interactive demo of the wallet experience, running on sample data",
      "A walkthrough of onboarding, funding, and guidance flows",
    ],
    audience: ["Individual portfolio holders", "Agent operators"],
    status: "Research Horizon",
    statusEvidence:
      "The public surface is a concept and demo page running on mocked data. The repository describes it as an investor-demo-ready vertical slice. No live wallet, custody path, or funded account exists.",
    operatingUrl: "https://wallet.sagitta.systems",
    subdomain: "wallet.sagitta.systems",
    evidence: [
      { label: "Wallet demo", href: "https://wallet.sagitta.systems", external: true },
    ],
    connections: [
      {
        slug: "selun",
        reason: "Guided allocation inside the wallet runs through Selun",
        shortReason: "guided allocation",
        strength: "structural",
      },
    ],
    primaryAction: {
      id: "system:sagitta-wallet:demonstration",
      label: "View the demonstration",
      href: "https://wallet.sagitta.systems",
      external: true,
      type: "demonstration",
      availability: "available",
      audience: "Individual portfolio holders and agent operators",
      note: "An interactive demo on sample data. Not a live wallet, and it holds no funds.",
    },
    secondaryAction: {
      id: "system:sagitta-wallet:roadmap",
      label: "Follow development",
      href: "/roadmap#next",
      type: "roadmap",
      availability: "available",
    },
    // The house constellation, not a mark of its own. A concept-stage system
    // has not earned separate identity, and wearing the network mark says that
    // more honestly than a bespoke logo would.
    logo: "/sagitta.png",
    featured: false,
    verification: verified(
      "https://wallet.sagitta.systems + Wallet/README.md + owner decision (2026-07-31)",
      "README: 'Investor-demo-ready vertical slice ... Mocked portfolio, onboarding, research, Selun, and reporting data.' Live page presents demo paths only. Reclassified from In Development to Research Horizon, and typed as a concept-stage system: the demo is real and stays on the record, but Wallet is not promoted as operating and carries no promotional coverage obligation.",
    ),
    publicationState: "published",
    visibility: "public",
  },
];

// ─── Supporting capabilities ─────────────────────────────────────────────────
//
// Preserved from the previous site. These are delivered through systems and are
// deliberately not presented as peer systems: no operating-status badge, and
// excluded from every system count.

export const capabilities: CapabilityRecord[] = [
  {
    slug: "selun-x402",
    name: "Selun x402",
    summary:
      "Selun's agent-payable surface: the same allocation and continuity intelligence, advertised as priced endpoints other agents can discover and call.",
    overview: [
      "x402 is a capability of Selun rather than a system of its own. It publishes an x402 discovery document at a well-known path on the Selun host, advertising priced endpoints an agent can call and settle without a human account.",
      "The advertised surface covers allocation (allocate, allocate-with-report), market and policy context (market-regime, policy-envelope, asset-scorecard), portfolio action (rebalance), and continuity evaluation drawn from SCE (continuity-mode, case-relevance, risk-evaluate).",
      "It is the agent-facing face of one product, not a second one: the same intelligence, addressed by machines instead of people, on the same deployment.",
    ],
    audience: ["Agent developers", "Autonomous agents", "Integrators"],
    deliveredBy: ["selun", "sagitta-continuity-engine", "aaa"],
    accessPath:
      "Read the discovery document at selun.sagitta.systems/.well-known/x402 and call the advertised endpoints. Per-call prices are set in the document itself.",
    operatingUrl: "https://selun.sagitta.systems/.well-known/x402",
    evidence: [
      {
        label: "x402 discovery document",
        href: "https://selun.sagitta.systems/.well-known/x402",
        external: true,
      },
    ],
    primaryAction: {
      id: "capability:selun-x402:endpoints",
      label: "Review the available endpoints",
      href: "https://selun.sagitta.systems/.well-known/x402",
      external: true,
      type: "documentation",
      availability: "available",
      audience: "Agent developers and integrators",
      note: "Per-call prices are set in the discovery document itself.",
    },
    verification: verified(
      "https://selun.sagitta.systems/.well-known/x402 + owner decision (2026-07-31)",
      "Reclassified from system to capability. The discovery document is served from the Selun host and advertises Selun's own intelligence — it is a surface of one product, not a second product. Endpoints confirmed: allocate, allocate-with-report, market-regime, policy-envelope, asset-scorecard, rebalance, continuity-mode, case-relevance, risk-evaluate. Per-call pricing is not restated here because it is set in the document and changes.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    slug: "grants",
    name: "Grants",
    summary:
      "Grant strategy, application support, ecosystem positioning, and funding readiness. Archived — not a current offering.",
    overview: [
      "Grants was an ecosystem and funding-support capability: helping a protocol team position itself for grant programmes and arrive at an application already able to answer the questions that decide it.",
      "It is archived. It is not currently offered, and this record exists so the history stays on the public record rather than disappearing from it.",
      "The continuity and control work that Sagitta Defense and the Continuity Engine produce is frequently what a funding committee is actually asking about. That work continues; the packaged grants capability does not.",
    ],
    audience: ["Protocol teams", "Ecosystem partners"],
    deliveredBy: ["sagitta-continuity-engine", "sagitta-defense"],
    accessPath:
      "Not currently offered. Sagitta Defense is the closest active engagement.",
    evidence: [],
    verification: {
      status: "verified",
      source: "Owner decision (2026-07-29); previous sagitta.systems homepage copy",
      lastVerifiedAt: VERIFIED_ON,
      note:
        "Archived by owner decision as a historical capability rather than a current offering. grants.sagitta.systems does not resolve; the Phase 1 operating URL was broken and has been removed. Original description preserved above.",
    },
    publicationState: "archived",
    visibility: "public",
  },
  {
    slug: "rebalancing",
    name: "Rebalancing",
    summary:
      "Portfolio rebalance recommendations, delivered through Selun for people and through the x402 surface for agents.",
    overview: [
      "Rebalancing is not a separate destination. It is a capability of the allocation family: Selun produces a rebalance as part of its guided plan, and the Selun x402 surface advertises `rebalance` as a directly callable, agent-payable endpoint.",
      "The underlying allocation intelligence in both paths is AAA's.",
    ],
    audience: ["Individual portfolio holders", "Agent developers", "Treasury operators"],
    deliveredBy: ["selun", "aaa"],
    accessPath:
      "Through the Selun allocation wizard, or by calling the `rebalance` endpoint advertised in the Selun x402 discovery document.",
    evidence: [
      { label: "Selun allocation wizard", href: "https://selun.sagitta.systems/wizard", external: true },
      {
        label: "x402 discovery document (advertises `rebalance`)",
        href: "https://selun.sagitta.systems/.well-known/x402",
        external: true,
      },
    ],
    primaryAction: {
      id: "capability:rebalancing:open-wizard",
      label: "Open the Selun allocation wizard",
      href: "https://selun.sagitta.systems/wizard",
      external: true,
      type: "open-product",
      availability: "available",
      audience: "Individual portfolio holders and agent developers",
    },
    verification: verified(
      "https://selun.sagitta.systems/.well-known/x402",
      "Reclassified from system to capability. Evidence for the reassignment: the x402 discovery document advertises `rebalance` under the Selun host, and the SelunAgent repository implements the wizard path. rebalancing.sagitta.systems does not resolve — the Phase 1 operating URL was broken and has been removed.",
    ),
    publicationState: "published",
    visibility: "public",
  },
];

// ─── Queries ─────────────────────────────────────────────────────────────────

/** Public systems only. This is what every count and directory must use. */
export const publicSystems = systems.filter(
  (s) => s.visibility === "public" && s.publicationState === "published",
);

/** Capabilities currently offered. Archived ones are excluded. */
export const publicCapabilities = capabilities.filter(
  (c) => c.visibility === "public" && c.publicationState === "published",
);

/** Historical capabilities, kept on the record but never presented as current. */
export const archivedCapabilities = capabilities.filter(
  (c) => c.visibility === "public" && c.publicationState === "archived",
);

export function getSystem(slug: string): SystemRecord | undefined {
  return systems.find((s) => s.slug === slug);
}

export function getCapability(slug: string): CapabilityRecord | undefined {
  return capabilities.find((c) => c.slug === slug);
}

export function getSystemName(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return getSystem(slug)?.name ?? getCapability(slug)?.name;
}

export function systemsByFamily(id: SystemFamily["id"]): SystemRecord[] {
  return publicSystems.filter((s) => s.family === id);
}

export function capabilitiesForSystem(slug: string): CapabilityRecord[] {
  return publicCapabilities.filter((c) => c.deliveredBy.includes(slug));
}

export const featuredSystems = publicSystems.filter((s) => s.featured);

// ─── The core / service architecture ─────────────────────────────────────────
//
// Three foundations, four services attached to them, and one concept-stage
// system. These derive from the records rather than being listed separately,
// so the architecture cannot drift from the systems that make it up.

/** The foundations other systems are built on or attached to. */
export const coreSystems = publicSystems.filter((s) => s.systemKind === "core");

/** Systems delivered on top of exactly one core foundation. */
export const serviceSystems = publicSystems.filter((s) => s.systemKind === "service");

/** Systems at concept or research stage, attached to no foundation yet. */
export const conceptSystems = publicSystems.filter((s) => s.systemKind === "concept");

/** The core foundation a service is attached to. */
export function parentOf(slug: string): SystemRecord | undefined {
  const parent = getSystem(slug)?.parentSystem;
  return parent ? getSystem(parent) : undefined;
}

/** The services attached to a core foundation, in directory order. */
export function servicesFor(slug: string): SystemRecord[] {
  return serviceSystems.filter((s) => s.parentSystem === slug);
}

/** Total system count. Capabilities are deliberately excluded. */
export const systemCount = publicSystems.length;

export function getFamily(id: SystemFamilyId): SystemFamily | undefined {
  return systemFamilies.find((f) => f.id === id);
}

/** Family of a system, resolved by slug. */
export function familyForSystem(slug: string): SystemFamily | undefined {
  const system = getSystem(slug);
  return system ? getFamily(system.family) : undefined;
}

// ─── The ecosystem relationship ──────────────────────────────────────────────
//
// A second relationship, orthogonal to everything above. The family grouping
// says which market a system sells into; `systemKind` and `parentSystem` say
// which foundation it is built on. Neither says why the network exists.
//
// This one does: every system contributes a capability the Sagitta Protocol
// ecosystem needs, and the contribution runs in a direction.
//
//   commercial surface  →  capability foundation  →  Sagitta Protocol
//
//   Sagitta Defense ┐
//   Sagitta Radar   ┴→ Continuity Engine ──┐
//   Selun           ──→ Allocation Agent ──┴→ Sagitta Protocol
//   Sagitta Banking ─────────────────────────↗
//
// Nothing here is authored a second time. The surfaces and the foundation each
// one feeds are read from `parentSystem`; the two foundations reach the
// Protocol through the Protocol's own `connections`, which already state that
// AAA and the Continuity Engine are embedded components rather than
// integrations. A surface whose parent *is* the Protocol — Banking — reaches it
// directly and carries no intermediate capability, which is why `via` is
// optional rather than a hardcoded exception.

export const PROTOCOL_SLUG = "sagitta-protocol";

export interface EcosystemContributor {
  system: SystemRecord;
  /**
   * The capability foundation this surface commercializes on its way into the
   * Protocol. Absent when the surface connects to the Protocol directly.
   */
  via?: SystemRecord;
}

export interface EcosystemFlow {
  /** What the ecosystem is built around. */
  protocol: SystemRecord;
  /** Foundations embedded in the Protocol as components. */
  capabilities: SystemRecord[];
  /** Independent commercial surfaces feeding capability into the Protocol. */
  surfaces: EcosystemContributor[];
  /** Concept stage: no operating contribution yet, and not presented as one. */
  horizon: SystemRecord[];
}

/**
 * The ecosystem view of the portfolio, derived from the same records the
 * architecture view uses. Returns undefined only if the Protocol record is
 * unpublished, which the content check already forbids.
 */
export function ecosystemFlow(): EcosystemFlow | undefined {
  const protocol = publicSystems.find((s) => s.slug === PROTOCOL_SLUG);
  if (!protocol) return undefined;

  return {
    protocol,
    capabilities: coreSystems.filter((s) => s.slug !== PROTOCOL_SLUG),
    surfaces: serviceSystems.map((system) => {
      const parent = parentOf(system.slug);
      return parent && parent.slug !== PROTOCOL_SLUG ? { system, via: parent } : { system };
    }),
    horizon: conceptSystems,
  };
}

// ─── The network graph ───────────────────────────────────────────────────────
//
// Edges come from `connections` on the system records, each of which restates a
// relationship the record's own overview copy already publishes. Nothing here
// is decorative: an edge exists only where one system is documented as running
// on, supplying, or exposing another.

export interface SystemEdge {
  from: string;
  to: string;
  reason: string;
  /** `reason` in two or three words, for the label printed on the wire. */
  shortReason?: string;
  strength: "structural" | "contextual";
  /** True when the two systems sit in different strategic families. */
  crossFamily: boolean;
}

const publicSystemSlugs = new Set(publicSystems.map((s) => s.slug));

/**
 * One edge per related pair. Connections are declared on a single side, but the
 * pair key is unordered so a relationship stated from both ends collapses to
 * one edge rather than drawing twice.
 */
export const systemEdges: SystemEdge[] = (() => {
  const seen = new Set<string>();
  const edges: SystemEdge[] = [];

  for (const system of publicSystems) {
    for (const connection of system.connections ?? []) {
      if (!publicSystemSlugs.has(connection.slug)) continue;
      const key = [system.slug, connection.slug].sort().join("::");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({
        from: system.slug,
        to: connection.slug,
        reason: connection.reason,
        shortReason: connection.shortReason,
        strength: connection.strength,
        crossFamily: getSystem(connection.slug)?.family !== system.family,
      });
    }
  }

  return edges;
})();

/** Edges touching a given system, in either direction. */
export function edgesForSystem(slug: string): SystemEdge[] {
  return systemEdges.filter((e) => e.from === slug || e.to === slug);
}

/** Systems documented as related to `slug`, with the reason for each link. */
export function relatedSystems(
  slug: string,
): { system: SystemRecord; reason: string; strength: SystemEdge["strength"] }[] {
  return edgesForSystem(slug)
    .map((edge) => {
      const other = getSystem(edge.from === slug ? edge.to : edge.from);
      return other ? { system: other, reason: edge.reason, strength: edge.strength } : undefined;
    })
    .filter((v): v is { system: SystemRecord; reason: string; strength: SystemEdge["strength"] } =>
      Boolean(v),
    );
}
