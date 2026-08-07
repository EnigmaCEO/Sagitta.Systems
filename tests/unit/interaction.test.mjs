// Focused interaction tests — the logic half.
//
// Phase 3 introduced real interactive behaviour: a modal navigation drawer with
// a focus trap, two filtered directories, and a constellation. The rules those
// components depend on are extracted into pure modules under src/lib precisely
// so they can be tested here without a browser, a DOM library, or a React
// renderer — no test dependency was added to the project.
//
// The rendered half of the same behaviour is asserted against the real static
// export in tests/export/. Between them they cover the interaction surface
// this phase introduced.
//
// Run: npm run test

import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import { loadTsModules } from "../../scripts/lib/load-ts.mjs";

const modules = loadTsModules(
  ["src/lib/nav.ts", "src/lib/filters.ts", "src/lib/constellation.ts", "src/content/index.ts"],
  "unit-tests",
);

const { isActiveRoute, nextTrapIndex } = modules["src/lib/nav.ts"];
const { ALL, applySelection, facetCount, isFiltered, matchesSelection } =
  modules["src/lib/filters.ts"];
const { constellationData, CONSTELLATION_WIDTH, CONSTELLATION_HEIGHT } =
  modules["src/lib/constellation.ts"];
const content = modules["src/content/index.ts"];

// ─── Navigation ──────────────────────────────────────────────────────────────

describe("navigation route matching", () => {
  it("marks the exact route active", () => {
    assert.equal(isActiveRoute("/systems", "/systems"), true);
    assert.equal(isActiveRoute("/newsroom", "/newsroom"), true);
  });

  it("marks a parent route active for its detail pages", () => {
    assert.equal(isActiveRoute("/systems/sagitta-radar", "/systems"), true);
    assert.equal(isActiveRoute("/newsroom/sagitta-defense-now-operating", "/newsroom"), true);
  });

  it("does not treat home as a prefix of every route", () => {
    assert.equal(isActiveRoute("/systems", "/"), false);
    assert.equal(isActiveRoute("/", "/"), true);
  });

  it("does not match a sibling route that shares a prefix", () => {
    assert.equal(isActiveRoute("/press-kit", "/press"), false);
  });

  it("marks exactly one primary nav item active on every primary route", () => {
    for (const route of content.primaryNav) {
      const active = content.primaryNav.filter((link) => isActiveRoute(route.href, link.href));
      assert.equal(active.length, 1, `${route.href} matched ${active.length} nav items`);
      assert.equal(active[0].href, route.href);
    }
  });
});

// ─── Mobile drawer focus trap ────────────────────────────────────────────────

describe("mobile menu focus trap", () => {
  it("wraps forward from the last element to the first", () => {
    assert.equal(nextTrapIndex({ count: 5, activeIndex: 4, shiftKey: false }), 0);
  });

  it("wraps backward from the first element to the last", () => {
    assert.equal(nextTrapIndex({ count: 5, activeIndex: 0, shiftKey: true }), 4);
  });

  it("pulls focus back in when it has escaped the trap", () => {
    assert.equal(nextTrapIndex({ count: 5, activeIndex: -1, shiftKey: true }), 4);
  });

  it("leaves ordinary movement to the browser", () => {
    assert.equal(nextTrapIndex({ count: 5, activeIndex: 2, shiftKey: false }), null);
    assert.equal(nextTrapIndex({ count: 5, activeIndex: 2, shiftKey: true }), null);
  });

  it("does nothing when the drawer holds no focusable elements", () => {
    assert.equal(nextTrapIndex({ count: 0, activeIndex: -1, shiftKey: false }), null);
  });

  it("keeps focus on a single focusable element in both directions", () => {
    assert.equal(nextTrapIndex({ count: 1, activeIndex: 0, shiftKey: false }), 0);
    assert.equal(nextTrapIndex({ count: 1, activeIndex: 0, shiftKey: true }), 0);
  });
});

// ─── Systems directory filters ───────────────────────────────────────────────

