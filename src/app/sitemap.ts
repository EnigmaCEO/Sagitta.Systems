import type { MetadataRoute } from "next";
import { publicCareers } from "@/content/careers";
import { newsroomEntryPath, publishedEntries } from "@/content/newsroom";
import { primaryNav, site, utilityNav } from "@/content/site";
import { capabilities, systems } from "@/content/systems";

/**
 * Emitted as `out/sitemap.xml` by the static export.
 *
 * ── Why this is derived rather than listed ───────────────────────────────────
 *
 * Every entry comes from the same source the route itself is generated from:
 * the two nav collections for the fixed pages, and the same collections each
 * `generateStaticParams` reads for the three dynamic segments. A record that is
 * unpublished, internal, or archived out of a collection therefore leaves the
 * sitemap in the same commit that removes its route — there is no second list
 * to keep in step, which is the usual way a sitemap starts advertising 404s.
 *
 * The `check:links` reconciliation is what proves this holds: it fails if the
 * sitemap names a route the export does not contain.
 *
 * ── lastModified ─────────────────────────────────────────────────────────────
 *
 * Six of the published newsroom records carry no date, because their sources
 * state none (CONTENT_AUDIT.md §4). Those entries omit `lastModified` rather
 * than substituting the build date, which would be an inferred date published
 * as a real one — the same rule the rest of the content layer follows.
 *
 * `changeFrequency` and `priority` are deliberately omitted because Google
 * ignores them. A trustworthy source date is emitted as `lastModified`; fixed
 * and system routes omit it until their content model records one.
 */

// Required by `output: "export"`, which will not build a metadata route that
// has not declared itself static. See the note in `robots.ts`.
export const dynamic = "force-static";

/** The fixed pages, taken from the navigation the site actually renders. */
const fixedRoutes = ["/", ...primaryNav.map((l) => l.href), ...utilityNav.map((l) => l.href)];

function entry(
  path: string,
  lastModified: string | null | undefined,
): MetadataRoute.Sitemap[number] {
  return {
    url: new URL(path, site.url).toString(),
    ...(lastModified ? { lastModified } : {}),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...fixedRoutes.map((path) => entry(path, undefined)),
    ...["/defense", "/defense/reviews"].map((path) => entry(path, undefined)),

    // Systems and capabilities share the /systems/[slug] segment, and this
    // mirrors that route's generateStaticParams exactly.
    ...systems.map((s) => entry(`/systems/${s.slug}`, undefined)),
    ...capabilities.map((c) => entry(`/systems/${c.slug}`, undefined)),

    ...publishedEntries.map((e) =>
      entry(newsroomEntryPath(e), e.updatedAt ?? e.publishedAt),
    ),

    ...publicCareers.map((c) =>
      entry(`/careers/${c.slug}`, c.updatedAt ?? c.publishedAt),
    ),
  ];
}
