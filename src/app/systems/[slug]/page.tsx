import Link from "@/components/Link";
import { notFound } from "next/navigation";
import CareerCard from "@/components/CareerCard";
import CtaLink, { AvailabilityNote } from "@/components/CtaLink";
import CtaPanel from "@/components/CtaPanel";
import { FamilyIcon, familyClass } from "@/components/FamilyMark";
import JsonLd from "@/components/JsonLd";
import OperatingStatusBadge, { StateGlyph, operatingStateStyles } from "@/components/OperatingStatusBadge";
import PageHero from "@/components/PageHero";
import RoadmapStatusBadge from "@/components/RoadmapStatusBadge";
import SectionHeading, { Section } from "@/components/SectionHeading";
import StoryCard from "@/components/StoryCard";
import { CapabilityBadge } from "@/components/MediaTypeBadge";
import { ArrowRight, ExternalArrow } from "@/components/icons";
import {
  capabilities,
  formatDate,
  getCapability,
  getFamily,
  getSystemBundle,
  getSystemName,
  relatedSystems,
  site,
  systems,
} from "@/content";
import type { Link as ContentLink, OperatingState } from "@/content/types";
import { breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ slug: string }> };

/** Open Graph image for a system, inherited from its strategic family. */
const FAMILY_OG: Record<string, string> = {
  "continuity-defense": "/og/family-continuity.png",
  "allocation-agent-intelligence": "/og/family-allocation.png",
  "capital-infrastructure": "/og/family-capital.png",
};

/**
 * Systems and supporting capabilities share this route. Grants and Rebalancing
 * were published as systems in Phase 1; keeping their paths here preserves
 * those destinations while presenting them accurately as capabilities.
 */
export function generateStaticParams() {
  return [
    ...systems.map((system) => ({ slug: system.slug })),
    ...capabilities.map((capability) => ({ slug: capability.slug })),
  ];
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const bundle = getSystemBundle(slug);
  if (bundle) {
    const { system } = bundle;
    return buildMetadata({
      title: system.name,
      description: `${system.summary} Operating state: ${system.status}.`,
      path: `/systems/${system.slug}`,
      ogImage: FAMILY_OG[system.family] ?? site.socialImage,
    });
  }

  const capability = getCapability(slug);
  if (capability) {
    return buildMetadata({
      title: `${capability.name} — supporting capability`,
      description: capability.summary,
      path: `/systems/${capability.slug}`,
      ogImage: "/og/systems.png",
    });
  }

  return buildMetadata({ title: "Not found", path: `/systems/${slug}` });
}

/**
 * One reusable system template, expressed differently by each family.
 *
 * The first screen has to answer, without scrolling: what this is, which family
 * it belongs to, what state it is in, who it is for, what you can use right
 * now, and what to do next. Everything after that is reusable modules, rendered
 * only where the record has something to put in them — an empty container is
 * worse than an absent one.
 */
