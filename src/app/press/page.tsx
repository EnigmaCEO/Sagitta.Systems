import Link from "@/components/Link";
import InquiryForm from "@/components/InquiryForm";
import PageHero from "@/components/PageHero";
import PressResourceCard from "@/components/PressResourceCard";
import SectionHeading, { Section } from "@/components/SectionHeading";
import { ExternalArrow } from "@/components/icons";
import {
  formatDate,
  pressContact,
  pressResourcesOnRequest,
  publicPressResources,
  publicPressSections,
  publicPressStatistics,
} from "@/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Press Room",
  description:
    "Approved company descriptions, leadership biographies, logos, architecture diagrams, dated announcements, and sourced statistics for Sagitta Systems.",
  path: "/press",
  ogImage: "/og/press.png",
});

export default function PressPage() {
  return (
    <>
      <PageHero
        eyebrow="Press room"
        title="Journalist and press resources"
        lead="Everything on this page is usable and sourced. Every figure carries its metric, scope, source, and the date it was last verified, and every operating state links to the evidence behind it — so a claim about Sagitta can be checked before it is printed."
        actions={[
          {
            label: "Email press contact",
            href: `mailto:${pressContact}`,
            cta: "press:contact",
            ctaType: "press",
          },
          {
            label: "Media library",
            href: "/media-library",
            variant: "secondary",
            cta: "press:media-library",
            ctaType: "press",
          },
        ]}
        aside={
          <nav
            aria-label="Press room contents"
            className="rounded-xl border p-5"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <p className="eyebrow mb-4" style={{ color: "var(--text-tertiary)" }}>
              On this page
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="#statistics" className="text-xs" style={{ color: "var(--gold)" }}>
                  Sourced statistics
                  <span className="ml-1.5" style={{ color: "var(--text-tertiary)" }}>
                    {publicPressStatistics.length}
                  </span>
                </Link>
              </li>
              {publicPressSections.map((section) => (
                <li key={section.id}>
                  <Link href={`#${section.id}`} className="text-xs" style={{ color: "var(--gold)" }}>
                    {section.title}
                    <span className="ml-1.5" style={{ color: "var(--text-tertiary)" }}>
                      {publicPressResources(section).length}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="#interview-request"
                  className="text-xs"
                  style={{ color: "var(--gold)" }}
                >
                  Interview pathway
                </Link>
              </li>
            </ul>
            <p
              className="text-xs leading-relaxed mt-4 pt-4 border-t"
              style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}
            >
              Product names carry no attribution line. Write &ldquo;Sagitta Radar&rdquo;, not
              &ldquo;Sagitta Radar by Sagitta Labs&rdquo;.
            </p>
          </nav>
        }
      />

      <Section bordered={false} id="statistics">
        <SectionHeading
          eyebrow="Official statistics"
          title="Figures Sagitta stands behind"
          description="Every figure here is published by Sagitta on the source named against it. Where a number moves with market conditions, that is stated."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicPressStatistics.map((stat) => (
            <article
              key={stat.id}
              className="rounded-xl border p-5 flex flex-col"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p
                className="display text-2xl md:text-3xl font-bold mb-1 tabular-nums"
                style={{ color: "var(--gold)" }}
              >
                {stat.value}
              </p>
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                {stat.metric}
              </p>
              <p
                className="text-xs leading-relaxed flex-1 mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                {stat.scope}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                {stat.source.external ? (
                  <a
                    href={stat.source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold"
                    style={{ color: "var(--family-accent)" }}
                  >
                    {stat.source.label}
                    <ExternalArrow />
                  </a>
                ) : (
                  <span style={{ color: "var(--text-secondary)" }}>{stat.source.label}</span>
                )}
                <span style={{ color: "var(--text-tertiary)" }}>
                  Verified {formatDate(stat.verification.lastVerifiedAt)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {publicPressSections.map((section) => (
        <Section key={section.id} id={section.id}>
          <SectionHeading
            eyebrow="Press resource"
            title={section.title}
            description={section.description}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicPressResources(section).map((resource) => (
              <PressResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </Section>
      ))}

      <Section id="interview-request">
        <SectionHeading
          eyebrow="Press resource"
          title="Interview and briefing requests"
          description="Request an interview, a technical briefing, or a resource that is not published here."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <InquiryForm
              id="interview-request-form"
              recipient={pressContact}
              subjectPrefix="Interview request"
              submitLabel="Compose request"
              messageLabel="Request details"
              messagePlaceholder="Publication, topic, format, and deadline."
              note={`Opens an addressed message to ${pressContact}. Include your deadline — it determines the order requests are answered in.`}
            />
          </div>
          <aside
            className="rounded-xl border p-5 h-fit"
            style={{ borderColor: "var(--border)", borderStyle: "dashed" }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Additional materials available on request
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
              These are not yet published. Rather than list them as pending cards, they are prepared
              on request:
            </p>
            <ul className="space-y-1.5">
              {pressResourcesOnRequest.map((item) => (
                <li key={item} className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
