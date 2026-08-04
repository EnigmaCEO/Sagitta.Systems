import Link from "@/components/Link";
import OperatingStatusBadge, { OperatingStatusLegend } from "@/components/OperatingStatusBadge";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import { ExternalArrow } from "@/components/icons";
import { formatDate, publicCapabilities, systemFamilies, systemsByFamily } from "@/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Status",
  description:
    "The recorded operating state of every Sagitta system, with links to each operating surface.",
  path: "/status",
  ogImage: "/og/systems.png",
});

export default function StatusPage() {
  return (
    <>
      <PageHero
        eyebrow="Status"
        title="Operating state of the network"
        lead="The recorded operating state of each system, with the evidence for it. Every state below was checked against the system's public surface on the date shown. This is not an automated uptime monitor — no live availability, incident, or latency data is claimed."
      >
        <OperatingStatusLegend />
      </PageHero>

      {systemFamilies
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((family) => (
          <Section key={family.id} id={family.id}>
            <SectionHeading eyebrow="Family" title={family.name} />
            <ul className="space-y-2">
              {systemsByFamily(family.id).map((system) => (
                <li
                  key={system.slug}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-4"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      <Link href={`/systems/${system.slug}`} style={{ color: "var(--text-primary)" }}>
                        {system.name}
                      </Link>
                    </p>
                    {system.subdomain ? (
                      <p className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>
                        {system.subdomain}
                      </p>
                    ) : (
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        No public surface
                      </p>
                    )}
                    <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                      {system.statusEvidence}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                      Last verified {formatDate(system.verification.lastVerifiedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <OperatingStatusBadge state={system.status} />
                    {system.operatingUrl && (
                      <a
                        href={system.operatingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold"
                        style={{ color: "var(--family-accent)" }}
                      >
                        Open
                        <ExternalArrow />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        ))}

      <Section id="supporting-capabilities">
        <SectionHeading
          eyebrow="Not systems"
          title="Supporting capabilities"
          description="Delivered through the systems above. They carry no operating state of their own, so none is reported here."
        />
        <ul className="space-y-2">
          {publicCapabilities.map((capability) => (
            <li
              key={capability.slug}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-4"
              style={{ borderColor: "var(--border)", borderStyle: "dashed" }}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  <Link href={`/systems/${capability.slug}`} style={{ color: "var(--text-primary)" }}>
                    {capability.name}
                  </Link>
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  {capability.accessPath}
                </p>
              </div>
              <span className="text-xs shrink-0" style={{ color: "var(--text-tertiary)" }}>
                Delivered through{" "}
                {capability.deliveredBy.length} {capability.deliveredBy.length === 1 ? "system" : "systems"}
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
