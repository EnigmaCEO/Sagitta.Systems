import Link from "@/components/Link";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import StoryCard from "@/components/StoryCard";
import { publishedEntries } from "@/content";
import { breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Defense",
  description:
    "The Sagitta Defense evidence surface: protocol authority analysis, continuity findings, and CVE mini-reviews.",
  path: "/defense",
  ogImage: "/og/family-continuity.png",
});

export default function DefensePage() {
  const reviews = publishedEntries.filter((entry) => entry.desk === "defense-review");

  return (
    <div className="family-continuity-defense">
      <JsonLd data={breadcrumbLd([{ name: "Defense", path: "/defense" }])} />
      <PageHero
        eyebrow="Continuity / Defense"
        title="Defense"
        lead="Evidence records for how protocol vulnerabilities intersect with deployed architecture, operator authority, and continuity response."
        actions={[
          {
            label: "Browse mini-reviews",
            href: "/defense/reviews",
            cta: "defense:reviews",
            ctaType: "research",
          },
          {
            label: "Open Sagitta Defense",
            href: "https://defense.sagitta.systems",
            external: true,
            cta: "defense:service",
            ctaType: "defense-review",
          },
        ]}
      />

      <Section bordered={false}>
        <SectionHeading
          eyebrow="Evidence surface"
          title="Defense reviews"
          description="Findings that move from global vulnerability intelligence to local protocol reachability, authority, response, and restoration."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reviews.map((entry) => (
            <StoryCard key={entry.slug} entry={entry} variant="feature" />
          ))}
        </div>
      </Section>

      <Section tone="raised">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Newsroom publication and Defense evidence are connected: the Newsroom indexes each
          review, while the stable Defense route remains the record readers cite.{" "}
          <Link href="/newsroom" style={{ color: "var(--family-accent)" }}>
            Open the Newsroom
          </Link>
          .
        </p>
      </Section>
    </div>
  );
}
