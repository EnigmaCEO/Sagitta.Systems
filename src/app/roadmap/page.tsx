import Link from "@/components/Link";
import EmptyState from "@/components/EmptyState";
import { familyClass } from "@/components/FamilyMark";
import OperatingStatusBadge, {
  OperatingStatusLegend,
  StateGlyph,
  operatingStateStyles,
} from "@/components/OperatingStatusBadge";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import SystemMark from "@/components/SystemMark";
import { ExternalArrow } from "@/components/icons";
import {
  formatDate,
  getSystem,
  getSystemName,
  publicRoadmapItems,
  roadmapByHorizon,
  roadmapHorizons,
} from "@/content";
import type { OperatingState, RoadmapItem } from "@/content/types";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Roadmap",
  description: `${publicRoadmapItems.length} milestones across Now, Next, and Horizon. Each states an evidence-based position — Operating, Public Test, In Development, or Research Horizon — and links the evidence behind it.`,
  path: "/roadmap",
  ogImage: "/og/roadmap.png",
});

export default function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="Roadmap"
        title="Now, Next, Horizon"
        lead="Every milestone states an evidence-based position and links to what supports it. Current operating reality is kept separate from active development and from architecture that is still forming. No delivery dates or quarters are claimed, because none have been committed."
        aside={<HorizonSummary />}
      >
        <div>
          <p className="eyebrow mb-4" style={{ color: "var(--text-tertiary)" }}>
            How to read a state
          </p>
          <OperatingStatusLegend />
        </div>
      </PageHero>

      {roadmapHorizons.map((horizon, index) => {
        const items = roadmapByHorizon(horizon.id);
        return (
          <Section
            key={horizon.id}
            id={horizon.id.toLowerCase()}
            tone={index % 2 === 1 ? "raised" : "base"}
          >
            <SectionHeading
              eyebrow={`Horizon ${index + 1} of ${roadmapHorizons.length} · ${items.length} ${
                items.length === 1 ? "milestone" : "milestones"
              }`}
              title={horizon.title}
              description={horizon.description}
              size="lg"
            />

            {items.length > 0 ? (
              /* A single rail runs the length of the horizon, with one marker
                 per milestone. It reads as a sequence on desktop and stays a
                 clean vertical list on a narrow screen, because the rail is a
                 left gutter at every width rather than a horizontal timeline
                 that would have to reflow. */
              <ol className="relative pl-8 sm:pl-10">
                <span
                  aria-hidden="true"
                  className="absolute left-[7px] sm:left-[11px] top-2 bottom-2 w-px"
                  style={{
                    background:
                      "linear-gradient(to bottom, var(--border-strong), var(--border) 85%, transparent)",
                  }}
                />
                {items.map((item) => (
                  <li key={item.id} className="relative pb-4 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute left-[-25px] sm:left-[-33px] top-6 flex items-center justify-center w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: "var(--bg-base)",
                        border: `1px solid ${operatingStateStyles[item.state].color}`,
                      }}
                    >
                      <StateGlyph state={item.state} size={6} />
                    </span>
                    <RoadmapRow item={item} />
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState title="Nothing recorded in this horizon" />
            )}
          </Section>
        );
      })}
    </>
  );
}

/**
 * The three horizons at a glance, with the mix of states inside each. This is
 * what makes the roadmap scannable before any single milestone is read: Now is
 * mostly Operating, Horizon is mostly Research.
 */
function HorizonSummary() {
  return (
    <nav
      aria-label="Roadmap horizons"
      className="rounded-xl border p-5"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      <p className="eyebrow mb-4" style={{ color: "var(--text-tertiary)" }}>
        {publicRoadmapItems.length} milestones
      </p>
      <ol className="space-y-4">
        {roadmapHorizons.map((horizon) => {
          const items = roadmapByHorizon(horizon.id);
          const states = new Map<OperatingState, number>();
          for (const item of items) states.set(item.state, (states.get(item.state) ?? 0) + 1);

          return (
            <li key={horizon.id}>
              <Link
                href={`#${horizon.id.toLowerCase()}`}
                className="flex items-baseline justify-between gap-3 mb-2"
              >
                <span className="text-sm font-semibold" style={{ color: "var(--gold)" }}>
                  {horizon.title}
                </span>
                <span className="text-xs tabular-nums" style={{ color: "var(--text-tertiary)" }}>
                  {items.length}
                </span>
              </Link>
              <ul className="flex flex-wrap gap-x-3 gap-y-1">
                {[...states.entries()].map(([state, count]) => (
                  <li
                    key={state}
                    className="inline-flex items-center gap-1.5 text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <StateGlyph state={state} size={6} />
                    {count} {state}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function RoadmapRow({ item }: { item: RoadmapItem }) {
  const systemName = getSystemName(item.systemSlug);
  const family = item.systemSlug ? getSystem(item.systemSlug)?.family : undefined;

  return (
    <article
      className={`${familyClass(family)} surface-card family-card rounded-xl border p-5`}
      data-testid="roadmap-item"
      data-state={item.state}
      data-horizon={item.horizon}
    >
      {/* The mark sits in its own column so the marks line up down the page:
          scanning the roadmap for "what is being built on Radar" becomes a
          glance at a column of icons rather than a read of every title. It is
          decorative — the system name is published as a link in the list
          below — and falls back to the family motif for systems with no mark. */}
      <div className="flex items-start gap-3.5">
        {/* A fixed slot, so square marks and the Banking lockup both sit in the
            same column without either being distorted. */}
        <SystemMark systemSlug={item.systemSlug} height={38} width={92} style={{ marginTop: 1 }} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2.5">
            <h3
              className="text-sm font-semibold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              {item.title}
            </h3>
            <OperatingStatusBadge state={item.state} size="sm" />
          </div>

          <p
            className="text-xs leading-relaxed mb-4 max-w-3xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {item.summary}
          </p>

          <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            {systemName && item.systemSlug && (
              <div className="flex items-center gap-2">
                <dt style={{ color: "var(--text-tertiary)" }}>System</dt>
                <dd>
                  <Link
                    href={`/systems/${item.systemSlug}`}
                    data-cta={`roadmap-system:${item.systemSlug}`}
                    data-cta-type="system-entry"
                    className="font-semibold transition-opacity duration-150 hover:opacity-80"
                    style={{ color: "var(--family-accent)" }}
                  >
                    {systemName}
                  </Link>
                </dd>
              </div>
            )}

            {item.evidence && (
              <div className="flex items-center gap-2">
                <dt style={{ color: "var(--text-tertiary)" }}>Evidence</dt>
                <dd>
                  <a
                    href={item.evidence.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta-type="evidence"
                    className="inline-flex items-center gap-1 font-medium transition-opacity duration-150 hover:opacity-80"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.evidence.label}
                    <ExternalArrow size={10} />
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            )}

            <div className="flex items-center gap-2">
              <dt style={{ color: "var(--text-tertiary)" }}>Verified</dt>
              <dd style={{ color: "var(--text-tertiary)" }}>
                {item.updatedAt
                  ? formatDate(item.updatedAt)
                  : formatDate(item.verification.lastVerifiedAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