describe("systems directory filters", () => {
  const items = content.publicSystems.map((s) => ({
    slug: s.slug,
    family: s.family,
    status: s.status,
  }));
  const unfiltered = { family: ALL, status: ALL };

  it("returns all eight systems unfiltered", () => {
    assert.equal(applySelection(items, unfiltered).length, 8);
    assert.equal(isFiltered(unfiltered), false);
  });

  it("filters by family", () => {
    const selection = { family: "continuity-defense", status: ALL };
    const result = applySelection(items, selection);
    assert.equal(result.length, 3);
    assert.ok(result.every((i) => i.family === "continuity-defense"));
    assert.equal(isFiltered(selection), true);
  });

  it("filters by operating state", () => {
    const selection = { family: ALL, status: "Operating" };
    const result = applySelection(items, selection);
    assert.ok(result.length > 0);
    assert.ok(result.every((i) => i.status === "Operating"));
  });

  it("combines family and state", () => {
    const selection = { family: "capital-infrastructure", status: "Public Test" };
    const result = applySelection(items, selection);
    assert.deepEqual(
      result.map((i) => i.slug),
      ["sagitta-protocol"],
    );
  });

  it("returns an empty result for a genuinely empty combination", () => {
    // No Continuity system is in Public Test, so this filter legitimately
    // returns nothing — which is the only case the empty state may appear in.
    const result = applySelection(items, {
      family: "continuity-defense",
      status: "Public Test",
    });
    assert.equal(result.length, 0);
  });

  it("never shows a facet count that selecting the facet would not return", () => {
    const families = [...new Set(items.map((i) => i.family))];
    const states = [...new Set(items.map((i) => i.status))];

    for (const family of [ALL, ...families]) {
      for (const status of [ALL, ...states]) {
        const selection = { family, status };

        for (const option of [ALL, ...families]) {
          const promised = facetCount(items, selection, "family", option);
          const actual = applySelection(items, { ...selection, family: option }).length;
          assert.equal(
            promised,
            actual,
            `family="${option}" promised ${promised} from ${JSON.stringify(selection)}, returns ${actual}`,
          );
        }

        for (const option of [ALL, ...states]) {
          const promised = facetCount(items, selection, "status", option);
          const actual = applySelection(items, { ...selection, status: option }).length;
          assert.equal(
            promised,
            actual,
            `status="${option}" promised ${promised} from ${JSON.stringify(selection)}, returns ${actual}`,
          );
        }
      }
    }
  });
});

// ─── Newsroom filters ────────────────────────────────────────────────────────

describe("newsroom filters", () => {
  const entries = content.publishedEntries.map((e) => ({
    slug: e.slug,
    desk: e.desk,
    mediaType: e.mediaType,
    systems: [e.systemSlug, ...(e.relatedSystems ?? [])].filter(Boolean),
    period: e.publishedAt ? e.publishedAt.slice(0, 4) : "undated",
  }));
  const unfiltered = { desk: ALL, mediaType: ALL, systems: ALL, period: ALL };

  it("only ever sees published records", () => {
    assert.equal(entries.length, content.publishedEntries.length);
    const publishedSlugs = new Set(content.publishedEntries.map((e) => e.slug));
    for (const entry of content.newsroomEntries) {
      const live = entry.publicationState === "published" && entry.visibility === "public";
      assert.equal(
        publishedSlugs.has(entry.slug),
        live,
        `"${entry.slug}" is ${live ? "live but missing from" : "not live but present in"} the feed`,
      );
    }
  });

  it("filters by desk", () => {
    const result = applySelection(entries, { ...unfiltered, desk: "policy-notes" });
    assert.equal(result.length, 4);
    assert.ok(result.every((e) => e.desk === "policy-notes"));
  });

  it("filters by media type", () => {
    const result = applySelection(entries, { ...unfiltered, mediaType: "System Update" });
    assert.ok(result.length > 0);
    assert.ok(result.every((e) => e.mediaType === "System Update"));
  });

  it("matches a record on any related system, not only its primary one", () => {
    const result = applySelection(entries, {
      ...unfiltered,
      systems: "sagitta-continuity-engine",
    });
    assert.ok(
      result.some((e) => e.systems[0] !== "sagitta-continuity-engine"),
      "expected at least one match through relatedSystems",
    );
  });

  it("filters by publication period", () => {
    const result = applySelection(entries, { ...unfiltered, period: "2026" });
    assert.ok(result.length > 0);
    assert.ok(result.every((e) => e.period === "2026"));
  });

  it("publishes Allocation Read 001 canonically and relates it to Selun", () => {
    const entry = content.getNewsroomEntry("what-aggressive-means-in-a-defensive-market");
    assert.ok(entry, "Allocation Read 001 is missing");
    assert.equal(content.getDeskName(entry.desk), "Allocation Desk");
    assert.equal(entry.seriesLabel, "Allocation Read 001");
    assert.equal(entry.systemSlug, "selun");
    assert.equal(entry.externalUrl, undefined, "the canonical report points off-site");
    assert.equal(entry.mediaType, "Report");
    assert.equal(
      entry.body.filter((block) => typeof block !== "string" && block.kind === "table").length,
      3,
      "the report's comparison tables are not all represented",
    );
    assert.ok(
      content.entriesForSystem("selun").some((item) => item.slug === entry.slug),
      "the Selun system page cannot discover Allocation Read 001",
    );
  });

  it("keeps undated records reachable through their own bucket", () => {
    const undated = entries.filter((e) => e.period === "undated");
    const result = applySelection(entries, { ...unfiltered, period: "undated" });
    assert.equal(result.length, undated.length);
  });

  it("never shows a facet count that selecting the facet would not return", () => {
    const axes = {
      desk: [...new Set(entries.map((e) => e.desk))],
      mediaType: [...new Set(entries.map((e) => e.mediaType))],
      systems: [...new Set(entries.flatMap((e) => e.systems))],
      period: [...new Set(entries.map((e) => e.period))],
    };

    for (const [axis, options] of Object.entries(axes)) {
      for (const option of [ALL, ...options]) {
        const promised = facetCount(entries, unfiltered, axis, option);
        const actual = applySelection(entries, { ...unfiltered, [axis]: option }).length;
        assert.equal(promised, actual, `${axis}="${option}": ${promised} promised, ${actual} actual`);
      }
    }
  });

  it("excludes a record from an axis it has no value on", () => {
    const networkWide = entries.find((e) => e.systems.length === 0);
    if (!networkWide) return;
    assert.equal(matchesSelection(networkWide, { systems: "aaa" }), false);
  });
});

