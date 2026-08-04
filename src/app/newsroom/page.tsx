import EditorialSchedule, { MediaCoverage } from "@/components/EditorialSchedule";
import NewsroomBrowser, {
  type BrowserEntry,
  type BrowserOption,
} from "@/components/NewsroomBrowser";
import { UNDATED_PERIOD, periodOf } from "@/lib/filters";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import StoryCard from "@/components/StoryCard";
import { mediaTypeStyles } from "@/components/MediaTypeBadge";
import {
  activeDesks,
  desks,
  getDeskName,
  getSystemName,
  leadStory,
  publishedEntries,
  publishedMediaTypes,
} from "@/content";
import { feedDesks } from "@/lib/feed";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Newsroom",
  description: `The Sagitta newsroom: ${publishedEntries.length} published records across ${activeDesks.length} active editorial desks, indexing research, reports, documents, and system updates from across the network.`,
  path: "/newsroom",
  ogImage: "/og/newsroom.png",
});

export default function NewsroomPage() {
  // Every filter axis is derived from the published records themselves, so an
  // option can never exist without a record behind it.
  const entries: BrowserEntry[] = publishedEntries.map((entry) => ({
    slug: entry.slug,
    desk: entry.desk,
    mediaType: entry.mediaType,
    systems: [entry.systemSlug, ...(entry.relatedSystems ?? [])].filter(
      (s): s is string => Boolean(s),
    ),
    period: periodOf(entry),
    card: <StoryCard entry={entry} />,
  }));

  const deskOptions: BrowserOption[] = activeDesks.map((desk) => ({
    value: desk.id,
    label: desk.name,
  }));

  const mediaOptions: BrowserOption[] = publishedMediaTypes.map((type) => ({
    value: type,
    label: type,
  }));

  const systemOptions: BrowserOption[] = [
    ...new Set(entries.flatMap((e) => e.systems)),
  ]
    .map((slug) => ({ value: slug, label: getSystemName(slug) ?? slug }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const periodOptions: BrowserOption[] = [...new Set(entries.map((e) => e.period))]
    .sort((a, b) => (a === UNDATED_PERIOD ? 1 : b === UNDATED_PERIOD ? -1 : b.localeCompare(a)))
    .map((period) => ({
      value: period,
      label: period === UNDATED_PERIOD ? "No published date" : period,
    }));

  const mediaColors = Object.fromEntries(
    Object.entries(mediaTypeStyles).map(([type, style]) => [type, style.color]),
  );

  return (
    <>
      <PageHero
        eyebrow="Newsroom"
        title="The record of what Sagitta has published"
        lead={`${publishedEntries.length} published records across ${activeDesks.length} active desks. Where the full work lives elsewhere — on a product site, in a document, or on a distribution channel — this index stays the canonical reference and links onward.`}
        aside={
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <p className="eyebrow mb-3" style={{ color: "var(--text-tertiary)" }}>
              What has been published
            </p>
            <MediaCoverage entries={publishedEntries} />
            <p className="text-xs leading-relaxed mt-4" style={{ color: "var(--text-tertiary)" }}>
              Media types with nothing behind them are absent rather than greyed out. The newsroom
              supports audio, video, briefings, and press releases; none has been published yet, so
              none is listed.
            </p>
          </div>
        }
      />

      {leadStory && (
        <Section id="lead" bordered={false}>
          <SectionHeading
            eyebrow="Lead"
            title="Lead story"
            description="Chosen editorially rather than by date."
          />
          <StoryCard entry={leadStory} variant="lead" />
        </Section>
      )}

      <Section id="schedule" tone="raised">
        <SectionHeading
          eyebrow="Editorial spine"
          title="The desks"
          description={`${activeDesks.length} of ${desks.length} desks are publishing. The rest are listed with their intended cadence and format — an upcoming desk never stands in for an edition that has not been written.`}
        />
        <EditorialSchedule desks={desks} entries={publishedEntries} />
      </Section>

      <Section id="subscribe">
        <SectionHeading
          eyebrow="Subscribe"
          title="Follow the record"
          description="The newsroom publishes an RSS feed. Every dated published record appears in it, in full, with the hub record as its link."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <a
            href="/newsroom/feed.xml"
            data-cta="newsroom:feed"
            data-cta-type="documentation"
            className="rounded-xl border p-5 lg:col-span-1 transition-opacity duration-150 hover:opacity-80"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              borderLeft: "2px solid var(--gold)",
            }}
          >
            <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
              The network feed
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
              Every desk, newest first.
            </p>
            <span className="text-xs font-mono" style={{ color: "var(--gold)" }}>
              /newsroom/feed.xml
            </span>
          </a>

          <div
            className="rounded-xl border p-5 lg:col-span-2"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              By desk
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
              {feedDesks.map((id) => (
                <li key={id}>
                  <a
                    href={`/newsroom/feeds/${id}/feed.xml`}
                    data-cta={`newsroom:feed:${id}`}
                    data-cta-type="documentation"
                    className="text-xs font-semibold"
                    style={{ color: "var(--family-accent)" }}
                  >
                    {getDeskName(id)}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              A desk appears here once it has published a dated record, so no feed listed above can
              be empty. Records whose sources publish no date keep their pages and stay out of the
              feeds — RSS has no way to say that a date is unknown, and the build date is not it.
            </p>
          </div>
        </div>
      </Section>

      <Section id="index">
        <SectionHeading
          eyebrow="Index"
          title="All published records"
          description="Filter by editorial desk, media type, related system, or publication period. Counts reflect published records only."
          size="lg"
        />
        <NewsroomBrowser
          entries={entries}
          desks={deskOptions}
          mediaTypes={mediaOptions}
          systems={systemOptions}
          periods={periodOptions}
          mediaColors={mediaColors}
        />
        <p className="visually-hidden">
          Desks currently publishing: {activeDesks.map((d) => getDeskName(d.id)).join(", ")}.
        </p>
      </Section>
    </>
  );
}
