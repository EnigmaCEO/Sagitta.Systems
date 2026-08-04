// Open Graph card drift check.
//
// Recomputes the card set from the current content layer and compares it to
// the manifest the generator wrote when the committed PNGs were last produced.
// A disagreement means the model changed and the cards were not regenerated —
// so the site is publishing a social preview that contradicts its own record.
//
// This is the check that would have caught, on the day it happened, that
// systems.png said "Ten systems" against a directory of eight, that the
// allocation family card listed a capability as a system, and that the capital
// family card named a product the content check forbids by name.
//
// Usage: npm run check:og

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { loadContent } from "./lib/content.mjs";
import { buildCards } from "./lib/og-cards.mjs";
import { MANIFEST_PATH, manifestFor } from "./lib/og-manifest.mjs";

const OG_DIR = path.join(process.cwd(), "public", "og");

const problems = [];
const fail = (message) => problems.push(message);

function main() {
  if (!existsSync(MANIFEST_PATH)) {
    console.error(
      "scripts/og.manifest.json is missing — run `npm run build:og` to generate the cards and record what they say.",
    );
    process.exit(1);
  }

  const expected = manifestFor(buildCards(loadContent()));
  const actual = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));

  const byFile = new Map(actual.cards.map((c) => [c.file, c]));

  for (const card of expected.cards) {
    const rendered = byFile.get(card.file);
    if (!rendered) {
      fail(`${card.file}: the card set defines it but no committed card records it`);
      continue;
    }
    byFile.delete(card.file);

    for (const field of ["eyebrow", "title", "subtitle", "footer"]) {
      if (rendered[field] !== card[field]) {
        fail(
          `${card.file} ${field}:\n      committed: ${rendered[field]}\n      content layer: ${card[field]}`,
        );
      }
    }

    // A recorded card whose file was deleted would pass the copy comparison
    // and then 404 on every share.
    if (!existsSync(path.join(OG_DIR, card.file)))
      fail(`${card.file}: recorded in the manifest but not present in public/og/`);
  }

  for (const orphan of byFile.keys()) {
    fail(`${orphan}: committed as a card but the content layer no longer defines it`);
  }

  if (problems.length > 0) {
    console.error(
      `Open Graph cards are out of date (${problems.length} ${
        problems.length === 1 ? "problem" : "problems"
      }).`,
    );
    console.error("The committed cards no longer match the content layer:\n");
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error("\nRun `npm run build:og` to regenerate them, and commit the PNGs.");
    process.exit(1);
  }

  console.log(
    `Open Graph cards are current: ${expected.cards.length} cards match the content layer.`,
  );
}

try {
  main();
} catch (error) {
  console.error("Open Graph card check could not run:", error);
  process.exit(1);
}
