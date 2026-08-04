import { renderFeed } from "@/lib/feed";

/**
 * The network-wide newsroom feed, emitted as `out/newsroom/feed.xml`.
 *
 * `output: "export"` will not build a route handler that has not declared
 * itself static — the same constraint `robots.ts` and `sitemap.ts` carry. With
 * it, Next writes the response body to a file at build time and no server is
 * involved in serving it.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(renderFeed(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
