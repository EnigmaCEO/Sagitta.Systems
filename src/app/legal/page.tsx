import Link from "@/components/Link";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import { MetaBadge } from "@/components/MediaTypeBadge";
import { formatDate, legalNotices, openQuestions, site } from "@/content";
import type { LegalBlock } from "@/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Legal",
  // Names the five notices the page actually carries. The previous line said
  // only "Legal notices and policies for Sagitta Systems" — thin enough that a
  // search engine would discard it and compose its own from the page.
  description:
    "Terms of use, privacy and cookie notices, disclaimer, and trademark and brand-use guidance for Sagitta Systems — with the questions still open on each.",
  path: "/legal",
});

// The notices themselves live in `src/content/legal.ts`, with a note there on
// what they are, what they are not, and why nothing here states a governing law.
export default function LegalPage() {
  const effective = legalNotices[0].effectiveFrom;

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Legal notices"
        lead="Five notices covering use of this site, what it measures, what it stores, what it does not claim, and how the Sagitta name may be used. They are written in plain terms against how the site actually behaves, and each states the date it took effect."
        meta={
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            In effect from <time dateTime={effective}>{formatDate(effective)}</time>
          </p>
        }
      />

      <Section bordered={false}>
        <SectionHeading
          eyebrow="Notices"
          title="Policies and notices"
          description="Each notice is published in full below."
        />
        <ul className="space-y-3">
          {legalNotices.map((notice) => (
            <li
              key={notice.id}
              className="rounded-xl border p-5"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-1.5">
                <Link
                  href={`/legal#${notice.id}`}
                  className="text-sm font-semibold transition-opacity duration-150 hover:opacity-80"
                  style={{ color: "var(--text-primary)" }}
                >
                  {notice.title}
                </Link>
                <MetaBadge tone="quiet">
                  In effect{" "}
                  <time dateTime={notice.effectiveFrom} className="ml-1">
                    {formatDate(notice.effectiveFrom)}
                  </time>
                </MetaBadge>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {notice.summary}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-xs mt-8" style={{ color: "var(--text-tertiary)" }}>
          Legal enquiries:{" "}
          <a href={`mailto:${site.contactEmail}`} style={{ color: "var(--family-accent)" }}>
            {site.contactEmail}
          </a>
        </p>
      </Section>

      {legalNotices.map((notice) => (
        <Section key={notice.id} id={notice.id}>
          <SectionHeading
            eyebrow="Notice"
            title={notice.title}
            description={notice.summary}
            id={`${notice.id}-heading`}
          />
          <div className="max-w-3xl space-y-6">
            {notice.blocks.map((block, index) => (
              <Block key={block.heading ?? index} block={block} />
            ))}
            <p className="text-xs pt-2" style={{ color: "var(--text-tertiary)" }}>
              In effect from{" "}
              <time dateTime={notice.effectiveFrom}>{formatDate(notice.effectiveFrom)}</time>.
            </p>
          </div>
        </Section>
      ))}

      {/* Published rather than pending. The site began measuring which calls to
          action readers take, and a measurement disclosure that waits for a
          legal review is a measurement nobody was told about. */}
      <Section id="measurement">
        <SectionHeading
          eyebrow="Measurement"
          title="What this site measures"
          description="The detail behind the privacy notice, stated in full."
        />
        <div className="max-w-3xl space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            This site records which calls to action are taken and which routes they are taken from.
            Each record carries four things and no more: the identifier of the action, what kind of
            journey it starts, whether its destination was usable at the time, and the path of the
            page it was taken from. Page views are counted for the same reason a denominator is
            needed to read a numerator.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            No cookie is set. No identifier is assigned. Nothing is written to local or session
            storage, no device or browser fingerprint is derived, and no third-party analytics
            script is loaded — the page makes no request to another origin to do any of this.
            Because nothing identifying is emitted, the records cannot be assembled into a session
            or attributed to a person.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Do Not Track and Global Privacy Control are honoured as instructions. A browser sending
            either signal is not measured at all, and the measurement is disabled outright in any
            build with no endpoint configured.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            The purpose is editorial. The front page promotes a small number of things at a time and
            archives the rest; this is how those decisions become answerable to what readers actually
            do, rather than resting on judgment alone.
          </p>
        </div>
      </Section>

      {/* What a reviewed pack would carry and these notices cannot yet. Stated
          rather than filled in, which is the same rule the rest of the site
          follows for a fact that does not exist. */}
      <Section id="outstanding">
        <SectionHeading
          eyebrow="Outstanding"
          title="What these notices do not yet state"
          description="Each of these depends on a fact that does not exist yet. None of them is invented here."
        />
        <ul className="max-w-3xl space-y-4">
          {openQuestions.map((question) => (
            <li
              key={question.title}
              className="rounded-xl border p-5"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                borderStyle: "dashed",
              }}
            >
              <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                {question.title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {question.note}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-xs mt-8" style={{ color: "var(--text-tertiary)" }}>
          Legal enquiries:{" "}
          <a href={`mailto:${site.contactEmail}`} style={{ color: "var(--family-accent)" }}>
            {site.contactEmail}
          </a>
        </p>
      </Section>
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  return (
    <div className="space-y-3">
      {block.heading && (
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {block.heading}
        </h3>
      )}
      {block.paragraphs?.map((paragraph) => (
        <p
          key={paragraph.slice(0, 48)}
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {paragraph}
        </p>
      ))}
      {block.list && (
        <ul className="space-y-2 pl-4">
          {block.list.map((item) => (
            <li
              key={item.slice(0, 48)}
              className="text-sm leading-relaxed list-disc"
              style={{ color: "var(--text-secondary)" }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
