export type ItemStatus = "Live" | "Beta / Waitlist" | "Roadmap";
export type ItemGroup = "product" | "service";

export interface EcosystemItem {
  name: string;
  shortName: string;
  description: string;
  status: ItemStatus;
  group: ItemGroup;
  subdomain: string;
  href: string;
  cta: string;
  logo?: string;
}

export const ecosystemItems: EcosystemItem[] = [
  // Products
  {
    name: "Autonomous Allocation Agent",
    shortName: "AAA",
    description:
      "Policy-driven allocation intelligence for treasury operators, funds, and protocols.",
    status: "Live",
    group: "product",
    subdomain: "aaa.sagitta.systems",
    href: "https://aaa.sagitta.systems",
    cta: "Launch",
    logo: "/aaa.png",
  },
  {
    name: "Sagitta Continuity Engine",
    shortName: "SCE",
    description:
      "Survival and defense intelligence for DeFi systems, DAOs, protocol teams, and treasury projects.",
    status: "Live",
    group: "product",
    subdomain: "sce.sagitta.systems",
    href: "https://sce.sagitta.systems",
    cta: "Launch",
    logo: "/sce.png",
  },
  {
    name: "Selun",
    shortName: "Selun",
    description:
      "A simple portfolio allocation agent using the V4 Quant Allocator and current market conditions.",
    status: "Live",
    group: "product",
    subdomain: "selun.sagitta.systems",
    href: "https://selun.sagitta.systems",
    cta: "Launch",
    logo: "/selun.svg",
  },
  {
    name: "Sagitta Protocol",
    shortName: "Protocol",
    description:
      "Trustless capital management, reserve logic, and continuity-governed finance at the protocol layer.",
    status: "Beta / Waitlist",
    group: "product",
    subdomain: "protocol.sagitta.systems",
    href: "https://protocol.sagitta.systems",
    cta: "Explore testnet",
    logo: "/protocol.png",
  },
  {
    name: "Sagitta Wallet",
    shortName: "Wallet",
    description:
      "The wallet layer for agent-native portfolio execution and protocol interaction.",
    status: "Roadmap",
    group: "product",
    subdomain: "wallet.sagitta.systems",
    href: "https://wallet.sagitta.systems",
    cta: "Track roadmap",
  },
  // Services
  {
    name: "Treasury Decision Desk",
    shortName: "Treasury",
    description:
      "Treasury decision support powered by AAA intelligence for operators and protocol teams.",
    status: "Beta / Waitlist",
    group: "service",
    subdomain: "treasury.sagitta.systems",
    href: "https://treasury.sagitta.systems",
    cta: "Request access",
  },
  {
    name: "Defense",
    shortName: "Defense",
    description:
      "Protocol survival reviews, authority-surface mapping, and control verification before the emergency.",
    status: "Beta / Waitlist",
    group: "service",
    subdomain: "defense.sagitta.systems",
    href: "https://defense.sagitta.systems",
    cta: "Request access",
  },
  {
    name: "Grants",
    shortName: "Grants",
    description:
      "Grant strategy, application support, ecosystem positioning, and funding readiness.",
    status: "Beta / Waitlist",
    group: "service",
    subdomain: "grants.sagitta.systems",
    href: "https://grants.sagitta.systems",
    cta: "Request access",
  },
  {
    name: "Rebalancing",
    shortName: "Rebalance",
    description:
      "Enter a wallet or portfolio and receive a rebalance recommendation, powered by Selun and AAA intelligence.",
    status: "Roadmap",
    group: "service",
    subdomain: "rebalance.sagitta.systems",
    href: "https://rebalancing.sagitta.systems",
    cta: "Track roadmap",
  },
];

export const productItems = ecosystemItems.filter((d) => d.group === "product");
export const serviceItems = ecosystemItems.filter((d) => d.group === "service");

// Legacy aliases
export const doors = ecosystemItems;
export const productDoors = productItems;
export const serviceDoors = serviceItems;
export type Door = EcosystemItem;
export type DoorStatus = ItemStatus;
export type DoorGroup = ItemGroup;

export interface RoleDetail {
  title: string;
  description: string;
}

export interface CareerArea {
  product: string;
  shortKey: string;
  roles: RoleDetail[];
}

export const careerAreas: CareerArea[] = [
  {
    product: "SCE — Sagitta Continuity Engine",
    shortKey: "sce",
    roles: [
      {
        title: "Sales Engine Operator — Commission-Based (2 Openings)",
        description:
          "Use Sagitta's Sales Engine to work qualified leads, contact protocols, personalize outreach, book calls, and help close paid SCE Defense Reviews. Compensation begins at $1,000 per closed Defense Review.",
      },
      {
        title: "Web3 Security Researcher — Contract / Contributor",
        description:
          "Research protocol failures, DeFi incidents, exploit patterns, bridge failures, oracle issues, admin-key risks, governance failures, and treasury-control weaknesses.",
      },
      {
        title: "Protocol Defense Analyst — Contract / Contributor",
        description:
          "Review client protocols for admin surfaces, upgrade authority, treasury authority, role concentration, governance exposure, missing controls, and continuity readiness.",
      },
      {
        title: "Threat Intelligence Researcher — Contract / Contributor",
        description:
          "Track public security sources, vulnerability feeds, Web3 incident reports, exploit disclosures, postmortems, and emerging protocol-risk patterns.",
      },
      {
        title: "Defense Report Specialist — Contract / Contributor",
        description:
          "Turn SCE findings into polished client reports including executive summaries, severity explanations, evidence sections, and control recommendations.",
      },
      {
        title: "Smart Contract Security Reviewer — On-Call Contractor",
        description:
          "Support deeper contract-level review. Focus areas include ownership patterns, proxy upgrades, access control, timelocks, pause authority, and integration risks.",
      },
      {
        title: "Backend / Platform Engineer — Future / Contract",
        description:
          "Support SCE platform development across ingestion pipelines, project mapping, admin-surface scanning, dashboards, and production hardening.",
      },
    ],
  },
  {
    product: "AAA — Autonomous Allocation Agent",
    shortKey: "aaa",
    roles: [
      {
        title: "Allocation Systems Researcher",
        description: "Closed",
      },
      {
        title: "Backend / Platform Engineer",
        description: "Closed",
      },
      {
        title: "Technical Documentation Specialist",
        description: "Closed",
      },
    ],
  },
  {
    product: "Selun",
    shortKey: "selun",
    roles: [
      {
        title: "Referral Growth Operator",
        description: "Closed",
      },
      {
        title: "Crypto Portfolio Researcher",
        description: "Closed",
      },
      {
        title: "Frontend / UX Contributor",
        description: "Closed",
      },
    ],
  },
  {
    product: "Sagitta Protocol",
    shortKey: "protocol",
    roles: [],
  },
  {
    product: "Sagitta Wallet",
    shortKey: "wallet",
    roles: [],
  },
];