// ─── Constellation ───────────────────────────────────────────────────────────

describe("system constellation", () => {
  const data = constellationData();

  it("has one node per public system", () => {
    assert.equal(data.nodes.length, 8);
    assert.deepEqual(
      data.nodes.map((n) => n.slug).sort(),
      content.publicSystems.map((s) => s.slug).sort(),
    );
  });

  it("gives every node the information the panel and the list both need", () => {
    for (const node of data.nodes) {
      assert.ok(node.name, `${node.slug}: no name`);
      assert.ok(node.summary, `${node.slug}: no summary`);
      assert.ok(node.status, `${node.slug}: no operating state`);
      assert.ok(node.familyName, `${node.slug}: no family`);
    }
  });

  it("keeps every node inside the coordinate space", () => {
    for (const node of data.nodes) {
      assert.ok(node.x > 0 && node.x < CONSTELLATION_WIDTH, `${node.slug}: x out of bounds`);
      assert.ok(node.y > 0 && node.y < CONSTELLATION_HEIGHT, `${node.slug}: y out of bounds`);
    }
  });

  it("does not overlap two nodes", () => {
    for (let i = 0; i < data.nodes.length; i += 1) {
      for (let j = i + 1; j < data.nodes.length; j += 1) {
        const a = data.nodes[i];
        const b = data.nodes[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        assert.ok(distance > 90, `${a.slug} and ${b.slug} are ${distance.toFixed(0)}px apart`);
      }
    }
  });

  it("draws every edge between two real nodes, with a stated reason", () => {
    const slugs = new Set(data.nodes.map((n) => n.slug));
    for (const edge of data.edges) {
      assert.ok(slugs.has(edge.from), `edge from unknown "${edge.from}"`);
      assert.ok(slugs.has(edge.to), `edge to unknown "${edge.to}"`);
      assert.notEqual(edge.from, edge.to);
      assert.ok(edge.reason.length > 14, `edge ${edge.from}→${edge.to} has no reason`);
    }
  });

  it("draws each pair only once", () => {
    const keys = data.edges.map((e) => [e.from, e.to].sort().join("::"));
    assert.equal(new Set(keys).size, keys.length, "an edge pair is drawn twice");
  });

  it("connects the whole network — no node is stranded", () => {
    // A node with no edges would render as an unexplained dot, which would
    // undercut the claim the graphic exists to make.
    for (const node of data.nodes) {
      const degree = data.edges.filter((e) => e.from === node.slug || e.to === node.slug).length;
      assert.ok(degree > 0, `${node.slug} has no connections`);
    }
  });

  it("links the three families to each other", () => {
    const cross = data.edges.filter((e) => e.crossFamily);
    assert.ok(cross.length >= 2, "families are not connected to one another");
  });
});

// ─── State-aware calls to action ─────────────────────────────────────────────

describe("state-aware calls to action", () => {
  it("gives every system a primary action", () => {
    for (const system of content.publicSystems) {
      assert.ok(system.primaryAction, `${system.slug}: no primary action`);
      assert.ok(system.primaryAction.id, `${system.slug}: action has no analytics id`);
      assert.ok(system.primaryAction.label, `${system.slug}: action has no label`);
    }
  });

  it("never offers to open a product that is not operating", () => {
    for (const system of content.publicSystems) {
      if (system.primaryAction.type !== "open-product") continue;
      assert.equal(
        system.status,
        "Operating",
        `${system.slug} is ${system.status} but offers an open-product action`,
      );
    }
  });

  it("matches every action's label to what the state actually allows", () => {
    const forbidden = /\b(buy|purchase|sign up|start your|get started|launch)\b/i;
    for (const system of content.publicSystems) {
      for (const action of [system.primaryAction, system.secondaryAction].filter(Boolean)) {
        if (system.status === "Operating") continue;
        assert.doesNotMatch(
          action.label,
          forbidden,
          `${system.slug} (${system.status}): "${action.label}" over-promises`,
        );
      }
    }
  });

  it("marks every absolute destination as external and every internal one as not", () => {
    const actions = content.publicSystems.flatMap((s) =>
      [s.primaryAction, s.secondaryAction].filter(Boolean),
    );
    for (const action of actions) {
      const absolute = /^https?:\/\//.test(action.href);
      assert.equal(
        Boolean(action.external),
        absolute,
        `"${action.id}" — external=${action.external} for href ${action.href}`,
      );
    }
  });

  it("keeps every analytics identifier unique", () => {
    const ids = [
      ...content.publicSystems.flatMap((s) =>
        [s.primaryAction, s.secondaryAction].filter(Boolean).map((a) => a.id),
      ),
      ...content.capabilities.filter((c) => c.primaryAction).map((c) => c.primaryAction.id),
    ];
    assert.equal(new Set(ids).size, ids.length, "duplicate CTA identifier");
  });

  it("covers the journeys analytics needs to distinguish", () => {
    const types = new Set(
      content.publicSystems.flatMap((s) =>
        [s.primaryAction, s.secondaryAction].filter(Boolean).map((a) => a.type),
      ),
    );
    for (const required of ["open-product", "documentation", "defense-review", "partnership"]) {
      assert.ok(types.has(required), `no system publishes a "${required}" action`);
    }
  });

  it("keeps the Defense Review's fixed engagement price accurate", () => {
    const defense = content.getSystem("sagitta-defense");
    assert.match(defense.primaryAction.note, /\$3,000/);
    assert.equal(defense.primaryAction.type, "defense-review");
  });
});

// ─── Promotions ──────────────────────────────────────────────────────────────

describe("promotion model", () => {
  it("models all thirteen promotional formats", () => {
    assert.equal(content.promotionFormats.length, 13);
    assert.equal(new Set(content.promotionFormats.map((f) => f.id)).size, 13);
    for (const format of content.promotionFormats) {
      assert.ok(format.label, `${format.id}: no label`);
      assert.ok(format.stages.length > 0, `${format.id}: no stage`);
    }
  });

  it("keeps format, channel, and placement as separate concepts", () => {
    // A format is a subject, a channel is a location, a placement is a stage.
    // Nothing collapses two of them into one value.
    const formats = new Set(content.promotionFormats.map((f) => f.id));
    const placements = new Set(content.promotionFormats.flatMap((f) => f.stages));
    for (const promotion of content.promotions) {
      assert.ok(formats.has(promotion.format), `${promotion.id}: unknown format`);
      assert.ok(placements.has(promotion.placement), `${promotion.id}: unknown placement`);
      assert.notEqual(promotion.format, promotion.placement);
      assert.notEqual(promotion.format, promotion.channel);
    }
  });

  it("maps all eight decision lenses onto real systems", () => {
    assert.equal(content.decisionLenses.length, 8);
    const slugs = new Set([
      ...content.systems.map((s) => s.slug),
      ...content.capabilities.map((c) => c.slug),
    ]);
    for (const lens of content.decisionLenses) {
      assert.ok(lens.systemSlugs.length > 0, `${lens.id}: routes nowhere`);
      for (const slug of lens.systemSlugs) {
        assert.ok(slugs.has(slug), `${lens.id}: unknown system "${slug}"`);
      }
    }
  });

  it("renders only active, published, public promotions", () => {
    for (const promotion of content.activePromotions) {
      assert.equal(promotion.state, "active", `${promotion.id}: archived but rendering`);
      assert.equal(promotion.publicationState, "published");
      assert.equal(promotion.visibility, "public");
      assert.equal(promotion.verification.status, "verified");
    }
    const active = new Set(content.activePromotions.map((p) => p.id));
    for (const promotion of content.archivedPromotions) {
      assert.ok(!active.has(promotion.id), `${promotion.id}: archived promotion leaked`);
    }
  });

  it("holds four to six formats on the front page at once", () => {
    const formats = new Set(content.activePromotions.map((p) => p.format));
    assert.ok(formats.size >= 4 && formats.size <= 6, `${formats.size} formats are active`);
  });

  it("orders each placement editorially rather than by date", () => {
    for (const placement of [
      "lead-carousel",
      "signal-strip",
      "product-feature",
      "video-feature",
      "network-headlines",
      "cinematic-feature",
    ]) {
      const staged = content.promotionsAt(placement);
      const priorities = staged.map((p) => p.priority);
      assert.deepEqual(priorities, [...priorities].sort((a, b) => a - b), `${placement}: unordered`);
      assert.equal(new Set(priorities).size, priorities.length, `${placement}: duplicate priority`);
    }

    // The lead story is the Radar launch by editorial choice, not the newest
    // record — the 30 July LinkedIn article carries a later date and sits third.
    const lead = content.promotionsAt("lead-carousel")[0];
    assert.equal(lead.id, "radar-launched");
    const newest = [...content.activePromotions]
      .filter((p) => p.publishedAt)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];
    assert.notEqual(lead.id, newest.id, "the lead story is just the newest record");
  });

  it("keeps one dominant item per single-item stage", () => {
    for (const placement of ["product-feature", "cinematic-feature"]) {
      assert.ok(content.promotionsAt(placement).length <= 1, `${placement}: more than one item`);
    }
    assert.ok(content.promotionsAt("video-feature").length <= 2, "more than two featured videos");
  });

  it("dates every snapshot, and dates no rollup", () => {
    const signals = content.activePromotions.filter((p) => p.signal);
    assert.ok(signals.length > 0, "no signal is published");
    for (const promotion of signals) {
      const signal = promotion.signal;
      assert.equal(promotion.format, "live-signal", `${promotion.id}: value on a non-signal`);
      assert.equal(typeof signal.snapshot, "boolean");
      assert.equal(
        signal.snapshot,
        signal.reading === "snapshot",
        `${promotion.id}: the reading and the snapshot flag disagree`,
      );
      if (signal.reading === "snapshot") {
        // The original guard, unchanged: a moving reading carries its date.
        assert.ok(signal.asOf, `${promotion.id}: undated snapshot`);
      } else {
        // A standing figure was never frozen, so it has no as-of date to give.
        assert.equal(signal.asOf, null, `${promotion.id}: a rollup carries an as-of date`);
      }
    }

    const incidents = content.getPromotion("sce-incidents-tracked");
    assert.equal(incidents.signal.reading, "snapshot");
    assert.equal(incidents.signal.asOf, "2026-07-29");
  });

  it("publishes the Radar figure as an undated rollup at a threshold", () => {
    // The value the product displays keeps moving. It is published as a live
    // rollup at an approved threshold: never to the digit, and never dated.
    const radar = content.getPromotion("radar-infrastructure-monitored");
    assert.equal(radar.signal.reading, "rollup");
    assert.equal(radar.signal.snapshot, false);
    assert.equal(radar.signal.asOf, null, "the live rollup is dated");
    assert.equal(radar.signal.value, "Over $300B");
    assert.equal(radar.signal.metric, "Infrastructure monitored by Sagitta Radar");

    // The fluctuating precise figure is nowhere in the collection.
    const everything = JSON.stringify(content.promotions);
    assert.doesNotMatch(everything, /328[.,]393/, "the changing precise figure is stored");
    assert.doesNotMatch(everything, /\$3\d\d\.\d+M/, "a precise moving figure is stored");
  });

  it("never promises more than an operating state supports", () => {
    for (const promotion of content.activePromotions) {
      const primary = content.getSystem(promotion.systemSlugs[0]);
      if (promotion.action.type !== "open-product") continue;
      assert.equal(
        primary?.status,
        "Operating",
        `${promotion.id}: opens a "${primary?.status}" system`,
      );
    }

    const protocol = content.getPromotion("protocol-arc-testnet");
    assert.equal(content.getSystem("sagitta-protocol").status, "Public Test");
    assert.equal(protocol.action.type, "demonstration");
    assert.match(protocol.action.note, /No mainnet deployment/);
  });

  it("gives every promotion a real destination and a specific action", () => {
    const generic = /^(learn more|read more|see more|click here|explore|get started)$/i;
    for (const promotion of content.promotions) {
      assert.ok(promotion.action.href, `${promotion.id}: no destination`);
      assert.doesNotMatch(promotion.action.label, generic, `${promotion.id}: generic label`);
      const absolute = /^https?:\/\//.test(promotion.action.href);
      assert.equal(
        Boolean(promotion.action.external),
        absolute,
        `${promotion.id}: external flag does not match the href`,
      );
      assert.ok(promotion.action.id.startsWith("promo:"), `${promotion.id}: unnamespaced action id`);
    }
  });

  it("describes every image for what it actually is", () => {
    for (const promotion of content.promotions) {
      if (!promotion.media) continue;
      assert.ok(promotion.media.src, `${promotion.id}: media with no source`);
      assert.equal(
        typeof promotion.media.alt,
        "string",
        `${promotion.id}: media without alternative text`,
      );
      // Nothing may claim to be a product screenshot: no approved interface
      // capture exists yet, so a mark is published as a mark.
      assert.notEqual(
        promotion.media.kind,
        "product-screenshot",
        `${promotion.id}: publishes an interface capture that does not exist`,
      );
    }
  });

  it("publishes no promotion for a format with no real asset", () => {
    // Market reactions, audio briefings, case studies, external coverage, and
    // event appearances all require material Sagitta has not produced. The
    // formats stay in the model; the collection stays empty until they are
    // real. Video and social left this list on 2026-07-31, when a real video
    // and real posts entered the record.
    const unpublished = [
      "use-case",
      "audio-briefing",
      "case-study",
      "external-coverage",
      "event-appearance",
    ];
    for (const format of unpublished) {
      const found = content.promotions.filter((p) => p.format === format);
      assert.equal(found.length, 0, `${format}: ${found.length} record(s) with no verified asset`);
    }
  });

  it("keeps the lead story and the closing feature on different systems", () => {
    // The page opens and closes on the network, not twice on one system.
    const lead = content.promotionsAt("lead-carousel")[0];
    const feature = content.promotionsAt("cinematic-feature")[0];
    assert.notEqual(
      lead.systemSlugs[0],
      feature.systemSlugs[0],
      "the closing feature promotes the same system as the lead story",
    );
  });

  it("routes every promotion into at least one system and one lens", () => {
    for (const promotion of content.promotions) {
      assert.ok(promotion.systemSlugs.length > 0, `${promotion.id}: routes into no system`);
      assert.ok(promotion.lens.length > 0, `${promotion.id}: carries no decision lens`);
      for (const lens of promotion.lens) {
        assert.ok(
          content.systemsForLens(lens).length > 0,
          `${promotion.id}: lens "${lens}" routes nowhere`,
        );
      }
    }
  });
});

