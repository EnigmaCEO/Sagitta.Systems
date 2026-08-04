import Link from "@/components/Link";
import { getSystem, getSystemName } from "@/content/systems";
import type { CareerRecord, CareerStatus } from "@/content/types";
import { familyClass } from "./FamilyMark";
import { MetaBadge } from "./MediaTypeBadge";
import { ArrowRight } from "./icons";

/**
 * Role card.
 *
 * The four divisions are visually distinct because they mean different things:
 * an Open role can be applied to today and carries published terms, the
 * contributor network is rolling engagement, a future workstream is not an
 * open application, and an archived role is on the record rather than on offer.
 * A card that looked the same in all four states would flatten that away.
 */
const STATUS_TREATMENT: Record<
  CareerStatus,
  { border: string; accent: string; label: string; solid: boolean; muted: boolean }
> = {
  Open: {
    border: "var(--gold)",
    accent: "var(--gold)",
    label: "Open now",
    solid: true,
    muted: false,
  },
  Contributor: {
    border: "var(--border-strong)",
    accent: "var(--family-accent)",
    label: "Contributor network",
    solid: true,
    muted: false,
  },
  Future: {
    border: "var(--border)",
    accent: "var(--text-tertiary)",
    label: "Future workstream — not open",
    solid: false,
    muted: false,
  },
  Archived: {
    border: "var(--border)",
    accent: "var(--text-tertiary)",
    label: "Archived",
    solid: false,
    muted: true,
  },
};

export default function CareerCard({ career }: { career: CareerRecord }) {
  const systemName = getSystemName(career.systemSlug);
  const family = career.systemSlug ? getSystem(career.systemSlug)?.family : undefined;
  const treatment = STATUS_TREATMENT[career.status];
  const compensationPublished = !career.compensation.startsWith("Not yet");
  const deliverablePublished = !career.firstDeliverable.startsWith("Not yet");

  return (
    <article
      data-testid="career-card"
      data-status={career.status}
      className={`${familyClass(family)} flex flex-col h-full rounded-xl border p-5 ${
        treatment.solid ? "surface-card" : ""
      }`}
      style={{
        backgroundColor: treatment.solid ? "var(--surface)" : "transparent",
        borderColor: treatment.border,
        borderStyle: treatment.solid ? "solid" : "dashed",
        opacity: treatment.muted ? 0.7 : 1,
      }}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium"
          style={{
            color: treatment.accent,
            border: `1px solid color-mix(in srgb, ${treatment.accent} 30%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${treatment.accent} 8%, transparent)`,
          }}
        >
          {career.status === "Open" && (
            <span
              aria-hidden="true"
              className="inline-block w-1.5 h-1.5 rounded-full motion-pulse"
              style={{ backgroundColor: treatment.accent }}
            />
          )}
          {treatment.label}
        </span>
        <MetaBadge tone="quiet">{career.engagement}</MetaBadge>
      </div>

      <h3 className="text-sm font-semibold mb-2 leading-snug">
        <Link
          href={`/careers/${career.slug}`}
          data-cta={`career:${career.slug}`}
          data-cta-type="career"
          className="transition-opacity duration-150 hover:opacity-80"
          style={{ color: "var(--text-primary)" }}
        >
          {career.title}
        </Link>
      </h3>

      <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: "var(--text-secondary)" }}>
        {career.immediateResponsibility}
      </p>

      <dl className="text-xs space-y-2 mb-4">
        <div className="flex gap-2">
          <dt className="shrink-0" style={{ color: "var(--text-tertiary)" }}>
            Compensation
          </dt>
          <dd
            className="font-medium"
            style={{ color: compensationPublished ? treatment.accent : "var(--text-tertiary)" }}
          >
            {compensationPublished ? career.compensation : "Not yet published"}
          </dd>
        </div>
        {deliverablePublished && (
          <div className="flex gap-2">
            <dt className="shrink-0" style={{ color: "var(--text-tertiary)" }}>
              First deliverable
            </dt>
            <dd style={{ color: "var(--text-secondary)" }}>{career.firstDeliverable}</dd>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <dt className="visually-hidden">Location</dt>
          <dd style={{ color: "var(--text-tertiary)" }}>{career.location}</dd>
          {systemName && (
            <>
              <span aria-hidden="true" style={{ color: "var(--text-tertiary)" }}>
                ·
              </span>
              <dt className="visually-hidden">Supporting system</dt>
              <dd>
                <Link
                  href={`/systems/${career.systemSlug}`}
                  className="transition-opacity duration-150 hover:opacity-80"
                  style={{ color: "var(--family-accent)" }}
                >
                  {systemName}
                </Link>
              </dd>
            </>
          )}
        </div>
      </dl>

      <Link
        href={`/careers/${career.slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto transition-opacity duration-150 hover:opacity-80"
        style={{ color: treatment.muted ? "var(--text-tertiary)" : treatment.accent }}
      >
        {career.status === "Open"
          ? "Role details and how to apply"
          : career.status === "Archived"
            ? "View archived role"
            : "Role details"}
        <ArrowRight size={12} />
      </Link>
    </article>
  );
}
