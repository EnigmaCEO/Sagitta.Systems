import type { Link } from "./types";
import { publicSystems } from "./systems";

export const site = {
  name: "Sagitta Systems",
  tagline: "The Sagitta Systems Network",
  positioning:
    "Systems, intelligence, and infrastructure for continuity, allocation, and capital operations.",
  url: "https://www.sagitta.systems",
  description:
    "Sagitta Systems operates a network of systems for continuity, allocation, and capital infrastructure — protecting protocols through control failure, governing where capital goes, and settling it.",
  /**
   * The one-paragraph statement of what Sagitta Systems is and why it exists.
   *
   * Rewritten to state purpose rather than only position. The previous version
   * said Sagitta Systems was "the development identity behind Sagitta's
   * continuity, allocation, and capital infrastructure" and then named Sagitta
   * Labs — true on both counts, and it left the network reading as three
   * co-equal product lines that happened to emerge together. The purpose is
   * the Protocol ecosystem, and it is now said here first.
   *
   * Sagitta Labs is deliberately not in this sentence. The umbrella brand sits
   * outside the ecosystem hierarchy and is stated where it belongs — the
   * identity descent on /about, the footer, and the legal notices.
   */
  identity:
    "Sagitta Systems is the development network through which the Sagitta Protocol ecosystem's intelligence, continuity, and capital capabilities are built, tested, and commercialized. Each system stands on its own in the market. Together, they form the operating architecture of the ecosystem.",
  umbrella: "Sagitta Labs",
  contactEmail: "contact@sagitta.systems",
  careersEmail: "careers@sagitta.systems",
  socialImage: "/og/home.png",
  mark: "/sagitta.png",
} as const;

/**
 * The ecosystem thesis, written once and rendered wherever the site makes the
 * claim. Held here rather than in each template because it is the site's
 * central claim, and near-identical hand-written versions of a central claim
 * drift. The content check asserts each surface renders these strings rather
 * than a paraphrase of them, and names the surfaces it expects.
 *
 * `dualView` is the canonical one. Sagitta is two true structures at once —
 * three co-equal architectural foundations, and one ecosystem those
 * foundations exist to serve — and stating either alone misdescribes the
 * network. Stating only the architecture reads as a portfolio that happened to
 * emerge together; stating only the purpose demotes AAA and the Continuity
 * Engine to accessories of Sagitta Protocol, which they are not. The two
 * sentences hold both, in that order, and no surface may reconcile them in its
 * own words.
 */
export const ecosystemThesis = {
  /**
   * The canonical dual view. Sentence one is the architecture, sentence two is
   * the purpose. Rendered verbatim on /about, /systems, and the press room's
   * approved identity statement — a journalist quoting Sagitta and a reader on
   * the site get the same two sentences.
   */
  dualView:
    "AAA, SCE, and Sagitta Protocol are three core architectural foundations. Across them, Sagitta Systems builds, tests, and commercializes the intelligence, continuity, and financial capabilities required by the Sagitta Protocol ecosystem.",
  /** The single line. Short enough for the promotional page to carry it. */
  short:
    "Each system stands on its own in the market. Together, they form the operating architecture of the Sagitta Protocol ecosystem.",
  /** Why that is not a retrospective story told about unrelated products. */
  purpose:
    "Sagitta Systems is not a collection of products that happened to emerge together. It is the development network through which the Protocol's necessary intelligence, continuity, and capital capabilities are being built, tested, and commercialized.",
} as const;

/**
 * How the names relate. Published so a reader — or a journalist — does not have
 * to infer the relationship between the umbrella brand, the development
 * identity, and the systems themselves.
 */
export const identityHierarchy: { name: string; role: string; note: string }[] = [
  {
    name: "Sagitta Labs",
    role: "Umbrella brand",
    note: "The future corporate umbrella for the broader Sagitta network. Currently an umbrella brand rather than an incorporated entity.",
  },
  {
    name: "Sagitta Systems",
    role: "Development identity",
    note: "Responsible for building and documenting the systems. This site is its public record.",
  },
  {
    name: "The systems",
    role: "What gets built",
    note: "Three core foundations — the Autonomous Allocation Agent, the Sagitta Continuity Engine, and Sagitta Protocol — with Selun, Sagitta Defense, Sagitta Radar, and Sagitta Banking attached to them as services, and Sagitta Wallet at concept stage.",
  },
];

