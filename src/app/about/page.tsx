import Link from "@/components/Link";
import CtaPanel from "@/components/CtaPanel";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import PersonCard from "@/components/PersonCard";
import SectionHeading, { Section } from "@/components/SectionHeading";
import {
  ecosystemThesis,
  identityHierarchy,
  publicPeople,
  site,
  systemFamilies,
  systemsByFamily,
} from "@/content";
import { personLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About",
  description:
    "What Sagitta Systems is: three core architectural foundations, the intelligence, continuity, and financial capabilities the Sagitta Protocol ecosystem is built on, how the names relate, and who builds it.",
  path: "/about",
  ogImage: "/og/about.png",
});

export default function AboutPage() {
  return (
    <>
      {/* The leadership profile this page already renders, restated for
          machines. One public profile exists and the validator enforces that,
          so this cannot silently become a list. */}
      {publicPeople.map((person) => (
        <JsonLd key={person.slug} data={personLd(person)} />
      ))}
      <PageHero
        eyebrow="About"
        title="One network, three system families"
        lead={site.identity}
      />

      <Section bordered={false} id="identity">
        <SectionHeading
          eyebrow="Identity"
          title="How the names relate"
          description="Three names appear across this network. They are not interchangeable, and the distinction matters when citing Sagitta."
        />
        {/* A descent rather than three equal cards: the umbrella brand contains
            the development identity, which builds the portfolio. Each level is
            inset and its rail lightens, so the containment is visible before
            the copy is read. */}
        <ol className="relative pl-8 space-y-4">
          <span
            aria-hidden="true"
            className="absolute left-[7px] top-3 bottom-3 w-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--gold), var(--violet) 55%, var(--border) 100%)",
            }}
          />
          {identityHierarchy.map((level, index) => (
            <li
              key={level.name}
              className="relative"
              style={{ marginLeft: index * 18 }}
            >
              <span
                aria-hidden="true"
                className="absolute rounded-full"
                style={{
                  left: -25 - index * 18,
                  top: 22,
                  width: 15,
                  height: 15,
                  backgroundColor: "var(--bg-base)",
                  border: `1.5px solid ${
                    index === 0 ? "var(--gold)" : index === 1 ? "var(--violet)" : "var(--border-strong)"
                  }`,
                }}
              />
              <div
                className="rounded-xl border p-5"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  borderLeft: `2px solid ${
                    index === 0 ? "var(--gold)" : index === 1 ? "var(--violet)" : "var(--border-strong)"
                  }`,
                }}
              >
                <p className="eyebrow mb-2" style={{ color: "var(--text-tertiary)" }}>
                  Level {index + 1} · {level.role}
                </p>
                <p
                  className="text-base font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {level.name}
                </p>
                <p
                  className="text-sm leading-relaxed max-w-2xl"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {level.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs mt-4 max-w-3xl" style={{ color: "var(--text-tertiary)" }}>
          Products are named on their own: Sagitta Radar is Sagitta Radar, with no attribution
          line beside it. The relationship between the umbrella brand, the development identity,
          and the systems is stated here and in the press room, which is where it belongs — a
          product name does not need to carry it.
        </p>
      </Section>

      <Section id="thesis">
        <SectionHeading eyebrow="Thesis" title="The organizing idea" />
        <div className="max-w-3xl space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Most failures in this industry are not failures of intelligence. They are failures of
            authority. A treasury moves because someone could move it. A protocol dies because an
            admin path nobody had mapped turned out to be reachable. A position is unwound and
            nobody can reconstruct why.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Sagitta&apos;s systems are built on the opposite premise: authority precedes automation, and
            survivability is a first-class system requirement rather than an operational afterthought.
            Continuity is designed before the incident. Allocation happens inside a policy that was
            agreed in advance, and carries its reasoning with it. Capital settles through routes and
            boundaries that were configured, not improvised.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            The three families are the same idea at three layers. Continuity and Defense keeps the
            system alive. Allocation and Agent Intelligence decides what it does. Capital
            Infrastructure holds and moves what it decides on.
          </p>
          {/* This paragraph used to close on "separable products and a single
              argument", which described the portfolio without saying what the
              argument was for. The purpose is the Protocol ecosystem, and the
              claim is set apart rather than buried at the end of a run of
              body copy. */}
          <p
            className="text-base leading-relaxed font-medium pl-5 border-l-2"
            style={{ color: "var(--text-primary)", borderColor: "var(--gold)" }}
          >
            {ecosystemThesis.short}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {ecosystemThesis.purpose}
          </p>
        </div>
      </Section>

      <Section id="families">
        <SectionHeading
          eyebrow="Structure"
          title="How the families reinforce one another"
          // The canonical dual view. It used to read "Each family consumes the
          // one before it", which described the architecture and left the
          // reader to infer what it was all for.
          description={ecosystemThesis.dualView}
          action={{ label: "Systems directory", href: "/systems" }}
        />
        {/* The families and what they mean. The systems inside them, their
            operating states, and their engagement paths are the systems
            directory's to publish — this page states the structure once and
            links to the record. */}
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {systemFamilies.map((family) => (
            <li
              key={family.id}
              className="rounded-xl border p-5"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                {family.name}
              </p>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                {family.summary}
              </p>
              <Link
                href={`/systems#${family.id}`}
                className="text-xs font-semibold transition-opacity duration-150 hover:opacity-80"
                style={{ color: "var(--family-accent)" }}
              >
                {systemsByFamily(family.id).length} systems in the directory
              </Link>
            </li>
          ))}
        </ul>
        <div className="max-w-3xl space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Three foundations carry the network, and the rest are services attached to them. The
            Continuity Engine is what Sagitta Defense sells and what Sagitta Radar runs. The
            Allocation Agent is what Selun sells to individuals, and what Selun&rsquo;s x402 surface
            sells to other agents. The Protocol is where the Reserve, Vault, and Escrow live, it
            embeds both the Allocation Agent and the Continuity Engine as components rather than
            integrations, and Sagitta Banking is the service attached to it.
          </p>
        </div>
      </Section>

      <Section id="leadership">
        <SectionHeading
          eyebrow="Leadership"
          title="Who builds this"
          description="Sagitta Systems has one public leadership profile."
          action={{ label: "Press biography", href: "/press#leadership" }}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
          {publicPeople.map((person) => (
            <PersonCard key={person.slug} person={person} variant="press" />
          ))}
        </div>
      </Section>

      <Section>
        <CtaPanel
          eyebrow="Continue"
          title="Where to go next"
          description="The systems directory holds the record for each system and its operating state. The roadmap states what is operating and what is not. The documentation index holds the whitepaper, the AAA methodology, and the machine surfaces. The newsroom indexes everything Sagitta has published."
          actions={[
            { label: "Systems", href: "/systems" },
            { label: "Roadmap", href: "/roadmap", variant: "secondary" },
            { label: "Documentation", href: "/documentation", variant: "secondary" },
            { label: "Newsroom", href: "/newsroom", variant: "secondary" },
            { label: "Press room", href: "/press", variant: "secondary" },
          ]}
          note={`Contact: ${site.contactEmail}`}
        />
      </Section>
    </>
  );
}
