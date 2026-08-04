import { publicPeople } from "@/content/people";
import { promotionChannelRecords, promotions } from "@/content/promotions";
import { site } from "@/content/site";
import type { NewsroomEntry, Person } from "@/content/types";

/**
 * Structured data for the hub.
 *
 * ── The rule this file follows ───────────────────────────────────────────────
 *
 * Structured data is a machine-readable restatement of what the page already
 * publishes. Every value here is read from the content layer, so nothing is
 * asserted to a crawler that a reader cannot also see and that the audit has
 * not already cleared. Where the content layer has no value, the property is
 * omitted rather than filled — the same rule the rest of the site follows for
 * unpublished dates and pending fields.
 *
 * Three things are deliberately *not* emitted, and each omission is a decision:
 *
 *   - **No `parentOrganization` for Sagitta Labs.** Labs is an umbrella brand
 *     and explicitly not an incorporated entity (CONTENT_AUDIT.md §0). A
 *     `parentOrganization` edge would publish a corporate relationship the
 *     record does not support, and the content check already forbids describing
 *     Labs as an entity in prose.
 *   - **No YouTube in `sameAs`.** The channel is Sagitta Labs', not Sagitta
 *     Systems'. `sameAs` means *the same entity*, so listing it would conflate
 *     the two identities the audit works to keep apart. The rule is encoded in
 *     `SAME_AS_EXCLUDED` rather than left to whoever edits this next.
 *   - **No `JobPosting`.** Twelve of thirteen roles publish no compensation,
 *     first deliverable, or required experience by decision (§4). A JobPosting
 *     without them is a thin result, and emitting one would push the site to
 *     advertise exactly the fields it deliberately withholds.
 */

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

function abs(pathOrUrl: string): string {
  return new URL(pathOrUrl, site.url).toString();
}

/**
 * Channels whose account is not Sagitta Systems' own. See the note above:
 * `sameAs` is an identity claim, not a link list.
 *
 *   - `youtube`  belongs to Sagitta Labs, the umbrella brand.
 *   - `linkedin` is Xavier D. Moore's personal profile, resolved 2026-08-02.
 *     It is a real, verified destination and it is published on the site — but
 *     it identifies a person, not the organisation, so it attaches to the
 *     `Person` node through `personLd` instead. Listing it here would assert
 *     that the founder and the organisation are the same entity.
 */
const SAME_AS_EXCLUDED = new Set([
  "sagitta-systems",
  "sagitta-product",
  "youtube",
  "linkedin",
]);

/** Resolved third-party profiles that are Sagitta Systems' own. */
function sameAs(): string[] {
  return promotionChannelRecords
    .filter(
      (c) =>
        c.visibility === "public" &&
        c.publicationState === "published" &&
        c.active &&
        c.url &&
        !SAME_AS_EXCLUDED.has(c.id),
    )
    .map((c) => c.url as string);
}

export function organizationLd() {
  const profiles = sameAs();

  // The one published leadership profile, linked by reference rather than
  // restated. `/about` emits the full `Person` node; this edge is what connects
  // the two, and without it the founder and the organisation sit in the graph
  // as unrelated entities. The validator holds `people` at exactly one record,
  // so this cannot silently become a list.
  const [founder] = publicPeople;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    description: site.identity,
    logo: { "@type": "ImageObject", url: abs(site.mark) },
    email: site.contactEmail,
    ...(founder
      ? { founder: { "@type": "Person", "@id": personId(founder), name: founder.name } }
      : {}),
    ...(profiles.length ? { sameAs: profiles } : {}),
  };
}

export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: { "@id": ORG_ID },
  };
}

/**
 * Stable identifier for a person, so `organizationLd`'s `founder` edge and the
 * `Person` node emitted on /about resolve to the same entity instead of two.
 */
function personId(person: Person): string {
  return `${site.url}/about#${person.slug}`;
}

export function personLd(person: Person) {
  // Includes the LinkedIn profile resolved on 2026-08-02. It belongs here
  // rather than on the organisation: `sameAs` is an identity claim, and that
  // profile identifies the founder, not Sagitta Systems.
  const external = person.links?.filter((l) => l.external).map((l) => l.href) ?? [];
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(person),
    name: person.name,
    jobTitle: person.role,
    description: person.pressBio,
    worksFor: { "@id": ORG_ID },
    knowsAbout: person.experience,
    ...(person.photo ? { image: abs(person.photo) } : {}),
    ...(external.length ? { sameAs: external } : {}),
  };
}

