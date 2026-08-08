import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import StoryCard from "@/components/StoryCard";
import { publishedEntries } from "@/content";
import { breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Defense Mini-Reviews",
  description:
    "Compact Sagitta Defense evidence records covering CVE reachability, exploitability, authority, and continuity posture.",
  path: "/defense/reviews",
  ogImage: "/og/family-continuity.png",
});

export default function DefenseReviewsPage() {
  const reviews = publishedEntries.filter((entry) =>
    entry.canonicalPath?.startsWith("/defense/reviews/"),
  );

  return (
    <div className="family-continuity-defense">
      <JsonLd
        data={breadcrumbLd([
          { name: "Defense", path: "/defense" },
          { name: "Mini-Reviews", path: "/defense/reviews" },
        ])}
      />
      <PageHero
        eyebrow="Defense · Evidence"
        title="Mini-Reviews"
        lead="CVE-specific records that separate version exposure, mechanism presence, technical reachability, economic exploitability, protocol authority, and continuity response."
      />
      <Section bordered={false}>
        <SectionHeading
          eyebrow="Published evidence"
          title="Defense Mini-Reviews"
          description="Each review is canonical to this evidence surface and indexed by the Sagitta Systems Newsroom."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reviews.map((entry) => (
            <StoryCard key={entry.slug} entry={entry} variant="feature" />
          ))}
        </div>
      </Section>
    </div>
  );
}
