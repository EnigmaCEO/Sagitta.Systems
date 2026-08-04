import type { SystemFamily, SystemFamilyId } from "@/content/types";

/**
 * Family visual identity.
 *
 * The three strategic families stay inside one Sagitta identity — same
 * foundations, same typography, same grid — and separate through accent, icon,
 * and background motif:
 *
 *   Continuity and Defense       signal    — radar arcs sweeping outward
 *   Allocation and Agent Intel.  routing   — a decision branching into paths
 *   Capital Infrastructure       ledger    — settlement rails stacked and moving
 *
 * The accent itself is set by the `.family-*` scope class on any ancestor, so a
 * component inside a family subtree never needs to know which family it is in.
 */

/** Scope class that binds `--family-accent` for a subtree. */
export function familyClass(id: SystemFamilyId | undefined): string {
  return id ? `family-${id}` : "";
}

export function FamilyIcon({
  motif,
  size = 18,
}: {
  motif: SystemFamily["motif"];
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (motif === "signal") {
    // Radar: a origin point with arcs sweeping outward.
    return (
      <svg {...common}>
        <circle cx="5" cy="19" r="1.6" fill="currentColor" stroke="none" />
        <path d="M5 13.5A5.5 5.5 0 0 1 10.5 19" opacity="0.9" />
        <path d="M5 9a10 10 0 0 1 10 10" opacity="0.6" />
        <path d="M5 4.5A14.5 14.5 0 0 1 19.5 19" opacity="0.35" />
      </svg>
    );
  }

  if (motif === "intelligence") {
    // Routing: one input, a decision node, three governed outputs.
    return (
      <svg {...common}>
        <circle cx="4.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <path d="M6 12h4.5" />
        <circle cx="12" cy="12" r="1.9" />
        <path d="M13.6 10.8 18 6.5M13.9 12H18M13.6 13.2 18 17.5" opacity="0.75" />
        <circle cx="19.4" cy="6" r="1.1" fill="currentColor" stroke="none" opacity="0.8" />
        <circle cx="19.4" cy="12" r="1.1" fill="currentColor" stroke="none" opacity="0.8" />
        <circle cx="19.4" cy="18" r="1.1" fill="currentColor" stroke="none" opacity="0.8" />
      </svg>
    );
  }

  // Ledger: settlement rails, with a value moving along the middle one.
  return (
    <svg {...common}>
      <path d="M3 6.5h18" opacity="0.5" />
      <path d="M3 12h18" />
      <path d="M3 17.5h18" opacity="0.5" />
      <rect x="8" y="10.2" width="3.6" height="3.6" rx="0.9" fill="currentColor" stroke="none" />
      <rect x="15" y="4.7" width="3.6" height="3.6" rx="0.9" fill="currentColor" stroke="none" opacity="0.55" />
      <rect x="4.4" y="15.7" width="3.6" height="3.6" rx="0.9" fill="currentColor" stroke="none" opacity="0.55" />
    </svg>
  );
}

/** Compact family label. Pair with `familyClass` on an ancestor. */
export function FamilyBadge({
  family,
  showIcon = true,
}: {
  family: SystemFamily;
  showIcon?: boolean;
}) {
  return (
    <span
      className={`${familyClass(family.id)} inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium shrink-0`}
      style={{
        color: "var(--family-accent)",
        backgroundColor: "var(--family-accent-dim)",
        border: "1px solid color-mix(in srgb, var(--family-accent) 26%, transparent)",
      }}
    >
      {showIcon && <FamilyIcon motif={family.motif} size={13} />}
      {family.shortName}
    </span>
  );
}

/**
 * Decorative background motif for a family section. Purely atmospheric — it is
 * `aria-hidden` and carries no information that is not also in the text.
 */
export function FamilyBackdrop({ motif }: { motif: SystemFamily["motif"] }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ color: "var(--family-accent)", opacity: 0.14 }}
    >
      {motif === "signal" && (
        <svg
          className="absolute -right-24 -top-20 w-[420px] h-[420px]"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          {[40, 62, 84, 106, 128].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} opacity={1 - r / 190} />
          ))}
          <path d="M100 100 L100 -10" opacity="0.5" />
          <path d="M100 100 L196 46" opacity="0.28" />
        </svg>
      )}

      {motif === "intelligence" && (
        <svg
          className="absolute -right-16 -top-16 w-[380px] h-[380px]"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <path d="M10 100 H70" />
          <path d="M70 100 L130 40 M70 100 H130 M70 100 L130 160" />
          <path d="M130 40 L186 18 M130 40 L186 62 M130 160 L186 138 M130 160 L186 182" opacity="0.55" />
          {[
            [70, 100],
            [130, 40],
            [130, 100],
            [130, 160],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="currentColor" stroke="none" />
          ))}
        </svg>
      )}

      {motif === "ledger" && (
        <svg
          className="absolute -right-16 -top-12 w-[400px] h-[360px]"
          viewBox="0 0 200 180"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          {[24, 52, 80, 108, 136].map((y) => (
            <path key={y} d={`M0 ${y} H200`} opacity={0.9 - y / 200} />
          ))}
          {[
            [36, 52],
            [92, 80],
            [148, 24],
            [120, 136],
          ].map(([x, y]) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y - 5}
              width="10"
              height="10"
              rx="2"
              fill="currentColor"
              stroke="none"
              opacity="0.7"
            />
          ))}
        </svg>
      )}
    </div>
  );
}
