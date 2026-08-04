import Link from "@/components/Link";
import type { SystemFamilyId } from "@/content/types";
import { familyClass } from "./FamilyMark";
import { ArrowRight } from "./icons";

/** Section opener used by every institutional section on the site. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  id,
  size = "md",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  id?: string;
  /** `lg` is the page-defining section; `md` is everything else. */
  size?: "md" | "lg";
}) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
        <h2
          id={id}
          className={`display font-semibold mb-2 ${size === "lg" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="tap-target inline-flex items-center gap-1.5 text-xs font-semibold shrink-0 transition-opacity duration-150 hover:opacity-80"
          style={{ color: "var(--family-accent)" }}
        >
          {action.label}
          <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

/**
 * Full-width section wrapper with consistent rhythm.
 *
 * `family` scopes the section to a strategic family, which is all any component
 * inside needs in order to pick up that family's accent.
 */
export function Section({
  id,
  children,
  bordered = true,
  family,
  tone = "base",
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  bordered?: boolean;
  family?: SystemFamilyId;
  /** `raised` lifts a section off the page to break a long vertical run. */
  tone?: "base" | "raised";
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative ${bordered ? "section-rule" : ""} ${familyClass(family)} ${className}`.trim()}
      style={tone === "raised" ? { backgroundColor: "var(--bg-raised)" } : undefined}
    >
      <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-16">{children}</div>
    </section>
  );
}
