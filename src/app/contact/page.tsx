import Link from "@/components/Link";
import InquiryForm from "@/components/InquiryForm";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import { ExternalArrow } from "@/components/icons";
import { site, systems } from "@/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Reach Sagitta Systems: engagement enquiries for the operating services, press and interview requests, and careers.",
  path: "/contact",
});

/**
 * Two inquiries arrive at this page and they are not the same journey.
 *
 * A protocol lead evaluating a Defense Review has a budget and a decision to
 * make, and the fastest thing for them is usually not a form at all — it is the
 * operating surface that already sells the thing, with its published scope and
 * its sample deliverable. A journalist has a deadline and needs a person.
 * Previously both were handed the same three-column list of addresses and the
 * same generic form, which served the second case adequately and the first case
 * badly.
 *
 * So commercial enquiry leads, routed into the services that can actually take
 * it; press has its own section and defers to the press room, which holds the
 * sourced material a journalist needs before they need a person; and careers
 * stays a pointer, because /careers owns it.
 */

/** Operating services a commercial enquiry can be routed straight into. */
const engagementRoutes = systems
  .filter((s) => s.status === "Operating" && s.operatingUrl)
  .map((s) => ({ name: s.name, href: s.operatingUrl as string, summary: s.summary }));

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Reach the network"
        lead="Engagement enquiries, press and interview requests, and careers are handled separately. Each route below reaches the desk that can answer it."
        actions={[
          {
            label: "Press room",
            href: "/press",
            variant: "secondary",
            cta: "contact:press-room",
            ctaType: "press",
          },
        ]}
      />

      <Section bordered={false} id="engagement">
        <SectionHeading
          eyebrow="Engagement"
          title="Working with a Sagitta service"
          description="If the service you need is operating, its own surface is the fastest route — the scope, the deliverable, and the terms are published there. Use the form for anything that spans more than one system, or where you are not yet sure which applies."
        />

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {engagementRoutes.map((route) => (
            <li
              key={route.href}
              className="rounded-xl border p-5 flex flex-col"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                {route.name}
              </p>
              <p
                className="text-xs leading-relaxed flex-1 mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {route.summary}
              </p>
              <a
                href={route.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cta={`contact-engagement:${route.href}`}
                data-cta-type="open-product"
                className="inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: "var(--family-accent)" }}
              >
                Open the service
                <ExternalArrow />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="max-w-2xl">
          <InquiryForm
            id="engagement-form"
            recipient={site.contactEmail}
            subjectPrefix="Engagement enquiry"
            submitLabel="Compose enquiry"
            messageLabel="What you need"
            messagePlaceholder="What you are trying to establish, which systems it touches, and any timeline you are working to."
            note={`Opens an addressed message to ${site.contactEmail}, the general and partnership desk.`}
          />
        </div>
      </Section>

      <Section id="press">
        <SectionHeading
          eyebrow="Press"
          title="Press and interview requests"
          description="The press room holds approved company descriptions, the leadership biography, logos, architecture diagrams, dated announcements, and sourced statistics — every figure with its metric, scope, source, and last-verified date. Most requests are answered there without waiting on anyone."
          action={{ label: "Press room", href: "/press" }}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <InquiryForm
              id="press-contact-form"
              recipient={site.contactEmail}
              subjectPrefix="Press enquiry"
              submitLabel="Compose press enquiry"
              messageLabel="Request details"
              messagePlaceholder="Publication, topic, format, and deadline."
              note={`Opens an addressed message to ${site.contactEmail}. Include your deadline — it determines the order requests are answered in.`}
            />
          </div>
          <aside
            className="rounded-xl border p-5 h-fit"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Before you write
            </p>
            <ul className="space-y-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <li>
                <Link href="/press#statistics" style={{ color: "var(--family-accent)" }}>
                  Sourced statistics
                </Link>{" "}
                — every figure Sagitta stands behind, with the date it was verified.
              </li>
              <li>
                <Link href="/press#leadership" style={{ color: "var(--family-accent)" }}>
                  Leadership biography
                </Link>{" "}
                — cleared for press use as written.
              </li>
              <li>
                <Link href="/media-library" style={{ color: "var(--family-accent)" }}>
                  Media library
                </Link>{" "}
                — logos, marks, and diagrams.
              </li>
              <li>
                <Link href="/status" style={{ color: "var(--family-accent)" }}>
                  Operating status
                </Link>{" "}
                — the state of every system, with the evidence behind it.
              </li>
            </ul>
            {/* The naming rule itself is stated on /press, which is the one
                page permitted to quote the forbidden lockup in order to forbid
                it. Restating it here would reproduce that lockup on a page with
                no exemption — the export test catches exactly this. */}
            <p className="text-xs leading-relaxed mt-4 pt-4 border-t" style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
              Product names carry no attribution line.{" "}
              <Link href="/press#descriptions" style={{ color: "var(--family-accent)" }}>
                Naming and attribution guidance
              </Link>
            </p>
          </aside>
        </div>
      </Section>

      <Section id="careers">
        <SectionHeading
          eyebrow="Careers"
          title="Roles and contributor work"
          description="Open roles, contributor engagements, and future workstreams are published with their terms. Register interest against a specific role rather than writing in general — it reaches the same desk with the context already attached."
          action={{ label: "Open roles", href: "/careers" }}
        />
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Direct:{" "}
          <a
            href={`mailto:${site.careersEmail}`}
            data-cta="contact:careers"
            data-cta-type="career"
            style={{ color: "var(--family-accent)" }}
          >
            {site.careersEmail}
          </a>
        </p>
      </Section>
    </>
  );
}
