import Link from "@/components/Link";
import EcosystemFlow from "@/components/EcosystemFlow";
import { FamilyIcon, familyClass } from "@/components/FamilyMark";
import { OperatingStatusLegend, operatingStateStyles } from "@/components/OperatingStatusBadge";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import SystemCard from "@/components/SystemCard";
import SystemConstellation from "@/components/SystemConstellation";
import SystemTicker from "@/components/SystemTicker";
import SystemDirectory, {
  type DirectoryFamily,
  type DirectoryItem,
} from "@/components/SystemDirectory";
import {
  ecosystemThesis,
  publicSystems,
  systemCount,
  systemEdges,
  systemFamilies,
  systemsByFamily,
} from "@/content";
import type { OperatingState } from "@/content/types";
import { constellationData } from "@/lib/constellation";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Systems",
  description: `The ${systemCount} systems of the Sagitta network, across continuity and defense, allocation and agent intelligence, and capital infrastructure — each with its operating state and the evidence behind it.`,
  path: "/systems",
  ogImage: "/og/systems.png",
});

/** Family accents, resolved here so the client filter can render swatches. */
const FAMILY_COLORS: Record<string, string> = {
  "continuity-defense": "#4ec8d8",
  "allocation-agent-intelligence": "#a78bfa",
  "capital-infrastructure": "#d9b168",
};

const STATE_COLORS: Record<OperatingState, string> = {
  Operating: "#35d39a",
  "Public Test": "#4ec8d8",
  "In Development": "#a78bfa",
  "Research Horizon": "#8095ad",
};

export default function SystemsPage() {
  const orderedFamilies = [...systemFamilies].sort((a, b) => a.order - b.order);

  const items: DirectoryItem[] = publicSystems.map((system) => ({
    slug: system.slug,
    family: system.family,
    status: system.status,
    /* Keyed at the point of creation. `SystemDirectory` renders these under
       its own keyed wrappers, but React validates keys where an element is
       built inside a `.map()` callback, not where it is finally rendered. */
    card: <SystemCard key={system.slug} system={system} />,
  }));

  const families: DirectoryFamily[] = orderedFamilies.map((family) => ({
    id: family.id,
    name: family.name,
    summary: family.summary,
    color: FAMILY_COLORS[family.id],
    header: (
      <div key={family.id} className={`${familyClass(family.id)} mb-6`}>
        <div className="flex items-center gap-3 mb-2">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
            style={{
              color: "var(--family-accent)",
              backgroundColor: "var(--family-accent-dim)",
              border: "1px solid color-mix(in srgb, var(--family-accent) 28%, transparent)",
            }}
          >
            <FamilyIcon motif={family.motif} size={18} />
          </span>
          <div>
            <p className="eyebrow" style={{ color: "var(--family-accent)" }}>
              Family {family.order} of {systemFamilies.length}
            </p>
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              {family.name}
            </h2>
          </div>
        </div>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          {family.summary}
        </p>
      </div>
    ),
  }));

  return (
    <>
      <PageHero
        eyebrow="Directory"
        title="The systems of the Sagitta network"
        lead={`${systemCount} systems across three strategic families, each standing on its own in the market and each contributing a capability the Sagitta Protocol ecosystem needs. Every record states what the system is, what problem it addresses, what you can use today, and what evidence supports its operating state.`}
        aside={
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <p className="eyebrow mb-4" style={{ color: "var(--text-tertiary)" }}>
              The network thesis
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
              The three families are one argument at three layers. Continuity and Defense keeps a
              protocol alive. Allocation and Agent Intelligence decides what it does. Capital
              Infrastructure holds and moves what it decides on.
            </p>
            {/* The families say how each system reaches its market. This says
                what the network is for, and links to the section that draws
                it — the aside states the claim, it does not explain it. */}
            <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-primary)" }}>
              {ecosystemThesis.short}
            </p>
            <Link
              href="#ecosystem"
              className="inline-block text-xs font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              How each system contributes →
            </Link>
            <ul className="space-y-2">
              {orderedFamilies.map((family) => (
                <li key={family.id} className={familyClass(family.id)}>
                  <Link
                    href={`#${family.id}`}
                    className="inline-flex items-center gap-2 text-xs font-medium"
                    style={{ color: "var(--family-accent)" }}
                  >
                    <FamilyIcon motif={family.motif} size={13} />
                    {family.name}
                    <span style={{ color: "var(--text-tertiary)" }}>
                      {systemsByFamily(family.id).length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <div>
          <p className="eyebrow mb-4" style={{ color: "var(--text-tertiary)" }}>
            How to read an operating state
          </p>
          <OperatingStatusLegend />
        </div>
      </PageHero>

      {/* Promotion, not inventory. The hero states the count in words; this
          shows it before the constellation starts explaining relationships. */}
      <SystemTicker />

      {/* Purpose before architecture. This section says why the network exists;
          the constellation below says how it is wired. They are two views of
          the same eight records and neither is a restatement of the other —
          the note under the figure says so in the page's own words. */}
      <Section id="ecosystem" bordered={false}>
        <SectionHeading
          eyebrow="The ecosystem"
          title="What each system contributes"
          description={ecosystemThesis.dualView}
          size="lg"
        />
        <EcosystemFlow />
      </Section>

      {/* The constellation is the portfolio's own picture of itself, and it
          belongs to the route that owns the portfolio explanation. The homepage
          promotes single stories; it does not display the inventory. */}
      <Section id="network">
        <SectionHeading
          eyebrow="The network"
          title="How the systems connect"
          description={`${systemEdges.length} documented relationships across the portfolio. Every node opens its system record, and every relationship is stated in words as well as drawn.`}
          size="lg"
        />
        <SystemConstellation data={constellationData()} />
      </Section>

      <Section id="directory">
        <SectionHeading
          eyebrow="Directory"
          title={`All ${systemCount} systems`}
          description="Filter by strategic family or operating state. Counts reflect the systems each combination actually returns."
          size="lg"
        />
        <SystemDirectory
          items={items}
          families={families}
          states={Object.keys(operatingStateStyles) as OperatingState[]}
          stateColors={STATE_COLORS}
        />
      </Section>

      {/* Two inventory sections used to close this route and are deliberately
          gone: supporting capabilities with the archived list, and the audience
          router. Both enumerate rather than promote, and this page is the
          portfolio's pitch — it ends on the directory.

          Nothing was deleted from the content layer. Capability records still
          render at `/systems/[slug]` and are listed on `/status`.
          `audienceRoutes` in `src/content/site.ts` is now rendered by no route
          at all; it is kept, validated, and available, but if it stays unused
          it should be retired deliberately rather than left as a record with no
          reader. */}
    </>
  );
}
