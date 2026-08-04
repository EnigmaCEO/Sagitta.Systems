import type { OperatingState } from "@/content/types";

/**
 * The four evidence-based operating states.
 *
 * Each carries a distinct colour *and* a distinct glyph, because status must be
 * legible without colour perception: a filled dot is operating, a ring is in
 * public test, a half-filled dot is in development, and a dash is a research
 * horizon. The badge always renders the state's name in text as well.
 */
export const operatingStateStyles: Record<
  OperatingState,
  { color: string; bg: string; glyph: "filled" | "ring" | "half" | "dash"; meaning: string }
> = {
  Operating: {
    color: "var(--state-operating)",
    bg: "var(--state-operating-dim)",
    glyph: "filled",
    meaning: "live on a public surface you can open today",
  },
  "Public Test": {
    color: "var(--state-public-test)",
    bg: "var(--state-public-test-dim)",
    glyph: "ring",
    meaning: "reachable, but on a test deployment rather than in production",
  },
  "In Development": {
    color: "var(--state-development)",
    bg: "var(--state-development-dim)",
    glyph: "half",
    meaning: "being built — a demo, a briefing, or a specification, not a product",
  },
  "Research Horizon": {
    color: "var(--state-horizon)",
    bg: "var(--state-horizon-dim)",
    glyph: "dash",
    meaning: "architecture still forming, with no committed delivery timing",
  },
};

/** The glyph alone. Decorative: the state name always accompanies it. */
export function StateGlyph({
  state,
  size = 8,
}: {
  state: OperatingState;
  size?: number;
}) {
  const { color, glyph } = operatingStateStyles[state];

  if (glyph === "dash") {
    return (
      <span
        aria-hidden="true"
        className="inline-block shrink-0"
        style={{ width: size + 2, height: 2, backgroundColor: color, borderRadius: 1 }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        border: `1.5px solid ${color}`,
        backgroundColor: glyph === "filled" ? color : "transparent",
        // A half-filled dot: the fill stops at the midline.
        backgroundImage:
          glyph === "half"
            ? `linear-gradient(to right, ${color} 0 50%, transparent 50% 100%)`
            : undefined,
      }}
    />
  );
}

export default function OperatingStatusBadge({
  state,
  size = "md",
}: {
  state: OperatingState;
  size?: "sm" | "md";
}) {
  const s = operatingStateStyles[state];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-medium shrink-0 ${
        size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-xs"
      }`}
      style={{
        color: s.color,
        backgroundColor: s.bg,
        border: `1px solid color-mix(in srgb, ${s.color} 26%, transparent)`,
      }}
    >
      <StateGlyph state={state} size={size === "sm" ? 7 : 8} />
      {state}
    </span>
  );
}

/** Legend explaining every operating state, reused across directories. */
export function OperatingStatusLegend() {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs max-w-3xl">
      {(Object.keys(operatingStateStyles) as OperatingState[]).map((state) => (
        <div key={state} className="flex items-start gap-2">
          <dt className="shrink-0">
            <OperatingStatusBadge state={state} size="sm" />
          </dt>
          <dd className="leading-relaxed pt-0.5" style={{ color: "var(--text-tertiary)" }}>
            {operatingStateStyles[state].meaning}
          </dd>
        </div>
      ))}
    </dl>
  );
}
