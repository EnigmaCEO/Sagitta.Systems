import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "@/components/Link";
import JsonLd from "@/components/JsonLd";
import MarkdownDocument from "@/components/MarkdownDocument";
import MediaTypeBadge from "@/components/MediaTypeBadge";
import PageHero from "@/components/PageHero";
import { Section } from "@/components/SectionHeading";
import {
  defenseReviews,
  formatDateOrUndated,
  getDefenseReview,
  getNewsroomEntry,
  newsroomEntryPath,
  site,
} from "@/content";
import { articleLd, breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return defenseReviews.map((review) => ({ slug: review.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const review = getDefenseReview(slug);
  const entry = review ? getNewsroomEntry(review.newsroomSlug) : undefined;
  if (!review || !entry) {
    return buildMetadata({
      title: "Defense review not found",
      path: "/defense/reviews/" + slug,
    });
  }

  return buildMetadata({
    title: entry.title,
    description: entry.summary,
    path: review.canonicalPath,
    ogImage: entry.heroImage ?? "/og/family-continuity.png",
    type: "article",
    publishedTime: entry.publishedAt,
    modifiedTime: entry.updatedAt,
  });
}

export default async function DefenseReviewPage({ params }: Params) {
  const { slug } = await params;
  const review = getDefenseReview(slug);
  const entry = review ? getNewsroomEntry(review.newsroomSlug) : undefined;
  if (
    !review ||
    !entry ||
    entry.publicationState !== "published" ||
    entry.visibility !== "public" ||
    newsroomEntryPath(entry) !== review.canonicalPath
  ) {
    notFound();
  }

  const source = readFileSync(join(process.cwd(), review.sourcePath), "utf8");
  const article = articleLd(entry);

  return (
    <div className="family-continuity-defense">
      {article ? <JsonLd data={article} /> : null}
      <JsonLd
        data={breadcrumbLd([
          { name: "Defense", path: "/defense" },
          { name: "Mini-Reviews", path: "/defense/reviews" },
          { name: review.cve, path: review.canonicalPath },
        ])}
      />

      <PageHero
        eyebrow="Sagitta Systems · Defense · Mini-Reviews"
        title={entry.title}
        lead={entry.summary}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <MediaTypeBadge type={entry.mediaType} />
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              <time dateTime={entry.publishedAt ?? undefined}>
                {formatDateOrUndated(entry.publishedAt)}
              </time>{" "}
              · {entry.author}
            </span>
          </div>
        }
      />

      <Section bordered={false}>
        <section className="defense-verdict" aria-labelledby="review-verdict-title">
          <div className="defense-verdict-heading">
            <p className="eyebrow mb-2">Defense Mini-Review</p>
            <h2 id="review-verdict-title" className="display text-2xl md:text-3xl font-semibold">
              {review.cve}
            </h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
              {review.environment}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
              {review.environmentQualifier}
            </p>
          </div>
          <dl className="defense-findings">
            {review.findings.map((finding) => (
              <div key={finding.label} className="defense-finding" data-tone={finding.tone}>
                <dt>{finding.label}</dt>
                <dd>{finding.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Section>

      <Section tone="raised">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] gap-10 xl:gap-16 items-start">
          <article>
            <MarkdownDocument source={source} />
          </article>
          <aside className="evidence-panel p-5 lg:sticky lg:top-24">
            <h2 className="eyebrow mb-4">Evidence record</h2>
            <dl className="space-y-4 text-xs">
              <RecordItem label="Review" value={review.cve} />
              <RecordItem label="Environment" value={review.environment} />
              <RecordItem label="Environment class" value="Fictional demonstration" />
              <RecordItem label="Editorial desk" value="Defense Review" />
              <RecordItem label="Published" value={formatDateOrUndated(entry.publishedAt)} />
              <RecordItem
                label="Evidence checked"
                value={formatDateOrUndated(entry.verification.lastVerifiedAt)}
              />
              <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                  Evidence chain
                </dt>
                <dd className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  CVE → build → mechanism → reachability → economics → authority → response →
                  migration → verification
                </dd>
              </div>
              <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                  Cite this review
                </dt>
                <dd className="font-mono break-all" style={{ color: "var(--text-secondary)" }}>
                  {site.url}{review.canonicalPath}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      <Section>
        <p className="text-xs">
          <Link href="/defense/reviews" style={{ color: "var(--family-accent)" }}>
            ← Back to Defense Mini-Reviews
          </Link>
        </p>
      </Section>
    </div>
  );
}

function RecordItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </dt>
      <dd style={{ color: "var(--text-secondary)" }}>{value}</dd>
    </div>
  );
}
