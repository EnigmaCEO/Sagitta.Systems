import Image from "next/image";
import Link from "@/components/Link";
import { networkLinks, primaryNav, site, utilityNav } from "@/content/site";
import { systemFamilies, systemsByFamily } from "@/content/systems";
import { FamilyIcon, familyClass } from "./FamilyMark";
import { ExternalArrow } from "./icons";

/**
 * Institutional footer.
 *
 * Deliberately quiet and short. It carries the mark, one line of identity, the
 * three strategic families as real navigation, the routes, the destinations
 * that resolve, and how to make contact — and then it stops. The portfolio
 * inventory, the founder biography, the roadmap, and the fuller explanation of
 * how the names relate all live on the routes that own them, one link away.
 *
 * The Sagitta Labs relationship is stated once, here, at network level. No
 * product name in the footer carries an attribution line — that is the whole
 * point of stating the relationship here instead.
 */
export default function SiteFooter() {
  return (
    <footer className="border-t mt-8" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* ── Identity ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8 mb-8 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Image src={site.mark} alt="" width={20} height={20} className="object-contain" />
              <span
                className="text-xs uppercase font-semibold"
                style={{ color: "var(--text-primary)", letterSpacing: "0.15em" }}
              >
                {site.name}
              </span>
            </div>
            {/* One line, on every route, and it now says what the network is
                for rather than only where it sits. The full dual view — three
                foundations, one ecosystem — is two sentences and belongs on
                /about, /systems, and the press room, not under a mark in a
                footer column. Sagitta Labs stays in the sentence: this is the
                one place the umbrella relationship is stated at network level,
                and it sits outside the ecosystem hierarchy, not inside it. */}
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Building the intelligence, continuity, and financial capabilities required by the
              Sagitta Protocol ecosystem. Operating within {site.umbrella}.{" "}
              <Link
                href="/about#identity"
                className="underline underline-offset-2"
                style={{ color: "var(--gold)" }}
              >
                How the names relate
              </Link>
            </p>
          </div>

          {/* ── The three families ───────────────────────────────────────────
              Families, not the inventory. The footer used to restate all ten
              system records with their operating states on every route; the
              directory owns that, so this is now three ways in and a count. */}
          <nav aria-label="Systems by family" className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[...systemFamilies]
              .sort((a, b) => a.order - b.order)
              .map((family) => {
                const members = systemsByFamily(family.id);
                return (
                  <div key={family.id} className={familyClass(family.id)}>
                    <Link
                      href={`/systems#${family.id}`}
                      className="inline-flex items-center gap-1.5 mb-2 text-xs font-semibold"
                      style={{ color: "var(--family-accent)" }}
                    >
                      <FamilyIcon motif={family.motif} size={13} />
                      {family.name}
                    </Link>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                      {members.length} systems ·{" "}
                      {members.filter((s) => s.status === "Operating").length} operating
                    </p>
                  </div>
                );
              })}
          </nav>
        </div>

        {/* ── Utility navigation ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          <FooterGroup title="Network">
            {primaryNav.map((link) => (
              <FooterLink key={link.href} href={link.href} label={link.label} />
            ))}
          </FooterGroup>

          <FooterGroup title="Resources">
            {utilityNav.map((link) => (
              <FooterLink key={link.href} href={link.href} label={link.label} />
            ))}
            <li>
              <a
                href="/newsroom/feed.xml"
                data-cta="footer:feed"
                data-cta-type="documentation"
                className="text-xs transition-opacity duration-150 hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                RSS feed
              </a>
            </li>
          </FooterGroup>

          <FooterGroup title="Operating destinations">
            {networkLinks.map((link) => (
              <FooterLink key={link.href} href={link.href} label={link.label} external mono />
            ))}
          </FooterGroup>

          <FooterGroup title="Direct">
            <li>
              <a
                href={`mailto:${site.contactEmail}`}
                data-cta="footer:contact"
                data-cta-type="contact"
                className="text-xs transition-opacity duration-150 hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                {site.contactEmail}
              </a>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                General and press
              </p>
            </li>
            <li className="pt-2">
              <a
                href={`mailto:${site.careersEmail}`}
                data-cta="footer:careers"
                data-cta-type="career"
                className="text-xs transition-opacity duration-150 hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                {site.careersEmail}
              </a>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                Roles and contributor work
              </p>
            </li>
          </FooterGroup>
        </div>

        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Every operating state on this site carries the evidence behind it.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3" style={{ color: "var(--text-tertiary)" }}>
        {title}
      </p>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  label,
  external,
  mono,
}: {
  href: string;
  label: string;
  external?: boolean;
  mono?: boolean;
}) {
  const className = `text-xs transition-opacity duration-150 hover:opacity-80 ${
    mono ? "font-mono" : ""
  }`;
  return (
    <li>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${className} inline-flex items-center gap-1`}
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
          <ExternalArrow size={10} />
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      ) : (
        <Link href={href} className={className} style={{ color: "var(--text-secondary)" }}>
          {label}
        </Link>
      )}
    </li>
  );
}
