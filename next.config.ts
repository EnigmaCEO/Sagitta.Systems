import type { NextConfig } from "next";

/**
 * Sagitta Systems ships as a static export: every route is prerendered to HTML
 * in `out/` and served as files. There is no Node server in production, which
 * is why the export tests assert against the real shipped HTML.
 *
 * ── Build: `next build --webpack` ────────────────────────────────────────────
 *
 * Next 16 made Turbopack the default builder. Turbopack cannot build this app:
 * it fails collecting page data for the App Router's `/_not-found` route with
 * `PageNotFoundError: Cannot find module for page: /_not-found`, before any of
 * our own code runs. `src/app/not-found.tsx` is an ordinary component with two
 * `next/link`s in it, and the webpack builder exports the same app cleanly, so
 * this is a Turbopack limitation with `output: "export"` rather than something
 * to fix here.
 *
 * `--webpack` is Next's own documented opt-out. Development still uses
 * Turbopack by default, so only the production build takes the slower path.
 * Retry the default builder on a future minor and drop the flag when it works —
 * `npm run build` is the only place it is set.
 */
const nextConfig: NextConfig = {
  output: "export",
  // No image optimizer in a static export, so `next/image` serves the files as
  // authored. This is also why Next's optional `sharp` dependency is never
  // loaded at build or run time.
  images: { unoptimized: true },
};

export default nextConfig;
