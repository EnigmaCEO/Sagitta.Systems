// Open Graph card generator.
//
// Produces the 1200 × 630 social cards in public/og/ from this site's own
// design tokens and content. Nothing here depicts a product surface, quotes a
// figure, or renders imagery that is not already published on the site — the
// cards are typography, the family accents, and geometric motifs.
//
// This is an *authoring* tool, not a build step. It is run by hand, its output
// is committed, and `npm run verify` never invokes it — so the static export
// has no image-generation dependency and no runtime dependency was added.
//
// Usage: npm run build:og
//
// Rendering uses `next/og`, which ships inside the Next.js dependency already
// present. It renders a flexbox subset of CSS, so everything below is built
// from nested flex containers and bordered circles rather than grid or SVG.

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og.js";
import { loadContent } from "./lib/content.mjs";
import { buildCards } from "./lib/og-cards.mjs";
import { MANIFEST_PATH, manifestFor } from "./lib/og-manifest.mjs";

const OUT_DIR = path.join(process.cwd(), "public", "og");

// ── Tokens, mirrored from src/app/globals.css ────────────────────────────────
const BG = "#04070d";
const BG_RAISED = "#070c16";
const BORDER = "#1b2942";
const BORDER_STRONG = "#2b3f61";
const TEXT_PRIMARY = "#eef2f8";
const TEXT_SECONDARY = "#a2b3c9";
const TEXT_TERTIARY = "#77899f";
const GOLD = "#d9b168";

const FAMILY = {
  continuity: "#4ec8d8",
  allocation: "#a78bfa",
  capital: "#d9b168",
};

const h = (type, props, ...children) => ({
  type,
  props: { ...props, children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children },
});

/** Fine institutional grid, drawn as discrete rules rather than a pattern. */
function grid() {
  const lines = [];
  for (let x = 120; x < 1200; x += 120) {
    lines.push(
      h("div", {
        key: `v${x}`,
        style: {
          position: "absolute",
          left: x,
          top: 0,
          width: 1,
          height: 630,
          background: BORDER,
          opacity: 0.5,
        },
      }),
    );
  }
  for (let y = 105; y < 630; y += 105) {
    lines.push(
      h("div", {
        key: `hz${y}`,
        style: {
          position: "absolute",
          left: 0,
          top: y,
          width: 1200,
          height: 1,
          background: BORDER,
          opacity: 0.5,
        },
      }),
    );
  }
  return h(
    "div",
    { style: { position: "absolute", inset: 0, display: "flex" } },
    ...lines,
  );
}

/**
 * The right-hand motif: concentric rings with nodes on them. Reads as radar
 * sweep, constellation, and orbit at once, which is exactly the overlap the
 * three families share.
 */
function motif(accent, nodes) {
  const rings = [520, 400, 280, 160].map((size, i) =>
    h("div", {
      key: `r${size}`,
      style: {
        position: "absolute",
        left: 980 - size / 2,
        top: 315 - size / 2,
        width: size,
        height: size,
        borderRadius: size,
        border: `1px solid ${accent}`,
        opacity: 0.1 + i * 0.055,
        display: "flex",
      },
    }),
  );

  const dots = nodes.map(([x, y, r, o], i) =>
    h("div", {
      key: `n${i}`,
      style: {
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: r * 2,
        background: accent,
        opacity: o,
        display: "flex",
      },
    }),
  );

  return h(
    "div",
    { style: { position: "absolute", inset: 0, display: "flex" } },
    ...rings,
    ...dots,
  );
}

const NODES = [
  [980, 315, 9, 0.95],
  [860, 205, 6, 0.7],
  [1090, 250, 5, 0.55],
  [900, 440, 6, 0.6],
  [1075, 425, 5, 0.5],
  [760, 315, 4, 0.4],
  [1180, 330, 4, 0.35],
  [980, 120, 4, 0.35],
  [980, 510, 4, 0.35],
  [820, 90, 3, 0.25],
];

/**
 * One card. Layout is fixed across the whole set — wordmark, eyebrow, title,
 * subtitle, footer rule — so the family and section cards read as one family.
 */
