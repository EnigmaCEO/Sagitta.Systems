import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Emitted as `out/robots.txt` by the static export.
 *
 * Everything on this site is a public record intended to be read, including by
 * a journalist arriving from a search result, so nothing is disallowed. The
 * file exists to point crawlers at the sitemap rather than to withhold routes:
 * a 58-page export with no sitemap reference leaves discovery to link-following
 * alone.
 *
 * Rendering resources are intentionally crawlable. Search engines need the
 * exported CSS and JavaScript under `/_next/` to render pages accurately.
 */
// Metadata routes are Route Handlers, and `output: "export"` refuses to build
// one that has not declared itself static — it cannot know that this function
// reads nothing per-request. Without this the build fails outright at "Collect
// page data" rather than silently omitting the file.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
