import Link from "@/components/Link";
import { notFound } from "next/navigation";
import CareerCard from "@/components/CareerCard";
import CtaPanel from "@/components/CtaPanel";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import RelatedContent from "@/components/RelatedContent";
import { Section } from "@/components/SectionHeading";
import {
  formatDate,
  getCareer,
  getSystemName,
  publicCareers,
  relatedCareers,
  roadmapForCareer,
} from "@/content";
import type { CareerRecord } from "@/content/types";
import { breadcrumbLd, jobPostingLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ slug: string }> };

/** Only public roles get a page. Internal drafts never reach the export. */
export function generateStaticParams() {
  return publicCareers.map((career) => ({ slug: career.slug }));
}

/**
 * The description a search result renders for one role.
 *
 * For a live role this is the role's own first responsibility, which describes
 * it better than anything composed here could. The six archived roles are the
 * exception: their responsibility line was carried over from the previous
 * listing as the single word "Closed", expanded to one sentence that is
 * identical across all six. Six indexable pages sharing a byte-identical
 * description is a duplicate-content signal, and it is also simply unhelpful —
 * the result says nothing about which role it is.
 *
 * So an archived role's description is composed from what its own record
 * already holds: its title, the system it sat with, and its closed state.
 * Nothing is invented — inventing a responsibility for a role that never
 * published one is exactly what the content layer refuses to do — but the six
 * results become distinguishable from each other.
 */
function metaDescription(career: CareerRecord): string {
  if (career.status !== "Archived") return career.immediateResponsibility;
  const system = getSystemName(career.systemSlug);
  return `${career.title}${system ? ` for ${system}` : ""}. Closed — no longer accepting applications, preserved from the previous careers listing.`;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const career = getCareer(slug);
  if (!career) return buildMetadata({ title: "Role not found", path: `/careers/${slug}` });
  return buildMetadata({
    title: career.title,
    description: metaDescription(career),
    path: `/careers/${career.slug}`,
    type: "article",
    publishedTime: career.publishedAt,
    modifiedTime: career.updatedAt,
  });
}

export default async function CareerPage({ params }: Params) {
  const { slug } = await params;
  const career = getCareer(slug);
  if (!career || career.visibility !== "public") notFound();

  const systemName = getSystemName(career.systemSlug);
  const related = relatedCareers(career);
  const roadmap = roadmapForCareer(career);
  const archived = career.status === "Archived";
  const jobPosting = jobPostingLd(career);

  return (
    <>
      {jobPosting && <JsonLd data={jobPosting} />}
      <JsonLd
        data={breadcrumbLd([
          { name: "Careers", path: "/careers" },
          { name: career.title, path: `/careers/${career.slug}` },
        ])}
      />
      <PageHero
        eyebrow={systemName ? `Supporting ${systemName}` : "Careers"}
        title={career.title}
        lead={career.immediateResponsibility}
        actions={
          archived
            ? []
            : [
                {
                  label: "Apply by email",
                  href: `mailto:${career.hiringContact}?subject=${encodeURIComponent(
                    `Application: ${career.title}`,
                  )}`,
                  external: true,
                },
                { label: "All roles", href: "/careers", variant: "secondary" },
              ]
        }
        meta={
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded font-medium"
              style={{
                color: archived ? "var(--text-tertiary)" : "#34d399",
                backgroundColor: "var(--surface-2)",
                border: "1px solid var(--border)",
              }}
            >
              {career.status}
            </span>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded font-medium"
              style={{
                color: "var(--text-tertiary)",
                backgroundColor: "var(--surface-2)",
                border: "1px solid var(--border)",
              }}
            >
              {career.engagement}
            </span>
            <span style={{ color: "var(--text-tertiary)" }}>{career.location}</span>
          </div>
        }
      />

      <Section bordered={false}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Block title="Immediate responsibility" body={career.immediateResponsibility} />
            <Block title="First expected deliverable" body={career.firstDeliverable} />
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Required experience
              </h2>
              {career.requiredExperience.length > 0 ? (
                <ul className="space-y-2">
                  {career.requiredExperience.map((item) => (
                    <li
                      key={item}
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Not yet published.
                </p>
              )}
            </div>
            <Block title="Application process" body={career.applicationProcess} />
          </div>

          <aside
            className="rounded-xl border p-5 h-fit"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--text-tertiary)", letterSpacing: "0.1em" }}
            >
              Role record
            </h2>
            <dl className="space-y-4 text-xs">
              <div>
                <dt className="mb-1" style={{ color: "var(--text-tertiary)" }}>
                  Supporting system
                </dt>
                <dd>
                  {systemName ? (
                    <Link href={`/systems/${career.systemSlug}`} style={{ color: "var(--family-accent)" }}>
                      {systemName}
                    </Link>
                  ) : (
                    <span style={{ color: "var(--text-secondary)" }}>None recorded</span>
                  )}
                </dd>
              </div>
              <Meta label="Engagement type" value={career.engagement} />
              <Meta label="Status" value={career.status} />
              <Meta label="Compensation structure" value={career.compensation} />
              <Meta label="Location" value={career.location} />
              <div>
                <dt className="mb-1" style={{ color: "var(--text-tertiary)" }}>
                  Hiring contact
                </dt>
                <dd>
                  <a href={`mailto:${career.hiringContact}`} style={{ color: "var(--family-accent)" }}>
                    {career.hiringContact}
                  </a>
                </dd>
              </div>
              <Meta label="Published" value={formatDate(career.publishedAt)} />
              <Meta label="Updated" value={formatDate(career.updatedAt)} />
              {roadmap.length > 0 && (
                <div>
                  <dt className="mb-1" style={{ color: "var(--text-tertiary)" }}>
                    Roadmap work on this system
                  </dt>
                  <dd>
                    <ul className="space-y-1">
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
            </dl>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section>
          <RelatedContent
            title="Related roles"
            description="Other roles on the same system or in the same division."
            action={{ label: "Careers centre", href: "/careers" }}
            isEmpty={false}
            emptyTitle=""
          >
            {related.map((item) => (
              <CareerCard key={item.slug} career={item} />
            ))}
          </RelatedContent>
        </Section>
      )}

      <Section>
        <CtaPanel
          eyebrow="Apply"
          title={archived ? "This role is closed" : "Apply for this role"}
          description={
            archived
              ? "The role is preserved on the record. Register interest and the network will contact you if it reopens."
              : career.applicationProcess
          }
          actions={[
            { label: "Register interest", href: "/careers#register-interest" },
            { label: "All roles", href: "/careers", variant: "secondary" },
          ]}
          note="There is no application backend on this site yet."
        />
      </Section>
    </>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
        {title}
      </h2>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {body}
      </p>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="mb-1" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </dt>
      <dd style={{ color: "var(--text-secondary)" }}>{value}</dd>
    </div>
  );
}