/** Primary navigation. */
export const primaryNav: Link[] = [
  { label: "Systems", href: "/systems" },
  { label: "Newsroom", href: "/newsroom" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Careers", href: "/careers" },
  { label: "About", href: "/about" },
];

/** Secondary utility layer, shown in the footer and the mobile drawer. */
export const utilityNav: Link[] = [
  { label: "Press Room", href: "/press" },
  { label: "Media Library", href: "/media-library" },
  { label: "Documentation", href: "/documentation" },
  { label: "Contact", href: "/contact" },
  { label: "Legal", href: "/legal" },
  { label: "Status", href: "/status" },
];

/**
 * Direct links to Sagitta destinations that resolve.
 *
 * Phase 1 generated this from every `operatingUrl` in the directory, which
 * published three hosts that do not resolve (treasury, grants, rebalancing).
 * Those URLs have been removed from the content layer, so this list is now
 * only ever as long as the set of real destinations.
 */
export const networkLinks: Link[] = publicSystems
  .filter((s) => s.operatingUrl && s.subdomain && !s.subdomain.includes("/"))
  .map((s) => ({ label: s.subdomain as string, href: s.operatingUrl as string, external: true }));

/**
 * Network-level documents and external Sagitta properties. Preserved from the
 * previous homepage "Proof of work" section and reused across /about,
 * /documentation and /press.
 */
export const proofResources: (Link & { summary: string })[] = [
  {
    label: "Whitepaper",
    href: "https://sagitta-protocol.gitbook.io/sagitta-whitepaper",
    external: true,
    summary:
      "The Sagitta Protocol architecture, doctrine, and capital-flow design, published in full.",
  },
  {
    label: "Protocol architecture",
    href: "/diagram.webp",
    external: true,
    summary:
      "The capital architecture and flow behind Vault, Treasury, Reserve, Escrow, AAA, and SCE.",
  },
  {
    label: "AAA methodology",
    href: "https://aaa.sagitta.systems/methodology",
    external: true,
    summary: "How allocation decisions are produced, constrained, and explained.",
  },
  {
    label: "x402 discovery document",
    href: "https://selun.sagitta.systems/.well-known/x402",
    external: true,
    summary:
      "The machine-readable index of Sagitta's agent-payable allocation and continuity endpoints.",
  },
  {
    label: "Security",
    href: "https://www.sagittalabs.com/security",
    external: true,
    summary: "Sagitta Labs security posture and security-related materials.",
  },
  {
    label: "Use cases",
    href: "https://www.sagittalabs.com/use-cases",
    external: true,
    summary:
      "Where Sagitta systems apply across treasury, protocol defense, continuity, and capital operations.",
  },
];

/**
 * Audience router, preserved from the previous homepage and repointed into the
 * new architecture.
 */
export const audienceRoutes: { label: string; copy: string; tags: string[]; href: string }[] = [
  {
    label: "I run a protocol",
    copy: "Map your authority surface before it fails, and watch the infrastructure you depend on.",
    tags: ["Sagitta Defense", "Sagitta Continuity Engine", "Sagitta Radar"],
    href: "/systems#continuity-defense",
  },
  {
    label: "I manage treasury",
    copy: "Allocation decisions that survive review, with the reasoning attached.",
    tags: ["Autonomous Allocation Agent", "Sagitta Protocol"],
    href: "/systems#allocation-agent-intelligence",
  },
  {
    label: "I want portfolio help",
    copy: "A guided allocation plan built on the same intelligence institutions use.",
    tags: ["Selun", "Rebalancing", "Sagitta Wallet"],
    href: "/systems/selun",
  },
  {
    label: "I am building an agent",
    copy: "Buy a single allocation or continuity decision over x402, with no human account.",
    tags: ["Selun", "x402", "Autonomous Allocation Agent"],
    href: "/systems/selun",
  },
  {
    label: "I run a bank or fintech",
    copy: "Connect deposit products to programmable settlement under enforced policy.",
    tags: ["Sagitta Banking", "Sagitta Protocol"],
    href: "/systems/sagitta-banking",
  },
  {
    label: "I build or operate systems",
    copy: "Open roles and contributor workstreams across the network.",
    tags: ["Careers", "Contributor Network"],
    href: "/careers",
  },
];
