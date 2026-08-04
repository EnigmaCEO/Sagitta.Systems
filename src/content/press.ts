import { ecosystemThesis } from "./site";
import type { PressResource, PressSection, PressStatistic, Verification } from "./types";

// Press room.
//
// Phase 1 published fourteen sections, nine of them a "pending" card. That is
// not a press room, it is a list of absences. This pass publishes only the
// resources that are actually usable, records every sourced figure with its
// scope and last-verified date, and moves the rest to CONTENT_AUDIT.md behind a
// single "available on request" line.
//
// contact@sagitta.systems is the address the site already publishes. No press
// alias exists, so none is invented.

const VERIFIED_ON = "2026-07-29";

function verified(source: string, note?: string): Verification {
  return { status: "verified", source, lastVerifiedAt: VERIFIED_ON, note };
}

export const pressContact = "contact@sagitta.systems";

/**
 * Resource categories that are not yet publishable. Tracked here so the audit
 * and the "available on request" line stay in sync with one list.
 */
export const pressResourcesOnRequest = [
  "Company fact sheet (entity details, founding date, headcount, location)",
  "Approved photography",
  "Per-system one-sheets",
  "Formal brand guidelines",
  "Press-kit download package",
];

export const pressSections: PressSection[] = [
  {
    id: "descriptions",
    title: "Approved company descriptions",
    description: "Language cleared for use in articles and listings.",
    resources: [
      {
        id: "identity-statement",
        title: "How to describe Sagitta Systems",
        // The canonical dual view, shared with /about and /systems rather than
        // restated here. A journalist quoting the approved language and a
        // reader on the site get the same two sentences, which is the whole
        // point of an approved description.
        //
        // This record previously ran the pre-ecosystem identity paragraph —
        // "the development identity behind Sagitta's continuity, allocation,
        // and capital infrastructure … operates within Sagitta Labs". Sagitta
        // Labs is not dropped from the press room: it stays in the naming and
        // attribution record below, where the institutional relationship
        // belongs, and outside the ecosystem hierarchy.
        description: ecosystemThesis.dualView,
        links: [{ label: "How the names relate", href: "/about#identity" }],
        // Re-verified on its own date rather than the file's sweep date: this
        // description changed after that sweep, and carrying the older date
        // would claim the new language had been checked when it had not.
        verification: {
          status: "verified",
          source:
            "Owner-supplied canonical dual-view language; the three-foundation claim is sourced on the system records",
          lastVerifiedAt: "2026-08-03",
        },
        publicationState: "published",
        visibility: "public",
      },
      {
        id: "short-description",
        title: "Short description",
        description:
          "Sagitta Systems builds a network of systems for continuity, allocation, and capital infrastructure — protecting protocols through control failure, governing where capital goes, and settling it.",
        links: [],
        verification: verified("This site; consistent with sagittalabs.com positioning"),
        publicationState: "published",
        visibility: "public",
      },
      {
        id: "extended-description",
        title: "Extended description",
        description:
          "Sagitta Systems builds eight systems across three families, structured as three core foundations with four services attached to them. Continuity and Defense is built on the Sagitta Continuity Engine, which models catastrophic protocol failure and emits auditable decision records; attached to it are Sagitta Defense, which delivers that intelligence as a fixed-scope review, and Sagitta Radar, which monitors the oracle, bridge, and liquidity-pool infrastructure protocols depend on. Allocation and Agent Intelligence is built on the Autonomous Allocation Agent, which produces policy-governed allocation decisions for institutions; attached to it is Selun, which turns that intelligence into a guided plan for individuals and, through its x402 surface, into pay-per-call endpoints for other agents. Capital Infrastructure is built on Sagitta Protocol, deployed at v0.1 on Moonbeam's Moonbase Alpha Testnet and on Arc Testnet; attached to it is Sagitta Banking, a control layer between core banking and programmable USDC settlement, in development with design partners. Sagitta Wallet is the eighth system and is at concept stage, published as an interactive demo on sample data. Operating products run on their own subdomains; sagitta.systems is the public record of the network.",
        links: [{ label: "Systems directory", href: "/systems" }],
        verification: verified(
          "Each claim in this paragraph is sourced on the corresponding system record",
        ),
        publicationState: "published",
        visibility: "public",
      },
      {
        id: "naming",
        title: "Naming and attribution",
        description:
          "Products take their own names with no adjacent attribution: write \"Sagitta Radar\", not \"Radar by Sagitta Labs\" or \"Sagitta Radar by Sagitta Labs\". The institutional relationship — Sagitta Systems as the development identity, operating within Sagitta Labs as the emerging umbrella brand — belongs in context about the organisation, not beside a product name. Sagitta Labs is currently a brand architecture rather than an incorporated entity. AAA may be written as the Autonomous Allocation Agent on first use. Selun x402 is a capability of Selun — a surface of one product, not a separate product line, and not a system. Sagitta Wallet is at concept stage and should not be described as operating. Every Sagitta Protocol deployment is a testnet: write \"Moonbase Alpha Testnet\" and \"Arc Testnet\", and do not describe either as a mainnet launch. Grants is archived and should not be described as a current offering.",
        links: [{ label: "Systems directory", href: "/systems" }],
        verification: verified("Owner confirmation (2026-07-29)"),
        publicationState: "published",
        visibility: "public",
      },
    ],
  },
  {
    id: "leadership",
    title: "Leadership",
    description: "The single public leadership profile for Sagitta Systems.",
    resources: [
      {
        id: "leadership-bios",
        title: "Xavier D. Moore — Founder",
        description:
          "Xavier D. Moore is the sole public leadership profile for Sagitta Systems. A press-length biography, covering role and areas of experience, is owner-confirmed and cleared for use.",
        links: [
          { label: "Read the biography", href: "/about#leadership" },
          { label: "xaviermoore.com", href: "https://xaviermoore.com", external: true },
        ],
        verification: verified(
          "Owner confirmation (2026-07-29) + xaviermoore.com",
          "Press-ready. Names previously published on this site as founder-operators are Sagitta Labs aliases and are not Sagitta Systems leadership.",
        ),
        publicationState: "published",
        visibility: "public",
      },
    ],
  },
  {
    id: "systems",
    title: "System references",
    description: "Where each system lives and what state it is in.",
    resources: [
      {
        id: "systems-directory",
        title: "Systems directory",
        description:
          "Every system with its operating state, the evidence for that state, its audience, and its public destination. The fastest way to check a claim about Sagitta before printing it.",
        links: [
          { label: "Systems directory", href: "/systems" },
          { label: "Operating status", href: "/status" },
        ],
        verification: verified("This site"),
        publicationState: "published",
        visibility: "public",
      },
      {
        id: "documentation-index",
        title: "Documentation index",
        description:
          "Published documentation by system, including the whitepaper, AAA methodology and decision records, and the x402 discovery document.",
        links: [{ label: "Documentation", href: "/documentation" }],
        verification: verified("This site"),
        publicationState: "published",
        visibility: "public",
      },
    ],
  },
  {
    id: "brand-assets",
    title: "Logos and marks",
    description: "Marks currently in use across the network. Reproduce unmodified.",
    resources: [
      {
        id: "sagitta-mark",
        title: "Sagitta Systems mark",
        description: "Primary mark used across the hub, plus the constellation graphic.",
        links: [
          { label: "sagitta.png", href: "/sagitta.png", external: true },
          { label: "sagitta-hero.png", href: "/sagitta-hero.png", external: true },
        ],
        verification: verified("public/ in this repository"),
        publicationState: "published",
        visibility: "public",
      },
      {
        id: "system-marks",
        title: "System marks",
        description:
          "Square product marks in use for AAA, SCE, Defense, Radar, Protocol, and Selun, plus the Sagitta Banking wordmark — a horizontal name lockup rather than a mark.",
        links: [
          {
            label: "wordmark-sagitta-banking.webp",
            href: "/wordmark-sagitta-banking.webp",
            external: true,
          },
          { label: "aaa.png", href: "/aaa.png", external: true },
          { label: "sce.png", href: "/sce.png", external: true },
          { label: "defense.png", href: "/defense.png", external: true },
          { label: "radar.png", href: "/radar.png", external: true },
          { label: "protocol.png", href: "/protocol.png", external: true },
          { label: "selun.svg", href: "/selun.svg", external: true },
        ],
        verification: verified("public/ in this repository"),
        publicationState: "published",
        visibility: "public",
      },
    ],
  },
  {
    id: "architecture",
    title: "Architecture diagrams",
    description: "Diagrams cleared for publication.",
    resources: [
      {
        id: "protocol-architecture",
        title: "Protocol architecture diagram",
        description:
          "Capital architecture and flow across Vault, Treasury, Reserve, Escrow, AAA, and SCE.",
        links: [
          { label: "View diagram", href: "/diagram.png", external: true },
          { label: "Record", href: "/newsroom/protocol-architecture-diagram" },
          { label: "Media library", href: "/media-library" },
        ],
        verification: verified("public/diagram.png in this repository"),
        publicationState: "published",
        visibility: "public",
      },
    ],
  },
  {
    id: "announcements",
    title: "Published announcements",
    description: "Dated record of system launches and network announcements.",
    resources: [
      {
        id: "launch-defense",
        title: "Sagitta Defense began operating — 6 May 2026",
        description:
          "Defense Reviews went live at defense.sagitta.systems at a published flat fee of $3,000.",
        links: [
          { label: "Record", href: "/newsroom/sagitta-defense-now-operating" },
          {
            label: "defense.sagitta.systems",
            href: "https://defense.sagitta.systems",
            external: true,
          },
        ],
        verification: verified("Repository git history (d3f2cd4) + live service page"),
        publicationState: "published",
        visibility: "public",
      },
      {
        id: "launch-hub",
        title: "Sagitta Systems hub published — 4 May 2026",
        description: "sagitta.systems went online as the public directory for the network.",
        links: [{ label: "Record", href: "/newsroom/sagitta-systems-hub-published" }],
        verification: verified("Repository git history (c59c4a2)"),
        publicationState: "published",
        visibility: "public",
      },
      {
        id: "announcement-index",
        title: "Full announcement index",
        description:
          "All published records, filterable by editorial desk and media type. Press releases will appear here under the Press Release media type; none has been issued yet.",
        links: [{ label: "Newsroom", href: "/newsroom" }],
        verification: verified("This site"),
        publicationState: "published",
        visibility: "public",
      },
    ],
  },
  {
    id: "coverage",
    title: "Interviews and coverage",
    description: "External press coverage and recorded interviews.",
    resources: [
      {
        id: "coverage-index",
        title: "No coverage recorded",
        description:
          "Sagitta Systems has no recorded press coverage or interviews to date. Nothing will be listed here that cannot be linked to its source.",
        links: [],
        verification: verified(
          "No coverage found in this repository or on any linked Sagitta property",
          "Stated as an explicit nil return rather than a pending placeholder.",
        ),
        publicationState: "published",
        visibility: "public",
      },
    ],
  },
  {
    id: "press-contact",
    title: "Press contact and interviews",
    description: "Where to reach Sagitta Systems, and how to request an interview.",
    resources: [
      {
        id: "contact-address",
        title: pressContact,
        description:
          "The published contact address for the network. No separate press alias has been established.",
        links: [
          { label: "Email Sagitta Systems", href: `mailto:${pressContact}`, external: true },
        ],
        verification: verified("Published on this site since launch"),
        publicationState: "published",
        visibility: "public",
      },
      {
        id: "usage-guidance",
        title: "Media usage guidance",
        description:
          "Reproduce marks unmodified and attribute material to Sagitta Systems. When citing an operating state, cite the state published on the systems directory rather than inferring one from a live URL — several systems are in development or public test. Cite point-in-time figures with the verification date attached. Prices change; link to the product page rather than quoting a figure that will go stale. Formal brand guidelines have not been issued.",
        links: [{ label: "Systems directory", href: "/systems" }],
        verification: verified("This site"),
        publicationState: "published",
        visibility: "public",
      },
    ],
  },
];

