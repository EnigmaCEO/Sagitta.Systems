"use client";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  /** Optional swatch shown before the label, e.g. a family or state colour. */
  color?: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * Segmented filter controls.
 *
 * Each group is a `radiogroup` labelled by its own legend, so a screen reader
 * announces both which filter is being set and which option is selected. Counts
 * are read as part of each option's accessible name, and the result count is
 * announced politely on change rather than moving focus.
 */
export default function FilterControls({
  groups,
  onReset,
  resultCount,
  resultNoun = "record",
  isFiltered = false,
}: {
  groups: FilterGroup[];
  onReset?: () => void;
  resultCount?: number;
  resultNoun?: string;
  isFiltered?: boolean;
}) {
  return (
    <div
      className="mb-8 rounded-xl border p-5 space-y-5"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      {groups.map((group) => (
        <fieldset key={group.id}>
          <legend className="eyebrow mb-2.5" style={{ color: "var(--text-tertiary)" }}>
            {group.label}
          </legend>
          <div role="radiogroup" aria-label={group.label} className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const selected = group.value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  data-testid="filter-option"
                  data-group={group.id}
                  data-value={option.value}
                  onClick={() => group.onChange(option.value)}
                  className="tap-target inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-medium transition-colors duration-150"
                  style={{
                    color: selected ? "var(--text-primary)" : "var(--text-secondary)",
                    backgroundColor: selected ? "var(--surface-3)" : "transparent",
                    borderColor: selected ? "var(--gold)" : "var(--border)",
                  }}
                >
                  {option.color && (
                    <span
                      aria-hidden="true"
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                  )}
                  {option.label}
                  {typeof option.count === "number" && (
                    <span className="tabular-nums" style={{ color: "var(--text-tertiary)" }}>
                      {option.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div
        className="flex flex-wrap items-center gap-4 pt-1 border-t"
        style={{ borderColor: "var(--border)", paddingTop: "1rem" }}
      >
        {typeof resultCount === "number" && (
          <p className="text-xs" aria-live="polite" style={{ color: "var(--text-secondary)" }}>
            Showing {resultCount} {resultCount === 1 ? resultNoun : `${resultNoun}s`}
          </p>
        )}
        {onReset && isFiltered && (
          <button
            type="button"
            onClick={onReset}
            data-testid="filter-reset"
            className="text-xs font-semibold transition-opacity duration-150 hover:opacity-80"
            style={{ color: "var(--gold)" }}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
