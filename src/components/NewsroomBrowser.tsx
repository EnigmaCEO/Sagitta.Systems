"use client";

import { useMemo, useState } from "react";
import type { MediaType } from "@/content/types";
import { ALL, applySelection, facetCount, isFiltered as anyFiltered } from "@/lib/filters";
import EmptyState from "./EmptyState";
import FilterControls, { type FilterOption } from "./FilterControls";

export interface BrowserEntry {
  slug: string;
  desk: string;
  mediaType: MediaType;
  /** Primary and secondary systems, so a filter finds every record that touches one. */
  systems: string[];
  /** Publication year, or `undated` where the source states no date. */
  period: string;
  /** The card, rendered on the server and passed through untouched. */
  card: React.ReactNode;
}

export interface BrowserOption {
  value: string;
  label: string;
  color?: string;
}

/**
 * Newsroom index browser.
 *
 * Four axes — desk, media type, related system, and publication period — over
 * one list of published records. Counts are computed against the *other* active
 * filters, so an option never advertises results that selecting it would not
 * return; and the empty state only ever appears for a filter combination a
 * reader actually chose, never for an empty feed.
 *
 * Cards arrive pre-rendered from the server, so the browser ships filter
 * metadata rather than the newsroom content itself.
 */
export default function NewsroomBrowser({
  entries,
  desks,
  mediaTypes,
  systems,
  periods,
  mediaColors,
}: {
  entries: BrowserEntry[];
  desks: BrowserOption[];
  mediaTypes: BrowserOption[];
  systems: BrowserOption[];
  periods: BrowserOption[];
  mediaColors: Record<string, string>;
}) {
  const [desk, setDesk] = useState(ALL);
  const [mediaType, setMediaType] = useState(ALL);
  const [system, setSystem] = useState(ALL);
  const [period, setPeriod] = useState(ALL);

  const selection = useMemo(
    () => ({ desk, mediaType, systems: system, period }),
    [desk, mediaType, system, period],
  );

  const filtered = useMemo(() => applySelection(entries, selection), [entries, selection]);
  const isFiltered = anyFiltered(selection);

  const build = (
    options: BrowserOption[],
    allLabel: string,
    axis: "desk" | "mediaType" | "systems" | "period",
  ): FilterOption[] => [
    { value: ALL, label: allLabel, count: facetCount(entries, selection, axis, ALL) },
    ...options.map((option) => ({
      value: option.value,
      label: option.label,
      color: option.color,
      count: facetCount(entries, selection, axis, option.value),
    })),
  ];

  return (
    <>
      <FilterControls
        groups={[
          {
            id: "desk",
            label: "Editorial desk",
            options: build(desks, "All desks", "desk"),
            value: desk,
            onChange: setDesk,
          },
          {
            id: "media",
            label: "Media type",
            options: build(
              mediaTypes.map((m) => ({ ...m, color: mediaColors[m.value] })),
              "All media",
              "mediaType",
            ),
            value: mediaType,
            onChange: setMediaType,
          },
          {
            id: "system",
            label: "Related system",
            options: build(systems, "All systems", "systems"),
            value: system,
            onChange: setSystem,
          },
          {
            id: "period",
            label: "Published",
            options: build(periods, "Any time", "period"),
            value: period,
            onChange: setPeriod,
          },
        ]}
        onReset={() => {
          setDesk(ALL);
          setMediaType(ALL);
          setSystem(ALL);
          setPeriod(ALL);
        }}
        resultCount={filtered.length}
        resultNoun="record"
        isFiltered={isFiltered}
      />

      {filtered.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-testid="newsroom-results"
        >
          {filtered.map((entry) => (
            <div key={entry.slug}>{entry.card}</div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No records match these filters"
          description="Every published record is reachable through some combination of these filters — this one returns none. Clear the filters to see the full index."
        />
      )}
    </>
  );
}
