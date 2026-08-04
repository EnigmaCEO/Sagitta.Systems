import Link from "@/components/Link";
import type { ContentAction } from "@/content/types";
import { ArrowRight, ExternalArrow } from "./icons";

/**
 * Renders a state-aware call to action from the content layer.
 *
 * Every action carries a stable `id`, emitted here as `data-cta`, plus its type
 * and availability — so system entry, operating-product visits, documentation
 * visits, Defense Review inquiries, partnership inquiries, press inquiries, and
 * career actions are all distinguishable without re-instrumenting a template.
 *
 * `CtaAnalytics` reads these attributes at runtime through one delegated
 * listener, so nothing here needs a handler and no future action needs wiring:
 * emitting the attributes is the whole integration. It sends nothing unless
 * `NEXT_PUBLIC_ANALYTICS_ENDPOINT` is configured, and nothing for a reader
 * sending Do Not Track or Global Privacy Control.
 */
export default function CtaLink({
  action,
  variant = "primary",
  className = "",
  showNote = false,
}: {
  action: ContentAction;
  variant?: "primary" | "secondary" | "inline";
  className?: string;
  /** Renders the action's qualifier beneath it. */
  showNote?: boolean;
}) {
  const base =
    variant === "inline"
      ? "inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity duration-150 hover:opacity-80"
      : variant === "secondary"
        ? "btn-secondary tap-target inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold"
        : "btn-primary tap-target inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold";

  const style = variant === "inline" ? { color: "var(--family-accent)" } : undefined;

  const shared = {
    className: `${base} ${className}`.trim(),
    style,
    "data-cta": action.id,
    "data-cta-type": action.type,
    "data-cta-availability": action.availability,
    ...(action.audience ? { "data-cta-audience": action.audience } : {}),
  };

  const icon = action.external ? (
    <ExternalArrow size={variant === "inline" ? 11 : 12} />
  ) : (
    <ArrowRight size={variant === "inline" ? 12 : 13} />
  );

  const link = action.external ? (
    <a {...shared} href={action.href} target="_blank" rel="noopener noreferrer">
      {action.label}
      {icon}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link {...shared} href={action.href}>
      {action.label}
      {icon}
    </Link>
  );

  if (!showNote || !action.note) return link;

  return (
    <span className="inline-flex flex-col gap-1.5">
      {link}
      <span className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
        {action.note}
      </span>
    </span>
  );
}

/**
 * The pair of actions a system publishes, with the primary action's qualifier
 * shown beneath. Used by the system hero and the final action panel.
 */
export function CtaPair({
  primary,
  secondary,
  align = "start",
}: {
  primary: ContentAction;
  secondary?: ContentAction;
  align?: "start" | "center";
}) {
  return (
    <div className={align === "center" ? "flex flex-col items-center" : "flex flex-col"}>
      <div className={`flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>
        <CtaLink action={primary} variant="primary" />
        {secondary && <CtaLink action={secondary} variant="secondary" />}
      </div>
      {primary.note && (
        <p
          className={`text-xs leading-relaxed mt-3 max-w-md ${align === "center" ? "text-center" : ""}`}
          style={{ color: "var(--text-tertiary)" }}
        >
          {primary.note}
        </p>
      )}
    </div>
  );
}

/**
 * Availability, stated in words. An action's colour and label describe the
 * destination; this describes whether you can actually use it right now.
 */
export function AvailabilityNote({ action }: { action: ContentAction }) {
  const copy: Record<ContentAction["availability"], string> = {
    available: "Available now",
    "by-request": "Arranged directly",
    documented: "Documented, not yet available",
  };
  return (
    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
      {copy[action.availability]}
      {action.audience ? ` · ${action.audience}` : ""}
    </span>
  );
}
