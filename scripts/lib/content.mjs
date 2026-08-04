// Loads the TypeScript content layer for a Node script.
//
// The content modules are plain typed data with no runtime dependencies, so
// they compile to CommonJS with the TypeScript already in devDependencies and
// can be required directly. Every consumer therefore validates, or generates
// from, the same values the pages import — not a parallel copy that could
// drift.
//
// Extracted from check-content.mjs so the content check, the Open Graph
// generator, and the Open Graph drift check all read the content layer the
// same way. Three copies of this would have been three chances for one of them
// to load something slightly different.

import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export function loadContent(root = process.cwd()) {
  const outDir = path.join(os.tmpdir(), `sagitta-content-${process.pid}-${Date.now()}`);
  const tsc = require.resolve("typescript/lib/tsc.js");

  execFileSync(
    process.execPath,
    [
      tsc,
      path.join(root, "src", "content", "index.ts"),
      "--outDir", outDir,
      "--module", "commonjs",
      "--target", "es2022",
      "--moduleResolution", "node",
      "--skipLibCheck",
      "--esModuleInterop",
    ],
    { stdio: "inherit" },
  );

  try {
    return require(path.join(outDir, "index.js"));
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
}
