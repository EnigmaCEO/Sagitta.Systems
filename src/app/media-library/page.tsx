import Image from "next/image";
import Link from "@/components/Link";
import EmptyState from "@/components/EmptyState";
import PageHero from "@/components/PageHero";
import SectionHeading, { Section } from "@/components/SectionHeading";
import StoryCard from "@/components/StoryCard";
import { MetaBadge } from "@/components/MediaTypeBadge";
import { ExternalArrow } from "@/components/icons";
import { artifactKindLabels, getSystemName, latestEntries, publicArtifacts, site } from "@/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Media Library",
  description:
    "Marks, wordmarks, diagrams, and mixed-media records published by Sagitta Systems, organised by resource type and related system.",
  path: "/media-library",
  ogImage: "/og/press.png",
});

// A wordmark is typed separately from a mark because the two are not
// interchangeable at any size: one is a square product mark for icon-scale use,
// the other a horizontal name lockup. Anyone taking an asset from here needs to
// know which they are getting before they place it.
type AssetType = "Mark" | "Wordmark" | "Diagram";

interface Asset {
  src: string;
  name: string;
  type: AssetType;
  /** What the asset is for, stated rather than implied. */
  intendedUse: string;
  /** Slug of the related system, where one applies. */
  systemSlug?: string;
  format: string;
  /** Reproduction rules, where any apply. */
  usage?: string;
}

/**
 * Every asset a journalist would actually reproduce.
 *
 * Provenance: the marks, the constellation graphic, and the architecture
 * diagram are pre-existing Sagitta material carried forward unchanged — no
 * third-party imagery, no depiction of a product surface that does not exist.
 *
 * ── Why the Open Graph cards are not listed here ─────────────────────────────
 *
 * They were, as ten of the twenty entries, and they were the wrong thing in
 * the wrong place. A social card is a machine asset: its whole job is to be
 * fetched by a crawler from a `<meta>` tag, which it does through
 * `buildMetadata`. Nobody reproducing Sagitta in an article needs to download
 * a link preview, so ten of the entries here had no reader, and they crowded
 * out the marks and diagrams that do.
 *
 * Listing them also published them as cleared, downloadable press material —
 * which is how three of them came to be handed to journalists while asserting
 * a system count the site had corrected, a capability presented as a system,
 * and a product the content check forbids by name. The cards still exist and
 * are still served; they are simply not press assets, and they are now derived
 * from the content layer and checked by `npm run check:og`.
 */
const assets: Asset[] = [
  {
    src: "/sagitta.png",
    name: "Sagitta Systems mark",
    type: "Mark",
    intendedUse: "Primary identifier for Sagitta Systems in articles and listings.",
    format: "PNG",
    usage: "Reproduce unmodified. Do not recolour, rotate, or add an attribution lockup.",
  },
  {
    src: "/sagitta-hero.png",
    name: "Constellation graphic",
    type: "Diagram",
    intendedUse: "The Sagitta constellation, used as a brand image.",
    format: "PNG",
  },
  {
    src: "/diagram.png",
    name: "Protocol architecture diagram",
    type: "Diagram",
    intendedUse:
      "Capital flow across Vault, Treasury, Reserve, Escrow, AAA, and SCE. Cleared for press use.",
    systemSlug: "sagitta-protocol",
    format: "PNG",
  },
  {
    src: "/banking-lifecycle.webp",
    name: "Banking account-to-treasury lifecycle diagram",
    type: "Diagram",
    intendedUse:
      "The deposit, settle, execute, and return lifecycle around the Sagitta control layer, with the core banking to USDC to Arc to treasury rail. An architecture brief for a system in development, not a record of a delivered integration.",
    systemSlug: "sagitta-banking",
    format: "WebP",
  },
  {
    src: "/aaa.png",
    name: "AAA mark",
    type: "Mark",
    intendedUse: "Autonomous Allocation Agent product mark.",
    systemSlug: "aaa",
    format: "PNG",
    usage: "Reproduce unmodified.",
  },
  {
    src: "/sce.png",
    name: "SCE mark",
    type: "Mark",
    intendedUse: "Sagitta Continuity Engine product mark.",
    systemSlug: "sagitta-continuity-engine",
    format: "PNG",
    usage: "Reproduce unmodified.",
  },
  {
    src: "/defense.png",
    name: "Defense mark",
    type: "Mark",
    intendedUse: "Sagitta Defense product mark.",
    systemSlug: "sagitta-defense",
    format: "PNG",
    usage: "Reproduce unmodified.",
  },
  {
    src: "/wordmark-sagitta-banking.webp",
    name: "Sagitta Banking wordmark",
    type: "Wordmark",
    intendedUse:
      "Horizontal Sagitta Banking name lockup, 660×190. For headers and lockups with room for a wide asset — it is not a square product mark and does not stand in for one at icon scale.",
    systemSlug: "sagitta-banking",
    format: "WebP",
    usage: "Reproduce unmodified.",
  },
  {
    src: "/radar.png",
    name: "Radar mark",
    type: "Mark",
    intendedUse: "Sagitta Radar product mark.",
    systemSlug: "sagitta-radar",
    format: "PNG",
    usage: "Reproduce unmodified.",
  },
  {
    src: "/protocol.png",
    name: "Protocol mark",
    type: "Mark",
    intendedUse: "Sagitta Protocol product mark.",
    systemSlug: "sagitta-protocol",
    format: "PNG",
    usage: "Reproduce unmodified.",
  },
  {
    src: "/selun.svg",
    name: "Selun mark",
    type: "Mark",
    intendedUse: "Selun product mark.",
    systemSlug: "selun",
    format: "SVG",
    usage: "Reproduce unmodified.",
  },
];

