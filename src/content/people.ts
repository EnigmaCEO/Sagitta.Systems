import type { Person } from "./types";

// Leadership.
//
// Sagitta Systems has one public leadership profile: Xavier D. Moore.
//
// The two names previously published on this site — Orion Gray and Alexander
// Roth — are Sagitta Labs aliases, not Sagitta Systems leadership. They are
// recorded at the bottom of this file for provenance only. They are deliberately
// not part of the `people` collection, so they cannot render anywhere in this
// hub, appear in press biographies, or reach page metadata. If a Sagitta Labs
// page ever needs them, it should take them from there explicitly.

const CONFIRMED_ON = "2026-07-29";

export const people: Person[] = [
  {
    slug: "xavier-moore",
    name: "Xavier D. Moore",
    role: "Founder — Sagitta Systems",
    bio: "Building digital systems since 1997, across games, artificial intelligence, financial infrastructure, and digital ownership. Sagitta is the continuity, allocation, and capital layer of that work.",
    pressBio:
      "Xavier D. Moore is the founder of Sagitta Systems, the development identity behind Sagitta's continuity, allocation, and capital infrastructure. He has been building digital systems since 1997, across games, artificial intelligence, financial infrastructure, and digital ownership, including lead development roles on enterprise systems at FedEx and Fidelity and the founding and operation of Enigma Games. Sagitta applies that method to onchain finance: the Sagitta Continuity Engine and Sagitta Radar for continuity and infrastructure monitoring, the Autonomous Allocation Agent and Selun for policy-governed allocation, and Sagitta Protocol and Sagitta Banking for capital infrastructure.",
    experience: [
      "Systems architecture",
      "Financial infrastructure",
      "Artificial intelligence",
      "Digital ownership",
      "Games and virtual economies",
      "Enterprise engineering",
    ],
    photo: "/xavier.jfif",
    links: [
      { label: "xaviermoore.com", href: "https://xaviermoore.com", external: true },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/xaviermoore", external: true },
    ],
    verification: {
      status: "verified",
      source:
        "Owner confirmation (2026-07-29) + xaviermoore.com + https://www.linkedin.com/in/xaviermoore (resolved 2026-08-02)",
      lastVerifiedAt: "2026-08-02",
      note: "Owner-confirmed and cleared for press use. Biography detail is drawn from xaviermoore.com; no credential, employer, or date beyond what that site publishes is claimed here. The LinkedIn profile was resolved on 2026-08-02 from the byline of the two published founder articles and confirmed against the profile page. It is carried here rather than on the organisation, because it is a person's profile — it therefore reaches `sameAs` through `personLd`, which is the correct entity to attach it to.",
    },
    publicationState: "published",
    visibility: "public",
  },
];

export const publicPeople = people.filter(
  (p) => p.visibility === "public" && p.publicationState === "published",
);

export function getPerson(slug: string): Person | undefined {
  return people.find((p) => p.slug === slug);
}

// ─── Sagitta Labs aliases ────────────────────────────────────────────────────
//
// Provenance record only. These names appeared on the previous sagitta.systems
// homepage as "founder-operators". They belong to Sagitta Labs, the umbrella
// brand, and are not Sagitta Systems leadership. Nothing in this hub reads this
// array, and nothing should: it exists so the removal is inspectable rather
// than silent.

export interface SagittaLabsAlias {
  name: string;
  formerRole: string;
  /** Copy as it was previously published, kept verbatim for the record. */
  previousBio: string;
  note: string;
}

export const sagittaLabsAliases: SagittaLabsAlias[] = [
  {
    name: "Orion Gray",
    formerRole: "Founder-Operator / Security Strategy",
    previousBio:
      "Enterprise cybersecurity, vulnerability governance, cloud security, and high-trust consulting experience informing Sagitta's continuity and defense architecture.",
    note: "Sagitta Labs alias. Removed from Sagitta Systems leadership on 2026-07-29 by owner decision. Not to be published on this hub.",
  },
  {
    name: "Alexander Roth",
    formerRole: "Founder-Operator / Systems Architecture",
    previousBio:
      "Secure software, cloud infrastructure, Web3 systems, AI platforms, and blockchain product experience informing Sagitta's protocol and allocation architecture.",
    note: "Sagitta Labs alias. Removed from Sagitta Systems leadership on 2026-07-29 by owner decision. Not to be published on this hub.",
  },
];
