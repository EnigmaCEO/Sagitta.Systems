// Relationship helpers across the content collections.
//
// Records reference each other by slug; the joins live here so page templates
// stay declarative. Every join filters to published + public records, so a
// draft or internal record cannot reach a reader through a relationship.

import { publicCareers } from "./careers";
import { publishedEntries, sortByDate } from "./newsroom";
import { roadmapForSystem } from "./roadmap";
import { capabilitiesForSystem, getSystem } from "./systems";
import type {
  CapabilityRecord,
  CareerRecord,
  NewsroomEntry,
  RoadmapItem,
  SystemRecord,
} from "./types";

export * from "./types";
export * from "./site";
export * from "./systems";
export * from "./desks";
export * from "./newsroom";
export * from "./careers";
export * from "./roadmap";
export * from "./press";
export * from "./people";
export * from "./promotions";
export * from "./artifacts";
export * from "./videos";
export * from "./watch";
export * from "./defenseReviews";
export * from "./legal";

/** Published entries whose primary or secondary system is `slug`. */
export function entriesForSystem(slug: string, limit?: number): NewsroomEntry[] {
  const entries = sortByDate(
    publishedEntries.filter(
      (e) => e.systemSlug === slug || (e.relatedSystems ?? []).includes(slug),
    ),
  );
  return typeof limit === "number" ? entries.slice(0, limit) : entries;
}

/** Roles supporting a system. Archived roles are excluded. */
export function careersForSystem(slug: string): CareerRecord[] {
  return publicCareers.filter((c) => c.systemSlug === slug && c.status !== "Archived");
}

export interface SystemBundle {
  system: SystemRecord;
  entries: NewsroomEntry[];
  careers: CareerRecord[];
  roadmap: RoadmapItem[];
  capabilities: CapabilityRecord[];
}

/** Everything a system detail page needs, resolved in one call. */
export function getSystemBundle(slug: string): SystemBundle | undefined {
  const system = getSystem(slug);
  if (!system) return undefined;
  return {
    system,
    entries: entriesForSystem(slug),
    careers: careersForSystem(slug),
    roadmap: roadmapForSystem(slug),
    capabilities: capabilitiesForSystem(slug),
  };
}

/**
 * Related published entries: same system first, then same desk. Never returns
 * the entry itself.
 */
export function relatedEntries(entry: NewsroomEntry, limit = 3): NewsroomEntry[] {
  const systemSlugs = [entry.systemSlug, ...(entry.relatedSystems ?? [])].filter(Boolean);
  const sameSystem = publishedEntries.filter(
    (e) =>
      e.slug !== entry.slug &&
      [e.systemSlug, ...(e.relatedSystems ?? [])].some((s) => s && systemSlugs.includes(s)),
  );
  const sameDesk = publishedEntries.filter(
    (e) => e.desk === entry.desk && e.slug !== entry.slug && !sameSystem.includes(e),
  );
  return sortByDate([...sameSystem, ...sameDesk]).slice(0, limit);
}

/** Roles on the same system, then roles in the same division. */
export function relatedCareers(career: CareerRecord, limit = 3): CareerRecord[] {
  const sameSystem = publicCareers.filter(
    (c) => c.slug !== career.slug && c.systemSlug === career.systemSlug && c.status !== "Archived",
  );
  const sameDivision = publicCareers.filter(
    (c) =>
      c.slug !== career.slug &&
      c.status === career.status &&
      c.status !== "Archived" &&
      !sameSystem.includes(c),
  );
  return [...sameSystem, ...sameDivision].slice(0, limit);
}

/** Published roadmap work related to the system a role supports. */
export function roadmapForCareer(career: CareerRecord, limit = 2): RoadmapItem[] {
  if (!career.systemSlug) return [];
  return roadmapForSystem(career.systemSlug).slice(0, limit);
}

/** Human-readable date, or a dash when no verified date exists. */
export function formatDate(date: string | null): string {
  if (!date) return "—";
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Date, or an explicit statement that none is published. */
export function formatDateOrUndated(date: string | null): string {
  return date ? formatDate(date) : "No published date";
}
