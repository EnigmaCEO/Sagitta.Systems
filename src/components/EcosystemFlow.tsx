import type { CSSProperties } from "react";
import Link from "@/components/Link";
import SystemMark from "@/components/SystemMark";
import { familyClass } from "@/components/FamilyMark";
import { ecosystemFlow, ecosystemThesis } from "@/content";
import type { SystemRecord } from "@/content/types";

/**
 * The ecosystem view of the portfolio.
 *
 * The constellation on the same page draws the *internal architecture*: three
 * families, eight members, and the documented relationships between them. It is
 * correct and it is not this. This figure draws the second relationship — what
 * each system contributes to the Sagitta Protocol ecosystem — which runs in one
 * direction and does not respect the family columns at all:
 *
 *   independent commercial surface  →  capability foundation  →  Sagitta Protocol
 *
 * Two views rather than one rewired view, deliberately. Folding the direction of
 * contribution into the constellation would mean either dropping the family
 * columns that make the architecture legible, or drawing two contradictory
 * meanings on the same wires. Each figure answers one question.
 *
 * Everything rendered here is read from the system records: the surfaces and the
 * foundation each one feeds come from `parentSystem`, and every sentence is that
 * system's own `ecosystemRole`. No copy is authored in this component, so a
 * system cannot be described one way in the directory and another way here.
 *
 * ── Layout ───────────────────────────────────────────────────────────────────
 *
 * A three-column CSS grid on desktop, one row per commercial surface. A
 * capability cell spans the rows of every surface that feeds it, and the
 * Protocol cell spans all of them, so containment is carried by the geometry
 * rather than by drawn wires — nothing here needs hand-routed polylines or a
 * layout assertion.
 *
 * Every cell's row and column are computed and set explicitly rather than left
 * to auto-placement, because the spans make the auto-placement cursor's
 * behaviour depend on source order, and source order here is the reading order
 * of the stacked layout. Below the breakpoint the grid collapses to one column
 * in that order, which is still the direction of the flow, and the arrow glyphs
 * rotate to match rather than pointing across a column that is no longer beside
 * anything.
 */
export default function EcosystemFlow() {
  const flow = ecosystemFlow();
  if (!flow) return null;

  const { protocol, surfaces, horizon } = flow;

  // Surfaces grouped by the capability they feed, in record order, each group
  // carrying the row it starts on. Row 1 holds the column headings, so the
  // first surface sits on row 2. A surface that reaches the Protocol directly
  // (Banking) forms its own group with no capability — the gap is the fact.
  const groups: { via?: SystemRecord; surfaces: SystemRecord[]; row: number }[] = [];
  surfaces.forEach(({ system, via }, index) => {
    const last = groups[groups.length - 1];
    if (last && last.via?.slug === via?.slug) last.surfaces.push(system);
    else groups.push({ via, surfaces: [system], row: index + 2 });
  });

  const rows = surfaces.length;

  return (
    <div>
      <div
        className="rounded-2xl border p-4 sm:p-6"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)_minmax(0,0.95fr)] gap-3">
          <ColumnHeading column={1} label="Independent commercial surfaces" />
          <ColumnHeading column={2} label="Capabilities they build and prove" />
          <ColumnHeading column={3} label="What the capabilities run inside" />

          {groups.map((group) => (
            <Cells key={group.via?.slug ?? group.surfaces[0].slug} {...group} />
          ))}

          {/* One destination, reached by all of them: spans every surface row. */}
          <div
            className={`eco-cell ${familyClass(protocol.family)}`}
            style={cell(3, `2 / span ${rows}`)}
          >
            <SystemPanel system={protocol} emphasis />
          </div>
        </div>
      </div>

      {horizon.length > 0 && (
        <div
          className="mt-3 rounded-xl border border-dashed p-4"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="eyebrow mb-2" style={{ color: "var(--text-tertiary)" }}>
            Outside the flow
          </p>
          <ul className="space-y-2">
            {horizon.map((system) => (
              <li
                key={system.slug}
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                <Link
                  href={`/systems/${system.slug}`}
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {system.name}
                </Link>{" "}
                — {system.ecosystemRole}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* The figure draws one of the two structures. This closes it by saying
          why the other one is not the whole story — the canonical dual view
          sits above the figure, in the section heading, where it frames both. */}
      <p className="text-xs leading-relaxed mt-4 max-w-3xl" style={{ color: "var(--text-tertiary)" }}>
        {ecosystemThesis.purpose}
      </p>
    </div>
  );
}

/**
 * Grid placement for one cell, carried as custom properties so it applies only
 * in the desktop figure. See `.eco-cell` in globals.css.
 */
function cell(column: number, row: string): CSSProperties {
  return { "--eco-col": String(column), "--eco-row": row } as CSSProperties;
}

/** One capability and the surfaces feeding it, placed on explicit grid tracks. */
function Cells({
  via,
  surfaces,
  row,
}: {
  via?: SystemRecord;
  surfaces: SystemRecord[];
  row: number;
}) {
  const span = surfaces.length;

  return (
    <>
      {surfaces.map((system, index) => (
        <div
          key={system.slug}
          className={`eco-cell ${familyClass(system.family)}`}
          style={cell(1, `${row + index}`)}
        >
          <SystemPanel system={system} />
        </div>
      ))}

      {via ? (
        <div
          className={`eco-cell ${familyClass(via.family)}`}
          style={cell(2, `${row} / span ${span}`)}
        >
          <SystemPanel system={via} arrow />
        </div>
      ) : (
        // Banking's row. Nothing is elided here: the surface connects to the
        // Protocol without an intermediate capability, and the cell says so
        // rather than leaving a hole a reader would take for unfinished work.
        <div
          className="eco-cell flex items-center gap-2.5 px-1 lg:px-4 py-2"
          style={cell(2, `${row} / span ${span}`)}
        >
          <Arrow />
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            Connects to the Protocol directly, with no intermediate capability layer.
          </p>
        </div>
      )}
    </>
  );
}

function SystemPanel({
  system,
  emphasis,
  arrow,
}: {
  system: SystemRecord;
  emphasis?: boolean;
  arrow?: boolean;
}) {
  return (
    <div
      className="h-full rounded-xl border p-4 flex flex-col gap-2"
      style={{
        backgroundColor: emphasis ? "var(--family-accent-dim)" : "var(--bg-base)",
        borderColor: emphasis
          ? "color-mix(in srgb, var(--family-accent) 40%, transparent)"
          : "var(--border)",
        borderLeft: "2px solid var(--family-accent)",
      }}
    >
      <div className="flex items-center gap-2.5">
        {arrow && <Arrow />}
        <SystemMark systemSlug={system.slug} height={22} width={40} />
        <Link
          href={`/systems/${system.slug}`}
          className="text-sm font-semibold leading-tight transition-opacity duration-150 hover:opacity-80"
          style={{ color: "var(--text-primary)" }}
        >
          {system.name}
        </Link>
      </div>
      <p
        className={`${emphasis ? "text-sm" : "text-xs"} leading-relaxed`}
        style={{ color: emphasis ? "var(--text-primary)" : "var(--text-secondary)" }}
      >
        {system.ecosystemRole}
      </p>
    </div>
  );
}

/** Direction of contribution. Points right in columns, down when they stack. */
function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 rotate-90 lg:rotate-0"
      stroke="var(--text-tertiary)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ColumnHeading({ column, label }: { column: number; label: string }) {
  return (
    <p
      className="eco-cell eyebrow hidden lg:block pb-1"
      style={{ color: "var(--text-tertiary)", ...cell(column, "1") }}
    >
      {label}
    </p>
  );
}
