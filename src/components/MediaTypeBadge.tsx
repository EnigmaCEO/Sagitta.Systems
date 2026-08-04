import type { MediaType } from "@/content/types";

/**
 * The eight media types, each with an accent and a glyph.
 *
 * The colour groups them — reading material in cool blues, recorded material in
 * warm tones, network material in gold — and the glyph distinguishes them
 * without relying on colour. The type name is always rendered as text too.
 */
export const mediaTypeStyles: Record<MediaType, { color: string; glyph: MediaGlyphName }> = {
  Article: { color: "#8fb6e8", glyph: "article" },
  Report: { color: "#a5b4fc", glyph: "report" },
  Audio: { color: "#e6a6d8", glyph: "audio" },
  Video: { color: "#efa3a3", glyph: "video" },
  Briefing: { color: "#d9b168", glyph: "briefing" },
  "Press Release": { color: "#6fd0dd", glyph: "press" },
  Data: { color: "#7fd8a8", glyph: "data" },
  "System Update": { color: "#8fc9f0", glyph: "system" },
};

type MediaGlyphName =
  | "article"
  | "report"
  | "audio"
  | "video"
  | "briefing"
  | "press"
  | "data"
  | "system";

export function MediaTypeIcon({ type, size = 13 }: { type: MediaType; size?: number }) {
  const glyph = mediaTypeStyles[type].glyph;
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (glyph) {
    case "article":
      return (
        <svg {...common}>
          <path d="M3 2.5h10v11H3z" />
          <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" />
        </svg>
      );
    case "report":
      return (
        <svg {...common}>
          <path d="M4 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4z" />
          <path d="M4 2v12" strokeWidth="1.8" />
          <path d="M6.5 5.5h4M6.5 8h4" />
        </svg>
      );
    case "audio":
      return (
        <svg {...common}>
          <path d="M2 8v0M4.5 5.5v5M7 3v10M9.5 5v6M12 6.5v3M14.5 7.5v1" />
        </svg>
      );
    case "video":
      return (
        <svg {...common}>
          <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
          <path d="M6.8 6.5 10 8l-3.2 1.5z" fill="currentColor" />
        </svg>
      );
    case "briefing":
      return (
        <svg {...common}>
          <path d="M2.5 5.5h11v8h-11z" />
          <path d="M6 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5" />
          <path d="M2.5 8.5h11" />
        </svg>
      );
    case "press":
      return (
        <svg {...common}>
          <path d="M3 6.5v3h2.5L10 12.5v-9L5.5 6.5H3z" />
          <path d="M12 6a3 3 0 0 1 0 4" />
        </svg>
      );
    case "data":
      return (
        <svg {...common}>
          <path d="M2.5 13.5h11" />
          <path d="M4.5 13.5V9M7.5 13.5V5.5M10.5 13.5v-6M13.5 13.5v-2" strokeWidth="1.6" />
        </svg>
      );
    case "system":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="1.6" fill="currentColor" stroke="none" />
          <path d="M4.8 4.8a4.5 4.5 0 0 0 0 6.4M11.2 4.8a4.5 4.5 0 0 1 0 6.4" />
          <path d="M2.6 2.6a7.6 7.6 0 0 0 0 10.8M13.4 2.6a7.6 7.6 0 0 1 0 10.8" opacity="0.5" />
        </svg>
      );
  }
}

export default function MediaTypeBadge({
  type,
  size = "md",
}: {
  type: MediaType;
  size?: "sm" | "md";
}) {
  const { color } = mediaTypeStyles[type];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-medium shrink-0 uppercase ${
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
      }`}
      style={{
        color,
        backgroundColor: "color-mix(in srgb, currentColor 9%, transparent)",
        border: "1px solid color-mix(in srgb, currentColor 24%, transparent)",
        letterSpacing: "0.06em",
      }}
    >
      <MediaTypeIcon type={type} size={size === "sm" ? 11 : 13} />
      {type}
    </span>
  );
}

/** Neutral label. Used for engagement types, families, cadence, and the like. */
export function MetaBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "quiet" | "accent";
}) {
  const color =
    tone === "accent"
      ? "var(--family-accent)"
      : tone === "quiet"
        ? "var(--text-tertiary)"
        : "var(--text-secondary)";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0"
      style={{
        color,
        backgroundColor: "var(--surface-2)",
        border: "1px solid var(--border)",
      }}
    >
      {children}
    </span>
  );
}

/**
 * Marks a supporting capability. Deliberately distinct from an operating-status
 * badge: capabilities are delivered through systems and carry no state.
 */
export function CapabilityBadge({ archived = false }: { archived?: boolean }) {
  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium shrink-0"
      style={{
        color: "var(--text-tertiary)",
        backgroundColor: "transparent",
        border: "1px dashed var(--border-strong)",
      }}
    >
      {archived ? "Archived capability" : "Supporting capability"}
    </span>
  );
}
