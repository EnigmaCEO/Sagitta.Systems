import Link from "@/components/Link";
import { ArrowRight } from "./icons";

export interface CtaAction {
  label: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "secondary";
  /** Stable analytics identifier, emitted as `data-cta`. */
  cta?: string;
  ctaType?: string;
}

/** Bordered call-to-action panel used to close sections and detail pages. */
export default function CtaPanel({
  eyebrow,
  title,
  description,
  actions,
  note,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions: CtaAction[];
  note?: string;
}) {
  return (
    <div
      className="relative rounded-xl border p-6 md:p-8 overflow-hidden"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        borderLeft: "2px solid var(--family-accent)",
      }}
    >
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
      {description && (
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
      )}
      <div className="flex flex-wrap gap-3 mt-6">
        {actions.map((action) => {
          const attrs = {
            className:
              action.variant === "secondary"
                ? "btn-secondary tap-target inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold"
                : "btn-primary tap-target inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold",
            ...(action.cta ? { "data-cta": action.cta } : {}),
            ...(action.ctaType ? { "data-cta-type": action.ctaType } : {}),
          };
          return action.external ? (
            <a
              key={action.label}
              {...attrs}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {action.label}
              <ArrowRight size={12} />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          ) : (
            <Link key={action.label} {...attrs} href={action.href}>
              {action.label}
              <ArrowRight size={12} />
            </Link>
          );
        })}
      </div>
      {note && (
        <p className="text-xs mt-4" style={{ color: "var(--text-tertiary)" }}>
          {note}
        </p>
      )}
    </div>
  );
}
