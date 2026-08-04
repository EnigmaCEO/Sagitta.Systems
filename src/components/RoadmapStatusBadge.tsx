import type { OperatingState, RoadmapHorizon } from "@/content/types";
import OperatingStatusBadge from "./OperatingStatusBadge";

/**
 * Roadmap items carry both an evidence-based state and a time horizon. The
 * state reuses the operating-status vocabulary so a system reads the same way
 * in the directory and on the roadmap.
 */
export default function RoadmapStatusBadge({
  state,
  horizon,
}: {
  state: OperatingState;
  horizon?: RoadmapHorizon;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <OperatingStatusBadge state={state} />
      {horizon && (
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          style={{
            color: "var(--text-tertiary)",
            backgroundColor: "var(--surface-2)",
            border: "1px solid var(--border)",
          }}
        >
          {horizon}
        </span>
      )}
    </span>
  );
}
