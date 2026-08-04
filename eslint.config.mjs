import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/**
 * ESLint flat config.
 *
 * Next 16 removed the `next lint` command and `eslint-config-next` now ships
 * native flat config arrays, so this file spreads them directly. It previously
 * went through `FlatCompat`, which shims legacy `.eslintrc` shareable configs —
 * that shim cannot serialise the new config and throws a circular-structure
 * error on the plugin object. Nothing is extended in the old format any more,
 * so the shim is gone.
 *
 * Linting runs as `npm run lint` → `eslint .`, sequenced by `npm run verify`.
 * `next build` no longer runs it, so the verify chain is the only gate.
 */
const eslintConfig = [
  // Build output and dependencies. `next lint` used to ignore these for us;
  // the bare ESLint CLI does not.
  {
    ignores: ["out/**", ".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,

  /**
   * Every internal link goes through `@/components/Link`, which turns
   * prefetching off. Next 16's segment prefetch requests payload files that
   * `output: "export"` writes under different names, so every prefetch 404s —
   * see the component for the detail. Importing `next/link` directly would
   * silently reintroduce those requests on one page, which is exactly the kind
   * of thing nobody notices.
   */
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/link",
              message:
                "Import the site's Link from '@/components/Link' instead — it disables the prefetch that 404s on a static export.",
            },
          ],
        },
      ],
    },
  },
  // The wrapper is the one place that may import it.
  {
    files: ["src/components/Link.tsx"],
    rules: { "no-restricted-imports": "off" },
  },
];

export default eslintConfig;
