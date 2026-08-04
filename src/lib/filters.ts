/**
 * Filter logic for the systems directory and the newsroom index.
 *
 * Pure functions, deliberately separate from the components that call them, so
 * the rule that matters most — that a facet count never promises results the
 * selection would not return — can be tested without rendering anything.
 */

export const ALL = "all";

/**
 * Anything with facet fields on it. Records carry more than their facets — a
 * directory item also carries its rendered card — so this stays deliberately
 * loose and the facet is read by name at the point of comparison.
 */
export type Facets = object;

/** The current selection: one value per axis, `all` for unfiltered. */
export type Selection = Record<string, string>;

function facetOf(record: Facets, axis: string): unknown {
  return (record as Record<string, unknown>)[axis];
}

function facetMatches(value: unknown, selected: string): boolean {
  if (selected === ALL) return true;
  if (value === undefined || value === null) return false;
  return Array.isArray(value) ? value.includes(selected) : value === selected;
}

/**
 * Whether a record survives the current selection.
 *
 * `skipAxis` excludes one axis from the test, which is what makes facet counts
 * honest: the count shown against an option is the number of records that would
 * remain if that option were chosen, given everything *else* already selected.
 */
export function matchesSelection<T extends Facets>(
  record: T,
  selection: Selection,
  skipAxis?: string,
): boolean {
  return Object.entries(selection).every(
    ([axis, selected]) => axis === skipAxis || facetMatches(facetOf(record, axis), selected),
  );
}

/** Records surviving the whole selection. */
export function applySelection<T extends Facets>(records: T[], selection: Selection): T[] {
  return records.filter((record) => matchesSelection(record, selection));
}

/**
 * The count to show against one option on one axis: how many records would
 * remain if this option were selected, with the other axes left as they are.
 */
export function facetCount<T extends Facets>(
  records: T[],
  selection: Selection,
  axis: string,
  optionValue: string,
): number {
  return records.filter(
    (record) =>
      matchesSelection(record, selection, axis) &&
      facetMatches(facetOf(record, axis), optionValue),
  ).length;
}

/** True when any axis is narrowed. Drives the "clear filters" affordance. */
export function isFiltered(selection: Selection): boolean {
  return Object.values(selection).some((value) => value !== ALL);
}

/**
 * The bucket a record with no published date falls into. Undated records are
 * given their own facet rather than being hidden from the period filter or
 * assigned a year by inference.
 */
export const UNDATED_PERIOD = "undated";

/**
 * Publication period for a record: its year, or the undated bucket.
 *
 * Lives here, not in the browser component, because the newsroom index builds
 * its facets on the server — and a `"use client"` module's functions cannot be
 * called during prerendering.
 */
export function periodOf(entry: { publishedAt: string | null }): string {
  return entry.publishedAt ? entry.publishedAt.slice(0, 4) : UNDATED_PERIOD;
}