/**
 * `VideoObject` for a newsroom record that carries a real video.
 *
 * Emitted only from what the sources actually published. `duration` is present
 * for the Selun video, whose 0:41 runtime is owner-supplied approved source
 * information, and absent for the Protocol overview, because oEmbed returns no
 * runtime for it and none was read elsewhere — the same omission the record
 * itself makes rather than an estimate.
 *
 * `uploadDate` is the record's published date. For the Selun video that is now
 * 2026-03-28, the channel feed's own timestamp: the conflict with the
 * owner-supplied 2026-03-19 was resolved on 2026-08-02 in favour of the date a
 * reader checking the video actually sees, so this property no longer publishes
 * a contested value.
 *
 * `contentUrl` is deliberately not emitted. The video file is YouTube's, not a
 * URL this site can hand a crawler; `embedUrl` and the record page are what
 * exist, and claiming a content URL that resolves to a watch page rather than a
 * video stream would be wrong.
 */
export function videoObjectLd(entry: NewsroomEntry) {
  if (entry.mediaType !== "Video" || !entry.externalUrl || !entry.publishedAt) return null;

  const id = youTubeId(entry.externalUrl);
  if (!id) return null;

  // The runtime is recorded on the promotion rather than the newsroom entry —
  // the Watch stage is what renders it — so it is read from there by video id.
  // The content check already asserts that a promotion's embed id and its
  // action destination are the same video, which is what makes this join safe.
  const runtime = entry.media?.duration ?? promotionRuntime(id);

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: entry.title,
    description: entry.summary,
    uploadDate: entry.publishedAt,
    ...(entry.heroImage ? { thumbnailUrl: [abs(entry.heroImage)] } : {}),
    ...(runtime ? { duration: iso8601Duration(runtime) } : {}),
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    url: abs(`/newsroom/${entry.slug}`),
    publisher: { "@id": ORG_ID },
  };
}

/**
 * The published runtime for a video id, or undefined where no source states
 * one. Undefined is the correct answer for the Protocol overview: oEmbed
 * returns no runtime for it and none was read elsewhere.
 */
function promotionRuntime(videoId: string): string | undefined {
  return promotions.find(
    (p) => p.format === "video-episode" && (p.action?.href ?? "").includes(videoId),
  )?.media?.duration;
}

/** The video id in a YouTube watch URL, or null where the URL is not one. */
function youTubeId(url: string): string | null {
  const match = url.match(/[?&]v=([A-Za-z0-9_-]{6,20})/);
  return match ? match[1] : null;
}

/** "0:41" → "PT41S", "12:05" → "PT12M5S". Returns undefined for anything else. */
function iso8601Duration(duration: string): string | undefined {
  const parts = duration.split(":").map((p) => Number(p));
  if (parts.some((p) => !Number.isInteger(p) || p < 0)) return undefined;
  const [hours, minutes, seconds] =
    parts.length === 3 ? parts : parts.length === 2 ? [0, ...parts] : [0, 0, parts[0]];
  if (seconds === undefined) return undefined;
  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${seconds ? `${seconds}S` : ""}`;
}

/**
 * `BreadcrumbList` for a nested route.
 *
 * Takes the trail the page already renders in its own navigation, so the markup
 * restates the hierarchy a reader can see rather than asserting one of its own.
 * The home item is added here so no caller can forget it and emit a trail that
 * starts halfway down the site.
 */
export function breadcrumbLd(trail: { name: string; path: string }[]) {
  const items = [{ name: site.name, path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: abs(entry.path),
    })),
  };
}

/**
 * `Article` for a newsroom record, or `null` where one should not be emitted.
 *
 * Two records are skipped by design:
 *
 *   - **A record whose canonical publication is elsewhere**
 *     (`externalRole: "canonical"`). Those entries are pointers: the full text
 *     lives on Paragraph, LinkedIn, YouTube, an AAA research-note page, or the
 *     whitepaper's GitBook, and that page is the canonical. Emitting `Article`
 *     here would compete with it and claim the work for this domain. A
 *     `reference` record is the opposite case — the external link is the
 *     product surface the record is *about*, and this page is the canonical.
 *   - **An undated record.** Six published records carry no date because their
 *     sources state none (§4). `datePublished` is the property a crawler most
 *     relies on, and the build date is not it.
 */
export function articleLd(entry: NewsroomEntry) {
  if (entry.externalRole === "canonical" || !entry.publishedAt) return null;

  const url = abs(`/newsroom/${entry.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.summary,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: entry.publishedAt,
    ...(entry.updatedAt ? { dateModified: entry.updatedAt } : {}),
    author: { "@type": "Organization", name: entry.author },
    publisher: { "@id": ORG_ID },
    ...(entry.heroImage ? { image: [abs(entry.heroImage)] } : {}),
  };
}
