import Link from "@/components/Link";
import { getSystemName } from "@/content/systems";
import type { CapabilityRecord } from "@/content/types";
import { CapabilityBadge } from "./MediaTypeBadge";
import { ExternalArrow } from "./icons";

/**
 * A supporting capability. Visually differentiated from a system card: no
 * operating-status badge, no system count, no "system record" affordance.
 */
export default function CapabilityCard({ capability }: { capability: CapabilityRecord }) {
  return (
    <article
      className="flex flex-col h-full rounded-xl border p-5"
      style={{
        backgroundColor: "transparent",
        borderColor: "var(--border)",
        borderStyle: "dashed",
      }}
    >
      <div className="mb-3">
        <CapabilityBadge />
      </div>

      <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        {capability.name}
      </h3>

      <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        {capability.summary}
      </p>

      <dl className="text-xs space-y-2 mb-4">
        <div>
          <dt className="mb-1" style={{ color: "var(--text-tertiary)" }}>
            Delivered through
          </dt>
          <dd className="flex flex-wrap gap-x-2 gap-y-1">
            {capability.deliveredBy.map((slug) => (
              <Link
                key={slug}
                href={`/systems/${slug}`}
                className="transition-opacity duration-150 hover:opacity-80"
                style={{ color: "var(--family-accent)" }}
              >
                {getSystemName(slug) ?? slug}
              </Link>
            ))}
          </dd>
        </div>
        <div>
          <dt className="mb-1" style={{ color: "var(--text-tertiary)" }}>
            How to access
          </dt>
          <dd style={{ color: "var(--text-secondary)" }}>{capability.accessPath}</dd>
        </div>
      </dl>

      {capability.evidence.length > 0 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-auto">
          {capability.evidence.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium transition-opacity duration-150 hover:opacity-80"
                style={{ color: "var(--text-tertiary)" }}
              >
                {link.label}
                <ExternalArrow />
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
