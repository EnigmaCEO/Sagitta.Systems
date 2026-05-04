import Image from "next/image";
import { productItems, serviceItems, careerAreas, type EcosystemItem } from "@/data/content";
import DoorCard from "@/components/DoorCard";
import CareersAccordion from "@/components/CareersAccordion";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <Nav />
      <main>
        <Hero />
        <AudienceRouter />
        <Products />
        <Services />
        <ProofOfWork />
        <FounderOperators />
        <Careers />
      </main>
      <Footer />
    </div>
  );
}

// ─── Nav ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Products", href: "#products" },
  { label: "Services", href: "#services" },
  { label: "Careers",  href: "#careers"  },
  { label: "About",    href: "#about"    },
];

function Nav() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(7, 11, 17, 0.9)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/sagitta.png"
            alt="Sagitta Systems"
            width={20}
            height={20}
            className="object-contain opacity-90"
          />
          <span
            className="text-sm font-semibold tracking-widest uppercase hidden sm:block"
            style={{ color: "var(--text-primary)", letterSpacing: "0.15em" }}
          >
            Sagitta Systems
          </span>
        </a>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link px-3 py-1.5 rounded text-xs font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="hero-section">
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 items-center">
          {/* Left: copy */}
          <div className="max-w-lg">
            <div className="flex items-center gap-2.5 mb-8">
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium"
                style={{
                  borderColor: "var(--accent-dim)",
                  color: "var(--accent)",
                  backgroundColor: "rgba(29,58,110,0.18)",
                }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                Ecosystem Hub
              </span>
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight mb-5 leading-snug"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              Decision Intelligence,
              <br />
              DeFi Continuity,
              <br />
              and Capital Management.
            </h1>

            <p
              className="text-sm md:text-base leading-relaxed mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              Sagitta Systems is the central hub for products, services, and infrastructure
              built around allocation intelligence, protocol defense, treasury support,
              agent-driven portfolio decisions, and continuity-governed finance.
            </p>

            <div className="flex flex-wrap gap-3 mb-4">
              <a
                href="#entry-point"
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
              >
                Find your entry point
                <ArrowRight />
              </a>
              <a
                href="#careers"
                className="btn-secondary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold"
              >
                View careers
              </a>
            </div>

            <a
              href="https://sagitta-protocol.gitbook.io/sagitta-whitepaper"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs transition-opacity duration-150 hover:opacity-80"
              style={{ color: "var(--text-tertiary)" }}
            >
              Read whitepaper →
            </a>
          </div>

          {/* Right: hero graphic */}
          <div
            className="flex justify-center md:justify-end"
            style={{
              maskImage:
                "radial-gradient(ellipse 68% 72% at 55% 50%, black 38%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 68% 72% at 55% 50%, black 38%, transparent 78%)",
            }}
          >
            <Image
              src="/sagitta-hero.png"
              alt="Sagitta constellation"
              width={400}
              height={300}
              className="w-full max-w-lg object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Audience Router ─────────────────────────────────────────────────────────

interface RouterCard {
  label: string;
  copy: string;
  tags: string[];
  href: string;
}

const routerCards: RouterCard[] = [
  {
    label: "I manage treasury",
    copy: "Allocation support, treasury decision records, and rebalance guidance.",
    tags: ["Treasury Decision Desk", "Autonomous Allocation Agent", "Rebalancing"],
    href: "#products",
  },
  {
    label: "I run a protocol",
    copy: "Continuity intelligence, protocol defense, and system resilience.",
    tags: ["Sagitta Continuity Engine", "Defense", "Sagitta Protocol"],
    href: "#products",
  },
  {
    label: "I want portfolio help",
    copy: "Agent-guided allocation, wallet analysis, and portfolio execution.",
    tags: ["Selun", "Rebalancing", "Sagitta Wallet"],
    href: "#products",
  },
  {
    label: "I build or operate systems",
    copy: "Open roles and workstreams across the Sagitta ecosystem.",
    tags: ["Careers", "Sagitta Continuity Engine", "Autonomous Allocation Agent"],
    href: "#careers",
  },
  {
    label: "I fund or partner with ecosystems",
    copy: "Grant readiness, ecosystem positioning, and protocol-level infrastructure.",
    tags: ["Grants", "Sagitta Protocol", "Sagitta Continuity Engine"],
    href: "#services",
  },
];

function AudienceRouter() {
  return (
    <section id="entry-point" className="mx-auto max-w-6xl px-6 pb-16">
      <hr className="section-divider border-t mb-12" style={{ borderColor: "var(--border)" }} />
      <EyebrowLabel>Entry Point</EyebrowLabel>
      <SectionHeader
        title="Find your entry point"
        description="Start with the role or need closest to yours."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {routerCards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="router-card group flex flex-col rounded-lg border p-4 transition-all duration-200"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-sm font-semibold mb-2 leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              {card.label}
            </p>
            <p
              className="text-xs leading-relaxed mb-3 flex-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {card.copy}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    color: "var(--text-tertiary)",
                    backgroundColor: "var(--surface-2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── Products ────────────────────────────────────────────────────────────────

function Products() {
  return (
    <section id="products" className="mx-auto max-w-6xl px-6 pb-16">
      <hr className="section-divider border-t mb-12" style={{ borderColor: "var(--border)" }} />
      <EyebrowLabel>Products</EyebrowLabel>
      <SectionHeader
        title="Core products"
        description="The systems Sagitta builds and maintains."
      />
      <StatusLegend />
      <ItemGrid items={productItems} />
    </section>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────

function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 pb-16">
      <hr className="border-t mb-12" style={{ borderColor: "var(--border)" }} />
      <EyebrowLabel>Services</EyebrowLabel>
      <SectionHeader
        title="Services"
        description="Focused offerings that apply Sagitta systems to a specific operator need."
      />
      <StatusLegend />
      <ItemGrid items={serviceItems} cols={2} />
    </section>
  );
}

function StatusLegend() {
  return (
    <div
      className="flex flex-wrap items-center gap-4 mb-6 text-xs"
      style={{ color: "var(--text-tertiary)" }}
    >
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "#34d399" }} />
        Live — available now
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
        Beta / Waitlist — gated access
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "#6b7a8d" }} />
        Roadmap — planned
      </span>
    </div>
  );
}