/**
 * Render order for the asset sections.
 *
 * This drives what the page actually shows, so a type missing here is an asset
 * silently withheld rather than a type error — `AssetType[]` accepts a partial
 * list. Adding a member to `AssetType` means adding it here too.
 */
const ASSET_TYPES: AssetType[] = ["Mark", "Wordmark", "Diagram"];

export default function MediaLibraryPage() {
  const richMedia = latestEntries.filter((entry) =>
    ["Audio", "Video", "Data", "Report"].includes(entry.mediaType),
  );

  return (
    <>
      <PageHero
        eyebrow="Media library"
        title="Marks, wordmarks, and diagrams"
        lead="Every asset cleared for reproduction, with what it is for, which system it belongs to, and how it may be used. Organised by resource type."
        actions={[
          {
            label: "Press room",
            href: "/press#brand-assets",
            cta: "media-library:press",
            ctaType: "press",
          },
        ]}
        aside={
          <nav
            aria-label="Asset types"
            className="rounded-xl border p-5"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <p className="eyebrow mb-4" style={{ color: "var(--text-tertiary)" }}>
              {assets.length} public assets
            </p>
            <ul className="space-y-2">
              {ASSET_TYPES.map((type) => (
                <li key={type}>
                  <Link
                    href={`#${slugify(type)}`}
                    className="flex items-baseline justify-between gap-3 text-xs"
                    style={{ color: "var(--gold)" }}
                  >
                    {type}s
                    <span className="tabular-nums" style={{ color: "var(--text-tertiary)" }}>
                      {assets.filter((a) => a.type === type).length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p
              className="text-xs leading-relaxed mt-4 pt-4 border-t"
              style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}
            >
              Marks are reproduced unmodified and never with an added attribution lockup. Questions:{" "}
              {site.contactEmail}
            </p>
          </nav>
        }
      />

      {ASSET_TYPES.map((type, index) => {
        const group = assets.filter((asset) => asset.type === type);
        return (
          <Section
            key={type}
            id={slugify(type)}
            bordered={index > 0}
            tone={index % 2 === 1 ? "raised" : "base"}
          >
            <SectionHeading
              eyebrow={`${group.length} ${group.length === 1 ? "asset" : "assets"}`}
              title={`${type}s`}
              description={DESCRIPTIONS[type]}
            />
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.map((asset) => (
                <li
                  key={asset.src}
                  className="surface-card rounded-xl border overflow-hidden flex flex-col"
                >
                  <div
                    className="flex items-center justify-center p-6 border-b"
                    style={{
                      backgroundColor: "var(--bg-raised)",
                      borderColor: "var(--border)",
                      minHeight: 140,
                    }}
                  >
                    <Image
                      src={asset.src}
                      alt={asset.name}
                      width={320}
                      height={168}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain"
                      style={{ maxHeight: 120, width: "auto" }}
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <MetaBadge tone="quiet">{asset.type}</MetaBadge>
                      <span className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>
                        {asset.format}
                      </span>
                    </div>

                    <p
                      className="text-sm font-semibold mb-1.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {asset.name}
                    </p>

                    <p
                      className="text-xs leading-relaxed mb-3 flex-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {asset.intendedUse}
                    </p>

                    {asset.systemSlug && (
                      <p className="text-xs mb-3">
                        <Link
                          href={`/systems/${asset.systemSlug}`}
                          style={{ color: "var(--gold)" }}
                        >
                          {getSystemName(asset.systemSlug)}
                        </Link>
                      </p>
                    )}

                    {asset.usage && (
                      <p
                        className="text-xs leading-relaxed mb-3 pl-3 border-l"
                        style={{ color: "var(--text-tertiary)", borderColor: "var(--border-strong)" }}
                      >
                        {asset.usage}
                      </p>
                    )}

                    <a
                      href={asset.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      data-cta={`asset:${asset.src}`}
                      data-cta-type="press"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto"
                      style={{ color: "var(--gold)" }}
                    >
                      Download {asset.format.split(" · ")[0]}
                      <ExternalArrow size={10} />
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}

      {/* Evidence artifacts — the documents and system outputs the network can
          actually show, each classified by what it establishes. The distinction
          is the point: an architecture brief describes a design, a sample
          output is a specimen of a deliverable, and neither is a customer
          result. The classification is held in src/content/artifacts.ts and
          rendered here rather than restated. */}
      <Section id="evidence" bordered tone="raised">
        <SectionHeading
          eyebrow={`${publicArtifacts.length} artifacts`}
          title="Evidence and documents"
          description="Documents, diagrams, and system outputs, each recorded with what it actually proves. An architecture brief is not an implemented result, and a sample output is not a customer's."
        />
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publicArtifacts.map((artifact) => (
            <li key={artifact.id} className="surface-card rounded-xl border p-5 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <MetaBadge tone="quiet">{artifactKindLabels[artifact.kind]}</MetaBadge>
                <span className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>
                  {artifact.medium.toUpperCase()}
                </span>
                {artifact.pageCount !== undefined && (
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {artifact.pageCount} pages
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                {artifact.title}
              </p>

              <p
                className="text-xs leading-relaxed mb-3 flex-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {artifact.proves}
              </p>

              <p className="text-xs mb-3">
                <Link href={`/systems/${artifact.systemSlug}`} style={{ color: "var(--gold)" }}>
                  {getSystemName(artifact.systemSlug)}
                </Link>
              </p>

              {artifact.publicUrl &&
                (artifact.publicUrl.startsWith("http") ? (
                  <a
                    href={artifact.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta={`artifact:${artifact.id}`}
                    data-cta-type="evidence"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto"
                    style={{ color: "var(--gold)" }}
                  >
                    Open the {artifactKindLabels[artifact.kind].toLowerCase()}
                    <ExternalArrow size={10} />
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link
                    href={artifact.publicUrl}
                    data-cta={`artifact:${artifact.id}`}
                    data-cta-type="evidence"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto"
                    style={{ color: "var(--gold)" }}
                  >
                    Open the {artifactKindLabels[artifact.kind].toLowerCase()}
                  </Link>
                ))}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="mixed-media">
        <SectionHeading
          eyebrow="Mixed media"
          title="Data and reports in the newsroom"
          description="Mixed-media records held in the newsroom index. Audio and video are supported by the newsroom's components; nothing has been recorded yet, so nothing is listed."
          action={{ label: "Newsroom", href: "/newsroom" }}
        />
        {richMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {richMedia.map((entry) => (
              <StoryCard key={entry.slug} entry={entry} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No mixed-media records yet"
            action={{ label: "Newsroom", href: "/newsroom" }}
          />
        )}
      </Section>
    </>
  );
}

const DESCRIPTIONS: Record<AssetType, string> = {
  Mark: "Product and network marks. Reproduce unmodified and never with an added attribution lockup.",
  Wordmark:
    "Horizontal name lockups, where the mark and the system's name are set together. Wider than they are tall — give them a lockup slot rather than an icon box, and do not substitute one for a product mark.",
  Diagram: "Technical and architectural imagery cleared for publication.",
};

function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "-");
}
