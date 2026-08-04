// Compiles TypeScript entry points to CommonJS and requires them.
//
// The content layer and the pure logic modules under src/lib are plain typed
// code with no runtime dependencies, so they can be compiled with the
// TypeScript already in devDependencies and required directly. This is what
// lets the validator and the unit tests exercise the *same* values and
// functions the pages import, rather than a parallel copy that could drift.

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import Module from "node:module";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/**
 * TypeScript resolves the `@/*` alias when typechecking but emits the specifier
 * unchanged, so the compiled CommonJS still asks for `@/content/systems`. This
 * teaches Node's resolver to map that prefix onto the compiled output for the
 * duration of the load, which keeps the source using the project's own import
 * style instead of bending it to suit the test harness.
 *
 * @returns {() => void} restores the original resolver
 */
function withAliasResolution(outDir) {
  const original = Module._resolveFilename;

  Module._resolveFilename = function (request, ...rest) {
    if (typeof request === "string" && request.startsWith("@/")) {
      return original.call(this, path.join(outDir, request.slice(2)), ...rest);
    }
    return original.call(this, request, ...rest);
  };

  return () => {
    Module._resolveFilename = original;
  };
}

/**
 * Compiles every entry in one pass and returns their exports, keyed by the
 * src-relative path that was requested.
 *
 * @param {string[]} entries  Paths to .ts entry points, relative to the repo root.
 * @param {string}   label    Names the temporary output directory.
 * @returns {Record<string, any>}
 */
export function loadTsModules(entries, label) {
  const root = process.cwd();
  const workDir = path.join(os.tmpdir(), `sagitta-${label}-${process.pid}`);
  const outDir = path.join(workDir, "out");
  const tsc = require.resolve("typescript/lib/tsc.js");

  mkdirSync(workDir, { recursive: true });

  // A generated project file rather than CLI flags: the source uses the `@/*`
  // path alias throughout, and `--paths` has no command-line equivalent. Every
  // path is absolute so the config's own location does not matter.
  const configPath = path.join(workDir, "tsconfig.json");
  writeFileSync(
    configPath,
    JSON.stringify(
      {
        compilerOptions: {
          outDir,
          // Preserves the src-relative layout inside outDir, so a compiled
          // path is predictable no matter how many entries were passed.
          rootDir: path.join(root, "src"),
          baseUrl: root,
          paths: { "@/*": ["src/*"] },
          module: "commonjs",
          target: "es2022",
          moduleResolution: "node",
          skipLibCheck: true,
          esModuleInterop: true,
          resolveJsonModule: true,
        },
        files: entries.map((entry) => path.join(root, entry)),
      },
      null,
      2,
    ),
  );

  execFileSync(process.execPath, [tsc, "-p", configPath], { stdio: "inherit" });

  const restore = withAliasResolution(outDir);

  try {
    const loaded = {};
    for (const entry of entries) {
      const compiled = path.join(
        outDir,
        path.relative("src", entry).replace(/\.ts$/, ".js"),
      );
      loaded[entry] = require(compiled);
    }
    return loaded;
  } finally {
    restore();
    // Safe once every entry is required: CommonJS resolves the whole graph
    // synchronously, so nothing is left to read from disk.
    rmSync(workDir, { recursive: true, force: true });
  }
}
