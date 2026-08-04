// Structural check for the exported site.
//
// The repository has no unit-test framework, so this is the automated check for
// the structure: it walks the static export in out/, collects every internal
// href, and fails if any of them does not resolve to an exported page or asset.
// It also asserts that every route required by the site architecture was
// exported, and reconciles Next's "Generating static pages (N/N)" figure with
// the number of HTML files that actually land in out/.
//
// Usage: npm run build && npm run check:links

import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "out");

const REQUIRED_ROUTES = [
  "/",
  "/systems",
  "/newsroom",
  "/roadmap",
  "/careers",
  "/about",
  "/press",
  "/media-library",
  "/documentation",
  "/contact",
  "/legal",
  "/status",
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_next") continue;
      files.push(...(await walk(full)));
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function resolvesInExport(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "" || clean === "/") return existsSync(path.join(OUT, "index.html"));
  const target = path.join(OUT, clean);
  return (
    existsSync(`${target}.html`) ||
    existsSync(path.join(target, "index.html")) ||
    existsSync(target)
  );
}

async function main() {
  if (!existsSync(OUT)) {
    console.error("out/ not found — run `npm run build` first.");
    process.exit(1);
  }

  const failures = [];

  for (const route of REQUIRED_ROUTES) {
    if (!resolvesInExport(route)) failures.push(`missing required route: ${route}`);
  }

  const pages = await walk(OUT);
  let checked = 0;

  for (const page of pages) {
    const html = await readFile(page, "utf8");
    const rel = `/${path.relative(OUT, page).replace(/\\/g, "/")}`;
    for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
      const href = match[1];
      if (href.startsWith("//") || href.startsWith("/_next/")) continue;
      checked += 1;
      if (!resolvesInExport(href)) failures.push(`${rel} → broken internal link ${href}`);
    }
  }

  failures.push(...checkSitemap());

  const unique = [...new Set(failures)];
  if (unique.length > 0) {
    console.error(`Structural check failed (${unique.length} problems):`);
    for (const failure of unique) console.error(`  - ${failure}`);
    process.exit(1);
  }

  const outStat = await stat(OUT);
  console.log(
    `Structural check passed: ${pages.length} exported pages, ${checked} internal links resolved, ${sitemapLocs().length} sitemap entries all resolving (export built ${outStat.mtime.toISOString()}).`,
  );

  const reconciliation = reconcileRouteCount(pages.length);
  console.log(reconciliation.report);
  if (!reconciliation.ok) process.exit(1);
}

/**
 * The `<loc>` paths in the generated sitemap, as site-relative routes.
 *
 * Returns [] when there is no sitemap, so the absence of one is reported by the
 * required-route check rather than silently passing here.
 */
function sitemapLocs() {
  const sitemapPath = path.join(OUT, "sitemap.xml");
  if (!existsSync(sitemapPath)) return [];

  const xml = readFileSync(sitemapPath, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    const loc = m[1].trim();
    return loc.startsWith("http") ? new URL(loc).pathname : loc;
  });
}

/**
 * Fails if the sitemap advertises a route the export does not contain.
 *
 * `src/app/sitemap.ts` derives every entry from the same collections the routes
 * are generated from, so the two cannot drift by construction — this is the
 * assertion that keeps that property true if someone later hand-lists a route.
 * A sitemap full of 404s is worse than no sitemap: it is the one file a crawler
 * treats as authoritative.
 */
function checkSitemap() {
  const sitemapPath = path.join(OUT, "sitemap.xml");
  if (!existsSync(sitemapPath)) return ["missing sitemap: out/sitemap.xml was not exported"];
  if (!existsSync(path.join(OUT, "robots.txt"))) {
    return ["missing robots: out/robots.txt was not exported"];
  }

  const locs = sitemapLocs();
  const failures = locs
    .filter((route) => !resolvesInExport(route))
    .map((route) => `sitemap → advertises unexported route ${route}`);

  // A route in the export that the sitemap never names is not necessarily a
  // fault — but every page a reader can reach should be discoverable, so the
  // two lists are compared in both directions.
  const listed = new Set(locs.map((r) => (r === "/" ? "/" : r.replace(/\/$/, ""))));
  for (const route of REQUIRED_ROUTES) {
    if (!listed.has(route)) failures.push(`sitemap → omits required route ${route}`);
  }

  return failures;
}