// ─── The Watch stage and the product interface ───────────────────────────────

describe("the Watch stage's editorial record", () => {
  const programme = content.forthcomingProgramme;

  it("keeps the forthcoming programme in the content layer, not in markup", () => {
    assert.ok(programme, "no forthcoming programme record exists");
    assert.equal(programme.programme, "Sagitta Defense Review");
    assert.equal(programme.status, "First episode forthcoming");
    assert.equal(programme.verification.status, "verified");
  });

  it("stays an announcement rather than an episode", () => {
    // It is `upcoming`, not `published`, and carries none of the fields an
    // episode would: no duration, no poster URL off-site, no video source.
    assert.equal(programme.publicationState, "upcoming");
    assert.equal("duration" in programme, false, "the forthcoming programme states a runtime");
    assert.ok(programme.poster.src.startsWith("/"), "the poster is not an approved local asset");
    assert.ok(programme.poster.alt.length > 20, "the poster has no real description");
  });

  it("sends a reader only to a Sagitta page that already exists", () => {
    assert.equal(programme.action.href, "/systems/sagitta-defense");
    assert.ok(!programme.action.external, "the forthcoming stage links off-site");
    assert.ok(
      content.getSystem("sagitta-defense"),
      "the Watch destination is not a real system record",
    );
  });

  it("is superseded by a real episode rather than sitting beside one", () => {
    // A real episode now exists, so the stage renders it and this record does
    // not render at all. It stays accurate rather than being deleted: the
    // Defense Review programme really is announced and really has published
    // nothing, and the Selun video is not one of its episodes.
    const staged = content.promotionsAt("video-feature");
    assert.ok(staged.length >= 1, "the Watch stage holds no episode");
    assert.equal(staged[0].id, "introducing-selun-video");
    assert.equal(programme.publicationState, "upcoming", "the programme claims to have published");
    for (const video of staged) {
      assert.notEqual(
        video.systemSlugs[0],
        "sagitta-defense",
        `${video.id}: a live video is attributed to the Defense Review programme`,
      );
    }
  });

  it("plays only videos that really exist on the channel", () => {
    // Every staged video carries a real poster, a real destination, and an
    // embed id that matches that destination — so the thing that plays in place
    // and the thing a reader is sent to are the same video.
    const staged = content.promotionsAt("video-feature");
    for (const video of staged) {
      assert.equal(video.format, "video-episode", `${video.id}: not a video`);
      assert.equal(video.channel, "youtube");
      assert.ok(video.media?.src, `${video.id}: no poster`);
      assert.ok(video.action.external, `${video.id}: destination is not external`);
      if (video.media.embed) {
        assert.equal(video.media.embed.provider, "youtube");
        assert.ok(
          video.action.href.includes(video.media.embed.id),
          `${video.id}: plays a different video from the one it links to`,
        );
      }
    }

    const protocol = content.getPromotion("protocol-overview-video");
    assert.equal(
      protocol.headline,
      "Sagitta Protocol Overview | Trustless Wealth Management Infrastructure",
    );
    assert.equal(protocol.publishedAt, "2026-04-18");
    // No runtime was published for this one, so none is recorded. The stage
    // renders a runtime only where the source states it.
    assert.equal(protocol.media.duration, undefined, "an unread runtime was invented");
  });

  it("publishes the real episode with only metadata its source states", () => {
    const video = content.getPromotion("introducing-selun-video");
    assert.equal(video.headline, "Introducing Selun", "the exact video title is not recorded");
    assert.equal(video.channel, "youtube");
    assert.equal(video.systemSlugs[0], "selun");
    // The channel feed's own timestamp, which is what a reader checking the
    // video sees. Resolved 2026-08-02: the owner-supplied 2026-03-19 was a
    // production date and is deliberately not published.
    assert.equal(video.publishedAt, "2026-03-28");
    assert.equal(video.media.duration, "0:41");
    assert.equal(video.media.kind, "video-thumbnail");
    assert.equal(video.action.href, "https://www.youtube.com/watch?v=SHecO67AqfM");
    assert.ok(video.action.external, "the YouTube destination is not marked external");

    // No view count exists on the record, because none was read.
    assert.doesNotMatch(JSON.stringify(video), /\bviews?\b/i, "a view count is published");
  });
});

