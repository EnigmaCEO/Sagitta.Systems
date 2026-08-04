import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * The site's internal link.
 *
 * It is `next/link` with prefetching off by default, and it exists so that
 * decision is made in one place rather than 64.
 *
 * ── Why prefetching is off ───────────────────────────────────────────────────
 *
 * Sagitta Systems ships as a static export. Every route is already a small
 * prerendered HTML file on disk, so prefetching buys very little here — there
 * is no server render to warm up and no data fetch to start early.
 *
 * It also does not currently work. Next 16's segment-level prefetching asks for
 * payload files under a dot-separated name — `/systems/__next.systems.__PAGE__.txt`
 * — while `output: "export"` writes them into nested directories, as
 * `out/systems/__next.systems.txt`. Every prefetch therefore 404s. That is an
 * upstream bug (vercel/next.js#85374) affecting static exports generally, not
 * something in this repository.
 *
 * The 404s were harmless — navigation falls back to a normal request and works
 * correctly — but they were real network requests that could never succeed, on
 * every link in the viewport, plus console noise on every page. Turning
 * prefetch off removes the requests without losing anything that was working.
 *
 * ── When this can be reverted ────────────────────────────────────────────────
 *
 * When the upstream path mismatch is fixed, delete the `prefetch` default here
 * and the `no-restricted-imports` rule in `eslint.config.mjs`. Nothing else has
 * to change: every link in the site already routes through this component.
 *
 * An individual link can still opt back in with `prefetch`, which is why the
 * prop is forwarded rather than stripped.
 */
export default function Link({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