function ItemGrid({ items, cols = 3 }: { items: EcosystemItem[]; cols?: 2 | 3 }) {
  const gridClass =
    cols === 2
      ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";
  return (
    <div className={gridClass}>
      {items.map((item) => (
        <DoorCard key={item.name} door={item} />
      ))}
    </div>
  );
}

// ─── Proof of Work ───────────────────────────────────────────────────────────

interface ProofItem {
  title: string;
  body: string;
  cta: string;
  href: string;
  external: boolean;
  diagram?: boolean;
}

const proofItems: ProofItem[] = [
  {
    title: "Whitepaper",
    body: "Read the Sagitta Protocol architecture, doctrine, and capital-flow design.",
    cta: "Read whitepaper",
    href: "https://sagitta-protocol.gitbook.io/sagitta-whitepaper",
    external: true,
  },
  {
    title: "Protocol Architecture",
    body: "View the capital architecture and flow behind Vault, Treasury, Reserve, Escrow, AAA, and SCE.",
    cta: "View architecture",
    href: "/diagram.png",
    external: true,
    diagram: true,
  },
  {
    title: "Security",
    body: "Review Sagitta Labs security posture and security-related materials.",
    cta: "View security",
    href: "https://www.sagittalabs.com/security",
    external: true,
  },
  {
    title: "Use Cases",
    body: "Explore where Sagitta systems apply across treasury, protocol defense, continuity, and capital operations.",
    cta: "View use cases",
    href: "https://www.sagittalabs.com/use-cases",
    external: true,
  },
  {
    title: "Contact",
    body: "Reach Sagitta Labs for partnerships, service inquiries, security, or ecosystem discussions.",
    cta: "Contact Sagitta",
    href: "https://www.sagittalabs.com/contact",
    external: true,
  },
  {
    title: "Open Roles",
    body: "Explore product, protocol, security, treasury, and engineering workstreams.",
    cta: "View careers",
    href: "#careers",
    external: false,
  },
];