describe("the Selun product interface", () => {
  const surface = content.selunInterface;

  it("is built from the production wizard's own labels", () => {
    assert.equal(surface.stages.length, 7, "the wizard runs seven processing steps");
    assert.equal(surface.stages[0].label, "Reviewing Market Condition");
    assert.equal(surface.stages[6].label, "Preparing Certified Decision Report");
    assert.deepEqual(surface.controls[0].options, [
      "Conservative",
      "Balanced",
      "Growth",
      "Aggressive",
    ]);
    assert.equal(surface.segments.length, 4);
    assert.ok(surface.stages.some((s) => s.key === surface.activeStage), "no step is running");
  });

  it("shows the surface and never a result", () => {
    // A run produces an allocation for the reader who made it. None is
    // published here, so nothing in the record may read as an output.
    const values = JSON.stringify(surface);
    assert.doesNotMatch(values, /\d+%/, "the interface publishes an allocation percentage");
    assert.doesNotMatch(values, /\$[\d,]/, "the interface publishes a portfolio value");
    assert.match(surface.caption, /Not a session capture/);
    assert.equal(surface.verification.status, "verified");
  });
});

// ─── Identity and naming ─────────────────────────────────────────────────────

describe("identity and naming rules", () => {
  const forbidden = [
    /\bRadar\s+by\s+Sagitta\s+Labs\b/i,
    /\bSagitta\s+Radar\s+by\s+Sagitta\s+Labs\b/i,
    /\bDeveloped\s+by\s+Sagitta\s+Systems\b/i,
  ];

  /** Every string a record could render. Editorial notes are excluded. */
  function publicStrings(value, key = "") {
    if (typeof value === "string") return key === "note" || key === "source" ? [] : [value];
    if (Array.isArray(value)) return value.flatMap((v) => publicStrings(v, key));
    if (value && typeof value === "object") {
      return Object.entries(value).flatMap(([k, v]) =>
        k === "verification" ? [] : publicStrings(v, k),
      );
    }
    return [];
  }

  it("publishes no product-level Labs attribution", () => {
    const records = [
      ...content.systems,
      ...content.capabilities,
      ...content.newsroomEntries,
      ...content.roadmapItems,
    ];
    for (const record of records) {
      for (const text of publicStrings(record)) {
        for (const pattern of forbidden) {
          assert.doesNotMatch(text, pattern, `"${record.slug ?? record.id}" carries attribution`);
        }
      }
    }
  });

  it("carries no attribution field on any system record", () => {
    for (const system of content.systems) {
      assert.equal("attribution" in system, false, `${system.slug} still has an attribution field`);
    }
  });

  it("keeps Sagitta Radar under its exact product name", () => {
    const radar = content.getSystem("sagitta-radar");
    assert.equal(radar.name, "Sagitta Radar");
  });

  it("publishes exactly one leadership profile", () => {
    assert.equal(content.publicPeople.length, 1);
    assert.equal(content.publicPeople[0].name, "Xavier D. Moore");
  });

  it("keeps the Sagitta Labs aliases out of the public people collection", () => {
    const names = content.people.map((p) => p.name);
    for (const alias of ["Orion Gray", "Alexander Roth"]) {
      assert.ok(!names.includes(alias), `${alias} reappeared in the people collection`);
    }
    assert.ok(content.sagittaLabsAliases.length > 0, "alias provenance was lost");
  });

  it("does not describe Sagitta Labs as an incorporated entity", () => {
    const labs = content.identityHierarchy.find((l) => l.name === "Sagitta Labs");
    assert.ok(labs, "Sagitta Labs is missing from the identity hierarchy");
    assert.match(labs.note, /rather than an incorporated entity/i);
  });
});

