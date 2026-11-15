// Network glossary: every entry is linkable, sourced, and points somewhere real.
//
// Run: npm run test

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadTsModules } from "../../scripts/lib/load-ts.mjs";

const modules = loadTsModules(["src/content/index.ts"], "unit-tests-glossary");
const content = modules["src/content/index.ts"];
const { glossary, glossaryGroups, glossaryByGroup } = content;

const STATIC_ROUTES = new Set(["/status", "/press", "/documentation"]);

describe("glossary", () => {
  it("has unique, anchor-safe slugs and unique terms", () => {
    const slugs = glossary.map((e) => e.slug);
    assert.equal(new Set(slugs).size, slugs.length, "duplicate glossary slug");
    for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `bad slug ${slug}`);
    const terms = glossary.map((e) => e.term.toLowerCase());
    assert.equal(new Set(terms).size, terms.length, "duplicate glossary term");
  });

  it("never reuses an anchor between a term and a group section", () => {
    const groupAnchors = new Set(glossaryGroups.map((g) => `group-${g.id}`));
    for (const entry of glossary) assert.ok(!groupAnchors.has(entry.slug), `${entry.slug}: collides with a group anchor`);
  });

  it("places every entry in a known group, and every group has entries", () => {
    const groups = new Set(glossaryGroups.map((g) => g.id));
    for (const entry of glossary) assert.ok(groups.has(entry.group), `${entry.slug}: unknown group`);
    for (const group of glossaryGroups) assert.ok(glossaryByGroup(group.id).length > 0, `${group.id}: empty`);
  });

  it("resolves every related term", () => {
    const slugs = new Set(glossary.map((e) => e.slug));
    for (const entry of glossary) {
      for (const related of entry.related ?? []) {
        assert.ok(slugs.has(related), `${entry.slug}: related term ${related} does not exist`);
        assert.notEqual(related, entry.slug, `${entry.slug}: relates to itself`);
      }
    }
  });

  it("gives every definition a real source", () => {
    const newsroomSlugs = new Set(content.newsroomEntries.map((e) => e.slug));
    const systemSlugs = new Set(content.systems.map((s) => s.slug));
    for (const entry of glossary) {
      assert.ok(entry.definition.length > 20, `${entry.slug}: definition too short`);
      const { href, external } = entry.source;
      if (external) {
        assert.match(href, /^https:\/\//, `${entry.slug}: external source must be absolute https`);
        continue;
      }
      assert.ok(href.startsWith("/"), `${entry.slug}: internal source must be a site path`);
      const [, section, slug] = href.split("/");
      if (section === "newsroom") assert.ok(newsroomSlugs.has(slug), `${entry.slug}: no newsroom entry ${slug}`);
      else if (section === "systems") assert.ok(systemSlugs.has(slug), `${entry.slug}: no system ${slug}`);
      else assert.ok(STATIC_ROUTES.has(href), `${entry.slug}: unknown internal source ${href}`);
    }
  });
});
