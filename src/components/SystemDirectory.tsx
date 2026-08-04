"use client";

import { useMemo, useState } from "react";
import type { OperatingState, SystemFamilyId } from "@/content/types";
import { ALL, applySelection, facetCount, isFiltered as anyFiltered } from "@/lib/filters";
import EmptyState from "./EmptyState";
import FilterControls, { type FilterOption } from "./FilterControls";

export interface DirectoryItem {
  slug: string;
  family: SystemFamilyId;
  status: OperatingState;
  /** The card, rendered on the server and passed through untouched. */
  card: React.ReactNode;
}

export interface DirectoryFamily {
  id: SystemFamilyId;
  name: string;
  summary: string;
  color: string;
  /** The family's section heading and motif, rendered on the server. */
  header: React.ReactNode;
}

/**
 * The systems directory.
 *
 * Two presentations, one dataset. With no filter applied the directory is
 * grouped by strategic family, which is how the network is meant to be read and
 * which keeps the `#continuity-defense` style anchors that the footer and the
 * homepage link into. Once a filter is applied it flattens to a single result
 * grid, because a grouped view of three matching systems is mostly empty
 * headings.
 *
 * Cards are rendered on the server and passed in as nodes, so filtering costs
 * the browser a small metadata array rather than the whole content layer.
 */
export default function SystemDirectory({
  items,
  families,
  states,
  stateColors,
}: {
  items: DirectoryItem[];
  families: DirectoryFamily[];
  states: OperatingState[];
  stateColors: Record<OperatingState, string>;
}) {
  const [family, setFamily] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(ALL);

  const selection = useMemo(() => ({ family, status }), [family, status]);
  const filtered = useMemo(() => applySelection(items, selection), [items, selection]);
  const isFiltered = anyFiltered(selection);

  // Counts respect the other active filter, so an option never promises
  // results that selecting it would not actually return.
  const familyOptions: FilterOption[] = [
    { value: ALL, label: "All families", count: facetCount(items, selection, "family", ALL) },
    ...families.map((f) => ({
      value: f.id,
      label: f.name,
      color: f.color,
      count: facetCount(items, selection, "family", f.id),
    })),
  ];

  const stateOptions: FilterOption[] = [
    { value: ALL, label: "Any state", count: facetCount(items, selection, "status", ALL) },
    ...states.map((s) => ({
      value: s,
      label: s,
      color: stateColors[s],
      count: facetCount(items, selection, "status", s),
    })),
  ];

  return (
    <>
      <FilterControls
        groups={[
          {
            id: "family",
            label: "Strategic family",
            options: familyOptions,
            value: family,
            onChange: setFamily,
          },
          {
            id: "state",
            label: "Operating state",
            options: stateOptions,
            value: status,
            onChange: setStatus,
          },
        ]}
        onReset={() => {
          setFamily(ALL);
          setStatus(ALL);
        }}
        resultCount={filtered.length}
        resultNoun="system"
        isFiltered={isFiltered}
      />

      {isFiltered ? (
        filtered.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-testid="system-results"
          >
            {filtered.map((item) => (
              <div key={item.slug}>{item.card}</div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No systems match these filters"
            description="Every combination of family and state that has systems behind it is reachable — this one has none. Clear the filters to see all ten."
          />
        )
      ) : (
        <div className="space-y-14" data-testid="system-results">
          {families.map((f) => {
            const members = items.filter((i) => i.family === f.id);
            return (
              <section key={f.id} id={f.id}>
                {f.header}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((item) => (
                    <div key={item.slug}>{item.card}</div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
