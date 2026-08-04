import { notFound } from "next/navigation";
import { feedDesks, renderFeed } from "@/lib/feed";
import type { DeskId } from "@/content/types";

/**
 * Per-desk feeds, emitted as `out/newsroom/feeds/<desk>/feed.xml`.
 *
 * ── Why they live under /newsroom/feeds/ ─────────────────────────────────────
 *
 * The obvious path is `/newsroom/<desk>/feed.xml`, and it cannot be used: the
 * `/newsroom/[slug]` record route already owns that position, and Next requires
 * sibling dynamic segments to share one parameter name. Nesting under `feeds/`
 * sidesteps the collision and avoids the other problem the obvious path has —
 * `/newsroom/policy-notes` is not a record, so a desk feed there would sit
 * beneath a parent that 404s.
 *
 * Only desks with at least one dated published record are generated, so
 * subscribing to a desk can never return an empty document. An upcoming desk is
 * presented as upcoming on the newsroom page and routes no feed at all, which
 * mirrors the desk model itself: `state` is derived from whether records exist,
 * not from intent.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return feedDesks.map((desk) => ({ desk }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ desk: string }> },
) {
  const { desk } = await params;
  if (!feedDesks.includes(desk as DeskId)) notFound();

  return new Response(renderFeed(desk as DeskId), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