function ProofOfWork() {
  return (
    <section id="proof" className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <EyebrowLabel>Proof of work</EyebrowLabel>
        <SectionHeader
          title="Proof of work"
          description="Explore the systems, documents, and operating surfaces currently shaping the Sagitta ecosystem."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {proofItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="proof-card group flex flex-col rounded-xl border p-5 transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {item.diagram && (
                <div
                  className="mb-3 rounded-lg overflow-hidden border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Image
                    src="/diagram.png"
                    alt="Sagitta Protocol architecture diagram"
                    width={400}
                    height={220}
                    className="w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ maxHeight: "110px", objectPosition: "top" }}
                  />
                </div>
              )}
              <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                {item.title}
              </p>
              <p className="text-xs leading-relaxed flex-1 mb-3" style={{ color: "var(--text-secondary)" }}>
                {item.body}
              </p>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-150"
                style={{ color: "var(--accent)" }}
              >
                {item.cta}
                <ArrowRight />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Founder Operators ───────────────────────────────────────────────────────

const founders = [
  {
    name: "Orion Gray",
    role: "Founder-Operator / Security Strategy",
    bio: "Enterprise cybersecurity, vulnerability governance, cloud security, and high-trust consulting experience informing Sagitta's continuity and defense architecture.",
  },
  {
    name: "Alexander Roth",
    role: "Founder-Operator / Systems Architecture",
    bio: "Secure software, cloud infrastructure, Web3 systems, AI platforms, and blockchain product experience informing Sagitta's protocol and allocation architecture.",
  },
];

function FounderOperators() {
  return (
    <section id="about" className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <EyebrowLabel>Team</EyebrowLabel>
        <SectionHeader
          title="Built by founder-operators"
          description="Sagitta Systems is shaped by operators with experience across security, software infrastructure, Web3 systems, AI platforms, and capital-system design."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {founders.map((founder) => (
            <div
              key={founder.name}
              className="rounded-xl border p-5"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>
                {founder.name}
              </p>
              <p
                className="text-xs font-medium mb-3"
                style={{ color: "var(--accent)" }}
              >
                {founder.role}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {founder.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Careers ─────────────────────────────────────────────────────────────────

function Careers() {
  return (
    <section id="careers" className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <EyebrowLabel>Careers</EyebrowLabel>
        <SectionHeader
          title="Open & upcoming roles"
          description="Explore role paths across Sagitta products and services."
        />
        <CareersAccordion areas={careerAreas} />
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

const FOOTER_LINKS: { group: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    group: "Ecosystem",
    links: [
      { label: "Products", href: "#products" },
      { label: "Services", href: "#services" },
      { label: "Careers",  href: "#careers"  },
    ],
  },
  {
    group: "Company",
    links: [
      { label: "About",    href: "#about"                               },
      { label: "Contact",  href: "https://www.sagittalabs.com/contact", external: true },
      { label: "Security", href: "https://www.sagittalabs.com/security", external: true },
      { label: "Legal",    href: "/legal"                               },
    ],
  },
  {
    group: "Resources",
    links: [
      { label: "Whitepaper", href: "https://sagitta-protocol.gitbook.io/sagitta-whitepaper", external: true },
      { label: "Use Cases",  href: "https://www.sagittalabs.com/use-cases",                 external: true },
      { label: "Status",     href: "/status"                                                               },
    ],
  },
];

function Footer() {
  return (
    <footer id="contact" className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/sagitta.png"
                alt="Sagitta Systems"
                width={16}
                height={16}
                className="object-contain opacity-60"
              />
              <span
                className="text-xs tracking-widest uppercase font-semibold"
                style={{ color: "var(--text-secondary)", letterSpacing: "0.15em" }}
              >
                Sagitta Systems
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              Decision intelligence, DeFi continuity, and capital management infrastructure.
            </p>
          </div>

          {/* Link groups */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.group}>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--text-tertiary)", letterSpacing: "0.1em" }}
              >
                {group.group}
              </p>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-xs transition-colors duration-150 hover:opacity-80"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            © {new Date().getFullYear()} Sagitta Systems. All rights reserved.
          </span>
          <a
            href="mailto:contact@sagitta.systems"
            className="text-xs transition-opacity duration-150 hover:opacity-70"
            style={{ color: "var(--text-tertiary)" }}
          >
            contact@sagitta.systems
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-widest mb-2"
      style={{ color: "var(--accent)", letterSpacing: "0.13em" }}
    >
      {children}
    </p>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        {title}
      </h2>
      <p className="text-sm max-w-lg" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
