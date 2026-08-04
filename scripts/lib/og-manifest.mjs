// The record of what copy the committed Open Graph cards were rendered from.
//
// ── Why a manifest ───────────────────────────────────────────────────────────
//
// The cards are PNGs. Their text cannot be read back out of them, so there is
// no way to check a committed card against the content layer by inspecting the
// card itself — which is precisely how three of them came to be publishing
// facts the site had already corrected.
//
// So the generator writes down what it rendered, and `check:og` recomputes the
// card set from the current content layer and compares. If the model changes
// and the cards are not regenerated, the two disagree and the build fails with
// the exact card and field that drifted.
//
// This is not `public/`: it is an internal build record, not something served.
//
// ── Why check:og rather than build:og in verify ──────────────────────────────
//
// Running the generator inside `npm run verify` would rewrite ten committed
// binaries on every verification, making the command non-idempotent and
// putting image output in the diff of unrelated work. It would also give the
// static export an image-generation dependency the build deliberately does not
// have. The drift check catches the same failure — stale cards — without any
// of that, and it runs in milliseconds because it renders nothing.

import path from "node:path";

export const MANIFEST_PATH = path.join(process.cwd(), "scripts", "og.manifest.json");

/**
 * The comparable shape of a card set: file, and every string that is rendered
 * onto the image. Accent colours are excluded — they are design tokens rather
 * than claims, and a palette change is not a factual drift.
 */
export function manifestFor(cards) {
  return {
    generatedFrom: "src/content — via scripts/lib/og-cards.mjs",
    cards: cards
      .map(({ file, eyebrow, title, subtitle, footer }) => ({
        file,
        eyebrow,
        title,
        subtitle,
        footer,
      }))
      .sort((a, b) => a.file.localeCompare(b.file)),
  };
}