export default async function SystemPage({ params }: Params) {
  const { slug } = await params;
  const bundle = getSystemBundle(slug);
  if (!bundle) {
    const capability = getCapability(slug);
    if (!capability) notFound();
    return <CapabilityPage slug={slug} />;
  }

  const { system, entries, careers, roadmap, capabilities: supporting } = bundle;
  const family = getFamily(system.family);
  const related = relatedSystems(system.slug);
  const stateStyle = operatingStateStyles[system.status];

  return (
    <div className={familyClass(system.family)}>
      <JsonLd
        data={breadcrumbLd([
          { name: "Systems", path: "/systems" },
          { name: system.name, path: `/systems/${system.slug}` },
        ])}
      />
      <PageHero
        eyebrow={family?.name ?? "System"}
        title={system.name}
        lead={system.summary}
        family={family}
        contentActions={{ primary: system.primaryAction, secondary: system.secondaryAction }}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <OperatingStatusBadge state={system.status} />
            {system.subdomain && (
              <span
                className="text-xs font-mono px-2 py-1 rounded"
                style={{
                  color: "var(--text-tertiary)",
                  backgroundColor: "var(--surface-2)",
                  border: "1px solid var(--border)",
                }}
              >
                {system.subdomain}
              </span>
            )}
            <AvailabilityNote action={system.primaryAction} />
          </div>
        }
        aside={
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <p className="eyebrow mb-3" style={{ color: "var(--text-tertiary)" }}>
              What you can use today
            </p>
            <ul className="space-y-2.5">
              {system.availableToday.map((item) => (
                <li
                  key={item}
                  className="text-xs leading-relaxed pl-4 relative"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "var(--family-accent)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p
              className="text-xs mt-4 pt-4 border-t"
              style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}
            >
              Intended for {system.audience.join(", ").toLowerCase()}.
            </p>
          </div>
        }
      />

      {/* ── Operating reality ────────────────────────────────────────────────
          Given the most prominent position after the hero, because the
          difference between an operating product and a demo is the single
          thing a reader most needs and is most often not told. */}
      <Section id="operating-reality" bordered={false}>
        <div
          className="evidence-panel p-6 md:p-8"
          style={{ borderLeftColor: stateStyle.color }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <p className="eyebrow" style={{ color: stateStyle.color }}>
              Current operating reality
            </p>
            <OperatingStatusBadge state={system.status} />
          </div>

          <p
            className="text-base md:text-lg leading-relaxed max-w-3xl mb-5"
            style={{ color: "var(--text-primary)" }}
          >
            {system.statusEvidence}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <span className="inline-flex items-center gap-1.5" style={{ color: "var(--text-tertiary)" }}>
              <StateGlyph state={system.status} size={7} />
              {stateStyle.meaning}
            </span>
            {system.verification.lastVerifiedAt && (
              <span style={{ color: "var(--text-tertiary)" }}>
                Last verified {formatDate(system.verification.lastVerifiedAt)}
              </span>
            )}
          </div>
        </div>
      </Section>

      <Section id="overview">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              The problem it addresses
            </h2>
            <p
              className="text-sm md:text-base leading-relaxed mb-10"
              style={{ color: "var(--text-secondary)" }}
            >
              {system.problem}
            </p>

            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              What it is
            </h2>
            <div className="space-y-4 mb-10">
              {system.overview.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <h2 id="capabilities" className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Capabilities available today
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {system.availableToday.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border p-4 text-xs leading-relaxed"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Who it is for
            </h2>
            <ul className="flex flex-wrap gap-2">
              {system.audience.map((audience) => (
                <li
                  key={audience}
                  className="px-3 py-1.5 rounded-full text-xs"
                  style={{
                    color: "var(--family-accent)",
                    backgroundColor: "var(--family-accent-dim)",
                    border: "1px solid color-mix(in srgb, var(--family-accent) 24%, transparent)",
                  }}
                >
                  {audience}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-1 space-y-4">
            <EvidencePanel
              evidence={system.evidence}
              documentationUrl={system.documentationUrl}
              operatingUrl={system.operatingUrl}
              subdomain={system.subdomain}
              status={system.status}
            />

            {supporting.length > 0 && (
              <div
                className="rounded-xl border p-5"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <p className="eyebrow mb-3" style={{ color: "var(--text-tertiary)" }}>
                  Supporting capabilities
                </p>
                <ul className="space-y-2">
                  {supporting.map((capability) => (
                    <li key={capability.slug}>
                      <Link
                        href={`/systems/${capability.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: "var(--family-accent)" }}
                      >
                        {capability.name}
                        <ArrowRight size={11} />
                      </Link>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                        Delivered through this system, not a system of its own.
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Section>

      {/* ── Related systems ──────────────────────────────────────────────── */}
      {related.length > 0 && (
        <Section id="related-systems" tone="raised">
          <SectionHeading
            eyebrow="In the network"
            title={`What ${system.shortName} connects to`}
            description="Each link is a relationship this record documents, not a suggestion."
            action={{ label: "See the whole network", href: "/#systems" }}
          />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map(({ system: other, reason, strength }) => {
              const otherFamily = getFamily(other.family);
              return (
                <li key={other.slug} className={familyClass(other.family)}>
                  <Link
                    href={`/systems/${other.slug}`}
                    data-cta={`related-system:${other.slug}`}
                    data-cta-type="system-entry"
                    className="surface-card family-card block h-full rounded-xl border p-5"
                  >
                    <span className="flex items-start justify-between gap-3 mb-2.5">
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                        style={{
                          color: "var(--family-accent)",
                          backgroundColor: "var(--family-accent-dim)",
                          border: "1px solid color-mix(in srgb, var(--family-accent) 26%, transparent)",
                        }}
                      >
                        <FamilyIcon motif={otherFamily?.motif ?? "signal"} size={16} />
                      </span>
                      <OperatingStatusBadge state={other.status} size="sm" />
                    </span>
                    <span
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {other.name}
                    </span>
                    <span
                      className="block text-xs leading-relaxed mb-3"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {reason}.
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {strength === "structural" ? "Structural link" : "Contextual link"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* ── Related publications ─────────────────────────────────────────── */}
      {entries.length > 0 && (
        <Section id="publications">
          <SectionHeading
            eyebrow="Newsroom"
            title="Published records"
            description={`Newsroom records referencing ${system.name}.`}
            action={{ label: "Newsroom", href: "/newsroom" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.slice(0, 3).map((entry) => (
              <StoryCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </Section>
      )}

      {/* ── Roadmap ──────────────────────────────────────────────────────── */}
      {roadmap.length > 0 && (
        <Section id="roadmap" tone="raised">
          <SectionHeading
            eyebrow="Roadmap"
            title="Milestones recorded against this system"
            action={{ label: "Full roadmap", href: "/roadmap" }}
          />
          <ol className="space-y-3">
            {roadmap.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border p-5"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </p>
                  <RoadmapStatusBadge state={item.state} horizon={item.horizon} />
                </div>
                <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
                  {item.summary}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  {item.evidence && (
                    <a
                      href={item.evidence.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1"
                      style={{ color: "var(--family-accent)" }}
                    >
                      {item.evidence.label}
                      <ExternalArrow size={10} />
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  )}
                  <span style={{ color: "var(--text-tertiary)" }}>
                    {item.updatedAt ? `Last updated ${formatDate(item.updatedAt)}` : "No dated update"}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* ── Roles ────────────────────────────────────────────────────────── */}
      {careers.length > 0 && (
        <Section id="roles">
          <SectionHeading
            eyebrow="Careers"
            title="Roles supporting this system"
            action={{ label: "Careers centre", href: "/careers" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {careers.map((career) => (
              <CareerCard key={career.slug} career={career} />
            ))}
          </div>
        </Section>
      )}

      {/* ── Final action ─────────────────────────────────────────────────── */}
      <Section id="next" tone="raised">
        <div
          className="rounded-xl border p-6 md:p-8"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            borderLeft: "2px solid var(--family-accent)",
          }}
        >
          <p className="eyebrow mb-2">Next</p>
          <h2 className="display text-xl md:text-2xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            {actionHeadline(system.status, system.name)}
          </h2>
          <p className="text-sm leading-relaxed max-w-2xl mb-6" style={{ color: "var(--text-secondary)" }}>
            {system.primaryAction.note ??
              `${system.name} is ${system.status.toLowerCase()}. ${stateStyle.meaning[0].toUpperCase()}${stateStyle.meaning.slice(1)}.`}
          </p>
          <div className="flex flex-wrap gap-3">
            <CtaLink action={system.primaryAction} variant="primary" />
            {system.secondaryAction && (
              <CtaLink action={system.secondaryAction} variant="secondary" />
            )}
            <Link
              href="/contact"
              data-cta={`system-contact:${system.slug}`}
              data-cta-type="contact"
              className="btn-secondary tap-target inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold"
            >
              Contact the network
            </Link>
          </div>
          <p className="text-xs mt-5" style={{ color: "var(--text-tertiary)" }}>
            {site.contactEmail} ·{" "}
            <Link href="/systems" style={{ color: "var(--family-accent)" }}>
              Back to the systems directory
            </Link>
          </p>
        </div>
      </Section>
    </div>
  );
}

/** Closing headline, phrased for the state rather than generically. */
function actionHeadline(status: OperatingState, name: string): string {
  switch (status) {
    case "Operating":
      return `${name} is operating today`;
    case "Public Test":
      return `${name} is open to inspect in public test`;
    case "In Development":
      return `${name} is being built`;
    case "Research Horizon":
      return `${name} is a documented research direction`;
  }
}

/**
 * Evidence gets its own panel rather than a footnote. A reader should be able
 * to check a claim before deciding whether to believe the rest of the page.
 */
function EvidencePanel({
  evidence,
  documentationUrl,
  operatingUrl,
  subdomain,
  status,
}: {
  evidence: ContentLink[];
  documentationUrl?: string;
  operatingUrl?: string;
  subdomain?: string;
  status: OperatingState;
}) {
  return (
    <div id="evidence" className="evidence-panel p-5">
      <p className="eyebrow mb-4">Evidence and access</p>

      <dl className="space-y-4 text-xs">
        <div>
          <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
            {status === "Operating" ? "Live destination" : "Public surface"}
          </dt>
          <dd>
            {operatingUrl ? (
              <a
                href={operatingUrl}
                target="_blank"
                rel="noopener noreferrer"
                /* An operating system's destination is the product; anything
                   else is a surface to inspect, and must not be tagged as
                   though a product were being opened. */
                data-cta-type={status === "Operating" ? "open-product" : "evidence"}
                className="inline-flex items-center gap-1 font-mono break-all"
                style={{ color: "var(--family-accent)" }}
              >
                {subdomain ?? operatingUrl}
                <ExternalArrow size={10} />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            ) : (
              <span style={{ color: "var(--text-secondary)" }}>
                None published — arranged directly
              </span>
            )}
          </dd>
        </div>

        <div>
          <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
            Documentation
          </dt>
          <dd>
            {documentationUrl ? (
              <a
                href={documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cta-type="documentation"
                className="inline-flex items-center gap-1"
                style={{ color: "var(--family-accent)" }}
              >
                Read the documentation
                <ExternalArrow size={10} />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            ) : (
              <span style={{ color: "var(--text-secondary)" }}>Not published</span>
            )}
          </dd>
        </div>

        <div>
          <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
            Supporting evidence
          </dt>
          <dd>
            {evidence.length > 0 ? (
              <ul className="space-y-2">
                {evidence.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      data-cta-type="evidence"
                      className="inline-flex items-start gap-1"
                      style={{ color: "var(--family-accent)" }}
                    >
                      {link.label}
                      {link.external && (
                        <>
                          <ExternalArrow size={10} />
                          <span className="visually-hidden"> (opens in a new tab)</span>
                        </>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span style={{ color: "var(--text-secondary)" }}>None recorded</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/** Supporting-capability treatment, served from the same route. */
function CapabilityPage({ slug }: { slug: string }) {
  const capability = getCapability(slug);
  if (!capability) notFound();
  const archived = capability.publicationState === "archived";

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Systems", path: "/systems" },
          { name: capability.name, path: `/systems/${capability.slug}` },
        ])}
      />
      <PageHero
        eyebrow={archived ? "Archived capability" : "Supporting capability"}
        title={capability.name}
        lead={capability.summary}
        contentActions={
          capability.primaryAction ? { primary: capability.primaryAction } : undefined
        }
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <CapabilityBadge archived={archived} />
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {archived
                ? "Not currently offered — kept on the record"
                : "Not a system — delivered through the systems below"}
            </span>
          </div>
        }
      />

      <Section bordered={false}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {capability.overview.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {paragraph}
              </p>
            ))}
            <h2 className="text-lg font-semibold pt-6" style={{ color: "var(--text-primary)" }}>
              {archived ? "Availability" : "How to access it"}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {capability.accessPath}
            </p>
          </div>

          <aside className="evidence-panel p-5 h-fit">
            <p className="eyebrow mb-4">Record</p>
            <dl className="space-y-4 text-xs">
              <div>
                <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                  Delivered through
                </dt>
                <dd>
                  <ul className="space-y-1.5">
                    {capability.deliveredBy.map((systemSlug) => (
                      <li key={systemSlug}>
                        <Link href={`/systems/${systemSlug}`} style={{ color: "var(--gold)" }}>
                          {getSystemName(systemSlug) ?? systemSlug}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                  Intended audience
                </dt>
                <dd style={{ color: "var(--text-secondary)" }}>{capability.audience.join(", ")}</dd>
              </div>
              <div>
                <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                  Evidence
                </dt>
                <dd>
                  {capability.evidence.length > 0 ? (
                    <ul className="space-y-1.5">
                      {capability.evidence.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-start gap-1"
                            style={{ color: "var(--gold)" }}
                          >
                            {link.label}
                            <ExternalArrow size={10} />
                            <span className="visually-hidden"> (opens in a new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: "var(--text-secondary)" }}>None recorded</span>
                  )}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      <Section tone="raised">
        <CtaPanel
          eyebrow="Next"
          title={`Looking for ${capability.name}?`}
          description="Capabilities are arranged through the systems that deliver them, or directly by email."
          actions={[
            {
              label: "Systems directory",
              href: "/systems#directory",
              cta: `capability-directory:${capability.slug}`,
              ctaType: "system-entry",
            },
            {
              label: "Contact",
              href: "/contact",
              variant: "secondary",
              cta: `capability-contact:${capability.slug}`,
              ctaType: "contact",
            },
          ]}
        />
      </Section>
    </>
  );
}