// ─── Official statistics ─────────────────────────────────────────────────────
//
// Every figure carries its metric, scope, source, and last-verified date. All
// are figures published by Sagitta on its own properties; the scope line states
// that where it matters.

export const pressStatistics: PressStatistic[] = [
  {
    // Held internal by the Phase 4 editorial reduction. The system count was
    // being restated on the homepage, About, Press, Roadmap, and Careers as a
    // slogan. The directory is its canonical home, and the press room's
    // extended description still gives a journalist the portfolio structure in
    // prose. The figure stays on the record here so the removal is a decision
    // rather than a deletion.
    id: "systems-count",
    metric: "Systems in the network",
    value: "8",
    scope:
      "Systems across three strategic families, as published on this site: three core foundations, four attached services, and one concept-stage system. Excludes the three supporting capabilities, Selun x402, Grants, and Rebalancing.",
    source: { label: "Systems directory", href: "/systems" },
    verification: verified(
      "This site",
      "Corrected from 10 to 8 by the 31 July 2026 system-model revision: Selun x402 became a capability of Selun and Treasury Decision Desk was removed as not a Sagitta product. Withheld from public press figures by the Phase 4 reduction: /systems owns the count.",
    ),
    publicationState: "published",
    visibility: "internal",
  },
  {
    id: "defense-review-fee",
    metric: "Starter Defense Review fee",
    value: "$3,000",
    scope: "Flat fee for a one-time Starter Defense Review, as published on the service page.",
    source: {
      label: "defense.sagitta.systems",
      href: "https://defense.sagitta.systems",
      external: true,
    },
    verification: verified("https://defense.sagitta.systems"),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "defense-review-delivery",
    metric: "Defense Review delivery time",
    value: "7 days (typical)",
    scope:
      "Typical elapsed time from initial submission to final report, as published on the service page.",
    source: {
      label: "defense.sagitta.systems",
      href: "https://defense.sagitta.systems",
      external: true,
    },
    verification: verified("https://defense.sagitta.systems"),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "sce-incidents-tracked",
    metric: "Critical incidents tracked by SCE",
    value: "801",
    scope:
      "Incidents in the Sagitta Continuity Engine's tracked set, as published on the Defense service page. A Sagitta-published figure, not an independently audited one.",
    source: {
      label: "defense.sagitta.systems",
      href: "https://defense.sagitta.systems",
      external: true,
    },
    verification: verified("https://defense.sagitta.systems"),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "radar-monitored-value",
    metric: "Aggregate exposure monitored by Sagitta Radar",
    value: "$328.393M",
    scope:
      "A dated snapshot: $328.393M in aggregate exposure monitored at verification on 29 July 2026. Live coverage changes continuously — this figure is a point-in-time reading, not a standing claim. Cite it with the date attached, or re-read it from the product page.",
    source: {
      label: "radar.sagitta.systems",
      href: "https://radar.sagitta.systems",
      external: true,
    },
    verification: verified(
      "https://radar.sagitta.systems",
      "Point-in-time snapshot. Must always be published with its verification date; never as a current figure.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "radar-plans",
    metric: "Sagitta Radar subscription plans",
    value: "4 plans",
    scope:
      "Watch, Intel, Signal, and Desk. Prices change and are published on the product page rather than here, so this record does not go stale.",
    source: {
      label: "radar.sagitta.systems",
      href: "https://radar.sagitta.systems",
      external: true,
    },
    verification: verified("https://radar.sagitta.systems"),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "aaa-tiers",
    metric: "AAA access tiers",
    value: "4 tiers",
    scope:
      "Observer Access (free), Sandbox Authority, Production Authority, and Doctrine Authority (enterprise). Current prices are published on the AAA pricing page rather than here.",
    source: {
      label: "aaa.sagitta.systems/pricing",
      href: "https://aaa.sagitta.systems/pricing",
      external: true,
    },
    verification: verified("https://aaa.sagitta.systems/pricing"),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "x402-endpoints",
    metric: "Agent-payable endpoints advertised over x402",
    value: "9",
    scope:
      "Endpoints advertised in the Selun x402 discovery document. Counts advertised resources, not call volume. Per-call prices are set in the document itself and change — read them there.",
    source: {
      label: "selun.sagitta.systems/.well-known/x402",
      href: "https://selun.sagitta.systems/.well-known/x402",
      external: true,
    },
    verification: verified("https://selun.sagitta.systems/.well-known/x402"),
    publicationState: "published",
    visibility: "public",
  },
];

export const publicPressStatistics = pressStatistics.filter(
  (s) => s.visibility === "public" && s.publicationState === "published",
);

export function publicPressResources(section: PressSection): PressResource[] {
  return section.resources.filter(
    (r) => r.visibility === "public" && r.publicationState === "published",
  );
}

export const publicPressSections = pressSections.filter(
  (section) => publicPressResources(section).length > 0,
);
