import type { DeskId, EditorialDesk } from "./types";

// Editorial desks of the Sagitta newsroom.
//
// `state` is derived from reality, not intent: a desk is `active` once it has a
// published record and `upcoming` until then. An upcoming desk is presented as
// an upcoming desk. It never generates a story card.

export const desks: EditorialDesk[] = [
  {
    id: "sce-wire",
    name: "SCE Wire",
    summary:
      "Continuity Engine dispatches: incident analysis, threat families, and doctrine updates.",
    systemSlug: "sagitta-continuity-engine",
    cadence: "Weekly",
    format: "Dispatch",
    state: "active",
  },
  {
    id: "policy-notes",
    name: "AAA / Policy Notes",
    summary:
      "Research on allocation policy, decision theory, system architecture, and regime modelling.",
    systemSlug: "aaa",
    cadence: "Periodic",
    format: "Research note",
    state: "active",
  },
  {
    id: "allocation-read",
    name: "Selun / Allocation Read",
    summary: "Allocation reads, agent surfaces, and rebalance commentary from Selun.",
    systemSlug: "selun",
    cadence: "Weekly",
    format: "Read",
    state: "active",
  },
  {
    id: "radar-report",
    name: "Radar Report",
    summary: "Infrastructure monitoring reports across oracles, bridges, and liquidity pools.",
    systemSlug: "sagitta-radar",
    cadence: "Daily brief, weekly report",
    format: "Report",
    state: "active",
  },
  {
    id: "defense-review",
    name: "Defense Review",
    summary:
      "Defense review findings, control verification, and authority-surface analysis.",
    systemSlug: "sagitta-defense",
    cadence: "Per engagement",
    format: "Review",
    state: "active",
  },
  {
    id: "sagitta-podcast",
    name: "Sagitta Podcast",
    summary: "Recorded conversations on continuity, allocation, and capital infrastructure.",
    cadence: "Planned",
    format: "Audio",
    state: "upcoming",
  },
  {
    id: "words-from-the-architect",
    name: "Words from the Architect",
    summary: "Design intent and architecture reasoning from the people building the network.",
    cadence: "Periodic",
    format: "Dispatch",
    state: "active",
  },
  {
    id: "continuity-desk",
    name: "Continuity Desk",
    summary: "Network-wide records: releases, documents, statements, and system updates.",
    cadence: "As published",
    format: "Record",
    state: "active",
  },
];

export function getDesk(id: DeskId): EditorialDesk | undefined {
  return desks.find((d) => d.id === id);
}

export function getDeskName(id: DeskId): string {
  return getDesk(id)?.name ?? id;
}

export const activeDesks = desks.filter((d) => d.state === "active");
export const upcomingDesks = desks.filter((d) => d.state === "upcoming");
