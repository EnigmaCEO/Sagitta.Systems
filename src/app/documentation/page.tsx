import Link from "@/components/Link";
import CtaPanel from "@/components/CtaPanel";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import { ExternalArrow } from "@/components/icons";
import { proofResources, site, systems } from "@/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Documentation",
  description:
    "Where the documentation for each Sagitta system lives: the whitepaper, AAA methodology and decision records, the x402 discovery document, and the architecture diagram.",
  path: "/documentation",
  ogImage: "/og/systems.png",
});

export default function DocumentationPage() {
  return (
    <>
      <PageHero
        eyebrow="Documentation"
        title="Documents and system references"
        lead="This page routes to documentation rather than duplicating it. Where a system has no published documentation, that is stated plainly."
      />

      <Section bordered={false} id="network-documents">
        <SectionHeading
          eyebrow="Network"
          title="Network documents"
          description="Documents describing the architecture and posture of the network as a whole."
        />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {proofResources.map((resource) => (
            <li key={resource.href}>
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card flex flex-col h-full rounded-xl border p-5 transition-all duration-200"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  {resource.label}
                </p>
                <p
                  className="text-xs leading-relaxed flex-1 mb-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {resource.summary}
                </p>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: "var(--family-accent)" }}
                >
                  Open
                  <ExternalArrow />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="system-documentation">
        <SectionHeading
          eyebrow="Systems"
          title="Documentation by system"
          description="Documentation URLs recorded against each system in the directory."
          action={{ label: "Systems directory", href: "/systems" }}
        />
        <div
          className="rounded-xl border overflow-x-auto"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <table className="w-full text-xs" style={{ minWidth: 560 }}>
            <caption className="sr-only">Documentation status for each Sagitta system</caption>
            <thead>
              <tr style={{ color: "var(--text-tertiary)" }}>
                <th scope="col" className="text-left font-medium px-5 py-3">
                  System
                </th>
                <th scope="col" className="text-left font-medium px-5 py-3">
                  Operating state
                </th>
                <th scope="col" className="text-left font-medium px-5 py-3">
                  Documentation
                </th>
              </tr>
            </thead>
            <tbody>
              {systems.map((system) => (
                <tr key={system.slug} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <th scope="row" className="text-left font-medium px-5 py-3">
                    <Link href={`/systems/${system.slug}`} style={{ color: "var(--family-accent)" }}>
                      {system.name}
                    </Link>
                  </th>
                  <td className="px-5 py-3" style={{ color: "var(--text-secondary)" }}>
                    {system.status}
                  </td>
                  <td className="px-5 py-3">
                    {system.documentationUrl ? (
                      <a
                        href={system.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                        style={{ color: "var(--family-accent)" }}
                      >
                        Open documentation
                        <ExternalArrow />
                      </a>
                    ) : (
                      <span style={{ color: "var(--text-tertiary)" }}>Not published</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <CtaPanel
          eyebrow="Missing something?"
          title="Documentation gaps"
          description="Several systems have no published documentation yet. If you need a reference that is not listed here, contact the network directly."
          actions={[
            { label: "Contact", href: "/contact" },
            { label: "Press room", href: "/press", variant: "secondary" },
          ]}
          note={site.contactEmail}
        />
      </Section>
    </>
  );
}
