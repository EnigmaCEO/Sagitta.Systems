import Image from "next/image";
import Link from "@/components/Link";
import { notFound } from "next/navigation";
import { familyClass } from "@/components/FamilyMark";
import JsonLd from "@/components/JsonLd";
import MediaPlayer from "@/components/MediaPlayer";
import MediaTypeBadge, { mediaTypeStyles } from "@/components/MediaTypeBadge";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import StoryCard from "@/components/StoryCard";
import { ExternalArrow } from "@/components/icons";
import {
  formatDateOrUndated,
  getDesk,
  getDeskName,
  getNewsroomEntry,
  getSystem,
  getSystemName,
  publishedEntries,
  relatedEntries,
  roadmapForSystem,
  site,
} from "@/content";
import { articleLd, breadcrumbLd, videoObjectLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import type { NewsroomBodyBlock, NewsroomBodyTable } from "@/content/types";

type Params = { params: Promise<{ slug: string }> };

const FAMILY_OG: Record<string, string> = {
  "continuity-defense": "/og/family-continuity.png",
  "allocation-agent-intelligence": "/og/family-allocation.png",
  "capital-infrastructure": "/og/family-capital.png",
};

/** Only published records get a page. Drafts never reach the export. */
export function generateStaticParams() {
  return publishedEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const entry = getNewsroomEntry(slug);
  if (!entry) return buildMetadata({ title: "Record not found", path: `/newsroom/${slug}` });

  // A record with its own verified image uses it; otherwise it inherits the
  // editorial card for its system's family rather than a generic default.
  const family = entry.systemSlug ? getSystem(entry.systemSlug)?.family : undefined;
  const ogImage = entry.heroImage ?? (family ? FAMILY_OG[family] : undefined) ?? "/og/newsroom.png";

  return buildMetadata({
    title: entry.title,
    description: entry.summary,
    path: `/newsroom/${entry.slug}`,
    ogImage,
    type: "article",
    publishedTime: entry.publishedAt,
    modifiedTime: entry.updatedAt,
  });
}

export default async function NewsroomEntryPage({ params }: Params) {
  const { slug } = await params;
  const entry = getNewsroomEntry(slug);
  if (!entry || entry.publicationState !== "published" || entry.visibility !== "public") {
    notFound();
  }

  const systemName = getSystemName(entry.systemSlug);
  const family = entry.systemSlug ? getSystem(entry.systemSlug)?.family : undefined;
  const desk = getDesk(entry.desk);
  const related = relatedEntries(entry);
  const roadmap = entry.systemSlug ? roadmapForSystem(entry.systemSlug).slice(0, 2) : [];
  const accent = mediaTypeStyles[entry.mediaType].color;
  const isExternal = Boolean(entry.externalUrl?.startsWith("http"));

  // null where the canonical publication lives off-site, or where the record
  // carries no date. See the note on `articleLd`.
  const article = articleLd(entry);

  // A record carrying a real video describes it as one. Null for every record
  // that is not a video, which is most of them.
  const video = videoObjectLd(entry);

  return (
    <div className={familyClass(family)}>
      {article ? <JsonLd data={article} /> : null}
      {video ? <JsonLd data={video} /> : null}
      <JsonLd
        data={breadcrumbLd([
          { name: "Newsroom", path: "/newsroom" },
          { name: entry.title, path: `/newsroom/${entry.slug}` },
        ])}
      />
      <PageHero
        eyebrow={
          entry.seriesLabel
            ? `${getDeskName(entry.desk)} · ${entry.seriesLabel}`
            : getDeskName(entry.desk)
        }
        title={entry.title}
        lead={entry.summary}
        actions={
          entry.externalUrl
            ? [
                {
                  label: entry.externalLabel ?? "Read the full publication",
                  href: entry.externalUrl,
                  external: isExternal,
                  cta: `newsroom-external:${entry.slug}`,
                  ctaType: "documentation",
                },
              ]
            : []
        }
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <MediaTypeBadge type={entry.mediaType} />
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              <time dateTime={entry.publishedAt ?? undefined}>
                {formatDateOrUndated(entry.publishedAt)}
              </time>{" "}
              · {entry.author}
            </span>
            {systemName && (
              <Link
                href={`/systems/${entry.systemSlug}`}
                className="text-xs font-medium"
                style={{ color: "var(--family-accent)" }}
              >
                {systemName}
              </Link>
            )}
          </div>
        }
      />

      <Section bordered={false}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2">
            {/* Verified media takes precedence over a still image. Renders
                nothing at all when the record carries no media block. */}
            {entry.media ? (
              <div className="mb-8">
                <MediaPlayer media={entry.media} title={entry.title} />
              </div>
            ) : (
              entry.heroImage && (
                <figure
                  className="rounded-xl overflow-hidden border mb-8 m-0"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-raised)" }}
                >
                  <Image
                    src={entry.heroImage}
                    alt=""
                    width={960}
                    height={540}
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="w-full object-contain"
                    priority
                  />
                </figure>
              )
            )}

            <ArticleBody blocks={entry.body} accent={accent} />

            {entry.externalUrl && (
              <div
                className="rounded-xl border p-6 mt-10"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  borderLeft: "2px solid var(--family-accent)",
                }}
              >
                <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  {isExternal ? "The complete work lives elsewhere" : "Open the full asset"}
                </p>
                <p
                  className="text-xs leading-relaxed mb-4 max-w-xl"
                  style={{ color: "var(--text-secondary)" }}
                >
                  This page is the canonical Sagitta record.{" "}
                  {isExternal
                    ? "The full publication is hosted on its own surface and opens in a new tab."
                    : "The asset itself opens directly."}
                </p>
                <a
                  href={entry.externalUrl}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  data-cta={`newsroom-body-external:${entry.slug}`}
                  data-cta-type="documentation"
                  className="btn-primary tap-target inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold"
                >
                  {entry.externalLabel ?? "Open the full publication"}
                  <ExternalArrow size={11} />
                  {isExternal && <span className="visually-hidden"> (opens in a new tab)</span>}
                </a>
              </div>
            )}
          </article>

          <aside className="evidence-panel p-5 h-fit">
            <h2 className="eyebrow mb-4">Record</h2>
            <dl className="space-y-4 text-xs">
              <Meta label="Editorial desk" value={getDeskName(entry.desk)} />
              {entry.seriesLabel && <Meta label="Edition" value={entry.seriesLabel} />}
              {desk && <Meta label="Desk cadence" value={`${desk.cadence} · ${desk.format}`} />}
              <Meta label="Media type" value={entry.mediaType} />
              <Meta label="Author" value={entry.author} />
              <Meta label="Published" value={formatDateOrUndated(entry.publishedAt)} />
              {entry.updatedAt && (
                <Meta label="Updated" value={formatDateOrUndated(entry.updatedAt)} />
              )}
              {entry.media?.duration && <Meta label="Runtime" value={entry.media.duration} />}

              <div>
                <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                  Related system
                </dt>
                <dd>
                  {systemName ? (
                    <Link
                      href={`/systems/${entry.systemSlug}`}
                      data-cta={`newsroom-system:${entry.systemSlug}`}
                      data-cta-type="system-entry"
                      style={{ color: "var(--family-accent)" }}
                    >
                      {systemName}
                    </Link>
                  ) : (
                    <span style={{ color: "var(--text-secondary)" }}>Network-wide</span>
                  )}
                </dd>
              </div>

              {entry.relatedSystems && entry.relatedSystems.length > 0 && (
                <div>
                  <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                    Also touches
                  </dt>
                  <dd className="flex flex-wrap gap-x-3 gap-y-1">
                    {entry.relatedSystems.map((systemSlug) => (
                      <Link
                        key={systemSlug}
                        href={`/systems/${systemSlug}`}
                        style={{ color: "var(--family-accent)" }}
                      >
                        {getSystemName(systemSlug) ?? systemSlug}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}

              {roadmap.length > 0 && (
                <div>
                  <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                    Related roadmap work
                  </dt>
                  <dd>
                    <ul className="space-y-1.5">
                      {roadmap.map((item) => (
                        <li key={item.id}>
                          <Link href="/roadmap" style={{ color: "var(--family-accent)" }}>
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}

              <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                  Cite this record
                </dt>
                <dd className="font-mono break-all" style={{ color: "var(--text-secondary)" }}>
                  {site.url}/newsroom/{entry.slug}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="raised">
          <SectionHeading
            eyebrow="Related"
            title="Related records"
            description="Other published records from the same system or desk."
            action={{ label: "Newsroom", href: "/newsroom" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((item) => (
              <StoryCard key={item.slug} entry={item} />
            ))}
          </div>
        </Section>
      )}

      <Section>
        <p className="text-xs">
          <Link href="/newsroom" style={{ color: "var(--family-accent)" }}>
            ← Back to the newsroom
          </Link>
        </p>
      </Section>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </dt>
      <dd style={{ color: "var(--text-secondary)" }}>{value}</dd>
    </div>
  );
}

function ArticleBody({ blocks, accent }: { blocks: NewsroomBodyBlock[]; accent: string }) {
  return (
    <div
      className="pl-5 border-l-2"
      style={{ borderColor: `color-mix(in srgb, ${accent} 45%, transparent)` }}
    >
      {blocks.map((block, index) => {
        if (typeof block === "string") {
          return (
            <p
              key={`${index}-${block.slice(0, 40)}`}
              className="text-sm md:text-base leading-relaxed mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              <InlineText text={block} />
            </p>
          );
        }

        if (block.kind === "heading") {
          return (
            <h2
              key={`${index}-${block.text}`}
              className="display text-xl md:text-2xl font-semibold mt-10 mb-4 first:mt-0"
              style={{ color: "var(--text-primary)" }}
            >
              {block.text}
            </h2>
          );
        }

        if (block.kind === "table") {
          return <ArticleTable key={`${index}-${block.caption}`} table={block} />;
        }

        return (
          <p
            key={`${index}-${block.text.slice(0, 40)}`}
            className="text-xs md:text-sm italic leading-relaxed mt-8 mb-0 pt-5 border-t"
            style={{ color: "var(--text-tertiary)", borderColor: "var(--border)" }}
          >
            <InlineText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

function ArticleTable({ table }: { table: NewsroomBodyTable }) {
  const numeric = new Set(table.numericColumns ?? []);

  return (
    <div className="overflow-x-auto mb-6 rounded-lg border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full min-w-[38rem] border-collapse text-xs md:text-sm">
        <caption className="visually-hidden">{table.caption}</caption>
        <thead style={{ backgroundColor: "var(--surface-2)" }}>
          <tr>
            {table.columns.map((column, columnIndex) => (
              <th
                key={column}
                scope="col"
                className={`px-3 py-2.5 font-semibold border-b ${numeric.has(columnIndex) ? "text-right" : "text-left"}`}
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr:last-child>*]:border-b-0">
          {table.rows.map((row, rowIndex) => {
            const isTotal = row[0] === "Total";
            return (
              <tr
                key={`${rowIndex}-${row.join("-")}`}
                className={isTotal ? "font-semibold" : undefined}
                style={isTotal ? { backgroundColor: "var(--surface-2)" } : undefined}
              >
                {row.map((cell, columnIndex) => {
                  const Cell = columnIndex === 0 ? "th" : "td";
                  return (
                    <Cell
                      key={`${columnIndex}-${cell}`}
                      {...(columnIndex === 0 ? { scope: "row" as const } : {})}
                      className={`px-3 py-2 border-b whitespace-nowrap ${
                        numeric.has(columnIndex) ? "text-right font-mono" : "text-left"
                      }`}
                      style={{
                        color: columnIndex === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                        borderColor: "var(--border)",
                      }}
                    >
                      {cell}
                    </Cell>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Bold markers are the only inline syntax the editorial content model needs. */
function InlineText({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${index}-${part}`} style={{ color: "var(--text-primary)" }}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}
