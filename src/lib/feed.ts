import { desks } from "@/content/desks";
import { publishedEntries, sortByDate } from "@/content/newsroom";
import { site } from "@/content/site";
import type { DeskId, NewsroomEntry } from "@/content/types";

/**
 * RSS 2.0 generation for the newsroom.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 *
 * The newsroom is built as a publication — editorial desks with declared
 * cadences, media types, dated records — and until now a reader had no way to
 * subscribe to any of it. Every visit terminated. The content layer's own
 * provenance notes show Sagitta reading *other* publications' feeds (Paragraph's
 * RSS, the YouTube channel's RSS) to assemble these records while publishing
 * none of its own.
 *
 * ── The rules it follows ─────────────────────────────────────────────────────
 *
 * The feed is derived from `publishedEntries`, the same collection the newsroom
 * routes and the sitemap read. A record that is drafted, internal, or archived
 * out of that collection leaves the feed in the same commit that removes its
 * page — there is no second list to keep in step.
 *
 * Three decisions carried over from the rest of the content layer:
 *
 *   - **An undated record is omitted, not dated.** `pubDate` is the property a
 *     reader's client sorts on and RSS has no way to say "date unknown". Two
 *     published records state no date because their sources state none
 *     (CONTENT_AUDIT.md §4); substituting the build date would publish an
 *     inferred date as a real one. They keep their pages and stay out of the
 *     feed.
 *   - **`link` is always the hub record**, never the external publication, even
 *     where the canonical text lives on Paragraph or LinkedIn. The hub record is
 *     what this feed is a feed of, and it carries the route onward.
 *   - **The description is the record's own summary and body**, so a subscriber
 *     reading in a client gets the actual treatment rather than a teaser. This
 *     is only worth doing because the bodies are real; against the two-sentence
 *     stubs they replaced it would have been an empty feed with extra steps.
 */

const FEED_TITLE = `${site.name} — Newsroom`;
const FEED_DESCRIPTION =
  "The public record of the Sagitta Systems network: launches, operating-state verifications, research notes, and continuity and allocation writing.";

/** XML text escaping. Applied to every interpolated value without exception. */
function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function abs(path: string): string {
  return new URL(path, site.url).toString();
}

/** RFC 822, which is what RSS 2.0 requires — not ISO 8601. */
function rfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

/**
 * The entries a feed may carry: published, public, and dated, newest first.
 * Undated records are excluded here rather than at the call site so no feed
 * variant can accidentally include one.
 */
export function feedEntries(desk?: DeskId): NewsroomEntry[] {
  const scoped = desk ? publishedEntries.filter((e) => e.desk === desk) : publishedEntries;
  return sortByDate(scoped.filter((e) => Boolean(e.publishedAt)));
}

function item(entry: NewsroomEntry): string {
  const url = abs(`/newsroom/${entry.slug}`);
  const description = [entry.summary, ...entry.body].join("\n\n");
  const deskName = desks.find((d) => d.id === entry.desk)?.name;

  return [
    "    <item>",
    `      <title>${xml(entry.title)}</title>`,
    `      <link>${xml(url)}</link>`,
    // Permanent and unique. The slug is stable; the URL is derived from it.
    `      <guid isPermaLink="true">${xml(url)}</guid>`,
    `      <pubDate>${xml(rfc822(entry.publishedAt as string))}</pubDate>`,
    `      <description>${xml(description)}</description>`,
    `      <category>${xml(entry.mediaType)}</category>`,
    deskName ? `      <category>${xml(deskName)}</category>` : null,
    // The author field is the record's stated author, which is an organisation
    // on all but the two founder articles. RSS expects an email address in
    // <author>, which is not published per-record, so dc:creator carries the
    // name instead of putting a fabricated address in a standard field.
    `      <dc:creator>${xml(entry.author)}</dc:creator>`,
    entry.heroImage
      ? `      <enclosure url="${xml(abs(entry.heroImage))}" type="${xml(
          entry.heroImage.endsWith(".png") ? "image/png" : "image/jpeg",
        )}" length="0" />`
      : null,
    "    </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * A complete RSS 2.0 document. `desk` scopes it to a single editorial desk;
 * omitting it produces the network-wide feed.
 */
export function renderFeed(desk?: DeskId): string {
  const entries = feedEntries(desk);
  const deskRecord = desk ? desks.find((d) => d.id === desk) : undefined;
  const path = desk ? `/newsroom/${desk}/feed.xml` : "/newsroom/feed.xml";

  const title = deskRecord ? `${FEED_TITLE} — ${deskRecord.name}` : FEED_TITLE;
  const description = deskRecord?.summary ?? FEED_DESCRIPTION;

  // The most recent published record, not the build time: a rebuild that
  // changes nothing should not advertise itself as new.
  const latest = entries[0]?.publishedAt;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${xml(title)}</title>`,
    `    <link>${xml(abs("/newsroom"))}</link>`,
    `    <description>${xml(description)}</description>`,
    "    <language>en</language>",
    `    <atom:link href="${xml(abs(path))}" rel="self" type="application/rss+xml" />`,
    latest ? `    <lastBuildDate>${xml(rfc822(latest))}</lastBuildDate>` : null,
    `    <image>`,
    `      <url>${xml(abs(site.mark))}</url>`,
    `      <title>${xml(title)}</title>`,
    `      <link>${xml(abs("/newsroom"))}</link>`,
    `    </image>`,
    ...entries.map(item),
    "  </channel>",
    "</rss>",
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/** Desks with at least one dated published record, so no empty feed is routed. */
export const feedDesks: DeskId[] = desks
  .map((d) => d.id)
  .filter((id) => feedEntries(id).length > 0);