// ─── Taxonomy guards ─────────────────────────────────────────────────────────

describe("taxonomy is unchanged by the visual pass", () => {
  it("publishes exactly eight systems, three of them foundations", () => {
    assert.equal(content.systemCount, 8);
    assert.equal(content.coreSystems.length, 3);
    assert.equal(content.serviceSystems.length, 4);
    assert.equal(content.conceptSystems.length, 1);

    // Every service names the foundation it is attached to, and every parent
    // is a foundation rather than another service.
    for (const service of content.serviceSystems) {
      const parent = content.parentOf(service.slug);
      assert.ok(parent, `${service.slug}: names no foundation`);
      assert.equal(parent.systemKind, "core", `${service.slug}: parent is not a foundation`);
    }
    assert.deepEqual(
      content.servicesFor("sagitta-continuity-engine").map((s) => s.slug).sort(),
      ["sagitta-defense", "sagitta-radar"],
    );
    assert.deepEqual(content.servicesFor("aaa").map((s) => s.slug), ["selun"]);
    assert.deepEqual(content.servicesFor("sagitta-protocol").map((s) => s.slug), [
      "sagitta-banking",
    ]);
  });

  it("models Selun x402 as a capability of Selun, not a system", () => {
    assert.equal(content.getSystem("selun-x402"), undefined);
    const x402 = content.getCapability("selun-x402");
    assert.ok(x402, "Selun x402 is not modelled as a capability");
    assert.ok(x402.deliveredBy.includes("selun"), "x402 is not delivered through Selun");
    assert.ok(content.getSystem("selun").capabilitySlugs.includes("selun-x402"));

    // x402 promotions route into Selun and carry the capability as metadata.
    for (const promotion of content.promotions) {
      if (!(promotion.capabilitySlugs ?? []).includes("selun-x402")) continue;
      assert.equal(promotion.systemSlugs[0], "selun", `${promotion.id}: routes into a non-system`);
    }
  });

  it("keeps Sagitta Wallet at concept stage and never promotes it as operating", () => {
    const wallet = content.getSystem("sagitta-wallet");
    assert.equal(wallet.systemKind, "concept");
    assert.equal(wallet.status, "Research Horizon");
    for (const promotion of content.activePromotions) {
      assert.ok(
        !promotion.systemSlugs.includes("sagitta-wallet"),
        `${promotion.id}: promotes a concept-stage system`,
      );
    }
  });

  it("carries no Treasury Decision Desk anywhere in the content model", () => {
    assert.equal(content.getSystem("treasury-decision-desk"), undefined);
    assert.equal(content.getCapability("treasury-decision-desk"), undefined);
    for (const lens of content.decisionLenses) {
      assert.ok(
        !lens.systemSlugs.includes("treasury-decision-desk"),
        `lens "${lens.id}" still routes into the Treasury Decision Desk`,
      );
    }
    const everything = JSON.stringify([
      content.systems,
      content.capabilities,
      content.promotions,
      content.roadmapItems,
      content.newsroomEntries,
      content.pressSections,
      content.audienceRoutes,
      content.identityHierarchy,
    ]);
    assert.doesNotMatch(everything, /Treasury Decision Desk/i);
  });

  it("keeps Grants archived and Rebalancing a supporting capability", () => {
    const grants = content.getCapability("grants");
    const rebalancing = content.getCapability("rebalancing");
    assert.equal(grants.publicationState, "archived");
    assert.equal(rebalancing.publicationState, "published");
    assert.ok(!content.publicCapabilities.includes(grants));
    assert.ok(content.publicCapabilities.includes(rebalancing));
  });

  it("gives an archived capability no call to action", () => {
    assert.equal(content.getCapability("grants").primaryAction, undefined);
  });

  it("renders audio and video only where verified media exists", () => {
    for (const entry of content.newsroomEntries) {
      if (!entry.media) continue;
      assert.ok(entry.media.src, `${entry.slug}: media block with no source`);
      assert.equal(entry.verification.status, "verified", `${entry.slug}: unverified media`);
    }
  });
});

after(() => {
  // The loader compiles into a temp directory and removes it; nothing to do.
});