/**
 * Reconciles Next's "Generating static pages (N/N)" total with the HTML file
 * count in out/.
 *
 * The point of this is that neither number is self-explanatory: the build
 * renders internal routes that are never exported, and exports one file twice.
 * Without a reconciliation, a genuinely missing page looks exactly like the
 * normal discrepancy.
 *
 * Next 16 changed the arithmetic, so the model here is derived from the
 * prerender manifest rather than from constants:
 *
 *   - `prerender-manifest.routes` now lists `/_not-found` and `/_global-error`
 *     alongside the real routes. Next 15 listed neither, which is why this
 *     function used to add one for `/_not-found` by hand. Doing that now
 *     double-counts it.
 *   - `/_global-error` is rendered but never written to out/. It is the only
 *     route in the manifest with no exported file.
 *   - `/_not-found` is written twice: once as `_not-found.html` and once as
 *     `404.html`, which is the file a static host actually serves. Next 15
 *     wrote only `404.html`.
 *   - The Pages Router fallbacks in `.next/server/pages` still exist on disk
 *     but are no longer part of the build's static-page total, so they are
 *     reported for context and not added to it.
 *
 * The result is that the generated total and the exported total are both equal
 * to the manifest route count — but for offsetting reasons, and it is the
 * reasons that need to hold, not the coincidence.
 */

/** Manifest routes Next renders internally and never writes to out/. */
const NEVER_EXPORTED = ["/_global-error"];

/**
 * Metadata routes (`app/robots.ts`, `app/sitemap.ts`) are counted by the build
 * as static pages and appear in the manifest, but they export as `.txt` and
 * `.xml` rather than HTML. They are subtracted from the expected HTML total and
 * asserted to exist as their own files instead — otherwise adding one reads as
 * two missing pages.
 */
function isNonHtmlRoute(route) {
  return /\.[a-z0-9]+$/i.test(route) && !route.endsWith(".html");
}

function reconcileRouteCount(exportedPages) {
  const manifestPath = path.resolve(process.cwd(), ".next/prerender-manifest.json");
  if (!existsSync(manifestPath)) {
    return { ok: true, report: "Route reconciliation skipped: no prerender manifest." };
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const routes = Object.keys(manifest.routes ?? {});
  const generated = routes.length;

  const internal = NEVER_EXPORTED.filter((r) => routes.includes(r));
  const nonHtml = routes.filter(isNonHtmlRoute);
  const missingNonHtml = nonHtml.filter((r) => !existsSync(path.join(OUT, r.replace(/^\//, ""))));

  // /_not-found is exported under its own name and again as 404.html.
  const notFoundDuplicate =
    routes.includes("/_not-found") && existsSync(path.join(OUT, "404.html")) ? 1 : 0;

  const expectedExported = generated - internal.length - nonHtml.length + notFoundDuplicate;
  const ok = expectedExported === exportedPages && missingNonHtml.length === 0;
  const status = ok ? "reconciled" : "MISMATCH";

  const pagesDir = path.resolve(process.cwd(), ".next/server/pages");
  const fallbacks = ["404.html", "500.html"].filter((f) => existsSync(path.join(pagesDir, f)));

  const report = [
    `Route count ${status}: build generates ${generated} static pages, out/ holds ${exportedPages} HTML files.`,
    `  ${generated} prerendered routes in the manifest`,
    `  - ${internal.length} rendered but never exported (${internal.join(", ") || "none"})`,
    `  - ${nonHtml.length} exported as non-HTML metadata routes (${nonHtml.join(", ") || "none"})`,
    `  + ${notFoundDuplicate} extra file: /_not-found is also written as 404.html`,
    `  = ${expectedExported} expected in out/`,
    missingNonHtml.length ? `  MISSING metadata files: ${missingNonHtml.join(", ")}` : "",
    fallbacks.length
      ? `  (${fallbacks.join(", ")} also sit in .next/server/pages — Pages Router fallbacks, not part of the export or the total)`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return { ok, report };
}

main();
