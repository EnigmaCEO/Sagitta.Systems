import Link from "@/components/Link";
import type { ContentAction } from "@/content/types";
import { ArrowRight, ExternalArrow } from "./icons";

/**
 * The front page's one action treatment.
 *
 * Every stage on the homepage used to end in the same filled gold button, which
 * is what made six different mediums read as six copies of one section. Here
 * gold is an illuminated rule under a precise label instead — the accent still
 * points at the action, but it stops being a repeated component.
 *
 * The analytics contract is unchanged: the same `data-cta` id, type, and
 * availability that CtaLink emits, so a promotion's action is measured the same
 * way wherever it is staged.
 */
export default function PromoAction({
  action,
  className = "",
  showNote = false,
}: {
  action: ContentAction;
  className?: string;
  /** Renders the action's qualifier beneath it. */
  showNote?: boolean;
}) {
  const shared = {
    className: `action-line tap-target ${className}`.trim(),
    "data-cta": action.id,
    "data-cta-type": action.type,
    "data-cta-availability": action.availability,
    ...(action.audience ? { "data-cta-audience": action.audience } : {}),
  };

  const link = action.external ? (
    <a {...shared} href={action.href} target="_blank" rel="noopener noreferrer">
      {action.label}
      <ExternalArrow size={12} />
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link {...shared} href={action.href}>
      {action.label}
      <ArrowRight size={13} />
    </Link>
  );

  if (!showNote || !action.note) return link;

  return (
    <span className="flex flex-col items-start gap-2">
      {link}
      <span className="text-xs leading-relaxed measure" style={{ color: "var(--text-tertiary)" }}>
        {action.note}
      </span>
    </span>
  );
}