function card({ accent, eyebrow, title, subtitle, footer }) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        background: BG,
        backgroundImage: `radial-gradient(ellipse 70% 90% at 78% 45%, ${accent}22 0%, ${BG_RAISED} 55%, ${BG} 100%)`,
        fontFamily: "sans-serif",
      },
    },
    grid(),
    motif(accent, NODES),

    // A gold horizon line along the bottom edge.
    h("div", {
      style: {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: 1200,
        height: 3,
        display: "flex",
        backgroundImage: `linear-gradient(90deg, ${BG} 0%, ${accent} 30%, ${GOLD} 62%, ${BORDER_STRONG} 92%, ${BG} 100%)`,
      },
    }),

    // Content column.
    h(
      "div",
      {
        style: {
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 760,
          height: "100%",
          padding: "64px 0 60px 72px",
        },
      },

      // Wordmark.
      h(
        "div",
        { style: { display: "flex", alignItems: "center" } },
        h("div", {
          style: {
            width: 10,
            height: 10,
            borderRadius: 10,
            background: GOLD,
            marginRight: 14,
            display: "flex",
          },
        }),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 19,
              letterSpacing: 5,
              color: TEXT_PRIMARY,
              fontWeight: 600,
            },
          },
          "SAGITTA SYSTEMS",
        ),
      ),

      // Title block.
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 20,
              letterSpacing: 3.5,
              color: accent,
              fontWeight: 600,
              marginBottom: 22,
            },
          },
          eyebrow.toUpperCase(),
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 60,
              lineHeight: 1.1,
              color: TEXT_PRIMARY,
              fontWeight: 700,
              letterSpacing: -1.6,
              marginBottom: 24,
            },
          },
          title,
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 25,
              lineHeight: 1.45,
              color: TEXT_SECONDARY,
              maxWidth: 660,
            },
          },
          subtitle,
        ),
      ),

      // Footer.
      h(
        "div",
        { style: { display: "flex", alignItems: "center" } },
        h("div", {
          style: { width: 44, height: 2, background: accent, marginRight: 18, display: "flex" },
        }),
        h(
          "div",
          { style: { display: "flex", fontSize: 20, color: TEXT_TERTIARY } },
          footer,
        ),
      ),
    ),
  );
}

// ── The card set ─────────────────────────────────────────────────────────────
//
// Derived from the content layer by scripts/lib/og-cards.mjs, which explains
// why at length: three of these cards were found publishing corrected facts
// because the copy used to be literals in this file. No figure that moves
// appears on a card.

const CARDS = buildCards(loadContent());

/**
 * The renderer emits full-colour PNGs around 350 kB. These cards are flat
 * fields, one gradient, and type, so a 128-colour palette is visually
 * indistinguishable and roughly a tenth the size — which matters, because a
 * social scraper fetches these on every share.
 *
 * `sharp` ships inside the Next.js dependency tree rather than being declared
 * here, so this is best-effort: if it is unavailable the uncompressed PNG is
 * written instead and the script says so. Nothing in `npm run verify` depends
 * on either path.
 */
async function compress(buffer, file) {
  try {
    const { default: sharp } = await import("sharp");
    return await sharp(buffer)
      .png({ palette: true, colours: 128, compressionLevel: 9, effort: 10 })
      .toBuffer();
  } catch {
    console.warn(`  ${file}: sharp unavailable — writing uncompressed PNG`);
    return buffer;
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  let total = 0;
  for (const spec of CARDS) {
    const response = new ImageResponse(card(spec), { width: 1200, height: 630 });
    const raw = Buffer.from(await response.arrayBuffer());

    if (raw.subarray(1, 4).toString() !== "PNG") {
      throw new Error(`${spec.file}: generator did not return a PNG`);
    }

    const buffer = await compress(raw, spec.file);
    writeFileSync(path.join(OUT_DIR, spec.file), buffer);
    total += buffer.length;

    console.log(
      `  ${spec.file.padEnd(26)} ${(buffer.length / 1024).toFixed(1).padStart(7)} kB` +
        `  (from ${(raw.length / 1024).toFixed(0)} kB)`,
    );
  }

  // The record of what was rendered, so `check:og` can detect a card that has
  // fallen behind the content layer without being able to read text out of a
  // PNG. Written last, so a failed render never leaves a manifest claiming
  // cards that were not produced.
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifestFor(CARDS), null, 2)}\n`);

  console.log(
    `\nWrote ${CARDS.length} Open Graph cards at 1200 × 630 to public/og/ (${(total / 1024).toFixed(0)} kB total).`,
  );
  console.log("Wrote scripts/og.manifest.json — run `npm run check:og` to verify it stays current.");
}

main().catch((error) => {
  console.error("Open Graph generation failed:", error);
  process.exit(1);
});
