import type { CareerRecord, CareerStatus, Verification } from "./types";

// Careers records.
//
// All 13 roles listed on the previous sagitta.systems homepage are preserved
// here. Titles and role descriptions are carried over verbatim; the description
// becomes `immediateResponsibility`.
//
// Classification rule applied in this pass:
//   Open       — a role with published terms that is actively being filled.
//                Only the Sales Engine Operator meets that bar: it is the only
//                role for which compensation was ever published.
//   Contributor— the contract / contributor and on-call engagements, which the
//                previous site showed as accepting applications.
//   Future     — roles the previous site itself labelled "Future / Contract".
//   Archived   — roles whose previous description was literally "Closed".
//
// Fields the old listing never published (first deliverable, required
// experience, compensation for most roles) are marked "Not yet published"
// rather than invented, and are tracked in CONTENT_AUDIT.md.
//
// The two "future workstream" records invented during Phase 1 for Protocol and
// Wallet are NOT real listings. They are retained as internal records and are
// excluded from every public view.

const CONTACT = "careers@sagitta.systems";
const APPLICATION_PROCESS =
  "Email careers@sagitta.systems with the role title in the subject line. There is no application backend on this site yet.";
const CLOSED_PROCESS = "Closed — no longer accepting applications.";
const LISTED = "2026-05-04";
const NOT_PUBLISHED = "Not yet published.";
const VERIFIED_ON = "2026-07-29";

const fromLegacyListing: Verification = {
  status: "verified",
  source: "The previous sagitta.systems careers listing (Phase 1 `src/data/content.ts`, since removed — see commit 66e5700)",
  lastVerifiedAt: VERIFIED_ON,
  note: "Title and responsibility carried over verbatim. Published date is the commit that posted the listing (66e5700, 2026-05-04). The Phase 1 content model this was read from was deleted once the last component reading it was removed; the listing itself remains recoverable at that commit.",
};

export const careerDivisions: { status: CareerStatus; title: string; description: string }[] = [
  {
    status: "Open",
    title: "Open Now",
    description: "Roles with published terms, actively being filled.",
  },
  {
    status: "Contributor",
    title: "Contributor Network",
    description:
      "Contract and on-call engagements. Applications accepted on a rolling basis; terms are agreed per engagement.",
  },
  {
    status: "Future",
    title: "Future Workstreams",
    description:
      "Work the network has published as expected, but is not filling yet.",
  },
  {
    status: "Archived",
    title: "Archived Roles",
    description: "Previously listed roles that are no longer accepting applications.",
  },
];

type CareerSeed = Omit<CareerRecord, "verification" | "publicationState" | "visibility"> &
  Partial<Pick<CareerRecord, "verification" | "publicationState" | "visibility">>;

function role(seed: CareerSeed): CareerRecord {
  return {
    verification: fromLegacyListing,
    publicationState: seed.status === "Archived" ? "archived" : "published",
    visibility: "public",
    ...seed,
  };
}

