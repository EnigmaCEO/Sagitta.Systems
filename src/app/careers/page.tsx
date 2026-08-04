import Link from "@/components/Link";
import CareerCard from "@/components/CareerCard";
import EmptyState from "@/components/EmptyState";
import InquiryForm from "@/components/InquiryForm";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import { careerDivisions, careersByStatus, careersContact, openCareers } from "@/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Careers",
  description: `${openCareers.length} role open with published terms, plus a contributor network and future workstreams across the Sagitta Systems network.`,
  path: "/careers",
  ogImage: "/og/careers.png",
});

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build with Sagitta"
        lead="Roles are grouped by how they engage. Only roles with published terms appear as open; contract and on-call engagements sit in the contributor network; work the network expects but is not filling is listed as a future workstream. Closed roles stay on the record."
        actions={[
          { label: "Register interest", href: "#register-interest", cta: "careers:register", ctaType: "career" },
        ]}
        aside={
          <nav
            aria-label="Career divisions"
            className="rounded-xl border p-5"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <p className="eyebrow mb-4" style={{ color: "var(--text-tertiary)" }}>
              Four states, four meanings
            </p>
            <ul className="space-y-3">
              {careerDivisions.map((division) => {
                const roles = careersByStatus(division.status);
                const open = division.status === "Open";
                return (
                  <li key={division.status}>
                    <Link
                      href={`#${division.status.toLowerCase()}`}
                      className="flex items-baseline justify-between gap-3"
                    >
                      <span
                        className="text-xs font-semibold"
                        style={{ color: open ? "var(--gold)" : "var(--text-secondary)" }}
                      >
                        {division.title}
                      </span>
                      <span
                        className="text-xs tabular-nums shrink-0"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {roles.length}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p
              className="text-xs leading-relaxed mt-4 pt-4 border-t"
              style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}
            >
              A role reaches Open Now only once its compensation terms are published. The build
              fails if one does not.
            </p>
          </nav>
        }
      />

      {careerDivisions.map((division, index) => {
        const roles = careersByStatus(division.status);
        return (
          <Section
            key={division.status}
            id={division.status.toLowerCase()}
            tone={index % 2 === 1 ? "raised" : "base"}
          >
            <SectionHeading
              eyebrow={`${roles.length} ${roles.length === 1 ? "role" : "roles"}`}
              title={division.title}
              description={division.description}
              size={division.status === "Open" ? "lg" : "md"}
            />
            {roles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((career) => (
                  <CareerCard key={career.slug} career={career} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nothing listed in this division"
                description="Roles appear here only once their terms are published."
                action={{ label: "Register interest", href: "#register-interest" }}
              />
            )}
          </Section>
        );
      })}

      <Section id="register-interest">
        <SectionHeading
          eyebrow="Division"
          title="Register Interest"
          description="No role that fits? Tell the network where you would contribute. Applications are read against current and upcoming workstreams."
        />
        <div className="max-w-2xl">
          <InquiryForm
            id="register-interest-form"
            recipient={careersContact}
            subjectPrefix="Register interest"
            submitLabel="Compose application"
            messageLabel="Where would you contribute?"
            messagePlaceholder="Systems, workstreams, and the kind of engagement you are looking for."
          />
        </div>
      </Section>
    </>
  );
}
