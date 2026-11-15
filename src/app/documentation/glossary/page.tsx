import Link from "@/components/Link";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import { ExternalArrow } from "@/components/icons";
import { getGlossaryEntry, glossary, glossaryByGroup, glossaryGroups } from "@/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Glossary",
  description:
    "The vocabulary used across Sagitta systems, from continuity defense and decision records to policy envelopes and x402, each with a link to where it is published.",
  path: "/documentation/glossary",
  ogImage: "/og/systems.png",
});

export default function GlossaryPage() {
  return (
    <>
      <PageHero
        eyebrow="Documentation"
        title="Glossary"
        lead={`The ${glossary.length} terms used across the network, in one place. Each definition is taken from text Sagitta has already published, and links to where it appears. A term with no published definition is not defined here.`}
      >
        <nav aria-label="Glossary groups">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {glossaryGroups.map((group) => (
              <li key={group.id}>
                <a href={`#group-${group.id}`} style={{ color: "var(--family-accent)" }}>
                  {group.name}
                </a>
              </li>
            ))}
            <li>
              <Link href="/documentation" style={{ color: "var(--text-secondary)" }}>
                All documentation
              </Link>
            </li>
          </ul>
        </nav>
      </PageHero>

      {glossaryGroups.map((group, index) => (
        <Section key={group.id} id={`group-${group.id}`} bordered={index > 0}>
          <SectionHeading eyebrow="Glossary" title={group.name} />
          <dl className="space-y-3">
            {glossaryByGroup(group.id).map((entry) => (
              <div
                key={entry.slug}
                id={entry.slug}
                className="rounded-lg border p-4 scroll-mt-24"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <dt className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  <a href={`#${entry.slug}`} style={{ color: "var(--text-primary)" }}>
                    {entry.term}
                  </a>
                </dt>
                <dd className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {entry.definition}
                </dd>
                <dd className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span style={{ color: "var(--text-tertiary)" }}>
                    Source:{" "}
                    {entry.source.external ? (
                      <a
                        href={entry.source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                        style={{ color: "var(--family-accent)" }}
                      >
                        {entry.source.label}
                        <ExternalArrow />
                      </a>
                    ) : (
                      <Link href={entry.source.href} style={{ color: "var(--family-accent)" }}>
                        {entry.source.label}
                      </Link>
                    )}
                  </span>
                  {entry.related && entry.related.length > 0 ? (
                    <span style={{ color: "var(--text-tertiary)" }}>
                      Related:{" "}
                      {entry.related.map((slug, i) => {
                        const related = getGlossaryEntry(slug);
                        if (!related) return null;
                        return (
                          <span key={slug}>
                            {i > 0 ? ", " : null}
                            <a href={`#${slug}`} style={{ color: "var(--text-secondary)" }}>
                              {related.term}
                            </a>
                          </span>
                        );
                      })}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      ))}
    </>
  );
}