export const careers: CareerRecord[] = [
  // ── Open Now ───────────────────────────────────────────────────────────────
  role({
    slug: "sales-engine-operator",
    title: "Sales Engine Operator — Commission-Based (2 Openings)",
    systemSlug: "sagitta-defense",
    engagement: "Commission-based",
    status: "Open",
    compensation: "Begins at $1,000 per closed Defense Review.",
    location: "Remote",
    immediateResponsibility:
      "Use Sagitta's Sales Engine to work qualified leads, contact protocols, personalize outreach, book calls, and help close paid SCE Defense Reviews.",
    firstDeliverable: NOT_PUBLISHED,
    requiredExperience: [],
    applicationProcess: APPLICATION_PROCESS,
    hiringContact: CONTACT,
    publishedAt: LISTED,
    updatedAt: null,
    verification: {
      status: "verified",
      source:
        "The Phase 1 careers listing (`src/data/content.ts`, since removed — see commit 66e5700) + https://defense.sagitta.systems (published $3,000 Starter Defense Review)",
      lastVerifiedAt: VERIFIED_ON,
      note: "The only role with published compensation, and the product it sells is publicly priced — so the commission is checkable. This is the sole role classified Open.",
    },
  }),

  // ── Contributor Network ────────────────────────────────────────────────────
  role({
    slug: "web3-security-researcher",
    title: "Web3 Security Researcher — Contract / Contributor",
    systemSlug: "sagitta-continuity-engine",
    engagement: "Contract / Contributor",
    status: "Contributor",
    compensation: NOT_PUBLISHED,
    location: "Remote",
    immediateResponsibility:
      "Research protocol failures, DeFi incidents, exploit patterns, bridge failures, oracle issues, admin-key risks, governance failures, and treasury-control weaknesses.",
    firstDeliverable: NOT_PUBLISHED,
    requiredExperience: [],
    applicationProcess: APPLICATION_PROCESS,
    hiringContact: CONTACT,
    publishedAt: LISTED,
    updatedAt: null,
  }),
  role({
    slug: "protocol-defense-analyst",
    title: "Protocol Defense Analyst — Contract / Contributor",
    systemSlug: "sagitta-defense",
    engagement: "Contract / Contributor",
    status: "Contributor",
    compensation: NOT_PUBLISHED,
    location: "Remote",
    immediateResponsibility:
      "Review client protocols for admin surfaces, upgrade authority, treasury authority, role concentration, governance exposure, missing controls, and continuity readiness.",
    firstDeliverable: NOT_PUBLISHED,
    requiredExperience: [],
    applicationProcess: APPLICATION_PROCESS,
    hiringContact: CONTACT,
    publishedAt: LISTED,
    updatedAt: null,
  }),
  role({
    slug: "threat-intelligence-researcher",
    title: "Threat Intelligence Researcher — Contract / Contributor",
    systemSlug: "sagitta-continuity-engine",
    engagement: "Contract / Contributor",
    status: "Contributor",
    compensation: NOT_PUBLISHED,
    location: "Remote",
    immediateResponsibility:
      "Track public security sources, vulnerability feeds, Web3 incident reports, exploit disclosures, postmortems, and emerging protocol-risk patterns.",
    firstDeliverable: NOT_PUBLISHED,
    requiredExperience: [],
    applicationProcess: APPLICATION_PROCESS,
    hiringContact: CONTACT,
    publishedAt: LISTED,
    updatedAt: null,
  }),
  role({
    slug: "defense-report-specialist",
    title: "Defense Report Specialist — Contract / Contributor",
    systemSlug: "sagitta-defense",
    engagement: "Contract / Contributor",
    status: "Contributor",
    compensation: NOT_PUBLISHED,
    location: "Remote",
    immediateResponsibility:
      "Turn SCE findings into polished client reports including executive summaries, severity explanations, evidence sections, and control recommendations.",
    firstDeliverable: NOT_PUBLISHED,
    requiredExperience: [],
    applicationProcess: APPLICATION_PROCESS,
    hiringContact: CONTACT,
    publishedAt: LISTED,
    updatedAt: null,
  }),
  role({
    slug: "smart-contract-security-reviewer",
    title: "Smart Contract Security Reviewer — On-Call Contractor",
    systemSlug: "sagitta-continuity-engine",
    engagement: "On-call contractor",
    status: "Contributor",
    compensation: NOT_PUBLISHED,
    location: "Remote",
    immediateResponsibility:
      "Support deeper contract-level review. Focus areas include ownership patterns, proxy upgrades, access control, timelocks, pause authority, and integration risks.",
    firstDeliverable: NOT_PUBLISHED,
    requiredExperience: [],
    applicationProcess: APPLICATION_PROCESS,
    hiringContact: CONTACT,
    publishedAt: LISTED,
    updatedAt: null,
  }),

  // ── Future Workstreams ─────────────────────────────────────────────────────
  role({
    slug: "sce-backend-platform-engineer",
    title: "Backend / Platform Engineer — Future / Contract",
    systemSlug: "sagitta-continuity-engine",
    engagement: "Future / Contract",
    status: "Future",
    compensation: NOT_PUBLISHED,
    location: "Remote",
    immediateResponsibility:
      "Support SCE platform development across ingestion pipelines, project mapping, admin-surface scanning, dashboards, and production hardening.",
    firstDeliverable: NOT_PUBLISHED,
    requiredExperience: [],
    applicationProcess: APPLICATION_PROCESS,
    hiringContact: CONTACT,
    publishedAt: LISTED,
    updatedAt: null,
  }),

  // ── Archived ───────────────────────────────────────────────────────────────
  ...(
    [
      ["allocation-systems-researcher", "Allocation Systems Researcher", "aaa"],
      ["aaa-backend-platform-engineer", "Backend / Platform Engineer", "aaa"],
      ["technical-documentation-specialist", "Technical Documentation Specialist", "aaa"],
      ["referral-growth-operator", "Referral Growth Operator", "selun"],
      ["crypto-portfolio-researcher", "Crypto Portfolio Researcher", "selun"],
      ["frontend-ux-contributor", "Frontend / UX Contributor", "selun"],
    ] as const
  ).map(([slug, title, systemSlug]) =>
    role({
      slug,
      title,
      systemSlug,
      engagement: "Contract / Contributor",
      status: "Archived",
      compensation: NOT_PUBLISHED,
      location: "Remote",
      immediateResponsibility:
        "Closed. Preserved from the previous careers listing, which showed this role as closed.",
      firstDeliverable: NOT_PUBLISHED,
      requiredExperience: [],
      applicationProcess: CLOSED_PROCESS,
      hiringContact: CONTACT,
      publishedAt: LISTED,
      updatedAt: null,
    }),
  ),

  // ── Internal — not real listings, excluded from every public view ──────────
  role({
    slug: "sagitta-protocol-workstream",
    title: "Sagitta Protocol — future workstream",
    systemSlug: "sagitta-protocol",
    engagement: "Future workstream",
    status: "Future",
    compensation: NOT_PUBLISHED,
    location: "Remote",
    immediateResponsibility: "No roles published for this system.",
    firstDeliverable: NOT_PUBLISHED,
    requiredExperience: [],
    applicationProcess: APPLICATION_PROCESS,
    hiringContact: CONTACT,
    publishedAt: null,
    updatedAt: null,
    publicationState: "draft",
    visibility: "internal",
    verification: {
      status: "pending",
      source: "Created during Phase 1 to fill an empty division",
      lastVerifiedAt: VERIFIED_ON,
      note: "Not a real listing. Withdrawn from public display. Publish only if a genuine Protocol workstream opens.",
    },
  }),
  role({
    slug: "sagitta-wallet-workstream",
    title: "Sagitta Wallet — future workstream",
    systemSlug: "sagitta-wallet",
    engagement: "Future workstream",
    status: "Future",
    compensation: NOT_PUBLISHED,
    location: "Remote",
    immediateResponsibility: "No roles published for this system.",
    firstDeliverable: NOT_PUBLISHED,
    requiredExperience: [],
    applicationProcess: APPLICATION_PROCESS,
    hiringContact: CONTACT,
    publishedAt: null,
    updatedAt: null,
    publicationState: "draft",
    visibility: "internal",
    verification: {
      status: "pending",
      source: "Created during Phase 1 to fill an empty division",
      lastVerifiedAt: VERIFIED_ON,
      note: "Not a real listing. Withdrawn from public display. Publish only if a genuine Wallet workstream opens.",
    },
  }),
];

// ─── Queries ─────────────────────────────────────────────────────────────────

/** Every role the public may see, including archived ones (kept on the record). */
export const publicCareers = careers.filter(
  (c) => c.visibility === "public" && (c.publicationState === "published" || c.publicationState === "archived"),
);

/** Roles that are genuinely available. Drives homepage features and counts. */
export const openCareers = publicCareers.filter((c) => c.status === "Open");

export function getCareer(slug: string): CareerRecord | undefined {
  return careers.find((c) => c.slug === slug);
}

export function careersByStatus(status: CareerStatus): CareerRecord[] {
  return publicCareers.filter((c) => c.status === status);
}

export const careersContact = CONTACT;
