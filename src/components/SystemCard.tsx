import Link from "@/components/Link";
import { getFamily } from "@/content/systems";
import type { SystemRecord } from "@/content/types";
import CtaLink from "./CtaLink";
import { FamilyIcon, familyClass } from "./FamilyMark";
import OperatingStatusBadge from "./OperatingStatusBadge";
import { ArrowRight } from "./icons";

/**
 * Directory card for a system.
 *
 * The card has to answer four things at a glance: which family it belongs to,
 * what state it is in, what it does, and what you can do about it right now.
 * The last of those comes from the record's own `primaryAction`, so an
 * in-development system never offers to open a product that does not exist.
 */
export default function SystemCard({
  system,
  compact = false,
}: {
  system: SystemRecord;
  compact?: boolean;
}) {
  const family = getFamily(system.family);

  return (
    <article
      data-testid="system-card"
      data-slug={system.slug}
      data-family={system.family}
      data-status={system.status}
      className={`${familyClass(system.family)} surface-card family-card flex flex-col h-full rounded-xl border p-5`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
          style={{
            color: "var(--family-accent)",
            backgroundColor: "var(--family-accent-dim)",
            border: "1px solid color-mix(in srgb, var(--family-accent) 28%, transparent)",
          }}
        >
          <FamilyIcon motif={family?.motif ?? "signal"} size={19} />
        </span>
        <OperatingStatusBadge state={system.status} size="sm" />
      </div>

      <h3 className="text-sm font-semibold mb-1.5 leading-snug">
        <Link
          href={`/systems/${system.slug}`}
          data-cta={`system-card:${system.slug}`}
          data-cta-type="system-entry"
          className="transition-opacity duration-150 hover:opacity-80"
          style={{ color: "var(--text-primary)" }}
        >
          {system.name}
        </Link>
      </h3>

      {family && (
        <p className="text-xs mb-2.5" style={{ color: "var(--family-accent)" }}>
          {family.name}
        </p>
      )}

      <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: "var(--text-secondary)" }}>
        {system.summary}
      </p>

      {system.subdomain && !compact && (
        <p
          className="text-xs font-mono mb-4 truncate"
          style={{ color: "var(--text-tertiary)" }}
          title={system.subdomain}
        >
          {system.subdomain}
        </p>
      )}

      {/* Two discrete links rather than one stretched card link: the card
          offers both the record and the system's own action, and a stretched
          link would swallow the second. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto">
        <Link
          href={`/systems/${system.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity duration-150 hover:opacity-80"
          style={{ color: "var(--family-accent)" }}
        >
          System record
          <ArrowRight size={12} />
        </Link>
        <CtaLink action={system.primaryAction} variant="inline" className="opacity-90" />
      </div>
    </article>
  );
}
